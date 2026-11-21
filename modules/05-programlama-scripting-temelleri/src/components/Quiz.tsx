"use client";

import { useState } from "react";
import type { Question } from "@/data/types";
import { shuffle } from "@/lib/util";
import { Badge, Btn, ProgressBar } from "./ui";

type Item = { q: string; options: string[]; answer: number; explain: string };

function prepare(questions: Question[]): Item[] {
  return shuffle(questions).map((qq) => {
    const idxs = shuffle(qq.options.map((_, i) => i));
    return {
      q: qq.q,
      options: idxs.map((i) => qq.options[i]),
      answer: idxs.indexOf(qq.answer),
      explain: qq.explain,
    };
  });
}

export default function Quiz({
  questions,
  title,
  passPercent = 60,
  onFinish,
}: {
  questions: Question[];
  title: string;
  passPercent?: number;
  onFinish: (score: number, total: number) => void;
}) {
  const [phase, setPhase] = useState<"intro" | "run" | "result">("intro");
  const [items, setItems] = useState<Item[]>([]);
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const start = () => {
    setItems(prepare(questions));
    setIdx(0);
    setSel(null);
    setChecked(false);
    setAnswers([]);
    setPhase("run");
  };

  if (phase === "intro") {
    return (
      <div className="rounded-xl border border-line bg-white p-5">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted">
          {questions.length} çoktan seçmeli soru. Her soruda dört seçenek bulunur. Cevabınızı kontrol ettiğinizde
          doğru/yanlış bilgisi ve açıklama görürsünüz. Soru ve seçenek sırası her denemede karıştırılır.
        </p>
        <Btn className="mt-4" onClick={start}>
          Testi başlat
        </Btn>
      </div>
    );
  }

  if (phase === "result") {
    const score = answers.reduce<number>((s, a, i) => (a === items[i].answer ? s + 1 : s), 0);
    const percent = Math.round((score / items.length) * 100);
    const pass = percent >= passPercent;
    return (
      <div className="rounded-xl border border-line bg-white p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div
            className={`flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 ${
              pass ? "border-ok text-ok" : "border-warn text-[#9a6b14]"
            }`}
          >
            <span className="text-2xl font-bold">%{percent}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Test sonucu</h3>
            <p className="text-sm text-muted">
              {items.length} sorudan <strong className="text-ink">{score}</strong> doğru ·{" "}
              {items.length - score} yanlış
            </p>
            <div className="mt-2">
              <Badge tone={pass ? "ok" : "warn"}>
                {pass ? "Başarılı" : `Başarı eşiği %${passPercent} — tekrar çalışmanız önerilir`}
              </Badge>
            </div>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {items.map((it, i) => {
            const ok = answers[i] === it.answer;
            return (
              <div key={i} className="rounded-lg border border-line p-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className={ok ? "text-ok" : "text-err"}>{ok ? "✔" : "✘"}</span>
                  <div>
                    <p className="font-medium">
                      {i + 1}. {it.q}
                    </p>
                    {!ok && (
                      <p className="mt-1 text-err">
                        Sizin cevabınız: {answers[i] !== null && answers[i] !== undefined ? it.options[answers[i] as number] : "Boş"}
                      </p>
                    )}
                    <p className="mt-1 text-ok">Doğru cevap: {it.options[it.answer]}</p>
                    <p className="mt-1 text-muted">{it.explain}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Btn className="mt-4" variant="secondary" onClick={start}>
          Testi yeniden çöz
        </Btn>
      </div>
    );
  }

  const it = items[idx];
  const isLast = idx === items.length - 1;
  const correct = sel === it.answer;

  const check = () => {
    if (sel === null) return;
    setChecked(true);
  };
  const next = () => {
    const newAnswers = [...answers, sel];
    setAnswers(newAnswers);
    if (isLast) {
      const score = newAnswers.reduce<number>((s, a, i) => (a === items[i].answer ? s + 1 : s), 0);
      onFinish(score, items.length);
      setPhase("result");
    } else {
      setIdx(idx + 1);
      setSel(null);
      setChecked(false);
    }
  };

  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <div className="mb-3 flex items-center justify-between text-xs text-muted">
        <span>
          Soru {idx + 1} / {items.length}
        </span>
        <span>{title}</span>
      </div>
      <ProgressBar value={((idx + (checked ? 1 : 0)) / items.length) * 100} className="mb-4" />
      <p className="whitespace-pre-wrap text-[15px] font-medium leading-6">{it.q}</p>
      <div className="mt-4 grid gap-2">
        {it.options.map((o, i) => {
          let cls = "border-line hover:bg-soft";
          if (checked) {
            if (i === it.answer) cls = "border-ok bg-[#e3f3ec]";
            else if (i === sel) cls = "border-err bg-[#f8e5e5]";
            else cls = "border-line opacity-70";
          } else if (sel === i) cls = "border-brand bg-soft";
          return (
            <button
              key={i}
              type="button"
              disabled={checked}
              onClick={() => setSel(i)}
              className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition ${cls}`}
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[11px] font-semibold">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="whitespace-pre-wrap">{o}</span>
            </button>
          );
        })}
      </div>
      {checked && (
        <div
          className={`mt-4 rounded-lg border px-3 py-2.5 text-sm ${
            correct ? "border-ok/40 bg-[#e3f3ec] text-[#1b5f42]" : "border-err/40 bg-[#f8e5e5] text-[#8e3a3a]"
          }`}
        >
          <p className="font-semibold">{correct ? "Doğru cevap!" : "Yanlış cevap."}</p>
          {!correct && <p className="mt-1">Doğru seçenek: {it.options[it.answer]}</p>}
          <p className="mt-1">{it.explain}</p>
        </div>
      )}
      <div className="mt-4 flex justify-end">
        {!checked ? (
          <Btn onClick={check} disabled={sel === null}>
            Cevabı kontrol et
          </Btn>
        ) : (
          <Btn onClick={next}>{isLast ? "Sonucu gör" : "Sonraki soru →"}</Btn>
        )}
      </div>
    </div>
  );
}
