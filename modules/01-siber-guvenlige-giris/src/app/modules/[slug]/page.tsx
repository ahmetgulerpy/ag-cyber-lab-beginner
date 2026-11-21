import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookOpen, Clock, ListChecks } from "lucide-react";
import { CurriculumList } from "@/components/CurriculumList";
import { ProgressSummary } from "@/components/ProgressSummary";
import { Badge } from "@/components/ui";
import { getModule, getModuleSummary, modules, totalMinutes } from "@/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return modules.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const mod = getModule(slug);
  return { title: mod ? `Modül ${mod.code}: ${mod.title}` : "Modül" };
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = getModule(slug);
  if (!mod) notFound();
  const summary = getModuleSummary(mod);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">Modül {mod.code}</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">{mod.title}</h1>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge>{mod.level} seviyesi</Badge>
        <Badge tone="neutral">
          <BookOpen size={11} aria-hidden /> {mod.lessons.length} ders
        </Badge>
        <Badge tone="neutral">
          <Clock size={11} aria-hidden /> ~{totalMinutes(mod)} dk
        </Badge>
        <Badge tone="neutral">
          <ListChecks size={11} aria-hidden /> {mod.lessons.length} mini test + {mod.finalExam.length} soruluk genel test
        </Badge>
      </div>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/85">{mod.description}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <CurriculumList summary={summary} />
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProgressSummary summary={summary} />
        </div>
      </div>
    </div>
  );
}
