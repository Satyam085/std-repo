import { createFileRoute } from "@tanstack/react-router";
import { Layers, Shield, Cpu, HardDrive, Sparkles } from "lucide-react";

export const Route = createFileRoute("/guide")({
  component: DashboardGuidePage,
});

function DashboardGuidePage() {
  const decisions = [
    {
      title: "Why SPA Mode in Dashboard?",
      badge: "Architecture",
      color: "badge-primary",
      icon: Sparkles,
      content:
        "Admin dashboards live behind authentication and do not need search engine indexing (SEO). By running TanStack Start in SPA Mode (defaultSsr: false), all loaders, state, and routes execute purely on the client. This avoids hydration mismatches, speeds up client transitions, and eliminates unnecessary SSR compute costs on Cloudflare Workers.",
    },
    {
      title: "Why Native Loaders over TanStack Query in Dashboard?",
      badge: "Data Layer",
      color: "badge-secondary",
      icon: Layers,
      content:
        "TanStack Router includes complete data loading, route preloading, search parameter parsing, and invalidation lifecycles out-of-the-box. Coupling native route loaders with TanStack Start RPC server functions creates a lean, zero-bloat dashboard without needing @tanstack/react-query or additional query wrappers.",
    },
    {
      title: "Why DaisyUI 5 for Admin UI?",
      badge: "UI Framework",
      color: "badge-accent",
      icon: Layers,
      content:
        'DaisyUI 5 runs directly as a pure CSS plugin for Tailwind CSS v4 (@plugin "daisyui"). It provides pre-built semantic components (drawers, stat cards, tables, badges, modals, avatars) and instant multi-theme switching (light, corporate, emerald, winter) with zero client JS runtime overhead.',
    },
    {
      title: "Why Cloudflare D1 + R2 + KV?",
      badge: "Storage",
      color: "badge-success",
      icon: HardDrive,
      content:
        "Cloudflare provides a unified edge serverless stack: D1 provides low-latency serverless SQLite with Drizzle ORM, R2 stores user files with zero egress fees, and KV powers the edge sliding-window rate limiter and session caching. Local development uses Miniflare to simulate all three automatically.",
    },
    {
      title: "Why Better Auth with JWT Plugin?",
      badge: "Authentication",
      color: "badge-info",
      icon: Shield,
      content:
        "Better Auth natively supports Drizzle ORM on Cloudflare D1. The JWT plugin allows stateless token verification across separate subdomains (e.g. example.com storefront and admin.example.com dashboard) without redundant database lookups on every route transition.",
    },
    {
      title: "Why Vite+ (vp) as Monorepo Toolchain?",
      badge: "DevOps",
      color: "badge-neutral",
      icon: Cpu,
      content:
        "Vite+ by VoidZero integrates Rust-native Oxlint (linter) and Oxfmt (formatter). Running `pnpm check` checks all files across both apps and six packages in under 300ms, replacing fragile ESLint/Prettier configs with a single root configuration.",
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="bg-base-100 p-8 rounded-2xl border border-base-300 shadow-sm">
        <div className="badge badge-primary badge-outline text-xs mb-3 font-bold">
          Ideology & Architecture Guide
        </div>
        <h1 className="text-3xl font-black tracking-tight">How & Why This Dashboard Works</h1>
        <p className="text-sm text-base-content/70 mt-2 max-w-2xl leading-relaxed">
          An architectural breakdown explaining the specific design choices behind this dashboard,
          its edge deployment model, and how shared monorepo packages are consumed.
        </p>
      </div>

      {/* Decision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {decisions.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`badge badge-sm font-semibold ${item.color}`}>{item.badge}</span>
                  <Icon className="w-4 h-4 text-base-content/50" />
                </div>
                <h3 className="card-title text-base font-bold">{item.title}</h3>
                <p className="text-xs text-base-content/70 leading-relaxed mt-2">{item.content}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Package Mapping Reference */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body p-6">
          <h2 className="text-lg font-bold mb-4">Dashboard Package Usage Matrix</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-xs">
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Role in Dashboard</th>
                  <th>Key Imports / APIs</th>
                  <th>Binding Needed</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-bold">@repo/db</td>
                  <td>Direct SQLite queries for user directory & audit logs</td>
                  <td>
                    <code>createDb</code>, <code>user</code>, <code>products</code>
                  </td>
                  <td>
                    <code>env.DB</code>
                  </td>
                </tr>
                <tr>
                  <td className="font-bold">@repo/auth</td>
                  <td>Admin session management & client authentication</td>
                  <td>
                    <code>createClient</code>, <code>useSession</code>, <code>jwtClient</code>
                  </td>
                  <td>
                    <code>BETTER_AUTH_SECRET</code>
                  </td>
                </tr>
                <tr>
                  <td className="font-bold">@repo/rate-limit</td>
                  <td>Protects admin API endpoints from brute-force access</td>
                  <td>
                    <code>rateLimit</code>, <code>checkRateLimit</code>
                  </td>
                  <td>
                    <code>env.KV</code>
                  </td>
                </tr>
                <tr>
                  <td className="font-bold">@repo/logger</td>
                  <td>Structured request and operation timing logs</td>
                  <td>
                    <code>logger.time</code>, <code>logger.timeEnd</code>
                  </td>
                  <td>None (console/edge)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
