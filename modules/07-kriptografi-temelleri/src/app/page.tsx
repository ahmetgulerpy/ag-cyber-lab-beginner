"use client";

import Link from "next/link";
import { Button, Card, Pill, SectionHead, cx } from "@/components/ui";
import { LESSONS, MODULE } from "@/data/lessons";
import { useProgress } from "@/lib/progress";

function Stat({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "ok" | "brand" }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className={cx("mt-1 text-3xl font-bold", tone === "ok" ? "text-ok" : "text-brand")}>{value}</p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  );
}

export default function Home() {
  const { data, stats, ready, lessonStatus, reset } = useProgress();
  const last = data.lastLesson ? LESSONS.find((l) => l.id === data.lastLesson) : undefined;
  const nextLesson = LESSONS.find((l) => !lessonStatus(l.id).done) ?? LESSONS[0];
  const startId = last?.id ?? 1;
  const p = ready ? stats.percent : 0;
  const quizList = LESSONS.filter((l) => data.quizzes[l.id]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-brand to-[#0f4f66] p-6 text-white sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">AG CYBER LAB · {MODULE.program}</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-5xl">
          MODÜL {MODULE.no}
          <span className="block text-white/90">{MODULE.name}</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base text-white/85">
          Kriptografiyi okuyarak değil, uygulayarak öğren: gerçek AES-GCM şifrelemesi, RSA anahtar çiftleri, hash hesaplama, salt karşılaştırma, dijital imza ve TLS el sıkışması — hepsi tarayıcında çalışır.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/ders/${startId}`} className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand hover:bg-soft">
            {last ? `Devam et: Ders ${last.id} →` : "Eğitime başla →"}
          </Link>
          <Link href="/sinav" className="rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
            Genel sınava git
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 text-xs">
          {["Seviye: Başlangıç", "12 ders", "13 ana laboratuvar", "12 mini pratik", "60 + 20 soru"].map((t) => (
            <span key={t} className="rounded-full bg-white/15 px-3 py-1">
              {t}
            </span>
          ))}
        </div>
      </section>

      <section>
        <SectionHead title="İlerleme paneli" sub="İlerlemen bu tarayıcıda (LocalStorage) saklanır; sayfayı yenilesen de kaybolmaz." />
        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <b>Eğitim ilerleme çubuğu</b>
            <span className="font-semibold text-brand">%{p}</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-gradient-to-r from-brand to-accent transition-all duration-500" style={{ width: `${p}%` }} />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
            {last ? (
              <span>
                Son ziyaret edilen ders:{" "}
                <Link className="font-medium text-brand hover:underline" href={`/ders/${last.id}`}>
                  Ders {last.id} – {last.title}
                </Link>
              </span>
            ) : (
              <span>Henüz bir ders ziyaret etmedin.</span>
            )}
            {stats.lessonsDone < stats.totalLessons && (
              <span>
                · Sıradaki:{" "}
                <Link className="font-medium text-brand hover:underline" href={`/ders/${nextLesson.id}`}>
                  Ders {nextLesson.id}
                </Link>
              </span>
            )}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat label="Toplam ders" value={String(stats.totalLessons)} />
          <Stat label="Tamamlanan ders" value={`${stats.lessonsDone}/${stats.totalLessons}`} tone="ok" />
          <Stat label="Tamamlanma" value={`%${p}`} />
          <Stat label="Genel sınav" value={data.exam ? `%${Math.round((data.exam.score / data.exam.total) * 100)}` : "—"} sub={data.exam ? `${data.exam.score}/${data.exam.total} doğru` : "Henüz çözülmedi"} tone={data.exam ? "ok" : "brand"} />
          <Stat label="Tamamlanan laboratuvar" value={`${stats.labsDone}/${stats.labsTotal}`} />
          <Stat label="Mini pratik" value={`${stats.practicesDone}/${stats.practicesTotal}`} />
          <Stat label="Senaryo çalışması" value={`${stats.scenariosDone}/12`} />
          <Stat label="Mini test" value={`${stats.quizzesDone}/12`} />
        </div>
      </section>

      <section>
        <SectionHead title="Dersler" sub="Her dersin durumu: laboratuvar · pratik · senaryo · test" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {LESSONS.map((l) => {
            const s = lessonStatus(l.id);
            const q = data.quizzes[l.id];
            return (
              <Link key={l.id} href={`/ders/${l.id}`} className={cx("group rounded-2xl border bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md", s.done ? "border-ok/40" : "border-line")}>
                <div className="flex items-center justify-between">
                  <span className="text-2xl" aria-hidden>
                    {l.emoji}
                  </span>
                  <Pill tone={s.done ? "ok" : "neutral"}>{s.done ? "✓ Tamamlandı" : `Ders ${String(l.id).padStart(2, "0")}`}</Pill>
                </div>
                <p className="mt-2 text-base font-semibold text-ink group-hover:text-brand">{l.title}</p>
                <p className="text-xs text-accent">{l.en}</p>
                <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                  {([["Lab", s.lab], ["Pratik", s.practice], ["Senaryo", s.scenario]] as [string, boolean][]).map(([n, ok]) => (
                    <span key={n} className={cx("rounded-full border px-2 py-0.5", ok ? "border-ok/40 bg-[#E6F3EC] text-ok" : "border-line text-muted")}>
                      {ok ? "✓" : "○"} {n}
                    </span>
                  ))}
                  <span className={cx("rounded-full border px-2 py-0.5", q ? "border-ok/40 bg-[#E6F3EC] text-ok" : "border-line text-muted")}>{q ? `✓ Test ${q.score}/${q.total}` : "○ Test"}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {quizList.length > 0 && (
        <Card>
          <SectionHead title="Mini test sonuçları" />
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {quizList.map((l) => {
              const q = data.quizzes[l.id];
              const pct = Math.round((q.score / q.total) * 100);
              return (
                <div key={l.id} className="flex items-center justify-between rounded-lg bg-bg px-3 py-2 text-sm">
                  <span>Ders {l.id}</span>
                  <span className={cx("font-semibold", pct >= 70 ? "text-ok" : "text-warn")}>
                    {q.score}/{q.total} · %{pct}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Card>
        <SectionHead title="Nasıl çalışır?" />
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["1", "Öğren", "Kısa kartlar, tablolar ve diyagramlarla kavramı gör."],
            ["2", "Dene", "Laboratuvarda gerçek kriptografik işlemleri kendin çalıştır."],
            ["3", "Karar ver", "Senaryo ve mini pratiklerde doğru yöntemi seç."],
            ["4", "Ölç", "5 soruluk mini testler ve 20 soruluk genel sınav."],
          ].map(([n, t, d]) => (
            <div key={n} className="rounded-xl bg-soft p-4">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand text-sm font-semibold text-white">{n}</span>
              <p className="mt-2 font-semibold text-ink">{t}</p>
              <p className="text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">Gizlilik: Tüm işlemler tarayıcında yapılır. Girdiğin metinler, parolalar ve anahtarlar hiçbir sunucuya gönderilmez; yalnızca ilerleme bilgisi LocalStorage&apos;a yazılır.</p>
        <div className="mt-4">
          <Button
            variant="ghost"
            onClick={() => {
              if (window.confirm("Tüm ilerleme bu tarayıcıdan silinecek. Emin misin?")) reset();
            }}
          >
            İlerlemeyi sıfırla
          </Button>
        </div>
      </Card>
    </div>
  );
}
