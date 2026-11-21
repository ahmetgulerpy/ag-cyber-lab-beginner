"use client";

import { useState } from "react";
import { Btn, Badge, Callout, LabBox, StepControls, useStepper } from "@/components/ui";
import { OSI } from "@/data/layers";
import { markLab } from "@/lib/storage";

const TOTAL = 15; // 1-7 aşağı, 8 iletim, 9-15 yukarı

function describe(step: number, msg: string): string {
  if (step === 0) return "Mesajı yazıp 'Gönder' ya da 'İleri' düğmesine bas.";
  if (step <= 7) {
    const l = OSI[step - 1];
    const t: Record<number, string> = {
      7: `Uygulama katmanı mesajı protokol diliyle hazırlar: "${msg}".`,
      6: "Sunum katmanı veriyi uygun biçime çevirir ve şifreler/sıkıştırır.",
      5: "Oturum katmanı iki uç arasında bir oturum açar.",
      4: "Taşıma katmanı veriyi segmentlere böler, port numaralarını ve sıra numarasını ekler.",
      3: "Ağ katmanı kaynak ve hedef IP adreslerini ekleyerek paketi oluşturur.",
      2: "Veri Bağlantısı katmanı MAC adreslerini ekleyip çerçeve (frame) oluşturur.",
      1: "Fiziksel katman çerçeveyi bitlere ve sinyale dönüştürür.",
    };
    return `Gönderen · Katman ${l.n} (${l.name}): ${t[l.n]}`;
  }
  if (step === 8) return "Bitler kablo / fiber / radyo dalgası üzerinden alıcıya taşınıyor (010101…).";
  const l = OSI[7 - (step - 8)];
  const t: Record<number, string> = {
    1: "Fiziksel katman sinyali tekrar bitlere çevirir ve çerçeve olarak üst katmana verir.",
    2: "Veri Bağlantısı katmanı MAC adresini kontrol eder, çerçeve başlığını çıkarır.",
    3: "Ağ katmanı hedef IP'nin kendisi olduğunu doğrular ve IP başlığını çıkarır.",
    4: "Taşıma katmanı segmentleri sıralar, eksikleri kontrol eder, port ile doğru uygulamaya yönlendirir.",
    5: "Oturum katmanı oturum bilgisini işler.",
    6: "Sunum katmanı şifreyi çözer ve veriyi açar.",
    7: `Uygulama katmanı mesajı kullanıcıya teslim eder: "${msg}".`,
  };
  return `Alıcı · Katman ${l.n} (${l.name}): ${t[l.n]}`;
}

export default function Lab05() {
  const [msg, setMsg] = useState("Merhaba AG Cyber Lab!");
  const [sel, setSel] = useState<number | null>(null);
  const s = useStepper(TOTAL, 1100);
  const step = s.step;

  const active = step >= 1 && step <= 7 ? OSI[step - 1].n : step >= 9 ? OSI[7 - (step - 8)].n : null;
  const phase = step === 0 ? "bekliyor" : step <= 7 ? "gönderen" : step === 8 ? "iletim" : step < 15 ? "alıcı" : "tamamlandı";

  // Başlıklar (katman 2-7) — dıştan içe
  let chips: number[] = [];
  if (step >= 1 && step <= 7) chips = [7, 6, 5, 4, 3, 2].filter((n) => n >= OSI[step - 1].n);
  else if (step === 8) chips = [7, 6, 5, 4, 3, 2];
  else if (step >= 9) {
    const cur = OSI[7 - (step - 8)].n;
    chips = [7, 6, 5, 4, 3, 2].filter((n) => n > cur);
  }
  const outer = chips.slice().reverse(); // 2..7 (en dış başlık solda)
  const shown = sel ?? active;
  const info = shown ? OSI.find((l) => l.n === shown)! : null;
  const bits = step === 8 || (step >= 1 && step <= 7 && OSI[step - 1].n === 1) || (step === 9);

  const start = () => {
    setSel(null);
    s.play();
    markLab(5);
  };

  const Stack = ({ side }: { side: "send" | "recv" }) => (
    <div className="space-y-1.5">
      <p className="text-center text-xs font-bold uppercase tracking-wide text-muted">{side === "send" ? "Gönderen cihaz" : "Alıcı cihaz"}</p>
      {OSI.map((l) => {
        const isActive = active === l.n && ((side === "send" && step >= 1 && step <= 7) || (side === "recv" && step >= 9));
        const passed =
          side === "send" ? step > 0 && (step > 7 || OSI[step - 1].n <= l.n) && !isActive : step >= 9 && OSI[7 - (step - 8)].n > l.n && !isActive;
        return (
          <button
            key={l.n}
            type="button"
            onClick={() => setSel(l.n)}
            className={`flex w-full items-center gap-2 rounded-lg border px-2 py-2 text-left text-sm transition ${
              isActive ? "border-brand bg-brand text-white shadow-md" : passed ? "border-ok/40 bg-[#E9F5EF]" : "border-line bg-white hover:bg-soft"
            } ${sel === l.n ? "ring-2 ring-accent" : ""}`}
          >
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${isActive ? "bg-white text-brand" : "bg-soft text-brand"}`}>{l.n}</span>
            <span className="min-w-0 flex-1 truncate font-semibold">{l.name}</span>
            <span className={`hidden text-[10px] sm:inline ${isActive ? "text-white/80" : "text-muted"}`}>{l.pdu}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <LabBox title="OSI Katman Simülasyonu">
      <label className="block text-sm font-semibold">
        Göndereceğin mesaj
        <input className="field mt-1" value={msg} maxLength={40} onChange={(e) => { setMsg(e.target.value || "Merhaba"); s.reset(); }} />
      </label>
      <StepControls s={s} total={TOTAL} startLabel="Gönder (Otomatik)" />
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Badge tone={step === 0 ? "muted" : "brand"}>Aşama: {phase}</Badge>
        {step === 0 && <Btn variant="soft" onClick={start}>▶ Hemen Gönder</Btn>}
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2 sm:gap-4">
        <Stack side="send" />
        <div className="flex h-full min-w-[34px] flex-col items-center justify-center pt-8 text-center">
          <div className={`h-full min-h-[200px] w-1.5 rounded-full ${step === 8 ? "bg-warn flow" : "bg-line"}`} />
          <span className="mt-2 text-[10px] font-bold text-muted">KABLO</span>
        </div>
        <Stack side="recv" />
      </div>
      <div className="rounded-xl border border-line bg-white p-3">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Veri paketinin o anki hali</p>
        <div className="flex flex-wrap items-center gap-1 overflow-x-auto font-mono text-[11px]">
          {bits ? (
            <span className="rounded-md bg-ink px-2 py-1 text-white break-all">0100100001100101 0110110001101100 … (bitler)</span>
          ) : (
            <>
              {step > 0 &&
                outer.map((n) => (
                  <span key={n} className="rounded-md px-2 py-1 font-bold text-white" style={{ background: n === 2 ? "#176B87" : n === 3 ? "#1E7A93" : n === 4 ? "#2A8A9D" : "#38A3A5" }}>
                    {OSI.find((l) => l.n === n)!.header}
                  </span>
                ))}
              {step > 0 && <span className="rounded-md border border-warn bg-[#FBF3E2] px-2 py-1 font-bold text-[#8a6218]">VERİ: {msg}</span>}
              {step === 0 && <span className="text-muted">Henüz paket oluşturulmadı.</span>}
            </>
          )}
        </div>
        <p className="mt-3 text-sm text-ink">{describe(step, msg)}</p>
      </div>
      {info ? (
        <div className="rounded-xl border border-brand/25 bg-soft p-4 text-sm">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge>Katman {info.n}</Badge>
            <h4 className="font-bold">{info.name} ({info.en})</h4>
            {sel !== null && <button type="button" onClick={() => setSel(null)} className="ml-auto text-xs font-semibold text-brand underline">Aktif katmanı takip et</button>}
          </div>
          <dl className="grid gap-2 sm:grid-cols-2">
            <div><dt className="font-semibold text-brand">Görevi</dt><dd>{info.role}</dd></div>
            <div><dt className="font-semibold text-brand">Veri birimi (PDU)</dt><dd>{info.pdu}</dd></div>
            <div><dt className="font-semibold text-brand">Örnek protokoller</dt><dd>{info.protocols.join(", ")}</dd></div>
            <div><dt className="font-semibold text-brand">Cihaz / yazılım</dt><dd>{info.devices}</dd></div>
            <div className="sm:col-span-2"><dt className="font-semibold text-brand">Çalışma mantığı</dt><dd>{info.logic}</dd></div>
            <div className="sm:col-span-2"><dt className="font-semibold text-brand">Günlük hayat örneği</dt><dd>{info.example}</dd></div>
          </dl>
        </div>
      ) : (
        <Callout title="Bilgi paneli">Bir katmana tıklayarak görevini, örnek protokollerini ve çalışma mantığını öğren.</Callout>
      )}
      {step === TOTAL && <Callout kind="ok" title="Tamamlandı">Mesaj gönderen cihazda 7→1 kapsüllendi, kabloda bitlere dönüştü ve alıcıda 1→7 kapsül açılarak orijinal haline ulaştı.</Callout>}
    </LabBox>
  );
}
