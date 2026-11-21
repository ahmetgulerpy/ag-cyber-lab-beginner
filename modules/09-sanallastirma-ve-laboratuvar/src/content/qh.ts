import type { Question, Screen } from "./types";

type Opt = [string, string];
type Extra = { format?: Question["format"]; screen?: Screen; scenario?: string; level?: Question["level"]; lesson?: string; explain?: string };

export const mc = (id: string, q: string, opts: Opt[], ans: number, e: Extra = {}): Question => ({
  id, type: "mc", format: e.format ?? "Çoktan seçmeli", q, options: opts.map((o) => o[0]), why: opts.map((o) => o[1]), answer: ans,
  screen: e.screen, scenario: e.scenario, level: e.level, lesson: e.lesson, explain: e.explain,
});

export const mu = (id: string, q: string, opts: Opt[], answers: number[], explain: string, e: Extra = {}): Question => ({
  id, type: "multi", format: e.format ?? "Doğru yapılandırma", q, options: opts.map((o) => o[0]), why: opts.map((o) => o[1]), answers,
  screen: e.screen, scenario: e.scenario, level: e.level, lesson: e.lesson, explain,
});

export const ord = (id: string, q: string, order: string[], explain: string, e: Extra = {}): Question => ({
  id, type: "order", format: "Kurulum sıralama", q, order, explain, screen: e.screen, scenario: e.scenario, level: e.level, lesson: e.lesson,
});
