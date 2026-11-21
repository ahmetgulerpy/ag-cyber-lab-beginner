import type { Metadata } from "next";
import ExamView from "@/components/ExamView";

export const metadata: Metadata = { title: "Genel Sınav | AG CYBER LAB Modül 06" };

export default function ExamPage() {
  return <ExamView />;
}
