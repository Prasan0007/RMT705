"use client";

import { AnimatePresence, motion } from "framer-motion";
import { buildOddsTable } from "@/lib/odds";
import { RARITY_LABEL, type PackDef } from "@/lib/types";
import { RarityDot } from "@/components/common/GlassPanel";
import { ProvablyFairBadge } from "@/components/common/ProvablyFairBadge";
import { formatTokens } from "@/lib/utils";

export function OddsModal({ pack, onClose }: { pack: PackDef | null; onClose: () => void }) {
  const table = pack ? buildOddsTable(pack) : [];

  return (
    <AnimatePresence>
      {pack && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="glass w-full max-w-md rounded-t-3xl p-5 sm:rounded-3xl sm:p-6"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl font-bold">{pack.name}</h3>
                <p className="text-sm text-fg-muted">Full odds — {pack.cardsPerPack} cards per pack, {formatTokens(pack.price)} tokens</p>
              </div>
              <button onClick={onClose} className="rounded-full bg-white/10 p-2 text-fg-muted hover:text-fg">
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {table.map((entry) => (
                <div key={entry.rarity} className="flex items-center justify-between rounded-xl bg-white/[0.04] px-3.5 py-2.5">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <RarityDot rarity={entry.rarity} />
                    {RARITY_LABEL[entry.rarity]}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-fg-muted">{entry.cardIds.length} cards</span>
                    <span className="font-mono text-sm font-bold">{(entry.probability * 100).toFixed(2)}%</span>
                  </div>
                </div>
              ))}
            </div>

            {pack.guaranteedMinRarity && (
              <p className="mt-3 text-xs text-fg-muted">
                Guaranteed: every pack contains at least one {RARITY_LABEL[pack.guaranteedMinRarity]}+ card.
              </p>
            )}

            <div className="mt-4">
              <ProvablyFairBadge />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
