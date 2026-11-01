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
    <div className="min-h-[75vh] flex items-center justify-center">
      <div className="card w-full max-w-md bg-base-100 border border-base-300 shadow-xl">
        <div className="card-body p-8">
          <div className="flex flex-col items-center text-center mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="card-title text-xl font-black">Admin Access</h2>
            <p className="text-xs text-base-content/60 mt-1">
              Secured with Better Auth + JWT Plugin on Cloudflare Workers
            </p>
          </div>

          {error && (
            <div className="alert alert-error text-xs p-3 mb-4">
              <ShieldAlert className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-xs">Email Address</span>
              </label>
              <input
                type="email"
                required
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered input-sm w-full"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-xs">Password</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered input-sm w-full"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-sm w-full mt-4">
              {loading ? "Authenticating..." : "Sign in to Console"}
            </button>
          </form>

          <div className="text-center text-xs text-base-content/50 mt-6 pt-4 border-t border-base-200">
            Cloudflare D1 & KV Session Authentication
          </div>
        </div>
      </div>
    </div>
  );
}
