import type { Lesson } from "../../types";

export const l02: Lesson = {
  id: 2,
  title: "Donanım ve Yazılım",
  en: "Hardware and Software",
  minutes: 35,
  goal: "Donanım, yazılım ve firmware kavramlarını ayırt edebilmek; işletim sistemi ve sürücülerin rolünü anlamak.",
  learn: [
    "Donanım (hardware) ve yazılım (software) arasındaki farkı",
    "Sistem yazılımı ile uygulama yazılımının farkını",
    "İşletim sisteminin görevlerini",
    "Firmware ve driver (sürücü) kavramlarını",
    "Bir bileşeni doğru kategoriye yerleştirmeyi",
  ],
  concepts: [
    {
      title: "Donanım (Hardware)",
      en: "Hardware",
      simple: "Donanım, bilgisayarın dokunabildiğin fiziksel parçalarıdır: işlemci, RAM, SSD, ekran kartı, klavye, fare, monitör, anakart.",
      technical:
        "Donanım; elektronik devreler, yarı iletkenler ve mekanik parçalardan oluşur. Girdi (klavye), işleme (CPU, GPU), bellek (RAM), depolama (SSD/HDD) ve çıktı (monitör) olmak üzere işlevlerine göre sınıflandırılır. Donanım tek başına yalnızca elektrik taşır; ne yapacağını yazılım belirler.",
      example: "Bir bilgisayarı açtığında kasanın içinde gördüğün anakart, soğutucu ve kartlar donanımdır. Ekrana yansıyan Windows masaüstü ise yazılımdır.",
      check: {
        q: "Aşağıdakilerden hangisi donanımdır?",
        options: ["Tarayıcı", "Ekran kartı", "Linux", "Aygıt sürücüsü"],
        answer: 1,
        explain: "Ekran kartı (GPU) fiziksel bir bileşendir. Tarayıcı ve Linux yazılım, aygıt sürücüsü ise yazılımdır.",
      },
    },
    {
      title: "Yazılım (Software): Sistem ve Uygulama",
      en: "Software: System & Application",
      simple:
        "Yazılım, bilgisayara ne yapacağını anlatan programlardır. Sistem yazılımları bilgisayarı çalışır halde tutar (işletim sistemi gibi); uygulama yazılımları ise senin işini görür (tarayıcı, oyun, ofis programı).",
      technical:
        "Sistem yazılımları (system software) donanım kaynaklarını yönetir ve uygulamalara ortam sağlar: işletim sistemi, sürücüler, yardımcı araçlar. Uygulama yazılımları (application software) belirli bir kullanıcı amacına hizmet eder. Uygulamalar donanıma doğrudan değil, işletim sistemi aracılığıyla erişir.",
      example: "Windows ya da Linux sistem yazılımıdır; Chrome, Word, Spotify uygulama yazılımıdır. Spotify müzik çalmak için doğrudan hoparlöre değil, işletim sisteminden ses hizmeti ister.",
      check: {
        q: "Aşağıdakilerden hangisi uygulama yazılımıdır?",
        options: ["Linux çekirdeği", "Tarayıcı", "BIOS/UEFI", "Aygıt sürücüsü"],
        answer: 1,
        explain: "Tarayıcı, kullanıcının web sayfalarını görüntüleme amacına hizmet eden bir uygulama yazılımıdır.",
      },
    },
    {
      title: "İşletim sisteminin rolü",
      en: "Role of the Operating System",
      simple:
        "İşletim sistemi bilgisayarın yöneticisidir. Hangi programın ne kadar belleği ve işlemciyi kullanacağına karar verir, dosyaları düzenler ve donanımla programlar arasında köprü kurar.",
      technical:
        "İşletim sistemi (Operating System, OS) şu görevleri üstlenir: işlem (process) yönetimi, bellek yönetimi, dosya sistemi yönetimi, aygıt yönetimi ve kullanıcı arayüzü sağlama. Ayrıca erişim denetimi ile güvenliğin temelini oluşturur. Örnekler: Windows, macOS, Linux, Android.",
      example: "Aynı anda hem müzik dinleyip hem tarayıcıda gezebilmen, işletim sisteminin CPU zamanını ve RAM'i programlar arasında paylaştırmasındandır.",
      check: {
        q: "Aşağıdakilerden hangisi işletim sisteminin görevlerinden biri DEĞİLDİR?",
        options: ["Bellek yönetimi", "Dosya sistemi yönetimi", "İşlemci transistörlerini üretmek", "Programlar arasında CPU zamanını paylaştırmak"],
        answer: 2,
        explain: "Transistör üretimi bir fabrikasyon sürecidir; işletim sistemi yazılımdır ve kaynakları yönetir.",
      },
    },
    {
      title: "Firmware (Yerleşik Yazılım)",
      en: "Firmware",
      simple:
        "Firmware, donanımın içine gömülü, ona ilk talimatları veren özel yazılımdır. Bilgisayar açıldığında işletim sistemi daha yüklenmeden çalışan ilk yazılım budur. Hem yazılım hem donanım gibi davrandığı için aralarda bir köprüdür.",
      technical:
        "Firmware, kalıcı bellek (flash) üzerinde saklanır. Bilgisayarlarda BIOS/UEFI anakartın firmware'idir; ayrıca SSD, router, yazıcı ve klavye gibi cihazların kendi firmware'i bulunur. Firmware güncellemeleri hata düzeltir ve güvenlik açıklarını kapatır; yanlış güncelleme ise cihazı kullanılamaz hale getirebilir.",
      example: "Wi-Fi router'ının yönetim panelindeki 'firmware sürümü' bilgisi, cihazın içindeki yazılımın sürümünü gösterir. Güvenlik için güncel tutulması önerilir.",
      check: {
        q: "BIOS/UEFI hangi kategoriye girer?",
        options: ["Uygulama yazılımı", "Firmware", "Çıktı aygıtı", "Depolama aygıtı"],
        answer: 1,
        explain: "BIOS/UEFI, anakartın üzerindeki flash bellekte saklanan ve açılışta ilk çalışan firmware'dir.",
      },
    },
    {
      title: "Driver (Sürücü) ve donanım–yazılım ilişkisi",
      en: "Driver",
      simple:
        "Sürücü, işletim sisteminin bir donanımı nasıl kullanacağını öğrenmesini sağlayan çevirmen yazılımdır. Yeni bir yazıcı taktığında 'sürücü yükleniyor' mesajı görmen bu yüzdendir.",
      technical:
        "Aygıt sürücüsü (device driver), işletim sistemi çekirdeğinin ortak komutlarını belirli bir donanımın anlayacağı komutlara çevirir. Sürücüler yüksek yetkiyle çalıştığı için hatalı veya kötü amaçlı bir sürücü sistem kararlılığını ve güvenliğini ciddi şekilde etkileyebilir; bu nedenle yalnızca güvenilir kaynaklardan indirilmelidir.",
      example: "Ekran kartı sürücüsünü güncellediğinde oyunlar daha iyi çalışabilir; çünkü işletim sistemi ile kart arasındaki iletişim iyileşir.",
      code: "Uygulama → İşletim Sistemi → Sürücü → Donanım\n(yazılım)   (sistem yazılımı)  (sistem yazılımı)  (fiziksel)",
      check: {
        q: "Sürücüleri neden yalnızca güvenilir kaynaklardan indirmeliyiz?",
        options: ["Dosya boyutları büyük olduğu için", "Yüksek yetkiyle çalıştıkları için kötü amaçlı sürücü sistemi ele geçirebilir", "Ücretli oldukları için", "Yalnızca ekran kartlarında gerekli oldukları için"],
        answer: 1,
        explain: "Sürücüler işletim sistemi çekirdeğine yakın ve yüksek yetkiyle çalışır; bu yüzden zararlı bir sürücü büyük risk oluşturur.",
      },
    },
  ],
  terms: [
    { tr: "Donanım", en: "Hardware", def: "Bilgisayarın fiziksel bileşenleri." },
    { tr: "Yazılım", en: "Software", def: "Donanıma ne yapacağını anlatan programlar." },
    { tr: "Yerleşik yazılım", en: "Firmware", def: "Donanım üzerindeki kalıcı belleğe gömülü düşük seviyeli yazılım." },
    { tr: "Sürücü", en: "Driver", def: "İşletim sisteminin bir donanımla konuşmasını sağlayan yazılım." },
    { tr: "İşletim sistemi", en: "Operating System", def: "Kaynakları yöneten ve uygulamalara ortam sağlayan sistem yazılımı." },
    { tr: "Çekirdek", en: "Kernel", def: "İşletim sisteminin donanıma en yakın ve en yetkili çekirdek parçası." },
  ],
  realLife: [
    "Akıllı TV: Ekran ve işlemci donanımdır; Android TV işletim sistemidir; Netflix uygulamadır; açılışta çalışan gömülü yazılım firmware'dir.",
    "Yazıcı: Fiziksel makine donanım, bilgisayardaki sürücü iletişim kurar, Word ise yazdırma isteğini veren uygulamadır.",
    "Router güncellemesi: Üretici firmware güncellemesi yayınlayarak güvenlik açıklarını kapatır.",
  ],
  labTitle: "Bileşen Sınıflandırma Laboratuvarı",
  labDesc: "10 bileşeni donanım, yazılım veya firmware kategorilerine yerleştir; her seçimden sonra açıklamayı oku.",
  summary: [
    "Donanım fiziksel, yazılım mantıksaldır; firmware ise donanım içinde saklanan özel yazılımdır.",
    "Sistem yazılımı bilgisayarı yönetir; uygulama yazılımı kullanıcı için iş yapar.",
    "İşletim sistemi süreç, bellek, dosya ve aygıt yönetimini üstlenir.",
    "Sürücüler işletim sistemi ve donanım arasındaki çevirmendir; güvenilir kaynaktan edinilmelidir.",
  ],
  quiz: [
    { q: "Aşağıdakilerden hangisi sistem yazılımıdır?", options: ["Oyun", "Tarayıcı", "İşletim sistemi", "Ofis programı"], answer: 2, explain: "İşletim sistemi donanım kaynaklarını yönettiği için sistem yazılımıdır." },
    { q: "Firmware'in en belirgin özelliği nedir?", options: ["Sadece internet üzerinden çalışması", "Donanım üzerinde kalıcı bellekte saklanması", "Yalnızca oyunlarda bulunması", "Kullanıcı tarafından her gün yazılması"], answer: 1, explain: "Firmware kalıcı bellekte (örn. flash) durur ve cihaz açıldığında ilk talimatları sağlar." },
    { q: "Yeni bir yazıcı takıldığında bilgisayarın onu kullanabilmesi için hangisi gerekir?", options: ["Sürücü", "Tarayıcı eklentisi", "Ekran koruyucu", "Yeni RAM"], answer: 0, explain: "Sürücü, işletim sistemine yazıcıyı nasıl kullanacağını anlatır." },
    { q: "Aşağıdaki eşleşmelerden hangisi doğrudur?", options: ["Klavye – Yazılım", "Linux – Donanım", "SSD – Donanım", "BIOS – Uygulama yazılımı"], answer: 2, explain: "SSD fiziksel bir depolama aygıtıdır; Linux yazılım, BIOS firmware'dir." },
    { q: "Aynı anda birden çok programın çalışabilmesini hangisi sağlar?", options: ["Klavye", "İşletim sistemi", "Monitör", "Kasa"], answer: 1, explain: "İşletim sistemi CPU zamanını ve belleği programlar arasında paylaştırır." },
  ],
};
