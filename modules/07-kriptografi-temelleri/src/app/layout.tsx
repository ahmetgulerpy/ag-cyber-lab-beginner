import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import { ProgressProvider } from "@/lib/progress";
import "./globals.css";

export const metadata: Metadata = {
  title: "AG CYBER LAB – Modül 07: Kriptografi Temelleri",
  description: "Sıfırdan Siber Güvenlik Eğitim Programı – Kriptografi Temelleri: uygulamalı, etkileşimli eğitim platformu.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#176B87" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <ProgressProvider>
          <AppShell>{children}</AppShell>
        </ProgressProvider>
      </body>
    </html>
  );
}
