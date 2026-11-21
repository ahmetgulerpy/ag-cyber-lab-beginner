import { notFound } from "next/navigation";
import LessonView from "@/components/LessonView";
import { LESSONS, getLesson } from "@/data/lessons";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ id: String(l.id) }));
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = getLesson(Number(id));
  if (!lesson) notFound();
  return <LessonView lesson={lesson} />;
}
