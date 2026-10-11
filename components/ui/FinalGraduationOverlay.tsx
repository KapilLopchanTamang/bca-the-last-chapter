"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  Images,
  Share2,
  Sparkles,
  Heart,
  Download,
  GraduationCap,
  Users,
} from "lucide-react";
import confetti from "canvas-confetti";
import { MEMORY_CONFIG } from "@/lib/memory-config";
import { generateKeepsakeCard } from "@/lib/keepsake-generator";

interface FinalGraduationOverlayProps {
  isVisible: boolean;
  onReplay: () => void;
  onOpenGallery: () => void;
  onOpenRoster: () => void;
  onShare: () => void;
}

export function FinalGraduationOverlay({
  isVisible,
  onReplay,
  onOpenGallery,
  onOpenRoster,
  onShare,
}: FinalGraduationOverlayProps) {
  const triggerConfettiBurst = () => {
    try {
      const count = 220;
      const defaults = {
        origin: { y: 0.65 },
        colors: ["#dfa857", "#f5d48d", "#ffffff", "#c47d2b", "#ffd700"],
      };

      confetti({
        ...defaults,
        particleCount: Math.floor(count * 0.4),
        spread: 70,
      });
      confetti({
        ...defaults,
        particleCount: Math.floor(count * 0.35),
        spread: 110,
        decay: 0.92,
        scalar: 0.9,
      });
      confetti({
        ...defaults,
        particleCount: Math.floor(count * 0.25),
        spread: 140,
        startVelocity: 50,
      });
    } catch (e) {
      // safe fallback
    }
  };

  useEffect(() => {
    if (isVisible) {
      triggerConfettiBurst();
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="absolute inset-0 z-40 flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 bg-charcoal-900/65 backdrop-blur-sm pointer-events-auto selection:bg-amber-warm selection:text-charcoal-900 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="max-w-3xl w-full text-center space-y-5 sm:space-y-6 my-auto px-5 sm:px-8 py-7 sm:py-8 rounded-3xl border border-gold-400/25 bg-charcoal-900/90 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.85)]"
          >
            {/* GRADUATION CREST */}
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full border border-gold-400/40 bg-gold-400/10 flex items-center justify-center text-gold-300 shadow-[0_0_20px_rgba(223,168,87,0.3)]">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>

            {/* MAIN HEADINGS */}
            <div className="space-y-2">
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.35em] text-gold-400 font-medium">
                {MEMORY_CONFIG.finalMessage.date} • {MEMORY_CONFIG.collegeName}
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-cream font-light tracking-wide leading-tight drop-shadow-md">
                {MEMORY_CONFIG.finalMessage.mainHeading}
              </h2>
              <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-gold-400/70 to-transparent mx-auto my-3" />
              <p className="font-serif text-base sm:text-xl text-gold-200/90 italic tracking-wider">
                {MEMORY_CONFIG.finalMessage.subHeading}
              </p>
            </div>

            {/* QUOTE LINES */}
            <div className="space-y-2.5 max-w-xl mx-auto py-1 text-xs sm:text-sm md:text-base text-cream-muted font-light leading-relaxed">
              {MEMORY_CONFIG.finalMessage.quoteLines.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>

            {/* SIGNATURE */}
            <div className="pt-3 border-t border-gold-400/15 max-w-sm mx-auto space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-gold-300 font-serif text-base tracking-wide">
                <span>{MEMORY_CONFIG.finalMessage.signatureTitle}</span>
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 inline" />
              </div>
              <p className="text-xs text-cream-muted/70 tracking-widest italic">
                {MEMORY_CONFIG.finalMessage.signatureSub}
              </p>
            </div>

            {/* PRIMARY ACTIONS: REPLAY, BROWSE, TOSS CAPS, KEEPSAKE */}
            <div className="pt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onReplay}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-amber-warm text-charcoal-900 font-medium text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(223,168,87,0.4)] hover:shadow-[0_0_35px_rgba(223,168,87,0.7)] hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-90 transition-transform duration-300" />
                <span>Replay Memories</span>
              </button>

              <button
                onClick={triggerConfettiBurst}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-gold-400/35 bg-gold-400/15 text-gold-200 text-xs tracking-wider uppercase hover:bg-gold-400/25 transition-all hover:scale-105 active:scale-95"
                title="Toss graduation caps"
              >
                <GraduationCap className="w-4 h-4 text-gold-300" />
                <span>Toss Caps!</span>
              </button>

              <button
                onClick={generateKeepsakeCard}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-gold-400/30 bg-charcoal-800/80 hover:bg-gold-400/15 text-cream hover:text-gold-200 text-xs tracking-wider uppercase transition-all duration-300 hover:border-gold-400/60"
                title="Download personalized graduation souvenir card"
              >
                <Download className="w-3.5 h-3.5 text-gold-400" />
                <span>Save Keepsake</span>
              </button>

              <button
                onClick={onOpenRoster}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white/10 bg-charcoal-800/60 hover:bg-white/10 text-cream-dim hover:text-gold-200 text-xs tracking-wider uppercase transition-all"
              >
                <Users className="w-3.5 h-3.5 text-gold-400" />
                <span>Yearbook</span>
              </button>

              <button
                onClick={onOpenGallery}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white/10 bg-charcoal-800/60 hover:bg-white/10 text-cream-muted hover:text-cream text-xs tracking-wider uppercase transition-all"
              >
                <Images className="w-3.5 h-3.5" />
                <span>All Photos</span>
              </button>

              <button
                onClick={onShare}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white/10 bg-charcoal-800/60 hover:bg-white/10 text-cream-muted hover:text-cream text-xs tracking-wider uppercase transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
