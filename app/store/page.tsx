import { auth } from "@/auth";
import { db } from "@/lib/db";
import { TokenBundleCard } from "@/components/store/TokenBundleCard";
import { TOKEN_BUNDLES } from "@/lib/mock-data";
import { formatTokens } from "@/lib/utils";
import { CheckoutBanner } from "@/components/store/CheckoutBanner";

export default async function TokenStorePage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const { checkout } = await searchParams;
  const session = await auth();

  let tokens: number | null = null;
  if (session?.user?.id) {
    const user = await db.user.findUnique({ where: { id: session.user.id }, select: { tokenBalance: true } });
    tokens = user?.tokenBalance ?? 0;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <CheckoutBanner status={checkout} />

      <div className="mb-10 text-center">
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-accent-cyan">Token Store</div>
        <h1 className="font-display text-3xl font-black sm:text-4xl">Fuel your next rip</h1>
        <p className="mx-auto mt-3 max-w-lg text-fg-muted">
          Tokens never expire and carry across every pack tier. Bigger bundles unlock a bonus.
        </p>
        {tokens !== null ? (
          <div className="glass mx-auto mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-accent-gold" />
            <span className="text-sm text-fg-muted">Current balance</span>
            <span className="font-mono text-sm font-bold">{formatTokens(tokens)}</span>
          </div>
        ) : (
          <div className="glass mx-auto mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-fg-muted">
            <a href="/login" className="font-semibold text-accent-cyan hover:underline">
              Log in
            </a>
            to buy tokens
          </div>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TOKEN_BUNDLES.map((bundle) => (
          <TokenBundleCard key={bundle.id} bundle={bundle} highlighted={bundle.badge === "Best Value"} />
        ))}
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {[
          { title: "Instant delivery", body: "Tokens land in your balance the moment checkout completes." },
          { title: "No expiration", body: "Spend them today or save up for a Grail Hunter pack." },
          { title: "Secure checkout", body: "Payments are processed by Stripe — we never see your card details." },
        ].map((f) => (
          <div key={f.title} className="glass rounded-2xl p-5">
            <h3 className="font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-fg-muted">{f.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
