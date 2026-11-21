import { q } from "../../helpers";
import type { Lesson } from "../../types";

export const lesson03: Lesson = {
  id: 3,
  title: "Siber Güvenlik Ekosistemi",
  subtitle: "Kim kimi korur, kim kime tehdit oluşturur, kim kiminle çalışır?",
  goal: "Siber güvenliğin tek bir kişinin ya da ürünün işi olmadığını; birbirine bağlı aktörlerden oluşan bir ekosistem olduğunu anlamak ve bu aktörlerin rollerini ayırt edebilmek.",
  outcomes: [
    "Ekosistemdeki ana aktörleri ve rollerini sıralayabilirsin.",
    "Aktörler arasındaki ilişkileri örneklerle açıklayabilirsin.",
    "Güvenlik ürünlerinin hangi ihtiyaca cevap verdiğini söyleyebilirsin.",
    "Tehdit aktörlerinin motivasyonlarını ayırt edebilirsin.",
  ],
  minutes: 30,
  topics: [
    {
      title: "Siber güvenlik ekosistemi nedir?",
      en: "Cybersecurity Ecosystem",
      simple:
        "Bir ormanda ağaçlar, hayvanlar ve toprak birbirine bağlıdır; birinde değişiklik olursa diğerleri etkilenir. Siber güvenlikte de kullanıcılar, şirketler, devlet kurumları, araştırmacılar, yazılımcılar, güvenlik firmaları ve saldırganlar birbirini etkileyen bir ağ oluşturur.",
      technical:
        "Ekosistem; güvenliği sağlayan, güvenliği tehdit eden ve güvenlik için araç sunan aktörlerin ilişkiler ağıdır. Bilgi bu ağda sürekli dolaşır: bir araştırmacı bir zafiyeti bulur, üretici yama yayınlar, güvenlik şirketi tespit imzası ekler, kurum güncellemeyi uygular ve kullanıcı korunur. Zincirin herhangi bir halkası aksarsa koruma zayıflar.",
      example:
        "Bir tarayıcıdaki açık bir araştırmacı tarafından bildirilir. Tarayıcı üreticisi yamayı yayınlar. Güvenlik firmaları açığı kullanan saldırıları izler. BT ekibi güncellemeyi dağıtır. Son kullanıcı yalnızca “tarayıcıyı yeniden başlat” uyarısını görür; arkada ise tüm ekosistem çalışmıştır.",
    },
    {
      title: "Bireyler, kurumlar ve devlet",
      en: "Individuals, Organizations and Government",
      simple:
        "Bireyler kendi cihaz ve hesaplarından sorumludur. Kurumlar çalışanlarının, müşterilerinin ve sistemlerinin güvenliğinden sorumludur. Devlet ise kuralları belirler, kritik altyapıyı korur ve olay anında koordinasyon sağlar.",
      technical:
        "Bireyler hem korunan hem de “en zayıf halka” olabilen taraftır; farkındalık ve basit önlemler (MFA, güncelleme) burada belirleyicidir. Kurumlar risk yönetimi, politika, teknik kontroller ve olay müdahale kapasitesi kurar. Devlet kurumları ise mevzuat (örneğin KVKK), ulusal siber olay müdahale merkezleri (Türkiye'de USOM), düzenleyici kurumlar (BTK gibi) ve kritik altyapı koruma politikalarıyla çerçeve oluşturur.",
      example:
        "Bir banka müşterisi şüpheli SMS'i bankaya bildirir. Banka sahte siteyi tespit edip kapattırmak için ulusal siber olay müdahale merkezine bildirimde bulunur. Merkez, sahte alan adının engellenmesini koordine eder. Üç farklı aktör tek bir olayda zincirleme çalışır.",
    },
    {
      title: "Araştırmacılar ve yazılım geliştiriciler",
      en: "Researchers and Developers",
      simple:
        "Güvenlik araştırmacıları, yazılımlardaki açıkları saldırganlardan önce bulup bildirmeye çalışır. Yazılım geliştiriciler ise kodu yazan kişilerdir; güvenlik hatalarının önemli bölümü kodlama aşamasında ortaya çıktığı için onların rolü çok kritiktir.",
      technical:
        "Araştırmacılar zafiyet analizi, tersine mühendislik (reverse engineering) ve tehdit analizi yapar; bulgularını “sorumlu ifşa” (responsible disclosure) süreciyle üreticiye iletirler. Geliştiriciler güvenli yazılım geliştirme yaşam döngüsü (Secure SDLC) uygular: girdi doğrulama, güvenli kütüphane seçimi, kod incelemesi ve güvenlik testleri. Bu iki grup arasındaki sağlıklı iletişim, zafiyetlerin hızla kapanmasını sağlar.",
      example:
        "Bir araştırmacı bir mobil uygulamada, başka kullanıcıların bilgilerini görmeye izin veren bir hata fark eder. Şirkete gizlice bildirir, geliştirici ekibi hatayı düzeltir ve düzeltme yayınlandıktan sonra araştırmacı bulgusunu kamuya açıklar. Kimse zarar görmeden sorun çözülür.",
    },
    {
      title: "Güvenlik şirketleri ve ürünleri",
      en: "Security Vendors and Technologies",
      simple:
        "Güvenlik şirketleri kurumların ve bireylerin ihtiyaç duyduğu araçları ve hizmetleri sunar: korunma yazılımları, izleme hizmetleri, danışmanlık ve eğitim gibi.",
      technical:
        "Başlıca güvenlik teknolojileri: Güvenlik duvarı (firewall) ağ trafiğini kurallara göre süzer. Antivirüs/EDR uç noktalarda zararlı davranışı tespit eder. SIEM farklı kaynaklardan logları toplayıp ilişkilendirir. IDS/IPS saldırı belirtilerini tespit eder veya engeller. Parola yöneticileri ve MFA kimlik güvenliğini artırır. Yedekleme çözümleri veri kaybından toparlanmayı sağlar. Bir ürün tek başına yeterli değildir; “derinlemesine savunma” (defense in depth) anlayışıyla katmanlar halinde kullanılır.",
      example:
        "Bir şirkette çalışan bilmeden zararlı bir ek dosyayı açar. E-posta filtresi bunu yakalayamaz; ancak uç nokta koruması (EDR) şüpheli davranışı tespit edip bilgisayarı ağdan izole eder. Birinci katman başarısız olsa da ikinci katman olayı sınırlar.",
    },
    {
      title: "Tehdit aktörleri",
      en: "Threat Actors",
      simple:
        "Tehdit aktörü, bir sisteme veya veriye zarar vermeye çalışan kişi ya da gruptur. Hepsi aynı değildir; kimi para ister, kimi bilgi ister, kimi sadece dikkat çekmek ister. Bazen de tehdit içeriden gelir.",
      technical:
        "Yaygın sınıflandırma: Siber suçlular (finansal kazanç), devlet destekli gruplar (casusluk, stratejik hedefler), hacktivistler (ideolojik amaç), içeriden tehditler (kasıtlı veya kazara) ve script kiddie olarak adlandırılan, hazır araçları az bilgiyle kullanan acemiler. Motivasyon, kaynak ve beceri düzeyi saldırının biçimini belirler. Savunmacı için önemli soru “kim saldırıyor?” kadar “neden ve nasıl?” olmalıdır.",
      example:
        "İşten ayrılmak üzere olan bir çalışan, müşteri listesini kişisel e-postasına gönderir. Ortada gelişmiş bir saldırı yoktur; ancak içeriden gelen yetkili erişim, bazen dışarıdaki saldırıdan daha zarar vericidir. Bu yüzden yetki yönetimi ve izleme önemlidir.",
    },
  ],
  examples: [
    {
      title: "Bir zafiyetin yolculuğu",
      text: "Bir araştırmacı yaygın kullanılan bir yazılımda açık bulur, üreticiye bildirir, üretici yama yayınlar, güvenlik firmaları saldırı belirtilerini ürünlerine ekler, kurumlar yamayı kurar. Eğer kurum yamayı geciktirirse saldırganlar yayınlanmış açığı hedef alır.",
      takeaway: "Ekosistem, en hızlı değil en zayıf halka kadar güçlüdür.",
    },
    {
      title: "Devlet kurumları ve olay koordinasyonu",
      text: "Birçok ülkede ulusal siber olay müdahale merkezleri bulunur. Zararlı alan adları, fidye yazılımı kampanyaları ve kritik altyapı tehditleri hakkında bu merkezler uyarı yayınlar ve kurumlar arası koordinasyonu sağlar.",
      takeaway: "Ulusal koordinasyon, tek tek kurumların görmediği büyük resmi görmeyi sağlar.",
    },
  ],
  concepts: [
    { term: "Ekosistem", en: "Ecosystem", definition: "Birbirini etkileyen aktörlerin ve süreçlerin oluşturduğu bütün." },
    { term: "Tehdit aktörü", en: "Threat actor", definition: "Bir sisteme veya veriye zarar verme niyeti ya da potansiyeli olan kişi veya grup." },
    { term: "Derinlemesine savunma", en: "Defense in depth", definition: "Tek bir önleme güvenmek yerine birden çok katmanlı savunma uygulama yaklaşımı." },
    { term: "Sorumlu ifşa", en: "Responsible disclosure", definition: "Bulunan bir zafiyetin, kamuya açıklanmadan önce üreticiye bildirilmesi süreci." },
    { term: "SIEM", en: "Security Information and Event Management", definition: "Farklı sistemlerin loglarını toplayıp ilişkilendirerek olay tespiti sağlayan platform." },
    { term: "İçeriden tehdit", en: "Insider threat", definition: "Kurum içinde yetkili erişime sahip birinin kasıtlı veya kazara oluşturduğu risk." },
  ],
  activity: {
    type: "ecosystem",
    title: "Ekosistem haritası",
    intro:
      "Haritadaki her aktöre tıkla. Görevlerini, sorumluluklarını ve diğer aktörlerle ilişkilerini incele. Seçili aktörün bağlantıları haritada vurgulanır. Tüm aktörleri inceleyerek uygulamayı tamamla.",
    center: "Dijital varlıklar ve veriler",
    actors: [
      {
        id: "individuals",
        name: "Bireysel kullanıcılar",
        en: "Individual users",
        short: "Bireyler",
        role: "Cihazlarını, hesaplarını ve kişisel verilerini kullanan ve koruyan son kullanıcılar.",
        responsibilities: [
          "Güçlü ve benzersiz parola kullanmak, MFA'yı etkinleştirmek",
          "Cihazlarını ve uygulamalarını güncel tutmak",
          "Şüpheli mesaj ve bağlantılara karşı dikkatli olmak",
          "Önemli verileri yedeklemek",
        ],
        relations: [
          { to: "orgs", text: "Verilerini kurumlara emanet eder; kurumların güvenliğine bağımlıdır." },
          { to: "threat", text: "Kimlik avı ve dolandırıcılıkta en sık hedef alınan gruptur." },
          { to: "products", text: "Antivirüs, parola yöneticisi ve MFA gibi araçlarla korunur." },
        ],
      },
      {
        id: "orgs",
        name: "Kurumlar ve şirketler",
        en: "Organizations",
        short: "Kurumlar",
        role: "Çalışan, müşteri ve iş verilerini yöneten; kendi sistemlerinin güvenliğinden sorumlu yapılar.",
        responsibilities: [
          "Risk yönetimi ve güvenlik politikası oluşturmak",
          "Yetki yönetimi, izleme ve olay müdahale planı kurmak",
          "Çalışan farkındalığı eğitimi vermek",
          "Yasal yükümlülüklere (ör. KVKK) uymak",
        ],
        relations: [
          { to: "individuals", text: "Müşteri ve çalışan verilerini koruma sorumluluğu taşır." },
          { to: "gov", text: "Düzenlemelere uyar, ciddi olayları ilgili kurumlara bildirir." },
          { to: "vendors", text: "Ürün, hizmet ve danışmanlık satın alır." },
          { to: "developers", text: "Kendi yazılımını geliştirir veya üçüncü taraf yazılım kullanır." },
        ],
      },
      {
        id: "gov",
        name: "Devlet kurumları",
        en: "Government agencies",
        short: "Devlet",
        role: "Mevzuatı oluşturan, kritik altyapıyı koruyan ve ulusal düzeyde olay müdahalesini koordine eden kurumlar.",
        responsibilities: [
          "Yasal ve düzenleyici çerçeveyi belirlemek",
          "Ulusal siber olay müdahale merkezlerini işletmek",
          "Kritik altyapıların güvenliğini denetlemek",
          "Kamu farkındalığı ve eğitim çalışmaları yürütmek",
        ],
        relations: [
          { to: "orgs", text: "Kurumlara yükümlülükler getirir ve denetler." },
          { to: "threat", text: "Siber suçlarla mücadele eder, saldırı kampanyalarını izler." },
          { to: "researchers", text: "Araştırmacılarla bilgi paylaşımı ve ortak çalışmalar yürütür." },
        ],
      },
      {
        id: "researchers",
        name: "Güvenlik araştırmacıları",
        en: "Security researchers",
        short: "Araştırmacılar",
        role: "Sistemlerdeki zafiyetleri ve tehdit davranışlarını inceleyip bulgularını paylaşan uzmanlar.",
        responsibilities: [
          "Zafiyet analizi ve zararlı yazılım incelemesi yapmak",
          "Bulguları sorumlu ifşa ile üreticiye bildirmek",
          "Bilgi ve teknik yazılar yayınlayarak toplulukla paylaşmak",
          "Yalnızca izinli alanlarda test yapmak",
        ],
        relations: [
          { to: "developers", text: "Bulduğu açıkları geliştiricilere bildirerek düzeltilmesine yardım eder." },
          { to: "vendors", text: "Güvenlik şirketlerinde çalışabilir veya onlara tehdit bilgisi sağlar." },
          { to: "threat", text: "Tehdit aktörlerinin yöntemlerini analiz ederek savunmayı geliştirir." },
        ],
      },
      {
        id: "developers",
        name: "Yazılım geliştiriciler",
        en: "Software developers",
        short: "Geliştiriciler",
        role: "Uygulama ve sistemleri yazan; güvenlik hatalarını en baştan önleme imkânı olan ekipler.",
        responsibilities: [
          "Güvenli kodlama yapmak, girdileri doğrulamak",
          "Kullanılan kütüphaneleri güncel ve güvenilir tutmak",
          "Bildirilen zafiyetleri hızla düzeltmek",
          "Gizli anahtar ve parolaları kodun içine gömmemek",
        ],
        relations: [
          { to: "researchers", text: "Bildirilen zafiyetleri alır ve düzeltir." },
          { to: "orgs", text: "Kurumların kullandığı yazılımları üretir; hataları tüm kullanıcıları etkiler." },
          { to: "threat", text: "Kodlardaki hatalar saldırganların ilk hedefleri arasındadır." },
        ],
      },
      {
        id: "vendors",
        name: "Siber güvenlik şirketleri",
        en: "Security vendors",
        short: "Güvenlik şirketleri",
        role: "Güvenlik ürünleri, izleme hizmetleri, danışmanlık ve tehdit istihbaratı sunan firmalar.",
        responsibilities: [
          "Koruma ve tespit ürünleri geliştirmek",
          "Yönetilen güvenlik hizmetleri (MDR, SOC hizmeti) sunmak",
          "Tehdit istihbaratı ve raporlar yayınlamak",
          "Danışmanlık, denetim ve sızma testi hizmeti vermek",
        ],
        relations: [
          { to: "orgs", text: "Kurumlara ürün ve hizmet sağlar." },
          { to: "products", text: "Güvenlik ürün ve teknolojilerini geliştirir." },
          { to: "researchers", text: "Araştırmacıları istihdam eder ve bulgularından ürünlerini besler." },
        ],
      },
      {
        id: "threat",
        name: "Tehdit aktörleri",
        en: "Threat actors",
        short: "Tehdit aktörleri",
        role: "Sistemlere veya verilere zarar vermek, onlardan çıkar sağlamak veya erişim kazanmak isteyen kişi ve gruplar.",
        responsibilities: [
          "Motivasyonları farklıdır: finansal kazanç, casusluk, ideoloji, intikam veya merak",
          "Hedefin en zayıf halkasını arar: insan, yazılım veya yapılandırma",
          "Savunmacılar ise bu aktörlerin yöntemlerini öğrenerek önlem alır",
          "Bu bir “görev” değil, ekosistemin karşı güç olarak gerçek bir parçasıdır",
        ],
        relations: [
          { to: "individuals", text: "Dolandırıcılık, kimlik avı ve hesap ele geçirme saldırılarıyla hedef alır." },
          { to: "orgs", text: "Fidye, veri hırsızlığı ve kesinti yaratma amacıyla saldırır." },
          { to: "developers", text: "Yazılımlardaki hataları ve bağımlılıkları istismar eder." },
        ],
      },
      {
        id: "products",
        name: "Güvenlik ürünleri ve teknolojileri",
        en: "Security products & technologies",
        short: "Ürünler",
        role: "Koruma, tespit ve toparlanma sağlayan araçlar: güvenlik duvarı, EDR, SIEM, MFA, yedekleme gibi.",
        responsibilities: [
          "Önleme: güvenlik duvarı, e-posta filtreleri, MFA",
          "Tespit: SIEM, EDR, IDS/IPS",
          "Müdahale ve toparlanma: izolasyon araçları, yedekleme çözümleri",
          "İnsan ve süreçle birlikte kullanıldığında etkilidir; tek başına yeterli değildir",
        ],
        relations: [
          { to: "vendors", text: "Güvenlik şirketleri tarafından üretilir ve desteklenir." },
          { to: "orgs", text: "Kurumlar bu araçları ağlarında ve uç noktalarında kullanır." },
          { to: "individuals", text: "Bireyler antivirüs ve parola yöneticisi gibi araçlardan yararlanır." },
        ],
      },
    ],
  },
  quiz: [
    q("l3q1", "Siber güvenlik ekosistemi nedir?", "Ekosistem düşüncesinin en önemli çıkarımı nedir?", [
      "Güvenliği yalnızca bir güvenlik ürünü sağlar",
      "Güvenlik tek bir kişinin sorumluluğundadır",
      "Aktörler birbirine bağlıdır; zincirdeki en zayıf halka tüm korumayı etkileyebilir",
      "Devlet kurumları olmadan güvenlik mümkün değildir",
    ], 2, "Bir zafiyetin bulunması, yamalanması, uygulanması ve izlenmesi farklı aktörlere dağılır. Halkalardan biri aksarsa koruma zayıflar."),
    q("l3q2", "Bireyler, kurumlar ve devlet", "Aşağıdakilerden hangisi devlet kurumlarının ekosistemdeki rolüne en uygun örnektir?", [
      "Kullanıcıya antivirüs yazılımı satmak",
      "Ulusal siber olay müdahale merkezi işletmek ve kritik altyapı güvenliğini düzenlemek",
      "Kurum içi parola politikasını belirlemek",
      "Mobil uygulama kodu yazmak",
    ], 1, "Ulusal koordinasyon, mevzuat ve kritik altyapı koruması devletin rollerindendir. Diğer seçenekler satıcı, kurum veya geliştirici görevleridir."),
    q("l3q3", "Araştırmacılar ve yazılım geliştiriciler", "Bir araştırmacı yaygın bir uygulamada zafiyet buldu. Ekosistem açısından en yapıcı yol hangisidir?", [
      "Açığı sosyal medyada hemen yayınlamak",
      "Açığı üreticiye bildirip düzeltme yayınlanmasını beklemek",
      "Açığı kullanıp başka kullanıcıların verisine bakarak kanıtlamak",
      "Açığı başkalarına satmak için gizli tutmak",
    ], 1, "Sorumlu ifşa, kullanıcıları riske atmadan açığın kapatılmasına imkân tanır. Diğer seçenekler kullanıcıları tehlikeye atar veya etik dışıdır."),
    q("l3q4", "Güvenlik şirketleri ve ürünleri", "Şirketin e-posta filtresi zararlı ekini yakalayamadı, ancak uç nokta koruması şüpheli davranışı fark edip bilgisayarı ağdan izole etti. Bu durum hangi yaklaşımı gösterir?", [
      "Derinlemesine savunma: birden çok katman olduğu için bir katmanın hatası tamamen felakete dönüşmez",
      "Güvenlik ürünlerinin gereksiz olduğunu",
      "E-posta filtrelerinin hiç gerekli olmadığını",
      "Tek bir ürünün her tehdidi önleyebileceğini",
    ], 0, "Katmanlı savunma, bir katman başarısız olduğunda diğerinin olayı sınırlamasını sağlar."),
    q("l3q5", "Tehdit aktörleri", "İşten ayrılmak üzere olan bir çalışanın müşteri listesini kişisel e-postasına göndermesi hangi tehdit türüne örnektir?", [
      "Hacktivist saldırısı",
      "Devlet destekli saldırı",
      "Script kiddie saldırısı",
      "İçeriden tehdit",
    ], 3, "Yetkili erişime sahip kişinin kasıtlı veya kazara oluşturduğu risk içeriden tehdittir. Yetki sınırlandırma ve izleme bu riski azaltır."),
  ],
  summary: [
    "Siber güvenlik, birbirine bağlı aktörlerden oluşan bir ekosistemdir.",
    "Bireyler, kurumlar ve devlet farklı sorumluluk düzeylerinde koruma sağlar.",
    "Araştırmacılar zafiyetleri bulur, geliştiriciler düzeltir; sorumlu ifşa bu iletişimin güvenli yoludur.",
    "Güvenlik ürünleri derinlemesine savunma anlayışıyla, katmanlar halinde kullanılır.",
    "Tehdit aktörlerinin motivasyonları farklıdır; savunma için “neden ve nasıl” sorularını anlamak gerekir.",
  ],
};
