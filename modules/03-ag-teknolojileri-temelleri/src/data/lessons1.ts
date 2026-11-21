import { Q, type Lesson } from "./types";

export const L1: Lesson = {
  id: 1,
  title: "Bilgisayar Ağları Nedir?",
  minutes: 25,
  labTitle: "Sanal Ağ Kurma Laboratuvarı",
  purpose:
    "Bu dersin amacı, bilgisayar ağı kavramını sıfırdan anlamak; cihazların neden ve nasıl birbirleriyle konuştuğunu, yerel ağ ile internet arasındaki temel ilişkiyi kavramaktır.",
  outcomes: [
    "Bilgisayar ağının tanımını kendi cümlelerinle açıklayabilirsin.",
    "Ağların neden ortaya çıktığını ve hangi problemi çözdüğünü anlatabilirsin.",
    "Bir ağdaki temel bileşenleri (cihaz, bağlantı, protokol) ayırt edebilirsin.",
    "İnternet ile yerel ağ (LAN) arasındaki ilişkiyi açıklayabilirsin.",
    "Günlük hayattan ağ örneklerini tanıyabilirsin.",
  ],
  sections: [
    {
      h: "Bilgisayar ağı nedir?",
      p: [
        "Bilgisayar ağı (Computer Network), iki veya daha fazla cihazın veri alışverişi yapabilmesi için birbirine bağlanmasıyla oluşan yapıdır. Cihaz dediğimiz şey bilgisayar, telefon, tablet, yazıcı, sunucu (server), akıllı televizyon, güvenlik kamerası ve hatta akıllı ampul bile olabilir. Önemli olan, bu cihazların ortak kurallar çerçevesinde birbirine mesaj gönderebilmesidir.",
        "Bir ağın üç temel bileşeni vardır: uç cihazlar (veriyi üreten veya tüketen cihazlar), aktarım ortamı (kablo, fiber veya kablosuz sinyal) ve ağ cihazları (switch, router gibi trafiği yönlendiren cihazlar). Bunlara ek olarak tüm cihazların aynı dili konuşmasını sağlayan kurallar bütünü olan protokoller (Protocols) gelir. Protokoller olmasa cihazlar birbirini anlayamaz; tıpkı ortak dili olmayan iki insanın konuşmaya çalışması gibi.",
      ],
    },
    {
      h: "Ağlar neden ortaya çıktı?",
      p: [
        "İlk bilgisayarlar çok pahalıydı ve her biri tek başına çalışıyordu. Bir dosyayı başka bir bilgisayara taşımak için disket ya da kaset taşımak gerekiyordu. Üniversiteler ve kurumlar, pahalı kaynakları (yazıcı, depolama, işlemci gücü) paylaşmak ve bilgiyi hızla aktarmak için bilgisayarları birbirine bağlamaya başladı. Böylece kaynak paylaşımı, hızlı iletişim ve merkezi yönetim mümkün oldu.",
        "Bugün ağların amacı çok daha geniştir: e-posta, web siteleri, video görüşmeleri, çevrimiçi oyunlar, bulut depolama, mobil bankacılık hepsi ağlar üzerinde çalışır. Siber güvenlik açısından da ağlar kritik önemdedir; çünkü saldırıların büyük bölümü ağ üzerinden gerçekleşir ve bir savunmacı olarak verinin ağda nasıl aktığını bilmeden onu koruyamazsın.",
      ],
    },
    {
      h: "Veri nasıl gönderilir? Paket mantığı",
      p: [
        "Ağlarda veri tek parça halinde gönderilmez. Büyük bir dosya, paket (Packet) adı verilen küçük parçalara bölünür. Her pakette verinin bir kısmı ile birlikte kaynağın ve hedefin adresi gibi bilgiler bulunur. Bu, bir kitabı sayfalarına ayırıp her sayfayı ayrı zarfla, üzerinde adres yazarak postalamaya benzer. Alıcı tarafta paketler doğru sırayla birleştirilir.",
        "Paketlerin bu şekilde gönderilmesi ağın verimli kullanılmasını sağlar: aynı kablo üzerinden birçok cihazın paketleri sırayla geçebilir. Bir paket kaybolursa yalnızca o paket yeniden gönderilir; tüm dosyayı baştan yollamak gerekmez.",
      ],
    },
    {
      h: "İnternet ile yerel ağ arasındaki ilişki",
      p: [
        "Yerel ağ (LAN – Local Area Network), evinizde, okulunuzda veya ofisinizde sınırlı bir alanı kapsayan ağdır. İnternet ise dünya genelindeki milyonlarca ağın birbirine bağlanmasıyla oluşan 'ağlar ağı'dır. Yani internet tek bir ağ değil, birbirine bağlı sayısız küçük ve büyük ağın birleşimidir.",
        "Evinizdeki cihazlar önce yerel ağınıza bağlanır. Bu yerel ağ, bir router (yönlendirici) ve internet servis sağlayıcısı (ISS) aracılığıyla internete açılır. Yerel ağdaki bir telefonla yazıcıya yazdırırken trafik internete hiç çıkmaz; bir web sitesini açarken ise istek router üzerinden internete gider. Bu ayrımı anlamak, ileride güvenlik duvarı, NAT ve ağ segmentasyonu gibi konuları öğrenirken çok işine yarayacak.",
      ],
    },
  ],
  concepts: [
    ["Ağ (Network)", "Birbirine bağlı cihazların veri paylaşabildiği yapı."],
    ["Uç cihaz (End device)", "Ağda veri üreten veya kullanan bilgisayar, telefon, yazıcı gibi cihazlar."],
    ["Protokol (Protocol)", "Cihazların nasıl konuşacağını belirleyen ortak kurallar bütünü."],
    ["Paket (Packet)", "Verinin ağda taşınan, adres bilgisi içeren küçük parçası."],
    ["Yerel ağ (LAN)", "Ev, okul veya ofis gibi sınırlı bir alandaki ağ."],
    ["İnternet", "Dünya çapında birbirine bağlı ağların oluşturduğu ağlar ağı."],
  ],
  daily: [
    "Evdeki Wi-Fi: telefon, TV ve bilgisayar aynı yerel ağa bağlanır ve router sayesinde internete çıkar.",
    "Okul laboratuvarı: tüm bilgisayarlar tek bir yazıcıyı ve ortak dosya sunucusunu kullanır.",
    "ATM ve bankacılık: ATM, banka sunucusuyla ağ üzerinden konuşarak bakiyenizi sorgular.",
    "Akıllı ev: kamera, ampul ve kapı zili telefonunuzla ağ üzerinden haberleşir.",
  ],
  examples: [
    {
      title: "Bir cihazın ağ bilgilerini görme (Windows)",
      code: "C:\\> ipconfig\n\nEthernet adapter:\n   IPv4 Address. . . . : 192.168.1.25\n   Subnet Mask . . . . : 255.255.255.0\n   Default Gateway . . : 192.168.1.1",
      note: "Cihazın yerel ağdaki adresi (192.168.1.25) ve internete çıkış kapısı (192.168.1.1) burada görülür. Bu kavramları ilerleyen derslerde ayrıntılı öğreneceksin.",
    },
    {
      title: "Bir paketin içeriği (basitleştirilmiş)",
      code: "Kaynak : 192.168.1.25 (Bilgisayarım)\nHedef  : 192.168.1.40 (Yazıcı)\nVeri   : 'Sayfa 1 / 3 – yazdırma verisi'\nSıra no: 1",
      note: "Her paket nereden geldiğini, nereye gideceğini ve ne taşıdığını bilir.",
    },
  ],
  steps: [
    "Laboratuvarda bir ağ anahtarı (switch) ve dört cihaz göreceksin: bilgisayar, telefon, sunucu ve yazıcı.",
    "Bir cihaza tıklayarak onu ağ anahtarına kablo ile bağla (tekrar tıklarsan bağlantıyı kesersin).",
    "Kaynak ve hedef cihazı seç, 'Veri Gönder' düğmesine bas.",
    "Paketin animasyonla anahtardan geçip hedefe ulaşmasını izle; bağlı olmayan cihazlarla ne olduğunu da dene.",
  ],
  after: [
    "Bağlı olmayan bir cihaz ağın dışında kalır; bağlantı olmadan veri alışverişi mümkün değildir.",
    "Tüm paketler merkezî bir cihazdan (switch) geçti; bu, yerel ağın temel çalışma biçimidir.",
    "Gerçek ağlarda da veri paketlere bölünür; sen animasyonda tek paket gördün ama bir dosya yüzlerce paketten oluşur.",
  ],
  quiz: [
    Q("Bilgisayar ağının en kısa tanımı hangisidir?", ["Sadece internet bağlantısı olan cihazlar", "Veri alışverişi için birbirine bağlı cihazlar topluluğu", "Yalnızca kablolu bağlantılar", "Bir bilgisayardaki dosyaların toplamı"], 1, "Ağ, bağlantı türü ne olursa olsun veri paylaşabilen cihazlar topluluğudur. İnternet bağlantısı şart değildir; kablolu ya da kablosuz olabilir."),
    Q("Aşağıdakilerden hangisi bir ağ protokolünün görevidir?", ["Kabloyu korumak", "Cihazların ortak kurallarla konuşmasını sağlamak", "Ekran parlaklığını ayarlamak", "Dosya boyutunu küçültmek"], 1, "Protokoller, cihazların birbirini anlamasını sağlayan kurallardır. Diğer seçenekler ağ iletişimiyle ilgili değildir."),
    Q("İnternet için en doğru ifade hangisidir?", ["Tek bir büyük sunucu", "Bir şirketin sahip olduğu ağ", "Birbirine bağlı sayısız ağın oluşturduğu ağlar ağı", "Sadece Wi-Fi sinyali"], 2, "İnternet, dünya çapında birbirine bağlanan çok sayıda ağın birleşimidir; tek bir sunucu, şirket veya sinyal değildir."),
    Q("Veri ağda neden paketlere bölünür?", ["Daha çok kablo kullanmak için", "Ağın verimli kullanılması ve kayıp parçanın tekrar gönderilebilmesi için", "Verinin daha yavaş gitmesi için", "Cihazları yormak için"], 1, "Paketleme, ortak hattın birçok cihaz tarafından paylaşılmasını sağlar ve kaybolan parçanın tek başına yeniden gönderilmesine imkan tanır."),
    Q("Evdeki telefonunuzla yazıcıya yazdırırken trafik genelde nereden geçer?", ["İnternet üzerinden yurtdışına", "Sadece yerel ağ içinde", "Operatörün baz istasyonundan", "Hiçbir yerden geçmez"], 1, "Aynı yerel ağdaki iki cihaz arasındaki trafik internete çıkmaz; yerel ağ içinde kalır."),
  ],
  summary: [
    "Ağ, veri paylaşabilen cihazların birbirine bağlanmasıdır.",
    "Ağ; uç cihazlar, aktarım ortamı, ağ cihazları ve protokollerden oluşur.",
    "Veri, paketlere bölünerek ağda taşınır.",
    "İnternet, birbirine bağlı ağların ağıdır; yerel ağ bunun küçük bir parçasıdır.",
  ],
};

export const L2: Lesson = {
  id: 2,
  title: "LAN, WAN, MAN ve PAN",
  minutes: 25,
  labTitle: "Ağ Türü Belirleme Laboratuvarı",
  purpose:
    "Ağları kapsama alanına göre sınıflandırmayı öğrenmek; bir senaryoya bakarak doğru ağ türünü (PAN, LAN, MAN, WAN) belirleyebilmek.",
  outcomes: [
    "PAN, LAN, MAN ve WAN kavramlarını tanımlayabilirsin.",
    "Her ağ türünün kapsama alanını ve tipik kullanımını söyleyebilirsin.",
    "Gerçek hayat senaryolarında doğru ağ türünü seçebilirsin.",
    "Ağ türleri arasındaki hız, maliyet ve yönetim farklarını açıklayabilirsin.",
  ],
  sections: [
    {
      h: "Ağlar neden sınıflandırılır?",
      p: [
        "Ağlar farklı büyüklüklerde olabilir: masanızdaki kulaklıktan kıtalar arası şirket bağlantılarına kadar. Bir ağı tasarlarken veya güvenliğini sağlarken önce onun ölçeğini bilmek gerekir; çünkü ölçek arttıkça kullanılan teknoloji, maliyet, hız, sahiplik ve riskler de değişir. Bu yüzden ağlar coğrafi kapsama alanlarına göre PAN, LAN, MAN ve WAN olarak gruplanır.",
      ],
    },
    {
      h: "PAN ve LAN",
      p: [
        "PAN (Personal Area Network – Kişisel Alan Ağı) kişinin etrafındaki birkaç metrelik alanı kapsar. Bluetooth ile bağlanan kulaklık, akıllı saat, telefonunuzun internet paylaşımı (hotspot) ve kablosuz klavye tipik örneklerdir. Genellikle tek bir kişiye aittir ve kapsama alanı yaklaşık 10 metre civarındadır.",
        "LAN (Local Area Network – Yerel Alan Ağı) tek bir bina veya birkaç bina gibi sınırlı bir alanı kapsar: ev, okul, ofis, laboratuvar. Çok yüksek hızlara (100 Mbps – 10 Gbps ve üzeri) ulaşabilir, genellikle tek bir kurum tarafından kurulur ve yönetilir. Ethernet kablosu ve Wi-Fi LAN'da en yaygın kullanılan teknolojilerdir.",
      ],
    },
    {
      h: "MAN ve WAN",
      p: [
        "MAN (Metropolitan Area Network – Metropol Alan Ağı) bir şehir veya büyük bir yerleşim bölgesini kapsar. Belediyenin şehirdeki kameraları ve trafik ışıklarını bağlayan fiber ağı, bir üniversitenin şehir içindeki farklı kampüslerini birleştiren ağ veya kablo TV altyapısı MAN örnekleridir. Genelde kapsama alanı onlarca kilometredir.",
        "WAN (Wide Area Network – Geniş Alan Ağı) şehirleri, ülkeleri ve kıtaları birbirine bağlar. En büyük WAN internettir. Bir şirketin İstanbul, Berlin ve New York şubelerini birbirine bağlayan hat da WAN'dır. WAN bağlantıları genelde telekom operatörlerinden kiralanır; LAN'a göre daha pahalı, gecikmesi daha yüksek ve yönetimi daha karmaşıktır.",
        "Günlük hayatta bu ağlar iç içe çalışır: kulaklığınız PAN ile telefona, telefonunuz evdeki LAN'a, evdeki LAN ise WAN üzerinden internete bağlanır.",
      ],
    },
  ],
  concepts: [
    ["PAN", "Kişisel alan ağı. Yaklaşık 10 metre, Bluetooth gibi teknolojiler."],
    ["LAN", "Yerel alan ağı. Ev, okul, ofis; yüksek hız, tek yönetim."],
    ["MAN", "Metropol alan ağı. Şehir ölçeği, onlarca kilometre."],
    ["WAN", "Geniş alan ağı. Ülkeler ve kıtalar arası, internet en büyük örneği."],
    ["Kapsama alanı", "Bir ağın coğrafi olarak ulaşabildiği mesafe."],
    ["ISS (ISP)", "İnternet servis sağlayıcı; LAN'ı WAN'a bağlayan şirket."],
  ],
  daily: [
    "Telefonunuzu Bluetooth kulaklıkla eşleştirmek bir PAN örneğidir.",
    "Okuldaki bilgisayar laboratuvarı ve Wi-Fi bir LAN'dır.",
    "Bir belediyenin şehir genelindeki trafik kameraları fiber hatlarla MAN oluşturabilir.",
    "Bir bankanın farklı şehirlerdeki şubelerinin merkez sistemlere bağlanması WAN'dır.",
  ],
  examples: [
    {
      title: "Ağ türleri ve tipik özellikleri",
      code: "PAN : ~10 m       | Bluetooth, USB          | 1 kişi\nLAN : ~100 m-1 km | Ethernet, Wi-Fi         | tek kurum\nMAN : ~10-50 km   | Fiber, metro ethernet   | şehir/belediye\nWAN : ülke/kıta   | Kiralık hat, MPLS, VPN  | operatörler",
      note: "Kapsama alanı büyüdükçe maliyet ve gecikme artar, tipik hız ise genellikle düşer.",
    },
    {
      title: "Bir şirketin ağ yapısı",
      code: "İstanbul Ofisi (LAN) ──┐\nAnkara Ofisi   (LAN) ──┼── WAN (Operatör hattı) ── Berlin Ofisi (LAN)\nŞehir içi kampüsler    ──┘ (MAN)",
      note: "Her ofis kendi içinde LAN'dır; ofisleri birbirine bağlayan yapı WAN'dır.",
    },
  ],
  steps: [
    "Laboratuvarda sırayla ağ senaryoları göreceksin.",
    "Her senaryo için PAN, LAN, MAN veya WAN seçeneklerinden birini seç.",
    "Cevabından hemen sonra neden doğru ya da yanlış olduğunu açıklayan geri bildirimi oku.",
    "Tüm senaryoları bitirince puanını gör ve istersen yeniden dene.",
  ],
  after: [
    "Ağ türünü belirlerken ilk ölçüt kapsama alanıdır; ikinci ölçüt kimin yönettiğidir.",
    "Tek bir kuruma ait bina içi ağlar LAN, operatör altyapısı kullanan uzun mesafe bağlantılar WAN'dır.",
    "Gerçek hayatta bu ağlar birbirinin içinde çalışır.",
  ],
  quiz: [
    Q("Bluetooth kulaklık bağlantısı hangi ağ türüne örnektir?", ["WAN", "MAN", "PAN", "LAN"], 2, "Birkaç metre menzilli, kişiye ait cihazların bağlantısı PAN'dır."),
    Q("Evdeki Wi-Fi ağı hangi türdendir?", ["LAN", "WAN", "MAN", "PAN"], 0, "Ev, tek bir yerleşkeyle sınırlı ve kullanıcının kendi yönettiği bir ağdır; LAN'dır."),
    Q("Farklı ülkelerdeki şirket şubelerini bağlayan ağ hangisidir?", ["PAN", "LAN", "MAN", "WAN"], 3, "Ülkeler arası bağlantı geniş alan ağıdır (WAN). Diğer ağlar bu ölçeği kapsayamaz."),
    Q("Bir şehirdeki belediye binalarını fiber ile birleştiren ağ en çok hangisine benzer?", ["MAN", "PAN", "LAN", "Hiçbiri"], 0, "Şehir ölçeğindeki ağ MAN'dır."),
    Q("Hangisi LAN için doğrudur?", ["Genellikle tek bir kurum yönetir ve hızı yüksektir", "Kıtalar arası kapsar", "Menzili yalnızca 1 metredir", "Sadece telefon operatörleri kurar"], 0, "LAN sınırlı alanda, yüksek hızda ve çoğunlukla tek yönetim altındadır."),
  ],
  summary: [
    "PAN kişisel, LAN yerel, MAN şehir, WAN ülke/kıta ölçeğindedir.",
    "Kapsama alanı arttıkça gecikme ve maliyet artar.",
    "Ağlar iç içe çalışır; internet en büyük WAN'dır.",
  ],
};

export const L3: Lesson = {
  id: 3,
  title: "Client-Server Mimarisi",
  minutes: 30,
  labTitle: "Client-Server İstek/Yanıt Simülasyonu",
  purpose:
    "İstemci (Client) ve sunucu (Server) rollerini, istek-yanıt mantığını ve bir web sitesi açılırken arka planda gerçekleşen iletişimi anlamak.",
  outcomes: [
    "Client ve Server kavramlarını açıklayabilirsin.",
    "İstek (Request) ve yanıt (Response) döngüsünü anlatabilirsin.",
    "Bir web sayfası açılırken oluşan adımları sıralayabilirsin.",
    "Merkezi ve dağıtık sistemler arasındaki temel farkı söyleyebilirsin.",
  ],
  sections: [
    {
      h: "İstemci ve sunucu nedir?",
      p: [
        "İstemci (Client), bir hizmet talep eden cihaz veya programdır; sunucu (Server) ise bu talebi karşılayan ve hizmeti sunan bilgisayar veya programdır. Tarayıcınız bir istemcidir; bir web sitesini barındıran bilgisayar ise sunucudur. Roller kişilere değil göreve göre belirlenir: aynı bilgisayar bir iletişimde istemci, başka bir iletişimde sunucu olabilir.",
        "Sunucular genellikle günün 24 saati açıktır, güçlü donanıma sahiptir ve aynı anda binlerce istemciye cevap verebilir. Bir restoranı düşün: müşteri (istemci) siparişi verir, garson siparişi iletir, mutfak (sunucu) yemeği hazırlayıp geri gönderir.",
      ],
    },
    {
      h: "İstek ve yanıt mantığı",
      p: [
        "Client-Server iletişimi bir soru-cevap düzenidir. İstemci istek (Request) gönderir, sunucu yanıt (Response) döner. İstek, ne istendiğini (örneğin 'ana sayfayı ver') içerir; yanıt ise sonucu (sayfa içeriği veya bir hata mesajı) taşır. Sunucu kendiliğinden istemciye veri göndermez; genelde isteği bekler.",
        "Sunucu kapalıysa, aşırı yüklüyse veya istek hatalıysa yanıt gecikebilir ya da hata dönebilir. 'Sayfa bulunamadı' veya 'Sunucu yanıt vermiyor' mesajlarının arkasında bu mantık yatar.",
      ],
    },
    {
      h: "Bir web sitesi açılırken neler olur?",
      p: [
        "Tarayıcıya bir adres yazdığında önce DNS ile alan adı IP adresine çevrilir. Ardından tarayıcı sunucuyla bağlantı kurar (TCP), güvenli site ise şifreli kanal oluşturur (TLS). Sonra HTTP isteği gönderilir; sunucu HTML, CSS, görsel ve JavaScript dosyalarını yanıt olarak gönderir ve tarayıcı bunları birleştirip sayfayı çizer.",
        "Bir sayfa genellikle tek bir istekle değil, onlarca istekle yüklenir: her görsel, stil dosyası ve betik ayrı bir istektir. Bu ayrıntıları ilerleyen derslerde (DNS, TCP, HTTP) tek tek inceleyeceğiz.",
      ],
    },
    {
      h: "Merkezi ve dağıtık sistemlere giriş",
      p: [
        "Client-Server modeli merkezi bir yapıdır: veriler ve kararlar sunucuda toplanır. Yönetimi, yedeklemesi ve güvenliği kolaydır; ancak sunucu çökerse tüm sistem durabilir (tek hata noktası – single point of failure).",
        "Dağıtık sistemlerde ise iş ve veri birçok bilgisayara yayılır. Eşler arası (Peer-to-Peer) paylaşım ağları ve büyük şirketlerin çok sayıda sunucudan oluşan yapıları buna örnektir. Dayanıklıdırlar ama yönetimleri ve güvenliği daha karmaşıktır. Siber güvenlikte sunucular saldırganların öncelikli hedefi olduğundan, istemci-sunucu ilişkisini iyi bilmek şarttır.",
      ],
    },
  ],
  concepts: [
    ["İstemci (Client)", "Hizmet isteyen cihaz/program (tarayıcı, mobil uygulama)."],
    ["Sunucu (Server)", "İstekleri karşılayıp hizmet veren bilgisayar/program."],
    ["İstek (Request)", "İstemcinin sunucuya gönderdiği talep."],
    ["Yanıt (Response)", "Sunucunun istemciye döndüğü cevap."],
    ["Tek hata noktası", "Arızalandığında tüm sistemi durduran bileşen."],
    ["Peer-to-Peer", "Her cihazın hem istemci hem sunucu gibi davrandığı dağıtık model."],
  ],
  daily: [
    "Tarayıcıyla bir haber sitesini açmak: tarayıcı istemci, haber sitesi sunucudur.",
    "Mobil uygulamada mesaj göndermek: uygulama istemci, mesajlaşma servisi sunucudur.",
    "Bir oyunda skor tablosunu görmek: oyun istemcisi sunucudan listeyi ister.",
    "Dosya paylaşım ağındaki cihazlar P2P ile birbirine doğrudan veri verir.",
  ],
  examples: [
    {
      title: "Basit bir istek ve yanıt",
      code: "İstemci → Sunucu : GET /index.html\nSunucu → İstemci : 200 OK  (sayfa içeriği)\n\nİstemci → Sunucu : GET /olmayan-sayfa\nSunucu → İstemci : 404 Not Found",
      note: "Sunucu her istek için bir sonuç bildirir: başarı veya hata.",
    },
    {
      title: "Web sayfası yükleme sırası",
      code: "1) DNS     : site.com → 203.0.113.10\n2) TCP/TLS : bağlantı kurma\n3) HTTP    : GET /\n4) Yanıt   : HTML\n5) Ek istekler: style.css, logo.png, app.js",
      note: "Tek bir sayfa onlarca istek-yanıt çiftinden oluşur.",
    },
  ],
  steps: [
    "Laboratuvarda soldaki istemciden sağdaki sunucuya bir istek seç (örn. GET /index.html).",
    "Sunucu 'Açık' durumdayken 'İsteği Gönder' düğmesine bas ve paketin gidiş-dönüşünü izle.",
    "Sunucuyu kapat ve aynı isteği tekrar gönder; zaman aşımı sonucunu gör.",
    "Olmayan bir sayfayı veya POST girişini dene ve yanıt kodlarını karşılaştır.",
  ],
  after: [
    "Sunucu kapalıyken istemci yanıt alamaz; bu merkezi sistemlerin tek hata noktası riskini gösterir.",
    "Her isteğin bir yanıtı vardır; başarı veya hata ayrımı yanıt kodundan anlaşılır.",
    "İstek ve yanıt akışı, sonraki derslerde göreceğimiz HTTP, DNS ve TCP'nin temelidir.",
  ],
  quiz: [
    Q("Aşağıdakilerden hangisi tipik bir istemcidir?", ["Web sunucusu", "Tarayıcı", "Yönlendirici kablosu", "Veritabanı diski"], 1, "Tarayıcı, sunucudan hizmet isteyen programdır, yani istemcidir."),
    Q("Client-Server modelinde sunucu genelde ne yapar?", ["Kendiliğinden herkese veri yollar", "İstekleri bekler ve yanıt verir", "Sadece kablo bağlar", "Hiç çalışmaz"], 1, "Sunucu istekleri dinler ve karşılığında yanıt döner."),
    Q("Merkezi sistemlerin en önemli riski nedir?", ["Yönetim kolaylığı", "Tek hata noktası", "Çok hızlı olması", "Güvenliğin hiç gerekmemesi"], 1, "Merkez sunucu çökerse tüm hizmet durabilir."),
    Q("Web sayfası açılırken ilk adım genellikle hangisidir?", ["Görsellerin çizilmesi", "Alan adının IP adresine çevrilmesi", "Sunucunun kapatılması", "Şifrenin silinmesi"], 1, "İlk adım DNS ile alan adının IP adresine çevrilmesidir."),
    Q("Bir tarayıcıda 404 yanıtı görüyorsanız ne olmuştur?", ["İstenen kaynak sunucuda bulunamamıştır", "Sunucu şifrelemeyi kapatmıştır", "İnternetiniz yoktur", "Bilgisayarınız bozuktur"], 0, "404, sunucuya ulaşıldığını ama istenen kaynağın bulunamadığını gösterir. İnternet kopuk olsaydı yanıt hiç gelmezdi."),
  ],
  summary: [
    "İstemci hizmet ister, sunucu hizmet verir.",
    "İletişim istek-yanıt döngüsüyle çalışır.",
    "Bir web sayfası birçok istek-yanıt çiftinden oluşur.",
    "Merkezi yapılar yönetimi kolaylaştırır ama tek hata noktası riski taşır.",
  ],
};

export const L4: Lesson = {
  id: 4,
  title: "Router, Switch ve Modem",
  minutes: 30,
  labTitle: "Ağ Topolojisi Kurma Laboratuvarı",
  purpose:
    "Modem, router, switch ve access point cihazlarının görevlerini ayırt etmek ve ev/kurumsal ağlarda doğru sıra ile bağlayabilmek.",
  outcomes: [
    "Modem, router, switch ve access point cihazlarının görevlerini açıklayabilirsin.",
    "Cihazlar arasındaki farkları anlatabilirsin.",
    "Basit bir ev ağını doğru sırayla kurabilirsin.",
    "Kurumsal ağlarda bu cihazların rolünü yorumlayabilirsin.",
  ],
  sections: [
    {
      h: "Modem: dış dünyaya açılan kapı",
      p: [
        "Modem (Modulator-Demodulator), evinizdeki dijital veriyi internet servis sağlayıcınızın kullandığı hat türüne (ADSL telefon hattı, kablo TV hattı veya fiber) uygun sinyale çevirir ve tersini yapar. Yani modem, evinizdeki ağ ile servis sağlayıcının ağı arasında bir çevirmen gibi çalışır. Modemsiz internet bağlantısı kurmak mümkün değildir; fiber altyapılarda bu cihaza ONT da denir.",
        "Modem tek başına cihazları yönetmez; sadece hat ile bağlantıyı sağlar. Günümüzde ISS'lerin verdiği cihazlar genellikle modem, router ve access point'i tek kutuda birleştirir. Bu yüzden 'modem' kelimesi günlük hayatta tüm bu görevleri kapsayacak şekilde kullanılır.",
      ],
    },
    {
      h: "Router: ağlar arası yönlendirme",
      p: [
        "Router (Yönlendirici), farklı ağları birbirine bağlar ve paketleri hedefe giden en uygun yola yönlendirir. Evinizde yerel ağ (LAN) ile internet (WAN) arasında kapı görevi görür. Cihazlarınıza yerel IP adresleri verir (DHCP), özel adresleri tek bir genel adrese çevirir (NAT) ve genellikle temel bir güvenlik duvarı sunar.",
        "Router ağın sınırında durur. Bu yüzden siber güvenlikte kritik bir noktadır: yönetici şifresinin güçlü olması ve yazılımının güncel tutulması gerekir. Kurumsal ağlarda router'lar VLAN'lar, şubeler ve internet arasında yönlendirmeyi yapar.",
      ],
    },
    {
      h: "Switch ve Access Point: yerel ağın içi",
      p: [
        "Switch (Ağ Anahtarı), aynı yerel ağdaki birden fazla kablolu cihazı birbirine bağlar. Gelen çerçevenin hedef MAC adresine bakarak onu yalnızca doğru porta iletir; böylece trafik gereksiz yere herkese yayılmaz. Switch'ler aynı ağ içinde iletişimi sağlar, ağlar arası yönlendirme yapmaz (temel switch'ler için).",
        "Access Point (Erişim Noktası – AP) kablolu ağı kablosuz (Wi-Fi) ağa genişletir. Evlerde router içinde hazır gelir; ofis ve okullarda ise tavanlara yerleştirilen ayrı cihazlar olarak kullanılır. Küçük bir ev ağında hepsi tek kutuda olabilir; kurumsal ağlarda her cihaz ayrı, güçlü ve yönetilebilir donanımlardır.",
        "Özetle doğru sıra şudur: İnternet → Modem → Router → Switch → Bilgisayarlar; Router/Switch'e bağlı AP → Kablosuz cihazlar.",
      ],
    },
  ],
  concepts: [
    ["Modem", "Hat sinyalini dijital veriye çeviren, ISS bağlantısını sağlayan cihaz."],
    ["Router", "Ağlar arası yönlendirme, DHCP, NAT ve ağ geçidi görevi yapan cihaz."],
    ["Switch", "Aynı ağdaki cihazları MAC adreslerine göre bağlayan cihaz."],
    ["Access Point", "Kablolu ağı Wi-Fi olarak yayınlayan erişim noktası."],
    ["ONT", "Fiber hatlarda modem görevi gören uç cihaz."],
    ["Port", "Cihaz üzerindeki fiziksel kablo giriş yuvası."],
  ],
  daily: [
    "Evdeki servis sağlayıcı kutusu çoğunlukla modem + router + AP birleşimidir.",
    "Okul laboratuvarındaki masaların altındaki küçük kutu bir switch'tir.",
    "Kafedeki tavan cihazı genellikle bir access point'tir.",
    "Fiber hat evinize girince duvardaki küçük kutu ONT'tir.",
  ],
  examples: [
    {
      title: "Doğru ev ağı bağlantı sırası",
      code: "İnternet (ISS) ── Modem ── Router ── Switch ── PC\n                              └── Access Point ~~~ Laptop (Wi-Fi)",
      note: "Router, modem ile yerel ağ arasında durur. Switch ve AP, router'ın arkasında yerel ağı genişletir.",
    },
    {
      title: "Cihaz görev karşılaştırması",
      code: "Modem  : Hat ↔ Dijital sinyal\nRouter : Ağ ↔ Ağ (IP ile yönlendirme)\nSwitch : Cihaz ↔ Cihaz (MAC ile iletme)\nAP     : Kablolu ↔ Kablosuz",
      note: "Her cihazın ayrı bir görevi vardır; birbirinin yerine geçmezler.",
    },
  ],
  steps: [
    "Laboratuvarda İnternet, Modem, Router, Switch, Access Point, Bilgisayar ve Dizüstü cihazlarını göreceksin.",
    "İki cihaza sırayla tıklayarak aralarına kablo çek.",
    "Yanlış bir bağlantı yaparsan çıkan açıklayıcı geri bildirimi oku.",
    "Altı doğru bağlantıyı tamamlayınca 'Ağ çalışıyor' mesajını göreceksin; istersen sıfırlayıp tekrar dene.",
  ],
  after: [
    "Modem router'a, router switch/AP'ye bağlanır; sıra bozulursa trafik doğru akmaz.",
    "Bilgisayar doğrudan modeme bağlanırsa NAT, DHCP ve güvenlik duvarı gibi router işlevleri devre dışı kalır.",
    "Gerçek ev cihazlarında bu işlevler tek kutuda birleşir ama mantık aynıdır.",
  ],
  quiz: [
    Q("İnternet hattından gelen sinyali çeviren cihaz hangisidir?", ["Switch", "Modem", "Yazıcı", "Hub kablosu"], 1, "Modem, ISS hattı ile dijital ağ arasında sinyal çevirisi yapar."),
    Q("Farklı ağlar arasında paket yönlendiren cihaz hangisidir?", ["Router", "Switch", "Access Point", "Modem"], 0, "Yönlendirme router'ın ana görevidir. Switch aynı ağ içinde, AP ise kablosuz erişim için çalışır."),
    Q("Switch hangi bilgiye bakarak çerçeveyi iletir?", ["Alan adı", "MAC adresi", "Web sitesi içeriği", "Şifre"], 1, "Switch, hedef MAC adresine göre çerçeveyi doğru porta iletir."),
    Q("Access Point'in görevi nedir?", ["İnternet hattını çevirmek", "Ağlar arası yönlendirme yapmak", "Kablolu ağı kablosuz erişime açmak", "Alan adı çözmek"], 2, "AP, kablolu ağı Wi-Fi olarak yayınlar."),
    Q("Doğru bağlantı sırası hangisidir?", ["Switch → Modem → Router → İnternet", "İnternet → Modem → Router → Switch → Bilgisayar", "Bilgisayar → İnternet → Router", "Router → Bilgisayar → Modem"], 1, "İnternet hattı önce modeme, sonra router'a, onun arkasında switch ve cihazlara gider."),
  ],
  summary: [
    "Modem hat bağlantısı, router ağlar arası yönlendirme sağlar.",
    "Switch aynı ağdaki kablolu cihazları, AP kablosuz cihazları bağlar.",
    "Ev cihazları bu görevleri tek kutuda birleştirir.",
    "Router ağın sınırıdır; güvenliği kritiktir.",
  ],
};
