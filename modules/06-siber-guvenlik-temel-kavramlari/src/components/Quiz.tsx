"use client";

import { useState } from "react";
import type { Question } from "@/data/types";

export default function Quiz({
  questions,
  onFinish,
  retryLabel = "Testi yeniden çöz",
}: {
  questions: Question[];
  onFinish: (score: number, total: number) => void;
  retryLabel?: string;
}) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [finished, setFinished] = useState(false);

  const total = questions.length;
  const score = answers.reduce<number>((s, a, i) => s + (a === questions[i].answer ? 1 : 0), 0);

  const pick = (n: number) => {
    if (picked !== null) return;
    setPicked(n);
  };

  const next = () => {
    const nextAnswers = [...answers, picked];
    setAnswers(nextAnswers);
    if (idx + 1 >= total) {
      const sc = nextAnswers.reduce<number>((s, a, i) => s + (a === questions[i].answer ? 1 : 0), 0);
      setFinished(true);
      onFinish(sc, total);
    } else {
      setIdx(idx + 1);
      setPicked(null);
    }
  };

  const restart = () => {
    setIdx(0);
    setPicked(null);
    setAnswers([]);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / total) * 100);
    const good = pct >= 60;
    return (
      <div className="card fade-in flex flex-col gap-5">
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-page p-6 text-center">
          <p className="label-mini">Test Sonucu</p>
          <p className={`text-5xl font-extrabold ${good ? "text-ok" : "text-bad"}`}>%{pct}</p>
          <p className="text-sm text-ink">
            {total} sorudan <b>{score}</b> doğru · {total - score} yanlış
          </p>
          <p className="max-w-md text-sm text-muted">
            {pct >= 90
              ? "Harika! Kavramları çok iyi anlamışsın."
              : good
                ? "Başarılı. Yanlış yaptığın soruların açıklamalarına göz atmanı öneririz."
                : "Başarı eşiği %60. Konu gezginine dönüp tekrar etmeni, ardından testi yeniden çözmeni öneririz."}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {questions.map((q, i) => {
            const ok = answers[i] === q.answer;
            return (
              <details key={q.q} className="rounded-xl border border-line bg-white px-4 py-3">
                <summary className="cursor-pointer text-sm font-semibold text-ink">
                  <span className={ok ? "text-ok" : "text-bad"}>{ok ? "✓" : "✕"}</span> Soru {i + 1}: {q.q}
                </summary>
                <div className="mt-2 flex flex-col gap-1 text-sm text-ink/85">
                  <p>
                    Senin cevabın:{" "}
                    <b className={ok ? "text-ok" : "text-bad"}>{answers[i] === null ? "—" : q.options[answers[i] as number]}</b>
                  </p>
                  {!ok && (
                    <p>
                      Doğru cevap: <b className="text-ok">{q.options[q.answer]}</b>
                    </p>
                  )}
                  <p className="text-muted">{q.explain}</p>
                </div>
              </details>
            );
          })}
        </div>
        <button className="btn-ghost self-start" onClick={restart}>
          ↻ {retryLabel}
        </button>
      </div>
    );
  }

  const q = questions[idx];
  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="label-mini">
          Soru {idx + 1} / {total}
        </span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-soft">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${((idx + (picked !== null ? 1 : 0)) / total) * 100}%` }} />
        </div>
      </div>
      <h3 className="text-base font-bold text-ink sm:text-lg">{q.q}</h3>
      <div className="grid gap-2">
        {q.options.map((o, i) => {
          let cls = "border-line bg-white hover:bg-soft";
          if (picked !== null) {
            if (i === q.answer) cls = "border-ok bg-[#E9F5EF]";
            else if (i === picked) cls = "border-bad bg-[#FAEDED]";
            else cls = "border-line bg-white opacity-60";
          }
          return (
            <button
              key={o}
              onClick={() => pick(i)}
              disabled={picked !== null}
              className={`cursor-pointer rounded-xl border px-4 py-3 text-left text-sm transition ${cls}`}
            >
              <span className="mr-2 font-bold text-brand">{String.fromCharCode(65 + i)}.</span>
              {o}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="fade-in flex flex-col gap-3">
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              picked === q.answer ? "border-ok/40 bg-[#E9F5EF]" : "border-bad/40 bg-[#FAEDED]"
            }`}
          >
            <p className={`font-bold ${picked === q.answer ? "text-ok" : "text-bad"}`}>
              {picked === q.answer ? "Doğru cevap!" : "Yanlış cevap."}
            </p>
            <p className="mt-1 text-ink/85">{q.explain}</p>
          </div>
          <button className="btn-primary self-end" onClick={next}>
            {idx + 1 >= total ? "Sonucu gör" : "Sonraki soru →"}
          </button>
        </div>
      )}
    </div>
  );
}
