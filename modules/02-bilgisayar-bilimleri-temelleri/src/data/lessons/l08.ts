import type { Lesson } from "../../types";

export const l08: Lesson = {
  id: 8,
  title: "Bilgisayar Mimarisi",
  en: "Computer Architecture",
  minutes: 45,
  goal: "Bilgisayarın ana bileşenlerinin birbirleriyle veri yolları (bus) üzerinden nasıl iletişim kurduğunu ve Von Neumann mimarisinin temel mantığını kavramak.",
  learn: [
    "Bilgisayar mimarisi kavramını",
    "Von Neumann ve Harvard mimarilerini",
    "Address, Data ve Control Bus'ın görevlerini",
    "Anakartın rolünü",
    "32-bit / 64-bit ve x86 / x64 farklarını",
  ],
  concepts: [
    {
      title: "Mimari nedir? Von Neumann ve Harvard",
      en: "Architecture: Von Neumann & Harvard",
      simple: "Mimari, bir bilgisayarın parçalarının nasıl bir düzende bir araya getirildiğini anlatır. Von Neumann mimarisinde program ve veri aynı bellekte durur; bilgisayarların büyük çoğunluğu bu fikre dayanır.",
      technical:
        "Von Neumann mimarisi: CPU (ALU + Control Unit + kayıtlar), tek ortak bellek (komutlar ve veri), giriş/çıkış birimleri ve bunları bağlayan veri yolları. Tek bellek yolu nedeniyle komut ve veri aynı anda getirilemez; buna Von Neumann darboğazı denir. Harvard mimarisinde komut ve veri belleği ayrıdır ve ayrı yollarla erişilir; mikrodenetleyicilerde ve CPU'ların L1 cache tasarımında bu fikir kullanılır.",
      example: "Von Neumann: tek raflı bir kütüphane, hem tarifler hem malzemeler aynı rafta. Harvard: tarifler bir rafta, malzemeler başka rafta — ikisini aynı anda alabilirsin.",
      check: {
        q: "Von Neumann mimarisinin ayırt edici özelliği nedir?",
        options: ["Komut ve verinin ayrı bellekte olması", "Komut ve verinin aynı bellekte saklanması", "CPU bulunmaması", "Yalnızca 32 bit olması"],
        answer: 1,
        explain: "Von Neumann'da program (komut) ve veri aynı bellek alanında saklanır; Harvard'da ayrıdır.",
      },
    },
    {
      title: "Veri yolları (Bus)",
      en: "Buses: Address, Data, Control",
      simple: "Bus, bilgisayar bileşenleri arasında veri taşıyan yollar gibidir. Üç tür vardır: adresi taşıyan (nereye?), veriyi taşıyan (ne?) ve komutları/sinyalleri taşıyan (okuma mı yazma mı?).",
      technical:
        "Address Bus: CPU'nun hangi bellek hücresine veya aygıta erişeceğini belirten adresi taşır; tek yönlüdür (CPU → bellek). Genişliği adreslenebilir belleği belirler: 32 bit = 2³² = 4 GiB, 64 bit teoride 16 EiB. Data Bus: asıl veriyi çift yönlü taşır; genişliği her seferde aktarılan bit sayısını etkiler. Control Bus: okuma/yazma (Read/Write), saat (clock), kesme (interrupt) gibi kontrol sinyallerini taşır.",
      example: "Postane benzetmesi: Address Bus = posta kutusu numarası, Data Bus = zarfın içindeki mektup, Control Bus = 'teslim al / gönder' talimatı.",
      code: "CPU ──Address Bus──▶ RAM   (hangi adres? 0x7FF0)\nCPU ◀─Data Bus────▶ RAM   (veri: 0x2A)\nCPU ──Control Bus──▶ RAM  (READ / WRITE)",
      check: {
        q: "CPU'nun hangi bellek hücresine erişeceğini hangi bus bildirir?",
        options: ["Data Bus", "Address Bus", "Control Bus", "USB Bus"],
        answer: 1,
        explain: "Address Bus hedef adresi taşır; veri Data Bus'tan, okuma/yazma bilgisi Control Bus'tan geçer.",
      },
    },
    {
      title: "Anakart ve bileşenler arası iletişim",
      en: "Motherboard & communication",
      simple: "Anakart (motherboard), bilgisayarın bütün parçalarının takıldığı ve birbirleriyle konuşmasını sağlayan ana kart'tır. Şehirdeki ana yol ağı gibidir.",
      technical:
        "Anakart; CPU soketi, RAM yuvaları, PCIe genişleme yuvaları, depolama konnektörleri (SATA, M.2), güç dağıtımı ve chipset içerir. Chipset, CPU ile çevre birimleri arasındaki trafiği yönetir. Yüksek hızlı bileşenler (RAM, GPU, NVMe) CPU'ya doğrudan veya çok yakın bağlanır; yavaş çevre birimleri (USB, ses) chipset üzerinden geçer.",
      example: "Bir oyun sırasında GPU PCIe hattından büyük miktarda veri alırken, fare USB üzerinden küçük paketlerle bilgi gönderir.",
      check: {
        q: "Anakartın temel rolü nedir?",
        options: ["Veri saklamak", "Bileşenleri fiziksel ve elektriksel olarak birbirine bağlamak", "İnternete çıkmak", "Güvenlik duvarı olmak"],
        answer: 1,
        explain: "Anakart, tüm bileşenleri bağlayan ve aralarında veri yollarını sağlayan ana devre kartıdır.",
      },
    },
    {
      title: "32-bit/64-bit ve x86/x64",
      en: "32-bit vs 64-bit, x86 vs x64",
      simple: "32 ve 64 bit, işlemcinin bir seferde işleyebildiği veri genişliğini ve adresleyebileceği bellek miktarını belirtir. 64 bit daha büyük bellek ve veri ile çalışabilir.",
      technical:
        "32-bit sistemler en fazla 4 GiB RAM adresleyebilir; 64-bit sistemler pratikte yüzlerce GB ve terabaytları destekler. x86, Intel 8086 ailesinden gelen 32-bit komut seti mimarisidir; x64 (x86-64/AMD64) bunun 64-bit genişletmesidir. ARM ise telefonlarda ve Apple Silicon'da yaygın farklı bir komut setidir. Bir uygulama, işlemcinin komut setine uygun derlenmiş olmalıdır.",
      example: "8 GB RAM'li bir bilgisayarda 32-bit işletim sistemi kurulursa yaklaşık 4 GiB'lik kısmı kullanılabilir; bu yüzden modern sistemler 64-bit'tir.",
      check: {
        q: "32-bit bir işletim sistemi en fazla ne kadar RAM'i doğrudan adresleyebilir?",
        options: ["1 GB", "4 GiB", "64 GB", "1 TB"],
        answer: 1,
        explain: "2³² = 4.294.967.296 adres olduğundan 32-bit sistem yaklaşık 4 GiB belleği adresler.",
      },
    },
    {
      title: "Mimarinin performansa etkisi",
      en: "Architecture and performance",
      simple: "Bilgisayarın hızı sadece işlemci hızına bağlı değildir. Parçalar arası veri yolu darboğazları, bellek hızı, cache ve çekirdek sayısı da performansı belirler.",
      technical:
        "Darboğaz (bottleneck): sistemin en yavaş halkasının toplam performansı sınırlaması. Örneğin hızlı CPU yavaş depolamadan veri beklerse boşa bekler. Performansı etkileyen faktörler: bus genişliği ve hızı, RAM bant genişliği ve gecikmesi, cache boyutu, çekirdek sayısı ve komut seti verimliliğidir.",
      example: "HDD'li bir bilgisayara güçlü bir işlemci takmak açılış süresini çok iyileştirmez; asıl darboğaz depolamadır.",
      check: {
        q: "Aşağıdakilerden hangisi performans darboğazına bir örnektir?",
        options: ["Hızlı SSD", "Güçlü CPU'nun çok yavaş depolamadan veri beklemesi", "Fazla cache", "Çok çekirdek"],
        answer: 1,
        explain: "Sistemin en yavaş bileşeni, diğerlerinin hızlı olmasına rağmen toplam performansı sınırlar.",
      },
    },
  ],
  terms: [
    { tr: "Adres yolu", en: "Address Bus", def: "Bellek/aygıt adresini taşıyan yol." },
    { tr: "Veri yolu", en: "Data Bus", def: "Gerçek veriyi taşıyan çift yönlü yol." },
    { tr: "Kontrol yolu", en: "Control Bus", def: "Okuma/yazma ve zamanlama sinyallerini taşıyan yol." },
    { tr: "Yonga seti", en: "Chipset", def: "CPU ile çevre birimleri arasındaki trafiği yöneten devre." },
    { tr: "Darboğaz", en: "Bottleneck", def: "Performansı sınırlayan en yavaş halka." },
    { tr: "Komut seti", en: "Instruction Set Architecture", def: "CPU'nun anladığı komutların tanımı (x86, ARM)." },
  ],
  realLife: [
    "Bilgisayar kasasının içindeki anakarta bakınca CPU soketi, RAM slotları ve M.2 yuvası görülür.",
    "Telefon işlemcileri ARM mimarisi kullanır; bu yüzden masaüstü .exe dosyaları doğrudan çalışmaz.",
    "Oyun bilgisayarlarında ekran kartı PCIe x16 yuvasına takılır; çünkü yüksek veri hızı gerekir.",
  ],
  labTitle: "Etkileşimli Mimari Diyagramı ve Von Neumann Akışı",
  labDesc: "Diyagramdaki bileşenlere ve yollara tıkla, görevlerini öğren; sonra komut yürütme döngüsünü adım adım izle.",
  summary: [
    "Von Neumann mimarisinde komut ve veri aynı bellektedir; Harvard'da ayrıdır.",
    "Address Bus adresi, Data Bus veriyi, Control Bus kontrol sinyallerini taşır.",
    "Anakart tüm bileşenleri bağlar; chipset trafiği yönetir.",
    "32-bit 4 GiB'e kadar RAM adresler; 64-bit çok daha fazlasını. Performansı darboğazlar sınırlar.",
  ],
  quiz: [
    { q: "Veri yolunun (Data Bus) görevi nedir?", options: ["Adresi taşımak", "Asıl veriyi taşımak", "Sistemi soğutmak", "Güç sağlamak"], answer: 1, explain: "Data Bus bileşenler arasında gerçek veriyi taşır." },
    { q: "Von Neumann darboğazı neden oluşur?", options: ["CPU çok hızlı olduğu için", "Komut ve veri aynı yoldan getirildiği için", "RAM bulunmadığı için", "Anakart küçük olduğu için"], answer: 1, explain: "Tek ortak bellek yolunda komut ve veri aynı anda alınamaz." },
    { q: "Hangisi x64 mimarisiyle ilgilidir?", options: ["32 bitlik adreslemeyle sınırlıdır", "x86'nın 64-bit genişletmesidir", "Sadece telefonlarda kullanılır", "Depolama aygıtıdır"], answer: 1, explain: "x64 (AMD64), x86 komut setinin 64-bit sürümüdür." },
    { q: "Control Bus üzerinde hangisi taşınır?", options: ["Read/Write sinyalleri", "Fotoğraflar", "Kullanıcı şifreleri", "Dosya adları"], answer: 0, explain: "Control Bus okuma/yazma, saat ve kesme gibi sinyalleri taşır." },
    { q: "Anakartın chipset'i ne yapar?", options: ["Veriyi kalıcı saklar", "CPU ile çevre birimleri arasındaki trafiği yönetir", "Antivirüs çalıştırır", "Kaydedilmeyen belgeyi korur"], answer: 1, explain: "Chipset, çevre birimlerinin CPU ile iletişimini koordine eder." },
  ],
};
