"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LEADERBOARD_TODAY, LEADERBOARD_WEEK, RECENT_PULLS } from "@/lib/mock-data";
import { cardById } from "@/lib/card-catalog";
import { RARITY_LABEL } from "@/lib/types";
import { RarityDot } from "@/components/common/GlassPanel";
import { TimeAgo } from "@/components/common/TimeAgo";
import { formatTokens, cn } from "@/lib/utils";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const [range, setRange] = useState<"today" | "week">("today");
  const data = range === "today" ? LEADERBOARD_TODAY : LEADERBOARD_WEEK;
  const bigPulls = [...RECENT_PULLS].sort((a, b) => b.value - a.value).slice(0, 8);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-accent-cyan">Live Feed</div>
        <h1 className="font-display text-3xl font-black sm:text-4xl">Who&apos;s hitting today</h1>
        <p className="mx-auto mt-3 max-w-lg text-fg-muted">Biggest pulls today and the top rippers this week.</p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center gap-2">
            <h2 className="font-display text-lg font-bold">Leaderboard</h2>
            <div className="ml-auto flex rounded-full bg-white/5 p-1">
              {(["today", "week"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors",
                    range === r ? "bg-white text-black" : "text-fg-muted"
                  )}
                >
                  {r === "today" ? "Today" : "This Week"}
                </button>
              ))}
            </div>
          </div>

          <div className="glass overflow-hidden rounded-2xl">
            {data.map((entry, i) => (
              <motion.div
                key={entry.user}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5",
                  i !== data.length - 1 && "border-b border-white/[0.06]"
                )}
              >
                <span className="w-7 text-center font-display text-sm font-bold text-fg-muted">
                  {MEDALS[i] ?? `#${entry.rank}`}
                </span>
                <div
                  className="h-9 w-9 shrink-0 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, hsl(${(entry.avatarSeed.charCodeAt(0) * 37) % 360} 70% 55%), hsl(${(entry.avatarSeed.charCodeAt(1) * 53) % 360} 70% 55%))`,
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{entry.user}</div>
                  <div className="truncate text-xs text-fg-muted">Best pull: {entry.bestPull}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-bold text-accent-gold">{formatTokens(entry.totalValue)}</div>
                  <div className="text-[11px] text-fg-muted">{entry.packsOpened} packs</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="mb-4 font-display text-lg font-bold">Biggest pulls today</h2>
          <div className="flex flex-col gap-2.5">
            {bigPulls.map((pull, i) => {
              const card = cardById(pull.cardId);
              return (
                <motion.div
                  key={pull.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass flex items-center gap-3 rounded-xl px-3.5 py-3"
                >
                  <RarityDot rarity={pull.rarity} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">
                      {card.name} <span className="text-fg-muted">· {pull.user}</span>
                    </div>
                    <div className="text-xs text-fg-muted">
                      {RARITY_LABEL[pull.rarity]} · Grade {pull.grade.toFixed(1)} · {pull.packName} · <TimeAgo iso={pull.timestamp} />
                    </div>
                  </div>
                  <span className="shrink-0 font-mono text-sm font-bold text-accent-gold">{formatTokens(pull.value)}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
