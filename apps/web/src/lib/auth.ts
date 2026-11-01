import { createServerOnlyFn } from "@tanstack/react-start";
import { createAuth } from "@repo/auth/server";
import { createDb } from "@repo/db";
import { env } from "cloudflare:workers";

let auth: ReturnType<typeof createAuth> | undefined;

// One Better Auth instance per isolate. Server-only, so route files can import it safely.
export const getAuth = createServerOnlyFn(
  () =>
    (auth ??= createAuth({
      db: createDb(env.DB),
      secret: env.BETTER_AUTH_SECRET,
      baseURL: env.BETTER_AUTH_URL,
      cookieDomain: env.AUTH_COOKIE_DOMAIN,
      appName: env.APP_NAME ?? "Storefront",
    })),
);
