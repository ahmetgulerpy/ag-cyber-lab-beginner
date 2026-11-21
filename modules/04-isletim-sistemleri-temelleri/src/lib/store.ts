"use client";
import { useCallback, useSyncExternalStore } from "react";

export type QuizResult = { score: number; total: number; at: string; answers: number[] };
export type FinalResult = { score: number; total: number; pct: number; at: string; answers: number[]; allLessons: boolean };
export type Progress = {
  lessons: Record<number, { done: boolean; at: string }>;
  quizzes: Record<number, QuizResult>;
  labs: Record<number, string[]>;
  final: FinalResult | null;
};

const KEY = "agcl-modul04-isletim-sistemleri-v1";
const EMPTY: Progress = { lessons: {}, quizzes: {}, labs: {}, final: null };
const listeners = new Set<() => void>();
let cache: { raw: string | null; val: Progress } | null = null;

function read(): Progress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (cache && cache.raw === raw) return cache.val;
    const val: Progress = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
    cache = { raw, val };
    return val;
  } catch {
    return EMPTY;
  }
}

function write(p: Progress) {
  try {
    const raw = JSON.stringify(p);
    window.localStorage.setItem(KEY, raw);
    cache = { raw, val: p };
  } catch {
    cache = { raw: null, val: p };
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useProgress() {
  const progress = useSyncExternalStore(subscribe, read, () => EMPTY);

  const setLesson = useCallback((id: number, done: boolean) => {
    const p = read();
    write({ ...p, lessons: { ...p.lessons, [id]: { done, at: new Date().toISOString() } } });
  }, []);
  const saveQuiz = useCallback((id: number, r: Omit<QuizResult, "at">) => {
    const p = read();
    const next: Progress = { ...p, quizzes: { ...p.quizzes, [id]: { ...r, at: new Date().toISOString() } } };
    if (r.score >= 3 && !p.lessons[id]?.done) next.lessons = { ...p.lessons, [id]: { done: true, at: new Date().toISOString() } };
    write(next);
  }, []);
  const markTask = useCallback((lesson: number, task: string) => {
    const p = read();
    const cur = p.labs[lesson] ?? [];
    if (cur.includes(task)) return;
    write({ ...p, labs: { ...p.labs, [lesson]: [...cur, task] } });
  }, []);
  const saveFinal = useCallback((r: Omit<FinalResult, "at" | "allLessons">) => {
    const p = read();
    const all = Array.from({ length: 14 }, (_, i) => i + 1).every((i) => p.lessons[i]?.done);
    write({ ...p, final: { ...r, at: new Date().toISOString(), allLessons: all } });
  }, []);
  const resetAll = useCallback(() => {
    write({ lessons: {}, quizzes: {}, labs: {}, final: null });
  }, []);
  const resetFinal = useCallback(() => {
    const p = read();
    write({ ...p, final: null });
  }, []);

  return { progress, setLesson, saveQuiz, markTask, saveFinal, resetAll, resetFinal };
}

export function lessonsDone(p: Progress) {
  return Array.from({ length: 14 }, (_, i) => i + 1).filter((i) => p.lessons[i]?.done).length;
}
export function overallPercent(p: Progress) {
  return Math.round(((lessonsDone(p) + (p.final ? 1 : 0)) / 15) * 100);
}
