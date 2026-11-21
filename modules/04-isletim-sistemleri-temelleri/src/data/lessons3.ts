import type { Lesson } from "./types";

export const LESSONS_3: Lesson[] = [
  {
    id: 11,
    title: "Linux Terminal Komutları",
    short: "37 temel Linux komutu: dosya yönetimi, sistem bilgisi, arama, izin ve yetki komutları ile riskleri.",
    minutes: 60,
    goal: "Günlük Linux kullanımının ve siber güvenlik çalışmalarının temelini oluşturan komutları öğrenecek; güvenli sanal dosya sisteminde bunları çalıştırıp riskli komutlara (rm, chmod, chown, sudo) karşı bilinçleneceksin.",
    outcomes: [
      "Komut yapısını (komut seçenek argüman) doğru kurabilirsin.",
      "Dosya ve klasör işlemlerini komut satırından yapabilirsin.",
      "Sistem ve kullanıcı bilgilerini sorgulayabilirsin.",
      "grep ve find ile arama yapabilirsin.",
      "rm, chmod, chown ve sudo komutlarının risklerini açıklayabilirsin.",
    ],
    sections: [
      {
        h: "Linux terminal kullanımı ve komut yapısı",
        p: [
          "Linux komutları 'komut [seçenekler] [argümanlar]' yapısındadır. Kısa seçenekler tek tire (-l), uzun seçenekler çift tire (--help) ile yazılır; kısa seçenekler birleştirilebilir (-la = -l -a). Komutlar büyük/küçük harfe duyarlıdır: LS ile ls farklıdır. Takıldığında 'komut --help' veya 'man komut' ile yardım alınır.",
          "Tab tuşu otomatik tamamlar, yukarı ok önceki komutu getirir, Ctrl+C çalışan komutu durdurur, Ctrl+L ekranı temizler. Bu küçük alışkanlıklar hızı ve doğruluğu çok artırır. Bu laboratuvarda yukarı/aşağı ok ve Ctrl+L desteklenir.",
        ],
      },
      {
        h: "Dosya ve klasör yönetimi",
        p: [
          "Gezinme için pwd (neredeyim), ls (içerik), cd (geç) kullanılır. Oluşturma için mkdir (klasör) ve touch (boş dosya) vardır. Kopyalama cp, taşıma/yeniden adlandırma mv, silme rm (dosya) ve rmdir (boş klasör) ile yapılır. Klasörleri içindekilerle kopyalamak/silmek için -r (recursive — özyinelemeli) gerekir.",
          "Linux'ta Geri Dönüşüm Kutusu yoktur: rm ile silinen dosya geri gelmez. Bu yüzden silmeden önce 'ls' ile hedefi görmek ve gerekirse -i seçeneğiyle onay istemek iyi bir pratiktir. Joker karakter (*) 'rm *.txt' gibi toplu işlem sağlar ama dikkat ister.",
        ],
        note: { type: "danger", text: "rm -rf kombinasyonu sormadan ve geri dönüşsüz siler. 'rm -rf /' veya yanlış boşlukla yazılmış 'rm -rf / tmp' sistemi yok eder. Simülasyonumuz bu komutu engeller; gerçek sistemde engelleme yoktur!" },
      },
      {
        h: "Dosya görüntüleme ve arama",
        p: [
          "cat dosyanın tamamını yazar, less sayfa sayfa gösterir, head ilk satırları, tail son satırları verir (log izlemede çok kullanılır). grep dosya içinde metin arar (-i büyük/küçük harf fark etmez, -n satır no, -r klasörlerde arar). find dosya sisteminde ada veya türe göre dosya bulur.",
          "Örneğin saldırı incelemesinde 'grep Failed /var/log/auth.log' başarısız giriş denemelerini listeler. Boru ile birleştirince güç katlanır: 'cat auth.log | grep Failed | wc -l' başarısız deneme sayısını verir.",
        ],
      },
      {
        h: "Kullanıcı ve sistem bilgisi",
        p: [
          "whoami aktif kullanıcıyı, id kullanıcı ve grup kimliklerini, hostname makine adını, uname çekirdek ve sistem bilgisini, date tarih-saati, uptime açık kalma süresini ve yük ortalamasını gösterir. Bu komutlar 'hangi makinede, kim olarak, hangi sürümdeyim?' sorularını saniyeler içinde yanıtlar.",
          "df -h disk doluluğunu, free -h bellek durumunu, ps aux çalışan süreçleri, top ise canlı kaynak kullanımını gösterir. Sistem yavaşladığında ilk bakılacak yerler bunlardır (Ders 14).",
        ],
      },
      {
        h: "İzin ve yetki komutları: chmod, chown, sudo",
        p: [
          "chmod dosya izinlerini değiştirir (chmod 644 dosya, chmod u+x betik). chown dosyanın sahibini ve grubunu değiştirir (genellikle root gerekir). sudo bir komutu geçici olarak root yetkisiyle çalıştırır. Bu üç komut sistemin güvenlik modelini doğrudan etkilediği için yanlış kullanımı ağır sonuçlar doğurur.",
          "Tipik hatalar: chmod 777 ile herkese tam yetki vermek (web sunucusunda saldırgana dosya yükleme izni demektir), chown -R ile yanlış dizinde sahiplik değiştirmek (sistem hizmetlerinin bozulması), anlamadığın bir komutu sudo ile çalıştırmak. Kural: 'Gerekli en dar izni ver, komutu anlamadan sudo kullanma.'",
        ],
        note: { type: "warn", text: "Yetki komutlarında risk yönetimi: 1) Hedef yolu kontrol et. 2) -R seçeneğini çok dikkatli kullan. 3) 777 yerine 755/644/700/600 gibi dar izinleri tercih et. 4) sudo komutunu çalıştırmadan önce yüksek sesle ne yaptığını açıkla." },
      },
      {
        h: "Paket yönetimine giriş ve komut geçmişi",
        p: [
          "Debian/Ubuntu'da yazılım yönetimi apt ile yapılır: sudo apt update (paket listesini yenile), sudo apt install paket (kur), sudo apt remove paket (kaldır). Kurulum sistem değiştirdiği için yönetici yetkisi ister. Güvenliğin temel kuralı yalnızca resmi depolardan kurmaktır.",
          "history komutu yazdığın komutları numaralı gösterir. Güvenlik analizinde saldırganın veya kullanıcının hangi komutları çalıştırdığını anlamak için geçmiş dosyaları (~/.bash_history) incelenir. Kendi geçmişinde parola bırakmamaya dikkat et.",
        ],
      },
    ],
    concepts: [
      ["Seçenek (flag)", "Komutun davranışını değiştirir: -l, -a, -r."],
      ["Özyinelemeli (-r)", "Klasörü içindekilerle birlikte işleme."],
      ["Joker (*)", "Birden fazla dosyayı eşleştiren desen."],
      ["Yönlendirme (>, >>)", "Çıktıyı dosyaya yazma / ekleme."],
      ["Boru (|)", "Komut çıktısını sonraki komuta aktarma."],
      ["Paket yöneticisi (apt)", "Yazılım kurma ve güncelleme aracı."],
    ],
    everyday: [
      "rm, 'kağıdı parçalayıcıdan geçirmek' gibidir; çöp kutusu yoktur.",
      "chmod, ofis kapılarına kimin girebileceğini belirleyen anahtar kartı ayarıdır.",
      "grep, kalabalık bir kitapta belirli kelimeyi arayan 'Ctrl+F'in komut satırı hâlidir.",
    ],
    technical: [
      "tail -n 20 /var/log/syslog sistem kayıtlarının son 20 satırını gösterir.",
      "find /home -name '*.txt' ev dizinlerinde tüm .txt dosyalarını bulur.",
      "chmod 600 anahtar.pem özel anahtarı yalnızca sahibine okunur yapar.",
    ],
    examples: [
      { title: "Dosya yönetimi", code: "$ mkdir -p proje/raporlar\n$ touch proje/notlar.txt\n$ cp rapor.txt proje/raporlar/\n$ ls -l proje\n$ mv proje/notlar.txt proje/ders.txt", desc: "-p ara klasörleri de oluşturur." },
      { title: "Arama ve filtreleme", code: "$ grep -i failed /var/log/auth.log\n$ grep -n sudo /var/log/auth.log\n$ find /home -name '*.txt'\n$ cat /var/log/auth.log | grep Failed | wc -l", desc: "Güvenlik loglarını incelemenin temeli." },
      { title: "İzinler", code: "$ ls -l notlar.txt\n-rw-r--r-- 1 ag ag 90 Jan 14 10:21 notlar.txt\n$ chmod 600 notlar.txt\n$ ls -l notlar.txt\n-rw------- 1 ag ag 90 Jan 14 10:21 notlar.txt", desc: "600: yalnızca sahip okuyup yazabilir." },
    ],
    guide: [
      "Sağdaki komut rehberinden bir komut seç; ne işe yaradığını, kullanımını, parametrelerini ve riskini oku.",
      "'Terminalde dene' düğmesiyle örneği çalıştır ve çıktıyı incele.",
      "mkdir + touch, cp/mv, cat/head/tail, grep/find ile görev listesindeki adımları tamamla.",
      "chmod ile bir dosyanın iznini değiştir; ls -l ile doğrula.",
      "sudo cat /etc/shadow komutunu dene; sudo olmadan farkı gör.",
      "rm komutunun riskini okuyup sanal dosyada dene; 'rm -rf /' komutunun simülasyonda neden engellendiğini oku.",
    ],
    after: [
      "Her komutun çıktısı bir önceki durumun sonucudur; ls ile doğrulama alışkanlığı kazan.",
      "İzin hatası (Permission denied) genelde hata değil, korumanın çalıştığının göstergesidir.",
      "rm, chmod, chown ve sudo gücü yüksek, hata payı düşük olması gereken komutlardır.",
    ],
    summary: [
      "Komut yapısı: komut + seçenek + argüman.",
      "Dosya yönetimi: pwd, ls, cd, mkdir, touch, cp, mv, rm, rmdir.",
      "Görüntüleme: cat, less, head, tail; arama: grep, find.",
      "Bilgi: whoami, id, hostname, uname, date, uptime, df, free, ps, top.",
      "Riskli komutlar: rm -rf, chmod 777, chown -R, sudo.",
    ],
    quiz: [
      ["Boş olmayan bir klasörü içindekilerle birlikte silmek için hangi seçenek gerekir?", ["-l", "-r", "-h", "-a"], 1, "-r (recursive) klasörü içindekilerle siler; -f ile birleştirilince onay istemez ve çok risklidir."],
      ["Bir log dosyasının son 5 satırını görmek için hangi komut uygundur?", ["head -n 5 log", "tail -n 5 log", "cat -5 log", "df -n 5 log"], 1, "tail dosyanın sonunu gösterir; head başını."],
      ["'chmod 777' neden risklidir?", ["Dosyayı siler", "Herkese okuma, yazma ve çalıştırma izni vererek saldırı yüzeyini büyütür", "Dosyayı şifreler", "Dosya adını değiştirir"], 1, "777 herkese tam yetki verir; yetkisiz kullanıcılar dosyayı değiştirebilir veya çalıştırabilir."],
      ["Disk doluluğunu okunabilir biçimde gösteren komut hangisidir?", ["free -h", "df -h", "ps aux", "uptime"], 1, "df -h disk bölümlerinin doluluğunu gösterir; free -h belleği."],
      ["Linux'ta 'rm' ile silinen dosya hakkında hangisi doğrudur?", ["Geri dönüşüm kutusuna gider", "Genellikle geri gelmez; çöp kutusu yoktur", "30 gün sonra silinir", "Yalnızca gizlenir"], 1, "rm kalıcı siler; bu yüzden hedefi iki kez kontrol etmek gerekir."],
    ],
  },
  {
    id: 12,
    title: "Windows Temel Komutları",
    short: "ipconfig, ping, tracert, nslookup, netstat, tasklist, systeminfo, chkdsk ve sfc ile sorun giderme.",
    minutes: 50,
    goal: "Windows'ta ağ, kullanıcı, sistem ve süreç bilgilerini görüntüleyen temel komutları öğrenecek; basit ağ bağlantı sorunlarını sanal bir laboratuvarda tanılayıp çözmeyi pratik edeceksin.",
    outcomes: [
      "Ağ bilgisini ipconfig ile okuyabilirsin.",
      "ping, tracert ve nslookup ile bağlantı sorunlarının katmanını tahmin edebilirsin.",
      "netstat ve tasklist ile bağlantıları ve süreçleri inceleyebilirsin.",
      "chkdsk ve sfc'nin ne işe yaradığını (kavramsal) anlatabilirsin.",
    ],
    sections: [
      {
        h: "Windows komut satırının önemi",
        p: [
          "Grafik arayüz çalışmadığında, uzaktaki bir bilgisayarı yönetirken veya hızlı tanı gerektiğinde komut satırı ilk başvurulan araçtır. Teknik destek uzmanları 'bir komut yazar mısın?' derken genellikle ipconfig veya ping'i kastederler. Çıktıları kopyalanabilir, kayda alınabilir ve paylaşılabilir olduğu için sorun giderme süreci hızlanır.",
          "Komutların çoğu hem CMD'de hem PowerShell'de çalışır. Bu derste öğrenilen komutlar salt-okunur tanı komutlarıdır; sistemi bozmazlar (chkdsk /f ve sfc /scannow gibi onarım içerenler hariç, ki onlar yalnızca kavramsal/simülasyon düzeyinde işlenir).",
        ],
      },
      {
        h: "Ağ komutları: ipconfig, ping, tracert, nslookup",
        p: [
          "ipconfig bilgisayarın IP adresini, alt ağ maskesini ve varsayılan ağ geçidini (gateway) gösterir; /all ayrıntı, /release ve /renew DHCP'den yeni adres alma, /flushdns DNS önbelleğini temizleme içindir. 169.254.x.x ile başlayan adres (APIPA), DHCP'den adres alınamadığının işaretidir.",
          "ping hedefe küçük ICMP paketleri yollayıp yanıt süresini ölçer: yanıt varsa bağlantı vardır. tracert paketin hedefe giderken uğradığı yönlendiricileri (hop) listeler; sorunun hangi atlamada olduğunu gösterir. nslookup alan adının IP adresine çözümlenip çözümlenmediğini (DNS) sınar.",
        ],
        list: ["ping 127.0.0.1 → kendi ağ yığınım çalışıyor mu?", "ping ağ-geçidi → yerel ağım çalışıyor mu?", "ping 8.8.8.8 → internete IP ile çıkabiliyor muyum?", "ping google.com → DNS (ad çözümleme) çalışıyor mu?"],
      },
      {
        h: "Sorun giderme mantığı (katman katman)",
        p: [
          "Bağlantı sorunlarında 'içten dışa' ilerlenir: önce kendi bilgisayarın (127.0.0.1), sonra yerel ağ (ağ geçidi), sonra internet (dış IP), en son ad çözümleme (DNS). İlk başarısız adım sorunun bulunduğu katmanı gösterir: ağ geçidine ulaşamıyorsan kablo/Wi-Fi/IP ayarını, dış IP'ye ulaşamıyorsan modemi/servis sağlayıcıyı, yalnızca isimle ulaşamıyorsan DNS'i suçlarsın.",
          "Bu yöntem rastgele denemeden çok daha hızlıdır ve siber güvenlikte ağ tabanlı olay analizinin de temelidir. Laboratuvardaki senaryolar tam olarak bu mantığı uygulamanı sağlar.",
        ],
      },
      {
        h: "Kullanıcı, sistem ve süreç komutları",
        p: [
          "hostname bilgisayar adını, whoami kullanıcıyı (ve etki alanını), systeminfo işletim sistemi sürümü, bellek ve yama bilgilerini verir. tasklist çalışan süreçleri PID ve bellek kullanımıyla listeler; netstat açık bağlantıları ve dinleyen portları gösterir. Bu iki komut birlikte 'hangi program hangi bağlantıyı kuruyor?' sorusunun ilk adımıdır.",
          "Şüpheli bir bağlantı görürsen (ör. tanımadığın bir dış adrese ESTABLISHED bağlantı) netstat çıktısındaki PID'yi tasklist ile eşleştirip ilgili süreci bulursun.",
        ],
      },
      {
        h: "chkdsk ve sfc (kavramsal)",
        p: [
          "chkdsk (check disk), disk dosya sistemi hatalarını ve bozuk sektörleri denetler; /f seçeneğiyle onarmaya çalışır. sfc /scannow (System File Checker) korunan Windows sistem dosyalarını denetler ve bozuk olanları onarır. Her ikisi de yönetici yetkisi gerektirir ve uzun sürebilir.",
          "Bu komutlar gerçek sistemde değişiklik yaptığı için bu eğitimde yalnızca simülasyon düzeyinde çalıştırılır. Simülasyonda 'Yönetici olarak çalıştır' anahtarını açarak yetki gereksinimini deneyimleyebilirsin: yetkisiz çalıştırınca gerçek Windows'ta olduğu gibi erişim reddedilir.",
        ],
        note: { type: "warn", text: "Gerçek bir bilgisayarda chkdsk /f ve sfc /scannow'u yalnızca ihtiyaç duyduğunda ve yedek aldıktan sonra çalıştır." },
      },
    ],
    concepts: [
      ["IP adresi", "Cihazın ağdaki adresi (ör. 192.168.1.25)."],
      ["Varsayılan ağ geçidi", "Yerel ağdan dışarı çıkış kapısı (modem/router)."],
      ["DNS", "Alan adlarını IP adreslerine çeviren sistem."],
      ["DHCP / APIPA", "Otomatik IP dağıtımı / ulaşılamayınca atanan 169.254.x.x adres."],
      ["ICMP (ping)", "Bağlantı testinde kullanılan basit protokol."],
      ["Port / Bağlantı durumu", "LISTENING dinliyor, ESTABLISHED kurulu bağlantı."],
    ],
    everyday: [
      "ping, bir arkadaşa 'duyuyor musun?' diye seslenmek gibidir; yanıt gelirse hat açıktır.",
      "tracert, kargo takip numarasıdır: paketin hangi aktarma merkezlerinden geçtiğini gösterir.",
      "nslookup rehberden isim arayıp telefon numarasını bulmaya benzer; DNS bir telefon rehberidir.",
    ],
    technical: [
      "ipconfig /flushdns eski DNS kayıtlarını temizleyerek ad çözümleme sorunlarını giderebilir.",
      "netstat -an dinleyen portları sayısal gösterir; beklenmeyen açık port güvenlik sinyalidir.",
      "tasklist | findstr chrome yalnızca chrome süreçlerini süzer.",
    ],
    examples: [
      { title: "Bağlantı tanısı", code: "C:\\> ipconfig\nC:\\> ping 127.0.0.1\nC:\\> ping 192.168.1.1\nC:\\> ping 8.8.8.8\nC:\\> ping google.com", desc: "İçten dışa sırayla test et; ilk başarısız adım sorunu gösterir." },
      { title: "Bağlantı ve süreç ilişkisi", code: "C:\\> netstat\nC:\\> tasklist | findstr chrome\nC:\\> systeminfo\nC:\\> whoami", desc: "Bilgi toplama komutları yalnızca okur, sistemi değiştirmez." },
    ],
    guide: [
      "Terminalde ipconfig ve ping google.com komutlarını çalıştır.",
      "tracert, nslookup, netstat ve tasklist komutlarını sırayla dene.",
      "systeminfo, hostname ve whoami çıktısını incele.",
      "'Yönetici olarak çalıştır' anahtarı kapalıyken sfc /scannow dene; sonra aç ve yeniden dene.",
      "Sağdaki ağ sorunu senaryosunu başlat, komutlarla tanıla ve çöz. İki senaryoyu tamamla.",
    ],
    after: [
      "Her hata mesajı sorunun katmanını işaret eder (kablo, IP, ağ geçidi, DNS).",
      "Doğru sıra: 127.0.0.1 → ağ geçidi → dış IP → alan adı.",
      "Onarım komutları yetki ister; tanı komutları ise güvenle çalıştırılır.",
    ],
    summary: [
      "ipconfig ağ ayarlarını, ping bağlantıyı, tracert yolu, nslookup DNS'i gösterir.",
      "netstat bağlantıları, tasklist süreçleri listeler.",
      "systeminfo, hostname, whoami sistem ve kullanıcı bilgisini verir.",
      "chkdsk ve sfc disk ve sistem dosyası denetimi içindir; yetki gerektirir.",
      "Sorun gidermede içten dışa test sırası izlenir.",
    ],
    quiz: [
      ["Bilgisayarın IP adresini ve varsayılan ağ geçidini gösteren komut hangisidir?", ["ipconfig", "tasklist", "chkdsk", "whoami"], 0, "ipconfig ağ yapılandırmasını gösterir."],
      ["ping 8.8.8.8 başarılı ama ping google.com başarısızsa sorun büyük olasılıkla neresidir?", ["Kablo", "DNS (ad çözümleme)", "Ekran kartı", "Disk"], 1, "IP ile erişim varsa internet çalışıyordur; isim çözümlenemiyorsa DNS sorunludur."],
      ["169.254.x.x adresi neyi işaret eder?", ["Sunucu adresi", "DHCP'den IP alınamadığını (APIPA)", "Güvenlik duvarını", "İnternet hızını"], 1, "APIPA adresi, DHCP sunucusuna ulaşılamadığında otomatik atanır."],
      ["Çalışan süreçleri PID ile listeleyen Windows komutu hangisidir?", ["tasklist", "nslookup", "tracert", "hostname"], 0, "tasklist çalışan süreçleri ve PID'lerini gösterir."],
      ["sfc /scannow ne yapar?", ["Ağ hızını ölçer", "Korunan Windows sistem dosyalarını denetler ve onarır", "Yeni kullanıcı oluşturur", "DNS önbelleğini temizler"], 1, "System File Checker bozuk sistem dosyalarını denetler/onarır; yönetici yetkisi gerekir."],
    ],
  },
  {
    id: 13,
    title: "Dosya İzinleri",
    short: "Okuma, yazma, çalıştırma; Linux rwx ve sayısal gösterim; chmod/chown; Windows NTFS izinleri ve riskler.",
    minutes: 55,
    goal: "Erişim kontrolünün temelini oluşturan dosya izinlerini Linux ve Windows NTFS'de öğrenecek; sayısal ve sembolik gösterimi okuyup yazacak, yanlış izinlerin güvenlik risklerini uygulamalı göreceksin.",
    outcomes: [
      "Read, Write ve Execute izinlerinin anlamını (dosya ve klasör için) açıklayabilirsin.",
      "rwxr-xr-x gösterimini ve 755/644/700/600 sayılarını çevirebilirsin.",
      "chmod ve chown'un amacını anlatabilirsin.",
      "NTFS izin türlerini (Full Control, Modify, Read & Execute vb.) tanıyabilirsin.",
      "Aşırı izin kaynaklı riskleri örneklerle sıralayabilirsin.",
    ],
    sections: [
      {
        h: "Dosya izinleri ve erişim kontrolü",
        p: [
          "Erişim kontrolü (Access Control), 'kim hangi kaynağa hangi işlemi yapabilir?' sorusunu kurallarla yanıtlar. Dosya izinleri bu kuralların en temel biçimidir. Her dosya veya klasör için üç temel işlem tanımlıdır: Read (Okuma, r), Write (Yazma/değiştirme, w), Execute (Çalıştırma, x).",
          "Klasörlerde anlamları farklıdır: r içeriği listelemeyi, w içinde dosya oluşturma/silmeyi, x ise klasöre girebilmeyi (içindeki dosyalara erişmeyi) sağlar. Dosyada x, dosyanın program/betik olarak çalıştırılabilmesi demektir.",
        ],
      },
      {
        h: "Linux izinleri: kullanıcı, grup, diğerleri",
        p: [
          "Linux'ta her dosyanın bir sahibi (user), bir grubu (group) ve 'diğerleri' (others) sınıfı vardır. Her sınıf için üç izin biti bulunur; toplam dokuz bit. ls -l çıktısı: -rwxr-xr-- → ilk karakter tür (- dosya, d dizin), sonra sırasıyla sahip (rwx), grup (r-x), diğerleri (r--).",
          "Erişim denetimi sırasıyla yapılır: kullanıcı sahipse sahip bitleri, değilse ve grup üyesiyse grup bitleri, hiçbiri değilse diğerleri bitleri uygulanır; ilk eşleşen sınıf karar verir. root bu denetimin dışındadır.",
        ],
        list: ["r = 4, w = 2, x = 1", "rwx = 7, r-x = 5, rw- = 6, r-- = 4, --- = 0", "755 → rwxr-xr-x   |   644 → rw-r--r--", "700 → rwx------   |   600 → rw-------"],
      },
      {
        h: "Sayısal gösterim ve yaygın izinler",
        p: [
          "Her sınıfın izinleri toplanarak tek rakam elde edilir: r(4)+w(2)+x(1)=7. Üç rakam sırasıyla sahip, grup ve diğerleri içindir. 755: sahip tam yetkili, grup ve diğerleri okuyup çalıştırabilir — genel programlar ve klasörler için tipiktir. 644: sahip okur/yazar, diğerleri sadece okur — normal belgeler için.",
          "700 yalnızca sahibine tam yetki verir (özel klasörler). 600 yalnızca sahibine okuma/yazma verir — SSH özel anahtarı ve parolalı yapılandırma dosyaları için zorunludur; SSH, 644 gibi gevşek izinli anahtarı reddeder. Laboratuvarda bu dört değeri yan yana karşılaştıracaksın.",
        ],
      },
      {
        h: "chmod ve chown",
        p: [
          "chmod izinleri değiştirir. Sayısal: chmod 640 dosya. Sembolik: chmod u+x betik (sahibe çalıştırma ekle), chmod go-w dosya (grup ve diğerlerinden yazmayı al), chmod a+r (herkese okuma). Yalnızca dosya sahibi veya root izinleri değiştirebilir.",
          "chown sahibi ve grubu değiştirir: sudo chown www-data:www-data /var/www/site. Sahiplik root gerektirir; çünkü başkasına dosya 'vermek' disk kotası ve güvenlik açısından yetkili işlemdir. Web sunucusu dosyalarına sunucu hesabının erişebilmesi gibi durumlarda kullanılır.",
        ],
        note: { type: "danger", text: "chmod -R 777 ve chown -R komutlarını kök dizin veya sistem dizinlerinde çalıştırmak sistemi kullanılamaz hâle getirebilir. Her zaman hedef yolu kontrol et." },
      },
      {
        h: "Windows NTFS izinleri",
        p: [
          "NTFS izinleri, bir dosya veya klasör için Erişim Denetim Listesi (ACL) ile tanımlanır. Listedeki her giriş (ACE), bir kullanıcı veya grup için izin verir (Allow) ya da engeller (Deny). Başlıca izin düzeyleri: Full Control (Tam Denetim), Modify (Değiştirme), Read & Execute (Okuma ve Yürütme), List Folder Contents, Read, Write.",
          "Etkin izin, kullanıcının kendi ve üye olduğu gruplardaki izinlerin birleşimidir; ancak açık bir Deny, Allow'u geçersiz kılar. İzinler üst klasörden miras alınır (inheritance). Dosyaya sağ tık > Özellikler > Güvenlik sekmesinden görüntülenir; icacls komutu komut satırından aynısını yapar.",
        ],
      },
      {
        h: "İzin hataları ve güvenlik riskleri",
        p: [
          "Çok gevşek izinler: web sunucusu klasörüne 777 verilirse saldırgan zararlı betik yükleyip çalıştırabilir. /etc/shadow'un herkes tarafından okunabilir olması parola özetlerinin sızması demektir. Özel anahtarın 644 olması anahtar çalınmasına yol açar. Windows'ta 'Everyone: Full Control' verilen paylaşım klasörü fidye yazılımının tüm dosyaları şifrelemesini kolaylaştırır.",
          "Çok sıkı izinler de sorundur: servisin kendi dosyasını okuyamaması hizmeti durdurur. Doğru yaklaşım en az yetki ilkesidir: gereken en dar izni ver, düzenli olarak denetle, test et. İzin sorunlarında ilk bakılacak yer ls -l ve id çıktılarıdır.",
        ],
      },
    ],
    concepts: [
      ["Read / Write / Execute", "Okuma, yazma, çalıştırma izinleri."],
      ["Sahip / Grup / Diğerleri", "Linux'taki üç izin sınıfı."],
      ["Sayısal gösterim", "r=4, w=2, x=1 toplamlarıyla 3 rakamlı izin."],
      ["chmod / chown", "İzin değiştirme / sahip değiştirme."],
      ["ACL (NTFS)", "Windows'ta izin giriş listesi."],
      ["Miras (Inheritance)", "Üst klasör izinlerinin alt öğelere geçmesi."],
    ],
    everyday: [
      "Ev anahtarı: sahip (sen) her yere girer, aile (grup) salona girer, misafir (diğerleri) sadece kapıda bekler.",
      "Ortak bir klasördeki 'herkes değiştirebilir' ayarı, ortak panoya herkesin yazabilmesine benzer; biri yanlışlıkla (veya kasten) her şeyi bozabilir.",
      "SSH anahtarı bir evin yedek anahtarıdır; herkesin görebileceği yere (644) bırakmak mantıksızdır.",
    ],
    technical: [
      "ls -l çıktısı: -rw-r--r-- 1 ag dev 90 Jan 14 notlar.txt → sahip ag rw-, grup dev r--, diğerleri r--.",
      "chmod u+x betik.sh dosyayı sahibi için çalıştırılabilir yapar.",
      "icacls C:\\Lab komutu Windows'ta klasörün ACL'sini gösterir.",
    ],
    examples: [
      { title: "Sembolikten sayısala", code: "rwx r-x r--\n 7   5   4   →  754\n\nrw- r-- ---\n 6   4   0   →  640", desc: "Her üçlü toplanır: r=4, w=2, x=1." },
      { title: "chmod örnekleri", code: "$ chmod 755 program.sh   # sahip: rwx, diğerleri: r-x\n$ chmod 644 rapor.txt    # sahip: rw-, diğerleri: r--\n$ chmod 700 ozel/        # yalnız sahip\n$ chmod 600 anahtar.pem  # yalnız sahip okur/yazar\n$ chmod go-w rapor.txt   # sembolik: grup ve diğerlerinden yazma al", desc: "Dört yaygın izin değeri bu dersin kalbidir." },
    ],
    guide: [
      "Dosya listesinden bir dosya seç; sahibi, grubu ve mevcut izinleri gör.",
      "rwx kutularını tıklayarak izinleri değiştir; sembolik ve sayısal gösterimin birlikte güncellendiğini izle.",
      "755, 644, 700 ve 600 ön ayarlarına tek tek bas ve açıklamalarını oku.",
      "'Erişim testi' bölümünde farklı kullanıcılarla Okuma/Yazma/Çalıştırma dene; sebebini oku.",
      "777 izni ver ve risk uyarısını oku.",
      "NTFS sekmesinde izin matrisini değiştirip kullanıcı testi yap.",
    ],
    after: [
      "Erişim, kullanıcının hangi sınıfta olduğuna göre belirlenir; sınıf eşleşmesi sırası: sahip → grup → diğerleri.",
      "Güvenlik için 'varsayılan: kapalı, ihtiyaca göre aç' yaklaşımı benimsenmelidir.",
      "Linux'ta r/w/x ve NTFS'te Read/Write/Modify aynı amaca hizmet eder: en az yetki.",
    ],
    summary: [
      "r=4, w=2, x=1; üç sınıf: sahip, grup, diğerleri.",
      "755, 644, 700, 600 en yaygın izinlerdir.",
      "chmod izin, chown sahiplik değiştirir.",
      "NTFS ACL, Allow/Deny ve miras kullanır.",
      "Aşırı izinler (777, Everyone: Full Control) ciddi riskler doğurur.",
    ],
    quiz: [
      ["chmod 755 hangi izinleri verir?", ["rwxr-xr-x", "rw-r--r--", "rwx------", "rwxrwxrwx"], 0, "7=rwx (sahip), 5=r-x (grup), 5=r-x (diğerleri)."],
      ["SSH özel anahtarı için en uygun izin hangisidir?", ["777", "644", "600", "666"], 2, "600 yalnızca sahibine okuma/yazma verir; gevşek izinli anahtar SSH tarafından reddedilir."],
      ["Linux'ta bir dosyada 'x' izni ne sağlar?", ["Dosyayı silmeyi", "Dosyanın program/betik olarak çalıştırılmasını", "Dosyanın adını değiştirmeyi", "Dosyayı şifrelemeyi"], 1, "x (execute) dosyanın çalıştırılabilmesini; klasörde ise içine girilebilmesini sağlar."],
      ["NTFS'te açık 'Deny' (Engelle) girişi ile 'Allow' çakışırsa ne olur?", ["Allow kazanır", "Deny genellikle Allow'u geçersiz kılar", "İkisi de iptal olur", "Dosya silinir"], 1, "NTFS'te Deny, Allow'dan önceliklidir."],
      ["Web sunucusu klasörüne 777 vermenin riski nedir?", ["Hiçbir riski yoktur", "Herkes dosya yükleyip değiştirebilir; zararlı betik çalıştırma riski doğar", "Sunucu hızlanır", "Dosyalar sıkışır"], 1, "Herkese yazma izni, saldırganın zararlı dosya yerleştirmesine olanak tanır."],
    ],
  },
  {
    id: 14,
    title: "Sistem Kaynakları ve Yönetimi",
    short: "CPU, RAM, disk ve GPU kullanımı; kaynak izleme araçları ve performans–güvenlik ilişkisi.",
    minutes: 50,
    goal: "Bilgisayarın temel kaynaklarını (CPU, RAM, disk, GPU) ve işletim sisteminin bunları nasıl yönettiğini öğrenecek; kaynak tüketimi sorunlarını canlı grafiklerle izleyip çözecek ve performans ile güvenlik arasındaki bağı kuracaksın.",
    outcomes: [
      "CPU, RAM, disk ve GPU kullanımının ne anlama geldiğini açıklayabilirsin.",
      "Windows Görev Yöneticisi ve Linux top/free çıktısını yorumlayabilirsin.",
      "Yüksek kaynak tüketen süreçleri tespit edebilirsin.",
      "Kaynak anormalliklerinin güvenlik sinyali olabileceğini açıklayabilirsin.",
    ],
    sections: [
      {
        h: "Sistem kaynakları nedir?",
        p: [
          "Sistem kaynakları, programların çalışmak için ihtiyaç duyduğu sınırlı donanım kapasitesidir: işlemci zamanı (CPU), bellek (RAM), depolama alanı ve hızı (disk), grafik işlem gücü (GPU) ve ağ bant genişliği. Kaynaklar sınırlı olduğu için işletim sistemi bunları süreçler arasında adil ve verimli paylaştırmak zorundadır.",
          "Bir kaynak tükendiğinde sistem yavaşlar, donar veya program çöker. Örneğin RAM dolunca işletim sistemi veriyi diske taşır (swap/sayfa dosyası) ve disk RAM'den çok yavaş olduğu için bilgisayar belirgin şekilde yavaşlar.",
        ],
      },
      {
        h: "CPU kullanımı",
        p: [
          "CPU (Central Processing Unit) komutları çalıştıran beynidir. CPU kullanımı yüzdesi, işlemcinin ne kadar zamanını iş yaparak geçirdiğini gösterir. %100'e yakın süreklilik, işlemcinin yetişemediği anlamına gelir; uygulamalar gecikir. Çok çekirdekli işlemcilerde süreçler çekirdeklere dağıtılır.",
          "Kısa süreli yükselme normaldir (program açılışı, derleme). Boşta iken sürekli yüksek CPU ise şüphelidir: kötü yazılmış bir program, sonsuz döngü veya kripto para madenciliği yapan zararlı yazılım olabilir. Yük ortalaması (load average) Linux'ta CPU'yu bekleyen süreç yoğunluğunu gösterir.",
        ],
      },
      {
        h: "RAM ve bellek yönetimi",
        p: [
          "RAM, çalışan programların ve verilerinin geçici olarak tutulduğu hızlı bellektir; kapanınca içeriği silinir. İşletim sistemi her sürece ayrı sanal adres alanı verir, kullanılmayan bölümleri diske (swap/sayfa dosyası) taşıyabilir ve sık kullanılan dosyaları önbellekte (cache) tutarak hız kazandırır.",
          "Bellek sızıntısı (memory leak), bir programın kullandığı belleği geri vermeyip sürekli artırmasıdır; zamanla RAM tükenir ve sistem yavaşlar. Linux'ta free -h, Windows'ta Görev Yöneticisi > Performans > Bellek ile izlenir. 'Kullanılan' bellekten çok 'kullanılabilir (available)' bellek önemlidir; önbellek gerektiğinde boşaltılır.",
        ],
      },
      {
        h: "Disk, depolama ve GPU",
        p: [
          "Disk iki açıdan ölçülür: doluluk (ne kadar alan kaldı) ve performans (okuma/yazma hızı, gecikme). SSD'ler HDD'lerden çok daha hızlıdır. Disk %90 üzeri dolduğunda sistem yavaşlar, güncellemeler ve geçici dosyalar başarısız olur; kontrolsüz büyüyen log dosyaları sık nedendir.",
          "GPU (Graphics Processing Unit) grafik ve paralel hesaplama içindir: oyunlar, video düzenleme, yapay zekâ ve parola kırma hesapları gibi. Beklenmedik yüksek GPU kullanımı da madencilik gibi istenmeyen bir iş göstergesi olabilir. Linux'ta df ve du, Windows'ta Depolama ayarları disk analizi içindir.",
        ],
      },
      {
        h: "Kaynak izleme araçları",
        p: [
          "Windows Görev Yöneticisi (Ctrl+Shift+Esc): Süreçler sekmesi uygulama bazında CPU/bellek/disk/ağ; Performans sekmesi canlı grafikleri gösterir. Kaynak İzleyici (resmon) ayrıntı sunar. Linux'ta top canlı süreç listesi, htop renkli ve etkileşimli sürümü, free bellek, df disk, uptime yük ortalaması içindir.",
          "İzleme bir alışkanlık olmalıdır: 'normal' davranışı bilirsen anormali fark edersin. Güvenlik ekipleri bu temel çizgiyi (baseline) kullanarak sapmaları (ani CPU/disk/ağ artışı) uyarıya çevirir.",
        ],
        note: { type: "tip", text: "Bir sorun varsa: Hangi kaynak doldu? (CPU/RAM/disk) → Hangi süreç tüketiyor? → Bu süreç meşru mu? → Sonlandır/yapılandır/temizle." },
      },
      {
        h: "Performans ve güvenlik ilişkisi",
        p: [
          "Performans sorunları çoğu zaman güvenlik göstergesidir: aniden yavaşlayan bilgisayar kötü amaçlı yazılım, fidye yazılımı (disk şifreleme sırasında yoğun disk), botnet veya madenci işareti olabilir. Tersine, güvenlik önlemleri de kaynak tüketir: antivirüs taramaları CPU/disk kullanır.",
          "Dengeyi kurmak yöneticilerin işidir: gereksiz servisleri kapatmak hem performansı artırır hem saldırı yüzeyini azaltır. Ayrıca kaynak tüketimini sınırlamak (kota, limit) tek bir sürecin sistemi çökertmesini (hizmet engelleme — DoS) önler.",
        ],
      },
    ],
    concepts: [
      ["CPU kullanımı", "İşlemcinin meşgul kalma yüzdesi."],
      ["RAM / Swap", "Hızlı geçici bellek / diske taşınan taşma alanı."],
      ["Bellek sızıntısı", "Belleğin geri verilmeden sürekli artması."],
      ["Disk doluluğu / I-O", "Boş alan ve okuma-yazma performansı."],
      ["GPU", "Grafik ve paralel hesaplama işlemcisi."],
      ["Baseline (temel çizgi)", "Normal kaynak kullanımı referansı."],
    ],
    everyday: [
      "RAM çalışma masandır, disk dolaptır: masa dolunca sürekli dolaba koşarsın ve iş yavaşlar.",
      "CPU, mutfaktaki aşçıdır; çok sipariş gelince bekleme süresi uzar.",
      "Telefonun aniden ısınıp pilinin hızlı bitmesi, arka planda bir uygulamanın fazla kaynak kullandığının işaretidir.",
    ],
    technical: [
      "top komutunda %CPU sütunu en çok işlemci kullanan süreci gösterir.",
      "free -h çıktısında 'available' sütunu yeni programlar için gerçekten kullanılabilir belleği gösterir.",
      "df -h /var/log doluluğu hızla artıyorsa kontrolsüz büyüyen log dosyası olabilir.",
    ],
    examples: [
      { title: "Linux'ta kaynak sorgulama", code: "$ top\n$ free -h\n$ df -h\n$ uptime", desc: "Dört komut CPU/süreç, RAM, disk ve yük ortalamasını verir." },
      { title: "Windows'ta kaynak sorgulama", code: "PS> Get-Process | Sort-Object CPU -Descending | Select-Object -First 5\nC:\\> tasklist\nC:\\> wmic logicaldisk get size,freespace", desc: "Windows'ta CPU'ya göre sıralama ve disk boş alanı sorgulama." },
    ],
    guide: [
      "Grafikleri en az 10 saniye izleyerek normal (baseline) davranışı gör.",
      "Bir senaryo seç (ör. RAM tüketimi artan uygulama) ve grafiklerdeki değişimi izle.",
      "Süreç tablosunu CPU ve RAM'e göre sırala; sorunlu süreci bul.",
      "Süreci sonlandır veya geçici dosyaları temizleyerek sorunu çöz.",
      "Farklı bir senaryoyu da başlat; ikisini karşılaştır.",
    ],
    after: [
      "Sorunlu süreci bulmak için önce hangi kaynağın doldurulduğunu belirlemek gerekir.",
      "Aynı belirti (yavaşlık) farklı nedenlerden doğabilir: CPU, RAM veya disk.",
      "Düzenli izleme, normali bilerek anormali yakalamayı sağlar.",
    ],
    summary: [
      "CPU, RAM, disk, GPU sınırlı kaynaklardır.",
      "İşletim sistemi kaynakları süreçler arasında paylaştırır.",
      "top/free/df ve Görev Yöneticisi izleme araçlarıdır.",
      "Bellek sızıntısı, yüksek CPU ve dolu disk tipik sorunlardır.",
      "Anormal kaynak kullanımı güvenlik sinyali de olabilir.",
    ],
    quiz: [
      ["RAM dolduğunda işletim sistemi ne yapar?", ["Dosyaları siler", "Veriyi diske taşıyarak (swap) çalışmaya devam eder; sistem yavaşlar", "Bilgisayarı kapatır", "CPU'yu hızlandırır"], 1, "Swap/sayfa dosyası kullanımı diskin yavaş olması nedeniyle performansı düşürür."],
      ["Boşta bir bilgisayarda sürekli %100 CPU kullanımı ne anlama gelebilir?", ["Her zaman normaldir", "Kötü yazılmış bir program veya zararlı yazılım (ör. madenci) olabilir", "Disk boştur", "İnternet hızlıdır"], 1, "Beklenmeyen sürekli yüksek CPU araştırılmalıdır; zararlı yazılım göstergesi olabilir."],
      ["Linux'ta bellek durumunu gösteren komut hangisidir?", ["df -h", "free -h", "ls -l", "whoami"], 1, "free -h RAM ve swap kullanımını gösterir."],
      ["Bellek sızıntısı (memory leak) nedir?", ["Belleğin kendiliğinden silinmesi", "Bir programın belleği geri vermeyip sürekli artırması", "RAM'in hızlanması", "Disk bölümü"], 1, "Sızıntı zamanla tüm belleği tüketir ve sistem yavaşlar."],
      ["Performans ve güvenlik ilişkisi için hangisi doğrudur?", ["İlgisizdirler", "Beklenmedik kaynak artışları güvenlik sorununu işaret edebilir; gereksiz servisleri kapatmak ikisine de yarar", "Güvenlik önlemi hiç kaynak harcamaz", "Yavaşlık yalnızca donanım eskidir"], 1, "Anormal kaynak kullanımı zararlı yazılım göstergesi olabilir; gereksiz servisler hem kaynak hem risk yaratır."],
    ],
  },
];
