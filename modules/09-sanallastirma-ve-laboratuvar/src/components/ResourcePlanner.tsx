"use client";

import { useState } from "react";
import { ProgressBar } from "./ui";

type Plan = { name: string; ram: number; cpu: number; disk: number; note: string };

const PLANS: Plan[] = [
  { name: "Tek Kali VM (Xfce)", ram: 4, cpu: 2, disk: 40, note: "Kali dokümantasyonu genel VM'lerde 2 GB RAM ile başlar; 4 GB daha rahattır." },
  { name: "Tek Ubuntu Desktop VM", ram: 4, cpu: 2, disk: 40, note: "Ubuntu resmî rehberi en az 25 GB disk ister; masaüstü için 4 GB RAM uygundur." },
  { name: "İki VM'li laboratuvar (Kali + Ubuntu)", ram: 8, cpu: 4, disk: 80, note: "İki makine aynı anda açıkken toplam kaynak iki katına çıkar." },
  { name: "Üç VM'li laboratuvar", ram: 12, cpu: 6, disk: 120, note: "Daha büyük senaryolar için; host'u yavaşlatmamak adına en az 16 GB RAM düşün." },
];

export function ResourcePlanner() {
  const [ram, setRam] = useState(16);
  const [cores, setCores] = useState(8);
  const [disk, setDisk] = useState(256);
  const [arch, setArch] = useState<"x86" | "arm">("x86");
  const [ssd, setSsd] = useState(true);

  const usableRam = Math.max(0, ram - Math.max(4, ram * 0.4)); // host için pay bırak
  const usableCores = Math.max(0, cores - 2);
  const usableDisk = Math.max(0, disk - 30);

  const verdict = (p: Plan) => {
    const need = { ram: p.ram, cpu: p.cpu, disk: p.disk };
    const okRam = usableRam >= need.ram;
    const okCpu = usableCores >= need.cpu || cores >= need.cpu + 1;
    const okDisk = usableDisk >= need.disk;
    const tight = !okRam && ram - 4 >= need.ram * 0.75;
    if (okRam && okCpu && okDisk) return { tone: "ok" as const, label: "Rahat çalışır", text: "Kaynakların bu senaryo için yeterli görünüyor." };
    if ((okRam || tight) && okDisk && cores >= 2) return { tone: "warn" as const, label: "Çalışır ama sınırda", text: "Aynı anda başka ağır uygulama açma; VM'lere daha az RAM ver." };
    return { tone: "err" as const, label: "Önerilmez", text: "Bu senaryo için kaynakların yetersiz. Daha az VM veya daha hafif imaj düşün." };
  };
  const toneCls = { ok: "border-ag-ok/40 bg-[#edf8f2]", warn: "border-ag-warn/50 bg-[#fff8e8]", err: "border-ag-err/40 bg-[#fdf0f0]" };
  const toneTxt = { ok: "text-ag-ok", warn: "text-[#8a5f12]", err: "text-ag-err" };

  const num = (v: string, min: number, max: number) => Math.max(min, Math.min(max, Number(v) || min));

  return (
    <div className="card space-y-5">
      <div>
        <h3 className="text-lg font-bold text-ag-text">🧮 Kaynak planlama aracı</h3>
        <p className="text-sm text-ag-muted">Bilgisayarının değerlerini kendin gir. Araç hiçbir donanım bilgisini otomatik toplamaz ve sistem ayarlarına dokunmaz; yalnızca hesap yapar.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <label className="text-sm font-semibold">
          RAM (GB)
          <input className="field mt-1" type="number" min={2} max={256} value={ram} onChange={(e) => setRam(num(e.target.value, 2, 256))} />
        </label>
        <label className="text-sm font-semibold">
          CPU çekirdek sayısı
          <input className="field mt-1" type="number" min={1} max={64} value={cores} onChange={(e) => setCores(num(e.target.value, 1, 64))} />
        </label>
        <label className="text-sm font-semibold">
          Boş disk (GB)
          <input className="field mt-1" type="number" min={10} max={8000} value={disk} onChange={(e) => setDisk(num(e.target.value, 10, 8000))} />
        </label>
        <label className="text-sm font-semibold">
          İşlemci mimarisi
          <select className="field mt-1" value={arch} onChange={(e) => setArch(e.target.value as "x86" | "arm")}>
            <option value="x86">x86_64 (Intel / AMD)</option>
            <option value="arm">ARM64 (ör. Apple Silicon)</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Disk türü
          <select className="field mt-1" value={ssd ? "ssd" : "hdd"} onChange={(e) => setSsd(e.target.value === "ssd")}>
            <option value="ssd">SSD</option>
            <option value="hdd">HDD (mekanik)</option>
          </select>
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { l: "VM'lere ayrılabilecek RAM", v: `${usableRam.toFixed(1)} GB`, p: (usableRam / ram) * 100 },
          { l: "Ayrılabilecek çekirdek", v: `${usableCores}`, p: (usableCores / cores) * 100 },
          { l: "Kullanılabilir disk", v: `${usableDisk} GB`, p: (usableDisk / disk) * 100 },
        ].map((x) => (
          <div key={x.l} className="rounded-xl border border-ag-line bg-ag-bg p-3">
            <p className="text-xs text-ag-muted">{x.l}</p>
            <p className="my-1 text-xl font-extrabold text-ag-brand">{x.v}</p>
            <ProgressBar pct={x.p} />
          </div>
        ))}
      </div>
      <p className="text-xs text-ag-muted">Hesap mantığı: host işletim sistemi için en az 4 GB veya RAM'in %40'ı, 2 çekirdek ve 30 GB disk ayrı tutulur. Bunlar genel başlangıç kurallarıdır; zorunlu değildir.</p>

      <div className="grid gap-3 md:grid-cols-2">
        {PLANS.map((p) => {
          const v = verdict(p);
          return (
            <div key={p.name} className={`rounded-xl border p-4 ${toneCls[v.tone]}`}>
              <div className="mb-1 flex items-start justify-between gap-2">
                <p className="font-bold text-ag-text">{p.name}</p>
                <span className={`text-xs font-bold ${toneTxt[v.tone]}`}>{v.label}</span>
              </div>
              <p className="text-xs text-ag-muted">
                Gereken: {p.ram} GB RAM · {p.cpu} çekirdek · {p.disk} GB disk
              </p>
              <p className="mt-2 text-sm text-ag-text">{v.text}</p>
              <p className="mt-1 text-xs text-ag-muted">{p.note}</p>
            </div>
          );
        })}
      </div>
      {arch === "arm" && <p className="rounded-lg bg-ag-light p-3 text-sm text-ag-text">ARM64 işlemcide ARM64 imajlarına ihtiyacın var. x86_64 (amd64) ISO'ları doğrudan hızlandırılmış çalışmaz. Kali ve Ubuntu'nun ARM64 seçeneklerini resmî indirme sayfalarından kontrol et ve hypervisor'unun ARM desteğini doğrula.</p>}
      {!ssd && <p className="rounded-lg bg-[#fff8e8] p-3 text-sm text-[#8a5f12]">Mekanik disk (HDD) sanal makine açılışını ve kurulumu belirgin biçimde yavaşlatır. Mümkünse SSD kullan; yoksa tek VM ile ve hafif masaüstüyle çalış.</p>}
    </div>
  );
}
