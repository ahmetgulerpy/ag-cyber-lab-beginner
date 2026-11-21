import { q, type Lesson } from "../types";

const lesson: Lesson = {
  id: 10,
  title: "Python'a Giriş",
  goal:
    "Python'un sözdizimini, temel yapılarını ve siber güvenlikteki kullanım alanlarını öğrenmek; önceki derslerdeki kavramları Python ile birleştirerek küçük otomasyon betikleri yazabilmek.",
  outcomes: [
    "Python'un özelliklerini ve kullanım alanlarını sıralayabilir.",
    "print() ve input() ile temel girdi/çıktı işlemleri yapabilir.",
    "Değişken, koşul, döngü ve fonksiyonları tek bir betikte birleştirebilir.",
    "Python'un siber güvenlikteki rolünü örneklerle açıklayabilir.",
    "Basit bir otomasyon betiğinin akışını okuyabilir.",
  ],
  duration: "≈ 55 dakika",
  sections: [
    {
      title: "Python nedir?",
      paras: [
        "**Python**, okunabilirliği ön planda tutan, yüksek seviyeli, yorumlanan (interpreted) ve genel amaçlı bir programlama dilidir. Sözdizimi sade, topluluğu geniş ve kütüphane (library) zenginliği çok yüksektir. Bu özellikler Python'u başlangıç için ideal ve siber güvenlikte en yaygın dillerden biri yapar.",
      ],
    },
    {
      title: "Python'ın kullanım alanları",
      paras: ["Python birçok alanda kullanılır:"],
      bullets: [
        "Otomasyon ve betik yazma (dosya, log, sistem işleri).",
        "Web geliştirme (Django, Flask, FastAPI).",
        "Veri analizi ve yapay zekâ (pandas, NumPy, scikit-learn).",
        "Ağ programlama ve güvenlik araçları.",
        "Eğitim ve hızlı prototipleme.",
      ],
    },
    {
      title: "Kurulum ve çalışma ortamı",
      paras: [
        "Python'u resmî sitesi python.org'dan indirip kurabilirsiniz (Windows'ta kurulumda “Add Python to PATH” seçeneğini işaretlemeyi unutmayın). Linux ve macOS'ta çoğunlukla hazır gelir. Kurulumu `python --version` (veya `python3 --version`) komutuyla doğrularsınız.",
        "Çalışma yolları: **Etkileşimli kabuk (REPL)** – satır satır deneme; **betik dosyası** – `betik.py` dosyası oluşturup `python betik.py` ile çalıştırma; **IDE/kod editörleri** – VS Code, PyCharm. Bağımlılıkları projeye özel tutmak için **sanal ortam (virtual environment)** kullanılır: `python -m venv .venv`. Ek kütüphaneler `pip install paket` ile kurulur.",
      ],
    },
    {
      title: "Sözdizimi, print() ve input()",
      paras: [
        "Python'da bloklar girintiyle belirlenir (genelde 4 boşluk); noktalı virgül ve süslü parantez gerekmez. Yorum satırı `#` ile başlar. `print()` ekrana yazar: `print(\"Merhaba\", 42)`. `input()` kullanıcıdan metin alır ve **her zaman string** döndürür.",
        "Metin biçimlendirmede **f-string** çok kullanışlıdır: `print(f\"{ad} için {puan} puan\")`. Süslü parantez içine değişken veya ifade yazılabilir.",
      ],
    },
    {
      title: "Değişkenler, veri tipleri, koşullar, döngüler ve fonksiyonlar",
      paras: [
        "Önceki derslerde öğrendiğiniz her şey Python'da doğrudan uygulanır: `yas = int(input(\"Yaş: \"))`, `if/elif/else`, `for port in range(20, 30):`, `def fonksiyon(parametre): return ...`. Python ayrıca zengin hazır veri yapıları (list, dict, set, tuple) ve **list comprehension** gibi kısa yazımlar sunar: `kareler = [x*x for x in range(5)]`.",
        "Kütüphaneleri `import` ile kullanırsınız: `import socket`, `import hashlib`, `import re`, `import json`. Standart kütüphane Python ile birlikte gelir.",
      ],
    },
    {
      title: "Python ve siber güvenlik",
      paras: [
        "Python, siber güvenlikte hızlı prototip ve otomasyon için tercih edilir. Güvenlik topluluğunun pek çok açık kaynak aracı Python ile yazılmıştır.",
      ],
      bullets: [
        "Log analizi: başarısız girişleri ayıklama, anormallik tespiti.",
        "Ağ: port kontrolü, paket analizi (yalnızca yetkili ortamlarda).",
        "Hash ve kriptografi: dosya bütünlüğü doğrulama (`hashlib`).",
        "Web ve API testleri: isteklerin otomatikleştirilmesi (`requests`).",
        "Zararlı yazılım analizi ve otomatik raporlama.",
      ],
    },
    {
      title: "Python ile otomasyon",
      paras: [
        "Otomasyon betikleri tipik olarak şu kalıbı izler: girdiyi al → doğrula → işle → raporla. Örneğin bir klasördeki tüm log dosyalarını tarayıp “FAILED” içeren satırları sayan ve özet yazan betik 15 satırla yazılabilir.",
        "Önemli etik ve hukuki not: Ağ tarama, parola deneme veya sistemlere müdahale eden betikler yalnızca **yazılı izin verilen** veya kendi sahip olduğunuz laboratuvar ortamlarında çalıştırılmalıdır. İzinsiz kullanım suçtur.",
      ],
    },
  ],
  terms: [
    { tr: "Yorumlayıcı", en: "Interpreter", desc: "Python kodunu satır satır çalıştıran program." },
    { tr: "Kütüphane", en: "Library", desc: "Hazır fonksiyon ve araç koleksiyonu." },
    { tr: "Sanal ortam", en: "Virtual Environment", desc: "Projeye özel izole Python kurulumu." },
    { tr: "f-string", en: "f-string", desc: "Değişkenleri metne gömen biçimlendirme yazımı." },
    { tr: "Paket yöneticisi", en: "Package Manager (pip)", desc: "Python kütüphanelerini kuran araç." },
    { tr: "REPL", en: "REPL", desc: "Etkileşimli, satır satır çalıştırma kabuğu." },
    { tr: "Betik", en: "Script", desc: "Bir görevi otomatikleştiren .py dosyası." },
  ],
  examples: [
    { title: "Toplu yeniden adlandırma", text: "Bir klasördeki 500 fotoğrafı tarih bilgisiyle yeniden adlandıran 10 satırlık betik." },
    { title: "Günlük rapor", text: "Sunucu loglarını tarayıp başarısız giriş sayısını e-posta metni olarak hazırlayan betik." },
    { title: "Hash kontrolü", text: "İndirilen bir dosyanın SHA-256 özetini hesaplayıp yayıncının verdiği değerle karşılaştırmak." },
  ],
  code: [
    {
      title: "Merhaba Python",
      lang: "python",
      code: `ad = input("Adınız: ")
yas = int(input("Yaşınız: "))
print(f"Merhaba {ad}, gelecek yıl {yas + 1} yaşında olacaksın.")`,
    },
    {
      title: "Log analizi otomasyonu",
      lang: "python",
      code: `def basarisiz_say(satirlar):
    sayac = {}
    for satir in satirlar:
        if "FAILED" in satir:
            ip = satir.split()[-1]
            sayac[ip] = sayac.get(ip, 0) + 1
    return sayac

loglar = [
    "09:01 FAILED login 10.0.0.5",
    "09:02 OK login 10.0.0.7",
    "09:03 FAILED login 10.0.0.5",
]
for ip, adet in basarisiz_say(loglar).items():
    if adet >= 2:
        print(f"UYARI: {ip} -> {adet} başarısız deneme")`,
    },
  ],
  scenario: {
    title: "Uygulama senaryosu: Mini güvenlik betiği",
    text: "Küçük bir ağ yöneticisi, her sabah belirli bir portun açık olup olmadığını ve parolanın kurallara uyup uymadığını kontrol eden kısa Python betikleri istiyor.",
    tasks: [
      "Simülatörde dört hazır örnekten birini seçin ve parametrelerini değiştirin.",
      "Kodu adım adım çalıştırıp her satırdan sonra değişkenlerin değerini izleyin.",
      "Eşik değerini veya port listesini değiştirerek çıktının nasıl etkilendiğini gözlemleyin.",
      "Bu simülatörün gerçek Python çalıştırmadığını, önceden tanımlanmış örnekleri izlediğini unutmayın.",
    ],
  },
  summary: [
    "Python sade sözdizimi ve zengin kütüphanesiyle güvenlikte yaygındır.",
    "print() ile yazılır, input() ile string okunur.",
    "Değişken, koşul, döngü ve fonksiyonlar Python'da doğal biçimde birleşir.",
    "Sanal ortam ve pip proje yönetiminin temelidir.",
    "Güvenlik betikleri yalnızca yetkili ortamlarda çalıştırılmalıdır.",
  ],
  quiz: [
    q(
      "Python'da bloklar nasıl belirlenir?",
      ["Süslü parantezlerle { }", "begin ve end kelimeleriyle", "Girinti (indentation) ile", "Noktalı virgülle"],
      2,
      "Python blok yapısını girinti ile kurar; bu yüzden girinti hataları sözdizimi hatasına yol açar.",
    ),
    q(
      "`sayi = input(\"Sayı: \")` ve kullanıcı 7 giriyor. `print(sayi * 2)` ne yazar?",
      ["14", "77", "Hata verir", "7 2"],
      1,
      "input() string döndürür; metin * 2 metni iki kez tekrarlar: \"77\". Sayısal sonuç için int() gerekir.",
    ),
    q(
      "Aşağıdaki betiğin çıktısı nedir?\n\nhatalar = [\"A\", \"B\", \"A\", \"A\"]\nsayac = {}\nfor h in hatalar:\n    sayac[h] = sayac.get(h, 0) + 1\nprint(sayac[\"A\"])",
      ["1", "2", "3", "4"],
      2,
      "\"A\" üç kez geçer; sözlük sayaç mantığı bunu 3 olarak toplar.",
    ),
    q(
      "Python projeleri için sanal ortam (venv) kullanmanın temel amacı nedir?",
      [
        "Kodu daha hızlı çalıştırmak",
        "Bağımlılıkları projeye özel izole etmek",
        "İnterneti kapatmak",
        "Kodu otomatik şifrelemek",
      ],
      1,
      "Sanal ortam, farklı projelerin kütüphane sürümlerinin birbirine karışmasını önler.",
    ),
    q(
      "Bir arkadaşınız ağ tarama betiğini okulun ağında izin almadan denemek istiyor. En doğru yaklaşım hangisidir?",
      [
        "Merak için sorun değildir, denemelidir",
        "Yalnızca yazılı izin aldığı veya kendi laboratuvar ortamında denemelidir",
        "Gece yapılırsa sorun olmaz",
        "Betik Python ile yazıldığı için yasaldır",
      ],
      1,
      "İzinsiz ağ tarama etik ve hukuki sorun yaratır. Araçlar yalnızca yetkili veya kendi ortamınızda kullanılmalıdır.",
    ),
  ],
};

export default lesson;
