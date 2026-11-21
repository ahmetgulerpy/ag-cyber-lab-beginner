import { q, type Lesson } from "../types";

const lesson: Lesson = {
  id: 13,
  title: "JSON ve XML",
  goal:
    "Yapılandırılmış veri biçimleri JSON ve XML'i tanımak; yapılarını okumak, doğrulamak ve karşılaştırmak; serileştirme, API yanıtları ve yapılandırma dosyalarındaki kullanımlarını ve güvenlik risklerini (XXE'ye giriş) kavramak.",
  outcomes: [
    "Yapılandırılmış veri kavramını açıklayabilir.",
    "JSON nesne, dizi ve değer tiplerini tanır; geçerli JSON yazabilir.",
    "XML etiket, öznitelik ve hiyerarşi yapısını okuyabilir.",
    "JSON ve XML arasındaki farkları sıralayabilir.",
    "XXE zafiyetinin mantığını ve temel korunma yöntemini açıklayabilir.",
  ],
  duration: "≈ 50 dakika",
  sections: [
    {
      title: "Yapılandırılmış veri nedir?",
      paras: [
        "**Yapılandırılmış veri (Structured Data)**, belirli kurallara göre düzenlenmiş ve hem insan hem makine tarafından okunabilen veridir. Programlar arası veri alışverişi, yapılandırma dosyaları ve API yanıtları yapılandırılmış formatlarla yapılır. En yaygın iki biçim JSON ve XML'dir.",
      ],
    },
    {
      title: "JSON nedir ve veri yapısı",
      paras: [
        "**JSON (JavaScript Object Notation)**, hafif ve okunması kolay bir veri biçimidir. Temel yapıları: **nesne (object)** `{ \"anahtar\": değer }`, **dizi (array)** `[ ... ]`, ve değer tipleri: string (çift tırnaklı), number, boolean (`true/false`), `null`.",
        "Katı kurallar vardır: anahtarlar **çift tırnak** içinde olmalı, son elemandan sonra **virgül** konmamalı, yorum satırı yoktur, tek tırnak geçersizdir. Python'da JSON sözlük/listeye karşılık gelir: `json.loads()` metni nesneye, `json.dumps()` nesneyi metne çevirir.",
      ],
    },
    {
      title: "XML nedir ve etiketler",
      paras: [
        "**XML (eXtensible Markup Language)**, veriyi etiketlerle (tag) tanımlayan işaretleme dilidir: `<kullanici id=\"1\"><ad>Ayşe</ad></kullanici>`. Tek bir **kök (root) eleman** bulunmalı, her açılan etiket kapanmalı, etiketler doğru iç içe geçmeli ve öznitelik (attribute) değerleri tırnak içinde olmalıdır. XML'de yorum `<!-- ... -->` ile yazılır. Özel karakterler kaçış gerektirir: `&lt;`, `&gt;`, `&amp;`.",
      ],
    },
    {
      title: "Key-value, nesneler ve diziler",
      paras: [
        "Her iki biçimde de veri bir **anahtar-değer (key-value)** ilişkisi ve hiyerarşiyle ifade edilir. JSON'da liste `[]` ile, XML'de aynı adlı tekrarlı etiketlerle gösterilir (`<port>22</port><port>80</port>`). İç içe yapılar ağaç (tree) olarak düşünülebilir.",
      ],
    },
    {
      title: "JSON ve XML arasındaki farklar",
      paras: ["Genel karşılaştırma:"],
      bullets: [
        "JSON daha kısa ve okunması kolay; XML daha kalabalık (açılış/kapanış etiketleri).",
        "JSON'da dizi ve sayı/boolean tipleri doğal; XML'de her şey metindir (tip bilgisi şema ile eklenir).",
        "XML öznitelik, ad alanı (namespace), şema (XSD) ve dönüştürme (XSLT) gibi zengin özellikler sunar.",
        "Web API'lerinde JSON, kurumsal/eski sistemlerde, SOAP ve belge biçimlerinde XML yaygındır.",
        "XML ayrıca DTD ve varlık (entity) gibi mekanizmalar içerdiği için ek güvenlik riskleri taşır.",
      ],
    },
    {
      title: "Serileştirme, API yanıtları ve yapılandırma dosyaları",
      paras: [
        "**Serileştirme (Serialization)**, bellekteki bir nesneyi metne/bayta çevirme işlemidir; tersi **seri durumdan çıkarma (deserialization)**. API'ler (ör. hava durumu servisi) yanıtı genellikle JSON olarak döner; uygulama bunu ayrıştırıp (parse) kullanır. Yapılandırma dosyaları (`package.json`, `settings.json`, `web.config`) da bu biçimlerle yazılır.",
        "Güvenlik: Dışarıdan gelen veri her zaman **güvenilmez** kabul edilmeli, ayrıştırmadan sonra beklenen alanlar ve tipler doğrulanmalıdır. Güvensiz deserialization (özellikle bazı dillerde nesne üretebilen biçimlerde) ciddi zafiyetlere yol açabilir.",
      ],
    },
    {
      title: "XML ve JSON güvenliği, XXE'ye giriş",
      paras: [
        "**XXE (XML External Entity)**, XML ayrıştırıcının DTD içinde tanımlanan harici varlıkları (external entity) çözmesinden doğan zafiyettir. Saldırgan XML içine bir dosya veya URL referansı gömerse, zayıf yapılandırılmış ayrıştırıcı bu içeriği okuyup yanıta dahil edebilir; bu da hassas dosyaların sızmasına veya sunucunun iç ağa istek atmasına (SSRF) yol açabilir.",
        "Korunma: ayrıştırıcıda DTD ve harici varlık çözümlemesini **kapatın**, güncel ve güvenli yapılandırılmış kütüphaneler kullanın (Python'da `defusedxml`), gereksizse XML yerine JSON tercih edin, girdi boyutunu sınırlayın. JSON tarafında ise aşırı büyük/derin yapılar ve doğrulanmamış alanlar risk oluşturur.",
        "Laboratuvardaki XXE senaryosu tamamen **sanal ve örnek veriyle** çalışır: gerçek dosya okunmaz, ağ isteği yapılmaz.",
      ],
    },
  ],
  terms: [
    { tr: "Serileştirme", en: "Serialization", desc: "Nesneyi saklanabilir/gönderilebilir metne çevirme." },
    { tr: "Ayrıştırma", en: "Parsing", desc: "Metni programın kullanabileceği yapıya çevirme." },
    { tr: "Nesne", en: "Object", desc: "JSON'da süslü parantezli anahtar-değer koleksiyonu." },
    { tr: "Dizi", en: "Array", desc: "JSON'da köşeli parantezli sıralı değerler." },
    { tr: "Etiket", en: "Tag", desc: "XML'de <ad> biçimindeki işaret." },
    { tr: "Öznitelik", en: "Attribute", desc: "XML etiketinin içindeki ad=\"değer\" bilgisi." },
    { tr: "Şema", en: "Schema", desc: "Verinin yapısını tanımlayan kural kümesi." },
    { tr: "XXE", en: "XML External Entity", desc: "Harici varlıkların çözülmesinden doğan XML zafiyeti." },
  ],
  examples: [
    { title: "Hava durumu API'si", text: "Uygulama bir servise istek yapar; servis sıcaklık, nem ve şehir bilgisini JSON olarak yanıtlar." },
    { title: "Yapılandırma", text: "Bir uygulamanın dil, tema ve port ayarlarının `config.json` içinde tutulması." },
    { title: "Güvenlik tarayıcısı raporu", text: "Birçok tarama aracı sonuçlarını XML veya JSON olarak dışa aktarır; analiz betikleri bunları okur." },
  ],
  code: [
    {
      title: "JSON örneği",
      lang: "json",
      code: `{
  "kullanici": "ayse",
  "aktif": true,
  "portlar": [22, 80, 443],
  "profil": { "rol": "analist", "son_giris": null }
}`,
    },
    {
      title: "Aynı verinin XML karşılığı",
      lang: "xml",
      code: `<?xml version="1.0" encoding="UTF-8"?>
<kayit>
  <kullanici>ayse</kullanici>
  <aktif>true</aktif>
  <portlar>
    <port>22</port>
    <port>80</port>
    <port>443</port>
  </portlar>
  <profil rol="analist" />
</kayit>`,
    },
  ],
  scenario: {
    title: "Uygulama senaryosu: Hatalı yapılandırma dosyası ve XXE incelemesi",
    text: "Bir ekip, API yanıtı olarak gelen JSON'u ve bir XML yapılandırma dosyasını doğrulamak istiyor. Ayrıca bir XML örneğinin güvensiz ayrıştırıcıda neden risk oluşturduğunu anlamak istiyor.",
    tasks: [
      "JSON sekmesinde bilinçli olarak son elemandan sonra virgül bırakıp doğrulayın ve hata mesajını okuyun.",
      "XML sekmesinde bir etiketi kapatmayı unutup doğrulama sonucunu inceleyin.",
      "Geçerli JSON'u ağaç görünümünde ve XML'e dönüşmüş haliyle karşılaştırın.",
      "XXE sekmesindeki örnek veriyi güvenli ve güvensiz ayrıştırıcı simülasyonuyla çalıştırın.",
    ],
  },
  summary: [
    "JSON ve XML yapılandırılmış veri alışverişinin ana biçimleridir.",
    "JSON nesne, dizi ve temel tiplerden oluşur; katı sözdizimi kuralları vardır.",
    "XML etiket, öznitelik ve tek kök eleman yapısına sahiptir.",
    "Dışarıdan gelen veri doğrulanmadan güvenilmemelidir.",
    "XXE'ye karşı DTD ve harici varlık çözümlemesi kapatılmalıdır.",
  ],
  quiz: [
    q(
      "Aşağıdakilerden hangisi geçerli bir JSON'dur?",
      [
        "{ 'ad': 'Ali' }",
        "{ \"ad\": \"Ali\", }",
        "{ \"ad\": \"Ali\" }",
        "{ ad: \"Ali\" }",
      ],
      2,
      "JSON'da anahtarlar çift tırnaklı olmalı, tek tırnak ve son elemandan sonra virgül geçersizdir.",
    ),
    q(
      "Aşağıdaki XML neden geçersizdir?\n\n<liste><oge>A</oge><oge>B</liste></oge>",
      [
        "Hiç etiket yok",
        "Etiketler yanlış iç içe kapatılmış",
        "Kök eleman olamaz",
        "XML'de metin yazılamaz",
      ],
      1,
      "Etiketler açıldıkları sırayla tersine kapatılmalıdır: <oge>B</oge></liste>.",
    ),
    q(
      "XXE zafiyetinin temel sebebi nedir?",
      [
        "JSON'daki sayıların büyük olması",
        "XML ayrıştırıcının harici varlıkları (external entity) çözmeye izin vermesi",
        "Parolaların kısa olması",
        "CSS dosyalarının yüklenmemesi",
      ],
      1,
      "Ayrıştırıcı DTD'de tanımlı harici varlıkları işlerse saldırgan dosya içeriği okutabilir veya iç ağa istek attırabilir.",
    ),
    q(
      "Bir API yanıtı olarak gelen JSON verisiyle ilgili en güvenli yaklaşım hangisidir?",
      [
        "Her alanı doğrudan güvenilir kabul etmek",
        "Beklenen alanları ve tipleri doğrulamadan sonra kullanmak",
        "Veriyi kontrol etmeden komut olarak çalıştırmak",
        "Hataları yok saymak",
      ],
      1,
      "Dışarıdan gelen veri güvenilmezdir; şema/tip/alan doğrulaması şarttır.",
    ),
    q(
      "Aşağıdaki Python kodunun çıktısı nedir?\n\nimport json\nveri = json.loads('{\"portlar\": [22, 80]}')\nprint(veri[\"portlar\"][1])",
      ["22", "80", "portlar", "Hata"],
      1,
      "JSON dizisi Python listesine dönüşür; indeks 1, ikinci eleman olan 80'dir.",
    ),
  ],
};

export default lesson;
