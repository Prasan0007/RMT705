"use client";

import { useEffect, useState } from "react";

function timeLeft() {
  const now = new Date();
  const next = new Date(now);
  next.setMinutes(0, 0, 0);
  next.setHours(now.getHours() + 1);
  return next.getTime() - now.getTime();
}

function format(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/** Purely decorative — ties the page to a "live drop window" feel. */
export function PrecisionCountdown() {
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clock tick, not derived state
    setMs(timeLeft());
    const id = setInterval(() => setMs(timeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/5 px-4 py-1.5 text-xs font-semibold text-amber-200">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300" />
      Elite odds window refreshes in {ms === null ? "--:--" : format(ms)}
    </div>
  );
}
