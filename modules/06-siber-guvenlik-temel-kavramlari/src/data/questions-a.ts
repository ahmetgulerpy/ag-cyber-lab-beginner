import type { Question } from "./types";

const Q = (q: string, options: [string, string, string, string], answer: number, explain: string): Question => ({ q, options, answer, explain });

export const QUIZ_A: Record<string, Question[]> = {
  "cia-triad": [
    Q("Bir çalışanın yetkisi olmadığı halde müşteri listesini okuması hangi prensibi ihlal eder?", ["Bütünlük", "Erişilebilirlik", "Gizlilik", "Hesap verebilirlik"], 2, "Yetkisiz okuma, bilginin yalnızca yetkililere açık olması ilkesi olan gizliliği ihlal eder."),
    Q("Bir sipariş kaydındaki tutarın saldırgan tarafından değiştirilmesi hangi prensibi etkiler?", ["Gizlilik", "Bütünlük", "Erişilebilirlik", "Hiçbirini"], 1, "Verinin yetkisiz değiştirilmesi doğruluğunu bozar; bu bütünlük ihlalidir."),
    Q("DDoS saldırısı nedeniyle bir web sitesinin açılmaması hangi prensibi hedef alır?", ["Erişilebilirlik", "Gizlilik", "Bütünlük", "Kimlik doğrulama"], 0, "Hizmetin yetkili kullanıcılara ulaşılamaz hale gelmesi erişilebilirlik ihlalidir."),
    Q("Dijital imza ve hash değerleri en çok hangi prensibi korumaya yardımcı olur?", ["Erişilebilirlik", "Gizlilik", "Rol yönetimi", "Bütünlük"], 3, "Hash ve dijital imza, verinin değişmediğini doğrulamak için kullanılır; yani bütünlüğü korur."),
    Q("Fidye yazılımı dosyaları şifreleyip aynı zamanda çalarsa hangi prensipler etkilenir?", ["Yalnızca bütünlük", "Erişilebilirlik ve gizlilik", "Yalnızca gizlilik", "Hiçbiri"], 1, "Dosyalara erişimi engellemek erişilebilirliği, verinin kopyalanması ise gizliliği etkiler."),
  ],
  "asset-threat-vulnerability": [
    Q("Aşağıdakilerden hangisi bir 'varlık' (asset) örneğidir?", ["Yamasız yazılım", "Müşteri veritabanı", "Fidye yazılımı", "Zayıf parola"], 1, "Müşteri veritabanı kurum için değeri olan ve korunması gereken bir varlıktır."),
    Q("Güncellenmemiş bir web sunucusu hangi kavrama örnektir?", ["Zafiyet", "Tehdit", "Varlık", "Tehdit aktörü"], 0, "Yamasız yazılım sistemin içindeki bir zayıflıktır; bu bir zafiyettir."),
    Q("Aşağıdakilerden hangisi tehdit kaynağıdır?", ["Ekran kilidinin olmaması", "Kötü niyetli saldırgan", "Varsayılan parola", "Yedeklenmemiş disk"], 1, "Saldırgan, zarar verme potansiyeli olan bir tehdit kaynağıdır. Diğerleri zafiyettir."),
    Q("Zafiyeti kapatmak neyi azaltır?", ["Varlığın değerini", "Tehdit aktörlerinin sayısını", "Tehdidin istismar edebileceği imkânı", "Yasal yükümlülükleri"], 2, "Zafiyet kapandığında tehdit, o açığı kullanamaz; risk azalır."),
    Q("'Sunucu odasının kapısı kilitli değil' ifadesindeki kilit eksikliği nedir?", ["Tehdit", "Zafiyet", "Varlık", "Exploit"], 1, "Kilidin olmaması fiziksel bir zayıflıktır, yani zafiyettir."),
  ],
  "risk-yonetimi": [
    Q("Risk seviyesi hangi iki unsurun birleşiminden hesaplanır?", ["Maliyet ve süre", "Olasılık ve etki", "Tehdit ve varlık sayısı", "Yama ve yedek"], 1, "Risk = Olasılık × Etki şeklinde değerlendirilir."),
    Q("Bir şirketin siber sigorta yaptırması hangi risk stratejisidir?", ["Azaltma", "Kaçınma", "Kabul", "Transfer"], 3, "Sigorta mali sonucu üçüncü tarafa devreder; bu risk transferidir."),
    Q("Güncellenemeyen eski bir sistemi tamamen kapatmak hangi stratejidir?", ["Riskten kaçınma", "Risk kabulü", "Risk transferi", "Risk azaltma"], 0, "Riskli faaliyeti sonlandırmak riskten kaçınmadır."),
    Q("Düşük olasılıklı ve düşük etkili bir riski bilinçli olarak üstlenmek hangisidir?", ["Transfer", "Kaçınma", "Kabul", "Azaltma"], 2, "Önlem maliyeti riskin değerinden yüksekse risk bilinçli olarak kabul edilebilir."),
    Q("Aşağıdakilerden hangisi doğrudur?", ["Risk yönetimi bir kez yapılıp bitirilir", "Risk yönetimi sürekli bir döngüdür", "Riskler her zaman sıfırlanabilir", "Kabul edilen riskler kayıt altına alınmaz"], 1, "Tehditler ve sistemler değiştiği için risk yönetimi tekrar eden bir yaşam döngüsüdür."),
  ],
  "attack-surface": [
    Q("Saldırı yüzeyi (attack surface) nedir?", ["Saldırganın kullandığı zararlı yazılım", "Saldırganın etkileşime girebileceği tüm giriş noktaları", "Güvenlik duvarı kuralları", "Bir zafiyetin etkisi"], 1, "Saldırı yüzeyi, bir sistemde saldırganın erişebileceği tüm noktaların toplamıdır."),
    Q("Aşağıdakilerden hangisi saldırı yüzeyini küçültür?", ["Kullanılmayan servisleri kapatmak", "Yeni açık portlar eklemek", "Test sunucusunu internete açmak", "Yönetici sayısını artırmak"], 0, "Gereksiz servisleri kapatmak erişilebilir giriş noktası sayısını azaltır."),
    Q("Ayrılan çalışanın hesabının açık kalması hangi yüzey türüne girer?", ["Fiziksel", "İnsan/kimlik kaynaklı", "Yalnızca ağ", "Donanım"], 1, "Kullanıcı hesapları ve insan kaynaklı noktalar saldırı yüzeyinin parçasıdır."),
    Q("İnternetten doğrudan erişilebilen RDP portu için en uygun önlem hangisi?", ["Portu daha çok duyurmak", "Yalnızca VPN üzerinden erişime almak", "Parolayı kısaltmak", "Hiçbir şey yapmamak"], 1, "VPN arkasına almak yüzeyi küçültür ve doğrudan internet erişimini engeller."),
    Q("Herkese açık bırakılan bir bulut depolama alanı neyi ifade eder?", ["Geniş bir dijital saldırı yüzeyini", "Fiziksel yüzeyi", "Risk transferini", "Güvenli bir yedeği"], 0, "Yanlış yapılandırılmış bulut depolama, internetteki herkese açılmış bir giriş noktasıdır."),
  ],
  "attack-vector": [
    Q("Saldırı vektörü nedir?", ["Sistemdeki tüm açık kapılar", "Saldırganın hedefe ulaşmak için izlediği yol", "Zafiyetin puanı", "Savunma katmanı"], 1, "Vektör, saldırganın hedefe ulaşmak için kullandığı yöntem/yoldur."),
    Q("Sahte bir e-postayla kullanıcıyı sahte giriş sayfasına yönlendirmek hangi vektördür?", ["Insider Threat", "Misconfiguration", "Phishing", "Fiziksel erişim"], 2, "Sahte iletişimle kandırma phishing vektörüdür."),
    Q("Başka bir siteden sızan parolanın kurumsal hesapta denenmesi hangi vektöre girer?", ["Malware", "Credential Theft", "Fiziksel", "DDoS"], 1, "Çalınmış veya sızmış kimlik bilgilerinin kullanılması credential theft kapsamındadır."),
    Q("Varsayılan parolayla internete açık bırakılan yönetim paneli hangi vektöre örnektir?", ["Phishing", "Social Engineering", "Misconfiguration", "Malware"], 2, "Güvensiz yapılandırma misconfiguration vektörüdür."),
    Q("Aşağıdakilerden hangisi saldırı yüzeyi ile vektör farkını doğru ifade eder?", ["İkisi aynı şeydir", "Yüzey giriş noktaları, vektör kullanılan yoldur", "Yüzey yalnızca fiziksel, vektör yalnızca dijitaldir", "Vektör yüzeyin diğer adıdır"], 1, "Yüzey 'nerelerden girilebilir', vektör 'nasıl girildi' sorularının cevabıdır."),
  ],
  "exploit-payload": [
    Q("Exploit nedir?", ["Zafiyeti kullanan yöntem", "Zafiyetin kendisi", "Yedekleme aracı", "Kimlik doğrulama yöntemi"], 0, "Exploit, bir zafiyeti tetikleyerek beklenmeyen davranış sağlayan yöntemdir."),
    Q("Payload ifadesi neyi anlatır?", ["Zafiyeti bulma sürecini", "Exploit sonrası çalışan asıl işlevi", "Güvenlik duvarını", "Ağ trafiğini"], 1, "Payload, exploit başarılı olduktan sonra çalışan işlev veya etkidir."),
    Q("Doğru akış hangisidir?", ["Payload → Exploit → Zafiyet", "Exploit → Zafiyet → Payload", "Zafiyet → Exploit → Payload → Sonuç", "Sonuç → Payload → Zafiyet"], 2, "Zafiyet exploit ile kullanılır, ardından payload çalışır ve sonuç oluşur."),
    Q("Exploit'e karşı en doğrudan savunma hangisidir?", ["Zamanında yama uygulamak", "Parolayı paylaşmak", "Logları kapatmak", "USB'yi serbest bırakmak"], 0, "Yama, exploit'in kullandığı zafiyeti kapatarak exploit'i etkisiz hale getirir."),
    Q("Sızma testlerinde exploit kullanımı için hangisi şarttır?", ["Yazılı izin ve tanımlı kapsam", "Gizlilik", "Müşteriye haber vermemek", "Herkese açık sistemler"], 0, "Yetkili testler yazılı izinle ve belirlenmiş kapsamda yapılır; aksi halde yasa dışıdır."),
  ],
};
