import type { Lesson } from "./types";

export const LESSONS_1: Lesson[] = [
  {
    id: 1,
    title: "İşletim Sistemi Nedir?",
    short: "Donanım, yazılım ve kullanıcı arasındaki köprüyü; kernel ve katmanlı mimariyi öğren.",
    minutes: 35,
    goal: "Bu derste işletim sisteminin (Operating System — bilgisayarın kaynaklarını yöneten ve diğer programların çalışmasını sağlayan temel yazılım) ne olduğunu, neden gerekli olduğunu ve bir uygulama başlatıldığında isteğin hangi katmanlardan geçtiğini anlayacaksın.",
    outcomes: [
      "İşletim sisteminin amacını kendi cümlelerinle açıklayabilirsin.",
      "Kullanıcı, uygulama, işletim sistemi, kernel ve donanım katmanlarını sıralayabilirsin.",
      "Kernel (çekirdek) kavramını ve temel görevlerini sayabilirsin.",
      "Masaüstü ve sunucu işletim sistemleri arasındaki farkı ayırt edebilirsin.",
    ],
    sections: [
      {
        h: "İşletim sistemi nedir ve neden vardır?",
        p: [
          "Bir bilgisayar; işlemci (CPU), bellek (RAM), depolama (disk), ekran, klavye ve ağ kartı gibi parçalardan oluşur. Bu parçalar tek başına yalnızca elektrik sinyali işler; hangi parçanın ne zaman ne yapacağına karar veren bir yönetici olmadan kullanışlı bir sistem ortaya çıkmaz. İşte bu yönetici yazılıma işletim sistemi (Operating System — OS) denir.",
          "İşletim sistemi bir orkestra şefi gibidir: müzisyenler (donanım) ve notalar (programlar) vardır, ama kimin ne zaman çalacağını şef belirler. Aynı anda tarayıcı, müzik çalar ve belge düzenleyici açıkken hepsinin işlemci süresini, belleğini ve disk erişimini adil ve güvenli biçimde paylaştıran şey işletim sistemidir.",
        ],
        note: { type: "info", text: "Windows, Linux, macOS, Android ve iOS birer işletim sistemidir. Tarayıcı veya Word gibi programlar işletim sistemi değil, işletim sisteminin üzerinde çalışan uygulamalardır." },
      },
      {
        h: "Kullanıcı, işletim sistemi ve donanım ilişkisi",
        p: [
          "Kullanıcı bir donanıma doğrudan komut vermez. Bir dosyaya çift tıkladığında önce uygulama devreye girer, uygulama işletim sisteminden bir hizmet ister, işletim sistemi bu isteği kernel aracılığıyla donanıma çevirir. Cevap ise aynı yoldan geri döner. Bu katmanlı yapı sayesinde bir uygulama yazarı disk üreticisinin ayrıntılarını bilmek zorunda kalmaz.",
          "Bu ayrım güvenlik için de önemlidir. Uygulamalar donanıma doğrudan dokunamadığı için işletim sistemi her isteği denetleyebilir: 'Bu program bu dosyayı okuyabilir mi?', 'Bu süreç bu kadar bellek kullanabilir mi?' gibi sorulara yanıt verir. Yani işletim sistemi aynı zamanda ilk savunma hattıdır.",
        ],
        list: [
          "Kullanıcı: Fare, klavye veya dokunmatik ekranla komut veren kişi.",
          "Uygulama: Tarayıcı, Not Defteri, oyun gibi kullanıcı programları.",
          "İşletim sistemi: Kaynakları yöneten ve kuralları koyan yazılım katmanı.",
          "Kernel: İşletim sisteminin donanımla konuşan çekirdeği.",
          "Donanım: CPU, RAM, depolama, ağ kartı.",
        ],
      },
      {
        h: "İşletim sisteminin temel görevleri",
        p: [
          "Bir işletim sisteminin görevleri beş ana başlıkta toplanır. Süreç yönetimi (Process Management) ile hangi programın işlemciyi ne kadar kullanacağı planlanır. Bellek yönetimi (Memory Management) ile her programa ayrı ve korunan bir RAM alanı verilir. Dosya sistemi yönetimi ile veriler adlandırılmış dosya ve klasörler halinde diskte düzenlenir.",
          "Aygıt yönetimi (Device Management) yazıcı, fare, USB bellek gibi cihazların sürücüler (driver) aracılığıyla kullanılmasını sağlar. Güvenlik ve kullanıcı yönetimi ise kimin sisteme girebileceğini ve hangi kaynaklara erişebileceğini belirler. Bu başlıklar sonraki derslerde (süreçler, dosya sistemi, izinler) tek tek ayrıntılı işlenecek.",
        ],
        list: ["Süreç yönetimi — CPU zamanını paylaştırma", "Bellek yönetimi — RAM'i bölme ve koruma", "Dosya yönetimi — verileri düzenleme", "Aygıt yönetimi — sürücüler ve giriş/çıkış", "Güvenlik — kimlik doğrulama ve yetkilendirme"],
      },
      {
        h: "Kernel (çekirdek) kavramı",
        p: [
          "Kernel, işletim sisteminin en alt katmanda çalışan ve donanıma doğrudan erişim yetkisi olan çekirdeğidir. CPU zamanlaması, bellek eşleme, sürücüler ve sistem çağrıları (system call — bir uygulamanın kernel'dan hizmet istemesi) kernel tarafından yönetilir. Kernel çökerse tüm sistem durur; Windows'taki mavi ekran veya Linux'taki 'kernel panic' bunun sonucudur.",
          "Modern işletim sistemlerinde iki çalışma kipi vardır: kernel kipi (kernel mode — tam yetki) ve kullanıcı kipi (user mode — kısıtlı yetki). Uygulamalar kullanıcı kipinde çalışır; disk okumak gibi ayrıcalıklı bir işlem gerektiğinde sistem çağrısı yaparak kernel'dan yardım ister. Bu sınır, bir uygulamadaki hatanın tüm sistemi bozmasını engeller.",
        ],
        note: { type: "tip", text: "Kernel'i bir binanın temeli gibi düşün: kullanıcılar onu görmez ama her şey onun üstünde durur. Masaüstü, pencereler ve simgeler ise binanın dış cephesidir." },
      },
      {
        h: "Kullanıcı arayüzü (User Interface)",
        p: [
          "Kullanıcı arayüzü, insanın işletim sistemiyle konuştuğu yüzeydir. İki ana türü vardır: grafik arayüz (GUI — Graphical User Interface; pencereler, simgeler, menüler) ve komut satırı arayüzü (CLI — Command Line Interface; yazılan komutlar). Aynı işletim sistemi çoğu zaman her ikisini de sunar.",
          "Grafik arayüz öğrenmesi kolay olduğu için masaüstünde yaygındır. Komut satırı ise otomasyon, uzaktan yönetim ve hızlı işlem için güçlüdür; sunucuların çoğunda grafik arayüz hiç yoktur. Siber güvenlik uzmanları her ikisini de rahatça kullanabilmelidir.",
        ],
      },
      {
        h: "İşletim sistemi olmadan bilgisayar kullanımı",
        p: [
          "İşletim sistemi olmayan bir bilgisayarı açtığında yalnızca donanımın ilk kontrolünü yapan yazılım (firmware / BIOS-UEFI) çalışır; ardından 'önyüklenebilir aygıt bulunamadı' benzeri bir mesaj görürsün. Her program kendi sürücü kodunu, bellek yönetimini ve dosya düzenini yazmak zorunda kalırdı; iki program aynı anda çalışamaz, biri diğerinin belleğini bozabilirdi.",
          "Eski dönem bilgisayarlarda ve bazı gömülü cihazlarda (basit sensörler, mikrodenetleyiciler) program donanımı doğrudan yönetir; buna 'bare-metal' denir. Ancak karmaşık, çok görevli ve güvenli kullanım için işletim sistemi vazgeçilmezdir. Laboratuvarda 'İşletim sistemi olmadan' modunu açarak bu sorunları görebilirsin.",
        ],
      },
      {
        h: "Masaüstü ve sunucu işletim sistemleri",
        p: [
          "Masaüstü işletim sistemleri (Windows 11, macOS, Ubuntu Desktop) tek bir kişinin etkileşimli kullanımı için tasarlanır: grafik arayüz, multimedya, oyun ve ofis uygulamaları önceliklidir. Sunucu işletim sistemleri (Windows Server, Ubuntu Server, Red Hat Enterprise Linux) ise web siteleri, veritabanları ve dosya paylaşımı gibi hizmetleri aylarca kesintisiz sunmak için tasarlanır.",
          "Sunucu sistemlerinde genellikle grafik arayüz kapalıdır; kaynaklar hizmetlere ayrılır, güvenlik ve uzaktan yönetim (SSH, RDP) önemlidir. Siber güvenlikte saldırıların hedefi çoğunlukla sunuculardır, bu yüzden iki dünyayı da tanımak gerekir.",
        ],
      },
    ],
    concepts: [
      ["İşletim sistemi (Operating System)", "Donanım kaynaklarını yöneten, programların çalışmasını sağlayan temel yazılım."],
      ["Kernel (Çekirdek)", "Donanımla doğrudan konuşan, tam yetkili çekirdek katman."],
      ["Sistem çağrısı (System Call)", "Uygulamanın kernel'dan dosya, bellek veya ağ gibi hizmet istemesi."],
      ["Sürücü (Driver)", "Kernel'ın belirli bir donanımla konuşmasını sağlayan küçük yazılım."],
      ["Kullanıcı kipi / Kernel kipi", "Kısıtlı yetkili uygulama alanı ve tam yetkili çekirdek alanı."],
      ["GUI / CLI", "Grafik arayüz ve komut satırı arayüzü."],
    ],
    everyday: [
      "Bir otelin resepsiyonu gibi: misafir (kullanıcı) odalara (donanım) doğrudan girmez; resepsiyon (işletim sistemi) anahtarı verir ve kuralları uygular.",
      "Trafik polisi kavşakta hangi aracın ne zaman geçeceğine karar verir; işletim sistemi de programların işlemciyi sırayla kullanmasını sağlar.",
      "Telefonda uygulama açtığında kamera, mikrofon veya konum izni sorulması işletim sisteminin bir koruma görevidir.",
    ],
    technical: [
      "Not Defteri'nde 'Kaydet'e basınca uygulama doğrudan diske yazmaz; işletim sisteminin dosya API'sini çağırır, kernel dosya sistemi sürücüsü üzerinden diske yazar.",
      "İki program aynı anda çalışırken her birinin belleği ayrı sanal adres alanında tutulur; biri çökse diğeri etkilenmez.",
      "Bir sürücü hatası kernel kipinde çalıştığı için tüm sistemi çökertebilir (mavi ekran / kernel panic).",
    ],
    examples: [
      { title: "Bir uygulama başlatıldığında (basitleştirilmiş akış)", code: "Kullanıcı çift tıklar\n  → Kabuk/masaüstü: 'notepad.exe başlat'\n  → İşletim sistemi: süreç oluştur, bellek ayır\n  → Kernel: CPU zamanı planla, dosyayı diskten oku\n  → Donanım: disk okur, RAM'e yükler, CPU çalıştırır", desc: "Laboratuvarda aynı akışı adım adım izleyeceksin." },
      { title: "Hangi işletim sistemini kullanıyorum? (Linux'ta)", code: "$ uname -a\nLinux ag-lab 6.5.0 #1 SMP x86_64 GNU/Linux", desc: "uname komutu kernel adı ve sürümünü gösterir. Komutlar Ders 09 ve 11'de ayrıntılı işlenecek." },
    ],
    guide: [
      "Laboratuvarda soldan bir senaryo seç (ör. 'Not Defteri'ni aç').",
      "'Sonraki adım' düğmesiyle isteğin katmanlardan geçişini izle; aktif katman vurgulanır.",
      "Şemadaki katmanlara tıklayıp her katmanın görevini oku.",
      "İkinci bir senaryoyu da sonuna kadar çalıştır ve farklarını karşılaştır.",
      "'İşletim sistemi olmadan' modunu aç; hangi sorunlar ortaya çıkıyor, not al.",
    ],
    after: [
      "Her istek uygulamadan kernel'a, oradan donanıma gider; cevap ters yönde döner.",
      "Katmanlar sayesinde uygulamalar donanım ayrıntılarından bağımsızdır.",
      "Kernel'ın tek ayrıcalıklı katman olması güvenliğin temelidir.",
      "OS'siz modda çoklu görev, koruma ve donanım uyumluluğu kaybolur.",
    ],
    summary: [
      "İşletim sistemi donanım ile kullanıcı/uygulama arasındaki yöneticidir.",
      "Süreç, bellek, dosya, aygıt ve güvenlik yönetimi temel görevlerdir.",
      "Kernel donanıma erişen tam yetkili çekirdektir.",
      "GUI ve CLI iki ayrı kullanıcı arayüzü türüdür.",
      "Masaüstü ve sunucu sistemleri farklı hedeflere göre tasarlanır.",
    ],
    quiz: [
      ["Aşağıdakilerden hangisi bir işletim sistemidir?", ["Google Chrome", "Linux", "Microsoft Word", "Wireshark"], 1, "Linux bir işletim sistemi çekirdeği/ailesidir. Chrome, Word ve Wireshark işletim sisteminin üzerinde çalışan uygulamalardır."],
      ["Kernel'ın temel görevi nedir?", ["Web sayfası tasarlamak", "Donanım kaynaklarını yönetmek ve donanımla doğrudan konuşmak", "Antivirüs taraması yapmak", "Masaüstü duvar kâğıdını değiştirmek"], 1, "Kernel, CPU, RAM, disk ve cihaz sürücülerini yöneten çekirdek katmandır."],
      ["Bir uygulamanın kernel'dan hizmet istemesine ne denir?", ["Sistem çağrısı (system call)", "Format atmak", "Önbellek temizleme", "Ekran kaydı"], 0, "Uygulamalar kısıtlı kipte çalıştığı için dosya, bellek, ağ gibi hizmetleri sistem çağrılarıyla ister."],
      ["Sunucu işletim sistemlerinin tipik özelliği hangisidir?", ["Genellikle kesintisiz hizmet için tasarlanır ve çoğu zaman grafik arayüzsüz çalışır", "Yalnızca oyun oynamak için üretilir", "Hiç ağ bağlantısı kullanmaz", "Kernel içermez"], 0, "Sunucu sistemleri web, veritabanı gibi hizmetleri uzun süre kesintisiz sunar; kaynaklar hizmetlere ayrılır."],
      ["İşletim sisteminin güvenlik açısından önemi nedir?", ["Hiçbir önemi yoktur", "Uygulamaların donanıma ve birbirlerinin belleğine erişimini denetler", "Sadece internet hızını artırır", "Dosyaları otomatik şifreler"], 1, "Uygulamalar donanıma doğrudan erişemez; her isteği işletim sistemi denetler. Bu, ilk savunma hattıdır."],
    ],
  },
  {
    id: 2,
    title: "Windows İşletim Sistemi",
    short: "Windows masaüstü, Dosya Gezgini, Görev Yöneticisi, hesaplar ve güvenlik bileşenleri.",
    minutes: 45,
    goal: "Windows'un tarihsel gelişimini, masaüstü bileşenlerini ve yönetim araçlarını tanıyacak; sanal bir Windows masaüstünde dosya ve süreç işlemlerini güvenle deneyimleyeceksin.",
    outcomes: [
      "Windows sürümlerinin kabaca gelişimini anlatabilirsin.",
      "Başlat menüsü, görev çubuğu ve Dosya Gezgini'ni kullanabilirsin.",
      "Ayarlar ile Denetim Masası farkını açıklayabilirsin.",
      "Görev Yöneticisi'nde süreçleri okuyabilirsin.",
      "Windows güvenlik bileşenlerini sıralayabilirsin.",
    ],
    sections: [
      {
        h: "Windows nedir ve nasıl gelişti?",
        p: [
          "Windows, Microsoft'un geliştirdiği, dünyada masaüstü bilgisayarlarda en yaygın kullanılan işletim sistemi ailesidir. İlk sürümler (Windows 1.0, 1985) MS-DOS üzerinde çalışan grafik kabuklardı. Windows 95 Başlat menüsünü ve görev çubuğunu getirdi; Windows XP (2001) NT çekirdeğini ev kullanıcılarına taşıdı ve uzun yıllar standart oldu.",
          "Windows 7 (2009) kararlılığıyla, Windows 10 (2015) 'hizmet olarak Windows' yaklaşımı ve sürekli güncellemeleriyle, Windows 11 (2021) ise yenilenmiş arayüzü ve sıkılaştırılmış donanım güvenliği şartlarıyla öne çıktı. Bugünkü tüm modern sürümler Windows NT çekirdeği üzerine kuruludur.",
        ],
        list: ["1985 — Windows 1.0", "1995 — Windows 95 (Başlat menüsü)", "2001 — Windows XP (NT tabanlı ev sürümü)", "2009 — Windows 7", "2015 — Windows 10", "2021 — Windows 11"],
      },
      {
        h: "Masaüstü, Başlat menüsü ve görev çubuğu",
        p: [
          "Masaüstü (Desktop) çalışma yüzeyindir: kısayollar, dosyalar ve duvar kâğıdı burada görünür. Görev çubuğu (Taskbar) ekranın altında çalışan uygulamaları, sabitlenmiş kısayolları, saat ve bildirim alanını (sistem tepsisi) gösterir. Başlat menüsü ise uygulamalara, ayarlara ve güç seçeneklerine giden ana kapıdır.",
          "Sistem tepsisindeki simgeler arka planda çalışan programlardır (ağ, ses, antivirüs). Siber güvenlik açısından bu alan önemlidir: tanımadığın bir arka plan programı şüphe uyandırabilir.",
        ],
      },
      {
        h: "Dosya Gezgini (File Explorer)",
        p: [
          "Dosya Gezgini, dosya ve klasörleri görüntülemek, oluşturmak, kopyalamak, taşımak, yeniden adlandırmak ve silmek için kullanılan grafik araçtır. Sol bölmede hızlı erişim, Bu Bilgisayar ve sürücüler (C:, D:) yer alır; üstteki adres çubuğu konumunu (yolunu) gösterir.",
          "Silinen dosyalar önce Geri Dönüşüm Kutusu'na gider, ancak Shift+Delete ile doğrudan silinir. Dosya uzantılarını (.txt, .exe) görünür yapmak güvenlik için iyi bir alışkanlıktır; çünkü 'fatura.pdf.exe' gibi sahte uzantılar kötü amaçlı yazılımlarda sık kullanılır.",
        ],
        note: { type: "warn", text: "Uzantısı gizlenmiş dosyalar aldatıcı olabilir. Dosya Gezgini > Görünüm > 'Dosya adı uzantıları' seçeneğini açık tut." },
      },
      {
        h: "Ayarlar, Denetim Masası ve Görev Yöneticisi",
        p: [
          "Ayarlar (Settings) uygulaması modern, sade yapılandırma arayüzüdür: Sistem, Bluetooth ve cihazlar, Ağ, Hesaplar, Windows Update, Gizlilik ve güvenlik gibi bölümler içerir. Denetim Masası (Control Panel) eski ve daha ayrıntılı ayar kategorilerini barındırır; zamanla işlevleri Ayarlar'a taşınmaktadır.",
          "Görev Yöneticisi (Task Manager — Ctrl+Shift+Esc) çalışan süreçleri, CPU, bellek, disk ve ağ kullanımını gösterir; yanıt vermeyen bir programı sonlandırmayı sağlar. Hizmetler, başlangıç uygulamaları ve ayrıntılı süreç bilgisi de burada bulunur.",
        ],
      },
      {
        h: "Kullanıcı hesapları ve Windows güncellemeleri",
        p: [
          "Windows'ta Yönetici (Administrator) ve Standart kullanıcı hesapları vardır. Yönetici hesabı program kurabilir ve sistem ayarlarını değiştirebilir; standart hesap kısıtlıdır. Günlük kullanımda standart hesap tercih etmek, kötü amaçlı yazılımın vereceği zararı azaltır (Ders 07'de ayrıntılı).",
          "Windows Update güvenlik yamalarını ve özellik güncellemelerini dağıtır. Güncellemeler bilinen açıkların kapatılmasını sağlar; ertelenen her güncelleme saldırganlar için açık kapı demektir. Otomatik güncellemeleri açık tutmak en temel güvenlik önlemlerinden biridir.",
        ],
      },
      {
        h: "Windows güvenlik bileşenlerine giriş",
        p: [
          "Windows Güvenliği (Windows Security) paneli birkaç bileşeni bir araya getirir: Microsoft Defender Virüsten Koruma (kötü amaçlı yazılım tarar), Güvenlik Duvarı (Firewall — gelen/giden ağ trafiğini filtreler), SmartScreen (güvensiz uygulama ve siteleri uyarır) ve UAC (Kullanıcı Hesabı Denetimi — yönetici yetkisi gerektiren işlemlerde onay ister).",
          "Bunlara ek olarak BitLocker disk şifrelemesi, Windows Hello biyometrik giriş ve Secure Boot (güvenli önyükleme) gibi özellikler vardır. Katmanlı koruma anlayışı (defense in depth) tek bir önlemin atlatılması durumunda diğerlerinin devrede kalmasını amaçlar.",
        ],
        note: { type: "info", text: "Bu derste hiçbir gerçek Windows ayarı değiştirilmez. Sanal masaüstü yalnızca tarayıcı içinde çalışan bir simülasyondur." },
      },
    ],
    concepts: [
      ["Masaüstü (Desktop)", "Kısayolların ve pencerelerin göründüğü ana çalışma yüzeyi."],
      ["Dosya Gezgini (File Explorer)", "Dosya ve klasörleri yöneten grafik araç."],
      ["Görev Yöneticisi (Task Manager)", "Süreçleri ve kaynak kullanımını izleyen araç."],
      ["Denetim Masası / Ayarlar", "Sistem ayarlarının eski ve yeni arayüzleri."],
      ["UAC", "Yönetici yetkisi gerektiren işlemlerde onay isteyen koruma."],
      ["Windows Update", "Güvenlik yamaları ve özellik güncellemeleri sistemi."],
    ],
    everyday: [
      "Dosya Gezgini bir dolap sistemi gibidir: klasörler çekmece, dosyalar içindeki kâğıtlardır.",
      "Görev Yöneticisi bir şirketin vardiya panosu gibidir: kim çalışıyor, ne kadar enerji harcıyor görürsün.",
      "UAC, apartman girişindeki görevli gibi 'Bu kişiyi içeri alıyor musunuz?' diye sorar.",
    ],
    technical: [
      "Ctrl+Shift+Esc ile açılan Görev Yöneticisi'nde 'Ayrıntılar' sekmesi her sürecin PID değerini gösterir.",
      "C:\\Windows\\System32 klasörü işletim sisteminin kritik dosyalarını barındırır; standart kullanıcılar buraya yazamaz.",
      "Windows Güvenlik Duvarı varsayılan olarak yetkisiz gelen bağlantıları engeller.",
    ],
    examples: [
      { title: "Sık kullanılan kısayollar", code: "Win            → Başlat menüsünü açar\nWin + E        → Dosya Gezgini\nCtrl+Shift+Esc → Görev Yöneticisi\nWin + I        → Ayarlar\nWin + L        → Bilgisayarı kilitle", desc: "Kilitleme alışkanlığı fiziksel güvenlik için çok önemlidir." },
      { title: "Tipik kullanıcı klasör yolu", code: "C:\\Users\\Ogrenci\\Documents\\rapor.txt", desc: "C: sürücüsü > Users > kullanıcı adı > Documents. Ders 06'da yol kavramı ayrıntılı işlenecek." },
    ],
    guide: [
      "Sanal masaüstünde Başlat düğmesine basıp menüyü incele.",
      "Dosya Gezgini'ni aç; 'Yeni klasör' ile bir klasör oluştur.",
      "Bir dosyayı seçip 'Yeniden adlandır' ve 'Kopyala → Yapıştır' işlemlerini dene.",
      "Görev Yöneticisi'ni aç, bir süreci seçip bilgilerini oku.",
      "Ayarlar, Denetim Masası ve Güvenlik bileşenlerini gez.",
    ],
    after: [
      "Dosya işlemleri aslında dosya sistemi üzerinde gerçekleşen kayıt değişiklikleridir.",
      "Görev Yöneticisi sistemin 'röntgeni'dir; olağan dışı CPU/RAM kullanımı sorun ya da saldırı işareti olabilir.",
      "Güvenlik bileşenleri tek başına değil, birlikte etkilidir.",
    ],
    summary: [
      "Windows, NT çekirdeği üzerine kurulu, en yaygın masaüstü işletim sistemidir.",
      "Dosya Gezgini dosya yönetimi, Görev Yöneticisi süreç izleme içindir.",
      "Ayarlar modern, Denetim Masası klasik yapılandırma arayüzüdür.",
      "Standart hesap kullanımı ve güncellemeler temel güvenlik adımlarıdır.",
      "Defender, Güvenlik Duvarı, SmartScreen ve UAC katmanlı koruma sağlar.",
    ],
    quiz: [
      ["Windows'ta çalışan süreçleri ve CPU/RAM kullanımını gösteren araç hangisidir?", ["Dosya Gezgini", "Görev Yöneticisi", "Not Defteri", "Paint"], 1, "Görev Yöneticisi (Task Manager) süreçleri ve kaynak tüketimini izler."],
      ["Başlat menüsünü ve görev çubuğunu ilk getiren sürüm hangisidir?", ["Windows 1.0", "Windows 95", "Windows 11", "MS-DOS"], 1, "Windows 95, Başlat menüsü ve görev çubuğu kavramlarını getirmiştir."],
      ["UAC'nin amacı nedir?", ["Dosyaları sıkıştırmak", "Yönetici yetkisi gerektiren işlemlerde onay istemek", "Ekran parlaklığını ayarlamak", "Ağ hızını artırmak"], 1, "UAC (Kullanıcı Hesabı Denetimi), yetki yükseltme gerektiren işlemlerde kullanıcıdan onay ister."],
      ["Dosya uzantılarını görünür tutmak neden güvenlik için iyidir?", ["Dosyalar daha hızlı açılır", "'fatura.pdf.exe' gibi aldatıcı dosya adlarını fark etmeyi kolaylaştırır", "Disk alanı kazandırır", "Antivirüsü kapatır"], 1, "Uzantı gizliyken sahte dosya adları masum görünebilir; açık tutmak gerçek türü gösterir."],
      ["Aşağıdakilerden hangisi Windows güvenlik bileşenlerinden biri değildir?", ["Microsoft Defender", "Windows Güvenlik Duvarı", "SmartScreen", "GNU Compiler Collection"], 3, "GCC bir derleyicidir; Windows güvenlik bileşeni değildir."],
    ],
  },
  {
    id: 3,
    title: "Linux İşletim Sistemi",
    short: "Linux çekirdeği, GNU/Linux, açık kaynak, Windows'tan farkları ve siber güvenlikteki yeri.",
    minutes: 40,
    goal: "Linux'un ne olduğunu, nasıl ortaya çıktığını, açık kaynak felsefesini ve neden siber güvenlikte vazgeçilmez olduğunu öğrenecek; sanal bir Linux masaüstünü keşfedeceksin.",
    outcomes: [
      "Linux kernel ile GNU/Linux sistemi arasındaki farkı anlatabilirsin.",
      "Açık kaynak yazılımın ne anlama geldiğini açıklayabilirsin.",
      "Linux ve Windows arasındaki temel farkları sıralayabilirsin.",
      "Bir Linux masaüstünün bileşenlerini (kernel, shell, masaüstü ortamı, paket yöneticisi) tanıyabilirsin.",
    ],
    sections: [
      {
        h: "Linux nedir? Kernel ve GNU/Linux",
        p: [
          "Teknik olarak 'Linux' yalnızca bir kernel'dır (çekirdek). 1991'de Finlandiyalı öğrenci Linus Torvalds tarafından yazılmaya başlanan bu çekirdek, tek başına kullanıcıya bir şey sunmaz. Kullanılabilir bir sistem için kabuk (shell), temel komutlar, derleyici ve kütüphaneler gerekir; bunların büyük bölümünü 1983'te Richard Stallman'ın başlattığı GNU projesi sağlamıştır.",
          "Bu yüzden tam sisteme doğru ifadeyle GNU/Linux denir. Gündelik dilde 'Linux' dediğimizde genellikle Linux kernel + GNU araçları + masaüstü ve diğer yazılımların bir araya geldiği tüm sistemi kastederiz. Android da Linux kernel kullanır ama GNU araçlarının çoğunu içermez.",
        ],
      },
      {
        h: "Tarihsel gelişim ve açık kaynak yazılım",
        p: [
          "Linux'un atası UNIX'tir (1969, Bell Labs). UNIX ticari ve kapalı hale gelince GNU ücretsiz bir alternatif kurmaya, Linus ise bu hedefe eksik parçayı (kernel) eklemeye çalıştı. Dünyanın dört yanından gönüllüler ve şirketler çekirdeğe katkı verdi; bugün Linux telefonlardan süper bilgisayarlara kadar yaygındır.",
          "Açık kaynak (Open Source) yazılım, kaynak kodunun herkes tarafından incelenebilmesi, değiştirilebilmesi ve paylaşılabilmesi demektir. Linux GPL lisansı altındadır. Açık kod 'binlerce göz' prensibiyle hataların ve açıkların daha hızlı bulunmasını sağlar; ancak bu, her açık kaynak yazılımın otomatik olarak güvenli olduğu anlamına gelmez — bakımın düzenli yapılması gerekir.",
        ],
        note: { type: "info", text: "Açık kaynak ≠ bedava demek değildir. 'Özgür' kavramı kodun incelenebilmesi ve değiştirilebilmesini ifade eder; birçok açık kaynak ürün ücretli destekle satılır (ör. Red Hat)." },
      },
      {
        h: "Linux ve Windows arasındaki farklar",
        p: [
          "Windows ticari, kapalı kaynaklı ve tek bir şirket tarafından geliştirilir; Linux ise açık kaynaklı ve çeşitli dağıtımlar (Ders 04) halinde sunulur. Windows'ta sürücü harfleri (C:\\) ve Kayıt Defteri (Registry) vardır; Linux'ta tek bir kök dizin (/) altında her şey bir dosya olarak temsil edilir ve yapılandırma metin dosyalarında tutulur.",
          "Linux'ta çoğu iş terminalden yapılabilir, paketler paket yöneticileriyle kurulur ve yönetici yetkisi (root/sudo) bilinçli olarak istenir. Windows'ta kurulum genellikle grafik sihirbazlarla yapılır. Hangisinin 'daha iyi' olduğu değil, hangisinin hangi iş için uygun olduğu önemlidir.",
        ],
        list: ["Lisans: Windows ticari/kapalı — Linux açık kaynak", "Dosya sistemi: C:\\ sürücü harfleri — tek kök dizin /", "Yapılandırma: Kayıt Defteri/Ayarlar — metin dosyaları (/etc)", "Kurulum: .exe/.msi sihirbazları — paket yöneticisi (apt, dnf)", "Kullanım: masaüstü/oyun ağırlıklı — sunucu/geliştirme/güvenlik ağırlıklı"],
      },
      {
        h: "Linux'un kullanım alanları",
        p: [
          "İnternetteki web sunucularının büyük çoğunluğu, bulut altyapıları, Android telefonlar, akıllı TV'ler, ağ cihazları (router), otomobil bilgi-eğlence sistemleri ve dünyanın en hızlı süper bilgisayarları Linux çalıştırır. Geliştiriciler yazılım geliştirirken, güvenlik uzmanları ise test ve analiz yaparken sıklıkla Linux kullanır.",
          "Masaüstü Linux (Ubuntu, Fedora, Linux Mint) günlük bilgisayar kullanımı için, sunucu Linux (Debian, Ubuntu Server, RHEL) ise hizmet sunmak için tercih edilir. Aynı kernel ailesi her ikisinde de kullanılır; fark kurulu bileşenlerde ve yapılandırmadadır.",
        ],
      },
      {
        h: "Linux'un siber güvenlikteki önemi",
        p: [
          "Savunma tarafında (mavi takım) sunucuların çoğu Linux olduğu için sıkılaştırma, log analizi ve izleme Linux bilgisi gerektirir. Saldırı simülasyonu yapan etik güvenlik uzmanları (kırmızı takım) Kali Linux gibi güvenlik odaklı dağıtımları kullanır (Ders 05). Adli bilişim ve zararlı yazılım analizinde de Linux araçları yaygındır.",
          "Linux'un şeffaflığı, komut satırı gücü ve ağ araçlarının zenginliği güvenlik çalışmalarını kolaylaştırır. Bu nedenle bu modülün büyük kısmı Linux terminal becerilerine ayrılmıştır.",
        ],
        note: { type: "tip", text: "Siber güvenlik kariyeri için en değerli beceri: Linux terminalinde rahat hareket etmek, log okumak ve izinleri anlamak." },
      },
    ],
    concepts: [
      ["Linux Kernel", "Linus Torvalds'ın 1991'de başlattığı işletim sistemi çekirdeği."],
      ["GNU/Linux", "GNU araçları + Linux çekirdeğinden oluşan tam işletim sistemi."],
      ["Açık kaynak (Open Source)", "Kodu incelenebilir, değiştirilebilir ve paylaşılabilir yazılım."],
      ["Kabuk (Shell)", "Komutları yorumlayan program (ör. bash)."],
      ["Masaüstü ortamı (Desktop Environment)", "GNOME, KDE, XFCE gibi grafik arayüz paketleri."],
      ["Paket yöneticisi (Package Manager)", "Yazılım kuran/güncelleyen araç (apt, dnf, pacman)."],
    ],
    everyday: [
      "Kernel motor, GNU araçları şanzıman ve direksiyon, masaüstü ise araba kaportası gibidir: hepsi birleşince kullanılabilir bir araç olur.",
      "Açık kaynak, tarifi herkesle paylaşılan bir yemek gibidir: herkes inceleyebilir, geliştirebilir.",
      "Android telefonun içindeki çekirdek Linux'tur; yani Linux'u fark etmeden her gün kullanırsın.",
    ],
    technical: [
      "uname -r komutu çalışan Linux kernel sürümünü gösterir.",
      "Linux'ta aygıtlar bile dosya gibidir: /dev/sda ilk disktir.",
      "Linux sunucularda yapılandırma /etc altındaki metin dosyalarında tutulur.",
    ],
    examples: [
      { title: "Kernel sürümünü öğrenme", code: "$ uname -r\n6.5.0-sim", desc: "Çıktı, çalışan kernel sürümüdür. Güvenlik yamalarının uygulanıp uygulanmadığını kontrol etmek için kullanılır." },
      { title: "Linux dosya yapısından bir kesit", code: "/\n├── home/ag        ← kullanıcı dosyaları\n├── etc            ← yapılandırma dosyaları\n├── var/log        ← kayıt (log) dosyaları\n└── usr/bin        ← programlar", desc: "Ders 06'da dizin yapısı ayrıntılı işlenecek." },
    ],
    guide: [
      "Sanal Linux masaüstünde üstteki 'Uygulamalar' menüsünü aç.",
      "Dosya yöneticisini aç, Documents veya lab gibi bir klasöre gir.",
      "Terminali aç ve ls veya pwd gibi bir komut çalıştır.",
      "Altta yer alan 'Linux bileşenleri' şemasında kernel, shell, masaüstü ortamı ve paket yöneticisine tıkla.",
    ],
    after: [
      "Linux masaüstü, bağımsız bileşenlerin (kernel, display server, masaüstü ortamı, uygulamalar) birleşimidir.",
      "Bileşenler değiştirilebilir olduğu için farklı görünümlü Linux sistemleri oluşur.",
      "Terminal, grafik arayüzün yaptığı her şeyi daha hızlı ve otomatik yapabilir.",
    ],
    summary: [
      "Linux bir çekirdektir; GNU araçlarıyla birleşince GNU/Linux sistemi olur.",
      "Açık kaynak, kodun şeffaf ve paylaşılabilir olmasıdır.",
      "Linux sunucu, bulut, gömülü ve güvenlik alanında çok yaygındır.",
      "Windows'tan farkı lisans, dosya yapısı ve yapılandırma yaklaşımındadır.",
      "Siber güvenlikte Linux bilgisi temel gerekliliktir.",
    ],
    quiz: [
      ["Linux teknik olarak neyi ifade eder?", ["Bir ofis programını", "Bir işletim sistemi çekirdeğini (kernel)", "Bir tarayıcıyı", "Bir antivirüs yazılımını"], 1, "Linux, Linus Torvalds'ın yazdığı kernel'dır; GNU araçlarıyla birlikte tam sistem olur."],
      ["'Açık kaynak' ne demektir?", ["Yazılımın internetten indirilememesi", "Kaynak kodunun incelenip değiştirilebilmesi ve paylaşılabilmesi", "Yazılımın sadece şirketlerde kullanılması", "Programın şifreli olması"], 1, "Açık kaynak kodun şeffaf olmasını ve lisans şartlarıyla paylaşılabilmesini anlatır."],
      ["Linux'ta tek kök dizinin sembolü hangisidir?", ["C:\\", "/", "~", "*"], 1, "Linux'ta tüm dosya sistemi / (kök dizin) altında toplanır."],
      ["Aşağıdakilerden hangisi Linux'un kullanım alanlarından biridir?", ["Web sunucuları ve bulut altyapıları", "Yalnızca yazıcı sürücüleri", "Sadece mobil oyunlar", "Yalnızca ofis yazılımı"], 0, "Linux; sunucu, bulut, Android, gömülü sistemler ve süper bilgisayarlarda yaygındır."],
      ["Linux'un siber güvenlikte önemli olmasının nedeni nedir?", ["Hiç güvenlik açığı içermemesi", "Sunucuların çoğunun Linux olması ve güçlü komut satırı/araç yelpazesi sunması", "Sadece oyun oynamaya uygun olması", "Windows ile uyumlu olmaması"], 1, "Hedef sistemlerin çoğu Linux'tur ve araçlar komut satırında zengindir. Hiçbir sistem açıksız değildir."],
    ],
  },
  {
    id: 4,
    title: "Linux Dağıtımları",
    short: "Ubuntu, Debian, Fedora, Mint, Arch ve openSUSE; paket yöneticileri ve seçim kriterleri.",
    minutes: 40,
    goal: "Linux dağıtımı kavramını, dağıtımların ortak bileşenlerini ve başlıca altı dağıtımın farklarını öğrenecek; senaryoya göre doğru dağıtımı seçmeyi pratik edeceksin.",
    outcomes: [
      "Linux dağıtımı (distribution) tanımını yapabilirsin.",
      "Paket yöneticilerini (apt, dnf, pacman, zypper) eşleştirebilirsin.",
      "Ubuntu, Debian, Fedora, Mint, Arch ve openSUSE'nin güçlü yönlerini sayabilirsin.",
      "Bir senaryo için gerekçeli dağıtım önerebilirsin.",
    ],
    sections: [
      {
        h: "Linux dağıtımı (distribution) nedir?",
        p: [
          "Linux kernel tek başına kullanıcıya hazır bir sistem sunmaz. Bir dağıtım (distro); Linux kernel, GNU araçları, kurulum programı, paket yöneticisi, masaüstü ortamı ve seçilmiş uygulamaların hazır bir paket olarak birleştirilmesidir. Aynı kernel'ı kullanan yüzlerce dağıtım vardır; farkları bu bileşenlerin seçimi, güncelleme politikası ve hedef kitleden gelir.",
          "Dağıtımları araba markalarına benzetebilirsin: hepsinin motoru benzer olabilir, ama konfor, fiyat, bakım yaklaşımı ve hedef kullanıcı farklıdır. 'En iyi dağıtım' diye mutlak bir cevap yoktur; ihtiyaca göre doğru dağıtım vardır.",
        ],
      },
      {
        h: "Dağıtımların temel bileşenleri",
        p: [
          "Her dağıtımda ortak olarak şunlar bulunur: Linux kernel, init sistemi (çoğunlukla systemd — sistemi başlatan ve hizmetleri yöneten yazılım), kabuk (bash), temel GNU araçları, paket yöneticisi ve depolar (repository — yazılımların bulunduğu sunucular), ve isteğe bağlı olarak masaüstü ortamı (GNOME, KDE Plasma, XFCE, Cinnamon).",
          "Paket yöneticisi, yazılım kurma, güncelleme ve kaldırmayı bağımlılıklarıyla birlikte otomatik yapar. Güvenlik açısından önemi büyüktür: tek komutla tüm sistemin güvenlik yamaları uygulanabilir. Depo dışı kaynaklardan indirilen paketler ise risk taşır.",
        ],
        list: ["Debian ailesi (Debian, Ubuntu, Mint, Kali) — apt / .deb", "Red Hat ailesi (Fedora, RHEL, CentOS) — dnf / .rpm", "Arch ailesi (Arch, Manjaro) — pacman", "SUSE ailesi (openSUSE) — zypper / .rpm"],
      },
      {
        h: "Başlıca dağıtımlar",
        p: [
          "Ubuntu: Debian tabanlı, yeni başlayanlar için en popüler dağıtımdır; 2 yılda bir LTS (Uzun Süreli Destek) sürümü yayımlar, geniş topluluğa ve donanım uyumuna sahiptir. Debian: kararlılığıyla ünlü, topluluk tarafından yönetilen köklü bir dağıtımdır; sunucularda ve diğer dağıtımların temeli olarak yaygındır. Fedora: Red Hat destekli, yeni teknolojileri erken benimseyen güncel bir dağıtımdır.",
          "Linux Mint: Ubuntu/Debian tabanlı, Windows'tan gelenlere tanıdık gelen Cinnamon masaüstüyle 'kur ve kullan' mantığı sunar. Arch Linux: 'Kendin yap' felsefesiyle minimal kurulur, sürekli güncellenir (rolling release); öğrenmek için mükemmeldir ama yeni başlayanlar için zordur. openSUSE: YaST/Agama yönetim araçları ve sağlam altyapısıyla kurumsal ve sistem yönetimi ağırlıklı kullanıma uygundur.",
        ],
      },
      {
        h: "Sürüm modelleri: LTS, sabit ve rolling",
        p: [
          "Sabit sürümlü (fixed release) dağıtımlar belirli aralıklarla yeni sürüm yayımlar ve arada yalnızca güvenlik/hata düzeltmesi alır; kararlılık önceliklidir (Debian Stable, Ubuntu LTS). Rolling release dağıtımlar sürüm numarası yerine sürekli güncellenir; en yeni yazılımı verir ama ara sıra beklenmedik uyumsuzluk görülebilir (Arch, openSUSE Tumbleweed).",
          "Sunucu için genellikle kararlılık ve uzun destek süresi, geliştirici masaüstü için güncellik, öğrenme amaçlı kullanım için ise kolay kurulum ve geniş doküman önemlidir. Güvenlik yamalarının ne kadar süre sağlandığı da seçim kriteridir.",
        ],
        note: { type: "tip", text: "Yeni başlıyorsan Ubuntu veya Linux Mint ile başla; terminal bilgin gelişince Debian ve Arch'a göz atabilirsin." },
      },
      {
        h: "Hangi kullanım alanında hangi dağıtım?",
        p: [
          "Yeni kullanıcı ve genel masaüstü: Ubuntu veya Linux Mint. Kararlı, uzun ömürlü sunucu: Debian veya Ubuntu Server LTS. Güncel yazılım ve geliştirici ortamı: Fedora. Öğrenme amaçlı sistem inşası: Arch Linux. Yönetim araçlarıyla zengin, kurumsal tarzı ortam: openSUSE.",
          "Güvenlik testi için Kali Linux (Debian tabanlı) gibi özel amaçlı dağıtımlar vardır; bir sonraki derste ele alınacak. Dağıtım seçimi kalıcı bir karar değildir; sanal makinelerde (VirtualBox, VMware) birkaç dağıtımı deneyerek karar verebilirsin.",
        ],
      },
    ],
    concepts: [
      ["Dağıtım (Distribution)", "Kernel + araçlar + paket yöneticisi + masaüstünün hazır birleşimi."],
      ["Paket yöneticisi", "Yazılım kurma/güncelleme/kaldırma aracı: apt, dnf, pacman, zypper."],
      ["Depo (Repository)", "Yazılım paketlerinin tutulduğu güvenilir sunucu."],
      ["LTS", "Long Term Support — uzun süreli güvenlik desteği olan sürüm."],
      ["Rolling release", "Sürümsüz, sürekli güncellenen model."],
      ["Masaüstü ortamı", "GNOME, KDE, XFCE, Cinnamon gibi grafik arayüzler."],
    ],
    everyday: [
      "Telefon marka seçmek gibi: hepsi arama yapar ama deneyim, güncelleme politikası ve fiyat farklıdır.",
      "Hazır mobilya (Mint) ile parça parça kendin kurduğun mobilya (Arch) arasındaki fark gibi.",
      "Uygulama mağazası telefondaki paket yöneticisinin benzeridir: güvenilir depodan kurulum yapılır.",
    ],
    technical: [
      "Ubuntu'da sistem güncelleme: sudo apt update && sudo apt upgrade",
      "Fedora'da yazılım kurma: sudo dnf install vim",
      "Arch'ta yazılım kurma: sudo pacman -S vim",
    ],
    examples: [
      { title: "Aynı işin dört dağıtımda yapılması (nano editörü kurmak)", code: "Debian/Ubuntu/Mint : sudo apt install nano\nFedora            : sudo dnf install nano\nArch              : sudo pacman -S nano\nopenSUSE          : sudo zypper install nano", desc: "Komut değişir, mantık aynıdır: paket yöneticisi depodan indirir ve kurar." },
      { title: "Hangi dağıtımdayım?", code: "$ cat /etc/os-release\nPRETTY_NAME=\"Ubuntu 24.04 LTS\"\nID=ubuntu\nID_LIKE=debian", desc: "ID_LIKE alanı dağıtımın hangi aileden geldiğini gösterir." },
    ],
    guide: [
      "Laboratuvarda üstten en az iki dağıtımı karşılaştırma listesine ekle.",
      "Karşılaştırma tablosunda paket yöneticisi, masaüstü ve zorluk farklarını incele.",
      "Aşağıdaki senaryo uygulamasında her senaryo için bir dağıtım seç.",
      "Yanlış seçimde açıklamayı oku ve doğru dağıtımı bul.",
    ],
    after: [
      "Dağıtımlar aynı kernel'ı paylaşır; fark paketleme, sürüm politikası ve araçlardadır.",
      "Doğru dağıtım seçimi kullanım amacına, deneyime ve destek süresine bağlıdır.",
      "Paket yöneticisini bilmek her dağıtımda yazılım kurma ve güncelleme becerisinin temelidir.",
    ],
    summary: [
      "Dağıtım = kernel + araçlar + paket yöneticisi + masaüstü.",
      "Debian ailesi apt, Red Hat ailesi dnf, Arch pacman, SUSE zypper kullanır.",
      "Sabit/LTS kararlılık, rolling güncellik sağlar.",
      "Başlangıç için Ubuntu/Mint, sunucu için Debian/Ubuntu LTS uygundur.",
      "Seçim, senaryoya göre yapılır.",
    ],
    quiz: [
      ["Ubuntu hangi paket yöneticisini kullanır?", ["pacman", "apt", "zypper", "dnf"], 1, "Ubuntu, Debian ailesindendir ve apt (.deb paketleri) kullanır."],
      ["Aşağıdakilerden hangisi rolling release (sürekli güncellenen) modeline örnektir?", ["Debian Stable", "Ubuntu LTS", "Arch Linux", "Linux Mint 21"], 2, "Arch Linux sürümsüzdür; paketler sürekli güncellenir."],
      ["Yeni başlayan bir Windows kullanıcısı için hangisi en uygun başlangıç olabilir?", ["Arch Linux", "Linux Mint", "Gentoo", "Linux From Scratch"], 1, "Linux Mint tanıdık Cinnamon masaüstü ve kolay kurulumuyla Windows'tan gelenlere uygundur."],
      ["'LTS' neyi ifade eder?", ["Linux Terminal System", "Uzun süreli destek sunulan sürüm", "Yalnızca sunucu için olan paket", "Hızlı kurulum modu"], 1, "LTS (Long Term Support) yıllarca güvenlik güncellemesi sağlayan sürümdür."],
      ["Fedora hangi paket yöneticisi ailesine aittir?", ["dnf (Red Hat ailesi)", "apt (Debian ailesi)", "pacman (Arch ailesi)", "Paket yöneticisi yoktur"], 0, "Fedora, RPM tabanlı Red Hat ailesindendir ve dnf kullanır."],
    ],
  },
  {
    id: 5,
    title: "Kali Linux",
    short: "Güvenlik testi odaklı dağıtım: amacı, araç kategorileri, sanal makinede kullanım ve etik.",
    minutes: 40,
    goal: "Kali Linux'un ne olduğunu, hangi amaçla geliştirildiğini, araç kategorilerini ve en önemlisi etik ve yetkili kullanım ilkelerini öğreneceksin. Bu ders araçları öğretmek değil, Kali'yi tanıtmak ve güvenli laboratuvar kullanımını anlatmaktır.",
    outcomes: [
      "Kali Linux'un amacını ve Debian ile ilişkisini açıklayabilirsin.",
      "Araç kategorilerini (bilgi toplama, ağ analizi, güvenlik testi vb.) sayabilirsin.",
      "Kali'nin neden sanal makinede kullanıldığını anlatabilirsin.",
      "Etik kullanım ve yazılı yetkilendirmenin önemini açıklayabilirsin.",
    ],
    sections: [
      {
        h: "Kali Linux nedir?",
        p: [
          "Kali Linux, Offensive Security şirketi tarafından geliştirilen, Debian tabanlı ve sızma testi (penetration testing — bir sistemin güvenliğini izinli olarak sınama) ile dijital adli bilişim için hazırlanmış bir Linux dağıtımıdır. Yüzlerce güvenlik aracı hazır paketlenmiş halde gelir; böylece uzman araçları tek tek bulup kurmakla vakit harcamaz.",
          "Kali bir 'hacker işletim sistemi' değildir; bir profesyonel araç kutusudur. Tıpkı bir çilingirin alet çantası gibi: yetkili ve etik kullanıldığında kilitleri (güvenliği) test etmeye yarar, yetkisiz kullanıldığında suç oluşturur.",
        ],
        note: { type: "danger", text: "Kali Linux'un varlığı onu yasal kılmaz; araçlar yalnızca sahibi tarafından yazılı izin verilmiş sistemlerde kullanılabilir. İzinsiz tarama veya erişim birçok ülkede suçtur." },
      },
      {
        h: "Kali ve Debian ilişkisi",
        p: [
          "Kali, Debian'ın 'testing' dalına dayanır ve apt paket yöneticisini, .deb paketlerini, systemd ve temel dizin yapısını Debian'dan alır. Bu yüzden Debian/Ubuntu'da öğrendiğin her komut Kali'de de geçerlidir. Farkı; güvenlik araçlarının önceden yüklenmesi, özel çekirdek yamaları (ör. kablosuz test desteği) ve araç menülerinin düzenlenmiş olmasıdır.",
          "Kali, günlük kullanım için tasarlanmamıştır. Varsayılan ayarları ve sürekli değişen araç seti nedeniyle ana işletim sistemi olarak kullanılması önerilmez; ayrı bir laboratuvar ortamı olarak kullanılır.",
        ],
      },
      {
        h: "Araç kategorileri",
        p: [
          "Kali menüsü araçları bir güvenlik testinin aşamalarına göre gruplar: Bilgi toplama (hedef hakkında açık bilgileri keşfetme), Zafiyet analizi (bilinen açıkları tarama), Web uygulama analizi, Parola saldırıları (kimlik doğrulama dayanıklılığını test etme), Kablosuz ağ testleri, Sömürü araçları, Sızma sonrası, Adli bilişim ve Raporlama.",
          "Bu derste araçları çalıştırmayı değil, hangi kategorinin ne için var olduğunu öğreniyoruz. Örneğin Nmap ağ keşfi, Wireshark ağ trafiği analizi, John parola özeti gücü testi, Autopsy adli analiz içindir. Laboratuvarda bu araçlar yalnızca açıklama ve etik uyarı olarak sunulur; gerçekte çalıştırılmaz.",
        ],
        list: ["Bilgi toplama — Nmap, whois", "Ağ analizi — Wireshark, tcpdump", "Web uygulama analizi — Nikto, sqlmap", "Parola testleri — John, Hydra", "Kablosuz testleri — aircrack-ng", "Adli bilişim — Autopsy"],
      },
      {
        h: "Sanal makinede kullanım",
        p: [
          "Kali'yi öğrenirken en güvenli yöntem sanal makinedir (Virtual Machine — gerçek bilgisayarın içinde çalışan yalıtılmış sanal bilgisayar). VirtualBox veya VMware ile Kali'nin hazır sanal makine imajı kurulur. Hata yapsan bile ana sistemin etkilenmez; 'anlık görüntü (snapshot)' alıp bozulduğunda geri dönebilirsin.",
          "Ayrıca ağ yalıtımı sağlayabilirsin: iç ağ (host-only) kullanıp yalnızca kendi laboratuvar makinelerinle konuşursun. Böylece yanlışlıkla gerçek bir ağa zarar verme riskin ortadan kalkar. Bu platformdaki Kali masaüstü ise sanal makine bile değildir; yalnızca tarayıcıda çalışan bir eğitim simülasyonudur.",
        ],
      },
      {
        h: "Etik kullanım ve yetkilendirme",
        p: [
          "Etik hacker (white hat) yazılı izin alır, kapsamı (scope) belirler, yalnızca anlaşılan sistemlerde çalışır, bulduğu açıkları sorumlu biçimde raporlar ve verileri gizli tutar. İzin yoksa araç ne kadar 'masum' görünse de kullanım suçtur.",
          "Altın kurallar: 1) Yazılı izin al. 2) Kapsam dışına çıkma. 3) Gerçek veriye zarar verme. 4) Bulguları sorumlu bildir. 5) Kendi izole laboratuvarında öğren. Bu kurallar bu eğitim programının tamamında geçerlidir.",
        ],
      },
    ],
    concepts: [
      ["Sızma testi (Penetration Test)", "İzinli ve kapsamlı güvenlik sınaması."],
      ["Kali Linux", "Debian tabanlı güvenlik testi dağıtımı."],
      ["Sanal makine (VM)", "Yalıtılmış sanal bilgisayar; güvenli deneme ortamı."],
      ["Snapshot (anlık görüntü)", "Sanal makinenin geri dönülebilir kayıt noktası."],
      ["Kapsam (Scope)", "Testin yapılmasına izin verilen sistem ve yöntemler."],
      ["Yazılı yetkilendirme", "Test için sistem sahibinden alınan resmi izin."],
    ],
    everyday: [
      "Çilingirin alet çantası gibi: sahibi izin verirse kilidi açar, izinsiz kullanımı suçtur.",
      "Güvenlik şirketi bir bankayı kendi isteğiyle 'soyamaz'; banka yönetimi izin verip kapsamı belirler.",
      "Sanal makine, bir simülatörde uçuş öğrenmek gibidir: hata yapmak güvenlidir.",
    ],
    technical: [
      "Kali, Debian tabanlı olduğu için paketler apt ile yönetilir.",
      "Sanal makinede ağ 'Host-only' yapılarak laboratuvar dışı trafik engellenebilir.",
      "Kali imajı VirtualBox'ta .ova dosyası olarak içe aktarılabilir.",
    ],
    examples: [
      { title: "Dağıtım bilgisini görme (Kali simülasyonunda)", code: "$ cat /etc/os-release\nPRETTY_NAME=\"Kali GNU/Linux Rolling (SİMÜLASYON)\"\nID=kali\nID_LIKE=debian", desc: "ID_LIKE=debian satırı Kali'nin Debian akrabalığını gösterir." },
      { title: "Güvenli laboratuvar dizini", code: "$ cd ~/lab\n$ ls\nbetikler  hedefler.txt  notlar.md", desc: "Çalışmalarını izole bir klasörde düzenle ve notlarını tut." },
    ],
    guide: [
      "Masaüstünde 'Uygulamalar' menüsünden araç kategorilerine tıkla.",
      "En az 3 kategoriyi aç; açıklamayı ve etik uyarıyı oku.",
      "Terminali aç ve 'ls', ardından 'cd lab' komutlarını çalıştır.",
      "Lab dizininde touch, mkdir, cp veya mv ile dosya işlemleri yap.",
      "Etik kullanım kartını oku.",
    ],
    after: [
      "Kali'nin gücü araçların hazır gelmesindedir; sorumluluk kullanıcıya aittir.",
      "Bu laboratuvarda hiçbir gerçek araç çalışmadı: yalnızca açıklamalar ve sanal dosya işlemleri vardı.",
      "Güvenlik testi öncesinde kapsam ve izin belgesi mutlaka hazırlanır.",
    ],
    summary: [
      "Kali, Debian tabanlı bir güvenlik testi dağıtımıdır.",
      "Araçlar test aşamalarına göre kategorize edilmiştir.",
      "Kali'yi sanal makinede ve izole ağda kullanmak en güvenli yoldur.",
      "Etik kullanım = yazılı izin + kapsam + sorumlu raporlama.",
      "Bu eğitimde araçlar yalnızca tanıtılmış, çalıştırılmamıştır.",
    ],
    quiz: [
      ["Kali Linux hangi dağıtım üzerine kuruludur?", ["Arch Linux", "Debian", "Fedora", "openSUSE"], 1, "Kali, Debian tabanlıdır ve apt kullanır."],
      ["Kali araçlarını kullanmadan önce en önemli koşul nedir?", ["Hızlı internet", "Hedef sistemin sahibinden yazılı izin almak", "Yeni bir bilgisayar almak", "Antivirüsü kapatmak"], 1, "İzinsiz kullanım suçtur; yazılı yetkilendirme ve kapsam şarttır."],
      ["Kali'yi sanal makinede kullanmanın en büyük avantajı nedir?", ["Daha hızlı çalışması", "Ana sistemden yalıtılmış güvenli deneme ortamı sağlaması", "Lisans ücreti gerektirmemesi", "Terminal gerektirmemesi"], 1, "Sanal makine hataları ana sistemden ayırır; snapshot ile geri dönüş sağlar."],
      ["Nmap hangi kategoriye girer?", ["Bilgi toplama / ağ keşfi", "Adli bilişim", "Kablosuz ağ testi", "Ofis yazılımı"], 0, "Nmap, ağ keşfi ve port taramada kullanılan bilgi toplama aracıdır."],
      ["Kali Linux için hangisi doğrudur?", ["Günlük ana işletim sistemi olarak önerilir", "Bir araç kutusudur; yasal ve etik kullanım kullanıcıya aittir", "Her ülkede her araç serbesttir", "İzin gerektirmeden internet taraması yapılabilir"], 1, "Kali profesyonel bir araç setidir; sorumluluk kullanıcıdadır ve yetki şarttır."],
    ],
  },
];
