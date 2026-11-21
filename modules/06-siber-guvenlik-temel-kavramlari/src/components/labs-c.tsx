"use client";

import { useEffect, useState } from "react";
import { Feedback, LabFrame } from "./ui";
import { LAYERS } from "./visuals-b";

type LabProps = { onDone: () => void };

function Progress({ done, total }: { done: number; total: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-soft">
        <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${(done / total) * 100}%` }} />
      </div>
      <span className="text-xs font-semibold text-muted">{done}/{total}</span>
    </div>
  );
}

/* ================= LAB 09: Katman kurucu ================= */
const ATTACKS = [
  { t: "Phishing ile parola çalma", c: ["iam", "end", "mon"] },
  { t: "Web uygulaması zafiyeti istismarı", c: ["app", "net", "mon"] },
  { t: "Laptop çalınması", c: ["end", "phys", "data"] },
  { t: "Fidye yazılımı", c: ["end", "data", "net", "mon"] },
  { t: "Kötü niyetli iç kullanıcı", c: ["iam", "data", "mon"] },
  { t: "Yetkisiz sunucu odası girişi", c: ["phys", "mon"] },
];
const LNAME = (id: string) => LAYERS.find((l) => l.id === id)!.t;

export function LabDepth({ onDone }: LabProps) {
  const [on, setOn] = useState<string[]>([]);
  const [everFull, setEverFull] = useState(false);
  const [offAfter, setOffAfter] = useState(false);
  useEffect(() => {
    if (everFull && offAfter) onDone();
  }, [everFull, offAfter, onDone]);
  const toggle = (id: string) => {
    const next = on.includes(id) ? on.filter((x) => x !== id) : [...on, id];
    setOn(next);
    if (next.length === LAYERS.length) setEverFull(true);
    else if (everFull && next.length < on.length) setOffAfter(true);
  };
  const res = ATTACKS.map((a) => ({ ...a, act: a.c.filter((x) => on.includes(x)) }));
  const stopped = res.filter((r) => r.act.length > 0).length;
  const multi = res.filter((r) => r.act.length > 1).length;
  const pct = Math.round((stopped / ATTACKS.length) * 100);
  return (
    <LabFrame>
      <div className="rounded-xl bg-soft p-3 text-sm text-ink/90">
        <b>Görev:</b> (1) Tüm 7 savunma katmanını etkinleştir. (2) Ardından bir katmanı devre dışı bırak ve diğer katmanların saldırıları hâlâ durdurduğunu gözlemle.
      </div>
      <div className="flex flex-wrap gap-2">
        {LAYERS.map((l, i) => (
          <button key={l.id} onClick={() => toggle(l.id)} className={`cursor-pointer rounded-xl border-2 px-3 py-2 text-sm font-semibold transition ${on.includes(l.id) ? "border-brand bg-brand text-white" : "border-line bg-white text-ink hover:bg-soft"}`}>
            {i + 1}. {l.t} {on.includes(l.id) ? "✓" : ""}
          </button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <div className="flex flex-col gap-2">
          {res.map((r) => (
            <div key={r.t} className={`rounded-xl border-2 p-3 transition ${r.act.length ? "border-ok/50 bg-[#F4FAF7]" : "border-bad/50 bg-[#FDF3F3]"}`}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-ink">{r.t}</p>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold text-white ${r.act.length ? "bg-ok" : "bg-bad"}`}>{r.act.length ? "Durduruldu" : "Başarılı (savunmasız)"}</span>
              </div>
              <p className="mt-1 text-xs text-ink/80">
                {r.act.length ? `Koruyan katmanlar: ${r.act.map(LNAME).join(", ")}` : `Bu saldırıyı durdurabilecek katmanlar: ${r.c.map(LNAME).join(", ")}`}
              </p>
            </div>
          ))}
        </div>
        <div className="card flex flex-col items-center justify-center gap-2 text-center">
          <p className="label-mini">Korunma skoru</p>
          <p className={`text-5xl font-extrabold ${pct >= 100 ? "text-ok" : pct >= 50 ? "text-warn" : "text-bad"}`}>%{pct}</p>
          <p className="text-xs text-muted">{multi} saldırı birden fazla katmanla korunuyor (derinlik).</p>
          {everFull && offAfter && <p className="rounded-lg bg-[#E9F5EF] px-2 py-1 text-xs font-semibold text-ok">Bir katman kapanınca diğerleri koruma sağladı ✓</p>}
        </div>
      </div>
    </LabFrame>
  );
}

/* ================= LAB 10: Zero Trust erişim kararı ================= */
const ID_OPT = [
  { l: "MFA başarılı", r: 0 },
  { l: "Yalnızca parola", r: 2 },
  { l: "Doğrulama başarısız", r: 5 },
];
const DEV_OPT = [
  { l: "Güncel ve şifreli cihaz", r: 0 },
  { l: "Güncellenmemiş cihaz", r: 2 },
  { l: "Bilinmeyen cihaz", r: 3 },
];
const LOC_OPT = [
  { l: "Ofis ağı", r: 0 },
  { l: "Ev (olağan konum)", r: 1 },
  { l: "Yurt dışı (olağandışı)", r: 2 },
];
const RES_OPT = [
  { l: "Genel intranet", max: [3, 5] },
  { l: "Finans uygulaması", max: [1, 3] },
  { l: "Müşteri veritabanı yönetimi", max: [0, 1] },
];

export function LabZeroTrust({ onDone }: LabProps) {
  const [id, setId] = useState(0);
  const [dev, setDev] = useState(0);
  const [loc, setLoc] = useState(0);
  const [res, setRes] = useState(1);
  const [seen, setSeen] = useState<string[]>([]);
  const risk = ID_OPT[id].r + DEV_OPT[dev].r + LOC_OPT[loc].r;
  const m = RES_OPT[res].max;
  const decision = id === 2 ? "deny" : risk <= m[0] ? "allow" : risk <= m[1] ? "step" : "deny";
  useEffect(() => {
    if (!seen.includes(decision)) setSeen((s) => [...s, decision]);
  }, [decision, seen]);
  useEffect(() => {
    if (seen.length >= 3) onDone();
  }, [seen, onDone]);
  const D = {
    allow: { t: "ERİŞİM VERİLDİ", c: "bg-ok", d: "Risk skoru bu kaynağın eşiğinin altında; politika erişime izin veriyor." },
    step: { t: "EK DOĞRULAMA GEREKLİ", c: "bg-warn", d: "Risk orta düzeyde: ek doğrulama (step-up) veya kısıtlı erişim istenir." },
    deny: { t: "ERİŞİM REDDEDİLDİ", c: "bg-bad", d: "Risk bu kaynak için çok yüksek veya kimlik doğrulanamadı." },
  }[decision];
  const Group = ({ label, opts, val, on }: { label: string; opts: { l: string }[]; val: number; on: (n: number) => void }) => (
    <div>
      <p className="label-mini mb-1.5">{label}</p>
      <div className="flex flex-col gap-1.5">
        {opts.map((o, i) => (
          <button key={o.l} onClick={() => on(i)} className={`cursor-pointer rounded-lg border-2 px-3 py-2 text-left text-sm transition ${val === i ? "border-brand bg-soft font-semibold" : "border-line bg-white hover:bg-soft"}`}>{o.l}</button>
        ))}
      </div>
    </div>
  );
  return (
    <LabFrame>
      <div className="rounded-xl bg-soft p-3 text-sm text-ink/90">
        <b>Görev:</b> Farklı koşulları dene ve üç karar türünü de gör: <b>İzin</b>, <b>Ek doğrulama</b>, <b>Red</b>.
        <span className="ml-2">
          {["allow", "step", "deny"].map((k) => (
            <span key={k} className={`mr-1 rounded-full px-2 py-0.5 text-xs font-bold ${seen.includes(k) ? "bg-ok text-white" : "bg-white text-muted"}`}>{k === "allow" ? "İzin" : k === "step" ? "Ek doğrulama" : "Red"}</span>
          ))}
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Group label="Kimlik" opts={ID_OPT} val={id} on={setId} />
        <Group label="Cihaz durumu" opts={DEV_OPT} val={dev} on={setDev} />
        <Group label="Konum" opts={LOC_OPT} val={loc} on={setLoc} />
        <Group label="Erişilen kaynak" opts={RES_OPT} val={res} on={setRes} />
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
        <div className={`rounded-2xl p-5 text-white ${D.c}`}>
          <p className="text-xs font-semibold uppercase tracking-wider opacity-85">Politika kararı</p>
          <p className="mt-1 text-xl font-extrabold">{D.t}</p>
          <p className="mt-1 text-sm opacity-95">{D.d}</p>
        </div>
        <div className="card !p-4 text-sm">
          <p className="label-mini mb-2">Risk dökümü</p>
          <ul className="flex flex-col gap-1 text-ink/85">
            <li>Kimlik: <b>+{ID_OPT[id].r}</b> ({ID_OPT[id].l})</li>
            <li>Cihaz: <b>+{DEV_OPT[dev].r}</b> ({DEV_OPT[dev].l})</li>
            <li>Konum: <b>+{LOC_OPT[loc].r}</b> ({LOC_OPT[loc].l})</li>
            <li className="mt-1 border-t border-line pt-1">Toplam risk: <b>{risk}</b> · Kaynak eşikleri: izin ≤ {m[0]}, ek doğrulama ≤ {m[1]}</li>
          </ul>
        </div>
      </div>
    </LabFrame>
  );
}

/* ================= LAB 11: Politika taslağı ================= */
const POL_CATS = [
  {
    t: "Parola Politikası",
    items: [
      { c: "Parolalar en az 12 karakter uzunluğunda olmalıdır.", good: true },
      { c: "Tüm kurumsal hesaplarda MFA zorunludur.", good: true },
      { c: "Parola yöneticisi kullanımı teşvik edilir; parolalar paylaşılmaz.", good: true },
      { c: "Çalışanlar güçlü parola kullanmalıdır.", good: false },
    ],
  },
  {
    t: "Erişim Kontrol Politikası",
    items: [
      { c: "Erişim en az ayrıcalık prensibine göre rol bazlı verilir.", good: true },
      { c: "Yetkiler üç ayda bir gözden geçirilir.", good: true },
      { c: "İşten ayrılan çalışanların hesapları aynı gün kapatılır.", good: true },
      { c: "Yöneticiler gerektiğinde herkese tam yetki verebilir.", good: false },
    ],
  },
  {
    t: "Kabul Edilebilir Kullanım",
    items: [
      { c: "Onaysız yazılım kurulamaz.", good: true },
      { c: "Kurumsal veri kişisel bulut hesaplarına yüklenemez.", good: true },
      { c: "Şüpheli durumlar 24 saat içinde güvenlik ekibine bildirilir.", good: true },
      { c: "Çalışanlar cihazları makul şekilde kullanır.", good: false },
    ],
  },
  {
    t: "Veri Koruma",
    items: [
      { c: "Veriler gizli, dahili ve genel olarak sınıflandırılır.", good: true },
      { c: "Gizli veriler saklanırken ve iletilirken şifrelenir.", good: true },
      { c: "Kritik veriler düzenli yedeklenir ve geri yükleme test edilir.", good: true },
      { c: "Veriler gerekirse herkese açık klasörlerde tutulabilir.", good: false },
    ],
  },
  {
    t: "Uzaktan Çalışma",
    items: [
      { c: "Kurumsal kaynaklara yalnızca VPN ile bağlanılır.", good: true },
      { c: "Uzaktan çalışmada kullanılan cihazlar güncel ve disk şifrelemeli olmalıdır.", good: true },
      { c: "Halka açık Wi‑Fi'da hassas işlem yapılmaz.", good: true },
      { c: "Çalışanlar uzaktan bağlanırken dikkatli olmalıdır.", good: false },
    ],
  },
];

export function LabPolicy({ onDone }: LabProps) {
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const stat = POL_CATS.map((c) => ({ good: c.items.filter((i) => i.good && sel.has(i.c)).length, weak: c.items.filter((i) => !i.good && sel.has(i.c)).length }));
  const ready = stat.every((s) => s.good >= 2 && s.weak === 0);
  useEffect(() => {
    if (ready) onDone();
  }, [ready, onDone]);
  const toggle = (c: string) => {
    const n = new Set(sel);
    if (n.has(c)) n.delete(c);
    else n.add(c);
    setSel(n);
  };
  const draft = POL_CATS.map((c) => {
    const items = c.items.filter((i) => sel.has(i.c));
    return items.length ? `${c.t}\n${items.map((i, k) => `  ${k + 1}. ${i.c}`).join("\n")}` : "";
  }).filter(Boolean).join("\n\n");
  const score = Math.round((stat.reduce((a, s) => a + Math.min(s.good, 3) - s.weak, 0) / (POL_CATS.length * 3)) * 100);
  return (
    <LabFrame>
      <div className="rounded-xl bg-soft p-3 text-sm text-ink/90">
        <b>Görev:</b> &quot;Mavi Yıldız Lojistik&quot; için politika taslağı oluştur. Her kategoriden en az <b>2 net ve ölçülebilir</b> madde seç; belirsiz maddelerden kaçın.
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-3">
          {POL_CATS.map((c, ci) => (
            <div key={c.t} className="card !p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-bold text-ink">{c.t}</p>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${stat[ci].good >= 2 && stat[ci].weak === 0 ? "bg-[#E9F5EF] text-ok" : "bg-page text-muted"}`}>{stat[ci].good}/2+</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {c.items.map((it) => {
                  const on = sel.has(it.c);
                  return (
                    <button key={it.c} onClick={() => toggle(it.c)} className={`cursor-pointer rounded-lg border-2 px-3 py-2 text-left text-sm transition ${on ? (it.good ? "border-ok bg-[#E9F5EF]" : "border-bad bg-[#FAEDED]") : "border-line bg-white hover:bg-soft"}`}>
                      {on ? "☑ " : "☐ "}
                      {it.c}
                      {on && !it.good && <span className="mt-1 block text-xs text-bad">Zayıf madde: ölçülemez/belirsiz veya riskli; denetlenemez.</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 lg:sticky lg:top-24 lg:self-start">
          <div className="card !p-4">
            <p className="label-mini mb-1">Politika kalite skoru</p>
            <p className={`text-4xl font-extrabold ${score >= 80 ? "text-ok" : score >= 40 ? "text-warn" : "text-muted"}`}>%{Math.max(0, score)}</p>
          </div>
          <div className="card !p-4">
            <p className="label-mini mb-2">Politika taslağı</p>
            <pre className="max-h-72 overflow-auto whitespace-pre-wrap font-sans text-xs text-ink/85">{draft || "Madde seçtikçe taslak burada oluşur…"}</pre>
            <button
              className="btn-ghost mt-3"
              disabled={!draft}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(draft);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                } catch {
                  setCopied(false);
                }
              }}
            >
              {copied ? "Kopyalandı ✓" : "Taslağı kopyala"}
            </button>
          </div>
          {ready ? <Feedback ok>Politika taslağı tüm alanları net ve ölçülebilir maddelerle kapsıyor.</Feedback> : <p className="text-xs text-muted">Her kategoride en az 2 güçlü madde seç ve zayıf maddeleri çıkar.</p>}
        </div>
      </div>
    </LabFrame>
  );
}

/* ================= LAB 12: Phishing simülasyonu ================= */
const MAILS = [
  { from: "IT Destek <it-destek@sirket-guvenlik-dogrulama.com>", subj: "ACİL: Hesabınız 1 saat içinde kapatılacak", body: "Sayın kullanıcı, hesabınız güvenlik nedeniyle kapatılacaktır. Kapanmaması için aşağıdaki bağlantıdan parolanızı hemen doğrulayın.", link: "Parolamı Doğrula", url: "http://sirket-guvenlik-dogrulama.com/giris", phish: true, why: ["Alan adı şirketinize ait değil.", "Aşırı aciliyet baskısı (1 saat).", "E-postadan parola doğrulaması isteniyor."] },
  { from: "İK <ik@sirketiniz.com>", subj: "Pazartesi 10:00 oryantasyon toplantısı", body: "Merhaba, yeni başlayan çalışanlar için oryantasyon toplantısı Pazartesi 10:00'da 2. kat toplantı odasındadır. Takvim davetini Outlook'ta görebilirsiniz.", link: "", url: "", phish: false, why: ["Gönderen alan adı doğru.", "Beklenen, bilinen bir toplantı.", "Bağlantı veya parola talebi yok."] },
  { from: "Kargo Takip <bilgi@kargo-bildirim.xyz>", subj: "Paketiniz bekliyor – 5 TL teslimat ücreti", body: "Paketiniz depoda bekliyor. Teslimat için 5 TL ödeme yapmanız gerekiyor. Kart bilgilerinizi girin.", link: "Ödemeyi Yap", url: "http://kargo-bildirim.xyz/odeme", phish: true, why: ["Şüpheli alan adı (.xyz).", "Küçük ödeme tuzağı ve kart bilgisi talebi.", "Beklenmeyen paket bildirimi."] },
  { from: "Mehmet Yılmaz (Müdür) <mehmet.yilmaz@sirketiniz.co>", subj: "Acil – bir iş yapabilir misin?", body: "Toplantıdayım ve arayamam. 10 dakika içinde 5 adet hediye kartı alıp kodlarını bana yanıtla. Teşekkürler.", link: "", url: "", phish: true, why: ["Alan adı '.co' – gerçek alan adı '.com'.", "Hediye kartı talebi klasik bir dolandırıcılık yöntemidir.", "Aciliyet ve otorite baskısı (CEO fraud)."] },
  { from: "Eğitim Ekibi <egitim@sirketiniz.com>", subj: "Güvenlik farkındalık eğitimi hatırlatması", body: "Yıllık güvenlik farkındalık eğitimini 30 Haziran'a kadar kurumsal öğrenme portalından (intranet) tamamlamanızı rica ederiz.", link: "", url: "", phish: false, why: ["Doğru gönderen alan adı.", "Bağlantı yok; bilinen intranet portalına yönlendiriyor.", "Parola veya kişisel bilgi talebi yok."] },
  { from: "Fatura <fatura@e-arsiv-belge.net>", subj: "Ödenmemiş fatura – ekteki dosyayı açın", body: "Ödenmemiş faturanız ekte yer almaktadır. Lütfen en kısa sürede inceleyiniz.", link: "Fatura_2025.pdf.exe (ek)", url: "Ek dosya: Fatura_2025.pdf.exe", phish: true, why: ["Çift uzantılı ek (.pdf.exe) çalıştırılabilir zararlı dosyadır.", "Tanınmayan gönderen alan adı.", "Beklenmeyen fatura."] },
  { from: "Muhasebe <muhasebe@sirketiniz.com>", subj: "Aylık masraf formu hatırlatması", body: "Merhaba, aylık masraf formlarınızı ayın son iş gününe kadar her zamanki muhasebe portalından yüklemeyi unutmayın.", link: "", url: "", phish: false, why: ["Doğru alan adı ve bilinen süreç.", "Yeni bağlantı veya ek yok.", "Aciliyet baskısı ya da hassas bilgi talebi yok."] },
];

export function LabPhishing({ onDone }: LabProps) {
  const [i, setI] = useState(0);
  const [ans, setAns] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [fin, setFin] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  useEffect(() => {
    if (fin) onDone();
  }, [fin, onDone]);
  const m = MAILS[i];
  const decide = (suspicious: boolean) => {
    if (ans !== null) return;
    setAns(suspicious);
    if (suspicious === m.phish) setScore((s) => s + 1);
  };
  if (fin)
    return (
      <LabFrame>
        <div className="fade-in rounded-2xl bg-page p-6 text-center">
          <p className="label-mini">Laboratuvar tamamlandı</p>
          <p className="my-2 text-4xl font-extrabold text-brand">{score}/{MAILS.length}</p>
          <p className="text-sm text-muted">Doğru e-posta kararı.</p>
        </div>
      </LabFrame>
    );
  return (
    <LabFrame>
      <Progress done={i} total={MAILS.length} />
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="border-b border-line bg-page px-4 py-3 text-sm">
          <p><span className="text-muted">Kimden:</span> <b>{m.from}</b></p>
          <p><span className="text-muted">Konu:</span> <b>{m.subj}</b></p>
        </div>
        <div className="flex flex-col gap-3 p-4 text-sm text-ink/90">
          <p>{m.body}</p>
          {m.link && (
            <div>
              <button onClick={() => setShowUrl(!showUrl)} className="cursor-pointer rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">{m.link}</button>
              {showUrl && <p className="fade-in mt-2 rounded-lg bg-ink px-3 py-1.5 font-mono text-xs text-[#CDE7EE]">Bağlantı hedefi: {m.url}</p>}
              <p className="mt-1 text-xs text-muted">(Simülasyon: düğmeye basınca bağlantının gerçek hedefi görünür; gerçek bir sayfa açılmaz.)</p>
            </div>
          )}
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <button disabled={ans !== null} onClick={() => decide(true)} className={`cursor-pointer rounded-xl border-2 px-4 py-3 text-sm font-bold transition ${ans === null ? "border-bad/50 bg-white text-bad hover:bg-[#FAEDED]" : m.phish ? "border-ok bg-[#E9F5EF] text-ok" : ans ? "border-bad bg-[#FAEDED] text-bad" : "border-line opacity-60"}`}>⚠ Şüpheli (phishing)</button>
        <button disabled={ans !== null} onClick={() => decide(false)} className={`cursor-pointer rounded-xl border-2 px-4 py-3 text-sm font-bold transition ${ans === null ? "border-ok/50 bg-white text-ok hover:bg-[#E9F5EF]" : !m.phish ? "border-ok bg-[#E9F5EF] text-ok" : ans === false ? "border-bad bg-[#FAEDED] text-bad" : "border-line opacity-60"}`}>✓ Güvenilir</button>
      </div>
      {ans !== null && (
        <>
          <Feedback ok={ans === m.phish}>
            Bu e-posta <b>{m.phish ? "şüpheli (phishing)" : "güvenilir"}</b>.
            <ul className="mt-1 list-disc pl-5">
              {m.why.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </Feedback>
          <button className="btn-primary self-end" onClick={() => (i + 1 >= MAILS.length ? setFin(true) : (setI(i + 1), setAns(null), setShowUrl(false)))}>
            {i + 1 >= MAILS.length ? "Laboratuvarı bitir" : "Sonraki e-posta →"}
          </button>
        </>
      )}
    </LabFrame>
  );
}
