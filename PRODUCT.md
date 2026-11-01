# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The repo owner, a solo developer who clones this monorepo as the starting point for each new product. In every product built from it, the same person is also the main admin-console user: they open it between other work to check worker health, find a user, grab an R2 file link, or change a rate limit, then leave. Storefront visitors are the end users of each product.

## Product Purpose

A reusable starter template for future products on Cloudflare Workers. It ships a public SSR storefront (`apps/web`) and an admin console SPA (`apps/dashboard`) that share D1, R2, KV, Better Auth, email, rate-limit, and logger packages. Success means a new product starts from a clone with working auth, data, and deploys, and the owner renames and rebrands instead of rebuilding.

## Positioning

It runs at the edge as a lean SPA that uses only native TanStack Router loaders and `createServerFn` (no React Query). It reads the same D1, R2, and KV bindings as the storefront.

## Operating Context

- Each new product is a fresh clone: rename, set `.env`, migrate, deploy.

- Lives on a dedicated admin subdomain (e.g. `admin.example.com`). The storefront lives on the apex domain.
- Access requires a Better Auth session with `role = "admin"`. The first admin is promoted by hand in D1.
- Visits are short and task-driven: scan status, act, leave.

## Capabilities and Constraints

- Routes: overview (`/`), users (`/users`), R2 files (`/files`), settings (`/settings`), guide (`/guide`), login (`/login`).
- DaisyUI 5 with a single light theme (`light --default`). No dark mode and no theme switching.
- No `@tanstack/react-query` in this app.
- Sample data is acceptable where a binding is empty, as long as it is labelled as sample data.
- Settings are not persisted yet (undecided).

## Evidence on Hand

- There are no real customers, metrics, or testimonials. Overview telemetry figures are placeholders, so don't present them as live production data.

## Product Principles

1. Get the owner to the answer in one glance, then out.
2. Show real binding data whenever it exists, and label anything that isn't real.
3. Stay lean: native router and server functions, no extra client-state libraries.
4. Rebrand by changing tokens, not components: name, logo mark, and accent live in a few obvious places.
5. Secrets and Cloudflare resource IDs never live in tracked files.
