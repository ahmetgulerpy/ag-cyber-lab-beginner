"use client";
import { useEffect, useRef, useState } from "react";
import { Callout, Pill } from "@/components/ui";

type Pr = { id: string; name: string; kind: "sys" | "app" | "svc" | "bad"; cpu: number; mem: number; io: number; gpu: number; leak?: number; desc: string };
const TOTAL_RAM = 8192, BASE_OS = 1100, DISK_TOTAL = 256, DISK_BASE = 38 + 62 + 48;
const BASE: Pr[] = [
  { id: "system", name: "System", kind: "sys", cpu: 1, mem: 300, io: 2, gpu: 0, desc: "Çekirdek süreci (kritik)." },
  { id: "explorer", name: "explorer.exe", kind: "app", cpu: 1.5, mem: 150, io: 1, gpu: 2, desc: "Masaüstü ve Dosya Gezgini." },
  { id: "chrome", name: "chrome.exe", kind: "app", cpu: 6, mem: 900, io: 3, gpu: 6, desc: "Web tarayıcısı." },
  { id: "defender", name: "MsMpEng.exe", kind: "svc", cpu: 2, mem: 280, io: 4, gpu: 0, desc: "Defender antimalware servisi." },
  { id: "code", name: "code.exe", kind: "app", cpu: 3, mem: 700, io: 2, gpu: 3, desc: "Kod düzenleyici." },
];
type Sc = { id: string; name: string; sym: string; goal: string; add: Pr[]; temp?: boolean };
const SCEN: Sc[] = [
  { id: "normal", name: "Normal durum", sym: "Sistem sağlıklı: kaynak kullanımı düşük ve dengeli. Bu, 'baseline' (temel çizgi) olarak bilinir.", goal: "Normal değerleri gözlemle.", add: [] },
  { id: "ram", name: "RAM tüketimi artan uygulama", sym: "rapor-motoru.exe her saniye bellek tüketimini artırıyor (bellek sızıntısı). RAM dolunca sistem swap kullanıp yavaşlar.", goal: "Grafikteki RAM çizgisini izle; RAM'e göre sıralayıp sızıntı yapan süreci bul ve sonlandır.", add: [{ id: "leak", name: "rapor-motoru.exe", kind: "bad", cpu: 4, mem: 400, io: 3, gpu: 0, leak: 260, desc: "Bellek sızıntısı olan hatalı uygulama." }] },
  { id: "cpu", name: "CPU kullanımını yükselten süreç", sym: "madenci.exe sürekli %85 CPU ve yüksek GPU kullanıyor. Kullanıcı bir şey yapmıyor ama bilgisayar ısınıyor.", goal: "CPU'ya göre sırala; tanımadığın, şüpheli süreci bul ve sonlandır (gerçekte: araştır, karantinaya al).", add: [{ id: "miner", name: "madenci.exe", kind: "bad", cpu: 84, mem: 220, io: 2, gpu: 80, desc: "Şüpheli: kripto para madencisi gibi davranıyor." }] },
  { id: "disk", name: "Depolama alanı azalan sistem", sym: "log-yazici.exe kontrolsüz log yazıyor; disk her saniye doluyor. Disk dolunca sistem ve uygulamalar hata verir.", goal: "Disk doluluk çubuğunu izle; 'Geçici/log dosyalarını temizle' ve sorunlu süreci sonlandır.", add: [{ id: "logger", name: "log-yazici.exe", kind: "bad", cpu: 6, mem: 120, io: 55, gpu: 0, desc: "Hızla log dosyası üreten hatalı süreç." }], temp: true },
  { id: "bg", name: "Gereksiz arka plan hizmetleri", sym: "Sekiz gereksiz arka plan hizmeti birlikte CPU ve RAM tüketiyor; hiçbiri tek başına büyük değil ama toplam yük yüksek.", goal: "Gereksiz hizmetleri sonlandır; hem performans artar hem saldırı yüzeyi azalır.", add: ["OneSync", "IndexerHelper", "UpdateAgent", "CloudSyncSvc", "TelemetrySvc", "ToolbarSvc", "AdBroker", "PrintHelper"].map((n, i) => ({ id: `bg${i}`, name: `${n}.exe`, kind: "svc" as const, cpu: 8 + (i % 3) * 2, mem: 380 + (i % 4) * 60, io: 3, gpu: 0, desc: "Gereksiz arka plan hizmeti." })) },
  { id: "slow", name: "Kaynak tüketimi nedeniyle yavaşlayan bilgisayar", sym: "Bir bellek sızıntısı, bir şüpheli CPU tüketicisi ve birkaç gereksiz hizmet birlikte sistemi yavaşlatıyor.", goal: "Önce hangi kaynağın dolduğunu bul (CPU/RAM/disk), sonra en büyük tüketicileri sırayla temizle.", add: [{ id: "leak2", name: "ajan-servisi.exe", kind: "bad", cpu: 3, mem: 500, io: 3, gpu: 0, leak: 150, desc: "Yavaş yavaş bellek sızdıran servis." }, { id: "hog", name: "hesaplayici.exe", kind: "bad", cpu: 62, mem: 300, io: 2, gpu: 20, desc: "Sonsuz döngüde çalışan program." }, ...["OneSync", "UpdateAgent", "AdBroker"].map((n, i) => ({ id: `s${i}`, name: `${n}.exe`, kind: "svc" as const, cpu: 6, mem: 420, io: 3, gpu: 0, desc: "Gereksiz arka plan hizmeti." }))] },
];

function Chart({ data, label, unit = "%", warn = 85 }: { data: number[]; label: string; unit?: string; warn?: number }) {
  const pts = data.map((v, i) => `${(i / 59) * 100},${100 - Math.min(100, v)}`).join(" ");
  const last = data[data.length - 1] ?? 0;
  const hot = last >= warn;
  return (
    <div className="rounded-xl border border-line p-2">
      <div className="flex items-center justify-between text-xs"><b>{label}</b><span className={`font-bold ${hot ? "text-bad" : "text-brand"}`}>{last.toFixed(0)}{unit}</span></div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-1 h-20 w-full rounded bg-bg">
        {[25, 50, 75].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="#DFE8ED" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />)}
        {data.length > 1 && <polyline points={pts} fill="none" stroke={hot ? "#C65353" : "#176B87"} strokeWidth="2" vectorEffect="non-scaling-stroke" />}
      </svg>
    </div>
  );
}

export default function Lab14({ done }: { done: (id: string) => void }) {
  const [procs, setProcs] = useState<Pr[]>(BASE);
  const [temp, setTemp] = useState(4);
  const [scen, setScen] = useState("normal");
  const [t, setT] = useState(0);
  const [hist, setHist] = useState<{ cpu: number[]; ram: number[]; io: number[]; gpu: number[] }>({ cpu: [], ram: [], io: [], gpu: [] });
  const [sort, setSort] = useState<"cpu" | "mem">("cpu");
  const [used, setUsed] = useState<string[]>([]);
  const [sorted, setSorted] = useState<string[]>(["cpu"]);
  const [acted, setActed] = useState(false);
  const [solved, setSolved] = useState<string | null>(null);
  const scRef = useRef("normal");
  const diskRef = useRef(false);

  useEffect(() => {
    const iv = setInterval(() => {
      setT((x) => x + 1);
      setProcs((ps) => ps.map((p) => (p.leak ? { ...p, mem: Math.min(p.mem + p.leak, 5200) } : p)));
      if (diskRef.current) setTemp((v) => Math.min(v + 3.2, DISK_TOTAL - DISK_BASE));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const noise = (k: number) => Math.sin(t * 1.9 + k) * 1.8;
  const cpu = Math.max(1, Math.min(100, 3 + procs.reduce((s, p) => s + p.cpu, 0) + noise(1)));
  const ramUsed = BASE_OS + procs.reduce((s, p) => s + p.mem, 0);
  const ram = Math.min(100, (ramUsed / TOTAL_RAM) * 100);
  const diskUsedGB = DISK_BASE + temp;
  const diskPct = (diskUsedGB / DISK_TOTAL) * 100;
  const io = Math.min(100, 4 + procs.reduce((s, p) => s + p.io, 0) + (ram > 92 ? 45 : 0) + Math.abs(noise(3)));
  const gpu = Math.min(100, 2 + procs.reduce((s, p) => s + p.gpu, 0) + Math.abs(noise(5)));
  const slow = cpu > 85 || ram > 92 || diskPct > 95;
  const medium = cpu > 65 || ram > 80 || diskPct > 88;
  const healthy = cpu < 55 && ram < 70 && diskPct < 80;

  useEffect(() => {
    setHist((h) => ({ cpu: [...h.cpu, cpu].slice(-60), ram: [...h.ram, ram].slice(-60), io: [...h.io, io].slice(-60), gpu: [...h.gpu, gpu].slice(-60) }));
    if (t >= 10) done("watch");
    if (scRef.current !== "normal" && acted && healthy && solved !== scRef.current) { setSolved(scRef.current); done("fix"); }
  }, [t]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = (s: Sc) => {
    setProcs([...BASE, ...s.add.map((p) => ({ ...p }))]);
    setTemp(4); setScen(s.id); scRef.current = s.id; diskRef.current = !!s.temp; setActed(false); setSolved(null);
    if (s.id !== "normal") setUsed((u) => { const n = u.includes(s.id) ? u : [...u, s.id]; if (n.length >= 2) done("sc2"); return n; });
  };
  const kill = (id: string) => { setProcs((ps) => ps.filter((p) => p.id !== id)); if (id === "logger") diskRef.current = false; setActed(true); };
  const clean = () => { setTemp(4); diskRef.current = false; setProcs((ps) => ps.filter((p) => p.id !== "logger")); setActed(true); };
  const sc = SCEN.find((s) => s.id === scen)!;
  const list = [...procs].sort((a, b) => b[sort] - a[sort]);
  const setS = (k: "cpu" | "mem") => { setSort(k); setSorted((s) => { const n = s.includes(k) ? s : [...s, k]; if (n.length >= 2) done("sort"); return n; }); };
  const seg = (gb: number, c: string, l: string) => <div key={l} title={`${l}: ${gb.toFixed(0)} GB`} style={{ width: `${(gb / DISK_TOTAL) * 100}%`, background: c }} className="h-full" />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">{SCEN.map((s) => <button key={s.id} className={`btn btn-sm ${scen === s.id ? "btn-on" : ""}`} onClick={() => start(s)}>{s.name}{used.includes(s.id) ? " ✓" : ""}</button>)}</div>
      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
        <Callout type={scen === "normal" ? "info" : "warn"} title={sc.name}><p>{sc.sym}</p><p className="mt-1 text-xs text-muted">🎯 {sc.goal}</p></Callout>
        <div className="rounded-xl border border-line p-3 text-center text-sm"><p className="text-xs text-muted">Sistem yanıt hızı</p><p className={`text-lg font-extrabold ${slow ? "text-bad" : medium ? "text-warn" : "text-ok"}`}>{slow ? "Çok yavaş" : medium ? "Yavaşlıyor" : "Akıcı"}</p></div>
      </div>
      {solved && <Callout type="tip" title="Sorun çözüldü! ✓">Kaynak kullanımı sağlıklı seviyeye döndü. Ne yaptığını düşün: hangi kaynak doluydu, hangi süreç sebepti, nasıl müdahale ettin? Aynı mantık gerçek sistemlerde de geçerlidir.</Callout>}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Chart data={hist.cpu} label="CPU" />
        <Chart data={hist.ram} label={`RAM (${Math.round(ramUsed)} / ${TOTAL_RAM} MB)`} warn={90} />
        <Chart data={hist.io} label="Disk G/Ç" />
        <Chart data={hist.gpu} label="GPU" />
      </div>

      <div className="rounded-xl border border-line p-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm"><b>Depolama: {diskUsedGB.toFixed(0)} / {DISK_TOTAL} GB (%{diskPct.toFixed(0)})</b>
          <button className="btn btn-sm" onClick={clean}>🧹 Geçici/log dosyalarını temizle</button></div>
        <div className="mt-2 flex h-5 overflow-hidden rounded-full bg-soft">{seg(38, "#176B87", "Sistem")}{seg(62, "#38A3A5", "Uygulamalar")}{seg(48, "#8FCFD8", "Kullanıcı dosyaları")}{seg(temp, diskPct > 92 ? "#C65353" : "#D69A32", "Geçici/log")}</div>
        <p className="mt-1 text-xs text-muted">■ Sistem 38 GB • ■ Uygulamalar 62 GB • ■ Kullanıcı 48 GB • ■ Geçici/log {temp.toFixed(0)} GB • Boş {(DISK_TOTAL - diskUsedGB).toFixed(0)} GB{diskPct > 92 ? " — ⚠ Disk neredeyse dolu!" : ""}</p>
      </div>

      <div className="rounded-xl border border-line">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-bg px-3 py-2 text-sm"><b>Süreçler (sanal Görev Yöneticisi / top)</b>
          <span className="flex items-center gap-1.5 text-xs">Sırala: <button className={`btn btn-sm ${sort === "cpu" ? "btn-on" : ""}`} onClick={() => setS("cpu")}>CPU</button><button className={`btn btn-sm ${sort === "mem" ? "btn-on" : ""}`} onClick={() => setS("mem")}>RAM</button></span></div>
        <div className="scroll-x"><table className="tbl min-w-[520px]"><thead><tr><th>Süreç</th><th>CPU %</th><th>RAM (MB)</th><th>GPU %</th><th>Not</th><th></th></tr></thead><tbody>
          {list.map((p) => (
            <tr key={p.id}><td className="font-semibold">{p.name} {p.kind === "bad" && <Pill tone="bad">şüpheli</Pill>}</td><td>{p.cpu.toFixed(0)}</td><td>{Math.round(p.mem)}</td><td>{p.gpu}</td><td className="text-xs text-muted">{p.desc}</td>
              <td>{p.kind === "sys" ? <span className="text-xs text-muted">kritik</span> : <button className="btn btn-sm btn-danger" onClick={() => kill(p.id)}>Sonlandır</button>}</td></tr>
          ))}
        </tbody></table></div>
      </div>
      <p className="text-xs text-muted">Tüm değerler simülasyondur; gerçek sistem kaynakların etkilenmez. Linux eşdeğerleri: <span className="mono">top</span>, <span className="mono">free -h</span>, <span className="mono">df -h</span>.</p>
    </div>
  );
}
