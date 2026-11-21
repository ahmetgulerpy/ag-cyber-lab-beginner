import type { Metadata } from "next";
import { ExamView } from "@/components/ExamView";

export const metadata: Metadata = { title: "Genel Değerlendirme Sınavı – AG Cyber Lab" };

export default function ExamPage() {
  return <ExamView />;
}
