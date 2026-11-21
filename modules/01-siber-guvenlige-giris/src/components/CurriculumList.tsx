"use client";

import Link from "next/link";
import { CheckCircle2, ChevronRight, Circle, Clock, ClipboardCheck, PlayCircle } from "lucide-react";
import type { ModuleSummary } from "@/content/types";
import { pad } from "@/content/helpers";
import { computeStats, useModuleProgress } from "@/lib/use-progress";
import { Badge, Card } from "./ui";

export function CurriculumList({ summary }: { summary: ModuleSummary }) {
  const { progress, hydrated } = useModuleProgress(summary.id);
  const stats = computeStats(summary, progress);
  const base = `/modules/${summary.slug}`;

  return (
    <div>
      <ol className="space-y-2.5">
        {summary.lessons.map((l) => {
          const done = hydrated && progress.completedLessons.includes(l.id);
          const current = hydrated && !done && stats.started && stats.nextLessonId === l.id;
          const quiz = hydrated ? progress.quizzes[String(l.id)] : undefined;
          const activityDone = hydrated && progress.activities.includes(l.id);
          return (
            <li key={l.id}>
              <Link
                href={`${base}/lessons/${l.id}`}
                className={`group flex items-center gap-3 rounded-xl border bg-white p-3.5 transition-colors hover:border-brand sm:gap-4 sm:p-4 ${current ? "border-brand ring-1 ring-brand/40" : "border-line"}`}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold ${done ? "bg-success-soft text-success" : current ? "bg-brand text-white" : "bg-soft text-brand"}`}
                >
                  {done ? <CheckCircle2 size={20} aria-label="Tamamlandı" /> : pad(l.id)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold leading-snug text-ink">
                    <span className="mr-1.5 font-mono text-xs font-medium text-muted">DERS {pad(l.id)}</span>
                    {l.title}
                  </span>
                  <span className="mt-0.5 block text-sm leading-snug text-muted">{l.subtitle}</span>
                  <span className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Badge tone="neutral">
                      <Clock size={11} aria-hidden /> ~{l.minutes} dk
                    </Badge>
                    {done ? (
                      <Badge tone="success">Tamamlandı</Badge>
                    ) : current ? (
                      <Badge tone="info">
                        <PlayCircle size={11} aria-hidden /> Kaldığın yer
                      </Badge>
                    ) : (
                      <Badge tone="neutral">
                        <Circle size={10} aria-hidden /> Başlanmadı
                      </Badge>
                    )}
                    {activityDone && <Badge tone="success">Uygulama ✓</Badge>}
                    {quiz && (
                      <Badge tone={quiz.bestScore / quiz.total >= 0.6 ? "success" : "warn"}>
                        Mini test {quiz.bestScore}/{quiz.total}
                      </Badge>
                    )}
                  </span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-muted group-hover:text-brand" aria-hidden />
              </Link>
            </li>
          );
        })}
      </ol>

      <Card className="mt-4">
        <Link href={`${base}/final`} className="group flex items-center gap-3 p-3.5 hover:bg-soft/40 sm:gap-4 sm:p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
            <ClipboardCheck size={20} aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-ink">Genel Değerlendirme Testi</span>
            <span className="mt-0.5 block text-sm text-muted">
              {summary.finalQuestionCount} soru · 8 dersin tamamından · başarı eşiği %{summary.passPercent}
            </span>
            <span className="mt-2 flex gap-1.5">
              {hydrated && progress.final ? (
                <Badge tone={stats.finalPassed ? "success" : "warn"}>
                  En iyi sonuç %{progress.final.bestPercent}
                  {stats.finalPassed ? " · Başarılı" : ""}
                </Badge>
              ) : (
                <Badge tone="neutral">Henüz çözülmedi</Badge>
              )}
            </span>
          </span>
          <ChevronRight size={18} className="shrink-0 text-muted group-hover:text-brand" aria-hidden />
        </Link>
      </Card>
    </div>
  );
}
