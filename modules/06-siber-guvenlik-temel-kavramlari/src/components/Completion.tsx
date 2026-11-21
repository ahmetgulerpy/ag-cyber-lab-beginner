"use client";

import Link from "next/link";
import { LESSONS } from "@/data/lessons";
import { fmtDate, PASS_RATIO, useProgress } from "@/lib/progress";

export default function Completion() {
  const { p, ready } = useProgress();
  if (!ready) return <div className="card text-sm text-muted">Yükleniyor…</div>;
  const done = Object.keys(p.completed).length;
  const all = done === LESSONS.length;

  if (!all) {
    return (
      <div className="flex flex-col gap-5">
        <div className="card">
          <p className="label-mini">Modül 06 tamamlama durumu</p>
          <h1 className="mt-1 text-2xl font-extrabold text-ink">Modül henüz tamamlanmadı</h1>
          <p className="mt-2 text-sm text-ink/85">
            Tamamlama ekranı, 12 dersin tamamı bitirildiğinde açılır. Bir ders; laboratuvarı tamamladığında ve mini testi en az %{PASS_RATIO * 100} ile geçtiğinde tamamlanır. ({done}/{LESSONS.length})
          </p>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-soft">
            <div className="h-full rounded-full bg-accent" style={{ width: `${(done / LESSONS.length) * 100}%` }} />
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {LESSONS.map((l) => (
            <Link key={l.id} href={`/ders/${l.id}`} className="card flex items-center gap-3 !p-3 text-sm hover:border-accent">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${p.completed[l.id] ? "bg-ok text-white" : "bg-soft text-brand"}`}>{p.completed[l.id] ? "✓" : l.no}</span>
              <span className="flex-1 font-semibold">{l.title}</span>
              <span className="text-xs text-muted">{p.labs[l.id] ? "Lab ✓" : "Lab –"} · {p.quizzes[l.id] ? `Test ${p.quizzes[l.id].score}/5` : "Test –"}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-[0_10px_40px_rgba(23,107,135,0.12)]">
        <div className="bg-gradient-to-r from-brand to-accent px-6 py-10 text-center text-white sm:px-10">
          <p className="text-sm font-extrabold tracking-[0.3em]">AG CYBER LAB</p>
          <p className="mt-1 text-[10px] font-semibold tracking-[0.25em] opacity-80">LEARN • PRACTICE • SECURE</p>
          <p className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl">✓</p>
          <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">MODÜL 06 TAMAMLANDI</h1>
          <p className="mt-2 text-lg font-semibold">Siber Güvenlik Temel Kavramları</p>
        </div>
        <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
          <div className="rounded-2xl bg-page p-5 text-center">
            <p className="label-mini">Tamamlanan ders</p>
            <p className="mt-1 text-3xl font-extrabold text-brand">{done}/{LESSONS.length}</p>
          </div>
          <div className="rounded-2xl bg-page p-5 text-center">
            <p className="label-mini">Genel sınav sonucu</p>
            {p.exam ? (
              <p className={`mt-1 text-3xl font-extrabold ${p.exam.score / p.exam.total >= PASS_RATIO ? "text-ok" : "text-bad"}`}>
                {p.exam.score}/{p.exam.total} <span className="text-lg">(%{Math.round((p.exam.score / p.exam.total) * 100)})</span>
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted">Henüz girilmedi</p>
            )}
          </div>
          <div className="rounded-2xl bg-page p-5 text-center">
            <p className="label-mini">Tamamlanma tarihi</p>
            <p className="mt-2 text-lg font-extrabold text-brand">{fmtDate(p.completedAt)}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 border-t border-line px-6 py-5">
          {!p.exam && <Link href="/sinav" className="btn-primary">Genel Sınava Gir</Link>}
          <Link href="/" className="btn-ghost">Eğitim Paneli</Link>
          <button className="btn-ghost" onClick={() => window.print()}>Yazdır</button>
        </div>
        <p className="border-t border-line bg-page px-6 py-3 text-center text-xs text-muted">
          Bu ekran yalnızca eğitim platformu içi bir tamamlanma göstergesidir; resmî veya akredite bir sertifika değildir.
        </p>
      </div>
    </div>
  );
}
