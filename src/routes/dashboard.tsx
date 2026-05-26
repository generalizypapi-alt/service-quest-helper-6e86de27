import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/dashboard-hero.jpg";
import {
  LayoutDashboard,
  FolderKanban,
  GraduationCap,
  Sparkles,
  MessageSquare,
  FileText,
  Building2,
  Calendar,
  Flag,
  Settings,
  Search,
  Bell,
  ChevronRight,
  Crown,
  LogOut,
  Shield,
  ArrowUpRight,
  ArrowRight,
  Send,
  Upload,
  FolderPlus,
  
  Users2,
  MessagesSquare,
  CalendarDays,
  BookOpen,
  ListTodo,
  Bot,
  CheckCircle2,
  Megaphone,
  Sparkle,
  MoreHorizontal,
  Smartphone,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — OKIKE" }] }),
  component: DashboardPage,
});

type Section =
  | "dashboard"
  | "projects"
  | "learning"
  | "ai"
  | "messages"
  | "files"
  | "organizations"
  | "calendar"
  | "milestones"
  | "settings";

const NAV: { key: Section; label: string; icon: any; badge?: number }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "learning", label: "Learning", icon: GraduationCap },
  { key: "ai", label: "AI Assistant", icon: Sparkles },
  { key: "messages", label: "Messages", icon: MessageSquare, badge: 3 },
  { key: "files", label: "Files", icon: FileText },
  { key: "organizations", label: "Organizations", icon: Building2 },
  { key: "calendar", label: "Calendar", icon: Calendar },
  { key: "milestones", label: "Milestones", icon: Flag },
  { key: "settings", label: "Settings", icon: Settings },
];

function DashboardPage() {
  const { session, loading, user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("dashboard");
  const [activeProjects, setActiveProjects] = useState<{ id: string; title: string; package_name: string | null; stage: string }[]>([]);
  const [allProjects, setAllProjects] = useState<{ id: string; stage: string }[]>([]);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/login" });
  }, [loading, session, navigate]);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const [{ data: ap }, { data: all }] = await Promise.all([
        supabase.from("client_projects").select("id, title, package_name, stage").in("stage", ["accepted", "in_progress"]).order("created_at", { ascending: false }).limit(2),
        supabase.from("client_projects").select("id, stage"),
      ]);
      setActiveProjects((ap ?? []) as never);
      setAllProjects((all ?? []) as never);
    })();
  }, [session]);

  const stats = useMemo(() => ({
    active: allProjects.filter(p => p.stage === "in_progress" || p.stage === "accepted").length || 2,
  }), [allProjects]);

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-secondary text-ink flex items-center justify-center text-ink/40">
        Loading…
      </div>
    );
  }

  const fullName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";
  const firstName = fullName.split(" ")[0];
  const initial = fullName.charAt(0).toUpperCase();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-background text-ink">
      <div className="flex">
        {/* Sidebar — always visible, collapses to icons on small screens */}
        <aside className="sticky top-0 h-screen w-14 sm:w-16 lg:w-64 shrink-0 flex flex-col border-r border-ink/10 bg-card px-2 lg:px-4 py-5 transition-[width]">
          <div className="px-1 lg:px-2">
            <Link to="/" className="block text-xl lg:text-2xl font-semibold tracking-tight text-brand text-center lg:text-left">
              <span className="lg:hidden">O</span>
              <span className="hidden lg:inline">OKIKE</span>
            </Link>
            <div className="hidden lg:block text-[11px] text-ink/50 mt-0.5">Your Digital Ecosystem</div>
          </div>

          <nav className="mt-7 flex-1 flex flex-col gap-1 overflow-y-auto">
            {NAV.map((t) => {
              const active = section === t.key;
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => setSection(t.key)}
                  title={t.label}
                  className={`w-full flex items-center gap-3 rounded-xl px-2 lg:px-3 py-2.5 text-sm font-medium transition text-left justify-center lg:justify-start ${
                    active
                      ? "bg-brand/15 text-brand ring-1 ring-brand/25"
                      : "text-ink/70 hover:text-ink hover:bg-ink/5"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="hidden lg:inline flex-1">{t.label}</span>
                  {t.badge ? (
                    <span className="hidden lg:inline text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-brand text-brand-foreground min-w-[18px] text-center">
                      {t.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}

            {role === "admin" && (
              <Link
                to="/admin"
                title="Admin panel"
                className="mt-3 flex items-center gap-3 rounded-xl px-2 lg:px-3 py-2.5 text-sm font-medium text-ink/70 hover:text-brand hover:bg-ink/5 ring-1 ring-ink/10 justify-center lg:justify-start"
              >
                <Shield className="size-4 shrink-0" />
                <span className="hidden lg:inline">Admin panel</span>
              </Link>
            )}
          </nav>

          {/* Upgrade card */}
          <div className="mt-4 rounded-2xl p-2 lg:p-3 bg-gradient-to-br from-brand/25 to-brand/5 ring-1 ring-brand/25 flex items-center gap-3 cursor-pointer hover:from-brand/35 transition justify-center lg:justify-start">
            <div className="size-9 rounded-xl bg-brand/25 ring-1 ring-brand/40 grid place-items-center text-brand shrink-0">
              <Crown className="size-4" />
            </div>
            <div className="hidden lg:block flex-1 min-w-0">
              <div className="text-sm font-medium">Upgrade Plan</div>
              <div className="text-[11px] text-ink/60">Unlock premium features</div>
            </div>
          </div>

          {/* User profile */}
          <div className="mt-3 flex items-center gap-3 px-1 lg:px-2 py-2 rounded-xl justify-center lg:justify-start">
            <div className="relative shrink-0">
              <div className="size-9 lg:size-10 rounded-full bg-brand/20 ring-2 ring-brand/30 grid place-items-center text-sm font-semibold text-brand">
                {initial}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-400 ring-2 ring-card" />
            </div>
            <div className="hidden lg:block flex-1 min-w-0">
              <div className="text-sm font-medium truncate capitalize flex items-center gap-1">
                {fullName} <ChevronRight className="size-3 text-ink/40" />
              </div>
              <div className="text-[11px] text-ink/50 capitalize flex items-center gap-1.5">
                <span>{role || "Client"}</span>
                <span className="size-1 rounded-full bg-emerald-400" />
                <span>Online</span>
              </div>
            </div>
            <button
              onClick={async () => { await signOut(); navigate({ to: "/" }); }}
              className="hidden lg:inline-flex text-ink/40 hover:text-brand p-1 rounded"
              aria-label="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-8 py-4 bg-background/80 backdrop-blur border-b border-ink/10">
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center gap-2 rounded-xl bg-card ring-1 ring-ink/10 px-3 py-2.5 focus-within:ring-brand/40 transition">
                <Search className="size-4 text-ink/40" />
                <input
                  placeholder="Search projects, courses, files, people..."
                  className="flex-1 bg-transparent text-sm placeholder:text-ink/40 focus:outline-none"
                />
                <kbd className="hidden md:inline-flex text-[10px] text-ink/40 ring-1 ring-ink/10 rounded px-1.5 py-0.5">⌘K</kbd>
              </div>
            </div>
            <button className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-brand/15 text-brand ring-1 ring-brand/25 px-3.5 py-2.5 text-sm font-medium hover:bg-brand/20">
              <Sparkle className="size-4" /> Ask OKIKE AI
            </button>
            <button className="relative rounded-xl p-2.5 ring-1 ring-ink/10 hover:bg-ink/5" aria-label="Messages">
              <MessageSquare className="size-4 text-ink/70" />
              <span className="absolute -top-1 -right-1 size-4 rounded-full bg-brand text-[10px] font-semibold text-brand-foreground grid place-items-center">3</span>
            </button>
            <button className="relative rounded-xl p-2.5 ring-1 ring-ink/10 hover:bg-ink/5" aria-label="Notifications">
              <Bell className="size-4 text-ink/70" />
              <span className="absolute -top-1 -right-1 size-4 rounded-full bg-brand text-[10px] font-semibold text-brand-foreground grid place-items-center">7</span>
            </button>
            <div className="flex items-center gap-1.5">
              <div className="size-9 rounded-full bg-brand/20 ring-2 ring-brand/30 grid place-items-center text-sm font-semibold text-brand">
                {initial}
              </div>
              <ChevronRight className="size-3 text-ink/40 rotate-90" />
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
            {section === "dashboard" ? (
              <DashboardOverview
                firstName={firstName}
                greeting={greeting}
                activeCount={stats.active}
                activeProjects={activeProjects}
              />
            ) : (
              <SectionPlaceholder section={section} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function DashboardOverview({
  firstName, greeting, activeCount, activeProjects,
}: {
  firstName: string;
  greeting: string;
  activeCount: number;
  activeProjects: { id: string; title: string; package_name: string | null; stage: string }[];
}) {
  const defaultProjects = [
    { id: "1", title: "NACOS Website Redesign", package_name: "Website Development", stage: "in_progress" },
    { id: "2", title: "EduStream Mobile App", package_name: "Mobile App Development", stage: "in_progress" },
  ];
  const projects = activeProjects.length ? activeProjects.slice(0, 2) : defaultProjects;
  const meta = [
    { pct: 78, due: "Due in 12 days", icon: FolderKanban },
    { pct: 45, due: "Due in 28 days", icon: Smartphone },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
      {/* LEFT */}
      <div className="flex flex-col gap-5 min-w-0">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl ring-1 ring-ink/10 bg-card">
          <img
            src={heroImg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/85 to-transparent" />
          <div className="relative p-6 md:p-10 min-h-[260px] flex flex-col justify-center max-w-xl">
            <h1 className="text-3xl md:text-4xl font-serif tracking-tight">
              {greeting}, <span className="capitalize">{firstName}</span> <span className="inline-block">👋</span>
            </h1>
            <p className="text-ink/70 mt-2 text-sm md:text-base">Let's continue building something amazing today.</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <button className="inline-flex items-center gap-2 rounded-xl bg-brand text-brand-foreground px-4 py-2.5 text-sm font-medium hover:opacity-90">
                Continue Project <ArrowRight className="size-4" />
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl bg-card/70 backdrop-blur ring-1 ring-ink/15 px-4 py-2.5 text-sm font-medium hover:bg-card">
                Open AI Assistant
              </button>
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard icon={FolderKanban} label="Active Projects" value={String(activeCount)} delta="20% this month" up />
          <StatCard icon={BookOpen} label="Courses Progress" value="74%" delta="18% this month" up progress={74} />
          <StatCard icon={ListTodo} label="Tasks Due" value="4" delta="3 overdue" warn />
          <StatCard icon={Sparkles} label="AI Requests" value="18" delta="12% this month" up />
          <StatCard icon={FileText} label="Files Uploaded" value="32" delta="8% this month" up />
        </div>

        {/* PROJECTS + LEARNING */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
          <section className="rounded-2xl bg-card ring-1 ring-ink/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold">My Projects</h2>
              <button className="text-xs text-ink/50 hover:text-brand">View all</button>
            </div>
            <ul className="space-y-4">
              {projects.map((p, i) => {
                const m = meta[i] ?? meta[0];
                const Icon = m.icon;
                return (
                  <li key={p.id} className="rounded-xl ring-1 ring-ink/10 p-4 hover:ring-brand/30 transition">
                    <div className="flex items-start gap-3">
                      <div className="size-10 rounded-xl bg-brand/15 ring-1 ring-brand/25 grid place-items-center text-brand shrink-0">
                        <Icon className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-medium text-sm truncate">{p.title}</div>
                            <div className="text-xs text-ink/50 truncate">{p.package_name ?? "Project"}</div>
                          </div>
                          <div className="text-[11px] text-ink/50 whitespace-nowrap">{m.due}</div>
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex-1 h-1.5 rounded-full bg-ink/10 overflow-hidden">
                            <div className="h-full rounded-full bg-brand" style={{ width: `${m.pct}%` }} />
                          </div>
                          <span className="text-xs font-medium text-ink/70 w-9 text-right">{m.pct}%</span>
                          <div className="flex -space-x-1.5">
                            {[0, 1, 2].map((j) => (
                              <div key={j} className="size-6 rounded-full bg-brand/30 ring-2 ring-card grid place-items-center text-[10px] font-semibold text-brand">
                                {String.fromCharCode(65 + i + j)}
                              </div>
                            ))}
                            <div className="size-6 rounded-full bg-ink/10 ring-2 ring-card grid place-items-center text-[9px] font-semibold text-ink/60">+{i + 2}</div>
                          </div>
                          <span className="text-[10px] px-2 py-1 rounded-md bg-brand/15 text-brand font-medium whitespace-nowrap">In Progress</span>
                          <button className="text-ink/40 hover:text-ink"><MoreHorizontal className="size-4" /></button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="rounded-2xl bg-card ring-1 ring-ink/10 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold">Continue Learning</h2>
              <button className="text-xs text-ink/50 hover:text-brand">View all</button>
            </div>
            <div className="relative rounded-xl overflow-hidden mb-4 aspect-[16/8] ring-1 ring-ink/10">
              <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute top-3 right-3 text-[10px] px-2 py-1 rounded-md bg-brand/90 text-brand-foreground font-medium">Web Development</span>
            </div>
            <div className="text-sm font-medium">Full Stack Development</div>
            <div className="text-xs text-ink/50 mt-0.5">Next: APIs & Databases</div>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex-1 h-1.5 rounded-full bg-ink/10 overflow-hidden">
                <div className="h-full rounded-full bg-brand" style={{ width: "75%" }} />
              </div>
              <span className="text-xs font-medium text-ink/70">75%</span>
            </div>
            <button className="mt-auto pt-4 text-sm font-medium text-brand flex items-center justify-between hover:opacity-80">
              Go to course <ArrowRight className="size-4" />
            </button>
          </section>
        </div>

        {/* ACTIVITY + ORGS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <section className="rounded-2xl bg-card ring-1 ring-ink/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold">Recent Activity</h2>
              <button className="text-xs text-ink/50 hover:text-brand">View all</button>
            </div>
            <ul className="space-y-4">
              {[
                { icon: Upload, title: "You uploaded project wireframes", sub: "NACOS Website Redesign", time: "2h ago" },
                { icon: CheckCircle2, title: "Milestone completed", sub: "Database integration", time: "5h ago" },
                { icon: Sparkles, title: "AI Assistant generated report", sub: "Project performance analysis", time: "1d ago" },
                { icon: MessageSquare, title: "New message from Esther Williams", sub: "Regarding project requirements", time: "1d ago" },
              ].map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="size-9 rounded-xl bg-brand/15 ring-1 ring-brand/20 grid place-items-center text-brand shrink-0">
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

          <section className="rounded-2xl bg-card ring-1 ring-ink/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold">My Organizations</h2>
              <button className="text-xs text-ink/50 hover:text-brand">View all</button>
            </div>
            <ul className="space-y-3">
              {[
                { name: "NACOS AKSU", role: "Student Organization", members: 42, projects: 3, anns: 5, icon: GraduationCap },
                { name: "OKIKE Partners", role: "Business Partner", members: 12, projects: 2, anns: 8, icon: Building2 },
              ].map((o, i) => (
                <li key={i} className="rounded-xl ring-1 ring-ink/10 p-4 hover:ring-brand/30 transition cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-xl bg-brand/15 ring-1 ring-brand/25 grid place-items-center text-brand shrink-0">
                      <o.icon className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{o.name}</div>
                      <div className="text-xs text-ink/50 truncate">{o.role}</div>
                    </div>
                    <ChevronRight className="size-4 text-ink/40" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-ink/10">
                    {[
                      { k: "Members", v: o.members },
                      { k: "Projects", v: o.projects },
                      { k: "Announcements", v: o.anns },
                    ].map((s) => (
                      <div key={s.k} className="text-center">
                        <div className="text-base font-semibold">{s.v}</div>
                        <div className="text-[10px] text-ink/50">{s.k}</div>
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* RIGHT */}
      <aside className="flex flex-col gap-5">
        {/* AI Assistant */}
        <section className="rounded-2xl bg-card ring-1 ring-ink/10 p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-sm">OKIKE AI Assistant</h3>
            <Sparkle className="size-4 text-brand" />
          </div>
          <p className="text-[11px] text-ink/60 mb-4">Your intelligent companion.</p>

          <div className="rounded-xl bg-secondary/60 ring-1 ring-ink/10 p-3 mb-3">
            <div className="text-xs font-medium flex items-center gap-1">
              Hello {firstName}! <span>👋</span>
            </div>
            <div className="text-[11px] text-ink/60 mt-0.5">How can I help you today?</div>
          </div>

          <ul className="space-y-1.5 mb-3">
            {[
              { icon: FolderKanban, label: "Summarize my project updates" },
              { icon: Flag, label: "Generate project roadmap" },
              { icon: BookOpen, label: "Explain this course topic" },
              { icon: Sparkles, label: "Analyze my productivity" },
            ].map((s, i) => (
              <li key={i}>
                <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl ring-1 ring-ink/10 hover:ring-brand/30 hover:bg-brand/5 text-left group">
                  <s.icon className="size-3.5 text-brand shrink-0" />
                  <span className="flex-1 text-[11px] text-ink/80">{s.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2 ring-1 ring-ink/10">
            <input placeholder="Ask anything..." className="flex-1 bg-transparent text-xs placeholder:text-ink/40 focus:outline-none" />
            <button className="size-7 rounded-lg bg-brand grid place-items-center text-brand-foreground hover:opacity-90" aria-label="Send">
              <Send className="size-3.5" />
            </button>
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-2xl bg-card ring-1 ring-ink/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Notifications</h3>
            <button className="text-[11px] text-ink/50 hover:text-brand">View all</button>
          </div>
          <ul className="space-y-3">
            {[
              { icon: CheckCircle2, title: "Project milestone completed", sub: "NACOS Website Redesign", time: "2m ago" },
              { icon: Megaphone, title: "New announcement", sub: "From NACOS AKSU", time: "1h ago" },
              { icon: Sparkles, title: "AI report is ready", sub: "Your weekly summary is ready", time: "3h ago" },
              { icon: ListTodo, title: "Assignment due tomorrow", sub: "Advanced JavaScript Concepts", time: "5h ago" },
            ].map((n, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="size-8 rounded-lg bg-brand/15 ring-1 ring-brand/20 grid place-items-center text-brand shrink-0">
                  <n.icon className="size-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{n.title}</div>
                  <div className="text-[11px] text-ink/50 truncate">{n.sub}</div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[10px] text-ink/40">{n.time}</span>
                  <span className="size-1.5 rounded-full bg-brand" />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Quick actions */}
        <section className="rounded-2xl bg-card ring-1 ring-ink/10 p-5">
          <h3 className="font-semibold text-sm mb-4">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Upload, label: "Upload File" },
              { icon: FolderPlus, label: "Create Project" },
              { icon: Bot, label: "Ask AI" },
              { icon: MessagesSquare, label: "Message Team" },
              { icon: Users2, label: "Join Organization" },
              { icon: CalendarDays, label: "View Calendar" },
            ].map((a, i) => (
              <button
                key={i}
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-secondary ring-1 ring-ink/10 px-2 py-3 hover:ring-brand/30 hover:bg-brand/5 transition"
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

function StatCard({
  icon: Icon, label, value, delta, up, warn, progress,
}: {
  icon: any; label: string; value: string; delta: string;
  up?: boolean; warn?: boolean; progress?: number;
}) {
  return (
    <div className="rounded-2xl bg-card ring-1 ring-ink/10 p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="size-7 rounded-lg bg-brand/15 ring-1 ring-brand/20 grid place-items-center text-brand">
          <Icon className="size-3.5" />
        </div>
        <span className="text-[11px] text-ink/60">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        {progress !== undefined && (
          <div className="relative size-10 shrink-0">
            <svg viewBox="0 0 36 36" className="size-full -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" className="text-ink/10" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15" fill="none"
                stroke="currentColor"
                className="text-brand"
                strokeWidth="3"
                strokeDasharray={`${(progress / 100) * 94.2} 94.2`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </div>
      <div className={`text-[11px] mt-1 flex items-center gap-1 ${warn ? "text-rose-500" : up ? "text-emerald-500" : "text-ink/50"}`}>
        {up && <ArrowUpRight className="size-3" />}
        {delta}
      </div>
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

