/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add output configuration for proper static/server rendering
  output: 'standalone',
  // Ensure trailing slashes are handled consistently
  trailingSlash: false,
};

export default nextConfig;