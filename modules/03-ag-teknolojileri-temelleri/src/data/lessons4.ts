import { Q, type Lesson } from "./types";

export const L13: Lesson = {
  id: 13,
  title: "Port Kavramı",
  minutes: 30,
  labTitle: "Port Eşleştirme ve Yerel Port Tablosu",
  purpose:
    "Portların bir cihazdaki farklı servisleri nasıl ayırdığını öğrenmek, yaygın port numaralarını tanımak ve açık portların güvenlik anlamını yorumlayabilmek.",
  outcomes: [
    "Port kavramını ve IP adresiyle ilişkisini açıklayabilirsin.",
    "TCP ve UDP portlarının farkını anlatabilirsin.",
    "Well-Known portları (0–1023) tanıyabilirsin.",
    "FTP, SSH, Telnet, SMTP, DNS, HTTP, POP3, IMAP, HTTPS ve RDP portlarını eşleştirebilirsin.",
    "Açık bir portun neden güvenlik açısından önemli olduğunu söyleyebilirsin.",
  ],
  sections: [
    {
      h: "Port nedir?",
      p: [
        "Bir sunucunun tek bir IP adresi vardır ama aynı anda web sitesi, e-posta, dosya paylaşımı ve uzaktan yönetim gibi birçok hizmeti sunabilir. Gelen paketin bu hizmetlerden hangisine ait olduğunu belirleyen sayıya port (bağlantı noktası) denir. Port, 0 ile 65535 arasında 16 bitlik bir sayıdır. IP adresi binayı, port ise o binadaki daire numarasını gösterir.",
        "Bir bağlantı dört bilgiyle tanımlanır: kaynak IP, kaynak port, hedef IP ve hedef port. İstemci genellikle rastgele yüksek bir kaynak port (ephemeral port, örn. 52144) seçer ve sunucunun hizmet portuna bağlanır (örn. 443). Bu sayede aynı sunucuya aynı anda birçok sekme ve uygulama bağlanabilir.",
      ],
    },
    {
      h: "TCP/UDP portları ve port aralıkları",
      p: [
        "TCP ve UDP'nin portları birbirinden bağımsızdır: TCP 53 ile UDP 53 farklı kapılardır (DNS her ikisini de kullanır). Port aralıkları üçe ayrılır: 0–1023 Well-Known (Bilinen) portlar, standart servislere ayrılmıştır; 1024–49151 Registered (Kayıtlı) portlar, uygulamalara ayrılmıştır; 49152–65535 Dynamic/Private portlar, istemcilerin geçici bağlantıları için kullanılır.",
        "Bir portun durumu üç şekilde olabilir: Açık (open) – bir servis dinliyor ve bağlantı kabul ediyor; Kapalı (closed) – dinleyen servis yok; Filtreli (filtered) – güvenlik duvarı paketleri engelliyor. Servislerin standart portları şunlardır: FTP 20/21, SSH 22, Telnet 23, SMTP 25, DNS 53, HTTP 80, POP3 110, IMAP 143, HTTPS 443, RDP 3389.",
      ],
    },
    {
      h: "Servis ve port ilişkisi, güvenlik",
      p: [
        "Servislerin sabit port kullanması istemcilerin onları kolayca bulmasını sağlar; fakat saldırganlar da aynı mantıkla hangi portların açık olduğuna bakarak hedef sistem hakkında bilgi toplar. Bu nedenle açık her port bir saldırı yüzeyidir. Güvenlik ilkesi: yalnızca gerekli servisleri çalıştır, gerekmeyen portları kapat veya güvenlik duvarıyla sınırla.",
        "Şifresiz protokoller (Telnet 23, FTP 21, HTTP 80, POP3 110) bilgileri düz metin olarak taşır; yerlerine şifreli alternatifler (SSH 22, SFTP, HTTPS 443, POP3S/IMAPS) tercih edilmelidir. RDP (3389) internete açık bırakılırsa en sık saldırı gören hizmetlerden biridir. Bu derste kullanacağın port tablosu tamamen yerel bir simülasyondur; gerçek bir sistem taranmaz.",
      ],
    },
  ],
  concepts: [
    ["Port", "0–65535 arası, bir cihazdaki servisi belirleyen sayı."],
    ["Well-Known Ports", "0–1023 arası standart servis portları."],
    ["Ephemeral port", "İstemcinin geçici olarak seçtiği yüksek port."],
    ["Açık / Kapalı / Filtreli", "Portun dinleme ve erişilebilirlik durumu."],
    ["Soket", "IP adresi + port + protokol birleşimi."],
    ["Saldırı yüzeyi", "Saldırganın erişebileceği açık servislerin toplamı."],
  ],
  daily: [
    "Otel: bina IP adresidir, oda numarası porttur; resepsiyon (80), restoran (443), spa (22) gibi düşün.",
    "Çok hatlı santral: aynı numaraya aranır ama dahili numara kişiyi belirler.",
    "Evinizin kapısı kilitli olsa bile açık bir pencere (açık port) risk yaratır.",
  ],
  examples: [
    {
      title: "Yaygın servisler ve portlar",
      code: "20/21 FTP   | 22 SSH    | 23 Telnet | 25 SMTP\n53 DNS     | 80 HTTP   | 110 POP3  | 143 IMAP\n443 HTTPS  | 3389 RDP",
      note: "Bu on servis ağ ve siber güvenlikte en çok karşına çıkacak olanlardır.",
    },
    {
      title: "Bir bağlantının dörtlüsü",
      code: "Kaynak : 192.168.1.25:52144\nHedef  : 203.0.113.10:443\nProtokol: TCP",
      note: "Kaynak portun rastgele, hedef portun servise göre sabit olduğuna dikkat et.",
    },
  ],
  steps: [
    "Port eşleştirme bölümünde her servis için doğru port numarasını seç.",
    "'Kontrol Et' ile sonucu gör; yanlış eşleşmelerde doğru değeri ve nedeni oku.",
    "Örnek sunucu tablosunda 'Yerel Taramayı Başlat' düğmesine bas; açık servisler tek tek listelensin.",
    "Bir satıra tıklayarak servisin açıklamasını ve risk notunu gör, riskli servisleri belirle.",
  ],
  after: [
    "Aynı IP üzerindeki servisler portlarla ayrışır.",
    "Telnet ve FTP gibi şifresiz servislerin açık olması örnek sunucuda risk olarak işaretlendi.",
    "Port taraması yalnızca izinli sistemlerde yapılmalıdır; bu lab yerel bir simülasyondur.",
  ],
  quiz: [
    Q("HTTPS varsayılan olarak hangi portu kullanır?", ["80", "443", "22", "25"], 1, "HTTPS 443, HTTP 80'dir."),
    Q("SSH hangi portta çalışır?", ["21", "22", "23", "3389"], 1, "SSH 22, Telnet 23, FTP 21, RDP 3389'dur."),
    Q("Port numaraları hangi aralıktadır?", ["0–255", "0–1023", "0–65535", "1–1000"], 2, "Port 16 bittir: 0–65535. Well-known aralığı ise 0–1023'tür."),
    Q("Aşağıdakilerden hangisi şifresiz ve bu yüzden riskli bir uzaktan yönetim protokolüdür?", ["SSH", "HTTPS", "Telnet", "SFTP"], 2, "Telnet (23) bilgileri açık metin gönderir. SSH, HTTPS ve SFTP şifrelidir."),
    Q("E-posta gönderiminde kullanılan standart port hangisidir?", ["25 (SMTP)", "110 (POP3)", "143 (IMAP)", "53 (DNS)"], 0, "SMTP e-posta gönderir (25). POP3 ve IMAP e-posta alma içindir; DNS ad çözer."),
  ],
  summary: [
    "Port, bir cihazdaki servisi belirleyen 16 bitlik sayıdır.",
    "Well-Known portlar 0–1023 aralığındadır.",
    "Açık portlar saldırı yüzeyidir; şifresiz servisler riskli olabilir.",
  ],
};

export const L14: Lesson = {
  id: 14,
  title: "HTTP ve HTTPS",
  minutes: 40,
  labTitle: "HTTP İstek/Yanıt ve HTTPS Karşılaştırma Simülatörü",
  purpose:
    "Web iletişiminin temeli olan HTTP'yi, istek-yanıt yapısını, metotları, durum kodlarını ve HTTPS'in TLS ile sağladığı güvenliği öğrenmek.",
  outcomes: [
    "HTTP istek ve yanıt yapısını açıklayabilirsin.",
    "GET ve POST metotları arasındaki farkı anlatabilirsin.",
    "200, 301, 400, 401, 403, 404 ve 500 durum kodlarını yorumlayabilirsin.",
    "TLS ve HTTPS'in neden önemli olduğunu açıklayabilirsin.",
  ],
  sections: [
    {
      h: "HTTP nedir?",
      p: [
        "HTTP (Hypertext Transfer Protocol – Köprümetin Aktarım Protokolü), web istemcisi (tarayıcı) ile web sunucusu arasında veri taşıyan Uygulama katmanı protokolüdür. Metin tabanlıdır, istek-yanıt mantığıyla çalışır ve genellikle TCP 80 portunu kullanır. 'Durumsuz' (stateless) olduğu için sunucu her isteği bağımsız değerlendirir; oturumları hatırlamak için çerezler (cookies) ve token'lar kullanılır.",
        "Bir HTTP isteği üç parçadan oluşur: istek satırı (metot, yol, sürüm), başlıklar (Host, User-Agent, Cookie gibi bilgiler) ve isteğe bağlı gövde (form verisi gibi). Yanıt ise durum satırı (sürüm, durum kodu, açıklama), başlıklar (Content-Type gibi) ve gövdeden (HTML, JSON, görsel) oluşur.",
      ],
    },
    {
      h: "Metotlar ve durum kodları",
      p: [
        "GET, sunucudan veri okumak için kullanılır; parametreler URL'de görünür ve işlem sunucuda değişiklik yapmamalıdır. POST, sunucuya veri göndermek (form, giriş, kayıt) için kullanılır; veri isteğin gövdesindedir. Diğer metotlar: PUT (güncelle), DELETE (sil), HEAD (yalnız başlık), OPTIONS (desteklenenler). Şifre gibi hassas veriler GET ile URL'de gönderilmemelidir; çünkü URL geçmişte, günlüklerde ve bağlantılarda kalır.",
        "Durum kodları sonucu bildirir: 2xx başarı (200 OK), 3xx yönlendirme (301 Moved Permanently), 4xx istemci hatası (400 Bad Request – hatalı istek, 401 Unauthorized – kimlik doğrulama gerekli, 403 Forbidden – yetki yok, 404 Not Found – kaynak yok), 5xx sunucu hatası (500 Internal Server Error). 401 'sen kimsin?', 403 'kimsin biliyorum ama yetkin yok' demektir.",
      ],
    },
    {
      h: "HTTPS ve TLS",
      p: [
        "HTTP trafiği şifresizdir. Aynı ağdaki biri (örneğin halka açık Wi-Fi'de) paketleri izleyebilirse giriş bilgilerini düz metin olarak okuyabilir veya içeriği değiştirebilir. HTTPS (HTTP Secure), HTTP'yi TLS (Transport Layer Security) ile şifreleyen biçimidir ve genellikle 443 portunu kullanır. Tarayıcıdaki kilit simgesi TLS'in aktif olduğunu gösterir.",
        "TLS üç şey sağlar: gizlilik (veri şifrelenir), bütünlük (veri yolda değiştirilemez) ve kimlik doğrulama (sunucunun gerçekten iddia ettiği site olduğu sertifika ile doğrulanır). Basitçe: istemci ve sunucu el sıkışırken (handshake) sertifika kontrol edilir, ortak bir oturum anahtarı üzerinde anlaşılır ve sonrasındaki tüm HTTP verisi bu anahtarla şifrelenir. Bu yüzden HTTPS, özellikle giriş ve ödeme sayfalarında zorunludur. HTTPS sitenin güvenilir olduğunu değil, bağlantının güvenli olduğunu gösterir; sahte siteler de HTTPS kullanabilir.",
      ],
    },
  ],
  concepts: [
    ["HTTP", "Web istemci ve sunucusunun konuştuğu şifresiz protokol (port 80)."],
    ["HTTPS", "TLS ile şifrelenmiş HTTP (port 443)."],
    ["GET / POST", "Veri okuma / veri gönderme metotları."],
    ["Durum kodu", "Sunucunun isteğe verdiği sonucu belirten üç haneli kod."],
    ["TLS", "Gizlilik, bütünlük ve kimlik doğrulama sağlayan şifreleme protokolü."],
    ["Sertifika", "Sunucunun kimliğini kanıtlayan dijital belge."],
    ["Cookie", "Oturumu hatırlamak için tarayıcıda saklanan küçük veri."],
  ],
  daily: [
    "HTTP, kartpostal gibidir: postacı da okuyabilir. HTTPS, mühürlü zarf gibidir.",
    "401: kapıda kimlik sorulması. 403: kimlik gösterdin ama bu odaya giriş iznin yok.",
    "Alışveriş sitelerinde kart bilgisi HTTPS ile şifrelenir.",
  ],
  examples: [
    {
      title: "Örnek HTTP isteği ve yanıtı",
      code: "GET /index.html HTTP/1.1\nHost: www.ornek.com\nUser-Agent: Mozilla/5.0\n\nHTTP/1.1 200 OK\nContent-Type: text/html\nContent-Length: 1256\n\n<html>...</html>",
      note: "İstek ve yanıt başlık ile gövdeden oluşur.",
    },
    {
      title: "POST ile giriş",
      code: "POST /login HTTP/1.1\nHost: www.ornek.com\nContent-Type: application/x-www-form-urlencoded\n\nkullanici=ali&sifre=1234\n\nHTTP/1.1 302 Found\nLocation: /panel",
      note: "HTTP kullanılıyorsa gövdedeki şifre ağda düz metin olarak görünür.",
    },
  ],
  steps: [
    "Simülatörde metot (GET/POST) ve istek yolunu seç, 'İstek Gönder' ile ham isteği ve sunucu yanıtını gör.",
    "Durum kodu bölümünde 200, 301, 400, 401, 403, 404 ve 500 kodlarına tıklayarak tetikleyen senaryoyu ve çözümü incele.",
    "Karşılaştırma alanında kullanıcı adı ve şifre yaz; HTTP ve HTTPS modunda ağı dinleyen birinin neyi görebildiğini karşılaştır.",
  ],
  after: [
    "POST gövdesindeki bilgi HTTP'de okunabilir, HTTPS'de okunamaz.",
    "4xx hataları genellikle istemci tarafında, 5xx hataları sunucu tarafında aranır.",
    "HTTPS bağlantıyı korur ama sitenin sahte olmadığını tek başına garanti etmez.",
  ],
  quiz: [
    Q("Sayfa bulunamadığında dönen durum kodu hangisidir?", ["200", "301", "404", "500"], 2, "404 Not Found, istenen kaynağın sunucuda olmadığını bildirir."),
    Q("HTTPS varsayılan portu hangisidir?", ["80", "443", "21", "8080"], 1, "HTTPS 443 portunu kullanır; 80 HTTP'dir."),
    Q("Giriş formundaki şifre gibi hassas veri için hangisi daha uygundur?", ["GET ile URL'de göndermek", "HTTPS üzerinden POST ile göndermek", "HTTP üzerinden GET ile göndermek", "E-postayla yollamak"], 1, "Hassas veri URL'de değil gövdede ve şifreli kanalda (HTTPS) gönderilmelidir."),
    Q("401 ve 403 arasındaki fark nedir?", ["Fark yoktur", "401 kimlik doğrulama gerekir, 403 yetki yoktur", "401 sunucu hatası, 403 yönlendirmedir", "401 başarıdır"], 1, "401 'kimliğini doğrula', 403 'kimliğin belli ama yetkin yok' demektir."),
    Q("TLS'in sağladığı üçlü hangisidir?", ["Hız, boyut, renk", "Gizlilik, bütünlük, kimlik doğrulama", "IP, MAC, port", "Yedek, arşiv, silme"], 1, "TLS şifreleme ile gizlilik, değiştirilememe ile bütünlük, sertifika ile kimlik doğrulama sağlar."),
  ],
  summary: [
    "HTTP istek-yanıt temelli, durumsuz bir web protokolüdür.",
    "GET veri okur, POST veri gönderir; durum kodları sonucu bildirir.",
    "HTTPS = HTTP + TLS; gizlilik, bütünlük ve kimlik doğrulama sağlar.",
  ],
};

export const L15: Lesson = {
  id: 15,
  title: "Temel Ağ Protokolleri",
  minutes: 40,
  labTitle: "Protokol Eşleştirme ve Paket İnceleme Simülatörü",
  purpose:
    "Protokol kavramını ve en yaygın ağ protokollerinin ne işe yaradığını öğrenmek; örnek ağ senaryolarında doğru protokolü seçebilmek ve paket alanlarını okuyabilmek.",
  outcomes: [
    "Protokol kavramını ve standartların önemini açıklayabilirsin.",
    "ARP, ICMP, DNS, DHCP, FTP, SSH, SMTP, POP3, IMAP, HTTP, HTTPS ve NTP'yi tanımlayabilirsin.",
    "Bir senaryoya bakarak uygun protokolü belirleyebilirsin.",
    "Bir paketin kaynak, hedef, protokol ve bilgi alanlarını okuyabilirsin.",
  ],
  sections: [
    {
      h: "Protokol ve standart nedir?",
      p: [
        "Protokol, iki cihazın iletişim kurarken uyduğu kurallar kümesidir: mesajın biçimi, sırası, hata durumunda ne yapılacağı. Aynı dilde ve aynı kurallarla konuşmayan cihazlar birbirini anlayamaz. Bu kuralların ortak olması için IETF (RFC belgeleri), IEEE (Ethernet, Wi-Fi) ve ISO gibi kuruluşlar standartlar yayımlar. Standartlar sayesinde farklı üreticilerin cihazları sorunsuz birlikte çalışır.",
      ],
    },
    {
      h: "Altyapı protokolleri",
      p: [
        "ARP: Yerel ağda IP adresine karşılık gelen MAC adresini bulur. Günlük karşılığı: 'Bu numaralı daire kimde?' diye sormak. ICMP: Ağ hata ve tanılama mesajları taşır; ping komutu ICMP Echo kullanır. Karşılığı: kapıyı çalıp 'Orada mısın?' demek. DNS: Alan adlarını IP'ye çevirir (UDP/TCP 53) – telefon rehberi. DHCP: IP ayarlarını otomatik verir (UDP 67/68) – otel resepsiyonu. NTP: Cihazların saatlerini senkronize eder (UDP 123) – tüm şehirdeki saatleri ortak saate ayarlamak; log ve sertifika doğrulama için kritiktir.",
      ],
    },
    {
      h: "Uygulama protokolleri",
      p: [
        "HTTP/HTTPS (80/443): web sayfaları. FTP (20/21): dosya aktarımı; şifresizdir, güvenli alternatifi SFTP veya FTPS'tir. SSH (22): şifreli uzaktan komut satırı yönetimi; Telnet'in güvenli halefidir. SMTP (25, 587): e-posta gönderme – postaneye mektup bırakmak. POP3 (110): e-postayı sunucudan indirip genelde sunucudan siler. IMAP (143): e-postayı sunucuda tutar, birden fazla cihazdan senkron okumayı sağlar – posta kutusunu uzaktan görmek gibi.",
        "Güvenlik açısından her protokolün şifreli bir karşılığı olup olmadığını bilmek önemlidir: HTTP→HTTPS, Telnet→SSH, FTP→SFTP, POP3→POP3S, IMAP→IMAPS. Bir ağ trafiğini incelerken bir paketin kaynak/hedef adresine, protokol adına ve info alanına bakarak ne olup bittiğini anlayabilirsin. Bu derste gerçek trafik yakalanmaz; paketler tamamen örnek ve yereldir.",
      ],
    },
  ],
  concepts: [
    ["Protokol", "Cihazların iletişim için uyduğu kurallar."],
    ["RFC", "İnternet protokollerini tanımlayan standart belgeler."],
    ["ICMP / ping", "Ağ erişilebilirliğini test eden mesajlar."],
    ["NTP", "Ağ zaman senkronizasyon protokolü."],
    ["SMTP / POP3 / IMAP", "E-posta gönderme / indirme / sunucuda yönetme."],
    ["Paket alanları", "Kaynak, hedef, protokol ve bilgi (info) bölümleri."],
  ],
  daily: [
    "Protokol, diplomatik protokol gibidir: herkesin bildiği kurallar karışıklığı önler.",
    "Ping, 'Orada mısın?' diye seslenmektir; yanıt gelirse cihaz ulaşılabilirdir.",
    "SMTP posta kutusuna mektup atmak, IMAP ise kutudaki mektupları uzaktan okumaktır.",
  ],
  examples: [
    {
      title: "Basit paket listesi (örnek)",
      code: "No  Kaynak         Hedef          Protokol  Bilgi\n1   192.168.1.25   192.168.1.1    ICMP      Echo (ping) request\n2   192.168.1.1    192.168.1.25   ICMP      Echo (ping) reply\n3   192.168.1.25   8.8.8.8        DNS       Standard query A example.com",
      note: "Paket analiz araçları (Wireshark vb.) benzer bir tablo gösterir.",
    },
    {
      title: "Güvenli karşılıklar",
      code: "HTTP  → HTTPS\nTelnet→ SSH\nFTP   → SFTP / FTPS\nPOP3  → POP3S (995)\nIMAP  → IMAPS (993)",
      note: "Şifresiz protokollerin şifreli kardeşleri tercih edilmelidir.",
    },
  ],
  steps: [
    "Laboratuvarda bir ağ senaryosu okuyacaksın (ör. 'Bir bilgisayar yazıcının IP'sine ulaşılabilir mi test ediyor').",
    "Dört seçenekten doğru protokolü seç.",
    "Cevabından sonra ilgili paketin kaynak, hedef, protokol ve bilgi alanlarını incele.",
    "Tüm senaryoları tamamlayıp puanını gör ve gerekirse yeniden dene.",
  ],
  after: [
    "Aynı ağ işleminin hangi protokolle yapıldığı paket başlığından anlaşılır.",
    "Senaryo anahtar kelimeleri (saat, IP atama, e-posta gönderme) protokolü işaret eder.",
    "Paket incelemek sorun giderme ve olay analizinin temel becerisidir.",
  ],
  quiz: [
    Q("Ağ üzerindeki cihazların saatini senkronize eden protokol hangisidir?", ["NTP", "SMTP", "ARP", "FTP"], 0, "NTP (Network Time Protocol) zaman senkronizasyonu için kullanılır."),
    Q("E-postayı sunucuda tutarak birden çok cihazdan okumayı sağlayan protokol hangisidir?", ["SMTP", "IMAP", "FTP", "ICMP"], 1, "IMAP e-postayı sunucuda bırakır; SMTP gönderir, POP3 genelde indirir."),
    Q("Ping komutu hangi protokolü kullanır?", ["ICMP", "DHCP", "HTTP", "SSH"], 0, "Ping, ICMP Echo Request/Reply mesajlarını kullanır."),
    Q("Telnet'in güvenli alternatifi hangisidir?", ["FTP", "SSH", "HTTP", "POP3"], 1, "SSH, uzaktan yönetimi şifreli yapar; Telnet düz metin kullanır."),
    Q("IP adresinden MAC adresini bulan protokol hangisidir?", ["DNS", "DHCP", "ARP", "NTP"], 2, "ARP, IP→MAC çözümlemesi yapar. DNS ad→IP, DHCP IP atar."),
  ],
  summary: [
    "Protokoller iletişim kurallarıdır; standartlar birlikte çalışmayı sağlar.",
    "ARP, ICMP, DNS, DHCP, NTP altyapıyı; HTTP, FTP, SSH, SMTP, POP3, IMAP uygulamaları yürütür.",
    "Şifresiz protokollerin şifreli karşılıkları tercih edilmelidir.",
  ],
};

export const L16: Lesson = {
  id: 16,
  title: "Ağ Topolojileri",
  minutes: 35,
  labTitle: "Etkileşimli Ağ Topolojisi Oluşturucu",
  purpose:
    "Cihazların birbirine bağlanma düzenini (topoloji) öğrenmek; Bus, Star, Ring, Mesh, Tree ve Hybrid yapılarının avantaj, dezavantaj ve arıza davranışlarını karşılaştırmak.",
  outcomes: [
    "Fiziksel ve mantıksal topoloji arasındaki farkı açıklayabilirsin.",
    "Altı temel topolojiyi tanıyabilirsin.",
    "Her topolojinin avantaj, dezavantaj ve kullanım alanlarını sayabilirsin.",
    "Bir kablo veya cihaz arızasının topolojiyi nasıl etkilediğini yorumlayabilirsin.",
  ],
  sections: [
    {
      h: "Topoloji nedir?",
      p: [
        "Ağ topolojisi, ağdaki cihazların ve bağlantıların düzenlenme biçimidir. Fiziksel topoloji kabloların ve cihazların gerçek yerleşimidir (odalardan geçen kablolar, dolaptaki switch). Mantıksal topoloji ise verinin ağda nasıl aktığıdır. Örneğin fiziksel olarak yıldız (star) görünen modern bir Ethernet ağı, mantıksal olarak veriyi tüm cihazlara yayan eski bir yolu taklit edebilir.",
        "Topoloji seçimi maliyeti, performansı, arızaya dayanıklılığı ve genişletilebilirliği doğrudan etkiler. Siber güvenlikte kritik soru şudur: bir cihaz veya bağlantı koparsa ağ ne olur? Yani tek hata noktası var mı?",
      ],
    },
    {
      h: "Bus, Star ve Ring",
      p: [
        "Bus (Veri Yolu): Tüm cihazlar tek bir ana kabloya (omurga) bağlanır. Ucuz ve basittir; fakat ana kablo koparsa ağ ikiye bölünür, çok cihazda performans düşer ve arıza bulmak zordur. Eski Ethernet ağlarında kullanılırdı. Star (Yıldız): Tüm cihazlar merkezî bir switch'e bağlanır. Kurulumu ve yönetimi kolaydır, bir cihazın arızası diğerlerini etkilemez; ancak merkez (switch) bozulursa tüm ağ çöker. Bugün ev ve ofislerde en yaygın topolojidir.",
        "Ring (Halka): Her cihaz iki komşusuna bağlanır ve veri halka boyunca döner. Düzenli veri akışı sağlar ama tek halkada bir cihaz veya kablo arızası tüm halkayı kesebilir (çift halkalı yapılar bunu azaltır). Token Ring ve FDDI örnektir.",
      ],
    },
    {
      h: "Mesh, Tree ve Hybrid",
      p: [
        "Mesh (Örgü): Cihazlar birbirine çok sayıda bağlantıyla bağlanır. Tam örgüde her cihaz her cihaza bağlıdır; bir bağlantı koparsa trafik başka yoldan akar. Çok dayanıklıdır fakat çok pahalı ve karmaşıktır. İnternet omurgası, kritik veri merkezleri ve Wi-Fi mesh sistemleri örnektir. Tree (Ağaç): Hiyerarşik yapıdır; ana switch altında alt switch'ler ve onların altında cihazlar vardır. Okul ve kampüs ağlarında yaygındır; üst düğüm koparsa altındaki tüm dallar ağdan kopar.",
        "Hybrid (Hibrit): Birden fazla topolojinin birleşimidir. Gerçek ağların çoğu hibrittir: örneğin merkezde mesh bir omurga, katlarda star yapılar. Hibrit yapı esnektir ve ihtiyaca göre ölçeklenir. Yeni ağ tasarlarken tek hata noktalarını belirleyip yedekli (redundant) bağlantılar eklemek güvenilirliği artırır.",
      ],
    },
  ],
  concepts: [
    ["Topoloji", "Ağ cihaz ve bağlantılarının düzeni."],
    ["Fiziksel topoloji", "Kabloların ve cihazların gerçek yerleşimi."],
    ["Mantıksal topoloji", "Verinin ağda dolaşma biçimi."],
    ["Tek hata noktası", "Arızalandığında ağın çalışmasını durduran bileşen."],
    ["Yedeklilik", "Alternatif yol veya cihaz bulundurma."],
    ["Omurga (Backbone)", "Ağın ana taşıyıcı bağlantısı."],
  ],
  daily: [
    "Bus: tek bir otoyola bağlanan evler; yol kapanırsa herkes etkilenir.",
    "Star: bir meydandan çıkan sokaklar; meydan kapanırsa herkes birbirinden kopar.",
    "Mesh: şehirdeki çok sayıda alternatif yol; biri kapanınca başkası kullanılır.",
  ],
  examples: [
    {
      title: "Topoloji özet tablosu",
      code: "Bus   : tek omurga      | ucuz            | omurga arızası ağı böler\nStar  : merkez switch   | yönetimi kolay  | merkez = tek hata noktası\nRing  : halka           | düzenli akış    | tek halkada kesinti sorun\nMesh  : çoklu bağlantı  | çok dayanıklı   | pahalı, karmaşık\nTree  : hiyerarşi       | ölçeklenebilir  | üst düğüm arızası dalı koparır\nHybrid: karışık         | esnek           | tasarımı karmaşık",
      note: "Hiçbir topoloji her durumda en iyisi değildir; ihtiyaç ve bütçeye göre seçilir.",
    },
    {
      title: "Hata analizi mantığı",
      code: "Star'da  PC3 arızası  → sadece PC3 kopar\nStar'da  switch arızası → tüm ağ durur\nMesh'te  bir kablo kopar → trafik alternatif yola kayar",
      note: "Arıza etkisi, topolojinin en önemli ölçütlerinden biridir.",
    },
  ],
  steps: [
    "Laboratuvarda Bus, Star, Ring, Mesh, Tree veya Hybrid topolojisini seç ve bağlantı yapısını incele.",
    "Bir cihaza tıklayarak arıza oluştur, bir bağlantıya tıklayarak kabloyu kes.",
    "Kaynak ve hedef cihaz seçip 'Paket Gönder' ile paketin izlediği yolu animasyonla gör; ulaşılamıyorsa nedenini oku.",
    "Analiz kutusundan ulaşılabilir cihaz sayısını ve ağın bölünüp bölünmediğini karşılaştır. Aynı arızayı farklı topolojilerde dene.",
  ],
  after: [
    "Aynı arıza farklı topolojilerde çok farklı sonuçlar doğurur.",
    "Mesh ve Hybrid yapılar alternatif yol sağladığı için daha dayanıklıdır; Star'da merkez, Bus'ta omurga kritiktir.",
    "Yedeklilik eklemek maliyeti artırır; güvenilirlik ve bütçe dengelenmelidir.",
  ],
  quiz: [
    Q("Tüm cihazların merkezî bir switch'e bağlandığı topoloji hangisidir?", ["Bus", "Star", "Ring", "Mesh"], 1, "Star (yıldız) topolojisinde merkezde switch bulunur."),
    Q("Bus topolojisinde ana kablo koparsa ne olur?", ["Hiçbir şey olmaz", "Ağ iki parçaya bölünebilir", "Hız artar", "Cihazlar otomatik şifrelenir"], 1, "Omurga arızası ağı bölebilir veya tamamen durdurabilir."),
    Q("Hangisi en yüksek arıza toleransına sahiptir?", ["Bus", "Mesh", "Star merkezli", "Tek halka"], 1, "Mesh yapıda alternatif yollar vardır, bu yüzden bir arıza trafiği durdurmaz."),
    Q("Star topolojisinin en büyük zayıflığı nedir?", ["Yönetim zorluğu", "Merkez cihazın tek hata noktası olması", "Çok ucuz olması", "Wi-Fi kullanması"], 1, "Merkez switch bozulursa tüm cihazların bağlantısı kesilir."),
    Q("Birden fazla topolojinin birleşimine ne denir?", ["Tree", "Ring", "Hybrid", "Bus"], 2, "Birleşik yapılar Hybrid (hibrit) topolojidir."),
  ],
  summary: [
    "Topoloji, ağın bağlantı düzenidir; fiziksel ve mantıksal olarak ayrılır.",
    "Bus, Star, Ring, Mesh, Tree ve Hybrid temel biçimlerdir.",
    "Arıza davranışı ve tek hata noktaları topoloji seçiminde belirleyicidir.",
  ],
};
