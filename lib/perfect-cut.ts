import { cardsByRarity } from "./card-catalog";
import { mulberry32, seedFromString, weightedPick } from "./rng";
import { RARITY_ORDER, type CardDef, type Rarity } from "./types";

export interface PrecisionTier {
  id: "elite" | "premium" | "standard";
  label: string;
  minPrecision: number;
  weights: Partial<Record<Rarity, number>>;
  blurb: string;
}

/** Same idea as the main odds config: one source of truth the prize tables
 * shown pre-purchase and the resolver both read from. */
export const PRECISION_TIERS: PrecisionTier[] = [
  {
    id: "elite",
    label: "Elite",
    minPrecision: 95,
    weights: { legendary: 55, grail: 45 },
    blurb: "95%+ precision. The rainbow foil is basically guaranteed.",
  },
  {
    id: "premium",
    label: "Premium",
    minPrecision: 80,
    weights: { epic: 30, legendary: 58, grail: 12 },
    blurb: "80–94% precision. Still a stacked table, grail is live.",
  },
  {
    id: "standard",
    label: "Standard",
    minPrecision: 0,
    weights: { epic: 70, legendary: 28, grail: 2 },
    blurb: "Below 80% — guaranteed high value, grail is a long shot.",
  },
];

export function tierForPrecision(precision: number): PrecisionTier {
  return PRECISION_TIERS.find((t) => precision >= t.minPrecision) ?? PRECISION_TIERS[PRECISION_TIERS.length - 1];
}

export function buildTierOddsTable(tier: PrecisionTier) {
  const total = Object.values(tier.weights).reduce((a, b) => a + (b ?? 0), 0);
  return RARITY_ORDER.filter((r) => (tier.weights[r] ?? 0) > 0).map((rarity) => ({
    rarity,
    probability: total > 0 ? (tier.weights[rarity] ?? 0) / total : 0,
  }));
}

export function drawTierCard(tier: PrecisionTier, seed: string): CardDef {
  const rand = mulberry32(seedFromString(seed + tier.id));
  const table = buildTierOddsTable(tier);
  const rarity = weightedPick(
    table.map((e) => ({ item: e.rarity, weight: e.probability })),
    rand
  );
  const pool = cardsByRarity(rarity);
  return weightedPick(
    pool.map((c) => ({ item: c, weight: 1 })),
    rand
  );
}

export interface CutLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/**
 * Generates the true cut line for a round: a random center point and angle,
 * extended to the edges of the unit square (0..1 normalized coordinates).
 *
 * TODO(server): this line is generated and scored entirely client-side for
 * the demo. A real implementation must generate it server-side, send only
 * enough to render it for exactly the 2s reveal window, and score the
 * player's swipe against the server-held line so it can't be inspected or
 * replayed from client state.
 */
export function generateCutLine(seed: string): CutLine {
  const rand = mulberry32(seedFromString(seed + "cutline"));
  const cx = 0.32 + rand() * 0.36; // keep the pivot off-dead-center
  const cy = 0.32 + rand() * 0.36;
  const angleDeg = -55 + rand() * 110; // never perfectly vertical/horizontal-locked
  const angle = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const reach = 0.9;
  return {
    x1: cx - dx * reach,
    y1: cy - dy * reach,
    x2: cx + dx * reach,
    y2: cy + dy * reach,
  };
}

function lineAngleDeg(line: CutLine): number {
  const raw = (Math.atan2(line.y2 - line.y1, line.x2 - line.x1) * 180) / Math.PI;
  const norm = ((raw % 180) + 180) % 180;
  return norm;
}

function perpendicularDistance(point: { x: number; y: number }, line: CutLine): number {
  const dx = line.x2 - line.x1;
  const dy = line.y2 - line.y1;
  const len = Math.hypot(dx, dy) || 1;
  const cross = dx * (point.y - line.y1) - dy * (point.x - line.x1);
  return Math.abs(cross) / len;
}

export interface PrecisionResult {
  precision: number;
  angleDiffDeg: number;
  positionDiff: number;
}

export function scorePrecision(trueLine: CutLine, userLine: CutLine): PrecisionResult {
  const angleA = lineAngleDeg(trueLine);
  const angleB = lineAngleDeg(userLine);
  let angleDiff = Math.abs(angleA - angleB);
  if (angleDiff > 90) angleDiff = 180 - angleDiff;

  const userMid = { x: (userLine.x1 + userLine.x2) / 2, y: (userLine.y1 + userLine.y2) / 2 };
  const positionDiff = perpendicularDistance(userMid, trueLine);

  const angleScore = Math.max(0, 1 - angleDiff / 40);
  const posScore = Math.max(0, 1 - positionDiff / 0.28);
  const precision = Math.round(100 * (0.5 * angleScore + 0.5 * posScore));

  return { precision: Math.max(0, Math.min(100, precision)), angleDiffDeg: angleDiff, positionDiff };
}
