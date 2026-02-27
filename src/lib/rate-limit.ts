/**
 * Simple in-memory rate limiter using a sliding window.
 * Works per serverless instance — not shared across instances,
 * but still prevents abuse from a single source within one instance.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Periodically clean up expired entries to prevent memory leaks
const CLEANUP_INTERVAL = 60_000; // 1 minute
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}

/**
 * Check if a request should be rate-limited.
 * @param key   Unique identifier (e.g. IP address or IP+path)
 * @param limit Maximum requests per window
 * @param windowMs Time window in milliseconds
 * @returns Object with `limited` boolean and `remaining` count
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { limited: boolean; remaining: number } {
  cleanup();

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, remaining: limit - 1 };
  }

  entry.count++;

  if (entry.count > limit) {
    return { limited: true, remaining: 0 };
  }

  return { limited: false, remaining: limit - entry.count };
}
