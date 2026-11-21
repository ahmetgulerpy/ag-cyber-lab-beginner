"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { EcosystemActivityDef } from "@/content/types";

export function EcosystemActivity({ def, onComplete }: { def: EcosystemActivityDef; onComplete: () => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());

  const n = def.actors.length;
  const pos = def.actors.map((_, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: 50 + Math.cos(angle) * 37, y: 50 + Math.sin(angle) * 37 };
  });
  const posById = new Map(def.actors.map((a, i) => [a.id, pos[i]]));
  const selected = def.actors.find((a) => a.id === selectedId) ?? null;
  const relatedIds = new Set(selected?.relations.map((r) => r.to) ?? []);

  function select(id: string) {
    setSelectedId(id);
    const next = new Set(visited);
    next.add(id);
    setVisited(next);
    if (next.size === def.actors.length) onComplete();
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-ink">{def.title}</h3>
      <p className="mt-1 max-w-prose text-sm leading-relaxed text-ink/80">{def.intro}</p>
      <p className="mt-3 inline-block rounded-full bg-soft px-3 py-1 text-sm font-semibold text-brand">
        {visited.size} / {n} aktör incelendi
      </p>

      <div className="mt-4 grid gap-5 lg:grid-cols-2">
        <div className="grid-lines relative mx-auto aspect-square w-full max-w-[520px] rounded-xl border border-line bg-white">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
            {pos.map((p, i) => (
              <line key={`s${i}`} x1="50" y1="50" x2={p.x} y2={p.y} stroke="#DFE8ED" strokeWidth="0.4" />
            ))}
            {selected &&
              selected.relations.map((r) => {
                const from = posById.get(selected.id);
                const to = posById.get(r.to);
                if (!from || !to) return null;
                return (
                  <line
                    key={r.to}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="#176B87"
                    strokeWidth="0.7"
                    strokeDasharray="1.6 1.2"
                  />
                );
              })}
          </svg>
          <div
            className="absolute left-1/2 top-1/2 flex h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brand/30 bg-soft p-1.5 text-center text-[10px] font-semibold leading-tight text-brand sm:text-xs"
          >
            {def.center}
          </div>
          {def.actors.map((a, i) => {
            const isSel = a.id === selectedId;
            const isRel = relatedIds.has(a.id);
            return (
              <button
                key={a.id}
                onClick={() => select(a.id)}
                aria-pressed={isSel}
                style={{ left: `${pos[i].x}%`, top: `${pos[i].y}%` }}
                className={`absolute flex w-[27%] -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-lg border px-1 py-1.5 text-center text-[10.5px] font-semibold leading-tight shadow-sm transition-colors sm:px-2 sm:py-2 sm:text-xs ${isSel ? "border-brand bg-brand text-white" : isRel ? "border-brand bg-soft text-brand" : "border-line bg-white text-ink hover:border-brand"}`}
              >
                {a.short}
                {visited.has(a.id) && (
                  <Check size={12} className={isSel ? "text-white" : "text-success"} aria-label="İncelendi" />
                )}
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-line bg-white p-4 sm:p-5" aria-live="polite">
          {selected ? (
            <>
              <h4 className="text-base font-bold text-ink sm:text-lg">{selected.name}</h4>
              {selected.en && <p className="font-mono text-xs text-muted">{selected.en}</p>}
              <p className="mt-3 text-sm leading-relaxed text-ink/90">{selected.role}</p>
              <h5 className="mt-4 font-mono text-xs font-semibold uppercase tracking-wider text-accent">Görev ve sorumluluklar</h5>
              <ul className="mt-1.5 space-y-1.5 text-sm leading-relaxed text-ink/90">
                {selected.responsibilities.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
              <h5 className="mt-4 font-mono text-xs font-semibold uppercase tracking-wider text-accent">Diğer aktörlerle ilişkisi</h5>
              <ul className="mt-1.5 space-y-2 text-sm leading-relaxed text-ink/90">
                {selected.relations.map((r) => {
                  const target = def.actors.find((a) => a.id === r.to);
                  return (
                    <li key={r.to}>
                      <button className="font-semibold text-brand underline-offset-2 hover:underline" onClick={() => select(r.to)}>
                        {target?.short ?? r.to}
                      </button>
                      <span className="text-ink/80"> — {r.text}</span>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <p className="text-sm text-muted">Haritadan bir aktör seçerek görevlerini ve ilişkilerini incele.</p>
          )}
        </div>
      </div>
      {visited.size === n && (
        <p className="mt-4 rounded-lg border border-success/30 bg-success-soft p-3.5 text-sm font-semibold text-success" aria-live="polite">
          Uygulama tamamlandı. Tüm aktörleri inceledin; ilişkileri istediğin kadar tekrar gezebilirsin.
        </p>
      )}
    </div>
  );
}
