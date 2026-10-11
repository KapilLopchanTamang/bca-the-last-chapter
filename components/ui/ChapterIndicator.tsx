"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChapterTiming } from "@/lib/memory-config";

interface ChapterIndicatorProps {
  currentChapter: ChapterTiming;
  isVisible: boolean;
}

export function ChapterIndicator({ currentChapter, isVisible }: ChapterIndicatorProps) {
  if (!isVisible || currentChapter.id === "opening" || currentChapter.id === "closing") {
    return null;
  }

  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentChapter.id}
          initial={{ opacity: 0, y: -15, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 15, filter: "blur(4px)" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center px-6 py-2.5 rounded-full bg-charcoal-900/40 backdrop-blur-md border border-gold-400/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold-400 font-semibold">
            {currentChapter.title}
          </span>
          <span className="text-xs sm:text-sm font-serif italic text-cream-dim/90 tracking-wide mt-0.5">
            &ldquo;{currentChapter.subtitle}&rdquo;
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
