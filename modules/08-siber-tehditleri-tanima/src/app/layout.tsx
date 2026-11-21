import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Footer, Header } from "@/components/Chrome";

export const metadata: Metadata = {
  title: "AG Cyber Lab – Modül 08: Siber Tehditleri Tanıma",
  description: "Etkileşimli siber güvenlik eğitimi ve sanal laboratuvar: zararlı yazılımlar, kimlik avı, DDoS, MITM ve daha fazlası.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-page text-ink antialiased">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
