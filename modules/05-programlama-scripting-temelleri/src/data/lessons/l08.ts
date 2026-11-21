import { q, type Lesson } from "../types";

const lesson: Lesson = {
  id: 8,
  title: "Dosya İşlemleri",
  goal:
    "Programların kalıcı veriyle çalışmasını sağlayan dosya okuma, yazma ve ekleme işlemlerini öğrenmek; dosya modlarını, TXT/CSV/JSON biçimlerini, encoding kavramını ve dosya güvenliğini (Path Traversal'a giriş) kavramak.",
  outcomes: [
    "Dosya açma, okuma, yazma ve ekleme işlemlerini açıklayabilir.",
    "r, w, a ve x dosya modlarının farklarını bilir.",
    "TXT, CSV ve JSON biçimlerini ayırt edebilir.",
    "Mutlak ve göreli dosya yollarını yorumlayabilir.",
    "Path Traversal saldırısının mantığını ve temel korunma yöntemini açıklayabilir.",
  ],
  duration: "≈ 50 dakika",
  sections: [
    {
      title: "Dosya kavramı",
      paras: [
        "Değişkenler program kapanınca silinir. Verinin kalıcı olması için **dosya (file)** kullanırız: loglar, yapılandırmalar, raporlar, veri setleri dosyalarda saklanır. Bir dosyanın adı, uzantısı ve bulunduğu yol (path) vardır.",
        "Bir dosyayla çalışmanın adımları: **aç → oku/yaz → kapat**. Python'da `with open(...) as f:` yapısı dosyayı iş bitince otomatik kapatır; kaynak sızıntısını önler ve önerilen yöntemdir.",
      ],
    },
    {
      title: "Dosya okuma, yazma ve ekleme",
      paras: [
        "Okuma: `f.read()` tüm içeriği, `f.readline()` bir satırı, `for satir in f:` satır satır okur. Yazma: `f.write(\"metin\")`. Yazma modu (`w`) dosya varsa **içeriğini siler**; mevcut içeriği korumak için ekleme modu (`a`, append) kullanılır.",
      ],
    },
    {
      title: "Dosya modları",
      paras: ["`open(yol, mod)` ile belirtilen mod, dosyaya ne yapılabileceğini belirler:"],
      bullets: [
        "`r` (read): yalnızca okuma; dosya yoksa `FileNotFoundError`.",
        "`w` (write): yazma; dosya yoksa oluşturur, varsa içeriğini siler.",
        "`a` (append): sona ekleme; dosya yoksa oluşturur.",
        "`x` (exclusive): yalnızca dosya yoksa oluşturur; varsa hata verir (üzerine yazmayı önler).",
        "`b` (binary): ikili mod (`rb`, `wb`) – resim, program gibi metin olmayan dosyalar için.",
      ],
    },
    {
      title: "TXT, CSV ve JSON dosyaları",
      paras: [
        "**TXT:** düz metin; loglar için yaygın. **CSV (Comma-Separated Values):** virgülle ayrılmış tablo verisi; her satır bir kayıt. **JSON:** iç içe yapılandırılmış veri; yapılandırma ve API verisi için yaygın. Python'da CSV için `csv` modülü, JSON için `json` modülü kullanılır; bu modüller ayrıştırmayı doğru yapar, elle `split(\",\")` yazmaktan daha güvenlidir (tırnak içindeki virgüller gibi durumlar için).",
      ],
    },
    {
      title: "Dosya yolları",
      paras: [
        "**Mutlak yol (absolute path)** kökten başlar: `/home/ogrenci/notlar.txt` veya `C:\\Users\\Ogrenci\\notlar.txt`. **Göreli yol (relative path)** geçerli çalışma dizinine göredir: `veriler/log.txt`. `.` geçerli dizini, `..` bir üst dizini ifade eder. Linux/macOS ayırıcı `/`, Windows `\\` kullanır; `os.path` ve `pathlib` bu farkı yönetir.",
      ],
    },
    {
      title: "Encoding ve UTF-8",
      paras: [
        "Dosyada saklanan her karakter bir sayıya çevrilir; bu eşlemeye **encoding (kodlama)** denir. **UTF-8**, Türkçe karakterler (ç, ğ, ı, ö, ş, ü) dahil dünyadaki neredeyse tüm karakterleri destekleyen standarttır. Yanlış encoding ile açılan dosyada “Ã§” gibi bozuk karakterler görülür. Python'da `open(\"dosya.txt\", encoding=\"utf-8\")` yazmak güvenli bir alışkanlıktır.",
      ],
    },
    {
      title: "Dosya işlemlerinde güvenlik ve Path Traversal'a giriş",
      paras: [
        "Kullanıcıdan gelen bir dosya adını doğrulamadan kullanmak ciddi bir zafiyettir. **Path Traversal (Directory Traversal)**, saldırganın `../` dizilerini kullanarak izin verilen klasörün dışına çıkıp başka dosyalara erişmesidir. Örneğin uygulama `/uygulama/yukleme/` + kullanıcı_girdisi şeklinde yol oluşturuyorsa, `../../etc/passwd` gibi bir girdi hedef klasörün dışına taşabilir.",
        "Korunma: (1) Girdiyi doğrulayın ve yalnızca izinli dosya adlarına izin verin; (2) yolu normalize edip (`os.path.realpath`) sonucun izinli temel dizinle başladığını kontrol edin; (3) uygulamayı en düşük yetkiyle çalıştırın; (4) hata mesajlarında gerçek dosya yollarını göstermeyin.",
        "Diğer güvenlik ilkeleri: hassas verileri (parola, anahtar) düz metin dosyada saklamayın; geçici dosyaları güvenli oluşturun; dosya izinlerini (permission) en az yetki ilkesine göre ayarlayın. Bu derste yalnızca tarayıcı içindeki **sanal** dosya sistemiyle çalışacaksınız; gerçek bilgisayarınızın dosyalarına erişilmez.",
      ],
    },
  ],
  terms: [
    { tr: "Dosya", en: "File", desc: "Kalıcı olarak saklanan, adı olan veri birimi." },
    { tr: "Dosya yolu", en: "Path", desc: "Dosyanın dizin ağacındaki konumu." },
    { tr: "Ekleme modu", en: "Append Mode", desc: "Mevcut içeriği silmeden sona yazma." },
    { tr: "Kodlama", en: "Encoding", desc: "Karakterleri sayılara çeviren kural (ör. UTF-8)." },
    { tr: "CSV", en: "CSV", desc: "Virgülle ayrılmış tablo biçimi." },
    { tr: "Dizin gezinme saldırısı", en: "Path Traversal", desc: "../ ile izinli klasör dışına çıkma zafiyeti." },
    { tr: "En az yetki", en: "Least Privilege", desc: "Bir sürece yalnızca gereken yetkileri verme ilkesi." },
  ],
  examples: [
    { title: "Defter", text: "Yeni sayfa açmak (w), mevcut sayfanın altına not eklemek (a), sadece okumak (r): dosya modlarının günlük hayat karşılığı." },
    { title: "Sunucu logları", text: "Web sunucusu her isteği `access.log` dosyasına satır satır ekler (append). Analiz betikleri bu dosyayı okur." },
    { title: "Profil fotoğrafı yükleme", text: "Kullanıcı `../../ayarlar.conf` adında dosya göndermeye çalışırsa ve sunucu adı doğrulamazsa, dosya hedef klasörün dışına yazılabilir." },
  ],
  code: [
    {
      title: "Dosyaya yazma, ekleme ve okuma",
      lang: "python",
      code: `with open("notlar.txt", "w", encoding="utf-8") as f:
    f.write("İlk satır\\n")

with open("notlar.txt", "a", encoding="utf-8") as f:
    f.write("İkinci satır\\n")

with open("notlar.txt", "r", encoding="utf-8") as f:
    for satir in f:
        print(satir.strip())`,
      note: "`with` bloğu bittiğinde dosya otomatik kapanır.",
    },
    {
      title: "Güvensiz ve güvenli yol birleştirme",
      lang: "python",
      code: `import os
TEMEL = "/uygulama/yukleme"

def guvensiz(ad):
    return os.path.join(TEMEL, ad)         # ../ ile dışarı çıkılabilir!

def guvenli(ad):
    yol = os.path.realpath(os.path.join(TEMEL, ad))
    if not yol.startswith(TEMEL + os.sep):
        raise PermissionError("İzin verilmeyen yol")
    return yol`,
      note: "Bu kod yalnızca öğretim amaçlıdır. Laboratuvarda aynı mantığın sanal dosya sistemindeki simülasyonunu çalıştıracaksınız.",
    },
  ],
  scenario: {
    title: "Uygulama senaryosu: Sanal dosya sunucusu",
    text: "Bir uygulama, kullanıcıların yalnızca /home/ogrenci/belgeler klasöründeki dosyaları okumasına izin veriyor. Sistemde /etc/gizli.conf adında (sanal) hassas bir dosya da var.",
    tasks: [
      "Sanal dosya sisteminde yeni bir dosya oluşturun, içeriğini düzenleyin, kaydedin ve tekrar okuyun.",
      "Ekleme (append) ile dosyaya bir satır ekleyin; yazma ile içeriğin nasıl silindiğini karşılaştırın.",
      "Path Traversal laboratuvarında `rapor.txt` ile `../../../etc/gizli.conf` girdilerini güvensiz ve güvenli modda deneyin.",
      "Güvenli modun neden isteği reddettiğini yol çözümlemesinden okuyun.",
    ],
  },
  summary: [
    "Dosyalar veriyi kalıcı kılar; `with open()` güvenli kullanımdır.",
    "`w` içeriği siler, `a` sona ekler, `x` yalnızca yeni dosya oluşturur.",
    "TXT, CSV ve JSON farklı veri ihtiyaçlarına hizmet eder.",
    "UTF-8 Türkçe karakterler için standart kodlamadır.",
    "Kullanıcı girdisinden oluşturulan yollar doğrulanmazsa Path Traversal riski doğar.",
  ],
  quiz: [
    q(
      "Mevcut `log.txt` dosyasının içeriğini silmeden sonuna yeni satır eklemek için hangi mod kullanılmalıdır?",
      ["\"r\"", "\"w\"", "\"a\"", "\"x\""],
      2,
      "`a` (append) mevcut içeriği korur. `w` içeriği siler, `x` dosya varsa hata verir, `r` yalnızca okur.",
    ),
    q(
      "Uygulama `/var/uploads/` + kullanıcı_girdisi yolunu açıyor. Girdi `../../etc/passwd` ise ne olur?",
      [
        "Hiçbir şey olmaz",
        "Yol uploads klasörünün dışına taşabilir; bu Path Traversal zafiyetidir",
        "Dosya otomatik şifrelenir",
        "Python hata verir ve engeller",
      ],
      1,
      "`../` bir üst dizine çıkar. Doğrulama yapılmazsa izin verilen klasörün dışındaki dosyalara erişilebilir.",
    ),
    q(
      "Aşağıdakilerden hangisi Path Traversal'a karşı en etkili korunma yöntemidir?",
      [
        "Dosya adını büyük harfe çevirmek",
        "Yolu normalize edip sonucun izinli temel dizinin içinde kaldığını doğrulamak",
        "Hata mesajına tam yolu yazmak",
        "Dosyayı her zaman `w` modunda açmak",
      ],
      1,
      "Normalize edilmiş (çözümlenmiş) yolun izinli temel dizinle başladığını kontrol etmek, `../` hilelerini engeller.",
    ),
    q(
      "Türkçe karakterli bir dosya okunurken “Ã§” gibi bozuk karakterler görülüyor. En olası sebep nedir?",
      [
        "Dosya çok büyük",
        "Dosya UTF-8 ile kaydedilmiş ama farklı bir encoding ile okunuyor",
        "Dosya yolu göreli",
        "Python yüklü değil",
      ],
      1,
      "Karakter bozulmaları genellikle encoding uyuşmazlığından kaynaklanır. `encoding=\"utf-8\"` belirtmek çözümdür.",
    ),
    q(
      "Aşağıdaki kod çalıştırıldığında `rapor.txt` dosyasının önceki içeriğine ne olur?\n\nwith open(\"rapor.txt\", \"w\") as f:\n    f.write(\"Yeni\")",
      ["Korunur, Yeni sona eklenir", "Silinir, yalnızca Yeni kalır", "Dosya yeniden adlandırılır", "Hata oluşur"],
      1,
      "`w` modu dosyayı açarken içeriğini sıfırlar. Eklemek için `a` kullanılmalıdır.",
    ),
  ],
};

export default lesson;
