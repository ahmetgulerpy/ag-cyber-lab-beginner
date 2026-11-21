import { q } from "../../helpers";
import type { Lesson } from "../../types";

export const lesson02: Lesson = {
  id: 2,
  title: "Siber Güvenliğin Tarihçesi",
  subtitle: "Deneysel programlardan küresel tehditlere uzanan yol",
  goal: "Siber güvenliğin neden ortaya çıktığını, tehditlerin zaman içinde nasıl değiştiğini ve bugünkü savunma yaklaşımlarının hangi olaylardan öğrenilerek şekillendiğini kavramak.",
  outcomes: [
    "Önemli tarihsel siber olayları sıralayabilirsin.",
    "Virüs, solucan ve fidye yazılımı arasındaki farkı açıklayabilirsin.",
    "Her büyük olayın güvenlik anlayışını nasıl değiştirdiğini anlatabilirsin.",
    "Modern tehditlerin tarihsel köklerini görebilirsin.",
  ],
  minutes: 30,
  topics: [
    {
      title: "Bilgisayar güvenliğinin ortaya çıkışı",
      en: "Early Computer Security",
      simple:
        "İlk bilgisayarlar çok pahalıydı, odalar dolusu yer kaplıyordu ve çok az kişi kullanıyordu. O dönemde güvenlik daha çok fiziksel kilitlerle, yani odaya kimin gireceğiyle ilgiliydi. Bilgisayarlar birden fazla kullanıcı tarafından aynı anda kullanılmaya başlayınca yeni bir soru doğdu: Bir kullanıcı diğerinin verisini görebilir mi?",
      technical:
        "1960'larda çok kullanıcılı (time-sharing) sistemlerin yaygınlaşmasıyla erişim kontrolü, kullanıcı ayrımı ve parola gibi kavramlar ortaya çıktı. 1972 tarihli Anderson raporu gibi çalışmalar, bilgisayar sistemlerinde güvenlik gereksinimlerini ilk kez sistematik olarak ele alan öncü belgeler arasındadır ve “referans monitörü” gibi fikirleri tartıştı.",
      example:
        "Bir üniversite bilgisayarını yüz öğrencinin paylaştığını düşün. Biri başkasının ödevini okuyabiliyorsa sorun “kötü bir hacker” değil, sistemin kullanıcıları birbirinden yeterince ayırmamasıdır. Modern işletim sistemlerindeki kullanıcı hesapları ve dosya izinleri bu ihtiyaçtan doğdu.",
    },
    {
      title: "İlk bilgisayar ağları ve ilk solucanlar",
      en: "Early Networks and Worms",
      simple:
        "Bilgisayarlar birbirine bağlanınca bilgi paylaşmak kolaylaştı; ama bir sorun da kolayca paylaşılır hale geldi. Solucan (worm), insanın hiçbir şey yapmasına gerek kalmadan kendi kendine ağ üzerinden bir bilgisayardan diğerine yayılan programdır.",
      technical:
        "ARPANET (internetin öncülü) 1969'da çalışmaya başladı. 1971'de Creeper adlı deneysel program ağdaki bilgisayarlar arasında kendini kopyalayarak ilerledi ve “I'M THE CREEPER: CATCH ME IF YOU CAN” mesajını gösterdi; zarar vermiyordu. Onu temizlemek için yazılan Reaper programı ise tarihin ilk “antivirüs” benzeri çalışması olarak anılır. 1988'deki Morris Solucanı ise gerçek bir kırılma noktasıydı: bir hatası nedeniyle sistemleri yavaşlatıp çalışamaz hale getirdi.",
      example:
        "Morris Solucanı, internete bağlı bilgisayarların önemli bir kısmını etkiledi. Üniversiteler ve araştırma kurumları saatlerce iletişim kuramadı. Olay sonrası, acil durumlarda koordinasyonu sağlayacak ilk CERT (Computer Emergency Response Team) merkezi kuruldu. Bugün ülkelerin kendi USOM/CERT benzeri yapıları olmasının kökü bu olaya uzanır.",
      terminal: {
        title: "Kavramsal örnek: Solucan nasıl yayılır?",
        lines: [
          "# Basitleştirilmiş mantık (gerçek bir kod değildir)",
          "1. Bilgisayar A enfekte olur",
          "2. A, ağdaki diğer bilgisayarları tarar ve açık bir servis arar",
          "3. Güvenlik açığı olan Bilgisayar B bulunur",
          "4. Solucan B'ye kopyalanır ve B de aynı adımları tekrarlar",
          "=> İnsan müdahalesi olmadan üstel (exponential) yayılma",
        ],
      },
    },
    {
      title: "İnternetin yaygınlaşması",
      en: "The Rise of the Internet",
      simple:
        "1990'lara gelindiğinde internet, üniversitelerden evlere ve iş yerlerine ulaştı. Artık milyonlarca sıradan insan e-posta kullanıyordu. Saldırganlar için de çok daha fazla kullanıcı, çok daha fazla fırsat demekti.",
      technical:
        "E-posta ekleri ve ofis belgelerindeki makrolar, 1999 Melissa ve 2000 ILOVEYOU gibi olaylarda yayılma aracına dönüştü. Bu dönemde sosyal mühendislik (social engineering) etkili hale geldi: teknik bir açık yerine insanın merakı veya güveni kullanıldı. Aynı dönemde web siteleri, çevrim içi alışveriş ve bankacılık da yaygınlaştı; böylece saldırıların parasal motivasyonu arttı.",
      example:
        "ILOVEYOU mesajı “seni seviyorum” başlıklı bir e-posta ekiyle geliyordu. Birçok kişi merak ederek eki açtı ve program, kişinin adres defterindeki herkese kendini gönderdi. Saldırı teknik bir zafiyetten çok, insan psikolojisinden faydalandı.",
    },
    {
      title: "Virüslerden modern zararlı yazılımlara geçiş",
      en: "From Viruses to Modern Malware",
      simple:
        "İlk zararlı yazılımların çoğu şaka, merak veya kendini gösterme isteğiyle yazılıyordu. Zamanla amaç değişti: artık para kazanmak, bilgi çalmak veya bir kurumu felç etmek hedefleniyor. Zararlı yazılımlar da buna göre profesyonelleşti.",
      technical:
        "Zararlı yazılım (malware) çatı terimdir. Virüs, bir dosyaya bulaşıp kullanıcı etkileşimiyle yayılır; solucan kendi kendine ağda yayılır; truva atı (trojan) faydalı görünüp gizli işlev taşır; fidye yazılımı (ransomware) verileri şifreleyip erişim karşılığında para ister; casus yazılım (spyware) bilgi toplar. 1989'daki “AIDS Trojan” disketle dağıtılan ve fidye isteyen ilk bilinen örneklerdendir. Bugün fidye yazılımı, hizmet olarak satılan (Ransomware-as-a-Service) bir iş modeline dönüşmüştür.",
      example:
        "Önceki yıllarda bir virüs bilgisayarın açılışını bozup “ben buradaydım” mesajı gösterebilirdi. Bugün aynı bilgisayara sessizce yerleşen bir yazılım aylarca parola toplayıp sonra şirketin tüm dosyalarını şifreleyerek fidye talep edebilir. Amaç gösteriden kazanca dönüştü.",
    },
    {
      title: "Güvenlik sektörünün gelişimi",
      en: "Evolution of the Security Industry",
      simple:
        "Tehditler arttıkça onlara karşı koruma sağlayan bir sektör doğdu. İlk başta tek bir araç yeterliydi; zamanla birçok katmanlı bir savunma gerekti.",
      technical:
        "1980'lerin sonu ve 1990'larda ticari antivirüs ürünleri ve güvenlik duvarları (firewall) yaygınlaştı. 2000'lerde saldırı tespit sistemleri (IDS/IPS), güvenlik açığı tarayıcıları ve güvenlik bilgi/olay yönetimi (SIEM) araçları ortaya çıktı. Bugün ise uç nokta tespit ve müdahale (EDR), güvenlik operasyon merkezleri (SOC), tehdit istihbaratı (threat intelligence) ve “sıfır güven” (zero trust) yaklaşımı sektörün parçasıdır. Ayrıca zafiyetler CVE gibi ortak numaralandırma sistemleriyle takip edilir.",
      example:
        "Bir şirket eskiden sadece ofis ağının kapısına bir güvenlik duvarı koyardı. Bugün çalışanlar evden bağlanıyor, veriler bulutta duruyor; bu yüzden şirket sadece kapıyı değil, her cihazı, her hesabı ve her bağlantıyı izlemek zorunda.",
    },
    {
      title: "Modern siber tehditler",
      en: "Modern Cyber Threats",
      simple:
        "Bugünün tehditleri yalnızca tek bir bilgisayara değil; tedarik zincirine, elektrik ve su gibi altyapılara, şirketlerin bulut ortamlarına ve herkesin telefonuna yöneliyor.",
      technical:
        "Modern tehdit tablosu şunları içerir: fidye yazılımı, kimlik avı, tedarik zinciri saldırıları (supply chain attacks), devlet destekli sofistike saldırılar (APT — Advanced Persistent Threat), kritik altyapı saldırıları, bulut yanlış yapılandırmaları ve yazılım kütüphanelerindeki yaygın zafiyetler. Saldırganlar çoğu zaman güçlü bir açıktan çok, unutulan bir parola, açık bırakılmış bir servis veya güncellenmemiş bir bileşeni kullanır.",
      example:
        "2020'deki SolarWinds olayında saldırganlar, yaygın kullanılan bir yönetim yazılımının güncelleme sürecine zararlı kod yerleştirdi. Bu güncellemeyi kuran binlerce kurum, farkında olmadan saldırganı içeri aldı. Çıkarılan ders: Güvendiğin yazılım da bir risk kaynağı olabilir.",
    },
  ],
  examples: [
    {
      title: "Stuxnet: Yazılımın fiziksel zarar vermesi",
      text: "2010'da keşfedilen Stuxnet, endüstriyel kontrol sistemlerini (Siemens PLC'ler) hedef alan karmaşık bir zararlıydı. Hedefi İran'ın nükleer santrifüjleriydi ve fiziksel ekipmanı bozabildiği belgelendi.",
      takeaway: "Siber olaylar yalnızca veriyi değil, fiziksel dünyayı da etkileyebilir.",
    },
    {
      title: "WannaCry: Güncellemenin önemi",
      text: "2017'de WannaCry, Windows'un eski SMB protokolündeki bir açığı kullanarak yayıldı. Microsoft yamayı aylar önce yayınlamıştı; ancak güncellenmeyen sistemler büyük zarar gördü. Hastaneler dahil birçok kurum etkilendi.",
      takeaway: "Yama yönetimi (patch management) en basit ama en çok ihmal edilen savunmalardan biridir.",
    },
    {
      title: "Colonial Pipeline: Kritik altyapı hedefte",
      text: "2021'de ABD'de büyük bir akaryakıt boru hattı şirketi fidye yazılımı nedeniyle operasyonlarını bir süre durdurdu. Bu durum bölgedeki akaryakıt tedarikini etkiledi.",
      takeaway: "Bir BT sistemindeki sorun, günlük yaşamı etkileyen fiziksel sonuçlara yol açabilir.",
    },
  ],
  concepts: [
    { term: "Solucan", en: "Worm", definition: "İnsan etkileşimi olmadan ağ üzerinden kendi kendine yayılan zararlı yazılım." },
    { term: "Virüs", en: "Virus", definition: "Başka dosyalara bulaşarak, genellikle kullanıcı etkileşimiyle yayılan zararlı yazılım." },
    { term: "Fidye yazılımı", en: "Ransomware", definition: "Verileri şifreleyip erişimi geri vermek karşılığında ödeme talep eden zararlı yazılım." },
    { term: "Yama", en: "Patch", definition: "Bir yazılımdaki güvenlik açığını kapatan güncelleme." },
    { term: "Tedarik zinciri saldırısı", en: "Supply chain attack", definition: "Hedefi doğrudan değil, hedefin güvendiği yazılım veya tedarikçi üzerinden vurma yöntemi." },
    { term: "CERT / CSIRT", en: "Computer Emergency Response Team", definition: "Siber olaylara müdahale ve koordinasyon sağlayan ekip veya merkez." },
  ],
  activity: {
    type: "timeline",
    title: "İnteraktif zaman çizelgesi",
    intro:
      "Yılları sırayla incele. Her olay için ne olduğunu, neden önemli olduğunu ve siber güvenliğe etkisini oku. Tüm olayları inceleyerek uygulamayı tamamla.",
    events: [
      {
        id: "creeper",
        year: "1971",
        title: "Creeper ve Reaper",
        what: "ARPANET üzerinde kendini bir bilgisayardan diğerine taşıyan deneysel Creeper programı ve onu silmek için yazılan Reaper programı.",
        why: "Programların ağ üzerinde kendiliğinden hareket edebileceğini gösteren ilk örneklerden biri. Zarar vermeyi amaçlamıyordu.",
        impact: "“Kendini kopyalayan kod” fikrinin ve buna karşı koruyucu yazılım yaklaşımının ilk tohumlarını attı.",
      },
      {
        id: "brain",
        year: "1986",
        title: "Brain: İlk PC virüsü",
        what: "Disket önyükleme sektörüne bulaşan, kişisel bilgisayarlar için yazılmış ilk yaygın virüs olarak kabul edilir.",
        why: "Virüsler artık araştırma ağlarıyla sınırlı değildi; sıradan disketlerle evlere ve ofislere ulaşabiliyordu.",
        impact: "Antivirüs ürünleri için ticari bir ihtiyaç doğurdu ve “taşınabilir medya riskini” gündeme getirdi.",
      },
      {
        id: "morris",
        year: "1988",
        title: "Morris Solucanı",
        what: "Bir öğrencinin yazdığı solucan, internete bağlı sistemlerde bilinen zafiyetleri kullanarak yayıldı ve bir hata yüzünden bilgisayarları aşırı yavaşlatarak kullanılamaz hale getirdi.",
        why: "İnternetin ilk büyük ölçekli siber olayıydı ve bağlantılı sistemlerin birbirine ne kadar bağımlı olduğunu gösterdi.",
        impact: "İlk CERT Koordinasyon Merkezi kuruldu. Bilgisayar suçlarıyla ilgili yasal tartışmalar ve yargılamalar hız kazandı.",
      },
      {
        id: "aids",
        year: "1989",
        title: "AIDS Trojan: İlk fidye yazılımı örneği",
        what: "Posta ile gönderilen disketlerle dağıtılan program, dosya adlarını şifreleyip kullanıcıdan ödeme istedi.",
        why: "Zararlı yazılımların doğrudan para talep etmek için kullanılabileceğini ilk kez gösterdi.",
        impact: "Bugünün fidye yazılımı ekonomisinin kavramsal öncüsü olarak değerlendirilir; yedekleme alışkanlığının önemini vurguladı.",
      },
      {
        id: "iloveyou",
        year: "2000",
        title: "ILOVEYOU",
        what: "“Seni seviyorum” konulu e-postaya eklenen betik dosyası, açıldığında kişinin adres defterine kendini göndererek hızla yayıldı.",
        why: "Teknik açıktan çok insan merakını kullanan sosyal mühendislik saldırısının gücünü gösterdi.",
        impact: "E-posta filtreleme, ek dosya uyarıları ve kullanıcı farkındalık eğitimleri yaygınlaştı.",
      },
      {
        id: "slammer",
        year: "2003",
        title: "SQL Slammer",
        what: "Bir veri tabanı yazılımındaki açığı kullanan küçük bir solucan, internette dakikalar içinde çok sayıda sistemi etkiledi.",
        why: "Yayılma hızının insan müdahale süresini aşabileceğini kanıtladı; yama mevcut olmasına rağmen birçok sistem güncellenmemişti.",
        impact: "Yama yönetimi, ağ bölümleme ve otomatik savunmaya duyulan ihtiyaç net biçimde ortaya çıktı.",
      },
      {
        id: "stuxnet",
        year: "2010",
        title: "Stuxnet",
        what: "Endüstriyel kontrol sistemlerini hedef alan ve fiziksel ekipmana zarar verebilen çok gelişmiş bir zararlı.",
        why: "Siber saldırıların fiziksel dünyada sonuç doğurabileceğini ve devlet düzeyinde kaynaklarla geliştirilebildiğini gösterdi.",
        impact: "Endüstriyel sistem (ICS/SCADA) güvenliği ve kritik altyapı koruması ulusal güvenlik gündemine girdi.",
      },
      {
        id: "wannacry",
        year: "2017",
        title: "WannaCry",
        what: "Windows SMB zafiyetini kullanan fidye yazılımı solucanı; çok sayıda ülkede kurumlarda sistemleri kilitledi.",
        why: "Fidye yazılımının solucan gibi yayılma yeteneğine kavuşmasının ve güncelleme ihmalinin sonuçlarını gösterdi.",
        impact: "Yama yönetimi, yedekleme ve eski protokolleri kapatma konusunda kurumlara güçlü bir uyarı oldu.",
      },
      {
        id: "solarwinds",
        year: "2020",
        title: "SolarWinds tedarik zinciri saldırısı",
        what: "Yaygın kullanılan bir ağ yönetim yazılımının güncelleme sürecine zararlı kod yerleştirildi ve çok sayıda kurum etkilendi.",
        why: "Saldırganlar hedefe doğrudan girmek yerine hedefin güvendiği tedarikçiyi kullandı.",
        impact: "Yazılım tedarik zinciri güvenliği, imzalı yazılım doğrulama ve tedarikçi risk yönetimi önem kazandı.",
      },
      {
        id: "colonial",
        year: "2021",
        title: "Colonial Pipeline ve Log4Shell",
        what: "Bir akaryakıt boru hattı şirketi fidye yazılımı sonrası operasyonlarını durdurdu; aynı yıl yaygın bir Java kütüphanesindeki Log4Shell açığı dünya çapında acil müdahale gerektirdi.",
        why: "Kritik altyapıların ve yaygın açık kaynak bileşenlerinin tek bir zayıflıkla ne kadar geniş etkiler yaratabileceğini gösterdi.",
        impact: "Yazılım bileşen envanteri (SBOM), kritik altyapı düzenlemeleri ve olay müdahale hazırlığı üzerine politikalar hızlandı.",
      },
    ],
  },
  quiz: [
    q("l2q1", "Bilgisayar güvenliğinin ortaya çıkışı", "Çok kullanıcılı bilgisayar sistemleri yaygınlaşınca hangi güvenlik ihtiyacı belirgin hale geldi?", [
      "Kullanıcıların birbirinin verisinden ayrılması ve erişim kontrolü",
      "Bilgisayarların daha hızlı çalışması",
      "Ekran çözünürlüğünün artırılması",
      "Bilgisayarların taşınabilir olması",
    ], 0, "Aynı makineyi paylaşan kullanıcıların birbirinin verisine erişememesi gerekiyordu. Kullanıcı hesapları ve dosya izinleri bu ihtiyaçtan doğdu."),
    q("l2q2", "İlk bilgisayar ağları ve ilk solucanlar", "Solucan (worm) ile virüs arasındaki temel fark nedir?", [
      "Solucanlar yalnızca Linux'ta çalışır",
      "Solucan kendi kendine ağ üzerinden yayılabilir; virüs genellikle bir dosyaya bulaşır ve kullanıcı etkileşimiyle yayılır",
      "Virüsler hiçbir zaman zarar vermez",
      "Solucanlar yalnızca e-posta ile yayılır",
    ], 1, "Solucanlar insan müdahalesine ihtiyaç duymadan, ağdaki zafiyetleri kullanarak yayılır. Bu yüzden çok hızlı büyürler."),
    q("l2q3", "İnternetin yaygınlaşması", "ILOVEYOU olayı güvenlik açısından en çok hangi yaklaşımın gücünü gösterdi?", [
      "Fiziksel erişim saldırılarını",
      "Şifreleme algoritmalarındaki matematiksel hataları",
      "Sosyal mühendislik: insan merakı ve güveninden yararlanmayı",
      "Donanım arızalarını",
    ], 2, "Saldırı teknik bir açıktan çok, “seni seviyorum” konulu e-postanın uyandırdığı merak duygusuna dayanıyordu."),
    q("l2q4", "Virüslerden modern zararlı yazılımlara geçiş", "Zararlı yazılımların amacındaki değişimi en iyi hangi ifade özetler?", [
      "Eskiden şaka ve gösteri ağırlıktı; bugün para kazanma, bilgi çalma ve kurum felç etme öne çıktı",
      "Zararlı yazılımlar artık hiç kullanılmıyor",
      "Zararlı yazılımlar yalnızca bireyleri hedef alıyor",
      "Zararlı yazılımların amacı hiç değişmedi",
    ], 0, "Siber suç organize bir ekonomiye dönüştü. Fidye yazılımı hizmet olarak satılacak kadar profesyonelleşti."),
    q("l2q5", "Modern siber tehditler", "SolarWinds olayından çıkarılabilecek en önemli ders hangisidir?", [
      "Güvenilen bir yazılım tedarikçisi de saldırganlar için bir giriş kapısı olabilir",
      "Güncellemeler her zaman zararlıdır ve kurulmamalıdır",
      "Sadece küçük şirketler hedef olabilir",
      "Saldırganlar yalnızca parola tahmin ederek içeri girer",
    ], 0, "Güncelleme kurulmamalı sonucu çıkmaz; doğru ders, tedarik zincirine de risk olarak bakmak ve doğrulama yapmaktır."),
  ],
  summary: [
    "Güvenlik ihtiyacı, çok kullanıcılı sistemler ve ağlar yaygınlaştıkça doğdu.",
    "Creeper'dan Morris Solucanı'na geçişle, kendi kendine yayılan kodun gerçek zarar verebileceği görüldü.",
    "İnternetle birlikte sosyal mühendislik ve para odaklı saldırılar arttı.",
    "Zararlı yazılımlar şakadan profesyonel suç ekonomisine evrildi; fidye yazılımı bunun en görünür örneği.",
    "Her büyük olay savunma anlayışını değiştirdi: yama yönetimi, yedekleme, tespit, tedarik zinciri güvenliği.",
  ],
};
