"use client";

import { useMemo, useSyncExternalStore } from "react";

export const STORAGE_KEY = "agcyberlab-modul03-ag-teknolojileri-v1";
export const TOTAL_LESSONS = 16;

export type FinalResult = {
  correct: number;
  wrong: number;
  percent: number;
  passed: boolean;
  answers: number[];
  at: string;
};

export type Progress = {
  completed: number[];
  quiz: Record<number, { score: number; total: number; at: string }>;
  labs: Record<number, { done: boolean; actions: number; at: string }>;
  final?: FinalResult;
  moduleCompleted: boolean;
};

const empty: Progress = { completed: [], quiz: {}, labs: {}, moduleCompleted: false };
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function getServerSnapshot() {
  return "";
}

function parse(raw: string): Progress {
  if (!raw) return empty;
  try {
    const p = JSON.parse(raw) as Partial<Progress>;
    return {
      completed: Array.isArray(p.completed) ? p.completed : [],
      quiz: p.quiz ?? {},
      labs: p.labs ?? {},
      final: p.final,
      moduleCompleted: !!p.moduleCompleted,
    };
  } catch {
    return empty;
  }
}

function write(p: Progress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* depolama kapalıysa sessizce devam et */
  }
  listeners.forEach((l) => l());
}

function read(): Progress {
  return parse(getSnapshot());
}

export function useProgress() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => parse(raw), [raw]);
}

export function toggleLesson(id: number, value?: boolean) {
  const p = read();
  const has = p.completed.includes(id);
  const next = value ?? !has;
  const completed = next ? Array.from(new Set([...p.completed, id])).sort((a, b) => a - b) : p.completed.filter((x) => x !== id);
  write({ ...p, completed });
}

export function saveQuiz(id: number, score: number, total: number) {
  const p = read();
  write({ ...p, quiz: { ...p.quiz, [id]: { score, total, at: new Date().toISOString() } } });
}

export function markLab(id: number) {
  const p = read();
  const prev = p.labs[id];
  write({ ...p, labs: { ...p.labs, [id]: { done: true, actions: (prev?.actions ?? 0) + 1, at: new Date().toISOString() } } });
}

export function saveFinal(result: FinalResult) {
  const p = read();
  write({ ...p, final: result, moduleCompleted: true });
}

export function resetAll() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* yoksay */
  }
  listeners.forEach((l) => l());
}
