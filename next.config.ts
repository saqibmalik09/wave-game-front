import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from any external URL
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allow any domain over HTTPS
      },
      {
        protocol: 'http',
        hostname: '**', // allow any domain over HTTP
      },
    ],
    unoptimized: true, // disables next/image optimization for external URLs
  },

  // Optional: any other next.js settings
};

export default nextConfig;
