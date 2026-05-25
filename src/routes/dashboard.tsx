import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
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
  LogOut,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  FilePlus,
  Upload,
  CheckSquare,
  UserPlus,
  FileBarChart,
  Workflow,
  CircleUserRound,
  UserCog,
  ClipboardCheck,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";


export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — OKIKE" }] }),
  component: DashboardPage,
});

type Section = "dashboard" | "projects" | "ai" | "analytics" | "messages" | "files" | "team" | "invoices" | "settings";

const NAV: { key: Section; label: string; icon: any; badge?: number }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "ai", label: "AI Tools", icon: Sparkles },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "messages", label: "Messages", icon: MessageSquare, badge: 4 },
  { key: "files", label: "Files", icon: FileText },
  { key: "team", label: "Team", icon: Users },
  { key: "invoices", label: "Invoices", icon: Receipt },
  { key: "settings", label: "Settings", icon: Settings },
];

const chartData = [
  { date: "May 1", users: 820 },
  { date: "May 4", users: 1020 },
  { date: "May 8", users: 950 },
  { date: "May 12", users: 1180 },
  { date: "May 15", users: 1080 },
  { date: "May 18", users: 1380 },
  { date: "May 20", users: 1642 },
  { date: "May 22", users: 1520 },
  { date: "May 25", users: 1720 },
  { date: "May 29", users: 1820 },
];

const productivityData = [{ name: "Productivity", value: 76, fill: "oklch(0.72 0.15 55)" }];
const weekdays = [
  { d: "Mon", v: 40 },
  { d: "Tue", v: 55 },
  { d: "Wed", v: 65 },
  { d: "Thu", v: 100 },
  { d: "Fri", v: 60 },
  { d: "Sat", v: 35 },
  { d: "Sun", v: 50 },
];

function DashboardPage() {
  const { session, loading, user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("dashboard");
  const [activeProjects, setActiveProjects] = useState<{ id: string; title: string; package_name: string | null; stage: string }[]>([]);
  const [recent, setRecent] = useState<{ id: string; name: string; project_type: string; created_at: string }[]>([]);
  const [allProjects, setAllProjects] = useState<{ id: string; title: string; package_name: string | null; stage: string; created_at: string }[]>([]);
  const [tab, setTab] = useState<"all" | "in_progress" | "completed">("all");

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/login" });
  }, [loading, session, navigate]);

  useEffect(() => {
    if (!session) return;
    async function load() {
      const [{ data: ap }, { data: r }, { data: all }] = await Promise.all([
        supabase.from("client_projects").select("id, title, package_name, stage").in("stage", ["accepted", "in_progress"]).order("created_at", { ascending: false }).limit(3),
        supabase.from("project_inquiries").select("id, name, project_type, created_at").order("created_at", { ascending: false }).limit(4),
        supabase.from("client_projects").select("id, title, package_name, stage, created_at").order("created_at", { ascending: false }),
      ]);
      setActiveProjects((ap ?? []) as never);
      setRecent((r ?? []) as never);
      setAllProjects((all ?? []) as never);
    }
    load();
  }, [session]);

  const stats = useMemo(() => {
    const inProgress = allProjects.filter(p => p.stage === "in_progress").length;
    const completed = allProjects.filter(p => p.stage === "completed").length;
    return { inProgress, completed, total: allProjects.length };
  }, [allProjects]);

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-secondary text-ink flex items-center justify-center text-ink/40">
        Loading…
      </div>
    );
  }

  const fullName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";
  const initial = fullName.charAt(0).toUpperCase();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-secondary text-ink">
      <div className="flex">
        {/* Sidebar — sticky, full viewport height, scrolls independently */}
        <aside className="hidden lg:flex sticky top-0 h-screen w-64 shrink-0 flex-col border-r border-ink/10 bg-card px-4 py-5 overflow-y-auto">
          <div className="flex items-center justify-between px-2">
            <Link to="/" className="text-xl font-semibold tracking-tight text-brand">OKIKE</Link>
            <button className="text-ink/50 hover:text-ink p-1 rounded-md hover:bg-ink/5" aria-label="Collapse">
              <ChevronLeft className="size-4" />
            </button>
          </div>

          <nav className="mt-6 flex-1 flex flex-col gap-1">
            {NAV.map((t) => {
              const active = section === t.key;
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => setSection(t.key)}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition text-left ${
                    active ? "bg-brand/15 text-brand ring-1 ring-brand/20" : "text-ink/70 hover:text-ink hover:bg-ink/5"
                  }`}
                >
                  <Icon className="size-4" />
                  <span className="flex-1">{t.label}</span>
                  {t.badge ? (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-brand text-brand-foreground min-w-[18px] text-center">
                      {t.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}

            {role === "admin" && (
              <Link
                to="/admin"
                className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/70 hover:text-brand hover:bg-ink/5 ring-1 ring-ink/10"
              >
                <Shield className="size-4" /> Admin panel
              </Link>
            )}
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
              <div className="text-sm font-medium truncate capitalize">{fullName}</div>
              <div className="text-[11px] text-ink/50 capitalize">{role || "client"}</div>
            </div>
            <button
              onClick={async () => { await signOut(); navigate({ to: "/" }); }}
              className="text-ink/40 hover:text-brand p-1 rounded"
              aria-label="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </aside>

        {/* Main column */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-8 py-4 bg-surface/85 backdrop-blur border-b border-ink/10">
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center gap-2 rounded-xl bg-card ring-1 ring-ink/10 px-3 py-2.5 focus-within:ring-brand/40 transition">
                <Search className="size-4 text-ink/40" />
                <input
                  placeholder="Search projects, files, tasks..."
                  className="flex-1 bg-transparent text-sm placeholder:text-ink/40 focus:outline-none"
                />
                <kbd className="hidden md:inline-flex text-[10px] text-ink/40 ring-1 ring-ink/10 rounded px-1.5 py-0.5">⌘K</kbd>
              </div>
            </div>
            <Link
              to="/book"
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
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-400 ring-2 ring-surface" />
            </div>
          </header>

          {/* Mobile nav */}
          <div className="lg:hidden border-b border-ink/10 bg-card overflow-x-auto">
            <div className="flex gap-1 px-4 py-2">
              {NAV.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setSection(t.key)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium ${
                    section === t.key ? "bg-brand/15 text-brand" : "text-ink/60"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <main className="flex-1 px-4 md:px-8 py-6">
            {section === "dashboard" && (
              <DashboardOverview
                fullName={fullName}
                greeting={greeting}
                stats={stats}
                activeProjects={activeProjects}
                recent={recent}
                tab={tab}
                setTab={setTab}
              />
            )}
            {section !== "dashboard" && (
              <SectionPlaceholder section={section} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function DashboardOverview({
  fullName, greeting, stats, activeProjects, recent, tab, setTab,
}: {
  fullName: string;
  greeting: string;
  stats: { inProgress: number; completed: number; total: number };
  activeProjects: { id: string; title: string; package_name: string | null; stage: string }[];
  recent: { id: string; name: string; project_type: string; created_at: string }[];
  tab: "all" | "in_progress" | "completed";
  setTab: (t: "all" | "in_progress" | "completed") => void;
}) {
  const tasks = [
    { id: 1, label: "Design dashboard UI", tag: "UI/UX", date: "May 25", status: "in_progress" },
    { id: 2, label: "Implement authentication", tag: "Backend", date: "May 26", status: "in_progress" },
    { id: 3, label: "Setup payment integration", tag: "Integration", date: "May 28", status: "in_progress" },
    { id: 4, label: "Write API documentation", tag: "Documentation", date: "May 30", status: "completed" },
  ];
  const filteredTasks = tasks.filter(t => tab === "all" ? true : t.status === tab);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
      {/* LEFT */}
      <div className="flex flex-col gap-5 min-w-0">
        {/* Hero + stats */}
        <section className="relative overflow-hidden rounded-3xl bg-card ring-1 ring-ink/5 p-6 md:p-8">
          <div className="absolute -top-24 -right-24 size-72 rounded-full bg-brand/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 size-56 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
          <div className="relative">
            <h1 className="text-3xl md:text-4xl font-serif tracking-tight">
              {greeting}, <span className="capitalize">{fullName}</span>.
            </h1>
            <p className="text-ink/60 mt-2 text-sm">
              {stats.inProgress > 0
                ? `${stats.inProgress} active project${stats.inProgress > 1 ? "s are" : " is"} progressing smoothly.`
                : "Everything's calm. Time to ship something new."}
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
              <Stat label="Active Projects" value={stats.inProgress} delta="20%" up icon={FolderKanban} />
              <Stat label="Tasks Completed" value={32} delta="28%" up icon={CheckCircle2} />
              <Stat label="Total Users" value={"1,842"} delta="18%" up icon={Users} />
              <Stat label="Revenue" value={"₦2.4M"} delta="35%" up icon={DollarSign} />
            </div>
          </div>
        </section>

        {/* Active projects + analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <section className="rounded-2xl bg-card ring-1 ring-ink/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold">Active Projects</h2>
              <button className="text-xs text-ink/50 hover:text-brand">View all</button>
            </div>
            <ul className="space-y-4">
              {(activeProjects.length ? activeProjects : [
                { id: "1", title: "NACOS Platform", package_name: "Student Portal System", stage: "in_progress" },
                { id: "2", title: "Complaint Management System", package_name: "University System", stage: "in_progress" },
                { id: "3", title: "AI Study Assistant", package_name: "AI Learning Platform", stage: "in_progress" },
              ]).map((p, i) => {
                const pct = [78, 62, 94][i] ?? 50;
                const done = pct > 90;
                return (
                  <li key={p.id} className="flex items-center gap-3">
                    <div className={`size-10 rounded-xl ring-1 grid place-items-center ${done ? "bg-emerald-500/15 ring-emerald-500/20 text-emerald-400" : "bg-brand/15 ring-brand/20 text-brand"}`}>
                      <FolderKanban className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{p.title}</div>
                      <div className="text-xs text-ink/40 truncate">{p.package_name ?? p.stage.replace("_", " ")}</div>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 w-36">
                      <div className="flex-1 h-1.5 rounded-full bg-ink/10 overflow-hidden">
                        <div className={`h-full rounded-full ${done ? "bg-emerald-400" : "bg-brand"}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-medium text-ink/70 w-8 text-right">{pct}%</span>
                    </div>
                    <div className="flex -space-x-2">
                      {[0, 1].map((j) => (
                        <div key={j} className="size-6 rounded-full bg-brand/30 ring-2 ring-card grid place-items-center text-[10px] font-semibold text-brand">
                          {String.fromCharCode(65 + i + j)}
                        </div>
                      ))}
                      <div className="size-6 rounded-full bg-ink/10 ring-2 ring-card grid place-items-center text-[10px] font-semibold text-ink/60">+{i + 1}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="rounded-2xl bg-card ring-1 ring-ink/10 p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold">Analytics Overview</h2>
              <select className="text-xs bg-secondary ring-1 ring-ink/10 rounded-lg px-2 py-1 text-ink/70 focus:outline-none">
                <option>This Month</option>
                <option>Last Month</option>
              </select>
            </div>
            <div className="h-44 -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.72 0.15 55)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="oklch(0.72 0.15 55)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "oklch(0.4 0.013 50 / 60%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "oklch(0.4 0.013 50 / 60%)" }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip
                    contentStyle={{ background: "oklch(1 0 0)", border: "1px solid oklch(0.196 0.013 50 / 10%)", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: "oklch(0.4 0.013 50)" }}
                    itemStyle={{ color: "oklch(0.196 0.013 50)" }}
                    formatter={(v) => [`${v} Users`, ""]}
                  />
                  <Area type="monotone" dataKey="users" stroke="oklch(0.72 0.15 55)" strokeWidth={2} fill="url(#gA)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-ink/10">
              <MiniStat label="Users" value="1,642" delta="18%" up />
              <MiniStat label="Engagement" value="68%" delta="24%" up />
              <MiniStat label="Sessions" value="3,421" delta="12%" up />
              <MiniStat label="Bounce" value="32%" delta="5%" up={false} />
            </div>
          </section>
        </div>

        {/* Recent activity + tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <section className="rounded-2xl bg-card ring-1 ring-ink/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold">Recent Activity</h2>
              <button className="text-xs text-ink/50 hover:text-brand">View all</button>
            </div>
            <ul className="space-y-4">
              {(recent.length ? recent.map(r => ({
                icon: FileText,
                title: `${r.name} — ${r.project_type}`,
                sub: "New inquiry",
                time: new Date(r.created_at).toLocaleDateString(),
              })) : [
                { icon: FileText, title: "You uploaded project documentation", sub: "NACOS Platform", time: "2h ago" },
                { icon: UserCog, title: "Jane updated the project status", sub: "Complaint Management System", time: "5h ago" },
                { icon: CircleUserRound, title: "New user registered", sub: "AI Study Assistant", time: "1d ago" },
                { icon: ClipboardCheck, title: "You completed a task", sub: "Design System Implementation", time: "1d ago" },
              ]).map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="size-9 rounded-xl bg-brand/15 ring-1 ring-brand/20 grid place-items-center text-brand shrink-0">
                    <a.icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{a.title}</div>
                    <div className="text-xs text-ink/40 truncate">{a.sub}</div>
                  </div>
                  <span className="text-xs text-ink/40 shrink-0">{a.time}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl bg-card ring-1 ring-ink/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Tasks Overview</h2>
              <button className="text-xs flex items-center gap-1 text-brand hover:opacity-80">
                <Plus className="size-3" /> Add Task
              </button>
            </div>
            <div className="flex gap-2 mb-4">
              {(["all", "in_progress", "completed"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
                    tab === t ? "bg-brand text-brand-foreground" : "text-ink/60 hover:text-ink hover:bg-ink/5"
                  }`}
                >
                  {t.replace("_", " ")}
                </button>
              ))}
            </div>
            <ul className="space-y-2">
              {filteredTasks.map((t) => (
                <li key={t.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-ink/5">
                  <input type="checkbox" defaultChecked={t.status === "completed"} className="size-4 rounded accent-brand" />
                  <span className={`flex-1 text-sm ${t.status === "completed" ? "line-through text-ink/40" : ""}`}>{t.label}</span>
                  <span className="text-[10px] px-2 py-1 rounded-md bg-brand/15 text-brand font-medium">{t.tag}</span>
                  <span className="text-xs text-ink/50 w-14 text-right">{t.date}</span>
                  <div className="size-6 rounded-full bg-brand/30 grid place-items-center text-[10px] font-semibold text-brand">U</div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* RIGHT */}
      <aside className="flex flex-col gap-5">
        <section className="rounded-2xl bg-card ring-1 ring-ink/10 p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-sm">OKIKE AI Assistant</h3>
            <Sparkles className="size-4 text-brand" />
          </div>
          <p className="text-xs text-ink/60 mb-4">Hi {fullName}, how can I help you today?</p>
          <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2.5 ring-1 ring-ink/10 mb-4">
            <input placeholder="Ask me anything..." className="flex-1 bg-transparent text-sm placeholder:text-ink/40 focus:outline-none" />
            <button className="size-7 rounded-lg bg-brand grid place-items-center text-brand-foreground hover:opacity-90" aria-label="Send">
              <Send className="size-3.5" />
            </button>
          </div>
          <ul className="space-y-1.5">
            {[
              { icon: FileBarChart, label: "Summarize project progress" },
              { icon: FileText, label: "Generate a project report" },
              { icon: Users, label: "Analyze user engagement" },
              { icon: Workflow, label: "Suggest workflow automation" },
            ].map((s, i) => (
              <li key={i}>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-ink/5 text-left group">
                  <s.icon className="size-4 text-brand shrink-0" />
                  <span className="flex-1 text-xs text-ink/80">{s.label}</span>
                  <ChevronRight className="size-3 text-ink/40 group-hover:text-brand" />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl bg-card ring-1 ring-ink/10 p-5">
          <h3 className="font-semibold text-sm mb-4">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: FilePlus, label: "New Project" },
              { icon: Upload, label: "Upload File" },
              { icon: CheckSquare, label: "Create Task" },
              { icon: UserPlus, label: "Invite Team" },
              { icon: FileBarChart, label: "Generate Report" },
              { icon: Workflow, label: "AI Workflow" },
            ].map((a, i) => (
              <button
                key={i}
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-secondary ring-1 ring-ink/10 px-2 py-3 hover:ring-brand/30 transition"
              >
                <a.icon className="size-4 text-brand" />
                <span className="text-[10px] text-ink/70 text-center leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-card ring-1 ring-ink/10 p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">Your Productivity</h3>
            <select className="text-[10px] bg-secondary ring-1 ring-ink/10 rounded-md px-2 py-0.5 text-ink/70 focus:outline-none">
              <option>This Week</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative size-24 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="75%" outerRadius="100%" data={productivityData} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="value" cornerRadius={20} background={{ fill: "oklch(0.92 0.005 80)" }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 grid place-items-center text-lg font-semibold">76%</div>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-brand">Great job!</div>
              <div className="text-xs text-ink/60 leading-snug">You're more productive than 76% of users.</div>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1.5 mt-4 items-end h-16">
            {weekdays.map((w) => (
              <div key={w.d} className="flex flex-col items-center gap-1.5">
                <div className={`w-full rounded-md ${w.d === "Thu" ? "bg-brand" : "bg-ink/10"}`} style={{ height: `${w.v}%` }} />
                <span className={`text-[10px] ${w.d === "Thu" ? "text-brand font-medium" : "text-ink/40"}`}>{w.d}</span>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}

function SectionPlaceholder({ section }: { section: Section }) {
  return (
    <div className="rounded-2xl bg-card ring-1 ring-ink/10 p-16 text-center">
      <div className="text-xs uppercase tracking-widest text-brand mb-2">{section}</div>
      <div className="text-xl font-medium">Coming soon</div>
      <p className="text-sm text-ink/50 mt-2">This section is being built. Check back shortly.</p>
    </div>
  );
}

function Stat({ label, value, delta, up, icon: Icon }: { label: string; value: any; delta: string; up: boolean; icon: any }) {
  return (
    <div className="rounded-2xl bg-secondary/80 backdrop-blur ring-1 ring-ink/10 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-ink/60">{label}</span>
        <Icon className="size-4 text-ink/40" />
      </div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <div className={`text-[11px] mt-1 flex items-center gap-1 ${up ? "text-emerald-400" : "text-rose-400"}`}>
        {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
        {delta} <span className="text-ink/40">this month</span>
      </div>
    </div>
  );
}

function MiniStat({ label, value, delta, up }: { label: string; value: string; delta: string; up: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-ink/50">{label}</div>
      <div className="text-base font-semibold mt-0.5">{value}</div>
      <div className={`text-[10px] flex items-center gap-0.5 ${up ? "text-emerald-400" : "text-rose-400"}`}>
        {up ? <ArrowUpRight className="size-2.5" /> : <ArrowDownRight className="size-2.5" />}{delta}
      </div>
    </div>
  );
}
