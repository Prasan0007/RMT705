"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SelfRippingPack } from "@/components/landing/SelfRippingPack";
import { RecentPullsTicker } from "@/components/landing/RecentPullsTicker";
import { PackTile } from "@/components/packs/PackTile";
import { OddsModal } from "@/components/packs/OddsModal";
import { MagneticButton } from "@/components/common/MagneticButton";
import { PACKS } from "@/lib/odds";
import type { PackDef, PullRecord } from "@/lib/types";

const STEPS = [
  {
    n: "01",
    title: "Buy tokens",
    body: "Grab a token bundle — bigger bundles come with a bonus. No token ever expires.",
  },
  {
    n: "02",
    title: "Rip a pack",
    body: "Tear the foil, watch every card flip, feel the suspense build before a big hit.",
  },
  {
    n: "03",
    title: "Keep it real",
    body: "Every pull is a real graded card. Vault it, ship it to your door, or sell it back for tokens.",
  },
];

const FAQS = [
  {
    q: "Is this real money?",
    a: "Yes — token purchases are processed securely through Stripe. We never see or store your card details.",
  },
  {
    q: "What does 'graded' mean here?",
    a: "Every pull slides into a numbered slab with a 1–10 grade, styled after real third-party grading services.",
  },
  {
    q: "Can I actually get the card shipped?",
    a: "Yes — the Vault's Ship action files a real fulfillment request our team works from.",
  },
  {
    q: "Are the odds real?",
    a: "The odds table you see on every pack is generated live from the same config file the pull engine reads — nothing is hidden.",
  },
  {
    q: "What is The Perfect Cut?",
    a: "Our signature $1,000 pack. A glowing line flashes once — you have to swipe the cut from memory. Precision decides your prize tier.",
  },
];

export function LandingClient({ recentPulls }: { recentPulls: PullRecord[] }) {
  const [oddsPack, setOddsPack] = useState<PackDef | null>(null);
  const featured = PACKS.filter((p) => p.featured && p.tier !== "perfect-cut");

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-fg-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live now
            </div>
            <h1 className="font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Rip the pack.
              <br />
              <span className="text-gradient">Feel the pull.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-fg-muted">
              FOILFALL turns pack ripping into a real graded card in your hands. Buy tokens, rip on
              stream, and every pull is real — vault it, ship it, or sell it back.
            </p>
            <p className="mt-1 font-display text-sm font-bold uppercase tracking-[0.2em] text-accent-gold">
              Every rip is real.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <MagneticButton
                className="bg-gradient-to-r from-accent-violet to-accent-cyan px-7 py-3.5 text-black shadow-[0_0_30px_-6px_rgba(139,92,246,0.7)]"
              >
                <Link href="/packs">Open a Pack</Link>
              </MagneticButton>
              <MagneticButton className="glass px-7 py-3.5 text-fg">
                <Link href="/perfect-cut">The Perfect Cut →</Link>
              </MagneticButton>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="relative"
          >
            <div className="pointer-events-none absolute inset-0 -z-10 scale-125 rounded-full bg-gradient-to-br from-accent-violet/25 via-accent-cyan/15 to-accent-gold/20 blur-3xl" />
            <SelfRippingPack />
          </motion.div>
        </div>
      </section>

      <RecentPullsTicker pulls={recentPulls} />

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">How it works</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <div className="font-display text-3xl font-black text-white/10">{step.n}</div>
              <h3 className="mt-2 font-display text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm text-fg-muted">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED PACKS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Featured packs</h2>
          <Link href="/packs" className="text-sm font-semibold text-accent-cyan hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((pack) => (
            <PackTile key={pack.id} pack={pack} onViewOdds={setOddsPack} />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">FAQ</h2>
        <div className="mt-6 flex flex-col gap-3">
          {FAQS.map((faq) => (
            <details key={faq.q} className="glass group rounded-2xl p-4 open:pb-4">
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                {faq.q}
                <span className="text-fg-muted transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm text-fg-muted">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <OddsModal pack={oddsPack} onClose={() => setOddsPack(null)} />
    </div>
  );
}
