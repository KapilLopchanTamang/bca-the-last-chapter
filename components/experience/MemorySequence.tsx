"use client";

import React, { useMemo, useEffect } from "react";
import { PHOTO_MANIFEST, PhotoAsset } from "@/lib/asset-manifest";
import { MemoryPhoto } from "./MemoryPhoto";
import { TimelineState } from "@/lib/timeline-controller";
import { textureCache } from "@/lib/texture-cache";

interface MemorySequenceProps {
  timelineState: TimelineState;
  onSelectPhoto: (photo: PhotoAsset) => void;
}

interface StreamPhotoData {
  photo: PhotoAsset;
  index: number;
}

export function MemorySequence({ timelineState, onSelectPhoto }: MemorySequenceProps) {
  // Select a curated stream of prominent photos spanning all 5 chapters
  const streamPhotos = useMemo<StreamPhotoData[]>(() => {
    const chapters = ["beginning", "classroom", "friendships", "journey", "final"];
    const list: StreamPhotoData[] = [];

    // Distribute photos fairly from each chapter (9 per chapter = 45 total)
    chapters.forEach((chId) => {
      const chPhotos = PHOTO_MANIFEST.filter((p) => p.chapterId === chId);
      const subset = chPhotos.slice(0, 9);
      subset.forEach((p) => {
        list.push({ photo: p, index: list.length });
      });
    });

    return list;
  }, []);

  // Pre-warm texture cache on mount to eliminate any micro-stutters
  useEffect(() => {
    const urls = streamPhotos.map((s) => s.photo.thumb || s.photo.src);
    textureCache.preloadBatch(urls);
  }, [streamPhotos]);

  // Pure stable rendering - every card manages its own smooth 60fps WebGL updates
  return (
    <group position={[0, 0, 0]}>
      {streamPhotos.map(({ photo, index }) => (
        <MemoryPhoto
          key={photo.id}
          photo={photo}
          index={index}
          totalPhotos={streamPhotos.length}
          onSelect={onSelectPhoto}
        />
      ))}
    </group>
  );
}
