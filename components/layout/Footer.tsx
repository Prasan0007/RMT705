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
              <Link href="/provably-fair" className="text-fg-muted hover:text-fg">Provably Fair</Link>
              <Link href="/odds-disclosure" className="text-fg-muted hover:text-fg">Odds Disclosure</Link>
              <Link href="/support" className="text-fg-muted hover:text-fg">Support</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-fg">Legal</span>
              <Link href="/terms" className="text-fg-muted hover:text-fg">Terms of Service</Link>
              <Link href="/privacy" className="text-fg-muted hover:text-fg">Privacy Policy</Link>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/[0.06] pt-6 text-xs text-fg-muted">
          Token purchases are processed securely through Stripe. We never see or store your card details.
          <div className="mt-1">© {new Date().getFullYear()} FOILFALL. All creatures and card frames are original placeholder designs.</div>
        </div>
      </div>
    </footer>
  );
}
