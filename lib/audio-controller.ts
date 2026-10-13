// AUDIO CONTROLLER
// Robust HTML5 Audio wrapper that handles dual-track playback:
// 1. Voiceover narration at the beginning (louder, prominent)
// 2. Background music synchronized (ducked during narration, swells up after narration ends)
// Handles autoplay restrictions, seeking, volume, progress tracking, and sync without React re-render bottlenecks.

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
  isVoiceoverActive: boolean;
}

export class AudioController {
  private static instance: AudioController | null = null;
  private audio: HTMLAudioElement | null = null;
  private voiceoverAudio: HTMLAudioElement | null = null;
  private voiceoverDuration: number = 24.68; // Duration of opening voiceover in seconds
  private duckedVolumeRatio: number = 0.28; // Background music volume ratio during voiceover
  private listeners: Set<AudioStateListener> = new Set();
  private lastSyncTime: number = 0;
  private lastAudioTime: number = 0;
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
    isVoiceoverActive: false,
  };

  private constructor() {
    if (typeof window !== "undefined") {
      this.initAudio();
      this.loadVoiceover("/audio/voiceover.mp3", 24.68);
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
        this.lastSyncTime = typeof performance !== "undefined" ? performance.now() : Date.now();
        this.lastAudioTime = cur;

        const isVoiceoverActive = cur < this.voiceoverDuration;

        // Synchronize voiceover playback state
        if (this.voiceoverAudio) {
          if (isVoiceoverActive) {
            if (this.state.isPlaying && this.voiceoverAudio.paused) {
              this.voiceoverAudio.play().catch(() => {});
            }
            if (Math.abs(this.voiceoverAudio.currentTime - cur) > 0.25) {
              this.voiceoverAudio.currentTime = cur;
            }
          } else {
            if (!this.voiceoverAudio.paused) {
              this.voiceoverAudio.pause();
            }
          }
        }

        this.updateVolumeMix(cur);

        this.updateState({
          currentTime: cur,
          progress: Math.min(1, Math.max(0, cur / dur)),
          isVoiceoverActive,
        });
      });

      this.audio.addEventListener("play", () => {
        if (this.audio) {
          this.lastSyncTime = typeof performance !== "undefined" ? performance.now() : Date.now();
          this.lastAudioTime = this.audio.currentTime;
        }
        this.updateState({ isPlaying: true, hasEnded: false });
      });

      this.audio.addEventListener("pause", () => {
        if (this.audio) {
          this.lastAudioTime = this.audio.currentTime;
        }
        if (this.voiceoverAudio && !this.voiceoverAudio.paused) {
          this.voiceoverAudio.pause();
        }
        this.updateState({ isPlaying: false });
      });

      this.audio.addEventListener("ended", () => {
        if (this.audio) {
          this.lastAudioTime = this.audio.duration || this.state.duration;
        }
        if (this.voiceoverAudio && !this.voiceoverAudio.paused) {
          this.voiceoverAudio.pause();
        }
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

  public loadVoiceover(src: string = "/audio/voiceover.mp3", duration: number = 24.68) {
    if (typeof window === "undefined") return;
    try {
      if (!this.voiceoverAudio) {
        this.voiceoverAudio = new Audio();
        this.voiceoverAudio.preload = "auto";
        this.voiceoverAudio.crossOrigin = "anonymous";
      }
      this.voiceoverDuration = duration;
      if (this.voiceoverAudio.src !== src && !this.voiceoverAudio.src.endsWith(src)) {
        this.voiceoverAudio.src = src;
        this.voiceoverAudio.load();
      }
    } catch (e) {
      console.warn("Could not load voiceover:", e);
    }
  }

  private updateVolumeMix(curTime?: number) {
    if (!this.audio) return;
    const cur = curTime !== undefined ? curTime : this.getCurrentTime();
    const isMuted = this.state.isMuted;
    const baseVol = this.state.volume;
    const isVoiceoverActive = cur < this.voiceoverDuration;

    // 1. Voiceover Audio Volume (Louder and prominent)
    if (this.voiceoverAudio) {
      if (isMuted) {
        this.voiceoverAudio.volume = 0;
        this.voiceoverAudio.muted = true;
      } else {
        this.voiceoverAudio.muted = false;
        // Keep voiceover volume at 1.0 (crystal clear narration)
        this.voiceoverAudio.volume = 1.0;
      }
    }

    // 2. Background Music Volume (Ducked softly while voiceover narrates, then swells up)
    if (isMuted) {
      this.audio.volume = 0;
      this.audio.muted = true;
    } else {
      this.audio.muted = false;
      if (isVoiceoverActive) {
        // Soft cinematic background level
        this.audio.volume = baseVol * this.duckedVolumeRatio;
      } else {
        // Full normal music volume
        this.audio.volume = baseVol;
      }
    }
  }

  public async play(): Promise<boolean> {
    if (!this.audio) this.initAudio();
    if (!this.audio) return false;

    try {
      this.updateVolumeMix();
      const playPromise = this.audio.play();

      // Play voiceover narration if within voiceover phase (< 24.68s)
      const cur = this.getCurrentTime();
      if (this.voiceoverAudio && cur < this.voiceoverDuration) {
        this.voiceoverAudio.currentTime = cur;
        this.voiceoverAudio.play().catch((e) => console.warn("Voiceover play note:", e));
      }

      await playPromise;
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
    }
    if (this.voiceoverAudio && !this.voiceoverAudio.paused) {
      this.voiceoverAudio.pause();
    }
    this.updateState({ isPlaying: false });
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
    this.lastSyncTime = typeof performance !== "undefined" ? performance.now() : Date.now();
    this.lastAudioTime = clamped;

    const isVoiceoverActive = clamped < this.voiceoverDuration;

    if (this.voiceoverAudio) {
      if (isVoiceoverActive) {
        this.voiceoverAudio.currentTime = clamped;
        if (this.state.isPlaying) {
          this.voiceoverAudio.play().catch(() => {});
        }
      } else {
        this.voiceoverAudio.pause();
      }
    }

    this.updateVolumeMix(clamped);

    this.updateState({
      currentTime: clamped,
      progress: dur > 0 ? clamped / dur : 0,
      hasEnded: clamped >= dur,
      isVoiceoverActive,
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
    const nextMuted = !this.state.isMuted;
    this.state.isMuted = nextMuted;
    this.updateVolumeMix();
    this.updateState({ isMuted: nextMuted });
  }

  public setVolume(vol: number) {
    if (!this.audio) return;
    const clamped = Math.max(0, Math.min(1, vol));
    this.state.volume = clamped;
    this.updateVolumeMix();
    this.updateState({ volume: clamped, isMuted: clamped === 0 });
  }

  public getCurrentTime(): number {
    return this.audio ? this.audio.currentTime : this.state.currentTime;
  }

  public getContinuousTime(): number {
    if (!this.audio) return this.state.currentTime;
    if (!this.state.isPlaying) return this.audio.currentTime;

    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    const elapsed = Math.max(0, (now - this.lastSyncTime) / 1000);
    const estimated = this.lastAudioTime + elapsed;
    const dur = this.audio.duration || this.state.duration || 1;
    return Math.min(dur, Math.max(0, estimated));
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
