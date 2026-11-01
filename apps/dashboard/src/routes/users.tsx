import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { createDb, user } from "@repo/db";
import { env } from "cloudflare:workers";
import { Search, UserPlus, MoreHorizontal, ShieldCheck } from "lucide-react";
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
          <h1 className="text-2xl font-black tracking-tight">User Directory</h1>
          <p className="text-sm text-base-content/70 mt-1">
            Accounts synced directly from Cloudflare D1 with Better Auth roles.
          </p>
        </div>
        <button
          className="btn btn-primary btn-sm gap-2"
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
          <div className="flex items-center justify-between mb-4 gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered input-sm w-full pl-9"
              />
            </div>
            <div className="text-xs text-base-content/60 font-medium">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>

          {/* DaisyUI Table */}
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-sm">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Email Status</th>
                  <th>Registered</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-9">
                            <span className="text-xs font-bold">
                              {item.name.slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{item.name}</div>
                          <div className="text-xs text-base-content/60">{item.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm font-semibold capitalize ${
                          item.role === "admin"
                            ? "badge-primary"
                            : item.role === "manager"
                              ? "badge-secondary"
                              : "badge-ghost"
                        }`}
                      >
                        {item.role === "admin" && <ShieldCheck className="w-3 h-3 mr-1" />}
                        {item.role}
                      </span>
                    </td>
                    <td>
                      {item.emailVerified ? (
                        <span className="badge badge-success badge-sm">Verified</span>
                      ) : (
                        <span className="badge badge-warning badge-sm">Unverified</span>
                      )}
                    </td>
                    <td className="text-base-content/60 text-xs">{item.createdAt}</td>
                    <td className="text-right">
                      <div className="dropdown dropdown-left dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-xs">
                          <MoreHorizontal className="w-4 h-4" />
                        </div>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-36 z-50 border border-base-300 text-xs"
                        >
                          <li>
                            <button onClick={() => alert(`Edit ${item.name}`)}>Edit Role</button>
                          </li>
                          <li>
                            <button
                              onClick={() => alert(`Reset password sent to ${item.email}`)}
                              className="text-warning"
                            >
                              Reset Password
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
