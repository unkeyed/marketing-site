import type { NextConfig } from 'next';

import {
  LEGACY_NEXT_STATIC_DESTINATION,
  LEGACY_PUBLIC_ASSET_REWRITES,
  LEGACY_REFERER_PATTERN,
  LEGACY_ROUTE_REWRITES,
} from './src/constants/legacy-rewrites';

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
        {
          source: '/_next/static/:path*',
          has: [
            {
              type: 'header',
              key: 'referer',
              value: LEGACY_REFERER_PATTERN,
            },
          ],
          destination: LEGACY_NEXT_STATIC_DESTINATION,
        },
      ],
      afterFiles: [
        ...LEGACY_PUBLIC_ASSET_REWRITES,
        ...LEGACY_ROUTE_REWRITES,
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
};

export default nextConfig;
