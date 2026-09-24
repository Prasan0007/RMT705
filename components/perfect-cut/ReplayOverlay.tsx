"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { CutLine, PrecisionResult } from "@/lib/perfect-cut";

/** Slow-motion replay: draws the player's swipe over the true line so they
 * can see exactly where they landed, then counts up the precision score. */
export function ReplayOverlay({
  trueLine,
  userLine,
  result,
  onDone,
}: {
  trueLine: CutLine;
  userLine: CutLine;
  result: PrecisionResult;
  onDone: () => void;
}) {
  const [showScore, setShowScore] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setShowScore(true), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!showScore) return;
    const duration = 900;
    const start = performance.now();
    let raf = 0;
    function tick(now: number) {
      const p = Math.min(1, (now - start) / duration);
      setCount(Math.round(p * result.precision));
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [showScore, result.precision]);

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center px-4 text-center">
      <div className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-fg-muted">Slow-motion replay</div>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/60">
        <svg viewBox="0 0 1 1" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <motion.line
            x1={trueLine.x1}
            y1={trueLine.y1}
            x2={trueLine.x2}
            y2={trueLine.y2}
            stroke="#f5c451"
            strokeWidth={0.014}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(0 0 8px rgba(245,196,81,0.9))" }}
          />
          <motion.line
            x1={userLine.x1}
            y1={userLine.y1}
            x2={userLine.x2}
            y2={userLine.y2}
            stroke="#22d3ee"
            strokeWidth={0.014}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.8, ease: "easeInOut", delay: 0.1 }}
            style={{ filter: "drop-shadow(0 0 8px rgba(34,211,238,0.9))" }}
          />
        </svg>
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-4 text-[11px] font-semibold">
          <span className="flex items-center gap-1.5 text-accent-gold"><span className="h-2 w-2 rounded-full bg-accent-gold" /> True line</span>
          <span className="flex items-center gap-1.5 text-accent-cyan"><span className="h-2 w-2 rounded-full bg-accent-cyan" /> Your cut</span>
        </div>
      </div>

      {showScore && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 w-full">
          <div className="font-display text-5xl font-black text-gradient">{count}%</div>
          <div className="mt-1 text-xs uppercase tracking-widest text-fg-muted">Precision score</div>
          <div className="mt-3 flex justify-center gap-6 text-xs text-fg-muted">
            <span>Angle off: {result.angleDiffDeg.toFixed(1)}°</span>
            <span>Position off: {(result.positionDiff * 100).toFixed(1)}%</span>
          </div>
          <button
            onClick={onDone}
            className="mt-6 w-full rounded-full bg-gradient-to-r from-accent-violet to-accent-cyan py-3 font-bold text-black transition-transform hover:scale-[1.02]"
          >
            Reveal Prize
          </button>
        </motion.div>
      )}
    </div>
  );
}
