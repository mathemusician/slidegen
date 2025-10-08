#!/usr/bin/env node

/**
 * Test: Classification Accuracy
 * Verifies AI correctly classifies headers vs lyrics
 */

import { classifyLines, initializeClassifier } from '../src/ai/classifier.js';

console.log('🧪 Test: Classification Accuracy\n');
console.log('═'.repeat(70));

const testCases = [
  // Clear headers
  { text: 'CHORUS', expected: 'header', reason: 'Standard uppercase header' },
  { text: 'V1', expected: 'header', reason: 'Abbreviated verse' },
  { text: 'V3', expected: 'header', reason: 'Abbreviated verse' },
  { text: '[Verse 1]', expected: 'header', reason: 'Standard bracket notation' },
  { text: '[Chorus]', expected: 'header', reason: 'Standard bracket notation' },
  { text: 'BRIDGE (X2)', expected: 'header', reason: 'Header with repeat notation' },
  { text: 'PRE CHORUS', expected: 'header', reason: 'Multi-word header' },
  { text: 'INTRO', expected: 'header', reason: 'Single word header' },
  
  // Clear lyrics
  { text: 'Walking down the street at night', expected: 'lyric', reason: 'Complete lyric line' },
  { text: 'The Spirit and The church say come!', expected: 'lyric', reason: 'Complete lyric line' },
  { text: 'And let everyone who hears say come!', expected: 'lyric', reason: 'Complete lyric line' },
  { text: 'I love you more than words can say', expected: 'lyric', reason: 'Complete lyric line' },
  { text: 'Every deed done in the dark', expected: 'lyric', reason: 'Complete lyric line' },
  { text: 'More lyrics about love and life', expected: 'lyric', reason: 'Complete lyric line' },
  
  // Edge cases (can be uncertain, but should not be opposite)
  { text: 'Yeah', expected: ['lyric', 'uncertain', 'header'], reason: 'Very short - ambiguous (any is acceptable)' },
  { text: 'Oh', expected: ['lyric', 'uncertain'], reason: 'Single word interjection' },
  { text: 'Every deed', expected: ['lyric', 'uncertain'], reason: 'Short fragment' },
  { text: 'More lyrics', expected: ['lyric', 'uncertain', 'header'], reason: 'Generic short phrase - ambiguous (any is acceptable)' },
  { text: 'He will come back again', expected: ['lyric', 'uncertain'], reason: 'Complete lyric - uncertain is OK' },
];

async function runTests() {
  console.log('\n📊 Initializing AI Classifier...\n');
  
  const { headerCentroid, lyricCentroid } = await initializeClassifier();
  
  console.log('✅ Classifier initialized!\n');
  console.log('─'.repeat(70));
  
  let passed = 0;
  let failed = 0;
  const failures = [];
  
  for (const testCase of testCases) {
    const results = await classifyLines([testCase.text], headerCentroid, lyricCentroid);
    const result = results[0];
    
    const expectedTypes = Array.isArray(testCase.expected) ? testCase.expected : [testCase.expected];
    const isCorrect = expectedTypes.includes(result.type);
    
    if (isCorrect) {
      console.log(`✅ PASS: "${testCase.text}"`);
      console.log(`   Expected: ${expectedTypes.join(' or ')} | Got: ${result.type} (${result.method}, conf: ${result.confidence?.toFixed(3) || 'N/A'})`);
      passed++;
    } else {
      console.log(`❌ FAIL: "${testCase.text}"`);
      console.log(`   Expected: ${expectedTypes.join(' or ')} | Got: ${result.type} (${result.method}, conf: ${result.confidence?.toFixed(3) || 'N/A'})`);
      console.log(`   Reason: ${testCase.reason}`);
      failed++;
      failures.push({
        text: testCase.text,
        expected: expectedTypes.join(' or '),
        got: result.type,
        reason: testCase.reason,
        confidence: result.confidence
      });
    }
    console.log();
  }
  
  // Summary
  console.log('═'.repeat(70));
  console.log('📊 TEST SUMMARY');
  console.log('═'.repeat(70));
  console.log(`\n   Total:  ${passed + failed}`);
  console.log(`   Passed: ${passed} ✅ (${(passed / (passed + failed) * 100).toFixed(1)}%)`);
  console.log(`   Failed: ${failed} ❌ (${(failed / (passed + failed) * 100).toFixed(1)}%)`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    failures.forEach((f, i) => {
      console.log(`\n   ${i + 1}. "${f.text}"`);
      console.log(`      Expected: ${f.expected}`);
      console.log(`      Got: ${f.got} (confidence: ${f.confidence?.toFixed(3) || 'N/A'})`);
      console.log(`      Reason: ${f.reason}`);
    });
  }
  
  console.log('\n' + '═'.repeat(70));
  
  if (failed === 0) {
    console.log('\n🎉 All classification tests passed!\n');
    // Force exit to avoid ONNX Runtime cleanup mutex error
    setTimeout(() => {
      process.exit(0);
    }, 100);
  } else {
    console.log('\n⚠️  Some tests failed. Review failures above.\n');
    setTimeout(() => {
      process.exit(1);
    }, 100);
  }
}

runTests().catch(error => {
  console.error('\n❌ Test suite failed:', error.message);
  console.error(error.stack);
  setTimeout(() => {
    process.exit(1);
  }, 100);
});
