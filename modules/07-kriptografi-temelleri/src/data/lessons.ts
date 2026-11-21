import type { ReflectionData } from "@/components/ui";
import { LESSONS_A } from "./lessons-a";
import { LESSONS_B } from "./lessons-b";

export type Lesson = {
  id: number;
  title: string;
  en: string;
  emoji: string;
  minutes: number;
  intro: string;
  outcomes: string[];
  concepts: { t: string; en: string; d: string }[];
  visualTitle: string;
  visualNote: string;
  topics: { title: string; points: string[] }[];
  important: { kind: "info" | "warn" | "danger" | "ok"; title: string; text: string }[];
  compare: { title: string; cols: string[]; rows: string[][] };
  examples: { icon: string; title: string; text: string }[];
  labKeys: string[];
  labs: { title: string; intro: string; reflection: ReflectionData }[];
  summary: string[];
};

export const LESSONS: Lesson[] = [...LESSONS_A, ...LESSONS_B];

export const MODULE = {
  no: "07",
  name: "Kriptografi Temelleri",
  program: "Sıfırdan Siber Güvenlik Eğitim Programı",
  group: "G. KRİPTOGRAFİ TEMELLERİ",
};
