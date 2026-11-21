import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonView } from "@/components/LessonView";
import { getModule, getModuleSummary, modules } from "@/content";
import { pad } from "@/content/helpers";

export const dynamicParams = false;

export function generateStaticParams() {
  return modules.flatMap((m) => m.lessons.map((l) => ({ slug: m.slug, lesson: String(l.id) })));
}

type Params = Promise<{ slug: string; lesson: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, lesson } = await params;
  const l = getModule(slug)?.lessons.find((x) => String(x.id) === lesson);
  return { title: l ? `Ders ${pad(l.id)}: ${l.title}` : "Ders" };
}

export default async function LessonPage({ params }: { params: Params }) {
  const { slug, lesson } = await params;
  const mod = getModule(slug);
  const l = mod?.lessons.find((x) => String(x.id) === lesson);
  if (!mod || !l) notFound();
  return <LessonView key={l.id} summary={getModuleSummary(mod)} lesson={l} />;
}
