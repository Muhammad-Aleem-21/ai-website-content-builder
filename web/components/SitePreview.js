export default function SitePreview({ input, content, selections = {} }) {
  const s = { headline: 0, description: 0, cta: 0, about: 0, ...selections };
  const { hero, about, services, features, whyChooseUs, testimonials, faqs } = content;

  const links = [
    ["about", "About"],
    ["services", "Services"],
    ["features", "Features"],
    ["why", "Why us"],
    ["faq", "FAQ"],
  ];

  const heading = "text-3xl font-bold tracking-tight sm:text-4xl";

  return (
    <div className="bg-white text-slate-900">
      {/* Site nav */}
      <header className="border-b border-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-lg font-bold">{input.businessName}</span>
          <nav className="hidden gap-6 text-sm text-slate-600 md:flex">
            {links.map(([id, label]) => (
              <a key={id} href={`#p-${id}`} className="hover:text-slate-900">
                {label}
              </a>
            ))}
          </nav>
          <span className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            {hero.ctaOptions[s.cta]}
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[linear-gradient(135deg,#eef2ff,#faf5ff)]">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">{hero.headlines[s.headline]}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">{hero.descriptions[s.description]}</p>
          <span className="mt-8 inline-block rounded-xl bg-indigo-600 px-7 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30">
            {hero.ctaOptions[s.cta]}
          </span>
        </div>
      </section>

      {/* About */}
      <section id="p-about" className="mx-auto max-w-3xl scroll-mt-4 px-4 py-16 text-center sm:px-6">
        <h2 className={heading}>About us</h2>
        <p className="mt-5 text-lg leading-relaxed text-slate-600">{about.variations[s.about]}</p>
      </section>

      {/* Services */}
      <section id="p-services" className="scroll-mt-4 bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className={`${heading} text-center`}>Our services</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((item, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-100 font-bold text-indigo-700">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="p-features" className="mx-auto max-w-6xl scroll-mt-4 px-4 py-16 sm:px-6">
        <h2 className={`${heading} text-center`}>Features</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, i) => (
            <div key={i} className="flex gap-4">
              <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                ✓
              </span>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section id="p-why" className="scroll-mt-4 bg-[linear-gradient(135deg,#312e81,#6d28d9)] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className={`${heading} text-center`}>Why choose us</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {whyChooseUs.map((item, i) => (
              <div key={i} className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-indigo-100">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className={`${heading} text-center`}>What people say</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure key={i} className="rounded-2xl border border-slate-200 p-6 shadow-sm">
              <blockquote className="italic leading-relaxed text-slate-700">“{t.quote}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                  {t.name?.[0] ?? "?"}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{t.name}</span>
                  <span className="block text-xs text-slate-500">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="p-faq" className="scroll-mt-4 bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className={`${heading} text-center`}>Frequently asked questions</h2>
          <div className="mt-8 space-y-3">
            {faqs.map((f, i) => (
              <details key={i} className="group rounded-xl border border-slate-200 bg-white p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {f.question}
                  <span className="text-slate-400 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA + footer */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <h2 className={heading}>{hero.headlines[s.headline]}</h2>
        <span className="mt-6 inline-block rounded-xl bg-indigo-600 px-7 py-3 font-semibold text-white">
          {hero.ctaOptions[s.cta]}
        </span>
      </section>
      <footer className="border-t border-slate-100 py-6 text-center text-sm text-slate-500">
        © {input.businessName}
      </footer>
    </div>
  );
}