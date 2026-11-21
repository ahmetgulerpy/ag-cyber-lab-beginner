"use client";

import { useState } from "react";
import { Btn, Callout, LabBox, StepControls, useStepper } from "@/components/ui";
import { SeqDiagram, type SeqMsg } from "@/components/Seq";
import { markLab } from "@/lib/storage";

const DEVS = [
  { id: "a", name: "PC-A", ip: "192.168.1.10", mac: "3C:22:FB:A1:09:5E", vendor: "Örnek Üretici 1" },
  { id: "b", name: "PC-B", ip: "192.168.1.20", mac: "3C:22:FB:7D:41:C2", vendor: "Örnek Üretici 1" },
  { id: "c", name: "Yazıcı", ip: "192.168.1.30", mac: "00:1A:2B:44:88:F0", vendor: "Örnek Üretici 2" },
  { id: "d", name: "Telefon", ip: "192.168.1.40", mac: "A4:5E:60:0B:93:3D", vendor: "Örnek Üretici 3" },
];

type Scenario = { src: string; tgt: string; cached: boolean; msgs: SeqMsg[]; notes: string[] };

export default function Lab10() {
  const [selId, setSelId] = useState("a");
  const [src, setSrc] = useState("a");
  const [tgt, setTgt] = useState("c");
  const [table, setTable] = useState<Record<string, string>>({});
  const [sc, setSc] = useState<Scenario | null>(null);
  const s = useStepper(sc ? sc.msgs.length : 1, 1300);
  const sel = DEVS.find((d) => d.id === selId)!;
  const total = sc ? sc.msgs.length : 0;

  const resolve = () => {
    if (src === tgt) return;
    const A = DEVS.find((d) => d.id === src)!;
    const B = DEVS.find((d) => d.id === tgt)!;
    const key = `${A.id}|${B.ip}`;
    const cached = !!table[key];
    let msgs: SeqMsg[];
    let notes: string[];
    if (cached) {
      msgs = [
        { from: 0, to: 0, label: "ARP tablosuna bak", sub: `${B.ip} → ${B.mac}`, tone: "ok" },
        { from: 0, to: 2, label: "Çerçeve doğrudan gönderilir", sub: `hedef MAC ${B.mac}`, tone: "ok" },
      ];
      notes = ["Hedefin MAC adresi ARP tablosunda zaten var; yeni ARP isteği gerekmez.", "Çerçeve doğrudan hedef MAC adresine (unicast) gönderilir."];
    } else {
      msgs = [
        { from: 0, to: 0, label: "ARP tablosunda kayıt yok", sub: `${B.ip} için MAC bilinmiyor`, tone: "warn" },
        { from: 0, to: 2, label: "ARP İstek (Broadcast)", sub: `Who has ${B.ip}? Tell ${A.ip}`, tone: "brand" },
        { from: 1, to: 1, label: "Diğer cihazlar: IP eşleşmedi", sub: "isteği yok sayarlar", tone: "warn" },
        { from: 2, to: 2, label: "IP eşleşti!", sub: `${A.ip} → ${A.mac} öğrenildi`, tone: "ok" },
        { from: 2, to: 0, label: "ARP Yanıt (Unicast)", sub: `${B.ip} is at ${B.mac}`, tone: "ok" },
        { from: 0, to: 0, label: "ARP tablosu güncellendi", sub: `${B.ip} → ${B.mac}`, tone: "ok" },
      ];
      notes = [
        "PC önce kendi ARP tablosuna bakar; kayıt bulamaz.",
        "FF:FF:FF:FF:FF:FF hedef MAC'li yayın çerçevesiyle tüm yerel ağa sorar.",
        "IP adresi kendisine ait olmayan cihazlar isteği sessizce yok sayar.",
        "Hedef cihaz, isteği yapanın IP-MAC bilgisini de öğrenir.",
        "Hedef, MAC adresini yalnızca isteyen cihaza doğrudan (unicast) bildirir.",
        "Eşleşme ARP tablosuna yazılır; sonraki iletişim doğrudan yapılır.",
      ];
      setTable((t) => ({ ...t, [key]: B.mac }));
    }
    setSc({ src, tgt, cached, msgs, notes });
    s.reset();
    setTimeout(() => s.play(), 50);
    markLab(10);
  };

  const A = DEVS.find((d) => d.id === src)!;
  const rows = Object.entries(table).filter(([k]) => {
    const [dev] = k.split("|");
    if (dev !== src) return false;
    if (sc && !sc.cached && `${sc.src}|${DEVS.find((d) => d.id === sc.tgt)!.ip}` === k && s.step < total) return false;
    return true;
  });
  const actors = [A.name, "Ağdaki diğer cihazlar", DEVS.find((d) => d.id === tgt)!.name];

  return (
    <LabBox title="MAC Adresleri ve ARP Simülasyonu">
      <p className="text-sm text-muted">Sanal yerel ağdaki (192.168.1.0/24) cihazlardan birini seç ve MAC adresini incele.</p>
      <div className="grid gap-2 sm:grid-cols-4">
        {DEVS.map((d) => (
          <button key={d.id} type="button" onClick={() => setSelId(d.id)} className={`rounded-xl border p-3 text-left transition ${selId === d.id ? "border-brand bg-soft" : "border-line bg-white hover:bg-soft"}`}>
            <p className="text-sm font-bold">{d.name}</p>
            <p className="font-mono text-xs text-muted">{d.ip}</p>
            <p className="font-mono text-xs text-brand">{d.mac}</p>
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-brand/25 bg-white p-4 text-sm">
        <p className="mb-2 font-bold">{sel.name} – ağ kartı (NIC) bilgisi</p>
        <p className="font-mono text-lg font-bold">
          <span className="rounded bg-soft px-1.5 text-brand">{sel.mac.slice(0, 8)}</span>:<span className="rounded bg-[#E9F5EF] px-1.5 text-ok">{sel.mac.slice(9)}</span>
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-muted">
          <li><span className="font-semibold text-brand">İlk 24 bit (OUI)</span>: üretici kimliği → {sel.vendor}</li>
          <li><span className="font-semibold text-ok">Son 24 bit</span>: üreticinin bu karta verdiği seri numarası</li>
          <li>Ağda tanınma: switch, bu cihaza giden çerçeveleri MAC adresine bakarak <b>yalnızca bu cihazın portuna</b> iletir. IP adresi ({sel.ip}) ise yönlendirme için mantıksal kimliktir.</li>
        </ul>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label className="text-sm font-semibold">Gönderen
          <select className="field mt-1" value={src} onChange={(e) => setSrc(e.target.value)}>{DEVS.map((d) => <option key={d.id} value={d.id}>{d.name} ({d.ip})</option>)}</select>
        </label>
        <label className="text-sm font-semibold">Ulaşılmak istenen IP
          <select className="field mt-1" value={tgt} onChange={(e) => setTgt(e.target.value)}>{DEVS.map((d) => <option key={d.id} value={d.id}>{d.name} ({d.ip})</option>)}</select>
        </label>
        <Btn onClick={resolve} disabled={src === tgt}>🔎 ARP Çözümle</Btn>
      </div>
      {src === tgt && <Callout kind="warn">Gönderen ve hedef farklı olmalı.</Callout>}
      {sc && (
        <div className="space-y-3">
          <StepControls s={s} total={total} />
          <SeqDiagram actors={[DEVS.find((d) => d.id === sc.src)!.name, "Ağdaki diğer cihazlar", DEVS.find((d) => d.id === sc.tgt)!.name]} msgs={sc.msgs} visible={s.step} rowH={60} />
          {s.step > 0 && <Callout title={`Adım ${s.step}`}>{sc.notes[s.step - 1]}</Callout>}
        </div>
      )}
      <div className="rounded-xl border border-line bg-white p-3 text-sm">
        <p className="mb-1 font-bold">{actors[0]} ARP tablosu</p>
        {rows.length === 0 ? <p className="text-muted">Tablo boş. ARP çözümlemesi yapınca burada eşleşmeler görünür.</p> : (
          <table className="w-full text-left"><thead className="text-xs text-muted"><tr><th>IP</th><th>MAC</th></tr></thead><tbody>{rows.map(([k, m]) => <tr key={k}><td className="font-mono">{k.split("|")[1]}</td><td className="font-mono text-brand">{m}</td></tr>)}</tbody></table>
        )}
        <div className="mt-2"><Btn variant="ghost" onClick={() => { setTable({}); setSc(null); s.reset(); }}>↺ Tabloyu Temizle</Btn></div>
      </div>
    </LabBox>
  );
}
