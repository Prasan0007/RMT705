"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { CutLine } from "@/lib/perfect-cut";
import { cn } from "@/lib/utils";

type StageState = "flash" | "fading" | "awaiting" | "captured";

interface CutStageProps {
  trueLine: CutLine;
  onCut: (line: CutLine) => void;
  colorA: string;
  colorB: string;
}

/** Renders the pack, flashes the true cut line for 2s, then lets the player
 * swipe their own line across the same surface. Coordinates are normalized
 * 0..1 within the stage so they compare directly against `trueLine`. */
export function CutStage({ trueLine, onCut, colorA, colorB }: CutStageProps) {
  const [state, setState] = useState<StageState>("flash");
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [liveLine, setLiveLine] = useState<CutLine | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setState("fading"), 2000);
    const t2 = setTimeout(() => setState("awaiting"), 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  function toNorm(clientX: number, clientY: number) {
    const rect = stageRef.current!.getBoundingClientRect();
    return { x: (clientX - rect.left) / rect.width, y: (clientY - rect.top) / rect.height };
  }

  function onPointerDown(e: React.PointerEvent) {
    if (state !== "awaiting") return;
    (e.target as Element).setPointerCapture(e.pointerId);
    setDrawStart(toNorm(e.clientX, e.clientY));
  }

  function onPointerMove(e: React.PointerEvent) {
    if (state !== "awaiting" || !drawStart) return;
    const p = toNorm(e.clientX, e.clientY);
    setLiveLine({ x1: drawStart.x, y1: drawStart.y, x2: p.x, y2: p.y });
  }

  function onPointerUp(e: React.PointerEvent) {
    if (state !== "awaiting" || !drawStart) return;
    const p = toNorm(e.clientX, e.clientY);
    const final: CutLine = { x1: drawStart.x, y1: drawStart.y, x2: p.x, y2: p.y };
    const dist = Math.hypot(final.x2 - final.x1, final.y2 - final.y1);
    if (dist < 0.06) {
      // too short to count as a swipe — ignore and let them try again
      setDrawStart(null);
      setLiveLine(null);
      return;
    }
    setLiveLine(final);
    setState("captured");
    onCut(final);
  }

  const showTrue = state === "flash" || state === "fading";

  return (
    <div
      ref={stageRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className={cn(
        "relative mx-auto aspect-[4/5] w-full max-w-sm touch-none select-none overflow-hidden rounded-3xl border border-amber-300/25 bg-gradient-to-br from-[#171308] to-black shadow-[0_40px_80px_-20px_rgba(0,0,0,0.85)]",
        state === "awaiting" && "cursor-crosshair"
      )}
    >
      <div
        className="absolute inset-6 rounded-2xl opacity-90"
        style={{ background: `linear-gradient(135deg, ${colorA}, ${colorB})` }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <span className="font-display text-xs font-black tracking-[0.4em] text-black/50">THE PERFECT CUT</span>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.12),transparent_60%)]" />

      <svg viewBox="0 0 1 1" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
        {showTrue && (
          <motion.line
            x1={trueLine.x1}
            y1={trueLine.y1}
            x2={trueLine.x2}
            y2={trueLine.y2}
            stroke="#ffffff"
            strokeWidth={0.012}
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: state === "fading" ? 0 : 1 }}
            transition={{ duration: state === "fading" ? 0.4 : 0.15 }}
            style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.9))" }}
          />
        )}
        {liveLine && (state === "awaiting" || state === "captured") && (
          <line
            x1={liveLine.x1}
            y1={liveLine.y1}
            x2={liveLine.x2}
            y2={liveLine.y2}
            stroke="#22d3ee"
            strokeWidth={0.012}
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 6px rgba(34,211,238,0.9))" }}
          />
        )}
      </svg>

      {state === "awaiting" && !liveLine && (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 text-center text-xs font-semibold text-white/80">
          Swipe along where the line was
        </div>
      )}
    </div>
  );
}
