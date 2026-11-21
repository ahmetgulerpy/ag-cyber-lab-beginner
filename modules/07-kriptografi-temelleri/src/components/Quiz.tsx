"use client";

import { useState } from "react";
import { Button, Callout, Pill, cx } from "@/components/ui";
import type { QuizResult } from "@/lib/progress";

export type Q = { q: string; o: [string, string, string, string]; a: number; e: string };
export type QT = [string, [string, string, string, string], number, string];
/** Doğru cevabın konumunu soru metninden türetilen sabit bir değere taşır (deterministik, hydration uyumlu) */
export const toQ = (t: QT[]): Q[] =>
  t.map(([q, o, a, e], n) => {
    let h = n;
    for (let i = 0; i < q.length; i++) h = (h * 31 + q.charCodeAt(i)) % 9973;
    const target = h % 4;
    const opts = [...o] as [string, string, string, string];
    [opts[a], opts[target]] = [opts[target], opts[a]];
    return { q, o: opts, a: target, e };
  });

export function Quiz({ questions, title, prev, onFinish, passPct = 70 }: { questions: Q[]; title: string; prev?: QuizResult; onFinish: (r: QuizResult) => void; passPct?: number }) {
  const [mode, setMode] = useState<"intro" | "run" | "result">("intro");
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);

  const start = () => {
    setIdx(0);
    setPicked(null);
    setAnswers([]);
    setMode("run");
  };
  const q = questions[idx];
  const score = answers.filter((a, i) => a === questions[i].a).length;
  const pct = Math.round((score / questions.length) * 100);

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
  };
  const next = () => {
    if (picked === null) return;
    const a = [...answers, picked];
    setAnswers(a);
    setPicked(null);
    if (idx + 1 < questions.length) setIdx(idx + 1);
    else {
      const s = a.filter((x, i) => x === questions[i].a).length;
      onFinish({ score: s, total: questions.length, date: new Date().toISOString() });
      setMode("result");
    }
  };

  if (mode === "intro")
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted">
          {title}: {questions.length} çoktan seçmeli soru. Her cevaptan sonra açıklamayı göreceksin. Başarı eşiği %{passPct}.
        </p>
        {prev && (
          <Callout kind="info" title="Önceki sonucun">
            {prev.score}/{prev.total} doğru (%{Math.round((prev.score / prev.total) * 100)}) — {new Date(prev.date).toLocaleDateString("tr-TR")}. Tekrar çözersen son sonuç kaydedilir.
          </Callout>
        )}
        <Button onClick={start}>{prev ? "Testi tekrar çöz" : "Teste başla"}</Button>
      </div>
    );

  if (mode === "result")
    return (
      <div className="space-y-5">
        <div className={cx("rounded-2xl border p-6 text-center", pct >= passPct ? "border-ok/40 bg-[#E6F3EC]" : "border-warn/50 bg-[#FBF3E1]")}>
          <p className="text-sm text-muted">Test sonucu</p>
          <p className="mt-1 text-4xl font-bold text-ink">
            {score}/{questions.length}
          </p>
          <p className="mt-1 text-lg font-semibold text-ink">Başarı: %{pct}</p>
          <p className="mt-1 text-sm text-ink/80">{pct >= passPct ? "Başarılı! Kavramları iyi kavramışsın." : "Biraz daha pratik yap; açıklamaları incele ve testi tekrar dene."}</p>
        </div>
        <div className="space-y-3">
          {questions.map((qq, i) => {
            const ok = answers[i] === qq.a;
            return (
              <div key={i} className={cx("rounded-xl border p-3 text-sm", ok ? "border-ok/40 bg-white" : "border-bad/40 bg-[#F9E8E8]")}>
                <p className="font-medium text-ink">
                  {i + 1}. {qq.q}
                </p>
                <p className="mt-1 text-xs">
                  {ok ? <span className="text-ok">✓ Doğru: {qq.o[qq.a]}</span> : <span className="text-bad">✗ Cevabın: {qq.o[answers[i]]} — Doğrusu: {qq.o[qq.a]}</span>}
                </p>
                <p className="mt-1 text-xs text-muted">{qq.e}</p>
              </div>
            );
          })}
        </div>
        <Button onClick={start} variant="secondary">
          Testi yeniden çöz
        </Button>
      </div>
    );

  const correct = picked !== null && picked === q.a;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted">
        <span>
          Soru {idx + 1}/{questions.length}
        </span>
        <div className="h-1.5 w-40 overflow-hidden rounded-full bg-line">
          <div className="h-full bg-accent" style={{ width: `${(idx / questions.length) * 100}%` }} />
        </div>
      </div>
      <p className="text-base font-semibold text-ink">{q.q}</p>
      <div className="grid gap-2">
        {q.o.map((op, i) => (
          <button
            key={i}
            type="button"
            onClick={() => choose(i)}
            className={cx(
              "flex gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
              picked === null && "border-line bg-white hover:border-brand",
              picked !== null && i === q.a && "border-ok bg-[#E6F3EC]",
              picked !== null && i === picked && i !== q.a && "border-bad bg-[#F9E8E8]",
              picked !== null && i !== q.a && i !== picked && "border-line bg-white opacity-60",
            )}
          >
            <span className="font-semibold text-brand">{"ABCD"[i]}</span>
            <span>{op}</span>
          </button>
        ))}
      </div>
      {picked !== null && (
        <div className="fadeup">
          <Callout kind={correct ? "ok" : "danger"} title={correct ? "Doğru cevap!" : `Yanlış cevap. Doğru seçenek: ${"ABCD"[q.a]}`}>
            {q.e}
          </Callout>
          <div className="mt-3">
            <Button onClick={next}>{idx + 1 < questions.length ? "Sonraki soru →" : "Sonucu gör"}</Button>
          </div>
        </div>
      )}
      <Pill tone="neutral">Şu ana kadar doğru: {answers.filter((a, i) => a === questions[i].a).length}</Pill>
    </div>
  );
}
