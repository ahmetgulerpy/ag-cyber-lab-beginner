"use client";

import Link from "next/link";
import { lessons } from "@/data/lessons";
import { Badge, Btn, Card, Progress } from "@/components/ui";
import { resetAll, TOTAL_LESSONS, useProgress } from "@/lib/storage";

export function Dashboard() {
  const p = useProgress();
  const doneCount = p.completed.length;
  const labCount = Object.values(p.labs).filter((l) => l.done).length;
  const quizCount = Object.keys(p.quiz).length;
  const quizAvg = quizCount ? Math.round((Object.values(p.quiz).reduce((a, q) => a + q.score / q.total, 0) / quizCount) * 100) : 0;
  const overall = Math.round(((doneCount + (p.final ? 1 : 0)) / (TOTAL_LESSONS + 1)) * 100);
  const nextLesson = lessons.find((l) => !p.completed.includes(l.id));

  const onReset = () => {
    if (window.confirm("Tüm eğitim ilerlemen (dersler, testler, laboratuvarlar ve final sonucu) silinecek. Emin misin?")) resetAll();
  };

  const stat = (label: string, value: string, sub?: string) => (
    <div className="rounded-xl border border-line bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-ink">{value}</p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:py-12">
      <section className="overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-white via-white to-soft p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Sıfırdan Siber Güvenlik Eğitim Programı</Badge>
          <Badge tone="ok">Seviye: Başlangıç</Badge>
          <Badge tone="muted">Modül 03</Badge>
        </div>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          Modül 03 – <span className="text-brand">Ağ Teknolojileri Temelleri</span>
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted">
          Bilgisayar ağlarını sıfırdan öğren: 16 ders, her ders için etkileşimli sanal laboratuvar, mini testler ve 20 soruluk final sınavı. Tüm uygulamalar tarayıcında yerel olarak çalışır; internet bağlantısı veya gerçek bir ağ taraması gerekmez.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm font-semibold">
              <span>Genel ilerleme</span>
              <span className="text-brand">%{overall}</span>
            </div>
            <Progress value={overall} />
            <p className="mt-2 text-xs text-muted">Genel ilerleme, 16 ders ve final sınavı üzerinden hesaplanır.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {nextLesson ? (
              <Link href={`/ders/${nextLesson.id}`} className="inline-flex min-h-[44px] items-center rounded-xl bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark">
                {doneCount === 0 ? "Eğitime Başla" : "Kaldığın Yerden Devam Et"} → Ders {String(nextLesson.id).padStart(2, "0")}
              </Link>
            ) : (
              <Link href="/final" className="inline-flex min-h-[44px] items-center rounded-xl bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark">Final Sınavına Git →</Link>
            )}
            <Btn variant="ghost" onClick={onReset}>↺ İlerlemeyi Sıfırla</Btn>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stat("Tamamlanan ders", `${doneCount}`, `Toplam ${TOTAL_LESSONS} ders`)}
        {stat("Laboratuvar", `${labCount}/${TOTAL_LESSONS}`, "uygulanan laboratuvar")}
        {stat("Mini testler", `${quizCount}/${TOTAL_LESSONS}`, quizCount ? `Ortalama başarı %${quizAvg}` : "henüz çözülmedi")}
        {stat("Final sınavı", p.final ? `%${p.final.percent}` : "—", p.final ? (p.final.passed ? "Başarılı" : "Tekrar önerilir") : "20 soru")}
      </section>

      <section id="dersler" className="scroll-mt-24">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-2xl font-bold">Ders Listesi</h2>
          <p className="text-sm text-muted">{doneCount}/{TOTAL_LESSONS} ders tamamlandı</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {lessons.map((l) => {
            const c = p.completed.includes(l.id);
            const lab = p.labs[l.id]?.done;
            const q = p.quiz[l.id];
            return (
              <Link key={l.id} href={`/ders/${l.id}`} className={`group flex gap-4 rounded-2xl border bg-white p-4 transition hover:shadow-md ${c ? "border-ok/40" : "border-line hover:border-brand/40"}`}>
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-extrabold ${c ? "bg-ok text-white" : "bg-soft text-brand"}`}>{c ? "✓" : String(l.id).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-muted">DERS {String(l.id).padStart(2, "0")} · ⏱ {l.minutes} dk</span>
                  <span className="block font-bold text-ink group-hover:text-brand">{l.title}</span>
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    <Badge tone={c ? "ok" : "muted"}>{c ? "Tamamlandı" : "Başlanmadı / devam"}</Badge>
                    <Badge tone={lab ? "ok" : "muted"}>{lab ? "✔ Lab" : "Lab"}</Badge>
                    <Badge tone={q ? (q.score >= 4 ? "ok" : "warn") : "muted"}>{q ? `Test ${q.score}/${q.total}` : "Test"}</Badge>
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="laboratuvarlar" className="scroll-mt-24">
        <h2 className="mb-1 text-2xl font-bold">Laboratuvar Uygulamaları</h2>
        <p className="mb-4 text-sm text-muted">Her laboratuvar tarayıcı içinde çalışan güvenli bir simülasyondur.</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((l) => (
            <Link key={l.id} href={`/ders/${l.id}#lab`} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3 text-sm hover:bg-soft">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${p.labs[l.id]?.done ? "bg-ok text-white" : "bg-soft text-brand"}`}>{p.labs[l.id]?.done ? "✓" : "🔬"}</span>
              <span className="min-w-0"><span className="block text-xs text-muted">Lab {String(l.id).padStart(2, "0")}</span><span className="block font-semibold">{l.labTitle}</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section id="testler" className="scroll-mt-24">
        <h2 className="mb-4 text-2xl font-bold">Mini Testler</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {lessons.map((l) => {
            const q = p.quiz[l.id];
            return (
              <Link key={l.id} href={`/ders/${l.id}#test`} className="rounded-xl border border-line bg-white p-3 text-sm hover:bg-soft">
                <span className="block text-xs text-muted">Ders {String(l.id).padStart(2, "0")}</span>
                <span className="block truncate font-semibold">{l.title}</span>
                <span className={`mt-1 block text-xs font-bold ${q ? (q.score >= 4 ? "text-ok" : q.score >= 3 ? "text-[#9a6a14]" : "text-err") : "text-muted"}`}>{q ? `Puan: ${q.score}/${q.total}` : "Henüz çözülmedi"}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="final" className="scroll-mt-24">
        <Card className="flex flex-col gap-4 bg-gradient-to-r from-brand to-accent p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8" >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">Modül 03 Final Sınavı</p>
            <h2 className="mt-1 text-2xl font-extrabold !text-white">20 soruluk bitirme sınavı</h2>
            <p className="mt-1 max-w-xl text-sm text-white/90">
              Tüm müfredatı kapsar; kolay, orta ve uygulama mantığı gerektiren sorular içerir. Başarı sınırı %70.
              {p.final && ` Son sonucun: ${p.final.correct}/20 (%${p.final.percent}).`}
            </p>
            {doneCount < TOTAL_LESSONS && <p className="mt-1 text-xs text-white/80">Öneri: önce {TOTAL_LESSONS - doneCount} dersi daha tamamla. (Sınav yine de açıktır.)</p>}
          </div>
          <Link href="/final" className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-xl bg-white px-5 text-sm font-bold text-brand hover:bg-soft">{p.final ? "Sonucu Gör / Tekrar Çöz" : "Sınava Git"} →</Link>
        </Card>
      </section>
    </div>
  );
}
