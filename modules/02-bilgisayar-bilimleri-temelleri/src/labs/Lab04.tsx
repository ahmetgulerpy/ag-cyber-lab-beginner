import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, Target, RotateCcw } from "lucide-react";
import { Btn, Card, Feedback, LabShell, SimNote, Terminal, type LabProps } from "../components/ui";
import { cn } from "../utils/cn";
import { convert, modes, type Mode } from "../utils/numberSystems";

export default function Lab04({ done, onComplete }: LabProps) {
  const [mode, setMode] = useState<Mode>("dec-bin");
  const [input, setInput] = useState("156");
  const [usedModes, setUsedModes] = useState<Mode[]>([]);
  const [bits, setBits] = useState<boolean[]>(Array(8).fill(false));
  const [target, setTarget] = useState(165);
  const [checked, setChecked] = useState<null | boolean>(null);
  const [solved, setSolved] = useState(false);

  const res = useMemo(() => convert(mode, input), [mode, input]);
  const value = bits.reduce((s, b, i) => s + (b ? 2 ** (7 - i) : 0), 0);
  const cur = modes.find((m) => m.id === mode)!;

  useEffect(() => {
    if (res.ok && !usedModes.includes(mode)) setUsedModes((u) => [...u, mode]);
  }, [res.ok, mode, usedModes]);

  useEffect(() => {
    if (solved && usedModes.length >= 3 && !done) onComplete();
  }, [solved, usedModes, done, onComplete]);

  const toggle = (i: number) => {
    setBits((b) => b.map((v, j) => (j === i ? !v : v)));
    setChecked(null);
  };

  const newTarget = () => {
    setTarget(1 + Math.floor(Math.random() * 255));
    setBits(Array(8).fill(false));
    setChecked(null);
  };

  const check = () => {
    const ok = value === target;
    setChecked(ok);
    if (ok) setSolved(true);
  };

  const pickMode = (m: Mode) => {
    setMode(m);
    setInput(modes.find((x) => x.id === m)!.example);
  };

  return (
    <LabShell done={done} title="Lab 04 — Sayı Sistemi Dönüştürücü">
      <SimNote>Dönüştürücü gerçek zamanlı hesaplar. Tamamlamak için en az 3 farklı dönüşüm türünü kullan ve 8 bit görevini çöz.</SimNote>

      <Card className="space-y-4">
        <h4 className="flex items-center gap-2 font-semibold">
          <ArrowLeftRight className="h-4 w-4 text-brand" /> 1) Dönüştürücü
        </h4>
        <div className="flex flex-wrap gap-2">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => pickMode(m.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                mode === m.id ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-accent",
                usedModes.includes(m.id) && mode !== m.id && "border-ok/50"
              )}
            >
              {m.label}
              {usedModes.includes(m.id) && " ✓"}
            </button>
          ))}
        </div>
        <label className="block text-sm font-semibold">
          Girdi
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={cur.placeholder}
            spellCheck={false}
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 font-mono text-base outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </label>
        {res.ok ? (
          <div className="space-y-3">
            <div className="rounded-lg bg-soft p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-accent">Sonuç</div>
              <div className="break-all font-mono text-2xl font-bold text-brand">{res.result}</div>
            </div>
            <Terminal title="dönüşüm adımları">
              {res.steps.map((s, i) => (
                <div key={i} className={i === 0 ? "mb-1 text-[#8fd3d4]" : ""}>
                  {i === 0 ? s : `› ${s}`}
                </div>
              ))}
            </Terminal>
          </div>
        ) : (
          <Feedback tone="bad" title="Geçersiz giriş">
            {res.error}
          </Feedback>
        )}
        <p className="text-xs text-muted">Dönüşüm türü denenen: {usedModes.length}/6 (en az 3 gerekli)</p>
      </Card>

      <Card className="space-y-4">
        <h4 className="flex items-center gap-2 font-semibold">
          <Target className="h-4 w-4 text-brand" /> 2) 8 bitlik interaktif alan
        </h4>
        <p className="text-sm text-muted">Bitlere tıklayarak aç/kapat. Her bitin altında basamak değeri (2'nin kuvveti) görünür.</p>
        <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
          {bits.map((b, i) => (
            <div key={i} className="text-center">
              <div className="mb-1 text-[10px] text-muted sm:text-xs">2^{7 - i}</div>
              <button
                onClick={() => toggle(i)}
                aria-pressed={b}
                aria-label={`Bit ${7 - i}, değer ${2 ** (7 - i)}, ${b ? "1" : "0"}`}
                className={cn(
                  "flex h-12 w-full items-center justify-center rounded-lg border font-mono text-xl font-bold transition-colors sm:h-14",
                  b ? "border-brand bg-brand text-white" : "border-line bg-white text-muted hover:border-accent"
                )}
              >
                {b ? 1 : 0}
              </button>
              <div className={cn("mt-1 font-mono text-xs font-semibold sm:text-sm", b ? "text-brand" : "text-muted")}>{2 ** (7 - i)}</div>
            </div>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-soft p-3 text-center">
            <div className="text-xs text-muted">Decimal</div>
            <div className="font-mono text-xl font-bold text-brand">{value}</div>
          </div>
          <div className="rounded-lg bg-soft p-3 text-center">
            <div className="text-xs text-muted">Binary</div>
            <div className="font-mono text-xl font-bold text-brand">{bits.map((b) => (b ? 1 : 0)).join("")}</div>
          </div>
          <div className="rounded-lg bg-soft p-3 text-center">
            <div className="text-xs text-muted">Hex</div>
            <div className="font-mono text-xl font-bold text-brand">0x{value.toString(16).toUpperCase().padStart(2, "0")}</div>
          </div>
        </div>
        <div className="text-center font-mono text-xs text-muted">
          {bits.some(Boolean) ? bits.map((b, i) => (b ? 2 ** (7 - i) : null)).filter((x) => x !== null).join(" + ") + " = " + value : "Hiçbir bit açık değil = 0"}
        </div>

        <div className="rounded-lg border border-line bg-page p-4">
          <div className="text-sm font-semibold">
            Görev: Bitleri ayarlayarak <span className="rounded bg-brand px-2 py-0.5 font-mono text-white">{target}</span> sayısını oluştur.
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Btn onClick={check}>Kontrol Et</Btn>
            <Btn variant="secondary" onClick={newTarget}>
              <RotateCcw className="h-4 w-4" /> Yeni Hedef
            </Btn>
          </div>
          {checked === true && (
            <div className="mt-3">
              <Feedback tone="ok" title="Doğru!">
                {target} = {bits.map((b, i) => (b ? 2 ** (7 - i) : null)).filter((x) => x !== null).join(" + ")}. Binary karşılığı {bits.map((b) => (b ? 1 : 0)).join("")}.
              </Feedback>
            </div>
          )}
          {checked === false && (
            <div className="mt-3">
              <Feedback tone="bad" title="Henüz değil">
                Şu an {value}. Hedef {target}; {value < target ? `${target - value} daha eklemelisin.` : `${value - target} fazla; bazı bitleri kapat.`} İpucu: büyük basamak değerinden başla (128, 64, 32…).
              </Feedback>
            </div>
          )}
          {solved && usedModes.length < 3 && <p className="mt-2 text-xs text-muted">Görev çözüldü. Tamamlamak için dönüştürücüde {3 - usedModes.length} farklı dönüşüm türü daha dene.</p>}
        </div>
      </Card>
    </LabShell>
  );
}
