"use client";

import { useEffect, useState } from "react";
import { randomSeed, sha256Hex } from "@/lib/rng";

/**
 * Placeholder "provably fair" info panel: shows the seed hash committed
 * before a rip, and reveals the raw seed after. Everything here runs
 * client-side for the demo.
 *
 * TODO(server): generate the seed server-side, publish only its hash before
 * the rip, and reveal the seed after resolving the pull so the outcome can
 * be independently recomputed and verified.
 */
export function ProvablyFairBadge({ revealed, seed }: { revealed?: boolean; seed?: string }) {
  const [localSeed] = useState(() => seed ?? randomSeed());
  const [hash, setHash] = useState<string | null>(null);

  useEffect(() => {
    sha256Hex(localSeed).then(setHash);
  }, [localSeed]);

  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-3">
      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Provably Fair
      </div>
      <div className="space-y-1 font-mono text-[10.5px] text-fg-muted">
        <div className="truncate">
          <span className="text-fg-muted/70">seed hash&nbsp;</span>
          <span className="text-fg">{hash ?? "…"}</span>
        </div>
        <div className="truncate">
          <span className="text-fg-muted/70">seed&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span className={revealed ? "text-accent-gold" : "text-fg-muted/50"}>
            {revealed ? localSeed : "hidden until after rip"}
          </span>
        </div>
      </div>
    </div>
  );
}
