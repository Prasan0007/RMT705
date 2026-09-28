"use client";

import { AnimatePresence, motion } from "framer-motion";

export function CheckoutBanner({ status }: { status?: string }) {
  return (
    <AnimatePresence>
      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-8 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-center text-sm font-semibold text-emerald-300"
        >
          Payment complete — your tokens are in your balance.
        </motion.div>
      )}
      {status === "canceled" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-8 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-fg-muted"
        >
          Checkout canceled — no charge was made.
        </motion.div>
      )}
    </AnimatePresence>
  );
}
