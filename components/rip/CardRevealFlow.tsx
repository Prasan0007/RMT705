"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FoilCard } from "@/components/cards/FoilCard";
import { GradedSlab } from "@/components/cards/GradedSlab";
import { RarityBadge } from "@/components/cards/RarityBadge";
import { ParticleBurst } from "@/components/effects/ParticleBurst";
import { Shockwave } from "@/components/effects/Shockwave";
import { playChime, playCrowdRoar } from "@/lib/sound";
import type { CardDef, Rarity } from "@/lib/types";
import { cn } from "@/lib/utils";

const RARITY_GLOW: Record<Rarity, string> = {
  common: "#b9c0cc",
  uncommon: "#3ddc84",
  rare: "#3d9bfa",
  epic: "#b46bff",
  legendary: "#f5c451",
  grail: "#ffc371",
};

const RARITY_PARTICLES: Record<Rarity, string[]> = {
  common: ["#b9c0cc", "#ffffff"],
  uncommon: ["#3ddc84", "#ffffff"],
  rare: ["#3d9bfa", "#7afcff"],
  epic: ["#b46bff", "#ff5f6d"],
  legendary: ["#f5c451", "#ffc371", "#ffffff"],
  grail: ["#ff5f6d", "#ffc371", "#7afcff", "#b46bff"],
};

type SlotPhase = "stacked" | "suspense" | "flipping" | "revealed" | "settled";

interface RevealItem {
  card: CardDef;
  grade: number;
  serial: string;
}

export function CardRevealFlow({
  items,
  packName,
  onAllRevealed,
  enlarged = false,
}: {
  items: RevealItem[];
  packName: string;
  onAllRevealed: () => void;
  enlarged?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<SlotPhase>("stacked");
  const [burstKey, setBurstKey] = useState(0);
  const [flashKey, setFlashKey] = useState(0);
  const [shockwave, setShockwave] = useState(false);

  const current = items[index];
  const isBigRarity = current && (current.card.rarity === "epic" || current.card.rarity === "legendary" || current.card.rarity === "grail");
  const isGrail = current?.card.rarity === "grail";
  const remaining = items.length - index;

  function begin() {
    if (!current) return;
    if (isBigRarity) {
      setPhase("suspense");
      const suspenseMs = current.card.rarity === "grail" ? 1900 : 1300;
      setTimeout(() => flip(), suspenseMs);
    } else {
      flip();
    }
  }

  function flip() {
    setPhase("flipping");
    const flipDelay = current.card.rarity === "grail" ? 900 : 500;
    setTimeout(() => {
      setPhase("revealed");
      setFlashKey((k) => k + 1);
      setBurstKey((k) => k + 1);
      playChime(current.card.rarity);
      if (current.card.rarity === "grail") {
        setShockwave(true);
        playCrowdRoar();
        setTimeout(() => setShockwave(false), 1400);
      }
    }, flipDelay);
  }

  function continueNext() {
    setPhase("settled");
    setTimeout(() => {
      if (index + 1 >= items.length) {
        onAllRevealed();
      } else {
        setIndex((i) => i + 1);
        setPhase("stacked");
      }
    }, 250);
  }

  return (
    <div className="relative flex min-h-[560px] flex-col items-center justify-center px-4 py-10">
      {/* progress dots */}
      <div className="mb-6 flex items-center gap-1.5">
        {items.map((it, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 w-6 rounded-full transition-colors",
              i < index ? "bg-white/70" : i === index ? "bg-accent-cyan" : "bg-white/15"
            )}
          />
        ))}
      </div>

      {/* suspense dim overlay */}
      <AnimatePresence>
        {phase === "suspense" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black"
          />
        )}
      </AnimatePresence>

      {/* flash flare on flip */}
      <AnimatePresence>
        {phase === "revealed" && (
          <motion.div
            key={flashKey}
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            transition={{ duration: isGrail ? 1 : 0.5 }}
            className="pointer-events-none fixed inset-0 z-40"
            style={{ background: `radial-gradient(circle at 50% 45%, white, ${RARITY_GLOW[current.card.rarity]}55, transparent 70%)` }}
          />
        )}
      </AnimatePresence>

      <Shockwave active={shockwave} />

      <div className={cn("relative z-50 flex w-full flex-col items-center", enlarged ? "max-w-lg" : "max-w-sm")}>
        <div className={cn("relative w-full", enlarged ? "max-w-[380px]" : "max-w-[260px]")} style={{ perspective: 1200 }}>
          <ParticleBurst
            trigger={burstKey}
            colors={RARITY_PARTICLES[current?.card.rarity ?? "common"]}
            count={current?.card.rarity === "grail" ? 160 : 80}
            power={current?.card.rarity === "grail" ? 1.8 : 1.1}
            className="!fixed !inset-0 z-30"
          />

          <AnimatePresence mode="wait">
            {phase !== "revealed" && phase !== "settled" && (
              <motion.div
                key={`facedown-${index}`}
                className="relative aspect-[5/7] w-full cursor-pointer"
                onClick={phase === "stacked" ? begin : undefined}
                animate={
                  phase === "suspense"
                    ? { x: [0, -6, 6, -4, 4, 0], scale: [1, 1.03, 1] }
                    : phase === "flipping"
                      ? { rotateY: 180 }
                      : { rotateY: 0 }
                }
                transition={
                  phase === "suspense"
                    ? { duration: 0.5, repeat: 2 }
                    : { duration: current?.card.rarity === "grail" ? 1.1 : 0.6, ease: [0.45, 0, 0.3, 1] }
                }
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className={cn(
                    "flex h-full w-full items-center justify-center rounded-xl border-2 bg-gradient-to-br from-bg-elevated to-black",
                    phase === "suspense" ? "border-transparent" : "border-white/15"
                  )}
                  style={
                    phase === "suspense"
                      ? { boxShadow: `0 0 0 2px ${RARITY_GLOW[current.card.rarity]}, 0 0 60px 6px ${RARITY_GLOW[current.card.rarity]}99` }
                      : undefined
                  }
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent-violet to-accent-cyan text-lg font-black text-black">
                    F
                  </div>
                </div>
              </motion.div>
            )}

            {(phase === "revealed" || phase === "settled") && (
              <motion.div
                key={`front-${index}`}
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <FoilCard card={current.card} className="w-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-5 min-h-[28px] text-center">
          {phase === "stacked" && (
            <p className="text-sm text-fg-muted">
              Tap to flip · {remaining} card{remaining > 1 ? "s" : ""} left
            </p>
          )}
          {phase === "suspense" && (
            <p className="animate-pulse text-sm font-semibold" style={{ color: RARITY_GLOW[current.card.rarity] }}>
              Something big is coming…
            </p>
          )}
        </div>

        <AnimatePresence>
          {(phase === "revealed" || phase === "settled") && current && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-6 flex w-full flex-col items-center"
            >
              <RarityBadge rarity={current.card.rarity} className="mb-3" />
              <GradedSlab card={current.card} grade={current.grade} serial={current.serial} />
              <button
                onClick={continueNext}
                className="mt-6 rounded-full bg-white/10 px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-gradient-to-r hover:from-accent-violet hover:to-accent-cyan hover:text-black"
              >
                {index + 1 >= items.length ? "See Summary" : "Next Card"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-2 text-xs text-fg-muted">{packName}</p>
    </div>
  );
}
