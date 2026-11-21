"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Lesson } from "@/data/types";
import { PASS_QUIZ, setLast, updateLesson, useProgress } from "@/lib/progress";
import { Badge, Btn, Card, Feedback, InfoBox, ProgressBar, Tabs } from "./ui";
import { QuizRunner } from "./QuizRunner";
import { LabRegistry } from "@/labs/registry";

type MainTab = "anlatim" | "lab" | "gorev" | "test" | "ozet";
type SubTab = "kavram" | "diyagram" | "karsilastirma" | "terim" | "hayat";

function Diagram({ d }: { d: Lesson["diagram"] }) {
  const [sel, setSel] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => {
      setSel((s) => {
        if (s >= d.steps.length - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 1600);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, d.steps.length]);

  const play = () => {
    setSel(0);
    setPlaying(true);
  };
  const step = d.steps[sel];

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-bold">{d.title}</h3>
        <Btn size="sm" variant="secondary" onClick={play} disabled={playing}>{playing ? "Oynatılıyor…" : "▶ Akışı oynat"}</Btn>
      </div>
      <p className="mt-1 text-sm text-muted">{d.caption}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-5">
        {d.steps.map((s, i) => (
          <button
            key={i}
            onClick={() => {
              setPlaying(false);
              setSel(i);
            }}
            aria-pressed={sel === i}
            className={`relative rounded-xl border p-3 text-center transition-all ${
              sel === i ? "border-brand bg-soft shadow-sm" : i < sel ? "border-accent/40 bg-accent/5" : "border-line bg-card hover:border-brand/40"
            }`}
          >
            <span className="block text-2xl" aria-hidden>{s.icon}</span>
            <span className="mt-1 block text-xs font-semibold text-ink">{i + 1}. {s.label}</span>
            {i < d.steps.length - 1 && <span className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 text-accent sm:block" aria-hidden>➜</span>}
          </button>
        ))}
      </div>
      <div className="ag-fade mt-4 rounded-xl border border-brand/20 bg-soft p-4" key={sel} aria-live="polite">
        <p className="text-sm font-bold text-brand">{step.icon} {sel + 1}. adım – {step.label}</p>
        <p className="mt-1 text-sm text-[#2c4152]">{step.desc}</p>
      </div>
    </Card>
  );
}

function QuickChecks({ items }: { items: Lesson["quick"] }) {
  const [ans, setAns] = useState<Record<number, boolean>>({});
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((it, i) => {
        const a = ans[i];
        return (
          <Card key={i}>
            <Badge tone="warn">⚡ Hızlı karar</Badge>
            <p className="mt-2 text-sm font-semibold">{it.q}</p>
            <div className="mt-3 flex gap-2">
              <Btn size="sm" variant={a === true ? "primary" : "secondary"} onClick={() => setAns({ ...ans, [i]: true })}>Doğru</Btn>
              <Btn size="sm" variant={a === false ? "primary" : "secondary"} onClick={() => setAns({ ...ans, [i]: false })}>Yanlış</Btn>
            </div>
            {a !== undefined && (
              <div className="mt-3">
                <Feedback ok={a === it.answer}>{it.explain}</Feedback>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

export function LessonView({ lesson, prev, next }: { lesson: Lesson; prev?: Lesson; next?: Lesson }) {
  const progress = useProgress();
  const lp = progress.lessons[lesson.slug] ?? {};
  const [tab, setTab] = useState<MainTab>("anlatim");
  const [sub, setSub] = useState<SubTab>("kavram");
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    setLast(lesson.slug);
  }, [lesson.slug]);

  // Kaldığı sekmeyi geri yükle
  useEffect(() => {
    if (restored) return;
    if (lp.tab && ["anlatim", "lab", "gorev", "test", "ozet"].includes(lp.tab)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTab(lp.tab as MainTab);
      setRestored(true);
    }
  }, [lp.tab, restored]);

  const changeTab = (t: MainTab) => {
    setTab(t);
    updateLesson(lesson.slug, { tab: t });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const labDone = !!lp.labDone;
  const quizPassed = (lp.quizBest ?? 0) >= PASS_QUIZ;
  const taskDone = lesson.task.steps.filter((_, i) => lp.task?.[i]).length;

  const onLabComplete = useCallback(() => {
    if (!labDone) updateLesson(lesson.slug, { labDone: true });
  }, [labDone, lesson.slug]);

  const toggleTask = (i: number) => {
    const t = lesson.task.steps.map((_, k) => !!lp.task?.[k]);
    t[i] = !t[i];
    updateLesson(lesson.slug, { task: t });
  };

  const Lab = LabRegistry[lesson.slug];

  return (
    <div className="space-y-5">
      <Card className="bg-gradient-to-br from-soft to-white">
        <div className="flex flex-wrap items-start gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand text-3xl" aria-hidden>{lesson.icon}</div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="brand">Ders {String(lesson.no).padStart(2, "0")} / 13</Badge>
              <Badge tone="muted">⏱ ~{lesson.minutes} dk</Badge>
              {lp.completed && <Badge tone="ok">✓ Tamamlandı</Badge>}
            </div>
            <h1 className="mt-2 text-2xl font-extrabold leading-tight text-ink sm:text-3xl">{lesson.title}</h1>
            <p className="text-sm font-medium text-accent">{lesson.en}</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-line bg-white p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-brand">🎯 Öğrenme hedefi</p>
            <p className="mt-1 text-sm text-[#2c4152]">{lesson.goal}</p>
          </div>
          <div className="rounded-xl border border-line bg-white p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-brand">🧰 Ders sonunda kazanacağın beceriler</p>
            <ul className="mt-1 grid gap-0.5 text-sm text-[#2c4152]">
              {lesson.skills.map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <Badge tone={labDone ? "ok" : "muted"}>{labDone ? "✓" : "○"} Laboratuvar</Badge>
          <Badge tone={taskDone === lesson.task.steps.length ? "ok" : "muted"}>{taskDone === lesson.task.steps.length ? "✓" : "○"} Görev {taskDone}/{lesson.task.steps.length}</Badge>
          <Badge tone={quizPassed ? "ok" : "muted"}>{quizPassed ? "✓" : "○"} Mini test {lp.quizBest !== undefined ? `(${lp.quizBest}/${lp.quizTotal ?? 5})` : ""}</Badge>
        </div>
      </Card>

      <Tabs<MainTab>
        value={tab}
        onChange={changeTab}
        tabs={[
          { id: "anlatim", label: "Anlatım", icon: "📘" },
          { id: "lab", label: "Laboratuvar", icon: "🧪", badge: labDone ? "✓" : undefined },
          { id: "gorev", label: "Görev", icon: "✅", badge: taskDone === lesson.task.steps.length ? "✓" : undefined },
          { id: "test", label: "Mini Test", icon: "📝", badge: quizPassed ? "✓" : undefined },
          { id: "ozet", label: "Özet", icon: "📌" },
        ]}
      />

      {tab === "anlatim" && (
        <div className="ag-fade space-y-4">
          <InfoBox tone="brand" icon="💬" title="Hadi başlayalım">{lesson.hook}</InfoBox>
          <Tabs<SubTab>
            variant="pill"
            value={sub}
            onChange={setSub}
            tabs={[
              { id: "kavram", label: "Temel kavramlar", icon: "🧩" },
              { id: "diyagram", label: "Nasıl çalışır?", icon: "🔀" },
              { id: "karsilastirma", label: "Karşılaştırma", icon: "⚖️" },
              { id: "terim", label: "Teknik terimler", icon: "🔤" },
              { id: "hayat", label: "Gerçek hayat", icon: "🌍" },
            ]}
          />

          {sub === "kavram" && (
            <div className="ag-fade space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {lesson.concepts.map((c) => (
                  <Card key={c.title} className="transition-shadow hover:shadow-md">
                    <p className="text-2xl" aria-hidden>{c.icon}</p>
                    <h3 className="mt-1 font-bold text-brand">{c.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#2c4152]">{c.body}</p>
                  </Card>
                ))}
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {lesson.tips.map((t) => (
                  <InfoBox key={t} tone="warn" icon="💡" title="Aklında olsun">{t}</InfoBox>
                ))}
              </div>
              <div>
                <p className="mb-2 text-sm font-bold text-muted">Şimdi küçük bir karar verelim:</p>
                <QuickChecks items={lesson.quick} />
              </div>
            </div>
          )}

          {sub === "diyagram" && (
            <div className="ag-fade">
              <Diagram d={lesson.diagram} />
            </div>
          )}

          {sub === "karsilastirma" && (
            <Card className="ag-fade overflow-hidden">
              <h3 className="mb-3 text-lg font-bold">{lesson.compare.title}</h3>
              <div className="-mx-4 overflow-x-auto px-4 sm:-mx-5 sm:px-5">
                <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                  <thead>
                    <tr>
                      {lesson.compare.cols.map((c, i) => (
                        <th key={c} className={`border-b-2 border-brand/20 bg-soft px-3 py-2 text-xs font-bold uppercase tracking-wide text-brand ${i === 0 ? "rounded-tl-lg" : ""}`}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lesson.compare.rows.map((r, ri) => (
                      <tr key={ri} className="odd:bg-white even:bg-page">
                        {r.map((cell, ci) => (
                          <td key={ci} className={`border-b border-line px-3 py-2.5 align-top ${ci === 0 ? "font-semibold text-ink" : "text-[#2c4152]"}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {sub === "terim" && (
            <div className="ag-fade grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {lesson.terms.map((t) => (
                <Card key={t.term}>
                  <p className="text-sm font-bold text-brand">🔤 {t.term}</p>
                  <p className="mt-1 text-sm text-[#2c4152]">{t.def}</p>
                </Card>
              ))}
            </div>
          )}

          {sub === "hayat" && (
            <div className="ag-fade grid gap-3 md:grid-cols-5">
              <Card className="md:col-span-3">
                <Badge tone="brand">🌍 Gerçek hayattan örnek</Badge>
                <h3 className="mt-2 text-lg font-bold">{lesson.story.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#2c4152]">{lesson.story.text}</p>
              </Card>
              <div className="md:col-span-2">
                <InfoBox tone="ok" icon="🎓" title="Bu hikâyeden çıkaracağımız ders" className="h-full">{lesson.story.lesson}</InfoBox>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Btn onClick={() => changeTab("lab")}>Laboratuvara geç 🧪</Btn>
          </div>
        </div>
      )}

      {tab === "lab" && (
        <Card className="ag-fade">
          {Lab ? <Lab onComplete={onLabComplete} done={labDone} /> : <p>Laboratuvar bulunamadı.</p>}
          <div className="mt-6 flex justify-end gap-2 border-t border-line pt-4">
            <Btn variant="ghost" onClick={() => changeTab("anlatim")}>← Anlatıma dön</Btn>
            <Btn onClick={() => changeTab("gorev")}>Göreve geç →</Btn>
          </div>
        </Card>
      )}

      {tab === "gorev" && (
        <Card className="ag-fade space-y-4">
          <div>
            <Badge tone="brand">✅ Uygulama görevi</Badge>
            <h3 className="mt-2 text-lg font-bold">{lesson.task.title}</h3>
            <p className="text-sm text-muted">{lesson.task.desc}</p>
          </div>
          <ProgressBar value={(taskDone / lesson.task.steps.length) * 100} tone="ok" />
          <ul className="space-y-2">
            {lesson.task.steps.map((s, i) => (
              <li key={i}>
                <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition-colors ${lp.task?.[i] ? "border-ok/40 bg-ok/5" : "border-line bg-white hover:border-brand/40"}`}>
                  <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#176B87]" checked={!!lp.task?.[i]} onChange={() => toggleTask(i)} />
                  <span className={lp.task?.[i] ? "text-muted line-through" : ""}>{s}</span>
                </label>
              </li>
            ))}
          </ul>
          {taskDone === lesson.task.steps.length && <Feedback ok title="Görev tamamlandı!">Harika, öğrendiklerini gerçek hayatta uyguladın. Şimdi mini testle bilgini ölçebilirsin.</Feedback>}
          <div className="flex justify-end gap-2">
            <Btn variant="ghost" onClick={() => changeTab("lab")}>← Laboratuvar</Btn>
            <Btn onClick={() => changeTab("test")}>Mini teste geç →</Btn>
          </div>
        </Card>
      )}

      {tab === "test" && (
        <div className="ag-fade space-y-4">
          <QuizRunner
            title={`Mini Değerlendirme – ${lesson.title}`}
            intro={`Bu testi geçmek için en az ${PASS_QUIZ} doğru yapmalısın. Yanlış yaparsan neden yanlış olduğunu göreceksin.`}
            questions={lesson.quiz}
            onFinish={(score) => updateLesson(lesson.slug, { quizBest: Math.max(lp.quizBest ?? 0, score), quizTotal: lesson.quiz.length })}
          />
          <div className="flex justify-end">
            <Btn variant="ghost" onClick={() => changeTab("ozet")}>Özete geç →</Btn>
          </div>
        </div>
      )}

      {tab === "ozet" && (
        <div className="ag-fade space-y-4">
          <Card>
            <Badge tone="brand">📌 Kısa ders özeti</Badge>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {lesson.summary.map((s, i) => (
                <li key={i} className="flex gap-2 rounded-xl border border-line bg-page p-3 text-sm">
                  <span className="font-bold text-accent">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Card>
          {lp.completed ? (
            <Feedback ok title="Dersi tamamladın! 🎉">İlerlemen bu tarayıcıda otomatik olarak kaydedildi.</Feedback>
          ) : (
            <InfoBox tone="warn" icon="🧭" title="Dersi tamamlamak için">
              {!labDone && <p>• Laboratuvarı tamamla (laboratuvar sekmesi).</p>}
              {!quizPassed && <p>• Mini testte en az {PASS_QUIZ} doğru yap.</p>}
            </InfoBox>
          )}
        </div>
      )}

      <Card className="flex flex-wrap items-center justify-between gap-3">
        {prev ? (
          <Link href={`/dersler/${prev.slug}`} className="text-sm font-semibold text-muted hover:text-brand">← {prev.no}. {prev.title}</Link>
        ) : (
          <Link href="/" className="text-sm font-semibold text-muted hover:text-brand">← Ana sayfa</Link>
        )}
        {next ? (
          <Link href={`/dersler/${next.slug}`} className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#125a73]">
            Sonraki ders: {next.no}. {next.title} →
          </Link>
        ) : (
          <Link href="/sinav" className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#125a73]">
            Modül bitti! Genel sınava geç →
          </Link>
        )}
      </Card>
    </div>
  );
}
