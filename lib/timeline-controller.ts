// TIMELINE CONTROLLER
// Synchronizes audio playback time with 3D camera choreography,
// door states, chapter progressions, and photo animations.

import { MEMORY_CONFIG, ChapterTiming } from "./memory-config";
import { AudioController } from "./audio-controller";
import { PHOTO_MANIFEST } from "./asset-manifest";

export type CinematicPhase =
  | "COLLEGE_EXTERIOR"  // Wide establishing shot & drone orbit of Itahari Namuna College
  | "COLLEGE_APPROACH"  // Swoop down toward the central entrance porch & emblem
  | "COLLEGE_CORRIDOR"  // Fly down interior corridor toward Room 404
  | "DOOR_OPENING"      // Classroom doors swing open, camera pushes into classroom
  | "MEMORIES_ACTIVE"   // Active photographic journey in 3D classroom
  | "DOOR_CLOSING"      // Photos gather into arc, doors swing shut
  | "FINAL_GRADUATION"; // Graduation message displayed on closed door

export interface TimelineState {
  progress: number; // 0 to 1
  currentTime: number;
  duration: number;
  phase: CinematicPhase;
  currentChapter: ChapterTiming;
  chapterProgress: number; // 0 to 1 within the current chapter
  doorAngle: number; // 0 (closed) to 1.55 (fully open in radians)
  lightIntensity: number;
  memoryStreamProgress: number; // 0 to 1 continuous memory progress
  liveStreamIndex: number; // Continuous stream index (0 to 134) for smooth spotlight transitions
}

export class TimelineController {
  private static instance: TimelineController | null = null;
  private listeners: Set<(state: TimelineState) => void> = new Set();
  private state: TimelineState;
  private lastCalcTime: number = -1;
  private lastCalcDuration: number = -1;
  private cachedLiveState: TimelineState | null = null;

  private constructor() {
    this.state = this.calculateState(0, 354);
  }

  public static getInstance(): TimelineController {
    if (!TimelineController.instance) {
      TimelineController.instance = new TimelineController();
    }
    return TimelineController.instance;
  }

  public calculateState(currentTime: number, duration: number): TimelineState {
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

    const chDurationPct = Math.max(0.1, activeChapter.endPercent - activeChapter.startPercent);
    const chapterProgress = Math.min(
      1,
      Math.max(0, (percent - activeChapter.startPercent) / chDurationPct)
    );

    // Smooth quintic smootherstep easing (zero acceleration at boundaries)
    const smootherstep = (edge0: number, edge1: number, val: number) => {
      const t = Math.max(0, Math.min(1, (val - edge0) / (edge1 - edge0)));
      return t * t * t * (t * (t * 6 - 15) + 10);
    };

    // Total photos in memory sequence (dynamically synchronized with asset manifest)
    const totalPhotos = Math.max(1, PHOTO_MANIFEST.length);

    // Determine cinematic phase and synchronized values
    let phase: CinematicPhase = "COLLEGE_EXTERIOR";
    let doorAngle = 0;
    let lightIntensity = 1.2;
    let memoryStreamProgress = 0;
    let liveStreamIndex = -1.5;

    // Synchronize opening duration with 24.68s voiceover narration (~7.0%)
    const VOICEOVER_CUTOFF = 7.0;

    if (currentTime <= 0) {
      phase = "COLLEGE_EXTERIOR";
      doorAngle = 0;
      lightIntensity = 1.2;
      memoryStreamProgress = 0;
      liveStreamIndex = -1.5;
    } else if (percent < 4.0) {
      // SCENE 1 & 2: Establishing shot & rotating drone orbit of Itahari Namuna College (0% to 4.0%)
      phase = "COLLEGE_EXTERIOR";
      doorAngle = 0;
      lightIntensity = 1.35;
      memoryStreamProgress = 0;
      liveStreamIndex = -1.5;
    } else if (percent < 5.2) {
      // SCENE 3: Aerial dive toward entrance & logo (4.0% to 5.2%)
      phase = "COLLEGE_APPROACH";
      doorAngle = 0;
      lightIntensity = 1.4;
      memoryStreamProgress = 0;
      liveStreamIndex = -1.5;
    } else if (percent < 6.0) {
      // SCENE 3 cont: Interior corridor flight toward Room 404 (5.2% to 6.0%)
      phase = "COLLEGE_CORRIDOR";
      doorAngle = 0;
      lightIntensity = 1.15;
      memoryStreamProgress = 0;
      liveStreamIndex = -1.5;
    } else if (percent < VOICEOVER_CUTOFF) {
      // SCENE 4: Classroom doors swing open, camera zooms inside (6.0% to 7.0%)
      phase = "DOOR_OPENING";
      const doorOpenT = smootherstep(6.0, 6.8, percent);
      doorAngle = doorOpenT * 1.54; // ~88 degrees inward swing
      lightIntensity = 1.15 + doorOpenT * 0.55;
      memoryStreamProgress = 0;
      // Photo 0 glides forward from depth (-1.2) towards center spotlight (0.0) as doors open
      const enterT = smootherstep(6.1, 7.0, percent);
      liveStreamIndex = -1.2 + enterT * 1.2;
    } else if (percent < 93.0) {
      // SCENE 5: Existing photo memory experience active (7.0% to 93%)
      phase = "MEMORIES_ACTIVE";
      doorAngle = 1.54;
      lightIntensity = 1.7;
      memoryStreamProgress = Math.min(1, Math.max(0, (percent - VOICEOVER_CUTOFF) / (93.0 - VOICEOVER_CUTOFF)));

      // Calculate continuous stream index with calm front-end plateau holds
      const rawIndex = memoryStreamProgress * (totalPhotos - 1);
      const baseIndex = Math.floor(rawIndex);
      const frac = rawIndex - baseIndex;

      // Hold on the photo for 38% of the time, then smoothly transition over 62%
      let shapedFrac = 0;
      if (frac < 0.38) {
        shapedFrac = 0; // Pure hold on baseIndex!
      } else {
        const transT = (frac - 0.38) / (1 - 0.38);
        shapedFrac = transT * transT * (3 - 2 * transT);
      }
      liveStreamIndex = baseIndex + shapedFrac;
    } else if (percent < 98.0) {
      // SCENE 6: Photos gather into arc, doors close (94.6% to 97.8%)
      phase = "DOOR_CLOSING";
      const doorCloseT = smootherstep(94.6, 97.8, percent);
      doorAngle = (1 - doorCloseT) * 1.54;
      lightIntensity = 1.7 - doorCloseT * 1.3;
      memoryStreamProgress = 1;
      liveStreamIndex = totalPhotos - 1;
    } else {
      // SCENE 6: Final graduation screen (98% to 100%)
      phase = "FINAL_GRADUATION";
      doorAngle = 0;
      lightIntensity = 0.4;
      memoryStreamProgress = 1;
      liveStreamIndex = totalPhotos - 1;
    }

    return {
      progress,
      currentTime,
      duration: dur,
      phase,
      currentChapter: activeChapter,
      chapterProgress,
      doorAngle,
      lightIntensity,
      memoryStreamProgress,
      liveStreamIndex,
    };
  }

  public updateTime(currentTime: number, duration: number) {
    this.state = this.calculateState(currentTime, duration);
    this.listeners.forEach((listener) => listener(this.state));
  }

  public getLiveState(): TimelineState {
    if (typeof window !== "undefined") {
      const audio = AudioController.getInstance();
      const cur = audio.getContinuousTime();
      const dur = audio.getState().duration;

      // Frame-level caching: if queried multiple times within same sub-millisecond, reuse reference
      if (
        this.cachedLiveState &&
        Math.abs(cur - this.lastCalcTime) < 0.0004 &&
        dur === this.lastCalcDuration
      ) {
        return this.cachedLiveState;
      }

      this.lastCalcTime = cur;
      this.lastCalcDuration = dur;
      this.cachedLiveState = this.calculateState(cur, dur);
      return this.cachedLiveState;
    }
    return this.state;
  }

  public getState(): TimelineState {
    return this.state;
  }

  public subscribe(listener: (state: TimelineState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }
}
