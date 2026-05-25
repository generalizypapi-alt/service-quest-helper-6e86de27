import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  FolderKanban,
  CheckCircle2,
  Inbox,
  TrendingUp,
  ArrowUpRight,
  Plus,
  FileUp,
  UserPlus,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const { session } = useAuth();
  const [stats, setStats] = useState({ inquiries: 0, projects: 0, inProgress: 0, completed: 0 });
  const [recent, setRecent] = useState<{ id: string; name: string; project_type: string; status: string; created_at: string }[]>([]);
  const [activeProjects, setActiveProjects] = useState<{ id: string; title: string; package_name: string | null; stage: string }[]>([]);

  useEffect(() => {
    async function load() {
      const [{ count: inq }, { count: proj }, { count: ip }, { count: comp }, { data: r }, { data: ap }] = await Promise.all([
        supabase.from("project_inquiries").select("*", { count: "exact", head: true }),
        supabase.from("client_projects").select("*", { count: "exact", head: true }),
        supabase.from("client_projects").select("*", { count: "exact", head: true }).eq("stage", "in_progress"),
        supabase.from("client_projects").select("*", { count: "exact", head: true }).eq("stage", "completed"),
        supabase.from("project_inquiries").select("id, name, project_type, status, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("client_projects").select("id, title, package_name, stage").in("stage", ["accepted", "in_progress"]).order("created_at", { ascending: false }).limit(4),
      ]);
      setStats({ inquiries: inq ?? 0, projects: proj ?? 0, inProgress: ip ?? 0, completed: comp ?? 0 });
      setRecent((r ?? []) as never);
      setActiveProjects((ap ?? []) as never);
    }
    load();
  }, []);

  const name = session?.user?.email?.split("@")[0] ?? "Founder";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex flex-col gap-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[oklch(0.22_0.02_55)] to-[oklch(0.18_0.013_50)] ring-1 ring-ink/10 p-8">
        <div className="absolute -top-10 -right-10 size-64 rounded-full bg-brand/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 size-48 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-serif tracking-tight capitalize">
            {greeting}, <span className="text-brand">{name}</span>.
          </h1>
          <p className="text-ink/60 mt-2 text-sm md:text-base">
            {stats.inProgress > 0
              ? `${stats.inProgress} active project${stats.inProgress > 1 ? "s are" : " is"} progressing smoothly.`
              : "Everything's calm. Time to ship something new."}
          </p>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Inquiries" value={stats.inquiries} delta="+20%" icon={Inbox} />
        <Stat label="Active projects" value={stats.inProgress} delta="+28%" icon={FolderKanban} />
        <Stat label="Completed" value={stats.completed} delta="+18%" icon={CheckCircle2} />
        <Stat label="Total projects" value={stats.projects} delta="+35%" icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active projects */}
        <section className="lg:col-span-2 rounded-2xl bg-[oklch(0.22_0.013_50)] ring-1 ring-ink/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-ink/10 flex justify-between items-center">
            <h2 className="text-sm font-semibold">Active projects</h2>
            <Link to="/admin/projects" className="text-xs text-brand flex items-center gap-1">View all <ArrowUpRight className="size-3" /></Link>
          </div>
          <ul className="divide-y divide-ink/10">
            {activeProjects.length === 0 && (
              <li className="px-6 py-10 text-sm text-ink/40 text-center">No active projects yet.</li>
            )}
            {activeProjects.map((p, i) => {
              const pct = p.stage === "in_progress" ? 60 + ((i * 13) % 30) : 25;
              return (
                <li key={p.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-brand/15 ring-1 ring-brand/20 grid place-items-center text-brand">
                    <FolderKanban className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{p.title}</div>
                    <div className="text-xs text-ink/40 truncate">{p.package_name ?? p.stage.replace("_", " ")}</div>
                  </div>
                  <div className="hidden sm:flex items-center gap-3 w-48">
                    <div className="flex-1 h-1.5 rounded-full bg-ink/10 overflow-hidden">
                      <div className="h-full bg-brand rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-medium text-ink/70 w-8 text-right">{pct}%</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Quick actions */}
        <section className="rounded-2xl bg-[oklch(0.22_0.013_50)] ring-1 ring-ink/10 p-6">
          <h2 className="text-sm font-semibold mb-4">Quick actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <QuickAction to="/admin/content/portfolio" icon={Plus} label="New work" />
            <QuickAction to="/admin/content/packages" icon={FileUp} label="New package" />
            <QuickAction to="/admin/inquiries" icon={UserPlus} label="Inquiries" />
            <QuickAction to="/admin/settings" icon={Sparkles} label="Site copy" />
          </div>

          <div className="mt-6 rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 ring-1 ring-brand/20 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="size-4 text-brand" /> OKIKE Assistant
            </div>
            <p className="text-xs text-ink/60 mt-1">AI helper coming soon — drafting replies, summaries, project updates.</p>
          </div>
        </section>
      </div>

      {/* Recent inquiries */}
      <section className="rounded-2xl bg-[oklch(0.22_0.013_50)] ring-1 ring-ink/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-ink/10 flex justify-between items-center">
          <h2 className="text-sm font-semibold">Recent inquiries</h2>
          <Link to="/admin/inquiries" className="text-xs text-brand flex items-center gap-1">View all <ArrowUpRight className="size-3" /></Link>
        </div>
        <ul className="divide-y divide-ink/10">
          {recent.length === 0 && <li className="px-6 py-8 text-sm text-ink/40 text-center">No inquiries yet.</li>}
          {recent.map((r) => (
            <li key={r.id} className="px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-9 rounded-full bg-brand/15 ring-1 ring-brand/20 grid place-items-center text-xs font-semibold text-brand uppercase">
                  {r.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{r.name} <span className="text-ink/40 font-normal">— {r.project_type}</span></div>
                  <div className="text-xs text-ink/40">{new Date(r.created_at).toLocaleString()}</div>
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-brand/15 text-brand ring-1 ring-brand/20 font-medium">{r.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value, delta, icon: Icon }: { label: string; value: number; delta: string; icon: any }) {
  return (
    <div className="rounded-2xl bg-[oklch(0.22_0.013_50)] ring-1 ring-ink/10 p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-ink/50">{label}</div>
        <div className="size-8 rounded-lg bg-brand/15 ring-1 ring-brand/20 grid place-items-center text-brand">
          <Icon className="size-4" />
        </div>
      </div>
      <div className="text-3xl font-semibold mt-3 tracking-tight">{value}</div>
      <div className="text-xs mt-1 text-emerald-400 flex items-center gap-1">
        <TrendingUp className="size-3" /> {delta} <span className="text-ink/40">this month</span>
      </div>
    </div>
  );
}

function QuickAction({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <Link
      to={to as any}
      className="flex flex-col items-center gap-2 rounded-xl bg-[oklch(0.18_0.013_50)] ring-1 ring-ink/10 px-3 py-4 text-xs font-medium text-ink/80 hover:text-brand hover:ring-brand/30 transition"
    >
      <Icon className="size-5 text-brand" />
      {label}
    </Link>
  );
}
