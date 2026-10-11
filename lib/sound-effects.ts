// SOUND EFFECTS ENGINE
// Synthesizes a nostalgic school bell resonance and warm cinematic chimes
// using the Web Audio API without needing external audio files.

export function playClassroomEntranceChime() {
  if (typeof window === "undefined") return;

  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Harmonic frequencies for warm brass chime (fundamental + harmonics)
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 major chord

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      // Soft envelope
      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.15 / (idx + 1), now + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 3.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 3.3);
    });
  } catch (e) {
    // Graceful fallback if audio context blocked
  }
}
