"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Button, Callout, LabFrame, Pill, cx, type ReflectionData } from "@/components/ui";
import { useProgress } from "@/lib/progress";
import { CUSTOM_PRACTICES } from "@/components/labs/custom";

export type ScenarioItem = {
  situation: string;
  question: string;
  options: { text: string; correct: boolean; why: string }[];
};

export type ActivitySpec = {
  title: string;
  intro: string;
  reflection: ReflectionData;
} & (
  | { type: "scenario"; items: ScenarioItem[] }
  | { type: "match"; pairs: { left: string; right: string; why?: string }[] }
  | { type: "order"; steps: string[]; explain?: string[] }
  | { type: "classify"; buckets: string[]; items: { text: string; bucket: number; why: string }[] }
  | { type: "custom"; custom: string }
);

/** Sabit tohumlu (deterministik) karıştırma – hydration uyumlu */
export function shuffled<T>(arr: T[], seed = 7): T[] {
  const a = [...arr];
  let s = seed;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------------- Senaryo ---------------- */
function ScenarioSet({ items, onComplete }: { items: ScenarioItem[]; onComplete: () => void }) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [solved, setSolved] = useState<Record<number, boolean>>({});
  const total = items.length;
  const solvedCount = Object.values(solved).filter(Boolean).length;

  const pick = (i: number, o: number) => {
    if (solved[i]) return;
    setPicked((p) => ({ ...p, [i]: o }));
    if (items[i].options[o].correct) {
      const next = { ...solved, [i]: true };
      setSolved(next);
      if (Object.values(next).filter(Boolean).length === total) onComplete();
    }
  };

  return (
    <div className="space-y-5">
      {items.map((it, i) => (
        <div key={i} className="rounded-xl border border-line bg-bg p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent">Durum {i + 1}</p>
          <p className="text-sm text-ink">{it.situation}</p>
          <p className="mt-2 text-sm font-semibold text-ink">{it.question}</p>
          <div className="mt-3 grid gap-2">
            {it.options.map((op, o) => {
              const chosen = picked[i] === o;
              const show = chosen;
              return (
                <div key={o}>
                  <button
                    type="button"
                    disabled={solved[i]}
                    onClick={() => pick(i, o)}
                    className={cx(
                      "w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                      !show && "border-line bg-white hover:border-brand",
                      show && op.correct && "border-ok bg-[#E6F3EC]",
                      show && !op.correct && "border-bad bg-[#F9E8E8]",
                      solved[i] && !chosen && "opacity-60",
                    )}
                  >
                    {op.text}
                  </button>
                  {show && (
                    <p className={cx("fadeup mt-1 px-1 text-xs", op.correct ? "text-ok" : "text-bad")}>
                      {op.correct ? "✓ Doğru. " : "✗ Yanlış. "}
                      {op.why}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between gap-2">
        <Pill tone={solvedCount === total ? "ok" : "brand"}>
          {solvedCount}/{total} durum çözüldü
        </Pill>
        {solvedCount !== total && <span className="text-xs text-muted">Yanlış seçimde başka seçeneği deneyebilirsin.</span>}
      </div>
    </div>
  );
}

/* ---------------- Eşleştirme ---------------- */
function MatchGame({ pairs, onComplete }: { pairs: { left: string; right: string; why?: string }[]; onComplete: () => void }) {
  const options = useMemo(() => shuffled(pairs.map((p) => p.right), 11), [pairs]);
  const [sel, setSel] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const allRight = pairs.every((p, i) => sel[i] === p.right);

  const check = () => {
    setChecked(true);
    if (pairs.every((p, i) => sel[i] === p.right)) onComplete();
  };

  return (
    <div className="space-y-3">
      {pairs.map((p, i) => {
        const ok = sel[i] === p.right;
        return (
          <div key={i} className={cx("rounded-xl border p-3", checked ? (ok ? "border-ok bg-[#E6F3EC]" : "border-bad bg-[#F9E8E8]") : "border-line bg-bg")}>
            <div className="grid gap-2 sm:grid-cols-2 sm:items-center">
              <p className="text-sm font-medium text-ink">{p.left}</p>
              <select
                value={sel[i] ?? ""}
                onChange={(e) => {
                  setSel((s) => ({ ...s, [i]: e.target.value }));
                  setChecked(false);
                }}
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm"
              >
                <option value="">— Eşleştirmeyi seç —</option>
                {options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            {checked && <p className="mt-2 text-xs text-ink/80">{ok ? `✓ ${p.why ?? "Doğru eşleşme."}` : "✗ Bu eşleşme doğru değil, tekrar düşün."}</p>}
          </div>
        );
      })}
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={check} disabled={Object.keys(sel).length < pairs.length}>
          Kontrol et
        </Button>
        {checked && (allRight ? <Pill tone="ok">Tüm eşleşmeler doğru 🎉</Pill> : <Pill tone="warn">Bazı eşleşmeler hatalı</Pill>)}
      </div>
    </div>
  );
}

/* ---------------- Sıralama ---------------- */
function OrderGame({ steps, explain, onComplete }: { steps: string[]; explain?: string[]; onComplete: () => void }) {
  const initial = useMemo(() => {
    let s = 3;
    let out = shuffled(steps.map((_, i) => i), s);
    while (out.every((v, i) => v === i) && s < 50) out = shuffled(steps.map((_, i) => i), ++s);
    return out;
  }, [steps]);
  const [order, setOrder] = useState<number[]>(initial);
  const [checked, setChecked] = useState(false);

  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= order.length) return;
    const o = [...order];
    [o[i], o[j]] = [o[j], o[i]];
    setOrder(o);
    setChecked(false);
  };
  const correct = order.every((v, i) => v === i);

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted">Okları kullanarak adımları doğru sıraya diz.</p>
      <ol className="space-y-2">
        {order.map((v, i) => (
          <li key={v} className={cx("flex items-center gap-3 rounded-xl border p-3", checked ? (v === i ? "border-ok bg-[#E6F3EC]" : "border-bad bg-[#F9E8E8]") : "border-line bg-bg")}>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-xs font-semibold text-white">{i + 1}</span>
            <span className="flex-1 text-sm text-ink">{steps[v]}</span>
            <span className="flex shrink-0 gap-1">
              <button type="button" aria-label="Yukarı taşı" onClick={() => move(i, -1)} disabled={i === 0} className="rounded border border-line bg-white px-2 py-1 text-xs disabled:opacity-30">
                ▲
              </button>
              <button type="button" aria-label="Aşağı taşı" onClick={() => move(i, 1)} disabled={i === order.length - 1} className="rounded border border-line bg-white px-2 py-1 text-xs disabled:opacity-30">
                ▼
              </button>
            </span>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={() => {
            setChecked(true);
            if (correct) onComplete();
          }}
        >
          Sırayı kontrol et
        </Button>
        {checked && (correct ? <Pill tone="ok">Sıralama doğru 🎉</Pill> : <Pill tone="warn">{order.filter((v, i) => v === i).length}/{order.length} adım doğru yerde</Pill>)}
      </div>
      {checked && correct && explain && (
        <ol className="fadeup space-y-1 rounded-xl border border-line bg-white p-3 text-xs text-muted">
          {explain.map((e, i) => (
            <li key={i}>
              <b className="text-ink">{i + 1}.</b> {e}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/* ---------------- Sınıflandırma ---------------- */
function ClassifyGame({ buckets, items, onComplete }: { buckets: string[]; items: { text: string; bucket: number; why: string }[]; onComplete: () => void }) {
  const order = useMemo(() => shuffled(items.map((_, i) => i), 5), [items]);
  const [sel, setSel] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const right = items.filter((it, i) => sel[i] === it.bucket).length;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 text-xs text-muted">
        Kategoriler: {buckets.map((b) => <Pill key={b} tone="brand">{b}</Pill>)}
      </div>
      {order.map((i) => {
        const it = items[i];
        const ok = sel[i] === it.bucket;
        return (
          <div key={i} className={cx("rounded-xl border p-3", checked ? (ok ? "border-ok bg-[#E6F3EC]" : "border-bad bg-[#F9E8E8]") : "border-line bg-bg")}>
            <p className="mb-2 text-sm text-ink">{it.text}</p>
            <div className="flex flex-wrap gap-2">
              {buckets.map((b, bi) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    setSel((s) => ({ ...s, [i]: bi }));
                    setChecked(false);
                  }}
                  className={cx("rounded-full border px-3 py-1 text-xs font-medium", sel[i] === bi ? "border-brand bg-brand text-white" : "border-line bg-white text-ink hover:border-brand")}
                >
                  {b}
                </button>
              ))}
            </div>
            {checked && <p className="mt-2 text-xs text-ink/80">{ok ? "✓ " : `✗ Doğrusu: ${buckets[it.bucket]}. `}{it.why}</p>}
          </div>
        );
      })}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          disabled={Object.keys(sel).length < items.length}
          onClick={() => {
            setChecked(true);
            if (items.every((it, i) => sel[i] === it.bucket)) onComplete();
          }}
        >
          Kontrol et
        </Button>
        {checked && (right === items.length ? <Pill tone="ok">Hepsi doğru 🎉</Pill> : <Pill tone="warn">{right}/{items.length} doğru</Pill>)}
      </div>
    </div>
  );
}

/* ---------------- Sarmalayıcı ---------------- */
export function ActivityView({ lessonId, spec, kind }: { lessonId: number; spec: ActivitySpec; kind: "practice" | "scenario" }) {
  const { data, markPractice, markScenario } = useProgress();
  const done = kind === "practice" ? !!data.practices[lessonId] : !!data.scenarios[lessonId];
  const complete = () => (kind === "practice" ? markPractice(lessonId) : markScenario(lessonId));
  let body: ReactNode = null;
  if (spec.type === "scenario") body = <ScenarioSet items={spec.items} onComplete={complete} />;
  else if (spec.type === "match") body = <MatchGame pairs={spec.pairs} onComplete={complete} />;
  else if (spec.type === "order") body = <OrderGame steps={spec.steps} explain={spec.explain} onComplete={complete} />;
  else if (spec.type === "classify") body = <ClassifyGame buckets={spec.buckets} items={spec.items} onComplete={complete} />;
  else {
    const C = CUSTOM_PRACTICES[spec.custom];
    body = C ? <C onDone={complete} /> : <Callout kind="danger">Etkinlik bulunamadı.</Callout>;
  }
  return (
    <LabFrame badge={kind === "practice" ? "EK MİNİ PRATİK" : "SENARYO"} title={spec.title} intro={spec.intro} reflection={spec.reflection} done={done}>
      {body}
    </LabFrame>
  );
}
