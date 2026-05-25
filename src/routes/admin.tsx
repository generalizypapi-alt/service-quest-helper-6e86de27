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
  Search,
  Bell,
  Plus,
  ChevronLeft,
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
      <div className="dark min-h-screen bg-surface text-ink flex items-center justify-center text-ink/40">
        Loading…
      </div>
    );
  }

  const email = session.user?.email ?? "Admin";
  const initial = email.charAt(0).toUpperCase();

  return (
    <div className="dark min-h-screen bg-[oklch(0.16_0.013_50)] text-ink">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-ink/10 bg-[oklch(0.18_0.013_50)] p-4">
          <div className="flex items-center justify-between px-2 py-3">
            <Link to="/" className="text-xl font-semibold tracking-tight text-brand">OKIKE</Link>
            <button className="text-ink/50 hover:text-ink p-1 rounded-md hover:bg-ink/5" aria-label="Collapse">
              <ChevronLeft className="size-4" />
            </button>
          </div>

          <nav className="mt-4 flex-1 flex flex-col gap-0.5">
            {NAV.map((t) => {
              const active = t.exact ? location.pathname === t.to : location.pathname.startsWith(t.to);
              const Icon = t.icon;
              return (
                <Link
                  key={t.to}
                  to={t.to as any}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-brand/15 text-brand ring-1 ring-brand/20"
                      : "text-ink/70 hover:text-ink hover:bg-ink/5"
                  }`}
                >
                  <Icon className="size-4" />
                  {t.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 rounded-2xl p-4 bg-gradient-to-br from-brand/20 to-brand/5 ring-1 ring-brand/20">
            <div className="text-sm font-medium text-ink">Founder console</div>
            <div className="text-xs text-ink/60 mt-1">Manage every inquiry, project, and page in one place.</div>
          </div>

          <button
            onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }}
            className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/60 hover:text-ink hover:bg-ink/5"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-8 py-4 bg-[oklch(0.16_0.013_50)]/80 backdrop-blur border-b border-ink/10">
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center gap-2 rounded-xl bg-[oklch(0.22_0.013_50)] ring-1 ring-ink/10 px-3 py-2 focus-within:ring-brand/40 transition">
                <Search className="size-4 text-ink/40" />
                <input
                  placeholder="Search projects, inquiries, content…"
                  className="flex-1 bg-transparent text-sm placeholder:text-ink/40 focus:outline-none"
                />
                <kbd className="hidden md:inline-flex text-[10px] text-ink/40 ring-1 ring-ink/10 rounded px-1.5 py-0.5">⌘K</kbd>
              </div>
            </div>
            <Link
              to="/admin/content/portfolio"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-brand text-brand-foreground px-3.5 py-2 text-sm font-medium hover:opacity-90"
            >
              <Plus className="size-4" /> New
            </Link>
            <button className="relative rounded-xl p-2 ring-1 ring-ink/10 hover:bg-ink/5" aria-label="Notifications">
              <Bell className="size-4 text-ink/70" />
              <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-brand text-[10px] font-semibold text-brand-foreground grid place-items-center">3</span>
            </button>
            <div className="size-9 rounded-full bg-brand/20 ring-1 ring-brand/30 grid place-items-center text-sm font-semibold text-brand">
              {initial}
            </div>
          </header>

          {/* Mobile nav scroll */}
          <div className="lg:hidden border-b border-ink/10 bg-[oklch(0.18_0.013_50)] overflow-x-auto">
            <div className="flex gap-1 px-4 py-2">
              {NAV.map((t) => {
                const active = t.exact ? location.pathname === t.to : location.pathname.startsWith(t.to);
                return (
                  <Link
                    key={t.to}
                    to={t.to as any}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium ${
                      active ? "bg-brand/15 text-brand" : "text-ink/60"
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
