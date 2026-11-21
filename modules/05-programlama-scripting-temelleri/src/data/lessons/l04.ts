import { q, type Lesson } from "../types";

const lesson: Lesson = {
  id: 4,
  title: "Koşullu İfadeler",
  goal:
    "Programın verilere göre karar vermesini sağlayan if / elif / else yapılarını, karşılaştırma ve mantıksal operatörleri öğrenmek ve bunları güvenlik kontrollerinde kullanmak.",
  outcomes: [
    "if, elif ve else yapılarının çalışma sırasını açıklayabilir.",
    "Karşılaştırma operatörlerini doğru kullanabilir.",
    "AND, OR ve NOT operatörlerinin doğruluk tablosunu bilir.",
    "İç içe koşulları sadeleştirebilir.",
    "Parola ve yetki kontrolü gibi güvenlik senaryolarını koşullarla yazabilir.",
  ],
  duration: "≈ 45 dakika",
  sections: [
    {
      title: "Koşullu ifadeler nedir?",
      paras: [
        "**Koşullu ifade (Conditional Statement)**, bir koşulun doğru (`True`) veya yanlış (`False`) olmasına göre farklı kod bloklarını çalıştırır. Program böylece “şu durumdaysa şunu yap, değilse şunu yap” şeklinde karar verebilir.",
        "Python'da bloklar **girinti (indentation)** ile belirlenir. Koşul satırı `:` ile biter ve altındaki girintili satırlar o koşula aittir. Girinti hataları sık görülen bir başlangıç sorunudur.",
      ],
    },
    {
      title: "if, else ve elif",
      paras: [
        "`if` koşul doğruysa bloğu çalıştırır. `else` hiçbir koşul sağlanmazsa çalışan varsayılan daldır. `elif` (else if), birden fazla alternatifi sırayla denemenizi sağlar.",
        "**Önemli:** Python koşulları yukarıdan aşağıya sırayla değerlendirir ve ilk doğru olan bloğu çalıştırıp zincirden çıkar. Bu nedenle koşulların sırası sonucu değiştirebilir. Daha özel koşullar genel olanlardan önce yazılmalıdır.",
      ],
    },
    {
      title: "Karşılaştırma operatörleri",
      paras: ["Karşılaştırma operatörleri her zaman bir boolean (True/False) üretir:"],
      bullets: [
        "`==` eşit mi?   `!=` eşit değil mi?",
        "`>` büyük mü?   `<` küçük mü?",
        "`>=` büyük veya eşit mi?   `<=` küçük veya eşit mi?",
        "`in` bir koleksiyonun içinde mi? (`\"a\" in \"kara\"` → True)",
        "Sık hata: `=` (atama) ile `==` (karşılaştırma) karıştırmak.",
      ],
    },
    {
      title: "Mantıksal operatörler: AND, OR, NOT",
      paras: [
        "Birden fazla koşulu birleştirmek için kullanılırlar. `and`: **her iki** koşul doğruysa True. `or`: **en az biri** doğruysa True. `not`: sonucu tersine çevirir.",
        "Örnek: `uzunluk >= 8 and rakam_var` ifadesi, parolanın hem yeterince uzun hem de rakam içermesini ister. `or` ile yazılsaydı, yalnızca birinin sağlanması yeterli olurdu — bu, güvenlik kontrollerinde sık yapılan ve tehlikeli bir mantık hatasıdır.",
        "Python kısa devre (short-circuit) değerlendirmesi yapar: `A and B` ifadesinde A yanlışsa B hiç değerlendirilmez.",
      ],
    },
    {
      title: "İç içe koşullar",
      paras: [
        "Bir koşulun bloğu içinde başka bir koşul yazılabilir. Ancak çok fazla iç içe geçme kodu okunmaz hale getirir. Çoğu zaman `and` ile birleştirmek veya erken çıkış (guard clause) kullanmak daha temizdir.",
      ],
    },
    {
      title: "Koşullu ifadelerin güvenlik uygulamalarındaki yeri",
      paras: [
        "Güvenliğin büyük bölümü koşul kontrolüdür: kullanıcı doğrulandı mı? Yetkisi var mı? Girdi beklenen biçimde mi? Parola kurallara uyuyor mu? Hata sayısı eşiği aştı mı?",
        "Koşul hataları doğrudan zafiyet doğurur. Örneğin yetki kontrolünde `or` yerine `and` kullanmak ya da kontrolü atlayan bir `else` dalı bırakmak, yetkisiz erişime kapı açabilir. Güvenli tasarımda varsayılan davranış **reddetmektir** (deny by default): kural açıkça sağlanmadıkça erişim verilmez.",
      ],
    },
  ],
  terms: [
    { tr: "Koşul", en: "Condition", desc: "True veya False üreten ifade." },
    { tr: "Girinti", en: "Indentation", desc: "Python'da blokları belirleyen boşluklar." },
    { tr: "Karşılaştırma operatörü", en: "Comparison Operator", desc: "==, !=, <, >, <=, >= gibi karşılaştırma simgeleri." },
    { tr: "Mantıksal operatör", en: "Logical Operator", desc: "and, or, not – koşulları birleştiren operatörler." },
    { tr: "Kısa devre", en: "Short-circuit", desc: "Sonuç belli olunca kalan koşulun değerlendirilmemesi." },
    { tr: "Varsayılan red", en: "Deny by Default", desc: "Açıkça izin verilmedikçe erişimi reddetme ilkesi." },
  ],
  examples: [
    { title: "Sinema bileti", text: "Yaş >= 18 ise “yetişkin”, yaş >= 7 ise “çocuk”, değilse “ücretsiz”: elif zincirine tipik örnek." },
    { title: "ATM", text: "PIN doğru ve bakiye yeterliyse para ver; PIN yanlışsa deneme hakkını azalt; hak bittiyse kartı bloke et." },
    { title: "Güvenlik duvarı kuralı", text: "Kaynak IP engelli listedeyse reddet, değilse ve port 22 ise yalnızca yönetici ağından izin ver." },
  ],
  code: [
    {
      title: "if / elif / else",
      lang: "python",
      code: `puan = 72

if puan >= 90:
    print("Pekiyi")
elif puan >= 70:
    print("İyi")
elif puan >= 50:
    print("Orta")
else:
    print("Tekrar çalış")`,
      note: "puan = 72 için ilk doğru koşul `puan >= 70` olduğundan “İyi” yazılır; sonraki koşullar değerlendirilmez.",
    },
    {
      title: "Parola kontrolü (mantıksal operatörler)",
      lang: "python",
      code: `parola = "Merhaba2024"
uzun_mu = len(parola) >= 8
rakam_var = any(c.isdigit() for c in parola)
buyuk_var = any(c.isupper() for c in parola)

if uzun_mu and rakam_var and buyuk_var:
    print("Parola güçlü")
elif uzun_mu and (rakam_var or buyuk_var):
    print("Parola orta")
else:
    print("Parola zayıf")`,
    },
  ],
  scenario: {
    title: "Uygulama senaryosu: Parola güvenlik kriterleri",
    text: "Bir kayıt formu parolayı üç kritere göre değerlendirecek: en az 8 karakter, en az bir rakam ve en az bir büyük harf. Sonuç “güçlü”, “orta” veya “zayıf” olarak dönecek.",
    tasks: [
      "Simülatörde farklı parolalar girerek hangi koşulun çalıştığını izleyin.",
      "Parolayı yalnızca 1 karakter kısaltıp sonucun nasıl değiştiğini gözlemleyin.",
      "Koşul sırasını değiştirirseniz (zayıf kontrolünü başa alırsanız) ne olur? Düşünün.",
      "Hesap kilitleme kuralını (ardışık hata ≥ 5) ve 2 adımlı doğrulamayı da deneyin.",
    ],
  },
  summary: [
    "Koşullar True/False değerine göre farklı blokları çalıştırır.",
    "elif zincirinde ilk doğru koşul çalışır, kalanlar atlanır.",
    "`==` karşılaştırır, `=` atar; ikisini karıştırmayın.",
    "and → ikisi de doğru, or → biri doğru, not → tersine çevirir.",
    "Güvenli tasarımda varsayılan davranış reddetmektir.",
  ],
  quiz: [
    q(
      "Aşağıdaki kod ekrana ne yazar?\n\nx = 15\nif x > 20:\n    print(\"A\")\nelif x > 10:\n    print(\"B\")\nelse:\n    print(\"C\")",
      ["A", "B", "C", "B ve C"],
      1,
      "x > 20 yanlış; x > 10 doğru olduğundan “B” yazılır ve zincir sona erer.",
    ),
    q(
      "`uzun_mu = True`, `rakam_var = False` ise `uzun_mu and rakam_var` sonucu nedir?",
      ["True", "False", "None", "Hata"],
      1,
      "`and` için iki taraf da True olmalıdır; biri False olduğundan sonuç False'tur.",
    ),
    q(
      "Bir yönetici paneline giriş için hem doğru parola hem de 2FA kodu gerekir. Hangi koşul doğru ve güvenlidir?",
      [
        "if parola_dogru or ikifa_dogru:",
        "if parola_dogru and ikifa_dogru:",
        "if not parola_dogru and ikifa_dogru:",
        "if parola_dogru = ikifa_dogru:",
      ],
      1,
      "İki şartın da sağlanması için `and` gerekir. `or` yalnızca birine bakar ve güvenlik zafiyeti yaratır.",
    ),
    q(
      "`if x = 5:` yazımının sorunu nedir?",
      [
        "Sorun yok",
        "Karşılaştırma için `==` kullanılmalıdır; `=` atama operatörüdür ve sözdizimi hatası verir",
        "5 sayısı kullanılamaz",
        "if yerine when yazılmalıdır",
      ],
      1,
      "Koşulda karşılaştırma yapılır: `if x == 5:`. `=` atama içindir.",
    ),
    q(
      "Hata sayısı eşiği: `if deneme >= 5: kilitle`. Deneme sayısı tam 5 olduğunda ne olur? Eşik `> 5` olsaydı ne olurdu?",
      [
        "İkisinde de kilitlenir",
        "`>= 5` ile kilitlenir; `> 5` ile 5. denemede kilitlenmez, 6'da kilitlenir",
        "`>= 5` kilitlemez, `> 5` kilitler",
        "İkisi de hiç kilitlemez",
      ],
      1,
      "`>=` eşit değeri de kapsar. `>` ise yalnızca eşiğin üstünü kapsar. Sınır değerlere dikkat edilmelidir.",
    ),
  ],
};

export default lesson;
