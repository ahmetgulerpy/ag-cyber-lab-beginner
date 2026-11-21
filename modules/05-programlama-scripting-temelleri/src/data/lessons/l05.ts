import { q, type Lesson } from "../types";

const lesson: Lesson = {
  id: 5,
  title: "Döngüler",
  goal:
    "Aynı işlemin birden çok kez tekrarlanmasını sağlayan for ve while döngülerini, range(), break ve continue deyimlerini öğrenmek ve otomasyon senaryolarında kullanmak.",
  outcomes: [
    "for ve while döngülerinin ne zaman tercih edileceğini açıklayabilir.",
    "range(başla, bitir, adım) ifadesinin ürettiği değerleri tahmin edebilir.",
    "break ve continue deyimlerinin akışa etkisini yorumlayabilir.",
    "Sonsuz döngü hatasını fark edip düzeltebilir.",
    "İç içe döngülerin kaç kez çalışacağını hesaplayabilir.",
  ],
  duration: "≈ 45 dakika",
  sections: [
    {
      title: "Döngü (Loop) nedir?",
      paras: [
        "**Döngü**, bir kod bloğunun bir koşul sağlandığı sürece veya belirli sayıda tekrar edilmesini sağlar. 1000 log satırını okumak için 1000 satır kod yazmak yerine, aynı kodu bir kez yazıp döngüyle 1000 kez çalıştırırız.",
        "Bir döngüde her tekrara **iterasyon (iteration)** denir. Döngü gövdesi girintili yazılır.",
      ],
    },
    {
      title: "for döngüsü",
      paras: [
        "`for` döngüsü, bir dizi (liste, metin, range) üzerindeki her eleman için gövdeyi bir kez çalıştırır: `for port in [22, 80, 443]:`. Tekrar sayısı baştan bellidir, bu yüzden “şu koleksiyonun her elemanı için” ifadesi kullanıldığında en doğal seçimdir.",
      ],
    },
    {
      title: "range() fonksiyonu",
      paras: [
        "`range()` bir sayı dizisi üretir. `range(5)` → 0,1,2,3,4. `range(2, 6)` → 2,3,4,5. `range(0, 10, 3)` → 0,3,6,9. **Bitiş değeri dahil değildir**; bu, yeni başlayanların en sık takıldığı noktadır. Üçüncü parametre adımdır (step); negatif olursa geriye sayar: `range(10, 0, -2)`.",
      ],
    },
    {
      title: "while döngüsü",
      paras: [
        "`while` döngüsü koşul True olduğu sürece tekrar eder. Kaç kez tekrar edeceği önceden bilinmeyen durumlarda uygundur: “doğru parola girilene kadar sor”, “dosya bitene kadar oku”. Koşulu etkileyen değişkenin gövde içinde güncellenmesi gerekir; aksi halde döngü sonsuza kadar sürer.",
      ],
    },
    {
      title: "break ve continue",
      paras: [
        "`break` döngüyü tamamen sonlandırır. `continue` o iterasyonun kalanını atlayıp bir sonrakine geçer. Örneğin 1–100 arası portlar taranırken açık port bulununca arama bırakılacaksa `break`, geçersiz bir satır atlanacaksa `continue` kullanılır.",
      ],
    },
    {
      title: "Sonsuz döngü",
      paras: [
        "Sonlanmayan döngüye **sonsuz döngü (infinite loop)** denir. Hatalı olarak oluştuğunda program donar ve işlemciyi tüketir. Bazen kasıtlı kullanılır (sunucunun sürekli istek dinlemesi: `while True:` + `break` koşulu). Güvenlik açısından sınırsız deneme döngüleri (deneme sayısı sınırı olmayan parola sorma) risklidir; her zaman bir üst sınır veya çıkış koşulu tanımlayın.",
      ],
    },
    {
      title: "İç içe döngüler ve otomasyon",
      paras: [
        "Bir döngünün içinde başka bir döngü olabilir. Dıştaki 3, içteki 4 kez dönüyorsa içteki gövde toplam 12 kez çalışır. IP aralığı × port listesi taraması buna örnektir. İç içe döngülerde çalışma sayısı hızla büyür; bu yüzden performansa dikkat edilmelidir.",
        "Otomasyonda döngüler; log satırlarını okuma, dosya listesini işleme, IP listesini kontrol etme, birden fazla sunucuya aynı işlemi uygulama gibi işlerin merkezindedir.",
      ],
    },
  ],
  terms: [
    { tr: "Döngü", en: "Loop", desc: "Bir kod bloğunu tekrar tekrar çalıştıran yapı." },
    { tr: "İterasyon", en: "Iteration", desc: "Döngünün her bir tekrarı." },
    { tr: "Sayaç", en: "Counter", desc: "Tekrar sayısını tutan değişken." },
    { tr: "Sonsuz döngü", en: "Infinite Loop", desc: "Bitiş koşulu hiç sağlanmayan döngü." },
    { tr: "Adım", en: "Step", desc: "range() ile sayaçların ne kadar artacağı." },
    { tr: "Gövde", en: "Body", desc: "Döngünün içinde tekrar edilen girintili kod." },
  ],
  examples: [
    { title: "Sınıf yoklaması", text: "Öğretmen listedeki her öğrenci için ismi okur ve işaretler: klasik bir for döngüsü." },
    { title: "Parola deneme hakkı", text: "Kullanıcı doğru parolayı girene veya 3 hakkı bitene kadar sorulur: while + deneme sayacı." },
    { title: "Ağ keşfi", text: "192.168.1.1'den 192.168.1.254'e kadar her IP'ye ping atmak: range ile for döngüsü (yalnızca yetkili ağlarda!)." },
  ],
  code: [
    {
      title: "for ve range",
      lang: "python",
      code: `toplam = 0
for i in range(1, 6):
    toplam = toplam + i
    print("i =", i, "toplam =", toplam)
# Çıktı: toplam 15 olur (1+2+3+4+5)`,
    },
    {
      title: "while, continue ve break",
      lang: "python",
      code: `deneme = 0
while deneme < 10:
    deneme += 1
    if deneme % 2 == 0:
        continue          # çift sayıları atla
    if deneme > 7:
        break             # 7'den sonra bırak
    print("deneme", deneme)`,
      note: "Çıktı: 1, 3, 5, 7. `deneme += 1` satırı olmasaydı döngü sonsuza kadar sürerdi.",
    },
  ],
  scenario: {
    title: "Uygulama senaryosu: Port aralığı tarama mantığı",
    text: "Yetkili bir laboratuvar ortamında 20'den 30'a kadar portlar kontrol edilecek. 25 numaralı port “filtrelenmiş” sayılacak ve atlanacak; 28 numaralı port bulunduğunda tarama duracak.",
    tasks: [
      "Döngü simülatöründe başlangıç 20, bitiş 30 (dahil değil), adım 1 olarak çalıştırın.",
      "“continue koşulu” kutusuna 25, “break koşulu” kutusuna 28 yazıp adım adım izleyin.",
      "Adımı 2 yaparak hangi portların taranacağını önceden tahmin edin, sonra doğrulayın.",
      "while türünde artış satırı olmayan bir döngünün neden tehlikeli olduğunu yorumlayın (simülatör güvenlik sınırı uygular).",
    ],
  },
  summary: [
    "for: belirli bir koleksiyon/aralık üzerinde tekrar; while: koşul sürdükçe tekrar.",
    "range(a, b, s) a'dan başlar, b'ye ulaşmadan biter, s kadar artar.",
    "break döngüyü bitirir, continue sıradaki iterasyona geçer.",
    "Sonsuz döngüleri önlemek için sayaç güncelleyin ve üst sınır koyun.",
    "İç içe döngülerin çalışma sayısı çarpılarak bulunur.",
  ],
  quiz: [
    q(
      "`for i in range(3, 8):` döngüsü kaç kez çalışır ve son i değeri nedir?",
      ["5 kez, son değer 7", "5 kez, son değer 8", "6 kez, son değer 8", "8 kez, son değer 7"],
      0,
      "range(3, 8) → 3,4,5,6,7. Bitiş değeri (8) dahil değildir; toplam 5 değer üretilir.",
    ),
    q(
      "Aşağıdaki kodun çıktısı nedir?\n\nfor i in range(1, 6):\n    if i == 3:\n        continue\n    print(i, end=' ')",
      ["1 2 3 4 5", "1 2", "1 2 4 5", "3"],
      2,
      "i == 3 olduğunda continue ile o iterasyonun geri kalanı (print) atlanır.",
    ),
    q(
      "Aşağıdaki döngünün sorunu nedir?\n\nsayac = 0\nwhile sayac < 5:\n    print(sayac)",
      [
        "Sorun yok, 5 kez çalışır",
        "sayac hiç artmadığı için sonsuz döngüye girer",
        "while kelimesi yanlış yazılmış",
        "print kullanılamaz",
      ],
      1,
      "Koşulu etkileyen `sayac` güncellenmiyor. `sayac += 1` eklenmelidir.",
    ),
    q(
      "Dış döngü 4, iç döngü 5 kez çalışıyor. İç gövde toplam kaç kez çalışır?",
      ["9", "20", "4", "5"],
      1,
      "İç içe döngülerde çalışma sayısı çarpılır: 4 × 5 = 20.",
    ),
    q(
      "Kullanıcıya en fazla 3 parola denemesi hakkı verilecek. Hangi yaklaşım en güvenlidir?",
      [
        "while True: parola sor (çıkış yok)",
        "for deneme in range(3): parola sor; doğruysa break",
        "while parola != dogru: parola sor",
        "for deneme in range(1000000): parola sor",
      ],
      1,
      "Deneme sayısı sınırlı olmalıdır. Sınırsız veya çok büyük sınırlı döngüler kaba kuvvet (brute force) saldırılarına açık bırakır.",
    ),
  ],
};

export default lesson;
