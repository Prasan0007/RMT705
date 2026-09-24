import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-bg">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col justify-between gap-8 sm:flex-row">
          <div>
            <div className="font-display text-lg font-bold text-gradient">FOILFALL</div>
            <p className="mt-2 max-w-xs text-sm text-fg-muted">Every rip is real.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-fg">Product</span>
              <Link href="/packs" className="text-fg-muted hover:text-fg">Pack Shop</Link>
              <Link href="/vault" className="text-fg-muted hover:text-fg">Vault</Link>
              <Link href="/leaderboard" className="text-fg-muted hover:text-fg">Live Feed</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-fg">Company</span>
              <span className="text-fg-muted">Provably Fair</span>
              <span className="text-fg-muted">Odds Disclosure</span>
              <span className="text-fg-muted">Support</span>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/[0.06] pt-6 text-xs text-fg-muted">
          Demo build. Mock data and mock checkout only — no real payments are processed.
          <div className="mt-1">© {new Date().getFullYear()} FOILFALL. All creatures and card frames are original placeholder designs.</div>
        </div>
      </div>
    </footer>
  );
}
