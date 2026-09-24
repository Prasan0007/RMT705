/**
 * Deterministic PRNG + hash helpers for the "provably fair" demo flow.
 *
 * TODO(server): move seed generation and reveal to the backend. Right now the
 * seed is created and revealed entirely in the browser, which is fine for a
 * demo but proves nothing — a real implementation needs the server to commit
 * to the seed hash before the rip and reveal the seed after, so the client
 * can independently verify the outcome.
 */

export function mulberry32(seed: number) {
  let a = seed;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedFromString(input: string): number {
  let h = 1779033703 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(h ^ input.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return (h ^ (h >>> 16)) >>> 0;
}

export function randomSeed(): string {
  const bytes = new Uint32Array(4);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 2 ** 32);
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(8, "0")).join("");
}

/** SHA-256 hex digest, used to show the committed seed hash before a rip. */
export async function sha256Hex(input: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const data = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Fallback for non-secure contexts (no crypto.subtle) — not cryptographic,
  // display-only so the demo still renders a hash-looking string.
  let hash = seedFromString(input);
  let out = "";
  for (let i = 0; i < 8; i++) {
    hash = (Math.imul(hash, 48271) + 1) >>> 0;
    out += hash.toString(16).padStart(8, "0");
  }
  return out;
}

export function weightedPick<T>(items: { item: T; weight: number }[], rand: () => number): T {
  const total = items.reduce((sum, i) => sum + i.weight, 0);
  let roll = rand() * total;
  for (const entry of items) {
    roll -= entry.weight;
    if (roll <= 0) return entry.item;
  }
  return items[items.length - 1].item;
}
