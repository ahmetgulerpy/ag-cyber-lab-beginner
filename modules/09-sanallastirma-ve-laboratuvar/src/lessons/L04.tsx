"use client";

import { useState } from "react";
import { LessonShell } from "@/components/LessonShell";
import { InstallGuide } from "@/components/InstallGuide";
import { Callout, DataTable, ExtLink, InfoCards, SectionTitle } from "@/components/ui";
import { GUIDES } from "@/content/guides";
import { LINKS } from "@/content/lessons";
import { markLab } from "@/lib/progress";

function Topic() {
  return (
    <>
      <Callout kind="tip" title="VMware'i tanıyalım">
        VirtualBox'a güçlü bir alternatif. İkisinde de sanal makine mantığı aynı; sadece düğmelerin adı ve yeri farklı. Hangisini seçeceğini sonraki uygulamada birlikte bulacağız.
      </Callout>
      <SectionTitle kicker="Tanışalım" title="VMware Workstation nedir?" />
      <InfoCards
        items={[
          { icon: "🧱", title: "VMware Workstation Pro", body: "Windows ve Linux host'lar için masaüstü hypervisor (Type 2). Gelişmiş sanal ağ düzenleyicisi ve geniş sanal makine yönetimi sunar." },
          { icon: "🍎", title: "Mac için: VMware Fusion", body: "Workstation Pro macOS'ta çalışmaz. Mac kullanıcıları için eşdeğer ürün VMware Fusion'dır. Güncel destek ve sürümleri resmî sayfadan kontrol et." },
          { icon: "🎯", title: "Kullanım alanları", body: "Eğitim, yazılım geliştirme, test laboratuvarı ve birden fazla sanal ağlı senaryolar." },
          { icon: "📋", title: "Sistem gereksinimleri", body: "64-bit x86 bir işlemci; Intel VT-x veya AMD-V desteği ve BIOS/UEFI'de bu desteğin açık olması gerekir. Ayrıntılar için Broadcom resmî dokümanlarına bak." },
          { icon: "🧭", title: "Arayüz", body: "Home sekmesi, sol Library paneli, VM sekmeleri ve Edit > Virtual Network Editor." },
          { icon: "🔑", title: "Lisans ve indirme", body: "Broadcom'un duyurusuna göre Workstation Pro ticari, eğitim ve kişisel kullanım için ücretsiz; lisans anahtarı gerekmiyor. İndirme Broadcom Support Portal üzerinden yapılıyor." },
        ]}
      />
      <Callout kind="warn" title="Güncel lisans ve kullanım koşulları">
        Lisans politikaları değişebilir. Bu bilgi geliştirme sırasında Broadcom ve VMware resmî duyurularıyla kontrol edildi. Kurulumdan önce <ExtLink href={LINKS.vmwareBroadcom}>Broadcom'un resmî makalesini</ExtLink> ve <ExtLink href={LINKS.vmwareHome}>VMware sitesini</ExtLink> açıp güncel koşulları doğrula. İnternette dolaşan lisans anahtarlarını veya &quot;çatlak&quot; yazılımları kullanma; güvenlik riski taşır.
      </Callout>
      <SectionTitle title="VirtualBox ve VMware karşılaştırması" />
      <DataTable
        head={["Konu", "VirtualBox", "VMware Workstation Pro"]}
        rows={[
          ["Host sistemleri", "Windows, macOS, Linux (sürüme göre mimari farkları var)", "Windows ve Linux (x86); Mac için ayrı ürün: Fusion"],
          ["Kullanım kolaylığı", "Sade, başlangıç için kolay", "Zengin ama biraz daha fazla seçenek; sihirbazı kolay"],
          ["Sanal ağ özellikleri", "NAT, NAT Network, Bridged, Host-only, Internal", "NAT, Bridged, Host-only ve Virtual Network Editor ile özel ağlar"],
          ["Snapshot / klon", "Var", "Var"],
          ["Kaynak tüketimi", "Genelde hafif; ayarlara bağlı", "Genelde dengeli; ayarlara bağlı"],
          ["Lisans / indirme", "Resmî sayfadan; Extension Pack ayrı lisansa tabidir", "Broadcom Support Portal; güncel koşulları kontrol et"],
          ["Kali hazır imajı", "Resmî VirtualBox imajı var", "Resmî VMware imajı var"],
        ]}
      />
      <p className="text-xs text-ag-muted">Kaynak tüketimi donanıma, konuk sisteme ve ayarlara göre değişir; tabloda genel eğilimler verilmiştir, kıyaslama sonucu değildir.</p>
    </>
  );
}

type Prio = "free" | "mac" | "lab" | "net" | "premade" | "light";
const PRIOS: { id: Prio; label: string }[] = [
  { id: "free", label: "Kurulum ve kullanım kolay olsun" },
  { id: "mac", label: "Mac kullanıyorum" },
  { id: "lab", label: "Birden fazla VM'li laboratuvar kuracağım" },
  { id: "net", label: "Gelişmiş sanal ağ düzenleme istiyorum" },
  { id: "premade", label: "Kali hazır imajını içe aktaracağım" },
  { id: "light", label: "Düşük donanımım var (hafif çözüm)" },
];

function Lab() {
  const [os, setOs] = useState("win");
  const [sel, setSel] = useState<Prio[]>([]);
  const [shown, setShown] = useState(false);
  const toggle = (p: Prio) => {
    setShown(false);
    setSel((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]));
  };
  let vb = 0;
  let vm = 0;
  const why: string[] = [];
  if (sel.includes("free")) { vb += 2; vm += 1; why.push("Kurulum kolaylığı için VirtualBox'ın sade arayüzü avantajlı."); }
  if (sel.includes("lab")) { vb += 1; vm += 1; why.push("İkisi de çoklu VM destekler; kaynaklara dikkat et."); }
  if (sel.includes("net")) { vm += 2; vb += 1; why.push("Virtual Network Editor ile VMware ağ tasarımında esnek; VirtualBox da Host-only/Internal sunar."); }
  if (sel.includes("premade")) { why.push("Kali hem VirtualBox hem VMware için resmî hazır imaj sunuyor."); }
  if (sel.includes("light")) { vb += 2; why.push("Düşük donanımda her iki üründe de tek hafif VM ile çalış; VirtualBox genelde başlangıç için yeterli."); }
  if (sel.includes("mac")) { why.push("Mac'te Workstation Pro yok; VMware Fusion veya VirtualBox seçeneklerini ve Apple Silicon desteğini resmî sayfalardan kontrol et."); }
  let result: { title: string; body: string };
  if (os === "mac" || sel.includes("mac")) {
    result = { title: "VirtualBox veya VMware Fusion", body: "VMware Workstation Pro macOS'ta çalışmaz. Apple Silicon (ARM) Mac'in varsa her iki ürünün güncel ARM desteğini ve ARM64 Kali/Ubuntu imajlarını resmî sayfalardan doğrula." };
  } else if (os === "winarm") {
    result = { title: "Resmî sayfaları kontrol et", body: "ARM tabanlı Windows'ta Workstation Pro uygun olmayabilir. VirtualBox'ın ARM destekli sürümleri için resmî indirme sayfasına bak; ARM64 imajı kullan." };
  } else if (vb === vm) {
    result = { title: "İkisi de uygun", body: "Başlangıç için VirtualBox'ı dene; arayüzü sade. VMware'i de kurup karşılaştırabilirsin. İkisini aynı anda çalıştırırken Hyper-V çakışmalarına dikkat et." };
  } else if (vb > vm) {
    result = { title: "VirtualBox", body: "Seçimlerine göre VirtualBox sana daha uygun. Kurulumu ve arayüzü sade, hazır Kali imajı resmî olarak mevcut." };
  } else {
    result = { title: "VMware Workstation Pro", body: "Seçimlerine göre VMware Workstation Pro daha uygun. Broadcom'un güncel lisans ve indirme koşullarını kontrol et." };
  }
  return (
    <div className="space-y-6">
      <SectionTitle kicker="Etkileşimli uygulama" title="Hangi hypervisor benim için?">Bilgisayarına ve ihtiyaçlarına göre öneri al. Bu araç yalnızca bir yönlendirmedir; son kararı resmî dokümantasyonu okuyarak ver.</SectionTitle>
      <div className="card space-y-4">
        <label className="block text-sm font-semibold">
          Bilgisayarının işletim sistemi
          <select className="field mt-1 max-w-sm" value={os} onChange={(e) => { setOs(e.target.value); setShown(false); }}>
            <option value="win">Windows (x86_64)</option>
            <option value="linux">Linux (x86_64)</option>
            <option value="mac">macOS (Intel veya Apple Silicon)</option>
            <option value="winarm">Windows (ARM)</option>
          </select>
        </label>
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold">Önceliklerin</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {PRIOS.map((p) => (
              <label key={p.id} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${sel.includes(p.id) ? "border-ag-brand bg-ag-light" : "border-ag-line bg-white"}`}>
                <input type="checkbox" className="accent-[#176B87]" checked={sel.includes(p.id)} onChange={() => toggle(p.id)} />
                {p.label}
              </label>
            ))}
          </div>
        </fieldset>
        <button type="button" className="btn btn-primary" onClick={() => { setShown(true); markLab("vmware"); }}>
          Öneriyi göster
        </button>
        {shown && (
          <div className="space-y-3">
            <Callout kind="ok" title={`Öneri: ${result.title}`}>{result.body}</Callout>
            {why.length > 0 && (
              <ul className="list-disc space-y-1 pl-5 text-sm text-ag-text">
                {why.map((w) => <li key={w}>{w}</li>)}
              </ul>
            )}
            <p className="text-sm text-ag-muted">Resmî kaynaklar: <ExtLink href={LINKS.vboxDownload}>VirtualBox</ExtLink> · <ExtLink href={LINKS.vmwareBroadcom}>VMware (Broadcom)</ExtLink></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Lesson04() {
  return <LessonShell slug="vmware" topic={<Topic />} lab={<Lab />} extra={[{ id: "guide", label: "🧭 Kurulum Rehberi", content: <InstallGuide guide={GUIDES["vmware-install"]} /> }]} />;
}
