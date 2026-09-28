"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getPack, simulatePull, gradeForCard } from "@/lib/odds";
import { randomSeed } from "@/lib/rng";
import { generateSerial } from "@/lib/serial";

export interface RipResultItem {
  cardId: string;
  grade: number;
  serial: string;
}

export interface RipResult {
  ok: true;
  items: RipResultItem[];
  seed: string;
  balanceAfter: number;
}

export interface RipError {
  ok: false;
  error: string;
}

/**
 * Resolves a pack rip entirely server-side: the client never decides what
 * it pulled, it only plays back the animation for what the server already
 * resolved. This closes the obvious cheat vector the old client-only demo
 * had (anyone could edit the local pull result before it hit the vault).
 */
export async function ripPackAction(packId: string): Promise<RipResult | RipError> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "You need to be logged in to rip a pack." };

  const pack = getPack(packId);
  if (!pack) return { ok: false, error: "That pack doesn't exist." };

  const userId = session.user.id;

  try {
    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
      if (user.tokenBalance < pack.price) {
        throw new Error("INSUFFICIENT_TOKENS");
      }

      const seed = randomSeed();
      const cards = simulatePull(pack, seed);
      const items: RipResultItem[] = cards.map((card) => ({
        cardId: card.id,
        grade: gradeForCard(card, seed),
        serial: generateSerial(),
      }));

      const balanceAfter = user.tokenBalance - pack.price;

      await tx.user.update({ where: { id: userId }, data: { tokenBalance: balanceAfter } });

      await tx.tokenTransaction.create({
        data: {
          userId,
          type: "RIP_SPEND",
          amount: -pack.price,
          balanceAfter,
          note: `Ripped ${pack.name}`,
        },
      });

      await tx.pullEvent.create({
        data: {
          userId,
          packId: pack.id,
          seed,
          cardIds: items.map((i) => i.cardId),
          grades: items.map((i) => i.grade),
          cost: pack.price,
        },
      });

      await tx.vaultItem.createMany({
        data: items.map((i) => ({
          userId,
          cardId: i.cardId,
          grade: i.grade,
          serial: i.serial,
          packId: pack.id,
        })),
      });

      return { items, seed, balanceAfter };
    });

    return { ok: true, ...result };
  } catch (err) {
    if (err instanceof Error && err.message === "INSUFFICIENT_TOKENS") {
      return { ok: false, error: "Not enough tokens for this pack." };
    }
    throw err;
  }
}
