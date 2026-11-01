import type { RateLimitConfig, RateLimitResult } from "./limiter";
import { rateLimit } from "./limiter";

export function getClientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "127.0.0.1"
  );
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.reset.toString(),
  };

  if (!result.success) {
    const retryAfter = Math.max(1, result.reset - Math.floor(Date.now() / 1000));
    headers["Retry-After"] = retryAfter.toString();
  }

  return headers;
}

export function createRateLimitErrorResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      error: "Too Many Requests",
      message: "Rate limit exceeded. Please try again later.",
      resetInSeconds: Math.max(1, result.reset - Math.floor(Date.now() / 1000)),
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        ...getRateLimitHeaders(result),
      },
    },
  );
}

export async function checkRateLimit(
  kv: KVNamespace,
  request: Request,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  const ip = getClientIp(request);
  return rateLimit(kv, ip, config);
}
