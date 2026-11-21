"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex flex-col leading-none">
      <span className={`text-lg font-extrabold tracking-[0.14em] ${light ? "text-white" : "text-brand"}`}>
        AG <span className={light ? "text-[#8fe0e1]" : "text-accent"}>CYBER</span> LAB
      </span>
    </span>
  );
}

const links = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/dersler", label: "Dersler" },
  { href: "/sinav", label: "Genel Sınav" },
];

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3" aria-label="AG Cyber Lab ana sayfa">
          <Logo />
          <span className="hidden rounded-full bg-soft px-2.5 py-0.5 text-[11px] font-semibold text-brand sm:inline">MODÜL 08</span>
        </Link>
        <nav className="hidden items-center gap-1 sm:flex" aria-label="Ana menü">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                active(l.href) ? "bg-soft text-brand" : "text-muted hover:text-brand"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-brand sm:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Menüyü aç/kapat"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>
      {open && (
        <nav className="border-t border-line bg-white px-4 py-2 sm:hidden" aria-label="Mobil menü">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-2.5 text-sm font-semibold ${active(l.href) ? "bg-soft text-brand" : "text-muted"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-2">
        <div>
          <Logo light />
          <p className="mt-2 text-sm font-semibold tracking-[0.2em] text-[#8fe0e1]">LEARN • PRACTICE • SECURE</p>
          <p className="mt-3 max-w-md text-xs leading-relaxed text-white/60">
            Bu modül eğitim amaçlıdır. Tüm laboratuvarlar tarayıcı içinde çalışan, sentetik verilerle hazırlanmış güvenli simülasyonlardır. Gerçek sistemlere,
            hesaplara veya ağlara müdahale edilmez.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm sm:items-end">
          <a className="text-white/85 underline-offset-4 hover:text-[#8fe0e1] hover:underline" href="https://www.instagram.com/agcyberlab/" target="_blank" rel="noopener noreferrer">
            Instagram: @agcyberlab
          </a>
          <a className="text-white/85 underline-offset-4 hover:text-[#8fe0e1] hover:underline" href="https://www.instagram.com/ahmetgulerpy/" target="_blank" rel="noopener noreferrer">
            Kurucu: @ahmetgulerpy
          </a>
          <p className="mt-2 text-xs text-white/50">© AG Cyber Lab – Modül 08: Siber Tehditleri Tanıma</p>
        </div>
      </div>
    </footer>
  );
}
