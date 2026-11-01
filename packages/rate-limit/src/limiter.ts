export interface RateLimitConfig {
  /** Maximum requests allowed in the window */
  limit: number;
  /** Time window in seconds */
  windowSeconds: number;
  /** Prefix for KV keys */
  prefix?: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Sliding-window rate limiter utilizing Cloudflare KV.
 * Edge-native with zero third-party service dependencies.
 */
export async function rateLimit(
  kv: KVNamespace,
  identifier: string,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  const { limit, windowSeconds, prefix = "rl" } = config;

  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const currentBucket = Math.floor(now / windowMs);
  const reset = (currentBucket + 1) * windowSeconds;

  const key = `${prefix}:${identifier}:${currentBucket}`;

  // Retrieve current request count
  const rawCount = await kv.get(key);
  const currentCount = rawCount ? parseInt(rawCount, 10) : 0;

  if (currentCount >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset,
    };
  }

  const nextCount = currentCount + 1;

  // Write updated count with TTL = twice window to safely expire
  await kv.put(key, nextCount.toString(), {
    expirationTtl: Math.max(60, windowSeconds * 2),
  });

  return {
    success: true,
    limit,
    remaining: Math.max(0, limit - nextCount),
    reset,
  };
}
