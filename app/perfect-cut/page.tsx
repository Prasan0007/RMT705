"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { VaultDoorIntro } from "@/components/perfect-cut/VaultDoorIntro";
import { PrizeTables } from "@/components/perfect-cut/PrizeTables";
import { PrecisionCountdown } from "@/components/perfect-cut/PrecisionCountdown";
import { CutStage } from "@/components/perfect-cut/CutStage";
import { ReplayOverlay } from "@/components/perfect-cut/ReplayOverlay";
import { Pack3DLazy } from "@/components/three/Pack3DLazy";
import { GradedSlab } from "@/components/cards/GradedSlab";
import { RarityBadge } from "@/components/cards/RarityBadge";
import { ParticleBurst } from "@/components/effects/ParticleBurst";
import { ProvablyFairBadge } from "@/components/common/ProvablyFairBadge";
import {
  generateCutLine,
  scorePrecision,
  tierForPrecision,
  drawTierCard,
  type CutLine,
  type PrecisionResult,
} from "@/lib/perfect-cut";
import { gradeForCard } from "@/lib/odds";
import { randomSeed } from "@/lib/rng";
import { useAppStore } from "@/lib/store";
import { formatTokens } from "@/lib/utils";
import type { CardDef, VaultItem } from "@/lib/types";
import { playShatter, playCrowdRoar } from "@/lib/sound";

type Phase = "door" | "ready" | "cutting" | "replay" | "payoff" | "result";

const PACK_PRICE = 1000;

export default function PerfectCutPage() {
  const [phase, setPhase] = useState<Phase>("door");
  const [seed, setSeed] = useState<string | null>(null);
  const [trueLine, setTrueLine] = useState<CutLine | null>(null);
  const [userLine, setUserLine] = useState<CutLine | null>(null);
  const [result, setResult] = useState<PrecisionResult | null>(null);
  const [card, setCard] = useState<CardDef | null>(null);
  const [grade, setGrade] = useState(0);
  const [serial, setSerial] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shatterKey, setShatterKey] = useState(0);

  const tokens = useAppStore((s) => s.tokens);
  const spendTokens = useAppStore((s) => s.spendTokens);
  const addVaultItems = useAppStore((s) => s.addVaultItems);
  const pushRipHistory = useAppStore((s) => s.pushRipHistory);

  const tier = result ? tierForPrecision(result.precision) : null;
  const canAfford = tokens >= PACK_PRICE;

  function beginCut() {
    if (!spendTokens(PACK_PRICE)) {
      setError("Not enough tokens for The Perfect Cut.");
      return;
    }
    setError(null);
    const s = randomSeed();
    setSeed(s);
    setTrueLine(generateCutLine(s));
    setPhase("cutting");
  }

  function onCut(line: CutLine) {
    if (!trueLine) return;
    setUserLine(line);
    setResult(scorePrecision(trueLine, line));
    setPhase("replay");
  }

  function afterReplay() {
    if (!result || !seed) return;
    const resolvedTier = tierForPrecision(result.precision);
    const pulledCard = drawTierCard(resolvedTier, seed);
    const g = gradeForCard(pulledCard, seed);
    const ser = `FF-${(100000 + Math.floor(Math.random() * 899999)).toString()}`;
    setCard(pulledCard);
    setGrade(g);
    setSerial(ser);

    addVaultItems([
      {
        instanceId: `${ser}-${Math.random().toString(36).slice(2, 8)}`,
        cardId: pulledCard.id,
        grade: g,
        pulledAt: new Date().toISOString(),
        packId: "perfect-cut",
        serial: ser,
      } satisfies VaultItem,
    ]);
    pushRipHistory({ id: ser, cardId: pulledCard.id, grade: g, timestamp: new Date().toISOString() });

    if (resolvedTier.id === "elite") {
      setPhase("payoff");
      setShatterKey((k) => k + 1);
      playShatter();
      playCrowdRoar();
      setTimeout(() => setPhase("result"), 1500);
    } else {
      setPhase("result");
    }
  }

  function resetRound() {
    setPhase("ready");
    setTrueLine(null);
    setUserLine(null);
    setResult(null);
    setCard(null);
  }

  return (
    <div className="relative">
      {phase === "door" && <VaultDoorIntro onDone={() => setPhase("ready")} />}

      <div className="bg-mesh relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(245,196,81,0.12),transparent)]" />

        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="mb-3 flex justify-center">
              <PrecisionCountdown />
            </div>
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-accent-gold">
              Signature Pack · $1,000
            </div>
            <h1 className="font-display text-3xl font-black sm:text-5xl">The Perfect Cut</h1>
            <p className="mx-auto mt-3 max-w-xl text-fg-muted">
              One glowing line. It shows for two seconds, then it&apos;s gone. Swipe the cut from memory —
              your precision decides which prize table you pull from.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {phase === "ready" && (
              <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-10">
                <div className="relative mx-auto h-72 w-56">
                  <Pack3DLazy colorA="#f5c451" colorB="#ffffff" className="h-full w-full" />
                </div>

                <div className="glass mx-auto mt-4 max-w-xs rounded-2xl p-4 text-center">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-fg-muted">Cost</span>
                    <span className="font-mono font-bold">{formatTokens(PACK_PRICE)} tokens</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span className="text-fg-muted">Your balance</span>
                    <span className="font-mono font-bold">{formatTokens(tokens)} tokens</span>
                  </div>
                </div>

                {error && <p className="mt-3 text-center text-sm text-red-400">{error}</p>}

                <div className="mt-5 flex justify-center">
                  {canAfford ? (
                    <button
                      onClick={beginCut}
                      className="rounded-full bg-gradient-to-r from-accent-gold via-amber-300 to-accent-gold px-8 py-3.5 font-bold text-black shadow-[0_0_40px_-6px_rgba(245,196,81,0.8)] transition-transform hover:scale-[1.03]"
                    >
                      Begin The Cut — {formatTokens(PACK_PRICE)} tokens
                    </button>
                  ) : (
                    <Link href="/store" className="rounded-full bg-white/10 px-8 py-3.5 font-bold hover:bg-white/15">
                      Not enough tokens — Get More
                    </Link>
                  )}
                </div>

                <div className="mx-auto mt-6 max-w-xs">
                  <ProvablyFairBadge revealed={false} seed={seed ?? undefined} />
                </div>

                <div className="mt-14">
                  <h2 className="mb-4 text-center font-display text-lg font-bold">All three prize tables</h2>
                  <PrizeTables />
                </div>
              </motion.div>
            )}

            {phase === "cutting" && trueLine && (
              <motion.div key="cutting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-10">
                <CutStage trueLine={trueLine} onCut={onCut} colorA="#f5c451" colorB="#ffe9b8" />
              </motion.div>
            )}

            {phase === "replay" && trueLine && userLine && result && (
              <motion.div key="replay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-10">
                <ReplayOverlay trueLine={trueLine} userLine={userLine} result={result} onDone={afterReplay} />
              </motion.div>
            )}

            {phase === "payoff" && (
              <motion.div key="payoff" className="relative mt-10 flex min-h-[420px] items-center justify-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.85] }}
                  transition={{ duration: 0.5 }}
                  className="fixed inset-0 z-[150] bg-white"
                  style={{ mixBlendMode: "overlay" }}
                />
                <div className="relative">
                  <ParticleBurst
                    trigger={shatterKey}
                    colors={["#f5c451", "#ffe9b8", "#ffffff", "#ffc371"]}
                    count={220}
                    power={2.2}
                    className="!fixed !inset-0 z-[151]"
                  />
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 14 }}
                    className="font-display text-4xl font-black text-gradient"
                  >
                    PERFECT
                  </motion.div>
                </div>
              </motion.div>
            )}

            {phase === "result" && card && tier && result && (
              <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-10 text-center">
                <div className="mb-2 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: tier.id === "elite" ? "#f5c451" : "#b46bff" }}>
                  {tier.label} Tier · {result.precision}% precision
                </div>
                <RarityBadge rarity={card.rarity} className="mb-4" />
                <GradedSlab card={card} grade={grade} serial={serial} />

                <div className="mx-auto mt-8 flex max-w-xs flex-col gap-3">
                  <button
                    onClick={resetRound}
                    className="rounded-full bg-gradient-to-r from-accent-gold to-amber-300 py-3 font-bold text-black transition-transform hover:scale-[1.02]"
                  >
                    Cut Again
                  </button>
                  <Link href="/vault" className="rounded-full bg-white/10 py-3 font-semibold hover:bg-white/15">
                    Go to Vault
                  </Link>
                </div>

                <div className="mx-auto mt-8 max-w-xs">
                  <ProvablyFairBadge revealed seed={seed ?? undefined} />
                </div>

                <div className="mt-14">
                  <h2 className="mb-4 text-center font-display text-lg font-bold">Prize tables this round</h2>
                  <PrizeTables highlightTier={tier.id} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
