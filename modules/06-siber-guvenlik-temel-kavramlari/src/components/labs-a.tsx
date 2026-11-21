"use client";

import { useEffect, useState } from "react";
import { Feedback, LabFrame } from "./ui";
import { LEVELS } from "./visuals-a";

type LabProps = { onDone: () => void };

function Progress({ done, total }: { done: number; total: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-soft">
        <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${(done / total) * 100}%` }} />
      </div>
      <span className="text-xs font-semibold text-muted">
        {done}/{total}
      </span>
    </div>
  );
}

/* ================= LAB 01: CIA eşleştirme ================= */
const CIA_EVENTS = [
  { t: "Yetkisiz bir kişi müşteri verilerini okudu.", a: "C", w: "Veri değişmedi ve sistem çalışıyor; sorun yetkisiz görüntülemedir → Gizlilik." },
  { t: "Veritabanındaki sipariş kayıtları yetkisiz biçimde değiştirildi.", a: "I", w: "Verinin doğruluğu bozulmuştur → Bütünlük." },
  { t: "Bir web sitesi yoğun trafik saldırısıyla hizmet dışı kaldı.", a: "A", w: "Yetkili kullanıcılar siteye ulaşamıyor → Erişilebilirlik." },
  { t: "Şifrelenmemiş bir laptop çalındı; içinde müşteri listesi vardı.", a: "C", w: "Üçüncü kişiler veriyi okuyabilir → Gizlilik ihlali riski." },
  { t: "Bir faturadaki IBAN numarası sahte olarak değiştirildi.", a: "I", w: "Belgenin içeriği değiştirilmiştir → Bütünlük." },
  { t: "Fidye yazılımı dosya sunucusunu şifreleyerek kullanılamaz hale getirdi.", a: "A", w: "Birincil etki erişimin kaybıdır → Erişilebilirlik (veri çalındıysa gizlilik de etkilenir)." },
  { t: "Maaş listesi yanlışlıkla tüm şirkete e-posta ile gönderildi.", a: "C", w: "Hassas bilgi yetkisiz kişilere ulaştı → Gizlilik." },
  { t: "Sunucu odasında elektrik kesildi; jeneratör ve yedek sistem yok.", a: "A", w: "Sistemler çalışamadığı için hizmet verilemiyor → Erişilebilirlik." },
];
const CIA_OPT = [
  { k: "C", l: "Gizlilik (C)" },
  { k: "I", l: "Bütünlük (I)" },
  { k: "A", l: "Erişilebilirlik (A)" },
];

export function LabCIA({ onDone }: LabProps) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [fin, setFin] = useState(false);
  useEffect(() => {
    if (fin) onDone();
  }, [fin, onDone]);
  const e = CIA_EVENTS[i];
  const choose = (k: string) => {
    if (pick) return;
    setPick(k);
    if (k === e.a) setScore((s) => s + 1);
  };
  const next = () => {
    if (i + 1 >= CIA_EVENTS.length) setFin(true);
    else {
      setI(i + 1);
      setPick(null);
    }
  };
  if (fin)
    return (
      <LabFrame>
        <div className="fade-in rounded-2xl bg-page p-6 text-center">
          <p className="label-mini">Laboratuvar tamamlandı</p>
          <p className="my-2 text-4xl font-extrabold text-brand">{score}/{CIA_EVENTS.length}</p>
          <p className="text-sm text-muted">Doğru eşleştirme. Sonuç bölümünü aşağıda incele ya da laboratuvarı sıfırla.</p>
        </div>
      </LabFrame>
    );
  return (
    <LabFrame>
      <Progress done={i} total={CIA_EVENTS.length} />
      <div className="rounded-2xl bg-soft p-4">
        <p className="label-mini text-brand">Olay {i + 1}</p>
        <p className="mt-1 font-semibold text-ink">{e.t}</p>
      </div>
      <p className="text-sm font-semibold text-ink">Bu olay en çok hangi prensibi etkiliyor?</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {CIA_OPT.map((o) => {
          let cls = "border-line bg-white hover:bg-soft";
          if (pick) cls = o.k === e.a ? "border-ok bg-[#E9F5EF]" : o.k === pick ? "border-bad bg-[#FAEDED]" : "border-line bg-white opacity-60";
          return (
            <button key={o.k} onClick={() => choose(o.k)} disabled={!!pick} className={`cursor-pointer rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${cls}`}>
              {o.l}
            </button>
          );
        })}
      </div>
      {pick && (
        <>
          <Feedback ok={pick === e.a}>{e.w}</Feedback>
          <button className="btn-primary self-end" onClick={next}>
            {i + 1 >= CIA_EVENTS.length ? "Laboratuvarı bitir" : "Sonraki olay →"}
          </button>
        </>
      )}
    </LabFrame>
  );
}

/* ================= LAB 02: Varlık / Tehdit / Zafiyet ================= */
type Cat = "asset" | "threat" | "vuln";
const ATV_ITEMS: { t: string; c: Cat; why: string }[] = [
  { t: "Müşteri veritabanı", c: "asset", why: "Kurum için değeri olan bilgi → Varlık." },
  { t: "Web sunucusu", c: "asset", why: "Hizmet sunan değerli bir bileşen → Varlık." },
  { t: "Kaynak kod deposu", c: "asset", why: "Fikri mülkiyet içerir → Varlık." },
  { t: "Çalışan laptopları", c: "asset", why: "Donanım ve veri taşır → Varlık." },
  { t: "Fidye yazılımı grubu", c: "threat", why: "Zarar verme potansiyeli olan aktör → Tehdit." },
  { t: "Kızgın eski çalışan", c: "threat", why: "Kötü niyetli olabilecek kaynak → Tehdit." },
  { t: "Sunucu odasında yangın", c: "threat", why: "Çevresel olay, zarar potansiyeli → Tehdit." },
  { t: "Phishing kampanyası", c: "threat", why: "Dışarıdan gelen saldırı girişimi → Tehdit." },
  { t: "Yamasız VPN cihazı", c: "vuln", why: "Sistemdeki bilinen zayıflık → Zafiyet." },
  { t: "Varsayılan yönetici parolası", c: "vuln", why: "Kolay tahmin edilen zayıflık → Zafiyet." },
  { t: "Şifrelenmemiş yedek diski", c: "vuln", why: "Verinin korunmasındaki eksiklik → Zafiyet." },
  { t: "E-postada MFA olmaması", c: "vuln", why: "Kimlik doğrulamadaki zayıflık → Zafiyet." },
];
const CAT_LABEL: Record<Cat, string> = { asset: "Varlık (Asset)", threat: "Tehdit (Threat)", vuln: "Zafiyet (Vulnerability)" };

export function LabATV({ onDone }: LabProps) {
  const [placed, setPlaced] = useState<Record<number, Cat>>({});
  const [sel, setSel] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const [wrong, setWrong] = useState(0);
  const total = ATV_ITEMS.length;
  const count = Object.keys(placed).length;
  useEffect(() => {
    if (count === total) onDone();
  }, [count, total, onDone]);
  const drop = (c: Cat) => {
    if (sel === null) {
      setMsg({ ok: false, t: "Önce soldaki listeden bir öğe seç." });
      return;
    }
    const it = ATV_ITEMS[sel];
    if (it.c === c) {
      setPlaced({ ...placed, [sel]: c });
      setMsg({ ok: true, t: it.why });
      setSel(null);
    } else {
      setWrong((w) => w + 1);
      setMsg({ ok: false, t: `"${it.t}" bu kategoriye ait değil. İpucu: ${it.c === "asset" ? "Korunacak değer mi?" : it.c === "threat" ? "Zarar verebilecek kaynak mı?" : "Kullanılabilecek zayıflık mı?"}` });
    }
  };
  return (
    <LabFrame>
      <div className="rounded-xl bg-soft p-3 text-sm text-ink/90">
        <b>Mavi Yıldız Lojistik</b> şirketinin denetiminde toplanan öğeleri doğru kategoriye yerleştir.
      </div>
      <Progress done={count} total={total} />
      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-1.5">
          <p className="label-mini">Öğeler</p>
          {ATV_ITEMS.map((it, i) =>
            placed[i] ? null : (
              <button key={it.t} onClick={() => setSel(i)} className={`cursor-pointer rounded-lg border px-3 py-2 text-left text-sm transition ${sel === i ? "border-brand bg-brand text-white" : "border-line bg-white hover:bg-soft"}`}>
                {it.t}
              </button>
            ),
          )}
          {count === total && <p className="text-sm font-semibold text-ok">Tüm öğeler yerleştirildi 🎉</p>}
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {(Object.keys(CAT_LABEL) as Cat[]).map((c) => (
            <button key={c} onClick={() => drop(c)} className="flex min-h-40 cursor-pointer flex-col gap-1.5 rounded-2xl border-2 border-dashed border-accent bg-white p-3 text-left transition hover:bg-soft">
              <span className="text-sm font-bold text-brand">{CAT_LABEL[c]}</span>
              {ATV_ITEMS.map((it, i) =>
                placed[i] === c ? (
                  <span key={it.t} className="rounded-md bg-[#E9F5EF] px-2 py-1 text-xs font-medium text-ok">✓ {it.t}</span>
                ) : null,
              )}
            </button>
          ))}
        </div>
      </div>
      {msg && <Feedback ok={msg.ok}>{msg.t}</Feedback>}
      <p className="text-xs text-muted">Hatalı yerleştirme sayısı: {wrong}</p>
    </LabFrame>
  );
}

/* ================= LAB 03: Risk hesaplayıcı ================= */
const RISK_EVENTS = [
  { t: "Çalışan parolalarının phishing ile çalınması", ref: [3, 3] },
  { t: "Ana veritabanının fidye yazılımıyla şifrelenmesi", ref: [2, 3] },
  { t: "Ofis yazıcısının internete açık olması", ref: [2, 1] },
  { t: "Kampanya web sitesinin bir saat kesintiye uğraması", ref: [2, 2] },
];
const LBL = ["Düşük", "Orta", "Yüksek"];
const STRATS = [
  { k: "mit", n: "Azaltma", d: "Olasılığı düşürür" },
  { k: "avoid", n: "Kaçınma", d: "Faaliyeti sonlandırır" },
  { k: "acc", n: "Kabul", d: "Riski olduğu gibi üstlenir" },
  { k: "tr", n: "Transfer", d: "Etkiyi devreder" },
];

export function LabRisk({ onDone }: LabProps) {
  const [vals, setVals] = useState(RISK_EVENTS.map(() => ({ l: 2, i: 2, s: "" })));
  const chosen = vals.filter((v) => v.s).length;
  useEffect(() => {
    if (chosen === RISK_EVENTS.length) onDone();
  }, [chosen, onDone]);
  const upd = (n: number, p: Partial<(typeof vals)[number]>) => setVals(vals.map((v, i) => (i === n ? { ...v, ...p } : v)));
  const residual = (v: (typeof vals)[number]) => {
    if (v.s === "avoid") return 0;
    if (v.s === "mit") return Math.max(1, v.l - 1) * v.i;
    if (v.s === "tr") return v.l * Math.max(1, v.i - 1);
    return v.l * v.i;
  };
  const Seg = ({ val, on }: { val: number; on: (n: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3].map((n) => (
        <button key={n} onClick={() => on(n)} className={`flex-1 cursor-pointer rounded-lg border px-2 py-1.5 text-xs font-semibold transition ${val === n ? "border-brand bg-brand text-white" : "border-line bg-white hover:bg-soft"}`}>
          {LBL[n - 1]}
        </button>
      ))}
    </div>
  );
  return (
    <LabFrame>
      <Progress done={chosen} total={RISK_EVENTS.length} />
      <div className="grid gap-4 lg:grid-cols-2">
        {RISK_EVENTS.map((ev, n) => {
          const v = vals[n];
          const sc = v.l * v.i;
          const lv = LEVELS(sc);
          const res = residual(v);
          const rl = res === 0 ? { n: "Yok", c: "bg-ok", tc: "text-ok" } : LEVELS(res);
          return (
            <div key={ev.t} className="card flex flex-col gap-3 !p-4">
              <p className="text-sm font-bold text-ink">{ev.t}</p>
              <div>
                <p className="label-mini mb-1">Olasılık</p>
                <Seg val={v.l} on={(x) => upd(n, { l: x })} />
              </div>
              <div>
                <p className="label-mini mb-1">Etki</p>
                <Seg val={v.i} on={(x) => upd(n, { i: x })} />
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-extrabold text-white ${lv.c}`}>{sc}</div>
                <div>
                  <p className={`text-sm font-bold ${lv.tc}`}>Risk: {lv.n}</p>
                  <div className="mt-1 h-2 w-40 overflow-hidden rounded-full bg-soft">
                    <div className={`h-full ${lv.c}`} style={{ width: `${(sc / 9) * 100}%` }} />
                  </div>
                </div>
              </div>
              <div>
                <p className="label-mini mb-1">Strateji seç</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {STRATS.map((s) => (
                    <button key={s.k} onClick={() => upd(n, { s: s.k })} className={`cursor-pointer rounded-lg border px-2 py-1.5 text-left text-xs transition ${v.s === s.k ? "border-accent bg-accent text-white" : "border-line bg-white hover:bg-soft"}`}>
                      <b>{s.n}</b>
                      <span className="block opacity-80">{s.d}</span>
                    </button>
                  ))}
                </div>
              </div>
              {v.s && (
                <div className="fade-in rounded-xl bg-page p-3 text-xs text-ink/85">
                  <p>
                    <b>Artık risk:</b> <span className={`font-bold ${rl.tc}`}>{rl.n}</span>
                    {res > 0 && ` (${res})`}
                  </p>
                  <p className="mt-1 text-muted">
                    Uzman referansı: Olasılık {LBL[ev.ref[0] - 1]}, Etki {LBL[ev.ref[1] - 1]} ({LEVELS(ev.ref[0] * ev.ref[1]).n}). Senin değerlendirmen {v.l === ev.ref[0] && v.i === ev.ref[1] ? "referansla aynı." : "farklı; bağlama göre değişebilir."}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </LabFrame>
  );
}

/* ================= LAB 04: Saldırı yüzeyi avcısı ================= */
const SURF_ITEMS = [
  { t: "RDP (3389) portu internetten herkese açık", risky: true, fix: "Yalnızca VPN üzerinden erişime al, MFA ekle." },
  { t: "Yönetim paneli yalnızca VPN arkasında", risky: false, fix: "Doğru yapılandırma: erişim sınırlandırılmış." },
  { t: "Kimlik doğrulaması olmayan eski API v1 hâlâ yayında", risky: true, fix: "Eski API sürümünü kapat veya kimlik doğrulaması ekle." },
  { t: "Kurumsal e-posta hesaplarında MFA zorunlu", risky: false, fix: "MFA hesap ele geçirilmesini zorlaştırır." },
  { t: "Müşteri belgelerinin olduğu bulut klasörü herkese açık", risky: true, fix: "Varsayılanı özel yap, erişimi rol ile sınırla." },
  { t: "İşten ayrılan çalışanın aktif kullanıcı hesabı", risky: true, fix: "Ayrılış sürecinde hesabı hemen devre dışı bırak." },
  { t: "Güncel ve WAF korumalı kurumsal web sitesi", risky: false, fix: "Yamalı ve korumalı; risk kontrol altında." },
  { t: "Sunucu odasında kartlı giriş ve kamera", risky: false, fix: "Fiziksel erişim kontrol altında." },
  { t: "İnternete açık test veritabanı (varsayılan parola)", risky: true, fix: "Test ortamını izole et, varsayılan parolayı değiştir." },
  { t: "Resepsiyonda kilitsiz, USB portları açık bilgisayar", risky: true, fix: "Ekran kilidi ve USB kısıtlaması uygula." },
];

export function LabSurface({ onDone }: LabProps) {
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    if (checked) onDone();
  }, [checked, onDone]);
  const toggle = (i: number) => {
    if (checked) return;
    const n = new Set(marked);
    if (n.has(i)) n.delete(i);
    else n.add(i);
    setMarked(n);
  };
  const correct = SURF_ITEMS.filter((s, i) => marked.has(i) === s.risky).length;
  return (
    <LabFrame>
      <div className="rounded-xl bg-soft p-3 text-sm text-ink/90">
        <b>Görev:</b> Aşağıdaki sistem durumlarından saldırı yüzeyini genişleten <b>riskli</b> olanları işaretle, sonra kontrol et.
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {SURF_ITEMS.map((s, i) => {
          const on = marked.has(i);
          let cls = on ? "border-warn bg-[#FBF4E4]" : "border-line bg-white hover:bg-soft";
          if (checked) cls = on === s.risky ? "border-ok bg-[#E9F5EF]" : "border-bad bg-[#FAEDED]";
          return (
            <button key={s.t} onClick={() => toggle(i)} className={`cursor-pointer rounded-xl border-2 p-3 text-left text-sm transition ${cls}`}>
              <span className="flex items-start gap-2">
                <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs ${on ? "border-warn bg-warn text-white" : "border-line bg-white"}`}>{on ? "✓" : ""}</span>
                <span>
                  {s.t}
                  {checked && (
                    <span className="mt-1 block text-xs text-ink/75">
                      <b>{s.risky ? "Riskli" : "Güvenli"}.</b> {s.fix}
                    </span>
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {!checked ? (
          <button className="btn-primary" onClick={() => setChecked(true)}>Kontrol et</button>
        ) : (
          <>
            <p className="text-sm font-semibold text-ink">Sonuç: {correct}/{SURF_ITEMS.length} doğru değerlendirme</p>
            <button className="btn-ghost" onClick={() => { setChecked(false); setMarked(new Set()); }}>Yeniden dene</button>
          </>
        )}
      </div>
    </LabFrame>
  );
}
