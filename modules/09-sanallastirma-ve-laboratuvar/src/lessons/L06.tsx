"use client";

import { useState } from "react";
import { LessonShell } from "@/components/LessonShell";
import { Callout, DataTable, InfoCards, ProgressBar, SectionTitle } from "@/components/ui";
import { markLab } from "@/lib/progress";

type VM = { network: "ok" | "broken"; packages: string[]; files: string[] };
type Snap = { id: number; name: string; state: VM; at: string };
const CLEAN: VM = { network: "ok", packages: ["temel-sistem"], files: ["notlar.txt"] };
const clone = (v: VM): VM => ({ network: v.network, packages: [...v.packages], files: [...v.files] });

function Topic() {
  return (
    <>
      <Callout kind="tip" title="Geri alma düğmesi">
        Bir hata yaptığında &quot;Keşke dün olduğum yere dönebilsem&quot; dersin ya. Snapshot tam olarak bunu sağlar. Clone ise makinenin ikizini çıkarır.
      </Callout>
      <SectionTitle kicker="Temel kavramlar" title="Snapshot ve Clone" />
      <InfoCards
        cols={2}
        items={[
          { icon: "📸", title: "Snapshot", body: "Sanal makinenin belirli bir andaki durumunu (disk ve istenirse bellek) kaydeder. Daha sonra bu ana geri dönebilirsin.", bullets: ["Aynı makine üzerinde çalışır", "Hızlı oluşturulur", "Yedek yerine geçmez"] },
          { icon: "👯", title: "Clone", body: "Makinenin bağımsız bir kopyasını oluşturur. Yeni, ayrı bir sanal makine ortaya çıkar.", bullets: ["Tam klon: bağımsız ve tam kopya", "Bağlantılı klon: ana diske bağlı, yer kazandırır"] },
          { icon: "⏱️", title: "Ne zaman snapshot alınmalı?", body: "Temiz kurulumdan sonra, büyük güncellemeden önce, riskli ayarlardan önce ve yeni bir araç denemeden önce." },
          { icon: "🔁", title: "Hatalı yapılandırma sonrası", body: "Ağ ayarı, paket kurulumu veya sistem dosyası bozulduysa snapshot'a dönerek temiz duruma ulaşırsın." },
        ]}
      />
      <DataTable
        head={["", "Snapshot", "Tam klon", "Bağlantılı klon"]}
        rows={[
          ["Sonuç", "Aynı makinenin dönüş noktası", "Yeni bağımsız makine", "Yeni makine, ana diske bağlı"],
          ["Disk alanı", "Yalnızca değişen kısımlar (zamanla artar)", "Ana diskin tamamı kadar yer", "Çok az yer; fark dosyası"],
          ["Ana makine silinirse", "Snapshot'lar da kaybolur", "Klon etkilenmez", "Klon çalışmayabilir"],
          ["Kullanım", "Hızlı geri dönüş", "Ayrı laboratuvar makinesi", "Hızlı, geçici test kopyası"],
        ]}
      />
      <Callout kind="warn" title="Önemli">
        Snapshot bir yedekleme değildir. Sanal disk dosyası bozulursa ya da silinirse snapshot'lar da gider. Önemli verileri ayrıca yedekle ve çok uzun snapshot zincirleri oluşturma.
      </Callout>
    </>
  );
}

function SnapshotLab() {
  const [vm, setVm] = useState<VM>(clone(CLEAN));
  const [snaps, setSnaps] = useState<Snap[]>([]);
  const [steps, setSteps] = useState({ clean: false, snap: false, change: false, fail: false, restore: false });
  const [name, setName] = useState("Temiz kurulum");
  const [log, setLog] = useState<string[]>(["Sanal makine hazır."]);
  const [pingOut, setPingOut] = useState<string | null>(null);
  const [changes, setChanges] = useState(0);
  const say = (m: string) => setLog((l) => [m, ...l].slice(0, 6));
  const size = 8 + snaps.length * 0.6 + changes * 0.5;

  const reset = () => {
    setVm(clone(CLEAN)); setSnaps([]); setChanges(0); setPingOut(null);
    setSteps({ clean: true, snap: false, change: false, fail: false, restore: false });
    say("Temiz sistem durumu oluşturuldu.");
  };
  const take = () => {
    const id = snaps.length + 1;
    setSnaps([...snaps, { id, name: name.trim() || `Snapshot ${id}`, state: clone(vm), at: new Date().toLocaleTimeString("tr-TR") }]);
    setSteps((s) => ({ ...s, snap: true }));
    say(`Snapshot alındı: "${name.trim() || `Snapshot ${id}`}".`);
  };
  const change = () => {
    if (vm.packages.includes("htop")) { say("Bu değişikliği zaten yaptın; başka bir değişiklik dene."); return; }
    setVm({ ...vm, packages: [...vm.packages, "htop"], files: [...vm.files, "deneme.conf"] });
    setChanges((c) => c + 1);
    setSteps((s) => ({ ...s, change: true }));
    say("Değişiklik: 'htop' paketi kuruldu ve deneme.conf oluşturuldu.");
  };
  const fail = () => {
    setVm({ ...vm, network: "broken" });
    setChanges((c) => c + 1);
    setSteps((s) => ({ ...s, fail: true }));
    say("Hata: ağ yapılandırması bozuldu (yanlış ayar yazıldı).");
  };
  const ping = () => setPingOut(vm.network === "ok" ? "ping -c 2 example.com\n64 bytes: icmp_seq=1 ttl=116 time=18 ms\n64 bytes: icmp_seq=2 ttl=116 time=17 ms\n→ Ağ çalışıyor." : "ping -c 2 example.com\nping: example.com: Temporary failure in name resolution\n→ Ağ çalışmıyor!");
  const restore = (s: Snap) => {
    const wasBroken = vm.network === "broken";
    setVm(clone(s.state));
    setChanges(0);
    setPingOut(null);
    say(`"${s.name}" snapshot'ına dönüldü. Snapshot sonrasındaki değişiklikler geri alındı.`);
    if (steps.fail && wasBroken) {
      setSteps((x) => ({ ...x, restore: true }));
      markLab("snapshot-ve-clone");
    }
  };

  const goals: [string, boolean][] = [
    ["Temiz sistem durumu oluştur", steps.clean],
    ["Snapshot al", steps.snap],
    ["Sistemde değişiklik yap", steps.change],
    ["Hata senaryosu oluştur", steps.fail],
    ["Snapshot'a geri dön", steps.restore],
  ];
  const next = goals.findIndex((g) => !g[1]);

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-5">
        {goals.map(([g, ok], i) => (
          <div key={g} className={`rounded-lg border px-2 py-2 text-center text-xs font-semibold ${ok ? "border-ag-ok/40 bg-[#edf8f2] text-ag-ok" : i === next ? "border-ag-warn bg-[#fff8e8] text-[#8a5f12]" : "border-ag-line bg-white text-ag-muted"}`}>
            {ok ? "✓" : i + 1} {g}
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card space-y-3">
          <h4 className="font-bold">Sanal makine durumu</h4>
          <div className="rounded-lg bg-[#0f2230] p-3 font-mono text-xs leading-relaxed text-[#cfe7ef]">
            <p>$ durum</p>
            <p>ağ: <span className={vm.network === "ok" ? "text-[#7fe0a8]" : "text-[#ff9a9a]"}>{vm.network === "ok" ? "çalışıyor" : "BOZUK"}</span></p>
            <p>paketler: {vm.packages.join(", ")}</p>
            <p>dosyalar: {vm.files.join(", ")}</p>
            {pingOut && <pre className="mt-2 whitespace-pre-wrap text-[#cfe7ef]">{pingOut}</pre>}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-sm" onClick={reset}>1. Temiz sistemi hazırla</button>
            <button type="button" className="btn btn-sm" onClick={change}>3. Değişiklik yap</button>
            <button type="button" className="btn btn-sm btn-warn" onClick={fail}>4. Hata oluştur</button>
            <button type="button" className="btn btn-sm" onClick={ping}>Ağ testi (ping)</button>
          </div>
          <div className="flex gap-2">
            <input className="field" value={name} onChange={(e) => setName(e.target.value)} aria-label="Snapshot adı" />
            <button type="button" className="btn btn-sm btn-primary whitespace-nowrap" onClick={take}>2. Snapshot al</button>
          </div>
          <p className="text-xs text-ag-muted">Önerilen sıra: {next === -1 ? "Tüm adımlar tamam!" : `${next + 1}. ${goals[next][0]}`}</p>
        </div>
        <div className="card space-y-3">
          <h4 className="font-bold">Snapshot ağacı</h4>
          <ul className="space-y-2 text-sm">
            <li className="rounded-lg border border-ag-line bg-ag-bg px-3 py-2">🟢 Şu anki durum {vm.network === "broken" && <span className="text-ag-err">(bozuk)</span>}</li>
            {snaps.length === 0 && <li className="text-ag-muted">Henüz snapshot yok.</li>}
            {[...snaps].reverse().map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-2 rounded-lg border border-ag-line px-3 py-2">
                <span>📸 {s.name} <span className="text-xs text-ag-muted">({s.at})</span></span>
                <button type="button" className="btn btn-sm" onClick={() => restore(s)}>5. Geri dön</button>
              </li>
            ))}
          </ul>
          <div>
            <p className="mb-1 text-xs font-semibold text-ag-muted">Tahmini disk kullanımı: {size.toFixed(1)} GB</p>
            <ProgressBar pct={(size / 20) * 100} tone={size > 14 ? "warn" : "brand"} />
          </div>
          <div className="rounded-lg bg-ag-bg p-3 text-xs text-ag-text">
            <p className="mb-1 font-bold">Olay günlüğü</p>
            {log.map((l, i) => <p key={i}>• {l}</p>)}
          </div>
        </div>
      </div>
      {steps.restore && <Callout kind="ok" title="Tebrikler!">Hatalı yapılandırmadan snapshot ile geri döndün. Ağ yeniden çalışıyor ve snapshot sonrasındaki değişiklikler (htop gibi) geri alındı.</Callout>}
    </div>
  );
}

function CloneViz() {
  const [mode, setMode] = useState<"full" | "linked">("full");
  const [parentGone, setParentGone] = useState(false);
  const [newMac, setNewMac] = useState(true);
  const parent = 20;
  const cloneSize = mode === "full" ? 20 : 1.2;
  const broken = mode === "linked" && parentGone;
  return (
    <div className="card space-y-4">
      <h4 className="font-bold">Clone neyi kopyalar?</h4>
      <div className="flex flex-wrap gap-2">
        {(["full", "linked"] as const).map((m) => (
          <button key={m} type="button" onClick={() => { setMode(m); setParentGone(false); }} className={`btn btn-sm ${mode === m ? "btn-primary" : ""}`}>
            {m === "full" ? "Tam klon (Full)" : "Bağlantılı klon (Linked)"}
          </button>
        ))}
        <button type="button" className="btn btn-sm btn-warn" onClick={() => setParentGone((v) => !v)}>{parentGone ? "Ana makineyi geri getir" : "Ana makineyi sil"}</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className={`rounded-xl border-2 p-4 ${parentGone ? "border-dashed border-ag-err bg-[#fdf0f0] opacity-70" : "border-ag-line"}`}>
          <p className="font-bold">🐉 Ana makine (Kali-Lab)</p>
          <p className="text-sm text-ag-muted">Disk: {parent} GB</p>
          <ProgressBar pct={100} />
          {parentGone && <p className="mt-2 text-xs font-semibold text-ag-err">Silindi</p>}
        </div>
        <div className={`rounded-xl border-2 p-4 ${broken ? "border-ag-err bg-[#fdf0f0]" : "border-ag-ok/50 bg-[#edf8f2]"}`}>
          <p className="font-bold">👯 Klon (Kali-Lab Clone)</p>
          <p className="text-sm text-ag-muted">Kendi disk alanı: {cloneSize} GB {mode === "linked" && "(yalnızca fark)"}</p>
          <ProgressBar pct={(cloneSize / parent) * 100} tone={mode === "full" ? "brand" : "ok"} />
          <p className={`mt-2 text-xs font-semibold ${broken ? "text-ag-err" : "text-ag-ok"}`}>{broken ? "✘ Çalışamaz: bağlı olduğu ana disk yok." : "✔ Çalışır durumda."}</p>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" className="accent-[#176B87]" checked={newMac} onChange={() => setNewMac((v) => !v)} />
        Ağ adaptörlerine yeni MAC adresi üret
      </label>
      <DataTable
        head={["Kopyalanan öğe", "Durum"]}
        rows={[
          ["Sanal disk içeriği", mode === "full" ? "Tamamen kopyalanır" : "Ana diske referans verilir; yalnızca yeni değişiklikler saklanır"],
          ["Makine yapılandırması (RAM, CPU, ağ)", "Kopyalanır; sonradan değiştirilebilir"],
          ["MAC adresi", newMac ? "Yeni adres üretilir (çakışma olmaz)" : "Aynı kalır – iki makineyi aynı ağda çalıştırırsan çakışma yaşanabilir"],
          ["Snapshot'lar", "Klonlama sihirbazında seçime bağlıdır (yalnızca mevcut durum / her şey)"],
        ]}
      />
      {!newMac && <Callout kind="warn" title="Dikkat">Aynı MAC adresi, aynı ağda iki makinenin karışmasına yol açabilir. Genelde yeni MAC üretmek daha güvenlidir.</Callout>}
    </div>
  );
}

function Lab() {
  return (
    <div className="space-y-6">
      <SectionTitle kicker="Etkileşimli uygulama" title="Snapshot simülasyonu">Sıradaki hedefi izleyerek temiz durum &gt; snapshot &gt; değişiklik &gt; hata &gt; geri dönüş akışını yaşa.</SectionTitle>
      <SnapshotLab />
      <SectionTitle title="Clone görselleştirmesi">Tam ve bağlantılı klonun disk kullanımını ve ana makinenin silinmesinin etkisini gör.</SectionTitle>
      <CloneViz />
    </div>
  );
}

export default function Lesson06() {
  return <LessonShell slug="snapshot-ve-clone" topic={<Topic />} lab={<Lab />} />;
}
