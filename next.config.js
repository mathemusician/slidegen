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
  experimental: {
    outputFileTracingIncludes: {
      '/api/generate-ppt': [
        // onnxruntime-web runtime artifacts (non-threaded build to avoid worker complexity)
        'node_modules/onnxruntime-web/dist/ort-wasm-simd.mjs',
        'node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm',
        // your model file that you read via fs in the function
        'public/models/all-MiniLM-L6-v2/model.onnx',
      ],
    },
  },
};

module.exports = nextConfig;
