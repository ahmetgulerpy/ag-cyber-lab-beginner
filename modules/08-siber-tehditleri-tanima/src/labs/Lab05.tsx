"use client";

import { useEffect, useState } from "react";
import { Badge, Btn, Card, Choice, Feedback, InfoBox, LabPanel, ProgressBar, Tabs } from "@/components/ui";
import { analyzeUrl, type UrlReport } from "./urlAnalyzer";
import type { LabProps } from "./types";

const CLUES = [
  { id: "c1", t: "Gönderen adresi resmî alan adından değil / taklit" },
  { id: "c2", t: "Acele, tehdit veya süre baskısı" },
  { id: "c3", t: "Genel hitap (‘Sayın Müşteri’) – adınla hitap yok" },
  { id: "c4", t: "Bağlantı adresi kurumla uyuşmuyor" },
  { id: "c5", t: "Beklenmeyen ek dosya" },
  { id: "c6", t: "Parola, kart veya doğrulama kodu isteniyor" },
  { id: "c7", t: "Ödül / bedava vaadi" },
  { id: "c8", t: "Yazım ve dil hataları" },
];

type Mail = {
  id: string;
  tag: string;
  fromName: string;
  fromAddr: string;
  subject: string;
  body: string[];
  linkText?: string;
  linkReal?: string;
  attach?: string;
  clues: string[];
  phish: boolean;
  explain: string;
};

const MAILS: Mail[] = [
  { id: "bank", tag: "Banka bildirimi", fromName: "Anadolu Banka Güvenlik", fromAddr: "guvenlik@anadolubanka-destek.top", subject: "⚠ Hesabınız 24 saat içinde askıya alınacak!", body: ["Sayın Müşteri,", "Hesabınızda olağandışı işlem tespit ettik. Hesabınızın askıya alınmaması için 24 saat içinde kimlik bilgilerinizi doğrulamanız gerekmektedir."], linkText: "https://www.anadolubanka.example/dogrula", linkReal: "http://anadolubanka-giris.top/login?verify=1", clues: ["c1", "c2", "c3", "c4", "c6"], phish: true, explain: "Gönderen alan adı (anadolubanka-destek.top) resmî değil, bağlantı gerçekte başka bir siteye gidiyor, acele baskısı var ve kimlik bilgisi isteniyor. Gerçek bankalar e-postayla parola istemez." },
  { id: "kargo", tag: "Kargo mesajı", fromName: "HızlıKargo", fromAddr: "bilgi@hizlikargo-takip.xyz", subject: "Paketiniz adreste bulunamadı", body: ["Sayın alıcı,", "Paketiniz teslim edilemedi. Yeniden teslimat için 5 TL ücret ödemeniz gerekiyor. Aksi halde paket iade edilecektir.", "Kart bilgilerinizi girerek ödeme yapınız."], linkText: "hizlikargo.example/odeme", linkReal: "https://hizlikargo-odeme.xyz/pay?kart=1", clues: ["c1", "c2", "c3", "c4", "c6"], phish: true, explain: "Küçük bir ödeme talebi ve süre baskısı klasik kargo phishing'idir. Alan adı resmî değil. Takip numaranı kargo firmasının uygulamasından kontrol etmelisin." },
  { id: "reset", tag: "Parola sıfırlama", fromName: "BulutPosta Hesap Ekibi", fromAddr: "no-reply@bulutpost-hesap.net", subject: "Parolanız 1 saat içinde sıfırlanmazsa hesabınız kilitlenecek", body: ["Merhaba,", "Hesabınıza yetkisiz giriş denemesi yapıldı. Aşağıdaki bağlantıdan mevcut parolanızı ve size gelen doğrulama kodunu girerek yeni parola belirleyin."], linkText: "hesap.bulutposta.example/sifirla", linkReal: "http://bulutpost-hesap.net/reset?token=9f2&otp=", clues: ["c1", "c2", "c4", "c6"], phish: true, explain: "Parola sıfırlama işlemi mevcut parolanı ve doğrulama kodunu istemez. Alan adı bulutposta.example ile aynı değil ve acele baskısı var. Ayarlara doğrudan kendi adresinden gir." },
  { id: "info", tag: "Bilgilendirme", fromName: "BulutPosta Bilgi", fromAddr: "bilgi@bulutposta.example", subject: "Hizmet şartlarımız güncellendi", body: ["Merhaba Elif,", "1 Mart tarihinde yürürlüğe girecek hizmet şartlarımızı güncelledik. Değişiklikleri hesabına giriş yaptıktan sonra Ayarlar > Gizlilik bölümünden inceleyebilirsin.", "Herhangi bir işlem yapman gerekmiyor."], linkText: "bulutposta.example/sartlar", linkReal: "https://bulutposta.example/sartlar", clues: [], phish: false, explain: "Gönderen alan adı resmî, hitap kişisel, acele yok, parola/kart istenmiyor ve bağlantı gösterilen adresle aynı. Bu gerçek bir bilgilendirme e-postasıdır." },
  { id: "odul", tag: "Ödül / kampanya", fromName: "Mega Çekiliş", fromAddr: "odul@mega-cekilis-kampanya.click", subject: "TEBRİKLER!!! Yeni telefon kazandınız 🎁", body: ["Sayın kullanici,", "Bu ay 1000. ziyaretçi sizsiniz! Ödülünüzü almak için bugun icinde kargo ücreti ödeyip kart bilgilerinizi giriniz.", "Ek: odul_formu.pdf.exe"], linkText: "www.megacekilis.example/odul", linkReal: "http://mega-cekilis-kampanya.click/kazan", attach: "odul_formu.pdf.exe", clues: ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8"], phish: true, explain: "Ödül vaadi, yazım hataları, çift uzantılı ek (.pdf.exe), kart bilgisi talebi ve sahte alan adı aynı e-postada. Katılmadığın bir çekilişten ödül çıkmaz." },
];

const URLS = [
  { u: "https://www.anadolubanka.example/giris", safe: true },
  { u: "http://anadolubanka.com.guvenli-dogrulama.top/login", safe: false },
  { u: "https://hizlikargo-takip.xyz/paket?id=8841&odeme=kart", safe: false },
  { u: "https://paypa1-hesap.net/verify?token=abc123", safe: false },
  { u: "https://accounts.bulutposta.example/ayarlar", safe: true },
  { u: "https://bulutposta.example@203.0.113.9/login", safe: false },
  { u: "https://xn--bulutpsta-9ib.example/giris", safe: false },
  { u: "https://musteri.firma.example/sso?redirect=http://baska-site.example/", safe: false },
  { u: "https://www.okulportal.example/odevler?sayfa=2", safe: true },
];

function Report({ r }: { r: UrlReport }) {
  if (!r.valid) return <InfoBox tone="bad">{r.findings[0]?.text ?? "Bir URL gir."}</InfoBox>;
  const rows: [string, string][] = [["Protokol", r.protocol.toUpperCase()], ["Alt alan adı", r.subdomain], ["Alan adı (gerçek)", r.domain], ["Uzantı (TLD)", r.tld], ["Yol", r.path]];
  return (
    <div className="space-y-3">
      <div className="grid gap-1.5 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-2 rounded-lg border border-line bg-page px-3 py-1.5 text-xs">
            <span className="text-muted">{k}</span>
            <span className="break-all font-mono font-semibold">{v}</span>
          </div>
        ))}
        {r.params.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-2 rounded-lg border border-line bg-page px-3 py-1.5 text-xs">
            <span className="text-muted">Parametre: {k}</span>
            <span className="break-all font-mono font-semibold">{v || "(boş)"}</span>
          </div>
        ))}
      </div>
      <ul className="space-y-1.5">
        {r.findings.map((f, i) => (
          <li key={i} className={`rounded-lg border px-3 py-2 text-sm ${f.level === "bad" ? "border-bad/30 bg-bad/10" : f.level === "warn" ? "border-warn/40 bg-warn/10" : "border-ok/30 bg-ok/10"}`}>
            {f.level === "bad" ? "🚩 " : f.level === "warn" ? "⚠️ " : "✅ "}{f.text}
          </li>
        ))}
      </ul>
      <div>
        <p className="mb-1 text-xs font-semibold text-muted">Risk puanı: {r.risk}/100</p>
        <ProgressBar value={r.risk} tone={r.risk >= 50 ? "bad" : r.risk >= 20 ? "warn" : "ok"} />
      </div>
    </div>
  );
}

function MailLab({ onCount }: { onCount: (n: number) => void }) {
  const [sel, setSel] = useState(0);
  const [picked, setPicked] = useState<Record<string, string[]>>({});
  const [verdict, setVerdict] = useState<Record<string, boolean | undefined>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [showLink, setShowLink] = useState(false);

  const m = MAILS[sel];
  const p = picked[m.id] ?? [];
  const isChecked = checked[m.id];
  const count = Object.keys(checked).length;
  useEffect(() => onCount(count), [count, onCount]);

  const missed = m.clues.filter((c) => !p.includes(c));
  const falseFlags = p.filter((c) => !m.clues.includes(c));
  const vOk = verdict[m.id] === m.phish;

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="space-y-2 lg:col-span-2">
        <p className="text-sm font-bold">📥 Gelen kutusu</p>
        {MAILS.map((x, i) => (
          <button key={x.id} onClick={() => { setSel(i); setShowLink(false); }} className={`w-full rounded-xl border p-3 text-left transition-colors ${sel === i ? "border-brand bg-soft" : "border-line bg-white hover:border-brand/40"}`}>
            <span className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-brand">{x.tag}</span>
              {checked[x.id] && <Badge tone={verdict[x.id] === x.phish ? "ok" : "bad"}>{verdict[x.id] === x.phish ? "✓" : "✗"}</Badge>}
            </span>
            <span className="mt-0.5 block truncate text-sm font-semibold">{x.subject}</span>
            <span className="block truncate text-xs text-muted">{x.fromAddr}</span>
          </button>
        ))}
        <p className="text-xs text-muted">Analiz edilen: {count}/{MAILS.length}</p>
      </div>

      <div className="space-y-3 lg:col-span-3">
        <Card className="ag-fade" key={m.id}>
          <p className="text-xs text-muted">Kimden: <span className="font-semibold text-ink">{m.fromName}</span> &lt;<span className="font-mono">{m.fromAddr}</span>&gt;</p>
          <h4 className="mt-1 font-bold">{m.subject}</h4>
          <div className="mt-3 space-y-2 rounded-xl bg-page p-3 text-sm">
            {m.body.map((b, i) => <p key={i}>{b}</p>)}
            {m.linkText && (
              <div>
                <span className="cursor-pointer break-all font-semibold text-brand underline" role="button" tabIndex={0} onClick={() => setShowLink(true)} onKeyDown={(e) => { if (e.key === "Enter") setShowLink(true); }}>{m.linkText}</span>
                {showLink ? <p className="ag-fade mt-1 break-all rounded bg-white px-2 py-1 font-mono text-xs"><b>Gerçek hedef (üzerine gelince görünür):</b> {m.linkReal}</p> : <p className="text-[11px] text-muted">Bağlantıya tıkla/odaklan: gerçek adresi gör (hiçbir yere gidilmez)</p>}
              </div>
            )}
            {m.attach && <p className="font-mono text-xs">📎 {m.attach}</p>}
          </div>
        </Card>
        <Card>
          <p className="text-sm font-bold">🔍 Şüpheli işaretleri seç</p>
          <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {CLUES.map((c) => {
              const s = p.includes(c.id);
              const real = m.clues.includes(c.id);
              const st = !isChecked ? "idle" : s ? (real ? "correct" : "wrong") : real ? "missed" : "idle";
              return <Choice key={c.id} selected={s} disabled={isChecked} state={st} onClick={() => setPicked({ ...picked, [m.id]: s ? p.filter((x) => x !== c.id) : [...p, c.id] })}>{c.t}</Choice>;
            })}
          </div>
          <p className="mt-3 text-sm font-bold">Kararın nedir?</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Choice selected={verdict[m.id] === true} disabled={isChecked} state={isChecked && verdict[m.id] === true ? (m.phish ? "correct" : "wrong") : "idle"} onClick={() => setVerdict({ ...verdict, [m.id]: true })}>🎣 Kimlik avı (Phishing)</Choice>
            <Choice selected={verdict[m.id] === false} disabled={isChecked} state={isChecked && verdict[m.id] === false ? (!m.phish ? "correct" : "wrong") : "idle"} onClick={() => setVerdict({ ...verdict, [m.id]: false })}>✅ Güvenli görünüyor</Choice>
          </div>
          {!isChecked ? (
            <Btn className="mt-3" disabled={verdict[m.id] === undefined} onClick={() => setChecked({ ...checked, [m.id]: true })}>Analizi tamamla</Btn>
          ) : (
            <div className="mt-3 space-y-2">
              <Feedback ok={vOk && falseFlags.length === 0 && missed.length === 0 ? true : vOk ? null : false} title={vOk ? "Kararın doğru" : "Kararın yanlış"}>
                <p>{m.explain}</p>
                <p className="mt-1 text-xs">Kaçırdığın işaret: {missed.length} • Yanlış işaretlediğin: {falseFlags.length}</p>
              </Feedback>
              {sel < MAILS.length - 1 && <Btn variant="secondary" size="sm" onClick={() => { setSel(sel + 1); setShowLink(false); }}>Sonraki e-posta →</Btn>}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function UrlLab({ onCount }: { onCount: (n: number) => void }) {
  const [verdict, setVerdict] = useState<Record<number, boolean>>({});
  const [open, setOpen] = useState(0);
  const [custom, setCustom] = useState("");
  const [customReport, setCustomReport] = useState<UrlReport | null>(null);
  const n = Object.keys(verdict).length;
  useEffect(() => onCount(n), [n, onCount]);
  const cur = URLS[open];
  const answered = verdict[open] !== undefined;

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="space-y-1.5 lg:col-span-2">
        <p className="text-sm font-bold">🔗 Örnek URL’ler ({n}/{URLS.length})</p>
        {URLS.map((x, i) => (
          <button key={i} onClick={() => setOpen(i)} className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left ${open === i ? "border-brand bg-soft" : "border-line bg-white hover:border-brand/40"}`}>
            <span className="min-w-0 flex-1 break-all font-mono text-[11px]">{x.u}</span>
            {verdict[i] !== undefined && <span aria-hidden>{verdict[i] === !x.safe ? "✅" : "❌"}</span>}
          </button>
        ))}
      </div>
      <div className="space-y-3 lg:col-span-3">
        <Card>
          <p className="break-all rounded-lg bg-page p-2 font-mono text-xs">{cur.u}</p>
          <p className="mt-3 text-sm font-bold">Bu URL için kararın?</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Choice disabled={answered} selected={verdict[open] === false} state={answered && verdict[open] === false ? (cur.safe ? "correct" : "wrong") : "idle"} onClick={() => setVerdict({ ...verdict, [open]: false })}>✅ Güvenli</Choice>
            <Choice disabled={answered} selected={verdict[open] === true} state={answered && verdict[open] === true ? (!cur.safe ? "correct" : "wrong") : "idle"} onClick={() => setVerdict({ ...verdict, [open]: true })}>🚩 Şüpheli</Choice>
          </div>
          {answered && (
            <div className="mt-3 space-y-3">
              <Feedback ok={verdict[open] === !cur.safe} title={cur.safe ? "Bu URL güvenli görünüyor" : "Bu URL şüpheli"}>Aşağıdaki çözümlemeye bakarak nedenini incele.</Feedback>
              <Report r={analyzeUrl(cur.u)} />
            </div>
          )}
        </Card>
        <Card>
          <p className="text-sm font-bold">🧪 Kendi örnek URL’ini analiz et</p>
          <p className="text-xs text-muted">Sadece metin çözümlenir; bağlantıya gidilmez, hiçbir istek gönderilmez. Gerçek hesap bilgisi içeren URL yazma.</p>
          <div className="mt-2 flex gap-2">
            <input value={custom} onChange={(e) => setCustom(e.target.value.slice(0, 200))} placeholder="örn: http://banka.com.giris-yap.top/login" className="min-w-0 flex-1 rounded-xl border border-line bg-page px-3 py-2 font-mono text-xs outline-none focus:border-accent" aria-label="URL gir" />
            <Btn onClick={() => setCustomReport(analyzeUrl(custom))}>Analiz et</Btn>
          </div>
          {customReport && <div className="mt-3"><Report r={customReport} /></div>}
        </Card>
      </div>
    </div>
  );
}

export default function Lab05({ onComplete, done }: LabProps) {
  const [tab, setTab] = useState<"mail" | "url">("mail");
  const [mc, setMc] = useState(0);
  const [uc, setUc] = useState(0);
  const finished = mc === MAILS.length && uc === URLS.length;
  useEffect(() => {
    if (finished) onComplete();
  }, [finished, onComplete]);

  return (
    <LabPanel title="Laboratuvar 5 – Phishing Detection Lab" intro="Şimdi bir e-postanın güvenli olup olmadığını birlikte inceleyelim. Önce 5 e-postayı analiz et, sonra URL analiz aracıyla adresleri parçalarına ayır." done={done}>
      <Tabs variant="pill" value={tab} onChange={setTab} tabs={[{ id: "mail", label: "📧 E-posta analizi", badge: `${mc}/${MAILS.length}` }, { id: "url", label: "🔗 URL analiz aracı", badge: `${uc}/${URLS.length}` }]} />
      <div className="ag-fade">
        {tab === "mail" ? <MailLab onCount={setMc} /> : <UrlLab onCount={setUc} />}
      </div>
    </LabPanel>
  );
}
