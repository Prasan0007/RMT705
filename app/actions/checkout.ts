"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { TOKEN_BUNDLES } from "@/lib/mock-data";

interface CheckoutError {
  ok: false;
  error: string;
}

/**
 * Creates a real Stripe Checkout session for a token bundle and redirects
 * the browser there. Runs in test mode until STRIPE_SECRET_KEY is a live
 * key — see README for the going-live checklist (business entity, Stripe
 * account activation, and a legal review of loot-box/gambling regulations
 * in the jurisdictions you'll operate in).
 */
export async function createCheckoutSessionAction(bundleId: string): Promise<CheckoutError> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "You need to be logged in to buy tokens." };

  const bundle = TOKEN_BUNDLES.find((b) => b.id === bundleId);
  if (!bundle) return { ok: false, error: "That bundle doesn't exist." };

  if (!stripeConfigured()) {
    return {
      ok: false,
      error: "Payments aren't configured yet — add STRIPE_SECRET_KEY to enable real checkout (see README).",
    };
  }

  const stripe = getStripe()!;
  const totalTokens = Math.round(bundle.tokens * (1 + bundle.bonusPct / 100));
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: session.user.email ?? undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(bundle.priceUsd * 100),
          product_data: {
            name: `${totalTokens.toLocaleString()} FOILFALL tokens`,
            description: bundle.bonusPct > 0 ? `Includes a ${bundle.bonusPct}% bonus` : undefined,
          },
        },
      },
    ],
    metadata: {
      userId: session.user.id,
      bundleId: bundle.id,
      totalTokens: String(totalTokens),
    },
    success_url: `${appUrl}/store?checkout=success`,
    cancel_url: `${appUrl}/store?checkout=canceled`,
  });

  if (!checkoutSession.url) return { ok: false, error: "Could not start checkout. Try again." };

  redirect(checkoutSession.url);
}
