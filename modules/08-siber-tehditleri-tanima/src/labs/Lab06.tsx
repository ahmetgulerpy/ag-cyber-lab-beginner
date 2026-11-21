"use client";

import { useEffect, useState } from "react";
import { Badge, Btn, Card, Choice, Feedback, InfoBox, LabPanel, ProgressBar } from "@/components/ui";
import type { LabProps } from "./types";

type Opt = { t: string; score: 0 | 1 | 2; outcome: string };
type Sc = { icon: string; title: string; technique: string; story: string; opts: Opt[]; best: string };

const SCENARIOS: Sc[] = [
  {
    icon: "📞",
    title: "Telefonda ‘teknik destek’",
    technique: "Pretexting / Vishing",
    story: "Telefonun çalıyor: ‘Merhaba, ben BT destekten Murat. Hesabında tehlikeli bir etkinlik gördük, hemen çözmem için parolanı ve telefonuna gelen kodu söylemelisin. Aksi halde hesabın kilitlenecek.’",
    opts: [
      { t: "Parolamı ve kodu söylerim; acil görünüyor.", score: 0, outcome: "Saldırgan hesabına girdi. Meşru BT destek parolanı ve doğrulama kodunu asla istemez." },
      { t: "Kibarca telefonu kapatır, BT'yi resmî dahili numaradan ben ararım.", score: 2, outcome: "Doğrulamayı kendi bildiğin güvenli kanaldan yaptın. Arayan kişi sahteydi; olay güvenlik ekibine bildirildi." },
      { t: "Parolayı söylemem ama adımı ve departmanımı söylerim.", score: 1, outcome: "Parola korundu ama saldırgan yeni bilgi (isim, departman) topladı ve bir sonraki aramayı daha inandırıcı yapabilir." },
    ],
    best: "Arayanın kimliğini onun verdiği numara yerine bilinen resmî kanaldan doğrula. Parola ve doğrulama kodu hiçbir koşulda paylaşılmaz.",
  },
  {
    icon: "📧",
    title: "‘Acil ödeme’ e-postası",
    technique: "Urgency + Authority (Aciliyet ve otorite)",
    story: "Müdürünün adıyla gelen e-posta: ‘Toplantıdayım, hemen bu IBAN'a 25.000 TL transfer et ve kimseye söyleme. Detayı sonra anlatırım.’ Gönderen adresi şirket alan adına çok benziyor ama bir harf farklı.",
    opts: [
      { t: "Müdürüm istiyor, hemen gönderirim.", score: 0, outcome: "Para dolandırıcıya gitti (CEO Fraud / BEC). Geri almak çok zor." },
      { t: "Müdürü bilinen telefon numarasından arayıp doğrularım, e-postayı BT'ye bildiririm.", score: 2, outcome: "Talep sahteydi. Bağımsız doğrulama ile şirket zarardan kurtuldu." },
      { t: "E-postaya ‘emin misiniz?’ diye yanıt yazarım.", score: 1, outcome: "Saldırganın kontrol ettiği kanala yazdığın için sahte yanıt aldın. Doğrulama bağımsız kanaldan yapılmalıydı." },
    ],
    best: "Para/yetki talebi + gizlilik + acele = kırmızı alarm. Doğrulama, talebin geldiği kanaldan değil, bilinen ikinci bir kanaldan yapılır.",
  },
  {
    icon: "💾",
    title: "Bulunan USB bellek",
    technique: "Baiting (Yem)",
    story: "Otoparkta ‘Maaş Listesi 2025’ yazan bir USB bellek buldun. Merak ediyorsun ve işyeri bilgisayarın yanında.",
    opts: [
      { t: "Hızlıca bakmak için bilgisayarıma takarım.", score: 0, outcome: "Bellek zararlı bir yazılım içeriyordu; şirket ağına bulaştı. Merak saldırganın silahıdır." },
      { t: "Takmadan BT/güvenlik birimine teslim ederim.", score: 2, outcome: "BT, belleği yalıtılmış ortamda inceledi: zararlı yazılım içeriyordu. Hiçbir sistem etkilenmedi." },
      { t: "Evdeki eski bilgisayarda denerim.", score: 1, outcome: "Şirketi korudun ama kişisel cihazın risk altına girdi. Bilinmeyen belleği hiçbir cihaza takma." },
    ],
    best: "Bilinmeyen USB'yi asla takma; güvenlik birimine teslim et. Şirketler USB portlarını kısıtlayabilir.",
  },
  {
    icon: "🔑",
    title: "Çalışandan parola isteyen kişi",
    technique: "Pretexting / Authority",
    story: "Ofiste ‘yeni stajyer’ olduğunu söyleyen biri: ‘Hesabım henüz açılmadı, projeyi bitirmem lazım. Birkaç saatliğine senin hesabını kullanabilir miyim? Müdür onayladı.’",
    opts: [
      { t: "Parolamı paylaşırım, birkaç saat sorun olmaz.", score: 0, outcome: "Yetkisiz kişi hesabınla işlem yaptı, kayıtlara senin adına işlendi. Parola paylaşımı kural ihlalidir." },
      { t: "Paylaşmam; stajyeri yöneticisine ve BT'ye yönlendirir, geçici hesap talep ettiririm.", score: 2, outcome: "Doğru süreç işletildi. Stajyerin hesabı yetkili kişilerce açıldı; senin hesabın güvende." },
      { t: "Parolayı paylaşmam ama ekranımı açıp ‘gözümün önünde’ kullanmasına izin veririm.", score: 1, outcome: "Parola gizli kaldı ama kayıtlar senin adına işlendi ve yetkisiz erişim doğdu." },
    ],
    best: "Parola kişiseldir ve asla paylaşılmaz. Yeni çalışan için hesap açma süreci BT ve yönetici üzerinden yürür.",
  },
  {
    icon: "🚪",
    title: "Güvenli alana girmeye çalışan yetkisiz kişi",
    technique: "Tailgating",
    story: "Sunucu odasının kartlı kapısından çıkıyorsun. Kuryeye benzeyen, elleri kolilerle dolu biri: ‘Kartımı içeri unuttum, kapıyı tutar mısın? Teslimat yapmam lazım.’",
    opts: [
      { t: "Nazik olmak için kapıyı tutar, içeri alırım.", score: 0, outcome: "Kişi sunucu odasına izinsiz girdi (Tailgating) ve cihazlara erişti." },
      { t: "Kapıyı tutmam; kişiyi resepsiyona yönlendirir ve güvenliğe haber veririm.", score: 2, outcome: "Kişi doğru kanaldan kimlik doğrulaması yaptırdı. Güvenli alan korundu." },
      { t: "Kimliğini sorar, ‘tamam’ derse alırım.", score: 1, outcome: "Kimlik kontrolü iyi bir adım ama senin yetkin yok. Ziyaretçi prosedürü ve refakat gerekir." },
    ],
    best: "Her kişi kendi kartıyla girer. Nezaket güvenliğin önüne geçmez; yetkisiz kişiyi resepsiyon/güvenliğe yönlendir.",
  },
];

export default function Lab06({ onComplete, done }: LabProps) {
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<Record<number, number>>({});
  const answered = Object.keys(picks).length;
  const score = SCENARIOS.reduce((a, s, i) => a + (picks[i] !== undefined ? s.opts[picks[i]].score : 0), 0);
  const secLevel = Math.max(0, Math.min(100, 50 + SCENARIOS.reduce((a, s, i) => (picks[i] === undefined ? a : a + (s.opts[picks[i]].score === 2 ? 10 : s.opts[picks[i]].score === 1 ? -2 : -15)), 0)));
  const finished = answered === SCENARIOS.length;

  useEffect(() => {
    if (finished) onComplete();
  }, [finished, onComplete]);

  const s = SCENARIOS[idx];
  const p = picks[idx];

  return (
    <LabPanel title="Laboratuvar 6 – Karar Tabanlı Sosyal Mühendislik Senaryoları" intro="Her olayda nasıl davranacağını seç. Seçiminin güvenlik sonuçlarını ve doğru yaklaşımı hemen göreceksin." done={done}>
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-bold">🏢 Şirket güvenlik seviyesi</p>
          <span className="text-sm font-bold text-brand">%{secLevel}</span>
        </div>
        <ProgressBar value={secLevel} tone={secLevel >= 70 ? "ok" : secLevel >= 40 ? "warn" : "bad"} className="mt-2" />
        <p className="mt-1 text-xs text-muted">Kararların bu seviyeyi doğrudan değiştirir. Doğru karar: +10, riskli karar: −15.</p>
      </Card>

      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((x, i) => (
          <button key={i} onClick={() => setIdx(i)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${idx === i ? "border-brand bg-brand text-white" : picks[i] !== undefined ? "border-ok/40 bg-ok/10 text-ok" : "border-line bg-white text-muted"}`}>
            {x.icon} {i + 1}. Olay
          </button>
        ))}
      </div>

      <Card className="ag-fade" key={idx}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-3xl" aria-hidden>{s.icon}</span>
          <h4 className="text-lg font-bold">{s.title}</h4>
          <Badge tone="warn">{s.technique}</Badge>
        </div>
        <p className="mt-3 rounded-xl bg-page p-3 text-sm leading-relaxed">{s.story}</p>
        <p className="mt-4 text-sm font-bold">Bu durumda ne yaparsın?</p>
        <div className="mt-2 space-y-2">
          {s.opts.map((o, i) => (
            <Choice key={i} disabled={p !== undefined} selected={p === i} state={p === undefined ? "idle" : i === p ? (o.score === 2 ? "correct" : o.score === 0 ? "wrong" : "idle") : o.score === 2 ? "missed" : "idle"} onClick={() => setPicks({ ...picks, [idx]: i })}>{o.t}</Choice>
          ))}
        </div>
        {p !== undefined && (
          <div className="mt-4 space-y-3">
            <Feedback ok={s.opts[p].score === 2 ? true : s.opts[p].score === 0 ? false : null} title={s.opts[p].score === 2 ? "En güvenli karar" : s.opts[p].score === 1 ? "Kısmen güvenli" : "Riskli karar"}>
              <p><b>Sonuç:</b> {s.opts[p].outcome}</p>
              <p className="mt-1"><b>Doğru yaklaşım:</b> {s.best}</p>
            </Feedback>
            {idx < SCENARIOS.length - 1 && <Btn variant="secondary" onClick={() => setIdx(idx + 1)}>Sonraki olay →</Btn>}
          </div>
        )}
      </Card>

      {finished && (
        <InfoBox tone={score >= 8 ? "ok" : "warn"} icon="🏁" title={`Final: ${score}/10 puan`}>
          {score >= 8 ? "Harika! Doğrulama alışkanlığın güçlü." : "Doğrulama kuralını hatırla: acele + otorite + gizlilik görürsen dur, bağımsız kanaldan doğrula."}
          <div className="mt-2"><Btn size="sm" variant="ghost" onClick={() => { setPicks({}); setIdx(0); }}>Tekrar oyna</Btn></div>
        </InfoBox>
      )}
    </LabPanel>
  );
}
