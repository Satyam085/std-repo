import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { createDb, desc, eq, user } from "@repo/db";
import { env } from "cloudflare:workers";
import { Fragment, useState } from "react";
import { z } from "zod";
import { adminOnly } from "#/lib/auth";
import {
  Empty,
  ManPage,
  Section,
  stamp,
  tableClass,
  tdClass,
  thClass,
  wideOnly,
} from "#/components/Man";

export const fetchUsers = createServerFn({ method: "GET" })
  .middleware([adminOnly])
  .handler(async () => {
    const db = createDb(env.DB);
    return db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      })
      .from(user)
      .orderBy(desc(user.createdAt))
      .limit(500);
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([adminOnly])
  .validator(z.object({ id: z.string(), role: z.enum(["user", "admin"]) }))
  .handler(async ({ data, context }) => {
    // Guard against locking the last admin out by accident.
    if (data.id === context.user.id) throw new Error("You can't change your own role.");
    const db = createDb(env.DB);
    await db
      .update(user)
      .set({ role: data.role, updatedAt: new Date() })
      .where(eq(user.id, data.id));
  });

export const Route = createFileRoute("/users")({
  loader: () => fetchUsers(),
  component: UsersPage,
});

function UsersPage() {
  const users = Route.useLoaderData();
  const { user: admin } = Route.useRouteContext();
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const shown = q
    ? users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    : users;

  return (
    <ManPage
      name="users"
      summary="Accounts in the D1 user table, newest first. Open a row to see details or change its role."
      synopsis={<>loader → fetchUsers() → select from user · {users.length} rows</>}
    >
      <Section title="Accounts" id="accounts">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
          <label className="flex-1 min-w-[16rem] max-w-sm">
            <span className="sr-only">Filter by name or email</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="filter by name or email"
              className="field"
            />
          </label>
          <span className="font-mono text-xs text-muted tabular-nums" aria-live="polite">
            {shown.length} of {users.length}
          </span>
        </div>

        {users.length === 0 ? (
          <Empty>No accounts yet. Register on the storefront and the account appears here.</Empty>
        ) : shown.length === 0 ? (
          <Empty>
            Nothing matches “{query}”.{" "}
            <button type="button" className="ctl -ml-2" onClick={() => setQuery("")}>
              clear filter
            </button>
          </Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th scope="col" className={thClass}>
                    Account
                  </th>
                  <th scope="col" className={thClass}>
                    Role
                  </th>
                  <th scope="col" className={`${thClass} ${wideOnly}`}>
                    Email
                  </th>
                  <th scope="col" className={`${thClass} ${wideOnly} text-right pr-0`}>
                    Created (UTC)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300">
                {shown.map((u) => {
                  const open = openId === u.id;
                  // The open row stays in full ink; its neighbours recede.
                  const recede = openId !== null && !open;
                  return (
                    <Fragment key={u.id}>
                      <tr
                        className={`transition-colors duration-(--dur) ${recede ? "text-muted" : ""} ${open ? "bg-base-200" : "hover:bg-base-200/60"}`}
                      >
                        <td className={tdClass}>
                          <button
                            type="button"
                            aria-expanded={open}
                            aria-controls={`user-${u.id}`}
                            onClick={() => setOpenId(open ? null : u.id)}
                            className="text-left cursor-pointer group"
                          >
                            <span className="font-bold group-hover:underline">{u.name}</span>
                            <span className="block text-muted [overflow-wrap:anywhere]">
                              {u.email}
                            </span>
                            <span className="block sm:hidden text-muted">
                              {u.emailVerified ? "verified" : "unverified"} · {stamp(u.createdAt)}
                            </span>
                          </button>
                        </td>
                        <td className={tdClass}>
                          <span className={u.role === "admin" ? "font-bold" : ""}>{u.role}</span>
                        </td>
                        {/* Email verification is off in the template, so unverified is the norm, not a warning. */}
                        <td className={`${tdClass} ${wideOnly}`}>
                          {u.emailVerified ? (
                            "verified"
                          ) : (
                            <span className="text-muted">unverified</span>
                          )}
                        </td>
                        <td
                          className={`${tdClass} ${wideOnly} text-right text-muted whitespace-nowrap pr-0`}
                        >
                          {stamp(u.createdAt)}
                        </td>
                      </tr>
                      {open && (
                        <tr id={`user-${u.id}`} className="bg-base-200">
                          <td colSpan={4} className="px-0 pb-5 pt-1">
                            <UserDetail user={u} isSelf={u.id === admin?.id} />
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </ManPage>
  );
}

function UserDetail({ user: u, isSelf }: { user: { id: string; role: string }; isSelf: boolean }) {
  const router = useRouter();
  const [role, setRole] = useState(u.role);
  const [state, setState] = useState<"idle" | "saving" | "saved" | string>("idle");

  const save = async () => {
    setState("saving");
    try {
      await setUserRole({ data: { id: u.id, role: role as "user" | "admin" } });
      setState("saved");
      await router.invalidate();
    } catch (err) {
      setState(err instanceof Error ? err.message : "Could not save the role.");
    }
  };

  return (
    <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[8rem_minmax(0,1fr)] px-3 font-mono text-[13px]">
      <dt className="text-muted">id</dt>
      <dd className="break-all">{u.id}</dd>
      <dt className="text-muted">
        <label htmlFor={`role-${u.id}`}>role</label>
      </dt>
      <dd className="flex flex-wrap items-center gap-2">
        <select
          id={`role-${u.id}`}
          value={role}
          disabled={isSelf}
          onChange={(e) => setRole(e.target.value)}
          className="field w-auto"
        >
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
        <button
          type="button"
          className="ctl ctl-primary"
          onClick={save}
          disabled={isSelf || role === u.role || state === "saving"}
        >
          {state === "saving" ? "saving…" : "save role"}
        </button>
        <span className="text-xs text-muted" role="status">
          {isSelf ? (
            "This is you. Another admin has to change your role."
          ) : state === "saved" ? (
            "Saved. Takes effect within 5 minutes (session cache)."
          ) : state !== "idle" && state !== "saving" ? (
            <span className="text-error">{state}</span>
          ) : null}
        </span>
      </dd>
    </dl>
  );
}
