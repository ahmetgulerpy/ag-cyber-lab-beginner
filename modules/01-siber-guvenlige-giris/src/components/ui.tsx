import type { ReactNode } from "react";
import { Terminal as TerminalIcon } from "lucide-react";
import type { Terminal } from "@/content/types";

export type Tone = "success" | "warn" | "danger" | "info" | "neutral";

export const toneBox: Record<Tone, string> = {
  success: "border-success/30 bg-success-soft text-ink",
  warn: "border-warn/40 bg-warn-soft text-ink",
  danger: "border-danger/30 bg-danger-soft text-ink",
  info: "border-brand/20 bg-soft text-ink",
  neutral: "border-line bg-white text-ink",
};

export const toneText: Record<Tone, string> = {
  success: "text-success",
  warn: "text-warn-ink",
  danger: "text-danger",
  info: "text-brand",
  neutral: "text-muted",
};

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-line bg-card ${className}`}>{children}</div>;
}

export function Badge({ children, tone = "info" }: { children: ReactNode; tone?: Tone }) {
  const cls: Record<Tone, string> = {
    success: "bg-success-soft text-success",
    warn: "bg-warn-soft text-warn-ink",
    danger: "bg-danger-soft text-danger",
    info: "bg-soft text-brand",
    neutral: "bg-slate-100 text-muted",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls[tone]}`}>
      {children}
    </span>
  );
}

export function SectionTitle({ eyebrow, title, id }: { eyebrow?: string; title: string; id?: string }) {
  return (
    <div className="mb-5" id={id}>
      {eyebrow && <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-widest text-accent">{eyebrow}</p>}
      <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">{title}</h2>
    </div>
  );
}

export function TerminalBlock({ terminal }: { terminal: Terminal }) {
  return (
    <div className="my-4 overflow-hidden rounded-lg border border-term-line bg-term font-mono text-[13px] leading-6 text-slate-200">
      <div className="flex items-center gap-2 border-b border-term-line px-3 py-1.5 text-xs text-slate-400">
        <TerminalIcon size={13} aria-hidden />
        <span>{terminal.title}</span>
      </div>
      <pre className="overflow-x-auto px-3 py-3 whitespace-pre">
        {terminal.lines.map((line, i) => (
          <span
            key={i}
            className={`block ${line.startsWith("#") ? "text-slate-500" : line.includes("FAILED") ? "text-red-300" : line.includes("SUCCESS") ? "text-emerald-300" : line.startsWith("$") ? "text-teal-200" : ""}`}
          >
            {line || " "}
          </span>
        ))}
      </pre>
    </div>
  );
}

export function ProgressBar({ value, tone = "brand" }: { value: number; tone?: "brand" | "success" }) {
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-soft"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-500 ${tone === "success" ? "bg-success" : "bg-brand"}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300";
export const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50";
