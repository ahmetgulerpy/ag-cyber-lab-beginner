"use client";
import Link from "next/link";
import { useState } from "react";
import { ALL_LESSONS } from "@/data/lessons";
import { LAB_TASKS, LAB_TITLES } from "@/data/labtasks";
import { lessonsDone, overallPercent, useProgress } from "@/lib/store";
import { ProgressBar } from "@/components/ui";

export default function Dashboard() {
  const { progress, resetAll } = useProgress();
  const [confirm, setConfirm] = useState(false);
  const done = lessonsDone(progress);
  const pct = overallPercent(progress);
  const labDone = (id: number) => LAB_TASKS[id].filter((t) => (progress.labs[id] ?? []).includes(t.id)).length;
  const labsComplete = ALL_LESSONS.filter((l) => labDone(l.id) === LAB_TASKS[l.id].length).length;
  const quizzes = Object.keys(progress.quizzes).length;
  const next = ALL_LESSONS.find((l) => !progress.lessons[l.id]?.done);
  const started = done > 0 || Object.keys(progress.labs).length > 0 || quizzes > 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <section className="card overflow-hidden">
        <div className="grid gap-6 bg-gradient-to-br from-soft to-white p-6 md:grid-cols-[1.5fr_1fr] md:p-8">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip">Modül 04</span>
              <span className="chip" style={{ background: "#E3F2EA", color: "#25845B" }}>● Başlangıç seviyesi</span>
              <span className="chip" style={{ background: "#fff", color: "#64748B", border: "1px solid #DFE8ED" }}>14 ders • 14 laboratuvar</span>
            </div>
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-accent">Sıfırdan Siber Güvenlik Eğitim Programı</p>
            <h1 className="mt-1 text-3xl font-extrabold leading-tight text-ink md:text-4xl">Modül 04 – İşletim Sistemleri Temelleri</h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
              Windows ve Linux sistemlerinin nasıl çalıştığını sanal masaüstleri, dosya gezginleri, terminal simülatörleri ve izin laboratuvarlarıyla uygulayarak öğren. Tüm laboratuvarlar tarayıcında güvenle çalışan eğitim simülasyonlarıdır.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link className="btn btn-primary" href={`/ders/${next?.id ?? 1}`}>{started ? (next ? `▶ Devam et: Ders ${String(next.id).padStart(2, "0")}` : "Dersleri tekrar et") : "▶ Eğitime başla"}</Link>
              <Link className="btn" href="/final">🎓 Final sınavı</Link>
              <a className="btn" href="#dersler">☰ Ders listesi</a>
            </div>
          </div>
          <div className="card flex flex-col justify-center gap-3 p-5">
            <div className="flex items-end justify-between">
              <div><p className="text-xs font-semibold uppercase tracking-wider text-muted">Genel ilerleme</p><p className="text-4xl font-extrabold text-brand">%{pct}</p></div>
              <div className="text-right text-sm text-muted"><b className="text-ink">{done}</b> / 14 ders tamamlandı</div>
            </div>
            <ProgressBar value={pct} tone={pct === 100 ? "ok" : "brand"} h={10} />
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-soft p-2"><b className="block text-lg text-ink">{done}</b>Tamamlanan ders</div>
              <div className="rounded-lg bg-soft p-2"><b className="block text-lg text-ink">14</b>Toplam ders</div>
              <div className="rounded-lg bg-soft p-2"><b className="block text-lg text-ink">{labsComplete}</b>Biten lab</div>
            </div>
          </div>
        </div>
      </section>

      <section id="dersler" className="mt-10 scroll-mt-24">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div><h2 className="text-2xl font-extrabold">Ders listesi</h2><p className="text-sm text-muted">Dersleri sırayla izlemen önerilir; istediğin derse doğrudan girebilir, önceki derslere dönebilirsin.</p></div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {ALL_LESSONS.map((l) => {
            const ok = progress.lessons[l.id]?.done;
            const q = progress.quizzes[l.id];
            const ld = labDone(l.id), lt = LAB_TASKS[l.id].length;
            return (
              <Link key={l.id} href={`/ders/${l.id}`} className="card group flex gap-4 p-4 transition hover:border-brand hover:shadow-md">
                <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-lg font-extrabold ${ok ? "bg-ok text-white" : "bg-soft text-brand"}`}>{ok ? "✓" : String(l.id).padStart(2, "0")}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold leading-snug text-ink group-hover:text-brand">Ders {String(l.id).padStart(2, "0")} — {l.title}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${ok ? "bg-[#E3F2EA] text-ok" : ld > 0 || q ? "bg-[#FBF0DA] text-[#9A6A12]" : "bg-[#EEF2F5] text-muted"}`}>{ok ? "Tamamlandı" : ld > 0 || q ? "Devam ediyor" : "Başlanmadı"}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{l.short}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                    <span>⏱ ~{l.minutes} dk</span><span>🧪 Lab {ld}/{lt}</span><span>📝 Test: {q ? `${q.score}/${q.total}` : "—"}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="laboratuvarlar" className="mt-10 scroll-mt-24">
        <h2 className="text-2xl font-extrabold">Laboratuvar uygulamaları</h2>
        <p className="mb-4 text-sm text-muted">Her dersin içinde en az bir etkileşimli sanal laboratuvar bulunur. Görevleri tamamladıkça ilerleme kaydedilir.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_LESSONS.map((l) => {
            const ld = labDone(l.id), lt = LAB_TASKS[l.id].length;
            return (
              <Link key={l.id} href={`/ders/${l.id}#lab`} className="card p-4 transition hover:border-accent hover:shadow-md">
                <p className="text-xs font-bold text-accent">LAB {String(l.id).padStart(2, "0")}</p>
                <p className="mt-0.5 text-sm font-bold leading-snug">{LAB_TITLES[l.id]}</p>
                <div className="mt-3"><ProgressBar value={(ld / lt) * 100} tone={ld === lt ? "ok" : "accent"} h={6} /></div>
                <p className="mt-1.5 text-xs text-muted">{ld}/{lt} görev</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="testler" className="mt-10 scroll-mt-24 grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-xl font-extrabold">Mini testler</h2>
          <p className="mb-3 text-sm text-muted">Her dersin sonunda 5 soruluk test bulunur. En az 3 doğru yapınca ders otomatik tamamlanır.</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            {ALL_LESSONS.map((l) => {
              const q = progress.quizzes[l.id];
              return (
                <li key={l.id}>
                  <Link className="flex items-center justify-between rounded-lg px-2 py-1 hover:bg-soft" href={`/ders/${l.id}#test`}>
                    <span>Ders {String(l.id).padStart(2, "0")}</span>
                    <span className={q ? (q.score >= 3 ? "font-bold text-ok" : "font-bold text-warn") : "text-muted"}>{q ? `${q.score}/${q.total}` : "—"}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="card flex flex-col justify-between p-5">
          <div>
            <h2 className="text-xl font-extrabold">Final sınavı</h2>
            <p className="mt-1 text-sm text-muted">14 dersin tamamını kapsayan 20 soruluk sınav. Kolay, orta ve uygulama mantığı gerektiren sorular içerir.</p>
            {progress.final ? (
              <div className="mt-3 rounded-xl bg-[#E8F4EE] p-3 text-sm"><b className="text-ok">Son sonuç: {progress.final.score}/{progress.final.total} (%{progress.final.pct})</b>{done === 14 && progress.final.pct >= 60 && <p className="mt-1 text-ok">🎓 Modül 04 tamamlandı!</p>}</div>
            ) : (
              <p className="mt-3 rounded-xl bg-soft p-3 text-sm text-muted">{done === 14 ? "Tüm dersleri tamamladın — final sınavına hazırsın." : `Önerilen: önce 14 dersi tamamla (${done}/14).`}</p>
            )}
          </div>
          <Link href="/final" className="btn btn-primary mt-4 self-start">Final sınavına git →</Link>
        </div>
      </section>

      <section className="card mt-10 flex flex-wrap items-center justify-between gap-3 p-5">
        <div><h2 className="text-lg font-extrabold">Eğitim ilerlemesini sıfırla</h2><p className="text-sm text-muted">Tamamlanan dersler, test sonuçları, laboratuvar görevleri ve final sonucu bu tarayıcıdan silinir.</p></div>
        {!confirm ? (
          <button className="btn btn-danger" onClick={() => setConfirm(true)}>↺ İlerlemeyi sıfırla</button>
        ) : (
          <div className="flex items-center gap-2"><span className="text-sm font-semibold text-bad">Emin misin?</span>
            <button className="btn btn-danger" onClick={() => { resetAll(); setConfirm(false); }}>Evet, sıfırla</button>
            <button className="btn" onClick={() => setConfirm(false)}>Vazgeç</button></div>
        )}
      </section>
    </main>
  );
}
