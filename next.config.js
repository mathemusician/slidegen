/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // This is needed for PptxGenJS to work with Next.js
    config.resolve.alias.canvas = false;
    return config;
  },
  // Redirect root to index.html
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/index.html',
      },
    ];
  },
};

module.exports = nextConfig;
