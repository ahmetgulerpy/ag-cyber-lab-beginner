"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { Lesson } from "@/data/types";
import { lessons } from "@/data/lessons";
import { Badge, Btn, Callout, Card } from "@/components/ui";
import { LabFor } from "@/components/labs";
import { MiniQuiz } from "@/components/MiniQuiz";
import { toggleLesson, useProgress } from "@/lib/storage";

function Section({ id, title, icon, children }: { id?: string; title: string; icon: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <Card className="p-5 sm:p-7">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft text-base">{icon}</span>
          {title}
        </h2>
        {children}
      </Card>
    </section>
  );
}

export function LessonView({ lesson }: { lesson: Lesson }) {
  const prog = useProgress();
  const done = prog.completed.includes(lesson.id);
  const prev = lessons.find((l) => l.id === lesson.id - 1);
  const next = lessons.find((l) => l.id === lesson.id + 1);
  const labDone = prog.labs[lesson.id]?.done;
  const quiz = prog.quiz[lesson.id];

  const nav = [
    ["#amac", "Amaç"],
    ["#anlatim", "Anlatım"],
    ["#kavramlar", "Kavramlar"],
    ["#ornekler", "Örnekler"],
    ["#lab", "Laboratuvar"],
    ["#test", "Mini Test"],
    ["#ozet", "Özet"],
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
      <nav className="mb-4 text-sm text-muted" aria-label="Konum">
        <Link href="/" className="font-semibold text-brand hover:underline">Panel</Link> <span>/</span> Modül 03 <span>/</span> Ders {String(lesson.id).padStart(2, "0")}
      </nav>

      <div className="mb-6 -mx-4 overflow-x-auto px-4">
        <div className="flex min-w-max gap-1.5">
          {lessons.map((l) => {
            const c = prog.completed.includes(l.id);
            const active = l.id === lesson.id;
            return (
              <Link key={l.id} href={`/ders/${l.id}`} title={l.title} className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-bold transition ${active ? "border-brand bg-brand text-white" : c ? "border-ok/40 bg-[#E9F5EF] text-ok" : "border-line bg-white text-ink hover:bg-soft"}`}>
                {c && !active ? "✓" : l.id}
              </Link>
            );
          })}
        </div>
      </div>

      <header className="mb-6 rounded-2xl border border-line bg-gradient-to-br from-white to-soft p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Modül 03 · Ders {String(lesson.id).padStart(2, "0")}</Badge>
          <Badge tone="muted">Başlangıç</Badge>
          <Badge tone="muted">⏱ Tahmini süre: {lesson.minutes} dk</Badge>
          {done && <Badge tone="ok">✔ Tamamlandı</Badge>}
        </div>
        <h1 className="mt-3 text-2xl font-extrabold text-ink sm:text-3xl">{lesson.title}</h1>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
          <span className={`rounded-full px-3 py-1 ${labDone ? "bg-[#E9F5EF] text-ok" : "bg-white text-muted"}`}>{labDone ? "✔" : "○"} Laboratuvar</span>
          <span className={`rounded-full px-3 py-1 ${quiz ? "bg-[#E9F5EF] text-ok" : "bg-white text-muted"}`}>{quiz ? `✔ Mini test ${quiz.score}/${quiz.total}` : "○ Mini test"}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {nav.map(([h, t]) => <a key={h} href={h} className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-brand hover:bg-soft">{t}</a>)}
        </div>
      </header>

      <div className="space-y-6">
        <Section id="amac" title="Dersin Amacı ve Öğrenme Kazanımları" icon="🎯">
          <p className="mb-4 leading-relaxed">{lesson.purpose}</p>
          <p className="mb-2 text-sm font-bold text-brand">Bu dersin sonunda şunları yapabileceksin:</p>
          <ul className="space-y-2">
            {lesson.outcomes.map((o) => <li key={o} className="flex gap-2 text-[15px]"><span className="text-accent">✔</span>{o}</li>)}
          </ul>
        </Section>

        <Section id="anlatim" title="Konu Anlatımı" icon="📖">
          <div className="space-y-6">
            {lesson.sections.map((s) => (
              <div key={s.h}>
                <h3 className="mb-2 text-lg font-bold text-brand">{s.h}</h3>
                <div className="space-y-3 text-[15px] leading-7 text-ink">{s.p.map((p, i) => <p key={i}>{p}</p>)}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="kavramlar" title="Temel Teknik Kavramlar" icon="🧩">
          <dl className="grid gap-3 sm:grid-cols-2">
            {lesson.concepts.map(([t, d]) => (
              <div key={t} className="rounded-xl border border-line bg-page p-3">
                <dt className="font-bold text-brand">{t}</dt>
                <dd className="mt-0.5 text-sm text-ink">{d}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="Günlük Hayattan Örnekler" icon="🏠">
          <ul className="grid gap-3 sm:grid-cols-2">
            {lesson.daily.map((d) => <li key={d} className="rounded-xl bg-soft p-4 text-sm leading-relaxed">{d}</li>)}
          </ul>
        </Section>

        <Section id="ornekler" title="Teknik Örnekler" icon="🛠️">
          <div className="space-y-5">
            {lesson.examples.map((e) => (
              <div key={e.title}>
                <p className="mb-2 font-bold">{e.title}</p>
                <pre className="overflow-x-auto rounded-xl border border-line bg-[#F0F5F8] p-4 text-[13px] leading-relaxed text-ink">{e.code}</pre>
                <p className="mt-2 text-sm text-muted">💡 {e.note}</p>
              </div>
            ))}
          </div>
        </Section>

        <section id="lab" className="scroll-mt-24 space-y-4">
          <Card className="p-5 sm:p-7">
            <h2 className="mb-3 flex items-center gap-2 text-xl font-bold"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-soft">🔬</span> Etkileşimli Sanal Laboratuvar: {lesson.labTitle}</h2>
            <p className="mb-2 text-sm font-bold text-brand">Uygulama yönergeleri</p>
            <ol className="mb-5 list-inside list-decimal space-y-1.5 text-[15px]">
              {lesson.steps.map((s) => <li key={s}>{s}</li>)}
            </ol>
            <LabFor id={lesson.id} />
            <div className="mt-5">
              <p className="mb-2 text-sm font-bold text-brand">Uygulama sonrası açıklamalar</p>
              <Callout title="Laboratuvardan ne öğrendik?">
                <ul className="list-inside list-disc space-y-1">{lesson.after.map((a) => <li key={a}>{a}</li>)}</ul>
              </Callout>
            </div>
          </Card>
        </section>

        <Section id="test" title="Mini Değerlendirme Testi (5 Soru)" icon="📝">
          <MiniQuiz lessonId={lesson.id} questions={lesson.quiz} />
        </Section>

        <Section id="ozet" title="Ders Özeti" icon="📌">
          <ul className="space-y-2">{lesson.summary.map((s) => <li key={s} className="flex gap-2"><span className="text-accent">●</span>{s}</li>)}</ul>
        </Section>

        <Card className="p-5 sm:p-7">
          <h2 className="mb-3 text-xl font-bold">Sonraki Derse Geçiş</h2>
          <p className="mb-4 text-sm text-muted">
            {done ? "Bu dersi tamamladın. " : "Laboratuvarı ve mini testi bitirdiysen dersi tamamlandı olarak işaretle. "}
            {next ? <>Sıradaki ders: <b className="text-ink">Ders {String(next.id).padStart(2, "0")} – {next.title}</b></> : "Bu son ders! Şimdi final sınavına hazırsın."}
          </p>
          <div className="flex flex-wrap gap-2">
            {prev && <Link href={`/ders/${prev.id}`} className="inline-flex min-h-[40px] items-center rounded-xl border border-line bg-white px-4 text-sm font-semibold hover:bg-soft">← {String(prev.id).padStart(2, "0")} {prev.title}</Link>}
            <Btn variant={done ? "ghost" : "ok"} onClick={() => toggleLesson(lesson.id)}>{done ? "↺ Tamamlandı işaretini kaldır" : "✔ Dersi Tamamla"}</Btn>
            {next ? (
              <Link href={`/ders/${next.id}`} onClick={() => toggleLesson(lesson.id, true)} className="inline-flex min-h-[40px] items-center rounded-xl bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-dark">Tamamla ve {String(next.id).padStart(2, "0")} {next.title} →</Link>
            ) : (
              <Link href="/final" onClick={() => toggleLesson(lesson.id, true)} className="inline-flex min-h-[40px] items-center rounded-xl bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-dark">Tamamla ve Final Sınavına Geç →</Link>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
