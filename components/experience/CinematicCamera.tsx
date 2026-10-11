"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { TimelineController, TimelineState } from "@/lib/timeline-controller";

interface CinematicCameraProps {
  timelineState: TimelineState;
}

export function CinematicCamera({ timelineState }: CinematicCameraProps) {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const lookAtTarget = useRef(new THREE.Vector3(0, 0.4, 0));

  // Subtle mouse parallax
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(({ clock }, delta) => {
    const live = TimelineController.getInstance().getLiveState();
    const { phase, progress } = live;
    const t = clock.getElapsedTime();

    // Smootherstep helper
    const smootherstep = (edge0: number, edge1: number, val: number) => {
      const x = Math.max(0, Math.min(1, (val - edge0) / (edge1 - edge0)));
      return x * x * x * (x * (x * 6 - 15) + 10);
    };

    let targetCamX = 0;
    let targetCamY = 0.4;
    let targetCamZ = 5.2;

    let targetLookX = 0;
    let targetLookY = 0.4;
    let targetLookZ = 0;

    const percent = progress * 100;

    if (phase === "INITIAL_ENTRANCE") {
      // Facing closed entrance with gentle idle float
      targetCamX = mouse.current.x * 0.2 + Math.sin(t * 0.5) * 0.04;
      targetCamY = 0.45 + mouse.current.y * 0.12 + Math.cos(t * 0.6) * 0.03;
      targetCamZ = 5.2;

      targetLookX = 0;
      targetLookY = 0.45;
      targetLookZ = 0;
    } else if (phase === "DOOR_OPENING") {
      // Cinematic dolly-in through the opening doorway
      const openT = smootherstep(0, 8, percent);

      // Camera glides smoothly from Z = 5.2 to Z = 0.7
      targetCamX = mouse.current.x * 0.15 * (1 - openT * 0.5);
      targetCamY = THREE.MathUtils.lerp(0.45, 0.22, openT) + mouse.current.y * 0.08;
      targetCamZ = THREE.MathUtils.lerp(5.2, 0.7, openT);

      // LookAt travels from door center into classroom center
      targetLookX = 0;
      targetLookY = THREE.MathUtils.lerp(0.45, 0.1, openT);
      targetLookZ = THREE.MathUtils.lerp(0, -2.2, openT);
    } else if (phase === "MEMORIES_ACTIVE") {
      // Stationed smoothly overlooking the center stage where memories float
      // Organic steadycam breathe
      const breatheX = Math.sin(t * 0.4) * 0.06;
      const breatheY = Math.cos(t * 0.5) * 0.04;
      const breatheZ = Math.sin(t * 0.3) * 0.05;

      targetCamX = mouse.current.x * 0.22 + breatheX;
      targetCamY = 0.2 + mouse.current.y * 0.12 + breatheY;
      targetCamZ = 0.7 + breatheZ;

      // Look dead-center where each photo comes to rest
      targetLookX = mouse.current.x * 0.08;
      targetLookY = 0.1 + mouse.current.y * 0.05;
      targetLookZ = -2.2;
    } else if (phase === "DOOR_CLOSING") {
      // Emotional reverse dolly: gently retreats backwards through the doorway
      const closeT = smootherstep(93, 98, percent);

      targetCamX = mouse.current.x * 0.15;
      targetCamY = THREE.MathUtils.lerp(0.2, 0.45, closeT);
      targetCamZ = THREE.MathUtils.lerp(0.7, 5.2, closeT);

      targetLookX = 0;
      targetLookY = THREE.MathUtils.lerp(0.1, 0.45, closeT);
      targetLookZ = THREE.MathUtils.lerp(-2.2, 0, closeT);
    } else {
      // FINAL_GRADUATION: Stationed outside closed doors
      targetCamX = mouse.current.x * 0.15;
      targetCamY = 0.45 + mouse.current.y * 0.08;
      targetCamZ = 5.2;

      targetLookX = 0;
      targetLookY = 0.45;
      targetLookZ = 0;
    }

    // High precision damping for organic, butter-smooth motion
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 4.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 4.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 4.5, delta);

    lookAtTarget.current.x = THREE.MathUtils.damp(
      lookAtTarget.current.x,
      targetLookX,
      4.5,
      delta
    );
    lookAtTarget.current.y = THREE.MathUtils.damp(
      lookAtTarget.current.y,
      targetLookY,
      4.5,
      delta
    );
    lookAtTarget.current.z = THREE.MathUtils.damp(
      lookAtTarget.current.z,
      targetLookZ,
      4.5,
      delta
    );

    camera.lookAt(lookAtTarget.current);
  });

  return null;
}
