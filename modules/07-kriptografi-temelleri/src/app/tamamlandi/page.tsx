"use client";

import Link from "next/link";
import { Button, Callout, Card, SectionHead } from "@/components/ui";
import { LESSONS } from "@/data/lessons";
import { useProgress } from "@/lib/progress";

export default function CompletePage() {
  const { data, stats, ready, lessonStatus } = useProgress();
  const complete = stats.lessonsDone === stats.totalLessons;

  if (!ready) return null;

  if (!complete) {
    const remaining = LESSONS.filter((l) => !lessonStatus(l.id).done);
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <SectionHead title="🏁 Modül tamamlama" sub={`${stats.lessonsDone}/${stats.totalLessons} ders tamamlandı (%${stats.percent})`} />
          <p className="text-sm text-muted">Tamamlama ekranı, 12 dersin tamamı bitirildiğinde açılır. Bir ders; ana laboratuvar, ek mini pratik ve mini test tamamlandığında bitmiş sayılır.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {remaining.map((l) => {
              const s = lessonStatus(l.id);
              return (
                <Link key={l.id} href={`/ders/${l.id}`} className="rounded-lg border border-line bg-bg p-3 text-sm hover:border-brand">
                  <b>Ders {l.id}:</b> {l.title}
                  <span className="block text-xs text-muted">
                    {s.lab ? "✓" : "○"} Lab · {s.practice ? "✓" : "○"} Pratik · {s.quiz ? "✓" : "○"} Test
                  </span>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  const date = data.completedAt ? new Date(data.completedAt).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" }) : "—";
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-3xl border-2 border-brand/30 bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-xs font-bold tracking-[0.3em] text-accent">AG CYBER LAB</p>
        <div className="mx-auto mt-4 grid h-16 w-16 place-items-center rounded-full bg-ok text-3xl text-white">✓</div>
        <h1 className="mt-4 text-3xl font-bold text-ink sm:text-4xl">MODÜL 07 TAMAMLANDI</h1>
        <p className="mt-1 text-xl font-semibold text-brand">Kriptografi Temelleri</p>
        <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
          {[
            ["Tamamlanan ders", `${stats.lessonsDone}/${stats.totalLessons}`],
            ["Tamamlanan laboratuvar", `${stats.labsDone}/${stats.labsTotal}`],
            ["Genel sınav sonucu", data.exam ? `${data.exam.score}/${data.exam.total} · %${Math.round((data.exam.score / data.exam.total) * 100)}` : "Henüz çözülmedi"],
            ["Tamamlanma tarihi", date],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-soft p-4">
              <p className="text-xs uppercase tracking-wide text-muted">{k}</p>
              <p className="mt-1 text-lg font-semibold text-ink">{v}</p>
            </div>
          ))}
        </div>
        {!data.exam && (
          <p className="mt-5 text-sm text-muted">
            Genel sınavı henüz çözmedin.{" "}
            <Link href="/sinav" className="font-medium text-brand underline">
              Sınava git
            </Link>
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3 print:hidden">
          <Button onClick={() => window.print()}>Bu ekranı yazdır</Button>
          <Link href="/" className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:border-brand">
            İlerleme paneli
          </Link>
        </div>
        <p className="mx-auto mt-6 max-w-md text-xs text-muted">LEARN • PRACTICE • SECURE</p>
      </div>
      <Callout kind="info" title="Bilgilendirme">
        Bu ekran yalnızca AG CYBER LAB eğitim platformu içi bir tamamlanma göstergesidir; resmî veya akredite bir sertifika değildir.
      </Callout>
    </div>
  );
}
