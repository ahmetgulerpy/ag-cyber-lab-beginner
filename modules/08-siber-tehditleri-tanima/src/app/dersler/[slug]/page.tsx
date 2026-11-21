import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonView } from "@/components/LessonView";
import { getLesson, getLessonByNo, lessons } from "@/data/lessons";

export function generateStaticParams() {
  return lessons.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = getLesson(slug);
  return { title: l ? `${l.no}. ${l.title} – AG Cyber Lab` : "Ders bulunamadı" };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  return <LessonView lesson={lesson} prev={getLessonByNo(lesson.no - 1)} next={getLessonByNo(lesson.no + 1)} />;
}
