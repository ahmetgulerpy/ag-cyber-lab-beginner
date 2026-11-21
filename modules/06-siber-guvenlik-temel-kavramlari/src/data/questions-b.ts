import type { Question } from "./types";

const Q = (q: string, options: [string, string, string, string], answer: number, explain: string): Question => ({ q, options, answer, explain });

export const QUIZ_B: Record<string, Question[]> = {
  "authn-authz": [
    Q("Authentication neyi doğrular?", ["Kullanıcının hangi dosyaya erişebileceğini", "Kullanıcının kim olduğunu", "Verinin değişip değişmediğini", "Ağın hızını"], 1, "Authentication, kullanıcının iddia ettiği kimliği doğrulama sürecidir."),
    Q("Giriş yapmış bir kullanıcının yönetici sayfasına erişiminin reddedilmesi hangi mekanizmayla ilgilidir?", ["Authorization", "Hashing", "Authentication", "Backup"], 0, "Kimlik doğrulanmıştır; erişimi yetki kontrolü, yani authorization engeller."),
    Q("Aşağıdakilerden hangisi gerçek MFA örneğidir?", ["İki farklı parola", "Parola + telefondaki tek kullanımlık kod", "Aynı parolayı iki kez girmek", "İki farklı kullanıcı adı"], 1, "MFA farklı TÜRDE en az iki kanıt ister: bildiğin (parola) + sahip olduğun (telefon)."),
    Q("RBAC'de yetkiler nasıl atanır?", ["Rastgele", "Doğrudan her kişiye tek tek", "Rollere bağlanır, kullanıcılar role atanır", "Sadece yöneticilere"], 2, "RBAC, yetkileri rollere bağlayarak yönetimi kolaylaştırır."),
    Q("Oturum (session) tokenı çalınırsa ne olabilir?", ["Hiçbir şey olmaz", "Saldırgan kullanıcı adına işlem yapabilir", "Parola otomatik değişir", "Hesap silinir"], 1, "Token kimliği temsil ettiğinden çalındığında oturum ele geçirilebilir."),
  ],
  "least-privilege": [
    Q("Least privilege ne anlama gelir?", ["Herkese yönetici yetkisi vermek", "Yalnızca görev için gerekli en düşük yetkiyi vermek", "Yetkileri hiç gözden geçirmemek", "Yetkileri paylaşmak"], 1, "En az ayrıcalık, görevin gerektirdiğinden fazla yetki verilmemesidir."),
    Q("Servis hesabına gereğinden fazla yetki verilmesinin riski nedir?", ["Hesap ele geçirilirse etki alanı çok büyür", "Uygulama yavaşlar", "Kullanıcı sayısı artar", "Risk yoktur"], 0, "Fazla yetkili servis hesabı ele geçirilirse saldırgan geniş erişim kazanır."),
    Q("Satıştan finansa geçen çalışan için doğru yaklaşım nedir?", ["Eski yetkileri tutmak", "Eski yetkileri kaldırıp yeni göreve uygun yetki vermek", "Her iki departmana erişim vermek", "Hesabı silmek"], 1, "Yetki kayması önlemek için görev değişiminde eski yetkiler kaldırılır."),
    Q("Yönetici hesabıyla günlük e-posta okumak neden risklidir?", ["Daha yavaştır", "Zararlı bir tıklama yönetici yetkisiyle çalışır", "E-posta çalışmaz", "Risk yoktur"], 1, "Yüksek yetkili hesapta oluşan hata veya enfeksiyon çok daha büyük zarar verir."),
    Q("Aşağıdakilerden hangisi yetki sınırlandırma yöntemidir?", ["Just-in-time (zamanında) erişim", "Parolayı herkesle paylaşmak", "Logları kapatmak", "Paylaşılan yönetici hesabı"], 0, "Just-in-time erişim, yetkiyi yalnızca gerektiği süre için verir."),
  ],
  "defense-in-depth": [
    Q("Defense in Depth'in temel fikri nedir?", ["Tek güçlü bir güvenlik duvarı", "Birden çok bağımsız savunma katmanı", "Sadece antivirüs kullanmak", "Güvenliği dışarıya vermek"], 1, "Birden çok katman, biri aşılsa bile diğerlerinin koruma sağlamasını amaçlar."),
    Q("Phishing e-postası filtreyi geçse bile hesabı hangi katman koruyabilir?", ["MFA", "Fiziksel kilit", "Yangın alarmı", "Kablolama"], 0, "MFA, parola çalınsa bile hesaba girişi zorlaştırır."),
    Q("Laptop çalındığında verilerin okunmasını engelleyen kontrol hangisidir?", ["Disk şifreleme", "Güvenlik kamerası", "Güçlü e-posta filtresi", "Yedek güç kaynağı"], 0, "Disk şifreleme, cihaz çalınsa bile verilerin okunmasını engeller."),
    Q("Aşağıdakilerden hangisi tek hata noktasına örnektir?", ["Birden fazla bağımsız kontrol", "Tüm güvenin yalnızca güvenlik duvarına bağlanması", "İzleme ve loglama", "Yedekleme"], 1, "Tek kontrolün aşılması tüm korumayı ortadan kaldırıyorsa, bu tek hata noktasıdır."),
    Q("İzleme ve olay müdahalesi katmanının asıl görevi nedir?", ["Saldırıları kesinlikle imkânsız kılmak", "Saldırıyı erken tespit etmek ve hızlı müdahale etmek", "Kullanıcıları engellemek", "Parolaları saklamak"], 1, "Hiçbir savunma %100 değildir; izleme, aşılan kontrolleri fark etmeyi sağlar."),
  ],
  "zero-trust": [
    Q("Zero Trust'ın temel ilkesi nedir?", ["İç ağdaki herkese güven", "Never Trust, Always Verify", "Sadece parolaya güven", "VPN yeterlidir"], 1, "Zero Trust'ta güven varsayılmaz; her erişim doğrulanır."),
    Q("Mikro segmentasyonun amacı nedir?", ["Ağı yavaşlatmak", "Saldırganın ağda serbestçe ilerlemesini engellemek", "Parola uzunluğunu artırmak", "Yedek almak"], 1, "Ağı küçük bölgelere ayırarak bir ihlalin yayılmasını sınırlar."),
    Q("Zero Trust erişim kararında hangisi dikkate alınır?", ["Yalnızca kullanıcının ofiste olması", "Kimlik, cihaz durumu, konum ve politika", "Sadece IP adresinin ilk hanesi", "Sadece günün saati"], 1, "Bağlam temelli erişim birden çok sinyali birlikte değerlendirir."),
    Q("Geleneksel çevre güvenliğinin zayıflığı nedir?", ["Çok pahalı olması", "İçeri giren kişiye fazla güvenilmesi", "Çok fazla doğrulama istemesi", "Hiç güvenlik duvarı olmaması"], 1, "Çevre modelinde ağa girdikten sonra serbest dolaşım mümkündür; ele geçirilen hesap geniş etki yaratır."),
    Q("Doğru parola girilmiş ama cihaz güncel değil ve konum olağandışı. Zero Trust ne yapar?", ["Doğrudan izin verir", "Ek doğrulama ister veya erişimi kısıtlar", "Parolayı sıfırlar", "Hesabı kalıcı siler"], 1, "Zero Trust, risk sinyallerine göre erişimi sınırlar veya ek doğrulama ister."),
  ],
  "security-policy": [
    Q("Güvenlik politikasının temel amacı nedir?", ["Çalışanları cezalandırmak", "Kurumsal güvenlik beklentilerini resmi hale getirmek", "Yazılım geliştirmek", "Ağ hızını artırmak"], 1, "Politika, kurumun güvenlik kurallarını ve sorumlulukları tanımlar."),
    Q("Politika ile prosedür arasındaki fark nedir?", ["Politika 'nasıl', prosedür 'ne'", "Politika 'ne ve neden', prosedür 'nasıl'", "İkisi aynıdır", "Prosedür yönetim tarafından yazılmaz"], 1, "Politika üst düzey kuraldır; prosedür adım adım uygulamadır."),
    Q("'Kurumsal belgelerin kişisel bulut hesaplarına yüklenmemesi' hangi politikanın kapsamındadır?", ["Veri koruma ve kabul edilebilir kullanım", "Parola politikası", "Fiziksel güvenlik", "Yedekleme planı"], 0, "Verinin yetkisiz alanlara taşınması veri koruma ve kabul edilebilir kullanım kapsamındadır."),
    Q("Politika güncelleme sürecinde doğru sıra hangisidir?", ["Duyur → Taslak → Gözden geçir", "Gözden geçir → Taslak → Onay → Duyur", "Onay → Gözden geçir → Taslak", "Sadece duyur"], 1, "Gözden geçirme, taslak, onay, duyuru ve izleme adımları izlenir."),
    Q("'Güçlü parola kullanın' maddesinin zayıflığı nedir?", ["Çok uzun olması", "Ölçülebilir kriter içermemesi", "Yönetim onayı", "Parola içermesi"], 1, "Minimum uzunluk, MFA gibi ölçülebilir kriterler olmadan madde denetlenemez."),
  ],
  "security-awareness": [
    Q("Aşağıdakilerden hangisi phishing işareti DEĞİLDİR?", ["Acil işlem baskısı", "Gönderen alan adı tanıdık ama harf farkı var", "Beklenen ve doğrulanmış bir toplantı daveti", "Parola istenmesi"], 2, "Önceden bilinen ve doğrulanmış bir davet tek başına şüpheli değildir; diğerleri tipik işaretlerdir."),
    Q("Telefonda 'IT destek' diyen biri doğrulama kodunu isterse ne yapılmalı?", ["Kodu söylemek", "Hiçbir koşulda paylaşmamak ve bildirmek", "Yarısını söylemek", "Başka birine vermek"], 1, "Tek kullanımlık kodlar asla paylaşılmaz; talep sosyal mühendislik işaretidir."),
    Q("Otoparkta bulunan etiketli USB belleğe ne yapılmalı?", ["Bilgisayara takıp sahibini bulmak", "Takmadan güvenlik birimine teslim etmek", "Evde denemek", "Arkadaşa vermek"], 1, "Bilinmeyen USB zararlı yazılım taşıyabilir; güvenlik ekibine teslim edilmelidir."),
    Q("Parola yöneticisinin amacı nedir?", ["Parolaları herkese göstermek", "Güçlü ve benzersiz parolaları güvenle saklamak", "Parolayı kısaltmak", "MFA'yı kaldırmak"], 1, "Parola yöneticisi her hesap için benzersiz, güçlü parola kullanmayı kolaylaştırır."),
    Q("Şüpheli bir e-posta fark eden çalışan için en iyi davranış nedir?", ["Bağlantıya tıklayıp bakmak", "Yanıtlamak", "Tıklamadan güvenlik ekibine bildirmek", "Tüm çalışanlara iletmek"], 2, "Bildirim, ekibin diğer çalışanları da korumasını sağlar."),
  ],
};
