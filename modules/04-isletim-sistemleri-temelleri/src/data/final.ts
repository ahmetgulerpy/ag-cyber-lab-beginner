import type { Q } from "./types";

type FQ = [...Q, "Kolay" | "Orta" | "Uygulama"];

const RAW: FQ[] = [
  ["İşletim sisteminin temel görevlerinden biri aşağıdakilerden hangisidir?", ["Web sitesi tasarlamak", "Süreçlere CPU zamanı ve bellek paylaştırmak", "İnternet sağlayıcısı olmak", "Fotoğraf düzenlemek"], 1, "İşletim sistemi süreç, bellek, dosya, aygıt ve güvenlik yönetiminden sorumludur.", "Kolay"],
  ["Uygulamaların donanıma doğrudan erişmemesinin güvenlik açısından faydası nedir?", ["Daha az elektrik harcanması", "İşletim sisteminin her isteği denetleyip sınırlayabilmesi", "Ekranın daha parlak olması", "Dosyaların küçülmesi"], 1, "Tüm istekler kernel üzerinden geçtiği için izin ve sınır denetimi yapılabilir.", "Orta"],
  ["Windows'ta çalışan süreçleri izleyen ve yanıt vermeyen uygulamayı sonlandırabilen araç hangisidir?", ["Görev Yöneticisi", "Not Defteri", "Paint", "Hesap Makinesi"], 0, "Görev Yöneticisi (Task Manager) süreçleri ve kaynak kullanımını gösterir.", "Kolay"],
  ["'Linux' terimi teknik olarak neyi ifade eder?", ["Tam bir masaüstü paketini", "İşletim sistemi çekirdeğini (kernel)", "Bir paket yöneticisini", "Bir güvenlik duvarını"], 1, "Linux çekirdektir; GNU araçlarıyla birleşince GNU/Linux sistemi olur.", "Kolay"],
  ["Debian ailesinde (Ubuntu, Mint, Kali) yazılım kurmak için hangi paket yöneticisi kullanılır?", ["pacman", "dnf", "apt", "zypper"], 2, "Debian ailesi apt ve .deb paketlerini kullanır.", "Kolay"],
  ["Sürekli güncellenen, sürüm numarası yerine yayın akışı kullanan model hangisidir?", ["LTS", "Rolling release", "Sabit sürüm", "Snapshot"], 1, "Rolling release dağıtımlar (Arch gibi) sürekli güncellenir.", "Orta"],
  ["Kali Linux hakkında hangisi doğrudur?", ["İzin almadan her sistemi taramak yasaldır", "Debian tabanlı bir araç kutusudur; yetkisiz kullanım suçtur", "Günlük ofis kullanımı için tasarlanmıştır", "Hiç terminal içermez"], 1, "Kali profesyonel bir güvenlik testi platformudur; yazılı izin ve kapsam şarttır.", "Orta"],
  ["Linux'ta /var/log dizini ne için kullanılır?", ["Kullanıcı belgeleri", "Sistem ve hizmet kayıtları (log)", "Geçici dosyalar", "Programların çalıştırılabilir dosyaları"], 1, "/var/log günlük kayıtlarını içerir; olay incelemesinin ilk durağıdır.", "Kolay"],
  ["/home/ag dizinindeyken '../../etc/passwd' göreli yolu hangi dosyayı gösterir?", ["/home/etc/passwd", "/etc/passwd", "/home/ag/etc/passwd", "/ag/etc/passwd"], 1, "İki üst dizin kök (/) olur; ardından etc/passwd gelir.", "Uygulama"],
  ["En az yetki ilkesine göre günlük işler hangi hesapla yapılmalıdır?", ["Her zaman yönetici/root", "Standart kullanıcı; gerektiğinde geçici yetki yükseltme", "Misafir hesabı olmadan hiçbir zaman", "Kimlik doğrulamasız hesap"], 1, "Minimum yetki hasarı sınırlar; yükseltme gerektiğinde sudo/UAC kullanılır.", "Orta"],
  ["Otel örneğinde 'anahtar kartının yalnızca senin odanı açması' neyi temsil eder?", ["Kimlik doğrulama", "Yetkilendirme", "Şifreleme", "Yedekleme"], 1, "Kimlik doğrulama 'kimsin?', yetkilendirme 'ne yapabilirsin?' sorusudur.", "Orta"],
  ["Waiting durumundaki bir süreç beklediği olay gerçekleşince hangi duruma geçer?", ["Running", "Ready", "Terminated", "Doğrudan silinir"], 1, "Önce Ready olur; zamanlayıcı seçince Running'e geçer.", "Orta"],
  ["Servis (service) nedir?", ["Kullanıcıya görünen oyun penceresi", "Arka planda çalışan, çoğunlukla açılışta başlayan hizmet süreci", "Bir dosya türü", "Bir ağ kablosu"], 1, "Servisler kullanıcı oturumundan bağımsız arka planda çalışır.", "Kolay"],
  ["'ls -l /etc' komutunda '/etc' ifadesi nedir?", ["Seçenek", "Argüman", "Komut", "Kabuk"], 1, "/etc komutun üzerinde çalıştığı hedeftir (argüman); -l ise seçenektir.", "Kolay"],
  ["PowerShell komutlarının (cmdlet) adlandırma biçimi nedir?", ["Fiil-İsim (Get-Process)", "İsim.Uzantı", "Sayı-Harf", "Rastgele"], 0, "Cmdlet'ler Fiil-İsim yapısındadır: Get-Process, New-Item, Set-Location.", "Kolay"],
  ["Aşağıdaki Linux komutlarından hangisi 'önce ls ile hedef kontrol edilmezse' en yıkıcı sonuca yol açabilir?", ["pwd", "rm -rf klasor", "whoami", "date"], 1, "rm -rf sormadan ve geri dönüşsüz siler.", "Uygulama"],
  ["ping 8.8.8.8 başarılı, ping google.com 'host bulunamadı' diyor. Sorun nedir?", ["Kablo kopuk", "DNS (ad çözümleme)", "Ekran kartı", "Disk dolu"], 1, "IP erişimi çalışıyor, isim çözülemiyor: DNS sorunu.", "Uygulama"],
  ["chmod 640 dosyası için 'diğerleri' hangi izne sahiptir?", ["Okuma", "Yazma", "Hiçbiri", "Çalıştırma"], 2, "6=rw- (sahip), 4=r-- (grup), 0=--- (diğerleri).", "Uygulama"],
  ["Windows NTFS izinlerinde Allow ve Deny çakışırsa genel kural nedir?", ["Allow kazanır", "Deny, Allow'u geçersiz kılar", "İkisi de uygulanmaz", "Dosya silinir"], 1, "Açık Deny girişleri Allow'a baskın gelir.", "Orta"],
  ["Bellek sızıntısı olan bir program sistemde nasıl bir belirti yaratır?", ["Disk hızlanır", "Zamanla RAM tükenir, swap artar ve sistem yavaşlar", "CPU soğur", "Ağ hızlanır"], 1, "Geri verilmeyen bellek birikir; RAM dolunca diske taşıma yavaşlığa yol açar.", "Uygulama"],
];

export const FINAL_QUESTIONS: Q[] = RAW.map((r) => [r[0], r[1], r[2], r[3]] as Q);
export const FINAL_LEVELS: string[] = RAW.map((r) => r[4]);
