import type { PackTierId } from "@/lib/types";

export const TIER_THEME: Record<PackTierId, { label: string; colorA: string; colorB: string; ring: string }> = {
  starter: { label: "Starter", colorA: "#3ddc84", colorB: "#22d3ee", ring: "ring-emerald-400/30" },
  mid: { label: "Mid Tier", colorA: "#3d9bfa", colorB: "#8b5cf6", ring: "ring-blue-400/30" },
  "high-roller": { label: "High Roller", colorA: "#b46bff", colorB: "#f5c451", ring: "ring-violet-400/30" },
  "grail-hunter": { label: "Grail Hunter", colorA: "#ff5f6d", colorB: "#f5c451", ring: "ring-amber-300/40" },
  "perfect-cut": { label: "Signature", colorA: "#f5c451", colorB: "#ffffff", ring: "ring-amber-300/50" },
};
