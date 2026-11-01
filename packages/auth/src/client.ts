import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";
import type { AuthInstance } from "./server";

// baseURL defaults to window.location.origin, i.e. each app talks to its own /api/auth.
export function createClient(baseURL?: string) {
  return createAuthClient({
    baseURL,
    plugins: [jwtClient(), inferAdditionalFields<AuthInstance>()],
  });
}

export type AuthClient = ReturnType<typeof createClient>;
