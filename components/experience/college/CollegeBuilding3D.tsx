"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { CollegeLogoSign } from "./CollegeLogoSign";

interface CollegeBuilding3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export function CollegeBuilding3D({
  position = [0, 0, 16],
  rotation = [0, 0, 0],
}: CollegeBuilding3DProps) {
  // Reusable Architectural Materials
  const blueWallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0298d7", // Signature vibrant Itahari Namuna College sky blue
        roughness: 0.52,
        metalness: 0.05,
      }),
    []
  );

  const darkBlueMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0172a3",
        roughness: 0.6,
        metalness: 0.08,
      }),
    []
  );

  const yellowTrimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f5b800", // Signature architectural golden/yellow trim
        roughness: 0.38,
        metalness: 0.15,
      }),
    []
  );

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0f2338", // Reflective dark tinted blue glass
        roughness: 0.12,
        metalness: 0.88,
      }),
    []
  );

  const windowFrameMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#015a84",
        roughness: 0.45,
        metalness: 0.2,
      }),
    []
  );

  const pitchedRoofMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#15438d", // Signature deep blue metal gabled roof
        roughness: 0.35,
        metalness: 0.3,
      }),
    []
  );

  const acWhiteMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#eaecf0",
        roughness: 0.4,
        metalness: 0.2,
      }),
    []
  );

  const acGrilleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1e293b",
        roughness: 0.7,
      }),
    []
  );

  const concreteMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#cbd5e1",
        roughness: 0.85,
      }),
    []
  );

  // Helper component to render a realistic recessed window unit
  const RecessedWindow = ({
    x,
    y,
    width = 2.0,
    height = 1.6,
    panes = 2,
  }: {
    x: number;
    y: number;
    width?: number;
    height?: number;
    panes?: number;
  }) => (
    <group position={[x, y, 0.05]}>
      {/* Outer Window Frame */}
      <mesh castShadow>
        <boxGeometry args={[width + 0.12, height + 0.12, 0.14]} />
        <primitive object={windowFrameMaterial} attach="material" />
      </mesh>
      {/* Recessed Glass Pane */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[width, height]} />
        <primitive object={glassMaterial} attach="material" />
      </mesh>
      {/* Mullions / Dividers */}
      {panes > 1 &&
        Array.from({ length: panes - 1 }).map((_, i) => {
          const divX = -width / 2 + (width / panes) * (i + 1);
          return (
            <mesh key={i} position={[divX, 0, 0.04]}>
              <boxGeometry args={[0.06, height, 0.06]} />
              <primitive object={windowFrameMaterial} attach="material" />
            </mesh>
          );
        })}
      {/* Horizontal Transom Bar */}
      <mesh position={[0, height * 0.22, 0.04]}>
        <boxGeometry args={[width, 0.05, 0.06]} />
        <primitive object={windowFrameMaterial} attach="material" />
      </mesh>
    </group>
  );

  // Helper component to render an exterior AC compressor unit
  const ACUnit = ({ x, y }: { x: number; y: number }) => (
    <group position={[x, y, 0.45]}>
      {/* Compressor Box */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.6, 0.45]} />
        <primitive object={acWhiteMaterial} attach="material" />
      </mesh>
      {/* Fan Grille Disc */}
      <mesh position={[0.15, 0, 0.23]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.02, 24]} />
        <primitive object={acGrilleMaterial} attach="material" />
      </mesh>
      {/* Wall Mounting Brackets */}
      <mesh position={[-0.32, -0.32, -0.1]}>
        <boxGeometry args={[0.06, 0.15, 0.28]} />
        <primitive object={darkBlueMaterial} attach="material" />
      </mesh>
      <mesh position={[0.32, -0.32, -0.1]}>
        <boxGeometry args={[0.06, 0.15, 0.28]} />
        <primitive object={darkBlueMaterial} attach="material" />
      </mesh>
    </group>
  );

  return (
    <group position={position} rotation={rotation}>
      {/* ========================================================================= */}
      {/* 1. LEFT MAIN WING (x: -19 to -3.8, width: 15.2, height: 15.2)              */}
      {/* ========================================================================= */}
      <group position={[-11.4, 7.6, 0]}>
        {/* Main Solid Blue Wall with Physical Depth */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[15.2, 15.2, 1.2]} />
          <primitive object={blueWallMaterial} attach="material" />
        </mesh>

        {/* Floor Dividing Yellow Horizontal Bands */}
        {[-3.8, 0, 3.8].map((y, idx) => (
          <mesh key={`left-band-${idx}`} position={[0, y, 0.62]} castShadow>
            <boxGeometry args={[15.24, 0.22, 0.1]} />
            <primitive object={yellowTrimMaterial} attach="material" />
          </mesh>
        ))}

        {/* Left Roof Parapet Trim */}
        <mesh position={[0, 7.6 + 0.15, 0.1]} castShadow>
          <boxGeometry args={[15.3, 0.35, 1.4]} />
          <primitive object={yellowTrimMaterial} attach="material" />
        </mesh>
      </group>

      {/* LEFT WING WINDOWS & FAÇADE DETAILS */}
      {/* Ground Floor Windows & Notice Board */}
      <RecessedWindow x={-16.5} y={1.9} width={1.9} height={1.5} panes={2} />
      <RecessedWindow x={-13.8} y={1.9} width={1.9} height={1.5} panes={2} />
      {/* Official Campus Notice / Bulletin Board */}
      <group position={[-8.5, 1.9, 0.66]}>
        <mesh castShadow>
          <boxGeometry args={[4.2, 1.9, 0.08]} />
          <meshStandardMaterial color="#8b1e1e" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[4.0, 1.7]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.6} />
        </mesh>
        <Text position={[0, 0.45, 0.06]} fontSize={0.16} color="#1e293b" anchorX="center">
          ITAHARI NAMUNA NOTICE BOARD
        </Text>
        <Text position={[0, 0.05, 0.06]} fontSize={0.12} color="#0369a1" anchorX="center">
          Department of Computer Applications • BCA
        </Text>
        <Text position={[0, -0.35, 0.06]} fontSize={0.09} color="#475569" anchorX="center">
          Congratulations BCA Graduating Batch 2021-2024!
        </Text>
      </group>

      {/* 1st Floor Windows (Y ~ 5.7) */}
      <RecessedWindow x={-16.8} y={5.7} width={1.8} height={1.5} panes={2} />
      <RecessedWindow x={-13.8} y={5.7} width={1.8} height={1.5} panes={2} />
      <RecessedWindow x={-10.8} y={5.7} width={1.8} height={1.5} panes={2} />
      <RecessedWindow x={-7.8} y={5.7} width={1.8} height={1.5} panes={2} />
      <RecessedWindow x={-4.8} y={5.7} width={1.8} height={1.5} panes={2} />

      {/* 2nd Floor Windows (Y ~ 9.5) */}
      <RecessedWindow x={-16.8} y={9.5} width={1.8} height={1.5} panes={2} />
      <RecessedWindow x={-13.8} y={9.5} width={1.8} height={1.5} panes={2} />
      <RecessedWindow x={-10.8} y={9.5} width={1.8} height={1.5} panes={2} />
      <RecessedWindow x={-7.8} y={9.5} width={1.8} height={1.5} panes={2} />
      <RecessedWindow x={-4.8} y={9.5} width={1.8} height={1.5} panes={2} />

      {/* 3rd Floor (Top Floor): Continuous Panoramic Ribbon Windows */}
      <group position={[-11.2, 13.3, 0.65]}>
        {/* Ribbon Window Outer Bezel */}
        <mesh castShadow>
          <boxGeometry args={[14.6, 2.1, 0.12]} />
          <primitive object={windowFrameMaterial} attach="material" />
        </mesh>
        {/* Long Glass Strip */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[14.4, 1.95]} />
          <primitive object={glassMaterial} attach="material" />
        </mesh>
        {/* Vertical Mullions array */}
        {Array.from({ length: 9 }).map((_, i) => (
          <mesh key={`mullion-${i}`} position={[-6.5 + i * 1.45, 0, 0.04]}>
            <boxGeometry args={[0.08, 1.95, 0.06]} />
            <primitive object={windowFrameMaterial} attach="material" />
          </mesh>
        ))}
      </group>

      {/* Far Left Balcony / Safety Railing (visible on left edge of reference) */}
      <group position={[-19.2, 13.3, 0.8]}>
        <mesh position={[0, 0.9, 0]}>
          <boxGeometry args={[0.8, 0.06, 0.06]} />
          <primitive object={concreteMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 0.06, 0.06]} />
          <primitive object={concreteMaterial} attach="material" />
        </mesh>
        {[-0.3, 0, 0.3].map((rx, idx) => (
          <mesh key={idx} position={[rx, 0.45, 0]}>
            <boxGeometry args={[0.04, 0.9, 0.04]} />
            <primitive object={concreteMaterial} attach="material" />
          </mesh>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* 2. CENTRAL ENTRANCE SECTION (x: -3.8 to +3.8, width: 7.6, height: 16.5)    */}
      {/* ========================================================================= */}
      <group position={[0, 8.25, 0.6]}>
        {/* Main Projecting Tower Body (projects forward by +1.2 relative to wings) */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[7.6, 16.5, 1.6]} />
          <primitive object={blueWallMaterial} attach="material" />
        </mesh>

        {/* Flanking Vertical Golden Architectural Piers */}
        <mesh position={[-3.8, 0, 0.85]} castShadow>
          <boxGeometry args={[0.45, 16.5, 0.25]} />
          <primitive object={yellowTrimMaterial} attach="material" />
        </mesh>
        <mesh position={[3.8, 0, 0.85]} castShadow>
          <boxGeometry args={[0.45, 16.5, 0.25]} />
          <primitive object={yellowTrimMaterial} attach="material" />
        </mesh>

        {/* Central Floor Horizontal Golden Dividers */}
        {[-4.4, -0.6, 3.2].map((y, idx) => (
          <mesh key={`center-div-${idx}`} position={[0, y, 0.85]} castShadow>
            <boxGeometry args={[7.65, 0.24, 0.22]} />
            <primitive object={yellowTrimMaterial} attach="material" />
          </mesh>
        ))}

        {/* Central Reflective Glass Curtain Facade (Floors 1, 2, 3) */}
        <mesh position={[0, 1.3, 0.84]} receiveShadow>
          <planeGeometry args={[6.8, 11.2]} />
          <primitive object={glassMaterial} attach="material" />
        </mesh>
        {/* Glass Facade Grid Gridlines */}
        {[-2.2, 0, 2.2].map((gx, idx) => (
          <mesh key={`grid-v-${idx}`} position={[gx, 1.3, 0.86]}>
            <boxGeometry args={[0.06, 11.2, 0.04]} />
            <primitive object={yellowTrimMaterial} attach="material" />
          </mesh>
        ))}
        {[-2.5, 1.3, 5.1].map((gy, idx) => (
          <mesh key={`grid-h-${idx}`} position={[0, gy, 0.86]}>
            <boxGeometry args={[6.8, 0.06, 0.04]} />
            <primitive object={yellowTrimMaterial} attach="material" />
          </mesh>
        ))}

        {/* TOP YELLOW HEADER SIGNBOARD BOX */}
        <group position={[0, 7.8, 0.85]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[7.8, 1.25, 0.35]} />
            <primitive object={yellowTrimMaterial} attach="material" />
          </mesh>
          {/* Main Institution Title Text */}
          <Text
            position={[0, 0.06, 0.2]}
            fontSize={0.42}
            color="#0f2342"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.04}
          >
            Itahari Namuna College
          </Text>
        </group>
      </group>

      {/* OFFICIAL COLLEGE LOGO EMBLEM SIGN (Prominently mounted on central facade) */}
      <CollegeLogoSign position={[0, 5.4, 1.48]} scale={1.05} />

      {/* GROUND-LEVEL MAIN ENTRANCE PORCH & PILLARS */}
      {/* Left Blue Pillar */}
      <mesh position={[-2.4, 1.9, 1.8]} castShadow>
        <cylinderGeometry args={[0.26, 0.26, 3.8, 24]} />
        <primitive object={blueWallMaterial} attach="material" />
      </mesh>
      {/* Right Blue Pillar */}
      <mesh position={[2.4, 1.9, 1.8]} castShadow>
        <cylinderGeometry args={[0.26, 0.26, 3.8, 24]} />
        <primitive object={blueWallMaterial} attach="material" />
      </mesh>
      {/* Pillar Bases & Capitals */}
      {[-2.4, 2.4].map((px, idx) => (
        <group key={`pillar-acc-${idx}`}>
          <mesh position={[px, 0.1, 1.8]}>
            <boxGeometry args={[0.65, 0.2, 0.65]} />
            <primitive object={concreteMaterial} attach="material" />
          </mesh>
          <mesh position={[px, 3.7, 1.8]}>
            <boxGeometry args={[0.65, 0.2, 0.65]} />
            <primitive object={yellowTrimMaterial} attach="material" />
          </mesh>
        </group>
      ))}

      {/* ENTRANCE PORCH CANTILEVER OVERHANG */}
      <mesh position={[0, 3.85, 1.4]} castShadow receiveShadow>
        <boxGeometry args={[6.6, 0.3, 2.0]} />
        <primitive object={yellowTrimMaterial} attach="material" />
      </mesh>

      {/* OPEN ENTRANCE BREEZEWAY (Allows camera to fly smoothly inside!) */}
      <group position={[0, 1.9, 0.6]}>
        {/* Entrance Portal Frame */}
        <mesh position={[0, 1.7, 0]} castShadow>
          <boxGeometry args={[4.2, 0.4, 0.6]} />
          <primitive object={yellowTrimMaterial} attach="material" />
        </mesh>
        <mesh position={[-2.0, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 3.8, 0.6]} />
          <primitive object={yellowTrimMaterial} attach="material" />
        </mesh>
        <mesh position={[2.0, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 3.8, 0.6]} />
          <primitive object={yellowTrimMaterial} attach="material" />
        </mesh>
        {/* Double Glass Doors (Ajar, welcoming the camera inside) */}
        <mesh position={[-1.0, 0, 0.1]} rotation={[0, -0.6, 0]}>
          <boxGeometry args={[1.6, 3.2, 0.06]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.6} />
        </mesh>
        <mesh position={[1.0, 0, 0.1]} rotation={[0, 0.6, 0]}>
          <boxGeometry args={[1.6, 3.2, 0.06]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.6} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 3. RIGHT WING & DISTINCTIVE GABLED ROOF (x: +3.8 to +21, width: 17.2)     */}
      {/* ========================================================================= */}
      <group position={[12.4, 7.6, 0]}>
        {/* Main Solid Blue Right Wall */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[17.2, 15.2, 1.2]} />
          <primitive object={blueWallMaterial} attach="material" />
        </mesh>

        {/* Floor Dividing Yellow Horizontal Bands */}
        {[-3.8, 0, 3.8].map((y, idx) => (
          <mesh key={`right-band-${idx}`} position={[0, y, 0.62]} castShadow>
            <boxGeometry args={[17.24, 0.22, 0.1]} />
            <primitive object={yellowTrimMaterial} attach="material" />
          </mesh>
        ))}

        {/* Parapet Under Gabled Roof */}
        <mesh position={[0, 7.6 + 0.15, 0.1]} castShadow>
          <boxGeometry args={[17.3, 0.35, 1.4]} />
          <primitive object={yellowTrimMaterial} attach="material" />
        </mesh>

        {/* DISTINCTIVE BLUE PITCHED/GABLED METAL ROOF (as seen in reference) */}
        <group position={[0, 8.8, 0]}>
          {/* Front Sloped Roof Plane */}
          <mesh position={[0, 0.5, 0.5]} rotation={[0.42, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[17.6, 2.6, 0.12]} />
            <primitive object={pitchedRoofMaterial} attach="material" />
          </mesh>
          {/* Back Sloped Roof Plane */}
          <mesh position={[0, 0.5, -0.5]} rotation={[-0.42, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[17.6, 2.6, 0.12]} />
            <primitive object={pitchedRoofMaterial} attach="material" />
          </mesh>
          {/* White Eaves Gutter Along Roof Edge */}
          <mesh position={[0, -0.4, 1.3]}>
            <boxGeometry args={[17.8, 0.15, 0.15]} />
            <primitive object={concreteMaterial} attach="material" />
          </mesh>
        </group>
      </group>

      {/* RIGHT WING WINDOWS (Corner arrangement & classroom rows) */}
      {/* Ground Floor Windows */}
      <RecessedWindow x={5.8} y={1.9} width={1.8} height={1.5} panes={2} />
      <RecessedWindow x={8.6} y={1.9} width={1.8} height={1.5} panes={2} />
      <RecessedWindow x={11.4} y={1.9} width={1.8} height={1.5} panes={2} />
      <RecessedWindow x={14.6} y={1.9} width={2.2} height={1.5} panes={3} />
      <RecessedWindow x={17.8} y={1.9} width={2.2} height={1.5} panes={3} />

      {/* 1st Floor Windows */}
      <RecessedWindow x={5.8} y={5.7} width={1.8} height={1.5} panes={2} />
      <RecessedWindow x={8.6} y={5.7} width={1.8} height={1.5} panes={2} />
      <RecessedWindow x={11.4} y={5.7} width={1.8} height={1.5} panes={2} />
      <RecessedWindow x={14.6} y={5.7} width={2.2} height={1.5} panes={3} />
      <RecessedWindow x={17.8} y={5.7} width={2.2} height={1.5} panes={3} />

      {/* 2nd Floor Windows */}
      <RecessedWindow x={5.8} y={9.5} width={1.8} height={1.5} panes={2} />
      <RecessedWindow x={8.6} y={9.5} width={1.8} height={1.5} panes={2} />
      <RecessedWindow x={11.4} y={9.5} width={1.8} height={1.5} panes={2} />
      <RecessedWindow x={14.6} y={9.5} width={2.2} height={1.5} panes={3} />
      <RecessedWindow x={17.8} y={9.5} width={2.2} height={1.5} panes={3} />

      {/* 3rd Floor Windows (Under Pitched Roof) */}
      <RecessedWindow x={5.8} y={13.3} width={1.8} height={1.5} panes={2} />
      <RecessedWindow x={8.6} y={13.3} width={1.8} height={1.5} panes={2} />
      <RecessedWindow x={11.4} y={13.3} width={1.8} height={1.5} panes={2} />
      <RecessedWindow x={14.6} y={13.3} width={2.2} height={1.5} panes={3} />
      <RecessedWindow x={17.8} y={13.3} width={2.2} height={1.5} panes={3} />

      {/* EXTERIOR AIR CONDITIONING UNITS (As shown on the real facade) */}
      <ACUnit x={7.2} y={4.7} />
      <ACUnit x={13.0} y={4.7} />
      <ACUnit x={16.2} y={4.7} />
      <ACUnit x={7.2} y={8.5} />
      <ACUnit x={13.0} y={8.5} />
      <ACUnit x={-5.8} y={4.7} />
      <ACUnit x={-12.2} y={4.7} />
      <ACUnit x={-5.8} y={8.5} />

      {/* ========================================================================= */}
      {/* 4. GROUND-LEVEL ENTRANCE STEPS & FOUNDATION PLINTH                        */}
      {/* ========================================================================= */}
      <group position={[0, -0.2, 1.8]}>
        {/* Broad Stone Entrance Plinth */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[44, 0.4, 4.0]} />
          <primitive object={concreteMaterial} attach="material" />
        </mesh>
        {/* Entrance Terraced Steps */}
        <mesh position={[0, 0.1, 1.6]} receiveShadow>
          <boxGeometry args={[9.5, 0.2, 1.2]} />
          <primitive object={concreteMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 0.2, 0.9]} receiveShadow>
          <boxGeometry args={[8.5, 0.2, 1.0]} />
          <primitive object={concreteMaterial} attach="material" />
        </mesh>
      </group>
    </group>
  );
}
