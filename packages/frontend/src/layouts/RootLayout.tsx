import { OrganizationSwitcher, UserButton } from "@daveyplate/better-auth-ui";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function RootLayout({ children }: { children?: ReactNode }) {
  const { location } = useRouterState();

  const content = children ?? <Outlet />;

  return (
    <div className="bg-background text-foreground">
      <header className="border-border border-b bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link className="font-semibold" to="/">
            SagraTorreglia
          </Link>
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-3 text-sm">
              <Link
                activeProps={{ className: "bg-accent text-accent-foreground" }}
                className="rounded-md px-3 py-1 transition-colors hover:bg-accent hover:text-accent-foreground"
                to="/"
              >
                Home
              </Link>
            </nav>
            <OrganizationSwitcher
              aria-label="Selettore parrocchia"
              className="hidden sm:flex"
              size="icon"
            />
            <UserButton size="icon" />
          </div>
        </div>
      </header>
      <main className="mx-auto flex max-w-5xl flex-col px-6 py-10">
        {content}
      </main>
      <footer className="border-border border-t bg-card/40 py-6 text-center text-muted-foreground text-xs">
        Posizione attuale: {location.pathname}
      </footer>
    </div>
  );
}
