"use client";

import { useState, type ReactNode } from "react";
import { Badge, Btn, CodeBlock, LabNote } from "../ui";

const SAMPLE_JSON = `{
  "kullanici": "ayse",
  "aktif": true,
  "portlar": [22, 80, 443],
  "profil": { "rol": "analist", "son_giris": null }
}`;
const BAD_JSON = `{
  "kullanici": "ayse",
  "portlar": [22, 80, 443,],
  'rol': "analist"
}`;
const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<kayit>
  <kullanici id="1">ayse</kullanici>
  <aktif>true</aktif>
  <portlar>
    <port>22</port>
    <port>80</port>
    <port>443</port>
  </portlar>
</kayit>`;
const BAD_XML = `<kayit>
  <kullanici>ayse</kullanici>
  <portlar>
    <port>22</port>
  </kayit>`;

const XXE_SAFE_SAMPLE = `<?xml version="1.0"?>
<istek>
  <mesaj>Merhaba AG CYBER LAB</mesaj>
</istek>`;
const XXE_EVIL_SAMPLE = `<?xml version="1.0"?>
<!DOCTYPE istek [
  <!ENTITY dosya SYSTEM "file:///etc/gizli.conf">
]>
<istek>
  <mesaj>&dosya;</mesaj>
</istek>`;

/* ---------- JSON yardımcıları ---------- */
type JErr = { msg: string; line?: number; col?: number };
function parseJson(text: string): { ok: true; value: unknown } | { ok: false; err: JErr } {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const m = msg.match(/position (\d+)/);
    let line: number | undefined;
    let col: number | undefined;
    if (m) {
      const pos = parseInt(m[1], 10);
      const before = text.slice(0, pos).split("\n");
      line = before.length;
      col = before[before.length - 1].length + 1;
    } else {
      const lc = msg.match(/line (\d+) column (\d+)/);
      if (lc) {
        line = parseInt(lc[1], 10);
        col = parseInt(lc[2], 10);
      }
    }
    return { ok: false, err: { msg, line, col } };
  }
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const safeTag = (s: string) => (/^[A-Za-z_][\w.-]*$/.test(s) ? s : "oge");

function toXml(v: unknown, tag: string, ind: string): string {
  const t = safeTag(tag);
  if (Array.isArray(v)) return v.map((x) => toXml(x, t === "portlar" ? "port" : "oge", ind)).join("\n") || `${ind}<${t}/>`;
  if (v !== null && typeof v === "object") {
    const inner = Object.entries(v as Record<string, unknown>)
      .map(([k, val]) => {
        if (Array.isArray(val)) {
          const itemTag = safeTag(k.endsWith("lar") || k.endsWith("ler") ? k.slice(0, -3) : "oge");
          return `${ind}  <${safeTag(k)}>\n${val.map((x) => toXml(x, itemTag, ind + "    ")).join("\n")}\n${ind}  </${safeTag(k)}>`;
        }
        return toXml(val, k, ind + "  ");
      })
      .join("\n");
    return `${ind}<${t}>\n${inner}\n${ind}</${t}>`;
  }
  return `${ind}<${t}>${v === null ? "" : esc(String(v))}</${t}>`;
}

/* ---------- XML yardımcıları ---------- */
function parseXml(text: string): { ok: true; doc: Document } | { ok: false; msg: string } {
  if (typeof DOMParser === "undefined") return { ok: false, msg: "Tarayıcı XML ayrıştırıcısı bulunamadı." };
  if (!text.trim()) return { ok: false, msg: "XML boş." };
  const doc = new DOMParser().parseFromString(text, "application/xml");
  const pe = doc.getElementsByTagName("parsererror")[0];
  if (pe) {
    const raw = (pe.textContent ?? "XML hatası").split("\n").filter((l) => l.trim()).slice(0, 3).join(" — ");
    return { ok: false, msg: raw };
  }
  return { ok: true, doc };
}

function prettyXml(el: Element, ind = ""): string {
  const attrs = Array.from(el.attributes).map((a) => ` ${a.name}="${a.value}"`).join("");
  const kids = Array.from(el.children);
  if (kids.length === 0) {
    const t = (el.textContent ?? "").trim();
    return t ? `${ind}<${el.tagName}${attrs}>${esc(t)}</${el.tagName}>` : `${ind}<${el.tagName}${attrs} />`;
  }
  return `${ind}<${el.tagName}${attrs}>\n${kids.map((k) => prettyXml(k, ind + "  ")).join("\n")}\n${ind}</${el.tagName}>`;
}

function xmlToObj(el: Element): unknown {
  const obj: Record<string, unknown> = {};
  for (const a of Array.from(el.attributes)) obj["@" + a.name] = a.value;
  const kids = Array.from(el.children);
  if (kids.length === 0) {
    const t = (el.textContent ?? "").trim();
    if (Object.keys(obj).length === 0) return t === "true" ? true : t === "false" ? false : t !== "" && !Number.isNaN(Number(t)) ? Number(t) : t;
    if (t) obj["#text"] = t;
    return obj;
  }
  for (const k of kids) {
    const v = xmlToObj(k);
    if (k.tagName in obj) {
      const cur = obj[k.tagName];
      obj[k.tagName] = Array.isArray(cur) ? [...cur, v] : [cur, v];
    } else obj[k.tagName] = v;
  }
  return obj;
}

/* ---------- Ağaç görünümü ---------- */
function typeTone(v: unknown): string {
  if (v === null) return "text-muted";
  if (typeof v === "string") return "text-ok";
  if (typeof v === "number") return "text-brand";
  if (typeof v === "boolean") return "text-[#9a6b14]";
  return "";
}

function JNode({ k, v, open }: { k: string; v: unknown; open?: boolean }) {
  if (v !== null && typeof v === "object") {
    const entries = Array.isArray(v) ? v.map((x, i) => [String(i), x] as const) : Object.entries(v as Record<string, unknown>);
    return (
      <details open={open ?? true} className="ml-3 border-l border-line pl-3">
        <summary className="cursor-pointer select-none py-0.5 text-sm">
          <span className="font-mono text-brand">{k}</span>{" "}
          <Badge tone="muted">{Array.isArray(v) ? `dizi [${entries.length}]` : `nesne {${entries.length}}`}</Badge>
        </summary>
        {entries.map(([ck, cv]) => (
          <JNode key={ck} k={ck} v={cv} />
        ))}
      </details>
    );
  }
  return (
    <div className="ml-3 border-l border-line py-0.5 pl-3 text-sm">
      <span className="font-mono text-brand">{k}</span>: <span className={`font-mono ${typeTone(v)}`}>{JSON.stringify(v)}</span>{" "}
      <span className="text-[10px] text-muted">{v === null ? "null" : typeof v}</span>
    </div>
  );
}

function XNode({ el }: { el: Element }) {
  const kids = Array.from(el.children);
  const attrs = Array.from(el.attributes);
  const head: ReactNode = (
    <>
      <span className="font-mono text-brand">&lt;{el.tagName}&gt;</span>
      {attrs.map((a) => (
        <span key={a.name} className="ml-2 font-mono text-xs text-[#9a6b14]">{a.name}=&quot;{a.value}&quot;</span>
      ))}
    </>
  );
  if (kids.length === 0)
    return (
      <div className="ml-3 border-l border-line py-0.5 pl-3 text-sm">
        {head} <span className="font-mono text-ok">{(el.textContent ?? "").trim() || "∅"}</span>
      </div>
    );
  return (
    <details open className="ml-3 border-l border-line pl-3">
      <summary className="cursor-pointer select-none py-0.5 text-sm">{head} <Badge tone="muted">{kids.length} alt eleman</Badge></summary>
      {kids.map((k, i) => (
        <XNode key={i} el={k} />
      ))}
    </details>
  );
}

function Result({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <div className={`rounded-lg border p-3 text-sm ${ok ? "border-ok/40 bg-[#e3f3ec] text-[#1b5f42]" : "border-err/40 bg-[#f8e5e5] text-[#8e3a3a]"}`}>{children}</div>
  );
}

const ta = "scroll-thin h-56 w-full rounded-lg border border-line bg-[#fbfdfe] p-3 font-mono text-[13px] leading-5 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function Lab13({ onUse }: { onUse: () => void }) {
  const [tab, setTab] = useState<"json" | "xml" | "cmp" | "xxe">("json");
  const [json, setJson] = useState(SAMPLE_JSON);
  const [xml, setXml] = useState(SAMPLE_XML);
  const [jRes, setJRes] = useState<ReactNode>(null);
  const [jTree, setJTree] = useState<unknown>(undefined);
  const [xRes, setXRes] = useState<ReactNode>(null);
  const [xTree, setXTree] = useState<Element | null>(null);

  const [xxe, setXxe] = useState(XXE_EVIL_SAMPLE);
  const [parserSafe, setParserSafe] = useState(false);
  const [xxeOut, setXxeOut] = useState<null | { safe: boolean; lines: string[]; blocked: boolean }>(null);

  const jValidate = (showTree = false, mode: "validate" | "format" | "min" = "validate") => {
    const r = parseJson(json);
    onUse();
    if (!r.ok) {
      setJTree(undefined);
      setJRes(
        <Result ok={false}>
          <p className="font-semibold">✘ Geçersiz JSON</p>
          <p className="mt-1 font-mono text-xs">{r.err.msg}</p>
          {r.err.line && <p className="mt-1">Konum: satır {r.err.line}, sütun {r.err.col}</p>}
          <p className="mt-1 text-xs">İpucu: Son elemandan sonra virgül, tek tırnak, tırnaksız anahtar ve eksik parantezler en sık hatalardır.</p>
        </Result>,
      );
      return;
    }
    if (mode === "format") setJson(JSON.stringify(r.value, null, 2));
    if (mode === "min") setJson(JSON.stringify(r.value));
    setJTree(showTree ? r.value : undefined);
    const t = Array.isArray(r.value) ? "dizi" : r.value === null ? "null" : typeof r.value === "object" ? "nesne" : typeof r.value;
    setJRes(
      <Result ok>
        <p className="font-semibold">✔ {mode === "format" ? "Biçimlendirildi" : mode === "min" ? "Küçültüldü" : "Geçerli JSON"}</p>
        <p className="mt-1">Kök tip: {t} · Karakter sayısı: {JSON.stringify(r.value).length}</p>
      </Result>,
    );
  };

  const xValidate = (showTree = false, format = false) => {
    const r = parseXml(xml);
    onUse();
    const dtd = /<!DOCTYPE|<!ENTITY/i.test(xml);
    if (!r.ok) {
      setXTree(null);
      setXRes(
        <Result ok={false}>
          <p className="font-semibold">✘ Geçersiz (well-formed olmayan) XML</p>
          <p className="mt-1 font-mono text-xs">{r.msg}</p>
          <p className="mt-1 text-xs">İpucu: Her açılan etiket kapanmalı, etiketler doğru iç içe geçmeli, tek bir kök eleman olmalı.</p>
        </Result>,
      );
      return;
    }
    const root = r.doc.documentElement;
    if (format) {
      const decl = xml.match(/^\s*<\?xml[^>]*\?>/)?.[0];
      setXml((decl ? decl + "\n" : "") + prettyXml(root));
    }
    setXTree(showTree ? root : null);
    setXRes(
      <Result ok>
        <p className="font-semibold">✔ {format ? "Biçimlendirildi" : "Geçerli XML"} (well-formed)</p>
        <p className="mt-1">Kök eleman: &lt;{root.tagName}&gt; · Toplam eleman: {r.doc.getElementsByTagName("*").length}</p>
        {dtd && <p className="mt-1 font-semibold text-[#9a6b14]">⚠ DOCTYPE/ENTITY bildirimi bulundu: bu tür XML güvensiz ayrıştırıcılarda XXE riski taşır.</p>}
      </Result>,
    );
  };

  const runXxe = () => {
    onUse();
    const ents = Array.from(xxe.matchAll(/<!ENTITY\s+(\w+)\s+SYSTEM\s+"([^"]+)"\s*>/g)).map((m) => ({ name: m[1], uri: m[2] }));
    const hasDtd = /<!DOCTYPE/i.test(xxe);
    if (parserSafe && hasDtd) {
      setXxeOut({ safe: true, blocked: true, lines: ["XML Ayrıştırma Hatası: DOCTYPE bildirimi izin verilmiyor (DTD işleme kapalı).", "Harici varlık çözümlenmedi; hiçbir kaynağa erişilmedi."] });
      return;
    }
    const msg = xxe.match(/<mesaj>([\s\S]*?)<\/mesaj>/)?.[1]?.trim() ?? "";
    let result = msg;
    const notes: string[] = [];
    for (const e of ents) {
      let data = "[SANAL: kaynak bulunamadı]";
      if (e.uri.startsWith("file://")) data = e.uri.includes("gizli.conf") ? "[SANAL ÖRNEK VERİ] veritabani_parola=ornek-parola-123" : "[SANAL: örnek dosya içeriği — gerçek dosya okunmadı]";
      else if (/^https?:\/\//.test(e.uri)) data = "[SANAL: iç ağ isteği simüle edildi — gerçek istek yapılmadı]";
      result = result.split(`&${e.name};`).join(data);
      notes.push(`Varlık &${e.name}; → ${e.uri} (simüle edildi)`);
    }
    const lines = [`Ayrıştırıcı çıktısı <mesaj>: ${result || "(boş)"}`, ...notes];
    if (ents.length) lines.push(parserSafe ? "" : "⚠ Güvensiz ayrıştırıcı harici varlığı çözdü: hassas veri yanıta sızdı (simülasyon).");
    setXxeOut({ safe: parserSafe, blocked: false, lines: lines.filter(Boolean) });
  };

  /* karşılaştırma */
  const jr = parseJson(json);
  const xr = parseXml(xml);
  const jsonAsXml = jr.ok ? `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(jr.value, "kok", "")}` : null;
  const xmlAsJson = xr.ok ? JSON.stringify({ [xr.doc.documentElement.tagName]: xmlToObj(xr.doc.documentElement) }, null, 2) : null;

  const tabs = [
    ["json", "JSON editörü"],
    ["xml", "XML editörü"],
    ["cmp", "JSON ↔ XML karşılaştırma"],
    ["xxe", "XXE güvenlik senaryosu"],
  ] as const;

  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-[#2b4152]">
        JSON ve XML verilerini girin; <strong>doğrulayın, biçimlendirin, ağaç görünümünde inceleyin</strong> ve karşılaştırın.
        Tüm işlemler tarayıcıda yapılır; hiçbir veri dışarı gönderilmez.
      </p>
      <div className="flex flex-wrap gap-2">
        {tabs.map(([id, l]) => (
          <Btn key={id} variant={tab === id ? "primary" : "secondary"} onClick={() => setTab(id)}>{l}</Btn>
        ))}
      </div>

      {tab === "json" && (
        <div className="space-y-3">
          <textarea className={ta} value={json} spellCheck={false} onChange={(e) => { setJson(e.target.value); setJRes(null); setJTree(undefined); }} aria-label="JSON girdisi" />
          <div className="flex flex-wrap gap-2">
            <Btn onClick={() => jValidate(false)}>Doğrula</Btn>
            <Btn variant="secondary" onClick={() => jValidate(false, "format")}>Biçimlendir</Btn>
            <Btn variant="secondary" onClick={() => jValidate(false, "min")}>Küçült</Btn>
            <Btn variant="secondary" onClick={() => jValidate(true)}>Ağaç görünümü</Btn>
            <Btn variant="ghost" onClick={() => { setJson(SAMPLE_JSON); setJRes(null); setJTree(undefined); }}>Geçerli örnek</Btn>
            <Btn variant="ghost" onClick={() => { setJson(BAD_JSON); setJRes(null); setJTree(undefined); }}>Hatalı örnek</Btn>
          </div>
          {jRes}
          {jTree !== undefined && (
            <div className="rounded-lg border border-line bg-white p-3">
              <p className="mb-1 text-xs font-medium text-muted">JSON ağaç görünümü</p>
              <JNode k="kök" v={jTree} />
            </div>
          )}
        </div>
      )}

      {tab === "xml" && (
        <div className="space-y-3">
          <textarea className={ta} value={xml} spellCheck={false} onChange={(e) => { setXml(e.target.value); setXRes(null); setXTree(null); }} aria-label="XML girdisi" />
          <div className="flex flex-wrap gap-2">
            <Btn onClick={() => xValidate(false)}>Doğrula</Btn>
            <Btn variant="secondary" onClick={() => xValidate(false, true)}>Biçimlendir</Btn>
            <Btn variant="secondary" onClick={() => xValidate(true)}>Ağaç görünümü</Btn>
            <Btn variant="ghost" onClick={() => { setXml(SAMPLE_XML); setXRes(null); setXTree(null); }}>Geçerli örnek</Btn>
            <Btn variant="ghost" onClick={() => { setXml(BAD_XML); setXRes(null); setXTree(null); }}>Hatalı örnek</Btn>
          </div>
          {xRes}
          {xTree && (
            <div className="rounded-lg border border-line bg-white p-3">
              <p className="mb-1 text-xs font-medium text-muted">XML ağaç görünümü</p>
              <XNode el={xTree} />
            </div>
          )}
        </div>
      )}

      {tab === "cmp" && (
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <p className="mb-1 text-sm font-semibold">JSON editörünüzdeki veri → XML</p>
              {jsonAsXml ? <CodeBlock code={jsonAsXml} title="donusum.xml" /> : <Result ok={false}>JSON sekmesindeki veri geçersiz olduğu için dönüştürülemedi.</Result>}
            </div>
            <div>
              <p className="mb-1 text-sm font-semibold">XML editörünüzdeki veri → JSON</p>
              {xmlAsJson ? <CodeBlock code={xmlAsJson} title="donusum.json" /> : <Result ok={false}>XML sekmesindeki veri geçersiz olduğu için dönüştürülemedi.</Result>}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-line bg-white p-3 text-sm">
              <p className="font-semibold">Boyut karşılaştırması</p>
              <p className="mt-1">JSON (küçültülmüş): <strong>{jr.ok ? JSON.stringify(jr.value).length : "—"}</strong> karakter</p>
              <p>Aynı veri XML olarak: <strong>{jsonAsXml ? jsonAsXml.replace(/\n\s*/g, "").length : "—"}</strong> karakter</p>
              <p className="mt-1 text-xs text-muted">XML genellikle açılış/kapanış etiketleri yüzünden daha uzundur.</p>
            </div>
            <div className="overflow-hidden rounded-lg border border-line bg-white text-sm">
              <table className="w-full">
                <thead className="bg-slate-50 text-left text-xs text-muted"><tr><th className="px-3 py-1.5">Özellik</th><th className="px-3 py-1.5">JSON</th><th className="px-3 py-1.5">XML</th></tr></thead>
                <tbody>
                  {[
                    ["Dizi/liste", "Doğal ([ ])", "Tekrarlı etiket"],
                    ["Veri tipleri", "string, number, bool, null", "Hepsi metin"],
                    ["Yorum satırı", "Yok", "Var (<!-- -->)"],
                    ["Öznitelik", "Yok", "Var"],
                    ["XXE riski", "Yok", "Yapılandırmaya bağlı"],
                  ].map((r) => (
                    <tr key={r[0]} className="border-t border-line"><td className="px-3 py-1.5 font-medium">{r[0]}</td><td className="px-3 py-1.5">{r[1]}</td><td className="px-3 py-1.5">{r[2]}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "xxe" && (
        <div className="space-y-3">
          <div className="rounded-lg border border-warn/40 bg-[#faf0dc] px-3 py-2 text-xs leading-5 text-[#7a5410]">
            <strong>Güvenli eğitim simülasyonu:</strong> Burada gerçek dosya okunmaz ve ağ isteği yapılmaz. “Harici
            varlık” çözümü yalnızca önceden tanımlanmış <em>sahte örnek verilerle</em> simüle edilir.
          </div>
          <div className="flex flex-wrap gap-2">
            <Btn variant="secondary" onClick={() => { setXxe(XXE_SAFE_SAMPLE); setXxeOut(null); }}>Zararsız XML</Btn>
            <Btn variant="secondary" onClick={() => { setXxe(XXE_EVIL_SAMPLE); setXxeOut(null); }}>XXE içeren XML</Btn>
          </div>
          <textarea className={ta} value={xxe} spellCheck={false} onChange={(e) => { setXxe(e.target.value); setXxeOut(null); }} aria-label="XXE örnek XML" />
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-lg border border-line p-0.5 text-sm">
              <button type="button" onClick={() => setParserSafe(false)} className={`rounded-md px-3 py-1.5 ${!parserSafe ? "bg-err text-white" : ""}`}>Güvensiz ayrıştırıcı</button>
              <button type="button" onClick={() => setParserSafe(true)} className={`rounded-md px-3 py-1.5 ${parserSafe ? "bg-ok text-white" : ""}`}>Güvenli (DTD kapalı)</button>
            </div>
            <Btn onClick={runXxe}>Ayrıştır (simülasyon)</Btn>
          </div>
          {xxeOut && (
            <Result ok={xxeOut.blocked || xxeOut.safe}>
              {xxeOut.lines.map((l, i) => (
                <p key={i} className={i === 0 ? "font-semibold" : "mt-1"}>{l}</p>
              ))}
            </Result>
          )}
          <CodeBlock
            title="güvenli ayrıştırma (Python)"
            code={`# Güvenli: DTD ve harici varlıkları işlemeyen kütüphane\nfrom defusedxml import ElementTree as ET\n\nagac = ET.fromstring(xml_metni)   # DOCTYPE/ENTITY varsa hata verir`}
          />
        </div>
      )}
      <LabNote>Denemeler: JSON&apos;da son elemandan sonra virgül bırakın; XML&apos;de bir etiketi kapatmayı unutun; XXE örneğini iki ayrıştırıcı modunda çalıştırın.</LabNote>
    </div>
  );
}
