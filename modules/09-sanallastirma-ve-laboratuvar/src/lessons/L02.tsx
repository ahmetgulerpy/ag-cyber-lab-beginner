"use client";

import { useState } from "react";
import { LessonShell } from "@/components/LessonShell";
import { Callout, DataTable, InfoCards, SectionTitle } from "@/components/ui";
import { markLab } from "@/lib/progress";

const LAYERS: Record<string, { label: string; text: string; tone: string }> = {
  "1-hw": { label: "Fiziksel donanım", tone: "bg-slate-200", text: "Type 1'de hypervisor doğrudan bu donanımın üzerinde çalışır; CPU, RAM, disk ve ağ kartına kendisi erişir." },
  "1-hyp": { label: "Type 1 hypervisor", tone: "bg-ag-brand text-white", text: "Genel amaçlı bir işletim sistemi olmadan doğrudan donanımda çalışır. Daha az katman olduğu için sunucu ortamlarında verimlidir. Örnekler: VMware ESXi, Microsoft Hyper-V." },
  "1-vm": { label: "Sanal makineler", tone: "bg-ag-light", text: "Hypervisor tarafından oluşturulan guest sistemler. Veri merkezlerinde onlarca VM aynı sunucuda çalışabilir." },
  "1-mgmt": { label: "Yönetim arayüzü", tone: "bg-white", text: "Type 1 sunucular genellikle ağdan başka bir bilgisayarla yönetilir. Gündelik kullanıcı masaüstü gibi kullanılmaz." },
  "2-hw": { label: "Fiziksel donanım", tone: "bg-slate-200", text: "Type 2'de donanımı doğrudan host işletim sistemi yönetir; hypervisor onun sağladığı imkânları kullanır." },
  "2-os": { label: "Host işletim sistemi", tone: "bg-[#b9d9e4]", text: "Windows, macOS veya Linux. Hem günlük işlerini yaptığın sistem hem de hypervisor'un çalıştığı zemin." },
  "2-hyp": { label: "Type 2 hypervisor uygulaması", tone: "bg-ag-accent text-white", text: "Normal bir uygulama gibi kurulur ve açılır. VirtualBox ve VMware Workstation örnekleridir. Kurulumu kolay olduğu için eğitimde yaygındır." },
  "2-vm": { label: "Sanal makineler", tone: "bg-ag-light", text: "Kali ve Ubuntu gibi guest sistemler. Host işletim sistemiyle kaynak paylaştıkları için kaynak yönetimine dikkat etmek gerekir." },
};

const PRODUCTS = [
  { n: "VirtualBox", t: 2, why: "Windows/macOS/Linux üzerinde uygulama olarak kurulur." },
  { n: "VMware Workstation Pro", t: 2, why: "Windows veya Linux host üzerinde çalışan masaüstü hypervisor'dur." },
  { n: "VMware ESXi", t: 1, why: "Doğrudan sunucu donanımına kurulan hypervisor'dur." },
  { n: "Microsoft Hyper-V", t: 1, why: "Hypervisor doğrudan donanımda çalışır; Windows yönetim katmanı olarak onun üstünde bir sanal bölümde yer alır." },
];

function Topic() {
  return (
    <>
      <Callout kind="tip" title="Sorunun cevabı basit">
        Hypervisor, sanal makinelerin &quot;yöneticisi&quot;dir. Hangi sanal makine ne kadar CPU, RAM ve disk kullanacak, kim ağa nasıl bağlanacak; hepsini o ayarlar.
      </Callout>
      <SectionTitle kicker="Temel kavramlar" title="Hypervisor ve iki türü" />
      <InfoCards
        cols={2}
        items={[
          { icon: "🧩", title: "Hypervisor nedir?", body: "Sanal makineleri oluşturan, çalıştıran ve donanım kaynaklarını onlara paylaştıran yazılım katmanı." },
          { icon: "🏢", title: "Type 1 (bare-metal)", body: "Doğrudan donanımda çalışır. Sunucu ve veri merkezlerinde yaygındır.", bullets: ["Yüksek verimlilik", "Genelde sunucu odaklı", "Örn: VMware ESXi, Hyper-V"] },
          { icon: "💻", title: "Type 2 (hosted)", body: "Bir işletim sisteminin üzerinde uygulama olarak çalışır. Masaüstü ve eğitimde yaygındır.", bullets: ["Kurulumu kolay", "Günlük bilgisayarda kullanılır", "Örn: VirtualBox, VMware Workstation"] },
          { icon: "🔧", title: "VirtualBox ve VMware mantığı", body: "İkisi de masaüstünde çalışır: sanal makine tanımı (ayar dosyası) + sanal disk dosyası + sanal ağ. Hypervisor bunları birleştirip sanal bilgisayarı çalıştırır." },
        ]}
      />
      <DataTable
        head={["Özellik", "Type 1", "Type 2"]}
        rows={[
          ["Nerede çalışır?", "Doğrudan donanımda", "Host işletim sistemi üzerinde"],
          ["Performans", "Daha az katman, genelde daha verimli", "Host OS yükü nedeniyle biraz daha fazla ek yük"],
          ["Kurulum", "Genelde ayrı bir sunucu kurulumu", "Normal uygulama kurar gibi"],
          ["Tipik kullanım", "Veri merkezi, bulut, sunucu", "Eğitim, geliştirme, test laboratuvarı"],
          ["Örnekler", "VMware ESXi, Microsoft Hyper-V", "VirtualBox, VMware Workstation"],
        ]}
      />
      <Callout kind="info" title="Not">
        Bu eğitimde laboratuvarımızı Type 2 hypervisor (VirtualBox veya VMware Workstation) ile kuracağız; çünkü kendi bilgisayarında kolayca çalışır.
      </Callout>
    </>
  );
}

function Lab() {
  const [sel, setSel] = useState<string>("2-hyp");
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const pick = (k: string) => {
    setSel(k);
    setSeen((s) => new Set(s).add(k));
  };
  const answer = (name: string, t: number) => {
    setAnswers((a) => {
      const n = { ...a, [name]: t };
      if (PRODUCTS.every((p) => n[p.n] === p.t)) markLab("hypervisor-mantigi");
      return n;
    });
  };
  const L = (k: string) => (
    <button key={k} type="button" onClick={() => pick(k)} aria-pressed={sel === k} className={`w-full rounded-lg border-2 px-3 py-3 text-sm font-semibold transition ${LAYERS[k].tone} ${sel === k ? "border-ag-warn shadow" : "border-transparent hover:border-ag-accent"}`}>
      {LAYERS[k].label}
      {seen.has(k) && " ✓"}
    </button>
  );
  const score = PRODUCTS.filter((p) => answers[p.n] === p.t).length;

  return (
    <div className="space-y-6">
      <SectionTitle kicker="Etkileşimli uygulama" title="Type 1 ve Type 2 mimarisini karşılaştır">Katmanlara tıkla. Fark: Type 2'de araya host işletim sistemi giriyor.</SectionTitle>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="card space-y-2">
          <h3 className="text-center font-bold text-ag-brand">Type 1 (bare-metal)</h3>
          <div className="space-y-2">
            {L("1-vm")}
            {L("1-hyp")}
            {L("1-hw")}
          </div>
        </div>
        <div className="card space-y-2">
          <h3 className="text-center font-bold text-ag-accent">Type 2 (hosted)</h3>
          <div className="space-y-2">
            {L("2-vm")}
            {L("2-hyp")}
            {L("2-os")}
            {L("2-hw")}
          </div>
        </div>
      </div>
      <Callout kind="info" title={LAYERS[sel].label}>
        {LAYERS[sel].text}
      </Callout>

      <div className="card space-y-4">
        <h3 className="font-bold text-ag-text">Sınıflandırma oyunu: Hangi tür?</h3>
        <p className="text-sm text-ag-muted">Her ürünü doğru hypervisor türüne ata. Anında geri bildirim alacaksın.</p>
        <div className="space-y-3">
          {PRODUCTS.map((p) => {
            const a = answers[p.n];
            const done = a !== undefined;
            return (
              <div key={p.n} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ag-line p-3">
                <span className="font-semibold">{p.n}</span>
                <div className="flex gap-2">
                  {[1, 2].map((t) => (
                    <button key={t} type="button" disabled={done} onClick={() => answer(p.n, t)} className={`btn btn-sm ${done && p.t === t ? "btn-ok" : done && a === t ? "!border-ag-err !bg-[#fdf0f0]" : ""}`}>
                      Type {t}
                    </button>
                  ))}
                </div>
                {done && <p className={`w-full text-xs ${a === p.t ? "text-ag-ok" : "text-ag-err"}`}>{a === p.t ? "✔ Doğru. " : `✘ Yanlış; doğru cevap Type ${p.t}. `}{p.why}</p>}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Skor: {score}/{PRODUCTS.length}</p>
          <button type="button" className="btn btn-sm" onClick={() => setAnswers({})}>Yeniden dene</button>
        </div>
      </div>
    </div>
  );
}

export default function Lesson02() {
  return <LessonShell slug="hypervisor-mantigi" topic={<Topic />} lab={<Lab />} />;
}
