import { useEffect, useState } from "react";
import { Power, RotateCcw, CheckCircle2, XCircle, Circle, HelpCircle, Loader2 } from "lucide-react";
import { Btn, Card, Feedback, LabShell, SimNote, Terminal, type LabProps } from "../components/ui";
import { cn } from "../utils/cn";

const stages = [
  { name: "Power On", event: "Güç düğmesine basılır. Güç kaynağı (PSU) 'Power Good' sinyali gönderir ve CPU reset durumundan çıkar.", comp: "Güç kaynağı (PSU), anakart, CPU", why: "Bileşenlerin çalışabilmesi için önce kararlı elektrik gerekir." },
  { name: "Firmware Initialization", event: "CPU ilk komutu anakart üzerindeki firmware'den (BIOS/UEFI) alır; temel donanım denetleyicileri başlatılır.", comp: "BIOS/UEFI firmware", why: "İşletim sistemi daha yokken donanımı hazırlayacak ilk yazılım gerekir." },
  { name: "POST", event: "Power-On Self-Test: CPU, RAM, ekran kartı ve temel aygıtlar test edilir.", comp: "CPU, RAM, GPU, firmware", why: "Bozuk bir donanımla işletim sistemini başlatmak veri kaybı ve kararsızlık yaratır." },
  { name: "Boot Device Detection", event: "Firmware, Boot Order'a göre diskleri tarar ve boot edilebilir bir aygıt arar.", comp: "SSD/HDD/USB, firmware (Boot Order)", why: "İşletim sisteminin nerede olduğunu bilmeden onu yükleyemeyiz." },
  { name: "Bootloader", event: "Bulunan aygıttaki bootloader (Windows Boot Manager, GRUB) çalışır ve yüklenecek işletim sistemini belirler.", comp: "EFI System Partition / MBR, bootloader", why: "Çekirdeği bulup belleğe yükleyecek küçük bir program gerekir." },
  { name: "Kernel Loading", event: "İşletim sistemi çekirdeği (kernel) RAM'e yüklenir; sürücüler, bellek ve process yönetimi başlatılır.", comp: "Kernel, RAM, sürücüler", why: "Donanımı ve kaynakları yönetecek işletim sistemi çekirdeği olmadan sistem çalışamaz." },
  { name: "System Services", event: "Ağ, ses, güvenlik duvarı, güncelleme gibi arka plan servisleri başlatılır.", comp: "Servisler (services/daemons)", why: "Uygulamaların ihtiyaç duyduğu temel hizmetlerin hazır olması gerekir." },
  { name: "Login Screen", event: "Kullanıcıdan kimlik doğrulaması istenir; hesap ve profil bilgileri hazırlanır.", comp: "Giriş yöneticisi (Winlogon/GDM)", why: "Sisteme yalnızca yetkili kullanıcıların erişmesini sağlar (güvenlik)." },
  { name: "Desktop Ready", event: "Kullanıcı profili yüklenir, masaüstü ve başlangıç uygulamaları açılır. Bilgisayar kullanıma hazırdır.", comp: "Masaüstü ortamı (shell), başlangıç uygulamaları", why: "Kullanıcının uygulamalara erişebileceği arayüz sunulur." },
];

type Sc = "normal" | "nodevice" | "post" | "bootloader" | "os";
const scenarios: { id: Sc; label: string; failAt: number; msg: string[]; explain: string }[] = [
  { id: "normal", label: "Normal açılış", failAt: -1, msg: [], explain: "" },
  { id: "nodevice", label: "No bootable device", failAt: 3, msg: ["No bootable device found.", "Insert boot media and press any key..."], explain: "Firmware donanımı başarıyla test etmiş (POST geçti) ama boot edilebilir bir aygıt bulamamıştır. Boot Order, disk bağlantısı veya boş disk gibi nedenler aranır → Boot Device Detection." },
  { id: "post", label: "POST failure", failAt: 2, msg: ["BEEP BEEP BEEP (3 uzun bip)", "Memory test failed: RAM module not detected."], explain: "Donanım testi sırasında RAM hatası saptanmış; bip kodları POST'un hata bildirme yoludur. İşletim sistemine hiç geçilmez → POST." },
  { id: "bootloader", label: "Bootloader error", failAt: 4, msg: ["BOOTMGR is missing", "Press Ctrl+Alt+Del to restart", "— veya —  grub rescue>"], explain: "Disk bulunmuş ama bootloader bozuk ya da yok. Hata mesajı bootloader'a (BOOTMGR/GRUB) aittir → Bootloader." },
  { id: "os", label: "OS loading failure", failAt: 5, msg: ["KERNEL PANIC / BSOD: INACCESSIBLE_BOOT_DEVICE", "Kernel boot device could not be mounted."], explain: "Bootloader çalışmış ve çekirdeği yüklemeye başlamış, ancak çekirdek sistem diskine erişemiyor veya kritik bir sürücü hata veriyor → Kernel Loading." },
];

type Status = "idle" | "running" | "failed" | "success";

export default function Lab10({ done, onComplete }: LabProps) {
  const [sc, setSc] = useState<Sc>("normal");
  const [status, setStatus] = useState<Status>("idle");
  const [stage, setStage] = useState(-1);
  const [guess, setGuess] = useState<number | null>(null);
  const [normalDone, setNormalDone] = useState(false);
  const [diagnosed, setDiagnosed] = useState<Sc[]>([]);

  const scenario = scenarios.find((s) => s.id === sc)!;

  useEffect(() => {
    if (status !== "running") return;
    const t = setTimeout(() => {
      if (stage === scenario.failAt) setStatus("failed");
      else if (stage === stages.length - 1) {
        setStatus("success");
        if (scenario.id === "normal") setNormalDone(true);
      } else setStage(stage + 1);
    }, 1100);
    return () => clearTimeout(t);
  }, [status, stage, scenario]);

  useEffect(() => {
    if (normalDone && diagnosed.length >= 2 && !done) onComplete();
  }, [normalDone, diagnosed, done, onComplete]);

  const start = () => {
    setGuess(null);
    setStage(0);
    setStatus("running");
  };
  const stop = () => {
    setStatus("idle");
    setStage(-1);
    setGuess(null);
  };
  const choose = (s: Sc) => {
    setSc(s);
    setStatus("idle");
    setStage(-1);
    setGuess(null);
  };

  const guessedRight = guess !== null && guess === scenario.failAt;
  const revealed = status === "failed" && guessedRight;

  const diagnose = (i: number) => {
    setGuess(i);
    if (i === scenario.failAt) setDiagnosed((d) => (d.includes(sc) ? d : [...d, sc]));
  };

  const cur = stage >= 0 ? stages[stage] : null;

  const state = (i: number): "done" | "active" | "failed" | "unknown" | "pending" => {
    if (status === "idle") return "pending";
    if (status === "failed") {
      if (i < stage) return "done";
      if (i === stage) return revealed ? "failed" : "unknown";
      return "pending";
    }
    if (status === "success") return "done";
    if (i < stage) return "done";
    if (i === stage) return "active";
    return "pending";
  };

  return (
    <LabShell done={done} title="Lab 10 — Etkileşimli Bilgisayar Açılış Simülatörü">
      <SimNote>Açılış süreci eğitim amacıyla 9 aşamaya basitleştirilmiştir ve tarayıcıda canlandırılır. Gerçek sisteminde hiçbir şey değişmez.</SimNote>
      <Card className="space-y-4">
        <h4 className="font-semibold">1) Senaryo seç ve açılışı başlat</h4>
        <div className="flex flex-wrap gap-2">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => choose(s.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                sc === s.id ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-accent",
                s.id !== "normal" && diagnosed.includes(s.id) && sc !== s.id && "border-ok/60"
              )}
            >
              {s.label}
              {s.id === "normal" ? (normalDone ? " ✓" : "") : diagnosed.includes(s.id) ? " ✓" : ""}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn onClick={start} disabled={status === "running"}>
            {status === "running" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Power className="h-4 w-4" />} Start Boot Sequence
          </Btn>
          <Btn variant="secondary" onClick={stop} disabled={status === "idle"}>
            <RotateCcw className="h-4 w-4" /> Sıfırla
          </Btn>
        </div>

        <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
          <ol className="space-y-1.5">
            {stages.map((s, i) => {
              const st = state(i);
              return (
                <li
                  key={s.name}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm",
                    st === "done" && "border-ok/40 bg-[#f1faf5] text-ink",
                    st === "active" && "border-brand bg-soft font-semibold text-brand",
                    st === "failed" && "border-bad bg-[#fbeeee] font-semibold text-bad",
                    st === "unknown" && "border-warn bg-[#fdf6e7] font-semibold text-[#9a6b14]",
                    st === "pending" && "border-line bg-white text-muted"
                  )}
                >
                  {st === "done" && <CheckCircle2 className="h-4 w-4 shrink-0 text-ok" />}
                  {st === "active" && <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
                  {st === "failed" && <XCircle className="h-4 w-4 shrink-0" />}
                  {st === "unknown" && <HelpCircle className="h-4 w-4 shrink-0" />}
                  {st === "pending" && <Circle className="h-4 w-4 shrink-0" />}
                  <span className="font-mono text-xs opacity-60">{i + 1}</span>
                  {st === "unknown" ? "Hata burada mı?" : s.name}
                </li>
              );
            })}
          </ol>

          <div className="space-y-3">
            {status === "failed" ? (
              <Terminal title="screen — HATA">
                <div className="mb-2 text-[#ee8d8d]">✖ Açılış durduruldu</div>
                {scenario.msg.map((m, i) => (
                  <div key={i}>{m}</div>
                ))}
              </Terminal>
            ) : status === "success" ? (
              <Terminal title="screen">
                <div className="text-[#7fd6a5]">✔ Desktop Ready — Bilgisayar kullanıma hazır.</div>
                <div className="mt-1 text-[#9fb4c0]">Toplam 9 aşama başarıyla tamamlandı.</div>
              </Terminal>
            ) : (
              <Terminal title="boot.log">
                {status === "idle" ? (
                  <div className="text-[#7f9aab]">Bekleniyor… "Start Boot Sequence" butonuna bas.</div>
                ) : (
                  stages.slice(0, stage + 1).map((s, i) => (
                    <div key={i}>
                      {i < stage ? <span className="text-[#7fd6a5]">[ OK ]</span> : <span className="text-[#d69a32]">[ .. ]</span>} {s.name}
                    </div>
                  ))
                )}
              </Terminal>
            )}

            {cur && status !== "failed" && (
              <div className="fade-in space-y-2 rounded-lg border border-line bg-page p-4 text-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-accent">
                  Aşama {stage + 1} / 9 — {cur.name}
                </div>
                <p>
                  <span className="font-semibold">Ne oluyor? </span>
                  {cur.event}
                </p>
                <p>
                  <span className="font-semibold">İlgili bileşen: </span>
                  {cur.comp}
                </p>
                <p>
                  <span className="font-semibold text-brand">Neden gerekli? </span>
                  {cur.why}
                </p>
              </div>
            )}
            {status === "success" && (
              <Feedback tone="ok" title="Açılış tamamlandı">
                Şimdi hata senaryolarını seçip hatanın hangi aşamada oluştuğunu bul.
              </Feedback>
            )}
          </div>
        </div>
      </Card>

      {status === "failed" && (
        <Card className="fade-in space-y-3">
          <h4 className="font-semibold">2) Teşhis: Hata hangi aşamada oluştu?</h4>
          <p className="text-sm text-muted">Ekrandaki mesaja ve hangi aşamaların başarıyla geçildiğine bak; hatalı aşamayı seç.</p>
          <div className="flex flex-wrap gap-2">
            {stages.map((s, i) => (
              <button
                key={s.name}
                disabled={guessedRight}
                onClick={() => diagnose(i)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-sm font-medium",
                  guess === i ? (i === scenario.failAt ? "border-ok bg-[#eef8f2] text-ok" : "border-bad bg-[#fbeeee] text-bad") : "border-line bg-white hover:border-accent"
                )}
              >
                {i + 1}. {s.name}
              </button>
            ))}
          </div>
          {guess !== null && (
            <Feedback tone={guessedRight ? "ok" : "bad"} title={guessedRight ? `Doğru: ${stages[scenario.failAt].name}` : `${stages[guess].name} değil — tekrar dene`}>
              {guessedRight ? scenario.explain : "Hata mesajının hangi bileşene ait olduğunu düşün (firmware mi, disk mi, bootloader mı, kernel mi?). Ayrıca önceki aşamaların başarılı geçtiğini unutma."}
            </Feedback>
          )}
        </Card>
      )}

      <p className="text-xs text-muted">
        Tamamlanma koşulu: normal açılışı bir kez bitir ({normalDone ? "✓" : "—"}) ve en az 2 farklı hata senaryosunu doğru teşhis et ({diagnosed.length}/2).
      </p>
    </LabShell>
  );
}
