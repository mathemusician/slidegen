import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Include ORT Web loader modules, binaries, and model in all server functions
  // Reference: https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
  outputFileTracingIncludes: {
    '/*': [
      // ONNX model file (bundle in function to avoid 401 on fetch)
      'public/models/all-MiniLM-L6-v2/model.onnx',
      'public/models/all-MiniLM-L6-v2/tokenizer.json',
      'public/models/all-MiniLM-L6-v2/vocab.txt',
      // ORT Web loader modules and WASM binaries
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
