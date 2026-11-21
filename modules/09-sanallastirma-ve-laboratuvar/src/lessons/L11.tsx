"use client";

import { useState } from "react";
import { LessonShell } from "@/components/LessonShell";
import { Callout, InfoCards, ProgressBar, SectionTitle } from "@/components/ui";
import { markLab } from "@/lib/progress";

type Item = { id: string; area: string; value: string; risky: boolean; why: string; options?: { t: string; best?: boolean; why: string }[] };

const ITEMS: Item[] = [
  { id: "net", area: "Test makinesinin ağı", value: "Bridged (ev ağına doğrudan bağlı)", risky: true, why: "Zafiyetli/test makinesi fiziksel ağdaki cihazlara görünür hale gelir.", options: [
    { t: "Host-only veya Internal ağa al", best: true, why: "Makine dış ağdan yalıtılır; yalnızca lab içi iletişim kalır." },
    { t: "Bridged kalsın ama güvenlik duvarı ekle", why: "Yine de fiziksel ağa açık kalır; izolasyon sağlamaz." },
    { t: "NAT'a al ve her portu yönlendir", why: "Yönlendirilen portlar yine dışarıya kapı açar." },
  ] },
  { id: "share", area: "Paylaşılan klasör", value: "Host'un Belgeler klasörü okuma-yazma paylaşımda", risky: true, why: "Guest'teki zararlı bir şey host dosyalarını okuyabilir veya değiştirebilir.", options: [
    { t: "Paylaşılan klasörü kaldır; gerekirse tek seferlik boş klasör, salt okunur", best: true, why: "Host dosyalarına erişimi keser veya en aza indirir." },
    { t: "Klasör kalsın, yalnızca dikkatli kullan", why: "Dikkat tek başına yeterli koruma değildir." },
    { t: "Tüm diski paylaş", why: "Riski büyütür." },
  ] },
  { id: "os", area: "İşletim sistemi", value: "Yıllar önce desteği bitmiş sürüm, güncelleme yok", risky: true, why: "Bilinen güvenlik açıkları kapatılmamıştır.", options: [
    { t: "Güncel, desteklenen sürümü resmî kaynaktan kur ve güncelle", best: true, why: "Bilinen açıklar kapatılmış olur." },
    { t: "Eski sistemi olduğu gibi kullanmaya devam et", why: "Açıklar açık kalır." },
    { t: "Güvenlik güncellemelerini kapat", why: "Riski artırır." },
  ] },
  { id: "snap", area: "Snapshot", value: "Hiç snapshot alınmamış", risky: true, why: "Hata veya zararlı bulaşmasında temiz duruma dönüş yolu yoktur.", options: [
    { t: "Temiz kurulumdan sonra ve riskli işlemden önce snapshot al", best: true, why: "Geri dönüş noktası oluşur." },
    { t: "Snapshot gereksiz; sorun olursa yeniden kurarım", why: "Zaman kaybı ve veri kaybı riski doğurur." },
    { t: "Yalnızca gerçek diski yedekle", why: "Sanal makinenin geri dönüşünü çözmez." },
  ] },
  { id: "iso", area: "ISO kaynağı", value: "Bilinmeyen bir forumdan indirilmiş, doğrulanmamış ISO", risky: true, why: "Değiştirilmiş veya zararlı yazılım içeren bir ISO olabilir.", options: [
    { t: "Resmî siteden yeniden indir ve SHA256 ile doğrula", best: true, why: "Bütünlük ve kaynak güvence altına alınır." },
    { t: "İndirdiğim ISO'yu virüs taramasından geçirip kullan", why: "Tarama değişikliği garanti ile yakalayamaz; resmî kaynak esastır." },
    { t: "Arkadaşım güvendi, kullan", why: "Güven kişiye değil doğrulamaya dayanmalıdır." },
  ] },
  { id: "clip", area: "Pano paylaşımı", value: "Kapalı (Disabled)", risky: false, why: "Pano kapalı olması doğru ve güvenlidir." },
  { id: "kali", area: "Kali imajı", value: "Resmî siteden indirilmiş, SHA256 değeri doğrulanmış", risky: false, why: "İyi uygulama: resmî kaynak ve doğrulama." },
  { id: "disk", area: "Sanal disk", value: "40 GB dinamik disk, host'ta bolca boş yer var", risky: false, why: "Makul bir kaynak yapılandırması; risk yok." },
];

function Topic() {
  return (
    <>
      <Callout kind="tip" title="Güvenlik bir alışkanlıktır">
        En iyi laboratuvar, hatanın seni değil yalnızca sanal makineni etkilediği laboratuvardır. Bu derste riskleri tanıyıp doğru ayarları seçmeyi öğreneceksin.
      </Callout>
      <SectionTitle kicker="Temel kurallar" title="Sanal makinelerde güvenlik" />
      <InfoCards
        items={[
          { icon: "🧱", title: "İzolasyon", body: "Hedef ve test makinelerini Internal veya Host-only ağda tut. Bridged'i gerekmedikçe kullanma." },
          { icon: "🔄", title: "Güncelleme", body: "Hypervisor'u, host işletim sistemini ve guest'leri güncel tut. Desteği bitmiş sistemleri laboratuvara ana makine olarak alma." },
          { icon: "📸", title: "Snapshot kullanımı", body: "Temiz kurulumdan sonra ve riskli değişikliklerden önce snapshot al. Snapshot'ı yedek sanma." },
          { icon: "✅", title: "Güvenilir ISO kaynakları", body: "Yalnızca resmî siteleri kullan. Kali, Ubuntu, VirtualBox, VMware için resmî sayfalar bu modülde bağlantı olarak verildi." },
          { icon: "🔐", title: "SHA256 doğrulama", body: "İndirdiğin dosyanın resmî sayfadaki değerle eşleştiğinden emin ol." },
          { icon: "📁", title: "Paylaşılan klasör ve pano", body: "İkisi de host ile guest arasında köprüdür. Varsayılan olarak kapalı tut." },
          { icon: "🌐", title: "Ağ yapılandırması", body: "Zafiyetli makineleri internete ve fiziksel ağa açma. Gerekmedikçe NAT'ı kapat." },
          { icon: "🏠", title: "Test ve gerçek sistem ayrımı", body: "Laboratuvar sanal ortamdır. Gerçek hesaplarının parolalarını ve kişisel verilerini içinde kullanma." },
        ]}
      />
      <Callout kind="err" title="Yasal sınırlar">
        Yalnızca kendi laboratuvarında veya yazılı izin aldığın sistemlerde test yap. Komşunun, okulun, iş yerinin veya herhangi bir üçüncü tarafın ağında izinsiz tarama ve test yasa dışı olabilir. Sanal makine kullanmak yetki yerine geçmez. Zararlı yazılımı gerçek bilgisayarında çalıştırma.
      </Callout>
    </>
  );
}

function Lab() {
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [flag, setFlag] = useState<Set<string>>(new Set());
  const [fix, setFix] = useState<Record<string, number>>({});
  const risky = ITEMS.filter((i) => i.risky);

  const found = risky.filter((i) => flag.has(i.id)).length;
  const falsePos = ITEMS.filter((i) => !i.risky && flag.has(i.id)).length;
  const fixedOk = risky.filter((i) => i.options?.[fix[i.id]]?.best).length;
  const detectScore = Math.max(0, found * 10 - falsePos * 5);
  const total = Math.max(0, Math.min(100, detectScore + fixedOk * 10));
  const tone = total >= 80 ? "ok" : total >= 50 ? "warn" : "err";

  const toggle = (id: string) => setFlag((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const finish = () => { setPhase(3); markLab("laboratuvar-guvenligi"); };

  return (
    <div className="space-y-6">
      <SectionTitle kicker="Etkileşimli uygulama" title="Hatalı laboratuvarı denetle">Aşağıdaki sanal laboratuvarın yapılandırması hatalı. Önce riskli olanları işaretle, sonra her risk için doğru düzeltmeyi seç.</SectionTitle>
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
        {["1. Riskleri bul", "2. Düzeltmeleri seç", "3. Güvenlik puanı"].map((t, i) => (
          <div key={t} className={`rounded-lg border px-2 py-2 ${phase === i + 1 ? "border-ag-brand bg-ag-brand text-white" : phase > i + 1 ? "border-ag-ok/40 bg-[#edf8f2] text-ag-ok" : "border-ag-line bg-white text-ag-muted"}`}>{t}</div>
        ))}
      </div>

      {phase === 1 && (
        <div className="card space-y-3">
          <p className="text-sm text-ag-muted">Riskli olduğunu düşündüğün ayarları işaretle. Dikkat: bazı ayarlar doğru yapılandırılmış olabilir; yanlış işaretlemek puan kırar.</p>
          {ITEMS.map((i) => (
            <label key={i.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm ${flag.has(i.id) ? "border-ag-err bg-[#fdf0f0]" : "border-ag-line bg-white hover:bg-ag-light"}`}>
              <input type="checkbox" className="mt-1 accent-[#C65353]" checked={flag.has(i.id)} onChange={() => toggle(i.id)} />
              <span><strong>{i.area}:</strong> {i.value}</span>
            </label>
          ))}
          <button type="button" className="btn btn-primary" onClick={() => setPhase(2)}>Devam: düzeltmeleri seç →</button>
        </div>
      )}

      {phase === 2 && (
        <div className="card space-y-4">
          <p className="text-sm text-ag-muted">Gerçekten riskli olan ayarlar için en doğru düzeltmeyi seç. (Riskleri sistem senin yerine belirledi; asıl amaç doğru çözümü seçmek.)</p>
          {risky.map((i) => (
            <fieldset key={i.id} className="space-y-2 rounded-xl border border-ag-line p-3">
              <legend className="px-1 text-sm font-bold text-ag-err">⚠ {i.area}: {i.value}</legend>
              {i.options?.map((o, idx) => (
                <label key={o.t} className={`flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm ${fix[i.id] === idx ? "border-ag-brand bg-ag-light" : "border-ag-line bg-white"}`}>
                  <input type="radio" name={i.id} className="mt-1 accent-[#176B87]" checked={fix[i.id] === idx} onChange={() => setFix({ ...fix, [i.id]: idx })} />
                  {o.t}
                </label>
              ))}
            </fieldset>
          ))}
          <div className="flex justify-between">
            <button type="button" className="btn btn-sm" onClick={() => setPhase(1)}>← Geri</button>
            <button type="button" className="btn btn-primary" disabled={Object.keys(fix).length < risky.length} onClick={finish}>Puanı hesapla</button>
          </div>
        </div>
      )}

      {phase === 3 && (
        <div className="space-y-4">
          <div className="card text-center">
            <p className="text-sm font-semibold text-ag-muted">Laboratuvar güvenlik puanın</p>
            <p className={`text-6xl font-black ${tone === "ok" ? "text-ag-ok" : tone === "warn" ? "text-[#b8801f]" : "text-ag-err"}`}>{total}<span className="text-2xl text-ag-muted">/100</span></p>
            <ProgressBar pct={total} tone={tone} />
            <p className="mt-2 text-sm text-ag-text">Risk tespiti: {found}/{risky.length} · Yanlış alarm: {falsePos} · Doğru düzeltme: {fixedOk}/{risky.length}</p>
          </div>
          <div className="space-y-2">
            {ITEMS.map((i) => {
              const flagged = flag.has(i.id);
              const ok = i.risky ? flagged : !flagged;
              const bestIdx = i.options?.findIndex((o) => o.best) ?? -1;
              const chosen = i.options?.[fix[i.id]];
              return (
                <div key={i.id} className={`rounded-xl border p-3 text-sm ${ok ? "border-ag-ok/40 bg-[#edf8f2]" : "border-ag-err/40 bg-[#fdf0f0]"}`}>
                  <p className="font-bold">{ok ? "✔" : "✘"} {i.area}: {i.value}</p>
                  <p className="text-ag-text">{i.risky ? (flagged ? "Riski doğru tespit ettin. " : "Bu ayarı riskli olarak işaretlemedin. ") : (flagged ? "Bu ayar aslında güvenli; yanlış alarm. " : "Güvenli ayarı doğru bıraktın. ")}{i.why}</p>
                  {i.risky && chosen && <p className="mt-1 text-xs text-ag-text">Seçtiğin düzeltme: <strong>{chosen.t}</strong> — {chosen.best ? "doğru. " : "daha iyi seçenek vardı. "}{chosen.why}{!chosen.best && bestIdx >= 0 && i.options && <> En doğrusu: <strong>{i.options[bestIdx].t}</strong>. {i.options[bestIdx].why}</>}</p>}
                </div>
              );
            })}
          </div>
          <button type="button" className="btn" onClick={() => { setPhase(1); setFlag(new Set()); setFix({}); }}>Yeniden dene</button>
        </div>
      )}
    </div>
  );
}

export default function Lesson11() {
  return <LessonShell slug="laboratuvar-guvenligi" topic={<Topic />} lab={<Lab />} />;
}
