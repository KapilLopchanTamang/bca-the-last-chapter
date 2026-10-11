"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Download, Sparkles } from "lucide-react";
import { PhotoAsset } from "@/lib/asset-manifest";

interface PhotoLightboxProps {
  photo: PhotoAsset | null;
  allPhotos: PhotoAsset[];
  onClose: () => void;
  onNavigate: (photo: PhotoAsset) => void;
}

export function PhotoLightbox({
  photo,
  allPhotos,
  onClose,
  onNavigate,
}: PhotoLightboxProps) {
  useEffect(() => {
    if (!photo) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [photo, allPhotos]);

  if (!photo) return null;

  const currentIndex = allPhotos.findIndex((p) => p.id === photo.id);
  const handlePrev = () => {
    if (currentIndex > 0) {
      onNavigate(allPhotos[currentIndex - 1]);
    } else {
      onNavigate(allPhotos[allPhotos.length - 1]);
    }
  };
  const handleNext = () => {
    if (currentIndex < allPhotos.length - 1) {
      onNavigate(allPhotos[currentIndex + 1]);
    } else {
      onNavigate(allPhotos[0]);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-900/95 backdrop-blur-2xl p-4 md:p-8 select-none"
        onClick={onClose}
      >
        {/* TOP BAR */}
        <div
          className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs text-cream-dim">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className="font-serif uppercase tracking-wider">{photo.chapterTitle}</span>
            <span className="text-cream-muted mx-1">•</span>
            <span className="font-mono text-[11px] text-gold-300">
              {currentIndex + 1} / {allPhotos.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={photo.src}
              download={photo.originalName || "bca-memory.jpg"}
              className="p-2 rounded-full bg-white/10 hover:bg-gold-400/20 text-cream hover:text-gold-200 transition-colors"
              title="Download full resolution photograph"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-rose-500/20 text-cream hover:text-rose-300 transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NAVIGATION PREV */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-gold-400/30 text-cream hover:text-gold-200 transition-all z-10 hidden sm:flex items-center justify-center hover:scale-110 active:scale-95"
          aria-label="Previous photograph"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* MAIN PHOTO DISPLAY */}
        <motion.div
          key={photo.id}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-5xl max-h-[82vh] flex flex-col items-center pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-2 sm:p-3 bg-cream/95 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-gold-400/20 max-h-[75vh] flex items-center justify-center">
            <img
              src={photo.src}
              alt={photo.caption || "BCA Memory Photograph"}
              className="max-h-[70vh] max-w-[90vw] md:max-w-[80vw] object-contain rounded-xl select-none"
              loading="eager"
            />
          </div>

          {/* CAPTION */}
          <div className="mt-4 text-center">
            <p className="text-sm sm:text-base font-serif text-cream italic">
              {photo.caption || `Batch Memory #${currentIndex + 1}`}
            </p>
            <p className="text-xs text-cream-muted/70 font-mono mt-0.5">
              {photo.originalName}
            </p>
          </div>
        </motion.div>

        {/* NAVIGATION NEXT */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-gold-400/30 text-cream hover:text-gold-200 transition-all z-10 hidden sm:flex items-center justify-center hover:scale-110 active:scale-95"
          aria-label="Next photograph"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
