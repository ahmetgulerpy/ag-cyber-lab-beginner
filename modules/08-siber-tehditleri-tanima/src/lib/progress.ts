"use client";

import { useSyncExternalStore } from "react";

/** Bu modüle özel localStorage anahtarı (diğer modüllerle çakışmaz). */
export const STORAGE_KEY = "agcl_m08_siber_tehditler_progress_v1";
export const PASS_QUIZ = 3; // mini testte geçme eşiği (5 üzerinden)
export const PASS_EXAM = 70; // genel sınav geçme yüzdesi

export type LessonProgress = {
  visited?: boolean;
  labDone?: boolean;
  task?: boolean[];
  quizBest?: number;
  quizTotal?: number;
  completed?: boolean;
  tab?: string;
};

export type ExamResult = {
  best: number;
  last: number;
  total: number;
  attempts: number;
  wrongTopics: number[];
  date: string;
};

export type Progress = {
  lessons: Record<string, LessonProgress>;
  last?: string;
  exam?: ExamResult;
};

const empty: Progress = { lessons: {} };
let cache: { raw: string | null; value: Progress } = { raw: null, value: empty };
const listeners = new Set<() => void>();

function read(): Progress {
  if (typeof window === "undefined") return empty;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return cache.value;
  }
  if (raw === cache.raw) return cache.value;
  let value: Progress = empty;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Progress;
      if (parsed && typeof parsed === "object" && parsed.lessons) value = parsed;
    } catch {
      value = empty;
    }
  }
  cache = { raw, value };
  return value;
}

function write(next: Progress) {
  const raw = JSON.stringify(next);
  try {
    window.localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    /* depolama kapalıysa bellekte tut */
  }
  cache = { raw, value: next };
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, read, () => empty);
}

export function updateLesson(slug: string, patch: Partial<LessonProgress>) {
  const p = read();
  const cur = p.lessons[slug] ?? {};
  const merged: LessonProgress = { ...cur, ...patch };
  merged.completed = !!merged.labDone && (merged.quizBest ?? 0) >= PASS_QUIZ;
  write({ ...p, lessons: { ...p.lessons, [slug]: merged } });
}

export function setLast(slug: string) {
  const p = read();
  if (p.last === slug && p.lessons[slug]?.visited) return;
  const cur = p.lessons[slug] ?? {};
  write({ ...p, last: slug, lessons: { ...p.lessons, [slug]: { ...cur, visited: true } } });
}

export function saveExam(score: number, total: number, wrongTopics: number[]) {
  const p = read();
  const prev = p.exam;
  write({
    ...p,
    exam: {
      best: Math.max(prev?.best ?? 0, score),
      last: score,
      total,
      attempts: (prev?.attempts ?? 0) + 1,
      wrongTopics,
      date: new Date().toISOString(),
    },
  });
}

export function resetProgress() {
  write(empty);
}
