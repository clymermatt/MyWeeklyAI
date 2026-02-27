import { createHmac, timingSafeEqual } from "crypto";

const getSecret = () => {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET is not set");
  return secret;
};

export function generateUnsubscribeToken(userId: string): string {
  return createHmac("sha256", getSecret())
    .update(userId)
    .digest("hex");
}

export function verifyUnsubscribeToken(userId: string, token: string): boolean {
  const expected = generateUnsubscribeToken(userId);
  if (expected.length !== token.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}

export function generateUnsubscribeUrl(userId: string): string {
  const token = generateUnsubscribeToken(userId);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.myweekly.ai";
  return `${baseUrl}/api/user/unsubscribe?uid=${userId}&token=${token}`;
}
