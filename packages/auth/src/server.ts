import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { jwt, bearer } from "better-auth/plugins";
import type { Database } from "@repo/db";
import { user, session, account, verification, jwks, auditLogs } from "@repo/db/schema";

export interface CreateAuthOptions {
  db: Database;
  /** Unset in local dev → Better Auth's dev default. Unset in production → Better Auth throws. */
  secret?: string;
  /** Unset → inferred from the incoming request. */
  baseURL?: string;
  appName?: string;
  /** e.g. "example.com" → one session shared by example.com and admin.example.com. */
  cookieDomain?: string;
}

export function createAuth({
  db,
  secret,
  baseURL,
  appName = "App",
  cookieDomain,
}: CreateAuthOptions) {
  const audit = (
    action: string,
    entity: string,
    entityId: string,
    actorId: string,
    ip?: string | null,
  ) =>
    db.insert(auditLogs).values({
      id: crypto.randomUUID(),
      action,
      entity,
      entityId,
      actorId,
      ip: ip ?? null,
      createdAt: new Date(),
    });

  return betterAuth({
    appName,
    baseURL,
    secret,
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: { user, session, account, verification, jwks },
    }),
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      minPasswordLength: 8,
    },
    user: {
      additionalFields: {
        // input: false → clients can't self-assign "admin" at sign-up.
        role: { type: "string", defaultValue: "user", input: false },
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
      // Signed JWT session cache: getSession skips D1 for 5 minutes.
      cookieCache: { enabled: true, maxAge: 60 * 5, strategy: "jwt" },
    },
    // Feeds the dashboard's event log.
    databaseHooks: {
      user: {
        create: {
          after: async (u) => {
            await audit("user.created", "user", u.id, u.id);
          },
        },
      },
      session: {
        create: {
          after: async (s) => {
            await audit("session.created", "session", s.id, s.userId, s.ipAddress);
          },
        },
      },
    },
    advanced: cookieDomain
      ? { crossSubDomainCookies: { enabled: true, domain: cookieDomain } }
      : undefined,
    plugins: [jwt({ sessionCookieCache: true }), bearer()],
  });
}

export type AuthInstance = ReturnType<typeof createAuth>;
