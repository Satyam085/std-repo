import { createMiddleware, createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
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
      appName: env.APP_NAME ?? "Admin Dashboard",
    })),
);

// The signed-in user when they hold role "admin", otherwise null.
export const getAdminUser = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAuth().api.getSession({ headers: getRequestHeaders() });
  return session?.user.role === "admin" ? session.user : null;
});

// Attach to every server function that reads or writes admin data.
export const adminOnly = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const session = await getAuth().api.getSession({ headers: getRequestHeaders() });
  if (session?.user.role !== "admin") throw new Error("Unauthorized");
  return next({ context: { user: session.user } });
});
