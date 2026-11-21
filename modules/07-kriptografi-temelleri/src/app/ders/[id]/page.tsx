import { notFound } from "next/navigation";
import { LessonView } from "@/components/LessonView";
import { LESSONS } from "@/data/lessons";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ id: String(l.id) }));
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = Number(id);
  if (!LESSONS.some((l) => l.id === n)) notFound();
  return <LessonView id={n} />;
}
