import type { Block, Screen } from "../types";

type LI = string | { v: string; hl?: number; sel?: boolean; sub?: string };

export const T = (v: string, o: { muted?: boolean; bold?: boolean; hl?: number } = {}): Block => ({ t: "text", v, ...o });
export const B = (v: string, hl?: number, primary?: boolean): Block => ({ t: "btn", v, hl, primary });
export const F = (label: string, v: string, hl?: number): Block => ({ t: "field", label, v, hl });
export const S = (label: string, v: string, hl?: number): Block => ({ t: "select", label, v, hl });
export const C = (v: string, on?: boolean, hl?: number): Block => ({ t: "check", v, on, hl });
export const L = (items: LI[]): Block => ({ t: "list", items: items.map((i) => (typeof i === "string" ? { v: i } : i)) });
export const R = (...items: Block[]): Block => ({ t: "row", items });
export const Tm = (lines: string[], hl?: number): Block => ({ t: "term", lines, hl });
export const P = (v: number, label?: string): Block => ({ t: "progress", v, label });
export const Sl = (label: string, v: string, pct: number, hl?: number): Block => ({ t: "slider", label, v, pct, hl });
export const Tb = (items: string[], active: number, hl?: number): Block => ({ t: "tabs", items, active, hl });
export const W = (v: string): Block => ({ t: "warn", v });

export const sc = (title: string, blocks: Block[], marks?: Record<number, string>, extra: Partial<Screen> = {}): Screen => ({ title, blocks, marks, ...extra });
export const web = (title: string, url: string, blocks: Block[], marks?: Record<number, string>): Screen => ({ title, url, kind: "web", blocks, marks });
