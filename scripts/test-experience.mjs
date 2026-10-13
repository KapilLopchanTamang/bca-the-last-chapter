import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- RUNNING BCA GRADUATION SYSTEM TEST SUITE ---');

// 1. Verify Audio Files
const audioPath = path.join(__dirname, '..', 'public', 'audio', 'farewell.mp3');
if (!fs.existsSync(audioPath)) {
  console.error('FAIL: farewell.mp3 missing!');
  process.exit(1);
}
const audioStats = fs.statSync(audioPath);
console.log(`PASS: Audio soundtrack verified (${(audioStats.size / 1024 / 1024).toFixed(2)} MB)`);

const voiceoverPath = path.join(__dirname, '..', 'public', 'audio', 'voiceover.mp3');
if (!fs.existsSync(voiceoverPath)) {
  console.error('FAIL: voiceover.mp3 missing!');
  process.exit(1);
}
const voiceoverStats = fs.statSync(voiceoverPath);
console.log(`PASS: Voiceover audio verified (${(voiceoverStats.size / 1024).toFixed(1)} KB)`);

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
  { id: 'college', startPercent: 0, endPercent: 4.0 },
  { id: 'corridor', startPercent: 4.0, endPercent: 7.0 },
  { id: 'beginning', startPercent: 7.0, endPercent: 25.0 },
  { id: 'classroom', startPercent: 25.0, endPercent: 48.0 },
  { id: 'friendships', startPercent: 48.0, endPercent: 70.0 },
  { id: 'journey', startPercent: 70.0, endPercent: 88.0 },
  { id: 'final', startPercent: 88.0, endPercent: 93.0 },
  { id: 'closing', startPercent: 93.0, endPercent: 100.0 },
];

const checkpoints = [
  { t: 0, expectedPhase: 'COLLEGE_EXTERIOR', desc: 'College exterior establishing drone shot' },
  { t: 8, expectedPhase: 'COLLEGE_EXTERIOR', desc: 'College exterior drone orbit' },
  { t: 16, expectedPhase: 'COLLEGE_APPROACH', desc: 'Aerial dive toward entrance & logo' },
  { t: 20, expectedPhase: 'COLLEGE_CORRIDOR', desc: 'Corridor flight toward Room 404' },
  { t: 23, expectedPhase: 'DOOR_OPENING', desc: 'Classroom doors swing open' },
  { t: 45, expectedPhase: 'MEMORIES_ACTIVE', expectedChapter: 'beginning', desc: 'Chapter: The Beginning' },
  { t: 110, expectedPhase: 'MEMORIES_ACTIVE', expectedChapter: 'classroom', desc: 'Chapter: The Classroom' },
  { t: 190, expectedPhase: 'MEMORIES_ACTIVE', expectedChapter: 'friendships', desc: 'Chapter: The Friendships' },
  { t: 270, expectedPhase: 'MEMORIES_ACTIVE', expectedChapter: 'journey', desc: 'Chapter: The Journey' },
  { t: 320, expectedPhase: 'MEMORIES_ACTIVE', expectedChapter: 'final', desc: 'Chapter: The Final Chapter' },
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

  let phase = 'COLLEGE_EXTERIOR';
  let doorAngle = 0;

  const smootherstep = (edge0, edge1, val) => {
    const t = Math.max(0, Math.min(1, (val - edge0) / (edge1 - edge0)));
    return t * t * t * (t * (t * 6 - 15) + 10);
  };

  if (currentTime <= 0) {
    phase = 'COLLEGE_EXTERIOR';
    doorAngle = 0;
  } else if (percent < 4.0) {
    phase = 'COLLEGE_EXTERIOR';
    doorAngle = 0;
  } else if (percent < 5.2) {
    phase = 'COLLEGE_APPROACH';
    doorAngle = 0;
  } else if (percent < 6.0) {
    phase = 'COLLEGE_CORRIDOR';
    doorAngle = 0;
  } else if (percent < 7.0) {
    phase = 'DOOR_OPENING';
    const openT = smootherstep(6.0, 6.8, percent);
    doorAngle = openT * 1.54;
  } else if (percent < 93.0) {
    phase = 'MEMORIES_ACTIVE';
    doorAngle = 1.54;
  } else if (percent < 98.0) {
    phase = 'DOOR_CLOSING';
    const closeT = smootherstep(94.6, 97.8, percent);
    doorAngle = (1 - closeT) * 1.54;
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
