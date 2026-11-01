import { createFileRoute } from "@tanstack/react-router";
import { checkRateLimit, createRateLimitErrorResponse } from "@repo/rate-limit";
import { env } from "cloudflare:workers";
import { getAuth } from "#/lib/auth";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => getAuth().handler(request),
      // Sign-in, sign-up and password routes: 10 per IP per minute, counted in KV across isolates.
      POST: async ({ request }) => {
        const limit = await checkRateLimit(env.KV, request, {
          limit: 10,
          windowSeconds: 60,
          prefix: "auth",
        });
        return limit.success ? getAuth().handler(request) : createRateLimitErrorResponse(limit);
      },
    },
  },
});
