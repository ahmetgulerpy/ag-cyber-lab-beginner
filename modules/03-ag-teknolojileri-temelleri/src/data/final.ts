import type { FinalQ } from "./types";

const F = (level: FinalQ["level"], lesson: number, q: string, o: [string, string, string, string], a: number, e: string): FinalQ => ({ level, lesson, q, o, a, e });

export const finalQuestions: FinalQ[] = [
  F("Kolay", 1, "Bilgisayar ağı için en doğru tanım hangisidir?", ["Sadece internet erişimi olan cihazlar", "Veri paylaşabilmek için birbirine bağlanmış cihazlar", "Bir bilgisayardaki dosyalar", "Sadece Wi-Fi sinyali"], 1, "Ağ, bağlantı türü fark etmeksizin veri alışverişi yapan cihazlar topluluğudur."),
  F("Kolay", 2, "Farklı ülkelerdeki şirket şubelerini birbirine bağlayan ağ türü hangisidir?", ["PAN", "LAN", "MAN", "WAN"], 3, "Ülkeler arası bağlantılar geniş alan ağı (WAN) kapsamındadır."),
  F("Kolay", 3, "Web sitesine istek gönderen tarayıcı ağ mimarisinde ne rolündedir?", ["Sunucu", "İstemci", "Switch", "Modem"], 1, "Hizmet isteyen taraf istemcidir (client)."),
  F("Orta", 4, "Aynı yerel ağdaki kablolu cihazları MAC adreslerine bakarak birbirine bağlayan cihaz hangisidir?", ["Router", "Modem", "Switch", "DNS sunucusu"], 2, "Switch Veri Bağlantısı katmanında MAC adresine göre çerçeve iletir; router IP'ye bakar."),
  F("Kolay", 5, "OSI modelinde IP adreslemesi ve yönlendirme hangi katmanda yapılır?", ["Fiziksel (1)", "Veri Bağlantısı (2)", "Ağ (3)", "Taşıma (4)"], 2, "Mantıksal adresleme ve yönlendirme Ağ katmanıdır."),
  F("Orta", 16, "Merkezdeki switch arızalandığında tüm cihazların birbirinden koptuğu topoloji hangisidir?", ["Mesh", "Star", "Hybrid (çok yollu)", "Tam örgü"], 1, "Star topolojisinde merkez cihaz tek hata noktasıdır; mesh yapılarda alternatif yollar vardır."),
  F("Orta", 6, "OSI'nin Oturum, Sunum ve Uygulama katmanları TCP/IP'de hangi katmana karşılık gelir?", ["Uygulama", "Taşıma", "İnternet", "Ağ Erişim"], 0, "Üç üst OSI katmanı TCP/IP'de tek Uygulama katmanında birleşir."),
  F("Orta", 7, "192.168.10.77 / 255.255.255.0 için ağ adresi hangisidir?", ["192.168.10.255", "192.168.10.0", "192.168.0.0", "192.168.10.1"], 1, "Son oktet maske sebebiyle 0'lanır: 192.168.10.0. .255 broadcast adresidir."),
  F("Uygulama", 7, "Bir bilgisayarın IP'si 192.168.1.20/24 ve gateway'i 192.168.2.1 olarak girilmiş. Sorun nedir?", ["Gateway cihazla farklı alt ağda; erişilemez", "IP adresi geçersiz", "Maske yanlış yazılmış", "Sorun yoktur"], 0, "Gateway cihazla aynı alt ağda olmalıdır; 192.168.2.1, 192.168.1.0/24 ağında değildir."),
  F("Kolay", 8, "IPv6 adresi kaç bittir?", ["32", "64", "128", "256"], 2, "IPv6 128 bittir."),
  F("Uygulama", 8, "2001:0db8:0000:0000:0000:0000:0000:0001 adresinin geçerli sıkıştırılmış hali hangisidir?", ["2001:db8::1", "2001::db8::1", "2001:db8:1", "2001:db8:::1"], 0, "Baştaki sıfırlar atılır, ardışık sıfır grupları bir kez '::' olur. Birden fazla '::' geçersizdir."),
  F("Uygulama", 9, "Hangi adres özel (private) IPv4 adresidir?", ["172.15.0.1", "172.32.0.1", "172.20.10.5", "11.0.0.1"], 2, "Özel aralık 172.16.0.0–172.31.255.255'tir; 172.20.10.5 bu aralıktadır."),
  F("Orta", 15, "Bir cihazın ağdaki başka bir cihaza ulaşılabilir olup olmadığını test eden ping komutu hangi protokolü kullanır?", ["ICMP", "SMTP", "NTP", "FTP"], 0, "Ping, ICMP Echo Request ve Echo Reply mesajlarıyla çalışır."),
  F("Orta", 10, "ARP isteği ağda nasıl iletilir ve ne amaçla kullanılır?", ["Broadcast olarak; IP'ye karşılık gelen MAC'i bulmak için", "Unicast olarak; alan adını çözmek için", "Şifreli olarak; sertifika doğrulamak için", "Router'a; IP atamak için"], 0, "ARP isteği yayın olarak gider ve IP→MAC eşleşmesini öğrenmek içindir."),
  F("Orta", 11, "DHCP DORA sürecinin doğru sırası hangisidir?", ["Offer, Discover, Request, Ack", "Discover, Offer, Request, Acknowledge", "Request, Offer, Discover, Ack", "Discover, Request, Offer, Ack"], 1, "Discover → Offer → Request → Acknowledge."),
  F("Uygulama", 11, "Tarayıcı bir alan adının IP adresini bulamıyor ama IP ile siteye doğrudan girebiliyor. Hangi hizmet sorunludur?", ["DHCP", "DNS", "NTP", "ARP"], 1, "IP ile erişim çalışıp alan adıyla çalışmıyorsa ad çözümleme (DNS) sorunludur."),
  F("Orta", 12, "TCP bağlantısını kuran üçlü el sıkışma hangi sırayladır?", ["SYN, SYN-ACK, ACK", "ACK, SYN, FIN", "SYN, ACK, FIN", "SYN-ACK, ACK, SYN"], 0, "SYN → SYN-ACK → ACK."),
  F("Uygulama", 12, "Canlı sesli görüşme uygulaması düşük gecikme için çoğunlukla hangi protokolü tercih eder?", ["TCP", "UDP", "FTP", "SMTP"], 1, "UDP onay ve yeniden iletim beklemediği için gecikmeyi düşük tutar."),
  F("Kolay", 13, "SSH hizmetinin varsayılan portu hangisidir?", ["21", "22", "23", "25"], 1, "SSH 22'dir; Telnet 23, FTP 21'dir."),
  F("Uygulama", 14, "Bir istek 'kimlik doğrulama gerekli' nedeniyle reddedilirse hangi kod beklenir?", ["401", "403", "404", "500"], 0, "401 kimlik doğrulama gerekli demektir; 403 yetki yok, 404 bulunamadı, 500 sunucu hatasıdır."),
];
