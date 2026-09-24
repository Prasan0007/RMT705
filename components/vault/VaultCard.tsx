"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FoilCard } from "@/components/cards/FoilCard";
import { RarityBadge } from "@/components/cards/RarityBadge";
import { cardById } from "@/lib/card-catalog";
import { sellBackOffer, useAppStore } from "@/lib/store";
import { formatTokens } from "@/lib/utils";
import { TimeAgo } from "@/components/common/TimeAgo";
import type { VaultItem } from "@/lib/types";

export function VaultCard({ item, onShip }: { item: VaultItem; onShip: (item: VaultItem) => void }) {
  const card = cardById(item.cardId);
  const sellBack = useAppStore((s) => s.sellBack);
  const toggleShowcase = useAppStore((s) => s.toggleShowcase);
  const [confirmingSell, setConfirmingSell] = useState(false);

  const offer = sellBackOffer(card.value, item.grade);

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass flex flex-col rounded-2xl p-3">
      <FoilCard card={card} className="w-full" />

      <div className="mt-3 flex items-center justify-between">
        <RarityBadge rarity={card.rarity} />
        <span className="font-mono text-sm font-bold">{item.grade.toFixed(1)}</span>
      </div>

      <div className="mt-1 flex items-center justify-between text-[11px] text-fg-muted">
        <span>{item.serial}</span>
        <span><TimeAgo iso={item.pulledAt} /></span>
      </div>

      {!confirmingSell ? (
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          <button
            onClick={() => onShip(item)}
            className="rounded-lg bg-white/10 py-2 text-[11px] font-semibold hover:bg-white/15"
          >
            Ship
          </button>
          <button
            onClick={() => setConfirmingSell(true)}
            className="rounded-lg bg-white/10 py-2 text-[11px] font-semibold hover:bg-white/15"
          >
            Sell Back
          </button>
          <button
            onClick={() => toggleShowcase(item.instanceId)}
            className={`rounded-lg py-2 text-[11px] font-semibold ${
              item.showcased ? "bg-accent-gold text-black" : "bg-white/10 hover:bg-white/15"
            }`}
          >
            {item.showcased ? "Showcased" : "Showcase"}
          </button>
        </div>
      ) : (
        <div className="mt-3 rounded-lg bg-black/30 p-2.5">
          <p className="text-center text-xs text-fg-muted">
            Sell for <span className="font-mono font-bold text-accent-gold">{formatTokens(offer)}</span> tokens?
          </p>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setConfirmingSell(false)}
              className="rounded-lg bg-white/10 py-1.5 text-[11px] font-semibold hover:bg-white/15"
            >
              Cancel
            </button>
            <button
              onClick={() => sellBack(item.instanceId)}
              className="rounded-lg bg-gradient-to-r from-accent-violet to-accent-cyan py-1.5 text-[11px] font-bold text-black"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
