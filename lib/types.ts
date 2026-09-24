export type Rarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "grail";

export type PackTierId = "starter" | "mid" | "high-roller" | "grail-hunter" | "perfect-cut";

export interface CardDef {
  id: string;
  name: string;
  species: string;
  rarity: Rarity;
  /** Base token value used for sell-back offers and leaderboard math. */
  value: number;
  /** Swappable placeholder art slot — drop licensed renders in later. */
  image: string;
  flavor: string;
  element: "ember" | "tide" | "verdant" | "volt" | "umbra" | "aether";
}

export interface OddsEntry {
  rarity: Rarity;
  weight: number;
  probability: number;
  cardIds: string[];
}

export interface PackDef {
  id: string;
  tier: PackTierId;
  name: string;
  price: number;
  cardsPerPack: number;
  description: string;
  topPull: string;
  image: string;
  weights: Partial<Record<Rarity, number>>;
  guaranteedMinRarity?: Rarity;
  featured?: boolean;
}

export interface VaultItem {
  instanceId: string;
  cardId: string;
  grade: number;
  pulledAt: string;
  packId: string;
  serial: string;
  showcased?: boolean;
}

export interface PullRecord {
  id: string;
  user: string;
  cardId: string;
  rarity: Rarity;
  grade: number;
  value: number;
  packName: string;
  timestamp: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: string;
  avatarSeed: string;
  totalValue: number;
  bestPull: string;
  packsOpened: number;
}

export interface TokenBundle {
  id: string;
  tokens: number;
  bonusPct: number;
  priceUsd: number;
  badge?: string;
}

export const RARITY_ORDER: Rarity[] = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "grail",
];

export const RARITY_LABEL: Record<Rarity, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
  grail: "Grail",
};
