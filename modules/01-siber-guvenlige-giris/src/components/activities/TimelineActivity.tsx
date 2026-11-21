"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import type { TimelineActivityDef } from "@/content/types";
import { btnSecondary } from "../ui";

export function TimelineActivity({ def, onComplete }: { def: TimelineActivityDef; onComplete: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());

  function select(i: number) {
    setSelected(i);
    const next = new Set(visited);
    next.add(def.events[i].id);
    setVisited(next);
    if (next.size === def.events.length) onComplete();
  }

  const ev = selected !== null ? def.events[selected] : null;

  return (
    <div>
      <h3 className="text-lg font-bold text-ink">{def.title}</h3>
      <p className="mt-1 max-w-prose text-sm leading-relaxed text-ink/80">{def.intro}</p>
      <p className="mt-3 inline-block rounded-full bg-soft px-3 py-1 text-sm font-semibold text-brand">
        {visited.size} / {def.events.length} olay incelendi
      </p>

      <div className="relative mt-4">
        <div className="absolute left-0 right-0 top-[22px] hidden h-px bg-line lg:block" aria-hidden />
        <ol className="relative grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {def.events.map((e, i) => {
            const isSel = selected === i;
            const isVisited = visited.has(e.id);
            return (
              <li key={e.id}>
                <button
                  onClick={() => select(i)}
                  aria-pressed={isSel}
                  className={`h-full w-full rounded-lg border p-3 text-left transition-colors ${isSel ? "border-brand bg-soft ring-1 ring-brand" : "border-line bg-white hover:border-brand"}`}
                >
                  <span className="flex items-center justify-between">
                    <span className="font-mono text-base font-bold text-brand">{e.year}</span>
                    {isVisited && <Check size={15} className="text-success" aria-label="İncelendi" />}
                  </span>
                  <span className="mt-1 block text-[13px] font-medium leading-snug text-ink">{e.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-5 rounded-xl border border-line bg-white p-4 sm:p-5" aria-live="polite">
        {ev ? (
          <>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-2xl font-bold text-brand">{ev.year}</span>
              <h4 className="text-base font-bold text-ink sm:text-lg">{ev.title}</h4>
            </div>
            <dl className="mt-4 grid gap-4 md:grid-cols-3">
              <div>
                <dt className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">Ne oldu?</dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink/90">{ev.what}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">Neden önemli?</dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink/90">{ev.why}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">Siber güvenliğe etkisi</dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink/90">{ev.impact}</dd>
              </div>
            </dl>
            <div className="mt-4 flex gap-2">
              <button className={btnSecondary} disabled={selected === 0} onClick={() => select((selected ?? 0) - 1)}>
                <ArrowLeft size={15} aria-hidden /> Önceki olay
              </button>
              <button
                className={btnSecondary}
                disabled={selected === def.events.length - 1}
                onClick={() => select((selected ?? 0) + 1)}
              >
                Sonraki olay <ArrowRight size={15} aria-hidden />
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted">Ayrıntıları görmek için yukarıdan bir olay seç.</p>
        )}
      </div>
      {visited.size === def.events.length && (
        <p className="mt-4 rounded-lg border border-success/30 bg-success-soft p-3.5 text-sm font-semibold text-success" aria-live="polite">
          Uygulama tamamlandı. Tüm olayları inceledin; istersen istediğin olaya geri dönüp tekrar okuyabilirsin.
        </p>
      )}
    </div>
  );
}
