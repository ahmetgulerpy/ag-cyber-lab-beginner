import { Q, type Lesson } from "./types";

export const L5: Lesson = {
  id: 5,
  title: "OSI Modeli",
  minutes: 40,
  labTitle: "OSI Katman Simülasyonu",
  purpose:
    "Ağ iletişimini yedi katmana bölen OSI modelini öğrenmek; verinin gönderen cihazda katmanlardan aşağı inip alıcı cihazda yukarı çıkarken nasıl işlendiğini anlamak.",
  outcomes: [
    "OSI modelinin neden var olduğunu açıklayabilirsin.",
    "Yedi katmanı sırasıyla ve görevleriyle sayabilirsin.",
    "Her katmana örnek protokol ve cihaz eşleştirebilirsin.",
    "Kapsülleme (encapsulation) ve kapsül açma (decapsulation) kavramlarını anlatabilirsin.",
    "Bir ağ sorununun hangi katmanda olabileceğini yorumlayabilirsin.",
  ],
  sections: [
    {
      h: "OSI modeli neden var?",
      p: [
        "Ağ iletişimi çok karmaşıktır: elektrik sinyalleri, kablolar, adresler, güvenilir aktarım, şifreleme, uygulamalar... Bunların hepsini tek bir bütün olarak tasarlamak imkânsıza yakındır. OSI (Open Systems Interconnection – Açık Sistemler Arası Bağlantı) modeli, ISO tarafından geliştirilmiş, ağ iletişimini yedi katmana bölen kavramsal bir modeldir. Her katmanın tek bir görevi vardır ve yalnızca kendi altındaki ve üstündeki katmanla konuşur.",
        "Bu bölme sayesinde farklı üreticilerin ürünleri birlikte çalışır, bir katmandaki değişiklik diğerlerini bozmaz ve sorun giderme kolaylaşır. 'Wi-Fi çalışıyor ama web sitesi açılmıyor' dediğinde sorunu bir katmana yerleştirerek aramaya başlayabilirsin.",
      ],
    },
    {
      h: "Yedi katman",
      p: [
        "7 – Uygulama (Application): Kullanıcının doğrudan etkileştiği ağ hizmetleri; HTTP, SMTP, DNS, FTP. Günlük örnek: postaneye gönderi bırakma isteğin. 6 – Sunum (Presentation): Verinin biçimi, şifrelenmesi ve sıkıştırılması; TLS, JPEG, ASCII/UTF-8. Örnek: mektubu karşı tarafın anlayacağı dile çevirmek. 5 – Oturum (Session): İletişim oturumlarının açılması, sürdürülmesi ve kapatılması. Örnek: telefon görüşmesini başlatıp bitirmek.",
        "4 – Taşıma (Transport): Uçtan uca aktarım; TCP ve UDP, port numaraları, parçalama ve güvenilirlik. Örnek: kargo firması paketleri numaralandırıp teslimatı doğrular. 3 – Ağ (Network): Mantıksal adreslendirme ve yönlendirme; IP, ICMP, router. Örnek: şehirler arası rota. 2 – Veri Bağlantısı (Data Link): Aynı ağdaki cihazlar arası çerçeve (frame) iletimi, MAC adresleri, switch, Ethernet. Örnek: mahalle içindeki kapı numarası. 1 – Fiziksel (Physical): Bitlerin elektrik, ışık veya radyo sinyali olarak taşınması; kablo, fiber, Wi-Fi radyosu, hub.",
        "Katman sırasını akılda tutmak için İngilizce ilk harfleri kullanılır: Please Do Not Throw Sausage Pizza Away (Physical, Data link, Network, Transport, Session, Presentation, Application).",
      ],
    },
    {
      h: "Verinin katmanlar arasındaki yolculuğu",
      p: [
        "Gönderen cihazda veri Uygulama katmanından Fiziksel katmana doğru iner. Her katman veriye kendi başlık (header) bilgisini ekler; buna kapsülleme (encapsulation) denir. Taşıma katmanında veri bölünüp port bilgisi içeren bir segment olur; Ağ katmanında IP adresleri eklenerek paket olur; Veri Bağlantısı katmanında MAC adresleri eklenerek çerçeve (frame) olur; Fiziksel katmanda ise bitlere dönüşür.",
        "Alıcı cihazda süreç tersine işler: bitler çerçeveye, çerçeve pakete, paket segmente dönüşür ve her katman kendi başlığını okuyup çıkarır (kapsül açma – decapsulation). Sonunda uygulama orijinal veriyi alır. Güvenlik açısından bu önemlidir: güvenlik duvarı IP/port (3. ve 4. katman) bakar, web uygulama güvenlik duvarı ise 7. katmana bakar.",
      ],
    },
  ],
  concepts: [
    ["Katman (Layer)", "Ağ iletişiminin belirli bir görevi üstlenen bölümü."],
    ["Kapsülleme", "Verinin her katmanda yeni bir başlık eklenerek sarılması."],
    ["PDU", "Her katmandaki veri birimi: Veri, Segment, Paket, Çerçeve, Bit."],
    ["Segment", "Taşıma katmanındaki veri birimi (TCP/UDP başlığı + veri)."],
    ["Paket (Packet)", "Ağ katmanındaki veri birimi (IP başlığı + segment)."],
    ["Çerçeve (Frame)", "Veri bağlantısı katmanındaki veri birimi (MAC başlığı + paket)."],
  ],
  daily: [
    "Posta sistemi: mektup yazarsın (uygulama), zarfa koyarsın, adres yazarsın (ağ), kargo aracına yüklenir (fiziksel).",
    "Telefon görüşmesi: konuşma dilini seçme (sunum), aramayı başlatma/bitirme (oturum), hat üzerinden ses taşıma (fiziksel).",
    "Matruşka bebekleri: her katman veriyi bir kabuk daha sarar.",
  ],
  examples: [
    {
      title: "Katmanlar ve veri birimleri",
      code: "7 Uygulama      Veri       HTTP, DNS, SMTP\n6 Sunum         Veri       TLS, JPEG\n5 Oturum        Veri       NetBIOS, RPC\n4 Taşıma        Segment    TCP, UDP\n3 Ağ            Paket      IP, ICMP\n2 Veri Bağl.    Çerçeve    Ethernet, ARP\n1 Fiziksel      Bit        Kablo, Wi-Fi",
      note: "Yukarıdan aşağıya her katman kendi başlığını ekler.",
    },
    {
      title: "Sorun giderme: katman katman düşün",
      code: "Kablo takılı mı?            → Katman 1\nSwitch/MAC sorunu var mı?   → Katman 2\nIP adresi alındı mı? ping?  → Katman 3\nPort açık mı?               → Katman 4\nTarayıcı/HTTP hatası mı?    → Katman 7",
      note: "Alttan yukarıya doğru kontrol etmek sorunu hızla daraltır.",
    },
  ],
  steps: [
    "Laboratuvarda gönderilecek bir mesaj yaz veya hazır olanı kullan.",
    "'Gönder' düğmesine bas veya adım adım ilerle; veri gönderen tarafta 7'den 1'e doğru iner, her katmanda başlık eklenir.",
    "Alıcı tarafta veri 1'den 7'ye doğru çıkarken başlıkların tek tek açılmasını izle.",
    "Herhangi bir katmana tıkla; görevini, örnek protokollerini ve çalışma mantığını sağ panelde oku.",
  ],
  after: [
    "Her katman yalnızca kendi başlığını okur; diğer katmanların başlıklarına dokunmaz.",
    "Gönderendeki katman N, alıcıdaki katman N ile mantıksal olarak 'konuşur'.",
    "Gerçek dünyada veri her adımda daha büyük hale gelir; bu ek bilgiye ek yük (overhead) denir.",
  ],
  quiz: [
    Q("OSI modelinde kaç katman vardır?", ["4", "5", "7", "9"], 2, "OSI modeli yedi katmandır. Dört katman TCP/IP modelinde bulunur."),
    Q("IP adresleri ve yönlendirme hangi katmanda ele alınır?", ["Fiziksel", "Ağ", "Oturum", "Sunum"], 1, "Mantıksal adresleme ve yönlendirme Ağ (3.) katmandadır."),
    Q("TCP ve UDP hangi katmanda çalışır?", ["Taşıma", "Veri Bağlantısı", "Uygulama", "Fiziksel"], 0, "TCP ve UDP uçtan uca aktarımı sağlayan Taşıma (4.) katmanı protokolleridir."),
    Q("Verinin her katmanda başlık eklenerek sarılmasına ne denir?", ["Şifreleme", "Kapsülleme", "Yönlendirme", "Çözümleme"], 1, "Başlık ekleyerek sarma işlemi kapsüllemedir (encapsulation). Şifreleme ayrı bir işlemdir."),
    Q("Switch ve MAC adresleri OSI'nin hangi katmanıyla ilişkilidir?", ["Katman 1", "Katman 2", "Katman 5", "Katman 7"], 1, "Switch'ler ve MAC adresleri Veri Bağlantısı (2.) katmanında çalışır."),
  ],
  summary: [
    "OSI ağ iletişimini yedi katmana böler: Fiziksel, Veri Bağlantısı, Ağ, Taşıma, Oturum, Sunum, Uygulama.",
    "Gönderen tarafta veri kapsüllenir, alıcı tarafta kapsül açılır.",
    "Katmanlı yapı sorun gidermeyi ve birlikte çalışabilirliği kolaylaştırır.",
  ],
};

export const L6: Lesson = {
  id: 6,
  title: "TCP/IP Modeli",
  minutes: 30,
  labTitle: "OSI – TCP/IP Karşılaştırma Laboratuvarı",
  purpose:
    "İnternetin gerçekte kullandığı TCP/IP modelini öğrenmek ve OSI modeliyle katman eşleştirmesini yapabilmek.",
  outcomes: [
    "TCP/IP modelinin dört katmanını sayabilirsin.",
    "Her katmanın görevini ve örnek protokolünü anlatabilirsin.",
    "OSI ile TCP/IP katmanlarını eşleştirebilirsin.",
    "İki model arasındaki temel farkları açıklayabilirsin.",
  ],
  sections: [
    {
      h: "TCP/IP nedir?",
      p: [
        "TCP/IP (Transmission Control Protocol / Internet Protocol), internetin ve günümüz yerel ağlarının gerçekte kullandığı protokol ailesidir. OSI modeli ağı anlatan kavramsal bir referanstır; TCP/IP ise 1970'lerde ABD savunma araştırma projesi (ARPANET) kapsamında geliştirilen ve fiilen uygulanan modeldir. Bir web sitesine girdiğinde, e-posta gönderdiğinde ya da video izlediğinde arka planda çalışan model TCP/IP'dir.",
        "TCP/IP dört katmandan oluşur ve OSI'nin yedi katmanını daha sade bir yapıda toplar. Pratikte ağ mühendisleri her iki modeli de kullanır: kavramsal anlatımda OSI, gerçek protokollerde TCP/IP.",
      ],
    },
    {
      h: "TCP/IP'nin dört katmanı",
      p: [
        "Uygulama Katmanı (Application Layer): Kullanıcıya hizmet sunan protokoller burada çalışır: HTTP, HTTPS, DNS, DHCP, SMTP, FTP, SSH. OSI'nin Uygulama, Sunum ve Oturum katmanlarını kapsar. Verinin biçimlendirilmesi ve oturum yönetimi de bu katmanın uygulamalarına bırakılmıştır.",
        "Taşıma Katmanı (Transport Layer): TCP ve UDP ile uçtan uca iletişimi sağlar, port numaralarını kullanır. OSI'nin Taşıma katmanına karşılık gelir. İnternet Katmanı (Internet Layer): IP adreslemesi ve yönlendirme burada yapılır; IP, ICMP ve (genellikle) ARP bu bölgededir. OSI'nin Ağ katmanına karşılık gelir.",
        "Ağ Erişim Katmanı (Network Access / Link Layer): Fiziksel ortam ve yerel ağ erişimini kapsar: Ethernet, Wi-Fi, MAC adresleri, kablo. OSI'nin Veri Bağlantısı ve Fiziksel katmanlarına karşılık gelir.",
      ],
    },
    {
      h: "OSI ile TCP/IP arasındaki farklar",
      p: [
        "OSI yedi, TCP/IP dört katmandır. OSI protokollerden önce tasarlanmış teorik bir referanstır; TCP/IP ise önce protokoller geliştirilip sonra modellenmiştir. OSI'de oturum ve sunum ayrı katmanlardır; TCP/IP'de bunlar uygulama katmanında birleşmiştir. OSI'de Fiziksel ve Veri Bağlantısı ayrıdır, TCP/IP'de tek katmanda (Ağ Erişim) toplanır.",
        "Siber güvenlik eğitimlerinde ve sertifikalarda her iki modelden de sorular gelir. Bu yüzden hangi OSI katmanının hangi TCP/IP katmanına karşılık geldiğini bilmek önemlidir. Kural: Uygulama + Sunum + Oturum = Uygulama; Taşıma = Taşıma; Ağ = İnternet; Veri Bağlantısı + Fiziksel = Ağ Erişim.",
      ],
    },
  ],
  concepts: [
    ["TCP/IP", "İnternetin kullandığı dört katmanlı protokol ailesi/modeli."],
    ["Uygulama Katmanı", "HTTP, DNS gibi kullanıcıya yönelik protokoller (OSI 5-6-7)."],
    ["Taşıma Katmanı", "TCP/UDP, portlar (OSI 4)."],
    ["İnternet Katmanı", "IP adresleme ve yönlendirme (OSI 3)."],
    ["Ağ Erişim Katmanı", "Ethernet, Wi-Fi, MAC (OSI 1-2)."],
    ["Protokol takımı", "Birlikte çalışan protokollerin tamamı (TCP/IP suite)."],
  ],
  daily: [
    "Bir şehir haritasını iki farklı ölçekte düşün: OSI ayrıntılı harita, TCP/IP sade yol haritası.",
    "Mektup gönderirken posta kodu IP'ye, kapı numarası MAC'e benzer; her ikisi de farklı katmanlarda kullanılır.",
    "Bir web sitesi açıldığında dört katmanın hepsi sırayla görev yapar.",
  ],
  examples: [
    {
      title: "Katman eşleştirmesi",
      code: "OSI                   TCP/IP\n7 Uygulama   ┐\n6 Sunum      ├──►  Uygulama\n5 Oturum     ┘\n4 Taşıma     ───►  Taşıma\n3 Ağ         ───►  İnternet\n2 Veri Bağl. ┐\n1 Fiziksel   ┘──►  Ağ Erişim",
      note: "OSI'nin yedi katmanı TCP/IP'de dörde indirgenir.",
    },
    {
      title: "Bir web isteğinin katmanları",
      code: "Uygulama  : HTTP GET /\nTaşıma    : TCP, hedef port 443\nİnternet  : IP, hedef 203.0.113.10\nAğ Erişim : Ethernet çerçevesi, hedef MAC = router",
      note: "Her katman aynı veriye kendi bilgisini ekler.",
    },
  ],
  steps: [
    "Laboratuvarda solda OSI, sağda TCP/IP modelini göreceksin.",
    "Herhangi bir OSI katmanına tıkla; TCP/IP'deki karşılığı vurgulanır.",
    "TCP/IP katmanına tıkla; ona karşılık gelen tüm OSI katmanlarının vurgulandığını gör.",
    "Alttaki eşleştirme alıştırmasında rastgele bir katman için doğru karşılığı seç.",
  ],
  after: [
    "Üç OSI katmanının tek TCP/IP katmanına karşılık gelmesi, uygulamaların ayrıntıları kendisinin yönettiğini gösterir.",
    "Taşıma ve İnternet katmanları iki modelde birebir örtüşür.",
    "Sınavlarda ve sorun gidermede iki modeli birlikte kullanabilmek gerekir.",
  ],
  quiz: [
    Q("TCP/IP modelinde kaç katman vardır?", ["3", "4", "5", "7"], 1, "Klasik TCP/IP modeli dört katmanlıdır; yedi katman OSI'dir."),
    Q("OSI'nin Sunum katmanı TCP/IP'de hangi katmana dahildir?", ["Taşıma", "İnternet", "Uygulama", "Ağ Erişim"], 2, "Oturum, sunum ve uygulama katmanları TCP/IP'de tek Uygulama katmanında birleşir."),
    Q("IP adreslemesi TCP/IP'nin hangi katmanındadır?", ["İnternet", "Uygulama", "Ağ Erişim", "Taşıma"], 0, "IP adresleme ve yönlendirme İnternet katmanının görevidir."),
    Q("Ethernet ve Wi-Fi hangi TCP/IP katmanındadır?", ["Uygulama", "Taşıma", "İnternet", "Ağ Erişim"], 3, "Fiziksel ortam ve yerel ağ erişim teknolojileri Ağ Erişim katmanıdır."),
    Q("Aşağıdakilerden hangisi doğrudur?", ["OSI daha çok pratikte kullanılır", "TCP/IP fiilen internetin kullandığı modeldir", "TCP/IP yedi katmanlıdır", "OSI ve TCP/IP aynıdır"], 1, "Fiilen kullanılan model TCP/IP'dir; OSI kavramsal referanstır. Katman sayıları da farklıdır."),
  ],
  summary: [
    "TCP/IP dört katmanlı, gerçekte kullanılan modeldir.",
    "Uygulama (OSI 5-7), Taşıma (4), İnternet (3), Ağ Erişim (1-2).",
    "OSI kavramsal referans, TCP/IP uygulamadır.",
  ],
};

export const L7: Lesson = {
  id: 7,
  title: "IP Adresleme",
  minutes: 40,
  labTitle: "IP Adresleme Simülatörü",
  purpose:
    "IP adresinin ne işe yaradığını, IPv4 yapısını, alt ağ maskesi ve varsayılan ağ geçidi kavramlarını öğrenmek; bir adresin hangi ağa ait olduğunu hesaplayabilmek.",
  outcomes: [
    "IP adresinin amacını açıklayabilirsin.",
    "IPv4 adresinin dört oktet yapısını ve ikili (binary) karşılığını anlatabilirsin.",
    "Subnet mask ile ağ adresini ve cihaz kısmını ayırabilirsin.",
    "Varsayılan ağ geçidinin görevini açıklayabilirsin.",
    "Basit bir ağın adres aralığını ve yayın (broadcast) adresini hesaplayabilirsin.",
  ],
  sections: [
    {
      h: "IP adresi nedir?",
      p: [
        "IP adresi (Internet Protocol Address), ağa bağlı bir cihazın mantıksal kimliğidir. Posta sistemindeki adres gibi düşün: bir mektubun doğru eve ulaşması için adres gerekir; bir paketin doğru cihaza ulaşması için de IP adresi gerekir. IP adresi iki bilgiyi birlikte taşır: cihazın hangi ağda olduğu (ağ kimliği) ve o ağdaki hangi cihaz olduğu (cihaz kimliği).",
        "Bu ayrım yönlendirme için hayati önemlidir. Router'lar bütün cihazları tek tek bilmek zorunda kalmaz; sadece ağ kimliğine bakarak paketi doğru yöne gönderir. Tıpkı postanın önce şehre, sonra mahalleye, sonra kapıya bakması gibi.",
      ],
    },
    {
      h: "IPv4 adres yapısı ve ikili sistem",
      p: [
        "IPv4 adresi 32 bitten oluşur ve okunabilmesi için dört parçaya (oktet) bölünüp noktalarla ayrılır: 192.168.1.25. Her oktet 8 bittir ve 0 ile 255 arasında bir değer alır. Örneğin 192 sayısı ikili sistemde 11000000'dır. Bilgisayarlar adresleri ikili olarak işler; biz okunabilirlik için ondalık yazarız.",
        "Toplam 2³² ≈ 4,3 milyar IPv4 adresi vardır. Bir adresin geçerli olması için dört oktetin de 0–255 aralığında olması gerekir; 256.10.1.1 veya 192.168.1 geçersizdir.",
      ],
    },
    {
      h: "Subnet mask ve varsayılan ağ geçidi",
      p: [
        "Alt ağ maskesi (Subnet Mask), IP adresinin hangi kısmının ağı, hangi kısmının cihazı gösterdiğini belirler. 255.255.255.0 maskesinde ilk üç oktet ağ kimliği, son oktet cihaz kimliğidir. Bu maske kısaca /24 yazılır (24 adet 1 biti). Ağ adresi, IP adresi ile maskenin bit düzeyinde AND işleminden elde edilir: 192.168.1.25 AND 255.255.255.0 = 192.168.1.0.",
        "Bir ağda iki özel adres vardır: ağ adresi (tüm cihaz bitleri 0 – ağın kendisini tanımlar) ve yayın adresi (broadcast – tüm cihaz bitleri 1 – ağdaki herkese seslenir). Bu ikisi cihazlara atanamaz. /24 ağda 256 adres vardır, kullanılabilir cihaz adresi 254'tür (.1 – .254).",
        "Varsayılan ağ geçidi (Default Gateway), cihazın kendi ağı dışındaki hedeflere ulaşmak için paketleri bıraktığı router adresidir. Cihaz bir hedefin kendi ağında olup olmadığını maske ile hesaplar; aynı ağdaysa doğrudan gönderir, değilse gateway'e yollar. Bu yüzden gateway'in cihazla aynı alt ağda olması zorunludur. Yanlış gateway girilirse yerel ağ çalışır ama internet çalışmaz.",
      ],
    },
  ],
  concepts: [
    ["IPv4", "32 bitlik, noktalı ondalık gösterimle yazılan adres sistemi."],
    ["Oktet", "IPv4 adresinin 8 bitlik her bir parçası (0-255)."],
    ["Subnet Mask", "Ağ ve cihaz kısmını ayıran maske (örn. 255.255.255.0 = /24)."],
    ["Ağ adresi", "Ağın kendisini temsil eden ilk adres; cihaza verilmez."],
    ["Broadcast adresi", "Ağdaki tüm cihazlara seslenen son adres; cihaza verilmez."],
    ["Default Gateway", "Dış ağlara çıkış kapısı olan router adresi."],
  ],
  daily: [
    "Posta adresi: şehir/mahalle ağ kimliği, kapı numarası cihaz kimliğidir.",
    "Apartman: bina ağdır, daire numarası cihazdır; ana kapıdaki kapıcı varsayılan ağ geçidi gibidir.",
    "Telefon numarası: alan kodu ağ, abone numarası cihaz kısmına benzer.",
  ],
  examples: [
    {
      title: "192.168.1.25 / 255.255.255.0 hesabı",
      code: "IP        : 11000000.10101000.00000001.00011001\nMaske     : 11111111.11111111.11111111.00000000\nAğ adresi : 11000000.10101000.00000001.00000000 = 192.168.1.0\nBroadcast : 192.168.1.255\nCihazlar  : 192.168.1.1 – 192.168.1.254",
      note: "Maskenin 1 olan bitleri ağ, 0 olan bitleri cihaz kısmıdır.",
    },
    {
      title: "Daha küçük bir alt ağ: /26",
      code: "192.168.1.70 / 255.255.255.192 (/26)\nAğ adresi : 192.168.1.64\nBroadcast : 192.168.1.127\nCihazlar  : .65 – .126  (62 cihaz)",
      note: "Maske uzadıkça ağ küçülür; daha çok alt ağ elde edilir.",
    },
  ],
  steps: [
    "Laboratuvara IP adresi, subnet mask ve gateway gir veya hazır örneklerden birini seç.",
    "'Analiz Et' düğmesine bas; ağ adresi, broadcast, kullanılabilir aralık ve ikili gösterim hesaplanır.",
    "Doğrulama sonuçlarını oku: geçersiz oktet, hatalı maske veya farklı alt ağdaki gateway uyarılarını gör.",
    "Maskeyi /24'ten /26'ya değiştirerek ağ büyüklüğünün nasıl küçüldüğünü karşılaştır.",
  ],
  after: [
    "Maskeyi değiştirmek aynı IP'nin farklı ağlara ait olmasına neden olabilir.",
    "Gateway cihazla aynı alt ağda olmak zorundadır; aksi halde cihaz dışarıya çıkamaz.",
    "Ağ ve broadcast adreslerine cihaz atanamaz; simülatör bunu hata olarak gösterir.",
  ],
  quiz: [
    Q("Bir IPv4 adresi kaç bittir?", ["16", "32", "64", "128"], 1, "IPv4 adresleri 32 bittir; 128 bit IPv6'dır."),
    Q("192.168.1.25 / 255.255.255.0 için ağ adresi hangisidir?", ["192.168.1.255", "192.168.1.1", "192.168.1.0", "192.168.0.0"], 2, "Son oktet maskede 0 olduğundan sıfırlanır: 192.168.1.0. .255 broadcast adresidir."),
    Q("Default Gateway ne işe yarar?", ["Alan adlarını çözer", "Başka ağlara çıkış için kullanılan router adresidir", "Cihazın MAC adresidir", "Wi-Fi şifresidir"], 1, "Gateway, cihazın kendi ağı dışındaki hedeflere ulaşmak için kullandığı kapıdır."),
    Q("Aşağıdakilerden hangisi geçerli bir IPv4 adresi değildir?", ["10.0.0.1", "172.16.5.4", "192.168.1.300", "8.8.4.4"], 2, "Oktetler 255'i geçemez; 300 geçersizdir."),
    Q("/24 bir ağda kaç adet kullanılabilir cihaz adresi vardır?", ["256", "255", "254", "24"], 2, "256 adresten ağ ve broadcast adresleri çıkarılınca 254 adres kalır."),
  ],
  summary: [
    "IP adresi ağ kimliği ve cihaz kimliğinden oluşur.",
    "IPv4 32 bittir, dört oktet halinde yazılır.",
    "Subnet mask ağ/cihaz ayrımını yapar; ağ ve broadcast adresleri cihaza atanamaz.",
    "Gateway, dış ağlara çıkış kapısıdır ve aynı alt ağda olmalıdır.",
  ],
};

export const L8: Lesson = {
  id: 8,
  title: "IPv4 ve IPv6",
  minutes: 30,
  labTitle: "IPv4 / IPv6 Karşılaştırma Laboratuvarı",
  purpose:
    "IPv4 ve IPv6 adres sistemlerini, gösterim biçimlerini ve IPv6'ya geçişin nedenlerini öğrenmek; adresleri ayırt edebilmek ve IPv6 sıkıştırmasını yapabilmek.",
  outcomes: [
    "IPv4 ve IPv6 adres uzunluklarını söyleyebilirsin.",
    "Bir adresin IPv4 mü IPv6 mı olduğunu ayırt edebilirsin.",
    "IPv6 adresini sıkıştırabilir ve genişletebilirsin.",
    "IPv6'ya geçiş ihtiyacını açıklayabilirsin.",
  ],
  sections: [
    {
      h: "IPv4'ün sınırı ve IPv6'nın doğuşu",
      p: [
        "IPv4 yaklaşık 4,3 milyar adres sunar. İnternetin ilk günlerinde bu sayı sonsuz gibi görünüyordu; ancak bugün dünya nüfusundan çok daha fazla internete bağlı cihaz var: telefonlar, TV'ler, kameralar, sensörler. IPv4 adresleri fiilen tükendi ve bölgesel dağıtım kurumları yeni blok bulmakta zorlandı. NAT gibi çözümlerle bu durum uzatıldı ama kalıcı çözüm değildir.",
        "IPv6, 128 bitlik adresle yaklaşık 3,4×10³⁸ adres sunar; bu, dünyadaki her kum tanesine adres vermeye yetecek kadar bir sayıdır. IPv6 sadece büyük adres alanı getirmez; daha basit başlık yapısı, otomatik adres yapılandırma ve IPsec desteği gibi iyileştirmeler de sunar.",
      ],
    },
    {
      h: "Adres gösterimleri",
      p: [
        "IPv4 adresi 32 bittir ve dört ondalık oktet halinde, noktalarla yazılır: 203.0.113.45. IPv6 adresi 128 bittir ve sekiz grup halinde, her grup 4 onaltılık (hexadecimal) basamak, gruplar iki nokta üst üste ile ayrılarak yazılır: 2001:0db8:0000:0000:0000:ff00:0042:8329. Onaltılık sistem 0-9 ve a-f karakterlerini kullanır.",
        "IPv6 adresleri uzun olduğundan iki sıkıştırma kuralı vardır. Birincisi: her grubun başındaki sıfırlar atılabilir (0db8 → db8, 0042 → 42). İkincisi: arka arkaya gelen tamamı sıfır olan gruplar, adres içinde yalnızca bir kez '::' ile yazılabilir. Yukarıdaki adres sıkıştırılınca 2001:db8::ff00:42:8329 olur. '::' birden fazla kullanılamaz; çünkü kaç grubun atlandığı belirsiz kalır.",
      ],
    },
    {
      h: "IPv4 ve IPv6 arasındaki farklar ve geçiş",
      p: [
        "IPv4 ve IPv6 doğrudan birbiriyle uyumlu değildir. Geçiş döneminde çift yığın (dual stack – cihazda iki protokolün birlikte çalışması), tünelleme ve çeviri teknikleri kullanılır. Çoğu modern işletim sistemi, router ve operatör IPv6'yı destekler; birçok kullanıcı farkında olmadan IPv6 kullanır.",
        "Güvenlik açısından IPv6 kendiliğinden daha güvenli değildir. Yeni adres sistemi, yeni saldırı yüzeyleri ve yapılandırma hataları getirebilir. IPv6'yı da güvenlik duvarı ve izleme sistemlerinin kapsaması gerekir.",
      ],
    },
  ],
  concepts: [
    ["IPv4", "32 bit, noktalı ondalık, ≈4,3 milyar adres."],
    ["IPv6", "128 bit, onaltılık gruplar, ≈3,4×10³⁸ adres."],
    ["Hexadecimal", "0-9 ve a-f ile yazılan 16'lık sayı sistemi."],
    ["Sıfır atma", "Bir IPv6 grubunun baştaki sıfırlarının kaldırılması."],
    ["'::' kısaltması", "Ardışık sıfır gruplarını adres içinde bir kez kısaltma."],
    ["Dual stack", "Aynı cihazın hem IPv4 hem IPv6 kullanması."],
  ],
  daily: [
    "IPv4 telefon numarası gibi kısa ve sınırlıdır; numaralar tükenince yeni bir sistem gerekir.",
    "IPv6, uzun ama neredeyse sonsuz sayıda numara üretebilen yeni bir numaralandırma planıdır.",
    "Evlerdeki akıllı cihazların çoğalması IPv6'yı zorunlu hale getirir.",
  ],
  examples: [
    {
      title: "IPv4 ve IPv6 örnekleri",
      code: "IPv4: 192.0.2.146\nIPv6: 2001:0db8:85a3:0000:0000:8a2e:0370:7334\nSıkışık: 2001:db8:85a3::8a2e:370:7334\nLoopback: IPv4 127.0.0.1  |  IPv6 ::1",
      note: "Tek '::' tüm ardışık sıfır gruplarını temsil eder.",
    },
    {
      title: "Adres sayıları",
      code: "IPv4: 2^32  = 4.294.967.296\nIPv6: 2^128 ≈ 340.282.366.920.938.463.463.374.607.431.768.211.456",
      note: "IPv6 adres alanı pratikte tükenmez.",
    },
  ],
  steps: [
    "Laboratuvarın birinci bölümünde verilen adresin IPv4 mü IPv6 mı olduğunu seç.",
    "İkinci bölümde bir IPv6 adresi gir veya örnek seç; sekiz grup halinde genişletilmiş ve sıkıştırılmış gösterimini gör.",
    "Geçersiz bir adres girerek hata mesajlarını incele (ör. iki tane '::' kullan).",
    "Her grubu ayrı kutularda inceleyerek hangi grupların sıfır olduğunu gör.",
  ],
  after: [
    "IPv6 adresleri ':' içerir, IPv4 adresleri '.' ile yazılır; bu en hızlı ayırt etme yoludur.",
    "'::' kısaltması yalnızca bir kez kullanılabilir.",
    "Genişletme ve sıkıştırma aynı adresi farklı biçimde yazar; adres değişmez.",
  ],
  quiz: [
    Q("IPv6 adresi kaç bittir?", ["32", "64", "128", "256"], 2, "IPv6 adresleri 128 bittir."),
    Q("Aşağıdakilerden hangisi IPv6 adresidir?", ["192.168.0.1", "2001:db8::1", "255.255.255.0", "10.0.0.256"], 1, "':' içeren ve onaltılık gruplardan oluşan adres IPv6'dır."),
    Q("2001:0db8:0000:0000:0000:0000:0000:0001 adresinin doğru sıkıştırılmışı hangisidir?", ["2001:db8::1", "2001::db8::1", "2001:db8:0:1", "2001:0db8::0001:"], 0, "Baştaki sıfırlar atılır ve ardışık sıfır grupları '::' olur. Birden fazla '::' geçersizdir."),
    Q("IPv6'ya geçişin ana nedeni nedir?", ["IPv4'ün daha yavaş olması", "IPv4 adres alanının yetersiz kalması", "IPv6'nın renkli olması", "Kabloların değişmesi"], 1, "Asıl neden IPv4 adres sayısının internete bağlanan cihazlara yetmemesidir."),
    Q("Dual stack nedir?", ["Cihazın iki ekranı olması", "Aynı anda hem IPv4 hem IPv6 çalıştırmak", "Adresi şifrelemek", "Kablosuz ağ türü"], 1, "Dual stack, geçiş sürecinde iki protokolün birlikte çalıştırılmasıdır."),
  ],
  summary: [
    "IPv4 32 bit, IPv6 128 bittir.",
    "IPv6 sekiz hexadecimal grup halinde yazılır, '::' ile kısaltılır.",
    "IPv6 geçişin nedeni IPv4 adres yetersizliğidir.",
    "IPv6 otomatik olarak güvenli değildir; yapılandırma önemlidir.",
  ],
};
