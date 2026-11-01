import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Users, HardDrive, Zap, Database, TrendingUp } from "lucide-react";

export const getDashboardStatsServer = createServerFn({ method: "GET" }).handler(async () => {
  // In production, queries D1 database and KV
  return {
    totalUsers: 1420,
    userGrowth: "+12.5%",
    activeSessions: 389,
    storageUsedMB: 284.6,
    edgeLatencyMs: 14.2,
    recentAudits: [
      {
        id: "1",
        action: "User registered",
        email: "alex@example.com",
        time: "5m ago",
        status: "success",
      },
      {
        id: "2",
        action: "R2 File uploaded (avatar.png)",
        email: "sarah@example.com",
        time: "18m ago",
        status: "success",
      },
      {
        id: "3",
        action: "JWT Token refreshed",
        email: "michael@example.com",
        time: "32m ago",
        status: "info",
      },
      {
        id: "4",
        action: "Rate limit blocked IP (5 attempts)",
        email: "unknown",
        time: "1h ago",
        status: "warning",
      },
    ],
  };
});

export const Route = createFileRoute("/")({
  loader: async () => {
    return await getDashboardStatsServer();
  },
  component: DashboardOverview,
});

function DashboardOverview() {
  const stats = Route.useLoaderData();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
        <div>
          <h1 className="text-2xl font-black tracking-tight">System Overview</h1>
          <p className="text-sm text-base-content/70 mt-1">
            Real-time telemetry and state management for your Cloudflare microservices.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-primary btn-sm gap-1.5"
            onClick={() => window.location.reload()}
          >
            <Zap className="w-3.5 h-3.5" />
            Refresh Metrics
          </button>
        </div>
      </div>

      {/* DaisyUI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
                Total Users
              </span>
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black mt-2">{stats.totalUsers.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs text-success font-medium mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{stats.userGrowth} from last month</span>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
                Active JWTs
              </span>
              <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black mt-2">{stats.activeSessions}</div>
            <div className="text-xs text-base-content/60 font-medium mt-1">
              Verified via Better Auth JWT plugin
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
                Cloudflare R2
              </span>
              <div className="p-2 bg-accent/10 text-accent rounded-lg">
                <HardDrive className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black mt-2">{stats.storageUsedMB} MB</div>
            <div className="text-xs text-base-content/60 font-medium mt-1">
              Object storage bucket attached
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
                Edge D1 Latency
              </span>
              <div className="p-2 bg-success/10 text-success rounded-lg">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black mt-2">{stats.edgeLatencyMs} ms</div>
            <div className="text-xs text-success font-medium mt-1">
              Direct SQLite edge execution
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log Table */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">Recent System Activity</h2>
              <p className="text-xs text-base-content/60">Live feed recorded in audit log table</p>
            </div>
            <span className="badge badge-outline text-xs">Sliding KV Rate Limiter Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-sm">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Actor</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentAudits.map((item) => (
                  <tr key={item.id}>
                    <td className="font-medium">{item.action}</td>
                    <td className="text-base-content/70">{item.email}</td>
                    <td>
                      <span
                        className={`badge badge-sm font-semibold ${
                          item.status === "success"
                            ? "badge-success"
                            : item.status === "warning"
                              ? "badge-warning"
                              : "badge-info"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="text-base-content/50 text-xs">{item.time}</td>
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
