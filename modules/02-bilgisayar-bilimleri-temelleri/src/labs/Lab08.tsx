import { useEffect, useState, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Btn, Card, Feedback, LabShell, SimNote, type LabProps } from "../components/ui";

type Id = "cpu" | "ram" | "storage" | "io" | "addr" | "data" | "ctrl";

const info: Record<Id, { name: string; text: string; comm: string }> = {
  cpu: { name: "CPU (İşlemci)", text: "Komutları yürüten merkezdir. Control Unit komutları getirip çözer; ALU hesaplama yapar; kayıtlar (register) ve Program Counter (sıradaki komutun adresi) burada bulunur.", comm: "RAM ile Address, Data ve Control Bus üzerinden konuşur; I/O birimleriyle de aynı yollarla iletişim kurar." },
  ram: { name: "RAM (Ana Bellek)", text: "Von Neumann mimarisinde hem çalışan programın komutlarını hem de verilerini tutar. Her hücrenin bir adresi vardır.", comm: "CPU adres gönderir (Address Bus), veri/komut Data Bus ile taşınır, okuma/yazma yönü Control Bus ile belirlenir." },
  storage: { name: "Depolama (SSD/HDD)", text: "Programlar ve veriler kalıcı olarak burada saklanır. RAM'den çok daha yavaştır.", comm: "Çalıştırılacak program önce depolamadan RAM'e yüklenir; CPU depolamadan doğrudan komut çalıştırmaz." },
  io: { name: "Giriş/Çıkış (I/O) Birimleri", text: "Klavye, fare, ekran, ağ kartı gibi dış dünya ile iletişimi sağlayan aygıtlar ve denetleyicileridir.", comm: "I/O denetleyicileri aynı veri yollarına bağlıdır; aygıtlar kesme (interrupt) ile CPU'nun dikkatini çeker." },
  addr: { name: "Address Bus (Adres Yolu)", text: "CPU'nun hangi bellek hücresine veya aygıta erişeceğini belirten adresi taşır. Tek yönlüdür: CPU → bellek/aygıt. Genişliği adreslenebilir bellek miktarını belirler (32 bit = 4 GiB).", comm: "Yalnızca CPU adres yayınlar; RAM ve I/O bu adresi dinler." },
  data: { name: "Data Bus (Veri Yolu)", text: "Asıl veriyi ve komutları taşır. Çift yönlüdür: okuma sırasında bellekten CPU'ya, yazma sırasında CPU'dan belleğe akar.", comm: "CPU, RAM ve I/O arasında veri taşır; genişliği her seferinde aktarılan bit sayısını belirler." },
  ctrl: { name: "Control Bus (Kontrol Yolu)", text: "Okuma/Yazma (READ/WRITE), saat (clock), kesme (interrupt) ve reset gibi kontrol sinyallerini taşır.", comm: "Veri yolunun ne zaman ve hangi yönde kullanılacağını koordine eder." },
};

const flow: { title: string; text: string; hi: Id[] }[] = [
  { title: "1. Komut adresi gönderilir", text: "Program Counter'daki adres (örn. 0x100) Address Bus'a konur. CPU, sıradaki komutun hangi bellek hücresinde olduğunu belirtir.", hi: ["cpu", "addr", "ram"] },
  { title: "2. READ sinyali", text: "Control Bus'tan 'oku' (READ) sinyali gönderilir. RAM adresteki hücreyi okumaya hazırlanır.", hi: ["cpu", "ctrl", "ram"] },
  { title: "3. Komut CPU'ya gelir (Fetch)", text: "RAM'deki komut (örn. 'ADD A, B') Data Bus ile CPU'ya taşınır. Von Neumann mimarisinde komut ve veri aynı yoldan gelir.", hi: ["ram", "data", "cpu"] },
  { title: "4. Komut çözülür (Decode)", text: "Control Unit komutun ne yapılacağını anlar: A ve B değerleri toplanacak. Bu aşama CPU içinde gerçekleşir.", hi: ["cpu"] },
  { title: "5. Veri getirilir (Operand fetch)", text: "Gerekli veri için yeni bir adres (örn. 0x200) yayınlanır ve veri RAM'den Data Bus ile CPU'ya gelir. Komut ve veri yolu paylaşıldığından bu işlem bir önceki ile aynı anda yapılamaz — Von Neumann darboğazı.", hi: ["cpu", "addr", "ram", "data"] },
  { title: "6. İşlem yürütülür (Execute)", text: "ALU, A + B toplamını hesaplar. Sonuç CPU kaydında (register) bekler.", hi: ["cpu"] },
  { title: "7. Sonuç belleğe yazılır", text: "CPU adresi Address Bus'a, sonucu Data Bus'a, WRITE sinyalini Control Bus'a koyar. RAM sonucu saklar.", hi: ["cpu", "addr", "data", "ctrl", "ram"] },
  { title: "8. Çıktı aygıtına gönderilir", text: "Sonuç gerekirse I/O yoluyla ekrana gönderilir. Komut döngüsü tamamlanır, Program Counter bir sonraki komuta ilerler.", hi: ["cpu", "data", "io"] },
];

export default function Lab08({ done, onComplete }: LabProps) {
  const [sel, setSel] = useState<Id | null>(null);
  const [viewed, setViewed] = useState<Id[]>([]);
  const [step, setStep] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (viewed.length === 7 && finished && !done) onComplete();
  }, [viewed, finished, done, onComplete]);

  const hi = step !== null ? flow[step].hi : sel ? [sel] : [];

  const click = (id: Id) => {
    setSel(id);
    setStep(null);
    setViewed((v) => (v.includes(id) ? v : [...v, id]));
  };

  const goStep = (n: number) => {
    const v = Math.max(0, Math.min(flow.length - 1, n));
    setStep(v);
    setSel(null);
    if (v === flow.length - 1) setFinished(true);
  };

  const key = (id: Id) => (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      click(id);
    }
  };

  const box = (id: Id, x: number, y: number, w: number, h: number, label: string, sub: string) => {
    const on = hi.includes(id);
    return (
      <g role="button" tabIndex={0} aria-label={info[id].name} onClick={() => click(id)} onKeyDown={key(id)} className="cursor-pointer outline-none">
        <rect x={x} y={y} width={w} height={h} rx={10} fill={on ? "#38A3A5" : "#E8F3F7"} stroke={on ? "#176B87" : "#176B87"} strokeWidth={on ? 3 : 1.5} />
        <text x={x + w / 2} y={y + h / 2 - 2} textAnchor="middle" fontSize={16} fontWeight={700} fill={on ? "#fff" : "#172B3A"}>
          {label}
        </text>
        <text x={x + w / 2} y={y + h / 2 + 18} textAnchor="middle" fontSize={11} fill={on ? "#fff" : "#64748B"}>
          {sub}
        </text>
        {viewed.includes(id) && <circle cx={x + w - 10} cy={y + 10} r={4} fill="#25845B" />}
      </g>
    );
  };

  const bus = (id: Id, y: number, label: string) => {
    const on = hi.includes(id);
    return (
      <g role="button" tabIndex={0} aria-label={info[id].name} onClick={() => click(id)} onKeyDown={key(id)} className="cursor-pointer outline-none">
        <rect x={20} y={y} width={600} height={22} rx={6} fill={on ? "#D69A32" : "#EEF2F5"} stroke={on ? "#D69A32" : "#C9D6DD"} strokeWidth={1.5} />
        <text x={320} y={y + 15} textAnchor="middle" fontSize={11} fontWeight={600} fill={on ? "#fff" : "#64748B"}>
          {label}
        </text>
        {viewed.includes(id) && <circle cx={610} cy={y + 11} r={3.5} fill="#25845B" />}
      </g>
    );
  };

  return (
    <LabShell done={done} title="Lab 08 — Etkileşimli Bilgisayar Mimarisi">
      <SimNote />
      <Card className="space-y-4">
        <h4 className="font-semibold">1) Mimari diyagramı — {viewed.length}/7 öğe incelendi</h4>
        <div className="overflow-x-auto scroll-thin">
          <svg viewBox="0 0 640 330" className="mx-auto min-w-[520px] w-full" role="group" aria-label="Von Neumann mimarisi diyagramı">
            {[110, 320, 530].map((cx) => (
              <line key={cx} x1={cx} y1={110} x2={cx} y2={150} stroke="#176B87" strokeWidth={2} strokeDasharray="4 3" />
            ))}
            <line x1={320} y1={228} x2={320} y2={250} stroke="#176B87" strokeWidth={2} strokeDasharray="4 3" />
            {box("cpu", 20, 20, 180, 90, "CPU", "ALU + Control Unit")}
            {box("ram", 230, 20, 180, 90, "RAM", "Komut + Veri")}
            {box("storage", 440, 20, 180, 90, "Depolama", "SSD / HDD")}
            {bus("addr", 150, "ADDRESS BUS →")}
            {bus("data", 178, "← DATA BUS →")}
            {bus("ctrl", 206, "CONTROL BUS")}
            {box("io", 230, 250, 180, 70, "Giriş / Çıkış", "Klavye · Ekran · Ağ")}
            <text x={20} y={318} fontSize={10} fill="#64748B">
              Anakart (Motherboard) üzerinde basitleştirilmiş Von Neumann mimarisi
            </text>
          </svg>
        </div>
        {sel ? (
          <Feedback tone="info" title={info[sel].name}>
            <p>{info[sel].text}</p>
            <p className="mt-1">
              <span className="font-semibold">İletişim: </span>
              {info[sel].comm}
            </p>
          </Feedback>
        ) : (
          step === null && <p className="text-sm text-muted">Bir bileşene veya veri yoluna tıkla (klavye ile Tab + Enter de çalışır).</p>
        )}
      </Card>

      <Card className="space-y-4">
        <h4 className="font-semibold">2) Von Neumann komut ve veri akışı: "A + B" işlemi</h4>
        <p className="text-sm text-muted">Adımları ilerlet; diyagramda ilgili bileşenler ve yollar vurgulanır.</p>
        {step !== null ? (
          <div className="rounded-lg border border-line bg-page p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-accent">
              Adım {step + 1} / {flow.length}
            </div>
            <div className="font-semibold">{flow[step].title}</div>
            <p className="mt-1 text-sm">{flow[step].text}</p>
          </div>
        ) : (
          <p className="text-sm text-muted">Başlamak için "Akışı Başlat" butonuna bas.</p>
        )}
        <div className="flex flex-wrap gap-2">
          {step === null ? (
            <Btn onClick={() => goStep(0)}>Akışı Başlat</Btn>
          ) : (
            <>
              <Btn variant="secondary" onClick={() => goStep(step - 1)} disabled={step === 0}>
                <ChevronLeft className="h-4 w-4" /> Geri
              </Btn>
              <Btn onClick={() => goStep(step + 1)} disabled={step === flow.length - 1}>
                İleri <ChevronRight className="h-4 w-4" />
              </Btn>
              <Btn variant="ghost" onClick={() => setStep(null)}>
                <RotateCcw className="h-4 w-4" /> Akışı Kapat
              </Btn>
            </>
          )}
        </div>
        {step === flow.length - 1 && (
          <Feedback tone="ok" title="Akış tamamlandı">
            Gördüğün gibi her işlem adres → kontrol → veri üçlüsüyle gerçekleşir. Harvard mimarisinde komut ve veri yolları ayrı olduğundan 3. ve 5. adımlar aynı anda yapılabilirdi.
          </Feedback>
        )}
        {finished && viewed.length < 7 && <p className="text-xs text-muted">Akış tamamlandı. Tamamlamak için diyagramdaki {7 - viewed.length} öğeyi daha incele.</p>}
      </Card>
    </LabShell>
  );
}
