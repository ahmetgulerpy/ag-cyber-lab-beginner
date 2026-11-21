"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { LESSONS } from "@/content/lessons";
import type { Question } from "@/content/types";
import { QUIZZES } from "@/content/quizzes";
import { saveQuiz, setDone, useProgress, visitLesson } from "@/lib/progress";
import { Quiz } from "./Quiz";
import { Callout } from "./ui";

export type ExtraTab = { id: string; label: string; content: ReactNode };

export function LessonShell({ slug, topic, lab, extra = [] }: { slug: string; topic: ReactNode; lab: ReactNode; extra?: ExtraTab[] }) {
  const idx = LESSONS.findIndex((l) => l.slug === slug);
  const meta = LESSONS[idx];
  const questions: Question[] = QUIZZES[slug] ?? [];
  const p = useProgress();
  const lp = p.lessons[slug] ?? {};
  const [tab, setTab] = useState("topic");

  useEffect(() => {
    visitLesson(slug);
  }, [slug]);

  const tabs: ExtraTab[] = [
    { id: "topic", label: "📘 Konu", content: topic },
    { id: "lab", label: "🧪 Uygulama", content: lab },
    ...extra,
    {
      id: "quiz",
      label: "📝 Mini Test",
      content: <Quiz title={`Ders ${meta.no} testi`} questions={questions} onFinish={(r) => saveQuiz(slug, { score: r.score, total: r.total })} />,
    },
  ];
  const active = tabs.find((t) => t.id === tab) ?? tabs[0];
  const quizOk = lp.quiz ? lp.quiz.score / lp.quiz.total >= 0.6 : false;
  const prev = LESSONS[idx - 1];
  const next = LESSONS[idx + 1];

  return (
    <div className="space-y-6">
      <header className="card !p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-ag-brand to-ag-accent px-5 py-6 text-white sm:px-8">
          <p className="text-xs font-bold tracking-[0.25em] text-ag-light">DERS {meta.no} / 11</p>
          <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">{meta.title}</h1>
          <p className="mt-1 text-sm text-ag-light">{meta.sub} · yaklaşık {meta.min} dk</p>
        </div>
        <div className="flex flex-wrap gap-2 px-5 py-3 text-xs font-semibold sm:px-8">
          <span className={`chip ${lp.lab ? "!border-ag-ok/40 !bg-[#edf8f2] !text-ag-ok" : ""}`}>{lp.lab ? "✓" : "○"} Uygulama</span>
          <span className={`chip ${quizOk ? "!border-ag-ok/40 !bg-[#edf8f2] !text-ag-ok" : ""}`}>{lp.quiz ? `${quizOk ? "✓" : "○"} Test ${lp.quiz.score}/${lp.quiz.total}` : "○ Test"}</span>
          <span className={`chip ${lp.done ? "!border-ag-ok/40 !bg-[#edf8f2] !text-ag-ok" : ""}`}>{lp.done ? "✓ Ders tamamlandı" : "○ Ders devam ediyor"}</span>
        </div>
      </header>

      <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1" role="tablist">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={t.id === active.id} type="button" onClick={() => setTab(t.id)} className={`shrink-0 rounded-lg border px-4 py-2 text-sm font-semibold transition ${t.id === active.id ? "border-ag-brand bg-ag-brand text-white" : "border-ag-line bg-white text-ag-muted hover:bg-ag-light"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">{active.content}</div>

      <section className="card space-y-3">
        <h2 className="font-bold text-ag-text">Dersi bitirelim</h2>
        {!quizOk && <Callout kind="info">Dersi tamamlamak için mini testte en az %60 başarı yakalaman gerekiyor. Konu ve uygulama sekmelerine istediğin kadar dönebilirsin.</Callout>}
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={`btn ${lp.done ? "btn-ok" : "btn-primary"}`} disabled={!quizOk && !lp.done} onClick={() => setDone(slug, !lp.done)}>
            {lp.done ? "✓ Ders tamamlandı (geri al)" : "Dersi tamamlandı olarak işaretle"}
          </button>
          {tab !== "quiz" && (
            <button type="button" className="btn" onClick={() => setTab("quiz")}>
              Mini teste git
            </button>
          )}
        </div>
      </section>

      <nav className="flex justify-between gap-3" aria-label="Ders gezinmesi">
        {prev ? (
          <Link href={`/lesson/${prev.slug}`} className="btn">
            ← {prev.no}. {prev.title}
          </Link>
        ) : (
          <Link href="/" className="btn">
            ← Panele dön
          </Link>
        )}
        {next ? (
          <Link href={`/lesson/${next.slug}`} className="btn btn-primary">
            {next.no}. {next.title} →
          </Link>
        ) : (
          <Link href="/final" className="btn btn-primary">
            Final sınavına geç →
          </Link>
        )}
      </nav>
    </div>
  );
}
