"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { cardById } from "@/lib/card-catalog";
import { sendShippedEmail } from "@/lib/email";

interface ActionResult {
  ok: boolean;
  error?: string;
}

async function requireAdmin(): Promise<string | null> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return null;
  return session.user.id;
}

export async function markShippedAction(orderId: string, trackingNumber: string, carrier: string): Promise<ActionResult> {
  const adminId = await requireAdmin();
  if (!adminId) return { ok: false, error: "Admin access required." };
  if (!trackingNumber.trim() || !carrier.trim()) return { ok: false, error: "Tracking number and carrier are required." };

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { user: { select: { email: true } }, vaultItem: { select: { cardId: true } } },
  });
  if (!order) return { ok: false, error: "Order not found." };

  await db.$transaction([
    db.order.update({
      where: { id: orderId },
      data: { status: "SHIPPED", trackingNumber, carrier },
    }),
    db.vaultItem.update({ where: { id: order.vaultItemId }, data: { status: "SHIPPED" } }),
  ]);

  const card = cardById(order.vaultItem.cardId);
  sendShippedEmail(order.user.email, card.name, carrier, trackingNumber).catch((err) =>
    console.error("shipped email failed", err)
  );

  revalidatePath("/admin/orders");
  return { ok: true };
}

export async function markLabelCreatedAction(orderId: string): Promise<ActionResult> {
  const adminId = await requireAdmin();
  if (!adminId) return { ok: false, error: "Admin access required." };

  await db.order.update({ where: { id: orderId }, data: { status: "LABEL_CREATED" } });
  revalidatePath("/admin/orders");
  return { ok: true };
}

export async function grantTokensAction(userEmail: string, amount: number, note: string): Promise<ActionResult> {
  const adminId = await requireAdmin();
  if (!adminId) return { ok: false, error: "Admin access required." };
  if (!Number.isFinite(amount) || amount === 0) return { ok: false, error: "Enter a non-zero amount." };

  const user = await db.user.findUnique({ where: { email: userEmail.trim().toLowerCase() } });
  if (!user) return { ok: false, error: "No account with that email." };

  const balanceAfter = user.tokenBalance + amount;
  if (balanceAfter < 0) return { ok: false, error: "That would take the balance negative." };

  await db.$transaction([
    db.user.update({ where: { id: user.id }, data: { tokenBalance: balanceAfter } }),
    db.tokenTransaction.create({
      data: {
        userId: user.id,
        type: "ADMIN_GRANT",
        amount,
        balanceAfter,
        note: note.trim() || "Manual admin adjustment",
      },
    }),
  ]);

  revalidatePath("/admin");
  return { ok: true };
}
