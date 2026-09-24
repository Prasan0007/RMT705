"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PackTile } from "@/components/packs/PackTile";
import { OddsModal } from "@/components/packs/OddsModal";
import { TIER_THEME } from "@/components/packs/tierTheme";
import { PACKS } from "@/lib/odds";
import type { PackDef, PackTierId } from "@/lib/types";

const TIERS: PackTierId[] = ["starter", "mid", "high-roller", "grail-hunter"];

export default function PackShopPage() {
  const [oddsPack, setOddsPack] = useState<PackDef | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-accent-cyan">Pack Shop</div>
        <h1 className="font-display text-3xl font-black sm:text-4xl">Pick your tier</h1>
        <p className="mx-auto mt-3 max-w-lg text-fg-muted">
          Every pack&apos;s odds are published in full — tap View Odds before you rip.
        </p>
      </motion.div>

      <div className="flex flex-col gap-14">
        {TIERS.map((tier) => {
          const theme = TIER_THEME[tier];
          const packs = PACKS.filter((p) => p.tier === tier);
          return (
            <section key={tier}>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: theme.colorA }} />
                <h2 className="font-display text-xl font-bold">{theme.label}</h2>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {packs.map((pack) => (
                  <PackTile key={pack.id} pack={pack} onViewOdds={setOddsPack} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <OddsModal pack={oddsPack} onClose={() => setOddsPack(null)} />
    </div>
  );
}
