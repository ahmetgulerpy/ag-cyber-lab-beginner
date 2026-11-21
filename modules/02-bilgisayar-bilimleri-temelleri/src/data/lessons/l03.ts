import type { Lesson } from "../../types";

export const l03: Lesson = {
  id: 3,
  title: "CPU, RAM ve Depolama",
  en: "CPU, RAM and Storage",
  minutes: 45,
  goal: "İşlemci, bellek ve depolama arasındaki iş bölümünü anlamak; bir uygulamanın açılırken SSD'den RAM'e yüklenip CPU tarafından işlenmesini açıklayabilmek.",
  learn: [
    "CPU'nun görevlerini, ALU ve Control Unit'i, çekirdek ve saat hızını",
    "RAM'in çalışma mantığını ve neden geçici olduğunu",
    "ROM, HDD, SSD ve NVMe kavramlarını",
    "RAM ile depolama arasındaki farkı",
    "Cache Memory'nin neden gerekli olduğunu",
  ],
  concepts: [
    {
      title: "CPU: Bilgisayarın beyni",
      en: "Central Processing Unit",
      simple: "CPU (işlemci), komutları tek tek okuyup yerine getiren bileşendir. Ne kadar hızlı çalışırsa bilgisayar o kadar çevik hissedilir.",
      technical:
        "CPU iki ana birimden oluşur: ALU (Arithmetic Logic Unit — Aritmetik Mantık Birimi) toplama, çıkarma ve karşılaştırma gibi işlemleri yapar; Control Unit (Kontrol Birimi) komutları getirir, çözer ve diğer birimlerin sırasını yönetir. Modern CPU'lar birden fazla çekirdek (core) içerir; her çekirdek bağımsız komut yürütebilir. Clock Speed (saat hızı), GHz cinsinden saniyedeki çevrim sayısını gösterir (3,5 GHz ≈ saniyede 3,5 milyar çevrim). Daha fazla GHz her zaman daha hızlı demek değildir; mimari ve çekirdek sayısı da önemlidir.",
      example: "Bir mutfakta aşçı (çekirdek) ne kadar hızlı çalışırsa o kadar çok yemek çıkar. Çekirdek sayısı arttıkça birden fazla aşçı aynı anda farklı yemekler hazırlar.",
      code: "Fetch  → komutu bellekten al\nDecode → komutun ne istediğini çöz\nExecute→ ALU ile işlemi yap\nStore  → sonucu yaz",
      check: {
        q: "Toplama ve karşılaştırma gibi matematiksel/mantıksal işlemleri CPU'nun hangi birimi yapar?",
        options: ["Control Unit", "ALU", "Cache", "ROM"],
        answer: 1,
        explain: "ALU (Arithmetic Logic Unit) aritmetik ve mantık işlemlerini yürütür; Control Unit ise komutların sırasını yönetir.",
      },
    },
    {
      title: "RAM: Çalışma masası",
      en: "Random Access Memory",
      simple: "RAM, bilgisayarın üzerinde çalıştığı programların ve verilerin geçici olarak durduğu hızlı bellektir. Çalışma masası gibidir: üzerinde ne kadar çok yer varsa aynı anda o kadar çok işi rahatça yaparsın.",
      technical:
        "RAM, rastgele erişimli bir geçici (volatile) bellektir: her hücreye adresi ile hemen erişilebilir. Elektrik kesildiğinde içerik silinir. SSD'ye göre binlerce kat düşük gecikmeye sahiptir; bu yüzden çalışan programlar ve veriler depolamadan RAM'e yüklenir. RAM dolarsa işletim sistemi veriyi diske taşır (swap/page file) ve sistem belirgin biçimde yavaşlar.",
      example: "Çok sayıda tarayıcı sekmesi açtığında bilgisayar yavaşlıyorsa genellikle RAM yetersizliği yaşanıyordur.",
      check: {
        q: "RAM neden verileri kalıcı olarak saklamak için uygun değildir?",
        options: ["Çok yavaş olduğu için", "Elektrik kesilince içeriği silindiği için (volatile)", "Yalnızca metin tuttuğu için", "CPU'dan uzak olduğu için"],
        answer: 1,
        explain: "RAM volatile (uçucu) bir bellektir; veriyi korumak için sürekli elektrik gerekir.",
      },
    },
    {
      title: "ROM, HDD, SSD ve NVMe",
      en: "ROM, HDD, SSD, NVMe",
      simple:
        "ROM, içeriği çoğunlukla üretimde yazılan ve kalıcı olan bellektir (örneğin firmware). HDD içinde dönen manyetik diskler olan eski tip depolamadır. SSD'de hareketli parça yoktur ve çok daha hızlıdır. NVMe ise SSD'lerin çok hızlı bir bağlantı yöntemiyle çalışan türüdür.",
      technical:
        "HDD (Hard Disk Drive) manyetik plakalara okuma kafasıyla erişir; mekanik olduğu için gecikmesi yüksektir, ucuz ve büyük kapasitelidir. SSD (Solid State Drive) flash bellek kullanır; hareketli parça yoktur, darbeye dayanıklıdır. SATA SSD'ler yaklaşık 550 MB/s, NVMe (Non-Volatile Memory Express) SSD'ler PCIe yolunu kullanarak birkaç GB/s hıza ulaşır. ROM (Read-Only Memory) sadece okunabilir ya da çok seyrek yazılan kalıcı bellektir; modern firmware'ler flash bellekte tutulur.",
      example: "Eski bir dizüstü bilgisayarı HDD'den SSD'ye geçirmek, açılış süresini dakikalardan saniyelere düşürebilir.",
      check: {
        q: "Hareketli parça içermeyen, flash bellek tabanlı depolama aygıtı hangisidir?",
        options: ["HDD", "SSD", "Disket", "CD-ROM"],
        answer: 1,
        explain: "SSD hareketli parça içermez ve flash bellek kullanır; HDD ise dönen manyetik plakalara sahiptir.",
      },
    },
    {
      title: "Cache Memory ve bellek hiyerarşisi",
      en: "Cache Memory & Memory Hierarchy",
      simple: "Cache (önbellek), CPU'nun hemen yanında duran çok küçük ama çok hızlı bir bellektir. Sık kullanılan bilgileri orada tutarak CPU'nun RAM'i beklemesini önler.",
      technical:
        "Bellek hiyerarşisi hız, maliyet ve kapasite dengesi üzerine kurulur: Register (en hızlı, çok küçük) → L1 Cache → L2 Cache → L3 Cache → RAM → SSD → HDD (en yavaş, en büyük). CPU bir veriye ihtiyaç duyduğunda önce cache'e bakar: bulursa cache hit (hızlı), bulamazsa cache miss ile RAM'e gider. Programlar bellek erişimlerinde yerellik (locality) gösterdiği için cache çok etkilidir.",
      example: "Masana en sık kullandığın kalemi kalemliğe koyman cache gibidir; diğer eşyalar çekmecede (RAM) ya da dolapta (depolama) durur.",
      code: "Hız:      Cache  >  RAM  >  SSD  >  HDD\nKapasite: Cache  <  RAM  <  SSD  <  HDD",
      check: {
        q: "CPU aradığı veriyi cache'te bulursa buna ne denir?",
        options: ["Cache miss", "Cache hit", "Page fault", "Boot"],
        answer: 1,
        explain: "Veri cache'te bulunursa cache hit olur ve erişim çok hızlıdır; bulunamazsa cache miss yaşanır ve RAM'e gidilir.",
      },
    },
    {
      title: "RAM ve depolama arasındaki fark",
      en: "RAM vs Storage",
      simple: "RAM hızlıdır, küçüktür ve geçicidir; depolama yavaş, büyük ve kalıcıdır. Bu iki bellek türü birlikte çalışır: bir program önce depolamadan RAM'e yüklenir, sonra CPU onu RAM'den okur.",
      technical:
        "Uygulama açılırken yürütülebilir kod ve veri SSD'den RAM'e kopyalanır. CPU yalnızca RAM (ve cache) üzerindeki komutları doğrudan yürütür. Değişiklikler 'Kaydet' ile tekrar depolamaya yazılana kadar sadece RAM'dedir. Bu nedenle ani elektrik kesintilerinde kaydedilmemiş veri kaybolur.",
      example: "Bir kitabı (SSD) raftan alıp masana (RAM) koyarsın, okurken (CPU) sayfaları çevirirsin. Notlarını masada tutarsan masa toplanınca kaybolur; deftere (SSD) yazarsan kalır.",
      check: {
        q: "Bir uygulama başlatıldığında doğru sıra hangisidir?",
        options: ["CPU → SSD → RAM", "SSD → RAM → CPU", "RAM → SSD → CPU", "SSD → CPU → RAM"],
        answer: 1,
        explain: "Program önce SSD'den RAM'e yüklenir; CPU komutları RAM (ve cache) üzerinden alıp işler.",
      },
    },
  ],
  terms: [
    { tr: "Aritmetik Mantık Birimi", en: "ALU", def: "Hesaplama ve karşılaştırma yapan CPU birimi." },
    { tr: "Kontrol Birimi", en: "Control Unit", def: "Komutların akışını yöneten CPU birimi." },
    { tr: "Saat Hızı", en: "Clock Speed", def: "CPU'nun saniyedeki çevrim sayısı (GHz)." },
    { tr: "Önbellek", en: "Cache", def: "CPU'ya yakın küçük ve çok hızlı bellek." },
    { tr: "Uçucu bellek", en: "Volatile Memory", def: "Elektrik kesilince içeriğini kaybeden bellek (RAM)." },
    { tr: "Sadece okunur bellek", en: "ROM", def: "Kalıcı, çoğunlukla firmware'i tutan bellek." },
  ],
  realLife: [
    "Oyun açılırken 'Yükleniyor' ekranı: oyun verisi SSD'den RAM'e kopyalanır.",
    "Çok sekme açıkken yavaşlama: RAM dolar, sistem diski yedek bellek olarak kullanmaya başlar.",
    "Yeni nesil telefonlar: CPU, RAM ve flash depolama tek bir çip üzerinde birlikte tasarlanır.",
  ],
  labTitle: "Bilgisayar Bileşenleri Simülasyonu ve Arıza Teşhisi",
  labDesc: "Bir uygulamanın SSD'den RAM'e yüklenip CPU tarafından işlenmesini adım adım izle, ardından arıza belirtilerinin hangi bileşenden kaynaklandığını bul.",
  summary: [
    "CPU komutları fetch–decode–execute döngüsüyle yürütür; ALU hesaplar, Control Unit yönetir.",
    "RAM geçici ve hızlıdır; SSD/HDD kalıcı ve daha yavaştır.",
    "Cache, CPU'nun en sık ihtiyaç duyduğu veriyi hızlı sunarak beklemeyi azaltır.",
    "Uygulama önce depolamadan RAM'e yüklenir, sonra CPU tarafından işlenir.",
  ],
  quiz: [
    { q: "Bilgisayarın kapanınca verisini kaybeden belleği hangisidir?", options: ["SSD", "HDD", "RAM", "ROM"], answer: 2, explain: "RAM uçucu (volatile) bellektir." },
    { q: "CPU'nun aradığı veriyi bulamayıp RAM'e gitmesi neyi ifade eder?", options: ["Cache hit", "Cache miss", "Boot hatası", "Overclock"], answer: 1, explain: "Veri cache'te yoksa cache miss olur ve daha yavaş RAM'e erişilir." },
    { q: "NVMe SSD'yi SATA SSD'den ayıran en önemli özellik nedir?", options: ["Hareketli parça içermesi", "PCIe üzerinden çok daha yüksek hız sunması", "Kalıcı olmaması", "CPU yerine geçmesi"], answer: 1, explain: "NVMe, PCIe yolunu kullanarak çok daha yüksek aktarım hızına ulaşır." },
    { q: "Bir tarayıcıda çok sayıda sekme açıldığında sistem yavaşlıyor. En olası neden?", options: ["Monitörün küçük olması", "RAM'in dolması", "Klavyenin eski olması", "BIOS şifresi"], answer: 1, explain: "Açık sekmeler RAM tüketir; RAM dolunca işletim sistemi yavaş diske başvurur." },
    { q: "Aşağıdakilerden hangisi CPU'nun kontrol biriminin görevidir?", options: ["Dosyaları kalıcı saklamak", "Komutları getirip çözerek akışı yönetmek", "Ekrana görüntü çizmek", "İnternete bağlanmak"], answer: 1, explain: "Control Unit komutları fetch/decode ederek diğer birimlerin ne zaman çalışacağını belirler." },
  ],
};
