import { useEffect, useState } from "react";
import { Cpu, MemoryStick, HardDrive, Zap, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Btn, Card, Feedback, LabShell, SimNote, type LabProps } from "../components/ui";
import { cn } from "../utils/cn";

type Comp = "ssd" | "ram" | "cache" | "cpu";

const info: Record<Comp, { name: string; tr: string; icon: typeof Cpu; text: string }> = {
  ssd: { name: "SSD", tr: "Kalıcı depolama", icon: HardDrive, text: "Uygulamanın dosyalarının kalıcı olarak durduğu yerdir. Büyük ve kalıcıdır ama RAM'den yavaştır. Uygulama çalışmadan önce buradan okunur." },
  ram: { name: "RAM", tr: "Geçici ana bellek", icon: MemoryStick, text: "Çalışan programların ve verilerin tutulduğu hızlı, geçici bellektir. CPU komutları RAM'den alır. Elektrik kesilince içeriği silinir." },
  cache: { name: "Cache", tr: "Önbellek", icon: Zap, text: "CPU'nun içinde/yanında bulunan çok küçük ve çok hızlı bellektir. Sık kullanılan komut ve veriler burada tutulur; böylece CPU RAM'i beklemez." },
  cpu: { name: "CPU", tr: "İşlemci", icon: Cpu, text: "Komutları fetch–decode–execute döngüsüyle yürüten işlem merkezidir. ALU hesaplar, Control Unit akışı yönetir." },
};

const steps: { title: string; active: Comp[]; text: string; why: string }[] = [
  { title: "Kullanıcı uygulamayı açar", active: [], text: "Kullanıcı bir uygulama simgesine çift tıklar. İşletim sistemi bu isteği alır ve uygulamayı başlatmak için hazırlık yapar.", why: "Her işlem bir girdiyle başlar." },
  { title: "SSD'den dosyalar okunur", active: ["ssd"], text: "İşletim sistemi uygulamanın yürütülebilir dosyasını SSD'de bulur ve okumaya başlar.", why: "Program kalıcı olarak depolamada durur; çalışması için önce okunmalıdır." },
  { title: "SSD → RAM yükleme", active: ["ssd", "ram"], text: "Uygulamanın kodu ve gerekli verileri SSD'den RAM'e kopyalanır. Bu, 'yükleniyor' ekranında gördüğün işlemdir.", why: "CPU komutları doğrudan SSD'den değil, hızlı olan RAM'den alır." },
  { title: "CPU RAM'den komut alır (Fetch)", active: ["ram", "cpu"], text: "CPU'nun Control Unit birimi, ilk komutu RAM'den getirir.", why: "Çalışabilmek için CPU'nun komuta ihtiyacı vardır." },
  { title: "Sık kullanılan veriler Cache'e alınır", active: ["ram", "cache", "cpu"], text: "Sık tekrarlanan komut ve veriler Cache'e kopyalanır. Sonraki erişimlerde CPU doğrudan cache'ten okur (cache hit).", why: "RAM'e her seferinde gitmek zaman kaybettirir." },
  { title: "CPU komutu çözer ve yürütür (Decode / Execute)", active: ["cpu", "cache"], text: "Komut çözülür ve ALU gerekli işlemi yapar: pencereyi hazırlamak, kullanıcı arayüzünü oluşturmak vb.", why: "Asıl iş bu aşamada gerçekleşir." },
  { title: "Sonuç RAM'e yazılır ve ekranda gösterilir", active: ["cpu", "ram"], text: "Üretilen sonuç RAM'e yazılır, ekran kartı aracılığıyla ekrana gönderilir. Uygulama penceresi açılır.", why: "Sonuç kullanıcıya çıktı olarak sunulur; uygulama artık RAM'de çalışmaya devam eder." },
];

const problems: { symptom: string; answer: Comp; why: string }[] = [
  { symptom: "Çok sayıda sekme açınca bilgisayar belirgin şekilde yavaşlıyor ve sistem diski sürekli çalışıyor.", answer: "ram", why: "RAM dolunca işletim sistemi veriyi yavaş diske taşır (page file); bu yavaşlamanın tipik nedeni RAM yetersizliğidir." },
  { symptom: "Bir uygulama açılırken dakikalarca 'yükleniyor' ekranında kalıyor ama açıldıktan sonra akıcı çalışıyor.", answer: "ssd", why: "Açılışta uygulama depolamadan RAM'e okunur. Yavaş HDD/dolu veya yıpranmış SSD bu yüklenme süresini uzatır." },
  { symptom: "Video dönüştürme gibi yoğun hesaplamalarda sistem aşırı ısınıyor, saat hızı düşüyor ve işlem çok uzun sürüyor.", answer: "cpu", why: "Hesaplama yoğun işler CPU'yu sınırlar; ısınma saat hızını düşürür (thermal throttling)." },
  { symptom: "CPU boşta görünürken sık tekrarlanan küçük veri erişimlerinde sürekli gecikme yaşanıyor; veriler her seferinde yavaş bellekten isteniyor.", answer: "cache", why: "Sık kullanılan verinin cache'te bulunamaması (cache miss) CPU'nun RAM'i beklemesine neden olur." },
];

export default function Lab03({ done, onComplete }: LabProps) {
  const [step, setStep] = useState(0);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [selected, setSelected] = useState<Comp | null>(null);
  const [answers, setAnswers] = useState<(Comp | null)[]>(problems.map(() => null));

  const allAnswered = answers.every((a) => a !== null);

  useEffect(() => {
    if (reachedEnd && allAnswered && !done) onComplete();
  }, [reachedEnd, allAnswered, done, onComplete]);

  const go = (n: number) => {
    const v = Math.max(0, Math.min(steps.length - 1, n));
    setStep(v);
    if (v === steps.length - 1) setReachedEnd(true);
  };

  const s = steps[step];
  const correctCount = answers.filter((a, i) => a === problems[i].answer).length;

  return (
    <LabShell done={done} title="Lab 03 — Bilgisayar Bileşenleri Simülasyonu">
      <SimNote />
      <Card className="space-y-4">
        <h4 className="font-semibold">1) Senaryo: Kullanıcı bilgisayarında bir uygulama açıyor</h4>
        <p className="text-sm text-muted">Bir bileşene tıklayarak bilgi al; adımları ileri/geri butonlarıyla izle.</p>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {(Object.keys(info) as Comp[]).map((k) => {
            const I = info[k];
            const Icon = I.icon;
            const on = s.active.includes(k);
            return (
              <button
                key={k}
                onClick={() => setSelected(k)}
                className={cn(
                  "rounded-xl border p-4 text-center transition-all",
                  on ? "border-brand bg-soft ring-2 ring-accent/40" : "border-line bg-white hover:border-accent",
                  selected === k && "shadow-md"
                )}
              >
                <Icon className={cn("mx-auto mb-1 h-7 w-7", on ? "text-brand" : "text-muted")} />
                <div className="font-semibold">{I.name}</div>
                <div className="text-xs text-muted">{I.tr}</div>
              </button>
            );
          })}
        </div>
        {selected && (
          <Feedback tone="info" title={`${info[selected].name} — ${info[selected].tr}`}>
            {info[selected].text}
          </Feedback>
        )}

        <div className="rounded-lg border border-line bg-page p-4">
          <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-accent">
            <span>
              Adım {step + 1} / {steps.length}
            </span>
            <span>{s.active.length ? s.active.map((a) => info[a].name).join(" → ") : "İşletim Sistemi"}</span>
          </div>
          <div className="font-semibold text-ink">{s.title}</div>
          <p className="mt-1 text-sm text-ink/90">{s.text}</p>
          <p className="mt-2 text-sm text-muted">
            <span className="font-semibold text-brand">Neden gerekli? </span>
            {s.why}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn variant="secondary" onClick={() => go(step - 1)} disabled={step === 0}>
            <ChevronLeft className="h-4 w-4" /> Geri
          </Btn>
          <Btn onClick={() => go(step + 1)} disabled={step === steps.length - 1}>
            İleri <ChevronRight className="h-4 w-4" />
          </Btn>
          <Btn variant="ghost" onClick={() => setStep(0)}>
            <RotateCcw className="h-4 w-4" /> Başa Dön
          </Btn>
        </div>
      </Card>

      <Card className="space-y-4">
        <h4 className="font-semibold">2) Arıza teşhisi: Hangi bileşen etkilenmiş olabilir?</h4>
        {problems.map((p, i) => {
          const a = answers[i];
          return (
            <div key={i} className="space-y-2 rounded-lg border border-line p-4">
              <p className="text-sm font-medium">
                {i + 1}. {p.symptom}
              </p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(info) as Comp[]).map((k) => (
                  <button
                    key={k}
                    disabled={a !== null}
                    onClick={() => setAnswers((arr) => arr.map((v, j) => (j === i ? k : v)))}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors",
                      a === null && "border-line bg-white hover:border-accent",
                      a !== null && k === p.answer && "border-ok bg-[#eef8f2] text-ok",
                      a === k && k !== p.answer && "border-bad bg-[#fbeeee] text-bad",
                      a !== null && k !== p.answer && a !== k && "border-line opacity-50"
                    )}
                  >
                    {info[k].name}
                  </button>
                ))}
              </div>
              {a !== null && (
                <Feedback tone={a === p.answer ? "ok" : "bad"} title={a === p.answer ? "Doğru!" : `Yanlış — doğru cevap: ${info[p.answer].name}`}>
                  {p.why}
                </Feedback>
              )}
            </div>
          );
        })}
        {allAnswered && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-semibold text-brand">
              Sonuç: {correctCount} / {problems.length} doğru
            </span>
            <Btn variant="secondary" onClick={() => setAnswers(problems.map(() => null))}>
              <RotateCcw className="h-4 w-4" /> Yeniden Dene
            </Btn>
          </div>
        )}
        {!reachedEnd && <p className="text-xs text-muted">Uygulamanın tamamlanması için simülasyonun son adımına da ulaşmalısın.</p>}
      </Card>
    </LabShell>
  );
}
