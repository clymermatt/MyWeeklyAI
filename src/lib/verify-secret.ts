import { timingSafeEqual } from "crypto";

/**
 * Timing-safe comparison of two secret strings.
 * Returns false if either value is missing or lengths differ.
 */
export function verifySecret(actual: string | null, expected: string | null | undefined): boolean {
  if (!actual || !expected) return false;
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

/**
 * Verify a Bearer token against CRON_SECRET.
 */
export function verifyCronSecret(authHeader: string | null): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return verifySecret(authHeader, `Bearer ${secret}`);
}
