type THasHeaderRule = {
  type: 'header';
  key: string;
  value: string;
};

type TRewriteRule = {
  source: string;
  destination: string;
  has?: THasHeaderRule[];
};

const LEGACY_SITE_ORIGIN = process.env.LEGACY_SITE_ORIGIN?.replace(/\/$/, '');

if (!LEGACY_SITE_ORIGIN) {
  throw new Error('LEGACY_SITE_ORIGIN is required to proxy legacy website routes.');
}

export const LEGACY_NEXT_STATIC_DESTINATION = `${LEGACY_SITE_ORIGIN}/_next/static/:path*`;

export const LEGACY_ROUTE_PREFIXES = ['/templates', '/careers', '/docs', '/oss-friends'] as const;

export const LEGACY_REFERER_PATTERN = `https?://[^/]+/(${LEGACY_ROUTE_PREFIXES.map((prefix) =>
  prefix.slice(1),
).join('|')})(?:/.*)?`;

export const LEGACY_ROUTE_REWRITES: TRewriteRule[] = LEGACY_ROUTE_PREFIXES.flatMap((prefix) => [
  {
    source: prefix,
    destination: `${LEGACY_SITE_ORIGIN}${prefix}`,
  },
  {
    source: `${prefix}/:path*`,
    destination: `${LEGACY_SITE_ORIGIN}${prefix}/:path*`,
  },
]);

export const LEGACY_PUBLIC_ASSET_REWRITES: TRewriteRule[] = [
  {
    source: '/images/templates/:path*',
    destination: `${LEGACY_SITE_ORIGIN}/images/templates/:path*`,
  },
  {
    source: '/images/landing/:path*',
    destination: `${LEGACY_SITE_ORIGIN}/images/landing/:path*`,
  },
  {
    source: '/favicon.ico',
    destination: `${LEGACY_SITE_ORIGIN}/favicon.ico`,
  },
];
