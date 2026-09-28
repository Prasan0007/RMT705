"use server";

import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { gradeForCard } from "@/lib/odds";
import { randomSeed } from "@/lib/rng";
import { generateSerial } from "@/lib/serial";
import {
  generateCutLine,
  scorePrecision,
  tierForPrecision,
  drawTierCard,
  type CutLine,
} from "@/lib/perfect-cut";

const PERFECT_CUT_PRICE = 1000;

export interface StartCutResult {
  ok: true;
  roundId: string;
  trueLine: CutLine;
  seed: string;
  balanceAfter: number;
}

export interface ActionError {
  ok: false;
  error: string;
}

/**
 * TODO(server-hardening): the true line still has to reach the client to be
 * rendered for the 2s flash, so a determined player could inspect network
 * traffic and read it early. Real hardening would render the flash as a
 * server-drawn image/video frame instead of raw coordinates. What *is*
 * fully server-side here, and can't be spoofed by editing client state, is
 * the scoring and the resulting card/grade — see submitCutAction below.
 */
export async function startCutAction(): Promise<StartCutResult | ActionError> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "You need to be logged in." };
  const userId = session.user.id;

  try {
    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
      if (user.tokenBalance < PERFECT_CUT_PRICE) throw new Error("INSUFFICIENT_TOKENS");

      const seed = randomSeed();
      const trueLine = generateCutLine(seed);
      const balanceAfter = user.tokenBalance - PERFECT_CUT_PRICE;

      await tx.user.update({ where: { id: userId }, data: { tokenBalance: balanceAfter } });
      await tx.tokenTransaction.create({
        data: {
          userId,
          type: "PERFECT_CUT_SPEND",
          amount: -PERFECT_CUT_PRICE,
          balanceAfter,
          note: "The Perfect Cut",
        },
      });

      const round = await tx.perfectCutRound.create({
        data: { userId, seed, cost: PERFECT_CUT_PRICE, trueLine: trueLine as unknown as Prisma.InputJsonValue },
      });

      return { roundId: round.id, trueLine, seed, balanceAfter };
    });

    return { ok: true, ...result };
  } catch (err) {
    if (err instanceof Error && err.message === "INSUFFICIENT_TOKENS") {
      return { ok: false, error: "Not enough tokens for The Perfect Cut." };
    }
    throw err;
  }
}

export interface SubmitCutResult {
  ok: true;
  precision: number;
  angleDiffDeg: number;
  positionDiff: number;
  tier: "elite" | "premium" | "standard";
  cardId: string;
  grade: number;
  serial: string;
}

/** Scores the swipe and resolves the pull entirely from server-held state —
 * the client supplies only the coordinates it swiped, nothing else. */
export async function submitCutAction(roundId: string, userLine: CutLine): Promise<SubmitCutResult | ActionError> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "You need to be logged in." };
  const userId = session.user.id;

  const round = await db.perfectCutRound.findUnique({ where: { id: roundId } });
  if (!round || round.userId !== userId) return { ok: false, error: "Round not found." };
  if (round.status !== "PENDING") return { ok: false, error: "This round was already resolved." };

  const trueLine = round.trueLine as unknown as CutLine;
  const result = scorePrecision(trueLine, userLine);
  const tier = tierForPrecision(result.precision);
  const card = drawTierCard(tier, round.seed);
  const grade = gradeForCard(card, round.seed);
  const serial = generateSerial();

  await db.$transaction([
    db.perfectCutRound.update({
      where: { id: roundId },
      data: {
        userLine: userLine as unknown as Prisma.InputJsonValue,
        precision: result.precision,
        tier: tier.id.toUpperCase() as "ELITE" | "PREMIUM" | "STANDARD",
        cardId: card.id,
        grade,
        status: "RESOLVED",
        resolvedAt: new Date(),
      },
    }),
    db.vaultItem.create({
      data: {
        userId,
        cardId: card.id,
        grade,
        serial,
        packId: "perfect-cut",
      },
    }),
  ]);

  return {
    ok: true,
    precision: result.precision,
    angleDiffDeg: result.angleDiffDeg,
    positionDiff: result.positionDiff,
    tier: tier.id,
    cardId: card.id,
    grade,
    serial,
  };
}
