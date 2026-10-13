"use client";

import React, { useRef, useEffect } from "react";
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
  const photoMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const glowMatRef = useRef<THREE.MeshBasicMaterial>(null);

  // References for pure 60/120fps WebGL execution with ZERO React re-renders
  const isHoveredRef = useRef(false);
  const hasFullResRef = useRef(false);

  // Progressive texture loading: thumb loads instantaneously, then upgrades to full-res
  useEffect(() => {
    let isMounted = true;

    textureCache.loadProgressive(
      photo.thumb,
      photo.src,
      (tex, isFull) => {
        if (!isMounted) return;
        if (isFull) hasFullResRef.current = true;

        if (photoMatRef.current) {
          photoMatRef.current.map = tex;
          photoMatRef.current.color.set("#ffffff");
          photoMatRef.current.needsUpdate = true;
        }
      }
    );

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

    const live = TimelineController.getInstance().getLiveState();
    const { phase, progress, memoryStreamProgress } = live;

    const isFinale =
      phase === "DOOR_CLOSING" ||
      phase === "FINAL_GRADUATION" ||
      progress > 0.93;

    // Fast-path early culling: immediately skip when far outside active view
    const liveStreamIndex =
      live.liveStreamIndex !== undefined
        ? live.liveStreamIndex
        : phase === "MEMORIES_ACTIVE"
        ? memoryStreamProgress * (totalPhotos - 1)
        : -1.5;

    const diff = index - liveStreamIndex;

    if (!isFinale) {
      if (diff > 2.6 || diff < -1.8) {
        if (groupRef.current.visible) {
          groupRef.current.visible = false;
        }
        return;
      }
    } else {
      // Grand Finale Mosaic Arc
      const totalFinale = Math.min(totalPhotos, 36);
      if (index >= totalFinale) {
        if (groupRef.current.visible) {
          groupRef.current.visible = false;
        }
        return;
      }
    }

    if (!groupRef.current.visible) {
      groupRef.current.visible = true;
    }

    const t = clock.getElapsedTime() + seed;
    const isHovered = isHoveredRef.current;

    // Check if full texture has arrived in cache and needs binding
    if (!hasFullResRef.current && photoMatRef.current) {
      const full = textureCache.getTexture(photo.src);
      if (full) {
        hasFullResRef.current = true;
        photoMatRef.current.map = full;
        photoMatRef.current.color.set("#ffffff");
        photoMatRef.current.needsUpdate = true;
      }
    }

    if (isFinale) {
      // GRAND FINALE MOSAIC ARC
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

      const targetScale = isHovered ? 0.98 : 0.88;
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
          isHovered ? 0.6 : 0,
          8,
          delta
        );
      }
      return;
    }

    // CINEMATIC STREAM MODE
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

    // Dedicated front-end plateau hold radius
    const holdRadius = 0.28;

    if (diff > holdRadius) {
      // PHASE 1: ENTERING FROM DEPTH TOWARDS CENTER (diff: 2.6 -> +0.28)
      const u = Math.min(1, Math.max(0, (diff - holdRadius) / 2.0));
      const ease = u * u * (3 - 2 * u);

      targetZ = -2.0 - ease * 8.5;
      targetX = side * 1.15 * ease;
      targetScale = THREE.MathUtils.lerp(1.28, 0.48, ease);
      targetOpacity = 1 - smoothstep(0.8, 1.9, diff);
      targetRotY = -side * 0.14 * ease;
      targetRotX = ease * 0.06;

      if (diff < holdRadius + 0.35) {
        glowTarget = (1 - (diff - holdRadius) / 0.35) * 0.55;
      }
    } else if (diff < -holdRadius) {
      // PHASE 3: PASSING THROUGH PAST CAMERA (diff: -0.28 -> -1.8)
      const w = Math.min(1, Math.max(0, (-diff - holdRadius) / 1.15));
      const ease = w * w * (3 - 2 * w);

      targetZ = -2.0 + ease * 4.4;
      targetX = -side * 1.85 * ease;
      targetScale = THREE.MathUtils.lerp(1.28, 1.62, ease);
      targetOpacity = 1 - smoothstep(0.25, 0.90, w);
      targetRotY = side * 0.18 * ease;
      targetRotX = -ease * 0.05;

      if (-diff < holdRadius + 0.35) {
        glowTarget = (1 - (-diff - holdRadius) / 0.35) * 0.55;
      }
    } else {
      // PHASE 2: FRONT-END HOLD ZONE (-holdRadius <= diff <= +holdRadius)
      targetZ = -2.0;
      targetX = 0;
      targetScale = 1.28;
      targetOpacity = 1.0;
      targetRotX = 0;
      targetRotY = 0;
      glowTarget = 0.65;
    }

    // Add organic steadycam hovering life when near center spotlight
    const heroProximity = Math.max(0, 1 - Math.abs(diff) / 0.65);
    if (heroProximity > 0) {
      const floatY = Math.sin(t * 1.4) * 0.035 * heroProximity;
      const floatRotX = Math.sin(t * 1.1) * 0.012 * heroProximity;
      const floatRotY = Math.cos(t * 0.9) * 0.015 * heroProximity;
      const floatRotZ = Math.sin(t * 0.7) * 0.008 * heroProximity;

      targetY += floatY;
      targetRotX += floatRotX;
      targetRotY += floatRotY;
    }

    if (isHovered) {
      targetScale *= 1.08;
      glowTarget = 0.85;
    }

    // High-performance smooth damping
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
      (index % 2 === 0 ? 0.01 : -0.01) + Math.sin(t * 0.6) * 0.006,
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

  // Pre-fetch initial texture if already available in cache
  const initialTex = textureCache.getTexture(photo.src) || textureCache.getTexture(photo.thumb) || textureCache.getPlaceholder();

  return (
    <group
      ref={groupRef}
      position={[0, 0, -12]}
      scale={0.5}
      visible={false}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelect) onSelect(photo);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
        isHoveredRef.current = true;
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
        isHoveredRef.current = false;
      }}
    >
      {/* CRISP WHITE PHOTOGRAPHIC PAPER BACKING */}
      <mesh position={[0, -0.06, -0.015]}>
        <boxGeometry args={[frameWidth, frameHeight, 0.03]} />
        <meshStandardMaterial
          ref={frameMatRef}
          color="#fcfaf7"
          roughness={0.25}
          metalness={0.02}
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

      {/* PHOTOGRAPH TEXTURE SURFACE - CRISP TRUE COLOR WITHOUT SPECULAR LIGHT GLARE */}
      <mesh position={[0, 0.03, 0.005]}>
        <planeGeometry args={[baseWidth, baseHeight]} />
        <meshBasicMaterial
          ref={photoMatRef}
          map={initialTex}
          color="#ffffff"
          transparent
          opacity={0}
        />
      </mesh>
    </group>
  );
}
