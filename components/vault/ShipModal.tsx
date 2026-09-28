"use client";

import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cardById } from "@/lib/card-catalog";
import { shipAction } from "@/app/actions/vault";
import type { VaultItemView } from "./VaultCard";

const initialForm = {
  recipientName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  region: "",
  postalCode: "",
  country: "",
};

export function ShipModal({ item, onClose }: { item: VaultItemView | null; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const card = item ? cardById(item.cardId) : null;

  function close() {
    setSubmitted(false);
    setForm(initialForm);
    setError(null);
    onClose();
  }

  function submit() {
    if (!item) return;
    setError(null);
    startTransition(async () => {
      const res = await shipAction(item.id, form);
      if (res.ok) setSubmitted(true);
      else setError(res.error ?? "Something went wrong.");
    });
  }

  function set<K extends keyof typeof initialForm>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <AnimatePresence>
      {item && card && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={pending ? undefined : close}
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
                    value={form.recipientName}
                    onChange={(e) => set("recipientName", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-accent-cyan"
                  />
                  <input
                    placeholder="Address line 1"
                    value={form.addressLine1}
                    onChange={(e) => set("addressLine1", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-accent-cyan"
                  />
                  <input
                    placeholder="Address line 2 (optional)"
                    value={form.addressLine2}
                    onChange={(e) => set("addressLine2", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-accent-cyan"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="City"
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                      className="rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-accent-cyan"
                    />
                    <input
                      placeholder="State / Region"
                      value={form.region}
                      onChange={(e) => set("region", e.target.value)}
                      className="rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-accent-cyan"
                    />
                    <input
                      placeholder="Postal code"
                      value={form.postalCode}
                      onChange={(e) => set("postalCode", e.target.value)}
                      className="rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-accent-cyan"
                    />
                    <input
                      placeholder="Country"
                      value={form.country}
                      onChange={(e) => set("country", e.target.value)}
                      className="rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none focus:border-accent-cyan"
                    />
                  </div>
                </div>

                {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

                <button
                  onClick={submit}
                  disabled={pending}
                  className="mt-5 w-full rounded-full bg-gradient-to-r from-accent-violet to-accent-cyan py-3 font-bold text-black transition-transform hover:scale-[1.02] disabled:opacity-60"
                >
                  {pending ? "Submitting…" : "Request Shipment"}
                </button>
                <p className="mt-3 text-center text-[11px] text-fg-muted">
                  Creates a real order for our fulfillment team to review — see the Admin panel.
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center py-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/15 text-2xl text-emerald-300">
                  ✓
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">Shipment requested</h3>
                <p className="mt-1 text-sm text-fg-muted">
                  Your card is queued for the fulfillment team — status updates in your Vault.
                </p>
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
