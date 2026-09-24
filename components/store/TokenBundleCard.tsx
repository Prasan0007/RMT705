"use client";

import { motion } from "framer-motion";
import type { TokenBundle } from "@/lib/types";
import { formatTokens, formatUsd } from "@/lib/utils";

export function TokenBundleCard({
  bundle,
  onSelect,
  highlighted,
}: {
  bundle: TokenBundle;
  onSelect: () => void;
  highlighted?: boolean;
}) {
  const bonusTokens = Math.round((bundle.tokens * bundle.bonusPct) / 100);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`glass relative flex flex-col items-center rounded-2xl p-6 text-center ${
        highlighted ? "ring-2 ring-accent-gold" : "ring-1 ring-white/10"
      }`}
    >
      {bundle.badge && (
        <span className="absolute -top-3 rounded-full bg-gradient-to-r from-accent-violet to-accent-cyan px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-black">
          {bundle.badge}
        </span>
      )}
      <div className="font-display text-3xl font-black">{formatTokens(bundle.tokens)}</div>
      <div className="text-xs uppercase tracking-widest text-fg-muted">tokens</div>

      {bundle.bonusPct > 0 && (
        <div className="mt-3 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          +{bundle.bonusPct}% bonus · +{formatTokens(bonusTokens)}
        </div>
      )}

      <div className="mt-5 font-mono text-xl font-bold">{formatUsd(bundle.priceUsd)}</div>

      <button
        onClick={onSelect}
        className="mt-5 w-full rounded-full bg-white/10 py-2.5 text-sm font-semibold transition-colors hover:bg-gradient-to-r hover:from-accent-violet hover:to-accent-cyan hover:text-black"
      >
        Buy Bundle
      </button>
    </motion.div>
  );
}
