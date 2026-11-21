import { q, type Lesson } from "../types";

const lesson: Lesson = {
  id: 1,
  title: "Programlama Nedir?",
  goal:
    "Programlamanın temel mantığını kavramak; program, yazılım, kaynak kod, derleyici (compiler) ve yorumlayıcı (interpreter) kavramlarını ayırt etmek ve programlamanın siber güvenlikteki yerini anlamak.",
  outcomes: [
    "Programlama kavramını ve bir programın girdi → işlem → çıktı yapısını açıklayabilir.",
    "Program ile yazılım arasındaki farkı söyleyebilir.",
    "Makine dili, assembly ve yüksek seviyeli dilleri karşılaştırabilir.",
    "Compiler ile Interpreter arasındaki çalışma farkını anlatabilir.",
    "Programlama ve otomasyonun siber güvenlikteki rolünü örneklerle açıklayabilir.",
  ],
  duration: "≈ 35 dakika",
  sections: [
    {
      title: "Programlama kavramı",
      paras: [
        "**Programlama (Programming)**, bir bilgisayara belirli bir görevi nasıl yapacağını adım adım anlatan, kesin ve belirsizlik içermeyen talimatlar yazma işidir. Bilgisayar kendi başına düşünmez; ona verilen talimatları çok hızlı ve hatasız biçimde uygular. Bu yüzden talimatların doğru, sıralı ve eksiksiz olması gerekir.",
        "Günlük hayattan bir benzetme yapalım: yemek tarifi. Tarif, malzemeleri (girdi), pişirme adımlarını (işlem) ve ortaya çıkan yemeği (çıktı) tanımlar. Program da aynı mantıkla çalışır: veri alır, işler ve sonuç üretir.",
        "Her program üç temel aşamaya indirgenebilir: **Girdi (Input)** – dışarıdan alınan veri; **İşlem (Process)** – verinin hesaplanması, karşılaştırılması, dönüştürülmesi; **Çıktı (Output)** – sonucun ekrana, dosyaya veya başka bir sisteme iletilmesi.",
      ],
    },
    {
      title: "Program ve yazılım arasındaki ilişki",
      paras: [
        "**Program**, belirli bir işi yapan tek bir talimat kümesidir (örneğin bir parola kontrol aracı). **Yazılım (Software)** ise daha geniş bir kavramdır: bir veya daha fazla programı, kütüphaneleri, yapılandırma dosyalarını, verileri ve belgeleri kapsayan bütündür.",
        "Donanım (hardware) bilgisayarın fiziksel parçalarıdır; yazılım ise donanıma ne yapacağını söyleyen mantıksal katmandır. İşletim sistemi, tarayıcı, mobil uygulama ve güvenlik duvarı birer yazılımdır; hepsinin içinde yüzlerce program ve modül çalışır.",
      ],
      bullets: [
        "Sistem yazılımı: işletim sistemi, sürücüler.",
        "Uygulama yazılımı: tarayıcı, ofis uygulamaları, oyunlar.",
        "Ara yazılım ve araçlar: veritabanı sunucuları, derleyiciler, güvenlik tarayıcıları.",
      ],
    },
    {
      title: "Programlama dilleri: makine dilinden yüksek seviyeli dillere",
      paras: [
        "İşlemci yalnızca **makine dilini (machine language)** anlar: 0 ve 1'lerden oluşan komutlar. İnsanların bu dilde program yazması çok zordur ve hataya açıktır. Bu nedenle zamanla insana daha yakın diller geliştirilmiştir.",
        "**Assembly**, makine komutlarına anlamlı kısaltmalar (örneğin `MOV`, `ADD`) veren düşük seviyeli bir dildir. Donanıma çok yakındır ve zararlı yazılım analizi (reverse engineering) gibi alanlarda hâlâ önemlidir. **Yüksek seviyeli diller (high-level languages)** – Python, Java, C#, JavaScript – ise insan diline yakındır; bellek yönetimi ve donanım ayrıntılarını büyük ölçüde sizden saklar.",
        "Yüksek seviyeli dil seçimi amaca göre değişir. Siber güvenlikte Python hızlı araç yazmak için, Bash ve PowerShell sistem otomasyonu için, C/C++ ve Assembly ise düşük seviyeli analiz için sık kullanılır.",
      ],
    },
    {
      title: "Compiler ve Interpreter kavramları",
      paras: [
        "Bilgisayar insanın yazdığı kodu doğrudan çalıştıramaz; çevrilmesi gerekir. Bu çeviriyi iki ana yöntemle yapabiliriz.",
        "**Derleyici (Compiler)**, tüm kaynak kodu önce makine koduna çevirir ve çalıştırılabilir bir dosya üretir (örneğin C, C++, Go). Program çalışırken çeviriye gerek kalmaz; genellikle daha hızlıdır. **Yorumlayıcı (Interpreter)** ise kodu satır satır okuyup anında çalıştırır (örneğin Python, Bash, PowerShell). Geliştirme ve deneme daha hızlıdır; hata ilgili satıra gelindiğinde ortaya çıkar.",
        "Gerçekte pek çok dil karma çalışır: Python önce kodu bayt koduna (bytecode) çevirir, sonra sanal makine bunu yorumlar. Önemli olan ayrımın temel mantığını bilmektir.",
      ],
      bullets: [
        "Compiler: önce hepsini çevir, sonra çalıştır → ayrı bir çalıştırılabilir dosya üretir.",
        "Interpreter: oku, çevir, çalıştır → kaynak kod doğrudan yorumlanır.",
      ],
    },
    {
      title: "Kaynak kod (Source Code)",
      paras: [
        "**Kaynak kod**, programcının yazdığı insan tarafından okunabilir metindir. Bir metin düzenleyicide veya kod editöründe yazılır ve genellikle `.py`, `.sh`, `.ps1`, `.c` gibi uzantılarla saklanır.",
        "İyi kaynak kod yalnızca çalışmakla kalmaz, okunabilir da olur: anlamlı değişken adları, kısa fonksiyonlar ve açıklama satırları (yorum / comment) kullanılır. Kaynak kod ayrıca bir güvenlik varlığıdır: içine yanlışlıkla yazılan parolalar ve API anahtarları sızıntılara yol açabilir.",
      ],
    },
    {
      title: "Programlama ve siber güvenlik ilişkisi",
      paras: [
        "Siber güvenlik uzmanı olmak için yazılım geliştirici olmak gerekmez; ancak kodu okuyabilmek ve küçük araçlar yazabilmek büyük avantaj sağlar. Zafiyetlerin çoğu yazılım hatalarından kaynaklanır; bu hataları anlamak için kodun nasıl çalıştığını bilmek gerekir.",
      ],
      bullets: [
        "Savunma (Blue Team): log analizi, olay müdahalesi otomasyonu, tespit kuralları.",
        "Saldırı simülasyonu (Red Team / Pentest): yetkili testlerde araç ve betik geliştirme.",
        "Güvenli yazılım geliştirme: girdi doğrulama, hata yönetimi, gizli bilgi yönetimi.",
        "Zararlı yazılım analizi: kodun ne yaptığını anlama.",
      ],
    },
    {
      title: "Otomasyonun siber güvenlikteki önemi",
      paras: [
        "Güvenlik ekipleri her gün binlerce log satırı, yüzlerce uyarı ve düzinelerce sistem ile uğraşır. Bu işleri elle yapmak yavaş, yorucu ve hataya açıktır. **Otomasyon (Automation)**, tekrarlayan görevlerin betiklerle (script) kendiliğinden yapılmasıdır.",
        "Örneğin bir betik her sabah sunucu loglarını tarayıp başarısız giriş denemelerini sayabilir, eşik aşılırsa uyarı üretebilir. Otomasyon insanın yerini almaz; insanı tekrarlayan işten kurtarıp analiz ve karar vermeye odaklar.",
      ],
    },
  ],
  terms: [
    { tr: "Program", en: "Program", desc: "Belirli bir görevi yerine getiren talimatlar kümesi." },
    { tr: "Yazılım", en: "Software", desc: "Program, kütüphane, veri ve yapılandırmaların oluşturduğu bütün." },
    { tr: "Kaynak kod", en: "Source Code", desc: "Programcının yazdığı, insan tarafından okunabilir kod metni." },
    { tr: "Derleyici", en: "Compiler", desc: "Tüm kaynak kodu önceden makine koduna çeviren araç." },
    { tr: "Yorumlayıcı", en: "Interpreter", desc: "Kaynak kodu satır satır okuyup çalıştıran araç." },
    { tr: "Makine dili", en: "Machine Language", desc: "İşlemcinin doğrudan anladığı ikili (0/1) komutlar." },
    { tr: "Betik", en: "Script", desc: "Genellikle yorumlayıcı ile çalışan, bir işi otomatikleştiren kısa program." },
    { tr: "Otomasyon", en: "Automation", desc: "Tekrarlayan işlerin insan müdahalesi olmadan yapılması." },
  ],
  examples: [
    {
      title: "Asansör",
      text: "Asansörün kat düğmesine bastığınızda ne olacağı bir programla belirlenir: girdi (düğme), işlem (hangi kata, hangi yöne gideceği), çıktı (motorun çalışması).",
    },
    {
      title: "Banka uygulaması",
      text: "Mobil bankacılıkta parola yanlış girildiğinde sayacın artması ve 5. denemede hesabın kilitlenmesi, programlanmış bir kuraldır. Bu kuralı yazan kişi aynı zamanda bir güvenlik kontrolü uygulamış olur.",
    },
    {
      title: "SOC analistinin sabah raporu",
      text: "Bir güvenlik operasyon merkezinde (SOC) analist her sabah onlarca log kaynağına bakmak yerine, logları toplayıp özet rapor çıkaran bir betik çalıştırır.",
    },
  ],
  code: [
    {
      title: "Girdi → İşlem → Çıktı (Python)",
      lang: "python",
      code: `isim = input("Adınız: ")          # Girdi
mesaj = "Merhaba, " + isim + "!"  # İşlem
print(mesaj)                      # Çıktı`,
      note: "Üç satır, bir programın üç temel aşamasını gösterir. `#` işaretinden sonrası yorum satırıdır; bilgisayar tarafından çalıştırılmaz.",
    },
    {
      title: "Basit otomasyon fikri (sözde kod)",
      lang: "text",
      code: `HER sabah 09:00'da:
    log_dosyasını AÇ
    HER satır İÇİN:
        EĞER satır "FAILED LOGIN" içeriyorsa:
            sayaç = sayaç + 1
    EĞER sayaç > 20 İSE:
        analiste UYARI gönder`,
      note: "Sözde kod (pseudocode) bir programlama dili değildir; fikri dilden bağımsız anlatmanın yoludur. Bir sonraki derste ayrıntılı işlenecek.",
    },
  ],
  scenario: {
    title: "Uygulama senaryosu: Kulüp giriş kapısı",
    text: "Bir okul bilişim kulübü, kapıdaki kart okuyucu için basit bir program tasarlamak istiyor. Kart numarası okunduğunda sistem numarayı izinli listeyle karşılaştıracak ve kapıyı açacak ya da reddedecek.",
    tasks: [
      "Programın girdisini, işlemini ve çıktısını belirleyin.",
      "Bu programda hangi veri gizli tutulmalıdır? (İzinli kart listesi kaynak kodun içine yazılmalı mı?)",
      "Bu iş compiler ile mi yoksa interpreter ile mi daha hızlı denenebilir? Neden?",
      "Laboratuvardaki “Parola uzunluğu kontrolü” programını adım adım çalıştırarak girdi-işlem-çıktı akışını gözlemleyin.",
    ],
  },
  summary: [
    "Programlama, bilgisayara kesin ve sıralı talimatlar verme işidir.",
    "Her program girdi, işlem ve çıktı aşamalarından oluşur.",
    "Yazılım; programları, verileri ve yapılandırmaları kapsayan daha geniş bir kavramdır.",
    "Compiler kodu önceden çevirir, interpreter satır satır çalıştırır.",
    "Programlama ve otomasyon, siber güvenlikte analiz hızını ve doğruluğunu artırır.",
  ],
  quiz: [
    q(
      "Bir programın temel yapısını en doğru şekilde hangisi ifade eder?",
      ["Donanım → Yazılım → Kullanıcı", "Girdi → İşlem → Çıktı", "Derleme → Bağlama → Silme", "Kaynak kod → Parola → Log"],
      1,
      "Her program veri alır (girdi), bu veriyi işler (işlem) ve sonucu iletir (çıktı).",
    ),
    q(
      "Aşağıdakilerden hangisi interpreter (yorumlayıcı) ile çalışan bir dil/ortam olarak en tipiktir?",
      ["Python", "Assembly makine kodu dosyası (.exe)", "Derlenmiş C programı", "Sadece 0 ve 1'lerden oluşan dosya"],
      0,
      "Python kaynak kodu yorumlayıcı tarafından çalıştırılır. Derlenmiş .exe dosyaları ise hazır makine kodu içerir.",
    ),
    q(
      "Bir güvenlik analisti her gün aynı 5 log dosyasını elle açıp aynı kelimeleri arıyor. En uygun yaklaşım hangisidir?",
      [
        "İşi hızlı yapmak için kontrolü atlamak",
        "Aramayı yapan ve sonucu raporlayan bir betik (script) yazmak",
        "Logları silmek",
        "Her gün farklı bir araç öğrenmek",
      ],
      1,
      "Tekrarlayan işler otomasyonun en uygun kullanım alanıdır; betik hem hızlı hem tutarlı sonuç verir.",
    ),
    q(
      "Kaynak koda yanlışlıkla bir API anahtarı yazılıp kod herkese açık bir depoya yüklenirse ne olur?",
      [
        "Hiçbir risk oluşmaz, çünkü kod derlenir",
        "Anahtar ele geçirilebilir ve yetkisiz erişime yol açabilir",
        "Program otomatik olarak daha hızlı çalışır",
        "Anahtar kendiliğinden geçersiz olur",
      ],
      1,
      "Kaynak kod okunabilir metindir; içindeki gizli bilgiler herkes tarafından görülebilir. Gizli bilgiler koddan ayrı saklanmalıdır.",
    ),
    q(
      "“Program” ve “yazılım” arasındaki ilişki için hangisi doğrudur?",
      [
        "Yazılım yalnızca tek bir satır koddur",
        "Program, yazılımın içindeki donanım parçasıdır",
        "Yazılım; programları, verileri ve yapılandırmaları içeren daha geniş bir bütündür",
        "İkisi arasında hiçbir ilişki yoktur",
      ],
      2,
      "Bir yazılım genellikle birden fazla program, kütüphane ve veri dosyasından oluşur.",
    ),
  ],
};

export default lesson;
