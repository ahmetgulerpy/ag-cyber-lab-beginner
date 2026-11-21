"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { LESSONS } from "@/data/lessons";
import { useProgress } from "@/lib/progress";

function Brand({ small = false }: { small?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-sm font-extrabold text-white">AG</span>
      <span className="leading-tight">
        <span className={`block font-extrabold tracking-wide text-ink ${small ? "text-sm" : "text-base"}`}>AG CYBER LAB</span>
        <span className="block text-[10px] font-semibold tracking-[0.18em] text-accent">LEARN • PRACTICE • SECURE</span>
      </span>
    </Link>
  );
}

function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  const { p, ready } = useProgress();
  const link = (href: string, label: string, extra?: ReactNode) => {
    const active = path === href;
    return (
      <Link
        key={href}
        href={href}
        onClick={onNavigate}
        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
          active ? "bg-brand font-semibold text-white" : "text-ink hover:bg-soft"
        }`}
      >
        {extra}
        <span className="flex-1">{label}</span>
      </Link>
    );
  };
  return (
    <nav className="flex flex-col gap-1">
      {link("/", "Eğitim Paneli")}
      <p className="label-mini mb-1 mt-4 px-3 leading-snug">F. Siber Güvenlik Temel Kavramları</p>
      {LESSONS.map((l) => {
        const done = ready && !!p.completed[l.id];
        const href = `/ders/${l.id}`;
        const active = path === href;
        return (
          <Link
            key={l.id}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition ${
              active ? "bg-brand font-semibold text-white" : "text-ink hover:bg-soft"
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                done ? "bg-ok text-white" : active ? "bg-white/25 text-white" : "bg-soft text-brand"
              }`}
            >
              {done ? "✓" : l.no}
            </span>
            <span className="flex-1 leading-snug">{l.title}</span>
          </Link>
        );
      })}
      <p className="label-mini mb-1 mt-4 px-3">Değerlendirme</p>
      {link("/sinav", "Genel Sınav (20 soru)")}
      {link("/tamamlandi", "Modül Tamamlama")}
    </nav>
  );
}

export default function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { p, ready } = useProgress();
  const done = ready ? Object.keys(p.completed).length : 0;
  const pct = Math.round((done / LESSONS.length) * 100);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
          <button
            aria-label="Menüyü aç"
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-line text-lg lg:hidden"
          >
            ☰
          </button>
          <div className="lg:w-[272px]">
            <Brand small />
          </div>
          <div className="hidden min-w-0 flex-1 md:block">
            <p className="truncate text-sm font-bold text-ink">
              <span className="mr-2 rounded-md bg-soft px-2 py-0.5 text-xs text-brand">MODÜL 06</span>
              Siber Güvenlik Temel Kavramları
            </p>
            <p className="text-xs text-muted">Sıfırdan Siber Güvenlik Eğitim Programı · Başlangıç seviyesi</p>
          </div>
          <div className="ml-auto flex w-36 flex-col gap-1 sm:w-52">
            <div className="flex justify-between text-xs font-semibold text-ink">
              <span>İlerleme</span>
              <span>
                {done}/{LESSONS.length} · %{pct}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-soft">
              <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="sticky top-[65px] hidden h-[calc(100vh-65px)] w-[300px] shrink-0 overflow-y-auto border-r border-line bg-white p-4 lg:block">
          <Nav />
        </aside>

        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto bg-white p-4 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <Brand />
                <button aria-label="Menüyü kapat" onClick={() => setOpen(false)} className="h-9 w-9 cursor-pointer rounded-lg border border-line">
                  ✕
                </button>
              </div>
              <Nav onNavigate={() => setOpen(false)} />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-extrabold tracking-wide text-ink">AG CYBER LAB</p>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-accent">LEARN • PRACTICE • SECURE</p>
          </div>
          <div className="flex flex-col gap-1 text-sm text-muted sm:items-end">
            <a className="hover:text-brand" href="https://www.instagram.com/agcyberlab/" target="_blank" rel="noopener noreferrer">
              Instagram: instagram.com/agcyberlab
            </a>
            <a className="hover:text-brand" href="https://www.instagram.com/ahmetgulerpy/" target="_blank" rel="noopener noreferrer">
              Founder: instagram.com/ahmetgulerpy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
