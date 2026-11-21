"use client";
import { useEffect, useState } from "react";
import { Callout } from "@/components/ui";

type Step = { hl: string[]; title: string; text: string };
const LAYERS: Record<string, { name: string; desc: string }> = {
  user: { name: "Kullanıcı", desc: "Klavye, fare veya dokunmatik ekranla komut veren kişi. İşletim sistemine doğrudan değil, uygulamalar aracılığıyla komut verir." },
  app: { name: "Uygulama", desc: "Not Defteri, tarayıcı, oyun gibi kullanıcı programları. Kullanıcı kipinde (kısıtlı yetkiyle) çalışır ve donanıma doğrudan erişemez." },
  os: { name: "İşletim sistemi hizmetleri (API / Kabuk)", desc: "Uygulamaların dosya açma, süreç başlatma, ağ kullanma gibi isteklerini kabul eden, izinleri denetleyen ve kuralları uygulayan katman." },
  kernel: { name: "Kernel (Çekirdek)", desc: "Tam yetkili çekirdek: süreç zamanlama, bellek yönetimi, dosya sistemi ve sürücüleri yönetir; donanımla doğrudan konuşan tek katmandır." },
  cpu: { name: "CPU (İşlemci)", desc: "Programların talimatlarını çalıştıran beyin. Kernel'ın zamanlayıcısı CPU süresini süreçlere paylaştırır." },
  ram: { name: "RAM (Bellek)", desc: "Çalışan programların ve verilerinin geçici olarak tutulduğu hızlı bellek. Kapanınca silinir." },
  disk: { name: "Depolama (Disk/SSD)", desc: "Dosyaların kalıcı saklandığı birim. Dosya sistemi sayesinde veriler adlarıyla bulunur." },
  net: { name: "Ağ kartı", desc: "Bilgisayarı ağa ve internete bağlayan donanım; sürücü aracılığıyla kernel tarafından yönetilir." },
};

const SCEN: { id: string; name: string; steps: Step[] }[] = [
  { id: "notepad", name: "Not Defteri'ni aç", steps: [
    { hl: ["user"], title: "1. Kullanıcı simgeye çift tıklar", text: "Kullanıcı masaüstündeki Not Defteri simgesine çift tıklar. Bu istek önce kullanıcı arayüzüne ulaşır." },
    { hl: ["user", "app"], title: "2. Masaüstü kabuğu isteği alır", text: "Masaüstü uygulaması (Explorer) 'notepad.exe programını başlat' isteğini hazırlar." },
    { hl: ["app", "os"], title: "3. İşletim sistemine sistem çağrısı", text: "Uygulama, işletim sisteminden süreç oluşturmasını ister. İşletim sistemi kullanıcının bu programı çalıştırma iznini denetler." },
    { hl: ["os", "kernel"], title: "4. Kernel süreci oluşturur", text: "Kernel yeni bir süreç kaydı (PID) açar, bellek haritasını hazırlar ve süreci zamanlayıcı kuyruğuna ekler." },
    { hl: ["kernel", "disk"], title: "5. Program dosyası diskten okunur", text: "Kernel, dosya sistemi sürücüsü aracılığıyla notepad.exe dosyasını depolamadan okur." },
    { hl: ["kernel", "ram"], title: "6. Program RAM'e yüklenir", text: "Program kodu ve verileri RAM'de bu sürece ayrılan korumalı alana yerleştirilir." },
    { hl: ["kernel", "cpu"], title: "7. CPU talimatları çalıştırır", text: "Zamanlayıcı süreci CPU'ya verir; program çalışmaya başlar ve pencere çizilir." },
    { hl: ["app", "user"], title: "8. Pencere kullanıcıya görünür", text: "Not Defteri penceresi ekranda belirir. İstek tüm katmanlardan geçip tamamlandı." },
  ] },
  { id: "save", name: "Dosyayı kaydet", steps: [
    { hl: ["user", "app"], title: "1. Kullanıcı 'Kaydet'e basar", text: "Kullanıcı Not Defteri'nde Ctrl+S'ye basar. Uygulama dosya adı ve içerik bilgisini hazırlar." },
    { hl: ["app", "os"], title: "2. Dosya API'si çağrılır", text: "Uygulama diske kendisi yazmaz; işletim sisteminin dosya yazma hizmetini (sistem çağrısı) kullanır." },
    { hl: ["os"], title: "3. İzin denetimi", text: "İşletim sistemi bu kullanıcının hedef klasöre yazma izni olup olmadığını kontrol eder. İzin yoksa 'Erişim reddedildi' döner." },
    { hl: ["os", "kernel"], title: "4. Kernel dosya sistemini kullanır", text: "Kernel dosya sistemi (NTFS/ext4) sürücüsünü çağırır, boş bloklar ayırır ve dosya kaydını (metadata) oluşturur." },
    { hl: ["kernel", "ram", "disk"], title: "5. Veri RAM'den diske yazılır", text: "İçerik RAM'deki tampondan diske kalıcı olarak yazılır." },
    { hl: ["disk", "kernel", "app"], title: "6. Başarı yanıtı döner", text: "Disk tamamlandı sinyali verir; kernel, işletim sistemi ve uygulama üzerinden kullanıcıya 'Kaydedildi' bilgisi gelir." },
  ] },
  { id: "web", name: "Web sayfası aç", steps: [
    { hl: ["user", "app"], title: "1. Kullanıcı adresi yazar", text: "Kullanıcı tarayıcıya bir adres yazar ve Enter'a basar." },
    { hl: ["app", "os"], title: "2. Ağ isteği (soket) açılır", text: "Tarayıcı, işletim sisteminden ağ bağlantısı kurmasını ister. İşletim sistemi güvenlik duvarı kurallarını uygular." },
    { hl: ["os", "kernel"], title: "3. Kernel ağ yığınını çalıştırır", text: "Kernel adres çözümleme (DNS) ve TCP bağlantısı için ağ protokol yığınını kullanır." },
    { hl: ["kernel", "net"], title: "4. Ağ kartı paketleri gönderir", text: "Kernel, ağ kartı sürücüsüyle paketleri ağa gönderir; sunucudan gelen cevap ağ kartına ulaşır." },
    { hl: ["net", "kernel", "ram"], title: "5. Gelen veri belleğe alınır", text: "Gelen sayfa verisi RAM'deki tampona yazılır ve tarayıcı sürecine iletilir." },
    { hl: ["ram", "cpu", "app"], title: "6. CPU sayfayı çizer", text: "Tarayıcı CPU'yu kullanarak sayfayı işler ve ekrana çizer." },
    { hl: ["app", "user"], title: "7. Sayfa görünür", text: "Web sayfası kullanıcıya görüntülenir." },
  ] },
];

export default function Lab01({ done }: { done: (id: string) => void }) {
  const [sid, setSid] = useState(SCEN[0].id);
  const [step, setStep] = useState(-1);
  const [finished, setFinished] = useState<string[]>([]);
  const [seen, setSeen] = useState<string[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [noOs, setNoOs] = useState(false);
  const sc = SCEN.find((s) => s.id === sid)!;
  const cur = step >= 0 ? sc.steps[step] : null;
  const hl = cur?.hl ?? [];

  useEffect(() => {
    if (step === sc.steps.length - 1 && !finished.includes(sid)) setFinished((f) => [...f, sid]);
  }, [step, sc.steps.length, sid, finished]);
  useEffect(() => { if (finished.length >= 1) done("run1"); if (finished.length >= 2) done("run2"); }, [finished]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (seen.length >= 3) done("layer"); }, [seen]); // eslint-disable-line react-hooks/exhaustive-deps

  const click = (id: string) => { setSel(id); setSeen((s) => (s.includes(id) ? s : [...s, id])); };
  const box = (id: string, extra = "") => (
    <button key={id} onClick={() => click(id)} className={`rounded-xl border-2 px-3 py-2.5 text-left text-sm font-semibold transition ${hl.includes(id) ? "border-accent bg-[#DFF3F3] pulse text-brand" : sel === id ? "border-brand bg-soft" : "border-line bg-white hover:border-brand"} ${extra}`}>
      {LAYERS[id].name}
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold">Senaryo:</span>
        {SCEN.map((s) => (
          <button key={s.id} className={`btn btn-sm ${sid === s.id ? "btn-on" : ""}`} onClick={() => { setSid(s.id); setStep(-1); }}>{s.name}{finished.includes(s.id) ? " ✓" : ""}</button>
        ))}
        <button className={`btn btn-sm ml-auto ${noOs ? "btn-on" : ""}`} onClick={() => { setNoOs((v) => !v); done("noos"); }}>{noOs ? "İşletim sistemini geri getir" : "⚠ İşletim sistemi olmadan"}</button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-2 rounded-xl border border-line bg-bg p-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">Katmanlı mimari (tıklayarak incele)</p>
          {box("user")}
          <div className="text-center text-muted">↕</div>
          {box("app")}
          <div className="text-center text-muted">↕ sistem çağrısı</div>
          <div className={noOs ? "pointer-events-none opacity-30 line-through" : ""}>{box("os", "w-full")}</div>
          <div className="text-center text-muted">↕</div>
          <div className={noOs ? "pointer-events-none opacity-30 line-through" : ""}>{box("kernel", "w-full")}</div>
          <div className="text-center text-muted">↕ sürücüler</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{["cpu", "ram", "disk", "net"].map((i) => box(i))}</div>
        </div>

        <div className="space-y-3">
          {noOs ? (
            <Callout type="danger" title="İşletim sistemi olmadan ne olur?">
              <ul className="list-disc space-y-1 pl-4">
                <li>Her uygulama kendi sürücü kodunu yazmak zorunda kalır.</li>
                <li>İki program aynı anda çalışamaz; biri diğerinin belleğini bozabilir.</li>
                <li>Dosyalar adlarla değil ham disk bloklarıyla saklanır.</li>
                <li>Kullanıcı ve izin kavramı olmaz: her program her şeyi okuyabilir/silebilir.</li>
                <li>Hata ayıklama ve güvenlik denetimi imkânsızlaşır.</li>
              </ul>
            </Callout>
          ) : (
            <div className="card-soft p-3">
              <p className="text-xs font-bold uppercase tracking-wider text-accent">Adım adım istek akışı</p>
              {cur ? (
                <>
                  <p className="mt-1 font-bold text-ink">{cur.title}</p>
                  <p className="mt-1 text-sm text-ink">{cur.text}</p>
                </>
              ) : (
                <p className="mt-1 text-sm text-muted">&quot;{sc.name}&quot; isteğinin hangi katmanlardan geçtiğini görmek için <b>Başlat</b>&apos;a bas.</p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="btn btn-primary btn-sm" onClick={() => setStep((s) => Math.min(s + 1, sc.steps.length - 1))} disabled={step >= sc.steps.length - 1}>{step < 0 ? "▶ Başlat" : "Sonraki adım →"}</button>
                <button className="btn btn-sm" onClick={() => setStep((s) => Math.max(s - 1, -1))} disabled={step < 0}>← Geri</button>
                <button className="btn btn-sm" onClick={() => setStep(-1)}>↺ Tekrar</button>
              </div>
              <p className="mt-2 text-xs text-muted">Adım {Math.max(step + 1, 0)} / {sc.steps.length}</p>
              {step === sc.steps.length - 1 && <p className="mt-2 text-sm font-semibold text-ok">✓ İstek tüm katmanlardan geçerek tamamlandı.</p>}
            </div>
          )}
          {sel && (
            <div className="rounded-xl border border-line bg-white p-3 text-sm">
              <p className="font-bold text-brand">{LAYERS[sel].name}</p>
              <p className="mt-1 text-ink">{LAYERS[sel].desc}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
