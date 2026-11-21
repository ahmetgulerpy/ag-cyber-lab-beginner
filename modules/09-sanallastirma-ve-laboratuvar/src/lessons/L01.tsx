"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";
import { LessonShell } from "@/components/LessonShell";
import { Callout, DataTable, InfoCards, ProgressBar, SectionTitle } from "@/components/ui";
import { markLab } from "@/lib/progress";

const PARTS: Record<string, { icon: string; title: string; text: string; sec: string }> = {
  pc: { icon: "🖥️", title: "Fiziksel bilgisayar", text: "Gerçek CPU, RAM, disk ve ağ kartının bulunduğu makine. Sanal makinelerin kullandığı tüm kaynaklar sonunda buradan gelir; bu yüzden kaynakların sınırı fiziksel bilgisayarındır.", sec: "Sanal makine ne yaparsa yapsın, fiziksel donanım senin bilgisayarın olduğu için host'u korumak her zaman önceliktir." },
  host: { icon: "🪟", title: "Host işletim sistemi", text: "Fiziksel bilgisayarda doğrudan çalışan işletim sistemi (Windows, macOS veya Linux). Hypervisor uygulamasını çalıştırır ve senin günlük işlerinin yapıldığı sistemdir.", sec: "Host'unu laboratuvar deneylerinden ayrı tut. Paylaşılan klasör veya pano gibi köprüler izolasyonu zayıflatır." },
  hyp: { icon: "🧩", title: "Hypervisor", text: "Sanal makineleri oluşturan, çalıştıran ve fiziksel kaynakları (CPU, RAM, disk, ağ) onlara paylaştıran yazılım katmanı. VirtualBox ve VMware Workstation örnekleridir.", sec: "Sanal makineleri birbirinden ve host'tan ayırmak hypervisor'un görevidir. Hypervisor'unu güncel tutmak güvenlik açısından önemlidir." },
  vm1: { icon: "🐉", title: "Sanal makine 1 (örn. Kali)", text: "Kendi işletim sistemi (guest) olan, sanki gerçek bir bilgisayarmış gibi davranan yalıtılmış ortam. Dosyaları sanal disk dosyasında saklanır.", sec: "Hatalı bir deneme yalnızca bu makineyi bozar; snapshot ile geri dönebilirsin." },
  vm2: { icon: "🐧", title: "Sanal makine 2 (örn. Ubuntu)", text: "İkinci bir bağımsız guest. İki makine aynı donanımı paylaşır ama birbirinin belleğine ve diskine doğrudan erişmez.", sec: "Hedef makineyi ayrı bir VM'de tutmak, laboratuvarı gerçek sistemden ayırır." },
  vcpu: { icon: "⚙️", title: "Sanal CPU (vCPU)", text: "Sanal makineye ayrılan işlemci çekirdekleri. Gerçek çekirdeklerden zaman dilimi alır. Gerçek çekirdek sayısından fazla vCPU vermek performansı düşürür.", sec: "Başlangıç için 2 vCPU çoğu laboratuvar için yeterlidir." },
  vram: { icon: "🧠", title: "Sanal RAM (vRAM)", text: "Sanal makineye ayrılan bellek miktarı. Gerçek RAM'den ayrılır; toplam ayırma host'un belleğini aşarsa sistem yavaşlar.", sec: "Host'a yeterli RAM bırak. Çok fazla RAM ayırmak host'u kullanılamaz hale getirir." },
  vdisk: { icon: "💾", title: "Sanal disk", text: "Host diskinde duran büyük bir dosya (ör. .vdi, .vmdk). Guest bunu gerçek bir sabit disk gibi görür. Dinamik disk kullandıkça büyür.", sec: "Sanal disk dosyasını silmek, o makinenin tüm verisini siler. Önemli çalışmalarını yedekle." },
};
const IDS = Object.keys(PARTS);

function Part({ id, sel, seen, onPick, children, className = "" }: { id: string; sel: string; seen: Set<string>; onPick: (id: string) => void; children?: ReactNode; className?: string }) {
  const p = PARTS[id];
  const key = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      onPick(id);
    }
  };
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={sel === id}
      onKeyDown={key}
      onClick={(e) => {
        e.stopPropagation();
        onPick(id);
      }}
      className={`cursor-pointer rounded-xl border-2 p-3 text-left transition ${sel === id ? "border-ag-warn bg-[#fffaf0] shadow" : "border-ag-line bg-white hover:border-ag-accent"} ${className}`}
    >
      <p className="flex items-center justify-between text-sm font-bold text-ag-text">
        <span>
          {p.icon} {p.title}
        </span>
        {seen.has(id) && <span className="text-xs text-ag-ok">✓</span>}
      </p>
      {children}
    </div>
  );
}

function Topic() {
  return (
    <>
      <Callout kind="tip" title="Hadi başlayalım">
        Bir bilgisayarın içinde başka bilgisayarlar çalıştırabildiğini düşün. Üstelik biri bozulsa bile asıl bilgisayarın hiç etkilenmiyor. Siber güvenlik eğitimi için bu çok güçlü bir fikir. Şimdi nasıl çalıştığına bakalım.
      </Callout>
      <SectionTitle kicker="Temel kavramlar" title="Sanallaştırma nedir?" />
      <InfoCards
        items={[
          { icon: "🧪", title: "Sanallaştırma", body: "Tek bir fiziksel bilgisayarın kaynaklarını yazılımla bölüp birden fazla yalıtılmış sanal bilgisayar çalıştırma tekniği." },
          { icon: "🏠", title: "Host (ev sahibi)", body: "Sanal makineleri barındıran gerçek bilgisayar ve onun işletim sistemi." },
          { icon: "🛋️", title: "Guest (konuk)", body: "Sanal makinenin içinde çalışan işletim sistemi. Kali ve Ubuntu bu eğitimde guest olacak." },
          { icon: "⚖️", title: "Kaynak paylaşımı", body: "CPU, RAM ve disk host'tan ayrılır. Toplam ayırma, fiziksel kaynağı aşmamalıdır." },
          { icon: "🧰", title: "Kullanım alanları", body: "Test ortamları, sunucu birleştirme, yazılım geliştirme, eski yazılım çalıştırma ve eğitim laboratuvarları.", bullets: ["Test ve geliştirme", "Sunucu konsolidasyonu", "Eğitim ve laboratuvar"] },
          { icon: "🛡️", title: "Siber güvenlikte önemi", body: "Güvenli, izole ve geri alınabilir bir deneme alanı sunar. Gerçek sistemine zarar vermeden öğrenirsin." },
        ]}
      />
      <SectionTitle title="Fiziksel bilgisayar ve sanal makine" />
      <DataTable
        head={["Özellik", "Fiziksel bilgisayar", "Sanal makine"]}
        rows={[
          ["Donanım", "Gerçek, dokunabileceğin parçalar", "Yazılımla taklit edilen sanal donanım"],
          ["Kaynak", "Kendi CPU, RAM ve diski", "Host'tan ayrılan paylı kaynak"],
          ["Kopyalama", "Zor ve yavaş", "Dosya kopyalayarak veya klonla kolay"],
          ["Geri dönüş", "Yedekten geri yükleme gerekir", "Snapshot ile saniyeler içinde"],
          ["Risk", "Hata gerçek sistemi etkiler", "Hata sanal makineyle sınırlı kalır"],
        ]}
      />
      <Callout kind="warn" title="Unutma">
        Sanallaştırma her şeyi sihirli biçimde güvenli yapmaz. Yanlış ağ ayarı veya paylaşılan klasör izolasyonu zayıflatır. Bunu ilerleyen derslerde birlikte öğreneceğiz.
      </Callout>
    </>
  );
}

function Lab() {
  const [sel, setSel] = useState("pc");
  const [seen, setSeen] = useState<Set<string>>(new Set(["pc"]));
  const [r1, setR1] = useState(4);
  const [r2, setR2] = useState(4);
  const [c1, setC1] = useState(2);
  const [c2, setC2] = useState(2);
  const HOST_RAM = 16;
  const HOST_CPU = 8;

  const pick = (id: string) => {
    setSel(id);
    setSeen((s) => {
      const n = new Set(s).add(id);
      if (n.size === IDS.length) markLab("virtualization-nedir");
      return n;
    });
  };
  const used = r1 + r2;
  const left = HOST_RAM - used;
  const p = PARTS[sel];
  const tone = left < 4 ? (left < 2 ? "err" : "warn") : "ok";
  const vmBox = (id: string, name: string) => (
    <Part id={id} sel={sel} seen={seen} onPick={pick}>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {(["vcpu", "vram", "vdisk"] as const).map((x) => (
          <Part key={`${id}-${x}`} id={x} sel={sel} seen={seen} onPick={pick} className="!p-1.5 text-[10px]" />
        ))}
      </div>
      <p className="mt-1 text-[11px] text-ag-muted">{name}</p>
    </Part>
  );

  return (
    <div className="space-y-6">
      <SectionTitle kicker="Etkileşimli uygulama" title="Sanallaştırma mimarisini keşfet">Şemadaki bir bileşene tıkla; görevi sağda açıklansın. Sekiz bileşenin hepsini incelediğinde uygulama tamamlanmış sayılır.</SectionTitle>
      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <Part id="pc" sel={sel} seen={seen} onPick={pick} className="space-y-3 !bg-ag-bg">
            <Part id="host" sel={sel} seen={seen} onPick={pick} />
            <Part id="hyp" sel={sel} seen={seen} onPick={pick} />
            <div className="grid gap-3 sm:grid-cols-2">
              {vmBox("vm1", "Guest: Kali")}
              {vmBox("vm2", "Guest: Ubuntu")}
            </div>
          </Part>
          <p className="mt-2 text-sm font-semibold text-ag-muted">
            İncelenen bileşen: {seen.size}/{IDS.length}
          </p>
          <ProgressBar pct={(seen.size / IDS.length) * 100} tone={seen.size === IDS.length ? "ok" : "brand"} />
        </div>
        <div className="card lg:sticky lg:top-24 lg:self-start">
          <p className="text-3xl">{p.icon}</p>
          <h3 className="mt-1 text-lg font-bold text-ag-brand">{p.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ag-text">{p.text}</p>
          <Callout kind="info" title="Güvenlik bağlantısı">
            {p.sec}
          </Callout>
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="font-bold text-ag-text">Kaynak paylaşımı denemesi</h3>
        <p className="text-sm text-ag-muted">Sanal bir host: {HOST_RAM} GB RAM ve {HOST_CPU} çekirdek. İki sanal makineye kaynak ver ve host'a ne kaldığını gör. (Bu yalnızca bir simülasyondur.)</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { n: "VM 1 RAM", v: r1, s: setR1, max: 12, u: "GB" },
            { n: "VM 2 RAM", v: r2, s: setR2, max: 12, u: "GB" },
            { n: "VM 1 vCPU", v: c1, s: setC1, max: 8, u: "çekirdek" },
            { n: "VM 2 vCPU", v: c2, s: setC2, max: 8, u: "çekirdek" },
          ].map((x) => (
            <label key={x.n} className="block text-sm font-semibold">
              {x.n}: <span className="text-ag-brand">{x.v} {x.u}</span>
              <input type="range" min={1} max={x.max} value={x.v} onChange={(e) => x.s(Number(e.target.value))} className="mt-1 w-full accent-[#176B87]" />
            </label>
          ))}
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-ag-muted">Host RAM kullanımı: sanal makineler {used} GB / {HOST_RAM} GB</p>
          <ProgressBar pct={(used / HOST_RAM) * 100} tone={tone === "ok" ? "ok" : tone === "warn" ? "warn" : "err"} />
        </div>
        {left < 2 ? (
          <Callout kind="err" title="Host'a neredeyse hiç RAM kalmadı">Host işletim sistemi yavaşlar, uygulamalar donabilir. Ayırmayı azalt.</Callout>
        ) : left < 4 ? (
          <Callout kind="warn" title="Sınırda">Host'ta {left} GB kaldı. Genelde host için en az 4 GB bırakmak iyi bir başlangıç kuralıdır.</Callout>
        ) : (
          <Callout kind="ok" title="Dengeli">Host'a {left} GB RAM kalıyor. İki sanal makine rahat çalışır.</Callout>
        )}
        {c1 + c2 > HOST_CPU && <Callout kind="warn" title="Çekirdekler fazla ayrıldı">Toplam vCPU ({c1 + c2}), fiziksel çekirdek sayısını ({HOST_CPU}) aşıyor. VM'ler çalışabilir ama birbirini yavaşlatır.</Callout>}
      </div>
    </div>
  );
}

export default function Lesson01() {
  return <LessonShell slug="virtualization-nedir" topic={<Topic />} lab={<Lab />} />;
}
