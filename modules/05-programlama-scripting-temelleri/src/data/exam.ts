import { q, type Question } from "./types";

export const EXAM_QUESTIONS: Question[] = [
  q(
    "Bir derleyici (compiler) ile yorumlayıcı (interpreter) arasındaki temel fark hangisidir?",
    [
      "Derleyici kodu önceden makine koduna çevirir; yorumlayıcı satır satır çalıştırır",
      "Yorumlayıcı yalnızca donanım için kullanılır",
      "Derleyici hiçbir zaman hata vermez",
      "İkisi aynı işi aynı şekilde yapar, fark yoktur",
    ],
    0,
    "Compiler tüm kaynak kodu önceden çevirip çalıştırılabilir dosya üretir. Interpreter ise kodu çalışma sırasında okuyup yürütür.",
  ),
  q(
    "Bir kayıt formunda şifre en az 10 karakter olmalı. Kontrolü yapan algoritmada hangi karşılaştırma doğrudur?",
    ["uzunluk > 10", "uzunluk >= 10", "uzunluk == 10", "uzunluk < 10 ise kabul et"],
    1,
    "“En az 10” ifadesi 10 dahil ve üzeri demektir; bu nedenle `>=` kullanılır.",
  ),
  q(
    "`x = \"3\"`, `y = 4` iken `int(x) + y` ifadesinin sonucu nedir?",
    ["34", "7", "TypeError", "\"7\""],
    1,
    "int(x) metni 3 sayısına çevirir; 3 + 4 = 7.",
  ),
  q(
    "Aşağıdaki kodun çıktısı nedir?\n\nyas = 20\nuye = False\nif yas >= 18 and uye:\n    print(\"A\")\nelif yas >= 18:\n    print(\"B\")\nelse:\n    print(\"C\")",
    ["A", "B", "C", "A ve B"],
    1,
    "İlk koşul `and` nedeniyle yanlış (uye False). İkinci koşul doğru olduğundan “B” yazılır.",
  ),
  q(
    "Aşağıdaki kod ekrana kaç satır yazdırır?\n\nfor i in range(2, 10, 3):\n    print(i)",
    ["2", "3", "4", "8"],
    1,
    "range(2, 10, 3) → 2, 5, 8; yani üç değer ve üç satır çıktı.",
  ),
  q(
    "`def f(a, b=2): return a * b` fonksiyonu için `f(5)` çağrısının sonucu nedir?",
    ["5", "7", "10", "Hata"],
    2,
    "b parametresi için argüman verilmediğinden varsayılan değer 2 kullanılır: 5 × 2 = 10.",
  ),
  q(
    "Bir listedeki yinelenen IP adreslerini tek tek benzersiz hale getirmek için en uygun yapı hangisidir?",
    ["set (küme)", "tuple", "float", "bool"],
    0,
    "Set tekrarlı elemanları otomatik eler; `set(liste)` benzersiz değerleri verir.",
  ),
  q(
    "Bir sözlükte anahtar var olmayabilir ve program çökmesin istiyorsunuz. Hangi yöntem uygundur?",
    ["d[\"anahtar\"]", "d.get(\"anahtar\", varsayilan)", "d.pop()", "del d"],
    1,
    "`.get()` anahtar yoksa KeyError yerine varsayılan değeri (veya None) döndürür.",
  ),
  q(
    "Bir web uygulaması kullanıcıdan gelen dosya adını `/uygulama/belgeler/` klasörüne ekleyip açıyor. Hangi girdi Path Traversal denemesidir?",
    ["rapor.txt", "../../etc/gizli.conf", "belge_2024.pdf", "notlar/ders1.txt"],
    1,
    "`../` dizileri üst dizine çıkarak izinli klasörün dışına erişmeyi hedefler.",
  ),
  q(
    "Aşağıdaki kod çalıştırıldığında hangi çıktılar sırasıyla oluşur?\n\ntry:\n    n = int(\"abc\")\nexcept ValueError:\n    print(\"X\")\nelse:\n    print(\"Y\")\nfinally:\n    print(\"Z\")",
    ["Y Z", "X Z", "X Y Z", "Z"],
    1,
    "int(\"abc\") ValueError üretir: except → X; else atlanır; finally her zaman çalışır → Z.",
  ),
  q(
    "Kod hata vermeden çalışıyor ama ortalama hesabı yanlış çıkıyor. Bu hangi hata türüdür?",
    ["Syntax Error", "Runtime Error", "Logical Error", "Compiler Error"],
    2,
    "Program çökmeden yanlış sonuç üretiyorsa bu mantık (logical) hatasıdır.",
  ),
  q(
    "Kullanıcıya veritabanı sorgusunu içeren ayrıntılı hata mesajı göstermenin riski nedir?",
    [
      "Sayfa daha yavaş yüklenir",
      "Saldırgana sistemin iç yapısı hakkında bilgi sızdırır",
      "Hata daha kolay düzelir",
      "Hiçbir riski yoktur",
    ],
    1,
    "Ayrıntılı hata mesajları tablo adı, yol, sürüm gibi bilgileri açığa çıkarır. Ayrıntı loga yazılmalı, kullanıcıya genel mesaj verilmelidir.",
  ),
  q(
    "Python'da kullanıcı `input()` ile 15 giriyor. Aşağıdakilerden hangisi sayısal karşılaştırma için doğru yaklaşımdır?",
    [
      "x = input(); if x > 10:",
      "x = int(input()); if x > 10:",
      "x = str(input()); if x > 10:",
      "x = input() + 0",
    ],
    1,
    "input() string döndürür. Sayı karşılaştırması için önce int() ile dönüştürmek gerekir.",
  ),
  q(
    "Bir Bash betiğinde `isim = \"Ali\"` (eşittir çevresinde boşluk) yazılırsa ne olur?",
    [
      "Değişken doğru tanımlanır",
      "Bash `isim` adlı bir komutu çalıştırmaya çalışır ve hata verir",
      "Değişken otomatik silinir",
      "Betik şifrelenir",
    ],
    1,
    "Bash'te atama sırasında `=` çevresinde boşluk olmamalıdır; aksi halde ilk kelime komut sanılır.",
  ),
  q(
    "Bash'te `ls -l | wc -l` komutundaki `|` (pipe) ne yapar?",
    [
      "İlk komutun çıktısını ikinci komuta girdi olarak verir",
      "İki komutu paralel siler",
      "Çıktıyı gizler",
      "Komutu yorum satırı yapar",
    ],
    0,
    "Pipe, soldaki komutun çıktısını sağdaki komutun girdisine bağlar.",
  ),
  q(
    "PowerShell'de çalışan servisleri listelemek için hangi komut doğrudur?",
    [
      "Get-Service | Where-Object { $_.Status -eq 'Running' }",
      "List-Service -running",
      "Service-Get Status=Running",
      "Show Running Services()",
    ],
    0,
    "Get-Service servisleri getirir; Where-Object ile Status özelliği Running olanlar filtrelenir.",
  ),
  q(
    "PowerShell cmdlet adlarının ortak yapısı nedir?",
    ["Ad-Fiil", "Fiil-Ad (Verb-Noun)", "Sadece büyük harf", "Sayı-Harf"],
    1,
    "PowerShell cmdlet'leri Get-Process, Set-Location gibi Fiil-Ad düzenindedir.",
  ),
  q(
    "Aşağıdaki JSON neden hatalıdır?\n\n{ \"ad\": \"Ali\", \"portlar\": [22, 80,] }",
    [
      "Hata yoktur",
      "Dizinin son elemanından sonra virgül bırakılmıştır",
      "Anahtarlar çift tırnaklı yazılmıştır",
      "Dizi kullanılamaz",
    ],
    1,
    "JSON'da son elemandan sonra virgül (trailing comma) geçersizdir.",
  ),
  q(
    "XXE zafiyetine karşı hangisi en doğru savunmadır?",
    [
      "XML ayrıştırıcıda DTD ve harici varlık çözümlemesini kapatmak",
      "Tüm XML dosyalarını büyük harfe çevirmek",
      "Parolaları XML içinde saklamak",
      "Hata mesajlarını artırmak",
    ],
    0,
    "Ayrıştırıcı harici varlıkları çözmezse saldırgan dosya okutamaz veya iç ağa istek attıramaz.",
  ),
  q(
    "Bir log satırında yalnızca `Failed password` ifadesi geçen satırları ve satırdaki IP'yi bulmak için hangi araç/yaklaşım en uygundur? Ayrıca ReDoS riskini azaltmak için ne yapılmalıdır?",
    [
      "Regex kullanılır; iç içe niceleyicilerden kaçınılır ve girdi uzunluğu sınırlandırılır",
      "Regex kullanılmaz; her satır elle okunur",
      "`(a+)+` gibi desenler tercih edilir",
      "Girdi uzunluğu sınırsız bırakılır",
    ],
    0,
    "Regex bu iş için uygundur. ReDoS'u önlemek için iç içe niceleyiciler kullanılmamalı, girdi boyutu sınırlandırılmalıdır.",
  ),
];
