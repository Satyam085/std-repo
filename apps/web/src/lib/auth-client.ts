import { createClient } from "@repo/auth/client";

export const authClient = createClient();
export const { signIn, signUp, signOut, useSession } = authClient;
