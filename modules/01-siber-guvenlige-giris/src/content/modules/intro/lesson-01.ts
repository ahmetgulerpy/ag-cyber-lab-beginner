import { q } from "../../helpers";
import type { Lesson } from "../../types";

export const lesson01: Lesson = {
  id: 1,
  title: "Siber Güvenlik Nedir?",
  subtitle: "Dijital varlıklar, riskler ve korumanın temel mantığı",
  goal: "Siber güvenliğin ne olduğunu, hangi varlıkları koruduğunu ve neden hem bireyler hem kurumlar için vazgeçilmez olduğunu kendi cümlelerinle anlatabilmek.",
  outcomes: [
    "Siber güvenliği ve dijital varlık kavramını tanımlayabilirsin.",
    "Günlük hayattaki dijital riskleri fark edebilirsin.",
    "Bireysel ve kurumsal güvenliğin farklarını açıklayabilirsin.",
    "Bir varlığın neden korunması gerektiğini gerekçelendirebilirsin.",
  ],
  minutes: 30,
  topics: [
    {
      title: "Siber güvenlik kavramı",
      en: "Cybersecurity",
      simple:
        "Evinin kapısını kilitlersin çünkü içeride değerli şeyler vardır. Siber güvenlik de aynı fikrin dijital dünyadaki karşılığıdır: bilgisayarların, telefonların, internet hesaplarının ve bunların içindeki bilgilerin kötü niyetli kişilerden, hatalardan ve kazalardan korunması.",
      technical:
        "Siber güvenlik (cybersecurity); bilgi sistemlerini, ağları, uygulamaları ve verileri yetkisiz erişim, değiştirme, ele geçirme veya hizmet dışı bırakma girişimlerine karşı korumak için uygulanan teknik önlemler, süreçler ve insan davranışlarının bütünüdür. Yalnızca antivirüs gibi bir ürün değildir; politika, eğitim, izleme ve müdahale gibi katmanları da içerir.",
      example:
        "Bir hastanenin randevu sistemi fidye yazılımıyla kilitlendiğinde sorun yalnızca “bilgisayar bozuldu” değildir; ameliyatlar ertelenebilir, hasta kayıtlarına ulaşılamaz. Siber güvenlik, bu tür olayların hem olmasını zorlaştırmayı hem de olursa hızlı toparlanmayı hedefler.",
    },
    {
      title: "Dijital varlık nedir?",
      en: "Digital Asset",
      simple:
        "Dijital varlık, dijital ortamda bulunan ve sahibi için değeri olan her şeydir. Değer her zaman para demek değildir: bir fotoğraf anı, bir müşteri listesi ise iş demektir.",
      technical:
        "Dijital varlıklar; veriler (müşteri kayıtları, parolalar, belgeler), sistemler (sunucular, bilgisayarlar, telefonlar), hizmetler (web sitesi, e-posta, bulut depolama) ve kimlikler (kullanıcı hesapları, erişim anahtarları) olarak gruplanabilir. Bir varlığı korumak için önce onun var olduğunu bilmek gerekir; bu yüzden güvenlikte ilk adım genellikle “envanter çıkarmaktır” (asset inventory).",
      example:
        "Küçük bir muhasebe ofisinin en değerli dijital varlığı bilgisayarları değil, müşterilerinin vergi bilgileridir. Bilgisayar yenilenebilir; sızdırılan veri geri alınamaz. Ofis sahibi önce “neyim var?” sorusunu cevaplamadan doğru önlemi seçemez.",
    },
    {
      title: "Neden siber güvenliğe ihtiyaç duyulur?",
      simple:
        "Hayatımızın büyük bölümü artık internet üzerinden yürüyor: para işlemleri, iletişim, sağlık, eğitim, alışveriş. Değerli şeylerin olduğu her yer, onları ele geçirmek isteyen biri için de ilgi çekicidir. Ayrıca her sorun saldırıdan kaynaklanmaz; yanlış tıklama, unutulan bir güncelleme veya bozulan bir disk de zarar verir.",
      technical:
        "İhtiyacın üç temel nedeni vardır: (1) Saldırı yüzeyi (attack surface) büyüdü; her cihaz ve her çevrim içi hizmet potansiyel bir giriş noktasıdır. (2) Saldırılar ekonomik olarak kazançlı hale geldi; fidye, dolandırıcılık ve veri satışı organize bir gelir kaynağı. (3) Yazılımlar karmaşık olduğu için kaçınılmaz olarak zafiyet (vulnerability) içerir. Risk; tehdit, zafiyet ve varlığın değerinin birleşimidir.",
      example:
        "2017'de WannaCry fidye yazılımı, güncellenmemiş Windows sistemleri üzerinden yüzlerce bin bilgisayara yayıldı. Yama (patch) aylar önce yayınlanmıştı; ancak uygulanmayan güncellemeler birçok kurumu ciddi biçimde etkiledi. Küçük bir ihmal büyük bir sonuca dönüşebilir.",
    },
    {
      title: "Günlük hayatta siber güvenlik",
      simple:
        "Siber güvenlik sadece uzmanların işi değil. Parolanı seçerken, bir bağlantıya tıklarken, kafedeki ücretsiz Wi-Fi'a bağlanırken ya da telefonuna uygulama yüklerken zaten bir güvenlik kararı veriyorsun.",
      technical:
        "Günlük hayatta en sık karşılaşılan tehditler: kimlik avı (phishing) mesajları, zayıf veya tekrar kullanılan parolalar, güncellenmemiş yazılımlar, güvensiz açık Wi-Fi ağları ve izinleri gereğinden fazla isteyen mobil uygulamalardır. Temel savunmalar ise güçlü ve benzersiz parolalar, çok faktörlü doğrulama (MFA), düzenli güncelleme ve şüpheci bir yaklaşımdır.",
      example:
        "“Kargonuz teslim edilemedi, adresinizi güncelleyin” yazan bir SMS geldi. Bağlantıda kargo firmasına benzeyen ama farklı bir alan adı var. Burada gerekli olan teknik bir araç değil, durup düşünmek ve resmi uygulamadan kontrol etmektir.",
    },
    {
      title: "Bireysel ve kurumsal güvenlik",
      simple:
        "Bireysel güvenlikte korunan şey senin hesapların, cihazların ve kişisel verilerin. Kurumsal güvenlikte ise çok sayıda kişinin verisi, ortak sistemler ve şirketin itibarı söz konusu. Ölçek büyüdükçe bir hatanın sonucu da büyür.",
      technical:
        "Bireysel güvenlik çoğunlukla kişisel alışkanlıklara ve birkaç araca (parola yöneticisi, MFA, yedekleme) dayanır. Kurumsal güvenlik ise politika, rol ve yetki yönetimi, ağ bölümleme, izleme (monitoring), olay müdahale planı, yasal uyumluluk ve çalışan farkındalığı gibi birçok bileşenin koordinasyonunu gerektirir. Kurumlarda ayrıca “kimin neye erişebileceği” ve “bir şey ters giderse kimin ne yapacağı” önceden tanımlanır.",
      example:
        "Bir kişinin e-posta hesabı ele geçirilirse sorun çoğunlukla o kişiyle sınırlıdır. Bir şirket çalışanının hesabı ele geçirilirse saldırgan şirket içi yazışmalara, müşteri bilgilerine ve hatta diğer çalışanlara kendisini o çalışan olarak tanıtma imkânına ulaşabilir.",
    },
    {
      title: "Siber güvenliğin temel amacı",
      simple:
        "Amaç “hiçbir şey olmasın” demek değil; çünkü %100 güvenlik yoktur. Amaç, riski kabul edilebilir bir seviyeye indirmek, bir şey olursa erken fark etmek ve hızlı toparlanmaktır.",
      technical:
        "Siber güvenliğin klasik hedefi bilgi güvenliğinin üç ilkesini sağlamaktır: gizlilik (confidentiality), bütünlük (integrity) ve erişilebilirlik (availability). Bu ilkeleri Ders 06'da ayrıntılı işleyeceğiz. Pratikte güvenlik döngüsü dört işten oluşur: önleme (prevent), tespit (detect), müdahale (respond) ve toparlanma (recover).",
      example:
        "Bir kafe, kasa bilgisayarına güncelleme yapar (önleme), şüpheli giriş denemelerinde uyarı alır (tespit), şüphe halinde hesabı hemen kapatır (müdahale) ve her gece yedek aldığı için sipariş kayıtlarını geri yükler (toparlanma). Dört adım birlikte çalıştığında güvenlik anlam kazanır.",
    },
  ],
  examples: [
    {
      title: "Ele geçirilen e-posta hesabı",
      text: "Birinin e-posta hesabı ele geçirildiğinde saldırgan, o hesapla bağlantılı diğer servislerde “parolamı unuttum” adımını kullanarak banka, sosyal medya ve alışveriş hesaplarına ulaşmaya çalışabilir. E-posta, birçok dijital kapının anahtarıdır.",
      takeaway: "Bu yüzden e-posta hesabı bireysel güvenlikte en yüksek öncelikli varlıklardan biridir.",
    },
    {
      title: "Müşteri verisi sızıntısı",
      text: "Bir online mağaza, müşterilerinin ad, telefon ve adres bilgilerini korumasız bir veri tabanında tutuyor. Veriler internete açık kaldığında şirket yalnızca teknik bir sorun yaşamaz; müşteri güveni kaybolur ve yasal sorumluluklar doğar.",
      takeaway: "Kurumsal güvenlik yalnızca sistemleri değil, insanların verisini ve kurumun itibarını da korur.",
    },
    {
      title: "Web sitesinin değiştirilmesi",
      text: "Bir belediyenin web sitesinde duyurular yetkisiz biri tarafından değiştirildi. Hiçbir veri çalınmadı; ancak vatandaşlar yanlış bilgi okudu ve kuruma duyulan güven zedelendi.",
      takeaway: "Her saldırının hedefi veri çalmak değildir; bilginin doğruluğu ve hizmetin kendisi de korunması gereken varlıklardır.",
    },
  ],
  concepts: [
    { term: "Siber güvenlik", en: "Cybersecurity", definition: "Dijital sistemleri, ağları ve verileri kötü niyetli veya kazara oluşan zararlardan koruma çabası." },
    { term: "Dijital varlık", en: "Digital asset", definition: "Dijital ortamda bulunan ve sahibi için değeri olan veri, sistem, hizmet veya kimlik." },
    { term: "Tehdit", en: "Threat", definition: "Bir varlığa zarar verebilecek olası olay veya kişi." },
    { term: "Zafiyet", en: "Vulnerability", definition: "Bir sistemin tehdit tarafından kullanılabilecek zayıf noktası." },
    { term: "Risk", en: "Risk", definition: "Bir tehdidin bir zafiyeti kullanarak değerli bir varlığa zarar verme olasılığı ve etkisi." },
    { term: "Saldırı yüzeyi", en: "Attack surface", definition: "Bir sisteme dışarıdan erişilebilecek tüm giriş noktalarının toplamı." },
  ],
  activity: {
    type: "match",
    title: "Hangi varlık korunmalı?",
    intro:
      "Aşağıdaki dijital varlıkları incele. Her biri için “hassas, korunması gereken varlık” mı yoksa “herkese açık, gizliliği gerekmeyen bilgi” mi olduğuna karar ver. Yanlış seçimde ceza yok; açıklamayı oku ve tekrar dene.",
    categories: [
      { id: "protect", label: "Korunmalı", description: "Yetkisiz erişim, değişiklik veya kayıp ciddi zarar verir." },
      { id: "public", label: "Herkese açık bilgi", description: "Gizliliği gerekmez; ama doğruluğu yine de önemlidir." },
    ],
    items: [
      { id: "email", text: "E-posta hesabın", answer: "protect", explanation: "E-posta, diğer hesaplar için “parolamı unuttum” bağlantılarının geldiği yerdir. Ele geçirilirse birçok hesap zincirleme olarak risk altına girer." },
      { id: "bank", text: "İnternet bankacılığı hesabı", answer: "protect", explanation: "Doğrudan parasal zarara yol açabilir. Güçlü parola ve çok faktörlü doğrulama burada temel gerekliliktir." },
      { id: "customers", text: "Şirketin müşteri verileri (ad, telefon, adres)", answer: "protect", explanation: "Kişisel veridir. Sızması hem müşterileri mağdur eder hem de şirketin yasal sorumluluğunu doğurur (Ders 08'de KVKK'yı göreceksin)." },
      { id: "website", text: "Şirketin kurumsal web sitesi", answer: "protect", explanation: "İçeriği herkese açık olsa bile site; değiştirilmeye (deface), yönlendirmeye ve hizmet dışı bırakılmaya karşı korunmalıdır. Sitenin yönetim paneli ise özellikle hassastır." },
      { id: "photos", text: "Telefonundaki kişisel fotoğraflar", answer: "protect", explanation: "Maddi değeri olmasa da mahremiyet taşır. Şantaj ve itibar zararı gibi sonuçlar doğurabilir; ayrıca kaybolursa geri getirilemez." },
      { id: "server", text: "Müşteri uygulamasını çalıştıran sunucu", answer: "protect", explanation: "Sunucu ele geçirilirse üzerindeki tüm veri ve hizmetler tehlikeye girer. Kurumun en kritik varlıklarından biridir." },
      { id: "pressrelease", text: "Şirketin web sitesinde zaten yayımlanmış basın bülteni metni", answer: "public", explanation: "İçerik zaten herkese açık; gizlilik gerekmez. Yine de metnin yetkisiz biri tarafından değiştirilmemesi (bütünlük) önemlidir; ancak “gizli tutma” ihtiyacı yoktur." },
      { id: "brochure", text: "Herkesin indirebildiği ürün tanıtım broşürü (PDF)", answer: "public", explanation: "Bilerek herkese sunulmuş bir içerik. Korunması gereken şey içeriğin gizliliği değil, dosyanın zararlı bir sürümle değiştirilmemesidir." },
    ],
    reminder:
      "Hatırlatma: Bir varlığı değerlendirirken “gizli mi?” sorusunun yanında “değiştirilirse ne olur?” ve “erişilemezse ne olur?” sorularını da sor. Bu üç soru Ders 06'daki CIA üçlüsünün temelidir.",
  },
  quiz: [
    q("l1q1", "Siber güvenlik kavramı", "Aşağıdakilerden hangisi siber güvenliği en doğru biçimde tanımlar?", [
      "Yalnızca antivirüs programı kullanmak",
      "Dijital sistemleri, ağları ve verileri yetkisiz erişim ve zararlardan koruyan teknik önlemler, süreçler ve davranışların bütünü",
      "Bilgisayarları hızlandırmak için yapılan bakım işlemleri",
      "İnternet bağlantısını sağlayan altyapı hizmetleri",
    ], 1, "Siber güvenlik tek bir ürün değildir; teknoloji, süreç ve insan davranışının birlikte çalıştığı bir yaklaşımdır."),
    q("l1q2", "Dijital varlık nedir?", "Küçük bir muhasebe ofisinde en değerli dijital varlık aşağıdakilerden hangisidir?", [
      "Ofisin yazıcısı",
      "Ofis bilgisayarlarının markası",
      "Müşterilerin vergi ve mali bilgileri",
      "Masaüstü arka plan resmi",
    ], 2, "Donanım yenilenebilir; ancak sızdırılan müşteri verisi geri alınamaz. Varlığın değeri, sahibinde yarattığı sonuçlarla ölçülür."),
    q("l1q3", "Neden siber güvenliğe ihtiyaç duyulur?", "Risk kavramı hangi öğelerin birleşimiyle ortaya çıkar?", [
      "Tehdit, zafiyet ve varlığın değeri",
      "Yalnızca saldırganın niyeti",
      "Yalnızca kullanılan işletim sistemi",
      "İnternet hızı ve sunucu sayısı",
    ], 0, "Güçlü bir tehdit olsa bile zafiyet yoksa veya korunan varlığın değeri düşükse risk azalır. Üçü birlikte değerlendirilir."),
    q("l1q4", "Günlük hayatta siber güvenlik", "“Kargonuz teslim edilemedi, bağlantıdan adresinizi güncelleyin” mesajında gelen bağlantı tanımadığın bir alan adına gidiyor. En doğru davranış hangisidir?", [
      "Hızlıca tıklayıp adresi güncellemek",
      "Mesajı arkadaşlara iletip onlara sormak",
      "Bağlantıya tıklamadan resmi kargo uygulaması veya sitesinden gönderiyi kontrol etmek",
      "Bağlantıya tıklayıp sadece bakmak, bilgi girmemek",
    ], 2, "Bağlantıya yalnızca tıklamak bile zararlı içeriğe maruz kalmana yol açabilir. Güvenli yol, bilgiyi resmi kanaldan bağımsız olarak doğrulamaktır."),
    q("l1q5", "Siber güvenliğin temel amacı", "“Siber güvenlikte %100 güvenlik yoktur” ifadesinin pratik sonucu hangisidir?", [
      "Güvenlik önlemleri almanın anlamı yoktur",
      "Yalnızca önleme önemlidir, tespit ve toparlanma gereksizdir",
      "Önleme kadar tespit, müdahale ve toparlanma da planlanmalıdır",
      "Sadece büyük kurumlar güvenlik önlemi almalıdır",
    ], 2, "Hiçbir önlem riski sıfırlamaz. Bu yüzden saldırıyı erken fark etmek, doğru müdahale etmek ve yedeklerle toparlanmak da güvenliğin parçasıdır."),
  ],
  summary: [
    "Siber güvenlik; dijital sistemleri, ağları ve verileri korumak için teknoloji, süreç ve insan davranışını birlikte kullanma çabasıdır.",
    "Dijital varlık; veri, sistem, hizmet veya kimlik olabilir ve değeri her zaman parayla ölçülmez.",
    "Risk; tehdit, zafiyet ve varlığın değerinin birleşiminden doğar.",
    "Bireysel güvenlik alışkanlıklara, kurumsal güvenlik politika, rol ve izlemeye dayanır.",
    "Hedef sıfır risk değil; önleme, tespit, müdahale ve toparlanmayı birlikte yürütmektir.",
  ],
};
