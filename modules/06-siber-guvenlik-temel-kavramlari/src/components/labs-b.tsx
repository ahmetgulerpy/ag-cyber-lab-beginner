"use client";

import { useEffect, useState } from "react";
import { Feedback, LabFrame } from "./ui";

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

/* ================= LAB 05: Vektörü belirle ================= */
const VEC_OPTS = ["Phishing", "Social Engineering", "Malware", "Credential Theft", "Exploited Vulnerability", "Misconfiguration", "Insider Threat", "Fiziksel Vektör"];
const VEC_SCEN = [
  { s: "Çalışanlara 'Hesabınız kapanacak' yazan e-posta gönderiliyor. Bağlantı, kurumsal giriş sayfasının birebir kopyasına gidiyor.", a: "Phishing", w: "Sahte e-posta ve sahte giriş sayfası ile kullanıcı kandırılıyor; ilk giriş yolu e-posta." },
  { s: "Biri 'IT destekten arıyorum' diyerek bir çalışandan telefonda uzaktan erişim programını açmasını istiyor.", a: "Social Engineering", w: "Teknik bir açık yok; insan telefonda ikna ediliyor." },
  { s: "Başka bir sitede sızdırılan kullanıcı adı ve parola listesi, kurumsal VPN girişinde deneniyor ve bir hesap açılıyor.", a: "Credential Theft", w: "Çalınmış/sızmış geçerli kimlik bilgileriyle giriş yapılıyor." },
  { s: "İnternete açık bir dosya sunucusunun bilinen, yama yayımlanmış bir açığı otomatik tarayıcıyla bulunup kullanılıyor.", a: "Exploited Vulnerability", w: "Yamasız bir zafiyet doğrudan istismar ediliyor; insan etkileşimi yok." },
  { s: "Bir bulut depolama klasörü yanlışlıkla 'herkes erişebilir' olarak ayarlanmış ve içeriği arama motorunda görünüyor.", a: "Misconfiguration", w: "Zafiyet yazılımda değil, hatalı ayardadır." },
  { s: "Yetkili bir çalışan işten ayrılmadan önce müşteri listesini kişisel e-postasına gönderiyor.", a: "Insider Threat", w: "Saldırgan kurum içinden; meşru yetkisini kötüye kullanıyor." },
  { s: "Bir e-postadaki 'Fatura.pdf.exe' eki açılınca bilgisayar enfekte oluyor ve dosyalar şifreleniyor.", a: "Malware", w: "Zararlı yazılım bir ek aracılığıyla sisteme ulaşmıştır." },
  { s: "Biri 'servis teknisyeniyim' diyerek binaya giriyor ve boş odadaki açık bir bilgisayara USB takıyor.", a: "Fiziksel Vektör", w: "Binaya ve cihaza fiziksel erişim sağlanmıştır." },
];

export function LabVector({ onDone }: LabProps) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [fin, setFin] = useState(false);
  useEffect(() => {
    if (fin) onDone();
  }, [fin, onDone]);
  const sc = VEC_SCEN[i];
  const choose = (o: string) => {
    if (pick) return;
    setPick(o);
    if (o === sc.a) setScore((s) => s + 1);
  };
  if (fin)
    return (
      <LabFrame>
        <div className="fade-in rounded-2xl bg-page p-6 text-center">
          <p className="label-mini">Laboratuvar tamamlandı</p>
          <p className="my-2 text-4xl font-extrabold text-brand">{score}/{VEC_SCEN.length}</p>
          <p className="text-sm text-muted">Doğru vektör tespiti.</p>
        </div>
      </LabFrame>
    );
  return (
    <LabFrame>
      <Progress done={i} total={VEC_SCEN.length} />
      <div className="rounded-2xl bg-soft p-4">
        <p className="label-mini text-brand">Senaryo {i + 1}</p>
        <p className="mt-1 text-ink">{sc.s}</p>
      </div>
      <p className="text-sm font-semibold text-ink">Kullanılan saldırı vektörü hangisi?</p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {VEC_OPTS.map((o) => {
          let cls = "border-line bg-white hover:bg-soft";
          if (pick) cls = o === sc.a ? "border-ok bg-[#E9F5EF]" : o === pick ? "border-bad bg-[#FAEDED]" : "border-line bg-white opacity-60";
          return (
            <button key={o} disabled={!!pick} onClick={() => choose(o)} className={`cursor-pointer rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition ${cls}`}>
              {o}
            </button>
          );
        })}
      </div>
      {pick && (
        <>
          <Feedback ok={pick === sc.a}>
            <b>{sc.a}.</b> {sc.w}
          </Feedback>
          <button className="btn-primary self-end" onClick={() => (i + 1 >= VEC_SCEN.length ? setFin(true) : (setI(i + 1), setPick(null)))}>
            {i + 1 >= VEC_SCEN.length ? "Laboratuvarı bitir" : "Sonraki senaryo →"}
          </button>
        </>
      )}
    </LabFrame>
  );
}

/* ================= LAB 06: Exploit / Payload simülasyonu (tamamen kurgusal) ================= */
const XSCEN = [
  {
    id: "blog",
    name: "DemoBlog 1.0 (kurgusal)",
    vuln: "Kurgusal zafiyet: Yorum alanında giriş doğrulaması yok.",
    exploits: [
      { n: "Doğrulanmamış girdiyi tetikleyen kurgusal istek", ok: true },
      { n: "Parola tahmin denemesi", ok: false },
      { n: "Fiziksel erişimle disk kopyalama", ok: false },
    ],
  },
  {
    id: "depo",
    name: "ÖrnekDepo (kurgusal)",
    vuln: "Kurgusal zafiyet: Yönetim paneli varsayılan yapılandırmayla açık.",
    exploits: [
      { n: "Sosyal mühendislik araması", ok: false },
      { n: "Varsayılan yapılandırmayı kullanan kurgusal erişim", ok: true },
      { n: "Zararlı e-posta eki", ok: false },
    ],
  },
  {
    id: "portal",
    name: "EskiPortal v2.1 (kurgusal)",
    vuln: "Kurgusal zafiyet: Yamasız eski bileşen uzaktan tetiklenebiliyor.",
    exploits: [
      { n: "Eski bileşenin bilinen açığını tetikleyen kurgusal yöntem", ok: true },
      { n: "Kullanıcıya sahte SMS", ok: false },
      { n: "Çalınan parola ile giriş", ok: false },
    ],
  },
];
const PAYLOADS = [
  { id: "msg", n: "Test mesajı göster", out: "Ekranda: 'ZAFİYET DOĞRULANDI (eğitim demosu)'", eff: "Zararsız kanıt: yalnızca zafiyetin varlığını gösterir." },
  { id: "ver", n: "Sürüm bilgisini raporla", out: "Rapor: 'EskiBileşen sürüm 2.1 – güncelleme gerekli'", eff: "Zararsız bilgi toplama: yama ihtiyacını gösterir." },
  { id: "log", n: "Test kaydı oluştur", out: "Günlük: 'test-kaydi-001 oluşturuldu (silinebilir)'", eff: "Zararsız iz bırakma: etki kontrollü ve geri alınabilir." },
];

export function LabExploit({ onDone }: LabProps) {
  const [sc, setSc] = useState(0);
  const [ex, setEx] = useState<number | null>(null);
  const [pl, setPl] = useState<string | null>(null);
  const [patched, setPatched] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [okPayloads, setOkPayloads] = useState<string[]>([]);
  const [blocked, setBlocked] = useState(false);
  const done = okPayloads.length >= 2 && blocked;
  useEffect(() => {
    if (done) onDone();
  }, [done, onDone]);
  const s = XSCEN[sc];
  const run = () => {
    if (ex === null || !pl) return;
    const e = s.exploits[ex];
    const p = PAYLOADS.find((x) => x.id === pl)!;
    const lines = [`[SİMÜLASYON] Hedef: ${s.name}`, `[1] Zafiyet: ${s.vuln.replace("Kurgusal zafiyet: ", "")}`, `[2] Exploit seçildi: ${e.n}`];
    if (patched) {
      lines.push("[2] Sonuç: BAŞARISIZ – zafiyet yamalanmış, exploit etkisiz.", "[3] Payload çalıştırılmadı.", "[4] Sonuç: Zincir kırıldı. Savunma başarılı.");
      setBlocked(true);
    } else if (!e.ok) {
      lines.push("[2] Sonuç: BAŞARISIZ – bu yöntem bu zafiyetle eşleşmiyor.", "[3] Payload çalıştırılmadı.", "[4] Sonuç: Doğru exploit, doğru zafiyete karşı seçilmeli.");
    } else {
      lines.push("[2] Sonuç: BAŞARILI – zafiyet tetiklendi (kapı açıldı).", `[3] Payload: ${p.n}`, `[3] Çıktı: ${p.out}`, `[4] Etki: ${p.eff}`);
      if (!okPayloads.includes(pl)) setOkPayloads([...okPayloads, pl]);
    }
    lines.push("— Bu çıktı tamamen kurgusaldır; gerçek bir sisteme istek gönderilmedi. —");
    setLog(lines);
  };
  return (
    <LabFrame note="Tamamen kurgusal, önceden tanımlı eğitim senaryoları. Gerçek sisteme hiçbir istek gönderilmez.">
      <div className="grid gap-2 sm:grid-cols-3">
        {XSCEN.map((x, i) => (
          <button key={x.id} onClick={() => { setSc(i); setEx(null); setLog([]); }} className={`cursor-pointer rounded-xl border-2 p-3 text-left text-sm transition ${sc === i ? "border-brand bg-soft" : "border-line bg-white hover:bg-soft"}`}>
            <b>{x.name}</b>
            <span className="mt-1 block text-xs text-muted">{x.vuln}</span>
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="label-mini mb-2">1) Exploit seç (zafiyeti hedefleyen yöntem)</p>
          <div className="flex flex-col gap-1.5">
            {s.exploits.map((e, i) => (
              <button key={e.n} onClick={() => setEx(i)} className={`cursor-pointer rounded-lg border-2 px-3 py-2 text-left text-sm transition ${ex === i ? "border-bad bg-[#FAEDED]" : "border-line bg-white hover:bg-soft"}`}>
                {e.n}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="label-mini mb-2">2) Payload seç (zararsız demo)</p>
          <div className="flex flex-col gap-1.5">
            {PAYLOADS.map((p) => (
              <button key={p.id} onClick={() => setPl(p.id)} className={`cursor-pointer rounded-lg border-2 px-3 py-2 text-left text-sm transition ${pl === p.id ? "border-accent bg-soft" : "border-line bg-white hover:bg-soft"}`}>
                {p.n}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink">
          <input type="checkbox" checked={patched} onChange={(e) => setPatched(e.target.checked)} className="h-4 w-4 accent-[#176B87]" />
          Zafiyet yamalandı (savunma)
        </label>
        <button className="btn-primary" disabled={ex === null || !pl} onClick={run}>▶ Simülasyonu çalıştır</button>
      </div>
      <pre className="min-h-32 overflow-x-auto whitespace-pre-wrap rounded-xl bg-ink p-4 font-mono text-xs leading-relaxed text-[#CDE7EE]">
        {log.length ? log.join("\n") : "Bir exploit ve bir payload seçip simülasyonu çalıştır…"}
      </pre>
      <div className="grid gap-2 text-sm sm:grid-cols-2">
        <p className={`rounded-lg px-3 py-2 ${okPayloads.length >= 2 ? "bg-[#E9F5EF] text-ok" : "bg-page text-muted"}`}>
          {okPayloads.length >= 2 ? "✓" : "○"} Aynı exploit ile 2 farklı payload dene ({okPayloads.length}/2)
        </p>
        <p className={`rounded-lg px-3 py-2 ${blocked ? "bg-[#E9F5EF] text-ok" : "bg-page text-muted"}`}>
          {blocked ? "✓" : "○"} Yama açıkken exploit&apos;in engellendiğini gör
        </p>
      </div>
    </LabFrame>
  );
}

/* ================= LAB 07: Giriş ve yetkilendirme ================= */
const ROLES = [
  { id: "admin", n: "Ali", r: "Admin" },
  { id: "editor", n: "Elif", r: "Editor" },
  { id: "user", n: "Umut", r: "User" },
  { id: "guest", n: "Gül", r: "Guest" },
];
const RESOURCES = [
  { n: "Genel Duyurular", a: ["admin", "editor", "user", "guest"] },
  { n: "Kendi Profili", a: ["admin", "editor", "user"] },
  { n: "İçerik Düzenleme", a: ["admin", "editor"] },
  { n: "Kullanıcı Yönetimi", a: ["admin"] },
  { n: "Sistem Ayarları", a: ["admin"] },
  { n: "Güvenlik Günlükleri", a: ["admin"] },
];

export function LabAuth({ onDone }: LabProps) {
  const [role, setRole] = useState<string | null>(null);
  const [step, setStep] = useState<"pick" | "pass" | "mfa" | "in">("pick");
  const [pw, setPw] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [tries, setTries] = useState<Record<string, boolean>>({});
  const [last, setLast] = useState<{ ok: boolean; t: string } | null>(null);
  const hasDenied = Object.values(tries).some((v) => !v);
  const done = Object.keys(tries).length >= 3 && hasDenied;
  useEffect(() => {
    if (done) onDone();
  }, [done, onDone]);
  const u = ROLES.find((x) => x.id === role);
  const logout = () => {
    setStep("pick");
    setRole(null);
    setPw("");
    setCode("");
    setErr("");
    setLast(null);
  };
  const request = (r: (typeof RESOURCES)[number]) => {
    const ok = r.a.includes(role!);
    setTries({ ...tries, [`${role}:${r.n}`]: ok });
    setLast({ ok, t: ok ? `Yetki kontrolü geçti: ${u!.r} rolü "${r.n}" kaynağına erişebilir.` : `Erişim reddedildi (403): ${u!.r} rolünün "${r.n}" için yetkisi yok. Kimliğin doğrulanmış olması yetki vermez.` });
  };
  return (
    <LabFrame>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card flex flex-col gap-3 !p-4">
          <p className="label-mini">Giriş simülatörü</p>
          {step === "pick" && (
            <>
              <p className="text-sm text-ink/85">Bir kullanıcı seç:</p>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((r) => (
                  <button key={r.id} onClick={() => { setRole(r.id); setStep("pass"); }} className="cursor-pointer rounded-xl border-2 border-line bg-white p-3 text-left transition hover:bg-soft">
                    <b className="block text-sm">{r.n}</b>
                    <span className="text-xs text-muted">Rol: {r.r}</span>
                  </button>
                ))}
              </div>
            </>
          )}
          {step === "pass" && u && (
            <>
              <p className="text-sm text-ink/85"><b>1. Adım – Parola doğrulama</b> ({u.n})</p>
              <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Parola" className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand" />
              <p className="text-xs text-muted">Demo parola: <code className="rounded bg-soft px-1">demo123</code></p>
              {err && <p className="text-sm text-bad">{err}</p>}
              <div className="flex gap-2">
                <button className="btn-primary" onClick={() => (pw === "demo123" ? (setStep("mfa"), setErr("")) : setErr("Parola hatalı: kimlik doğrulama başarısız. (Henüz yetki sorusu bile sorulmadı.)"))}>Devam</button>
                <button className="btn-ghost" onClick={logout}>İptal</button>
              </div>
            </>
          )}
          {step === "mfa" && u && (
            <>
              <p className="text-sm text-ink/85"><b>2. Adım – MFA</b></p>
              <div className="rounded-xl bg-ink p-3 text-center text-xs text-[#CDE7EE]">📱 Telefon (simülasyon)<br /><span className="font-mono text-xl tracking-widest">482915</span></div>
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="6 haneli kod" className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand" />
              {err && <p className="text-sm text-bad">{err}</p>}
              <div className="flex gap-2">
                <button className="btn-primary" onClick={() => (code === "482915" ? (setStep("in"), setErr("")) : setErr("Kod hatalı."))}>Doğrula</button>
                <button className="btn-ghost" onClick={logout}>İptal</button>
              </div>
            </>
          )}
          {step === "in" && u && (
            <>
              <p className="rounded-lg bg-[#E9F5EF] px-3 py-2 text-sm text-ok">✓ Kimlik doğrulandı: <b>{u.n}</b> · Oturum açıldı · Rol: <b>{u.r}</b></p>
              <p className="text-sm text-ink/85"><b>3. Adım – Kaynak iste</b> (yetkilendirme)</p>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {RESOURCES.map((r) => (
                  <button key={r.n} onClick={() => request(r)} className="cursor-pointer rounded-lg border border-line bg-white px-3 py-2 text-left text-sm transition hover:bg-soft">{r.n}</button>
                ))}
              </div>
              {last && <Feedback ok={last.ok}>{last.t}</Feedback>}
              <button className="btn-ghost self-start" onClick={logout}>Oturumu kapat / başka kullanıcı</button>
            </>
          )}
        </div>
        <div className="card !p-4">
          <p className="label-mini mb-2">Rol – kaynak erişim matrisi</p>
          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs">
              <thead>
                <tr>
                  <th className="p-1.5 text-left">Kaynak</th>
                  {ROLES.map((r) => (
                    <th key={r.id} className={`p-1.5 ${role === r.id ? "rounded-t-lg bg-soft text-brand" : ""}`}>{r.r}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RESOURCES.map((res) => (
                  <tr key={res.n} className="border-t border-line">
                    <td className="p-1.5 text-left font-medium">{res.n}</td>
                    {ROLES.map((r) => (
                      <td key={r.id} className={`p-1.5 ${role === r.id ? "bg-soft" : ""}`}>
                        {res.a.includes(r.id) ? <span className="font-bold text-ok">✓</span> : <span className="text-bad">✕</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">Görev: Giriş yap, en az 3 kaynak dene ve en az bir kez reddedilen erişim gör. ({Object.keys(tries).length}/3 deneme{hasDenied ? ", ret görüldü ✓" : ""})</p>
        </div>
      </div>
    </LabFrame>
  );
}

/* ================= LAB 08: Yetki düzenleyici ================= */
const PRES = ["Müşteri CRM", "Finans Sistemi", "Kaynak Kod Deposu", "Sunucu Yönetimi", "İK Dosyaları", "Üretim Veritabanı"];
const EMP = [
  { n: "Ayşe", job: "Satış temsilcisi", need: [0], init: [0, 1, 4] },
  { n: "Burak", job: "Muhasebe uzmanı", need: [1], init: [0, 1, 5] },
  { n: "Cem", job: "Yazılımcı", need: [2], init: [0, 2, 3, 5] },
  { n: "Deniz", job: "İK uzmanı", need: [4], init: [1, 3, 4] },
];

export function LabPrivilege({ onDone }: LabProps) {
  const [grants, setGrants] = useState<number[][]>(EMP.map((e) => e.init));
  const [evald, setEvald] = useState(false);
  const allOk = EMP.every((e, i) => e.need.every((n) => grants[i].includes(n)) && grants[i].every((g) => e.need.includes(g)));
  useEffect(() => {
    if (evald && allOk) onDone();
  }, [evald, allOk, onDone]);
  const toggle = (i: number, r: number) => {
    setEvald(false);
    setGrants(grants.map((g, k) => (k === i ? (g.includes(r) ? g.filter((x) => x !== r) : [...g, r]) : g)));
  };
  const excess = grants.reduce((a, g, i) => a + g.filter((x) => !EMP[i].need.includes(x)).length, 0);
  return (
    <LabFrame>
      <div className="rounded-xl bg-soft p-3 text-sm text-ink/90">
        <b>Görev:</b> Her çalışanın yalnızca <b>görevi için gerekli</b> yetkiye sahip olmasını sağla. Gereksiz yetkileri kapat; gerekli yetkiyi kapatma.
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {EMP.map((e, i) => {
          const miss = e.need.filter((n) => !grants[i].includes(n));
          const over = grants[i].filter((g) => !e.need.includes(g));
          return (
            <div key={e.n} className="card flex flex-col gap-2 !p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-ink">{e.n}</p>
                  <p className="text-xs text-muted">{e.job} · Görev gereği: {e.need.map((n) => PRES[n]).join(", ")}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${over.length ? "bg-[#FAEDED] text-bad" : "bg-[#E9F5EF] text-ok"}`}>{over.length ? `${over.length} fazla yetki` : "Temiz"}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {PRES.map((r, k) => {
                  const on = grants[i].includes(k);
                  const needed = e.need.includes(k);
                  let cls = "border-line bg-white text-muted";
                  if (on) cls = needed ? "border-ok bg-[#E9F5EF] text-ok" : "border-bad bg-[#FAEDED] text-bad";
                  return (
                    <button key={r} onClick={() => toggle(i, k)} className={`cursor-pointer rounded-lg border-2 px-2 py-1.5 text-left text-xs font-semibold transition ${cls}`}>
                      {on ? "● " : "○ "} {r}
                    </button>
                  );
                })}
              </div>
              {evald && (
                <p className="text-xs text-ink/85">
                  {over.length === 0 && miss.length === 0 ? "✓ Yapılandırma doğru." : `${over.length ? `Gereksiz: ${over.map((o) => PRES[o]).join(", ")}. ` : ""}${miss.length ? `Eksik: ${miss.map((o) => PRES[o]).join(", ")}.` : ""}`}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button className="btn-primary" onClick={() => setEvald(true)}>Yapılandırmayı değerlendir</button>
        <p className="text-sm text-ink/85">Toplam gereksiz yetki: <b className={excess ? "text-bad" : "text-ok"}>{excess}</b></p>
        {evald && allOk && <p className="text-sm font-semibold text-ok">Harika: en az ayrıcalık uygulandı!</p>}
      </div>
    </LabFrame>
  );
}
