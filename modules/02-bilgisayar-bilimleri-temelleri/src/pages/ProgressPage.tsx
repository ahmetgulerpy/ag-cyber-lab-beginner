import { useState } from "react";
import { AlertTriangle, CheckCircle2, CircleDashed, RotateCcw } from "lucide-react";
import { lessons, lessonTitles } from "../data/lessons";
import { PASS_RATIO, STORAGE_KEY, TOTAL_LESSONS, useProgress } from "../progress";
import { Badge, Btn, Card, Feedback, ProgressBar, SectionTitle } from "../components/ui";

export default function ProgressPage() {
  const { progress, percent, reset } = useProgress();
  const [confirming, setConfirming] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  return (
    <div className="space-y-8">
      <SectionTitle eyebrow="İlerlemem" title="Eğitim ilerleme durumun">
        İlerleme bilgilerin yalnızca bu tarayıcıda saklanır (localStorage). Başka bir sunucuya gönderilmez.
      </SectionTitle>

      <Card className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-sm text-muted">Toplam ilerleme</div>
            <div className="text-4xl font-bold text-brand">%{percent}</div>
          </div>
          <div className="text-right text-sm text-muted">
            <div>
              Tamamlanan ders: <b className="text-ink">{progress.completedLessons.length}/{TOTAL_LESSONS}</b>
            </div>
            <div>
              Tamamlanan uygulama: <b className="text-ink">{progress.completedLabs.length}/{TOTAL_LESSONS}</b>
            </div>
          </div>
        </div>
        <ProgressBar value={percent} />
        <p className="text-xs text-muted">İlerleme; tamamlanan uygulamalar, geçilen mini testler ve genel değerlendirmeden hesaplanır.</p>
      </Card>

      <Card className="overflow-x-auto p-0 sm:p-0">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-line bg-page text-left text-xs uppercase tracking-wider text-muted">
              <th className="px-4 py-3">Ders</th>
              <th className="px-4 py-3">Uygulama</th>
              <th className="px-4 py-3">Mini test</th>
              <th className="px-4 py-3">Durum</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((l) => {
              const q = progress.quizResults[l.id];
              const lab = progress.completedLabs.includes(l.id);
              const done = progress.completedLessons.includes(l.id);
              return (
                <tr key={l.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <a href={`#/lesson/${l.id}`} className="font-medium text-ink hover:text-brand">
                      {String(l.id).padStart(2, "0")} — {l.title}
                    </a>
                  </td>
                  <td className="px-4 py-3">{lab ? <CheckCircle2 className="h-5 w-5 text-ok" aria-label="Tamamlandı" /> : <CircleDashed className="h-5 w-5 text-muted" aria-label="Bekliyor" />}</td>
                  <td className="px-4 py-3">{q ? <Badge tone={q.score / q.total >= PASS_RATIO ? "ok" : "warn"}>{q.score}/{q.total}</Badge> : <span className="text-muted">—</span>}</td>
                  <td className="px-4 py-3">{done ? <Badge tone="ok">Tamamlandı</Badge> : <Badge tone="muted">Devam</Badge>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Card className="space-y-3">
        <h3 className="text-lg font-bold">Genel değerlendirme</h3>
        {progress.exam ? (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-3xl font-bold text-brand">%{progress.exam.percent}</span>
              <span className="text-sm text-muted">
                {progress.exam.score}/{progress.exam.total} doğru
              </span>
              <Badge tone={progress.exam.percent >= PASS_RATIO * 100 ? "ok" : "warn"}>{progress.exam.percent >= PASS_RATIO * 100 ? "Başarılı" : "Tekrar önerilir"}</Badge>
            </div>
            {progress.exam.weak.length > 0 && (
              <div className="text-sm">
                <div className="mb-1 font-semibold">Tekrar önerilen dersler:</div>
                <div className="flex flex-wrap gap-2">
                  {progress.exam.weak.map((w) => (
                    <a key={w} href={`#/lesson/${w}`} className="rounded-full bg-soft px-3 py-1 font-medium text-brand hover:bg-brand hover:text-white">
                      Ders {String(w).padStart(2, "0")} — {lessonTitles[w]}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-muted">
            Henüz çözülmedi. <a href="#/assessment" className="font-semibold text-brand">Genel değerlendirmeye git →</a>
          </p>
        )}
      </Card>

      <Card className="space-y-3 border-bad/30">
        <h3 className="text-lg font-bold">İlerlemeyi sıfırla</h3>
        <p className="text-sm text-muted">Tamamlanan dersler, uygulamalar, test sonuçları ve son ziyaret bilgileri silinir. Bu işlem geri alınamaz.</p>
        {resetDone && <Feedback tone="ok" title="İlerleme sıfırlandı." />}
        {!confirming ? (
          <Btn
            variant="secondary"
            onClick={() => {
              setConfirming(true);
              setResetDone(false);
            }}
          >
            <RotateCcw className="h-4 w-4" /> İlerlemeyi Sıfırla
          </Btn>
        ) : (
          <div className="space-y-3 rounded-lg border border-bad/40 bg-[#fbeeee] p-4">
            <div className="flex items-center gap-2 font-semibold text-bad">
              <AlertTriangle className="h-5 w-5" /> Emin misin?
            </div>
            <p className="text-sm">Tüm ilerlemen kalıcı olarak silinecek.</p>
            <div className="flex gap-2">
              <Btn
                variant="danger"
                onClick={() => {
                  reset();
                  setConfirming(false);
                  setResetDone(true);
                }}
              >
                Evet, Sıfırla
              </Btn>
              <Btn variant="secondary" onClick={() => setConfirming(false)}>
                Vazgeç
              </Btn>
            </div>
          </div>
        )}
        <p className="font-mono text-[11px] text-muted">localStorage anahtarı: {STORAGE_KEY}</p>
      </Card>
    </div>
  );
}
