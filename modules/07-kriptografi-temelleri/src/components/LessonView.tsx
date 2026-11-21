"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ActivityView } from "@/components/activities";
import { Quiz } from "@/components/Quiz";
import { Visual } from "@/components/Visuals";
import { LABS } from "@/components/labs";
import { Callout, Card, Pill, SectionHead, cx } from "@/components/ui";
import { LESSONS } from "@/data/lessons";
import { PRACTICES, SCENARIOS } from "@/data/practices";
import { LESSON_QUIZ } from "@/data/quizzes";
import { useProgress } from "@/lib/progress";

export function LessonView({ id }: { id: number }) {
  const lesson = LESSONS.find((l) => l.id === id)!;
  const { visit, data, saveQuiz, lessonStatus } = useProgress();
  const Lab = LABS[id];
  const prev = LESSONS.find((l) => l.id === id - 1);
  const next = LESSONS.find((l) => l.id === id + 1);
  const st = lessonStatus(id);

  useEffect(() => {
    visit(id);
  }, [id, visit]);

  const NavButtons = () => (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {prev ? (
        <Link href={`/ders/${prev.id}`} className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:border-brand hover:text-brand">
          ← Önceki ders: {prev.title}
        </Link>
      ) : (
        <Link href="/" className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:border-brand hover:text-brand">
          ← Ana sayfa
        </Link>
      )}
      {next ? (
        <Link href={`/ders/${next.id}`} className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-[#125870]">
          Sonraki ders: {next.title} →
        </Link>
      ) : (
        <Link href="/sinav" className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-[#125870]">
          Genel sınava geç →
        </Link>
      )}
    </div>
  );

  const anchors: [string, string][] = [
    ["kazanim", "Kazanımlar"],
    ["kavram", "Kavramlar"],
    ["gorsel", "Görsel anlatım"],
    ["detay", "Detaylar"],
    ["ornek", "Gerçek hayat"],
    ["lab", "🧪 Laboratuvar"],
    ["senaryo", "Senaryo"],
    ["pratik", "Mini pratik"],
    ["test", "Mini test"],
    ["ozet", "Özet"],
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* 1. Başlık */}
      <section className="rounded-2xl border border-line bg-gradient-to-br from-white to-soft p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="brand">Ders {String(id).padStart(2, "0")} / 12</Pill>
          <Pill tone="neutral">⏱ ~{lesson.minutes} dk</Pill>
          <Pill tone="neutral">Başlangıç seviyesi</Pill>
          {st.done && <Pill tone="ok">✓ Tamamlandı</Pill>}
        </div>
        <h1 className="mt-4 text-3xl font-bold text-ink sm:text-4xl">
          <span aria-hidden className="mr-2">
            {lesson.emoji}
          </span>
          {lesson.title}
        </h1>
        <p className="mt-1 text-sm font-medium text-accent">{lesson.en}</p>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink/90">{lesson.intro}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <a href="#lab" className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-[#125870]">
            🧪 Laboratuvara git
          </a>
          <a href="#test" className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:border-brand">
            Mini teste git
          </a>
        </div>
      </section>

      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {anchors.map(([a, l]) => (
          <a key={a} href={`#${a}`} className="shrink-0 rounded-full border border-line bg-white px-3 py-1 text-xs text-muted hover:border-brand hover:text-brand">
            {l}
          </a>
        ))}
      </div>

      {/* 2. Kazanımlar */}
      <Card id="kazanim" className="scroll-mt-24">
        <SectionHead step="02" title="Öğrenme kazanımları" sub="Bu dersin sonunda şunları yapabileceksin:" />
        <ul className="grid gap-3 sm:grid-cols-2">
          {lesson.outcomes.map((o) => (
            <li key={o} className="flex gap-3 rounded-xl bg-bg p-3 text-sm">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent text-[11px] text-white">✓</span>
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* 3. Temel kavramlar */}
      <section id="kavram" className="scroll-mt-24">
        <SectionHead step="03" title="Temel kavramlar" sub="Türkçe terim ve İngilizce karşılığıyla birlikte." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lesson.concepts.map((c) => (
            <div key={c.t} className="rounded-2xl border border-line bg-white p-4">
              <p className="text-base font-semibold text-brand">{c.t}</p>
              <p className="mb-2 text-xs font-medium text-accent">({c.en})</p>
              <p className="text-sm text-muted">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Görsel anlatım */}
      <Card id="gorsel" className="scroll-mt-24">
        <SectionHead step="04" title={`Görsel anlatım: ${lesson.visualTitle}`} sub={lesson.visualNote} />
        <Visual lessonId={id} />
      </Card>

      {/* 5. Detaylı konu açıklamaları */}
      <section id="detay" className="scroll-mt-24">
        <SectionHead step="05" title="Detaylı konu açıklamaları" sub="Küçük bloklar hâlinde teknik detaylar." />
        <div className="grid gap-4 md:grid-cols-2">
          {lesson.topics.map((t, i) => (
            <div key={t.title} className="rounded-2xl border border-line bg-white p-5">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-soft text-xs text-brand">{i + 1}</span>
                {t.title}
              </p>
              <ul className="space-y-1.5 text-sm text-muted">
                {t.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
          <p className="border-b border-line bg-bg px-5 py-3 text-sm font-semibold text-ink">📊 {lesson.compare.title}</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="bg-soft text-xs uppercase tracking-wide text-brand">
                  {lesson.compare.cols.map((c) => (
                    <th key={c} className="px-4 py-2.5 font-semibold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lesson.compare.rows.map((r, i) => (
                  <tr key={i} className="border-t border-line">
                    {r.map((c, j) => (
                      <td key={j} className={cx("px-4 py-2.5", j === 0 ? "font-medium text-ink" : "text-muted")}>
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {lesson.important.map((c) => (
            <Callout key={c.title} kind={c.kind} title={c.title}>
              {c.text}
            </Callout>
          ))}
        </div>
      </section>

      {/* 6. Gerçek hayat */}
      <section id="ornek" className="scroll-mt-24">
        <SectionHead step="06" title="Gerçek hayat örnekleri" />
        <div className="grid gap-4 md:grid-cols-3">
          {lesson.examples.map((e) => (
            <div key={e.title} className="rounded-2xl border border-line bg-white p-5">
              <p className="text-2xl" aria-hidden>
                {e.icon}
              </p>
              <p className="mt-1 text-sm font-semibold text-ink">{e.title}</p>
              <p className="mt-1 text-sm text-muted">{e.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Laboratuvar */}
      <section id="lab" className="scroll-mt-24">
        <SectionHead step="07" title="Uygulamalı laboratuvar" sub="Öğrenmenin en önemli kısmı: kendin dene, parametreleri değiştir, sonuçları karşılaştır." />
        <Lab />
      </section>

      {/* 8. Senaryo */}
      <section id="senaryo" className="scroll-mt-24">
        <SectionHead step="08" title="Senaryo tabanlı çalışma" sub="Gerçekçi bir durumda karar ver." />
        <ActivityView lessonId={id} spec={SCENARIOS[id]} kind="scenario" />
      </section>

      {/* Ek pratik */}
      <section id="pratik" className="scroll-mt-24">
        <SectionHead title="Ek mini pratik" sub="Öğrendiklerini pekiştir." />
        <ActivityView lessonId={id} spec={PRACTICES[id]} kind="practice" />
      </section>

      {/* 9. Mini test */}
      <Card id="test" className="scroll-mt-24">
        <SectionHead step="09" title="Mini değerlendirme" sub="5 soru · her cevaptan sonra açıklama" />
        <Quiz questions={LESSON_QUIZ[id]} title={`Ders ${id} mini testi`} prev={data.quizzes[id]} onFinish={(r) => saveQuiz(id, r)} />
      </Card>

      {/* 10. Özet */}
      <Card id="ozet" className="scroll-mt-24">
        <SectionHead step="10" title="Ders özeti" />
        <ul className="grid gap-3 sm:grid-cols-2">
          {lesson.summary.map((s) => (
            <li key={s} className="flex gap-3 rounded-xl bg-soft p-3 text-sm">
              <span className="text-brand">★</span>
              {s}
            </li>
          ))}
        </ul>
        <div className="mt-5 rounded-xl border border-line bg-bg p-4">
          <p className="mb-2 text-sm font-semibold text-ink">Ders tamamlama durumu</p>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["Ana laboratuvar", st.lab],
                ["Ek mini pratik", st.practice],
                ["Mini test", st.quiz],
                ["Senaryo (isteğe bağlı)", st.scenario],
              ] as [string, boolean][]
            ).map(([l, ok]) => (
              <Pill key={l} tone={ok ? "ok" : "neutral"}>
                {ok ? "✓" : "○"} {l}
              </Pill>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">{st.done ? "Bu ders tamamlandı. Tebrikler!" : "Laboratuvar, ek pratik ve mini testi tamamladığında ders otomatik olarak tamamlanır."}</p>
        </div>
      </Card>

      <NavButtons />
    </div>
  );
}
