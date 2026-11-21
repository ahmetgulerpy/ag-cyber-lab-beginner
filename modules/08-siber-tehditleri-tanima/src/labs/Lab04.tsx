"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge, Btn, Card, Choice, Feedback, InfoBox, LabPanel, Tabs } from "@/components/ui";
import { BinaryList, type BinItem } from "./shared";
import type { LabProps } from "./types";

type Cat = "iban" | "kart" | "eposta" | "parola" | "telefon" | "kimlik";
const CATS: { id: Cat; label: string; re: RegExp; risk: "Kritik" | "Yüksek" | "Orta"; color: string; use: string }[] = [
  { id: "iban", label: "IBAN", re: /\bTR\d{2}(?:\s?\d{4}){5}\s?\d{2}\b/gi, risk: "Yüksek", color: "#D69A32", use: "Dolandırıcılık ve sahte ödeme talepleri" },
  { id: "kart", label: "Kart numarası", re: /\b(?:\d[ -]?){13,16}\b/g, risk: "Kritik", color: "#C65353", use: "İzinsiz alışveriş" },
  { id: "eposta", label: "E-posta adresi", re: /[\w.+-]+@[\w-]+\.[\w.]+/g, risk: "Orta", color: "#38A3A5", use: "Hedefli kimlik avı ve hesap eşleştirme" },
  { id: "parola", label: "Parola", re: /(parola|şifre|sifre|password|pass)\s*[:=]\s*\S+/gi, risk: "Kritik", color: "#C65353", use: "Hesap ele geçirme" },
  { id: "telefon", label: "Telefon", re: /\b0?5\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}\b/g, risk: "Orta", color: "#176B87", use: "SMS ile kimlik avı, sosyal mühendislik" },
  { id: "kimlik", label: "TC Kimlik No", re: /\b\d{11}\b/g, risk: "Kritik", color: "#C65353", use: "Kimlik hırsızlığı" },
];

type Seg = { text: string; cat?: Cat };
function segment(text: string): { segs: Seg[]; found: Cat[] } {
  const hits: { s: number; e: number; cat: Cat }[] = [];
  CATS.forEach((c) => {
    for (const m of text.matchAll(new RegExp(c.re.source, c.re.flags))) {
      const s = m.index ?? 0;
      const e = s + m[0].length;
      if (hits.some((h) => s < h.e && e > h.s)) continue;
      hits.push({ s, e, cat: c.id });
    }
  });
  hits.sort((a, b) => a.s - b.s);
  const segs: Seg[] = [];
  let pos = 0;
  hits.forEach((h) => {
    if (h.s > pos) segs.push({ text: text.slice(pos, h.s) });
    segs.push({ text: text.slice(h.s, h.e), cat: h.cat });
    pos = h.e;
  });
  if (pos < text.length) segs.push({ text: text.slice(pos) });
  return { segs, found: [...new Set(hits.map((h) => h.cat))] };
}

const SAMPLES = [
  "Merhaba, ben ornek.kisi@mail.test",
  "parola: Deneme!2025",
  "kartim 4111 1111 1111 1111",
  "kimlik 10000000146",
  "TR33 0006 1005 1978 6457 8413 26",
  "ara beni 0555 123 45 67",
  "bugun hava cok guzel",
];

const SENS: BinItem[] = [
  { icon: "🔑", title: "E-posta parolası", answer: true, why: "Parola hesabın anahtarıdır; ele geçirilirse hesabın tamamen kontrol edilir." },
  { icon: "🪪", title: "TC Kimlik numarası", answer: true, why: "Kimlik hırsızlığı ve resmî işlemlerde kötüye kullanılabilir." },
  { icon: "🍽️", title: "Okul kantini menüsü", answer: false, why: "Herkese açık, kişisel olmayan bilgidir; kötüye kullanım riski yoktur." },
  { icon: "💳", title: "Kredi kartı CVV kodu", answer: true, why: "CVV ile kart bilgileri birleşince izinsiz alışveriş yapılabilir." },
  { icon: "📱", title: "SMS doğrulama kodu", answer: true, why: "Tek kullanımlık kod hesabına girişi onaylar; asla paylaşılmamalıdır." },
  { icon: "🌦️", title: "Bugünkü hava durumu", answer: false, why: "Kişisel veri içermez; herkese açıktır." },
  { icon: "🏠", title: "Ev adresin ve ders çıkış saatlerin", answer: true, why: "Konum ve rutin bilgisi takip veya fiziksel risk oluşturabilir." },
  { icon: "🎵", title: "Favori şarkı listesi adı (herkese açık)", answer: false, why: "Kendi isteğinle paylaştığın düşük riskli bilgi. Yine de başka bilgilerle birleşebileceğini unutma." },
];

const APPS = [
  { name: "Parlak El Feneri", icon: "🔦", perms: ["Kamera flaşı", "Rehber", "Mikrofon", "SMS okuma", "Konum", "İnternet"], risky: ["Rehber", "Mikrofon", "SMS okuma", "Konum"], why: "El feneri yalnızca flaş/ekran ışığına ihtiyaç duyar. Rehber, mikrofon, SMS ve konum izni gereksizdir; veri toplama belirtisidir." },
  { name: "Şehir Haritası", icon: "🗺️", perms: ["Konum", "İnternet", "Rehber", "Kamera", "SMS okuma", "Depolama (harita önbelleği)"], risky: ["Rehber", "SMS okuma", "Kamera"], why: "Harita uygulaması için konum ve internet gerekir. Rehber, SMS ve kamera erişimi uygulama işleviyle ilgisizdir." },
  { name: "Neon Klavye Teması", icon: "⌨️", perms: ["Tam klavye erişimi", "Kişi listesi", "Sürekli arka plan çalışma", "İnternet", "Ekran görüntüsü alma"], risky: ["Tam klavye erişimi", "Sürekli arka plan çalışma", "Ekran görüntüsü alma", "Kişi listesi"], why: "Tema uygulamasının tam klavye erişimi yazdığın her şeyi (parola dahil) görebilmesi anlamına gelir. Arka plan ve ekran yakalama da izleme belirtisidir." },
];

const BEHAV: BinItem[] = [
  { icon: "🔋", title: "Kullanmıyorsun ama pil ve mobil veri tüketimi aniden arttı", answer: true, why: "Arka planda veri toplayıp gönderen yazılım pil ve veri tüketimini artırır." },
  { icon: "📸", title: "Kamera kullanılmıyorken kamera/mikrofon göstergesi yanıyor", answer: true, why: "İzinsiz kamera/mikrofon erişimi ciddi bir izleme işaretidir." },
  { icon: "🔄", title: "İşletim sistemi güncellemesinden sonra cihaz bir süre yavaşladı", answer: false, why: "Güncellemeler sonrası dizin oluşturma gibi işlemler geçici yavaşlık yapabilir; bu tek başına şüpheli değildir." },
  { icon: "🧩", title: "Tanımadığın bir ‘Erişilebilirlik hizmeti’ uygulaması aktif", answer: true, why: "Erişilebilirlik izni ekranı okuma ve tuş kaydı için kötüye kullanılabilir." },
  { icon: "🔔", title: "Takvim uygulaması bildirim gönderiyor", answer: false, why: "Beklenen ve kullanıcının açtığı normal davranıştır." },
  { icon: "🌐", title: "Tarayıcın kendiliğinden ana sayfayı ve arama motorunu değiştirdi", answer: true, why: "İzinsiz ayar değişikliği casus/reklam yazılımı belirtisidir." },
];

export default function Lab04({ onComplete, done }: LabProps) {
  const [tab, setTab] = useState<"kb" | "veri" | "izin" | "davranis">("kb");
  const [text, setText] = useState("");
  const [seenCats, setSeenCats] = useState<Cat[]>([]);
  const [sens, setSens] = useState({ a: 0 });
  const [beh, setBeh] = useState({ a: 0 });
  const [perm, setPerm] = useState<Record<number, string[]>>({});
  const [permDone, setPermDone] = useState<Record<number, boolean>>({});

  const { segs, found } = useMemo(() => segment(text), [text]);
  const updateText = (v: string) => {
    const nv = v.slice(0, 300);
    setText(nv);
    const f = segment(nv).found;
    if (f.length) setSeenCats((s) => (f.every((x) => s.includes(x)) ? s : [...new Set([...s, ...f])]));
  };

  const kbOk = seenCats.length >= 3;
  const permCount = Object.keys(permDone).length;
  const all = kbOk && sens.a === SENS.length && beh.a === BEHAV.length && permCount === APPS.length;

  useEffect(() => {
    if (all) onComplete();
  }, [all, onComplete]);

  return (
    <LabPanel title="Laboratuvar 4 – Keylogger Farkındalık Simülasyonu" intro="Kötü niyetli bir yazılımın gözünden, yazdığın örnek metnin nasıl ‘hassas veri’ye dönüşebildiğini gör. Ardından hassas verileri, riskli izinleri ve şüpheli davranışları belirle." done={done}>
      <InfoBox tone="warn" icon="⚠️" title="Gizlilik notu">
        Bu laboratuvar <b>gerçek tuş kaydı yapmaz</b>. Yalnızca aşağıdaki kutuya yazdığın veya örnek butonlarla eklediğin metni, sadece sayfa belleğinde analiz eder. Hiçbir yere gönderilmez ve kaydedilmez. <b>Gerçek parola veya kimlik bilgisi yazma</b>; örnek butonları kullan.
      </InfoBox>
      <Tabs variant="pill" value={tab} onChange={setTab} tabs={[
        { id: "kb", label: "1) Sanal klavye", badge: `${seenCats.length}/3` },
        { id: "veri", label: "2) Hassas veri", badge: `${sens.a}/${SENS.length}` },
        { id: "izin", label: "3) Uygulama izinleri", badge: `${permCount}/${APPS.length}` },
        { id: "davranis", label: "4) Şüpheli davranış", badge: `${beh.a}/${BEHAV.length}` },
      ]} />

      {tab === "kb" && (
        <div className="ag-fade space-y-3">
          <InfoBox tone="brand" icon="🎯" title="Görev">Örnek metinlerden en az <b>3 farklı hassas veri türünü</b> kutuya ekle ve analiz panelinde ne bulunduğunu incele. Şu an {seenCats.length}/3 tür görüldü.</InfoBox>
          <div className="flex flex-wrap gap-2">
            {SAMPLES.map((s) => (
              <Btn key={s} size="sm" variant="secondary" onClick={() => updateText(text ? `${text} • ${s}` : s)}>＋ {s.length > 22 ? `${s.slice(0, 22)}…` : s}</Btn>
            ))}
            <Btn size="sm" variant="ghost" onClick={() => setText("")}>Temizle</Btn>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Card>
              <p className="text-xs font-bold uppercase text-muted">⌨️ Senin yazdığın (sanal klavye alanı)</p>
              <textarea
                value={text}
                onChange={(e) => updateText(e.target.value)}
                rows={5}
                maxLength={300}
                autoComplete="off"
                spellCheck={false}
                placeholder="Örnek metin yaz veya yukarıdaki butonlardan ekle…"
                className="mt-2 w-full rounded-xl border border-line bg-page p-3 font-mono text-sm outline-none focus:border-accent"
                aria-label="Sanal klavye alanı"
              />
              <p className="mt-1 text-right text-[11px] text-muted">{text.length}/300</p>
            </Card>
            <Card className="bg-[#101c26]">
              <p className="text-xs font-bold uppercase text-[#8fe0e1]">🕵️ Kötü niyetli yazılımın gördüğü (simülasyon)</p>
              <p className="mt-2 min-h-[5rem] whitespace-pre-wrap break-all rounded-lg bg-black/30 p-3 font-mono text-xs leading-relaxed text-[#cfe3ec]">
                {text ? segs.map((s, i) => s.cat ? <mark key={i} className="rounded px-0.5 text-white" style={{ background: CATS.find((c) => c.id === s.cat)?.color }}>{s.text}</mark> : <span key={i}>{s.text}</span>) : <span className="text-white/40">(henüz bir şey yazılmadı)</span>}
              </p>
            </Card>
          </div>
          <Card>
            <p className="text-sm font-bold">🔎 Bulunan hassas veriler</p>
            {found.length === 0 ? <p className="mt-2 text-sm text-muted">Henüz hassas kalıp bulunmadı. Örnek butonlardan birini ekle.</p> : (
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {found.map((f) => {
                  const c = CATS.find((x) => x.id === f)!;
                  return (
                    <li key={f} className="rounded-xl border border-line bg-page p-3 text-sm">
                      <p className="flex items-center gap-2 font-semibold">{c.label} <Badge tone={c.risk === "Kritik" ? "bad" : c.risk === "Yüksek" ? "warn" : "brand"}>{c.risk}</Badge></p>
                      <p className="mt-1 text-xs text-muted">Kötüye kullanım: {c.use}</p>
                    </li>
                  );
                })}
              </ul>
            )}
            {kbOk && <div className="mt-3"><Feedback ok title="Keylogger mantığını gördün">Keylogger yazdığın ham metni toplar, sonra otomatik olarak değerli kalıpları (parola, kart, kimlik) ayıklar. Savunma: MFA, parola yöneticisi, güncel sistem, güvenilir uygulamalar.</Feedback></div>}
          </Card>
        </div>
      )}

      {tab === "veri" && (
        <div className="ag-fade space-y-3">
          <p className="text-sm text-muted">Bir keylogger veya casus yazılım için hangi veriler ‘hassas’ ve değerlidir?</p>
          <BinaryList items={SENS} trueLabel="🔐 Hassas" falseLabel="🌐 Hassas değil" onProgress={(a) => setSens({ a })} />
        </div>
      )}

      {tab === "izin" && (
        <div className="ag-fade space-y-3">
          <p className="text-sm text-muted">Her uygulama için <b>riskli veya gereksiz</b> olduğunu düşündüğün izinleri işaretle, sonra kontrol et.</p>
          <div className="grid gap-3 lg:grid-cols-3">
            {APPS.map((app, i) => {
              const sel = perm[i] ?? [];
              const locked = permDone[i];
              const correct = sel.filter((p) => app.risky.includes(p)).length;
              const wrongSel = sel.filter((p) => !app.risky.includes(p)).length;
              const missed = app.risky.filter((p) => !sel.includes(p));
              return (
                <Card key={app.name}>
                  <p className="text-lg font-bold">{app.icon} {app.name}</p>
                  <div className="mt-3 space-y-1.5">
                    {app.perms.map((p) => {
                      const s = sel.includes(p);
                      const risky = app.risky.includes(p);
                      return (
                        <Choice key={p} selected={s} disabled={locked} state={locked ? (s ? (risky ? "correct" : "wrong") : risky ? "missed" : "idle") : "idle"} onClick={() => setPerm({ ...perm, [i]: s ? sel.filter((x) => x !== p) : [...sel, p] })}>
                          {s ? "🚩 " : ""}{p}
                        </Choice>
                      );
                    })}
                  </div>
                  {!locked ? <Btn className="mt-3" size="sm" disabled={sel.length === 0} onClick={() => setPermDone({ ...permDone, [i]: true })}>Kontrol et</Btn> : (
                    <div className="mt-3"><Feedback ok={wrongSel === 0 && missed.length === 0 ? true : null} title={`${correct}/${app.risky.length} riskli izni buldun`}>{app.why}</Feedback></div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {tab === "davranis" && (
        <div className="ag-fade space-y-3">
          <p className="text-sm text-muted">Aşağıdaki gözlemlerden hangileri casus yazılım belirtisi olabilir?</p>
          <BinaryList items={BEHAV} trueLabel="🚩 Şüpheli" falseLabel="✅ Normal" onProgress={(a) => setBeh({ a })} />
        </div>
      )}

      <Card className="bg-soft text-sm">
        <b>İlerleme:</b> Klavye {kbOk ? "✓" : `${seenCats.length}/3`} • Hassas veri {sens.a}/{SENS.length} • İzinler {permCount}/{APPS.length} • Davranış {beh.a}/{BEHAV.length}
      </Card>
    </LabPanel>
  );
}
