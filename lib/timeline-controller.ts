// TIMELINE CONTROLLER
// Synchronizes audio playback time with 3D camera choreography,
// door states, chapter progressions, and photo animations.

import { MEMORY_CONFIG, ChapterTiming } from "./memory-config";
import { AudioController } from "./audio-controller";

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
}

export class TimelineController {
  private static instance: TimelineController | null = null;
  private listeners: Set<(state: TimelineState) => void> = new Set();
  private state: TimelineState;

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

    // Determine cinematic phase
    let phase: CinematicPhase = "COLLEGE_EXTERIOR";
    let doorAngle = 0;
    let lightIntensity = 1.2;
    let memoryStreamProgress = 0;

    if (currentTime <= 0) {
      phase = "COLLEGE_EXTERIOR";
      doorAngle = 0;
      lightIntensity = 1.2;
      memoryStreamProgress = 0;
    } else if (percent < 8.0) {
      // SCENE 1 & 2: Establishing shot & drone orbit of Itahari Namuna College (0% to 8%)
      phase = "COLLEGE_EXTERIOR";
      doorAngle = 0;
      lightIntensity = 1.35;
      memoryStreamProgress = 0;
    } else if (percent < 11.2) {
      // SCENE 3: Aerial dive & approach toward entrance & logo (8% to 11.2%)
      phase = "COLLEGE_APPROACH";
      doorAngle = 0;
      lightIntensity = 1.4;
      memoryStreamProgress = 0;
    } else if (percent < 13.0) {
      // SCENE 3 cont: Interior corridor flight toward Room 404 (11.2% to 13%)
      phase = "COLLEGE_CORRIDOR";
      doorAngle = 0;
      lightIntensity = 1.15;
      memoryStreamProgress = 0;
    } else if (percent < 14.5) {
      // SCENE 4: Classroom doors swing open (13% to 14.5%), camera pushes through
      phase = "DOOR_OPENING";
      const doorOpenT = smootherstep(13.0, 14.2, percent);
      doorAngle = doorOpenT * 1.54; // ~88 degrees inward swing
      lightIntensity = 1.15 + doorOpenT * 0.55;
      memoryStreamProgress = 0;
    } else if (percent < 93.0) {
      // SCENE 5: Existing photo memory experience active (14.5% to 93%)
      phase = "MEMORIES_ACTIVE";
      doorAngle = 1.54;
      lightIntensity = 1.7;
      memoryStreamProgress = Math.min(1, Math.max(0, (percent - 14.5) / (93.0 - 14.5)));
    } else if (percent < 98.0) {
      // SCENE 6: Photos gather into arc, doors close (94.6% to 97.8%)
      phase = "DOOR_CLOSING";
      const doorCloseT = smootherstep(94.6, 97.8, percent);
      doorAngle = (1 - doorCloseT) * 1.54;
      lightIntensity = 1.7 - doorCloseT * 1.3;
      memoryStreamProgress = 1;
    } else {
      // SCENE 6: Final graduation screen (98% to 100%)
      phase = "FINAL_GRADUATION";
      doorAngle = 0;
      lightIntensity = 0.4;
      memoryStreamProgress = 1;
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
      return this.calculateState(cur, dur);
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
