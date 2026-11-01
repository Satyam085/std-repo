import { createFileRoute, Link } from "@tanstack/react-router";
import { DASHBOARD_URL } from "#/lib/config";
import {
  Layers,
  Database,
  Shield,
  Mail,
  Gauge,
  Terminal,
  Zap,
  Globe,
  Layout,
  Cpu,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/guide")({
  component: GuidePage,
});

function GuidePage() {
  const packages = [
    {
      name: "@repo/db",
      tag: "Drizzle ORM + Cloudflare D1",
      icon: Database,
      color: "bg-emerald-50 text-emerald-700",
      why: "Cloudflare D1 provides low-latency serverless SQLite at the edge. Drizzle ORM provides complete type safety, zero overhead, and rapid migrations with Drizzle Kit.",
      usedIn: "Both Web (server functions) & Dashboard (admin queries)",
    },
    {
      name: "@repo/auth",
      tag: "Better Auth + JWT Plugin",
      icon: Shield,
      color: "bg-blue-50 text-blue-700",
      why: "Built specifically for modern edge runtimes. Combined with the JWT plugin and D1 Drizzle adapter, it enables stateless token verification across subdomains without database roundtrips.",
      usedIn: "Both Web (/api/auth/*, login, register) & Dashboard (admin session guard)",
    },
    {
      name: "@repo/email",
      tag: "Resend SDK + Templates",
      icon: Mail,
      color: "bg-purple-50 text-purple-700",
      why: "High deliverability transactional email service with pre-designed responsive templates (welcome, reset-password, notifications) and a dev fallback console logger.",
      usedIn: "Storefront contact inquiries, welcome emails, password resets",
    },
    {
      name: "@repo/rate-limit",
      tag: "Cloudflare KV Sliding Window",
      icon: Gauge,
      color: "bg-amber-50 text-amber-700",
      why: "Edge-native sliding-window rate limiting using Cloudflare KV. Eliminates expensive external Redis instances while providing standard RFC headers.",
      usedIn: "API endpoints, form submissions, and authentication routes",
    },
    {
      name: "@repo/logger",
      tag: "Edge Structured JSON Logger",
      icon: Terminal,
      color: "bg-rose-50 text-rose-700",
      why: "Zero-dependency structured logger that pretty-prints in local development and emits JSON in production for Cloudflare Workers Observability, Axiom, and Logflare.",
      usedIn: "Both applications and shared packages for request tracing and timing",
    },
    {
      name: "Vite+ (vite-plus / vp)",
      tag: "VoidZero Unified Toolchain",
      icon: Cpu,
      color: "bg-cyan-50 text-cyan-700",
      why: "Replaces legacy ESLint + Prettier clutter with Oxlint (Rust linter) and Oxfmt (Rust formatter). Executes check, format, and lint across the entire monorepo in under 300ms.",
      usedIn: "Root workspace-wide code quality pipeline (pnpm check)",
    },
  ];

  return (
    <div className="page-container py-12 sm:py-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800 mb-4 border border-neutral-200">
          <Zap className="w-3.5 h-3.5 text-neutral-600" />
          Architecture & Ideology Guide
        </div>
        <h1 className="text-4xl font-extrabold text-neutral-950 tracking-tight sm:text-5xl">
          Architectural Foundation & Ideology
        </h1>
        <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
          A blueprint designed for maximum speed, developer autonomy, and minimal operational
          complexity by deploying natively to <strong>Cloudflare Workers</strong> with edge storage
          and unified tooling.
        </p>
      </div>

      {/* Core Ideology 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white p-8 rounded-3xl border border-neutral-200/90 shadow-sm">
          <div className="p-3 bg-neutral-100 text-neutral-900 rounded-2xl w-fit mb-5">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-neutral-950 mb-2">1. Edge-First Infrastructure</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Both apps and their storage run on Cloudflare Workers in 300+ edge locations worldwide.
            Zero container spin-ups, 0ms cold starts, and automated global replication with{" "}
            <strong>D1</strong> (SQL), <strong>R2</strong> (storage), and <strong>KV</strong>.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-neutral-200/90 shadow-sm">
          <div className="p-3 bg-neutral-100 text-neutral-900 rounded-2xl w-fit mb-5">
            <Layout className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-neutral-950 mb-2">
            2. Purpose-Driven App Rendering
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            The storefront uses <strong>SSR + TanStack Query</strong> for SEO and fast First
            Contentful Paint. The dashboard uses <strong>SPA Mode (zero SSR)</strong> for pure
            client navigation and lower compute overhead.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-neutral-200/90 shadow-sm">
          <div className="p-3 bg-neutral-100 text-neutral-900 rounded-2xl w-fit mb-5">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-neutral-950 mb-2">3. Zero-Debt Toolchain</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Powered by <strong>Vite+ (vp)</strong> using Rust-native <strong>Oxlint</strong> and{" "}
            <strong>Oxfmt</strong>. Runs monorepo checks in under 300ms, eliminating brittle ESLint
            plugin matrices and Prettier conflicts.
          </p>
        </div>
      </div>

      {/* Package Breakdown */}
      <div className="mb-16">
        <h2 className="text-2xl font-extrabold text-neutral-950 tracking-tight mb-6">
          Package-by-Package Reasoning
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <div
                key={pkg.name}
                className="bg-white p-6 rounded-3xl border border-neutral-200/90 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2.5 rounded-xl ${pkg.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-950 text-base">{pkg.name}</h3>
                      <span className="text-xs text-neutral-500">{pkg.tag}</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed mb-4">{pkg.why}</p>
                </div>
                <div className="pt-3 border-t border-neutral-100 flex items-center gap-2 text-xs text-neutral-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900" />
                  <span>{pkg.usedIn}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Storefront vs Dashboard Deep Dive */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-8 shadow-sm mb-16">
        <h2 className="text-2xl font-extrabold text-neutral-950 tracking-tight mb-6">
          Storefront vs Dashboard: The Split
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Aspect</th>
                <th className="pb-3 font-semibold text-neutral-900">Storefront (apps/web)</th>
                <th className="pb-3 font-semibold text-neutral-900">
                  Admin Dashboard (apps/dashboard)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              <tr>
                <td className="py-3 font-medium text-neutral-900">Rendering Mode</td>
                <td className="py-3 text-neutral-600">SSR (Server-Side Rendered)</td>
                <td className="py-3 text-neutral-600">
                  SPA Mode (defaultSsr: false, pure client shell)
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-neutral-900">Styling Engine</td>
                <td className="py-3 text-neutral-600">Tailwind CSS v4 (light & elegant theme)</td>
                <td className="py-3 text-neutral-600">
                  DaisyUI 5 + Tailwind CSS v4 (clean light theme)
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-neutral-900">Data Fetching</td>
                <td className="py-3 text-neutral-600">TanStack Query (SSR Hydration & cache)</td>
                <td className="py-3 text-neutral-600">Native TanStack Router Loaders (Lean RPC)</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-neutral-900">Deployment</td>
                <td className="py-3 text-neutral-600">Main domain (e.g. example.com)</td>
                <td className="py-3 text-neutral-600">Admin subdomain (e.g. admin.example.com)</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-neutral-900">Authentication</td>
                <td className="py-3 text-neutral-600">Better Auth customer signin/signup</td>
                <td className="py-3 text-neutral-600">Better Auth admin JWT validation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/products"
          className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition shadow-sm cursor-pointer"
        >
          Explore Catalog
        </Link>
        <a
          href={DASHBOARD_URL}
          target="_blank"
          rel="noreferrer"
          className="px-6 py-2.5 bg-white border border-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl hover:bg-neutral-50 transition shadow-sm inline-flex items-center gap-1.5"
        >
          <span>Open Admin Dashboard</span>
          <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
        </a>
      </div>
    </div>
  );
}
