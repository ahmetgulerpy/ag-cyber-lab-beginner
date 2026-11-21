"use client";

import { useCallback, useSyncExternalStore } from "react";

export const STORAGE_KEY = "agcyberlab:modul05:programlama-scripting:v1";
export const TOTAL_LESSONS = 14;

export type QuizResult = {
  score: number;
  total: number;
  best: number;
  date: string;
};

export type ExamResult = {
  score: number;
  total: number;
  percent: number;
  date: string;
};

export type Progress = {
  completed: number[];
  labs: number[];
  quiz: Record<number, QuizResult>;
  exam: ExamResult | null;
  lastVisited: number | null;
  completedAt: string | null;
};

const EMPTY: Progress = {
  completed: [],
  labs: [],
  quiz: {},
  exam: null,
  lastVisited: null,
  completedAt: null,
};

let state: Progress = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function readFromStorage(): Progress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      labs: Array.isArray(parsed.labs) ? parsed.labs : [],
      quiz: parsed.quiz && typeof parsed.quiz === "object" ? parsed.quiz : {},
      exam: parsed.exam ?? null,
      lastVisited: typeof parsed.lastVisited === "number" ? parsed.lastVisited : null,
      completedAt: parsed.completedAt ?? null,
    };
  } catch {
    return EMPTY;
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  state = readFromStorage();
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) {
      state = readFromStorage();
      listeners.forEach((l) => l());
    }
  });
}

function getSnapshot(): Progress {
  ensureLoaded();
  return state;
}

function getServerSnapshot(): Progress {
  return EMPTY;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function update(fn: (p: Progress) => Progress) {
  ensureLoaded();
  state = fn(state);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* LocalStorage kullanılamıyorsa oturum içi durumla devam edilir */
  }
  listeners.forEach((l) => l());
}

const noopSub = () => () => {};

export function useProgress() {
  const progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    noopSub,
    () => true,
    () => false,
  );

  const markLab = useCallback((id: number) => {
    if (getSnapshot().labs.includes(id)) return;
    update((p) => ({ ...p, labs: [...p.labs, id] }));
  }, []);

  const setLast = useCallback((id: number) => {
    if (getSnapshot().lastVisited === id) return;
    update((p) => ({ ...p, lastVisited: id }));
  }, []);

  const completeLesson = useCallback((id: number) => {
    update((p) => {
      if (p.completed.includes(id)) return p;
      const completed = [...p.completed, id].sort((a, b) => a - b);
      const completedAt =
        completed.length >= TOTAL_LESSONS && !p.completedAt
          ? new Date().toISOString()
          : p.completedAt;
      return { ...p, completed, completedAt };
    });
  }, []);

  const uncompleteLesson = useCallback((id: number) => {
    update((p) => ({
      ...p,
      completed: p.completed.filter((c) => c !== id),
      completedAt: null,
    }));
  }, []);

  const saveQuiz = useCallback((id: number, score: number, total: number) => {
    update((p) => {
      const prev = p.quiz[id];
      return {
        ...p,
        quiz: {
          ...p.quiz,
          [id]: {
            score,
            total,
            best: Math.max(score, prev?.best ?? 0),
            date: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const saveExam = useCallback((score: number, total: number) => {
    update((p) => ({
      ...p,
      exam: {
        score,
        total,
        percent: Math.round((score / total) * 100),
        date: new Date().toISOString(),
      },
    }));
  }, []);

  const reset = useCallback(() => {
    update(() => EMPTY);
  }, []);

  const percent = Math.round((progress.completed.length / TOTAL_LESSONS) * 100);

  return {
    progress,
    hydrated,
    percent,
    markLab,
    setLast,
    completeLesson,
    uncompleteLesson,
    saveQuiz,
    saveExam,
    reset,
  };
}
