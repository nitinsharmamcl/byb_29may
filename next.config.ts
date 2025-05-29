import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  eslint: {
    ignoreDuringBuilds: false, // Ensures ESLint runs during builds (keep as true to skip)
  },

  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.node$/,
      type: 'asset/resource',
    });

    return config;
  },
};

export default nextConfig;
