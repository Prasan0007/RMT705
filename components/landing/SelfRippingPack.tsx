"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/** Autonomous rip loop for the hero — a stylized pack tears itself open,
 * reveals a foil card, then resets. Runs on repeat, no user input. */
export function SelfRippingPack() {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.9, defaults: { ease: "power3.out" } });

      tl.set(".srp-top", { y: 0, rotate: 0 })
        .set(".srp-bottom", { y: 0, rotate: 0 })
        .set(".srp-card", { y: 40, opacity: 0, scale: 0.85, rotate: -4 })
        .set(".srp-tear", { scaleX: 0, opacity: 1 })
        .set(".srp-spark", { opacity: 0, scale: 0.4 })
        .to(".srp-pack", { y: -6, duration: 1.1, ease: "sine.inOut" })
        .to(".srp-tear", { scaleX: 1, duration: 0.45, ease: "power2.inOut" }, "-=0.3")
        .to(".srp-spark", { opacity: 1, scale: 1.4, duration: 0.3 }, "<")
        .to(".srp-spark", { opacity: 0, duration: 0.35 }, ">-0.05")
        .to(
          ".srp-top",
          { y: -34, rotate: -9, duration: 0.55, ease: "back.out(1.4)" },
          "-=0.1"
        )
        .to(
          ".srp-bottom",
          { y: 30, rotate: 6, duration: 0.55, ease: "back.out(1.4)" },
          "<"
        )
        .to(".srp-card", { y: 0, opacity: 1, scale: 1, rotate: 0, duration: 0.6, ease: "back.out(1.6)" }, "-=0.35")
        .to(".srp-card", { rotate: 3, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: 1 })
        .to({}, { duration: 0.9 }) // hold
        .to(".srp-card", { y: 30, opacity: 0, scale: 0.85, duration: 0.4, ease: "power2.in" })
        .to([".srp-top"], { y: 0, rotate: 0, duration: 0.5, ease: "power2.inOut" }, "<")
        .to([".srp-bottom"], { y: 0, rotate: 0, duration: 0.5, ease: "power2.inOut" }, "<")
        .set(".srp-tear", { scaleX: 0 });
    }, scope);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={scope} className="relative mx-auto aspect-[3/4] w-full max-w-[280px]">
      <div className="srp-pack relative h-full w-full">
        {/* card revealed behind the pack halves */}
        <div className="srp-card absolute inset-x-[14%] top-[16%] z-10 aspect-[5/7] rounded-lg border-2 border-accent-gold/70 bg-gradient-to-br from-violet-500/40 via-cyan-400/30 to-amber-300/40 shadow-[0_0_60px_-10px_rgba(245,196,81,0.6)]">
          <div className="absolute inset-0 rounded-lg bg-[conic-gradient(from_120deg,#ff5f6d,#ffc371,#7afcff,#b46bff,#ff5f6d)] opacity-40 mix-blend-color-dodge" />
          <div className="absolute inset-2 rounded-md border border-white/30 bg-bg-elevated/70" />
        </div>

        {/* top half */}
        <div
          className="srp-top absolute inset-x-0 top-0 z-20 h-[54%] overflow-hidden rounded-t-2xl border border-white/15 bg-gradient-to-br from-accent-violet via-fuchsia-500 to-accent-cyan shadow-2xl"
          style={{ clipPath: "polygon(0 0,100% 0,100% 88%,88% 92%,76% 86%,64% 94%,52% 88%,40% 96%,28% 88%,16% 94%,0 88%)" }}
        >
          <div className="absolute inset-0 flex items-center justify-center font-display text-[10px] font-black tracking-[0.3em] text-white/80">
            FOILFALL
          </div>
        </div>

        {/* bottom half */}
        <div
          className="srp-bottom absolute inset-x-0 bottom-0 z-20 h-[54%] overflow-hidden rounded-b-2xl border border-white/15 bg-gradient-to-tr from-accent-gold via-orange-400 to-accent-violet shadow-2xl"
          style={{ clipPath: "polygon(0 12%,16 6%,16% 6%,28% 14%,40% 6%,52% 12%,64% 4%,76% 12%,88% 6%,100% 12%,100% 100%,0 100%)" }}
        >
          <div className="absolute bottom-3 left-0 right-0 text-center font-mono text-[9px] uppercase tracking-widest text-black/50">
            Rip to reveal
          </div>
        </div>

        {/* tear glow line */}
        <div className="srp-tear pointer-events-none absolute left-0 right-0 top-1/2 z-30 h-[3px] origin-center bg-white shadow-[0_0_18px_4px_rgba(255,255,255,0.9)]" />

        {/* spark burst */}
        <div className="srp-spark pointer-events-none absolute left-1/2 top-1/2 z-30 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-xl" />
      </div>
    </div>
  );
}
