#!/usr/bin/env node

/**
 * Edge Case Testing Suite - Try to Break the Classifier
 * Tests unusual formats, ambiguous cases, and boundary conditions
 */

import { classifyLines, initializeClassifier } from '../src/ai/classifier.js';

console.log('🔥 Edge Case Testing - Breaking the Classifier\n');
console.log('═'.repeat(70));

const edgeCases = {
  "Ambiguous Short Lines": [
    "Hey",
    "Oh",
    "Yeah",
    "No",
    "Wait",
    "Stop",
    "Go",
    "Why",
    "What"
  ],
  
  "Numbers and Special Characters": [
    "1, 2, 3, 4",
    "!!!",
    "???",
    "...",
    "***",
    "---",
    "~~~",
    "@#$%",
    "😀😃😄"
  ],
  
  "Mixed Case Headers": [
    "cHoRuS",
    "VeRsE 1",
    "BrIdGe",
    "pre-CHORUS",
    "iNtRo"
  ],
  
  "Headers with Extra Whitespace": [
    "  CHORUS  ",
    "\tVERSE 1\t",
    "  [Bridge]  ",
    "[ Chorus ]",
    "[  Verse  2  ]"
  ],
  
  "Non-Standard Brackets": [
    "(Chorus)",
    "{Verse 1}",
    "<Bridge>",
    "«Intro»",
    "【Verse】"
  ],
  
  "Headers with Typos": [
    "CHROUS",
    "VERS 1",
    "BRIDEG",
    "ITNRO",
    "OTURO"
  ],
  
  "Repeated Words": [
    "la la la la la",
    "oh oh oh oh",
    "yeah yeah yeah",
    "na na na na na",
    "hey hey hey"
  ],
  
  "Single Letters and Symbols": [
    "A",
    "B",
    "C",
    "x",
    "y",
    "z",
    "&",
    "|",
    "~"
  ],
  
  "Multiple Headers on One Line": [
    "[Verse 1] [Chorus]",
    "VERSE 1 / CHORUS",
    "Verse 1 - Chorus",
    "Intro & Verse"
  ],
  
  "Headers with Artist Names": [
    "[Verse 1: Drake]",
    "[Chorus: ft. Rihanna]",
    "VERSE (Kendrick)",
    "[Bridge - Kanye West]"
  ],
  
  "Numeric Verses (Edge Numbers)": [
    "V0",
    "V99",
    "V999",
    "VERSE 0",
    "VERSE 100"
  ],
  
  "Headers in Other Languages": [
    "ESTRIBILLO",  // Spanish for Chorus
    "COUPLET",     // French for Verse
    "REFRÃO",      // Portuguese for Chorus
    "STROPHE",     // German for Verse
    "コーラス"      // Japanese for Chorus
  ],
  
  "Very Long Lines": [
    "A".repeat(500),
    "This is an extremely long line that goes on and on and on and on and on and on and on and on and on and on and on and on".repeat(5)
  ],
  
  "Empty-ish Lines": [
    " ",
    "  ",
    "\t",
    "\n",
    "   \t   "
  ],
  
  "Lines That Look Like Code": [
    "function chorus() {",
    "const verse = 1;",
    "if (bridge) return;",
    "// Comment here",
    "<div>Verse</div>"
  ],
  
  "URLs and Emails": [
    "https://genius.com/lyrics",
    "lyrics@example.com",
    "www.songlyrics.com",
    "[link](https://example.com)"
  ],
  
  "Roman Numerals": [
    "VERSE I",
    "VERSE II",
    "VERSE III",
    "CHORUS IV",
    "BRIDGE V"
  ],
  
  "Headers with Time Stamps": [
    "[0:00] Intro",
    "VERSE 1 (0:30)",
    "Chorus @ 1:45",
    "[2:30 - Bridge]"
  ],
  
  "Repeated Header Variations": [
    "CHORUS 1",
    "CHORUS 2",
    "CHORUS A",
    "CHORUS B",
    "FINAL CHORUS"
  ],
  
  "All Caps Lyrics": [
    "I'M SCREAMING THESE LYRICS",
    "THIS IS ALL UPPERCASE",
    "EVERY WORD IS SHOUTING"
  ]
};

async function runEdgeCaseTests() {
  console.log('\n📊 Initializing Classifier...\n');
  const { headerCentroid, lyricCentroid } = await initializeClassifier();
  
  const allResults = {};
  let totalTests = 0;
  let headerCount = 0;
  let lyricCount = 0;
  let uncertainCount = 0;
  let emptyCount = 0;
  
  for (const [category, lines] of Object.entries(edgeCases)) {
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`📋 Testing: ${category}`);
    console.log('─'.repeat(70));
    
    const results = await classifyLines(lines, headerCentroid, lyricCentroid);
    allResults[category] = results;
    
    for (const result of results) {
      totalTests++;
      
      let icon, color;
      if (result.type === 'header') {
        icon = '🏷️ ';
        color = '\x1b[44m';
        headerCount++;
      } else if (result.type === 'uncertain') {
        icon = '❓';
        color = '\x1b[43m';
        uncertainCount++;
      } else if (result.type === 'empty') {
        icon = '⬜';
        color = '\x1b[47m\x1b[30m';
        emptyCount++;
      } else {
        icon = '🎵';
        color = '\x1b[42m';
        lyricCount++;
      }
      
      const reset = '\x1b[0m';
      const method = result.method === 'rule' ? '[RULE]' : result.method === 'ml' ? '[ML]' : '';
      
      console.log(`${icon} ${color}${result.type.toUpperCase().padEnd(10)}${reset} ${method}`);
      console.log(`   "${result.text.substring(0, 60)}${result.text.length > 60 ? '...' : ''}"`);
      
      if (result.confidence !== undefined) {
        console.log(`   Confidence: ${result.confidence.toFixed(4)}`);
      }
    }
  }
  
  // Overall Statistics
  console.log('\n' + '═'.repeat(70));
  console.log('📊 EDGE CASE TEST SUMMARY');
  console.log('═'.repeat(70));
  
  console.log(`\n   Total test cases:     ${totalTests}`);
  console.log(`   Headers detected:     ${headerCount} (${(headerCount/totalTests*100).toFixed(1)}%)`);
  console.log(`   Lyrics detected:      ${lyricCount} (${(lyricCount/totalTests*100).toFixed(1)}%)`);
  console.log(`   Uncertain:            ${uncertainCount} (${(uncertainCount/totalTests*100).toFixed(1)}%)`);
  console.log(`   Empty:                ${emptyCount} (${(emptyCount/totalTests*100).toFixed(1)}%)`);
  
  // Category breakdown
  console.log('\n   Category Breakdown:');
  for (const [category, results] of Object.entries(allResults)) {
    const headers = results.filter(r => r.type === 'header').length;
    const lyrics = results.filter(r => r.type === 'lyric').length;
    const uncertain = results.filter(r => r.type === 'uncertain').length;
    const empty = results.filter(r => r.type === 'empty').length;
    
    console.log(`\n   ${category}:`);
    console.log(`      H: ${headers} | L: ${lyrics} | U: ${uncertain} | E: ${empty}`);
  }
  
  // Interesting findings
  console.log('\n' + '═'.repeat(70));
  console.log('🔍 INTERESTING FINDINGS');
  console.log('═'.repeat(70));
  
  console.log('\n   🏷️  Headers caught in unusual formats:');
  for (const [category, results] of Object.entries(allResults)) {
    const headers = results.filter(r => r.type === 'header' && r.method === 'rule');
    if (headers.length > 0) {
      console.log(`\n      ${category}:`);
      headers.forEach(h => console.log(`         • "${h.text}"`));
    }
  }
  
  console.log('\n   ❓ Most uncertain classifications:');
  const allUncertain = Object.values(allResults)
    .flat()
    .filter(r => r.type === 'uncertain')
    .sort((a, b) => a.confidence - b.confidence)
    .slice(0, 10);
  
  allUncertain.forEach(u => {
    console.log(`      • "${u.text.substring(0, 40)}..." (conf: ${u.confidence.toFixed(4)})`);
  });
  
  console.log('\n' + '═'.repeat(70));
  console.log('✅ Edge Case Testing Complete!');
  console.log('═'.repeat(70));
  console.log('\n💡 The classifier handled these edge cases. Review the results');
  console.log('   to identify patterns that need improvement or special handling.\n');
}

runEdgeCaseTests().catch(error => {
  console.error('\n❌ Test failed:', error.message);
  console.error(error.stack);
  process.exit(1);
});
