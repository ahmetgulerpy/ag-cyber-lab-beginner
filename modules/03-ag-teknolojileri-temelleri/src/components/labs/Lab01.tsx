"use client";

import { useState } from "react";
import { Btn, Callout, DeviceIcon, LabBox, pointAt, useTween } from "@/components/ui";
import { markLab } from "@/lib/storage";

const DEV = [
  { id: "pc", name: "Bilgisayar", ip: "192.168.1.10", x: 100, y: 70 },
  { id: "phone", name: "Telefon", ip: "192.168.1.11", x: 100, y: 270 },
  { id: "server", name: "Sunucu", ip: "192.168.1.20", x: 500, y: 70 },
  { id: "printer", name: "Yazıcı", ip: "192.168.1.30", x: 500, y: 270 },
];
const SW = { x: 300, y: 170 };

export default function Lab01() {
  const [conn, setConn] = useState<Record<string, boolean>>({});
  const [src, setSrc] = useState("pc");
  const [dst, setDst] = useState("printer");
  const [busy, setBusy] = useState(false);
  const [path, setPath] = useState<{ x: number; y: number }[] | null>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err" | "info"; text: string } | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const { t, run } = useTween();

  const get = (id: string) => DEV.find((d) => d.id === id)!;
  const connectedCount = DEV.filter((d) => conn[d.id]).length;

  const send = async () => {
    if (busy) return;
    const a = get(src);
    const b = get(dst);
    if (src === dst) return setMsg({ kind: "err", text: "Kaynak ve hedef aynı cihaz olamaz. Farklı bir hedef seç." });
    if (!conn[src]) return setMsg({ kind: "err", text: `${a.name} ağa bağlı değil. Önce cihaza tıklayıp ağ anahtarına kablo bağla.` });
    if (!conn[dst]) return setMsg({ kind: "err", text: `${b.name} ağa bağlı değil, bu yüzden paket ona ulaşamaz. Hedef cihazı da bağla.` });
    setBusy(true);
    setMsg({ kind: "info", text: `${a.name} → ağ anahtarı → ${b.name}: paket yolda...` });
    setPath([a, SW, b]);
    await run(2000);
    setPath(null);
    setBusy(false);
    setMsg({ kind: "ok", text: `Başarılı! ${b.name} (${b.ip}) paketi aldı. Paket anahtardan geçerek yalnızca hedefe iletildi.` });
    setLog((l) => [`${a.ip} → ${b.ip} : "Merhaba, ben ${a.name}" (1 paket)`, ...l].slice(0, 5));
    markLab(1);
  };

  return (
    <LabBox title="Sanal Ağ Kurma">
      <p className="text-sm text-muted">Bir cihaza tıklayarak ağ anahtarına bağla (tekrar tıklarsan kablo çıkar). Sonra kaynak ve hedef seçip veri gönder. Bağlı cihaz: {connectedCount}/4</p>
      <div className="overflow-x-auto rounded-xl border border-line bg-white">
        <svg viewBox="0 0 600 340" className="w-full" style={{ minWidth: 460 }}>
          {DEV.map((d) => (
            <line key={d.id} x1={d.x} y1={d.y} x2={SW.x} y2={SW.y} stroke={conn[d.id] ? "#176B87" : "#DFE8ED"} strokeWidth={conn[d.id] ? 3 : 2} strokeDasharray={conn[d.id] ? undefined : "4 6"} />
          ))}
          <circle cx={SW.x} cy={SW.y} r={34} fill="#E8F3F7" stroke="#176B87" strokeOpacity={0.4} />
          <DeviceIcon kind="switch" x={SW.x} y={SW.y} size={48} />
          <text x={SW.x} y={SW.y + 56} textAnchor="middle" fontSize={12} fontWeight={700} fill="#172B3A">Ağ Anahtarı (Switch)</text>
          {DEV.map((d) => (
            <g key={d.id} className="cursor-pointer" onClick={() => !busy && setConn((c) => ({ ...c, [d.id]: !c[d.id] }))} role="button" aria-label={`${d.name} bağlantısını değiştir`}>
              <circle cx={d.x} cy={d.y} r={36} fill={conn[d.id] ? "#E9F5EF" : "#FFFFFF"} stroke={conn[d.id] ? "#25845B" : "#DFE8ED"} strokeWidth={2} />
              <DeviceIcon kind={d.id === "phone" ? "phone" : d.id} x={d.x} y={d.y} size={44} color={conn[d.id] ? "#25845B" : "#64748B"} />
              <text x={d.x} y={d.y + 54} textAnchor="middle" fontSize={12} fontWeight={700} fill="#172B3A">{d.name}</text>
              <text x={d.x} y={d.y + 68} textAnchor="middle" fontSize={10} fill="#64748B">{d.ip}</text>
              <text x={d.x} y={d.y - 44} textAnchor="middle" fontSize={10} fontWeight={700} fill={conn[d.id] ? "#25845B" : "#C65353"}>{conn[d.id] ? "● bağlı" : "○ bağlı değil"}</text>
            </g>
          ))}
          {path && t !== null && (() => {
            const p = pointAt(path, t);
            return (
              <g>
                <rect x={p.x - 12} y={p.y - 9} width={24} height={18} rx={4} fill="#D69A32" stroke="#fff" strokeWidth={2} />
                <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={9} fontWeight={800} fill="#fff">PKT</text>
              </g>
            );
          })()}
        </svg>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label className="text-sm font-semibold">
          Kaynak cihaz
          <select className="field mt-1" value={src} onChange={(e) => setSrc(e.target.value)}>
            {DEV.map((d) => <option key={d.id} value={d.id}>{d.name} ({d.ip})</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Hedef cihaz
          <select className="field mt-1" value={dst} onChange={(e) => setDst(e.target.value)}>
            {DEV.map((d) => <option key={d.id} value={d.id}>{d.name} ({d.ip})</option>)}
          </select>
        </label>
        <Btn onClick={send} disabled={busy}>📨 Veri Gönder</Btn>
      </div>
      <div className="flex flex-wrap gap-2">
        <Btn variant="soft" onClick={() => setConn({ pc: true, phone: true, server: true, printer: true })} disabled={busy}>Hepsini Bağla</Btn>
        <Btn variant="ghost" onClick={() => { setConn({}); setMsg(null); setLog([]); }} disabled={busy}>↺ Sıfırla</Btn>
      </div>
      {msg && <Callout kind={msg.kind} title={msg.kind === "ok" ? "İletişim kuruldu" : msg.kind === "err" ? "İletişim kurulamadı" : "Gönderiliyor"}>{msg.text}</Callout>}
      {log.length > 0 && (
        <div className="rounded-xl border border-line bg-white p-3 text-xs">
          <p className="mb-1 font-bold text-ink">Veri alışverişi kaydı</p>
          {log.map((l, i) => <p key={i} className="font-mono text-muted">{l}</p>)}
        </div>
      )}
    </LabBox>
  );
}
