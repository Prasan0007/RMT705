import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature." }, { status: 400 });

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  // Idempotency: Stripe can and does deliver the same event more than once.
  const already = await db.webhookEvent.findUnique({ where: { id: event.id } });
  if (already) return NextResponse.json({ received: true });

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const totalTokens = Number(session.metadata?.totalTokens ?? 0);

    if (userId && totalTokens > 0) {
      await db.$transaction(async (tx) => {
        const user = await tx.user.findUnique({ where: { id: userId } });
        if (!user) return;

        const balanceAfter = user.tokenBalance + totalTokens;
        await tx.user.update({ where: { id: userId }, data: { tokenBalance: balanceAfter } });
        await tx.tokenTransaction.create({
          data: {
            userId,
            type: "PURCHASE",
            amount: totalTokens,
            balanceAfter,
            stripeSessionId: session.id,
            note: "Token bundle purchase",
          },
        });
      });
    }
  }

  await db.webhookEvent.create({ data: { id: event.id, type: event.type } });

  return NextResponse.json({ received: true });
}
