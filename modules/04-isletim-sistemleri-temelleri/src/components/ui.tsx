import type { ReactNode } from "react";

const TONES = {
  info: { bg: "#E8F3F7", bd: "#B9DBE6", fg: "#176B87", icon: "ℹ" },
  tip: { bg: "#E8F4EE", bd: "#BFE0CF", fg: "#25845B", icon: "✓" },
  warn: { bg: "#FBF3E3", bd: "#EBD3A0", fg: "#9A6A12", icon: "!" },
  danger: { bg: "#F9ECEC", bd: "#EBC4C4", fg: "#C65353", icon: "⚠" },
} as const;

export function Callout({ type = "info", title, children }: { type?: keyof typeof TONES; title?: string; children: ReactNode }) {
  const t = TONES[type];
  return (
    <div className="flex gap-3 rounded-xl border p-3 text-sm" style={{ background: t.bg, borderColor: t.bd }}>
      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold text-white" style={{ background: t.fg }}>{t.icon}</span>
      <div className="min-w-0 text-ink">
        {title && <p className="mb-0.5 font-bold" style={{ color: t.fg }}>{title}</p>}
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export function ProgressBar({ value, tone = "brand", h = 8 }: { value: number; tone?: "brand" | "ok" | "warn" | "bad" | "accent"; h?: number }) {
  const color = { brand: "#176B87", ok: "#25845B", warn: "#D69A32", bad: "#C65353", accent: "#38A3A5" }[tone];
  return (
    <div className="w-full overflow-hidden rounded-full bg-soft" style={{ height: h }}>
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} />
    </div>
  );
}

export function CodeBlock({ title, children }: { title?: string; children: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line">
      {title && <div className="border-b border-line bg-soft px-3 py-1.5 text-xs font-semibold text-brand">{title}</div>}
      <pre className="term m-0 overflow-x-auto rounded-none p-3" style={{ borderRadius: 0 }}>{children}</pre>
    </div>
  );
}

export function Window({ title, children, onClose, icon }: { title: string; children: ReactNode; onClose?: () => void; icon?: string }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-line bg-white shadow-lg">
      <div className="flex items-center justify-between border-b border-line bg-soft px-3 py-1.5">
        <span className="truncate text-xs font-semibold text-ink">{icon} {title}</span>
        {onClose && (
          <button aria-label="Pencereyi kapat" onClick={onClose} className="grid h-6 w-6 place-items-center rounded-md text-sm text-muted hover:bg-[#f2d4d4] hover:text-bad">✕</button>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </div>
  );
}

export function Tabs<T extends string>({ items, value, onChange }: { items: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="scroll-x flex gap-1 rounded-xl bg-soft p-1">
      {items.map((i) => (
        <button
          key={i.id}
          onClick={() => onChange(i.id)}
          className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold transition ${value === i.id ? "bg-white text-brand shadow-sm" : "text-muted hover:text-ink"}`}
        >
          {i.label}
        </button>
      ))}
    </div>
  );
}

export function Pill({ tone = "info", children }: { tone?: "info" | "ok" | "warn" | "bad" | "muted"; children: ReactNode }) {
  const m = {
    info: ["#E8F3F7", "#176B87"], ok: ["#E3F2EA", "#25845B"], warn: ["#FBF0DA", "#9A6A12"], bad: ["#F7E4E4", "#C65353"], muted: ["#EEF2F5", "#64748B"],
  }[tone];
  return <span className="inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: m[0], color: m[1] }}>{children}</span>;
}
