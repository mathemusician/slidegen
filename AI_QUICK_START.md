# AI Classification - Quick Start Guide

## 🎉 Status: READY FOR INTEGRATION

The AI model has been successfully set up, tested, and achieved **100% accuracy** on lyric header vs. content classification.

---

## 📋 What's Been Done

✅ **Infrastructure Setup**
- `src/ai/model.js` - ONNX model loader with caching
- `src/ai/cosine.js` - Vector similarity utilities
- `src/ai/model.test.js` - Unit tests
- Model downloaded (86 MB) and validated

✅ **Automatic Download**
- `scripts/download-model.js` - Auto-downloads model from Hugging Face
- Run anytime with: `npm run download-model`

✅ **Comprehensive Testing**
- `scripts/test-ai.js` - Full test suite
- **100% accuracy** on 20 test cases
- Average inference: 66ms (uncached), <0.01ms (cached)

✅ **Build Verified**
- Next.js build successful
- No bundle size increase (lazy loaded)
- Vercel-compatible

---

## 🚀 Quick Commands

```bash
# Download model (if needed)
npm run download-model

# Run comprehensive AI tests
npm run test:ai

# Run unit tests
npm test

# Setup AI (download + test)
npm run setup-ai

# Build project
npm run build
```

---

## 💻 How to Use in Code

### Basic Usage

```javascript
import { embedText } from '@/src/ai/model';
import { cosineSimilarity } from '@/src/ai/cosine';

// Generate embedding
const embedding = await embedText("Your text here");

// Compare two texts
const emb1 = await embedText("Text 1");
const emb2 = await embedText("Text 2");
const similarity = cosineSimilarity(emb1, emb2);
// Returns: -1 to 1 (1 = identical, 0 = unrelated, -1 = opposite)
```

### Classify Lyric Lines

```javascript
import { embedText } from '@/src/ai/model';
import { cosineSimilarity } from '@/src/ai/cosine';

// Pre-computed centroids (run once, store as constants)
const HEADER_CENTROID = await computeHeaderCentroid();
const LYRIC_CENTROID = await computeLyricCentroid();

// Classify a line
async function classifyLine(text) {
  const embedding = await embedText(text);
  
  const headerSim = cosineSimilarity(embedding, HEADER_CENTROID);
  const lyricSim = cosineSimilarity(embedding, LYRIC_CENTROID);
  const margin = headerSim - lyricSim;
  
  return {
    type: headerSim > lyricSim ? 'header' : 'lyric',
    confidence: Math.abs(margin),
    headerSim,
    lyricSim
  };
}

// Usage
const result = await classifyLine("[Verse 1]");
console.log(result);
// { type: 'header', confidence: 0.3248, headerSim: 0.6747, lyricSim: 0.3499 }
```

### Batch Classification

```javascript
async function classifyLyrics(lines) {
  const results = [];
  
  for (const line of lines) {
    if (!line.trim()) {
      results.push({ type: 'empty', text: line });
      continue;
    }
    
    const classification = await classifyLine(line);
    results.push({ 
      text: line, 
      ...classification 
    });
  }
  
  return results;
}

// Usage
const lyrics = [
  "[Verse 1]",
  "Walking down the street",
  "[Chorus]",
  "I love you"
];

const classified = await classifyLyrics(lyrics);
```

---

## 📊 Expected Performance

| Metric | Value |
|--------|-------|
| Accuracy | 100% (on test set) |
| Load time | ~350ms (first time only) |
| Inference (uncached) | ~66ms per text |
| Inference (cached) | <0.01ms (instant) |
| Memory | ~50 MB (model + runtime) |

---

## 🎯 Classification Accuracy

Based on testing:

| Type | Examples Tested | Correct | Accuracy |
|------|----------------|---------|----------|
| Headers | 10 | 10 | 100% |
| Lyrics | 10 | 10 | 100% |
| **Total** | **20** | **20** | **100%** |

**Header Examples:**
- `[Verse 1]`, `[Chorus]`, `[Bridge]`, `[Intro]`, `[Outro]`
- `[Pre-Chorus]`, `[Hook]`, `[Verse 2]`, `[Refrain]`, `[Interlude]`

**Lyric Examples:**
- "Walking down the street at night"
- "I can't believe you're gone"
- "Love is all we need"
- etc.

---

## ⚙️ Integration Checklist

When you're ready to integrate:

- [ ] Compute and store reference centroids as constants
- [ ] Create `classifyLine()` helper function
- [ ] Add AI toggle to UI (optional feature)
- [ ] Show confidence indicators for low-confidence classifications
- [ ] Add manual override buttons
- [ ] Test with real Genius API lyrics
- [ ] Adjust confidence threshold if needed (currently: simple comparison)

---

## 🔍 Troubleshooting

### Model not loading?
```bash
# Re-download model
npm run download-model
```

### Tests failing?
```bash
# Verify model exists
ls -lh public/models/all-MiniLM-L6-v2/model.onnx

# Should show: ~86 MB file
```

### Build issues?
```bash
# Clean build
rm -rf .next
npm run build
```

---

## 📁 File Structure

```
genius-to-ppt/
├── src/ai/
│   ├── model.js           # Main AI module
│   ├── cosine.js          # Vector utilities
│   ├── model.test.js      # Unit tests
│   └── README.md          # Detailed docs
├── scripts/
│   ├── download-model.js  # Auto-download script
│   └── test-ai.js         # Comprehensive tests
├── public/models/all-MiniLM-L6-v2/
│   ├── model.onnx         # Downloaded model (86 MB)
│   ├── tokenizer.json     # Optional
│   └── README.md          # Download instructions
├── AI_IMPLEMENTATION.md   # Implementation summary
├── AI_TEST_RESULTS.md     # Full test results
└── AI_QUICK_START.md      # This file
```

---

## 🎓 Key Concepts

### Embeddings
- Converts text to 384-dimensional vector
- Similar texts have similar vectors
- Measured with cosine similarity

### Centroid
- Average of multiple embeddings
- Represents "typical" header or lyric
- Used as reference point for classification

### Cosine Similarity
- Measures angle between vectors
- Range: -1 (opposite) to 1 (identical)
- 0 means unrelated

### Confidence Margin
- Difference between header_sim and lyric_sim
- Higher margin = more confident
- Recommend threshold: 0.05-0.10 for uncertainty warning

---

## 📚 Further Reading

- **Detailed Docs:** `src/ai/README.md`
- **Test Results:** `AI_TEST_RESULTS.md`
- **Implementation:** `AI_IMPLEMENTATION.md`
- **Model Info:** `public/models/all-MiniLM-L6-v2/README.md`

---

## 🎉 You're All Set!

The AI infrastructure is ready to use. When you're ready to integrate:

1. Review the test results in `AI_TEST_RESULTS.md`
2. Use the code examples above
3. Start with a simple prototype
4. Add UI controls for manual override
5. Collect feedback and iterate

**Questions?** Check the detailed docs or run the tests to see it in action!

```bash
npm run test:ai
```

Happy coding! 🚀
