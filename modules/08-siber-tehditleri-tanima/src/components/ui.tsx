"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export type Tone = "brand" | "ok" | "warn" | "bad" | "muted" | "soft";

const toneBox: Record<Tone, string> = {
  brand: "bg-soft border-brand/25 text-ink",
  ok: "bg-ok/10 border-ok/30 text-ink",
  warn: "bg-warn/10 border-warn/40 text-ink",
  bad: "bg-bad/10 border-bad/30 text-ink",
  muted: "bg-page border-line text-ink",
  soft: "bg-soft border-line text-ink",
};

const toneBadge: Record<Tone, string> = {
  brand: "bg-brand/10 text-brand",
  ok: "bg-ok/10 text-ok",
  warn: "bg-warn/15 text-[#9a6a14]",
  bad: "bg-bad/10 text-bad",
  muted: "bg-line text-muted",
  soft: "bg-soft text-brand",
};

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-card p-4 shadow-sm sm:p-5 ${className}`}>{children}</div>;
}

export function Badge({ tone = "brand", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${toneBadge[tone]}`}>
      {children}
    </span>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
};

export function Btn({ variant = "primary", size = "md", className = "", ...rest }: BtnProps) {
  const v = {
    primary: "bg-brand text-white hover:bg-[#125a73] disabled:bg-brand/40",
    secondary: "bg-soft text-brand border border-brand/20 hover:bg-[#d9ebf2] disabled:opacity-50",
    ghost: "bg-transparent text-muted hover:bg-soft hover:text-brand border border-line disabled:opacity-50",
    danger: "bg-bad text-white hover:bg-[#b04545] disabled:opacity-50",
  }[variant];
  const s = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm";
  return (
    <button
      type="button"
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors ${v} ${s} ${className}`}
    />
  );
}

export function InfoBox({
  tone = "brand",
  title,
  icon,
  children,
  className = "",
}: {
  tone?: Tone;
  title?: string;
  icon?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border p-3.5 text-sm leading-relaxed ${toneBox[tone]} ${className}`}>
      {title && (
        <p className="mb-1 flex items-center gap-1.5 font-semibold">
          {icon && <span aria-hidden>{icon}</span>}
          {title}
        </p>
      )}
      <div className="text-[#2c4152]">{children}</div>
    </div>
  );
}

export function ProgressBar({ value, tone = "brand", className = "" }: { value: number; tone?: Tone; className?: string }) {
  const color = tone === "ok" ? "bg-ok" : tone === "warn" ? "bg-warn" : tone === "bad" ? "bg-bad" : "bg-brand";
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-line ${className}`} role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  variant = "main",
}: {
  tabs: { id: T; label: string; icon?: string; badge?: string }[];
  value: T;
  onChange: (id: T) => void;
  variant?: "main" | "pill";
}) {
  if (variant === "pill") {
    return (
      <div className="flex flex-wrap gap-2" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={value === t.id}
            onClick={() => onChange(t.id)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
              value === t.id ? "border-brand bg-brand text-white" : "border-line bg-card text-muted hover:border-brand/40 hover:text-brand"
            }`}
          >
            {t.icon && <span className="mr-1" aria-hidden>{t.icon}</span>}
            {t.label}
            {t.badge && <span className="ml-1.5 opacity-80">{t.badge}</span>}
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className="-mx-1 overflow-x-auto px-1" role="tablist">
      <div className="flex min-w-max gap-1 border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={value === t.id}
            onClick={() => onChange(t.id)}
            className={`-mb-px flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3.5 py-2.5 text-sm font-semibold transition-colors ${
              value === t.id ? "border-brand text-brand" : "border-transparent text-muted hover:text-brand"
            }`}
          >
            {t.icon && <span aria-hidden>{t.icon}</span>}
            {t.label}
            {t.badge && <span className="rounded-full bg-ok/10 px-1.5 text-[11px] text-ok">{t.badge}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Seçenek butonu (doğru / yanlış durumlarını gösterir) */
export function Choice({
  children,
  state = "idle",
  selected = false,
  disabled,
  onClick,
}: {
  children: ReactNode;
  state?: "idle" | "correct" | "wrong" | "missed";
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const cls =
    state === "correct"
      ? "border-ok bg-ok/10"
      : state === "wrong"
        ? "border-bad bg-bad/10"
        : state === "missed"
          ? "border-ok border-dashed bg-ok/5"
          : selected
            ? "border-brand bg-soft"
            : "border-line bg-card hover:border-brand/50 hover:bg-soft/60";
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors disabled:cursor-default ${cls}`}
    >
      <span className="flex items-start gap-2">
        <span className="flex-1">{children}</span>
        {state === "correct" && <span className="text-ok" aria-label="doğru">✓</span>}
        {state === "wrong" && <span className="text-bad" aria-label="yanlış">✗</span>}
      </span>
    </button>
  );
}

export function Feedback({ ok, title, children }: { ok: boolean | null; title?: string; children: ReactNode }) {
  const tone: Tone = ok === null ? "warn" : ok ? "ok" : "bad";
  return (
    <div className="ag-fade">
      <InfoBox tone={tone} title={title ?? (ok === null ? "Dikkat" : ok ? "Doğru karar!" : "Bu seçim riskli / yanlış")} icon={ok === null ? "⚠️" : ok ? "✅" : "❌"}>
        {children}
      </InfoBox>
    </div>
  );
}

/** Her laboratuvarın dış çerçevesi */
export function LabPanel({
  title,
  intro,
  done,
  children,
}: {
  title: string;
  intro: string;
  done?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-ink">{title}</h3>
          <p className="mt-1 max-w-3xl text-sm text-muted">{intro}</p>
        </div>
        {done ? <Badge tone="ok">✓ Laboratuvar tamamlandı</Badge> : <Badge tone="warn">Devam ediyor</Badge>}
      </div>
      <InfoBox tone="muted" icon="🛡️" title="Güvenli simülasyon">
        Bu laboratuvar yalnızca tarayıcında çalışır; tüm veriler sentetiktir. Hiçbir ağa istek gönderilmez, gerçek veri kaydedilmez.
      </InfoBox>
      {children}
    </div>
  );
}

export function Stat({ label, value, tone = "brand", sub }: { label: string; value: ReactNode; tone?: Tone; sub?: string }) {
  const c = tone === "ok" ? "text-ok" : tone === "bad" ? "text-bad" : tone === "warn" ? "text-[#9a6a14]" : "text-brand";
  return (
    <div className="rounded-xl border border-line bg-page p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className={`mt-0.5 text-xl font-bold ${c}`}>{value}</p>
      {sub && <p className="text-[11px] text-muted">{sub}</p>}
    </div>
  );
}

export function shuffle<T>(arr: T[], seed = 1): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
