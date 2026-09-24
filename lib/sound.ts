"use client";

/**
 * Lightweight synthesized SFX so the demo doesn't ship binary audio assets.
 * Everything here is generated with the Web Audio API on the fly. Swap for
 * real mixed foley (crinkle, shatter, crowd roar) whenever those exist.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function noiseBuffer(context: AudioContext, seconds: number): AudioBuffer {
  const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

export function playCrinkle(intensity = 1) {
  const c = getCtx();
  if (!c) return;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, 0.35);
  const bandpass = c.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.setValueAtTime(1800 + Math.random() * 1200, c.currentTime);
  bandpass.Q.value = 0.6;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, c.currentTime);
  gain.gain.linearRampToValueAtTime(0.18 * intensity, c.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.3);
  src.connect(bandpass).connect(gain).connect(c.destination);
  src.start();
  src.stop(c.currentTime + 0.35);
}

export function playChime(rarity: "common" | "uncommon" | "rare" | "epic" | "legendary" | "grail") {
  const c = getCtx();
  if (!c) return;
  const freqs: Record<string, number[]> = {
    common: [392],
    uncommon: [440, 554],
    rare: [523, 659],
    epic: [587, 740, 880],
    legendary: [659, 831, 988, 1174],
    grail: [523, 659, 784, 988, 1318],
  };
  freqs[rarity].forEach((f, i) => {
    const osc = c.createOscillator();
    osc.type = "sine";
    osc.frequency.value = f;
    const gain = c.createGain();
    const start = c.currentTime + i * 0.07;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(0.14, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);
    osc.connect(gain).connect(c.destination);
    osc.start(start);
    osc.stop(start + 1);
  });
}

export function playShatter() {
  const c = getCtx();
  if (!c) return;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, 0.6);
  const filter = c.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 2000;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.3, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.6);
  src.connect(filter).connect(gain).connect(c.destination);
  src.start();
}

export function playCrowdRoar() {
  const c = getCtx();
  if (!c) return;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, 1.4);
  src.loop = false;
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(300, c.currentTime);
  filter.frequency.linearRampToValueAtTime(2200, c.currentTime + 0.5);
  filter.frequency.linearRampToValueAtTime(800, c.currentTime + 1.4);
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, c.currentTime);
  gain.gain.linearRampToValueAtTime(0.35, c.currentTime + 0.3);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 1.4);
  src.connect(filter).connect(gain).connect(c.destination);
  src.start();
}
