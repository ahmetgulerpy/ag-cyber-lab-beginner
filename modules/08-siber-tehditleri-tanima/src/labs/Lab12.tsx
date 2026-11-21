"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge, Btn, Card, Feedback, InfoBox, LabPanel, ProgressBar, Stat } from "@/components/ui";
import type { LabProps } from "./types";

type Dev = { id: number; icon: string; name: string; fw: number; defPw: boolean; infected: boolean; normalOut: string[] };
const DEVS: Dev[] = [
  { id: 0, icon: "📷", name: "Kapı IP kamerası", fw: 2019, defPw: true, infected: true, normalOut: ["kamera-bulut.example (kayıt)"] },
  { id: 1, icon: "📶", name: "Garaj yönlendiricisi", fw: 2018, defPw: true, infected: true, normalOut: ["dns.example (isim çözümleme)"] },
  { id: 2, icon: "📺", name: "Akıllı TV", fw: 2025, defPw: false, infected: false, normalOut: ["yayin.example (video)", "guncelleme.tv.example"] },
  { id: 3, icon: "👶", name: "Bebek kamerası", fw: 2020, defPw: true, infected: true, normalOut: ["bebek-bulut.example"] },
  { id: 4, icon: "💻", name: "Ali'nin dizüstü", fw: 2025, defPw: false, infected: false, normalOut: ["guncelleme.os.example", "okul.example"] },
  { id: 5, icon: "🔌", name: "Akıllı priz", fw: 2019, defPw: true, infected: true, normalOut: ["priz-bulut.example"] },
  { id: 6, icon: "📱", name: "Telefon", fw: 2025, defPw: false, infected: false, normalOut: ["mesaj.example", "harita.example"] },
  { id: 7, icon: "🗄️", name: "NAS (eski ürün yazılımı)", fw: 2017, defPw: false, infected: false, normalOut: ["yedek.example (planlı yedekleme)"] },
  { id: 8, icon: "💡", name: "Akıllı lamba", fw: 2019, defPw: true, infected: true, normalOut: ["lamba-bulut.example"] },
  { id: 9, icon: "🖨️", name: "Yazıcı", fw: 2024, defPw: false, infected: false, normalOut: ["yazici-guncelleme.example"] },
  { id: 10, icon: "📼", name: "DVR kayıt cihazı", fw: 2018, defPw: true, infected: true, normalOut: ["dvr-bulut.example"] },
  { id: 11, icon: "🖥️", name: "Masaüstü PC", fw: 2025, defPw: false, infected: false, normalOut: ["guncelleme.os.example", "okul.example"] },
];
const C2 = "203.0.113.50:6667";
const TARGET = "198.51.100.20";
const pos = (i: number) => {
  const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
  return { x: 50 + 40 * Math.cos(a), y: 52 + 27 * Math.sin(a) };
};

export default function Lab12({ onComplete, done }: LabProps) {
  const [cmd, setCmd] = useState(false);
  const [iso, setIso] = useState<number[]>([]);
  const [sink, setSink] = useState(false);
  const [sel, setSel] = useState<number | null>(null);
  const [map, setMap] = useState(false);

  const active = DEVS.filter((d) => d.infected && !iso.includes(d.id) && !sink);
  const load = cmd ? Math.min(100, (active.length * 70 * 100) / 280) : 0;
  const infectedIso = DEVS.filter((d) => d.infected && iso.includes(d.id)).length;
  const infectedTotal = DEVS.filter((d) => d.infected).length;
  const falsePos = DEVS.filter((d) => !d.infected && iso.includes(d.id));
  const allIso = infectedIso === infectedTotal;
  const finished = cmd && allIso;
  useEffect(() => {
    if (finished) onComplete();
  }, [finished, onComplete]);

  const toggleIso = (id: number) => setIso((x) => (x.includes(id) ? x.filter((i) => i !== id) : [...x, id]));
  const d = sel !== null ? DEVS[sel] : null;
  const evidence = useMemo(() => {
    if (!d) return [];
    const rows = d.normalOut.map((h) => ({ host: h, note: "normal, bilinen hizmet", bad: false }));
    if (d.infected) {
      rows.push({ host: C2, note: "her 30 sn’de bir küçük paket (beacon) – bilinmeyen sunucu", bad: true });
      if (cmd) rows.push({ host: `${TARGET}:80`, note: "saniyede ~70 istek – tek hedefe yoğun trafik", bad: true });
    }
    return rows;
  }, [d, cmd]);

  return (
    <LabPanel title="Laboratuvar 12 – Botnet Mimarisi Simülasyonu" intro="Kontrol sunucusu (C2), bot cihazlar ve hedef arasındaki ilişkiyi incele. Önce hangi cihazların bot olduğuna kanıtlarla karar ver, sonra onları izole edip ağdaki değişimi gör." done={done}>
      <InfoBox tone="brand" icon="🎯" title="Görev">1) ‘Komutu simüle et’ ile bot trafiğini başlat. 2) Cihazlara tıklayıp bağlantılarını incele. 3) Yalnızca enfekte olanları izole et; temiz cihazı kesmemeye çalış. (Tamamen görsel simülasyon; gerçek C2 veya zararlı yazılım yoktur.)</InfoBox>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="flex flex-wrap gap-2">
            <Btn size="sm" disabled={cmd} onClick={() => setCmd(true)}>📡 Komutu simüle et</Btn>
            <Btn size="sm" variant="secondary" onClick={() => setMap((m) => !m)}>{map ? "Bağlantı haritasını gizle" : "🗺 Ağ bağlantı haritasını göster"}</Btn>
            <Btn size="sm" variant="secondary" disabled={sink || !cmd} onClick={() => setSink(true)}>🕳 C2 alan adını engelle (sinkhole)</Btn>
            <Btn size="sm" variant="ghost" onClick={() => { setCmd(false); setIso([]); setSink(false); setSel(null); }}>Sıfırla</Btn>
          </div>
          <div className="relative mt-3 h-[430px] overflow-hidden rounded-xl border border-line bg-[#f9fcfd]">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
              {map && DEVS.map((dv) => {
                const p = pos(dv.id);
                const isActive = dv.infected && !iso.includes(dv.id) && !sink;
                return (
                  <g key={dv.id}>
                    {dv.infected && !iso.includes(dv.id) && <line x1="50" y1="8" x2={p.x} y2={p.y} stroke={sink ? "#94a3b8" : "#C65353"} strokeWidth="0.5" className={isActive ? "ag-flow" : ""} strokeDasharray={sink ? "1 2" : undefined} />}
                    {!dv.infected && !iso.includes(dv.id) && <line x1="50" y1="8" x2={p.x} y2={p.y} stroke="#DFE8ED" strokeWidth="0.3" />}
                  </g>
                );
              })}
              {cmd && DEVS.map((dv) => {
                const p = pos(dv.id);
                return dv.infected && !iso.includes(dv.id) && !sink ? <line key={`t${dv.id}`} x1={p.x} y1={p.y} x2="50" y2="92" stroke="#C65353" strokeWidth="0.6" className="ag-flow" /> : null;
              })}
            </svg>
            <div className="absolute left-1/2 top-[8%] -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 border-bad bg-white px-3 py-1.5 text-center">
              <p className="text-xl" aria-hidden>🛰️</p>
              <p className="text-[10px] font-bold text-bad">C2 SUNUCUSU</p>
              <p className="font-mono text-[9px] text-muted">{C2}</p>
            </div>
            <div className={`absolute left-1/2 top-[92%] -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 bg-white px-3 py-1.5 text-center ${load > 85 ? "border-bad" : load > 40 ? "border-warn" : "border-ok"}`}>
              <p className="text-xl" aria-hidden>🎯</p>
              <p className="text-[10px] font-bold">HEDEF SUNUCU</p>
              <p className="font-mono text-[9px] text-muted">{TARGET}</p>
            </div>
            {DEVS.map((dv) => {
              const p = pos(dv.id);
              const isolated = iso.includes(dv.id);
              return (
                <button key={dv.id} onClick={() => setSel(dv.id)} aria-label={dv.name} style={{ left: `${p.x}%`, top: `${p.y}%` }} className={`absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-xl border-2 bg-white text-lg shadow-sm transition-all sm:h-14 sm:w-14 ${sel === dv.id ? "scale-110 border-brand ring-2 ring-accent/40" : isolated ? "border-dashed border-muted opacity-60" : "border-line hover:border-brand/50"}`}>
                  <span aria-hidden>{isolated ? "🔒" : dv.icon}</span>
                  <span className="text-[8px] font-semibold leading-none">#{dv.id + 1}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-muted">Bir cihaza tıkla → bağlantılarını ve özelliklerini sağda gör.</p>
        </Card>

        <div className="space-y-3 lg:col-span-2">
          <Card>
            <p className="font-bold">🎯 Hedef sunucu yükü</p>
            <ProgressBar value={load} tone={load > 85 ? "bad" : load > 40 ? "warn" : "ok"} className="mt-2" />
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Stat label="Aktif bot" value={cmd ? active.length : "–"} tone={active.length ? "bad" : "ok"} />
              <Stat label="Yük" value={`%${Math.round(load)}`} tone={load > 85 ? "bad" : load > 40 ? "warn" : "ok"} />
              <Stat label="İzole" value={iso.length} />
            </div>
            {sink && <p className="mt-2 text-xs text-accent">🕳 C2 alan adı engellendi: botlar komut alamıyor ama cihazlar HÂLÂ enfekte; temizlenmeleri gerekir.</p>}
          </Card>

          <Card>
            {!d ? <p className="text-sm text-muted">Bir cihaz seç…</p> : (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold">{d.icon} #{d.id + 1} {d.name}</p>
                  {iso.includes(d.id) && <Badge tone="muted">İzole</Badge>}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`rounded-lg border px-2 py-1.5 ${d.defPw ? "border-warn/50 bg-warn/10" : "border-line bg-page"}`}>Varsayılan parola: <b>{d.defPw ? "EVET ⚠" : "Hayır"}</b></div>
                  <div className={`rounded-lg border px-2 py-1.5 ${d.fw < 2021 ? "border-warn/50 bg-warn/10" : "border-line bg-page"}`}>Yazılım yılı: <b>{d.fw}{d.fw < 2021 ? " ⚠" : ""}</b></div>
                </div>
                <p className="text-xs font-bold text-muted">Dışarıya bağlantılar</p>
                <ul className="space-y-1">
                  {evidence.map((e, i) => (
                    <li key={i} className={`rounded-lg border px-2 py-1.5 text-xs ${e.bad ? "border-bad/40 bg-bad/10" : "border-line bg-page"}`}>
                      <span className="font-mono font-semibold">{e.host}</span><br /><span className="text-muted">{e.note}</span>
                    </li>
                  ))}
                </ul>
                <Btn size="sm" variant={iso.includes(d.id) ? "secondary" : "danger"} onClick={() => toggleIso(d.id)}>{iso.includes(d.id) ? "🔓 Ağa yeniden bağla" : "🔒 Cihazı izole et"}</Btn>
              </div>
            )}
          </Card>
        </div>
      </div>

      {falsePos.length > 0 && (
        <Feedback ok={null} title="Yanlış pozitif">Temiz cihazları izole ettin: {falsePos.map((f) => f.name).join(", ")}. Gereksiz kesinti kullanıcıyı etkiler; kanıta (bilinmeyen C2 bağlantısı, beacon) bakarak karar ver. Eski yazılım veya varsayılan parola risktir ama tek başına ‘enfekte’ anlamına gelmez.</Feedback>
      )}
      {!cmd && <InfoBox tone="muted" icon="ℹ️">Önce ‘Komutu simüle et’ ile botların davranışını görünür kıl.</InfoBox>}
      {finished && (
        <Feedback ok title="Botnet etkisiz hale getirildi!">
          {infectedTotal} enfekte cihazın tamamını izole ettin; hedef sunucu yükü %{Math.round(load)}’e düştü. Yanlış pozitif: {falsePos.length}. Gerçek hayatta sonraki adımlar: cihazları sıfırla, parolayı değiştir, yazılımı güncelle ve C2 adresini engelle.
        </Feedback>
      )}
    </LabPanel>
  );
}
