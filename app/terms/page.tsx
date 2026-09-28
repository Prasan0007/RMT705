import { LegalLayout } from "@/components/legal/LegalLayout";
import { LegalNotice } from "@/components/legal/LegalNotice";

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="a template — set a real date once reviewed">
      <LegalNotice />

      <p>
        These terms govern your use of FOILFALL (&quot;we,&quot; &quot;us&quot;). By creating an
        account or purchasing tokens, you agree to them.
      </p>

      <h2>1. Eligibility</h2>
      <p>
        [Set a minimum age and, if your counsel advises it for your jurisdictions, ID or KYC
        requirements before real-money randomized rewards are offered to an account.]
      </p>

      <h2>2. Tokens</h2>
      <p>
        Tokens are a virtual credit redeemable only within FOILFALL for pack rips. Tokens have no
        cash value, cannot be transferred between accounts, and [state your refund policy — e.g.
        purchases are final except where required by law].
      </p>

      <h2>3. Pack odds</h2>
      <p>
        Every pack&apos;s rarity odds are published in full before purchase — see{" "}
        <a href="/odds-disclosure" className="text-accent-cyan hover:underline">
          Odds Disclosure
        </a>
        . Odds are generated from the same configuration the pull engine reads and will not be
        changed without updating that disclosure.
      </p>

      <h2>4. Graded cards, shipping, and sell-back</h2>
      <p>
        A pulled card is credited to your Vault. You may request it shipped to a physical address
        you provide, or sell it back for tokens at the rate shown at the time of sale. [Describe
        your actual grading process, expected shipping timelines, and what happens if a physical
        card can&apos;t be fulfilled.]
      </p>

      <h2>5. Prohibited use</h2>
      <p>
        No automated pack-ripping, multiple accounts to exploit bonuses, chargebacks in bad faith,
        or attempts to interfere with odds resolution. Violating this may result in account
        suspension and forfeiture of token balance, subject to applicable law.
      </p>

      <h2>6. Disclaimers &amp; liability</h2>
      <p>
        [Standard limitation-of-liability and warranty disclaimer language — have counsel draft
        this against your actual risk profile, especially around randomized real-money rewards.]
      </p>

      <h2>7. Changes</h2>
      <p>We may update these terms; continued use after a change means you accept the update.</p>

      <h2>8. Contact</h2>
      <p>
        [Your registered business name and contact address once the entity is formed.] See also{" "}
        <a href="/support" className="text-accent-cyan hover:underline">
          Support
        </a>
        .
      </p>
    </LegalLayout>
  );
}
