import { notFound } from "next/navigation";
import LessonView from "@/components/LessonView";
import { ALL_LESSONS } from "@/data/lessons";

export function generateStaticParams() {
  return ALL_LESSONS.map((l) => ({ id: String(l.id) }));
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = Number(id);
  if (!ALL_LESSONS.some((l) => l.id === n)) notFound();
  return <LessonView id={n} />;
}
