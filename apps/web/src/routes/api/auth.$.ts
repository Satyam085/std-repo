import { createFileRoute } from "@tanstack/react-router";
import { createAuth } from "@repo/auth/server";
import { createDb } from "@repo/db";
import { env } from "cloudflare:workers";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const db = createDb(env.DB);
        const auth = createAuth({
          db,
          secret: env.BETTER_AUTH_SECRET || "dev_secret_must_be_32_characters_long_for_security",
          baseURL: env.BETTER_AUTH_URL || new URL(request.url).origin,
          appName: "Storefront",
        });
        return auth.handler(request);
      },
      POST: async ({ request }) => {
        const db = createDb(env.DB);
        const auth = createAuth({
          db,
          secret: env.BETTER_AUTH_SECRET || "dev_secret_must_be_32_characters_long_for_security",
          baseURL: env.BETTER_AUTH_URL || new URL(request.url).origin,
          appName: "Storefront",
        });
        return auth.handler(request);
      },
    },
  },
});
