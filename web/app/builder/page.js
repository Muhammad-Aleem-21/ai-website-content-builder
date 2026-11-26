"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CopyButton, SectionShell, VariationGroup, ItemGrid } from "@/components/ui";

const TYPES = [
  { value: "Agency", icon: "🏢", hint: "Services & clients" },
  { value: "E-commerce", icon: "🛍️", hint: "Sell products" },
  { value: "Portfolio", icon: "🎨", hint: "Show your work" },
  { value: "Restaurant", icon: "🍽️", hint: "Food & venues" },
  { value: "SaaS", icon: "💻", hint: "Software product" },
];

const TONES = [
  { value: "Professional", icon: "👔" },
  { value: "Creative", icon: "🎭" },
  { value: "Friendly", icon: "😊" },
  { value: "Minimal", icon: "▫️" },
];

const NAV = [
  ["hero", "Hero"],
  ["about", "About Us"],
  ["services", "Services"],
  ["features", "Features"],
  ["whyChooseUs", "Why Choose Us"],
  ["testimonials", "Testimonials"],
  ["faqs", "FAQs"],
];

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";

const EMPTY_INPUT = {
  businessName: "",
  industry: "",
  services: "",
  audience: "",
  description: "",
  websiteType: "Restaurant",
  tone: "Friendly",
};

const DEFAULT_SEL = { headline: 0, description: 0, cta: 0, about: 0 };

async function post(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// Immutable update at a path, e.g. setIn(content, ["hero","headlines",1], "New text")
function setIn(obj, path, value) {
  const [head, ...rest] = path;
  const copy = Array.isArray(obj) ? [...obj] : { ...obj };
  copy[head] = rest.length ? setIn(obj[head], rest, value) : value;
  return copy;
}

function sectionText(key, c, sel) {
  switch (key) {
    case "hero":
      return `${c.hero.headlines[sel.headline]}\n\n${c.hero.descriptions[sel.description]}\n\n${c.hero.ctaOptions[sel.cta]}`;
    case "about":
      return c.about.variations[sel.about];
    case "services":
    case "features":
    case "whyChooseUs":
      return c[key].map((i) => `${i.title}\n${i.description}`).join("\n\n");
    case "testimonials":
      return c.testimonials.map((t) => `"${t.quote}"\n- ${t.name}, ${t.role}`).join("\n\n");
    case "faqs":
      return c.faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");
    default:
      return "";
  }
}

function Builder() {
  const projectParam = useSearchParams().get("project");

  const [input, setInput] = useState(EMPTY_INPUT);
  const [content, setContent] = useState(null);
  const [sel, setSel] = useState(DEFAULT_SEL);
  const [view, setView] = useState("form"); // "form" | "results"
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");

  const [projectId, setProjectId] = useState(null);
  const [loadingProject, setLoadingProject] = useState(Boolean(projectParam));
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [needLogin, setNeedLogin] = useState(false);

  const update = (e) => setInput({ ...input, [e.target.name]: e.target.value });
  const edit = (path, value) => {
    setContent((prev) => setIn(prev, path, value));
    setNotice("");
  };

  // Load a saved project when opened from the dashboard (/builder?project=ID)
  useEffect(() => {
    if (!projectParam) return;
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/projects/${projectParam}`);
        if (res.status === 401) {
          window.location.href = `/login?next=${encodeURIComponent(`/builder?project=${projectParam}`)}`;
          return;
        }
        const data = await res.json();
        if (!alive) return;
        if (!res.ok) throw new Error(data.error || "Could not load project.");
        setInput({ ...EMPTY_INPUT, ...data.project.input });
        setContent(data.project.content);
        setSel({ ...DEFAULT_SEL, ...data.project.selections });
        setProjectId(data.project.id);
        setView("results");
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoadingProject(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [projectParam]);

  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await post("/api/generate", input);
      setContent(data.content);
      setSel(DEFAULT_SEL);
      setNotice("");
      setView("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function regen(section, instruction) {
    setBusy(section);
    setError("");
    try {
      const data = await post("/api/regenerate", {
        input,
        section,
        currentContent: { [section]: content[section] },
        instruction,
      });
      setContent((prev) => ({ ...prev, [section]: data.content }));
      setNotice("");
      setSel((prev) =>
        section === "hero"
          ? { ...prev, headline: 0, description: 0, cta: 0 }
          : section === "about"
          ? { ...prev, about: 0 }
          : prev
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setNotice("");
    setNeedLogin(false);
    try {
      const body = projectId
        ? { input, content, selections: sel }
        : { name: input.businessName, input, content, selections: sel };

      const res = await fetch(projectId ? `/api/projects/${projectId}` : "/api/projects", {
        method: projectId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.status === 401) {
        setNeedLogin(true);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Could not save project.");

      if (!projectId) setProjectId(data.id);
      setNotice("Saved ✓");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loadingProject) {
    return <p className="p-10 text-center text-slate-500">Loading your project…</p>;
  }

  /* ---------------- FORM VIEW ---------------- */
  if (view === "form") {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid lg:grid-cols-5">
          <aside className="bg-[linear-gradient(160deg,#4f46e5,#9333ea)] p-6 text-white sm:p-8 lg:col-span-2">
            <h1 className="text-2xl font-bold sm:text-3xl">Tell us about your business</h1>
            <p className="mt-3 text-sm text-indigo-100">
              The more specific you are, the better the content. Only mention things that are true, because the AI is told not to invent facts.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-indigo-50">
              <li>✓ 3 headline and description options</li>
              <li>✓ Hero, About, Services, Features</li>
              <li>✓ Why Choose Us, Testimonials, FAQs</li>
              <li>✓ Edit, regenerate, copy and save anything</li>
            </ul>
            {content && (
              <button
                onClick={() => setView("results")}
                className="mt-8 rounded-lg bg-white/15 px-4 py-2 text-sm font-medium hover:bg-white/25"
              >
                ← Back to my results
              </button>
            )}
          </aside>

          <form onSubmit={handleGenerate} className="space-y-5 p-6 sm:p-8 lg:col-span-3">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Business name
                <input name="businessName" value={input.businessName} onChange={update} placeholder="Brew & Bloom" className={`${inputClass} mt-1`} maxLength={100} required />
              </label>
              <label className="block text-sm font-medium">
                Industry
                <input name="industry" value={input.industry} onChange={update} placeholder="Cafe" className={`${inputClass} mt-1`} maxLength={100} required />
              </label>
            </div>

            <label className="block text-sm font-medium">
              Services <span className="font-normal text-slate-500">(comma separated)</span>
              <input name="services" value={input.services} onChange={update} placeholder="Specialty coffee, fresh pastries, catering" className={`${inputClass} mt-1`} maxLength={500} required />
            </label>

            <label className="block text-sm font-medium">
              Target audience
              <input name="audience" value={input.audience} onChange={update} placeholder="Young professionals and students" className={`${inputClass} mt-1`} maxLength={300} required />
            </label>

            <label className="block text-sm font-medium">
              Business description
              <textarea name="description" value={input.description} onChange={update} rows={3} placeholder="What makes your business what it is?" className={`${inputClass} mt-1`} maxLength={1000} required />
            </label>

            <div>
              <p className="text-sm font-medium">Website type</p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
                {TYPES.map((t) => (
                  <button
                    type="button"
                    key={t.value}
                    onClick={() => setInput({ ...input, websiteType: t.value })}
                    className={`rounded-xl border p-3 text-left transition ${
                      input.websiteType === t.value
                        ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-xl">{t.icon}</div>
                    <div className="mt-1 text-sm font-semibold">{t.value}</div>
                    <div className="text-xs text-slate-500">{t.hint}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium">Content tone</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <button
                    type="button"
                    key={t.value}
                    onClick={() => setInput({ ...input, tone: t.value })}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      input.tone === t.value
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {t.icon} {t.value}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

            <button
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#6366f1,#8b5cf6)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Writing your content…
                </>
              ) : (
                `✦ ${content ? "Generate again" : "Generate website content"}`
              )}
            </button>
          </form>
        </div>
      </main>
    );
  }

  /* ---------------- RESULTS VIEW ---------------- */
  const hero = content.hero;

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Top bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{input.businessName}</h1>
          <p className="text-sm text-slate-500">
            {input.websiteType} · {input.tone} tone
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {notice && <span className="text-sm font-medium text-emerald-600">{notice}</span>}
          <button
            onClick={() => setView("form")}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            ✎ Edit details
          </button>
          {projectId && (
            <Link
              href={`/preview/${projectId}`}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              👁 Preview site
            </Link>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 disabled:opacity-60"
          >
            {saving ? "Saving…" : projectId ? "💾 Save changes" : "💾 Save project"}
          </button>
        </div>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {needLogin && (
        <p className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          You need to be logged in to save.{" "}
          <Link href="/login" target="_blank" className="font-semibold underline">
            Log in
          </Link>{" "}
          or{" "}
          <Link href="/signup" target="_blank" className="font-semibold underline">
            sign up
          </Link>{" "}
          (opens in a new tab so your work here is not lost), then come back and press Save again.
        </p>
      )}

      {/* Live hero preview */}
      <div className="mb-8 overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#312e81,#6d28d9)] px-6 py-10 text-center text-white sm:px-12 sm:py-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200">Live hero preview</p>
        <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold sm:text-5xl">{hero.headlines[sel.headline]}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-indigo-100 sm:text-lg">{hero.descriptions[sel.description]}</p>
        <span className="mt-6 inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-700">
          {hero.ctaOptions[sel.cta]}
        </span>
      </div>

      <div className="lg:grid lg:grid-cols-[190px_1fr] lg:gap-8">
        <nav className="sticky top-16 z-30 -mx-4 mb-4 flex gap-2 overflow-x-auto bg-slate-50/90 px-4 py-3 backdrop-blur lg:top-24 lg:mx-0 lg:mb-0 lg:flex-col lg:gap-1 lg:self-start lg:bg-transparent lg:p-0">
          {NAV.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 lg:border-transparent lg:bg-transparent"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="space-y-6">
          <SectionShell
            id="hero"
            title="Hero Section"
            subtitle="Select your favourite option in each group. Click any text to edit it."
            copyText={sectionText("hero", content, sel)}
            busy={busy === "hero"}
            onRegenerate={(i) => regen("hero", i)}
          >
            <VariationGroup
              label="Headline"
              items={hero.headlines}
              selected={sel.headline}
              onSelect={(i) => {
                setSel({ ...sel, headline: i });
                setNotice("");
              }}
              onEdit={(i, v) => edit(["hero", "headlines", i], v)}
              textClass="text-lg font-bold"
            />
            <VariationGroup
              label="Description"
              items={hero.descriptions}
              selected={sel.description}
              onSelect={(i) => {
                setSel({ ...sel, description: i });
                setNotice("");
              }}
              onEdit={(i, v) => edit(["hero", "descriptions", i], v)}
              textClass="text-sm text-slate-700"
            />
            <VariationGroup
              label="Button text"
              items={hero.ctaOptions}
              selected={sel.cta}
              onSelect={(i) => {
                setSel({ ...sel, cta: i });
                setNotice("");
              }}
              onEdit={(i, v) => edit(["hero", "ctaOptions", i], v)}
              textClass="text-sm font-medium"
            />
          </SectionShell>

          <SectionShell
            id="about"
            title="About Us"
            subtitle="Each version takes a different angle."
            copyText={sectionText("about", content, sel)}
            busy={busy === "about"}
            onRegenerate={(i) => regen("about", i)}
          >
            <VariationGroup
              label="Versions"
              items={content.about.variations}
              selected={sel.about}
              onSelect={(i) => {
                setSel({ ...sel, about: i });
                setNotice("");
              }}
              onEdit={(i, v) => edit(["about", "variations", i], v)}
              textClass="text-sm text-slate-700"
            />
          </SectionShell>

          {[
            ["services", "Services", "One card per service you listed."],
            ["features", "Features", "Highlights that set you apart."],
            ["whyChooseUs", "Why Choose Us", "Reasons visitors should pick you."],
          ].map(([key, title, subtitle]) => (
            <SectionShell
              key={key}
              id={key}
              title={title}
              subtitle={subtitle}
              copyText={sectionText(key, content, sel)}
              busy={busy === key}
              onRegenerate={(i) => regen(key, i)}
            >
              <ItemGrid
                items={content[key]}
                fields={[
                  { key: "title", className: "font-semibold" },
                  { key: "description", className: "text-sm text-slate-600" },
                ]}
                onEdit={(i, f, v) => edit([key, i, f], v)}
              />
            </SectionShell>
          ))}

          <SectionShell
            id="testimonials"
            title="Testimonials"
            subtitle="Placeholders only. Replace them with real customer quotes before publishing."
            copyText={sectionText("testimonials", content, sel)}
            busy={busy === "testimonials"}
            onRegenerate={(i) => regen("testimonials", i)}
          >
            <ItemGrid
              cols="md:grid-cols-3"
              items={content.testimonials}
              fields={[
                { key: "quote", className: "text-sm italic text-slate-700" },
                { key: "name", className: "text-sm font-semibold" },
                { key: "role", className: "text-xs text-slate-500" },
              ]}
              onEdit={(i, f, v) => edit(["testimonials", i, f], v)}
            />
          </SectionShell>

          <SectionShell
            id="faqs"
            title="FAQs"
            subtitle="Check these answers: they should only state facts you've confirmed."
            copyText={sectionText("faqs", content, sel)}
            busy={busy === "faqs"}
            onRegenerate={(i) => regen("faqs", i)}
          >
            <ItemGrid
              cols="grid-cols-1"
              items={content.faqs}
              fields={[
                { key: "question", className: "font-semibold" },
                { key: "answer", className: "text-sm text-slate-600" },
              ]}
              onEdit={(i, f, v) => edit(["faqs", i, f], v)}
            />
          </SectionShell>

          <div className="flex justify-end pb-6">
            <CopyButton
              label="Copy everything"
              text={NAV.map(([k, label]) => `## ${label}\n${sectionText(k, content, sel)}`).join("\n\n")}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

// useSearchParams must sit inside a Suspense boundary in Next.js 16.
export default function BuilderPage() {
  return (
    <Suspense fallback={<p className="p-10 text-center text-slate-500">Loading…</p>}>
      <Builder />
    </Suspense>
  );
}