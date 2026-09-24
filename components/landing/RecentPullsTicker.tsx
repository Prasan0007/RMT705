"use client";

import { RECENT_PULLS } from "@/lib/mock-data";
import { cardById } from "@/lib/card-catalog";
import { RARITY_LABEL } from "@/lib/types";
import { RarityDot } from "@/components/common/GlassPanel";
import { formatTokens } from "@/lib/utils";

export function RecentPullsTicker() {
  const items = [...RECENT_PULLS, ...RECENT_PULLS];

  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] bg-white/[0.02] py-3">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent" />
      <div className="animate-marquee flex w-max gap-3">
        {items.map((pull, i) => {
          const card = cardById(pull.cardId);
          return (
            <div
              key={`${pull.id}-${i}`}
              className="glass flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs"
            >
              <RarityDot rarity={pull.rarity} />
              <span className="font-semibold text-fg">{pull.user}</span>
              <span className="text-fg-muted">pulled</span>
              <span className="font-semibold">{card.name}</span>
              <span className="text-fg-muted">·</span>
              <span className="text-fg-muted">{RARITY_LABEL[pull.rarity]}</span>
              <span className="text-fg-muted">·</span>
              <span className="font-semibold text-accent-gold">{formatTokens(pull.value)} tok</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
