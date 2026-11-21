import type { Metadata } from "next";
import { LessonGrid } from "@/components/LessonGrid";

export const metadata: Metadata = { title: "Dersler – AG Cyber Lab Modül 08" };

export default function LessonsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-extrabold">13 Ders</h1>
        <p className="mt-1 text-sm text-muted">Her ders: görsel anlatım → laboratuvar → görev → mini test → özet.</p>
      </div>
      <LessonGrid />
    </div>
  );
}
