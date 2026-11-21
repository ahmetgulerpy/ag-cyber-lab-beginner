import { q, type Lesson } from "../types";

const lesson: Lesson = {
  id: 6,
  title: "Fonksiyonlar",
  goal:
    "Kodu yeniden kullanılabilir ve düzenli parçalara bölmeyi öğrenmek; parametre, argüman, return ve değişken kapsamı (scope) kavramlarını kavramak.",
  outcomes: [
    "Fonksiyon tanımlayıp çağırabilir.",
    "Parametre ile argüman arasındaki farkı açıklayabilir.",
    "return ile print arasındaki farkı ayırt edebilir.",
    "Yerel ve global değişkenlerin kapsamını yorumlayabilir.",
    "Modüler programlamanın güvenlik araçlarındaki faydalarını sıralayabilir.",
  ],
  duration: "≈ 45 dakika",
  sections: [
    {
      title: "Fonksiyon nedir?",
      paras: [
        "**Fonksiyon (Function)**, belirli bir işi yapan, isim verilmiş ve tekrar tekrar çağrılabilen kod bloğudur. Aynı kodu birçok yerde kopyalamak yerine bir kez yazıp adıyla çağırırız. Bu hem hata olasılığını azaltır hem de değişiklik gerektiğinde tek noktadan düzeltme imkânı verir (DRY: Don't Repeat Yourself).",
      ],
    },
    {
      title: "Fonksiyon tanımlama",
      paras: [
        "Python'da fonksiyon `def` anahtar kelimesiyle tanımlanır: `def selamla(isim):`. Gövde girintili yazılır. Tanımlamak fonksiyonu **çalıştırmaz**; yalnızca hazırlar. Çalıştırmak için `selamla(\"Ali\")` şeklinde çağırmak (call) gerekir.",
        "Fonksiyon adı, değişken adı kurallarına uyar ve ne yaptığını anlatmalıdır: `parola_gucunu_hesapla` iyi, `f1` kötü bir isimdir. İlk satırdan sonra yazılan `\"\"\"açıklama\"\"\"` metnine docstring denir.",
      ],
    },
    {
      title: "Parametreler ve argümanlar",
      paras: [
        "**Parametre (Parameter)** fonksiyon tanımındaki yer tutucu değişkendir; **argüman (Argument)** fonksiyon çağrılırken verilen gerçek değerdir. `def topla(a, b)` içindeki `a` ve `b` parametre, `topla(3, 4)` içindeki 3 ve 4 argümandır.",
        "Parametrelere varsayılan değer verilebilir: `def tara(ip, port=80)`. Argümanlar sıraya göre (positional) veya isimle (keyword: `tara(ip=\"10.0.0.5\", port=22)`) verilebilir.",
      ],
    },
    {
      title: "Return",
      paras: [
        "`return`, fonksiyonun sonucunu çağıran yere geri gönderir ve fonksiyonu sonlandırır. `print()` yalnızca ekrana yazar; değeri program içinde kullanamazsınız. Return edilmeyen fonksiyon `None` döndürür.",
        "Çoğu durumda hesaplama yapan fonksiyonların `print` yerine `return` kullanması gerekir; böylece sonuç başka fonksiyonlara veya koşullara aktarılabilir.",
      ],
    },
    {
      title: "Yerel ve global değişkenler",
      paras: [
        "Fonksiyon içinde oluşturulan değişkenler **yerel (local)** değişkendir ve yalnızca o fonksiyonda görünür; fonksiyon bitince yok olur. Fonksiyon dışında tanımlanan **global** değişkenler her yerden okunabilir; ancak fonksiyon içinde değiştirmek için `global` bildirimi gerekir. Genel kural: global değişkenleri mümkün olduğunca az kullanın, ihtiyaç duyulan değerleri parametre olarak verin.",
      ],
    },
    {
      title: "Yeniden kullanılabilirlik ve modüler programlama",
      paras: [
        "**Modüler programlama**, büyük bir programı her biri tek iş yapan küçük parçalara (fonksiyon, modül) ayırmaktır. Küçük parçalar daha kolay test edilir, okunur ve başkalarıyla paylaşılır.",
      ],
    },
    {
      title: "Güvenlik araçlarında fonksiyon kullanımı",
      paras: [
        "Bir log analiz aracı; `logu_oku()`, `satiri_ayristir()`, `saldiri_mi()` ve `rapor_yaz()` gibi fonksiyonlara bölünebilir. Girdi doğrulamayı tek bir fonksiyonda toplamak (`ip_gecerli_mi`) güvenlik açısından da faydalıdır: kural tek yerde güncellenir ve unutulan kontrol kalmaz.",
      ],
    },
  ],
  terms: [
    { tr: "Fonksiyon", en: "Function", desc: "Adı olan, tekrar çağrılabilen kod bloğu." },
    { tr: "Parametre", en: "Parameter", desc: "Fonksiyon tanımındaki yer tutucu değişken." },
    { tr: "Argüman", en: "Argument", desc: "Fonksiyon çağrılırken verilen gerçek değer." },
    { tr: "Dönüş değeri", en: "Return Value", desc: "Fonksiyonun çağırana gönderdiği sonuç." },
    { tr: "Kapsam", en: "Scope", desc: "Bir değişkenin görünür olduğu alan." },
    { tr: "Modül", en: "Module", desc: "Fonksiyonları gruplayan Python dosyası." },
    { tr: "Docstring", en: "Docstring", desc: "Fonksiyonun amacını anlatan üç tırnaklı açıklama." },
  ],
  examples: [
    { title: "Kahve makinesi", text: "Parametreler (boyut, şeker) verilir, makine içeride işlemi yapar ve bir kahve döndürür." },
    { title: "Hesap makinesi", text: "`topla`, `cikar`, `carp` fonksiyonları ayrı ayrı yazılır ve gerektiğinde çağrılır." },
    { title: "Güvenlik betiği", text: "`ip_gecerli_mi(ip)` fonksiyonu tüm programda aynı doğrulama kuralını uygular." },
  ],
  code: [
    {
      title: "Parametre ve return",
      lang: "python",
      code: `def parola_puani(parola, min_uzunluk=8):
    puan = 0
    if len(parola) >= min_uzunluk:
        puan += 1
    if any(c.isdigit() for c in parola):
        puan += 1
    if any(c.isupper() for c in parola):
        puan += 1
    return puan

sonuc = parola_puani("Merhaba2024")
print(sonuc)   # 3`,
    },
    {
      title: "Yerel ve global değişken",
      lang: "python",
      code: `deneme_sayisi = 0          # global

def hatali_giris():
    global deneme_sayisi   # global'i değiştirmek için gerekli
    deneme_sayisi += 1
    mesaj = "Hatalı giriş"  # yerel
    return mesaj

hatali_giris()
print(deneme_sayisi)       # 1
# print(mesaj)             # NameError: mesaj fonksiyon dışında yok`,
    },
  ],
  scenario: {
    title: "Uygulama senaryosu: Yeniden kullanılabilir doğrulama fonksiyonları",
    text: "Bir güvenlik aracı hem parola gücünü hem IP adresi biçimini hem de kullanıcı adı üretimini kontrol edecek. Her biri ayrı bir fonksiyon olacak.",
    tasks: [
      "Laboratuvarda üç fonksiyon şablonundan birini seçin ve parametrelere farklı argümanlar verin.",
      "Çağrı sırasında parametrelerin argümanlarla nasıl eşleştiğini izleyin.",
      "Dönen değeri (return) inceleyin; sonucun neden `print` ile aynı olmadığını açıklayın.",
      "Fonksiyonun yerel değişkenlerinin çağrıdan sonra erişilemez olduğuna dikkat edin.",
    ],
  },
  summary: [
    "Fonksiyonlar kodu yeniden kullanılabilir ve okunur kılar.",
    "Parametre tanımda, argüman çağrıda bulunur.",
    "return sonucu geri gönderir; print yalnızca ekrana yazar.",
    "Yerel değişkenler fonksiyon dışında görünmez.",
    "Güvenlik araçlarında doğrulama kurallarını fonksiyonlarda toplamak hatayı azaltır.",
  ],
  quiz: [
    q(
      "`def topla(a, b): return a + b` fonksiyonunda `topla(3, 4)` çağrısındaki 3 ve 4 için doğru terim hangisidir?",
      ["Parametre", "Argüman", "Değişken tipi", "Docstring"],
      1,
      "Çağrı sırasında verilen gerçek değerlere argüman denir; tanımdaki a ve b parametredir.",
    ),
    q(
      "Aşağıdaki kodun çıktısı nedir?\n\ndef f(x):\n    x * 2\n\nprint(f(5))",
      ["10", "5", "None", "Hata"],
      2,
      "Fonksiyon return kullanmadığı için None döndürür. Doğrusu `return x * 2` olmalıdır.",
    ),
    q(
      "Fonksiyon içinde tanımlanan `mesaj` değişkenine fonksiyon dışında erişilirse ne olur?",
      ["Değeri okunur", "NameError oluşur", "None döner", "Global olur"],
      1,
      "Yerel değişkenler fonksiyon bittiğinde yok olur; dışarıdan erişim NameError üretir.",
    ),
    q(
      "Bir güvenlik betiğinde IP doğrulama kodu 6 farklı yerde kopyalanmış. En iyi çözüm hangisidir?",
      [
        "Her kopyayı ayrı ayrı güncellemek",
        "Doğrulamayı tek bir `ip_gecerli_mi()` fonksiyonuna taşıyıp her yerde onu çağırmak",
        "Doğrulamayı kaldırmak",
        "Kodu yorum satırına almak",
      ],
      1,
      "Tek noktadan yönetilen fonksiyon, tutarlılık sağlar ve kuralda değişiklik gerektiğinde unutulan kopya kalmaz.",
    ),
    q(
      "`def tara(ip, port=80):` fonksiyonu için `tara(\"10.0.0.5\")` çağrısında port değeri ne olur?",
      ["None", "80", "Hata verir, port zorunludur", "0"],
      1,
      "Varsayılan değeri olan parametre, argüman verilmezse varsayılan değeri kullanır.",
    ),
  ],
};

export default lesson;
