import { q } from "../../helpers";
import type { Lesson } from "../../types";

export const lesson08: Lesson = {
  id: 8,
  title: "Etik Kurallar ve Yasal Sorumluluklar",
  subtitle: "Yetki, sorumlu ifşa, kişisel veriler ve Türkiye'deki temel çerçeve",
  goal: "Güvenlik bilgisinin yalnızca yetki, etik ve yasal sınırlar içinde kullanılması gerektiğini kavramak; gerçek hayata benzeyen kararlarda doğru ve sorumlu davranışı seçebilmek.",
  outcomes: [
    "Yetkilendirme ve izinsiz erişim kavramlarını açıklayabilirsin.",
    "Sorumlu ifşa ve bug bounty süreçlerinin nasıl işlediğini anlatabilirsin.",
    "KVKK ve TCK 243-245'in genel çerçevesini tanıyabilirsin.",
    "Etik ikilem içeren bir durumda güvenli ve sorumlu yolu seçebilirsin.",
  ],
  minutes: 35,
  topics: [
    {
      title: "Siber güvenlik etiği",
      en: "Cybersecurity Ethics",
      simple:
        "Güvenlik bilgisi güçlü bir bilgidir; bir kapıyı kilitlemeyi bilen kişi, aynı bilgiyle kilidi açmayı da bilebilir. Bu yüzden bu alanda doğru teknik bilgi kadar doğru karar vermek de önemlidir. Etik, “yapabiliyor olmak” ile “yapmalı mıyım?” arasındaki farktır.",
      technical:
        "Temel etik ilkeler: zarar vermemek, yetki içinde kalmak, gizliliğe saygı göstermek, bulguları sorumlu şekilde paylaşmak, dürüst raporlama yapmak ve çıkar çatışmalarından kaçınmak. Meslek kuruluşlarının etik kodları (örneğin ISC2 ve ISACA'nın etik kuralları) benzer ilkeleri içerir. Etik yalnızca kişisel bir değer değil, mesleğin güvenilirliğini sağlayan ortak bir sözleşmedir.",
      example:
        "Bir güvenlik uzmanı, çalıştığı şirketin sistemlerinde herkesin parolalarını görebilecek bir yetkiye sahip olabilir. Merak nedeniyle bakmak teknik olarak mümkündür; ama etik değildir ve çoğu zaman kurum politikasına aykırıdır.",
    },
    {
      title: "Yetkilendirme ve izinsiz erişim",
      en: "Authorization and Unauthorized Access",
      simple:
        "Yetki, bir sisteme veya veriye erişmek için sahibinden alınmış izindir. İzin yoksa niyet iyi olsa bile erişim izinsizdir. “Sadece bakmak istedim” veya “zaten korumasızdı” gibi gerekçeler izin yerine geçmez.",
      technical:
        "Güvenlik testlerinde yetki yazılı, kapsamı belli ve taraflarca imzalı olmalıdır: hangi sistemler, hangi tarihler, hangi yöntemler dahil veya hariç? Yetkisiz erişim; parola tahmin etmek, başkasının hesabını kullanmak, kapsam dışına çıkmak veya bir açığı kullanarak sisteme girmeyi içerir. Açığın internetten görünür olması, erişim için izin verildiği anlamına gelmez.",
      example:
        "Bir arkadaşın “sitemi test et” demesi sözlü bir ifade olabilir, ancak site sunucusu üçüncü bir hosting firmasına ait olabilir. Yazılı izin ve kapsam netliği, hem seni hem karşı tarafı korur.",
    },
    {
      title: "Sorumlu güvenlik araştırması, Responsible Disclosure ve Bug Bounty",
      en: "Responsible Disclosure and Bug Bounty",
      simple:
        "Bir açık gördüğünde en doğru davranış, açığı kullanmadan, ilgili kuruma bildirmek ve düzeltilmesine zaman tanımaktır. Bazı kurumlar bunun için resmi programlar işletir; bu programlara bug bounty denir ve bulguya göre ödül verebilir.",
      technical:
        "Sorumlu ifşa (responsible disclosure) süreci: açığı kanıtlamak için gerekli en az çabayla doğrula, kişisel veriye erişme veya veriyi indirme, sahibine güvenli bir kanalla bildir, makul bir süre tanı, düzeltme sonrası (ve izin varsa) yayınla. Koordineli ifşa (coordinated disclosure) terimi de benzer yaklaşımı ifade eder. Bug bounty programlarında kapsam, kurallar ve güvenli liman (safe harbor) şartları yazılı olarak belirtilir; bu kurallara uymak yasal güvence açısından kritiktir. Kurumun güvenlik bildirimi için kullandığı security.txt dosyası bildirim kanalını bulmayı kolaylaştırabilir.",
      example:
        "Bir araştırmacı, bir şirketin bug bounty kapsamındaki uygulamasında açık bulur. Kural gereği yalnızca kendi test hesabını kullanır, başka kullanıcının verisini görmez, bulguyu program üzerinden bildirir ve ödül kazanır. Aynı açığın kapsam dışı bir sistemde test edilmesi ise kuralları ihlal eder.",
    },
    {
      title: "Kişisel verilerin korunması ve KVKK",
      en: "Personal Data Protection",
      simple:
        "Kişisel veri, bir kişiyi doğrudan veya dolaylı olarak tanımlayan her türlü bilgidir: ad, telefon, adres, e-posta, kimlik numarası, konum, sağlık bilgisi gibi. Türkiye'de bu verilerin nasıl toplanıp kullanılacağını Kişisel Verilerin Korunması Kanunu (KVKK, 6698 sayılı Kanun) düzenler.",
      technical:
        "KVKK'da temel kavramlar: veri sorumlusu (verinin işlenme amacını belirleyen), veri işleyen, açık rıza, aydınlatma yükümlülüğü ve ilgili kişinin hakları. Kanun, kişisel verilerin hukuka uygun, belirli amaçlarla, ölçülü işlenmesini ve güvenliğinin sağlanmasını bekler. Veri ihlali durumunda veri sorumlusunun, Kişisel Verileri Koruma Kurumu'na (Kurul) mümkün olan en kısa sürede ve Kurul kararına göre en geç 72 saat içinde bildirim yükümlülüğü vardır. Özel nitelikli veriler (sağlık, biyometrik vb.) daha sıkı korunur. Güvenlik uzmanı için çıkarım: test ve analiz sırasında karşılaşılan kişisel veriye gereksiz erişilmez, kopyalanmaz ve paylaşılmaz.",
      example:
        "Bir sızma testi sırasında müşteri veri tabanına erişilebildiği görülür. Doğru yaklaşım, kayıtları indirmek veya incelemek değil; erişimin mümkün olduğunu en az örnekle (ör. kişisel veri içermeyen kanıtla veya maskelenmiş ekran görüntüsüyle) kanıtlamak ve hemen bildirmektir.",
    },
    {
      title: "Dijital delillerin korunması",
      en: "Preserving Digital Evidence",
      simple:
        "Bir olay olduğunda dijital izler hem olayı anlamak hem de gerektiğinde hukuki süreçlere destek olmak için değerlidir. Bu izler kolay değişebilir veya silinebilir, bu yüzden dikkatli davranmak gerekir.",
      technical:
        "Temel ilkeler: Delili değiştirmemek, kopya üzerinde çalışmak, her işlemi tarih-saat ve kişi bilgisiyle kayda geçirmek (chain of custody), orijinal delilin hash değerini almak ve delilleri yetkisiz erişimden korumak. Bilgisayarı kapatmak veya yeniden başlatmak bellekteki geçici bilgileri kaybettirebilir; bu nedenle önce kurum prosedürü veya yetkili ekip yönlendirmesi izlenir. Hukuki süreçlerde delilin güvenilirliği, toplama yöntemine bağlıdır.",
      example:
        "Bir çalışan bilgisayarda şüpheli dosyalar fark eder. Dosyaları silip temizlemek yerine bilgisayarı ağdan ayırır ve güvenlik ekibine haber verir. Ekip disk görüntüsü alıp hash değerini kaydeder; böylece olay hem incelenebilir hem de gerekirse resmi süreçte kullanılabilir olur.",
    },
    {
      title: "Türkiye'deki ilgili düzenlemelere giriş: TCK 243, 244 ve 245",
      en: "Introduction to Turkish Legal Framework",
      simple:
        "Türk Ceza Kanunu'nda bilişim alanıyla ilgili suçlar “Bilişim Alanında Suçlar” bölümünde düzenlenmiştir. Bu bölüm; izinsiz sisteme girmeyi, sistemi bozmayı veya verileri değiştirmeyi, banka ve kredi kartlarının kötüye kullanılmasını kapsar.",
      technical:
        "Genel çerçeve: TCK madde 243 “Bilişim sistemine girme” (bir bilişim sisteminin bütününe veya bir kısmına hukuka aykırı olarak girmek ve orada kalmaya devam etmek). TCK madde 244 “Sistemi engelleme, bozma, verileri yok etme veya değiştirme” (sistemin işleyişini engellemek, verileri bozmak, yok etmek veya değiştirmek). TCK madde 245 “Banka veya kredi kartlarının kötüye kullanılması”. Cezaların türü ve miktarı, ağırlaştırıcı ve hafifletici haller maddelerde ayrıntılı olarak düzenlenmiştir ve mevzuat değişebilir. Ayrıca ülkemizde siber güvenliğe ilişkin kurumsal yapıyı düzenleyen yeni mevzuat da gündemdedir. Bu bölümdeki bilgiler yalnızca eğitim amaçlı genel bilgilendirmedir; hukuki danışmanlık değildir. Somut bir olayda yetkili bir avukata veya ilgili kuruma başvurmalısın.",
      example:
        "“Sadece göstermek istedim” diyerek bir kurumun yönetim paneline parola tahmin ederek giren kişi, niyeti iyi olsa bile izinsiz erişim yapmış olur. Aynı faaliyet, yazılı izinle yapılan bir sızma testinde olağan ve meşru bir çalışmadır. Fark teknikten değil yetkiden gelir.",
    },
  ],
  examples: [
    {
      title: "İyi niyet izin yerine geçmez",
      text: "Bir öğrenci, üniversitesinin bir bilgi sisteminde zayıf bir parola ile yönetim paneline girilebildiğini fark eder. “Sadece göstermek için” içeri girer ve ekran görüntüsü alır. Niyeti iyi olsa da bu, izinsiz erişim sayılabilir.",
      takeaway: "Doğru yol, açığı denemeden, resmi bildirim kanalıyla bildirmektir.",
    },
    {
      title: "Bug bounty ile yasal çerçeve",
      text: "Bir teknoloji şirketi, güvenlik araştırmacılarını kapsamı ve kuralları belli bir programa davet eder. Araştırmacı kurallara uyar, bulgusunu bildirir ve ödül alır.",
      takeaway: "Yetkilendirme bir formalite değil, güvenli ve yasal çalışmanın temelidir.",
    },
  ],
  concepts: [
    { term: "Yetkilendirme", en: "Authorization", definition: "Bir sisteme veya veriye erişim için sahibinden alınmış izin." },
    { term: "Sorumlu ifşa", en: "Responsible disclosure", definition: "Bulunan açığın kamuya açıklanmadan önce ilgili kuruma bildirilmesi ve düzeltme için süre tanınması." },
    { term: "Bug bounty", en: "Bug bounty", definition: "Kurumların belirli kapsam ve kurallar dahilinde zafiyet bildirimine ödül verdiği program." },
    { term: "KVKK", en: "Personal Data Protection Law", definition: "Türkiye'de kişisel verilerin işlenmesini ve korunmasını düzenleyen 6698 sayılı Kanun." },
    { term: "Delil zinciri", en: "Chain of custody", definition: "Bir delilin toplanmasından sunulmasına kadar kimin, ne zaman, ne yaptığının kayıt altına alınması." },
    { term: "Kapsam", en: "Scope", definition: "Bir güvenlik testinde izin verilen sistemleri, zamanı ve yöntemleri belirleyen çerçeve." },
  ],
  activity: {
    type: "scenario",
    title: "Etik karar laboratuvarı",
    intro:
      "Gerçek hayata benzeyen beş durumla karşılaşacaksın. Her durumda bir karar seç. Seçeneklerin etik ve hukuki açıdan neden doğru ya da riskli olduğunu oku. Diğer seçenekleri de deneyerek farkı incele. (Genel bilgilendirme amaçlıdır; hukuki danışmanlık değildir.)",
    scenarios: [
      {
        id: "found-vuln",
        title: "1. İzinsiz keşfedilen açık",
        context: "Bir web sitesinde güvenlik açığı keşfettin. Site sahibinden herhangi bir izin almadın.",
        steps: [
          {
            prompt: "Nasıl hareket etmelisin?",
            choices: [
              { text: "Açığı daha fazla kullanmadan, site sahibine veya resmi bildirim kanalına bulduğunu iletirim", verdict: "best", feedback: "Doğru. Sorumlu ifşa yaklaşımı budur: açığı sömürmeden, minimum bilgiyle ilgili kuruma bildirmek. Açığın detaylarını yalnızca sahibine ve güvenli kanaldan paylaşmak, kullanıcıları korur.", concept: "Sorumlu ifşa: bul, kullanma, bildir, düzeltme için süre tanı." },
              { text: "Açığın nasıl çalıştığını görmek için veri tabanına girip kayıtlara bakarım", verdict: "poor", feedback: "Riskli. Yetkin olmadan sisteme girmek izinsiz erişim sayılabilir ve kişisel verilere erişmek KVKK açısından da ciddi sorun yaratır. Açığın varlığını kanıtlamak için veriye erişmek gerekmez.", concept: "Yetki olmadan erişim, niyet ne olursa olsun risklidir." },
              { text: "Açığı sosyal medyada paylaşıp siteyi uyarırım", verdict: "poor", feedback: "Riskli. Açığı kamuya duyurmak, düzeltilmeden önce kötü niyetli kişilerin de bunu kullanmasına yol açar ve kullanıcılara zarar verebilir.", concept: "Kamuya açıklama, düzeltme yapıldıktan sonra ve koordineli şekilde olmalıdır." },
              { text: "Görmezden gelirim; ben bir şey yapmasam sorun olmaz", verdict: "acceptable", feedback: "Hukuki açıdan risksiz görünse de kullanıcıların riskte kalmasına izin verir. Güvenli bir bildirim kanalı varsa bildirmek daha sorumlu bir davranıştır.", concept: "Bildirmek, ekosisteme katkıdır; ancak hiçbir zorunluluk yok ve iyi niyetli kişinin kendini hukuki risklere karşı da düşünmesi gerekir." },
            ],
          },
        ],
      },
      {
        id: "bounty-scope",
        title: "2. Bug bounty kapsamı",
        context: "Bir şirketin bug bounty programına katıldın. Kapsamda yalnızca “app.ornek.com” yer alıyor. Test ederken, kapsam dışındaki “admin.ornek.com” adresinde de benzer bir açık olabileceğini düşünüyorsun.",
        steps: [
          {
            prompt: "Ne yaparsın?",
            choices: [
              { text: "Kapsam dışı sistemde test yapmadan, şüphemi ve gözlemimi programa not olarak iletirim ve kapsam konusunda soru sorarım", verdict: "best", feedback: "Doğru. Kapsam, yasal güvencenin sınırıdır. Kapsam dışındaki sistemi test etmeden, şüpheni kanıtsız olarak iletmek ve program sahibinden netlik istemek en güvenli ve sorumlu yoldur.", concept: "Kapsam dışına çıkmak, yasal korumanın dışına çıkmak demektir." },
              { text: "Hızlıca test ederim; zaten aynı şirkete ait", verdict: "poor", feedback: "Riskli. Aynı şirkete ait olması kapsam anlamına gelmez. Kapsam dışı sistemde test yapmak izinsiz erişim olabilir ve program kurallarını ihlal eder.", concept: "Aynı şirket olması otomatik izin vermez; izin kapsam belgesiyle verilir." },
              { text: "Programa hiç bahsetmeden yalnızca kendi notlarımda saklarım", verdict: "acceptable", feedback: "Bir zarar vermez ama olası bir güvenlik sorununun ilgililere ulaşmamasına neden olur. Kapsam konusunda soru sorarak bildirmek daha yapıcıdır.", concept: "İletişim kurmak, hem güvenliği hem sınırları netleştirir." },
            ],
          },
        ],
      },
      {
        id: "exposed-db",
        title: "3. Herkese açık veri tabanı",
        context: "Güvenlik araştırması yaparken, internete tamamen açık ve parolasız bir veri tabanı buldun. İçinde binlerce kişinin ad, telefon ve adres bilgisi var gibi görünüyor.",
        steps: [
          {
            prompt: "Nasıl ilerlersin?",
            choices: [
              { text: "Kayıtları incelemeden ve kopyalamadan, açığın varlığını kanıtlayan en az bilgiyle sahibini veya yetkili kurumu bilgilendiririm", verdict: "best", feedback: "Doğru. Kişisel veriye gereksiz erişim hem mahremiyeti ihlal eder hem sana hukuki sorumluluk yükleyebilir. Minimum kanıtla bildirim yapmak sorumlu yaklaşımdır. Sahibine ulaşamıyorsan ilgili ulusal olay müdahale yapılarına bildirim bir seçenektir.", concept: "Kişisel veriye erişim ve kopyalama ihtiyacı yoksa yapılmaz (veri minimizasyonu)." },
              { text: "Verinin bir kopyasını alıp ‘kanıt olsun’ diye saklarım", verdict: "poor", feedback: "Riskli. Kişisel verileri kopyalamak, onları korumasız bir ortama taşımak ve saklamak ciddi KVKK ve hukuki risk doğurur. Kanıt için veri kopyalamak gerekmez.", concept: "Kanıt, zarar verici olmamalı: maskeli ekran görüntüsü yeterlidir." },
              { text: "Veri tabanındaki bilgileri tanıdıklarımın verisi var mı diye kontrol ederim", verdict: "poor", feedback: "Riskli ve etik dışı. Merak, kişisel verilere erişmeyi haklı kılmaz; bu kişilerin mahremiyetini doğrudan ihlal eder.", concept: "Merak, yetki yerine geçmez." },
              { text: "Veri tabanını bir forumda duyurur ve herkesin bakmasını sağlarım", verdict: "poor", feedback: "Çok riskli. Bu davranış, veri sahiplerini doğrudan mağdur eder ve hukuki sorumluluk doğurur.", concept: "Kişisel verilerin yayılması geri döndürülemez zarar verir." },
            ],
          },
        ],
      },
      {
        id: "evidence",
        title: "4. Şüpheli dosya ve delil",
        context: "Bir şirkette çalışıyorsun ve bir iş arkadaşının bilgisayarında kurum dışına veri aktaran şüpheli bir program olduğunu fark ettin.",
        steps: [
          {
            prompt: "İlk adımın ne olmalı?",
            choices: [
              { text: "Bilgisayara müdahale etmeden, kurumun güvenlik ekibine veya yöneticine bildiririm; kanıtların korunmasını sağlarım", verdict: "best", feedback: "Doğru. Delilin değişmemesi ve süreci doğru yönetebilecek kişilere iletilmesi önemlidir. Kendi başına inceleme, hem delilleri bozabilir hem de yetkisiz işlem sayılabilir.", concept: "Delil bütünlüğü ve yetkili kişilerle iletişim." },
              { text: "Programı hemen silerim; bu şekilde sorun biter", verdict: "poor", feedback: "Riskli. Silme işlemi delilleri yok eder; olayın boyutunu ve kaynağını anlamayı zorlaştırır.", concept: "Kanıtları silmek, kök neden analizini imkânsız kılar." },
              { text: "Bilgisayarın içindeki dosyaları kendi USB belleğime kopyalayıp incelerim", verdict: "poor", feedback: "Riskli. Yetkin olmadan bir başkasının cihazından veri almak izinsiz erişim olabilir ve delil zincirini bozar.", concept: "Yetkisiz kopyalama hem etik hem hukuki sorundur." },
              { text: "İş arkadaşıma doğrudan sorarım", verdict: "acceptable", feedback: "Kısmen makul gibi görünse de, olay kasıtlıysa delillerin silinmesine yol açabilir. Önce güvenlik ekibine bildirim yapmak daha güvenlidir.", concept: "Önce yetkili kanal, sonra gerekirse iletişim." },
            ],
          },
        ],
      },
      {
        id: "verbal-permission",
        title: "5. Sözlü izin",
        context: "Bir arkadaşın küçük işletmesi için web sitesi yaptı. Sana “güvenliğine bir bak” dedi. Sitenin barındırma hizmeti (hosting) ise üçüncü bir firma tarafından sağlanıyor.",
        steps: [
          {
            prompt: "Teste başlamadan önce ne yaparsın?",
            choices: [
              { text: "Kapsamı (hangi adresler, hangi yöntemler, hangi tarihler) yazılı olarak netleştirir ve hosting firmasının politikasını da kontrol ederim", verdict: "best", feedback: "Doğru. Yazılı kapsam, hem seni hem arkadaşını korur. Üçüncü taraf altyapı olduğunda, onların kuralları da dikkate alınmalıdır.", concept: "Yetki yazılı ve kapsam net olmalı; üçüncü taraf altyapıları unutma." },
              { text: "Sözlü izin yeterli; hemen tüm araçlarla taramaya başlarım", verdict: "poor", feedback: "Riskli. Sözlü izin ispat edilemez ve üçüncü taraf altyapıya zarar verebilecek testler başka sorunlar doğurabilir.", concept: "Belirsiz izin, belirsiz sorumluluk demektir." },
              { text: "Sadece siteyi bir kullanıcı gibi gezip gözlemlerim, kullanıcıya açık özellikler dışında hiçbir şey denemem", verdict: "acceptable", feedback: "Düşük riskli bir başlangıç. Ancak güvenlik değerlendirmesi için gerçek bir test yapılacaksa yazılı kapsam yine gereklidir.", concept: "Pasif gözlem ile aktif test arasında önemli bir fark vardır." },
            ],
          },
        ],
      },
    ],
  },
  quiz: [
    q("l8q1", "Siber güvenlik etiği", "“Teknik olarak yapabiliyorum” gerekçesi neden etik açıdan yeterli değildir?", [
      "Çünkü teknik beceriler önemsizdir",
      "Çünkü yapabilmek, yapma hakkı veya izni olduğu anlamına gelmez",
      "Çünkü etik sadece yaşlılar içindir",
      "Çünkü bilgisayarlar zaten güvenlidir",
    ], 1, "Güvenlik bilgisi güçlü bir yetenektir. Hangi durumda kullanılacağını belirleyen şey yetki ve etiktir."),
    q("l8q2", "Yetkilendirme ve izinsiz erişim", "Bir web sitesine kimlik doğrulaması gerektirmeyen bir açık yüzünden girebilmen ne anlama gelir?", [
      "Erişim için izin aldığın anlamına gelir",
      "Sitenin sahibi senden özür dilemek zorundadır",
      "Teknik olarak erişilebilir olması izin verildiği anlamına gelmez",
      "Her türlü veriyi indirmek serbest hale gelir",
    ], 2, "Yetki, sistem sahibinin açık izniyle verilir. Teknik olarak erişebilmek tek başına izin sayılmaz."),
    q("l8q3", "Sorumlu güvenlik araştırması, Responsible Disclosure ve Bug Bounty", "Sorumlu ifşa sürecinde en doğru adım dizisi hangisidir?", [
      "Açığı kamuya duyur, sonra şirketi uyar",
      "Açığı sat, sonra bildir",
      "Açığı en az çabayla doğrula, güvenli kanaldan sahibine bildir, düzeltme için süre tanı",
      "Açığı kullanıp kanıt topla, sonra sil",
    ], 2, "Sorumlu ifşa kullanıcıları korumayı ve açığın düzeltilmesini amaçlar. Kamuya erken duyurmak veya sömürmek bu amaca aykırıdır."),
    q("l8q4", "Kişisel verilerin korunması ve KVKK", "Bir test sırasında müşteri veri tabanına erişebildiğini fark ettin. Hangisi en uygun davranıştır?", [
      "Kayıtları indirip arşivlemek",
      "Kayıtlara göz atıp neler olduğunu görmek",
      "Erişimin mümkün olduğunu minimum kanıtla belgeleyip hemen bildirmek",
      "Hiçbir şey belgelemeden sessizce çıkıp gitmek",
    ], 2, "Kişisel verilere gereksiz erişim ve kopyalama hem etik hem yasal risk yaratır. Amaç, açığın varlığını en az veriyle kanıtlamaktır."),
    q("l8q5", "Dijital delillerin korunması", "Şüpheli bir zararlı yazılım bulduğun bilgisayarla ilgili aşağıdakilerden hangisi delil korunması açısından en doğru yaklaşımdır?", [
      "Bilgisayarı formatlamak",
      "Dosyaları silip temizlemek",
      "Cihazı ağdan ayırmak (kurum prosedürüne uygun) ve yetkili ekibe haber vermek, işlemleri kayıt altına almak",
      "Bilgisayarı hemen başkasına vermek",
    ], 2, "Delilin bozulmaması, yayılımın durdurulması ve yetkili ekibin yönlendirmesi doğru yaklaşımdır. Kayıt tutmak delil zincirini destekler."),
  ],
  summary: [
    "Güvenlik bilgisi, yalnızca yetki, etik ve yasal sınırlar içinde kullanılmalıdır.",
    "Yetki yazılı, kapsamı net ve sistem sahibinin izniyle verilir; teknik erişilebilirlik izin değildir.",
    "Sorumlu ifşa: açığı sömürmeden, güvenli kanaldan bildir ve düzeltme için süre tanı. Bug bounty bu sürecin kurallı biçimidir.",
    "KVKK kişisel verilerin korunmasını düzenler; testlerde kişisel veriye gereksiz erişilmez.",
    "Dijital deliller değiştirilmeden korunmalı; TCK 243-245 bilişim suçlarına ilişkin genel çerçeveyi sunar (hukuki danışmanlık değildir).",
  ],
};
