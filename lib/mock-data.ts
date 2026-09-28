import type { TokenBundle } from "./types";

export const TOKEN_BUNDLES: TokenBundle[] = [
  { id: "bundle-100", tokens: 100, bonusPct: 0, priceUsd: 4.99 },
  { id: "bundle-500", tokens: 500, bonusPct: 8, priceUsd: 19.99, badge: "Popular" },
  { id: "bundle-1200", tokens: 1200, bonusPct: 15, priceUsd: 44.99, badge: "Best Value" },
  { id: "bundle-5000", tokens: 5000, bonusPct: 25, priceUsd: 179.99, badge: "High Roller" },
];
