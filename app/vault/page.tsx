"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { VaultCard } from "@/components/vault/VaultCard";
import { ShipModal } from "@/components/vault/ShipModal";
import { useAppStore } from "@/lib/store";
import { cardById } from "@/lib/card-catalog";
import { RARITY_LABEL, RARITY_ORDER, type Rarity, type VaultItem } from "@/lib/types";
import { formatTokens, cn } from "@/lib/utils";

type SortKey = "recent" | "value" | "grade";

export default function VaultPage() {
  const vault = useAppStore((s) => s.vault);
  const streamerMode = useAppStore((s) => s.streamerMode);
  const [rarityFilter, setRarityFilter] = useState<Rarity | "all">("all");
  const [sort, setSort] = useState<SortKey>("recent");
  const [shipItem, setShipItem] = useState<VaultItem | null>(null);

  const enriched = useMemo(
    () => vault.map((item) => ({ item, card: cardById(item.cardId) })),
    [vault]
  );

  const totalValue = useMemo(
    () => enriched.reduce((sum, { item, card }) => sum + Math.round(card.value * (0.55 + item.grade / 40)), 0),
    [enriched]
  );

  const filtered = useMemo(() => {
    let list = enriched;
    if (rarityFilter !== "all") list = list.filter(({ card }) => card.rarity === rarityFilter);
    list = [...list].sort((a, b) => {
      if (sort === "value") return b.card.value - a.card.value;
      if (sort === "grade") return b.item.grade - a.item.grade;
      return new Date(b.item.pulledAt).getTime() - new Date(a.item.pulledAt).getTime();
    });
    return list;
  }, [enriched, rarityFilter, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-accent-cyan">Vault</div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-3xl font-black sm:text-4xl">Your collection</h1>
          {!streamerMode && (
            <div className="glass rounded-2xl px-5 py-3 text-right">
              <div className="text-[11px] uppercase tracking-wide text-fg-muted">Estimated value</div>
              <div className="font-mono text-xl font-bold text-gradient">{formatTokens(totalValue)} tokens</div>
            </div>
          )}
        </div>
      </motion.div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setRarityFilter("all")}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold",
              rarityFilter === "all" ? "bg-white text-black" : "bg-white/10 text-fg-muted hover:text-fg"
            )}
          >
            All
          </button>
          {RARITY_ORDER.map((r) => (
            <button
              key={r}
              onClick={() => setRarityFilter(r)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold",
                rarityFilter === r ? "bg-white text-black" : "bg-white/10 text-fg-muted hover:text-fg"
              )}
            >
              {RARITY_LABEL[r]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-fg-muted">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs font-semibold outline-none"
          >
            <option value="recent">Most recent</option>
            <option value="value">Highest value</option>
            <option value="grade">Highest grade</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center text-fg-muted">
          No cards match this filter yet. Go rip a pack.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map(({ item }) => (
            <VaultCard key={item.instanceId} item={item} onShip={setShipItem} />
          ))}
        </div>
      )}

      <ShipModal item={shipItem} onClose={() => setShipItem(null)} />
    </div>
  );
}
