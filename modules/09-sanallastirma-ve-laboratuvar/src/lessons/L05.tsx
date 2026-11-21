"use client";

import Link from "next/link";
import { useState } from "react";
import { LessonShell } from "@/components/LessonShell";
import { InstallGuide } from "@/components/InstallGuide";
import { Callout, DataTable, InfoCards, ProgressBar, SectionTitle } from "@/components/ui";
import { GUIDES } from "@/content/guides";
import { markLab } from "@/lib/progress";

type Profile = { label: string; icon: string; ram: [number, number]; cpu: [number, number]; disk: [number, number]; count: number; use: string };
const PROFILES: Record<string, Profile> = {
  kali: { label: "Tek Kali Linux VM", icon: "🐉", ram: [2048, 4096], cpu: [1, 2], disk: [25, 60], count: 1, use: "Güvenlik araçlarını yetkili laboratuvarda denemek" },
  ubuntu: { label: "Tek Ubuntu Desktop VM", icon: "🐧", ram: [4096, 4096], cpu: [2, 2], disk: [25, 40], count: 1, use: "Genel Linux öğrenme ve hedef makine" },
  lab2: { label: "Kali + Ubuntu laboratuvarı (2 VM aynı anda)", icon: "🧪", ram: [2048, 4096], cpu: [1, 2], disk: [30, 50], count: 2, use: "Kali ile hedef Ubuntu'yu aynı anda çalıştırmak (VM başına değerler)" },
  light: { label: "Hafif terminal tabanlı VM", icon: "🪶", ram: [1024, 2048], cpu: [1, 2], disk: [10, 20], count: 1, use: "Düşük donanımda komut satırı pratiği" },
};

type Tone = "ok" | "warn" | "err";
type Finding = { tone: Tone; text: string };

function evaluate(pk: string, host: { ram: number; cores: number; disk: number }, vm: { ram: number; cpu: number; disk: number }) {
  const p = PROFILES[pk];
  const f: Finding[] = [];
  const totalRam = (vm.ram * p.count) / 1024;
  const left = host.ram - totalRam;
  if (vm.ram < p.ram[0]) f.push({ tone: "err", text: `RAM yetersiz: bu senaryo için en az ${p.ram[0]} MB gerekir. Sanal makine çok yavaş çalışır ya da kurulum takılabilir.` });
  else if (vm.ram < p.ram[1]) f.push({ tone: "warn", text: `RAM asgari düzeyde: çalışır ama yavaş olabilir. Önerilen: ${p.ram[1]} MB.` });
  else f.push({ tone: "ok", text: "RAM önerilen düzeyde." });
  if (left < 2) f.push({ tone: "err", text: `Host'ta yalnızca ${Math.max(0, left).toFixed(1)} GB RAM kalıyor. Host işletim sistemi donabilir; RAM'i düşür.` });
  else if (left < 4 || left < host.ram * 0.3) f.push({ tone: "warn", text: `Host'ta ${left.toFixed(1)} GB RAM kalıyor. Tarayıcı ve diğer uygulamalarla birlikte sistem sınırda çalışabilir.` });
  else f.push({ tone: "ok", text: `Host'ta ${left.toFixed(1)} GB RAM kalıyor; yeterli pay var.` });
  const totalCpu = vm.cpu * p.count;
  if (totalCpu > host.cores) f.push({ tone: "err", text: `Toplam sanal CPU (${totalCpu}) fiziksel çekirdekten (${host.cores}) fazla. Host ve VM yavaşlar.` });
  else if (totalCpu > host.cores / 2 && host.cores > 2) f.push({ tone: "warn", text: `Çekirdeklerin yarısından fazlasını ayırdın (${totalCpu}/${host.cores}). Ağır işlerde host yavaşlayabilir.` });
  else if (vm.cpu < p.cpu[1]) f.push({ tone: "warn", text: `CPU ${vm.cpu} çekirdek: çalışır; rahatlık için ${p.cpu[1]} çekirdek önerilir.` });
  else f.push({ tone: "ok", text: "CPU dengeli." });
  const totalDisk = vm.disk * p.count;
  if (vm.disk < p.disk[0]) f.push({ tone: "err", text: `Disk yetersiz: en az ${p.disk[0]} GB gerekir. Kurulum başarısız olabilir.` });
  else if (totalDisk > host.disk - 20) f.push({ tone: "err", text: "Sanal diskler host'un boş alanını doldurabilir; dinamik disk büyüdükçe host diski dolar." });
  else if (vm.disk < p.disk[1]) f.push({ tone: "warn", text: `Disk asgari düzeyde. Güncellemeler ve araçlar için ${p.disk[1]} GB daha rahattır.` });
  else f.push({ tone: "ok", text: "Disk yeterli." });
  const worst: Tone = f.some((x) => x.tone === "err") ? "err" : f.some((x) => x.tone === "warn") ? "warn" : "ok";
  return { f, worst, left, p };
}

function Topic() {
  return (
    <>
      <Callout kind="tip" title="Şimdi kendi ilk sanal makinemizi oluşturalım">
        Bu derste önce kavramları kısaca görüp sonra &quot;Kurulum Rehberi&quot; sekmesinde adım adım ilerleyeceksin. &quot;Uygulama&quot; sekmesindeki sihirbaz da seçtiğin RAM, CPU ve disk değerlerinin senin bilgisayarına uygun olup olmadığını hesaplar. Bu araç gerçek ayarlarına dokunmaz.
      </Callout>
      <SectionTitle kicker="Temel bilgiler" title="Sanal makine ayarları ne anlama geliyor?" />
      <InfoCards
        items={[
          { icon: "🏷️", title: "İsim", body: "Makineyi tanımanı sağlar (örn. Kali-Lab). Dosya adlarında da kullanılır." },
          { icon: "🧬", title: "İşletim sistemi türü", body: "Linux + Debian/Ubuntu (64-bit) gibi bir seçim, hypervisor'a hangi sanal donanımı sunacağını söyler. 64-bit ISO için 64-bit seç." },
          { icon: "💿", title: "ISO dosyası", body: "Kurulum medyasının dosya hali. Sanal DVD sürücüsüne takılı gibi davranır." },
          { icon: "🧠", title: "RAM", body: "Host'un belleğinden ayrılır. Başlangıç: Kali için 2–4 GB, Ubuntu için 4 GB." },
          { icon: "⚙️", title: "CPU çekirdeği", body: "Başlangıç için 2 çekirdek çoğu laboratuvar için yeterlidir." },
          { icon: "💾", title: "Sanal disk", body: "Dinamik disk kullandıkça büyür; sabit disk baştan yer ayırır. Kapasiteyi ileride büyütmek mümkündür ama küçültmek zordur." },
        ]}
      />
      <DataTable
        head={["Senaryo", "RAM (min → önerilen)", "CPU", "Disk"]}
        rows={[
          ["Kali (Xfce)", "2 GB → 4 GB", "1–2", "25 GB → 40–80 GB"],
          ["Ubuntu Desktop", "4 GB", "2", "25 GB → 40 GB"],
          ["Hafif terminal VM", "1 GB → 2 GB", "1", "10–20 GB"],
          ["Kali + Ubuntu aynı anda", "Toplam 6–8 GB", "Toplam 3–4", "Toplam 65–100 GB"],
        ]}
      />
      <p className="text-xs text-ag-muted">Değerler Kali ve Ubuntu'nun resmî rehberlerindeki başlangıç önerilerine dayanır; kesin gereksinimler sürümlere göre değişebilir. Tek bir yapılandırma herkes için zorunlu değildir.</p>
      <Callout kind="warn" title="Yanlış ayarın bedeli">
        Çok az RAM: sistem yavaşlar. Çok fazla RAM: host donar. Disk çok küçük: kurulum başarısız olur. Bu yüzden ayarları sihirbazda önce dene, sonra gerçekte uygula.
      </Callout>
    </>
  );
}

const STEPS = ["Senaryo", "Host bilgisi", "RAM", "CPU", "Disk", "Sonuç"];

function Lab() {
  const [step, setStep] = useState(0);
  const [pk, setPk] = useState("kali");
  const [host, setHost] = useState({ ram: 16, cores: 8, disk: 256 });
  const [vm, setVm] = useState({ ram: 4096, cpu: 2, disk: 40 });
  const num = (v: string, a: number, b: number) => Math.max(a, Math.min(b, Number(v) || a));
  const res = evaluate(pk, host, vm);
  const toneCls = { ok: "border-ag-ok/40 bg-[#edf8f2] text-ag-ok", warn: "border-ag-warn/50 bg-[#fff8e8] text-[#8a5f12]", err: "border-ag-err/40 bg-[#fdf0f0] text-ag-err" };
  const icon = { ok: "✔", warn: "⚠", err: "✘" };
  const go = (n: number) => {
    setStep(n);
    if (n === 5) markLab("sanal-makine-kurulumu");
  };
  return (
    <div className="space-y-6">
      <SectionTitle kicker="Etkileşimli uygulama" title="Sanal makine sihirbazı">Adımları sırayla izle. Seçimlerine göre önerilen kaynakları, uyarıları ve host üzerindeki etkileri göreceksin.</SectionTitle>
      <ol className="grid grid-cols-3 gap-1 sm:grid-cols-6">
        {STEPS.map((s, i) => (
          <li key={s}>
            <button type="button" onClick={() => go(i)} className={`w-full rounded-lg border px-2 py-2 text-xs font-bold ${i === step ? "border-ag-brand bg-ag-brand text-white" : i < step ? "border-ag-ok/40 bg-[#edf8f2] text-ag-ok" : "border-ag-line bg-white text-ag-muted"}`}>
              {i + 1}. {s}
            </button>
          </li>
        ))}
      </ol>

      <div className="card space-y-4">
        {step === 0 && (
          <>
            <h3 className="font-bold">Ne tür bir sanal makine kuracaksın?</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(PROFILES).map(([k, p]) => (
                <button key={k} type="button" onClick={() => { setPk(k); setVm({ ram: p.ram[1], cpu: p.cpu[1], disk: p.disk[1] }); }} className={`rounded-xl border-2 p-4 text-left ${pk === k ? "border-ag-brand bg-ag-light" : "border-ag-line bg-white hover:border-ag-accent"}`}>
                  <p className="text-lg">{p.icon} <span className="text-sm font-bold">{p.label}</span></p>
                  <p className="mt-1 text-xs text-ag-muted">{p.use}</p>
                  <p className="mt-1 text-xs text-ag-text">Önerilen: {p.ram[1]} MB RAM · {p.cpu[1]} CPU · {p.disk[1]} GB disk</p>
                </button>
              ))}
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <h3 className="font-bold">Bilgisayarının değerlerini gir</h3>
            <p className="text-sm text-ag-muted">Bu bilgileri kendin yazarsın; platform bilgisayarından hiçbir veri okumaz. Windows'ta Görev Yöneticisi &gt; Performans, macOS'ta Bu Mac Hakkında bölümüne bakabilirsin.</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="text-sm font-semibold">Toplam RAM (GB)<input className="field mt-1" type="number" value={host.ram} min={2} max={256} onChange={(e) => setHost({ ...host, ram: num(e.target.value, 2, 256) })} /></label>
              <label className="text-sm font-semibold">CPU çekirdek sayısı<input className="field mt-1" type="number" value={host.cores} min={1} max={64} onChange={(e) => setHost({ ...host, cores: num(e.target.value, 1, 64) })} /></label>
              <label className="text-sm font-semibold">Boş disk (GB)<input className="field mt-1" type="number" value={host.disk} min={10} max={8000} onChange={(e) => setHost({ ...host, disk: num(e.target.value, 10, 8000) })} /></label>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h3 className="font-bold">Sanal makineye ne kadar RAM verelim?</h3>
            <label className="block text-sm font-semibold">
              {vm.ram} MB ({(vm.ram / 1024).toFixed(1)} GB)
              <input type="range" min={512} max={Math.max(1024, host.ram * 1024)} step={512} value={vm.ram} onChange={(e) => setVm({ ...vm, ram: Number(e.target.value) })} className="mt-2 w-full accent-[#176B87]" />
            </label>
            <ProgressBar pct={((vm.ram * PROFILES[pk].count) / 1024 / host.ram) * 100} tone={res.left < 2 ? "err" : res.left < 4 ? "warn" : "ok"} />
            <p className="text-xs text-ag-muted">Toplam host RAM'inin kullanılan payı. Host'ta {res.left.toFixed(1)} GB kalır.</p>
          </>
        )}
        {step === 3 && (
          <>
            <h3 className="font-bold">Kaç CPU çekirdeği?</h3>
            <label className="block text-sm font-semibold">
              {vm.cpu} çekirdek
              <input type="range" min={1} max={Math.max(1, host.cores)} value={vm.cpu} onChange={(e) => setVm({ ...vm, cpu: Number(e.target.value) })} className="mt-2 w-full accent-[#176B87]" />
            </label>
            <p className="text-xs text-ag-muted">Fiziksel çekirdek sayından fazla vermek performansı düşürür.</p>
          </>
        )}
        {step === 4 && (
          <>
            <h3 className="font-bold">Sanal disk kapasitesi</h3>
            <label className="block text-sm font-semibold">
              {vm.disk} GB (dinamik)
              <input type="range" min={8} max={Math.max(20, Math.min(500, host.disk))} step={1} value={vm.disk} onChange={(e) => setVm({ ...vm, disk: Number(e.target.value) })} className="mt-2 w-full accent-[#176B87]" />
            </label>
            <p className="text-xs text-ag-muted">Dinamik disk kullandıkça büyür; ama üst sınırı host diskinde boş yer olmalı.</p>
          </>
        )}
        {step === 5 && (
          <>
            <div className={`rounded-xl border p-4 ${toneCls[res.worst]}`}>
              <p className="text-lg font-extrabold">{res.worst === "ok" ? "Uygun yapılandırma" : res.worst === "warn" ? "Sınırda yapılandırma" : "Önerilmeyen yapılandırma"}</p>
              <p className="text-sm text-ag-text">{res.p.label} · Seçimin: {vm.ram} MB RAM, {vm.cpu} CPU, {vm.disk} GB disk (VM sayısı: {res.p.count})</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-2 text-sm font-bold text-ag-brand">Öneri ve uyarılar</h4>
                <ul className="space-y-2">
                  {res.f.map((x) => (
                    <li key={x.text} className={`rounded-lg border px-3 py-2 text-sm ${toneCls[x.tone]}`}>
                      <span className="font-bold">{icon[x.tone]}</span> <span className="text-ag-text">{x.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2 text-sm">
                <h4 className="text-sm font-bold text-ag-brand">Host üzerindeki olası etkiler</h4>
                <ul className="list-disc space-y-1 pl-5 text-ag-text">
                  <li>Çalışırken host RAM'inden ~{((vm.ram * res.p.count) / 1024).toFixed(1)} GB kullanılır.</li>
                  <li>~{vm.cpu * res.p.count} çekirdek VM'e zaman ayırır.</li>
                  <li>Disk dosyası host diskinde en çok {vm.disk * res.p.count} GB'a kadar büyüyebilir.</li>
                </ul>
                <h4 className="pt-2 text-sm font-bold text-ag-brand">Senaryoya uygunluk</h4>
                <p className="text-ag-text">{res.worst === "ok" ? `${res.p.use} için rahat bir yapılandırma.` : res.worst === "warn" ? `${res.p.use} mümkün; ancak performans düşebilir.` : `${res.p.use} için bu ayarlar uygun değil; kaynakları düzelt.`}</p>
              </div>
            </div>
            <p className="text-xs text-ag-muted">Bu sihirbaz yalnızca hesap yapar; bilgisayarının hiçbir ayarını değiştirmez. Değerleri VirtualBox/VMware'de sen girersin. Daha fazla ayrıntı için <Link className="font-semibold text-ag-brand underline" href="/donanim">Donanım Rehberi ve kaynak planlama aracı</Link>.</p>
          </>
        )}
        <div className="flex justify-between border-t border-ag-line pt-3">
          <button type="button" className="btn btn-sm" disabled={step === 0} onClick={() => go(step - 1)}>← Geri</button>
          <button type="button" className="btn btn-sm btn-primary" disabled={step === 5} onClick={() => go(step + 1)}>İleri →</button>
        </div>
      </div>
    </div>
  );
}

export default function Lesson05() {
  return <LessonShell slug="sanal-makine-kurulumu" topic={<Topic />} lab={<Lab />} extra={[{ id: "guide", label: "🧭 Kurulum Rehberi", content: <InstallGuide guide={GUIDES["vm-create"]} /> }]} />;
}
