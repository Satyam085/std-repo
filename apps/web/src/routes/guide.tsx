import { createFileRoute, Link } from "@tanstack/react-router";
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
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      why: "Cloudflare D1 is SQLite at the edge with zero server maintenance. Drizzle ORM provides 100% type safety, zero runtime overhead, and fast schema migrations with Drizzle Kit.",
      usedIn: "Both Web (server functions) & Dashboard (admin queries)",
    },
    {
      name: "@repo/auth",
      tag: "Better Auth + JWT Plugin",
      icon: Shield,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      why: "Modern open-source auth built for edge runtimes. Paired with the JWT plugin and D1 Drizzle adapter, it enables stateless token verification across multiple subdomains without database roundtrips.",
      usedIn: "Both Web (/api/auth/*, login, register) & Dashboard (admin session guard)",
    },
    {
      name: "@repo/email",
      tag: "Resend SDK + Templates",
      icon: Mail,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      why: "Top-tier email deliverability with clean developer experience. Features pre-designed responsive templates (welcome, reset-password, notifications) and a dev fallback console logger.",
      usedIn: "Storefront contact inquiries, welcome emails, password resets",
    },
    {
      name: "@repo/rate-limit",
      tag: "Cloudflare KV Sliding Window",
      icon: Gauge,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      why: "Edge-native sliding-window rate limiting using native Cloudflare KV. Eliminates the need for expensive external Redis instances while providing standard X-RateLimit-* headers.",
      usedIn: "API endpoints, form submissions, and authentication routes",
    },
    {
      name: "@repo/logger",
      tag: "Edge Structured JSON Logger",
      icon: Terminal,
      color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      why: "Zero-dependency structured logger that pretty-prints in development and emits JSON in production for Cloudflare Workers Observability, Axiom, and Logflare.",
      usedIn: "Both applications and shared packages for request tracing and timing",
    },
    {
      name: "Vite+ (vite-plus / vp)",
      tag: "VoidZero Unified Toolchain",
      icon: Cpu,
      color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
      why: "Replaces legacy ESLint + Prettier clutter with Oxlint (Rust linter) and Oxfmt (Rust formatter). Executes check, format, and lint across the entire monorepo in under 300ms.",
      usedIn: "Root workspace-wide code quality pipeline (pnpm check)",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 mb-4 border border-teal-500/20">
          <Zap className="w-3.5 h-3.5" />
          Architecture & Ideology Guide
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
          Why this template is built this way
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          A blueprint designed for speed, developer autonomy, and minimal operational overhead by
          deploying natively to <strong>Cloudflare Workers</strong> with edge storage and unified
          tooling.
        </p>
      </div>

      {/* Core Ideology 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-3 bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 rounded-xl w-fit mb-5">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            1. Edge-First Infrastructure
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Both apps and their storage run on Cloudflare Workers in 300+ edge locations worldwide.
            Zero container spin-ups, 0ms cold starts, and automated global replication with{" "}
            <strong>D1</strong> (SQL), <strong>R2</strong> (storage), and <strong>KV</strong>.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl w-fit mb-5">
            <Layout className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            2. Purpose-Driven App Rendering
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            The storefront uses <strong>SSR + TanStack Query</strong> for SEO and fast First
            Contentful Paint. The dashboard uses <strong>SPA Mode (zero SSR)</strong> for pure
            client navigation and lower compute overhead.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl w-fit mb-5">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            3. Zero-Debt Toolchain
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Powered by <strong>Vite+ (vp)</strong> using Rust-native <strong>Oxlint</strong> and{" "}
            <strong>Oxfmt</strong>. Runs monorepo checks in under 300ms, eliminating brittle ESLint
            plugin matrices and Prettier conflicts.
          </p>
        </div>
      </div>

      {/* Package Breakdown */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Package-by-Package Reasoning
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <div
                key={pkg.name}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2.5 rounded-xl ${pkg.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{pkg.name}</h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{pkg.tag}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    {pkg.why}
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>{pkg.usedIn}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Storefront vs Dashboard Deep Dive */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Storefront vs Dashboard: The Split
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-400 uppercase text-xs">
                <th className="pb-3 font-semibold">Aspect</th>
                <th className="pb-3 font-semibold text-teal-600 dark:text-teal-400">
                  Storefront (apps/web)
                </th>
                <th className="pb-3 font-semibold text-blue-600 dark:text-blue-400">
                  Admin Dashboard (apps/dashboard)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
              <tr>
                <td className="py-3 font-medium text-gray-900 dark:text-white">Rendering Mode</td>
                <td className="py-3 text-gray-600 dark:text-gray-300">
                  SSR (Server-Side Rendered)
                </td>
                <td className="py-3 text-gray-600 dark:text-gray-300">
                  SPA Mode (defaultSsr: false, pure client shell)
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-gray-900 dark:text-white">Styling Engine</td>
                <td className="py-3 text-gray-600 dark:text-gray-300">
                  Tailwind CSS v4 (custom storefront theme)
                </td>
                <td className="py-3 text-gray-600 dark:text-gray-300">
                  DaisyUI 5 + Tailwind CSS v4 (theme switcher)
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-gray-900 dark:text-white">Data Fetching</td>
                <td className="py-3 text-gray-600 dark:text-gray-300">
                  TanStack Query (SSR Hydration & cache)
                </td>
                <td className="py-3 text-gray-600 dark:text-gray-300">
                  Native TanStack Router Loaders (Lean RPC)
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-gray-900 dark:text-white">Deployment</td>
                <td className="py-3 text-gray-600 dark:text-gray-300">
                  Main domain (e.g. example.com)
                </td>
                <td className="py-3 text-gray-600 dark:text-gray-300">
                  Admin subdomain (e.g. admin.example.com)
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-gray-900 dark:text-white">Authentication</td>
                <td className="py-3 text-gray-600 dark:text-gray-300">
                  Better Auth customer signin/signup
                </td>
                <td className="py-3 text-gray-600 dark:text-gray-300">
                  Better Auth admin JWT validation
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/products"
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors cursor-pointer"
        >
          Explore Storefront
        </Link>
        <a
          href="http://localhost:3001"
          target="_blank"
          rel="noreferrer"
          className="px-6 py-3 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity inline-flex items-center gap-2"
        >
          <span>Open Admin Dashboard</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
