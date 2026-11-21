import { useCallback, useEffect } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, CircleDashed, ClipboardCheck, Clock, FlaskConical, ListChecks, Target, Lightbulb, Wrench } from "lucide-react";
import { lessons, lessonTitles } from "../data/lessons";
import { PASS_RATIO, useProgress } from "../progress";
import type { LessonTab } from "../types";
import { Badge, Card, Feedback, SectionTitle } from "../components/ui";
import { InlineCheck } from "../components/InlineCheck";
import { Quiz } from "../components/Quiz";
import { labs } from "../labs";
import { lessonStatus } from "../components/LessonList";
import { cn } from "../utils/cn";

const tabs: { id: LessonTab; label: string; icon: typeof BookOpen }[] = [
  { id: "learn", label: "Konu Anlatımı", icon: BookOpen },
  { id: "lab", label: "Uygulama", icon: FlaskConical },
  { id: "quiz", label: "Mini Test", icon: ClipboardCheck },
  { id: "summary", label: "Özet", icon: ListChecks },
];

export default function LessonView({ id, tab }: { id: number; tab: LessonTab }) {
  const { progress, visit, completeLab, saveQuiz } = useProgress();
  const lesson = lessons.find((l) => l.id === id);

  useEffect(() => {
    if (lesson) visit(lesson.id, tab);
  }, [lesson, tab, visit]);

  const onLabComplete = useCallback(() => completeLab(id), [completeLab, id]);

  if (!lesson) {
    return (
      <Card>
        <p>Ders bulunamadı.</p>
        <a href="#/lessons" className="font-semibold text-brand">
          Derslere dön
        </a>
      </Card>
    );
  }

  const Lab = labs[id];
  const labDone = progress.completedLabs.includes(id);
  const q = progress.quizResults[id];
  const qPass = !!q && q.score / q.total >= PASS_RATIO;
  const lessonDone = progress.completedLessons.includes(id);
  const prev = lessons.find((l) => l.id === id - 1);
  const next = lessons.find((l) => l.id === id + 1);
  const base = `#/lesson/${id}`;

  return (
    <div className="space-y-6">
      <nav aria-label="Ders gezinme" className="scroll-thin flex gap-1.5 overflow-x-auto pb-1">
        {lessons.map((l) => {
          const st = lessonStatus(l.id, progress);
          return (
            <a
              key={l.id}
              href={`#/lesson/${l.id}`}
              title={`Ders ${l.id}: ${l.title}`}
              aria-current={l.id === id ? "page" : undefined}
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm font-bold transition-colors",
                l.id === id ? "border-brand bg-brand text-white" : st === "done" ? "border-ok/50 bg-[#eef8f2] text-ok" : "border-line bg-white text-muted hover:border-accent"
              )}
            >
              {st === "done" && l.id !== id ? <CheckCircle2 className="h-4 w-4" /> : l.id}
            </a>
          );
        })}
      </nav>

      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
          <span>
            Modül 02 · Ders {String(id).padStart(2, "0")} / 10
          </span>
          {lessonDone ? <Badge tone="ok">Tamamlandı</Badge> : <Badge tone="muted">Devam ediyor</Badge>}
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{lesson.title}</h1>
        <p className="text-sm text-muted">{lesson.en}</p>
      </header>

      <div role="tablist" aria-label="Ders bölümleri" className="scroll-thin -mx-4 flex gap-1 overflow-x-auto border-b border-line px-4">
        {tabs.map((t) => {
          const Icon = t.icon;
          const mark = (t.id === "lab" && labDone) || (t.id === "quiz" && qPass);
          return (
            <a
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              href={t.id === "learn" ? base : `${base}/${t.id}`}
              className={cn(
                "flex shrink-0 items-center gap-1.5 border-b-2 px-3.5 py-3 text-sm font-semibold transition-colors",
                tab === t.id ? "border-brand text-brand" : "border-transparent text-muted hover:text-ink"
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
              {mark && <CheckCircle2 className="h-3.5 w-3.5 text-ok" />}
            </a>
          );
        })}
      </div>

      <div key={`${id}-${tab}`} className="fade-in">
        {tab === "learn" && (
          <div className="space-y-6">
            <Card className="space-y-5">
              <div className="grid gap-5 md:grid-cols-[1.2fr_1fr]">
                <div>
                  <div className="mb-1 flex items-center gap-2 text-sm font-bold text-brand">
                    <Target className="h-4 w-4" /> Dersin amacı
                  </div>
                  <p className="prose-lab text-sm text-ink/90">{lesson.goal}</p>
                  <div className="mt-3 flex items-center gap-2 text-sm text-muted">
                    <Clock className="h-4 w-4" /> Tahmini öğrenme süresi: <b className="text-ink">~{lesson.minutes} dakika</b>
                  </div>
                </div>
                <div className="rounded-lg bg-soft p-4">
                  <div className="mb-2 text-sm font-bold text-brand">Bu derste neler öğreneceksin?</div>
                  <ul className="space-y-1.5 text-sm">
                    {lesson.learn.map((x) => (
                      <li key={x} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            <SectionTitle eyebrow="Detaylı konu anlatımı" title="Kavramlar">
              Her kavram sırasıyla: basit açıklama → teknik açıklama → gerçek yaşam örneği → mini soru.
            </SectionTitle>

            {lesson.concepts.map((c, i) => (
              <Card key={c.title} className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-accent">KAVRAM {i + 1}</div>
                  <h3 className="text-lg font-bold text-ink">{c.title}</h3>
                  {c.en && <div className="text-sm italic text-muted">{c.en}</div>}
                </div>
                <div className="grid gap-3">
                  <div className="rounded-lg border-l-4 border-accent bg-[#f1f9f9] p-4">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent">
                      <Lightbulb className="h-4 w-4" /> Basit açıklama
                    </div>
                    <p className="prose-lab text-[15px]">{c.simple}</p>
                  </div>
                  <div className="rounded-lg border-l-4 border-brand bg-soft/60 p-4">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand">
                      <Wrench className="h-4 w-4" /> Teknik açıklama
                    </div>
                    <p className="prose-lab text-[15px]">{c.technical}</p>
                  </div>
                  {c.code && (
                    <pre className="scroll-thin overflow-x-auto rounded-lg border border-[#223645] bg-[#0f1f2b] p-4 font-mono text-[13px] leading-relaxed text-[#cfe3ec]">{c.code}</pre>
                  )}
                  <div className="rounded-lg border-l-4 border-warn bg-[#fdf8ec] p-4">
                    <div className="mb-1 text-xs font-bold uppercase tracking-wider text-[#9a6b14]">Gerçek yaşam örneği</div>
                    <p className="prose-lab text-[15px]">{c.example}</p>
                  </div>
                </div>
                <InlineCheck q={c.check} />
              </Card>
            ))}

            <Card>
              <h3 className="mb-3 text-lg font-bold">Teknik kavramlar sözlüğü</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {lesson.terms.map((t) => (
                  <div key={t.en} className="rounded-lg border border-line p-3 text-sm">
                    <div className="font-semibold text-ink">
                      {t.tr} <span className="font-mono text-xs font-normal text-brand">({t.en})</span>
                    </div>
                    <div className="text-muted">{t.def}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="mb-3 text-lg font-bold">Gerçek hayattan örnekler</h3>
              <ul className="space-y-2 text-sm">
                {lesson.realLife.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {r}
                  </li>
                ))}
              </ul>
            </Card>

            <a href={`${base}/lab`} className="flex items-center justify-between gap-3 rounded-xl border border-brand/30 bg-soft p-5 hover:border-brand">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-accent">Sıradaki adım</div>
                <div className="font-semibold text-ink">{lesson.labTitle}</div>
                <div className="text-sm text-muted">{lesson.labDesc}</div>
              </div>
              <ArrowRight className="h-6 w-6 shrink-0 text-brand" />
            </a>
          </div>
        )}

        {tab === "lab" && (
          <div className="space-y-4">
            <Card className="bg-soft/50">
              <div className="text-xs font-bold uppercase tracking-wider text-accent">Etkileşimli uygulama</div>
              <h2 className="text-lg font-bold">{lesson.labTitle}</h2>
              <p className="text-sm text-muted">{lesson.labDesc}</p>
            </Card>
            <Lab key={id} done={labDone} onComplete={onLabComplete} />
            <div className="flex justify-end">
              <a href={`${base}/quiz`} className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
                Mini Teste Geç <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}

        {tab === "quiz" && (
          <div className="space-y-4">
            <SectionTitle eyebrow="Mini değerlendirme" title="5 soruluk mini test">
              Her soruda 4 seçenek ve tek doğru cevap vardır. Cevaptan sonra açıklamayı oku. Geçme sınırı %{PASS_RATIO * 100}.
            </SectionTitle>
            {q && (
              <Feedback tone={qPass ? "ok" : "warn"} title={`En iyi sonucun: ${q.score}/${q.total}`}>
                {qPass ? "Bu dersin testini geçtin. İstersen tekrar çözerek pekiştirebilirsin." : "Geçme sınırına ulaşmak için testi tekrar çözebilirsin."}
              </Feedback>
            )}
            <Quiz
              key={id}
              questions={lesson.quiz}
              title={`Ders ${id} — Mini Test`}
              onFinish={(score) => saveQuiz(id, { score, total: lesson.quiz.length, at: Date.now() })}
              lessonTitles={lessonTitles}
            />
          </div>
        )}

        {tab === "summary" && (
          <div className="space-y-4">
            <Card>
              <h3 className="mb-3 text-lg font-bold">Ders özeti</h3>
              <ul className="space-y-2 text-sm">
                {lesson.summary.map((s) => (
                  <li key={s} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {s}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="space-y-3">
              <h3 className="text-lg font-bold">Ders tamamlama durumu</h3>
              {[
                { ok: labDone, label: "Etkileşimli uygulama tamamlandı", href: `${base}/lab` },
                { ok: qPass, label: `Mini test geçildi (en az %${PASS_RATIO * 100})`, href: `${base}/quiz` },
              ].map((r) => (
                <a key={r.label} href={r.href} className="flex items-center gap-2 rounded-lg border border-line p-3 text-sm hover:border-accent">
                  {r.ok ? <CheckCircle2 className="h-5 w-5 text-ok" /> : <CircleDashed className="h-5 w-5 text-muted" />}
                  <span className={r.ok ? "font-medium text-ink" : "text-muted"}>{r.label}</span>
                </a>
              ))}
              {lessonDone ? (
                <Feedback tone="ok" title="Ders tamamlandı!">
                  İlerlemen kaydedildi. Sıradaki derse geçebilirsin.
                </Feedback>
              ) : (
                <Feedback tone="info">Dersi tamamlamak için yukarıdaki iki adımı bitir.</Feedback>
              )}
            </Card>
            <div className="flex flex-wrap justify-between gap-3">
              {prev ? (
                <a href={`#/lesson/${prev.id}`} className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold hover:border-brand hover:text-brand">
                  <ArrowLeft className="h-4 w-4" /> Önceki: {prev.title}
                </a>
              ) : (
                <span />
              )}
              {next ? (
                <a href={`#/lesson/${next.id}`} className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
                  Sonraki ders: {next.title} <ArrowRight className="h-4 w-4" />
                </a>
              ) : (
                <a href="#/assessment" className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
                  Genel değerlendirmeye geç <ArrowRight className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
