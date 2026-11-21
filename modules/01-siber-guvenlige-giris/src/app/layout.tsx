import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: {
    default: "AG Cyber Lab — Sanal Eğitim Laboratuvarı",
    template: "%s · AG Cyber Lab",
  },
  description:
    "AG Cyber Lab: Learn. Practice. Secure. Siber güvenliği uygulamalı, etkileşimli ve adım adım öğrenebileceğin bağımsız eğitim platformu.",
};

export const viewport: Viewport = {
  themeColor: "#176B87",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
