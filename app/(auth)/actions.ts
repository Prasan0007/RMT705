"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { db } from "@/lib/db";

const WELCOME_BONUS = 100;

const signupSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(60),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export interface ActionResult {
  error?: string;
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

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists." };
  }

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
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", { email, password, redirectTo: "/packs" });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw err;
  }

  return {};
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
