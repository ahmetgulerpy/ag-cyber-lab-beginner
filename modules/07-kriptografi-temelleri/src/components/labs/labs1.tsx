"use client";

import { useMemo, useState } from "react";
import { Button, Callout, Field, OutBox, Pill, cx, inputCls } from "@/components/ui";
import { aesDecrypt, aesEncrypt, aesExportHex, aesGenerate, aesKeyFromPassphrase, caesar, concat, errMsg, fromB64, randomBytes, toB64, toHex, utf8, vigenere, xorBytes } from "@/lib/crypto";
import { Checklist, Lab, Panel, useAsync, useFlags } from "./shared";

/* ================= LAB 1: Caesar ================= */
export function Lab1() {
  return <Lab lessonId={1}>{(finish) => <Lab1Body finish={finish} />}</Lab>;
}
function Lab1Body({ finish }: { finish: () => void }) {
  const [text, setText] = useState("Merhaba Dünya, bu bir kriptografi dersidir.");
  const [shift, setShift] = useState(3);
  const [cipher, setCipher] = useState("");
  const [cipherIn, setCipherIn] = useState("");
  const [decShift, setDecShift] = useState(3);
  const [plainOut, setPlainOut] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const { flags, set } = useFlags(["enc", "dec", "wrong", "brute"] as const, finish);

  const encrypt = () => {
    const c = caesar(text, shift);
    setCipher(c);
    setCipherIn(c);
    setDecShift(shift);
    setPlainOut(null);
    set("enc");
  };
  const decrypt = () => {
    const p = caesar(cipherIn, decShift, true);
    setPlainOut(p);
    if (cipher && p === text) set("dec");
    else if (cipher && decShift !== shift) set("wrong");
  };
  const all = useMemo(() => (cipherIn ? Array.from({ length: 28 }, (_, i) => ({ k: i + 1, p: caesar(cipherIn, i + 1, true) })) : []), [cipherIn]);

  return (
    <div className="space-y-4">
      <Callout kind="danger" title="Uyarı: Bu modern bir şifreleme yöntemi değildir">
        Caesar şifresi yalnızca eğitim amaçlıdır. Gerçek verileri korumak için kullanılmaz; anahtar uzayı çok küçüktür. Türkçe alfabe 29 harf içerir; kaydırma 1–28 arasındadır, harf dışı karakterler değişmez.
      </Callout>
      <Checklist flags={flags} items={[["enc", "Şifrele"], ["dec", "Doğru anahtarla çöz"], ["wrong", "Yanlış anahtar dene"], ["brute", "Tüm anahtarları dene"]]} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Şifrele" step="1">
          <Field label="Açık metin">
            <textarea className={cx(inputCls, "min-h-24")} value={text} onChange={(e) => setText(e.target.value)} />
          </Field>
          <Field label={`Kaydırma miktarı (anahtar): ${shift}`}>
            <input type="range" min={1} max={28} value={shift} onChange={(e) => setShift(Number(e.target.value))} className="w-full accent-[#176B87]" />
          </Field>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={encrypt} disabled={!text}>
              Şifrele
            </Button>
            <span className="text-xs text-muted">a → {caesar("a", shift)}, b → {caesar("b", shift)}, c → {caesar("c", shift)} …</span>
          </div>
          <OutBox label="Şifreli metin" value={cipher} mono={false} tone="brand" />
        </Panel>
        <Panel title="Çöz" step="2">
          <Field label="Şifreli metin" hint="Metni düzenleyebilir veya başka bir şifreli metin yapıştırabilirsin.">
            <textarea className={cx(inputCls, "min-h-24")} value={cipherIn} onChange={(e) => setCipherIn(e.target.value)} />
          </Field>
          <Field label={`Çözme anahtarı (kaydırma): ${decShift}`}>
            <input type="range" min={1} max={28} value={decShift} onChange={(e) => setDecShift(Number(e.target.value))} className="w-full accent-[#176B87]" />
          </Field>
          <Button onClick={decrypt} disabled={!cipherIn}>
            Çöz
          </Button>
          <OutBox label="Çözülen metin" value={plainOut ?? ""} mono={false} tone={plainOut === null ? "neutral" : plainOut === text && cipher ? "ok" : "warn"} />
          {plainOut !== null && cipher && (plainOut === text ? <Pill tone="ok">Doğru anahtar: orijinal metin geri geldi</Pill> : <Pill tone="warn">Yanlış anahtar: metin anlamsız</Pill>)}
        </Panel>
      </div>
      <Panel title="Saldırgan gözüyle: tüm anahtarları dene (Brute Force)" step="3" tone="danger">
        <p className="text-sm text-muted">Anahtar uzayı yalnızca 28 olduğundan saldırgan hepsini deneyip anlamlı olanı seçer.</p>
        <Button
          variant="danger"
          disabled={!cipherIn}
          onClick={() => {
            setShowAll(true);
            set("brute");
          }}
        >
          28 anahtarı da dene
        </Button>
        {showAll && (
          <div className="fadeup max-h-72 overflow-auto rounded-lg border border-line bg-white">
            <table className="w-full text-left text-sm">
              <tbody>
                {all.map((r) => (
                  <tr key={r.k} className={cx("border-b border-line", cipher && r.p === text && "bg-[#E6F3EC] font-medium")}>
                    <td className="w-16 px-3 py-1.5 text-muted">k={r.k}</td>
                    <td className="px-3 py-1.5">{r.p}</td>
                    <td className="w-24 px-3 py-1.5 text-right text-xs text-ok">{cipher && r.p === text ? "← anlamlı" : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ================= LAB 2: Şifreleme mantığı ================= */
type Alg = "caesar" | "vigenere" | "aes";
const ALGS: Record<Alg, { name: string; hint: string; keyLabel: string; def: string; desc: string }> = {
  caesar: { name: "Caesar Şifresi (klasik)", keyLabel: "Anahtar: kaydırma sayısı (1–28)", def: "5", hint: "Örn. 5", desc: "Her harfi anahtar kadar kaydırır. Güvensiz, eğitim amaçlı." },
  vigenere: { name: "Vigenère Şifresi (klasik)", keyLabel: "Anahtar: anahtar kelime", def: "anahtar", hint: "Örn. anahtar", desc: "Anahtar kelimenin harfleriyle çoklu kaydırma yapar. Güvensiz, eğitim amaçlı." },
  aes: { name: "AES-256-GCM (modern)", keyLabel: "Anahtar: parola (PBKDF2 ile 256 bit anahtara dönüştürülür)", def: "kriptografi-lab-123", hint: "Eğitim parolası yaz", desc: "Parolandan PBKDF2 (100.000 tur, rastgele salt) ile AES anahtarı türetilir; AES-GCM ile şifrelenir." },
};

async function encryptWith(alg: Alg, key: string, plain: string): Promise<string> {
  if (alg === "caesar") return caesar(plain, parseInt(key, 10) || 0);
  if (alg === "vigenere") return vigenere(plain, key);
  const salt = randomBytes(16);
  const k = await aesKeyFromPassphrase(key, salt);
  const { iv, ct } = await aesEncrypt(k, plain);
  return toB64(concat(concat(salt, iv), ct));
}
async function decryptWith(alg: Alg, key: string, cipher: string): Promise<string> {
  if (alg === "caesar") return caesar(cipher, parseInt(key, 10) || 0, true);
  if (alg === "vigenere") return vigenere(cipher, key, true);
  const all = fromB64(cipher);
  const salt = all.slice(0, 16);
  const iv = all.slice(16, 28);
  const ct = all.slice(28);
  const k = await aesKeyFromPassphrase(key, salt);
  return aesDecrypt(k, iv, ct);
}

export function Lab2() {
  return <Lab lessonId={2}>{(finish) => <Lab2Body finish={finish} />}</Lab>;
}
function Lab2Body({ finish }: { finish: () => void }) {
  const [alg, setAlg] = useState<Alg>("aes");
  const [plain, setPlain] = useState("Toplantı yarın saat 10:00'da.");
  const [key, setKey] = useState(ALGS.aes.def);
  const [cipher, setCipher] = useState("");
  const [usedKey, setUsedKey] = useState("");
  const [usedAlg, setUsedAlg] = useState<Alg>("aes");
  const [decKey, setDecKey] = useState(ALGS.aes.def);
  const [result, setResult] = useState<{ ok: boolean; text: string; note: string } | null>(null);
  const { busy, run } = useAsync();
  const { flags, set } = useFlags(["enc", "ok", "wrong"] as const, finish);

  const changeAlg = (a: Alg) => {
    setAlg(a);
    setKey(ALGS[a].def);
    setDecKey(ALGS[a].def);
    setCipher("");
    setResult(null);
  };
  const enc = () =>
    run(async () => {
      if (!key) return setResult({ ok: false, text: "", note: "Anahtar boş olamaz." });
      const c = await encryptWith(alg, key, plain);
      setCipher(c);
      setUsedKey(key);
      setUsedAlg(alg);
      setDecKey(key);
      setResult(null);
      set("enc");
    });
  const dec = (k: string) =>
    run(async () => {
      if (!cipher) return;
      if (!k) return setResult({ ok: false, text: "", note: "Anahtar boş olamaz." });
      try {
        const p = await decryptWith(usedAlg, k, cipher);
        const ok = p === plain;
        setResult({ ok, text: p, note: ok ? "Doğru anahtar: açık metin geri elde edildi." : "Yanlış anahtar: işlem çalıştı ama çıktı anlamsız." });
        if (ok) set("ok");
        else if (k !== usedKey) set("wrong");
      } catch (e) {
        setResult({ ok: false, text: "", note: `Çözme reddedildi (${errMsg(e)}). AES-GCM yanlış anahtarı doğrulama etiketiyle yakalar.` });
        if (k !== usedKey) set("wrong");
      }
    });

  const scenarios: [string, string][] = [
    ["Doğru anahtar", usedKey],
    ["Son karakter farklı", usedKey.slice(0, -1) + (usedKey.endsWith("a") ? "b" : "a")],
    ["Büyük/küçük harf değişti", usedKey === usedKey.toUpperCase() ? usedKey.toLowerCase() : usedKey.toUpperCase()],
    [usedAlg === "caesar" ? "Tek fazla kaydırma" : "Başka anahtar", usedAlg === "caesar" ? String(((parseInt(usedKey, 10) || 0) % 28) + 1) : "yanlis-anahtar"],
  ];

  return (
    <div className="space-y-4">
      <Checklist flags={flags} items={[["enc", "Şifrele"], ["ok", "Doğru anahtarla çöz"], ["wrong", "Yanlış anahtar senaryosu dene"]]} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Giriş: açık metin, algoritma ve anahtar" step="1">
          <Field label="Algoritma">
            <select className={inputCls} value={alg} onChange={(e) => changeAlg(e.target.value as Alg)}>
              {Object.entries(ALGS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.name}
                </option>
              ))}
            </select>
          </Field>
          <p className="text-xs text-muted">{ALGS[alg].desc}</p>
          <Field label="Açık metin (plaintext)">
            <textarea className={cx(inputCls, "min-h-20")} value={plain} onChange={(e) => setPlain(e.target.value)} />
          </Field>
          <Field label={ALGS[alg].keyLabel}>
            <input className={inputCls} value={key} placeholder={ALGS[alg].hint} onChange={(e) => setKey(e.target.value)} />
          </Field>
          <Button onClick={enc} disabled={busy || !plain}>
            Şifrele
          </Button>
        </Panel>
        <Panel title="Sistem bileşenleri" step="2" tone="brand">
          <OutBox label="1 · Açık metin" value={plain} mono={false} copy={false} />
          <OutBox label="2 · Algoritma (herkese açık)" value={ALGS[usedAlg].name} mono={false} copy={false} />
          <OutBox label="3 · Anahtar (gizli)" value={cipher ? usedKey : ""} mono={false} copy={false} tone="warn" />
          <OutBox label="4 · Şifreli metin" value={cipher} />
        </Panel>
      </div>
      <Panel title="Şifre çözme ve yanlış anahtar senaryoları" step="3">
        {!cipher ? (
          <p className="text-sm text-muted">Önce bir metin şifrele.</p>
        ) : (
          <>
            <Field label="Çözme anahtarı" hint="Aşağıdaki hazır senaryolardan birini seç ya da kendi anahtarını yaz.">
              <input className={inputCls} value={decKey} onChange={(e) => setDecKey(e.target.value)} />
            </Field>
            <div className="flex flex-wrap gap-2">
              {scenarios.map(([label, val]) => (
                <Button key={label} variant="secondary" onClick={() => setDecKey(val)} className="!px-3 !py-1 !text-xs">
                  {label}
                </Button>
              ))}
            </div>
            <Button onClick={() => dec(decKey)} disabled={busy}>
              Bu anahtarla çöz
            </Button>
            {result && (
              <div className="grid gap-3 sm:grid-cols-2">
                <OutBox label="5 · Çözülmüş metin" value={result.text} mono={false} tone={result.ok ? "ok" : "bad"} empty="(çıktı yok)" />
                <div className={cx("rounded-xl border p-3 text-sm", result.ok ? "border-ok/40 bg-[#E6F3EC]" : "border-bad/40 bg-[#F9E8E8]")}>{result.note}</div>
              </div>
            )}
          </>
        )}
      </Panel>
    </div>
  );
}

/* ================= LAB 3: AES-GCM ================= */
export function Lab3() {
  return <Lab lessonId={3}>{(finish) => <Lab3Body finish={finish} />}</Lab>;
}
type Enc = { iv: Uint8Array; ct: Uint8Array };
function Lab3Body({ finish }: { finish: () => void }) {
  const [bits, setBits] = useState<128 | 256>(256);
  const [key, setKey] = useState<CryptoKey | null>(null);
  const [keyHex, setKeyHex] = useState("");
  const [text, setText] = useState("Gizli not: proje parolası 'kedi-masa-42'");
  const [enc, setEnc] = useState<Enc | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [outs, setOuts] = useState<{ right?: string; wrong?: string; tamper?: string }>({});
  const [m1, setM1] = useState("Maaş: 50000 TL");
  const [m2, setM2] = useState("Maaş: 99999 TL");
  const [reuse, setReuse] = useState<null | { x1: string; x2: string; eq: boolean; r1: string; r2: string; c1: string; c2: string; rx: string }>(null);
  const [err, setErr] = useState("");
  const { busy, run } = useAsync();
  const { flags, set } = useFlags(["key", "enc", "right", "wrong", "reuse"] as const, finish);

  const gen = () =>
    run(async () => {
      const k = await aesGenerate(bits);
      setKey(k);
      setKeyHex(await aesExportHex(k));
      setEnc(null);
      setOuts({});
      setHistory([]);
      setErr("");
      set("key");
    });
  const encrypt = () =>
    run(async () => {
      if (!key) return;
      const r = await aesEncrypt(key, text);
      setEnc(r);
      setHistory((h) => [toHex(r.iv), ...h].slice(0, 4));
      setOuts({});
      set("enc");
    });
  const tryDecrypt = async (k: CryptoKey, e: Enc): Promise<string> => {
    try {
      return "✓ Çözüldü: " + (await aesDecrypt(k, e.iv, e.ct));
    } catch {
      return "✗ Reddedildi: doğrulama etiketi (tag) uyuşmadı (OperationError)";
    }
  };
  const decRight = () =>
    run(async () => {
      if (!key || !enc) return;
      const s = await tryDecrypt(key, enc);
      setOuts((o) => ({ ...o, right: s }));
      if (s.startsWith("✓")) set("right");
    });
  const decWrong = () =>
    run(async () => {
      if (!enc) return;
      const other = await aesGenerate(bits);
      const s = await tryDecrypt(other, enc);
      const hex = (await aesExportHex(other)).slice(0, 16);
      setOuts((o) => ({ ...o, wrong: s + `  (yanlış anahtar: ${hex}…)` }));
      if (s.startsWith("✗")) set("wrong");
    });
  const decTamper = () =>
    run(async () => {
      if (!key || !enc) return;
      const ct = new Uint8Array(enc.ct);
      ct[0] ^= 1;
      const s = await tryDecrypt(key, { iv: enc.iv, ct });
      setOuts((o) => ({ ...o, tamper: "1 bit bozuldu → " + s }));
    });
  const runReuse = () =>
    run(async () => {
      if (!key) return;
      const fixed = new Uint8Array(12);
      const a = await aesEncrypt(key, m1, fixed);
      const b = await aesEncrypt(key, m2, fixed);
      const p1 = utf8(m1);
      const p2 = utf8(m2);
      const n = Math.min(p1.length, p2.length);
      const xc = xorBytes(a.ct.slice(0, n), b.ct.slice(0, n));
      const xp = xorBytes(p1, p2);
      const r1 = await aesEncrypt(key, m1);
      const r2 = await aesEncrypt(key, m2);
      const xr = xorBytes(r1.ct.slice(0, n), r2.ct.slice(0, n));
      setReuse({ x1: toHex(xc), x2: toHex(xp), eq: toHex(xc) === toHex(xp), r1: toHex(xr), r2: toHex(xp), c1: toHex(a.ct.slice(0, n)), c2: toHex(b.ct.slice(0, n)), rx: toHex(xr) });
      set("reuse");
    });

  const ctB64 = enc ? toB64(enc.ct) : "";
  const tag = enc ? toHex(enc.ct.slice(enc.ct.length - 16)) : "";
  return (
    <div className="space-y-4">
      <Checklist flags={flags} items={[["key", "Anahtar üret"], ["enc", "Şifrele"], ["right", "Doğru anahtarla çöz"], ["wrong", "Yanlış anahtarla dene"], ["reuse", "Nonce tekrarı deneyi"]]} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Anahtar üret (Web Crypto, güvenli rastgele)" step="1">
          <Field label="AES anahtar uzunluğu">
            <select className={inputCls} value={bits} onChange={(e) => setBits(Number(e.target.value) as 128 | 256)}>
              <option value={128}>AES-128 (16 bayt)</option>
              <option value={256}>AES-256 (32 bayt)</option>
            </select>
          </Field>
          <Button onClick={gen} disabled={busy}>
            Yeni anahtar üret
          </Button>
          <OutBox label={`Gizli anahtar (${key ? bits : "—"} bit)`} badge="GİZLİ" value={keyHex} tone="warn" />
        </Panel>
        <Panel title="Metni şifrele" step="2">
          <Field label="Açık metin">
            <textarea className={cx(inputCls, "min-h-20")} value={text} onChange={(e) => setText(e.target.value)} />
          </Field>
          <Button onClick={encrypt} disabled={busy || !key || !text}>
            AES-GCM ile şifrele
          </Button>
          {!key && <p className="text-xs text-muted">Önce anahtar üret.</p>}
        </Panel>
      </div>
      {enc && (
        <Panel title="Şifreli çıktı: bileşenler" step="3" tone="brand">
          <div className="grid gap-3 md:grid-cols-3">
            <OutBox label="Nonce / IV (96 bit)" badge="gizli değil" value={toHex(enc.iv)} />
            <OutBox label="Şifreli metin (ciphertext)" value={toHex(enc.ct.slice(0, enc.ct.length - 16))} />
            <OutBox label="Doğrulama etiketi (tag, 128 bit)" value={tag} />
          </div>
          <OutBox label="Paket olarak (Base64): ciphertext + tag" value={ctB64} />
          <p className="text-xs text-muted">Nonce, şifreli veriyle birlikte gönderilir ve gizli değildir; ama aynı anahtarla bir daha kullanılmamalıdır. Aynı metni tekrar şifrele, nonce ve çıktının her seferinde değiştiğini gör:</p>
          <div className="flex flex-wrap gap-2">
            {history.map((h, i) => (
              <span key={h + i} className="hexbox rounded-md border border-line bg-white px-2 py-1 text-[11px]">
                #{history.length - i} IV: {h}
              </span>
            ))}
          </div>
        </Panel>
      )}
      {enc && (
        <Panel title="Çöz ve sonuçları karşılaştır" step="4">
          <div className="grid gap-3 md:grid-cols-3">
            {(
              [
                ["Doğru anahtarla çöz", decRight, outs.right],
                ["Yanlış anahtarla çöz", decWrong, outs.wrong],
                ["Veriyi boz (1 bit) ve çöz", decTamper, outs.tamper],
              ] as const
            ).map(([label, fn, out]) => (
              <div key={label} className="space-y-2 rounded-lg border border-line p-3">
                <Button variant="secondary" onClick={fn} disabled={busy} className="w-full">
                  {label}
                </Button>
                {out && (
                  <p className={cx("fadeup rounded-md p-2 text-xs", out.includes("✓") ? "bg-[#E6F3EC] text-ok" : "bg-[#F9E8E8] text-bad")}>{out}</p>
                )}
              </div>
            ))}
          </div>
          {err && <p className="text-xs text-bad">{err}</p>}
        </Panel>
      )}
      <Panel title="Tehlikeli deney: aynı anahtar + aynı nonce" step="5" tone="danger">
        <p className="text-sm text-ink/80">Normalde nonce her seferinde rastgele üretilir. Burada kasıtlı olarak iki mesajı <b>aynı sıfır nonce</b> ile şifreliyoruz. Şifreli metinlerin XOR&apos;u, açık metinlerin XOR&apos;una eşit çıkar: saldırgan anahtarı bilmeden iki mesaj arasındaki ilişkiyi öğrenir.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Mesaj 1">
            <input className={inputCls} value={m1} onChange={(e) => setM1(e.target.value)} />
          </Field>
          <Field label="Mesaj 2">
            <input className={inputCls} value={m2} onChange={(e) => setM2(e.target.value)} />
          </Field>
        </div>
        <Button variant="danger" onClick={runReuse} disabled={busy || !key}>
          Deneyi çalıştır {!key && "(önce anahtar üret)"}
        </Button>
        {reuse && (
          <div className="fadeup space-y-3">
            <OutBox label="C1 ⊕ C2 (aynı nonce — kötü)" value={reuse.x1} tone={reuse.eq ? "bad" : "neutral"} />
            <OutBox label="P1 ⊕ P2 (açık metinlerin XOR'u)" value={reuse.x2} />
            <p className={cx("text-sm font-medium", reuse.eq ? "text-bad" : "text-ok")}>{reuse.eq ? "⚠ Eşit! Nonce tekrarı açık metinlerin XOR'unu sızdırdı." : "Eşit değil."}</p>
            <OutBox label="Aynı mesajlar rastgele nonce ile: C1' ⊕ C2' (iyi)" value={reuse.rx} tone={reuse.rx === reuse.x2 ? "bad" : "ok"} />
            <p className="text-xs text-muted">Rastgele nonce ile XOR sonucu P1 ⊕ P2 ile eşleşmez; sızıntı oluşmaz. Üstelik GCM'de nonce tekrarı doğrulama anahtarını da zayıflatır.</p>
          </div>
        )}
      </Panel>
    </div>
  );
}
