"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { FoilCard } from "@/components/cards/FoilCard";
import { RarityBadge } from "@/components/cards/RarityBadge";
import { cardById } from "@/lib/card-catalog";
import { sellBackOffer } from "@/lib/pricing";
import { sellBackAction, toggleShowcaseAction } from "@/app/actions/vault";
import { formatTokens } from "@/lib/utils";
import { TimeAgo } from "@/components/common/TimeAgo";

export interface VaultItemView {
  id: string;
  cardId: string;
  grade: number;
  serial: string;
  pulledAt: string;
  showcased: boolean;
  status: "VAULTED" | "SHIP_REQUESTED" | "SHIPPED" | "SOLD";
}

export function VaultCard({ item, onShip }: { item: VaultItemView; onShip: (item: VaultItemView) => void }) {
  const card = cardById(item.cardId);
  const [confirmingSell, setConfirmingSell] = useState(false);
  const [pending, startTransition] = useTransition();
  const [sold, setSold] = useState(false);
  const [showcased, setShowcased] = useState(item.showcased);

  const offer = sellBackOffer(card.value, item.grade);
  const canAct = item.status === "VAULTED" && !sold;

  function handleSell() {
    startTransition(async () => {
      const res = await sellBackAction(item.id);
      if (res.ok) setSold(true);
      setConfirmingSell(false);
    });
  }

  function handleShowcase() {
    setShowcased((s) => !s); // optimistic
    startTransition(async () => {
      await toggleShowcaseAction(item.id);
    });
  }

  if (sold) return null;

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

      {item.status !== "VAULTED" && (
        <div className="mt-2 rounded-lg bg-white/5 px-2 py-1.5 text-center text-[11px] font-semibold text-fg-muted">
          {item.status === "SHIP_REQUESTED" ? "Shipment requested" : item.status === "SHIPPED" ? "Shipped" : ""}
        </div>
      )}

      {canAct && !confirmingSell && (
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          <button
            onClick={() => onShip(item)}
            disabled={pending}
            className="rounded-lg bg-white/10 py-2 text-[11px] font-semibold hover:bg-white/15 disabled:opacity-50"
          >
            Ship
          </button>
          <button
            onClick={() => setConfirmingSell(true)}
            disabled={pending}
            className="rounded-lg bg-white/10 py-2 text-[11px] font-semibold hover:bg-white/15 disabled:opacity-50"
          >
            Sell Back
          </button>
          <button
            onClick={handleShowcase}
            disabled={pending}
            className={`rounded-lg py-2 text-[11px] font-semibold disabled:opacity-50 ${
              showcased ? "bg-accent-gold text-black" : "bg-white/10 hover:bg-white/15"
            }`}
          >
            {showcased ? "Showcased" : "Showcase"}
          </button>
        </div>
      )}

      {canAct && confirmingSell && (
        <div className="mt-3 rounded-lg bg-black/30 p-2.5">
          <p className="text-center text-xs text-fg-muted">
            Sell for <span className="font-mono font-bold text-accent-gold">{formatTokens(offer)}</span> tokens?
          </p>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setConfirmingSell(false)}
              disabled={pending}
              className="rounded-lg bg-white/10 py-1.5 text-[11px] font-semibold hover:bg-white/15 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSell}
              disabled={pending}
              className="rounded-lg bg-gradient-to-r from-accent-violet to-accent-cyan py-1.5 text-[11px] font-bold text-black disabled:opacity-50"
            >
              {pending ? "…" : "Confirm"}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
