"use client";

import { useState } from "react";
import { Btn, Callout, DeviceIcon, LabBox, pointAt, useTween, type Pt } from "@/components/ui";
import { markLab } from "@/lib/storage";

type Node = { id: string; label: string; x: number; y: number; kind: "dev" | "sw" | "jn" };
type Topo = { nodes: Node[]; links: [string, string][] };
type TKey = "bus" | "star" | "ring" | "mesh" | "tree" | "hybrid";

const dev = (id: string, x: number, y: number): Node => ({ id, label: id.toUpperCase().replace("P", "PC"), x, y, kind: "dev" });
const sw = (id: string, label: string, x: number, y: number): Node => ({ id, label, x, y, kind: "sw" });

function circle(n: number, cx: number, cy: number, r: number): Node[] {
  return Array.from({ length: n }, (_, i) => {
    const a = (-90 + (360 / n) * i) * (Math.PI / 180);
    return dev(`p${i + 1}`, Math.round(cx + r * Math.cos(a)), Math.round(cy + r * Math.sin(a) * 0.85));
  });
}

function build(k: TKey): Topo {
  if (k === "star") {
    const c = sw("sw", "Switch", 300, 170);
    const d = circle(6, 300, 170, 125);
    return { nodes: [c, ...d], links: d.map((x) => ["sw", x.id]) };
  }
  if (k === "ring") {
    const d = circle(6, 300, 170, 120);
    return { nodes: d, links: d.map((x, i) => [x.id, d[(i + 1) % d.length].id] as [string, string]) };
  }
  if (k === "mesh") {
    const d = circle(5, 300, 175, 125);
    const links: [string, string][] = [];
    for (let i = 0; i < d.length; i++) for (let j = i + 1; j < d.length; j++) links.push([d[i].id, d[j].id]);
    return { nodes: d, links };
  }
  if (k === "bus") {
    const jn: Node[] = [0, 1, 2, 3, 4].map((i) => ({ id: `j${i + 1}`, label: "", x: 90 + i * 105, y: 170, kind: "jn" }));
    const d: Node[] = [0, 1, 2, 3, 4].map((i) => dev(`p${i + 1}`, 90 + i * 105, i % 2 === 0 ? 70 : 270));
    const links: [string, string][] = [];
    for (let i = 0; i < 4; i++) links.push([`j${i + 1}`, `j${i + 2}`]);
    for (let i = 0; i < 5; i++) links.push([`j${i + 1}`, `p${i + 1}`]);
    return { nodes: [...jn, ...d], links };
  }
  if (k === "tree") {
    const nodes = [sw("root", "Ana Switch", 300, 50), sw("sa", "Switch A", 160, 150), sw("sb", "Switch B", 440, 150), dev("p1", 90, 270), dev("p2", 230, 270), dev("p3", 370, 270), dev("p4", 510, 270)];
    return { nodes, links: [["root", "sa"], ["root", "sb"], ["sa", "p1"], ["sa", "p2"], ["sb", "p3"], ["sb", "p4"]] };
  }
  const nodes = [sw("s1", "Switch 1", 300, 55), sw("s2", "Switch 2", 120, 185), sw("s3", "Switch 3", 480, 185), dev("p1", 190, 40), dev("p2", 410, 40), dev("p3", 50, 290), dev("p4", 190, 290), dev("p5", 410, 290), dev("p6", 550, 290)];
  return { nodes, links: [["s1", "s2"], ["s2", "s3"], ["s1", "s3"], ["s1", "p1"], ["s1", "p2"], ["s2", "p3"], ["s2", "p4"], ["s3", "p5"], ["s3", "p6"]] };
}

const INFO: Record<TKey, { name: string; en: string; pros: string[]; cons: string[]; use: string; desc: string }> = {
  bus: { name: "Bus (Veri Yolu)", en: "Bus", desc: "Tüm cihazlar tek bir ana kabloya (omurga) bağlanır.", pros: ["Ucuz ve basit", "Az kablo gerekir"], cons: ["Omurga kopunca ağ ikiye bölünür", "Cihaz sayısı arttıkça yavaşlar", "Arıza bulmak zordur"], use: "Eski Ethernet ağları, küçük geçici ağlar." },
  star: { name: "Star (Yıldız)", en: "Star", desc: "Tüm cihazlar merkezî bir switch'e bağlanır.", pros: ["Kurulum ve yönetim kolay", "Bir cihaz arızası diğerlerini etkilemez"], cons: ["Merkez switch tek hata noktasıdır", "Çok kablo gerekir"], use: "Ev, ofis ve okul ağları (en yaygın)." },
  ring: { name: "Ring (Halka)", en: "Ring", desc: "Her cihaz iki komşusuna bağlanır, veri halka boyunca döner.", pros: ["Düzenli veri akışı", "Çarpışma az"], cons: ["Tek kesintide yön değişir; iki kesintide ağ bölünür", "Cihaz eklemek zor"], use: "Token Ring, FDDI, şehir fiber halkaları." },
  mesh: { name: "Mesh (Örgü)", en: "Mesh", desc: "Cihazlar birbirine çok sayıda doğrudan bağlantıyla bağlanır.", pros: ["Çok yüksek dayanıklılık", "Alternatif yollar vardır"], cons: ["Çok pahalı ve karmaşık", "Çok kablo/port gerekir"], use: "İnternet omurgası, veri merkezleri, Wi-Fi mesh." },
  tree: { name: "Tree (Ağaç)", en: "Tree", desc: "Hiyerarşik yapı: ana switch altında alt switch'ler ve cihazlar.", pros: ["Ölçeklenebilir", "Yönetim hiyerarşiktir"], cons: ["Üst düğüm koparsa altındaki dal ağdan kopar", "Kök arızası kritik"], use: "Okul ve kampüs ağları, kurumsal binalar." },
  hybrid: { name: "Hybrid (Hibrit)", en: "Hybrid", desc: "Birden fazla topolojinin birleşimi (burada mesh çekirdek + star kollar).", pros: ["Esnek, ihtiyaca göre büyür", "Çekirdekte yedeklilik"], cons: ["Tasarımı ve yönetimi karmaşık", "Maliyet yüksek olabilir"], use: "Büyük şirketler, gerçek dünya ağlarının çoğu." },
};

const lk = (a: string, b: string) => [a, b].sort().join("|");

function bfs(topo: Topo, failed: Set<string>, cut: Set<string>, from: string, to: string): string[] | null {
  if (failed.has(from) || failed.has(to)) return null;
  const prev: Record<string, string | null> = { [from]: null };
  const q = [from];
  while (q.length) {
    const cur = q.shift()!;
    if (cur === to) break;
    for (const [a, b] of topo.links) {
      if (cut.has(lk(a, b))) continue;
      const nxt = a === cur ? b : b === cur ? a : null;
      if (!nxt || failed.has(nxt) || nxt in prev) continue;
      prev[nxt] = cur;
      q.push(nxt);
    }
  }
  if (!(to in prev)) return null;
  const path: string[] = [];
  for (let c: string | null = to; c; c = prev[c]) path.unshift(c);
  return path;
}

function components(topo: Topo, failed: Set<string>, cut: Set<string>) {
  const seen = new Set<string>();
  const comps: string[][] = [];
  for (const n of topo.nodes) {
    if (failed.has(n.id) || seen.has(n.id)) continue;
    const comp: string[] = [];
    const q = [n.id];
    seen.add(n.id);
    while (q.length) {
      const c = q.shift()!;
      comp.push(c);
      for (const [a, b] of topo.links) {
        if (cut.has(lk(a, b))) continue;
        const nx = a === c ? b : b === c ? a : null;
        if (nx && !failed.has(nx) && !seen.has(nx)) { seen.add(nx); q.push(nx); }
      }
    }
    comps.push(comp);
  }
  return comps;
}

export default function Lab16() {
  const [key, setKey] = useState<TKey>("star");
  const [failed, setFailed] = useState<string[]>([]);
  const [cut, setCut] = useState<string[]>([]);
  const [src, setSrc] = useState("p1");
  const [dst, setDst] = useState("p4");
  const [busy, setBusy] = useState(false);
  const [anim, setAnim] = useState<{ pts: Pt[]; ids: string[] } | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const { t, run } = useTween();

  const topo = build(key);
  const info = INFO[key];
  const devs = topo.nodes.filter((n) => n.kind === "dev");
  const F = new Set(failed);
  const C = new Set(cut);
  const s = devs.find((d) => d.id === src)?.id ?? devs[0].id;
  const d = devs.find((x) => x.id === dst && x.id !== s)?.id ?? devs.find((x) => x.id !== s)!.id;
  const node = (id: string) => topo.nodes.find((n) => n.id === id)!;

  const comps = components(topo, F, C);
  const aliveDevs = devs.filter((x) => !F.has(x.id));
  const devComps = comps.map((c) => c.filter((id) => node(id).kind === "dev").length).filter((n) => n > 0);
  const largest = Math.max(0, ...devComps);
  const splitCount = devComps.length;

  const change = (k: TKey) => {
    setKey(k);
    setFailed([]);
    setCut([]);
    setMsg(null);
    setAnim(null);
  };

  const toggleNode = (n: Node) => {
    if (busy || n.kind === "jn") return;
    setFailed((f) => (f.includes(n.id) ? f.filter((x) => x !== n.id) : [...f, n.id]));
    setMsg(null);
  };
  const toggleLink = (a: string, b: string) => {
    if (busy) return;
    const k = lk(a, b);
    setCut((c) => (c.includes(k) ? c.filter((x) => x !== k) : [...c, k]));
    setMsg(null);
  };

  const send = async () => {
    if (busy) return;
    const A = node(s);
    const B = node(d);
    if (F.has(s)) return setMsg({ ok: false, text: `${A.label} arızalı (kapalı); paket gönderemez.` });
    if (F.has(d)) return setMsg({ ok: false, text: `${B.label} arızalı; paket hedefe teslim edilemez.` });
    const path = bfs(topo, F, C, s, d);
    markLab(16);
    if (!path) {
      const comp = comps.find((c) => c.includes(s)) ?? [];
      setMsg({ ok: false, text: `Ulaşılamıyor! ${A.label} ile ${B.label} arasında çalışan bir yol kalmadı. ${A.label} yalnızca ${comp.filter((id) => node(id).kind === "dev").length} cihazlık bir parçada kaldı: ağ ${splitCount} parçaya bölünmüş durumda.` });
      return;
    }
    const direct = bfs(topo, new Set(), new Set(), s, d)!;
    const pts = path.map((id) => ({ x: node(id).x, y: node(id).y }));
    setBusy(true);
    setAnim({ pts, ids: path });
    setMsg(null);
    await run(Math.max(1200, path.length * 600));
    setAnim(null);
    setBusy(false);
    const hops = path.filter((id) => node(id).kind !== "jn").length - 1;
    const rerouted = path.length > direct.length;
    setMsg({ ok: true, text: `Paket ${A.label} → ${B.label} teslim edildi (${hops} atlama).${rerouted ? " Arıza nedeniyle paket alternatif, daha uzun bir yoldan gönderildi." : failed.length || cut.length ? " Arızalar bu yolu etkilemedi." : ""}` });
  };

  const onPath = (a: string, b: string) => !!anim && anim.ids.some((id, i) => i < anim.ids.length - 1 && lk(id, anim.ids[i + 1]) === lk(a, b));

  return (
    <LabBox title="Etkileşimli Ağ Topolojisi Oluşturucu">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(INFO) as TKey[]).map((k) => (
          <Btn key={k} variant={key === k ? "primary" : "ghost"} onClick={() => change(k)}>{INFO[k].en}</Btn>
        ))}
      </div>
      <p className="text-sm text-muted">Cihaza tıklayarak <b>arıza</b> oluştur, bağlantı çizgisine tıklayarak <b>kabloyu kes</b>. Sonra paket göndererek ne olduğunu izle.</p>
      <div className="overflow-x-auto rounded-xl border border-line bg-white">
        <svg viewBox="0 0 600 330" className="w-full" style={{ minWidth: 480 }}>
          {topo.links.map(([a, b]) => {
            const A = node(a);
            const B = node(b);
            const k = lk(a, b);
            const isCut = C.has(k);
            const dead = F.has(a) || F.has(b);
            return (
              <g key={k} className="cursor-pointer" onClick={() => toggleLink(a, b)}>
                <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="transparent" strokeWidth={18} />
                <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={isCut ? "#C65353" : dead ? "#DFE8ED" : onPath(a, b) ? "#D69A32" : "#176B87"} strokeWidth={onPath(a, b) ? 5 : key === "bus" && A.kind === "jn" && B.kind === "jn" ? 5 : 3} strokeDasharray={isCut ? "5 6" : undefined} />
                {isCut && <text x={(A.x + B.x) / 2} y={(A.y + B.y) / 2 + 5} textAnchor="middle" fontSize={16} fontWeight={800} fill="#C65353">✂</text>}
              </g>
            );
          })}
          {topo.nodes.map((n) => {
            if (n.kind === "jn") return <circle key={n.id} cx={n.x} cy={n.y} r={5} fill="#176B87" />;
            const dead = F.has(n.id);
            return (
              <g key={n.id} className="cursor-pointer" onClick={() => toggleNode(n)} role="button" aria-label={`${n.label} arızasını değiştir`}>
                <circle cx={n.x} cy={n.y} r={25} fill={dead ? "#F9ECEC" : n.id === s ? "#E8F3F7" : "#fff"} stroke={dead ? "#C65353" : n.id === s ? "#176B87" : n.id === d ? "#25845B" : "#DFE8ED"} strokeWidth={n.id === s || n.id === d ? 3 : 2} />
                <DeviceIcon kind={n.kind === "sw" ? "switch" : "pc"} x={n.x} y={n.y} size={30} color={dead ? "#C65353" : "#176B87"} dim={dead} />
                <text x={n.x} y={n.y + 41} textAnchor="middle" fontSize={11} fontWeight={700} fill={dead ? "#C65353" : "#172B3A"}>{n.label}{dead ? " ✖" : ""}</text>
              </g>
            );
          })}
          {anim && t !== null && (() => {
            const p = pointAt(anim.pts, t);
            return <g><circle cx={p.x} cy={p.y} r={9} fill="#D69A32" stroke="#fff" strokeWidth={2.5} /><text x={p.x} y={p.y + 3.5} textAnchor="middle" fontSize={8} fontWeight={800} fill="#fff">P</text></g>;
          })()}
        </svg>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
        <label className="text-sm font-semibold">Kaynak
          <select className="field mt-1" value={s} onChange={(e) => setSrc(e.target.value)}>{devs.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}</select>
        </label>
        <label className="text-sm font-semibold">Hedef
          <select className="field mt-1" value={d} onChange={(e) => setDst(e.target.value)}>{devs.filter((x) => x.id !== s).map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}</select>
        </label>
        <Btn onClick={send} disabled={busy}>📨 Paket Gönder</Btn>
        <Btn variant="ghost" onClick={() => { setFailed([]); setCut([]); setMsg(null); }} disabled={busy}>Arızaları Temizle</Btn>
      </div>
      {msg && <Callout kind={msg.ok ? "ok" : "err"} title={msg.ok ? "Teslim edildi" : "Sorun"}>{msg.text}</Callout>}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-white p-3"><p className="text-xs font-semibold text-muted">Çalışan cihaz</p><p className="text-xl font-bold">{aliveDevs.length}/{devs.length}</p></div>
        <div className="rounded-xl border border-line bg-white p-3"><p className="text-xs font-semibold text-muted">En büyük bağlı grup</p><p className="text-xl font-bold">{largest} cihaz</p></div>
        <div className={`rounded-xl border p-3 ${splitCount > 1 ? "border-err/40 bg-[#F9ECEC]" : "border-ok/40 bg-[#E9F5EF]"}`}><p className="text-xs font-semibold text-muted">Ağ durumu</p><p className={`text-xl font-bold ${splitCount > 1 ? "text-err" : "text-ok"}`}>{splitCount > 1 ? `${splitCount} parçaya bölündü` : "Bütün"}</p></div>
      </div>
      <div className="rounded-xl border border-brand/25 bg-soft p-4 text-sm">
        <h4 className="mb-1 font-bold">{info.name}</h4>
        <p className="mb-2">{info.desc}</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div><p className="font-semibold text-ok">Avantajlar</p><ul className="list-inside list-disc">{info.pros.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div><p className="font-semibold text-err">Dezavantajlar</p><ul className="list-inside list-disc">{info.cons.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div><p className="font-semibold text-brand">Kullanım alanı</p><p>{info.use}</p></div>
        </div>
      </div>
    </LabBox>
  );
}
