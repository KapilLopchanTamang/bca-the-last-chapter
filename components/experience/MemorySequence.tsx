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
  // Complete photographic stream dynamically synchronized with PHOTO_MANIFEST
  const streamPhotos = useMemo<StreamPhotoData[]>(() => {
    return PHOTO_MANIFEST.map((photo, index) => ({
      photo,
      index,
    }));
  }, []);

  // Pre-warm texture cache on mount: initial batch of thumbnails and starting photos
  useEffect(() => {
    textureCache.preloadInitial(PHOTO_MANIFEST);
  }, []);

  // Smart lookahead preloading as stream progresses
  useEffect(() => {
    if (timelineState.liveStreamIndex >= 0) {
      textureCache.preloadUpcoming(PHOTO_MANIFEST, timelineState.liveStreamIndex, 8);
    }
  }, [timelineState.liveStreamIndex]);

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
