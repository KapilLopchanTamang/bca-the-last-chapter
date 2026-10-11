# 🎓 BCA — The Last Chapter
### Interactive 3D Graduation Memory Experience

A cinematic, emotional, and interactive 3D graduation memory website built for our BCA graduating batch. Designed as a permanent digital keepsake that graduates, professors, and friends can revisit anytime.

---

## ✨ Features

- **3D Classroom Entrance & Door Animation**: Procedurally modeled double wooden doors with realistic brass handles, hinges, door plate, and warm sunlight leaking through the threshold. When visitors press **“REVISIT OUR MEMORIES”**, the doors smoothly swing inward, welcoming you back into the classroom.
- **Atmospheric 3D Classroom Environment**: Vintage warm pendant lamps, wooden parquet floors with specular reflections, large sunlit windows, student desks, and a chalkboard with graduation code.
- **Badal Sari 3D Cloud Atmosphere**: Procedural volumetric clouds drifting outside the windows, misty low-altitude clouds floating across the classroom floor, and dreamy ambient clouds behind center-stage memories.
- **Physical Floating Memory Photographs**: Photographs enter the 3D space step-by-step with realistic paper frames, exact aspect ratios (never cropped or distorted), hover effects, and organic floating motion.
- **Audio-Synchronized Story Chapters**: Synchronized with the soundtrack (`Badal Sari`), transitioning through narrative chapters:
  1. **Classroom Entrance**: The doors open to the past.
  2. **The Beginning**: First days, freshers, entering college.
  3. **The Classroom**: Lectures, computer labs, late assignment submissions.
  4. **The Friendships**: Canteen chills, laughter, candid moments.
  5. **The Journey**: Events, presentations, project showcases, trips.
  6. **The Final Chapter**: Graduation memories, gathering into a grand mosaic composition.
  7. **Forever Memories**: The doors close on their hinges, leaving the graduation letter and confetti.
- **Badal Sari Poetic Subtitles / Lyrics**: Synchronized poetic lines in Nepali and English celebrating the college journey and the cloud metaphor. Can be toggled on/off with `[L]`.
- **Class Yearbook & Batch Superlatives**: Interactive roster modal celebrating batchmates, nicknames, and graduation quotes. Accessible anytime via `[Y]`.
- **Archival Keepsake Card Generator**: Generates a high-resolution 1200×630px commemorative graduation certificate PNG on-the-fly using HTML5 Canvas.
- **Interactive Scrubber with Chapter Markers**: Timeline scrub bar with visual chapter divider marks, duration stamps, live audio equalizer bars, and hover tooltips showing chapter titles and time.
- **Interactive Volume Slider**: Expandable volume slider on the speaker icon.
- **Mobile Touch Gestures**: Swipe left to skip forward 6s, swipe right to skip backward 6s.
- **Auditorium Fullscreen Mode (`[F]`)**: Borderless fullscreen mode tailored for campus projector screens.
- **Keyboard Shortcuts (`[?]`)**: Space (Play/Pause), F (Fullscreen), M (Mute), G (Gallery), Y (Yearbook), L (Lyrics), R (Restart), ← / → (Seek ±6s).
- **Explore Photographs (Gallery Mode)**: A responsive masonry gallery allowing visitors to explore all 135 photographs anytime, with chapter filters and search.
- **Full-Screen Lightbox**: High-resolution photo inspection with keyboard shortcuts (Escape, Left, Right arrows), captioning, and download button.
- **Web Share Integration**: Share the permanent experience directly via native Web Share or copy-to-clipboard fallback.
- **Graceful WebGL Fallback**: High-performance responsive experience for devices without WebGL acceleration.

---

## 📁 Project Structure

```
├── app/
│   ├── globals.css              # Film grain overlay & design tokens
│   ├── layout.tsx               # Serif typography & OpenGraph metadata
│   ├── opengraph-image.tsx      # Dynamic social share card
│   └── page.tsx                 # Dynamic client-only entry point
│
├── components/
│   ├── experience/
│   │   ├── GraduationExperience.tsx # Master experience orchestrator
│   │   ├── ClassroomScene.tsx       # 3D canvas scene & lights
│   │   ├── ClassroomDoor.tsx        # Realistic double wooden doors
│   │   ├── ClassroomInterior.tsx    # Classroom environment & chalkboard
│   │   ├── CloudAtmosphere.tsx      # Badal Sari drifting volumetric clouds
│   │   ├── MemorySequence.tsx       # 3D photo choreography & finale
│   │   ├── MemoryPhoto.tsx          # 3D textured photo card
│   │   ├── CinematicCamera.tsx      # Smooth camera journey
│   │   └── ParticleAtmosphere.tsx   # Golden floating dust particles
│   └── ui/
│       ├── OpeningScreen.tsx        # Cinematic title & play button
│       ├── AudioControls.tsx        # Scrubber, play/pause, time, volume
│       ├── ChapterIndicator.tsx     # Chapter title cards
│       ├── LyricsOverlay.tsx        # Badal Sari poetic lyrics subtitles
│       ├── KeyboardShortcutsModal.tsx # Full keyboard controls guide
│       ├── BatchRosterModal.tsx     # Class yearbook & batch superlatives
│       ├── FinalGraduationOverlay.tsx # Emotional graduation message & confetti
│       ├── MemoryGallery.tsx        # Responsive photo gallery
│       ├── PhotoLightbox.tsx        # High-res photo viewer
│       ├── ShareButton.tsx          # Web Share API & link copy
│       ├── LoadingScreen.tsx        # Preloader
│       └── WebGLFallbackExperience.tsx # Non-WebGL fallback
│
├── lib/
│   ├── memory-config.ts         # Central project & batch configuration
│   ├── asset-manifest.ts        # Generated manifest of all 135 photos
│   ├── audio-controller.ts      # HTML5 Audio engine
│   ├── timeline-controller.ts   # Audio-timeline synchronization
│   ├── keepsake-generator.ts    # High-res keepsake PNG generator
│   ├── sound-effects.ts         # Web Audio entrance chime
│   └── utils.ts                 # Formatting & math helpers
│
├── public/
│   ├── audio/
│   │   └── farewell.mp3         # Active soundtrack (Badal Sari)
│   └── memories/                # Web-optimized photographs
│       └── thumbs/              # Fast gallery thumbnails
│
├── scripts/
│   └── prepare-assets.js        # Script to optimize images and update manifest
│
└── photos/                      # Original full-resolution assets (untouched)
```

---

## 🛠️ How to Customize

### 1. How to Edit the Graduation Message & Batch Info
Open `lib/memory-config.ts`. You can edit:
- **College Name**: `collegeName`
- **Batch Name**: `batchName`
- **Graduation Year**: `graduationYear`
- **Opening Title & Quotes**: `opening.title`, `opening.quote`
- **Final Graduation Letter**: `finalMessage.mainHeading`, `finalMessage.subHeading`, `finalMessage.quoteLines`
- **Signatures**: `finalMessage.signatureTitle`, `finalMessage.signatureSub`
- **Batch Members & Superlatives**: `batchMembers` array

### 2. How to Add or Replace Photographs
1. Put new photos into the `photos/` folder.
2. Run:
   ```bash
   node scripts/prepare-assets.js
   ```
   This will automatically convert any `.HEIC` images, optimize web resolutions to prevent GPU crashes, generate thumbnails, compute precise aspect ratios, and update `lib/asset-manifest.ts`!

### 3. How to Replace the Soundtrack
1. Put your new MP3 in `public/audio/farewell.mp3` (or update `MEMORY_CONFIG.audio.src` in `lib/memory-config.ts`).
2. The entire 3D camera timeline, door opening, and chapter timings automatically scale to match the exact duration of your audio file!

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Build for production
npm run build

# 3. Start production server
npm run start -- -p 3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to Vercel

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: BCA The Last Chapter graduation experience"
   git remote add origin https://github.com/<your-username>/bca-the-last-chapter.git
   git push -u origin main
   ```
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Framework Preset will be automatically detected as **Next.js**.
5. Click **Deploy**!
