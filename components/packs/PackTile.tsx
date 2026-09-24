"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Pack3DLazy } from "@/components/three/Pack3DLazy";
import { TIER_THEME } from "./tierTheme";
import type { PackDef } from "@/lib/types";
import { formatTokens, cn } from "@/lib/utils";

export function PackTile({ pack, onViewOdds }: { pack: PackDef; onViewOdds: (pack: PackDef) => void }) {
  const theme = TIER_THEME[pack.tier];

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={cn("glass group relative flex flex-col overflow-hidden rounded-2xl ring-1", theme.ring)}
    >
      {pack.featured && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-accent-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-black">
          Featured
        </span>
      )}
      <div className="relative h-52 w-full">
        <Pack3DLazy colorA={theme.colorA} colorB={theme.colorB} className="h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-elevated via-transparent to-transparent" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: theme.colorA }}>
            {theme.label}
          </span>
          <h3 className="font-display text-lg font-bold leading-tight">{pack.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-fg-muted">{pack.description}</p>
        </div>

        <div className="mt-auto flex items-center justify-between text-sm">
          <div>
            <div className="font-mono text-base font-bold text-fg">{formatTokens(pack.price)} <span className="text-xs font-normal text-fg-muted">tokens</span></div>
            <div className="text-xs text-fg-muted">Top pull: <span className="font-semibold text-fg">{pack.topPull}</span></div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onViewOdds(pack)}
            className="flex-1 rounded-full border border-white/15 px-3 py-2 text-xs font-semibold text-fg-muted transition-colors hover:border-white/30 hover:text-fg"
          >
            View Odds
          </button>
          <Link
            href={pack.tier === "perfect-cut" ? "/perfect-cut" : `/rip/${pack.id}`}
            className="flex-1 rounded-full bg-gradient-to-r from-accent-violet to-accent-cyan px-3 py-2 text-center text-xs font-bold text-black transition-transform hover:scale-[1.03]"
          >
            Rip Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
