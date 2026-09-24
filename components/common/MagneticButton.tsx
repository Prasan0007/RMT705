"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  strength?: number;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

/** Magnetic hover wrapper — wrap a Link or button, it nudges toward the cursor. */
export function MagneticButton({ children, className, strength = 0.35, ...props }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 14, mass: 0.4 });

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - rect.left - rect.width / 2) * strength);
        y.set((e.clientY - rect.top - rect.height / 2) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold transition-colors [&_a]:flex [&_a]:h-full [&_a]:w-full [&_a]:items-center [&_a]:justify-center",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
