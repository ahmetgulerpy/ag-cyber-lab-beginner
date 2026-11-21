"use client";

import { useState, type ReactNode } from "react";
import type { Quiz } from "@/data/types";
import { Badge, Btn, Card, Choice, Feedback, ProgressBar } from "./ui";

export type QuizItem = Quiz & { level?: "Kolay" | "Orta" | "Zor"; topic?: number; scenario?: string };

type Prepared = { q: QuizItem; perm: number[]; correctPos: number };

function prepare(questions: QuizItem[]): Prepared[] {
  return questions.map((q) => {
    const perm = q.options.map((_, i) => i);
    for (let i = perm.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [perm[i], perm[j]] = [perm[j], perm[i]];
    }
    return { q, perm, correctPos: perm.indexOf(q.correct) };
  });
}

export function QuizRunner({
  questions,
  title,
  intro,
  onFinish,
  resultExtra,
  shuffleQuestions = false,
}: {
  questions: QuizItem[];
  title: string;
  intro: string;
  onFinish: (score: number, wrong: QuizItem[]) => void;
  resultExtra?: (score: number, wrong: QuizItem[]) => ReactNode;
  shuffleQuestions?: boolean;
}) {
  const [items, setItems] = useState<Prepared[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  const start = () => {
    let p = prepare(questions);
    if (shuffleQuestions) p = p.sort(() => Math.random() - 0.5);
    setItems(p);
    setIdx(0);
    setPicked(null);
    setAnswers([]);
    setDone(false);
  };

  if (!items) {
    return (
      <Card className="text-center">
        <p className="text-4xl" aria-hidden>📝</p>
        <h3 className="mt-2 text-lg font-bold">{title}</h3>
        <p className="mx-auto mt-1 max-w-xl text-sm text-muted">{intro}</p>
        <p className="mt-2 text-xs text-muted">{questions.length} soru • Her cevaptan sonra açıklamayı göreceksin</p>
        <Btn className="mt-4" onClick={start}>Testi başlat</Btn>
      </Card>
    );
  }

  const total = items.length;

  if (done) {
    const score = answers.filter(Boolean).length;
    const wrong = items.filter((_, i) => !answers[i]).map((p) => p.q);
    const pct = Math.round((score / total) * 100);
    return (
      <div className="space-y-4">
        <Card className="text-center">
          <p className="text-4xl" aria-hidden>{pct >= 70 ? "🏆" : pct >= 50 ? "👍" : "📚"}</p>
          <h3 className="mt-2 text-xl font-bold">{score} / {total} doğru (%{pct})</h3>
          <ProgressBar value={pct} tone={pct >= 70 ? "ok" : pct >= 50 ? "warn" : "bad"} className="mx-auto mt-3 max-w-sm" />
          <p className="mt-3 text-sm text-muted">
            {pct >= 70 ? "Harika! Konuyu iyi kavramışsın." : pct >= 50 ? "İyi gidiyorsun; yanlışlarını gözden geçirip tekrar deneyebilirsin." : "Anlatım ve laboratuvara dönüp tekrar denemek faydalı olacak."}
          </p>
          <Btn className="mt-4" variant="secondary" onClick={start}>Tekrar dene</Btn>
        </Card>
        {resultExtra?.(score, wrong)}
        {wrong.length > 0 && (
          <Card>
            <h4 className="font-bold">Yanlış cevapladığın sorular</h4>
            <ul className="mt-3 space-y-3">
              {items.map((p, i) =>
                answers[i] ? null : (
                  <li key={i} className="rounded-xl border border-line bg-page p-3 text-sm">
                    <p className="font-semibold">{p.q.q}</p>
                    <p className="mt-1 text-ok">Doğru cevap: {p.q.options[p.q.correct]}</p>
                    <p className="mt-1 text-muted">{p.q.explain}</p>
                  </li>
                ),
              )}
            </ul>
          </Card>
        )}
      </div>
    );
  }

  const cur = items[idx];
  const answered = picked !== null;
  const isLast = idx === total - 1;

  const choose = (pos: number) => {
    if (answered) return;
    setPicked(pos);
    setAnswers((a) => {
      const n = [...a];
      n[idx] = pos === cur.correctPos;
      return n;
    });
  };

  const next = () => {
    if (isLast) {
      const score = answers.filter(Boolean).length;
      const wrong = items.filter((_, i) => !answers[i]).map((p) => p.q);
      onFinish(score, wrong);
      setDone(true);
    } else {
      setIdx(idx + 1);
      setPicked(null);
    }
  };

  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold text-muted">Soru {idx + 1} / {total}</span>
        <div className="flex gap-2">
          {cur.q.level && <Badge tone={cur.q.level === "Kolay" ? "ok" : cur.q.level === "Orta" ? "warn" : "bad"}>{cur.q.level}</Badge>}
          {cur.q.scenario && <Badge tone="brand">Senaryo</Badge>}
        </div>
      </div>
      <ProgressBar value={((idx + (answered ? 1 : 0)) / total) * 100} className="mb-4" />
      {cur.q.scenario && (
        <div className="mb-3 rounded-xl border border-brand/20 bg-soft p-3 text-sm text-[#2c4152]">
          <span className="font-semibold">Senaryo: </span>
          {cur.q.scenario}
        </div>
      )}
      <h4 className="mb-3 text-base font-bold leading-snug">{cur.q.q}</h4>
      <div className="space-y-2">
        {cur.perm.map((orig, pos) => {
          let state: "idle" | "correct" | "wrong" | "missed" = "idle";
          if (answered) {
            if (pos === cur.correctPos) state = pos === picked ? "correct" : "missed";
            else if (pos === picked) state = "wrong";
          }
          return (
            <Choice key={pos} state={state} disabled={answered} onClick={() => choose(pos)}>
              {cur.q.options[orig]}
            </Choice>
          );
        })}
      </div>
      {answered && (
        <div className="mt-4 space-y-3">
          <Feedback ok={picked === cur.correctPos} title={picked === cur.correctPos ? "Doğru cevap!" : "Yanlış cevap"}>
            {picked !== cur.correctPos && <p className="mb-1 font-semibold">Doğru cevap: {cur.q.options[cur.q.correct]}</p>}
            {cur.q.explain}
          </Feedback>
          <Btn onClick={next}>{isLast ? "Sonucu gör" : "Sonraki soru →"}</Btn>
        </div>
      )}
    </Card>
  );
}
