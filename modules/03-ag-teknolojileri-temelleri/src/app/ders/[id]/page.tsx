import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { lessons, getLesson } from "@/data/lessons";
import { LessonView } from "@/components/LessonView";

export function generateStaticParams() {
  return lessons.map((l) => ({ id: String(l.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const l = getLesson(Number(id));
  return { title: l ? `Ders ${String(l.id).padStart(2, "0")} – ${l.title} | AG CYBER LAB` : "Ders bulunamadı" };
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = getLesson(Number(id));
  if (!lesson) notFound();
  return <LessonView key={lesson.id} lesson={lesson} />;
}
