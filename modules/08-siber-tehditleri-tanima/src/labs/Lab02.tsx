"use client";

import { useEffect, useState } from "react";
import { Badge, Btn, Card, Choice, Feedback, InfoBox, LabPanel, Stat, Tabs } from "@/components/ui";
import type { LabProps } from "./types";

/* ---------- Virüs simülasyonu ---------- */
const FILES = [
  { name: "oyun_kurulum.exe", icon: "🎮", host: true },
  { name: "odev.docx", icon: "📄", host: true },
  { name: "tablo.xlsx", icon: "📊", host: true },
  { name: "sunum.pptx", icon: "📽️", host: true },
  { name: "tatil.jpg", icon: "🖼️", host: false },
  { name: "notlar.txt", icon: "🗒️", host: false },
];

function VirusSim({ onSeen }: { onSeen: () => void }) {
  const [inf, setInf] = useState<boolean[]>([true, false, false, false, false, false]);
  const [log, setLog] = useState<string[]>(["Sistem hazır. ‘oyun_kurulum.exe’ enfekte bir dosya (sentetik)."]);
  const count = inf.filter(Boolean).length;

  useEffect(() => {
    if (count >= 4) onSeen();
  }, [count, onSeen]);

  const run = (i: number) => {
    const f = FILES[i];
    if (!f.host) {
      setLog((l) => [`${f.name} çalıştırılabilir kod taşımaz; virüs bu dosyaya bağlanamaz.`, ...l]);
      return;
    }
    if (inf[i]) {
      const next = inf.map((v, k) => v || FILES[k].host);
      setInf(next);
      setLog((l) => [`${f.name} çalıştırıldı → virüs devreye girdi ve diğer uygun dosyalara kendini ekledi.`, ...l]);
    } else {
      setLog((l) => [`${f.name} temiz; çalıştırıldı, bir şey olmadı. Virüs yalnızca enfekte dosya çalıştığında yayılır.`, ...l]);
    }
  };

  return (
    <div className="space-y-3">
      <InfoBox tone="brand" icon="🎯" title="Amaç">Virüs bir konak dosyaya bağımlıdır. Dosyaya tıklayarak ‘çalıştır’ ve enfeksiyonun nasıl yayıldığını gözle. İpucu: önce temiz bir dosyayı, sonra enfekte olanı çalıştırmayı dene.</InfoBox>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {FILES.map((f, i) => (
          <button key={f.name} onClick={() => run(i)} className={`rounded-xl border p-3 text-left transition-colors ${inf[i] ? "border-bad bg-bad/10" : "border-line bg-white hover:border-brand/40"}`}>
            <span className="text-2xl" aria-hidden>{f.icon}</span>
            <span className="mt-1 block break-all font-mono text-xs font-semibold">{f.name}</span>
            <span className={`mt-1 inline-block text-[11px] font-semibold ${inf[i] ? "text-bad" : "text-ok"}`}>{inf[i] ? "🦠 Enfekte" : "● Temiz"}</span>
          </button>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <Stat label="Enfekte dosya" value={`${count}/${FILES.length}`} tone={count > 1 ? "bad" : "ok"} />
        <Stat label="Yayılma için gereken" value="Konak + çalıştırma" />
        <div className="flex items-center"><Btn variant="ghost" size="sm" onClick={() => { setInf([true, false, false, false, false, false]); setLog(["Simülasyon sıfırlandı."]); }}>Sıfırla</Btn></div>
      </div>
      <div className="max-h-36 overflow-auto rounded-xl border border-line bg-page p-3 font-mono text-xs leading-relaxed">
        {log.map((l, i) => <p key={i} className={i === 0 ? "font-bold text-ink" : "text-muted"}>› {l}</p>)}
      </div>
    </div>
  );
}

/* ---------- Worm simülasyonu ---------- */
function WormSim({ onSeen }: { onSeen: () => void }) {
  const N = 9;
  const [inf, setInf] = useState<boolean[]>(() => Array.from({ length: N }, (_, i) => i === 0));
  const [patched, setPatched] = useState<boolean[]>(() => Array(N).fill(false));
  const [segment, setSegment] = useState(false);
  const [steps, setSteps] = useState(0);

  const neighbors = (i: number) => {
    const r = Math.floor(i / 3), c = i % 3;
    const out: number[] = [];
    if (r > 0) out.push(i - 3);
    if (r < 2) out.push(i + 3);
    if (c > 0 && !(segment && c === 1)) out.push(i - 1);
    if (c < 2 && !(segment && c === 0)) out.push(i + 1);
    return out;
  };
  const step = () => {
    const next = [...inf];
    inf.forEach((v, i) => {
      if (v) neighbors(i).forEach((n) => { if (!patched[n]) next[n] = true; });
    });
    setInf(next);
    setSteps((s) => s + 1);
  };
  useEffect(() => {
    if (steps >= 3) onSeen();
  }, [steps, onSeen]);
  const reset = () => { setInf(Array.from({ length: N }, (_, i) => i === 0)); setSteps(0); };
  const togglePatch = (i: number) => { if (!inf[i]) setPatched((p) => p.map((v, k) => (k === i ? !v : v))); };
  const icons = ["💻", "🖥️", "💻", "🖨️", "🖥️", "💻", "🗄️", "💻", "🖥️"];

  return (
    <div className="space-y-3">
      <InfoBox tone="brand" icon="🎯" title="Amaç">Worm, kullanıcı müdahalesi olmadan ağda yayılır. Önce bazı cihazlara yama uygula (cihaza tıkla) veya ağ bölümlemeyi aç, sonra ‘Zamanı ilerlet’ ile yayılmayı izle.</InfoBox>
      <div className="mx-auto grid max-w-sm grid-cols-3 gap-2">
        {Array.from({ length: N }, (_, i) => (
          <button key={i} onClick={() => togglePatch(i)} aria-label={`Cihaz ${i + 1}`} className={`rounded-xl border-2 p-2 text-center transition-colors ${inf[i] ? "border-bad bg-bad/10" : patched[i] ? "border-ok bg-ok/10" : "border-line bg-white hover:border-brand/40"}`}>
            <span className="text-2xl" aria-hidden>{icons[i]}</span>
            <span className="block text-[11px] font-semibold">PC-{i + 1}</span>
            <span className={`block text-[10px] font-bold ${inf[i] ? "text-bad" : patched[i] ? "text-ok" : "text-muted"}`}>{inf[i] ? "ENFEKTE" : patched[i] ? "YAMALI" : "Savunmasız"}</span>
          </button>
        ))}
      </div>
      {segment && <p className="text-center text-xs font-semibold text-accent">🧱 Ağ bölümleme aktif: orta sütun bağlantıları kesildi.</p>}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Btn onClick={step}>⏭ Zamanı ilerlet</Btn>
        <label className="flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm"><input type="checkbox" className="accent-[#176B87]" checked={segment} onChange={(e) => setSegment(e.target.checked)} />Ağ bölümleme</label>
        <Btn variant="ghost" onClick={reset}>Yayılmayı sıfırla</Btn>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <Stat label="Adım" value={steps} />
        <Stat label="Enfekte cihaz" value={`${inf.filter(Boolean).length}/${N}`} tone={inf.filter(Boolean).length > 4 ? "bad" : "warn"} />
        <Stat label="Yamalı cihaz" value={patched.filter(Boolean).length} tone="ok" />
      </div>
      {steps >= 3 && <Feedback ok={inf.filter(Boolean).length < N} title={inf.filter(Boolean).length < N ? "Yayılmayı sınırladın" : "Tüm ağ enfekte oldu"}>{inf.filter(Boolean).length < N ? "Yama ve ağ bölümleme worm'un ilerleyebileceği yolları kapattı. Gerçek hayatta da yayılma yamasız cihazlar üzerinden olur." : "Worm kullanıcı müdahalesi olmadan her yamasız komşuya atladı. Yama veya bölümleme ile tekrar dene!"}</Feedback>}
    </div>
  );
}

/* ---------- Trojan simülasyonu ---------- */
function TrojanSim({ onSeen }: { onSeen: () => void }) {
  const [stage, setStage] = useState<"offer" | "installed" | "analysed">("offer");
  useEffect(() => {
    if (stage === "analysed") onSeen();
  }, [stage, onSeen]);
  return (
    <div className="space-y-3">
      <InfoBox tone="brand" icon="🎯" title="Amaç">Trojan faydalı bir uygulama gibi görünür. Önce ‘uygulamayı’ kur (simülasyon), sonra perdenin arkasına bak.</InfoBox>
      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <p className="text-xs font-bold uppercase text-muted">Kullanıcının gördüğü</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-4xl" aria-hidden>🚀</span>
            <div>
              <p className="font-bold">SüperHız Optimizer</p>
              <p className="text-xs text-muted">★★★★★ “Bilgisayarını %300 hızlandır!” • Ücretsiz</p>
            </div>
          </div>
          <div className="mt-3">
            {stage === "offer" ? <Btn onClick={() => setStage("installed")}>Ücretsiz kur</Btn> : <Badge tone="ok">✓ Kuruldu – ‘Hızlandırılıyor…’</Badge>}
          </div>
        </Card>
        <Card className={stage === "analysed" ? "border-bad/40" : ""}>
          <p className="text-xs font-bold uppercase text-muted">Gerçekte olan (arka plan)</p>
          {stage === "offer" && <p className="mt-3 text-sm text-muted">Önce uygulamayı kur…</p>}
          {stage === "installed" && (
            <div className="mt-3 space-y-2 text-sm">
              <p className="text-muted">Arka planda bir şeyler çalışıyor ama göremiyorsun.</p>
              <Btn variant="secondary" onClick={() => setStage("analysed")}>🔍 Davranış analizi yap</Btn>
            </div>
          )}
          {stage === "analysed" && (
            <ul className="ag-fade mt-3 space-y-1.5 text-sm">
              <li>🕳️ Uzaktan erişim için gizli bir port açtı</li>
              <li>📇 Rehber ve tarayıcı parolalarını okudu</li>
              <li>📡 Her 30 sn’de bilinmeyen bir adrese (203.0.113.7) veri gönderdi</li>
              <li>🚀 Gerçekte hiçbir hızlandırma yapmıyor</li>
            </ul>
          )}
        </Card>
      </div>
      {stage === "analysed" && <Feedback ok title="Trojan'ın maskesi düştü">Trojan kendini çoğaltmaz; senin ona güvenmene bağlıdır. ‘Ücretsiz süper hız’ gibi vaatler, kaynağı belirsiz yazılımlar ve gereksiz izinler uyarı işaretidir.</Feedback>}
      {stage !== "offer" && <Btn variant="ghost" size="sm" onClick={() => setStage("offer")}>Sıfırla</Btn>}
    </div>
  );
}

/* ---------- Senaryolar ---------- */
const SC = [
  { text: "Okul bilgisayarlarının hiçbiri dosya açmamasına rağmen, bir gece içinde tüm laboratuvar ağı yavaşladı ve her cihaz aynı zararlı sürece sahip.", ans: "Worm", why: "Kullanıcı eylemi olmadan ağda hızlı yayılma Worm'u gösterir." },
  { text: "Arkadaşından gelen ‘odev_son.docx’ makro içeriyor. Açınca aynı klasördeki diğer belgeler de bozuluyor ve paylaştığın her belgeye bulaşıyor.", ans: "Virüs", why: "Konak dosyalara kendini ekleyerek, dosya çalıştırılınca yayılan yapı Virüs'tür." },
  { text: "‘Ücretsiz film izleme programı’nı kurdun. Program çalışıyor ama arka planda klavye ve ekran bilgini bir sunucuya gönderiyor.", ans: "Trojan", why: "Faydalı görünüp gizli zararlı davranış taşıyan, kullanıcının kendi isteğiyle kurduğu yazılım Trojan'dır." },
  { text: "Güvenlik duvarı kapalı ve yamasız bir sunucu internete açıldıktan dakikalar sonra kendini diğer sunuculara kopyalamaya başladı.", ans: "Worm", why: "Zafiyetli servisleri tarayıp kendini kopyalamak Worm'un karakteristiğidir." },
  { text: "Bir USB bellekteki ‘Sunum.exe’ dosyasını çalıştırdın. Daha sonra bilgisayardaki tüm .exe dosyalarının boyutu büyümüş.", ans: "Virüs", why: "Çalıştırılabilir dosyalara kendini ekleyen yapı, dosya tabanlı virüstür." },
  { text: "‘Telefon temizleyici’ uygulaması izin istedi ve kurdun; sonra arka planda uzaktan komut alıp rehberini dışarı aktarıyor, kendini yaymıyor.", ans: "Trojan", why: "Yayılma yok, kandırma var; kullanıcının güvenine dayandığı için Trojan'dır." },
];

function Scenarios({ answers, setAnswers }: { answers: Record<number, string>; setAnswers: (a: Record<number, string>) => void }) {
  return (
    <div className="space-y-3">
      {SC.map((s, i) => {
        const p = answers[i];
        return (
          <Card key={i}>
            <p className="text-sm font-semibold">Senaryo {i + 1}: {s.text}</p>
            <p className="mt-2 text-xs text-muted">Hangi tür ile karşılaşıyorsun?</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {["Virüs", "Worm", "Trojan"].map((t) => (
                <Choice key={t} disabled={!!p} selected={p === t} state={p ? (t === p ? (t === s.ans ? "correct" : "wrong") : t === s.ans ? "missed" : "idle") : "idle"} onClick={() => setAnswers({ ...answers, [i]: t })}>{t}</Choice>
              ))}
            </div>
            {p && <div className="mt-3"><Feedback ok={p === s.ans}>{s.why}</Feedback></div>}
          </Card>
        );
      })}
    </div>
  );
}

export default function Lab02({ onComplete, done }: LabProps) {
  const [tab, setTab] = useState<"virus" | "worm" | "trojan" | "senaryo">("virus");
  const [seen, setSeen] = useState({ virus: false, worm: false, trojan: false });
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const answered = Object.keys(answers).length;
  const sims = seen.virus && seen.worm && seen.trojan;
  const finished = sims && answered === SC.length;
  const score = SC.filter((s, i) => answers[i] === s.ans).length;

  useEffect(() => {
    if (finished) onComplete();
  }, [finished, onComplete]);

  return (
    <LabPanel title="Laboratuvar 2 – Üç Zararlıyı Karşılaştır" intro="Önce üç zararlı türün yayılma mantığını simülasyonlarla incele, sonra senaryolarda hangi türle karşılaştığını seç." done={done}>
      <Tabs
        variant="pill"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "virus", label: "📄 Virüs", badge: seen.virus ? "✓" : "" },
          { id: "worm", label: "🌐 Worm", badge: seen.worm ? "✓" : "" },
          { id: "trojan", label: "🎭 Trojan", badge: seen.trojan ? "✓" : "" },
          { id: "senaryo", label: "🧩 Senaryolar", badge: `${answered}/${SC.length}` },
        ]}
      />
      <div className="ag-fade">
        {tab === "virus" && <VirusSim onSeen={() => setSeen((s) => (s.virus ? s : { ...s, virus: true }))} />}
        {tab === "worm" && <WormSim onSeen={() => setSeen((s) => (s.worm ? s : { ...s, worm: true }))} />}
        {tab === "trojan" && <TrojanSim onSeen={() => setSeen((s) => (s.trojan ? s : { ...s, trojan: true }))} />}
        {tab === "senaryo" && <Scenarios answers={answers} setAnswers={setAnswers} />}
      </div>
      <Card className="bg-soft text-sm">
        <p className="font-bold">İlerleme</p>
        <p className="text-muted">Simülasyonlar: Virüs {seen.virus ? "✓" : "(4 dosyayı enfekte et)"} • Worm {seen.worm ? "✓" : "(3 adım ilerlet)"} • Trojan {seen.trojan ? "✓" : "(analiz yap)"} • Senaryo doğru: {score}/{answered}</p>
      </Card>
    </LabPanel>
  );
}
