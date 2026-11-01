import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  HardDrive,
  Settings,
  ExternalLink,
  Bell,
  Palette,
} from "lucide-react";
import { useState, useEffect } from "react";

const THEMES = ["light", "dark", "corporate", "synthwave"];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [currentTheme, setCurrentTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("dashboard-theme") || "light";
    setCurrentTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const changeTheme = (theme: string) => {
    setCurrentTheme(theme);
    localStorage.setItem("dashboard-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  };

  const navItems = [
    { label: "Overview", to: "/", icon: LayoutDashboard },
    { label: "User Directory", to: "/users", icon: Users, badge: "D1" },
    { label: "R2 File Storage", to: "/files", icon: HardDrive, badge: "R2" },
    { label: "System Settings", to: "/settings", icon: Settings },
  ];

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Content Area */}
      <div className="drawer-content flex flex-col">
        {/* Top Navbar */}
        <div className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-30 px-4">
          <div className="flex-none lg:hidden">
            <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>

          <div className="flex-1 gap-2">
            <span className="font-bold text-lg hidden sm:inline-block">Admin Console</span>
            <div className="badge badge-success badge-sm gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse"></span>
              SPA Mode (Edge)
            </div>
          </div>

          <div className="flex-none gap-2">
            {/* Theme Dropdown */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm">
                <Palette className="w-4 h-4" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-40 z-50 border border-base-300"
              >
                <li className="menu-title text-xs">Choose Theme</li>
                {THEMES.map((t) => (
                  <li key={t}>
                    <button
                      onClick={() => changeTheme(t)}
                      className={`capitalize text-xs ${currentTheme === t ? "active" : ""}`}
                    >
                      {t}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Notifications */}
            <button className="btn btn-ghost btn-circle btn-sm">
              <div className="indicator">
                <Bell className="w-4 h-4" />
                <span className="badge badge-xs badge-primary indicator-item"></span>
              </div>
            </button>

            {/* User Profile */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar placeholder btn-sm"
              >
                <div className="bg-neutral text-neutral-content rounded-full w-8">
                  <span className="text-xs">AD</span>
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-50 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-300"
              >
                <li className="menu-title">Admin Account</li>
                <li>
                  <Link to="/settings">Profile Settings</Link>
                </li>
                <li>
                  <Link to="/login">Sign Out</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
      </div>

      {/* Sidebar Drawer */}
      <div className="drawer-side z-40 border-r border-base-300">
        <label
          htmlFor="dashboard-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <aside className="bg-base-100 w-64 min-h-full flex flex-col justify-between p-4">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 px-2 py-4 mb-4 border-b border-base-200">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-content flex items-center justify-center font-black">
                D
              </div>
              <div>
                <h1 className="font-bold text-sm leading-tight">Project Dashboard</h1>
                <p className="text-xs text-base-content/60">Cloudflare • D1 • R2</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <ul className="menu menu-md gap-1 p-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.to;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`flex items-center justify-between ${isActive ? "active" : ""}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="badge badge-xs badge-neutral">{item.badge}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Footer info */}
          <div className="pt-4 border-t border-base-200 flex flex-col gap-2">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline btn-sm justify-between w-full"
            >
              <span>Visit Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <div className="text-[11px] text-base-content/50 text-center">
              Vite+ • TanStack Start • DaisyUI 5
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
