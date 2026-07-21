import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'three',
      '@react-three/drei',
      'motion',
      'shiki',
    ],
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
        // Per-item markdown sources
        {
          source: '/blog/:slug.md',
          destination: '/api/blog/:slug',
        },
        {
          source: '/case-studies/:slug.md',
          destination: '/api/case-studies/:slug',
        },
        {
          source: '/glossary/:slug.md',
          destination: '/api/glossary/:slug',
        },
        {
          source: '/changelog/:slug.md',
          destination: '/api/changelog/:slug',
        },
        // Index / listing markdown
        {
          source: '/blog.md',
          destination: '/api/blog',
        },
        {
          source: '/case-studies.md',
          destination: '/api/case-studies',
        },
        {
          source: '/glossary.md',
          destination: '/api/glossary',
        },
        {
          source: '/changelog.md',
          destination: '/api/changelog',
        },
        // Static / standalone pages
        {
          source: '/index.md',
          destination: '/api/home',
        },
        {
          source: '/pricing.md',
          destination: '/api/pricing',
        },
        {
          source: '/about.md',
          destination: '/api/about',
        },
        {
          source: '/startups.md',
          destination: '/api/startups',
        },
        {
          source: '/yc.md',
          destination: '/api/yc',
        },
        {
          source: '/policies/terms.md',
          destination: '/api/policies/terms',
        },
        {
          source: '/policies/privacy.md',
          destination: '/api/policies/privacy',
        },
      ],
      afterFiles: [
        {
          source: '/docs',
          destination: 'https://unkey.mintlify.dev/docs',
        },
        {
          source: '/docs/:match*',
          destination: 'https://unkey.mintlify.dev/docs/:match*',
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
    ];
  },
};

export default nextConfig;
