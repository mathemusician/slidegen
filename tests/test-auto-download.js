#!/usr/bin/env node

/**
 * Test: Automatic Model Download
 * Verifies that the download script works when model is missing
 */

import { existsSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MODEL_DIR = join(__dirname, '../public/models/all-MiniLM-L6-v2');
const MODEL_PATH = join(MODEL_DIR, 'model.onnx');

console.log('🧪 Test: Automatic Model Download\n');
console.log('═'.repeat(70));

async function runDownloadScript() {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', ['scripts/download-model.js'], {
      cwd: join(__dirname, '..'),
      stdio: 'pipe'
    });

    let output = '';
    proc.stdout.on('data', (data) => {
      output += data.toString();
      process.stdout.write(data);
    });

    proc.stderr.on('data', (data) => {
      output += data.toString();
      process.stderr.write(data);
    });

    proc.on('close', (code) => {
      resolve({ code, output });
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

async function test() {
  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: Model exists, script skips download
  console.log('\n📋 Test 1: Model exists - should skip download');
  console.log('─'.repeat(70));
  
  if (existsSync(MODEL_PATH)) {
    console.log('✅ Model already exists, running script...');
    const result1 = await runDownloadScript();
    
    if (result1.code === 0 && result1.output.includes('already exists')) {
      console.log('✅ Test 1 PASSED: Script correctly skipped download');
      testsPassed++;
    } else {
      console.log('❌ Test 1 FAILED: Script should skip download when model exists');
      testsFailed++;
    }
  } else {
    console.log('⚠️  Test 1 SKIPPED: Model doesn\'t exist, can\'t test skip logic');
  }

  // Test 2: Model missing, script downloads
  console.log('\n📋 Test 2: Model missing - should download automatically');
  console.log('─'.repeat(70));
  
  // Backup existing model if present
  const backupPath = MODEL_PATH + '.backup-test';
  if (existsSync(MODEL_PATH)) {
    console.log('📦 Backing up existing model...');
    rmSync(backupPath, { force: true });
    await import('fs').then(fs => fs.promises.rename(MODEL_PATH, backupPath));
  }

  try {
    console.log('🗑️  Model removed, running download script...');
    const result2 = await runDownloadScript();
    
    if (result2.code === 0 && existsSync(MODEL_PATH)) {
      console.log('✅ Test 2 PASSED: Model downloaded successfully');
      testsPassed++;
    } else {
      console.log('❌ Test 2 FAILED: Model was not downloaded');
      testsFailed++;
    }
  } finally {
    // Restore backup
    if (existsSync(backupPath)) {
      console.log('\n📦 Restoring backup...');
      rmSync(MODEL_PATH, { force: true });
      await import('fs').then(fs => fs.promises.rename(backupPath, MODEL_PATH));
    }
  }

  // Test 3: WASM files copied
  console.log('\n📋 Test 3: WASM files should be copied to public/');
  console.log('─'.repeat(70));
  
  const wasmPath = join(__dirname, '../public/ort-wasm-simd-threaded.wasm');
  if (existsSync(wasmPath)) {
    console.log('✅ Test 3 PASSED: WASM file exists in public/');
    testsPassed++;
  } else {
    console.log('❌ Test 3 FAILED: WASM file not found in public/');
    testsFailed++;
  }

  // Summary
  console.log('\n' + '═'.repeat(70));
  console.log('📊 TEST SUMMARY');
  console.log('═'.repeat(70));
  console.log(`\n   Total:  ${testsPassed + testsFailed}`);
  console.log(`   Passed: ${testsPassed} ✅`);
  console.log(`   Failed: ${testsFailed} ❌`);
  
  if (testsFailed === 0) {
    console.log('\n🎉 All automatic download tests passed!\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Review output above.\n');
    process.exit(1);
  }
}

test().catch(error => {
  console.error('\n❌ Test suite failed:', error);
  process.exit(1);
});
