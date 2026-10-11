import { isCrawlerUserAgent } from '@/lib/crawler';

export const HOMEPAGE_HERO_VISITOR_COOKIE = 'homepage-hero-visitor';
export const HOMEPAGE_HERO_PREVIEW_COOKIE = 'homepage-hero-variant';
export const HOMEPAGE_HERO_VISITOR_HEADER = 'x-homepage-hero-visitor';

export const HOMEPAGE_HERO_FLAG_KEY = 'homepage-hero';

export type HomepageHeroVariant = 'a' | 'b';

// Variant B only. Variant A keeps the copy that already lives in `homeContentData`.
export const homepageHeroVariantB = {
  heading: 'Infrastructure for APIs',
  subhead: 'Deploy from GitHub, protect with API keys and rate limits, and see every request.',
} as const;

const VISITOR_ID_FALLBACK = 'anonymous';

/**
 * Global kill switch. Set `HOMEPAGE_HERO_VARIANT` to `a` or `b` in the Vercel
 * project (Production and Preview), then redeploy. Unset runs the 50/50 test.
 * `a` and `b` both include crawlers, so turning the test off does not leave
 * bots on the other variant.
 */
export function readForcedHomepageHeroVariant(): HomepageHeroVariant | null {
  const value = process.env.HOMEPAGE_HERO_VARIANT?.trim().toLowerCase();
  if (value === 'a' || value === 'b') return value;
  return null;
}

function readE2eDefaultVariant(): HomepageHeroVariant | null {
  if (process.env.NODE_ENV === 'production') return null;
  const value = process.env.HOMEPAGE_HERO_E2E_DEFAULT?.trim().toLowerCase();
  if (value === 'a' || value === 'b') return value;
  return null;
}

function bucketVisitor(visitorId: string): HomepageHeroVariant {
  let hash = 2166136261;
  for (let i = 0; i < visitorId.length; i++) {
    hash ^= visitorId.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % 2 === 0 ? 'a' : 'b';
}

export function decideHomepageHeroVariant(input: {
  userAgent: string | null;
  previewCookie: string | undefined;
  visitorId: string | undefined;
}): HomepageHeroVariant {
  const forced = readForcedHomepageHeroVariant();
  if (forced) return forced;

  if (isCrawlerUserAgent(input.userAgent)) return 'b';

  // Plain cookie override is for local/dev and Playwright. Production visitors
  // stick via the httpOnly visitor id. Toolbar overrides are applied by the
  // Flags SDK before `decide` runs.
  if (process.env.NODE_ENV !== 'production') {
    if (input.previewCookie === 'a' || input.previewCookie === 'b') return input.previewCookie;
  }

  const e2eDefault = readE2eDefaultVariant();
  if (e2eDefault) return e2eDefault;

  return bucketVisitor(input.visitorId || VISITOR_ID_FALLBACK);
}

export function homepageMarkdownPath(userAgent: string | null): '/index.md' | '/index-b.md' {
  const forced = readForcedHomepageHeroVariant();
  if (forced === 'a') return '/index.md';
  if (forced === 'b' || isCrawlerUserAgent(userAgent)) return '/index-b.md';
  return '/index.md';
}
