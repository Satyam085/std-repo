import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  HardDrive,
  Settings,
  ExternalLink,
  Bell,
  Palette,
  BookOpen,
  ChevronRight,
  Search,
} from "lucide-react";
import { useState, useEffect } from "react";

const THEMES = ["light", "corporate", "emerald", "winter"];

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
    { label: "Architecture Guide", to: "/guide", icon: BookOpen, badge: "Docs" },
    { label: "System Settings", to: "/settings", icon: Settings },
  ];

  const currentNav = navItems.find((item) => item.to === currentPath) || {
    label: currentPath === "/login" ? "Authentication" : "Overview",
  };

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-200/50">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Content Area */}
      <div className="drawer-content flex flex-col">
        {/* Top Navbar */}
        <header className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-30 px-4 sm:px-6 h-16 min-h-[4rem]">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="dashboard-drawer"
              className="btn btn-square btn-ghost btn-sm"
              aria-label="Open sidebar menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>

          {/* Breadcrumb Navigation */}
          <div className="flex-1 items-center gap-2 pl-2">
            <nav className="text-xs breadcrumbs p-0 hidden sm:block" aria-label="Breadcrumb">
              <ul>
                <li className="font-semibold text-base-content/60">Console</li>
                <li className="font-bold text-base-content flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-base-content/40" />
                  {currentNav.label}
                </li>
              </ul>
            </nav>
            <div className="badge badge-success badge-outline badge-sm gap-1 ml-2 text-[10px] font-semibold py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Edge SPA Mode
            </div>
          </div>

          {/* Right Header Utilities */}
          <div className="flex-none items-center gap-1.5 sm:gap-2">
            {/* Quick Filter / Search Trigger */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg border border-base-300 bg-base-200/50 text-xs text-base-content/50">
              <Search className="w-3.5 h-3.5" />
              <span>Press / to search</span>
              <kbd className="kbd kbd-xs bg-base-100">/</kbd>
            </div>

            {/* Theme Picker */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle btn-sm"
                aria-label="Select theme"
              >
                <Palette className="w-4 h-4 text-base-content/70" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-44 z-50 border border-base-300 text-xs"
              >
                <li className="menu-title text-[11px] font-bold uppercase tracking-wider">
                  Theme Palette
                </li>
                {THEMES.map((t) => (
                  <li key={t}>
                    <button
                      type="button"
                      onClick={() => changeTheme(t)}
                      className={`capitalize flex items-center justify-between ${
                        currentTheme === t ? "active font-bold" : ""
                      }`}
                    >
                      <span>{t}</span>
                      {currentTheme === t && <span className="text-[10px]">●</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Notifications */}
            <button
              type="button"
              className="btn btn-ghost btn-circle btn-sm"
              aria-label="Notifications"
            >
              <div className="indicator">
                <Bell className="w-4 h-4 text-base-content/70" />
                <span className="badge badge-xs badge-primary indicator-item" />
              </div>
            </button>

            {/* User Profile */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar placeholder btn-sm ml-1"
                aria-label="User menu"
              >
                <div className="bg-neutral text-neutral-content rounded-full w-8">
                  <span className="text-xs font-bold">AD</span>
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-50 p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-300"
              >
                <li className="menu-title text-[11px]">Administrator</li>
                <li>
                  <Link to="/settings">System Settings</Link>
                </li>
                <li>
                  <Link to="/guide">Architecture Guide</Link>
                </li>
                <li className="border-t border-base-200 mt-1 pt-1">
                  <Link to="/login" className="text-error">
                    Sign Out
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* Sidebar Drawer */}
      <div className="drawer-side z-40 border-r border-base-300">
        <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay" />
        <aside className="bg-base-100 w-64 min-h-full flex flex-col justify-between p-4 border-r border-base-200">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 px-2 py-3 mb-4 border-b border-base-200">
              <div className="w-8 h-8 rounded-lg bg-neutral text-neutral-content flex items-center justify-center font-extrabold text-sm shadow-sm">
                C
              </div>
              <div>
                <h1 className="font-extrabold text-sm tracking-tight leading-tight">
                  Admin Console
                </h1>
                <p className="text-[10px] text-base-content/60 font-medium">
                  Cloudflare Edge Monorepo
                </p>
              </div>
            </div>

            {/* Navigation Menu */}
            <ul className="menu menu-sm gap-1 p-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.to;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center justify-between py-2.5 rounded-lg text-xs font-semibold transition ${
                        isActive
                          ? "bg-neutral text-neutral-content active"
                          : "text-base-content/75 hover:bg-base-200 hover:text-base-content"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`badge badge-xs ${
                            isActive ? "badge-outline text-neutral-content" : "badge-neutral"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Footer info */}
          <div className="pt-4 border-t border-base-200 flex flex-col gap-2.5">
            <div className="px-2 py-2 rounded-lg bg-base-200/50 border border-base-300 flex items-center justify-between text-[11px] text-base-content/70">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-success inline-block" />
                Workers Status
              </span>
              <span className="font-semibold text-success">Healthy</span>
            </div>

            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline btn-sm justify-between w-full text-xs font-semibold"
            >
              <span>Visit Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 text-base-content/50" />
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
