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
      beforeFiles: [],
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
};

export default nextConfig;
