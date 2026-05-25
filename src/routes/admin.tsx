import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site/SiteHeader";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — OKIKE" }] }),
  component: AdminLayout,
});

const TABS: { to: string; label: string; exact?: boolean }[] = [
  { to: "/admin", label: "Overview", exact: true },
  { to: "/admin/inquiries", label: "Inquiries" },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/content/packages", label: "Packages" },
  { to: "/admin/content/services", label: "Services" },
  { to: "/admin/content/addons", label: "Add-ons" },
  { to: "/admin/content/portfolio", label: "Portfolio" },
  { to: "/admin/content/partners", label: "Partners" },
  { to: "/admin/content/team", label: "Team" },
  { to: "/admin/settings", label: "Site settings" },
];

function AdminLayout() {
  const { session, role, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!session) navigate({ to: "/login" });
    else if (role && role !== "admin") navigate({ to: "/dashboard" });
  }, [session, role, loading, navigate]);

  if (loading || !session || role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink/40">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface text-ink">
      <SiteHeader />
      <div className="border-b border-ink/5 bg-card">
        <div className="max-w-7xl mx-auto px-6 flex gap-1 overflow-x-auto">
          {TABS.map((t) => {
            const active = t.exact ? location.pathname === t.to : location.pathname.startsWith(t.to);
            return (
              <Link
                key={t.to}
                to={t.to as any}
                className={`whitespace-nowrap px-4 py-3 text-sm font-medium transition border-b-2 ${
                  active ? "border-brand text-brand" : "border-transparent text-ink/60 hover:text-ink"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
