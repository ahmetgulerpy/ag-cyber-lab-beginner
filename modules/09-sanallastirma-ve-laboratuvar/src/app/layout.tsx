import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "AG Cyber Lab – Modül 09: Sanallaştırma ve Laboratuvar",
  description:
    "Sanallaştırmayı öğren, VirtualBox veya VMware ile sanal makine kur, Kali Linux ve Ubuntu'yu yükle, güvenli bir siber güvenlik laboratuvarı hazırla.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#176B87",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className="flex min-h-screen flex-col bg-ag-bg text-ag-text antialiased">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
