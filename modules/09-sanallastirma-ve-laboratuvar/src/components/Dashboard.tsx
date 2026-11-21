"use client";

import Link from "next/link";
import { LESSONS } from "@/content/lessons";
import { GUIDE_LIST, TOTAL_GUIDE_STEPS } from "@/content/guides";
import { FINAL_COUNT } from "@/content/final";
import { resetAll, useProgress } from "@/lib/progress";
import { Notice, ProgressBar } from "./ui";

export function Dashboard() {
  const p = useProgress();
  const doneLessons = LESSONS.filter((l) => p.lessons[l.slug]?.done).length;
  const overall = Math.round((doneLessons / LESSONS.length) * 100);
  const labs = LESSONS.filter((l) => p.lessons[l.slug]?.lab).length;
  const quizzes = LESSONS.filter((l) => {
    const q = p.lessons[l.slug]?.quiz;
    return q && q.score / q.total >= 0.6;
  });
  const quizAvg = (() => {
    const all = LESSONS.map((l) => p.lessons[l.slug]?.quiz).filter(Boolean) as { score: number; total: number }[];
    if (!all.length) return 0;
    return Math.round((all.reduce((a, q) => a + q.score / q.total, 0) / all.length) * 100);
  })();
  const guideDone = GUIDE_LIST.reduce((n, g) => n + (p.guides[g.id]?.done.filter((i) => i < g.steps.length).length ?? 0), 0);
  const last = p.last ? LESSONS.find((l) => l.slug === p.last?.slug) : undefined;
  const firstOpen = LESSONS.find((l) => !p.lessons[l.slug]?.done) ?? LESSONS[0];
  const cont = last && !p.lessons[last.slug]?.done ? last : firstOpen;
  const started = !!p.last;

  const stats = [
    { l: "Tamamlanan ders", v: `${doneLessons}/${LESSONS.length}`, s: "ders" },
    { l: "Genel ilerleme", v: `%${overall}`, s: "modül" },
    { l: "Kurulum adımları", v: `${guideDone}/${TOTAL_GUIDE_STEPS}`, s: "rehber adımı" },
    { l: "Laboratuvarlar", v: `${labs}/${LESSONS.length}`, s: "tamamlandı" },
    { l: "Mini test başarısı", v: `${quizzes.length}/${LESSONS.length}`, s: quizAvg ? `ortalama %${quizAvg}` : "henüz çözülmedi" },
    { l: "Final sınavı", v: p.final ? `%${p.final.pct}` : "—", s: p.final ? `${p.final.score}/${p.final.total} doğru` : `${FINAL_COUNT} soru` },
  ];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#176B87] via-[#1b7a8f] to-[#38A3A5] p-6 text-white shadow-sm sm:p-10">
        <p className="text-xs font-bold tracking-[0.3em] text-ag-light">MODÜL 09 · BAŞLANGIÇ SEVİYESİNİN SON MODÜLÜ</p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">Sanallaştırma ve Laboratuvar</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#e3f3f6] sm:text-base">
          Sanallaştırmayı anla, VirtualBox veya VMware ile kendi sanal makineni oluştur, Kali Linux ve Ubuntu'yu kur, NAT ve Bridged ağları kavra ve güvenli bir siber güvenlik laboratuvarı hazırla. 11 ders, adım adım kurulum rehberleri, etkileşimli uygulamalar ve final sınavı.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/lesson/${cont.slug}`} className="btn !border-white !bg-white !text-ag-brand hover:!bg-ag-light">
            {started ? `▶ Kaldığın yerden devam et: Ders ${cont.no}` : "▶ Eğitime başla: Ders 01"}
          </Link>
          <Link href="/donanim" className="btn !border-white/60 !bg-transparent !text-white hover:!bg-white/10">
            Donanım gereksinimlerini kontrol et
          </Link>
        </div>
        {started && last && <p className="mt-3 text-xs text-[#d4eaf0]">Son çalışılan ders: {last.no}. {last.title}</p>}
      </section>

      <section aria-label="İlerleme özeti" className="space-y-3">
        <div className="card !p-4">
          <div className="mb-2 flex items-center justify-between text-sm font-semibold">
            <span>Genel ilerleme</span>
            <span className="text-ag-brand">%{overall}</span>
          </div>
          <ProgressBar pct={overall} tone={overall === 100 ? "ok" : "brand"} />
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
          {stats.map((s) => (
            <div key={s.l} className="card !p-4">
              <p className="text-xs font-semibold text-ag-muted">{s.l}</p>
              <p className="mt-1 text-2xl font-extrabold text-ag-brand">{s.v}</p>
              <p className="text-[11px] text-ag-muted">{s.s}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Dersler</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {LESSONS.map((l) => {
            const lp = p.lessons[l.slug] ?? {};
            const gs = l.guides.map((id) => GUIDE_LIST.find((g) => g.id === id)).filter(Boolean) as typeof GUIDE_LIST;
            const gTotal = gs.reduce((n, g) => n + g.steps.length, 0);
            const gDone = gs.reduce((n, g) => n + (p.guides[g.id]?.done.length ?? 0), 0);
            const qOk = lp.quiz ? lp.quiz.score / lp.quiz.total >= 0.6 : false;
            return (
              <Link key={l.slug} href={`/lesson/${l.slug}`} className={`card group flex gap-4 !p-4 transition hover:border-ag-accent hover:shadow-md ${p.last?.slug === l.slug ? "ring-2 ring-ag-accent/40" : ""}`}>
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-black ${lp.done ? "bg-ag-ok text-white" : "bg-ag-light text-ag-brand"}`}>{lp.done ? "✓" : l.no}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-ag-text group-hover:text-ag-brand">{l.no}. {l.title}</span>
                  <span className="block text-xs text-ag-muted">{l.sub} · ~{l.min} dk</span>
                  <span className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-semibold">
                    <span className={`chip ${lp.lab ? "!border-ag-ok/40 !bg-[#edf8f2] !text-ag-ok" : ""}`}>{lp.lab ? "✓" : "○"} Lab</span>
                    <span className={`chip ${qOk ? "!border-ag-ok/40 !bg-[#edf8f2] !text-ag-ok" : ""}`}>{lp.quiz ? `${qOk ? "✓" : "○"} Test ${lp.quiz.score}/${lp.quiz.total}` : "○ Test"}</span>
                    {gTotal > 0 && <span className={`chip ${gDone === gTotal ? "!border-ag-ok/40 !bg-[#edf8f2] !text-ag-ok" : ""}`}>🧭 Rehber {gDone}/{gTotal}</span>}
                    {p.last?.slug === l.slug && <span className="chip !border-ag-warn/40 !bg-[#fff8e8] !text-[#8a5f12]">Son çalışılan</span>}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card space-y-2">
          <h2 className="text-lg font-bold">📝 Modül sonu final sınavı</h2>
          <p className="text-sm text-ag-muted">{FINAL_COUNT} soru · kolay, orta ve zor seviyeler · 11 dersin tamamı. Sonunda puanını, eksik alanlarını ve tekrar etmen gereken dersleri görürsün.</p>
          {p.final && <p className="text-sm font-semibold text-ag-brand">Son sonucun: %{p.final.pct} ({p.final.score}/{p.final.total})</p>}
          <Link href="/final" className="btn btn-primary">{p.final ? "Sınavı tekrar çöz" : "Final sınavına git"}</Link>
        </div>
        <div className="card space-y-2">
          <h2 className="text-lg font-bold">🧮 Donanım ve sistem gereksinimleri</h2>
          <p className="text-sm text-ag-muted">VT-x / AMD-V, BIOS ayarı, RAM, disk, ARM ve x86 farkı ve bilgisayarına göre sanal makine planlayan kaynak aracı.</p>
          <Link href="/donanim" className="btn">Donanım rehberine git</Link>
        </div>
      </section>

      <Notice />

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ag-muted">
        <p>İlerlemen yalnızca bu tarayıcıda (localStorage) saklanır; sunucuya hiçbir veri gönderilmez.</p>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => {
            if (window.confirm("Tüm ilerlemen bu tarayıcıdan silinecek. Emin misin?")) resetAll();
          }}
        >
          İlerlemeyi sıfırla
        </button>
      </div>
    </div>
  );
}
