import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ExamResult, Progress, QuizResult } from "./types";

export const STORAGE_KEY = "agcyberlab.module02.computer-science-fundamentals.v1";
export const TOTAL_LESSONS = 10;
export const PASS_RATIO = 0.6;

const empty: Progress = {
  completedLessons: [],
  completedLabs: [],
  quizResults: {},
  exam: null,
  lastLesson: null,
  lastSection: null,
};

function load(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const p = JSON.parse(raw) as Partial<Progress>;
    return { ...empty, ...p };
  } catch {
    return empty;
  }
}

function derive(p: Progress): Progress {
  const done: number[] = [];
  for (let i = 1; i <= TOTAL_LESSONS; i++) {
    const r = p.quizResults[i];
    if (p.completedLabs.includes(i) && r && r.score / r.total >= PASS_RATIO) done.push(i);
  }
  return { ...p, completedLessons: done };
}

interface Ctx {
  progress: Progress;
  percent: number;
  completeLab: (id: number) => void;
  saveQuiz: (id: number, r: QuizResult) => void;
  saveExam: (r: ExamResult) => void;
  visit: (lesson: number | null, section: string) => void;
  reset: () => void;
}

const ProgressContext = createContext<Ctx | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      /* storage unavailable */
    }
  }, [progress]);

  const completeLab = useCallback((id: number) => {
    setProgress((p) => (p.completedLabs.includes(id) ? p : derive({ ...p, completedLabs: [...p.completedLabs, id] })));
  }, []);

  const saveQuiz = useCallback((id: number, r: QuizResult) => {
    setProgress((p) => {
      const prev = p.quizResults[id];
      // en iyi sonucu koru
      const best = prev && prev.score > r.score ? prev : r;
      return derive({ ...p, quizResults: { ...p.quizResults, [id]: best } });
    });
  }, []);

  const saveExam = useCallback((r: ExamResult) => {
    setProgress((p) => ({ ...p, exam: p.exam && p.exam.percent > r.percent ? p.exam : r }));
  }, []);

  const visit = useCallback((lesson: number | null, section: string) => {
    setProgress((p) =>
      p.lastLesson === lesson && p.lastSection === section ? p : { ...p, lastLesson: lesson, lastSection: section }
    );
  }, []);

  const reset = useCallback(() => {
    setProgress(empty);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const percent = useMemo(() => {
    const labs = progress.completedLabs.length;
    const quizzes = Object.entries(progress.quizResults).filter(([, r]) => r.score / r.total >= PASS_RATIO).length;
    const exam = progress.exam && progress.exam.percent >= PASS_RATIO * 100 ? 2 : 0;
    return Math.round(((labs + quizzes + exam) / (TOTAL_LESSONS * 2 + 2)) * 100);
  }, [progress]);

  const value = useMemo(
    () => ({ progress, percent, completeLab, saveQuiz, saveExam, visit, reset }),
    [progress, percent, completeLab, saveQuiz, saveExam, visit, reset]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): Ctx {
  const c = useContext(ProgressContext);
  if (!c) throw new Error("useProgress must be used within ProgressProvider");
  return c;
}
