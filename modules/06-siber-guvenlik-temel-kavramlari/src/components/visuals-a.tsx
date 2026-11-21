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

function Bullets({ label, items, tone = "brand" }: { label: string; items: string[]; tone?: "brand" | "bad" | "ok" }) {
  const c = tone === "bad" ? "text-bad" : tone === "ok" ? "text-ok" : "text-brand";
  return (
    <div>
      <p className={`label-mini mb-1.5 ${c}`}>{label}</p>
      <ul className="flex flex-col gap-1">
        {items.map((i) => (
          <li key={i} className="flex gap-2 text-sm text-ink/85">
            <span className={c}>▸</span>
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- 01 CIA ---------------- */
const CIA = {
  C: {
    name: "Gizlilik", en: "Confidentiality", q: "Kim görebilir?",
    desc: "Bilgiye yalnızca yetkili kişiler erişebilir.",
    ex: ["Şifreli e-posta ve disk", "Parola + MFA ile giriş", "Rol bazlı dosya erişimi"],
    breach: ["Yetkisiz kişinin müşteri verisini okuması", "Veri sızıntısı, parola çalınması"],
  },
  I: {
    name: "Bütünlük", en: "Integrity", q: "Doğru ve değişmemiş mi?",
    desc: "Veri doğru, eksiksiz ve yetkisiz değişiklikten uzaktır.",
    ex: ["Hash ile dosya doğrulama", "Dijital imza", "Değişiklik kayıtları (audit log)"],
    breach: ["Veritabanı kayıtlarının değiştirilmesi", "Sahte işlem veya bozulmuş dosya"],
  },
  A: {
    name: "Erişilebilirlik", en: "Availability", q: "Gerektiğinde ulaşılabilir mi?",
    desc: "Yetkili kullanıcılar sisteme ve veriye ihtiyaç duyduklarında erişebilir.",
    ex: ["Yedekleme ve felaket kurtarma", "Yedekli sunucular", "DDoS koruması"],
    breach: ["Web sitesinin hizmet dışı kalması", "Fidye yazılımıyla kilitlenen dosyalar"],
  },
} as const;

export function VisualCIA() {
  const [k, setK] = useState<keyof typeof CIA>("C");
  const pos = { C: [200, 55], I: [70, 255], A: [330, 255] } as const;
  const d = CIA[k];
  return (
    <div className="grid items-center gap-5 md:grid-cols-2">
      <svg viewBox="0 0 400 310" className="mx-auto w-full max-w-sm">
        <polygon points="200,55 70,255 330,255" fill="#E8F3F7" stroke="#DFE8ED" strokeWidth="2" />
        <text x="200" y="185" textAnchor="middle" className="fill-[#176B87]" fontSize="14" fontWeight="700">Bilgi</text>
        <text x="200" y="203" textAnchor="middle" className="fill-[#176B87]" fontSize="14" fontWeight="700">Güvenliği</text>
        {(Object.keys(pos) as (keyof typeof CIA)[]).map((key) => {
          const [x, y] = pos[key];
          const on = key === k;
          return (
            <g key={key} onClick={() => setK(key)} className="cursor-pointer" role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setK(key)}>
              <circle cx={x} cy={y} r={on ? 44 : 38} fill={on ? "#176B87" : "#FFFFFF"} stroke={on ? "#176B87" : "#38A3A5"} strokeWidth="3" />
              <text x={x} y={y - 2} textAnchor="middle" fontSize="26" fontWeight="800" fill={on ? "#fff" : "#176B87"}>{key}</text>
              <text x={x} y={y + 16} textAnchor="middle" fontSize="10" fontWeight="600" fill={on ? "#fff" : "#64748B"}>{CIA[key].name}</text>
            </g>
          );
        })}
      </svg>
      <Detail title={`${d.name} (${d.en})`} sub={d.q}>
        <p className="text-sm text-ink/85">{d.desc}</p>
        <Bullets label="Koruyan kontroller" items={[...d.ex]} />
        <Bullets label="İhlal örneği" items={[...d.breach]} tone="bad" />
      </Detail>
    </div>
  );
}

/* ---------------- 02 Asset-Threat-Vuln ---------------- */
export function VisualATV() {
  const [sel, setSel] = useState<"threat" | "vuln" | "asset">("threat");
  const [fixed, setFixed] = useState(false);
  const info = {
    threat: { t: "Tehdit (Threat)", d: "Zarar verme potansiyeli olan aktör veya olay.", e: "Örnek: Fidye yazılımı grubu, kötü niyetli çalışan, yangın.", c: "bg-bad" },
    vuln: { t: "Zafiyet (Vulnerability)", d: "Tehdidin kullanabileceği zayıflık.", e: "Örnek: Yamasız sunucu, zayıf parola, kilitli olmayan sunucu odası.", c: "bg-warn" },
    asset: { t: "Varlık (Asset)", d: "Kurum için değeri olan ve korunması gereken öğe.", e: "Örnek: Müşteri veritabanı, kaynak kod, itibar.", c: "bg-brand" },
  };
  const Box = ({ id, label, sub }: { id: keyof typeof info; label: string; sub: string }) => (
    <button
      onClick={() => setSel(id)}
      className={`flex-1 cursor-pointer rounded-2xl border-2 p-4 text-center transition ${sel === id ? "border-brand bg-soft" : "border-line bg-white hover:bg-soft"}`}
    >
      <span className={`mx-auto mb-2 block h-2 w-10 rounded-full ${info[id].c}`} />
      <p className="font-bold text-ink">{label}</p>
      <p className="text-xs text-muted">{sub}</p>
    </button>
  );
  const Arrow = ({ text, blocked }: { text: string; blocked?: boolean }) => (
    <div className="flex flex-col items-center justify-center px-1 py-1 text-xs font-semibold text-muted md:w-24">
      <span>{text}</span>
      <span className={`text-xl ${blocked ? "text-ok" : "text-bad"}`}>
        <span className="hidden md:inline">{blocked ? "⛔" : "→"}</span>
        <span className="md:hidden">{blocked ? "⛔" : "↓"}</span>
      </span>
    </div>
  );
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-stretch md:flex-row">
        <Box id="threat" label="Tehdit" sub="Threat" />
        <Arrow text={fixed ? "kullanamaz" : "istismar eder"} blocked={fixed} />
        <Box id="vuln" label="Zafiyet" sub="Vulnerability" />
        <Arrow text={fixed ? "ulaşamaz" : "erişim sağlar"} blocked={fixed} />
        <Box id="asset" label="Varlık" sub="Asset" />
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <Detail title={info[sel].t}>
            <p className="text-sm text-ink/85">{info[sel].d}</p>
            <p className="rounded-xl bg-page p-3 text-sm text-ink/85">{info[sel].e}</p>
          </Detail>
        </div>
        <div className="flex flex-1 flex-col justify-between gap-3 rounded-2xl border border-line bg-white p-5">
          <div>
            <p className="label-mini">Risk durumu</p>
            <p className={`mt-1 text-2xl font-extrabold ${fixed ? "text-ok" : "text-bad"}`}>{fixed ? "Risk Düşük" : "Risk Yüksek"}</p>
            <p className="mt-1 text-sm text-muted">
              {fixed ? "Zafiyet kapatıldı: tehdit varlığa ulaşamıyor." : "Üç öğe birleşti: tehdit, zafiyeti kullanarak varlığa zarar verebilir."}
            </p>
          </div>
          <button className={fixed ? "btn-ghost" : "btn-primary"} onClick={() => setFixed(!fixed)}>
            {fixed ? "Zafiyeti yeniden aç" : "Zafiyeti kapat (yama uygula)"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- 03 Risk ---------------- */
const STEPS = [
  { t: "Tanımla", d: "Varlıkları, tehditleri ve zafiyetleri belirle." },
  { t: "Değerlendir", d: "Her risk için olasılık ve etkiyi puanla." },
  { t: "Önceliklendir", d: "Risk seviyesine göre sırala." },
  { t: "İşle", d: "Azalt, kaçın, kabul et veya transfer et." },
  { t: "İzle", d: "Sonuçları takip et; değişikliklerde döngüyü tekrarla." },
];
export const LEVELS = (score: number) =>
  score >= 9 ? { n: "Kritik", c: "bg-bad", tc: "text-bad" } : score >= 6 ? { n: "Yüksek", c: "bg-[#E08A4C]", tc: "text-[#E08A4C]" } : score >= 3 ? { n: "Orta", c: "bg-warn", tc: "text-warn" } : { n: "Düşük", c: "bg-ok", tc: "text-ok" };
const LV = ["Düşük", "Orta", "Yüksek"];

export function VisualRisk() {
  const [step, setStep] = useState(0);
  const [cell, setCell] = useState<[number, number]>([2, 2]); // [impact, likelihood] 1..3
  const score = cell[0] * cell[1];
  const lv = LEVELS(score);
  const advice =
    lv.n === "Kritik" ? "Acil müdahale: riski azalt veya faaliyetten kaçın." : lv.n === "Yüksek" ? "Öncelikli azaltma planı hazırla." : lv.n === "Orta" ? "Planlı önlem al ve izle." : "Bilinçli kabul edilebilir; kaydını tut.";
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="label-mini mb-3">Risk yönetimi süreci</p>
        <div className="grid gap-2 md:grid-cols-5">
          {STEPS.map((s, i) => (
            <button
              key={s.t}
              onClick={() => setStep(i)}
              className={`relative cursor-pointer rounded-xl border-2 p-3 text-left transition ${i === step ? "border-brand bg-soft" : i < step ? "border-ok/40 bg-[#F2F9F5]" : "border-line bg-white hover:bg-soft"}`}
            >
              <span className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${i <= step ? "bg-brand" : "bg-muted"}`}>{i + 1}</span>
              <p className="text-sm font-bold text-ink">{s.t}</p>
            </button>
          ))}
        </div>
        <p className="fade-in mt-3 rounded-xl bg-page p-3 text-sm text-ink/85" key={step}>
          <b>{STEPS[step].t}:</b> {STEPS[step].d}
        </p>
        <div className="mt-2 flex gap-2">
          <button className="btn-ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>← Geri</button>
          <button className="btn-primary" disabled={step === STEPS.length - 1} onClick={() => setStep(step + 1)}>İleri →</button>
        </div>
      </div>
      <div className="grid items-start gap-5 md:grid-cols-[1fr_260px]">
        <div>
          <p className="label-mini mb-3">Etkileşimli risk matrisi (hücreye tıkla)</p>
          <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-1.5 text-center text-xs">
            {[3, 2, 1].map((imp) => (
              <div key={imp} className="contents">
                <div className="flex items-center justify-end pr-2 font-semibold text-muted">Etki: {LV[imp - 1]}</div>
                {[1, 2, 3].map((lik) => {
                  const l = LEVELS(imp * lik);
                  const on = cell[0] === imp && cell[1] === lik;
                  return (
                    <button
                      key={lik}
                      onClick={() => setCell([imp, lik])}
                      className={`cursor-pointer rounded-lg py-4 font-bold text-white transition ${l.c} ${on ? "ring-4 ring-ink/30" : "opacity-80 hover:opacity-100"}`}
                    >
                      {imp * lik}
                    </button>
                  );
                })}
              </div>
            ))}
            <div />
            {LV.map((x) => (
              <div key={x} className="pt-1 font-semibold text-muted">Olasılık: {x}</div>
            ))}
          </div>
        </div>
        <Detail title={`Risk: ${lv.n}`} sub={`Olasılık ${LV[cell[1] - 1]} × Etki ${LV[cell[0] - 1]} = ${score}`}>
          <p className="text-sm text-ink/85">{advice}</p>
        </Detail>
      </div>
    </div>
  );
}

/* ---------------- 04 Attack Surface ---------------- */
const SURF = [
  { id: "web", icon: "🌐", t: "Web Sunucusu", kind: "Dijital", exp: "İnternete açık, 80/443 portları", why: "Uygulama zafiyetleri ve otomatik taramalar buradan başlar.", fix: ["Yamaları güncel tut", "WAF kullan", "Gereksiz modülleri kapat"] },
  { id: "api", icon: "🔌", t: "API Uç Noktaları", kind: "Dijital", exp: "Kimlik doğrulamasız veya eski sürümler", why: "Unutulan uç noktalar yetkisiz veri sızdırabilir.", fix: ["API envanteri çıkar", "Eski sürümleri kapat", "Her istekte yetki kontrolü yap"] },
  { id: "db", icon: "🗄️", t: "Veritabanı", kind: "Dijital", exp: "Doğrudan internete açıksa kritik risk", why: "En değerli veri burada durur.", fix: ["Yalnızca iç ağdan erişim", "Şifreleme", "En az ayrıcalıklı hesaplar"] },
  { id: "acc", icon: "👤", t: "Kullanıcı Hesapları", kind: "İnsan", exp: "Zayıf parola, MFA yok, eski hesaplar", why: "Çalınan hesap ön kapıdan giriş sağlar.", fix: ["MFA zorunlu", "Ayrılanların hesabını kapat", "Parola politikası"] },
  { id: "net", icon: "📡", t: "Ağ Servisleri / Portlar", kind: "Dijital", exp: "RDP (3389), SSH (22), FTP (21)", why: "Açık yönetim portları sürekli taranır.", fix: ["VPN arkasına al", "Kullanılmayan portları kapat", "Güvenlik duvarı kuralları"] },
  { id: "cloud", icon: "☁️", t: "Bulut Depolama", kind: "Dijital", exp: "Yanlış yapılandırılmış herkese açık klasör", why: "Tek bir ayar hatası tüm veriyi açığa çıkarır.", fix: ["Varsayılan: özel", "Yapılandırma denetimi", "Erişim logları"] },
  { id: "room", icon: "🏢", t: "Sunucu Odası", kind: "Fiziksel", exp: "Kilitsiz kapı, açık USB portları", why: "Fiziksel erişim dijital kontrolleri atlatabilir.", fix: ["Kartlı giriş + kamera", "USB portlarını kısıtla", "Ziyaretçi kaydı"] },
  { id: "staff", icon: "🧑‍💼", t: "Çalışanlar", kind: "İnsan", exp: "Phishing ve sosyal mühendislik", why: "İnsan davranışı en esnek giriş noktasıdır.", fix: ["Farkındalık eğitimi", "Phishing simülasyonu", "Bildirim kültürü"] },
];

export function VisualSurface() {
  const [id, setId] = useState("web");
  const s = SURF.find((x) => x.id === id)!;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-2 rounded-2xl bg-soft p-4">
        <span className="rounded-full bg-bad px-3 py-1 text-xs font-bold text-white">İnternet / Saldırgan</span>
        <span className="text-muted">↓ ↓ ↓</span>
        <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
          {SURF.map((x) => (
            <button
              key={x.id}
              onClick={() => setId(x.id)}
              className={`cursor-pointer rounded-xl border-2 bg-white p-3 text-center transition ${id === x.id ? "border-brand shadow" : "border-line hover:border-accent"}`}
            >
              <span className="block text-2xl">{x.icon}</span>
              <span className="mt-1 block text-xs font-bold text-ink">{x.t}</span>
              <span className={`mt-1 inline-block rounded-full px-2 text-[10px] font-semibold ${x.kind === "Dijital" ? "bg-soft text-brand" : x.kind === "Fiziksel" ? "bg-[#FBF4E4] text-warn" : "bg-[#FAEDED] text-bad"}`}>{x.kind}</span>
            </button>
          ))}
        </div>
      </div>
      <Detail title={`${s.icon} ${s.t}`} sub={`${s.kind} saldırı yüzeyi`}>
        <p className="text-sm text-ink/85"><b>Maruziyet:</b> {s.exp}</p>
        <p className="text-sm text-ink/85"><b>Neden önemli?</b> {s.why}</p>
        <Bullets label="Yüzeyi küçültme" items={s.fix} tone="ok" />
      </Detail>
    </div>
  );
}

/* ---------------- 05 Attack Vector ---------------- */
const VECS = [
  { id: "phish", t: "Phishing", path: "Sahte e-posta → kullanıcı tıklar → sahte sayfa", def: "Farkındalık, e-posta filtresi, MFA" },
  { id: "se", t: "Social Engineering", path: "Telefon/yüz yüze ikna → kullanıcı bilgi verir", def: "Doğrulama prosedürü, eğitim" },
  { id: "mal", t: "Malware", path: "Zararlı ek/USB → cihaz enfekte olur → ağa yayılır", def: "EDR, ek filtreleme, USB kısıtı" },
  { id: "cred", t: "Credential Theft", path: "Sızan/çalınan parola → geçerli hesapla giriş", def: "MFA, benzersiz parola, izleme" },
  { id: "vuln", t: "Exploited Vulnerability", path: "Yamasız servis taranır → zafiyet kullanılır", def: "Yama yönetimi, zafiyet taraması" },
  { id: "misc", t: "Misconfiguration", path: "Açık panel/bulut deposu bulunur → doğrudan erişim", def: "Yapılandırma denetimi, sertleştirme" },
  { id: "ins", t: "Insider Threat", path: "Yetkili çalışan → yetkisini kötüye kullanır/hata yapar", def: "En az ayrıcalık, log, çıkış süreçleri" },
  { id: "phys", t: "Fiziksel Vektör", path: "Binaya giriş/cihaz çalma → doğrudan erişim", def: "Kartlı giriş, disk şifreleme, kamera" },
];

export function VisualVector() {
  const [id, setId] = useState("phish");
  const v = VECS.find((x) => x.id === id)!;
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
      <div className="grid grid-cols-[84px_1fr_84px] items-stretch gap-2 sm:grid-cols-[110px_1fr_110px]">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-bad/90 p-2 text-center text-xs font-bold text-white sm:text-sm">
          <span className="text-2xl">🕵️</span>Saldırgan
        </div>
        <div className="flex flex-col gap-1.5">
          {VECS.map((x) => (
            <button
              key={x.id}
              onClick={() => setId(x.id)}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${id === x.id ? "border-brand bg-brand font-semibold text-white" : "border-line bg-white text-ink hover:bg-soft"}`}
            >
              <span className="text-xs">{id === x.id ? "━━▶" : "───"}</span>
              {x.t}
            </button>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl bg-brand p-2 text-center text-xs font-bold text-white sm:text-sm">
          <span className="text-2xl">🎯</span>Hedef Sistem
        </div>
      </div>
      <Detail title={v.t} sub="Saldırı yolu">
        <p className="rounded-xl bg-page p-3 text-sm text-ink/85">{v.path}</p>
        <Bullets label="Savunma" items={v.def.split(", ")} tone="ok" />
      </Detail>
    </div>
  );
}

/* ---------------- 06 Exploit / Payload flow ---------------- */
const FLOW = [
  { t: "Vulnerability", tr: "Zafiyet", d: "Hedef sistemde bir zayıflık vardır (ör. yamasız yazılım).", def: "Zafiyet taraması ve yama yönetimi burada devreye girer.", c: "bg-warn" },
  { t: "Exploit", tr: "İstismar Yöntemi", d: "Zafiyeti tetikleyen yöntem uygulanır; kapı açılır.", def: "Yama, WAF, saldırı tespit sistemi (IDS/IPS).", c: "bg-bad" },
  { t: "Payload", tr: "Taşınan Etki", d: "Kapı açıldıktan sonra çalışan asıl işlev devreye girer.", def: "EDR, ağ izleme, en az ayrıcalık ve segmentasyon.", c: "bg-[#B44A4A]" },
  { t: "Sonuç", tr: "Etki", d: "Veri erişimi, hizmet kesintisi veya sistem kontrolü gibi sonuç oluşur.", def: "Yedekleme, olay müdahalesi, şifreleme.", c: "bg-ink" },
];
export function VisualExploit() {
  const [i, setI] = useState(0);
  const [patched, setPatched] = useState(false);
  const f = FLOW[i];
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-stretch">
        {FLOW.map((s, n) => {
          const blocked = patched && n > 0;
          return (
            <div key={s.t} className="flex flex-1 flex-col items-center gap-2 md:flex-row">
              <button
                onClick={() => setI(n)}
                className={`w-full flex-1 cursor-pointer rounded-2xl border-2 p-3 text-center transition ${i === n ? "border-brand bg-soft" : "border-line bg-white hover:bg-soft"} ${blocked ? "opacity-40" : ""}`}
              >
                <span className={`mx-auto mb-2 block h-2 w-10 rounded-full ${s.c}`} />
                <p className="text-sm font-bold text-ink">{s.t}</p>
                <p className="text-xs text-muted">{s.tr}</p>
              </button>
              {n < FLOW.length - 1 && <span className={`text-xl ${patched && n === 0 ? "text-ok" : "text-muted"}`}>{patched && n === 0 ? "⛔" : "→"}</span>}
            </div>
          );
        })}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Detail title={`${f.t} – ${f.tr}`} sub={`Adım ${i + 1} / 4`}>
          <p className="text-sm text-ink/85">{f.d}</p>
          <p className="rounded-xl bg-[#E9F5EF] p-3 text-sm text-ink/85"><b className="text-ok">Savunma noktası:</b> {f.def}</p>
        </Detail>
        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-line bg-white p-5">
          <div>
            <p className="label-mini">Zincir durumu</p>
            <p className={`mt-1 text-xl font-extrabold ${patched ? "text-ok" : "text-bad"}`}>{patched ? "Zincir kırıldı" : "Zincir tamamlanabilir"}</p>
            <p className="mt-1 text-sm text-muted">{patched ? "Zafiyet yamalandı; exploit çalışmadığı için payload ve sonuç oluşmaz." : "Yama yoksa zafiyet exploit ile kullanılabilir ve payload çalışabilir."}</p>
          </div>
          <button className={patched ? "btn-ghost" : "btn-primary"} onClick={() => setPatched(!patched)}>
            {patched ? "Yamayı geri al" : "Yama uygula"}
          </button>
        </div>
      </div>
    </div>
  );
}
