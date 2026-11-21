import type { Lesson } from "./types";
import { LESSONS_1 } from "./lessons1";
import { LESSONS_2 } from "./lessons2";
import { LESSONS_3 } from "./lessons3";

export const ALL_LESSONS: Lesson[] = [...LESSONS_1, ...LESSONS_2, ...LESSONS_3].sort((a, b) => a.id - b.id);
