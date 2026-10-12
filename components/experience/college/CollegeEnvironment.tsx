"use client";

import React, { useMemo } from "react";
import * as THREE from "three";

interface CollegeEnvironmentProps {
  intensity?: number;
}

export function CollegeEnvironment({ intensity = 1 }: CollegeEnvironmentProps) {
  // Paved Plaza Ground Material
  const plazaMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#334155", // Paved asphalt courtyard
        roughness: 0.85,
        metalness: 0.1,
      }),
    []
  );

  const walkwayMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#e2e8f0", // Clean light-grey pedestrian pavement
        roughness: 0.7,
      }),
    []
  );

  const grassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#2e5c38", // Lush campus green lawn
        roughness: 0.9,
      }),
    []
  );

  const foliageMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1e4620", // Deep green shrubbery & ornamental trees
        roughness: 0.8,
      }),
    []
  );

  const trunkMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#4a3525", // Tree bark
        roughness: 0.9,
      }),
    []
  );

  const curbMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#94a3b8",
        roughness: 0.75,
      }),
    []
  );

  // Helper to render campus ornamental trees
  const CampusTree = ({ x, z }: { x: number; z: number }) => (
    <group position={[x, 0, z]}>
      {/* Tree Trunk */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.25, 2.4, 12]} />
        <primitive object={trunkMaterial} attach="material" />
      </mesh>
      {/* Layered Foliage Canopy */}
      <mesh position={[0, 2.6, 0]} castShadow>
        <coneGeometry args={[1.6, 2.2, 8]} />
        <primitive object={foliageMaterial} attach="material" />
      </mesh>
      <mesh position={[0, 3.8, 0]} castShadow>
        <coneGeometry args={[1.2, 1.8, 8]} />
        <primitive object={foliageMaterial} attach="material" />
      </mesh>
      <mesh position={[0, 4.8, 0]} castShadow>
        <coneGeometry args={[0.8, 1.4, 8]} />
        <primitive object={foliageMaterial} attach="material" />
      </mesh>
    </group>
  );

  return (
    <group position={[0, 0, 0]}>
      {/* ========================================================================= */}
      {/* 1. CINEMATIC OUTDOOR LIGHTING RIG                                         */}
      {/* ========================================================================= */}
      {/* Primary Warm Sun (Morning / Golden Light) */}
      <directionalLight
        position={[22, 32, 40]}
        intensity={1.4 * intensity}
        color="#fff6e5"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={90}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={25}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0005}
      />

      {/* Secondary Soft Cyan/Blue Sky Fill (keeps blue building vibrant!) */}
      <directionalLight
        position={[-18, 24, 25]}
        intensity={0.65 * intensity}
        color="#a5d8ff"
      />

      {/* Gentle Upward Ground Bounce Ambient Fill */}
      <hemisphereLight
        color="#bae6fd"
        groundColor="#475569"
        intensity={0.55 * intensity}
      />

      {/* ========================================================================= */}
      {/* 2. CAMPUS PLAZA & ENTRANCE COURTYARD                                      */}
      {/* ========================================================================= */}
      {/* Main Wide Asphalt Plaza */}
      <mesh
        position={[0, -0.05, 36]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[120, 50]} />
        <primitive object={plazaMaterial} attach="material" />
      </mesh>

      {/* Main Pedestrian Entrance Walkway / Apron */}
      <mesh
        position={[0, 0.02, 24]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[26, 12]} />
        <primitive object={walkwayMaterial} attach="material" />
      </mesh>

      {/* Painted Campus Parking Bays & Wayfinding Markings */}
      {[-16, -11, -6, 6, 11, 16].map((x, idx) => (
        <group key={`parking-mark-${idx}`} position={[x, 0.04, 34]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.15, 5.5]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
          <mesh position={[1.4, 2.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.8, 0.15]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* ========================================================================= */}
      {/* 3. LANDSCAPED GARDEN BEDS & CAMPUS TREES                                  */}
      {/* ========================================================================= */}
      {/* Left Garden Lawn Bed */}
      <group position={[-24, 0, 22]}>
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[14, 8]} />
          <primitive object={grassMaterial} attach="material" />
        </mesh>
        {/* Surrounding Curb */}
        <mesh position={[0, 0.15, 4.05]}>
          <boxGeometry args={[14.2, 0.25, 0.25]} />
          <primitive object={curbMaterial} attach="material" />
        </mesh>
        <mesh position={[7.05, 0.15, 0]}>
          <boxGeometry args={[0.25, 0.25, 8.2]} />
          <primitive object={curbMaterial} attach="material" />
        </mesh>
      </group>

      {/* Right Garden Lawn Bed */}
      <group position={[25, 0, 22]}>
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[14, 8]} />
          <primitive object={grassMaterial} attach="material" />
        </mesh>
        {/* Surrounding Curb */}
        <mesh position={[0, 0.15, 4.05]}>
          <boxGeometry args={[14.2, 0.25, 0.25]} />
          <primitive object={curbMaterial} attach="material" />
        </mesh>
        <mesh position={[-7.05, 0.15, 0]}>
          <boxGeometry args={[0.25, 0.25, 8.2]} />
          <primitive object={curbMaterial} attach="material" />
        </mesh>
      </group>

      {/* Decorative Campus Trees Flanking the Entrance */}
      <CampusTree x={-27} z={20} />
      <CampusTree x={-22} z={24} />
      <CampusTree x={-18} z={19} />
      <CampusTree x={19} z={19} />
      <CampusTree x={23} z={24} />
      <CampusTree x={28} z={20} />

      {/* Low Foundation Shrubs along Building Front */}
      {[-16, -13, -7, 7, 10, 14, 18].map((sx, idx) => (
        <mesh key={`shrub-${idx}`} position={[sx, 0.35, 17.6]} castShadow>
          <sphereGeometry args={[0.45, 12, 10]} />
          <primitive object={foliageMaterial} attach="material" />
        </mesh>
      ))}

      {/* ========================================================================= */}
      {/* 4. CAMPUS FLAGPOLE (Near Front Entrance Plaza)                            */}
      {/* ========================================================================= */}
      <group position={[6.5, 0, 22]}>
        {/* Tiered Octagonal Base */}
        <mesh position={[0, 0.2, 0]} receiveShadow>
          <cylinderGeometry args={[0.8, 1.0, 0.4, 8]} />
          <primitive object={curbMaterial} attach="material" />
        </mesh>
        {/* Tall Stainless Steel Pole */}
        <mesh position={[0, 4.5, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.09, 8.6, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Golden Finial Top Ball */}
        <mesh position={[0, 8.85, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}
