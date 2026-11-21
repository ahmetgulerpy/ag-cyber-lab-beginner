import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LessonView from "@/components/LessonView";
import { LESSONS, getLesson } from "@/data/lessons";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const l = getLesson(id);
  return { title: l ? `Ders ${l.no}: ${l.title} | AG CYBER LAB Modül 06` : "Ders bulunamadı" };
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getLesson(id)) notFound();
  return <LessonView key={id} id={id} />;
}
