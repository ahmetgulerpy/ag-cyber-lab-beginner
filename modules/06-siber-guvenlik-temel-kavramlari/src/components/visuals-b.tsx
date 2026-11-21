"use client";

import { useState } from "react";

function Detail({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="fade-in flex flex-col gap-3 rounded-2xl border border-line bg-white p-5">
      {sub && <p className="label-mini text-accent">{sub}</p>}
      <h4 className="text-lg font-bold text-ink">{title}</h4>
      {children}
    </div>
  );
}

/* ---------------- 07 Auth flow ---------------- */
const AUTH_STEPS = [
  { t: "Giriş İsteği", k: "", d: "Kullanıcı kullanıcı adını girerek sisteme erişmek ister.", ok: "Sistem henüz kimseye güvenmez." },
  { t: "Parola Doğrulama", k: "AuthN", d: "Girilen parola kayıtlı doğrulayıcıyla (hash) karşılaştırılır.", ok: "Bildiğin şey doğrulandı." },
  { t: "MFA Doğrulama", k: "AuthN", d: "Telefondaki kod veya güvenlik anahtarı ikinci kanıt olarak istenir.", ok: "Sahip olduğun şey doğrulandı. Kimlik kesinleşti." },
  { t: "Oturum / Token", k: "Session", d: "Sistem geçici bir oturum tokenı oluşturur. Sonraki isteklerde bu token kimliği temsil eder.", ok: "Token süreli ve çıkışta iptal edilmelidir." },
  { t: "Yetki Kontrolü", k: "AuthZ", d: "Kullanıcının rolü, istenen kaynak ve işlem için politika ile karşılaştırılır.", ok: "Rol: Editor → 'Yazı düzenle' izinli, 'Kullanıcı sil' yasak." },
  { t: "Kaynağa Erişim", k: "AuthZ", d: "İzin verilen işlem gerçekleştirilir; her erişim loglanır.", ok: "Erişim kaydı denetim için saklanır." },
];
export function VisualAuthFlow() {
  const [i, setI] = useState(0);
  const s = AUTH_STEPS[i];
  const tag = (k: string) =>
    k === "AuthN" ? "bg-brand text-white" : k === "AuthZ" ? "bg-accent text-white" : k === "Session" ? "bg-warn text-white" : "bg-soft text-muted";
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {AUTH_STEPS.map((x, n) => (
          <button
            key={x.t}
            onClick={() => setI(n)}
            className={`cursor-pointer rounded-xl border-2 p-3 text-left transition ${n === i ? "border-brand bg-soft" : n < i ? "border-ok/40 bg-[#F2F9F5]" : "border-line bg-white hover:bg-soft"}`}
          >
            <span className="mb-1 flex items-center gap-1.5">
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${n <= i ? "bg-brand" : "bg-muted"}`}>{n + 1}</span>
              {x.k && <span className={`rounded px-1.5 text-[10px] font-bold ${tag(x.k)}`}>{x.k}</span>}
            </span>
            <p className="text-xs font-bold text-ink">{x.t}</p>
          </button>
        ))}
      </div>
      <Detail title={`${i + 1}. ${s.t}`} sub={s.k === "AuthN" ? "Kimlik Doğrulama aşaması" : s.k === "AuthZ" ? "Yetkilendirme aşaması" : s.k === "Session" ? "Oturum yönetimi" : "Başlangıç"}>
        <p className="text-sm text-ink/85">{s.d}</p>
        <p className="rounded-xl bg-page p-3 text-sm text-ink/85">{s.ok}</p>
      </Detail>
      <div className="flex gap-2">
        <button className="btn-ghost" disabled={i === 0} onClick={() => setI(i - 1)}>← Önceki adım</button>
        <button className="btn-primary" disabled={i === AUTH_STEPS.length - 1} onClick={() => setI(i + 1)}>Sonraki adım →</button>
      </div>
    </div>
  );
}

/* ---------------- 08 Least privilege cards ---------------- */
const RES = ["Müşteri verisi", "Finans kayıtları", "Kaynak kod", "Sunucu yönetimi", "Personel dosyaları"];
const LVL = ["Yok", "Okuma", "Yazma", "Tam yetki"];
const LVL_C = ["bg-line text-muted", "bg-soft text-brand", "bg-[#FBF4E4] text-warn", "bg-[#FAEDED] text-bad"];
const PEOPLE = [
  { n: "Deniz", r: "Stajyer", over: [3, 2, 2, 1, 1], lp: [0, 0, 1, 0, 0] },
  { n: "Elif", r: "Muhasebeci", over: [2, 3, 1, 1, 2], lp: [1, 2, 0, 0, 0] },
  { n: "Can", r: "Yazılımcı", over: [2, 1, 3, 3, 0], lp: [0, 0, 2, 0, 0] },
  { n: "Servis Hesabı", r: "Web uygulaması", over: [3, 3, 3, 3, 3], lp: [2, 0, 0, 0, 0] },
];
export function VisualLeast() {
  const [lp, setLp] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button className={`chip ${!lp ? "chip-active" : ""}`} onClick={() => setLp(false)}>Fazla yetkili yapı</button>
        <button className={`chip ${lp ? "chip-active" : ""}`} onClick={() => setLp(true)}>En az ayrıcalık yapısı</button>
        <span className="text-xs text-muted">Görünümü değiştirerek yetki farkını karşılaştır.</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {PEOPLE.map((p) => {
          const lv = lp ? p.lp : p.over;
          const total = lv.reduce((a, b) => a + b, 0);
          return (
            <div key={p.n} className="card flex flex-col gap-3 !p-4">
              <div>
                <p className="font-bold text-ink">{p.n}</p>
                <p className="text-xs text-muted">{p.r}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                {RES.map((r, i) => (
                  <div key={r} className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-ink/80">{r}</span>
                    <span className={`rounded-md px-2 py-0.5 font-semibold ${LVL_C[lv[i]]}`}>{LVL[lv[i]]}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="mb-1 flex justify-between text-[11px] font-semibold text-muted">
                  <span>Yetki yükü</span>
                  <span>{total}/15</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-soft">
                  <div className={`h-full rounded-full transition-all ${total > 8 ? "bg-bad" : total > 4 ? "bg-warn" : "bg-ok"}`} style={{ width: `${(total / 15) * 100}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="rounded-xl bg-page p-3 text-sm text-ink/85">
        {lp ? "Her kimlik yalnızca görevi için gereken kaynağa, gereken seviyede erişiyor. Bir hesap ele geçirilse bile etki küçük kalır." : "Çoğu kimlik görevinden fazla yetkiye sahip. Tek bir hesap ele geçirilirse saldırgan çok sayıda kaynağa ulaşabilir."}
      </p>
    </div>
  );
}

/* ---------------- 09 Defense in depth ---------------- */
export const LAYERS = [
  { id: "phys", t: "Fiziksel Güvenlik", d: "Bina, sunucu odası ve cihazlara fiziksel erişimi kontrol eder.", c: ["Kartlı giriş", "Kamera", "Kilitli sunucu dolapları"], stops: "Yetkisiz bina girişi, cihaz hırsızlığı" },
  { id: "net", t: "Ağ Güvenliği", d: "Ağ trafiğini filtreler ve bölümlere ayırır.", c: ["Güvenlik duvarı", "Segmentasyon", "IDS/IPS, VPN"], stops: "Ağ taraması, yatay hareket" },
  { id: "end", t: "Uç Nokta Güvenliği", d: "Laptop, telefon ve sunucuları korur.", c: ["EDR/antivirüs", "Yama yönetimi", "Disk şifreleme"], stops: "Zararlı yazılım, kayıp cihaz verisi" },
  { id: "app", t: "Uygulama Güvenliği", d: "Yazılımın güvenli geliştirilmesi ve korunması.", c: ["Giriş doğrulama", "WAF", "Kod gözden geçirme"], stops: "Web zafiyetleri, enjeksiyon" },
  { id: "iam", t: "Kimlik ve Erişim", d: "Kimin neye erişeceğini yönetir.", c: ["MFA", "RBAC", "Ayrıcalıklı hesap yönetimi"], stops: "Çalınan parola, yetki kötüye kullanımı" },
  { id: "data", t: "Veri Güvenliği", d: "Son savunma hattı: verinin kendisini korur.", c: ["Şifreleme", "Yedekleme", "DLP"], stops: "Veri sızıntısı, fidye yazılımı etkisi" },
  { id: "mon", t: "İzleme ve Müdahale", d: "Saldırıları görür ve hızla cevap verir.", c: ["SIEM/log", "Alarm kuralları", "Olay müdahale planı"], stops: "Fark edilmeyen sızmalar" },
];
export function VisualDepth() {
  const [id, setId] = useState("phys");
  const l = LAYERS.find((x) => x.id === id)!;
  const shades = ["#E8F3F7", "#D6EAF0", "#C4E1E9", "#B0D7E2", "#9ACBD9", "#7FBBCD", "#5FA6BD"];
  return (
    <div className="grid items-center gap-5 md:grid-cols-[1fr_1fr]">
      <div className="mx-auto w-full max-w-md">
        {LAYERS.reduceRight<React.ReactNode>(
          (inner, x, i) => (
            <div
              key={x.id}
              onClick={(e) => {
                e.stopPropagation();
                setId(x.id);
              }}
              className={`cursor-pointer rounded-2xl border-2 p-2.5 transition ${id === x.id ? "border-brand" : "border-white"}`}
              style={{ background: shades[i] }}
            >
              <p className={`mb-1.5 text-[11px] font-bold ${id === x.id ? "text-brand" : "text-ink/70"}`}>{i + 1}. {x.t}</p>
              {inner ?? <div className="rounded-xl bg-brand py-3 text-center text-sm font-bold text-white">🔒 Kritik Veri</div>}
            </div>
          ),
          null,
        )}
      </div>
      <Detail title={l.t} sub="Katman detayı">
        <p className="text-sm text-ink/85">{l.d}</p>
        <div>
          <p className="label-mini mb-1.5 text-brand">Örnek kontroller</p>
          <div className="flex flex-wrap gap-1.5">
            {l.c.map((c) => (
              <span key={c} className="rounded-full bg-soft px-2.5 py-1 text-xs font-semibold text-brand">{c}</span>
            ))}
          </div>
        </div>
        <p className="rounded-xl bg-[#E9F5EF] p-3 text-sm text-ink/85"><b className="text-ok">Durdurabileceği:</b> {l.stops}</p>
      </Detail>
    </div>
  );
}

/* ---------------- 10 Zero trust ---------------- */
export function VisualZeroTrust() {
  const [mode, setMode] = useState<"trad" | "zt">("trad");
  const [run, setRun] = useState(false);
  const servers = ["Dosya Sunucusu", "Finans Uygulaması", "Müşteri Veritabanı"];
  const trad = mode === "trad";
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <button className={`chip ${trad ? "chip-active" : ""}`} onClick={() => { setMode("trad"); setRun(false); }}>Geleneksel (çevre tabanlı)</button>
        <button className={`chip ${!trad ? "chip-active" : ""}`} onClick={() => { setMode("zt"); setRun(false); }}>Zero Trust</button>
      </div>
      <div className="grid items-stretch gap-3 md:grid-cols-[160px_1fr]">
        <div className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-bad/90 p-4 text-center text-sm font-bold text-white">
          <span className="text-2xl">🕵️</span>
          Çalınan hesapla saldırgan
          <span className="text-xs font-normal opacity-90">{run ? (trad ? "Çevreden geçti ✓" : "Kimlik doğrulaması geçti ✓") : "Hazır"}</span>
        </div>
        {trad ? (
          <div className="rounded-2xl border-2 border-dashed border-brand p-4">
            <p className="label-mini mb-3 text-brand">🛡️ Güvenilir iç ağ – kenarda tek güvenlik duvarı</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {servers.map((s) => (
                <div key={s} className={`rounded-xl border-2 p-3 text-center text-sm font-semibold transition ${run ? "border-bad bg-[#FAEDED] text-bad" : "border-line bg-white text-ink"}`}>
                  {s}
                  <span className="mt-1 block text-xs font-normal">{run ? "Erişildi ✕" : "Serbest dolaşım"}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-brand p-4">
            <p className="label-mini mb-3 text-brand">🔑 Her kaynakta bağımsız doğrulama (kimlik + cihaz + bağlam)</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {servers.map((s) => (
                <div key={s} className={`rounded-xl border-2 p-3 text-center text-sm font-semibold transition ${run ? "border-ok bg-[#E9F5EF] text-ok" : "border-line bg-white text-ink"}`}>
                  {s}
                  <span className="mt-1 block text-xs font-normal">{run ? "Cihaz/bağlam riskli → Reddedildi ✓" : "Politika kontrolü"}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button className="btn-primary" onClick={() => setRun(!run)}>{run ? "Sıfırla" : "Saldırıyı simüle et"}</button>
        <p className="text-sm text-ink/85">
          {run
            ? trad
              ? "Saldırgan çevreyi aştığı için içeride güven kazandı ve tüm kaynaklara ulaştı."
              : "Kimlik doğrulaması geçilse de her kaynak ayrıca cihaz ve bağlamı kontrol ettiği için saldırgan ilerleyemedi."
            : "Aynı saldırganın iki modeldeki ilerleyişini görmek için butona bas."}
        </p>
      </div>
    </div>
  );
}

/* ---------------- 11 Policy panel ---------------- */
const POLS = [
  { id: "pw", t: "Parola Politikası", p: "Güçlü ve benzersiz kimlik bilgilerini sağlamak.", cl: ["En az 12 karakter", "Parola yöneticisi kullanımı", "Tüm hesaplarda MFA"], v: "Parolanın e-posta ile paylaşılması" },
  { id: "ac", t: "Erişim Kontrol Politikası", p: "Kimin neye erişeceğini belirlemek.", cl: ["En az ayrıcalık", "Rol tabanlı erişim", "Üç ayda bir yetki incelemesi"], v: "Başkasının hesabını kullanmak" },
  { id: "au", t: "Kabul Edilebilir Kullanım", p: "Kurumsal cihaz ve ağın doğru kullanımı.", cl: ["Onaysız yazılım yüklenmez", "Kurumsal veri kişisel hesaba gönderilmez", "Şüpheli durum bildirilir"], v: "Kurumsal laptoba korsan yazılım yüklemek" },
  { id: "dp", t: "Veri Koruma Politikası", p: "Verinin sınıflandırılması ve korunması.", cl: ["Gizli veriler şifrelenir", "Yedekler düzenli alınır", "Veri saklama süreleri belirlenir"], v: "Müşteri verisini şifresiz USB'ye kopyalamak" },
  { id: "rw", t: "Uzaktan Çalışma Politikası", p: "Dışarıdan bağlantıların güvenliğini sağlamak.", cl: ["VPN zorunlu", "Cihazlar güncel olmalı", "Halka açık Wi‑Fi'da hassas işlem yapılmaz"], v: "Kafedeki açık Wi‑Fi'dan VPN'siz bağlanmak" },
];
export function VisualPolicy() {
  const [id, setId] = useState("pw");
  const p = POLS.find((x) => x.id === id)!;
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl bg-soft p-3 text-center text-sm font-semibold text-brand">Politika → Standart → Prosedür hiyerarşisi: önce kural, sonra ölçülebilir gereksinim, sonra adım adım talimat.</div>
      <div className="flex flex-wrap gap-2">
        {POLS.map((x) => (
          <button key={x.id} className={`chip ${id === x.id ? "chip-active" : ""}`} onClick={() => setId(x.id)}>{x.t}</button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Detail title="Amaç"><p className="text-sm text-ink/85">{p.p}</p></Detail>
        <Detail title="Örnek maddeler">
          <ul className="flex flex-col gap-1">
            {p.cl.map((c) => (
              <li key={c} className="flex gap-2 text-sm text-ink/85"><span className="text-ok">✓</span>{c}</li>
            ))}
          </ul>
        </Detail>
        <Detail title="İhlal örneği"><p className="text-sm text-bad">✕ {p.v}</p></Detail>
      </div>
    </div>
  );
}

/* ---------------- 12 Awareness behavior cards ---------------- */
const SCEN = [
  { id: "mail", t: "Şüpheli e-posta", safe: "Gönderen adresini ve bağlantıyı inceler, tıklamadan güvenlik ekibine bildirir.", risk: "Aciliyet baskısıyla bağlantıya tıklar ve parolasını girer.", out: "Güvenli: Saldırı durdurulur · Riskli: Hesap ele geçirilir" },
  { id: "pass", t: "Parola oluşturma", safe: "Uzun parola cümlesi + parola yöneticisi + MFA kullanır.", risk: "Her sitede aynı kısa parolayı kullanır.", out: "Güvenli: Sızıntı tek hesapla sınırlı · Riskli: Tüm hesaplar tehlikede" },
  { id: "usb", t: "Bulunan USB bellek", safe: "Takmadan güvenlik birimine teslim eder.", risk: "Merakla bilgisayara takar.", out: "Güvenli: Risk kalkar · Riskli: Zararlı yazılım bulaşabilir" },
  { id: "call", t: "'IT destek' araması", safe: "Kodu paylaşmaz, kurumun resmi hattından geri arayarak doğrular.", risk: "Doğrulama kodunu telefonda söyler.", out: "Güvenli: Sosyal mühendislik başarısız · Riskli: Hesap ele geçirilir" },
  { id: "wifi", t: "Kafede çalışma", safe: "VPN kullanır, hassas işlemleri ertelemeyi tercih eder.", risk: "Açık Wi‑Fi'da VPN'siz kurumsal sisteme bağlanır.", out: "Güvenli: Trafik korunur · Riskli: Trafik dinlenebilir" },
  { id: "upd", t: "Güncelleme bildirimi", safe: "Güncellemeyi hemen veya otomatik uygular.", risk: "Haftalarca 'sonra hatırlat' der.", out: "Güvenli: Bilinen açık kapanır · Riskli: Zafiyet açık kalır" },
];
export function VisualBehavior() {
  const [id, setId] = useState("mail");
  const s = SCEN.find((x) => x.id === id)!;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {SCEN.map((x) => (
          <button key={x.id} className={`chip ${id === x.id ? "chip-active" : ""}`} onClick={() => setId(x.id)}>{x.t}</button>
        ))}
      </div>
      <div key={id} className="fade-in grid gap-4 md:grid-cols-2">
        <div className="card border-2 !border-ok/50 !bg-[#F4FAF7]">
          <p className="label-mini text-ok">✓ Güvenli davranış</p>
          <p className="mt-2 text-sm text-ink/90">{s.safe}</p>
        </div>
        <div className="card border-2 !border-bad/50 !bg-[#FDF3F3]">
          <p className="label-mini text-bad">✕ Riskli davranış</p>
          <p className="mt-2 text-sm text-ink/90">{s.risk}</p>
        </div>
      </div>
      <p className="rounded-xl bg-page p-3 text-sm text-ink/85"><b>Sonuç:</b> {s.out}</p>
    </div>
  );
}
