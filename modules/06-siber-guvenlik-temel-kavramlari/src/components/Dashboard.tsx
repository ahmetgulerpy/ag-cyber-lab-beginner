"use client";

import Link from "next/link";
import { useState } from "react";
import { LESSONS } from "@/data/lessons";
import { actions, fmtDate, PASS_RATIO, useProgress } from "@/lib/progress";

export default function Dashboard() {
  const { p, ready } = useProgress();
  const [confirm, setConfirm] = useState(false);
  const done = ready ? Object.keys(p.completed).length : 0;
  const labs = ready ? Object.keys(p.labs).length : 0;
  const quizzes = ready ? Object.keys(p.quizzes).length : 0;
  const pct = Math.round((done / LESSONS.length) * 100);
  const last = ready && p.lastLesson ? LESSONS.find((l) => l.id === p.lastLesson) : undefined;
  const firstOpen = LESSONS.find((l) => !(ready && p.completed[l.id])) ?? LESSONS[0];
  const target = last ?? firstOpen;
  const allDone = done === LESSONS.length;

  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-3xl border border-line bg-gradient-to-br from-white to-soft p-6 sm:p-10">
        <p className="text-xs font-bold tracking-[0.2em] text-accent">SIFIRDAN SİBER GÜVENLİK EĞİTİM PROGRAMI</p>
        <h1 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
          MODÜL 06 <span className="text-brand">·</span> Siber Güvenlik Temel Kavramları
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] text-ink/85">
          12 ders, 12 etkileşimli laboratuvar, 60 mini test sorusu ve 20 soruluk genel sınav. Okumakla kalma: diyagramları incele, senaryoları dene, kararlarını ver.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/ders/${target.id}`} className="btn-primary">
            {done === 0 && !last ? "Eğitime Başla" : allDone ? "Dersleri Gözden Geçir" : "Kaldığın Yerden Devam Et"} →
          </Link>
          <Link href="/sinav" className="btn-ghost">Genel Sınav</Link>
          {allDone && <Link href="/tamamlandi" className="btn-ghost">Modül Tamamlama Ekranı</Link>}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-ink">İlerleme Panelin</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Toplam ders", String(LESSONS.length)],
            ["Tamamlanan ders", `${done}`],
            ["Tamamlanma", `%${pct}`],
            ["Tamamlanan laboratuvar", `${labs}/12`],
          ].map(([k, v]) => (
            <div key={k} className="card">
              <p className="label-mini">{k}</p>
              <p className="mt-1 text-3xl font-extrabold text-brand">{v}</p>
            </div>
          ))}
        </div>
        <div className="card mt-4">
          <div className="mb-2 flex justify-between text-sm font-semibold text-ink">
            <span>Eğitim ilerleme çubuğu</span>
            <span>%{pct}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-soft">
            <div className="h-full rounded-full bg-gradient-to-r from-brand to-accent transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <p>
              <span className="label-mini block">Son ziyaret edilen ders</span>
              {last ? (
                <Link className="font-semibold text-brand hover:underline" href={`/ders/${last.id}`}>
                  Ders {last.no}: {last.title}
                </Link>
              ) : (
                <span className="text-muted">Henüz ders ziyaret edilmedi</span>
              )}
            </p>
            <p>
              <span className="label-mini block">Mini testler</span>
              <b>{quizzes}</b>/12 çözüldü
            </p>
            <p>
              <span className="label-mini block">Genel sınav sonucu</span>
              {ready && p.exam ? (
                <b className={p.exam.score / p.exam.total >= PASS_RATIO ? "text-ok" : "text-bad"}>
                  {p.exam.score}/{p.exam.total} (%{Math.round((p.exam.score / p.exam.total) * 100)}) · {fmtDate(p.exam.date)}
                </b>
              ) : (
                <span className="text-muted">Henüz girilmedi</span>
              )}
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-xl font-bold text-ink">F. Siber Güvenlik Temel Kavramları</h2>
        <p className="mb-4 text-sm text-muted">Dersleri sırayla izlemeni öneririz; ama istediğin derse doğrudan geçebilirsin.</p>
        <div className="grid gap-4 md:grid-cols-2">
          {LESSONS.map((l) => {
            const q = ready ? p.quizzes[l.id] : undefined;
            const lab = ready && p.labs[l.id];
            const dn = ready && p.completed[l.id];
            return (
              <Link key={l.id} href={`/ders/${l.id}`} className={`card flex gap-4 transition hover:border-accent hover:shadow-md ${dn ? "!border-ok/40" : ""}`}>
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${dn ? "bg-ok text-white" : "bg-soft text-brand"}`}>
                  {dn ? "✓" : String(l.no).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-ink">{l.title}</h3>
                  <p className="text-xs text-muted">{l.en} · ~{l.minutes} dk</p>
                  <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-semibold">
                    <span className={`rounded-full px-2 py-0.5 ${lab ? "bg-[#E9F5EF] text-ok" : "bg-page text-muted"}`}>Lab {lab ? "✓" : "–"}</span>
                    <span className={`rounded-full px-2 py-0.5 ${q ? (q.score / q.total >= PASS_RATIO ? "bg-[#E9F5EF] text-ok" : "bg-[#FBF4E4] text-warn") : "bg-page text-muted"}`}>
                      Test {q ? `${q.score}/${q.total}` : "–"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-ink">Bu modülde nasıl öğreneceksin?</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Gör", "Her derste kavramı gösteren etkileşimli bir diyagram var."],
            ["İncele", "Kısa konu kartları ve karşılaştırmalarla parça parça ilerle."],
            ["Dene", "Sanal laboratuvarda karar ver, sonucu hemen gör."],
            ["Ölç", "5 soruluk mini test ve 20 soruluk genel sınav."],
          ].map(([t, d], i) => (
            <div key={t} className="card">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">{i + 1}</span>
              <p className="mt-3 font-bold text-ink">{t}</p>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4 text-sm text-muted">
        <span>İlerlemen yalnızca bu tarayıcıda (LocalStorage) saklanır; sunucuya veri gönderilmez.</span>
        {confirm ? (
          <span className="flex items-center gap-2">
            Emin misin?
            <button className="btn-ghost !border-bad !py-1.5 !text-bad" onClick={() => { actions.reset(); setConfirm(false); }}>Evet, sıfırla</button>
            <button className="btn-ghost !py-1.5" onClick={() => setConfirm(false)}>Vazgeç</button>
          </span>
        ) : (
          <button className="btn-ghost !py-1.5" onClick={() => setConfirm(true)}>İlerlemeyi sıfırla</button>
        )}
      </section>
    </div>
  );
}
