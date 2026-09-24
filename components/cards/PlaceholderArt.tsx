"use client";

import { mulberry32, seedFromString } from "@/lib/rng";
import type { CardDef } from "@/lib/types";

const ELEMENT_GRADIENTS: Record<CardDef["element"], [string, string]> = {
  ember: ["#ff7a45", "#ff2d55"],
  tide: ["#22d3ee", "#0e4f8c"],
  verdant: ["#7ef29c", "#14622f"],
  volt: ["#fef08a", "#eab308"],
  umbra: ["#a78bfa", "#241539"],
  aether: ["#f5c451", "#8b5cf6"],
};

// Math.cos/Math.sin aren't guaranteed bit-identical across V8 builds (server
// vs browser), so raw output can drift by a fraction of a unit and trip a
// hydration mismatch. Rounding to 2dp keeps server and client output equal.
function round(n: number): number {
  return Math.round(n * 100) / 100;
}

function blobPath(rand: () => number, cx: number, cy: number, r: number, points = 9): string {
  const coords: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const radius = r * (0.72 + rand() * 0.32);
    coords.push([round(cx + Math.cos(angle) * radius), round(cy + Math.sin(angle) * radius)]);
  }
  let d = `M ${coords[0][0]} ${coords[0][1]} `;
  for (let i = 0; i < coords.length; i++) {
    const [x1, y1] = coords[i];
    const [x2, y2] = coords[(i + 1) % coords.length];
    const mx = round((x1 + x2) / 2);
    const my = round((y1 + y2) / 2);
    d += `Q ${x1} ${y1} ${mx} ${my} `;
  }
  return d + "Z";
}

/**
 * Procedural placeholder creature art. Deterministic per card id so the same
 * pull always looks the same. This is the slot licensed art drops into —
 * swap for <img src={card.image} /> once real renders exist.
 */
export function PlaceholderArt({ card }: { card: CardDef }) {
  const rand = mulberry32(seedFromString(card.id));
  const [c1, c2] = ELEMENT_GRADIENTS[card.element];
  const gradId = `grad-${card.id}`;
  const bodyPath = blobPath(rand, 100, 118, 58, 8 + Math.floor(rand() * 3));
  const earL = blobPath(rand, 68, 66, 18, 6);
  const earR = blobPath(rand, 132, 66, 18, 6);
  const eyeOffset = 14 + rand() * 6;
  const particles = Array.from({ length: 6 }, () => ({
    x: 20 + rand() * 160,
    y: 20 + rand() * 160,
    r: 2 + rand() * 3,
  }));

  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-label={`${card.name} placeholder art`}>
      <defs>
        <radialGradient id={gradId} cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#${gradId})`} opacity={0.9} />
      {particles.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="white" opacity={0.25} />
      ))}
      <path d={earL} fill={c2} opacity={0.9} />
      <path d={earR} fill={c2} opacity={0.9} />
      <path d={bodyPath} fill="#0b0c10" opacity={0.82} />
      <circle cx={100 - eyeOffset} cy={112} r={5.5} fill={c1} />
      <circle cx={100 + eyeOffset} cy={112} r={5.5} fill={c1} />
      <circle cx={100 - eyeOffset} cy={110.5} r={2} fill="white" />
      <circle cx={100 + eyeOffset} cy={110.5} r={2} fill="white" />
    </svg>
  );
}
