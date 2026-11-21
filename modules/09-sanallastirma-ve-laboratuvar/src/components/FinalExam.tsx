"use client";

import Link from "next/link";
import { useState } from "react";
import { FINAL_QUESTIONS } from "@/content/final";
import { LESSONS } from "@/content/lessons";
import { saveFinal, useProgress } from "@/lib/progress";
import { Quiz, type QuizResult } from "./Quiz";
import { Callout, ProgressBar, SectionTitle } from "./ui";

const WEIGHT: Record<string, number> = { Kolay: 1, Orta: 2, Zor: 3 };
const MAX_POINTS = FINAL_QUESTIONS.reduce((n, q) => n + WEIGHT[q.level ?? "Kolay"], 0);

function Summary({ r }: { r: QuizResult }) {
  const pct = Math.round((r.score / r.total) * 100);
  const points = r.results.reduce((n, x) => n + (x.ok ? WEIGHT[x.level ?? "Kolay"] : 0), 0);
  const wrongByLesson: Record<string, number> = {};
  r.results.forEach((x) => {
    if (!x.ok && x.lesson) wrongByLesson[x.lesson] = (wrongByLesson[x.lesson] ?? 0) + 1;
  });
  const weak = LESSONS.filter((l) => wrongByLesson[l.slug]);
  const byLevel = ["Kolay", "Orta", "Zor"].map((lv) => {
    const rs = r.results.filter((x) => x.level === lv);
    return { lv, ok: rs.filter((x) => x.ok).length, total: rs.length };
  });
  const tone = pct >= 80 ? "ok" : pct >= 60 ? "warn" : "err";
  return (
    <div className="space-y-4">
      <div className="card space-y-3">
        <h3 className="text-lg font-bold">Final sınavı sonuç raporu</h3>
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-ag-bg p-3"><p className="text-xs text-ag-muted">Toplam puan</p><p className="text-2xl font-extrabold text-ag-brand">{points}/{MAX_POINTS}</p><p className="text-[11px] text-ag-muted">kolay 1 · orta 2 · zor 3</p></div>
          <div className="rounded-xl bg-ag-bg p-3"><p className="text-xs text-ag-muted">Başarı yüzdesi</p><p className="text-2xl font-extrabold text-ag-brand">%{pct}</p></div>
          <div className="rounded-xl bg-ag-bg p-3"><p className="text-xs text-ag-muted">Doğru</p><p className="text-2xl font-extrabold text-ag-ok">{r.score}</p></div>
          <div className="rounded-xl bg-ag-bg p-3"><p className="text-xs text-ag-muted">Yanlış</p><p className="text-2xl font-extrabold text-ag-err">{r.total - r.score}</p></div>
        </div>
        <ProgressBar pct={pct} tone={tone} />
        <Callout kind={pct >= 70 ? "ok" : "warn"} title={pct >= 70 ? "Modülü başarıyla tamamladın!" : "Biraz daha pratik gerekiyor"}>
          {pct >= 70 ? "Sanallaştırma, laboratuvar kurulumu ve güvenliği konularında sağlam bir temel oluşturdun. Şimdi kendi bilgisayarında kurulumları gerçekleştirebilirsin." : "Aşağıdaki önerilen dersleri tekrar çalış, sonra sınavı yeniden dene. Acele etme; hata yapmak öğrenmenin parçası."}
        </Callout>
        <div className="grid gap-2 sm:grid-cols-3">
          {byLevel.map((b) => (
            <div key={b.lv} className="rounded-lg border border-ag-line p-2 text-center text-sm"><span className="font-bold">{b.lv}</span>: {b.ok}/{b.total}</div>
          ))}
        </div>
      </div>
      <div className="card space-y-3">
        <h3 className="font-bold">Eksik öğrenme alanları ve tekrar önerilen dersler</h3>
        {weak.length === 0 ? (
          <p className="text-sm text-ag-ok">Harika! Tüm konularda doğru yanıt verdin. Eksik alan görünmüyor.</p>
        ) : (
          <ul className="space-y-2">
            {weak.map((l) => (
              <li key={l.slug} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-ag-err/30 bg-[#fdf0f0] px-3 py-2 text-sm">
                <span>
                  <strong>{l.no}. {l.title}</strong> — {wrongByLesson[l.slug]} yanlış
                </span>
                <Link href={`/lesson/${l.slug}`} className="btn btn-sm">Dersi tekrar et</Link>
              </li>
            ))}
          </ul>
        )}
        <details className="text-sm">
          <summary className="cursor-pointer font-semibold text-ag-brand">Tüm soruların sonucu</summary>
          <ul className="mt-2 grid gap-1 sm:grid-cols-2">
            {r.results.map((x, i) => (
              <li key={x.id} className={x.ok ? "text-ag-ok" : "text-ag-err"}>
                {x.ok ? "✔" : "✘"} Soru {i + 1} ({x.level}) – {LESSONS.find((l) => l.slug === x.lesson)?.title}
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  );
}

export function FinalExam() {
  const p = useProgress();
  const [started, setStarted] = useState(false);
  const counts = { Kolay: 0, Orta: 0, Zor: 0 } as Record<string, number>;
  FINAL_QUESTIONS.forEach((q) => (counts[q.level ?? "Kolay"]++));

  const finish = (r: QuizResult) => {
    const wrong: Record<string, number> = {};
    const byLevel: Record<string, { ok: number; total: number }> = {};
    r.results.forEach((x) => {
      if (!x.ok && x.lesson) wrong[x.lesson] = (wrong[x.lesson] ?? 0) + 1;
      const lv = x.level ?? "Kolay";
      byLevel[lv] ??= { ok: 0, total: 0 };
      byLevel[lv].total++;
      if (x.ok) byLevel[lv].ok++;
    });
    saveFinal({ score: r.score, total: r.total, pct: Math.round((r.score / r.total) * 100), at: Date.now(), wrong, byLevel });
  };

  return (
    <div className="space-y-6">
      <div className="card !p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-ag-brand to-ag-accent px-6 py-6 text-white sm:px-8">
          <p className="text-xs font-bold tracking-[0.25em] text-ag-light">MODÜL 09 · FİNAL</p>
          <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Modül sonu genel sınavı</h1>
          <p className="mt-1 text-sm text-ag-light">{FINAL_QUESTIONS.length} soru · 11 dersin tamamı · kolay, orta ve zor seviyeler</p>
        </div>
      </div>
      {!started ? (
        <div className="space-y-4">
          <SectionTitle title="Sınavdan önce">Sorular sanallaştırma mimarisi, hypervisor, VirtualBox ve VMware, sanal makine kaynakları, snapshot ve clone, NAT ve Bridged, izole laboratuvar, Kali ve Ubuntu kurulumu ile laboratuvar güvenliğini kapsar. Her sorudan sonra açıklamalı geri bildirim alırsın.</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-3">
            {Object.entries(counts).map(([k, v]) => (
              <div key={k} className="card !p-4 text-center"><p className="text-3xl font-black text-ag-brand">{v}</p><p className="text-sm font-semibold">{k} soru</p></div>
            ))}
          </div>
          {p.final && (
            <Callout kind="info" title="Önceki denemenin sonucu">
              %{p.final.pct} başarı ({p.final.score}/{p.final.total} doğru). Tarih: {new Date(p.final.at).toLocaleString("tr-TR")}
            </Callout>
          )}
          <button type="button" className="btn btn-primary" onClick={() => setStarted(true)}>Sınavı başlat</button>
        </div>
      ) : (
        <Quiz title="Final sınavı" questions={FINAL_QUESTIONS} onFinish={finish} summary={(r) => <Summary r={r} />} />
      )}
    </div>
  );
}
