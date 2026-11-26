"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await fetch("/api/projects");
      if (res.status === 401) return router.replace("/login?next=/dashboard");
      const data = await res.json();
      if (!alive) return;
      if (!res.ok) setError(data.error || "Could not load projects.");
      else setProjects(data.projects);
    })();
    return () => {
      alive = false;
    };
  }, [router]);

  async function remove(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) setProjects((list) => list.filter((p) => p.id !== id));
    else setError("Could not delete the project.");
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Your projects</h1>
          <p className="text-sm text-slate-500">Everything you have generated and saved.</p>
        </div>
        <Link
          href="/builder"
          className="rounded-xl bg-[linear-gradient(135deg,#6366f1,#8b5cf6)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:opacity-90"
        >
          + New project
        </Link>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {projects === null && !error && <p className="text-slate-500">Loading…</p>}

      {projects?.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-lg font-semibold">No projects yet</p>
          <p className="mt-1 text-sm text-slate-500">Generate some content and press Save to see it here.</p>
          <Link href="/builder" className="mt-5 inline-block rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white">
            Create your first project
          </Link>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects?.map((p) => (
          <div key={p.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="truncate text-lg font-semibold">{p.name}</h2>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {[p.websiteType, p.tone, p.industry].filter(Boolean).map((tag) => (
                <span key={tag} className="rounded-full bg-indigo-50 px-2.5 py-1 font-medium text-indigo-700">
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Updated {new Date(p.updatedAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href={`/preview/${p.id}`} className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700">
                Preview
              </Link>
              <Link href={`/builder?project=${p.id}`} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-50">
                Edit
              </Link>
              <button
                onClick={() => remove(p.id, p.name)}
                className="ml-auto rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}