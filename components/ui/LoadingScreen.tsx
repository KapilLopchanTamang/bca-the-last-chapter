"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { MEMORY_CONFIG } from "@/lib/memory-config";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-cream">
      <div className="flex flex-col items-center gap-6 p-8 text-center">
        {/* Glowing badge */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full border border-gold-400/40 bg-gold-400/10 flex items-center justify-center text-gold-300 animate-pulse">
            <Sparkles className="w-8 h-8 text-gold-300" />
          </div>
          <div className="absolute inset-0 rounded-full bg-gold-400/20 blur-xl animate-ping" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-gold-400 font-medium">
            {MEMORY_CONFIG.collegeName}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-cream font-light tracking-wider">
            {MEMORY_CONFIG.opening.title}
          </h2>
          <p className="text-xs text-cream-muted font-serif italic">
            Preparing graduation memories...
          </p>
        </div>

        {/* Subtle loading bar */}
        <div className="w-48 h-1 rounded-full bg-charcoal-800 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-gold-500 to-amber-warm animate-pulse w-3/4 rounded-full" />
        </div>
      </div>
    </div>
  );
}
