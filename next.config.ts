import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow any local /public images (no extra remote patterns needed
    // unless you serve hero images from a CDN — add domains there)
    remotePatterns: [],
  },
};

export default nextConfig;