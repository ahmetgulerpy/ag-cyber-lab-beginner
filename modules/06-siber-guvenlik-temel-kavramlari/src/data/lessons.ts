import type { Lesson } from "./types";
import { LESSONS_A } from "./lessons-a";
import { LESSONS_B } from "./lessons-b";
import { LESSONS_C } from "./lessons-c";

export const LESSONS: Lesson[] = [...LESSONS_A, ...LESSONS_B, ...LESSONS_C];

export function getLesson(id: string) {
  return LESSONS.find((l) => l.id === id);
}
