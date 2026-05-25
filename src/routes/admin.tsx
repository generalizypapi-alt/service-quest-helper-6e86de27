import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  BarChart3,
  MessageSquare,
  FileText,
  Users,
  Receipt,
  Settings,
  Search,
  Bell,
  Plus,
  ChevronLeft,
  ChevronRight,
  Crown,
  MoreVertical,
  LogOut,
  Inbox,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — OKIKE" }] }),
  component: AdminLayout,
});

const NAV: { to: string; label: string; icon: any; badge?: number; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/ai-tools", label: "AI Tools", icon: Sparkles },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/inquiries", label: "Messages", icon: MessageSquare, badge: 4 },
  { to: "/admin/content/portfolio", label: "Files", icon: FileText },
  { to: "/admin/content/team", label: "Team", icon: Users },
  { to: "/admin/invoices", label: "Invoices", icon: Receipt },
  { to: "/admin/settings", label: "Settings", icon: Settings },
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
      <div className="dark min-h-screen bg-[oklch(0.14_0.01_50)] text-ink flex items-center justify-center text-ink/40">
        Loading…
      </div>
    );
  }

  const email = session.user?.email ?? "Admin";
  const name = email.split("@")[0];
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="dark min-h-screen bg-[oklch(0.14_0.01_50)] text-ink">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-ink/10 bg-[oklch(0.16_0.013_50)] px-4 py-5">
          <div className="flex items-center justify-between px-2">
            <Link to="/" className="text-xl font-semibold tracking-tight text-brand">OKIKE</Link>
            <button className="text-ink/50 hover:text-ink p-1 rounded-md hover:bg-ink/5" aria-label="Collapse">
              <ChevronLeft className="size-4" />
            </button>
          </div>

          <nav className="mt-6 flex-1 flex flex-col gap-1">
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
                  <span className="flex-1">{t.label}</span>
                  {t.badge ? (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-brand text-brand-foreground min-w-[18px] text-center">
                      {t.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          {/* Upgrade card */}
          <div className="mt-4 rounded-2xl p-4 bg-gradient-to-br from-brand/25 to-brand/5 ring-1 ring-brand/20 flex items-center gap-3 cursor-pointer hover:from-brand/30 transition">
            <div className="size-9 rounded-xl bg-brand/20 ring-1 ring-brand/30 grid place-items-center text-brand">
              <Crown className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">Upgrade Plan</div>
              <div className="text-[11px] text-ink/60">Unlock more features</div>
            </div>
            <ChevronRight className="size-4 text-ink/50" />
          </div>

          {/* User profile */}
          <div className="mt-3 flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-ink/5">
            <div className="size-10 rounded-full bg-brand/20 ring-2 ring-brand/30 grid place-items-center text-sm font-semibold text-brand">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate capitalize">{name}</div>
              <div className="text-[11px] text-ink/50">Founder</div>
            </div>
            <button
              onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }}
              className="text-ink/40 hover:text-brand p-1 rounded"
              aria-label="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-8 py-4 bg-[oklch(0.14_0.01_50)]/85 backdrop-blur border-b border-ink/10">
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center gap-2 rounded-xl bg-[oklch(0.18_0.013_50)] ring-1 ring-ink/10 px-3 py-2.5 focus-within:ring-brand/40 transition">
                <Search className="size-4 text-ink/40" />
                <input
                  placeholder="Search projects, files, tasks..."
                  className="flex-1 bg-transparent text-sm placeholder:text-ink/40 focus:outline-none"
                />
                <kbd className="hidden md:inline-flex text-[10px] text-ink/40 ring-1 ring-ink/10 rounded px-1.5 py-0.5">⌘K</kbd>
              </div>
            </div>
            <Link
              to="/admin/content/portfolio"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-brand text-brand-foreground px-4 py-2.5 text-sm font-medium hover:opacity-90"
            >
              <Plus className="size-4" /> New
            </Link>
            <button className="relative rounded-xl p-2.5 ring-1 ring-ink/10 hover:bg-ink/5" aria-label="Notifications">
              <Bell className="size-4 text-ink/70" />
              <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-brand text-[10px] font-semibold text-brand-foreground grid place-items-center">3</span>
            </button>
            <div className="relative">
              <div className="size-10 rounded-full bg-brand/20 ring-2 ring-brand/30 grid place-items-center text-sm font-semibold text-brand">
                {initial}
              </div>
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-400 ring-2 ring-[oklch(0.14_0.01_50)]" />
            </div>
          </header>

          {/* Mobile nav */}
          <div className="lg:hidden border-b border-ink/10 bg-[oklch(0.16_0.013_50)] overflow-x-auto">
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
