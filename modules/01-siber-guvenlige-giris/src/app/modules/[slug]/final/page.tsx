import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { FinalExam } from "@/components/FinalExam";
import { getModule, getModuleSummary, modules } from "@/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return modules.map((m) => ({ slug: m.slug }));
}

export const metadata: Metadata = { title: "Genel Değerlendirme Testi" };

export default async function FinalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = getModule(slug);
  if (!mod) notFound();

  const topicIndex: Record<string, number> = {};
  for (const q of mod.finalExam) {
    const lesson = mod.lessons.find((l) => l.id === q.lesson);
    topicIndex[q.id] = lesson ? lesson.topics.findIndex((t) => t.title === q.topic) : -1;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <nav aria-label="Konum" className="mb-4 flex flex-wrap items-center gap-1 text-xs text-muted">
        <Link href="/" className="hover:text-brand">Ana sayfa</Link>
        <ChevronRight size={12} aria-hidden />
        <Link href={`/modules/${mod.slug}`} className="hover:text-brand">{mod.title}</Link>
        <ChevronRight size={12} aria-hidden />
        <span className="font-semibold text-ink">Genel değerlendirme</span>
      </nav>
      <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">Modül {mod.code} · Final</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">Genel Değerlendirme Testi</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink/85">
        {mod.finalExam.length} soruluk bu test, 8 dersin tamamındaki kavrayışını ölçer. Ezberden çok, öğrendiklerini yeni durumlara
        uygulayabilmene odaklanır.
      </p>
      <div className="mt-6">
        <FinalExam summary={getModuleSummary(mod)} questions={mod.finalExam} topicIndex={topicIndex} />
      </div>
    </div>
  );
}
