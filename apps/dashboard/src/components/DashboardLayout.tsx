import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { signOut } from "#/lib/auth-client";
import { APP_NAME, STOREFRONT_URL } from "#/lib/config";

// Man-page section numbers: 1 commands, 5 file formats, 7 misc, 8 administration.
const SECTIONS = [
  { to: "/", label: "overview", n: 1 },
  { to: "/users", label: "users", n: 5 },
  { to: "/files", label: "files", n: 7 },
  { to: "/settings", label: "settings", n: 8 },
  { to: "/guide", label: "guide", n: 9 },
] as const;

const TITLE = `${APP_NAME.toUpperCase()}(8)`;

export default function DashboardLayout({
  user,
  children,
}: {
  user: { email: string };
  children: ReactNode;
}) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:bg-base-100 focus:p-2 font-mono text-sm"
      >
        Skip to content
      </a>

      {/* Running header, as on every page of a manual. */}
      <header className="sticky top-0 z-30 bg-base-100 border-b border-base-content">
        <div className="mx-auto max-w-[90rem] h-12 px-4 sm:px-6 grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-4 font-mono text-[13px]">
          <Link to="/" className="flex items-center gap-2.5 font-bold min-w-0">
            <span
              aria-hidden
              className="grid size-6 shrink-0 place-items-center bg-primary text-primary-content text-xs"
            >
              {APP_NAME.charAt(0).toUpperCase()}
            </span>
            <span className="truncate">{TITLE}</span>
          </Link>
          <span className="hidden md:block text-muted">System Administration Manual</span>
          <div className="flex items-center justify-end gap-2 min-w-0">
            <span className="hidden sm:block text-muted truncate max-w-[28ch]" title={user.email}>
              {user.email}
            </span>
            <button type="button" className="ctl" onClick={handleSignOut}>
              sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[90rem] flex-1 md:grid md:grid-cols-[12rem_minmax(0,1fr)]">
        <nav
          aria-label="Sections"
          className="border-b border-base-300 md:border-b-0 md:border-r md:sticky md:top-12 md:self-start md:h-[calc(100vh-3rem)] flex md:flex-col"
        >
          <h2 className="man-h hidden md:block px-6 pt-10 pb-3 text-muted">Index</h2>
          <ul className="flex flex-wrap md:flex-col md:flex-nowrap px-2 md:px-3 py-1 md:py-0 font-mono text-[13px]">
            {SECTIONS.map((s) => (
              <li key={s.to}>
                <Link
                  to={s.to}
                  activeOptions={{ exact: true }}
                  className="group flex items-baseline gap-0.5 px-3 py-2 md:py-1.5 transition-colors duration-(--dur) hover:bg-base-200 data-[status=active]:text-primary data-[status=active]:font-bold"
                >
                  {s.label}
                  <span className="text-muted group-data-[status=active]:text-primary">
                    ({s.n})
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="hidden md:block mt-auto px-6 pb-6 font-mono text-xs leading-6">
            <p className="man-h text-[11px] text-muted mb-1">See also</p>
            <a
              href={STOREFRONT_URL}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-primary"
            >
              storefront(1)
            </a>
          </div>
        </nav>

        <main id="main" className="min-w-0 px-4 sm:px-8 lg:px-12 pt-8 pb-16 md:pt-10">
          {children}
        </main>
      </div>

      {/* Running footer. */}
      <footer className="border-t border-base-content">
        <div className="mx-auto max-w-[90rem] h-10 px-4 sm:px-6 flex items-center justify-between font-mono text-xs text-muted">
          <span>{APP_NAME} admin</span>
          <span className="hidden sm:inline">{new Date().toISOString().slice(0, 10)}</span>
          <span>{TITLE}</span>
        </div>
      </footer>
    </div>
  );
}
