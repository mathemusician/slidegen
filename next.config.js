/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // This is needed for PptxGenJS to work with Next.js
    config.resolve.alias.canvas = false;
    return config;
  },
  // Enable server actions (if needed)
  experimental: {
    serverActions: true,
  },
  // Set the output to 'standalone' for better deployment
  output: 'standalone',
};

module.exports = nextConfig;
