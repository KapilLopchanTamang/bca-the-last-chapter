# 🎓 BCA — The Last Chapter
### Interactive 3D Graduation Memory Experience • Itahari Namuna College

A cinematic, emotional, and interactive 3D graduation memory website built for the BCA graduating batch of **Itahari Namuna College**. Designed as a permanent digital keepsake that graduates, professors, and friends can revisit anytime.

---

## ✨ Cinematic Journey

1. **Scene 1 — Itahari Namuna College 3D Reconstruction**:
   A detailed, recognizable 3D architectural reconstruction of Itahari Namuna College based on authentic reference photography:
   - 4-storey educational building with signature celestial blue & cyan facade (`#0298d7`).
   - Central projecting entrance tower with golden vertical piers and reflective tinted glass curtain wall.
   - Yellow header signboard: **"Itahari Namuna College"**.
   - Prominent official college emblem plaque mounted with beveled golden trim.
   - Ground-level entrance with blue cylindrical support columns.
   - Left wing with bulletin board, multi-pane windows, and top-floor panoramic ribbon windows.
   - Right wing with classroom window rows, exterior AC units, and signature blue pitched metal roof.
   - Campus plaza with paved courtyard, parking bay markings, flagpole, and landscaped garden beds.

2. **Scene 2 — Cinematic Drone Orbit**:
   When the visitor clicks **"REVISIT OUR MEMORIES"**, the soundtrack (*Badal Sari*) begins. The drone camera glides in a graceful curving arc around the front three-quarters of the college, showcasing the building's depth, roofline, and campus architecture.

3. **Scene 3 — Aerial Dive & Entrance Fly-Through**:
   The drone swoops down toward the central entrance porch, focusing on the official college emblem plaque, and glides smoothly through the double glass entryway into the campus lobby.

4. **Scene 4 — Interior Corridor to Classroom**:
   The camera travels smoothly down an authentic interior hallway corridor with polished terrazzo floor, warm sconces, and framed college honors, arriving directly in front of **Room 404 • BCA Batch**.

5. **Scene 5 — Classroom Doors Open & Memory Sequence**:
   The wooden double doors swing open inward on their hinges. Warm sunlight floods the hallway, and the camera glides into the classroom where 45 batch photographs float into center spotlight step-by-step, breathing and passing through.

6. **Scene 6 — Finale Mosaic Arc, Doors Close & Graduation Letter**:
   The photographs assemble into a grand 36-photo amphitheater arc, the camera gracefully retreats, the double doors latch shut flush, and the emotional graduation message with golden confetti appears.

---

## 🌟 Key Features

- **3D College Building**: Procedural Three.js geometry capturing the authentic architecture of Itahari Namuna College.
- **Official College Logo Signboard**: Framed institutional emblem mounted on the building facade.
- **Drone Camera Controller**: Smooth quintic smootherstep spline path from sky to entrance to corridor.
- **Interior Hallway Corridor**: Connects the building exterior to the classroom door in a seamless single-take camera flight.
- **Badal Sari 3D Cloud Atmosphere**: Drifting volumetric 3D clouds outside classroom windows and rolling across the floor.
- **Badal Sari Poetic Subtitles / Lyrics (`[L]`)**: Synchronized poetic lines celebrating the campus journey in Nepali and English.
- **Class Yearbook & Superlatives Modal (`[Y]`)**: Interactive roster modal celebrating batchmates.
- **Archival Keepsake Card Generator**: Downloadable 1200×630px high-resolution graduation certificate PNG.
- **Interactive Scrubber with Chapter Markers**: Timeline scrub bar with hover tooltips and instant chapter jump.
- **Volume Slider**: Expandable slider on the speaker icon.
- **Mobile Touch Gestures**: Swipe left/right to skip backward/forward 6s.
- **Auditorium Fullscreen Mode (`[F]`)**: Borderless projector mode for farewell ceremony stages.
- **Keyboard Shortcuts (`[?]`)**: Space (Play/Pause), F (Fullscreen), M (Mute), G (Gallery), Y (Yearbook), L (Lyrics), R (Restart), ← / → (Seek ±6s).
- **All 135 Photographs Gallery**: Filterable masonry gallery and full-screen lightbox.

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
│   │   ├── college/
│   │   │   ├── CollegeBuilding3D.tsx    # Itahari Namuna College 3D building
│   │   │   ├── CollegeLogoSign.tsx      # Official college emblem plaque
│   │   │   ├── CollegeEnvironment.tsx   # Campus plaza, flagpole, lighting
│   │   │   └── CollegeCorridor.tsx      # Interior hallway to classroom
│   │   ├── GraduationExperience.tsx     # Master orchestrator
│   │   ├── ClassroomScene.tsx           # 3D canvas scene & lights
│   │   ├── ClassroomDoor.tsx            # Double wooden doors (Room 404)
│   │   ├── ClassroomInterior.tsx        # Classroom interior, desks, blackboard
│   │   ├── CloudAtmosphere.tsx          # Badal Sari drifting clouds
│   │   ├── MemorySequence.tsx           # 3D photo choreography
│   │   ├── MemoryPhoto.tsx              # 3D textured photo card
│   │   ├── CinematicCamera.tsx          # Drone & dolly camera system
│   │   └── ParticleAtmosphere.tsx       # Golden floating dust particles
│   └── ui/
│       ├── OpeningScreen.tsx            # Cinematic title & play button
│       ├── AudioControls.tsx            # Scrubber, play/pause, time, volume
│       ├── ChapterIndicator.tsx         # Chapter title cards
│       ├── LyricsOverlay.tsx            # Badal Sari poetic lyrics subtitles
│       ├── KeyboardShortcutsModal.tsx   # Hotkeys helper guide
│       ├── BatchRosterModal.tsx         # Class yearbook & batch superlatives
│       ├── FinalGraduationOverlay.tsx   # Graduation letter & confetti
│       ├── MemoryGallery.tsx            # Responsive photo gallery
│       ├── PhotoLightbox.tsx            # High-res photo viewer
│       ├── ShareButton.tsx              # Web Share API & link copy
│       └── WebGLFallbackExperience.tsx   # Non-WebGL fallback
│
├── lib/
│   ├── memory-config.ts         # Central project & batch configuration
│   ├── asset-manifest.ts        # Generated manifest of all 135 photos
│   ├── audio-controller.ts      # HTML5 Audio engine with continuous sync
│   ├── timeline-controller.ts   # Audio-timeline synchronization
│   ├── texture-cache.ts         # Texture pre-warming & cache manager
│   ├── keepsake-generator.ts    # High-res keepsake PNG generator
│   └── sound-effects.ts         # Web Audio entrance chime
│
├── public/
│   ├── audio/
│   │   └── farewell.mp3         # Active soundtrack (Badal Sari)
│   ├── college/
│   │   ├── logo.jpg             # Official Itahari Namuna College emblem
│   │   └── building-ref.jpg     # Building reference photograph
│   └── memories/                # Web-optimized photographs
│       └── thumbs/              # Fast gallery thumbnails
│
└── photos/                      # Original full-resolution assets (untouched)
```

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

```bash
git add .
git commit -m "feat: Itahari Namuna College 3D cinematic drone opening"
git remote add origin https://github.com/<your-username>/bca-the-last-chapter.git
git push -u origin main
```
Import into [Vercel](https://vercel.com) for instant deployment!
