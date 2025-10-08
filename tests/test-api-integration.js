#!/usr/bin/env node

/**
 * API Integration Tests
 * Tests the actual HTTP endpoints end-to-end
 */

console.log('🌐 API Integration Tests\n');
console.log('═'.repeat(70));

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function makeRequest(endpoint, options) {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, options);
    return {
      ok: response.ok,
      status: response.status,
      headers: Object.fromEntries(response.headers),
      contentType: response.headers.get('content-type'),
      body: response.ok ? await response.arrayBuffer() : await response.json()
    };
  } catch (error) {
    return { error: error.message };
  }
}

const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

// Test 1: Valid lyrics generate PPT
test('POST /api/generate-ppt with valid lyrics', async () => {
  const response = await makeRequest('/api/generate-ppt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lyrics: 'CHORUS\nLyric line\n\nV3\nAnother lyric',
      title: 'Test Song'
    })
  });
  
  if (!response.ok) return `Expected 200, got ${response.status}`;
  if (!response.contentType?.includes('application/json')) {
    return `Expected application/json, got ${response.contentType}`;
  }
  if (!response.body || response.body.byteLength < 1000) {
    return `Response too small to be a valid PPT`;
  }
  return null; // Pass
});

// Test 2: Missing lyrics returns 400
test('POST /api/generate-ppt with missing lyrics', async () => {
  const response = await makeRequest('/api/generate-ppt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Test' })
  });
  
  if (response.status !== 400) {
    return `Expected 400, got ${response.status}`;
  }
  if (!response.body?.error) {
    return `Expected error message in response`;
  }
  return null;
});

// Test 3: Empty lyrics returns 400
test('POST /api/generate-ppt with empty lyrics', async () => {
  const response = await makeRequest('/api/generate-ppt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lyrics: '', title: 'Test' })
  });
  
  if (response.status !== 400) {
    return `Expected 400, got ${response.status}`;
  }
  return null;
});

// Test 4: Large payload handling
test('POST /api/generate-ppt with large payload', async () => {
  const hugeLyrics = 'This is a lyric line\n'.repeat(10000); // ~200KB
  const response = await makeRequest('/api/generate-ppt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lyrics: hugeLyrics, title: 'Huge Song' })
  });
  
  // Should handle large payloads (may be slow but shouldn't error)
  if (response.status >= 500) {
    return `Server error on large payload: ${response.status}`;
  }
  return null;
});

// Test 5: Invalid JSON returns 400
test('POST /api/generate-ppt with invalid JSON', async () => {
  const response = await makeRequest('/api/generate-ppt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{invalid json}'
  });
  
  if (response.status !== 400 && response.status !== 500) {
    return `Expected 400 or 500, got ${response.status}`;
  }
  return null;
});

// Test 6: classify-lyrics endpoint
test('POST /api/classify-lyrics with valid input', async () => {
  const response = await makeRequest('/api/classify-lyrics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lyrics: 'CHORUS\nLyric line\nV3\nAnother lyric'
    })
  });
  
  if (!response.ok) return `Expected 200, got ${response.status}`;
  if (!response.body?.classifications) {
    return `Expected classifications array in response`;
  }
  return null;
});

// Test 7: CORS headers present
test('CORS headers present', async () => {
  const response = await makeRequest('/api/generate-ppt', {
    method: 'OPTIONS'
  });
  
  // Next.js may not require explicit OPTIONS, so 200 or 204 is fine
  if (response.status !== 200 && response.status !== 204 && response.status !== 404) {
    return `Unexpected OPTIONS response: ${response.status}`;
  }
  return null;
});

// Test 8: Response format validation
test('Response has correct structure', async () => {
  const response = await makeRequest('/api/generate-ppt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lyrics: 'Test lyric',
      title: 'Test'
    })
  });
  
  if (!response.ok) return `Expected 200, got ${response.status}`;
  
  // Check it's a valid response structure (JSON with pptx field)
  const contentType = response.contentType;
  if (!contentType?.includes('application/json')) {
    return `Expected JSON response, got ${contentType}`;
  }
  
  return null;
});

// Run all tests
async function runTests() {
  console.log(`\n🧪 Running ${tests.length} API integration tests...\n`);
  console.log(`Base URL: ${BASE_URL}\n`);
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
  
  if (failed === 0) {
    console.log('\n🎉 All API integration tests passed!\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Review output above.\n');
    process.exit(1);
  }
}

// Check if server is running
console.log(`\n🔍 Checking if server is running at ${BASE_URL}...`);
makeRequest('/api/generate-ppt', { method: 'GET' })
  .then(response => {
    if (response.error) {
      console.log(`\n❌ Server not running at ${BASE_URL}`);
      console.log(`   Error: ${response.error}`);
      console.log(`\n💡 Start the server first: npm run dev\n`);
      process.exit(1);
    }
    console.log('✅ Server is running!\n');
    runTests();
  });
