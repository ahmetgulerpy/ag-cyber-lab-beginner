import type { Lesson } from "../../types";

export const l01: Lesson = {
  id: 1,
  title: "Bilgisayar Nasıl Çalışır?",
  en: "How Does a Computer Work?",
  minutes: 35,
  goal: "Bilgisayarın girdi alan, işleyen, sonuç üreten ve veriyi saklayan bir sistem olduğunu kavramak; bir tuşa basıldığında ekranda harfin belirmesine kadar geçen süreci açıklayabilmek.",
  learn: [
    "Bilgisayarın ne olduğunu ve temel çalışma mantığını (IPO + Storage)",
    "Input, Processing, Output ve Storage kavramlarını",
    "Kullanıcı ile bilgisayar arasındaki etkileşimin nasıl gerçekleştiğini",
    "Donanım ve yazılımın birlikte çalışmasını",
    "Bir klavye girdisinin ekrana ulaşana kadar geçtiği adımları",
  ],
  concepts: [
    {
      title: "Bilgisayar nedir?",
      en: "What is a computer?",
      simple:
        "Bilgisayar, kendisine verilen talimatlara göre veriyi alan, işleyen, sonucu gösteren ve gerektiğinde saklayan elektronik bir makinedir. Çok hızlı çalışan ama kendi başına 'düşünmeyen' bir yardımcı gibi düşünebilirsin: ona ne yapacağı net şekilde söylenmelidir.",
      technical:
        "Bilgisayar, programlanabilir bir elektronik cihazdır. Yazılım (program) tarafından verilen komutları (instruction) işlemci (CPU) aracılığıyla yürütür. Bütün veriyi ve komutları, elektrik sinyallerinin iki durumunu (var/yok) temsil eden 0 ve 1'ler (bit) ile ifade eder. Akıllı telefonlar, oyun konsolları, ATM'ler ve akıllı TV'ler de aslında birer bilgisayardır.",
      example:
        "Hesap makinesi yalnızca sayıları işleyebilir ve tek bir iş yapar. Bilgisayar ise farklı programlar yüklenerek hesap makinesi, müzik çalar, belge yazıcı veya oyun makinesi olabilir. Bu esneklik 'programlanabilirlik' sayesindedir.",
      check: {
        q: "Aşağıdakilerden hangisi bilgisayarı basit bir hesap makinesinden ayıran temel özelliktir?",
        options: ["Ekranının büyük olması", "Farklı programlar çalıştırılarak farklı işler yapabilmesi", "Elektrikle çalışması", "Klavyesinin bulunması"],
        answer: 1,
        explain: "Bilgisayarın gücü programlanabilir olmasından gelir: aynı donanım, yüklenen yazılıma göre farklı görevleri yerine getirir.",
      },
    },
    {
      title: "Input (Girdi) ve Processing (İşleme)",
      en: "Input and Processing",
      simple:
        "Girdi, bilgisayara dışarıdan verdiğin her şeydir: bir tuşa basmak, fareyi hareket ettirmek, mikrofona konuşmak. İşleme ise bilgisayarın bu girdiyle ne yapılacağına karar verip hesaplamayı yapmasıdır.",
      technical:
        "Girdi aygıtları (klavye, fare, mikrofon, kamera, dokunmatik ekran) fiziksel eylemi elektrik sinyaline, sonra dijital veriye (0 ve 1) çevirir. İşleme aşamasını CPU (Central Processing Unit) yürütür: komutu belleğden alır (fetch), çözer (decode) ve yürütür (execute). İşlem sırasında geçici veriler RAM'de tutulur.",
      example:
        "ATM'de PIN girmek bir girdidir. ATM'nin bu PIN'i kayıtlı bilgiyle karşılaştırması işlemedir. 'Şifre doğru' ya da 'yanlış' kararı bu işlemenin sonucudur.",
      check: {
        q: "Bir oyunda fareyi sola kaydırdığında karakterin sola dönmesi sürecinde 'işleme' aşaması hangisidir?",
        options: ["Farenin elinde hareket etmesi", "CPU'nun fare hareketini hesaplayıp karakterin yeni konumunu belirlemesi", "Ekranda görüntünün belirmesi", "Oyunun diske kaydedilmesi"],
        answer: 1,
        explain: "Fare hareketi girdi, ekrandaki görüntü çıktıdır. Arada hareketin ne anlama geldiğini hesaplayan CPU'nun yaptığı iş işlemedir.",
      },
    },
    {
      title: "Output (Çıktı) ve Storage (Depolama)",
      en: "Output and Storage",
      simple:
        "Çıktı, bilgisayarın sonucu sana göstermesi veya duyurmasıdır: ekran, hoparlör, yazıcı. Depolama ise bilgilerin bilgisayar kapansa bile kaybolmayacak şekilde saklandığı yerdir: SSD, HDD, USB bellek.",
      technical:
        "Çıktı aygıtları dijital veriyi insanın algılayabileceği biçime (görüntü, ses, kâğıt) dönüştürür. Depolama kalıcıdır (non-volatile); veri elektrik kesilse de durur. RAM ise geçici (volatile) bellektir ve çalışma sırasındaki veriyi hızlıca sunar. Bu yüzden bir belgeyi 'Kaydet' demezsen sadece RAM'dedir ve elektrik kesilince kaybolur.",
      example:
        "Fotoğraf çektiğinde görüntü önce işlenir, ekranda (çıktı) görünür, 'Kaydet' dediğinde telefonun depolama alanına yazılır (storage). Telefonu kapatıp açsan da fotoğraf yerinde durur.",
      check: {
        q: "Kaydetmediğin bir belge elektrik kesilince neden kaybolur?",
        options: ["Ekran kapandığı için", "Belge yalnızca geçici bellek olan RAM'de bulunduğu için", "CPU bozulduğu için", "Klavye bağlantısı kesildiği için"],
        answer: 1,
        explain: "RAM geçici bir bellektir; elektrik kesilince içeriği silinir. Kalıcı olması için veri depolama aygıtına yazılmalıdır.",
      },
    },
    {
      title: "Kullanıcı etkileşimi ve donanım–yazılım birlikteliği",
      en: "User interaction & hardware–software cooperation",
      simple:
        "Donanım dokunabildiğin parçalar, yazılım ise bu parçalara ne yapacaklarını söyleyen programlardır. Biri olmadan diğeri işe yaramaz: yazılımsız donanım çalışmayan bir makine, donanımsız yazılım ise çalışacağı yer olmayan bir fikirdir.",
      technical:
        "Kullanıcı arayüzü (UI) yazılımı, kullanıcının girdisini yorumlar ve işletim sistemine iletir. İşletim sistemi (OS) kaynakları (CPU, RAM, disk) yönetir ve sürücüler (driver) aracılığıyla donanımla konuşur. Bu katmanlı yapı sayesinde uygulama geliştiriciler her klavye modelini ayrı ayrı bilmek zorunda kalmaz.",
      example:
        "Müzik uygulamasında 'Oynat' butonuna dokunursun (kullanıcı etkileşimi). Uygulama (yazılım) işletim sistemine ses çalma isteği gönderir; işletim sistemi sürücü aracılığıyla hoparlörü (donanım) çalıştırır.",
      code: "Kullanıcı → Uygulama → İşletim Sistemi → Sürücü → Donanım\n  tıklama    istek       kaynak yönetimi     çeviri     fiziksel iş",
      check: {
        q: "Aşağıdakilerden hangisi katmanlı yapının doğru sıralamasıdır?",
        options: ["Donanım → Kullanıcı → Sürücü", "Kullanıcı → Uygulama → İşletim Sistemi → Sürücü → Donanım", "Uygulama → Donanım → İşletim Sistemi", "Sürücü → Kullanıcı → Uygulama"],
        answer: 1,
        explain: "İstek yukarıdan aşağıya iner: kullanıcının eylemi uygulamaya, uygulamadan işletim sistemine, oradan sürücü aracılığıyla donanıma ulaşır.",
      },
    },
    {
      title: "Bir tuşa bastığında neler olur?",
      en: "From keystroke to screen",
      simple:
        "Klavyede 'A' tuşuna bastığın an saniyenin çok küçük bir parçasında onlarca işlem gerçekleşir ve ekranda 'A' harfi belirir. Aşağıdaki uygulamada bu adımları sen sıralayacaksın.",
      technical:
        "Tuşa basılınca klavye denetleyicisi (keyboard controller) bir tarama kodu (scan code) üretir. Bu kod USB/Bluetooth ile bilgisayara iletilir, kesme (interrupt) ile CPU'nun dikkati çekilir, sürücü kodu çevirir, işletim sistemi aktif uygulamaya haber verir, uygulama harfi RAM'de belgeye ekler ve ekran kartı (GPU) yeni görüntüyü ekrana gönderir.",
      example:
        "Not defterinde 'merhaba' yazarken her harf bu zinciri yeniden yaşar. Bilgisayarın hızlı olması, bu zincirin milisaniyeler içinde tamamlanmasından kaynaklanır.",
      check: {
        q: "Klavyeden gelen sinyalin CPU'nun dikkatini çekmesini sağlayan mekanizmanın adı nedir?",
        options: ["Interrupt (Kesme)", "Format", "Download", "Compile"],
        answer: 0,
        explain: "Interrupt (kesme), donanımın CPU'ya 'bana bir iş geldi, ilgilen' demesini sağlayan mekanizmadır.",
      },
    },
  ],
  terms: [
    { tr: "Girdi", en: "Input", def: "Bilgisayara verilen veri veya komut." },
    { tr: "İşleme", en: "Processing", def: "Verinin CPU tarafından komutlara göre hesaplanması." },
    { tr: "Çıktı", en: "Output", def: "İşlenen verinin kullanıcıya sunulması." },
    { tr: "Depolama", en: "Storage", def: "Verinin kalıcı olarak saklanması." },
    { tr: "Kesme", en: "Interrupt", def: "Donanımın CPU'dan ilgi talep etmesini sağlayan sinyal." },
    { tr: "Sürücü", en: "Driver", def: "İşletim sistemi ile donanım arasında çeviri yapan yazılım." },
  ],
  realLife: [
    "ATM: Kart ve PIN girdisi → banka sistemiyle kontrol (işleme) → para ve ekran mesajı (çıktı) → işlem kaydı (depolama).",
    "Akıllı telefon: Dokunma (girdi) → uygulama çalışması (işleme) → ekran görüntüsü (çıktı) → fotoğraf galerisi (depolama).",
    "Market kasası: Barkod okuyucu (girdi) → fiyat sorgusu (işleme) → fiş ve ekran (çıktı) → satış kayıtları (depolama).",
  ],
  labTitle: "Bilgisayar Çalışma Şeması ve Tuş → Ekran Sıralaması",
  labDesc: "Etkileşimli şemada dört bölümü incele, ardından klavye girdisinin ekrana ulaşma adımlarını doğru sırala.",
  summary: [
    "Bilgisayar; girdi (input) alır, işler (processing), çıktı (output) üretir ve veriyi saklar (storage).",
    "RAM geçici, depolama aygıtları (SSD/HDD) kalıcıdır.",
    "Donanım ve yazılım birbirini tamamlar; işletim sistemi ve sürücüler aradaki köprüdür.",
    "Bir tuş vuruşu bile tarama kodu, kesme, sürücü, işletim sistemi, uygulama ve ekran kartı zincirinden geçer.",
  ],
  quiz: [
    { q: "Aşağıdakilerden hangisi bir girdi (input) aygıtıdır?", options: ["Hoparlör", "Mikrofon", "Yazıcı", "Monitör"], answer: 1, explain: "Mikrofon sesi alıp dijital veriye çevirir; bu yüzden girdi aygıtıdır. Diğerleri çıktı aygıtlarıdır." },
    { q: "Bilgisayarın verileri hesaplayıp karar verdiği bileşen hangisidir?", options: ["Klavye", "CPU", "Monitör", "USB bellek"], answer: 1, explain: "CPU (işlemci) komutları yürütür; bilgisayarın işleme merkezidir." },
    { q: "Kullanıcı 'Kaydet' butonuna bastığında veri nereye yazılır?", options: ["Depolama aygıtına (SSD/HDD)", "Klavyeye", "Ekran kartına", "Hoparlöre"], answer: 0, explain: "Kaydetme işlemi geçici RAM'deki veriyi kalıcı depolama aygıtına yazar." },
    { q: "İşletim sistemi ile donanım arasında çeviri yapan yazılım hangisidir?", options: ["Tarayıcı", "Oyun", "Sürücü (Driver)", "Antivirüs"], answer: 2, explain: "Sürücü, işletim sisteminin donanımla anlaşabilmesi için gereken özel yazılımdır." },
    { q: "Bir yazıcıdan belge çıkması hangi aşamadır?", options: ["Input", "Processing", "Storage", "Output"], answer: 3, explain: "Yazıcı, işlenen veriyi kâğıda dökerek kullanıcıya sunar; bu bir çıktıdır." },
  ],
};
