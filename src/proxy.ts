import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { track } from '@vercel/analytics/server';

/**
 * This proxy (Next.js's successor to `middleware`) does two things for the
 * plain-markdown surface of the site (`/*.md` pages and `/llms.txt`):
 *
 *  1. OBSERVE. Agents fetch raw markdown/llms.txt and never execute the client
 *     beacon, so these reads are invisible to Vercel Web Analytics by design.
 *     We record each one as a `markdown_read` custom event.
 *
 *  2. NEGOTIATE. When a client requests an ordinary HTML page with
 *     `Accept: text/markdown`, we redirect it to that page's `.md` twin.
 *     A redirect (not a rewrite) is deliberate: the HTML response — and its
 *     CDN cache entry — is never altered, so human delivery is untouched and
 *     there's no risk of a markdown body being cached under the HTML URL.
 *
 * It also forwards AI bot and AI-referred requests to the internal ai-visibility
 * service (see `forwardToAiVisibility`). For that hook to see docs, blog, and
 * robots traffic, the `matcher` runs the proxy on every non-asset request. The
 * markdown logic above is still a no-op for ordinary HTML requests: branch 1
 * only fires on `/llms.txt` and `*.md`, and branch 2 only redirects when the
 * client explicitly sends `Accept: text/markdown`.
 * All tracking is pushed onto `event.waitUntil`, so responses are never blocked.
 */

// Lowercase substrings matched against the User-Agent. Covers the crawlers and
// on-demand fetchers that read markdown / llms.txt. Extend as new agents appear.
const AI_AGENT_SIGNATURES = [
  'gptbot',
  'oai-searchbot',
  'chatgpt-user',
  'claudebot',
  'claude-web',
  'claude-user',
  'anthropic-ai',
  'perplexitybot',
  'perplexity-user',
  'google-extended',
  'googleother',
  'gemini',
  'bytespider',
  'ccbot',
  'cohere-ai',
  'diffbot',
  'meta-externalagent',
  'facebookbot',
  'applebot-extended',
  'amazonbot',
  'youbot',
  'ai2bot',
  'timpibot',
  'omgili',
  'duckassistbot',
  'mistralai',
] as const;

// Pages with a `.md` twin. Keep in sync with the rewrites in `next.config.ts`.
const MARKDOWN_PAGES: Record<string, string> = {
  '/': '/index.md',
  '/pricing': '/pricing.md',
  '/about': '/about.md',
  '/startups': '/startups.md',
  '/yc': '/yc.md',
  '/blog': '/blog.md',
  '/case-studies': '/case-studies.md',
  '/glossary': '/glossary.md',
  '/changelog': '/changelog.md',
  '/policies/terms': '/policies/terms.md',
  '/policies/privacy': '/policies/privacy.md',
};

// Sections whose individual `/<section>/<slug>` items have a `.md` twin.
const MARKDOWN_SECTIONS = new Set(['blog', 'case-studies', 'glossary', 'changelog']);
// Sub-routes under those sections that are listings, not items (no `.md` twin).
const NON_ITEM_SEGMENTS = new Set(['category', 'page']);

// Bot tokens forwarded to ai-visibility. Differs from AI_AGENT_SIGNATURES above on
// purpose: this is the set the ai-visibility service verifies against vendor IP ranges,
// and the two lists are owned by different consumers. Do not merge them.
const BOT_TOKENS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Googlebot',
  'GoogleOther',
  'Google-Agent',
  'meta-externalagent',
  'meta-externalfetcher',
  'Bytespider',
  'Amazonbot',
  'Applebot',
  'CCBot',
  'DuckAssistBot',
  'MistralAI-User',
  'MistralAI-Index',
  'MistralAI-Training',
  'cohere-training-data-crawler',
  'GrokBot',
].map((t) => t.toLowerCase());

const AI_REFERERS = [
  'chatgpt.com',
  'chat.openai.com',
  'claude.ai',
  'perplexity.ai',
  'gemini.google.com',
  'bard.google.com',
  'copilot.microsoft.com',
  'bing.com/chat',
  'grok.com',
  'meta.ai',
  'deepseek.com',
  'chat.mistral.ai',
];

export function interesting(ua: string, referer: string, path: string): boolean {
  const u = ua.toLowerCase();
  if (BOT_TOKENS.some((t) => u.includes(t))) {
    return true;
  }
  const r = referer.toLowerCase();
  if (AI_REFERERS.some((h) => r.includes(h))) {
    return true;
  }
  return path.includes('utm_source=chatgpt') || path.includes('utm_source=perplexity');
}

// Copy AI bot / AI-referred requests to the ai-visibility ingest endpoint. Never
// awaited, never alters the response, inert when the env vars are unset.
function forwardToAiVisibility(event: NextFetchEvent, request: NextRequest): void {
  const ua = request.headers.get('user-agent') ?? '';
  const referer = request.headers.get('referer') ?? '';
  const path = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  if (!interesting(ua, referer, path)) {
    return;
  }
  // Unset or empty (as shipped in `.env.example`) both disable the hook.
  const url = process.env.AI_VIS_INGEST_URL;
  const secret = process.env.AI_VIS_INGEST_SECRET;
  if (!url || !secret) {
    return;
  }
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
  event.waitUntil(
    fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-ingest-secret': secret },
      body: JSON.stringify({
        ts: Date.now(),
        host: request.nextUrl.hostname,
        path,
        method: request.method,
        ua,
        ip,
        referer: referer || null,
      }),
    }).catch(() => undefined),
  );
}

function detectAgent(userAgent: string): string | null {
  const ua = userAgent.toLowerCase();
  return AI_AGENT_SIGNATURES.find((signature) => ua.includes(signature)) ?? null;
}

function prefersMarkdown(accept: string | null): boolean {
  return accept !== null && accept.toLowerCase().includes('text/markdown');
}

// Map an HTML page path to its `.md` twin, or null if it has none.
function toMarkdownPath(pathname: string): string | null {
  const normalized = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  if (normalized in MARKDOWN_PAGES) {
    return MARKDOWN_PAGES[normalized];
  }

  const parts = normalized.split('/').filter(Boolean);
  if (parts.length === 2 && MARKDOWN_SECTIONS.has(parts[0]) && !NON_ITEM_SEGMENTS.has(parts[1])) {
    return `/${parts[0]}/${parts[1]}.md`;
  }
  return null;
}

function trackMarkdownRead(
  event: NextFetchEvent,
  request: NextRequest,
  data: { path: string; surface: 'markdown' | 'llms' | 'negotiated'; agent: string | null },
) {
  event.waitUntil(
    track(
      'markdown_read',
      {
        path: data.path,
        surface: data.surface,
        agent: data.agent ?? 'other',
        isAgent: data.agent !== null,
      },
      { headers: request.headers },
    ).catch(() => {
      // Never let a telemetry failure affect the response.
    }),
  );
}

export function proxy(request: NextRequest, event: NextFetchEvent) {
  // Must run before branches 1 and 2, which return early.
  forwardToAiVisibility(event, request);

  const { pathname } = request.nextUrl;
  const agent = detectAgent(request.headers.get('user-agent') ?? '');

  // 1. Direct hits on the markdown surface — observe only.
  if (pathname === '/llms.txt' || pathname.endsWith('.md')) {
    trackMarkdownRead(event, request, {
      path: pathname,
      surface: pathname === '/llms.txt' ? 'llms' : 'markdown',
      agent,
    });
    return NextResponse.next();
  }

  // 2. Content negotiation: HTML page requested with `Accept: text/markdown`.
  if (prefersMarkdown(request.headers.get('accept'))) {
    const markdownPath = toMarkdownPath(pathname);
    if (markdownPath) {
      trackMarkdownRead(event, request, { path: pathname, surface: 'negotiated', agent });
      const redirect = NextResponse.redirect(new URL(markdownPath, request.url), 307);
      // Signal shared caches that this redirect depends on the Accept header, so
      // a browser (which never sends text/markdown) is never served it.
      redirect.headers.set('Vary', 'Accept');
      return redirect;
    }
  }

  // 3. Everything else: normal HTML, untouched — zero change for human traffic.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
