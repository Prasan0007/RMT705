import type { LeaderboardEntry, PullRecord, TokenBundle, VaultItem } from "./types";

// Fixed reference point instead of Date.now() so these baked-in timestamps
// render identically on the server and after client hydration.
const NOW = new Date("2026-09-24T18:00:00Z").getTime();

export const TOKEN_BUNDLES: TokenBundle[] = [
  { id: "bundle-100", tokens: 100, bonusPct: 0, priceUsd: 4.99 },
  { id: "bundle-500", tokens: 500, bonusPct: 8, priceUsd: 19.99, badge: "Popular" },
  { id: "bundle-1200", tokens: 1200, bonusPct: 15, priceUsd: 44.99, badge: "Best Value" },
  { id: "bundle-5000", tokens: 5000, bonusPct: 25, priceUsd: 179.99, badge: "High Roller" },
];

const RIPPER_NAMES = [
  "vaultbreaker", "foilqueen", "ninecoldopens", "grailorbust", "slabsmith",
  "duskripper", "coldpackjackie", "emberhands", "tidewalker99", "aureliux_fan",
  "packmath", "rippercitydan", "holo_hoarder", "crackthecase", "lastpullwins",
];

function seedRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export const RECENT_PULLS: PullRecord[] = (() => {
  const rand = seedRand(42);
  const rarities: PullRecord["rarity"][] = ["grail", "legendary", "epic", "legendary", "grail", "epic", "legendary"];
  const cardIds = ["aureliux", "voidmonarch", "pyroclast", "chronogryph", "solflare", "leviathorn", "duskrend"];
  const packNames = ["Grail Hunter Pack", "Caldera Pack", "The Perfect Cut", "Aetherfall Pack", "Tidebreak Pack"];
  return Array.from({ length: 14 }, (_, i) => {
    const idx = i % rarities.length;
    const value = rarities[idx] === "grail" ? 3800 + Math.round(rand() * 900) : 500 + Math.round(rand() * 400);
    return {
      id: `pull-${i}`,
      user: RIPPER_NAMES[Math.floor(rand() * RIPPER_NAMES.length)],
      cardId: cardIds[idx],
      rarity: rarities[idx],
      grade: Math.round((7 + rand() * 3) * 10) / 10,
      value,
      packName: packNames[Math.floor(rand() * packNames.length)],
      timestamp: new Date(NOW - i * 1000 * 60 * (3 + rand() * 12)).toISOString(),
    };
  });
})();

export const LEADERBOARD_TODAY: LeaderboardEntry[] = [
  { rank: 1, user: "vaultbreaker", avatarSeed: "vb1", totalValue: 18420, bestPull: "Aureliux, First Light", packsOpened: 34 },
  { rank: 2, user: "grailorbust", avatarSeed: "gb2", totalValue: 12980, bestPull: "Chronogryph", packsOpened: 51 },
  { rank: 3, user: "coldpackjackie", avatarSeed: "cj3", totalValue: 9740, bestPull: "Voidmonarch", packsOpened: 22 },
  { rank: 4, user: "duskripper", avatarSeed: "dr4", totalValue: 7120, bestPull: "Solflare Ascendant", packsOpened: 40 },
  { rank: 5, user: "packmath", avatarSeed: "pm5", totalValue: 5990, bestPull: "Leviathorn", packsOpened: 61 },
  { rank: 6, user: "holo_hoarder", avatarSeed: "hh6", totalValue: 4310, bestPull: "Pyroclast", packsOpened: 18 },
  { rank: 7, user: "lastpullwins", avatarSeed: "lp7", totalValue: 3675, bestPull: "Galestorm", packsOpened: 27 },
];

export const LEADERBOARD_WEEK: LeaderboardEntry[] = [
  { rank: 1, user: "grailorbust", avatarSeed: "gb2", totalValue: 61200, bestPull: "Aureliux, First Light", packsOpened: 220 },
  { rank: 2, user: "vaultbreaker", avatarSeed: "vb1", totalValue: 54830, bestPull: "Chronogryph", packsOpened: 198 },
  { rank: 3, user: "ninecoldopens", avatarSeed: "nc3", totalValue: 41200, bestPull: "Voidmonarch", packsOpened: 305 },
  { rank: 4, user: "slabsmith", avatarSeed: "ss4", totalValue: 33750, bestPull: "Leviathorn", packsOpened: 140 },
  { rank: 5, user: "emberhands", avatarSeed: "eh5", totalValue: 28900, bestPull: "Solflare Ascendant", packsOpened: 176 },
  { rank: 6, user: "rippercitydan", avatarSeed: "rd6", totalValue: 21430, bestPull: "Pyroclast", packsOpened: 88 },
  { rank: 7, user: "tidewalker99", avatarSeed: "tw7", totalValue: 17650, bestPull: "Tsunareign", packsOpened: 133 },
];

export const STARTER_VAULT: VaultItem[] = [
  { instanceId: "v1", cardId: "cindermane", grade: 9.5, pulledAt: new Date(NOW - 86400000 * 1).toISOString(), packId: "caldera-high", serial: "FF-004821" },
  { instanceId: "v2", cardId: "thornmaw", grade: 8.5, pulledAt: new Date(NOW - 86400000 * 2).toISOString(), packId: "tidebreak-mid", serial: "FF-004798" },
  { instanceId: "v3", cardId: "voltfin", grade: 7.5, pulledAt: new Date(NOW - 86400000 * 3).toISOString(), packId: "voltage-starter", serial: "FF-004712" },
  { instanceId: "v4", cardId: "duskrend", grade: 9.0, pulledAt: new Date(NOW - 86400000 * 5).toISOString(), packId: "aetherfall-high", serial: "FF-004601", showcased: true },
  { instanceId: "v5", cardId: "leaflin", grade: 6.5, pulledAt: new Date(NOW - 86400000 * 6).toISOString(), packId: "ember-starter", serial: "FF-004550" },
  { instanceId: "v6", cardId: "hollowsight", grade: 8.0, pulledAt: new Date(NOW - 86400000 * 8).toISOString(), packId: "umbral-mid", serial: "FF-004402" },
];
