"use client";

import { useState } from "react";
import { toggleCheck, useProgress } from "@/lib/progress";
import { TROUBLE } from "@/content/trouble";
import { ProgressBar } from "./ui";

export function Checklist({ id, title, items }: { id: string; title: string; items: string[] }) {
  const p = useProgress();
  const done = new Set(p.checks[id] ?? []);
  const pct = (done.size / items.length) * 100;
  return (
    <div className="card">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-bold text-ag-text">{title}</h3>
        <span className="chip">
          {done.size}/{items.length}
        </span>
      </div>
      <ProgressBar pct={pct} tone={pct === 100 ? "ok" : "brand"} />
      <ul className="mt-3 space-y-1.5">
        {items.map((it, i) => (
          <li key={it}>
            <label className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2 text-sm transition ${done.has(i) ? "border-ag-ok/40 bg-[#edf8f2]" : "border-ag-line bg-white hover:bg-ag-light"}`}>
              <input type="checkbox" className="mt-1 h-4 w-4 accent-[#176B87]" checked={done.has(i)} onChange={() => toggleCheck(id, i)} />
              <span className={done.has(i) ? "text-ag-text" : "text-ag-text"}>{it}</span>
            </label>
          </li>
        ))}
      </ul>
      {pct === 100 && <p className="mt-3 text-sm font-semibold text-ag-ok">Harika! Bu kontrol listesindeki her maddeyi tamamladın.</p>}
    </div>
  );
}

export function Troubleshoot({ ids, title = "Sık karşılaşılan hatalar ve çözümleri" }: { ids: string[]; title?: string }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section id="sorun-giderme" className="space-y-3">
      <h3 className="text-lg font-bold text-ag-text">🛠️ {title}</h3>
      <p className="text-sm text-ag-muted">Bir sorunla karşılaştıysan paniğe gerek yok. Aşağıdan belirtini bul, nedenlere bak ve çözümleri sırayla dene. Hiçbirinde güvenlik ayarlarını kapatman gerekmez.</p>
      <div className="space-y-2">
        {ids.map((id) => {
          const t = TROUBLE[id];
          if (!t) return null;
          const isOpen = open === id;
          return (
            <div key={id} className="overflow-hidden rounded-xl border border-ag-line bg-white">
              <button type="button" onClick={() => setOpen(isOpen ? null : id)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-ag-text hover:bg-ag-light" aria-expanded={isOpen}>
                <span>🔧 {t.title}</span>
                <span className="text-ag-muted">{isOpen ? "–" : "+"}</span>
              </button>
              {isOpen && (
                <div className="grid gap-4 border-t border-ag-line bg-ag-bg px-4 py-4 text-sm md:grid-cols-2">
                  <div>
                    <p className="mb-1.5 font-bold text-ag-warn">Olası nedenler</p>
                    <ul className="list-disc space-y-1 pl-5 text-ag-text">
                      {t.causes.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-1.5 font-bold text-ag-ok">Güvenli çözüm adımları</p>
                    <ol className="list-decimal space-y-1 pl-5 text-ag-text">
                      {t.fixes.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ol>
                  </div>
                  {t.osNote && <p className="rounded-lg bg-white p-3 text-xs text-ag-muted md:col-span-2">📌 İşletim sistemine göre değişir: {t.osNote}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
