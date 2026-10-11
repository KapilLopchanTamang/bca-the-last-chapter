"use client";

import React, { useMemo, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PHOTO_MANIFEST, PhotoAsset } from "@/lib/asset-manifest";
import { MemoryPhoto } from "./MemoryPhoto";
import { TimelineController, TimelineState } from "@/lib/timeline-controller";

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

    // Distribute photos fairly from each chapter
    chapters.forEach((chId) => {
      const chPhotos = PHOTO_MANIFEST.filter((p) => p.chapterId === chId);
      // Take up to 9 distinct photos per chapter
      const subset = chPhotos.slice(0, 9);
      subset.forEach((p) => {
        list.push({ photo: p, index: list.length });
      });
    });

    return list;
  }, []);

  // Track live float index for the stream
  const [liveStreamIndex, setLiveStreamIndex] = useState(0);
  const [livePhase, setLivePhase] = useState(timelineState.phase);

  useFrame(() => {
    const live = TimelineController.getInstance().getLiveState();
    setLivePhase(live.phase);

    if (live.phase === "MEMORIES_ACTIVE") {
      const idx = live.memoryStreamProgress * (streamPhotos.length - 1);
      setLiveStreamIndex(idx);
    } else if (live.phase === "DOOR_OPENING") {
      // First photo is already waiting in the doorway as doors open
      setLiveStreamIndex(0);
    }
  });

  const isFinale =
    livePhase === "DOOR_CLOSING" ||
    livePhase === "FINAL_GRADUATION" ||
    timelineState.progress > 0.93;

  // Render photos based on whether in stream mode or finale arc
  return (
    <group position={[0, 0, 0]}>
      {streamPhotos.map(({ photo, index }) => {
        if (isFinale) {
          // GRAND FINALE MOSAIC ARC: Photos arrange into a majestic classroom gallery
          const totalFinale = Math.min(streamPhotos.length, 36);
          if (index >= totalFinale) return null;

          const col = index % 9;
          const row = Math.floor(index / 9);
          const arcX = (col - 4) * 1.55;
          const arcY = 1.3 - row * 1.3;
          const arcZ = -11.5 - Math.abs(col - 4) * 0.25; // Subtle curved amphitheater arc

          return (
            <MemoryPhoto
              key={photo.id}
              photo={photo}
              targetPosition={[arcX, arcY, arcZ]}
              targetRotation={[0, (col - 4) * -0.05, 0]}
              targetScale={0.88}
              targetOpacity={0.9}
              isCenterHero={false}
              onSelect={onSelectPhoto}
            />
          );
        }

        // CINEMATIC STREAM MODE: Each photo enters, takes center stage, and passes through
        const diff = index - liveStreamIndex;

        // Cull photos far in the future (> 2.8) or far in the past (< -1.6)
        if (diff > 2.8 || diff < -1.6) {
          return null;
        }

        const isCenterHero = Math.abs(diff) < 0.35;

        let posX = 0;
        let posY = 0.15;
        let posZ = -2.0;
        let scale = 1.25;
        let opacity = 1.0;
        let rotY = 0;
        let rotX = 0;

        if (diff >= 0) {
          // ENTERING FROM DEPTH TOWARDS CENTER (diff: 2.8 -> 0)
          const enterT = Math.min(1, diff / 2.6); // 1 at far distance, 0 at center
          // Z travels from -10.5 to -2.0
          posZ = -2.0 - enterT * 8.5;
          // X converges from side to center
          const sideOffset = (index % 2 === 0 ? 0.95 : -0.95) * enterT;
          posX = sideOffset;
          // Scale grows from 0.5 to 1.25
          scale = THREE.MathUtils.lerp(1.25, 0.52, enterT);
          // Opacity fades in
          opacity = THREE.MathUtils.clamp((1 - enterT) * 1.4, 0, 1);
          // Subtle entry tilt
          rotY = (index % 2 === 0 ? -0.15 : 0.15) * enterT;
          rotX = enterT * 0.08;
        } else {
          // PASSING THROUGH PAST CAMERA (diff: 0 -> -1.6)
          const passT = Math.min(1, -diff / 1.4); // 0 at center, 1 past camera
          // Z travels forward from -2.0 to +1.8
          posZ = -2.0 + passT * 3.8;
          // X sweeps to the side as it passes
          const sweepX = (index % 2 === 0 ? -2.2 : 2.2) * passT;
          posX = sweepX;
          // Scale expands as it approaches camera
          scale = THREE.MathUtils.lerp(1.25, 1.45, passT);
          // Dissolves gracefully
          opacity = THREE.MathUtils.clamp(1 - passT * 1.2, 0, 1);
          // Subtle bank angle
          rotY = (index % 2 === 0 ? 0.25 : -0.25) * passT;
        }

        return (
          <MemoryPhoto
            key={photo.id}
            photo={photo}
            targetPosition={[posX, posY, posZ]}
            targetRotation={[rotX, rotY, 0]}
            targetScale={scale}
            targetOpacity={opacity}
            isCenterHero={isCenterHero}
            onSelect={onSelectPhoto}
          />
        );
      })}
    </group>
  );
}
