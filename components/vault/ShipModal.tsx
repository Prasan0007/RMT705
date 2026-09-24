"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cardById } from "@/lib/card-catalog";
import type { VaultItem } from "@/lib/types";

export function ShipModal({ item, onClose }: { item: VaultItem | null; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const card = item ? cardById(item.cardId) : null;

  function close() {
    setSubmitted(false);
    onClose();
  }

  return (
    <AnimatePresence>
      {item && card && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass w-full max-w-sm rounded-t-3xl p-6 sm:rounded-3xl"
          >
            {!submitted ? (
              <>
                <h3 className="font-display text-lg font-bold">Ship {card.name}</h3>
                <p className="mt-1 text-sm text-fg-muted">
                  Grade {item.grade.toFixed(1)} · Serial {item.serial}
                </p>
                <div className="mt-4 space-y-3">
                  <input
                    placeholder="Full name"
                    className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-accent-cyan"
                  />
                  <input
                    placeholder="Shipping address"
                    className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-accent-cyan"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="City"
                      className="rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-accent-cyan"
                    />
                    <input
                      placeholder="ZIP"
                      className="rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-accent-cyan"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setSubmitted(true)}
                  className="mt-5 w-full rounded-full bg-gradient-to-r from-accent-violet to-accent-cyan py-3 font-bold text-black transition-transform hover:scale-[1.02]"
                >
                  Request Shipment
                </button>
                <p className="mt-3 text-center text-[11px] text-fg-muted">
                  Demo flow — no physical card is actually shipped.
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center py-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/15 text-2xl text-emerald-300">
                  ✓
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">Shipment requested</h3>
                <p className="mt-1 text-sm text-fg-muted">We&apos;ll email tracking once it&apos;s on its way.</p>
                <button onClick={close} className="mt-5 w-full rounded-full bg-white/10 py-3 text-sm font-semibold hover:bg-white/15">
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
