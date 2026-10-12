// TIMELINE CONTROLLER
// Synchronizes audio playback time with 3D camera choreography,
// door states, chapter progressions, and photo animations.

import { MEMORY_CONFIG, ChapterTiming } from "./memory-config";
import { AudioController } from "./audio-controller";

export type CinematicPhase =
  | "INITIAL_ENTRANCE" // Closed door, waiting for click
  | "DOOR_OPENING"     // Cinematic door swing, camera push
  | "MEMORIES_ACTIVE"  // Photographic journey in 3D classroom
  | "DOOR_CLOSING"     // Photos gather, doors swing shut
  | "FINAL_GRADUATION"; // Graduation letter displayed on closed door

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
    let phase: CinematicPhase = "INITIAL_ENTRANCE";
    let doorAngle = 0;
    let lightIntensity = 0.3;
    let memoryStreamProgress = 0;

    if (currentTime <= 0) {
      phase = "INITIAL_ENTRANCE";
      doorAngle = 0;
      lightIntensity = 0.3;
      memoryStreamProgress = 0;
    } else if (percent < 8) {
      // Opening doors smoothly (0.8% to 6.8%), camera pushes through (2% to 7.5%)
      phase = "DOOR_OPENING";
      const doorOpenT = smootherstep(0.8, 6.8, percent);
      doorAngle = doorOpenT * 1.54; // ~88 degrees inward swing
      lightIntensity = 0.3 + doorOpenT * 1.4;
      memoryStreamProgress = 0;
    } else if (percent < 93) {
      // Memory experience active (8% to 93%)
      phase = "MEMORIES_ACTIVE";
      doorAngle = 1.54;
      lightIntensity = 1.7;
      memoryStreamProgress = (percent - 8) / (93 - 8);
    } else if (percent < 98) {
      // Closing doors (94.6% to 97.8%) after camera smoothly retreats
      phase = "DOOR_CLOSING";
      const doorCloseT = smootherstep(94.6, 97.8, percent);
      doorAngle = (1 - doorCloseT) * 1.54;
      lightIntensity = 1.7 - doorCloseT * 1.3;
      memoryStreamProgress = 1;
    } else {
      // Final graduation screen
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
