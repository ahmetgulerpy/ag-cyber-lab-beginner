import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Shell from "@/components/Shell";

export const metadata: Metadata = {
  title: "AG CYBER LAB – Modül 06 | Siber Güvenlik Temel Kavramları",
  description:
    "Sıfırdan Siber Güvenlik Eğitim Programı – Modül 06: Siber Güvenlik Temel Kavramları. 12 ders, 12 interaktif laboratuvar, mini testler ve genel sınav.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className="antialiased">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
