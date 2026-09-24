import { RARITY_LABEL, type Rarity } from "@/lib/types";
import { cn } from "@/lib/utils";

const STYLES: Record<Rarity, string> = {
  common: "bg-rarity-common/15 text-rarity-common border-rarity-common/30",
  uncommon: "bg-rarity-uncommon/15 text-rarity-uncommon border-rarity-uncommon/30",
  rare: "bg-rarity-rare/15 text-rarity-rare border-rarity-rare/30",
  epic: "bg-rarity-epic/15 text-rarity-epic border-rarity-epic/30",
  legendary: "bg-rarity-legendary/15 text-rarity-legendary border-rarity-legendary/30",
  grail:
    "bg-gradient-to-r from-rose-400/20 via-amber-300/20 to-violet-400/20 text-amber-200 border-amber-300/40",
};

export function RarityBadge({ rarity, className }: { rarity: Rarity; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
        STYLES[rarity],
        className
      )}
    >
      {RARITY_LABEL[rarity]}
    </span>
  );
}
