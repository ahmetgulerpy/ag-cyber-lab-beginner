"use client";

import { useState } from "react";
import { LessonShell } from "@/components/LessonShell";
import { InstallGuide } from "@/components/InstallGuide";
import { Checklist } from "@/components/Interactive";
import { Callout, DataTable, ExtLink, InfoCards, ProgressBar, SectionTitle } from "@/components/ui";
import { GUIDES } from "@/content/guides";
import { LINKS } from "@/content/lessons";
import { markLab } from "@/lib/progress";

const REGIONS: Record<string, { n: string; t: string }> = {
  menu: { n: "Menü çubuğu (File, Machine, Help)", t: "File menüsünde Preferences ve Tools > Virtual Media Manager bulunur. Machine menüsünde New ve Add vardır. Help > About ile sürümü görürsün." },
  tools: { n: "Tools paneli (sol)", t: "Sol paneldeki araçlar: Welcome, Media (ISO ve sanal diskler), Network ve diğer yönetim araçları. Sanal makine listesi de bu sütunda yer alır." },
  list: { n: "Sanal makine listesi", t: "Oluşturduğun veya içe aktardığın makineler burada görünür. Durumları: Powered Off (kapalı), Running (çalışıyor), Saved." },
  toolbar: { n: "Araç çubuğu: New / Add / Settings / Start", t: "New: yeni makine. Add: hazır makineyi (.vbox) ekler. Settings: RAM, CPU, ağ, depolama ayarları. Start: makineyi çalıştırır." },
  details: { n: "Ayrıntı paneli (sağ)", t: "Seçili makinenin genel bilgilerini, sistem, ekran, depolama ve ağ ayarlarının özetini gösterir. Buradan hızlıca yanlış ayar yakalayabilirsin." },
};

function Topic() {
  return (
    <>
      <Callout kind="tip" title="Bu derste gerçek kurulum yapıyoruz">
        Konuyu kısa tutuyoruz; asıl işi &quot;Kurulum Rehberi&quot; sekmesinde adım adım yapacaksın. Rehberde her ekranın temsili şeması, yapacağın işlem, beklenen sonuç ve olası hata çözümü var.
      </Callout>
      <SectionTitle kicker="Tanışalım" title="VirtualBox nedir?" />
      <InfoCards
        items={[
          { icon: "📦", title: "VirtualBox", body: "Oracle'ın geliştirdiği, masaüstü kullanıma yönelik açık kaynaklı bir sanallaştırma yazılımı (Type 2 hypervisor)." },
          { icon: "🎯", title: "Ne zaman kullanılır?", body: "Eğitim laboratuvarı, farklı işletim sistemlerini denemek, güvenli test ortamı kurmak ve yazılım geliştirme.", bullets: ["Kali / Ubuntu laboratuvarı", "Snapshot ile güvenli deneme", "Birden fazla ağ modu"] },
          { icon: "🖥️", title: "Desteklenen host sistemler", body: "Windows, macOS ve Linux host'lar için paketler sunulur. Hangi sürümün hangi işletim sistemi ve mimariyi desteklediği zamanla değişir; resmî dokümantasyondaki güncel listeyi kontrol et." },
          { icon: "🔌", title: "Sanallaştırma desteği", body: "x86 bilgisayarlarda Intel VT-x veya AMD-V donanım desteğinin BIOS/UEFI'de açık olması gerekir. Kapalıysa 64-bit konuk sistemler listede görünmeyebilir." },
          { icon: "🧭", title: "Arayüz", body: "Sol tarafta makine listesi, üstte araç çubuğu, sağda seçili makinenin ayrıntıları bulunur. Uygulama sekmesinde bu arayüzü keşfedeceksin." },
          { icon: "🧩", title: "Extension Pack", body: "İsteğe bağlı bir eklenti paketidir; temel laboratuvar için gerekli değildir. İhtiyaç olursa resmî sayfadaki lisans koşullarını oku." },
        ]}
      />
      <SectionTitle title="Sistem gereksinimleri (genel bakış)" />
      <DataTable
        head={["Kaynak", "Minimum (çalışması için)", "Önerilen (rahat laboratuvar)"]}
        rows={[
          ["İşlemci", "64-bit, sanallaştırma destekli (VT-x / AMD-V)", "4+ çekirdek"],
          ["RAM", "4 GB (tek hafif VM)", "8–16 GB"],
          ["Boş disk", "25–30 GB", "100 GB+ (SSD)"],
          ["İşletim sistemi", "Resmî dokümantasyondaki desteklenen sürümler", "Güncel, güncellemeleri yapılmış sistem"],
        ]}
      />
      <p className="text-sm text-ag-muted">Değerler genel öneridir; kesin gereksinimler sürüme göre değişir. Resmî kaynak: <ExtLink href={LINKS.vboxDocs}>VirtualBox kurulum dokümantasyonu</ExtLink> · <ExtLink href={LINKS.vboxDownload}>İndirme sayfası</ExtLink></p>
    </>
  );
}

function Lab() {
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [sel, setSel] = useState<string>("toolbar");
  const pick = (k: string) => {
    setSel(k);
    setSeen((s) => {
      const n = new Set(s).add(k);
      if (n.size === Object.keys(REGIONS).length) markLab("virtualbox");
      return n;
    });
  };
  const R = ({ k, className = "", children }: { k: string; className?: string; children: React.ReactNode }) => (
    <button type="button" onClick={() => pick(k)} aria-pressed={sel === k} className={`rounded-md border-2 text-left transition ${sel === k ? "border-ag-warn bg-[#fffaf0]" : "border-ag-line bg-white hover:border-ag-accent"} ${className}`}>
      {children}
      {seen.has(k) && <span className="ml-1 text-[10px] text-ag-ok">✓</span>}
    </button>
  );
  return (
    <div className="space-y-6">
      <SectionTitle kicker="Etkileşimli uygulama" title="VirtualBox arayüz turu">Temsili pencerede bir bölgeye tıkla; ne işe yaradığını oku. Beş bölgeyi de gezince tur tamamlanır.</SectionTitle>
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-xl border border-ag-line bg-white shadow-sm">
          <div className="border-b border-ag-line bg-[#eef3f6] px-3 py-2 text-xs font-semibold text-ag-muted">Oracle VirtualBox Manager (temsili şema)</div>
          <div className="space-y-2 p-3">
            <R k="menu" className="w-full px-3 py-1.5 text-xs">File &nbsp; Machine &nbsp; Help</R>
            <R k="toolbar" className="w-full px-3 py-2 text-xs font-semibold">[ New ] [ Add ] [ Settings ] [ Start ]</R>
            <div className="grid grid-cols-[110px_1fr] gap-2">
              <div className="space-y-2">
                <R k="tools" className="w-full px-2 py-2 text-xs">Tools</R>
                <R k="list" className="w-full px-2 py-6 text-xs">Kali-Lab<br />Ubuntu-Lab</R>
              </div>
              <R k="details" className="px-3 py-8 text-xs">Seçili makinenin ayrıntıları: Genel, Sistem, Ekran, Depolama, Ağ…</R>
            </div>
          </div>
        </div>
        <div className="card">
          <p className="text-sm font-bold text-ag-brand">{REGIONS[sel].n}</p>
          <p className="mt-2 text-sm leading-relaxed text-ag-text">{REGIONS[sel].t}</p>
          <p className="mt-4 text-xs font-semibold text-ag-muted">Keşfedilen bölge: {seen.size}/5</p>
          <ProgressBar pct={(seen.size / 5) * 100} tone={seen.size === 5 ? "ok" : "brand"} />
        </div>
      </div>
      <Checklist
        id="vbox-status"
        title="Kurulum durumu kontrol listem"
        items={[
          "Resmî VirtualBox indirme sayfasını açtım.",
          "İşletim sistemime ve mimarime uygun paketi indirdim.",
          "Kurulum dosyasını çalıştırdım ve izinleri verdim.",
          "Ağ bileşenleri/sürücüleri kuruldu.",
          "VirtualBox'ı açtım ve arayüzü tanıdım.",
          "Sürüm numarasını Help > About'ta gördüm.",
        ]}
      />
      <Callout kind="info">Kurulumu yaparken takılırsan &quot;Kurulum Rehberi&quot; sekmesindeki <strong>Bir sorunla karşılaştım</strong> düğmesini kullan.</Callout>
    </div>
  );
}

export default function Lesson03() {
  return <LessonShell slug="virtualbox" topic={<Topic />} lab={<Lab />} extra={[{ id: "guide", label: "🧭 Kurulum Rehberi", content: <InstallGuide guide={GUIDES["vbox-install"]} /> }]} />;
}
