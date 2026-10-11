"use client";

import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PhotoAsset } from "@/lib/asset-manifest";

interface MemoryPhotoProps {
  photo: PhotoAsset;
  targetPosition: [number, number, number];
  targetRotation?: [number, number, number];
  targetScale?: number;
  targetOpacity?: number;
  isCenterHero?: boolean;
  onSelect?: (photo: PhotoAsset) => void;
}

export function MemoryPhoto({
  photo,
  targetPosition,
  targetRotation = [0, 0, 0],
  targetScale = 1,
  targetOpacity = 1,
  isCenterHero = false,
  onSelect,
}: MemoryPhotoProps) {
  const groupRef = useRef<THREE.Group>(null);
  const frameMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const photoMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const glowMatRef = useRef<THREE.MeshBasicMaterial>(null);

  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  // Lazy load texture (optimized thumbnail first for instant 60fps)
  useEffect(() => {
    let isMounted = true;
    const loader = new THREE.TextureLoader();
    const url = photo.thumb || photo.src;

    loader.load(
      url,
      (loadedTex) => {
        if (!isMounted) {
          loadedTex.dispose();
          return;
        }
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        loadedTex.generateMipmaps = true;
        loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
        setTexture(loadedTex);
      },
      undefined,
      (err) => {
        console.warn(`Texture load failed for ${url}:`, err);
      }
    );

    return () => {
      isMounted = false;
      if (texture) texture.dispose();
    };
  }, [photo.src, photo.thumb]);

  // Dimensions preserving exact aspect ratio
  // Base height 2.2 units
  const baseHeight = 2.2;
  const baseWidth = baseHeight * (photo.aspectRatio || 1.33);

  // Classic photograph paper border
  const borderPadding = 0.12;
  const frameWidth = baseWidth + borderPadding * 2;
  const frameHeight = baseHeight + borderPadding * 2 + 0.18; // extra room at bottom like polaroid / archival photo print

  // Seed for micro-animations
  const seed = useRef(Math.random() * 50);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime() + seed.current;

    // Organic floating life
    const floatY = isCenterHero
      ? Math.sin(t * 1.8) * 0.05
      : Math.sin(t * 1.2) * 0.03;
    const floatRotX = isCenterHero
      ? Math.sin(t * 1.4) * 0.02
      : Math.sin(t * 1.0) * 0.015;
    const floatRotY = isCenterHero
      ? Math.cos(t * 1.2) * 0.03
      : Math.cos(t * 0.9) * 0.02;

    const posX = targetPosition[0];
    const posY = targetPosition[1] + floatY;
    const posZ = targetPosition[2];

    // Smooth damp towards target coordinates
    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      posX,
      6.5,
      delta
    );
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      posY,
      6.5,
      delta
    );
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      posZ,
      6.5,
      delta
    );

    // Rotations
    const rx = targetRotation[0] + floatRotX;
    const ry = targetRotation[1] + (hovered ? 0 : floatRotY);
    const rz = targetRotation[2] + Math.sin(t * 0.8) * 0.01;

    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      rx,
      6,
      delta
    );
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      ry,
      6,
      delta
    );
    groupRef.current.rotation.z = THREE.MathUtils.damp(
      groupRef.current.rotation.z,
      rz,
      6,
      delta
    );

    // Scale
    const s = hovered ? targetScale * 1.1 : targetScale;
    groupRef.current.scale.set(s, s, s);

    // Dynamic Opacity
    if (frameMatRef.current) {
      frameMatRef.current.opacity = THREE.MathUtils.damp(
        frameMatRef.current.opacity,
        targetOpacity,
        8,
        delta
      );
    }
    if (photoMatRef.current) {
      photoMatRef.current.opacity = THREE.MathUtils.damp(
        photoMatRef.current.opacity,
        targetOpacity,
        8,
        delta
      );
    }
    if (glowMatRef.current) {
      glowMatRef.current.opacity = THREE.MathUtils.damp(
        glowMatRef.current.opacity,
        isCenterHero ? 0.45 : hovered ? 0.6 : 0,
        8,
        delta
      );
    }
  });

  return (
    <group
      ref={groupRef}
      position={targetPosition}
      rotation={targetRotation}
      scale={targetScale}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelect) onSelect(photo);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
        setHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
        setHovered(false);
      }}
    >
      {/* VINTAGE PHOTOGRAPHIC PAPER BACKING */}
      <mesh castShadow receiveShadow position={[0, -0.06, -0.015]}>
        <boxGeometry args={[frameWidth, frameHeight, 0.03]} />
        <meshStandardMaterial
          ref={frameMatRef}
          color={isCenterHero || hovered ? "#fffdf5" : "#f4ede0"}
          roughness={0.5}
          metalness={0.05}
          transparent
          opacity={targetOpacity}
        />
      </mesh>

      {/* AMBER / GOLDEN SPOTLIGHT GLOW ON CENTER HERO OR HOVER */}
      <mesh position={[0, -0.06, -0.022]}>
        <boxGeometry args={[frameWidth + 0.12, frameHeight + 0.12, 0.01]} />
        <meshBasicMaterial
          ref={glowMatRef}
          color="#dfa857"
          transparent
          opacity={isCenterHero ? 0.45 : 0}
        />
      </mesh>

      {/* PHOTOGRAPH TEXTURE SURFACE */}
      <mesh position={[0, 0.03, 0.005]}>
        <planeGeometry args={[baseWidth, baseHeight]} />
        {texture ? (
          <meshStandardMaterial
            ref={photoMatRef}
            map={texture}
            roughness={0.2}
            metalness={0.04}
            transparent
            opacity={targetOpacity}
          />
        ) : (
          <meshStandardMaterial
            color="#212530"
            roughness={0.8}
            transparent
            opacity={targetOpacity * 0.7}
          />
        )}
      </mesh>
    </group>
  );
}
