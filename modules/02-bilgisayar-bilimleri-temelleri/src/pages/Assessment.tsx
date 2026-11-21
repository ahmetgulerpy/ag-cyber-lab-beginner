import { useState } from "react";
import { Award, ClipboardCheck, Play } from "lucide-react";
import { lessons, lessonTitles } from "../data/lessons";
import { finalExam } from "../data/finalExam";
import { PASS_RATIO, useProgress } from "../progress";
import { Badge, Btn, Card, Feedback, SectionTitle } from "../components/ui";
import { Quiz } from "../components/Quiz";

export default function Assessment() {
  const { progress, saveExam } = useProgress();
  const [started, setStarted] = useState(false);
  const exam = progress.exam;
  const allDone = progress.completedLessons.length === 10;

  return (
    <div className="space-y-8">
      <section>
        <SectionTitle eyebrow="Değerlendirme" title="Genel değerlendirme sınavı">
          10 dersin tamamını kapsayan 20 soruluk sınav. Her soruda 4 seçenek vardır; cevaptan sonra açıklama gösterilir. Sonunda başarı yüzdeni ve tekrar etmen gereken dersleri görürsün.
        </SectionTitle>
        {!started ? (
          <Card className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-soft text-brand">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <div className="font-semibold">Modül 02 — Genel Değerlendirme</div>
                <div className="text-sm text-muted">20 soru · geçme sınırı %{PASS_RATIO * 100}</div>
              </div>
              {exam && <Badge tone={exam.percent >= PASS_RATIO * 100 ? "ok" : "warn"}>En iyi sonuç: %{exam.percent}</Badge>}
            </div>
            {!allDone && (
              <Feedback tone="info" title="Öneri">
                Henüz tüm dersleri tamamlamadın ({progress.completedLessons.length}/10). Sınavı istediğin zaman çözebilirsin, ancak önce dersleri bitirmek başarını artırır.
              </Feedback>
            )}
            {exam && exam.weak.length > 0 && (
              <div className="rounded-lg border border-line bg-page p-4 text-sm">
                <div className="mb-2 font-semibold">Son denemede tekrar önerilen dersler:</div>
                <div className="flex flex-wrap gap-2">
                  {exam.weak.map((w) => (
                    <a key={w} href={`#/lesson/${w}`} className="rounded-full bg-soft px-3 py-1 font-medium text-brand hover:bg-brand hover:text-white">
                      Ders {String(w).padStart(2, "0")} — {lessonTitles[w]}
                    </a>
                  ))}
                </div>
              </div>
            )}
            <Btn onClick={() => setStarted(true)}>
              <Play className="h-4 w-4" /> {exam ? "Sınavı Yeniden Çöz" : "Sınava Başla"}
            </Btn>
          </Card>
        ) : (
          <Quiz
            questions={finalExam}
            title="Genel Değerlendirme"
            lessonTitles={lessonTitles}
            onFinish={(score, weak) =>
              saveExam({ score, total: finalExam.length, percent: Math.round((score / finalExam.length) * 100), weak, at: Date.now() })
            }
          />
        )}
      </section>

      <section>
        <SectionTitle eyebrow="Mini testler" title="Ders sonu testleri">
          Her dersin 5 soruluk mini testi ilgili dersin "Mini Test" sekmesindedir.
        </SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((l) => {
            const r = progress.quizResults[l.id];
            const pass = r && r.score / r.total >= PASS_RATIO;
            return (
              <a key={l.id} href={`#/lesson/${l.id}/quiz`} className="group rounded-xl border border-line bg-white p-4 transition-all hover:border-accent hover:shadow-md">
                <div className="flex items-center justify-between">
                  <ClipboardCheck className="h-5 w-5 text-brand" />
                  {r ? <Badge tone={pass ? "ok" : "warn"}>{`${r.score}/${r.total}`}</Badge> : <Badge tone="muted">Çözülmedi</Badge>}
                </div>
                <div className="mt-2 text-xs font-semibold text-accent">DERS {String(l.id).padStart(2, "0")}</div>
                <div className="font-semibold group-hover:text-brand">{l.title}</div>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
