import type { Metadata } from "next";
import { FinalExam } from "@/components/FinalExam";

export const metadata: Metadata = { title: "Final Sınavı – AG Cyber Lab Modül 09" };

export default function FinalPage() {
  return <FinalExam />;
}
