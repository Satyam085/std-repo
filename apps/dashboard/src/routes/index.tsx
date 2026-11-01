import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
  Users,
  HardDrive,
  Zap,
  Database,
  RefreshCw,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";

export const getDashboardStatsServer = createServerFn({ method: "GET" }).handler(async () => {
  // In production, queries D1 database, R2 metadata, and KV
  return {
    totalUsers: 1420,
    userGrowth: "+12.5%",
    activeSessions: 389,
    storageUsedMB: 284.6,
    edgeLatencyMs: 14.2,
    p95LatencyMs: 18.7,
    kvHitRate: "99.4%",
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
  const [filter, setFilter] = useState<"all" | "success" | "warning" | "info">("all");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  const filteredAudits = stats.recentAudits.filter(
    (item) => filter === "all" || item.status === filter,
  );

  return (
    <div className="space-y-6">
      {/* Top Banner with Service Topology */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight">System Telemetry</h1>
            <span className="badge badge-success badge-sm text-[10px] font-bold">LIVE</span>
          </div>
          <p className="text-xs text-base-content/70">
            Real-time status for Cloudflare Workers, D1 SQLite, R2 Storage, and KV rate limiter.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={refreshing}
            className="btn btn-neutral btn-sm gap-1.5 text-xs font-semibold cursor-pointer shadow-sm"
            onClick={handleRefresh}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh Status"}
          </button>
        </div>
      </div>

      {/* Operational Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Edge D1 Latency */}
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-base-content/60 uppercase tracking-wider">
                Edge D1 Latency
              </span>
              <div className="p-2 bg-base-200 text-base-content rounded-lg">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tabular-nums mt-2">
              {stats.edgeLatencyMs}{" "}
              <span className="text-sm font-normal text-base-content/60">ms</span>
            </div>
            <div className="flex items-center justify-between text-xs text-base-content/60 mt-1 pt-2 border-t border-base-200">
              <span>p95 Execution</span>
              <span className="font-semibold text-base-content tabular-nums">
                {stats.p95LatencyMs} ms
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2: Active Sessions */}
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-base-content/60 uppercase tracking-wider">
                Active JWT Tokens
              </span>
              <div className="p-2 bg-base-200 text-base-content rounded-lg">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tabular-nums mt-2">
              {stats.activeSessions.toLocaleString()}
            </div>
            <div className="flex items-center justify-between text-xs text-base-content/60 mt-1 pt-2 border-t border-base-200">
              <span>Better Auth Mode</span>
              <span className="font-semibold text-base-content">Stateless JWT</span>
            </div>
          </div>
        </div>

        {/* Metric 3: R2 Storage */}
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-base-content/60 uppercase tracking-wider">
                Cloudflare R2
              </span>
              <div className="p-2 bg-base-200 text-base-content rounded-lg">
                <HardDrive className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tabular-nums mt-2">
              {stats.storageUsedMB}{" "}
              <span className="text-sm font-normal text-base-content/60">MB</span>
            </div>
            <div className="flex items-center justify-between text-xs text-base-content/60 mt-1 pt-2 border-t border-base-200">
              <span>Egress Fees</span>
              <span className="font-semibold text-success">$0.00 (Zero Egress)</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Total Users */}
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-base-content/60 uppercase tracking-wider">
                Total Accounts
              </span>
              <div className="p-2 bg-base-200 text-base-content rounded-lg">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tabular-nums mt-2">
              {stats.totalUsers.toLocaleString()}
            </div>
            <div className="flex items-center justify-between text-xs text-base-content/60 mt-1 pt-2 border-t border-base-200">
              <span>Month over Month</span>
              <span className="font-semibold text-success tabular-nums">{stats.userGrowth}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log Section */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base font-bold">Audit & Security Event Stream</h2>
              <p className="text-xs text-base-content/60">
                Live events authenticated and checked against KV sliding-window limits
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="join join-horizontal">
              {(["all", "success", "warning", "info"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={`join-item btn btn-xs capitalize ${
                    filter === tab ? "btn-neutral font-bold" : "btn-ghost text-base-content/60"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-sm w-full text-xs" aria-label="Recent audit events">
              <thead>
                <tr className="border-b border-base-200 text-base-content/50 uppercase text-[10px] tracking-wider">
                  <th scope="col" className="py-2.5">
                    Event
                  </th>
                  <th scope="col" className="py-2.5">
                    Actor
                  </th>
                  <th scope="col" className="py-2.5">
                    Status
                  </th>
                  <th scope="col" className="py-2.5 text-right">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {filteredAudits.length > 0 ? (
                  filteredAudits.map((item) => (
                    <tr key={item.id} className="hover:bg-base-200/50 transition-colors">
                      <td className="font-medium text-base-content py-3">{item.action}</td>
                      <td className="text-base-content/70 py-3">{item.email}</td>
                      <td className="py-3">
                        <span
                          className={`badge badge-sm font-semibold text-[10px] gap-1 ${
                            item.status === "success"
                              ? "badge-success badge-outline"
                              : item.status === "warning"
                                ? "badge-warning badge-outline"
                                : "badge-info badge-outline"
                          }`}
                        >
                          {item.status === "success" && <CheckCircle2 className="w-3 h-3" />}
                          {item.status === "warning" && <ShieldAlert className="w-3 h-3" />}
                          {item.status}
                        </span>
                      </td>
                      <td className="text-base-content/50 tabular-nums text-right py-3">
                        {item.time}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-base-content/50">
                      No audit events match the selected filter.
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
