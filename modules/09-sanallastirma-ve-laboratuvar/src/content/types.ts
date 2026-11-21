export type Block =
  | { t: "text"; v: string; muted?: boolean; bold?: boolean; hl?: number }
  | { t: "btn"; v: string; hl?: number; primary?: boolean; disabled?: boolean }
  | { t: "field"; label: string; v: string; hl?: number }
  | { t: "select"; label: string; v: string; hl?: number }
  | { t: "check"; v: string; on?: boolean; hl?: number }
  | { t: "list"; items: { v: string; hl?: number; sel?: boolean; sub?: string }[] }
  | { t: "progress"; v: number; label?: string }
  | { t: "term"; lines: string[]; hl?: number }
  | { t: "row"; items: Block[] }
  | { t: "slider"; label: string; v: string; pct: number; hl?: number }
  | { t: "tabs"; items: string[]; active: number; hl?: number }
  | { t: "warn"; v: string };

export type Screen = {
  title: string;
  kind?: "win" | "mac" | "linux" | "web" | "term";
  url?: string;
  sidebar?: string[];
  blocks: Block[];
  marks?: Record<number, string>;
};

export type Step = {
  phase: number;
  screen: string;
  title: string;
  explain: string;
  actions: string[];
  mock: Screen;
  expected: string;
  error: string;
  fix: string;
  osNote?: string;
  link?: { label: string; href: string };
};

export type Guide = {
  id: string;
  title: string;
  phases: string[];
  steps: Step[];
  trouble: string[];
  verify: string[];
};

export type Trouble = {
  title: string;
  causes: string[];
  fixes: string[];
  osNote?: string;
};

export type Question = {
  id: string;
  type: "mc" | "multi" | "order";
  format: "Çoktan seçmeli" | "Görsel yorumlama" | "Senaryo" | "Kurulum sıralama" | "Doğru yapılandırma";
  q: string;
  scenario?: string;
  screen?: Screen;
  options?: string[];
  answer?: number;
  answers?: number[];
  /** Her seçenek için neden doğru/yanlış olduğunu açıklayan metin */
  why?: string[];
  /** Doğru sıradaki adımlar (order tipi) */
  order?: string[];
  explain?: string;
  level?: "Kolay" | "Orta" | "Zor";
  lesson?: string;
};
