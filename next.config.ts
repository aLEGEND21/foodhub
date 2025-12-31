import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Enable standalone output for Docker
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google profile images
      },
    ],
  },
};

export default nextConfig;
