import type { Metadata } from "next";
import { FinalExam } from "@/components/FinalExam";

export const metadata: Metadata = { title: "Final Sınavı | AG CYBER LAB – Modül 03" };

export default function FinalPage() {
  return <FinalExam />;
}
