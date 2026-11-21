import type { Question } from "./types";
import { QUIZ_A } from "./questions-a";
import { QUIZ_B } from "./questions-b";

export const QUIZZES: Record<string, Question[]> = { ...QUIZ_A, ...QUIZ_B };
export { EXAM } from "./exam";
