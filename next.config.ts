import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Add output configuration for proper static/server rendering
  output: 'standalone',
  // Ensure trailing slashes are handled consistently
  trailingSlash: false,
};

export default nextConfig;

