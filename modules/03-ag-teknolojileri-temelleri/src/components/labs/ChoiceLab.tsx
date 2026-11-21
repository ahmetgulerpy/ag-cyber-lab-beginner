"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Btn, Callout, Progress } from "@/components/ui";
import { markLab } from "@/lib/storage";

export type ChoiceItem = {
  prompt: ReactNode;
  options: string[];
  answer: number;
  why: string;
  extra?: ReactNode;
};

/** Senaryo → seçenek → açıklayıcı geri bildirim akışı (tekrar denenebilir). */
export function ChoiceLab({ id, items, intro }: { id: number; items: ChoiceItem[]; intro?: string }) {
  const [i, setI] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const item = items[i];

  const choose = (k: number) => {
    if (sel !== null) return;
    setSel(k);
    if (k === item.answer) setScore((s) => s + 1);
  };
  const next = () => {
    if (i + 1 >= items.length) {
      setDone(true);
      markLab(id);
    } else {
      setI(i + 1);
      setSel(null);
    }
  };
  const restart = () => {
    setI(0);
    setSel(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const pct = Math.round((score / items.length) * 100);
    return (
      <div className="space-y-3">
        <Callout kind={pct >= 70 ? "ok" : "warn"} title={`Sonuç: ${score}/${items.length} (%${pct})`}>
          {pct >= 70 ? "Harika! Kavramı iyi anlamışsın." : "Biraz daha pratik yapmak faydalı olur. Açıklamaları tekrar okuyup yeniden dene."}
        </Callout>
        <Btn onClick={restart}>↺ Yeniden Dene</Btn>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {intro && <p className="text-sm text-muted">{intro}</p>}
      <div className="flex items-center gap-3">
        <Progress value={((i + (sel !== null ? 1 : 0)) / items.length) * 100} className="flex-1" />
        <span className="text-sm font-semibold text-muted">
          {i + 1}/{items.length} · Puan {score}
        </span>
      </div>
      <div className="rounded-xl border border-line bg-white p-4 text-[15px] font-medium text-ink">{item.prompt}</div>
      <div className="grid gap-2 sm:grid-cols-2">
        {item.options.map((o, k) => {
          let cls = "border-line bg-white hover:bg-soft";
          if (sel !== null) {
            if (k === item.answer) cls = "border-ok bg-[#E9F5EF] text-ok";
            else if (k === sel) cls = "border-err bg-[#F9ECEC] text-err";
            else cls = "border-line bg-white opacity-60";
          }
          return (
            <button key={k} type="button" onClick={() => choose(k)} disabled={sel !== null} className={`min-h-[44px] rounded-xl border px-4 py-2 text-left text-sm font-semibold transition ${cls}`}>
              {o}
            </button>
          );
        })}
      </div>
      {sel !== null && (
        <div className="space-y-3">
          <Callout kind={sel === item.answer ? "ok" : "err"} title={sel === item.answer ? "Doğru!" : `Yanlış. Doğru cevap: ${item.options[item.answer]}`}>
            {item.why}
          </Callout>
          {item.extra}
          <Btn onClick={next}>{i + 1 >= items.length ? "Sonucu Gör" : "Sonraki →"}</Btn>
        </div>
      )}
    </div>
  );
}
