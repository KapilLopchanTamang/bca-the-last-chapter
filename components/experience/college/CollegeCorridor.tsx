"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";

export function CollegeCorridor() {
  const corridorLength = 16; // from Z = 0 to Z = 16
  const corridorWidth = 4.8;  // X from -2.4 to +2.4
  const corridorHeight = 4.1; // Y from -2.14 to +1.96
  const floorY = -2.14;

  const floorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#d9d2c5", // Polished institutional terrazzo tile
        roughness: 0.22,
        metalness: 0.08,
      }),
    []
  );

  const wallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f1ede2", // Warm institutional cream wall
        roughness: 0.8,
      }),
    []
  );

  const woodTrimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#3a2213", // Rich mahogany matching classroom door
        roughness: 0.45,
        metalness: 0.08,
      }),
    []
  );

  const ceilingMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#faf8f5",
        roughness: 0.9,
      }),
    []
  );

  const brassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#d4af37",
        roughness: 0.3,
        metalness: 0.85,
      }),
    []
  );

  // Helper for framed wall achievement / memory prints
  const FramedPrint = ({
    x,
    y,
    z,
    rotY = 0,
    title,
    subtitle,
  }: {
    x: number;
    y: number;
    z: number;
    rotY?: number;
    title: string;
    subtitle: string;
  }) => (
    <group position={[x, y, z]} rotation={[0, rotY, 0]}>
      {/* Outer Wooden Frame */}
      <mesh castShadow>
        <boxGeometry args={[1.4, 1.0, 0.04]} />
        <primitive object={woodTrimMaterial} attach="material" />
      </mesh>
      {/* Inner White Matte */}
      <mesh position={[0, 0, 0.022]}>
        <planeGeometry args={[1.25, 0.85]} />
        <meshStandardMaterial color="#fffdf8" roughness={0.4} />
      </mesh>
      <Text position={[0, 0.15, 0.025]} fontSize={0.09} color="#1e293b" anchorX="center">
        {title}
      </Text>
      <Text position={[0, -0.12, 0.025]} fontSize={0.065} color="#0284c7" anchorX="center">
        {subtitle}
      </Text>
    </group>
  );

  return (
    <group position={[0, 0, corridorLength / 2]}>
      {/* ========================================================================= */}
      {/* 1. CORRIDOR FLOOR, WALLS, CEILING (Z = 0 to Z = 16)                        */}
      {/* ========================================================================= */}
      {/* Floor with Specular Sheen */}
      <mesh
        position={[0, floorY, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[corridorWidth, corridorLength]} />
        <primitive object={floorMaterial} attach="material" />
      </mesh>

      {/* Ceiling */}
      <mesh
        position={[0, floorY + corridorHeight, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[corridorWidth, corridorLength]} />
        <primitive object={ceilingMaterial} attach="material" />
      </mesh>

      {/* Left Interior Wall */}
      <mesh
        position={[-corridorWidth / 2, floorY + corridorHeight / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[corridorLength, corridorHeight]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>

      {/* Right Interior Wall */}
      <mesh
        position={[corridorWidth / 2, floorY + corridorHeight / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[corridorLength, corridorHeight]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>

      {/* Baseboard Skirting Trim on both sides */}
      <mesh position={[-corridorWidth / 2 + 0.02, floorY + 0.1, 0]}>
        <boxGeometry args={[0.04, 0.2, corridorLength]} />
        <primitive object={woodTrimMaterial} attach="material" />
      </mesh>
      <mesh position={[corridorWidth / 2 - 0.02, floorY + 0.1, 0]}>
        <boxGeometry args={[0.04, 0.2, corridorLength]} />
        <primitive object={woodTrimMaterial} attach="material" />
      </mesh>

      {/* Mid-Wall Chair Rail Molding */}
      <mesh position={[-corridorWidth / 2 + 0.02, floorY + 1.1, 0]}>
        <boxGeometry args={[0.04, 0.08, corridorLength]} />
        <primitive object={woodTrimMaterial} attach="material" />
      </mesh>
      <mesh position={[corridorWidth / 2 - 0.02, floorY + 1.1, 0]}>
        <boxGeometry args={[0.04, 0.08, corridorLength]} />
        <primitive object={woodTrimMaterial} attach="material" />
      </mesh>

      {/* ========================================================================= */}
      {/* 2. CORRIDOR WARM OVERHEAD CEILING LIGHTS                                  */}
      {/* ========================================================================= */}
      {[-5, 0, 5].map((z, idx) => (
        <group key={`corr-light-${idx}`} position={[0, floorY + corridorHeight - 0.05, z]}>
          {/* Flush Ceiling LED Panel */}
          <mesh>
            <boxGeometry args={[1.2, 0.04, 1.2]} />
            <meshStandardMaterial color="#fff8e7" emissive="#ffeacc" emissiveIntensity={0.8} />
          </mesh>
          <pointLight
            position={[0, -0.3, 0]}
            color="#ffe9cc"
            intensity={0.85}
            distance={7}
            decay={2}
          />
        </group>
      ))}

      {/* ========================================================================= */}
      {/* 3. WALL FRAMES, BATCH PLAQUES, HALLWAY ACCENTS                            */}
      {/* ========================================================================= */}
      {/* Left Wall Framed Honors */}
      <FramedPrint
        x={-corridorWidth / 2 + 0.03}
        y={floorY + 2.0}
        z={-3.5}
        rotY={Math.PI / 2}
        title="FACULTY OF CS & IT"
        subtitle="Department of Computer Applications"
      />
      <FramedPrint
        x={-corridorWidth / 2 + 0.03}
        y={floorY + 2.0}
        z={2.5}
        rotY={Math.PI / 2}
        title="BCA EXCELLENCE"
        subtitle="Batch 2021 — 2024"
      />

      {/* Right Wall Framed Honors */}
      <FramedPrint
        x={corridorWidth / 2 - 0.03}
        y={floorY + 2.0}
        z={-3.5}
        rotY={-Math.PI / 2}
        title="ITAHARI NAMUNA COLLEGE"
        subtitle="Knowledge • Integrity • Service"
      />
      <FramedPrint
        x={corridorWidth / 2 - 0.03}
        y={floorY + 2.0}
        z={2.5}
        rotY={-Math.PI / 2}
        title="ANNUAL TECH FEST"
        subtitle="Innovation & Code Showcase"
      />

      {/* DIRECTIONAL OVERHEAD SIGN NEAR CLASSROOM DOOR */}
      <group position={[0, floorY + corridorHeight - 0.6, -corridorLength / 2 + 1.8]}>
        <mesh castShadow>
          <boxGeometry args={[1.8, 0.35, 0.06]} />
          <primitive object={woodTrimMaterial} attach="material" />
        </mesh>
        <Text position={[0, 0.02, 0.035]} fontSize={0.11} color="#f59e0b" anchorX="center">
          ROOM 404 • BCA CLASSROOM ➜
        </Text>
      </group>
    </group>
  );
}
