import { isCrawlerUserAgent } from '@/lib/crawler';

export const HOMEPAGE_HERO_VISITOR_COOKIE = 'homepage-hero-visitor';
export const HOMEPAGE_HERO_PREVIEW_COOKIE = 'homepage-hero-variant';
export const HOMEPAGE_HERO_VISITOR_HEADER = 'x-homepage-hero-visitor';

export const HOMEPAGE_HERO_FLAG_KEY = 'homepage-hero';

export type HomepageHeroVariant = 'a' | 'b';

// Subhead only. Variant B keeps the live hero heading from `homeContentData`.
export const homepageHeroVariantB = {
  subhead:
    'Unkey unifies your infrastructure. Deploy APIs instantly, protect them with keys and rate limits, and understand usage in one place.',
} as const;

// Edit this one line to rename variant B's secondary hero button.
export const HOMEPAGE_HERO_B_SECONDARY_LABEL = 'Get a demo';

export const HOMEPAGE_HERO_B_SECONDARY_HREF = 'https://unkey.cal.com/james/sales';

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

  // The preview cookie lets Playwright pin a variant. CI serves the site with
  // `next start` (NODE_ENV=production), so the cookie is also honored when
  // HOMEPAGE_HERO_E2E_DEFAULT is set. Real production does not set that variable,
  // and visitors stick via the httpOnly visitor id. Toolbar overrides are
  // applied by the Flags SDK before `decide` runs.
  const e2eDefault = readE2eDefaultVariant();
  const allowPreviewCookie = process.env.NODE_ENV !== 'production' || e2eDefault !== null;
  if (allowPreviewCookie && (input.previewCookie === 'a' || input.previewCookie === 'b')) {
    return input.previewCookie;
  }

  if (e2eDefault) return e2eDefault;

  return bucketVisitor(input.visitorId || VISITOR_ID_FALLBACK);
}

export function homepageMarkdownPath(userAgent: string | null): '/index.md' | '/index-b.md' {
  const forced = readForcedHomepageHeroVariant();
  if (forced === 'a') return '/index.md';
  if (forced === 'b' || isCrawlerUserAgent(userAgent)) return '/index-b.md';
  return '/index.md';
}
