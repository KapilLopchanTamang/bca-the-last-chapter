"use client";

import * as THREE from "three";

// High-Performance Central Texture Cache
// Guarantees immediate preview delivery via thumbnails, single-flight deduplication,
// and zero-stutter GPU memory uploads with moderate anisotropy.
class TextureCacheManager {
  private static instance: TextureCacheManager | null = null;
  private cache: Map<string, THREE.Texture> = new Map();
  private pending: Map<string, Array<(tex: THREE.Texture) => void>> = new Map();
  private loader: THREE.TextureLoader | null = null;
  private defaultPlaceholder: THREE.DataTexture | null = null;

  private constructor() {
    if (typeof window !== "undefined") {
      this.loader = new THREE.TextureLoader();
      // 2x2 neutral off-white data texture to avoid shader recompilation
      const data = new Uint8Array([
        240, 238, 235, 255, 240, 238, 235, 255,
        240, 238, 235, 255, 240, 238, 235, 255,
      ]);
      this.defaultPlaceholder = new THREE.DataTexture(data, 2, 2, THREE.RGBAFormat);
      this.defaultPlaceholder.needsUpdate = true;
    }
  }

  public static getInstance(): TextureCacheManager {
    if (!TextureCacheManager.instance) {
      TextureCacheManager.instance = new TextureCacheManager();
    }
    return TextureCacheManager.instance;
  }

  public getPlaceholder(): THREE.Texture | undefined {
    return this.defaultPlaceholder || undefined;
  }

  public has(url: string): boolean {
    return this.cache.has(url);
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
        tex.anisotropy = 4; // High-fidelity without GPU memory penalty
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

  // Progressive photo loader: loads thumb first for instant display, then upgrades to full-res
  public loadProgressive(
    thumbUrl: string,
    fullUrl: string,
    onUpdate: (tex: THREE.Texture, isFullRes: boolean) => void
  ) {
    // 1. Check if full resolution already exists in cache
    if (this.cache.has(fullUrl)) {
      onUpdate(this.cache.get(fullUrl)!, true);
      return;
    }

    // 2. Check or load thumbnail for instantaneous visual display
    if (this.cache.has(thumbUrl)) {
      onUpdate(this.cache.get(thumbUrl)!, false);
    } else {
      this.getTexture(thumbUrl, (thumbTex) => {
        // Only apply thumb if full resolution hasn't arrived yet
        if (!this.cache.has(fullUrl)) {
          onUpdate(thumbTex, false);
        }
      });
    }

    // 3. Concurrently or lookahead load full resolution
    this.getTexture(fullUrl, (fullTex) => {
      onUpdate(fullTex, true);
    });
  }

  // Smart lookahead preloader
  public preloadUpcoming(
    photos: Array<{ src: string; thumb: string }>,
    currentIndex: number,
    lookahead: number = 8
  ) {
    if (!this.loader) return;
    const start = Math.max(0, Math.floor(currentIndex));
    const end = Math.min(photos.length, start + lookahead);

    for (let i = start; i < end; i++) {
      const p = photos[i];
      if (p.thumb && !this.cache.has(p.thumb)) {
        this.getTexture(p.thumb);
      }
      if (i < start + 4 && p.src && !this.cache.has(p.src)) {
        this.getTexture(p.src);
      }
    }
  }

  // Pre-warms the starting memories and thumbnails
  public preloadInitial(photos: Array<{ src: string; thumb: string }>) {
    if (!this.loader) return;

    // Load first 20 thumbnails immediately (instant previews for initial minutes)
    const initialThumbs = photos.slice(0, 20);
    initialThumbs.forEach((p) => {
      if (p.thumb) this.getTexture(p.thumb);
    });

    // Load first 6 full-res photos immediately (ready before classroom doors open)
    const initialFull = photos.slice(0, 6);
    initialFull.forEach((p) => {
      if (p.src) this.getTexture(p.src);
    });

    // Stagger remaining thumbnails progressively
    if (photos.length > 20 && typeof window !== "undefined") {
      let idx = 20;
      const chunkSize = 6;
      const scheduleNext = () => {
        if (idx >= photos.length) return;
        const chunk = photos.slice(idx, idx + chunkSize);
        chunk.forEach((p) => {
          if (p.thumb) this.getTexture(p.thumb);
        });
        idx += chunkSize;
        setTimeout(scheduleNext, 200);
      };
      setTimeout(scheduleNext, 350);
    }
  }
}

export const textureCache = TextureCacheManager.getInstance();
