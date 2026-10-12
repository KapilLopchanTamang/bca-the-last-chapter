"use client";

import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PhotoAsset } from "@/lib/asset-manifest";
import { TimelineController } from "@/lib/timeline-controller";
import { textureCache } from "@/lib/texture-cache";

interface MemoryPhotoProps {
  photo: PhotoAsset;
  index: number;
  totalPhotos: number;
  onSelect?: (photo: PhotoAsset) => void;
}

export function MemoryPhoto({
  photo,
  index,
  totalPhotos,
  onSelect,
}: MemoryPhotoProps) {
  const groupRef = useRef<THREE.Group>(null);
  const frameMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const photoMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const glowMatRef = useRef<THREE.MeshBasicMaterial>(null);

  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  // Load texture from central cache
  useEffect(() => {
    let isMounted = true;
    const url = photo.thumb || photo.src;
    const cached = textureCache.getTexture(url, (tex) => {
      if (isMounted) setTexture(tex);
    });
    if (cached) {
      setTexture(cached);
    }
    return () => {
      isMounted = false;
    };
  }, [photo.src, photo.thumb]);

  // Dimensions preserving exact aspect ratio
  const baseHeight = 2.2;
  const baseWidth = baseHeight * (photo.aspectRatio || 1.33);

  // Classic photograph paper border
  const borderPadding = 0.12;
  const frameWidth = baseWidth + borderPadding * 2;
  const frameHeight = baseHeight + borderPadding * 2 + 0.18;

  // Stable seed for gentle micro-floating life
  const seed = useRef(index * 1.37 + Math.sin(index) * 5.0).current;

  // Pure WebGL 60/120 FPS continuous frame loop - ZERO React re-renders!
  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime() + seed;

    const live = TimelineController.getInstance().getLiveState();
    const { phase, progress, memoryStreamProgress } = live;

    const isFinale =
      phase === "DOOR_CLOSING" ||
      phase === "FINAL_GRADUATION" ||
      progress > 0.93;

    if (isFinale) {
      // GRAND FINALE MOSAIC ARC
      const totalFinale = Math.min(totalPhotos, 36);
      if (index >= totalFinale) {
        groupRef.current.visible = false;
        return;
      }

      groupRef.current.visible = true;

      const col = index % 9;
      const row = Math.floor(index / 9);
      const targetX = (col - 4) * 1.55;
      const targetY = 1.3 - row * 1.3 + Math.sin(t * 1.1) * 0.02;
      const targetZ = -11.5 - Math.abs(col - 4) * 0.25;
      const targetRotY = (col - 4) * -0.05;

      // Smoothly glide into amphitheater formation
      groupRef.current.position.x = THREE.MathUtils.damp(
        groupRef.current.position.x,
        targetX,
        5.0,
        delta
      );
      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y,
        targetY,
        5.0,
        delta
      );
      groupRef.current.position.z = THREE.MathUtils.damp(
        groupRef.current.position.z,
        targetZ,
        5.0,
        delta
      );

      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, 0, 5, delta);
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 5, delta);
      groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, 0, 5, delta);

      const targetScale = hovered ? 0.98 : 0.88;
      const s = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 6, delta);
      groupRef.current.scale.set(s, s, s);

      if (frameMatRef.current) {
        frameMatRef.current.opacity = THREE.MathUtils.damp(frameMatRef.current.opacity, 0.92, 6, delta);
      }
      if (photoMatRef.current) {
        photoMatRef.current.opacity = THREE.MathUtils.damp(photoMatRef.current.opacity, 0.92, 6, delta);
      }
      if (glowMatRef.current) {
        glowMatRef.current.opacity = THREE.MathUtils.damp(
          glowMatRef.current.opacity,
          hovered ? 0.6 : 0,
          8,
          delta
        );
      }
      return;
    }

    // CINEMATIC STREAM MODE
    const liveStreamIndex =
      phase === "MEMORIES_ACTIVE"
        ? memoryStreamProgress * (totalPhotos - 1)
        : 0;

    const diff = index - liveStreamIndex;

    // Cull photos too far away
    if (diff > 2.6 || diff < -1.7) {
      groupRef.current.visible = false;
      return;
    }

    groupRef.current.visible = true;

    // Cubic smoothstep helper
    const smoothstep = (min: number, max: number, value: number) => {
      const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
      return x * x * (3 - 2 * x);
    };

    let targetX = 0;
    let targetY = 0.15;
    let targetZ = -2.0;
    let targetScale = 1.28;
    let targetOpacity = 1.0;
    let targetRotX = 0;
    let targetRotY = 0;
    let glowTarget = 0;

    const side = index % 2 === 0 ? 1 : -1;

    if (diff >= 0) {
      // ENTERING FROM DEPTH TOWARDS CENTER (diff: 2.6 -> 0)
      const u = Math.min(1, diff / 2.2);
      // Ease-in with strong deceleration into the center
      const ease = u * u * (3 - 2 * u);

      // Z moves from deep background (-10.5) to center stage (-2.0)
      targetZ = -2.0 - ease * 8.5;
      // X converges from side to dead center
      targetX = side * 1.2 * smoothstep(0.15, 2.0, diff);
      // Scale grows from 0.48 to 1.28
      targetScale = THREE.MathUtils.lerp(1.28, 0.48, ease);
      // Opacity fades in
      targetOpacity = 1 - smoothstep(1.5, 2.4, diff);
      // Entry bank tilt
      targetRotY = -side * 0.16 * ease;
      targetRotX = ease * 0.08;

      // When approaching center spotlight
      if (diff < 0.45) {
        glowTarget = (1 - diff / 0.45) * 0.55;
      }
    } else {
      // PASSING THROUGH PAST CAMERA (diff: 0 -> -1.7)
      const v = Math.min(1, (-diff - 0.2) / 1.15);
      const ease = v * v * (3 - 2 * v);

      // Z travels forward from -2.0 to +2.4 (smoothly passing camera at Z = 0.7)
      targetZ = -2.0 + ease * 4.4;
      // Sweeps outward to side
      targetX = -side * 2.2 * smoothstep(0.1, 1.2, -diff);
      // Expands as it gets closer
      targetScale = THREE.MathUtils.lerp(1.28, 1.6, ease);
      // Dissolves gracefully
      targetOpacity = 1 - smoothstep(0.35, 1.35, -diff);
      // Outward bank rotation
      targetRotY = side * 0.22 * ease;
      targetRotX = -ease * 0.06;

      if (-diff < 0.45) {
        glowTarget = (1 - (-diff) / 0.45) * 0.55;
      }
    }

    // Add organic steadycam hovering life when near center
    const isCenterHero = Math.abs(diff) < 0.45;
    const floatY = isCenterHero
      ? Math.sin(t * 1.8) * 0.045
      : Math.sin(t * 1.2) * 0.02;
    const floatRotX = isCenterHero
      ? Math.sin(t * 1.4) * 0.015
      : 0;
    const floatRotY = isCenterHero
      ? Math.cos(t * 1.2) * 0.02
      : 0;
    const floatRotZ = Math.sin(t * 0.8) * 0.01;

    targetY += floatY;
    targetRotX += floatRotX;
    targetRotY += floatRotY;

    if (hovered) {
      targetScale *= 1.1;
      glowTarget = 0.7;
    }

    // Responsive high-fidelity smooth damping (zero jitter!)
    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      targetX,
      7.0,
      delta
    );
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      targetY,
      7.0,
      delta
    );
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      targetZ,
      7.0,
      delta
    );

    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotX,
      6.5,
      delta
    );
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotY,
      6.5,
      delta
    );
    groupRef.current.rotation.z = THREE.MathUtils.damp(
      groupRef.current.rotation.z,
      floatRotZ,
      6.5,
      delta
    );

    const s = THREE.MathUtils.damp(
      groupRef.current.scale.x,
      targetScale,
      7.0,
      delta
    );
    groupRef.current.scale.set(s, s, s);

    if (frameMatRef.current) {
      frameMatRef.current.opacity = THREE.MathUtils.damp(
        frameMatRef.current.opacity,
        targetOpacity,
        8.0,
        delta
      );
    }
    if (photoMatRef.current) {
      photoMatRef.current.opacity = THREE.MathUtils.damp(
        photoMatRef.current.opacity,
        targetOpacity,
        8.0,
        delta
      );
    }
    if (glowMatRef.current) {
      glowMatRef.current.opacity = THREE.MathUtils.damp(
        glowMatRef.current.opacity,
        glowTarget,
        8.0,
        delta
      );
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, 0, -12]}
      scale={0.5}
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
          color={hovered ? "#fffdf5" : "#f4ede0"}
          roughness={0.5}
          metalness={0.05}
          transparent
          opacity={0}
        />
      </mesh>

      {/* AMBER / GOLDEN SPOTLIGHT GLOW ON CENTER HERO OR HOVER */}
      <mesh position={[0, -0.06, -0.022]}>
        <boxGeometry args={[frameWidth + 0.12, frameHeight + 0.12, 0.01]} />
        <meshBasicMaterial
          ref={glowMatRef}
          color="#dfa857"
          transparent
          opacity={0}
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
            opacity={0}
          />
        ) : (
          <meshStandardMaterial
            color="#212530"
            roughness={0.8}
            transparent
            opacity={0}
          />
        )}
      </mesh>
    </group>
  );
}
