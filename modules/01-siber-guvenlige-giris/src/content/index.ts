import type { CourseModule, LessonMeta, ModuleSummary } from "./types";
import { introModule } from "./modules/intro";

/**
 * Modül kayıt defteri.
 * Yeni bir modül (ör. "Ağ Güvenliği Temelleri") eklemek için modülü src/content/modules/ altında
 * oluşturup buraya eklemen yeterlidir; rotalar ve arayüz otomatik çalışır.
 */
export const modules: CourseModule[] = [introModule];

export const primaryModule = introModule;

export function getModule(slug: string): CourseModule | undefined {
  return modules.find((m) => m.slug === slug);
}

export function getLessonMeta(mod: CourseModule): LessonMeta[] {
  return mod.lessons.map((l) => ({
    id: l.id,
    title: l.title,
    subtitle: l.subtitle,
    minutes: l.minutes,
  }));
}

export function getModuleSummary(mod: CourseModule): ModuleSummary {
  return {
    id: mod.id,
    slug: mod.slug,
    code: mod.code,
    title: mod.title,
    level: mod.level,
    description: mod.description,
    passPercent: mod.passPercent,
    finalQuestionCount: mod.finalExam.length,
    lessons: getLessonMeta(mod),
  };
}

export function totalMinutes(mod: CourseModule): number {
  return mod.lessons.reduce((sum, l) => sum + l.minutes, 0);
}
