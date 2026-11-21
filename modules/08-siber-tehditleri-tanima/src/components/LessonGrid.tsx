"use client";

import Link from "next/link";
import { lessons } from "@/data/lessons";
import { useProgress } from "@/lib/progress";
import { Badge, Card } from "./ui";

export function LessonGrid() {
  const p = useProgress();
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {lessons.map((l) => {
        const lp = p.lessons[l.slug] ?? {};
        const status = lp.completed ? "done" : lp.visited || lp.labDone || lp.quizBest !== undefined ? "progress" : "new";
        return (
          <Link key={l.slug} href={`/dersler/${l.slug}`} className="group block focus-visible:outline-none">
            <Card className={`h-full transition-all group-hover:-translate-y-0.5 group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-accent ${status === "done" ? "border-ok/40" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-soft text-2xl" aria-hidden>{l.icon}</span>
                <Badge tone={status === "done" ? "ok" : status === "progress" ? "warn" : "muted"}>
                  {status === "done" ? "✓ Tamamlandı" : status === "progress" ? "Devam ediyor" : "Başlanmadı"}
                </Badge>
              </div>
              <p className="mt-3 text-xs font-bold text-accent">DERS {String(l.no).padStart(2, "0")} • ~{l.minutes} dk</p>
              <h3 className="mt-0.5 text-base font-bold leading-snug text-ink">{l.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted">{l.hook}</p>
              <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-semibold">
                <span className={`rounded-full px-2 py-0.5 ${lp.labDone ? "bg-ok/10 text-ok" : "bg-page text-muted"}`}>{lp.labDone ? "✓" : "○"} Lab</span>
                <span className={`rounded-full px-2 py-0.5 ${(lp.quizBest ?? 0) >= 3 ? "bg-ok/10 text-ok" : "bg-page text-muted"}`}>{(lp.quizBest ?? 0) >= 3 ? "✓" : "○"} Test{lp.quizBest !== undefined ? ` ${lp.quizBest}/${lp.quizTotal ?? 5}` : ""}</span>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
