import { createAuthClient } from "better-auth/client";
import { jwtClient } from "better-auth/client/plugins";

export function createClient(baseURL?: string) {
  return createAuthClient({
    baseURL: baseURL || (typeof window !== "undefined" ? window.location.origin : undefined),
    plugins: [jwtClient()],
  });
}

export type AuthClient = ReturnType<typeof createClient>;
