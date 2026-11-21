"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge, Btn, Card, Choice, Feedback, InfoBox, LabPanel, ProgressBar } from "@/components/ui";
import type { LabProps } from "./types";

const CATS = ["Normal davranış", "Mesai dışı erişim", "Aşırı veri indirme/aktarma", "Yetkisiz erişim", "Şüpheli oturum açma"] as const;
type Cat = (typeof CATS)[number];

type Log = { id: number; time: string; user: string; role: string; action: string; resource: string; answer: Cat; why: string };

const LOGS: Log[] = [
  { id: 1, time: "09:02", user: "ayse.k", role: "Satış", action: "Oturum açıldı (İstanbul, kurum ağı)", resource: "CRM", answer: "Normal davranış", why: "Mesai saatinde, tanıdık konum ve kurum ağından normal bir giriş." },
  { id: 2, time: "02:47", user: "mehmet.t", role: "Muhasebe", action: "Dosya açıldı", resource: "Maaslar_2025.xlsx", answer: "Mesai dışı erişim", why: "Gece 02:47'de, olağan mesai saatleri dışında hassas maaş dosyasına erişim; bağlam sorgulanmalı." },
  { id: 3, time: "14:10", user: "can.y", role: "Satış", action: "1.850 müşteri kaydı CSV olarak indirildi (günlük ortalama: 20)", resource: "CRM / Musteri_Listesi", answer: "Aşırı veri indirme/aktarma", why: "Olağan davranışın ~90 katı hacimde veri indirmek veri sızıntısı riski taşır." },
  { id: 4, time: "11:05", user: "elif.d", role: "Stajyer", action: "6 kez erişim denendi → REDDEDİLDİ", resource: "/Yonetim/Stratejik_Plan", answer: "Yetkisiz erişim", why: "Stajyerin rolüyle ilgisi olmayan yönetim klasörüne tekrar tekrar erişim denemesi yetki sınırlarını yoklamadır." },
  { id: 5, time: "03:12", user: "mehmet.t", role: "Muhasebe", action: "Oturum açıldı (Romanya IP) – 5 dk önce İstanbul'da da oturum açık", resource: "Mail / VPN", answer: "Şüpheli oturum açma", why: "İmkânsız seyahat (aynı hesap aynı anda iki ülkede) ve alışılmadık konum, hesabın ele geçirildiğini düşündürür." },
  { id: 6, time: "18:45", user: "can.y", role: "Satış", action: "Musteri_Listesi.csv kişisel bulut hesabına yüklendi", resource: "kisisel-bulut.example", answer: "Aşırı veri indirme/aktarma", why: "Hassas verinin kurum dışı kişisel depolamaya aktarılması bir veri sızıntısı belirtisidir." },
  { id: 7, time: "10:30", user: "zeynep.a", role: "İK", action: "Personel özlük dosyası görüntülendi", resource: "/IK/Ozluk", answer: "Normal davranış", why: "İK çalışanının rolü gereği erişimi var, mesai saatinde ve beklenen hacimde." },
  { id: 8, time: "22:30", user: "burak.s", role: "BT Yöneticisi", action: "Sunucu yeniden başlatıldı (Değişiklik talebi #4821 – planlı bakım)", resource: "APP-SRV-02", answer: "Normal davranış", why: "Mesai dışı olsa da onaylı değişiklik talebi ve bakım penceresi var; bağlam normal olduğunu gösterir." },
  { id: 9, time: "12:40", user: "ayse.k", role: "Satış", action: "2 hatalı parola, ardından başarılı giriş", resource: "CRM", answer: "Normal davranış", why: "Birkaç yanlış deneme sıradan bir yazım hatasıdır; tek başına şüpheli değildir." },
  { id: 10, time: "16:20", user: "elif.d", role: "Stajyer", action: "Ödev klasörü açıldı", resource: "/Staj/Odevlerim", answer: "Normal davranış", why: "Kendi görev alanında, beklenen erişim." },
  { id: 11, time: "02:55", user: "mehmet.t", role: "Muhasebe", action: "Maaslar_2025.xlsx harici USB belleğe kopyalandı", resource: "USB-Depolama", answer: "Aşırı veri indirme/aktarma", why: "Hassas dosyanın mesai dışında çıkarılabilir ortama kopyalanması aktarım/sızıntı belirtisidir (aynı zamanda mesai dışıdır)." },
  { id: 12, time: "13:15", user: "zeynep.a", role: "İK", action: "Ekip toplantı notları paylaşıldı", resource: "SharePoint/IK-Ekibi", answer: "Normal davranış", why: "Rutin ekip içi paylaşım." },
];

export default function Lab11({ onComplete, done }: LabProps) {
  const [sel, setSel] = useState<Record<number, Cat>>({});
  const [submitted, setSubmitted] = useState(false);
  const [action, setAction] = useState<number | null>(null);

  const answered = Object.keys(sel).length;
  const score = LOGS.filter((l) => sel[l.id] === l.answer).length;

  const empRisk = useMemo(() => {
    const m: Record<string, number> = {};
    LOGS.forEach((l) => { if (sel[l.id] && sel[l.id] !== "Normal davranış") m[l.user] = (m[l.user] ?? 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [sel]);

  const ACTIONS = [
    { t: "Hesabı hemen sil ve çalışanı suçla", ok: 0, why: "Kanıt ve süreç kaybolur; yanlış alarm ise haksızlık olur." },
    { t: "Hesabın oturumunu sonlandır, parolayı sıfırla, MFA iste ve kullanıcıyla bağımsız kanaldan iletişime geç", ok: 2, why: "Hesap ele geçirilmiş olabilir; önce erişimi kısıt, sonra doğrula. Kanıt ve loglar korunur." },
    { t: "Hiçbir şey yapma; tek bir olay", ok: 0, why: "Aynı kullanıcıda mesai dışı erişim, USB aktarımı ve imkânsız seyahat birlikte güçlü bir örüntüdür." },
  ];

  const finished = submitted && action !== null;
  useEffect(() => {
    if (finished) onComplete();
  }, [finished, onComplete]);

  return (
    <LabPanel title="Laboratuvar 11 – Kullanıcı Aktivite Analizi" intro="Sanal şirketin sentetik işlem kayıtlarını incele. Her kayıt için bir sınıflandırma seç: normal mi, yoksa hangi nedenle şüpheli? Sonra değerlendirmeyi gör." done={done}>
      <InfoBox tone="brand" icon="🎯" title="Görev">12 kaydı sınıflandır. Dikkat: mesai dışı olması her zaman şüpheli değildir; bağlam (rol, onay, hacim, konum) önemlidir.</InfoBox>
      <div className="flex items-center gap-3 text-sm">
        <span className="font-semibold">{answered}/{LOGS.length} sınıflandırıldı</span>
        <ProgressBar value={(answered / LOGS.length) * 100} className="max-w-xs flex-1" />
      </div>

      <div className="grid gap-2 lg:grid-cols-2">
        {LOGS.map((l) => {
          const s = sel[l.id];
          const ok = submitted && s === l.answer;
          const bad = submitted && s !== l.answer;
          return (
            <Card key={l.id} className={`!p-3 ${ok ? "border-ok/50" : bad ? "border-bad/50" : ""}`}>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded bg-ink px-1.5 py-0.5 font-mono text-white">{l.time}</span>
                <span className="font-mono font-bold">{l.user}</span>
                <Badge tone="muted">{l.role}</Badge>
              </div>
              <p className="mt-1.5 text-sm font-semibold">{l.action}</p>
              <p className="font-mono text-xs text-muted">{l.resource}</p>
              <select
                aria-label={`Kayıt ${l.id} sınıflandırma`}
                disabled={submitted}
                value={s ?? ""}
                onChange={(e) => setSel({ ...sel, [l.id]: e.target.value as Cat })}
                className="mt-2 w-full rounded-lg border border-line bg-white px-2 py-1.5 text-sm"
              >
                <option value="">Sınıflandır…</option>
                {CATS.map((c) => <option key={c}>{c}</option>)}
              </select>
              {submitted && (
                <p className={`ag-fade mt-2 rounded-lg px-2.5 py-2 text-xs ${ok ? "bg-ok/10" : "bg-bad/10"}`}>
                  {ok ? "✅ Doğru. " : `❌ Doğru sınıf: ${l.answer}. `}{l.why}
                </p>
              )}
            </Card>
          );
        })}
      </div>

      {!submitted ? (
        <Btn disabled={answered < LOGS.length} onClick={() => setSubmitted(true)}>Değerlendirmeyi tamamla</Btn>
      ) : (
        <div className="space-y-3">
          <Feedback ok={score >= 9 ? true : score >= 6 ? null : false} title={`Skorun: ${score}/${LOGS.length}`}>
            İç tehdit tespitinde tek bir olay değil, örüntü ve bağlam önemlidir. Şüpheli işaretlediğin kullanıcılar aşağıda risk sırasına göre listelenir.
          </Feedback>
          <Card>
            <p className="font-bold">Senin işaretlemene göre çalışan risk sıralaması</p>
            {empRisk.length === 0 ? <p className="mt-1 text-sm text-muted">Hiç şüpheli işaretlemedin.</p> : (
              <ul className="mt-2 space-y-1.5">
                {empRisk.map(([u, n]) => (
                  <li key={u} className="flex items-center gap-2 text-sm">
                    <span className="w-24 font-mono font-bold">{u}</span>
                    <ProgressBar className="flex-1" tone={n >= 3 ? "bad" : "warn"} value={Math.min(100, n * 33)} />
                    <span className="w-16 text-right text-xs">{n} olay</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card>
            <p className="font-bold">Son karar: mehmet.t hesabı için en doğru ilk adım nedir?</p>
            <div className="mt-2 space-y-2">
              {ACTIONS.map((a, i) => (
                <Choice key={i} disabled={action !== null} state={action === null ? "idle" : i === action ? (a.ok ? "correct" : "wrong") : a.ok ? "missed" : "idle"} onClick={() => setAction(i)}>{a.t}</Choice>
              ))}
            </div>
            {action !== null && <div className="mt-3"><Feedback ok={ACTIONS[action].ok === 2}>{ACTIONS[action].why} Ayrıca uzun vadede <b>en az yetki</b> ilkesi ve erişim gözden geçirmeleri benzer riskleri azaltır.</Feedback></div>}
          </Card>
          <Btn variant="ghost" size="sm" onClick={() => { setSel({}); setSubmitted(false); setAction(null); }}>Baştan başla</Btn>
        </div>
      )}
    </LabPanel>
  );
}
