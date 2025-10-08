import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Include ORT Web loader modules, binaries, worker, and model in serverless functions
  // Reference: https://vercel.com/guides/how-can-i-use-files-in-serverless-functions
  // @ts-ignore - outputFileTracingIncludes exists but not in Next.js type definitions
  outputFileTracingIncludes: {
    // Route-specific includes for API route that uses ONNX Runtime
    '/api/generate-ppt': [
      // ONNX model file (bundle in function to avoid HTTP fetch)
      'public/models/all-MiniLM-L6-v2/model.onnx',
      'public/models/all-MiniLM-L6-v2/tokenizer.json',
      'public/models/all-MiniLM-L6-v2/vocab.txt',
      // ORT Web loader modules, WASM binaries, and worker (required for WASM backend)
      'node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.mjs',
      'node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm',
      'node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.worker.js',
      // Fallbacks if we force no-thread or no-SIMD
      'node_modules/onnxruntime-web/dist/ort-wasm-simd.mjs',
      'node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm',
      'node_modules/onnxruntime-web/dist/ort-wasm.mjs',
      'node_modules/onnxruntime-web/dist/ort-wasm.wasm',
    ],
  },
};

export default nextConfig;
