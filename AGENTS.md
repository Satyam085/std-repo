# 🤖 AI Agent Guidelines & Architecture Manual

This document provides essential context, architectural invariants, and operational workflows for AI coding assistants (e.g., Gemini, Claude, Cursor, Copilot, ChatGPT, Antigravity) working in this repository.

---

## 🧭 Repository Overview

This repository is an enterprise-grade full-stack monorepo designed specifically for deployment on **Cloudflare Workers**.

- **Package Manager**: `pnpm` (v12+ with pnpm workspaces configured in `pnpm-workspace.yaml`).
- **Monorepo Task Runner**: `turbo` (Turborepo v2+ in `turbo.json`).
- **Unified Toolchain**: `vite-plus` (`vp` by VoidZero) running Rust-native **Oxlint** and **Oxfmt**. **Do NOT install ESLint or Prettier.**
- **Deployment Platform**: Cloudflare Workers using `@cloudflare/vite-plugin` and `wrangler.jsonc`.

---

## 🏗️ Architecture & Dual-App Topology

The repository contains two distinct frontend applications sharing six modular workspace packages:

```
.
├── apps/
│   ├── web/                     # Public Storefront (SSR + TanStack Query + Form)
│   └── dashboard/               # Admin Console (SPA Mode + DaisyUI 5 + Native Loaders)
│
├── packages/
│   ├── db/                      # Drizzle ORM + Cloudflare D1 SQLite schemas & migrations
│   ├── auth/                    # Better Auth + D1 adapter + JWT stateless plugin
│   ├── email/                   # Resend SDK client + templates + dev fallback logger
│   ├── rate-limit/              # Cloudflare KV sliding-window rate limiter
│   ├── logger/                  # Edge structured JSON logger
│   └── tsconfig/                # Centralized TypeScript profiles
```

### 1. `apps/web` (Public Storefront)

- **Rendering Strategy**: **Server-Side Rendered (SSR)** with TanStack Start.
- **Data Layer**: `@tanstack/react-query` for hydrated server queries and client cache management.
- **Forms**: `@tanstack/react-form` with Zod schema validation.
- **Styling**: Tailwind CSS v4 in `apps/web/src/styles.css`.
- **Theme**: Light & elegant aesthetic (warm alabaster `#fafafa`, pure-white surfaces, slate borders).
- **Target URL**: Apex domain or main storefront (e.g., `https://example.com`).
- **Key Routes**:
  - `/` — Homepage / marketing hero.
  - `/products` — Product catalog hydrated via TanStack Query from Cloudflare D1.
  - `/contact` — Contact inquiry form with KV rate limiting and Resend email dispatch.
  - `/guide` — Interactive architecture and package reasoning guide.
  - `/login` & `/register` — Customer authentication screens.
  - `/api/auth/$` — Server route mounting the Better Auth handler.
  - `/api/contact` — Server route for contact submissions with rate limiting.

### 2. `apps/dashboard` (Backend Admin Console)

- **Rendering Strategy**: **SPA Mode (Zero SSR)** configured via `defaultSsr: false` in `apps/dashboard/src/router.tsx`.
- **Data Layer**: **Native TanStack Router loaders and TanStack Start RPC server functions (`createServerFn`)**.
  > ⚠️ **CRITICAL RULE FOR AGENTS**: **Never install or add `@tanstack/react-query` to `apps/dashboard`.** The dashboard must remain ultra-lean using native router loaders and server functions.
- **Styling**: **DaisyUI 5** via `@plugin "daisyui"` in `apps/dashboard/src/styles.css` with a **single, clean, light theme** (`light --default`).
- **Target URL**: Dedicated admin subdomain (e.g., `https://admin.example.com`).
- **Key Routes**:
  - `/` — Real-time telemetry, service health, and audit event stream.
  - `/users` — Cloudflare D1 User Directory with search and Better Auth role tags.
  - `/files` — Cloudflare R2 object storage explorer with direct link copying.
  - `/settings` — System and Cloudflare KV rate limiting configuration form.
  - `/guide` — Dashboard-specific package matrix and architecture guide.
  - `/login` — Dedicated admin login screen.

---

## 📦 Shared Packages Guidelines

### `@repo/db` (Database & ORM)

- Built on **Drizzle ORM** with Cloudflare D1 SQLite (`drizzle-orm/d1`).
- Schema definitions reside in `packages/db/src/schema/`:
  - `auth.ts` — Better Auth tables (`user`, `session`, `account`, `verification`).
  - `app.ts` — Application domain tables (`products`, `files`, `auditLogs`, `contacts`).
- Client initialization:
  ```typescript
  import { createDb } from "@repo/db";
  import { env } from "cloudflare:workers";

  const db = createDb(env.DB);
  ```
- **Migrations**: Always run `pnpm db:generate` after changing schemas.

### `@repo/auth` (Authentication)

- Built on **Better Auth** with D1 Drizzle adapter and JWT plugin (`jwt({ sessionCookieCache: true })`).
- The JWT plugin enables stateless cross-subdomain verification between `example.com` and `admin.example.com` without repetitive database roundtrips.
- Server mounting: Handled in `apps/web/src/routes/api/auth.$.ts`.
- Client usage:
  ```typescript
  import { signIn, signUp, useSession } from "#/lib/auth-client";
  ```

### `@repo/email` (Email Delivery)

- Built on **Resend** with responsive HTML and plaintext templates (`welcomeEmail`, `resetPasswordEmail`, `notificationEmail`).
- **Local Dev Fallback**: If `RESEND_API_KEY` is missing in development, the client logs the email body to the console instead of failing.

### `@repo/rate-limit` (Edge Rate Limiting)

- Edge-native sliding-window counter algorithm running on **Cloudflare KV**.
- Usage in server routes:
  ```typescript
  import { checkRateLimit, createRateLimitErrorResponse } from "@repo/rate-limit";

  const rateResult = await checkRateLimit(env.KV, request, {
    limit: 5,
    windowSeconds: 60,
    prefix: "api",
  });

  if (!rateResult.success) {
    return createRateLimitErrorResponse(rateResult);
  }
  ```

### `@repo/logger` (Structured Edge Logging)

- Structured JSON edge logger optimized for Cloudflare Workers runtime, Axiom, and Logflare ingests.
- Methods: `logger.info()`, `logger.warn()`, `logger.error()`, `logger.time()`, `logger.timeEnd()`.

---

## 🛠️ Mandatory Workflows & Commands

AI agents must execute the following commands when making changes:

| Action                     | Command                     | Notes                                               |
| :------------------------- | :-------------------------- | :-------------------------------------------------- |
| **Install Dependencies**   | `pnpm install`              | Uses workspace lockfile                             |
| **Run Dev Servers**        | `pnpm dev`                  | Storefront (port 3000), Dashboard (port 3001)       |
| **Lint & Format Check**    | `pnpm check`                | Runs `vp check` across all packages                 |
| **Auto-Fix Code Quality**  | `pnpm check:fix`            | Runs `vp check --fix` (Oxfmt + Oxlint)              |
| **Staged Git Check**       | `vp staged`                 | Automatically called by Git pre-commit hook         |
| **Enable Git Hooks**       | `vp hooks enable`           | Configures `.vite-hooks` dispatcher                 |
| **Type Check**             | `pnpm typecheck`            | Runs `tsc --noEmit` across all 8 workspace packages |
| **Build Apps**             | `pnpm build`                | Compiles production bundles via Turborepo           |
| **Generate DB Migrations** | `pnpm db:generate`          | Creates SQL migrations in `packages/db`             |
| **Sync Cloudflare IDs**    | `pnpm cf:sync`              | Syncs D1, KV, R2 IDs from `.env` to both wranglers  |
| **Apply DB Locally**       | `pnpm db:migrate:local`     | Applies migrations to Miniflare local D1            |
| **Approve Native Builds**  | `pnpm approve-builds --all` | Run if pnpm v12 blocks esbuild or workerd           |

---

## 🚨 Strict Invariants & Anti-Patterns for AI Agents

1. **NO ESLint / Prettier**:
   - Do **NOT** create `.eslintrc*`, `eslint.config.js`, or `.prettierrc`.
   - All formatting and linting is handled by Vite+ (`vp check` / `vp check --fix`) configured in root [`vite.config.ts`](./vite.config.ts).
2. **NO Nested README Files**:
   - Do **NOT** create `README.md` files in subdirectories or packages.
   - The universal root [`README.md`](./README.md) is the single source of truth for humans.
3. **DO NOT Add TanStack Query to Dashboard**:
   - `apps/dashboard` is strictly designed for **SPA mode** with native TanStack Router loaders and server functions (`createServerFn`). Keep it lean.
4. **DO NOT Reintroduce Dark Mode Hacks or Multi-Theme Churn**:
   - The UI is designed to be **light, clean, and elegant**.
   - Storefront uses Tailwind v4 with `#fafafa` background and crisp borders.
   - Dashboard uses DaisyUI 5 with a single light theme (`light --default`).
5. **DO NOT Edit `routeTree.gen.ts` Manually**:
   - `routeTree.gen.ts` in `apps/web` and `apps/dashboard` is automatically generated by TanStack Router. Create files inside `src/routes/` and let the router generate the tree.
6. **Cloudflare Worker Runtime Constraints**:
   - Cloudflare Workers run in the V8 `workerd` isolate runtime, not standard Node.js.
   - Never import Node-specific modules (`fs`, `child_process`, `net`) into Worker entry points.
   - Access Cloudflare bindings via `env` from `"cloudflare:workers"`.
   - Update `cloudflare-env.d.ts` when adding new bindings.

---

## 💡 Quick Recipes for Common Agent Tasks

### Adding a New Route

1. In `apps/web/src/routes/` (for storefront) or `apps/dashboard/src/routes/` (for dashboard), create `your-route.tsx`.
2. Define the route using `createFileRoute("/your-route")({ component: ... })`.
3. In `apps/dashboard`, fetch data using `loader: async () => await myServerFn()`.
4. In `apps/web`, if SEO and caching are needed, prefetch via TanStack Query and hydrate.
5. Run `pnpm check:fix && pnpm typecheck`.

### Adding a Database Table

1. Open `packages/db/src/schema/app.ts`.
2. Define the table with `sqliteTable("table_name", { ... })`.
3. Export the schema in `packages/db/src/schema/index.ts`.
4. Run `pnpm db:generate`.
5. Run `pnpm typecheck`.
