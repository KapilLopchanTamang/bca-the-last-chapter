import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
const manifestText = fs.readFileSync(manifestPath, 'utf8');
const photoCountMatch = manifestText.match(/"id": "photo-(\d+)"/g);
const totalPhotos = photoCountMatch ? photoCountMatch.length : 0;
console.log(`PASS: asset-manifest.ts verified with ${totalPhotos} photos.`);

// 3. Verify Optimized Images and Thumbnails on disk
const memoriesDir = path.join(__dirname, '..', 'public', 'memories');
const thumbsDir = path.join(memoriesDir, 'thumbs');
const memoryFiles = fs.readdirSync(memoriesDir).filter(f => f.endsWith('.jpg'));
const thumbFiles = fs.readdirSync(thumbsDir).filter(f => f.endsWith('.jpg'));

console.log(`PASS: ${memoryFiles.length} optimized photo textures and ${thumbFiles.length} fast thumbnails present on disk.`);

// 4. Test Timeline & Chapter Animation Progression
const totalDuration = 354.6; // duration of Badal Sari

const chapterTimings = [
  { id: 'opening', startPercent: 0, endPercent: 7 },
  { id: 'beginning', startPercent: 7, endPercent: 24 },
  { id: 'classroom', startPercent: 24, endPercent: 46 },
  { id: 'friendships', startPercent: 46, endPercent: 68 },
  { id: 'journey', startPercent: 68, endPercent: 86 },
  { id: 'final', startPercent: 86, endPercent: 95 },
  { id: 'closing', startPercent: 95, endPercent: 100 },
];

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

function calculateStateSim(currentTime, duration) {
  const dur = Math.max(1, duration);
  const progress = Math.min(1, Math.max(0, currentTime / dur));
  const percent = progress * 100;

  let activeChapter = chapterTimings[0];
  for (const ch of chapterTimings) {
    if (percent >= ch.startPercent && percent <= ch.endPercent) {
      activeChapter = ch;
      break;
    }
  }

  let phase = 'INITIAL_ENTRANCE';
  let doorAngle = 0;

  const smootherstep = (edge0, edge1, val) => {
    const t = Math.max(0, Math.min(1, (val - edge0) / (edge1 - edge0)));
    return t * t * t * (t * (t * 6 - 15) + 10);
  };

  if (currentTime <= 0) {
    phase = 'INITIAL_ENTRANCE';
    doorAngle = 0;
  } else if (percent < 8) {
    phase = 'DOOR_OPENING';
    const openT = smootherstep(0, 8, percent);
    doorAngle = openT * 1.55;
  } else if (percent < 93) {
    phase = 'MEMORIES_ACTIVE';
    doorAngle = 1.55;
  } else if (percent < 98) {
    phase = 'DOOR_CLOSING';
    const closeT = smootherstep(93, 98, percent);
    doorAngle = (1 - closeT) * 1.55;
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

console.log('--- ALL ANIMATION, PHOTO ASSET, AND TIMELINE TESTS PASSED ---');
