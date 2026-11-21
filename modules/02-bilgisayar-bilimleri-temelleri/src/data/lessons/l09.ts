import type { Lesson } from "../../types";

export const l09: Lesson = {
  id: 9,
  title: "BIOS ve UEFI",
  en: "BIOS and UEFI",
  minutes: 40,
  goal: "BIOS ve UEFI firmware'lerinin görevini, aralarındaki farkları ve boot ayarlarının önemini anlamak; 'boot edilebilir disk bulunamadı' hatasının olası nedenlerini çözümleyebilmek.",
  learn: [
    "BIOS ve UEFI'nin ne olduğunu ve tarihsel gelişimini",
    "POST sürecini ve donanım kontrolünü",
    "Boot Device ve Boot Order kavramlarını",
    "Secure Boot'un güvenlikteki rolünü",
    "CMOS ve NVRAM'e giriş",
  ],
  concepts: [
    {
      title: "BIOS: Tarihsel rol",
      en: "BIOS — Basic Input/Output System",
      simple: "BIOS, bilgisayar açıldığında çalışan ilk yazılımdır. Donanımın sağlam olup olmadığına bakar ve işletim sistemini bulup başlatır. 1980'lerden beri kullanılan eski bir sistemdir.",
      technical:
        "BIOS anakart üzerindeki flash bellekte tutulan firmware'dir. 16-bit gerçek modda çalışır, 1 MB adres alanıyla sınırlıdır, MBR (Master Boot Record) disk düzenini kullanır ve en fazla 2 TB'lık diskleri destekler. Ayarlar (saat, boot sırası) CMOS belleğinde saklanır; CMOS pil (CR2032) ile beslenir. Pil biterse saat ve ayarlar sıfırlanabilir.",
      example: "Eski bilgisayarlarda açılışta 'Press DEL to enter setup' yazısı çıkar; DEL tuşu BIOS ayar ekranına götürür.",
      check: {
        q: "BIOS ayarlarının (saat, boot sırası) kaybolmasını önleyen küçük bileşen hangisidir?",
        options: ["CMOS pili", "RAM", "CPU fanı", "Ekran kartı"],
        answer: 0,
        explain: "CMOS belleğini besleyen pil, bilgisayar kapalıyken bile ayarları ve saati korur.",
      },
    },
    {
      title: "UEFI: Modern firmware",
      en: "UEFI — Unified Extensible Firmware Interface",
      simple: "UEFI, BIOS'un modern halefidir. Daha hızlı açılır, grafik arayüz sunar, büyük diskleri destekler ve Secure Boot gibi güvenlik özellikleri içerir.",
      technical:
        "UEFI 32/64-bit modda çalışır, GPT (GUID Partition Table) ile 2 TB üzerindeki diskleri destekler, ağ erişimi ve fare destekli arayüz sunabilir. Boot yükleyicileri EFI System Partition (ESP) adlı bir bölümde .efi dosyaları olarak bulunur. Boot ayarları NVRAM'de saklanır. Birçok UEFI, eski sistemleri çalıştırmak için CSM (Compatibility Support Module) / Legacy modu sunar.",
      example: "Windows 11 kurulumu için UEFI + Secure Boot gerekliliği, modern bilgisayarlarda UEFI'nin standart olduğunu gösterir.",
      code: "BIOS : MBR  → ≤ 2 TB disk, 16-bit, metin menü\nUEFI : GPT  → ≫ 2 TB disk, 32/64-bit, grafik menü, Secure Boot",
      check: {
        q: "Aşağıdakilerden hangisi UEFI'nin BIOS'a göre avantajıdır?",
        options: ["Daha küçük disk desteği", "Secure Boot ve GPT desteği", "Yalnızca klavye ile kullanım", "İşletim sistemi yerine geçmesi"],
        answer: 1,
        explain: "UEFI, GPT ve Secure Boot desteği sunar; ayrıca daha hızlı açılır ve büyük diskleri destekler.",
      },
    },
    {
      title: "POST, Boot Device ve Boot Order",
      en: "POST, Boot Device, Boot Order",
      simple: "Bilgisayar açıldığında önce kendini kontrol eder (POST). Sonra işletim sistemini nerede arayacağına bakar: önce SSD'ye mi, USB'ye mi? Bu sıralamaya Boot Order denir.",
      technical:
        "POST (Power-On Self-Test), firmware'in açılışta CPU, RAM, ekran kartı ve temel aygıtları test etmesidir. Hata varsa bip kodları veya ekran mesajıyla bildirir. POST başarılı olursa firmware, Boot Order listesindeki aygıtları sırayla dener; ilk bulduğu boot edilebilir aygıttaki bootloader'ı çalıştırır. Boot Order değiştirilerek USB'den kurulum yapılabilir.",
      example: "Windows kurulumu için USB bellekten açmak istediğinde Boot Order'da USB'yi SSD'nin önüne alırsın.",
      check: {
        q: "POST'un görevi nedir?",
        options: ["İşletim sistemini silmek", "Donanımın temel sağlık kontrolünü yapmak", "Dosyaları sıkıştırmak", "İnternete bağlanmak"],
        answer: 1,
        explain: "POST açılışta CPU, RAM ve diğer temel donanımın çalışıp çalışmadığını test eder.",
      },
    },
    {
      title: "Secure Boot, CMOS ve NVRAM",
      en: "Secure Boot, CMOS, NVRAM",
      simple: "Secure Boot, bilgisayarın yalnızca imzası doğrulanmış (güvenilir) yazılımları başlatmasını sağlar. Böylece açılışa zararlı kod sızması zorlaşır.",
      technical:
        "Secure Boot, UEFI'nin yalnızca güvenilir anahtarlarla dijital imzalanmış bootloader ve çekirdekleri çalıştırmasını sağlar. Bootkit ve rootkit türü açılış öncesi zararlılara karşı koruma sağlar. CMOS (BIOS dönemi) ve NVRAM (UEFI dönemi) firmware ayarlarının tutulduğu küçük kalıcı bellek alanlarıdır. BIOS/UEFI şifresi, yetkisiz kişilerin boot sırasını değiştirip başka bir sistemden açmasını engeller.",
      example: "Çalınan bir dizüstünde firmware şifresi ve disk şifrelemesi birlikte kullanılırsa, USB'den açıp veri okumak çok zorlaşır.",
      check: {
        q: "Secure Boot neyi sağlar?",
        options: ["Sadece güvenilir imzalı boot yazılımlarının çalışmasını", "Daha çok RAM kullanımını", "Dosyaların otomatik yedeklenmesini", "İnternet hızını artırmayı"],
        answer: 0,
        explain: "Secure Boot imzası doğrulanamayan bootloader/çekirdeklerin çalışmasını engeller.",
      },
    },
  ],
  terms: [
    { tr: "Açılış Kendi Kendini Test", en: "POST", def: "Açılışta donanımın temel kontrolü." },
    { tr: "Önyükleme sırası", en: "Boot Order", def: "Firmware'in önyükleme aygıtlarını deneme sırası." },
    { tr: "Güvenli önyükleme", en: "Secure Boot", def: "Yalnızca imzalı yazılımların açılışta çalışmasına izin veren özellik." },
    { tr: "Ana önyükleme kaydı", en: "MBR", def: "BIOS dönemi disk bölümleme şeması." },
    { tr: "GUID bölüm tablosu", en: "GPT", def: "UEFI ile kullanılan modern disk bölümleme şeması." },
    { tr: "Uyumluluk modu", en: "CSM / Legacy", def: "UEFI'de eski BIOS tarzı açılışı sağlayan mod." },
  ],
  realLife: [
    "Bilgisayarı USB'den başlatmak için açılışta F12/ESC gibi tuşlarla boot menüsüne girilir.",
    "Bip sesi dizileri (örn. kısa-uzun) POST'ta bulunan donanım hatalarını işaret edebilir.",
    "Firmware güncellemeleri, açılış öncesi yazılımlardaki güvenlik açıklarını kapatır.",
  ],
  labTitle: "BIOS/UEFI Simülasyonu ve 'Boot Edilemiyor' Senaryosu",
  labDesc: "Eğitim amaçlı BIOS/UEFI arayüzünde ayarları incele, boot sırasını değiştir ve 'boot edilebilir disk bulunamadı' hatasını analiz et.",
  summary: [
    "BIOS ve UEFI, işletim sisteminden önce çalışan firmware'dir.",
    "UEFI; GPT, Secure Boot, grafik arayüz ve büyük disk desteği sunar.",
    "POST donanımı test eder; Boot Order işletim sisteminin nerede aranacağını belirler.",
    "Ayarlar CMOS/NVRAM'de saklanır; Secure Boot ve firmware şifresi güvenlik katmanlarıdır.",
  ],
  quiz: [
    { q: "Hangisi UEFI ile kullanılan modern disk düzenidir?", options: ["MBR", "GPT", "FAT12", "ROM"], answer: 1, explain: "UEFI genellikle GPT disk düzeniyle çalışır." },
    { q: "Boot Order'da USB'yi SSD'nin önüne almanın tipik nedeni?", options: ["Bilgisayarı hızlandırmak", "USB'den işletim sistemi kurulumu başlatmak", "RAM'i artırmak", "Ekranı açmak"], answer: 1, explain: "Kurulum medyasından açmak için USB aygıtı önce denenmelidir." },
    { q: "Secure Boot kapalı olursa hangi risk artar?", options: ["İmzasız/zararlı bootloader çalışabilir", "Ekran kararır", "RAM azalır", "Dosya adı değişir"], answer: 0, explain: "Secure Boot doğrulama yapmadığında açılış öncesi zararlılar çalışabilir." },
    { q: "BIOS'un MBR ile desteklediği tipik en büyük disk boyutu nedir?", options: ["500 GB", "2 TB", "100 TB", "Sınırsız"], answer: 1, explain: "MBR yaklaşık 2 TB üzerindeki bölümleri adresleyemez." },
    { q: "POST başarılı olduktan sonra firmware ne yapar?", options: ["Boot Order'daki aygıtlarda bootloader arar", "Bilgisayarı kapatır", "Kullanıcı şifresini siler", "Tarayıcıyı açar"], answer: 0, explain: "POST'tan sonra firmware önyükleme aygıtlarını sırayla dener." },
  ],
};
