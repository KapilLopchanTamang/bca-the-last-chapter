"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface ParticleAtmosphereProps {
  count?: number;
  intensity?: number;
}

export function ParticleAtmosphere({ count = 280, intensity = 1 }: ParticleAtmosphereProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate randomized static positions (GPU-resident with zero per-frame buffer uploads)
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = Math.random() * 5.2 - 1.8;
      pos[i * 3 + 2] = Math.random() * 26 - 20;
    }
    return pos;
  }, [count]);

  // Smooth GPU transform updates without expensive CPU buffer modifications
  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.02 * intensity;
    pointsRef.current.position.y = Math.sin(t * 0.4) * 0.15;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color="#fae0a2"
        transparent
        opacity={0.65 * intensity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
