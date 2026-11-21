import { q, type Lesson } from "../types";

const lesson: Lesson = {
  id: 12,
  title: "PowerShell Scripting'e Giriş",
  goal:
    "Windows ekosisteminin güçlü otomasyon kabuğu PowerShell'i tanımak; cmdlet yapısını, pipeline mantığını, değişkenleri, koşulları ve döngüleri öğrenmek; PowerShell'in Windows yönetimi ve siber güvenlikteki rolünü kavramak.",
  outcomes: [
    "PowerShell ile CMD arasındaki temel farkı açıklayabilir.",
    "Fiil-Ad (Verb-Noun) biçimindeki cmdlet yapısını yorumlayabilir.",
    "Get-Command ve Get-Help ile komutları keşfedebilir.",
    "Pipeline ile Where-Object, Select-Object ve Sort-Object kullanımını anlayabilir.",
    "PowerShell'in savunma ve güvenlik izlemedeki rolünü örneklerle anlatabilir.",
  ],
  duration: "≈ 55 dakika",
  sections: [
    {
      title: "PowerShell nedir? CMD ve PowerShell farkı",
      paras: [
        "**PowerShell**, Microsoft tarafından geliştirilen, hem komut satırı kabuğu hem betik dili olan bir otomasyon aracıdır. Windows'ta hazır gelir; PowerShell 7 ile Linux ve macOS'ta da çalışır.",
        "Klasik **CMD**, komutların çıktısını düz metin olarak verir. PowerShell ise komutlar arasında **nesne (object)** aktarır: bir komutun çıktısı özellikleri (property) ve metotları olan nesnelerdir. Bu yüzden metin ayrıştırmaya gerek kalmadan filtreleme, sıralama ve seçme yapılabilir.",
      ],
    },
    {
      title: "Cmdlet kavramı",
      paras: [
        "PowerShell komutlarına **cmdlet** (“komutçuk”) denir ve **Fiil-Ad** düzeniyle adlandırılır: `Get-Process` (süreçleri getir), `Stop-Service` (servisi durdur), `Set-Location` (konum ayarla). Bu tutarlı adlandırma, bilmediğiniz komutları tahmin etmenizi kolaylaştırır. Cmdlet büyük/küçük harfe duyarlı değildir.",
      ],
    },
    {
      title: "Get-Command, Get-Help, Get-Process, Get-Service",
      paras: ["Başlangıçta en çok kullanacağınız cmdlet'ler:"],
      bullets: [
        "`Get-Command` – sistemdeki komutları listeler ve arar (`Get-Command *Service*`).",
        "`Get-Help Get-Process` – komutun açıklamasını, parametrelerini ve örneklerini gösterir.",
        "`Get-Process` – çalışan süreçleri (işlemleri) listeler.",
        "`Get-Service` – Windows servislerini ve durumlarını (Running/Stopped) listeler.",
        "`Get-Date`, `Get-Location`, `Get-ChildItem` – tarih, geçerli konum ve dosya listesi.",
        "`Write-Output` – çıktı üretir (`Write-Host` ise yalnızca ekrana yazar).",
      ],
    },
    {
      title: "Değişkenler",
      paras: [
        "PowerShell değişkenleri `$` ile başlar: `$ad = \"Ayşe\"`, `$sayi = 5`. Tipler dinamik belirlenir, istenirse zorlanabilir: `[int]$sayi = 5`. Otomatik değişken `$_` (veya `$PSItem`), pipeline'daki o anki nesneyi temsil eder.",
      ],
    },
    {
      title: "Pipeline",
      paras: [
        "**Pipeline (`|`)**, bir cmdlet'in çıktısını bir sonrakinin girdisi yapar. Örnek: `Get-Service | Where-Object { $_.Status -eq 'Running' } | Sort-Object Name | Select-Object -First 5`. Bu satır servisleri alır, yalnızca çalışanları filtreler, ada göre sıralar ve ilk beşini seçer.",
      ],
    },
    {
      title: "Koşullar, döngüler ve scriptler",
      paras: [
        "Karşılaştırma operatörleri sembol değil kısaltmadır: `-eq` (eşit), `-ne`, `-gt`, `-lt`, `-ge`, `-le`, `-like`, `-match`. Koşul: `if ($sayi -gt 5) { ... } elseif ... else { ... }`. Döngüler: `foreach ($x in $liste) { ... }`, `for ($i=0; $i -lt 5; $i++) { ... }`, `while ($koşul) { ... }`.",
        "PowerShell betikleri `.ps1` uzantılıdır. Windows varsayılan olarak betik çalıştırmayı **Execution Policy** ile kısıtlar (örn. Restricted, RemoteSigned); bu bir güvenlik önlemidir, tek başına güvenlik sınırı değildir.",
      ],
    },
    {
      title: "Windows otomasyonu ve siber güvenlik",
      paras: [
        "PowerShell kurumsal Windows ortamlarında kullanıcı yönetimi, güncelleme, yapılandırma ve izleme için standarttır. Savunma tarafında olay günlüklerini (`Get-WinEvent`), çalışan süreçleri ve servisleri denetlemek, sistem envanteri çıkarmak için kullanılır.",
        "Aynı güç saldırganlar için de çekicidir; bu yüzden PowerShell Script Block Logging ve Transcription gibi kayıt mekanizmaları savunmada önemlidir. Bu derste tüm komutlar **sanal terminalde simüle edilir**, gerçek Windows sisteminize müdahale edilmez.",
      ],
    },
  ],
  terms: [
    { tr: "Cmdlet", en: "Cmdlet", desc: "Fiil-Ad biçimli yerleşik PowerShell komutu." },
    { tr: "Nesne", en: "Object", desc: "Özellik ve metotları olan veri birimi." },
    { tr: "Boru hattı", en: "Pipeline", desc: "Çıktıyı sonraki komuta nesne olarak aktaran | operatörü." },
    { tr: "Servis", en: "Service", desc: "Arka planda çalışan Windows bileşeni." },
    { tr: "Süreç", en: "Process", desc: "Çalışmakta olan program örneği." },
    { tr: "Çalıştırma ilkesi", en: "Execution Policy", desc: "Hangi betiklerin çalışabileceğini sınırlayan ayar." },
    { tr: "Özellik", en: "Property", desc: "Bir nesnenin değeri (ör. Name, Status)." },
  ],
  examples: [
    { title: "Görev yöneticisi", text: "Görev Yöneticisi'ndeki süreç listesinin komut satırı karşılığı `Get-Process`'tir." },
    { title: "Filtreli liste", text: "“Sadece çalışan servisleri göster” isteği `Get-Service | Where-Object Status -eq Running` ile tek satırda çözülür." },
    { title: "Envanter", text: "Yüzlerce bilgisayardaki yüklü yazılımları listeleyip tek rapora dönüştüren yönetici betiği." },
  ],
  code: [
    {
      title: "Cmdlet ve pipeline",
      lang: "powershell",
      code: `Get-Process | Where-Object { $_.CPU -gt 10 } | Sort-Object CPU -Descending | Select-Object -First 3

Get-Service | Where-Object { $_.Status -eq 'Running' }`,
    },
    {
      title: "Değişken, koşul ve döngü",
      lang: "powershell",
      code: `$esik = 3
$denemeler = @(1, 2, 5, 4)

foreach ($d in $denemeler) {
    if ($d -ge $esik) {
        Write-Output "UYARI: $d deneme eşiği aştı"
    }
    else {
        Write-Output "Normal: $d"
    }
}`,
    },
  ],
  scenario: {
    title: "Uygulama senaryosu: Sanal Windows istasyonu incelemesi",
    text: "Bir olay müdahale ekibi, şüpheli davranan sanal bir Windows iş istasyonunu inceliyor. Çalışan süreçleri ve servisleri listeleyip dikkat çekenleri filtreleyecek.",
    tasks: [
      "`Get-Location`, `Get-Date` ve `Get-ChildItem` ile ortamı tanıyın.",
      "`Get-Process` ve `Get-Service` çıktılarını inceleyin.",
      "`Get-Process | Where-Object CPU -gt 10` ve `Get-Service | Where-Object Status -eq Running` pipeline'larını deneyin.",
      "`Get-Help Get-Process` ile komut açıklamasını okuyun ve `$ad = \"AG\"; Write-Output $ad` ile değişken kullanın.",
    ],
  },
  summary: [
    "PowerShell nesne tabanlıdır; CMD ise metin tabanlıdır.",
    "Cmdlet'ler Fiil-Ad düzenindedir: Get-Process, Set-Location.",
    "Get-Command ve Get-Help komutları keşfetmenin anahtarıdır.",
    "Pipeline nesneleri filtreler, sıralar ve seçer.",
    "PowerShell savunmada güçlü bir izleme ve otomasyon aracıdır; kayıt tutma önemlidir.",
  ],
  quiz: [
    q(
      "PowerShell'i klasik CMD'den ayıran temel özellik hangisidir?",
      [
        "Yalnızca Linux'ta çalışması",
        "Komutlar arasında düz metin yerine nesne aktarması",
        "Hiç betik yazmaya izin vermemesi",
        "Sadece grafik arayüzle çalışması",
      ],
      1,
      "PowerShell cmdlet çıktıları nesnedir; özelliklerine doğrudan erişilerek filtreleme ve sıralama yapılır.",
    ),
    q(
      "Aşağıdakilerden hangisi PowerShell cmdlet adlandırma kuralına uyar?",
      ["process-get", "Get-Process", "GetProcess()", "get_process"],
      1,
      "Cmdlet'ler Fiil-Ad biçimindedir: Get-Process, Set-Location, Stop-Service.",
    ),
    q(
      "`Get-Service | Where-Object { $_.Status -eq 'Running' }` komutu ne yapar?",
      [
        "Tüm servisleri durdurur",
        "Yalnızca durumu Running olan servisleri listeler",
        "Servisleri siler",
        "Yalnızca durmuş servisleri listeler",
      ],
      1,
      "`$_` pipeline'daki o anki servisi temsil eder; Status özelliği Running olanlar filtrelenir.",
    ),
    q(
      "Bilmediğiniz bir cmdlet'in parametrelerini ve örneklerini görmek için hangisi kullanılır?",
      ["Get-Help <cmdlet>", "Stop-Process", "Write-Host", "Clear-Host"],
      0,
      "`Get-Help` yardım sayfasını gösterir; `Get-Command` ise komutları keşfetmek için kullanılır.",
    ),
    q(
      "Aşağıdaki kodun çıktısı nedir?\n\n$d = 4\nif ($d -gt 5) { 'A' } elseif ($d -ge 4) { 'B' } else { 'C' }",
      ["A", "B", "C", "B ve C"],
      1,
      "4 > 5 yanlış; 4 -ge 4 doğru olduğundan 'B' yazılır.",
    ),
  ],
};

export default lesson;
