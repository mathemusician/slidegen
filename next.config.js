/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    // Include the ORT loader and WASM plus your model files in the traced bundle
    '/**': [
      'public/ort-wasm-simd-threaded.mjs',
      'public/ort-wasm-simd-threaded.wasm',
      'public/models/**'
    ]
  },
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
