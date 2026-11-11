import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { trackAgents } from '@databuddy/sdk/agents';

/**
 * This proxy (Next.js's successor to `middleware`) does two things:
 *
 *  1. OBSERVE. Agents never run the client analytics script, so Databuddy's
 *     `trackAgents` records their reads (markdown, llms.txt, HTML) server-side.
 *     The `matcher` runs on every non-asset request so it sees all three.
 *
 *  2. NEGOTIATE. When a client requests an ordinary HTML page with
 *     `Accept: text/markdown`, we redirect it to that page's `.md` twin.
 *     A redirect (not a rewrite) is deliberate: the HTML response — and its
 *     CDN cache entry — is never altered, so human delivery is untouched and
 *     there's no risk of a markdown body being cached under the HTML URL.
 */

// Pages with a `.md` twin. Keep in sync with the rewrites in `next.config.ts`.
const MARKDOWN_PAGES: Record<string, string> = {
  '/': '/index.md',
  '/pricing': '/pricing.md',
  '/about': '/about.md',
  '/startups': '/startups.md',
  '/yc': '/yc.md',
  '/all-things-open': '/all-things-open.md',
  '/all-things-open/rules': '/all-things-open/rules.md',
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

export function proxy(request: NextRequest, event: NextFetchEvent) {
  // Must run before branches 1 and 2, which return early.
  event.waitUntil(trackAgents(request));

  const { pathname } = request.nextUrl;

  // 1. Direct hits on the markdown surface pass through.
  if (pathname === '/llms.txt' || pathname.endsWith('.md')) {
    return NextResponse.next();
  }

  // 2. Content negotiation: HTML page requested with `Accept: text/markdown`.
  if (prefersMarkdown(request.headers.get('accept'))) {
    const markdownPath = toMarkdownPath(pathname);
    if (markdownPath) {
      const redirect = NextResponse.redirect(new URL(markdownPath, request.url), 307);
      // Signal shared caches that this redirect depends on the Accept header, so
      // a browser (which never sends text/markdown) is never served it.
      redirect.headers.set('Vary', 'Accept');
      return redirect;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
