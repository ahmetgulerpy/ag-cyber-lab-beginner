"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { Question } from "@/content/types";
import { MockScreen } from "./MockScreen";
import { Callout, ProgressBar } from "./ui";

export type QuizResult = { score: number; total: number; results: { id: string; ok: boolean; lesson?: string; level?: string }[] };

function shuffled(items: string[], seed: string): string[] {
  const h = (s: string) => [...(seed + s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 100003, 7);
  const out = [...items].sort((a, b) => h(a) - h(b));
  if (out.every((x, i) => x === items[i])) out.reverse();
  return out;
}

export function Quiz({ title = "Mini değerlendirme", questions, onFinish, summary }: { title?: string; questions: Question[]; onFinish?: (r: QuizResult) => void; summary?: (r: QuizResult) => ReactNode }) {
  const [run, setRun] = useState(0);
  return <QuizRun key={run} title={title} questions={questions} onFinish={onFinish} summary={summary} onRetry={() => setRun((r) => r + 1)} />;
}

function QuizRun({ title, questions, onFinish, summary, onRetry }: { title: string; questions: Question[]; onFinish?: (r: QuizResult) => void; summary?: (r: QuizResult) => ReactNode; onRetry: () => void }) {
  const [i, setI] = useState(0);
  const [results, setResults] = useState<QuizResult["results"]>([]);
  const [finished, setFinished] = useState<QuizResult | null>(null);
  const [checked, setChecked] = useState(false);
  const [ok, setOk] = useState(false);
  const [pick, setPick] = useState<number | null>(null);
  const [multi, setMulti] = useState<number[]>([]);
  const q = questions[i];
  const [orderState, setOrderState] = useState<string[]>(() => (q.type === "order" ? shuffled(q.order ?? [], q.id) : []));

  const submit = () => {
    let good = false;
    if (q.type === "mc") good = pick === q.answer;
    if (q.type === "multi") good = [...multi].sort().join() === [...(q.answers ?? [])].sort().join();
    if (q.type === "order") good = orderState.join("|") === (q.order ?? []).join("|");
    setOk(good);
    setChecked(true);
    setResults((r) => [...r, { id: q.id, ok: good, lesson: q.lesson, level: q.level }]);
  };

  const next = () => {
    if (i + 1 >= questions.length) {
      const res: QuizResult = { score: results.filter((r) => r.ok).length, total: questions.length, results };
      setFinished(res);
      onFinish?.(res);
      return;
    }
    const nq = questions[i + 1];
    setI(i + 1);
    setChecked(false);
    setPick(null);
    setMulti([]);
    setOrderState(nq.type === "order" ? shuffled(nq.order ?? [], nq.id) : []);
  };

  const move = (idx: number, d: -1 | 1) => {
    const j = idx + d;
    if (j < 0 || j >= orderState.length) return;
    const c = [...orderState];
    [c[idx], c[j]] = [c[j], c[idx]];
    setOrderState(c);
  };

  if (finished) {
    const pct = Math.round((finished.score / finished.total) * 100);
    return (
      <div className="space-y-4">
        <div className="card text-center">
          <p className="text-sm font-semibold text-ag-muted">{title} sonucu</p>
          <p className={`my-2 text-5xl font-black ${pct >= 60 ? "text-ag-ok" : "text-ag-err"}`}>
            {finished.score}/{finished.total}
          </p>
          <p className="text-sm text-ag-text">{pct >= 80 ? "Mükemmel! Konuyu çok iyi kavramışsın." : pct >= 60 ? "İyi gidiyorsun! Yanlış yaptığın soruların açıklamalarına tekrar göz atabilirsin." : "Sorun değil. Konu anlatımını ve uygulamayı tekrar gözden geçirip testi yeniden dene."}</p>
          <button type="button" className="btn btn-primary mt-4" onClick={onRetry}>
            Testi yeniden çöz
          </button>
        </div>
        {summary?.(finished)}
      </div>
    );
  }

  const canSubmit = q.type === "mc" ? pick !== null : q.type === "multi" ? multi.length > 0 : true;

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between gap-3 text-xs font-semibold text-ag-muted">
        <span>
          {title} · Soru {i + 1}/{questions.length}
        </span>
        <span className="flex gap-1.5">
          <span className="chip">{q.format}</span>
          {q.level && <span className="chip">{q.level}</span>}
        </span>
      </div>
      <ProgressBar pct={(i / questions.length) * 100} />
      {q.scenario && <Callout kind="info" title="Senaryo">{q.scenario}</Callout>}
      {q.screen && <MockScreen s={q.screen} compact />}
      <h4 className="text-base font-bold text-ag-text">{q.q}</h4>

      {(q.type === "mc" || q.type === "multi") && (
        <ul className="space-y-2">
          {(q.options ?? []).map((o, idx) => {
            const sel = q.type === "mc" ? pick === idx : multi.includes(idx);
            const correct = q.type === "mc" ? q.answer === idx : (q.answers ?? []).includes(idx);
            let cls = "border-ag-line bg-white hover:bg-ag-light";
            if (sel && !checked) cls = "border-ag-brand bg-ag-light";
            if (checked && correct) cls = "border-ag-ok bg-[#edf8f2]";
            if (checked && sel && !correct) cls = "border-ag-err bg-[#fdf0f0]";
            return (
              <li key={o}>
                <button
                  type="button"
                  disabled={checked}
                  onClick={() => (q.type === "mc" ? setPick(idx) : setMulti((m) => (m.includes(idx) ? m.filter((x) => x !== idx) : [...m, idx])))}
                  className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${cls}`}
                >
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border text-[11px] font-bold ${q.type === "multi" ? "rounded" : "rounded-full"} ${sel ? "border-ag-brand bg-ag-brand text-white" : "border-ag-muted text-transparent"}`}>✓</span>
                  <span className="flex-1">
                    {o}
                    {checked && q.why?.[idx] && (sel || correct) && <span className={`mt-1 block text-xs ${correct ? "text-ag-ok" : "text-ag-err"}`}>{correct ? "✔ " : "✘ "}{q.why[idx]}</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {q.type === "multi" && !checked && <p className="text-xs text-ag-muted">Birden fazla doğru seçenek olabilir.</p>}

      {q.type === "order" && (
        <div className="space-y-2">
          <p className="text-xs text-ag-muted">Okları kullanarak adımları doğru sıraya diz.</p>
          <ol className="space-y-2">
            {orderState.map((o, idx) => {
              const right = checked && (q.order ?? [])[idx] === o;
              return (
                <li key={o} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${checked ? (right ? "border-ag-ok bg-[#edf8f2]" : "border-ag-err bg-[#fdf0f0]") : "border-ag-line bg-white"}`}>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ag-brand text-xs font-bold text-white">{idx + 1}</span>
                  <span className="flex-1">{o}</span>
                  {!checked && (
                    <span className="flex gap-1">
                      <button type="button" aria-label="Yukarı taşı" className="btn btn-sm !px-2" onClick={() => move(idx, -1)}>↑</button>
                      <button type="button" aria-label="Aşağı taşı" className="btn btn-sm !px-2" onClick={() => move(idx, 1)}>↓</button>
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
          {checked && !ok && (
            <div className="rounded-xl border border-ag-line bg-ag-bg p-3 text-sm">
              <p className="mb-1 font-bold text-ag-brand">Doğru sıra:</p>
              <ol className="list-decimal space-y-0.5 pl-5">
                {(q.order ?? []).map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {checked && (
        <Callout kind={ok ? "ok" : "err"} title={ok ? "Doğru!" : "Yanlış – nedenini birlikte inceleyelim"}>
          {q.type === "mc" && !ok && pick !== null && q.why?.[pick] && <p className="mb-1">Seçtiğin cevap: {q.why[pick]}</p>}
          {q.type === "mc" && !ok && q.answer !== undefined && q.why?.[q.answer] && <p className="mb-1">Doğru cevap: <strong>{q.options?.[q.answer]}</strong> — {q.why[q.answer]}</p>}
          {q.explain && <p>{q.explain}</p>}
        </Callout>
      )}

      <div className="flex justify-end">
        {!checked ? (
          <button type="button" className="btn btn-primary" disabled={!canSubmit} onClick={submit}>
            Cevabı kontrol et
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={next}>
            {i + 1 >= questions.length ? "Sonucu gör" : "Sonraki soru →"}
          </button>
        )}
      </div>
    </div>
  );
}
