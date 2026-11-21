"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { CURRICULUM, MODULE_NO, MODULE_TITLE, pad } from "@/data/curriculum";
import { TOTAL_LESSONS, useProgress } from "@/lib/storage";
import { ProgressBar } from "./ui";

function NavLink({
  href,
  active,
  children,
  onClick,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
        active ? "bg-soft font-semibold text-brand" : "text-ink hover:bg-slate-50"
      }`}
    >
      {children}
    </Link>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { progress, percent } = useProgress();
  const close = () => setOpen(false);
  const moduleDone = progress.completed.length >= TOTAL_LESSONS;

  const nav = (
    <nav className="space-y-0.5 p-3" aria-label="Modül navigasyonu">
      <NavLink href="/" active={pathname === "/"} onClick={close}>
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/10 text-xs text-brand">◧</span>
        İlerleme Paneli
      </NavLink>
      <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-muted">
        E. Programlama ve Scripting Temelleri
      </p>
      {CURRICULUM.map((l) => {
        const done = progress.completed.includes(l.id);
        return (
          <NavLink key={l.id} href={`/ders/${l.id}`} active={pathname === `/ders/${l.id}`} onClick={close}>
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold ${
                done ? "bg-ok text-white" : "bg-slate-100 text-muted"
              }`}
            >
              {done ? "✓" : pad(l.id)}
            </span>
            <span className="leading-tight">{l.title}</span>
          </NavLink>
        );
      })}
      <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-muted">
        Değerlendirme
      </p>
      <NavLink href="/sinav" active={pathname === "/sinav"} onClick={close}>
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-md text-xs ${
            progress.exam ? "bg-ok text-white" : "bg-slate-100 text-muted"
          }`}
        >
          {progress.exam ? "✓" : "?"}
        </span>
        Genel Sınav (20 soru)
      </NavLink>
      <NavLink href="/tamamlama" active={pathname === "/tamamlama"} onClick={close}>
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-md text-xs ${
            moduleDone ? "bg-ok text-white" : "bg-slate-100 text-muted"
          }`}
        >
          {moduleDone ? "★" : "🔒"}
        </span>
        Modül Tamamlama
      </NavLink>
    </nav>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
        <div className="flex h-16 items-center gap-3 px-4">
          <button
            type="button"
            aria-label="Menüyü aç"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-lg lg:hidden"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>
          <Link href="/" className="flex items-center gap-2.5" onClick={close}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand font-mono text-sm font-bold text-white">
              AG
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold tracking-wide text-ink">AG CYBER LAB</span>
              <span className="block text-[10px] tracking-[0.18em] text-muted">LEARN • PRACTICE • SECURE</span>
            </span>
          </Link>
          <div className="mx-4 hidden min-w-0 flex-1 border-l border-line pl-4 md:block">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">Modül {MODULE_NO}</p>
            <p className="truncate text-sm font-semibold">{MODULE_TITLE}</p>
          </div>
          <div className="ml-auto flex w-28 flex-col gap-1 sm:w-48">
            <div className="flex justify-between text-[11px] text-muted">
              <span className="hidden sm:inline">Modül tamamlanma</span>
              <span className="sm:hidden">İlerleme</span>
              <span className="font-semibold text-brand">%{percent}</span>
            </div>
            <ProgressBar value={percent} />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="scroll-thin sticky top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 overflow-y-auto border-r border-line bg-white lg:block">
          {nav}
        </aside>

        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-[#172b3a]/40" onClick={close} />
            <div className="scroll-thin absolute inset-y-0 left-0 w-[85%] max-w-xs overflow-y-auto bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <span className="text-sm font-bold">Modül {MODULE_NO} · İçerik</span>
                <button type="button" aria-label="Menüyü kapat" className="rounded-lg px-2 py-1 text-lg" onClick={close}>
                  ✕
                </button>
              </div>
              {nav}
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
          <footer className="border-t border-line bg-white">
            <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <div>
                <p className="font-bold tracking-wide">AG CYBER LAB</p>
                <p className="text-xs tracking-[0.18em] text-muted">LEARN • PRACTICE • SECURE</p>
              </div>
              <div className="flex flex-col gap-1 text-sm sm:items-end">
                <a
                  href="https://www.instagram.com/agcyberlab/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand hover:underline"
                >
                  Instagram: instagram.com/agcyberlab
                </a>
                <a
                  href="https://www.instagram.com/ahmetgulerpy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand hover:underline"
                >
                  Founder: instagram.com/ahmetgulerpy
                </a>
              </div>
            </div>
            <p className="border-t border-line px-4 py-3 text-center text-[11px] text-muted">
              Modül {MODULE_NO} · {MODULE_TITLE} · Tüm laboratuvarlar tarayıcı içinde çalışan güvenli simülasyonlardır.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
