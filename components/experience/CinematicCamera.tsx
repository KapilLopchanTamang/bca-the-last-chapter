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
  const lookAtTarget = useRef(new THREE.Vector3(1.0, 5.0, 16));

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

    let targetCamX = 14;
    let targetCamY = 5.8;
    let targetCamZ = 48;

    let targetLookX = 1.0;
    let targetLookY = 5.0;
    let targetLookZ = 16;

    const percent = progress * 100;

    if (phase === "COLLEGE_EXTERIOR") {
      // SCENE 1 & 2: WIDE ESTABLISHING SHOT & DRONE ORBIT (0% to 8%)
      if (percent < 4.0) {
        // Shot A: Wide Establishing View of Itahari Namuna College Building & Logo
        const driftX = Math.sin(t * 0.35) * 0.35;
        const driftY = Math.cos(t * 0.4) * 0.2;
        targetCamX = 14 + mouse.current.x * 0.6 + driftX;
        targetCamY = 5.8 + mouse.current.y * 0.4 + driftY;
        targetCamZ = 48;

        targetLookX = 1.0;
        targetLookY = 5.0;
        targetLookZ = 16;
      } else {
        // Shot B: Graceful Drone Orbit around the front three-quarters
        const orbitT = smootherstep(4.0, 8.0, percent);

        // Curving arc from [14, 5.8, 48] to [3.5, 3.2, 28]
        const arcBow = Math.sin(orbitT * Math.PI) * 1.8;
        targetCamX = THREE.MathUtils.lerp(14, 3.5, orbitT) + arcBow + mouse.current.x * 0.4;
        targetCamY = THREE.MathUtils.lerp(5.8, 3.2, orbitT) + mouse.current.y * 0.25;
        targetCamZ = THREE.MathUtils.lerp(48, 28, orbitT);

        // LookAt tracks toward the official college emblem and central entrance
        targetLookX = THREE.MathUtils.lerp(1.0, 0, orbitT);
        targetLookY = THREE.MathUtils.lerp(5.0, 3.8, orbitT);
        targetLookZ = 16;
      }
    } else if (phase === "COLLEGE_APPROACH") {
      // SCENE 3: AERIAL DIVE TOWARD CENTRAL ENTRANCE & LOGO (8% to 11.2%)
      const diveT = smootherstep(8.0, 11.2, percent);

      // Swoops down from [3.5, 3.2, 28] to [0, 0.45, 17.5] (right in front of entrance)
      targetCamX = THREE.MathUtils.lerp(3.5, 0, diveT) + mouse.current.x * 0.2 * (1 - diveT);
      targetCamY = THREE.MathUtils.lerp(3.2, 0.45, diveT) + mouse.current.y * 0.15 * (1 - diveT);
      targetCamZ = THREE.MathUtils.lerp(28, 17.5, diveT);

      // LookAt transitions from college logo plaque down to open glass entrance breezeway
      targetLookX = 0;
      targetLookY = THREE.MathUtils.lerp(3.8, 0.45, diveT);
      targetLookZ = 16;
    } else if (phase === "COLLEGE_CORRIDOR") {
      // SCENE 3 cont: FLY THROUGH ENTRANCE INTO INTERIOR CORRIDOR (11.2% to 13.0%)
      const corrT = smootherstep(11.2, 13.0, percent);

      // Glides straight down the corridor from Z = 16 down to Z = 5.2
      targetCamX = mouse.current.x * 0.1 * (1 - corrT);
      targetCamY = 0.45 + mouse.current.y * 0.08 * (1 - corrT);
      targetCamZ = THREE.MathUtils.lerp(17.5, 5.2, corrT);

      // LookAt is locked straight ahead on Classroom Door (Room 404 • BCA Batch)
      targetLookX = 0;
      targetLookY = 0.45;
      targetLookZ = 0;
    } else if (phase === "DOOR_OPENING") {
      // SCENE 4: ARRIVE OUTSIDE ROOM 404, DOORS OPEN, CAMERA PUSHES IN (13.0% to 14.5%)
      const enterT = smootherstep(13.2, 14.5, percent);

      // Camera glides through opening doorway from Z = 5.2 to Z = 0.70
      targetCamX = mouse.current.x * 0.12 * (1 - enterT * 0.5);
      targetCamY = THREE.MathUtils.lerp(0.45, 0.20, enterT) + mouse.current.y * 0.06;
      targetCamZ = THREE.MathUtils.lerp(5.2, 0.70, enterT);

      // LookAt transitions into center stage where photos will float
      targetLookX = mouse.current.x * 0.05 * enterT;
      targetLookY = THREE.MathUtils.lerp(0.45, 0.12, enterT);
      targetLookZ = THREE.MathUtils.lerp(0, -2.2, enterT);
    } else if (phase === "MEMORIES_ACTIVE") {
      // SCENE 5: STEADYCAM OVERLOOKING FLOATING PHOTOGRAPHS (14.5% to 93.0%)
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
      // SCENE 6: POETIC DEPARTURE RETREAT (93.0% to 98.0%)
      const retreatT = smootherstep(94.0, 97.6, percent);

      targetCamX = mouse.current.x * 0.12;
      targetCamY = THREE.MathUtils.lerp(0.20, 0.45, retreatT);
      targetCamZ = THREE.MathUtils.lerp(0.70, 5.2, retreatT);

      targetLookX = 0;
      targetLookY = THREE.MathUtils.lerp(0.12, 0.45, retreatT);
      targetLookZ = THREE.MathUtils.lerp(-2.2, 0, retreatT);
    } else {
      // SCENE 6 cont: FINAL GRADUATION STATIONED OUTSIDE CLOSED DOORS (98% to 100%)
      targetCamX = mouse.current.x * 0.12;
      targetCamY = 0.45 + mouse.current.y * 0.08;
      targetCamZ = 5.2;

      targetLookX = 0;
      targetLookY = 0.45;
      targetLookZ = 0;
    }

    // High precision responsive damping for buttery smooth motion
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 5.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 5.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 5.5, delta);

    lookAtTarget.current.x = THREE.MathUtils.damp(
      lookAtTarget.current.x,
      targetLookX,
      5.5,
      delta
    );
    lookAtTarget.current.y = THREE.MathUtils.damp(
      lookAtTarget.current.y,
      targetLookY,
      5.5,
      delta
    );
    lookAtTarget.current.z = THREE.MathUtils.damp(
      lookAtTarget.current.z,
      targetLookZ,
      5.5,
      delta
    );

    camera.lookAt(lookAtTarget.current);
  });

  return null;
}
