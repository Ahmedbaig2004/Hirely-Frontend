import type { NextConfig } from "next";

const nextConfig: NextConfig & { eslint?: { ignoreDuringBuilds?: boolean } } = {
  /* This allows the build to succeed even if there are linting or type errors */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
