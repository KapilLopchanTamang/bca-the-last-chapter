"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { TimelineController } from "@/lib/timeline-controller";

interface ClassroomDoorProps {
  doorAngle: number; // in radians, 0 to 1.55
}

export function ClassroomDoor({ doorAngle }: ClassroomDoorProps) {
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);

  // Smooth lerp for door rotation
  useFrame((_, delta) => {
    const liveAngle = TimelineController.getInstance().getLiveState().doorAngle;
    if (leftDoorRef.current) {
      if (liveAngle === 0 && Math.abs(leftDoorRef.current.rotation.y) < 0.004) {
        leftDoorRef.current.rotation.y = 0;
      } else {
        leftDoorRef.current.rotation.y = THREE.MathUtils.damp(
          leftDoorRef.current.rotation.y,
          liveAngle,
          8.5,
          delta
        );
      }
    }
    if (rightDoorRef.current) {
      if (liveAngle === 0 && Math.abs(rightDoorRef.current.rotation.y) < 0.004) {
        rightDoorRef.current.rotation.y = 0;
      } else {
        rightDoorRef.current.rotation.y = THREE.MathUtils.damp(
          rightDoorRef.current.rotation.y,
          -liveAngle,
          8.5,
          delta
        );
      }
    }
  });

  const doorWidth = 1.35;
  const doorHeight = 4.2;
  const doorThickness = 0.12;

  // Materials
  const woodMaterial = (
    <meshStandardMaterial
      color="#3a2213"
      roughness={0.42}
      metalness={0.08}
    />
  );
  const frameMaterial = (
    <meshStandardMaterial
      color="#26160b"
      roughness={0.5}
      metalness={0.05}
    />
  );
  const brassMaterial = (
    <meshStandardMaterial
      color="#d4af37"
      roughness={0.25}
      metalness={0.88}
    />
  );
  const darkGlassMaterial = (
    <meshPhysicalMaterial
      color="#231910"
      roughness={0.15}
      transmission={0.4}
      thickness={0.2}
      transparent
      opacity={0.85}
    />
  );

  return (
    <group position={[0, 0, 0]}>
      {/* DOORWAY FRAME */}
      {/* Top Header */}
      <mesh position={[0, doorHeight / 2 + 0.15, 0]}>
        <boxGeometry args={[doorWidth * 2 + 0.5, 0.3, 0.3]} />
        {frameMaterial}
      </mesh>
      {/* Left Wall Frame Post */}
      <mesh position={[-doorWidth - 0.15, 0, 0]}>
        <boxGeometry args={[0.3, doorHeight, 0.3]} />
        {frameMaterial}
      </mesh>
      {/* Right Wall Frame Post */}
      <mesh position={[doorWidth + 0.15, 0, 0]}>
        <boxGeometry args={[0.3, doorHeight, 0.3]} />
        {frameMaterial}
      </mesh>

      {/* CLASSROOM PLAQUE ABOVE DOOR */}
      <group position={[0, doorHeight / 2 + 0.45, 0.08]}>
        <mesh>
          <boxGeometry args={[1.8, 0.32, 0.04]} />
          {brassMaterial}
        </mesh>
        <Text
          position={[0, 0.04, 0.03]}
          fontSize={0.09}
          color="#1e1308"
          anchorX="center"
          anchorY="middle"
        >
          ROOM 404 • BCA BATCH
        </Text>
        <Text
          position={[0, -0.06, 0.03]}
          fontSize={0.055}
          color="#332211"
          anchorX="center"
          anchorY="middle"
        >
          THE LAST CHAPTER
        </Text>
      </group>

      {/* WALLS AROUND DOORWAY */}
      {/* Left Wall */}
      <mesh position={[-3.2, 0, 0]}>
        <boxGeometry args={[3.4, doorHeight + 2, 0.28]} />
        <meshStandardMaterial color="#1a1c22" roughness={0.85} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[3.2, 0, 0]}>
        <boxGeometry args={[3.4, doorHeight + 2, 0.28]} />
        <meshStandardMaterial color="#1a1c22" roughness={0.85} />
      </mesh>
      {/* Top Header Wall */}
      <mesh position={[0, doorHeight / 2 + 1.25, 0]}>
        <boxGeometry args={[doorWidth * 2 + 0.5, 1.9, 0.28]} />
        <meshStandardMaterial color="#1a1c22" roughness={0.85} />
      </mesh>

      {/* LEFT DOOR (Pivot at x = -doorWidth) */}
      <group position={[-doorWidth, 0, 0]} ref={leftDoorRef}>
        <group position={[doorWidth / 2, 0, 0]}>
          {/* Main Leaf Body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[doorWidth, doorHeight, doorThickness]} />
            {woodMaterial}
          </mesh>

          {/* Top Panel Glass / Frosted Window */}
          <mesh position={[0, 0.95, 0.01]}>
            <boxGeometry args={[doorWidth * 0.72, 1.4, 0.04]} />
            {darkGlassMaterial}
          </mesh>

          {/* Upper Panel Inset Molding */}
          <mesh position={[0, 0.95, 0]}>
            <boxGeometry args={[doorWidth * 0.8, 1.5, doorThickness + 0.02]} />
            {frameMaterial}
          </mesh>

          {/* Lower Panel Inset Wood */}
          <mesh position={[0, -0.95, 0.02]}>
            <boxGeometry args={[doorWidth * 0.75, 1.4, 0.05]} />
            {woodMaterial}
          </mesh>
          <mesh position={[0, -0.95, 0]}>
            <boxGeometry args={[doorWidth * 0.82, 1.52, doorThickness + 0.02]} />
            {frameMaterial}
          </mesh>

          {/* Brass Door Handle & Plate (Near right edge of left door leaf) */}
          <group position={[doorWidth / 2 - 0.12, 0, doorThickness / 2 + 0.02]}>
            {/* Backplate */}
            <mesh>
              <boxGeometry args={[0.07, 0.45, 0.02]} />
              {brassMaterial}
            </mesh>
            {/* Handle Lever */}
            <mesh position={[-0.08, 0.08, 0.06]} rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.18, 16]} />
              {brassMaterial}
            </mesh>
            {/* Keyhole */}
            <mesh position={[0, -0.1, 0.012]}>
              <cylinderGeometry args={[0.012, 0.012, 0.01, 12]} />
              <meshStandardMaterial color="#0c0702" />
            </mesh>
          </group>
        </group>
      </group>

      {/* RIGHT DOOR (Pivot at x = doorWidth) */}
      <group position={[doorWidth, 0, 0]} ref={rightDoorRef}>
        <group position={[-doorWidth / 2, 0, 0]}>
          {/* Main Leaf Body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[doorWidth, doorHeight, doorThickness]} />
            {woodMaterial}
          </mesh>

          {/* Top Panel Glass / Frosted Window */}
          <mesh position={[0, 0.95, 0.01]}>
            <boxGeometry args={[doorWidth * 0.72, 1.4, 0.04]} />
            {darkGlassMaterial}
          </mesh>

          {/* Upper Panel Inset Molding */}
          <mesh position={[0, 0.95, 0]}>
            <boxGeometry args={[doorWidth * 0.8, 1.5, doorThickness + 0.02]} />
            {frameMaterial}
          </mesh>

          {/* Lower Panel Inset Wood */}
          <mesh position={[0, -0.95, 0.02]}>
            <boxGeometry args={[doorWidth * 0.75, 1.4, 0.05]} />
            {woodMaterial}
          </mesh>
          <mesh position={[0, -0.95, 0]}>
            <boxGeometry args={[doorWidth * 0.82, 1.52, doorThickness + 0.02]} />
            {frameMaterial}
          </mesh>

          {/* Brass Door Handle & Plate (Near left edge of right door leaf) */}
          <group position={[-doorWidth / 2 + 0.12, 0, doorThickness / 2 + 0.02]}>
            {/* Backplate */}
            <mesh>
              <boxGeometry args={[0.07, 0.45, 0.02]} />
              {brassMaterial}
            </mesh>
            {/* Handle Lever */}
            <mesh position={[0.08, 0.08, 0.06]} rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.18, 16]} />
              {brassMaterial}
            </mesh>
            {/* Keyhole */}
            <mesh position={[0, -0.1, 0.012]}>
              <cylinderGeometry args={[0.012, 0.012, 0.01, 12]} />
              <meshStandardMaterial color="#0c0702" />
            </mesh>
          </group>
        </group>
      </group>

      {/* FLOOR THRESHOLD / SILL */}
      <mesh position={[0, -doorHeight / 2 - 0.04, 0]}>
        <boxGeometry args={[doorWidth * 2 + 0.6, 0.08, 0.5]} />
        {brassMaterial}
      </mesh>

      {/* LIGHT LEAK THROUGH BOTTOM CRACK WHEN CLOSED */}
      <pointLight
        position={[0, -doorHeight / 2 + 0.05, -0.2]}
        color="#fbe5b8"
        intensity={doorAngle > 0.05 ? 0 : 0.8}
        distance={2}
      />
    </group>
  );
}
