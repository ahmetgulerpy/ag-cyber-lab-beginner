"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { LabFrame, cx } from "@/components/ui";
import { LESSONS } from "@/data/lessons";
import { useProgress } from "@/lib/progress";

export function Lab({ lessonId, index = 0, children }: { lessonId: number; index?: number; children: (finish: () => void, done: boolean) => ReactNode }) {
  const lesson = LESSONS.find((l) => l.id === lessonId)!;
  const meta = lesson.labs[index];
  const key = lesson.labKeys[index];
  const { data, markLab } = useProgress();
  const done = !!data.labs[key];
  const finish = useCallback(() => markLab(key), [markLab, key]);
  return (
    <LabFrame badge="ANA LABORATUVAR" title={meta.title} intro={meta.intro} reflection={meta.reflection} done={done}>
      {children(finish, done)}
    </LabFrame>
  );
}

export function Panel({ title, step, children, tone = "neutral" }: { title: string; step?: string; children: ReactNode; tone?: "neutral" | "danger" | "brand" }) {
  return (
    <div className={cx("rounded-xl border p-4", tone === "danger" ? "border-bad/40 bg-[#FDF5F5]" : tone === "brand" ? "border-brand/30 bg-soft/50" : "border-line bg-white")}>
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
        {step && <span className="grid h-6 min-w-6 place-items-center rounded-full bg-accent px-1 text-xs text-white">{step}</span>}
        {title}
      </p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/** Basit bayrak takibi: laboratuvarın hangi adımlarının yapıldığını izler ve hepsi tamamlanınca finish çağırır */
export function useFlags<K extends string>(keys: readonly K[], finish: () => void) {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const set = useCallback((k: K) => setFlags((f) => (f[k] ? f : { ...f, [k]: true })), []);
  const all = keys.every((k) => flags[k]);
  useEffect(() => {
    if (all) finish();
  }, [all, finish]);
  return { flags, set, all, count: keys.filter((k) => flags[k]).length };
}

export function Checklist({ items, flags }: { items: [string, string][]; flags: Record<string, boolean> }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-xl border border-dashed border-line bg-bg p-3">
      <span className="w-full text-xs font-semibold uppercase tracking-wide text-muted">Laboratuvar görevleri</span>
      {items.map(([k, label]) => (
        <span key={k} className={cx("rounded-full border px-2.5 py-0.5 text-xs", flags[k] ? "border-ok/40 bg-[#E6F3EC] text-ok" : "border-line bg-white text-muted")}>
          {flags[k] ? "✓" : "○"} {label}
        </span>
      ))}
    </div>
  );
}

export function useAsync() {
  const [busy, setBusy] = useState(false);
  const run = useCallback(async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  }, []);
  return { busy, run };
}
