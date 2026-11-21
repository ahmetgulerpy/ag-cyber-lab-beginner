import type { Question } from "./types";
import { mc, mu, ord } from "./qh";
import { B, L, R, Sl, sc } from "./guides/h";

const q = (lesson: string, level: Question["level"], x: Question): Question => ({ ...x, lesson, level });

export const FINAL_QUESTIONS: Question[] = [
  q("virtualization-nedir", "Kolay", mc("f1", "Guest (konuk) işletim sistemi nedir?", [
    ["Sanal makinenin içinde çalışan işletim sistemi", "Doğru: hypervisor üzerinde çalışan sanal makinenin işletim sistemidir."],
    ["Fiziksel bilgisayarın işletim sistemi", "Bu host'tur."],
    ["Hypervisor'un güncelleme paketi", "Guest bir güncelleme paketi değildir."],
    ["Ağ kartı sürücüsü", "Sürücü farklı bir kavramdır."],
  ], 0)),
  q("virtualization-nedir", "Orta", mc("f2", "Host'ta 8 GB RAM varken sanal makineye 7,5 GB RAM atamanın sonucu ne olur?", [
    ["Host'a yeterli bellek kalmaz; sistem çok yavaşlar", "Doğru: host da belleğe ihtiyaç duyar."],
    ["Daha hızlı çalışır", "Bellek ayırmak host kaynağını azaltır; hız artmaz."],
    ["RAM sanal olduğu için sorun olmaz", "Sanal RAM gerçek RAM'den ayrılır."],
    ["Disk büyür", "Disk ile ilgisi yok."],
  ], 0, { format: "Senaryo" })),
  q("hypervisor-mantigi", "Kolay", mc("f3", "Hangisi Type 2 hypervisor örneğidir?", [
    ["VirtualBox", "Doğru: host işletim sistemi üzerinde çalışır."],
    ["Doğrudan donanımda çalışan sunucu hypervisor'u", "Bu Type 1'dir."],
    ["Excel", "Hypervisor değildir."],
    ["Tarayıcı", "Hypervisor değildir."],
  ], 0)),
  q("hypervisor-mantigi", "Orta", mc("f4", "Şemadaki yapı hangi türe aittir?", [
    ["Type 1", "Doğru: host OS yok; hypervisor donanım üzerinde."],
    ["Type 2", "Host OS katmanı olsaydı Type 2 olurdu."],
    ["Konteyner", "Konteyner çalışma zamanı değildir."],
    ["Fiziksel makine", "Sanal makineler gösteriliyor."],
  ], 0, { format: "Görsel yorumlama", screen: sc("Mimari", [L(["Fiziksel donanım", "Hypervisor (doğrudan donanım üstünde)", "VM 1  |  VM 2  |  VM 3"])]) })),
  q("virtualbox", "Kolay", mc("f5", "VirtualBox'ı hangi adresten indirmelisin?", [
    ["virtualbox.org resmî indirme sayfası", "Doğru: resmî kaynak güvenilirdir."],
    ["Herhangi bir torrent sitesi", "Güvenli değil."],
    ["E-postayla gelen bağlantı", "Güvenilmez."],
    ["Sosyal medya mesajı", "Doğrulanamaz."],
  ], 0)),
  q("virtualbox", "Orta", mc("f6", "Hazır .vbox dosyasını VirtualBox'a tanıtmak için hangi düğmeyi kullanırsın?", [
    ["Add", "Doğru: mevcut bir makineyi ekler."],
    ["New", "Yeni makine oluşturur."],
    ["Settings", "Ayarları açar."],
    ["Start", "Makineyi çalıştırır."],
  ], 0, { format: "Görsel yorumlama", screen: sc("VirtualBox Manager", [R(B("New"), B("Add", 1), B("Settings"), B("Start"))]) })),
  q("vmware", "Orta", mc("f7", "VMware Workstation Pro'nun güncel kullanım ve lisans bilgisi için doğru kaynak hangisidir?", [
    ["Broadcom'un resmî sayfaları", "Doğru: lisans koşulları zamanla değişebilir."],
    ["Anahtar paylaşan siteler", "Güvensiz ve yasal risk taşır."],
    ["Eski forum başlıkları", "Güncel olmayabilir."],
    ["Tahmin", "Resmî kaynak gerekir."],
  ], 0)),
  q("vmware", "Zor", mc("f8", "Apple Silicon Mac'i olan bir öğrenci için Workstation Pro uygun mudur?", [
    ["Hayır; Workstation Pro Windows/Linux içindir, Mac için Fusion bulunur (güncel desteği resmî sayfadan doğrula)", "Doğru: ürün aileleri host işletim sistemine göre ayrılır."],
    ["Evet, her platformda çalışır", "macOS host'u desteklenmez."],
    ["Yalnızca ISO ile", "Kurulum yöntemiyle ilgisi yok."],
    ["Sadece ağ varsa", "Ağ bağlantısı destek durumunu değiştirmez."],
  ], 0, { format: "Senaryo" })),
  q("sanal-makine-kurulumu", "Orta", mc("f9", "16 GB RAM'li bilgisayarda tek Kali VM'i için en dengeli başlangıç yapılandırması hangisidir?", [
    ["4 GB RAM, 2 CPU, 40 GB dinamik disk, NAT", "Doğru: host'a yeterli kaynak bırakır."],
    ["15 GB RAM, tüm çekirdekler", "Host'u kullanılamaz hale getirir."],
    ["256 MB RAM, 1 CPU", "Grafik masaüstü için çok düşük."],
    ["2 GB RAM, 2 GB disk", "Disk çok küçük."],
  ], 0, { format: "Doğru yapılandırma" })),
  q("sanal-makine-kurulumu", "Zor", ord("f10", "Sanal makine oluşturma sihirbazı adımlarını sırala.", ["Yeni makine oluştur (New)", "İsim, tür ve ISO seç", "RAM ve CPU belirle", "Sanal disk boyutunu seç", "Özeti kontrol et ve Finish", "Ayarları doğrula ve Start"], "Sihirbaz adımları bu sırayı izler.")),
  q("snapshot-ve-clone", "Kolay", mc("f11", "Hatalı yapılandırma sonrası makineyi eski çalışan duruma döndüren özellik hangisidir?", [
    ["Snapshot", "Doğru: belirli bir anın durumuna dönmeyi sağlar."],
    ["Clone", "Clone ayrı bir kopya oluşturur; mevcut makineyi geri almaz."],
    ["Host-only", "Bir ağ modudur."],
    ["ISO", "Kurulum medyasıdır."],
  ], 0)),
  q("snapshot-ve-clone", "Zor", mc("f12", "Bir linked clone'un ana makinesini silersen ne beklersin?", [
    ["Klon çalışmayabilir; çünkü ana diske bağımlıdır", "Doğru: linked clone ana diskten farkları saklar."],
    ["Klon etkilenmez", "Bağımlılık nedeniyle etkilenir."],
    ["Klon daha hızlı olur", "Silinmesi performans artırmaz."],
    ["Host kapanır", "İlişkisiz."],
  ], 0, { format: "Senaryo" })),
  q("nat-ve-bridged", "Kolay", mc("f13", "NAT modundaki VM'in tipik davranışı hangisidir?", [
    ["İnternete çıkabilir ama dışarıdan doğrudan erişilemez", "Doğru: NAT cihazı arkasında gizlidir."],
    ["Ağdaki her cihaz ona doğrudan ulaşır", "Bu Bridged için geçerli."],
    ["Hiçbir şekilde internete çıkamaz", "NAT'ta çıkış vardır."],
    ["Sadece başka VM'lerle konuşur", "Bu Internal içindir."],
  ], 0)),
  q("nat-ve-bridged", "Orta", mc("f14", "Bridged modun güvenlik açısından dikkat gerektirmesinin nedeni nedir?", [
    ["VM fiziksel ağda görünür ve ağdaki cihazlarla etkileşebilir", "Doğru."],
    ["İnternet hızını düşürmesi", "Ana neden bu değil."],
    ["Disk kullanması", "İlişkisiz."],
    ["Snapshot'ı silmesi", "İlişkisiz."],
  ], 0)),
  q("izole-laboratuvar", "Orta", mu("f15", "Güvenli başlangıç laboratuvarı için doğru ayarları seç.", [
    ["Pano paylaşımı kapalı", "Doğru."],
    ["Paylaşılan klasör kullanılmıyor", "Doğru."],
    ["Hedef VM Host-only veya Internal ağda", "Doğru."],
    ["Hedef VM Bridged ve internete açık", "Yanlış: riskli."],
  ], [0, 1, 2], "İzolasyon için paylaşım ve pano kapalı olmalı; hedef VM izole ağda çalışmalı.")),
  q("izole-laboratuvar", "Zor", mc("f16", "Topolojide hangi yapılandırma izolasyonu en çok bozar?", [
    ["Hedef VM'e ek olarak Bridged adaptör eklemek", "Doğru: hedefi fiziksel ağa açar."],
    ["Kali'yi Internal ağa bağlamak", "İzolasyonu artırır."],
    ["Snapshot almak", "Bir güvenlik önlemidir."],
    ["VM'e anlamlı isim vermek", "Güvenlik etkisi yoktur."],
  ], 0, { format: "Görsel yorumlama", screen: sc("Topoloji", [L([{ v: "Kali → Internal", sub: "iyi" }, { v: "Hedef → Internal + Bridged", hl: 1, sub: "?" }])], { 1: "Değerlendir." }) })),
  q("kali-linux-kurulumu", "Kolay", mc("f17", "Resmî hazır Kali VM imajında varsayılan kullanıcı ve parola nedir?", [
    ["kali / kali (girişten sonra parolayı değiştir)", "Doğru: resmî dokümantasyona göre varsayılan budur."],
    ["admin / 1234", "Resmî değildir."],
    ["root / root", "Güncel resmî imajlarda varsayılan bu değildir."],
    ["Parolasız", "Parola vardır."],
  ], 0)),
  q("kali-linux-kurulumu", "Orta", mc("f18", "ISO'nun SHA256 değeri resmî değerle uyuşmazsa ne yaparsın?", [
    ["Dosyayı silip yeniden indiririm", "Doğru: bozuk veya değiştirilmiş olabilir."],
    ["Yine de kurarım", "Riskli."],
    ["Değerleri eşitlemek için ISO'yu düzenlerim", "Mantıksız ve güvensiz."],
    ["Arkadaşımdan başka bir ISO isterim", "Resmî kaynak esastır."],
  ], 0, { format: "Senaryo" })),
  q("ubuntu-kurulumu", "Kolay", mc("f19", "Ubuntu için hangi sürüm türü öğrenme laboratuvarında genellikle önerilir?", [
    ["Güncel LTS", "Doğru: uzun süreli destek alır."],
    ["Çok eski sürüm", "Güvenlik güncellemesi alamaz."],
    ["Resmî olmayan imaj", "Doğrulanamaz."],
    ["Yalnızca daily build", "Kararlı olmayabilir."],
  ], 0)),
  q("ubuntu-kurulumu", "Zor", ord("f20", "Ubuntu kurulumunun temel adımlarını sırala.", ["ISO'yu indir ve doğrula", "Sanal makineyi oluştur", "ISO ile başlat, dil ve klavyeyi seç", "Disk ve hesap ayarlarını yap", "Kurulumu bitir ve ISO'yu çıkar", "Güncellemeleri uygula"], "Hazırlık, sanal makine, yükleyici, bitirme ve güncelleme sırası doğrudur.")),
  q("laboratuvar-guvenligi", "Orta", mc("f21", "Aşağıdakilerden hangisi laboratuvar güvenliğini en çok zayıflatır?", [
    ["Zafiyetli makineyi Bridged modda çalıştırmak", "Doğru: ev/okul ağındaki cihazlara görünür hale gelir."],
    ["Snapshot almak", "Güvenlik önlemidir."],
    ["Resmî ISO kullanmak", "Güvenli uygulamadır."],
    ["Güncelleme yapmak", "Güvenliği artırır."],
  ], 0)),
  q("laboratuvar-guvenligi", "Zor", mc("f22", "Sanal makinede bile olsa, sahibi olmadığın bir ağda izinsiz tarama yapmak için ne söylenebilir?", [
    ["Yasa dışı olabilir; sanallaştırma yetki yerine geçmez", "Doğru: yalnızca kendi laboratuvarında veya yazılı izinle test edilir."],
    ["Sanal makineden yapınca serbesttir", "Sanallaştırma izin sağlamaz."],
    ["Kısa sürerse sorun olmaz", "Süre izin yerine geçmez."],
    ["Parola biliyorsan serbesttir", "Parola bilmek yetki değildir."],
  ], 0, { format: "Senaryo" })),
];

export const FINAL_COUNT = FINAL_QUESTIONS.length;
