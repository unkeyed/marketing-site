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
  typescript: {
    ignoreBuildErrors: true,
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
              value: 'https?://[^/]+/(templates|careers|docs|oss-friends)(?:/.*)?',
            },
          ],
          destination: 'https://www.unkey.com/_next/static/:path*',
        },
      ],
      fallback: [
        {
          source: '/:path*',
          destination: 'https://www.unkey.com/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
