import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow any local /public images
    remotePatterns: [],
    // Enable unoptimized for local development if needed
    // unoptimized: true,
  },
};

export default nextConfig;