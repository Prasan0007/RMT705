"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ParticleBurst } from "@/components/effects/ParticleBurst";
import { playCrinkle } from "@/lib/sound";
import { cn } from "@/lib/utils";

interface TearPackProps {
  colorA: string;
  colorB: string;
  packName: string;
  onComplete: () => void;
}

/** Drag-across-the-top tear interaction. Completes past ~78% travel. */
export function TearPack({ colorA, colorB, packName, onComplete }: TearPackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useRef(1);
  const x = useMotionValue(0);
  const wrapWidth = useTransform(x, (v) => Math.max(0, containerWidth.current - v));
  const [progress, setProgress] = useState(0);
  const [burstKey, setBurstKey] = useState(0);
  const [done, setDone] = useState(false);
  const [maxDrag, setMaxDrag] = useState(1);
  const lastTickRef = useRef(0);

  useEffect(() => {
    function measure() {
      const w = containerRef.current?.clientWidth ?? 1;
      containerWidth.current = w;
      setMaxDrag(w);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  function width() {
    return containerRef.current?.clientWidth ?? 1;
  }

  function handleDrag() {
    const p = Math.max(0, Math.min(1, x.get() / width()));
    setProgress(p);
    if (p - lastTickRef.current > 0.12) {
      lastTickRef.current = p;
      playCrinkle(0.6 + p * 0.6);
      if (navigator.vibrate) navigator.vibrate(8);
    }
  }

  function handleDragEnd() {
    const p = Math.max(0, Math.min(1, x.get() / width()));
    if (p > 0.78) {
      animate(x, width(), { duration: 0.25, ease: "easeOut" });
      setProgress(1);
      setDone(true);
      setBurstKey((k) => k + 1);
      playCrinkle(1.4);
      if (navigator.vibrate) navigator.vibrate([15, 30, 60]);
      setTimeout(onComplete, 550);
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 24 });
      setProgress(0);
      lastTickRef.current = 0;
    }
  }

  return (
    <div className="mx-auto w-full max-w-[320px] select-none">
      <div
        ref={containerRef}
        className="relative aspect-[5/7] w-full overflow-hidden rounded-2xl border border-white/15 bg-bg-elevated shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]"
      >
        {/* underlying card silhouette, revealed as wrapper tears away */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/10 to-white/[0.02]">
          <div className="h-[80%] w-[68%] rounded-xl border-2 border-accent-gold/60 bg-[conic-gradient(from_140deg,#ff5f6d,#ffc371,#7afcff,#b46bff,#ff5f6d)] opacity-70 shadow-[0_0_50px_-8px_rgba(245,196,81,0.6)]" />
        </div>

        {/* torn-away wrapper piece — shrinks from the left as the tab drags right */}
        <motion.div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{
            width: wrapWidth,
            background: `linear-gradient(135deg, ${colorA}, ${colorB})`,
          }}
        >
          <div className="flex h-full flex-col items-center justify-between py-6">
            <span className="font-display text-xs font-black tracking-[0.35em] text-white/85">FOILFALL</span>
            <span className="rotate-90 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest text-black/40">
              {packName}
            </span>
            <span className="text-[10px] text-white/60">Drag to tear →</span>
          </div>
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-3"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9))" }}
          />
        </motion.div>

        {/* drag handle */}
        {!done && (
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: maxDrag }}
            dragElastic={0}
            dragMomentum={false}
            style={{ x }}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            className="absolute left-0 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 cursor-grab items-center justify-center rounded-full border border-white/30 bg-black/60 text-white shadow-lg backdrop-blur active:cursor-grabbing"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        )}

        <ParticleBurst trigger={burstKey} colors={[colorA, colorB, "#ffffff"]} count={70} originX={progress} originY={0.5} power={1.3} />
      </div>

      {!done && (
        <div className="mx-auto mt-4 h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-white/10">
          <div
            className={cn("h-full rounded-full bg-gradient-to-r from-accent-violet to-accent-cyan transition-[width]")}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}
      <p className="mt-3 text-center text-xs text-fg-muted">
        {done ? "Tearing open…" : "Drag the tab across the top to tear the foil"}
      </p>
    </div>
  );
}
