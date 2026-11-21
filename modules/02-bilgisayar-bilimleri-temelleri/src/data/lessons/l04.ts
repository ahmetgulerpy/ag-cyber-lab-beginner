import type { Lesson } from "../../types";

export const l04: Lesson = {
  id: 4,
  title: "Binary ve Hexadecimal Sistemler",
  en: "Binary and Hexadecimal Number Systems",
  minutes: 50,
  goal: "Bilgisayarın neden 0 ve 1 kullandığını anlamak; decimal, binary ve hexadecimal sistemleri arasında elle ve adım adım dönüşüm yapabilmek.",
  learn: [
    "Sayı sistemlerinin ne olduğunu ve tabanın (base) rolünü",
    "Bit ve byte kavramlarını",
    "Binary ↔ Decimal dönüşümünü",
    "Hexadecimal sistemi ve Binary ile ilişkisini",
    "Bellek adresleri, IP ve MAC adreslerinde bu sistemlerin kullanımını",
  ],
  concepts: [
    {
      title: "Sayı sistemleri ve taban kavramı",
      en: "Number systems & base",
      simple: "Günlük hayatta 0–9 arası on rakamla sayarız; buna decimal (10'luk) sistem denir. Aynı mantıkla farklı sayıda rakam kullanan başka sistemler de yapılabilir.",
      technical:
        "Konumsal sayı sistemlerinde her basamağın değeri, rakamın tabanın (base) kuvvetiyle çarpımına eşittir. Decimal'de taban 10'dur: 345 = 3×10² + 4×10¹ + 5×10⁰. Binary'de taban 2 (0,1), hexadecimal'de taban 16'dır (0–9 ve A–F). Sayının değeri aynı kalır, sadece yazım biçimi değişir.",
      example: "Aynı miktar 'yirmi beş' olarak şöyle yazılır: Decimal 25, Binary 11001, Hexadecimal 19. Değer aynıdır, gösterim farklıdır.",
      check: {
        q: "Decimal sistemin tabanı kaçtır?",
        options: ["2", "8", "10", "16"],
        answer: 2,
        explain: "Decimal sistem 0–9 arası 10 rakam kullanır, yani tabanı 10'dur.",
      },
    },
    {
      title: "Bit, Byte ve Binary sistemin önemi",
      en: "Bit, Byte & Binary",
      simple: "Bilgisayar elektrikle çalıştığı için yalnızca iki durumu güvenilir şekilde ayırt eder: akım var (1) veya yok (0). Bu tek rakama bit denir. 8 bit bir araya gelince bir byte oluşur.",
      technical:
        "Bit (binary digit) en küçük veri birimidir. 1 byte = 8 bit ve 2⁸ = 256 farklı değer (0–255) temsil edebilir. Binary sistem donanım düzeyinde transistörlerin açık/kapalı durumlarına karşılık gelir; iki seviyeyi ayırmak gürültüye karşı çok daha dayanıklıdır. Metin, görüntü, ses; hepsi sonuçta bit dizileridir.",
      example: "Bir ışık düğmesi gibi düşün: Açık = 1, Kapalı = 0. 8 düğmelik bir panelde 256 farklı ışık kombinasyonu elde edersin.",
      code: "Bit değerleri (8 bit):\n 128  64  32  16   8   4   2   1\n  2⁷  2⁶  2⁵  2⁴  2³  2²  2¹  2⁰",
      check: {
        q: "Bir byte kaç farklı değeri temsil edebilir?",
        options: ["8", "64", "256", "1024"],
        answer: 2,
        explain: "8 bit ile 2⁸ = 256 farklı kombinasyon (0–255) oluşturulabilir.",
      },
    },
    {
      title: "Binary ↔ Decimal dönüşümü",
      en: "Binary ↔ Decimal conversion",
      simple: "Binary'den decimal'e çevirmek için her 1 olan bitin basamak değerini toplarsın. Decimal'den binary'ye çevirirken sayıyı sürekli 2'ye bölüp kalanları alttan yukarı okursun.",
      technical:
        "Binary → Decimal: 1101₂ = 1×8 + 1×4 + 0×2 + 1×1 = 13. Decimal → Binary (ardışık bölme): 13÷2=6 kalan 1; 6÷2=3 kalan 0; 3÷2=1 kalan 1; 1÷2=0 kalan 1. Kalanlar son bölmeden ilkine doğru okunur: 1101.",
      example: "Bir byte'ın 10100101 değeri: 128+32+4+1 = 165. Uygulamadaki 8 bitlik alanda bu bitleri açıp kapatarak dene.",
      code: "13 ÷ 2 = 6  kalan 1  ↑\n 6 ÷ 2 = 3  kalan 0  ↑\n 3 ÷ 2 = 1  kalan 1  ↑\n 1 ÷ 2 = 0  kalan 1  ↑   → 1101",
      check: {
        q: "Binary 1010 sayısının decimal karşılığı nedir?",
        options: ["8", "10", "12", "5"],
        answer: 1,
        explain: "1×8 + 0×4 + 1×2 + 0×1 = 10.",
      },
    },
    {
      title: "Hexadecimal sistem",
      en: "Hexadecimal",
      simple: "Hexadecimal (16'lık) sistem 16 sembol kullanır: 0–9 ve A–F. Uzun binary dizileri kısa yazmak için kullanılır; çünkü 4 bit tam olarak tek bir hex karaktere denk gelir.",
      technical:
        "A=10, B=11, C=12, D=13, E=14, F=15. Hex → Decimal: 2F₁₆ = 2×16 + 15 = 47. Binary ile ilişkisi: her hex rakam 4 bittir; 0xA3 = 1010 0011. Bu yüzden Binary ↔ Hex dönüşümü matematik gerektirmeden gruplama ile yapılır. Hex değerleri genellikle 0x önekiyle gösterilir (0xFF = 255).",
      example: "Web renklerindeki #FF0000 değeri, 3 byte'tır: FF (kırmızı=255), 00 (yeşil=0), 00 (mavi=0) → saf kırmızı.",
      code: "0xF  = 1111   0xA = 1010\n0x3C = 0011 1100 = 60\n0xFF = 1111 1111 = 255",
      check: {
        q: "Hexadecimal F harfinin decimal değeri nedir?",
        options: ["10", "14", "15", "16"],
        answer: 2,
        explain: "A=10 olduğundan sırasıyla B=11, C=12, D=13, E=14, F=15 olur.",
      },
    },
    {
      title: "Bellek adresleri, IP ve MAC",
      en: "Memory addresses, IP & MAC",
      simple: "Bilgisayar belleğindeki her hücrenin bir adresi vardır ve bu adresler uzun binary sayılardır. Okunması kolay olsun diye hex olarak yazılır. Ağ adreslerinde de aynı sistemler görülür.",
      technical:
        "Bellek adresleri (örn. 0x7FFE4A20) hex gösterilir. IPv4 adresi (192.168.1.10) dört byte'ın decimal gösterimidir: 11000000.10101000.00000001.00001010. MAC adresi (00:1A:2B:3C:4D:5E) 48 bitlik fiziksel ağ kartı adresidir ve altı byte hex olarak yazılır. IPv6 adresleri de hex tabanlıdır.",
      example: "Ağ ayarında 192.168.1.10 gördüğünde bu aslında 4 sayının (her biri 0–255, yani 1 byte) birleşimidir.",
      check: {
        q: "IPv4 adresindeki her bir sayı (örn. 192) kaç bit ile ifade edilir?",
        options: ["4", "8", "16", "32"],
        answer: 1,
        explain: "Her bölüm bir byte (8 bit) olduğu için 0–255 arası değer alabilir; toplam 4×8 = 32 bit.",
      },
    },
  ],
  terms: [
    { tr: "Bit", en: "Bit", def: "0 veya 1 değerini alan en küçük veri birimi." },
    { tr: "Bayt", en: "Byte", def: "8 bitlik veri birimi; 0–255 arası değer." },
    { tr: "Taban", en: "Base / Radix", def: "Bir sayı sisteminde kullanılan rakam sayısı." },
    { tr: "Onaltılık", en: "Hexadecimal", def: "0–9 ve A–F kullanan 16 tabanlı sistem." },
    { tr: "MAC adresi", en: "MAC Address", def: "Ağ kartının 48 bitlik fiziksel adresi." },
    { tr: "En anlamlı bit", en: "MSB", def: "Binary sayıda en soldaki, en büyük değerli bit." },
  ],
  realLife: [
    "Web renk kodları (#176B87) hex ile yazılır.",
    "Hata mesajlarındaki bellek adresleri (0x0000007B) hex gösterilir.",
    "Alt ağ maskesi 255.255.255.0 → binary'de 24 tane 1 ve 8 tane 0'dır.",
  ],
  labTitle: "Sayı Sistemi Dönüştürücü ve 8 Bit Alanı",
  labDesc: "Decimal, Binary ve Hexadecimal arasında dönüşüm yap, adımları incele; 8 bitlik alanda bitleri açıp kapatarak hedef sayıyı oluştur.",
  summary: [
    "Bilgisayar iki durumlu (0/1) elektrik sinyallerini kullandığı için binary sistemi kullanır.",
    "8 bit = 1 byte = 256 değer (0–255). Bit basamak değerleri: 128, 64, 32, 16, 8, 4, 2, 1.",
    "Decimal → Binary için 2'ye ardışık bölme, Binary → Decimal için basamak değerlerini toplama.",
    "Hex rakam = 4 bit; bu yüzden Binary ↔ Hex dönüşümü gruplayarak yapılır.",
  ],
  quiz: [
    { q: "Decimal 25 sayısının binary karşılığı nedir?", options: ["10011", "11001", "11010", "10101"], answer: 1, explain: "25 = 16 + 8 + 1 → 11001." },
    { q: "Hexadecimal 0xFF sayısının decimal değeri kaçtır?", options: ["155", "225", "255", "256"], answer: 2, explain: "F=15 → 15×16 + 15 = 255." },
    { q: "Binary 1111 0000 sayısının hexadecimal karşılığı nedir?", options: ["0F", "F0", "FF", "E0"], answer: 1, explain: "1111 = F, 0000 = 0 → F0." },
    { q: "Neden hexadecimal, binary'ye göre insanlar için daha uygundur?", options: ["Bilgisayar sadece hex anlar", "Her hex rakam 4 biti temsil ederek daha kısa yazım sağlar", "Hex sayıları daha küçüktür", "Hex kullanmak depolama alanını azaltır"], answer: 1, explain: "Hex değer uzun bit dizilerini kısaltır; değer aynı kalır, sadece gösterim sadeleşir." },
    { q: "8 bitle en büyük sayı kaçtır (işaretsiz)?", options: ["127", "128", "255", "256"], answer: 2, explain: "Bütün bitler 1 ise 128+64+32+16+8+4+2+1 = 255." },
  ],
};
