import { PACKS, buildOddsTable } from "@/lib/odds";
import { PRECISION_TIERS, buildTierOddsTable } from "@/lib/perfect-cut";
import { RARITY_LABEL } from "@/lib/types";
import { RarityDot } from "@/components/common/GlassPanel";
import { formatTokens } from "@/lib/utils";

export default function OddsDisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-accent-cyan">Odds Disclosure</div>
      <h1 className="font-display text-3xl font-black sm:text-4xl">Every pack&apos;s real odds</h1>
      <p className="mt-3 text-fg-muted">
        This page is generated directly from the same configuration the pull engine reads — what
        you see here is what actually resolves every rip. There is no separate, hidden table.
      </p>

      <div className="mt-10 flex flex-col gap-6">
        {PACKS.filter((p) => p.tier !== "perfect-cut").map((pack) => (
          <div key={pack.id} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">{pack.name}</h2>
              <span className="font-mono text-sm text-fg-muted">{formatTokens(pack.price)} tokens</span>
            </div>
            <div className="mt-3 flex flex-col gap-1.5">
              {buildOddsTable(pack).map((entry) => (
                <div key={entry.rarity} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5">
                    <RarityDot rarity={entry.rarity} />
                    {RARITY_LABEL[entry.rarity]}
                  </span>
                  <span className="font-mono">{(entry.probability * 100).toFixed(2)}%</span>
                </div>
              ))}
            </div>
            {pack.guaranteedMinRarity && (
              <p className="mt-2 text-xs text-fg-muted">
                Guaranteed: at least one {RARITY_LABEL[pack.guaranteedMinRarity]}+ card per pack.
              </p>
            )}
          </div>
        ))}
      </div>

      <h2 className="mb-4 mt-14 font-display text-xl font-bold">The Perfect Cut precision tiers</h2>
      <p className="mb-6 text-sm text-fg-muted">
        Your swipe precision selects which of these three tables you pull from — see{" "}
        <a href="/perfect-cut" className="text-accent-cyan hover:underline">
          The Perfect Cut
        </a>
        .
      </p>
      <div className="flex flex-col gap-6">
        {PRECISION_TIERS.map((tier) => (
          <div key={tier.id} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">{tier.label}</h3>
              <span className="text-xs font-semibold text-fg-muted">{tier.minPrecision}%+ precision</span>
            </div>
            <div className="mt-3 flex flex-col gap-1.5">
              {buildTierOddsTable(tier).map((entry) => (
                <div key={entry.rarity} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5">
                    <RarityDot rarity={entry.rarity} />
                    {RARITY_LABEL[entry.rarity]}
                  </span>
                  <span className="font-mono">{(entry.probability * 100).toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
