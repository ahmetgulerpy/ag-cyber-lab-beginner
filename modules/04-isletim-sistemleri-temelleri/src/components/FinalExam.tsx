"use client";
import Link from "next/link";
import { useState } from "react";
import { FINAL_QUESTIONS, FINAL_LEVELS } from "@/data/final";
import { lessonsDone, useProgress } from "@/lib/store";
import QuizRunner, { Review } from "@/components/Quiz";
import { Callout, ProgressBar } from "@/components/ui";

function verdict(p: number) {
  if (p >= 85) return { t: "Üstün başarı — işletim sistemleri temellerini çok iyi kavradın.", tone: "ok" as const };
  if (p >= 70) return { t: "Başarılı — temel kavramlara hâkimsin; eksik konuları tekrar edebilirsin.", tone: "ok" as const };
  if (p >= 60) return { t: "Geçer — bazı konuları tekrar etmen faydalı olur.", tone: "warn" as const };
  return { t: "Yetersiz — ilgili dersleri ve laboratuvarları tekrar edip sınavı yeniden dene.", tone: "bad" as const };
}

export default function FinalExam() {
  const { progress, saveFinal, resetFinal } = useProgress();
  const [phase, setPhase] = useState<"intro" | "run" | "result">("intro");
  const [answers, setAnswers] = useState<number[]>([]);
  const done = lessonsDone(progress);

  const finish = (ans: number[], score: number) => {
    const pct = Math.round((score / FINAL_QUESTIONS.length) * 100);
    saveFinal({ score, total: FINAL_QUESTIONS.length, pct, answers: ans });
    setAnswers(ans);
    setPhase("result");
  };

  const showAnswers = phase === "result" ? answers : progress.final?.answers ?? [];
  const showResult = phase === "result" || (phase === "intro" && !!progress.final && showAnswers.length === FINAL_QUESTIONS.length && false);
  const [viewPrev, setViewPrev] = useState(false);

  const renderResult = (ans: number[]) => {
    const score = ans.filter((a, i) => a === FINAL_QUESTIONS[i][2]).length;
    const wrong = FINAL_QUESTIONS.length - score;
    const pct = Math.round((score / FINAL_QUESTIONS.length) * 100);
    const v = verdict(pct);
    const complete = done === 14 && pct >= 60;
    return (
      <div className="space-y-5">
        <div className="card p-6">
          <h2 className="text-2xl font-extrabold">Final sınavı sonucu</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <div className="card-soft p-3 text-center"><p className="text-3xl font-extrabold text-ok">{score}</p><p className="text-xs text-muted">Doğru</p></div>
            <div className="card-soft p-3 text-center"><p className="text-3xl font-extrabold text-bad">{wrong}</p><p className="text-xs text-muted">Yanlış</p></div>
            <div className="card-soft p-3 text-center"><p className="text-3xl font-extrabold text-brand">%{pct}</p><p className="text-xs text-muted">Başarı</p></div>
            <div className="card-soft p-3 text-center"><p className="text-3xl font-extrabold text-ink">{FINAL_QUESTIONS.length}</p><p className="text-xs text-muted">Toplam soru</p></div>
          </div>
          <div className="mt-4"><ProgressBar value={pct} tone={v.tone === "bad" ? "bad" : v.tone === "warn" ? "warn" : "ok"} h={10} /></div>
          <div className="mt-4"><Callout type={v.tone === "ok" ? "tip" : v.tone === "warn" ? "warn" : "danger"} title="Genel sonuç">{v.t}</Callout></div>
          <div className="mt-3">
            {complete ? <Callout type="tip" title="Modül 04 tamamlandı 🎓">14 dersin tamamını bitirdin ve final sınavını başarıyla geçtin. Modül tamamlanma durumu kaydedildi.</Callout>
              : <Callout type="info" title="Modül durumu">Final sonucun kaydedildi. Modülün tam olarak tamamlanması için 14 dersin tamamının bitirilmesi ve final başarısının en az %60 olması gerekir (şu an {done}/14 ders tamamlandı).</Callout>}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn btn-primary" onClick={() => { setPhase("run"); setViewPrev(false); }}>↺ Sınavı yeniden çöz</button>
            <Link className="btn" href="/">← Panele dön</Link>
          </div>
        </div>
        <div className="card p-6"><h3 className="mb-3 text-lg font-extrabold">Soru bazında değerlendirme</h3><Review questions={FINAL_QUESTIONS} answers={ans} levels={FINAL_LEVELS} /></div>
      </div>
    );
  };

  void showResult;
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <header className="card mb-6 bg-gradient-to-br from-soft to-white p-6">
        <div className="flex flex-wrap gap-2"><span className="chip">Modül 04</span><span className="chip">Final sınavı</span><span className="chip">20 soru</span></div>
        <h1 className="mt-3 text-3xl font-extrabold">Final Sınavı — İşletim Sistemleri Temelleri</h1>
        <p className="mt-2 text-muted">14 dersin tamamını kapsayan kolay, orta ve uygulama mantığı gerektiren sorular.</p>
      </header>

      {phase === "intro" && (
        <div className="card space-y-4 p-6">
          <ul className="space-y-1.5 text-sm text-ink">
            <li>• 20 çoktan seçmeli soru; her soruda 4 seçenek vardır.</li>
            <li>• Sınav sırasında önceki sorulara dönüp cevabını değiştirebilirsin.</li>
            <li>• Sonunda doğru/yanlış sayısı, başarı yüzdesi ve soru bazında açıklamalar gösterilir.</li>
            <li>• Sonuç bu tarayıcıda (localStorage) saklanır.</li>
          </ul>
          {done < 14 && <Callout type="warn" title="Hatırlatma">Henüz {done}/14 dersi tamamladın. Sınavı şimdi çözebilirsin ancak modülün tamamlanmış sayılması için tüm dersleri bitirmen gerekir.</Callout>}
          {progress.final && (
            <div className="card-soft p-3 text-sm">Kayıtlı son sonucun: <b className="text-brand">{progress.final.score}/{progress.final.total} (%{progress.final.pct})</b>
              <div className="mt-2 flex flex-wrap gap-2"><button className="btn btn-sm" onClick={() => setViewPrev((v) => !v)}>{viewPrev ? "Önceki sonucu gizle" : "Önceki sonucu incele"}</button><button className="btn btn-sm btn-danger" onClick={resetFinal}>Final sonucunu sil</button></div></div>
          )}
          <button className="btn btn-primary" onClick={() => setPhase("run")}>▶ Sınavı başlat</button>
        </div>
      )}
      {phase === "intro" && viewPrev && progress.final && <div className="mt-5">{renderResult(progress.final.answers)}</div>}
      {phase === "run" && <div className="card p-6"><QuizRunner questions={FINAL_QUESTIONS} levels={FINAL_LEVELS} mode="final" onFinish={finish} /></div>}
      {phase === "result" && renderResult(showAnswers)}
    </main>
  );
}
