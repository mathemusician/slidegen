#!/usr/bin/env node

/**
 * Comprehensive AI Model Testing Script
 * Tests the model with real lyric examples to verify classification capability
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if model exists
const MODEL_PATH = join(__dirname, '../public/models/all-MiniLM-L6-v2/model.onnx');

if (!existsSync(MODEL_PATH)) {
  console.error('❌ Model file not found!');
  console.error('   Run: npm run download-model');
  process.exit(1);
}

console.log('🧪 AI Model Comprehensive Testing\n');
console.log('═'.repeat(60));

// Dynamic imports
const { embedText, getCacheStats, clearCache, isModelLoaded } = await import('../src/ai/model.js');
const { cosineSimilarity } = await import('../src/ai/cosine.js');

// Test data: realistic lyric headers vs lyric content
const testData = {
  headers: [
    "[Verse 1]",
    "[Chorus]",
    "[Bridge]",
    "[Intro]",
    "[Outro]",
    "[Pre-Chorus]",
    "[Hook]",
    "[Verse 2]",
    "[Refrain]",
    "[Interlude]",
  ],
  lyrics: [
    "Walking down the street at night",
    "I can't believe you're gone",
    "Love is all we need",
    "Dancing in the moonlight",
    "When I was young and free",
    "You and me together",
    "Dreams that never die",
    "Hold me close tonight",
    "Running through the rain",
    "Forever in my heart",
  ]
};

async function runTests() {
  console.log('\n📊 Test 1: Model Loading');
  console.log('─'.repeat(60));
  
  const startTime = Date.now();
  console.log('Loading model for first time...');
  
  try {
    const testEmbedding = await embedText("Test");
    const loadTime = Date.now() - startTime;
    
    console.log(`✅ Model loaded successfully in ${loadTime}ms`);
    console.log(`   Embedding dimension: ${testEmbedding.length}`);
    console.log(`   Model loaded: ${isModelLoaded()}`);
  } catch (error) {
    console.error('❌ Failed to load model:', error.message);
    process.exit(1);
  }

  // Test 2: Embedding consistency
  console.log('\n📊 Test 2: Embedding Consistency');
  console.log('─'.repeat(60));
  
  const text = "Hello world";
  const embedding1 = await embedText(text);
  const embedding2 = await embedText(text);
  
  if (embedding1 === embedding2) {
    console.log('✅ Caching works - same object returned');
  } else {
    console.log('❌ Caching issue - different objects returned');
  }
  
  const similarity = cosineSimilarity(embedding1, embedding2);
  console.log(`   Self-similarity: ${similarity.toFixed(6)} (should be ~1.0)`);

  // Test 3: Header vs Lyric Classification
  console.log('\n📊 Test 3: Header vs Lyric Differentiation');
  console.log('─'.repeat(60));
  
  console.log('\nGenerating embeddings for headers...');
  const headerEmbeddings = [];
  for (const header of testData.headers) {
    const emb = await embedText(header);
    headerEmbeddings.push(emb);
    process.stdout.write('.');
  }
  console.log(' Done!');
  
  console.log('Generating embeddings for lyrics...');
  const lyricEmbeddings = [];
  for (const lyric of testData.lyrics) {
    const emb = await embedText(lyric);
    lyricEmbeddings.push(emb);
    process.stdout.write('.');
  }
  console.log(' Done!');

  // Calculate average header embedding (centroid)
  console.log('\nCalculating header centroid...');
  const headerCentroid = new Float32Array(384);
  for (const emb of headerEmbeddings) {
    for (let i = 0; i < 384; i++) {
      headerCentroid[i] += emb[i];
    }
  }
  for (let i = 0; i < 384; i++) {
    headerCentroid[i] /= headerEmbeddings.length;
  }
  
  // Calculate average lyric embedding (centroid)
  console.log('Calculating lyric centroid...');
  const lyricCentroid = new Float32Array(384);
  for (const emb of lyricEmbeddings) {
    for (let i = 0; i < 384; i++) {
      lyricCentroid[i] += emb[i];
    }
  }
  for (let i = 0; i < 384; i++) {
    lyricCentroid[i] /= lyricEmbeddings.length;
  }

  // Test classification accuracy
  console.log('\n📈 Classification Results:');
  console.log('─'.repeat(60));
  
  let headerCorrect = 0;
  console.log('\n🏷️  Testing Headers:');
  for (let i = 0; i < testData.headers.length; i++) {
    const header = testData.headers[i];
    const emb = headerEmbeddings[i];
    
    const headerSim = cosineSimilarity(emb, headerCentroid);
    const lyricSim = cosineSimilarity(emb, lyricCentroid);
    const isCorrect = headerSim > lyricSim;
    
    if (isCorrect) headerCorrect++;
    
    const status = isCorrect ? '✅' : '❌';
    console.log(`${status} "${header}"`);
    console.log(`   Header sim: ${headerSim.toFixed(4)} | Lyric sim: ${lyricSim.toFixed(4)}`);
  }
  
  let lyricCorrect = 0;
  console.log('\n🎵 Testing Lyrics:');
  for (let i = 0; i < testData.lyrics.length; i++) {
    const lyric = testData.lyrics[i];
    const emb = lyricEmbeddings[i];
    
    const headerSim = cosineSimilarity(emb, headerCentroid);
    const lyricSim = cosineSimilarity(emb, lyricCentroid);
    const isCorrect = lyricSim > headerSim;
    
    if (isCorrect) lyricCorrect++;
    
    const status = isCorrect ? '✅' : '❌';
    console.log(`${status} "${lyric}"`);
    console.log(`   Header sim: ${headerSim.toFixed(4)} | Lyric sim: ${lyricSim.toFixed(4)}`);
  }

  const totalCorrect = headerCorrect + lyricCorrect;
  const totalTests = testData.headers.length + testData.lyrics.length;
  const accuracy = (totalCorrect / totalTests * 100).toFixed(1);
  
  console.log('\n📊 Overall Accuracy:');
  console.log('─'.repeat(60));
  console.log(`   Headers: ${headerCorrect}/${testData.headers.length} correct`);
  console.log(`   Lyrics:  ${lyricCorrect}/${testData.lyrics.length} correct`);
  console.log(`   Total:   ${totalCorrect}/${totalTests} (${accuracy}%)`);

  // Test 4: Performance metrics
  console.log('\n📊 Test 4: Performance Metrics');
  console.log('─'.repeat(60));
  
  clearCache();
  
  const perfTests = [
    "This is a test sentence",
    "Another test sentence here",
    "One more for good measure"
  ];
  
  console.log('Testing inference speed (uncached)...');
  const uncachedTimes = [];
  for (const text of perfTests) {
    const start = Date.now();
    await embedText(text);
    uncachedTimes.push(Date.now() - start);
  }
  
  console.log('Testing inference speed (cached)...');
  const cachedTimes = [];
  for (const text of perfTests) {
    const start = Date.now();
    await embedText(text);
    cachedTimes.push(Date.now() - start);
  }
  
  const avgUncached = uncachedTimes.reduce((a, b) => a + b, 0) / uncachedTimes.length;
  const avgCached = cachedTimes.reduce((a, b) => a + b, 0) / cachedTimes.length;
  
  console.log(`\n   Avg uncached: ${avgUncached.toFixed(2)}ms`);
  console.log(`   Avg cached:   ${avgCached.toFixed(2)}ms`);
  console.log(`   Speedup:      ${(avgUncached / avgCached).toFixed(1)}x`);

  // Test 5: Cache statistics
  console.log('\n📊 Test 5: Cache Statistics');
  console.log('─'.repeat(60));
  
  const stats = getCacheStats();
  console.log(`   Cache size: ${stats.size} entries`);
  console.log(`   Memory estimate: ~${(stats.size * 384 * 4 / 1024).toFixed(2)} KB`);

  // Final summary
  console.log('\n' + '═'.repeat(60));
  console.log('✨ Testing Complete!\n');
  
  if (accuracy >= 80) {
    console.log('✅ Model is working well for lyric classification!');
    console.log('   Ready to integrate with main application.');
  } else if (accuracy >= 60) {
    console.log('⚠️  Model shows moderate accuracy.');
    console.log('   May need additional training data or threshold tuning.');
  } else {
    console.log('❌ Model accuracy is low.');
    console.log('   Consider using a different approach or fine-tuned model.');
  }
  
  console.log('\n💡 Next Steps:');
  console.log('   1. Review classification results above');
  console.log('   2. Adjust similarity thresholds if needed');
  console.log('   3. Integrate embedText() into your lyric parsing logic');
  console.log('   4. Add UI controls for manual override\n');
}

// Run tests
runTests().catch(error => {
  console.error('\n❌ Test failed:', error);
  console.error(error.stack);
  process.exit(1);
});
