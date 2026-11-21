"use client";

import { useState } from "react";
import { ArrowRight, Check, Lightbulb, RotateCcw } from "lucide-react";
import type { Scenario, ScenarioActivityDef, ScenarioChoice } from "@/content/types";
import { Badge, btnPrimary, btnSecondary, TerminalBlock, toneBox, type Tone } from "../ui";

type Verdict = ScenarioChoice["verdict"];

const verdictMeta: Record<Verdict, { label: string; tone: Tone }> = {
  best: { label: "En doğru yaklaşım", tone: "success" },
  acceptable: { label: "Kabul edilebilir ama eksik", tone: "warn" },
  poor: { label: "Riskli yaklaşım", tone: "danger" },
};

interface Prog {
  step: number;
  done: boolean;
  firsts: Verdict[];
}

interface StepView {
  chosen: number | null;
  explored: number[];
}

export function ScenarioActivity({ def, onComplete }: { def: ScenarioActivityDef; onComplete: () => void }) {
  const [active, setActive] = useState(0);
  const [prog, setProg] = useState<Record<string, Prog>>({});
  const [views, setViews] = useState<Record<string, StepView>>({});

  const sc: Scenario = def.scenarios[active];
  const p: Prog = prog[sc.id] ?? { step: 0, done: false, firsts: [] };
  const step = sc.steps[p.step];
  const viewKey = `${sc.id}:${p.step}`;
  const view: StepView = views[viewKey] ?? { chosen: null, explored: [] };

  function choose(ci: number) {
    const explored = view.explored.includes(ci) ? view.explored : [...view.explored, ci];
    setViews({ ...views, [viewKey]: { chosen: ci, explored } });
    if (p.firsts[p.step] === undefined) {
      const firsts = [...p.firsts];
      firsts[p.step] = step.choices[ci].verdict;
      setProg({ ...prog, [sc.id]: { ...p, firsts } });
    }
  }

  function next() {
    if (p.step < sc.steps.length - 1) {
      setProg({ ...prog, [sc.id]: { ...p, step: p.step + 1 } });
      return;
    }
    const nextProg = { ...prog, [sc.id]: { ...p, done: true } };
    setProg(nextProg);
    if (def.scenarios.every((s) => nextProg[s.id]?.done)) onComplete();
  }

  function replay() {
    const np = { ...prog };
    delete np[sc.id];
    const nv = { ...views };
    sc.steps.forEach((_, i) => delete nv[`${sc.id}:${i}`]);
    setProg(np);
    setViews(nv);
  }

  const doneCount = def.scenarios.filter((s) => prog[s.id]?.done).length;
  const chosenChoice = view.chosen !== null ? step.choices[view.chosen] : null;

  return (
    <div>
      <h3 className="text-lg font-bold text-ink">{def.title}</h3>
      <p className="mt-1 max-w-prose text-sm leading-relaxed text-ink/80">{def.intro}</p>

      {def.scenarios.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Senaryolar">
          {def.scenarios.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${i === active ? "border-brand bg-brand text-white" : "border-line bg-white text-ink hover:border-brand"}`}
            >
              {prog[s.id]?.done && <Check size={14} aria-label="Tamamlandı" />}
              {s.title}
            </button>
          ))}
        </div>
      )}
      <p className="mt-3 inline-block rounded-full bg-soft px-3 py-1 text-sm font-semibold text-brand">
        {doneCount} / {def.scenarios.length} senaryo tamamlandı
      </p>

      <div className="mt-4 rounded-xl border border-line bg-white p-4 sm:p-5">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
          {sc.title}
          {sc.steps.length > 1 && ` · Adım ${Math.min(p.step + 1, sc.steps.length)} / ${sc.steps.length}`}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink/90">{sc.context}</p>

        {p.done ? (
          <div className={`mt-4 rounded-lg border p-4 ${toneBox.success}`} aria-live="polite">
            <p className="text-sm font-bold text-success">Senaryo tamamlandı.</p>
            <p className="mt-1 text-sm leading-relaxed text-ink/90">
              {sc.steps.length} karar noktasından {p.firsts.filter((v) => v === "best").length} tanesinde ilk tercihin en doğru yaklaşımdı.
              Önemli olan sonucu değil, her kararın gerekçesini anlamaktır; istersen senaryoyu farklı seçimlerle tekrar oynayabilirsin.
            </p>
            <button className={`${btnSecondary} mt-3`} onClick={replay}>
              <RotateCcw size={15} aria-hidden /> Senaryoyu tekrar oyna
            </button>
          </div>
        ) : (
          <>
            <h4 className="mt-4 text-base font-semibold text-ink">{step.prompt}</h4>
            {step.evidence && <TerminalBlock terminal={step.evidence} />}
            <div className="mt-3 grid gap-2.5">
              {step.choices.map((c, ci) => {
                const isChosen = view.chosen === ci;
                const wasExplored = view.explored.includes(ci);
                return (
                  <button
                    key={ci}
                    onClick={() => choose(ci)}
                    aria-pressed={isChosen}
                    className={`flex items-start justify-between gap-3 rounded-lg border px-3.5 py-3 text-left text-sm leading-relaxed transition-colors ${isChosen ? "border-brand bg-soft ring-1 ring-brand" : "border-line bg-white hover:border-brand hover:bg-soft/50"}`}
                  >
                    <span>{c.text}</span>
                    {wasExplored && (
                      <span className="shrink-0">
                        <Badge tone={verdictMeta[c.verdict].tone}>{verdictMeta[c.verdict].label}</Badge>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {chosenChoice && (
              <div className={`mt-4 rounded-lg border p-4 ${toneBox[verdictMeta[chosenChoice.verdict].tone]}`} aria-live="polite">
                <Badge tone={verdictMeta[chosenChoice.verdict].tone}>{verdictMeta[chosenChoice.verdict].label}</Badge>
                <p className="mt-2 text-sm leading-relaxed text-ink/90">{chosenChoice.feedback}</p>
                <p className="mt-2 flex gap-2 text-sm leading-relaxed text-ink/90">
                  <Lightbulb size={16} className="mt-0.5 shrink-0 text-brand" aria-hidden />
                  <span>
                    <strong>Hatırla:</strong> {chosenChoice.concept}
                  </span>
                </p>
                <p className="mt-2 text-xs text-muted">Diğer seçenekleri de tıklayıp sonuçlarını karşılaştırabilirsin.</p>
                <button className={`${btnPrimary} mt-3`} onClick={next}>
                  {p.step < sc.steps.length - 1 ? "Sonraki adıma geç" : "Senaryoyu bitir"} <ArrowRight size={16} aria-hidden />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
