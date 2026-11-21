"use client";

import { useState } from "react";
import { Btn, Callout, DeviceIcon, LabBox, pointAt, sleep, useTween } from "@/components/ui";
import { markLab } from "@/lib/storage";

type Req = { id: string; method: string; path: string; code: number; text: string; note: string };

const REQS: Req[] = [
  { id: "r1", method: "GET", path: "/index.html", code: 200, text: "OK", note: "Ana sayfa HTML içeriği gönderildi." },
  { id: "r2", method: "GET", path: "/logo.png", code: 200, text: "OK", note: "Görsel dosyası gönderildi (image/png)." },
  { id: "r3", method: "POST", path: "/login", code: 200, text: "OK", note: "Giriş bilgileri işlendi, oturum başlatıldı." },
  { id: "r4", method: "GET", path: "/gizli-belge", code: 403, text: "Forbidden", note: "Kaynak var ama bu istemcinin erişim yetkisi yok." },
  { id: "r5", method: "GET", path: "/olmayan-sayfa", code: 404, text: "Not Found", note: "İstenen kaynak sunucuda bulunamadı." },
];

const C = { x: 90, y: 170 };
const S = { x: 510, y: 170 };

export default function Lab03() {
  const [rid, setRid] = useState("r1");
  const [online, setOnline] = useState(true);
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState<"idle" | "req" | "proc" | "res" | "lost">("idle");
  const [dir, setDir] = useState<"req" | "res">("req");
  const [label, setLabel] = useState("");
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const { t, run } = useTween();

  const req = REQS.find((r) => r.id === rid)!;

  const send = async () => {
    if (busy) return;
    setBusy(true);
    setResult(null);
    setDir("req");
    setLabel(`${req.method} ${req.path}`);
    setPhase("req");
    if (!online) {
      await run(900);
      setPhase("lost");
      await sleep(900);
      setPhase("idle");
      setBusy(false);
      setResult({ ok: false, text: "Zaman aşımı! Sunucu kapalı olduğu için istek yanıtsız kaldı. Merkezi bir sistemde sunucu kapanırsa tüm istemciler etkilenir (tek hata noktası)." });
      setLog((l) => [`İSTEMCİ: ${req.method} ${req.path} → (yanıt yok – zaman aşımı)`, ...l].slice(0, 6));
      markLab(3);
      return;
    }
    await run(1300);
    setPhase("proc");
    await sleep(900);
    setDir("res");
    setLabel(`${req.code} ${req.text}`);
    setPhase("res");
    await run(1300);
    setPhase("idle");
    setBusy(false);
    setResult({ ok: req.code < 400, text: `Sunucu yanıtı: ${req.code} ${req.text}. ${req.note}` });
    setLog((l) => [`İSTEMCİ: ${req.method} ${req.path} → SUNUCU: ${req.code} ${req.text}`, ...l].slice(0, 6));
    markLab(3);
  };

  const pts = dir === "req" ? [C, S] : [S, C];
  const lostPts = [C, { x: 300, y: 170 }];

  return (
    <LabBox title="Client-Server İstek/Yanıt Simülasyonu">
      <p className="text-sm text-muted">Bir istek seç, sunucu durumunu belirle ve gönder. İstek sunucuya gider, sunucu işler ve yanıt istemciye döner.</p>
      <div className="overflow-x-auto rounded-xl border border-line bg-white">
        <svg viewBox="0 0 600 300" className="w-full" style={{ minWidth: 460 }}>
          <line x1={C.x} y1={C.y} x2={S.x} y2={S.y} stroke="#176B87" strokeWidth={3} className={phase === "req" || phase === "res" ? "flow" : ""} strokeOpacity={0.6} />
          <rect x={20} y={110} width={140} height={120} rx={16} fill="#E8F3F7" />
          <DeviceIcon kind="laptop" x={C.x} y={C.y - 5} size={60} />
          <text x={C.x} y={C.y + 52} textAnchor="middle" fontSize={13} fontWeight={700} fill="#172B3A">İstemci (Client)</text>
          <rect x={440} y={110} width={140} height={120} rx={16} fill={online ? "#E9F5EF" : "#F9ECEC"} />
          <DeviceIcon kind="server" x={S.x} y={S.y - 5} size={60} color={online ? "#25845B" : "#C65353"} />
          <text x={S.x} y={S.y + 52} textAnchor="middle" fontSize={13} fontWeight={700} fill="#172B3A">Sunucu (Server)</text>
          <text x={S.x} y={100} textAnchor="middle" fontSize={11} fontWeight={700} fill={online ? "#25845B" : "#C65353"}>{online ? "● ÇEVRİMİÇİ" : "● KAPALI"}</text>
          {phase === "proc" && <text x={S.x} y={85} textAnchor="middle" fontSize={11} fontWeight={700} fill="#D69A32">⚙ İstek işleniyor…</text>}
          {t !== null && (phase === "req" || phase === "res" || phase === "lost") && (() => {
            const p = pointAt(phase === "lost" ? lostPts : pts, t);
            const w = Math.max(70, label.length * 7.2);
            return (
              <g>
                <rect x={p.x - w / 2} y={p.y - 30} width={w} height={22} rx={6} fill={phase === "res" ? "#25845B" : "#176B87"} />
                <text x={p.x} y={p.y - 15} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff">{label}</text>
                <circle cx={p.x} cy={p.y} r={6} fill="#D69A32" stroke="#fff" strokeWidth={2} />
              </g>
            );
          })()}
          {phase === "lost" && <text x={300} y={150} textAnchor="middle" fontSize={26} fill="#C65353">✕</text>}
        </svg>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <label className="text-sm font-semibold">
          İstek
          <select className="field mt-1" value={rid} onChange={(e) => setRid(e.target.value)} disabled={busy}>
            {REQS.map((r) => <option key={r.id} value={r.id}>{r.method} {r.path}</option>)}
          </select>
        </label>
        <Btn variant={online ? "soft" : "danger"} onClick={() => setOnline((o) => !o)} disabled={busy}>{online ? "Sunucuyu Kapat" : "Sunucuyu Aç"}</Btn>
        <Btn onClick={send} disabled={busy}>📨 İsteği Gönder</Btn>
      </div>
      {result && <Callout kind={result.ok ? "ok" : "err"} title={result.ok ? "Yanıt alındı" : "Sorun oluştu"}>{result.text}</Callout>}
      {log.length > 0 && (
        <div className="rounded-xl border border-line bg-white p-3 text-xs">
          <p className="mb-1 font-bold">İletişim kaydı</p>
          {log.map((l, i) => <p key={i} className="font-mono text-muted">{l}</p>)}
        </div>
      )}
      <div className="flex"><Btn variant="ghost" onClick={() => { setLog([]); setResult(null); }} disabled={busy}>↺ Kaydı Temizle</Btn></div>
    </LabBox>
  );
}
