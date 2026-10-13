"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X, Sparkles } from "lucide-react";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: "Space", desc: "Play / Pause experience" },
  { key: "F", desc: "Toggle Auditorium Fullscreen mode" },
  { key: "M", desc: "Mute / Unmute audio" },
  { key: "G", desc: "Browse full photograph gallery" },
  { key: "Y", desc: "Open Class Yearbook & Roster" },
  { key: "L", desc: "Toggle Badal Sari poetic subtitles" },
  { key: "R", desc: "Replay experience from beginning" },
  { key: "← / →", desc: "Jump 6 seconds backward / forward" },
  { key: "?", desc: "Toggle this shortcut guide" },
  { key: "Esc", desc: "Close any open dialog or modal" },
];

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md rounded-2xl bg-charcoal-900/95 border border-gold-400/30 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-cream"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gold-400/20">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gold-400/10 border border-gold-400/30 text-gold-300">
                <Keyboard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-light text-cream flex items-center gap-1.5">
                  Keyboard Shortcuts
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                </h3>
                <p className="text-[11px] text-cream-muted">
                  Auditorium & Farewell Presentation Controls
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-cream-muted hover:text-cream hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Shortcut items */}
          <div className="py-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
            {SHORTCUTS.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 hover:border-gold-400/20 transition-colors"
              >
                <span className="text-xs text-cream-dim">{item.desc}</span>
                <kbd className="px-2.5 py-1 rounded-md bg-gold-400/15 border border-gold-400/40 text-gold-200 font-mono text-[11px] font-semibold shadow-inner">
                  {item.key}
                </kbd>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-gold-400/15 text-center">
            <p className="text-[11px] text-cream-muted/80">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-gold-300 font-mono">Esc</kbd> anytime to return to the 3D scene
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
