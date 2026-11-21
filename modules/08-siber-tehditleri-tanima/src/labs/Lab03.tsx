"use client";

import { useEffect, useState } from "react";
import { Badge, Btn, Card, Choice, Feedback, InfoBox, LabPanel, ProgressBar } from "@/components/ui";
import type { LabProps } from "./types";

type F = { path: string; icon: string; encAt: number | null };
const FILES: F[] = [
  { path: "Muhasebe/Bilanco_2024.xlsx", icon: "📊", encAt: 2 },
  { path: "Muhasebe/Maaslar.xlsx", icon: "📊", encAt: 2 },
  { path: "Muhasebe/Faturalar_Mayis.pdf", icon: "📄", encAt: 2 },
  { path: "Paylasim/Teklif_Sablon.docx", icon: "📄", encAt: 3 },
  { path: "Paylasim/Musteri_Listesi.csv", icon: "📇", encAt: 3 },
  { path: "Paylasim/Sunum.pptx", icon: "📽️", encAt: 3 },
  { path: "IK/Ozluk_Dosyalari.zip", icon: "🗜️", encAt: 3 },
  { path: "Yonetim/Strateji.pdf", icon: "📄", encAt: null },
  { path: "Web/site_yedek.zip", icon: "🗜️", encAt: null },
  { path: "Logo/logo.png", icon: "🖼️", encAt: null },
];

const TIMELINE = [
  "08:00 – Normal çalışma günü. Tüm dosyalar erişilebilir.",
  "09:12 – Muhasebe çalışanı ‘Fatura_Mayis.pdf.exe’ adlı e-posta ekini açtı.",
  "09:40 – Arka planda dosya şifreleme başladı; bazı dosyalar uzantı değiştirdi (.locked).",
  "10:05 – Ekranda fidye notu belirdi. Şifreleme paylaşılan klasörlere yayıldı.",
];

const ACTIONS = [
  { t: "Etkilenen cihazları ağdan ayır (kablo çek / Wi-Fi kapat)", good: true, why: "Yayılmayı durdurur; cihaz açık kalırsa kanıt korunur." },
  { t: "Fidyeyi hemen öde", good: false, why: "Dosyaların geri geleceği garantisi yoktur ve saldırganı teşvik eder." },
  { t: "Olayı BT/güvenlik ekibine bildir, kanıtları (not, log) koru", good: true, why: "Doğru koordinasyon ve adli inceleme için kritik." },
  { t: "Şifrelenmiş dosyaları silip yeniden oluştur", good: false, why: "Kanıt ve kurtarma ihtimali kaybolur." },
  { t: "Yedek sistemlerini ağdan ayır ve koru", good: true, why: "Saldırganın yedekleri de şifrelemesini engeller." },
  { t: "Saldırganla e-postayla pazarlık et", good: false, why: "Kurumsal prosedür dışı; kriz yönetimi ve hukuki süreç uzmanlarına bırakılmalı." },
  { t: "Tüm sunucuları aniden prizden çek", good: false, why: "Bellekteki kanıtlar kaybolur; kontrollü izolasyon daha doğrudur." },
  { t: "Parolaları temiz bir cihazdan sıfırla (özellikle yönetici hesapları)", good: true, why: "Saldırganın ele geçirmiş olabileceği kimlik bilgilerini geçersiz kılar." },
];

const BACKUPS = [
  { n: "Ağ paylaşımı günlük yedeği", s: "⚠ Ağa bağlıydı – şifrelenmiş", tone: "bad" as const },
  { n: "Bulut senkronizasyonu", s: "⚠ Şifreli dosyalar senkronize oldu (30 gün sürüm geçmişi var)", tone: "warn" as const },
  { n: "Çevrimdışı harici disk", s: "✓ Dün 23:00 – sağlam, ağa bağlı değil", tone: "ok" as const },
  { n: "Haftalık teyp", s: "✓ 7 gün eski – sağlam", tone: "ok" as const },
];

const STRATS = [
  { t: "Fidyeyi öde ve anahtarı bekle", score: 0, why: "Garantisi yok; saldırgan finanse edilir. Yedekler sağlamken gereksiz ve riskli." },
  { t: "Cihazları temizle, çevrimdışı yedekten geri yükle", score: 3, why: "En iyi seçenek: sağlam ve güncel yedek var. Yalnızca birkaç saatlik veri kaybı olur." },
  { t: "Bulut senkronizasyonunu hemen geri yükle", score: 1, why: "Senkronizasyon şifreli dosyaları da taşımış olabilir. Sürüm geçmişinden temiz sürüm seçilmeden güvenli değil." },
  { t: "Haftalık teyptan geri yükle", score: 2, why: "Güvenli ama 7 günlük veri kaybı olur. Daha güncel temiz yedek varken ikinci tercih." },
];

const CLASSIFY = [
  { t: "Fidye yazılımı (Ransomware) olayı", ok: true },
  { t: "Disk donanım arızası", ok: false },
  { t: "Ağ servis sağlayıcı kesintisi (DDoS)", ok: false },
  { t: "Kullanıcı yanlışlıkla dosyaları yeniden adlandırdı", ok: false },
];

type Phase = "sim" | "classify" | "respond" | "recover" | "result";

export default function Lab03({ onComplete, done }: LabProps) {
  const [stage, setStage] = useState(0);
  const [phase, setPhase] = useState<Phase>("sim");
  const [cls, setCls] = useState<number | null>(null);
  const [acts, setActs] = useState<number[]>([]);
  const [actsLocked, setActsLocked] = useState(false);
  const [strat, setStrat] = useState<number | null>(null);

  const encrypted = (f: F) => f.encAt !== null && stage >= f.encAt;
  const encCount = FILES.filter(encrypted).length;

  const actScore = Math.max(0, acts.filter((i) => ACTIONS[i].good).length - acts.filter((i) => !ACTIONS[i].good).length);
  const total = (cls !== null && CLASSIFY[cls].ok ? 1 : 0) + actScore + (strat !== null ? STRATS[strat].score : 0);
  const MAX = 1 + 4 + 3;

  useEffect(() => {
    if (phase === "result") onComplete();
  }, [phase, onComplete]);

  const toggleAct = (i: number) => {
    if (actsLocked) return;
    setActs((a) => (a.includes(i) ? a.filter((x) => x !== i) : [...a, i]));
  };

  const restart = () => {
    setStage(0); setPhase("sim"); setCls(null); setActs([]); setActsLocked(false); setStrat(null);
  };

  return (
    <LabPanel title="Laboratuvar 3 – Fidye Yazılımı Olay Simülasyonu" intro="Sanal bir şirketin dosya sistemini izle. Saldırı ilerledikçe hangi dosyaların etkilendiğini gör, olayı sınıflandır, ilk müdahaleyi seç ve kurtarma stratejisini belirle." done={done}>
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold">📁 Şirket dosya sunucusu (sanal)</h4>
            <Badge tone={stage === 0 ? "ok" : "bad"}>{stage === 0 ? "Normal" : `${encCount} dosya şifreli`}</Badge>
          </div>
          <ul className="mt-3 divide-y divide-line rounded-xl border border-line">
            {FILES.map((f) => {
              const e = encrypted(f);
              return (
                <li key={f.path} className={`flex items-center gap-2 px-3 py-2 text-sm ${e ? "bg-bad/10" : ""}`}>
                  <span aria-hidden>{e ? "🔒" : f.icon}</span>
                  <span className={`min-w-0 flex-1 break-all font-mono text-xs ${e ? "text-bad" : ""}`}>{f.path}{e ? ".locked" : ""}</span>
                  <span className={`text-[11px] font-semibold ${e ? "text-bad" : "text-ok"}`}>{e ? "ŞİFRELİ" : "Normal"}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-xs text-muted">Bu liste tamamen sentetiktir; gerçek dosya şifrelenmez.</p>
        </Card>

        <div className="space-y-3 lg:col-span-2">
          <Card>
            <h4 className="font-bold">⏱ Olay zaman çizelgesi</h4>
            <ol className="mt-3 space-y-2 text-sm">
              {TIMELINE.map((t, i) => (
                <li key={i} className={`rounded-lg border px-3 py-2 ${i <= stage ? (i === 0 ? "border-line bg-white" : "border-bad/30 bg-bad/5") : "border-dashed border-line text-muted/50"}`}>
                  {i <= stage ? t : "…"}
                </li>
              ))}
            </ol>
            {phase === "sim" && (
              <div className="mt-3 flex flex-wrap gap-2">
                {stage < 3 ? <Btn onClick={() => setStage(stage + 1)}>Senaryoyu ilerlet ⏭</Btn> : <Btn onClick={() => setPhase("classify")}>Müdahaleye başla →</Btn>}
                {stage > 0 && stage < 3 && <span className="self-center text-xs text-muted">Etkilenen dosyalar kırmızı olur</span>}
              </div>
            )}
          </Card>
          {stage >= 3 && (
            <div className="rounded-xl border-2 border-bad bg-[#2a1313] p-4 font-mono text-xs leading-relaxed text-[#ffb4b4] ag-fade" role="alert">
              <p className="font-bold text-sm">⚠ DOSYALARINIZ ŞİFRELENDİ</p>
              <p className="mt-1">[EĞİTİM SİMÜLASYONU – GERÇEK DEĞİL]</p>
              <p>Dosyalarınızı geri almak için 48 saat içinde ödeme yapın. Süre dolarsa verileriniz yayınlanacaktır. Polise veya BT ekibine haber VERMEYİN.</p>
              <p className="mt-2 text-[#ff8a8a]">▶ Acele ve korku baskısına dikkat: klasik fidye notu taktiği.</p>
            </div>
          )}
        </div>
      </div>

      {phase !== "sim" && (
        <Card className="ag-fade space-y-4">
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            {(["classify", "respond", "recover", "result"] as Phase[]).map((p, i) => (
              <Badge key={p} tone={phase === p ? "brand" : "muted"}>{i + 1}. {p === "classify" ? "Sınıflandır" : p === "respond" ? "İlk müdahale" : p === "recover" ? "Yedek ve kurtarma" : "Sonuç"}</Badge>
            ))}
          </div>

          {phase === "classify" && (
            <div className="space-y-3">
              <h4 className="font-bold">1) Bu olayı nasıl sınıflandırırsın?</h4>
              <p className="text-sm text-muted">Bulgular: dosya uzantıları değişti, fidye notu var, paylaşılan klasörler etkilendi. {encCount} dosya şifreli.</p>
              <div className="space-y-2">
                {CLASSIFY.map((c, i) => (
                  <Choice key={i} disabled={cls !== null} state={cls === null ? "idle" : i === cls ? (c.ok ? "correct" : "wrong") : c.ok ? "missed" : "idle"} onClick={() => setCls(i)}>{c.t}</Choice>
                ))}
              </div>
              {cls !== null && (
                <>
                  <Feedback ok={CLASSIFY[cls].ok}>{CLASSIFY[cls].ok ? "Şifrelenmiş dosyalar, değişen uzantılar ve fidye notu birlikte Ransomware olayını gösterir." : "Doğru sınıflandırma Ransomware olayıdır: şifrelenmiş dosyalar, uzantı değişimi ve fidye notu bunu gösterir."}</Feedback>
                  <Btn onClick={() => setPhase("respond")}>İlk müdahale adımlarına geç →</Btn>
                </>
              )}
            </div>
          )}

          {phase === "respond" && (
            <div className="space-y-3">
              <h4 className="font-bold">2) İlk müdahale için doğru adımları seç</h4>
              <p className="text-sm text-muted">Birden fazla seçim yapabilirsin. Hazır olunca ‘Seçimleri değerlendir’e bas.</p>
              <div className="space-y-2">
                {ACTIONS.map((a, i) => {
                  const sel = acts.includes(i);
                  const state = !actsLocked ? "idle" : sel ? (a.good ? "correct" : "wrong") : a.good ? "missed" : "idle";
                  return <Choice key={i} selected={sel} state={state} disabled={actsLocked} onClick={() => toggleAct(i)}>
                    {a.t}
                    {actsLocked && (sel || a.good) && <span className="mt-1 block text-xs text-muted">{a.why}</span>}
                  </Choice>;
                })}
              </div>
              {!actsLocked ? (
                <Btn disabled={acts.length === 0} onClick={() => setActsLocked(true)}>Seçimleri değerlendir</Btn>
              ) : (
                <>
                  <Feedback ok={actScore >= 3} title={`İlk müdahale puanın: ${actScore}/4`}>Doğru adımlar: izolasyon, bildirim ve kanıt koruma, yedeklerin korunması, parola sıfırlama. Yanlış seçimler yayılmayı, kanıt kaybını veya saldırgan finansmanını artırır.</Feedback>
                  <Btn onClick={() => setPhase("recover")}>Yedek durumuna bak →</Btn>
                </>
              )}
            </div>
          )}

          {phase === "recover" && (
            <div className="space-y-3">
              <h4 className="font-bold">3) Yedekleme durumunu incele ve kurtarma stratejini seç</h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {BACKUPS.map((b) => (
                  <div key={b.n} className={`rounded-xl border p-3 text-sm ${b.tone === "ok" ? "border-ok/40 bg-ok/5" : b.tone === "warn" ? "border-warn/50 bg-warn/10" : "border-bad/40 bg-bad/5"}`}>
                    <p className="font-bold">💾 {b.n}</p>
                    <p className="mt-0.5 text-xs">{b.s}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {STRATS.map((s, i) => (
                  <Choice key={i} disabled={strat !== null} state={strat === null ? "idle" : i === strat ? (s.score === 3 ? "correct" : s.score === 0 ? "wrong" : "idle") : s.score === 3 ? "missed" : "idle"} selected={strat === i} onClick={() => { setStrat(i); }}>{s.t}</Choice>
                ))}
              </div>
              {strat !== null && (
                <>
                  <Feedback ok={STRATS[strat].score === 3 ? true : STRATS[strat].score === 0 ? false : null} title={`Strateji puanın: ${STRATS[strat].score}/3`}>{STRATS[strat].why}</Feedback>
                  <Btn onClick={() => setPhase("result")}>Sonucu gör →</Btn>
                </>
              )}
            </div>
          )}

          {phase === "result" && (
            <div className="space-y-3">
              <h4 className="font-bold">Olay sonrası değerlendirme</h4>
              <p className="text-3xl font-extrabold text-brand">{total} / {MAX}</p>
              <ProgressBar value={(total / MAX) * 100} tone={total >= 6 ? "ok" : total >= 4 ? "warn" : "bad"} />
              <InfoBox tone={total >= 6 ? "ok" : "warn"} title="Çıkarılacak dersler" icon="🎓">
                <ul className="list-disc space-y-1 pl-5">
                  <li>İzolasyon ve bildirim ilk dakikaların en önemli adımlarıdır.</li>
                  <li>Çevrimdışı yedek sayesinde fidye ödemeden kurtulabilirsin.</li>
                  <li>Önleme: kimlik avı eğitimi, MFA, yama yönetimi ve düzenli geri yükleme testi.</li>
                </ul>
              </InfoBox>
              <Btn variant="secondary" onClick={restart}>Senaryoyu yeniden oyna</Btn>
            </div>
          )}
        </Card>
      )}
    </LabPanel>
  );
}
