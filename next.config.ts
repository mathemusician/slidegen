import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Include ORT Web loader modules and binaries in all server functions
  // Reference: https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
  outputFileTracingIncludes: {
    '/*': [
      'node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.mjs',
      'node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm',
      // Fallbacks if we force no-thread or no-SIMD
      'node_modules/onnxruntime-web/dist/ort-wasm-simd.mjs',
      'node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm',
      'node_modules/onnxruntime-web/dist/ort-wasm.mjs',
      'node_modules/onnxruntime-web/dist/ort-wasm.wasm',
    ],
  },
};

export default nextConfig;
