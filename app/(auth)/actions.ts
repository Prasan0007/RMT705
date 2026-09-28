"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import { isRateLimited, recordFailedAttempt, getClientIp } from "@/lib/rate-limit";
import { sendWelcomeEmail, sendPasswordResetEmail } from "@/lib/email";
import { randomSeed, sha256Hex } from "@/lib/rng";

const WELCOME_BONUS = 100;
const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

const signupSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(60),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export interface ActionResult {
  error?: string;
  ok?: boolean;
}

export async function signupAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, email, password } = parsed.data;

  if (await isRateLimited(`signup:${email}`)) {
    return { error: "Too many attempts. Try again in a few minutes." };
  }

  // Coarser IP-level cap so the welcome-token bonus can't be bot-farmed by
  // spinning up new emails — signals only, so a shared NAT/office IP still
  // gets a generous allowance rather than being blocked outright.
  const ip = await getClientIp();
  if (await isRateLimited(`signup-ip:${ip}`, { windowMs: 60 * 60 * 1000, max: 6 })) {
    return { error: "Too many accounts created from this network recently. Try again later." };
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    await recordFailedAttempt(`signup:${email}`);
    return { error: "An account with that email already exists." };
  }

  await recordFailedAttempt(`signup-ip:${ip}`);

  const passwordHash = await bcrypt.hash(password, 12);

  await db.user.create({
    data: {
      name,
      email,
      passwordHash,
      tokenBalance: WELCOME_BONUS,
      transactions: {
        create: {
          type: "WELCOME_BONUS",
          amount: WELCOME_BONUS,
          balanceAfter: WELCOME_BONUS,
          note: "Welcome bonus",
        },
      },
    },
  });

  sendWelcomeEmail(email, name).catch((err) => console.error("welcome email failed", err));

  try {
    await signIn("credentials", { email, password, redirectTo: "/packs" });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Account created, but sign-in failed. Try logging in." };
    }
    throw err;
  }

  return {};
}

export async function loginAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (await isRateLimited(`login:${email}`)) {
    return { error: "Too many failed attempts. Try again in 15 minutes." };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/packs" });
  } catch (err) {
    if (err instanceof AuthError) {
      await recordFailedAttempt(`login:${email}`);
      return { error: "Invalid email or password." };
    }
    throw err;
  }

  return {};
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

const emailSchema = z.string().trim().toLowerCase().email();

export async function requestPasswordResetAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) return { error: "Enter a valid email." };
  const email = parsed.data;

  if (await isRateLimited(`reset:${email}`)) {
    return { error: "Too many attempts. Try again in a few minutes." };
  }
  await recordFailedAttempt(`reset:${email}`); // counts regardless of outcome — this is a request-rate limit

  const user = await db.user.findUnique({ where: { email } });
  // Always report success even when the account doesn't exist, so this
  // can't be used to enumerate registered emails.
  if (!user) return { ok: true };

  const rawToken = randomSeed() + randomSeed();
  const tokenHash = await sha256Hex(rawToken);

  await db.passwordResetToken.create({
    data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS) },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;
  await sendPasswordResetEmail(email, resetUrl).catch((err) => console.error("reset email failed", err));

  return { ok: true };
}

const resetSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function resetPasswordAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = resetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const tokenHash = await sha256Hex(parsed.data.token);
  const record = await db.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return { error: "This reset link is invalid or has expired." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await db.$transaction([
    db.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    db.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ]);

  return { ok: true };
}
