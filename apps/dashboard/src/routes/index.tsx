import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { auditLogs, count, createDb, desc, eq, gt, session, user } from "@repo/db";
import { env } from "cloudflare:workers";
import { useState } from "react";
import { adminOnly } from "#/lib/auth";
import {
  Empty,
  Leader,
  ManPage,
  Section,
  StatusDot,
  formatBytes,
  stamp,
  tableClass,
  tdClass,
  thClass,
  wideOnly,
} from "#/components/Man";

// Time one binding round-trip; failures become data, not a crashed page.
async function probe<T>(run: () => Promise<T>) {
  const start = Date.now();
  try {
    const value = await run();
    return { ok: true as const, ms: Date.now() - start, value };
  } catch (err) {
    return {
      ok: false as const,
      ms: Date.now() - start,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export const getOverview = createServerFn({ method: "GET" })
  .middleware([adminOnly])
  .handler(async () => {
    const db = createDb(env.DB);
    const [d1, r2, kv, events] = await Promise.all([
      probe(async () => {
        const [[users], [sessions]] = await Promise.all([
          db.select({ n: count() }).from(user),
          db.select({ n: count() }).from(session).where(gt(session.expiresAt, new Date())),
        ]);
        return `${users?.n ?? 0} users · ${sessions?.n ?? 0} live sessions`;
      }),
      probe(async () => {
        const list = await env.STORAGE.list({ limit: 1000 });
        const bytes = list.objects.reduce((sum, o) => sum + o.size, 0);
        return `${list.objects.length}${list.truncated ? "+" : ""} objects · ${formatBytes(bytes)}`;
      }),
      probe(async () => {
        const list = await env.KV.list({ limit: 1000 });
        return `${list.keys.length}${list.list_complete ? "" : "+"} keys`;
      }),
      probe(() =>
        db
          .select({
            id: auditLogs.id,
            action: auditLogs.action,
            ip: auditLogs.ip,
            createdAt: auditLogs.createdAt,
            email: user.email,
          })
          .from(auditLogs)
          .leftJoin(user, eq(auditLogs.actorId, user.id))
          .orderBy(desc(auditLogs.createdAt))
          .limit(15),
      ),
    ]);

    return {
      bindings: [
        { name: "DB", kind: "D1 database", ...d1 },
        { name: "STORAGE", kind: "R2 bucket", ...r2 },
        { name: "KV", kind: "KV namespace", ...kv },
      ],
      events,
      checkedAt: new Date().toISOString(),
    };
  });

export const Route = createFileRoute("/")({
  loader: () => getOverview(),
  component: Overview,
});

function Overview() {
  const { bindings, events, checkedAt } = Route.useLoaderData();
  const { user: admin } = Route.useRouteContext();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const down = bindings.filter((b) => !b.ok).length;

  const refresh = async () => {
    setRefreshing(true);
    await router.invalidate();
    setRefreshing(false);
  };

  return (
    <ManPage
      name="overview"
      summary={
        down === 0
          ? "Every binding answered. Recent sign-ups and sign-ins are listed below."
          : `${down} of ${bindings.length} bindings failed to answer. Details below.`
      }
      synopsis={<>loader → getOverview() → probes D1, R2, KV · checked {stamp(checkedAt)} UTC</>}
      actions={
        <button type="button" className="ctl ctl-primary" onClick={refresh} disabled={refreshing}>
          {refreshing ? "refreshing…" : "refresh"}
        </button>
      }
    >
      <Section title="Status" id="status">
        <ul className="max-w-3xl">
          {bindings.map((b) => (
            <li key={b.name}>
              <Leader
                label={
                  <span className="flex items-center gap-2.5">
                    <StatusDot ok={b.ok} />
                    <span className="font-bold w-[8ch]">{b.name}</span>
                    <span className="text-muted hidden sm:inline">{b.kind}</span>
                  </span>
                }
              >
                {b.ok ? (
                  <>
                    {b.value} <span className="text-muted whitespace-nowrap">· {b.ms} ms</span>
                  </>
                ) : (
                  <span className="text-error">error · {b.error}</span>
                )}
              </Leader>
            </li>
          ))}
          <li>
            <Leader
              label={
                <span className="flex items-center gap-2.5">
                  <StatusDot ok />
                  <span className="font-bold w-[8ch]">AUTH</span>
                  <span className="text-muted hidden sm:inline">Better Auth</span>
                </span>
              }
            >
              {admin?.email} <span className="text-muted whitespace-nowrap">· jwt cache 5 min</span>
            </Leader>
          </li>
        </ul>
      </Section>

      <Section title="Events" id="events">
        {!events.ok ? (
          <p className="font-mono text-[13px] text-error">audit_logs unreadable · {events.error}</p>
        ) : events.value.length === 0 ? (
          <Empty>
            No events yet. Sign-ups and sign-ins are written to audit_logs as they happen.
          </Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th scope="col" className={`${thClass} ${wideOnly}`}>
                    Time (UTC)
                  </th>
                  <th scope="col" className={thClass}>
                    Event
                  </th>
                  <th scope="col" className={`${thClass} ${wideOnly}`}>
                    Actor
                  </th>
                  <th scope="col" className={`${thClass} ${wideOnly} text-right`}>
                    IP
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300">
                {events.value.map((e) => (
                  <tr key={e.id}>
                    <td className={`${tdClass} ${wideOnly} text-muted whitespace-nowrap`}>
                      {stamp(e.createdAt)}
                    </td>
                    <td className={tdClass}>
                      {e.action}
                      <span className="block sm:hidden text-muted [overflow-wrap:anywhere]">
                        {e.email ?? "deleted user"} · {stamp(e.createdAt)}
                      </span>
                    </td>
                    <td className={`${tdClass} ${wideOnly} [overflow-wrap:anywhere]`}>
                      {e.email ?? "deleted user"}
                    </td>
                    <td className={`${tdClass} ${wideOnly} text-right text-muted pr-0`}>
                      {e.ip || "n/a"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </ManPage>
  );
}
