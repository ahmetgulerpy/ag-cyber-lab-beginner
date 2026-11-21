"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Badge, Btn, Card, InfoBox, LabPanel, ProgressBar, Stat } from "@/components/ui";
import { LineChart } from "./shared";
import type { LabProps } from "./types";

type Def = { rate: boolean; filter: boolean; scale: boolean };
type Hist = { incoming: number[]; capacity: number[]; served: number[]; cpu: number[]; latency: number[]; success: number[]; failed: number[] };
type Rec = { label: string; kind: string; n: number; succ: number; lat: number; cpu: number };

const BASE_CAP = 200;
const MAX_CAP = 600;
const emptyHist = (): Hist => ({ incoming: [], capacity: [], served: [], cpu: [], latency: [], success: [], failed: [] });

const PRESETS = [
  { id: "normal", name: "🟢 Normal gün", legit: 90, attack: 0 },
  { id: "flash", name: "🟡 Kampanya yoğunluğu (meşru)", legit: 280, attack: 0 },
  { id: "ddos", name: "🔴 DDoS saldırısı", legit: 90, attack: 900 },
];

function defLabel(d: Def) {
  const p = [d.rate && "Rate Limiting", d.filter && "Filtreleme", d.scale && "Ölçekleme"].filter(Boolean);
  return p.length ? p.join(" + ") : "Savunmasız";
}

export default function Lab08({ onComplete, done }: LabProps) {
  const [legit, setLegit] = useState(90);
  const [attack, setAttack] = useState(0);
  const [def, setDef] = useState<Def>({ rate: false, filter: false, scale: false });
  const [running, setRunning] = useState(false);
  const [hist, setHist] = useState<Hist>(emptyHist());
  const [stats, setStats] = useState<Record<string, Rec>>({});

  const live = useRef({ legit, attack, def });
  useEffect(() => {
    live.current = { legit, attack, def };
  });
  const cap = useRef(BASE_CAP);
  const filterTicks = useRef(0);

  const tick = useCallback(() => {
    const { legit: L0, attack: A0, def: d } = live.current;
    const jitter = () => 1 + (Math.random() - 0.5) * 0.1;
    const L = L0 * jitter();
    const A = A0 * jitter();
    cap.current = d.scale ? Math.min(MAX_CAP, cap.current + 90) : Math.max(BASE_CAP, cap.current - 120);
    filterTicks.current = d.filter ? filterTicks.current + 1 : 0;
    let Lp = L, Ap = A;
    if (d.filter) {
      const eff = Math.min(1, filterTicks.current / 3);
      Ap *= 1 - 0.88 * eff;
      Lp *= 0.97;
    }
    if (d.rate) {
      Ap *= 0.55;
      Lp *= 0.93;
    }
    const total = Lp + Ap;
    const ratio = total <= cap.current ? 1 : cap.current / total;
    const served = total * ratio;
    const legitServed = Lp * ratio;
    const success = L > 0 ? (legitServed / L) * 100 : 100;
    const load = total / cap.current;
    const cpu = Math.min(100, 8 + load * 85);
    const latency = load <= 0.7 ? 40 + load * 40 : Math.min(9000, 70 + Math.pow(load, 2.2) * 450);
    const failed = Math.max(0, L + A - served);
    setHist((h) => ({
      incoming: [...h.incoming, L + A].slice(-60),
      capacity: [...h.capacity, cap.current].slice(-60),
      served: [...h.served, served].slice(-60),
      cpu: [...h.cpu, cpu].slice(-60),
      latency: [...h.latency, latency].slice(-60),
      success: [...h.success, success].slice(-60),
      failed: [...h.failed, failed].slice(-60),
    }));
    const kind = A0 > 0 ? "Saldırı" : L0 > BASE_CAP ? "Meşru yoğunluk" : "Normal";
    const key = `${kind}|${defLabel(d)}`;
    setStats((s) => {
      const c = s[key] ?? { label: defLabel(d), kind, n: 0, succ: 0, lat: 0, cpu: 0 };
      return { ...s, [key]: { ...c, n: c.n + 1, succ: c.succ + success, lat: c.lat + latency, cpu: c.cpu + cpu } };
    });
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(tick, 700);
    return () => clearInterval(id);
  }, [running, tick]);

  const entries = Object.values(stats);
  const attackNone = entries.find((e) => e.kind === "Saldırı" && e.label === "Savunmasız" && e.n >= 6);
  const attackDef = entries.filter((e) => e.kind === "Saldırı" && e.label !== "Savunmasız" && e.n >= 6);
  const finished = !!attackNone && attackDef.some((e) => e.succ / e.n > attackNone.succ / attackNone.n + 10);
  useEffect(() => {
    if (finished) onComplete();
  }, [finished, onComplete]);

  const last = <T,>(a: T[], d: T) => (a.length ? a[a.length - 1] : d);
  const cur = { incoming: last(hist.incoming, 0), cap: last(hist.capacity, BASE_CAP), cpu: last(hist.cpu, 0), lat: last(hist.latency, 0), succ: last(hist.success, 100), served: last(hist.served, 0), failed: last(hist.failed, 0) };
  const status = cur.succ > 90 ? { t: "Sağlıklı", tone: "ok" as const } : cur.succ > 60 ? { t: "Yavaşlıyor", tone: "warn" as const } : { t: "Hizmet kesintisi", tone: "bad" as const };

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setLegit(p.legit);
    setAttack(p.attack);
  };
  const reset = () => {
    setRunning(false);
    setHist(emptyHist());
    cap.current = BASE_CAP;
    filterTicks.current = 0;
  };

  return (
    <LabPanel title="Laboratuvar 8 – Trafik Yoğunluğu Simülasyonu" intro="Sanal bir web sunucusunu izle. Normal trafik, meşru yoğunluk ve DDoS saldırısını karşılaştır; ardından savunma seçeneklerini dene." done={done}>
      <InfoBox tone="brand" icon="🎯" title="Görev">1) ‘DDoS saldırısı’ senaryosunu savunmasız çalıştır (≥6 adım). 2) Savunma aç ve yeniden çalıştır (≥6 adım). Başarı oranındaki iyileşmeyi karşılaştırma tablosunda gör.</InfoBox>

      <div className="grid gap-3 lg:grid-cols-3">
        <Card className="space-y-3 lg:col-span-1">
          <p className="font-bold">Senaryo</p>
          <div className="flex flex-col gap-2">
            {PRESETS.map((p) => (
              <Btn key={p.id} size="sm" variant={legit === p.legit && attack === p.attack ? "primary" : "secondary"} onClick={() => applyPreset(p)}>{p.name}</Btn>
            ))}
          </div>
          <label className="block text-xs font-semibold text-muted">Meşru trafik: {legit} istek/sn
            <input type="range" min={20} max={400} step={10} value={legit} onChange={(e) => setLegit(Number(e.target.value))} className="mt-1 w-full accent-[#176B87]" />
          </label>
          <label className="block text-xs font-semibold text-muted">Saldırı trafiği (sanal): {attack} istek/sn
            <input type="range" min={0} max={1500} step={50} value={attack} onChange={(e) => setAttack(Number(e.target.value))} className="mt-1 w-full accent-[#C65353]" />
          </label>
          <p className="font-bold">Savunma</p>
          {([["rate", "🚦 Rate Limiting", "Saldırıyı %45 azaltır, meşru kullanıcıdan da %7 keser"], ["filter", "🧹 Trafik filtreleme", "3 adımda öğrenir, saldırıyı %88’e kadar eler"], ["scale", "📈 Ölçekleme", "Kapasiteyi 200 → 600’e çıkarır (maliyetli)"]] as const).map(([k, n, d]) => (
            <label key={k} className={`flex cursor-pointer items-start gap-2 rounded-xl border p-2.5 text-sm ${def[k] ? "border-brand bg-soft" : "border-line"}`}>
              <input type="checkbox" className="mt-1 accent-[#176B87]" checked={def[k]} onChange={(e) => setDef({ ...def, [k]: e.target.checked })} />
              <span><b>{n}</b><span className="block text-[11px] text-muted">{d}</span></span>
            </label>
          ))}
          <div className="flex gap-2">
            <Btn onClick={() => setRunning((r) => !r)}>{running ? "⏸ Duraklat" : "▶ Başlat"}</Btn>
            <Btn variant="ghost" onClick={reset}>Sıfırla</Btn>
          </div>
        </Card>

        <div className="space-y-3 lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between">
              <p className="font-bold">🖥️ Sanal web sunucusu</p>
              <Badge tone={status.tone}>{status.t}</Badge>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Stat label="Gelen istek/sn" value={Math.round(cur.incoming)} />
              <Stat label="Kapasite" value={Math.round(cur.cap)} />
              <Stat label="CPU" value={`%${Math.round(cur.cpu)}`} tone={cur.cpu > 90 ? "bad" : cur.cpu > 70 ? "warn" : "ok"} />
              <Stat label="Yanıt süresi" value={`${Math.round(cur.lat)} ms`} tone={cur.lat > 500 ? "bad" : cur.lat > 150 ? "warn" : "ok"} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Stat label="Başarılı istek/sn" value={Math.round(cur.served)} tone="ok" />
              <Stat label="Başarısız/engellenen istek/sn" value={Math.round(cur.failed)} tone={cur.failed > 10 ? "bad" : "ok"} />
            </div>
            <p className="mt-3 text-xs font-semibold text-muted">Meşru kullanıcı başarı oranı: %{Math.round(cur.succ)}</p>
            <ProgressBar value={cur.succ} tone={cur.succ > 90 ? "ok" : cur.succ > 60 ? "warn" : "bad"} />
          </Card>
          <div className="grid gap-3 sm:grid-cols-2">
            <LineChart title="İstek sayısı ve kapasite" unit=" /sn" series={[{ name: "Gelen", color: "#C65353", data: hist.incoming }, { name: "Kapasite", color: "#176B87", data: hist.capacity, dashed: true }, { name: "Başarılı", color: "#25845B", data: hist.served }]} />
            <LineChart title="CPU kullanımı" unit="%" max={100} series={[{ name: "CPU", color: "#D69A32", data: hist.cpu }]} />
            <LineChart title="Yanıt süresi" unit=" ms" series={[{ name: "Gecikme", color: "#176B87", data: hist.latency }]} />
            <LineChart title="Meşru kullanıcı başarı oranı" unit="%" max={100} series={[{ name: "Başarı", color: "#25845B", data: hist.success }]} />
          </div>
        </div>
      </div>

      <Card>
        <p className="font-bold">📊 Karşılaştırma tablosu</p>
        <p className="text-xs text-muted">Her senaryo ve savunma kombinasyonunun ortalama sonuçları burada birikir.</p>
        {entries.length === 0 ? <p className="mt-2 text-sm text-muted">Simülasyonu başlat; sonuçlar burada görünecek.</p> : (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[460px] text-left text-sm">
              <thead><tr className="bg-soft text-xs uppercase text-brand"><th className="px-3 py-2">Senaryo</th><th className="px-3 py-2">Savunma</th><th className="px-3 py-2">Ort. başarı</th><th className="px-3 py-2">Ort. gecikme</th><th className="px-3 py-2">Ort. CPU</th><th className="px-3 py-2">Adım</th></tr></thead>
              <tbody>
                {entries.sort((a, b) => a.kind.localeCompare(b.kind)).map((e) => {
                  const s = e.succ / e.n;
                  return (
                    <tr key={e.kind + e.label} className="border-t border-line">
                      <td className="px-3 py-2 font-semibold">{e.kind}</td>
                      <td className="px-3 py-2">{e.label}</td>
                      <td className={`px-3 py-2 font-bold ${s > 90 ? "text-ok" : s > 60 ? "text-[#9a6a14]" : "text-bad"}`}>%{Math.round(s)}</td>
                      <td className="px-3 py-2">{Math.round(e.lat / e.n)} ms</td>
                      <td className="px-3 py-2">%{Math.round(e.cpu / e.n)}</td>
                      <td className="px-3 py-2">{e.n}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {finished && <div className="mt-3"><InfoBox tone="ok" icon="✅" title="Karşılaştırma tamam">Savunma, saldırı sırasında meşru kullanıcıların başarı oranını artırdı. Filtreleme saldırıyı hedefler, rate limiting hızlı ve basittir ama meşru kullanıcıyı da etkiler, ölçekleme ise kapasite satın alır; en iyi sonuç katmanlı kombinasyondur.</InfoBox></div>}
      </Card>
      <p className="text-xs text-muted">Tüm rakamlar tarayıcıda üretilen sanal değerlerdir; hiçbir ağ trafiği oluşturulmaz.</p>
    </LabPanel>
  );
}
