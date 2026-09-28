"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useUiStore } from "@/lib/store";
import { cardById } from "@/lib/card-catalog";
import { RARITY_LABEL } from "@/lib/types";
import { RarityDot } from "@/components/common/GlassPanel";
import { cn } from "@/lib/utils";

/** On-screen overlay shown only in Streamer Mode: a running pull-history rail
 * viewers can watch without seeing the streamer's private token balance. */
export function StreamerOverlay() {
  const streamerMode = useUiStore((s) => s.streamerMode);
  const chromaKey = useUiStore((s) => s.chromaKey);
  const toggleChromaKey = useUiStore((s) => s.toggleChromaKey);
  const history = useUiStore((s) => s.ripHistory);

  if (!streamerMode) return null;

  return (
    <>
      <div className="pointer-events-none fixed bottom-4 left-4 z-40 flex max-w-[280px] flex-col gap-2 sm:bottom-6 sm:left-6">
        <div className="glass pointer-events-auto flex items-center justify-between gap-2 rounded-xl px-3 py-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-accent-cyan">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-cyan" />
            Streamer Mode
          </span>
          <button
            onClick={toggleChromaKey}
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
              chromaKey ? "bg-emerald-400/20 text-emerald-300" : "bg-white/10 text-fg-muted"
            )}
          >
            Chroma {chromaKey ? "On" : "Off"}
          </button>
        </div>

        <div className="glass max-h-64 overflow-hidden rounded-xl p-2">
          <div className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wide text-fg-muted">
            Pull History
          </div>
          <div className="flex flex-col gap-1">
            <AnimatePresence initial={false}>
              {history.length === 0 && (
                <div className="px-1 py-2 text-xs text-fg-muted">Rip a pack to populate the overlay.</div>
              )}
              {history.slice(0, 6).map((h) => {
                const card = cardById(h.cardId);
                return (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-between gap-2 rounded-lg bg-white/5 px-2 py-1.5 text-xs"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <RarityDot rarity={card.rarity} />
                      <span className="truncate font-medium">{card.name}</span>
                    </span>
                    <span className="shrink-0 text-fg-muted">{RARITY_LABEL[card.rarity]} · {h.grade.toFixed(1)}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
