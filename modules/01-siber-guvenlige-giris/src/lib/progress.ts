/**
 * localStorage tabanlı ilerleme deposu.
 * Harici bir servis veya veritabanı kullanılmaz. React tarafında useSyncExternalStore ile okunur.
 */

export interface QuizResult {
  score: number;
  total: number;
  bestScore: number;
  attempts: number;
  updatedAt: string;
  wrongTopics: string[];
}

export interface FinalResult {
  score: number;
  total: number;
  percent: number;
  bestPercent: number;
  attempts: number;
  updatedAt: string;
  weakLessons: number[];
}

export interface ModuleProgress {
  completedLessons: number[];
  activities: number[];
  quizzes: Record<string, QuizResult>;
  final: FinalResult | null;
  lastLesson: number | null;
}

export interface ProgressState {
  version: 1;
  modules: Record<string, ModuleProgress>;
}

export const STORAGE_KEY = "agcyberlab:progress:v1";

export const EMPTY_MODULE: ModuleProgress = {
  completedLessons: [],
  activities: [],
  quizzes: {},
  final: null,
  lastLesson: null,
};

const EMPTY_STATE: ProgressState = { version: 1, modules: {} };

let cacheRaw: string | null | undefined;
let cache: ProgressState = EMPTY_STATE;
let memoryOnly = false;
const listeners = new Set<() => void>();

function numArray(v: unknown): number[] {
  return Array.isArray(v) ? v.filter((n): n is number => typeof n === "number") : [];
}

function normalizeModule(v: unknown): ModuleProgress {
  if (!v || typeof v !== "object") return EMPTY_MODULE;
  const m = v as Partial<ModuleProgress>;
  return {
    completedLessons: numArray(m.completedLessons),
    activities: numArray(m.activities),
    quizzes: m.quizzes && typeof m.quizzes === "object" ? m.quizzes : {},
    final: m.final && typeof m.final === "object" ? m.final : null,
    lastLesson: typeof m.lastLesson === "number" ? m.lastLesson : null,
  };
}

function parse(raw: string | null): ProgressState {
  if (!raw) return EMPTY_STATE;
  try {
    const data = JSON.parse(raw) as { modules?: Record<string, unknown> };
    if (!data || typeof data !== "object" || !data.modules) return EMPTY_STATE;
    const modules: Record<string, ModuleProgress> = {};
    for (const [key, value] of Object.entries(data.modules)) {
      modules[key] = normalizeModule(value);
    }
    return { version: 1, modules };
  } catch {
    return EMPTY_STATE;
  }
}

export function getSnapshot(): ProgressState {
  if (typeof window === "undefined") return EMPTY_STATE;
  if (memoryOnly) return cache;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    memoryOnly = true;
    return cache;
  }
  if (raw === cacheRaw) return cache;
  cacheRaw = raw;
  cache = parse(raw);
  return cache;
}

export function getServerSnapshot(): ProgressState {
  return EMPTY_STATE;
}

function emit() {
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function write(next: ProgressState) {
  cache = next;
  const raw = JSON.stringify(next);
  try {
    window.localStorage.setItem(STORAGE_KEY, raw);
    cacheRaw = raw;
  } catch {
    memoryOnly = true;
  }
  emit();
}

function update(moduleId: string, fn: (m: ModuleProgress) => ModuleProgress) {
  const state = getSnapshot();
  const current = state.modules[moduleId] ?? EMPTY_MODULE;
  write({ version: 1, modules: { ...state.modules, [moduleId]: fn(current) } });
}

function addUnique(list: number[], n: number): number[] {
  return list.includes(n) ? list : [...list, n].sort((a, b) => a - b);
}

export function visitLesson(moduleId: string, lessonId: number) {
  const m = getSnapshot().modules[moduleId];
  if (m && m.lastLesson === lessonId) return;
  update(moduleId, (p) => ({ ...p, lastLesson: lessonId }));
}

export function markActivityDone(moduleId: string, lessonId: number) {
  const m = getSnapshot().modules[moduleId];
  if (m && m.activities.includes(lessonId)) return;
  update(moduleId, (p) => ({ ...p, activities: addUnique(p.activities, lessonId) }));
}

export function completeLesson(moduleId: string, lessonId: number) {
  update(moduleId, (p) => ({
    ...p,
    completedLessons: addUnique(p.completedLessons, lessonId),
    lastLesson: lessonId,
  }));
}

export function saveQuizResult(
  moduleId: string,
  lessonId: number,
  score: number,
  total: number,
  wrongTopics: string[],
) {
  update(moduleId, (p) => {
    const prev = p.quizzes[String(lessonId)];
    const result: QuizResult = {
      score,
      total,
      bestScore: Math.max(prev?.bestScore ?? 0, score),
      attempts: (prev?.attempts ?? 0) + 1,
      updatedAt: new Date().toISOString(),
      wrongTopics,
    };
    return { ...p, quizzes: { ...p.quizzes, [String(lessonId)]: result } };
  });
}

export function saveFinalResult(
  moduleId: string,
  score: number,
  total: number,
  weakLessons: number[],
) {
  update(moduleId, (p) => {
    const percent = Math.round((score / total) * 100);
    const result: FinalResult = {
      score,
      total,
      percent,
      bestPercent: Math.max(p.final?.bestPercent ?? 0, percent),
      attempts: (p.final?.attempts ?? 0) + 1,
      updatedAt: new Date().toISOString(),
      weakLessons,
    };
    return { ...p, final: result };
  });
}

export function resetModuleProgress(moduleId: string) {
  const state = getSnapshot();
  const modules = { ...state.modules };
  delete modules[moduleId];
  write({ version: 1, modules });
}
