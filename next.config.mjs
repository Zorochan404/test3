/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add output configuration for proper static/server rendering
  output: 'standalone',
  // Ensure trailing slashes are handled consistently
  trailingSlash: false,
  // Ignore ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;