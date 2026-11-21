import { useEffect, useMemo, useState } from "react";
import { Keyboard, Cpu, Monitor, HardDrive, ArrowRight, RotateCcw } from "lucide-react";
import { Btn, Card, Feedback, LabShell, SimNote, type LabProps } from "../components/ui";
import { cn } from "../utils/cn";

const parts = [
  { id: "input", name: "Input", tr: "Girdi", icon: Keyboard, text: "Bilgisayara veri ve komut verilen aşamadır. Klavye, fare, mikrofon, kamera ve dokunmatik ekran girdi aygıtlarıdır. Fiziksel eylem elektrik sinyaline, sonra 0 ve 1'lere dönüştürülür.", ex: "Örnek: 'A' tuşuna basmak." },
  { id: "processing", name: "Processing", tr: "İşleme", icon: Cpu, text: "CPU'nun girdiyi komutlara göre işlediği aşamadır. Komut RAM'den alınır (fetch), çözülür (decode) ve yürütülür (execute). Geçici veriler RAM'de tutulur.", ex: "Örnek: Tuş koduna karşılık gelen harfin belirlenmesi." },
  { id: "output", name: "Output", tr: "Çıktı", icon: Monitor, text: "İşlenen sonucun insanın algılayacağı biçimde gösterildiği aşamadır. Monitör, hoparlör ve yazıcı çıktı aygıtlarıdır.", ex: "Örnek: Ekranda 'A' harfinin görünmesi." },
  { id: "storage", name: "Storage", tr: "Depolama", icon: HardDrive, text: "Verinin kalıcı olarak saklandığı aşamadır. SSD, HDD ve USB bellekler elektrik kesilse bile veriyi korur. RAM ise geçicidir.", ex: "Örnek: Belgeyi 'Kaydet' ile diske yazmak." },
];

const correctOrder = [
  "Klavyede 'A' tuşuna basılır",
  "Klavye denetleyicisi tuşu tarama koduna (scan code) çevirir",
  "Sinyal bilgisayara iletilir ve CPU'ya kesme (interrupt) gönderilir",
  "Sürücü ve işletim sistemi kodu 'A' karakterine çevirir ve aktif uygulamaya iletir",
  "Uygulama harfi RAM'deki belgeye ekler (CPU işler)",
  "Ekran kartı yeni görüntüyü monitöre gönderir ve ekranda 'A' görünür",
];

const why = [
  "Her şey fiziksel bir eylemle başlar: kullanıcı girdi verir.",
  "Tuş bilgisinin elektronik olarak bir koda dönüşmesi gerekir; bilgisayar yalnızca sayısal sinyalleri anlar.",
  "CPU başka iş yapıyor olabilir; kesme, olayın zamanında fark edilmesini sağlar.",
  "Kodun anlam kazanması için sürücü ve işletim sistemi onu uygun karaktere çevirir.",
  "Sonuç, CPU'nun işlediği veri olarak RAM'deki belgeye yansır.",
  "Son olarak sonuç kullanıcıya çıktı olarak gösterilir.",
];

function shuffle(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  // sabit, deterministik karıştırma (her yeniden denemede farklı olsun diye döngü kaydırılır)
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (a.every((v, i) => v === i)) a.reverse();
  return a;
}

export default function Lab01({ done, onComplete }: LabProps) {
  const [viewed, setViewed] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [order, setOrder] = useState<number[]>(() => shuffle(correctOrder.length));
  const [placed, setPlaced] = useState<number[]>([]);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const remaining = useMemo(() => order.filter((i) => !placed.includes(i)), [order, placed]);
  const allViewed = viewed.length === parts.length;
  const sorted = placed.length === correctOrder.length;

  useEffect(() => {
    if (allViewed && sorted && !done) onComplete();
  }, [allViewed, sorted, done, onComplete]);

  const open = (id: string) => {
    setActive(id);
    setViewed((v) => (v.includes(id) ? v : [...v, id]));
  };

  const pick = (i: number) => {
    const expected = placed.length;
    if (i === expected) {
      setPlaced([...placed, i]);
      setMsg({ ok: true, text: `Doğru! ${why[i]}` });
    } else {
      setMsg({ ok: false, text: "Henüz değil: bu adım şu an sırada değil. Bir adımın gerçekleşebilmesi için önceki adımın sonucuna ihtiyaç vardır. İpucu: önce fiziksel olay, sonra elektronik sinyal, sonra yazılım, en son ekran." });
    }
  };

  const reset = () => {
    setPlaced([]);
    setMsg(null);
    setOrder(shuffle(correctOrder.length));
  };

  const act = parts.find((p) => p.id === active);

  return (
    <LabShell done={done} title="Lab 01 — Bilgisayar Çalışma Şeması">
      <SimNote />
      <Card className="space-y-4">
        <h4 className="font-semibold">1) Etkileşimli çalışma şeması</h4>
        <p className="text-sm text-muted">Dört bölümü de tıklayarak incele ({viewed.length}/4).</p>
        <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
          {parts.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={p.id} className="flex flex-1 items-center gap-2">
                <button
                  onClick={() => open(p.id)}
                  className={cn(
                    "relative flex-1 rounded-xl border p-4 text-left transition-all",
                    active === p.id ? "border-brand bg-soft shadow-sm" : "border-line bg-white hover:border-accent"
                  )}
                >
                  {viewed.includes(p.id) && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-ok" />}
                  <Icon className="mb-2 h-6 w-6 text-brand" />
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-muted">{p.tr}</div>
                </button>
                {i < parts.length - 1 && <ArrowRight className="hidden h-5 w-5 shrink-0 text-muted md:block" />}
              </div>
            );
          })}
        </div>
        {act ? (
          <Feedback tone="info" title={`${act.name} (${act.tr})`}>
            {act.text} <span className="font-medium">{act.ex}</span>
          </Feedback>
        ) : (
          <p className="text-sm text-muted">Bir bölüme tıklayarak açıklamasını gör.</p>
        )}
      </Card>

      <Card className="space-y-4">
        <h4 className="font-semibold">2) Tuş vuruşundan ekrana: adımları sırala</h4>
        <p className="text-sm text-muted">Aşağıdaki karışık adımlardan doğru sırayla birini seç. Her doğru seçimde nedeni açıklanır.</p>
        <ol className="space-y-2">
          {placed.map((i, n) => (
            <li key={i} className="flex gap-3 rounded-lg border border-ok/40 bg-[#eef8f2] p-3 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ok text-xs font-bold text-white">{n + 1}</span>
              {correctOrder[i]}
            </li>
          ))}
        </ol>
        {!sorted && (
          <div className="grid gap-2">
            {remaining.map((i) => (
              <button key={i} onClick={() => pick(i)} className="rounded-lg border border-line bg-white p-3 text-left text-sm hover:border-accent hover:bg-soft/50">
                {correctOrder[i]}
              </button>
            ))}
          </div>
        )}
        {msg && <Feedback tone={msg.ok ? "ok" : "bad"}>{msg.text}</Feedback>}
        {sorted && (
          <Feedback tone="ok" title="Tebrikler!">
            Süreci doğru sıraladın: Input → Interrupt → Sürücü/OS → İşleme (CPU/RAM) → Output.
          </Feedback>
        )}
        <Btn variant="secondary" onClick={reset}>
          <RotateCcw className="h-4 w-4" /> Yeniden Dene
        </Btn>
      </Card>
    </LabShell>
  );
}
