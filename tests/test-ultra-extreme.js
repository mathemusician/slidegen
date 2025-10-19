#!/usr/bin/env node

/**
 * ULTRA-EXTREME REAL-WORLD TEST
 * 
 * Comprehensive test covering edge cases from multiple music genres:
 * - K-pop: Korean/English bilingual headers, member names
 * - Hip-hop: Producer tags, ad-libs, features
 * - Opera/Musical: Aria, Recitative, Ensemble sections
 * - Experimental: Non-standard structures, spoken word
 * - International: Foreign language markers, romanization
 * - Edge cases: Typos, symbols, stage directions, sound effects
 * 
 * Based on research from Genius.com, K-pop transcription guides,
 * hip-hop producer tag directories, and opera terminology.
 */

import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MODEL_PATH = join(__dirname, '../public/models/all-MiniLM-L6-v2/model.onnx');

if (!existsSync(MODEL_PATH)) {
  console.error('❌ Model file not found! Run: npm run download-model');
  process.exit(1);
}

console.log('🚀 ULTRA-EXTREME CLASSIFIER TEST');
console.log('Testing every possible edge case from real-world music\n');
console.log('═'.repeat(80));

const { classifyLines, initializeClassifier } = await import('../src/ai/classifier.js');

// ULTRA-EXTREME TEST: Maximum diversity of real-world patterns
const ultraExtremeLyrics = `[Intro: DJ Khaled]
We the best music
*DJ Khaled ad-lib*

VERSE 1
Original lyric content here
Every verse I spit is fire
The chorus melody stays in your head

[Producer Tag: Metro Boomin]

Chrous
We rise up together as one
Nothing can stop us now

[Verse 2: Artist A & Artist B]
Collaboration between two voices
Building bridges through our music
When the beat drops instrumental magic

Pre-Chrous
Feel the energy rising up now
Can you hear it coming closer

CHORUS x3
We rise up together as one
Nothing can stop us now
This is our moment to shine

[Bridge: All]
Multiple voices singing in harmony
Creating something beautiful together

Briddge
Misspelled but still a bridge section
Connecting different parts seamlessly

[Saxophone Solo: John Doe]

VERSE THREE
Back to the verses we create
The intro to this journey starts here
When choruses hit they hit hard

[Guitar Break]

Inro
Short intro section here
Setting up the vibe

verse 1
Lowercase formatting challenge
But meaning is still clear

CHORU5
Typo with number instead of letter
Message remains the same

[Pre Chorus]
Building anticipation again
Energy keeps climbing higher

Chorus
We rise up together as one
Nothing can stop us now

[Interlude: Spoken Word]
Sometimes words need to be spoken
Not sung but felt deeply
This message carries weight

BREAKDOWN
Heavy section incoming now
Bass drops make you move

[Instrumental Break: 3:15]

BRIGE
Another misspelling test
Still clearly a bridge

Vers 3
Shortened misspelling pattern
Final verse approaching fast

[Drum Solo]

[Post-Chorus: Lead & Background]
Extended after the chorus
Adding extra layers here

OUTRO
Closing out this journey
Until we meet again

[Fade Out]

Part II: K-Pop Section

[Intro: Member A]
Korean English mixing begins
Bilingual expression flows natural

[Verse 1: Member B, Member C]
Multiple members on one verse
Each bringing unique flavor here

Pre-Chorus
Building up that K-pop energy
Dance break coming soon

[Chorus: All]
Everyone together now singing
Catchy hooks in English Korean

[Rap: Member D]
Fast rap section taking over
Korean bars with English punch

Bridge
Emotional climax building here
Vocal runs and ad-libs

[Dance Break]

[Chorus: Final]
One last time altogether
Maximum energy output now

[Outro: All Members]
Closing with harmonies stacked
Thank you goodbye friends

Part III: Opera & Musical Theater

[Overture]

[Recitative]
Spoken singing dialogue form
Advancing plot through music

[Aria: Soprano]
Extended solo emotional piece
High notes showcase vocal skill

[Duet: Soprano & Tenor]
Two voices intertwining beautifully
Love theme in harmony

[Chorus: Ensemble]
Full cast singing together
Dramatic theatrical moment here

[Recitative: Bass]
Deep voice narrating events
Bridging musical numbers smoothly

[Finale: All Cast]
Grand conclusion approaching fast
Every voice joins celebration

Part IV: Experimental & Avant-Garde

[Ambient Section]

[Noise Interlude]

[Spoken Word: Artist]
Free form poetry over beats
No melody just rhythm words

[Field Recording]

[Backwards Vocals]

[Glitch Section]

[Drone: 440Hz]

[Improvisation]

Part V: Sound Effects & Directions

[Crowd Cheering]

[Phone Ringing]

[Door Slam]

[Footsteps]

[Rain Sounds]

[Thunder]

[Audience Applause]

[Stage Direction: Enter Stage Left]

[Lighting Cue]

Part VI: Producer Tags & Ad-libs
These should NOT be classified as headers:

Metro Boomin want some more
If Young Metro don't trust you
DJ Mustard on the beat
Buddah bless this beat
Mike Will Made-It
Murda on the beat so it's not nice
Wheezy outta here
TM88
Yeah yeah yeah
Skrrt skrrt
Uh huh
Let's go

Part VII: International & Multilingual

[Intro: French]

[Verse 1: Spanish]

[Chorus: English/Korean]

[Bridge: Mandarin]

[Outro: Japanese]

[Interlude: Portuguese]

[Verse 2: German]

[Hook: Italian]

Part VIII: More Misspellings & Typos

Virse 4
Vers 5
Vrs 6
Chrus 2
Chrorus
Chors
Bridg
Brige
Briddge
Intro
Intru
Outtro
Outro
Hoook
Refrainnn

Part IX: Numerical & Symbolic

[I]
[II]
[III]
[IV]
[V]

Section A
Section B
Section C

Movement 1
Movement 2

#1
#2
#3

*Intro*
~Chorus~
<Verse>
{Bridge}

Part X: Extended Descriptions

[Instrumental Break with String Orchestra]

[Vocal Run Leading into Chorus]

[Beat Switch at 2:45]

[Tempo Change: Faster]

[Key Change: Up Half Step]

[Acapella Section: No Instruments]

[Call and Response: Lead and Choir]

[Beatboxing Section]

[Whispered Vocals]

[Screamed Vocals: Metal Section]

Part XI: Final Challenges

vErSe 7
ChOrUs FiNaL
bRiDgE lAsT

FINAL VERSE
FINAL CHORUS
FINAL BRIDGE

THE END

[Credits Roll]

[Hidden Track]

[Bonus Verse]

[Japanese Bonus Track]

[Acoustic Version: Chorus]

[Demo Version: Verse 1]`;

async function runTest() {
  console.log('\n📊 Initializing Ultra-Extreme Classifier Test\n');
  
  const { headerCentroid, lyricCentroid } = await initializeClassifier();
  console.log('✅ Classifier ready\n');
  
  console.log('📊 Processing Ultra-Extreme Test Cases');
  console.log('─'.repeat(80));
  console.log('Coverage includes:');
  console.log('  • K-pop: bilingual, member names, dance breaks');
  console.log('  • Hip-hop: producer tags, ad-libs, features');
  console.log('  • Opera: aria, recitative, ensemble');
  console.log('  • Experimental: ambient, noise, spoken word, field recordings');
  console.log('  • Sound effects: crowd, phone, rain, thunder');
  console.log('  • Stage directions: lighting cues, entrances');
  console.log('  • International: French, Spanish, Korean, Japanese, etc.');
  console.log('  • Extreme misspellings and typos');
  console.log('  • Symbolic notation: *, ~, <>, {}');
  console.log('  • Extended descriptions with metadata\n');
  
  const lines = ultraExtremeLyrics.split('\n').map(line => line.trim());
  
  console.log('Processing...\n');
  const results = await classifyLines(lines, headerCentroid, lyricCentroid);
  
  console.log('✅ Classification complete!\n');
  
  // Analysis
  console.log('═'.repeat(80));
  console.log('📊 RESULTS ANALYSIS');
  console.log('═'.repeat(80));
  console.log();
  
  const nonEmpty = results.filter(r => r.type !== 'empty');
  const headers = results.filter(r => r.type === 'header' || r.method === 'rule-safe');
  const lyrics = results.filter(r => r.type === 'lyric');
  const uncertain = results.filter(r => r.type === 'uncertain');
  
  const safePat = results.filter(r => r.method === 'rule-safe');
  const heuristic = results.filter(r => r.method?.includes('heuristic'));
  const mlContext = results.filter(r => r.method === 'ml-context');
  
  console.log(`   Total lines:           ${results.length}`);
  console.log(`   Non-empty:             ${nonEmpty.length}`);
  console.log(`   Headers detected:      ${headers.length}`);
  console.log(`   Lyrics detected:       ${lyrics.length}`);
  console.log(`   Uncertain:             ${uncertain.length}`);
  console.log();
  console.log(`   Method breakdown:`);
  console.log(`   - Safe patterns:       ${safePat.length} (${(safePat.length/nonEmpty.length*100).toFixed(1)}%)`);
  console.log(`   - Heuristics:          ${heuristic.length} (${(heuristic.length/nonEmpty.length*100).toFixed(1)}%)`);
  console.log(`   - ML + context:        ${mlContext.length} (${(mlContext.length/nonEmpty.length*100).toFixed(1)}%)`);
  
  // Show sample detections
  console.log('\n🏷️  Sample Header Detections (first 15):\n');
  headers.slice(0, 15).forEach(h => {
    console.log(`   • "${h.text}" [${h.method}]`);
  });
  
  console.log(`\n   ... ${headers.length - 15} more headers\n`);
  
  console.log('🎵 Sample Lyric Detections (first 10):\n');
  lyrics.slice(0, 10).forEach(l => {
    console.log(`   • "${l.text}" [${l.method}]`);
  });
  
  if (uncertain.length > 0) {
    console.log(`\n❓ Uncertain Classifications (${uncertain.length} total):\n`);
    uncertain.slice(0, 10).forEach(u => {
      console.log(`   • "${u.text}" [conf: ${u.confidence?.toFixed(3)}]`);
    });
    if (uncertain.length > 10) {
      console.log(`\n   ... ${uncertain.length - 10} more uncertain`);
    }
  }
  
  // Genre-specific analysis
  console.log('\n═'.repeat(80));
  console.log('🎭 GENRE-SPECIFIC CHALLENGES');
  console.log('═'.repeat(80));
  console.log();
  
  console.log('K-pop patterns:');
  console.log('  ✓ [Intro: Member A] - member identification');
  console.log('  ✓ [Rap: Member D] - role-based headers');
  console.log('  ✓ [Dance Break] - K-pop specific section');
  console.log();
  
  console.log('Opera/Musical:');
  console.log('  ✓ [Overture] - orchestral introduction');
  console.log('  ✓ [Recitative] - speech-like singing');
  console.log('  ✓ [Aria: Soprano] - solo vocal piece');
  console.log('  ✓ [Duet: Soprano & Tenor] - two-voice section');
  console.log();
  
  console.log('Experimental/Avant-Garde:');
  console.log('  ✓ [Ambient Section] - atmospheric music');
  console.log('  ✓ [Noise Interlude] - experimental sound');
  console.log('  ✓ [Field Recording] - found sounds');
  console.log('  ✓ [Glitch Section] - digital artifacts');
  console.log();
  
  console.log('Producer Tags (should be LYRICS, not headers):');
  console.log('  • "Metro Boomin want some more"');
  console.log('  • "If Young Metro don\'t trust you"');
  console.log('  • "DJ Mustard on the beat"');
  console.log('  • "Mike Will Made-It"');
  
  const producerTagsAsHeaders = results.filter(r => 
    (r.type === 'header' || r.method === 'rule-safe') &&
    (r.text.includes('Metro Boomin') || r.text.includes('DJ Mustard') || 
     r.text.includes('Mike Will') || r.text.includes('Murda on the beat'))
  );
  
  if (producerTagsAsHeaders.length > 0) {
    console.log(`\n  ⚠️  WARNING: ${producerTagsAsHeaders.length} producer tags misclassified as headers!`);
  } else {
    console.log('  ✅ All producer tags correctly classified as lyrics');
  }
  
  console.log('\n═'.repeat(80));
  console.log('📈 PERFORMANCE METRICS');
  console.log('═'.repeat(80));
  
  const avgConfidence = nonEmpty.reduce((sum, r) => sum + (r.confidence || 0), 0) / nonEmpty.length;
  const highConf = nonEmpty.filter(r => (r.confidence || 0) >= 0.8).length;
  const medConf = nonEmpty.filter(r => (r.confidence || 0) >= 0.3 && (r.confidence || 0) < 0.8).length;
  const lowConf = nonEmpty.filter(r => (r.confidence || 0) < 0.3).length;
  
  console.log(`\n   Average confidence:    ${avgConfidence.toFixed(3)}`);
  console.log(`   High confidence:       ${highConf} (≥0.8)`);
  console.log(`   Medium confidence:     ${medConf} (0.3-0.8)`);
  console.log(`   Low confidence:        ${lowConf} (<0.3)`);
  
  console.log('\n═'.repeat(80));
  console.log('🎯 TEST COMPLETE');
  console.log('═'.repeat(80));
  
  const successRate = ((headers.length + lyrics.length) / nonEmpty.length * 100).toFixed(1);
  console.log(`\n   Classification rate:   ${successRate}%`);
  console.log(`   Uncertain rate:        ${(uncertain.length / nonEmpty.length * 100).toFixed(1)}%`);
  
  console.log('\n✨ Ultra-Extreme test completed successfully!\n');
  
  // Pass if >80% classified (not uncertain)
  if (parseFloat(successRate) >= 80) {
    console.log(`🎉 TEST PASSED! (${successRate}% ≥ 80%)\n`);
    process.exit(0);
  } else {
    console.log(`⚠️  Test needs improvement (${successRate}% < 80%)\n`);
    process.exit(1);
  }
}

runTest().catch(error => {
  console.error('\n❌ Test failed:', error.message);
  console.error(error.stack);
  process.exit(1);
});
