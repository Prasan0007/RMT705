export default function SupportPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
      <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-accent-cyan">Support</div>
      <h1 className="font-display text-3xl font-black sm:text-4xl">Need a hand?</h1>
      <p className="mt-4 text-fg-muted">
        [Wire this to a real inbox or helpdesk — e.g. support@yourdomain.com, or a form posting to
        your ticketing system — once your entity and domain are set up.]
      </p>
      <div className="glass mx-auto mt-8 max-w-sm rounded-2xl p-6 text-left text-sm text-fg-muted">
        <p className="font-semibold text-fg">Common questions</p>
        <ul className="mt-3 flex flex-col gap-2">
          <li>
            <a href="/odds-disclosure" className="text-accent-cyan hover:underline">
              Pack odds
            </a>{" "}
            — every pack&apos;s full rarity table.
          </li>
          <li>
            <a href="/provably-fair" className="text-accent-cyan hover:underline">
              How pulls are resolved
            </a>{" "}
            — the fairness mechanism.
          </li>
          <li>
            <a href="/vault" className="text-accent-cyan hover:underline">
              Ship or sell back a card
            </a>{" "}
            — from your Vault.
          </li>
          <li>
            <a href="/terms" className="text-accent-cyan hover:underline">
              Terms of Service
            </a>{" "}
            /{" "}
            <a href="/privacy" className="text-accent-cyan hover:underline">
              Privacy Policy
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
