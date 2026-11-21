"use client";

import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Cpu,
  Lightbulb,
  Target,
} from "lucide-react";
import type { Lesson, LessonMeta, ModuleSummary, Question } from "@/content/types";
import { pad } from "@/content/helpers";
import { completeLesson, markActivityDone, saveQuizResult, visitLesson } from "@/lib/progress";
import { computeStats, useModuleProgress } from "@/lib/use-progress";
import { ActivityRunner } from "./activities/ActivityRunner";
import { Quiz, type ReviewLink } from "./Quiz";
import { Badge, btnPrimary, btnSecondary, Card, ProgressBar, SectionTitle, TerminalBlock, toneBox } from "./ui";

interface Props {
  summary: ModuleSummary;
  lesson: Lesson;
}

function LessonNav({ summary, currentId }: { summary: ModuleSummary; currentId: number }) {
  const { progress, hydrated } = useModuleProgress(summary.id);
  const stats = computeStats(summary, progress);
  const base = `/modules/${summary.slug}`;
  return (
    <nav aria-label="Dersler">
      <div className="mb-3">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-semibold text-ink">{summary.title}</span>
          <span className="tabular-nums text-muted">%{hydrated ? stats.percent : 0}</span>
        </div>
        <ProgressBar value={hydrated ? stats.percent : 0} />
      </div>
      <ol className="space-y-1">
        {summary.lessons.map((l) => {
          const done = hydrated && progress.completedLessons.includes(l.id);
          const active = l.id === currentId;
          return (
            <li key={l.id}>
              <Link
                href={`${base}/lessons/${l.id}`}
                aria-current={active ? "page" : undefined}
                className={`flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-sm leading-snug transition-colors ${active ? "bg-soft font-semibold text-brand" : "text-ink/80 hover:bg-bg"}`}
              >
                {done ? (
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" aria-label="Tamamlandı" />
                ) : (
                  <Circle size={16} className={`mt-0.5 shrink-0 ${active ? "text-brand" : "text-slate-300"}`} aria-label="Tamamlanmadı" />
                )}
                <span>
                  <span className="font-mono text-[11px] text-muted">{pad(l.id)} </span>
                  {l.title}
                </span>
              </Link>
            </li>
          );
        })}
        <li>
          <Link
            href={`${base}/final`}
            className="mt-1 flex items-center gap-2.5 rounded-lg border border-dashed border-line px-2.5 py-2 text-sm text-ink/80 hover:border-brand hover:text-brand"
          >
            <BookOpenCheck size={16} className="shrink-0" aria-hidden /> Genel değerlendirme
          </Link>
        </li>
      </ol>
    </nav>
  );
}

function StepBlock({
  icon,
  label,
  children,
  tone,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  tone: string;
}) {
  return (
    <div className="flex gap-3">
      <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tone}`}>{icon}</span>
      <div className="min-w-0">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</h4>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}

export function LessonView({ summary, lesson }: Props) {
  const { progress, hydrated } = useModuleProgress(summary.id);
  const base = `/modules/${summary.slug}`;
  const idx = summary.lessons.findIndex((l) => l.id === lesson.id);
  const prev: LessonMeta | undefined = summary.lessons[idx - 1];
  const next: LessonMeta | undefined = summary.lessons[idx + 1];

  useEffect(() => {
    visitLesson(summary.id, lesson.id);
  }, [summary.id, lesson.id]);

  const activityDone = hydrated && progress.activities.includes(lesson.id);
  const quizResult = hydrated ? progress.quizzes[String(lesson.id)] : undefined;
  const lessonDone = hydrated && progress.completedLessons.includes(lesson.id);
  const canComplete = activityDone && !!quizResult;

  const getReviewLink = (q: Question): ReviewLink | null => {
    const i = lesson.topics.findIndex((t) => t.title === q.topic);
    return i >= 0 ? { label: `Konu anlatımında tekrar oku: ${q.topic}`, href: `#topic-${i}` } : null;
  };

  const chips = [
    { href: "#konu", label: "Konu anlatımı" },
    { href: "#ornekler", label: "Gerçek hayat" },
    { href: "#kavramlar", label: "Kavramlar" },
    { href: "#uygulama", label: "Uygulama" },
    { href: "#test", label: "Mini test" },
    { href: "#ozet", label: "Özet" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <nav aria-label="Konum" className="mb-4 flex flex-wrap items-center gap-1 text-xs text-muted">
        <Link href="/" className="hover:text-brand">Ana sayfa</Link>
        <ChevronRight size={12} aria-hidden />
        <Link href={base} className="hover:text-brand">{summary.title}</Link>
        <ChevronRight size={12} aria-hidden />
        <span className="font-semibold text-ink">Ders {pad(lesson.id)}</span>
      </nav>

      <details className="mb-5 rounded-xl border border-line bg-white p-3 lg:hidden">
        <summary className="cursor-pointer text-sm font-semibold text-ink">
          Dersler ve ilerleme ({hydrated ? progress.completedLessons.length : 0}/{summary.lessons.length} tamamlandı)
        </summary>
        <div className="mt-3">
          <LessonNav summary={summary} currentId={lesson.id} />
        </div>
      </details>

      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border border-line bg-white p-3.5">
            <LessonNav summary={summary} currentId={lesson.id} />
          </div>
        </aside>

        <div className="min-w-0 space-y-12">
          {/* Başlık */}
          <header>
            <Card className="p-5 sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
                  Modül {summary.code} · Ders {pad(lesson.id)} / {pad(summary.lessons.length)}
                </span>
                <Badge>{summary.level}</Badge>
                <Badge tone="neutral">
                  <Clock size={11} aria-hidden /> Tahmini süre: ~{lesson.minutes} dk
                </Badge>
                {lessonDone && <Badge tone="success">Tamamlandı</Badge>}
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{lesson.title}</h1>
              <p className="mt-1 text-base text-muted">{lesson.subtitle}</p>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <h2 className="flex items-center gap-2 text-sm font-bold text-ink">
                    <Target size={16} className="text-brand" aria-hidden /> Dersin amacı
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/85">{lesson.goal}</p>
                </div>
                <div>
                  <h2 className="flex items-center gap-2 text-sm font-bold text-ink">
                    <BookOpenCheck size={16} className="text-brand" aria-hidden /> Bu derste neler öğreneceksin?
                  </h2>
                  <ul className="mt-1.5 space-y-1.5">
                    {lesson.outcomes.map((o) => (
                      <li key={o} className="flex gap-2 text-sm leading-relaxed text-ink/85">
                        <CheckCircle2 size={15} className="mt-1 shrink-0 text-accent" aria-hidden />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Ders bölümleri">
              {chips.map((c) => (
                <li key={c.href}>
                  <a
                    href={c.href}
                    className="inline-block rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-ink/80 hover:border-brand hover:text-brand"
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </header>

          {/* Konu anlatımı */}
          <section aria-labelledby="konu-baslik">
            <SectionTitle eyebrow="1 · Öğren" title="Konu anlatımı" id="konu" />
            <p className="sr-only" id="konu-baslik">Konu anlatımı</p>
            <div className="space-y-6">
              {lesson.topics.map((t, i) => (
                <article key={t.title} id={`topic-${i}`} className="rounded-xl border border-line bg-white p-5 sm:p-6">
                  <h3 className="text-lg font-bold text-ink">
                    <span className="mr-2 font-mono text-sm font-medium text-accent">{pad(i + 1)}</span>
                    {t.title}
                  </h3>
                  {t.en && <p className="ml-7 font-mono text-xs text-muted">{t.en}</p>}
                  <div className="mt-5 space-y-5">
                    <StepBlock icon={<Lightbulb size={16} />} label="Basit anlatım" tone="bg-warn-soft text-warn-ink">
                      <p className="lesson-text text-[15px] text-ink/90">{t.simple}</p>
                    </StepBlock>
                    <StepBlock icon={<Cpu size={16} />} label="Teknik açıklama" tone="bg-soft text-brand">
                      <p className="lesson-text text-[15px] text-ink/90">{t.technical}</p>
                    </StepBlock>
                    <StepBlock icon={<Briefcase size={16} />} label="Gerçek hayattan örnek" tone="bg-success-soft text-success">
                      <p className="lesson-text text-[15px] text-ink/90">{t.example}</p>
                    </StepBlock>
                    {t.terminal && <TerminalBlock terminal={t.terminal} />}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Gerçek hayattan örnekler */}
          <section>
            <SectionTitle eyebrow="2 · Bağlam" title="Gerçek hayattan örnekler" id="ornekler" />
            <div className="grid gap-4 md:grid-cols-2">
              {lesson.examples.map((e) => (
                <Card key={e.title} className="p-5">
                  <h3 className="text-base font-bold text-ink">{e.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/85">{e.text}</p>
                  <p className={`mt-3 rounded-lg border p-3 text-sm leading-relaxed ${toneBox.info}`}>
                    <strong className="text-brand">Çıkarım: </strong>
                    {e.takeaway}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          {/* Kavramlar */}
          <section>
            <SectionTitle eyebrow="3 · Sözlük" title="Önemli kavramlar" id="kavramlar" />
            <dl className="grid gap-3 sm:grid-cols-2">
              {lesson.concepts.map((c) => (
                <div key={c.term} className="rounded-lg border border-line bg-white p-4">
                  <dt className="text-sm font-bold text-ink">
                    {c.term} {c.en && <span className="font-mono text-xs font-normal text-muted">({c.en})</span>}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink/80">{c.definition}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Uygulama */}
          <section>
            <SectionTitle eyebrow="4 · Uygula" title="Etkileşimli uygulama" id="uygulama" />
            {activityDone && (
              <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success">
                <CheckCircle2 size={13} aria-hidden /> Bu uygulamayı daha önce tamamladın; istediğin kadar tekrar deneyebilirsin.
              </p>
            )}
            <Card className="p-4 sm:p-6">
              <ActivityRunner activity={lesson.activity} onComplete={() => markActivityDone(summary.id, lesson.id)} />
            </Card>
          </section>

          {/* Mini test */}
          <section>
            <SectionTitle eyebrow="5 · Değerlendir" title="Mini değerlendirme" id="test" />
            <Quiz
              questions={lesson.quiz}
              kind="mini"
              passPercent={60}
              previous={
                quizResult
                  ? {
                      score: quizResult.score,
                      total: quizResult.total,
                      attempts: quizResult.attempts,
                      best: `${quizResult.bestScore}/${quizResult.total}`,
                    }
                  : null
              }
              getReviewLink={getReviewLink}
              onFinish={(score, wrong) =>
                saveQuizResult(summary.id, lesson.id, score, lesson.quiz.length, [...new Set(wrong.map((w) => w.topic))])
              }
            />
          </section>

          {/* Özet */}
          <section>
            <SectionTitle eyebrow="6 · Pekiştir" title="Ders özeti" id="ozet" />
            <Card className="p-5 sm:p-6">
              <ul className="space-y-2.5">
                {lesson.summary.map((s) => (
                  <li key={s} className="flex gap-3 text-[15px] leading-relaxed text-ink/90">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-success" aria-hidden />
                    {s}
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          {/* Tamamla ve devam et */}
          <section aria-label="Dersi tamamla">
            <Card className="p-5 sm:p-6">
              <h2 className="text-lg font-bold text-ink">
                {lessonDone ? "Bu dersi tamamladın" : "Dersi tamamla"}
              </h2>
              {!lessonDone && (
                <ul className="mt-3 space-y-1.5 text-sm">
                  <li className={`flex items-center gap-2 ${activityDone ? "text-success" : "text-muted"}`}>
                    {activityDone ? <CheckCircle2 size={16} aria-hidden /> : <Circle size={16} aria-hidden />}
                    Etkileşimli uygulamayı tamamla
                  </li>
                  <li className={`flex items-center gap-2 ${quizResult ? "text-success" : "text-muted"}`}>
                    {quizResult ? <CheckCircle2 size={16} aria-hidden /> : <Circle size={16} aria-hidden />}
                    Mini testi bitir (sonuç ne olursa olsun, tekrar çözebilirsin)
                  </li>
                </ul>
              )}
              <div className="mt-5 flex flex-wrap gap-2.5">
                {!lessonDone && (
                  <button className={btnPrimary} disabled={!canComplete} onClick={() => completeLesson(summary.id, lesson.id)}>
                    <CheckCircle2 size={16} aria-hidden /> Dersi tamamlandı olarak işaretle
                  </button>
                )}
                {next ? (
                  <Link href={`${base}/lessons/${next.id}`} className={lessonDone ? btnPrimary : btnSecondary}>
                    Sonraki ders: {next.title} <ArrowRight size={16} aria-hidden />
                  </Link>
                ) : (
                  <Link href={`${base}/final`} className={lessonDone ? btnPrimary : btnSecondary}>
                    Genel değerlendirmeye geç <ArrowRight size={16} aria-hidden />
                  </Link>
                )}
              </div>
              {prev && (
                <Link href={`${base}/lessons/${prev.id}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline">
                  <ArrowLeft size={15} aria-hidden /> Önceki ders: {prev.title}
                </Link>
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
