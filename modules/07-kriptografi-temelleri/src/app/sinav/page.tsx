"use client";

import Link from "next/link";
import { Quiz } from "@/components/Quiz";
import { Callout, Card, SectionHead } from "@/components/ui";
import { EXAM_QUESTIONS } from "@/data/quizzes";
import { useProgress } from "@/lib/progress";

export default function ExamPage() {
  const { data, saveExam, stats } = useProgress();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="rounded-2xl border border-line bg-gradient-to-br from-white to-soft p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">MODÜL 07 · Kriptografi Temelleri</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">📝 Genel Değerlendirme Sınavı</h1>
        <p className="mt-2 text-sm text-muted">20 çoktan seçmeli soru. Sorular yalnızca tanım değil; laboratuvarlarda gördüğün durumları da ölçer. Puan ve başarı yüzdesi sonunda gösterilir.</p>
      </section>
      {stats.lessonsDone < stats.totalLessons && (
        <Callout kind="info" title="İpucu">
          Şu ana kadar {stats.lessonsDone}/{stats.totalLessons} ders tamamlandı. Sınavı istediğin zaman çözebilirsin, ancak önce derslerdeki laboratuvarları yapmak başarını artırır.{" "}
          <Link className="font-medium text-brand underline" href="/">
            İlerleme paneli
          </Link>
        </Callout>
      )}
      <Card>
        <SectionHead title="Sınav" />
        <Quiz questions={EXAM_QUESTIONS} title="Genel sınav" prev={data.exam} onFinish={saveExam} />
      </Card>
      {data.exam && (
        <div className="text-center">
          <Link href="/tamamlandi" className="text-sm font-medium text-brand hover:underline">
            Modül tamamlama durumunu gör →
          </Link>
        </div>
      )}
    </div>
  );
}
