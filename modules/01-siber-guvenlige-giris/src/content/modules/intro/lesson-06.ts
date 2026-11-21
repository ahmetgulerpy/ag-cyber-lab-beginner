import { q } from "../../helpers";
import type { Lesson } from "../../types";

export const lesson06: Lesson = {
  id: 6,
  title: "Bilgi Güvenliği ve Siber Güvenlik Farkı",
  subtitle: "CIA Triad: Gizlilik, Bütünlük, Erişilebilirlik",
  goal: "Bilgi güvenliği ile siber güvenlik kavramlarının kapsamını ayırt etmek ve güvenliğin temel yapı taşı olan CIA üçlüsünü gerçek olaylara uygulayabilmek.",
  outcomes: [
    "Bilgi güvenliği ve siber güvenlik arasındaki farkı açıklayabilirsin.",
    "Gizlilik, bütünlük ve erişilebilirliği örneklerle tanımlayabilirsin.",
    "Bir olayın hangi güvenlik ilkesini ihlal ettiğini belirleyebilirsin.",
    "Fiziksel ve dijital güvenliğin birbirini nasıl tamamladığını anlatabilirsin.",
  ],
  minutes: 35,
  topics: [
    {
      title: "Bilgi güvenliği nedir?",
      en: "Information Security",
      simple:
        "Bilgi, kâğıtta, bir bilgisayarda, bir hard diskte ya da bir insanın aklında olabilir. Bilgi güvenliği, bilginin bulunduğu yer ne olursa olsun korunmasıdır. Yani bir defterdeki müşteri listesi de bilgi güvenliği kapsamındadır.",
      technical:
        "Bilgi güvenliği (information security), bilginin her biçimde (basılı, dijital, sözlü) yetkisiz erişim, kullanım, ifşa, değiştirme veya yok edilmesine karşı korunmasıdır. Odak noktası bilginin kendisi ve onun gizlilik, bütünlük ve erişilebilirlik özellikleridir. ISO/IEC 27001 gibi standartlar bilgi güvenliği yönetim sistemlerini bu bakışla tanımlar.",
      example:
        "Bir hukuk bürosunun müşteri dosyaları hem dolapta kâğıt olarak hem de bilgisayarda tutuluyor. Dolabın kilidi, bilgisayarın parolası ve avukatların gizlilik taahhüdü hep aynı amaca hizmet eder: bilgiyi korumak.",
    },
    {
      title: "Siber güvenlik nedir ve aradaki fark",
      en: "Cybersecurity vs. Information Security",
      simple:
        "İki kavram birbirine çok yakındır ama kapsamları farklıdır. Siber güvenlik, dijital dünyadaki sistemleri, ağları ve verileri korumaya odaklanır. Bilgi güvenliği ise daha geniş bir şemsiyedir ve dijital olmayan bilgiyi de kapsar.",
      technical:
        "Genel kabul gören ayrımda siber güvenlik, bilgi güvenliğinin dijital ortamla ilgili alt kümesi olarak düşünülür; ancak bazı tanımlar siber güvenliği daha geniş ele alır ve fiziksel dünyayı etkileyebilen sistemleri (endüstriyel kontrol sistemleri, akıllı cihazlar) de kapsar. Önemli olan terimlere takılmak değil, ikisinin de aynı temel ilkelere (CIA) dayandığını bilmektir.",
      example:
        "Bir şirketin çöp kutusuna atılan, müşteri bilgisi içeren kâğıtlar bir bilgi güvenliği sorunudur ama siber güvenlik sorunu değildir. Aynı bilgilerin zayıf parolalı bir sunucudan sızdırılması ise hem siber güvenlik hem bilgi güvenliği sorunudur.",
    },
    {
      title: "Gizlilik (Confidentiality)",
      en: "Confidentiality",
      simple:
        "Gizlilik, bilginin yalnızca görmeye yetkili kişiler tarafından görülebilmesidir. Günlüğünü kilitli tutmak gibi: yazanlar ve izin verdiklerin okuyabilir, başkası okuyamaz.",
      technical:
        "Gizlilik kontrolleri: kimlik doğrulama ve yetkilendirme, erişim kontrol listeleri, şifreleme (veri hem saklanırken hem aktarılırken), veri sınıflandırma ve gerekli olanı bilme (need-to-know) ilkesi. Gizlilik ihlalleri; veri sızıntısı, yetkisiz erişim, yanlış alıcıya gönderilen e-posta veya çalınan cihazlardan veri okunması gibi biçimlerde görülür.",
      example:
        "Bir çalışan, yanlış alıcıyı seçerek müşteri maaş listesini tüm şirkete gönderir. Hiçbir saldırgan yoktur; yine de gizlilik ilkesi ihlal edilmiştir. Bu yüzden güvenlik yalnızca saldırgana karşı değil, insan hatasına karşı da tasarlanır.",
    },
    {
      title: "Bütünlük (Integrity)",
      en: "Integrity",
      simple:
        "Bütünlük, bilginin doğru, eksiksiz ve izinsiz değiştirilmemiş olmasıdır. Bir kaşeli belgenin üzerinde kimsenin sessizce rakam değiştirmediğinden emin olmak gibi.",
      technical:
        "Bütünlüğü sağlayan yöntemler: özet (hash) fonksiyonları, dijital imzalar, sürüm kontrolü, erişim yetkileri, denetim kayıtları (audit logs) ve veri doğrulama. Hash fonksiyonu, bir verinin “parmak izi”ni üretir; veride bir bit bile değişse özet tamamen farklı çıkar. Bu, indirilen dosyanın değiştirilip değiştirilmediğini kontrol etmek için kullanılır.",
      example:
        "Bir saldırgan, havale işlemindeki tutarı 100 TL'den 10.000 TL'ye değiştirir. Veri çalınmamış, sistem de çalışmaya devam etmektedir; ama bilgi artık doğru değildir. Bu bir bütünlük ihlalidir ve finansal sonuçları ağır olabilir.",
      terminal: {
        title: "Bütünlük kontrolü: hash örneği (kavramsal)",
        lines: [
          "$ sha256sum guncelleme.zip",
          "a3f1…9c2e  guncelleme.zip      # üreticinin yayınladığı değerle aynı",
          "",
          "# Dosya değiştirilirse:",
          "$ sha256sum guncelleme.zip",
          "7be0…41d8  guncelleme.zip      # farklı özet = dosya değişmiş",
        ],
      },
    },
    {
      title: "Erişilebilirlik (Availability)",
      en: "Availability",
      simple:
        "Erişilebilirlik, bilgiye ve sistemlere ihtiyaç duyulduğunda yetkili kişilerin ulaşabilmesidir. En güvenli kasa, kimse açamıyorsa işe yaramaz. Bir sistem kapalıysa, içindeki bilgi ne kadar korunmuş olursa olsun amacına hizmet etmez.",
      technical:
        "Erişilebilirliği tehdit edenler: hizmet engelleme saldırıları (DoS/DDoS), fidye yazılımı, donanım arızaları, doğal afetler, yanlış yapılandırma ve yetersiz kapasite. Koruma yöntemleri: yedekleme, yedek sistemler (redundancy), yük dengeleme, felaket kurtarma planı (disaster recovery), izleme ve kapasite planlaması.",
      example:
        "Bir e-ticaret sitesi kampanya gününde DDoS saldırısıyla yavaşlar ve çöker. Müşteri verisi çalınmamıştır, değiştirilmemiştir; ama müşteriler alışveriş yapamaz. Erişilebilirlik ihlali doğrudan gelir kaybı demektir.",
    },
    {
      title: "Fiziksel ve dijital güvenlik, bilgi varlıklarının korunması",
      en: "Physical and Digital Security",
      simple:
        "Güçlü bir parola, sunucu odasının kapısı açıksa yeterli değildir. Güvenlik hem dijital önlemleri (parola, şifreleme, güvenlik duvarı) hem fiziksel önlemleri (kilit, kamera, kartlı geçiş) birlikte düşünmelidir.",
      technical:
        "Bilgi varlıklarının korunması için önce varlıklar sınıflandırılır (örneğin herkese açık, dahili, gizli, çok gizli) ve her sınıf için uygun kontroller belirlenir. Fiziksel kontroller: erişim kartları, kameralar, sunucu odası kilidi, cihaz imhası. Dijital kontroller: kimlik doğrulama, şifreleme, yedekleme, izleme. Yönetimsel kontroller: politika, eğitim ve sorumluluk dağılımı. Üç katman birlikte çalıştığında bütünsel koruma oluşur.",
      example:
        "Bir şirket tüm hard disklerini şifreler; ancak eski bilgisayarları çöpe atarken diskleri silmez. Çöpten diskleri alan biri, şifrelenmemiş yedeklere ve eski dosyalara ulaşabilir. Güvenlik, bilginin yaşam döngüsü boyunca (oluşturma, kullanma, saklama, imha) düşünülmelidir.",
    },
  ],
  examples: [
    {
      title: "Sağlık verisi sızıntısı",
      text: "Bir klinikte hasta dosyalarına yetkisi olmayan bir çalışan merak nedeniyle ünlü bir hastanın kaydına bakar. Hiçbir dosya silinmedi, değiştirilmedi ve sistem çalışmaya devam etti.",
      takeaway: "Bu bir gizlilik ihlalidir. Yetki yönetimi ve erişim kayıtları bu tür olayları önlemek ve tespit etmek için vardır.",
    },
    {
      title: "Not sisteminde değişiklik",
      text: "Bir okulun not sistemine izinsiz giren öğrenci, kendi notunu değiştirir. Sistem çalışır, kimseye ait veriler ifşa edilmemiştir.",
      takeaway: "Bu bir bütünlük ihlalidir. Veri gizli değildi ama doğruluğu bozuldu.",
    },
    {
      title: "Fidye yazılımı ve hastane",
      text: "Bir hastanenin sistemleri fidye yazılımıyla şifrelendi. Veriler çalınmamış olabilir, ancak doktorlar hasta kayıtlarına ulaşamıyor.",
      takeaway: "Bu öncelikle bir erişilebilirlik ihlalidir; hayat kurtaran işlemlerin gecikmesine neden olabilir.",
    },
  ],
  concepts: [
    { term: "CIA Triad", en: "Confidentiality, Integrity, Availability", definition: "Bilgi güvenliğinin üç temel hedefi: gizlilik, bütünlük, erişilebilirlik." },
    { term: "Gizlilik", en: "Confidentiality", definition: "Bilgiye yalnızca yetkili kişilerin erişebilmesi." },
    { term: "Bütünlük", en: "Integrity", definition: "Bilginin doğru, tam ve izinsiz değiştirilmemiş olması." },
    { term: "Erişilebilirlik", en: "Availability", definition: "Yetkili kişilerin ihtiyaç duyduklarında bilgiye ve sistemlere ulaşabilmesi." },
    { term: "Hash (özet)", en: "Hash", definition: "Bir verinin sabit uzunlukta, benzersiz parmak izine benzer özetini üreten tek yönlü fonksiyon." },
    { term: "Gerekli olanı bilme", en: "Need-to-know", definition: "Kişiye yalnızca işini yapması için gereken bilgiye erişim izni verme ilkesi." },
  ],
  activity: {
    type: "explore-match",
    title: "CIA Triad öğrenme alanı",
    intro:
      "Önce üç ilkeyi incele: açıklamalarını, örneklerini ve mini senaryolarını gör. Ardından gerçek olayları ihlal edilen ilkeyle eşleştir.",
    cardsTitle: "1. Üç ilkeyi incele",
    cards: [
      {
        id: "c",
        name: "Gizlilik",
        en: "Confidentiality",
        tagline: "Bilgiyi yalnızca görmesi gerekenler görür.",
        points: [
          "Kimlik doğrulama ve yetkilendirme ile sağlanır",
          "Şifreleme: saklanırken ve aktarılırken",
          "Gerekli olanı bilme (need-to-know) ilkesi",
          "İhlal örnekleri: veri sızıntısı, yanlış alıcıya e-posta, çalınan cihaz",
        ],
        example: "Banka hesap özetinin sadece hesap sahibi tarafından görülebilmesi.",
        mini: {
          story: "Bir çalışan müşteri listesini ofis dışındaki kişisel e-posta adresine gönderiyor.",
          question: "Hangi ilke tehlikede ve neden?",
          answer: "Gizlilik. Veri yetkisiz bir ortama çıkıyor; kurum artık kimlerin göreceğini kontrol edemez. Çalışanın niyeti kötü olmasa bile ihlal oluşur.",
        },
      },
      {
        id: "i",
        name: "Bütünlük",
        en: "Integrity",
        tagline: "Bilgi doğru kalır; kimse fark edilmeden değiştiremez.",
        points: [
          "Hash ve dijital imzalar ile doğrulanır",
          "Yetki kontrolü ve denetim kayıtları ile korunur",
          "Sürüm kontrolü, yedek karşılaştırması",
          "İhlal örnekleri: veri tahrifatı, sahte güncelleme, yetkisiz değişiklik",
        ],
        example: "Bir yazılım güncellemesinin imzasının doğrulanarak orijinal olduğundan emin olunması.",
        mini: {
          story: "Bir saldırgan, faturadaki IBAN numarasını kendi hesabıyla değiştiriyor.",
          question: "Hangi ilke ihlal edildi? Neden gizlilik değil?",
          answer: "Bütünlük. Bilgi gizli bir şey ifşa etmedi; doğruluğu bozuldu. Para yanlış hesaba gidebilir. Bütünlük ihlalleri sessiz ve fark edilmesi zor olabilir.",
        },
      },
      {
        id: "a",
        name: "Erişilebilirlik",
        en: "Availability",
        tagline: "Sistem ve bilgi ihtiyaç duyulduğunda kullanılabilir.",
        points: [
          "Yedekleme ve yedek sistemlerle sağlanır",
          "Felaket kurtarma ve iş sürekliliği planları",
          "Kapasite planlaması ve DDoS koruması",
          "İhlal örnekleri: DDoS, fidye yazılımı, donanım arızası, yanlış yapılandırma",
        ],
        example: "Bir hastanenin kayıt sistemi arızalansa bile yedek sisteme geçerek hizmeti sürdürmesi.",
        mini: {
          story: "Bir saldırı sonucu e-devlet benzeri bir hizmet saatlerce kapalı kalıyor, ancak hiçbir veri çalınmıyor.",
          question: "Güvenlik ihlali var mı?",
          answer: "Evet. Erişilebilirlik ihlali. Bilgi güvende olsa bile ihtiyaç anında kullanılamıyorsa sistem amacına hizmet etmiyor demektir.",
        },
      },
    ],
    match: {
      type: "match",
      title: "2. Olayı ihlal edilen ilkeyle eşleştir",
      intro:
        "Aşağıdaki olaylarda öncelikle hangi güvenlik ilkesinin ihlal edildiğini belirle. Bazı olaylar birden fazla ilkeyi etkileyebilir; burada “en çok etkilenen” ilkeyi seç.",
      categories: [
        { id: "c", label: "Gizlilik" },
        { id: "i", label: "Bütünlük" },
        { id: "a", label: "Erişilebilirlik" },
      ],
      items: [
        { id: "e1", text: "Müşteri listesi yanlışlıkla yetkisiz bir kişiye e-postayla gönderildi.", answer: "c", explanation: "Bilgi, görmeye yetkili olmayan birine ulaştı; bu gizlilik ihlalidir." },
        { id: "e2", text: "Saldırgan, bir havale işleminin tutarını 100 TL'den 10.000 TL'ye değiştirdi.", answer: "i", explanation: "Veri çalınmadı ama doğruluğu bozuldu. Bütünlük ihlalleri finansal sonuçlar doğurabilir." },
        { id: "e3", text: "Kampanya gününde e-ticaret sitesi DDoS saldırısıyla çöktü.", answer: "a", explanation: "Veri çalınmadı, değişmedi; ancak yetkili kullanıcılar hizmete ulaşamadı. Erişilebilirlik ihlalidir." },
        { id: "e4", text: "Bir çalışan parolasını yazarken yan masadaki kişi ekrana bakıp parolayı öğrendi.", answer: "c", explanation: "Parola yetkisiz birinin eline geçti. Bu gizlilik ihlalidir ve ardından başka ihlallere yol açabilir." },
        { id: "e5", text: "Güncelleme dosyası indirilirken sahte ve zararlı bir sürümle değiştirildi.", answer: "i", explanation: "Dosyanın içeriği izinsiz değişti; hash/dijital imza kontrolü bu tür bütünlük ihlallerini yakalamak için kullanılır." },
        { id: "e6", text: "Sunucu odasında klima arızalandı ve yedek sistem olmadığı için hizmet günlerce kapalı kaldı.", answer: "a", explanation: "Güvenlik yalnızca saldırıya karşı değildir. Yedeksizlik ve donanım arızası erişilebilirliği doğrudan etkiler." },
        { id: "e7", text: "Bir öğrenci, okul sistemine girip kendi notunu değiştirdi.", answer: "i", explanation: "Bilgi gizli değildi; fakat izinsiz biçimde değiştirildi ve doğruluğu bozuldu." },
        { id: "e8", text: "Fidye yazılımı hastane kayıtlarını şifreledi; doktorlar hasta dosyalarına ulaşamıyor.", answer: "a", explanation: "Önce erişim kaybı yaşanır: veri yerinde ama kullanılamıyor. (Veri ayrıca çalınmışsa gizlilik de etkilenir; ancak burada öne çıkan ihlal erişilebilirliktir.)" },
      ],
      reminder:
        "Hatırlatma: Gizlilik “kim görebilir?”, bütünlük “doğru mu?”, erişilebilirlik “ihtiyaç anında ulaşılabiliyor mu?” sorusunun cevabıdır. Her olayda üç soruyu birlikte sor.",
    },
  },
  quiz: [
    q("l6q1", "Bilgi güvenliği nedir?", "Aşağıdakilerden hangisi “bilgi güvenliği” kapsamındadır ama “siber güvenlik” kapsamının dışında kalabilir?", [
      "Zayıf parolalı bir sunucunun korunması",
      "Müşteri bilgisi içeren kâğıtların güvenli şekilde imha edilmesi",
      "Güvenlik duvarı yapılandırması",
      "E-posta filtresi kurulumu",
    ], 1, "Bilgi güvenliği, bilginin biçimi ne olursa olsun korunmasıdır; kâğıt belgeler dijital olmadığı için tipik olarak siber güvenliğin dışında kalır."),
    q("l6q2", "Siber güvenlik nedir ve aradaki fark", "Siber güvenlik ve bilgi güvenliği ilişkisi için en doğru ifade hangisidir?", [
      "Birbirleriyle hiçbir ilgileri yoktur",
      "İkisi de aynı CIA ilkelerine dayanır; bilgi güvenliği daha geniş, siber güvenlik dijital ortama odaklıdır",
      "Siber güvenlik, bilgi güvenliğinden tamamen bağımsızdır",
      "Bilgi güvenliği yalnızca fiziksel güvenliktir",
    ], 1, "Terimler yakından ilişkilidir. Aynı temel ilkeleri paylaşırlar; kapsamlarında odak farkı vardır."),
    q("l6q3", "Gizlilik (Confidentiality)", "Bir şirket tüm müşteri verilerini şifreleyerek saklıyor. Bu önlem öncelikle hangi ilkeyi güçlendirir?", [
      "Erişilebilirlik",
      "Bütünlük",
      "Gizlilik",
      "Hız",
    ], 2, "Şifreleme, veriyi ele geçirmiş yetkisiz kişilerin okumasını engeller. Bu, gizliliğin klasik bir kontrolüdür."),
    q("l6q4", "Bütünlük (Integrity)", "İndirdiğin bir yazılımın hash değeri üreticinin yayımladığı değerden farklı çıktı. Bu ne anlama gelebilir?", [
      "Dosya değişmiş veya bozulmuş olabilir; kurmadan önce güvenilir kaynaktan tekrar indirmek gerekir",
      "Dosya daha hızlı çalışacaktır",
      "Dosya otomatik olarak güvenli sayılır",
      "İnternet bağlantısı yavaştır",
    ], 0, "Hash, dosyanın parmak izidir. Farklı çıkması dosyanın değiştiğine işaret eder; bu bir bütünlük sorunudur."),
    q("l6q5", "Erişilebilirlik (Availability)", "Aşağıdaki önlemlerden hangisi öncelikle erişilebilirliği güçlendirir?", [
      "Parola karmaşıklık kuralı koymak",
      "Yedek sunucu kurmak ve düzenli yedek almak",
      "Veriyi dijital imzalamak",
      "Dosyalara erişim izinlerini daraltmak",
    ], 1, "Yedek sistemler ve yedekleme, arıza veya saldırı durumunda hizmetin sürmesini ve verinin geri yüklenmesini sağlar."),
  ],
  summary: [
    "Bilgi güvenliği bilginin her biçimde korunmasıdır; siber güvenlik dijital ortama odaklanır.",
    "CIA üçlüsü: gizlilik (kim görebilir), bütünlük (doğru mu), erişilebilirlik (ihtiyaç anında ulaşılabilir mi).",
    "Her olay farklı bir ilkeyi öne çıkarır; saldırı olmasa bile hata veya arıza bu ilkeleri ihlal edebilir.",
    "Hash, bütünlüğü doğrulamak için kullanılan temel araçlardan biridir.",
    "Fiziksel, dijital ve yönetimsel kontroller birlikte çalıştığında koruma bütünsel olur.",
  ],
};
