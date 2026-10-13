const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SOURCE_DIR = path.join(__dirname, '..', 'photos');
const DEST_DIR = path.join(__dirname, '..', 'public', 'memories');
const THUMB_DIR = path.join(DEST_DIR, 'thumbs');
const MANIFEST_PATH = path.join(__dirname, '..', 'lib', 'asset-manifest.ts');

if (!fs.existsSync(DEST_DIR)) fs.mkdirSync(DEST_DIR, { recursive: true });
if (!fs.existsSync(THUMB_DIR)) fs.mkdirSync(THUMB_DIR, { recursive: true });

console.log('Discovering photos in:', SOURCE_DIR);
const files = fs.readdirSync(SOURCE_DIR);

const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.heic'];
const photoFiles = files
  .filter(f => {
    if (f.startsWith('.')) return false;
    const ext = path.extname(f).toLowerCase();
    return validExtensions.includes(ext);
  })
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

console.log(`Found ${photoFiles.length} valid photo files in photos/ directory.`);

// Clean up any existing photo-*.jpg in DEST_DIR and THUMB_DIR to prevent zombie files
const existingDestFiles = fs.readdirSync(DEST_DIR).filter(f => f.startsWith('photo-') && f.endsWith('.jpg'));
const existingThumbFiles = fs.existsSync(THUMB_DIR)
  ? fs.readdirSync(THUMB_DIR).filter(f => f.startsWith('photo-') && f.endsWith('.jpg'))
  : [];

existingDestFiles.forEach(f => {
  try { fs.unlinkSync(path.join(DEST_DIR, f)); } catch (e) {}
});
existingThumbFiles.forEach(f => {
  try { fs.unlinkSync(path.join(THUMB_DIR, f)); } catch (e) {}
});

// Chapter definitions
const CHAPTERS = [
  { id: 'beginning', title: 'The Beginning', subtitle: 'Every journey begins somewhere', tag: 'Freshers & First Days' },
  { id: 'classroom', title: 'The Classroom', subtitle: 'More than lectures. More than code.', tag: 'Labs, Lectures & Late Submissions' },
  { id: 'friendships', title: 'The Friendships', subtitle: 'Some classmates became lifelong family', tag: 'Canteen Chills & Endless Laughs' },
  { id: 'journey', title: 'The Journey', subtitle: 'We learned. We built. We grew.', tag: 'Events, Projects & Celebrations' },
  { id: 'final', title: 'The Final Chapter', subtitle: 'Different paths. One unforgettable story.', tag: 'Farewell & Forever Memories' },
];

const photoManifest = [];

photoFiles.forEach((file, index) => {
  const safeName = `photo-${String(index + 1).padStart(3, '0')}.jpg`;
  const srcPath = path.join(SOURCE_DIR, file);
  const destPath = path.join(DEST_DIR, safeName);
  const thumbPath = path.join(THUMB_DIR, safeName);

  // Convert/copy with sips to ensure standardized high quality JPEG at 1440px
  try {
    execSync(`sips -s format jpeg -Z 1440 -s formatOptions 82 "${srcPath}" --out "${destPath}"`, { stdio: 'ignore' });
  } catch (e) {
    console.warn(`Failed to process ${file} with sips, trying direct copy:`, e.message);
    fs.copyFileSync(srcPath, destPath);
  }

  try {
    execSync(`sips -s format jpeg -Z 480 -s formatOptions 75 "${destPath}" --out "${thumbPath}"`, { stdio: 'ignore' });
  } catch (e) {
    fs.copyFileSync(destPath, thumbPath);
  }

  // Get dimensions using sips
  let width = 1200;
  let height = 800;
  try {
    const dimOutput = execSync(`sips -g pixelWidth -g pixelHeight "${destPath}"`).toString();
    const wMatch = dimOutput.match(/pixelWidth:\s*(\d+)/);
    const hMatch = dimOutput.match(/pixelHeight:\s*(\d+)/);
    if (wMatch) width = parseInt(wMatch[1], 10);
    if (hMatch) height = parseInt(hMatch[1], 10);
  } catch (e) {
    // default
  }

  // Distribute into chapters evenly
  const chapterIndex = Math.min(
    Math.floor((index / photoFiles.length) * CHAPTERS.length),
    CHAPTERS.length - 1
  );
  const chapter = CHAPTERS[chapterIndex];

  photoManifest.push({
    id: `photo-${index + 1}`,
    originalName: file,
    src: `/memories/${safeName}`,
    thumb: `/memories/thumbs/${safeName}`,
    width,
    height,
    aspectRatio: Number((width / height).toFixed(3)),
    chapterId: chapter.id,
    chapterTitle: chapter.title,
    caption: `Memory #${index + 1}`,
  });
});

console.log(`Successfully processed ${photoManifest.length} photos.`);

// Ensure lib directory exists
const libDir = path.dirname(MANIFEST_PATH);
if (!fs.existsSync(libDir)) fs.mkdirSync(libDir, { recursive: true });

// Write TypeScript manifest
const tsContent = `// CENTRALIZED ASSET MANIFEST
// Automatically generated and completely customizable.
// Original assets remain safe in the /photos directory.

export interface PhotoAsset {
  id: string;
  originalName: string;
  src: string;
  thumb: string;
  width: number;
  height: number;
  aspectRatio: number;
  chapterId: 'beginning' | 'classroom' | 'friendships' | 'journey' | 'final';
  chapterTitle: string;
  caption?: string;
}

export const CHAPTER_CONFIG = ${JSON.stringify(CHAPTERS, null, 2)} as const;

export const PHOTO_MANIFEST: PhotoAsset[] = ${JSON.stringify(photoManifest, null, 2)};
`;

fs.writeFileSync(MANIFEST_PATH, tsContent, 'utf-8');
console.log(`Generated manifest with ${photoManifest.length} photos at: ${MANIFEST_PATH}`);
