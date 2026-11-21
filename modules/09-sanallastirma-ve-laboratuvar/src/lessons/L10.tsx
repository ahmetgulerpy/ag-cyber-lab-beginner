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
      <Callout kind="tip" title="Ubuntu ile sağlam bir temel kuralım">
        Ubuntu, Linux öğrenmek için dünyada en yaygın başlangıç noktalarından biri. Laboratuvarında hedef makine veya genel amaçlı Linux olarak kullanacağız. ISO yöntemini &quot;Yöntem A&quot; sekmesinde adım adım yapacaksın.
      </Callout>
      <SectionTitle kicker="Yöntem A" title="ISO ile kurulum" />
      <InfoCards
        items={[
          { icon: "🔗", title: "Resmî indirme", body: "ubuntu.com/download/desktop sayfasını aç. Sayfa en güncel sürümü ve LTS seçeneğini gösterir." },
          { icon: "🕰️", title: "LTS nedir?", body: "Long Term Support: uzun süre güvenlik güncellemesi alan sürüm. Laboratuvar için önerilir; sürüm numarasını ezberleme, sayfadaki güncel LTS'i seç." },
          { icon: "📋", title: "Sistem gereksinimleri", body: "Ubuntu'nun resmî kurulum rehberi en az 25 GB depolama alanı ister. Masaüstü için sanal makinede 4 GB RAM ve 2 CPU rahat bir başlangıçtır.", bullets: ["RAM: 4 GB", "CPU: 2", "Disk: 25 GB asgari, 40 GB rahat"] },
          { icon: "🧮", title: "Mimari", body: "Intel/AMD için amd64 ISO. Apple Silicon'da bu ISO çalışmaz; resmî sayfadaki ARM64 seçeneklerini kontrol et." },
        ]}
      />
      <SectionTitle kicker="Yöntem B" title="Hazır imaj veya alternatif kurulum seçenekleri" />
      <Callout kind="info" title="Dürüst bir not">
        Geliştirme sırasında Ubuntu'nun resmî dokümantasyonunu kontrol ettik: resmî yol ISO ile kurulumdur. Canonical'ın Ubuntu Desktop için VirtualBox/VMware'e hazır, resmî bir sanal makine imajı sunduğunu doğrulayamadık. Bu yüzden internette &quot;hazır Ubuntu VM&quot; diye dolaşan üçüncü taraf imajları önermiyoruz.
      </Callout>
      <DataTable
        head={["Seçenek", "Ne işe yarar?", "Not"]}
        rows={[
          ["Multipass (Canonical)", "Ubuntu sanal makinelerini komut satırıyla hızlıca açar", "Resmî Ubuntu rehberinde sanal makine kurmanın bir yolu olarak anılır. Genelde komut satırı odaklıdır; güncel destek için resmî sayfaya bak."],
          ["Ubuntu Server ISO", "Masaüstü olmayan, hafif sunucu kurulumu", "Kaynak azsa uygun; kurulum mantığı ISO yöntemiyle aynıdır."],
          ["WSL (Windows)", "Windows içinde Ubuntu komut satırı", "Tam izole bir laboratuvar değildir; ağ ve izolasyon modeli farklıdır."],
          ["Üçüncü taraf hazır imajlar", "—", "Önerilmez: kaynağı doğrulanamaz, güncel olmayabilir."],
        ]}
      />
      <p className="text-sm text-ag-muted">
        Kaynaklar: <ExtLink href={LINKS.ubuntuDownload}>Ubuntu indirme</ExtLink> · <ExtLink href={LINKS.ubuntuVbox}>VirtualBox öğreticisi</ExtLink> · <ExtLink href={LINKS.ubuntuInstall}>Kurulum rehberi</ExtLink> · <ExtLink href={LINKS.multipass}>Multipass</ExtLink>
      </p>
      <SectionTitle title="Kali Linux ve Ubuntu karşılaştırması" />
      <DataTable
        head={["Konu", "Kali Linux", "Ubuntu"]}
        rows={[
          ["Amaç", "Güvenlik testi ve eğitim", "Genel amaçlı masaüstü ve sunucu"],
          ["Hazır araçlar", "Güvenlik araçları hazır gelir", "Temel uygulamalar; ihtiyaca göre eklenir"],
          ["Günlük kullanım", "Önerilmez", "Uygundur"],
          ["Laboratuvarda rolü", "Test eden makine (yetkili ortamda)", "Hedef makine veya genel Linux"],
          ["Destek modeli", "Sürekli güncellenen dağıtım", "LTS ile uzun süreli destek"],
          ["Başlangıç parolası", "Hazır imajda kali / kali", "Kurulumda sen belirlersin"],
        ]}
      />
    </>
  );
}

function Lab() {
  const [goal, setGoal] = useState("learn");
  const [ram, setRam] = useState("8");
  const [arch, setArch] = useState("x86");
  const [shown, setShown] = useState(false);
  const r = Number(ram);
  const out = (() => {
    const rec: string[] = [];
    let os = "";
    let res = "";
    if (goal === "learn") { os = "Ubuntu Desktop (güncel LTS)"; res = r >= 8 ? "4 GB RAM, 2 CPU, 40 GB disk" : "4 GB RAM (sınırda), 2 CPU, 30 GB disk"; rec.push("Genel Linux alışkanlığı için en uygun başlangıç."); }
    if (goal === "security") { os = "Kali Linux + izole hedef (Ubuntu)"; res = r >= 12 ? "Kali: 4 GB / Ubuntu: 4 GB; iki VM aynı anda" : r >= 8 ? "Kali: 2–4 GB / Ubuntu: 2–4 GB; kaynakları dikkatli paylaştır" : "Tek VM çalıştır; iki makineyi aynı anda açma"; rec.push("Kali yalnızca kendi laboratuvarında ve yetkili sistemlerde kullanılır; hedef makineyi Internal/Host-only ağda tut."); }
    if (goal === "target") { os = "Ubuntu Desktop veya Ubuntu Server"; res = r >= 8 ? "Server: 2 GB, Desktop: 4 GB" : "Ubuntu Server: 1–2 GB (hafif)"; rec.push("Hedef makineyi izole ağda çalıştır; snapshot al."); }
    if (goal === "light") { os = "Ubuntu Server veya Multipass ile hafif Ubuntu"; res = "1–2 GB RAM, 1–2 CPU, 10–20 GB disk"; rec.push("Düşük donanımda komut satırı pratiği için uygundur."); }
    if (arch === "arm") rec.push("Apple Silicon: ARM64 imajı gerekir. Kali ve Ubuntu'nun ARM64 seçeneklerini resmî sayfalardan, hypervisor'un ARM desteğini resmî dokümanlardan kontrol et.");
    if (r < 8) rec.push("RAM 8 GB'ın altında: aynı anda tek sanal makine çalıştır, tarayıcıyı kapat.");
    return { os, res, rec };
  })();
  return (
    <div className="space-y-6">
      <SectionTitle kicker="Etkileşimli uygulama" title="Hangi sistemi kurmalıyım?">Amacını ve bilgisayarını seç; önerilen işletim sistemi ve kaynakları gör.</SectionTitle>
      <div className="card space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-sm font-semibold">Amacım
            <select className="field mt-1" value={goal} onChange={(e) => { setGoal(e.target.value); setShown(false); }}>
              <option value="learn">Genel Linux öğrenmek</option>
              <option value="security">Güvenlik araçlarını yetkili lab'ımda denemek</option>
              <option value="target">Hedef/sunucu makine kurmak</option>
              <option value="light">Düşük donanımda terminal pratiği</option>
            </select>
          </label>
          <label className="text-sm font-semibold">Bilgisayar RAM'i
            <select className="field mt-1" value={ram} onChange={(e) => { setRam(e.target.value); setShown(false); }}>
              <option value="4">4 GB</option>
              <option value="8">8 GB</option>
              <option value="16">16 GB</option>
              <option value="32">32 GB veya üzeri</option>
            </select>
          </label>
          <label className="text-sm font-semibold">İşlemci mimarisi
            <select className="field mt-1" value={arch} onChange={(e) => { setArch(e.target.value); setShown(false); }}>
              <option value="x86">Intel / AMD (x86_64)</option>
              <option value="arm">ARM64 (Apple Silicon vb.)</option>
            </select>
          </label>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => { setShown(true); markLab("ubuntu-kurulumu"); }}>Öneriyi hesapla</button>
        {shown && (
          <div className="space-y-3">
            <Callout kind="ok" title={`Öneri: ${out.os}`}>Önerilen kaynaklar: <strong>{out.res}</strong></Callout>
            <ul className="list-disc space-y-1 pl-5 text-sm text-ag-text">{out.rec.map((x) => <li key={x}>{x}</li>)}</ul>
            <p className="text-xs text-ag-muted">Bu öneri genel bir başlangıç noktasıdır; zorunlu bir yapılandırma değildir.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Lesson10() {
  return <LessonShell slug="ubuntu-kurulumu" topic={<Topic />} lab={<Lab />} extra={[{ id: "guide", label: "🧭 Yöntem A: ISO Kurulum Rehberi", content: <InstallGuide guide={GUIDES["ubuntu-a"]} /> }]} />;
}
