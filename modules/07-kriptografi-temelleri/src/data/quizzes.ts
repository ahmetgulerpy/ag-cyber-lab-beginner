import { toQ, type QT, type Q } from "@/components/Quiz";

const T: Record<number, QT[]> = {
  1: [
    ["Kriptografinin üç temel hedefi aşağıdakilerden hangisidir?", ["Hız, depolama, renk", "Gizlilik, bütünlük, kimlik doğrulama", "Yedekleme, sıkıştırma, çoğaltma", "Reklam, analiz, izleme"], 1, "Kriptografi gizlilik (okunamaz kılma), bütünlük (değişmediğini kanıtlama) ve kimlik doğrulama sağlar."],
    ["Laboratuvarda Caesar şifresini birkaç saniyede kırabilmenin asıl nedeni nedir?", ["Algoritma gizli olduğu için", "Anahtar uzayı çok küçük olduğu için (yalnızca ~28 kaydırma)", "Metin çok uzun olduğu için", "Tarayıcı güvenli olmadığı için"], 1, "Tüm kaydırmaları denemek (brute force) çok kolaydır; anlamlı metin hemen bulunur."],
    ["Kerckhoffs ilkesine göre bir şifreleme sisteminin güvenliği neye dayanmalıdır?", ["Algoritmanın gizli tutulmasına", "Şifreli metnin kısa olmasına", "Yalnızca anahtarın gizliliğine", "Mesajın sık değiştirilmesine"], 2, "Algoritma açık olsa bile anahtar gizli kaldıkça sistem güvenli olmalıdır."],
    ["Aşağıdakilerden hangisi klasik şifreleme yöntemidir?", ["AES-GCM", "RSA-OAEP", "SHA-256", "Caesar şifresi"], 3, "Caesar tarihî bir yerine koyma şifresidir; modern ve güvenli değildir."],
    ["Bir dosyanın yolda değiştirilip değiştirilmediğini anlamak hangi güvenlik hedefiyle ilgilidir?", ["Bütünlük", "Erişilebilirlik", "Gizlilik", "Anonimlik"], 0, "Bütünlük, verinin yetkisiz değişikliğe uğramadığını doğrulamaktır."],
  ],
  2: [
    ["'Açık metin' (plaintext) tanımı hangisidir?", ["Şifrelenmiş veri", "Şifrelenmemiş, okunabilir özgün veri", "Anahtarın kendisi", "Hash çıktısı"], 1, "Plaintext, şifreleme öncesi orijinal veridir; metin olmak zorunda değildir."],
    ["Aynı algoritma ile yalnızca anahtarı değiştirirsen ne olur?", ["Şifreli metin aynı kalır", "Şifreli metin tamamen farklı olur", "Algoritma bozulur", "Açık metin değişir"], 1, "Algoritma sabit, çıktıyı belirleyen anahtardır."],
    ["Laboratuvarda AES-GCM ile yanlış parola kullanıldığında ne gözlemledin?", ["Metin biraz bozuk çıktı", "Orijinal metin çıktı", "Çözme doğrulama hatasıyla reddedildi", "Metin otomatik düzeldi"], 2, "GCM doğrulama etiketi yanlış anahtarda tutmaz; çözme reddedilir."],
    ["Aşağıdakilerden hangisi anahtar güvenliği için kötü uygulamadır?", ["Anahtarı korumalı anahtar deposunda tutmak", "Anahtarı kaynak koda sabit yazıp depoya yüklemek", "Anahtarı düzenli yenilemek", "Anahtarı donanım modülünde saklamak"], 1, "Koda gömülen anahtar sızar ve git geçmişinde kalır."],
    ["'Kendi icat ettiğim gizli algoritma' yaklaşımı için doğru ifade hangisidir?", ["En güvenli yoldur", "Modern kriptografide önerilmez; incelenmiş standartlar kullanılmalı", "Yalnızca mobilde çalışır", "AES'ten hızlıdır"], 1, "Gizlilik yoluyla güvenlik (security through obscurity) genellikle kırılır."],
  ],
  3: [
    ["Simetrik şifrelemenin temel özelliği nedir?", ["İki farklı anahtar kullanır", "Şifreleme ve çözmede aynı gizli anahtar kullanılır", "Anahtar gerektirmez", "Yalnızca imza için kullanılır"], 1, "Gönderen ve alıcı aynı anahtarı paylaşır."],
    ["AES-GCM'in CBC'ye göre önemli avantajı nedir?", ["Anahtarı gerektirmemesi", "Doğrulama etiketiyle bütünlüğü de sağlaması", "IV kullanmaması", "Daha kısa anahtar kullanması"], 1, "GCM bir AEAD modudur: gizlilik + bütünlük."],
    ["AES-GCM'de aynı anahtarla aynı nonce'u iki kez kullanmak neden tehlikelidir?", ["Şifreleme yavaşlar", "Şifreli metinlerin XOR'u açık metinlerin XOR'unu sızdırır ve doğrulama zayıflar", "Anahtar uzunluğu azalır", "Tarayıcı hata verir ama güvenlik etkilenmez"], 1, "Aynı akış anahtarı iki mesajda kullanılmış olur; laboratuvardaki deneyde bunu gördün."],
    ["Nonce/IV hakkında doğru ifade hangisidir?", ["Gizli tutulmalıdır", "Gizli değildir ama tekrar edilmemelidir", "Anahtarla aynıdır", "Her zaman 0 olmalıdır"], 1, "Nonce şifreli veriyle birlikte açıkça gönderilir."],
    ["Simetrik şifrelemenin en büyük pratik sorunu hangisidir?", ["Çok yavaş olması", "Anahtarın karşı tarafa güvenli iletilmesi", "Desteklenen algoritma azlığı", "Veri boyutu sınırı"], 1, "Çözüm: asimetrik şifreleme ile anahtar paylaşımı (hibrit)."],
  ],
  4: [
    ["Bob'a gizli mesaj göndermek için hangi anahtar kullanılır?", ["Bob'un Private Key'i", "Bob'un Public Key'i", "Gönderenin Private Key'i", "Gönderenin Public Key'i"], 1, "Mesaj alıcının Public Key'i ile şifrelenir; yalnızca Bob'un Private Key'i çözer."],
    ["Laboratuvarda başka bir anahtar çiftinin Private Key'i ile çözmeyi denediğinde ne oldu?", ["Mesaj çözüldü", "Çözme başarısız oldu", "Mesaj yarı çözüldü", "Anahtar otomatik düzeltildi"], 1, "Anahtarlar eşleşmediği için RSA-OAEP çözme hata verir."],
    ["Büyük bir dosyayı alıcıya güvenle iletmek için doğru yaklaşım nedir?", ["Dosyayı doğrudan RSA ile şifrelemek", "Hibrit: AES ile şifrele, AES anahtarını RSA ile şifrele", "Dosyayı hash'lemek", "Private Key'i göndermek"], 1, "RSA küçük veri içindir; hibrit yöntem hız ve anahtar paylaşımı sağlar."],
    ["Aynı güvenlik seviyesi için hangisi genellikle daha kısa anahtar kullanır?", ["RSA", "ECC", "Caesar", "MD5"], 1, "256 bit ECC yaklaşık 3072 bit RSA güvenliği sağlar."],
    ["Private Key için doğru ifade hangisidir?", ["Herkese verilmelidir", "Yalnızca sahibinde kalmalı, paylaşılmamalıdır", "Sertifikaya yazılır", "Mesajla birlikte gönderilir"], 1, "Private Key sızarsa kimlik ve gizlilik kaybedilir."],
  ],
  5: [
    ["Hash fonksiyonu için doğru ifade hangisidir?", ["Anahtarla geri çözülebilir", "Girdi uzunluğundan bağımsız sabit uzunlukta çıktı üretir", "Çıktısı girdiyle aynı uzunluktadır", "Şifreleme algoritmasıdır"], 1, "SHA-256 her girdi için 256 bit çıktı verir."],
    ["Laboratuvarda tek karakter değiştirince hash'in büyük kısmı değişti. Bu özelliğin adı nedir?", ["Collision", "Avalanche (çığ) etkisi", "Salting", "Padding"], 1, "Küçük girdi değişikliği çıktıda ~%50 bit farkı yaratır."],
    ["Aynı metni iki kez SHA-256 ile hash'lersen ne olur?", ["Farklı hash'ler", "Aynı hash (deterministik)", "Hata", "Her seferinde rastgele hash"], 1, "Hash deterministiktir; bu yüzden doğrulama için kullanılabilir."],
    ["Hash ile şifreleme arasındaki temel fark nedir?", ["Hash geri döndürülemez, şifreleme anahtarla geri döndürülebilir", "Hash daha yavaştır", "Şifreleme sabit uzunlukta çıktı verir", "Fark yoktur"], 0, "Hash tek yönlüdür ve anahtarı yoktur."],
    ["İndirilen dosyanın resmî SHA-256 değeriyle aynı çıkması neyi gösterir?", ["Dosyanın virüssüz olduğunu kesin olarak", "Dosyanın referans hash'in üretildiği dosyayla aynı olduğunu (bütünlük)", "Dosyanın şifreli olduğunu", "Dosyanın küçük olduğunu"], 1, "Bütünlük kanıtlanır; zararsızlık ayrıca değerlendirilir."],
  ],
  6: [
    ["Aşağıdakilerden hangisi 160 bit çıktı üretir?", ["MD5", "SHA-1", "SHA-256", "SHA-512"], 1, "SHA-1 → 160 bit (40 hex)."],
    ["MD5 ve SHA-1 neden güvenlik amaçlı kullanılmamalıdır?", ["Çok yavaş oldukları için", "Çakışma (collision) üretilebildiği için", "Çok uzun çıktı verdikleri için", "Anahtar gerektirdikleri için"], 1, "MD5 (2004) ve SHA-1 (2017) için pratik çakışmalar gösterildi."],
    ["SHA-256 için doğru ifade hangisidir?", ["Parola saklamak için tek başına en iyi seçimdir", "Güvenlidir; ancak parola saklamada yavaş ve tuzlu KDF gerekir", "Kırılmıştır", "Şifreleme algoritmasıdır"], 1, "SHA-256 çok hızlıdır; parola için PBKDF2/Argon2 gerekir."],
    ["Laboratuvarda 'abc' için MD5 çıktısı kaç hex karakterdir?", ["16", "32", "40", "64"], 1, "MD5 128 bit = 32 hex karakter."],
    ["Bir yazılımın indirme sayfasında SHA-256 yayınlanmasının amacı nedir?", ["Dosyayı şifrelemek", "İndirenin dosya bütünlüğünü doğrulayabilmesi", "Dosyayı sıkıştırmak", "Lisans kontrolü"], 1, "Kullanıcı hash'i hesaplayıp karşılaştırır."],
  ],
  7: [
    ["Salt'ın temel amacı nedir?", ["Hash'i şifrelemek", "Aynı parolaların farklı hash üretmesini ve hazır tabloları engellemek", "Hash'i kısaltmak", "Parolayı gizlemek"], 1, "Salt benzersiz ve rastgeledir; rainbow table'ı etkisizleştirir."],
    ["Salt değeri için doğru ifade hangisidir?", ["Gizli anahtar gibi saklanmalıdır", "Gizli olması gerekmez; hash ile birlikte saklanır", "Tüm kullanıcılarda aynı olmalıdır", "Kısa ve tahmin edilebilir olmalıdır"], 1, "Salt gizli değildir; benzersizliği önemlidir."],
    ["Laboratuvarda aynı parolayı iki farklı salt ile hash'lediğinde ne gördün?", ["Aynı hash", "Tamamen farklı hash'ler", "Hash'ler yarı yarıya aynı", "Hata"], 1, "Girdi (parola+salt) değiştiği için çıktı bambaşka olur."],
    ["Aşağıdakilerden hangisi parola saklamak için en uygun seçimdir?", ["MD5", "Düz SHA-256", "Argon2id veya bcrypt/PBKDF2 (tuzlu)", "Base64"], 2, "Yavaş, tuzlu parola hash fonksiyonları gerekir."],
    ["Pepper ile salt arasındaki fark nedir?", ["Fark yoktur", "Pepper ortak ve gizli (DB dışında), salt kullanıcıya özel ve gizli değil", "Pepper herkese açıktır", "Salt kullanıcıdan gizlenir"], 1, "Pepper veritabanı çalınsa bile korunan ek sırdır."],
  ],
  8: [
    ["Dijital imza hangi anahtarla oluşturulur?", ["Alıcının Public Key'i", "Göndericinin Private Key'i", "Alıcının Private Key'i", "Göndericinin Public Key'i"], 1, "İmza Private Key ile oluşturulur, Public Key ile doğrulanır."],
    ["Dijital imza mesajı gizler mi?", ["Evet, tamamen", "Hayır; imzalı mesaj okunabilir kalır", "Sadece kısa mesajları", "Yalnızca Public Key bilinirse"], 1, "Gizlilik için ayrıca şifreleme gerekir."],
    ["Laboratuvarda imzalandıktan sonra mesajı değiştirdiğinde doğrulama sonucu ne oldu?", ["Geçerli", "Geçersiz", "Hata verdi ama geçerli sayıldı", "Mesaj otomatik düzeldi"], 1, "Hash eşleşmediği için imza geçersiz olur."],
    ["RSA-OAEP ve RSA-PSS için doğru eşleşme hangisidir?", ["OAEP imza, PSS şifreleme", "OAEP şifreleme, PSS imza", "İkisi de hash", "İkisi de şifreleme"], 1, "Farklı amaçlara hizmet ederler."],
    ["Dijital imza hangisini sağlamaz?", ["Kimlik doğrulama", "Bütünlük", "İnkâr edememe", "Mesaj gizliliği"], 3, "Gizlilik için şifreleme gerekir."],
  ],
  9: [
    ["Alice, Bob'un imzasını doğrulamak istiyor. Hangi anahtarı kullanmalı?", ["Bob'un Private Key'i", "Bob'un Public Key'i", "Alice'in Public Key'i", "Alice'in Private Key'i"], 1, "İmza, imzalayanın Public Key'i ile doğrulanır."],
    ["Aşağıdakilerden hangisi paylaşılabilir?", ["RSA Private Key", "AES gizli anahtar", "RSA Public Key", "Parola"], 2, "Public Key açıktır."],
    ["Private Key sızdığında ilk yapılacak şey nedir?", ["Dosyayı silmek", "Anahtarı iptal edip yenisini üretmek", "Hiçbir şey", "Aynı anahtarı kullanmaya devam etmek"], 1, "Sızan anahtara artık güvenilemez."],
    ["Anahtar çiftleri için en iyi uygulama hangisidir?", ["Şifreleme ve imza için aynı çifti kullanmak", "Farklı amaçlar için ayrı çiftler kullanmak", "Private Key'i e-postayla yedeklemek", "Anahtarı hiç değiştirmemek"], 1, "Amaç ayrımı riskleri sınırlar."],
    ["Private Key'i dışarı çıkarmadan işlem yapan donanım hangisidir?", ["Modem", "HSM / donanım anahtarı", "Yazıcı", "Router"], 1, "HSM ve YubiKey Private Key'i cihaz içinde tutar."],
  ],
  10: [
    ["SSL ile TLS arasındaki ilişki nedir?", ["SSL daha yenidir", "TLS, SSL'in modern ve güvenli halefidir; SSL tarihsel terimdir", "İkisi aynı derecede güvenlidir", "SSL yalnızca e-posta içindir"], 1, "SSL 2.0/3.0 güvensizdir; bugün TLS 1.2/1.3 kullanılır."],
    ["TLS el sıkışmasında sunucu kimliğini neyle kanıtlar?", ["Parolayla", "Sertifikasıyla (ve Private Key sahipliğiyle)", "IP adresiyle", "Tarayıcı geçmişiyle"], 1, "Sertifika Public Key'i alan adına bağlar."],
    ["TLS'te trafik asıl olarak neyle şifrelenir?", ["RSA ile", "El sıkışmada anlaşılan simetrik oturum anahtarıyla (örn. AES-GCM)", "MD5 ile", "Caesar ile"], 1, "Asimetrik yöntemler anahtar anlaşması/kimlik içindir; veri simetrik şifrelenir."],
    ["Laboratuvarda süresi dolmuş sertifika seçildiğinde ne oldu?", ["Bağlantı güvenli kuruldu", "Sertifika doğrulaması başarısız oldu ve oturum kurulmadı", "Tarayıcı süreyi uzattı", "Sunucu şifrelemeyi kapattı"], 1, "Tarih kontrolü başarısız olunca güven oluşmaz."],
    ["Kafedeki HTTP sitesine girilen parolayı kim görebilir?", ["Kimse", "Aynı ağdaki saldırgan düz metin olarak", "Yalnızca sunucu", "Sadece tarayıcı"], 1, "HTTP şifresizdir; HTTPS gerekir."],
  ],
  11: [
    ["Dijital sertifikayı kim imzalar?", ["Sunucu sahibi", "Sertifika Otoritesi (CA)", "Tarayıcı kullanıcısı", "DNS sağlayıcısı"], 1, "CA'nın imzası Public Key–kimlik bağını doğrular."],
    ["Doğru zincir sırası hangisidir?", ["Sunucu → Root → Intermediate", "Root CA → Intermediate CA → Sunucu sertifikası", "Intermediate → Sunucu → Root", "Sunucu → Sunucu → Root"], 1, "Root, Intermediate'i; Intermediate, sunucu sertifikasını imzalar."],
    ["Sertifika www.ornek.com içindir ama kullanıcı api.ornek.com'a bağlandı. Hata nedir?", ["Süresi dolmuş", "Alan adı uyuşmazlığı", "İptal edilmiş", "Zincir tamam"], 1, "SAN/CN alanı bağlanılan alan adını içermiyor."],
    ["CRL ile OCSP arasındaki fark nedir?", ["CRL iptal listesi indirir; OCSP tek sertifikayı sorgular", "İkisi de sertifika üretir", "OCSP imza üretir", "Fark yoktur"], 0, "CRL liste, OCSP çevrimiçi sorgudur."],
    ["Root CA neden çoğu zaman doğrudan sunucu sertifikası imzalamaz?", ["Yasak olduğu için", "Riske girmesin diye çevrimdışı tutulur; Intermediate CA'lar imzalar", "Daha yavaş olduğu için", "Anahtarı olmadığı için"], 1, "Intermediate ele geçirilirse sadece o iptal edilir."],
  ],
  12: [
    ["Aşağıdaki parolalardan hangisi en güçlüdür?", ["P@ssw0rd!", "kahve-masa-orman-bulut-37", "Merhaba123", "qwerty2024"], 1, "Uzun ve rastgele kelime dizileri yüksek entropi sağlar."],
    ["Credential stuffing nedir?", ["Parolayı kaba kuvvetle tahmin etme", "Sızan e-posta/parola çiftlerini başka sitelerde denemek", "Sunucuyu çökertmek", "Sertifika sahteciliği"], 1, "Parola tekrar kullanımı bu saldırıyı mümkün kılar."],
    ["TOTP kodunun özelliği hangisidir?", ["Sürekli aynı kalır", "Paylaşılan sır ve zamandan türetilir, kısa süre geçerlidir", "SMS ile hesaplanır", "Parolaya eşittir"], 1, "Genellikle 30 saniyede bir yenilenir."],
    ["Phishing-resistant MFA için en iyi örnek hangisidir?", ["SMS kodu", "FIDO2/WebAuthn donanım anahtarı veya passkey", "Güvenlik sorusu", "E-posta kodu"], 1, "Kimlik bilgisi alan adına bağlıdır; sahte sitede çalışmaz."],
    ["MFA etkin hesapta saldırgan çalıntı parolayı kullanırsa ne olur?", ["Doğrudan girer", "İkinci faktörü olmadığı için giriş engellenir", "Parola otomatik değişir", "Hesap silinir"], 1, "İkinci faktör saldırganda yoktur."],
  ],
};

export const LESSON_QUIZ: Record<number, Q[]> = Object.fromEntries(Object.entries(T).map(([k, v]) => [Number(k), toQ(v)]));

const EXAM_T: QT[] = [
  ["Aşağıdakilerden hangisi gizlilik sağlar?", ["SHA-256", "AES-GCM şifreleme", "Dijital imza tek başına", "CRC"], 1, "Gizlilik şifrelemeyle sağlanır; hash ve imza içeriği gizlemez."],
  ["Caesar şifresi için doğru ifade hangisidir?", ["Modern güvenli şifrelemedir", "Küçük anahtar uzayı nedeniyle kolay kırılır", "Asimetriktir", "AES'in eski adıdır"], 1, "Birkaç deneme ile tüm anahtarlar taranır."],
  ["AES-GCM'de her şifrelemede ne yapılmalıdır?", ["Aynı nonce kullanılmalı", "Yeni benzersiz nonce üretilmeli", "Nonce gizli saklanmalı", "Nonce silinmeli"], 1, "Aynı anahtarla nonce tekrarı güvenliği bozar."],
  ["Mesaj Public Key ile şifrelendiyse hangi anahtarla çözülür?", ["Aynı Public Key", "Eşleşen Private Key", "Herhangi bir Private Key", "Hash ile"], 1, "Yalnızca eşleşen Private Key çözer."],
  ["Hash fonksiyonu için hangisi YANLIŞTIR?", ["Sabit uzunlukta çıktı verir", "Aynı girdi aynı çıktıyı verir", "Doğru anahtarla geri çözülebilir", "Çığ etkisi gösterir"], 2, "Hash geri döndürülemez ve anahtarı yoktur."],
  ["Hangi algoritma için pratik çakışma 2017'de gösterildi?", ["SHA-256", "SHA-1", "AES", "RSA"], 1, "SHAttered saldırısı SHA-1 çakışması üretti."],
  ["Parola saklama için hangisi en uygundur?", ["MD5", "SHA-1", "Tek başına SHA-256", "Salt'lı Argon2id/bcrypt/PBKDF2"], 3, "Yavaş ve tuzlu KDF'ler kullanılmalıdır."],
  ["Salt hakkında doğru ifade hangisidir?", ["Gizli anahtardır", "Gizli olmak zorunda değildir; benzersiz ve rastgele olmalıdır", "Tüm kullanıcılar için aynı olmalıdır", "Hash'ten sonra eklenir"], 1, "Salt hazır tabloları ve toplu kırmayı engeller."],
  ["Dijital imza hangi anahtarla doğrulanır?", ["İmzalayanın Private Key'i", "İmzalayanın Public Key'i", "Doğrulayanın Private Key'i", "Simetrik anahtarla"], 1, "Public Key ile herkes doğrulayabilir."],
  ["RSA-PSS ne için kullanılır?", ["Şifreleme", "İmzalama", "Hash üretme", "Anahtar silme"], 1, "PSS imza şemasıdır; OAEP şifreleme içindir."],
  ["İmzalı mesaj için hangisi doğrudur?", ["İçerik gizlenir", "İçerik okunabilir; kaynak ve bütünlük doğrulanır", "İçerik silinir", "İmza anahtarı gönderilir"], 1, "İmza gizlilik sağlamaz."],
  ["Private Key sızarsa ne yapılmalıdır?", ["Önemsememek", "İptal edip yeni anahtar çifti üretmek", "Dosyayı yeniden adlandırmak", "Public Key'i silmek"], 1, "Sızan anahtara güvenilmez."],
  ["TLS hakkında hangisi doğrudur?", ["SSL 3.0 modern standarttır", "TLS 1.2/1.3 güncel; SSL tarihsel ve güvensizdir", "TLS yalnızca hash yapar", "TLS asla sertifika kullanmaz"], 1, "SSL 2.0/3.0 artık kullanılmamalıdır."],
  ["TLS el sıkışması sonunda elde edilen oturum anahtarı ne için kullanılır?", ["Sertifika imzalamak", "Veriyi simetrik olarak şifrelemek", "DNS çözmek", "Hash üretmek"], 1, "Oturum anahtarı AES-GCM gibi hızlı simetrik şifreleme içindir."],
  ["Tarayıcı sertifikada alan adı eşleşmediğini görürse ne yapmalıdır?", ["Sessizce devam etmeli", "Uyarı vermeli ve bağlantıya güvenmemelidir", "Sertifikayı düzeltmeli", "HTTP'ye dönmeli"], 1, "Alan adı kontrolü sahte sunucuyu engeller."],
  ["Hangi sıralama doğru güven zinciridir?", ["Sunucu → Root → Intermediate", "Root → Intermediate → Sunucu sertifikası", "Intermediate → Root → Sunucu", "Root → Sunucu → Intermediate"], 1, "Güven kökten yaprağa doğru imzalarla aktarılır."],
  ["Credential stuffing'e karşı en etkili önlem hangisidir?", ["Kısa parola", "Her site için benzersiz parola + MFA", "Parolayı sık paylaşmak", "Sadece büyük harf"], 1, "Tekrar kullanımı bitirmek ve MFA açmak saldırıyı etkisiz kılar."],
  ["Phishing-resistant MFA için en iyi örnek hangisidir?", ["SMS", "FIDO2/passkey", "E-posta kodu", "Güvenlik sorusu"], 1, "Kimlik bilgisi alan adına bağlıdır."],
  ["Büyük dosya için şifreleme yaklaşımı ne olmalıdır?", ["Doğrudan RSA", "Hibrit: AES ile veri, RSA/ECC ile AES anahtarı", "Sadece hash", "Base64"], 1, "Hız ve anahtar dağıtımı birlikte çözülür."],
  ["Hangisi hash ile şifreleme farkını doğru özetler?", ["İkisi de geri çözülür", "Hash geri döndürülemez ve doğrulama içindir; şifreleme anahtarla geri döndürülebilir ve gizlilik içindir", "Şifreleme sabit uzunlukludur", "Hash anahtar kullanır"], 1, "Amaç ve geri döndürülebilirlik farklıdır."],
];
export const EXAM_QUESTIONS: Q[] = toQ(EXAM_T);
