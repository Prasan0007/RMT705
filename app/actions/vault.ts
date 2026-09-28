"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { cardById } from "@/lib/card-catalog";
import { sellBackOffer } from "@/lib/pricing";
import { sendShipRequestedEmail } from "@/lib/email";

interface ActionResult {
  ok: boolean;
  error?: string;
}

async function requireUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function sellBackAction(vaultItemId: string): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "Not logged in." };

  const item = await db.vaultItem.findUnique({ where: { id: vaultItemId } });
  if (!item || item.userId !== userId) return { ok: false, error: "Card not found." };
  if (item.status !== "VAULTED") return { ok: false, error: "This card can't be sold right now." };

  const card = cardById(item.cardId);
  const offer = sellBackOffer(card.value, item.grade);

  await db.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
    const balanceAfter = user.tokenBalance + offer;

    await tx.user.update({ where: { id: userId }, data: { tokenBalance: balanceAfter } });
    await tx.tokenTransaction.create({
      data: { userId, type: "SELL_BACK", amount: offer, balanceAfter, note: `Sold ${card.name}` },
    });
    await tx.vaultItem.update({ where: { id: vaultItemId }, data: { status: "SOLD" } });
  });

  revalidatePath("/vault");
  return { ok: true };
}

export async function toggleShowcaseAction(vaultItemId: string): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "Not logged in." };

  const item = await db.vaultItem.findUnique({ where: { id: vaultItemId } });
  if (!item || item.userId !== userId) return { ok: false, error: "Card not found." };

  await db.vaultItem.update({ where: { id: vaultItemId }, data: { showcased: !item.showcased } });
  revalidatePath("/vault");
  return { ok: true };
}

export interface ShipAddress {
  recipientName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export async function shipAction(vaultItemId: string, address: ShipAddress): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "Not logged in." };

  const item = await db.vaultItem.findUnique({ where: { id: vaultItemId } });
  if (!item || item.userId !== userId) return { ok: false, error: "Card not found." };
  if (item.status !== "VAULTED") return { ok: false, error: "This card already has a request in progress." };

  if (!address.recipientName || !address.addressLine1 || !address.city || !address.postalCode) {
    return { ok: false, error: "Fill in the full shipping address." };
  }

  const [user] = await db.$transaction([
    db.user.findUniqueOrThrow({ where: { id: userId }, select: { email: true } }),
    db.vaultItem.update({ where: { id: vaultItemId }, data: { status: "SHIP_REQUESTED" } }),
    db.order.create({
      data: {
        userId,
        vaultItemId,
        recipientName: address.recipientName,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || null,
        city: address.city,
        region: address.region,
        postalCode: address.postalCode,
        country: address.country,
      },
    }),
  ]);

  const card = cardById(item.cardId);
  sendShipRequestedEmail(user.email, card.name).catch((err) => console.error("ship-requested email failed", err));

  revalidatePath("/vault");
  return { ok: true };
}
