"use client";

import { useMemo, useState } from "react";
import { Btn, inputCls, Label, LabNote, TraceViewer, type Step } from "../ui";

const MAX_ITER = 60;

function toInt(s: string): number | null {
  const t = s.trim();
  return /^[+-]?\d+$/.test(t) ? parseInt(t, 10) : null;
}

type Built = { code: string; steps: Step[]; warn?: string } | { error: string };

function build(
  kind: "for" | "while",
  startS: string,
  stopS: string,
  stepS: string,
  contS: string,
  brkS: string,
  noInc: boolean,
): Built {
  const start = toInt(startS);
  const stop = toInt(stopS);
  const step = toInt(stepS);
  if (start === null || stop === null || step === null) return { error: "Başlangıç, bitiş ve adım tam sayı olmalıdır." };
  const C = contS.trim() === "" ? null : toInt(contS);
  const B = brkS.trim() === "" ? null : toInt(brkS);
  if (C === null && contS.trim() !== "") return { error: "continue değeri tam sayı olmalıdır (veya boş bırakın)." };
  if (B === null && brkS.trim() !== "") return { error: "break değeri tam sayı olmalıdır (veya boş bırakın)." };
  if (step === 0 && kind === "for") return { error: "ValueError: range() arg 3 must not be zero — adım 0 olamaz." };

  const L: string[] = [];
  const ix: Record<string, number> = {};
  const push = (k: string, s: string) => {
    ix[k] = L.length;
    L.push(s);
  };
  const stepTxt = step !== 1 ? `, ${step}` : "";
  if (kind === "for") {
    push("init", "toplam = 0");
    push("head", `for i in range(${start}, ${stop}${stepTxt}):`);
  } else {
    push("i0", `i = ${start}`);
    push("init", "toplam = 0");
    push("head", `while i ${step >= 0 ? "<" : ">"} ${stop}:`);
  }
  if (C !== null) {
    push("ifC", `    if i == ${C}:`);
    if (kind === "while" && !noInc) push("incC", `        i += ${step}`);
    push("cont", "        continue");
  }
  if (B !== null) {
    push("ifB", `    if i == ${B}:`);
    push("brk", "        break");
  }
  push("add", "    toplam += i");
  push("pr", "    print(i)");
  if (kind === "while" && !noInc) push("inc", `    i += ${step}`);

  const steps: Step[] = [];
  let i = start;
  let toplam = 0;
  const v = (): Record<string, string> => ({ i: String(i), toplam: String(toplam) });
  if (kind === "while") steps.push({ line: ix.i0, vars: { i: String(i) }, note: `Sayaç \`i\` başlangıç değeri ${start} ile oluşturuldu.` });
  steps.push({ line: ix.init, vars: kind === "while" ? v() : { toplam: "0" }, note: "Toplam değişkeni 0 ile başlatılır." });

  const inRange = (x: number) => (step >= 0 ? x < stop : x > stop);
  let iter = 0;
  let truncated = false;
  let brokeOut = false;
  while (true) {
    if (kind === "for" || step >= 0 || true) {
      if (!inRange(i)) {
        steps.push({ line: ix.head, vars: v(), note: kind === "for" ? `range tükendi (sıradaki değer ${i}, bitiş ${stop} dahil değil). Döngü sona erer.` : `Koşul \`${i} ${step >= 0 ? "<" : ">"} ${stop}\` → **False**. Döngü sona erer.` });
        break;
      }
    }
    if (iter >= (noInc ? 12 : MAX_ITER)) {
      truncated = true;
      break;
    }
    iter++;
    steps.push({
      line: ix.head,
      vars: v(),
      note: kind === "for" ? `**${iter}. iterasyon:** \`i\` = ${i}.` : `Koşul \`${i} ${step >= 0 ? "<" : ">"} ${stop}\` → **True**. **${iter}. iterasyon.**`,
    });
    if (C !== null) {
      const hit = i === C;
      steps.push({ line: ix.ifC, vars: v(), note: `\`${i} == ${C}\` → **${hit ? "True" : "False"}**.` });
      if (hit) {
        if (kind === "while" && !noInc) {
          i += step;
          steps.push({ line: ix.incC, vars: v(), note: `continue öncesi sayaç artırıldı → i = ${i} (aksi halde sonsuz döngü olurdu).` });
        }
        steps.push({ line: ix.cont, vars: v(), note: "**continue:** bu iterasyonun kalanı atlanır, döngü başına dönülür." });
        if (kind === "for") i += step;
        continue;
      }
    }
    if (B !== null) {
      const hit = i === B;
      steps.push({ line: ix.ifB, vars: v(), note: `\`${i} == ${B}\` → **${hit ? "True" : "False"}**.` });
      if (hit) {
        steps.push({ line: ix.brk, vars: v(), note: "**break:** döngü tamamen sonlandırılır." });
        brokeOut = true;
        break;
      }
    }
    toplam += i;
    steps.push({ line: ix.add, vars: v(), note: `\`toplam += i\` → toplam = ${toplam}.` });
    steps.push({ line: ix.pr, vars: v(), out: String(i), note: `\`print(i)\` ekrana ${i} yazar.` });
    if (kind === "while") {
      if (!noInc) {
        i += step;
        steps.push({ line: ix.inc, vars: v(), note: `Sayaç güncellenir: i = ${i}.` });
      } else {
        steps.push({ line: ix.pr, vars: v(), note: "⚠ Sayaç hiç artmıyor: `i` hep aynı kalır, koşul hep True → **sonsuz döngü!**" });
      }
    } else {
      i += step;
    }
  }
  let warn: string | undefined;
  if (truncated) {
    warn = noInc
      ? "Simülatör güvenlik sınırı: sonsuz döngü 12 iterasyon sonra durduruldu. Gerçek programda bu döngü hiç bitmezdi."
      : `Simülatör güvenlik sınırı: ${MAX_ITER} iterasyondan sonra izleme durduruldu.`;
  }
  if (kind === "while" && step === 0 && !noInc && inRange(start)) {
    warn = "Adım 0 olduğundan sayaç değişmez: gerçek programda sonsuz döngü olurdu. Simülatör 60 iterasyon sonra durdurdu.";
  }
  if (brokeOut) steps.push({ line: ix.brk, vars: v(), note: `Döngü break ile bitti. Son toplam = ${toplam}.` });
  return { code: L.join("\n"), steps, warn };
}

export default function Lab05({ onUse }: { onUse: () => void }) {
  const [kind, setKind] = useState<"for" | "while">("for");
  const [start, setStart] = useState("20");
  const [stop, setStop] = useState("30");
  const [step, setStep] = useState("1");
  const [cont, setCont] = useState("25");
  const [brk, setBrk] = useState("28");
  const [noInc, setNoInc] = useState(false);

  const built = useMemo(() => build(kind, start, stop, step, cont, brk, kind === "while" && noInc), [kind, start, stop, step, cont, brk, noInc]);
  const key = [kind, start, stop, step, cont, brk, noInc].join("|");

  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-[#2b4152]">
        Döngü türünü seçin, başlangıç/bitiş/adım değerlerini belirleyin ve döngüyü <strong>adım adım</strong> ilerletin.
        Her adımda <code>i</code> ve <code>toplam</code> değişkenlerinin nasıl değiştiğini izleyin.
      </p>
      <div className="flex gap-2">
        <Btn variant={kind === "for" ? "primary" : "secondary"} onClick={() => setKind("for")}>for + range()</Btn>
        <Btn variant={kind === "while" ? "primary" : "secondary"} onClick={() => setKind("while")}>while</Btn>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div>
          <Label>Başlangıç</Label>
          <input className={inputCls} value={start} onChange={(e) => setStart(e.target.value)} />
        </div>
        <div>
          <Label>Bitiş (dahil değil)</Label>
          <input className={inputCls} value={stop} onChange={(e) => setStop(e.target.value)} />
        </div>
        <div>
          <Label>Adım</Label>
          <input className={inputCls} value={step} onChange={(e) => setStep(e.target.value)} />
        </div>
        <div>
          <Label>continue değeri</Label>
          <input className={inputCls} value={cont} placeholder="boş" onChange={(e) => setCont(e.target.value)} />
        </div>
        <div>
          <Label>break değeri</Label>
          <input className={inputCls} value={brk} placeholder="boş" onChange={(e) => setBrk(e.target.value)} />
        </div>
      </div>
      {kind === "while" && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={noInc} onChange={(e) => setNoInc(e.target.checked)} />
          Sayaç artırma satırını kaldır (sonsuz döngü demosu – simülatör güvenlik sınırıyla durdurur)
        </label>
      )}
      {"error" in built ? (
        <div className="rounded-lg border border-err/40 bg-[#f8e5e5] p-3 text-sm text-[#8e3a3a]">{built.error}</div>
      ) : (
        <>
          {built.warn && <div className="rounded-lg border border-warn/50 bg-[#faf0dc] p-3 text-sm text-[#7a5410]">⚠ {built.warn}</div>}
          <TraceViewer key={key} code={built.code} steps={built.steps} onDone={onUse} title="dongu.py" />
        </>
      )}
      <LabNote>Denemeler: adımı 2 yapın; bitişi başlangıçtan küçük girin (boş döngü); adımı -2 ve başlangıcı 30, bitişi 20 yapın.</LabNote>
    </div>
  );
}
