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
  const lookAtTarget = useRef(new THREE.Vector3(0, 0.45, 0));

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

    // Quintic smootherstep easing (6t^5 - 15t^4 + 10t^3)
    const smootherstep = (edge0: number, edge1: number, val: number) => {
      const x = Math.max(0, Math.min(1, (val - edge0) / (edge1 - edge0)));
      return x * x * x * (x * (x * 6 - 15) + 10);
    };

    let targetCamX = 0;
    let targetCamY = 0.45;
    let targetCamZ = 5.2;

    let targetLookX = 0;
    let targetLookY = 0.45;
    let targetLookZ = 0;

    const percent = progress * 100;

    if (phase === "INITIAL_ENTRANCE") {
      // Facing closed entrance with gentle cinematic breath
      targetCamX = mouse.current.x * 0.18 + Math.sin(t * 0.5) * 0.03;
      targetCamY = 0.45 + mouse.current.y * 0.1 + Math.cos(t * 0.6) * 0.025;
      targetCamZ = 5.2;

      targetLookX = 0;
      targetLookY = 0.45;
      targetLookZ = 0;
    } else if (phase === "DOOR_OPENING") {
      // THREE-STAGE CINEMATIC ENTRY
      // Stage 1 (0% to 1.8%): Anticipatory micro-push while handles turn and doors unlatch
      // Stage 2 (1.8% to 7.2%): Majestic glide through open doorway as light pours in
      // Stage 3 (7.2% to 8.0%): Soft cushion settling into memory center stage

      const pushT = smootherstep(1.6, 7.4, percent);

      targetCamX = mouse.current.x * 0.12 * (1 - pushT * 0.5);
      targetCamY = THREE.MathUtils.lerp(0.45, 0.20, pushT) + mouse.current.y * 0.06;
      targetCamZ = THREE.MathUtils.lerp(5.2, 0.70, pushT);

      // LookAt glides into classroom depth to center spotlight
      targetLookX = mouse.current.x * 0.05 * pushT;
      targetLookY = THREE.MathUtils.lerp(0.45, 0.12, pushT);
      targetLookZ = THREE.MathUtils.lerp(0, -2.2, pushT);
    } else if (phase === "MEMORIES_ACTIVE") {
      // Stationed smoothly overlooking the center spotlight where memories float
      // Organic steadycam breathe
      const breatheX = Math.sin(t * 0.4) * 0.045;
      const breatheY = Math.cos(t * 0.5) * 0.035;
      const breatheZ = Math.sin(t * 0.3) * 0.04;

      targetCamX = mouse.current.x * 0.18 + breatheX;
      targetCamY = 0.20 + mouse.current.y * 0.1 + breatheY;
      targetCamZ = 0.70 + breatheZ;

      // Look directly at center stage where each photograph holds spotlight
      targetLookX = mouse.current.x * 0.06;
      targetLookY = 0.12 + mouse.current.y * 0.04;
      targetLookZ = -2.2;
    } else if (phase === "DOOR_CLOSING") {
      // TWO-STAGE POETIC DEPARTURE:
      // Lingers briefly on the 36-photo mosaic arc, then glides back out through doorway
      const retreatT = smootherstep(94.0, 97.6, percent);

      targetCamX = mouse.current.x * 0.12;
      targetCamY = THREE.MathUtils.lerp(0.20, 0.45, retreatT);
      targetCamZ = THREE.MathUtils.lerp(0.70, 5.2, retreatT);

      targetLookX = 0;
      targetLookY = THREE.MathUtils.lerp(0.12, 0.45, retreatT);
      targetLookZ = THREE.MathUtils.lerp(-2.2, 0, retreatT);
    } else {
      // FINAL_GRADUATION: Stationed outside closed doors
      targetCamX = mouse.current.x * 0.12;
      targetCamY = 0.45 + mouse.current.y * 0.08;
      targetCamZ = 5.2;

      targetLookX = 0;
      targetLookY = 0.45;
      targetLookZ = 0;
    }

    // High precision responsive damping (smooth as butter, zero jitter)
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 6.0, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 6.0, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 6.0, delta);

    lookAtTarget.current.x = THREE.MathUtils.damp(
      lookAtTarget.current.x,
      targetLookX,
      6.0,
      delta
    );
    lookAtTarget.current.y = THREE.MathUtils.damp(
      lookAtTarget.current.y,
      targetLookY,
      6.0,
      delta
    );
    lookAtTarget.current.z = THREE.MathUtils.damp(
      lookAtTarget.current.z,
      targetLookZ,
      6.0,
      delta
    );

    camera.lookAt(lookAtTarget.current);
  });

  return null;
}
