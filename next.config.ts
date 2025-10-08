import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Include WASM files in serverless function deployment
    // @ts-ignore - outputFileTracingIncludes exists but not in type definitions
    outputFileTracingIncludes: {
      '/api/generate-ppt': [
        './node_modules/onnxruntime-web/dist/*.wasm',
        './node_modules/onnxruntime-web/dist/*.mjs',
      ],
      '/api/classify-lyrics': [
        './node_modules/onnxruntime-web/dist/*.wasm',
        './node_modules/onnxruntime-web/dist/*.mjs',
      ],
    },
  },
};

export default nextConfig;
