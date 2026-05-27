/**
 * Shareable URL-safe result IDs for AssessmentResult (spec 11.9).
 * Format: "<roleprefix>-<8 chars base64url>". E.g. "swe-7f3a9b2c".
 */

import crypto from "node:crypto";

export function generateResultId(prefix: string): string {
  const random = crypto.randomBytes(6).toString("base64url");
  return `${prefix}-${random}`;
}
