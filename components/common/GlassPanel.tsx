import { cn } from "@/lib/utils";

export function GlassPanel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("glass rounded-2xl", className)}>{children}</div>;
}

export function RarityDot({ rarity }: { rarity: string }) {
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        rarity === "common" && "bg-rarity-common",
        rarity === "uncommon" && "bg-rarity-uncommon",
        rarity === "rare" && "bg-rarity-rare",
        rarity === "epic" && "bg-rarity-epic",
        rarity === "legendary" && "bg-rarity-legendary",
        rarity === "grail" && "rarity-ring-grail"
      )}
    />
  );
}
