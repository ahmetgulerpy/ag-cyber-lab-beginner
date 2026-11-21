export type CalloutKind = "important" | "real" | "note" | "warning" | "mistake" | "recall";

export type Callout = { kind: CalloutKind; title?: string; text: string };

export type CompareSide = {
  title: string;
  en: string;
  tagline: string;
  points: string[];
  example: string;
};

export type Question = {
  q: string;
  options: [string, string, string, string];
  answer: number;
  explain: string;
};

export type Lesson = {
  id: string;
  no: number;
  title: string;
  en: string;
  intro: string;
  goal: string;
  minutes: number;
  outcomes: string[];
  concepts: { term: string; en: string; desc: string }[];
  visualTitle: string;
  visualHint: string;
  topics: { title: string; text: string; points?: string[]; callout?: Callout }[];
  compare?: { title: string; left: CompareSide; right: CompareSide };
  examples: { title: string; text: string; tag: string }[];
  labTitle: string;
  labIntro: string;
  labResult: string[];
  scenario: { story: string; q: string; options: string[]; answer: number; explain: string };
  summary: string[];
};
