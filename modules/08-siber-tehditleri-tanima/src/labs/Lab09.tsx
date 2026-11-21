"use client";

import { useEffect, useRef, useState } from "react";
import { Badge, Btn, Card, Choice, Feedback, InfoBox, LabPanel, Tabs } from "@/components/ui";
import type { LabProps } from "./types";

type Sid = "http" | "mitm" | "tls" | "cert";
const SCEN: { id: Sid; title: string; attacker: boolean; tls: boolean; desc: string }[] = [
  { id: "http", title: "1) Normal HTTP", attacker: false, tls: false, desc: "Saldırgan yok. Bağlantı HTTP; şifreleme yok." },
  { id: "mitm", title: "2) HTTP + saldırgan", attacker: true, tls: false, desc: "Güvensiz Wi-Fi'da saldırgan araya girmiş (ARP Spoofing simülasyonu)." },
  { id: "tls", title: "3) HTTPS/TLS + saldırgan", attacker: true, tls: true, desc: "Saldırgan hâlâ araya girmiş ama bağlantı TLS ile korunuyor." },
  { id: "cert", title: "4) Sahte sertifika", attacker: true, tls: true, desc: "Saldırgan sahte sertifika sunuyor; tarayıcı uyarı veriyor. Kararı sen ver." },
];

const fakeCipher = (s: string) => Array.from(s).map((c) => (c.charCodeAt(0) ^ 0x5a).toString(16).padStart(2, "0")).join(" ");

type Node = { id: string; icon: string; name: string };

export default function Lab09({ onComplete, done }: LabProps) {
  const [sid, setSid] = useState<Sid>("http");
  const [msg, setMsg] = useState("kullanici: ayse, parola: Demo123");
  const [tamper, setTamper] = useState(false);
  const [step, setStep] = useState(-1);
  const [sent, setSent] = useState<Record<string, { readable: boolean; modified: boolean; note: string }>>({});
  const [warn, setWarn] = useState(false);
  const [quiz, setQuiz] = useState<string[]>([]);
  const [quizDone, setQuizDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>[]>([]);

  const sc = SCEN.find((s) => s.id === sid)!;
  const nodes: Node[] = sc.attacker
    ? [{ id: "a", icon: "👩", name: "Ayşe (kullanıcı)" }, { id: "w", icon: "📡", name: "Wi-Fi / ağ geçidi" }, { id: "x", icon: "🕵️", name: "Saldırgan" }, { id: "s", icon: "🖥️", name: "Sunucu" }]
    : [{ id: "a", icon: "👩", name: "Ayşe (kullanıcı)" }, { id: "w", icon: "📡", name: "Wi-Fi / ağ geçidi" }, { id: "s", icon: "🖥️", name: "Sunucu" }];

  useEffect(() => () => timer.current.forEach(clearTimeout), []);

  const clearTimers = () => { timer.current.forEach(clearTimeout); timer.current = []; };

  const finishScenario = (readable: boolean, modified: boolean, note: string) => setSent((s) => ({ ...s, [sid]: { readable, modified, note } }));

  const send = () => {
    clearTimers();
    setWarn(false);
    setStep(0);
    const n = nodes.length;
    for (let i = 1; i < n; i++) timer.current.push(setTimeout(() => setStep(i), i * 750));
    timer.current.push(setTimeout(() => {
      if (sid === "cert") { setWarn(true); return; }
      if (sid === "http") finishScenario(false, false, "Saldırgan yok; yine de veri şifrelenmediği için ağdaki herkes okuyabilirdi.");
      if (sid === "mitm") finishScenario(true, tamper, tamper ? "Saldırgan mesajı okudu ve değiştirdi; sunucu farkına varmadı." : "Saldırgan mesajı düz metin olarak okudu.");
      if (sid === "tls") finishScenario(false, false, tamper ? "Saldırgan veriyi değiştirmeyi denedi; TLS bütünlük kontrolü başarısız oldu ve bağlantı kesildi. İçerik okunamadı." : "Saldırgan yalnızca şifreli, anlamsız veri gördü.");
    }, n * 750));
  };

  const decide = (cont: boolean) => {
    setWarn(false);
    if (cont) finishScenario(true, true, "Sertifika uyarısını geçtin: saldırgan kendi sertifikasıyla TLS'i sonlandırdı ve mesajını düz metin gördü. Uyarılar ciddiye alınmalı.");
    else finishScenario(false, false, "Uyarıyı ciddiye alıp durdun. Saldırgan sahte sertifika ile içeriğe erişemedi.");
  };

  const sentCount = Object.keys(sent).length;
  const truth = SCEN.filter((s) => sent[s.id]?.readable).map((s) => s.id);
  const quizOk = quizDone && quiz.length === truth.length && quiz.every((q) => truth.includes(q as Sid));
  const finished = sentCount === SCEN.length && quizDone;
  useEffect(() => {
    if (finished) onComplete();
  }, [finished, onComplete]);

  const view = (nodeId: string): { label: string; data: string; tone: "ok" | "bad" | "muted" } => {
    const shown = tamper && sc.attacker && !sc.tls ? "hesap no: TR00 SALDIRGAN" : msg;
    if (nodeId === "a") return { label: "Gönderdiği", data: msg, tone: "muted" };
    if (nodeId === "w") return { label: "Ağ geçidinde görünen", data: sc.tls ? fakeCipher(msg) : msg, tone: sc.tls ? "ok" : "bad" };
    if (nodeId === "x") return { label: "Saldırganın gördüğü", data: sc.tls ? (sid === "cert" ? "(uyarıya bağlı)" : fakeCipher(msg)) : msg, tone: sc.tls ? "ok" : "bad" };
    return { label: "Sunucunun aldığı", data: sc.tls ? (tamper ? "(bütünlük hatası: bağlantı kesildi)" : msg) : shown, tone: "muted" };
  };

  const r = sent[sid];

  return (
    <LabPanel title="Laboratuvar 9 – Ortadaki Adam Simülasyonu" intro="Bir kullanıcı, bir ağ geçidi ve bir sunucu arasındaki iletişimi izle. Araya giren saldırganın hangi durumda veriyi okuyabildiğini karşılaştır." done={done}>
      <InfoBox tone="brand" icon="🎯" title="Görev">4 senaryonun hepsinde bir mesaj gönder, sonuçları karşılaştır ve alttaki soruyu cevapla. (Simülasyon: gerçek ağ trafiği, ARP veya DNS spoofing yoktur; ‘şifreleme’ görsel örnektir.)</InfoBox>
      <Tabs variant="pill" value={sid} onChange={(v) => { setSid(v); setStep(-1); setWarn(false); clearTimers(); }} tabs={SCEN.map((s) => ({ id: s.id, label: s.title, badge: sent[s.id] ? "✓" : "" }))} />
      <p className="text-sm text-muted">{sc.desc}</p>

      <Card>
        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
          {nodes.map((n, i) => (
            <div key={n.id} className="flex items-center gap-1 sm:gap-2">
              <div className={`w-20 rounded-xl border-2 p-2 text-center transition-all sm:w-28 ${step === i ? "scale-105 border-brand bg-soft" : n.id === "x" ? "border-bad/40 bg-bad/5" : "border-line bg-white"}`}>
                <p className="text-2xl" aria-hidden>{n.icon}</p>
                <p className="text-[10px] font-semibold sm:text-xs">{n.name}</p>
                {step >= i && step !== -1 && (
                  <p className="ag-fade mt-1 break-all rounded bg-page px-1 py-0.5 font-mono text-[9px] leading-tight sm:text-[10px]">{n.id === "a" ? "📤 gönderiyor" : n.id === "s" ? "📥 aldı" : "👀 görüyor"}</p>
                )}
              </div>
              {i < nodes.length - 1 && (
                <div className="flex w-6 flex-col items-center sm:w-10" aria-hidden>
                  <span className={`text-lg ${step > i ? (sc.tls ? "text-ok" : "text-bad") : "text-muted/40"}`}>{sc.tls ? "🔒" : "➜"}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <label className="text-xs font-semibold text-muted">Gönderilecek örnek mesaj (sentetik)
            <input value={msg} maxLength={60} onChange={(e) => setMsg(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-page px-3 py-2 font-mono text-sm text-ink outline-none focus:border-accent" />
          </label>
          <div className="flex flex-wrap items-end gap-2">
            {sc.attacker && sid !== "cert" && (
              <label className="flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm"><input type="checkbox" className="accent-[#176B87]" checked={tamper} onChange={(e) => setTamper(e.target.checked)} />Saldırgan mesajı değiştirsin</label>
            )}
            <Btn onClick={send} disabled={!msg.trim()}>✉️ Mesajı gönder</Btn>
          </div>
        </div>
        {sc.attacker && (
          <div className="mt-3 rounded-xl border border-line bg-page p-3 text-xs">
            <p className="font-bold">📒 ARP tablosu (kullanıcının cihazı, sentetik)</p>
            <p className="mt-1 font-mono">192.168.1.1 (ağ geçidi) → <span className="font-bold text-bad">AA:BB:CC:00:11:22 (saldırganın cihazı!)</span></p>
            <p className="text-muted">ARP Spoofing: saldırgan ‘ağ geçidi benim’ diyerek trafiği kendi üzerinden geçirir. Normalde bu satır ağ geçidinin gerçek MAC adresini gösterir.</p>
          </div>
        )}
      </Card>

      {step >= 0 && (
        <Card className="ag-fade">
          <p className="text-sm font-bold">👁 Kim ne görüyor?</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {nodes.filter((_, i) => step >= i).map((n) => {
              const v = view(n.id);
              return (
                <div key={n.id} className={`rounded-xl border p-2.5 text-xs ${v.tone === "bad" ? "border-bad/40 bg-bad/10" : v.tone === "ok" ? "border-ok/40 bg-ok/10" : "border-line bg-page"}`}>
                  <p className="font-semibold">{n.icon} {n.name} – {v.label}</p>
                  <p className="mt-1 break-all font-mono">{v.data}</p>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {warn && (
        <div role="alertdialog" aria-label="Sertifika uyarısı" className="ag-fade rounded-2xl border-2 border-warn bg-warn/10 p-4">
          <p className="text-lg font-bold">⚠️ Bağlantınız gizli değil</p>
          <p className="mt-1 text-sm">Bu sunucunun güvenlik sertifikası geçersiz (sertifika sahibi: bilinmeyen / ağ geçidi). Saldırganlar bilgilerinizi çalmaya çalışıyor olabilir.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Btn onClick={() => decide(false)}>⬅ Güvenli sayfaya dön</Btn>
            <Btn variant="danger" onClick={() => decide(true)}>Yine de devam et (önerilmez)</Btn>
          </div>
        </div>
      )}

      {r && step >= 0 && !warn && (
        <Feedback ok={!r.readable} title={r.readable ? "Veri okunabildi!" : "Veri okunamadı"}>{r.note}</Feedback>
      )}

      <Card>
        <p className="text-sm font-bold">📋 Karşılaştırma</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead><tr className="bg-soft text-xs uppercase text-brand"><th className="px-3 py-2">Senaryo</th><th className="px-3 py-2">Saldırgan okudu mu?</th><th className="px-3 py-2">Değiştirebildi mi?</th></tr></thead>
            <tbody>
              {SCEN.map((s) => (
                <tr key={s.id} className="border-t border-line">
                  <td className="px-3 py-2 font-semibold">{s.title}</td>
                  <td className="px-3 py-2">{sent[s.id] ? (s.attacker ? (sent[s.id].readable ? <Badge tone="bad">Evet</Badge> : <Badge tone="ok">Hayır</Badge>) : <Badge tone="muted">Saldırgan yok</Badge>) : <span className="text-muted">gönder</span>}</td>
                  <td className="px-3 py-2">{sent[s.id] ? (sent[s.id].modified ? <Badge tone="bad">Evet</Badge> : <Badge tone="ok">Hayır</Badge>) : <span className="text-muted">–</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {sentCount === SCEN.length && (
        <Card className="ag-fade space-y-3">
          <p className="font-bold">Son soru: Hangi senaryolarda saldırgan mesajı okuyabildi?</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {SCEN.map((s) => {
              const sel = quiz.includes(s.id);
              const real = truth.includes(s.id);
              return <Choice key={s.id} selected={sel} disabled={quizDone} state={quizDone ? (sel ? (real ? "correct" : "wrong") : real ? "missed" : "idle") : "idle"} onClick={() => setQuiz(sel ? quiz.filter((x) => x !== s.id) : [...quiz, s.id])}>{s.title}</Choice>;
            })}
          </div>
          {!quizDone ? <Btn onClick={() => setQuizDone(true)}>Cevabı kontrol et</Btn> : (
            <Feedback ok={quizOk} title={quizOk ? "Doğru!" : "Biraz daha dikkat"}>Şifrelenmemiş HTTP (senaryo 2) ve uyarıyı geçtiysen sahte sertifika (senaryo 4) durumunda veri okunabilir. Geçerli TLS araya giren saldırganı içerikten uzak tutar; HTTP&apos;de ise düz metin her zaman risklidir.</Feedback>
          )}
        </Card>
      )}
    </LabPanel>
  );
}
