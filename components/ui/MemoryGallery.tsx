"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Sparkles, Filter, Play } from "lucide-react";
import { PHOTO_MANIFEST, CHAPTER_CONFIG, PhotoAsset } from "@/lib/asset-manifest";
import { MEMORY_CONFIG } from "@/lib/memory-config";

interface MemoryGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPhoto: (photo: PhotoAsset) => void;
  onReplay: () => void;
}

export function MemoryGallery({
  isOpen,
  onClose,
  onSelectPhoto,
  onReplay,
}: MemoryGalleryProps) {
  const [selectedChapter, setSelectedChapter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredPhotos = useMemo(() => {
    return PHOTO_MANIFEST.filter((photo) => {
      const matchesChapter =
        selectedChapter === "all" || photo.chapterId === selectedChapter;
      const matchesSearch =
        searchQuery.trim() === "" ||
        photo.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (photo.caption && photo.caption.toLowerCase().includes(searchQuery.toLowerCase())) ||
        photo.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesChapter && matchesSearch;
    });
  }, [selectedChapter, searchQuery]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-charcoal-900/95 backdrop-blur-3xl overflow-y-auto selection:bg-amber-warm selection:text-charcoal-900"
      >
        {/* HEADER BAR */}
        <header className="sticky top-0 z-20 bg-charcoal-900/80 backdrop-blur-xl border-b border-gold-400/15 px-6 py-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Title & Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-gold-400/40 bg-gold-400/10 flex items-center justify-center text-gold-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl text-cream tracking-wide">
                  Memory Gallery
                </h2>
                <p className="text-xs text-cream-muted tracking-wider">
                  {PHOTO_MANIFEST.length} Photographs from {MEMORY_CONFIG.batchName}
                </p>
              </div>
            </div>

            {/* SEARCH & ACTIONS */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-cream-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search memories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-cream placeholder-cream-muted/60 focus:outline-none focus:border-gold-400/60 focus:bg-charcoal-800 transition-colors"
                />
              </div>

              <button
                onClick={onReplay}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-500/20 hover:bg-gold-500/30 border border-gold-400/40 text-gold-200 text-xs font-medium tracking-wider uppercase transition-colors"
                title="Play 3D Cinematic Film"
              >
                <Play className="w-3.5 h-3.5 fill-gold-200" />
                <span className="hidden sm:inline">3D Film</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-rose-500/20 text-cream hover:text-rose-300 transition-colors"
                title="Return to Experience"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* CHAPTER FILTER CHIPS */}
          <div className="max-w-7xl mx-auto mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedChapter("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition-all ${
                selectedChapter === "all"
                  ? "bg-gold-400 text-charcoal-900 shadow-[0_0_15px_rgba(223,168,87,0.4)]"
                  : "bg-white/5 text-cream-muted hover:text-cream hover:bg-white/10"
              }`}
            >
              All Memories ({PHOTO_MANIFEST.length})
            </button>

            {CHAPTER_CONFIG.map((ch) => {
              const count = PHOTO_MANIFEST.filter((p) => p.chapterId === ch.id).length;
              return (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChapter(ch.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition-all ${
                    selectedChapter === ch.id
                      ? "bg-gold-400 text-charcoal-900 shadow-[0_0_15px_rgba(223,168,87,0.4)]"
                      : "bg-white/5 text-cream-muted hover:text-cream hover:bg-white/10"
                  }`}
                >
                  {ch.title} ({count})
                </button>
              );
            })}
          </div>
        </header>

        {/* PHOTO GRID CONTAINER */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {filteredPhotos.length === 0 ? (
            <div className="text-center py-24 space-y-3">
              <p className="font-serif text-lg text-cream-muted">No memories found</p>
              <p className="text-xs text-cream-muted/60">
                Try a different search term or select another chapter
              </p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {filteredPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.02, 0.5) }}
                  onClick={() => onSelectPhoto(photo)}
                  className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-charcoal-800 border border-gold-400/15 cursor-pointer shadow-lg hover:shadow-[0_8px_30px_rgba(223,168,87,0.25)] hover:border-gold-400/50 transition-all duration-300"
                >
                  <img
                    src={photo.thumb || photo.src}
                    alt={photo.caption || "BCA memory photo"}
                    loading="lazy"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* OVERLAY WITH CAPTION */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-cream">
                    <span className="text-[10px] uppercase tracking-widest text-gold-300 font-semibold">
                      {photo.chapterTitle}
                    </span>
                    <p className="font-serif text-xs text-cream-dim truncate mt-0.5">
                      {photo.caption || `Memory #${index + 1}`}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </motion.div>
    </AnimatePresence>
  );
}
