"use client";

import { useState } from "react";
import { LessonShell } from "@/components/LessonShell";
import { InstallGuide } from "@/components/InstallGuide";
import { HashChecker } from "@/components/HashChecker";
import { Callout, DataTable, ExtLink, InfoCards, SectionTitle } from "@/components/ui";
import { GUIDES } from "@/content/guides";
import { LINKS } from "@/content/lessons";

function Topic() {
  return (
    <>
      <Callout kind="tip" title="Kali'yi iki yoldan kurabilirsin">
        Hızlı başlamak istiyorsan resmî hazır sanal makine imajını içe aktar (Yöntem A). Kurulumun nasıl yapıldığını öğrenmek istiyorsan ISO ile sıfırdan kur (Yöntem B). İki yöntemin adım adım rehberi üst sekmelerde.
      </Callout>
      <SectionTitle kicker="Karşılaştırma" title="Hangi yöntem sana uygun?" />
      <DataTable
        head={["", "Yöntem A: Hazır imaj", "Yöntem B: ISO ile kurulum"]}
        rows={[
          ["Hız", "Çok hızlı: arşivi aç, içe aktar, başlat", "Daha uzun: kurulum sihirbazı gerekir"],
          ["Öğrenme", "Kurulumu atlarsın", "Kurulum adımlarını öğrenirsin"],
          ["Kullanıcı", "Varsayılan kali / kali (hemen değiştir)", "Kendi kullanıcını ve parolanı sen belirlersin"],
          ["İndirme", "Virtual Machines bölümü (.7z)", "Installer Images bölümü (.iso)"],
          ["Önerilen kişi", "Hızlı laboratuvar kuracaklar", "Sıfırdan öğrenmek isteyenler"],
        ]}
      />
      <SectionTitle title="Önce bilmen gerekenler" />
      <InfoCards
        items={[
          { icon: "🔗", title: "Resmî indirme", body: "İndirmeyi yalnızca kali.org/get-kali sayfasından yap. Sürüm numaraları değişir; sayfadaki güncel imajı kullan." },
          { icon: "🔐", title: "SHA256 doğrulama", body: "SHA256, dosyanın parmak izidir. Resmî sayfadaki değerle eşleşmiyorsa dosya bozuk veya değiştirilmiş olabilir. İleri adım: Kali, imzalı SHA256SUMS dosyasının GPG ile doğrulanmasını da anlatır." },
          { icon: "🗜️", title: "Arşivi açma", body: "Hazır imajlar .7z biçimindedir. Windows'ta 7-Zip, macOS'ta Keka/p7zip, Linux'ta 7z kullanabilirsin." },
          { icon: "📥", title: "İçe aktarma", body: "VirtualBox'ta Add (.vbox dosyası), VMware'de Open (.vmx dosyası)." },
          { icon: "🔑", title: "İlk giriş", body: "Resmî hazır imajda kullanıcı: kali, parola: kali. Girişten sonra parolayı değiştir." },
          { icon: "🧰", title: "Guest Additions / VMware Tools", body: "Ekran boyutlandırma ve pano gibi özellikleri sağlar. Resmî hazır imajlarda gerekli bileşenler hazır gelir; ISO kurulumunda yükleyici bir sanal makine algılarsa gerekli paketleri kurar." },
          { icon: "🧮", title: "Mimari", body: "Intel/AMD için 64-bit (amd64), Apple Silicon Mac'ler için ARM64 imajı seçilir. Yanlış mimari çalışmaz." },
          { icon: "🧯", title: "Güvenlik", body: "Pano ve sürükle-bırakı kapalı tut; ağı NAT yap; temiz kurulumdan sonra snapshot al." },
        ]}
      />
      <p className="text-sm text-ag-muted">
        Resmî kaynaklar: <ExtLink href={LINKS.kaliGet}>İndirme</ExtLink> · <ExtLink href={LINKS.kaliVbox}>VirtualBox rehberi</ExtLink> · <ExtLink href={LINKS.kaliVmware}>VMware rehberi</ExtLink> · <ExtLink href={LINKS.kaliVerify}>İndirmeyi doğrulama</ExtLink> · <ExtLink href={LINKS.kaliDocs}>Dokümantasyon</ExtLink>
      </p>
    </>
  );
}

function Lab() {
  const [hv, setHv] = useState("vbox");
  const [arch, setArch] = useState("x86");
  const [goal, setGoal] = useState("fast");
  const method = goal === "fast" ? "A" : "B";
  const image = goal === "fast" ? (hv === "vbox" ? "Virtual Machines › VirtualBox" : "Virtual Machines › VMware") : "Installer Images › Installer";
  return (
    <div className="space-y-6">
      <SectionTitle kicker="Etkileşimli uygulama" title="Doğru yöntem ve doğru imaj">Önce kendi durumunu seç, sonra indirdiğin dosyayı SHA256 ile doğrula.</SectionTitle>
      <div className="card space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-sm font-semibold">Hypervisor
            <select className="field mt-1" value={hv} onChange={(e) => setHv(e.target.value)}>
              <option value="vbox">VirtualBox</option>
              <option value="vmware">VMware</option>
            </select>
          </label>
          <label className="text-sm font-semibold">Bilgisayar mimarisi
            <select className="field mt-1" value={arch} onChange={(e) => setArch(e.target.value)}>
              <option value="x86">Intel / AMD (x86_64)</option>
              <option value="arm">Apple Silicon (ARM64)</option>
            </select>
          </label>
          <label className="text-sm font-semibold">Amacım
            <select className="field mt-1" value={goal} onChange={(e) => setGoal(e.target.value)}>
              <option value="fast">Hızlı başlamak</option>
              <option value="learn">Kurulumu öğrenmek</option>
            </select>
          </label>
        </div>
        <Callout kind="ok" title={`Önerilen: Yöntem ${method}`}>
          <p>kali.org/get-kali sayfasında <strong>{image}</strong> bölümüne git. İmaj mimarisi olarak <strong>{arch === "x86" ? "64-bit (amd64)" : "ARM64"}</strong> seç.</p>
          {arch === "arm" && <p className="mt-1">Apple Silicon'da seçtiğin hypervisor'un ARM desteğini ve ARM64 imajının varlığını resmî sayfalardan doğrula.</p>}
          {method === "A" && <p className="mt-1">Sonraki adım: Üstteki &quot;Yöntem A&quot; sekmesinden rehberi başlat.</p>}
          {method === "B" && <p className="mt-1">Sonraki adım: Üstteki &quot;Yöntem B&quot; sekmesinden rehberi başlat.</p>}
        </Callout>
      </div>
      <HashChecker slug="kali-linux-kurulumu" />
    </div>
  );
}

export default function Lesson09() {
  return (
    <LessonShell
      slug="kali-linux-kurulumu"
      topic={<Topic />}
      lab={<Lab />}
      extra={[
        { id: "ga", label: "🧭 Yöntem A: Hazır imaj", content: <InstallGuide guide={GUIDES["kali-a"]} /> },
        { id: "gb", label: "🧭 Yöntem B: ISO ile kurulum", content: <InstallGuide guide={GUIDES["kali-b"]} /> },
      ]}
    />
  );
}
