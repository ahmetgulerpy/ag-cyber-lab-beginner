import { q, type Lesson } from "../types";

const lesson: Lesson = {
  id: 3,
  title: "Değişkenler ve Veri Tipleri",
  goal:
    "Verinin bellekte nasıl adlandırılıp saklandığını anlamak; temel veri tiplerini (string, integer, float, boolean, None) tanımak ve tip dönüşümlerini güvenli biçimde kullanmak.",
  outcomes: [
    "Değişken (Variable) kavramını ve isimlendirme kurallarını açıklayabilir.",
    "String, int, float, bool ve None tiplerini ayırt edebilir.",
    "Tip dönüşümü (type casting) yapabilir ve dönüşüm hatalarını tahmin edebilir.",
    "Dinamik ve statik tip sistemini karşılaştırabilir.",
    "Farklı tiplerle işlem yapıldığında ortaya çıkan sonuçları öngörebilir.",
  ],
  duration: "≈ 45 dakika",
  sections: [
    {
      title: "Değişken (Variable) nedir?",
      paras: [
        "**Değişken**, bellekte bir değeri saklayan ve ona isimle erişmemizi sağlayan etikettir. Etiketli bir kutu gibi düşünebilirsiniz: kutunun adı değişkenin adı, içindeki şey değeridir. Değer sonradan değiştirilebilir; “değişken” adı buradan gelir.",
        "Python'da bir değişken `=` (atama operatörü) ile oluşturulur: `yas = 25`. Burada `=` matematikteki eşitlik değil, “sağdaki değeri soldaki isme ata” anlamına gelir. Eşitlik karşılaştırması için `==` kullanılır.",
      ],
    },
    {
      title: "Değişken isimlendirme kuralları",
      paras: ["Python'da bir değişken adı geçerli olmak için şu kurallara uymalıdır:"],
      bullets: [
        "Harf veya alt çizgi (`_`) ile başlamalıdır; rakamla başlayamaz (`1ad` geçersiz).",
        "Yalnızca harf, rakam ve alt çizgi içerebilir; boşluk ve `-` kullanılamaz.",
        "Büyük/küçük harf duyarlıdır: `Ad` ile `ad` farklı değişkenlerdir.",
        "Ayrılmış kelimeler (`if`, `for`, `class`, `True` vb.) isim olarak kullanılamaz.",
        "Okunabilirlik: anlamlı ve küçük harfli `snake_case` tercih edilir (`kullanici_adi`).",
      ],
    },
    {
      title: "Temel veri tipleri",
      paras: [
        "**String (str):** metin verisi. Tırnak içinde yazılır: `\"merhaba\"`. **Integer (int):** ondalıksız tam sayı: `42`. **Float:** ondalıklı sayı: `3.14`. **Boolean (bool):** yalnızca `True` veya `False`. **None / Null:** “değer yok” anlamına gelen özel değer.",
        "Bir değerin tipini `type()` fonksiyonuyla öğrenebilirsiniz: `type(3.14)` → `float`. Tip, o veri üzerinde hangi işlemlerin yapılabileceğini belirler: sayılar toplanabilir, metinler birleştirilebilir.",
        "Dikkat: `\"5\"` (string) ile `5` (integer) aynı şey değildir. Kullanıcıdan `input()` ile alınan veri her zaman string gelir; sayı olarak kullanmak için dönüştürmek gerekir.",
      ],
    },
    {
      title: "None / Null kavramı",
      paras: [
        "`None`, “henüz bir değer atanmadı” veya “değer bulunamadı” durumunu gösterir. Sıfır (`0`), boş metin (`\"\"`) ve `None` birbirinden farklıdır. Örneğin bir sözlükte bir anahtar bulunamazsa `.get()` metodu `None` döndürür. `None` üzerinde işlem yapmaya çalışmak yaygın bir hata kaynağıdır (`NoneType` hatası).",
      ],
    },
    {
      title: "Veri tipi dönüşümleri (Type Casting)",
      paras: [
        "Bir değeri bir tipten diğerine çevirmeye **tip dönüşümü** denir: `int(\"42\")` → `42`, `float(\"3.5\")` → `3.5`, `str(100)` → `\"100\"`, `bool(0)` → `False`.",
        "Dönüşüm her zaman başarılı olmaz: `int(\"abc\")` bir `ValueError` üretir. Kullanıcıdan gelen veriyi dönüştürürken hata yönetimi ve doğrulama şarttır; aksi halde program çöker ya da beklenmedik davranış gösterir.",
        "Boolean dönüşümünde kural: `0`, `0.0`, `\"\"` (boş metin), `None` ve boş koleksiyonlar `False`; diğer her şey `True` kabul edilir. Dikkat: `bool(\"False\")` değeri `True`'dur, çünkü metin boş değildir!",
      ],
    },
    {
      title: "Dinamik ve statik tip sistemi",
      paras: [
        "**Dinamik tipli** dillerde (Python, JavaScript) değişkenin tipi çalışma anında değere göre belirlenir; aynı değişkene sonradan farklı tipte değer atanabilir. **Statik tipli** dillerde (C, Java, C#) tip önceden bildirilir ve derleme sırasında denetlenir (`int sayi = 5;`).",
        "Python dinamik tipli olsa da **güçlü tiplidir**: `\"5\" + 3` ifadesini sessizce çevirmez, `TypeError` verir. Bazı dillerde (JavaScript) ise otomatik dönüşüm yapılır (`\"5\" + 3` → `\"53\"`) ve bu beklenmedik hatalara yol açabilir.",
      ],
    },
    {
      title: "Değişkenlerin program içindeki kullanımı",
      paras: [
        "Değişkenler girdiyi saklar, ara sonuçları tutar ve çıktıyı hazırlar. Siber güvenlikte örnekler: bir IP adresini `hedef_ip` içinde tutmak, başarısız giriş sayısını `deneme_sayisi` ile saymak, bir portun açık olup olmadığını `acik_mi` (bool) ile işaretlemek.",
        "Güvenlik ipucu: parola, anahtar ve token gibi hassas değerleri doğrudan kaynak koda değişken olarak yazmayın; ortam değişkenlerinden veya güvenli bir kasadan okuyun.",
      ],
    },
  ],
  terms: [
    { tr: "Değişken", en: "Variable", desc: "Bir değeri isimle saklayan bellek etiketi." },
    { tr: "Atama", en: "Assignment", desc: "`=` ile bir değişkene değer verme işlemi." },
    { tr: "Metin", en: "String", desc: "Tırnak içindeki karakter dizisi." },
    { tr: "Tam sayı", en: "Integer", desc: "Ondalık kısmı olmayan sayı." },
    { tr: "Ondalıklı sayı", en: "Float", desc: "Noktalı (ondalıklı) sayı." },
    { tr: "Mantıksal değer", en: "Boolean", desc: "Yalnızca True veya False." },
    { tr: "Boş değer", en: "None / Null", desc: "Değer yokluğunu temsil eden özel değer." },
    { tr: "Tip dönüşümü", en: "Type Casting", desc: "Bir değeri başka bir veri tipine çevirme." },
  ],
  examples: [
    {
      title: "Market fişi",
      text: "Ürün adı (string), adet (integer), birim fiyat (float) ve indirim var mı (boolean) – bir fişteki her bilgi farklı bir veri tipine karşılık gelir.",
    },
    {
      title: "Form girişi",
      text: "Web formuna yaş alanına “25” yazıldığında bu bir metindir. Yaş karşılaştırması yapmadan önce `int()` ile sayıya çevrilmelidir.",
    },
    {
      title: "Port taraması sonucu",
      text: "`port = 443` (int), `servis = \"https\"` (str), `acik = True` (bool), `banner = None` (cevap alınamadı).",
    },
  ],
  code: [
    {
      title: "Değişkenler ve tipler",
      lang: "python",
      code: `ad = "Ayşe"          # str
yas = 17             # int
boy = 1.68           # float
ogrenci_mi = True    # bool
telefon = None       # None

print(type(ad), type(yas), type(boy))
print(type(ogrenci_mi), type(telefon))`,
    },
    {
      title: "Tip dönüşümü ve tipik hata",
      lang: "python",
      code: `sayi_metni = "42"
print(sayi_metni + "1")        # "421"  (metin birleştirme)
print(int(sayi_metni) + 1)     # 43     (sayısal toplama)
print(bool("False"))           # True   (boş olmayan metin!)

print("yaş: " + 25)            # TypeError! str + int toplanamaz
print("yaş: " + str(25))       # Doğru kullanım`,
      note: "Son satırlardaki ilk ifade bilinçli olarak hata üretir; hatayı anlamak için laboratuvarda aynı işlemi deneyin.",
    },
  ],
  scenario: {
    title: "Uygulama senaryosu: Başarısız giriş sayacı",
    text: "Bir giriş sistemi her başarısız denemeyi sayıyor. Kullanıcı adı, deneme sayısı, hesabın kilitli olup olmadığı ve son giriş zamanı değişkenlerde tutulacak.",
    tasks: [
      "Laboratuvarda `kullanici` (str), `deneme` (int), `kilitli` (bool) ve `son_giris` (None) değişkenlerini tanımlayın.",
      "`deneme` değişkenine “5” (metin) değerini str tipinde atayıp `deneme + 1` işlemini deneyin; sonucu yorumlayın.",
      "`int()` dönüşümüyle sorunu çözün ve `bool()` dönüşümünün sonuçlarını inceleyin.",
      "Geçersiz bir değişken adı (ör. `1deneme`) girerek hata mesajını gözlemleyin.",
    ],
  },
  summary: [
    "Değişken, değere isimle erişmeyi sağlayan etikettir.",
    "İsimler harf/alt çizgiyle başlar, boşluk içermez, ayrılmış kelime olamaz.",
    "Temel tipler: str, int, float, bool ve None.",
    "Tip dönüşümü hata verebilir; kullanıcı girdisi her zaman doğrulanmalıdır.",
    "Python dinamik ama güçlü tiplidir; farklı tipler sessizce karıştırılmaz.",
  ],
  quiz: [
    q(
      "Aşağıdakilerden hangisi geçerli bir Python değişken adıdır?",
      ["2kullanici", "kullanici-adi", "kullanici_adi", "class"],
      2,
      "Alt çizgi kullanılabilir. Rakamla başlamak, tire içermek ve `class` gibi ayrılmış kelimeyi kullanmak geçersizdir.",
    ),
    q(
      "`x = input(\"Yaş: \")` satırında kullanıcı 20 yazıyor. `type(x)` sonucu nedir?",
      ["int", "float", "str", "bool"],
      2,
      "`input()` her zaman string döndürür. Sayı olarak kullanmak için `int(x)` gerekir.",
    ),
    q(
      "`print(\"Toplam: \" + 5)` kodu Python'da ne üretir?",
      ["Toplam: 5", "Toplam: 55", "TypeError hatası", "None"],
      2,
      "Python güçlü tiplidir; str ile int doğrudan toplanamaz. Doğrusu `\"Toplam: \" + str(5)`.",
    ),
    q(
      "`bool(\"False\")` ifadesinin sonucu nedir?",
      ["False", "True", "None", "Hata verir"],
      1,
      "Boş olmayan her metin True kabul edilir. Metnin ne yazdığı önemli değildir.",
    ),
    q(
      "Bir güvenlik aracında açık port sayısı tutulacak. Hangi tip ve değişken adı en uygundur?",
      [
        "acik_port_sayisi = 12  (int)",
        "acik_port_sayisi = \"12\" (str) ve üzerinde toplama yapmak",
        "acik port sayisi = 12",
        "acik_port_sayisi = None ve doğrudan 1 eklemek",
      ],
      0,
      "Sayma işlemi için int uygundur. Boşluklu isim geçersizdir; None'a 1 eklenemez; str ile sayısal işlem hata verir.",
    ),
  ],
};

export default lesson;
