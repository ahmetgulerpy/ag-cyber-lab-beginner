import { CheckCircle2, Clock, FlaskConical, ClipboardCheck, PlayCircle } from "lucide-react";
import { lessons } from "../data/lessons";
import { PASS_RATIO, useProgress } from "../progress";
import { Badge } from "./ui";
import { cn } from "../utils/cn";

export function lessonStatus(id: number, p: ReturnType<typeof useProgress>["progress"]): "done" | "progress" | "new" {
  if (p.completedLessons.includes(id)) return "done";
  if (p.completedLabs.includes(id) || p.quizResults[id] || p.lastLesson === id) return "progress";
  return "new";
}

export function LessonList() {
  const { progress } = useProgress();
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {lessons.map((l) => {
        const st = lessonStatus(l.id, progress);
        const labDone = progress.completedLabs.includes(l.id);
        const q = progress.quizResults[l.id];
        const qPass = q && q.score / q.total >= PASS_RATIO;
        return (
          <a
            key={l.id}
            href={`#/lesson/${l.id}`}
            className={cn(
              "group flex gap-4 rounded-xl border bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-md",
              st === "done" ? "border-ok/40" : "border-line"
            )}
          >
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-base font-bold",
                st === "done" ? "bg-ok text-white" : st === "progress" ? "bg-brand text-white" : "bg-soft text-brand"
              )}
            >
              {st === "done" ? <CheckCircle2 className="h-6 w-6" /> : String(l.id).padStart(2, "0")}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-1">
                <h3 className="font-semibold leading-snug text-ink group-hover:text-brand">
                  Ders {String(l.id).padStart(2, "0")} — {l.title}
                </h3>
              </div>
              <div className="text-xs text-muted">{l.en}</div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                {st === "done" ? <Badge tone="ok">Tamamlandı</Badge> : st === "progress" ? <Badge tone="warn">Devam ediyor</Badge> : <Badge tone="muted">Başlanmadı</Badge>}
                <span className="flex items-center gap-1 text-muted">
                  <Clock className="h-3.5 w-3.5" /> ~{l.minutes} dk
                </span>
                <span className={cn("flex items-center gap-1", labDone ? "text-ok" : "text-muted")}>
                  <FlaskConical className="h-3.5 w-3.5" /> {labDone ? "Uygulama ✓" : "Uygulama"}
                </span>
                <span className={cn("flex items-center gap-1", qPass ? "text-ok" : "text-muted")}>
                  <ClipboardCheck className="h-3.5 w-3.5" /> {q ? `Test ${q.score}/${q.total}` : "Test"}
                </span>
              </div>
            </div>
            <PlayCircle className="hidden h-5 w-5 shrink-0 self-center text-line transition-colors group-hover:text-accent sm:block" />
          </a>
        );
      })}
    </div>
  );
}
