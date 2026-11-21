import { q, type Lesson } from "../types";

const lesson: Lesson = {
  id: 14,
  title: "Regular Expressions (Regex)",
  goal:
    "Metin içinde desen arayan Düzenli İfadeleri (Regular Expressions) öğrenmek; karakter sınıfları, niceleyiciler, çapalar, gruplar ve alternation kullanımını kavramak; e-posta, IP ve log analizi örnekleriyle siber güvenlikte kullanımını ve ReDoS riskini anlamak.",
  outcomes: [
    "Pattern (desen) kavramını ve temel regex sözdizimini açıklayabilir.",
    "Karakter sınıfları, quantifier ve anchor kullanarak desen yazabilir.",
    "Grup ve alternation yapılarını yorumlayabilir.",
    "E-posta, IP adresi ve log satırı için basit desenler yazabilir.",
    "ReDoS riskini ve nested quantifier tehlikesini açıklayabilir.",
  ],
  duration: "≈ 60 dakika",
  sections: [
    {
      title: "Regex nedir? Pattern kavramı",
      paras: [
        "**Düzenli ifade (Regular Expression, Regex)**, metin içinde belirli bir **deseni (pattern)** tanımlayan özel bir yazımdır. “İçinde rakam olan satırlar”, “e-posta biçimindeki metinler” veya “başarısız giriş denemesi satırları” gibi kuralları kısa bir ifadeyle yazarsınız; regex motoru metinde bu kurala uyan yerleri bulur.",
        "Regex bir programlama dili değil, bir **desen dili**dir. Python (`re` modülü), JavaScript, Bash araçları (`grep -E`), PowerShell (`-match`) ve birçok güvenlik aracı destekler. Ayrıntılarda farklılıklar vardır: bu modüldeki laboratuvar **JavaScript RegExp** motorunu kullanır; Python'un `re` modülüyle her konuda birebir aynı davranmaz (ör. isimli grup sözdizimi `(?<ad>...)` / `(?P<ad>...)` ve bazı özellikler farklıdır).",
      ],
    },
    {
      title: "Karakter eşleştirme, nokta ve özel karakterler",
      paras: [
        "Düz harfler kendileriyle eşleşir: `kedi` deseni “kedi” metnini bulur. **Nokta (`.`)** (satır sonu hariç) herhangi bir karakterle eşleşir. Özel anlamı olan karakterler — `. * + ? ^ $ ( ) [ ] { } | \\` — gerçek karakter olarak aranacaksa önüne ters eğik çizgi konur (kaçış / escape): `\\.` gerçek bir nokta demektir. Örneğin IP adresi yazarken `192\\.168` demek, noktaların gerçek nokta olmasını sağlar.",
      ],
    },
    {
      title: "Rakam ve harf sınıfları, Character Classes",
      paras: [
        "Kısayol sınıflar: `\\d` rakam (0-9), `\\w` harf/rakam/alt çizgi, `\\s` boşluk karakteri. Büyük harfli olanlar tersidir: `\\D`, `\\W`, `\\S`. Köşeli parantezle kendi sınıfınızı yazarsınız: `[abc]` a, b veya c; `[a-z]` küçük harf aralığı; `[A-Za-z0-9]`; `[^0-9]` rakam **olmayan** herhangi bir karakter (köşeli parantez içindeki `^` olumsuzlama anlamındadır).",
      ],
    },
    {
      title: "Quantifiers (niceleyiciler)",
      paras: ["Bir öğenin kaç kez tekrar edeceğini belirler:"],
      bullets: [
        "`*` sıfır veya daha fazla; `+` bir veya daha fazla; `?` sıfır veya bir.",
        "`{3}` tam 3 kez; `{2,5}` 2 ile 5 arası; `{2,}` en az 2.",
        "Varsayılan olarak niceleyiciler **açgözlüdür (greedy)**: mümkün olan en uzun eşleşmeyi alır. Sonuna `?` eklenirse (`.*?`) tembel (lazy) olur.",
        "Örnek: `\\d{1,3}` 1 ila 3 haneli bir sayı.",
      ],
    },
    {
      title: "Anchors (çapalar)",
      paras: [
        "Çapalar karakter değil, **konum** eşleştirir. `^` satır/metin başı, `$` satır/metin sonu, `\\b` kelime sınırı demektir. `^\\d+$` yalnızca rakamlardan oluşan metni eşleştirir; çapa olmadan `\\d+` herhangi bir yerdeki rakam dizisini bulur. Doğrulama (validation) yaparken çoğunlukla `^` ve `$` kullanılmalıdır; aksi halde metnin yalnızca bir kısmı eşleşse bile doğrulama başarılı görünür.",
      ],
    },
    {
      title: "Gruplar ve Alternation",
      paras: [
        "Parantez `( )` ifadeleri **gruplar** ve eşleşen kısmı yakalar (capture): `(\\d{2}):(\\d{2})` saat ve dakikayı ayrı gruplarda tutar. `(?:...)` yakalamayan gruptur. **Alternation (`|`)** “veya” anlamındadır: `FAILED|ERROR|DENIED`. Grupla birlikte: `(http|https)://`.",
      ],
    },
    {
      title: "E-posta ve IP adresi örnekleri",
      paras: [
        "Basit e-posta deseni: `[\\w.+-]+@[\\w-]+(\\.[\\w-]+)+`. Gerçek dünyada e-posta biçimi çok karmaşıktır; regex yalnızca ilk filtredir, doğrulama için ek kontroller (ör. onay bağlantısı) gerekir.",
        "IPv4 deseni (basit): `\\b\\d{1,3}(\\.\\d{1,3}){3}\\b`. Bu desen `999.999.999.999` metnini de eşleştirir; çünkü her bölümün 0–255 olduğunu garanti etmez. Kesin doğrulama için eşleşmeden sonra sayı aralıkları ayrıca kontrol edilir veya daha karmaşık bir desen kullanılır.",
      ],
    },
    {
      title: "Log analizi ve Regex'in siber güvenlikte kullanımı",
      paras: [
        "Güvenlik analistleri regex'i log satırlarından IP, kullanıcı adı, zaman damgası ve hata türü ayıklamak için kullanır. SIEM sorguları, IDS/IPS imzaları, WAF kuralları, `grep` ve veri sızıntısı (DLP) tarayıcıları regex tabanlıdır. Örnek: `Failed password for (\\w+) from (\\d+\\.\\d+\\.\\d+\\.\\d+)` deseni bir SSH logundan kullanıcıyı ve kaynak IP'yi çıkarır.",
        "Uyarı: Regex tabanlı filtreler yalnızca bilinen kalıpları yakalar; tek başına güvenlik önlemi sayılmamalıdır (ör. girdi doğrulamada beyaz liste yaklaşımı daha güvenlidir).",
      ],
    },
    {
      title: "ReDoS kavramına giriş",
      paras: [
        "**ReDoS (Regular Expression Denial of Service)**, kötü yazılmış bir desenin belirli girdilerde katlanarak artan sürede çalışıp sunucuyu kilitlemesidir. Sebep **catastrophic backtracking**: motor eşleşmeyi bulamayınca geri dönüp (backtrack) tüm olası bölünmeleri dener. İç içe niceleyiciler (`(a+)+`, `(.*)*`) veya örtüşen alternatifler (`(a|aa)+`) tipik riskli yapılardır.",
        "Korunma: iç içe niceleyicilerden kaçının, girdi uzunluğunu sınırlayın, zaman aşımı olan veya doğrusal zamanlı regex motorları kullanın, desenleri test edin. Bu derste tehlikeli desenler **gerçekten çalıştırılmaz**; adım sayısı matematiksel bir simülasyonla gösterilir.",
      ],
    },
  ],
  terms: [
    { tr: "Düzenli ifade", en: "Regular Expression", desc: "Metindeki deseni tanımlayan yazım." },
    { tr: "Desen", en: "Pattern", desc: "Aranacak kuralı anlatan ifade." },
    { tr: "Niceleyici", en: "Quantifier", desc: "Öğenin kaç kez tekrar edeceğini belirten simge." },
    { tr: "Çapa", en: "Anchor", desc: "Konum eşleştiren simge (^, $, \\b)." },
    { tr: "Grup", en: "Group", desc: "Parantezle oluşturulan ve eşleşmeyi yakalayan bölüm." },
    { tr: "Alternation", en: "Alternation", desc: "| ile 'veya' seçeneği." },
    { tr: "Açgözlü", en: "Greedy", desc: "Mümkün olan en uzun eşleşmeyi yakalayan davranış." },
    { tr: "Geri izleme", en: "Backtracking", desc: "Eşleşme başarısız olunca motorun önceki seçeneklere dönmesi." },
    { tr: "ReDoS", en: "ReDoS", desc: "Regex kaynaklı hizmet aksatma saldırısı." },
  ],
  examples: [
    { title: "Telefon rehberinde arama", text: "“05” ile başlayan 11 haneli numaraları bulmak: `^05\\d{9}$`." },
    { title: "SSH log taraması", text: "`Failed password for .* from (\\d+\\.\\d+\\.\\d+\\.\\d+)` ile saldırgan IP'lerini toplamak." },
    { title: "Form doğrulama", text: "Bir web formunda e-posta alanının `@` ve alan adı içerip içermediğini hızlıca kontrol etmek." },
  ],
  code: [
    {
      title: "Python re modülü ile IP bulma",
      lang: "python",
      code: String.raw`import re

log = "Failed password for root from 203.0.113.9 port 22"
desen = r"\b(\d{1,3}(?:\.\d{1,3}){3})\b"

sonuc = re.search(desen, log)
if sonuc:
    print("Kaynak IP:", sonuc.group(1))   # 203.0.113.9`,
      note: "Başındaki `r` ham (raw) metin anlamına gelir; ters eğik çizgilerin kaçış olarak yorumlanmasını engeller.",
    },
    {
      title: "Sık kullanılan desenler",
      lang: "text",
      code: String.raw`Rakam dizisi            \d+
Yalnızca rakamlar       ^\d+$
Basit e-posta           [\w.+-]+@[\w-]+(\.[\w-]+)+
IPv4 (biçim kontrolü)   \b\d{1,3}(\.\d{1,3}){3}\b
Saat (SS:DD)            ([01]\d|2[0-3]):[0-5]\d
Log seviyesi            ERROR|WARN|FAILED`,
    },
  ],
  scenario: {
    title: "Uygulama senaryosu: SSH log analizi",
    text: "Sunucudan alınan bir log çıktısında başarısız giriş denemeleri var. Göreviniz bu satırları ve satırlardaki IP adreslerini regex ile ayıklamak.",
    tasks: [
      "Hazır örnekler arasından “Başarısız giriş (log)” desenini seçin ve eşleşme sayısını okuyun.",
      "Deseni değiştirerek yalnızca IP adreslerini eşleştirin; ardından gruplarla kullanıcı adını da yakalayın.",
      "Çapa (^ $) ekleyip kaldırarak doğrulama davranışındaki farkı gözlemleyin.",
      "ReDoS simülasyonunda girdi uzunluğunu artırarak adım sayısının nasıl patladığını inceleyin.",
    ],
  },
  summary: [
    "Regex, metindeki desenleri tanımlayan güçlü bir dildir; motorlar arasında farklar olabilir.",
    "Karakter sınıfları, niceleyiciler, çapalar ve gruplar temel yapı taşlarıdır.",
    "Doğrulamada ^ ve $ çapalarını unutmayın.",
    "Log analizi ve tespit kurallarında regex çok yaygındır.",
    "İç içe niceleyiciler ReDoS riskini doğurur; girdi uzunluğunu sınırlayın.",
  ],
  quiz: [
    q(
      "`^\\d{3}$` deseni hangi metinle eşleşir?",
      ["12", "123", "1234", "abc"],
      1,
      "Çapalar nedeniyle metin başından sonuna tam olarak 3 rakamdan oluşmalıdır.",
    ),
    q(
      "Metin: \"a1b22c333\". `\\d+` deseni (global) kaç eşleşme bulur?",
      ["3", "6", "1", "9"],
      0,
      "Ardışık rakam dizileri: \"1\", \"22\", \"333\" → 3 eşleşme.",
    ),
    q(
      "IP adresi aramak için `192.168.1.1` deseni yazılırsa hangi sorun oluşur?",
      [
        "Noktalar herhangi bir karakterle eşleşir; \"192x168y1z1\" de eşleşir",
        "Hiçbir IP ile eşleşmez",
        "Regex hata verir",
        "Yalnızca sayılar eşleşir",
      ],
      0,
      "Nokta özel karakterdir. Gerçek nokta için `\\.` yazılmalıdır: `192\\.168\\.1\\.1`.",
    ),
    q(
      "Aşağıdaki desenlerden hangisi ReDoS açısından en riskli yapıdadır?",
      ["^[a-z]+$", "^\\d{3}-\\d{4}$", "^(a+)+$", "ERROR|WARN"],
      2,
      "İç içe niceleyici `(a+)+`, eşleşmeyen girdilerde katlanarak artan geri izleme (catastrophic backtracking) üretir.",
    ),
    q(
      "Bir kullanıcı adı doğrulamasında `[a-z]+` deseni çapasız kullanılıyor. Girdi `admin<script>` ise sonuç ne olur?",
      [
        "Eşleşme bulunmaz",
        "\"admin\" kısmı eşleşir ve doğrulama yanlışlıkla başarılı sayılabilir",
        "Regex hata verir",
        "Girdi otomatik temizlenir",
      ],
      1,
      "Çapasız desen metnin bir parçasını bulur. Tam doğrulama için `^[a-z]+$` kullanılmalıdır.",
    ),
  ],
};

export default lesson;
