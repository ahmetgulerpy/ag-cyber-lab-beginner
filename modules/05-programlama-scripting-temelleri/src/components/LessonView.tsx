"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { Lesson } from "@/data/types";
import { CURRICULUM, MODULE_NO, pad } from "@/data/curriculum";
import { TOTAL_LESSONS, useProgress } from "@/lib/storage";
import { Badge, Btn, Card, CodeBlock, Rich } from "./ui";
import Quiz from "./Quiz";
import { LABS } from "./labs";

export default function LessonView({ lesson }: { lesson: Lesson }) {
  const { progress, markLab, setLast, completeLesson, uncompleteLesson, saveQuiz } = useProgress();
  const id = lesson.id;
  const Lab = LABS[id];
  const prev = CURRICULUM.find((c) => c.id === id - 1);
  const next = CURRICULUM.find((c) => c.id === id + 1);
  const done = progress.completed.includes(id);
  const labDone = progress.labs.includes(id);
  const quiz = progress.quiz[id];
  const allDone = progress.completed.length >= TOTAL_LESSONS;

  useEffect(() => {
    setLast(id);
  }, [id, setLast]);

  return (
    <article className="space-y-6">
      <header className="rounded-2xl border border-line bg-white p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Modül {MODULE_NO}</Badge>
          <Badge tone="muted">
            Ders {pad(id)} / {TOTAL_LESSONS}
          </Badge>
          <Badge tone="muted">⏱ {lesson.duration}</Badge>
          {done && <Badge tone="ok">✓ Ders tamamlandı</Badge>}
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          {pad(id)}. {lesson.title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <a href="#konu" className="rounded-full border border-line px-3 py-1 text-muted hover:bg-soft">Konu anlatımı</a>
          <a href="#kod" className="rounded-full border border-line px-3 py-1 text-muted hover:bg-soft">Kod örnekleri</a>
          <a href="#lab" className="rounded-full border border-line px-3 py-1 text-muted hover:bg-soft">Laboratuvar {labDone ? "✓" : ""}</a>
          <a href="#senaryo" className="rounded-full border border-line px-3 py-1 text-muted hover:bg-soft">Senaryo</a>
          <a href="#test" className="rounded-full border border-line px-3 py-1 text-muted hover:bg-soft">
            Mini test {quiz ? `(${quiz.score}/${quiz.total})` : ""}
          </a>
          <a href="#ozet" className="rounded-full border border-line px-3 py-1 text-muted hover:bg-soft">Özet</a>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">Dersin amacı</h2>
          <p className="mt-2 text-[15px] leading-7 text-ink">{lesson.goal}</p>
        </Card>
        <Card>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">Öğrenme kazanımları</h2>
          <ul className="mt-2 space-y-1.5 text-sm leading-6">
            {lesson.outcomes.map((o, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-0.5 text-ok">✓</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <section id="konu" className="scroll-mt-24 space-y-4">
        <h2 className="text-xl font-bold">Detaylı konu anlatımı</h2>
        {lesson.sections.map((s, i) => (
          <Card key={i}>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-soft text-xs font-bold text-brand">
                {i + 1}
              </span>
              {s.title}
            </h3>
            <div className="mt-3 space-y-3 text-[15px] leading-7 text-[#2b4152]">
              {s.paras.map((p, j) => (
                <p key={j}>
                  <Rich text={p} />
                </p>
              ))}
              {s.bullets && (
                <ul className="space-y-1.5 border-l-2 border-accent/40 pl-4">
                  {s.bullets.map((b, j) => (
                    <li key={j}>
                      <Rich text={b} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Teknik terimler ve açıklamaları</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {lesson.terms.map((t, i) => (
            <div key={i} className="rounded-xl border border-line bg-white p-4">
              <p className="text-sm font-semibold text-brand">
                {t.tr} <span className="font-normal text-muted">({t.en})</span>
              </p>
              <p className="mt-1 text-sm leading-6 text-[#2b4152]">
                <Rich text={t.desc} />
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Gerçek hayattan örnekler</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {lesson.examples.map((e, i) => (
            <div key={i} className="rounded-xl border border-line bg-soft/60 p-4">
              <p className="text-sm font-semibold">{e.title}</p>
              <p className="mt-1 text-sm leading-6 text-[#2b4152]">
                <Rich text={e.text} />
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="kod" className="scroll-mt-24 space-y-3">
        <h2 className="text-xl font-bold">Kod örnekleri</h2>
        {lesson.code.map((c, i) => (
          <div key={i} className="space-y-2">
            <p className="text-sm font-semibold">{c.title}</p>
            <CodeBlock code={c.code} title={c.lang} />
            {c.note && (
              <p className="text-sm leading-6 text-muted">
                <Rich text={c.note} />
              </p>
            )}
          </div>
        ))}
      </section>

      <section id="lab" className="scroll-mt-24">
        <div className="rounded-2xl border-2 border-accent/40 bg-white p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold">Etkileşimli sanal laboratuvar</h2>
            <Badge tone={labDone ? "ok" : "info"}>{labDone ? "✓ Laboratuvar kullanıldı" : "Denemeye hazır"}</Badge>
          </div>
          {Lab ? <Lab onUse={() => markLab(id)} /> : null}
        </div>
      </section>

      <section id="senaryo" className="scroll-mt-24">
        <Card className="border-l-4 border-l-brand">
          <h2 className="text-xl font-bold">{lesson.scenario.title}</h2>
          <p className="mt-2 text-[15px] leading-7 text-[#2b4152]">{lesson.scenario.text}</p>
          <p className="mt-3 text-sm font-semibold">Yapılacaklar</p>
          <ol className="mt-1.5 list-decimal space-y-1.5 pl-5 text-sm leading-6">
            {lesson.scenario.tasks.map((t, i) => (
              <li key={i}>
                <Rich text={t} />
              </li>
            ))}
          </ol>
        </Card>
      </section>

      <section id="test" className="scroll-mt-24 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-bold">Mini değerlendirme testi</h2>
          {quiz && (
            <Badge tone="ok">
              Son: {quiz.score}/{quiz.total} · En iyi: {quiz.best}/{quiz.total}
            </Badge>
          )}
        </div>
        <Quiz
          questions={lesson.quiz}
          title={`Ders ${pad(id)} · ${lesson.title}`}
          onFinish={(score, total) => saveQuiz(id, score, total)}
        />
      </section>

      <section id="ozet" className="scroll-mt-24">
        <Card className="bg-soft/60">
          <h2 className="text-xl font-bold">Ders özeti</h2>
          <ul className="mt-3 space-y-1.5 text-[15px] leading-7">
            {lesson.summary.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-brand">▸</span>
                <span>
                  <Rich text={s} />
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">{done ? "Bu dersi tamamladınız." : "Dersi bitirdiniz mi?"}</p>
            <p className="text-sm text-muted">
              Laboratuvar: {labDone ? "✓" : "—"} · Mini test: {quiz ? `${quiz.score}/${quiz.total}` : "—"} · İlerlemeniz bu
              tarayıcıda saklanır.
            </p>
          </div>
          {done ? (
            <Btn variant="secondary" onClick={() => uncompleteLesson(id)}>
              Tamamlamayı geri al
            </Btn>
          ) : (
            <Btn variant="success" onClick={() => completeLesson(id)}>
              ✓ Dersi tamamla
            </Btn>
          )}
        </div>
        {done && allDone && (
          <div className="mt-4 rounded-lg border border-ok/30 bg-[#e3f3ec] p-3 text-sm text-[#1b5f42]">
            Tüm dersleri tamamladınız!{" "}
            <Link href="/tamamlama" className="font-semibold underline">
              Modül tamamlama ekranını görüntüleyin →
            </Link>
          </div>
        )}
      </Card>

      <nav className="grid gap-3 sm:grid-cols-2" aria-label="Ders gezinmesi">
        {prev ? (
          <Link href={`/ders/${prev.id}`} className="rounded-xl border border-line bg-white p-4 transition hover:bg-soft">
            <span className="text-xs text-muted">← Önceki ders</span>
            <span className="block font-semibold">
              {pad(prev.id)}. {prev.title}
            </span>
          </Link>
        ) : (
          <Link href="/" className="rounded-xl border border-line bg-white p-4 transition hover:bg-soft">
            <span className="text-xs text-muted">← Geri dön</span>
            <span className="block font-semibold">İlerleme paneli</span>
          </Link>
        )}
        {next ? (
          <Link
            href={`/ders/${next.id}`}
            className="rounded-xl border border-brand bg-brand p-4 text-white transition hover:bg-[#135a73] sm:text-right"
          >
            <span className="text-xs opacity-80">Sonraki derse geç →</span>
            <span className="block font-semibold">
              {pad(next.id)}. {next.title}
            </span>
          </Link>
        ) : (
          <Link
            href="/sinav"
            className="rounded-xl border border-brand bg-brand p-4 text-white transition hover:bg-[#135a73] sm:text-right"
          >
            <span className="text-xs opacity-80">Sıradaki adım →</span>
            <span className="block font-semibold">Genel sınav (20 soru)</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
