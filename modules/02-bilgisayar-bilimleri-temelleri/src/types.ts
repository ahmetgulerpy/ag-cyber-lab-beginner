export interface Question {
  q: string;
  options: string[];
  answer: number;
  explain: string;
  lesson?: number;
}

export interface Concept {
  title: string;
  en?: string;
  simple: string;
  technical: string;
  example: string;
  code?: string;
  check: Question;
}

export interface Term {
  tr: string;
  en: string;
  def: string;
}

export interface Lesson {
  id: number;
  title: string;
  en: string;
  minutes: number;
  goal: string;
  learn: string[];
  concepts: Concept[];
  terms: Term[];
  realLife: string[];
  labTitle: string;
  labDesc: string;
  summary: string[];
  quiz: Question[];
}

export interface QuizResult {
  score: number;
  total: number;
  at: number;
}

export interface ExamResult extends QuizResult {
  percent: number;
  weak: number[];
}

export interface Progress {
  completedLessons: number[];
  completedLabs: number[];
  quizResults: Record<number, QuizResult>;
  exam: ExamResult | null;
  lastLesson: number | null;
  lastSection: string | null;
}

export type LessonTab = "learn" | "lab" | "quiz" | "summary";
