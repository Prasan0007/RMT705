import { headers } from "next/headers";
import { db } from "./db";

const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_MAX_ATTEMPTS = 8;

/** True when `identifier` has too many recent recorded attempts and should
 * be blocked for now. Reuses the same table for logins, signups, and
 * password-reset requests — `identifier` is namespaced by caller (e.g.
 * `login:email`, `signup-ip:1.2.3.4`) so the windows never mix. */
export async function isRateLimited(
  identifier: string,
  opts: { windowMs?: number; max?: number } = {}
): Promise<boolean> {
  const since = new Date(Date.now() - (opts.windowMs ?? DEFAULT_WINDOW_MS));
  const count = await db.authAttempt.count({
    where: { identifier, createdAt: { gte: since } },
  });
  return count >= (opts.max ?? DEFAULT_MAX_ATTEMPTS);
}

export async function recordFailedAttempt(identifier: string): Promise<void> {
  await db.authAttempt.create({ data: { identifier } });
}

/** Best-effort client IP from proxy headers — fine for coarse abuse
 * throttling, not identity. Returns "unknown" if nothing is set (e.g. local
 * dev without a proxy in front), which just buckets all such requests
 * together rather than failing. */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}
