import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: '../landing-dist',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
