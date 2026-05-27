import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutGrid,
  Users,
  Building2,
  FolderKanban,
  GraduationCap,
  BarChart3,
  Sparkles,
  CreditCard,
  FileText,
  ShieldAlert,
  Megaphone,
  HeartPulse,
  Settings,
  Search,
  Menu,
  MessageSquare,
  Bell,
  Moon,
  Sun,
  Plus,
  MoreVertical,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — OKIKE" }] }),
  component: AdminLayout,
});

const NAV: { to: string; label: string; icon: any; badge?: number; exact?: boolean }[] = [
  { to: "/admin", label: "Overview", icon: LayoutGrid, exact: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/organizations", label: "Organizations", icon: Building2 },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/learning", label: "Learning & Courses", icon: GraduationCap },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/ai-systems", label: "AI Systems", icon: Sparkles },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/reports", label: "Reports & Logs", icon: FileText },
  { to: "/admin/moderation", label: "Moderation", icon: ShieldAlert },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { to: "/admin/system-health", label: "System Health", icon: HeartPulse },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminLayout() {
  const { session, role, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dark, setDark] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!session) navigate({ to: "/login" });
    else if (role && role !== "admin") navigate({ to: "/dashboard" });
  }, [session, role, loading, navigate]);

  if (loading || !session || role !== "admin") {
    return (
      <div className="dark min-h-screen bg-[oklch(0.13_0.01_50)] text-ink flex items-center justify-center text-ink/40">
        Loading…
      </div>
    );
  }

  const email = session.user?.email ?? "Admin";
  const name = "Daniel Okike";
  const initial = (email[0] ?? "A").toUpperCase();
  const now = new Date();
  const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true });
  const date = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className={`${dark ? "dark" : ""} min-h-screen bg-[oklch(0.13_0.01_50)] text-ink`}>
      <div className="flex">
        {/* Sidebar — sticky */}
        <aside className="hidden lg:flex sticky top-0 h-screen w-64 shrink-0 flex-col border-r border-ink/10 bg-[oklch(0.15_0.012_50)] px-5 py-5 overflow-y-auto">
          <div>
            <Link to="/" className="block text-2xl font-bold tracking-tight text-brand">OKIKE</Link>
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink/40 mt-0.5">Admin Dashboard</div>
          </div>

          <nav className="mt-8 flex-1 flex flex-col gap-1">
            {NAV.map((t) => {
              const active = t.exact ? location.pathname === t.to : location.pathname.startsWith(t.to);
              const Icon = t.icon;
              return (
                <Link
                  key={t.to}
                  to={t.to as any}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-brand/15 text-brand ring-1 ring-brand/30 shadow-[0_0_20px_-8px_oklch(0.72_0.15_55/0.5)]"
                      : "text-ink/70 hover:text-ink hover:bg-ink/5"
                  }`}
                >
                  <Icon className="size-4" />
                  <span className="flex-1">{t.label}</span>
                  {t.badge ? (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-brand text-brand-foreground min-w-[20px] text-center">
                      {t.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          {/* System status */}
          <div className="mt-6 px-1">
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink/40 mb-2">System Status</div>
            <div className="flex items-center gap-2 text-xs text-ink/80">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </div>
          </div>

          <div className="mt-3 rounded-xl bg-[oklch(0.18_0.013_50)] ring-1 ring-ink/10 p-3">
            <div className="text-[10px] uppercase tracking-wider text-ink/40">Server Time</div>
            <div className="text-xs font-medium mt-0.5">{date} — {time}</div>
            <div className="flex items-center justify-between mt-3 text-xs">
              <span className="text-ink/60">Uptime</span>
              <span className="font-semibold text-emerald-400">99.9%</span>
            </div>
          </div>

          {/* User profile */}
          <button
            onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }}
            className="mt-3 flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-ink/5 text-left"
          >
            <div className="relative">
              <div className="size-10 rounded-full bg-brand/20 ring-2 ring-brand/30 grid place-items-center text-sm font-semibold text-brand">
                {initial}
              </div>
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-400 ring-2 ring-[oklch(0.15_0.012_50)]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{name}</div>
              <div className="text-[11px] text-ink/50">Super Admin</div>
            </div>
            <MoreVertical className="size-4 text-ink/40" />
          </button>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-8 py-4 bg-[oklch(0.13_0.01_50)]/85 backdrop-blur border-b border-ink/10">
            <button className="lg:hidden text-ink/70 p-2 hover:bg-ink/5 rounded-lg" aria-label="Menu">
              <Menu className="size-5" />
            </button>
            <button className="hidden lg:grid size-9 place-items-center text-ink/60 hover:bg-ink/5 rounded-lg" aria-label="Menu">
              <Menu className="size-5" />
            </button>

            <div className="flex-1 max-w-2xl">
              <div className="flex items-center gap-2 rounded-xl bg-[oklch(0.18_0.013_50)] ring-1 ring-ink/10 px-3 py-2.5 focus-within:ring-brand/40 transition">
                <Search className="size-4 text-ink/40" />
                <input
                  placeholder="Search users, projects, transactions..."
                  className="flex-1 bg-transparent text-sm placeholder:text-ink/40 focus:outline-none"
                />
                <kbd className="hidden md:inline-flex text-[10px] text-ink/40 ring-1 ring-ink/10 rounded px-1.5 py-0.5">⌘K</kbd>
              </div>
            </div>

            <button className="inline-flex items-center gap-2 rounded-xl bg-brand text-brand-foreground px-3 md:px-4 py-2.5 text-sm font-semibold hover:opacity-90 ring-1 ring-brand/40 shadow-[0_0_24px_-8px_oklch(0.72_0.15_55/0.6)]">
              <Plus className="size-4" />
              <span className="hidden sm:inline">Quick Action</span>
            </button>
            <button className="relative rounded-xl p-2.5 ring-1 ring-ink/10 hover:bg-ink/5" aria-label="Messages">
              <MessageSquare className="size-4 text-ink/70" />
              <span className="absolute -top-1 -right-1 size-4 rounded-full bg-brand text-[10px] font-semibold text-brand-foreground grid place-items-center">12</span>
            </button>
            <button className="relative rounded-xl p-2.5 ring-1 ring-ink/10 hover:bg-ink/5" aria-label="Notifications">
              <Bell className="size-4 text-ink/70" />
              <span className="absolute -top-1 -right-1 size-4 rounded-full bg-brand text-[10px] font-semibold text-brand-foreground grid place-items-center">7</span>
            </button>
            <button
              onClick={() => setDark((d) => !d)}
              className="rounded-xl p-2.5 ring-1 ring-ink/10 hover:bg-ink/5"
              aria-label="Theme"
            >
              {dark ? <Moon className="size-4 text-ink/70" /> : <Sun className="size-4 text-ink/70" />}
            </button>
            <button className="relative">
              <div className="size-9 rounded-full bg-brand/20 ring-2 ring-brand/30 grid place-items-center text-xs font-semibold text-brand">
                {initial}
              </div>
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-400 ring-2 ring-[oklch(0.13_0.01_50)]" />
            </button>
          </header>

          {/* Mobile nav */}
          <div className="lg:hidden border-b border-ink/10 bg-[oklch(0.15_0.012_50)] overflow-x-auto">
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
