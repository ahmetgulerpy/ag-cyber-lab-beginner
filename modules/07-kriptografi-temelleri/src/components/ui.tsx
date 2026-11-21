"use client";

import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";

export const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(" ");

export type ReflectionData = { did: string; learned: string; why: string; real: string };

export function Card({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cx("rounded-2xl border border-line bg-card p-5 shadow-[0_1px_2px_rgba(23,43,58,0.04)] sm:p-6", className)}>
      {children}
    </section>
  );
}

export function SectionHead({ step, title, sub, id }: { step?: string; title: string; sub?: string; id?: string }) {
  return (
    <div id={id} className="mb-5 scroll-mt-24">
      {step && <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-accent">{step}</p>}
      <h2 className="text-xl font-semibold text-ink sm:text-2xl">{title}</h2>
      {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
    </div>
  );
}

const calloutStyle = {
  info: "border-brand/30 bg-soft",
  warn: "border-warn/50 bg-[#FBF3E1]",
  danger: "border-bad/40 bg-[#F9E8E8]",
  ok: "border-ok/40 bg-[#E6F3EC]",
} as const;
const calloutIcon = { info: "ℹ️", warn: "⚠️", danger: "🛑", ok: "✅" } as const;

export function Callout({ kind = "info", title, children }: { kind?: keyof typeof calloutStyle; title?: string; children: ReactNode }) {
  return (
    <div className={cx("rounded-xl border p-4 text-sm leading-relaxed", calloutStyle[kind])}>
      {title && (
        <p className="mb-1 font-semibold text-ink">
          <span aria-hidden className="mr-1.5">
            {calloutIcon[kind]}
          </span>
          {title}
        </p>
      )}
      <div className="text-ink/90">{children}</div>
    </div>
  );
}

export function Button({ variant = "primary", className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "ghost" }) {
  const v = {
    primary: "bg-brand text-white hover:bg-[#125870] disabled:bg-brand/40",
    secondary: "border border-line bg-white text-ink hover:border-brand hover:text-brand disabled:text-muted/60",
    danger: "bg-bad text-white hover:bg-[#b24545] disabled:bg-bad/40",
    ghost: "text-brand hover:bg-soft disabled:text-muted/60",
  }[variant];
  return <button type="button" {...p} className={cx("inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors", v, className)} />;
}

export const inputCls =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-accent/30";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function CopyBtn({ value }: { value: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setOk(true);
          setTimeout(() => setOk(false), 1200);
        } catch {
          /* pano erişimi yok */
        }
      }}
      className="rounded-md border border-line bg-white px-2 py-0.5 text-xs text-muted hover:border-brand hover:text-brand"
    >
      {ok ? "Kopyalandı" : "Kopyala"}
    </button>
  );
}

const toneCls = {
  neutral: "border-line bg-bg",
  ok: "border-ok/40 bg-[#E6F3EC]",
  bad: "border-bad/40 bg-[#F9E8E8]",
  warn: "border-warn/50 bg-[#FBF3E1]",
  brand: "border-brand/30 bg-soft",
} as const;

export function OutBox({ label, value, tone = "neutral", mono = true, copy = true, empty = "—", badge }: { label: string; value?: string; tone?: keyof typeof toneCls; mono?: boolean; copy?: boolean; empty?: string; badge?: string }) {
  return (
    <div className={cx("rounded-xl border p-3", toneCls[tone])}>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {label}
          {badge && <span className="ml-2 rounded bg-white px-1.5 py-0.5 text-[10px] normal-case text-brand">{badge}</span>}
        </p>
        {copy && value ? <CopyBtn value={value} /> : null}
      </div>
      <p className={cx("whitespace-pre-wrap break-all text-sm text-ink", mono && "hexbox")}>{value || <span className="text-muted">{empty}</span>}</p>
    </div>
  );
}

export function Pill({ tone = "neutral", children }: { tone?: "neutral" | "ok" | "bad" | "warn" | "brand"; children: ReactNode }) {
  const t = {
    neutral: "bg-bg text-muted border-line",
    ok: "bg-[#E6F3EC] text-ok border-ok/30",
    bad: "bg-[#F9E8E8] text-bad border-bad/30",
    warn: "bg-[#FBF3E1] text-[#8a6218] border-warn/40",
    brand: "bg-soft text-brand border-brand/20",
  }[tone];
  return <span className={cx("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", t)}>{children}</span>;
}

export function Reflection({ r, done }: { r: ReflectionData; done: boolean }) {
  const items: [string, string, string][] = [
    ["Ne yaptım?", r.did, "🧪"],
    ["Ne öğrendim?", r.learned, "💡"],
    ["Sonuç neden böyle oluştu?", r.why, "🔍"],
    ["Gerçek hayatta nerede kullanılır?", r.real, "🌍"],
  ];
  return (
    <details key={String(done)} open={done} className="rounded-xl border border-line bg-bg p-4">
      <summary className="text-sm font-semibold text-brand">Uygulama sonu değerlendirmesi {done ? "— tamamlandı ✓" : "(uygulamayı denedikten sonra oku)"}</summary>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map(([t, text, ic]) => (
          <div key={t} className="rounded-lg border border-line bg-white p-3">
            <p className="mb-1 text-sm font-semibold text-ink">
              <span aria-hidden>{ic} </span>
              {t}
            </p>
            <p className="text-sm text-muted">{text}</p>
          </div>
        ))}
      </div>
    </details>
  );
}

export function LabFrame({ badge, title, intro, children, reflection, done }: { badge: string; title: string; intro: string; children: ReactNode; reflection?: ReflectionData; done: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-brand/25 bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-brand px-5 py-3 text-white">
        <div className="flex items-center gap-2">
          <span className="rounded bg-white/15 px-2 py-0.5 text-xs font-semibold tracking-wider">{badge}</span>
          <h3 className="text-base font-semibold sm:text-lg">{title}</h3>
        </div>
        <span className={cx("rounded-full px-2.5 py-0.5 text-xs font-medium", done ? "bg-white text-ok" : "bg-white/15 text-white")}>{done ? "✓ Tamamlandı" : "Devam ediyor"}</span>
      </div>
      <div className="space-y-5 p-5 sm:p-6">
        <p className="text-sm text-muted">{intro}</p>
        {children}
        {reflection && <Reflection r={reflection} done={done} />}
      </div>
    </div>
  );
}

export function Steps({ items }: { items: string[] }) {
  return (
    <ol className="space-y-2">
      {items.map((t, i) => (
        <li key={i} className="flex gap-3 text-sm">
          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-xs font-semibold text-white">{i + 1}</span>
          <span className="text-ink/90">{t}</span>
        </li>
      ))}
    </ol>
  );
}
