"use client";

import { useState } from "react";
import type { QuizQ } from "@/data/types";
import { Badge, Btn, Callout, Progress } from "@/components/ui";
import { saveQuiz, useProgress } from "@/lib/storage";

export function MiniQuiz({ lessonId, questions }: { lessonId: number; questions: QuizQ[] }) {
  const prog = useProgress();
  const prev = prog.quiz[lessonId];
  const [i, setI] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);
  const q = questions[i];

  const choose = (k: number) => {
    if (sel !== null) return;
    setSel(k);
  };
  const next = () => {
    const a = [...answers, sel as number];
    setAnswers(a);
    if (i + 1 >= questions.length) {
      const score = a.filter((x, idx) => x === questions[idx].a).length;
      saveQuiz(lessonId, score, questions.length);
      setDone(true);
    } else {
      setI(i + 1);
      setSel(null);
    }
  };
  const restart = () => {
    setI(0);
    setSel(null);
    setAnswers([]);
    setDone(false);
    setStarted(true);
  };

  if (!started && !done) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted">5 soru · her soruda 4 seçenek · her cevabın ardından açıklama gösterilir. Sonucun tarayıcında saklanır.</p>
        {prev && <Badge tone={prev.score >= 4 ? "ok" : prev.score >= 3 ? "warn" : "err"}>Son sonucun: {prev.score}/{prev.total}</Badge>}
        <div><Btn onClick={() => setStarted(true)}>{prev ? "Testi Yeniden Çöz" : "Teste Başla"}</Btn></div>
      </div>
    );
  }

  if (done) {
    const score = answers.filter((x, idx) => x === questions[idx].a).length;
    return (
      <div className="space-y-4">
        <Callout kind={score >= 4 ? "ok" : score >= 3 ? "warn" : "err"} title={`Puanın: ${score}/${questions.length} (%${Math.round((score / questions.length) * 100)})`}>
          {score >= 4 ? "Harika! Bu dersin konularını iyi öğrenmişsin." : score >= 3 ? "İyi gidiyorsun. Yanlış yaptığın soruların açıklamalarına tekrar göz at." : "Dersi ve laboratuvarı tekrar gözden geçirip testi yeniden çözmeni öneririm."} Sonuç kaydedildi.
        </Callout>
        <ul className="space-y-2">
          {questions.map((qq, idx) => {
            const ok = answers[idx] === qq.a;
            return (
              <li key={idx} className={`rounded-xl border p-3 text-sm ${ok ? "border-ok/30 bg-[#E9F5EF]" : "border-err/30 bg-[#F9ECEC]"}`}>
                <p className="font-semibold">{idx + 1}. {qq.q}</p>
                <p className="mt-1">{ok ? "✔ Doğru: " : `✖ Senin cevabın: ${qq.o[answers[idx]]} · Doğru: `}<b>{qq.o[qq.a]}</b></p>
                <p className="mt-1 text-muted">{qq.e}</p>
              </li>
            );
          })}
        </ul>
        <Btn onClick={restart}>↺ Testi Tekrarla</Btn>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Progress value={(i / questions.length) * 100} className="flex-1" />
        <span className="text-sm font-semibold text-muted">Soru {i + 1}/{questions.length}</span>
      </div>
      <p className="rounded-xl border border-line bg-white p-4 font-semibold">{q.q}</p>
      <div className="grid gap-2">
        {q.o.map((o, k) => {
          let cls = "border-line bg-white hover:bg-soft";
          if (sel !== null) cls = k === q.a ? "border-ok bg-[#E9F5EF] text-ok" : k === sel ? "border-err bg-[#F9ECEC] text-err" : "border-line bg-white opacity-60";
          return (
            <button key={k} type="button" onClick={() => choose(k)} disabled={sel !== null} className={`flex min-h-[46px] items-center gap-3 rounded-xl border px-4 py-2 text-left text-sm font-medium transition ${cls}`}>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-soft text-xs font-bold text-brand">{"ABCD"[k]}</span>
              {o}
            </button>
          );
        })}
      </div>
      {sel !== null && (
        <div className="space-y-3">
          <Callout kind={sel === q.a ? "ok" : "err"} title={sel === q.a ? "Doğru!" : `Yanlış. Doğru cevap: ${q.o[q.a]}`}>
            {sel !== q.a && <span>Seçtiğin &quot;{q.o[sel]}&quot; bu soru için uygun değil. </span>}
            {q.e}
          </Callout>
          <Btn onClick={next}>{i + 1 >= questions.length ? "Testi Bitir" : "Sonraki Soru →"}</Btn>
        </div>
      )}
    </div>
  );
}
