"use client";

import { Fragment, useState, type ReactNode } from "react";

export const inputCls =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

export function Rich({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("`") && p.endsWith("`") && p.length > 2)
          return (
            <code
              key={i}
              className="rounded bg-soft px-1.5 py-0.5 font-mono text-[0.85em] text-brand"
            >
              {p.slice(1, -1)}
            </code>
          );
        if (p.startsWith("**") && p.endsWith("**") && p.length > 4)
          return (
            <strong key={i} className="font-semibold text-ink">
              {p.slice(2, -2)}
            </strong>
          );
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}

export function Btn({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
  className = "",
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
  title?: string;
}) {
  const styles = {
    primary: "bg-brand text-white hover:bg-[#135a73]",
    secondary: "border border-line bg-white text-ink hover:bg-soft",
    ghost: "text-brand hover:bg-soft",
    danger: "bg-err text-white hover:bg-[#b04545]",
    success: "bg-ok text-white hover:bg-[#1e6e4b]",
  }[variant];
  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function Badge({
  tone = "info",
  children,
}: {
  tone?: "info" | "ok" | "warn" | "err" | "muted";
  children: ReactNode;
}) {
  const t = {
    info: "bg-soft text-brand",
    ok: "bg-[#e3f3ec] text-ok",
    warn: "bg-[#faf0dc] text-[#9a6b14]",
    err: "bg-[#f8e5e5] text-err",
    muted: "bg-slate-100 text-muted",
  }[tone];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${t}`}>
      {children}
    </span>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-line bg-card p-5 shadow-[0_1px_2px_rgba(23,43,58,0.04)] sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

export function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-[#e3ebf0] ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand to-accent transition-all duration-500"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function CodeBlock({
  code,
  title,
  active,
  className = "",
}: {
  code: string;
  title?: string;
  active?: number | null;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");
  return (
    <div className={`overflow-hidden rounded-xl border border-[#1f3a4d] bg-[#172b3a] ${className}`}>
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-err/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-warn/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-ok/80" />
          {title && <span className="ml-2 font-mono text-xs text-slate-300">{title}</span>}
        </div>
        <button
          type="button"
          className="rounded px-2 py-0.5 text-xs text-slate-300 hover:bg-white/10"
          onClick={() => {
            navigator.clipboard
              ?.writeText(code)
              .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
              })
              .catch(() => {});
          }}
        >
          {copied ? "Kopyalandı" : "Kopyala"}
        </button>
      </div>
      <pre className="scroll-thin overflow-x-auto py-3 font-mono text-[13px] leading-6 text-slate-100">
        {lines.map((l, i) => (
          <div
            key={i}
            className={`flex px-4 ${active === i ? "bg-accent/25 shadow-[inset_3px_0_0_#38a3a5]" : ""}`}
          >
            <span className="mr-4 w-5 shrink-0 select-none text-right text-slate-500">{i + 1}</span>
            <span className="whitespace-pre">{l || " "}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

export function Terminal({
  children,
  title = "terminal",
  className = "",
}: {
  children: ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-xl border border-[#1f3a4d] bg-[#172b3a] ${className}`}>
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-err/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-warn/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-ok/80" />
        <span className="ml-2 font-mono text-xs text-slate-300">{title}</span>
        <span className="ml-auto rounded bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
          simülasyon
        </span>
      </div>
      {children}
    </div>
  );
}

export function LabNote({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-soft px-3 py-2 text-xs leading-5 text-[#2d5566]">
      {children}
    </div>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <label className="mb-1 block text-xs font-medium text-muted">{children}</label>;
}

export type Step = {
  line: number;
  vars: Record<string, string | undefined>;
  out?: string;
  note: string;
  phase?: "Girdi" | "İşlem" | "Çıktı";
};

export function TraceViewer({
  code,
  steps,
  onDone,
  title = "program.py",
}: {
  code: string;
  steps: Step[];
  onDone?: () => void;
  title?: string;
}) {
  const [idx, setIdx] = useState(-1);
  const cur = idx >= 0 ? steps[idx] : null;
  const outputs = steps
    .slice(0, idx + 1)
    .filter((s) => s.out !== undefined)
    .map((s) => s.out as string);
  const hasPhases = steps.some((s) => s.phase);

  const go = (n: number) => {
    const c = Math.max(-1, Math.min(steps.length - 1, n));
    setIdx(c);
    if (c === steps.length - 1 && steps.length > 0) onDone?.();
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-3">
        <CodeBlock code={code} title={title} active={cur ? cur.line : null} />
        <div className="flex flex-wrap items-center gap-2">
          <Btn onClick={() => go(idx + 1)} disabled={idx >= steps.length - 1}>
            Sonraki adım →
          </Btn>
          <Btn variant="secondary" onClick={() => go(idx - 1)} disabled={idx < 0}>
            ← Geri
          </Btn>
          <Btn variant="secondary" onClick={() => go(steps.length - 1)} disabled={steps.length === 0}>
            Tümünü çalıştır
          </Btn>
          <Btn variant="ghost" onClick={() => go(-1)}>
            Sıfırla
          </Btn>
          <span className="ml-auto text-xs text-muted">
            Adım {Math.max(idx + 1, 0)} / {steps.length}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {hasPhases && (
          <div className="grid grid-cols-3 gap-2">
            {(["Girdi", "İşlem", "Çıktı"] as const).map((p, i) => {
              const on = cur?.phase === p;
              return (
                <div
                  key={p}
                  className={`relative rounded-lg border px-3 py-2 text-center text-sm font-medium transition ${
                    on ? "border-brand bg-brand text-white" : "border-line bg-white text-muted"
                  }`}
                >
                  <span className="block text-[10px] uppercase tracking-wide opacity-70">
                    {i + 1}. aşama
                  </span>
                  {p}
                </div>
              );
            })}
          </div>
        )}

        <div className="min-h-[64px] rounded-lg border border-line bg-soft px-3 py-2.5 text-sm leading-6 text-[#2d5566]">
          {cur ? <Rich text={cur.note} /> : "Başlamak için “Sonraki adım” düğmesine basın. Her adımda çalışan satır vurgulanır."}
        </div>

        <div className="overflow-hidden rounded-lg border border-line">
          <div className="bg-slate-50 px-3 py-1.5 text-xs font-medium text-muted">
            Değişkenler (Variables)
          </div>
          {cur && Object.keys(cur.vars).length > 0 ? (
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(cur.vars).map(([k, v]) => (
                  <tr key={k} className="border-t border-line">
                    <td className="px-3 py-1.5 font-mono text-brand">{k}</td>
                    <td className="px-3 py-1.5 font-mono">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-3 py-3 text-sm text-muted">Henüz değişken yok.</div>
          )}
        </div>

        <div className="rounded-lg bg-[#172b3a] p-3 font-mono text-[13px] text-slate-100">
          <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-400">Çıktı</div>
          {outputs.length ? outputs.map((o, i) => <div key={i}>{o}</div>) : <span className="text-slate-500">—</span>}
        </div>
      </div>
    </div>
  );
}
