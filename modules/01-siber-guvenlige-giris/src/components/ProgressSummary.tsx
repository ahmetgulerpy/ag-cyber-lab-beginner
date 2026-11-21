"use client";

import Link from "next/link";
import { ArrowRight, ClipboardCheck, PlayCircle } from "lucide-react";
import type { ModuleSummary } from "@/content/types";
import { computeStats, useModuleProgress } from "@/lib/use-progress";
import { ResetControl } from "./ResetControl";
import { btnPrimary, btnSecondary, Card, ProgressBar } from "./ui";

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-line bg-bg px-3.5 py-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-0.5 text-lg font-bold tabular-nums text-ink">{value}</p>
      {hint && <p className="text-[11px] text-muted">{hint}</p>}
    </div>
  );
}

export function ProgressSummary({ summary }: { summary: ModuleSummary }) {
  const { progress, hydrated } = useModuleProgress(summary.id);
  const s = computeStats(summary, progress);
  const ready = hydrated;
  const percent = ready ? s.percent : 0;
  const base = `/modules/${summary.slug}`;

  const finalText = !ready || s.finalPercent === null ? "Henüz çözülmedi" : `%${s.finalPercent}`;
  const finalHint =
    ready && s.finalPercent !== null ? (s.finalPassed ? "Başarılı" : `Hedef: %${summary.passPercent}`) : `${summary.finalQuestionCount} soru`;

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">Eğitim ilerlemen</p>
          <p className="mt-1 text-4xl font-bold tabular-nums text-ink">%{percent}</p>
        </div>
        <p className="pb-1 text-right text-sm text-muted">
          {ready ? s.completed : 0} / {summary.lessons.length} ders tamamlandı
        </p>
      </div>
      <div className="mt-3">
        <ProgressBar value={percent} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        <Stat label="Tamamlanan ders" value={`${ready ? s.completed : 0} / ${summary.lessons.length}`} />
        <Stat label="Tamamlanan uygulama" value={`${ready ? s.activitiesDone : 0} / ${summary.lessons.length}`} />
        <Stat label="Çözülen mini test" value={`${ready ? s.quizzesTaken : 0} / ${summary.lessons.length}`} />
        <Stat
          label="Test başarısı"
          value={ready && s.successPercent !== null ? `%${s.successPercent}` : "—"}
          hint="Ortalama (en iyi sonuçlar)"
        />
        <div className="col-span-2 sm:col-span-2">
          <Stat label="Genel değerlendirme" value={finalText} hint={finalHint} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5">
        <Link href={`${base}/lessons/${ready ? s.nextLessonId : 1}`} className={btnPrimary}>
          <PlayCircle size={17} aria-hidden />
          {ready && s.started ? "Kaldığın yerden devam et" : "Eğitime başla"}
          <ArrowRight size={16} aria-hidden />
        </Link>
        <Link href={`${base}/final`} className={btnSecondary}>
          <ClipboardCheck size={16} aria-hidden /> Genel değerlendirme
        </Link>
      </div>
      <div className="mt-4 border-t border-line pt-4">
        <ResetControl moduleId={summary.id} disabled={!ready || !s.started} />
      </div>
    </Card>
  );
}
