import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { jwt, bearer } from "better-auth/plugins";
import type { Database } from "@repo/db";
import { user, session, account, verification } from "@repo/db/schema";

export interface CreateAuthOptions {
  db: Database;
  secret: string;
  baseURL?: string;
  appName?: string;
}

export function createAuth(options: CreateAuthOptions) {
  const { db, secret, baseURL, appName = "App" } = options;

  return betterAuth({
    appName,
    baseURL,
    secret,
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: {
        user,
        session,
        account,
        verification,
      },
    }),
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
    },
    plugins: [
      jwt({
        sessionCookieCache: true,
      }),
      bearer(),
    ],
  });
}

export type AuthInstance = ReturnType<typeof createAuth>;
