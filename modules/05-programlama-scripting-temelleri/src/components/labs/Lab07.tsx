"use client";

import { useState } from "react";
import { Btn, inputCls, Label, LabNote } from "../ui";

/** Girilen metni Python değişmezi (literal) gösterimine çevirir. */
function lit(raw: string): string {
  const s = raw.trim();
  if (/^-?\d+$/.test(s)) return String(parseInt(s, 10));
  if (/^-?\d*\.\d+$/.test(s) || /^-?\d+\.\d*$/.test(s)) {
    const n = parseFloat(s);
    return Number.isInteger(n) ? n.toFixed(1) : String(n);
  }
  if (s === "True" || s === "False" || s === "None") return s;
  const m = s.match(/^(['"])(.*)\1$/);
  const inner = m ? m[2] : s;
  return "'" + inner.replace(/'/g, "\\'") + "'";
}

const isNum = (r: string) => /^-?\d+(\.\d+)?$/.test(r);
const showList = (a: string[]) => "[" + a.join(", ") + "]";
type Log = { code: string; res: string; err?: boolean } | null;

function Out({ log }: { log: Log }) {
  if (!log) return <p className="text-xs text-muted">Bir işlem yapın; Python karşılığı ve sonucu burada görünür.</p>;
  return (
    <div className="rounded-lg bg-[#172b3a] p-3 font-mono text-xs text-slate-100">
      <p className="text-slate-400">&gt;&gt;&gt; {log.code}</p>
      <p className={`mt-1 whitespace-pre-wrap ${log.err ? "text-[#f2a1a1]" : ""}`}>{log.res}</p>
    </div>
  );
}

function ListTab({ onUse }: { onUse: () => void }) {
  const [items, setItems] = useState<string[]>(["22", "80", "443"]);
  const [val, setVal] = useState("8080");
  const [idx, setIdx] = useState("1");
  const [log, setLog] = useState<Log>(null);
  const i = parseInt(idx, 10);
  const idxOk = Number.isFinite(i);

  const done = (l: Log, next?: string[]) => {
    if (next) setItems(next);
    setLog(l);
    onUse();
  };
  const norm = (k: number) => (k < 0 ? k + items.length : k);

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-line bg-white p-3 font-mono text-sm">portlar = {showList(items)}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((it, k) => (
          <div key={k} className="rounded-lg border border-line bg-white px-3 py-1.5 text-center">
            <div className="font-mono text-sm">{it}</div>
            <div className="text-[10px] text-muted">[{k}] · [{k - items.length}]</div>
          </div>
        ))}
        {items.length === 0 && <span className="text-sm text-muted">Liste boş: []</span>}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>Değer</Label><input className={inputCls} value={val} onChange={(e) => setVal(e.target.value)} /></div>
        <div><Label>İndeks</Label><input className={inputCls} value={idx} onChange={(e) => setIdx(e.target.value)} /></div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Btn onClick={() => done({ code: `portlar.append(${lit(val)})`, res: "None  # liste güncellendi" }, [...items, lit(val)])}>append</Btn>
        <Btn disabled={!idxOk} onClick={() => {
          const k = Math.max(0, Math.min(items.length, i < 0 ? i + items.length : i));
          const n = [...items]; n.splice(k, 0, lit(val));
          done({ code: `portlar.insert(${i}, ${lit(val)})`, res: "None  # liste güncellendi" }, n);
        }}>insert</Btn>
        <Btn variant="secondary" onClick={() => {
          const k = items.indexOf(lit(val));
          if (k < 0) return done({ code: `portlar.remove(${lit(val)})`, res: "ValueError: list.remove(x): x not in list", err: true });
          done({ code: `portlar.remove(${lit(val)})`, res: "None  # ilk eşleşme silindi" }, items.filter((_, q) => q !== k));
        }}>remove(değer)</Btn>
        <Btn variant="secondary" disabled={!idxOk} onClick={() => {
          const k = norm(i);
          if (k < 0 || k >= items.length) return done({ code: `portlar.pop(${i})`, res: "IndexError: pop index out of range", err: true });
          done({ code: `portlar.pop(${i})`, res: items[k] }, items.filter((_, q) => q !== k));
        }}>pop(indeks)</Btn>
        <Btn variant="secondary" disabled={!idxOk} onClick={() => {
          const k = norm(i);
          if (k < 0 || k >= items.length) return done({ code: `portlar[${i}] = ${lit(val)}`, res: "IndexError: list assignment index out of range", err: true });
          done({ code: `portlar[${i}] = ${lit(val)}`, res: "# eleman güncellendi" }, items.map((x, q) => (q === k ? lit(val) : x)));
        }}>düzenle [indeks]</Btn>
        <Btn variant="secondary" disabled={!idxOk} onClick={() => {
          const k = norm(i);
          if (k < 0 || k >= items.length) return done({ code: `portlar[${i}]`, res: "IndexError: list index out of range", err: true });
          done({ code: `portlar[${i}]`, res: items[k] });
        }}>oku [indeks]</Btn>
        <Btn variant="secondary" onClick={() => {
          const k = items.indexOf(lit(val));
          done({ code: `${lit(val)} in portlar`, res: `${k >= 0}`.replace("true", "True").replace("false", "False") + (k >= 0 ? `   # portlar.index(${lit(val)}) → ${k}` : "") });
        }}>ara (in)</Btn>
        <Btn variant="secondary" onClick={() => {
          const sorted = [...items].sort((a, b) => (isNum(a) && isNum(b) ? parseFloat(a) - parseFloat(b) : a.localeCompare(b)));
          done({ code: "portlar.sort()", res: "None  # sıralandı" }, sorted);
        }}>sort</Btn>
        <Btn variant="ghost" onClick={() => { setItems(["22", "80", "443"]); setLog(null); }}>Sıfırla</Btn>
      </div>
      <Out log={log} />
    </div>
  );
}

function DictTab({ onUse }: { onUse: () => void }) {
  const [d, setD] = useState<[string, string][]>([["'ad'", "'Ayşe'"], ["'ip'", "'10.0.0.5'"], ["'rol'", "'analist'"]]);
  const [k, setK] = useState("rol");
  const [v, setV] = useState("yönetici");
  const [log, setLog] = useState<Log>(null);
  const key = lit(k);
  const show = "{" + d.map(([a, b]) => `${a}: ${b}`).join(", ") + "}";
  const done = (l: Log, next?: [string, string][]) => {
    if (next) setD(next);
    setLog(l);
    onUse();
  };
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-line bg-white p-3 font-mono text-sm break-all">sunucu = {show}</div>
      <div className="overflow-hidden rounded-lg border border-line">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs text-muted"><tr><th className="px-3 py-1.5">Anahtar (key)</th><th className="px-3 py-1.5">Değer (value)</th></tr></thead>
          <tbody>
            {d.map(([a, b]) => (
              <tr key={a} className="border-t border-line"><td className="px-3 py-1.5 font-mono text-brand">{a}</td><td className="px-3 py-1.5 font-mono">{b}</td></tr>
            ))}
            {d.length === 0 && <tr><td colSpan={2} className="px-3 py-2 text-muted">Sözlük boş: {"{}"}</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>Anahtar</Label><input className={inputCls} value={k} onChange={(e) => setK(e.target.value)} /></div>
        <div><Label>Değer</Label><input className={inputCls} value={v} onChange={(e) => setV(e.target.value)} /></div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Btn onClick={() => {
          const exists = d.some(([a]) => a === key);
          const next: [string, string][] = exists ? d.map(([a, b]) => (a === key ? [a, lit(v)] : [a, b])) : [...d, [key, lit(v)]];
          done({ code: `sunucu[${key}] = ${lit(v)}`, res: exists ? "# var olan anahtarın değeri güncellendi" : "# yeni anahtar-değer çifti eklendi" }, next);
        }}>Ekle / güncelle</Btn>
        <Btn variant="secondary" onClick={() => {
          const f = d.find(([a]) => a === key);
          done(f ? { code: `sunucu[${key}]`, res: f[1] } : { code: `sunucu[${key}]`, res: `KeyError: ${key}`, err: true });
        }}>oku [anahtar]</Btn>
        <Btn variant="secondary" onClick={() => {
          const f = d.find(([a]) => a === key);
          done({ code: `sunucu.get(${key}, 'yok')`, res: f ? f[1] : "'yok'  # KeyError oluşmadı, varsayılan döndü" });
        }}>get()</Btn>
        <Btn variant="secondary" onClick={() => {
          const has = d.some(([a]) => a === key);
          done({ code: `${key} in sunucu`, res: has ? "True" : "False" });
        }}>ara (in)</Btn>
        <Btn variant="secondary" onClick={() => {
          if (!d.some(([a]) => a === key)) return done({ code: `del sunucu[${key}]`, res: `KeyError: ${key}`, err: true });
          done({ code: `del sunucu[${key}]`, res: "# silindi" }, d.filter(([a]) => a !== key));
        }}>sil (del)</Btn>
        <Btn variant="secondary" onClick={() => done({ code: "list(sunucu.keys())", res: showList(d.map(([a]) => a)) + "\n" + "list(sunucu.values()) → " + showList(d.map(([, b]) => b)) })}>keys / values</Btn>
        <Btn variant="ghost" onClick={() => { setD([["'ad'", "'Ayşe'"], ["'ip'", "'10.0.0.5'"], ["'rol'", "'analist'"]]); setLog(null); }}>Sıfırla</Btn>
      </div>
      <Out log={log} />
    </div>
  );
}

function SetTab({ onUse }: { onUse: () => void }) {
  const [items, setItems] = useState<string[]>(["22", "80", "443"]);
  const [val, setVal] = useState("443");
  const [log, setLog] = useState<Log>(null);
  const B = ["22", "443", "3389"];
  const v = lit(val);
  const show = (a: string[]) => (a.length ? "{" + a.join(", ") + "}" : "set()");
  const done = (l: Log, next?: string[]) => {
    if (next) setItems(next);
    setLog(l);
    onUse();
  };
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-line bg-white p-3 font-mono text-sm">A = {show(items)} &nbsp; <span className="text-muted">B = {show(B)}</span></div>
      <div><Label>Değer</Label><input className={inputCls} value={val} onChange={(e) => setVal(e.target.value)} /></div>
      <div className="flex flex-wrap gap-2">
        <Btn onClick={() => {
          const has = items.includes(v);
          done({ code: `A.add(${v})`, res: has ? "# eleman zaten var: set yinelenen değeri eklemez, küme değişmedi" : "# eklendi" }, has ? items : [...items, v]);
        }}>add</Btn>
        <Btn variant="secondary" onClick={() => {
          done({ code: `A.discard(${v})`, res: "# varsa silinir, yoksa hata vermez" }, items.filter((x) => x !== v));
        }}>discard</Btn>
        <Btn variant="secondary" onClick={() => {
          if (!items.includes(v)) return done({ code: `A.remove(${v})`, res: `KeyError: ${v}`, err: true });
          done({ code: `A.remove(${v})`, res: "# silindi" }, items.filter((x) => x !== v));
        }}>remove</Btn>
        <Btn variant="secondary" onClick={() => done({ code: `${v} in A`, res: items.includes(v) ? "True" : "False" })}>ara (in)</Btn>
        <Btn variant="secondary" onClick={() => done({
          code: "A | B   # birleşim\nA & B   # kesişim\nA - B   # fark",
          res: `${show([...new Set([...items, ...B])])}\n${show(items.filter((x) => B.includes(x)))}\n${show(items.filter((x) => !B.includes(x)))}`,
        })}>Küme işlemleri</Btn>
        <Btn variant="ghost" onClick={() => { setItems(["22", "80", "443"]); setLog(null); }}>Sıfırla</Btn>
      </div>
      <Out log={log} />
    </div>
  );
}

function TupleTab({ onUse }: { onUse: () => void }) {
  const [t, setT] = useState<string[]>(["'10.0.0.5'", "22", "'ssh'"]);
  const [idx, setIdx] = useState("0");
  const [val, setVal] = useState("2222");
  const [log, setLog] = useState<Log>(null);
  const i = parseInt(idx, 10);
  const show = "(" + t.join(", ") + (t.length === 1 ? "," : "") + ")";
  const done = (l: Log, next?: string[]) => {
    if (next) setT(next);
    setLog(l);
    onUse();
  };
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-line bg-white p-3 font-mono text-sm">hedef = {show}</div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>İndeks</Label><input className={inputCls} value={idx} onChange={(e) => setIdx(e.target.value)} /></div>
        <div><Label>Değer</Label><input className={inputCls} value={val} onChange={(e) => setVal(e.target.value)} /></div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Btn variant="secondary" onClick={() => {
          const k = i < 0 ? i + t.length : i;
          done(k >= 0 && k < t.length ? { code: `hedef[${i}]`, res: t[k] } : { code: `hedef[${i}]`, res: "IndexError: tuple index out of range", err: true });
        }}>oku [indeks]</Btn>
        <Btn variant="danger" onClick={() => done({ code: `hedef[${i}] = ${lit(val)}`, res: "TypeError: 'tuple' object does not support item assignment", err: true })}>Elemanı değiştirmeyi dene</Btn>
        <Btn onClick={() => done({ code: `hedef = hedef + (${lit(val)},)`, res: "# yeni bir tuple oluşturuldu (eskisi değiştirilmedi)" }, [...t, lit(val)])}>Yeni tuple oluştur (+)</Btn>
        <Btn variant="ghost" onClick={() => { setT(["'10.0.0.5'", "22", "'ssh'"]); setLog(null); }}>Sıfırla</Btn>
      </div>
      <Out log={log} />
    </div>
  );
}

export default function Lab07({ onUse }: { onUse: () => void }) {
  const [tab, setTab] = useState<"list" | "dict" | "set" | "tuple">("list");
  const tabs = [
    ["list", "Liste (list)"],
    ["dict", "Sözlük (dict)"],
    ["set", "Küme (set)"],
    ["tuple", "Tuple"],
  ] as const;
  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-[#2b4152]">
        Veri yapılarını oluşturun, eleman ekleyin, silin, düzenleyin ve arayın. Her işlemin Python karşılığı ve
        sonucu (hatalar dahil) altta görünür. Değerler için <code>22</code>, <code>3.5</code>, <code>True</code>,{" "}
        <code>None</code> veya metin yazabilirsiniz.
      </p>
      <div className="flex flex-wrap gap-2">
        {tabs.map(([id, label]) => (
          <Btn key={id} variant={tab === id ? "primary" : "secondary"} onClick={() => setTab(id)}>{label}</Btn>
        ))}
      </div>
      {tab === "list" && <ListTab onUse={onUse} />}
      {tab === "dict" && <DictTab onUse={onUse} />}
      {tab === "set" && <SetTab onUse={onUse} />}
      {tab === "tuple" && <TupleTab onUse={onUse} />}
      <LabNote>Denemeler: olmayan bir indekse erişin (IndexError), olmayan anahtarı okuyun (KeyError), aynı değeri set&apos;e iki kez ekleyin.</LabNote>
    </div>
  );
}
