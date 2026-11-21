"use client";

import { useState } from "react";
import { Btn, Callout, LabBox } from "@/components/ui";
import { markLab } from "@/lib/storage";

type Res = { code: number; text: string; headers: string[]; body: string; why: string };

const PATHS: { path: string; label: string }[] = [
  { path: "/index.html", label: "/index.html (ana sayfa)" },
  { path: "/eski-sayfa", label: "/eski-sayfa (taşınmış)" },
  { path: "/panel", label: "/panel (giriş gerektirir)" },
  { path: "/admin", label: "/admin (yönetici alanı)" },
  { path: "/yok", label: "/yok (olmayan sayfa)" },
  { path: "/hata-uret", label: "/hata-uret (sunucu hatası)" },
  { path: "/login", label: "/login (giriş)" },
];

function respond(method: string, path: string, user: string, pass: string): Res {
  if (method === "POST") {
    if (path !== "/login") return { code: 400, text: "Bad Request", headers: ["Content-Type: text/plain"], body: "Bu adres POST isteğini kabul etmiyor.", why: "İstemci, sunucunun anlamadığı/kabul etmediği bir istek gönderdi. 4xx = istemci hatası." };
    if (!user || !pass) return { code: 400, text: "Bad Request", headers: ["Content-Type: text/plain"], body: "Kullanıcı adı ve şifre zorunludur.", why: "İstek eksik veri içerdiği için sunucu işleyemedi." };
    if (user === "ali" && pass === "1234") return { code: 200, text: "OK", headers: ["Content-Type: text/html", "Set-Cookie: oturum=abc123; HttpOnly"], body: "<h1>Hoş geldin Ali</h1>", why: "Bilgiler doğru; sunucu oturum çerezi verdi." };
    return { code: 401, text: "Unauthorized", headers: ["WWW-Authenticate: Form"], body: "Kullanıcı adı veya şifre hatalı.", why: "Kimlik doğrulama başarısız. Doğru bilgiler: ali / 1234 (örnek)." };
  }
  switch (path) {
    case "/index.html": return { code: 200, text: "OK", headers: ["Content-Type: text/html", "Content-Length: 1256"], body: "<html><h1>AG Cyber Lab</h1></html>", why: "İstek başarıyla işlendi ve içerik gönderildi." };
    case "/eski-sayfa": return { code: 301, text: "Moved Permanently", headers: ["Location: /index.html"], body: "", why: "Kaynak kalıcı olarak taşındı; tarayıcı Location başlığındaki yeni adrese otomatik gider." };
    case "/panel": return { code: 401, text: "Unauthorized", headers: ["WWW-Authenticate: Basic realm='panel'"], body: "Giriş yapmalısın.", why: "Bu kaynak için kimlik doğrulaması gerekir; kimlik bilgisi gönderilmedi." };
    case "/admin": return { code: 403, text: "Forbidden", headers: ["Content-Type: text/plain"], body: "Erişim yetkiniz yok.", why: "Sunucu kim olduğunu biliyor ama bu kaynağa erişim yetkin yok." };
    case "/yok": return { code: 404, text: "Not Found", headers: ["Content-Type: text/html"], body: "<h1>Sayfa bulunamadı</h1>", why: "İstenen kaynak sunucuda yok. Adres yanlış yazılmış ya da sayfa silinmiş olabilir." };
    case "/hata-uret": return { code: 500, text: "Internal Server Error", headers: ["Content-Type: text/plain"], body: "Beklenmeyen bir hata oluştu.", why: "Hata sunucu tarafındadır (yazılım hatası, çöken servis). İstemci bunu düzeltemez; sunucu yöneticisi loglara bakmalı." };
    default: return { code: 200, text: "OK", headers: ["Content-Type: text/html"], body: "<form method='POST'>…</form>", why: "Giriş formu gösterildi. Bilgileri göndermek için POST kullanılır." };
  }
}

const CODES = [
  { code: 200, name: "OK", group: "2xx Başarı", m: "GET", p: "/index.html", desc: "İstek başarılı. Sunucu istenen içeriği gönderdi.", fix: "Bir işlem gerekmez." },
  { code: 301, name: "Moved Permanently", group: "3xx Yönlendirme", m: "GET", p: "/eski-sayfa", desc: "Kaynak kalıcı olarak başka adrese taşındı.", fix: "Location başlığındaki yeni adrese git; bağlantıları güncelle." },
  { code: 400, name: "Bad Request", group: "4xx İstemci hatası", m: "POST", p: "/login", desc: "İstek hatalı veya eksik biçimlendirilmiş (örneğin boş form).", fix: "İsteğin biçimini ve zorunlu alanlarını düzelt." },
  { code: 401, name: "Unauthorized", group: "4xx İstemci hatası", m: "GET", p: "/panel", desc: "Kimlik doğrulama gerekli veya başarısız.", fix: "Giriş yap veya doğru kimlik bilgilerini gönder." },
  { code: 403, name: "Forbidden", group: "4xx İstemci hatası", m: "GET", p: "/admin", desc: "Kimlik biliniyor ama erişim yetkisi yok.", fix: "Yetkili bir hesapla dene veya yetki iste." },
  { code: 404, name: "Not Found", group: "4xx İstemci hatası", m: "GET", p: "/yok", desc: "İstenen kaynak sunucuda bulunamadı.", fix: "Adresi kontrol et." },
  { code: 500, name: "Internal Server Error", group: "5xx Sunucu hatası", m: "GET", p: "/hata-uret", desc: "Sunucu isteği işlerken beklenmeyen bir hata yaşadı.", fix: "Sunucu loglarını incele; istemci tarafında yapılacak bir şey yok." },
];

const cipher = (s: string) => Array.from(s).map((c, i) => ((c.charCodeAt(0) * 31 + i * 17 + 99) % 256).toString(16).padStart(2, "0")).join(" ");

export default function Lab14() {
  const [tab, setTab] = useState<"sim" | "codes" | "tls">("sim");
  const [method, setMethod] = useState("GET");
  const [path, setPath] = useState("/index.html");
  const [user, setUser] = useState("ali");
  const [pass, setPass] = useState("1234");
  const [res, setRes] = useState<Res | null>(null);
  const [reqText, setReqText] = useState("");
  const [proto, setProto] = useState<"http" | "https">("http");
  const [tu, setTu] = useState("ali");
  const [tp, setTp] = useState("GizliSifre!");

  const exec = (m = method, p = path, u = user, pw = pass) => {
    const body = m === "POST" ? `kullanici=${u}&sifre=${pw}` : "";
    setReqText([`${m} ${p} HTTP/1.1`, "Host: www.ornek.com", "User-Agent: AGCyberLab-Tarayici/1.0", "Accept: text/html", ...(m === "POST" ? ["Content-Type: application/x-www-form-urlencoded", `Content-Length: ${body.length}`] : []), "", body].join("\n").trimEnd());
    setRes(respond(m, p, u, pw));
    markLab(14);
  };

  const trigger = (m: string, p: string) => {
    setMethod(m);
    setPath(p);
    const blank = m === "POST" && p === "/login";
    if (blank) { setUser(""); setPass(""); }
    setTab("sim");
    exec(m, p, blank ? "" : user, blank ? "" : pass);
  };

  const raw = `POST /login HTTP/1.1\nHost: www.ornek.com\n\nkullanici=${tu}&sifre=${tp}`;
  const tone = res ? (res.code < 300 ? "ok" : res.code < 400 ? "info" : res.code < 500 ? "warn" : "err") : "info";

  return (
    <LabBox title="HTTP İstek / Yanıt Simülatörü">
      <div className="flex flex-wrap gap-2">
        <Btn variant={tab === "sim" ? "primary" : "ghost"} onClick={() => setTab("sim")}>1) İstek-Yanıt</Btn>
        <Btn variant={tab === "codes" ? "primary" : "ghost"} onClick={() => setTab("codes")}>2) Durum Kodları</Btn>
        <Btn variant={tab === "tls" ? "primary" : "ghost"} onClick={() => setTab("tls")}>3) HTTP / HTTPS</Btn>
      </div>

      {tab === "sim" && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-[140px_1fr_auto] sm:items-end">
            <label className="text-sm font-semibold">Metot
              <select className="field mt-1" value={method} onChange={(e) => setMethod(e.target.value)}><option>GET</option><option>POST</option></select>
            </label>
            <label className="text-sm font-semibold">Adres
              <select className="field mt-1" value={path} onChange={(e) => setPath(e.target.value)}>{PATHS.map((p) => <option key={p.path} value={p.path}>{p.label}</option>)}</select>
            </label>
            <Btn onClick={() => exec()}>📨 İstek Gönder</Btn>
          </div>
          {method === "POST" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-semibold">Kullanıcı adı<input className="field mt-1" value={user} onChange={(e) => setUser(e.target.value)} /></label>
              <label className="text-sm font-semibold">Şifre<input className="field mt-1" value={pass} onChange={(e) => setPass(e.target.value)} /></label>
              <p className="text-xs text-muted sm:col-span-2">POST /login adresine gönder. Örnek geçerli giriş: ali / 1234. Boş bırakırsan 400, yanlış girersen 401 dönecek.</p>
            </div>
          )}
          {res && (
            <div className="grid gap-3 lg:grid-cols-2">
              <div className="rounded-xl border border-line bg-white p-3">
                <p className="mb-1 text-xs font-bold uppercase text-muted">İstek (Request)</p>
                <pre className="overflow-x-auto whitespace-pre-wrap break-all text-xs leading-relaxed">{reqText}</pre>
              </div>
              <div className="rounded-xl border border-line bg-white p-3">
                <p className="mb-1 text-xs font-bold uppercase text-muted">Yanıt (Response)</p>
                <pre className="overflow-x-auto whitespace-pre-wrap break-all text-xs leading-relaxed"><span className="font-bold text-brand">HTTP/1.1 {res.code} {res.text}</span>{"\n" + res.headers.join("\n") + "\n\n" + res.body}</pre>
              </div>
              <div className="lg:col-span-2"><Callout kind={tone as "ok" | "info" | "warn" | "err"} title={`${res.code} ${res.text}`}>{res.why}</Callout></div>
            </div>
          )}
        </div>
      )}

      {tab === "codes" && (
        <div className="space-y-3">
          <p className="text-sm text-muted">Bir kodu seç; anlamını gör ve &quot;Tetikle&quot; ile simülatörde canlı incele.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {CODES.map((c) => (
              <div key={c.code} className="rounded-xl border border-line bg-white p-3">
                <div className="flex items-center gap-2">
                  <span className={`rounded-md px-2 py-0.5 font-mono text-sm font-bold text-white ${c.code < 300 ? "bg-ok" : c.code < 400 ? "bg-brand" : c.code < 500 ? "bg-warn" : "bg-err"}`}>{c.code}</span>
                  <span className="font-bold">{c.name}</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-brand">{c.group}</p>
                <p className="mt-1 text-sm">{c.desc}</p>
                <p className="text-xs text-muted"><b>Ne yapmalı:</b> {c.fix}</p>
                <Btn variant="soft" className="mt-2 min-h-[34px]" onClick={() => trigger(c.m, c.p)}>▶ Tetikle ({c.m} {c.p})</Btn>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "tls" && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-semibold">Kullanıcı adı<input className="field mt-1" value={tu} onChange={(e) => setTu(e.target.value)} /></label>
            <label className="text-sm font-semibold">Şifre<input className="field mt-1" value={tp} onChange={(e) => setTp(e.target.value)} /></label>
          </div>
          <div className="flex gap-2">
            <Btn variant={proto === "http" ? "danger" : "ghost"} onClick={() => { setProto("http"); markLab(14); }}>🔓 HTTP (80)</Btn>
            <Btn variant={proto === "https" ? "ok" : "ghost"} onClick={() => { setProto("https"); markLab(14); }}>🔒 HTTPS (443)</Btn>
          </div>
          <div className="rounded-xl border border-line bg-white p-3">
            <p className="mb-1 text-xs font-bold uppercase text-muted">Aynı Wi-Fi ağını dinleyen bir saldırganın gördüğü</p>
            <pre className="overflow-x-auto whitespace-pre-wrap break-all text-xs leading-relaxed">{proto === "http" ? raw : cipher(raw).slice(0, 360) + " …"}</pre>
          </div>
          {proto === "http" ? <Callout kind="err" title="HTTP: Şifresiz!">Kullanıcı adı ve şifre açık metin olarak okunabiliyor. Halka açık Wi-Fi gibi ağlarda bu çok risklidir.</Callout> : <Callout kind="ok" title="HTTPS: Şifreli">Aynı veri TLS ile şifrelendi; dinleyen kişi yalnızca anlamsız baytlar görür (burada gösterilen basit bir simülasyondur).</Callout>}
          <div className="overflow-x-auto rounded-xl border border-line bg-white">
            <table className="w-full min-w-[460px] text-sm">
              <thead className="bg-soft text-left text-brand"><tr><th className="p-2">Özellik</th><th className="p-2">HTTP</th><th className="p-2">HTTPS</th></tr></thead>
              <tbody className="divide-y divide-line">
                <tr><td className="p-2 font-semibold">Port</td><td className="p-2">80</td><td className="p-2">443</td></tr>
                <tr><td className="p-2 font-semibold">Gizlilik</td><td className="p-2 text-err">Yok (düz metin)</td><td className="p-2 text-ok">Şifreli</td></tr>
                <tr><td className="p-2 font-semibold">Bütünlük</td><td className="p-2 text-err">Yolda değiştirilebilir</td><td className="p-2 text-ok">Korunur</td></tr>
                <tr><td className="p-2 font-semibold">Kimlik doğrulama</td><td className="p-2 text-err">Yok</td><td className="p-2 text-ok">Sertifika ile</td></tr>
              </tbody>
            </table>
          </div>
          <div className="rounded-xl border border-line bg-soft p-3 text-sm">
            <p className="mb-1 font-bold">TLS el sıkışması (özet)</p>
            <ol className="list-inside list-decimal space-y-0.5">
              <li>İstemci: ClientHello (desteklenen şifreler)</li>
              <li>Sunucu: ServerHello + sertifika</li>
              <li>İstemci sertifikayı doğrular, ortak oturum anahtarı oluşturulur</li>
              <li>Bundan sonra tüm HTTP verisi bu anahtarla şifrelenir</li>
            </ol>
          </div>
        </div>
      )}
    </LabBox>
  );
}
