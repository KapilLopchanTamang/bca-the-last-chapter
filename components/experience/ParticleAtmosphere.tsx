"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface ParticleAtmosphereProps {
  count?: number;
  intensity?: number;
}

export function ParticleAtmosphere({ count = 500, intensity = 1 }: ParticleAtmosphereProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate randomized positions and speeds
  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const scl = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spread across room volume
      pos[i * 3 + 0] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = Math.random() * 5 - 1.8;
      pos[i * 3 + 2] = Math.random() * 26 - 20;

      scl[i] = Math.random() * 0.04 + 0.02;
    }
    return [pos, scl];
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime() * 0.25;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const array = posAttr.array as Float32Array;

    const driftY = 0.003 * intensity;
    const swirl1 = Math.sin(t) * 0.002;
    const swirl2 = Math.cos(t) * 0.002;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      array[idx + 1] += driftY;
      array[idx + 0] += (i % 2 === 0 ? swirl1 : -swirl2);

      // Wrap around if risen too high
      if (array[idx + 1] > 3.8) {
        array[idx + 1] = -1.8;
      }
    }
    posAttr.needsUpdate = true;
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
        size={0.06}
        color="#fae0a2"
        transparent
        opacity={0.7 * intensity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
