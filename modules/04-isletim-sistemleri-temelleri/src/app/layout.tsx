import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Brand from "@/components/Brand";
import "./globals.css";

export const metadata: Metadata = {
  title: "AG CYBER LAB — Modül 04: İşletim Sistemleri Temelleri",
  description:
    "Sıfırdan Siber Güvenlik Eğitim Programı — Modül 04: İşletim Sistemleri Temelleri. Etkileşimli sanal laboratuvarlar, mini testler ve final sınavı.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-bg text-ink">
        <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3">
            <Brand />
            <nav className="flex items-center gap-1 text-sm font-semibold text-muted">
              <Link className="rounded-lg px-3 py-2 hover:bg-soft hover:text-brand" href="/">Panel</Link>
              <Link className="rounded-lg px-3 py-2 hover:bg-soft hover:text-brand" href="/#dersler">Dersler</Link>
              <Link className="rounded-lg px-3 py-2 hover:bg-soft hover:text-brand" href="/#laboratuvarlar">Laboratuvarlar</Link>
              <Link className="rounded-lg px-3 py-2 hover:bg-soft hover:text-brand" href="/final">Final</Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="mt-16 border-t border-line bg-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-3">
            <div>
              <Brand />
              <p className="mt-3 text-sm text-muted">Sıfırdan Siber Güvenlik Eğitim Programı — Modül 04: İşletim Sistemleri Temelleri.</p>
            </div>
            <div className="text-sm">
              <p className="font-bold text-ink">Bağlantılar</p>
              <ul className="mt-2 space-y-1 text-muted">
                <li><a className="hover:text-brand" href="https://www.instagram.com/agcyberlab/" target="_blank" rel="noopener noreferrer">Instagram: @agcyberlab</a></li>
                <li><a className="hover:text-brand" href="https://www.instagram.com/ahmetgulerpy/" target="_blank" rel="noopener noreferrer">Kurucu: @ahmetgulerpy</a></li>
              </ul>
            </div>
            <div className="text-sm text-muted">
              <p className="font-bold text-ink">Güvenli eğitim ortamı</p>
              <p className="mt-2">Bu platformdaki tüm terminaller ve masaüstleri tarayıcı içinde çalışan <b>eğitim simülasyonlarıdır</b>. Gerçek işletim sistemine komut gönderilmez, gerçek dosyalara dokunulmaz. İlerlemen yalnızca bu tarayıcıda (localStorage) saklanır.</p>
            </div>
          </div>
          <div className="border-t border-line py-3 text-center text-xs text-muted">© AG CYBER LAB — LEARN • PRACTICE • SECURE</div>
        </footer>
      </body>
    </html>
  );
}
