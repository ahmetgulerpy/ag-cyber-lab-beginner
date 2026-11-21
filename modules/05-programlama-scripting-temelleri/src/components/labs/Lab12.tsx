"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Btn, inputCls, Label, LabNote, Terminal, TraceViewer, type Step } from "../ui";

type Obj = Record<string, string | number>;
type Out = { kind: "table"; cols: string[]; rows: Obj[] } | { kind: "text"; lines: string[] };

const PROCS: Obj[] = [
  { Id: 4, ProcessName: "System", CPU: 120.5, "WS(MB)": 0.1 },
  { Id: 612, ProcessName: "svchost", CPU: 14.2, "WS(MB)": 38 },
  { Id: 1044, ProcessName: "chrome", CPU: 86.9, "WS(MB)": 412 },
  { Id: 1380, ProcessName: "explorer", CPU: 22.4, "WS(MB)": 120 },
  { Id: 2210, ProcessName: "notepad", CPU: 0.4, "WS(MB)": 14 },
  { Id: 2584, ProcessName: "powershell", CPU: 3.1, "WS(MB)": 66 },
  { Id: 3012, ProcessName: "Code", CPU: 41.7, "WS(MB)": 288 },
];
const SERVICES: Obj[] = [
  { Status: "Running", Name: "WinDefend", DisplayName: "Microsoft Defender Antivirus Service" },
  { Status: "Running", Name: "EventLog", DisplayName: "Windows Event Log" },
  { Status: "Running", Name: "Dhcp", DisplayName: "DHCP Client" },
  { Status: "Stopped", Name: "Fax", DisplayName: "Fax" },
  { Status: "Running", Name: "mpssvc", DisplayName: "Windows Defender Firewall" },
  { Status: "Stopped", Name: "RemoteRegistry", DisplayName: "Remote Registry" },
  { Status: "Running", Name: "Spooler", DisplayName: "Print Spooler" },
];
const HOME = "C:\\Users\\Ogrenci";
const FILES: Record<string, Obj[]> = {
  [HOME]: [
    { Mode: "d-----", LastWriteTime: "10.01.2026 09:00", Length: "", Name: "Belgeler" },
    { Mode: "d-----", LastWriteTime: "10.01.2026 09:00", Length: "", Name: "Masaüstü" },
    { Mode: "-a----", LastWriteTime: "10.01.2026 09:12", Length: 342, Name: "notlar.txt" },
    { Mode: "-a----", LastWriteTime: "10.01.2026 09:14", Length: 128, Name: "rapor.ps1" },
    { Mode: "-a----", LastWriteTime: "10.01.2026 09:20", Length: 2048, Name: "log.csv" },
  ],
  [HOME + "\\Belgeler"]: [{ Mode: "-a----", LastWriteTime: "09.01.2026 17:30", Length: 5120, Name: "ders1.docx" }],
  [HOME + "\\Masaüstü"]: [],
};

const HELP: Record<string, { desc: string; syntax: string }> = {
  "get-process": { desc: "Bilgisayarda çalışan süreçleri (işlemleri) listeler.", syntax: "Get-Process [-Name <string>]" },
  "get-service": { desc: "Windows servislerini ve durumlarını listeler.", syntax: "Get-Service [-Name <string>]" },
  "get-date": { desc: "Geçerli tarih ve saati getirir.", syntax: "Get-Date" },
  "get-location": { desc: "Geçerli çalışma konumunu (dizini) gösterir. Takma adı: pwd.", syntax: "Get-Location" },
  "set-location": { desc: "Çalışma konumunu değiştirir. Takma adı: cd.", syntax: "Set-Location <path>" },
  "get-childitem": { desc: "Bir konumdaki dosya ve klasörleri listeler. Takma adları: ls, dir, gci.", syntax: "Get-ChildItem [<path>]" },
  "write-output": { desc: "Nesne veya metni pipeline'a/ekrana gönderir. Takma adı: echo.", syntax: "Write-Output <object>" },
  "get-command": { desc: "Kullanılabilir komutları (cmdlet) listeler ve arar.", syntax: "Get-Command [<pattern>]" },
  "get-help": { desc: "Bir cmdlet için yardım bilgisini gösterir.", syntax: "Get-Help <cmdlet>" },
  "where-object": { desc: "Pipeline'daki nesneleri bir koşula göre filtreler.", syntax: "Where-Object { $_.Property -gt 10 }  veya  Where-Object Property -gt 10" },
  "select-object": { desc: "Nesnelerin belirli özelliklerini veya ilk/son N elemanını seçer.", syntax: "Select-Object [-Property] <p1,p2> [-First <n>]" },
  "sort-object": { desc: "Nesneleri bir özelliğe göre sıralar.", syntax: "Sort-Object <Property> [-Descending]" },
  "measure-object": { desc: "Nesneleri sayar (Count).", syntax: "Measure-Object" },
  "clear-host": { desc: "Ekranı temizler. Takma adı: cls.", syntax: "Clear-Host" },
};
const CMDS = Object.keys(HELP).map((k) => k.split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join("-"));
const ALIAS: Record<string, string> = { ls: "get-childitem", dir: "get-childitem", gci: "get-childitem", pwd: "get-location", cd: "set-location", sl: "set-location", echo: "write-output", "write-host": "write-output", cls: "clear-host", gps: "get-process", ps: "get-process", where: "where-object", "?": "where-object", select: "select-object", sort: "sort-object", measure: "measure-object", man: "get-help", help: "get-help", gcm: "get-command", gsv: "get-service" };

type Ctx = { cwd: string; vars: Record<string, string> };

function splitPipes(s: string): string[] {
  const out: string[] = [];
  let cur = "";
  let q = "";
  let depth = 0;
  for (const ch of s) {
    if (q) {
      cur += ch;
      if (ch === q) q = "";
    } else if (ch === '"' || ch === "'") {
      q = ch;
      cur += ch;
    } else if (ch === "{") {
      depth++;
      cur += ch;
    } else if (ch === "}") {
      depth--;
      cur += ch;
    } else if (ch === "|" && depth === 0) {
      out.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

function interp(ctx: Ctx, s: string): string {
  return s.replace(/\$([A-Za-z_][A-Za-z0-9_]*)/g, (_, n: string) => ctx.vars[n] ?? "");
}
function unq(s: string): string {
  const t = s.trim();
  return /^(".*"|'.*')$/.test(t) ? t.slice(1, -1) : t;
}
function wild(pattern: string, v: string): boolean {
  const re = new RegExp("^" + pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".") + "$", "i");
  return re.test(v);
}

function compare(a: string | number, op: string, b: string): boolean | null {
  const bn = Number(b);
  const an = Number(a);
  const numeric = typeof a === "number" || (!Number.isNaN(an) && b !== "" && !Number.isNaN(bn));
  const bs = unq(b);
  switch (op) {
    case "-eq": return numeric ? an === bn : String(a).toLowerCase() === bs.toLowerCase();
    case "-ne": return numeric ? an !== bn : String(a).toLowerCase() !== bs.toLowerCase();
    case "-gt": return an > bn;
    case "-lt": return an < bn;
    case "-ge": return an >= bn;
    case "-le": return an <= bn;
    case "-like": return wild(bs, String(a));
    case "-match": try { return new RegExp(bs, "i").test(String(a)); } catch { return null; }
    default: return null;
  }
}

function toTable(o: Out): Out {
  return o;
}

function runStage(ctx: Ctx, stage: string, input: Out | null): { out: Out; err?: string } {
  const m = stage.match(/^(\S+)\s*([\s\S]*)$/);
  if (!m) return { out: { kind: "text", lines: [] } };
  const name0 = m[1];
  const rest = m[2].trim();
  const key = ALIAS[name0.toLowerCase()] ?? name0.toLowerCase();
  const err = (t: string) => ({ out: { kind: "text", lines: [] } as Out, err: t });

  switch (key) {
    case "get-process": {
      const n = rest.match(/-Name\s+(\S+)/i)?.[1] ?? (rest && !rest.startsWith("-") ? rest : null);
      const rows = n ? PROCS.filter((p) => wild(unq(n), String(p.ProcessName))) : PROCS;
      if (n && rows.length === 0) return err(`Get-Process : '${unq(n)}' adlı işlem bulunamadı.`);
      return { out: { kind: "table", cols: ["Id", "ProcessName", "CPU", "WS(MB)"], rows } };
    }
    case "get-service": {
      const n = rest.match(/-Name\s+(\S+)/i)?.[1] ?? (rest && !rest.startsWith("-") ? rest : null);
      const rows = n ? SERVICES.filter((p) => wild(unq(n), String(p.Name))) : SERVICES;
      if (n && rows.length === 0) return err(`Get-Service : '${unq(n)}' adlı servis bulunamadı.`);
      return { out: { kind: "table", cols: ["Status", "Name", "DisplayName"], rows } };
    }
    case "get-date":
      return { out: { kind: "text", lines: [new Date().toLocaleString("tr-TR", { dateStyle: "full", timeStyle: "medium" })] } };
    case "get-location":
      return { out: { kind: "table", cols: ["Path"], rows: [{ Path: ctx.cwd }] } };
    case "set-location": {
      const t = unq(rest);
      let target = ctx.cwd;
      if (t === "..") target = ctx.cwd.includes("\\") && ctx.cwd !== HOME ? ctx.cwd.slice(0, ctx.cwd.lastIndexOf("\\")) : ctx.cwd;
      else if (t === "~" || t === "") target = HOME;
      else if (FILES[t]) target = t;
      else if (FILES[ctx.cwd + "\\" + t]) target = ctx.cwd + "\\" + t;
      else return err(`Set-Location : '${t}' yolu bulunamadığından bulunamıyor.`);
      ctx.cwd = target;
      return { out: { kind: "text", lines: [] } };
    }
    case "get-childitem": {
      const rows = FILES[ctx.cwd] ?? [];
      return { out: { kind: "table", cols: ["Mode", "LastWriteTime", "Length", "Name"], rows } };
    }
    case "write-output": {
      if (!rest) return { out: { kind: "text", lines: [] } };
      return { out: { kind: "text", lines: [interp(ctx, unq(rest))] } };
    }
    case "clear-host":
      return { out: { kind: "text", lines: ["__CLEAR__"] } };
    case "get-command": {
      const p = unq(rest) || "*";
      const hits = CMDS.filter((c) => wild(p.includes("*") ? p : p + "*", c) || wild("*" + p + "*", c));
      if (!hits.length) return err(`Get-Command : '${p}' ile eşleşen komut bulunamadı.`);
      return { out: { kind: "table", cols: ["CommandType", "Name"], rows: hits.map((h) => ({ CommandType: "Cmdlet", Name: h })) } };
    }
    case "get-help": {
      const t = (ALIAS[unq(rest).toLowerCase()] ?? unq(rest).toLowerCase());
      const h = HELP[t];
      if (!h) return err(`Get-Help : '${unq(rest)}' için yardım bulunamadı. Get-Command ile komutları arayın.`);
      return { out: { kind: "text", lines: ["AD", "    " + t.split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join("-"), "", "ÖZET", "    " + h.desc, "", "SÖZDİZİMİ", "    " + h.syntax] } };
    }
    case "where-object": {
      if (!input || input.kind !== "table") return err("Where-Object : Bu aşama bir nesne listesi (pipeline girdisi) bekler.");
      const body = rest.replace(/^\{\s*/, "").replace(/\s*\}$/, "").replace(/\$_\./g, "");
      const mm = body.match(/^(\w[\w()]*)\s+(-\w+)\s+(.+)$/);
      if (!mm) return err("Where-Object : Koşul çözümlenemedi. Örnek: Where-Object { $_.CPU -gt 10 }");
      const [, prop, op, val] = mm;
      if (!input.cols.includes(prop)) return err(`Where-Object : '${prop}' özelliği bu nesnelerde yok. Mevcut özellikler: ${input.cols.join(", ")}`);
      const rows: Obj[] = [];
      for (const r of input.rows) {
        const res = compare(r[prop], op, val);
        if (res === null) return err(`Where-Object : '${op}' operatörü desteklenmiyor (eq, ne, gt, lt, ge, le, like, match).`);
        if (res) rows.push(r);
      }
      return { out: { kind: "table", cols: input.cols, rows } };
    }
    case "select-object": {
      if (!input || input.kind !== "table") return err("Select-Object : Bu aşama bir nesne listesi bekler.");
      const first = rest.match(/-First\s+(\d+)/i)?.[1];
      const last = rest.match(/-Last\s+(\d+)/i)?.[1];
      const propsRaw = rest.replace(/-(First|Last)\s+\d+/gi, "").replace(/-Property/i, "").trim();
      let cols = input.cols;
      if (propsRaw) {
        cols = propsRaw.split(",").map((x) => x.trim()).filter(Boolean);
        const bad = cols.find((c) => !input.cols.includes(c));
        if (bad) return err(`Select-Object : '${bad}' özelliği bulunamadı. Mevcut özellikler: ${input.cols.join(", ")}`);
      }
      let rows = input.rows;
      if (first) rows = rows.slice(0, Number(first));
      if (last) rows = rows.slice(-Number(last));
      return { out: { kind: "table", cols, rows } };
    }
    case "sort-object": {
      if (!input || input.kind !== "table") return err("Sort-Object : Bu aşama bir nesne listesi bekler.");
      const desc = /-Descending/i.test(rest);
      const prop = rest.replace(/-Descending/i, "").replace(/-Property/i, "").trim();
      if (!prop) return err("Sort-Object : Sıralanacak özelliği yazın. Örnek: Sort-Object CPU -Descending");
      if (!input.cols.includes(prop)) return err(`Sort-Object : '${prop}' özelliği bulunamadı. Mevcut özellikler: ${input.cols.join(", ")}`);
      const rows = [...input.rows].sort((a, b) => {
        const x = a[prop];
        const y = b[prop];
        const r = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y));
        return desc ? -r : r;
      });
      return { out: { kind: "table", cols: input.cols, rows } };
    }
    case "measure-object": {
      const n = input ? (input.kind === "table" ? input.rows.length : input.lines.length) : 0;
      return { out: { kind: "table", cols: ["Count"], rows: [{ Count: n }] } };
    }
    default:
      return err(`${name0} : '${name0}' terimi bir cmdlet, işlev, betik dosyası veya çalıştırılabilir program adı olarak tanınmadı. (Get-Command ile arayın)`);
  }
}

function formatOut(o: Out): string {
  if (o.kind === "text") return o.lines.join("\n");
  if (o.rows.length === 0) return "";
  const widths = o.cols.map((c) => Math.max(c.length, ...o.rows.map((r) => String(r[c] ?? "").length)));
  const row = (cells: string[]) => cells.map((c, i) => c.padEnd(widths[i])).join("  ");
  return [row(o.cols), row(o.cols.map((c, i) => "-".repeat(Math.min(c.length, widths[i])))), ...o.rows.map((r) => row(o.cols.map((c) => String(r[c] ?? ""))))].join("\n");
}

function runPS(ctx: Ctx, line: string): { text: string; err?: boolean; clear?: boolean; explain: { name: string; desc: string }[] } {
  const l = line.trim();
  const explain: { name: string; desc: string }[] = [];
  // değişken ataması
  const asg = l.match(/^\$([A-Za-z_]\w*)\s*=\s*(.+)$/);
  if (asg) {
    const v = asg[2].trim();
    ctx.vars[asg[1]] = /^(".*"|'.*')$/.test(v) ? interp(ctx, unq(v)) : v;
    explain.push({ name: "$" + asg[1] + " = ...", desc: "Bir değişkene değer atar. PowerShell değişkenleri $ ile başlar; tipi değere göre otomatik belirlenir." });
    return { text: "", explain };
  }
  const only = l.match(/^\$([A-Za-z_]\w*)$/);
  if (only) {
    explain.push({ name: "$" + only[1], desc: "Değişkenin değerini yazdırır." });
    return ctx.vars[only[1]] !== undefined ? { text: ctx.vars[only[1]], explain } : { text: `Değişken '${only[1]}' henüz tanımlanmadı (boş değer).`, explain };
  }
  const stages = splitPipes(l);
  let cur: Out | null = null;
  for (const st of stages) {
    const first = st.split(/\s+/)[0];
    const k = ALIAS[first.toLowerCase()] ?? first.toLowerCase();
    if (HELP[k]) explain.push({ name: first, desc: HELP[k].desc });
    const r = runStage(ctx, st, cur);
    if (r.err) return { text: r.err, err: true, explain };
    cur = toTable(r.out);
  }
  if (!cur) return { text: "", explain };
  if (cur.kind === "text" && cur.lines[0] === "__CLEAR__") return { text: "", clear: true, explain };
  if (stages.length > 1) explain.push({ name: "|", desc: "Pipeline: soldaki komutun çıktısı (nesneler) sağdaki komuta girdi olarak aktarılır." });
  return { text: formatOut(cur), explain };
}

type L = { k: "cmd" | "out" | "err"; text: string; cwd?: string };

export default function Lab12({ onUse }: { onUse: () => void }) {
  const ctx = useRef<Ctx>({ cwd: HOME, vars: {} });
  const [lines, setLines] = useState<L[]>([{ k: "out", text: "AG CYBER LAB sanal PowerShell — yalnızca tarayıcıda çalışan bir simülasyondur. Başlamak için: Get-Command" }]);
  const [input, setInput] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const [cwd, setCwd] = useState(HOME);
  const [explain, setExplain] = useState<{ name: string; desc: string }[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);
  const [esik, setEsik] = useState("3");

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [lines]);

  const exec = (cmd: string) => {
    const c = cmd.trim();
    const pc = ctx.current.cwd;
    if (!c) return;
    const r = runPS(ctx.current, c);
    if (r.clear) setLines([]);
    else setLines((l) => [...l, { k: "cmd", text: c, cwd: pc }, ...(r.text ? [{ k: r.err ? "err" : "out", text: r.text } as L] : [])]);
    setExplain(r.explain);
    setCwd(ctx.current.cwd);
    setHist((h) => [...h, c]);
    setHi(-1);
    setInput("");
    onUse();
  };

  const quick = ["Get-Process", "Get-Service", "Get-Date", "Get-Location", "Get-ChildItem", "Write-Output \"Merhaba AG\"", "Get-Command *Service*", "Get-Help Get-Process", "Get-Process | Where-Object { $_.CPU -gt 20 } | Sort-Object CPU -Descending", "Get-Service | Where-Object { $_.Status -eq 'Running' } | Select-Object -First 3", "$ad = \"Ayşe\"", "Write-Output \"Merhaba $ad\"", "Set-Location Belgeler"];

  const e = Number.isFinite(parseInt(esik, 10)) ? parseInt(esik, 10) : 3;
  const code = `$esik = ${e}
$denemeler = @(1, 2, 5, 4)

foreach ($d in $denemeler) {
    if ($d -ge $esik) {
        Write-Output "UYARI: $d deneme eşiği aştı"
    }
    else {
        Write-Output "Normal: $d"
    }
}`;
  const steps = useMemo(() => {
    const st: Step[] = [
      { line: 0, vars: { "$esik": String(e) }, note: "`$esik` değişkenine sayı atanır. PowerShell'de değişkenler `$` ile başlar." },
      { line: 1, vars: { "$esik": String(e), "$denemeler": "1, 2, 5, 4" }, note: "`@( )` bir dizi (array) oluşturur." },
    ];
    for (const d of [1, 2, 5, 4]) {
      const ok = d >= e;
      st.push({ line: 3, vars: { "$esik": String(e), "$d": String(d) }, note: `\`foreach\` dizinin sıradaki elemanını \`$d\` değişkenine atar: ${d}.` });
      st.push({ line: 4, vars: { "$esik": String(e), "$d": String(d) }, note: `\`${d} -ge ${e}\` → **${ok ? "True" : "False"}**. (\`-ge\` büyük veya eşit demektir.)` });
      st.push({ line: ok ? 5 : 8, vars: { "$esik": String(e), "$d": String(d) }, out: ok ? `UYARI: ${d} deneme eşiği aştı` : `Normal: ${d}`, note: `${ok ? "if" : "else"} bloğu çalışır ve \`Write-Output\` çıktı üretir.` });
    }
    return st;
  }, [e]);

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-ok/30 bg-[#e3f3ec] px-3 py-2 text-xs leading-5 text-[#1b5f42]">
        🔒 Bu PowerShell bir <strong>simülasyondur</strong>: gerçek Windows sistemine müdahale edilmez, hiçbir komut
        işletim sisteminde çalıştırılmaz. Süreç ve servis listeleri örnek (sahte) verilerdir.
      </div>
      <div className="flex flex-wrap gap-1.5">
        {quick.map((q) => (
          <button key={q} type="button" onClick={() => exec(q)} className="rounded-full border border-line bg-white px-2.5 py-1 font-mono text-[11px] hover:bg-soft">
            {q.length > 54 ? q.slice(0, 52) + "…" : q}
          </button>
        ))}
      </div>
      <Terminal title="PowerShell — Ogrenci">
        <div ref={boxRef} onClick={() => document.getElementById("ps-input")?.focus()} className="scroll-thin h-80 overflow-auto bg-[#12304a] p-4 font-mono text-[13px] leading-6 text-slate-100">
          {lines.map((l, i) =>
            l.k === "cmd" ? (
              <div key={i}>
                <span className="text-[#f0d98a]">PS {l.cwd}&gt;</span> {l.text}
              </div>
            ) : (
              <pre key={i} className={`whitespace-pre-wrap font-mono ${l.k === "err" ? "text-[#f2a1a1]" : ""}`}>{l.text}</pre>
            ),
          )}
          <form onSubmit={(ev) => { ev.preventDefault(); exec(input); }} className="flex gap-2">
            <span className="shrink-0 text-[#f0d98a]">PS {cwd}&gt;</span>
            <input
              id="ps-input"
              aria-label="PowerShell komutu"
              autoComplete="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent text-slate-100 outline-none"
              value={input}
              onChange={(ev) => setInput(ev.target.value)}
              onKeyDown={(ev) => {
                if (ev.key === "ArrowUp" && hist.length) {
                  ev.preventDefault();
                  const n = hi < 0 ? hist.length - 1 : Math.max(0, hi - 1);
                  setHi(n);
                  setInput(hist[n]);
                } else if (ev.key === "ArrowDown" && hi >= 0) {
                  ev.preventDefault();
                  const n = hi + 1;
                  if (n >= hist.length) { setHi(-1); setInput(""); } else { setHi(n); setInput(hist[n]); }
                }
              }}
            />
          </form>
        </div>
      </Terminal>

      <div className="rounded-xl border border-line bg-white p-4">
        <p className="mb-2 text-sm font-semibold">Komut açıklaması</p>
        {explain.length === 0 ? (
          <p className="text-sm text-muted">Bir komut çalıştırın; her cmdlet&apos;in ne yaptığı burada açıklanır.</p>
        ) : (
          <ul className="space-y-1.5 text-sm">
            {explain.map((x, i) => (
              <li key={i}><code className="rounded bg-soft px-1.5 py-0.5 font-mono text-xs text-brand">{x.name}</code> — {x.desc}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-3 rounded-xl border border-line bg-white p-4">
        <h3 className="font-semibold">PowerShell script çözümleyici (adım adım)</h3>
        <div className="max-w-xs">
          <Label>Eşik değeri ($esik)</Label>
          <input className={inputCls} value={esik} onChange={(ev) => setEsik(ev.target.value)} />
        </div>
        <TraceViewer key={code} code={code} steps={steps} onDone={onUse} title="denetim.ps1" />
      </div>
      <div className="flex gap-2">
        <Btn variant="ghost" onClick={() => { setLines([]); }}>Ekranı temizle</Btn>
      </div>
      <LabNote>Denemeler: <code>Get-Process | Where-Object CPU -gt 20</code>, <code>Get-Service -Name Spooler</code>, <code>Get-Help Get-Service</code>. Hatalı bir komut yazarak hata mesajlarını okuyun.</LabNote>
    </div>
  );
}
