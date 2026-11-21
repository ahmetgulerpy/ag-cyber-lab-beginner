import type { Metadata } from "next";
import type { ReactNode } from "react";
import AppShell from "@/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "AG CYBER LAB – Modül 05: Programlama ve Scripting Temelleri",
  description:
    "Sıfırdan Siber Güvenlik Eğitim Programı – Modül 05. Programlama, algoritma, Python, Bash, PowerShell, JSON/XML ve Regex temelleri; etkileşimli laboratuvarlarla.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
