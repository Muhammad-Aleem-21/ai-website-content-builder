"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import SitePreview from "@/components/SitePreview";

function Preview() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await fetch(`/api/projects/${id}`);
      if (res.status === 401) return router.replace(`/login?next=/preview/${id}`);
      const data = await res.json();
      if (!alive) return;
      if (!res.ok) setError(data.error || "Could not load project.");
      else setProject(data.project);
    })();
    return () => {
      alive = false;
    };
  }, [id, router]);

  if (error) {
    return (
      <main className="mx-auto max-w-md p-10 text-center">
        <p className="text-red-600">{error}</p>
        <Link href="/dashboard" className="mt-4 inline-block text-indigo-600 underline">
          Back to dashboard
        </Link>
      </main>
    );
  }
  if (!project) return <p className="p-10 text-center text-slate-500">Loading preview…</p>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-900 px-4 py-2 text-sm text-white">
        <span>Preview: {project.name}</span>
        <span className="flex gap-4">
          <Link href={`/builder?project=${project.id}`} className="underline">
            Edit in builder
          </Link>
          <Link href="/dashboard" className="underline">
            Dashboard
          </Link>
        </span>
      </div>
      <SitePreview input={project.input} content={project.content} selections={project.selections} />
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<p className="p-10 text-center text-slate-500">Loading preview…</p>}>
      <Preview />
    </Suspense>
  );
}