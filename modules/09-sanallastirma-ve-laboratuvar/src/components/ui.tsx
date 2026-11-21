import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`card ${className}`}>{children}</div>;
}

const CALLOUT = {
  info: { bar: "border-ag-brand", bg: "bg-ag-light", icon: "ℹ️", t: "text-ag-brand" },
  tip: { bar: "border-ag-accent", bg: "bg-[#eaf7f6]", icon: "💡", t: "text-[#217a7c]" },
  warn: { bar: "border-ag-warn", bg: "bg-[#fff8e8]", icon: "⚠️", t: "text-[#8a5f12]" },
  err: { bar: "border-ag-err", bg: "bg-[#fdf0f0]", icon: "⛔", t: "text-ag-err" },
  ok: { bar: "border-ag-ok", bg: "bg-[#edf8f2]", icon: "✅", t: "text-ag-ok" },
} as const;

export function Callout({ kind = "info", title, children }: { kind?: keyof typeof CALLOUT; title?: string; children: ReactNode }) {
  const c = CALLOUT[kind];
  return (
    <div className={`rounded-xl border-l-4 ${c.bar} ${c.bg} px-4 py-3 text-sm leading-relaxed`}>
      {title && (
        <p className={`mb-1 font-bold ${c.t}`}>
          <span aria-hidden>{c.icon} </span>
          {title}
        </p>
      )}
      <div className="text-ag-text">{children}</div>
    </div>
  );
}

export function SectionTitle({ kicker, title, children }: { kicker?: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-4">
      {kicker && <p className="text-xs font-bold uppercase tracking-widest text-ag-accent">{kicker}</p>}
      <h2 className="text-xl font-bold text-ag-text sm:text-2xl">{title}</h2>
      {children && <p className="mt-1 text-sm text-ag-muted">{children}</p>}
    </div>
  );
}

export function InfoCards({ items, cols = 3 }: { items: { icon?: string; title: string; body: string; bullets?: string[] }[]; cols?: 2 | 3 | 4 }) {
  const grid = cols === 2 ? "sm:grid-cols-2" : cols === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid gap-3 ${grid}`}>
      {items.map((it) => (
        <div key={it.title} className="card !p-4">
          <div className="mb-2 flex items-center gap-2">
            {it.icon && (
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ag-light text-base" aria-hidden>
                {it.icon}
              </span>
            )}
            <h3 className="text-sm font-bold text-ag-text">{it.title}</h3>
          </div>
          <p className="text-sm leading-relaxed text-ag-muted">{it.body}</p>
          {it.bullets && (
            <ul className="mt-2 space-y-1 text-sm text-ag-text">
              {it.bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="text-ag-accent">▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export function DataTable({ head, rows, firstColBold = true }: { head: string[]; rows: string[][]; firstColBold?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-ag-line bg-white">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead className="bg-ag-light text-ag-brand">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-3 py-2.5 font-bold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-ag-line align-top">
              {r.map((c, j) => (
                <td key={j} className={`px-3 py-2.5 ${j === 0 && firstColBold ? "font-semibold text-ag-text" : "text-ag-muted"}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-ag-brand underline decoration-ag-accent/50 underline-offset-2 hover:text-ag-accent">
      {children} <span aria-hidden>↗</span>
    </a>
  );
}

export function ProgressBar({ pct, tone = "brand" }: { pct: number; tone?: "brand" | "ok" | "warn" | "err" }) {
  const c = { brand: "bg-ag-brand", ok: "bg-ag-ok", warn: "bg-ag-warn", err: "bg-ag-err" }[tone];
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-ag-light" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full rounded-full ${c} transition-all duration-500`} style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
    </div>
  );
}

export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-sm text-ag-text">
      {items.map((b) => (
        <li key={b} className="flex gap-2">
          <span className="mt-0.5 text-ag-accent">▸</span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

export function Notice() {
  return (
    <Callout kind="warn" title="Gerçek kurulumu sen yaparsın">
      Bu eğitim platformu bilgisayarına yazılım kurmaz, ayarlarını değiştirmez ve dosyalarına erişmez. Tüm kurulumları kendi bilgisayarında, kendi kontrolünle yaparsın. Yalnızca kendi laboratuvarında ve yetkin olduğun sistemlerde test yap.
    </Callout>
  );
}
