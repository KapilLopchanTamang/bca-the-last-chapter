"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface CloudAtmosphereProps {
  intensity?: number;
}

interface CloudClusterData {
  initialPosition: [number, number, number];
  scale: number;
  speed: number;
  puffs: {
    offset: [number, number, number];
    scale: number;
    rotSpeed: number;
  }[];
}

export function CloudAtmosphere({ intensity = 1 }: CloudAtmosphereProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Generate procedural soft radial cloud texture (100% offline, zero network requests)
  const cloudTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
    grad.addColorStop(0, "rgba(255, 248, 235, 0.95)");
    grad.addColorStop(0.25, "rgba(250, 230, 200, 0.7)");
    grad.addColorStop(0.55, "rgba(240, 205, 165, 0.35)");
    grad.addColorStop(0.85, "rgba(220, 180, 140, 0.08)");
    grad.addColorStop(1, "rgba(200, 160, 120, 0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  // Pre-calculate natural cloud clusters (windows, floor mist, and memory corridor)
  const clusters = useMemo<CloudClusterData[]>(() => {
    const list: CloudClusterData[] = [];

    // 1. Outside Window Clouds (floating outside the left windows in the open sky)
    const windowPositions: [number, number, number][] = [
      [-9.5, 3.2, -10],
      [-9.2, 2.8, -4],
      [-9.8, 3.5, 2],
      [-9.4, 1.8, -7],
    ];

    windowPositions.forEach((pos, idx) => {
      const puffs = [];
      for (let p = 0; p < 5; p++) {
        puffs.push({
          offset: [
            (Math.random() - 0.5) * 1.8,
            (Math.random() - 0.5) * 1.2,
            (Math.random() - 0.5) * 1.8,
          ] as [number, number, number],
          scale: 1.4 + Math.random() * 1.0,
          rotSpeed: (Math.random() - 0.5) * 0.04,
        });
      }
      list.push({
        initialPosition: pos,
        scale: 1.8 + idx * 0.2,
        speed: 0.06 + idx * 0.02,
        puffs,
      });
    });

    // 2. Classroom Floor Mist (clouds gently rolling across the floor like a dream)
    const floorPositions: [number, number, number][] = [
      [-3.2, -1.75, -5],
      [3.0, -1.75, -7],
      [-2.5, -1.8, -11],
      [2.8, -1.8, -14],
      [0.0, -1.85, -9],
      [-1.2, -1.85, -2],
      [1.5, -1.85, 0.5], // Cloud wisp near entrance doorway
    ];

    floorPositions.forEach((pos, idx) => {
      const puffs = [];
      for (let p = 0; p < 4; p++) {
        puffs.push({
          offset: [
            (Math.random() - 0.5) * 2.2,
            (Math.random() - 0.5) * 0.6,
            (Math.random() - 0.5) * 2.2,
          ] as [number, number, number],
          scale: 1.8 + Math.random() * 1.2,
          rotSpeed: (Math.random() - 0.5) * 0.03,
        });
      }
      list.push({
        initialPosition: pos,
        scale: 2.0 + (idx % 3) * 0.4,
        speed: 0.08 + (idx % 2) * 0.03,
        puffs,
      });
    });

    // 3. Floating Clouds behind center stage memories (adding nostalgic dreaminess)
    const skyPositions: [number, number, number][] = [
      [-4.0, 1.2, -15],
      [4.0, 1.5, -16],
      [0.0, 2.5, -18],
    ];

    skyPositions.forEach((pos, idx) => {
      const puffs = [];
      for (let p = 0; p < 5; p++) {
        puffs.push({
          offset: [
            (Math.random() - 0.5) * 2.5,
            (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 2.0,
          ] as [number, number, number],
          scale: 2.2 + Math.random() * 1.0,
          rotSpeed: (Math.random() - 0.5) * 0.02,
        });
      }
      list.push({
        initialPosition: pos,
        scale: 2.4,
        speed: 0.05,
        puffs,
      });
    });

    return list;
  }, []);

  // Drifting motion in useFrame
  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    groupRef.current.children.forEach((clusterObj, cIdx) => {
      const data = clusters[cIdx];
      if (!data) return;

      // Slow majestic cloud drift forward along Z
      clusterObj.position.z += delta * data.speed;

      // Wrap around when drifted past front threshold
      if (clusterObj.position.z > 3.5) {
        clusterObj.position.z = -20;
      }

      // Gentle swaying wave
      clusterObj.position.y = data.initialPosition[1] + Math.sin(t * 0.4 + cIdx) * 0.08;
      clusterObj.position.x = data.initialPosition[0] + Math.cos(t * 0.3 + cIdx) * 0.06;

      // Rotate individual puffs
      clusterObj.children.forEach((puffObj, pIdx) => {
        const puffData = data.puffs[pIdx];
        if (puffData) {
          puffObj.rotation.z += delta * puffData.rotSpeed;
        }
      });
    });
  });

  if (!cloudTexture) return null;

  return (
    <group ref={groupRef}>
      {clusters.map((cluster, cIdx) => (
        <group
          key={`cloud-cluster-${cIdx}`}
          position={cluster.initialPosition}
          scale={cluster.scale}
        >
          {cluster.puffs.map((puff, pIdx) => (
            <mesh
              key={`puff-${pIdx}`}
              position={puff.offset}
              scale={puff.scale}
            >
              <planeGeometry args={[2, 2]} />
              <meshBasicMaterial
                map={cloudTexture}
                transparent
                opacity={0.35 * intensity}
                depthWrite={false}
                blending={THREE.NormalBlending}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
