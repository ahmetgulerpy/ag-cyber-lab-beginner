export type QuizQ = {
  q: string;
  o: [string, string, string, string];
  a: number;
  e: string;
};

export const Q = (q: string, o: [string, string, string, string], a: number, e: string): QuizQ => ({ q, o, a, e });

export type Lesson = {
  id: number;
  title: string;
  minutes: number;
  labTitle: string;
  purpose: string;
  outcomes: string[];
  sections: { h: string; p: string[] }[];
  concepts: [string, string][];
  daily: string[];
  examples: { title: string; code: string; note: string }[];
  steps: string[];
  after: string[];
  quiz: QuizQ[];
  summary: string[];
};

export type FinalQ = QuizQ & { level: "Kolay" | "Orta" | "Uygulama"; lesson: number };
