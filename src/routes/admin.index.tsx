import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Users,
  Building2,
  FolderKanban,
  Wallet,
  Sparkles,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
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
  UserPlus2,
  Megaphone,
  Download,
  ServerCog,
  TrendingUp,
  ClipboardList,
  FileWarning,
  AlertOctagon,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

// ---------- mock data ----------
const platformData = [
  { day: "May 24", v: 6800 },
  { day: "May 25", v: 7600 },
  { day: "May 26", v: 8200 },
  { day: "May 27", v: 9400 },
  { day: "May 28", v: 10200 },
  { day: "May 29", v: 12540 },
  { day: "May 30", v: 12200 },
];

const roleData = [
  { name: "Students", value: 7582, pct: "60.4%", color: "oklch(0.72 0.15 55)" },
  { name: "Clients", value: 2845, pct: "22.7%", color: "oklch(0.62 0.2 290)" },
  { name: "Organization Admins", value: 1256, pct: "10.0%", color: "oklch(0.78 0.12 80)" },
  { name: "Staff", value: 857, pct: "6.9%", color: "oklch(0.72 0.18 145)" },
];

const recentSignups = [
  { name: "David Okafor", role: "Student", time: "2m ago" },
  { name: "Esther Williams", role: "Client", time: "5m ago" },
  { name: "NACOS AKSU", role: "Organization", time: "15m ago" },
  { name: "Michael Chen", role: "Client", time: "25m ago" },
];

const recentProjects = [
  { name: "NACOS Website Redesign", org: "NACOS AKSU", owner: "David Okafor", status: "In Progress", progress: 78, deadline: "Jun 12, 2025" },
  { name: "EduStream Mobile App", org: "OKIKE Labs", owner: "Esther Williams", status: "In Progress", progress: 45, deadline: "Jun 28, 2025" },
  { name: "AI Learning Platform", org: "OKIKE", owner: "Pascal General", status: "Review", progress: 60, deadline: "Jun 15, 2025" },
  { name: "Business Dashboard", org: "OKIKE Partners", owner: "Michael Chen", status: "Completed", progress: 100, deadline: "May 20, 2025" },
  { name: "ACM Platform", org: "ACM AKSU", owner: "John Doe", status: "On Hold", progress: 20, deadline: "Jul 10, 2025" },
];

const activity = [
  { icon: UserCircle2, title: "New user registered", sub: "David Okafor joined as a student", time: "2m ago", color: "text-brand bg-brand/15" },
  { icon: FolderPlus, title: "New project created", sub: "EduStream Mobile App was created", time: "7m ago", color: "text-sky-400 bg-sky-400/15" },
  { icon: DollarSign, title: "Payment received", sub: "₦50,000 from OKIKE Partners", time: "15m ago", color: "text-emerald-400 bg-emerald-400/15" },
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

const aiSuggestions = [
  { icon: Sparkles, label: "Summarize platform activity" },
  { icon: Shield, label: "Detect unusual patterns" },
  { icon: TrendingUp, label: "Show low-performing projects" },
  { icon: FileBarChart, label: "Generate weekly report" },
  { icon: Activity, label: "Analyze user engagement" },
];

const quickActions = [
  { icon: UserPlus2, label: "Add User" },
  { icon: Building2, label: "Create Organization" },
  { icon: Megaphone, label: "Broadcast Announcement" },
  { icon: FileBarChart, label: "Generate Report" },
  { icon: Download, label: "Export Data" },
  { icon: ServerCog, label: "System Backup" },
];

const statusStyles: Record<string, string> = {
  "In Progress": "bg-sky-500/15 text-sky-400 ring-sky-500/20",
  Review: "bg-amber-500/15 text-amber-400 ring-amber-500/20",
  Completed: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/20",
  "On Hold": "bg-rose-500/15 text-rose-400 ring-rose-500/20",
};

function AdminOverview() {
  const [stats, setStats] = useState({ projects: 0 });

  useEffect(() => {
    async function load() {
      const { count } = await supabase
        .from("client_projects")
        .select("*", { count: "exact", head: true });
      setStats({ projects: count ?? 0 });
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
              {greeting}, Admin <span className="inline-block">👋</span>
            </h1>
            <p className="text-ink/60 mt-2 text-sm">
              Here's what's happening on <span className="text-brand font-semibold">OKIKE</span> today.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-[oklch(0.18_0.013_50)] ring-1 ring-ink/10 px-4 py-2.5 text-sm hover:ring-brand/30">
            May 24 – May 30, 2025
            <ChevronDown className="size-3.5 text-ink/50" />
          </button>
        </div>

        {/* 6 stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Stat icon={Users} label="Total Users" value="12,540" delta="18.2%" up />
          <Stat icon={Building2} label="Active Organizations" value="248" delta="14.6%" up />
          <Stat icon={FolderKanban} label="Projects Running" value={String(stats.projects || 87)} delta="11.3%" up />
          <Stat icon={Wallet} label="Total Revenue" value="₦2.4M" delta="24.6%" up />
          <Stat icon={Sparkles} label="AI Requests" value="182K" delta="32.7%" up />
          <Stat icon={Shield} label="System Uptime" value="99.9%" delta="0.1%" up />
        </div>

        {/* Platform Analytics + Users by Role */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5">
          <section className="rounded-2xl bg-[oklch(0.16_0.012_50)] ring-1 ring-ink/10 p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Platform Analytics</h2>
              <select className="text-xs bg-[oklch(0.2_0.013_50)] ring-1 ring-ink/10 rounded-lg px-2 py-1 text-ink/70 focus:outline-none">
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="flex gap-1.5 mb-4 flex-wrap">
              {["Users", "Projects", "Revenue", "AI Requests"].map((t, i) => (
                <button
                  key={t}
                  className={`text-xs px-3 py-1.5 rounded-lg transition ${
                    i === 0
                      ? "bg-brand/15 text-brand ring-1 ring-brand/30"
                      : "text-ink/60 hover:bg-ink/5 ring-1 ring-transparent"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="h-56 -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={platformData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "oklch(0.7 0.013 50 / 50%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "oklch(0.7 0.013 50 / 50%)" }} axisLine={false} tickLine={false} width={36} tickFormatter={(v) => `${Math.round(v / 1000)}K`} />
                  <Tooltip
                    contentStyle={{ background: "oklch(0.2 0.013 50)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: "oklch(0.7 0.013 50)" }}
                  />
                  <Line type="monotone" dataKey="v" name="Users" stroke="oklch(0.72 0.15 55)" strokeWidth={2.5} dot={{ r: 3, fill: "oklch(0.72 0.15 55)" }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5 pt-5 border-t border-ink/10">
              <MiniStat label="New Users" value="2,340" delta="18.2%" up />
              <MiniStat label="Active Users" value="8,942" delta="16.7%" up />
              <MiniStat label="Returning Users" value="3,598" delta="11.3%" up />
              <MiniStat label="Inactive Users" value="1,256" delta="4.3%" up={false} />
              <MiniStat label="Engagement Rate" value="68%" delta="12.4%" up />
            </div>
          </section>

          <section className="rounded-2xl bg-[oklch(0.16_0.012_50)] ring-1 ring-ink/10 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Users by Role</h2>
              <button className="text-xs text-brand hover:underline">View all</button>
            </div>
            <div className="flex items-center gap-4">
              <div className="size-32 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={roleData} dataKey="value" cx="50%" cy="50%" innerRadius={36} outerRadius={58} paddingAngle={2}>
                      {roleData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="flex-1 space-y-2 text-xs">
                {roleData.map((d) => (
                  <li key={d.name} className="flex items-center gap-2">
                    <span className="size-2 rounded-full shrink-0" style={{ background: d.color }} />
                    <span className="text-ink/80 flex-1 truncate">{d.name}</span>
                    <span className="font-semibold tabular-nums">{d.value.toLocaleString()}</span>
                    <span className="text-ink/50 w-12 text-right">{d.pct}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 pt-5 border-t border-ink/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Recent Signups</h3>
                <button className="text-xs text-brand hover:underline">View all</button>
              </div>
              <ul className="space-y-2.5">
                {recentSignups.map((u) => (
                  <li key={u.name} className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-brand/20 ring-1 ring-brand/30 grid place-items-center text-xs font-semibold text-brand shrink-0">
                      {u.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{u.name}</div>
                    </div>
                    <span className="text-xs text-ink/60">{u.role}</span>
                    <span className="text-xs text-ink/40 shrink-0">{u.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Recent Projects + Platform Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5">
          <section className="rounded-2xl bg-[oklch(0.16_0.012_50)] ring-1 ring-ink/10 overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between">
              <h2 className="font-semibold">Recent Projects</h2>
              <button className="text-xs text-brand hover:underline">View all</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-ink/40 border-y border-ink/10">
                    <th className="text-left font-medium px-6 py-2.5">Project</th>
                    <th className="text-left font-medium px-2 py-2.5">Organization</th>
                    <th className="text-left font-medium px-2 py-2.5">Owner</th>
                    <th className="text-left font-medium px-2 py-2.5">Status</th>
                    <th className="text-left font-medium px-2 py-2.5">Progress</th>
                    <th className="text-left font-medium px-6 py-2.5">Deadline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {recentProjects.map((p) => (
                    <tr key={p.name} className="hover:bg-ink/5">
                      <td className="px-6 py-3 font-medium">{p.name}</td>
                      <td className="px-2 py-3 text-ink/70">{p.org}</td>
                      <td className="px-2 py-3 text-ink/70">{p.owner}</td>
                      <td className="px-2 py-3">
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded-md ring-1 ${statusStyles[p.status]}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 rounded-full bg-ink/10 overflow-hidden">
                            <div className="h-full bg-brand rounded-full" style={{ width: `${p.progress}%` }} />
                          </div>
                          <span className="text-xs text-ink/70 tabular-nums">{p.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-ink/60">{p.deadline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl bg-[oklch(0.16_0.012_50)] ring-1 ring-ink/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold">Platform Activity</h2>
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

        {/* Bottom summary tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryTile icon={ClipboardList} value="8" label="Open Complaints" sub="Requires attention" color="text-rose-400 bg-rose-500/15" />
          <SummaryTile icon={FileWarning} value="12" label="Pending Approvals" sub="Awaiting review" color="text-amber-400 bg-amber-500/15" />
          <SummaryTile icon={AlertOctagon} value="5" label="System Alerts" sub="Needs attention" color="text-orange-400 bg-orange-500/15" />
          <SummaryTile icon={FileBarChart} value="24" label="Unresolved Reports" sub="Moderation queue" color="text-violet-400 bg-violet-500/15" />
        </div>
      </div>

      {/* RIGHT RAIL */}
      <aside className="flex flex-col gap-5">
        {/* AI panel */}
        <section className="rounded-2xl bg-[oklch(0.16_0.012_50)] ring-1 ring-ink/10 p-5">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm">OKIKE Admin AI</h3>
            <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand/20 text-brand">BETA</span>
          </div>
          <p className="text-xs text-ink/60 mb-4">Your AI command center for insights and platform management.</p>
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
          <button className="mt-3 text-xs text-brand flex items-center gap-1 hover:gap-2 transition-all">
            Go to AI Command Center <ArrowUpRight className="size-3" />
          </button>
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
      </aside>
    </div>
  );
}

function Stat({ icon: Icon, label, value, delta, up }: { icon: any; label: string; value: string; delta: string; up: boolean }) {
  return (
    <div className="rounded-2xl bg-[oklch(0.16_0.012_50)] ring-1 ring-ink/10 p-4 hover:ring-brand/30 transition">
      <div className="flex items-center gap-2 mb-2">
        <div className="size-7 rounded-lg bg-brand/15 ring-1 ring-brand/20 grid place-items-center text-brand">
          <Icon className="size-3.5" />
        </div>
        <span className="text-[11px] text-ink/60">{label}</span>
      </div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <div className={`text-[11px] mt-1 flex items-center gap-1 ${up ? "text-emerald-400" : "text-rose-400"}`}>
        {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />} {delta}
      </div>
      <div className="text-[10px] text-ink/40 mt-0.5">vs last 7 days</div>
    </div>
  );
}

function MiniStat({ label, value, delta, up }: { label: string; value: string; delta: string; up: boolean }) {
  return (
    <div>
      <div className="text-[11px] text-ink/50 mb-1">{label}</div>
      <div className="text-xl font-semibold tracking-tight">{value}</div>
      <div className={`text-[11px] mt-1 flex items-center gap-1 ${up ? "text-emerald-400" : "text-rose-400"}`}>
        {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />} {delta}
      </div>
    </div>
  );
}

function SummaryTile({ icon: Icon, value, label, sub, color }: { icon: any; value: string; label: string; sub: string; color: string }) {
  return (
    <div className="rounded-2xl bg-[oklch(0.16_0.012_50)] ring-1 ring-ink/10 p-4 flex items-center gap-3">
      <div className={`size-11 rounded-xl grid place-items-center shrink-0 ring-1 ring-ink/10 ${color}`}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <div className="text-xl font-semibold tracking-tight">{value}</div>
        <div className="text-xs font-medium truncate">{label}</div>
        <div className="text-[10px] text-ink/40 truncate">{sub}</div>
      </div>
    </div>
  );
}
