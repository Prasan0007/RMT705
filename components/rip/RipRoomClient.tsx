"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TearPack } from "./TearPack";
import { CardRevealFlow } from "./CardRevealFlow";
import { Pack3DLazy } from "@/components/three/Pack3DLazy";
import { ProvablyFairBadge } from "@/components/common/ProvablyFairBadge";
import { TIER_THEME } from "@/components/packs/tierTheme";
import { getPack, simulatePull, gradeForCard } from "@/lib/odds";
import { randomSeed } from "@/lib/rng";
import { useAppStore } from "@/lib/store";
import { formatTokens } from "@/lib/utils";
import type { CardDef, VaultItem } from "@/lib/types";

type Phase = "intro" | "tearing" | "revealing" | "complete";

interface ResultItem {
  card: CardDef;
  grade: number;
  serial: string;
}

export function RipRoomClient({ packId }: { packId: string }) {
  const pack = getPack(packId);
  const tokens = useAppStore((s) => s.tokens);
  const spendTokens = useAppStore((s) => s.spendTokens);
  const addVaultItems = useAppStore((s) => s.addVaultItems);
  const pushRipHistory = useAppStore((s) => s.pushRipHistory);
  const streamerMode = useAppStore((s) => s.streamerMode);

  const [phase, setPhase] = useState<Phase>("intro");
  const [seed, setSeed] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ResultItem[]>([]);

  const theme = pack ? TIER_THEME[pack.tier] : TIER_THEME.starter;

  const canAfford = pack ? tokens >= pack.price : false;

  function startRip() {
    if (!pack) return;
    if (!spendTokens(pack.price)) {
      setError("Not enough tokens for this pack.");
      return;
    }
    setError(null);
    const s = randomSeed();
    setSeed(s);
    const cards = simulatePull(pack, s);
    const items: ResultItem[] = cards.map((card, i) => ({
      card,
      grade: gradeForCard(card, s),
      serial: `FF-${(100000 + Math.floor(Math.random() * 899999)).toString()}-${i}`,
    }));
    setResults(items);
    setPhase("tearing");
  }

  function onTearComplete() {
    setPhase("revealing");
  }

  function onAllRevealed() {
    const vaultItems: VaultItem[] = results.map((r) => ({
      instanceId: `${r.serial}-${Math.random().toString(36).slice(2, 8)}`,
      cardId: r.card.id,
      grade: r.grade,
      pulledAt: new Date().toISOString(),
      packId: pack!.id,
      serial: r.serial,
    }));
    addVaultItems(vaultItems);
    results.forEach((r) => {
      pushRipHistory({ id: r.serial, cardId: r.card.id, grade: r.grade, timestamp: new Date().toISOString() });
    });
    setPhase("complete");
  }

  const bestRarity = useMemo(() => {
    const order = ["common", "uncommon", "rare", "epic", "legendary", "grail"];
    return results.reduce((best, r) => (order.indexOf(r.card.rarity) > order.indexOf(best) ? r.card.rarity : best), "common");
  }, [results]);

  if (!pack) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Pack not found</h1>
        <p className="mt-2 text-fg-muted">That pack doesn&apos;t exist in this demo catalog.</p>
        <Link href="/packs" className="mt-6 inline-block rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold">
          Back to Pack Shop
        </Link>
      </div>
    );
  }

  return (
    <div className={streamerMode ? "min-h-[80vh]" : "min-h-[70vh]"}>
      {phase === "intro" && (
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em]" style={{ color: theme.colorA }}>
              {theme.label}
            </div>
            <h1 className="font-display text-3xl font-black sm:text-4xl">{pack.name}</h1>
            <p className="mt-3 text-fg-muted">{pack.description}</p>

            <div className="relative mx-auto mt-8 h-72 w-56">
              <Pack3DLazy colorA={theme.colorA} colorB={theme.colorB} className="h-full w-full" />
            </div>

            <div className="glass mx-auto mt-6 max-w-xs rounded-2xl p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-fg-muted">Cost</span>
                <span className="font-mono font-bold">{formatTokens(pack.price)} tokens</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="text-fg-muted">Your balance</span>
                <span className="font-mono font-bold">{formatTokens(tokens)} tokens</span>
              </div>
            </div>

            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

            {canAfford ? (
              <button
                onClick={startRip}
                className="mt-6 w-full max-w-xs rounded-full bg-gradient-to-r from-accent-violet to-accent-cyan py-3.5 font-bold text-black shadow-[0_0_30px_-6px_rgba(139,92,246,0.7)] transition-transform hover:scale-[1.02]"
              >
                Rip Pack — {formatTokens(pack.price)} tokens
              </button>
            ) : (
              <Link
                href="/store"
                className="mt-6 block w-full max-w-xs rounded-full bg-white/10 py-3.5 text-center font-bold hover:bg-white/15"
              >
                Not enough tokens — Get More
              </Link>
            )}

            <div className="mx-auto mt-6 max-w-xs">
              <ProvablyFairBadge revealed={false} seed={seed ?? undefined} />
            </div>
          </motion.div>
        </div>
      )}

      {phase === "tearing" && (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16">
          <TearPack colorA={theme.colorA} colorB={theme.colorB} packName={pack.name} onComplete={onTearComplete} />
        </div>
      )}

      {phase === "revealing" && (
        <CardRevealFlow items={results} packName={pack.name} onAllRevealed={onAllRevealed} enlarged={streamerMode} />
      )}

      {phase === "complete" && (
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Rip complete</h1>
            <p className="mt-2 text-fg-muted">
              Best pull: <span className="font-semibold capitalize text-fg">{bestRarity}</span> · {results.length} cards added to your Vault.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-left">
              <ProvablyFairBadge revealed seed={seed ?? undefined} />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setPhase("intro")}
                className="flex-1 rounded-full bg-gradient-to-r from-accent-violet to-accent-cyan py-3 font-bold text-black transition-transform hover:scale-[1.02]"
              >
                Rip Again
              </button>
              <Link href="/vault" className="flex-1 rounded-full bg-white/10 py-3 font-semibold hover:bg-white/15">
                Go to Vault
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
