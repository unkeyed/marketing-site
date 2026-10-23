import type { NextConfig } from 'next';

// Local and CI builds sign precomputed flag codes with this value. Production and
// Preview on Vercel must set FLAGS_SECRET (32 bytes, base64url) instead. Changing
// the secret requires a rebuild: the static variant URLs are signed with it.
const DEV_FLAGS_SECRET = 'NMceQol2euQCm9-6ONvsRIUECEDv3mwVlnARdpPQulk';

if (!process.env.FLAGS_SECRET) {
  if (process.env.VERCEL_ENV === 'production' || process.env.VERCEL_ENV === 'preview') {
    throw new Error(
      'FLAGS_SECRET is required on Vercel. Generate one with `node -e "console.log(crypto.randomBytes(32).toString(\'base64url\'))"` and set a different value for Production and Preview.',
    );
  }
  process.env.FLAGS_SECRET = DEV_FLAGS_SECRET;
}

const siteUrl = (process.env.NEXT_PUBLIC_DEFAULT_SITE_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
);

// Markdown twins of HTML pages. Each `.md` URL is rewritten to a prerendered route handler
// under `/api`. Keep in sync with `MARKDOWN_PAGES` / `MARKDOWN_SECTIONS` in `src/proxy.ts`.
const markdownRoutes = [
  // Per-item markdown sources
  { page: '/blog/:slug', markdown: '/blog/:slug.md', api: '/api/blog/:slug' },
  {
    page: '/case-studies/:slug',
    markdown: '/case-studies/:slug.md',
    api: '/api/case-studies/:slug',
  },
  { page: '/glossary/:slug', markdown: '/glossary/:slug.md', api: '/api/glossary/:slug' },
  { page: '/changelog/:slug', markdown: '/changelog/:slug.md', api: '/api/changelog/:slug' },
  // Index / listing markdown
  { page: '/blog', markdown: '/blog.md', api: '/api/blog' },
  { page: '/case-studies', markdown: '/case-studies.md', api: '/api/case-studies' },
  { page: '/glossary', markdown: '/glossary.md', api: '/api/glossary' },
  { page: '/changelog', markdown: '/changelog.md', api: '/api/changelog' },
  // Static / standalone pages
  { page: '/', markdown: '/index.md', api: '/api/home' },
  { page: '/', markdown: '/index-b.md', api: '/api/home-variant-b' },
  { page: '/pricing', markdown: '/pricing.md', api: '/api/pricing' },
  { page: '/about', markdown: '/about.md', api: '/api/about' },
  { page: '/startups', markdown: '/startups.md', api: '/api/startups' },
  { page: '/yc', markdown: '/yc.md', api: '/api/yc' },
  { page: '/all-things-open', markdown: '/all-things-open.md', api: '/api/all-things-open' },
  {
    page: '/all-things-open/rules',
    markdown: '/all-things-open/rules.md',
    api: '/api/all-things-open/rules',
  },
  { page: '/policies/terms', markdown: '/policies/terms.md', api: '/api/policies/terms' },
  { page: '/policies/privacy', markdown: '/policies/privacy.md', api: '/api/policies/privacy' },
];

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'three', '@react-three/drei', 'motion', 'shiki'],
  },
  outputFileTracingExcludes: {
    '*': [
      'next.config.ts',
      'eslint.config.mjs',
      'postcss.config.mjs',
      'tailwind.plugins.mjs',
      'next-sitemap.config.cjs',
      'AGENTS.md',
      'CLAUDE.md',
      'README.md',
      'LICENSE',
      'LICENSE-CONTENT',
      'LICENSING.md',
      'TRADEMARKS.md',
      'pnpm-lock.yaml',
      'tsconfig.json',
      'tsconfig.tsbuildinfo',
      'skills-lock.json',
      'components.json',
    ],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 90, 95, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      // Route handlers are internal rewrite targets, never pages to index. Headers match the
      // requested path, so this only affects direct `/api/*` hits, not the `.md` URLs.
      {
        source: '/api/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
      // Direct hits on a precomputed hero URL. Rewrites of `/` match the request
      // path, so the public homepage does not inherit this header.
      {
        source: '/hero-variant/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
      {
        source: '/index-b.md',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
      // Point search engines at the HTML page so the markdown twin never competes with it.
      ...markdownRoutes.map(({ page, markdown }) => ({
        source: markdown,
        headers: [{ key: 'Link', value: `<${siteUrl}${page}>; rel="canonical"` }],
      })),
      {
        source: '/images/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/rive/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/videos/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Enrich the static llms.txt source with links to posts excluded from site feeds.
        {
          source: '/llms.txt',
          destination: '/api/llms',
        },
        ...markdownRoutes.map(({ markdown, api }) => ({ source: markdown, destination: api })),
      ],
      afterFiles: [
        {
          source: '/_mintlify/:path*',
          destination: 'https://unkeyed.mintlify.site/_mintlify/:path*',
        },
        {
          source: '/api/request',
          destination: 'https://unkeyed.mintlify.site/_mintlify/api/request',
        },
        {
          source: '/docs',
          destination: 'https://unkeyed.mintlify.site/docs',
        },
        {
          source: '/docs/:match*',
          destination: 'https://unkeyed.mintlify.site/docs/:match*',
        },
        {
          source: '/mintlify-assets/:path+',
          destination: 'https://unkeyed.mintlify.site/mintlify-assets/:path+',
        },
        ...(process.env.NEXT_PUBLIC_C15T_URL
          ? [
              {
                source: '/api/c15t/:path*',
                destination: `${process.env.NEXT_PUBLIC_C15T_URL}/:path*`,
              },
            ]
          : []),
      ],
    };
  },
  async redirects() {
    return [
      {
        source: '/discord',
        destination: 'https://discord.gg/fDbezjbJbD',
        permanent: false,
      },
      {
        source: '/github',
        destination: 'https://github.com/unkeyed/unkey',
        permanent: false,
      },
      {
        source: '/meet',
        destination: 'https://cal.com/team/unkey',
        permanent: false,
      },
      // Retired URLs. statusCode 308 is a permanent redirect.
      {
        source: '/blog/heroku-alternatives-for-apis',
        destination: '/blog/best-serverless-api-hosting-2026',
        statusCode: 308,
      },
      {
        source: '/blog/deploy-a-docker-container',
        destination: '/docs/compute/get-started/deploy-an-image',
        statusCode: 308,
      },
      {
        source: '/blog/how-to-rate-limit-an-api',
        destination: '/blog/introducing-ratelimiting',
        statusCode: 308,
      },
      {
        source: '/glossary/ephemeral-environments',
        destination: '/docs/compute/concepts/production-and-preview',
        statusCode: 308,
      },
      {
        source: '/glossary/api-key-management',
        destination: '/blog/api-key-management-vs-gateway',
        statusCode: 308,
      },
      {
        source: '/glossary/api-rate-limiting',
        destination: '/blog/introducing-ratelimiting',
        statusCode: 308,
      },
    ];
  },
};

export default nextConfig;
