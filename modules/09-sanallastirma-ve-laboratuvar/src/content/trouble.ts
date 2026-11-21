import type { Trouble } from "./types";

export const TROUBLE: Record<string, Trouble> = {
  vtx: {
    title: "VT-x / AMD-V devre dışı (sanallaştırma desteği kapalı)",
    causes: ["BIOS/UEFI içinde Intel Virtualization Technology (VT-x) veya AMD SVM / AMD-V kapalı.", "Başka bir sanallaştırma katmanı (ör. Hyper-V, Windows Hypervisor Platform) donanım özelliğini kullanıyor.", "Bilgisayar çok eski ya da işlemci sanallaştırmayı desteklemiyor."],
    fixes: ["Windows'ta Görev Yöneticisi > Performans > CPU ekranında 'Sanallaştırma: Etkin' yazıyor mu kontrol et.", "Kapalıysa bilgisayarı yeniden başlat ve üreticinin tuşuyla (çoğunlukla F2, F10, F12, Del veya Esc) BIOS/UEFI'ye gir.", "Advanced / CPU Configuration altında 'Intel Virtualization Technology', 'VT-x', 'SVM Mode' veya 'AMD-V' seçeneğini Enabled yap.", "Kaydedip çık, sanal makineyi tekrar başlat."],
    osNote: "Menü adları üreticiye göre değişir. Emin değilsen bilgisayarının kullanım kılavuzuna bak. Apple Silicon Mac'lerde BIOS yoktur; sanallaştırma işletim sistemi tarafından sağlanır.",
  },
  hyperv: {
    title: "Hyper-V veya başka bir hypervisor ile çakışma",
    causes: ["Windows'ta Hyper-V, Sanal Makine Platformu, Windows Hypervisor Platformu veya Core Isolation (Bellek Bütünlüğü) etkin olabilir.", "WSL2 veya Docker Desktop gibi araçlar Hyper-V altyapısını etkinleştirmiş olabilir."],
    fixes: ["VirtualBox ve VMware yeni sürümlerde Hyper-V açıkken de çalışabilir; ancak performans düşebilir. Önce uygulamanın verdiği uyarı metnini oku.", "Performans veya başlatma hatası varsa 'Windows özelliklerini aç veya kapat' bölümünde Hyper-V, Sanal Makine Platformu ve Windows Hypervisor Platformu seçeneklerini dikkatle incele.", "WSL2 veya Docker kullanıyorsan bunları kapatmadan önce işini yedekle; bir özelliği kapatmak diğer araçları etkileyebilir.", "Değişiklikten sonra bilgisayarı yeniden başlat."],
    osNote: "Windows 11 Home ve Pro sürümlerinde özellik adları farklı olabilir. Kurumsal/okul bilgisayarlarında bu ayarlar yönetici tarafından kilitlenmiş olabilir; kendi yetkin olmayan cihazda ayar değiştirme.",
  },
  iso: {
    title: "ISO dosyası bulunamadı veya açılamıyor",
    causes: ["İndirme tamamlanmamış veya dosya bozuk.", "Dosya yolu değişmiş ya da dosya silinmiş.", "Dosya .iso yerine .7z/.zip uzantılı arşiv olabilir.", "Dosyanın SHA256 değeri resmî değerle eşleşmiyor."],
    fixes: ["Dosyayı indirdiğin klasörde gerçekten var mı ve boyutu resmî sayfadaki boyuta yakın mı kontrol et.", "SHA256 değerini hesapla ve resmî değerle karşılaştır. Eşleşmiyorsa dosyayı yeniden indir.", "Sanal makine ayarları > Storage (VirtualBox) veya CD/DVD (VMware) bölümünden ISO yolunu yeniden seç.", "Arşiv aldıysan önce içinden .iso dosyasını çıkar."],
  },
  ram: {
    title: "Yetersiz RAM (sanal makine yavaş veya başlamıyor)",
    causes: ["Sanal makineye ayırdığın RAM, boş bellekten fazla.", "Birden fazla sanal makine aynı anda açık.", "Tarayıcı ve diğer uygulamalar host belleğini dolduruyor."],
    fixes: ["Sanal makineyi kapat (Power off / Shut down).", "Ayarlar > System (VirtualBox) veya Memory (VMware) bölümünde RAM'i düşür. Host RAM'inin en fazla yarısını ayırmak güvenli bir başlangıç kuralıdır.", "Diğer sanal makineleri ve gereksiz uygulamaları kapat.", "Gerekirse hafif masaüstü (Xfce) kullanan bir imajı tercih et."],
  },
  disk: {
    title: "Sanal disk alanı yetersiz veya host diskinde yer kalmadı",
    causes: ["Sanal disk boyutu çok küçük seçilmiş.", "Dinamik disk büyürken host diskte boş alan kalmamış.", "Snapshot'lar çok yer kaplıyor."],
    fixes: ["Host diskinde yeterli boş alan olduğundan emin ol (ör. 40–80 GB).", "Gereksiz snapshot'ları sil ve eski ISO dosyalarını temizle.", "Sanal makine kapalıyken disk boyutunu büyüt (VirtualBox: Virtual Media Manager; VMware: Hard Disk > Expand), sonra guest içinde bölümü genişlet.", "Disk büyütmeden önce mutlaka yedek veya klon al."],
  },
  vmstart: {
    title: "Sanal makine başlatılamıyor",
    causes: ["Sanallaştırma desteği kapalı veya çakışma var.", "Bozuk ya da eksik ISO / disk dosyası.", "Yetersiz RAM veya aşırı CPU çekirdeği atanmış.", "Güvenlik yazılımı sanallaştırma sürücülerini engelliyor.", "Sürücüler yüklü değil ya da kurulum eksik kalmış."],
    fixes: ["Ekrandaki hata kodunu ve mesajı oku; ilk ipucu orada.", "VT-x/AMD-V ve Hyper-V başlıklarındaki adımları kontrol et.", "RAM'i ve CPU sayısını azalt (ör. 2 çekirdek, 2–4 GB).", "VirtualBox veya VMware'i resmî sayfadan indirdiğin güncel sürümle yeniden kur ve sistemi yeniden başlat.", "Sorun sürüyorsa sanal makine günlüğüne (VirtualBox: VM > Show Log) bak."],
    osNote: "macOS'ta sistem uzantılarına izin vermen gerekebilir (Sistem Ayarları > Gizlilik ve Güvenlik). Linux host'ta kernel modülleri ve Secure Boot durumu etkili olabilir.",
  },
  net: {
    title: "Ağ bağlantısı kurulamıyor (sanal makinede internet yok)",
    causes: ["Ağ adaptörü bağlı değil (kablo bağlı kutusu kapalı).", "Yanlış ağ modu seçilmiş (ör. Host-only veya Internal Network internete çıkmaz).", "Bridged modda yanlış fiziksel arayüz seçilmiş.", "Guest içinde ağ yöneticisi kapalı."],
    fixes: ["Ayarlar > Network bölümünde adaptörün etkin ve 'cable connected' olduğundan emin ol.", "Başlangıç için NAT modunu seç. NAT çoğu durumda en sorunsuz seçenektir.", "Guest içinde terminalde ip a komutuyla bir IP adresi alıp almadığını kontrol et.", "Bridged kullanıyorsan Wi-Fi veya Ethernet arayüzünü doğru seç; okul/iş ağlarında bridged engellenmiş olabilir."],
  },
  blackscreen: {
    title: "Siyah ekran veya açılış sorunu",
    causes: ["Video belleği yetersiz.", "3D hızlandırma uyumsuzluğu.", "Yanlış boot sırası ya da kurulum ortamı çıkarılmadan tekrar başlatma.", "Grafik denetleyici ayarı uyumsuz."],
    fixes: ["Sanal makineyi kapat, Display ayarından video belleğini artır (ör. 128 MB) ve 3D hızlandırmayı kapat.", "Boot sırasında Hard Disk'in optik sürücüden önce olduğundan emin ol.", "Birkaç dakika bekle; ilk açılışta sistem disk işlemi yapıyor olabilir.", "Guest Additions / VMware Tools / open-vm-tools paketlerinin kurulu olduğunu doğrula."],
  },
  apple: {
    title: "Apple Silicon (ARM) Mac'te x86 imajı çalışmıyor",
    causes: ["İndirdiğin ISO veya imaj amd64 (x86_64) mimarisi için hazırlanmış.", "ARM tabanlı Mac'te x86 sanal makineler doğrudan hızlandırılmış çalışmaz."],
    fixes: ["Resmî indirme sayfasında ARM64 / aarch64 imajını seç (Kali ve Ubuntu ARM64 imajı sunar).", "Hypervisor olarak Mac'in desteklenen sürümünü kullandığından emin ol (örn. VMware Fusion veya VirtualBox'ın ARM destekli sürümü; resmî sayfadan doğrula).", "x86 bir imaj zorunluysa emülasyon yavaş olacaktır; bu eğitim için ARM64 imajı önerilir."],
    osNote: "Desteklenen ürün ve sürümler zamanla değişir. Güncel durumu ilgili ürünün resmî indirme ve dokümantasyon sayfasından doğrula.",
  },
  admin: {
    title: "Kurulum sırasında izin / yönetici hatası",
    causes: ["Kurulum yönetici izniyle başlatılmadı.", "Güvenlik yazılımı sürücü yüklemesini engelledi.", "macOS sistem uzantısı izni verilmedi."],
    fixes: ["Kurulum dosyasına sağ tıklayıp 'Yönetici olarak çalıştır' seç (Windows).", "Ağ sürücüsü yükleme uyarısında yalnızca resmî yayıncıyı (Oracle / VMware) gördüğünde 'Yükle' de.", "macOS'ta Sistem Ayarları > Gizlilik ve Güvenlik bölümünde yazılıma izin ver ve yeniden başlat.", "Yönetici hakkın yoksa (okul/iş bilgisayarı) bilgi işlemle görüş."],
  },
  download: {
    title: "İndirilen dosya açılmıyor veya çalışmıyor",
    causes: ["İndirme yarım kaldı.", "Yanlış işletim sistemi veya mimari için paket indirilmiş.", "Arşivi açacak program yok (.7z için 7-Zip gerekir)."],
    fixes: ["Resmî indirme sayfasından işletim sistemine ve mimariye uygun paketi yeniden seç.", ".7z dosyaları için 7-Zip (Windows) veya p7zip / Keka (macOS, Linux) kullan.", "SHA256 değerini doğrula; uyuşmazsa dosyayı yeniden indir."],
  },
  login: {
    title: "Kali veya Ubuntu'ya giriş yapamıyorum",
    causes: ["Hazır Kali imajında kullanıcı adı ve parola kali / kali olarak gelir; büyük-küçük harf veya klavye düzeni karışmış olabilir.", "Kurulumda belirlediğin parolayı klavye düzeni farkı yüzünden yanlış giriyor olabilirsin."],
    fixes: ["Giriş ekranında klavye düzenini kontrol et (Türkçe Q ve İngilizce ABD farklıdır).", "Hazır Kali imajında kullanıcı adı: kali, parola: kali. Başarılı girişten sonra parolanı değiştir (passwd komutu).", "Parolayı gözle doğrulamak için yazarken göz simgesine bak (varsa)."],
  },
  update: {
    title: "Güncelleme komutu hata veriyor",
    causes: ["Sanal makinede internet yok.", "Paket depoları geçici olarak yanıt vermiyor.", "Başka bir paket yöneticisi işlemi arka planda çalışıyor."],
    fixes: ["Önce ağ bağlantısını kontrol et (ping -c 3 example.com).", "Birkaç dakika bekleyip komutu tekrar dene.", "Kali için sudo apt update ve ardından sudo apt full-upgrade, Ubuntu için sudo apt update ve sudo apt upgrade komutlarını kullan."],
  },
  display: {
    title: "Ekran küçük kalıyor, pano veya sürükle-bırak çalışmıyor",
    causes: ["Guest Additions / VMware Tools / open-vm-tools kurulu değil veya çalışmıyor.", "Sanal makine ayarında pano paylaşımı kapalı (güvenlik açısından bu normal olabilir)."],
    fixes: ["Kali ve Ubuntu genellikle kurulum sırasında VM'i algılayıp gerekli paketleri yükler; yüklenmemişse resmî Kali / Ubuntu rehberine göre kur.", "Yeniden başlat ve Görünüm (View) menüsünden otomatik yeniden boyutlandırmayı aç.", "Pano ve sürükle-bırak özelliklerini güvenlik gerekçesiyle kapalı tutman daha doğrudur; gerekirse yalnızca kısa süreli aç."],
  },
  vmwaredl: {
    title: "VMware indirme sayfasında dosyayı bulamıyorum",
    causes: ["Dosyalar Broadcom Support Portal üzerinde ve hesap girişi gerektiriyor.", "Ücretsiz indirmeler için doğru ürün ve sürüm ailesi seçilmemiş.", "Bölgeye veya hesap bilgilerine bağlı ek form (ticaret uyumluluğu) istenebilir."],
    fixes: ["Broadcom'un resmî bilgi bankası sayfasındaki yönergeleri izle ve oradan indirme sayfasına geç.", "Ücretsiz bir Broadcom Support Portal hesabı oluştur / giriş yap ve profilini doğru bilgilerle tamamla.", "İndirmeyi yalnızca Broadcom'un kendi sayfasından yap; üçüncü taraf siteler ve 'lisans anahtarı' paylaşan sayfalardan kaçın."],
    osNote: "Portal arayüzü ve adımlar zamanla değişebilir; güncel bilgi için Broadcom'un resmî dokümantasyonuna bak. Workstation Pro Windows ve Linux içindir; Mac için VMware Fusion kullanılır.",
  },
  installer: {
    title: "Kurulum sihirbazı disk bulamıyor veya takılıyor",
    causes: ["Sanal disk oluşturulmamış veya bağlanmamış.", "ISO yanlış bağlanmış ya da yarım indirilmiş.", "Kurulum sırasında ağ ayarı veya depo erişimi takılıyor."],
    fixes: ["Sanal makineyi kapat; Storage / Hard Disk ayarında sanal diskin ekli olduğunu kontrol et.", "ISO'yu yeniden doğrula ve bağla.", "Ağ bağlantısını NAT yap; kurulum ağ ayarında takılıyorsa ağ olmadan devam etmeyi dene.", "Kurulumu sıfırdan tekrar etmek gerekirse yeni bir sanal disk oluştur."],
  },
};
