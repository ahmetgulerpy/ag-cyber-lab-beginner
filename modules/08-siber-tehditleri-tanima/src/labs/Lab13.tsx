"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Badge, Btn, Card, Choice, Feedback, InfoBox, LabPanel, Tabs } from "@/components/ui";
import type { LabProps } from "./types";

type Key = "sqli" | "xss" | "csrf" | "trav" | "list";

/* ================= SQL Injection ================= */
const USERS = [{ u: "admin", p: "AdminDemo!" }, { u: "ayse", p: "Demo123" }];
const orTrue = /'\s*or\s+'?1'?\s*=\s*'?1|'\s*or\s+'a'\s*=\s*'a/i;

function Sqli({ mark }: { mark: (k: string) => void }) {
  const [u, setU] = useState("ayse");
  const [p, setP] = useState("Demo123");
  const [mode, setMode] = useState<"unsafe" | "safe">("unsafe");
  const [res, setRes] = useState<{ tone: "ok" | "bad" | "warn"; title: string; text: string } | null>(null);

  const run = () => {
    const injected = u.includes("'") || p.includes("'");
    if (mode === "safe") {
      const ok = USERS.some((x) => x.u === u && x.p === p);
      setRes(ok ? { tone: "ok", title: "Giriş başarılı (meşru)", text: "Kullanıcı adı ve parola doğru. Parametreli sorgu normal girişleri etkilemez." } : { tone: "ok", title: "Giriş reddedildi", text: injected ? "Girdideki tırnak ve SQL ifadeleri VERİ olarak ele alındı; sorgunun mantığı değişmedi. Böyle bir kullanıcı/parola yok → giriş başarısız." : "Kullanıcı adı veya parola hatalı." });
      if (injected) mark("sqli-safe");
      return;
    }
    // güvensiz
    if (/'\s*(--|#)/.test(u)) {
      const name = u.split("'")[0];
      const found = USERS.find((x) => x.u === name);
      if (found) { setRes({ tone: "bad", title: `⚠ Parola kontrolü atlandı! ${found.u} olarak girildi`, text: "‘--’ işareti sorgunun geri kalanını (parola kontrolünü) yorum satırına çevirdi. Saldırgan parolayı bilmeden giriş yaptı." }); mark("sqli-bypass"); }
      else setRes({ tone: "warn", title: "Sorgu çalıştı ama satır dönmedi", text: "Yorum işareti sorguyu değiştirdi fakat bu kullanıcı yok. Girdi sorgunun yapısını değiştirebildiği için sistem zaten savunmasız." });
      return;
    }
    if (orTrue.test(u) || orTrue.test(p)) {
      setRes({ tone: "bad", title: "⚠ Tüm satırlar döndü – ilk kullanıcı (admin) olarak girildi", text: "‘OR 1=1’ koşulu her zaman doğru olduğundan WHERE filtresi anlamını yitirdi. Güvensiz sorgu kurma biçimi bu zafiyetin nedenidir." });
      mark("sqli-bypass");
      return;
    }
    if (injected) { setRes({ tone: "warn", title: "SQL sözdizimi hatası", text: "Girdideki tek tırnak sorguyu bozdu. Sorgunun kullanıcı girdisiyle değiştirilebilmesi, saldırgan için bir sinyaldir (hata mesajları ayrıca bilgi sızdırabilir)." }); return; }
    const ok = USERS.some((x) => x.u === u && x.p === p);
    setRes(ok ? { tone: "ok", title: "Giriş başarılı (meşru)", text: "Normal kullanıcı girişi çalışıyor." } : { tone: "ok", title: "Giriş reddedildi", text: "Kullanıcı adı veya parola hatalı." });
  };

  const q: ReactNode = mode === "unsafe"
    ? <>SELECT * FROM users WHERE username = &apos;<mark className="rounded bg-bad/30 px-0.5">{u}</mark>&apos; AND password = &apos;<mark className="rounded bg-bad/30 px-0.5">{p}</mark>&apos;</>
    : <>SELECT * FROM users WHERE username = <mark className="rounded bg-ok/30 px-0.5">?</mark> AND password_hash = <mark className="rounded bg-ok/30 px-0.5">?</mark><br /><span className="text-muted">parametreler: [&quot;{u}&quot;, &quot;{p}&quot;] → veri olarak gönderilir</span></>;

  return (
    <div className="space-y-3">
      <InfoBox tone="brand" icon="🎯" title="Görev">Güvensiz modda ‘Saldırı örneği’ girdilerinden birini dene, ardından güvenli moda geçip aynı girdiyi tekrar dene. (Sahte, bellek içi kullanıcı tablosu: admin, ayse.)</InfoBox>
      <div className="flex gap-2">
        <Btn size="sm" variant={mode === "unsafe" ? "danger" : "secondary"} onClick={() => { setMode("unsafe"); setRes(null); }}>❌ Güvensiz (metin birleştirme)</Btn>
        <Btn size="sm" variant={mode === "safe" ? "primary" : "secondary"} onClick={() => { setMode("safe"); setRes(null); }}>✅ Güvenli (parametreli)</Btn>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <p className="text-sm font-bold">🔐 Sahte giriş ekranı</p>
          <label className="mt-2 block text-xs font-semibold text-muted">Kullanıcı adı<input value={u} onChange={(e) => setU(e.target.value.slice(0, 60))} className="mt-1 w-full rounded-lg border border-line bg-page px-3 py-2 font-mono text-sm text-ink" /></label>
          <label className="mt-2 block text-xs font-semibold text-muted">Parola<input value={p} onChange={(e) => setP(e.target.value.slice(0, 60))} className="mt-1 w-full rounded-lg border border-line bg-page px-3 py-2 font-mono text-sm text-ink" /></label>
          <div className="mt-3 flex flex-wrap gap-2">
            <Btn onClick={run}>Giriş yap</Btn>
            <Btn size="sm" variant="ghost" onClick={() => { setU("ayse"); setP("Demo123"); setRes(null); }}>Normal giriş</Btn>
            <Btn size="sm" variant="secondary" onClick={() => { setU("admin' --"); setP("x"); setRes(null); }}>Örnek: admin&apos; --</Btn>
            <Btn size="sm" variant="secondary" onClick={() => { setU("x"); setP("' OR '1'='1"); setRes(null); }}>Örnek: &apos; OR &apos;1&apos;=&apos;1</Btn>
          </div>
        </Card>
        <Card className="bg-[#101c26]">
          <p className="text-xs font-bold uppercase text-[#8fe0e1]">Sunucuda oluşan sorgu (simülasyon)</p>
          <p className="mt-2 break-all rounded-lg bg-black/30 p-3 font-mono text-xs leading-relaxed text-[#cfe3ec]">{q}</p>
          <p className="mt-2 text-[11px] text-white/60">Kırmızı vurgu: kullanıcının kontrol ettiği kısım. Güvensiz modda bu kısım SQL kodunun parçası olabilir.</p>
        </Card>
      </div>
      {res && <Feedback ok={res.tone === "ok" ? true : res.tone === "warn" ? null : false} title={res.title}>{res.text}</Feedback>}
    </div>
  );
}

/* ================= XSS ================= */
function pseudoRender(src: string): { nodes: ReactNode[]; danger: string[]; code: string[] } {
  const parts = src.split(/(<\/?[a-zA-Z][^>]*>)/g);
  const nodes: ReactNode[] = [];
  const danger: string[] = [];
  const code: string[] = [];
  let b = 0, i = 0, u = 0, inScript = false;
  parts.forEach((part, idx) => {
    if (!part) return;
    const m = /^<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*)>$/.exec(part);
    if (m) {
      const closing = m[1] === "/";
      const tag = m[2].toLowerCase();
      if (tag === "b" || tag === "strong") b += closing ? -1 : 1;
      else if (tag === "i" || tag === "em") i += closing ? -1 : 1;
      else if (tag === "u") u += closing ? -1 : 1;
      else if (tag === "script") {
        inScript = !closing;
        if (!closing) danger.push("<script> etiketi");
      } else {
        const handler = /on\w+\s*=/i.test(m[3]);
        if (handler) danger.push(`<${tag}> üzerinde olay işleyici (onerror/onclick…)`);
        else if (/javascript:/i.test(m[3])) danger.push(`<${tag}> içinde javascript: adresi`);
        nodes.push(<span key={idx} className="mx-0.5 rounded bg-warn/20 px-1 font-mono text-[10px]">[{tag} öğesi]</span>);
      }
    } else if (inScript) {
      code.push(part);
    } else {
      nodes.push(<span key={idx} className={`${b > 0 ? "font-bold" : ""} ${i > 0 ? "italic" : ""} ${u > 0 ? "underline" : ""}`}>{part}</span>);
    }
  });
  return { nodes, danger, code };
}
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

function Xss({ mark }: { mark: (k: string) => void }) {
  const [txt, setTxt] = useState("<b>Merhaba</b> dünya!");
  const [shown, setShown] = useState(false);
  const r = pseudoRender(txt);
  const risky = r.danger.length > 0;
  const post = () => {
    setShown(true);
    if (risky) mark("xss");
  };
  const PRE = ["<b>Güzel yazı!</b>", "<script>alert('XSS')</script>Merhaba", "<img src=x onerror=alert(1)>Foto", "Normal bir yorum :)"];
  return (
    <div className="space-y-3">
      <InfoBox tone="brand" icon="🎯" title="Görev">Aşağıdaki ‘yorum kutusuna’ riskli bir örnek yorum gönder ve iki farklı çıktı yöntemini karşılaştır. (Hiçbir kod çalıştırılmaz; ‘güvensiz’ taraf sadece tarayıcının ne yapacağını canlandırır.)</InfoBox>
      <div className="flex flex-wrap gap-2">
        {PRE.map((p) => <Btn key={p} size="sm" variant="secondary" onClick={() => { setTxt(p); setShown(false); }}>{p.length > 26 ? `${p.slice(0, 26)}…` : p}</Btn>)}
      </div>
      <textarea value={txt} onChange={(e) => { setTxt(e.target.value.slice(0, 200)); setShown(false); }} rows={3} aria-label="Yorum" className="w-full rounded-xl border border-line bg-white p-3 font-mono text-sm outline-none focus:border-accent" />
      <Btn onClick={post}>💬 Yorumu gönder</Btn>
      {shown && (
        <div className="ag-fade grid gap-3 md:grid-cols-2">
          <Card className="border-bad/40">
            <Badge tone="bad">❌ Güvensiz: HTML olarak yorumlanır</Badge>
            <div className="mt-2 min-h-[3rem] rounded-lg bg-page p-3 text-sm">{r.nodes.length ? r.nodes : <span className="text-muted">(görünür içerik yok)</span>}</div>
            {risky ? (
              <div className="mt-2 rounded-lg border border-bad/40 bg-bad/10 p-2.5 text-xs" role="alert">
                <p className="font-bold">⚠ SİMÜLASYON: Gerçek bir sayfada tarayıcı bunu kod olarak çalıştırırdı.</p>
                <ul className="mt-1 list-disc pl-4">{r.danger.map((d, i) => <li key={i}>{d}</li>)}</ul>
                {r.code.length > 0 && <p className="mt-1 font-mono">Çalışacak kod (çalıştırılmadı): {r.code.join(" ")}</p>}
                <p className="mt-1">Sonuç: sayfayı açan her kullanıcıda saldırganın kodu çalışır (oturum çerezi çalma, sayfayı değiştirme…).</p>
              </div>
            ) : <p className="mt-2 text-xs text-muted">Bu girdi zararsız biçimlendirme içeriyor; ama aynı yöntem zararlı girdiye de izin verir.</p>}
          </Card>
          <Card className="border-ok/40">
            <Badge tone="ok">✅ Güvenli: çıktı kodlama (encoding) ile metin olarak</Badge>
            <div className="mt-2 min-h-[3rem] whitespace-pre-wrap break-all rounded-lg bg-page p-3 text-sm">{txt}</div>
            <p className="mt-2 text-xs font-semibold text-muted">Tarayıcıya gönderilen kodlanmış çıktı:</p>
            <p className="break-all rounded-lg bg-[#101c26] p-2 font-mono text-[11px] text-[#cfe3ec]">{esc(txt)}</p>
            <p className="mt-2 text-xs">Özel karakterler (&lt; &gt; &quot;) kodlandığı için girdi <b>kod değil metin</b> olarak gösterilir.</p>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ================= CSRF ================= */
type SS = "None" | "Lax" | "Strict";
function Csrf({ mark }: { mark: (k: string) => void }) {
  const [token, setToken] = useState(false);
  const [ss, setSs] = useState<SS>("None");
  const [bal, setBal] = useState(5000);
  const [log, setLog] = useState<{ t: string; tone: "ok" | "bad" | "muted" }[]>([]);
  const add = (t: string, tone: "ok" | "bad" | "muted") => setLog((l) => [{ t, tone }, ...l].slice(0, 8));

  const legit = () => {
    setBal((b) => b - 200);
    add(`POST bank.example/transfer (aynı site) çerez ✓${token ? " token ✓" : ""} → 200 OK: 200 TL gönderildi (meşru işlem)`, "ok");
  };
  const attack = () => {
    add("Ayşe ‘Ücretsiz hediye’ sayfasını açtı → gizli form bank.example/transfer adresine POST gönderiyor (siteler arası istek)", "muted");
    const cookie = ss === "None";
    if (!cookie) { add(`Tarayıcı oturum çerezini GÖNDERMEDİ (SameSite=${ss}) → 401 Yetkisiz: işlem reddedildi`, "ok"); mark("csrf-blocked"); return; }
    if (token) { add("Çerez gönderildi ama istekte geçerli CSRF token yok → 403 Yasak: işlem reddedildi", "ok"); mark("csrf-blocked"); return; }
    setBal((b) => b - 1500);
    add("Çerez gönderildi, doğrulama yok → 200 OK: 1.500 TL saldırganın hesabına gönderildi ⚠", "bad");
    mark("csrf-hit");
  };

  return (
    <div className="space-y-3">
      <InfoBox tone="brand" icon="🎯" title="Görev">Önce korumasız ayarla (token kapalı, SameSite=None) zararlı sayfayı ziyaret et. Sonra token veya SameSite aç ve tekrar dene.</InfoBox>
      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <p className="font-bold">🏦 Sanal banka (Ayşe oturum açtı)</p>
          <p className="mt-1 text-2xl font-extrabold text-brand">{bal.toLocaleString("tr-TR")} TL</p>
          <div className="mt-3 space-y-2 text-sm">
            <label className="flex items-center justify-between gap-2 rounded-lg border border-line px-3 py-2">CSRF token doğrulaması
              <input type="checkbox" className="h-4 w-4 accent-[#176B87]" checked={token} onChange={(e) => setToken(e.target.checked)} />
            </label>
            <label className="flex items-center justify-between gap-2 rounded-lg border border-line px-3 py-2">Oturum çerezi SameSite
              <select value={ss} onChange={(e) => setSs(e.target.value as SS)} className="rounded border border-line bg-white px-2 py-1" aria-label="SameSite">
                <option>None</option><option>Lax</option><option>Strict</option>
              </select>
            </label>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Btn size="sm" variant="secondary" onClick={legit}>Kendi transferimi yap (200 TL)</Btn>
            <Btn size="sm" variant="danger" onClick={attack}>☠ Zararlı sayfayı ziyaret et</Btn>
            <Btn size="sm" variant="ghost" onClick={() => { setBal(5000); setLog([]); }}>Sıfırla</Btn>
          </div>
        </Card>
        <Card>
          <p className="font-bold">📜 İstek günlüğü</p>
          {log.length === 0 ? <p className="mt-2 text-sm text-muted">Henüz istek yok.</p> : (
            <ul className="mt-2 space-y-1.5 text-xs">
              {log.map((l, i) => <li key={i} className={`rounded-lg border px-2.5 py-2 ${l.tone === "ok" ? "border-ok/30 bg-ok/10" : l.tone === "bad" ? "border-bad/40 bg-bad/10" : "border-line bg-page"}`}>{l.t}</li>)}
            </ul>
          )}
        </Card>
      </div>
      <InfoBox tone="muted" icon="💡">CSRF’te saldırgan şifreni çalmaz; tarayıcının çerezi otomatik göndermesinden faydalanır. <b>Token</b> isteğin gerçekten uygulamadan geldiğini kanıtlar, <b>SameSite</b> ise çerezin siteler arası isteklerde gönderilmesini sınırlar.</InfoBox>
    </div>
  );
}

/* ================= Directory Traversal ================= */
const BASE = ["var", "app", "public"];
const FS: Record<string, string> = {
  "/var/app/public/logo.png": "[logo görseli verisi]",
  "/var/app/public/rapor.pdf": "[rapor PDF içeriği]",
  "/var/app/public/notlar.txt": "Ders notları (herkese açık içerik).",
  "/var/app/config/db.env": "DB_USER=demo\nDB_PASS=ornek-parola   (SENTETİK – gerçek değil)",
  "/etc/passwd": "root:x:0:0:root:/root:/bin/sh\n(SENTETİK ÖRNEK – gerçek dosya değil)",
};
function resolvePath(input: string) {
  let dec = input;
  try { dec = decodeURIComponent(input); } catch { /* yoksay */ }
  const segs = [...BASE];
  dec.replace(/\\/g, "/").split("/").forEach((s) => {
    if (s === "" || s === ".") return;
    if (s === "..") segs.pop();
    else segs.push(s);
  });
  return "/" + segs.join("/");
}

function Traversal({ mark }: { mark: (k: string) => void }) {
  const [inp, setInp] = useState("notlar.txt");
  const [prot, setProt] = useState(false);
  const [res, setRes] = useState<{ path: string; status: "ok" | "leak" | "blocked" | "404"; body: string } | null>(null);
  const run = () => {
    const path = resolvePath(inp);
    const inside = path.startsWith("/var/app/public/");
    const exists = path in FS;
    if (prot && !inside) { setRes({ path, status: "blocked", body: "403 – Çözümlenen yol izin verilen klasörün dışında; istek reddedildi." }); mark("trav-blocked"); return; }
    if (!exists) { setRes({ path, status: "404", body: "404 – Dosya bulunamadı." }); return; }
    if (!inside) { setRes({ path, status: "leak", body: FS[path] }); mark("trav-leak"); return; }
    setRes({ path, status: "ok", body: FS[path] });
  };
  const PRE = ["notlar.txt", "../config/db.env", "../../../../etc/passwd", "..%2f..%2fconfig%2fdb.env"];
  return (
    <div className="space-y-3">
      <InfoBox tone="brand" icon="🎯" title="Görev">Korumasızken ‘../’ içeren bir yol dene ve izinsiz alanın okunduğunu gör. Sonra korumayı aç ve tekrar dene. (Sanal dosya sistemi; gerçek dosyalara erişilmez.)</InfoBox>
      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <p className="font-bold">🗂 Sanal dosya sistemi</p>
          <pre className="mt-2 overflow-auto rounded-lg bg-page p-3 font-mono text-xs leading-relaxed">{`/var/app/
├─ public/        ← web'e açık klasör
│  ├─ logo.png
│  ├─ rapor.pdf
│  └─ notlar.txt
└─ config/
   └─ db.env      ← GİZLİ
/etc/passwd       ← sistem dosyası`}</pre>
        </Card>
        <Card>
          <p className="font-bold">GET /dosya?ad=<span className="text-brand">…</span></p>
          <input value={inp} onChange={(e) => setInp(e.target.value.slice(0, 80))} className="mt-2 w-full rounded-lg border border-line bg-page px-3 py-2 font-mono text-sm" aria-label="Dosya yolu" />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {PRE.map((p) => <Btn key={p} size="sm" variant="secondary" onClick={() => setInp(p)}>{p.length > 18 ? `${p.slice(0, 18)}…` : p}</Btn>)}
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" className="accent-[#176B87]" checked={prot} onChange={(e) => setProt(e.target.checked)} /> Koruma: yolu normalleştir ve izinli klasör içinde kalmasını zorunlu kıl</label>
          <Btn className="mt-3" onClick={run}>İsteği gönder</Btn>
        </Card>
      </div>
      {res && (
        <Card className="ag-fade">
          <p className="text-xs text-muted">Girilen: <span className="font-mono">{inp}</span> → Çözümlenen yol: <span className="font-mono font-bold">{res.path}</span></p>
          <pre className={`mt-2 whitespace-pre-wrap rounded-lg p-3 font-mono text-xs ${res.status === "leak" ? "bg-bad/10" : res.status === "blocked" ? "bg-ok/10" : "bg-page"}`}>{res.body}</pre>
          {res.status === "leak" && <div className="mt-2"><Feedback ok={false} title="İzinsiz dosya okundu!">‘../’ ile izin verilen klasörün dışına çıkıldı. Savunma: yolu normalleştir, izinli klasör sınırını kontrol et, mümkünse dosya adı için izin listesi kullan.</Feedback></div>}
          {res.status === "blocked" && <div className="mt-2"><Feedback ok title="Saldırı engellendi">Yol çözümlendikten SONRA kontrol edildiği için kodlanmış (%2f) denemeler de yakalandı.</Feedback></div>}
        </Card>
      )}
    </div>
  );
}

/* ================= Güvenlik kontrol listesi ================= */
const CTRL = [
  { id: "hsts", t: "HSTS (Strict-Transport-Security)", missing: true, why: "Yanıt başlıklarında Strict-Transport-Security yok." },
  { id: "csp", t: "Content-Security-Policy (CSP)", missing: true, why: "CSP başlığı yok; XSS etkisini sınırlayan katman eksik." },
  { id: "nosniff", t: "X-Content-Type-Options: nosniff", missing: false, why: "Başlık mevcut." },
  { id: "xfo", t: "X-Frame-Options / frame-ancestors", missing: true, why: "Sayfa başka sitelerde çerçevelenebilir (clickjacking riski)." },
  { id: "secure", t: "Çerez ‘Secure’ bayrağı", missing: false, why: "Set-Cookie içinde Secure var." },
  { id: "httponly", t: "Çerez ‘HttpOnly’ bayrağı", missing: true, why: "Set-Cookie’de HttpOnly yok; XSS ile çerez okunabilir." },
  { id: "samesite", t: "Çerez ‘SameSite’ özelliği", missing: true, why: "SameSite tanımlı değil; CSRF riski artar." },
  { id: "csrf", t: "CSRF token", missing: true, why: "Form içinde gizli token alanı yok." },
  { id: "param", t: "Parametreli sorgu", missing: true, why: "Kod örneğinde sorgu metin birleştirmeyle kuruluyor (SQL Injection riski)." },
  { id: "valid", t: "Girdi doğrulama", missing: false, why: "Kod, tür ve uzunluğu sunucuda doğruluyor." },
  { id: "encode", t: "Çıktı kodlama (otomatik escape)", missing: false, why: "Şablon motoru çıktıyı otomatik kodluyor." },
  { id: "rate", t: "Giriş için Rate Limiting", missing: true, why: "Yapılandırmada rate_limit: kapalı." },
];

function Checklist({ mark }: { mark: (k: string) => void }) {
  const [miss, setMiss] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const truth = CTRL.filter((c) => c.missing).map((c) => c.id);
  const right = CTRL.filter((c) => miss.includes(c.id) === c.missing).length;
  return (
    <div className="space-y-3">
      <InfoBox tone="brand" icon="🎯" title="Görev">‘okulportal.example’ uygulamasının yapılandırmasını incele. <b>Eksik</b> olduğunu düşündüğün kontrolleri işaretle ve değerlendir.</InfoBox>
      <div className="grid gap-3 lg:grid-cols-2">
        <Card className="bg-[#101c26]">
          <p className="text-xs font-bold uppercase text-[#8fe0e1]">Uygulama çıktıları (sentetik)</p>
          <pre className="mt-2 overflow-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-[#cfe3ec]">{`HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
X-Content-Type-Options: nosniff
Set-Cookie: session=a91f...; Secure; Path=/

<form method="post" action="/login">
  <input name="user"> <input name="pass" type="password">
  <button>Giriş</button>
</form>

# sunucu kodu (özet)
username = validate(req.user, max=30, type=text)
db.query("SELECT * FROM users WHERE name='" + username + "'")
render(template, autoescape=on)

# yapılandırma
rate_limit: off
mfa: optional`}</pre>
        </Card>
        <Card>
          <p className="text-sm font-bold">Hangi kontroller EKSİK?</p>
          <div className="mt-2 space-y-1.5">
            {CTRL.map((c) => {
              const s = miss.includes(c.id);
              const st = !done ? "idle" : s === c.missing ? "correct" : "wrong";
              return (
                <Choice key={c.id} selected={s} disabled={done} state={st} onClick={() => setMiss(s ? miss.filter((x) => x !== c.id) : [...miss, c.id])}>
                  <span className="flex items-center justify-between gap-2"><span>{s ? "🚩 Eksik: " : ""}{c.t}</span></span>
                  {done && <span className="mt-0.5 block text-xs text-muted">{c.missing ? "EKSİK – " : "VAR – "}{c.why}</span>}
                </Choice>
              );
            })}
          </div>
          {!done ? <Btn className="mt-3" onClick={() => { setDone(true); mark("list"); }}>Değerlendir</Btn> : (
            <div className="mt-3 space-y-2">
              <Feedback ok={right >= 10 ? true : null} title={`${right}/${CTRL.length} kontrol doğru değerlendirildi`}>Gerçekte eksik kontrol sayısı: {truth.length}. Savunma katmanlıdır: bir katman eksik olsa da diğerleri riski azaltır, ama eksikler kapatılmalıdır.</Feedback>
              <Btn size="sm" variant="ghost" onClick={() => { setDone(false); setMiss([]); }}>Tekrar dene</Btn>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function Lab13({ onComplete, done }: LabProps) {
  const [tab, setTab] = useState<Key>("sqli");
  const [marks, setMarks] = useState<string[]>([]);
  const mark = (k: string) => setMarks((m) => (m.includes(k) ? m : [...m, k]));
  const has = (k: string) => marks.includes(k);

  const ok: Record<Key, boolean> = {
    sqli: has("sqli-bypass") && has("sqli-safe"),
    xss: has("xss"),
    csrf: has("csrf-hit") && has("csrf-blocked"),
    trav: has("trav-leak") && has("trav-blocked"),
    list: has("list"),
  };
  const finished = Object.values(ok).every(Boolean);
  useEffect(() => {
    if (finished) onComplete();
  }, [finished, onComplete]);

  return (
    <LabPanel title="Laboratuvar 13 – Web Security Lab" intro="Güvenli ve izole bir ortamda dört temel web saldırısının mantığını karşılaştır ve bir güvenlik kontrol listesi değerlendir. Tüm uygulamalar sentetik ve tarayıcı içindedir." done={done}>
      <Tabs variant="pill" value={tab} onChange={setTab} tabs={[
        { id: "sqli", label: "💉 SQL Injection", badge: ok.sqli ? "✓" : "" },
        { id: "xss", label: "📜 XSS", badge: ok.xss ? "✓" : "" },
        { id: "csrf", label: "🎟 CSRF", badge: ok.csrf ? "✓" : "" },
        { id: "trav", label: "📁 Directory Traversal", badge: ok.trav ? "✓" : "" },
        { id: "list", label: "✅ Kontrol listesi", badge: ok.list ? "✓" : "" },
      ]} />
      <div className="ag-fade" key={tab}>
        {tab === "sqli" && <Sqli mark={mark} />}
        {tab === "xss" && <Xss mark={mark} />}
        {tab === "csrf" && <Csrf mark={mark} />}
        {tab === "trav" && <Traversal mark={mark} />}
        {tab === "list" && <Checklist mark={mark} />}
      </div>
      <Card className="bg-soft text-sm">
        <b>İlerleme:</b> {(Object.keys(ok) as Key[]).map((k) => `${k.toUpperCase()} ${ok[k] ? "✓" : "…"}`).join(" • ")}
      </Card>
    </LabPanel>
  );
}
