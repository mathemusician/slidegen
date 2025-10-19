# Improved Context-Aware Hybrid Classifier Design

## Problem Statement
Current classifier strips out legitimate lyrics containing words like "Instrumental", "Drop", "Beat", etc.
Root cause: Rule-based patterns make immediate decisions without context.

## Proposed Architecture: 3-Pass Hybrid System

### Pass 1: High-Confidence Rule Matching (SAFE patterns only)
**Goal**: Catch obvious headers with 100% confidence
**Patterns** (CONSERVATIVE):
- `[Verse 1]`, `[Chorus]`, etc. (bracketed standard format)
- `V1`, `V2`, `C1`, `B1` (standalone alphanumeric codes)
- Empty lines
- Timestamps: `0:00`, `[2:30]`, etc.

**Key**: Only match patterns that have ZERO false positive risk

### Pass 2: Context-Aware Feature Analysis
**Goal**: Flag POTENTIAL headers for AI review
**Features to extract**:
```javascript
{
  line: string,
  isSuspicious: boolean,  // Flagged by less-confident rules
  features: {
    wordCount: number,
    hasAllCaps: boolean,
    hasBrackets: boolean,
    hasParentheses: boolean,
    hasRepeatNotation: boolean,  // (x2), (X3)
    startsWithNumber: boolean,
    endsWithColon: boolean,
    containsStructuralKeyword: boolean,  // "verse", "chorus", etc.
    previousLineType: 'empty' | 'header' | 'lyric',
    nextLineType: 'empty' | 'header' | 'lyric',
    positionInGroup: 'first' | 'middle' | 'last'
  }
}
```

**Heuristic Rules** (suggestions, not decisions):
- Single word + ALL CAPS + structural keyword → flag as suspicious
- Multi-word line with structural keyword → probably lyric
- "Instrumental" alone on line after empty line → suspicious
- "instrumental melody" → definitely lyric
- Line length > 5 words → probably lyric regardless of keywords

### Pass 3: AI Context-Enhanced Classification
**Goal**: Make final decision using semantic understanding + context features

**Enhanced Prompt for AI**:
```
Given a line from song lyrics, determine if it's a structural header or actual lyric content.

CONTEXT:
- Previous line: "{previousLine}" ({previousType})
- Current line: "{currentLine}"
- Next line: "{nextLine}" ({nextType})
- Features: {features}

DECISION LOGIC:
1. If line contains structural keywords (verse, chorus, bridge, instrumental, etc.)
   BUT is part of a longer sentence → LYRIC
2. If line is short (1-2 words), standalone, all caps → likely HEADER
3. If line has natural language flow and context → LYRIC
4. When uncertain, bias toward KEEPING as lyric (better to include than exclude)

Return: {type: 'header' | 'lyric' | 'uncertain', confidence: number, reasoning: string}
```

## Implementation Strategy

### Phase 1: Update Rule Patterns (Conservative Mode)
```javascript
const SAFE_HEADER_PATTERNS = {
  // Zero false-positive patterns only
  standardBracketed: /^\[(?:Verse|Chorus|Bridge|Intro|Outro|Hook|Refrain|Interlude|Pre-Chorus|Post-Chorus)\s*\d*(?:\s*:\s*.+?)?\]$/i,
  alphanumericCodes: /^[VCB]\d+$/,  // V1, V2, C1, B1
  timestamps: /^(?:\[)?(?:\d{1,2}:)?\d{1,2}:\d{2}(?:\])?$/,
};

const SUSPICIOUS_PATTERNS = {
  // Flag for AI review
  singleWordStructural: /^(?:verse|chorus|bridge|intro|outro|hook|refrain|interlude|instrumental|breakdown|drop|beat)$/i,
  allCapsStructural: /^[A-Z\s]{2,15}$/,  // 2-15 chars, all caps
  withRepeats: /\((?:x|X|×)\d+\)/,
};
```

### Phase 2: Add Context Window Function
```javascript
function buildContext(lines, index) {
  return {
    current: lines[index],
    previous: index > 0 ? lines[index - 1] : null,
    next: index < lines.length - 1 ? lines[index + 1] : null,
    positionInGroup: index === 0 ? 'first' : 
                     index === lines.length - 1 ? 'last' : 'middle',
    surroundingLyricCount: countLyrics(lines, index - 2, index + 2)
  };
}
```

### Phase 3: Enhanced AI Classification
```javascript
async function classifyWithContext(line, context, centroids) {
  // Extract features
  const features = extractFeatures(line, context);
  
  // Check safe patterns (immediate return)
  if (isSafeHeader(line)) {
    return { type: 'header', confidence: 1.0, method: 'rule-safe' };
  }
  
  // Check suspicious patterns
  const isSuspicious = isSuspiciousHeader(line);
  
  // If not suspicious and long enough, likely lyric
  if (!isSuspicious && features.wordCount >= 4) {
    return { type: 'lyric', confidence: 0.9, method: 'heuristic-length' };
  }
  
  // Use AI for ambiguous cases
  const embedding = await embedText(normalizeForML(line));
  const headerSim = cosineSimilarity(embedding, centroids.header);
  const lyricSim = cosineSimilarity(embedding, centroids.lyric);
  
  // Context boost: If surrounded by lyrics, boost lyric score
  if (context.surroundingLyricCount >= 3) {
    lyricSim *= 1.2;  // 20% boost
  }
  
  // Suspicious boost: If flagged by rules, boost header score
  if (isSuspicious) {
    headerSim *= 1.1;  // 10% boost
  }
  
  const margin = headerSim - lyricSim;
  
  return {
    type: margin > 0 ? 'header' : 'lyric',
    confidence: Math.abs(margin),
    method: 'ml-context',
    features,
    isSuspicious
  };
}
```

## Key Improvements

1. **Conservative rules**: Only match patterns with zero false-positive risk
2. **Context awareness**: Consider surrounding lines and position
3. **Feature-based scoring**: Multiple signals, not just pattern matching
4. **Bias toward inclusion**: When uncertain, keep the line (better UX)
5. **Transparency**: Return reasoning and features for debugging

## Expected Outcomes

- ✅ "Instrumental" alone → Header (correct)
- ✅ "This instrumental beat" → Lyric (fixed!)
- ✅ "Drop the bass" → Lyric (fixed!)
- ✅ "[Verse 1]" → Header (still correct)
- ✅ "V3" → Header (still correct)
- ✅ "BREAKDOWN" after lyrics → Header (correct)
- ✅ "breakdown and cry" → Lyric (fixed!)

## Testing Strategy

1. Run against adversarial test cases (test-adversarial.js)
2. Measure false positive rate (lyrics stripped incorrectly)
3. Measure false negative rate (headers kept incorrectly)
4. Target: <2% false positive, <5% false negative
5. Monitor: "uncertain" rate should be <10%
