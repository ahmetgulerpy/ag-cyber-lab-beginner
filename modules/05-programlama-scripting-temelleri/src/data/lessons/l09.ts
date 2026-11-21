import { q, type Lesson } from "../types";

const lesson: Lesson = {
  id: 9,
  title: "Hata Yönetimi",
  goal:
    "Hata türlerini tanımak, Python'da try / except / else / finally ile hataları kontrollü yönetmek, hata ayıklama (debugging) yöntemlerini uygulamak ve güvenli hata mesajı yazma ilkesini öğrenmek.",
  outcomes: [
    "Syntax, Runtime ve Logical hata türlerini ayırt edebilir.",
    "try / except / else / finally bloklarının çalışma sırasını açıklayabilir.",
    "raise ile kontrollü hata üretebilir.",
    "Temel hata ayıklama yöntemlerini uygulayabilir.",
    "Hata mesajlarında bilgi sızdırmanın riskini açıklayabilir.",
  ],
  duration: "≈ 45 dakika",
  sections: [
    {
      title: "Hata (Error) nedir?",
      paras: [
        "Hiçbir program ilk yazımda mükemmel çalışmaz. **Hata**, programın beklenen şekilde çalışmasını engelleyen veya yanlış sonuç üretmesine yol açan durumdur. Hata yapmak öğrenmenin doğal parçasıdır; önemli olan hatayı okumak ve anlamaktır.",
      ],
    },
    {
      title: "Hata türleri: Syntax, Runtime, Logical",
      paras: [
        "**Sözdizimi Hatası (Syntax Error):** Dilin yazım kurallarına uyulmamıştır; program hiç başlamaz. Örnek: kapatılmamış parantez, `if` sonunda `:` unutmak.",
        "**Çalışma Zamanı Hatası (Runtime Error):** Kod geçerlidir ama çalışırken bir sorun çıkar ve program durur. Örnek: sıfıra bölme (`ZeroDivisionError`), olmayan dosya (`FileNotFoundError`), `int(\"abc\")` (`ValueError`), olmayan indeks (`IndexError`).",
        "**Mantık Hatası (Logical Error):** Program hata vermeden çalışır ama yanlış sonuç üretir. En zor bulunan türdür. Örnek: ortalamayı `toplam / 2` ile hesaplamak veya `>=` yerine `>` yazmak.",
      ],
    },
    {
      title: "Exception kavramı",
      paras: [
        "Çalışma zamanında oluşan hatalara **istisna (Exception)** denir. Yakalanmayan bir istisna programı sonlandırır ve **traceback** (hata izi) yazdırır. Traceback'i **alttan yukarı** okuyun: son satır hata türünü ve mesajını, üstündeki satırlar hatanın hangi dosyada ve hangi satırda oluştuğunu gösterir.",
      ],
    },
    {
      title: "try, except, else, finally",
      paras: [
        "`try` bloğu riskli kodu içerir. Hata oluşursa ilgili `except` bloğu çalışır. `else` yalnızca **hata olmadığında** çalışır. `finally` hata olsun olmasın **her durumda** çalışır; dosya kapatma, bağlantı sonlandırma gibi temizlik işleri için kullanılır.",
        "En iyi uygulama: `except` ile mümkün olduğunca **belirli** hata türünü yakalayın (`except ValueError:`). Çıplak `except:` her şeyi yutar ve gerçek hataları gizler.",
      ],
    },
    {
      title: "raise",
      paras: [
        "`raise` ile kendi hatanızı bilinçli olarak üretebilirsiniz: `raise ValueError(\"Port 1-65535 arasında olmalı\")`. Bu, geçersiz girdinin sessizce kabul edilmesi yerine hemen fark edilmesini sağlar (hızlı başarısız ol – fail fast).",
      ],
    },
    {
      title: "Debugging ve hata ayıklama yöntemleri",
      paras: ["Hata ayıklama sistemli bir iştir:"],
      bullets: [
        "Hata mesajını ve traceback'i dikkatle okuyun.",
        "Hatayı tekrar üretin (reproduce) ve en küçük örneğe indirin.",
        "`print()` ile ara değerleri yazdırın veya bir debugger ile adım adım ilerleyin.",
        "Varsayımlarınızı sorgulayın: değişkenin tipi/değeri gerçekten beklediğiniz gibi mi?",
        "Bir seferde yalnızca bir şeyi değiştirin ve yeniden test edin.",
        "Kodu bir başkasına (veya “lastik ördeğe”) satır satır anlatın.",
      ],
    },
    {
      title: "Güvenli hata yönetimi",
      paras: [
        "Kullanıcıya gösterilen hata mesajları uygulamanın iç yapısını sızdırmamalıdır. Veritabanı sorgusu, dosya yolu, yığın izi veya sürüm bilgisi içeren hata mesajları saldırganlara keşif bilgisi verir. Kullanıcıya genel bir mesaj (“İşlem tamamlanamadı”), geliştiriciye ise ayrıntılı kayıt (log) sunulmalıdır.",
        "Ayrıca hata durumunda güvenli varsayılana dönün: doğrulama sırasında bir istisna oluşursa erişim **verilmemelidir** (fail closed). `except: pass` ile hatayı yutarak devam etmek tehlikelidir.",
      ],
    },
  ],
  terms: [
    { tr: "Sözdizimi hatası", en: "Syntax Error", desc: "Yazım kurallarına uyulmadığı için program başlamaz." },
    { tr: "Çalışma zamanı hatası", en: "Runtime Error", desc: "Program çalışırken oluşan hata." },
    { tr: "Mantık hatası", en: "Logical Error", desc: "Hata vermeden yanlış sonuç üretme." },
    { tr: "İstisna", en: "Exception", desc: "Çalışma sırasında oluşan, yakalanabilir hata nesnesi." },
    { tr: "Hata izi", en: "Traceback", desc: "Hatanın oluştuğu çağrı zincirini gösteren çıktı." },
    { tr: "Hata ayıklama", en: "Debugging", desc: "Hatanın sebebini bulup düzeltme süreci." },
    { tr: "Kapalı başarısızlık", en: "Fail Closed", desc: "Hata durumunda erişimi reddetme yaklaşımı." },
  ],
  examples: [
    { title: "ATM", text: "Kart okunamazsa ATM çökmez; “Kart okunamadı” mesajı gösterir ve işlemi güvenle sonlandırır: hata yönetimi." },
    { title: "Hesap makinesi", text: "Bir sayıyı sıfıra bölmeye çalıştığınızda “Hata” göstermesi, ZeroDivisionError'un yakalanmasıdır." },
    { title: "Giriş sayfası", text: "Veritabanı hatası olduğunda ekranda SQL sorgusunun görünmesi bilgi sızıntısıdır; “Şu an giriş yapılamıyor” demek doğrusudur." },
  ],
  code: [
    {
      title: "try / except / else / finally",
      lang: "python",
      code: `def bol(a, b):
    try:
        sonuc = int(a) / int(b)
    except ValueError:
        print("Lütfen sayı girin")
    except ZeroDivisionError:
        print("Sıfıra bölme yapılamaz")
    else:
        print("Sonuç:", sonuc)
    finally:
        print("İşlem bitti")

bol("10", "2")   # Sonuç: 5.0 / İşlem bitti
bol("10", "0")   # Sıfıra bölme... / İşlem bitti
bol("on", "2")   # Lütfen sayı girin / İşlem bitti`,
    },
    {
      title: "raise ile girdi doğrulama (fail fast)",
      lang: "python",
      code: `def port_dogrula(port):
    if not isinstance(port, int):
        raise TypeError("Port sayı olmalı")
    if port < 1 or port > 65535:
        raise ValueError("Port 1-65535 arasında olmalı")
    return port

try:
    port_dogrula(70000)
except ValueError as e:
    print("Geçersiz giriş:", e)`,
    },
  ],
  scenario: {
    title: "Uygulama senaryosu: Hatalı kod incelemesi",
    text: "Bir meslektaşınız size birkaç kısa kod parçası gönderdi. Her birinde farklı türde bir hata var. Göreviniz hata türünü belirlemek, hatalı satırı bulmak ve doğru çözümü öğrenmek.",
    tasks: [
      "Simülatördeki altı kod örneğini sırayla inceleyin.",
      "Her örnek için hata türünü (Syntax / Runtime / Logical) seçin.",
      "Hatalı satırı işaretleyin ve açıklamayı okuyun.",
      "Son bir kontrol: `except: pass` kullanımının güvenlik açısından neden tehlikeli olduğunu açıklayın.",
    ],
  },
  summary: [
    "Üç ana hata türü: sözdizimi, çalışma zamanı ve mantık hatası.",
    "try/except hataları yakalar; else hatasızsa, finally her durumda çalışır.",
    "Belirli istisnaları yakalayın; hataları sessizce yutmayın.",
    "Traceback'i alttan yukarı okuyun.",
    "Kullanıcıya genel, geliştiriciye ayrıntılı hata bilgisi verin.",
  ],
  quiz: [
    q(
      "Aşağıdaki kodda hangi tür hata vardır?\n\nortalama = (a + b + c) / 2   # üç sayının ortalaması isteniyor",
      ["Syntax Error", "Runtime Error", "Logical Error", "Hata yok"],
      2,
      "Kod hatasız çalışır ama üç sayının ortalaması için 3'e bölünmelidir; bu bir mantık hatasıdır.",
    ),
    q(
      "Aşağıdaki çıktı sırası nedir?\n\ntry:\n    print(\"A\")\n    x = 1 / 0\n    print(\"B\")\nexcept ZeroDivisionError:\n    print(\"C\")\nfinally:\n    print(\"D\")",
      ["A B C D", "A C D", "A D", "C D"],
      1,
      "A yazılır, bölme hata verir, B atlanır, except ile C yazılır, finally her durumda D yazar.",
    ),
    q(
      "`print(\"Merhaba\"` (kapanmayan parantez) hangi hata türüdür?",
      ["Runtime Error", "Logical Error", "Syntax Error", "Network Error"],
      2,
      "Yazım kuralı ihlalidir; kod çalışmaya başlamadan hata verir.",
    ),
    q(
      "Bir giriş doğrulama fonksiyonunda veritabanı hatası oluştu. Güvenli yaklaşım hangisidir?",
      [
        "Erişim ver ve devam et",
        "Hatayı yut (`except: pass`) ve sonraki işleme geç",
        "Erişimi reddet, kullanıcıya genel mesaj göster, ayrıntıyı log'a yaz",
        "SQL sorgusunu ve hata ayrıntısını kullanıcıya göster",
      ],
      2,
      "Hata durumunda güvenli varsayılan reddetmektir (fail closed). Ayrıntılı bilgi kullanıcıya değil, loga yazılmalıdır.",
    ),
    q(
      "`int(\"12a\")` hangi istisnayı üretir?",
      ["TypeError", "ValueError", "IndexError", "KeyError"],
      1,
      "Tip doğru (str) ama içeriği sayıya çevrilemez; bu durum ValueError'dır.",
    ),
  ],
};

export default lesson;
