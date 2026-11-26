"use client";
import { useEffect, useRef, useState } from "react";

export function CopyButton({ text, label = "Copy", small = false }) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch {
      /* clipboard blocked: ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`shrink-0 rounded-lg border border-slate-200 bg-white font-medium text-slate-600 transition hover:bg-slate-50 ${
        small ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"
      }`}
    >
      {done ? "Copied ✓" : label}
    </button>
  );
}

// A textarea that grows with its content and looks like plain text until focused.
export function EditableText({ value, onChange, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`-mx-2 w-full resize-none rounded-md bg-transparent px-2 py-1 outline-none transition focus:bg-white focus:ring-2 focus:ring-indigo-300 ${className}`}
    />
  );
}

// Wraps one generated section: title, copy, content, and regenerate controls.
export function SectionShell({ id, title, subtitle, copyText, onRegenerate, busy, children }) {
  const [instruction, setInstruction] = useState("");

  return (
    <section
      id={id}
      className="scroll-mt-32 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
        </div>
        <CopyButton text={copyText} label="Copy section" />
      </div>

      <div className={`mt-5 transition ${busy ? "pointer-events-none opacity-40" : ""}`}>
        {children}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onRegenerate(instruction);
        }}
        className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row"
      >
        <input
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          maxLength={300}
          placeholder='Optional instruction, e.g. "make it shorter"'
          className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <button
          disabled={busy}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {busy ? "Regenerating…" : "↻ Regenerate"}
        </button>
      </form>
    </section>
  );
}

// Radio-style list of AI variations. Click to select, click the text to edit.
export function VariationGroup({ label, items, selected, onSelect, onEdit, textClass = "" }) {
  return (
    <div className="mb-6 last:mb-0">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <div className="grid gap-2">
        {items.map((text, i) => {
          const active = i === selected;
          return (
            <div
              key={i}
              className={`flex items-start gap-3 rounded-xl border p-3 transition ${
                active
                  ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-label={`Select option ${i + 1}`}
                className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 text-[10px] text-white ${
                  active ? "border-indigo-600 bg-indigo-600" : "border-slate-300"
                }`}
              >
                {active ? "✓" : ""}
              </button>
              <div className="min-w-0 flex-1">
                <EditableText value={text} onChange={(v) => onEdit(i, v)} className={textClass} />
              </div>
              <CopyButton text={text} small />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Grid of editable cards (services, features, testimonials, FAQs...).
export function ItemGrid({ items, fields, onEdit, cols = "sm:grid-cols-2" }) {
  return (
    <div className={`grid gap-3 ${cols}`}>
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="space-y-1">
            {fields.map((f) => (
              <EditableText
                key={f.key}
                value={item[f.key]}
                onChange={(v) => onEdit(i, f.key, v)}
                className={f.className}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-end">
            <CopyButton small text={fields.map((f) => item[f.key]).join("\n")} />
          </div>
        </div>
      ))}
    </div>
  );
}