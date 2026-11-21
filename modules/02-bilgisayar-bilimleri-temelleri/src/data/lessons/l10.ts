import type { Lesson } from "../../types";

export const l10: Lesson = {
  id: 10,
  title: "Boot Süreci",
  en: "The Boot Process",
  minutes: 45,
  goal: "Güç düğmesine basıldığı andan masaüstünün hazır olmasına kadar geçen aşamaları sırasıyla açıklayabilmek ve açılış hatalarının hangi aşamada oluştuğunu belirleyebilmek.",
  learn: [
    "Boot sürecinin 9 aşamasını",
    "Firmware, POST ve bootloader'ın rolünü",
    "Kernel'in ve sistem servislerinin görevini",
    "MBR ve GPT'ye giriş",
    "Açılış hatalarının hangi aşamada oluştuğunu tespit etmeyi",
  ],
  concepts: [
    {
      title: "Güç, firmware ve POST",
      en: "Power On → Firmware → POST",
      simple: "Güç düğmesine bastığında anakart elektriği dağıtır, CPU çalışmaya başlar ve anakart üzerindeki firmware (BIOS/UEFI) devreye girer. Önce bütün parçalar sağlam mı diye kontrol edilir.",
      technical:
        "Güç kaynağı (PSU) 'Power Good' sinyali gönderir; CPU reset durumundan çıkar ve ilk komutu firmware'in bulunduğu adresten alır. Firmware donanımı başlatır (RAM, PCIe, depolama denetleyicileri). POST aşamasında CPU, RAM, ekran kartı gibi bileşenler test edilir; hata olursa bip kodu veya hata ışığı verilir ve açılış durur.",
      example: "Bilgisayar açılıyor ama ekranda hiçbir şey yok ve anakart bip sesi veriyorsa sorun genellikle POST aşamasında (RAM veya ekran kartı gibi) tespit edilmiştir.",
      check: {
        q: "RAM takılı değilse sistem büyük olasılıkla hangi aşamada durur?",
        options: ["Login ekranı", "POST", "Desktop Ready", "System Services"],
        answer: 1,
        explain: "POST sırasında RAM gibi kritik bileşenlerin yokluğu tespit edilir ve açılış devam etmez.",
      },
    },
    {
      title: "Boot aygıtı ve bootloader",
      en: "Boot Device Detection & Bootloader",
      simple: "POST bittikten sonra firmware işletim sisteminin nerede olduğunu arar. Doğru diski bulunca, işletim sistemini başlatmakla görevli küçük bir program olan bootloader'ı çalıştırır.",
      technical:
        "Firmware, Boot Order'a göre aygıtları dener. BIOS/MBR sisteminde diskin ilk 512 baytlık sektörü (MBR) okunur ve içindeki boot kodu yüklenir. UEFI/GPT sisteminde EFI System Partition içindeki .efi bootloader (örn. bootmgfw.efi, GRUB) çalıştırılır. Bootloader, işletim sisteminin çekirdeğini (kernel) bulur, RAM'e yükler ve kontrolü ona devreder.",
      example: "Çift işletim sistemi kullananlar açılışta Windows ya da Linux seçtikleri menüyü (GRUB) görür; bu menü bootloader'ın işidir.",
      code: "BIOS + MBR : ilk sektör (512 B) → boot kodu → OS yükleyici\nUEFI + GPT : ESP bölümü → .efi dosyası → OS yükleyici",
      check: {
        q: "Bootloader'ın görevi nedir?",
        options: ["Donanımı test etmek", "İşletim sistemi çekirdeğini bulup belleğe yüklemek", "Masaüstü ikonlarını çizmek", "Kullanıcı şifresini doğrulamak"],
        answer: 1,
        explain: "Bootloader kernel'i bulur, RAM'e yükler ve işletim sisteminin başlamasını sağlar.",
      },
    },
    {
      title: "Kernel ve sistem servisleri",
      en: "Kernel Loading & System Services",
      simple: "Kernel (çekirdek), işletim sisteminin kalbidir. Yüklendiğinde donanımla konuşmayı öğrenir (sürücüler), bellek ve işlemleri yönetmeye başlar ve ardından arka planda çalışması gereken servisleri başlatır.",
      technical:
        "Kernel RAM'e yüklenince sürücüleri başlatır, bellek ve process yönetimini kurar, kök dosya sistemini bağlar ve ilk kullanıcı alanı sürecini başlatır (Linux'ta init/systemd, Windows'ta Session Manager). Sistem servisleri; ağ, ses, güvenlik duvarı, yazdırma ve güncelleme gibi arka plan hizmetleridir. Hepsi hazır olunca kullanıcıdan kimlik doğrulama istenir.",
      example: "Masaüstü gelmeden önce Wi-Fi'nin bağlanması ve antivirüsün başlaması, sistem servislerinin çalışmasının sonucudur.",
      check: {
        q: "Aşağıdakilerden hangisi kernel yüklendikten sonra gerçekleşir?",
        options: ["POST", "Sistem servislerinin başlatılması", "Güç düğmesine basma", "Firmware kurulumu"],
        answer: 1,
        explain: "Kernel yüklendikten sonra sürücüler ve sistem servisleri başlatılır, ardından login ekranı gelir.",
      },
    },
    {
      title: "Login ekranı ve masaüstü",
      en: "Login Screen & Desktop Ready",
      simple: "Servisler hazır olunca bilgisayar sana kimsin diye sorar (login). Giriş yapınca masaüstü, görev çubuğu ve başlangıç programların yüklenir ve bilgisayar kullanıma hazır hale gelir.",
      technical:
        "Giriş yönetimi (Winlogon/GDM) kimlik doğrulaması yapar, kullanıcı profilini yükler ve masaüstü ortamını başlatır. Başlangıç programları (startup apps) bu aşamada çalışır; çok fazla başlangıç programı 'Desktop Ready' süresini uzatır. Diskte şifrelemeli sistemlerde kilit açma işlemi kernel yüklenmeden önce gerçekleşebilir.",
      example: "Bilgisayarın masaüstü geldikten sonra bir süre yavaş çalışması, arka planda yüklenen başlangıç programlarının sonucudur.",
      check: {
        q: "Masaüstü geç açılıyorsa neden sorgulanabilir?",
        options: ["Çok fazla başlangıç (startup) uygulaması olması", "Klavye ışığı", "Monitör kablosu rengi", "Mouse pad"],
        answer: 0,
        explain: "Çok sayıda başlangıç programı, masaüstü gelmesine rağmen sistemi meşgul eder ve kullanılabilir hale gelmeyi geciktirir.",
      },
    },
    {
      title: "Açılış hataları nasıl teşhis edilir?",
      en: "Troubleshooting boot failures",
      simple: "Bir açılış hatası, aşamalardan hangisinde oluştuğuna bakılarak teşhis edilir. Ekrandaki mesaj, hangi aşamada kaldığını söyler.",
      technical:
        "Hiç görüntü + bip: POST/donanım. 'No bootable device' / 'Operating System not found': firmware boot aygıtı veya bootloader bulamadı (boot sırası, disk bağlantısı, bozuk MBR/ESP). 'Bootloader error' (örn. BOOTMGR is missing, GRUB rescue): bootloader bozuk. Mavi ekran/kernel panic veya sonsuz döngü: kernel/OS yükleme veya sürücü hatası. Teşhis, aşama–belirti eşlemesi ile yapılır.",
      example: "'Insert boot media' mesajı gördüğünde sorun işletim sisteminde değil, firmware'in bootable diski bulamamasındadır.",
      check: {
        q: "'GRUB rescue>' ekranı hangi aşamadaki sorunu gösterir?",
        options: ["POST", "Bootloader", "Login screen", "Desktop"],
        answer: 1,
        explain: "GRUB bir bootloader'dır; rescue ekranı, işletim sistemi yapılandırmasını bulamadığını gösterir.",
      },
    },
  ],
  terms: [
    { tr: "Önyükleyici", en: "Bootloader", def: "Çekirdeği bulup yükleyen küçük program." },
    { tr: "Çekirdek", en: "Kernel", def: "İşletim sisteminin donanıma hükmeden merkezi." },
    { tr: "Servis", en: "Service / Daemon", def: "Arka planda çalışan sistem hizmeti." },
    { tr: "EFI Sistem Bölümü", en: "ESP", def: "UEFI bootloader dosyalarının tutulduğu bölüm." },
    { tr: "Mavi ekran", en: "BSOD / Kernel Panic", def: "Çekirdeğin kurtarılamaz hata sonrası durması." },
    { tr: "Başlangıç uygulamaları", en: "Startup Apps", def: "Oturum açılınca otomatik başlayan programlar." },
  ],
  realLife: [
    "Windows logosunun altındaki dönen noktalar genellikle kernel ve servislerin yüklendiği aşamayı gösterir.",
    "Yeni SSD takıldığında 'No bootable device' görmek yaygındır: üzerinde işletim sistemi yoktur.",
    "Telefon açılışındaki logo ekranı, kernel ve sistem servislerinin başlatıldığı zamandır.",
  ],
  labTitle: "Etkileşimli Bilgisayar Açılış Simülatörü",
  labDesc: "Açılışı başlat ve 9 aşamayı izle; ardından hata senaryolarında sorunun hangi aşamada oluştuğunu belirle.",
  summary: [
    "Açılış 9 aşamadan oluşur: Power On → Firmware → POST → Boot Device → Bootloader → Kernel → Services → Login → Desktop.",
    "Hatanın aşaması belirtilerden tahmin edilir: bip/POST, 'no bootable device', bootloader hatası veya OS yükleme hatası.",
    "BIOS/MBR ve UEFI/GPT farklı yollarla bootloader'ı bulur.",
    "Çok sayıda başlangıç programı masaüstünün kullanılabilir hale gelmesini yavaşlatır.",
  ],
  quiz: [
    { q: "Açılışta firmware donanımı test ettikten sonra hangi aşama gelir?", options: ["Login ekranı", "Boot Device Detection", "Kernel Loading", "Desktop Ready"], answer: 1, explain: "POST'tan sonra firmware boot aygıtını tespit eder." },
    { q: "'No bootable device' hatası hangi aşamada ortaya çıkar?", options: ["Firmware'in önyükleme aygıtı bulamaması", "Masaüstü yüklenirken", "Servisler başlarken", "Güç düğmesine basmadan önce"], answer: 0, explain: "Firmware hiçbir boot edilebilir aygıt bulamazsa bu hata ortaya çıkar." },
    { q: "Kernel'in görevlerinden biri aşağıdakilerden hangisidir?", options: ["Kullanıcıya şarkı önermek", "Bellek ve process yönetimi", "Ekranı fiziksel olarak üretmek", "Kablosuz ağ şifresi vermek"], answer: 1, explain: "Kernel bellek, işlem ve aygıt yönetiminden sorumludur." },
    { q: "UEFI sistemlerde bootloader dosyaları nerede bulunur?", options: ["EFI System Partition (ESP)", "RAM", "Klavye belleği", "Tarayıcı önbelleği"], answer: 0, explain: "UEFI .efi dosyalarını ESP bölümünde arar." },
    { q: "Mavi ekran (BSOD) sorununun en yakın olduğu aşama nedir?", options: ["Kernel/OS yükleme veya çalışma", "Güç düğmesi", "POST bip kodu", "Klavye bağlantısı"], answer: 0, explain: "BSOD çekirdeğin kritik bir hata ile durmasıdır." },
  ],
};
