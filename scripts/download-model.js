#!/usr/bin/env node

/**
 * Download script for all-MiniLM-L6-v2 ONNX model
 * Automatically downloads model files from Hugging Face if they don't exist
 */

import { createWriteStream, existsSync, mkdirSync, copyFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { pipeline } from 'stream/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MODEL_DIR = join(__dirname, '../public/models/all-MiniLM-L6-v2');
const MODEL_PATH = join(MODEL_DIR, 'model.onnx');

// Hugging Face model URLs
const MODEL_URLS = {
  model: 'https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/onnx/model.onnx',
  // These are optional but recommended for proper tokenization
  tokenizer: 'https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/tokenizer.json',
  config: 'https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/tokenizer_config.json',
};

async function downloadFile(url, destPath) {
  console.log(`📥 Downloading from ${url}...`);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const totalSize = parseInt(response.headers.get('content-length') || '0', 10);
    let downloadedSize = 0;
    
    // Create progress reporting stream
    const progressStream = new TransformStream({
      transform(chunk, controller) {
        downloadedSize += chunk.length;
        const percent = totalSize > 0 ? ((downloadedSize / totalSize) * 100).toFixed(1) : '?';
        const mb = (downloadedSize / 1024 / 1024).toFixed(2);
        process.stdout.write(`\r   Progress: ${percent}% (${mb} MB)`);
        controller.enqueue(chunk);
      }
    });

    // Ensure directory exists
    mkdirSync(dirname(destPath), { recursive: true });
    
    // Download and save
    const fileStream = createWriteStream(destPath);
    await pipeline(
      response.body.pipeThrough(progressStream),
      fileStream
    );
    
    console.log('\n✅ Download complete!');
    return true;
  } catch (error) {
    console.error(`\n❌ Download failed: ${error.message}`);
    return false;
  }
}

async function checkAndDownloadModel() {
  console.log('🤖 Checking for all-MiniLM-L6-v2 model...\n');
  
  // Ensure model directory exists
  if (!existsSync(MODEL_DIR)) {
    console.log('📁 Creating model directory...');
    mkdirSync(MODEL_DIR, { recursive: true });
  }

  // Check if model exists
  if (existsSync(MODEL_PATH)) {
    console.log('✅ Model file already exists at:', MODEL_PATH);
    console.log('   Skipping download.\n');
    
    // Still need to copy WASM files
    console.log('📦 Checking ONNX Runtime WASM files...');
    try {
      const wasmSourceDir = './node_modules/onnxruntime-web/dist';
      const wasmDestDir = './public/';
      
      // Copy both .wasm and .mjs files (WASM needs JavaScript wrappers)
      const wasmFiles = [
        'ort-wasm-simd-threaded.wasm',
        'ort-wasm-simd-threaded.mjs',  // JavaScript wrapper needed for ES modules
        'ort-wasm.wasm',
        'ort-wasm-simd.wasm',
        'ort-wasm-threaded.wasm'
      ];
      
      let copied = 0;
      for (const file of wasmFiles) {
        const src = join(wasmSourceDir, file);
        const dest = join(wasmDestDir, file);
        if (existsSync(src) && !existsSync(dest)) {
          copyFileSync(src, dest);
          console.log(`   ✓ Copied ${file}`);
          copied++;
        }
      }
      
      if (copied > 0) {
        console.log(`✅ Copied ${copied} WASM/JS files`);
      } else {
        console.log('✅ WASM files already present');
      }
    } catch (wasmError) {
      console.warn('⚠️  Warning: Could not check/copy WASM files:', wasmError.message);
    }
    
    process.exit(0); // Exit successfully
  }

  console.log('⚠️  Model file not found. Downloading...\n');
  
  // Download main model file
  console.log('1️⃣  Downloading model.onnx (~23 MB)');
  const modelSuccess = await downloadFile(MODEL_URLS.model, MODEL_PATH);
  
  if (!modelSuccess) {
    console.error('\n❌ Failed to download model file.');
    console.error('   Please download manually from:');
    console.error('   https://huggingface.co/Xenova/all-MiniLM-L6-v2/tree/main/onnx\n');
    process.exit(1);
  }

  // Download optional tokenizer files
  await downloadFile(MODEL_URLS.tokenizer, join(MODEL_DIR, 'tokenizer.json'));
  
  console.log('\n3️⃣  Downloading tokenizer_config.json (optional)');
  await downloadFile(MODEL_URLS.config, join(MODEL_DIR, 'tokenizer_config.json'));

  console.log('\n✅ All model files downloaded successfully!');
  
  // Copy ONNX Runtime WASM files to public
  console.log('\n📦 Copying ONNX Runtime WASM files...');
  try {
    const wasmSourceDir = './node_modules/onnxruntime-web/dist';
    const wasmDestDir = './public/';
    
    // Copy both .wasm and .mjs files (WASM needs JavaScript wrappers)
    const wasmFiles = [
      'ort-wasm-simd-threaded.wasm',
      'ort-wasm-simd-threaded.mjs',  // JavaScript wrapper needed for ES modules
      'ort-wasm.wasm',
      'ort-wasm-simd.wasm',
      'ort-wasm-threaded.wasm'
    ];
    
    for (const file of wasmFiles) {
      const src = join(wasmSourceDir, file);
      const dest = join(wasmDestDir, file);
      if (existsSync(src)) {
        copyFileSync(src, dest);
        console.log(`   ✓ Copied ${file}`);
      }
    }
    
    console.log('✅ WASM files copied successfully!');
  } catch (wasmError) {
    console.warn('⚠️  Warning: Could not copy WASM files:', wasmError.message);
    console.warn('   AI classification may not work in production.');
  }
  
  console.log('\n📍 Model location:', MODEL_DIR);
  console.log('🚀 You can now use the AI classifier!\n');
  
  process.exit(0);
}

checkAndDownloadModel();
