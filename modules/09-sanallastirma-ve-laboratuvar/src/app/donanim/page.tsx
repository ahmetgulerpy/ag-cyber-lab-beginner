import type { Metadata } from "next";
import { MockScreen } from "@/components/MockScreen";
import { ResourcePlanner } from "@/components/ResourcePlanner";
import { Callout, DataTable, InfoCards, SectionTitle } from "@/components/ui";
import { B, C, L, S, T, sc } from "@/content/guides/h";

export const metadata: Metadata = { title: "Donanım ve Sistem Gereksinimleri – AG Cyber Lab Modül 09" };

export default function HardwarePage() {
  return (
    <div className="space-y-8">
      <div className="card !p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-ag-brand to-ag-accent px-6 py-6 text-white sm:px-8">
          <p className="text-xs font-bold tracking-[0.25em] text-ag-light">MODÜL 09 · HAZIRLIK</p>
          <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Donanım ve sistem gereksinimleri rehberi</h1>
          <p className="mt-1 text-sm text-ag-light">Sanal makine kurmadan önce bilgisayarının neye hazır olduğunu birlikte kontrol edelim.</p>
        </div>
      </div>

      <Callout kind="info" title="Herkesin bilgisayarı farklı">
        Aşağıdaki değerler genel başlangıç önerileridir; tek bir donanım yapılandırması herkes için zorunlu değildir. Daha az kaynakla da laboratuvar kurabilirsin: tek sanal makine, hafif masaüstü ve daha küçük disk yeterli olabilir.
      </Callout>

      <section className="space-y-4">
        <SectionTitle kicker="1" title="İşlemci ve sanallaştırma desteği" />
        <InfoCards
          items={[
            { icon: "🧠", title: "Intel VT-x", body: "Intel işlemcilerdeki donanım sanallaştırma desteği. BIOS/UEFI'de 'Intel Virtualization Technology' gibi adlarla görünür." },
            { icon: "🔴", title: "AMD-V (SVM)", body: "AMD işlemcilerdeki karşılığı. BIOS/UEFI'de 'SVM Mode' veya 'AMD-V' adıyla görünür." },
            { icon: "⚙️", title: "BIOS/UEFI ayarı", body: "Birçok bilgisayarda bu özellik kapalı gelir. Açmak için açılışta üreticinin tuşuyla BIOS/UEFI'ye girilir. Menü adları üreticiye göre değişir." },
          ]}
        />
        <DataTable
          head={["İşletim sistemi", "Sanallaştırma açık mı? Nasıl kontrol edilir?"]}
          rows={[
            ["Windows 10/11", "Görev Yöneticisi > Performans > CPU: 'Sanallaştırma: Etkin' yazısına bak."],
            ["Linux", "Terminalde: lscpu | grep -i virtualization veya grep -E 'vmx|svm' /proc/cpuinfo"],
            ["macOS (Intel)", "Sistem özelliklerinden işlemci modelini kontrol et; Intel Mac'lerde sanallaştırma genelde destekli ve etkindir."],
            ["macOS (Apple Silicon)", "BIOS ayarı yoktur; sanallaştırma işletim sistemi tarafından sağlanır. ARM64 imajlara ihtiyacın olacak."],
          ]}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <MockScreen
            s={sc("BIOS/UEFI – temsili şema", [T("Advanced › CPU Configuration", { bold: true }), C("Intel Virtualization Technology (VT-x)", true, 1), C("AMD SVM Mode (AMD-V)", true, 1), L(["Secure Boot", "Fast Boot"]), B("F10: Save & Exit", 2, true)], { 1: "Bunu 'Enabled' (Açık) yap. Adı üreticiye göre farklıdır.", 2: "Kaydet ve çık; bilgisayar yeniden başlar." }, { kind: "term" })}
          />
          <div className="space-y-3">
            <Callout kind="tip" title="BIOS'a girerken">
              Bilgisayarı yeniden başlat ve logo çıkarken üreticinin tuşuna bas: çoğunlukla F2, F10, F12, Del veya Esc. Emin değilsen bilgisayarının kılavuzuna bak. Ayarı değiştirirken yalnızca sanallaştırma seçeneğine dokun.
            </Callout>
            <Callout kind="warn" title="Kurumsal bilgisayarlarda">
              Okul veya iş bilgisayarında BIOS ayarları kilitli olabilir ve değişiklik yapmak yetkili değilsin demektir. Kendi sahibi olmadığın cihazın ayarını değiştirme.
            </Callout>
            <Callout kind="info" title="Windows'ta Hyper-V">
              Windows'ta Hyper-V, Sanal Makine Platformu veya WSL2 etkinse VirtualBox/VMware performansı veya başlatma davranışı değişebilir. Ayrıntı için sanal makine rehberlerindeki sorun giderme bölümüne bak.
            </Callout>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle kicker="2" title="RAM, disk ve minimum / önerilen kaynaklar" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card space-y-2">
            <h3 className="font-bold text-ag-warn">Minimum (tek hafif VM, yavaş olabilir)</h3>
            <DataTable head={["Kaynak", "Değer"]} rows={[["İşlemci", "64-bit, VT-x/AMD-V destekli, 2 çekirdek"], ["RAM", "8 GB host (VM'e 2 GB)"], ["Boş disk", "40 GB (HDD ile yavaş)"], ["Ekran", "Fark etmez"]]} />
          </div>
          <div className="card space-y-2">
            <h3 className="font-bold text-ag-ok">Önerilen (rahat laboratuvar)</h3>
            <DataTable head={["Kaynak", "Değer"]} rows={[["İşlemci", "4+ çekirdek"], ["RAM", "16 GB host (iki VM aynı anda)"], ["Boş disk", "100–150 GB SSD"], ["Ağ", "Kararlı internet bağlantısı"]]} />
          </div>
        </div>
        <InfoCards
          items={[
            { icon: "🧠", title: "RAM kapasitesi", body: "Host ve sanal makineler belleği paylaşır. Başlangıç kuralı: host için en az 4 GB veya RAM'in %40'ını bırak." },
            { icon: "💾", title: "SSD ve boş disk", body: "SSD, sanal makine açılışını ve kurulumunu belirgin biçimde hızlandırır. Dinamik disk büyürken host diskinde boş alan kalmalıdır." },
            { icon: "🖥️", title: "İşletim sistemi uyumluluğu", body: "VirtualBox Windows, macOS ve Linux host'ları destekler; VMware Workstation Pro Windows ve Linux içindir (Mac için Fusion). Güncel desteklenen sürümleri resmî dokümanlardan kontrol et." },
          ]}
        />
      </section>

      <section className="space-y-4">
        <SectionTitle kicker="3" title="ARM ve x86_64 mimarisi farkı" />
        <DataTable
          head={["", "x86_64 (Intel / AMD)", "ARM64 (örn. Apple Silicon)"]}
          rows={[
            ["Tipik cihazlar", "Çoğu Windows/Linux PC ve Intel Mac", "M serisi Mac'ler, bazı Windows ARM / Linux cihazlar"],
            ["İmaj seçimi", "amd64 (64-bit) ISO / VM imajları", "arm64 / aarch64 imajları gerekir"],
            ["VM'de çalışma", "Hızlandırılmış (VT-x / AMD-V)", "Yalnızca ARM64 imajları hızlandırılmış çalışır; x86 imajı emülasyonla yavaş olur"],
            ["Hypervisor desteği", "VirtualBox, VMware Workstation Pro", "Destek ürün ve sürüme göre değişir; güncel durumu resmî sayfadan doğrula"],
          ]}
        />
        <Callout kind="warn" title="Önemli">Mimariyi bilmeden ISO indirme. Yanlış mimari, kurulumun hiç başlamamasına neden olur.</Callout>
      </section>

      <section className="space-y-4">
        <SectionTitle kicker="4" title="Kaynak planlama aracı">Kendi bilgisayarının değerlerini gir; hangi sanal makine senaryolarının rahat çalışacağını gör.</SectionTitle>
        <ResourcePlanner />
      </section>
    </div>
  );
}
