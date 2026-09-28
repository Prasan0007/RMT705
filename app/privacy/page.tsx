import { LegalLayout } from "@/components/legal/LegalLayout";
import { LegalNotice } from "@/components/legal/LegalNotice";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="a template — set a real date once reviewed">
      <LegalNotice />

      <p>This describes what data FOILFALL actually collects and where it goes, given how this build is wired.</p>

      <h2>What we collect</h2>
      <p>
        <strong>Account data:</strong> name, email, and a bcrypt password hash (never your raw
        password) — stored in our Postgres database.
        <br />
        <strong>Activity data:</strong> every token balance change, pack pull, and Perfect Cut
        round, logged so balances and pulls can be audited.
        <br />
        <strong>Shipping data:</strong> only if you request a card shipped — name and postal
        address, stored against that order.
      </p>

      <h2>What we don&apos;t collect</h2>
      <p>
        We never see or store your card number — payments are handled entirely by Stripe, and we
        only receive a confirmation that a payment succeeded plus a reference ID.
      </p>

      <h2>Third parties we use</h2>
      <p>
        <strong>Stripe</strong> for payment processing.
        <br />
        <strong>Resend</strong> for transactional email (welcome, password reset, shipping
        updates).
        <br />
        [Add your hosting provider and database provider here — e.g. Vercel, Neon.]
      </p>

      <h2>Your rights</h2>
      <p>
        [Add the specific rights you&apos;re granting — access, deletion, export — and how to
        exercise them. If you have users in the EU/UK, California, or other jurisdictions with
        privacy statutes, this section needs to match those obligations specifically.]
      </p>

      <h2>Data retention</h2>
      <p>
        [State how long you keep account and transaction data, and your deletion process for
        closed accounts.]
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy:{" "}
        <a href="/support" className="text-accent-cyan hover:underline">
          Support
        </a>
        .
      </p>
    </LegalLayout>
  );
}
