/**
 * AG Cyber Lab — içerik tipleri.
 * Yeni bir modül (orta / ileri seviye) eklemek için src/content/modules/<modul>/ altında
 * bu tiplere uygun bir CourseModule tanımlayıp src/content/index.ts içindeki listeye eklemek yeterlidir.
 */

export interface Question {
  id: string;
  /** Yanlış cevap durumunda önerilecek konu başlığı (Topic.title ile aynı olmalı) */
  topic: string;
  /** Genel değerlendirmede hangi derse ait olduğu */
  lesson?: number;
  prompt: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface Terminal {
  title: string;
  lines: string[];
}

export interface Topic {
  title: string;
  en?: string;
  /** 1. adım: sade anlatım */
  simple: string;
  /** 2. adım: teknik açıklama */
  technical: string;
  /** 3. adım: gerçek hayattan örnek */
  example: string;
  terminal?: Terminal;
}

export interface Concept {
  term: string;
  en?: string;
  definition: string;
}

export interface RealExample {
  title: string;
  text: string;
  takeaway: string;
}

/* ---------- Etkileşimli uygulamalar ---------- */

export interface MatchCategory {
  id: string;
  label: string;
  description?: string;
}

export interface MatchItem {
  id: string;
  text: string;
  answer: string;
  explanation: string;
}

export interface MatchActivityDef {
  type: "match";
  title: string;
  intro: string;
  categories: MatchCategory[];
  items: MatchItem[];
  reminder: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  what: string;
  why: string;
  impact: string;
}

export interface TimelineActivityDef {
  type: "timeline";
  title: string;
  intro: string;
  events: TimelineEvent[];
}

export interface Actor {
  id: string;
  name: string;
  en?: string;
  short: string;
  role: string;
  responsibilities: string[];
  relations: { to: string; text: string }[];
}

export interface EcosystemActivityDef {
  type: "ecosystem";
  title: string;
  intro: string;
  center: string;
  actors: Actor[];
}

export interface ScenarioChoice {
  text: string;
  verdict: "best" | "acceptable" | "poor";
  feedback: string;
  concept: string;
}

export interface ScenarioStep {
  prompt: string;
  evidence?: Terminal;
  choices: ScenarioChoice[];
}

export interface Scenario {
  id: string;
  title: string;
  context: string;
  steps: ScenarioStep[];
}

export interface ScenarioActivityDef {
  type: "scenario";
  title: string;
  intro: string;
  scenarios: Scenario[];
}

export interface ExploreCard {
  id: string;
  name: string;
  en?: string;
  tagline: string;
  points: string[];
  example: string;
  mini: { story: string; question: string; answer: string };
}

export interface ExploreMatchActivityDef {
  type: "explore-match";
  title: string;
  intro: string;
  cardsTitle: string;
  cards: ExploreCard[];
  match: MatchActivityDef;
}

export interface SkillDimension {
  id: string;
  label: string;
}

export interface Career {
  id: string;
  name: string;
  tr: string;
  summary: string;
  daily: string;
  knowledge: string[];
  tools: string[];
  skills: string[];
  path: string;
  /** SkillDimension sırasıyla 1-5 arası değerler */
  profile: number[];
}

export interface InterestOption {
  id: string;
  label: string;
  careers: string[];
}

export interface CareerActivityDef {
  type: "career";
  title: string;
  intro: string;
  dimensions: SkillDimension[];
  careers: Career[];
  interests: InterestOption[];
}

export type ActivityDef =
  | MatchActivityDef
  | TimelineActivityDef
  | EcosystemActivityDef
  | ScenarioActivityDef
  | ExploreMatchActivityDef
  | CareerActivityDef;

/* ---------- Ders ve modül ---------- */

export interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  goal: string;
  outcomes: string[];
  minutes: number;
  topics: Topic[];
  examples: RealExample[];
  concepts: Concept[];
  activity: ActivityDef;
  quiz: Question[];
  summary: string[];
}

export interface CourseModule {
  id: string;
  slug: string;
  code: string;
  level: "Başlangıç" | "Orta" | "İleri";
  title: string;
  tagline: string;
  description: string;
  lessons: Lesson[];
  finalExam: Question[];
  /** Genel değerlendirme için başarı eşiği (yüzde) */
  passPercent: number;
}

export interface LessonMeta {
  id: number;
  title: string;
  subtitle: string;
  minutes: number;
}

/** İstemci bileşenlerine geçirilen hafif modül özeti (ders içeriği içermez). */
export interface ModuleSummary {
  id: string;
  slug: string;
  code: string;
  title: string;
  level: CourseModule["level"];
  description: string;
  passPercent: number;
  finalQuestionCount: number;
  lessons: LessonMeta[];
}
