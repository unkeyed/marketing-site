import type { NextConfig } from "next";

type WebpackAssetRule = {
  test?: RegExp;
  exclude?: RegExp;
  issuer?: RegExp;
  use?: string[];
};

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.inline.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  webpack(config) {
    const rules = config.module.rules as WebpackAssetRule[];
    const svgAssetRule = rules.find(
      (rule) => rule.test instanceof RegExp && rule.test.test(".svg"),
    );

    if (svgAssetRule) {
      svgAssetRule.exclude = /\.inline\.svg$/i;
    }

    rules.push({
      test: /\.inline\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet",
          },
        ],
      },
      {
        source: "/:path*.(mp4|webm|jpg)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
