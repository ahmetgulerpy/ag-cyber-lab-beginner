"use client";
import { useState, type ReactNode } from "react";
import { LAB_TASKS, LAB_TITLES } from "@/data/labtasks";
import { useProgress } from "@/lib/store";
import { ProgressBar } from "@/components/ui";

export function useLab(lesson: number) {
  const { progress, markTask } = useProgress();
  const doneIds = progress.labs[lesson] ?? [];
  return { done: (id: string) => markTask(lesson, id), doneIds };
}

export default function LabShell({ lesson, children }: { lesson: number; children: (api: { done: (id: string) => void }) => ReactNode }) {
  const [run, setRun] = useState(0);
  const { done, doneIds } = useLab(lesson);
  const tasks = LAB_TASKS[lesson];
  const count = tasks.filter((t) => doneIds.includes(t.id)).length;
  const pct = Math.round((count / tasks.length) * 100);
  return (
    <div className="card overflow-hidden" id="lab">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-soft px-4 py-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-accent">Etkileşimli Sanal Laboratuvar</p>
          <h3 className="text-lg font-extrabold text-ink">{LAB_TITLES[lesson]}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="chip">Eğitim simülasyonu</span>
          <button className="btn btn-sm" onClick={() => setRun((r) => r + 1)}>↺ Laboratuvarı sıfırla</button>
        </div>
      </div>
      <div className="p-4">
        <p className="mb-3 rounded-lg bg-[#FBF3E3] px-3 py-2 text-xs text-[#7a5410]">
          Bu laboratuvar tarayıcı içinde çalışan güvenli bir <b>simülasyondur</b>. Gerçek işletim sistemi, gerçek dosyalar veya gerçek ayarlar etkilenmez. İstediğin kadar deneyebilir, hata yapabilir ve sıfırlayabilirsin.
        </p>
        <div key={run}>{children({ done })}</div>
        <div className="mt-4 rounded-xl border border-line bg-white p-3">
          <div className="mb-2 flex items-center justify-between text-sm">
            <b>Laboratuvar görevleri</b>
            <span className="font-semibold text-brand">{count}/{tasks.length} tamamlandı</span>
          </div>
          <ProgressBar value={pct} tone={pct === 100 ? "ok" : "brand"} />
          <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {tasks.map((t) => {
              const ok = doneIds.includes(t.id);
              return (
                <li key={t.id} className={`flex items-start gap-2 rounded-lg px-2 py-1.5 text-sm ${ok ? "bg-[#E8F4EE] text-[#1d6b49]" : "text-ink"}`}>
                  <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px] font-bold ${ok ? "border-ok bg-ok text-white" : "border-line text-transparent"}`}>✓</span>
                  <span>{t.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
