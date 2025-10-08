#!/usr/bin/env node

/**
 * Adversarial Testing Suite
 * Tests designed to trick and challenge the classifier with ambiguous,
 * creative, and edge cases that blur the line between headers and lyrics.
 */

import { classifyLines, initializeClassifier } from '../src/ai/classifier.js';

console.log('🎭 Adversarial Testing - Breaking the Classifier\n');
console.log('═'.repeat(70));

const adversarialTests = {
  "Poetic Headers (Look Like Lyrics)": [
    { text: "The Beginning", note: "Poetic intro - could be header or lyric" },
    { text: "Chapter One", note: "Story-like header" },
    { text: "First Light", note: "Poetic section marker" },
    { text: "The Return", note: "Narrative section" },
    { text: "Awakening", note: "Single poetic word" },
  ],
  
  "Lyrics That Look Like Headers": [
    { text: "Verse", note: "Song about writing verses" },
    { text: "This is the chorus", note: "Meta-lyric about the chorus" },
    { text: "Intro to my heart", note: "Lyric with 'intro' in it" },
    { text: "Bridge over troubled water", note: "Classic song title/lyric" },
    { text: "Hook, line and sinker", note: "Idiom with 'hook'" },
  ],
  
  "Numbered Lines (Ambiguous Context)": [
    { text: "1", note: "Just a number" },
    { text: "One", note: "Number as word" },
    { text: "Part 2", note: "Could be header or lyric" },
    { text: "Chapter 3", note: "Narrative marker" },
    { text: "Track 1", note: "Meta reference" },
  ],
  
  "Questions as Headers/Lyrics": [
    { text: "What is love?", note: "Famous lyric or section question?" },
    { text: "Why?", note: "Single word question" },
    { text: "Where do we go from here?", note: "Reflective lyric or section?" },
    { text: "How?", note: "Minimal question" },
    { text: "Who am I?", note: "Philosophical question" },
  ],
  
  "Commands and Instructions": [
    { text: "Listen", note: "Command - header or lyric?" },
    { text: "Stop", note: "Imperative" },
    { text: "Begin", note: "Starting command" },
    { text: "End", note: "Ending marker" },
    { text: "Repeat", note: "Instruction or lyric?" },
  ],
  
  "Emotional Interjections (Edge of Both)": [
    { text: "Hallelujah", note: "Religious exclamation" },
    { text: "Amen", note: "Closing exclamation" },
    { text: "Selah", note: "Musical notation in Psalms" },
    { text: "Encore", note: "Performance marker" },
    { text: "Finale", note: "Ending marker" },
  ],
  
  "Genre-Specific Markers": [
    { text: "Drop", note: "EDM section marker or lyric?" },
    { text: "Beat", note: "Hip-hop reference" },
    { text: "Rap", note: "Genre mention or section?" },
    { text: "Instrumental", note: "Section marker" },
    { text: "Acapella", note: "Style marker or reference?" },
  ],
  
  "Parenthetical Ambiguity": [
    { text: "(Repeat)", note: "Instruction or lyric in parens?" },
    { text: "(x2)", note: "Repeat notation" },
    { text: "(Softly)", note: "Performance direction" },
    { text: "(With feeling)", note: "Emotional direction" },
    { text: "(Echo)", note: "Production note" },
  ],
  
  "Timestamp/Marker Style": [
    { text: "0:00", note: "Timestamp" },
    { text: "2:30 -", note: "Time marker" },
    { text: "@ 1:45", note: "At timestamp" },
    { text: "3 minutes in", note: "Time reference" },
    { text: "[0:45]", note: "Bracketed time" },
  ],
  
  "Mixed Case Confusion": [
    { text: "cHoRuS", note: "Mixed case header" },
    { text: "VeRsE", note: "Alternating case" },
    { text: "ChOrUs", note: "Random caps" },
    { text: "iNtRo", note: "Inverted case pattern" },
    { text: "BrIdGe", note: "Scattered caps" },
  ],
  
  "Single Letters/Symbols": [
    { text: "A", note: "Single letter - many meanings" },
    { text: "I", note: "Pronoun or section marker?" },
    { text: "X", note: "Unknown/placeholder" },
    { text: "*", note: "Asterisk symbol" },
    { text: "#", note: "Hash/number symbol" },
  ],
  
  "Foreign Language Headers": [
    { text: "Estribillo", note: "Spanish for chorus" },
    { text: "Couplet", note: "French for verse" },
    { text: "Refrão", note: "Portuguese for chorus" },
    { text: "Strofe", note: "German for stanza" },
    { text: "Coro", note: "Italian for chorus" },
  ],
  
  "Punctuation Only": [
    { text: "...", note: "Ellipsis" },
    { text: "---", note: "Em dash" },
    { text: "***", note: "Section break" },
    { text: "~~~", note: "Wave separator" },
    { text: "•••", note: "Bullet points" },
  ],
  
  "Almost-Headers": [
    { text: "Pre chorus 1", note: "Similar to PRE CHORUS" },
    { text: "Verse like", note: "Contains 'verse'" },
    { text: "Chorus-ish", note: "Playful header reference" },
    { text: "Bridge ish", note: "Uncertain section" },
    { text: "Hook esque", note: "Similar to hook" },
  ],
  
  "Meta-Musical Terms in Lyrics": [
    { text: "In this verse I tell my story", note: "Lyric mentioning 'verse'" },
    { text: "When the chorus comes around", note: "Lyric about the chorus" },
    { text: "After the bridge we'll rise", note: "Narrative about structure" },
    { text: "Singing hooks all day", note: "Meta lyric about hooks" },
    { text: "This intro feels too long", note: "Self-aware lyric" },
  ],
};

async function runAdversarialTests() {
  console.log('\n📊 Initializing AI Classifier...\n');
  const { headerCentroid, lyricCentroid } = await initializeClassifier();
  console.log('✅ Classifier initialized!\n');
  
  const results = {};
  let totalTests = 0;
  let headerCount = 0;
  let lyricCount = 0;
  let uncertainCount = 0;
  
  for (const [category, tests] of Object.entries(adversarialTests)) {
    console.log('═'.repeat(70));
    console.log(`🎯 ${category}`);
    console.log('═'.repeat(70));
    
    const lines = tests.map(t => t.text);
    const classifications = await classifyLines(lines, headerCentroid, lyricCentroid);
    
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      const result = classifications[i];
      
      totalTests++;
      
      let icon = '❓';
      if (result.type === 'header') {
        icon = '🏷️';
        headerCount++;
      } else if (result.type === 'lyric') {
        icon = '🎵';
        lyricCount++;
      } else if (result.type === 'uncertain') {
        icon = '❓';
        uncertainCount++;
      }
      
      const confidence = result.confidence?.toFixed(3) || 'N/A';
      const method = result.method === 'rule' ? '📏 RULE' : '🤖 ML';
      
      console.log(`\n${icon} "${test.text}"`);
      console.log(`   Classification: ${result.type.toUpperCase()} (${method}, conf: ${confidence})`);
      console.log(`   Note: ${test.note}`);
    }
    
    console.log();
  }
  
  // Final Analysis
  console.log('═'.repeat(70));
  console.log('📊 ADVERSARIAL TEST RESULTS');
  console.log('═'.repeat(70));
  
  console.log(`\n   Total Tests:      ${totalTests}`);
  console.log(`   Headers:          ${headerCount} (${(headerCount/totalTests*100).toFixed(1)}%)`);
  console.log(`   Lyrics:           ${lyricCount} (${(lyricCount/totalTests*100).toFixed(1)}%)`);
  console.log(`   Uncertain:        ${uncertainCount} (${(uncertainCount/totalTests*100).toFixed(1)}%)`);
  
  console.log('\n   💡 Key Insights:');
  console.log('   ─'.repeat(68));
  
  if (uncertainCount / totalTests > 0.3) {
    console.log('   ✅ Good! High uncertainty rate shows AI knows when it\'s unsure');
  } else {
    console.log('   ⚠️  Low uncertainty - AI might be overconfident on ambiguous cases');
  }
  
  if (headerCount / totalTests > 0.7) {
    console.log('   ⚠️  Bias toward headers - may over-filter lyrics');
  } else if (lyricCount / totalTests > 0.7) {
    console.log('   ⚠️  Bias toward lyrics - may miss creative headers');
  } else {
    console.log('   ✅ Balanced classification across ambiguous cases');
  }
  
  console.log('\n   📈 Robustness Analysis:');
  console.log('   ─'.repeat(68));
  console.log('   These tests intentionally blur the line between headers and lyrics.');
  console.log('   High uncertainty is GOOD - it means the AI recognizes ambiguity.');
  console.log('   In production, uncertain lines default to lyrics (safer than dropping).');
  
  console.log('\n' + '═'.repeat(70));
  console.log('✅ Adversarial Testing Complete!');
  console.log('═'.repeat(70));
  console.log();
  
  setTimeout(() => process.exit(0), 100);
}

runAdversarialTests().catch(error => {
  console.error('\n❌ Test failed:', error.message);
  console.error(error.stack);
  setTimeout(() => process.exit(1), 100);
});
