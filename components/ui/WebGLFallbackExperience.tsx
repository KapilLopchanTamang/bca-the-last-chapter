"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Sparkles, Image as ImageIcon } from "lucide-react";
import { PHOTO_MANIFEST, PhotoAsset } from "@/lib/asset-manifest";
import { MEMORY_CONFIG } from "@/lib/memory-config";
import { TimelineState } from "@/lib/timeline-controller";

interface WebGLFallbackProps {
  timelineState: TimelineState;
  onStart: () => void;
  onOpenGallery: () => void;
  onSelectPhoto: (photo: PhotoAsset) => void;
  hasStarted: boolean;
}

export function WebGLFallbackExperience({
  timelineState,
  onStart,
  onOpenGallery,
  onSelectPhoto,
  hasStarted,
}: WebGLFallbackProps) {
  const { currentChapter, phase, progress } = timelineState;

  // Active subset of photos for fallback slideshow
  const activePhotos = PHOTO_MANIFEST.filter(
    (p) => p.chapterId === currentChapter.id || currentChapter.id === "opening"
  );
  const currentPhoto = activePhotos[Math.floor(progress * activePhotos.length) % Math.max(1, activePhotos.length)];

  return (
    <div className="relative w-full h-full min-h-screen bg-charcoal-900 flex items-center justify-center overflow-hidden">
      {/* BACKGROUND AMBIENCE */}
      <div className="absolute inset-0 bg-radial-gradient from-charcoal-800 to-charcoal-900 opacity-90" />
      <div className="absolute inset-0 bg-vignette-radial pointer-events-none" />

      {/* 2D DOOR ANIMATION FALLBACK */}
      <div className="relative w-full max-w-4xl h-[70vh] flex items-center justify-center p-6">
        {/* Left Door Panel */}
        <motion.div
          animate={{
            rotateY:
              phase === "COLLEGE_EXTERIOR" ||
              phase === "COLLEGE_APPROACH" ||
              phase === "COLLEGE_CORRIDOR" ||
              phase === "FINAL_GRADUATION"
                ? 0
                : -85,
            x:
              phase === "COLLEGE_EXTERIOR" ||
              phase === "COLLEGE_APPROACH" ||
              phase === "COLLEGE_CORRIDOR" ||
              phase === "FINAL_GRADUATION"
                ? 0
                : -100,
          }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{ transformOrigin: "left center" }}
          className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#3a2213] border-4 border-[#24150b] shadow-2xl rounded-l-2xl flex items-center justify-end pr-8 z-10"
        >
          <div className="w-4 h-16 rounded bg-[#d4af37]" />
        </motion.div>

        {/* Right Door Panel */}
        <motion.div
          animate={{
            rotateY:
              phase === "COLLEGE_EXTERIOR" ||
              phase === "COLLEGE_APPROACH" ||
              phase === "COLLEGE_CORRIDOR" ||
              phase === "FINAL_GRADUATION"
                ? 0
                : 85,
            x:
              phase === "COLLEGE_EXTERIOR" ||
              phase === "COLLEGE_APPROACH" ||
              phase === "COLLEGE_CORRIDOR" ||
              phase === "FINAL_GRADUATION"
                ? 0
                : 100,
          }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{ transformOrigin: "right center" }}
          className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#3a2213] border-4 border-[#24150b] shadow-2xl rounded-r-2xl flex items-center justify-start pl-8 z-10"
        >
          <div className="w-4 h-16 rounded bg-[#d4af37]" />
        </motion.div>

        {/* CLASSROOM PHOTO DISPLAY IN INTERIOR */}
        {currentPhoto && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhoto.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8 }}
              onClick={() => onSelectPhoto(currentPhoto)}
              className="relative z-0 max-w-xl max-h-[60vh] p-4 bg-cream rounded-2xl shadow-2xl cursor-pointer"
            >
              <img
                src={currentPhoto.src}
                alt={currentPhoto.caption || "BCA Memory"}
                className="max-h-[50vh] object-contain rounded-xl"
              />
              <div className="text-center mt-3">
                <span className="text-[10px] uppercase font-bold text-amber-deep">
                  {currentPhoto.chapterTitle}
                </span>
                <p className="font-serif text-charcoal-900 text-sm italic">
                  {currentPhoto.caption}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
