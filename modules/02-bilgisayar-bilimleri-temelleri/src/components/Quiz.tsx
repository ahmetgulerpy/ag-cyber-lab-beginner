import { useState } from "react";
import { ArrowRight, Check, RotateCcw, X, BookOpen } from "lucide-react";
import type { Question } from "../types";
import { Btn, Card, Feedback, ProgressBar } from "./ui";
import { cn } from "../utils/cn";

interface Props {
  questions: Question[];
  title: string;
  onFinish: (score: number, wrongLessons: number[]) => void;
  lessonTitles?: Record<number, string>;
  passRatio?: number;
}

export function Quiz({ questions, title, onFinish, lessonTitles, passRatio = 0.6 }: Props) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [finished, setFinished] = useState(false);
  const [showWrong, setShowWrong] = useState(false);

  const q = questions[idx];
  const score = answers.reduce<number>((s, a, i) => (a === questions[i].answer ? s + 1 : s), 0);

  const restart = () => {
    setIdx(0);
    setPicked(null);
    setChecked(false);
    setAnswers([]);
    setFinished(false);
    setShowWrong(false);
  };

  const check = () => {
    if (picked === null) return;
    setChecked(true);
    setAnswers((a) => [...a, picked]);
  };

  const next = () => {
    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
      setPicked(null);
      setChecked(false);
    } else {
      const wrong: number[] = [];
      answers.forEach((a, i) => {
        const l = questions[i].lesson;
        if (a !== questions[i].answer && l && !wrong.includes(l)) wrong.push(l);
      });
      setFinished(true);
      onFinish(score, wrong);
    }
  };

  if (finished) {
    const ratio = score / questions.length;
    const wrongs = questions.map((qq, i) => ({ qq, i, a: answers[i] })).filter((x) => x.a !== x.qq.answer);
    const weak = Array.from(new Set(wrongs.map((w) => w.qq.lesson).filter((l): l is number => !!l)));
    return (
      <Card className="fade-in space-y-5">
        <div className="text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-accent">{title} — Sonuç</div>
          <div className="mt-2 text-5xl font-bold text-ink">
            {score}
            <span className="text-2xl text-muted"> / {questions.length}</span>
          </div>
          <div className="mt-1 text-lg font-semibold text-brand">Başarı: %{Math.round(ratio * 100)}</div>
          <div className="mx-auto mt-3 max-w-md">
            <ProgressBar value={Math.round(ratio * 100)} />
          </div>
        </div>
        {ratio >= passRatio ? (
          <Feedback tone="ok" title="Başarılı!">
            Bu bölümdeki temel kavramları kavradığını gösterdin. Yanlışların varsa aşağıdan inceleyip pekiştirebilirsin.
          </Feedback>
        ) : (
          <Feedback tone="warn" title="Tekrar önerilir">
            Geçme sınırı %{Math.round(passRatio * 100)}. Konu anlatımını gözden geçirip testi yeniden çözebilirsin; yanlışlar öğrenme fırsatıdır.
          </Feedback>
        )}
        {weak.length > 0 && lessonTitles && (
          <div className="rounded-lg border border-line bg-page p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
              <BookOpen className="h-4 w-4 text-brand" /> Tekrar etmen önerilen dersler
            </div>
            <ul className="flex flex-wrap gap-2">
              {weak.map((l) => (
                <li key={l}>
                  <a href={`#/lesson/${l}`} className="inline-block rounded-full bg-soft px-3 py-1 text-sm font-medium text-brand hover:bg-brand hover:text-white">
                    Ders {String(l).padStart(2, "0")} — {lessonTitles[l]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <Btn onClick={restart}>
            <RotateCcw className="h-4 w-4" /> Testi Yeniden Çöz
          </Btn>
          {wrongs.length > 0 && (
            <Btn variant="secondary" onClick={() => setShowWrong((s) => !s)}>
              {showWrong ? "Yanlışları Gizle" : `Yanlış Cevapları Gör (${wrongs.length})`}
            </Btn>
          )}
        </div>
        {showWrong && (
          <div className="space-y-3">
            {wrongs.map(({ qq, i, a }) => (
              <div key={i} className="rounded-lg border border-line p-4 text-sm">
                <div className="font-semibold text-ink">
                  {i + 1}. {qq.q}
                </div>
                <div className="mt-2 flex items-start gap-2 text-bad">
                  <X className="mt-0.5 h-4 w-4 shrink-0" /> Senin cevabın: {a !== null && a !== undefined ? qq.options[a] : "—"}
                </div>
                <div className="mt-1 flex items-start gap-2 text-ok">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" /> Doğru cevap: {qq.options[qq.answer]}
                </div>
                <p className="mt-2 text-muted">{qq.explain}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-brand">{title}</span>
        <span className="text-muted">
          Soru {idx + 1} / {questions.length}
        </span>
      </div>
      <ProgressBar value={Math.round((idx / questions.length) * 100)} />
      <h4 className="text-base font-semibold leading-snug text-ink sm:text-lg">{q.q}</h4>
      <div className="grid gap-2.5">
        {q.options.map((o, i) => {
          const isAns = i === q.answer;
          const isPick = picked === i;
          return (
            <button
              key={i}
              disabled={checked}
              onClick={() => setPicked(i)}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors",
                !checked && !isPick && "border-line bg-white hover:border-accent hover:bg-soft/50",
                !checked && isPick && "border-brand bg-soft",
                checked && isAns && "border-ok bg-[#eef8f2]",
                checked && isPick && !isAns && "border-bad bg-[#fbeeee]",
                checked && !isAns && !isPick && "border-line bg-white opacity-60"
              )}
            >
              <span
                className={cn(
                  "mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                  isPick && !checked ? "border-brand bg-brand text-white" : "border-line text-muted",
                  checked && isAns && "border-ok bg-ok text-white",
                  checked && isPick && !isAns && "border-bad bg-bad text-white"
                )}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="pt-0.5">{o}</span>
            </button>
          );
        })}
      </div>
      {checked && (
        <Feedback tone={picked === q.answer ? "ok" : "bad"} title={picked === q.answer ? "Doğru!" : "Yanlış"}>
          {q.explain}
        </Feedback>
      )}
      <div className="flex justify-end">
        {!checked ? (
          <Btn onClick={check} disabled={picked === null}>
            Cevabı Kontrol Et
          </Btn>
        ) : (
          <Btn onClick={next}>
            {idx + 1 < questions.length ? "Sonraki Soru" : "Sonucu Gör"} <ArrowRight className="h-4 w-4" />
          </Btn>
        )}
      </div>
    </Card>
  );
}
