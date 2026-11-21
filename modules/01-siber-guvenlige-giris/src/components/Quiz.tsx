"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, RotateCcw, XCircle, Trophy } from "lucide-react";
import type { Question } from "@/content/types";
import { Badge, btnPrimary, btnSecondary, Card, toneBox } from "./ui";

export interface ReviewLink {
  label: string;
  href: string;
}

export interface PreviousResult {
  score: number;
  total: number;
  attempts: number;
  best: string;
}

interface Props {
  questions: Question[];
  kind: "mini" | "final";
  passPercent: number;
  previous: PreviousResult | null;
  getReviewLink: (q: Question) => ReviewLink | null;
  onFinish: (score: number, wrong: Question[]) => void;
}

interface Prepared {
  q: Question;
  options: string[];
  answer: number;
}

/** Deterministik karıştırma: sunucu ve istemci aynı sırayı üretir (hydration uyumu). */
function hashSeed(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function prepare(q: Question, attempt: number): Prepared {
  const rand = rng(hashSeed(`${q.id}:${attempt}`));
  const idx = [0, 1, 2, 3];
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return { q, options: idx.map((i) => q.options[i]), answer: idx.indexOf(q.answer) };
}

const LETTERS = ["A", "B", "C", "D"];

export function Quiz({ questions, kind, passPercent, previous, getReviewLink, onFinish }: Props) {
  const [phase, setPhase] = useState<"intro" | "running" | "result">("intro");
  const [attempt, setAttempt] = useState(0);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const prepared = useMemo(() => questions.map((q) => prepare(q, attempt)), [questions, attempt]);
  const total = questions.length;

  function start() {
    setAnswers(Array(total).fill(null));
    setIndex(0);
    setPhase("running");
  }

  function retry() {
    setAttempt((a) => a + 1);
    setAnswers(Array(total).fill(null));
    setIndex(0);
    setPhase("running");
  }

  function choose(i: number) {
    if (answers[index] !== null) return;
    setAnswers((prev) => prev.map((a, k) => (k === index ? i : a)));
  }

  function next() {
    if (index < total - 1) {
      setIndex(index + 1);
      return;
    }
    const wrong = prepared.filter((p, k) => answers[k] !== p.answer).map((p) => p.q);
    onFinish(total - wrong.length, wrong);
    setPhase("result");
  }

  if (phase === "intro") {
    return (
      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{total} soru</Badge>
          <Badge tone="neutral">Her soruda 4 seçenek</Badge>
          <Badge tone="neutral">Tek doğru cevap</Badge>
        </div>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink/80">
          {kind === "mini"
            ? "Bu test, dersi ne kadar kavradığını görmen için hazırlandı. Her cevaptan sonra açıklamayı okuyabilirsin. Sonuç ne olursa olsun testi istediğin kadar tekrar çözebilirsin."
            : `Genel değerlendirme, 8 dersin tamamından sorular içerir. Başarı eşiği %${passPercent}. Sonunda yanlış yaptığın sorular için hangi derse dönmen gerektiğini önereceğiz. İstediğin kadar tekrar çözebilirsin.`}
        </p>
        {previous && (
          <div className={`mt-4 rounded-lg border p-3 text-sm ${toneBox.info}`}>
            Önceki sonucun: <strong>{previous.score}/{previous.total}</strong> · En iyi: <strong>{previous.best}</strong> · Deneme: {previous.attempts}
          </div>
        )}
        <button className={`${btnPrimary} mt-5`} onClick={previous ? retry : start}>
          {previous ? "Testi yeniden çöz" : "Teste başla"} <ArrowRight size={16} aria-hidden />
        </button>
      </Card>
    );
  }

  if (phase === "result") {
    const score = prepared.filter((p, k) => answers[k] === p.answer).length;
    const percent = Math.round((score / total) * 100);
    const wrongItems = prepared
      .map((p, k) => ({ p, chosen: answers[k] }))
      .filter((x) => x.chosen !== x.p.answer);
    const links = new Map<string, ReviewLink>();
    wrongItems.forEach(({ p }) => {
      const l = getReviewLink(p.q);
      if (l) links.set(l.href + l.label, l);
    });
    const passed = percent >= passPercent;
    return (
      <div className="space-y-4">
        <Card className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div
              className={`flex h-20 w-20 flex-col items-center justify-center rounded-full border-4 ${passed ? "border-success text-success" : "border-warn text-warn-ink"}`}
            >
              <span className="text-2xl font-bold leading-none">{score}</span>
              <span className="text-xs">/ {total}</span>
            </div>
            <div>
              <p className="flex items-center gap-2 text-lg font-bold text-ink">
                {passed ? <Trophy size={18} className="text-success" aria-hidden /> : <BookOpen size={18} className="text-warn-ink" aria-hidden />}
                Başarı oranı: %{percent}
              </p>
              <p className="mt-1 max-w-prose text-sm text-ink/80">
                {percent === 100
                  ? "Harika, tüm soruları doğru yanıtladın."
                  : passed
                    ? "Güzel sonuç. Yanlış yaptığın soruların açıklamalarına göz atarak eksiklerini kapatabilirsin."
                    : "Bu sonuç, bazı konuları tekrar etmenin faydalı olacağını gösteriyor. Bu bir ceza değil; öğrenme için bir yol haritası."}
              </p>
            </div>
          </div>
          {links.size > 0 && (
            <div className={`mt-5 rounded-lg border p-4 ${toneBox.warn}`}>
              <p className="text-sm font-semibold">Tekrar önerisi</p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {[...links.values()].map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="inline-flex items-center gap-1.5 font-medium text-brand underline-offset-2 hover:underline">
                      <BookOpen size={14} aria-hidden /> {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button className={`${btnSecondary} mt-5`} onClick={retry}>
            <RotateCcw size={16} aria-hidden /> Testi tekrar çöz
          </button>
        </Card>

        {wrongItems.length > 0 && (
          <Card className="p-5 sm:p-6">
            <h3 className="text-base font-bold text-ink">Yanlış cevapladığın sorular ({wrongItems.length})</h3>
            <ol className="mt-4 space-y-5">
              {wrongItems.map(({ p, chosen }) => (
                <li key={p.q.id} className="border-l-2 border-danger/50 pl-4">
                  <p className="text-sm font-semibold text-ink">{p.q.prompt}</p>
                  <p className="mt-2 flex gap-2 text-sm text-danger">
                    <XCircle size={16} className="mt-0.5 shrink-0" aria-hidden />
                    <span>Senin cevabın: {chosen !== null ? p.options[chosen] : "Cevaplanmadı"}</span>
                  </p>
                  <p className="mt-1 flex gap-2 text-sm text-success">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0" aria-hidden />
                    <span>Doğru cevap: {p.options[p.answer]}</span>
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/80">{p.q.explanation}</p>
                </li>
              ))}
            </ol>
          </Card>
        )}
      </div>
    );
  }

  const cur = prepared[index];
  const chosen = answers[index];
  const answered = chosen !== null && chosen !== undefined;
  const correct = answered && chosen === cur.answer;

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="font-mono text-xs font-semibold text-muted">
          SORU {index + 1} / {total}
        </span>
        <div className="flex gap-1" aria-hidden>
          {prepared.map((_, k) => (
            <span
              key={k}
              className={`h-1.5 w-5 rounded-full sm:w-6 ${k === index ? "bg-brand" : answers[k] !== null && answers[k] !== undefined ? (answers[k] === prepared[k].answer ? "bg-success" : "bg-danger/70") : "bg-line"}`}
            />
          ))}
        </div>
      </div>
      <h3 className="text-base font-semibold leading-relaxed text-ink sm:text-lg">{cur.q.prompt}</h3>
      <div className="mt-4 grid gap-2.5" role="radiogroup" aria-label="Cevap seçenekleri">
        {cur.options.map((opt, i) => {
          let cls = "border-line bg-white hover:border-brand hover:bg-soft/60";
          if (answered) {
            if (i === cur.answer) cls = "border-success bg-success-soft";
            else if (i === chosen) cls = "border-danger bg-danger-soft";
            else cls = "border-line bg-white opacity-60";
          }
          return (
            <button
              key={i}
              role="radio"
              aria-checked={chosen === i}
              disabled={answered}
              onClick={() => choose(i)}
              className={`flex items-start gap-3 rounded-lg border px-3.5 py-3 text-left text-sm transition-colors ${cls}`}
            >
              <span className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-soft font-mono text-xs font-bold text-brand">
                {LETTERS[i]}
              </span>
              <span className="leading-relaxed">{opt}</span>
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={`mt-4 rounded-lg border p-4 ${correct ? toneBox.success : toneBox.warn}`} aria-live="polite">
          <p className={`flex items-center gap-2 text-sm font-bold ${correct ? "text-success" : "text-warn-ink"}`}>
            {correct ? <CheckCircle2 size={16} aria-hidden /> : <XCircle size={16} aria-hidden />}
            {correct ? "Doğru!" : "Bu sefer olmadı, ama açıklama tam da bunun için."}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink/90">{cur.q.explanation}</p>
          {!correct && (
            <p className="mt-1.5 text-sm text-ink/90">
              <strong>Doğru cevap:</strong> {cur.options[cur.answer]}
            </p>
          )}
        </div>
      )}
      <div className="mt-5 flex justify-end">
        <button className={btnPrimary} onClick={next} disabled={!answered}>
          {index < total - 1 ? "Sonraki soru" : "Sonucu gör"} <ArrowRight size={16} aria-hidden />
        </button>
      </div>
    </Card>
  );
}
