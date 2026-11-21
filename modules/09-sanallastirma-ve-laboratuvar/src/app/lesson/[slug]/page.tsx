import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LESSONS } from "@/content/lessons";
import { LESSON_COMPONENTS } from "@/lessons";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = LESSONS.find((x) => x.slug === slug);
  return { title: l ? `Ders ${l.no}: ${l.title} – AG Cyber Lab Modül 09` : "Ders bulunamadı" };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const Comp = LESSON_COMPONENTS[slug];
  if (!Comp) notFound();
  return <Comp />;
}
