"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface TiltState {
  rx: number; // rotateX degrees
  ry: number; // rotateY degrees
  px: number; // pointer x 0..1, for foil gradient position
  py: number; // pointer y 0..1
  active: boolean;
}

const REST: TiltState = { rx: 0, ry: 0, px: 0.5, py: 0.5, active: false };

/**
 * Drives the holographic tilt on cards from mouse position, falling back to
 * device gyroscope on mobile where the browser exposes it.
 */
export function useTilt<T extends HTMLElement>(maxDeg = 14) {
  const ref = useRef<T | null>(null);
  const [tilt, setTilt] = useState<TiltState>(REST);

  const onMove = useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (clientX - rect.left) / rect.width;
      const py = (clientY - rect.top) / rect.height;
      const ry = (px - 0.5) * maxDeg * 2;
      const rx = -(py - 0.5) * maxDeg * 2;
      setTilt({ rx, ry, px, py, active: true });
    },
    [maxDeg]
  );

  const reset = useCallback(() => setTilt(REST), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("DeviceOrientationEvent" in window)) return;

    const handler = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      const rx = Math.max(-maxDeg, Math.min(maxDeg, (e.beta - 45) * -0.4));
      const ry = Math.max(-maxDeg, Math.min(maxDeg, e.gamma * 0.6));
      setTilt({ rx, ry, px: 0.5 + ry / (maxDeg * 4), py: 0.5 + rx / (maxDeg * 4), active: true });
    };

    window.addEventListener("deviceorientation", handler);
    return () => window.removeEventListener("deviceorientation", handler);
  }, [maxDeg]);

  return {
    ref,
    tilt,
    handlers: {
      onMouseMove: (e: React.MouseEvent) => onMove(e.clientX, e.clientY),
      onMouseLeave: reset,
      onTouchMove: (e: React.TouchEvent) => {
        const t = e.touches[0];
        if (t) onMove(t.clientX, t.clientY);
      },
      onTouchEnd: reset,
    },
  };
}
