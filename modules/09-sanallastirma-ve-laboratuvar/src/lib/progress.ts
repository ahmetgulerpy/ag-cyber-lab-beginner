"use client";

import { useMemo, useSyncExternalStore } from "react";

export type QuizRes = { score: number; total: number };
export type LessonP = { visited?: boolean; lab?: boolean; quiz?: QuizRes; done?: boolean };
export type FinalRes = {
  score: number;
  total: number;
  pct: number;
  at: number;
  wrong: Record<string, number>;
  byLevel: Record<string, { ok: number; total: number }>;
};
export type Progress = {
  v: 1;
  last?: { slug: string; at: number };
  lessons: Record<string, LessonP>;
  guides: Record<string, { done: number[]; seen: number[] }>;
  checks: Record<string, number[]>;
  final?: FinalRes;
};

/** Bu modüle özel localStorage anahtarı */
export const STORAGE_KEY = "agcl.m09.virtualizasyon-lab.progress.v1";

const EMPTY: Progress = { v: 1, lessons: {}, guides: {}, checks: {} };
const listeners = new Set<() => void>();

function read(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function parse(raw: string): Progress {
  if (!raw) return EMPTY;
  try {
    const o = JSON.parse(raw) as Partial<Progress>;
    return {
      v: 1,
      last: o.last,
      lessons: o.lessons ?? {},
      guides: o.guides ?? {},
      checks: o.checks ?? {},
      final: o.final,
    };
  } catch {
    return EMPTY;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

export function update(fn: (p: Progress) => void) {
  const p = structuredClone(parse(read()));
  fn(p);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* depolama kapalıysa sessizce devam et */
  }
  listeners.forEach((l) => l());
}

export function useProgress(): Progress {
  const raw = useSyncExternalStore(subscribe, read, () => "");
  return useMemo(() => parse(raw), [raw]);
}

const lp = (p: Progress, slug: string): LessonP => (p.lessons[slug] ??= {});

export const visitLesson = (slug: string) =>
  update((p) => {
    lp(p, slug).visited = true;
    p.last = { slug, at: Date.now() };
  });
export const markLab = (slug: string) =>
  update((p) => {
    lp(p, slug).lab = true;
  });
export const saveQuiz = (slug: string, res: QuizRes) =>
  update((p) => {
    const l = lp(p, slug);
    if (!l.quiz || res.score >= l.quiz.score) l.quiz = res;
  });
export const setDone = (slug: string, done: boolean) =>
  update((p) => {
    lp(p, slug).done = done;
  });
export const setGuideStep = (id: string, i: number, kind: "done" | "seen", on: boolean) =>
  update((p) => {
    const g = (p.guides[id] ??= { done: [], seen: [] });
    const set = new Set(g[kind]);
    if (on) set.add(i);
    else set.delete(i);
    g[kind] = [...set].sort((a, b) => a - b);
  });
export const toggleCheck = (id: string, i: number) =>
  update((p) => {
    const set = new Set(p.checks[id] ?? []);
    if (set.has(i)) set.delete(i);
    else set.add(i);
    p.checks[id] = [...set].sort((a, b) => a - b);
  });
export const saveFinal = (res: FinalRes) =>
  update((p) => {
    p.final = res;
  });
export const resetAll = () =>
  update((p) => {
    p.lessons = {};
    p.guides = {};
    p.checks = {};
    p.last = undefined;
    p.final = undefined;
  });
