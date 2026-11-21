import type { ButtonHTMLAttributes, ReactNode } from "react";
import { CheckCircle2, XCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "../utils/cn";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border border-line bg-card p-5 shadow-[0_1px_2px_rgba(23,43,58,0.04)] sm:p-6", className)}>{children}</div>;
}

type Variant = "primary" | "secondary" | "ghost" | "danger";

export function Btn({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const styles: Record<Variant, string> = {
    primary: "bg-brand text-white hover:bg-brand-dark disabled:bg-slate-300",
    secondary: "border border-line bg-white text-ink hover:border-brand hover:text-brand disabled:text-slate-400 disabled:hover:border-line",
    ghost: "text-brand hover:bg-soft disabled:text-slate-400",
    danger: "bg-bad text-white hover:bg-[#b04545]",
  };
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
        styles[variant],
        className
      )}
    />
  );
}

export function Badge({ children, tone = "brand", className }: { children: ReactNode; tone?: "brand" | "ok" | "warn" | "bad" | "muted"; className?: string }) {
  const tones = {
    brand: "bg-soft text-brand",
    ok: "bg-[#e6f4ed] text-ok",
    warn: "bg-[#fbf1dc] text-[#9a6b14]",
    bad: "bg-[#f8e7e7] text-bad",
    muted: "bg-slate-100 text-muted",
  };
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", tones[tone], className)}>{children}</span>;
}

export function Feedback({
  tone,
  title,
  children,
}: {
  tone: "ok" | "bad" | "info" | "warn";
  title?: string;
  children?: ReactNode;
}) {
  const map = {
    ok: { cls: "border-ok/30 bg-[#eef8f2]", icon: <CheckCircle2 className="h-5 w-5 text-ok" />, t: "text-ok" },
    bad: { cls: "border-bad/30 bg-[#fbeeee]", icon: <XCircle className="h-5 w-5 text-bad" />, t: "text-bad" },
    info: { cls: "border-brand/20 bg-soft", icon: <Info className="h-5 w-5 text-brand" />, t: "text-brand" },
    warn: { cls: "border-warn/40 bg-[#fdf6e7]", icon: <AlertTriangle className="h-5 w-5 text-warn" />, t: "text-[#9a6b14]" },
  }[tone];
  return (
    <div role="status" className={cn("fade-in flex gap-3 rounded-lg border p-3.5 text-sm", map.cls)}>
      <div className="mt-0.5 shrink-0">{map.icon}</div>
      <div className="min-w-0">
        {title && <div className={cn("font-semibold", map.t)}>{title}</div>}
        {children && <div className="text-ink/90">{children}</div>}
      </div>
    </div>
  );
}

export function SectionTitle({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-5">
      {eyebrow && <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">{eyebrow}</div>}
      <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">{title}</h2>
      {children && <p className="mt-1.5 max-w-2xl text-sm text-muted">{children}</p>}
    </div>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-soft", className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-gradient-to-r from-brand to-accent transition-all duration-500" style={{ width: `${value}%` }} />
    </div>
  );
}

export function Terminal({ children, title = "terminal", className }: { children: ReactNode; title?: string; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-[#223645] bg-[#0f1f2b] text-[#cfe3ec]", className)}>
      <div className="flex items-center gap-1.5 border-b border-[#223645] bg-[#152a38] px-3 py-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#c65353]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#d69a32]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#25845b]/80" />
        <span className="ml-2 font-mono text-xs text-[#7f9aab]">{title}</span>
      </div>
      <div className="p-3.5 font-mono text-[13px] leading-relaxed">{children}</div>
    </div>
  );
}

export function SimNote({ children }: { children?: ReactNode }) {
  return (
    <div className="flex gap-2 rounded-lg border border-dashed border-brand/30 bg-soft/60 px-3 py-2 text-xs text-muted">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
      <span>{children ?? "Bu uygulama eğitim amaçlı basitleştirilmiş bir simülasyondur; tamamen tarayıcınızda çalışır ve gerçek sisteminizde hiçbir değişiklik yapmaz."}</span>
    </div>
  );
}

export function LabShell({ done, title, children }: { done: boolean; title: string; children: ReactNode }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-ink">{title}</h3>
        {done ? (
          <Badge tone="ok">
            <CheckCircle2 className="h-3.5 w-3.5" /> Uygulama tamamlandı
          </Badge>
        ) : (
          <Badge tone="warn">Henüz tamamlanmadı</Badge>
        )}
      </div>
      {children}
    </div>
  );
}

export interface LabProps {
  done: boolean;
  onComplete: () => void;
}
