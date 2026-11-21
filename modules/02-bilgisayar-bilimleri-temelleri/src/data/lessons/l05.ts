import type { Lesson } from "../../types";

export const l05: Lesson = {
  id: 5,
  title: "Veri ve Veri Türleri",
  en: "Data and Data Types",
  minutes: 40,
  goal: "Verinin bilgisayarda nasıl temsil edildiğini, temel veri türlerini ve veri boyutu birimlerini kavramak.",
  learn: [
    "Veri ile bilgi arasındaki farkı",
    "Sayısal, metinsel, Boolean ve karakter verilerini",
    "Görsel, ses ve video verilerinin dijital temsilini",
    "Bit, Byte, KB, MB, GB, TB birimlerini",
    "Veri bütünlüğüne giriş",
  ],
  concepts: [
    {
      title: "Veri ve bilgi",
      en: "Data vs Information",
      simple: "Veri, işlenmemiş ham gerçeklerdir: '37.2', 'Ankara', '19.11.2026'. Bilgi ise bu verinin anlam kazanmış halidir: 'Ayşe'nin ateşi 37.2 derece, normal sınırlar içinde.'",
      technical:
        "Veri (data) tek başına bağlamdan yoksundur. İşlenip bağlam kazandığında bilgi (information) olur. Bilgisayarlar her şeyi bit dizileri olarak saklar; bu bitlerin sayı mı, metin mi, resim mi olduğunu veri türü (data type) ve dosya biçimi belirler. Aynı 01000001 dizisi, tür bilgisine göre 65 sayısı veya 'A' karakteri olarak yorumlanabilir.",
      example: "Bir sınıftaki not listesi (70, 85, 92) veridir. 'Sınıf ortalaması 82,3' bilgidir.",
      check: {
        q: "'42' tek başına neyi ifade eder?",
        options: ["Bilgi", "Ham veri", "Dosya", "Program"],
        answer: 1,
        explain: "Bağlamı olmayan '42' ham veridir; 'Sıcaklık 42 °C' dediğimizde bilgiye dönüşür.",
      },
    },
    {
      title: "Sayısal, metinsel ve Boolean veriler",
      en: "Numeric, Text, Boolean",
      simple: "Sayılar hesap için, metinler yazı için, Boolean ise yalnızca iki değer (doğru/yanlış) için kullanılır. Bilgisayar bunları farklı biçimlerde saklar.",
      technical:
        "Integer (tam sayı): 125. Float/Double (ondalıklı sayı): 3.14. String (metin): \"AG Cyber Lab\" — karakterler dizisi. Character (karakter): 'A' — ASCII/Unicode ile sayısal kodla saklanır (A=65). Boolean: true/false (1 bit yeterli). Date: tarih/zaman. Tür önemlidir: \"125\" metin olarak 1 ile 2 ile 5 karakterlerinin dizisidir, 125 ise sayıdır; metne 1 eklemekle sayıya 1 eklemek farklı sonuç verir.",
      example: "Telefon numarasını sayı olarak saklarsan başındaki 0 kaybolabilir; çünkü üzerinde toplama yapılmayacak değerler metin olarak tutulmalıdır.",
      code: "\"125\" + \"1\"  → \"1251\"  (metin birleştirme)\n 125  +  1   →  126    (sayısal toplama)\n'A' = 65 (ASCII) = 01000001",
      check: {
        q: "Telefon numarası, TC kimlik numarası gibi üzerinde matematik işlemi yapılmayan değerler için en uygun tür hangisidir?",
        options: ["Integer", "String (metin)", "Boolean", "Float"],
        answer: 1,
        explain: "Bu değerlerle toplama yapılmaz ve baştaki sıfırların korunması gerekir; bu yüzden string olarak tutulurlar.",
      },
    },
    {
      title: "Görsel, ses ve video verileri",
      en: "Image, Audio, Video",
      simple: "Bir fotoğraf aslında çok sayıda küçük renkli noktadan (piksel) oluşur. Ses, saniyede binlerce kez ölçülen titreşim değerleridir. Video ise art arda gösterilen görüntüler ve sestir.",
      technical:
        "Görsel: her piksel genellikle 3 byte (R,G,B) ile saklanır; 1920×1080 ham görüntü ≈ 6 MB eder, JPEG/PNG sıkıştırma ile küçülür. Ses: örnekleme (sampling) — saniyede 44.100 ölçüm (44,1 kHz). Video: saniyede 24–60 kare (frame) + ses. Veri sıkıştırma kayıplı (JPEG, MP3, MP4) veya kayıpsız (PNG, FLAC, ZIP) olabilir.",
      example: "Aynı fotoğrafın JPEG hali PNG halinden küçük olabilir, çünkü JPEG göze az fark edilen ayrıntıları atar (kayıplı sıkıştırma).",
      check: {
        q: "Bir videoyu oluşturan temel öğeler nelerdir?",
        options: ["Yalnızca metin", "Art arda kareler (frame) ve ses", "Yalnızca piksel", "Yalnızca Boolean değerler"],
        answer: 1,
        explain: "Video, saniyede çok sayıda görüntü karesi ile eşlik eden ses verisinin birleşimidir.",
      },
    },
    {
      title: "Veri boyutları",
      en: "Data sizes",
      simple: "Veri boyutu bit ve byte ile ölçülür. 1 byte = 8 bit. Sonra KB, MB, GB, TB gibi büyük birimlere çıkılır. Ancak bir karışıklık vardır: bazı yerlerde 1000, bazı yerlerde 1024 ile çarpılır.",
      technical:
        "SI (ondalık) sisteminde 1 KB = 1000 B, 1 MB = 1000 KB (üreticiler ve ağ hızları bunu kullanır). İkili sistemde 1 KiB = 1024 B, 1 MiB = 1024 KiB (işletim sistemleri çoğu zaman 'KB/MB' adıyla bunu gösterir). 1 TB'lık disk satın aldığında Windows'ta yaklaşık 931 GiB görmenin sebebi budur: 10¹² B ÷ 1024³ ≈ 931,3.",
      example: "Sınıfın ortak internet hızı 100 Mbit/s ise saniyede en fazla 12,5 MB (megabyte) veri indirebilirsin; çünkü 8 bit = 1 byte.",
      code: "SI:     1 KB = 1000 B     1 MB = 1000 KB  ...\nİkili:  1 KiB = 1024 B    1 MiB = 1024 KiB ...\n8 bit = 1 byte → 100 Mbit/s = 12,5 MB/s",
      check: {
        q: "1000 bayt tabanlı hesapla 1 GB kaç MB eder?",
        options: ["1000 MB", "1024 MB", "100 MB", "8 MB"],
        answer: 0,
        explain: "SI (ondalık) sistemde 1 GB = 1000 MB'dir; 1024 tabanında ise (GiB) 1024 MiB olur.",
      },
    },
    {
      title: "Veri bütünlüğüne giriş",
      en: "Data Integrity",
      simple: "Veri bütünlüğü, verinin doğru ve değişmemiş olmasıdır. Dosya indirirken, kaydederken veya gönderirken veri bozulabilir veya biri tarafından değiştirilebilir.",
      technical:
        "Bütünlük (integrity), verinin yetkisiz veya kazara değişikliğe uğramadığını garanti etme amacıdır. Hash fonksiyonları (SHA-256 gibi) bir dosyanın parmak izini üretir; dosya bir bit bile değişse hash tamamen değişir. Bütünlük, siber güvenliğin CIA üçlüsünün (Confidentiality, Integrity, Availability) bir parçasıdır.",
      example: "Yazılım indirme sayfalarında verilen SHA-256 değerini indirdiğin dosyanınkiyle karşılaştırarak dosyanın değişmediğini doğrularsın.",
      check: {
        q: "Bir dosyanın bütünlüğünü doğrulamada yaygın olarak ne kullanılır?",
        options: ["Dosya ikonu", "Hash (özet) değeri", "Dosya boyutunun KB cinsinden yazılması", "Klasör adı"],
        answer: 1,
        explain: "Hash değeri dosyanın parmak izi gibidir; en küçük değişiklikte tamamen farklı çıkar.",
      },
    },
  ],
  terms: [
    { tr: "Veri", en: "Data", def: "İşlenmemiş ham gerçekler." },
    { tr: "Bilgi", en: "Information", def: "Anlam kazanmış, bağlamı olan veri." },
    { tr: "Tam sayı", en: "Integer", def: "Ondalık kısmı olmayan sayı." },
    { tr: "Metin", en: "String", def: "Karakterlerden oluşan dizi." },
    { tr: "Mantıksal", en: "Boolean", def: "true veya false değeri." },
    { tr: "Piksel", en: "Pixel", def: "Görüntünün en küçük renkli noktası." },
  ],
  realLife: [
    "Fotoğraf yüklerken boyutun küçülmesi: görsel sıkıştırma uygulanır.",
    "Telefon 'depolama dolu' uyarısı: video ve fotoğraflar MB/GB cinsinden yer kaplar.",
    "İnternet hızı Mbit/s, dosya boyutu MB cinsindendir: dönüşüm için 8'e bölünür.",
  ],
  labTitle: "Veri Türü Tanıma Laboratuvarı ve Veri Boyutu Dönüştürücü",
  labDesc: "7 örneği uygun veri türüyle eşleştir; ardından Byte–KB–MB–GB–TB dönüştürücüyü 1000 ve 1024 tabanlarıyla kullan.",
  summary: [
    "Veri ham, bilgi anlam kazanmış veridir.",
    "Tür (integer, string, boolean, date…) verinin nasıl yorumlanacağını belirler.",
    "Görsel, ses ve video verileri de bit dizileridir; sıkıştırma ile boyutları küçültülür.",
    "1 byte = 8 bit; SI'da 1000, ikili sistemde 1024 ile çarpılır.",
  ],
  quiz: [
    { q: "'true' değeri hangi veri türüne aittir?", options: ["String", "Integer", "Boolean", "Float"], answer: 2, explain: "true/false iki durumlu mantıksal (Boolean) değerlerdir." },
    { q: "100 Mbit/s bağlantıda teorik olarak saniyede kaç MB indirilebilir?", options: ["100 MB", "12,5 MB", "800 MB", "1,25 MB"], answer: 1, explain: "100 ÷ 8 = 12,5 MB/s." },
    { q: "JPEG sıkıştırması hangi türdendir?", options: ["Kayıpsız", "Kayıplı", "Şifreleme", "Hiç sıkıştırma yapmaz"], answer: 1, explain: "JPEG, göze az fark edilen ayrıntıları atarak boyutu küçültür." },
    { q: "Veri bütünlüğünün bozulması ne demektir?", options: ["Verinin kopyalanması", "Verinin istem dışı veya yetkisiz değişmesi", "Dosyanın yeniden adlandırılması", "Disk dolması"], answer: 1, explain: "Bütünlük, verinin değişmemiş ve güvenilir olmasıdır." },
    { q: "'AG Cyber Lab' ifadesi hangi veri türüdür?", options: ["Integer", "Boolean", "String", "Date"], answer: 2, explain: "Karakter dizisi olduğundan String'dir." },
  ],
};
