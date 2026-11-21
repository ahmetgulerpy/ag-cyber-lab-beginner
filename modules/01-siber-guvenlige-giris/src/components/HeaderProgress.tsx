"use client";

import Link from "next/link";
import type { ModuleSummary } from "@/content/types";
import { computeStats, useModuleProgress } from "@/lib/use-progress";

export function HeaderProgress({ summary }: { summary: ModuleSummary }) {
  const { progress, hydrated } = useModuleProgress(summary.id);
  const stats = computeStats(summary, progress);
  const percent = hydrated ? stats.percent : 0;
  const href = `/modules/${summary.slug}/lessons/${hydrated ? stats.nextLessonId : 1}`;
  return (
    <Link
      href={href}
      className="ml-1 hidden items-center gap-2 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink hover:border-brand sm:flex"
      aria-label={`İlerleme yüzde ${percent}. Derse devam et`}
    >
      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-soft">
        <span className="block h-full rounded-full bg-brand" style={{ width: `${percent}%` }} />
      </span>
      <span className="tabular-nums text-muted">%{percent}</span>
    </Link>
  );
}
