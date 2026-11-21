"use client";
import { useState } from "react";
import type { Q } from "@/data/types";
import { Callout, ProgressBar } from "@/components/ui";

const L = ["A", "B", "C", "D"];

export function Review({ questions, answers, levels }: { questions: Q[]; answers: number[]; levels?: string[] }) {
  return (
    <ol className="space-y-3">
      {questions.map((q, i) => {
        const ok = answers[i] === q[2];
        return (
          <li key={i} className={`rounded-xl border p-3 text-sm ${ok ? "border-[#BFE0CF] bg-[#F3FAF6]" : "border-[#EBC4C4] bg-[#FCF3F3]"}`}>
            <p className="font-semibold text-ink">
              {i + 1}. {q[0]} {levels && <span className="chip ml-1">{levels[i]}</span>}
            </p>
            <p className="mt-1.5">
              <span className={ok ? "text-ok" : "text-bad"}>{ok ? "✓ Doğru" : "✗ Yanlış"}</span>
              {" — "}Senin cevabın: <b>{answers[i] >= 0 ? `${L[answers[i]]}) ${q[1][answers[i]]}` : "boş"}</b>
            </p>
            {!ok && <p className="mt-1">Doğru cevap: <b className="text-ok">{L[q[2]]}) {q[1][q[2]]}</b></p>}
            <p className="mt-1 text-muted">{q[3]}</p>
          </li>
        );
      })}
    </ol>
  );
}

export function wrongWhy(q: Q, chosen: number) {
  return `"${q[1][chosen]}" seçeneği bu soru için geçerli değil. Doğru cevap "${q[1][q[2]]}". Çünkü: ${q[3]}`;
}

export default function QuizRunner({
  questions, mode, onFinish, levels,
}: { questions: Q[]; mode: "mini" | "final"; onFinish: (answers: number[], score: number) => void; levels?: string[] }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>(() => questions.map(() => -1));
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const q = questions[idx];
  const score = answers.filter((a, i) => a === questions[i][2]).length;

  if (finished) {
    return (
      <div className="space-y-4">
        <div className="card-soft p-4 text-center">
          <p className="text-sm text-muted">Test tamamlandı</p>
          <p className="text-4xl font-extrabold text-brand">{score}/{questions.length}</p>
          <p className="text-sm font-semibold">{score === questions.length ? "Mükemmel! Tüm soruları doğru yanıtladın." : score >= Math.ceil(questions.length * 0.6) ? "Başarılı — konuyu iyi kavramışsın." : "Konuyu tekrar gözden geçirip yeniden dene."}</p>
        </div>
        <Review questions={questions} answers={answers} levels={levels} />
        <button className="btn btn-primary" onClick={() => { setAnswers(questions.map(() => -1)); setIdx(0); setRevealed(false); setFinished(false); }}>↺ Testi yeniden çöz</button>
      </div>
    );
  }

  const choose = (i: number) => {
    if (mode === "mini" && revealed) return;
    setAnswers((a) => a.map((x, k) => (k === idx ? i : x)));
    if (mode === "mini") setRevealed(true);
  };
  const next = () => {
    if (idx === questions.length - 1) {
      const fin = answers;
      setFinished(true);
      onFinish(fin, fin.filter((a, i) => a === questions[i][2]).length);
    } else { setIdx(idx + 1); setRevealed(false); }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-brand">Soru {idx + 1} / {questions.length}{levels && <span className="chip ml-2">{levels[idx]}</span>}</span>
        {mode === "mini" && <span className="text-muted">Doğru: {score}</span>}
      </div>
      <ProgressBar value={((idx + (revealed ? 1 : 0)) / questions.length) * 100} />
      <p className="text-base font-bold leading-snug text-ink">{q[0]}</p>
      <div className="grid gap-2">
        {q[1].map((o, i) => {
          const sel = answers[idx] === i;
          let cls = "border-line bg-white hover:border-brand hover:bg-soft";
          if (mode === "mini" && revealed) cls = i === q[2] ? "border-ok bg-[#E8F4EE]" : sel ? "border-bad bg-[#F9ECEC]" : "border-line bg-white opacity-70";
          else if (sel) cls = "border-brand bg-soft";
          return (
            <button key={i} onClick={() => choose(i)} className={`flex items-start gap-3 rounded-xl border p-3 text-left text-sm transition ${cls}`}>
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-soft text-xs font-bold text-brand">{L[i]}</span>
              <span>{o}</span>
            </button>
          );
        })}
      </div>
      {mode === "mini" && revealed && (
        answers[idx] === q[2] ? (
          <Callout type="tip" title="Doğru!">{q[3]}</Callout>
        ) : (
          <Callout type="danger" title="Yanlış cevap">{wrongWhy(q, answers[idx])}</Callout>
        )
      )}
      <div className="flex flex-wrap justify-between gap-2">
        {mode === "final" ? <button className="btn" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>← Önceki</button> : <span />}
        <button className="btn btn-primary" disabled={mode === "mini" ? !revealed : answers[idx] < 0} onClick={next}>
          {idx === questions.length - 1 ? (mode === "final" ? "Sınavı bitir" : "Testi bitir") : "Sonraki soru →"}
        </button>
      </div>
      {mode === "final" && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {questions.map((_, i) => (
            <button key={i} aria-label={`Soru ${i + 1}`} onClick={() => setIdx(i)} className={`h-8 w-8 rounded-lg border text-xs font-bold ${i === idx ? "border-brand bg-brand text-white" : answers[i] >= 0 ? "border-accent bg-soft text-brand" : "border-line bg-white text-muted"}`}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
