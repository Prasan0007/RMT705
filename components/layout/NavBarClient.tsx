"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { useUiStore } from "@/lib/store";
import { TokenOdometer } from "@/components/common/TokenOdometer";
import { signOutAction } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/packs", label: "Pack Shop" },
  { href: "/store", label: "Token Store" },
  { href: "/vault", label: "Vault" },
  { href: "/leaderboard", label: "Live Feed" },
  { href: "/perfect-cut", label: "The Perfect Cut" },
];

interface NavUser {
  name: string;
  email: string;
  tokens: number;
  role: "USER" | "ADMIN";
}

export function NavBarClient({ user }: { user: NavUser | null }) {
  const pathname = usePathname();
  const streamerMode = useUiStore((s) => s.streamerMode);
  const toggleStreamerMode = useUiStore((s) => s.toggleStreamerMode);
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-bg/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-violet via-accent-cyan to-accent-gold text-sm text-black">
            F
          </span>
          <span className="text-gradient">FOILFALL</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-white/10 text-fg"
                  : "text-fg-muted hover:bg-white/5 hover:text-fg"
              )}
            >
              {link.label}
            </Link>
          ))}
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                pathname.startsWith("/admin") ? "bg-white/10 text-fg" : "text-fg-muted hover:bg-white/5 hover:text-fg"
              )}
            >
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user && (
            <button
              onClick={toggleStreamerMode}
              className={cn(
                "hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors sm:flex",
                streamerMode
                  ? "border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan"
                  : "border-white/10 text-fg-muted hover:text-fg"
              )}
              title="Toggle Streamer Mode"
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", streamerMode ? "bg-accent-cyan" : "bg-fg-muted")} />
              Streamer
            </button>
          )}

          {user && !streamerMode && (
            <div className="glass hidden items-center gap-1.5 rounded-full px-3 py-1.5 sm:flex">
              <span className="h-2 w-2 rounded-full bg-accent-gold" />
              <span className="font-mono text-sm font-semibold tabular-nums">
                <TokenOdometer value={user.tokens} />
              </span>
            </div>
          )}

          {user ? (
            <Link
              href="/store"
              className="rounded-full bg-gradient-to-r from-accent-violet to-accent-cyan px-4 py-2 text-sm font-semibold text-black shadow-[0_0_20px_-4px_rgba(139,92,246,0.7)] transition-transform hover:scale-[1.03]"
            >
              Get Tokens
            </Link>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="rounded-full px-3.5 py-2 text-sm font-medium text-fg-muted hover:text-fg">
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-gradient-to-r from-accent-violet to-accent-cyan px-4 py-2 text-sm font-semibold text-black shadow-[0_0_20px_-4px_rgba(139,92,246,0.7)] transition-transform hover:scale-[1.03]"
              >
                Sign Up
              </Link>
            </div>
          )}

          <button
            className="rounded-lg p-2 text-fg lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 bg-fg" />
              <span className="block h-0.5 w-5 bg-fg" />
              <span className="block h-0.5 w-5 bg-fg" />
            </div>
          </button>
        </div>
      </nav>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-white/[0.06] px-4 pb-4 lg:hidden"
        >
          <div className="flex flex-col gap-1 pt-3">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium",
                  pathname === link.href ? "bg-white/10 text-fg" : "text-fg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <button
                  onClick={toggleStreamerMode}
                  className="mt-1 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-fg-muted"
                >
                  {streamerMode ? "Exit" : "Enable"} Streamer Mode
                </button>
                <div className="mt-1 flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5 text-sm">
                  <span className="text-fg-muted">{user.email}</span>
                  <form action={signOutAction}>
                    <button className="font-semibold text-accent-cyan">Log Out</button>
                  </form>
                </div>
              </>
            ) : (
              <div className="mt-1 flex flex-col gap-1">
                <Link href="/login" className="rounded-lg px-3 py-2.5 text-sm font-medium text-fg-muted">
                  Log In
                </Link>
                <Link href="/signup" className="rounded-lg px-3 py-2.5 text-sm font-medium text-accent-cyan">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
