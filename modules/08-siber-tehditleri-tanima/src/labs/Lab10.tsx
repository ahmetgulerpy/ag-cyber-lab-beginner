"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge, Btn, Card, Feedback, InfoBox, LabPanel, ProgressBar, Stat } from "@/components/ui";
import type { LabProps } from "./types";

type Device = { id: string; icon: string; name: string; exposure: 1 | 2 | 3; value: 1 | 2 | 3; note: string };
const DEVICES: Device[] = [
  { id: "web", icon: "🌐", name: "Okul web sunucusu", exposure: 3, value: 3, note: "İnternete açık • öğrenci verileri var" },
  { id: "muh", icon: "🧾", name: "Muhasebe bilgisayarı", exposure: 2, value: 3, note: "E-posta alır • maaş/ödeme verisi" },
  { id: "yon", icon: "👔", name: "Yönetici dizüstü", exposure: 2, value: 3, note: "Dışarıdan belge alır • kritik yazışmalar" },
  { id: "ogr", icon: "💻", name: "Öğretmen dizüstü", exposure: 2, value: 2, note: "Ders belgeleri açar" },
  { id: "kiosk", icon: "🖥️", name: "Misafir kiosku", exposure: 3, value: 1, note: "Herkese açık • değerli veri yok" },
  { id: "test", icon: "🧪", name: "Test sunucusu", exposure: 1, value: 1, note: "İç ağ • örnek veri" },
];

const SEVERITY = 9.1;
const EXPO = { 1: 0.4, 2: 0.7, 3: 1 } as const;
const VAL = { 1: 0.5, 2: 0.75, 3: 1 } as const;
const PHASES = [
  { t: "1) Zafiyet var ama bilinmiyor", icon: "🐞", f: 0.45, d: "Hata kodda duruyor; kimse (üretici dahil) bilmiyor ya da yalnızca bir saldırgan biliyor. Yama yok: bu bir Zero-Day durumudur." },
  { t: "2) Aktif sömürü", icon: "🎯", f: 1, d: "Saldırganlar hazırlanmış belgelerle hedefleri vuruyor. Yama hâlâ yok; savunma yalnızca hafifletme (mitigation) ve izlemedir." },
  { t: "3) Yama yayımlandı", icon: "🩹", f: 1.15, d: "Üretici 3.2.1 sürümünü yayımladı. Zafiyet artık herkesçe biliniyor; saldırganlar hızla yararlanıyor. Yamayı uygulamayan cihazlar risk altında." },
  { t: "4) Yama uygulanıyor", icon: "✅", f: 1.15, d: "Cihazları tek tek güncelle. Yamalı cihazların riski büyük ölçüde düşer." },
];
const MITS = [
  { id: "preview", t: "Belge önizleme özelliğini kapat", m: 0.55, d: "Zafiyetli bileşeni devre dışı bırakır" },
  { id: "segment", t: "Ağ segmentasyonu uygula", m: 0.75, d: "Bir cihaz ele geçirilirse yayılmayı sınırlar" },
  { id: "edr", t: "Gelişmiş izleme (EDR/log) aç", m: 0.8, d: "Saldırıyı erken fark etmeyi sağlar" },
];
const LEVELS = ["Düşük", "Orta", "Yüksek", "Kritik"] as const;
type Level = (typeof LEVELS)[number];

const levelOf = (r: number): Level => (r < 3 ? "Düşük" : r < 5 ? "Orta" : r < 7.5 ? "Yüksek" : "Kritik");
const tone = (l: Level) => (l === "Düşük" ? "ok" : l === "Orta" ? "warn" : "bad") as "ok" | "warn" | "bad";

export default function Lab10({ onComplete, done }: LabProps) {
  const [phase, setPhase] = useState(0);
  const [mit, setMit] = useState<string[]>([]);
  const [patched, setPatched] = useState<string[]>([]);
  const [guess, setGuess] = useState<Record<string, Level>>({});
  const [checked, setChecked] = useState<null | { right: number; at: number }>(null);
  const [timeline, setTimeline] = useState<{ label: string; risk: number }[]>([]);

  const mitFactor = mit.reduce((a, id) => a * (MITS.find((m) => m.id === id)?.m ?? 1), 1);
  const risks = useMemo(
    () => DEVICES.map((d) => {
      const base = SEVERITY * EXPO[d.exposure] * VAL[d.value] * PHASES[phase].f * mitFactor;
      const r = Math.min(10, patched.includes(d.id) ? base * 0.05 : base);
      return { d, r: Math.round(r * 10) / 10, level: levelOf(r) };
    }),
    [phase, mitFactor, patched],
  );
  const total = Math.round((risks.reduce((a, x) => a + x.r, 0) / DEVICES.length) * 10) / 10;

  const record = (label: string, nextRisk?: number) => setTimeline((t) => [...t, { label, risk: nextRisk ?? total }]);

  const goPhase = (p: number) => {
    setPhase(p);
    const f = PHASES[p].f;
    const avg = DEVICES.reduce((a, d) => a + Math.min(10, (patched.includes(d.id) ? 0.05 : 1) * SEVERITY * EXPO[d.exposure] * VAL[d.value] * f * mitFactor), 0) / DEVICES.length;
    record(`Evre ${p + 1}`, Math.round(avg * 10) / 10);
  };

  const toggleMit = (id: string) => {
    if (phase >= 2) return;
    setMit((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));
  };
  const applyPatch = (id: string) => {
    if (phase < 2 || patched.includes(id)) return;
    setPatched((p) => [...p, id]);
    if (phase === 2) setPhase(3);
  };
  const patchAll = () => {
    if (phase < 2) return;
    setPatched(DEVICES.map((d) => d.id));
    setPhase(3);
    record("Tüm cihazlar yamalandı", Math.round(((SEVERITY * DEVICES.reduce((a, d) => a + EXPO[d.exposure] * VAL[d.value], 0)) / DEVICES.length) * PHASES[3].f * 0.05 * 10) / 10);
  };

  const allPatched = patched.length === DEVICES.length;
  const finished = allPatched && !!checked;
  useEffect(() => {
    if (finished) onComplete();
  }, [finished, onComplete]);

  const check = () => {
    const right = risks.filter((x) => guess[x.d.id] === x.level).length;
    setChecked({ right, at: phase });
  };

  return (
    <LabPanel title="Laboratuvar 10 – Zero-Day ve Yama Yönetimi" intro="‘AGDocs Viewer’ adlı sanal bir yazılımda bir zafiyet var. Zafiyetin yaşam çizgisini ilerlet, riski değerlendir, yama öncesi önlem al ve yama sonrası riskin nasıl düştüğünü gözle." done={done}>
      <InfoBox tone="brand" icon="🎯" title="Görev">1) Evreleri ilerlet. 2) Yama gelmeden önce hafifletme önlemlerini dene. 3) Cihaz risklerini tahmin edip kontrol et. 4) Yama yayımlanınca tüm cihazları güncelle. (Kurgusal zafiyet; çalışan exploit içermez.)</InfoBox>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-bold">📦 AGDocs Viewer (sanal yazılım)</p>
            <p className="text-xs text-muted">Zafiyet: CVE-SIM-2026-0001 • Özel hazırlanmış belge önizlemesinde bellek yönetimi hatası • Ciddiyet (CVSS benzeri): {SEVERITY}/10</p>
          </div>
          <div className="flex gap-2 text-xs">
            <Badge tone="bad">Sürüm 3.2.0 – Zafiyetli</Badge>
            <Badge tone={phase >= 2 ? "ok" : "muted"}>{phase >= 2 ? "3.2.1 – Yama mevcut" : "Yama yok"}</Badge>
          </div>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-4">
          {PHASES.map((p, i) => (
            <button key={i} onClick={() => goPhase(i)} className={`rounded-xl border p-2.5 text-left text-xs font-semibold transition-colors ${phase === i ? "border-brand bg-soft" : i < phase ? "border-accent/40 bg-accent/5" : "border-line bg-white hover:border-brand/40"}`}>
              <span className="text-lg" aria-hidden>{p.icon}</span> {p.t}
            </button>
          ))}
        </div>
        <p className="mt-3 rounded-xl bg-page p-3 text-sm">{PHASES[phase].d}</p>
        <div className="mt-3 flex gap-2">
          <Btn size="sm" variant="ghost" disabled={phase === 0} onClick={() => goPhase(phase - 1)}>← Geri</Btn>
          <Btn size="sm" disabled={phase === 3} onClick={() => goPhase(phase + 1)}>Evreyi ilerlet →</Btn>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Ortalama risk (0–10)" value={total} tone={total >= 7.5 ? "bad" : total >= 4 ? "warn" : "ok"} sub={levelOf(total)} />
        <Stat label="Yamalı cihaz" value={`${patched.length}/${DEVICES.length}`} tone="ok" />
        <Stat label="Aktif hafifletme" value={mit.length} />
      </div>

      <Card>
        <p className="font-bold">🛡 Yama gelmeden önce hafifletme önlemleri</p>
        <p className="text-xs text-muted">{phase >= 2 ? "Yama yayımlandı; artık asıl çözüm güncellemedir." : "Zero-Day'de yama yoktur; riski bu önlemlerle düşür."}</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {MITS.map((m) => (
            <label key={m.id} className={`flex cursor-pointer items-start gap-2 rounded-xl border p-2.5 text-sm ${mit.includes(m.id) ? "border-ok bg-ok/10" : "border-line"} ${phase >= 2 ? "opacity-60" : ""}`}>
              <input type="checkbox" className="mt-1 accent-[#176B87]" checked={mit.includes(m.id)} disabled={phase >= 2} onChange={() => toggleMit(m.id)} />
              <span><b>{m.t}</b><span className="block text-[11px] text-muted">{m.d}</span></span>
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-bold">🖥 Envanter ve risk değerlendirmesi</p>
          <Btn size="sm" variant="secondary" disabled={phase < 2 || allPatched} onClick={patchAll}>🩹 Tümünü yamala</Btn>
        </div>
        <div className="mt-3 space-y-2">
          {risks.map(({ d, r, level }) => {
            const isP = patched.includes(d.id);
            return (
              <div key={d.id} className="rounded-xl border border-line p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xl" aria-hidden>{d.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">{d.name} <span className="font-mono text-xs font-normal text-muted">v{isP ? "3.2.1" : "3.2.0"}</span></p>
                    <p className="text-xs text-muted">{d.note}</p>
                  </div>
                  <select aria-label={`${d.name} risk tahmini`} value={guess[d.id] ?? ""} onChange={(e) => setGuess({ ...guess, [d.id]: e.target.value as Level })} className="rounded-lg border border-line bg-white px-2 py-1 text-xs">
                    <option value="">Tahminin?</option>
                    {LEVELS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                  <Btn size="sm" variant={isP ? "ghost" : "primary"} disabled={phase < 2 || isP} onClick={() => applyPatch(d.id)}>{isP ? "✓ Yamalı" : phase < 2 ? "Yama yok" : "Yamayı uygula"}</Btn>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <ProgressBar value={r * 10} tone={tone(level)} className="flex-1" />
                  <Badge tone={tone(level)}>{r} • {level}</Badge>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Btn size="sm" onClick={check} disabled={Object.keys(guess).length < DEVICES.length}>Tahminlerimi kontrol et</Btn>
          {Object.keys(guess).length < DEVICES.length && <span className="text-xs text-muted">Önce tüm cihazlar için tahmin seç.</span>}
        </div>
        {checked && (
          <div className="mt-3">
            <Feedback ok={checked.right >= 5 ? true : null} title={`${checked.right}/${DEVICES.length} tahmin doğru`}>
              Risk = ciddiyet × maruziyet (internete açıklık) × varlık değeri × evre etkisi × hafifletme. İnternete açık ve değerli veri tutan cihazlar önceliklidir; yamalanmış cihazın riski çok düşer. Evre/önlem değiştikçe tahminini yeniden kontrol edebilirsin.
            </Feedback>
          </div>
        )}
      </Card>

      {timeline.length > 0 && (
        <Card>
          <p className="font-bold">📉 Riskin zaman çizelgesi</p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {timeline.map((t, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-44 shrink-0 text-xs text-muted">{t.label}</span>
                <ProgressBar value={t.risk * 10} tone={t.risk >= 7.5 ? "bad" : t.risk >= 4 ? "warn" : "ok"} className="flex-1" />
                <span className="w-10 text-right text-xs font-bold">{t.risk}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {allPatched && (
        <Feedback ok title="Tüm cihazlar yamalandı">
          Risk belirgin biçimde düştü. Gerçek hayatta yama öncesi hafifletme, yama sonrası hızlı uygulama ve sürekli izleme birlikte kullanılır. {checked ? "" : "Laboratuvarı tamamlamak için risk tahminlerini de kontrol etmelisin."}
        </Feedback>
      )}
    </LabPanel>
  );
}
