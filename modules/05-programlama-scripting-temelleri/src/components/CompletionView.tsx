"use client";

import Link from "next/link";
import { CURRICULUM, MODULE_NO, MODULE_TITLE, pad } from "@/data/curriculum";
import { TOTAL_LESSONS, useProgress } from "@/lib/storage";
import { formatDate } from "@/lib/util";
import { Btn, Card, ProgressBar } from "./ui";

export default function CompletionView() {
  const { progress, percent, hydrated } = useProgress();
  const done = progress.completed.length;

  if (!hydrated) return <div className="h-40" />;

  if (done < TOTAL_LESSONS) {
    const missing = CURRICULUM.filter((c) => !progress.completed.includes(c.id));
    return (
      <div className="space-y-5">
        <Card>
          <h1 className="text-2xl font-bold">Modül tamamlama ekranı kilitli</h1>
          <p className="mt-2 text-[15px] leading-7 text-[#2b4152]">
            Bu ekran, 14 dersin tamamını tamamladığınızda açılır. Şu anda {done} / {TOTAL_LESSONS} ders tamamlandı.
          </p>
          <ProgressBar value={percent} className="mt-4 h-3" />
          <p className="mt-5 text-sm font-semibold">Kalan dersler</p>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {missing.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/ders/${m.id}`}
                  className="block rounded-lg border border-line px-3 py-2 text-sm hover:bg-soft"
                >
                  {pad(m.id)}. {m.title}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    );
  }

  const date = progress.completedAt ?? new Date().toISOString();

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="bg-gradient-to-br from-brand to-accent px-6 py-10 text-center text-white sm:px-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-3xl">★</div>
          <p className="mt-4 text-sm font-semibold tracking-[0.3em]">AG CYBER LAB</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            MODÜL {MODULE_NO} TAMAMLANDI
          </h1>
          <p className="mt-2 text-lg opacity-95">{MODULE_TITLE}</p>
          <p className="mt-1 text-xs tracking-[0.18em] opacity-80">LEARN • PRACTICE • SECURE</p>
        </div>
        <div className="grid gap-px bg-line sm:grid-cols-3">
          <div className="bg-white p-5 text-center">
            <p className="text-xs text-muted">Tamamlanan ders sayısı</p>
            <p className="mt-1 text-2xl font-bold text-brand">
              {done} / {TOTAL_LESSONS}
            </p>
          </div>
          <div className="bg-white p-5 text-center">
            <p className="text-xs text-muted">Genel sınav sonucu</p>
            <p className="mt-1 text-2xl font-bold text-brand">
              {progress.exam ? `%${progress.exam.percent}` : "Çözülmedi"}
            </p>
            {progress.exam && (
              <p className="text-xs text-muted">
                {progress.exam.score} / {progress.exam.total} doğru
              </p>
            )}
          </div>
          <div className="bg-white p-5 text-center">
            <p className="text-xs text-muted">Tamamlanma tarihi</p>
            <p className="mt-1 text-2xl font-bold text-brand">{formatDate(date)}</p>
          </div>
        </div>
        <div className="space-y-4 p-6">
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <p>
              Tamamlanan laboratuvar: <strong>{progress.labs.length} / {TOTAL_LESSONS}</strong>
            </p>
            <p>
              Mini testi çözülen ders: <strong>{Object.keys(progress.quiz).length} / {TOTAL_LESSONS}</strong>
            </p>
          </div>
          {!progress.exam && (
            <div className="rounded-lg border border-warn/40 bg-[#faf0dc] px-3 py-2 text-sm text-[#7a5410]">
              Genel sınavı henüz çözmediniz. Bilginizi ölçmek için sınavı çözmenizi öneririz.{" "}
              <Link href="/sinav" className="font-semibold underline">
                Sınava git
              </Link>
            </div>
          )}
          <p className="rounded-lg bg-soft px-3 py-2 text-xs leading-5 text-[#2d5566]">
            Bu ekran yalnızca AG CYBER LAB eğitim platformu içi bir tamamlanma göstergesidir; resmî veya akredite bir
            sertifika değildir.
          </p>
          <div className="no-print flex flex-wrap gap-2">
            <Btn onClick={() => window.print()}>Ekranı yazdır</Btn>
            <Link
              href="/"
              className="inline-flex items-center rounded-lg border border-line px-3.5 py-2 text-sm font-medium hover:bg-soft"
            >
              İlerleme paneli
            </Link>
            <Link
              href="/ders/1"
              className="inline-flex items-center rounded-lg border border-line px-3.5 py-2 text-sm font-medium hover:bg-soft"
            >
              Dersleri tekrar et
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
