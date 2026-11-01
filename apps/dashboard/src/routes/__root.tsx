import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  redirect,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import DashboardLayout from "../components/DashboardLayout";
import { getAdminUser } from "#/lib/auth";
import { APP_NAME } from "#/lib/config";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "robots", content: "noindex" },
      { title: `${APP_NAME} admin` },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  // Every page except /login needs an admin session. Server functions re-check via adminOnly.
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/login") return { user: null };
    const user = await getAdminUser();
    if (!user) throw redirect({ to: "/login" });
    return { user };
  },
  shellComponent: RootDocument,
  component: RootLayout,
  pendingComponent: () => (
    <p className="p-8 font-mono text-[13px] text-muted" role="status">
      loading…
    </p>
  ),
  errorComponent: RootError,
});

function RootLayout() {
  const { user } = Route.useRouteContext();
  if (!user) return <Outlet />;
  return (
    <DashboardLayout user={user}>
      <Outlet />
    </DashboardLayout>
  );
}

function RootError({ error }: ErrorComponentProps) {
  const router = useRouter();
  const message = error instanceof Error ? error.message : String(error);
  const unauthorized = message === "Unauthorized";
  return (
    <div className="max-w-xl p-8 font-mono text-[13px] leading-6" role="alert">
      <p className="man-h text-error">Error</p>
      <p className="mt-2">{unauthorized ? "Your admin session has ended." : message}</p>
      <div className="mt-4 flex gap-1 -mx-2">
        {unauthorized ? (
          <Link to="/login" className="ctl ctl-primary">
            sign in again
          </Link>
        ) : (
          <button type="button" className="ctl" onClick={() => router.invalidate()}>
            retry
          </button>
        )}
      </div>
    </div>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-base-100 text-base-content antialiased">
        {children}
        <TanStackDevtools
          config={{ position: "bottom-right" }}
          plugins={[{ name: "Tanstack Router", render: <TanStackRouterDevtoolsPanel /> }]}
        />
        <Scripts />
      </body>
    </html>
  );
}
