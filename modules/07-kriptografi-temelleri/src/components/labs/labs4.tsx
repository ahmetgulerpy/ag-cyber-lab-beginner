"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Callout, Field, OutBox, Pill, cx, inputCls } from "@/components/ui";
import { base32Encode, concat, errMsg, randomBytes, sha, toHex, totp, utf8, fromUtf8, type Bytes } from "@/lib/crypto";
import { Checklist, Lab, Panel, useAsync, useFlags } from "./shared";

/* ================= LAB 10: TLS simülatörü ================= */
type CertScenario = "valid" | "expired" | "wrongdomain" | "untrusted" | "revoked";
const DOMAIN = "www.ornek-banka.test";
const DAY = 86400000;
const SCEN: Record<CertScenario, { label: string; desc: string }> = {
  valid: { label: "Geçerli sertifika", desc: "Güvenilir CA tarafından imzalanmış, süresi geçerli, alan adı doğru." },
  expired: { label: "Süresi dolmuş sertifika", desc: "notAfter tarihi geçmiş." },
  wrongdomain: { label: "Alan adı uyuşmuyor", desc: "Sertifika başka bir alan adı için verilmiş." },
  untrusted: { label: "Güvenilmeyen CA", desc: "Sertifika, güven deposunda olmayan bir CA ile imzalanmış." },
  revoked: { label: "İptal edilmiş sertifika", desc: "Sertifika seri numarası iptal listesinde (CRL/OCSP)." },
};
type Cert = { serial: string; subject: string; san: string[]; issuer: string; notBefore: string; notAfter: string };
type Ctx = {
  ca: CryptoKeyPair;
  rogue: CryptoKeyPair;
  leaf: CryptoKeyPair;
  cert: Cert;
  certSig: Bytes;
  cEph: CryptoKeyPair;
  sEph: CryptoKeyPair;
  cRand: Bytes;
  sRand: Bytes;
  sessC?: CryptoKey;
  sessS?: CryptoKey;
};
type Entry = { title: string; from: "client" | "server" | "both" | "browser"; lines: string[]; tone: "ok" | "bad" | "info"; data?: [string, string][] };

const STEP_TITLES = ["Hazırlık", "Client Hello", "Server Hello + Sertifika", "Sertifika doğrulama", "Sunucu kimlik kanıtı", "Anahtar anlaşması (ECDHE)", "Oturum anahtarı türetme", "Güvenli oturum"];

const ecdsa = { name: "ECDSA", hash: "SHA-256" } as const;
async function rawPub(k: CryptoKey) {
  return new Uint8Array(await crypto.subtle.exportKey("raw", k)) as Bytes;
}
async function deriveSession(priv: CryptoKey, pub: CryptoKey, salt: Bytes) {
  const shared = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: pub }, priv, 256)) as Bytes;
  const base = await crypto.subtle.importKey("raw", shared, "HKDF", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey({ name: "HKDF", hash: "SHA-256", salt, info: utf8("ag-cyber-lab tls simulasyonu") }, base, { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
  return { shared, key };
}
async function fp(b: Uint8Array) {
  return (await sha("SHA-256", b as Bytes)).slice(0, 24);
}

export function Lab10() {
  return <Lab lessonId={10}>{(finish) => <Lab10Body finish={finish} />}</Lab>;
}
function Lab10Body({ finish }: { finish: () => void }) {
  const [scenario, setScenario] = useState<CertScenario>("valid");
  const [step, setStep] = useState(0);
  const [log, setLog] = useState<Entry[]>([]);
  const [aborted, setAborted] = useState<string | null>(null);
  const [bypass, setBypass] = useState(false);
  const [msg, setMsg] = useState("GET /hesap-ozeti HTTP/1.1\nCookie: oturum=abc123");
  const ctx = useRef<Ctx | null>(null);
  const { busy, run } = useAsync();
  const { flags, set } = useFlags(["ok", "bad", "enc"] as const, finish);

  const reset = (s: CertScenario = scenario) => {
    ctx.current = null;
    setStep(0);
    setLog([]);
    setAborted(null);
    setBypass(false);
    setScenario(s);
  };
  const push = (e: Entry) => setLog((l) => [...l, e]);

  const next = useCallback(
    () =>
      run(async () => {
        const c = ctx.current;
        try {
          if (step === 0) {
            const ca = (await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"])) as CryptoKeyPair;
            const rogue = (await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"])) as CryptoKeyPair;
            const leaf = (await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"])) as CryptoKeyPair;
            const now = Date.now();
            const cert: Cert = {
              serial: toHex(randomBytes(8)),
              subject: DOMAIN,
              san: scenario === "wrongdomain" ? ["www.baska-site.test"] : [DOMAIN],
              issuer: scenario === "untrusted" ? "Bilinmeyen Kök CA" : "AG Lab Güvenilir CA",
              notBefore: new Date(now - (scenario === "expired" ? 400 : 30) * DAY).toISOString().slice(0, 10),
              notAfter: new Date(now + (scenario === "expired" ? -35 : 300) * DAY).toISOString().slice(0, 10),
            };
            const signer = scenario === "untrusted" ? rogue.privateKey : ca.privateKey;
            const certSig = new Uint8Array(await crypto.subtle.sign(ecdsa, signer, utf8(JSON.stringify(cert)))) as Bytes;
            ctx.current = { ca, rogue, leaf, cert, certSig, cEph: null as unknown as CryptoKeyPair, sEph: null as unknown as CryptoKeyPair, cRand: randomBytes(32), sRand: randomBytes(32) };
            push({ title: "Hazırlık", from: "both", tone: "info", lines: ["Güvenilir CA anahtarı, sunucu sertifika anahtarı ve (güvenilmeyen senaryo için) sahte CA anahtarı üretildi (ECDSA P-256).", `Sunucu sertifikası senaryoya göre hazırlandı: ${SCEN[scenario].label}.`, "Tarayıcının güven deposunda yalnızca 'AG Lab Güvenilir CA' vardır."] });
          } else if (c && step === 1) {
            c.cEph = (await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"])) as CryptoKeyPair;
            push({ title: "Client Hello  →", from: "client", tone: "info", lines: ["Tarayıcı sunucuya ilk mesajı gönderir: desteklediği sürümler, şifre paketleri, rastgele değer ve geçici (ephemeral) ECDH anahtar payı.", `Sunucu adı (SNI): ${DOMAIN}`], data: [["Sürümler", "TLS 1.3, TLS 1.2"], ["Şifre paketleri", "AES-256-GCM, ChaCha20-Poly1305"], ["Client Random (32 bayt)", toHex(c.cRand)], ["Client key share (ECDH P-256 public)", toHex(await rawPub(c.cEph.publicKey)).slice(0, 66) + "…"]] });
          } else if (c && step === 2) {
            c.sEph = (await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"])) as CryptoKeyPair;
            push({ title: "←  Server Hello + Certificate", from: "server", tone: "info", lines: ["Sunucu seçtiği sürümü ve şifre paketini bildirir, kendi rastgele değerini ve ECDH anahtar payını gönderir.", "Ardından sertifikasını gönderir: sertifika sunucunun Public Key'ini ve alan adını bağlar, bir CA imzası taşır."], data: [["Seçilen sürüm / paket", "TLS 1.3 · AES-256-GCM"], ["Server Random", toHex(c.sRand)], ["Server key share", toHex(await rawPub(c.sEph.publicKey)).slice(0, 66) + "…"], ["Sertifika", `CN=${c.cert.subject} · SAN=${c.cert.san.join(", ")} · Veren=${c.cert.issuer} · ${c.cert.notBefore} → ${c.cert.notAfter} · Seri=${c.cert.serial}`], ["CA imzası", toHex(c.certSig).slice(0, 48) + "…"]] });
          } else if (c && step === 3) {
            const today = new Date().toISOString().slice(0, 10);
            const domainOk = c.cert.san.includes(DOMAIN);
            const dateOk = today >= c.cert.notBefore && today <= c.cert.notAfter;
            const sigOk = await crypto.subtle.verify(ecdsa, c.ca.publicKey, c.certSig, utf8(JSON.stringify(c.cert)));
            const revoked = scenario === "revoked";
            const lines = [`${domainOk ? "✓" : "✗"} Alan adı: istenen ${DOMAIN} — sertifikadaki SAN: ${c.cert.san.join(", ")}`, `${dateOk ? "✓" : "✗"} Geçerlilik: bugün ${today}, aralık ${c.cert.notBefore} → ${c.cert.notAfter}`, `${sigOk ? "✓" : "✗"} CA imzası: güven deposundaki 'AG Lab Güvenilir CA' Public Key'i ile gerçek ECDSA doğrulaması ${sigOk ? "başarılı" : "BAŞARISIZ (veren güvenilir değil)"}`, `${revoked ? "✗" : "✓"} İptal durumu: OCSP/CRL sorgusu — ${revoked ? "sertifika İPTAL EDİLMİŞ" : "iptal edilmemiş"}`];
            const failure = !domainOk ? "Alan adı sertifikayla eşleşmiyor (NET::ERR_CERT_COMMON_NAME_INVALID)" : !dateOk ? "Sertifikanın süresi dolmuş (NET::ERR_CERT_DATE_INVALID)" : !sigOk ? "Sertifika güvenilmeyen bir CA tarafından imzalanmış (NET::ERR_CERT_AUTHORITY_INVALID)" : revoked ? "Sertifika iptal edilmiş (NET::ERR_CERT_REVOKED)" : null;
            if (failure) {
              push({ title: "Sertifika doğrulama BAŞARISIZ", from: "browser", tone: "bad", lines: [...lines, "", `⛔ ${failure}`, "Tarayıcı bağlantıyı keser ve kullanıcıya uyarı gösterir."] });
              setAborted(failure);
              set("bad");
              return;
            }
            push({ title: "Sertifika doğrulama başarılı", from: "browser", tone: "ok", lines });
          } else if (c && step === 4) {
            const transcript = concat(concat(c.cRand, c.sRand), await rawPub(c.sEph.publicKey));
            const sig = new Uint8Array(await crypto.subtle.sign(ecdsa, c.leaf.privateKey, transcript));
            const ok = await crypto.subtle.verify(ecdsa, c.leaf.publicKey, sig, transcript);
            push({ title: "CertificateVerify / Finished", from: "server", tone: ok ? "ok" : "bad", lines: ["Sunucu, el sıkışma bilgilerini sertifikasındaki Public Key'e karşılık gelen Private Key'i ile imzalar: yalnızca gerçek sunucu bunu yapabilir.", `İstemci imzayı sertifikadaki Public Key ile doğruladı: ${ok ? "✓ geçerli" : "✗ geçersiz"}`] });
          } else if (c && step === 5) {
            const a = await deriveSession(c.cEph.privateKey, c.sEph.publicKey, concat(c.cRand, c.sRand));
            const b = await deriveSession(c.sEph.privateKey, c.cEph.publicKey, concat(c.cRand, c.sRand));
            c.sessC = a.key;
            c.sessS = b.key;
            const fa = await fp(a.shared);
            const fb = await fp(b.shared);
            push({ title: "Anahtar anlaşması (ECDHE)", from: "both", tone: fa === fb ? "ok" : "bad", lines: ["İki taraf yalnızca Public anahtar paylarını değiştirdi. Her biri kendi Private değeri ile karşı tarafın payından aynı ortak sırrı hesapladı. Ortak sır ağdan hiç geçmedi.", "Geçici anahtarlar kullanıldığı için sunucunun uzun süreli anahtarı çalınsa bile geçmiş oturumlar çözülemez (ileri gizlilik)."], data: [["İstemcinin hesapladığı ortak sır (parmak izi)", fa], ["Sunucunun hesapladığı ortak sır (parmak izi)", fb], ["Eşit mi?", fa === fb ? "EVET ✓" : "HAYIR ✗"]] });
          } else if (c && step === 6) {
            const ka = toHex(new Uint8Array(await crypto.subtle.exportKey("raw", c.sessC!)));
            const kb = toHex(new Uint8Array(await crypto.subtle.exportKey("raw", c.sessS!)));
            push({ title: "Oturum anahtarı (HKDF)", from: "both", tone: ka === kb ? "ok" : "bad", lines: ["Ortak sır, iki rastgele değerle birlikte HKDF-SHA256'dan geçirilerek 256 bitlik simetrik oturum anahtarı türetildi.", "Bundan sonraki tüm veri bu anahtarla AES-GCM ile şifrelenir (hızlı simetrik kriptografi)."], data: [["Oturum anahtarı parmak izi (istemci)", (await sha("SHA-256", utf8(ka))).slice(0, 24)], ["Oturum anahtarı parmak izi (sunucu)", (await sha("SHA-256", utf8(kb))).slice(0, 24)]] });
            if (scenario === "valid") set("ok");
          }
          setStep((s) => s + 1);
        } catch (e) {
          push({ title: "Hata", from: "browser", tone: "bad", lines: [errMsg(e)] });
        }
      }),
    [step, scenario, run, set],
  );

  const send = () =>
    run(async () => {
      const c = ctx.current;
      if (!c?.sessC || !c.sessS) return;
      const iv = randomBytes(12);
      const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, c.sessC, utf8(msg)));
      const pt = new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv }, c.sessS, ct));
      const reply = "HTTP/1.1 200 OK — Hesap özeti: bakiye 12.345,67 TL";
      const iv2 = randomBytes(12);
      const ct2 = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv2 }, c.sessS, utf8(reply)));
      const pt2 = new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv2 }, c.sessC, ct2));
      push({ title: "Şifreli uygulama verisi (HTTPS)", from: "both", tone: "ok", lines: ["Ağdaki bir saldırgan yalnızca aşağıdaki şifreli baytları görür.", `Sunucu isteği çözdü: "${fromUtf8(pt).replace(/\n/g, " ⏎ ")}"`, `İstemci yanıtı çözdü: "${fromUtf8(pt2)}"`], data: [["Ağda görünen istek (hex)", toHex(concat(iv, ct)).slice(0, 96) + "…"], ["Ağda görünen yanıt (hex)", toHex(concat(iv2, ct2)).slice(0, 96) + "…"]] });
      set("enc");
    });

  const done = step >= 7 && !aborted;
  return (
    <div className="space-y-4">
      <Callout kind="info" title="Tamamen yerel simülasyon">
        Gerçek ağ trafiği veya üçüncü taraf sunucu yoktur. İstemci ve sunucu tarayıcı içinde canlandırılır; ECDH anahtar anlaşması, HKDF, AES-GCM ve ECDSA imzaları ise gerçek Web Crypto işlemleridir.
      </Callout>
      <Checklist flags={flags} items={[["ok", "Başarılı el sıkışma tamamla"], ["bad", "Sertifika hatası senaryosunu gör"], ["enc", "Şifreli mesaj gönder"]]} />
      <Panel title="Senaryoyu seç" step="1">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(SCEN) as CertScenario[]).map((k) => (
            <button key={k} type="button" onClick={() => reset(k)} className={cx("rounded-lg border p-3 text-left text-sm", scenario === k ? "border-brand bg-soft ring-2 ring-accent/30" : "border-line bg-white hover:border-brand")}>
              <b className="block text-ink">{SCEN[k].label}</b>
              <span className="text-xs text-muted">{SCEN[k].desc}</span>
            </button>
          ))}
        </div>
      </Panel>
      <Panel title={`El sıkışma akışı — ${DOMAIN}`} step="2" tone="brand">
        <div className="flex flex-wrap items-center gap-1.5">
          {STEP_TITLES.map((t, i) => (
            <span key={t} className={cx("rounded-full border px-2.5 py-0.5 text-xs", i < step ? "border-ok/40 bg-[#E6F3EC] text-ok" : i === step && !aborted ? "border-brand bg-brand text-white" : "border-line bg-white text-muted")}>
              {i + 1}. {t}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={next} disabled={busy || step >= 7 || (!!aborted && !bypass)}>
            {step >= 7 ? "El sıkışma tamamlandı" : `Sonraki adım ▶ (${STEP_TITLES[step]})`}
          </Button>
          <Button variant="secondary" onClick={() => reset()}>
            Sıfırla
          </Button>
        </div>
        {aborted && !bypass && (
          <div className="fadeup rounded-xl border-2 border-bad bg-[#F9E8E8] p-4">
            <p className="font-semibold text-bad">⛔ Bağlantınız gizli değil</p>
            <p className="mt-1 text-sm text-ink/90">{aborted}</p>
            <p className="mt-1 text-sm text-ink/80">El sıkışma durduruldu; güvenli oturum kurulamadı. Doğru karar: ayrılmak ve yöneticiye bildirmek.</p>
            <Button variant="danger" className="mt-3" onClick={() => { setBypass(true); setAborted(aborted); setStep(4); push({ title: "Kullanıcı uyarıyı geçti ⚠", from: "browser", tone: "bad", lines: ["Kullanıcı 'yine de devam et' dedi. Şifreleme çalışabilir ama karşıdaki tarafın sunucu olduğu doğrulanmadı: araya giren bir saldırgan (MITM) ile şifreli bağlantı kurmuş olabilirsin."] }); }}>
              Yine de devam et (tehlikeli — sadece deney)
            </Button>
          </div>
        )}
        <ol className="space-y-3">
          {log.map((e, i) => (
            <li key={i} className={cx("fadeup rounded-xl border p-3", e.tone === "ok" ? "border-ok/40 bg-[#E6F3EC]" : e.tone === "bad" ? "border-bad/40 bg-[#F9E8E8]" : "border-line bg-white")}>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <b className="text-sm text-ink">{e.title}</b>
                <Pill tone="neutral">{e.from === "client" ? "💻 İstemci → Sunucu" : e.from === "server" ? "🖥️ Sunucu → İstemci" : e.from === "both" ? "💻 ⇄ 🖥️" : "🌐 Tarayıcı"}</Pill>
              </div>
              {e.lines.map((l, j) => (
                <p key={j} className="text-sm text-ink/90">{l}</p>
              ))}
              {e.data && (
                <dl className="mt-2 space-y-1">
                  {e.data.map(([k, v]) => (
                    <div key={k} className="rounded-md bg-white/70 p-1.5">
                      <dt className="text-[11px] font-semibold uppercase text-muted">{k}</dt>
                      <dd className="hexbox">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </li>
          ))}
        </ol>
        {(done || (bypass && step >= 7)) && (
          <div className="space-y-2 rounded-xl border border-line bg-white p-3">
            <Field label="Güvenli oturumdan bir HTTP isteği gönder (AES-GCM ile şifrelenir)">
              <textarea className={cx(inputCls, "min-h-16")} value={msg} onChange={(e) => setMsg(e.target.value)} />
            </Field>
            <Button onClick={send} disabled={busy || !msg}>
              Şifreli gönder
            </Button>
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ================= LAB 11: Sertifika doğrulama ================= */
type XCert = { subject: string; issuer: string; serial: string; from: string; to: string; san: string[]; usage: string; sig: string; key: string; ca: boolean };
type Site = { id: string; host: string; label: string; chain: XCert[]; revoked: boolean; trustedRoot: boolean; answer: number };
const SIM_TODAY = "2026-06-15";
const ROOT: XCert = { subject: "AG Lab Root CA", issuer: "AG Lab Root CA", serial: "01", from: "2015-01-01", to: "2040-01-01", san: [], usage: "Certificate Sign, CRL Sign", sig: "ecdsa-with-SHA384", key: "EC P-384", ca: true };
const INTER: XCert = { subject: "AG Lab Issuing CA 1", issuer: "AG Lab Root CA", serial: "10", from: "2020-01-01", to: "2032-01-01", san: [], usage: "Certificate Sign, CRL Sign", sig: "ecdsa-with-SHA384", key: "EC P-384", ca: true };
const mkLeaf = (host: string, serial: string, from: string, to: string, san: string[]): XCert => ({ subject: host, issuer: INTER.subject, serial, from, to, san, usage: "Digital Signature, Key Encipherment", sig: "ecdsa-with-SHA256", key: "EC P-256", ca: false });
const SITES: Site[] = [
  { id: "a", host: "www.ornek-banka.test", label: "Site A", chain: [mkLeaf("www.ornek-banka.test", "A1B2", "2026-03-01", "2026-09-27", ["www.ornek-banka.test", "ornek-banka.test"]), INTER, ROOT], revoked: false, trustedRoot: true, answer: 0 },
  { id: "b", host: "eski.ornek-banka.test", label: "Site B", chain: [mkLeaf("eski.ornek-banka.test", "B7C8", "2025-01-10", "2026-02-10", ["eski.ornek-banka.test"]), INTER, ROOT], revoked: false, trustedRoot: true, answer: 1 },
  { id: "c", host: "posta.ornek-banka.test", label: "Site C", chain: [mkLeaf("mail.ornek-banka.test", "C3D4", "2026-02-01", "2026-12-01", ["mail.ornek-banka.test"]), INTER, ROOT], revoked: false, trustedRoot: true, answer: 2 },
  { id: "d", host: "portal.sirket.test", label: "Site D", chain: [{ ...mkLeaf("portal.sirket.test", "D5E6", "2026-01-01", "2026-12-31", ["portal.sirket.test"]), issuer: "Sirket Ic CA" }, { ...INTER, subject: "Sirket Ic CA", issuer: "Bilinmeyen Kök CA", serial: "7F" }, { ...ROOT, subject: "Bilinmeyen Kök CA", issuer: "Bilinmeyen Kök CA", serial: "AA" }], revoked: false, trustedRoot: false, answer: 3 },
  { id: "e", host: "odeme.ornek-banka.test", label: "Site E", chain: [mkLeaf("odeme.ornek-banka.test", "E9F0", "2026-04-01", "2026-10-28", ["odeme.ornek-banka.test"]), INTER, ROOT], revoked: true, trustedRoot: true, answer: 4 },
];
const VERDICTS = ["Güvenilir / geçerli", "Süresi dolmuş", "Alan adı uyuşmuyor", "Güvenilmeyen CA", "İptal edilmiş"];

function domainMatches(host: string, san: string[]) {
  return san.some((s) => (s.startsWith("*.") ? host.endsWith(s.slice(1)) && host.split(".").length === s.split(".").length : s === host));
}

export function Lab11() {
  return <Lab lessonId={11}>{(finish) => <Lab11Body finish={finish} />}</Lab>;
}
function Lab11Body({ finish }: { finish: () => void }) {
  const [siteId, setSiteId] = useState("a");
  const [selCert, setSelCert] = useState(0);
  const [checks, setChecks] = useState<Record<string, Record<string, { ok: boolean; text: string }>>>({});
  const [verdict, setVerdict] = useState<Record<string, number | undefined>>({});
  const { flags, set } = useFlags(["a", "b", "c", "d", "e"] as const, finish);
  const site = SITES.find((s) => s.id === siteId)!;
  const ck = checks[siteId] ?? {};
  const leaf = site.chain[0];

  const doCheck = (k: "domain" | "date" | "chain" | "revoke") => {
    let r: { ok: boolean; text: string };
    if (k === "domain") {
      const ok = domainMatches(site.host, leaf.san);
      r = { ok, text: `İstenen: ${site.host} — Sertifikadaki SAN: ${leaf.san.join(", ")} → ${ok ? "eşleşiyor" : "EŞLEŞMİYOR"}` };
    } else if (k === "date") {
      const bad = site.chain.filter((c) => SIM_TODAY < c.from || SIM_TODAY > c.to);
      r = bad.length ? { ok: false, text: `Simülasyon tarihi ${SIM_TODAY}. Geçersiz: ${bad.map((b) => `${b.subject} (${b.from} → ${b.to})`).join("; ")}` } : { ok: true, text: `Simülasyon tarihi ${SIM_TODAY}: zincirdeki üç sertifika da geçerlilik aralığında.` };
    } else if (k === "chain") {
      const links = site.chain.slice(0, 2).map((c, i) => c.issuer === site.chain[i + 1].subject);
      const rootSelf = site.chain[2].issuer === site.chain[2].subject;
      const ok = links.every(Boolean) && rootSelf && site.trustedRoot;
      r = { ok, text: `Yaprak → ${site.chain[1].subject} ${links[0] ? "✓" : "✗"}; ${site.chain[1].subject} → ${site.chain[2].subject} ${links[1] ? "✓" : "✗"}; kök '${site.chain[2].subject}' tarayıcı güven deposunda: ${site.trustedRoot ? "EVET" : "HAYIR"}` };
    } else {
      r = site.revoked ? { ok: false, text: `OCSP yanıtı: seri ${leaf.serial} → REVOKED (anahtar sızıntısı nedeniyle iptal edildi)` } : { ok: true, text: `OCSP yanıtı: seri ${leaf.serial} → GOOD` };
    }
    setChecks((c) => ({ ...c, [siteId]: { ...(c[siteId] ?? {}), [k]: r } }));
  };

  const decide = (v: number) => {
    setVerdict((x) => ({ ...x, [siteId]: v }));
    if (v === site.answer) set(siteId as "a");
  };
  const cur = verdict[siteId];
  const allChecked = ["domain", "date", "chain", "revoke"].every((k) => ck[k]);
  const c = site.chain[selCert];

  return (
    <div className="space-y-4">
      <Callout kind="info" title="Örnek veriler">
        Bu laboratuvardaki sertifikalar tamamen kurgusaldır; gerçek sertifika veya Private Key içermez. Simülasyon tarihi: {SIM_TODAY.split("-").reverse().join(".")}.
      </Callout>
      <Checklist flags={flags} items={SITES.map((s) => [s.id, `${s.label} çözüldü`] as [string, string])} />
      <div className="flex flex-wrap gap-2">
        {SITES.map((s) => (
          <button key={s.id} type="button" onClick={() => { setSiteId(s.id); setSelCert(0); }} className={cx("rounded-lg border px-3 py-1.5 text-sm", siteId === s.id ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand")}>
            {s.label} {flags[s.id] && "✓"}
          </button>
        ))}
      </div>
      <Panel title={`Tarayıcı ${site.host} adresine bağlanıyor`} step="1" tone="brand">
        <p className="text-sm text-muted">Sunucunun sunduğu zinciri incele: bir sertifikaya tıkla ve X.509 alanlarını gör.</p>
        <div className="flex flex-wrap items-stretch gap-2">
          {site.chain.map((x, i) => (
            <div key={i} className="flex items-center gap-2">
              <button type="button" onClick={() => setSelCert(i)} className={cx("rounded-lg border p-3 text-left text-xs", selCert === i ? "border-brand bg-white ring-2 ring-accent/40" : "border-line bg-white hover:border-brand")}>
                <span className="block text-[10px] font-semibold uppercase text-accent">{["Sunucu (Leaf)", "Intermediate CA", "Root CA"][i]}</span>
                <b className="text-sm text-ink">{x.subject}</b>
                <span className="block text-muted">Veren: {x.issuer}</span>
              </button>
              {i < 2 && <span className="text-lg text-muted">⟵ imzalar</span>}
            </div>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {(
            [
              ["Subject (Konu)", c.subject],
              ["Issuer (Veren)", c.issuer],
              ["Seri numarası", c.serial],
              ["Geçerlilik başlangıcı (notBefore)", c.from],
              ["Geçerlilik sonu (notAfter)", c.to],
              ["SAN (geçerli alan adları)", c.san.join(", ") || "—"],
              ["Key Usage", c.usage],
              ["Public Key", c.key],
              ["İmza algoritması", c.sig],
              ["CA mı?", c.ca ? "Evet (CA:TRUE)" : "Hayır (CA:FALSE)"],
            ] as [string, string][]
          ).map(([k, v]) => (
            <OutBox key={k} label={k} value={v} copy={false} />
          ))}
        </div>
      </Panel>
      <Panel title="Kontrolleri kendin çalıştır" step="2">
        <div className="grid gap-2 sm:grid-cols-2">
          {(
            [
              ["domain", "1 · Alan adı eşleşmesi"],
              ["date", "2 · Geçerlilik tarihi"],
              ["chain", "3 · Sertifika zinciri ve güvenilir kök"],
              ["revoke", "4 · İptal durumu (OCSP)"],
            ] as const
          ).map(([k, label]) => (
            <div key={k} className="space-y-2">
              <Button variant="secondary" className="w-full" onClick={() => doCheck(k)}>
                {label}
              </Button>
              {ck[k] && <p className={cx("fadeup rounded-lg border p-2 text-xs", ck[k].ok ? "border-ok/40 bg-[#E6F3EC] text-ok" : "border-bad/40 bg-[#F9E8E8] text-bad")}>{ck[k].ok ? "✓ " : "✗ "}{ck[k].text}</p>}
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Karar ver: bu sertifikanın durumu nedir?" step="3">
        <div className="flex flex-wrap gap-2">
          {VERDICTS.map((v, i) => (
            <button key={v} type="button" onClick={() => decide(i)} disabled={!allChecked} className={cx("rounded-full border px-3 py-1.5 text-sm disabled:opacity-50", cur === i ? (i === site.answer ? "border-ok bg-[#E6F3EC] text-ok" : "border-bad bg-[#F9E8E8] text-bad") : "border-line bg-white hover:border-brand")}>
              {v}
            </button>
          ))}
        </div>
        {!allChecked && <p className="text-xs text-muted">Karar vermeden önce dört kontrolü de çalıştır.</p>}
        {cur !== undefined && (
          <Callout kind={cur === site.answer ? "ok" : "danger"} title={cur === site.answer ? "Doğru karar" : "Yanlış karar — kontrol sonuçlarını tekrar incele"}>
            {cur === site.answer ? ["Tüm kontroller geçti: sertifika güvenilir.", "Sertifikanın süresi dolmuş: tarayıcı bağlantıyı reddeder.", "Alan adı SAN listesinde yok: başka siteye ait sertifika.", "Zincir güvenilir bir köke ulaşmıyor: kök, güven deposunda yok.", "Sertifika CA tarafından iptal edilmiş (OCSP: REVOKED)."][site.answer] : "Kırmızı çıkan kontrole bak: hangi güven koşulu bozuk?"}
          </Callout>
        )}
      </Panel>
    </div>
  );
}

/* ================= LAB 12a: Parola analizörü ================= */
const COMMON = ["123456", "password", "12345678", "qwerty", "abc123", "111111", "123123", "admin", "letmein", "welcome", "iloveyou", "monkey", "dragon", "sifre", "parola", "1q2w3e", "sunshine", "football", "master", "login", "passw0rd", "trustno1", "merhaba", "galatasaray", "fenerbahce", "besiktas", "istanbul", "ankara", "123456789", "1234567890", "qwerty123", "password1", "12345", "654321", "zaq12wsx", "000000", "asdfgh", "qazwsx", "admin123", "merhaba123", "sifre123", "test123"];
const SEQS = ["abcdefghijklmnopqrstuvwxyz", "0123456789", "qwertyuiop", "asdfghjkl", "zxcvbnm", "9876543210"];

function leet(s: string) {
  return s.toLowerCase().replace(/[@4]/g, "a").replace(/0/g, "o").replace(/[1!|]/g, "i").replace(/3/g, "e").replace(/[$5]/g, "s").replace(/7/g, "t").replace(/ş/g, "s").replace(/ı/g, "i").replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ö/g, "o").replace(/ü/g, "u");
}
function fmtTime(sec: number): string {
  if (!isFinite(sec)) return "çok uzun";
  if (sec < 1) return "anında";
  const u: [number, string][] = [[60, "saniye"], [60, "dakika"], [24, "saat"], [365, "gün"], [1000, "yıl"], [1000, "bin yıl"], [1000, "milyon yıl"], [1000, "milyar yıl"]];
  let v = sec;
  let name = "saniye";
  for (let i = 0; i < u.length; i++) {
    name = u[i][1];
    if (v < u[i][0] || i === u.length - 1) break;
    v /= u[i][0];
    name = u[i + 1]?.[1] ?? name;
  }
  return `${v >= 100 ? Math.round(v) : v.toFixed(1)} ${name}`;
}

export function analyzePassword(pw: string) {
  const len = pw.length;
  const lower = /[a-zçğıöşü]/.test(pw);
  const upper = /[A-ZÇĞİÖŞÜ]/.test(pw);
  const digit = /\d/.test(pw);
  const symbol = /[^A-Za-z0-9çğıöşüÇĞİÖŞÜ\s]/.test(pw);
  const space = /\s/.test(pw);
  let pool = 0;
  if (lower) pool += 29;
  if (upper) pool += 29;
  if (digit) pool += 10;
  if (symbol) pool += 33;
  if (space) pool += 1;
  const naive = len && pool ? len * Math.log2(pool) : 0;
  let ent = naive;
  const warns: string[] = [];
  const norm = leet(pw);
  const stripped = norm.replace(/[^a-z]+$/g, "").replace(/^[^a-z]+/, "");
  const common = COMMON.some((c) => norm === c || stripped === c || (stripped.length >= 4 && stripped === leet(c)));
  if (common) {
    ent = Math.min(ent, 12);
    warns.push("Bu parola (veya basit bir varyasyonu) yaygın parola listelerinde bulunuyor; saldırgan ilk denemelerde bulur.");
  }
  const lowerPw = pw.toLowerCase();
  if (SEQS.some((s) => { for (let i = 0; i + 4 <= lowerPw.length; i++) if (s.includes(lowerPw.slice(i, i + 4))) return true; return false; })) {
    ent -= 12;
    warns.push("Ardışık harf/rakam veya klavye dizilimi (abcd, 1234, qwer) içeriyor.");
  }
  if (/(.)\1{2,}/.test(pw)) {
    ent -= 8;
    warns.push("Aynı karakter üç veya daha fazla kez tekrar ediyor.");
  }
  if (/(19|20)\d{2}/.test(pw)) {
    ent -= 6;
    warns.push("Yıl benzeri bir sayı içeriyor (doğum yılı gibi tahmin edilebilir).");
  }
  if (/^\d+$/.test(pw)) {
    ent = Math.min(ent, naive);
    warns.push("Yalnızca rakamlardan oluşuyor.");
  }
  if (/^[A-Za-zçğıöşüÇĞİÖŞÜ]+\d{1,4}[!@#$%.]?$/.test(pw)) {
    ent -= 8;
    warns.push("'Kelime + sayı (+ sembol)' kalıbı: saldırganların ilk denediği biçimlerden.");
  }
  ent = Math.max(0, ent);
  const level = ent < 28 ? 0 : ent < 40 ? 1 : ent < 60 ? 2 : ent < 80 ? 3 : 4;
  const labels = ["Çok zayıf", "Zayıf", "Orta", "Güçlü", "Çok güçlü"];
  const guesses = Math.pow(2, Math.max(0, ent - 1));
  const times = { online: guesses / 100, fast: guesses / 1e10, slow: guesses / 1e4 };
  const tips: string[] = [];
  if (len < 12) tips.push("En az 12–16 karakter kullan; uzunluk en etkili faktördür.");
  if (!upper || !lower) tips.push("Büyük ve küçük harfleri karıştır (ama asıl önemli olan uzunluk ve rastgelelik).");
  if (!digit) tips.push("Tahmin edilemeyen yerlere rakam ekle.");
  if (!symbol) tips.push("Sembol eklemek karakter havuzunu büyütür.");
  tips.push("Rastgele 4–5 kelimelik bir parola cümlesi veya parola yöneticisinin ürettiği rastgele parolayı tercih et.");
  tips.push("Bu parolayı başka hiçbir hesapta kullanma ve MFA'yı etkinleştir.");
  return { len, lower, upper, digit, symbol, pool, naive, ent, level, label: labels[level], warns, times, tips, common };
}

export function Lab12a() {
  return <Lab lessonId={12} index={0}>{(finish) => <Lab12aBody finish={finish} />}</Lab>;
}
function Lab12aBody({ finish }: { finish: () => void }) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(true);
  const [genLen, setGenLen] = useState(16);
  const a = analyzePassword(pw);
  const { flags, set } = useFlags(["weak", "strong"] as const, finish);
  useEffect(() => {
    if (!pw) return;
    if (a.level <= 1) set("weak");
    if (a.level >= 3 && pw.length >= 12) set("strong");
  }, [pw, a.level, set]);

  const generate = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*?-_";
    const r = crypto.getRandomValues(new Uint32Array(genLen));
    setPw(Array.from(r, (v) => chars[v % chars.length]).join(""));
  };
  const colors = ["bg-bad", "bg-[#d97a4a]", "bg-warn", "bg-accent", "bg-ok"];

  return (
    <div className="space-y-4">
      <Callout kind="danger" title="Gerçek parolanı yazma">
        Yalnızca örnek parolalar dene (ör. &quot;Merhaba123&quot;, &quot;qwerty&quot;). Analiz tamamen tarayıcında çalışır; parola hiçbir yere gönderilmez ve kaydedilmez.
      </Callout>
      <Checklist flags={flags} items={[["weak", "Zayıf bir örnek parola analiz et"], ["strong", "Güçlü (12+ karakter) bir parola oluştur"]]} />
      <Panel title="Örnek parolayı yaz" step="1">
        <Field label="Örnek parola">
          <div className="flex gap-2">
            <input type={show ? "text" : "password"} autoComplete="off" spellCheck={false} className={inputCls} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Örnek bir parola yaz…" />
            <Button variant="secondary" onClick={() => setShow((s) => !s)}>
              {show ? "Gizle" : "Göster"}
            </Button>
          </div>
        </Field>
        <div className="flex flex-wrap items-center gap-2">
          {["qwerty", "Merhaba123", "Kedi2010!", "mavi-kahve-tren-orman-87"].map((s) => (
            <Button key={s} variant="ghost" className="!px-2 !py-1 !text-xs" onClick={() => setPw(s)}>
              {s}
            </Button>
          ))}
          <span className="text-xs text-muted">← hazır örnekler</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-bg p-2">
          <span className="text-xs text-muted">Rastgele parola üret ({genLen} karakter):</span>
          <input type="range" min={8} max={32} value={genLen} onChange={(e) => setGenLen(Number(e.target.value))} className="accent-[#176B87]" />
          <Button variant="secondary" className="!px-3 !py-1 !text-xs" onClick={generate}>
            Üret (crypto.getRandomValues)
          </Button>
        </div>
      </Panel>
      {pw && (
        <Panel title="Analiz sonucu" step="2" tone="brand">
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <b className="text-ink">Tahmini güvenlik seviyesi: {a.label}</b>
              <span className="text-muted">≈ {Math.round(a.ent)} bit etkin entropi</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-line">
              <div className={cx("h-full transition-all", colors[a.level])} style={{ width: `${(a.level + 1) * 20}%` }} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <OutBox label="Uzunluk" value={`${a.len} karakter`} copy={false} mono={false} />
            <OutBox label="Karakter havuzu" value={`${a.pool} olası karakter`} copy={false} mono={false} />
            <OutBox label="Ham entropi (uzunluk × log₂ havuz)" value={`${a.naive.toFixed(1)} bit`} copy={false} mono={false} />
          </div>
          <div className="flex flex-wrap gap-2">
            {([["Küçük harf", a.lower], ["Büyük harf", a.upper], ["Rakam", a.digit], ["Sembol", a.symbol]] as [string, boolean][]).map(([l, ok]) => (
              <Pill key={l} tone={ok ? "ok" : "neutral"}>
                {ok ? "✓" : "○"} {l}
              </Pill>
            ))}
          </div>
          {a.warns.length > 0 && (
            <Callout kind="warn" title="Uyarılar">
              <ul className="list-disc space-y-1 pl-5">
                {a.warns.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </Callout>
          )}
          <div className="overflow-x-auto rounded-lg border border-line bg-white">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="bg-bg text-xs text-muted">
                <tr>
                  <th className="px-3 py-2">Saldırı türü (deneme hızı)</th>
                  <th className="px-3 py-2">Ortalama kırılma süresi</th>
                </tr>
              </thead>
              <tbody>
                {[["Çevrimiçi giriş denemesi (100/sn)", a.times.online], ["Çevrimdışı, yavaş KDF (Argon2/bcrypt, 10.000/sn)", a.times.slow], ["Çevrimdışı, hızlı hash (MD5/SHA-256, 10 milyar/sn)", a.times.fast]].map(([l, t]) => (
                  <tr key={l as string} className="border-t border-line">
                    <td className="px-3 py-2">{l as string}</td>
                    <td className="px-3 py-2 font-medium">{fmtTime(t as number)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted">Tahminler yaklaşıktır: yaygın kalıpları dikkate alan basit bir model kullanır ve gerçek saldırgan stratejilerinden daha iyimser/kötümser olabilir.</p>
          <div>
            <p className="mb-1 text-sm font-semibold text-ink">İyileştirme önerileri</p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-ink/90">
              {a.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </Panel>
      )}
    </div>
  );
}

/* ================= LAB 12b: MFA simülasyonu ================= */
type Acc = { user: string; pass: string; mfa: boolean };
const ACCOUNTS: Acc[] = [
  { user: "ayse", pass: "Demo-Parola-1", mfa: false },
  { user: "mehmet", pass: "Demo-Parola-2", mfa: true },
];

export function Lab12b() {
  return <Lab lessonId={12} index={1}>{(finish) => <Lab12bBody finish={finish} />}</Lab>;
}
function Lab12bBody({ finish }: { finish: () => void }) {
  const [secret, setSecret] = useState<Bytes | null>(null);
  const [code, setCode] = useState("");
  const [left, setLeft] = useState(30);
  const [user, setUser] = useState("mehmet");
  const [pass, setPass] = useState("");
  const [stage, setStage] = useState<"login" | "mfa" | "in">("login");
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const [att, setAtt] = useState<{ ayse?: string; mehmet?: string }>({});
  const { flags, set } = useFlags(["nomfa", "ok", "wrong", "attack"] as const, finish);

  useEffect(() => {
    setSecret(randomBytes(20));
  }, []);
  useEffect(() => {
    if (!secret) return;
    let alive = true;
    const tick = async () => {
      const now = Date.now();
      const c = await totp(secret, now);
      if (!alive) return;
      setCode(c);
      setLeft(30 - Math.floor((now / 1000) % 30));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [secret]);

  const acc = ACCOUNTS.find((a) => a.user === user)!;
  const locked = attempts >= 3;

  const login = () => {
    setMsg(null);
    if (pass !== acc.pass) return setMsg({ ok: false, t: "Kullanıcı adı veya parola hatalı." });
    if (!acc.mfa) {
      setStage("in");
      set("nomfa");
      return setMsg({ ok: true, t: "Giriş başarılı. Bu hesapta MFA kapalı: yalnızca parola yeterli oldu." });
    }
    setStage("mfa");
    setAttempts(0);
    setInput("");
    setMsg({ ok: true, t: "Parola doğru. İkinci adım: authenticator uygulamasındaki 6 haneli kodu gir." });
  };
  const verify = async () => {
    if (!secret || locked) return;
    const now = Date.now();
    const valid = [await totp(secret, now), await totp(secret, now - 30000)];
    if (valid.includes(input.trim())) {
      setStage("in");
      setMsg({ ok: true, t: "Tek kullanımlık kod doğru. Giriş başarılı." });
      set("ok");
    } else {
      const n = attempts + 1;
      setAttempts(n);
      set("wrong");
      setMsg({ ok: false, t: n >= 3 ? "3 yanlış deneme: hesap geçici olarak kilitlendi (oran sınırlama)." : `Kod hatalı (${n}/3). Kod her 30 saniyede değişir; güncel kodu gir.` });
    }
  };
  const attack = async (target: "ayse" | "mehmet") => {
    const a = ACCOUNTS.find((x) => x.user === target)!;
    if (!a.mfa) {
      setAtt((s) => ({ ...s, ayse: "Saldırgan çalıntı parolayı kullandı → GİRİŞ BAŞARILI. MFA olmadığı için hesap ele geçirildi." }));
    } else {
      const guesses = [0, 1, 2].map(() => String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, "0"));
      const now = Date.now();
      const ok = secret ? guesses.includes(await totp(secret, now)) : false;
      setAtt((s) => ({ ...s, mehmet: ok ? "Saldırgan çok şanslıydı (1/333.333 ihtimal)! Normalde bu olmaz; tekrar dene." : `Saldırgan parolayı biliyor ama 2. faktör (authenticator) elinde yok. 3 rastgele kod denedi (${guesses.join(", ")}) → GİRİŞ ENGELLENDİ ve hesap kilitlendi.` }));
    }
    set("attack");
  };

  return (
    <div className="space-y-4">
      <Callout kind="ok" title="Güvenli simülasyon">
        Demo hesapların parolaları sahte örneklerdir (aşağıda yazıyor). Gerçek bir parolanı yazma. Kodlar gerçek TOTP algoritması (RFC 6238: HMAC-SHA1, 30 sn, 6 hane) ile tarayıcında üretilir.
      </Callout>
      <Checklist flags={flags} items={[["nomfa", "MFA'sız hesaba gir"], ["ok", "MFA'lı hesaba doğru kodla gir"], ["wrong", "Yanlış kod dene"], ["attack", "Çalıntı parola saldırısını incele"]]} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Web sitesi: giriş formu" step="1">
          {stage === "in" ? (
            <div className="space-y-3">
              <div className="rounded-xl border border-ok/40 bg-[#E6F3EC] p-4 text-center">
                <p className="text-2xl">✅</p>
                <p className="font-semibold text-ok">{user} olarak giriş yapıldı</p>
              </div>
              <Button variant="secondary" onClick={() => { setStage("login"); setPass(""); setMsg(null); }}>
                Çıkış yap
              </Button>
            </div>
          ) : stage === "login" ? (
            <>
              <Field label="Hesap">
                <select className={inputCls} value={user} onChange={(e) => { setUser(e.target.value); setPass(""); setMsg(null); }}>
                  {ACCOUNTS.map((a) => (
                    <option key={a.user} value={a.user}>
                      {a.user} — MFA {a.mfa ? "AÇIK" : "KAPALI"}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Parola" hint={`Demo parola: ${acc.pass}`}>
                <input className={inputCls} value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Demo parolayı yaz" autoComplete="off" />
              </Field>
              <div className="flex gap-2">
                <Button onClick={login}>Giriş yap</Button>
                <Button variant="secondary" onClick={() => setPass("yanlis-parola")}>
                  Yanlış parola
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-ink">2. adım: Doğrulama kodu</p>
              <Field label="6 haneli kod" hint="Sağdaki authenticator uygulamasındaki kodu gir.">
                <input className={cx(inputCls, "text-center text-xl tracking-[0.4em]")} inputMode="numeric" maxLength={6} value={input} onChange={(e) => setInput(e.target.value.replace(/\D/g, ""))} disabled={locked} />
              </Field>
              <div className="flex flex-wrap gap-2">
                <Button onClick={verify} disabled={locked || input.length !== 6}>
                  Doğrula
                </Button>
                <Button variant="secondary" onClick={() => setInput(code === "000000" ? "123456" : String((Number(code) + 1) % 1000000).padStart(6, "0"))} disabled={locked}>
                  Yanlış kod yaz
                </Button>
                <Button variant="ghost" onClick={() => { setStage("login"); setMsg(null); setAttempts(0); }}>
                  Vazgeç
                </Button>
              </div>
            </>
          )}
          {msg && <p className={cx("fadeup rounded-lg border p-2 text-sm", msg.ok ? "border-ok/40 bg-[#E6F3EC] text-ok" : "border-bad/40 bg-[#F9E8E8] text-bad")}>{msg.t}</p>}
        </Panel>
        <Panel title={`Telefon: Authenticator uygulaması (${ACCOUNTS[1].user} hesabı)`} step="2" tone="brand">
          <div className="rounded-2xl border border-line bg-white p-4 text-center">
            <p className="text-xs text-muted">AG Lab · mehmet</p>
            <p className="my-2 font-mono text-4xl font-semibold tracking-[0.2em] text-brand">{code ? `${code.slice(0, 3)} ${code.slice(3)}` : "··· ···"}</p>
            <div className="mx-auto h-2 w-48 overflow-hidden rounded-full bg-line">
              <div className={cx("h-full transition-all duration-1000", left <= 5 ? "bg-bad" : "bg-accent")} style={{ width: `${(left / 30) * 100}%` }} />
            </div>
            <p className="mt-1 text-xs text-muted">{left} sn sonra yenilenir</p>
          </div>
          <OutBox label="Paylaşılan sır (kayıt sırasında QR ile bir kez aktarılır)" badge="GİZLİ" value={secret ? base32Encode(secret) : ""} tone="warn" />
          <p className="text-xs text-muted">Kod = HMAC-SHA1(sır, zaman/30 sn) → 6 hane. Sunucu aynı sırrı bildiği için aynı kodu hesaplayıp karşılaştırır. Kod tek seferliktir ve kısa sürede geçersiz olur.</p>
        </Panel>
      </div>
      <Panel title="Saldırgan senaryosu: parola çalındı" step="3" tone="danger">
        <p className="text-sm text-ink/80">Bir veri sızıntısında iki hesabın da parolasının çalındığını varsay. Saldırgan parolayı biliyor ama kullanıcının telefonuna erişemiyor.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {(["ayse", "mehmet"] as const).map((t) => (
            <div key={t} className="space-y-2 rounded-lg border border-line bg-white p-3">
              <p className="text-sm font-semibold">{t} <Pill tone={t === "mehmet" ? "ok" : "bad"}>MFA {t === "mehmet" ? "açık" : "kapalı"}</Pill></p>
              <Button variant="danger" onClick={() => attack(t)}>
                Çalıntı parola ile saldır
              </Button>
              {att[t] && <p className={cx("fadeup rounded-md p-2 text-xs", t === "ayse" ? "bg-[#F9E8E8] text-bad" : "bg-[#E6F3EC] text-ok")}>{att[t]}</p>}
            </div>
          ))}
        </div>
        <Callout kind="warn" title="MFA kusursuz değildir">
          TOTP kodu, gerçek zamanlı çalışan phishing sitelerine kandırılarak girilirse çalınabilir. Alan adına bağlı çalışan FIDO2/passkey yöntemleri phishing&apos;e karşı dayanıklıdır.
        </Callout>
      </Panel>
    </div>
  );
}

void concat;
