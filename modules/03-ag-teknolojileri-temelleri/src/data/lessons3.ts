import { Q, type Lesson } from "./types";

export const L9: Lesson = {
  id: 9,
  title: "Public ve Private IP",
  minutes: 30,
  labTitle: "Public / Private IP Sınıflandırma Simülatörü",
  purpose:
    "Genel (Public) ve özel (Private) IP adreslerinin farkını, RFC 1918 aralıklarını ve NAT'ın evdeki özel adresleri internete nasıl bağladığını öğrenmek.",
  outcomes: [
    "Public ve Private IP adreslerini tanımlayabilirsin.",
    "RFC 1918 özel adres aralıklarını ezbere söyleyebilirsin.",
    "Verilen bir IPv4 adresini sınıflandırabilirsin.",
    "NAT'ın temel çalışma mantığını anlatabilirsin.",
  ],
  sections: [
    {
      h: "Public IP: internette benzersiz kimlik",
      p: [
        "Public IP (Genel IP), internet üzerinde herkesin ulaşabildiği ve dünyada benzersiz olan adrestir. Bu adresler IANA ve bölgesel kuruluşlar tarafından dağıtılır ve ISS'ler aracılığıyla müşterilere verilir. Bir web sitesinin sunucusu public IP kullanır ki herkes ulaşabilsin. Public IP'nin dünyada tek olması gerekir; aksi halde paketler hangi cihaza gideceğini bilemez.",
      ],
    },
    {
      h: "Private IP ve RFC 1918",
      p: [
        "IPv4 adresleri yetersiz olduğu için RFC 1918 standardı bazı aralıkları özel kullanım için ayırmıştır. Bu adresler internette yönlendirilmez ve herkes kendi yerel ağında aynı özel adresleri tekrar kullanabilir. Özel aralıklar: 10.0.0.0 – 10.255.255.255 (10.0.0.0/8), 172.16.0.0 – 172.31.255.255 (172.16.0.0/12) ve 192.168.0.0 – 192.168.255.255 (192.168.0.0/16).",
        "Dikkat: 172.32.x.x public'tir; sadece 172.16 ile 172.31 arası özeldir. Ayrıca bazı özel amaçlı adresler vardır: 127.0.0.0/8 (loopback – cihazın kendisi, 127.0.0.1) ve 169.254.0.0/16 (APIPA/link-local – DHCP bulunamayınca cihazın kendine atadığı adres). Bunlar ne public ne de olağan private adreslerdir.",
        "Siber güvenlikte bu ayrım şundan önemlidir: özel adresler internetten doğrudan erişilemez olduğu için doğal bir koruma sağlar; ama bu bir güvenlik duvarının yerini tutmaz. Ayrıca bir log kaydında özel adres görmek olayın iç ağdan kaynaklandığını gösterir.",
      ],
    },
    {
      h: "NAT'a giriş",
      p: [
        "Evinizdeki telefon, bilgisayar ve TV'nin hepsi özel IP adresine sahiptir ama internete tek bir public IP ile çıkarlar. Bu işi router'daki NAT (Network Address Translation – Ağ Adresi Çevirisi) yapar. Cihazınız internete bir paket gönderdiğinde router, kaynak adresi (örn. 192.168.1.25:50000) kendi public adresi ile değiştirir (örn. 203.0.113.7:61001) ve eşleşmeyi NAT tablosuna yazar. Yanıt geldiğinde tabloya bakarak paketi doğru iç cihaza geri çevirir.",
        "Bu sayede binlerce cihaz tek public IP'yi paylaşır. NAT bir yan etki olarak dışarıdan gelen istenmeyen bağlantıları da engeller; çünkü tabloda karşılığı olmayan paketler iç ağdaki hiçbir cihaza yönlendirilemez. Kurumsal ağlarda dışarıya hizmet vermek için bu nedenle port yönlendirme (port forwarding) gerekir.",
      ],
    },
  ],
  concepts: [
    ["Public IP", "İnternette benzersiz, herkesten erişilebilir adres."],
    ["Private IP", "Yerel ağda kullanılan, internette yönlendirilmeyen adres."],
    ["RFC 1918", "10/8, 172.16/12 ve 192.168/16 özel adres aralıklarını tanımlar."],
    ["NAT", "Özel adresleri public adrese çeviren işlem."],
    ["Loopback", "127.0.0.1; cihazın kendisine verdiği adres."],
    ["APIPA", "169.254.x.x; DHCP bulunamayınca otomatik atanan adres."],
  ],
  daily: [
    "Apartman: dış dünya için tek posta adresi (public), içeride daire numaraları (private).",
    "Şirket santrali: dışarıdan tek numara aranır, içeride dahili numaralar vardır.",
    "Evdeki herkesin 192.168.1.x adresi olabilir; yan komşuda da aynı adresler çalışır, çünkü karışmazlar.",
  ],
  examples: [
    {
      title: "Özel IPv4 aralıkları",
      code: "10.0.0.0    – 10.255.255.255   (10.0.0.0/8)\n172.16.0.0  – 172.31.255.255   (172.16.0.0/12)\n192.168.0.0 – 192.168.255.255  (192.168.0.0/16)",
      note: "Bu aralıkların dışındaki adresler (özel amaçlı olanlar hariç) public'tir.",
    },
    {
      title: "NAT tablosu örneği",
      code: "İç adres          Dış adres (public)\n192.168.1.25:50000 → 203.0.113.7:61001\n192.168.1.30:50234 → 203.0.113.7:61002",
      note: "Aynı public IP, farklı port numaralarıyla ayrıştırılır.",
    },
  ],
  steps: [
    "Laboratuvarda sırayla IP adresleri göreceksin; her biri için Public, Private veya Özel Amaçlı seç.",
    "Cevabın ardından RFC 1918 kuralına dayalı açıklamayı oku.",
    "Kendi IP adresini yazarak sınıflandırma aracını dene.",
    "NAT demosunda bir iç cihaz seçip internete çıkış yap ve NAT tablosuna eklenen satırı incele.",
  ],
  after: [
    "172.16–172.31 aralığının dışında kalan 172.x adresleri public'tir; en sık yapılan hata budur.",
    "169.254 ve 127 ile başlayan adresler özel amaçlıdır; internet veya olağan yerel ağ adresi değildir.",
    "NAT tablosu, tek public IP'nin birçok cihaz tarafından paylaşılmasını sağlar.",
  ],
  quiz: [
    Q("Aşağıdakilerden hangisi özel (private) bir IPv4 adresidir?", ["8.8.8.8", "172.20.4.5", "172.32.1.1", "203.0.113.5"], 1, "172.16–172.31 arası özeldir. 172.32 bu aralığın dışında kalır ve public'tir."),
    Q("192.168.0.0/16 aralığı kime aittir?", ["Public IP aralığı", "RFC 1918 özel aralığı", "IPv6 aralığı", "Loopback aralığı"], 1, "192.168.0.0/16, RFC 1918'de tanımlı özel adres aralığıdır."),
    Q("NAT'ın temel görevi nedir?", ["Dosya sıkıştırmak", "Özel adresleri public adrese çevirmek", "MAC adresi değiştirmek", "DNS sorgusu yapmak"], 1, "NAT, iç ağdaki özel adresleri ortak bir public adrese çevirir."),
    Q("127.0.0.1 adresi nedir?", ["Router adresi", "Loopback (cihazın kendisi)", "Public DNS", "Yayın adresi"], 1, "127.0.0.1, cihazın kendi kendine konuşmak için kullandığı loopback adresidir."),
    Q("Ev ağında bütün cihazlar internete genelde nasıl çıkar?", ["Her cihaz ayrı public IP alır", "Router'ın tek public IP'si üzerinden NAT ile", "Hiç çıkamaz", "Sadece IPv6 ile"], 1, "Ev ağlarında router tek public IP kullanır ve NAT ile iç adresleri çevirir."),
  ],
  summary: [
    "Public IP internette benzersiz, Private IP yerel ağa özeldir.",
    "RFC 1918: 10/8, 172.16/12, 192.168/16.",
    "NAT özel adresleri public adrese çevirir.",
    "127.x ve 169.254.x özel amaçlı adreslerdir.",
  ],
};

export const L10: Lesson = {
  id: 10,
  title: "MAC Adresi",
  minutes: 30,
  labTitle: "MAC Adresleri ve ARP Simülasyonu",
  purpose:
    "MAC adresinin fiziksel kimlik olarak ne işe yaradığını, IP adresinden farkını ve ARP'nin IP-MAC eşleşmesini nasıl çözdüğünü öğrenmek.",
  outcomes: [
    "MAC adresinin yapısını (OUI + cihaz kısmı) açıklayabilirsin.",
    "MAC ve IP adresleri arasındaki farkı anlatabilirsin.",
    "Ağ kartının (NIC) rolünü açıklayabilirsin.",
    "ARP isteği ve yanıtının nasıl çalıştığını gösterebilirsin.",
  ],
  sections: [
    {
      h: "MAC adresi nedir?",
      p: [
        "MAC adresi (Media Access Control Address), ağ kartının (NIC – Network Interface Card) üretim sırasında tanımlanmış, 48 bitlik fiziksel adresidir. 12 onaltılık basamak olarak ve çoğunlukla ikişerli gruplar halinde yazılır: 3C:22:FB:A1:09:5E. Wi-Fi kartı, Ethernet kartı ve Bluetooth çipi ayrı MAC adreslerine sahiptir.",
        "İlk 24 bit (ilk üç grup) OUI (Organizationally Unique Identifier) olarak üreticiyi gösterir; geri kalan 24 bit üreticinin o karta verdiği seri numarasıdır. Böylece bir MAC adresine bakarak cihazın üreticisini tahmin edebilirsin (örneğin 00:1A:2B ile başlayan bir adres belirli bir firmaya aittir).",
      ],
    },
    {
      h: "MAC ve IP: iki adres neden gerekli?",
      p: [
        "IP adresi mantıksaldır ve cihaz ağ değiştirdiğinde değişir; MAC adresi ise fiziksel arayüze bağlıdır ve (genelde) sabittir. IP adresi paketin uçtan uca, yani farklı ağlar arasındaki yolculuğunu yönetir; MAC adresi ise paketin aynı yerel ağ içindeki bir sonraki durağa ulaşmasını sağlar. Switch'ler MAC adreslerine bakar, router'lar IP adreslerine bakar.",
        "Bir paket internetteki sunucuya giderken her yönlendiricide MAC adresleri değişir ama IP adresleri değişmez (NAT hariç). Çünkü her ağ geçişinde 'sonraki atlama noktası'nın MAC'i gerekir.",
        "Güvenlik notu: MAC adresleri yazılımla değiştirilebilir (MAC spoofing). Bu yüzden MAC filtreleme tek başına güvenlik sayılmaz. Halka açık Wi-Fi'lerde modern telefonlar gizliliği artırmak için rastgele MAC kullanır.",
      ],
    },
    {
      h: "ARP: IP'den MAC'e çeviri",
      p: [
        "Bir cihaz aynı ağdaki başka bir cihazın IP adresini biliyor ama MAC adresini bilmiyorsa, ARP (Address Resolution Protocol – Adres Çözümleme Protokolü) devreye girir. Cihaz ağdaki herkese yayın (broadcast) ile sorar: '192.168.1.10 adresi kimde? Cevabı 192.168.1.20'ye ver.' Sahibi olan cihaz doğrudan (unicast) yanıt verir: '192.168.1.10 bende, MAC adresim AA:BB:...'.",
        "Öğrenilen eşleşme ARP tablosuna (ARP cache) kaydedilir; böylece her pakette tekrar sorulmaz. Tablo bir süre sonra silinir. ARP kimlik doğrulama yapmaz; bu nedenle ARP zehirleme (ARP spoofing) gibi saldırılara açıktır. Bu saldırının temelini şimdi öğreniyorsun; ilerleyen modüllerde savunmasını göreceksin.",
      ],
    },
  ],
  concepts: [
    ["MAC adresi", "48 bitlik, ağ kartına özgü fiziksel adres."],
    ["NIC", "Ağ arayüz kartı; cihazı ağa bağlayan donanım."],
    ["OUI", "MAC'in ilk 24 biti; üretici kimliği."],
    ["ARP", "IP adresinden MAC adresini bulan protokol."],
    ["ARP tablosu", "Öğrenilen IP-MAC eşleşmelerinin geçici listesi."],
    ["Broadcast MAC", "FF:FF:FF:FF:FF:FF; ağdaki herkese gönderim."],
  ],
  daily: [
    "MAC adresi şasi numarası gibidir (araca özgü); IP adresi plaka gibidir (taşınabilir).",
    "Sınıfta öğretmen 'Ali kim?' diye bağırır (ARP isteği), Ali elini kaldırır (yanıt).",
    "Apartman içi kargo: Daire numarası (IP) biliniyor; kapıyı kimin açtığı (MAC) sorulur.",
  ],
  examples: [
    {
      title: "MAC adresinin yapısı",
      code: "3C:22:FB : A1:09:5E\n└── OUI ──┘  └ cihaz ┘\n(üretici)   (seri)",
      note: "İlk üç grup üreticiyi, son üç grup cihazı belirtir.",
    },
    {
      title: "ARP isteği ve yanıtı",
      code: "ARP İsteği (broadcast): Who has 192.168.1.10? Tell 192.168.1.20\nARP Yanıtı (unicast)  : 192.168.1.10 is at AA:BB:CC:00:00:10\n\nWindows'ta tabloyu görmek: arp -a",
      note: "İstek herkese gider, yanıt sadece isteyene döner.",
    },
  ],
  steps: [
    "Laboratuvarda yerel ağdaki dört cihazın IP ve MAC adreslerini göreceksin; birini seçip MAC yapısını incele.",
    "ARP bölümünde kaynak ve hedef IP seç, 'ARP Çözümle' ile adımları başlat.",
    "İstek yayınının tüm cihazlara gittiğini, yanıtın yalnızca isteyene döndüğünü gör.",
    "İşlemi tekrarla; bu kez ARP tablosundan (önbellek) cevap geldiğini ve istek gerekmediğini fark et.",
  ],
  after: [
    "ARP isteği broadcast olduğundan ağdaki tüm cihazlar duyar; bu hem kolaylık hem de güvenlik riskidir.",
    "ARP tablosu eşleşmeyi saklar, ikinci iletişim çok daha hızlı olur.",
    "MAC adresi yalnızca yerel ağda anlamlıdır; internete çıkan paketlerde hedef MAC router'ın MAC'idir.",
  ],
  quiz: [
    Q("MAC adresi kaç bittir?", ["32", "48", "64", "128"], 1, "MAC adresleri 48 bit (6 bayt) uzunluğundadır."),
    Q("OUI MAC adresinin neyi gösterir?", ["Cihazın IP'sini", "Üreticiyi", "Wi-Fi şifresini", "Konumu"], 1, "İlk 24 bit üretici kimliğini (OUI) verir."),
    Q("ARP ne işe yarar?", ["MAC'ten IP'ye değil, IP'den MAC'e çözüm sağlar", "Alan adını IP'ye çevirir", "Veriyi şifreler", "Dosya aktarır"], 0, "ARP, bilinen IP adresine karşılık gelen MAC adresini bulur. Alan adı çözümü DNS işidir."),
    Q("ARP isteği hangi türde gönderilir?", ["Unicast", "Broadcast", "Sadece router'a", "Şifreli"], 1, "ARP isteği tüm yerel ağa broadcast olarak gönderilir; yanıt ise unicasttır."),
    Q("Switch yönlendirirken hangi adrese bakar?", ["IP adresi", "MAC adresi", "Port numarası", "Alan adı"], 1, "Switch, Veri Bağlantısı katmanında MAC adreslerine göre çalışır."),
  ],
  summary: [
    "MAC adresi, ağ kartının 48 bitlik fiziksel kimliğidir.",
    "IP mantıksal ve uçtan uca, MAC fiziksel ve yerel ağ içindir.",
    "ARP, IP'ye karşılık gelen MAC'i bulur ve tabloya yazar.",
    "ARP kimlik doğrulamaz; bu yüzden zehirlemeye açıktır.",
  ],
};

export const L11: Lesson = {
  id: 11,
  title: "DNS ve DHCP",
  minutes: 40,
  labTitle: "DNS Çözümleme ve DHCP DORA Simülasyonu",
  purpose:
    "Alan adlarının IP adreslerine nasıl çevrildiğini (DNS) ve cihazlara IP adresinin otomatik olarak nasıl atandığını (DHCP) adım adım öğrenmek.",
  outcomes: [
    "DNS'in neden gerekli olduğunu açıklayabilirsin.",
    "DNS sorgusunun aşamalarını (önbellek, çözücü, kök, TLD, yetkili) sıralayabilirsin.",
    "DHCP'nin görevini ve DORA sürecini anlatabilirsin.",
    "DNS ve DHCP'nin güvenlik risklerine temel düzeyde dikkat edebilirsin.",
  ],
  sections: [
    {
      h: "DNS: internetin telefon rehberi",
      p: [
        "İnsanlar alan adlarını (örn. agcyberlab.com) hatırlar, bilgisayarlar ise IP adresleriyle çalışır. DNS (Domain Name System – Alan Adı Sistemi), alan adlarını IP adreslerine çeviren dağıtık bir sistemdir. Telefon rehberinde ismi aratıp numarayı bulmaya benzer. DNS olmasa her sitenin IP adresini ezberlemek zorunda kalırdık.",
        "Alan adı sağdan sola okunur: www.example.com. Sağdaki com üst düzey alan adı (TLD), example ikinci düzey alan adı, www ise alt alan adıdır. En tepede görünmeyen bir kök (root) vardır.",
      ],
    },
    {
      h: "DNS sorgusu nasıl çözülür?",
      p: [
        "Tarayıcıya bir alan adı yazdığında önce tarayıcı ve işletim sistemi kendi önbelleğine (cache) bakar. Bulamazsa özyinelemeli çözücüye (Recursive Resolver – genelde ISS'in veya 8.8.8.8 gibi bir DNS sunucusu) sorar. Çözücünün de önbelleğinde yoksa sırayla şunlara sorar: kök sunucu ('.com'u kim yönetiyor?), TLD sunucusu ('example.com'u kim yönetiyor?) ve yetkili (authoritative) sunucu ('www.example.com'un IP'si nedir?). Yetkili sunucu cevabı verir; çözücü bunu istemciye iletir ve belirli bir süre (TTL) boyunca önbelleğe alır.",
        "Önemli kayıt türleri: A (alan adı → IPv4), AAAA (alan adı → IPv6), CNAME (takma ad), MX (e-posta sunucusu), NS (yetkili ad sunucusu), TXT (metin bilgisi). Alan adı yoksa NXDOMAIN yanıtı döner. DNS genellikle UDP 53 portunu kullanır.",
        "Güvenlik açısından DNS sık hedeflenir: DNS zehirleme (sahte cevap), DNS yönlendirme ve veri sızdırma tünelleri gibi. Güvenilir DNS ve DNSSEC/DoH gibi mekanizmalar bu riskleri azaltır.",
      ],
    },
    {
      h: "DHCP: otomatik adres dağıtımı",
      p: [
        "Her cihaza elle IP adresi, maske, gateway ve DNS yazmak büyük ağlarda mümkün değildir. DHCP (Dynamic Host Configuration Protocol – Dinamik Sunucu Yapılandırma Protokolü) bu ayarları ağa bağlanan cihaza otomatik verir. Evlerde DHCP sunucusu genelde router'dır. Adresler belirli bir süre için kiralanır (lease) ve süre dolmadan yenilenir.",
        "DHCP DORA adımlarıyla çalışır: 1) Discover – yeni bağlanan cihaz 'Burada DHCP sunucusu var mı?' diye yayın yapar. 2) Offer – sunucu 'Sana şu IP'yi teklif ediyorum' der. 3) Request – cihaz 'Bu teklifi kabul ediyorum, bu IP'yi istiyorum' diye yanıt verir. 4) Acknowledge – sunucu 'Onaylandı, kiralama süresi şu kadar' diyerek işlemi bitirir.",
        "DHCP'de kimlik doğrulama yoktur. Ağa sahte bir DHCP sunucusu (rogue DHCP) eklenirse cihazlara yanlış gateway ve DNS verilebilir. Bu yüzden kurumsal ağlarda DHCP snooping gibi korumalar kullanılır.",
      ],
    },
  ],
  concepts: [
    ["DNS", "Alan adlarını IP adreslerine çeviren sistem."],
    ["Recursive Resolver", "İstemci adına tüm DNS zincirini sorgulayan sunucu."],
    ["Yetkili sunucu", "Bir alan adının kesin kaydını tutan DNS sunucusu."],
    ["TTL", "Bir DNS cevabının önbellekte tutulma süresi."],
    ["DHCP", "IP ayarlarını otomatik dağıtan protokol."],
    ["DORA", "Discover, Offer, Request, Acknowledge."],
    ["Lease", "DHCP ile alınan adresin kiralama süresi."],
  ],
  daily: [
    "DNS = telefon rehberi: ismi yaz, numarayı bul.",
    "DHCP = otel resepsiyonu: gelen misafire boş bir oda numarası (IP) verir ve süresini söyler.",
    "Telefonunuzu eve getirince Wi-Fi'ye bağlanıp otomatik adres alması DHCP'dir.",
  ],
  examples: [
    {
      title: "DNS sorgusu (nslookup)",
      code: "> nslookup www.example.com\nServer:  192.168.1.1\nName:    www.example.com\nAddress: 93.184.216.34",
      note: "Sunucunun adı ve IP adresi sorgu sonunda döner.",
    },
    {
      title: "DHCP DORA",
      code: "1 DISCOVER : İstemci → Herkes   'DHCP sunucusu var mı?'\n2 OFFER    : Sunucu → İstemci   '192.168.1.50 teklif'\n3 REQUEST  : İstemci → Sunucu   'Bu adresi istiyorum'\n4 ACK      : Sunucu → İstemci   'Onaylandı, 24 saat'",
      note: "İlk iki mesajda istemcinin henüz IP adresi olmadığı için yayın kullanılır.",
    },
  ],
  steps: [
    "DNS bölümünde bir alan adı yaz veya örnek seç; 'Çöz' ile süreci başlat.",
    "Önbellek, çözücü, kök, TLD ve yetkili sunucu adımlarını sırayla izle; her adımın bilgi alanını oku.",
    "Olmayan bir alan adı girerek NXDOMAIN sonucunu gör.",
    "DHCP bölümünde yeni bir cihaz ekleyerek DORA adımlarını animasyonla izle ve sonunda kiralanan ayarları incele.",
  ],
  after: [
    "İkinci sorguda cevap önbellekten gelir; DNS böylece hızlanır.",
    "DORA'nın ilk iki mesajı yayındır çünkü cihazın henüz adresi yoktur.",
    "DNS ve DHCP, güvenlik saldırılarının sık hedeflediği temel hizmetlerdir.",
  ],
  quiz: [
    Q("DNS'in görevi nedir?", ["IP adresi atamak", "Alan adlarını IP adreslerine çevirmek", "Şifreleme yapmak", "Paketleri yönlendirmek"], 1, "DNS alan adı → IP çevirisi yapar. IP atama DHCP'nin işidir."),
    Q("DHCP DORA'nın doğru sırası hangisidir?", ["Offer, Discover, Request, Ack", "Discover, Offer, Request, Acknowledge", "Request, Discover, Offer, Ack", "Discover, Request, Offer, Ack"], 1, "Sıra: Discover, Offer, Request, Acknowledge."),
    Q("DNS cevabının önbellekte ne kadar kalacağını belirleyen değer nedir?", ["TTL", "MAC", "NAT", "Port"], 0, "TTL (Time To Live), önbellekte kalma süresidir."),
    Q("'A' kaydı ne saklar?", ["E-posta sunucusunu", "Alan adı → IPv4 eşlemesini", "IPv6 eşlemesini", "Takma adı"], 1, "A kaydı IPv4 adresi eşler. IPv6 için AAAA, takma ad için CNAME kullanılır."),
    Q("Sahte DHCP sunucusunun riski nedir?", ["Hiçbiri", "Cihazlara yanlış gateway/DNS verip trafiği yönlendirebilir", "Kabloları keser", "Ekranı kapatır"], 1, "DHCP kimlik doğrulama yapmaz; sahte sunucu kötü niyetli ayarlar dağıtabilir."),
  ],
  summary: [
    "DNS alan adı → IP çevirir; çözümleme önbellek, çözücü, kök, TLD ve yetkili sunucu zinciriyle yapılır.",
    "DHCP, IP ayarlarını otomatik verir; süreç DORA'dır.",
    "Her iki hizmet de ağın temelidir ve güvenlik açısından kritiktir.",
  ],
};

export const L12: Lesson = {
  id: 12,
  title: "TCP ve UDP",
  minutes: 35,
  labTitle: "TCP / UDP Veri İletim Simülatörü",
  purpose:
    "Taşıma katmanındaki iki ana protokolün farkını, güvenilirlik ile hız arasındaki dengeyi ve TCP Three-Way Handshake sürecini öğrenmek.",
  outcomes: [
    "TCP ve UDP arasındaki farkları açıklayabilirsin.",
    "Bağlantı odaklı ve bağlantısız iletişimi anlatabilirsin.",
    "SYN, SYN-ACK, ACK adımlarını sıralayabilirsin.",
    "Bir uygulamanın hangi protokolü neden kullandığını yorumlayabilirsin.",
  ],
  sections: [
    {
      h: "Taşıma katmanı ve iki yaklaşım",
      p: [
        "IP paketi bir cihazdan diğerine ulaşır ama içindeki verinin doğru uygulamaya teslim edilmesini, eksiksiz ve sıralı gelmesini garanti etmez. Bu işi Taşıma katmanı yapar. İki ana protokol vardır: TCP güvenilirliği, UDP hızı önceler. İkisi de port numaralarıyla verinin hangi uygulamaya gideceğini belirler.",
      ],
    },
    {
      h: "TCP: güvenilir ve bağlantı odaklı",
      p: [
        "TCP (Transmission Control Protocol), veri göndermeden önce bağlantı kurar (bağlantı odaklı – connection-oriented). Verileri numaralandırır, alıcı her parçanın geldiğini onaylar (ACK). Onay gelmeyen parçalar yeniden gönderilir, bozuk veya sırasız gelenler düzeltilir ve akış kontrolü ile ağ tıkanıklığı yönetilir. Bu güvenilirlik web sayfaları, e-posta, dosya aktarımı ve SSH gibi hata kabul etmeyen işler için gereklidir.",
        "Bağlantı kurma süreci Three-Way Handshake (Üçlü El Sıkışma) ile yapılır: 1) SYN – istemci 'Bağlanmak istiyorum, başlangıç sıra numaram şu' der. 2) SYN-ACK – sunucu 'Tamam, ben de hazırım, kendi sıra numaram şu' diye yanıtlar. 3) ACK – istemci 'Anladım, başlayalım' diyerek onaylar. Bu süreçten sonra veri akışı başlar. Kapatma ise FIN/ACK mesajlarıyla yapılır.",
        "Güvenlik açısından SYN Flood saldırısı bu mekanizmayı hedefler: saldırgan çok sayıda SYN gönderip son ACK'yı göndermeyerek sunucunun kaynaklarını tüketir.",
      ],
    },
    {
      h: "UDP: hızlı ve bağlantısız",
      p: [
        "UDP (User Datagram Protocol) önceden bağlantı kurmaz, onay beklemez ve kayıp paketi yeniden göndermez (bağlantısız – connectionless). Başlığı küçüktür ve gecikmesi düşüktür. 'Gönder ve unut' mantığıyla çalışır. Bu nedenle canlı video, sesli görüşme, çevrimiçi oyun, DNS sorguları ve yayın akışları gibi hızın tam doğruluktan daha önemli olduğu uygulamalarda tercih edilir: görüntüde bir karenin kaybolması, ses yarım saniye gecikmesinden daha az rahatsız edicidir.",
        "Kıyaslama: TCP – bağlantı kurar, güvenilir, sıralı, yavaş ve ek yükü yüksek; UDP – bağlantısız, güvenilirlik garantisi yok, hızlı ve hafif. Hangisinin seçileceği, uygulamanın ihtiyacına bağlıdır.",
      ],
    },
  ],
  concepts: [
    ["TCP", "Bağlantı odaklı, güvenilir taşıma protokolü."],
    ["UDP", "Bağlantısız, hızlı ve hafif taşıma protokolü."],
    ["Three-Way Handshake", "SYN → SYN-ACK → ACK bağlantı kurma süreci."],
    ["ACK", "Verinin alındığını bildiren onay mesajı."],
    ["Yeniden iletim", "Onayı gelmeyen paketin tekrar gönderilmesi."],
    ["Gecikme (Latency)", "Verinin gidip gelme süresi."],
  ],
  daily: [
    "TCP, iadeli taahhütlü kargoya benzer: teslim edildi onayı beklenir, kaybolursa tekrar gönderilir.",
    "UDP, adrese bırakılan broşüre benzer: hızlıdır, teslim kontrolü yoktur.",
    "Video konferansta bir saniyelik veri kaybı kabul edilir ama gecikme istenmez.",
  ],
  examples: [
    {
      title: "TCP Three-Way Handshake",
      code: "İstemci → Sunucu : SYN      (seq=100)\nSunucu  → İstemci: SYN-ACK  (seq=300, ack=101)\nİstemci → Sunucu : ACK      (ack=301)\n----- bağlantı kuruldu, veri akışı -----",
      note: "Üç mesajdan sonra iki taraf da sıra numaralarında anlaşmış olur.",
    },
    {
      title: "TCP ve UDP karşılaştırması",
      code: "Özellik       TCP              UDP\nBağlantı      Var              Yok\nGüvenilirlik  Yüksek           Yok\nHız           Daha yavaş       Hızlı\nÖrnekler      HTTP, SSH, SMTP  DNS, VoIP, oyun",
      note: "UDP, hız için güvenilirlikten feragat eder.",
    },
  ],
  steps: [
    "Laboratuvarda gönderilecek paket sayısını ve ağdaki kayıp oranını (paket kaybı) ayarla.",
    "TCP modunu seç ve başlat; handshake adımlarını, her pakete gelen ACK'yi ve kayıp paketin yeniden iletimini izle.",
    "UDP modunu aynı ayarlarla çalıştır; bağlantı kurulmadan gönderim yapıldığını ve kaybolan paketlerin geri gelmediğini gör.",
    "Sonuç tablosundan teslim oranı, süre ve mesaj sayılarını karşılaştır.",
  ],
  after: [
    "TCP'de kayıp paket yeniden iletilir; bunun bedeli ek mesaj ve zamandır.",
    "UDP'de aynı kayıp kalıcıdır; ancak mesaj sayısı ve gecikme azdır.",
    "Doğru protokol seçimi uygulamanın hata toleransına bağlıdır.",
  ],
  quiz: [
    Q("Aşağıdakilerden hangisi TCP için doğrudur?", ["Bağlantısızdır", "Güvenilirdir ve onay kullanır", "Hiç port kullanmaz", "Sadece video için kullanılır"], 1, "TCP bağlantı odaklıdır, ACK ile teslimi doğrular ve kayıpları yeniden gönderir."),
    Q("Three-Way Handshake'in doğru sırası hangisidir?", ["ACK, SYN, SYN-ACK", "SYN, SYN-ACK, ACK", "SYN-ACK, SYN, ACK", "SYN, ACK, SYN-ACK"], 1, "Sıra: SYN → SYN-ACK → ACK."),
    Q("DNS sorguları çoğunlukla hangi protokolle gönderilir?", ["TCP", "UDP", "FTP", "ARP"], 1, "Küçük ve hızlı olması gereken DNS sorguları genellikle UDP 53 kullanır (büyük cevaplarda TCP'ye geçilebilir)."),
    Q("Canlı video yayında UDP'nin tercih edilme nedeni nedir?", ["Daha güvenli olması", "Düşük gecikme sağlaması", "Şifreleme yapması", "Kayıp paketi mutlaka düzeltmesi"], 1, "UDP bekleme ve yeniden iletim yapmadığı için gecikmeyi azaltır."),
    Q("SYN Flood saldırısı neyi hedefler?", ["UDP portlarını", "TCP bağlantı kurma sürecini", "MAC tablosunu", "DNS önbelleğini"], 1, "Saldırgan çok sayıda SYN gönderip handshake'i tamamlamayarak sunucu kaynaklarını tüketir."),
  ],
  summary: [
    "TCP güvenilir ve bağlantı odaklı, UDP hızlı ve bağlantısızdır.",
    "TCP bağlantıyı SYN, SYN-ACK, ACK ile kurar.",
    "Protokol seçimi uygulamanın ihtiyacına göre yapılır.",
  ],
};
