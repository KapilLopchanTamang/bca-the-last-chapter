"use client";

import React, { Suspense } from "react";
import { ClassroomDoor } from "./ClassroomDoor";
import { ClassroomInterior } from "./ClassroomInterior";
import { MemorySequence } from "./MemorySequence";
import { ParticleAtmosphere } from "./ParticleAtmosphere";
import { CloudAtmosphere } from "./CloudAtmosphere";
import { CinematicCamera } from "./CinematicCamera";
import { CollegeBuilding3D } from "./college/CollegeBuilding3D";
import { CollegeEnvironment } from "./college/CollegeEnvironment";
import { CollegeCorridor } from "./college/CollegeCorridor";
import { TimelineState } from "@/lib/timeline-controller";
import { PhotoAsset } from "@/lib/asset-manifest";

interface ClassroomSceneProps {
  timelineState: TimelineState;
  onSelectPhoto: (photo: PhotoAsset) => void;
}

export function ClassroomScene({ timelineState, onSelectPhoto }: ClassroomSceneProps) {
  const isExterior =
    timelineState.phase === "COLLEGE_EXTERIOR" ||
    timelineState.phase === "COLLEGE_APPROACH";

  return (
    <>
      {/* CINEMATIC CAMERA SYSTEM */}
      <CinematicCamera timelineState={timelineState} />

      {/* AMBIENT & ENVIRONMENTAL LIGHTING */}
      <ambientLight intensity={isExterior ? 0.75 : 0.55} color={isExterior ? "#e0f2fe" : "#ece0cf"} />

      {/* WARM SUNLIGHT STREAMING FROM INTERIOR */}
      <spotLight
        position={[0, 3.8, -4]}
        target-position={[0, 0, 5]}
        intensity={timelineState.lightIntensity * 2.2}
        color="#ffdc9c"
        angle={Math.PI / 3}
        penumbra={0.8}
      />

      {/* WARM SPOTLIGHT ILLUMINATING CENTER STAGE PHOTOS */}
      <spotLight
        position={[0, 2.8, 0.5]}
        target-position={[0, 0, -2.0]}
        intensity={timelineState.phase === "MEMORIES_ACTIVE" ? 1.8 : 0.2}
        color="#fff0d0"
        angle={Math.PI / 4}
        penumbra={0.7}
      />

      {/* 3D SCENE CONTENT IN SAFE SUSPENSE BOUNDARY */}
      <Suspense fallback={null}>
        {/* ========================================================================= */}
        {/* SCENE 1 & 2: ITAHARI NAMUNA COLLEGE 3D EXTERIOR & ENVIRONMENT (Z = 16)   */}
        {/* ========================================================================= */}
        <CollegeBuilding3D position={[0, -2.14, 16]} />
        <CollegeEnvironment intensity={isExterior ? 1.2 : 0.4} />

        {/* ========================================================================= */}
        {/* SCENE 3: INTERIOR HALLWAY CORRIDOR CONNECTING ENTRANCE TO CLASSROOM       */}
        {/* ========================================================================= */}
        <CollegeCorridor />

        {/* ========================================================================= */}
        {/* SCENE 4: CLASSROOM DOUBLE DOORS (At Z = 0)                                */}
        {/* ========================================================================= */}
        <ClassroomDoor doorAngle={timelineState.doorAngle} />

        {/* ========================================================================= */}
        {/* SCENE 5: CLASSROOM INTERIOR, MEMORY PHOTOS & BADAL SARI CLOUDS            */}
        {/* ========================================================================= */}
        <ClassroomInterior />

        {/* Floating Photograph Choreography */}
        <MemorySequence
          timelineState={timelineState}
          onSelectPhoto={onSelectPhoto}
        />

        {/* Golden Dust Particles */}
        <ParticleAtmosphere
          count={450}
          intensity={Math.max(0.4, timelineState.lightIntensity * 0.8)}
        />

        {/* Badal Sari Cloud Atmosphere */}
        <CloudAtmosphere
          intensity={Math.max(0.5, timelineState.lightIntensity * 0.9)}
        />
      </Suspense>
    </>
  );
}
