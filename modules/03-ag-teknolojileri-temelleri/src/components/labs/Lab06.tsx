"use client";

import { useState } from "react";
import { Btn, Callout, LabBox } from "@/components/ui";
import { OSI, TCPIP } from "@/data/layers";
import { markLab } from "@/lib/storage";

const QUIZ = [7, 4, 3, 2, 6, 1, 5];

export default function Lab06() {
  const [sel, setSel] = useState<{ side: "osi" | "tcp"; i: number } | null>(null);
  const [qi, setQi] = useState(0);
  const [ans, setAns] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const pick = (side: "osi" | "tcp", i: number) => {
    setSel({ side, i });
    markLab(6);
  };

  const hiOsi = (n: number) => (sel ? (sel.side === "osi" ? OSI[sel.i].n === n : TCPIP[sel.i].osi.includes(n)) : false);
  const hiTcp = (idx: number) => (sel ? (sel.side === "tcp" ? sel.i === idx : OSI[sel.i].tcpip === idx) : false);

  const selText = () => {
    if (!sel) return null;
    if (sel.side === "osi") {
      const o = OSI[sel.i];
      const t = TCPIP[o.tcpip];
      return (
        <>
          <b>OSI {o.n} – {o.name}</b> katmanı, TCP/IP modelinde <b>{t.name}</b> katmanına karşılık gelir. {t.desc}
          {t.osi.length > 1 && <> Bu TCP/IP katmanı OSI&apos;nin {t.osi.join(", ")}. katmanlarını tek başına kapsar.</>}
        </>
      );
    }
    const t = TCPIP[sel.i];
    return (
      <>
        <b>TCP/IP {t.name}</b> katmanı, OSI&apos;nin <b>{t.osi.map((n) => `${n}. ${OSI.find((l) => l.n === n)!.name}`).join(" + ")}</b> katman(lar)ına karşılık gelir. {t.desc} Örnek protokoller: {t.protocols}.
      </>
    );
  };

  const target = QUIZ[qi % QUIZ.length];
  const correct = OSI.find((l) => l.n === target)!.tcpip;
  const answer = (i: number) => {
    if (ans !== null) return;
    setAns(i);
    if (i === correct) setScore((s) => s + 1);
  };

  const rowOf = (n: number) => 8 - n; // OSI 7 → satır 1

  return (
    <LabBox title="OSI – TCP/IP Karşılaştırma">
      <p className="text-sm text-muted">Bir katmana tıkla; diğer modeldeki karşılığı vurgulanır.</p>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 sm:gap-x-8" style={{ gridTemplateRows: "auto repeat(7, minmax(46px, auto))" }}>
        <p className="text-center text-xs font-bold uppercase tracking-wide text-muted">OSI Modeli (7)</p>
        <p className="text-center text-xs font-bold uppercase tracking-wide text-muted">TCP/IP Modeli (4)</p>
        {OSI.map((l) => (
          <button key={l.n} type="button" onClick={() => pick("osi", OSI.indexOf(l))} style={{ gridColumn: 1, gridRow: rowOf(l.n) + 1 }} className={`rounded-lg border px-2 py-2 text-left text-sm font-semibold transition sm:px-3 ${hiOsi(l.n) ? "border-brand bg-brand text-white shadow" : "border-line bg-white hover:bg-soft"}`}>
            <span className="mr-2 inline-block rounded bg-soft px-1.5 text-xs text-brand">{l.n}</span>
            {l.name}
            <span className={`block text-[11px] font-normal ${hiOsi(l.n) ? "text-white/80" : "text-muted"}`}>{l.en}</span>
          </button>
        ))}
        {TCPIP.map((t, i) => {
          const rows = t.osi.map((n) => rowOf(n) + 1);
          const start = Math.min(...rows);
          return (
            <button key={t.name} type="button" onClick={() => pick("tcp", i)} style={{ gridColumn: 2, gridRow: `${start} / span ${t.osi.length}` }} className={`flex flex-col justify-center rounded-lg border px-2 py-2 text-center text-sm font-bold transition sm:px-3 ${hiTcp(i) ? "border-accent bg-accent text-white shadow" : "border-line bg-soft text-ink hover:bg-[#d6eaf1]"}`}>
              {t.name}
              <span className={`text-[11px] font-normal ${hiTcp(i) ? "text-white/85" : "text-muted"}`}>{t.en}</span>
              <span className={`mt-1 hidden text-[10px] font-normal sm:block ${hiTcp(i) ? "text-white/85" : "text-muted"}`}>{t.protocols}</span>
            </button>
          );
        })}
      </div>
      {sel ? <Callout title="Eşleşme açıklaması">{selText()}</Callout> : <Callout title="İpucu">Örneğin &quot;Sunum&quot; katmanına tıkla ve TCP/IP&apos;de hangi katmanın yandığına bak.</Callout>}
      <div className="rounded-xl border border-line bg-white p-4">
        <p className="mb-2 text-sm font-bold">Mini alıştırma · Puan: {score}/{qi + (ans !== null ? 1 : 0)}</p>
        <p className="mb-3 text-sm">OSI <b>{target}. katman ({OSI.find((l) => l.n === target)!.name})</b> TCP/IP&apos;de hangi katmana karşılık gelir?</p>
        <div className="grid gap-2 sm:grid-cols-4">
          {TCPIP.map((t, i) => (
            <button key={t.name} type="button" onClick={() => answer(i)} disabled={ans !== null} className={`min-h-[42px] rounded-lg border px-2 text-sm font-semibold ${ans === null ? "border-line hover:bg-soft" : i === correct ? "border-ok bg-[#E9F5EF] text-ok" : i === ans ? "border-err bg-[#F9ECEC] text-err" : "border-line opacity-60"}`}>
              {t.name}
            </button>
          ))}
        </div>
        {ans !== null && (
          <div className="mt-3 space-y-2">
            <Callout kind={ans === correct ? "ok" : "err"} title={ans === correct ? "Doğru!" : `Yanlış. Doğrusu: ${TCPIP[correct].name}`}>
              TCP/IP {TCPIP[correct].name} katmanı OSI&apos;nin {TCPIP[correct].osi.join(", ")}. katman(lar)ını kapsar.
            </Callout>
            <Btn onClick={() => { setQi(qi + 1); setAns(null); }}>Sonraki soru →</Btn>
          </div>
        )}
      </div>
    </LabBox>
  );
}
