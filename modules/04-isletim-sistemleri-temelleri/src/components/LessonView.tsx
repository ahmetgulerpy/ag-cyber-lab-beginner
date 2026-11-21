"use client";
import Link from "next/link";
import { ALL_LESSONS } from "@/data/lessons";
import { useProgress } from "@/lib/store";
import { Callout, CodeBlock } from "@/components/ui";
import QuizRunner from "@/components/Quiz";
import LabFor from "@/components/labs";

const NAV = [
  ["amac", "Amaç"], ["anlatim", "Konu anlatımı"], ["kavramlar", "Kavramlar"], ["ornekler", "Örnekler"], ["komutlar", "Komut örnekleri"], ["lab", "Laboratuvar"], ["yonerge", "Yönergeler"], ["test", "Mini test"], ["ozet", "Özet"],
];

function H({ id, children }: { id: string; children: React.ReactNode }) {
  return <h2 id={id} className="mb-3 scroll-mt-24 text-xl font-extrabold text-ink">{children}</h2>;
}

export default function LessonView({ id }: { id: number }) {
  const lesson = ALL_LESSONS.find((l) => l.id === id)!;
  const { progress, setLesson, saveQuiz } = useProgress();
  const done = !!progress.lessons[id]?.done;
  const prev = ALL_LESSONS.find((l) => l.id === id - 1);
  const next = ALL_LESSONS.find((l) => l.id === id + 1);
  const saved = progress.quizzes[id];
  const n2 = String(id).padStart(2, "0");

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_1fr]">
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <details className="card p-3 lg:open:block" open>
          <summary className="cursor-pointer text-sm font-bold text-ink lg:cursor-default">Modül 04 dersleri</summary>
          <nav className="mt-2 max-h-[60vh] space-y-0.5 overflow-y-auto">
            {ALL_LESSONS.map((l) => {
              const ok = progress.lessons[l.id]?.done;
              return (
                <Link key={l.id} href={`/ders/${l.id}`} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${l.id === id ? "bg-soft font-bold text-brand" : "text-ink hover:bg-bg"}`}>
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${ok ? "bg-ok text-white" : "border border-line text-muted"}`}>{ok ? "✓" : l.id}</span>
                  <span className="truncate">{l.title}</span>
                </Link>
              );
            })}
          </nav>
          <Link href="/" className="btn btn-sm mt-3 w-full">← Panele dön</Link>
        </details>
      </aside>

      <div className="min-w-0 space-y-6">
        <header className="card bg-gradient-to-br from-soft to-white p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip">Modül 04</span><span className="chip">Ders {n2} / 14</span>
            <span className="chip" style={{ background: "#E3F2EA", color: "#25845B" }}>Başlangıç</span>
            <span className="chip" style={{ background: "#fff", color: "#64748B", border: "1px solid #DFE8ED" }}>⏱ Tahmini süre: {lesson.minutes} dk</span>
            {done && <span className="chip" style={{ background: "#25845B", color: "#fff" }}>✓ Tamamlandı</span>}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-ink">{lesson.title}</h1>
          <p className="mt-2 text-muted">{lesson.short}</p>
          <div className="scroll-x mt-4 flex gap-1.5">
            {NAV.map(([a, t]) => <a key={a} href={`#${a}`} className="whitespace-nowrap rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-brand hover:bg-soft">{t}</a>)}
          </div>
        </header>

        <section id="amac" className="card scroll-mt-24 p-6">
          <H id="amac-b">🎯 Dersin amacı</H>
          <p className="lesson-p">{lesson.goal}</p>
          <h3 className="mb-2 mt-5 font-bold">Öğrenme kazanımları</h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {lesson.outcomes.map((o, i) => <li key={i} className="flex gap-2 rounded-lg bg-soft px-3 py-2 text-sm"><span className="text-accent">✔</span>{o}</li>)}
          </ul>
        </section>

        <section id="anlatim" className="scroll-mt-24 space-y-4">
          <H id="anlatim-b">📖 Konu anlatımı</H>
          {lesson.sections.map((s, i) => (
            <article key={i} className="card p-6">
              <h3 className="mb-3 text-lg font-bold text-brand">{i + 1}. {s.h}</h3>
              <div className="space-y-3">{s.p.map((p, k) => <p key={k} className="lesson-p">{p}</p>)}</div>
              {s.list && <ul className="mt-3 space-y-1.5 pl-1">{s.list.map((li, k) => <li key={k} className="lesson-p flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /><span>{li}</span></li>)}</ul>}
              {s.note && <div className="mt-4"><Callout type={s.note.type} title={{ info: "Bilgi notu", tip: "İpucu", warn: "Dikkat", danger: "Güvenlik uyarısı" }[s.note.type]}>{s.note.text}</Callout></div>}
            </article>
          ))}
        </section>

        <section id="kavramlar" className="card scroll-mt-24 p-6">
          <H id="kavramlar-b">🧩 Temel teknik kavramlar</H>
          <div className="grid gap-3 sm:grid-cols-2">
            {lesson.concepts.map(([t, d], i) => <div key={i} className="card-soft p-3"><p className="text-sm font-bold text-brand">{t}</p><p className="mt-1 text-sm text-ink">{d}</p></div>)}
          </div>
        </section>

        <section id="ornekler" className="grid scroll-mt-24 gap-4 md:grid-cols-2">
          <div className="card p-6"><H id="gunluk">🏠 Günlük hayattan örnekler</H><ul className="space-y-2">{lesson.everyday.map((e, i) => <li key={i} className="lesson-p flex gap-2 text-sm"><span className="text-accent">●</span>{e}</li>)}</ul></div>
          <div className="card p-6"><H id="teknik">⚙️ Teknik örnekler</H><ul className="space-y-2">{lesson.technical.map((e, i) => <li key={i} className="lesson-p flex gap-2 text-sm"><span className="text-brand">●</span>{e}</li>)}</ul></div>
        </section>

        <section id="komutlar" className="card scroll-mt-24 p-6">
          <H id="komutlar-b">⌨️ Komut ve işlem örnekleri</H>
          <div className="space-y-4">
            {lesson.examples.map((e, i) => <div key={i}><CodeBlock title={e.title}>{e.code}</CodeBlock><p className="mt-1.5 text-sm text-muted">{e.desc}</p></div>)}
          </div>
        </section>

        <LabFor id={id} />

        <section id="yonerge" className="grid scroll-mt-24 gap-4 md:grid-cols-2">
          <div className="card p-6"><H id="yonerge-b">🧭 Uygulama yönergeleri</H><ol className="space-y-2">{lesson.guide.map((g, i) => <li key={i} className="flex gap-3 text-sm"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-xs font-bold text-white">{i + 1}</span><span className="lesson-p">{g}</span></li>)}</ol></div>
          <div className="card p-6"><H id="sonrasi">💡 Uygulama sonrası açıklamalar</H><ul className="space-y-2">{lesson.after.map((g, i) => <li key={i} className="lesson-p flex gap-2 text-sm"><span className="text-ok">✔</span>{g}</li>)}</ul></div>
        </section>

        <section id="test" className="card scroll-mt-24 p-6">
          <H id="test-b">📝 Mini değerlendirme testi (5 soru)</H>
          {saved && <p className="mb-3 rounded-lg bg-soft px-3 py-2 text-sm">Kayıtlı son sonucun: <b className="text-brand">{saved.score}/{saved.total}</b> — testi tekrar çözerek geliştirebilirsin.</p>}
          <QuizRunner key={id} questions={lesson.quiz} mode="mini" onFinish={(answers, score) => saveQuiz(id, { score, total: lesson.quiz.length, answers })} />
        </section>

        <section id="ozet" className="card scroll-mt-24 p-6">
          <H id="ozet-b">📌 Ders özeti</H>
          <ul className="grid gap-2 sm:grid-cols-2">{lesson.summary.map((s, i) => <li key={i} className="flex gap-2 rounded-lg bg-soft px-3 py-2 text-sm"><span className="text-brand">★</span>{s}</li>)}</ul>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <button className={`btn ${done ? "btn-on" : "btn-primary"}`} onClick={() => setLesson(id, !done)}>{done ? "✓ Tamamlandı (geri al)" : "✔ Dersi tamamlandı olarak işaretle"}</button>
            <div className="flex flex-wrap gap-2">
              {prev && <Link className="btn" href={`/ders/${prev.id}`}>← Ders {String(prev.id).padStart(2, "0")}</Link>}
              {next ? <Link className="btn btn-primary" href={`/ders/${next.id}`}>Sonraki ders: {next.title} →</Link> : <Link className="btn btn-primary" href="/final">🎓 Final sınavına geç →</Link>}
            </div>
          </div>
          {next && <p className="mt-3 text-sm text-muted">Sonraki derse geçiş: <b>Ders {String(next.id).padStart(2, "0")} — {next.title}</b>. {next.short}</p>}
        </section>
      </div>
    </main>
  );
}
