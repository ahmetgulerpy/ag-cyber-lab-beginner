import { q, type Lesson } from "../types";

const lesson: Lesson = {
  id: 7,
  title: "Listeler ve Sözlükler",
  goal:
    "Birden çok veriyi düzenli biçimde saklamayı sağlayan liste, sözlük, tuple ve set veri yapılarını öğrenmek; eleman ekleme, silme, arama ve erişim işlemlerini yapabilmek.",
  outcomes: [
    "Liste, sözlük, tuple ve set yapılarının farklarını açıklayabilir.",
    "İndeks (index) ile liste elemanlarına erişebilir; negatif indeksi yorumlayabilir.",
    "Eleman ekleme, silme ve güncelleme işlemlerini yapabilir.",
    "Sözlükte anahtar-değer ilişkisini kullanabilir.",
    "Hangi problem için hangi veri yapısının uygun olduğuna karar verebilir.",
  ],
  duration: "≈ 50 dakika",
  sections: [
    {
      title: "Liste (List)",
      paras: [
        "**Liste**, sıralı ve değiştirilebilir (mutable) bir veri koleksiyonudur. Köşeli parantezle yazılır: `portlar = [22, 80, 443]`. Farklı tipte elemanlar tutabilir, aynı değer birden çok kez bulunabilir. Elemanlara sıra numarasıyla (indeks) erişilir.",
      ],
    },
    {
      title: "İndeksleme ve liste elemanlarına erişim",
      paras: [
        "Python'da indeks **0'dan** başlar: `portlar[0]` → 22. Negatif indeks sondan sayar: `portlar[-1]` → 443. Aralık alma (slicing): `portlar[0:2]` → ilk iki eleman (bitiş dahil değil). Var olmayan bir indekse erişmek `IndexError` üretir.",
      ],
    },
    {
      title: "Eleman ekleme ve silme",
      paras: ["Sık kullanılan liste metodları:"],
      bullets: [
        "`append(x)` sona ekler; `insert(i, x)` belirli konuma ekler.",
        "`remove(x)` değere göre ilk eşleşmeyi siler (yoksa `ValueError`).",
        "`pop(i)` indeksteki elemanı siler ve döndürür; indeks verilmezse sonuncuyu.",
        "`liste[i] = yeni` elemanı günceller.",
        "`len(liste)` eleman sayısı; `x in liste` arama.",
        "`sort()` sıralar.",
      ],
    },
    {
      title: "Sözlük (Dictionary) ve anahtar-değer ilişkisi",
      paras: [
        "**Sözlük**, veriyi **anahtar → değer (key → value)** çiftleri halinde saklar: `kullanici = {\"ad\": \"Ayşe\", \"rol\": \"analist\"}`. Elemanlara sıra numarasıyla değil anahtarla erişilir: `kullanici[\"rol\"]`. Anahtarlar benzersizdir; aynı anahtara yeniden değer atamak eskisinin üzerine yazar.",
        "Var olmayan bir anahtara `[]` ile erişmek `KeyError` verir; `.get(\"anahtar\", varsayilan)` ise güvenli bir alternatiftir. Sözlükler JSON verisinin Python karşılığıdır; API yanıtlarını işlerken çok kullanılır.",
      ],
    },
    {
      title: "Tuple ve Set",
      paras: [
        "**Tuple**, liste gibi sıralıdır ancak değiştirilemez (immutable): `koordinat = (10, 20)`. Sabit kalması gereken verilerde (ör. bir IP ve port çifti) kullanılır; değiştirmeye çalışmak `TypeError` verir.",
        "**Set (Küme)** sırasız ve yinelenmeyen elemanlar koleksiyonudur: `{1, 2, 3}`. Aynı eleman iki kez eklenirse yalnızca biri kalır. Tekrarlı verileri temizlemek (örneğin log'daki benzersiz IP'leri bulmak) ve kümeler arası işlem (kesişim, birleşim, fark) yapmak için idealdir.",
      ],
    },
    {
      title: "Veri yapılarının kullanım alanları",
      paras: [
        "Liste: sıralı veri, port listesi, satırlar. Sözlük: ilişkili bilgi, yapılandırma, sayaçlar (`{\"192.168.1.5\": 7}`). Tuple: sabit kayıtlar. Set: benzersiz değerler, hızlı üyelik testi, izinli/engelli listeler.",
        "Güvenlik örneği: log analizinde her IP adresinin başarısız giriş sayısı bir sözlükle tutulur; en çok deneme yapan IP'ler sıralanır. Engelli IP listesi set olarak tutulursa üyelik kontrolü çok hızlı yapılır.",
      ],
    },
  ],
  terms: [
    { tr: "Liste", en: "List", desc: "Sıralı, değiştirilebilir koleksiyon." },
    { tr: "Sözlük", en: "Dictionary", desc: "Anahtar-değer çiftlerinden oluşan koleksiyon." },
    { tr: "Demet", en: "Tuple", desc: "Sıralı ancak değiştirilemez koleksiyon." },
    { tr: "Küme", en: "Set", desc: "Sırasız, tekrarsız elemanlar koleksiyonu." },
    { tr: "İndeks", en: "Index", desc: "Elemanın listedeki sıra numarası (0'dan başlar)." },
    { tr: "Anahtar", en: "Key", desc: "Sözlükte değere erişim için kullanılan benzersiz etiket." },
    { tr: "Değiştirilebilir", en: "Mutable", desc: "Oluşturulduktan sonra içeriği değiştirilebilen." },
  ],
  examples: [
    { title: "Alışveriş listesi", text: "Sıralı ve eleman eklenip çıkarılabilen bir liste. Aynı ürün iki kez yazılabilir." },
    { title: "Telefon rehberi", text: "İsim anahtar, numara değerdir: sözlük mantığı. İsimle arama çok hızlıdır." },
    { title: "Engelli IP listesi", text: "Tekrarın anlamsız olduğu ve hızlı kontrol gereken bir küme (set) örneği." },
  ],
  code: [
    {
      title: "Liste işlemleri",
      lang: "python",
      code: `portlar = [22, 80, 443]
portlar.append(8080)       # [22, 80, 443, 8080]
portlar.insert(1, 21)      # [22, 21, 80, 443, 8080]
portlar.remove(80)         # [22, 21, 443, 8080]
print(portlar[0], portlar[-1])   # 22 8080
print(443 in portlar)            # True`,
    },
    {
      title: "Sözlük ile sayaç",
      lang: "python",
      code: `loglar = ["10.0.0.5", "10.0.0.9", "10.0.0.5", "10.0.0.5"]
sayac = {}
for ip in loglar:
    sayac[ip] = sayac.get(ip, 0) + 1
print(sayac)   # {'10.0.0.5': 3, '10.0.0.9': 1}

benzersiz = set(loglar)    # {'10.0.0.5', '10.0.0.9'}`,
      note: "`get(ip, 0)` anahtar yoksa 0 döndürür; böylece KeyError oluşmaz.",
    },
  ],
  scenario: {
    title: "Uygulama senaryosu: Hedef listesi ve sunucu envanteri",
    text: "Bir ekip, izlediği sunucuların IP adreslerini listede, her sunucunun bilgisini sözlükte tutuyor. Yinelenen kayıtlar set ile temizleniyor.",
    tasks: [
      "Liste sekmesinde 3 port ekleyin, birini silin ve bir elemanı güncelleyin.",
      "Sözlük sekmesinde `ad`, `ip`, `rol` anahtarlarını girin; var olmayan bir anahtarı arayın.",
      "Set sekmesine aynı değeri iki kez ekleyin ve sonucu gözlemleyin.",
      "Tuple sekmesinde elemanı değiştirmeyi deneyin ve hata mesajını okuyun.",
    ],
  },
  summary: [
    "Liste sıralı ve değiştirilebilir; indeks 0'dan başlar.",
    "Sözlük anahtar-değer çiftleri saklar; anahtarlar benzersizdir.",
    "Tuple değiştirilemez; set tekrarsızdır.",
    "`.get()` KeyError riskini azaltır.",
    "Doğru veri yapısını seçmek hem hız hem okunabilirlik sağlar.",
  ],
  quiz: [
    q(
      "`a = [10, 20, 30, 40]` için `a[-1]` ve `a[1]` değerleri sırasıyla nedir?",
      ["40 ve 20", "10 ve 30", "40 ve 10", "30 ve 20"],
      0,
      "Negatif indeks sondan sayar (-1 → son eleman). `a[1]` ikinci elemandır, çünkü indeks 0'dan başlar.",
    ),
    q(
      "`s = {1, 2, 2, 3, 3, 3}` kümesinde kaç eleman vardır?",
      ["6", "3", "2", "1"],
      1,
      "Set yinelenen elemanları tutmaz; yalnızca 1, 2 ve 3 kalır.",
    ),
    q(
      "`d = {\"ad\": \"Ali\"}` iken `d[\"yas\"]` çağrısı ne üretir?",
      ["None", "0", "KeyError", "\"\""],
      2,
      "Var olmayan anahtara `[]` ile erişmek KeyError verir. `d.get(\"yas\")` ise None döndürür.",
    ),
    q(
      "Bir logdaki her IP adresinin kaç kez göründüğünü saymak için en uygun yapı hangisidir?",
      [
        "Tuple",
        "Anahtarı IP, değeri sayı olan sözlük",
        "Yalnızca string",
        "Boş set",
      ],
      1,
      "Sayaç mantığı anahtar-değer ilişkisiyle doğal olarak modellenir: `sayac[ip] += 1`.",
    ),
    q(
      "`t = (1, 2, 3)` tuple'ında `t[0] = 99` yazılırsa ne olur?",
      ["t = (99, 2, 3) olur", "TypeError oluşur", "Eleman silinir", "Tuple liste olur"],
      1,
      "Tuple değiştirilemez (immutable). Atama denemesi TypeError verir.",
    ),
  ],
};

export default lesson;
