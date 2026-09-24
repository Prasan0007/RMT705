"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/** Heavy vault doors slide open once on entry to reveal the page. */
export function VaultDoorIntro({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setOpen(true), 450);
    const t2 = setTimeout(() => onDone(), 1900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] overflow-hidden bg-black">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: open ? "-100%" : 0 }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-y-0 left-0 w-1/2 border-r border-amber-300/30 bg-gradient-to-br from-[#141014] via-[#1c1710] to-black"
        >
          <div className="absolute right-6 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full border-4 border-accent-gold/60 shadow-[0_0_40px_-4px_rgba(245,196,81,0.6)]" />
          <div className="absolute inset-0 opacity-20" style={{ background: "repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(255,255,255,0.08) 19px)" }} />
        </motion.div>
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: open ? "100%" : 0 }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-y-0 right-0 w-1/2 border-l border-amber-300/30 bg-gradient-to-bl from-[#141014] via-[#1c1710] to-black"
        >
          <div className="absolute left-6 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full border-4 border-accent-gold/60 shadow-[0_0_40px_-4px_rgba(245,196,81,0.6)]" />
          <div className="absolute inset-0 opacity-20" style={{ background: "repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(255,255,255,0.08) 19px)" }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: open ? 0 : 1 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <span className="font-display text-sm font-bold uppercase tracking-[0.4em] text-accent-gold">
            Unlocking The Perfect Cut
          </span>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
