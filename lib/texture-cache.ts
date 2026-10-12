"use client";

import * as THREE from "three";

// Central Texture Cache to prevent GC spikes and eliminate texture pop-in / micro-stutters
class TextureCacheManager {
  private static instance: TextureCacheManager | null = null;
  private cache: Map<string, THREE.Texture> = new Map();
  private loader: THREE.TextureLoader | null = null;
  private preloadedUrls: Set<string> = new Set();

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

  public getTexture(url: string, onLoad?: (tex: THREE.Texture) => void): THREE.Texture | null {
    if (this.cache.has(url)) {
      const tex = this.cache.get(url)!;
      if (onLoad) onLoad(tex);
      return tex;
    }

    if (!this.loader) return null;

    this.loader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        this.cache.set(url, tex);
        if (onLoad) onLoad(tex);
      },
      undefined,
      (err) => {
        console.warn(`[TextureCache] Failed to load: ${url}`, err);
      }
    );

    return null;
  }

  public preloadBatch(urls: string[]) {
    if (!this.loader) return;
    urls.forEach((url) => {
      if (this.preloadedUrls.has(url) || this.cache.has(url)) return;
      this.preloadedUrls.add(url);
      this.loader!.load(url, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        this.cache.set(url, tex);
      });
    });
  }
}

export const textureCache = TextureCacheManager.getInstance();
