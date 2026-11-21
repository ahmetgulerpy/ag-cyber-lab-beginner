"use client";

import { useState } from "react";
import { Check, Compass, Info } from "lucide-react";
import type { Career, CareerActivityDef } from "@/content/types";
import { btnPrimary, toneBox } from "../ui";

type Tab = "explore" | "compare" | "interests";

const TABS: { id: Tab; label: string }[] = [
  { id: "explore", label: "Meslekleri incele" },
  { id: "compare", label: "Karşılaştır" },
  { id: "interests", label: "İlgi alanı keşfi" },
];

const COMPARE_COLORS = ["bg-brand", "bg-accent", "bg-warn"];
const COMPARE_TEXT = ["text-brand", "text-accent", "text-warn-ink"];
const REQUIRED_VIEWS = 3;

function SkillBars({ career, dims }: { career: Career; dims: CareerActivityDef["dimensions"] }) {
  return (
    <ul className="space-y-1.5">
      {dims.map((d, i) => (
        <li key={d.id} className="flex items-center gap-3 text-xs">
          <span className="w-36 shrink-0 text-ink/80 sm:w-44">{d.label}</span>
          <span className="flex flex-1 gap-1" aria-label={`${career.profile[i]} / 5`}>
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className={`h-2 flex-1 rounded-sm ${n <= career.profile[i] ? "bg-brand" : "bg-line"}`} />
            ))}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h5 className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">{title}</h5>
      <ul className="mt-1.5 flex flex-wrap gap-1.5">
        {items.map((it) => (
          <li key={it} className="rounded-md bg-soft px-2 py-1 text-xs font-medium text-ink/90">
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CareerActivity({ def, onComplete }: { def: CareerActivityDef; onComplete: () => void }) {
  const [tab, setTab] = useState<Tab>("explore");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewed, setViewed] = useState<Set<string>>(new Set());
  const [compare, setCompare] = useState<string[]>([]);
  const [interests, setInterests] = useState<Set<string>>(new Set());
  const [ran, setRan] = useState(false);

  const careerById = new Map(def.careers.map((c) => [c.id, c]));
  const selected = selectedId ? careerById.get(selectedId) : null;

  function check(v: Set<string>, interestRan: boolean) {
    if (v.size >= REQUIRED_VIEWS && interestRan) onComplete();
  }

  function view(id: string) {
    setSelectedId(id);
    const next = new Set(viewed);
    next.add(id);
    setViewed(next);
    check(next, ran);
  }

  function toggleCompare(id: string) {
    setCompare((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 3 ? prev : [...prev, id]));
  }

  function toggleInterest(id: string) {
    const next = new Set(interests);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setInterests(next);
    setRan(false);
  }

  function runInterests() {
    setRan(true);
    check(viewed, true);
  }

  const scores = new Map<string, string[]>();
  def.interests.forEach((it) => {
    if (!interests.has(it.id)) return;
    it.careers.forEach((cid) => scores.set(cid, [...(scores.get(cid) ?? []), it.label]));
  });
  const ranked = [...scores.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 4);

  const doneViews = viewed.size >= REQUIRED_VIEWS;
  const complete = doneViews && ran;

  return (
    <div>
      <h3 className="text-lg font-bold text-ink">{def.title}</h3>
      <p className="mt-1 max-w-prose text-sm leading-relaxed text-ink/80">{def.intro}</p>

      <ul className="mt-3 flex flex-wrap gap-2 text-sm">
        <li className={`rounded-full px-3 py-1 font-semibold ${doneViews ? "bg-success-soft text-success" : "bg-soft text-brand"}`}>
          {doneViews && <Check size={13} className="mr-1 inline" aria-hidden />}
          En az {REQUIRED_VIEWS} meslek incele ({Math.min(viewed.size, REQUIRED_VIEWS)}/{REQUIRED_VIEWS})
        </li>
        <li className={`rounded-full px-3 py-1 font-semibold ${ran ? "bg-success-soft text-success" : "bg-soft text-brand"}`}>
          {ran && <Check size={13} className="mr-1 inline" aria-hidden />}
          İlgi alanı keşfini çalıştır
        </li>
      </ul>

      <div className="mt-4 flex gap-1 border-b border-line" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px rounded-t-md border-b-2 px-3 py-2 text-sm font-semibold transition-colors ${tab === t.id ? "border-brand text-brand" : "border-transparent text-muted hover:text-ink"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "explore" && (
        <div className="mt-4 grid gap-4 lg:grid-cols-[260px_1fr]">
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
            {def.careers.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => view(c.id)}
                  aria-pressed={selectedId === c.id}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm font-medium transition-colors ${selectedId === c.id ? "border-brand bg-soft ring-1 ring-brand" : "border-line bg-white hover:border-brand"}`}
                >
                  <span>{c.name}</span>
                  {viewed.has(c.id) && <Check size={14} className="shrink-0 text-success" aria-label="İncelendi" />}
                </button>
              </li>
            ))}
          </ul>
          <div className="rounded-xl border border-line bg-white p-4 sm:p-5" aria-live="polite">
            {selected ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-ink">{selected.name}</h4>
                  <p className="text-sm text-muted">{selected.tr}</p>
                </div>
                <div>
                  <h5 className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">Görev tanımı</h5>
                  <p className="mt-1 text-sm leading-relaxed text-ink/90">{selected.summary}</p>
                </div>
                <div>
                  <h5 className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">Günlük çalışma şekli</h5>
                  <p className="mt-1 text-sm leading-relaxed text-ink/90">{selected.daily}</p>
                </div>
                <ListBlock title="Gereken temel bilgiler" items={selected.knowledge} />
                <ListBlock title="Kullanılan araçlar" items={selected.tools} />
                <ListBlock title="Geliştirilmesi gereken beceriler" items={selected.skills} />
                <div>
                  <h5 className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">Kariyer gelişim yolu</h5>
                  <p className="mt-1 text-sm leading-relaxed text-ink/90">{selected.path}</p>
                </div>
                <div>
                  <h5 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-accent">Yetkinlik profili</h5>
                  <SkillBars career={selected} dims={def.dimensions} />
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted">Bir meslek seçerek detaylarını gör.</p>
            )}
          </div>
        </div>
      )}

      {tab === "compare" && (
        <div className="mt-4">
          <p className="text-sm text-ink/80">En fazla 3 meslek seç ve yetkinlik profillerini yan yana karşılaştır.</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {def.careers.map((c) => {
              const idx = compare.indexOf(c.id);
              const on = idx >= 0;
              return (
                <li key={c.id}>
                  <button
                    onClick={() => toggleCompare(c.id)}
                    aria-pressed={on}
                    disabled={!on && compare.length >= 3}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-40 ${on ? "border-brand bg-soft text-brand" : "border-line bg-white hover:border-brand"}`}
                  >
                    {on && <span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${COMPARE_COLORS[idx]}`} aria-hidden />}
                    {c.name}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 rounded-xl border border-line bg-white p-4 sm:p-5">
            {compare.length < 2 ? (
              <p className="text-sm text-muted">Karşılaştırma için en az 2 meslek seç.</p>
            ) : (
              <>
                <ul className="mb-4 flex flex-wrap gap-3 text-xs font-semibold">
                  {compare.map((id, i) => (
                    <li key={id} className={`flex items-center gap-1.5 ${COMPARE_TEXT[i]}`}>
                      <span className={`h-2.5 w-2.5 rounded-sm ${COMPARE_COLORS[i]}`} aria-hidden />
                      {careerById.get(id)?.name}
                    </li>
                  ))}
                </ul>
                <div className="space-y-4">
                  {def.dimensions.map((d, di) => (
                    <div key={d.id}>
                      <p className="text-sm font-medium text-ink">{d.label}</p>
                      <div className="mt-1.5 space-y-1">
                        {compare.map((id, i) => {
                          const v = careerById.get(id)?.profile[di] ?? 0;
                          return (
                            <div key={id} className="flex items-center gap-2">
                              <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-line">
                                <span className={`block h-full rounded-full ${COMPARE_COLORS[i]}`} style={{ width: `${(v / 5) * 100}%` }} />
                              </span>
                              <span className="w-8 text-right font-mono text-xs text-muted">{v}/5</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className={`mt-5 grid gap-3 ${compare.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
                  {compare.map((id) => {
                    const c = careerById.get(id);
                    if (!c) return null;
                    return (
                      <div key={id} className="rounded-lg border border-line bg-bg p-3">
                        <p className="text-sm font-bold text-ink">{c.name}</p>
                        <p className="mt-1 text-xs text-muted">Araçlar</p>
                        <p className="text-xs leading-relaxed text-ink/90">{c.tools.join(", ")}</p>
                        <p className="mt-2 text-xs text-muted">Gelişim yolu</p>
                        <p className="text-xs leading-relaxed text-ink/90">{c.path}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {tab === "interests" && (
        <div className="mt-4">
          <p className="text-sm leading-relaxed text-ink/80">
            Sana uyan ifadeleri işaretle. Bu araç kesin bir meslek önerisi vermez; yalnızca keşfetmeye değer alanları gösterir.
          </p>
          <ul className="mt-3 grid gap-2">
            {def.interests.map((it) => {
              const on = interests.has(it.id);
              return (
                <li key={it.id}>
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-2.5 text-sm leading-relaxed transition-colors ${on ? "border-brand bg-soft" : "border-line bg-white hover:border-brand"}`}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggleInterest(it.id)}
                      className="mt-1 h-4 w-4 accent-[#176B87]"
                    />
                    <span>{it.label}</span>
                  </label>
                </li>
              );
            })}
          </ul>
          <button className={`${btnPrimary} mt-4`} disabled={interests.size === 0} onClick={runInterests}>
            <Compass size={16} aria-hidden /> Keşfedilecek alanları göster
          </button>

          {ran && (
            <div className="mt-4 rounded-xl border border-line bg-white p-4 sm:p-5" aria-live="polite">
              <h4 className="text-base font-bold text-ink">İlgilerinle örtüşen alanlar</h4>
              <ul className="mt-3 space-y-3">
                {ranked.map(([cid, reasons]) => {
                  const c = careerById.get(cid);
                  if (!c) return null;
                  return (
                    <li key={cid} className="rounded-lg border border-line bg-bg p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-bold text-ink">
                          {c.name} <span className="font-normal text-muted">· {reasons.length} ilgi alanı örtüşüyor</span>
                        </p>
                        <button
                          className="text-sm font-semibold text-brand hover:underline"
                          onClick={() => {
                            setTab("explore");
                            view(cid);
                          }}
                        >
                          Bu mesleği incele
                        </button>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-ink/80">{c.summary}</p>
                    </li>
                  );
                })}
              </ul>
              <div className={`mt-4 flex gap-2 rounded-lg border p-3 text-sm leading-relaxed ${toneBox.info}`}>
                <Info size={16} className="mt-0.5 shrink-0 text-brand" aria-hidden />
                <p>
                  Bu bir yönlendirme değil, keşif aracıdır. İlgi alanların zamanla değişebilir; farklı rollerle ilgili
                  laboratuvar çalışmaları ve küçük projeler deneyerek sana en uygun yönü bulabilirsin.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {complete && (
        <p className="mt-4 rounded-lg border border-success/30 bg-success-soft p-3.5 text-sm font-semibold text-success" aria-live="polite">
          Uygulama tamamlandı. Kariyer keşfini istediğin zaman yeniden yapabilirsin.
        </p>
      )}
    </div>
  );
}
