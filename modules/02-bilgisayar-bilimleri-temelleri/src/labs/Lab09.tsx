import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, RotateCcw, Save } from "lucide-react";
import { Btn, Card, Feedback, LabShell, SimNote, Terminal, type LabProps } from "../components/ui";
import { cn } from "../utils/cn";

type Tab = "cpu" | "ram" | "storage" | "boot" | "secure" | "mode";
const tabs: { id: Tab; label: string }[] = [
  { id: "cpu", label: "CPU Bilgisi" },
  { id: "ram", label: "RAM Bilgisi" },
  { id: "storage", label: "Storage" },
  { id: "boot", label: "Boot Order" },
  { id: "secure", label: "Secure Boot" },
  { id: "mode", label: "UEFI Mode" },
];

interface Dev {
  id: string;
  name: string;
  bootable: boolean;
}
const defaultDevs: Dev[] = [
  { id: "usb", name: "USB Flash Drive (boş bellek)", bootable: false },
  { id: "dvd", name: "DVD-ROM (disk takılı değil)", bootable: false },
  { id: "ssd", name: "Windows Boot Manager — NVMe SSD (GPT)", bootable: true },
  { id: "pxe", name: "Network PXE Boot", bootable: false },
];

const causes: { t: string; ok: boolean; why: string }[] = [
  { t: "Boot Order'da işletim sistemi içeren disk yok veya yanlış sırada", ok: true, why: "Firmware yalnızca Boot Order'daki aygıtlarda bootloader arar; doğru disk listede yoksa 'bootable device' bulamaz." },
  { t: "UEFI/Legacy modu disk bölümleme düzeniyle (GPT/MBR) uyumsuz", ok: true, why: "GPT disk Legacy/CSM modunda açılamaz; MBR disk de saf UEFI modunda sorun çıkarabilir." },
  { t: "Disk bağlantısı gevşek, kablo kopuk ya da disk arızalı", ok: true, why: "Firmware diski hiç göremiyorsa bootloader da bulunamaz; Storage ekranında disk görünmez." },
  { t: "Bootloader/EFI bölümü bozulmuş veya silinmiş", ok: true, why: "Disk görünse de içinde çalıştırılacak geçerli bir bootloader yoksa sistem açılamaz." },
  { t: "Monitörün parlaklığı düşük", ok: false, why: "Parlaklık görüntüyü etkiler; firmware'in boot aygıtı bulmasıyla ilgisi yoktur." },
  { t: "Klavyenin dil düzeni yanlış", ok: false, why: "Klavye düzeni işletim sistemi yüklendikten sonra anlamlıdır, boot aygıtı bulma sürecini etkilemez." },
  { t: "Tarayıcının güncel olmaması", ok: false, why: "Tarayıcı bir uygulamadır ve işletim sistemi açıldıktan sonra çalışır; boot aşamasıyla ilgisizdir." },
];

export default function Lab09({ done, onComplete }: LabProps) {
  const [tab, setTab] = useState<Tab>("cpu");
  const [visited, setVisited] = useState<Tab[]>(["cpu"]);
  const [devs, setDevs] = useState<Dev[]>(defaultDevs);
  const [secure, setSecure] = useState(true);
  const [uefi, setUefi] = useState(true);
  const [log, setLog] = useState<string[] | null>(null);
  const [sel, setSel] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);

  const allCorrect = causes.every((c, i) => c.ok === sel.includes(i));

  useEffect(() => {
    if (visited.length === tabs.length && checked && allCorrect && !done) onComplete();
  }, [visited, checked, allCorrect, done, onComplete]);

  const open = (t: Tab) => {
    setTab(t);
    setVisited((v) => (v.includes(t) ? v : [...v, t]));
  };

  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= devs.length) return;
    const a = [...devs];
    [a[i], a[j]] = [a[j], a[i]];
    setDevs(a);
  };

  const setMode = (u: boolean) => {
    setUefi(u);
    if (!u) setSecure(false);
  };

  const saveExit = () => {
    const l: string[] = ["[SİMÜLASYON] Ayarlar kaydedildi (gerçek donanıma yazılmadı). Yeniden başlatılıyor…", "POST ... OK (CPU, RAM, Storage)", `Mod: ${uefi ? "UEFI" : "Legacy/CSM"} · Secure Boot: ${secure ? "Açık" : "Kapalı"}`];
    let booted = false;
    for (const d of devs) {
      l.push(`Boot deneniyor: ${d.name}`);
      if (!d.bootable) {
        l.push("  → Boot edilebilir ortam bulunamadı, sıradaki aygıt deneniyor.");
        continue;
      }
      if (!uefi) {
        l.push("  → HATA: Disk GPT bölümlü; Legacy/CSM modu GPT disklerden başlatamaz.");
        continue;
      }
      l.push("  → EFI bootloader bulundu (bootmgfw.efi).");
      if (secure) l.push("  → Secure Boot: bootloader imzası doğrulandı ✔");
      l.push("  → İşletim sistemi yükleniyor… BAŞARILI ✔");
      booted = true;
      break;
    }
    if (!booted) l.push("✖ No bootable device found. Boot sırasını veya UEFI/Legacy modunu kontrol edin.");
    setLog(l);
  };

  const reset = () => {
    setDevs(defaultDevs);
    setSecure(true);
    setUefi(true);
    setLog(null);
  };

  const toggleCause = (i: number) => {
    if (checked && allCorrect) return;
    setChecked(false);
    setSel((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
  };

  const Row = ({ k, v }: { k: string; v: string }) => (
    <div className="flex justify-between gap-4 border-b border-[#223645] py-1.5 last:border-0">
      <span className="text-[#7f9aab]">{k}</span>
      <span className="text-right text-[#e8f3f7]">{v}</span>
    </div>
  );

  return (
    <LabShell done={done} title="Lab 09 — BIOS/UEFI Simülasyonu">
      <SimNote>Bu arayüz tamamen simülasyondur; gerçek bilgisayarınızın BIOS/UEFI ayarlarına erişmez veya değiştirmez. Değerler örnek amaçlıdır.</SimNote>
      <Card className="space-y-4">
        <h4 className="font-semibold">1) UEFI ayar ekranı — {visited.length}/{tabs.length} bölüm gezildi</h4>
        <div className="overflow-hidden rounded-lg border border-[#223645] bg-[#0f1f2b] font-mono text-[13px] text-[#cfe3ec]">
          <div className="bg-[#176B87] px-3 py-1.5 text-center text-xs font-bold tracking-wider text-white">AG CYBER LAB — EDUCATIONAL UEFI SETUP UTILITY</div>
          <div className="flex flex-wrap border-b border-[#223645] bg-[#152a38]">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => open(t.id)}
                className={cn("px-3 py-2 text-xs transition-colors", tab === t.id ? "bg-[#0f1f2b] text-[#8fd3d4]" : "text-[#7f9aab] hover:text-white")}
              >
                {t.label}
                {visited.includes(t.id) && tab !== t.id ? " ✓" : ""}
              </button>
            ))}
          </div>
          <div className="min-h-[220px] p-4">
            {tab === "cpu" && (
              <div className="space-y-3">
                <Row k="İşlemci" v="AG Edu Core i5-X (örnek)" />
                <Row k="Çekirdek / Thread" v="6 / 12" />
                <Row k="Saat hızı" v="3.2 GHz (Boost 4.4 GHz)" />
                <Row k="Cache" v="L1 384 KB · L2 7.5 MB · L3 18 MB" />
                <Row k="Mimari" v="x64 (64-bit)" />
                <p className="pt-2 text-xs text-[#7f9aab]">Firmware, CPU'yu tanır ve POST'ta test eder. Bu bilgiler yalnızca okunabilir.</p>
              </div>
            )}
            {tab === "ram" && (
              <div className="space-y-3">
                <Row k="Toplam bellek" v="16 GB DDR4" />
                <Row k="Slot 1" v="8 GB · 3200 MHz" />
                <Row k="Slot 2" v="8 GB · 3200 MHz" />
                <Row k="Slot 3 / 4" v="Boş" />
                <Row k="Bellek testi" v="POST: Başarılı" />
                <p className="pt-2 text-xs text-[#7f9aab]">RAM bulunamazsa POST başarısız olur ve genelde bip kodu duyulur.</p>
              </div>
            )}
            {tab === "storage" && (
              <div className="space-y-3">
                <Row k="SATA/NVMe 1" v="NVMe SSD 512 GB (GPT)" />
                <Row k="SATA 2" v="Bağlı değil" />
                <Row k="Optik sürücü" v="Takılı değil" />
                <Row k="USB" v="Flash bellek (boş, boot edilemez)" />
                <p className="pt-2 text-xs text-[#7f9aab]">Disk bu listede görünmüyorsa kablo, bağlantı veya disk arızası olabilir.</p>
              </div>
            )}
            {tab === "boot" && (
              <div className="space-y-2">
                <p className="text-xs text-[#7f9aab]">Sıralamayı ok butonlarıyla değiştir. Firmware yukarıdan aşağıya dener.</p>
                {devs.map((d, i) => (
                  <div key={d.id} className="flex items-center gap-2 rounded border border-[#223645] bg-[#152a38] px-2 py-1.5">
                    <span className="w-5 text-[#8fd3d4]">{i + 1}.</span>
                    <span className="flex-1 break-words">{d.name}</span>
                    <button aria-label="Yukarı taşı" onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-1 hover:bg-[#223645] disabled:opacity-30">
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button aria-label="Aşağı taşı" onClick={() => move(i, 1)} disabled={i === devs.length - 1} className="rounded p-1 hover:bg-[#223645] disabled:opacity-30">
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {tab === "secure" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded border border-[#223645] bg-[#152a38] p-3">
                  <div>
                    <div>Secure Boot</div>
                    <div className="text-xs text-[#7f9aab]">{uefi ? "Yalnızca imzalı bootloader'lara izin verir." : "Legacy modunda kullanılamaz (UEFI gerekir)."}</div>
                  </div>
                  <button
                    role="switch"
                    aria-checked={secure}
                    disabled={!uefi}
                    onClick={() => setSecure((s) => !s)}
                    className={cn("rounded px-3 py-1 text-xs font-bold", secure ? "bg-[#25845B] text-white" : "bg-[#223645] text-[#9fb4c0]", !uefi && "opacity-40")}
                  >
                    {secure ? "ENABLED" : "DISABLED"}
                  </button>
                </div>
                <p className="text-xs text-[#9fb4c0]">
                  {secure ? "✔ Açılış zinciri doğrulanır: imzasız veya değiştirilmiş bootloader (bootkit) engellenir." : "⚠ Secure Boot kapalı: imzası doğrulanmamış açılış yazılımları çalışabilir. Güvenlik riski artar."}
                </p>
              </div>
            )}
            {tab === "mode" && (
              <div className="space-y-3">
                <p className="text-xs text-[#7f9aab]">Firmware'in çalışma modu:</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    { u: true, t: "UEFI Mode", d: "GPT, Secure Boot, hızlı açılış" },
                    { u: false, t: "Legacy / CSM Mode", d: "Eski BIOS uyumu, MBR disk" },
                  ].map((m) => (
                    <button
                      key={m.t}
                      onClick={() => setMode(m.u)}
                      className={cn("rounded border p-3 text-left", uefi === m.u ? "border-[#38A3A5] bg-[#18363f] text-white" : "border-[#223645] bg-[#152a38] text-[#9fb4c0]")}
                    >
                      <div className="font-bold">{uefi === m.u ? "◉" : "○"} {m.t}</div>
                      <div className="text-xs">{m.d}</div>
                    </button>
                  ))}
                </div>
                {!uefi && <p className="text-xs text-[#d69a32]">⚠ Legacy modunda Secure Boot kapatıldı. Disk GPT ise bu modda açılış başarısız olacaktır.</p>}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 border-t border-[#223645] bg-[#152a38] p-2.5">
            <button onClick={saveExit} className="inline-flex items-center gap-1.5 rounded bg-[#38A3A5] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#2f8c8e]">
              <Save className="h-3.5 w-3.5" /> F10: Kaydet ve Çık (Simülasyon)
            </button>
            <button onClick={reset} className="inline-flex items-center gap-1.5 rounded border border-[#2f4757] px-3 py-1.5 text-xs text-[#cfe3ec] hover:bg-[#223645]">
              <RotateCcw className="h-3.5 w-3.5" /> Varsayılanlara Dön
            </button>
          </div>
        </div>
        {log && (
          <Terminal title="boot-simulation">
            {log.map((l, i) => (
              <div key={i} className={l.startsWith("✖") || l.includes("HATA") ? "text-[#ee8d8d]" : l.includes("BAŞARILI") ? "text-[#7fd6a5]" : ""}>
                {l}
              </div>
            ))}
          </Terminal>
        )}
        <p className="text-xs text-muted">Deneme önerisi: UEFI Mode'u Legacy yap ve "Kaydet ve Çık" ile ne olduğunu gör. Sonra SSD'yi boot sırasında ilk sıraya al.</p>
      </Card>

      <Card className="space-y-4">
        <h4 className="font-semibold">2) Senaryo: "Boot edilebilir bir disk bulunamadı"</h4>
        <div className="rounded-lg border border-warn/40 bg-[#fdf6e7] p-4 text-sm">
          Bilgisayar açıldığında ekranda şu mesaj görünüyor: <span className="font-mono font-bold">"No bootable device found"</span>. Olası nedenleri işaretle (birden fazla olabilir).
        </div>
        <div className="grid gap-2">
          {causes.map((c, i) => {
            const on = sel.includes(i);
            return (
              <label
                key={i}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm",
                  !checked && (on ? "border-brand bg-soft" : "border-line hover:border-accent"),
                  checked && c.ok && on && "border-ok bg-[#eef8f2]",
                  checked && c.ok && !on && "border-warn bg-[#fdf6e7]",
                  checked && !c.ok && on && "border-bad bg-[#fbeeee]",
                  checked && !c.ok && !on && "border-line opacity-60"
                )}
              >
                <input type="checkbox" checked={on} onChange={() => toggleCause(i)} className="mt-1 h-4 w-4 accent-[#176B87]" />
                <span>
                  {c.t}
                  {checked && (
                    <span className="mt-1 block text-xs text-muted">
                      {c.ok ? (on ? "✔ Doğru: " : "⚠ Gözden kaçtı: ") : on ? "✖ Yanlış: " : ""}
                      {(c.ok || on) && c.why}
                    </span>
                  )}
                </span>
              </label>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn onClick={() => setChecked(true)} disabled={sel.length === 0}>
            Cevabı Kontrol Et
          </Btn>
          <Btn
            variant="secondary"
            onClick={() => {
              setSel([]);
              setChecked(false);
            }}
          >
            <RotateCcw className="h-4 w-4" /> Temizle
          </Btn>
        </div>
        {checked && (
          <Feedback tone={allCorrect ? "ok" : "bad"} title={allCorrect ? "Tam isabet!" : "Eksik veya hatalı seçim var"}>
            {allCorrect
              ? "Boot hatalarında önce firmware'in diski görüp görmediğine, sonra Boot Order'a, UEFI/Legacy ve disk düzeni uyumuna, en son bootloader'ın sağlamlığına bakılır."
              : "Renkli kutulara bakarak neyi kaçırdığını veya yanlış işaretlediğini gör, ardından seçimini düzeltip tekrar dene."}
          </Feedback>
        )}
        {allCorrect && checked && visited.length < tabs.length && <p className="text-xs text-muted">Tamamlamak için BIOS ekranındaki tüm {tabs.length} sekmeyi gez ({visited.length}/{tabs.length}).</p>}
      </Card>
    </LabShell>
  );
}
