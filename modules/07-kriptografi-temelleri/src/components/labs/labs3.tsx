"use client";

import { useRef, useState } from "react";
import { Button, Callout, Field, OutBox, Pill, cx, inputCls } from "@/components/ui";
import { errMsg, exportPublicPem, fromB64, fromHex, pbkdf2Hex, pssSign, pssVerify, randomBytes, rsaDecrypt, rsaOaepGenerate, rsaPssGenerate, shaText, toB64, toHex, utf8, type Bytes } from "@/lib/crypto";
import { Checklist, Lab, Panel, useAsync, useFlags } from "./shared";

/* ================= LAB 7: PBKDF2 + salt ================= */
type SaltMode = "none" | "random" | "manual";
type U = { name: string; pw: string; mode: SaltMode; manual: string };
type Row = { name: string; pw: string; saltHex: string; hash: string; ms: number; mode: SaltMode };

export function Lab7() {
  return <Lab lessonId={7}>{(finish) => <Lab7Body finish={finish} />}</Lab>;
}
function Lab7Body({ finish }: { finish: () => void }) {
  const [users, setUsers] = useState<U[]>([
    { name: "ayse", pw: "Merhaba123", mode: "none", manual: "tuz-1" },
    { name: "mehmet", pw: "Merhaba123", mode: "none", manual: "tuz-2" },
  ]);
  const [iter, setIter] = useState(100000);
  const [rows, setRows] = useState<Row[]>([]);
  const iters = useRef(new Set<number>());
  const { busy, run } = useAsync();
  const { flags, set } = useFlags(["nosalt", "salted", "iter"] as const, finish);

  const upd = (i: number, p: Partial<U>) => setUsers((us) => us.map((u, j) => (j === i ? { ...u, ...p } : u)));

  const hashAll = () =>
    run(async () => {
      const out: Row[] = [];
      for (const u of users) {
        const salt: Bytes = u.mode === "none" ? new Uint8Array(0) : u.mode === "random" ? randomBytes(16) : utf8(u.manual);
        const t0 = performance.now();
        const hash = await pbkdf2Hex(u.pw, salt, iter);
        out.push({ name: u.name, pw: u.pw, saltHex: toHex(salt), hash, ms: Math.round(performance.now() - t0), mode: u.mode });
      }
      setRows(out);
      iters.current.add(iter);
      if (iters.current.size >= 2) set("iter");
      const same = users[0].pw === users[1].pw;
      if (same && out[0].hash === out[1].hash && users.every((u) => u.mode === "none")) set("nosalt");
      if (same && out[0].hash !== out[1].hash && users.every((u) => u.mode !== "none")) set("salted");
    });

  const dup = rows.length === 2 && rows[0].hash === rows[1].hash;

  return (
    <div className="space-y-4">
      <Checklist flags={flags} items={[["nosalt", "Aynı parola, salt'sız → aynı hash"], ["salted", "Aynı parola, farklı salt → farklı hash"], ["iter", "İki farklı yineleme sayısı dene"]]} />
      <Callout kind="ok" title="Gizlilik">
        Parolalar sunucuya gönderilmez, kaydedilmez; PBKDF2 tamamen tarayıcında (Web Crypto) çalışır. Gerçek parolalarını kullanma, örnek parolalar dene.
      </Callout>
      <Panel title="İki kullanıcı, iki parola, salt seçenekleri" step="1">
        <div className="grid gap-4 md:grid-cols-2">
          {users.map((u, i) => (
            <div key={i} className="space-y-3 rounded-xl border border-line bg-bg p-3">
              <p className="text-sm font-semibold text-brand">Kullanıcı {i + 1}: {u.name}</p>
              <Field label="Örnek parola">
                <input className={inputCls} value={u.pw} onChange={(e) => upd(i, { pw: e.target.value })} />
              </Field>
              <Field label="Salt">
                <select className={inputCls} value={u.mode} onChange={(e) => upd(i, { mode: e.target.value as SaltMode })}>
                  <option value="none">Salt yok (boş) — güvensiz</option>
                  <option value="random">Rastgele 16 bayt (her hash'te yeni)</option>
                  <option value="manual">Elle gir</option>
                </select>
              </Field>
              {u.mode === "manual" && <input className={inputCls} value={u.manual} onChange={(e) => upd(i, { manual: e.target.value })} placeholder="salt metni" />}
            </div>
          ))}
        </div>
        <Field label={`PBKDF2-HMAC-SHA256 yineleme sayısı: ${iter.toLocaleString("tr-TR")}`} hint="Yineleme arttıkça hesaplama yavaşlar; saldırganın deneme hızı da düşer. OWASP: en az 600.000.">
          <select className={inputCls} value={iter} onChange={(e) => setIter(Number(e.target.value))}>
            <option value={1000}>1.000 (çok zayıf)</option>
            <option value={100000}>100.000</option>
            <option value={600000}>600.000 (OWASP önerisi)</option>
          </select>
        </Field>
        <div className="flex flex-wrap gap-2">
          <Button onClick={hashAll} disabled={busy}>
            {rows.length ? "Yeniden hash'le" : "Parolaları hash'le"}
          </Button>
          <Button variant="secondary" onClick={() => setUsers((us) => us.map((u) => ({ ...u, pw: us[0].pw })))}>
            İkisine de aynı parolayı ver
          </Button>
          <Button variant="secondary" onClick={() => setUsers((us) => us.map((u) => ({ ...u, mode: "random" })))}>
            İkisine de rastgele salt ver
          </Button>
        </div>
        {busy && <p className="text-xs text-muted">Hesaplanıyor…</p>}
      </Panel>
      {rows.length > 0 && (
        <Panel title="Saldırganın gördüğü veritabanı tablosu" step="2" tone="brand">
          <div className="overflow-x-auto rounded-lg border border-line bg-white">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="bg-bg text-muted">
                <tr>
                  <th className="px-3 py-2">Kullanıcı</th>
                  <th className="px-3 py-2">Salt (hex)</th>
                  <th className="px-3 py-2">PBKDF2 hash (hex)</th>
                  <th className="px-3 py-2">Süre</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name} className="border-t border-line align-top">
                    <td className="px-3 py-2 font-medium">{r.name}</td>
                    <td className="hexbox px-3 py-2">{r.saltHex || <span className="text-bad">(boş)</span>}</td>
                    <td className={cx("hexbox px-3 py-2", dup && "bg-[#F9E8E8]")}>{r.hash}</td>
                    <td className="px-3 py-2">{r.ms} ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows[0].pw === rows[1].pw ? (
            dup ? (
              <Callout kind="danger" title="Aynı hash!">Saldırgan iki hesabın aynı parolayı kullandığını hemen görür; birini kırarsa ikisini de ele geçirir.</Callout>
            ) : (
              <Callout kind="ok" title="Aynı parola, farklı hash">Salt farklı olduğu için hash&apos;ler tamamen farklı. Saldırgan her hesabı ayrı ayrı denemek zorunda.</Callout>
            )
          ) : (
            <Callout kind="info">Farklı parolalar farklı hash üretir. Parolaları aynı yapıp salt seçeneklerini değiştirerek karşılaştır.</Callout>
          )}
          <Callout kind="info" title="Salt gizli değildir">
            Salt, veritabanında hash&apos;in yanında açıkça saklanır — yukarıdaki tablo gibi. Güvenliği salt&apos;ın gizliliğinden değil, her parola için benzersiz olmasından gelir. Doğrulama için salt zaten gerekir.
          </Callout>
        </Panel>
      )}
    </div>
  );
}

/* ================= LAB 8: RSA-PSS ================= */
type SigPair = { pub: CryptoKey; priv: CryptoKey; pem: string };
export function Lab8() {
  return <Lab lessonId={8}>{(finish) => <Lab8Body finish={finish} />}</Lab>;
}
function Lab8Body({ finish }: { finish: () => void }) {
  const [pairs, setPairs] = useState<{ A?: SigPair; B?: SigPair }>({});
  const [msg, setMsg] = useState("Ödeme onayı: 1.500 TL, hesap TR00 0000");
  const [sig, setSig] = useState("");
  const [digest, setDigest] = useState("");
  const [vMsg, setVMsg] = useState("");
  const [vSig, setVSig] = useState("");
  const [vKey, setVKey] = useState<"A" | "B">("A");
  const [verdict, setVerdict] = useState<null | { ok: boolean; why: string }>(null);
  const { busy, run } = useAsync();
  const { flags, set } = useFlags(["gen", "sign", "valid", "invalid"] as const, finish);

  const gen = (id: "A" | "B") =>
    run(async () => {
      const kp = await rsaPssGenerate(2048);
      setPairs((p) => ({ ...p, [id]: { pub: kp.publicKey, priv: kp.privateKey, pem: "" } }));
      const pem = await exportPublicPem(kp.publicKey);
      setPairs((p) => ({ ...p, [id]: { pub: kp.publicKey, priv: kp.privateKey, pem } }));
      set("gen");
    });
  const sign = () =>
    run(async () => {
      if (!pairs.A) return;
      const s = await pssSign(pairs.A.priv, msg);
      setSig(toB64(s));
      setDigest(await shaText("SHA-256", msg));
      setVMsg(msg);
      setVSig(toB64(s));
      setVerdict(null);
      set("sign");
    });
  const verify = () =>
    run(async () => {
      const k = pairs[vKey];
      if (!k) return setVerdict({ ok: false, why: `Önce ${vKey} anahtar çiftini üret.` });
      let ok = false;
      try {
        ok = await pssVerify(k.pub, fromB64(vSig), vMsg);
      } catch {
        ok = false;
      }
      let why: string;
      if (ok) why = "İmza geçerli: mesaj değişmemiş ve imza, seçilen Public Key'e karşılık gelen Private Key ile üretilmiş.";
      else if (vMsg !== msg) why = "Mesaj imzalandıktan sonra değiştirilmiş; hash'ler eşleşmiyor.";
      else if (vSig !== sig) why = "İmza bozulmuş veya başka bir imza.";
      else if (vKey !== "A") why = "Bu Public Key, imzayı üreten Private Key ile eşleşmiyor.";
      else why = "İmza doğrulanamadı.";
      setVerdict({ ok, why });
      if (ok) set("valid");
      else set("invalid");
    });

  const tamperMsg = () => setVMsg((m) => (m ? m.replace(/1\.500/, "9.500").replace(/.$/, (c) => (c === "0" ? "1" : "0")) : "x"));
  const tamperSig = () => {
    if (!vSig) return;
    const b = fromB64(vSig);
    b[0] ^= 1;
    setVSig(toB64(b));
  };

  return (
    <div className="space-y-4">
      <Checklist flags={flags} items={[["gen", "Anahtar çifti üret"], ["sign", "Mesajı imzala"], ["valid", "Geçerli imzayı doğrula"], ["invalid", "Geçersiz imza sonucunu gör"]]} />
      <Callout kind="warn" title="İmza mesajı gizlemez">
        Aşağıdaki mesaj imzalandıktan sonra da okunabilir kalır. Dijital imza yalnızca kaynağı ve bütünlüğü kanıtlar. RSA-PSS imza içindir; şifreleme için RSA-OAEP kullanılır.
      </Callout>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Anahtar çifti üret (RSA-PSS 2048, SHA-256)" step="1">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => gen("A")} disabled={busy}>
              Çift A (imzalayan) üret
            </Button>
            <Button variant="secondary" onClick={() => gen("B")} disabled={busy}>
              Çift B (başka kişi) üret
            </Button>
          </div>
          {pairs.A && <OutBox label="Çift A — Public Key (paylaşılabilir)" value={pairs.A.pem} tone="ok" badge="AÇIK" />}
          {pairs.A && <p className="rounded-lg border border-bad/40 bg-[#F9E8E8] p-2 text-xs text-bad">Çift A&apos;nın Private Key&apos;i bu sekmede gizli tutulur ve yalnızca imzalama için kullanılır.</p>}
          {pairs.B && <p className="text-xs text-muted">Çift B de hazır: yanlış Public Key ile doğrulamayı deneyebilirsin.</p>}
        </Panel>
        <Panel title="Mesajı Private Key (A) ile imzala" step="2">
          <Field label="Mesaj">
            <textarea className={cx(inputCls, "min-h-20")} value={msg} onChange={(e) => setMsg(e.target.value)} />
          </Field>
          <Button onClick={sign} disabled={busy || !pairs.A || !msg}>
            İmzala
          </Button>
          {!pairs.A && <p className="text-xs text-muted">Önce Çift A üret.</p>}
          <OutBox label="Mesajın SHA-256 özeti (imzalanan veri)" value={digest} />
          <OutBox label="Dijital imza (Base64, 256 bayt)" value={sig} />
        </Panel>
      </div>
      <Panel title="Public Key ile doğrula" step="3" tone="brand">
        <p className="text-sm text-muted">Doğrulayıcının eline geçen mesajı ve imzayı değiştirebilir, farklı Public Key seçebilirsin.</p>
        <div className="grid gap-3 lg:grid-cols-2">
          <Field label="Doğrulanacak mesaj">
            <textarea className={cx(inputCls, "min-h-20")} value={vMsg} onChange={(e) => setVMsg(e.target.value)} />
          </Field>
          <Field label="İmza (Base64)">
            <textarea className={cx(inputCls, "hexbox min-h-20")} value={vSig} onChange={(e) => setVSig(e.target.value)} />
          </Field>
        </div>
        <Field label="Doğrulamada kullanılacak Public Key">
          <select className={inputCls} value={vKey} onChange={(e) => setVKey(e.target.value as "A" | "B")}>
            <option value="A">Çift A — Public Key (imzalayan)</option>
            <option value="B">Çift B — Public Key (başka kişi)</option>
          </select>
        </Field>
        <div className="flex flex-wrap gap-2">
          <Button onClick={verify} disabled={busy || !vSig}>
            İmzayı doğrula
          </Button>
          <Button variant="secondary" onClick={tamperMsg} disabled={!vMsg}>
            Mesajı değiştir
          </Button>
          <Button variant="secondary" onClick={tamperSig} disabled={!vSig}>
            İmzayı boz (1 bit)
          </Button>
          <Button variant="ghost" onClick={() => { setVMsg(msg); setVSig(sig); setVerdict(null); }} disabled={!sig}>
            Orijinale döndür
          </Button>
        </div>
        {verdict && (
          <div className={cx("fadeup rounded-xl border p-4", verdict.ok ? "border-ok/40 bg-[#E6F3EC]" : "border-bad/40 bg-[#F9E8E8]")}>
            <p className={cx("text-base font-semibold", verdict.ok ? "text-ok" : "text-bad")}>{verdict.ok ? "✓ GEÇERLİ İMZA" : "✗ GEÇERSİZ İMZA"}</p>
            <p className="mt-1 text-sm text-ink/80">{verdict.why}</p>
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ================= LAB 9: Anahtar seçim senaryoları ================= */
type Keys = { aliceEnc: CryptoKeyPair; bobEnc: CryptoKeyPair; aliceSig: CryptoKeyPair; bobSig: CryptoKeyPair; sig: Bytes };
const SIGNED_MSG = "Havale: 5.000 TL";
const TAMPERED_MSG = "Havale: 50.000 TL";
const KEY_CHOICES = ["Alice'in Public Key'i", "Alice'in Private Key'i", "Bob'un Public Key'i", "Bob'un Private Key'i"];

export function Lab9() {
  return <Lab lessonId={9}>{(finish) => <Lab9Body finish={finish} />}</Lab>;
}
function Lab9Body({ finish }: { finish: () => void }) {
  const [keys, setKeys] = useState<Keys | null>(null);
  const [tab, setTab] = useState(0);
  const [sel, setSel] = useState<Record<number, number | undefined>>({});
  const [outcome, setOutcome] = useState<Record<number, { good: boolean; lines: string[] } | undefined>>({});
  const { busy, run } = useAsync();
  const { flags, set } = useFlags(["s1", "s2", "s3"] as const, finish);

  const prepare = () =>
    run(async () => {
      const [aliceEnc, bobEnc, aliceSig, bobSig] = await Promise.all([rsaOaepGenerate(2048), rsaOaepGenerate(2048), rsaPssGenerate(2048), rsaPssGenerate(2048)]);
      const sig = await pssSign(aliceSig.privateKey, SIGNED_MSG);
      setKeys({ aliceEnc, bobEnc, aliceSig, bobSig, sig });
      setOutcome({});
    });

  const pick = (k: Keys, kind: "enc" | "sig", idx: number): CryptoKey => {
    const [a, b] = kind === "enc" ? [k.aliceEnc, k.bobEnc] : [k.aliceSig, k.bobSig];
    return [a.publicKey, a.privateKey, b.publicKey, b.privateKey][idx];
  };

  const runScenario = (n: number) =>
    run(async () => {
      if (!keys) return;
      const idx = sel[n];
      if (idx === undefined) return;
      const lines: string[] = [];
      let good = false;
      if (n === 0) {
        const secret = "Toplantı şifresi: kedi-42";
        try {
          const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "RSA-OAEP" }, pick(keys, "enc", idx), utf8(secret)));
          lines.push(`Alice mesajı "${KEY_CHOICES[idx]}" ile şifreledi (şifreli veri: ${ct.length} bayt).`);
          try {
            const p = await rsaDecrypt(keys.bobEnc.privateKey, ct);
            lines.push(`Bob kendi Private Key'i ile çözdü: "${p}" ✓`);
            good = true;
          } catch {
            lines.push("Bob kendi Private Key'i ile çözmeyi denedi: BAŞARISIZ ✗ — mesaj Bob'un Public Key'i ile şifrelenmemişti.");
            lines.push("Bu anahtarla yalnızca Alice çözebilirdi; Bob için gizlilik sağlanmadı.");
          }
        } catch (e) {
          lines.push(`Şifreleme denemesi reddedildi: ${errMsg(e)}`);
          lines.push("Private Key şifreleme için kullanılmaz; çözme/imzalama içindir ve paylaşılmaz.");
        }
      } else {
        const msg = n === 1 ? SIGNED_MSG : TAMPERED_MSG;
        try {
          const ok = await pssVerify(pick(keys, "sig", idx), keys.sig, msg);
          lines.push(`Doğrulanan mesaj: "${msg}"`);
          lines.push(`"${KEY_CHOICES[idx]}" ile doğrulama sonucu: ${ok ? "GEÇERLİ ✓" : "GEÇERSİZ ✗"}`);
          if (n === 1) {
            good = ok;
            if (!ok) lines.push("Bu anahtar, imzayı üreten Alice'in Private Key'ine ait değil; doğrulama başarısız.");
          } else {
            good = idx === 0;
            if (idx === 0) lines.push("Doğru anahtar seçildi: imza geçersiz çıktı çünkü mesaj değiştirilmiş (5.000 → 50.000). İşlem reddedilmeli.");
            else lines.push("Yanlış anahtar yüzünden 'geçersiz' çıktı; ama doğru anahtarla da sonuç geçersiz olurdu. İmzalayanın Public Key'ini seçmelisin.");
          }
        } catch (e) {
          lines.push(`Doğrulama denemesi reddedildi: ${errMsg(e)}`);
          lines.push("Private Key doğrulama için kullanılmaz; doğrulama imzalayanın Public Key'iyle yapılır.");
        }
      }
      setOutcome((o) => ({ ...o, [n]: { good, lines } }));
      if (good) set(n === 0 ? "s1" : n === 1 ? "s2" : "s3");
    });

  const scenarios = [
    { title: "1 · Bob'a gizli mesaj gönder", q: "Alice, Bob'a yalnızca Bob'un okuyabileceği bir mesaj göndermek istiyor. Şifrelemek için hangi anahtarı kullanmalı?" },
    { title: "2 · Mesajın kaynağını doğrula", q: `Alice "${SIGNED_MSG}" mesajını Private Key'iyle imzaladı. Bob, mesajın gerçekten Alice'ten geldiğini doğrulamak istiyor. Hangi anahtarı kullanmalı?` },
    { title: "3 · Dijital imzayı kontrol et", q: `Mallory mesajı "${TAMPERED_MSG}" olarak değiştirip Alice'in eski imzasıyla gönderdi. Bob imzayı kontrol ederken hangi anahtarı kullanmalı ve sonuç ne olur?` },
  ];

  return (
    <div className="space-y-4">
      <Checklist flags={flags} items={[["s1", "Senaryo 1 başarılı"], ["s2", "Senaryo 2 başarılı"], ["s3", "Senaryo 3 başarılı"]]} />
      <Panel title="Alice ve Bob için gerçek RSA anahtarlarını hazırla" step="0">
        <p className="text-sm text-muted">Şifreleme (RSA-OAEP) ve imza (RSA-PSS) için ayrı anahtar çiftleri üretilir — iyi uygulama budur. Hazırlık birkaç saniye sürebilir.</p>
        <Button onClick={prepare} disabled={busy}>
          {keys ? "Anahtarları yeniden üret" : busy ? "Üretiliyor…" : "Anahtarları hazırla"}
        </Button>
        {keys && <Pill tone="ok">4 anahtar çifti hazır (Alice/Bob × şifreleme/imza)</Pill>}
      </Panel>
      {keys && (
        <>
          <div className="flex flex-wrap gap-2">
            {scenarios.map((s, i) => (
              <button key={i} type="button" onClick={() => setTab(i)} className={cx("rounded-lg border px-3 py-1.5 text-sm", tab === i ? "border-brand bg-brand text-white" : "border-line bg-white text-ink hover:border-brand")}>
                {s.title} {flags[`s${i + 1}`] && "✓"}
              </button>
            ))}
          </div>
          <Panel title={scenarios[tab].title} tone="brand">
            <p className="text-sm text-ink">{scenarios[tab].q}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {KEY_CHOICES.map((k, i) => (
                <button key={k} type="button" onClick={() => setSel((s) => ({ ...s, [tab]: i }))} className={cx("rounded-lg border px-3 py-2 text-left text-sm", sel[tab] === i ? "border-brand bg-white ring-2 ring-accent/40" : "border-line bg-white hover:border-brand")}>
                  {i % 2 === 0 ? "🔓" : "🔐"} {k}
                </button>
              ))}
            </div>
            <Button onClick={() => runScenario(tab)} disabled={busy || sel[tab] === undefined}>
              Seçimi gerçek işlemle dene
            </Button>
            {outcome[tab] && (
              <div className={cx("fadeup space-y-1 rounded-xl border p-4 text-sm", outcome[tab]!.good ? "border-ok/40 bg-[#E6F3EC]" : "border-bad/40 bg-[#F9E8E8]")}>
                <p className={cx("font-semibold", outcome[tab]!.good ? "text-ok" : "text-bad")}>{outcome[tab]!.good ? "✓ Doğru seçim" : "✗ Bu seçim hedefe ulaştırmadı — başka bir anahtar dene"}</p>
                {outcome[tab]!.lines.map((l, i) => (
                  <p key={i} className="text-ink/90">• {l}</p>
                ))}
              </div>
            )}
          </Panel>
          <Callout kind="info" title="Kural">
            Şifreleme: alıcının <b>Public</b> anahtarı. İmzalama: kendi <b>Private</b> anahtarın. İmza doğrulama: imzalayanın <b>Public</b> anahtarı. Private anahtar hiçbir zaman paylaşılmaz.
          </Callout>
        </>
      )}
    </div>
  );
}

// kullanılmayan import uyarısını engellemek için
void fromHex;
