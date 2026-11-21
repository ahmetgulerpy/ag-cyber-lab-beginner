"use client";

import { useEffect, useMemo, useState } from "react";
import type { Guide } from "@/content/types";
import { setGuideStep, useProgress } from "@/lib/progress";
import { MockScreen } from "./MockScreen";
import { Checklist, Troubleshoot } from "./Interactive";
import { Callout, ExtLink, ProgressBar } from "./ui";

export function InstallGuide({ guide }: { guide: Guide }) {
  const p = useProgress();
  const g = p.guides[guide.id] ?? { done: [], seen: [] };
  const done = useMemo(() => new Set(g.done), [g.done]);
  const seen = useMemo(() => new Set(g.seen), [g.seen]);
  const [cur, setCur] = useState(0);
  const [initialised, setInitialised] = useState(false);
  const [showTrouble, setShowTrouble] = useState(false);
  const total = guide.steps.length;

  useEffect(() => {
    if (initialised) return;
    setInitialised(true);
    const first = guide.steps.findIndex((_, i) => !g.done.includes(i));
    if (first > 0) setCur(first);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const step = guide.steps[cur];
  const pct = (done.size / total) * 100;
  const phaseDone = (ph: number) => guide.steps.every((s, i) => s.phase !== ph || done.has(i));
  const go = (i: number) => {
    setCur(Math.max(0, Math.min(total - 1, i)));
    setShowTrouble(false);
  };

  return (
    <div className="space-y-6">
      {/* A. Adım göstergesi */}
      <div className="card !p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold text-ag-text">{guide.title}</h3>
          <span className="chip">
            {done.size}/{total} adım tamamlandı
          </span>
        </div>
        <ol className="mb-3 grid grid-cols-5 gap-1 sm:gap-2">
          {guide.phases.map((ph, i) => {
            const active = step.phase === i;
            const ok = phaseDone(i);
            return (
              <li key={ph} className={`rounded-lg border px-1 py-2 text-center text-[10px] font-bold sm:text-xs ${active ? "border-ag-brand bg-ag-brand text-white" : ok ? "border-ag-ok/40 bg-[#edf8f2] text-ag-ok" : "border-ag-line bg-white text-ag-muted"}`}>
                <span className="block text-[10px] opacity-80">{ok && !active ? "✓" : i + 1}</span>
                {ph}
              </li>
            );
          })}
        </ol>
        <ProgressBar pct={pct} tone={pct === 100 ? "ok" : "brand"} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        {/* Adım listesi */}
        <nav aria-label="Adımlar" className="card !p-2 lg:self-start">
          <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {guide.steps.map((s, i) => (
              <li key={s.title} className="shrink-0 lg:shrink">
                <button type="button" onClick={() => go(i)} className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition ${i === cur ? "bg-ag-light text-ag-brand" : "text-ag-muted hover:bg-ag-bg"}`}>
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${done.has(i) ? "bg-ag-ok text-white" : i === cur ? "bg-ag-brand text-white" : "bg-ag-line text-ag-muted"}`}>{done.has(i) ? "✓" : i + 1}</span>
                  <span className="whitespace-nowrap lg:whitespace-normal">{s.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip">
              Adım {cur + 1}/{total}
            </span>
            <span className="chip !border-ag-warn/40 !bg-[#fff8e8] !text-[#8a5f12]">📍 Şu an: {step.screen}</span>
            <span className="chip">{guide.phases[step.phase]}</span>
          </div>
          <h4 className="text-xl font-bold text-ag-text">{step.title}</h4>
          <p className="text-sm leading-relaxed text-ag-muted">{step.explain}</p>

          <div className="grid gap-4 xl:grid-cols-2">
            {/* B. Görsel işlem alanı */}
            <MockScreen s={step.mock} />
            <div className="space-y-3">
              <div className="card !p-4">
                <p className="mb-2 text-sm font-bold text-ag-brand">Yapacağın işlemler</p>
                <ol className="space-y-2">
                  {step.actions.map((a, i) => (
                    <li key={a} className="flex gap-2.5 text-sm text-ag-text">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ag-brand text-xs font-bold text-white">{i + 1}</span>
                      <span className="pt-0.5">{a}</span>
                    </li>
                  ))}
                </ol>
                {step.link && (
                  <p className="mt-3 text-sm">
                    🔗 <ExtLink href={step.link.href}>{step.link.label}</ExtLink>
                  </p>
                )}
              </div>
              <Callout kind="ok" title="Beklenen sonuç">
                {step.expected}
              </Callout>
              {step.osNote && (
                <Callout kind="info" title="İşletim sistemine göre değişir">
                  {step.osNote}
                </Callout>
              )}
            </div>
          </div>

          {/* C. Öğrenci kontrol alanı */}
          <div className="card !p-4">
            <p className="mb-3 text-sm font-bold text-ag-text">Nasıl gidiyor?</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={`btn ${done.has(cur) ? "btn-ok" : "btn-primary"}`} onClick={() => { setGuideStep(guide.id, cur, "done", !done.has(cur)); if (!done.has(cur) && cur < total - 1) go(cur + 1); }}>
                {done.has(cur) ? "✓ Bu işlemi yaptım (geri al)" : "Bu işlemi yaptım"}
              </button>
              <button type="button" className={`btn ${seen.has(cur) ? "btn-ok" : ""}`} onClick={() => setGuideStep(guide.id, cur, "seen", !seen.has(cur))}>
                {seen.has(cur) ? "✓ Beklenen ekranı gördüm" : "Beklenen ekranı gördüm"}
              </button>
              <button type="button" className="btn btn-warn" onClick={() => setShowTrouble((v) => !v)}>
                Bir sorunla karşılaştım
              </button>
            </div>
            {seen.has(cur) && <p className="mt-3 text-sm font-semibold text-ag-ok">Süper! Ekran beklediğin gibiyse sonraki adıma geçebilirsin.</p>}
            {showTrouble && (
              <div className="mt-3 space-y-3">
                <Callout kind="err" title={`Bu adımda sık görülen hata: ${step.error}`}>
                  <strong>Çözüm önerisi:</strong> {step.fix}
                </Callout>
                <p className="text-sm text-ag-muted">
                  Sorun devam ediyorsa{" "}
                  <a className="font-semibold text-ag-brand underline" href="#sorun-giderme">
                    sorun giderme bölümüne
                  </a>{" "}
                  bak.
                </p>
              </div>
            )}
            <div className="mt-4 flex justify-between border-t border-ag-line pt-3">
              <button type="button" className="btn btn-sm" disabled={cur === 0} onClick={() => go(cur - 1)}>
                ← Önceki adım
              </button>
              <button type="button" className="btn btn-sm" disabled={cur === total - 1} onClick={() => go(cur + 1)}>
                Sonraki adım →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* E. Kurulum sonrası doğrulama */}
      <Checklist id={`${guide.id}-verify`} title="✅ Kurulum sonrası doğrulama" items={guide.verify} />
      {/* D. Sorun giderme */}
      <Troubleshoot ids={guide.trouble} />
    </div>
  );
}
