"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Headphones, Sparkles, Image as ImageIcon, Users } from "lucide-react";
import { MEMORY_CONFIG } from "@/lib/memory-config";
import { playClassroomEntranceChime } from "@/lib/sound-effects";

interface OpeningScreenProps {
  isVisible: boolean;
  onStart: () => void;
  onOpenGallery: () => void;
  onOpenRoster: () => void;
  isLoading?: boolean;
}

export function OpeningScreen({
  isVisible,
  onStart,
  onOpenGallery,
  onOpenRoster,
  isLoading = false,
}: OpeningScreenProps) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (clicked || isLoading) return;
    setClicked(true);
    playClassroomEntranceChime();
    onStart();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } }}
          className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-6 md:p-12 text-cream selection:bg-amber-warm selection:text-charcoal-900"
        >
          {/* TOP BAR / COLLEGE & BATCH BADGE */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex items-center justify-between pointer-events-auto"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full border border-gold-400/40 bg-gold-400/10 flex items-center justify-center text-gold-300 shadow-[0_0_15px_rgba(223,168,87,0.2)]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-gold-300 font-medium">
                  {MEMORY_CONFIG.collegeName}
                </p>
                <p className="text-xs text-cream-muted tracking-wider">
                  {MEMORY_CONFIG.batchName}
                </p>
              </div>
            </div>

            {/* QUICK ACTIONS: YEARBOOK & PHOTOS */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenRoster}
                className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold-400/20 bg-charcoal-900/60 backdrop-blur-md text-xs text-cream-dim hover:text-gold-200 hover:border-gold-400/50 transition-all duration-300"
              >
                <Users className="w-3.5 h-3.5 text-gold-400 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Yearbook</span>
              </button>

              <button
                onClick={onOpenGallery}
                className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gold-400/20 bg-charcoal-900/60 backdrop-blur-md text-xs text-cream-dim hover:text-gold-200 hover:border-gold-400/50 transition-all duration-300"
              >
                <ImageIcon className="w-3.5 h-3.5 text-gold-400 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Browse Photographs</span>
              </button>
            </div>
          </motion.div>

          {/* CENTER HERO COPY & CINEMATIC CALL TO ACTION */}
          <div className="flex flex-col items-center text-center my-auto pointer-events-auto max-w-3xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.6 }}
              className="space-y-4"
            >
              <span className="inline-block text-[11px] sm:text-xs uppercase tracking-[0.35em] text-gold-400 font-semibold px-4 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/20">
                {MEMORY_CONFIG.opening.badge}
              </span>

              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-wide text-cream drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
                {MEMORY_CONFIG.opening.title}
              </h1>

              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold-400/60 to-transparent mx-auto my-3" />

              <p className="text-lg sm:text-xl text-gold-200/90 font-serif italic tracking-wide">
                &ldquo;{MEMORY_CONFIG.opening.subtitle}&rdquo;
              </p>

              <div className="pt-2 text-sm sm:text-base text-cream-muted font-light leading-relaxed whitespace-pre-line max-w-lg mx-auto">
                {MEMORY_CONFIG.opening.quote}
              </div>
            </motion.div>

            {/* INTERACTIVE PLAY BUTTON */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="pt-9 flex flex-col items-center gap-4"
            >
              <button
                onClick={handleClick}
                disabled={clicked || isLoading}
                className="group relative inline-flex items-center gap-4 px-8 sm:px-10 py-4 rounded-full bg-gradient-to-r from-gold-500 via-amber-warm to-gold-400 text-charcoal-900 font-medium tracking-[0.2em] text-xs sm:text-sm uppercase shadow-[0_0_35px_rgba(223,168,87,0.4)] hover:shadow-[0_0_55px_rgba(223,168,87,0.7)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 disabled:opacity-50"
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-charcoal-900/15 group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 fill-charcoal-900 text-charcoal-900 ml-0.5" />
                </span>
                <span>{isLoading ? "PREPARING SCENE..." : MEMORY_CONFIG.opening.playButtonText}</span>
              </button>

              {/* HEADPHONES RECOMMENDATION */}
              <div className="flex items-center gap-2 text-xs text-cream-muted/80 tracking-wide font-light">
                <Headphones className="w-3.5 h-3.5 text-gold-400/70" />
                <span>{MEMORY_CONFIG.opening.headphoneNote}</span>
              </div>
            </motion.div>
          </div>

          {/* BOTTOM SUBTLE FOOTER */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex items-center justify-between text-[11px] text-cream-muted/60 tracking-wider pointer-events-auto"
          >
            <span>{MEMORY_CONFIG.graduationYear} &copy; Graduating Class</span>
            <span className="italic">{MEMORY_CONFIG.motto}</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
