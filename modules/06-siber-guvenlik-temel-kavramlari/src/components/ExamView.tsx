"use client";

import Link from "next/link";
import { useState } from "react";
import { EXAM } from "@/data/questions";
import { actions, fmtDate, PASS_RATIO, useProgress } from "@/lib/progress";
import Quiz from "./Quiz";

export default function ExamView() {
  const { p, ready } = useProgress();
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const prev = ready ? p.exam : null;

  return (
    <div className="flex flex-col gap-6">
      <header className="rounded-3xl border border-line bg-gradient-to-br from-white to-soft p-6 sm:p-8">
        <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">GENEL DEĞERLENDİRME</span>
        <h1 className="mt-3 text-3xl font-extrabold text-ink">Modül 06 Genel Sınavı</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-ink/85">
          12 dersin tamamından 20 soru. Sorular ezberden çok kavramları gerçek senaryolara uygulayabilmeni ölçer.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full border border-line bg-white px-3 py-1">20 soru</span>
          <span className="rounded-full border border-line bg-white px-3 py-1">4 seçenek</span>
          <span className="rounded-full border border-line bg-white px-3 py-1">Başarı eşiği %{PASS_RATIO * 100}</span>
          <span className="rounded-full border border-line bg-white px-3 py-1">Her cevap açıklamalı</span>
        </div>
        {prev && (
          <p className="mt-4 text-sm font-semibold text-ink">
            Son sonuç: <span className={prev.score / prev.total >= PASS_RATIO ? "text-ok" : "text-bad"}>{prev.score}/{prev.total} (%{Math.round((prev.score / prev.total) * 100)})</span> · {fmtDate(prev.date)}
          </p>
        )}
      </header>

      {!started ? (
        <div className="card flex flex-col items-start gap-4">
          <p className="text-sm text-ink/85">Hazır olduğunda sınavı başlat. Dilediğin kadar tekrar çözebilirsin; en son sonucun kaydedilir.</p>
          <button className="btn-primary" onClick={() => setStarted(true)}>Sınavı Başlat</button>
        </div>
      ) : (
        <>
          <Quiz
            questions={EXAM}
            retryLabel="Sınavı yeniden çöz"
            onFinish={(s, t) => {
              actions.saveExam(s, t);
              setFinished(true);
            }}
          />
          {finished && (
            <div className="flex flex-wrap gap-3">
              <Link href="/" className="btn-ghost">Eğitim Paneline Dön</Link>
              <Link href="/tamamlandi" className="btn-primary">Modül Tamamlama Durumu →</Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
