"use client";

import { motion } from "framer-motion";
import { useTilt } from "@/hooks/useTilt";
import { PlaceholderArt } from "./PlaceholderArt";
import { RARITY_LABEL, type CardDef, type Rarity } from "@/lib/types";
import { cn } from "@/lib/utils";

const RARITY_BORDER: Record<Rarity, string> = {
  common: "border-rarity-common/60",
  uncommon: "border-rarity-uncommon/60",
  rare: "border-rarity-rare/60",
  epic: "border-rarity-epic/60",
  legendary: "border-rarity-legendary/60",
  grail: "border-transparent",
};

const RARITY_TEXT: Record<Rarity, string> = {
  common: "text-rarity-common",
  uncommon: "text-rarity-uncommon",
  rare: "text-rarity-rare",
  epic: "text-rarity-epic",
  legendary: "text-rarity-legendary",
  grail: "text-amber-300",
};

interface FoilCardProps {
  card: CardDef;
  interactive?: boolean;
  className?: string;
  showInfo?: boolean;
}

export function FoilCard({ card, interactive = true, className, showInfo = true }: FoilCardProps) {
  const { ref, tilt, handlers } = useTilt<HTMLDivElement>(12);
  const isGrail = card.rarity === "grail";

  return (
    <div
      ref={ref}
      {...(interactive ? handlers : {})}
      className={cn("group relative aspect-[5/7] select-none", className)}
      style={{ perspective: 900 }}
    >
      <motion.div
        animate={interactive ? { rotateX: tilt.rx, rotateY: tilt.ry } : {}}
        transition={{ type: "spring", stiffness: 260, damping: 22, mass: 0.6 }}
        className={cn(
          "relative h-full w-full overflow-hidden rounded-[10px] border-2 bg-bg-elevated shadow-[0_20px_40px_-16px_rgba(0,0,0,0.7)]",
          RARITY_BORDER[card.rarity],
          isGrail && "rarity-ring-grail"
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* art window */}
        <div className="relative h-[62%] w-full overflow-hidden border-b border-white/10 bg-black/40">
          <PlaceholderArt card={card} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-elevated via-transparent to-transparent" />
        </div>

        {/* info plate */}
        {showInfo && (
          <div className="flex h-[38%] flex-col justify-between p-2.5 sm:p-3">
            <div>
              <div className="flex items-center justify-between gap-1">
                <span className="truncate font-display text-[11px] font-bold leading-tight sm:text-xs">
                  {card.name}
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-wide text-fg-muted sm:text-[10px]">
                {card.species}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={cn("text-[9px] font-bold uppercase tracking-wider sm:text-[10px]", RARITY_TEXT[card.rarity])}>
                {RARITY_LABEL[card.rarity]}
              </span>
              <span className="font-mono text-[9px] text-fg-muted sm:text-[10px]">#{card.id.slice(0, 4).toUpperCase()}</span>
            </div>
          </div>
        )}

        {/* holographic foil sheen — CSS conic-gradient driven by pointer position */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 mix-blend-color-dodge"
          style={{
            opacity: interactive && tilt.active ? 0.55 : isGrail ? 0.35 : 0,
            background: `conic-gradient(from ${tilt.px * 360}deg at ${tilt.px * 100}% ${tilt.py * 100}%, #ff5f6d, #ffc371, #7afcff, #b46bff, #ff5f6d)`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-70"
          style={{
            background: `linear-gradient(${115 + tilt.ry * 2}deg, transparent 30%, rgba(255,255,255,0.9) 48%, transparent 62%)`,
          }}
        />

        {/* glass edge highlight */}
        <div className="pointer-events-none absolute inset-0 rounded-[10px] ring-1 ring-inset ring-white/10" />
      </motion.div>
    </div>
  );
}
