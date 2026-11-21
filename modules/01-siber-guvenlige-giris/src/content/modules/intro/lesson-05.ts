import { q } from "../../helpers";
import type { Lesson } from "../../types";

export const lesson05: Lesson = {
  id: 5,
  title: "Red Team, Blue Team ve Purple Team",
  subtitle: "Saldıran, savunan ve ikisini birleştiren ekipler",
  goal: "Güvenlik ekiplerinin rollerini ayırt etmek; saldırı simülasyonu ve savunma operasyonlarının birbirini nasıl güçlendirdiğini ve kurumlarda bu yapıların neden izinli, planlı ve ortak bir hedef için çalıştığını anlamak.",
  outcomes: [
    "Red, Blue ve Purple Team'in görevlerini ayırt edebilirsin.",
    "Yetkili saldırı simülasyonunun neden gerekli olduğunu açıklayabilirsin.",
    "Bir kurum senaryosunda görevi doğru ekiple eşleştirebilirsin.",
    "Ekipler arası iş birliğinin neden önemli olduğunu anlatabilirsin.",
  ],
  minutes: 30,
  topics: [
    {
      title: "Red Team nedir?",
      en: "Red Team",
      simple:
        "Bir kalenin savunmasını test etmek için kale sahibinin izniyle “saldıran” rolü oynayan ekip düşün. Red Team, kurumun gerçek bir saldırgana karşı ne kadar dayanıklı olduğunu görmek için, önceden izin alınmış kapsam içinde saldırgan gibi düşünür ve davranır.",
      technical:
        "Red Team çalışmaları; hedef belirleme, bilgi toplama, ilk erişim, yetki yükseltme ve hedefe ulaşma gibi gerçek saldırı aşamalarını taklit eder (adversary emulation). Sızma testinden (penetration test) farkı, daha geniş kapsamlı, daha gizli ve hedef odaklı olmasıdır: amaç tüm açıkları listelemek değil, “saldırgan hedefine ulaşabilir mi, savunma bunu fark eder mi?” sorusunu cevaplamaktır. Her çalışma yazılı yetki ve kurallar (Rules of Engagement) çerçevesinde yürütülür.",
      example:
        "Bir banka, Red Team'den “müşteri veri tabanına ulaşmayı deneyin” görevini ister. Ekip önce sahte bir e-posta kampanyasıyla bir çalışanın bilgisayarına erişmeyi dener, ardından ağda ilerler. Sonuçta banka, hangi aşamada tespit edildiğini ve hangi aşamalarda görünmez kaldığını öğrenir.",
    },
    {
      title: "Blue Team nedir?",
      en: "Blue Team",
      simple:
        "Blue Team, kurumu her gün savunan ekiptir. Alarmları izler, sistemleri güncel tutar, şüpheli durumlara müdahale eder. Kale örneğinde nöbet tutan, surları güçlendiren ve saldırıyı fark eden kişilerdir.",
      technical:
        "Blue Team görevleri: güvenlik izleme (SOC), log analizi, SIEM ve EDR yönetimi, zafiyet ve yama yönetimi, olay müdahalesi, tespit kuralı geliştirme (detection engineering), yapılandırma sertleştirme ve çalışan farkındalığı. Başarı ölçütleri arasında tespit süresi (MTTD) ve müdahale süresi (MTTR) gibi metrikler bulunur. Blue Team çalışması bir proje değil, süreklilik gerektiren operasyondur.",
      example:
        "Gece 03:00'te EDR bir çalışan bilgisayarında olağan dışı bir PowerShell çalıştırıldığını bildirir. Nöbetçi analist uyarıyı inceler, bilgisayarı ağdan izole eder, ilgili logları toplar ve olay kaydı açar. Bu, Blue Team'in günlük işine bir örnektir.",
    },
    {
      title: "Purple Team nedir?",
      en: "Purple Team",
      simple:
        "Kırmızı ve mavi karışınca mor olur. Purple Team bir “üçüncü ekip” olmaktan çok, Red ve Blue Team'in birlikte çalışma biçimidir. Saldıran ekip ne yaptığını savunan ekibe gösterir, savunan ekip neyi görüp neyi göremediğini söyler; böylece ikisi birlikte öğrenir.",
      technical:
        "Purple Team yaklaşımında saldırı teknikleri tek tek uygulanır (genellikle MITRE ATT&CK gibi bir çerçeveyle eşlenir), her adımda savunma sistemlerinin alarm üretip üretmediği kontrol edilir. Alarm yoksa tespit kuralı yazılır veya geliştirilir ve test tekrarlanır. Böylece rapor yazıp bitirmek yerine savunma anında iyileştirilir. Bu yöntem, ekipler arasındaki bilgi kopukluğunu azaltmak için tercih edilir.",
      example:
        "Red Team, “parola karma değerlerini bellekten çıkarma” tekniğini uygular. Blue Team, SIEM'de hiçbir alarm oluşmadığını fark eder. İki ekip birlikte yeni bir tespit kuralı yazar ve teknik tekrar denenir; bu kez alarm oluşur. Boşluk aynı gün kapanır.",
    },
    {
      title: "Saldırı simülasyonu, savunma operasyonları ve güvenlik testleri",
      en: "Attack Simulation, Defensive Operations and Security Testing",
      simple:
        "Güvenlik testleri, savunmanın gerçekten çalışıp çalışmadığını kontrol etmenin yoludur. Yangın alarmı olduğunu bilmek yetmez; çalıştığını denemek gerekir. Savunma operasyonları ise bu sistemlerin her gün çalışır halde tutulmasıdır.",
      technical:
        "Başlıca test türleri: zafiyet taraması (otomatik, geniş), sızma testi (belirli bir sistemde sömürülebilir açıkları elle doğrulama), Red Team çalışması (hedef odaklı, gizli senaryo) ve tatbikatlar (masa başı veya canlı). Güvenlik testlerinin ortak şartı yazılı yetkilendirme, kapsam tanımı, iletişim kanalları ve “neyin yapılmayacağı”nın net belirlenmesidir. Aksi halde test, izinsiz erişim sayılabilir (Ders 08).",
      example:
        "Bir hastane sızma testi yaptırırken hasta kayıt sistemini kapsam dışı bırakır; çünkü kesinti riski kabul edilemezdir. Test ekibi bu sınırı yazılı olarak kabul eder. Kapsam, testin hem etkili hem güvenli olmasını sağlar.",
    },
    {
      title: "Ekiplerin birbirleriyle ilişkisi ve gerçek kurumlarda kullanım",
      en: "Team relationships in real organizations",
      simple:
        "Ekipler birbirinin rakibi değil, aynı hedef için çalışan takım arkadaşlarıdır: kurumu güvende tutmak. Küçük kurumlarda bu roller çoğu zaman tek bir kişi veya dış hizmet sağlayıcıda toplanır; büyük kurumlarda ise ayrı ekipler vardır.",
      technical:
        "Olgun kurumlar Red/Blue/Purple çalışmasını döngü olarak yürütür: Red Team test eder, Blue Team tespit ve müdahale yeteneğini geliştirir, bulgular Purple çalışmasıyla kalıcı iyileştirmeye dönüşür. Çalışmalar kurum yönetiminin bilgisi ve onayıyla yapılır. Bulgular suçlayıcı değil öğretici biçimde raporlanır. Küçük kurumlar bu işlerin bir kısmını dış hizmet sağlayıcılardan alabilir (örneğin yönetilen SOC veya yıllık sızma testi).",
      example:
        "Orta ölçekli bir yazılım şirketi yılda bir kez dış bir firmaya sızma testi yaptırır (Red benzeri), kendi BT ekibi günlük izleme yapar (Blue) ve test sonrası bulgular birlikte değerlendirilir (Purple). Üç ayrı kadro olmadan da üç işlev yerine getirilebilir.",
    },
  ],
  examples: [
    {
      title: "Kimlik avı tatbikatı",
      text: "Bir şirket, güvenlik ekibinin yönetim izniyle çalışanlara sahte bir kimlik avı e-postası gönderir. Kaç kişinin tıkladığı ve kaç kişinin bildirdiği ölçülür. Tıklayanlar cezalandırılmaz; onlara kısa bir eğitim içeriği gösterilir.",
      takeaway: "Amaç kimseyi yakalamak değil, kurumun gerçek riskini ölçmek ve farkındalığı artırmaktır.",
    },
    {
      title: "Tespit boşluğunun kapatılması",
      text: "Purple Team çalışmasında 12 saldırı tekniği denendi; 5'i için alarm üretilmedi. Aynı hafta içinde 5 yeni tespit kuralı yazıldı ve tekrar test edildi.",
      takeaway: "Bulguyu rapor olarak bırakmak yerine hemen düzeltmek savunmayı hızlandırır.",
    },
  ],
  concepts: [
    { term: "Red Team", en: "Red Team", definition: "Yetkili kapsam içinde gerçek saldırganı taklit ederek kurumun savunmasını test eden ekip." },
    { term: "Blue Team", en: "Blue Team", definition: "Kurumu günlük olarak izleyen, savunan ve olaylara müdahale eden ekip." },
    { term: "Purple Team", en: "Purple Team", definition: "Red ve Blue Team'in birlikte çalışarak tespit ve savunmayı anında geliştirdiği yaklaşım." },
    { term: "Sızma testi", en: "Penetration test", definition: "Belirli bir sistemdeki açıkları, izinli ve kontrollü biçimde elle doğrulama çalışması." },
    { term: "Kurallar ve kapsam", en: "Rules of Engagement", definition: "Bir güvenlik testinde neyin, ne zaman ve nasıl yapılabileceğini belirleyen yazılı çerçeve." },
    { term: "MITRE ATT&CK", en: "MITRE ATT&CK", definition: "Saldırgan tekniklerinin sistematik bir şekilde sınıflandırıldığı açık bilgi tabanı." },
  ],
  activity: {
    type: "explore-match",
    title: "Ekip kartları ve görev eşleştirme",
    intro:
      "Önce üç ekibi incele. Ardından Meridyen Bankası senaryosundaki görevleri doğru ekiple eşleştir.",
    cardsTitle: "1. Ekipleri incele",
    cards: [
      {
        id: "red",
        name: "Red Team",
        en: "Offense / Saldırı simülasyonu",
        tagline: "Yetkili saldırgan: kurumun gerçek dayanıklılığını test eder.",
        points: [
          "Gerçek saldırganın yöntemlerini taklit eder (adversary emulation)",
          "Yazılı yetki ve belirlenmiş kapsam içinde çalışır",
          "Sosyal mühendislik, ağ sızma ve fiziksel güvenlik testleri yapabilir",
          "Çıktısı: ne yapılabildiği, nerede görüldüğü, nerede görülmediği",
        ],
        example: "Banka çalışanlarına izinli kimlik avı kampanyası yürütüp ağ içinde ilerleyebiliyor mu diye denemek.",
        mini: {
          story: "Red Team çalışmasında çalışan bir e-postadaki bağlantıya tıkladı.",
          question: "Bu çalışanın hata yaptığı sonucu mu çıkarılmalı?",
          answer: "Hayır. Amaç kişiyi suçlamak değil, kurumun savunma katmanlarının (e-posta filtreleri, uç nokta koruma, eğitim) yeterli olup olmadığını görmektir.",
        },
      },
      {
        id: "blue",
        name: "Blue Team",
        en: "Defense / Savunma",
        tagline: "Günlük savunucu: izler, önler, tespit eder, müdahale eder.",
        points: [
          "SIEM, EDR ve log izleme ile 7/24 operasyon yürütür",
          "Yama yönetimi ve yapılandırma sertleştirme yapar",
          "Olay müdahale planlarını hazırlar ve tatbikat yapar",
          "Tespit süresini (MTTD) ve müdahale süresini (MTTR) kısaltmaya çalışır",
        ],
        example: "Gece EDR uyarısını inceleyip şüpheli bilgisayarı ağdan izole etmek.",
        mini: {
          story: "Blue Team, Red Team'in testi sırasında hiçbir alarm üretmedi.",
          question: "Bu, savunmanın başarısız olduğu anlamına mı gelir?",
          answer: "Bu bir tespit boşluğu bulgusudur. Başarısızlık değil, iyileştirme fırsatıdır; çünkü şimdi hangi teknik için alarm eksik olduğu biliniyor.",
        },
      },
      {
        id: "purple",
        name: "Purple Team",
        en: "Collaboration / İş birliği",
        tagline: "Köprü: saldırı ve savunmayı birlikte geliştirir.",
        points: [
          "Saldırı tekniklerini sırayla uygular, savunmanın tepkisini birlikte inceler",
          "Tespit kuralları yazar veya iyileştirir",
          "Teknikleri MITRE ATT&CK gibi çerçevelerle eşler",
          "Bulguları rapora gömmek yerine anında düzeltmeyi hedefler",
        ],
        example: "Red Team'in yaptığı tekniği birlikte tekrar edip, SIEM'de alarm oluşana kadar tespit kuralını geliştirmek.",
        mini: {
          story: "İki ekip aynı odada, her saldırı adımından sonra logları birlikte inceliyor.",
          question: "Bu çalışma biçiminin klasik Red Team raporundan farkı nedir?",
          answer: "Geri bildirim döngüsü anlıktır. Rapor beklemek yerine tespit boşlukları aynı çalışma içinde kapatılır ve yeniden test edilir.",
        },
      },
    ],
    match: {
      type: "match",
      title: "2. Meridyen Bankası: Görevi doğru ekiple eşleştir",
      intro:
        "Meridyen Bankası, yönetim onayıyla yıllık güvenlik değerlendirmesi yapıyor. Aşağıdaki her görevin hangi ekibe ait olduğunu seç.",
      categories: [
        { id: "red", label: "Red Team" },
        { id: "blue", label: "Blue Team" },
        { id: "purple", label: "Purple Team" },
      ],
      items: [
        { id: "m1", text: "Çalışanlara yönetim onaylı sahte kimlik avı e-postaları göndermek ve tıklama oranını ölçmek", answer: "red", explanation: "Gerçek saldırgan davranışını izinli şekilde taklit etmek Red Team işidir. Sonuç, eğitim ihtiyacını ve savunma katmanlarını değerlendirmek için kullanılır." },
        { id: "m2", text: "SIEM'deki alarmları 7/24 izleyip şüpheli girişleri araştırmak", answer: "blue", explanation: "Süreklilik gerektiren izleme ve olay inceleme, Blue Team'in (SOC) temel işidir." },
        { id: "m3", text: "Red Team'in kullandığı tekniğin neden alarm üretmediğini birlikte analiz edip yeni tespit kuralı yazmak", answer: "purple", explanation: "Saldırı ve savunma bilgisinin birleştirilip anında iyileştirme yapılması Purple Team yaklaşımıdır." },
        { id: "m4", text: "Güvenlik duvarı kurallarını sıkılaştırmak ve kritik yamaları yönetmek", answer: "blue", explanation: "Sistemleri sertleştirmek ve yama yönetimi savunma operasyonlarının sürekli parçalarıdır." },
        { id: "m5", text: "Yazılı kapsam içinde dış ağdan banka sistemlerine sızılıp müşteri verisine ulaşılabilir mi diye denemek", answer: "red", explanation: "Hedef odaklı, izinli saldırı simülasyonu Red Team çalışmasıdır." },
        { id: "m6", text: "Olay müdahale planını güncellemek ve çalışanlarla tatbikat yapmak", answer: "blue", explanation: "Hazırlık ve müdahale kapasitesi Blue Team sorumluluğundadır." },
        { id: "m7", text: "Saldırı tekniklerini MITRE ATT&CK ile eşleyip hangi tekniklerin görünmez kaldığını ölçmek", answer: "purple", explanation: "Teknik bazlı kapsama haritası çıkarmak ve boşlukları birlikte kapatmak tipik Purple Team çalışmasıdır." },
        { id: "m8", text: "Yetkili şekilde şube binasına sahte kimlikle girip girilemeyeceğini test etmek", answer: "red", explanation: "Fiziksel güvenlik testi, izinli şekilde yapıldığında Red Team kapsamındadır. İzin olmadan yapılırsa suç oluşturabilir." },
      ],
      reminder:
        "Hatırlatma: Üç ekip birbirinin rakibi değildir. Ortak hedef kurumu güçlendirmektir ve tüm saldırı simülasyonları yazılı yetki ile yapılır.",
    },
  },
  quiz: [
    q("l5q1", "Red Team nedir?", "Red Team çalışmasını diğer güvenlik faaliyetlerinden ayıran temel özellik nedir?", [
      "Yalnızca antivirüs güncellemesi yapması",
      "Yetkisiz olarak, gizlice sistemlere girmesi",
      "Sadece kullanıcı şifrelerini sıfırlaması",
      "Yazılı yetki ve kapsam içinde gerçek saldırgan davranışını taklit etmesi",
    ], 3, "Red Team çalışması izinlidir ve hedefe ulaşma yeteneğini ölçer. İzinsiz yapılırsa test değil, saldırı olur."),
    q("l5q2", "Blue Team nedir?", "Aşağıdakilerden hangisi tipik bir Blue Team görevidir?", [
      "SIEM alarmlarını izleyip şüpheli olayları araştırmak",
      "Çalışanlara sahte e-posta göndererek tıklama oranı ölçmek",
      "Yeni saldırı tekniklerini sistemlere karşı denemek",
      "Binaya yetkisiz giriş denemek",
    ], 0, "İzleme, tespit ve müdahale savunma tarafının günlük görevleridir. Diğer seçenekler saldırı simülasyonu işleridir."),
    q("l5q3", "Purple Team nedir?", "Purple Team yaklaşımının asıl değeri nedir?", [
      "Raporu daha uzun yazmak",
      "Saldırı ve savunma bilgisini birleştirerek tespit boşluklarını hızla kapatmak",
      "Red Team'i ortadan kaldırmak",
      "Blue Team'in iş yükünü tamamen devralmak",
    ], 1, "Purple yaklaşımı iki ekibin anlık geri bildirim döngüsüyle çalışmasını sağlar ve iyileştirmeyi hızlandırır."),
    q("l5q4", "Saldırı simülasyonu, savunma operasyonları ve güvenlik testleri", "Bir güvenlik testinin kendisinin suç sayılmaması için aşağıdakilerden hangisi şarttır?", [
      "Testin gece yapılması",
      "Testi yapan kişinin sistemi iyi tanıması",
      "Yazılı yetkilendirme ve net kapsam tanımı",
      "Testin sonuçlarının kimseye söylenmemesi",
    ], 2, "Yetki ve kapsam, test ile izinsiz erişim arasındaki en önemli farktır."),
    q("l5q5", "Ekiplerin birbirleriyle ilişkisi ve gerçek kurumlarda kullanım", "Küçük bir şirkette ayrı Red/Blue ekipleri yoksa en gerçekçi çözüm hangisidir?", [
      "Güvenlik testi yapmamak; çünkü ekip yok",
      "Test işlevini dış hizmet sağlayıcıdan almak, günlük izlemeyi BT ekibine veya yönetilen hizmete vermek",
      "Çalışanlardan rastgele birine hacker rolü vermek",
      "Yetkisiz kişilerden gizlice test etmelerini istemek",
    ], 1, "Roller ayrı ekipler olmadan da dış hizmetlerle yerine getirilebilir. Önemli olan işlevlerin ve yetkilendirmenin var olmasıdır."),
  ],
  summary: [
    "Red Team, yetkili kapsamda gerçek saldırganı taklit ederek kurumun dayanıklılığını test eder.",
    "Blue Team, kurumu günlük olarak izler, savunur ve olaylara müdahale eder.",
    "Purple Team bir yaklaşımdır: saldırı ve savunma bilgisi birleşir, tespit boşlukları hızla kapanır.",
    "Güvenlik testleri yazılı yetki, kapsam ve kurallar olmadan yapılamaz.",
    "Küçük kurumlar bu işlevleri dış hizmetlerle karşılayabilir; önemli olan işlevin yerine getirilmesidir.",
  ],
};
