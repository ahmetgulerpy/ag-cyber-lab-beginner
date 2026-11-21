"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ModuleSummary, Question } from "@/content/types";
import { pad } from "@/content/helpers";
import { saveFinalResult } from "@/lib/progress";
import { computeStats, useModuleProgress } from "@/lib/use-progress";
import { Quiz, type ReviewLink } from "./Quiz";
import { btnSecondary, toneBox } from "./ui";

interface Props {
  summary: ModuleSummary;
  questions: Question[];
  /** Soru kimliği → konu anlatımı sırası (derin bağlantı için) */
  topicIndex: Record<string, number>;
}

export function FinalExam({ summary, questions, topicIndex }: Props) {
  const { progress, hydrated } = useModuleProgress(summary.id);
  const stats = computeStats(summary, progress);
  const base = `/modules/${summary.slug}`;
  const final = hydrated ? progress.final : null;

  const getReviewLink = (q: Question): ReviewLink | null => {
    if (!q.lesson) return null;
    const lesson = summary.lessons.find((l) => l.id === q.lesson);
    const ti = topicIndex[q.id];
    return {
      label: `Ders ${pad(q.lesson)} — ${lesson?.title ?? ""}: ${q.topic}`,
      href: `${base}/lessons/${q.lesson}${ti !== undefined && ti >= 0 ? `#topic-${ti}` : ""}`,
    };
  };

  return (
    <div className="space-y-5">
      {hydrated && stats.completed < summary.lessons.length && (
        <div className={`rounded-lg border p-4 text-sm leading-relaxed ${toneBox.info}`}>
          <p>
            Şu ana kadar <strong>{stats.completed}</strong> dersi tamamladın. Genel değerlendirmeyi istediğin zaman çözebilirsin; ancak
            tüm dersleri bitirdikten sonra çözmek sonuçları daha anlamlı kılar.
          </p>
          <Link href={`${base}/lessons/${stats.nextLessonId}`} className={`${btnSecondary} mt-3`}>
            Derse dön <ArrowRight size={15} aria-hidden />
          </Link>
        </div>
      )}
      <Quiz
        questions={questions}
        kind="final"
        passPercent={summary.passPercent}
        previous={
          final
            ? {
                score: final.score,
                total: final.total,
                attempts: final.attempts,
                best: `%${final.bestPercent}`,
              }
            : null
        }
        getReviewLink={getReviewLink}
        onFinish={(score, wrong) =>
          saveFinalResult(
            summary.id,
            score,
            questions.length,
            [...new Set(wrong.map((w) => w.lesson).filter((n): n is number => typeof n === "number"))].sort((a, b) => a - b),
          )
        }
      />
    </div>
  );
}
