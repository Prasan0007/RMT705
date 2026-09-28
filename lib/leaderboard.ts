import { db } from "./db";
import { cardById } from "./card-catalog";
import { sellBackOffer } from "./pricing";
import { getPack } from "./odds";
import type { LeaderboardEntry, PullRecord } from "./types";

function windowStart(range: "today" | "week"): Date {
  const now = Date.now();
  const ms = range === "today" ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
  return new Date(now - ms);
}

/** Real aggregate leaderboard from actual pulls — no fabricated entries. */
export async function getLeaderboard(range: "today" | "week"): Promise<LeaderboardEntry[]> {
  const items = await db.vaultItem.findMany({
    where: { pulledAt: { gte: windowStart(range) } },
    include: { user: { select: { name: true } } },
  });

  interface Agg {
    name: string;
    totalValue: number;
    count: number;
    bestPull: string;
    bestValue: number;
  }

  const byUser = new Map<string, Agg>();
  for (const item of items) {
    const card = cardById(item.cardId);
    const value = sellBackOffer(card.value, item.grade);
    const entry = byUser.get(item.userId) ?? {
      name: item.user.name,
      totalValue: 0,
      count: 0,
      bestPull: "",
      bestValue: -1,
    };
    entry.totalValue += value;
    entry.count += 1;
    if (value > entry.bestValue) {
      entry.bestValue = value;
      entry.bestPull = card.name;
    }
    byUser.set(item.userId, entry);
  }

  return Array.from(byUser.entries())
    .sort((a, b) => b[1].totalValue - a[1].totalValue)
    .slice(0, 10)
    .map(([userId, e], i) => ({
      rank: i + 1,
      user: e.name,
      avatarSeed: userId,
      totalValue: e.totalValue,
      bestPull: e.bestPull,
      packsOpened: e.count,
    }));
}

/** Most recent real pulls, in chronological order — for the landing ticker. */
export async function getRecentPulls(limit = 10): Promise<PullRecord[]> {
  const items = await db.vaultItem.findMany({
    orderBy: { pulledAt: "desc" },
    take: limit,
    include: { user: { select: { name: true } } },
  });

  return items.map((item) => {
    const card = cardById(item.cardId);
    return {
      id: item.id,
      user: item.user.name,
      cardId: item.cardId,
      rarity: card.rarity,
      grade: item.grade,
      value: sellBackOffer(card.value, item.grade),
      packName: getPack(item.packId)?.name ?? item.packId,
      timestamp: item.pulledAt.toISOString(),
    };
  });
}

/** Biggest real pulls recently, ranked by sell-back value. */
export async function getRecentBigPulls(limit = 10): Promise<PullRecord[]> {
  const items = await db.vaultItem.findMany({
    orderBy: { pulledAt: "desc" },
    take: 300,
    include: { user: { select: { name: true } } },
  });

  const withValue: PullRecord[] = items.map((item) => {
    const card = cardById(item.cardId);
    return {
      id: item.id,
      user: item.user.name,
      cardId: item.cardId,
      rarity: card.rarity,
      grade: item.grade,
      value: sellBackOffer(card.value, item.grade),
      packName: getPack(item.packId)?.name ?? item.packId,
      timestamp: item.pulledAt.toISOString(),
    };
  });

  return withValue.sort((a, b) => b.value - a.value).slice(0, limit);
}
