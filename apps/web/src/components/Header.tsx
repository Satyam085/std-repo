import { Link } from "@tanstack/react-router";
import { signOut, useSession } from "#/lib/auth-client";
import { DASHBOARD_URL } from "#/lib/config";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/85 px-4 backdrop-blur-md">
      <nav className="page-container flex h-16 items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white font-bold text-sm tracking-tight shadow-sm transition group-hover:scale-105">
              E
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-neutral-900">
                Edge Storefront
              </span>
              <span className="text-[10px] text-neutral-600 font-medium tracking-wide uppercase">
                SSR · TanStack Start
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium text-neutral-600">
            <Link
              to="/products"
              className="rounded-md px-3 py-1.5 transition hover:text-neutral-950 hover:bg-neutral-100/70"
              activeProps={{ className: "text-neutral-950 font-semibold bg-neutral-100/80" }}
            >
              Products
            </Link>
            <Link
              to="/contact"
              className="rounded-md px-3 py-1.5 transition hover:text-neutral-950 hover:bg-neutral-100/70"
              activeProps={{ className: "text-neutral-950 font-semibold bg-neutral-100/80" }}
            >
              Contact
            </Link>
            <Link
              to="/guide"
              className="rounded-md px-3 py-1.5 transition hover:text-neutral-950 hover:bg-neutral-100/70"
              activeProps={{ className: "text-neutral-950 font-semibold bg-neutral-100/80" }}
            >
              Guide
            </Link>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <a
            href={DASHBOARD_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-200/90 hover:bg-neutral-50 hover:border-neutral-300 transition"
          >
            Dashboard
            <span className="text-neutral-400">↗</span>
          </a>

          {session ? (
            <button
              type="button"
              onClick={() => signOut()}
              title={session.user.email}
              className="inline-flex items-center justify-center rounded-lg border border-neutral-200 px-4 py-1.5 text-xs font-semibold text-neutral-800 transition hover:bg-neutral-50 cursor-pointer"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-neutral-800 shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
