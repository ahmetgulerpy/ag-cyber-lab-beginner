import type { Question } from "./types";
import { mc, mu, ord } from "./qh";
import { B, L, R, S, Sl, T, Tm, sc } from "./guides/h";

export const QUIZZES: Record<string, Question[]> = {
  "virtualization-nedir": [
    mc("v1-1", "Sanallaştırmada 'host' neyi ifade eder?", [
      ["Sanal makinelerin üzerinde çalıştığı gerçek bilgisayar ve işletim sistemi", "Doğru: host, kaynakları sağlayan fiziksel makinedir."],
      ["Sanal makinenin içindeki işletim sistemi", "Bu tanım 'guest' (konuk) için geçerlidir; host ise misafirleri barındıran taraftır."],
      ["Sanal diskin dosya biçimi", "Disk biçimi (ör. VDI, VMDK) host/guest ilişkisini tanımlamaz."],
      ["İnternet sağlayıcısı", "İnternet sağlayıcının sanallaştırmadaki host kavramıyla ilgisi yoktur."],
    ], 0),
    mc("v1-2", "Host'ta 16 GB RAM var. Üç sanal makineye 8'er GB RAM atayıp aynı anda çalıştırmaya çalışıyorsun. Ne olur?", [
      ["Hepsi sorunsuz çalışır, çünkü RAM sanaldır", "Sanal RAM da gerçek RAM'den ayrılır; toplam ihtiyaç 24 GB'tır ve host'un 16 GB'ını aşar."],
      ["Host ve sanal makineler çok yavaşlar veya makineler başlamaz", "Doğru: toplam atama fiziksel RAM'i aşar, bu yüzden sistem yavaşlar ya da başlatma reddedilir."],
      ["Hypervisor otomatik olarak daha fazla RAM üretir", "Hypervisor fiziksel kaynak üretemez; var olanı paylaştırır."],
      ["Sanal makineler yalnızca disk kullanır", "Sanal makineler CPU, RAM ve disk kaynaklarını birlikte kullanır."],
    ], 1, { format: "Senaryo", scenario: "16 GB RAM'li dizüstü bilgisayarında ders için üç sanal makine kurmak istiyorsun." }),
    mc("v1-3", "Şemada 2 numaralı katmana tıkladığında hangi bileşenin açıklaması çıkmalı?", [
      ["Host işletim sistemi", "Host işletim sistemi altta, hypervisor ise onun üzerinde veya yanında çalışır; işaretli satır hypervisor'dur."],
      ["Hypervisor", "Doğru: sanal makineleri oluşturup donanımı paylaştıran yazılım katmanı hypervisor'dur."],
      ["Guest uygulama", "Uygulamalar en üstte, guest işletim sisteminin içindedir."],
      ["Fiziksel disk", "Fiziksel disk donanım katmanındadır, şemada 1. katman."],
    ], 1, { format: "Görsel yorumlama", screen: sc("Sanallaştırma katmanları", [L([{ v: "Fiziksel donanım (CPU, RAM, disk)", sub: "1" }, { v: "Host işletim sistemi", sub: "" }, { v: "Katman 2: sanal makineleri yöneten yazılım", hl: 2, sub: "2" }, { v: "Sanal makineler (Guest OS)", sub: "3" }])]) }),
    mu("v1-4", "Siber güvenlik eğitiminde sanallaştırmanın faydalarını seç.", [
      ["Gerçek sistemi bozmadan güvenle deneme yapabilmek", "Doğru: hatalar sanal makineye sınırlı kalır."],
      ["Snapshot ile hatalı durumdan hızlı dönmek", "Doğru: temiz duruma dönüş laboratuvar için çok değerlidir."],
      ["Aynı bilgisayarda farklı işletim sistemlerini çalıştırmak", "Doğru: Kali ve Ubuntu gibi sistemler yan yana çalışabilir."],
      ["Başkasının sistemine izinsiz test yapmayı yasal hale getirmek", "Yanlış: sanallaştırma yasal izin yerine geçmez. Yetkisiz test her zaman yasaktır."],
    ], [0, 1, 2], "Sanallaştırma güvenli, geri alınabilir ve esnek bir laboratuvar sağlar; ancak yasal sınırları değiştirmez."),
    ord("v1-5", "Katmanları donanımdan uygulamaya doğru alttan üste sırala.", ["Fiziksel donanım", "Host işletim sistemi", "Hypervisor", "Guest işletim sistemi", "Guest içindeki uygulamalar"], "Altta gerçek donanım vardır; üzerine host OS, onun üzerine hypervisor, ardından guest OS ve uygulamalar gelir."),
  ],
  "hypervisor-mantigi": [
    mc("v2-1", "Type 1 hypervisor'un ayırt edici özelliği nedir?", [
      ["Doğrudan donanım üzerinde çalışır", "Doğru: araya genel amaçlı bir host işletim sistemi girmez (örn. VMware ESXi, Hyper-V)."],
      ["Bir uygulama gibi host işletim sistemi içinde çalışır", "Bu tanım Type 2 hypervisor içindir."],
      ["Sadece Linux'ta çalışır", "Bu doğru değil; Type 1 ürünlerin farklı platformları vardır."],
      ["Hiç RAM kullanmaz", "Her hypervisor kaynak kullanır."],
    ], 0),
    mc("v2-2", "Öğrenci dizüstü bilgisayarında Windows üzerine VirtualBox kuruyor. VirtualBox hangi türdür?", [
      ["Type 1", "Type 1 doğrudan donanımda çalışır; VirtualBox ise Windows üzerinde çalışan bir uygulamadır."],
      ["Type 2", "Doğru: host işletim sistemine kurulan hypervisor'lar Type 2'dir (VirtualBox, VMware Workstation)."],
      ["Hypervisor değildir", "VirtualBox bir hypervisor'dur."],
      ["Bir sanal disk türüdür", "Sanal disk farklı bir kavramdır."],
    ], 1, { format: "Senaryo", scenario: "Windows 11 yüklü kişisel dizüstü bilgisayarına VirtualBox kuruyorsun." }),
    mc("v2-3", "Bir veri merkezinde yüzlerce sanal sunucu yüksek performansla çalışacak. Hangi hypervisor yaklaşımı genelde tercih edilir?", [
      ["Type 1", "Doğru: doğrudan donanımda çalıştığı için ek işletim sistemi yükü azdır; sunucu ortamları için uygundur."],
      ["Type 2", "Type 2, ek bir host OS katmanı gerektirdiği için sunucu ölçeğinde genelde tercih edilmez."],
      ["Hiçbiri", "Veri merkezleri yoğun sanallaştırma kullanır."],
      ["Yalnızca konteyner", "Konteynerler farklı bir teknolojidir ve bu sorunun konusu değildir."],
    ], 0, { format: "Senaryo", scenario: "Şirket yüzlerce sanal sunucuyu birkaç güçlü fiziksel sunucuda çalıştıracak." }),
    mc("v2-4", "Şemadaki mimari hangi hypervisor türünü gösteriyor?", [
      ["Type 1", "Şemada host işletim sistemi var; Type 1'de hypervisor doğrudan donanım üzerinde olurdu."],
      ["Type 2", "Doğru: donanım > host işletim sistemi > hypervisor uygulaması > sanal makineler sırası Type 2'dir."],
      ["Konteyner", "Şemada konteyner çalışma zamanı yok."],
      ["Fiziksel makine", "Sanal makineler gösteriliyor."],
    ], 1, { format: "Görsel yorumlama", screen: sc("Mimari", [L(["Fiziksel donanım", "Host işletim sistemi (Windows/macOS/Linux)", "Hypervisor uygulaması", "VM 1 – Kali  |  VM 2 – Ubuntu"])]) }),
    mu("v2-5", "Type 2 hypervisor için doğru ifadeleri seç.", [
      ["Kurulumu genellikle kolaydır", "Doğru: normal uygulama gibi kurulur."],
      ["Host işletim sistemi bulunur", "Doğru: Type 2 bir host OS üzerinde çalışır."],
      ["Öğrenme laboratuvarları için yaygındır", "Doğru: masaüstünde kolay kullanılır."],
      ["Donanımla host OS olmadan doğrudan konuşur", "Yanlış: bu Type 1'in tanımıdır."],
    ], [0, 1, 2], "Type 2 hypervisor host işletim sisteminin üzerinde çalışır; kurulum ve kullanım kolaylığı nedeniyle eğitimde tercih edilir.", { format: "Çoktan seçmeli" }),
  ],
  virtualbox: [
    mc("v3-1", "VirtualBox'ı hangi kaynaktan indirmelisin?", [
      ["Resmî virtualbox.org indirme sayfası", "Doğru: resmî kaynak güvenilirdir ve güncel sürümü sunar."],
      ["Bir video açıklamasındaki rastgele bağlantı", "Güvenilmeyen bağlantılar zararlı yazılım içerebilir."],
      ["Torrent siteleri", "Resmî olmayan kaynaklar değiştirilmiş paket riski taşır."],
      ["Sosyal medyadaki paylaşılan dosya", "Kaynağı doğrulanamaz."],
    ], 0),
    ord("v3-2", "VirtualBox kurulumunu doğru sıraya diz.", ["Resmî indirme sayfasına git", "İşletim sistemine uygun paketi indir", "Kurulum dosyasını çalıştır ve izin ver", "Ağ bileşenlerinin kurulmasına izin ver", "VirtualBox'ı aç ve sürümü doğrula"], "Önce doğru kaynak, sonra doğru paket, ardından kurulum ve izinler gelir; en sonda doğrulama yapılır."),
    mc("v3-3", "Hazır bir sanal makine dosyasını (.vbox) VirtualBox'a eklemek için hangi düğmeyi kullanırsın?", [
      ["New", "'New' sıfırdan yeni makine oluşturur."],
      ["Add", "Doğru: 'Add' mevcut bir makineyi (.vbox) VirtualBox'a tanıtır."],
      ["Settings", "Settings seçili makinenin ayarlarını açar."],
      ["Start", "Start seçili makineyi çalıştırır."],
    ], 1, { format: "Görsel yorumlama", screen: sc("VirtualBox Manager", [R(B("New"), B("Add", 1), B("Settings"), B("Start"))], { 1: "Hangi düğme?" }) }),
    mc("v3-4", "Sanal makine oluştururken 64-bit işletim sistemi seçenekleri listede görünmüyor. İlk kontrol edeceğin şey nedir?", [
      ["BIOS/UEFI'de VT-x/AMD-V sanallaştırma desteği açık mı", "Doğru: kapalı sanallaştırma 64-bit konuk seçeneklerini gizleyebilir."],
      ["Monitör çözünürlüğü", "Çözünürlük sanallaştırma desteğiyle ilgili değildir."],
      ["Klavye düzeni", "Klavye düzeni bu sorunu çözmez."],
      ["Tarayıcı sürümü", "Tarayıcı bu sorunla ilişkisiz."],
    ], 0, { format: "Senaryo", scenario: "VirtualBox'ı kurdun ama yeni makine sihirbazında sadece 32-bit seçenekler çıkıyor." }),
    mc("v3-5", "VirtualBox Extension Pack ilk laboratuvar için gerekli midir?", [
      ["Hayır, temel laboratuvar için gerekli değildir", "Doğru: temel sanal makine kullanımı için ihtiyacın yok; ihtiyaç doğarsa resmî sayfadan lisans koşullarına göre değerlendir."],
      ["Evet, olmadan hiçbir makine açılmaz", "Makineler Extension Pack olmadan açılır."],
      ["Evet, ISO bağlamak için gerekir", "ISO bağlama temel işlevdir."],
      ["Sadece Windows guest için gerekir", "Böyle bir zorunluluk yoktur."],
    ], 0),
  ],
  vmware: [
    mc("v4-1", "VMware Workstation Pro'nun güncel kullanım koşulları için hangi kaynağa güvenmelisin?", [
      ["Broadcom'un resmî sayfaları", "Doğru: lisans ve indirme koşulları zamanla değişebilir; resmî kaynak esastır."],
      ["Eski bir forum konusu", "Eski içerik geçerliliğini yitirmiş olabilir."],
      ["Lisans anahtarı paylaşan siteler", "Güvenilmezdir; zararlı yazılım ve yasal risk taşır."],
      ["Arkadaşının hatırladığı bilgi", "Doğrulanmamış bilgi risklidir."],
    ], 0),
    mc("v4-2", "Apple Silicon (M serisi) Mac kullanan öğrenci VMware Workstation Pro kurabilir mi?", [
      ["Hayır, Workstation Pro Windows ve Linux içindir; Mac için VMware Fusion vardır", "Doğru: ürün ailesi işletim sistemine göre ayrılır; güncel destek için resmî sayfayı kontrol et."],
      ["Evet, tüm sistemlerde çalışır", "Workstation Pro macOS host'u desteklemez."],
      ["Evet ama sadece Kali ile", "Guest seçimi host desteğini değiştirmez."],
      ["Yalnızca internet bağlantısı varsa", "Bağlantı sorunun konusu değil."],
    ], 0, { format: "Senaryo", scenario: "Bir arkadaşın M serisi Mac'inde VMware Workstation Pro indirmeye çalışıyor." }),
    mu("v4-3", "VirtualBox ve VMware karşılaştırmasında doğru ifadeleri seç.", [
      ["Her ikisi de masaüstü (Type 2) sanallaştırma ürünleridir", "Doğru: ikisi de host OS üzerinde çalışır."],
      ["Her ikisi de snapshot ve klon özelliği sunar", "Doğru: temel laboratuvar özellikleri iki üründe de vardır."],
      ["VMware indirmeleri Broadcom Support Portal üzerinden yapılır", "Doğru: güncel indirme süreci bu yöndedir."],
      ["VMware için ücretsiz lisans anahtarını internetten bulmalısın", "Yanlış: güncel koşullarda anahtar gerekmez ve paylaşılan anahtarlar güvenli değildir."],
    ], [0, 1, 2], "Her iki ürün de eğitim için uygundur; resmî kaynakları ve güncel lisans koşullarını esas al.", { format: "Çoktan seçmeli" }),
    mc("v4-4", "VMware Workstation Pro ana ekranında hazır bir sanal makineyi (.vmx) açmak için hangi eylemi seçersin?", [
      ["Create a New Virtual Machine", "Bu, sıfırdan yeni bir makine oluşturur."],
      ["Open a Virtual Machine", "Doğru: mevcut makineyi açmak için kullanılır."],
      ["Connect to a Remote Server", "Uzak sunucuya bağlanmak içindir."],
      ["Help > About", "Bu sürüm bilgisini gösterir."],
    ], 1, { format: "Görsel yorumlama", screen: sc("VMware Workstation Pro – Home", [R(B("Create a New Virtual Machine", 1), B("Open a Virtual Machine", 2), B("Connect to a Remote Server", 3))]) }),
    mu("v4-5", "VMware kurulumunun başarılı olduğunu anlamak için hangi kontrolleri yaparsın?", [
      ["Uygulamanın Home ekranının açıldığını görmek", "Doğru: temel çalışma kanıtıdır."],
      ["Help > About'tan sürümü kontrol etmek", "Doğru: sürüm doğrulaması yapar."],
      ["Virtual Network Editor'de sanal ağları görmek", "Doğru: ağ bileşenleri kurulmuş demektir."],
      ["Bilgisayarın duvar kağıdının değiştiğini görmek", "Yanlış: kurulumun duvar kağıdıyla ilgisi yoktur."],
    ], [0, 1, 2], "Uygulamanın açılması, sürüm bilgisi ve ağ bileşenleri kurulumun sağlıklı olduğunu gösterir."),
  ],
  "sanal-makine-kurulumu": [
    mc("v5-1", "8 GB RAM'li bir bilgisayarda tek bir Kali/Ubuntu sanal makinesi için mantıklı başlangıç RAM'i hangisidir?", [
      ["2048–4096 MB", "Doğru: host'a yeterli bellek bırakır ve sanal makineyi çalıştırır."],
      ["7168 MB", "Host işletim sistemine neredeyse hiç bellek kalmaz; sistem donabilir."],
      ["512 MB", "Grafik masaüstü için çok düşüktür, sistem çok yavaş olur."],
      ["16384 MB", "Fiziksel RAM'den fazladır; mümkün değildir."],
    ], 0),
    ord("v5-2", "VirtualBox'ta sanal makine oluşturma sırasını düzenle.", ["New'e tıkla", "İsim, tür ve ISO'yu seç", "RAM ve CPU'yu belirle", "Sanal diski oluştur", "Özeti kontrol et ve Finish'e bas", "Ayarları kontrol et ve Start ile başlat"], "Sihirbaz bu sırayı izler; ayarların son kontrolü başlatmadan önce yapılır."),
    mc("v5-3", "Aşağıdaki görselde 16 GB RAM'li bilgisayar için ne sorun var?", [
      ["14 GB RAM ayırmak host'a çok az bellek bırakır", "Doğru: host'un belleği yetersiz kalır, sistem yavaşlar."],
      ["CPU değeri çok yüksek", "Sorun CPU değil, RAM miktarıdır."],
      ["Disk boyutu 40 GB olamaz", "40 GB makul bir değerdir."],
      ["Hiçbir sorun yok", "Host'ta yalnızca birkaç GB kalır; bu riskli."],
    ], 0, { format: "Görsel yorumlama", screen: sc("Hardware", [Sl("Base Memory", "14336 MB", 92, 1), Sl("Processors", "2", 25), T("Host RAM: 16 GB", { muted: true })], { 1: "Bu değeri değerlendir." }) }),
    mc("v5-4", "Ubuntu için aşağıdakilerden hangisi doğru ve dengeli bir yapılandırmadır?", [
      ["4 GB RAM, 2 CPU, 40 GB dinamik disk, NAT", "Doğru: dengeli, güvenli bir başlangıç yapılandırmasıdır."],
      ["512 MB RAM, 1 CPU, 5 GB disk, Bridged", "Kaynaklar çok düşük ve kurulum için yetersiz; Bridged de gerekmedikçe tercih edilmez."],
      ["Host RAM'inin %90'ı, tüm CPU çekirdekleri", "Host'u kullanılamaz hale getirir."],
      ["2 GB RAM, 1 CPU, 4 GB disk, Internal", "Disk 25 GB asgarinin altında; Internal ağ internete çıkmaz."],
    ], 0, { format: "Doğru yapılandırma" }),
    mc("v5-5", "'Dinamik olarak ayrılan' (Dynamically allocated) sanal disk ne demektir?", [
      ["Disk dosyası kullanıldıkça host diskinde büyür", "Doğru: ayrılan maksimum boyuta kadar gerektikçe genişler."],
      ["Disk dosyası baştan tüm alanı kaplar", "Bu 'Pre-allocate' / sabit boyutlu disk için geçerlidir."],
      ["Disk host'tan tamamen bağımsızdır", "Disk dosyası host diskinde durur."],
      ["Disk otomatik olarak şifrelenir", "Şifreleme ayrı bir ayardır."],
    ], 0),
  ],
  "snapshot-ve-clone": [
    mc("v6-1", "Snapshot ve Clone arasındaki temel fark nedir?", [
      ["Snapshot aynı makinenin belirli anına dönüş noktasıdır; Clone ise ayrı, bağımsız bir kopya makine oluşturur", "Doğru: biri zaman içinde geri dönüş, diğeri yeni makine kopyasıdır."],
      ["İkisi de aynı şeydir", "Amaçları ve sonuçları farklıdır."],
      ["Snapshot yeni makine oluşturur, Clone geri dönüş sağlar", "Tam tersi doğrudur."],
      ["Clone sadece RAM'i kopyalar", "Clone disk ve yapılandırmayı da kopyalar."],
    ], 0),
    mc("v6-2", "Yanlış bir ağ ayarı yaptın ve sanal makine internete çıkamıyor. Önceden snapshot aldıysan en hızlı çözüm nedir?", [
      ["Snapshot'a geri dönmek", "Doğru: sistem snapshot anındaki duruma döner."],
      ["Host bilgisayarı yeniden kurmak", "Gereksiz ve zararlı bir adım; sorun yalnızca sanal makinede."],
      ["Yeni bir ISO indirmek", "ISO ile ilgisi yok."],
      ["Hiçbir şey yapmamak", "Sorun kendiliğinden çözülmeyecektir."],
    ], 0, { format: "Senaryo", scenario: "Kali sanal makinende ağ yapılandırma dosyasını bozdun." }),
    mc("v6-3", "Bağlantılı (linked) klon oluşturduktan sonra ana (parent) makineyi veya snapshot'ını silersen ne olur?", [
      ["Bağlantılı klon çalışamaz hale gelebilir", "Doğru: linked clone ana diske bağımlıdır."],
      ["Hiçbir şey olmaz", "Linked clone ana diske bağımlı olduğundan sorun çıkar."],
      ["Klon otomatik olarak tam klona dönüşür", "Otomatik dönüşüm olmaz."],
      ["Host bilgisayar kapanır", "Böyle bir etki yoktur."],
    ], 0),
    ord("v6-4", "Snapshot laboratuvarını doğru sıraya diz.", ["Temiz sistem durumunu hazırla", "Snapshot al", "Sistemde değişiklik yap", "Hata oluştu", "Snapshot'a geri dön"], "Önce güvenli nokta oluşturulur, sonra risk alınır, hata olursa geri dönülür."),
    mu("v6-5", "Snapshot hakkında doğru ifadeleri seç.", [
      ["Zamanla disk alanı kaplar", "Doğru: değişiklikler biriktikçe fark dosyaları büyür."],
      ["Gerçek bir yedeğin yerine geçmez", "Doğru: sanal disk bozulursa snapshot'lar da risk altındadır; önemli veriyi ayrıca yedekle."],
      ["Riskli bir yapılandırmadan önce alınmalıdır", "Doğru: geri dönüş noktası böyle oluşur."],
      ["Sınırsız sayıda alınması performansı hiç etkilemez", "Yanlış: uzun snapshot zincirleri performansı düşürebilir."],
    ], [0, 1, 2], "Snapshot kullanışlı ama bir yedek değildir ve gereksiz çoğaltılmamalıdır.", { format: "Çoktan seçmeli" }),
  ],
  "nat-ve-bridged": [
    mc("v7-1", "NAT modundaki bir sanal makineye ağdaki başka bilgisayarlar doğrudan erişebilir mi?", [
      ["Hayır, varsayılan olarak erişemez; sanal makine host'un arkasında gizlidir", "Doğru: NAT'ta VM giden bağlantılar yapar, dışarıdan gelen bağlantılar port yönlendirme olmadan ulaşmaz."],
      ["Evet, her zaman erişebilir", "Bu Bridged için doğrudur."],
      ["Sadece Wi-Fi'da", "NAT'ın bu bağlantı türüyle ilgisi yok."],
      ["Sadece Linux ile", "Guest işletim sisteminin NAT mantığıyla ilgisi yoktur."],
    ], 0),
    mc("v7-2", "Aynı ev ağındaki ikinci bir bilgisayardan, kendi sanal web sunucuna doğrudan erişmek istiyorsun. Hangi mod en doğal çözümdür (güvenlik riskini bilerek)?", [
      ["Bridged Adapter", "Doğru: VM, fiziksel ağda kendi IP'siyle görünür. Ancak ağdaki diğer cihazlara da görünür; yalnızca güvenli ağda kullan."],
      ["Internal Network", "Yalnızca aynı internal ağdaki sanal makineler birbirini görür."],
      ["Not attached", "Hiçbir ağa bağlı değildir."],
      ["Host-only", "Yalnızca host ile erişim sağlar; dış cihazlar göremez."],
    ], 0, { format: "Senaryo", scenario: "Kendi ev ağında, kendi bilgisayarlarınla bir web sunucusu denemesi yapıyorsun." }),
    mc("v7-3", "NAT şemasına göre sanal makine (10.0.2.15) ev ağındaki bir telefona doğrudan görünür mü?", [
      ["Hayır, NAT cihazı adresi çevirir ve dışarıdan gelen bağlantıyı engeller", "Doğru: sanal makine host IP'sinin arkasında kalır."],
      ["Evet, aynı ağda sayılır", "Aynı ağda sayılması Bridged'e özgüdür."],
      ["Yalnızca bluetooth ile", "Konuyla ilgisiz."],
      ["Yalnızca firewall kapalıysa", "NAT'ın doğası gereği dış bağlantı yönlendirme olmadan ulaşmaz."],
    ], 0, { format: "Görsel yorumlama", screen: sc("NAT şeması", [L(["İnternet", "Ev yönlendiricisi 192.168.1.1", "Host 192.168.1.20", "NAT cihazı (hypervisor)", "VM 10.0.2.15"])]) }),
    mc("v7-4", "'Internal Network' modu için hangisi doğrudur?", [
      ["Yalnızca aynı internal ağa bağlı sanal makineler birbirine ulaşır; host bile erişemez", "Doğru: en yalıtılmış sanal ağ modlarından biridir."],
      ["Her zaman internete çıkar", "Internal Network internete çıkış sağlamaz."],
      ["Host ile tam erişim sağlar", "Host erişimi Host-only'nin özelliğidir."],
      ["Fiziksel ağda IP alır", "Bu Bridged'dir."],
    ], 0),
    mu("v7-5", "Host-only ağ için doğru ifadeleri seç.", [
      ["Host ve sanal makineler birbirine ulaşabilir", "Doğru: ortak özel bir ağ oluşur."],
      ["Varsayılan olarak internet çıkışı sağlamaz", "Doğru: izolasyon avantajıdır."],
      ["Fiziksel ağdaki cihazlar sanal makineye doğrudan erişemez", "Doğru: dışarıya kapalıdır."],
      ["Sanal makine fiziksel router'dan IP alır", "Yanlış: bu Bridged için geçerlidir."],
    ], [0, 1, 2], "Host-only, laboratuvar içi iletişim ve dışarıdan izolasyon için uygundur.", { format: "Çoktan seçmeli" }),
  ],
  "izole-laboratuvar": [
    mc("v8-1", "Zafiyetli bir test makinesini hangi ağ yapılandırmasında çalıştırmak en güvenlidir?", [
      ["Internal veya Host-only (internete kapalı)", "Doğru: dış ağdan yalıtılmıştır."],
      ["Bridged", "Test makinesini fiziksel ağa açmak diğer cihazları riske atar."],
      ["Bridged + paylaşılan klasör", "Hem ağ hem dosya riskini artırır."],
      ["Herkese açık Wi-Fi", "Kontrolün dışında riskli bir ortamdır."],
    ], 0),
    mc("v8-2", "Tasarladığın laboratuvarda Kali ile hedef makine aynı Internal Network'e bağlı ve hedefin internet erişimi yok. Bu tasarım için ne söylenebilir?", [
      ["İyi izole edilmiştir; Kali sadece lab ağındaki hedefle konuşur", "Doğru: dış ağa kapalı lab için ideal bir temel tasarımdır."],
      ["Çok risklidir", "İnternete açık olmadığı için risk düşüktür."],
      ["Çalışmaz", "VM'ler aynı internal ağda iletişim kurabilir."],
      ["Host'u etkiler", "Internal ağ host'tan ayrıdır."],
    ], 0, { format: "Senaryo", scenario: "Kali ve bir hedef VM'i yalnızca aynı Internal Network adaptörüne bağladın." }),
    mu("v8-3", "Güvenli bir başlangıç laboratuvarı için hangi ayarları seçersin?", [
      ["Pano paylaşımı: kapalı", "Doğru: pano üzerinden veri/komut sızması engellenir."],
      ["Paylaşılan klasör: yok", "Doğru: host dosyalarını riske atmaz."],
      ["Hedef makine ağı: Internal veya Host-only", "Doğru: dışarıdan izole eder."],
      ["Hedef makine Bridged", "Yanlış: hedefi fiziksel ağa açar."],
    ], [0, 1, 2], "Kapalı pano, paylaşılan klasör olmaması ve izole ağ güvenli laboratuvarın temelidir."),
    mc("v8-4", "Şemadaki yapılandırmada en büyük risk nedir?", [
      ["Hedef VM'in Bridged adaptörle fiziksel ağa açık olması", "Doğru: zafiyetli makine ev/okul ağındaki cihazlara görünür hale gelir."],
      ["Kali'nin Host-only ağa bağlı olması", "Host-only izole bir ağdır, risk yaratmaz."],
      ["VM isimlerinin İngilizce olması", "İsimlendirme güvenlik riski değildir."],
      ["Snapshot almak", "Snapshot güvenlik önlemidir."],
    ], 0, { format: "Görsel yorumlama", screen: sc("Topoloji", [L([{ v: "Kali VM → Host-only", sub: "güvenli" }, { v: "Hedef VM → Host-only + Bridged", sub: "?", hl: 1 }])], { 1: "Bu satırı değerlendir." }) }),
    mc("v8-5", "Paylaşılan klasör neden riskli olabilir?", [
      ["Guest'teki zararlı yazılım host dosyalarını okuyabilir veya değiştirebilir", "Doğru: izolasyonu zayıflatır."],
      ["Klasör renkli görünür", "Bu bir güvenlik riski değildir."],
      ["Klasör sanal makineyi yavaşlatmaz", "Riski anlatmaz."],
      ["Sadece Linux'ta risk vardır", "Risk işletim sisteminden bağımsızdır."],
    ], 0),
  ],
  "kali-linux-kurulumu": [
    ord("v9-1", "Yöntem A (hazır imaj) adımlarını sırala.", ["Resmî Kali sayfasından imajı indir", "SHA256 değerini doğrula", "Arşivi aç (.7z)", "VirtualBox'ta Add / VMware'de Open ile içe aktar", "Başlat ve giriş yap", "Parolayı değiştir"], "İndir, doğrula, aç, içe aktar, başlat ve parolayı değiştir sırası güvenli yoldur."),
    mc("v9-2", "Resmî hazır Kali VM imajında varsayılan kullanıcı adı ve parola nedir ve ne yapmalısın?", [
      ["kali / kali; girişten sonra parolayı değiştirmelisin", "Doğru: varsayılan bilgiler herkesçe bilinir."],
      ["root / toor; hiç değiştirmemelisin", "Güncel resmî imajlarda varsayılan kali/kali'dir; ayrıca parola değiştirmek önerilir."],
      ["admin / admin", "Resmî Kali imajının varsayılanı bu değil."],
      ["Parola yoktur", "Parola vardır."],
    ], 0),
    mc("v9-3", "İndirdiğin Kali dosyasının SHA256 değeri resmî sayfadaki değerle eşleşmiyor. Ne yaparsın?", [
      ["Dosyayı silip yeniden indiririm ve çalıştırmam", "Doğru: eşleşmeyen dosya bozuk veya değiştirilmiş olabilir."],
      ["Önemli değil, kullanırım", "Bu güvenlik riskidir."],
      ["Hash değerini resmî sayfada değiştiririm", "Resmî sayfayı değiştiremezsin ve mantıksızdır."],
      ["Sanal makineye kurup deneyim", "Önce doğrulama yapılır."],
    ], 0, { format: "Senaryo", scenario: "Hesapladığın SHA256 değeri sayfadakiyle son 6 karakterde farklı." }),
    mc("v9-4", "Kali yükleyicisinin disk bölümleme ekranında sanal diske kurulum için en güvenli ve basit seçenek hangisidir?", [
      ["Guided – use entire disk (tek bölüm)", "Doğru: boş sanal diskte en kolay seçenektir."],
      ["Manual", "İleri düzeydir; yanlış bölümleme kurulumu bozabilir."],
      ["Encrypted LVM", "İleri düzey; laboratuvar sanal diskinde zorunlu değil."],
      ["Host diskini seç", "Sanal makinede host diski zaten görünmez ve riskli bir yaklaşımdır."],
    ], 0, { format: "Görsel yorumlama", screen: sc("Partition disks", [L([{ v: "Guided – use entire disk", sel: true }, "Guided – use entire disk and set up LVM", "Guided – ... encrypted LVM", "Manual"])]) }),
    mc("v9-5", "Apple Silicon (M serisi) bir Mac'te Kali kurmak için hangi imajı seçmelisin?", [
      ["ARM64 imajı", "Doğru: işlemci mimarisine uygun imaj gerekir."],
      ["amd64 (x86_64) imajı", "x86 imajları ARM işlemcide doğrudan çalışmaz."],
      ["Fark etmez", "Mimari uyumu şarttır."],
      ["32-bit imaj", "32-bit imaj uygun değildir."],
    ], 0),
  ],
  "ubuntu-kurulumu": [
    mc("v10-1", "Ubuntu LTS ne anlama gelir?", [
      ["Uzun süreli destek alan sürüm", "Doğru: daha uzun güvenlik güncellemesi alır, öğrenme ortamı için uygundur."],
      ["Yalnızca bir yıl desteklenen deneme sürümü", "Bu LTS değil, ara sürümler için geçerlidir."],
      ["Sunucu olmayan sürüm", "LTS hem masaüstü hem sunucuda bulunur."],
      ["Ücretli sürüm", "LTS ücretsiz indirilebilir."],
    ], 0),
    ord("v10-2", "Ubuntu ISO ile kurulum adımlarını sırala.", ["Resmî sayfadan LTS ISO'sunu indir ve doğrula", "Sanal makineyi oluştur (RAM, CPU, disk)", "ISO'yu bağla ve başlat", "Dil ve klavyeyi seç", "Disk ve hesap ayarlarını yap", "Kurulumu bitir, ISO'yu çıkar ve yeniden başlat", "Güncellemeleri kontrol et"], "Önce hazırlık, sonra sanal makine ve kurulum sihirbazı; en sonda güncelleme gelir."),
    mc("v10-3", "Ubuntu yükleyicisinde 'Erase disk and install Ubuntu' seçeneğini görünce paniğe kapılan bir arkadaşına ne söylersin?", [
      ["Sanal makinede yalnızca boş sanal diski siler; gerçek diskine dokunmaz", "Doğru: yine de gerçek bilgisayara kurarken çok dikkatli olunmalı."],
      ["Host bilgisayarındaki tüm dosyalar silinir", "Sanal diskin host diskindeki dosyalara erişimi yoktur."],
      ["Hiç seçme, kurulum yapılamaz", "Bu seçenek standart ve güvenlidir."],
      ["Manuel bölümleme zorunludur", "Zorunlu değildir."],
    ], 0, { format: "Senaryo", scenario: "Bir arkadaşın sanal makinede kurulum yaparken bu seçenekten korkuyor." }),
    mc("v10-4", "Aşağıdakilerden hangisi Ubuntu'yu bir VM içinde çalıştırmak için Canonical'ın belgelediği alternatif bir resmî araçtır?", [
      ["Multipass", "Doğru: Ubuntu resmî belgeleri Multipass ile VM oluşturmayı belirtir."],
      ["Resmî olmayan, internetten bulunmuş hazır 'Ubuntu VM' imajı", "Doğrulanamayan kaynaklar güvenlik riski taşır."],
      ["Crack'li hypervisor", "Yasa dışı ve güvenli değildir."],
      ["Kali ISO", "Bu Ubuntu değildir."],
    ], 0),
    mu("v10-5", "Kali ve Ubuntu için doğru karşılaştırmaları seç.", [
      ["Ubuntu genel amaçlı bir masaüstü/sunucu dağıtımıdır", "Doğru."],
      ["Kali, güvenlik testi araçlarıyla hazır gelen bir dağıtımdır", "Doğru: eğitim ve yetkili güvenlik testleri içindir."],
      ["Kali'yi günlük genel kullanım için ana sistem yapmak önerilir", "Yanlış: günlük genel kullanım için tasarlanmamıştır."],
      ["İkisi de sanal laboratuvarda çalıştırılabilir", "Doğru."],
    ], [0, 1, 3], "Ubuntu genel amaçlı, Kali güvenlik odaklıdır; ikisi de sanal laboratuvarda çalışır.", { format: "Çoktan seçmeli" }),
  ],
  "laboratuvar-guvenligi": [
    mu("v11-1", "Aşağıdakilerden hangileri riskli bir laboratuvar yapılandırmasıdır?", [
      ["Test makinesinin Bridged modda çalışması", "Doğru: fiziksel ağa açılır."],
      ["Host'un ana klasörünün guest ile paylaşılması", "Doğru: dosya erişim riski."],
      ["Güncelleme görmemiş eski bir işletim sistemi", "Doğru: bilinen açıklar bulunabilir."],
      ["Resmî kaynaktan indirilip doğrulanmış ISO", "Yanlış: bu iyi bir uygulamadır."],
    ], [0, 1, 2], "Fiziksel ağa açık makine, gereksiz paylaşım ve eski sistem riski artırır; doğrulanmış resmî ISO ise güvenlidir."),
    mc("v11-2", "Bridged modun laboratuvarda dikkat gerektirmesinin ana nedeni nedir?", [
      ["Sanal makine fiziksel ağda kendi IP'siyle görünür ve ağdaki diğer cihazlarla etkileşebilir", "Doğru: izolasyon azalır."],
      ["İnternete hiç çıkamaması", "Aksine, internete çıkabilir."],
      ["Çok fazla RAM kullanması", "Ağ modu RAM kullanımını belirleyen faktör değildir."],
      ["Snapshot almayı engellemesi", "Snapshot ile ilişkisi yok."],
    ], 0),
    mc("v11-3", "Komşunun Wi-Fi ağını 'sadece merak' için Kali ile taramayı düşünüyorsun. Doğru karar nedir?", [
      ["Yapmam; yetkisiz sistemlere test yapmak yasa dışıdır", "Doğru: yalnızca kendi laboratuvarında veya yazılı izinle test edilir."],
      ["Küçük bir tarama zarar vermez, yaparım", "Yetkisiz tarama bile hukuki sorun doğurabilir."],
      ["Sanal makineden yapınca yasal olur", "Sanallaştırma yasal izin yerine geçmez."],
      ["Parolayı bilirsem sorun olmaz", "Parolanın bilinmesi test izni demek değildir."],
    ], 0, { format: "Senaryo", scenario: "Komşunun ağı çok açık görünüyor ve Kali'nin araçlarını denemek istiyorsun." }),
    mc("v11-4", "Riskli bir yapılandırma değişikliği yapmadan önce en doğru adım hangisidir?", [
      ["Snapshot almak", "Doğru: hata olursa temiz duruma dönersin."],
      ["Host'u yeniden başlatmak", "Geri dönüş sağlamaz."],
      ["Güvenlik güncellemelerini kapatmak", "Bu riski artırır."],
      ["Pano paylaşımını açmak", "Bu izolasyonu azaltır."],
    ], 0),
    mu("v11-5", "Güvenli bir laboratuvar için doğru yapılandırmayı seç.", [
      ["Hedef VM: Host-only veya Internal", "Doğru: dışarıdan izole."],
      ["Paylaşılan klasör ve pano kapalı", "Doğru: host ile veri akışı minimum."],
      ["Çalışmaya başlamadan önce snapshot alınmış", "Doğru: geri dönüş hazır."],
      ["ISO resmî olmayan bir forumdan", "Yanlış: kaynağı doğrulanamaz."],
    ], [0, 1, 2], "İzole ağ, kapalı paylaşım ve snapshot güvenli laboratuvarın temelidir."),
  ],
};
