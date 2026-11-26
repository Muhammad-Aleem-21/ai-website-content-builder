import Link from "next/link";

const STEPS = [
  { n: "1", title: "Describe your business", text: "Enter your name, industry, services and audience, then pick a website type and tone." },
  { n: "2", title: "AI writes everything", text: "Get a hero, about, services, features, testimonials and FAQs, each with multiple options." },
  { n: "3", title: "Edit and make it yours", text: "Pick your favourite variations, tweak the text, regenerate any section and copy it out." },
];

const SECTIONS = [
  ["🚀", "Hero Section", "3 headlines, 3 descriptions and button text"],
  ["📖", "About Us", "Several story angles to choose from"],
  ["🛠️", "Services", "One clear card per service you offer"],
  ["✨", "Features", "Benefit-led feature highlights"],
  ["🏆", "Why Choose Us", "Reasons visitors should pick you"],
  ["💬", "Testimonials", "Placeholder quotes ready to swap"],
  ["❓", "FAQs", "Helpful questions and safe answers"],
];

export default function Landing() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-300/40 blur-3xl sm:h-96 sm:w-96" />
        <div className="pointer-events-none absolute right-0 top-40 h-60 w-60 rounded-full bg-fuchsia-300/30 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
          <span className="inline-block rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 text-xs font-semibold text-indigo-700">
            AI-powered website copywriting
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
            Your website content,{" "}
            <span className="bg-[linear-gradient(90deg,#6366f1,#d946ef)] bg-clip-text text-transparent">
              written in seconds
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
            Tell us about your business and get a complete, ready-to-use set of website sections.
            Choose your favourite variations, edit them, and copy them straight into your site.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/builder"
              className="w-full rounded-xl bg-[linear-gradient(135deg,#6366f1,#8b5cf6)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:opacity-90 sm:w-auto"
            >
              Generate my content →
            </Link>
            <a
              href="#how"
              className="w-full rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold transition hover:bg-slate-50 sm:w-auto"
            >
              How it works
            </a>
          </div>

          {/* Fake preview card */}
          <div className="mx-auto mt-14 max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-xl sm:p-8">
            <div className="mb-4 flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-300" />
              <span className="h-3 w-3 rounded-full bg-yellow-300" />
              <span className="h-3 w-3 rounded-full bg-green-300" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Generated headline</p>
            <p className="mt-1 text-2xl font-bold sm:text-3xl">Great coffee, good company, every single day</p>
            <p className="mt-2 text-slate-600">
              A cozy neighbourhood spot for specialty coffee and fresh pastries, made for work, study and catch-ups.
            </p>
            <span className="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
              View Menu
            </span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl font-bold">How it works</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                {s.n}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold">Everything your website needs</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
            Seven sections generated at once, each one editable and regenerable on its own.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SECTIONS.map(([icon, title, text]) => (
              <div key={title} className="rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-1 hover:shadow-md">
                <div className="text-2xl">{icon}</div>
                <h3 className="mt-3 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl bg-[linear-gradient(135deg,#4f46e5,#9333ea)] px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-3xl font-bold">Ready to see your content?</h2>
          <p className="mx-auto mt-3 max-w-lg text-indigo-100">It takes under a minute. No design skills needed.</p>
          <Link
            href="/builder"
            className="mt-6 inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
          >
            Start building →
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        © 2026 SiteCopy AI. AI-generated content should be reviewed before publishing.
      </footer>
    </main>
  );
}