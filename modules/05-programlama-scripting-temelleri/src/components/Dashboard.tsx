"use client";

import Link from "next/link";
import { CURRICULUM, MODULE_NO, MODULE_TITLE, PROGRAM_NAME, pad } from "@/data/curriculum";
import { TOTAL_LESSONS, useProgress } from "@/lib/storage";
import { formatDate } from "@/lib/util";
import { Badge, Btn, Card, ProgressBar } from "./ui";

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-brand">{value}</p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { progress, percent, reset, hydrated } = useProgress();
  const last = progress.lastVisited ? CURRICULUM.find((c) => c.id === progress.lastVisited) : null;
  const quizDone = Object.keys(progress.quiz).length;
  const done = progress.completed.length;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="bg-gradient-to-r from-brand to-accent px-6 py-7 text-white sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-90">
            AG CYBER LAB · {PROGRAM_NAME}
          </p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            MODÜL {MODULE_NO} — {MODULE_TITLE.toUpperCase()}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 opacity-95">
            Programlamanın temel mantığından Python, Bash ve PowerShell scriptingine; JSON/XML ve Regex&apos;e kadar 14
            ders. Her derste etkileşimli bir sanal laboratuvar, mini test ve uygulama senaryosu bulunur. Seviye:
            Başlangıç.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={last ? `/ders/${last.id}` : "/ders/1"}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand transition hover:bg-soft"
            >
              {last ? `Kaldığınız yerden devam edin: Ders ${pad(last.id)}` : "Eğitime başla →"}
            </Link>
            <Link
              href="/sinav"
              className="rounded-lg border border-white/50 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Genel sınav
            </Link>
          </div>
        </div>
        <div className="grid gap-px bg-line sm:grid-cols-3">
          {[
            ["14 ders", "Sıralı müfredat"],
            ["14 laboratuvar", "Tarayıcıda çalışan simülasyonlar"],
            ["90 soru", "70 mini test + 20 genel sınav"],
          ].map(([a, b]) => (
            <div key={a} className="bg-white px-6 py-3">
              <p className="font-semibold">{a}</p>
              <p className="text-xs text-muted">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Kişisel ilerleme paneli" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-bold">Kişisel ilerleme paneli</h2>
          {hydrated && (done > 0 || progress.exam || quizDone > 0 || progress.labs.length > 0) && (
            <Btn
              variant="ghost"
              onClick={() => {
                if (window.confirm("Tüm ilerleme kaydı silinsin mi? Bu işlem geri alınamaz.")) reset();
              }}
            >
              İlerlemeyi sıfırla
            </Btn>
          )}
        </div>
        <Card>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-muted">Eğitim ilerleme çubuğu</p>
              <p className="text-3xl font-bold text-brand">%{percent}</p>
            </div>
            <p className="text-sm text-muted">
              {done} / {TOTAL_LESSONS} ders tamamlandı
            </p>
          </div>
          <ProgressBar value={percent} className="mt-3 h-3" />
        </Card>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Toplam ders" value={String(TOTAL_LESSONS)} />
          <Stat label="Tamamlanan ders" value={String(done)} sub={`%${percent} tamamlanma`} />
          <Stat label="Tamamlanan laboratuvar" value={`${progress.labs.length} / ${TOTAL_LESSONS}`} />
          <Stat
            label="Genel sınav"
            value={progress.exam ? `%${progress.exam.percent}` : "—"}
            sub={progress.exam ? `${progress.exam.score}/${progress.exam.total} · ${formatDate(progress.exam.date)}` : "Henüz çözülmedi"}
          />
        </div>
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold">Son ziyaret edilen ders</h3>
            {last ? (
              <Link href={`/ders/${last.id}`} className="text-sm font-medium text-brand hover:underline">
                Ders {pad(last.id)} · {last.title} →
              </Link>
            ) : (
              <span className="text-sm text-muted">Henüz ders ziyaret edilmedi</span>
            )}
          </div>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Dersler, laboratuvarlar ve mini testler</h2>
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <ul className="divide-y divide-line">
            {CURRICULUM.map((l) => {
              const isDone = progress.completed.includes(l.id);
              const lab = progress.labs.includes(l.id);
              const qz = progress.quiz[l.id];
              return (
                <li key={l.id}>
                  <Link
                    href={`/ders/${l.id}`}
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 transition hover:bg-soft/60 sm:px-5"
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                        isDone ? "bg-ok text-white" : "bg-soft text-brand"
                      }`}
                    >
                      {isDone ? "✓" : pad(l.id)}
                    </span>
                    <span className="min-w-0 flex-1 font-medium">{l.title}</span>
                    <span className="flex flex-wrap gap-1.5">
                      <Badge tone={lab ? "ok" : "muted"}>Lab {lab ? "✓" : "—"}</Badge>
                      <Badge tone={qz ? (qz.score >= 3 ? "ok" : "warn") : "muted"}>
                        Test {qz ? `${qz.score}/${qz.total}` : "—"}
                      </Badge>
                      <Badge tone={isDone ? "ok" : "muted"}>{isDone ? "Tamamlandı" : "Bekliyor"}</Badge>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section>
        <Card className="bg-soft/60">
          <h3 className="font-semibold">Güvenlik notu</h3>
          <p className="mt-1 text-sm leading-6 text-[#2b4152]">
            Bu modüldeki Python, Bash ve PowerShell laboratuvarları gerçek komut çalıştırmaz; tamamı tarayıcı içinde
            çalışan eğitim simülasyonlarıdır. Bilgisayarınızın dosyalarına veya sistem ayarlarına erişilmez. İlerlemeniz
            yalnızca bu tarayıcının LocalStorage alanında saklanır; hiçbir sunucuya gönderilmez.
          </p>
        </Card>
      </section>
    </div>
  );
}
