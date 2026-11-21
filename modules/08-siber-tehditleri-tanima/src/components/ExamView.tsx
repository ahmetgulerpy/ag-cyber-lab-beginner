"use client";

import Link from "next/link";
import { examQuestions, EXAM_POINTS } from "@/data/exam";
import { getLessonByNo } from "@/data/lessons";
import { PASS_EXAM, saveExam, useProgress } from "@/lib/progress";
import { Badge, Card, InfoBox, ProgressBar } from "./ui";
import { QuizRunner, type QuizItem } from "./QuizRunner";

const pts = (q: QuizItem) => EXAM_POINTS[q.level ?? "Orta"];
const MAX = examQuestions.reduce((a, q) => a + pts(q), 0);

export function ExamView() {
  const p = useProgress();
  const ex = p.exam;
  const done = Object.values(p.lessons).filter((l) => l.completed).length;

  return (
    <div className="space-y-5">
      <Card className="bg-gradient-to-br from-soft to-white">
        <Badge tone="brand">📋 Modül sonu</Badge>
        <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">Genel Değerlendirme Sınavı</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">13 dersin tamamını kapsayan {examQuestions.length} soru: çoktan seçmeli ve senaryo tabanlı; kolay, orta ve zor seviyede. Toplam {MAX} puan. Başarı için %{PASS_EXAM} hedeflenir.</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <Badge tone="ok">Kolay: {EXAM_POINTS.Kolay} puan</Badge>
          <Badge tone="warn">Orta: {EXAM_POINTS.Orta} puan</Badge>
          <Badge tone="bad">Zor: {EXAM_POINTS.Zor} puan</Badge>
          <Badge tone="muted">Tamamlanan ders: {done}/13</Badge>
        </div>
        {ex && (
          <p className="mt-3 text-sm">Önceki en iyi sonucun: <b>{ex.best}/{ex.total} puan (%{Math.round((ex.best / ex.total) * 100)})</b> • {ex.attempts} deneme</p>
        )}
        {done < 13 && <div className="mt-3"><InfoBox tone="warn" icon="💡">Tüm dersleri bitirmeden de sınava girebilirsin; ama önce dersleri tamamlaman sonucunu iyileştirir.</InfoBox></div>}
      </Card>

      <QuizRunner
        shuffleQuestions
        title="Genel Sınava Hazır mısın?"
        intro="Her sorudan sonra açıklamalı geri bildirim göreceksin. Sınav sonunda toplam puanın, başarı oranın ve tekrar etmen gereken konular gösterilecek."
        questions={examQuestions}
        onFinish={(_score, wrong) => {
          const lost = wrong.reduce((a, q) => a + pts(q), 0);
          saveExam(MAX - lost, MAX, [...new Set(wrong.map((q) => q.topic ?? 0))].sort((a, b) => a - b));
        }}
        resultExtra={(_score, wrong) => {
          const lost = wrong.reduce((a, q) => a + pts(q), 0);
          const points = MAX - lost;
          const pct = Math.round((points / MAX) * 100);
          const topics = [...new Set(wrong.map((q) => q.topic ?? 0))].sort((a, b) => a - b);
          const levels = (["Kolay", "Orta", "Zor"] as const).map((lv) => {
            const all = examQuestions.filter((q) => q.level === lv);
            const w = wrong.filter((q) => q.level === lv).length;
            return { lv, ok: all.length - w, total: all.length };
          });
          return (
            <div className="space-y-4">
              <Card>
                <h3 className="text-lg font-bold">📊 Sınav sonucu</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-line bg-page p-3"><p className="text-xs text-muted">Toplam puan</p><p className="text-2xl font-extrabold text-brand">{points} / {MAX}</p></div>
                  <div className="rounded-xl border border-line bg-page p-3"><p className="text-xs text-muted">Başarı oranı</p><p className={`text-2xl font-extrabold ${pct >= PASS_EXAM ? "text-ok" : "text-bad"}`}>%{pct}</p></div>
                  <div className="rounded-xl border border-line bg-page p-3"><p className="text-xs text-muted">Durum</p><p className={`text-xl font-extrabold ${pct >= PASS_EXAM ? "text-ok" : "text-bad"}`}>{pct >= PASS_EXAM ? "✓ Başarılı" : "Tekrar gerekli"}</p></div>
                </div>
                <ProgressBar className="mt-3" value={pct} tone={pct >= PASS_EXAM ? "ok" : "warn"} />
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {levels.map((l) => (
                    <div key={l.lv} className="rounded-lg border border-line px-3 py-2 text-sm"><b>{l.lv}</b>: {l.ok}/{l.total} doğru</div>
                  ))}
                </div>
              </Card>
              <Card>
                <h3 className="text-lg font-bold">🔁 Tekrar etmen gereken konular</h3>
                {topics.length === 0 ? (
                  <p className="mt-2 text-sm text-ok">Harika! Tüm konularda doğru cevap verdin. 🎉</p>
                ) : (
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {topics.map((t) => {
                      const l = getLessonByNo(t);
                      if (!l) return null;
                      return (
                        <li key={t}>
                          <Link href={`/dersler/${l.slug}`} className="flex items-center gap-3 rounded-xl border border-bad/30 bg-bad/5 p-3 text-sm hover:bg-bad/10">
                            <span className="text-2xl" aria-hidden>{l.icon}</span>
                            <span><b>Ders {l.no}: {l.title}</b><span className="block text-xs text-muted">{wrong.filter((q) => q.topic === t).length} soru yanlış • derse git →</span></span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Card>
            </div>
          );
        }}
      />
      <p className="text-center text-sm"><Link href="/" className="font-semibold text-brand hover:underline">← Ana sayfaya dön</Link></p>
    </div>
  );
}
