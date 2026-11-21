export type Quiz = {
  q: string;
  options: string[];
  correct: number;
  explain: string;
};

export type Lesson = {
  slug: string;
  no: number;
  title: string;
  en: string;
  icon: string;
  minutes: number;
  goal: string;
  skills: string[];
  hook: string;
  concepts: { icon: string; title: string; body: string }[];
  tips: string[];
  quick: { q: string; answer: boolean; explain: string }[];
  diagram: { title: string; caption: string; steps: { icon: string; label: string; desc: string }[] };
  compare: { title: string; cols: string[]; rows: string[][] };
  terms: { term: string; def: string }[];
  story: { title: string; text: string; lesson: string };
  task: { title: string; desc: string; steps: string[] };
  quiz: Quiz[];
  summary: string[];
};
