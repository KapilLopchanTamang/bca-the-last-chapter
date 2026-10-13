"use client";

import * as THREE from "three";

// Central Texture Cache with single-flight request deduplication
// Guarantees all subscribers receive textures reliably with zero duplicate network requests
class TextureCacheManager {
  private static instance: TextureCacheManager | null = null;
  private cache: Map<string, THREE.Texture> = new Map();
  private pending: Map<string, Array<(tex: THREE.Texture) => void>> = new Map();
  private loader: THREE.TextureLoader | null = null;

  private constructor() {
    if (typeof window !== "undefined") {
      this.loader = new THREE.TextureLoader();
    }
  }

  public static getInstance(): TextureCacheManager {
    if (!TextureCacheManager.instance) {
      TextureCacheManager.instance = new TextureCacheManager();
    }
    return TextureCacheManager.instance;
  }

  public getTexture(
    url: string,
    onLoad?: (tex: THREE.Texture) => void
  ): THREE.Texture | null {
    if (!url) return null;

    // 1. If already cached, invoke callback immediately and return texture
    if (this.cache.has(url)) {
      const tex = this.cache.get(url)!;
      if (onLoad) {
        onLoad(tex);
      }
      return tex;
    }

    if (!this.loader) return null;

    // 2. If load is already in-flight, register callback to avoid duplicate network load
    if (this.pending.has(url)) {
      if (onLoad) {
        this.pending.get(url)!.push(onLoad);
      }
      return null;
    }

    // 3. Initiate single-flight texture load
    const callbacks: Array<(tex: THREE.Texture) => void> = onLoad ? [onLoad] : [];
    this.pending.set(url, callbacks);

    this.loader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.anisotropy = 16;
        tex.needsUpdate = true;
        this.cache.set(url, tex);

        const waiting = this.pending.get(url) || [];
        this.pending.delete(url);
        waiting.forEach((cb) => {
          try {
            cb(tex);
          } catch (e) {
            console.warn("[TextureCache] Callback execution error:", e);
          }
        });
      },
      undefined,
      (err) => {
        console.warn(`[TextureCache] Failed to load: ${url}`, err);
        this.pending.delete(url);
      }
    );

    return null;
  }

  public preloadBatch(urls: string[], immediateCount: number = 24) {
    if (!this.loader) return;

    // Load initial batch immediately (ensures starting memories are instant)
    const immediate = urls.slice(0, immediateCount);
    const rest = urls.slice(immediateCount);

    immediate.forEach((url) => {
      this.getTexture(url);
    });

    // Schedule remaining photos progressively during idle times
    if (rest.length > 0 && typeof window !== "undefined") {
      let idx = 0;
      const chunkSize = 4;
      const scheduleNext = () => {
        if (idx >= rest.length) return;
        const chunk = rest.slice(idx, idx + chunkSize);
        chunk.forEach((url) => this.getTexture(url));
        idx += chunkSize;
        setTimeout(scheduleNext, 250);
      };
      setTimeout(scheduleNext, 400);
    }
  }
}

export const textureCache = TextureCacheManager.getInstance();
