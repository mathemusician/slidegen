#!/usr/bin/env node

/**
 * PowerPoint Output Validation
 * Verifies generated .pptx files are valid and contain correct content
 */

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

console.log('📊 PowerPoint Output Validation\n');
console.log('═'.repeat(70));

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TEST_DIR = join(tmpdir(), 'pptx-test');

if (!existsSync(TEST_DIR)) {
  mkdirSync(TEST_DIR, { recursive: true });
}

async function generatePPT(lyrics, title) {
  const response = await fetch(`${BASE_URL}/api/generate-ppt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lyrics, title })
  });
  
  if (!response.ok) {
    throw new Error(`API returned ${response.status}`);
  }
  
  const data = await response.json();
  if (!data.pptx) {
    throw new Error('No pptx data in response');
  }
  
  // Decode base64
  const buffer = Buffer.from(data.pptx, 'base64');
  return buffer;
}

const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

// Test 1: Generated file is valid ZIP (PPT is ZIP format)
test('Generated file is valid ZIP format', async () => {
  const lyrics = 'Test lyric line\nAnother line';
  const buffer = await generatePPT(lyrics, 'Test');
  
  // Check ZIP magic number (PK\x03\x04)
  const magic = buffer.toString('hex', 0, 4);
  if (magic !== '504b0304') {
    return `Invalid ZIP magic number: ${magic}`;
  }
  
  return null;
});

// Test 2: File size is reasonable
test('File size is reasonable (>10KB, <500KB)', async () => {
  const lyrics = 'Test lyric line\nAnother line';
  const buffer = await generatePPT(lyrics, 'Test');
  
  const size = buffer.byteLength;
  if (size < 10000) {
    return `File too small: ${size} bytes`;
  }
  if (size > 500000) {
    return `File too large: ${size} bytes`;
  }
  
  return null;
});

// Test 3: Headers are removed from output
test('Headers removed from lyrics', async () => {
  const lyrics = 'CHORUS\nThis is a lyric\n\nV3\nAnother lyric\n\n[Verse 1]\nThird lyric';
  const buffer = await generatePPT(lyrics, 'Test');
  
  // Save to temp file
  const filePath = join(TEST_DIR, 'test-headers.pptx');
  writeFileSync(filePath, buffer);
  
  // Simple check: file shouldn't contain "CHORUS" or "[Verse 1]" as text
  // This is a basic check - a proper check would parse the XML
  const content = buffer.toString('utf8');
  
  // Check if headers appear in the content
  // Note: This is imperfect as it searches the whole ZIP, not just slide text
  const hasChorus = content.includes('CHORUS');
  const hasV3 = content.includes('V3');
  const hasVerse = content.includes('[Verse 1]');
  
  if (hasChorus || hasV3 || hasVerse) {
    return `Headers may still be present (simple string check)`;
  }
  
  return null;
});

// Test 4: Multiple slides created
test('Multiple slides created for grouped lyrics', async () => {
  const lyrics = 'Line 1\nLine 2\n\nLine 3\nLine 4\n\nLine 5\nLine 6';
  const buffer = await generatePPT(lyrics, 'Test');
  
  const filePath = join(TEST_DIR, 'test-slides.pptx');
  writeFileSync(filePath, buffer);
  
  // Count occurrences of slide XML markers
  const content = buffer.toString('utf8');
  const slideMatches = content.match(/<p:sld /g) || [];
  
  if (slideMatches.length < 2) {
    return `Expected multiple slides, found ${slideMatches.length}`;
  }
  
  return null;
});

// Test 5: Title is included
test('Title is included in presentation', async () => {
  const lyrics = 'Test lyric';
  const title = 'My Awesome Song';
  const buffer = await generatePPT(lyrics, title);
  
  const content = buffer.toString('utf8');
  
  if (!content.includes(title)) {
    return `Title "${title}" not found in presentation`;
  }
  
  return null;
});

// Test 6: Empty lyrics handling
test('Handles empty lyrics gracefully', async () => {
  try {
    const lyrics = '   \n\n\n   ';
    await generatePPT(lyrics, 'Test');
    return 'Should have rejected empty lyrics';
  } catch (error) {
    // Expected to fail
    return null;
  }
});

// Test 7: Special characters in lyrics
test('Handles special characters in lyrics', async () => {
  const lyrics = 'Lyrics with "quotes" and <tags> and & symbols\nEmoji: 🎵 🎶';
  const buffer = await generatePPT(lyrics, 'Special');
  
  const content = buffer.toString('utf8');
  
  // Should contain escaped or encoded versions
  if (!content.includes('quotes') && !content.includes('&quot;')) {
    return `Special characters may not be handled correctly`;
  }
  
  return null;
});

// Test 8: Very long lyric lines
test('Handles very long lyric lines', async () => {
  const longLine = 'This is a very long lyric line that goes on and on and on '.repeat(10);
  const lyrics = longLine;
  const buffer = await generatePPT(lyrics, 'Long');
  
  if (buffer.byteLength < 10000) {
    return `File unexpectedly small for long lyrics`;
  }
  
  return null;
});

// Run all tests
async function runTests() {
  console.log(`\n🧪 Running ${tests.length} PowerPoint validation tests...\n`);
  console.log(`Base URL: ${BASE_URL}\n`);
  console.log(`Test files: ${TEST_DIR}\n`);
  console.log('─'.repeat(70));
  
  for (const { name, fn } of tests) {
    try {
      const error = await fn();
      if (error) {
        console.log(`❌ FAIL: ${name}`);
        console.log(`   ${error}\n`);
        failed++;
      } else {
        console.log(`✅ PASS: ${name}\n`);
        passed++;
      }
    } catch (error) {
      console.log(`❌ ERROR: ${name}`);
      console.log(`   ${error.message}\n`);
      failed++;
    }
  }
  
  // Summary
  console.log('═'.repeat(70));
  console.log('📊 TEST SUMMARY');
  console.log('═'.repeat(70));
  console.log(`\n   Total:  ${passed + failed}`);
  console.log(`   Passed: ${passed} ✅`);
  console.log(`   Failed: ${failed} ❌`);
  console.log(`\n   📁 Test files saved to: ${TEST_DIR}`);
  
  if (failed === 0) {
    console.log('\n🎉 All PowerPoint validation tests passed!\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Review output above.\n');
    process.exit(1);
  }
}

// Check if server is running
console.log(`\n🔍 Checking if server is running at ${BASE_URL}...`);
fetch(`${BASE_URL}/api/generate-ppt`, { method: 'GET' })
  .then(response => {
    console.log('✅ Server is running!\n');
    runTests();
  })
  .catch(error => {
    console.log(`\n❌ Server not running at ${BASE_URL}`);
    console.log(`   Error: ${error.message}`);
    console.log(`\n💡 Start the server first: npm run dev\n`);
    process.exit(1);
  });
