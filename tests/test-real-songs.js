#!/usr/bin/env node

/**
 * Real Song Testing Suite
 * Tests classifier on actual song lyrics from various genres
 */

import { classifyLines, initializeClassifier, getClassificationStats } from '../src/ai/classifier.js';

console.log('🎵 Real Song Lyrics Testing\n');
console.log('═'.repeat(70));

const realSongs = {
  "Pop Song (Standard Format)": `[Verse 1]
I woke up this morning feeling brand new
The sun is shining and I'm thinking of you
Every moment feels like a dream come true
Can't wait to spend another day with you

[Pre-Chorus]
And when the night falls
I'll be there to catch you

[Chorus]
We're dancing in the moonlight
Everything feels so right
Hold me close, never let me go
This is all I need to know

[Verse 2]
We've been through ups and downs
But we always come around
Together we are strong
This is where we belong

[Chorus]
We're dancing in the moonlight
Everything feels so right
Hold me close, never let me go
This is all I need to know

[Bridge]
Time stands still when I'm with you
Nothing else matters, just me and you

[Chorus]
We're dancing in the moonlight
Everything feels so right
Hold me close, never let me go
This is all I need to know`,

  "Hip-Hop Song (Non-Standard Format)": `INTRO
Yeah, uh
Let me tell you something

V1
Started from the bottom now we here
Grinding every day throughout the year
Never looking back, no time for fear
Vision crystal clear, the path is near

HOOK
We rise, we grind, we shine
This moment is mine, all mine
Can't stop, won't stop the climb
It's our time, it's our time

V2
They said I couldn't make it this far
Now I'm riding in a foreign car
Dreams bigger than the brightest star
Showing everyone just who we are

HOOK
We rise, we grind, we shine
This moment is mine, all mine
Can't stop, won't stop the climb
It's our time, it's our time

BRIDGE
Remember days with nothing in my pocket
Now success is something I can't block it
Every setback was just fuel to rocket
To the top, yeah, I'm about to lock it

OUTRO
This is just the beginning
Keep winning, keep winning`,

  "Rock Song (Uppercase Headers)": `INTRO
[Guitar riff]

VERSE 1
Running down this endless road
Carrying this heavy load
Searching for a place called home
In this world I feel alone

CHORUS
Break these chains and set me free
Find the light so I can see
No more living in the dark
Time to make a brand new start

VERSE 2
Scars remind me where I've been
Battles lost but wars to win
Standing up against the storm
From the ashes I'll be reborn

CHORUS
Break these chains and set me free
Find the light so I can see
No more living in the dark
Time to make a brand new start

BREAKDOWN
[Heavy instrumental]

BRIDGE
I won't give up, I won't give in
This is where my life begins
Rising from the ground below
Watch me as I start to grow

CHORUS (X2)
Break these chains and set me free
Find the light so I can see
No more living in the dark
Time to make a brand new start

OUTRO
[Fade out]`,

  "Country Song (Simple Format)": `Verse 1:
Sitting on my front porch swing
Listening to the mockingbirds sing
Sunset painting the sky orange and gold
This simple life never gets old

Chorus:
Take me back to those country roads
Where the river flows and the wildflower grows
Simple life with nothing to hide
That's where I want to spend my time

Verse 2:
Morning coffee with a view
Watching the world wake up brand new
Neighbors waving as they pass by
Living easy under southern sky

Chorus:
Take me back to those country roads
Where the river flows and the wildflower grows
Simple life with nothing to hide
That's where I want to spend my time

Bridge:
City lights can't compare
To the peace I find out there
Where the stars shine bright at night
And everything just feels right

Chorus:
Take me back to those country roads
Where the river flows and the wildflower grows
Simple life with nothing to hide
That's where I want to spend my time`,

  "R&B Song (Mixed Format)": `Intro:
Ooh, yeah
Baby, listen

[Verse 1]
Late night, thinking about you
Can't sleep, missing what we used to do
Your smile, your touch, your everything
Girl, you're my queen, my everything

PRE
Don't want nobody else
You're all I need, can't help myself

[Chorus]
I'm falling, falling deep for you
Every day feels like something new
Can't imagine life without you here
You're my love, you're my dear

[Verse 2]
Candlelight, dinner for two
Every moment I want to spend with you
Your eyes tell me all I need to know
Baby, please don't ever let me go

PRE CHORUS
Don't want nobody else
You're all I need, can't help myself

[Chorus]
I'm falling, falling deep for you
Every day feels like something new
Can't imagine life without you here
You're my love, you're my dear

[Bridge]
Through the highs and lows
Wherever life goes
I'll be by your side
You're my pride

[Chorus]
I'm falling, falling deep for you
Every day feels like something new
Can't imagine life without you here
You're my love, you're my dear

Outro:
Forever and always
Forever and always`
};

async function runRealSongTests() {
  console.log('\n📊 Initializing Classifier...\n');
  const { headerCentroid, lyricCentroid } = await initializeClassifier();
  
  let songNumber = 1;
  const allStats = [];
  
  for (const [title, lyrics] of Object.entries(realSongs)) {
    console.log(`\n${'═'.repeat(70)}`);
    console.log(`🎵 Song ${songNumber}: ${title}`);
    console.log('═'.repeat(70));
    
    const lines = lyrics.split('\n');
    const results = await classifyLines(lines, headerCentroid, lyricCentroid);
    
    // Show results
    console.log();
    for (const result of results) {
      if (result.type === 'empty') continue;
      
      let icon, color;
      if (result.type === 'header') {
        icon = '🏷️ ';
        color = '\x1b[44m';
      } else if (result.type === 'uncertain') {
        icon = '❓';
        color = '\x1b[43m';
      } else {
        icon = '🎵';
        color = '\x1b[42m';
      }
      
      const reset = '\x1b[0m';
      const method = result.method === 'rule' ? '[R]' : '[M]';
      const conf = result.confidence?.toFixed(3) || 'N/A';
      
      console.log(`${icon} ${color}${result.type.toUpperCase().padEnd(10)}${reset} ${method} (${conf}) ${result.text.substring(0, 50)}`);
    }
    
    const stats = getClassificationStats(results);
    allStats.push({ title, stats });
    
    console.log(`\n📊 Stats: ${stats.headers} headers | ${stats.lyrics} lyrics | ${stats.uncertain} uncertain`);
    console.log(`   Method: ${stats.ruleAccuracy} rule-based | ${stats.mlAccuracy} ML-based`);
    
    songNumber++;
  }
  
  // Overall summary
  console.log(`\n${'═'.repeat(70)}`);
  console.log('📊 OVERALL SUMMARY');
  console.log('═'.repeat(70));
  
  const totalStats = allStats.reduce((acc, { stats }) => {
    acc.headers += stats.headers;
    acc.lyrics += stats.lyrics;
    acc.uncertain += stats.uncertain;
    acc.ruleClassified += stats.ruleClassified;
    acc.mlClassified += stats.mlClassified;
    return acc;
  }, { headers: 0, lyrics: 0, uncertain: 0, ruleClassified: 0, mlClassified: 0 });
  
  const total = totalStats.headers + totalStats.lyrics + totalStats.uncertain;
  
  console.log(`\n   Total classifications:  ${total}`);
  console.log(`   Headers detected:       ${totalStats.headers} (${(totalStats.headers/total*100).toFixed(1)}%)`);
  console.log(`   Lyrics detected:        ${totalStats.lyrics} (${(totalStats.lyrics/total*100).toFixed(1)}%)`);
  console.log(`   Uncertain:              ${totalStats.uncertain} (${(totalStats.uncertain/total*100).toFixed(1)}%)`);
  console.log(`\n   Rule-based success:     ${totalStats.ruleClassified} (${(totalStats.ruleClassified/total*100).toFixed(1)}%)`);
  console.log(`   ML-based success:       ${totalStats.mlClassified} (${(totalStats.mlClassified/total*100).toFixed(1)}%)`);
  
  console.log(`\n   🎯 Header Detection Rate: ${(totalStats.headers/(totalStats.headers + totalStats.uncertain)*100).toFixed(1)}%`);
  
  console.log('\n' + '═'.repeat(70));
  console.log('✅ Real Song Testing Complete!');
  console.log('═'.repeat(70));
  console.log();
}

runRealSongTests().catch(error => {
  console.error('\n❌ Test failed:', error.message);
  console.error(error.stack);
  process.exit(1);
});
