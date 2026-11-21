"use client";

import { LabBox } from "@/components/ui";
import { ChoiceLab, type ChoiceItem } from "./ChoiceLab";

type Pkt = { src: string; dst: string; proto: string; port: string; info: string; layer: string };

function Packet({ p }: { p: Pkt }) {
  const rows: [string, string][] = [
    ["Kaynak", p.src],
    ["Hedef", p.dst],
    ["Protokol", p.proto],
    ["Port / Katman", `${p.port} · ${p.layer}`],
    ["Bilgi", p.info],
  ];
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-white">
      <p className="border-b border-line bg-soft px-3 py-2 text-xs font-bold uppercase tracking-wide text-brand">Paket incelemesi (örnek / yerel)</p>
      <table className="w-full text-sm">
        <tbody className="divide-y divide-line">
          {rows.map(([k, v]) => (
            <tr key={k}><td className="w-36 p-2 font-semibold text-muted">{k}</td><td className="p-2 font-mono text-[13px] break-all">{v}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const S: { text: string; opts: [string, string, string, string]; a: number; why: string; pkt: Pkt }[] = [
  { text: "🖨️ Bir kullanıcı, yazıcının IP adresine ulaşılabilir olup olmadığını test etmek için ping atıyor.", opts: ["ICMP", "ARP", "NTP", "SMTP"], a: 0, why: "Ping, ICMP Echo Request/Reply mesajlarını kullanır. ARP MAC çözümler, NTP saat, SMTP e-posta içindir.", pkt: { src: "192.168.1.25", dst: "192.168.1.30", proto: "ICMP", port: "port yok", layer: "Ağ (3)", info: "Echo (ping) request id=1 seq=1" } },
  { text: "💻 Bilgisayar, 192.168.1.1 router'ının IP adresini biliyor ama MAC adresini bilmiyor.", opts: ["DNS", "ARP", "DHCP", "ICMP"], a: 1, why: "IP adresinden MAC adresini bulma işi ARP'nindir. DNS alan adı çözer, DHCP adres dağıtır.", pkt: { src: "3C:22:FB:A1:09:5E", dst: "FF:FF:FF:FF:FF:FF (yayın)", proto: "ARP", port: "port yok", layer: "Veri Bağlantısı (2)", info: "Who has 192.168.1.1? Tell 192.168.1.25" } },
  { text: "📱 Yeni bir telefon Wi-Fi'ye bağlanıyor ve otomatik olarak IP adresi, gateway ve DNS bilgisi alıyor.", opts: ["DHCP", "NTP", "HTTP", "SSH"], a: 0, why: "Otomatik IP yapılandırması DHCP'nin görevidir (Discover-Offer-Request-Ack).", pkt: { src: "0.0.0.0", dst: "255.255.255.255", proto: "DHCP", port: "UDP 68 → 67", layer: "Uygulama (7)", info: "DHCP Discover – Transaction ID 0x3d1e" } },
  { text: "🌐 Tarayıcı 'agcyberlab.com' adresinin IP adresini öğrenmek istiyor.", opts: ["DNS", "ARP", "FTP", "IMAP"], a: 0, why: "Alan adını IP'ye çeviren protokol DNS'tir.", pkt: { src: "192.168.1.25", dst: "192.168.1.1", proto: "DNS", port: "UDP 53", layer: "Uygulama (7)", info: "Standart sorgu A agcyberlab.com" } },
  { text: "🖥️ Sistem yöneticisi uzak bir sunucuya şifreli olarak komut satırıyla bağlanıyor.", opts: ["Telnet", "SSH", "FTP", "POP3"], a: 1, why: "Şifreli uzaktan komut satırı için SSH kullanılır. Telnet de komut satırı sağlar ama şifresizdir.", pkt: { src: "192.168.1.25", dst: "203.0.113.20", proto: "SSH", port: "TCP 22", layer: "Uygulama (7)", info: "Encrypted packet (len=96) – içerik görülemez" } },
  { text: "✉️ Bir e-posta istemcisi, hazırladığı mesajı posta sunucusuna gönderiyor.", opts: ["IMAP", "POP3", "SMTP", "NTP"], a: 2, why: "E-posta gönderme SMTP ile yapılır; IMAP/POP3 e-postayı almak içindir.", pkt: { src: "192.168.1.25", dst: "198.51.100.10", proto: "SMTP", port: "TCP 25/587", layer: "Uygulama (7)", info: "MAIL FROM:<ali@ornek.com> RCPT TO:<ayse@ornek.com>" } },
  { text: "🕒 Ağdaki sunucuların saatlerini ortak ve doğru bir zaman kaynağıyla senkronize etmek gerekiyor.", opts: ["NTP", "DHCP", "ICMP", "HTTPS"], a: 0, why: "Zaman senkronizasyonu NTP'nin işidir. Doğru saat, loglar ve sertifika doğrulaması için kritiktir.", pkt: { src: "192.168.1.10", dst: "203.0.113.123", proto: "NTP", port: "UDP 123", layer: "Uygulama (7)", info: "NTP Version 4, Client – zaman damgası isteği" } },
  { text: "🏦 Bir kullanıcı bankasının web sitesine giriş yapıyor ve trafik şifreli taşınıyor.", opts: ["HTTP", "FTP", "HTTPS", "Telnet"], a: 2, why: "Şifreli web trafiği HTTPS (HTTP + TLS) ile yapılır. HTTP, FTP ve Telnet şifresizdir.", pkt: { src: "192.168.1.25", dst: "203.0.113.55", proto: "TLSv1.3 (HTTPS)", port: "TCP 443", layer: "Uygulama (7) + Sunum (6)", info: "Application Data – içerik şifreli" } },
  { text: "📬 Kullanıcı e-postalarını hem telefonundan hem bilgisayarından aynı anda, sunucuda tutulan haliyle okumak istiyor.", opts: ["POP3", "IMAP", "SMTP", "ARP"], a: 1, why: "IMAP, e-postayı sunucuda tutarak çoklu cihaz senkronizasyonu sağlar. POP3 genelde indirir ve sunucudan siler.", pkt: { src: "192.168.1.25", dst: "198.51.100.10", proto: "IMAP", port: "TCP 143/993", layer: "Uygulama (7)", info: "A001 SELECT INBOX" } },
  { text: "📁 Bir kullanıcı dosya sunucusuna şifresiz klasik bir protokolle dosya yüklüyor.", opts: ["SSH", "FTP", "DNS", "NTP"], a: 1, why: "Klasik dosya aktarım protokolü FTP'dir (şifresiz). Güvenli karşılığı SFTP/FTPS'tir.", pkt: { src: "192.168.1.25", dst: "192.168.1.60", proto: "FTP", port: "TCP 21", layer: "Uygulama (7)", info: "USER ali / PASS ******** (şifresiz görünür!)" } },
];

const items: ChoiceItem[] = S.map((s) => ({
  prompt: s.text,
  options: s.opts,
  answer: s.a,
  why: s.why,
  extra: <Packet p={s.pkt} />,
}));

export default function Lab15() {
  return (
    <LabBox title="Protokol Eşleştirme ve Paket İnceleme">
      <ChoiceLab id={15} items={items} intro="Senaryoyu oku ve kullanılan protokolü seç. Cevaptan sonra ilgili örnek paketin kaynak, hedef, protokol ve bilgi alanlarını incele. Gerçek trafik yakalanmaz." />
    </LabBox>
  );
}
