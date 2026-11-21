import { q, type Lesson } from "../types";

const lesson: Lesson = {
  id: 2,
  title: "Algoritma Mantığı",
  goal:
    "Bir problemi adım adım çözme becerisi kazanmak; algoritma, akış şeması ve sözde kod kavramlarını öğrenmek; karar mekanizmalarını ve tipik algoritma hatalarını tanımak.",
  outcomes: [
    "Algoritmayı tanımlayabilir ve iyi bir algoritmanın özelliklerini sayabilir.",
    "Bir problemi girdi, işlem ve çıktıya ayırabilir.",
    "Basit bir akış şemasını okuyabilir ve çizebilir.",
    "Sözde kod yazabilir.",
    "Karar adımlarında ve döngülerde sık yapılan algoritma hatalarını fark edebilir.",
  ],
  duration: "≈ 40 dakika",
  sections: [
    {
      title: "Algoritma nedir?",
      paras: [
        "**Algoritma (Algorithm)**, bir problemi çözmek için izlenen, sonlu sayıda adımdan oluşan, net ve sıralı yöntemdir. Bir algoritma bir programlama diline bağlı değildir: aynı algoritma Python'da, Bash'te veya kâğıt üzerinde uygulanabilir.",
        "İyi bir algoritmanın özellikleri: **Net** (her adım belirsizlik içermez), **Sonlu** (belirli bir noktada biter), **Girdi/Çıktı** (en az bir çıktı üretir) ve **Etkili** (makul sürede ve kaynakla çalışır).",
      ],
    },
    {
      title: "Algoritmik düşünme ve adım adım problem çözme",
      paras: [
        "**Algoritmik düşünme**, büyük bir problemi küçük parçalara bölme, tekrar eden örüntüleri bulma, gereksiz ayrıntıyı ayıklama (soyutlama) ve çözümü adımlara dökme becerisidir.",
        "Problem çözerken şu sırayı izleyin: (1) Problemi anlayın, (2) Girdi ve beklenen çıktıyı yazın, (3) Küçük örneklerle elle deneyin, (4) Adımları sıralayın, (5) Sınır durumları (boş girdi, çok uzun girdi, negatif sayı) düşünün, (6) Test edin.",
      ],
    },
    {
      title: "Girdi, işlem ve çıktı",
      paras: [
        "Örnek problem: “Kullanıcının parolası en az 8 karakter mi?” Burada girdi **parola metni**, işlem **uzunluğun hesaplanması ve 8 ile karşılaştırılması**, çıktı ise **“yeterli” veya “çok kısa”** mesajıdır.",
        "Problemi bu üçlüye ayırmak, kodu yazmadan önce çözümün iskeletini görmenizi sağlar.",
      ],
    },
    {
      title: "Akış şemaları (Flowcharts)",
      paras: [
        "**Akış şeması**, algoritmanın adımlarını standart şekillerle gösteren diyagramdır. Okunması kolaydır ve ekip içi iletişimde çok işe yarar.",
      ],
      bullets: [
        "Oval: Başla / Bitir.",
        "Paralelkenar: Girdi veya çıktı (veri al, ekrana yaz).",
        "Dikdörtgen: İşlem (hesapla, ata).",
        "Eşkenar dörtgen: Karar (Evet/Hayır dallanması).",
        "Oklar: Akışın yönü.",
      ],
    },
    {
      title: "Sözde kod (Pseudocode)",
      paras: [
        "**Sözde kod**, algoritmayı belirli bir programlama dilinin sözdizimine (syntax) bağlı kalmadan, doğal dile yakın biçimde yazma yöntemidir. `EĞER`, `DEĞİLSE`, `HER ... İÇİN`, `İKEN` gibi anahtar kelimeler kullanılır. Sözde kod yazmak, kodlamaya geçmeden mantığı sınamayı sağlar.",
      ],
    },
    {
      title: "Karar mekanizmaları",
      paras: [
        "Algoritmalar çoğu zaman bir koşula göre farklı yollara ayrılır. **Karar adımı** bir Evet/Hayır sorusu sorar ve cevaba göre akışı yönlendirir. Güvenlik açısından karar adımları kritik noktalardır: yetki kontrolü, parola doğrulama ve girdi doğrulama hep birer karar mekanizmasıdır.",
        "Birden fazla koşul varsa kararlar art arda veya iç içe sıralanabilir. Sıra önemlidir: önce en kritik kontrolü yapmak genellikle daha güvenlidir.",
      ],
    },
    {
      title: "Algoritma hataları",
      paras: ["Algoritmaların doğru çalışmasını engelleyen tipik hatalar:"],
      bullets: [
        "**Eksik adım:** Girdi alınmadan işlem yapmaya çalışmak.",
        "**Yanlış sıra:** Sonucu yazdırdıktan sonra hesaplamak.",
        "**Yanlış karar sınırı (off-by-one):** `>= 8` yerine `> 8` yazmak, tam 8 karakterlik parolayı reddeder.",
        "**Eksik dal:** Karar adımında “Hayır” yolunu tanımlamamak.",
        "**Sonsuz döngü:** Biten bir koşul tanımlamamak.",
        "**Sınır durumlarını unutmak:** Boş parola, çok uzun metin.",
      ],
    },
  ],
  terms: [
    { tr: "Algoritma", en: "Algorithm", desc: "Problemi çözen, sonlu, net ve sıralı adımlar bütünü." },
    { tr: "Akış şeması", en: "Flowchart", desc: "Algoritmanın adımlarını şekillerle gösteren diyagram." },
    { tr: "Sözde kod", en: "Pseudocode", desc: "Algoritmanın dilden bağımsız, doğal dile yakın yazımı." },
    { tr: "Soyutlama", en: "Abstraction", desc: "Gereksiz ayrıntıyı ayıklayıp ana fikre odaklanma." },
    { tr: "Karar adımı", en: "Decision", desc: "Evet/Hayır sorusuyla akışı dallandıran adım." },
    { tr: "Sınır durumu", en: "Edge Case", desc: "Normalin dışındaki uç girdiler (boş, çok büyük, negatif)." },
    { tr: "Hata ayıklama", en: "Debugging", desc: "Algoritma veya koddaki hatayı bulup düzeltme." },
  ],
  examples: [
    {
      title: "Trafik ışığı",
      text: "Işık kırmızıysa dur, yeşilse geç, sarıysa hazırlan: üç dallı bir karar mekanizmasıdır.",
    },
    {
      title: "Güvenlik kapısı",
      text: "Kart okut → kart geçerli mi? → Evet: kapıyı aç, Hayır: alarm sayacını artır. Akış şeması bu mantığı çok net gösterir.",
    },
    {
      title: "Şüpheli e-posta kontrolü",
      text: "Gönderen tanınıyor mu? Bağlantı alan adı beklenen alan adıyla uyuşuyor mu? Ek dosya var mı? Her soru bir karar adımıdır; cevaplara göre e-posta “güvenli” veya “şüpheli” olarak sınıflandırılır.",
    },
  ],
  code: [
    {
      title: "Sözde kod: parola uzunluğu kontrolü",
      lang: "text",
      code: `BAŞLA
  parola ← kullanıcıdan al
  uzunluk ← parolanın karakter sayısı
  EĞER uzunluk >= 8 İSE
      yaz "Parola yeterli uzunlukta"
  DEĞİLSE
      yaz "Parola çok kısa"
BİTİR`,
    },
    {
      title: "Aynı algoritmanın Python karşılığı",
      lang: "python",
      code: `parola = input("Parola: ")
uzunluk = len(parola)
if uzunluk >= 8:
    print("Parola yeterli uzunlukta")
else:
    print("Parola çok kısa")`,
      note: "Algoritma aynı kalır; yalnızca ifade biçimi (sözdizimi) değişir.",
    },
  ],
  scenario: {
    title: "Uygulama senaryosu: Parola uzunluğu kontrol algoritması",
    text: "Bir web sitesi kayıt formunda parola uzunluğunu denetleyecek. Gereksinim: en az 8 karakter. Aksi halde kullanıcıya uyarı gösterilecek.",
    tasks: [
      "Laboratuvarda adımları doğru sırayla seçerek algoritmayı oluşturun.",
      "Akış şemasında Evet ve Hayır dallarının ikisinin de bulunduğundan emin olun.",
      "Test kutusuna 7, 8 ve 9 karakterlik parolalar girerek sınır durumunu deneyin.",
      "Karar adımını “uzunluk > 8” yaparsanız 8 karakterlik parola için ne olur? Yorumlayın.",
    ],
  },
  summary: [
    "Algoritma, problemi çözen sonlu ve net adımlar bütünüdür.",
    "Problemi girdi-işlem-çıktıya ayırmak çözümün iskeletini verir.",
    "Akış şeması görsel, sözde kod metinsel anlatımdır.",
    "Karar adımları güvenlik kontrollerinin temelidir.",
    "Eksik dal, yanlış sıra ve sınır hataları en sık algoritma hatalarıdır.",
  ],
  quiz: [
    q(
      "Akış şemasında karar adımı hangi şekille gösterilir?",
      ["Oval", "Eşkenar dörtgen", "Paralelkenar", "Dairesel ok"],
      1,
      "Karar (Evet/Hayır) adımları eşkenar dörtgenle, başla/bitir ovalle, girdi/çıktı paralelkenarla gösterilir.",
    ),
    q(
      "Parola en az 8 karakter olmalı. Algoritmada `uzunluk > 8` yazılırsa ne olur?",
      [
        "8 karakterlik geçerli parola yanlışlıkla reddedilir",
        "9 karakterlik parola reddedilir",
        "Hiçbir değişiklik olmaz",
        "Program derlenmez",
      ],
      0,
      "“En az 8” ifadesi `>= 8` demektir. `> 8` yazmak off-by-one (bir eksik/fazla) hatasıdır.",
    ),
    q(
      "Aşağıdakilerden hangisi iyi bir algoritmanın özelliği DEĞİLDİR?",
      ["Sonlu olması", "Her adımın net olması", "Hiç sona ermemesi", "En az bir çıktı üretmesi"],
      2,
      "Algoritma sonlu sayıda adımda bitmelidir. Bitmeyen yapı sonsuz döngü hatasıdır.",
    ),
    q(
      "Bir e-posta kontrol algoritmasında “gönderen tanınıyor mu?” sorusu akış şemasında neye karşılık gelir?",
      ["İşlem adımı (dikdörtgen)", "Karar adımı", "Başla oval'i", "Çıktı adımı"],
      1,
      "Evet/Hayır cevabıyla akışı iki yola ayıran her soru bir karar adımıdır.",
    ),
    q(
      "Aşağıdaki sözde kodda hata nedir?\n\nBAŞLA\n  yaz \"Sonuç: \", toplam\n  toplam ← a + b\n  a, b değerlerini al\nBİTİR",
      [
        "Hata yok",
        "Adımların sırası yanlış: önce girdi, sonra işlem, en son çıktı olmalı",
        "Toplama işlemi yapılamaz",
        "BAŞLA kelimesi kullanılamaz",
      ],
      1,
      "Değerler alınmadan toplanamaz ve hesaplanmadan yazdırılamaz. Doğru sıra: girdi → işlem → çıktı.",
    ),
  ],
};

export default lesson;
