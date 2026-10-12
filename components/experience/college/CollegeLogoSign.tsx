"use client";

import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { textureCache } from "@/lib/texture-cache";

interface CollegeLogoSignProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export function CollegeLogoSign({
  position = [0, 5.4, 0.65],
  rotation = [0, 0, 0],
  scale = 1,
}: CollegeLogoSignProps) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let isMounted = true;
    const url = "/college/logo.jpg";
    const cached = textureCache.getTexture(url, (tex) => {
      if (isMounted) {
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        setTexture(tex);
      }
    });
    if (cached) {
      cached.generateMipmaps = true;
      cached.minFilter = THREE.LinearMipmapLinearFilter;
      setTexture(cached);
    }
    return () => {
      isMounted = false;
    };
  }, []);

  // 600x300 aspect ratio = 2:1
  const signWidth = 2.8;
  const signHeight = 1.4;
  const signDepth = 0.08;
  const borderThickness = 0.06;

  const brassMaterial = (
    <meshStandardMaterial
      color="#d4af37"
      roughness={0.28}
      metalness={0.85}
    />
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* SOLID MOUNTING BACKPLATE */}
      <mesh position={[0, 0, -signDepth / 2]} castShadow receiveShadow>
        <boxGeometry args={[signWidth + borderThickness * 2, signHeight + borderThickness * 2, signDepth]} />
        {brassMaterial}
      </mesh>

      {/* EMBOSSED GOLDEN BEVEL TRIM */}
      {/* Top Border */}
      <mesh position={[0, signHeight / 2 + borderThickness / 2, 0.01]} castShadow>
        <boxGeometry args={[signWidth + borderThickness * 2 + 0.04, borderThickness, signDepth + 0.02]} />
        {brassMaterial}
      </mesh>
      {/* Bottom Border */}
      <mesh position={[0, -signHeight / 2 - borderThickness / 2, 0.01]} castShadow>
        <boxGeometry args={[signWidth + borderThickness * 2 + 0.04, borderThickness, signDepth + 0.02]} />
        {brassMaterial}
      </mesh>
      {/* Left Border */}
      <mesh position={[-signWidth / 2 - borderThickness / 2, 0, 0.01]} castShadow>
        <boxGeometry args={[borderThickness, signHeight, signDepth + 0.02]} />
        {brassMaterial}
      </mesh>
      {/* Right Border */}
      <mesh position={[signWidth / 2 + borderThickness / 2, 0, 0.01]} castShadow>
        <boxGeometry args={[borderThickness, signHeight, signDepth + 0.02]} />
        {brassMaterial}
      </mesh>

      {/* WHITE MARBLE SIGN FACE WITH OFFICIAL LOGO TEXTURE */}
      <mesh position={[0, 0, 0.015]} receiveShadow>
        <planeGeometry args={[signWidth, signHeight]} />
        {texture ? (
          <meshStandardMaterial
            map={texture}
            roughness={0.25}
            metalness={0.02}
          />
        ) : (
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        )}
      </mesh>

      {/* CORNER BRASS RIVETS / ROSETTES */}
      {[
        [-signWidth / 2, signHeight / 2],
        [signWidth / 2, signHeight / 2],
        [-signWidth / 2, -signHeight / 2],
        [signWidth / 2, -signHeight / 2],
      ].map(([x, y], idx) => (
        <mesh key={idx} position={[x, y, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.03, 16]} />
          {brassMaterial}
        </mesh>
      ))}

      {/* DEDICATED SIGNBOARD ACCENT LIGHT */}
      <pointLight
        position={[0, signHeight / 2 + 0.4, 0.6]}
        intensity={0.65}
        distance={4.5}
        color="#fff5dd"
      />
    </group>
  );
}
