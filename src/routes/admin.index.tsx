import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Users,
  Wallet,
  FolderKanban,
  Sparkles,
  Shield,
  UserPlus,
  ArrowUpRight,
  ChevronDown,
  UserCircle2,
  FolderPlus,
  DollarSign,
  AlertTriangle,
  FileBarChart,
  Activity,
  Database,
  HardDrive,
  Cpu,
  Server,
  Send,
  Building2,
  UserPlus2,
  Megaphone,
  Download,
  ServerCog,
  MoreVertical,
  Eye,
  Workflow,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

// ---------- mock data ----------
const platformData = Array.from({ length: 7 }).map((_, i) => ({
  day: `May ${14 + i}`,
  Users: 1800 + i * 250 + Math.round(Math.sin(i) * 200),
  Projects: 1200 + i * 180 + Math.round(Math.cos(i) * 150),
  Revenue: 900 + i * 120 + Math.round(Math.sin(i * 1.4) * 100),
  AIRequests: 600 + i * 90 + Math.round(Math.cos(i * 1.2) * 80),
}));

const revenueDaily = Array.from({ length: 30 }).map((_, i) => ({
  d: `May ${i + 1}`,
  v: 200 + Math.round(Math.sin(i / 2.6) * 180 + Math.random() * 300 + i * 8),
}));

const donutData = [
  { name: "Subscriptions", value: 60, color: "oklch(0.72 0.15 55)" },
  { name: "Projects", value: 25, color: "oklch(0.78 0.12 80)" },
  { name: "AI Services", value: 15, color: "oklch(0.62 0.2 290)" },
];

const countries = [
  { name: "Nigeria", pct: 65.2 },
  { name: "Ghana", pct: 12.4 },
  { name: "Kenya", pct: 8.7 },
  { name: "South Africa", pct: 5.1 },
  { name: "Others", pct: 8.6 },
];

const activity = [
  { icon: UserCircle2, title: "New user registered", sub: "Sarah Johnson joined the platform", time: "2m ago", color: "text-brand bg-brand/15" },
  { icon: FolderPlus, title: "New project created", sub: "AI Study Assistant project created", time: "7m ago", color: "text-sky-400 bg-sky-400/15" },
  { icon: DollarSign, title: "Payment received", sub: "₦50,000 from CampusFlow Ltd.", time: "15m ago", color: "text-emerald-400 bg-emerald-400/15" },
  { icon: AlertTriangle, title: "Complaint submitted", sub: "New complaint #7821 received", time: "22m ago", color: "text-amber-400 bg-amber-400/15" },
  { icon: Sparkles, title: "AI request processed", sub: "Document analysis completed", time: "35m ago", color: "text-violet-400 bg-violet-400/15" },
];

const systemHealth = [
  { icon: Server, label: "API Server" },
  { icon: Database, label: "Database" },
  { icon: HardDrive, label: "Storage" },
  { icon: Cpu, label: "AI Engine" },
  { icon: Activity, label: "Redis Cache" },
];

const recentUsers = [
  { name: "Sarah Johnson", email: "sarah.j@example.com", role: "User", status: "Active", joined: "May 20, 2025" },
  { name: "Michael Chen", email: "michael.c@example.com", role: "User", status: "Active", joined: "May 20, 2025" },
  { name: "Amina Yusuf", email: "amina.y@example.com", role: "Editor", status: "Active", joined: "May 19, 2025" },
  { name: "David Okafor", email: "david.o@example.com", role: "User", status: "Suspended", joined: "May 19, 2025" },
  { name: "Esther Williams", email: "esther.w@example.com", role: "Admin", status: "Active", joined: "May 18, 2025" },
];

const aiSuggestions = [
  { icon: FileBarChart, label: "Summarize platform activity" },
  { icon: Shield, label: "Detect unusual patterns" },
  { icon: TrendingUp, label: "Show low-performing projects" },
  { icon: FileBarChart, label: "Generate weekly report" },
  { icon: Activity, label: "Analyze user engagement" },
];

const quickActions = [
  { icon: Building2, label: "Create Organization" },
  { icon: UserPlus2, label: "Add New User" },
  { icon: Megaphone, label: "Broadcast Notice" },
  { icon: FileBarChart, label: "Generate Report" },
  { icon: Download, label: "Export Data" },
  { icon: ServerCog, label: "System Backup" },
];

function AdminOverview() {
  const [stats, setStats] = useState({ inquiries: 0, projects: 0 });

  useEffect(() => {
    async function load() {
      const [{ count: inq }, { count: proj }] = await Promise.all([
        supabase.from("project_inquiries").select("*", { count: "exact", head: true }),
        supabase.from("client_projects").select("*", { count: "exact", head: true }),
      ]);
      setStats({ inquiries: inq ?? 0, projects: proj ?? 0 });
    }
    load();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
      {/* MAIN */}
      <div className="flex flex-col gap-5 min-w-0">
        {/* Hero */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif tracking-tight">
              {greeting}, <span>Admin</span>.
            </h1>
            <p className="text-ink/60 mt-2 text-sm">
              Here's what's happening on <span className="text-brand font-semibold">OKIKE</span> today.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-[oklch(0.18_0.013_50)] ring-1 ring-ink/10 px-4 py-2.5 text-sm hover:ring-brand/30">
            May 14 – May 20, 2025
            <ChevronDown className="size-3.5 text-ink/50" />
          </button>
        </div>

        {/* 6 stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Stat icon={Users} label="Active Users" value="12,540" delta="18.2%" />
          <Stat icon={Wallet} label="Total Revenue" value="₦2.4M" delta="24.6%" />
          <Stat icon={FolderKanban} label="Projects Running" value={String(stats.projects || 87)} delta="11.3%" />
          <Stat icon={Sparkles} label="AI Requests" value="182K" delta="32.7%" />
          <Stat icon={Shield} label="System Uptime" value="99.9%" delta="0.1%" />
          <Stat icon={UserPlus} label="New Signups" value="1,429" delta="18.8%" />
        </div>

        {/* Analytics + Geo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <section className="lg:col-span-2 rounded-2xl bg-[oklch(0.16_0.012_50)] ring-1 ring-ink/10 p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Platform Analytics</h2>
              <select className="text-xs bg-[oklch(0.2_0.013_50)] ring-1 ring-ink/10 rounded-lg px-2 py-1 text-ink/70 focus:outline-none">
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="h-64 -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={platformData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "oklch(0.7 0.013 50 / 50%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "oklch(0.7 0.013 50 / 50%)" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip
                    contentStyle={{ background: "oklch(0.2 0.013 50)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: "oklch(0.7 0.013 50)" }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingBottom: 8 }} verticalAlign="top" align="left" />
                  <Line type="monotone" dataKey="Users" stroke="oklch(0.72 0.15 55)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Projects" stroke="oklch(0.72 0.18 145)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Revenue" stroke="oklch(0.78 0.12 80)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="AIRequests" stroke="oklch(0.65 0.2 280)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-2xl bg-[oklch(0.16_0.012_50)] ring-1 ring-ink/10 p-6">
            <h2 className="font-semibold mb-4">Geographic Distribution</h2>
            <div className="relative h-32 rounded-xl bg-[oklch(0.18_0.013_50)] ring-1 ring-ink/10 overflow-hidden mb-4">
              <WorldDots />
            </div>
            <ul className="space-y-2">
              {countries.map((c) => (
                <li key={c.name} className="flex items-center justify-between text-sm">
                  <span className="text-ink/80">{c.name}</span>
                  <span className="font-semibold text-brand">{c.pct}%</span>
                </li>
              ))}
            </ul>
            <button className="mt-4 text-xs text-brand flex items-center gap-1 hover:gap-2 transition-all">
              View full analytics <ArrowUpRight className="size-3" />
            </button>
          </section>
        </div>

        {/* Recent users + Live activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <section className="lg:col-span-2 rounded-2xl bg-[oklch(0.16_0.012_50)] ring-1 ring-ink/10 overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between">
              <h2 className="font-semibold">Recent Users</h2>
              <button className="text-xs text-brand hover:underline">View all</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-ink/40 border-y border-ink/10">
                    <th className="text-left font-medium px-6 py-2.5">User</th>
                    <th className="text-left font-medium px-2 py-2.5">Email</th>
                    <th className="text-left font-medium px-2 py-2.5">Role</th>
                    <th className="text-left font-medium px-2 py-2.5">Status</th>
                    <th className="text-left font-medium px-2 py-2.5">Joined</th>
                    <th className="text-left font-medium px-2 py-2.5">Activity</th>
                    <th className="px-4 py-2.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {recentUsers.map((u) => (
                    <tr key={u.email} className="hover:bg-ink/5">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-brand/25 ring-1 ring-brand/30 grid place-items-center text-xs font-semibold text-brand">
                            {u.name.charAt(0)}
                          </div>
                          <span className="font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-2 py-3 text-ink/60">{u.email}</td>
                      <td className="px-2 py-3 text-ink/70">{u.role}</td>
                      <td className="px-2 py-3">
                        <span
                          className={`text-[10px] font-semibold px-2 py-1 rounded-md ${
                            u.status === "Active"
                              ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20"
                              : "bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/20"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-ink/60">{u.joined}</td>
                      <td className="px-2 py-3"><Sparkline /></td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-ink/40 hover:text-ink"><MoreVertical className="size-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl bg-[oklch(0.16_0.012_50)] ring-1 ring-ink/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold">Live Activity</h2>
              <button className="text-xs text-brand hover:underline">View all</button>
            </div>
            <ul className="space-y-4">
              {activity.map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className={`size-9 rounded-xl grid place-items-center shrink-0 ring-1 ring-ink/10 ${a.color}`}>
                    <a.icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{a.title}</div>
                    <div className="text-xs text-ink/50 truncate">{a.sub}</div>
                  </div>
                  <span className="text-xs text-ink/40 shrink-0">{a.time}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Revenue Overview */}
        <section className="rounded-2xl bg-[oklch(0.16_0.012_50)] ring-1 ring-ink/10 p-6">
          <h2 className="font-semibold mb-4">Revenue Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-6 items-center">
            <div>
              <div className="text-3xl font-semibold tracking-tight">₦2,450,000</div>
              <div className="text-xs text-ink/50 mt-1">Total Revenue</div>
              <div className="text-xs text-emerald-400 flex items-center gap-1 mt-2">
                <ArrowUpRight className="size-3" /> 24.6% <span className="text-ink/40">vs last month</span>
              </div>
            </div>
            <div className="h-40 -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueDaily} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                  <XAxis dataKey="d" tick={{ fontSize: 9, fill: "oklch(0.7 0.013 50 / 50%)" }} axisLine={false} tickLine={false} interval={4} />
                  <YAxis tick={{ fontSize: 9, fill: "oklch(0.7 0.013 50 / 50%)" }} axisLine={false} tickLine={false} width={36} tickFormatter={(v) => `${v}K`} />
                  <Tooltip
                    contentStyle={{ background: "oklch(0.2 0.013 50)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 8, fontSize: 12 }}
                    cursor={{ fill: "oklch(1 0 0 / 5%)" }}
                  />
                  <Bar dataKey="v" fill="oklch(0.72 0.15 55)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative size-32 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donutData} dataKey="value" cx="50%" cy="50%" innerRadius={42} outerRadius={60} paddingAngle={2}>
                      {donutData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="space-y-2 text-sm">
                {donutData.map((d, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="size-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-ink/80 w-24">{d.name}</span>
                    <span className="text-ink/60 w-10">{d.value}%</span>
                    <span className="font-semibold tabular-nums">₦{[1470500, 612500, 367500][i].toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* RIGHT RAIL */}
      <aside className="flex flex-col gap-5">
        {/* AI panel */}
        <section className="rounded-2xl bg-[oklch(0.16_0.012_50)] ring-1 ring-ink/10 p-5">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm">OKIKE Admin AI</h3>
            <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand/20 text-brand">BETA</span>
          </div>
          <p className="text-xs text-ink/60 mb-4">Your AI command center for intelligent insights and automation.</p>
          <div className="flex items-center gap-2 bg-[oklch(0.2_0.013_50)] rounded-xl px-3 py-2.5 ring-1 ring-ink/10 mb-4">
            <input placeholder="Ask OKIKE AI anything..." className="flex-1 bg-transparent text-sm placeholder:text-ink/40 focus:outline-none" />
            <button className="size-7 rounded-lg bg-brand grid place-items-center text-brand-foreground hover:opacity-90" aria-label="Send">
              <Send className="size-3.5" />
            </button>
          </div>
          <div className="text-[10px] uppercase tracking-wider text-ink/40 mb-2">Suggested Actions</div>
          <ul className="space-y-1">
            {aiSuggestions.map((s, i) => (
              <li key={i}>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl ring-1 ring-ink/5 hover:ring-brand/20 hover:bg-ink/5 text-left">
                  <s.icon className="size-4 text-brand shrink-0" />
                  <span className="flex-1 text-xs text-ink/80">{s.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* System Health */}
        <section className="rounded-2xl bg-[oklch(0.16_0.012_50)] ring-1 ring-ink/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">System Health</h3>
            <button className="text-xs text-brand hover:underline">View all</button>
          </div>
          <ul className="space-y-3">
            {systemHealth.map((s) => (
              <li key={s.label} className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-brand/15 ring-1 ring-brand/20 grid place-items-center text-brand">
                  <s.icon className="size-4" />
                </div>
                <span className="flex-1 text-sm">{s.label}</span>
                <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                  Operational <span className="size-1.5 rounded-full bg-emerald-400" />
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Quick Actions */}
        <section className="rounded-2xl bg-[oklch(0.16_0.012_50)] ring-1 ring-ink/10 p-5">
          <h3 className="font-semibold text-sm mb-4">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-2">
            {quickActions.map((a, i) => (
              <button
                key={i}
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-[oklch(0.2_0.013_50)] ring-1 ring-ink/10 px-2 py-3.5 hover:ring-brand/30 transition"
              >
                <a.icon className="size-4 text-brand" />
                <span className="text-[10px] text-ink/70 text-center leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}

function Stat({ icon: Icon, label, value, delta }: { icon: any; label: string; value: string; delta: string }) {
  return (
    <div className="rounded-2xl bg-[oklch(0.16_0.012_50)] ring-1 ring-ink/10 p-4 hover:ring-brand/30 transition">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-ink/60">{label}</span>
        <Icon className="size-4 text-ink/40" />
      </div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <div className="text-[11px] mt-1 text-emerald-400 flex items-center gap-1">
        <ArrowUpRight className="size-3" /> {delta}
      </div>
      <div className="text-[10px] text-ink/40 mt-0.5">vs last 7 days</div>
    </div>
  );
}

function Sparkline() {
  const pts = [3, 5, 4, 7, 6, 9, 8].map((v, i, arr) => `${(i / (arr.length - 1)) * 60},${20 - (v / 10) * 18}`).join(" ");
  return (
    <svg width="64" height="20" viewBox="0 0 64 20" className="text-brand">
      <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points={pts} />
    </svg>
  );
}

function WorldDots() {
  // Decorative grid of glowing dots evoking a world map
  const dots = [
    [12, 35], [18, 30], [22, 40], [28, 32], [32, 45], [38, 38], [44, 50],
    [50, 35], [56, 42], [62, 30], [68, 48], [74, 35], [80, 40], [86, 32],
    [20, 60], [30, 65], [42, 70], [55, 62], [65, 68], [78, 60],
    [25, 25], [60, 22], [70, 28],
  ];
  return (
    <svg viewBox="0 0 100 80" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <defs>
        <radialGradient id="dot" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.78 0.15 55)" stopOpacity="1" />
          <stop offset="100%" stopColor="oklch(0.78 0.15 55)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* faint grid */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 7} x2="100" y2={i * 7} stroke="oklch(1 0 0 / 4%)" />
      ))}
      {Array.from({ length: 18 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 6} y1="0" x2={i * 6} y2="80" stroke="oklch(1 0 0 / 4%)" />
      ))}
      {dots.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="3" fill="url(#dot)" />
          <circle cx={x} cy={y} r="0.8" fill="oklch(0.85 0.18 60)" />
        </g>
      ))}
    </svg>
  );
}
