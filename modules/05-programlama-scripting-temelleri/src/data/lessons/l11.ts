import { q, type Lesson } from "../types";

const lesson: Lesson = {
  id: 11,
  title: "Bash Scripting'e Giriş",
  goal:
    "Linux/Unix dünyasının komut kabuğu Bash'i tanımak; temel komutları, değişkenleri, koşulları, döngüleri ve fonksiyonları kullanan basit betikler yazabilmek ve Bash'in sistem yönetimi ile siber güvenlikteki yerini anlamak.",
  outcomes: [
    "Shell, terminal ve Bash kavramlarını ayırt edebilir.",
    "Shebang satırının görevini açıklayabilir.",
    "Değişken tanımlayıp echo ve read ile kullanabilir.",
    "Bash'te if, for ve fonksiyon yapılarını okuyabilir.",
    "Güvenli ve basit bir otomasyon betiğinin adımlarını izleyebilir.",
  ],
  duration: "≈ 55 dakika",
  sections: [
    {
      title: "Bash nedir? Shell ve terminal farkı",
      paras: [
        "**Terminal**, komut yazdığınız ve çıktıyı gördüğünüz pencere/arayüzdür. **Shell (kabuk)** ise yazdığınız komutları yorumlayıp işletim sistemine ileten programdır. **Bash (Bourne Again SHell)** en yaygın Linux shell'idir. Yani terminal pencere, Bash içinde çalışan yorumlayıcıdır.",
      ],
    },
    {
      title: "Temel komutlar",
      paras: ["Günlük kullanılan komutlar:"],
      bullets: [
        "`pwd` – bulunduğunuz dizini yazar.",
        "`ls` – dosyaları listeler (`ls -l` ayrıntılı, `ls -a` gizli dosyalar dahil).",
        "`cd klasör` – dizin değiştirir; `cd ..` bir üste çıkar.",
        "`mkdir klasör` – klasör oluşturur; `touch dosya` – boş dosya oluşturur.",
        "`cat dosya` – dosya içeriğini yazdırır.",
        "`echo \"metin\"` – metni yazdırır; `whoami` – kullanıcı adı; `date` – tarih/saat.",
        "`chmod`, `grep`, `head`, `tail`, `wc` – izin, arama ve metin işleme için ileride sık kullanacağınız komutlar.",
      ],
    },
    {
      title: "Bash script, script dosyaları ve shebang",
      paras: [
        "**Bash script**, komutları bir dosyaya yazıp tek seferde çalıştırmaktır. Dosyanın ilk satırı genellikle **shebang**'dir: `#!/bin/bash`. Bu satır, dosyanın hangi yorumlayıcıyla çalıştırılacağını belirtir. Dosya çalıştırılabilir yapılmalıdır: `chmod +x betik.sh` ve ardından `./betik.sh` ile çalıştırılır (veya `bash betik.sh`).",
      ],
    },
    {
      title: "Değişkenler, echo ve read",
      paras: [
        "Bash'te değişken tanımlarken `=` etrafında **boşluk bırakılmaz**: `isim=\"Ali\"`. Kullanırken başına `$` konur: `echo \"Merhaba $isim\"`. `read` kullanıcıdan girdi alır: `read -p \"Adınız: \" isim`. Değişkenleri çift tırnak içinde kullanmak (`\"$isim\"`) boşluk içeren değerlerde hataları önler ve güvenlik açısından da önerilir.",
        "Komut çıktısını değişkene almak için komut yerine koyma kullanılır: `bugun=$(date +%F)`.",
      ],
    },
    {
      title: "Koşullar, döngüler ve fonksiyonlar",
      paras: [
        "Koşul yazımı: `if [ \"$sayi\" -gt 5 ]; then ... elif ... else ... fi`. Sayısal karşılaştırmalar `-eq -ne -gt -lt -ge -le`, metin karşılaştırmaları `=` ve `!=`'dir. Dosya testleri: `-f` (dosya var mı), `-d` (klasör var mı).",
        "Döngüler: `for i in 1 2 3; do ... done`, `for dosya in *.log; do ... done` ve `while [ koşul ]; do ... done`. Fonksiyon: `selam() { echo \"Merhaba $1\"; }` ve çağrı `selam Ali`. `$1`, `$2` konumsal parametrelerdir (argümanlar).",
        "`$?` son komutun çıkış kodunu verir: 0 başarı, 0 dışı hata anlamına gelir.",
      ],
    },
    {
      title: "Bash ile otomasyon ve güvenlik ilişkisi",
      paras: [
        "Linux sunucuların büyük çoğunluğu Bash ile yönetilir: yedekleme, log döndürme, kullanıcı ekleme, servis kontrolü, güncelleme. Siber güvenlikte Bash; log analizi (`grep`, `awk`), olay müdahalesi, sistem sertleştirme (hardening) kontrol betikleri ve CTF/pentest ortamlarında yaygın kullanılır.",
        "Güvenli betik yazma: değişkenleri tırnakla kullanın, `rm -rf` gibi yıkıcı komutları değişkenle birleştirirken çok dikkatli olun (boş değişken yanlış dizini silebilir), betiklere gereğinden fazla yetki vermeyin, parolaları betik içine yazmayın ve çalıştırmadan önce okuyun. Bu derste komutlar yalnızca **sanal terminalde simüle edilir**; gerçek sisteminize dokunulmaz.",
      ],
    },
  ],
  terms: [
    { tr: "Kabuk", en: "Shell", desc: "Komutları yorumlayıp işletim sistemine ileten program." },
    { tr: "Terminal", en: "Terminal", desc: "Komut yazma ve çıktıyı görme arayüzü." },
    { tr: "Shebang", en: "Shebang (#!)", desc: "Betiğin yorumlayıcısını belirten ilk satır." },
    { tr: "Çıkış kodu", en: "Exit Code", desc: "Bir komutun başarılı (0) veya başarısız olduğunu gösteren sayı." },
    { tr: "Konumsal parametre", en: "Positional Parameter", desc: "Betiğe verilen argümanlar ($1, $2...)." },
    { tr: "Boru", en: "Pipe (|)", desc: "Bir komutun çıktısını diğerine girdi yapar." },
    { tr: "İzin", en: "Permission", desc: "Dosya için okuma/yazma/çalıştırma yetkisi." },
  ],
  examples: [
    { title: "Yedekleme", text: "Her gece belge klasörünü tarihli bir arşive kopyalayan 5 satırlık betik." },
    { title: "Disk alanı uyarısı", text: "Disk doluluğu %90'ı aşınca yöneticiye uyarı yazan betik." },
    { title: "Başarısız giriş özeti", text: "`grep \"Failed password\" auth.log | wc -l` ile başarısız SSH denemelerinin sayısını bulmak." },
  ],
  code: [
    {
      title: "selam.sh – değişken ve read",
      lang: "bash",
      code: `#!/bin/bash
read -p "Adınız: " isim
echo "Merhaba $isim"
echo "Bugün: $(date +%F)"`,
    },
    {
      title: "log_say.sh – koşul, döngü, fonksiyon",
      lang: "bash",
      code: `#!/bin/bash
rapor() {
    echo "== $1 =="
}

rapor "Başarısız giriş özeti"
sayac=0
for satir in FAILED OK FAILED FAILED; do
    if [ "$satir" = "FAILED" ]; then
        sayac=$((sayac + 1))
    fi
done
echo "Toplam başarısız: $sayac"`,
      note: "`$((...))` aritmetik işlem yapar. Köşeli parantez içindeki boşluklar zorunludur.",
    },
  ],
  scenario: {
    title: "Uygulama senaryosu: Sanal terminalde sistem keşfi",
    text: "Yeni katıldığınız bir ekipte size sanal bir Linux ortamı verildi. Hangi kullanıcıyla, hangi dizinde olduğunuzu keşfedecek, klasör oluşturacak ve küçük bir betiği inceleyeceksiniz.",
    tasks: [
      "Sırasıyla `whoami`, `pwd`, `ls` ve `date` komutlarını çalıştırın.",
      "`mkdir rapor`, `cd rapor`, `touch notlar.txt`, `ls` komutlarını deneyin.",
      "`echo \"merhaba\"` ve `cat selam.sh` komutlarını çalıştırın.",
      "Alttaki betik çözümleyicide bir scripti seçip satır satır ilerleyin.",
    ],
  },
  summary: [
    "Terminal arayüz, shell ise komutları yorumlayan programdır.",
    "Betikler shebang ile başlar ve çalıştırma izni gerektirir.",
    "Bash'te atama sırasında `=` çevresinde boşluk olmaz; kullanım için `$` gerekir.",
    "Koşullar `if ... then ... fi`, döngüler `for/while ... do ... done` ile yazılır.",
    "Bash, Linux sistem yönetimi ve güvenlik otomasyonunun temel aracıdır.",
  ],
  quiz: [
    q(
      "Aşağıdakilerden hangisi doğru bir Bash değişken atamasıdır?",
      ["isim = \"Ali\"", "isim=\"Ali\"", "$isim=\"Ali\"", "set isim to Ali"],
      1,
      "Bash'te `=` işaretinin çevresinde boşluk olmamalıdır. `$` yalnızca değeri okurken kullanılır.",
    ),
    q(
      "Betiğin ilk satırındaki `#!/bin/bash` ifadesinin görevi nedir?",
      [
        "Yorum satırı olduğu için hiçbir görevi yoktur",
        "Betiğin Bash yorumlayıcısıyla çalıştırılacağını belirtir",
        "Betiği şifreler",
        "Betiği otomatik silmek",
      ],
      1,
      "Shebang, işletim sistemine dosyanın hangi yorumlayıcıyla çalıştırılacağını söyler.",
    ),
    q(
      "Aşağıdaki betik ne yazar?\n\nsayi=7\nif [ \"$sayi\" -gt 5 ]; then\n    echo \"büyük\"\nelse\n    echo \"küçük\"\nfi",
      ["büyük", "küçük", "7", "Hata"],
      0,
      "`-gt` “büyüktür” demektir; 7 > 5 doğru olduğundan “büyük” yazılır.",
    ),
    q(
      "Bir betikte `rm -rf $klasor/*` komutu var ve `klasor` değişkeni boş kalırsa ne olabilir?",
      [
        "Hiçbir şey olmaz",
        "Komut `/*` haline gelip beklenmedik, tehlikeli dizinleri hedefleyebilir",
        "Betik otomatik olarak durur",
        "Sadece uyarı verir",
      ],
      1,
      "Boş değişken yol kaymasına yol açar. Yıkıcı komutlardan önce değişkenin dolu olduğu doğrulanmalıdır.",
    ),
    q(
      "Bir komut başarıyla tamamlandığında `$?` değişkeni genellikle hangi değeri alır?",
      ["0", "1", "-1", "true"],
      0,
      "Unix'te çıkış kodu 0 başarıyı, 0 dışındaki değerler hatayı gösterir.",
    ),
  ],
};

export default lesson;
