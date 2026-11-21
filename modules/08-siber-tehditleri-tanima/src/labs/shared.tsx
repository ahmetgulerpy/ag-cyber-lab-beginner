"use client";

import { useEffect, useRef, useState } from "react";
import { Card, Choice, Feedback } from "@/components/ui";

export type BinItem = { icon?: string; title: string; desc?: string; answer: boolean; why: string };

/** İki seçenekli (Evet/Hayır) geri bildirimli soru listesi */
export function BinaryList({
  items,
  trueLabel,
  falseLabel,
  onProgress,
}: {
  items: BinItem[];
  trueLabel: string;
  falseLabel: string;
  onProgress?: (answered: number, correct: number) => void;
}) {
  const [ans, setAns] = useState<Record<number, boolean>>({});
  const cb = useRef(onProgress);
  useEffect(() => {
    cb.current = onProgress;
  });
  const answered = Object.keys(ans).length;
  const correct = items.filter((it, i) => ans[i] === it.answer).length;
  useEffect(() => {
    cb.current?.(answered, correct);
  }, [answered, correct]);

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((it, i) => {
        const p = ans[i];
        const a = p !== undefined;
        const ok = p === it.answer;
        return (
          <Card key={i}>
            <div className="flex items-start gap-3">
              {it.icon && <span className="text-2xl" aria-hidden>{it.icon}</span>}
              <div>
                <p className="text-sm font-bold">{it.title}</p>
                {it.desc && <p className="mt-0.5 text-sm text-muted">{it.desc}</p>}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Choice disabled={a} selected={p === true} state={a && p === true ? (ok ? "correct" : "wrong") : "idle"} onClick={() => setAns({ ...ans, [i]: true })}>{trueLabel}</Choice>
              <Choice disabled={a} selected={p === false} state={a && p === false ? (ok ? "correct" : "wrong") : "idle"} onClick={() => setAns({ ...ans, [i]: false })}>{falseLabel}</Choice>
            </div>
            {a && <div className="mt-3"><Feedback ok={ok}>{it.why}</Feedback></div>}
          </Card>
        );
      })}
    </div>
  );
}

/** Basit SVG çizgi grafiği */
export function LineChart({
  series,
  height = 110,
  max,
  unit = "",
  title,
}: {
  series: { name: string; color: string; data: number[]; dashed?: boolean }[];
  height?: number;
  max?: number;
  unit?: string;
  title: string;
}) {
  const W = 300;
  const H = height;
  const m = max ?? Math.max(1, ...series.flatMap((s) => s.data));
  const n = 40;
  return (
    <div className="rounded-xl border border-line bg-white p-3">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-1">
        <p className="text-xs font-bold">{title}</p>
        <div className="flex flex-wrap gap-2 text-[10px] text-muted">
          {series.map((s) => (
            <span key={s.name} className="flex items-center gap-1"><i className="inline-block h-1.5 w-3 rounded" style={{ background: s.color }} />{s.name}</span>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={title}>
        {[0, 0.5, 1].map((g) => (
          <g key={g}>
            <line x1="0" x2={W} y1={H - g * (H - 6) - 3} y2={H - g * (H - 6) - 3} stroke="#DFE8ED" strokeWidth="1" />
          </g>
        ))}
        {series.map((s) => {
          const d = s.data.slice(-n);
          const pts = d.map((v, i) => `${(i / (n - 1)) * W},${H - 3 - (Math.min(v, m) / m) * (H - 6)}`).join(" ");
          return <polyline key={s.name} points={pts} fill="none" stroke={s.color} strokeWidth="2" strokeDasharray={s.dashed ? "4 3" : undefined} strokeLinejoin="round" />;
        })}
      </svg>
      <p className="text-right text-[10px] text-muted">üst sınır: {Math.round(m)}{unit}</p>
    </div>
  );
}
