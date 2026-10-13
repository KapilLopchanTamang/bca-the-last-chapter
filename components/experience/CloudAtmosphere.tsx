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
  rotSpeed: number;
  puffs: {
    offset: [number, number, number];
    scale: number;
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

  // Pre-calculate natural, lightweight cloud clusters
  const clusters = useMemo<CloudClusterData[]>(() => {
    const list: CloudClusterData[] = [];

    // 1. Outside Window Clouds
    const windowPositions: [number, number, number][] = [
      [-9.5, 3.2, -10],
      [-9.2, 2.6, -3],
      [-9.6, 2.2, 3],
    ];

    windowPositions.forEach((pos, idx) => {
      const puffs = [
        { offset: [0, 0, 0] as [number, number, number], scale: 2.2 },
        { offset: [1.2, 0.4, -0.6] as [number, number, number], scale: 1.8 },
        { offset: [-1.1, -0.3, 0.5] as [number, number, number], scale: 1.7 },
      ];
      list.push({
        initialPosition: pos,
        scale: 1.8 + idx * 0.2,
        speed: 0.06 + idx * 0.02,
        rotSpeed: 0.015,
        puffs,
      });
    });

    // 2. Classroom Floor Mist
    const floorPositions: [number, number, number][] = [
      [-3.0, -1.8, -6],
      [2.8, -1.8, -8],
      [-1.5, -1.85, -12],
      [2.0, -1.85, -14],
      [0.0, -1.85, -2],
    ];

    floorPositions.forEach((pos, idx) => {
      const puffs = [
        { offset: [0, 0, 0] as [number, number, number], scale: 2.4 },
        { offset: [1.4, 0.2, 0.8] as [number, number, number], scale: 2.0 },
        { offset: [-1.3, -0.1, -0.7] as [number, number, number], scale: 1.9 },
      ];
      list.push({
        initialPosition: pos,
        scale: 2.0 + (idx % 2) * 0.3,
        speed: 0.08 + (idx % 2) * 0.03,
        rotSpeed: 0.02,
        puffs,
      });
    });

    return list;
  }, []);

  // Optimized cluster drift without nested puff traversal
  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    const children = groupRef.current.children;
    for (let cIdx = 0; cIdx < children.length; cIdx++) {
      const clusterObj = children[cIdx];
      const data = clusters[cIdx];
      if (!data) continue;

      clusterObj.position.z += delta * data.speed;
      if (clusterObj.position.z > 3.5) {
        clusterObj.position.z = -20;
      }

      clusterObj.position.y = data.initialPosition[1] + Math.sin(t * 0.35 + cIdx) * 0.06;
      clusterObj.position.x = data.initialPosition[0] + Math.cos(t * 0.25 + cIdx) * 0.05;
      clusterObj.rotation.z += delta * data.rotSpeed;
    }
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
