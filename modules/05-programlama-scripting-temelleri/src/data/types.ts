export type Question = {
  q: string;
  options: string[];
  answer: number;
  explain: string;
};

export type Section = {
  title: string;
  paras: string[];
  bullets?: string[];
};

export type Lesson = {
  id: number;
  title: string;
  goal: string;
  outcomes: string[];
  duration: string;
  sections: Section[];
  terms: { tr: string; en: string; desc: string }[];
  examples: { title: string; text: string }[];
  code: { title: string; lang: string; code: string; note?: string }[];
  scenario: { title: string; text: string; tasks: string[] };
  summary: string[];
  quiz: Question[];
};

export function q(
  question: string,
  options: [string, string, string, string],
  answer: number,
  explain: string,
): Question {
  return { q: question, options, answer, explain };
}
