"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { formatTokens } from "@/lib/utils";

function Digit({ value }: { value: number }) {
  const mv = useMotionValue(value);
  const y = useTransform(mv, (v) => `${-v * 10}%`);

  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.6, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
  }, [value, mv]);

  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden align-bottom">
      <motion.span className="absolute inset-x-0 top-0" style={{ y }}>
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="block h-[1em] leading-[1em]">
            {i}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/** Slot-machine style rolling counter for the token balance. */
export function TokenOdometer({ value }: { value: number }) {
  const str = formatTokens(value);

  return (
    <span className="inline-flex">
      {str.split("").map((ch, i) =>
        /\d/.test(ch) ? <Digit key={i} value={Number(ch)} /> : <span key={i}>{ch}</span>
      )}
    </span>
  );
}
