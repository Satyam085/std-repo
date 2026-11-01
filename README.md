# 🚀 Production TanStack Start Monorepo Template (Cloudflare)

An enterprise-ready, modular full-stack monorepo template built for high performance and low operational complexity on **Cloudflare Workers**.

Powered by **pnpm workspaces**, **Turborepo**, **Vite+** (VoidZero), **TanStack Start**, **DaisyUI 5**, **Drizzle ORM**, **Better Auth with JWT**, **Resend**, and **Cloudflare D1 / R2 / KV**.

---

## 🌟 Architecture & Features

### 1. Applications (`apps/*`)

- **Storefront / Website (`apps/web`)**:
  - **TanStack Start with SSR**: Server-Side Rendered for SEO and fast First Contentful Paint.
  - **TanStack Query (`@tanstack/react-query`)**: Hydrated data fetching and automatic cache syncing.
  - **TanStack Form (`@tanstack/react-form`)**: Headless, type-safe form validation with Zod.
  - **Tailwind CSS v4**: Ultra-fast utility styling.
  - **Pre-built Routes**: Product catalog with SSR query hydration, Contact form with sliding-window rate limiting & Resend email, Better Auth Sign In & Sign Up screens.
- **Backend Admin Dashboard (`apps/dashboard`)**:
  - **TanStack Start in SPA Mode**: Pure client-rendered navigation (`defaultSsr: false`) with zero SSR overhead.
  - **DaisyUI 5 + Tailwind CSS v4**: Minimalist admin UI styled with a clean, light, and accessible theme (`light`).
  - **Native Data Loaders & RPC Functions**: 100% lean architecture using TanStack Router loaders and server functions without extra query library bloat.
  - **Pre-built Views**: Collapsible DaisyUI Drawer layout, System Overview with live telemetry stat cards, Cloudflare D1 User Directory, Cloudflare R2 File Storage explorer, and Settings form.

### 2. Shared Packages (`packages/*`)

- **`@repo/db`**: Drizzle ORM configured for SQLite and Cloudflare D1. Includes Drizzle Kit migration workflows and pre-built schemas (`user`, `session`, `account`, `verification`, `products`, `files`, `auditLogs`, `contacts`).
- **`@repo/auth`**: Better Auth with D1 Drizzle adapter, JWT plugin (`jwt({ sessionCookieCache: true })`), bearer tokens, and typed client SDK.
- **`@repo/email`**: Resend transactional email client with pre-designed responsive templates (`welcome`, `resetPassword`, `notification`) and a zero-config local development mock.
- **`@repo/rate-limit`**: Sliding-window rate limiter utilizing Cloudflare KV with RFC-compliant headers (`X-RateLimit-*`, `Retry-After`).
- **`@repo/logger`**: Structured JSON logger optimized for Cloudflare Workers edge runtime and Axiom/Logflare ingests with execution timers and log levels.
- **`@repo/tsconfig`**: Centralized TypeScript profiles (`base`, `react`, `cloudflare`).

### 3. Vite+ Unified Toolchain (`vite-plus` / `vp`)

- Replaces legacy ESLint + Prettier sprawl with **Vite+** by VoidZero.
- **Oxlint**: Sub-second Rust-powered linter.
- **Oxfmt**: Ultra-fast code formatting.
- Single-pass `pnpm check` for format, lint, and type checking across the entire monorepo.

---

## 📁 Repository Structure

```
.
├── apps/
│   ├── web/                     # Storefront (TanStack Start SSR + Query + Form)
│   │   ├── src/routes/          # Index, Products, Contact, Login, Register, API
│   │   ├── wrangler.jsonc       # Storefront Worker deployment config
│   │   └── vite.config.ts       # @cloudflare/vite-plugin + TanStack Start
│   │
│   └── dashboard/               # Admin Console (TanStack Start SPA + DaisyUI 5)
│       ├── src/routes/          # Overview, Users, R2 Files, Settings, Login
│       ├── src/components/      # DaisyUI Drawer & Navigation Layout
│       ├── wrangler.jsonc       # Admin Worker deployment config
│       └── vite.config.ts
│
├── packages/
│   ├── db/                      # Drizzle ORM + D1 SQLite schemas & migrations
│   ├── auth/                    # Better Auth + D1 adapter + JWT plugin
│   ├── email/                   # Resend SDK + templates + dev fallback logger
│   ├── rate-limit/              # Cloudflare KV sliding-window rate limiter
│   ├── logger/                  # Edge structured JSON logger
│   └── tsconfig/                # Shared TypeScript compiler options
│
├── turbo.json                   # Turborepo task pipeline
├── vite.config.ts               # Root Vite+ (vp) linter & formatter configuration
├── pnpm-workspace.yaml          # Workspace package registry & allowed builds
└── package.json                 # Monorepo root scripts
```

---

## 🧬 Starting a New Product From This Template

1. Copy `.env.example` to `.env` and fill it in. It's gitignored; IDs and secrets never go in tracked files.
2. Rename the workers (`name` in both `apps/*/wrangler.jsonc`), the resources (`database_name`, `bucket_name`), and `APP_NAME` in their `vars`.
3. Rebrand the dashboard with `VITE_APP_NAME` in `.env` and the single accent `--color-primary` in `apps/dashboard/src/styles.css`. Its design rules are in `apps/dashboard/DESIGN.md`.
4. Set `VITE_STOREFRONT_URL` / `VITE_DASHBOARD_URL` so each app links to the other's real domain.

---

## ⚡ Quick Start

### 1. Prerequisites

- **Node.js** v20+ or v22+
- **pnpm** v12+ (`npm install -g pnpm`)

### 2. Installation

```bash
pnpm install
```

### 3. Apply Database Migrations Locally

```bash
pnpm db:migrate:local
```

Both apps and this command share one local D1/KV/R2 state in `.wrangler/state/` at the repo root, so an account created on the storefront can sign in to the dashboard.

### 4. Start Local Development

```bash
# Run both applications concurrently:
pnpm dev

# Or run individually:
pnpm dev:web         # Storefront at http://localhost:3000
pnpm dev:dashboard   # Dashboard at http://localhost:3001
```

### 5. Create Your First Admin

Register on the storefront (`/register`), then promote the account. The dashboard only admits `role = 'admin'`:

```bash
pnpm --filter @repo/db exec wrangler d1 execute DB --local --persist-to ../../.wrangler/state \
  --command "UPDATE user SET role='admin' WHERE email='you@example.com'"
```

For production, replace `--local --persist-to …` with `--remote`. After that, manage roles from the dashboard's `/users` page.

> **Note on Local Storage Simulation**: The `@cloudflare/vite-plugin` automatically emulates Cloudflare D1, R2, and KV bindings locally using Miniflare during `pnpm dev`. You don't need active Cloudflare credentials to develop locally!

---

## 🛠️ CLI Commands Cheat Sheet

| Task                    | Command                 | Description                                                       |
| :---------------------- | :---------------------- | :---------------------------------------------------------------- |
| **Start Dev**           | `pnpm dev`              | Runs storefront (port 3000) and dashboard (port 3001) in parallel |
| **Format & Lint**       | `pnpm check`            | Runs Vite+ (`vp check`) across all apps & packages                |
| **Auto-Fix Code**       | `pnpm check:fix`        | Fixes formatting (Oxfmt) & lint rules (Oxlint)                    |
| **Staged Git Check**    | `vp staged`             | Automatically executed by Git pre-commit hook                     |
| **Type Check**          | `pnpm typecheck`        | Typechecks all packages via Turborepo                             |
| **Generate Migrations** | `pnpm db:generate`      | Creates SQL migration files in `packages/db` via Drizzle Kit      |
| **Apply DB Locally**    | `pnpm db:migrate:local` | Applies migrations to the shared local D1 in `.wrangler/state`    |
| **Apply DB to Prod**    | `pnpm db:migrate:prod`  | Applies migrations to remote Cloudflare D1                        |
| **Drizzle Studio**      | `pnpm db:studio`        | Launches GUI browser for database tables                          |
| **Build Apps**          | `pnpm build`            | Builds production bundles for storefront and dashboard            |
| **Deploy Storefront**   | `pnpm deploy:web`       | Deploys `apps/web` to Cloudflare Workers                          |
| **Deploy Dashboard**    | `pnpm deploy:dashboard` | Deploys `apps/dashboard` to Cloudflare Workers                    |

---

## ☁️ Cloudflare Deployment Guide

Both apps deploy to Cloudflare as independent Workers (e.g. `yourdomain.com` and `admin.yourdomain.com`).

### 1. Create Cloudflare Resources

Run these once using Wrangler:

```bash
# 1. Create Cloudflare D1 Database
pnpm dlx wrangler d1 create prod-db

# 2. Create Cloudflare R2 Bucket
pnpm dlx wrangler r2 bucket create prod-storage

# 3. Create Cloudflare KV Namespace (rate limiting & dashboard settings)
pnpm dlx wrangler kv namespace create KV
```

### 2. Put Cloudflare IDs in `.env`, Never in `wrangler.jsonc`

The tracked `wrangler.jsonc` files hold only binding and resource **names**. Real IDs live in the gitignored root `.env` (or in CI environment variables):

```env
D1_DATABASE_ID=<YOUR_D1_DATABASE_ID>
KV_NAMESPACE_ID=<YOUR_KV_NAMESPACE_ID>
R2_BUCKET_NAME=prod-storage
```

`vite build` injects them into the generated `dist/server/wrangler.json`, which `wrangler deploy` uses and git ignores. `pnpm db:migrate:prod` finds the D1 database by its `database_name`. Local dev needs no IDs at all.

### 3. Set Production Secrets

```bash
# Same BETTER_AUTH_SECRET on both workers (Better Auth refuses to start in production without one)
pnpm dlx wrangler secret put BETTER_AUTH_SECRET --name storefront-web
pnpm dlx wrangler secret put BETTER_AUTH_SECRET --name admin-dashboard

# Each worker's own public URL, e.g. https://example.com and https://admin.example.com
pnpm dlx wrangler secret put BETTER_AUTH_URL --name storefront-web
pnpm dlx wrangler secret put BETTER_AUTH_URL --name admin-dashboard

# Resend API Key (storefront)
pnpm dlx wrangler secret put RESEND_API_KEY --name storefront-web

# Optional: share one session across example.com and admin.example.com
pnpm dlx wrangler secret put AUTH_COOKIE_DOMAIN --name storefront-web   # e.g. example.com
pnpm dlx wrangler secret put AUTH_COOKIE_DOMAIN --name admin-dashboard
```

### 4. Apply Migrations & Deploy

```bash
# 1. Apply D1 schema migrations remotely
pnpm db:migrate:prod

# 2. Deploy Storefront
pnpm deploy:web

# 3. Deploy Dashboard
pnpm deploy:dashboard
```

---

## 🔒 Better Auth with JWT

Better Auth is configured in `@repo/auth`:

- **Server Handler**: Each app mounts `auth.handler` in its own TanStack Start server route (`src/routes/api/auth.$.ts`). It's a plain `Request → Response` function, so no extra router (Hono, etc.) is needed. Sign-in, sign-up and password POSTs are rate-limited to 10 per IP per minute in KV.
- **D1 Drizzle Adapter**: Reads and writes the `user`, `session`, `account`, `verification`, and `jwks` tables.
- **Roles**: `user.role` defaults to `user` and can't be set by clients at sign-up. The dashboard requires `admin`, both in the route guard and in every server function (`adminOnly` middleware).
- **JWT Plugin + Cookie Cache**: The session cache is a JWT cookie signed with the plugin's JWKS keys, so most session checks skip D1 for up to 5 minutes.
- **Audit Log**: Sign-ups and sign-ins are written to `audit_logs` and shown on the dashboard overview.
- **Client**: `apps/web/src/lib/auth-client.ts` and `apps/dashboard/src/lib/auth-client.ts` provide typed hooks (`signIn`, `signUp`, `signOut`, `useSession`, `authClient.token()`).

---

## 🛡️ Edge Rate Limiting

The `@repo/rate-limit` package provides a sliding-window counter algorithm running on Cloudflare KV:

```typescript
import { checkRateLimit, createRateLimitErrorResponse } from "@repo/rate-limit";

// Inside a TanStack Start Server Route or Function:
const result = await checkRateLimit(env.KV, request, {
  limit: 5, // 5 requests
  windowSeconds: 60, // per 60 seconds
  prefix: "contact", // KV key prefix
});

if (!result.success) {
  return createRateLimitErrorResponse(result); // Returns standard 429 Too Many Requests
}
```

---

## 📧 Resend Email Integration

The `@repo/email` package provides email delivery with dev mock fallback:

```typescript
import { createEmailService, welcomeEmail } from "@repo/email";

const emailService = createEmailService({ apiKey: env.RESEND_API_KEY });
const { html, text } = welcomeEmail({ name: "Alex", loginUrl: "https://example.com/login" });

await emailService.send({
  to: "user@example.com",
  subject: "Welcome to our platform!",
  html,
  text,
});
```

_If `RESEND_API_KEY` is not provided locally, emails are automatically logged to the terminal console with preview details instead of failing!_

---

## 🎨 DaisyUI 5 Theming in Dashboard

The dashboard uses DaisyUI 5 via `@plugin "daisyui"` in `apps/dashboard/src/styles.css`:

- Pre-configured with a clean, light, accessible theme (`light --default`).
- Zero client-side theming runtime scripts or flashes.
- Styled with semantic utility classes (`card`, `table`, `badge`, `btn`, `drawer`).

---

## 📄 License

MIT License. Free to use for personal and commercial projects.
