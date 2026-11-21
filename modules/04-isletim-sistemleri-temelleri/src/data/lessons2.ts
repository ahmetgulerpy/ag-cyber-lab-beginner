import type { Lesson } from "./types";

export const LESSONS_2: Lesson[] = [
  {
    id: 6,
    title: "Dosya Sistemi ve Dizin Yapısı",
    short: "Windows sürücü harfleri, Linux kök dizini, önemli dizinler, yol türleri ve dosya sistemi biçimleri.",
    minutes: 45,
    goal: "Verilerin diskte nasıl düzenlendiğini; Windows ve Linux dosya sistemlerinin yapısını, mutlak ve göreli yol kavramlarını ve NTFS/FAT32/exFAT biçimlerini öğreneceksin.",
    outcomes: [
      "Dosya sistemi (File System) kavramını açıklayabilirsin.",
      "Windows sürücü harfleri ile Linux kök dizinini karşılaştırabilirsin.",
      "/home, /root, /etc, /var, /tmp, /usr ve /bin dizinlerinin görevini sayabilirsin.",
      "Mutlak ve göreli yolları doğru yazabilirsin.",
      "NTFS, FAT32 ve exFAT arasındaki farkı açıklayabilirsin.",
    ],
    sections: [
      {
        h: "Dosya sistemi nedir?",
        p: [
          "Disk, ham haliyle yalnızca numaralandırılmış bloklardan oluşan büyük bir depodur. Dosya sistemi (File System), bu bloklar üzerinde verilerin adlandırılmış dosyalar ve klasörler halinde düzenlenmesini, nerede durduklarının kaydedilmesini ve izinlerinin tutulmasını sağlayan yapıdır. Kütüphanedeki katalog sistemi gibidir: kitapların yerini bilmek için katalog gerekir.",
          "Dosya (file) veri taşıyan adlandırılmış kayıttır; klasör (directory/folder) ise dosyaları ve diğer klasörleri gruplayan kaptır. Klasörlerin iç içe geçmesiyle ağaç yapısı oluşur. Her dosyanın adı, boyutu, zaman damgaları ve sahiplik/izin bilgisi (üst veri — metadata) vardır.",
        ],
      },
      {
        h: "Windows dosya sistemi ve sürücü harfleri",
        p: [
          "Windows'ta her depolama birimi bir sürücü harfi alır: C: genellikle işletim sisteminin kurulu olduğu disk, D: ikinci disk veya bölüm, E: USB bellek olabilir. Yollar ters eğik çizgi ile yazılır: C:\\Users\\Ogrenci\\Documents\\rapor.txt. Windows yol adlarında büyük/küçük harf farkını genellikle yok sayar (Rapor.txt ile rapor.txt aynıdır).",
          "Önemli klasörler: C:\\Windows (işletim sistemi dosyaları), C:\\Program Files (kurulu programlar), C:\\Users (kullanıcı profilleri). Kullanıcı verileri Belgeler, İndirilenler, Masaüstü gibi alt klasörlerdedir.",
        ],
      },
      {
        h: "Linux dosya sistemi ve kök dizin (/)",
        p: [
          "Linux'ta sürücü harfi yoktur. Her şey tek bir kök dizin (root directory — '/') altında toplanır; diğer diskler 'bağlama (mount)' ile bu ağacın bir dalına eklenir (ör. USB belleğin /media/ag/USB altında görünmesi). Yollar düz eğik çizgi ile yazılır ve büyük/küçük harfe duyarlıdır: Rapor.txt ile rapor.txt farklı dosyalardır.",
          "Linux'ta 'her şey bir dosyadır' ilkesi geçerlidir: cihazlar (/dev/sda), süreç bilgileri (/proc) ve yapılandırmalar bile dosya olarak sunulur. Bu birleşik yaklaşım, aynı araçlarla (cat, grep, ls) çok farklı şeylerin incelenmesini mümkün kılar.",
        ],
        note: { type: "warn", text: "Linux'ta 'Root kullanıcısı' ile 'kök dizin (/)' karıştırılmamalıdır. Birincisi yönetici hesabı, ikincisi dosya ağacının tepesidir. Root'un ev dizini ise /root'tur." },
      },
      {
        h: "Önemli Linux dizinleri",
        p: [
          "Linux dizin yapısı Dosya Sistemi Hiyerarşi Standardı'na (FHS) göre düzenlenir. Her dizinin kendine özgü bir görevi vardır ve bu bilgi hem sistem yönetimi hem de güvenlik incelemelerinde yol göstericidir: örneğin saldırı kanıtları /var/log altında, yapılandırma hataları /etc altında aranır.",
        ],
        list: [
          "/home — Kullanıcıların kişisel dosyaları (/home/ag).",
          "/root — Yönetici (root) kullanıcısının ev dizini; normal kullanıcılar giremez.",
          "/etc — Sistem ve hizmet yapılandırma dosyaları (passwd, hosts, ssh yapılandırması).",
          "/var — Değişen veriler: günlükler (/var/log), web siteleri (/var/www), önbellekler.",
          "/tmp — Geçici dosyalar; yeniden başlatmada silinebilir, herkes yazabilir.",
          "/usr — Kullanıcı programları, kitaplıklar ve paylaşılan veriler.",
          "/bin — Sistemin temel komutları (ls, cp, bash).",
        ],
      },
      {
        h: "Mutlak ve göreli yol",
        p: [
          "Mutlak yol (Absolute Path) kökten (veya sürücü harfinden) başlayan tam adrestir: /home/ag/Documents/rapor.txt veya C:\\Users\\Ogrenci\\rapor.txt. Bulunduğun yerden bağımsızdır; her zaman aynı dosyayı gösterir. Göreli yol (Relative Path) ise bulunduğun dizine göre yazılır: Documents/rapor.txt.",
          "Özel simgeler: '.' bulunduğun dizin, '..' bir üst dizin, '~' (Linux) ev dizinidir. /home/ag dizinindeyken /etc/passwd dosyasına göreli yolu ../../etc/passwd olur: iki üst dizine çık, sonra etc içine gir. Laboratuvardaki hesaplayıcı bunu otomatik gösterir.",
        ],
      },
      {
        h: "NTFS, FAT32, exFAT ve dosya uzantıları",
        p: [
          "NTFS (New Technology File System) Windows'un modern dosya sistemidir; izinler, şifreleme, sıkıştırma, günlükleme ve büyük dosya desteği sunar. FAT32 eskidir, çok uyumludur ama tek dosya en fazla 4 GB olabilir ve izin desteği yoktur. exFAT, FAT32'nin 4 GB sınırını kaldıran, USB bellek ve SD kartlar için uygun, platformlar arası bir biçimdir; o da izin sunmaz. Linux genellikle ext4 kullanır.",
          "Dosya uzantısı (.txt, .jpg, .exe, .sh) dosyanın türünü belirten ad sonekidir. Windows uzantıya göre hangi programın açacağını seçer; Linux ise uzantıya daha az bağımlıdır, çalıştırma izni (x) önemlidir. Uzantı sahte olabilir; gerçek türü içeriği belirler.",
        ],
      },
    ],
    concepts: [
      ["Dosya sistemi (File System)", "Verileri diskte dosya/klasör olarak düzenleyen yapı."],
      ["Kök dizin (/)", "Linux dosya ağacının en üstü."],
      ["Mutlak yol", "Kökten başlayan tam adres."],
      ["Göreli yol", "Bulunulan dizine göre yazılan adres."],
      ["Mount (bağlama)", "Bir diski/bölümü dizin ağacına ekleme."],
      ["NTFS / FAT32 / exFAT", "Windows'ta kullanılan dosya sistemi biçimleri."],
    ],
    everyday: [
      "Mutlak yol 'Türkiye, Ankara, Çankaya, X Sokağı, No:5' gibi tam adrestir; göreli yol 'karşıdaki apartman' gibi bulunduğun yere göre tariftir.",
      "Sürücü harfleri ayrı binalar gibidir (C: bina, D: bina); Linux'ta tek bir site vardır ve her bina sitenin bir bloğudur.",
      "USB belleği bilgisayara takınca Windows'ta E: harfi, Linux'ta /media altında bir klasör oluşur.",
    ],
    technical: [
      "FAT32 biçimli 8 GB'lık bir video dosyası kopyalanamaz; exFAT veya NTFS gerekir.",
      "/var/log/auth.log dosyası Linux'ta giriş denemelerini kaydeder; güvenlik incelemesinin ilk durağıdır.",
      "/etc/passwd dosyası kullanıcı hesaplarını listeler (parolaları değil).",
    ],
    examples: [
      { title: "Linux'ta yollar", code: "$ pwd\n/home/ag\n$ cd Documents          # göreli yol\n$ cd /etc               # mutlak yol\n$ cd ../..              # iki üst dizin", desc: "cd komutu çalışma dizinini değiştirir." },
      { title: "Windows'ta yollar", code: "C:\\Users\\Ogrenci> cd Documents\nC:\\Users\\Ogrenci\\Documents> cd C:\\Lab\nC:\\Lab> cd ..", desc: "Windows'ta farklı sürücüye geçmek için 'D:' yazılır veya cd /d D:\\ kullanılır." },
    ],
    guide: [
      "Linux sekmesinde klasörlere tıkla; en az 5 dizinin açıklamasını oku (/etc, /var, /home, /tmp, /usr).",
      "Üstteki yol çubuğuna bak: seçili öğenin mutlak yolu orada yazar.",
      "Windows sekmesinde C: ve D: sürücülerini gez.",
      "Göreli yol hesaplayıcıda bir başlangıç klasörü ve hedef seçerek '../..' mantığını gör.",
      "Karşılaştırma sekmesindeki tabloyu incele.",
    ],
    after: [
      "Mutlak yol her yerden aynı çalışır; göreli yol bulunduğun yere bağlıdır.",
      "Linux'ta dizinlerin amacı bellidir; bu, kanıt ve yapılandırma aramayı kolaylaştırır.",
      "Dosya sistemi türü, izin ve boyut sınırlarını belirler.",
    ],
    summary: [
      "Dosya sistemi diskteki verileri düzenleyen yapıdır.",
      "Windows sürücü harfleri, Linux tek kök dizin kullanır.",
      "/etc yapılandırma, /var/log kayıtlar, /home kullanıcı dosyalarıdır.",
      "Mutlak yol kökten, göreli yol bulunulan yerden başlar.",
      "NTFS izin destekler; FAT32 4 GB sınırlıdır; exFAT taşınabilir ortamlar içindir.",
    ],
    quiz: [
      ["Linux'ta yapılandırma dosyaları genellikle hangi dizindedir?", ["/tmp", "/etc", "/home", "/bin"], 1, "/etc sistem ve hizmet yapılandırma dosyalarını barındırır."],
      ["Aşağıdakilerden hangisi mutlak yoldur?", ["Documents/rapor.txt", "../rapor.txt", "/home/ag/rapor.txt", "./rapor.txt"], 2, "Mutlak yol kök dizinden (/) başlar."],
      ["FAT32 dosya sisteminin bilinen sınırı nedir?", ["Tek dosya en fazla 4 GB olabilir", "Hiç dosya saklayamaz", "Yalnızca Linux'ta çalışır", "Sürücü harfi alamaz"], 0, "FAT32'de tek dosya boyutu 4 GB ile sınırlıdır; exFAT bu sınırı kaldırır."],
      ["Linux'ta günlük (log) kayıtları genellikle nerede tutulur?", ["/var/log", "/usr/bin", "/root/bin", "/dev/null"], 0, "/var/log sistem ve hizmet kayıtlarını içerir."],
      ["Linux'ta '/' ifadesi ne anlama gelir?", ["Root kullanıcısı", "Kök dizin (dosya ağacının tepesi)", "Geri dönüşüm kutusu", "Ev dizini"], 1, "'/' kök dizindir; root kullanıcısıyla (yönetici hesabı) karıştırılmamalıdır."],
    ],
  },
  {
    id: 7,
    title: "Kullanıcı ve Yetki Yönetimi",
    short: "Hesaplar, gruplar, root/sudo, UAC, kimlik doğrulama–yetkilendirme farkı ve en az yetki ilkesi.",
    minutes: 45,
    goal: "Kullanıcı hesaplarını, grupları ve yetki türlerini anlayacak; en az yetki ilkesinin neden güvenliğin temeli olduğunu uygulamalı olarak göreceksin.",
    outcomes: [
      "Yönetici, standart ve root hesaplarını ayırt edebilirsin.",
      "Grupların yetki yönetimini nasıl kolaylaştırdığını açıklayabilirsin.",
      "UAC ve sudo'nun amacını anlatabilirsin.",
      "Kimlik doğrulama ve yetkilendirme farkını örneklerle açıklayabilirsin.",
      "En az yetki ilkesini bir senaryoda uygulayabilirsin.",
    ],
    sections: [
      {
        h: "Kullanıcı hesabı nedir?",
        p: [
          "Kullanıcı hesabı (User Account), bir kişiyi veya bir hizmeti işletim sistemi içinde temsil eden kimliktir. Her hesabın bir adı, benzersiz kimlik numarası (Linux'ta UID, Windows'ta SID), parolası/kimlik bilgisi ve ev dizini vardır. İşletim sistemi 'kim ne yapabilir' sorusunu hep hesap kimliği üzerinden yanıtlar.",
          "Hesaplar sadece insanlar için değildir: web sunucusu 'www-data', veritabanı 'postgres' gibi servis hesapları altında çalışır. Servislerin ayrı ve kısıtlı hesaplarla çalışması, bir servis ele geçirilse bile saldırganın erişimini sınırlar.",
        ],
      },
      {
        h: "Yönetici, standart kullanıcı ve root",
        p: [
          "Windows'ta Yönetici (Administrator) hesabı sistem ayarlarını değiştirebilir, program kurabilir ve diğer kullanıcıları yönetebilir. Standart kullanıcı ise yalnızca kendi dosyaları ve uygulamaları üzerinde çalışır. Linux'ta en yetkili hesap root'tur (UID 0): tüm izin denetimlerini aşar, her dosyayı okuyup silebilir.",
          "Günlük işleri yönetici/root ile yapmak tehlikelidir: kötü amaçlı bir program tam yetkiyle çalışır ve tüm sistemi etkiler. Bu yüzden önerilen yaklaşım, günlük kullanımda standart hesap, gerektiğinde geçici yetki yükseltmedir (UAC veya sudo).",
        ],
        note: { type: "danger", text: "Root ile çalışırken yapılan bir yazım hatası (ör. rm -rf yanlış yolda) geri dönüşsüz zarar verir. Root oturumunu yalnızca gerektiği kadar açık tut." },
      },
      {
        h: "Gruplar ve yetkiler",
        p: [
          "Grup (Group), benzer yetkiye ihtiyaç duyan kullanıcıları toplayan kaptır. Yetkiyi tek tek kişilere değil gruba vermek yönetimi kolaylaştırır: 'finans' grubuna maaş dosyasına erişim verirsin; yeni çalışan gruba eklenince erişimi otomatik kazanır, ayrılan gruptan çıkarılınca kaybeder.",
          "Linux'ta her dosyanın bir sahibi ve bir grubu vardır; 'sudo' grubu üyeleri sudo komutunu kullanabilir. Windows'ta 'Administrators', 'Users', 'Guests' gibi yerleşik gruplar bulunur. Ders 13'te dosya izinleri bu gruplarla birlikte ayrıntılı işlenecek.",
        ],
      },
      {
        h: "UAC ve sudo",
        p: [
          "UAC (User Account Control — Kullanıcı Hesabı Denetimi), Windows'ta yönetici yetkisi gerektiren bir işlem yapılmak istendiğinde ekranı karartıp onay isteyen mekanizmadır. Yönetici hesabıyla bile uygulamalar varsayılan olarak standart yetkiyle çalışır; yükseltme için onay gerekir. Bu, sessiz kurulumları ve izinsiz değişiklikleri zorlaştırır.",
          "sudo (superuser do), Linux'ta yetkili kullanıcıların tek bir komutu geçici olarak root yetkisiyle çalıştırmasını sağlar. Parola istenir, işlem /var/log/auth.log gibi kayıtlara yazılır. Kimin hangi komutu yetkili çalıştırdığı izlenebilir olduğu için doğrudan root oturumundan daha güvenlidir.",
        ],
      },
      {
        h: "Kimlik doğrulama ve yetkilendirme",
        p: [
          "Kimlik doğrulama (Authentication) 'Sen kimsin?' sorusuna yanıttır: parola, parmak izi, güvenlik anahtarı gibi kanıtlarla kimlik doğrulanır. Yetkilendirme (Authorization) ise 'Kimliği doğrulanan kişi ne yapabilir?' sorusudur: hangi dosyayı okuyabilir, hangi servisi durdurabilir.",
          "Örnek: Otel girişinde kimlik gösterip kayıt yaptırman kimlik doğrulamadır; verilen anahtar kartının yalnızca senin odanı açması yetkilendirmedir. Kimlik doğrulama doğru olsa bile yetkilendirme gevşekse güvenlik zayıflar.",
        ],
      },
      {
        h: "En az yetki ilkesi (Least Privilege Principle)",
        p: [
          "En az yetki ilkesi: her kullanıcı, program ve servis yalnızca işini yapmak için gereken minimum yetkiye sahip olmalıdır. Muhasebeci sunucuyu yeniden başlatamaz, web sunucusu /etc/shadow'u okuyamaz. Böylece bir hesap ele geçirilse ya da kullanıcı hata yapsa bile hasar sınırlı kalır.",
          "Laboratuvarda aynı kötü amaçlı eki önce yönetici, sonra standart hesapla açarak farkı göreceksin. Bu ilke, siber güvenlikte en çok tekrarlanan prensiplerden biridir ve Sıfır Güven (Zero Trust) gibi modern yaklaşımların temelidir.",
        ],
        note: { type: "tip", text: "Kural: 'Yetkiyi ihtiyaç duyulduğu kadar ver, ihtiyaç bitince geri al.'" },
      },
    ],
    concepts: [
      ["Kullanıcı hesabı", "Kişiyi veya servisi temsil eden kimlik."],
      ["Administrator / root", "Tam yetkili hesaplar."],
      ["Grup", "Yetkileri toplu yönetmek için kullanıcı kümesi."],
      ["UAC", "Windows'ta yetki yükseltme onayı."],
      ["sudo", "Linux'ta geçici yetki yükseltme komutu."],
      ["Authentication / Authorization", "Kimlik doğrulama / yetkilendirme."],
    ],
    everyday: [
      "Apartmanda yönetici tüm daireleri açabilir; sakin yalnızca kendi dairesini. Bu root ve standart kullanıcı farkıdır.",
      "Şirkette kart sistemi: kartın seni tanıması doğrulama, hangi kapıları açtığı yetkilendirmedir.",
      "Çocuk hesabının ebeveyn onayı olmadan uygulama kuramaması en az yetki ilkesine örnektir.",
    ],
    technical: [
      "id komutu bir Linux kullanıcısının UID ve gruplarını gösterir.",
      "sudo cat /etc/shadow komutu yalnızca sudo grubu üyelerinde çalışır ve kayda geçer.",
      "Windows'ta 'Yönetici olarak çalıştır' UAC onayı tetikler.",
    ],
    examples: [
      { title: "Linux'ta yetki kontrolü", code: "$ id\nuid=1000(ag) gid=1000(ag) groups=1000(ag),4(adm),27(sudo),1001(dev)\n$ cat /etc/shadow\ncat: /etc/shadow: Permission denied\n$ sudo cat /etc/shadow\n[sudo] ag için parola: ...", desc: "Standart kullanıcı shadow dosyasını okuyamaz; sudo ile geçici yetki alınır." },
      { title: "Windows'ta kullanıcı bilgisi", code: "C:\\> whoami\nag-lab-pc\\ogrenci", desc: "whoami komutu aktif kullanıcıyı gösterir." },
    ],
    guide: [
      "Laboratuvarda yeni bir sanal kullanıcı oluştur (ad ve tür seç).",
      "Kullanıcıyı bir gruba (ör. finans) ekle.",
      "Aktif kullanıcıyı değiştir ve bir dosyaya Okuma/Yazma/Çalıştırma erişimi dene.",
      "Reddedilen bir erişimi, doğru gruba ekleyerek veya sudo kullanarak çöz.",
      "En az yetki senaryosunu hem yönetici hem standart hesapla çalıştır, farkı karşılaştır.",
    ],
    after: [
      "Erişim reddedildiğinde nedeni her zaman sahip/grup/diğer sınıflarıdır; çözüm yetkiyi genişletmek değil, doğru yetkiyi vermektir.",
      "sudo ve UAC yetkiyi geçici ve izlenebilir kılar.",
      "Yönetici hesabıyla çalışan zararlı kod sistemi bozarken, standart hesapta hasar ev dizinine sınırlı kalır.",
    ],
    summary: [
      "Hesaplar kim olduğunu, gruplar yetki toplulukları, root/admin en yüksek yetkiyi temsil eder.",
      "UAC ve sudo yetki yükseltmeyi kontrollü hale getirir.",
      "Kimlik doğrulama 'kim?', yetkilendirme 'ne yapabilir?' sorusudur.",
      "En az yetki ilkesi hasarı sınırlar.",
      "Günlük işler standart hesapla yapılmalıdır.",
    ],
    quiz: [
      ["Linux'ta en yüksek yetkili hesap hangisidir?", ["guest", "root", "www-data", "ag"], 1, "root (UID 0) tüm izin denetimlerini aşar."],
      ["Kimlik doğrulama (authentication) neyi sorgular?", ["Kullanıcının ne yapabileceğini", "Kullanıcının kim olduğunu", "Dosyanın boyutunu", "Ağ hızını"], 1, "Authentication kimlik kanıtıdır; ne yapılabileceği yetkilendirmedir."],
      ["En az yetki ilkesine en uygun davranış hangisidir?", ["Herkese yönetici yetkisi vermek", "Günlük işi standart hesapla yapıp gerektiğinde yetki yükseltmek", "Parolayı herkesle paylaşmak", "Güvenlik duvarını kapatmak"], 1, "Minimum gerekli yetki hasarı sınırlar."],
      ["UAC hangi işletim sistemine aittir ve ne yapar?", ["Linux; dosya kopyalar", "Windows; yetki gerektiren işlemlerde onay ister", "macOS; disk temizler", "Android; uygulama indirir"], 1, "UAC Windows'a özgüdür ve yetki yükseltmede onay penceresi gösterir."],
      ["Grupların sağladığı en büyük kolaylık nedir?", ["Dosyaları sıkıştırmak", "Yetkileri tek tek kişilere değil topluca yönetmek", "Parolaları unutturmak", "Disk boyutunu artırmak"], 1, "Yetki gruba verilir; üyelik değişince erişim otomatik değişir."],
    ],
  },
  {
    id: 8,
    title: "Process ve Service Kavramları",
    short: "Süreç, iş parçacığı, PID, süreç durumları, servisler ve izleme araçları.",
    minutes: 45,
    goal: "Çalışan programların işletim sistemi içinde süreç (process) olarak nasıl yönetildiğini, servislerin arka planda nasıl çalıştığını ve süreç durumlarını öğrenecek, sanal bir ortamda bunları yöneteceksin.",
    outcomes: [
      "Program ve süreç farkını açıklayabilirsin.",
      "PID, thread ve süreç durumlarını (Running, Ready, Waiting, Terminated) tanımlayabilirsin.",
      "Servis (hizmet) kavramını ve Windows/Linux servis yönetimini anlatabilirsin.",
      "Görev Yöneticisi ve top gibi izleme araçlarını yorumlayabilirsin.",
    ],
    sections: [
      {
        h: "Process (Süreç) nedir?",
        p: [
          "Program, diskte duran pasif bir dosyadır (ör. chrome.exe). Süreç (Process) ise o programın belleğe yüklenip çalıştırılan canlı örneğidir. Aynı programdan birden fazla süreç olabilir: üç Chrome penceresi, üç ayrı süreç demektir. Bir tarif (program) ile o tarifle pişirilen yemek (süreç) arasındaki fark gibidir.",
          "Her sürecin kendi belleği, açık dosyaları, çalıştığı kullanıcı kimliği ve süreç kimliği (PID) vardır. Bir süreç diğerinin belleğine doğrudan erişemez; bu yalıtım hem kararlılık hem güvenlik sağlar.",
        ],
      },
      {
        h: "Thread, PID ve üst süreç",
        p: [
          "Thread (iş parçacığı), bir sürecin içindeki hafif yürütme birimidir. Bir süreç birden fazla thread ile aynı anda birden çok iş yapabilir: örneğin tarayıcı bir thread'de sayfayı çizerken başkasında ağdan veri indirir. Thread'ler aynı süreç belleğini paylaşır, bu yüzden daha hafiftir ama dikkatli yönetilmelidir.",
          "PID (Process ID), her sürece verilen benzersiz numaradır. Bir süreci izlemek veya sonlandırmak için PID kullanılır. Her süreç bir üst süreç (parent) tarafından başlatılır; PPID üst sürecin kimliğidir. Linux'ta PID 1 başlangıç sürecidir (systemd), Windows'ta System sürecinin PID'si 4'tür.",
        ],
      },
      {
        h: "Süreç durumları (Process State)",
        p: [
          "Bir süreç yaşamı boyunca farklı durumlardan geçer. Running (Çalışıyor): CPU'da yürütülüyor. Ready (Hazır): çalışmaya hazır, sırada CPU bekliyor. Waiting/Blocked (Bekliyor): disk okuması, ağ yanıtı gibi bir olayı bekliyor. Terminated (Sonlandı): çalışması bitti veya sonlandırıldı.",
          "Zamanlayıcı (scheduler), Ready kuyruğundan bir süreci seçip Running yapar; zaman dilimi (time slice) dolunca süreç tekrar Ready'ye döner. Beklediği olay gerçekleşince Waiting'den Ready'ye geçer (doğrudan Running'e geçmez). Laboratuvarda bu geçişleri deneyecek ve geçersiz geçişlerde nedenini görecek.",
        ],
        list: ["Ready → Running: zamanlayıcı seçti", "Running → Ready: zaman dilimi doldu", "Running → Waiting: giriş/çıkış bekliyor", "Waiting → Ready: beklenen olay oldu", "Herhangi → Terminated: bitti veya sonlandırıldı"],
      },
      {
        h: "Service (Hizmet) nedir?",
        p: [
          "Servis (Service; Linux'ta daemon da denir), kullanıcı oturumundan bağımsız, arka planda çalışan ve genellikle sistem açılışında başlayan süreçtir. Web sunucusu, SSH sunucusu, yazdırma kuyruğu, güvenlik duvarı ve güncelleme hizmeti birer servistir. Kullanıcı giriş yapmasa bile çalışmaya devam ederler.",
          "Windows'ta servisler 'services.msc' veya Görev Yöneticisi > Hizmetler'den yönetilir (Çalışıyor/Durduruldu, Başlangıç türü: Otomatik, Elle, Devre dışı). Linux'ta systemd kullanılır: systemctl status ssh, systemctl start nginx, systemctl enable ssh gibi komutlar vardır.",
        ],
      },
      {
        h: "Arka plan süreçleri ve güvenlik",
        p: [
          "Sistem açılışında çalışan servisler hem işlevsellik hem saldırı yüzeyi demektir. Gereksiz servis; fazladan bellek tüketir ve fazladan açık kapı oluşturur. Bu yüzden 'ihtiyaç yoksa kapat' ilkesi uygulanır (sıkılaştırma — hardening).",
          "Görev Yöneticisi (Windows), top/htop/ps (Linux) gibi araçlar sürekli izleme sağlar. Beklenmedik yüksek CPU kullanan, tanımadığın bir isimle çalışan veya garip bir konumdan çalışan süreç, zararlı yazılım göstergesi olabilir. Güvenlik analistleri süreç ağaçlarını bu yüzden inceler.",
        ],
        note: { type: "info", text: "Bu dersteki tüm süreçler ve servisler sanaldır; gerçek sisteminde hiçbir süreç sonlandırılmaz veya değiştirilmez." },
      },
    ],
    concepts: [
      ["Process (Süreç)", "Çalışan programın canlı örneği."],
      ["Thread", "Süreç içindeki hafif yürütme birimi."],
      ["PID / PPID", "Süreç kimliği / üst süreç kimliği."],
      ["Süreç durumu", "Running, Ready, Waiting, Terminated."],
      ["Scheduler (Zamanlayıcı)", "CPU zamanını süreçlere paylaştıran bileşen."],
      ["Service / Daemon", "Arka planda çalışan hizmet süreci."],
    ],
    everyday: [
      "Mutfakta tarif (program) ve pişen yemek (süreç): aynı tariften birden çok yemek yapılabilir.",
      "Restoranda şef (CPU) sipariş sırasıyla ilgilenir; hamurun mayalanmasını bekleyen sipariş 'Waiting' durumundadır.",
      "Apartmandaki kapıcı, jeneratör ve güvenlik kamerası: sen evde olmasan da çalışan servislerdir.",
    ],
    technical: [
      "ps aux Linux'ta tüm süreçleri listeler; kill <PID> sonlandırma sinyali yollar.",
      "systemctl status ssh bir servisin çalışıp çalışmadığını gösterir.",
      "tasklist Windows'ta çalışan süreçleri PID ile listeler.",
    ],
    examples: [
      { title: "Linux süreç listesi (SİMÜLASYON)", code: "$ ps aux\nUSER   PID %CPU %MEM COMMAND\nroot     1  0.0  0.3 /sbin/init\nwww-data 735 0.0 0.6 nginx: worker process\nag    1190  0.4  1.8 gnome-shell", desc: "PID 1 her şeyin atası olan init/systemd sürecidir." },
      { title: "Windows servisleri", code: "PS> Get-Service | Where-Object Status -eq Running\nStatus  Name     DisplayName\nRunning Dhcp     DHCP Client\nRunning Dnscache DNS Client", desc: "PowerShell ile çalışan servisler filtrelenir (Ders 10)." },
    ],
    guide: [
      "Laboratuvarda Windows veya Linux görünümünü seç.",
      "Bir sürece tıkla; PID, üst süreç, CPU/RAM ve ilişkili servisi incele.",
      "Durum düğmeleriyle geçerli bir geçiş yap (ör. Ready → Running), ardından geçersiz bir geçiş dene.",
      "Servis tablosundan bir servisi durdur; ilişkili sürecin ne olduğunu gözlemle.",
      "Servisi yeniden başlat ve 'Yeni süreç başlat' ile yeni bir sanal süreç oluştur.",
    ],
    after: [
      "Servis durunca ona bağlı süreçler de sonlanır; yeniden başlatınca yeni PID alırlar.",
      "Durum geçişleri zamanlayıcı mantığını gösterir: Waiting doğrudan Running olmaz.",
      "Süreç izleme güvenlik analizinin temel adımıdır.",
    ],
    summary: [
      "Program pasif dosya, süreç çalışan örneğidir.",
      "Thread süreç içindeki yürütme birimidir; PID süreci tanımlar.",
      "Süreç durumları: Running, Ready, Waiting, Terminated.",
      "Servisler arka planda, genellikle açılışta başlar.",
      "Gereksiz ve bilinmeyen süreç/servisler güvenlik riskidir.",
    ],
    quiz: [
      ["Program ile süreç arasındaki fark nedir?", ["Fark yoktur", "Program diskte duran dosyadır; süreç onun çalışan örneğidir", "Süreç yalnızca Linux'ta bulunur", "Program yalnızca RAM'de bulunur"], 1, "Program pasif dosyadır; belleğe yüklenip çalıştırıldığında süreç olur."],
      ["PID neyi ifade eder?", ["Programın dosya boyutu", "Her sürece verilen benzersiz kimlik numarası", "İnternet adresi", "Ekran çözünürlüğü"], 1, "PID, süreci tanımlayan benzersiz numaradır."],
      ["Beklediği olay (ör. disk okuması) tamamlanan bir süreç hangi duruma geçer?", ["Terminated", "Running (doğrudan)", "Ready", "Zombie değil, doğrudan silinir"], 2, "Waiting'den önce Ready'ye geçer; Running'e zamanlayıcı seçer."],
      ["Servis (service) nedir?", ["Kullanıcı arayüzü olan oyun", "Arka planda, çoğunlukla sistem açılışında çalışan hizmet süreci", "Silinen dosya", "Bir dosya uzantısı"], 1, "Servisler kullanıcı oturumundan bağımsız arka planda çalışır."],
      ["Gereksiz servislerin kapatılması neden önerilir?", ["Ekran parlaklığı artar", "Kaynak tüketimini ve saldırı yüzeyini azaltır", "Dosyalar silinir", "Parola sıfırlanır"], 1, "Çalışan her servis kaynak tüketir ve potansiyel açık kapıdır."],
    ],
  },
  {
    id: 9,
    title: "Terminal ve Komut Satırı",
    short: "Terminal, kabuk, komut-parametre mantığı, çalışma dizini ve güvenli kullanım alışkanlıkları.",
    minutes: 40,
    goal: "Terminalin ve komut satırının (CLI) ne olduğunu, bir komutun nasıl yazıldığını ve nasıl yorumlandığını öğrenecek; güvenli sanal bir terminalde ilk komutlarını çalıştıracaksın.",
    outcomes: [
      "Terminal, kabuk (shell) ve komut satırı arasındaki farkı açıklayabilirsin.",
      "Bir komutu komut + seçenek + argüman olarak ayrıştırabilirsin.",
      "Çalışma dizinini bulup değiştirebilirsin.",
      "Hata mesajlarını okuyup nedenini anlayabilirsin.",
      "Terminal güvenliği kurallarını sayabilirsin.",
    ],
    sections: [
      {
        h: "Terminal, komut satırı ve kabuk",
        p: [
          "Terminal, klavyeyle komut yazıp çıktıyı metin olarak gördüğün penceredir. Komut satırı arayüzü (CLI — Command Line Interface) bu etkileşim biçiminin adıdır. Terminalin içinde çalışıp yazdığın komutu yorumlayan ve işletim sistemine ileten programa kabuk (shell) denir: Linux'ta bash, zsh; Windows'ta cmd.exe ve PowerShell.",
          "Üç kavramı şöyle ayır: Terminal = pencere, Kabuk = yorumlayıcı program, Komut = yazdığın talimat. Kabuk, komutu alır, ilgili programı bulur, çalıştırır ve çıktısını terminale yazar.",
        ],
      },
      {
        h: "Grafik arayüz ve komut satırı farkı",
        p: [
          "Grafik arayüz görsel ve keşfedilebilirdir ama her işlem için birkaç tıklama gerekir ve otomasyon zordur. Komut satırı ilk başta soğuk görünse de hızlıdır, tekrar edilebilir (betik yazılabilir), uzaktan yönetime elverişlidir ve çok az kaynak harcar. Binlerce dosyayı yeniden adlandırmak GUI'de saatler, komut satırında tek satırdır.",
          "Sunucuların çoğunda grafik arayüz hiç kurulu değildir; bu yüzden sistem yöneticisi ve güvenlik uzmanı için komut satırı zorunlu beceridir. İkisi rakip değil, tamamlayıcıdır.",
        ],
      },
      {
        h: "Komut ve parametre mantığı",
        p: [
          "Bir komut genellikle üç parçadan oluşur: komut adı, seçenekler (options/flags; genelde - ile başlar) ve argümanlar (üzerinde işlem yapılacak hedefler). Örnek: 'ls -l /etc' → ls komut, -l seçenek (uzun liste), /etc argüman (hedef dizin). Boşluklar parçaları ayırır; boşluk içeren adlar tırnak içine alınmalıdır.",
          "Seçenekler birleştirilebilir (ls -la). Çoğu komutun yardımı vardır: 'man ls' (Linux) veya 'komut /?' (Windows). Komut çıktıları standart çıktıya (stdout) yazılır; hatalar ise ayrı akış olan standart hataya (stderr) gider. > ile çıktı dosyaya yönlendirilir, | (boru) ile bir komutun çıktısı diğerine girdi olur.",
        ],
        list: ["komut: ne yapılacak", "seçenek: nasıl yapılacak (-l, -a, /s)", "argüman: neyin üzerinde (dosya, klasör, adres)", "> : çıktıyı dosyaya yaz   |  : çıktıyı sonraki komuta ver"],
      },
      {
        h: "Çalışma dizini ve komut geçmişi",
        p: [
          "Geçerli çalışma dizini (current working directory), komutların göreli yolları çözerken başlangıç aldığı konumdur. pwd (Linux) veya cd (Windows, argümansız) bunu gösterir; terminalin istem satırı (prompt) da genellikle konumu yazar: ag@ag-lab:~/Documents$ ifadesi, ag kullanıcısının Documents dizininde olduğunu belirtir.",
          "Komut geçmişi (history), yazdığın komutları saklar; yukarı ok tuşu önceki komutu getirir, 'history' tümünü listeler. Geçmiş çok işine yarar ama dikkat: komut satırına parola yazarsan geçmişte kalır.",
        ],
      },
      {
        h: "Terminal kullanırken dikkat edilmesi gerekenler",
        p: [
          "Terminalde 'Geri Al' ve onay penceresi yoktur: silinen dosya gider. Bu nedenle yıkıcı komutları (rm, del, format) çalıştırmadan önce hedefi kontrol et. İnternetten kopyaladığın komutu anlamadan çalıştırma; özellikle 'curl ... | sudo bash' gibi satırlar sisteme rastgele kod yükleyebilir.",
          "Güvenli alışkanlıklar: önce ls ile bak sonra sil, komutu sudo ile çalıştırmadan önce ne yaptığını oku, parolaları komut satırında yazma, sanal makine veya test ortamında dene, bilmediğin komutta man/--help kullan.",
        ],
        note: { type: "danger", text: "Bu laboratuvardaki terminal gerçek sisteminle konuşmaz; yalnızca önceden tanımlı sanal bir dosya sistemi üzerinde çalışır. Gerçek terminalde aynı komutların sonuçları kalıcıdır." },
      },
    ],
    concepts: [
      ["Terminal", "Komut yazılan ve çıktının görüldüğü pencere."],
      ["Kabuk (Shell)", "Komutları yorumlayan program: bash, zsh, cmd, PowerShell."],
      ["Argüman / Seçenek", "Komutun hedefi / davranışını değiştiren bayrak."],
      ["Çalışma dizini", "Komutların göreli yol başlangıcı olan konum."],
      ["stdout / stderr", "Normal çıktı akışı / hata akışı."],
      ["Boru (|) ve yönlendirme (>)", "Çıktıyı başka komuta veya dosyaya aktarma."],
    ],
    everyday: [
      "Restoranda menüden seçmek GUI, garsona 'iki çorba, bir salata' diye net sipariş vermek komut satırıdır.",
      "Kabuk, tercüman gibidir: sen komutu söylersin, o işletim sistemine anlayacağı dilde iletir.",
      "Komut geçmişi, telefonun arama geçmişi gibidir: eski numarayı yeniden bulmanı sağlar.",
    ],
    technical: [
      "ls -l /etc komutunda ls komut, -l seçenek, /etc argümandır.",
      "echo merhaba > not.txt çıktıyı not.txt dosyasına yazar (dosyayı ezer).",
      "ls | grep txt komutu ls çıktısından 'txt' içeren satırları süzer.",
    ],
    examples: [
      { title: "İlk komutlar", code: "$ pwd\n/home/ag\n$ ls\nDesktop  Documents  Downloads  lab\n$ cd Documents\n$ pwd\n/home/ag/Documents", desc: "pwd konumu, ls içeriği, cd konum değişimini gösterir." },
      { title: "Hata mesajını okumak", code: "$ lss\nbash: lss: command not found\n[İpucu] Bunu mu demek istedin: ls ?", desc: "'command not found' ifadesi komut adının tanınmadığını gösterir; çoğunlukla yazım hatasıdır." },
    ],
    guide: [
      "Terminalde pwd yazıp Enter'a bas; bulunduğun dizini gör.",
      "ls -l ile uzun listeleme yap; sütunları (izin, sahip, boyut) incele.",
      "cd Documents ile klasöre geç, pwd ile doğrula.",
      "Bilerek yanlış bir komut yaz (ör. lss) ve hata açıklamasını oku.",
      "echo 'Merhaba' > selam.txt yazıp cat selam.txt ile içeriği oku.",
      "history yaz veya ↑ tuşuyla eski komutlara dön. Komut anatomisi paneline göz at.",
    ],
    after: [
      "Her komut: ad + seçenek + argüman yapısındadır; kabuk bunu ayrıştırıp çalıştırır.",
      "Hata mesajları dostundur: ne olduğunu ve nerede olduğunu söyler.",
      "Yönlendirme (>) dosya içeriğini ezebildiği için dikkatli kullanılmalıdır.",
    ],
    summary: [
      "Terminal pencere, kabuk yorumlayıcı, komut talimattır.",
      "Komut = ad + seçenek + argüman.",
      "Çalışma dizini göreli yolların başlangıcıdır.",
      "Komut geçmişi iş yükünü azaltır ama gizli bilgi barındırabilir.",
      "Terminalde geri alma yoktur; önce kontrol et.",
    ],
    quiz: [
      ["'ls -l /etc' komutunda '-l' nedir?", ["Argüman", "Seçenek (option)", "Komut adı", "Dosya adı"], 1, "-l, ls komutunun uzun liste biçimini açan seçenektir."],
      ["Komutları yorumlayıp işletim sistemine ileten programa ne denir?", ["Derleyici", "Kabuk (shell)", "Sürücü", "Tarayıcı"], 1, "bash, zsh, cmd ve PowerShell birer kabuktur."],
      ["Linux'ta bulunduğun dizini gösteren komut hangisidir?", ["pwd", "cls", "dir /s", "hostname"], 0, "pwd (print working directory) çalışma dizinini yazar."],
      ["'bash: lss: command not found' çıktısı neyi gösterir?", ["Disk dolu", "Komut adı tanınmıyor (çoğunlukla yazım hatası)", "Ağ bağlantısı yok", "Dosya silindi"], 1, "Kabuk lss adında bir program bulamamıştır."],
      ["Aşağıdakilerden hangisi güvenli terminal alışkanlığıdır?", ["İnternetten kopyalanan komutu anlamadan çalıştırmak", "Silmeden önce ls ile hedefi kontrol etmek", "Parolaları komut satırına yazmak", "Her işi root ile yapmak"], 1, "Silme gibi geri dönüşsüz komutlardan önce hedefi doğrulamak temel güvenli alışkanlıktır."],
    ],
  },
  {
    id: 10,
    title: "CMD ve PowerShell",
    short: "Windows'un iki komut satırı: CMD, PowerShell, cmdlet'ler, parametreler ve boru hattı.",
    minutes: 50,
    goal: "Windows'ta iki farklı komut satırı kabuğunu (CMD ve PowerShell) tanıyacak, temel komutlarını öğrenecek ve aynı işlemi iki ortamda karşılaştırmalı yapacaksın.",
    outcomes: [
      "CMD ve PowerShell arasındaki farkları açıklayabilirsin.",
      "14 temel CMD komutunu ve 14 temel PowerShell cmdlet'ini kullanabilirsin.",
      "Cmdlet'in Fiil-İsim yapısını ve parametre mantığını anlayabilirsin.",
      "Boru hattı (pipeline) ile bir cmdlet'in çıktısını diğerine aktarabilirsin.",
    ],
    sections: [
      {
        h: "CMD nedir?",
        p: [
          "CMD (Command Prompt — cmd.exe), eski MS-DOS komut satırının Windows'taki devamıdır. Metin tabanlıdır: komutlar ve çıktıları düz yazıdır. Basit dosya işlemleri, ağ tanılama (ipconfig, ping) ve toplu iş dosyaları (.bat) için hâlâ yaygındır. Basit ve her Windows'ta bulunur; ancak betik yeteneği sınırlıdır.",
          "Önemli CMD komutları: dir (listele), cd (dizin değiştir), cls (ekranı temizle), mkdir (klasör oluştur), rmdir (klasör sil), copy (kopyala), move (taşı), ren (yeniden adlandır), type (içerik göster), ipconfig (ağ ayarları), ping (bağlantı testi), hostname (bilgisayar adı), whoami (kullanıcı), systeminfo (sistem bilgisi).",
        ],
      },
      {
        h: "PowerShell nedir?",
        p: [
          "PowerShell, Microsoft'un sistem yönetimi için geliştirdiği modern kabuk ve betik dilidir. CMD'den en büyük farkı, metin yerine nesneler (objects) üzerinde çalışmasıdır. Get-Process komutu düz metin değil, Name, Id, CPU gibi özellikleri olan nesneler üretir; böylece süzme, sıralama ve seçme kolaylaşır.",
          "PowerShell komutlarına cmdlet (komut-let) denir ve Fiil-İsim biçimini izler: Get-Process, Set-Location, New-Item. Fiil ne yapılacağını (Get, Set, New, Remove, Copy, Move), isim neyin üzerinde yapılacağını belirtir. Bu tutarlılık, hiç bilmediğin bir cmdlet'i tahmin etmeyi bile mümkün kılar. Güncel PowerShell Linux ve macOS'ta da çalışır.",
        ],
        list: ["Get-Help — yardım gösterir", "Get-Command — komutları arar", "Get-Location / Set-Location — konum", "Get-ChildItem / New-Item / Copy-Item / Move-Item / Rename-Item — dosya işlemleri", "Get-Process / Get-Service / Get-ComputerInfo / Get-Date / Clear-Host"],
      },
      {
        h: "CMD ve PowerShell arasındaki farklar",
        p: [
          "CMD metin döndürür, PowerShell nesne döndürür. CMD'de ayrıştırma için findstr gibi metin araçlarına başvurulur; PowerShell'de Where-Object ile özelliğe göre süzülür. CMD'nin betik dili sınırlıdır; PowerShell tam gelişmiş değişken, döngü, fonksiyon ve modül destekler. Windows yönetiminde (Active Directory, güncellemeler, bulut) PowerShell standart araç haline gelmiştir.",
          "Kolaylık için PowerShell birçok CMD komutuna takma ad (alias) tanımlar: dir, cd, cls, copy, type PowerShell'de de çalışır, ama arkada cmdlet'leri çağırır (dir → Get-ChildItem). Öğrenirken önce gerçek cmdlet adlarını bilmek faydalıdır.",
        ],
      },
      {
        h: "Parametreler ve boru hattı (pipeline)",
        p: [
          "PowerShell parametreleri '-' ile başlar ve isimlidir: New-Item -ItemType Directory -Name Proje. Bu isimli yapı komutun okunabilirliğini artırır. Parametre değerlerini sırayla da verebilirsin (konumsal parametre): Copy-Item rapor.txt yedek.txt.",
          "Boru hattı (pipeline, |) bir komutun çıktısını sonraki komuta girdi olarak verir. Örnek: Get-Process | Sort-Object CPU -Descending | Select-Object -First 3 → süreçleri al, CPU'ya göre azalan sırala, ilk üçünü göster. CMD'de de | vardır ama metin aktarır. Laboratuvarda bu zinciri çalıştıracaksın.",
        ],
        note: { type: "tip", text: "Takıldığında Get-Help <cmdlet> ve Get-Command *Process* gibi aramaları kullan. PowerShell kendi kendine öğretir." },
      },
      {
        h: "Windows sistem yönetiminde kullanımları",
        p: [
          "Sistem yöneticileri kullanıcı oluşturma, servis yönetimi, yama denetimi, log toplama ve yüzlerce bilgisayarda toplu işlem için PowerShell kullanır. Güvenlik analistleri şüpheli süreçleri bulmak, ağ bağlantılarını incelemek ve olay kayıtlarını sorgulamak için aynı araçlardan yararlanır.",
          "Saldırganlar da PowerShell'i sever (çünkü her Windows'ta vardır); bu nedenle savunma tarafı PowerShell loglamasını açar ve betik çalıştırma politikalarını (Execution Policy) yönetir. Bu eğitimde yalnızca güvenli ve temel yönetim komutları çalıştırılır.",
        ],
      },
    ],
    concepts: [
      ["CMD (cmd.exe)", "Eski tip, metin tabanlı Windows komut satırı."],
      ["PowerShell", "Nesne tabanlı modern Windows kabuğu ve betik dili."],
      ["Cmdlet", "PowerShell komutu; Fiil-İsim biçimindedir."],
      ["Parametre", "Komutun davranışını belirleyen isimli değer."],
      ["Pipeline (|)", "Çıktıyı sonraki komuta girdi yapma."],
      ["Alias (takma ad)", "Bir cmdlet için kısa ad (ls → Get-ChildItem)."],
    ],
    everyday: [
      "CMD kâğıda yazılmış liste gibidir (sadece metin); PowerShell Excel tablosu gibidir (sütunlar, süzme, sıralama).",
      "Boru hattı bir montaj bandıdır: her istasyon (cmdlet) parçayı işler ve sonrakine geçirir.",
      "Fiil-İsim biçimi, bir dükkanda raflarda 'Al-Meyve', 'Yıka-Meyve' gibi tutarlı etiket kullanmaya benzer.",
    ],
    technical: [
      "Get-ChildItem C:\\Lab dizindeki öğeleri listeler (dir ile aynı).",
      "Get-Service | Where-Object Status -eq Running yalnızca çalışan servisleri gösterir.",
      "New-Item -ItemType Directory -Name Proje yeni bir klasör oluşturur.",
    ],
    examples: [
      { title: "Aynı işlem iki dilde: klasör oluşturma ve listeleme", code: "CMD:        mkdir Proje\n            dir\nPowerShell: New-Item -ItemType Directory -Name Proje\n            Get-ChildItem", desc: "Sonuç aynıdır; PowerShell çıktısı nesne tabanlıdır." },
      { title: "PowerShell boru hattı", code: "PS> Get-Process | Sort-Object CPU -Descending | Select-Object -First 3", desc: "En çok CPU kullanan 3 süreç listelenir." },
    ],
    guide: [
      "CMD terminalinde dir çalıştır, ardından mkdir deneme yazarak klasör oluştur.",
      "PowerShell terminalinde Get-ChildItem ve New-Item -ItemType Directory -Name test komutlarını çalıştır.",
      "Get-Process | Sort-Object CPU -Descending | Select-Object -First 3 komutunu dene.",
      "Karşılaştırma tablosundaki 3 işlemi her iki terminalde de 'Çalıştır' düğmeleriyle yap.",
      "Get-Help Get-Process ile yardım çıktısını incele.",
    ],
    after: [
      "İki terminal aynı sanal dosya sistemini paylaşır: CMD'de oluşturduğun klasörü PowerShell'de görebilirsin.",
      "PowerShell'in nesne yapısı süzme ve sıralamayı kolaylaştırır.",
      "Takma adlar geçişi kolaylaştırır ama gerçek cmdlet adlarını bilmek önemlidir.",
    ],
    summary: [
      "CMD basit ve metin tabanlı, PowerShell güçlü ve nesne tabanlıdır.",
      "Cmdlet'ler Fiil-İsim yapısındadır.",
      "Parametreler '-' ile başlar.",
      "Pipeline çıktıyı komutlar arasında aktarır.",
      "Windows yönetimi ve güvenlik analizinde PowerShell yaygındır.",
    ],
    quiz: [
      ["PowerShell komutlarına ne ad verilir?", ["Cmdlet", "Daemon", "Shellcode", "Batch"], 0, "PowerShell komutları cmdlet'tir ve Fiil-İsim biçimindedir."],
      ["CMD ile PowerShell arasındaki temel fark hangisidir?", ["CMD nesne, PowerShell metin döndürür", "CMD metin, PowerShell nesne döndürür", "İkisi de aynıdır", "PowerShell yalnızca Linux'ta çalışır"], 1, "PowerShell nesne tabanlıdır; bu süzme ve sıralamayı kolaylaştırır."],
      ["'dir' komutunun PowerShell karşılığı hangisidir?", ["Get-Process", "Get-ChildItem", "Get-Date", "Clear-Host"], 1, "dir, PowerShell'de Get-ChildItem için bir takma addır."],
      ["Boru hattı (|) ne işe yarar?", ["Dosyayı siler", "Bir komutun çıktısını sonraki komuta girdi olarak verir", "Ekranı temizler", "Ağı kapatır"], 1, "Pipeline komutları zincirleyerek çıktıyı aktarır."],
      ["Ekranı temizlemek için CMD ve PowerShell'de sırasıyla hangi komutlar kullanılır?", ["cls — Clear-Host", "dir — Get-Date", "type — Get-Content", "ren — New-Item"], 0, "cls CMD'de, Clear-Host PowerShell'de ekranı temizler (PowerShell'de cls de takma addır)."],
    ],
  },
];
