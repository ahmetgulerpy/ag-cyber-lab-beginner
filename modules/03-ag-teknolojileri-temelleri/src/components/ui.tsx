"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(23,43,58,0.04)] ${className}`}>{children}</div>;
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "soft" | "ghost" | "danger" | "ok" };

export function Btn({ variant = "primary", className = "", ...p }: BtnProps) {
  const v = {
    primary: "bg-brand text-white hover:bg-brand-dark",
    soft: "bg-soft text-brand hover:bg-[#d6eaf1]",
    ghost: "border border-line bg-white text-ink hover:bg-soft",
    danger: "bg-err text-white hover:bg-[#b24545]",
    ok: "bg-ok text-white hover:bg-[#1e6e4d]",
  }[variant];
  return (
    <button
      type="button"
      {...p}
      className={`inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${v} ${className}`}
    />
  );
}

export function Callout({ kind = "info", title, children }: { kind?: "info" | "ok" | "warn" | "err"; title?: string; children: ReactNode }) {
  const c = {
    info: "border-brand/20 bg-soft text-ink",
    ok: "border-ok/30 bg-[#E9F5EF] text-ink",
    warn: "border-warn/40 bg-[#FBF3E2] text-ink",
    err: "border-err/30 bg-[#F9ECEC] text-ink",
  }[kind];
  const t = { info: "text-brand", ok: "text-ok", warn: "text-[#9a6a14]", err: "text-err" }[kind];
  return (
    <div className={`fade-in rounded-xl border p-4 text-sm leading-relaxed ${c}`}>
      {title && <p className={`mb-1 font-bold ${t}`}>{title}</p>}
      <div>{children}</div>
    </div>
  );
}

export function Badge({ children, tone = "brand" }: { children: ReactNode; tone?: "brand" | "ok" | "warn" | "err" | "muted" }) {
  const c = {
    brand: "bg-soft text-brand",
    ok: "bg-[#E9F5EF] text-ok",
    warn: "bg-[#FBF3E2] text-[#9a6a14]",
    err: "bg-[#F9ECEC] text-err",
    muted: "bg-[#EEF2F5] text-muted",
  }[tone];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${c}`}>{children}</span>;
}

export function LabBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-brand/20 bg-gradient-to-b from-soft/70 to-white p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge>Sanal Laboratuvar</Badge>
        <h3 className="text-lg font-bold text-ink">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function Progress({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-[#E3ECF1] ${className}`} role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-gradient-to-r from-brand to-accent transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

/** Otomatik veya elle adım adım ilerleyen simülasyonlar için. */
export function useStepper(total: number, ms = 1000) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const active = playing && step < total;
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setStep((s) => Math.min(total, s + 1)), ms);
    return () => clearTimeout(t);
  }, [active, step, total, ms]);
  return {
    step,
    playing: active,
    next: () => {
      setPlaying(false);
      setStep((s) => Math.min(total, s + 1));
    },
    prev: () => {
      setPlaying(false);
      setStep((s) => Math.max(0, s - 1));
    },
    play: () => {
      setStep((s) => (s >= total ? 1 : Math.max(1, s)));
      setPlaying(true);
    },
    reset: () => {
      setPlaying(false);
      setStep(0);
    },
    set: (n: number) => setStep(n),
    pause: () => setPlaying(false),
  };
}

export function StepControls({
  s,
  total,
  startLabel = "Otomatik Oynat",
}: {
  s: ReturnType<typeof useStepper>;
  total: number;
  startLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {s.playing ? <Btn onClick={s.pause} variant="soft">⏸ Duraklat</Btn> : <Btn onClick={s.play}>▶ {startLabel}</Btn>}
      <Btn variant="ghost" onClick={s.prev} disabled={s.step === 0}>← Geri</Btn>
      <Btn variant="ghost" onClick={s.next} disabled={s.step >= total}>İleri →</Btn>
      <Btn variant="ghost" onClick={s.reset}>↺ Sıfırla</Btn>
      <span className="ml-auto text-sm font-semibold text-muted">
        Adım {s.step}/{total}
      </span>
    </div>
  );
}

/** 0..1 arası ilerleyen basit animasyon (paket hareketi için). */
export function useTween() {
  const [t, setT] = useState<number | null>(null);
  const raf = useRef(0);
  const run = useCallback(
    (ms: number) =>
      new Promise<void>((resolve) => {
        cancelAnimationFrame(raf.current);
        const start = performance.now();
        const tick = (now: number) => {
          const k = Math.min(1, (now - start) / ms);
          if (k < 1) {
            setT(k);
            raf.current = requestAnimationFrame(tick);
          } else {
            setT(null);
            resolve();
          }
        };
        raf.current = requestAnimationFrame(tick);
      }),
    [],
  );
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return { t, run };
}

export type Pt = { x: number; y: number };

export function pointAt(pts: Pt[], t: number): Pt {
  if (pts.length === 1) return pts[0];
  const lens: number[] = [];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const l = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
    lens.push(l);
    total += l;
  }
  let d = t * total;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i] || i === lens.length - 1) {
      const k = lens[i] === 0 ? 0 : Math.min(1, d / lens[i]);
      return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * k, y: pts[i].y + (pts[i + 1].y - pts[i].y) * k };
    }
    d -= lens[i];
  }
  return pts[pts.length - 1];
}

export function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

/** Basit cihaz ikonu (SVG, merkez noktası x,y). */
export function DeviceIcon({ kind, x, y, size = 44, color = "#176B87", fill = "#FFFFFF", dim = false }: { kind: string; x: number; y: number; size?: number; color?: string; fill?: string; dim?: boolean }) {
  const s = size;
  const h = s / 2;
  const common = { stroke: color, strokeWidth: 2, fill, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  return (
    <g transform={`translate(${x - h},${y - h})`} opacity={dim ? 0.4 : 1}>
      {kind === "pc" && (
        <>
          <rect x={s * 0.08} y={s * 0.1} width={s * 0.84} height={s * 0.55} rx={4} {...common} />
          <path d={`M${s * 0.35} ${s * 0.9}H${s * 0.65}M${s * 0.5} ${s * 0.65}V${s * 0.9}`} {...common} fill="none" />
        </>
      )}
      {kind === "laptop" && (
        <>
          <rect x={s * 0.15} y={s * 0.15} width={s * 0.7} height={s * 0.5} rx={3} {...common} />
          <path d={`M${s * 0.04} ${s * 0.82}H${s * 0.96}L${s * 0.85} ${s * 0.65}H${s * 0.15}Z`} {...common} />
        </>
      )}
      {kind === "phone" && (
        <>
          <rect x={s * 0.3} y={s * 0.05} width={s * 0.4} height={s * 0.9} rx={6} {...common} />
          <circle cx={s * 0.5} cy={s * 0.83} r={2} fill={color} />
        </>
      )}
      {kind === "server" && (
        <>
          <rect x={s * 0.12} y={s * 0.08} width={s * 0.76} height={s * 0.24} rx={4} {...common} />
          <rect x={s * 0.12} y={s * 0.38} width={s * 0.76} height={s * 0.24} rx={4} {...common} />
          <rect x={s * 0.12} y={s * 0.68} width={s * 0.76} height={s * 0.24} rx={4} {...common} />
          <circle cx={s * 0.24} cy={s * 0.2} r={2} fill={color} />
          <circle cx={s * 0.24} cy={s * 0.5} r={2} fill={color} />
          <circle cx={s * 0.24} cy={s * 0.8} r={2} fill={color} />
        </>
      )}
      {kind === "printer" && (
        <>
          <rect x={s * 0.25} y={s * 0.1} width={s * 0.5} height={s * 0.25} {...common} />
          <rect x={s * 0.08} y={s * 0.35} width={s * 0.84} height={s * 0.38} rx={5} {...common} />
          <rect x={s * 0.25} y={s * 0.6} width={s * 0.5} height={s * 0.3} {...common} />
        </>
      )}
      {kind === "switch" && (
        <>
          <rect x={s * 0.05} y={s * 0.3} width={s * 0.9} height={s * 0.4} rx={5} {...common} />
          {[0.2, 0.36, 0.52, 0.68, 0.84].map((p) => (
            <rect key={p} x={s * p - 3} y={s * 0.45} width={6} height={8} fill={color} stroke="none" />
          ))}
        </>
      )}
      {kind === "router" && (
        <>
          <rect x={s * 0.08} y={s * 0.45} width={s * 0.84} height={s * 0.35} rx={5} {...common} />
          <path d={`M${s * 0.25} ${s * 0.45}L${s * 0.15} ${s * 0.12}M${s * 0.75} ${s * 0.45}L${s * 0.85} ${s * 0.12}`} {...common} fill="none" />
          <circle cx={s * 0.25} cy={s * 0.62} r={2} fill={color} />
          <circle cx={s * 0.4} cy={s * 0.62} r={2} fill={color} />
        </>
      )}
      {kind === "modem" && (
        <>
          <rect x={s * 0.1} y={s * 0.4} width={s * 0.8} height={s * 0.4} rx={5} {...common} />
          <path d={`M${s * 0.3} ${s * 0.4}V${s * 0.15}`} {...common} fill="none" />
          <circle cx={s * 0.3} cy={s * 0.6} r={2} fill={color} />
          <circle cx={s * 0.45} cy={s * 0.6} r={2} fill={color} />
          <circle cx={s * 0.6} cy={s * 0.6} r={2} fill={color} />
        </>
      )}
      {kind === "ap" && (
        <>
          <ellipse cx={s * 0.5} cy={s * 0.72} rx={s * 0.4} ry={s * 0.16} {...common} />
          <path d={`M${s * 0.3} ${s * 0.45}A${s * 0.28} ${s * 0.28} 0 0 1 ${s * 0.7} ${s * 0.45}M${s * 0.18} ${s * 0.28}A${s * 0.45} ${s * 0.45} 0 0 1 ${s * 0.82} ${s * 0.28}`} {...common} fill="none" />
        </>
      )}
      {kind === "cloud" && (
        <path d={`M${s * 0.25} ${s * 0.75}A${s * 0.18} ${s * 0.18} 0 0 1 ${s * 0.22} ${s * 0.4}A${s * 0.25} ${s * 0.25} 0 0 1 ${s * 0.7} ${s * 0.32}A${s * 0.2} ${s * 0.2} 0 0 1 ${s * 0.78} ${s * 0.75}Z`} {...common} />
      )}
      {kind === "node" && <circle cx={s * 0.5} cy={s * 0.5} r={s * 0.34} {...common} />}
      {kind === "dot" && <circle cx={s * 0.5} cy={s * 0.5} r={s * 0.12} fill={color} stroke="none" />}
    </g>
  );
}
