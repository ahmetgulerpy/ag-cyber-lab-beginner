"use client";

import { useState, type ReactNode } from "react";
import type { Callout as CalloutT, CompareSide, Lesson } from "@/data/types";

/* ---------- Bölüm sarmalayıcı ---------- */
export function Section({
  id,
  step,
  title,
  subtitle,
  children,
}: {
  id: string;
  step: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-32 border-t border-line pt-10">
      <div className="mb-6 flex items-start gap-4">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-soft text-sm font-bold text-brand">
          {step}
        </span>
        <div>
          <h2 className="text-xl font-bold text-ink sm:text-2xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

/* ---------- Vurgu kutuları ---------- */
const CALLOUT_STYLES: Record<
  CalloutT["kind"],
  { label: string; icon: string; box: string; badge: string }
> = {
  important: { label: "Önemli Bilgi", icon: "i", box: "border-brand/30 bg-soft", badge: "bg-brand text-white" },
  real: { label: "Gerçek Hayat Örneği", icon: "◎", box: "border-accent/40 bg-[#EAF6F6]", badge: "bg-accent text-white" },
  note: { label: "Siber Güvenlik Notu", icon: "⌘", box: "border-line bg-[#F0F4F7]", badge: "bg-ink text-white" },
  warning: { label: "Dikkat Edilmesi Gerekenler", icon: "!", box: "border-warn/40 bg-[#FBF4E4]", badge: "bg-warn text-white" },
  mistake: { label: "Sık Yapılan Hata", icon: "✕", box: "border-bad/30 bg-[#FAEDED]", badge: "bg-bad text-white" },
  recall: { label: "Kısaca Hatırla", icon: "✓", box: "border-ok/30 bg-[#E9F5EF]", badge: "bg-ok text-white" },
};

export function Callout({ kind, title, text }: CalloutT) {
  const s = CALLOUT_STYLES[kind];
  return (
    <div className={`flex gap-3 rounded-2xl border p-4 ${s.box}`}>
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${s.badge}`}>
        {s.icon}
      </span>
      <div>
        <p className="text-sm font-bold text-ink">{title ?? s.label}</p>
        <p className="mt-0.5 text-sm text-ink/80">{text}</p>
      </div>
    </div>
  );
}

/* ---------- Ana kavram kartları ---------- */
export function ConceptCards({ items }: { items: Lesson["concepts"] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((c, i) => (
        <div key={c.term} className="card flex flex-col gap-2">
          <span className="label-mini text-accent">Kavram {String(i + 1).padStart(2, "0")}</span>
          <h3 className="text-base font-bold text-ink">
            {c.term} <span className="font-medium text-brand">({c.en})</span>
          </h3>
          <p className="text-sm text-muted">{c.desc}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------- Konu gezgini (aşamalı gösterim) ---------- */
export function TopicExplorer({ topics }: { topics: Lesson["topics"] }) {
  const [i, setI] = useState(0);
  const [seen, setSeen] = useState<Set<number>>(new Set([0]));
  const t = topics[i];
  const go = (n: number) => {
    setI(n);
    setSeen((s) => new Set(s).add(n));
  };
  return (
    <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
      <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
        {topics.map((x, n) => (
          <button
            key={x.title}
            onClick={() => go(n)}
            className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition lg:w-full ${
              n === i ? "border-brand bg-brand text-white" : "border-line bg-white text-ink hover:bg-soft"
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                n === i ? "bg-white/25 text-white" : seen.has(n) ? "bg-ok text-white" : "bg-soft text-brand"
              }`}
            >
              {seen.has(n) && n !== i ? "✓" : n + 1}
            </span>
            <span className="whitespace-nowrap lg:whitespace-normal">{x.title}</span>
          </button>
        ))}
      </div>
      <div key={i} className="card fade-in flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="label-mini">
            Konu {i + 1} / {topics.length}
          </span>
          <span className="text-xs text-muted">{seen.size} konu incelendi</span>
        </div>
        <h3 className="text-lg font-bold text-ink">{t.title}</h3>
        <p className="text-[15px] text-ink/85">{t.text}</p>
        {t.points && (
          <ul className="grid gap-2 sm:grid-cols-2">
            {t.points.map((p) => (
              <li key={p} className="flex gap-2 rounded-xl bg-page px-3 py-2 text-sm text-ink/90">
                <span className="mt-0.5 text-accent">▸</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        )}
        {t.callout && <Callout {...t.callout} />}
        <div className="mt-1 flex justify-between gap-2">
          <button className="btn-ghost" disabled={i === 0} onClick={() => go(i - 1)}>
            ← Önceki konu
          </button>
          <button className="btn-primary" disabled={i === topics.length - 1} onClick={() => go(i + 1)}>
            Sonraki konu →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Karşılaştırma kartları ---------- */
function Side({ s, tone }: { s: CompareSide; tone: "brand" | "accent" }) {
  const head = tone === "brand" ? "bg-brand" : "bg-accent";
  const txt = tone === "brand" ? "text-brand" : "text-accent";
  return (
    <div className="card overflow-hidden !p-0">
      <div className={`${head} px-5 py-4 text-white`}>
        <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{s.en}</p>
        <h3 className="text-lg font-bold">{s.title}</h3>
      </div>
      <div className="flex flex-col gap-3 p-5">
        <p className={`text-sm font-semibold ${txt}`}>{s.tagline}</p>
        <ul className="flex flex-col gap-2">
          {s.points.map((p) => (
            <li key={p} className="flex gap-2 text-sm text-ink/85">
              <span className={txt}>●</span>
              {p}
            </li>
          ))}
        </ul>
        <div className="rounded-xl bg-page p-3 text-sm text-ink/85">
          <span className="label-mini mb-1 block">Gerçek hayat karşılığı</span>
          {s.example}
        </div>
      </div>
    </div>
  );
}

export function CompareCards({ data }: { data: NonNullable<Lesson["compare"]> }) {
  return (
    <div>
      <p className="mb-4 text-sm font-semibold text-ink">{data.title}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <Side s={data.left} tone="brand" />
        <Side s={data.right} tone="accent" />
      </div>
    </div>
  );
}

/* ---------- Gerçek hayat örnekleri ---------- */
export function ExampleCards({ items }: { items: Lesson["examples"] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((e) => (
        <div key={e.title} className="card flex flex-col gap-2 border-l-4 !border-l-accent">
          <span className="w-fit rounded-full bg-soft px-2.5 py-0.5 text-xs font-semibold text-brand">{e.tag}</span>
          <h3 className="text-base font-bold text-ink">{e.title}</h3>
          <p className="text-sm text-ink/80">{e.text}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------- Önce tahmin et, sonra cevabı gör ---------- */
export function Predict({ data }: { data: Lesson["scenario"] }) {
  const [pick, setPick] = useState<number | null>(null);
  return (
    <div className="card flex flex-col gap-4">
      <div className="rounded-xl bg-soft p-4 text-sm text-ink/90">
        <span className="label-mini mb-1 block text-brand">Senaryo</span>
        {data.story}
      </div>
      <p className="font-semibold text-ink">{data.q}</p>
      <div className="grid gap-2">
        {data.options.map((o, i) => {
          const done = pick !== null;
          const right = i === data.answer;
          let cls = "border-line bg-white hover:bg-soft";
          if (done && right) cls = "border-ok bg-[#E9F5EF]";
          else if (done && pick === i) cls = "border-bad bg-[#FAEDED]";
          return (
            <button
              key={o}
              disabled={done}
              onClick={() => setPick(i)}
              className={`cursor-pointer rounded-xl border px-4 py-3 text-left text-sm transition ${cls}`}
            >
              <span className="mr-2 font-bold text-brand">{String.fromCharCode(65 + i)}.</span>
              {o}
            </button>
          );
        })}
      </div>
      {pick !== null && (
        <div className="fade-in">
          <Callout
            kind={pick === data.answer ? "recall" : "warning"}
            title={pick === data.answer ? "Doğru tahmin!" : "Cevabı birlikte inceleyelim"}
            text={data.explain}
          />
          <button className="btn-ghost mt-3" onClick={() => setPick(null)}>
            Tekrar dene
          </button>
        </div>
      )}
      {pick === null && <p className="text-xs text-muted">Önce tahmin et — cevap ve açıklama seçimden sonra görünür.</p>}
    </div>
  );
}

/* ---------- Yardımcılar (lablarda kullanılır) ---------- */
export function Accordion({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-line bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-sm font-semibold text-ink"
      >
        {title}
        <span className="text-brand">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="fade-in border-t border-line px-4 py-3 text-sm text-ink/85">{children}</div>}
    </div>
  );
}

export function Tabs({
  tabs,
  render,
}: {
  tabs: { id: string; label: string }[];
  render: (id: string) => ReactNode;
}) {
  const [a, setA] = useState(tabs[0].id);
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setA(t.id)} className={`chip ${a === t.id ? "chip-active" : ""}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div key={a} className="fade-in">
        {render(a)}
      </div>
    </div>
  );
}

export function LabFrame({
  children,
  note,
}: {
  children: ReactNode;
  note?: string;
}) {
  return (
    <div className="card flex flex-col gap-4 !bg-[#FCFEFF]">
      <div className="flex items-center gap-2 text-xs text-muted">
        <span className="rounded-full bg-ok/10 px-2.5 py-0.5 font-semibold text-ok">Güvenli Simülasyon</span>
        <span>{note ?? "Tarayıcı içinde çalışır; gerçek sisteme dokunmaz."}</span>
      </div>
      {children}
    </div>
  );
}

export function Feedback({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <div
      className={`fade-in rounded-xl border px-4 py-3 text-sm ${
        ok ? "border-ok/40 bg-[#E9F5EF] text-ink" : "border-bad/40 bg-[#FAEDED] text-ink"
      }`}
    >
      <span className={`mr-2 font-bold ${ok ? "text-ok" : "text-bad"}`}>{ok ? "Doğru" : "Yanlış"}</span>
      {children}
    </div>
  );
}
