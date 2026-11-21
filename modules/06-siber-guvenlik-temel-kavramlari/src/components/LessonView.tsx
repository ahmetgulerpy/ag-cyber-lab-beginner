"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { LESSONS } from "@/data/lessons";
import { QUIZZES } from "@/data/questions";
import { actions, PASS_RATIO, useProgress } from "@/lib/progress";
import { VISUALS, LABS } from "./registry";
import Quiz from "./Quiz";
import { Callout, CompareCards, ConceptCards, ExampleCards, Predict, Section, TopicExplorer } from "./ui";

const SECTIONS = [
  ["kazanim", "Kazanımlar"],
  ["kavramlar", "Ana Kavramlar"],
  ["gorsel", "Görsel Anlatım"],
  ["detay", "Detaylı Konular"],
  ["ornekler", "Gerçek Hayat"],
  ["lab", "Laboratuvar"],
  ["senaryo", "Senaryo"],
  ["test", "Mini Test"],
  ["ozet", "Özet"],
] as const;

export default function LessonView({ id }: { id: string }) {
  const idx = LESSONS.findIndex((l) => l.id === id);
  const lesson = LESSONS[idx];
  const prev = LESSONS[idx - 1];
  const next = LESSONS[idx + 1];
  const { p, ready } = useProgress();
  const [labKey, setLabKey] = useState(0);
  const Visual = VISUALS[id];
  const Lab = LABS[id];
  const questions = QUIZZES[id];

  useEffect(() => {
    actions.visit(id);
  }, [id]);

  const onDone = useCallback(() => actions.markLab(id), [id]);
  const onFinish = useCallback((s: number, t: number) => actions.saveQuiz(id, s, t), [id]);

  const labDone = ready && !!p.labs[id];
  const quiz = ready ? p.quizzes[id] : undefined;
  const quizPass = !!quiz && quiz.score / quiz.total >= PASS_RATIO;
  const lessonDone = ready && !!p.completed[id];

  return (
    <article className="flex flex-col gap-10 pb-10">
      {/* Başlık */}
      <header className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-accent">
            Modül 06 · Ders {String(lesson.no).padStart(2, "0")} / 12
          </p>
          <div className="flex gap-2">
            {prev ? (
              <Link href={`/ders/${prev.id}`} className="btn-ghost !px-3 !py-1.5">← Önceki ders</Link>
            ) : null}
            {next ? (
              <Link href={`/ders/${next.id}`} className="btn-ghost !px-3 !py-1.5">Sonraki ders →</Link>
            ) : null}
          </div>
        </div>
        <div className="rounded-3xl border border-line bg-gradient-to-br from-white to-soft p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">DERS {String(lesson.no).padStart(2, "0")}</span>
            {lessonDone && <span className="rounded-full bg-ok px-3 py-1 text-xs font-bold text-white">✓ Tamamlandı</span>}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">{lesson.title}</h1>
          <p className="mt-1 text-base font-semibold text-brand">{lesson.en}</p>
          <p className="mt-4 max-w-3xl text-[15px] text-ink/85">{lesson.intro}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-ink">
            <span className="rounded-full border border-line bg-white px-3 py-1">⏱ ~{lesson.minutes} dk</span>
            <span className="rounded-full border border-line bg-white px-3 py-1">Seviye: Başlangıç</span>
            <span className="rounded-full border border-line bg-white px-3 py-1">🧪 1 etkileşimli laboratuvar</span>
            <span className="rounded-full border border-line bg-white px-3 py-1">📝 5 soruluk mini test</span>
          </div>
        </div>
        <nav className="sticky top-[65px] z-20 -mx-4 flex gap-2 overflow-x-auto border-b border-line bg-page/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          {SECTIONS.map(([sid, label], n) => (
            <a key={sid} href={`#${sid}`} className="chip shrink-0 !py-1 text-xs">
              <span className="mr-1.5 text-accent">{n + 1}</span>
              {label}
              {sid === "lab" && labDone && <span className="ml-1 text-ok">✓</span>}
              {sid === "test" && quizPass && <span className="ml-1 text-ok">✓</span>}
            </a>
          ))}
        </nav>
      </header>

      <Section id="kazanim" step="1" title="Dersin Amacı ve Öğrenme Kazanımları" subtitle="Bu dersin sonunda neleri yapabileceksin?">
        <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
          <div className="card border-l-4 !border-l-brand">
            <p className="label-mini text-brand">Dersin amacı</p>
            <p className="mt-2 text-sm text-ink/90">{lesson.goal}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {lesson.outcomes.map((o) => (
              <div key={o} className="flex gap-2.5 rounded-2xl border border-line bg-white p-4 text-sm text-ink/90">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-soft text-xs font-bold text-brand">✓</span>
                {o}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="kavramlar" step="2" title="Ana Kavramlar" subtitle="Derste karşılaşacağın temel terimler — Türkçe ve İngilizce karşılıklarıyla.">
        <ConceptCards items={lesson.concepts} />
      </Section>

      <Section id="gorsel" step="3" title={`Görsel Anlatım: ${lesson.visualTitle}`} subtitle={lesson.visualHint}>
        <div className="card !p-4 sm:!p-6">
          <Visual />
        </div>
      </Section>

      <Section id="detay" step="4" title="Detaylı Konu Açıklamaları" subtitle="Konuları kendi hızında incele: soldan bir başlık seç ya da sırayla ilerle.">
        <div className="flex flex-col gap-8">
          <TopicExplorer topics={lesson.topics} />
          {lesson.compare && <CompareCards data={lesson.compare} />}
        </div>
      </Section>

      <Section id="ornekler" step="5" title="Gerçek Hayat Örnekleri" subtitle="Kavramlar pratikte nasıl karşımıza çıkar?">
        <ExampleCards items={lesson.examples} />
      </Section>

      <Section id="lab" step="6" title={lesson.labTitle} subtitle={lesson.labIntro}>
        <div className="flex flex-col gap-5">
          <Lab key={labKey} onDone={onDone} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className={`text-sm font-semibold ${labDone ? "text-ok" : "text-muted"}`}>
              {labDone ? "✓ Laboratuvar tamamlandı ve kaydedildi." : "Laboratuvarı tamamladığında ilerlemene kaydedilir."}
            </p>
            <button className="btn-ghost !py-1.5" onClick={() => setLabKey((k) => k + 1)}>↻ Laboratuvarı sıfırla</button>
          </div>
          {labDone && (
            <div className="fade-in card border-l-4 !border-l-ok">
              <p className="label-mini text-ok">Laboratuvar sonuç bölümü · Neler öğrendin?</p>
              <ul className="mt-2 flex flex-col gap-2">
                {lesson.labResult.map((r) => (
                  <li key={r} className="flex gap-2 text-sm text-ink/90">
                    <span className="text-ok">✓</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Section>

      <Section id="senaryo" step="7" title="Senaryo Tabanlı Uygulama" subtitle="Önce tahmin et, sonra cevabı ve gerekçesini gör.">
        <Predict data={lesson.scenario} />
      </Section>

      <Section id="test" step="8" title="Mini Değerlendirme" subtitle="5 soru · Başarı eşiği %60 · Her cevaptan sonra açıklama göreceksin.">
        <div className="flex flex-col gap-4">
          {quiz && (
            <p className={`rounded-xl border px-4 py-2 text-sm font-semibold ${quizPass ? "border-ok/40 bg-[#E9F5EF] text-ok" : "border-warn/40 bg-[#FBF4E4] text-warn"}`}>
              Kayıtlı en iyi sonuç: {quiz.score}/{quiz.total} (%{Math.round((quiz.score / quiz.total) * 100)}) {quizPass ? "· Başarılı" : "· Başarı eşiğinin altında, tekrar dene"}
            </p>
          )}
          <Quiz questions={questions} onFinish={onFinish} />
        </div>
      </Section>

      <Section id="ozet" step="9" title="Ders Özeti" subtitle="Bu dersten aklında kalması gerekenler.">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="card flex flex-col gap-2.5">
            {lesson.summary.map((s, i) => (
              <div key={s} className="flex gap-3 text-sm text-ink/90">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">{i + 1}</span>
                {s}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <div className="card">
              <p className="label-mini mb-2">Ders tamamlama durumu</p>
              <ul className="flex flex-col gap-1.5 text-sm">
                <li className={labDone ? "text-ok" : "text-muted"}>{labDone ? "✓" : "○"} Laboratuvar tamamlandı</li>
                <li className={quizPass ? "text-ok" : "text-muted"}>{quizPass ? "✓" : "○"} Mini test başarıyla geçildi (≥ %60)</li>
              </ul>
              {lessonDone ? (
                <p className="mt-3 rounded-lg bg-[#E9F5EF] px-3 py-2 text-sm font-semibold text-ok">Bu ders tamamlandı!</p>
              ) : (
                <p className="mt-3 text-xs text-muted">Her iki adım da bittiğinde ders otomatik olarak tamamlanır.</p>
              )}
            </div>
            <Callout kind="recall" text="Anlamadığın bir yer kaldıysa Konu Gezgini'ne dönüp ilgili başlığı yeniden incele; laboratuvarı istediğin kadar tekrar çalıştırabilirsin." />
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4">
          {prev ? (
            <Link href={`/ders/${prev.id}`} className="btn-ghost">← Önceki: {prev.title}</Link>
          ) : (
            <Link href="/" className="btn-ghost">← Eğitim Paneli</Link>
          )}
          {next ? (
            <Link href={`/ders/${next.id}`} className="btn-primary">Sonraki ders: {next.title} →</Link>
          ) : (
            <Link href="/sinav" className="btn-primary">Genel Sınava Geç →</Link>
          )}
        </div>
      </Section>
    </article>
  );
}
