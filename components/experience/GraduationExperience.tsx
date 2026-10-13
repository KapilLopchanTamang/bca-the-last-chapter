"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ClassroomScene } from "./ClassroomScene";
import { OpeningScreen } from "@/components/ui/OpeningScreen";
import { AudioControls } from "@/components/ui/AudioControls";
import { ChapterIndicator } from "@/components/ui/ChapterIndicator";
import { FinalGraduationOverlay } from "@/components/ui/FinalGraduationOverlay";
import { MemoryGallery } from "@/components/ui/MemoryGallery";
import { PhotoLightbox } from "@/components/ui/PhotoLightbox";
import { ShareModal } from "@/components/ui/ShareButton";
import { BatchRosterModal } from "@/components/ui/BatchRosterModal";
import { LyricsOverlay } from "@/components/ui/LyricsOverlay";
import { KeyboardShortcutsModal } from "@/components/ui/KeyboardShortcutsModal";
import { WebGLFallbackExperience } from "@/components/ui/WebGLFallbackExperience";
import { AudioController, AudioPlayerState } from "@/lib/audio-controller";
import { TimelineController, TimelineState } from "@/lib/timeline-controller";
import { PHOTO_MANIFEST, PhotoAsset } from "@/lib/asset-manifest";
import { MEMORY_CONFIG } from "@/lib/memory-config";

export default function GraduationExperience() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isRosterOpen, setIsRosterOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isLyricsVisible, setIsLyricsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoAsset | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const audioController = useRef<AudioController>(AudioController.getInstance()).current;
  const timelineController = useRef<TimelineController>(TimelineController.getInstance()).current;

  const [audioState, setAudioState] = useState<AudioPlayerState>(audioController.getState());
  const [timelineState, setTimelineState] = useState<TimelineState>(timelineController.getState());

  // Test WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setWebglSupported(Boolean(gl));
    } catch (e) {
      setWebglSupported(false);
    }
  }, []);

  // Track Fullscreen status
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Preload audio and voiceover sources on mount
  useEffect(() => {
    audioController.loadSource(MEMORY_CONFIG.audio.src, MEMORY_CONFIG.audio.defaultVolume);
    audioController.loadVoiceover(
      MEMORY_CONFIG.audio.voiceoverSrc || "/audio/voiceover.mp3",
      MEMORY_CONFIG.audio.voiceoverDuration || 24.68
    );

    const unsubAudio = audioController.subscribe((state) => {
      setAudioState(state);
      // Sync timeline state
      timelineController.updateTime(state.currentTime, state.duration);
    });

    const unsubTimeline = timelineController.subscribe((state) => {
      setTimelineState(state);
    });

    return () => {
      unsubAudio();
      unsubTimeline();
    };
  }, [audioController, timelineController]);

  // Handle Start
  const handleStart = useCallback(async () => {
    setHasStarted(true);
    await audioController.play();
  }, [audioController]);

  // Handle Play/Pause
  const handleTogglePlay = useCallback(() => {
    audioController.togglePlay();
  }, [audioController]);

  // Handle Seek
  const handleSeekPercent = useCallback((pct: number) => {
    audioController.seekPercent(pct);
  }, [audioController]);

  // Handle Toggle Mute
  const handleToggleMute = useCallback(() => {
    audioController.toggleMute();
  }, [audioController]);

  // Handle Volume Change
  const handleVolumeChange = useCallback((vol: number) => {
    audioController.setVolume(vol);
  }, [audioController]);

  // Handle Restart
  const handleRestart = useCallback(() => {
    setIsGalleryOpen(false);
    setIsRosterOpen(false);
    setIsShortcutsOpen(false);
    setLightboxPhoto(null);
    audioController.restart();
  }, [audioController]);

  // Toggle Fullscreen (Auditorium Mode)
  const handleToggleFullscreen = useCallback(() => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  // Open/Close Modals
  const handleOpenGallery = useCallback(() => setIsGalleryOpen(true), []);
  const handleCloseGallery = useCallback(() => setIsGalleryOpen(false), []);
  const handleOpenRoster = useCallback(() => setIsRosterOpen(true), []);
  const handleCloseRoster = useCallback(() => setIsRosterOpen(false), []);
  const handleSelectPhoto = useCallback((photo: PhotoAsset) => setLightboxPhoto(photo), []);
  const handleToggleLyrics = useCallback(() => setIsLyricsVisible((prev) => !prev), []);
  const handleOpenShortcuts = useCallback(() => setIsShortcutsOpen(true), []);
  const handleCloseShortcuts = useCallback(() => setIsShortcutsOpen(false), []);

  // Global Keyboard Shortcuts (Space, F, M, G, Y, L, R, ?, Left/Right, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        if (!hasStarted) {
          handleStart();
        } else {
          handleTogglePlay();
        }
      } else if (e.code === "KeyF") {
        e.preventDefault();
        handleToggleFullscreen();
      } else if (e.code === "KeyM") {
        e.preventDefault();
        handleToggleMute();
      } else if (e.code === "KeyG") {
        e.preventDefault();
        setIsGalleryOpen((prev) => !prev);
      } else if (e.code === "KeyY") {
        e.preventDefault();
        setIsRosterOpen((prev) => !prev);
      } else if (e.code === "KeyL") {
        e.preventDefault();
        setIsLyricsVisible((prev) => !prev);
      } else if (e.code === "KeyR") {
        e.preventDefault();
        handleRestart();
      } else if (e.key === "?" || (e.shiftKey && e.code === "Slash")) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.code === "Escape") {
        setIsGalleryOpen(false);
        setIsRosterOpen(false);
        setIsShareOpen(false);
        setIsShortcutsOpen(false);
        setLightboxPhoto(null);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        audioController.seek(audioController.getCurrentTime() + 6);
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        audioController.seek(audioController.getCurrentTime() - 6);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    hasStarted,
    handleStart,
    handleTogglePlay,
    handleToggleFullscreen,
    handleToggleMute,
    handleRestart,
    audioController,
  ]);

  // Touch Swipe navigation for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartXRef.current;
    const diffY = touchEndY - touchStartYRef.current;

    // Detect horizontal swipe if larger than 60px and mostly horizontal
    if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        // Swipe left -> seek forward
        audioController.seek(audioController.getCurrentTime() + 6);
      } else {
        // Swipe right -> seek backward
        audioController.seek(audioController.getCurrentTime() - 6);
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const isFinalMessageVisible =
    hasStarted &&
    (timelineState.phase === "FINAL_GRADUATION" || audioState.hasEnded) &&
    !isGalleryOpen &&
    !isRosterOpen;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-screen h-screen overflow-hidden bg-background select-none font-sans"
    >
      {/* 3D WEBGL CANVAS OR FALLBACK */}
      {webglSupported ? (
        <div className="absolute inset-0 z-0">
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [14, 5.8, 48], fov: 48, near: 0.1, far: 120 }}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: "high-performance",
            }}
          >
            <ClassroomScene
              timelineState={timelineState}
              onSelectPhoto={handleSelectPhoto}
            />
          </Canvas>
        </div>
      ) : (
        <WebGLFallbackExperience
          timelineState={timelineState}
          onStart={handleStart}
          onOpenGallery={handleOpenGallery}
          onSelectPhoto={handleSelectPhoto}
          hasStarted={hasStarted}
        />
      )}

      {/* VIGNETTE OVERLAY */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-vignette-radial" />

      {/* OPENING SCREEN */}
      <OpeningScreen
        isVisible={!hasStarted}
        onStart={handleStart}
        onOpenGallery={handleOpenGallery}
        onOpenRoster={handleOpenRoster}
      />

      {/* CHAPTER INDICATOR */}
      <ChapterIndicator
        currentChapter={timelineState.currentChapter}
        isVisible={hasStarted && !isGalleryOpen && !isRosterOpen && !isFinalMessageVisible}
      />

      {/* BADAL SARI POETIC SUBTITLES / LYRICS */}
      <LyricsOverlay
        currentTime={audioState.currentTime}
        progress={audioState.progress}
        isVisible={hasStarted && isLyricsVisible && !isGalleryOpen && !isRosterOpen && !isFinalMessageVisible}
      />

      {/* AUDIO CONTROLS (Always accessible during experience) */}
      <AudioControls
        audioState={audioState}
        onTogglePlay={handleTogglePlay}
        onSeekPercent={handleSeekPercent}
        onToggleMute={handleToggleMute}
        onVolumeChange={handleVolumeChange}
        onRestart={handleRestart}
        onOpenGallery={handleOpenGallery}
        onOpenRoster={handleOpenRoster}
        onShare={() => setIsShareOpen(true)}
        onToggleFullscreen={handleToggleFullscreen}
        isFullscreen={isFullscreen}
        isVisible={hasStarted && !isGalleryOpen && !isRosterOpen}
        isLyricsVisible={isLyricsVisible}
        onToggleLyrics={handleToggleLyrics}
        onOpenShortcuts={handleOpenShortcuts}
      />

      {/* FINAL GRADUATION OVERLAY */}
      <FinalGraduationOverlay
        isVisible={isFinalMessageVisible}
        onReplay={handleRestart}
        onOpenGallery={handleOpenGallery}
        onOpenRoster={handleOpenRoster}
        onShare={() => setIsShareOpen(true)}
      />

      {/* BROWSE ALL PHOTOGRAPHS GALLERY */}
      <MemoryGallery
        isOpen={isGalleryOpen}
        onClose={handleCloseGallery}
        onSelectPhoto={handleSelectPhoto}
        onReplay={handleRestart}
      />

      {/* BATCH YEARBOOK & ROSTER MODAL */}
      <BatchRosterModal
        isOpen={isRosterOpen}
        onClose={handleCloseRoster}
      />

      {/* FULLSCREEN PHOTO LIGHTBOX */}
      <PhotoLightbox
        photo={lightboxPhoto}
        allPhotos={PHOTO_MANIFEST}
        onClose={() => setLightboxPhoto(null)}
        onNavigate={setLightboxPhoto}
      />

      {/* SHARE MODAL */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      {/* KEYBOARD SHORTCUTS MODAL */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={handleCloseShortcuts}
      />
    </div>
  );
}
