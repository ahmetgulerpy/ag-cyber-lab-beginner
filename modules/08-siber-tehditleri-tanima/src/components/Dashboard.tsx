"use client";

import Link from "next/link";
import { lessons, getLesson } from "@/data/lessons";
import { PASS_EXAM, resetProgress, useProgress } from "@/lib/progress";
import { Badge, Btn, Card, InfoBox, ProgressBar, Stat } from "./ui";
import { LessonGrid } from "./LessonGrid";

export function Dashboard() {
  const p = useProgress();
  const total = lessons.length;
  const completed = lessons.filter((l) => p.lessons[l.slug]?.completed).length;
  const labs = lessons.filter((l) => p.lessons[l.slug]?.labDone).length;
  const quizzes = lessons.filter((l) => (p.lessons[l.slug]?.quizBest ?? 0) >= 3).length;
  const pct = Math.round((completed / total) * 100);
  const last = p.last ? getLesson(p.last) : undefined;
  const firstOpen = lessons.find((l) => !p.lessons[l.slug]?.completed) ?? lessons[0];
  const cont = last && !p.lessons[last.slug]?.completed ? last : firstOpen;
  const started = !!p.last;
  const exam = p.exam;
  const examPct = exam ? Math.round((exam.best / exam.total) * 100) : null;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-brand to-[#0f4c60] p-6 text-white shadow-sm sm:p-10">
        <Badge tone="soft">AG CYBER LAB • MODÜL 08</Badge>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">Siber Tehditleri Tanıma</h1>
        <p className="mt-3 max-w-2xl text-base text-white/85 sm:text-lg">
          Zararlı yazılımlardan kimlik avına, DDoS’tan web saldırılarına kadar 13 tehdidi sadece okuma; <b>dene, analiz et, karar ver</b>. Her derste görsel anlatım, çalışan bir sanal laboratuvar, görev ve test seni bekliyor.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/dersler/${cont.slug}`} className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand shadow hover:bg-soft">
            {started ? "▶ Kaldığın yerden devam et" : "▶ Eğitime başla"} – Ders {cont.no}
          </Link>
          <Link href="/sinav" className="rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">Genel sınava git</Link>
        </div>
        {started && last && <p className="mt-3 text-sm text-white/75">Son çalışılan ders: <b>{last.no}. {last.title}</b></p>}
      </section>

      <section aria-label="İlerleme özeti" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card><Stat label="Toplam ders" value="13" /><p className="mt-1 text-xs text-muted">Tamamlanan: <b className="text-ok">{completed}</b> / {total}</p></Card>
        <Card>
          <p className="text-xs text-muted">Genel ilerleme</p>
          <p className="mt-0.5 text-xl font-bold text-brand">%{pct}</p>
          <ProgressBar value={pct} tone="ok" className="mt-2" />
        </Card>
        <Card>
          <p className="text-xs text-muted">Laboratuvar tamamlama</p>
          <p className="mt-0.5 text-xl font-bold text-brand">{labs} / {total}</p>
          <ProgressBar value={(labs / total) * 100} className="mt-2" />
          <p className="mt-1 text-[11px] text-muted">Mini testler: {quizzes}/{total}</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Genel sınav</p>
          {exam ? (
            <>
              <p className={`mt-0.5 text-xl font-bold ${examPct! >= PASS_EXAM ? "text-ok" : "text-[#9a6a14]"}`}>En iyi: %{examPct}</p>
              <p className="text-[11px] text-muted">{examPct! >= PASS_EXAM ? "✓ Başarılı" : `Hedef %${PASS_EXAM}`} • {exam.attempts} deneme</p>
            </>
          ) : (
            <><p className="mt-0.5 text-xl font-bold text-muted">Girilmedi</p><p className="text-[11px] text-muted">22 soru • kolay-orta-zor</p></>
          )}
        </Card>
      </section>

      {completed === total && (
        <InfoBox tone="ok" icon="🎉" title="13 dersin tamamını bitirdin!">Şimdi genel değerlendirme sınavıyla bilgini ölç ve hangi konuları tekrar etmen gerektiğini gör.</InfoBox>
      )}

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-extrabold">Dersler</h2>
            <p className="text-sm text-muted">Sırayla ilerleyebilir ya da istediğin dersi seçebilirsin.</p>
          </div>
        </div>
        <LessonGrid />
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <InfoBox tone="brand" icon="🧪" title="Uygulamalı öğren">Her ders; anlatım, laboratuvar, görev ve mini testten oluşur. Laboratuvar + test geçilince ders otomatik tamamlanır.</InfoBox>
        <InfoBox tone="ok" icon="💾" title="İlerlemen kayıtlı">İlerlemen yalnızca bu tarayıcıda (localStorage) saklanır. Sayfayı kapatsan da kaldığın yerden devam edersin.</InfoBox>
        <InfoBox tone="warn" icon="🛡️" title="Güvenli simülasyon">Tüm laboratuvarlar sentetik verilerle tarayıcı içinde çalışır. Gerçek sistemlere saldırı veya veri toplama yoktur.</InfoBox>
      </section>

      <div className="text-right">
        <Btn variant="ghost" size="sm" onClick={() => { if (window.confirm("Tüm ilerleme bu tarayıcıdan silinecek. Emin misin?")) resetProgress(); }}>İlerlemeyi sıfırla</Btn>
      </div>
    </div>
  );
}
