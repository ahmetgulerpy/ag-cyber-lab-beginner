import { q } from "../../helpers";
import type { Lesson } from "../../types";

export const lesson04: Lesson = {
  id: 4,
  title: "Siber Güvenlik Uzmanının Görevleri",
  subtitle: "Koruma, tespit, müdahale, denetim ve raporlama",
  goal: "Bir siber güvenlik uzmanının günlük işlerinin neleri kapsadığını görmek; log analizi, olay müdahalesi, risk değerlendirmesi ve raporlamanın birbirini nasıl tamamladığını kavramak.",
  outcomes: [
    "Güvenlik uzmanının temel görev alanlarını sıralayabilirsin.",
    "Basit bir log kaydında şüpheli işareti fark edebilirsin.",
    "Olay müdahalesinin temel adımlarını doğru sırayla açıklayabilirsin.",
    "Raporlama ve dokümantasyonun neden teknik iş kadar önemli olduğunu anlatabilirsin.",
  ],
  minutes: 35,
  topics: [
    {
      title: "Siber güvenlik uzmanı ne yapar?",
      en: "What does a security professional do?",
      simple:
        "Film ve dizilerde güvenlik uzmanı genellikle hızlı yazı yazıp “içeri girmeye” çalışan biri olarak gösterilir. Gerçekte iş çoğunlukla gözlem, analiz, planlama ve iletişimdir. Güvenlik uzmanı bir tür dijital bekçi, müfettiş ve danışmanın birleşimi gibidir.",
      technical:
        "Rol, uzmanlık alanına göre değişse de ortak görevler vardır: sistemleri sertleştirmek (hardening), zafiyetleri bulmak ve önceliklendirmek, logları izlemek, olaylara müdahale etmek, denetim ve risk değerlendirmesi yapmak, bulguları raporlamak ve yeni tehditleri sürekli takip etmek. Bu görevler birbirinden bağımsız değil, bir döngünün parçalarıdır.",
      example:
        "Orta ölçekli bir şirkette güvenlik uzmanının tipik haftası: Pazartesi yeni çıkan kritik bir açığın şirketi etkileyip etkilemediğini kontrol etmek, salı uyarı panelinde şüpheli girişleri incelemek, çarşamba yeni yazılım için risk değerlendirmesi yapmak, perşembe çalışan farkındalık eğitimi hazırlamak, cuma haftalık rapor sunmak.",
    },
    {
      title: "Sistemleri korumak ve güvenlik açıklarını tespit etmek",
      en: "Protecting systems and finding vulnerabilities",
      simple:
        "Korumak, kapıları önceden kilitlemek ve pencerelerin açık olup olmadığını düzenli kontrol etmek gibidir. Güvenlik açığı (zafiyet) ise kilitlenmeyi unuttuğun pencere ya da bozuk bir kilittir.",
      technical:
        "Koruma işleri: gereksiz servisleri kapatmak, güncellemeleri yönetmek, güçlü kimlik doğrulama ve en az yetki ilkesi (least privilege) uygulamak, yapılandırmaları standartlara göre sertleştirmek. Tespit işleri: zafiyet taraması (vulnerability scanning), yapılandırma kontrolleri ve bulguların önem derecesine göre sıralanması. Zafiyetler CVE numaralarıyla takip edilir; önem derecesi için CVSS puanı kullanılır, ancak puan tek başına yeterli değildir: aynı zafiyet internete açık bir sunucuda kritik, izole bir test makinesinde düşük öncelikli olabilir.",
      example:
        "Tarama sonucunda 200 zafiyet çıktığında hepsini aynı anda kapatmak mümkün değildir. Uzman önce internete açık, müşteri verisi tutan ve aktif olarak istismar edilen zafiyetlere odaklanır; düşük riskli olanları planlı bakım dönemine bırakır.",
    },
    {
      title: "Log analizi",
      en: "Log Analysis",
      simple:
        "Log, bir sistemin tuttuğu “günlük defteri”dir. Kim ne zaman giriş yaptı, hangi işlem yapıldı, hangi hata oluştu gibi bilgileri kaydeder. Bir olay olduğunda önce bu deftere bakılır.",
      technical:
        "Loglar işletim sistemlerinden, uygulamalardan, güvenlik duvarlarından ve bulut hizmetlerinden gelir. Tek tek bakmak zor olduğu için SIEM gibi araçlar bunları merkezde toplar. Analiz sırasında zaman (timestamp), kaynak IP, kullanıcı adı, işlem sonucu ve olağan dışı örüntüler incelenir. Kısa sürede çok sayıda başarısız girişin ardından başarılı bir giriş, kaba kuvvet (brute force) veya parola tahmini saldırısının işareti olabilir.",
      example:
        "Aşağıdaki kayıtta bir hesaba kısa sürede birçok başarısız giriş denemesi yapılmış ve ardından aynı kaynaktan başarılı bir giriş gelmiştir. Uzman bunu tek başına “saldırı” diye nitelendirmez; önce kullanıcının gerçekten yurt dışında olup olmadığını ve girişin olağan kullanım alışkanlığına uyup uymadığını doğrular.",
      terminal: {
        title: "auth.log (örnek)",
        lines: [
          "02:11:04 FAILED  user=ayse.k  src=185.xx.xx.14",
          "02:11:06 FAILED  user=ayse.k  src=185.xx.xx.14",
          "02:11:09 FAILED  user=ayse.k  src=185.xx.xx.14",
          "02:11:13 SUCCESS user=ayse.k  src=185.xx.xx.14",
          "# Normal giriş saatleri: 08:30 - 18:00, kaynak: ofis ağı (örnek veri)",
        ],
      },
    },
    {
      title: "Olay müdahalesi",
      en: "Incident Response",
      simple:
        "Bir şey ters gittiğinde panik yapmak yerine önceden hazırlanmış bir plana göre hareket etmek gerekir. Yangın tatbikatı gibi düşün: herkes ne yapacağını biliyorsa hasar azalır.",
      technical:
        "Yaygın olay müdahale modeli (örneğin NIST) şu aşamalardan oluşur: Hazırlık (preparation), Tespit ve analiz (detection & analysis), Sınırlama/izolasyon, yok etme ve toparlanma (containment, eradication, recovery) ve olay sonrası değerlendirme (lessons learned). Sınırlama aşamasında amaç saldırının yayılmasını durdurmaktır; ancak kanıtlar (loglar, bellek görüntüsü) silinmemelidir. Çünkü kök neden analizi ve olası hukuki süreçler bu kanıtlara dayanır.",
      example:
        "Bir çalışan şüpheli bir ek açtıktan sonra bilgisayarın garip davrandığını fark eder. Doğru adım bilgisayarı ağdan ayırıp (fişi çekmek değil, ağ bağlantısını kesmek) güvenlik ekibine haber vermektir. Bilgisayarı yeniden başlatmak veya kendi başına temizlemeye çalışmak, kanıtların kaybolmasına yol açabilir.",
    },
    {
      title: "Güvenlik denetimi ve risk değerlendirmesi",
      en: "Security Audit and Risk Assessment",
      simple:
        "Denetim, “Kurallara gerçekten uyuyor muyuz?” sorusunun cevabıdır. Risk değerlendirmesi ise “En büyük tehlikelerimiz hangileri, önce neye yatırım yapmalıyız?” sorusunun cevabıdır.",
      technical:
        "Denetimde politikalar, yapılandırmalar ve uygulamalar belirli bir standart veya iç kural setine göre kontrol edilir (örneğin ISO/IEC 27001 gibi çerçeveler). Risk değerlendirmesinde varlıklar belirlenir, her biri için tehdit ve zafiyetler analiz edilir; olasılık ve etki birlikte değerlendirilerek bir risk seviyesi hesaplanır. Sonuçta risk azaltma, kabul etme, devretme (sigorta gibi) veya kaçınma kararlarından biri seçilir.",
      example:
        "Bir şirket yeni bir bulut depolama hizmetine geçecek. Risk değerlendirmesinde müşteri verilerinin orada tutulacağı, erişim yetkilerinin yanlış yapılandırılabileceği ve hizmetin kesilebileceği belirlenir. Sonuç olarak şifreleme, sıkı yetki yönetimi ve yedekleme şartıyla geçişe onay verilir.",
    },
    {
      title: "Raporlama, dokümantasyon ve sürekli öğrenme",
      en: "Reporting, Documentation and Continuous Learning",
      simple:
        "En iyi analiz bile anlatılamazsa işe yaramaz. Güvenlik uzmanı bulduklarını hem teknik ekibin hem de yöneticilerin anlayacağı biçimde yazar. Ayrıca tehditler sürekli değiştiği için öğrenme işin bir parçasıdır, bitmeyen bir süreçtir.",
      technical:
        "İyi bir olay raporu: özet, zaman çizelgesi, etkilenen varlıklar, kök neden, alınan aksiyonlar, kalan riskler ve öneriler içerir. Yönetici özeti teknik detayı değil, iş etkisini anlatır. Dokümantasyon, bilginin kişiye bağımlı kalmamasını sağlar. Sürekli öğrenme için güvenlik duyuruları, tehdit istihbaratı raporları, CVE akışları ve uygulamalı laboratuvarlar takip edilir.",
      example:
        "Aynı olay için iki farklı rapor yazılır: Yöneticiye “müşteri verilerinin bir kısmına yetkisiz erişim saptandı, erişim kapatıldı, 3 gün içinde ek önlemler uygulanacak” denir. Teknik ekibe ise etkilenen hesap, IP adresleri, zaman çizelgesi ve izlenen yollar ayrıntılı olarak yazılır.",
    },
  ],
  examples: [
    {
      title: "Gece saatinde alarm",
      text: "Bir SOC analisti gece saat 02:00'de, normalde hiç giriş yapmayan bir muhasebe hesabından yabancı bir IP adresiyle giriş uyarısı alır. Analist önce hesabın sahibine ulaşmaya çalışır, giriş saatlerini ve izleri kontrol eder, ardından gerekirse hesabı devre dışı bırakır.",
      takeaway: "Önce doğrulama, sonra orantılı müdahale. Her uyarı gerçek saldırı değildir ama hiçbir uyarı da doğrulanmadan görmezden gelinmemelidir.",
    },
    {
      title: "Yama önceliklendirme",
      text: "Haftalık taramada 50 yeni zafiyet çıktı. Güvenlik uzmanı internete açık ve müşteri verisi barındıran sistemlerdeki 3 kritik zafiyeti hemen kapattı, geri kalanları planlı bakıma aldı.",
      takeaway: "Güvenlikte her şeyi yapmak yerine doğru şeyi önce yapmak gerekir.",
    },
  ],
  concepts: [
    { term: "Log", en: "Log", definition: "Bir sistemde gerçekleşen olayların zaman damgasıyla kaydedildiği günlük kaydı." },
    { term: "Zafiyet", en: "Vulnerability", definition: "Bir sistemin suistimal edilebilecek zayıf noktası." },
    { term: "En az yetki ilkesi", en: "Least privilege", definition: "Kullanıcıya veya sisteme yalnızca işini yapması için gereken en düşük yetkiyi verme prensibi." },
    { term: "Olay müdahalesi", en: "Incident response", definition: "Bir güvenlik olayını tespit etme, sınırlama, giderme ve ondan ders çıkarma süreci." },
    { term: "Sınırlama", en: "Containment", definition: "Saldırının yayılmasını durdurmak için etkilenen sistemin veya hesabın izole edilmesi." },
    { term: "Kök neden analizi", en: "Root cause analysis", definition: "Olayın belirtilerini değil, onu mümkün kılan asıl nedeni bulma çalışması." },
  ],
  activity: {
    type: "scenario",
    title: "Olay müdahale simülasyonu: Nova Lojistik",
    intro:
      "Bir güvenlik uzmanı olarak şüpheli bir olayı adım adım yöneteceksin. Her adımda seçim yap; sonucunu ve nedenini oku. Farklı seçenekleri de deneyerek bunların sonucunu inceleyebilirsin. Cezalandırma yok, hedef öğrenmek.",
    scenarios: [
      {
        id: "nova",
        title: "Nova Lojistik: Şüpheli giriş",
        context:
          "Nova Lojistik, 150 çalışanı olan bir kargo şirketi. Müşteri bilgileri bir iç sistemde tutuluyor. Şirketin tek güvenlik uzmanı sensin. Gece sistem bir uyarı üretti.",
        steps: [
          {
            prompt: "Güvenlik panelinde “olağan dışı giriş” uyarısı görüyorsun. İlk adımın ne olmalı?",
            evidence: {
              title: "alert #4721",
              lines: [
                "02:11  ayse.k  3x FAILED  -> 1x SUCCESS",
                "kaynak: 185.xx.xx.14 (yurt dışı)",
                "normal mesai: 08:30-18:00, ofis ağı",
              ],
            },
            choices: [
              { text: "Uyarıyı doğrula: ilgili logları incele ve kanıtları koru", verdict: "best", feedback: "Doğru. Müdahaleye başlamadan önce olayın gerçek olup olmadığını ve kapsamını anlamak gerekir. Logları korumak ileride kök neden analizi için şarttır.", concept: "Tespit ve analiz aşamasında amaç, panik değil kanıta dayalı karar vermektir." },
              { text: "Hesabı hemen devre dışı bırak, sonra incele", verdict: "acceptable", feedback: "Makul bir sınırlama adımı; şüpheli giriş durdurulur. Ancak önce hesabın gerçekten ele geçirilip geçirilmediğini doğrulamak, gereksiz kesintiyi önler. Eğer hesabı kapatacaksan logları da korumalısın.", concept: "Sınırlama önemlidir ama doğrulama ve kanıt korumayla birlikte yürütülmelidir." },
              { text: "Sunucuyu kapat ve logları temizle ki sorun büyümesin", verdict: "poor", feedback: "Riskli. Logların silinmesi, olayı anlamanı ve gerektiğinde resmi sürece destek vermeni imkânsız kılar. Sunucunun gereksiz yere kapatılması ise iş sürekliliğini bozar.", concept: "Kanıtlar silinmemeli; olay sonrası analiz onlara dayanır." },
              { text: "Sabah mesai başlayınca bakarım", verdict: "poor", feedback: "Riskli. Saldırgan aktifse saatler içinde veriyi dışarı aktarabilir. Uyarının önceliği belirlenip gerekirse hemen ele alınmalıdır.", concept: "Müdahale süresi (response time) zararın büyüklüğünü doğrudan etkiler." },
            ],
          },
          {
            prompt: "Loglar, aynı hesabın giriş sonrası müşteri tablosunu dışa aktardığını gösteriyor. Saldırının yayılmasını durdurmak için ne yaparsın?",
            evidence: {
              title: "app.log",
              lines: [
                "02:14  ayse.k  OPEN  customers_table",
                "02:16  ayse.k  EXPORT 48.213 rows -> csv",
                "02:17  ayse.k  DOWNLOAD 185.xx.xx.14",
              ],
            },
            choices: [
              { text: "Hesabın aktif oturumlarını sonlandır, parolayı sıfırla, MFA'yı zorunlu kıl ve etkilenen sistemi izole et", verdict: "best", feedback: "Doğru. Hem saldırganın mevcut erişimini keser hem de aynı kimlik bilgisiyle tekrar girişini engeller. Etkilenen sistemi izole etmek yayılmayı durdurur.", concept: "Sınırlama (containment): erişimi kes, tekrar girişi engelle, yayılmayı durdur." },
              { text: "Sadece parolayı değiştir", verdict: "acceptable", feedback: "Faydalı ama eksik. Açık oturumlar parola değişse de devam edebilir. Ayrıca MFA olmadan aynı yöntem tekrar denenebilir.", concept: "Parola değişikliği tek başına yetmez; oturumlar ve ek doğrulama da ele alınmalı." },
              { text: "Çalışanı suçlayıp hakkında işlem başlat", verdict: "poor", feedback: "Erken ve yanlış. Hesabın sahibi büyük olasılıkla mağdurdur. Önce teknik sınırlama yapılmalı, kişi ile iletişim ise yargılamadan, bilgi toplamak amacıyla kurulmalıdır.", concept: "Güvenlik kültürü suçlama değil öğrenme üzerine kuruludur." },
              { text: "Tüm şirket ağını süresiz kapat", verdict: "poor", feedback: "Orantısız tepki. Bu hamle iş sürekliliğine ciddi zarar verir; sorunlu hesabı ve sistemi izole etmek daha hedefli ve etkilidir.", concept: "Sınırlama orantılı olmalıdır; amaç sorunu durdurmak, işi durdurmak değildir." },
            ],
          },
          {
            prompt: "Acil durum kontrol altına alındı. Şimdi olayın kapsamını anlaman gerekiyor. Nasıl ilerlersin?",
            choices: [
              { text: "Saldırganın başka hesaplara veya sistemlere geçip geçmediğini, hangi verilere eriştiğini loglardan çıkar ve zaman çizelgesi oluştur", verdict: "best", feedback: "Doğru. Kapsam analizi hem alınacak ek önlemleri hem de bildirim yükümlülüklerini belirler. Zaman çizelgesi, olayı net anlatmanı sağlar.", concept: "Kapsam analizi (scoping): ne kadarı etkilendi, ne zamandan beri?" },
              { text: "Yalnızca bu hesabın eriştiği tabloya bak", verdict: "acceptable", feedback: "Başlangıç için gerekli ama yeterli değil. Saldırgan o hesapla başka sistemlere de ulaşmış olabilir.", concept: "Saldırganın yatay hareketini (lateral movement) kontrol etmek gerekir." },
              { text: "Parola değişti, sorun bitti diye kabul et", verdict: "poor", feedback: "Riskli. Saldırgan başka bir arka kapı veya ek hesap bırakmış olabilir. Doğrulama yapılmadan olay kapatılmaz.", concept: "Yok etme (eradication) aşaması, saldırganın kalıcı izlerini temizlemeyi de kapsar." },
            ],
          },
          {
            prompt: "Müşteri verilerine yetkisiz erişim olduğu anlaşıldı. İletişim ve raporlama konusunda ne yaparsın?",
            choices: [
              { text: "Olayı zaman çizelgesi ve etkiyle birlikte yönetime raporla; hukuk/KVKK sorumlusunu bilgilendir ki yasal bildirim yükümlülükleri değerlendirilsin", verdict: "best", feedback: "Doğru. Kişisel veri içeren ihlallerde yasal süreçler olabilir. Doğru ve zamanında bilgilendirme, kuruma karar verme imkânı tanır.", concept: "Şeffaf raporlama güvenlik işinin temel bir parçasıdır." },
              { text: "Sadece BT ekibine kısa bir e-posta gönder", verdict: "acceptable", feedback: "Teknik ekip bilgilendirilmiş olur ama karar vericilerin ve yasal sorumluların haberi olmaz. Müşteri verisi söz konusuysa yönetim ve hukuk da sürece dahil olmalı.", concept: "Raporun hedef kitlesine göre uyarlanması gerekir." },
              { text: "İtibar zarar görmesin diye kimseye söyleme", verdict: "poor", feedback: "Hem etik hem hukuki açıdan sorunlu. Olayın gizlenmesi hem müşterileri korumasız bırakır hem de kurumun sorumluluğunu artırır.", concept: "Gizlemek riski büyütür; şeffaflık ve zamanında bildirim esastır." },
            ],
          },
          {
            prompt: "Olay kapandı. Gelecekte benzer bir olayı önlemek için en değerli adım nedir?",
            choices: [
              { text: "Olay sonrası değerlendirme yap: MFA'yı herkese zorunlu kıl, anormal giriş uyarılarını güçlendir, süreci ve dersleri dokümante et", verdict: "best", feedback: "Doğru. Kök nedene yönelik kalıcı iyileştirme ve dokümantasyon, aynı olayın tekrarını zorlaştırır ve yeni ekip üyelerine bilgi aktarır.", concept: "Olay sonrası değerlendirme (lessons learned) müdahale döngüsünü tamamlar." },
              { text: "Yalnızca etkilenen kullanıcının parolasını sık sık değiştirmesini iste", verdict: "acceptable", feedback: "Küçük bir fayda sağlar; ama kök nedeni çözmez. MFA ve izleme çok daha etkilidir.", concept: "Kalıcı çözüm, tek kişiye değil sisteme yönelik olmalıdır." },
              { text: "Olay bitti, bir daha konuşmaya gerek yok", verdict: "poor", feedback: "Öğrenme fırsatı kaçırılır. Aynı zafiyet aynı şekilde tekrar kullanılabilir.", concept: "Her olay, savunmayı geliştirmek için bir veri kaynağıdır." },
            ],
          },
        ],
      },
    ],
  },
  quiz: [
    q("l4q1", "Siber güvenlik uzmanı ne yapar?", "Aşağıdakilerden hangisi güvenlik uzmanının gerçek günlük işine en yakındır?", [
      "Sadece hızlıca kod yazarak sistemlere girmeye çalışmak",
      "Sistemleri izlemek, zafiyetleri değerlendirmek, olaylara müdahale etmek ve raporlamak",
      "Sadece kullanıcıların şifrelerini unuttuklarında yenilemek",
      "Yalnızca antivirüs programı yüklemek",
    ], 1, "Güvenlik uzmanının işi izleme, analiz, değerlendirme, müdahale ve iletişimden oluşan çok yönlü bir iştir."),
    q("l4q2", "Sistemleri korumak ve güvenlik açıklarını tespit etmek", "Tarama sonucu 200 zafiyet çıkmıştır. En mantıklı yaklaşım hangisidir?", [
      "Rastgele bir sırayla hepsini kapatmaya çalışmak",
      "Hiçbirini kapatmamak; çünkü çok fazla var",
      "Yalnızca en eski zafiyetleri kapatmak",
      "Önem derecesi, internete açıklık, veri hassasiyeti ve istismar durumuna göre önceliklendirmek",
    ], 3, "Her zafiyet aynı riski taşımaz. Bağlama göre önceliklendirme, sınırlı kaynakla en büyük riski azaltmayı sağlar."),
    q("l4q3", "Log analizi", "Bir hesapta gece saatinde art arda başarısız girişlerin ardından başarılı bir giriş görüyorsun. Bu durum neyi düşündürebilir?", [
      "Kullanıcının parolayı hızlıca hatırladığını, bu yüzden hiçbir şey yapmaya gerek olmadığını",
      "Parola tahmini veya kaba kuvvet saldırısı olabileceğini; girişin doğrulanması gerektiğini",
      "Sunucunun donanımsal olarak bozulduğunu",
      "Loglama sisteminin hatalı çalıştığını",
    ], 1, "Bu örüntü saldırı belirtisi olabilir ama tek başına kesin kanıt değildir. Kullanıcıyla doğrulama ve bağlam kontrolü gerekir."),
    q("l4q4", "Olay müdahalesi", "Bir çalışan bilgisayarının zararlı yazılım bulaştığından şüpheleniyor. İlk doğru adım hangisidir?", [
      "Bilgisayarı yeniden başlatıp dosyaları silmek",
      "Zararlı olduğunu düşündüğü dosyayı arkadaşlarına göndermek",
      "Bilgisayarı ağdan ayırıp güvenlik ekibine haber vermek",
      "Hiçbir şey yapmadan çalışmaya devam etmek",
    ], 2, "Ağdan ayırmak yayılmayı engeller, güvenlik ekibine haber vermek ise kanıtları koruyarak doğru müdahaleyi başlatır."),
    q("l4q5", "Raporlama, dokümantasyon ve sürekli öğrenme", "Bir güvenlik olayı için yazılacak yönetici özetinin temel odağı ne olmalıdır?", [
      "Tüm log satırlarının tam listesi",
      "Kullanılan her komutun ayrıntısı",
      "İş etkisi, alınan aksiyonlar ve gerekli kararlar",
      "Saldırıyı yapan kişi hakkında tahminler",
    ], 2, "Yöneticiler karar verebilmek için iş etkisini ve sonraki adımları bilmek ister. Teknik detaylar ayrı bir teknik raporda yer alır."),
  ],
  summary: [
    "Güvenlik uzmanının işi; koruma, tespit, log analizi, olay müdahalesi, denetim, risk değerlendirmesi ve raporlamadan oluşur.",
    "Zafiyetler bağlama göre önceliklendirilir; her zafiyet aynı risk seviyesinde değildir.",
    "Loglar olay analizinin temel veri kaynağıdır; kanıtlar korunmalıdır.",
    "Olay müdahalesi: hazırlık, tespit ve analiz, sınırlama, yok etme, toparlanma ve olay sonrası değerlendirme.",
    "İyi rapor, hedef kitleye göre yazılır ve sürekli öğrenme işin parçasıdır.",
  ],
};
