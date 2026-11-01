import { createFileRoute } from "@tanstack/react-router";
import { ManPage, Section, tableClass, tdClass, thClass } from "#/components/Man";

export const Route = createFileRoute("/guide")({
  component: DashboardGuidePage,
});

const DECISIONS = [
  {
    title: "SPA mode",
    body: "The console sits behind a login and never needs indexing, so src/start.ts sets defaultSsr: false. The worker renders only the HTML shell; loaders and the admin guard run in the browser and call server functions over RPC.",
  },
  {
    title: "Native loaders, no React Query",
    body: "Each route's loader calls one createServerFn. router.invalidate() refetches after a mutation. Router preloading, caching and invalidation cover an admin console without a second data layer.",
  },
  {
    title: "Admin guard",
    body: "The root beforeLoad redirects to /login unless the session's user has role admin. Every server function also runs the adminOnly middleware, because RPC endpoints can be called directly.",
  },
  {
    title: "Better Auth",
    body: "Each app mounts its own /api/auth handler on the shared D1 tables. The session cache is a JWT cookie signed with the JWT plugin's keys, so most session checks skip D1 for up to 5 minutes. Set AUTH_COOKIE_DOMAIN to share one session across the storefront and admin subdomains.",
  },
  {
    title: "Cloudflare IDs stay out of git",
    body: "wrangler.jsonc holds only binding and resource names. vite build injects D1_DATABASE_ID, KV_NAMESPACE_ID and R2_BUCKET_NAME from the root .env (or CI env) into dist/, which is gitignored. Secrets go in with wrangler secret put.",
  },
  {
    title: "DaisyUI 5, one light theme",
    body: 'styles.css overrides the built-in light theme through @plugin "daisyui/theme". Change --color-primary to rebrand the accent, and VITE_APP_NAME to rename the console.',
  },
];

const PACKAGES = [
  [
    "@repo/db",
    "user directory, audit events, binding probes",
    "createDb, user, auditLogs",
    "env.DB",
  ],
  [
    "@repo/auth",
    "sessions, admin role, audit hooks",
    "createAuth, createClient",
    "BETTER_AUTH_SECRET",
  ],
  ["@repo/rate-limit", "10 auth POSTs per IP per minute", "checkRateLimit", "env.KV"],
  ["R2 binding", "file listing and uploads", "env.STORAGE.list / put", "env.STORAGE"],
] as const;

function DashboardGuidePage() {
  return (
    <ManPage
      name="guide"
      summary="How this console is built, and where to change things when you start a new product from the template."
      synopsis={<>apps/dashboard · TanStack Start (SPA) · DaisyUI 5 · Cloudflare Workers</>}
    >
      <Section title="Description" id="description">
        <dl className="grid gap-6 max-w-[72ch]">
          {DECISIONS.map((d) => (
            <div key={d.title}>
              <dt className="font-mono text-[13px] font-bold">{d.title}</dt>
              <dd className="mt-1 text-[15px] leading-relaxed text-pretty">{d.body}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Packages" id="packages">
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead>
              <tr>
                <th scope="col" className={thClass}>
                  Package
                </th>
                <th scope="col" className={thClass}>
                  Used for
                </th>
                <th scope="col" className={thClass}>
                  Key APIs
                </th>
                <th scope="col" className={`${thClass} pr-0`}>
                  Needs
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-300">
              {PACKAGES.map(([pkg, role, apis, binding]) => (
                <tr key={pkg}>
                  <td className={`${tdClass} font-bold whitespace-nowrap`}>{pkg}</td>
                  <td className={tdClass}>{role}</td>
                  <td className={`${tdClass} text-muted`}>{apis}</td>
                  <td className={`${tdClass} pr-0 whitespace-nowrap`}>{binding}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Files" id="files">
        <ul className="font-mono text-[13px] leading-7">
          <li>
            src/lib/auth.ts <span className="text-muted">· getAuth, getAdminUser, adminOnly</span>
          </li>
          <li>
            src/lib/config.ts <span className="text-muted">· APP_NAME, STOREFRONT_URL</span>
          </li>
          <li>
            src/components/Man.tsx{" "}
            <span className="text-muted">· page, section and table primitives</span>
          </li>
          <li>
            src/styles.css <span className="text-muted">· theme tokens and controls</span>
          </li>
        </ul>
      </Section>
    </ManPage>
  );
}
