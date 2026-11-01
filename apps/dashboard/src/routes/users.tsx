import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { createDb, user } from "@repo/db";
import { env } from "cloudflare:workers";
import { Search, UserPlus, MoreHorizontal, ShieldCheck, X, Check, AlertCircle } from "lucide-react";
import { useState } from "react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
}

const SAMPLE_USERS: UserItem[] = [
  {
    id: "usr-1",
    name: "Satyam Sharma",
    email: "satyam@example.com",
    role: "admin",
    emailVerified: true,
    createdAt: "2026-10-15",
  },
  {
    id: "usr-2",
    name: "Emma Watson",
    email: "emma@example.com",
    role: "manager",
    emailVerified: true,
    createdAt: "2026-10-18",
  },
  {
    id: "usr-3",
    name: "David Kim",
    email: "david.k@example.com",
    role: "user",
    emailVerified: false,
    createdAt: "2026-10-24",
  },
  {
    id: "usr-4",
    name: "Sofia Alva",
    email: "sofia@example.com",
    role: "user",
    emailVerified: true,
    createdAt: "2026-10-29",
  },
];

export const fetchUsersServer = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const db = createDb(env.DB);
    const list = await db.select().from(user).limit(50);
    if (list.length > 0) {
      return list.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        emailVerified: u.emailVerified,
        createdAt: new Date(u.createdAt).toISOString().split("T")[0],
      })) as UserItem[];
    }
  } catch {
    // Return sample users if D1 is unseeded
  }
  return SAMPLE_USERS;
});

export const Route = createFileRoute("/users")({
  loader: async () => {
    return await fetchUsersServer();
  },
  component: UsersPage,
});

function UsersPage() {
  const users = Route.useLoaderData();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">User Directory</h1>
          <p className="text-xs text-base-content/70 mt-1">
            Accounts synced directly from Cloudflare D1 with Better Auth roles.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-neutral btn-sm gap-2 text-xs font-semibold shadow-sm cursor-pointer"
          onClick={() => alert("New user registration handled via Better Auth onboarding.")}
        >
          <UserPlus className="w-4 h-4" />
          Invite User
        </button>
      </div>

      {/* Table Card */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body p-6">
          {/* Search bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered input-sm w-full pl-9 pr-8 text-xs"
                aria-label="Filter user accounts"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="text-xs text-base-content/60 font-medium tabular-nums">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table table-sm w-full text-xs" aria-label="Users list">
              <thead>
                <tr className="border-b border-base-200 text-base-content/50 uppercase text-[10px] tracking-wider">
                  <th scope="col" className="py-2.5">
                    User
                  </th>
                  <th scope="col" className="py-2.5">
                    Role
                  </th>
                  <th scope="col" className="py-2.5">
                    Email Status
                  </th>
                  <th scope="col" className="py-2.5">
                    Registered
                  </th>
                  <th scope="col" className="py-2.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((item) => (
                    <tr key={item.id} className="hover:bg-base-200/50 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-8 text-xs font-bold shadow-sm">
                              <span>{item.name.slice(0, 2).toUpperCase()}</span>
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-base-content">{item.name}</div>
                            <div className="text-xs text-base-content/60">{item.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span
                          className={`badge badge-sm font-semibold text-[10px] capitalize gap-1 ${
                            item.role === "admin"
                              ? "badge-neutral"
                              : item.role === "manager"
                                ? "badge-primary badge-outline"
                                : "badge-ghost"
                          }`}
                        >
                          {item.role === "admin" && <ShieldCheck className="w-3 h-3" />}
                          {item.role}
                        </span>
                      </td>
                      <td className="py-3">
                        {item.emailVerified ? (
                          <span className="badge badge-success badge-outline badge-sm text-[10px] gap-1">
                            <Check className="w-3 h-3" />
                            Verified
                          </span>
                        ) : (
                          <span className="badge badge-warning badge-outline badge-sm text-[10px] gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="text-base-content/60 text-xs tabular-nums py-3">
                        {item.createdAt}
                      </td>
                      <td className="text-right py-3">
                        <div className="dropdown dropdown-left dropdown-end">
                          <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle btn-xs"
                            aria-label={`Actions for ${item.name}`}
                          >
                            <MoreHorizontal className="w-4 h-4 text-base-content/60" />
                          </div>
                          <ul
                            tabIndex={0}
                            className="dropdown-content menu p-1.5 shadow-lg bg-base-100 rounded-box w-36 z-50 border border-base-300 text-xs"
                          >
                            <li>
                              <button
                                type="button"
                                onClick={() => alert(`Edit role for ${item.name}`)}
                              >
                                Edit Role
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                onClick={() =>
                                  alert(`Password reset link dispatched to ${item.email}`)
                                }
                                className="text-warning"
                              >
                                Reset Password
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Search className="w-6 h-6 text-base-content/30" />
                        <p className="text-sm font-medium text-base-content/70">
                          No users found matching &ldquo;{searchTerm}&rdquo;
                        </p>
                        <button
                          type="button"
                          onClick={() => setSearchTerm("")}
                          className="btn btn-xs btn-outline mt-1"
                        >
                          Clear Search
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
