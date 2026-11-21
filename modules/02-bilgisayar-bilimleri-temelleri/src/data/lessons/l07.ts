import type { Lesson } from "../../types";

export const l07: Lesson = {
  id: 7,
  title: "İşlem ve İşlemci Mantığı",
  en: "Processes and CPU Logic",
  minutes: 45,
  goal: "Program, process ve thread arasındaki farkı anlamak; işletim sisteminin CPU zamanını işlemler arasında nasıl paylaştırdığını ve process durumlarını öğrenmek.",
  learn: [
    "Program ve process arasındaki farkı",
    "Thread (iş parçacığı) kavramını",
    "Running, Ready, Waiting ve Terminated durumlarını",
    "Context switching ve multitasking'i",
    "Basit CPU zamanlama (scheduling) mantığını",
  ],
  concepts: [
    {
      title: "Program, Process ve Thread",
      en: "Program, Process, Thread",
      simple: "Program diskte duran bir yemek tarifidir. Process (işlem) ise o tarifin mutfakta pişirilmeye başlandığı andır. Thread ise aynı yemeği hazırlarken birlikte çalışan aşçı yardımcılarıdır.",
      technical:
        "Program, diskteki pasif yürütülebilir koddur. Process, belleğe yüklenmiş ve çalışan program örneğidir; kendi adres alanı, PID (Process ID) numarası ve kaynakları vardır. Aynı programdan birden fazla process başlatılabilir (iki tarayıcı penceresi gibi). Thread, bir process içindeki bağımsız yürütme akışıdır; aynı belleği paylaşırlar. Bu yüzden thread'ler hafiftir ama paylaşılan veri nedeniyle dikkatli yönetilmelidir.",
      example: "Bir müzik uygulaması hem arayüzü çizen hem de şarkıyı indiren thread'lere sahip olabilir; böylece indirirken arayüz donmaz.",
      check: {
        q: "Aşağıdakilerden hangisi 'process' tanımına en uygundur?",
        options: ["Diskte duran .exe dosyası", "Belleğe yüklenmiş ve çalışmakta olan program örneği", "Bir klasör", "Bir donanım parçası"],
        answer: 1,
        explain: "Program pasif koddur; çalıştırıldığında kaynak ve PID alan canlı örneğine process denir.",
      },
    },
    {
      title: "Process durumları",
      en: "Process States",
      simple: "Bir işlem hayatı boyunca farklı durumlardan geçer: sırada bekler (Ready), CPU'da çalışır (Running), bir şey için bekler (Waiting), bitince sona erer (Terminated).",
      technical:
        "New: oluşturuluyor. Ready: çalışmaya hazır, CPU bekliyor. Running: CPU'da komut yürütülüyor. Waiting (Blocked): disk okuması, kullanıcı girdisi gibi bir olayı bekliyor; CPU'ya ihtiyaç duymuyor. Terminated: çalışması bitti. Zamanlayıcı (scheduler) hazır kuyruğundan bir işlem seçip CPU'ya atar (dispatch).",
      example: "Bir belge yazarken Word 'Running'dir. Dosya kaydederken diski beklediği anlarda 'Waiting'e geçer ve bu sürede CPU başka bir işleme verilir.",
      code: "New → Ready → Running → Terminated\n           ↑   ↓ (süre doldu)\n           ← Waiting (I/O bekliyor)",
      check: {
        q: "Disk okuması sonucunu bekleyen bir işlem hangi durumdadır?",
        options: ["Running", "Waiting", "Terminated", "Ready"],
        answer: 1,
        explain: "Bir olayı (I/O) bekleyen işlem Waiting (Blocked) durumundadır ve bu sırada CPU'yu kullanmaz.",
      },
    },
    {
      title: "Context Switching ve Multitasking",
      en: "Context Switching & Multitasking",
      simple: "Tek çekirdekli bir CPU aynı anda tek iş yapar; ama işler arasında çok hızlı geçiş yaparak hepsi aynı anda çalışıyormuş gibi görünür. Bu geçiş sırasında kaldığı yer kaydedilir.",
      technical:
        "Context switching (bağlam değişimi), çalışan işlemin CPU kayıtlarını ve durumunu (Process Control Block - PCB) kaydedip sıradaki işlemin durumunu yükleme işlemidir. Maliyetlidir; çok sık yapılırsa performans düşer. Multitasking, birden fazla işlemin belirli zaman dilimleri (time quantum) ile dönüşümlü çalıştırılmasıdır. Çok çekirdekli CPU'larda ise gerçek paralellik sağlanır.",
      example: "Bir öğretmen aynı anda 3 öğrenciyle ilgileniyormuş gibi görünür; aslında her birine sırayla kısa süreler ayırır ve nerede kaldığını not eder.",
      check: {
        q: "Context switching sırasında hangi bilgi kaydedilir?",
        options: ["Ekranın parlaklığı", "Çalışan işlemin kaldığı yer ve CPU kayıtları", "Klavyenin dili", "İnternet hızı"],
        answer: 1,
        explain: "İşlemin sonradan kaldığı yerden devam edebilmesi için CPU kayıtları ve durum bilgisi PCB'ye kaydedilir.",
      },
    },
    {
      title: "CPU zamanlama (Scheduling)",
      en: "CPU Scheduling",
      simple: "Zamanlama, hazır işlemler arasından hangisinin CPU'yu ne kadar süre kullanacağına karar verme işidir. En basit yöntemlerden biri sıra ve dilim sistemidir (Round Robin).",
      technical:
        "FCFS (First Come First Served): ilk gelen ilk çalışır. Round Robin: her işleme sabit bir zaman dilimi (quantum) verilir; süre dolunca işlem kuyruğun sonuna geçer. Öncelikli zamanlama (Priority Scheduling) önemli işleri öne alır. Amaç: adil paylaşım, düşük bekleme süresi ve yüksek verimdir. Gerçek işletim sistemleri bu yöntemlerin karmaşık karışımlarını kullanır; laboratuvar simülasyonu ise basitleştirilmiş Round Robin içerir.",
      example: "Gişedeki sırada herkes 2 dakika hizmet alır; işi bitmeyen sıranın sonuna geçer. Bu Round Robin mantığıdır.",
      check: {
        q: "Round Robin zamanlamada süre dolduğunda işlem ne olur?",
        options: ["Silinir", "Kuyruğun sonuna geçer (Ready)", "Waiting olur", "Bilgisayar kapanır"],
        answer: 1,
        explain: "Zaman dilimi dolan işlem tamamlanmadıysa Ready kuyruğunun sonuna alınır ve sıradaki işlem çalıştırılır.",
      },
    },
  ],
  terms: [
    { tr: "İşlem", en: "Process", def: "Çalışmakta olan program örneği." },
    { tr: "İş parçacığı", en: "Thread", def: "Process içindeki yürütme akışı." },
    { tr: "Bağlam değişimi", en: "Context Switch", def: "CPU'nun bir işlemden diğerine geçerken durumu kaydetmesi." },
    { tr: "Zamanlayıcı", en: "Scheduler", def: "CPU'yu hangi işleme vereceğini seçen işletim sistemi bileşeni." },
    { tr: "Zaman dilimi", en: "Time Quantum", def: "Bir işleme tanınan maksimum kesintisiz CPU süresi." },
    { tr: "İşlem kontrol bloğu", en: "PCB", def: "Bir işlemin tüm durum bilgilerini tutan veri yapısı." },
  ],
  realLife: [
    "Görev Yöneticisi (Task Manager) açıkken çalışan process'leri, PID'lerini ve CPU kullanımlarını görürsün.",
    "Bir uygulama yanıt vermiyor (Not Responding) durumuna girdiğinde genellikle ana thread'i takılmıştır.",
    "Telefondaki arka plan uygulamaları sistemin zamanlayıcısı tarafından askıya alınır veya sınırlı çalıştırılır.",
  ],
  labTitle: "İşlem Yönetimi Simülatörü",
  labDesc: "İşlemler ekle, CPU'yu adım adım ilerlet ve işlemlerin Ready, Running, Waiting ve Terminated durumları arasında geçişini izle.",
  summary: [
    "Program pasif koddur; process çalışan örneğidir; thread process içindeki yürütme akışıdır.",
    "Durumlar: Ready, Running, Waiting, Terminated.",
    "Context switching, işlemler arası geçişte durumu kaydetme/yükleme işlemidir.",
    "Zamanlayıcı CPU'yu adil paylaştırır; Round Robin sabit zaman dilimi kullanır.",
  ],
  quiz: [
    { q: "Bir işlem CPU'da komut yürütürken hangi durumdadır?", options: ["Ready", "Running", "Waiting", "New"], answer: 1, explain: "CPU'yu aktif kullanan işlem Running durumundadır." },
    { q: "Thread'ler aynı process içinde neyi paylaşır?", options: ["Aynı belleği", "Aynı klavyeyi", "Aynı ekranı", "Aynı PID'yi farklı process'lerle"], answer: 0, explain: "Bir process'in thread'leri aynı adres alanını (belleği) paylaşır." },
    { q: "Context switching'in dezavantajı nedir?", options: ["Hafızayı büyütür", "Çok sık yapıldığında zaman kaybettirir", "CPU'yu kapatır", "Dosyaları siler"], answer: 1, explain: "Durumu kaydetme ve yükleme zaman alır; fazla geçiş verimi düşürür." },
    { q: "Hazır kuyruğunda bekleyen ama henüz CPU'ya atanmamış işlem hangi durumdadır?", options: ["Ready", "Waiting", "Terminated", "Running"], answer: 0, explain: "Çalışmaya hazır olup CPU bekleyen işlem Ready durumundadır." },
    { q: "Aynı programın iki penceresi açıldığında ne oluşur?", options: ["Tek process", "İki ayrı process olabilir", "Program silinir", "İşletim sistemi yeniden başlar"], answer: 1, explain: "Aynı programdan birden çok process örneği çalıştırılabilir." },
  ],
};
