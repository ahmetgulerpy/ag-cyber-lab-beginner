import { ArrowRight, BookOpen, Beaker, CheckCircle2, Target, Cpu } from "lucide-react";
import { lessons } from "../data/lessons";
import { PASS_RATIO, TOTAL_LESSONS, useProgress } from "../progress";
import { Badge, Card, ProgressBar, SectionTitle } from "../components/ui";
import { LessonList } from "../components/LessonList";

export function resumeHref(lastLesson: number | null, lastSection: string | null): string {
  if (!lastLesson) return "#/lesson/1";
  return `#/lesson/${lastLesson}/${lastSection ?? "learn"}`;
}

export default function Home() {
  const { progress, percent } = useProgress();
  const quizzes = Object.values(progress.quizResults);
  const avg = quizzes.length ? Math.round((quizzes.reduce((s, r) => s + r.score / r.total, 0) / quizzes.length) * 100) : null;
  const started = progress.lastLesson !== null;
  const resumeLesson = lessons.find((l) => l.id === progress.lastLesson);
  const passedQuizzes = quizzes.filter((r) => r.score / r.total >= PASS_RATIO).length;

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="grid gap-0 lg:grid-cols-[1.4fr_1fr]">
          <div className="p-6 sm:p-9">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>MODÜL 02</Badge>
              <Badge tone="ok">Beginner Level · Başlangıç</Badge>
              <Badge tone="muted">{TOTAL_LESSONS} ders</Badge>
            </div>
            <div className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-accent">AG Cyber Lab · Learn • Practice • Secure</div>
            <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">Bilgisayar Bilimleri Temelleri</h1>
            <p className="mt-1 text-sm text-muted">Computer Science Fundamentals</p>
            <div className="prose-lab mt-5 space-y-3 text-[15px] text-ink/90">
              <p className="font-semibold text-ink">Bir bilgisayarın yalnızca ekran, klavye ve kasadan ibaret olmadığını biliyor musun?</p>
              <p>Yaptığın her işlem, arka planda donanım ve yazılımın birlikte çalışmasıyla gerçekleşir.</p>
              <p>Bu modülde bilgisayarın iç dünyasını keşfedecek, verinin nasıl işlendiğini öğrenecek ve bir bilgisayarın açılma sürecini adım adım inceleyeceksin.</p>
              <p className="border-l-4 border-accent pl-3 font-medium text-brand">Bilgisayarın nasıl çalıştığını anlamadan, onu güvenli hale getirmek mümkün değildir.</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={resumeHref(progress.lastLesson, progress.lastSection)} className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
                {started ? "Kaldığın yerden devam et" : "Eğitime başla"} <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#/lessons" className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:border-brand hover:text-brand">
                Tüm dersler
              </a>
            </div>
            {started && resumeLesson && (
              <p className="mt-3 text-xs text-muted">
                Son ziyaret: Ders {String(resumeLesson.id).padStart(2, "0")} — {resumeLesson.title}
              </p>
            )}
          </div>
          <div className="border-t border-line bg-soft/60 p-6 sm:p-9 lg:border-l lg:border-t-0">
            <div className="text-xs font-semibold uppercase tracking-wider text-accent">Eğitim ilerlemen</div>
            <div className="mt-1 flex items-end gap-2">
              <span className="text-5xl font-bold text-brand">%{percent}</span>
            </div>
            <ProgressBar value={percent} className="mt-3 bg-white" />
            <dl className="mt-6 grid grid-cols-2 gap-3">
              {[
                { icon: BookOpen, k: "Tamamlanan ders", v: `${progress.completedLessons.length} / ${TOTAL_LESSONS}` },
                { icon: Cpu, k: "Toplam ders", v: String(TOTAL_LESSONS) },
                { icon: Beaker, k: "Tamamlanan uygulama", v: `${progress.completedLabs.length} / ${TOTAL_LESSONS}` },
                { icon: Target, k: "Test başarısı", v: avg === null ? "—" : `%${avg}` },
              ].map((s) => (
                <div key={s.k} className="rounded-lg border border-line bg-white p-3">
                  <s.icon className="h-4 w-4 text-brand" />
                  <dd className="mt-1 text-lg font-bold text-ink">{s.v}</dd>
                  <dt className="text-xs text-muted">{s.k}</dt>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-muted">
              Başarılı mini test: {passedQuizzes}/{TOTAL_LESSONS} · Genel değerlendirme: {progress.exam ? `%${progress.exam.percent}` : "henüz çözülmedi"}
            </p>
          </div>
        </div>
      </section>

      <section id="dersler">
        <SectionTitle eyebrow="Müfredat" title="Ders listesi">
          Her ders: konu anlatımı → etkileşimli uygulama → 5 soruluk mini test → özet. Bir dersi tamamlamak için uygulamayı bitir ve mini testten en az %60 al.
        </SectionTitle>
        <LessonList />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { icon: BookOpen, t: "Basitten teknik olana", d: "Her kavram önce basit anlatımla, sonra teknik açıklama ve gerçek hayat örneğiyle sunulur." },
          { icon: Beaker, t: "Yaparak öğren", d: "Her derste çalışan bir simülasyon, dönüştürücü veya senaryo uygulaması bulunur." },
          { icon: CheckCircle2, t: "Anla, ölç, pekiştir", d: "Mini testler, 20 soruluk genel değerlendirme ve tekrar önerileri ile ilerlemeni takip et." },
        ].map((c) => (
          <Card key={c.t}>
            <c.icon className="h-6 w-6 text-brand" />
            <h3 className="mt-3 font-semibold">{c.t}</h3>
            <p className="mt-1 text-sm text-muted">{c.d}</p>
          </Card>
        ))}
      </section>

      <Card className="bg-soft/50">
        <div className="text-xs font-semibold uppercase tracking-wider text-accent">Kurumsal bilgi</div>
        <p className="mt-1 max-w-3xl text-sm text-ink/90">
          AG Cyber Lab, siber güvenlik alanında teorik bilgiyi uygulamalı öğrenme deneyimiyle birleştirmeyi amaçlayan bağımsız bir eğitim ve araştırma platformudur.
        </p>
        <p className="mt-2 text-xs text-muted">Kurucu: Ahmet Güler</p>
      </Card>
    </div>
  );
}
