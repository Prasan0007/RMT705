"use client";

import { motion } from "framer-motion";
import { PRECISION_TIERS, buildTierOddsTable } from "@/lib/perfect-cut";
import { RARITY_LABEL } from "@/lib/types";
import { RarityDot } from "@/components/common/GlassPanel";
import { cn } from "@/lib/utils";

const TIER_STYLE: Record<string, string> = {
  elite: "ring-amber-300/60 bg-gradient-to-b from-amber-400/10 to-transparent",
  premium: "ring-violet-400/40",
  standard: "ring-white/10",
};

export function PrizeTables({ highlightTier }: { highlightTier?: string | null }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {PRECISION_TIERS.map((tier, i) => {
        const table = buildTierOddsTable(tier);
        const active = highlightTier === tier.id;
        return (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, scale: active ? 1.03 : 1 }}
            transition={{ delay: i * 0.08 }}
            className={cn("glass rounded-2xl p-5 ring-1", TIER_STYLE[tier.id], active && "ring-2 ring-accent-gold")}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">{tier.label}</h3>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-fg-muted">
                {tier.minPrecision}%+
              </span>
            </div>
            <p className="mt-1 text-xs text-fg-muted">{tier.blurb}</p>
            <div className="mt-4 flex flex-col gap-1.5">
              {table.map((entry) => (
                <div key={entry.rarity} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5">
                    <RarityDot rarity={entry.rarity} />
                    {RARITY_LABEL[entry.rarity]}
                  </span>
                  <span className="font-mono font-semibold">{(entry.probability * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
