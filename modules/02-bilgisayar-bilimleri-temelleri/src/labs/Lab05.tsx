import { useEffect, useMemo, useState } from "react";
import { Calculator, Shapes, RotateCcw } from "lucide-react";
import { Btn, Card, Feedback, LabShell, SimNote, type LabProps } from "../components/ui";
import { cn } from "../utils/cn";

const types = ["Tam sayı (Integer)", "Metin (String)", "Mantıksal (Boolean)", "Tarih (Date)", "Görsel (Image)", "Ses (Audio)", "Video"];

const samples: { show: string; type: number; why: string }[] = [
  { show: "125", type: 0, why: "Ondalık kısmı olmayan, matematiksel işlem yapılabilen bir sayıdır: Integer." },
  { show: '"AG Cyber Lab"', type: 1, why: "Tırnak içindeki karakter dizisi bir String (metin) değeridir." },
  { show: "true", type: 2, why: "Yalnızca true/false (doğru/yanlış) değerlerinden biri olduğundan Boolean'dır." },
  { show: "19.11.2026", type: 3, why: "Gün.ay.yıl biçimindeki değer bir tarihtir (Date). Tarihler üzerinde fark hesaplama gibi özel işlemler yapılır." },
  { show: "foto.jpg (görsel dosyası)", type: 4, why: "Pikseller halinde saklanan görüntü verisidir; JPG/PNG gibi biçimlerde tutulur." },
  { show: "toplanti.mp3 (ses kaydı)", type: 5, why: "Ses, zaman içindeki titreşimlerin örneklenmiş sayısal değerleridir (örn. 44,1 kHz)." },
  { show: "ders.mp4 (video dosyası)", type: 6, why: "Video, art arda kareler (frame) ile eşlik eden ses verisinin birleşimidir." },
];

const units = ["Byte", "KB", "MB", "GB", "TB"];
const unitsBin = ["Byte", "KiB", "MiB", "GiB", "TiB"];

function fmt(n: number): string {
  if (n === 0) return "0";
  if (n >= 1e-4 && n < 1e15) return n.toLocaleString("tr-TR", { maximumFractionDigits: 6 });
  return n.toExponential(4);
}

export default function Lab05({ done, onComplete }: LabProps) {
  const [picks, setPicks] = useState<(number | null)[]>(samples.map(() => null));
  const [val, setVal] = useState("1");
  const [unit, setUnit] = useState(2);
  const [base, setBase] = useState<1000 | 1024>(1000);
  const [touched, setTouched] = useState(0);

  const allCorrect = picks.every((p, i) => p === samples[i].type);
  const answered = picks.filter((p) => p !== null).length;

  const num = parseFloat(val.replace(",", "."));
  const valid = !isNaN(num) && num >= 0;
  const bytes = valid ? num * base ** unit : 0;
  const rows = useMemo(() => units.map((_, i) => bytes / base ** i), [bytes, base]);

  useEffect(() => {
    if (allCorrect && touched >= 2 && !done) onComplete();
  }, [allCorrect, touched, done, onComplete]);

  return (
    <LabShell done={done} title="Lab 05 — Veri Türü Tanıma Laboratuvarı">
      <SimNote />
      <Card className="space-y-4">
        <h4 className="flex items-center gap-2 font-semibold">
          <Shapes className="h-4 w-4 text-brand" /> 1) Örnekleri uygun veri türüyle eşleştir
        </h4>
        <p className="text-sm text-muted">
          Doğru eşleştirilen: {picks.filter((p, i) => p === samples[i].type).length}/{samples.length}. Yanlış seçimde nedenini okuyup tekrar dene.
        </p>
        <div className="space-y-3">
          {samples.map((s, i) => {
            const p = picks[i];
            const ok = p === s.type;
            return (
              <div key={i} className={cn("space-y-2 rounded-lg border p-3", p === null ? "border-line" : ok ? "border-ok/50 bg-[#f5fbf8]" : "border-bad/40 bg-[#fdf6f6]")}>
                <div className="font-mono text-sm font-bold text-ink">{s.show}</div>
                <div className="flex flex-wrap gap-1.5">
                  {types.map((t, ti) => (
                    <button
                      key={t}
                      disabled={ok}
                      onClick={() => setPicks((arr) => arr.map((v, j) => (j === i ? ti : v)))}
                      className={cn(
                        "rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors sm:text-sm",
                        p === ti ? (ok ? "border-ok bg-ok text-white" : "border-bad bg-bad text-white") : "border-line bg-white hover:border-accent",
                        ok && p !== ti && "opacity-40"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {p !== null && (
                  <Feedback tone={ok ? "ok" : "bad"} title={ok ? "Doğru!" : `${types[p]} değil.`}>
                    {ok ? s.why : "Değerin biçimine ve ne için kullanıldığına tekrar bak. Başka bir tür seçerek tekrar dene."}
                  </Feedback>
                )}
              </div>
            );
          })}
        </div>
        {answered > 0 && (
          <Btn variant="secondary" onClick={() => setPicks(samples.map(() => null))}>
            <RotateCcw className="h-4 w-4" /> Baştan Başla
          </Btn>
        )}
      </Card>

      <Card className="space-y-4">
        <h4 className="flex items-center gap-2 font-semibold">
          <Calculator className="h-4 w-4 text-brand" /> 2) Veri boyutu dönüştürücü
        </h4>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Hesaplama tabanı">
          {([1000, 1024] as const).map((b) => (
            <button
              key={b}
              onClick={() => {
                setBase(b);
                setTouched((t) => t + 1);
              }}
              className={cn("rounded-lg border px-3 py-2 text-sm font-semibold", base === b ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-accent")}
            >
              {b === 1000 ? "1000 tabanı (SI: KB, MB, GB)" : "1024 tabanı (ikili: KiB, MiB, GiB)"}
            </button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Değer
            <input
              value={val}
              inputMode="decimal"
              onChange={(e) => {
                setVal(e.target.value);
                setTouched((t) => t + 1);
              }}
              className="mt-1 w-full rounded-lg border border-line px-3 py-2 font-mono outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </label>
          <label className="text-sm font-semibold">
            Birim
            <select
              value={unit}
              onChange={(e) => {
                setUnit(Number(e.target.value));
                setTouched((t) => t + 1);
              }}
              className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 outline-none focus:border-accent"
            >
              {(base === 1000 ? units : unitsBin).map((u, i) => (
                <option key={u} value={i}>
                  {u}
                </option>
              ))}
            </select>
          </label>
        </div>
        {valid ? (
          <div className="overflow-hidden rounded-lg border border-line">
            <table className="w-full text-sm">
              <tbody>
                {(base === 1000 ? units : unitsBin).map((u, i) => (
                  <tr key={u} className={cn("border-b border-line last:border-0", i === unit && "bg-soft font-semibold")}>
                    <td className="px-3 py-2 text-muted">{u}</td>
                    <td className="break-all px-3 py-2 text-right font-mono">{fmt(rows[i])}</td>
                  </tr>
                ))}
                <tr className="bg-page">
                  <td className="px-3 py-2 text-muted">Bit</td>
                  <td className="break-all px-3 py-2 text-right font-mono">{fmt(bytes * 8)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <Feedback tone="bad" title="Geçersiz değer">
            Lütfen 0 veya daha büyük bir sayı gir.
          </Feedback>
        )}
        <Feedback tone="info" title="Hatırlatma">
          1 byte = 8 bit. {base === 1000 ? "SI sisteminde 1 KB = 1000 byte (disk üreticileri ve ağ hızları bunu kullanır)." : "İkili sistemde 1 KiB = 1024 byte (işletim sistemleri çoğu zaman bunu KB/MB diye gösterir)."} Örneğin 1 TB (1000 tabanı) ≈ 931,3 GiB (1024 tabanı).
        </Feedback>
        {allCorrect && touched < 2 && <p className="text-xs text-muted">Eşleştirme tamam. Tamamlamak için dönüştürücüde değer, birim veya taban değiştirerek en az 2 deneme yap.</p>}
      </Card>
    </LabShell>
  );
}
