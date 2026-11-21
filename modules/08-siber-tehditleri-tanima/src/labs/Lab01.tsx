"use client";

import { useEffect, useState } from "react";
import { Btn, Card, Choice, Feedback, LabPanel, ProgressBar, Tabs } from "@/components/ui";
import type { LabProps } from "./types";

type Item = { icon: string; title: string; desc: string; bad: boolean; why: string };

const ITEMS: Item[] = [
  { icon: "🎮", title: "Ucretsiz_Oyun_Hilesi_v2.exe", desc: "Bilinmeyen bir forumdan indirilen ‘hile’ programı. Kurulum için antivirüsü kapatmanı istiyor.", bad: true, why: "Kaynağı belirsiz, çalıştırılabilir ve güvenlik yazılımını kapatmanı isteyen dosya klasik bir Trojan belirtisidir." },
  { icon: "📝", title: "Not uygulaması güncellemesi", desc: "Resmî uygulama mağazasından gelen, geliştiricisi doğrulanmış güncelleme.", bad: false, why: "Resmî mağaza, doğrulanmış yayıncı ve beklenen davranış: bu güvenli bir güncellemedir." },
  { icon: "📎", title: "Faturam.pdf.exe", desc: "Tanımadığın birinden gelen e-posta eki. Simgesi PDF gibi görünüyor.", bad: true, why: "Çift uzantı (.pdf.exe) dosyanın aslında çalıştırılabilir olduğunu gizler. Çok yaygın bir bulaşma yöntemidir." },
  { icon: "🌙", title: "Gece 03:00 veri gönderimi", desc: "Hiç kullanmadığın bir program gece boyunca internete sürekli veri gönderiyor.", bad: true, why: "Kullanıcı etkileşimi olmadan, gizli ve sürekli veri çıkışı casus yazılım veya botnet bileşeni olabilir." },
  { icon: "🔔", title: "İşletim sistemi güvenlik güncellemesi", desc: "Sistem ayarlarından, resmî güncelleme merkezinden gelen bildirim.", bad: false, why: "Güncellemeyi sistemin kendi güvenli kanalından aldığın için meşrudur. Güncellemeler seni korur." },
  { icon: "🧩", title: "Kendiliğinden eklenen tarayıcı eklentisi", desc: "Ana sayfanı değiştiren ve sürekli reklam açan, kurduğunu hatırlamadığın eklenti.", bad: true, why: "İzinsiz kurulum ve tarayıcı ayarlarını ele geçirme, reklam yazılımı (Adware) / tarayıcı kaçırıcı belirtisidir." },
  { icon: "🔦", title: "El feneri uygulaması", desc: "Rehber, SMS ve mikrofon izni istiyor.", bad: true, why: "Uygulamanın işlevi ile istediği izinler uyuşmuyor. Gereksiz izin, veri toplama riskidir." },
  { icon: "🛠️", title: "İmzalı yazılım kurulumu", desc: "Güvenilir yayıncının imzalı kurulum dosyası; kurulum sırasında yönetici onayı istiyor.", bad: false, why: "Kurulum için yönetici izni normaldir. Önemli olan yayıncı imzası, resmî kaynak ve açıklanan işlevdir." },
];

type Cls = { text: string; answer: string; why: string };
const TYPES = ["Virüs", "Worm", "Trojan", "Ransomware", "Spyware", "Adware"];
const CLASSES: Cls[] = [
  { text: "Dosyalarım şifrelendi ve ekranda ‘Dosyalarını geri almak için ödeme yap’ yazıyor.", answer: "Ransomware", why: "Dosyaları şifreleyip fidye isteyen yazılım Ransomware'dir." },
  { text: "Telefonum konumumu, mesajlarımı ve arama kayıtlarımı gizlice bir sunucuya gönderiyor.", answer: "Spyware", why: "Kullanıcıyı gizlice izleyip veri gönderen yazılım casus yazılımdır (Spyware)." },
  { text: "Faydalı bir ‘sistem hızlandırıcı’ kurdum ama arka planda uzaktan erişim açıyor.", answer: "Trojan", why: "Meşru görünüp gizli zararlı işlev taşıyan yazılım Trojan'dır." },
  { text: "Hiçbir şey yapmadım ama ağdaki bütün bilgisayarlar birbiri ardına enfekte oldu.", answer: "Worm", why: "Kullanıcı etkileşimi olmadan ağ üzerinde kendiliğinden yayılan yazılım Worm'dur." },
  { text: "Çalıştırdığım program dosyalara kendini ekliyor; paylaştığım dosyalar da bozuluyor.", answer: "Virüs", why: "Konak dosyalara kendini ekleyerek yayılan yazılım Virüs'tür." },
  { text: "Tarayıcımda sürekli açılan pencereler ve değişmiş arama motoru var.", answer: "Adware", why: "Zorla reklam gösteren ve tarayıcı davranışını değiştiren yazılım Adware'dir." },
];

export default function Lab01({ onComplete, done }: LabProps) {
  const [tab, setTab] = useState<"a" | "b">("a");
  const [a, setA] = useState<Record<number, boolean>>({});
  const [b, setB] = useState<Record<number, string>>({});

  const aCount = Object.keys(a).length;
  const bCount = Object.keys(b).length;
  const aScore = ITEMS.filter((it, i) => a[i] === it.bad).length;
  const bScore = CLASSES.filter((c, i) => b[i] === c.answer).length;
  const finished = aCount === ITEMS.length && bCount === CLASSES.length;

  useEffect(() => {
    if (finished) onComplete();
  }, [finished, onComplete]);

  return (
    <LabPanel
      title="Laboratuvar 1 – Şüpheli mi, Normal mi?"
      intro="Önce dosya, uygulama ve davranış örneklerinde zararlı yazılım belirtisini bul; ardından belirtilere bakarak zararlı yazılım türünü sınıflandır."
      done={done}
    >
      <Tabs variant="pill" value={tab} onChange={setTab} tabs={[{ id: "a", label: "A) Belirti avı", badge: `${aCount}/${ITEMS.length}` }, { id: "b", label: "B) Tür sınıflandırma", badge: `${bCount}/${CLASSES.length}` }]} />

      {tab === "a" && (
        <div className="ag-fade grid gap-3 md:grid-cols-2">
          {ITEMS.map((it, i) => {
            const picked = a[i];
            const answered = picked !== undefined;
            const ok = picked === it.bad;
            return (
              <Card key={i}>
                <div className="flex items-start gap-3">
                  <span className="text-3xl" aria-hidden>{it.icon}</span>
                  <div>
                    <p className="font-mono text-sm font-bold">{it.title}</p>
                    <p className="mt-1 text-sm text-muted">{it.desc}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Choice disabled={answered} selected={picked === true} state={answered && picked === true ? (ok ? "correct" : "wrong") : "idle"} onClick={() => setA({ ...a, [i]: true })}>🚩 Zararlı belirtisi</Choice>
                  <Choice disabled={answered} selected={picked === false} state={answered && picked === false ? (ok ? "correct" : "wrong") : "idle"} onClick={() => setA({ ...a, [i]: false })}>✅ Normal</Choice>
                </div>
                {answered && <div className="mt-3"><Feedback ok={ok}>{it.why}</Feedback></div>}
              </Card>
            );
          })}
        </div>
      )}

      {tab === "b" && (
        <div className="ag-fade space-y-3">
          {CLASSES.map((c, i) => {
            const picked = b[i];
            const answered = picked !== undefined;
            return (
              <Card key={i}>
                <p className="text-sm font-semibold">“{c.text}”</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {TYPES.map((t) => (
                    <Btn
                      key={t}
                      size="sm"
                      disabled={answered}
                      variant={answered && t === picked ? (t === c.answer ? "primary" : "danger") : "secondary"}
                      onClick={() => setB({ ...b, [i]: t })}
                    >
                      {t}
                    </Btn>
                  ))}
                </div>
                {answered && <div className="mt-3"><Feedback ok={picked === c.answer}>{picked !== c.answer && <b>Doğru tür: {c.answer}. </b>}{c.why}</Feedback></div>}
              </Card>
            );
          })}
        </div>
      )}

      <Card className="bg-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold">Sonuç: Belirti avı {aScore}/{aCount} • Sınıflandırma {bScore}/{bCount}</p>
            <p className="text-xs text-muted">{finished ? "İki bölümü de tamamladın. Laboratuvar kaydedildi ✓" : "Laboratuvarı tamamlamak için iki bölümdeki tüm örnekleri cevapla."}</p>
          </div>
          <Btn variant="ghost" size="sm" onClick={() => { setA({}); setB({}); }}>Baştan başla</Btn>
        </div>
        <ProgressBar className="mt-3" tone="ok" value={((aCount + bCount) / (ITEMS.length + CLASSES.length)) * 100} />
      </Card>
    </LabPanel>
  );
}
