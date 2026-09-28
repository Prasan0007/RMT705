export default function ProvablyFairPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-accent-cyan">Provably Fair</div>
      <h1 className="font-display text-3xl font-black sm:text-4xl">How pulls are resolved</h1>

      <div className="mt-8 flex flex-col gap-5 text-sm leading-relaxed text-fg-muted">
        <p>
          Every pack pull and Perfect Cut round is resolved with a random seed generated on our
          server at the moment you spend tokens — never in your browser, and never influenced by
          anything the client sends us. That seed feeds the same weighted-odds engine shown on the{" "}
          <a href="/odds-disclosure" className="text-accent-cyan hover:underline">
            Odds Disclosure
          </a>{" "}
          page, deterministically, so the same seed always produces the same result.
        </p>

        <div>
          <h2 className="font-display text-lg font-bold text-fg">Before the pull</h2>
          <p className="mt-1">
            We show you a SHA-256 hash of that seed before you know the outcome — proof we
            committed to a specific seed in advance, without revealing it.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-fg">After the pull</h2>
          <p className="mt-1">
            The raw seed is revealed once your result is final. You can independently hash it
            yourself and confirm it matches the hash shown beforehand — proof we didn&apos;t swap
            seeds after seeing what you&apos;d get.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-fg">What this proves, and what it doesn&apos;t — yet</h2>
          <p className="mt-1">
            It proves the seed wasn&apos;t chosen after the fact. It does not yet prove the seed
            was chosen without any bias, or let you independently re-run our exact weighting
            function outside our servers — that requires us to open-source the resolution code and
            let you verify the hash-to-outcome mapping yourself, which we haven&apos;t built into
            this UI yet.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-fg">The Perfect Cut, specifically</h2>
          <p className="mt-1">
            The cut line and your swipe score are both resolved server-side the same way. One
            caveat: the line has to reach your browser to render the 2-second flash, so — unlike
            the rest of the fairness model — a sufficiently determined person could inspect network
            traffic and read it early. The scoring and the resulting card are still fully
            server-side and can&apos;t be influenced by editing anything in your browser.
          </p>
        </div>
      </div>
    </div>
  );
}
