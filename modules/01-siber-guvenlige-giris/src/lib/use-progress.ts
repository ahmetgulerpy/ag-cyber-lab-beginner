"use client";

import { useSyncExternalStore } from "react";
import type { ModuleSummary } from "@/content/types";
import {
  EMPTY_MODULE,
  getServerSnapshot,
  getSnapshot,
  subscribe,
  type ModuleProgress,
} from "@/lib/progress";

const noopSubscribe = () => () => {};

export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function useModuleProgress(moduleId: string): {
  progress: ModuleProgress;
  hydrated: boolean;
} {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useHydrated();
  return { progress: state.modules[moduleId] ?? EMPTY_MODULE, hydrated };
}

export interface ModuleStats {
  completed: number;
  total: number;
  percent: number;
  activitiesDone: number;
  quizzesTaken: number;
  /** Alınan testlerin (mini + final) en iyi sonuçlarının yüzde ortalaması */
  successPercent: number | null;
  finalPercent: number | null;
  finalPassed: boolean;
  nextLessonId: number;
  started: boolean;
  allDone: boolean;
}

export function computeStats(
  mod: Pick<ModuleSummary, "lessons" | "passPercent">,
  p: ModuleProgress,
): ModuleStats {
  const total = mod.lessons.length;
  const completed = p.completedLessons.length;
  const percents: number[] = [];
  for (const lesson of mod.lessons) {
    const r = p.quizzes[String(lesson.id)];
    if (r) percents.push((r.bestScore / r.total) * 100);
  }
  if (p.final) percents.push(p.final.bestPercent);
  const successPercent = percents.length
    ? Math.round(percents.reduce((a, b) => a + b, 0) / percents.length)
    : null;
  const firstIncomplete = mod.lessons.find((l) => !p.completedLessons.includes(l.id));
  const resume =
    p.lastLesson && !p.completedLessons.includes(p.lastLesson)
      ? p.lastLesson
      : (firstIncomplete?.id ?? p.lastLesson ?? mod.lessons[0].id);
  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100),
    activitiesDone: p.activities.length,
    quizzesTaken: Object.keys(p.quizzes).length,
    successPercent,
    finalPercent: p.final ? p.final.bestPercent : null,
    finalPassed: p.final ? p.final.bestPercent >= mod.passPercent : false,
    nextLessonId: resume,
    started: completed > 0 || p.lastLesson !== null || percents.length > 0,
    allDone: completed === total,
  };
}
