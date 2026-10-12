"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Sparkles } from "lucide-react";

interface LyricsOverlayProps {
  currentTime: number;
  progress: number; // 0 to 1
  isVisible: boolean;
}

interface LyricSegment {
  startTime: number;
  endTime: number;
  nepali: string;
  english: string;
}

const LYRIC_SEGMENTS: LyricSegment[] = [
  {
    startTime: 0,
    endTime: 26,
    nepali: "इटहरी नमुना कलेज — जहाँबाट हाम्रो यात्रा सुरु भयो...",
    english: "Itahari Namuna College — where our shared story first began...",
  },
  {
    startTime: 26,
    endTime: 51,
    nepali: "कलेजको प्राङ्गण, कोरिडोर, अनि त्यो चिरपरिचित कक्षा कोठा...",
    english: "Through the campus plaza, corridors, into our cherished classroom...",
  },
  {
    startTime: 51,
    endTime: 85,
    nepali: "बादल सरि उडिरहेका ती पुराना दिनहरू...",
    english: "Like clouds drifting gently across the endless blue sky...",
  },
  {
    startTime: 55,
    endTime: 90,
    nepali: "पहिलो भेट, नौलो कक्षा, नयाँ साथीहरूको मुहार...",
    english: "The first morning, unfamiliar corridors, and faces that would become dear...",
  },
  {
    startTime: 90,
    endTime: 135,
    nepali: "कम्प्युटर ल्याब, कोडिङ, अनि क्यान्टिनको चिया गफ...",
    english: "Debugging codes in the computer lab, deadlines, and canteen chai...",
  },
  {
    startTime: 135,
    endTime: 185,
    nepali: "अन्जान थियौं हामी, तर आज एउटै परिवार बन्यौं...",
    english: "We walked in as strangers, but today we stand together as family...",
  },
  {
    startTime: 185,
    endTime: 245,
    nepali: "हाँसो, आँसु, परीक्षाको तनाव अनि उत्सवका पलहरू...",
    english: "The shared laughter, last-minute viva preps, and unforgettable celebrations...",
  },
  {
    startTime: 245,
    endTime: 305,
    nepali: "कति छिट्टै बिते यी तीन वर्षहरू, थाहै नपाई...",
    english: "How swiftly these years flew by, leaving footprints etched forever in our souls...",
  },
  {
    startTime: 305,
    endTime: 335,
    nepali: "गन्तव्य फरक होलान्, तर सम्झनाहरू सधैं अमर रहनेछन्...",
    english: "Our paths will diverge into tomorrow, but our shared memories remain immortal...",
  },
  {
    startTime: 335,
    endTime: 360,
    nepali: "टाढा गए पनि बादल सरि मनमा सधैं रहनेछौ — अल बिदा बी.सी.ए.!",
    english: "Wherever life's wind carries us, our hearts will stay connected — Farewell BCA!",
  },
];

export function LyricsOverlay({ currentTime, progress, isVisible }: LyricsOverlayProps) {
  const currentLyric = useMemo(() => {
    return LYRIC_SEGMENTS.find(
      (seg) => currentTime >= seg.startTime && currentTime < seg.endTime
    ) || null;
  }, [currentTime]);

  if (!isVisible || !currentLyric) return null;

  return (
    <div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-20 pointer-events-none max-w-xl w-[90%] text-center select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLyric.nepali}
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex flex-col items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-charcoal-900/80 backdrop-blur-xl border border-gold-400/25 shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
        >
          <div className="flex items-center gap-2 text-gold-300">
            <Cloud className="w-3.5 h-3.5 opacity-80 animate-pulse text-gold-400" />
            <p className="font-serif text-sm sm:text-base text-gold-200 tracking-wide font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {currentLyric.nepali}
            </p>
            <Sparkles className="w-3.5 h-3.5 opacity-80 text-amber-warm" />
          </div>

          <p className="text-[11px] sm:text-xs text-cream-muted/90 italic font-light tracking-wide">
            {currentLyric.english}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
