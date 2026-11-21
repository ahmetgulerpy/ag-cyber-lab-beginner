import { lessonsA } from "./lessons-a";
import { lessonsB } from "./lessons-b";
import { lessonsC } from "./lessons-c";
import type { Lesson } from "./types";

export const lessons: Lesson[] = [...lessonsA, ...lessonsB, ...lessonsC].sort((a, b) => a.no - b.no);

export function getLesson(slug: string): Lesson | undefined {
  return lessons.find((l) => l.slug === slug);
}

export function getLessonByNo(no: number): Lesson | undefined {
  return lessons.find((l) => l.no === no);
}

export const MODULE_NAME = "Siber Tehditleri Tanıma";
