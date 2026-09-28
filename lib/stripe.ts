import Stripe from "stripe";

let client: Stripe | null = null;

/** Returns null (instead of throwing at import time) when no key is
 * configured yet, so the rest of the app keeps working before Stripe is
 * set up — the checkout action turns a null client into a friendly error. */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!client) client = new Stripe(key);
  return client;
}

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
