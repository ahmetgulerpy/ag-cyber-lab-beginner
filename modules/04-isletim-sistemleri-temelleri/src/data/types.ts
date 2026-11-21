export type Q = [question: string, options: [string, string, string, string], correct: number, explanation: string];

export type Block = {
  h: string;
  p: string[];
  list?: string[];
  note?: { type: "info" | "warn" | "tip" | "danger"; text: string };
};

export type Lesson = {
  id: number;
  title: string;
  short: string;
  minutes: number;
  goal: string;
  outcomes: string[];
  sections: Block[];
  concepts: [string, string][];
  everyday: string[];
  technical: string[];
  examples: { title: string; code: string; desc: string }[];
  guide: string[];
  after: string[];
  summary: string[];
  quiz: Q[];
};
