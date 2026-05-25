import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  CheckCircle2,
  Circle,
  Clock,
  XCircle,
  Sparkles,
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Settings,
  Bell,
  Search,
  LogOut,
  Plus,
  TrendingUp,
  Shield,
  Menu,
  X,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — OKIKE" }] }),
  component: DashboardPage,
});

type Project = {
  id: string;
  title: string;
  package_name: string | null;
  total: number | null;
  deposit: number | null;
  currency: string;
  stage: "submitted" | "reviewing" | "accepted" | "declined" | "in_progress" | "completed";
  admin_notes: string | null;
  created_at: string;
};

type Milestone = {
  id: string;
  project_id: string;
  name: string;
  status: "pending" | "active" | "done";
  note: string | null;
  position: number;
};

type Update = {
  id: string;
  project_id: string;
  message: string;
  created_at: string;
};

type Inquiry = { id: string; project_type: string; status: string; created_at: string };

const STAGE_LABEL: Record<Project["stage"], string> = {
  submitted: "Submitted",
  reviewing: "Reviewing",
  accepted: "Accepted",
  declined: "Declined",
  in_progress: "In progress",
  completed: "Completed",
};

const STAGE_COLOR: Record<Project["stage"], string> = {
  submitted: "bg-ink/10 text-ink",
  reviewing: "bg-amber-100 text-amber-800",
  accepted: "bg-emerald-100 text-emerald-800",
  declined: "bg-red-100 text-red-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-emerald-600 text-white",
};

type Section = "overview" | "projects" | "inquiries" | "settings";

function DashboardPage() {
  const { session, loading, user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [busy, setBusy] = useState(true);
  const [section, setSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/login" });
  }, [loading, session, navigate]);

  useEffect(() => {
    if (!session) return;

    async function load() {
      const [{ data: p }, { data: i }] = await Promise.all([
        supabase.from("client_projects").select("*").order("created_at", { ascending: false }),
        supabase.from("project_inquiries").select("id, project_type, status, created_at").order("created_at", { ascending: false }).limit(10),
      ]);
      const projs = (p ?? []) as Project[];
      setProjects(projs);
      setInquiries((i ?? []) as Inquiry[]);

      if (projs.length) {
        const ids = projs.map((x) => x.id);
        const [{ data: m }, { data: u }] = await Promise.all([
          supabase.from("project_milestones").select("*").in("project_id", ids).order("position"),
          supabase.from("project_updates").select("*").in("project_id", ids).order("created_at", { ascending: false }),
        ]);
        setMilestones((m ?? []) as Milestone[]);
        setUpdates((u ?? []) as Update[]);
      }
      setBusy(false);
    }
    load();

    const ch = supabase
      .channel("dashboard-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "client_projects" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "project_milestones" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "project_updates" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [session]);

  const stats = useMemo(() => {
    const active = projects.filter((p) => p.stage === "in_progress").length;
    const completed = projects.filter((p) => p.stage === "completed").length;
    const pending = inquiries.filter((i) => i.status === "new" || i.status === "pending").length;
    return { total: projects.length, active, completed, pending };
  }, [projects, inquiries]);

  if (loading || busy) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface text-ink/40">Loading…</div>
    );
  }

  const initial = (user?.user_metadata?.full_name || user?.email || "?")[0]?.toUpperCase();
  const fullName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

  const nav: { key: Section; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "projects", label: "Projects", icon: FolderKanban, badge: projects.length },
    { key: "inquiries", label: "Inquiries", icon: MessageSquare, badge: inquiries.length },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-ink text-surface flex flex-col transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-surface/10">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <span className="inline-flex size-7 items-center justify-center rounded-md bg-brand text-brand-foreground text-[11px] font-bold">O</span>
            OKIKE
          </Link>
          <button className="lg:hidden text-surface/60" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-surface/40 px-3 mb-2">Workspace</div>
          {nav.map((n) => {
            const active = section === n.key;
            const Icon = n.icon;
            return (
              <button
                key={n.key}
                onClick={() => {
                  setSection(n.key);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  active ? "bg-surface/10 text-surface" : "text-surface/60 hover:text-surface hover:bg-surface/5"
                }`}
              >
                <Icon className="size-4" />
                <span className="flex-1 text-left">{n.label}</span>
                {n.badge !== undefined && n.badge > 0 && (
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${active ? "bg-brand text-brand-foreground" : "bg-surface/10 text-surface/70"}`}>
                    {n.badge}
                  </span>
                )}
              </button>
            );
          })}

          {role === "admin" && (
            <>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-surface/40 px-3 mt-6 mb-2">Admin</div>
              <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-surface/60 hover:text-surface hover:bg-surface/5">
                <Shield className="size-4" /> Admin panel
              </Link>
            </>
          )}
        </nav>

        <div className="p-3 border-t border-surface/10">
          <Link to="/book" className="flex items-center justify-center gap-2 bg-brand text-brand-foreground rounded-lg py-2.5 text-sm font-medium hover:opacity-90 transition">
            <Plus className="size-4" /> New project
          </Link>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-ink/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-surface/80 backdrop-blur-xl border-b border-ink/5 h-16 flex items-center px-4 md:px-8 gap-4">
          <button className="lg:hidden text-ink" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md bg-ink/[0.04] ring-1 ring-ink/5 rounded-full px-4 py-2">
            <Search className="size-4 text-ink/40" />
            <input
              placeholder="Search projects, updates…"
              className="bg-transparent outline-none text-sm flex-1 placeholder:text-ink/40"
            />
          </div>
          <div className="flex-1 md:hidden" />
          <button className="relative size-9 inline-flex items-center justify-center rounded-full hover:bg-ink/5 transition" aria-label="Notifications">
            <Bell className="size-4 text-ink/70" />
            {updates.length > 0 && <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-brand" />}
          </button>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-ink leading-tight">{fullName}</div>
              <div className="text-[11px] text-ink/50 capitalize leading-tight">{role || "client"}</div>
            </div>
            <button
              onClick={async () => {
                await signOut();
                navigate({ to: "/" });
              }}
              className="size-9 rounded-full bg-ink text-surface text-sm font-medium flex items-center justify-center hover:bg-brand transition"
              aria-label="Sign out"
              title="Sign out"
            >
              {initial}
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          {section === "overview" && (
            <Overview fullName={fullName} stats={stats} projects={projects} inquiries={inquiries} updates={updates} setSection={setSection} />
          )}
          {section === "projects" && (
            <ProjectsView projects={projects} milestones={milestones} updates={updates} inquiries={inquiries} />
          )}
          {section === "inquiries" && <InquiriesView inquiries={inquiries} />}
          {section === "settings" && <SettingsView user={user} signOut={signOut} navigate={navigate} />}
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, accent }: { label: string; value: number | string; icon: typeof LayoutDashboard; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-5 ring-1 ring-ink/5 ${accent ? "bg-ink text-surface" : "bg-card"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`text-xs uppercase tracking-widest ${accent ? "text-surface/50" : "text-ink/40"}`}>{label}</div>
        <div className={`size-8 inline-flex items-center justify-center rounded-lg ${accent ? "bg-surface/10 text-brand" : "bg-brand/10 text-brand"}`}>
          <Icon className="size-4" />
        </div>
      </div>
      <div className="text-3xl font-semibold">{value}</div>
    </div>
  );
}

function Overview({
  fullName,
  stats,
  projects,
  inquiries,
  updates,
  setSection,
}: {
  fullName: string;
  stats: { total: number; active: number; completed: number; pending: number };
  projects: Project[];
  inquiries: Inquiry[];
  updates: Update[];
  setSection: (s: Section) => void;
}) {
  return (
    <div className="flex flex-col gap-6 max-w-7xl">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs font-semibold tracking-widest uppercase text-brand">Dashboard</div>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight mt-1">Welcome back, {fullName}.</h1>
          <p className="text-ink/60 mt-2 text-sm">Here's what's happening with your projects today.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total projects" value={stats.total} icon={FolderKanban} accent />
        <StatCard label="In progress" value={stats.active} icon={Clock} />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} />
        <StatCard label="Open inquiries" value={stats.pending} icon={TrendingUp} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-2xl ring-1 ring-ink/5 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-medium">Recent projects</h2>
            <button onClick={() => setSection("projects")} className="text-xs text-brand font-medium hover:underline">View all</button>
          </div>
          {projects.length === 0 ? (
            <EmptyState inquiries={inquiries} />
          ) : (
            <ul className="divide-y divide-ink/5">
              {projects.slice(0, 4).map((p) => (
                <li key={p.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{p.title}</div>
                    <div className="text-xs text-ink/50">{p.package_name || "—"}</div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${STAGE_COLOR[p.stage]}`}>{STAGE_LABEL[p.stage]}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-card rounded-2xl ring-1 ring-ink/5 p-6">
          <h2 className="font-medium mb-5">Latest updates</h2>
          {updates.length === 0 ? (
            <div className="text-sm text-ink/50 py-8 text-center">No updates yet.</div>
          ) : (
            <ul className="flex flex-col gap-4">
              {updates.slice(0, 4).map((u) => (
                <li key={u.id} className="flex gap-3">
                  <span className="size-2 rounded-full bg-brand mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-ink/40">{new Date(u.created_at).toLocaleDateString()}</div>
                    <div className="text-sm text-ink/80 line-clamp-2">{u.message}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ inquiries }: { inquiries: Inquiry[] }) {
  return (
    <div className="py-10 text-center flex flex-col items-center gap-4">
      <Sparkles className="size-8 text-brand" />
      <div className="font-medium">No active projects yet</div>
      <p className="text-ink/60 text-sm max-w-md">
        {inquiries.length > 0
          ? "Your inquiry is in our queue. As soon as it's accepted, your project will appear here."
          : "Start a project to see it appear here with live status, milestones and updates."}
      </p>
      <Link to="/book" className="bg-brand text-brand-foreground py-2.5 px-5 rounded-full text-sm font-medium">
        Start a project
      </Link>
    </div>
  );
}

function ProjectsView({ projects, milestones, updates, inquiries }: { projects: Project[]; milestones: Milestone[]; updates: Update[]; inquiries: Inquiry[] }) {
  return (
    <div className="flex flex-col gap-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-medium tracking-tight">Projects</h1>
        <p className="text-ink/60 mt-1 text-sm">Live progress and updates on everything we&apos;re building together.</p>
      </div>

      {projects.length === 0 ? (
        <div className="bg-card rounded-2xl ring-1 ring-ink/5 p-10">
          <EmptyState inquiries={inquiries} />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {projects.map((proj) => {
            const ms = milestones.filter((m) => m.project_id === proj.id);
            const up = updates.filter((u) => u.project_id === proj.id);
            const done = ms.filter((m) => m.status === "done").length;
            const pct = ms.length ? Math.round((done / ms.length) * 100) : 0;

            return (
              <article key={proj.id} className="bg-card rounded-2xl p-6 md:p-8 ring-1 ring-ink/5 flex flex-col gap-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-medium">{proj.title}</h2>
                    <p className="text-sm text-ink/50 mt-1">
                      {proj.package_name} · started {new Date(proj.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STAGE_COLOR[proj.stage]}`}>
                    {STAGE_LABEL[proj.stage]}
                  </span>
                </div>

                {proj.stage === "in_progress" && ms.length > 0 && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between text-xs text-ink/60">
                      <span>Progress</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-2 bg-ink/5 rounded-full overflow-hidden">
                      <div className="h-full bg-brand transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="grid sm:grid-cols-4 gap-3">
                      {ms.map((m) => (
                        <div
                          key={m.id}
                          className={`rounded-xl p-4 ring-1 flex flex-col gap-2 ${
                            m.status === "done"
                              ? "ring-emerald-200 bg-emerald-50"
                              : m.status === "active"
                              ? "ring-brand/30 bg-brand/5"
                              : "ring-ink/10 bg-surface"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {m.status === "done" ? (
                              <CheckCircle2 className="size-4 text-emerald-600" />
                            ) : m.status === "active" ? (
                              <Clock className="size-4 text-brand" />
                            ) : (
                              <Circle className="size-4 text-ink/30" />
                            )}
                            <div className="text-sm font-medium">{m.name}</div>
                          </div>
                          {m.note && <p className="text-xs text-ink/60">{m.note}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {proj.stage === "declined" && (
                  <div className="rounded-xl bg-red-50 ring-1 ring-red-200 p-4 flex gap-3 text-sm">
                    <XCircle className="size-5 text-red-600 shrink-0" />
                    <div>
                      <div className="font-medium text-red-800">This project wasn't accepted</div>
                      {proj.admin_notes && <div className="text-red-700 mt-1">{proj.admin_notes}</div>}
                    </div>
                  </div>
                )}

                {proj.admin_notes && proj.stage !== "declined" && (
                  <div className="rounded-xl bg-surface ring-1 ring-ink/5 p-4 text-sm">
                    <div className="text-xs font-semibold uppercase tracking-wider text-ink/40 mb-1">Notes from OKIKE</div>
                    <p className="text-ink/80 whitespace-pre-wrap">{proj.admin_notes}</p>
                  </div>
                )}

                {proj.total && (
                  <div className="flex flex-wrap gap-6 text-sm border-t border-ink/5 pt-4">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-ink/40">Total</div>
                      <div className="font-medium">${Number(proj.total).toLocaleString()} {proj.currency}</div>
                    </div>
                    {proj.deposit && (
                      <div>
                        <div className="text-xs uppercase tracking-wider text-ink/40">Deposit</div>
                        <div className="font-medium">${Number(proj.deposit).toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                )}

                {up.length > 0 && (
                  <div className="border-t border-ink/5 pt-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-ink/40 mb-3">Updates</div>
                    <ul className="flex flex-col gap-3">
                      {up.map((u) => (
                        <li key={u.id} className="text-sm">
                          <div className="text-xs text-ink/40">{new Date(u.created_at).toLocaleString()}</div>
                          <div className="text-ink/80 whitespace-pre-wrap">{u.message}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function InquiriesView({ inquiries }: { inquiries: Inquiry[] }) {
  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-medium tracking-tight">Inquiries</h1>
        <p className="text-ink/60 mt-1 text-sm">Project requests you&apos;ve submitted to us.</p>
      </div>
      {inquiries.length === 0 ? (
        <div className="bg-card rounded-2xl ring-1 ring-ink/5 p-10 text-center text-ink/50 text-sm">
          No inquiries yet. <Link to="/book" className="text-brand font-medium hover:underline">Submit one →</Link>
        </div>
      ) : (
        <div className="bg-card rounded-2xl ring-1 ring-ink/5 divide-y divide-ink/5">
          {inquiries.map((q) => (
            <div key={q.id} className="p-5 flex justify-between items-center gap-4">
              <div>
                <div className="font-medium">{q.project_type}</div>
                <div className="text-xs text-ink/50 mt-0.5">{new Date(q.created_at).toLocaleString()}</div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 capitalize">{q.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsView({ user, signOut, navigate }: { user: any; signOut: () => Promise<void>; navigate: ReturnType<typeof useNavigate> }) {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-medium tracking-tight">Settings</h1>
        <p className="text-ink/60 mt-1 text-sm">Manage your account.</p>
      </div>
      <div className="bg-card rounded-2xl ring-1 ring-ink/5 p-6 flex flex-col gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-ink/40 mb-1">Email</div>
          <div className="font-medium">{user?.email}</div>
        </div>
        {user?.user_metadata?.full_name && (
          <div>
            <div className="text-xs uppercase tracking-widest text-ink/40 mb-1">Name</div>
            <div className="font-medium">{user.user_metadata.full_name}</div>
          </div>
        )}
        <div className="pt-4 border-t border-ink/5">
          <button
            onClick={async () => {
              await signOut();
              navigate({ to: "/" });
            }}
            className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
