import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { signIn, signOut } from "#/lib/auth-client";
import { getAdminUser } from "#/lib/auth";
import { APP_NAME } from "#/lib/config";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    if (await getAdminUser()) throw redirect({ to: "/" });
  },
  component: AdminLoginPage,
});

const TITLE = `${APP_NAME.toUpperCase()}(8)`;

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn.email({ email, password });
    if (res.error) {
      setError(
        res.error.status === 429
          ? "Too many attempts. Wait a minute, then try again."
          : (res.error.message ?? "Sign-in failed. Check the email and password."),
      );
      setLoading(false);
      return;
    }
    // Signed in, but the console is admins only.
    if (!(await getAdminUser())) {
      await signOut();
      setError("This account has no admin role. Ask an admin to promote it, or see below.");
      setLoading(false);
      return;
    }
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-base-content">
        <div className="mx-auto max-w-3xl h-12 px-4 sm:px-6 flex items-center justify-between font-mono text-[13px]">
          <span className="font-bold">{TITLE}</span>
          <span className="hidden sm:block text-muted">System Administration Manual</span>
          <span className="font-bold">{TITLE}</span>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 py-12 divide-y divide-base-300">
        <section className="pb-7 sm:grid sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-8">
          <h2 className="man-h mb-3 sm:mb-0 sm:pt-1">Name</h2>
          <div>
            <h1 className="font-mono text-2xl font-bold tracking-tight">login</h1>
            <p className="mt-1.5 text-muted">Sign in to the {APP_NAME} admin console.</p>
          </div>
        </section>

        <section className="py-7 sm:grid sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-8">
          <h2 className="man-h mb-4 sm:mb-0 sm:pt-2">Options</h2>
          <form onSubmit={handleLogin} className="grid gap-4 max-w-sm">
            <div className="grid gap-1.5">
              <label htmlFor="admin-email" className="font-mono text-[13px] font-bold">
                --email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field"
              />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="admin-password" className="font-mono text-[13px] font-bold">
                --password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field"
              />
            </div>
            {error && (
              <p role="alert" className="font-mono text-[13px] text-error">
                error: {error}
              </p>
            )}
            <div className="-ml-2">
              <button type="submit" disabled={loading} className="ctl ctl-primary">
                {loading ? "signing in…" : "sign in"}
              </button>
            </div>
          </form>
        </section>

        <section className="pt-7 sm:grid sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-8">
          <h2 className="man-h mb-3 sm:mb-0 sm:pt-1">Notes</h2>
          <div className="text-sm text-muted grid gap-3 max-w-[65ch]">
            <p>
              Only accounts with role <code className="font-mono text-base-content">admin</code> get
              in. Promote the first one by hand:
            </p>
            <pre className="font-mono text-xs text-base-content bg-base-200 p-3 overflow-x-auto">
              {`pnpm --filter @repo/db exec wrangler d1 execute DB --local \\
  --persist-to ../../.wrangler/state \\
  --command "UPDATE user SET role='admin' WHERE email='you@example.com'"`}
            </pre>
            <p>For production, replace the --local and --persist-to flags with --remote.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
