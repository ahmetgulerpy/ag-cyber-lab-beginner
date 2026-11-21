import type { Lesson } from "../../types";

export const l06: Lesson = {
  id: 6,
  title: "Dosya ve Dosya Uzantıları",
  en: "Files and File Extensions",
  minutes: 40,
  goal: "Dosya, dosya sistemi ve uzantı kavramlarını anlamak; dosya uzantısının tek başına güvenilirlik kanıtı olmadığını ve zararlı dosyalara karşı dikkat edilecek noktaları öğrenmek.",
  learn: [
    "Dosya ve dosya sisteminin ne olduğunu",
    "Dosya adı ve uzantısını, uzantıların neden önemli olduğunu",
    "Metin, görsel, ses, video, arşiv, çalıştırılabilir ve sistem dosyalarını",
    "Dosya türü ile içeriğin farkını",
    "Çift uzantı gibi tuzakları ve güvenli dosya alışkanlıklarını",
  ],
  concepts: [
    {
      title: "Dosya ve dosya sistemi",
      en: "File & File System",
      simple: "Dosya, bilgisayarda bir ad altında saklanan veri parçasıdır: bir fotoğraf, belge, şarkı ya da program. Dosya sistemi ise bu dosyaların diskte düzenli şekilde saklanmasını ve bulunmasını sağlayan düzendir.",
      technical:
        "Dosya sistemi (file system), depolama aygıtında dosyaların nerede durduğunu, adını, boyutunu, yetkilerini ve tarih bilgilerini kaydeden yapıdır. Örnekler: NTFS (Windows), ext4 (Linux), APFS (macOS), FAT32/exFAT (USB bellekler). Klasörler (directory) dosyaları hiyerarşik olarak düzenler. Dosya silindiğinde çoğu zaman veri hemen yok edilmez; yalnızca dosya sistemindeki kaydı kaldırılır.",
      example: "Kütüphane düşün: kitaplar dosyalar, raflar klasörler, kütüphane kataloğu ise dosya sistemidir. Katalogdan kayıt silinse kitap bir süre rafta durabilir.",
      check: {
        q: "Dosya sisteminin temel görevi nedir?",
        options: ["İnternete bağlanmak", "Dosyaların diskte düzenli saklanmasını ve bulunmasını sağlamak", "Ekran çözünürlüğünü ayarlamak", "CPU'yu hızlandırmak"],
        answer: 1,
        explain: "Dosya sistemi, dosyaların konum, ad, boyut ve yetki bilgilerini tutarak erişimi mümkün kılar.",
      },
    },
    {
      title: "Dosya adı ve uzantısı",
      en: "File name & extension",
      simple: "fatura.pdf dosyasında 'fatura' adı, '.pdf' ise uzantıdır. Uzantı işletim sistemine, bu dosyayı hangi programla açması gerektiğini söyleyen ipucudur.",
      technical:
        "Uzantı (file extension) son noktadan sonraki kısımdır. İşletim sistemi dosya ilişkilendirmesi (file association) ile uzantıyı bir programla eşleştirir: .pdf → PDF okuyucu, .docx → Word. Uzantı yalnızca bir etikettir; içeriğin gerçekte ne olduğunu garanti etmez. Gerçek biçim dosyanın başındaki 'magic number' (imza) baytlarıyla anlaşılır: PDF dosyaları %PDF, PNG dosyaları 89 50 4E 47, ZIP dosyaları PK ile başlar.",
      example: "resim.jpg dosyasının adını resim.txt yaparsan Not Defteri açılır ve anlamsız karakterler görürsün; çünkü içerik hâlâ JPEG verisidir, sadece etiket değişmiştir.",
      code: "Dosya adı : rapor.final.docx\nUzantı    : .docx  (son noktadan sonrası)\nİmza (ZIP): 50 4B 03 04  → 'PK'",
      check: {
        q: "Bir dosyanın uzantısını .jpg'den .txt'ye değiştirmek ne yapar?",
        options: ["Dosyayı metne dönüştürür", "Yalnızca etiketi değiştirir; içerik aynı kalır", "Dosyayı şifreler", "Dosyayı küçültür"],
        answer: 1,
        explain: "Uzantıyı değiştirmek içeriği dönüştürmez; sadece işletim sisteminin hangi programı seçeceğini değiştirir.",
      },
    },
    {
      title: "Dosya türleri",
      en: "File types",
      simple: "Dosyalar kullanım amacına göre gruplanır: metin (.txt), belge (.pdf, .docx), görsel (.jpg, .png), ses (.mp3), video (.mp4), arşiv (.zip), çalıştırılabilir (.exe), betik (.bat, .ps1, .py), sistem (.dll) ve web/veri (.html, .json).",
      technical:
        "Çalıştırılabilir dosyalar (.exe, .com, .msi, .scr) doğrudan program olarak çalışır. Betik dosyaları (.bat, .ps1, .vbs, .js, .py) bir yorumlayıcı tarafından satır satır yürütülür. .dll dosyaları, programların ortak kullandığı kod kütüphaneleridir. Arşivler (.zip, .rar, .7z) birden fazla dosyayı sıkıştırarak tek pakette toplar ve zararlı içerik gizlemek için sık kullanılır. Ofis belgeleri (.docx, .xlsm) makro içerebilir.",
      example: "Bir e-postayla gelen .zip içinde fatura.pdf.exe bulunabilir. Arşiv güvenli görünse de içindeki dosya çalıştırılabilir olabilir.",
      check: {
        q: "Aşağıdakilerden hangisi doğrudan çalıştırılabilir bir dosyadır?",
        options: [".png", ".mp3", ".exe", ".txt"],
        answer: 2,
        explain: ".exe dosyaları Windows'ta doğrudan program olarak çalışır; bu yüzden en yüksek dikkat gerektirir.",
      },
    },
    {
      title: "Zararlı dosyalar ve çift uzantı",
      en: "Malicious files & double extension",
      simple: "Saldırganlar zararlı bir programı masum bir belge gibi göstermek için dosya adıyla oynar. 'fatura.pdf.exe' gerçekte bir .exe programıdır; ama Windows uzantıları gizliyorsa sadece 'fatura.pdf' görünebilir.",
      technical:
        "Çift uzantı (double extension) tekniğinde gerçek uzantı son noktadan sonraki kısımdır (.exe), önceki kısım ise yanıltıcıdır. Windows varsayılan olarak bilinen uzantıları gizleyebilir. Ayrıca zararlı dosyalar simge (icon) taklidiyle PDF gibi gösterilebilir. Korunma: uzantıları göster, bilinmeyen kaynaklardan gelen dosyaları açma, beklenmedik arşivleri ve ofis makrolarını etkinleştirme, antivirüs ve e-posta filtresi kullan, şüpheli dosyayı açmadan önce göndericiyle başka bir kanaldan doğrula.",
      example: "Muhasebeden geldiğini iddia eden bir e-postadaki 'Fatura_Nisan.pdf.exe' dosyası klasik bir oltalama (phishing) örneğidir.",
      check: {
        q: "'rapor.docx.exe' dosyasının gerçek türü nedir?",
        options: ["Word belgesi", "Çalıştırılabilir program (.exe)", "Metin dosyası", "Arşiv"],
        answer: 1,
        explain: "Gerçek uzantı son noktadan sonraki kısımdır; bu nedenle dosya bir programdır, belge değildir.",
      },
    },
    {
      title: "Dosya güvenliği alışkanlıkları",
      en: "File security",
      simple: "Dosya güvenliği, hangi dosyayı açacağına bilinçli karar vermektir. Uzantıya bakmak ilk adımdır ama tek başına yeterli değildir.",
      technical:
        "Güvenli alışkanlıklar: 1) Dosya uzantılarını göster. 2) Kaynağı doğrula (beklenen bir dosya mı?). 3) Beklenmedik .exe, .bat, .ps1, .scr, .js dosyalarını çalıştırma. 4) Resmi kaynaklardan indir, hash doğrula. 5) Şüpheli dosyayı kapalı ortamda (sandbox/VirusTotal) incele. 6) İşletim sistemi ve antivirüs güncel kalsın. 7) Önemli verileri yedekle.",
      example: "Yeni bir program indirirken yalnızca resmi sitesini kullanmak, taklit sitelerdeki zararlı sürümlere karşı en etkili önlemlerden biridir.",
      check: {
        q: "Tanımadığın biri e-postayla 'siparis.pdf.exe' gönderdi. En doğru davranış hangisidir?",
        options: ["Hemen açmak", "Açmadan silmek/bildirmek", "Uzantıyı silip açmak", "Arkadaşlara iletmek"],
        answer: 1,
        explain: "Beklenmedik kaynaktan gelen çalıştırılabilir dosya açılmamalı; silinmeli veya bilgi güvenliği ekibine bildirilmelidir.",
      },
    },
  ],
  terms: [
    { tr: "Dosya uzantısı", en: "File Extension", def: "Dosya adının sonundaki tür etiketi." },
    { tr: "Dosya sistemi", en: "File System", def: "Dosyaların diskte düzenlenme biçimi (NTFS, ext4…)." },
    { tr: "Çalıştırılabilir dosya", en: "Executable", def: "Doğrudan program olarak çalışabilen dosya." },
    { tr: "Betik", en: "Script", def: "Yorumlayıcı tarafından çalıştırılan komut dosyası." },
    { tr: "Sihirli sayı", en: "Magic Number", def: "Dosya başındaki, gerçek türü gösteren imza baytları." },
    { tr: "Çift uzantı", en: "Double Extension", def: "Gerçek türü gizleyen aldatıcı adlandırma." },
  ],
  realLife: [
    "Oltalama e-postaları sıklıkla 'fatura', 'kargo', 'özgeçmiş' temalı dosyalar kullanır.",
    "USB'den gelen 'tatil_fotograflari.jpg.exe' gibi dosyalar çift uzantı tuzağıdır.",
    "Telefon galerisi .jpg/.png/.mp4 gibi biçimleri tanıyarak doğru görüntüleyiciyi seçer.",
  ],
  labTitle: "Dosya Uzantısı Tanıma Laboratuvarı",
  labDesc: "15 dosya kartını incele, her birinin türünü ve güvenlik risklerini öğren; ardından fatura.pdf.exe senaryosunda doğru kararı ver.",
  summary: [
    "Dosya sistemi dosyaları düzenler; uzantı yalnızca bir türü işaret eden etikettir.",
    "Uzantıyı değiştirmek içeriği değiştirmez; gerçek tür içerik imzasıyla belirlenir.",
    ".exe, .bat, .ps1, .dll gibi dosyalar yürütülebilir olduğundan yüksek risk taşır.",
    "Çift uzantı ve arşiv içinde gizlenen dosyalar yaygın saldırı yöntemleridir; uzantı tek başına güven kanıtı değildir.",
  ],
  quiz: [
    { q: "'tatil.jpg.bat' dosyasının gerçek uzantısı nedir?", options: [".jpg", ".bat", ".tatil", "Uzantısı yoktur"], answer: 1, explain: "Son noktadan sonra gelen kısım gerçek uzantıdır; .bat bir betik dosyasıdır." },
    { q: "Dosya türünü gerçekte belirleyen nedir?", options: ["Dosya adının uzunluğu", "Dosya içeriğinin biçimi (imza baytları)", "Dosya simgesi", "Klasör adı"], answer: 1, explain: "Uzantı sadece etiket; gerçek biçimi içerik imzası gösterir." },
    { q: "Aşağıdakilerden hangisi kütüphane niteliğinde bir sistem dosyasıdır?", options: [".dll", ".mp3", ".png", ".txt"], answer: 0, explain: ".dll (Dynamic Link Library) programların ortak kullandığı kod parçalarını içerir." },
    { q: "Windows'ta dosya uzantılarını göstermenin güvenlik faydası nedir?", options: ["Dosyalar hızlı açılır", "Çift uzantı gibi aldatmacalar fark edilebilir", "Disk alanı artar", "Virüsleri siler"], answer: 1, explain: "Uzantıları görünce 'fatura.pdf.exe' gibi tuzaklar daha kolay anlaşılır." },
    { q: "Hangisi kayıpsız sıkıştırma kullanan görsel biçimdir?", options: [".png", ".mp3", ".exe", ".ps1"], answer: 0, explain: "PNG, görüntü kalitesini kaybetmeden sıkıştırır." },
  ],
};
