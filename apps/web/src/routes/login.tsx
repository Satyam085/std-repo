import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { signIn } from "../lib/auth-client";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn.email({
      email,
      password,
    });

    if (res.error) {
      setError(res.error.message || "Failed to log in");
      setLoading(false);
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-neutral-200/90">
        <div className="text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-950 tracking-tight">Sign In</h2>
          <p className="mt-1.5 text-xs text-neutral-500">
            Or{" "}
            <Link
              to="/register"
              className="font-semibold text-neutral-900 underline underline-offset-4 hover:text-neutral-700"
            >
              create a new account
            </Link>
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 cursor-pointer shadow-sm transition mt-2"
          >
            {loading ? "Signing in..." : "Sign In with Better Auth"}
          </button>
        </form>
      </div>
    </div>
  );
}
