import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // We already fixed your ESLint in the .mjs file,
  // so you can safely remove the 'eslint' object from here.
  typescript: {
    ignoreBuildErrors: true, // You can keep this if you want to skip type checks
  },
};

export default nextConfig;
