"use client";

import { useState } from "react";
import { Badge, Btn, inputCls, Label, LabNote } from "../ui";

type T = "str" | "int" | "float" | "bool" | "None";
type PyVal = { t: T; v: string | number | boolean | null };

const KEYWORDS = new Set([
  "False", "None", "True", "and", "as", "assert", "break", "class", "continue", "def", "del", "elif", "else",
  "except", "finally", "for", "from", "global", "if", "import", "in", "is", "lambda", "nonlocal", "not", "or",
  "pass", "raise", "return", "try", "while", "with", "yield",
]);

function fmtFloat(n: number): string {
  return Number.isInteger(n) ? n.toFixed(1) : String(n);
}

function repr(x: PyVal): string {
  switch (x.t) {
    case "str":
      return "'" + String(x.v).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
    case "int":
      return String(x.v);
    case "float":
      return fmtFloat(x.v as number);
    case "bool":
      return x.v ? "True" : "False";
    default:
      return "None";
  }
}

function parse(t: T, raw: string): PyVal | { error: string } {
  const s = raw.trim();
  if (t === "str") return { t, v: raw };
  if (t === "None") return { t, v: null };
  if (t === "int") {
    if (!/^[+-]?\d+$/.test(s)) return { error: `ValueError: '${raw}' tam sayı (int) olarak yazılamaz. Örnek: 42` };
    return { t, v: parseInt(s, 10) };
  }
  if (t === "float") {
    if (!/^[+-]?(\d+\.?\d*|\.\d+)$/.test(s)) return { error: `ValueError: '${raw}' ondalıklı sayı (float) olarak yazılamaz. Örnek: 3.14` };
    return { t, v: parseFloat(s) };
  }
  if (s !== "True" && s !== "False") return { error: "bool değeri yalnızca True veya False olabilir (büyük/küçük harfe duyarlı)." };
  return { t, v: s === "True" };
}

function num(x: PyVal): number | null {
  if (x.t === "int" || x.t === "float") return x.v as number;
  if (x.t === "bool") return x.v ? 1 : 0;
  return null;
}

function truthy(x: PyVal): boolean {
  if (x.t === "None") return false;
  if (x.t === "str") return String(x.v).length > 0;
  if (x.t === "bool") return Boolean(x.v);
  return (x.v as number) !== 0;
}

function toStr(x: PyVal): string {
  if (x.t === "str") return String(x.v);
  return repr(x);
}

const OPS = ["+", "-", "*", "/", "//", "%", "==", "<", ">"] as const;

function operate(a: PyVal, op: string, b: PyVal): PyVal | { error: string } {
  const na = num(a);
  const nb = num(b);
  const bothNum = na !== null && nb !== null;
  const anyFloat = a.t === "float" || b.t === "float";
  const mk = (n: number): PyVal => (anyFloat || op === "/" ? { t: "float", v: n } : { t: "int", v: n });
  const unsupported = {
    error: `TypeError: unsupported operand type(s) for ${op}: '${a.t === "None" ? "NoneType" : a.t}' and '${b.t === "None" ? "NoneType" : b.t}'`,
  };

  if (op === "==") {
    if (bothNum) return { t: "bool", v: na === nb };
    if (a.t === b.t) return { t: "bool", v: a.v === b.v };
    return { t: "bool", v: false };
  }
  if (op === "<" || op === ">") {
    if (bothNum) return { t: "bool", v: op === "<" ? (na as number) < (nb as number) : (na as number) > (nb as number) };
    if (a.t === "str" && b.t === "str") return { t: "bool", v: op === "<" ? String(a.v) < String(b.v) : String(a.v) > String(b.v) };
    return { error: `TypeError: '${op}' not supported between instances of '${a.t === "None" ? "NoneType" : a.t}' and '${b.t === "None" ? "NoneType" : b.t}'` };
  }
  if (op === "+") {
    if (a.t === "str" && b.t === "str") return { t: "str", v: String(a.v) + String(b.v) };
    if (a.t === "str") return { error: `TypeError: can only concatenate str (not "${b.t === "None" ? "NoneType" : b.t}") to str` };
    if (bothNum) return mk((na as number) + (nb as number));
    return unsupported;
  }
  if (op === "*") {
    if (a.t === "str" && b.t === "int") return { t: "str", v: String(a.v).repeat(Math.max(0, Math.min(200, b.v as number))) };
    if (b.t === "str" && a.t === "int") return { t: "str", v: String(b.v).repeat(Math.max(0, Math.min(200, a.v as number))) };
    if (bothNum) return mk((na as number) * (nb as number));
    return unsupported;
  }
  if (!bothNum) return unsupported;
  if ((op === "/" || op === "//" || op === "%") && nb === 0) {
    return { error: op === "/" ? "ZeroDivisionError: division by zero" : "ZeroDivisionError: integer division or modulo by zero" };
  }
  if (op === "-") return mk((na as number) - (nb as number));
  if (op === "/") return { t: "float", v: (na as number) / (nb as number) };
  if (op === "//") return mk(Math.floor((na as number) / (nb as number)));
  return mk(((na as number) % (nb as number) + (nb as number)) % (nb as number));
}

function convert(x: PyVal, fn: string): PyVal | { error: string } {
  const tn = x.t === "None" ? "NoneType" : x.t;
  if (fn === "str") return { t: "str", v: toStr(x) };
  if (fn === "bool") return { t: "bool", v: truthy(x) };
  if (fn === "int") {
    if (x.t === "None") return { error: `TypeError: int() argument must be a string, a bytes-like object or a real number, not '${tn}'` };
    if (x.t === "str") {
      const s = String(x.v).trim();
      if (!/^[+-]?\d+$/.test(s)) return { error: `ValueError: invalid literal for int() with base 10: '${x.v}'` };
      return { t: "int", v: parseInt(s, 10) };
    }
    return { t: "int", v: Math.trunc(num(x) as number) };
  }
  if (x.t === "None") return { error: `TypeError: float() argument must be a string or a real number, not '${tn}'` };
  if (x.t === "str") {
    const s = String(x.v).trim();
    if (!/^[+-]?(\d+\.?\d*|\.\d+)$/.test(s)) return { error: `ValueError: could not convert string to float: '${x.v}'` };
    return { t: "float", v: parseFloat(s) };
  }
  return { t: "float", v: num(x) as number };
}

type Row = { name: string; val: PyVal };

export default function Lab03({ onUse }: { onUse: () => void }) {
  const [vars, setVars] = useState<Row[]>([
    { name: "kullanici", val: { t: "str", v: "ayse" } },
    { name: "deneme", val: { t: "int", v: 3 } },
    { name: "kilitli", val: { t: "bool", v: false } },
  ]);
  const [name, setName] = useState("");
  const [type, setType] = useState<T>("int");
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [aName, setAName] = useState("deneme");
  const [op, setOp] = useState<string>("+");
  const [bName, setBName] = useState("kullanici");
  const [opRes, setOpRes] = useState<{ expr: string; res: PyVal | null; err?: string } | null>(null);

  const [cName, setCName] = useState("kullanici");
  const [cFn, setCFn] = useState("int");
  const [cRes, setCRes] = useState<{ expr: string; res: PyVal | null; err?: string } | null>(null);

  const get = (n: string) => vars.find((r) => r.name === n)?.val;

  const define = () => {
    const nm = name.trim();
    if (!nm) return setMsg({ ok: false, text: "Değişken adı boş olamaz." });
    if (/^\d/.test(nm)) return setMsg({ ok: false, text: `SyntaxError: '${nm}' geçersiz — değişken adı rakamla başlayamaz.` });
    if (!/^[A-Za-z_][A-Za-z0-9_çğıöşüÇĞİÖŞÜ]*$/.test(nm))
      return setMsg({ ok: false, text: `SyntaxError: '${nm}' geçersiz — yalnızca harf, rakam ve alt çizgi kullanılabilir (boşluk ve tire yok).` });
    if (KEYWORDS.has(nm)) return setMsg({ ok: false, text: `SyntaxError: '${nm}' Python'un ayrılmış kelimesidir, değişken adı olamaz.` });
    const p = parse(type, value);
    if ("error" in p) return setMsg({ ok: false, text: p.error });
    const exists = vars.some((r) => r.name === nm);
    setVars(exists ? vars.map((r) => (r.name === nm ? { name: nm, val: p } : r)) : [...vars, { name: nm, val: p }]);
    setMsg({ ok: true, text: `${nm} = ${repr(p)}   # ${exists ? "değer güncellendi" : "yeni değişken"}, tip: ${p.t}` });
    onUse();
  };

  const runOp = () => {
    const a = get(aName);
    const b = get(bName);
    if (!a || !b) return setOpRes({ expr: "", res: null, err: "İki değişken seçin." });
    const expr = `${aName} ${op} ${bName}`;
    const r = operate(a, op, b);
    setOpRes("error" in r ? { expr, res: null, err: r.error } : { expr, res: r });
    onUse();
  };

  const runConv = () => {
    const x = get(cName);
    if (!x) return;
    const expr = `${cFn}(${cName})`;
    const r = convert(x, cFn);
    setCRes("error" in r ? { expr, res: null, err: r.error } : { expr, res: r });
    onUse();
  };

  const names = vars.map((r) => r.name);

  return (
    <div className="space-y-5">
      <p className="text-sm leading-6 text-[#2b4152]">
        Değişken adı, veri tipi ve değer girerek değişken tanımlayın; değerleri değiştirin, farklı tiplerle işlem
        yapın ve tip dönüşümlerinin sonuçlarını (veya hatalarını) anında görün.
      </p>

      <div className="grid gap-3 rounded-xl border border-line bg-white p-4 sm:grid-cols-4">
        <div>
          <Label>Değişken adı</Label>
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="ör. port" />
        </div>
        <div>
          <Label>Veri tipi</Label>
          <select className={inputCls} value={type} onChange={(e) => setType(e.target.value as T)}>
            <option value="str">str (metin)</option>
            <option value="int">int (tam sayı)</option>
            <option value="float">float (ondalıklı)</option>
            <option value="bool">bool (True/False)</option>
            <option value="None">None (boş değer)</option>
          </select>
        </div>
        <div>
          <Label>Değer</Label>
          <input
            className={inputCls}
            value={type === "None" ? "" : value}
            disabled={type === "None"}
            onChange={(e) => setValue(e.target.value)}
            placeholder={type === "bool" ? "True / False" : type === "None" ? "None" : "değer"}
          />
        </div>
        <div className="flex items-end">
          <Btn onClick={define} className="w-full">Tanımla / Güncelle</Btn>
        </div>
        {msg && (
          <p className={`font-mono text-xs sm:col-span-4 ${msg.ok ? "text-ok" : "text-err"}`}>
            {msg.ok ? "✔ " : "✘ "}{msg.text}
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-line">
        <div className="bg-slate-50 px-3 py-2 text-xs font-medium text-muted">Bellekteki değişkenler</div>
        <div className="scroll-thin overflow-x-auto">
          <table className="w-full min-w-[420px] text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="px-3 py-1.5">Ad</th>
                <th className="px-3 py-1.5">Tip</th>
                <th className="px-3 py-1.5">Değer</th>
                <th className="px-3 py-1.5" />
              </tr>
            </thead>
            <tbody>
              {vars.map((r) => (
                <tr key={r.name} className="border-t border-line">
                  <td className="px-3 py-1.5 font-mono text-brand">{r.name}</td>
                  <td className="px-3 py-1.5"><Badge>{r.val.t}</Badge></td>
                  <td className="px-3 py-1.5 font-mono">{repr(r.val)}</td>
                  <td className="px-3 py-1.5 text-right">
                    <button
                      type="button"
                      className="mr-2 text-xs text-brand hover:underline"
                      onClick={() => {
                        setName(r.name);
                        setType(r.val.t);
                        setValue(r.val.t === "str" ? String(r.val.v) : r.val.t === "None" ? "" : repr(r.val));
                      }}
                    >
                      Düzenle
                    </button>
                    <button
                      type="button"
                      className="text-xs text-err hover:underline"
                      onClick={() => setVars(vars.filter((x) => x.name !== r.name))}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
              {vars.length === 0 && (
                <tr><td colSpan={4} className="px-3 py-3 text-muted">Henüz değişken yok.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2 rounded-xl border border-line bg-white p-4">
          <p className="text-sm font-semibold">İşlem laboratuvarı</p>
          <div className="grid grid-cols-3 gap-2">
            <select className={inputCls} value={aName} onChange={(e) => setAName(e.target.value)}>
              {names.map((n) => <option key={n}>{n}</option>)}
            </select>
            <select className={inputCls} value={op} onChange={(e) => setOp(e.target.value)}>
              {OPS.map((o) => <option key={o}>{o}</option>)}
            </select>
            <select className={inputCls} value={bName} onChange={(e) => setBName(e.target.value)}>
              {names.map((n) => <option key={n}>{n}</option>)}
            </select>
          </div>
          <Btn onClick={runOp} disabled={names.length === 0}>Hesapla</Btn>
          {opRes && (
            <div className="rounded-lg bg-[#172b3a] p-3 font-mono text-xs text-slate-100">
              <p className="text-slate-400">&gt;&gt;&gt; {opRes.expr}</p>
              {opRes.err ? (
                <p className="mt-1 text-[#f2a1a1]">{opRes.err}</p>
              ) : (
                opRes.res && <p className="mt-1">{repr(opRes.res)}  <span className="text-slate-400"># {opRes.res.t}</span></p>
              )}
            </div>
          )}
        </div>
        <div className="space-y-2 rounded-xl border border-line bg-white p-4">
          <p className="text-sm font-semibold">Tip dönüşümü (type casting)</p>
          <div className="grid grid-cols-2 gap-2">
            <select className={inputCls} value={cFn} onChange={(e) => setCFn(e.target.value)}>
              {["int", "float", "str", "bool"].map((f) => <option key={f}>{f}</option>)}
            </select>
            <select className={inputCls} value={cName} onChange={(e) => setCName(e.target.value)}>
              {names.map((n) => <option key={n}>{n}</option>)}
            </select>
          </div>
          <Btn onClick={runConv} disabled={names.length === 0}>Dönüştür</Btn>
          {cRes && (
            <div className="rounded-lg bg-[#172b3a] p-3 font-mono text-xs text-slate-100">
              <p className="text-slate-400">&gt;&gt;&gt; {cRes.expr}</p>
              {cRes.err ? (
                <p className="mt-1 text-[#f2a1a1]">{cRes.err}</p>
              ) : (
                cRes.res && <p className="mt-1">{repr(cRes.res)}  <span className="text-slate-400"># {cRes.res.t}</span></p>
              )}
            </div>
          )}
        </div>
      </div>
      <LabNote>
        Denemeler: <code>deneme + kullanici</code> (TypeError), <code>kullanici * deneme</code> (metin tekrarı),{" "}
        <code>int(kullanici)</code> (ValueError), <code>bool(kilitli)</code>. Bu laboratuvar Python&apos;un davranışını
        taklit eden bir eğitim simülatörüdür.
      </LabNote>
    </div>
  );
}
