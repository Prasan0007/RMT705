import packsConfig from "./packs-config.json";
import { CARD_CATALOG, cardsByRarity } from "./card-catalog";
import { mulberry32, seedFromString, weightedPick } from "./rng";
import { RARITY_ORDER, type CardDef, type OddsEntry, type PackDef, type Rarity } from "./types";

/**
 * Single source of truth for every pack's rarity weights. The odds table
 * shown in the UI and the pull simulator both read from this file, so what
 * players see always matches what actually resolves a rip.
 */
export const PACKS: PackDef[] = packsConfig.packs as PackDef[];

export function getPack(id: string): PackDef | undefined {
  return PACKS.find((p) => p.id === id);
}

export function packsByTier(tier: PackDef["tier"]): PackDef[] {
  return PACKS.filter((p) => p.tier === tier);
}

/** Builds the odds table for a pack, normalized weights included. */
export function buildOddsTable(pack: PackDef): OddsEntry[] {
  const total = Object.values(pack.weights).reduce((a, b) => a + (b ?? 0), 0);
  return RARITY_ORDER.filter((r) => (pack.weights[r] ?? 0) > 0).map((rarity) => {
    const weight = pack.weights[rarity] ?? 0;
    return {
      rarity,
      weight,
      probability: total > 0 ? weight / total : 0,
      cardIds: cardsByRarity(rarity).map((c) => c.id),
    };
  });
}

export interface SeededPull {
  cards: CardDef[];
  seedHash: string;
  seed: string;
}

/** Draws `pack.cardsPerPack` cards using the pack's weight table and a seed. */
export function simulatePull(pack: PackDef, seed: string): CardDef[] {
  const rand = mulberry32(seedFromString(seed));
  const table = buildOddsTable(pack);
  const pulls: CardDef[] = [];

  for (let i = 0; i < pack.cardsPerPack; i++) {
    let entries = table;
    // Guarantee the floor rarity on the final slot if nothing has hit it yet.
    if (
      pack.guaranteedMinRarity &&
      i === pack.cardsPerPack - 1 &&
      !pulls.some((c) => rarityIndex(c.rarity) >= rarityIndex(pack.guaranteedMinRarity!))
    ) {
      const floor = rarityIndex(pack.guaranteedMinRarity);
      entries = table.filter((e) => rarityIndex(e.rarity) >= floor);
    }

    const rarity = weightedPick(
      entries.map((e) => ({ item: e.rarity, weight: e.weight })),
      rand
    );
    const pool = cardsByRarity(rarity);
    const card = weightedPick(
      pool.map((c) => ({ item: c, weight: 1 })),
      rand
    );
    pulls.push(card);
  }

  return pulls;
}

function rarityIndex(r: Rarity): number {
  return RARITY_ORDER.indexOf(r);
}

/** Deterministic placeholder grade — real grading would live server-side. */
export function gradeForCard(card: CardDef, seed: string): number {
  const rand = mulberry32(seedFromString(seed + card.id + "grade"));
  const floor = rarityIndex(card.rarity) >= rarityIndex("epic") ? 8 : 6;
  const roll = floor + rand() * (10 - floor);
  return Math.round(roll * 10) / 10;
}

export { CARD_CATALOG };
