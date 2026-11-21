"use client";

import { useState } from "react";
import Link from "next/link";
import { finalQuestions } from "@/data/final";
import { Badge, Btn, Callout, Card, Progress } from "@/components/ui";
import { saveFinal, TOTAL_LESSONS, useProgress } from "@/lib/storage";

const N = finalQuestions.length;

export function FinalExam() {
  const prog = useProgress();
  const [mode, setMode] = useState<"intro" | "exam" | "result">("intro");
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(N).fill(-1));
  const [view, setView] = useState<number[] | null>(null);

  const answered = answers.filter((a) => a >= 0).length;

  const finish = () => {
    const correct = answers.filter((a, k) => a === finalQuestions[k].a).length;
    const percent = Math.round((correct / N) * 100);
    saveFinal({ correct, wrong: N - correct, percent, passed: percent >= 70, answers, at: new Date().toISOString() });
    setView(answers);
    setMode("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startExam = () => {
    setAnswers(Array(N).fill(-1));
    setI(0);
    setMode("exam");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (mode === "intro") {
    const f = prog.final;
    return (
      <div className="mx-auto max-w-3xl space-y-5 px-4 py-8 sm:py-12">
        <Link href="/" className="text-sm font-semibold text-brand hover:underline">← Panele dön</Link>
        <Card className="p-6 sm:p-8">
          <div className="flex flex-wrap gap-2"><Badge>Modül 03</Badge><Badge tone="muted">Final Sınavı</Badge></div>
          <h1 className="mt-3 text-3xl font-extrabold">Ağ Teknolojileri Temelleri – Final Sınavı</h1>
          <ul className="mt-4 space-y-2 text-[15px]">
            <li>📝 <b>{N} soru</b>, her biri 4 seçenekli.</li>
            <li>📚 16 dersin tamamını kapsar; kolay, orta ve uygulama mantığı gerektiren sorular içerir.</li>
            <li>🎯 Başarı sınırı <b>%70</b> (14 doğru).</li>
            <li>📊 Sonunda doğru/yanlış sayısı, başarı yüzdesi ve soru bazında açıklamalı değerlendirme gösterilir.</li>
            <li>💾 Sonucun tarayıcında saklanır ve modül tamamlanma durumu güncellenir.</li>
          </ul>
          {prog.completed.length < TOTAL_LESSONS && <div className="mt-4"><Callout kind="warn" title="Öneri">{TOTAL_LESSONS - prog.completed.length} ders henüz tamamlanmadı. Daha iyi bir sonuç için önce dersleri bitirmeni öneririz. Sınav yine de açıktır.</Callout></div>}
          <div className="mt-6 flex flex-wrap gap-2">
            <Btn onClick={startExam}>{f ? "Sınavı Yeniden Çöz" : "Sınava Başla"}</Btn>
            {f && <Btn variant="soft" onClick={() => { setView(f.answers); setMode("result"); }}>Son Sonucu Gör (%{f.percent})</Btn>}
          </div>
        </Card>
      </div>
    );
  }

  if (mode === "result" && view) {
    const correct = view.filter((a, k) => a === finalQuestions[k].a).length;
    const percent = Math.round((correct / N) * 100);
    const passed = percent >= 70;
    const levels = (["Kolay", "Orta", "Uygulama"] as const).map((lv) => {
      const idx = finalQuestions.map((q, k) => (q.level === lv ? k : -1)).filter((k) => k >= 0);
      return { lv, total: idx.length, ok: idx.filter((k) => view[k] === finalQuestions[k].a).length };
    });
    return (
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:py-12">
        <Card className={`p-6 sm:p-8 ${passed ? "border-ok/50" : "border-warn/60"}`}>
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Final Sınavı Sonucu</p>
          <h1 className={`mt-1 text-3xl font-extrabold ${passed ? "text-ok" : "text-[#9a6a14]"}`}>{passed ? "🎉 Tebrikler, Modül 03'ü başarıyla tamamladın!" : "Modülü tamamladın, ancak başarı sınırının altındasın"}</h1>
          <p className="mt-2 text-sm text-muted">{passed ? "Ağ teknolojileri temellerini iyi kavradığını gösterdin. Sıradaki modüle hazırsın." : "Zayıf kaldığın konuların derslerine dönüp laboratuvarları tekrar etmeni ve sınavı yeniden çözmeni öneririz."}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            {[["Doğru", String(correct), "text-ok"], ["Yanlış", String(N - correct), "text-err"], ["Başarı", `%${percent}`, "text-brand"], ["Genel sonuç", passed ? "Başarılı" : "Tekrar", passed ? "text-ok" : "text-[#9a6a14]"]].map(([k, v, c]) => (
              <div key={k} className="rounded-xl border border-line bg-white p-4"><p className="text-xs font-semibold uppercase text-muted">{k}</p><p className={`text-2xl font-extrabold ${c}`}>{v}</p></div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
            {levels.map((l) => <Badge key={l.lv} tone="muted">{l.lv}: {l.ok}/{l.total}</Badge>)}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Btn onClick={startExam}>↺ Sınavı Yeniden Çöz</Btn>
            <Link href="/" className="inline-flex min-h-[40px] items-center rounded-xl border border-line bg-white px-4 text-sm font-semibold hover:bg-soft">Panele Dön</Link>
          </div>
        </Card>
        <div className="space-y-3">
          <h2 className="text-xl font-bold">Soru Bazında Değerlendirme</h2>
          {finalQuestions.map((q, k) => {
            const ok = view[k] === q.a;
            return (
              <div key={k} className={`rounded-xl border p-4 text-sm ${ok ? "border-ok/30 bg-[#E9F5EF]" : "border-err/30 bg-[#F9ECEC]"}`}>
                <div className="mb-1 flex flex-wrap items-center gap-2"><Badge tone={ok ? "ok" : "err"}>{ok ? "Doğru" : view[k] < 0 ? "Boş" : "Yanlış"}</Badge><Badge tone="muted">{q.level}</Badge><Link href={`/ders/${q.lesson}`} className="text-xs font-semibold text-brand hover:underline">Ders {String(q.lesson).padStart(2, "0")}</Link></div>
                <p className="font-semibold">{k + 1}. {q.q}</p>
                {!ok && view[k] >= 0 && <p className="mt-1 text-err">Senin cevabın: {q.o[view[k]]}</p>}
                <p className="mt-1">Doğru cevap: <b className="text-ok">{q.o[q.a]}</b></p>
                <p className="mt-1 text-muted">{q.e}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const q = finalQuestions[i];
  const sel = answers[i];
  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-8 sm:py-12">
      <div className="flex items-center gap-3">
        <Progress value={(answered / N) * 100} className="flex-1" />
        <span className="text-sm font-semibold text-muted">Cevaplanan {answered}/{N}</span>
      </div>
      <Card className="p-5 sm:p-7">
        <div className="mb-3 flex flex-wrap items-center gap-2"><Badge>Soru {i + 1}/{N}</Badge><Badge tone="muted">{q.level}</Badge></div>
        <h2 className="text-lg font-bold leading-snug">{q.q}</h2>
        <div className="mt-4 grid gap-2">
          {q.o.map((o, k) => (
            <button key={k} type="button" onClick={() => setAnswers((a) => a.map((x, idx) => (idx === i ? k : x)))} className={`flex min-h-[46px] items-center gap-3 rounded-xl border px-4 py-2 text-left text-sm font-medium transition ${sel === k ? "border-brand bg-soft ring-2 ring-brand/30" : "border-line bg-white hover:bg-soft"}`}>
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${sel === k ? "bg-brand text-white" : "bg-soft text-brand"}`}>{"ABCD"[k]}</span>
              {o}
            </button>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Btn variant="ghost" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>← Önceki</Btn>
          {i < N - 1 ? <Btn onClick={() => setI(i + 1)}>Sonraki →</Btn> : <Btn variant="ok" onClick={finish} disabled={answered < N}>Sınavı Bitir</Btn>}
        </div>
        {i === N - 1 && answered < N && <p className="mt-3 text-sm text-warn">Sınavı bitirmek için tüm soruları cevapla (boş: {answers.map((a, k) => (a < 0 ? k + 1 : null)).filter(Boolean).join(", ")}).</p>}
      </Card>
      <div className="grid grid-cols-10 gap-1.5">
        {answers.map((a, k) => (
          <button key={k} type="button" onClick={() => setI(k)} className={`h-9 rounded-lg border text-xs font-bold ${k === i ? "border-brand bg-brand text-white" : a >= 0 ? "border-ok/40 bg-[#E9F5EF] text-ok" : "border-line bg-white text-muted"}`}>{k + 1}</button>
        ))}
      </div>
      {answered === N && i !== N - 1 && <Btn variant="ok" onClick={finish}>Sınavı Bitir ve Sonucu Gör</Btn>}
    </div>
  );
}
