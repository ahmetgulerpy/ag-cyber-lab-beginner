"use client";

import { useState } from "react";
import { CheckCircle2, Lightbulb, RotateCcw, XCircle } from "lucide-react";
import type { MatchActivityDef } from "@/content/types";
import { btnSecondary, toneBox } from "../ui";

interface Result {
  chosen: string;
  correct: boolean;
}

interface Props {
  def: MatchActivityDef;
  onComplete?: () => void;
  /** Başlık ve giriş metnini gizle (başka bir uygulamanın parçası olarak gösterilirse) */
  compact?: boolean;
}

export function MatchActivity({ def, onComplete, compact }: Props) {
  const [results, setResults] = useState<Record<string, Result>>({});
  const [firstTry, setFirstTry] = useState<Record<string, boolean>>({});

  const total = def.items.length;
  const solved = def.items.filter((i) => results[i.id]?.correct).length;
  const complete = solved === total;
  const firstTryCount = Object.values(firstTry).filter(Boolean).length;

  function pick(itemId: string, answer: string, categoryId: string) {
    if (results[itemId]?.correct) return;
    const correct = categoryId === answer;
    const next = { ...results, [itemId]: { chosen: categoryId, correct } };
    setResults(next);
    if (firstTry[itemId] === undefined) setFirstTry({ ...firstTry, [itemId]: correct });
    if (correct && def.items.every((i) => next[i.id]?.correct)) onComplete?.();
  }

  function reset() {
    setResults({});
    setFirstTry({});
  }

  return (
    <div>
      {!compact && (
        <>
          <h3 className="text-lg font-bold text-ink">{def.title}</h3>
          <p className="mt-1 max-w-prose text-sm leading-relaxed text-ink/80">{def.intro}</p>
        </>
      )}
      {compact && (
        <>
          <h3 className="text-base font-bold text-ink">{def.title}</h3>
          <p className="mt-1 max-w-prose text-sm leading-relaxed text-ink/80">{def.intro}</p>
        </>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-full bg-soft px-3 py-1 font-semibold text-brand">
          {solved} / {total} doğru eşleşti
        </span>
        {def.categories.map((c) =>
          c.description ? (
            <span key={c.id} className="text-xs text-muted">
              <strong className="text-ink/80">{c.label}:</strong> {c.description}
            </span>
          ) : null,
        )}
      </div>

      <ul className="mt-4 space-y-3">
        {def.items.map((item, idx) => {
          const r = results[item.id];
          return (
            <li
              key={item.id}
              className={`rounded-lg border p-3.5 sm:p-4 ${r ? (r.correct ? "border-success/40 bg-success-soft/50" : "border-warn/40 bg-warn-soft/60") : "border-line bg-white"}`}
            >
              <p className="text-sm font-medium leading-relaxed text-ink">
                <span className="mr-2 font-mono text-xs text-muted">{String(idx + 1).padStart(2, "0")}</span>
                {item.text}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {def.categories.map((c) => {
                  const isChosen = r?.chosen === c.id;
                  const locked = r?.correct;
                  let cls = "border-line bg-white text-ink hover:border-brand hover:text-brand";
                  if (isChosen && r.correct) cls = "border-success bg-success text-white";
                  else if (isChosen && !r.correct) cls = "border-warn bg-white text-warn-ink";
                  else if (locked) cls = "border-line bg-white text-muted opacity-60";
                  return (
                    <button
                      key={c.id}
                      disabled={locked}
                      onClick={() => pick(item.id, item.answer, c.id)}
                      className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${cls}`}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
              {r && (
                <div className="mt-3 flex gap-2 text-sm leading-relaxed" aria-live="polite">
                  {r.correct ? (
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-success" aria-hidden />
                  ) : (
                    <XCircle size={17} className="mt-0.5 shrink-0 text-warn-ink" aria-hidden />
                  )}
                  <p className="text-ink/90">
                    <strong className={r.correct ? "text-success" : "text-warn-ink"}>
                      {r.correct ? "Doğru. " : "Tam olarak değil, tekrar dene. "}
                    </strong>
                    {r.correct
                      ? item.explanation
                      : `İpucu: “${def.categories.find((c) => c.id === item.answer)?.label}” seçeneği bu örnek için daha uygun olabilir mi? ${item.explanation}`}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className={`mt-4 flex gap-2 rounded-lg border p-3.5 text-sm leading-relaxed ${toneBox.info}`}>
        <Lightbulb size={17} className="mt-0.5 shrink-0 text-brand" aria-hidden />
        <p>{def.reminder}</p>
      </div>

      {complete && (
        <div className={`mt-4 rounded-lg border p-4 ${toneBox.success}`} aria-live="polite">
          <p className="text-sm font-bold text-success">Uygulama tamamlandı.</p>
          <p className="mt-1 text-sm text-ink/90">
            {total} eşleşmenin {firstTryCount} tanesini ilk denemede doğru yaptın. İstersen uygulamayı sıfırlayıp tekrar deneyebilirsin.
          </p>
        </div>
      )}
      {(solved > 0 || Object.keys(results).length > 0) && (
        <button className={`${btnSecondary} mt-4`} onClick={reset}>
          <RotateCcw size={15} aria-hidden /> Uygulamayı sıfırla
        </button>
      )}
    </div>
  );
}
