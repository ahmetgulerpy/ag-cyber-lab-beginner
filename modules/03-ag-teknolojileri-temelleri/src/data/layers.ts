export type OsiLayer = {
  n: number;
  name: string;
  en: string;
  pdu: string;
  header: string;
  protocols: string[];
  devices: string;
  role: string;
  logic: string;
  example: string;
  tcpip: number; // TCP/IP katman indeksi (0: Uygulama, 1: Taşıma, 2: İnternet, 3: Ağ Erişim)
};

export const OSI: OsiLayer[] = [
  { n: 7, name: "Uygulama", en: "Application", pdu: "Veri", header: "HTTP", protocols: ["HTTP", "HTTPS", "DNS", "SMTP", "FTP", "SSH"], devices: "Tarayıcı, e-posta istemcisi", role: "Kullanıcının ağa eriştiği hizmetleri sunar.", logic: "Uygulama, ne istediğini bir protokolün diliyle ifade eder (örn. 'GET /index.html'). Bu katman uygulamanın kendisi değil, uygulamanın kullandığı ağ hizmetidir.", example: "Postaneye gidip 'şu mektubu gönder' demek.", tcpip: 0 },
  { n: 6, name: "Sunum", en: "Presentation", pdu: "Veri", header: "Sunum", protocols: ["TLS/SSL", "JPEG", "MP4", "UTF-8"], devices: "İşletim sistemi, kütüphaneler", role: "Verinin biçimini, şifrelenmesini ve sıkıştırılmasını sağlar.", logic: "Veri, karşı tarafın anlayacağı biçime çevrilir; gerekirse şifrelenir veya sıkıştırılır. Böylece farklı sistemler aynı veriyi doğru yorumlar.", example: "Mektubu karşı tarafın anlayacağı dile çevirmek ve zarfı mühürlemek.", tcpip: 0 },
  { n: 5, name: "Oturum", en: "Session", pdu: "Veri", header: "Oturum", protocols: ["NetBIOS", "RPC", "PPTP"], devices: "İşletim sistemi", role: "İki uygulama arasındaki oturumu başlatır, yönetir ve bitirir.", logic: "İletişim penceresi açılır, kontrol noktaları konur, bağlantı koparsa kaldığı yerden devam edilebilir ve iş bitince oturum kapatılır.", example: "Telefonu açıp görüşmeyi başlatmak, görüşme bitince kapatmak.", tcpip: 0 },
  { n: 4, name: "Taşıma", en: "Transport", pdu: "Segment", header: "TCP", protocols: ["TCP", "UDP"], devices: "Güvenlik duvarı (port filtreleme)", role: "Uçtan uca aktarım, port numaraları, parçalama ve güvenilirlik.", logic: "Veri segmentlere bölünür, kaynak ve hedef port eklenir. TCP sıra numarası ve onay (ACK) ile güvenilirlik sağlar; UDP ise hızlıdır ama garanti vermez.", example: "Kargo firmasının paketleri numaralayıp teslimatı doğrulaması.", tcpip: 1 },
  { n: 3, name: "Ağ", en: "Network", pdu: "Paket", header: "IP", protocols: ["IP", "ICMP", "IPsec"], devices: "Router", role: "Mantıksal adreslendirme ve ağlar arası yönlendirme.", logic: "Pakete kaynak ve hedef IP adresi eklenir. Router'lar hedef IP'ye bakıp paketi en uygun yola gönderir.", example: "Şehirler arası rotanın belirlenmesi.", tcpip: 2 },
  { n: 2, name: "Veri Bağlantısı", en: "Data Link", pdu: "Çerçeve", header: "MAC", protocols: ["Ethernet", "ARP", "Wi-Fi (802.11)", "PPP"], devices: "Switch, ağ kartı (NIC)", role: "Aynı yerel ağdaki cihazlar arası çerçeve iletimi, MAC adresleme.", logic: "Pakete kaynak/hedef MAC adresi eklenir ve hata kontrol bilgisi konur. Switch bu adreslere bakarak çerçeveyi doğru porta iletir.", example: "Mahalle içinde kapı numarasına göre teslimat.", tcpip: 3 },
  { n: 1, name: "Fiziksel", en: "Physical", pdu: "Bit", header: "Sinyal", protocols: ["Ethernet kablosu", "Fiber", "Wi-Fi radyosu", "Bluetooth"], devices: "Kablo, hub, repeater, Wi-Fi radyosu", role: "Bitleri elektrik, ışık veya radyo sinyali olarak taşır.", logic: "Çerçevedeki 0 ve 1'ler fiziksel ortamda voltaj, ışık darbesi veya radyo dalgasına dönüşür ve karşı tarafa iletilir.", example: "Mektubun gerçekten kamyonla yola çıkması.", tcpip: 3 },
];

export const TCPIP = [
  { name: "Uygulama", en: "Application", osi: [7, 6, 5], protocols: "HTTP, HTTPS, DNS, DHCP, SMTP, FTP, SSH", desc: "Kullanıcıya hizmet veren protokoller. Veri biçimi, şifreleme ve oturum yönetimi de uygulamanın sorumluluğundadır." },
  { name: "Taşıma", en: "Transport", osi: [4], protocols: "TCP, UDP", desc: "Uçtan uca iletişim, port numaraları, güvenilirlik ve akış kontrolü." },
  { name: "İnternet", en: "Internet", osi: [3], protocols: "IP, ICMP, IPsec", desc: "IP adresleme ve yönlendirme; paketlerin ağlar arası yolculuğu." },
  { name: "Ağ Erişim", en: "Network Access", osi: [2, 1], protocols: "Ethernet, Wi-Fi, ARP (kablo, MAC)", desc: "Fiziksel ortam ve yerel ağ erişimi; MAC adresleme ve sinyal iletimi." },
];
