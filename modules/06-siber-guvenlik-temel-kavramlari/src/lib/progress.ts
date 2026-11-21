"use client";

import { useSyncExternalStore } from "react";

export const STORAGE_KEY = "agcyberlab:modul06:v1";
export const PASS_RATIO = 0.6;

export type QuizResult = { score: number; total: number; date: string };

export type Progress = {
  labs: Record<string, string>;
  quizzes: Record<string, QuizResult>;
  exam: QuizResult | null;
  completed: Record<string, string>;
  lastLesson: string | null;
  completedAt: string | null;
};

const EMPTY: Progress = {
  labs: {},
  quizzes: {},
  exam: null,
  completed: {},
  lastLesson: null,
  completedAt: null,
};

export const LESSON_IDS = [
  "cia-triad",
  "asset-threat-vulnerability",
  "risk-yonetimi",
  "attack-surface",
  "attack-vector",
  "exploit-payload",
  "authn-authz",
  "least-privilege",
  "defense-in-depth",
  "zero-trust",
  "security-policy",
  "security-awareness",
];

let lastRaw: string | null | undefined = undefined;
let snapshot: Progress = EMPTY;
const listeners = new Set<() => void>();

function read(): Progress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === lastRaw) return snapshot;
    lastRaw = raw;
    snapshot = raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<Progress>) } : EMPTY;
  } catch {
    snapshot = EMPTY;
  }
  return snapshot;
}

function write(next: Progress) {
  try {
    const raw = JSON.stringify(next);
    window.localStorage.setItem(STORAGE_KEY, raw);
    lastRaw = raw;
  } catch {
    /* depolama kullanılamıyorsa bellekte tut */
  }
  snapshot = next;
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

function finalize(p: Progress): Progress {
  const completed = { ...p.completed };
  for (const id of LESSON_IDS) {
    const q = p.quizzes[id];
    if (!completed[id] && p.labs[id] && q && q.score / q.total >= PASS_RATIO) {
      completed[id] = new Date().toISOString();
    }
  }
  const all = LESSON_IDS.every((id) => completed[id]);
  return { ...p, completed, completedAt: all ? p.completedAt ?? new Date().toISOString() : null };
}

export function useProgress() {
  const p = useSyncExternalStore(subscribe, read, () => EMPTY);
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  return { p, ready };
}

export const actions = {
  markLab(id: string) {
    const cur = read();
    if (cur.labs[id]) return;
    write(finalize({ ...cur, labs: { ...cur.labs, [id]: new Date().toISOString() } }));
  },
  saveQuiz(id: string, score: number, total: number) {
    const cur = read();
    const prev = cur.quizzes[id];
    const best = prev && prev.score > score ? prev : { score, total, date: new Date().toISOString() };
    write(finalize({ ...cur, quizzes: { ...cur.quizzes, [id]: best } }));
  },
  saveExam(score: number, total: number) {
    const cur = read();
    write(finalize({ ...cur, exam: { score, total, date: new Date().toISOString() } }));
  },
  visit(id: string) {
    const cur = read();
    if (cur.lastLesson === id) return;
    write({ ...cur, lastLesson: id });
  },
  reset() {
    write(EMPTY);
  },
};

export function fmtDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
}
