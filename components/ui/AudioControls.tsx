"use client";

import React, { useRef, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Volume1,
  Images,
  Share2,
  Users,
  Maximize,
  Minimize,
  Cloud,
  HelpCircle,
} from "lucide-react";
import { formatTime } from "@/lib/utils";
import { AudioPlayerState } from "@/lib/audio-controller";
import { MEMORY_CONFIG } from "@/lib/memory-config";

interface AudioControlsProps {
  audioState: AudioPlayerState;
  onTogglePlay: () => void;
  onSeekPercent: (pct: number) => void;
  onToggleMute: () => void;
  onVolumeChange: (vol: number) => void;
  onRestart: () => void;
  onOpenGallery: () => void;
  onOpenRoster: () => void;
  onShare: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  isVisible: boolean;
  isLyricsVisible: boolean;
  onToggleLyrics: () => void;
  onOpenShortcuts: () => void;
}

export function AudioControls({
  audioState,
  onTogglePlay,
  onSeekPercent,
  onToggleMute,
  onVolumeChange,
  onRestart,
  onOpenGallery,
  onOpenRoster,
  onShare,
  onToggleFullscreen,
  isFullscreen,
  isVisible,
  isLyricsVisible,
  onToggleLyrics,
  onOpenShortcuts,
}: AudioControlsProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [hoverPercent, setHoverPercent] = useState<number | null>(null);
  const [hoverPos, setHoverPos] = useState<number>(0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  if (!isVisible) return null;

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    onSeekPercent(pct);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    setHoverPercent(pct);
    setHoverPos(clickX);
  };

  const handleMouseLeave = () => {
    setHoverPercent(null);
  };

  // Find hovered chapter
  const hoveredChapter = hoverPercent !== null
    ? MEMORY_CONFIG.chapterTimings.find(
        (ch) => (hoverPercent * 100) >= ch.startPercent && (hoverPercent * 100) < ch.endPercent
      ) || MEMORY_CONFIG.chapterTimings[MEMORY_CONFIG.chapterTimings.length - 1]
    : null;

  const hoveredTime = hoverPercent !== null ? hoverPercent * audioState.duration : 0;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-[94%] max-w-3xl pointer-events-auto select-none">
      <div className="rounded-2xl border border-gold-400/20 bg-charcoal-900/85 backdrop-blur-2xl px-4 py-3 shadow-[0_8px_35px_rgba(0,0,0,0.7)] flex flex-col gap-2.5 text-cream transition-all duration-300">
        
        {/* INTERACTIVE TIMELINE SCRUBBER WITH CHAPTER MARKERS & HOVER PREVIEW */}
        <div
          ref={progressBarRef}
          onClick={handleSeekClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="group relative h-3 w-full bg-white/10 rounded-full cursor-pointer flex items-center py-1"
          title="Click to scrub memory timeline"
        >
          {/* Chapter divider ticks */}
          {MEMORY_CONFIG.chapterTimings.map((ch) => (
            <div
              key={ch.id}
              className="absolute top-0 bottom-0 w-[1.5px] bg-white/25 pointer-events-none group-hover:bg-gold-400/60 transition-colors z-10"
              style={{ left: `${ch.startPercent}%` }}
            />
          ))}

          {/* Progress fill */}
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-gold-500 to-amber-warm transition-all duration-100 group-hover:h-2"
            style={{ width: `${Math.min(100, Math.max(0, audioState.progress * 100))}%` }}
          />

          {/* Scrubber thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-gold-200 shadow-[0_0_12px_rgba(223,168,87,0.9)] opacity-0 group-hover:opacity-100 transition-opacity z-20"
            style={{ left: `${Math.min(100, Math.max(0, audioState.progress * 100))}%` }}
          />

          {/* Floating Chapter / Time Tooltip */}
          {hoverPercent !== null && hoveredChapter && (
            <div
              className="absolute bottom-6 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-charcoal-900/95 border border-gold-400/40 shadow-xl pointer-events-none flex flex-col items-center gap-0.5 whitespace-nowrap z-30"
              style={{ left: `${hoverPos}px` }}
            >
              <span className="text-[10px] font-medium text-gold-300">
                {hoveredChapter.title}
              </span>
              <span className="text-[9px] font-mono text-cream-muted tabular-nums">
                {formatTime(hoveredTime)}
              </span>
            </div>
          )}
        </div>

        {/* CONTROLS ROW */}
        <div className="flex items-center justify-between gap-2.5 text-xs">
          
          {/* LEFT: PLAY/PAUSE, RESTART & DURATION */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={onTogglePlay}
              className="w-8 h-8 rounded-full bg-gold-400/20 hover:bg-gold-400/30 text-gold-300 border border-gold-400/40 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-[0_0_12px_rgba(223,168,87,0.2)]"
              aria-label={audioState.isPlaying ? "Pause" : "Play"}
              title={audioState.isPlaying ? "Pause (Space)" : "Play (Space)"}
            >
              {audioState.isPlaying ? (
                <Pause className="w-4 h-4 fill-gold-300" />
              ) : (
                <Play className="w-4 h-4 fill-gold-300 ml-0.5" />
              )}
            </button>

            <button
              onClick={onRestart}
              className="text-cream-muted hover:text-gold-200 transition-colors p-1"
              aria-label="Restart experience"
              title="Restart (R)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="font-mono text-[11px] text-cream-muted/90 tabular-nums">
              <span>{formatTime(audioState.currentTime)}</span>
              <span className="mx-1 text-cream-muted/40">/</span>
              <span>{formatTime(audioState.duration)}</span>
            </div>
          </div>

          {/* CENTER: SONG TITLE & LIVE EQUALIZER */}
          <div className="hidden sm:flex items-center gap-2.5 truncate max-w-[200px]">
            {/* Pulsing Audio Waveform Bars */}
            <div className="flex items-end gap-[2px] h-3.5">
              {[0.4, 0.9, 0.6, 0.8, 0.5].map((h, i) => (
                <div
                  key={i}
                  className={`w-[2px] rounded-full bg-gold-400 transition-all duration-300 ${
                    audioState.isPlaying ? "animate-pulse" : "opacity-30"
                  }`}
                  style={{
                    height: audioState.isPlaying ? `${h * 14}px` : "3px",
                    animationDelay: `${i * 120}ms`,
                  }}
                />
              ))}
            </div>

            <div className="flex flex-col truncate text-left">
              <span className="text-[11px] font-medium text-gold-200 truncate">
                {MEMORY_CONFIG.audio.title}
              </span>
              <span className="text-[9px] text-cream-muted/70 tracking-wider truncate">
                {MEMORY_CONFIG.batchName}
              </span>
            </div>
          </div>

          {/* RIGHT: VOLUME, LYRICS, ROSTER, GALLERY, FULLSCREEN, HELP & SHARE */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            
            {/* VOLUME BUTTON & INTERACTIVE SLIDER */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <button
                onClick={onToggleMute}
                className="text-cream-muted hover:text-gold-200 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                aria-label={audioState.isMuted ? "Unmute" : "Mute"}
                title={audioState.isMuted ? "Unmute (M)" : "Mute (M)"}
              >
                {audioState.isMuted || audioState.volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : audioState.volume < 0.5 ? (
                  <Volume1 className="w-4 h-4 text-gold-300" />
                ) : (
                  <Volume2 className="w-4 h-4 text-gold-300" />
                )}
              </button>

              {/* Volume Slider Popover */}
              {showVolumeSlider && (
                <div className="absolute bottom-9 left-1/2 -translate-x-1/2 bg-charcoal-900/95 border border-gold-400/30 p-2 rounded-xl shadow-xl flex items-center z-40">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={audioState.isMuted ? 0 : audioState.volume}
                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    className="w-20 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-gold-400"
                    title={`Volume: ${Math.round((audioState.isMuted ? 0 : audioState.volume) * 100)}%`}
                  />
                </div>
              )}
            </div>

            {/* LYRICS / BADAL SARI SUBTITLES TOGGLE */}
            <button
              onClick={onToggleLyrics}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] transition-all ${
                isLyricsVisible
                  ? "bg-gold-400/25 border-gold-400/50 text-gold-200 shadow-[0_0_10px_rgba(223,168,87,0.3)]"
                  : "bg-white/5 border-white/10 text-cream-dim hover:text-gold-200 hover:border-gold-400/30"
              }`}
              title="Toggle Badal Sari Subtitles (L)"
            >
              <Cloud className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden xl:inline">Lyrics</span>
            </button>

            {/* CLASS YEARBOOK */}
            <button
              onClick={onOpenRoster}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-gold-400/20 border border-white/10 hover:border-gold-400/30 text-cream-dim hover:text-gold-200 transition-all text-[11px]"
              title="Class Yearbook & Roster (Y)"
            >
              <Users className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden lg:inline">Yearbook</span>
            </button>

            {/* PHOTO GALLERY */}
            <button
              onClick={onOpenGallery}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-gold-400/20 border border-white/10 hover:border-gold-400/30 text-cream-dim hover:text-gold-200 transition-all text-[11px]"
              title="Browse all 135 photographs (G)"
            >
              <Images className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden md:inline">Photos</span>
            </button>

            {/* FULLSCREEN */}
            <button
              onClick={onToggleFullscreen}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-gold-400/20 border border-white/10 hover:border-gold-400/30 text-cream-dim hover:text-gold-200 transition-all"
              title={isFullscreen ? "Exit Fullscreen (F)" : "Auditorium Fullscreen (F)"}
            >
              {isFullscreen ? (
                <Minimize className="w-3.5 h-3.5" />
              ) : (
                <Maximize className="w-3.5 h-3.5" />
              )}
            </button>

            {/* KEYBOARD SHORTCUTS HELP */}
            <button
              onClick={onOpenShortcuts}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-gold-400/20 border border-white/10 hover:border-gold-400/30 text-cream-dim hover:text-gold-200 transition-all hidden sm:block"
              title="Keyboard Shortcuts (?)"
            >
              <HelpCircle className="w-3.5 h-3.5 text-gold-400/80" />
            </button>

            {/* SHARE MODAL */}
            <button
              onClick={onShare}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-gold-400/20 border border-white/10 hover:border-gold-400/30 text-cream-dim hover:text-gold-200 transition-all"
              title="Share experience"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
