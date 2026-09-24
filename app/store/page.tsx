"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TokenBundleCard } from "@/components/store/TokenBundleCard";
import { CheckoutModal } from "@/components/store/CheckoutModal";
import { TOKEN_BUNDLES } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { TokenOdometer } from "@/components/common/TokenOdometer";
import type { TokenBundle } from "@/lib/types";

export default function TokenStorePage() {
  const [selected, setSelected] = useState<TokenBundle | null>(null);
  const tokens = useAppStore((s) => s.tokens);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-accent-cyan">Token Store</div>
        <h1 className="font-display text-3xl font-black sm:text-4xl">Fuel your next rip</h1>
        <p className="mx-auto mt-3 max-w-lg text-fg-muted">
          Tokens never expire and carry across every pack tier. Bigger bundles unlock a bonus.
        </p>
        <div className="glass mx-auto mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-accent-gold" />
          <span className="text-sm text-fg-muted">Current balance</span>
          <span className="font-mono text-sm font-bold">
            <TokenOdometer value={tokens} />
          </span>
        </div>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TOKEN_BUNDLES.map((bundle, i) => (
          <motion.div
            key={bundle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <TokenBundleCard
              bundle={bundle}
              highlighted={bundle.badge === "Best Value"}
              onSelect={() => setSelected(bundle)}
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {[
          { title: "Instant delivery", body: "Tokens land in your balance the moment checkout completes." },
          { title: "No expiration", body: "Spend them today or save up for a Grail Hunter pack." },
          { title: "Secure checkout", body: "This demo simulates payment — nothing is charged." },
        ].map((f) => (
          <div key={f.title} className="glass rounded-2xl p-5">
            <h3 className="font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-fg-muted">{f.body}</p>
          </div>
        ))}
      </div>

      <CheckoutModal bundle={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
