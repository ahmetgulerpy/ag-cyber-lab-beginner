"use client";

import Link from "next/link";
import { EXAM_QUESTIONS } from "@/data/exam";
import { useProgress } from "@/lib/storage";
import { formatDate } from "@/lib/util";
import { Badge, Card } from "./ui";
import Quiz from "./Quiz";

export default function ExamView() {
  const { progress, saveExam } = useProgress();
  const exam = progress.exam;
  return (
    <div className="space-y-5">
      <header className="rounded-2xl border border-line bg-white p-5 sm:p-7">
        <Badge>Modül 05 · Genel Değerlendirme</Badge>
        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Genel Sınav</h1>
        <p className="mt-2 text-[15px] leading-7 text-[#2b4152]">
          Modülün tamamını kapsayan 20 soruluk sınav. Sorular kavram bilgisi, kod okuma, problem çözme ve güvenlik
          mantığını ölçer. Soru ve seçenek sırası her denemede değişir; başarı eşiği %60&apos;tır. Sonuçlar bu
          tarayıcıda saklanır.
        </p>
        {exam && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <Badge tone={exam.percent >= 60 ? "ok" : "warn"}>
              Son sonuç: %{exam.percent} ({exam.score}/{exam.total})
            </Badge>
            <span className="text-muted">{formatDate(exam.date)}</span>
          </div>
        )}
      </header>
      <Quiz
        questions={EXAM_QUESTIONS}
        title="Genel Sınav · 20 soru"
        passPercent={60}
        onFinish={(score, total) => saveExam(score, total)}
      />
      <Card className="text-sm text-muted">
        Hazır değil misiniz? <Link href="/" className="font-medium text-brand hover:underline">İlerleme panelinden</Link>{" "}
        derslere dönüp eksik konuları tekrar edebilirsiniz.
      </Card>
    </div>
  );
}
