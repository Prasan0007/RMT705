"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { TokenBundle } from "@/lib/types";
import { formatTokens, formatUsd } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

type Stage = "review" | "processing" | "success";

export function CheckoutModal({ bundle, onClose }: { bundle: TokenBundle | null; onClose: () => void }) {
  const [stage, setStage] = useState<Stage>("review");
  const addTokens = useAppStore((s) => s.addTokens);

  const totalTokens = bundle ? Math.round(bundle.tokens * (1 + bundle.bonusPct / 100)) : 0;

  function close() {
    setStage("review");
    onClose();
  }

  function confirm() {
    if (!bundle) return;
    setStage("processing");
    // Mock checkout — no real payment provider is called.
    setTimeout(() => {
      addTokens(totalTokens);
      setStage("success");
    }, 1100);
  }

  return (
    <AnimatePresence>
      {bundle && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={stage === "processing" ? undefined : close}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="glass w-full max-w-sm rounded-t-3xl p-6 sm:rounded-3xl"
          >
            {stage === "review" && (
              <>
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="font-display text-xl font-bold">Confirm purchase</h3>
                  <button onClick={close} className="rounded-full bg-white/10 p-2 text-fg-muted hover:text-fg">✕</button>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-fg-muted">Tokens</span>
                    <span className="font-mono font-bold">{formatTokens(bundle.tokens)}</span>
                  </div>
                  {bundle.bonusPct > 0 && (
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm text-fg-muted">Bonus ({bundle.bonusPct}%)</span>
                      <span className="font-mono font-bold text-emerald-400">
                        +{formatTokens(totalTokens - bundle.tokens)}
                      </span>
                    </div>
                  )}
                  <div className="my-3 h-px bg-white/10" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Total tokens</span>
                    <span className="font-display text-lg font-bold text-gradient">{formatTokens(totalTokens)}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-fg-muted">
                    Mock payment method · Visa •••• 4242
                  </div>
                </div>

                <button
                  onClick={confirm}
                  className="mt-5 w-full rounded-full bg-gradient-to-r from-accent-violet to-accent-cyan py-3.5 text-center font-bold text-black transition-transform hover:scale-[1.02]"
                >
                  Pay {formatUsd(bundle.priceUsd)}
                </button>
                <p className="mt-3 text-center text-[11px] text-fg-muted">
                  Demo checkout — no real payment is processed.
                </p>
              </>
            )}

            {stage === "processing" && (
              <div className="flex flex-col items-center justify-center py-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="h-10 w-10 rounded-full border-2 border-white/15 border-t-accent-cyan"
                />
                <p className="mt-4 text-sm text-fg-muted">Processing payment…</p>
              </div>
            )}

            {stage === "success" && (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/15 text-3xl text-emerald-300"
                >
                  ✓
                </motion.div>
                <h3 className="mt-4 font-display text-lg font-bold">Tokens added</h3>
                <p className="mt-1 text-sm text-fg-muted">
                  {formatTokens(totalTokens)} tokens are in your balance. Time to rip.
                </p>
                <button
                  onClick={close}
                  className="mt-5 w-full rounded-full bg-white/10 py-3 text-sm font-semibold hover:bg-white/15"
                >
                  Done
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
