import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const [stats, setStats] = useState({ inquiries: 0, projects: 0, inProgress: 0, completed: 0 });
  const [recent, setRecent] = useState<{ id: string; name: string; project_type: string; status: string; created_at: string }[]>([]);

  useEffect(() => {
    async function load() {
      const [{ count: inq }, { count: proj }, { count: ip }, { count: comp }, { data: r }] = await Promise.all([
        supabase.from("project_inquiries").select("*", { count: "exact", head: true }),
        supabase.from("client_projects").select("*", { count: "exact", head: true }),
        supabase.from("client_projects").select("*", { count: "exact", head: true }).eq("stage", "in_progress"),
        supabase.from("client_projects").select("*", { count: "exact", head: true }).eq("stage", "completed"),
        supabase.from("project_inquiries").select("id, name, project_type, status, created_at").order("created_at", { ascending: false }).limit(5),
      ]);
      setStats({ inquiries: inq ?? 0, projects: proj ?? 0, inProgress: ip ?? 0, completed: comp ?? 0 });
      setRecent((r ?? []) as never);
    }
    load();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-medium">Overview</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Inquiries" value={stats.inquiries} />
        <Stat label="Projects" value={stats.projects} />
        <Stat label="In progress" value={stats.inProgress} />
        <Stat label="Completed" value={stats.completed} />
      </div>

      <section className="bg-card rounded-2xl ring-1 ring-ink/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-ink/5 flex justify-between items-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink/60">Recent inquiries</h2>
          <Link to="/admin/inquiries" className="text-sm text-brand">View all →</Link>
        </div>
        <ul className="divide-y divide-ink/5">
          {recent.length === 0 && <li className="px-6 py-8 text-sm text-ink/40 text-center">No inquiries yet.</li>}
          {recent.map((r) => (
            <li key={r.id} className="px-6 py-4 flex items-center justify-between gap-4">
              <div>
                <div className="font-medium text-sm">{r.name} — {r.project_type}</div>
                <div className="text-xs text-ink/40">{new Date(r.created_at).toLocaleString()}</div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 capitalize">{r.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-card rounded-2xl p-6 ring-1 ring-ink/5">
      <div className="text-xs uppercase tracking-wider text-ink/40">{label}</div>
      <div className="text-3xl font-medium mt-2">{value}</div>
    </div>
  );
}
