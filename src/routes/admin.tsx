import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Inbox,
  FolderKanban,
  Package,
  Wrench,
  PlusSquare,
  Image as ImageIcon,
  Handshake,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — OKIKE" }] }),
  component: AdminLayout,
});

const NAV: { to: string; label: string; icon: any; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/content/packages", label: "Packages", icon: Package },
  { to: "/admin/content/services", label: "Services", icon: Wrench },
  { to: "/admin/content/addons", label: "Add-ons", icon: PlusSquare },
  { to: "/admin/content/portfolio", label: "Portfolio", icon: ImageIcon },
  { to: "/admin/content/partners", label: "Partners", icon: Handshake },
  { to: "/admin/content/team", label: "Team", icon: Users },
  { to: "/admin/settings", label: "Site settings", icon: Settings },
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
      <div className="min-h-screen bg-surface text-ink flex items-center justify-center text-ink/40">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary text-ink">
      <div className="flex">
        {/* Sticky sidebar */}
        <aside className="hidden lg:flex sticky top-0 h-screen w-60 shrink-0 flex-col border-r border-ink/10 bg-card px-4 py-5 overflow-y-auto">
          <Link to="/" className="px-2 text-lg font-semibold tracking-tight text-brand">OKIKE</Link>
          <div className="px-2 text-[10px] uppercase tracking-widest text-ink/40 mt-1">Admin console</div>

          <nav className="mt-6 flex-1 flex flex-col gap-0.5">
            {NAV.map((t) => {
              const active = t.exact ? location.pathname === t.to : location.pathname.startsWith(t.to);
              const Icon = t.icon;
              return (
                <Link
                  key={t.to}
                  to={t.to as any}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active ? "bg-brand/10 text-brand" : "text-ink/70 hover:text-ink hover:bg-ink/5"
                  }`}
                >
                  <Icon className="size-4" />
                  {t.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }}
            className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink/60 hover:text-ink hover:bg-ink/5"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {/* Mobile nav */}
          <div className="lg:hidden border-b border-ink/10 bg-card overflow-x-auto">
            <div className="flex gap-1 px-4 py-2">
              {NAV.map((t) => {
                const active = t.exact ? location.pathname === t.to : location.pathname.startsWith(t.to);
                return (
                  <Link
                    key={t.to}
                    to={t.to as any}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium ${
                      active ? "bg-brand/10 text-brand" : "text-ink/60"
                    }`}
                  >
                    {t.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <main className="flex-1 px-4 md:px-8 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
