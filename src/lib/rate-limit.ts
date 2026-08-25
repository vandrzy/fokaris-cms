// src/lib/rate-limit.ts
// Rate limiter in-memory sederhana (sliding window per-kunci).
// Catatan: state hilang saat restart & tidak sinkron antar-instance.
// Untuk produksi multi-instance, ganti Map dengan store eksternal (mis. Upstash Redis).

type Hit = { count: number; resetAt: number };
const buckets = new Map<string, Hit>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const hit = buckets.get(key);

  if (!hit || now > hit.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
  }

  if (hit.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs: hit.resetAt - now };
  }

  hit.count += 1;
  return { allowed: true, remaining: limit - hit.count, retryAfterMs: 0 };
}
