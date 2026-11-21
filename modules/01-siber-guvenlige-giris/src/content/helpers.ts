import type { Question } from "./types";

/** Kısa soru tanımı için yardımcı fonksiyon. */
export function q(
  id: string,
  topic: string,
  prompt: string,
  options: [string, string, string, string],
  answer: 0 | 1 | 2 | 3,
  explanation: string,
  lesson?: number,
): Question {
  return { id, topic, prompt, options, answer, explanation, lesson };
}

export function pad(n: number): string {
  return String(n).padStart(2, "0");
}
