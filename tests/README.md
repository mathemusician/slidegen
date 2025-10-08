# AI Classifier Test Suite

Comprehensive testing suite for the hybrid lyric line classifier.

## Test Files

### Core AI Tests

### 🎯 `test-classification-accuracy.js`
**Purpose:** Core functionality - verify header vs lyric classification

Tests 19 cases with 100% expected accuracy:
- 8 clear headers (CHORUS, V3, [Verse 1], etc.)
- 6 clear lyrics (complete sentences)
- 5 edge cases (acceptable uncertainty)

**Run:** `npm run test:accuracy`

### 🎭 `test-adversarial.js`
**Purpose:** Push classifier to limits with intentionally ambiguous cases

75 challenging scenarios:
- Poetic headers (look like lyrics)
- Lyrics mentioning structure ("In this verse...")
- Questions, commands, interjections
- Foreign language headers
- Punctuation only
- Meta-musical terms

**Run:** `npm run test:adversarial`

### 🛡️ `test-security-adversarial.js`
**Purpose:** Test against real-world ML attack patterns

32 attack scenarios:
- Prompt injection attempts
- Evasion attacks (obfuscated headers)
- Unicode exploits (homoglyphs, zero-width)
- Boundary testing (overflow, empty)

**Run:** `npm run test:security`

### 🔥 `test-edge-cases.js`
**Purpose:** Break the classifier with unusual inputs

Tests include:
- Ambiguous short lines (Hey, Oh, Yeah)
- Special characters and emojis
- Mixed case headers
- Extra whitespace
- Non-standard brackets
- Typos in headers
- Repeated words
- Single letters
- Multiple headers on one line
- Headers with artist names
- Headers in other languages
- Very long lines
- Empty-ish lines
- Code-like text
- URLs and emails
- Roman numerals
- Time stamps
- All caps lyrics

**Run:** `npm run test:edge`

### 🎵 `test-real-songs.js`
**Purpose:** Test on realistic song lyrics from various genres

Includes complete songs:
- Pop song (standard `[Verse 1]` format)
- Hip-hop song (non-standard `V1`, `HOOK` format)
- Rock song (uppercase headers)
- Country song (colon format `Verse 1:`)
- R&B song (mixed formats)

**Run:** `npm run test:songs`

### ⚡ `test-performance.js`
**Purpose:** Measure speed, memory, and scalability

Tests:
- Initialization time
- Single classification speed
- Caching effectiveness
- Batch processing (10, 50, 100 lines)
- Cache memory usage
- Rule-based vs ML speed
- Long text performance

**Run:** `npm run test:perf`

### 🎯 `test-hybrid-basic.js`
**Purpose:** Basic functionality test with real user lyrics

Tests the original user-provided lyrics to verify hybrid approach works correctly.

**Run:** `npm run test:basic`

### Infrastructure Tests

### 📦 `test-auto-download.js`
**Purpose:** Verify automatic model download from Hugging Face

Tests:
- Model exists → skip download
- Model missing → download automatically (87 MB)
- WASM files copied to public/

**Run:** `npm run test:download`

### API & Integration Tests

### 🌐 `test-api-integration.js`
**Purpose:** Test HTTP endpoints end-to-end

8 API tests:
- Valid request → 200 with PPT
- Missing lyrics → 400 error
- Empty lyrics → 400 error
- Large payload handling
- Invalid JSON → 400/500
- classify-lyrics endpoint
- CORS headers
- Response format validation

**Run:** `npm run test:api` (requires server running!)

### 📊 `test-pptx-validation.js`
**Purpose:** Verify generated .pptx files are valid

8 PowerPoint tests:
- Valid ZIP format
- Reasonable file size
- Headers removed
- Multiple slides created
- Title included
- Special characters handled
- Long lines handled
- Empty lyrics rejected

**Run:** `npm run test:pptx` (requires server running!)

## Running Tests

### Run All Tests
```bash
npm test
```

Runs all test suites sequentially and generates a comprehensive report.

### Run Individual Tests

#### AI Tests (no server required)
```bash
npm run test:accuracy      # Classification accuracy
npm run test:adversarial   # Adversarial cases
npm run test:security      # Security attacks
npm run test:edge          # Edge cases
npm run test:songs         # Real songs
npm run test:perf          # Performance
npm run test:basic         # Basic functionality
npm run test:download      # Auto-download
```

#### Integration Tests (server required)
```bash
# Start server first: npm run dev

npm run test:api          # API endpoints
npm run test:pptx         # PowerPoint output
```

## Test Results Interpretation

### Classification Types

- **🏷️  HEADER** - Identified as a section header
- **🎵 LYRIC** - Identified as lyric content
- **❓ UNCERTAIN** - Confidence below threshold (0.10)
- **⬜ EMPTY** - Empty or whitespace-only line

### Methods

- **[RULE]** - Matched by rule-based patterns (fast, 100% confident)
- **[ML]** - Classified by machine learning embeddings (slower, probabilistic)

### Confidence Scores

- **1.0** - Rule-based match (perfect confidence)
- **> 0.10** - ML confident classification
- **< 0.10** - Uncertain, flagged for manual review

## Expected Performance

Based on research and testing:

- **Rule-based:** ~28-30% of lines (instant, 100% accurate)
- **ML-based:** ~70% of lines (~60-80ms per line uncached)
- **Uncertain:** ~5-10% (low confidence, needs review)
- **Overall accuracy:** ~91% (hybrid approach)

## Adding New Tests

To add a new test suite:

1. Create `test-your-name.js` in this directory
2. Follow the pattern of existing tests
3. Import from `../src/ai/classifier.js`
4. Add to `run-all-tests.js`
5. Add script to `package.json`

Example template:

```javascript
#!/usr/bin/env node
import { classifyLines, initializeClassifier } from '../src/ai/classifier.js';

console.log('🧪 Your Test Name\n');

async function runTest() {
  const { headerCentroid, lyricCentroid } = await initializeClassifier();
  
  const testLines = [
    "Your test line 1",
    "Your test line 2"
  ];
  
  const results = await classifyLines(testLines, headerCentroid, lyricCentroid);
  
  // Display and analyze results
  results.forEach(r => {
    console.log(`${r.type}: ${r.text}`);
  });
}

runTest().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
```

## Troubleshooting

### Model not found
```bash
npm run download-model
```

### Tests timing out
- Check internet connection (first run downloads model)
- Reduce batch sizes in performance tests
- Clear cache between tests

### Unexpected results
- Review confidence scores
- Check if headers match defined patterns
- Consider adding new patterns to classifier

## Test Coverage

- ✅ Standard header formats
- ✅ Non-standard header formats
- ✅ Various lyric styles
- ✅ Edge cases and boundary conditions
- ✅ Performance under load
- ✅ Caching effectiveness
- ✅ Rule-based vs ML comparison
- ✅ Real-world song lyrics
- ✅ Multiple genres and styles

## Continuous Testing

Run tests after:
- Adding new header patterns
- Modifying classification logic
- Updating model or centroids
- Changing confidence thresholds
- Before deploying to production

---

**Last Updated:** October 7, 2025
