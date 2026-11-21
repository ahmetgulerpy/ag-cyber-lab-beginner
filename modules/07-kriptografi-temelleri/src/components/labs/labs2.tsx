"use client";

import { useRef, useState } from "react";
import { Button, Callout, Field, OutBox, Pill, cx, inputCls } from "@/components/ui";
import { errMsg, exportPrivatePem, exportPublicPem, hexDiff, md5, rsaDecrypt, rsaEncrypt, rsaOaepGenerate, sha, shaText, toB64, toHex, utf8, type Bytes, fromB64 } from "@/lib/crypto";
import { Checklist, Lab, Panel, useAsync, useFlags } from "./shared";

/* ================= LAB 4: RSA-OAEP ================= */
type Pair = { id: "A" | "B"; pub: CryptoKey; priv: CryptoKey; pubPem: string; privPem: string; bits: number };

export function Lab4() {
  return <Lab lessonId={4}>{(finish) => <Lab4Body finish={finish} />}</Lab>;
}
function Lab4Body({ finish }: { finish: () => void }) {
  const [bits, setBits] = useState(2048);
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [text, setText] = useState("Buluşma noktası: kütüphane, saat 15:00");
  const [encWith, setEncWith] = useState<"A" | "B">("A");
  const [decWith, setDecWith] = useState<"A" | "B">("A");
  const [ct, setCt] = useState<{ b64: string; by: "A" | "B" } | null>(null);
  const [res, setRes] = useState<{ ok: boolean; msg: string } | null>(null);
  const [reveal, setReveal] = useState<Record<string, boolean>>({});
  const { busy, run } = useAsync();
  const { flags, set } = useFlags(["gen", "enc", "ok", "wrong"] as const, finish);

  const maxBytes = bits / 8 - 2 * 32 - 2;
  const byteLen = utf8(text).length;
  const get = (id: "A" | "B") => pairs.find((p) => p.id === id);

  const gen = (id: "A" | "B") =>
    run(async () => {
      const kp = await rsaOaepGenerate(bits);
      const pair: Pair = { id, pub: kp.publicKey, priv: kp.privateKey, pubPem: await exportPublicPem(kp.publicKey), privPem: await exportPrivatePem(kp.privateKey), bits };
      setPairs((ps) => [...ps.filter((p) => p.id !== id), pair].sort((a, b) => a.id.localeCompare(b.id)));
      setCt(null);
      setRes(null);
      set("gen");
    });
  const enc = () =>
    run(async () => {
      const p = get(encWith);
      if (!p) return setRes({ ok: false, msg: `Önce ${encWith} anahtar çiftini üret.` });
      try {
        const c = await rsaEncrypt(p.pub, text);
        setCt({ b64: toB64(c), by: encWith });
        setRes(null);
        set("enc");
      } catch (e) {
        setRes({ ok: false, msg: errMsg(e) });
      }
    });
  const dec = () =>
    run(async () => {
      const p = get(decWith);
      if (!ct || !p) return setRes({ ok: false, msg: `Önce ${decWith} anahtar çiftini üret.` });
      try {
        const plain = await rsaDecrypt(p.priv, fromB64(ct.b64));
        setRes({ ok: true, msg: `Çözüldü: "${plain}"` });
        set("ok");
      } catch {
        setRes({ ok: false, msg: `Çözülemedi: ${decWith} çiftinin Private Key'i, ${ct.by} çiftinin Public Key'iyle şifrelenen veriyi açamaz (OperationError).` });
        if (decWith !== ct.by) set("wrong");
      }
    });

  return (
    <div className="space-y-4">
      <Checklist flags={flags} items={[["gen", "Anahtar çifti üret"], ["enc", "Public Key ile şifrele"], ["ok", "Doğru Private Key ile çöz"], ["wrong", "Farklı çiftle çözmeyi dene"]]} />
      <Callout kind="danger" title="Private Key gizli tutulmalıdır">
        Bu laboratuvardaki anahtarlar yalnızca bu tarayıcı sekmesinde üretilir ve hiçbir yere gönderilmez. Gerçek hayatta Private Key&apos;ini kimseye gösterme, yapıştırma veya gönderme.
      </Callout>
      <Panel title="Anahtar çiftlerini üret (RSA-OAEP, SHA-256)" step="1">
        <div className="flex flex-wrap items-end gap-3">
          <Field label="Anahtar uzunluğu">
            <select className={inputCls} value={bits} onChange={(e) => setBits(Number(e.target.value))}>
              <option value={2048}>RSA-2048 (hızlı, asgari güvenli)</option>
              <option value={3072}>RSA-3072 (daha güçlü, daha yavaş)</option>
            </select>
          </Field>
          <Button onClick={() => gen("A")} disabled={busy}>
            Çift A üret
          </Button>
          <Button onClick={() => gen("B")} disabled={busy} variant="secondary">
            Çift B üret
          </Button>
          {busy && <span className="text-xs text-muted">Üretiliyor…</span>}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {pairs.map((p) => (
            <div key={p.id} className="space-y-3 rounded-xl border border-line bg-bg p-3">
              <p className="text-sm font-semibold text-brand">Anahtar çifti {p.id} <span className="text-xs font-normal text-muted">(RSA-{p.bits})</span></p>
              <OutBox label="Public Key (paylaşılabilir)" badge="AÇIK" value={p.pubPem} tone="ok" />
              <div className="rounded-xl border border-bad/40 bg-[#F9E8E8] p-3">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-bad">Private Key — ASLA PAYLAŞMA</p>
                  <button type="button" className="rounded-md border border-bad/40 bg-white px-2 py-0.5 text-xs text-bad" onClick={() => setReveal((r) => ({ ...r, [p.id]: !r[p.id] }))}>
                    {reveal[p.id] ? "Gizle" : "Göster (eğitim)"}
                  </button>
                </div>
                <p className={cx("hexbox whitespace-pre-wrap", !reveal[p.id] && "select-none blur-sm")}>{reveal[p.id] ? p.privPem : p.privPem.slice(0, 200)}</p>
              </div>
            </div>
          ))}
          {pairs.length === 0 && <p className="text-sm text-muted">Henüz anahtar çifti yok. Karşılaştırma için hem A hem B üretmeni öneririz.</p>}
        </div>
      </Panel>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Public Key ile şifrele" step="2">
          <Field label={`Mesaj (${byteLen}/${maxBytes} bayt — RSA-OAEP sınırı)`} hint="RSA büyük veriyi şifrelemez; gerçek sistemler hibrit yöntem kullanır.">
            <textarea className={cx(inputCls, "min-h-20")} value={text} onChange={(e) => setText(e.target.value)} />
          </Field>
          <Field label="Hangi çiftin Public Key'i ile şifrelensin?">
            <select className={inputCls} value={encWith} onChange={(e) => setEncWith(e.target.value as "A" | "B")}>
              <option value="A">Çift A — Public Key</option>
              <option value="B">Çift B — Public Key</option>
            </select>
          </Field>
          <Button onClick={enc} disabled={busy || !text || byteLen > maxBytes}>
            Şifrele
          </Button>
          {byteLen > maxBytes && <p className="text-xs text-bad">Mesaj çok uzun; kısalt.</p>}
          <OutBox label={ct ? `Şifreli metin (Base64) — ${ct.by} çiftinin Public Key'i ile` : "Şifreli metin (Base64)"} value={ct?.b64} />
        </Panel>
        <Panel title="Private Key ile çöz" step="3">
          <Field label="Hangi çiftin Private Key'i ile çözülsün?">
            <select className={inputCls} value={decWith} onChange={(e) => setDecWith(e.target.value as "A" | "B")}>
              <option value="A">Çift A — Private Key</option>
              <option value="B">Çift B — Private Key</option>
            </select>
          </Field>
          <Button onClick={dec} disabled={busy || !ct}>
            Çöz
          </Button>
          {res && <div className={cx("fadeup rounded-xl border p-3 text-sm", res.ok ? "border-ok/40 bg-[#E6F3EC]" : "border-bad/40 bg-[#F9E8E8]")}>{res.msg}</div>}
          <p className="text-xs text-muted">İpucu: A ile şifrele, B ile çözmeyi dene ve farkı gör.</p>
        </Panel>
      </div>
    </div>
  );
}

/* ================= LAB 5: SHA-256 ================= */
function HexDiff({ a, diff }: { a: string; diff: boolean[] }) {
  return (
    <p className="hexbox break-all">
      {Array.from(a).map((ch, i) => (
        <span key={i} className={cx(diff[i] && "rounded-sm bg-bad/25 font-bold text-bad")}>
          {ch}
        </span>
      ))}
    </p>
  );
}

export function Lab5() {
  return <Lab lessonId={5}>{(finish) => <Lab5Body finish={finish} />}</Lab>;
}
function Lab5Body({ finish }: { finish: () => void }) {
  const [text, setText] = useState("Merhaba");
  const [hist, setHist] = useState<{ text: string; hash: string; again: boolean }[]>([]);
  const [a, setA] = useState("AG Cyber Lab");
  const [b, setB] = useState("AG Cyber Lab.");
  const [cmp, setCmp] = useState<null | { ha: string; hb: string; bits: number; total: number; diff: boolean[]; chars: number }>(null);
  const { busy, run } = useAsync();
  const { flags, set } = useFlags(["hash", "again", "change"] as const, finish);

  const hashIt = () =>
    run(async () => {
      const h = await shaText("SHA-256", text);
      const again = hist.some((x) => x.text === text && x.hash === h);
      setHist((hs) => [{ text, hash: h, again }, ...hs].slice(0, 6));
      set("hash");
      if (again) set("again");
    });
  const compare = () =>
    run(async () => {
      const ha = await shaText("SHA-256", a);
      const hb = await shaText("SHA-256", b);
      const d = hexDiff(ha, hb);
      setCmp({ ha, hb, bits: d.bits, total: d.totalBits, diff: d.diffPos, chars: d.chars });
      if (a !== b) set("change");
    });
  const flip = () => setB(a.length ? a.slice(0, -1) + String.fromCharCode(a.charCodeAt(a.length - 1) ^ 1) : "a");

  return (
    <div className="space-y-4">
      <Checklist flags={flags} items={[["hash", "Hash üret"], ["again", "Aynı metni tekrar hash'le"], ["change", "Tek karakter değiştirip karşılaştır"]]} />
      <Panel title="SHA-256 hash üret" step="1">
        <Field label="Metin" hint="Aynı metinle 'Hash üret'e iki kez bas: sonucun aynı olduğunu gör (deterministik).">
          <input className={inputCls} value={text} onChange={(e) => setText(e.target.value)} />
        </Field>
        <Button onClick={hashIt} disabled={busy}>
          SHA-256 hash üret
        </Button>
        <div className="space-y-2">
          {hist.map((h, i) => (
            <div key={i} className="rounded-lg border border-line bg-bg p-2">
              <p className="mb-1 text-xs text-muted">
                &quot;{h.text}&quot; · {h.hash.length} hex karakter (256 bit) {h.again && <Pill tone="ok">Önceki ile aynı hash ✓</Pill>}
              </p>
              <p className="hexbox">{h.hash}</p>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Çığ etkisi (Avalanche): tek karakter değişince ne olur?" step="2" tone="brand">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Metin A">
            <input className={inputCls} value={a} onChange={(e) => setA(e.target.value)} />
          </Field>
          <Field label="Metin B">
            <input className={inputCls} value={b} onChange={(e) => setB(e.target.value)} />
          </Field>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={compare} disabled={busy}>
            Karşılaştır
          </Button>
          <Button variant="secondary" onClick={flip}>
            B&apos;de son karakterin 1 bitini değiştir
          </Button>
          <Button variant="secondary" onClick={() => setB(a)}>
            B = A
          </Button>
        </div>
        {cmp && (
          <div className="fadeup space-y-3">
            <div className="rounded-lg border border-line bg-white p-3">
              <p className="mb-1 text-xs font-semibold text-muted">Hash(A)</p>
              <HexDiff a={cmp.ha} diff={cmp.diff} />
              <p className="mb-1 mt-3 text-xs font-semibold text-muted">Hash(B)</p>
              <HexDiff a={cmp.hb} diff={cmp.diff} />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Pill tone={cmp.chars === 0 ? "ok" : "warn"}>{cmp.chars}/64 hex karakter farklı</Pill>
              <Pill tone="brand">
                {cmp.bits}/{cmp.total} bit farklı (%{Math.round((cmp.bits / cmp.total) * 100)})
              </Pill>
              <div className="h-2.5 w-48 overflow-hidden rounded-full bg-line">
                <div className="h-full bg-bad" style={{ width: `${(cmp.bits / cmp.total) * 100}%` }} />
              </div>
            </div>
            <p className="text-sm text-muted">{cmp.chars === 0 ? "Metinler aynı: hash'ler de aynı." : "Girdide küçük bir fark çıktının yaklaşık yarısını değiştirdi: çığ etkisi. Bu yüzden hash'e bakarak girdinin 'ne kadar benzediği' anlaşılamaz."}</p>
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ================= LAB 6: MD5 / SHA-1 / SHA-256 ================= */
const ALGO_INFO = [
  { id: "MD5", bits: 128, status: "Kırık", tone: "bad" as const, note: "Çakışma üretilebilir; güvenlik amaçlı kullanılmaz." },
  { id: "SHA-1", bits: 160, status: "Kırık", tone: "bad" as const, note: "SHAttered (2017) ile çakışma gösterildi." },
  { id: "SHA-256", bits: 256, status: "Güvenli", tone: "ok" as const, note: "Güncel standart; bütünlük ve imza için." },
  { id: "SHA-512", bits: 512, status: "Güvenli", tone: "ok" as const, note: "Uzun çıktı; 64 bit sistemlerde hızlı olabilir." },
];

async function allHashes(data: Bytes) {
  return {
    MD5: md5(data),
    "SHA-1": await sha("SHA-1", data),
    "SHA-256": await sha("SHA-256", data),
    "SHA-512": await sha("SHA-512", data),
  } as Record<string, string>;
}

export function Lab6() {
  return <Lab lessonId={6}>{(finish) => <Lab6Body finish={finish} />}</Lab>;
}
function Lab6Body({ finish }: { finish: () => void }) {
  const [mode, setMode] = useState<"text" | "file">("text");
  const [text, setText] = useState("AG Cyber Lab");
  const [file, setFile] = useState<File | null>(null);
  const [out, setOut] = useState<null | { label: string; h: Record<string, string>; size: number }>(null);
  const [vec, setVec] = useState<string>("");
  const seen = useRef(new Set<string>());
  const { busy, run } = useAsync();
  const { flags, set } = useFlags(["calc", "two", "vector"] as const, finish);

  const calc = () =>
    run(async () => {
      let data: Bytes;
      let label: string;
      if (mode === "file") {
        if (!file) return;
        if (file.size > 100 * 1024 * 1024) return setVec("Dosya 100 MB'tan büyük olamaz.");
        data = new Uint8Array(await file.arrayBuffer());
        label = `Dosya: ${file.name}`;
      } else {
        data = utf8(text);
        label = `Metin: "${text}"`;
      }
      const h = await allHashes(data);
      setOut({ label, h, size: data.length });
      set("calc");
      seen.current.add(h["SHA-256"]);
      if (seen.current.size >= 2) set("two");
    });

  const verify = () =>
    run(async () => {
      const known = { MD5: "900150983cd24fb0d6963f7d28e17f72", "SHA-1": "a9993e364706816aba3e25717850c26c9cd0d89d", "SHA-256": "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad" };
      const h = await allHashes(utf8("abc"));
      const lines = (Object.keys(known) as (keyof typeof known)[]).map((k) => `${k}: ${h[k] === known[k] ? "✓ resmî test vektörü ile eşleşti" : "✗ uyuşmadı"}`);
      setVec(`"abc" için standart (RFC/NIST) test vektörleri ile doğrulama\n${lines.join("\n")}`);
      if ((Object.keys(known) as (keyof typeof known)[]).every((k) => h[k] === known[k])) set("vector");
    });

  return (
    <div className="space-y-4">
      <Checklist flags={flags} items={[["calc", "Hash'leri hesapla"], ["two", "İkinci farklı girdiyi dene"], ["vector", "Test vektörünü doğrula"]]} />
      <Callout kind="danger" title="MD5 ve SHA-1 güvenli parola saklama algoritmaları değildir">
        Bu iki algoritma çakışmalara karşı kırılmıştır ve çok hızlıdır; parola, dijital imza veya sertifika için kullanılmamalıdır. Sonuçlar tarayıcında gerçekten hesaplanır (MD5 yerel RFC 1321 uygulaması, diğerleri Web Crypto).
      </Callout>
      <Panel title="Girdiyi seç" step="1">
        <div className="flex gap-2">
          <Button variant={mode === "text" ? "primary" : "secondary"} onClick={() => setMode("text")}>
            Metin
          </Button>
          <Button variant={mode === "file" ? "primary" : "secondary"} onClick={() => setMode("file")}>
            Dosya (yerelde)
          </Button>
        </div>
        {mode === "text" ? (
          <Field label="Metin">
            <textarea className={cx(inputCls, "min-h-16")} value={text} onChange={(e) => setText(e.target.value)} />
          </Field>
        ) : (
          <Field label="Dosya seç" hint="Dosya sunucuya gönderilmez; yalnızca tarayıcında okunur.">
            <input type="file" className={inputCls} onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </Field>
        )}
        <div className="flex flex-wrap gap-2">
          <Button onClick={calc} disabled={busy || (mode === "file" ? !file : false)}>
            4 algoritmayla hesapla
          </Button>
          <Button variant="secondary" onClick={verify} disabled={busy}>
            Test vektörlerini doğrula
          </Button>
        </div>
        {vec && <pre className="hexbox whitespace-pre-wrap rounded-lg border border-line bg-bg p-3">{vec}</pre>}
      </Panel>
      {out && (
        <Panel title={`Sonuçlar — ${out.label} (${out.size} bayt)`} step="2" tone="brand">
          <div className="space-y-3">
            {ALGO_INFO.map((a) => (
              <div key={a.id} className="rounded-xl border border-line bg-white p-3">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <b className="text-sm text-ink">{a.id}</b>
                  <Pill tone="brand">{a.bits} bit</Pill>
                  <Pill tone="neutral">{out.h[a.id].length} hex karakter</Pill>
                  <Pill tone={a.tone}>{a.status}</Pill>
                  <span className="text-xs text-muted">{a.note}</span>
                </div>
                <p className="hexbox">{out.h[a.id]}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted">Aynı girdi için farklı algoritmalar farklı uzunlukta çıktı verir. Girdiyi değiştirip tekrar hesapla; hepsi birlikte değişir.</p>
        </Panel>
      )}
    </div>
  );
}
