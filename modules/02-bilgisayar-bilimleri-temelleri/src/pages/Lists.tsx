import { CheckCircle2, FlaskConical, ArrowRight } from "lucide-react";
import { lessons } from "../data/lessons";
import { useProgress } from "../progress";
import { Badge, Card, SectionTitle } from "../components/ui";
import { LessonList } from "../components/LessonList";

export function LessonsPage() {
  const { progress } = useProgress();
  return (
    <div>
      <SectionTitle eyebrow="Dersler" title="Tüm dersler">
        10 derslik başlangıç seviyesi müfredat. Dilediğin derse geçebilirsin; ancak sırayla ilerlemeni öneririz. Tamamlanan: {progress.completedLessons.length}/10.
      </SectionTitle>
      <LessonList />
    </div>
  );
}

export function LabsPage() {
  const { progress } = useProgress();
  return (
    <div>
      <SectionTitle eyebrow="Uygulamalar" title="Etkileşimli laboratuvarlar">
        Her dersin kendi uygulaması var. Tüm uygulamalar tarayıcıda çalışan, güvenli ve eğitim amaçlı simülasyonlardır. Tamamlanan: {progress.completedLabs.length}/10.
      </SectionTitle>
      <div className="grid gap-3 md:grid-cols-2">
        {lessons.map((l) => {
          const done = progress.completedLabs.includes(l.id);
          return (
            <a key={l.id} href={`#/lesson/${l.id}/lab`}>
              <Card className="group h-full transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-soft text-brand">
                    <FlaskConical className="h-5 w-5" />
                  </div>
                  {done ? (
                    <Badge tone="ok">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Tamamlandı
                    </Badge>
                  ) : (
                    <Badge tone="muted">Bekliyor</Badge>
                  )}
                </div>
                <div className="mt-3 text-xs font-semibold text-accent">LAB {String(l.id).padStart(2, "0")} · {l.title}</div>
                <h3 className="font-semibold text-ink group-hover:text-brand">{l.labTitle}</h3>
                <p className="mt-1 text-sm text-muted">{l.labDesc}</p>
                <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-brand">
                  {done ? "Tekrar dene" : "Uygulamaya git"} <ArrowRight className="h-4 w-4" />
                </div>
              </Card>
            </a>
          );
        })}
      </div>
    </div>
  );
}
