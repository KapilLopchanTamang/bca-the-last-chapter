"use client";

import React, { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { MEMORY_CONFIG } from "@/lib/memory-config";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return MEMORY_CONFIG.share.url;
  };

  const shareUrl = getShareUrl();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn("Clipboard copy failed", e);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: MEMORY_CONFIG.share.title,
          text: MEMORY_CONFIG.share.description,
          url: shareUrl,
        });
        onClose();
      } catch (err) {
        // User canceled or failed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="max-w-md w-full rounded-3xl border border-gold-400/25 bg-charcoal-900/95 p-6 shadow-2xl text-cream space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-gold-400" />
            <h3 className="font-serif text-lg text-cream">Share Memories</h3>
          </div>
          <button
            onClick={onClose}
            className="text-cream-muted hover:text-cream text-xs px-2 py-1 rounded-md"
          >
            Close
          </button>
        </div>

        <p className="text-xs text-cream-muted leading-relaxed">
          Share this graduation memory experience with our batchmates, teachers, and friends.
        </p>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-charcoal-800 border border-white/10 text-xs font-mono">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="bg-transparent flex-1 outline-none text-cream-dim px-2"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-400 text-charcoal-900 font-sans font-medium text-xs hover:bg-gold-300 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
          <button
            onClick={handleNativeShare}
            className="w-full py-2.5 rounded-xl border border-gold-400/30 bg-gold-400/10 hover:bg-gold-400/20 text-gold-200 text-xs font-medium uppercase tracking-wider transition-colors"
          >
            Open Share Dialog
          </button>
        )}
      </div>
    </div>
  );
}
