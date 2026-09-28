"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import type { TokenBundle } from "@/lib/types";
import { formatTokens, formatUsd } from "@/lib/utils";
import { createCheckoutSessionAction } from "@/app/actions/checkout";

export function TokenBundleCard({ bundle, highlighted }: { bundle: TokenBundle; highlighted?: boolean }) {
  const bonusTokens = Math.round((bundle.tokens * bundle.bonusPct) / 100);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function buy() {
    setError(null);
    startTransition(async () => {
      const res = await createCheckoutSessionAction(bundle.id);
      // A successful call redirects and never returns here.
      if (res && !res.ok) setError(res.error);
    });
  }

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
        onClick={buy}
        disabled={pending}
        className="mt-5 w-full rounded-full bg-white/10 py-2.5 text-sm font-semibold transition-colors hover:bg-gradient-to-r hover:from-accent-violet hover:to-accent-cyan hover:text-black disabled:opacity-60"
      >
        {pending ? "Redirecting to checkout…" : "Buy Bundle"}
      </button>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </motion.div>
  );
}
