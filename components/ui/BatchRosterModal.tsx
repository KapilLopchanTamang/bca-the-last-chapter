"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Sparkles, Search, Award } from "lucide-react";
import { MEMORY_CONFIG } from "@/lib/memory-config";
import { PHOTO_MANIFEST } from "@/lib/asset-manifest";

interface BatchRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BatchRosterModal({ isOpen, onClose }: BatchRosterModalProps) {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const members = MEMORY_CONFIG.batchMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.superlative.toLowerCase().includes(search.toLowerCase()) ||
      (m.quote && m.quote.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-charcoal-900/90 backdrop-blur-2xl selection:bg-amber-warm selection:text-charcoal-900"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative max-w-3xl w-full max-h-[85vh] flex flex-col bg-charcoal-900/95 border border-gold-400/25 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden text-cream"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="p-6 border-b border-gold-400/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-charcoal-900 to-charcoal-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-gold-400/40 bg-gold-400/10 flex items-center justify-center text-gold-300">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-cream tracking-wide">
                  Batch Yearbook &amp; Roster
                </h3>
                <p className="text-xs text-cream-muted tracking-wider">
                  {MEMORY_CONFIG.batchName} • Class of {MEMORY_CONFIG.graduationYear}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-rose-500/20 text-cream hover:text-rose-300 transition-colors self-end sm:self-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* BATCH STATS BANNER */}
          <div className="grid grid-cols-3 divide-x divide-white/10 bg-white/5 py-3 px-6 text-center text-xs">
            <div>
              <span className="block font-mono text-base font-bold text-gold-400">
                {PHOTO_MANIFEST.length}
              </span>
              <span className="text-[10px] uppercase text-cream-muted tracking-widest">
                Photographs
              </span>
            </div>
            <div>
              <span className="block font-mono text-base font-bold text-gold-400">
                3+ Years
              </span>
              <span className="text-[10px] uppercase text-cream-muted tracking-widest">
                Journey
              </span>
            </div>
            <div>
              <span className="block font-mono text-base font-bold text-gold-400">
                Infinite
              </span>
              <span className="text-[10px] uppercase text-cream-muted tracking-widest">
                Memories
              </span>
            </div>
          </div>

          {/* SEARCH */}
          <div className="px-6 pt-4">
            <div className="relative">
              <Search className="w-4 h-4 text-cream-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search classmates or superlatives..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-charcoal-800 border border-white/10 text-xs text-cream placeholder-cream-muted/50 focus:outline-none focus:border-gold-400/50"
              />
            </div>
          </div>

          {/* MEMBER CARDS LIST */}
          <div className="p-6 overflow-y-auto space-y-3 flex-1 scrollbar-thin">
            {members.length === 0 ? (
              <p className="text-center py-12 text-sm text-cream-muted">
                No batchmates found matching &ldquo;{search}&rdquo;
              </p>
            ) : (
              members.map((member) => (
                <div
                  key={member.id}
                  className="p-4 rounded-2xl border border-white/5 bg-charcoal-800/60 hover:bg-charcoal-800 hover:border-gold-400/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-base text-cream">
                        {member.name}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gold-400/10 border border-gold-400/20 text-[10px] text-gold-300 uppercase tracking-wider font-semibold">
                        <Award className="w-2.5 h-2.5" />
                        {member.superlative}
                      </span>
                    </div>
                    {member.quote && (
                      <p className="text-xs text-cream-muted italic font-serif">
                        &ldquo;{member.quote}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* FOOTER */}
          <div className="p-4 border-t border-white/10 bg-charcoal-900/60 text-center text-[11px] text-cream-muted">
            Tip: You can edit or add all batchmate names in{" "}
            <code className="text-gold-300 font-mono">lib/memory-config.ts</code>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
