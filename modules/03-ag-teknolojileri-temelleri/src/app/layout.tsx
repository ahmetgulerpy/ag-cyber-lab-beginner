import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Brand } from "@/components/Brand";
import "./globals.css";

export const metadata: Metadata = {
  title: "AG CYBER LAB | Modül 03 – Ağ Teknolojileri Temelleri",
  description:
    "Sıfırdan Siber Güvenlik Eğitim Programı – Modül 03: Ağ Teknolojileri Temelleri. 16 ders, etkileşimli sanal laboratuvarlar, mini testler ve final sınavı.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen antialiased">
        <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
            <Link href="/" aria-label="AG CYBER LAB ana panel">
              <Brand />
            </Link>
            <nav className="flex items-center gap-1 text-sm font-medium">
              <Link href="/" className="rounded-lg px-3 py-2 text-ink hover:bg-soft">
                Panel
              </Link>
              <Link href="/#dersler" className="rounded-lg px-3 py-2 text-ink hover:bg-soft">
                Dersler
              </Link>
              <Link href="/#laboratuvarlar" className="hidden rounded-lg px-3 py-2 text-ink hover:bg-soft sm:block">
                Laboratuvarlar
              </Link>
              <Link href="/final" className="rounded-lg bg-brand px-3 py-2 text-white hover:bg-brand-dark">
                Final Sınavı
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-16 border-t border-line bg-white">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
            <div>
              <Brand />
              <p className="mt-3 text-sm text-muted">
                Sıfırdan Siber Güvenlik Eğitim Programı · Modül 03 · Ağ Teknolojileri Temelleri. Tüm laboratuvarlar tarayıcı içinde, yerel ve güvenli simülasyon olarak çalışır.
              </p>
            </div>
            <div className="text-sm">
              <p className="font-semibold text-ink">Bağlantılar</p>
              <ul className="mt-2 space-y-1 text-brand">
                <li>
                  <a href="https://www.instagram.com/agcyberlab/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Instagram · @agcyberlab
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/ahmetgulerpy/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Kurucu · @ahmetgulerpy
                  </a>
                </li>
              </ul>
            </div>
            <div className="text-sm text-muted">
              <p className="font-semibold text-ink">Gizlilik</p>
              <p className="mt-2">İlerlemeniz yalnızca bu tarayıcının localStorage alanında saklanır. Hiçbir veri dışarı gönderilmez.</p>
            </div>
          </div>
          <div className="border-t border-line py-4 text-center text-xs text-muted">© AG CYBER LAB · LEARN • PRACTICE • SECURE</div>
        </footer>
      </body>
    </html>
  );
}
