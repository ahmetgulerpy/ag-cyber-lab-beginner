"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { LESSONS } from "@/data/lessons";

// Bağımsız LocalStorage isim alanı (önceki modüllerle çakışmaz)
export const STORAGE_KEY = "agcyberlab:modul07:kriptografi:v1";

export type QuizResult = { score: number; total: number; date: string };
export type ProgressData = {
  labs: Record<string, string>;
  practices: Record<string, string>;
  scenarios: Record<string, string>;
  quizzes: Record<string, QuizResult>;
  exam?: QuizResult;
  lastLesson?: number;
  visited: Record<string, string>;
  completedAt?: string;
};

const empty: ProgressData = { labs: {}, practices: {}, scenarios: {}, quizzes: {}, visited: {} };

type Ctx = {
  data: ProgressData;
  ready: boolean;
  markLab: (key: string) => void;
  markPractice: (id: number) => void;
  markScenario: (id: number) => void;
  saveQuiz: (lessonId: number, r: QuizResult) => void;
  saveExam: (r: QuizResult) => void;
  visit: (lessonId: number) => void;
  reset: () => void;
  lessonStatus: (id: number) => { lab: boolean; practice: boolean; scenario: boolean; quiz: boolean; done: boolean };
  stats: {
    lessonsDone: number;
    totalLessons: number;
    percent: number;
    labsDone: number;
    labsTotal: number;
    practicesDone: number;
    practicesTotal: number;
    scenariosDone: number;
    quizzesDone: number;
  };
};

const ProgressCtx = createContext<Ctx | null>(null);

function load(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<ProgressData>;
    return { ...empty, ...parsed };
  } catch {
    return empty;
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ProgressData>(empty);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    setData(load());
    loaded.current = true;
    setReady(true);
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* depolama dolu veya kapalı olabilir */
    }
  }, [data]);

  const now = () => new Date().toISOString();

  const markLab = useCallback((key: string) => setData((d) => (d.labs[key] ? d : { ...d, labs: { ...d.labs, [key]: now() } })), []);
  const markPractice = useCallback((id: number) => setData((d) => (d.practices[id] ? d : { ...d, practices: { ...d.practices, [id]: now() } })), []);
  const markScenario = useCallback((id: number) => setData((d) => (d.scenarios[id] ? d : { ...d, scenarios: { ...d.scenarios, [id]: now() } })), []);
  const saveQuiz = useCallback((id: number, r: QuizResult) => setData((d) => ({ ...d, quizzes: { ...d.quizzes, [id]: r } })), []);
  const saveExam = useCallback((r: QuizResult) => setData((d) => ({ ...d, exam: r })), []);
  const visit = useCallback((id: number) => setData((d) => (d.lastLesson === id ? d : { ...d, lastLesson: id, visited: { ...d.visited, [id]: d.visited[id] ?? now() } })), []);
  const reset = useCallback(() => {
    setData(empty);
  }, []);

  const lessonStatus = useCallback(
    (id: number) => {
      const l = LESSONS.find((x) => x.id === id);
      const lab = !!l && l.labKeys.every((k) => !!data.labs[k]);
      const practice = !!data.practices[id];
      const scenario = !!data.scenarios[id];
      const quiz = !!data.quizzes[id];
      return { lab, practice, scenario, quiz, done: lab && practice && quiz };
    },
    [data],
  );

  const stats = useMemo(() => {
    const lessonsDone = LESSONS.filter((l) => lessonStatus(l.id).done).length;
    const labsTotal = LESSONS.reduce((n, l) => n + l.labKeys.length, 0);
    return {
      lessonsDone,
      totalLessons: LESSONS.length,
      percent: Math.round((lessonsDone / LESSONS.length) * 100),
      labsDone: Object.keys(data.labs).length,
      labsTotal,
      practicesDone: Object.keys(data.practices).length,
      practicesTotal: LESSONS.length,
      scenariosDone: Object.keys(data.scenarios).length,
      quizzesDone: Object.keys(data.quizzes).length,
    };
  }, [data, lessonStatus]);

  useEffect(() => {
    if (!ready) return;
    if (stats.lessonsDone === stats.totalLessons && !data.completedAt) {
      setData((d) => ({ ...d, completedAt: new Date().toISOString() }));
    } else if (stats.lessonsDone < stats.totalLessons && data.completedAt) {
      setData((d) => ({ ...d, completedAt: undefined }));
    }
  }, [ready, stats.lessonsDone, stats.totalLessons, data.completedAt]);

  const value: Ctx = { data, ready, markLab, markPractice, markScenario, saveQuiz, saveExam, visit, reset, lessonStatus, stats };
  return <ProgressCtx.Provider value={value}>{children}</ProgressCtx.Provider>;
}

export function useProgress(): Ctx {
  const c = useContext(ProgressCtx);
  if (!c) throw new Error("ProgressProvider eksik");
  return c;
}
