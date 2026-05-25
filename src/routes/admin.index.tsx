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
        supabase.from("project_inquiries").select("id, name, project_type, status, created_at").order("created_at", { ascending: false }).limit(8),
      ]);
      setStats({ inquiries: inq ?? 0, projects: proj ?? 0, inProgress: ip ?? 0, completed: comp ?? 0 });
      setRecent((r ?? []) as never);
    }
    load();
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div>
        <div className="text-xs font-semibold tracking-widest uppercase text-brand">Admin</div>
        <h1 className="text-3xl font-medium tracking-tight mt-1">Overview</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Inquiries", value: stats.inquiries },
          { label: "Active projects", value: stats.inProgress },
          { label: "Completed", value: stats.completed },
          { label: "Total projects", value: stats.projects },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-card ring-1 ring-ink/5 p-5">
            <div className="text-xs uppercase tracking-wider text-ink/40">{s.label}</div>
            <div className="text-3xl font-semibold mt-2">{s.value}</div>
          </div>
        ))}
      </div>

      <section className="rounded-2xl bg-card ring-1 ring-ink/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-ink/5 flex justify-between items-center">
          <h2 className="font-medium">Recent inquiries</h2>
          <Link to="/admin/inquiries" className="text-xs text-brand hover:underline">View all</Link>
        </div>
        <ul className="divide-y divide-ink/5">
          {recent.length === 0 && <li className="px-6 py-10 text-sm text-ink/40 text-center">No inquiries yet.</li>}
          {recent.map((r) => (
            <li key={r.id} className="px-6 py-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{r.name} — {r.project_type}</div>
                <div className="text-xs text-ink/40">{new Date(r.created_at).toLocaleString()}</div>
              </div>
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-brand/10 text-brand font-medium">{r.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
