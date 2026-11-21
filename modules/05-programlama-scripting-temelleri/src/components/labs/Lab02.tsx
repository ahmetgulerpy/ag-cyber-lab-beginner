"use client";

import { useState } from "react";
import { Badge, Btn, inputCls, Label, LabNote } from "../ui";

type Kind = "start" | "input" | "process" | "decision" | "yes" | "no" | "output" | "end";
type Item = { id: string; kind: Kind; label: string; pseudo: string };

const CATALOG: Item[] = [
  { id: "start", kind: "start", label: "Başla", pseudo: "BAŞLA" },
  { id: "in", kind: "input", label: "Parolayı kullanıcıdan al", pseudo: "parola ← kullanıcıdan al" },
  { id: "len", kind: "process", label: "uzunluk ← karakter sayısı(parola)", pseudo: "uzunluk ← karakter sayısı(parola)" },
  { id: "dec", kind: "decision", label: "uzunluk ≥ 8 ?", pseudo: "uzunluk >= 8" },
  { id: "decw", kind: "decision", label: "uzunluk > 8 ?", pseudo: "uzunluk > 8" },
  { id: "yes", kind: "yes", label: "Yaz: Parola yeterli", pseudo: 'yaz "Parola yeterli"' },
  { id: "no", kind: "no", label: "Yaz: Parola çok kısa", pseudo: 'yaz "Parola çok kısa"' },
  { id: "leak", kind: "output", label: "Parolayı ekrana yaz (güvensiz!)", pseudo: "yaz parola" },
  { id: "end", kind: "end", label: "Bitir", pseudo: "BİTİR" },
];
const byId = (id: string) => CATALOG.find((c) => c.id === id) as Item;

const KIND_NAME: Record<Kind, string> = {
  start: "Başla/Bitir",
  end: "Başla/Bitir",
  input: "Girdi",
  process: "İşlem",
  decision: "Karar",
  yes: "Çıktı (Evet)",
  no: "Çıktı (Hayır)",
  output: "Çıktı",
};

function Arrow() {
  return (
    <div className="flex flex-col items-center text-brand" aria-hidden>
      <div className="h-4 w-px bg-brand" />
      <div className="-mt-1 text-[10px] leading-none">▼</div>
    </div>
  );
}

function Shape({ item }: { item: Item }) {
  const k = item.kind;
  if (k === "start" || k === "end")
    return <div className="rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white">{item.label}</div>;
  if (k === "process")
    return <div className="rounded-md border-2 border-brand bg-white px-4 py-2 text-center text-sm">{item.label}</div>;
  if (k === "decision")
    return (
      <div
        className="flex min-h-[84px] min-w-[190px] items-center justify-center bg-[#f7e7c4] px-12 py-6 text-center text-sm font-medium"
        style={{ clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" }}
      >
        {item.label}
      </div>
    );
  const danger = k === "output";
  return (
    <div className={`-skew-x-12 border-2 px-5 py-2 ${danger ? "border-err bg-[#f8e5e5]" : "border-accent bg-soft"}`}>
      <span className="block skew-x-12 text-center text-sm">{item.label}</span>
    </div>
  );
}

function Flowchart({ seq }: { seq: string[] }) {
  const items = seq.map(byId);
  const yes = items.filter((i) => i.kind === "yes");
  const no = items.filter((i) => i.kind === "no");
  const branchDone = { v: false };
  const nodes: React.ReactNode[] = [];
  items.forEach((it, idx) => {
    if (it.kind === "yes" || it.kind === "no") {
      if (branchDone.v) return;
      branchDone.v = true;
      nodes.push(
        <div key={"b" + idx} className="flex w-full flex-col items-center">
          <div className="grid w-full max-w-md grid-cols-2 gap-4">
            <div className="flex flex-col items-center gap-0">
              <span className="mb-1 text-xs font-semibold text-ok">Evet</span>
              {yes.length ? yes.map((y) => <div key={y.id}><Shape item={y} /></div>) : <span className="text-xs text-muted">— boş —</span>}
            </div>
            <div className="flex flex-col items-center gap-0">
              <span className="mb-1 text-xs font-semibold text-err">Hayır</span>
              {no.length ? no.map((n) => <div key={n.id}><Shape item={n} /></div>) : <span className="text-xs text-muted">— boş —</span>}
            </div>
          </div>
        </div>,
      );
      return;
    }
    nodes.push(
      <div key={it.id} className="flex flex-col items-center">
        <Shape item={it} />
      </div>,
    );
  });
  return (
    <div className="flex flex-col items-center">
      {nodes.map((n, i) => (
        <div key={i} className="flex w-full flex-col items-center">
          {i > 0 && <Arrow />}
          {n}
        </div>
      ))}
    </div>
  );
}

function pseudocode(seq: string[]): string {
  const items = seq.map(byId);
  const yes = items.filter((i) => i.kind === "yes");
  const no = items.filter((i) => i.kind === "no");
  const lines: string[] = [];
  let branchDone = false;
  const dec = items.find((i) => i.kind === "decision");
  items.forEach((it) => {
    if (it.kind === "yes" || it.kind === "no") {
      if (branchDone) return;
      branchDone = true;
      if (!dec) {
        yes.concat(no).forEach((x) => lines.push("  " + x.pseudo));
        return;
      }
      return;
    }
    if (it.kind === "decision") {
      lines.push(`  EĞER ${it.pseudo} İSE`);
      yes.forEach((y) => lines.push("      " + y.pseudo));
      lines.push("  DEĞİLSE");
      no.forEach((n) => lines.push("      " + n.pseudo));
      return;
    }
    lines.push(it.kind === "start" || it.kind === "end" ? it.pseudo : "  " + it.pseudo);
  });
  return lines.join("\n");
}

type Check = { ok: boolean; text: string; warn?: boolean };

function validate(seq: string[]): Check[] {
  const items = seq.map(byId);
  const idx = (kind: Kind) => items.findIndex((i) => i.kind === kind);
  const decIdx = idx("decision");
  const decCount = items.filter((i) => i.kind === "decision").length;
  const checks: Check[] = [];
  checks.push({ ok: items[0]?.kind === "start", text: "Algoritma “Başla” ile başlıyor." });
  checks.push({ ok: items[items.length - 1]?.kind === "end", text: "Algoritma “Bitir” ile sona eriyor." });
  const inI = idx("input");
  const prI = idx("process");
  checks.push({ ok: inI >= 0 && prI > inI, text: "Girdi alınıyor ve işlemden önce geliyor." });
  checks.push({ ok: prI >= 0 && decIdx > prI, text: "Uzunluk hesaplanıyor ve karardan önce geliyor." });
  checks.push({ ok: decCount === 1, text: "Tam olarak bir karar adımı var." });
  const yI = idx("yes");
  const nI = idx("no");
  checks.push({ ok: decIdx >= 0 && yI > decIdx && nI > decIdx, text: "Karardan sonra hem Evet hem Hayır dalı var." });
  checks.push({ ok: !seq.includes("leak"), text: "Parola ekrana yazdırılmıyor (güvenlik).", warn: true });
  checks.push({ ok: !seq.includes("decw"), text: "Karar sınırı doğru: “en az 8” için ≥ 8 kullanılmalı (> 8 off-by-one hatasıdır).", warn: true });
  return checks;
}

export default function Lab02({ onUse }: { onUse: () => void }) {
  const [seq, setSeq] = useState<string[]>(["start"]);
  const [pw, setPw] = useState("Merhaba2024");
  const [result, setResult] = useState<{ path: string[]; out: string } | null>(null);

  const add = (id: string) => {
    if (seq.includes(id)) return;
    setSeq([...seq, id]);
    setResult(null);
  };
  const remove = (i: number) => {
    setSeq(seq.filter((_, k) => k !== i));
    setResult(null);
  };
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= seq.length) return;
    const n = [...seq];
    [n[i], n[j]] = [n[j], n[i]];
    setSeq(n);
    setResult(null);
  };

  const checks = validate(seq);
  const hardOk = checks.slice(0, 6).every((c) => c.ok);
  const allOk = checks.every((c) => c.ok);

  const run = () => {
    if (!hardOk) return;
    const n = pw.length;
    const hasWrong = seq.includes("decw");
    const cond = hasWrong ? n > 8 : n >= 8;
    const path = ["Başla", "Girdi: parola = " + JSON.stringify(pw), `İşlem: uzunluk = ${n}`, `Karar: ${hasWrong ? "uzunluk > 8" : "uzunluk ≥ 8"} → ${cond ? "Evet" : "Hayır"}`];
    const out = cond ? "Parola yeterli" : "Parola çok kısa";
    path.push("Çıktı: " + out);
    if (seq.includes("leak")) path.push("Çıktı: parola ekrana yazıldı (güvensiz!)");
    path.push("Bitir");
    setResult({ path, out });
    onUse();
  };

  const available = CATALOG.filter((c) => !seq.includes(c.id));

  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-[#2b4152]">
        Hedef: <strong>parola uzunluğunu kontrol eden</strong> (en az 8 karakter) bir algoritma kurun. Adım kartlarına
        tıklayarak algoritmaya ekleyin, ▲▼ ile sıralayın. Yanlış veya güvensiz adımlar da listede; doğru olanları seçin.
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div>
            <p className="mb-2 text-sm font-semibold">Kullanılabilir adımlar</p>
            <div className="flex flex-wrap gap-2">
              {available.length === 0 && <span className="text-sm text-muted">Tüm adımlar kullanıldı.</span>}
              {available.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => add(c.id)}
                  className="rounded-lg border border-line bg-white px-3 py-1.5 text-left text-xs transition hover:border-brand hover:bg-soft"
                >
                  <span className="block text-[10px] uppercase tracking-wide text-muted">{KIND_NAME[c.kind]}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Algoritmanız ({seq.length} adım)</p>
            <ol className="space-y-1.5">
              {seq.map((id, i) => {
                const it = byId(id);
                return (
                  <li key={id} className="flex items-center gap-2 rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-soft text-[11px] font-bold text-brand">{i + 1}</span>
                    <span className="min-w-0 flex-1 truncate">{it.label}</span>
                    <button type="button" aria-label="Yukarı" className="rounded px-1.5 text-muted hover:bg-soft" onClick={() => move(i, -1)}>▲</button>
                    <button type="button" aria-label="Aşağı" className="rounded px-1.5 text-muted hover:bg-soft" onClick={() => move(i, 1)}>▼</button>
                    <button type="button" aria-label="Kaldır" className="rounded px-1.5 text-err hover:bg-[#f8e5e5]" onClick={() => remove(i)}>✕</button>
                  </li>
                );
              })}
            </ol>
            <div className="mt-2 flex gap-2">
              <Btn variant="secondary" onClick={() => { setSeq(["start"]); setResult(null); }}>Temizle</Btn>
              <Btn
                variant="secondary"
                onClick={() => { setSeq(["start", "in", "len", "dec", "yes", "no", "end"]); setResult(null); }}
              >
                Çözümü göster
              </Btn>
            </div>
          </div>
          <div className="rounded-lg border border-line bg-white p-3">
            <p className="mb-2 text-sm font-semibold">Doğrulama {allOk && <Badge tone="ok">Algoritma doğru</Badge>}</p>
            <ul className="space-y-1 text-sm">
              {checks.map((c, i) => (
                <li key={i} className={c.ok ? "text-ok" : c.warn ? "text-[#9a6b14]" : "text-muted"}>
                  {c.ok ? "✔" : c.warn ? "⚠" : "○"} {c.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold">Akış şeması</p>
          <div className="scroll-thin max-h-[560px] overflow-auto rounded-xl border border-line bg-[#fbfdfe] p-4">
            <Flowchart seq={seq} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-semibold">Sözde kod (otomatik)</p>
          <pre className="scroll-thin overflow-x-auto rounded-xl bg-[#172b3a] p-4 font-mono text-[13px] leading-6 text-slate-100">
            {pseudocode(seq)}
          </pre>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold">Algoritmayı test et</p>
          <Label>Test parolası</Label>
          <input className={inputCls} value={pw} onChange={(e) => { setPw(e.target.value); setResult(null); }} />
          <p className="text-xs text-muted">Uzunluk: {pw.length} karakter</p>
          <Btn onClick={run} disabled={!hardOk}>▶ Algoritmayı çalıştır</Btn>
          {!hardOk && <p className="text-xs text-muted">Çalıştırmak için ilk altı kontrol sağlanmalıdır.</p>}
          {result && (
            <div className="rounded-lg border border-line bg-white p-3 text-sm">
              <ol className="list-decimal space-y-0.5 pl-5">
                {result.path.map((p, i) => <li key={i}>{p}</li>)}
              </ol>
              <p className="mt-2 font-semibold text-brand">Sonuç: {result.out}</p>
            </div>
          )}
        </div>
      </div>
      <LabNote>İpucu: “uzunluk &gt; 8” kararını seçip 8 karakterlik bir parola deneyin; sınır hatasını canlı görürsünüz.</LabNote>
    </div>
  );
}
