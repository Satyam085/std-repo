import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Zap, Database, Layers } from "lucide-react";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  const features = [
    {
      title: "Edge SSR Performance",
      description:
        "Rendered directly on Cloudflare Workers close to your users for near-instant First Contentful Paint and optimal SEO indexing.",
      icon: Zap,
    },
    {
      title: "Hydrated Query Layer",
      description:
        "TanStack Query fetches data during SSR and seamlessly hydrates the browser client cache for instant page-to-page navigation.",
      icon: Layers,
    },
    {
      title: "Stateless Auth & JWT",
      description:
        "Better Auth with SQLite D1 adapter and JWT tokens enabling secure authentication across storefront and admin subdomains.",
      icon: ShieldCheck,
    },
    {
      title: "Cloudflare D1 & R2",
      description:
        "Drizzle ORM on serverless SQLite with zero egress fee R2 object storage and KV sliding-window rate limiting.",
      icon: Database,
    },
  ];

  return (
    <main className="page-container py-16 sm:py-24">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 shadow-sm mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Cloudflare Edge · TanStack Start SSR
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-950 leading-[1.1]">
          Modern edge applications, refined from day one.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
          A high-performance monorepo template pairing a server-rendered TanStack Start storefront
          with an ultra-lean client dashboard, powered by Cloudflare Workers and Drizzle ORM.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800"
          >
            Explore Catalog
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/guide"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-800 shadow-sm transition hover:bg-neutral-50 hover:border-neutral-300"
          >
            Architecture Guide
          </Link>

          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900"
          >
            Admin Dashboard
            <span className="text-neutral-400">↗</span>
          </a>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="group rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-neutral-300"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 group-hover:bg-neutral-950 group-hover:text-white transition">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-neutral-900">{feature.title}</h3>
              <p className="mt-2 text-xs text-neutral-600 leading-relaxed">{feature.description}</p>
            </div>
          );
        })}
      </section>

      {/* Edge Architecture Highlight */}
      <section className="mt-16 rounded-3xl border border-neutral-200/90 bg-white p-8 sm:p-12 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Shared Monorepo Architecture
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
              Two distinct runtime strategies, one shared foundation.
            </h2>
            <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
              This storefront utilizes full SSR with TanStack Query hydration for peak SEO and
              customer performance. The companion dashboard runs in pure SPA mode using native
              TanStack Router loaders—completely eliminating unnecessary SSR execution costs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-2.5 text-xs font-semibold text-neutral-800 transition hover:bg-neutral-100"
            >
              Test Contact Form & Rate Limiter
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-800"
            >
              Customer Authentication
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
