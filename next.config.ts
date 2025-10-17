import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid workspace root mis-detection in Turbopack builds
  experimental: {
    turbo: {
      resolveAlias: {},
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
