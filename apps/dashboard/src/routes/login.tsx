import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { signIn } from "../lib/auth-client";
import { ShieldAlert, KeyRound } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: AdminLoginPage,
});

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

    const res = await signIn.email({
      email,
      password,
    });

    if (res.error) {
      setError(res.error.message || "Authentication failed");
      setLoading(false);
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-10 h-10 rounded-xl bg-base-200 text-base-content flex items-center justify-center mb-3">
              <KeyRound className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Admin Console Access</h1>
            <p className="text-xs text-base-content/60 mt-1">
              Secured with Better Auth + JWT on Cloudflare Workers
            </p>
          </div>

          {error && (
            <div className="alert alert-error text-xs p-3 mb-4 rounded-xl border border-error/20">
              <ShieldAlert className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-control">
              <label className="label py-1" htmlFor="admin-email">
                <span className="label-text font-semibold text-xs">Email Address</span>
              </label>
              <input
                id="admin-email"
                type="email"
                required
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered input-sm w-full text-xs"
              />
            </div>

            <div className="form-control">
              <label className="label py-1" htmlFor="admin-password">
                <span className="label-text font-semibold text-xs">Password</span>
              </label>
              <input
                id="admin-password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered input-sm w-full text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-neutral btn-sm w-full mt-2 text-xs font-semibold cursor-pointer shadow-sm"
            >
              {loading ? "Authenticating..." : "Sign in to Console"}
            </button>
          </form>

          <div className="text-center text-[11px] text-base-content/50 mt-6 pt-4 border-t border-base-200">
            Protected by Cloudflare KV Sliding Window Limit
          </div>
        </div>
      </div>
    </div>
  );
}
