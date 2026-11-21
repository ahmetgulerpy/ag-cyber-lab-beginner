"use client";

import { useState } from "react";
import { Btn, Callout, DeviceIcon, LabBox } from "@/components/ui";
import { markLab } from "@/lib/storage";

const N = [
  { id: "internet", name: "İnternet", icon: "cloud", x: 55, y: 170 },
  { id: "modem", name: "Modem", icon: "modem", x: 165, y: 170 },
  { id: "router", name: "Router", icon: "router", x: 285, y: 170 },
  { id: "switch", name: "Switch", icon: "switch", x: 410, y: 80 },
  { id: "ap", name: "Access Point", icon: "ap", x: 410, y: 260 },
  { id: "pc", name: "Bilgisayar", icon: "pc", x: 545, y: 80 },
  { id: "laptop", name: "Dizüstü (Wi-Fi)", icon: "laptop", x: 545, y: 260 },
];

const key = (a: string, b: string) => [a, b].sort().join("|");

// Gereken bağlantı grupları (her grup için en az bir geçerli bağlantı)
const GOALS: { label: string; keys: string[] }[] = [
  { label: "İnternet ↔ Modem", keys: [key("internet", "modem")] },
  { label: "Modem ↔ Router", keys: [key("modem", "router")] },
  { label: "Router ↔ Switch", keys: [key("router", "switch")] },
  { label: "Access Point ↔ Router/Switch", keys: [key("ap", "router"), key("ap", "switch")] },
  { label: "Switch ↔ Bilgisayar", keys: [key("switch", "pc")] },
  { label: "Access Point ↔ Dizüstü (Wi-Fi)", keys: [key("ap", "laptop")] },
];

const VALID = new Set(GOALS.flatMap((g) => g.keys));

function explain(a: string, b: string): { ok: boolean; text: string } {
  const k = key(a, b);
  if (VALID.has(k)) {
    const m: Record<string, string> = {
      [key("internet", "modem")]: "Doğru! ISS hattı önce modeme girer; modem hat sinyalini dijital veriye çevirir.",
      [key("modem", "router")]: "Doğru! Router, modemden gelen internet bağlantısını yerel ağa dağıtır, NAT ve DHCP yapar.",
      [key("router", "switch")]: "Doğru! Switch, router'ın arkasında yerel ağdaki kablolu cihazların sayısını artırır.",
      [key("ap", "router")]: "Doğru! Access Point, router'a bağlanarak Wi-Fi kapsaması oluşturur.",
      [key("ap", "switch")]: "Doğru! Access Point switch üzerinden de ağa katılabilir.",
      [key("switch", "pc")]: "Doğru! Kablolu bilgisayar switch portuna bağlanır.",
      [key("ap", "laptop")]: "Doğru! Dizüstü bilgisayar kablosuz olarak Access Point'e bağlanır (kesikli çizgi).",
    };
    return { ok: true, text: m[k] ?? "Doğru bağlantı." };
  }
  const has = (x: string) => a === x || b === x;
  if (has("internet") && has("router")) return { ok: false, text: "İnternet hattı doğrudan router'a bağlanamaz: hattın sinyalini çevirecek modem gerekir (fiberde ONT)." };
  if (has("internet")) return { ok: false, text: "İnternet hattı yalnızca modeme bağlanır. Diğer cihazlar internete router üzerinden ulaşmalıdır." };
  if (has("modem") && has("switch")) return { ok: false, text: "Modem ile switch arasında router olmalı. Switch IP yönlendirme, NAT ve DHCP yapmaz; modemden gelen tek bağlantıyı paylaşamaz." };
  if (has("modem")) return { ok: false, text: "Cihazlar doğrudan modeme bağlanırsa NAT, DHCP ve güvenlik duvarı gibi router işlevleri devre dışı kalır. Önce router kullan." };
  if (has("router") && (has("pc") || has("laptop"))) return { ok: false, text: "Küçük ağlarda mümkün olsa da bu senaryoda bilgisayar switch'e, dizüstü Access Point'e bağlanmalı; router'ın port sayısı sınırlıdır." };
  if (has("laptop") && has("switch")) return { ok: false, text: "Dizüstü bu senaryoda kablosuz çalışıyor; kablolu switch'e değil Access Point'e bağlanmalı." };
  if (has("laptop") && has("router")) return { ok: false, text: "Dizüstü kablosuz bağlanır; bunun için Access Point kullanılmalı." };
  if (has("pc") && has("ap")) return { ok: false, text: "Bilgisayar bu senaryoda kablolu; switch portuna bağlanmalı. Access Point kablosuz cihazlar içindir." };
  if (has("pc") && has("laptop")) return { ok: false, text: "Uç cihazlar birbirine doğrudan bağlanmaz; aralarında switch veya access point gibi bir ağ cihazı olmalıdır." };
  return { ok: false, text: "Bu iki cihaz arasındaki doğrudan bağlantı beklenen ağ düzenine uymuyor." };
}

export default function Lab04() {
  const [links, setLinks] = useState<string[]>([]);
  const [first, setFirst] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const pos = (id: string) => N.find((n) => n.id === id)!;
  const goalDone = GOALS.map((g) => g.keys.some((k) => links.includes(k)));
  const complete = goalDone.every(Boolean);

  const click = (id: string) => {
    if (!first) {
      setFirst(id);
      setMsg({ ok: true, text: `${pos(id).name} seçildi. Şimdi bağlanacak ikinci cihazı seç.` });
      return;
    }
    if (first === id) {
      setFirst(null);
      setMsg(null);
      return;
    }
    const k = key(first, id);
    setFirst(null);
    if (links.includes(k)) {
      setMsg({ ok: false, text: "Bu bağlantı zaten var. Kabloyu kaldırmak için çizgiye tıklayabilirsin." });
      return;
    }
    const r = explain(first, id);
    setMsg(r);
    if (r.ok) {
      const nl = [...links, k];
      setLinks(nl);
      if (GOALS.every((g) => g.keys.some((kk) => nl.includes(kk)))) markLab(4);
    }
  };

  return (
    <LabBox title="Ağ Topolojisi Kurma">
      <p className="text-sm text-muted">İki cihaza sırayla tıklayarak kablo çek. Doğru bağlantılar yeşil kalır, yanlışlarda neden olmadığı açıklanır.</p>
      <div className="overflow-x-auto rounded-xl border border-line bg-white">
        <svg viewBox="0 0 620 340" className="w-full" style={{ minWidth: 520 }}>
          {links.map((k) => {
            const [a, b] = k.split("|");
            const A = pos(a);
            const B = pos(b);
            const wifi = k === key("ap", "laptop");
            return (
              <g key={k} className="cursor-pointer" onClick={() => setLinks((l) => l.filter((x) => x !== k))}>
                <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="transparent" strokeWidth={16} />
                <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#25845B" strokeWidth={3} strokeDasharray={wifi ? "3 6" : undefined} className={complete ? "flow" : ""} />
              </g>
            );
          })}
          {N.map((n) => (
            <g key={n.id} className="cursor-pointer" onClick={() => click(n.id)} role="button" aria-label={n.name}>
              <circle cx={n.x} cy={n.y} r={34} fill={first === n.id ? "#E8F3F7" : "#fff"} stroke={first === n.id ? "#176B87" : "#DFE8ED"} strokeWidth={first === n.id ? 3 : 2} />
              <DeviceIcon kind={n.icon} x={n.x} y={n.y} size={42} />
              <text x={n.x} y={n.y + 52} textAnchor="middle" fontSize={11} fontWeight={700} fill="#172B3A">{n.name}</text>
            </g>
          ))}
        </svg>
      </div>
      {msg && <Callout kind={msg.ok ? "ok" : "err"} title={msg.ok ? "Bilgi" : "Yanlış bağlantı"}>{msg.text}</Callout>}
      <div className="grid gap-2 sm:grid-cols-2">
        {GOALS.map((g, i) => (
          <div key={g.label} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${goalDone[i] ? "border-ok/40 bg-[#E9F5EF] text-ok" : "border-line bg-white text-muted"}`}>
            <span>{goalDone[i] ? "✔" : "○"}</span> {g.label}
          </div>
        ))}
      </div>
      {complete && <Callout kind="ok" title="Ağ çalışıyor! 🎉">Tüm bağlantılar doğru: İnternet → Modem → Router → Switch → Bilgisayar ve Router/Switch → Access Point → Dizüstü. Veri akışı kesikli animasyonla gösteriliyor.</Callout>}
      <Btn variant="ghost" onClick={() => { setLinks([]); setFirst(null); setMsg(null); }}>↺ Sıfırla</Btn>
    </LabBox>
  );
}
