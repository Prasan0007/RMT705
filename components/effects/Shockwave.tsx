"use client";

import { AnimatePresence, motion } from "framer-motion";

/** Full-screen expanding ring burst for grail-tier reveals. */
export function Shockwave({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <div className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center overflow-hidden">
          {[0, 0.15, 0.3].map((delay) => (
            <motion.div
              key={delay}
              initial={{ scale: 0, opacity: 0.9 }}
              animate={{ scale: 6, opacity: 0 }}
              transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
              className="absolute h-40 w-40 rounded-full border-2"
              style={{
                borderImage: "conic-gradient(#ff5f6d,#ffc371,#7afcff,#b46bff,#ff5f6d) 1",
              }}
            />
          ))}
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-white"
          />
        </div>
      )}
    </AnimatePresence>
  );
}
