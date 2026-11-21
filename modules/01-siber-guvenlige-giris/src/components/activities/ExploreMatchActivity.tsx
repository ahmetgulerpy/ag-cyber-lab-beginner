"use client";

import { useState } from "react";
import { Check, Eye } from "lucide-react";
import type { ExploreMatchActivityDef } from "@/content/types";
import { btnSecondary } from "../ui";
import { MatchActivity } from "./MatchActivity";

export function ExploreMatchActivity({ def, onComplete }: { def: ExploreMatchActivityDef; onComplete: () => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewed, setViewed] = useState<Set<string>>(new Set());
  const [matchDone, setMatchDone] = useState(false);
  const [showAnswer, setShowAnswer] = useState<Record<string, boolean>>({});

  const card = def.cards.find((c) => c.id === selectedId) ?? null;

  function select(id: string) {
    setSelectedId(id);
    const next = new Set(viewed);
    next.add(id);
    setViewed(next);
    if (matchDone && next.size === def.cards.length) onComplete();
  }

  function handleMatchDone() {
    setMatchDone(true);
    if (viewed.size === def.cards.length) onComplete();
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-ink">{def.title}</h3>
      <p className="mt-1 max-w-prose text-sm leading-relaxed text-ink/80">{def.intro}</p>

      <div className="mt-5">
        <div className="flex flex-wrap items-center gap-3">
          <h4 className="text-base font-bold text-ink">{def.cardsTitle}</h4>
          <span className="rounded-full bg-soft px-3 py-1 text-sm font-semibold text-brand">
            {viewed.size} / {def.cards.length} incelendi
          </span>
        </div>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
          {def.cards.map((c) => {
            const isSel = c.id === selectedId;
            return (
              <button
                key={c.id}
                onClick={() => select(c.id)}
                aria-pressed={isSel}
                className={`rounded-xl border p-4 text-left transition-colors ${isSel ? "border-brand bg-soft ring-1 ring-brand" : "border-line bg-white hover:border-brand"}`}
              >
                <span className="flex items-center justify-between">
                  <span className="text-base font-bold text-ink">{c.name}</span>
                  {viewed.has(c.id) && <Check size={16} className="text-success" aria-label="İncelendi" />}
                </span>
                {c.en && <span className="block font-mono text-[11px] text-muted">{c.en}</span>}
                <span className="mt-2 block text-sm leading-snug text-ink/80">{c.tagline}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 rounded-xl border border-line bg-white p-4 sm:p-5" aria-live="polite">
          {card ? (
            <>
              <h5 className="text-base font-bold text-ink">
                {card.name} {card.en && <span className="font-mono text-xs font-normal text-muted">· {card.en}</span>}
              </h5>
              <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-ink/90">
                {card.points.map((pt) => (
                  <li key={pt} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm leading-relaxed text-ink/90">
                <strong className="text-brand">Örnek:</strong> {card.example}
              </p>
              <div className="mt-4 rounded-lg border border-line bg-bg p-3.5">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">Mini senaryo</p>
                <p className="mt-1 text-sm leading-relaxed text-ink/90">{card.mini.story}</p>
                <p className="mt-1 text-sm font-semibold text-ink">{card.mini.question}</p>
                {showAnswer[card.id] ? (
                  <p className="mt-2 text-sm leading-relaxed text-ink/90">
                    <strong className="text-success">Cevap:</strong> {card.mini.answer}
                  </p>
                ) : (
                  <button
                    className={`${btnSecondary} mt-2`}
                    onClick={() => setShowAnswer({ ...showAnswer, [card.id]: true })}
                  >
                    <Eye size={15} aria-hidden /> Önce kendin düşün, sonra cevabı göster
                  </button>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted">Ayrıntıları görmek için yukarıdan bir kart seç.</p>
          )}
        </div>
      </div>

      <div className="mt-8 border-t border-line pt-6">
        <MatchActivity def={def.match} compact onComplete={handleMatchDone} />
      </div>
    </div>
  );
}
