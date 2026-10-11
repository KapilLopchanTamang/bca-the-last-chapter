"use client";

import React from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";

export function ClassroomInterior() {
  const roomDepth = 26;
  const roomWidth = 14;
  const roomHeight = 6.2;
  const floorY = -2.14;

  return (
    <group position={[0, 0, -roomDepth / 2]}>
      {/* CLASSROOM FLOOR */}
      <mesh
        position={[0, floorY, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial
          color="#382619"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* CEILING */}
      <mesh
        position={[0, floorY + roomHeight, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial color="#1a1c24" roughness={0.9} />
      </mesh>

      {/* BACK WALL */}
      <mesh position={[0, floorY + roomHeight / 2, -roomDepth / 2]}>
        <planeGeometry args={[roomWidth, roomHeight]} />
        <meshStandardMaterial color="#1e222d" roughness={0.8} />
      </mesh>

      {/* CHALKBOARD / BLACKBOARD ON BACK WALL */}
      <group position={[0, floorY + 3.1, -roomDepth / 2 + 0.08]}>
        {/* Frame */}
        <mesh>
          <boxGeometry args={[7.2, 3.2, 0.08]} />
          <meshStandardMaterial color="#4a2f1b" roughness={0.4} />
        </mesh>
        {/* Board Surface */}
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[6.8, 2.8]} />
          <meshStandardMaterial color="#192821" roughness={0.9} />
        </mesh>
        {/* Chalk Writing Text */}
        <Text
          position={[0, 0.8, 0.06]}
          fontSize={0.28}
          color="#f4eee1"
          anchorX="center"
          anchorY="middle"
        >
          BCA BATCH 2021 — 2024
        </Text>
        <Text
          position={[0, 0.25, 0.06]}
          fontSize={0.15}
          color="#e0d6c3"
          anchorX="center"
          anchorY="middle"
        >
          &quot;Badal Sari — Like clouds we drift, but memories stay.&quot;
        </Text>
        <Text
          position={[0, -0.3, 0.06]}
          fontSize={0.12}
          color="#b5aa96"
          anchorX="center"
          anchorY="middle"
        >
          while(alive) &#123; cherishMemories(); &#125;
        </Text>
      </group>

      {/* LEFT WALL WITH SUNLIT WINDOWS */}
      <mesh
        position={[-roomWidth / 2, floorY + roomHeight / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[roomDepth, roomHeight]} />
        <meshStandardMaterial color="#1b1e28" roughness={0.85} />
      </mesh>

      {/* TALL CLASSROOM WINDOW FRAMES (LEFT SIDE) */}
      {[-8, -2, 4].map((zPos, idx) => (
        <group key={`window-${idx}`} position={[-roomWidth / 2 + 0.06, floorY + 3.2, zPos]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[2.8, 3.8, 0.08]} />
            <meshStandardMaterial color="#302014" roughness={0.4} />
          </mesh>
          {/* Warm Window Light Panel */}
          <mesh
            position={[0.02, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <planeGeometry args={[2.5, 3.5]} />
            <meshBasicMaterial color="#ffeacc" />
          </mesh>
          {/* Subtle Golden Spot Light From Window */}
          <pointLight
            position={[0.5, 0, 0]}
            color="#ffd280"
            intensity={1.2}
            distance={9}
          />
        </group>
      ))}

      {/* RIGHT WALL */}
      <mesh
        position={[roomWidth / 2, floorY + roomHeight / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <planeGeometry args={[roomDepth, roomHeight]} />
        <meshStandardMaterial color="#1b1e28" roughness={0.85} />
      </mesh>

      {/* VINTAGE WARM CEILING LAMPS */}
      {[-9, -3, 3, 9].map((zPos, idx) => (
        <group key={`lamp-${idx}`} position={[0, floorY + roomHeight - 0.7, zPos]}>
          {/* Cord */}
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          {/* Shade */}
          <mesh>
            <coneGeometry args={[0.45, 0.3, 16, 1, true]} />
            <meshStandardMaterial color="#c68a4c" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Glowing Bulb */}
          <mesh position={[0, -0.06, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="#fff0d0" />
          </mesh>
          {/* Light source */}
          <pointLight
            position={[0, -0.2, 0]}
            color="#ffc870"
            intensity={1.1}
            distance={8}
          />
        </group>
      ))}

      {/* CLASSROOM DESKS & BENCHES (Arranged neatly on sides) */}
      {[-7, -3, 1, 5].map((z, rowIdx) => (
        <React.Fragment key={`desk-row-${rowIdx}`}>
          {/* Left row desk */}
          <group position={[-4.2, floorY + 0.65, z]}>
            <mesh>
              <boxGeometry args={[2.2, 0.06, 1.1]} />
              <meshStandardMaterial color="#4d3320" roughness={0.4} />
            </mesh>
            {/* Legs */}
            <mesh position={[-0.95, -0.32, 0.45]}>
              <cylinderGeometry args={[0.02, 0.02, 0.64, 8]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
            </mesh>
            <mesh position={[0.95, -0.32, 0.45]}>
              <cylinderGeometry args={[0.02, 0.02, 0.64, 8]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
            </mesh>
            <mesh position={[-0.95, -0.32, -0.45]}>
              <cylinderGeometry args={[0.02, 0.02, 0.64, 8]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
            </mesh>
            <mesh position={[0.95, -0.32, -0.45]}>
              <cylinderGeometry args={[0.02, 0.02, 0.64, 8]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
            </mesh>
          </group>

          {/* Right row desk */}
          <group position={[4.2, floorY + 0.65, z]}>
            <mesh>
              <boxGeometry args={[2.2, 0.06, 1.1]} />
              <meshStandardMaterial color="#4d3320" roughness={0.4} />
            </mesh>
            {/* Legs */}
            <mesh position={[-0.95, -0.32, 0.45]}>
              <cylinderGeometry args={[0.02, 0.02, 0.64, 8]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
            </mesh>
            <mesh position={[0.95, -0.32, 0.45]}>
              <cylinderGeometry args={[0.02, 0.02, 0.64, 8]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
            </mesh>
            <mesh position={[-0.95, -0.32, -0.45]}>
              <cylinderGeometry args={[0.02, 0.02, 0.64, 8]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
            </mesh>
            <mesh position={[0.95, -0.32, -0.45]}>
              <cylinderGeometry args={[0.02, 0.02, 0.64, 8]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
            </mesh>
          </group>
        </React.Fragment>
      ))}

      {/* CENTRAL AMBER LIGHT STREAM TOWARDS ENTRANCE */}
      <spotLight
        position={[0, 4.2, -8]}
        target-position={[0, 0, 5]}
        color="#fbe4b2"
        intensity={2.8}
        angle={Math.PI / 4}
        penumbra={0.7}
        distance={22}
      />
    </group>
  );
}
