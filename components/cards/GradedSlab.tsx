"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { FoilCard } from "./FoilCard";
import { RarityBadge } from "./RarityBadge";
import type { CardDef } from "@/lib/types";

function GradeCounter({ target }: { target: number }) {
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState("0.0");
  const rounded = useTransform(mv, (v) => v.toFixed(1));

  useEffect(() => {
    const unsub = rounded.on("change", setDisplay);
    const controls = animate(mv, target, { duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] });
    return () => {
      unsub();
      controls.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return <span>{display}</span>;
}

/** PSA-style graded slab case the pulled card slides into on reveal. */
export function GradedSlab({ card, grade, serial }: { card: CardDef; grade: number; serial?: string }) {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0, scale: 0.92 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 140, damping: 18 }}
      className="relative mx-auto w-full max-w-[280px] rounded-[18px] border border-white/15 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-3 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur"
    >
      <div className="mb-2 flex items-center justify-between rounded-lg bg-black/40 px-2.5 py-1.5">
        <div className="font-display text-[10px] font-bold tracking-widest text-fg-muted">FOILFALL GRADING</div>
        <div className="font-mono text-[9px] text-fg-muted">{serial ?? "FF-PENDING"}</div>
      </div>

      <div className="rounded-lg border border-white/10 bg-black/30 p-2">
        <FoilCard card={card} interactive className="max-w-[220px]" />
      </div>

      <div className="mt-2.5 flex items-center justify-between px-1">
        <RarityBadge rarity={card.rarity} />
        <div className="text-right">
          <div className="font-display text-2xl font-black leading-none text-gradient">
            <GradeCounter target={grade} />
          </div>
          <div className="text-[9px] uppercase tracking-widest text-fg-muted">Grade / 10</div>
        </div>
      </div>
    </motion.div>
  );
}
