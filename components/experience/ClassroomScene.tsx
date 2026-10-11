"use client";

import React, { Suspense } from "react";
import { ClassroomDoor } from "./ClassroomDoor";
import { ClassroomInterior } from "./ClassroomInterior";
import { MemorySequence } from "./MemorySequence";
import { ParticleAtmosphere } from "./ParticleAtmosphere";
import { CloudAtmosphere } from "./CloudAtmosphere";
import { CinematicCamera } from "./CinematicCamera";
import { TimelineState } from "@/lib/timeline-controller";
import { PhotoAsset } from "@/lib/asset-manifest";

interface ClassroomSceneProps {
  timelineState: TimelineState;
  onSelectPhoto: (photo: PhotoAsset) => void;
}

export function ClassroomScene({ timelineState, onSelectPhoto }: ClassroomSceneProps) {
  return (
    <>
      {/* CINEMATIC CAMERA SYSTEM */}
      <CinematicCamera timelineState={timelineState} />

      {/* AMBIENT & ENVIRONMENTAL LIGHTING */}
      <ambientLight intensity={0.5} color="#ece0cf" />

      {/* WARM FOREGROUND RIM LIGHT */}
      <directionalLight
        position={[4, 6, 6]}
        intensity={0.8}
        color="#ffeacc"
        castShadow
      />

      {/* WARM SUNLIGHT STREAMING FROM INTERIOR */}
      <spotLight
        position={[0, 3.8, -4]}
        target-position={[0, 0, 5]}
        intensity={timelineState.lightIntensity * 2.5}
        color="#ffdc9c"
        angle={Math.PI / 3}
        penumbra={0.8}
      />

      {/* WARM SPOTLIGHT ILLUMINATING CENTER STAGE PHOTOS */}
      <spotLight
        position={[0, 2.8, 0.5]}
        target-position={[0, 0, -2.0]}
        intensity={timelineState.phase === "MEMORIES_ACTIVE" ? 1.8 : 0.3}
        color="#fff0d0"
        angle={Math.PI / 4}
        penumbra={0.7}
      />

      {/* 3D SCENE CONTENT IN SAFE SUSPENSE BOUNDARY */}
      <Suspense fallback={null}>
        {/* CLASSROOM DOOR (Animated Pivoting Leaves) */}
        <ClassroomDoor doorAngle={timelineState.doorAngle} />

        {/* CLASSROOM INTERIOR (Walls, Desks, Blackboard, Lamps) */}
        <ClassroomInterior />

        {/* MEMORY SEQUENCE (Floating Photographs & Finale Collage) */}
        <MemorySequence
          timelineState={timelineState}
          onSelectPhoto={onSelectPhoto}
        />

        {/* GOLDEN DUST PARTICLES IN AIR */}
        <ParticleAtmosphere
          count={450}
          intensity={Math.max(0.4, timelineState.lightIntensity * 0.8)}
        />

        {/* NOSTALGIC DRIFTING CLOUDS (Badal Sari Atmospheric Cloud System) */}
        <CloudAtmosphere
          intensity={Math.max(0.5, timelineState.lightIntensity * 0.9)}
        />
      </Suspense>
    </>
  );
}
