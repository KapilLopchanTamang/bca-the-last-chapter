import fs from 'fs';
import path from 'path';
import { MEMORY_CONFIG } from '../lib/memory-config';

console.log('--- RUNNING BCA GRADUATION SYSTEM TEST SUITE ---');

// 1. Verify Audio File
const audioPath = path.join(__dirname, '..', 'public', 'audio', 'farewell.mp3');
if (!fs.existsSync(audioPath)) {
  console.error('FAIL: farewell.mp3 missing!');
  process.exit(1);
}
const audioStats = fs.statSync(audioPath);
console.log(`PASS: Audio soundtrack verified (${(audioStats.size / 1024 / 1024).toFixed(2)} MB)`);

// 2. Verify Manifest and Images
const manifestPath = path.join(__dirname, '..', 'lib', 'asset-manifest.ts');
if (!fs.existsSync(manifestPath)) {
  console.error('FAIL: asset-manifest.ts missing!');
  process.exit(1);
}
console.log('PASS: asset-manifest.ts verified');

const totalDuration = 354.6; // duration of Badal Sari

console.log(`Checking memory config: Batch = "${MEMORY_CONFIG.batchName}", Chapters = ${MEMORY_CONFIG.chapterTimings.length}`);

// Simulate audio progression through the entire song
const checkpoints = [
  { t: 0, expectedPhase: 'INITIAL_ENTRANCE', desc: 'Entrance at start' },
  { t: 15, expectedPhase: 'DOOR_OPENING', desc: 'Doors opening inward' },
  { t: 45, expectedPhase: 'MEMORIES_ACTIVE', expectedChapter: 'beginning', desc: 'Chapter 1: The Beginning' },
  { t: 110, expectedPhase: 'MEMORIES_ACTIVE', expectedChapter: 'classroom', desc: 'Chapter 2: The Classroom' },
  { t: 190, expectedPhase: 'MEMORIES_ACTIVE', expectedChapter: 'friendships', desc: 'Chapter 3: The Friendships' },
  { t: 270, expectedPhase: 'MEMORIES_ACTIVE', expectedChapter: 'journey', desc: 'Chapter 4: The Journey' },
  { t: 320, expectedPhase: 'MEMORIES_ACTIVE', expectedChapter: 'final', desc: 'Chapter 5: The Final Chapter' },
  { t: 342, expectedPhase: 'DOOR_CLOSING', desc: 'Doors closing smoothly' },
  { t: 354, expectedPhase: 'FINAL_GRADUATION', desc: 'Final graduation message' },
];

function calculateStateSim(currentTime: number, duration: number) {
  const dur = Math.max(1, duration);
  const progress = Math.min(1, Math.max(0, currentTime / dur));
  const percent = progress * 100;

  const timings = MEMORY_CONFIG.chapterTimings;
  let activeChapter = timings[0];
  for (const ch of timings) {
    if (percent >= ch.startPercent && percent <= ch.endPercent) {
      activeChapter = ch;
      break;
    }
  }

  let phase = 'INITIAL_ENTRANCE';
  let doorAngle = 0;

  if (currentTime <= 0) {
    phase = 'INITIAL_ENTRANCE';
    doorAngle = 0;
  } else if (percent < 7) {
    phase = 'DOOR_OPENING';
    const openT = percent / 7;
    doorAngle = Math.sin((openT * Math.PI) / 2) * 1.55;
  } else if (percent < 95) {
    phase = 'MEMORIES_ACTIVE';
    doorAngle = 1.55;
  } else if (percent < 98.5) {
    phase = 'DOOR_CLOSING';
    const closeT = (percent - 95) / 3.5;
    doorAngle = Math.max(0, (1 - Math.sin((closeT * Math.PI) / 2)) * 1.55);
  } else {
    phase = 'FINAL_GRADUATION';
    doorAngle = 0;
  }

  return { progress, percent, phase, activeChapter, doorAngle };
}

checkpoints.forEach((cp) => {
  const state = calculateStateSim(cp.t, totalDuration);
  if (state.phase !== cp.expectedPhase) {
    console.error(`FAIL at t=${cp.t}s: Expected phase ${cp.expectedPhase}, got ${state.phase}`);
    process.exit(1);
  }
  if (cp.expectedChapter && state.activeChapter.id !== cp.expectedChapter) {
    console.error(`FAIL at t=${cp.t}s: Expected chapter ${cp.expectedChapter}, got ${state.activeChapter.id}`);
    process.exit(1);
  }
  console.log(`PASS: [${cp.t}s / ${state.percent.toFixed(1)}%] ${cp.desc} => Phase: ${state.phase}, Door Angle: ${state.doorAngle.toFixed(2)} rad`);
});

console.log('--- ALL ANIMATION AND TIMELINE TESTS PASSED ---');
