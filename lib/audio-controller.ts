// AUDIO CONTROLLER
// Robust HTML5 Audio wrapper that handles autoplay restrictions, seeking,
// volume, progress tracking, and sync without React re-render bottlenecks.

export type AudioStateListener = (state: AudioPlayerState) => void;

export interface AudioPlayerState {
  currentTime: number;
  duration: number;
  progress: number; // 0 to 1
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  isLoaded: boolean;
  hasEnded: boolean;
  error: string | null;
}

export class AudioController {
  private static instance: AudioController | null = null;
  private audio: HTMLAudioElement | null = null;
  private listeners: Set<AudioStateListener> = new Set();
  private state: AudioPlayerState = {
    currentTime: 0,
    duration: 354, // fallback if metadata pending
    progress: 0,
    isPlaying: false,
    isMuted: false,
    volume: 0.85,
    isLoaded: false,
    hasEnded: false,
    error: null,
  };

  private constructor() {
    if (typeof window !== "undefined") {
      this.initAudio();
    }
  }

  public static getInstance(): AudioController {
    if (!AudioController.instance) {
      AudioController.instance = new AudioController();
    }
    return AudioController.instance;
  }

  private initAudio() {
    if (this.audio) return;
    try {
      this.audio = new Audio();
      this.audio.preload = "auto";
      this.audio.crossOrigin = "anonymous";

      this.audio.addEventListener("loadedmetadata", () => {
        if (!this.audio) return;
        const dur = this.audio.duration;
        this.updateState({
          duration: isFinite(dur) && dur > 0 ? dur : 354,
          isLoaded: true,
          error: null,
        });
      });

      this.audio.addEventListener("timeupdate", () => {
        if (!this.audio) return;
        const cur = this.audio.currentTime;
        const dur = this.audio.duration || this.state.duration || 1;
        this.updateState({
          currentTime: cur,
          progress: Math.min(1, Math.max(0, cur / dur)),
        });
      });

      this.audio.addEventListener("play", () => {
        this.updateState({ isPlaying: true, hasEnded: false });
      });

      this.audio.addEventListener("pause", () => {
        this.updateState({ isPlaying: false });
      });

      this.audio.addEventListener("ended", () => {
        this.updateState({ isPlaying: false, hasEnded: true, progress: 1 });
      });

      this.audio.addEventListener("error", (e) => {
        console.warn("Audio load error:", e);
        this.updateState({
          error: "Failed to play audio track. Experience will continue in silent mode.",
          isPlaying: false,
        });
      });
    } catch (err: any) {
      console.warn("Could not initialize audio:", err);
      this.updateState({ error: err.message || "Audio init error" });
    }
  }

  public loadSource(src: string, volume: number = 0.85) {
    if (!this.audio) this.initAudio();
    if (!this.audio) return;

    if (this.audio.src !== src && !this.audio.src.endsWith(src)) {
      this.audio.src = src;
      this.audio.volume = volume;
      this.updateState({ volume });
      this.audio.load();
    }
  }

  public async play(): Promise<boolean> {
    if (!this.audio) this.initAudio();
    if (!this.audio) return false;

    try {
      await this.audio.play();
      this.updateState({ isPlaying: true, error: null });
      return true;
    } catch (err: any) {
      console.warn("Autoplay was blocked or audio failed:", err);
      this.updateState({
        isPlaying: false,
        error: "Audio playback blocked by browser. Click to interact.",
      });
      return false;
    }
  }

  public pause() {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
      this.updateState({ isPlaying: false });
    }
  }

  public togglePlay(): Promise<boolean> | void {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      return this.play();
    }
  }

  public seek(seconds: number) {
    if (!this.audio) return;
    const dur = this.audio.duration || this.state.duration;
    const clamped = Math.max(0, Math.min(seconds, dur));
    this.audio.currentTime = clamped;
    this.updateState({
      currentTime: clamped,
      progress: dur > 0 ? clamped / dur : 0,
      hasEnded: clamped >= dur,
    });
  }

  public seekPercent(pct: number) {
    const dur = this.state.duration;
    this.seek(dur * Math.max(0, Math.min(1, pct)));
  }

  public restart() {
    this.seek(0);
    this.play();
  }

  public toggleMute() {
    if (!this.audio) return;
    this.audio.muted = !this.audio.muted;
    this.updateState({ isMuted: this.audio.muted });
  }

  public setVolume(vol: number) {
    if (!this.audio) return;
    const clamped = Math.max(0, Math.min(1, vol));
    this.audio.volume = clamped;
    this.updateState({ volume: clamped, isMuted: clamped === 0 });
  }

  public getCurrentTime(): number {
    return this.audio ? this.audio.currentTime : this.state.currentTime;
  }

  public getProgress(): number {
    if (!this.audio) return this.state.progress;
    const dur = this.audio.duration || this.state.duration || 1;
    return Math.min(1, Math.max(0, this.audio.currentTime / dur));
  }

  public getState(): AudioPlayerState {
    return { ...this.state };
  }

  public subscribe(listener: AudioStateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private updateState(partial: Partial<AudioPlayerState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((listener) => listener(this.getState()));
  }
}
