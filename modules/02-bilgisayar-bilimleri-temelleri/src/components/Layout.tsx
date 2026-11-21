import type { ReactNode } from "react";
import { LayoutDashboard, BookOpen, FlaskConical, ClipboardCheck, BarChart3, ExternalLink } from "lucide-react";
import { cn } from "../utils/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <a href="#/" className={cn("flex items-baseline gap-1.5 leading-none", className)} aria-label="AG Cyber Lab — Genel Bakış">
      <span className="rounded bg-brand px-1.5 py-1 text-base font-extrabold tracking-tight text-white">AG</span>
      <span className="text-base font-bold tracking-[0.18em] text-ink">CYBER LAB</span>
    </a>
  );
}

const nav = [
  { key: "overview", label: "Genel Bakış", href: "#/", icon: LayoutDashboard },
  { key: "lessons", label: "Dersler", href: "#/lessons", icon: BookOpen },
  { key: "labs", label: "Uygulamalar", href: "#/labs", icon: FlaskConical },
  { key: "assessment", label: "Değerlendirme", href: "#/assessment", icon: ClipboardCheck },
  { key: "progress", label: "İlerlemem", href: "#/progress", icon: BarChart3 },
];

export function Header({ active, percent }: { active: string; percent: number }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="hidden rounded-full bg-soft px-2.5 py-0.5 text-xs font-semibold text-brand sm:inline">Modül 02</span>
        </div>
        <nav aria-label="Ana gezinme" className="hidden items-center gap-1 md:flex">
          {nav.map((n) => {
            const Icon = n.icon;
            return (
              <a
                key={n.key}
                href={n.href}
                aria-current={active === n.key ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active === n.key ? "bg-soft text-brand" : "text-muted hover:bg-page hover:text-ink"
                )}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </a>
            );
          })}
        </nav>
        <a href="#/progress" className="flex items-center gap-2 text-xs font-semibold text-muted" aria-label={`İlerleme yüzde ${percent}`}>
          <span className="hidden sm:inline">İlerleme</span>
          <span className="rounded-full bg-brand px-2.5 py-1 text-white">%{percent}</span>
        </a>
      </div>
      <nav aria-label="Mobil gezinme" className="scroll-thin flex gap-1 overflow-x-auto border-t border-line px-3 py-1.5 md:hidden">
        {nav.map((n) => {
          const Icon = n.icon;
          return (
            <a
              key={n.key}
              href={n.href}
              aria-current={active === n.key ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium",
                active === n.key ? "bg-soft text-brand" : "text-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {n.label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="text-lg font-extrabold tracking-[0.18em] text-ink">AG CYBER LAB</div>
          <div className="mt-0.5 text-sm font-semibold tracking-widest text-accent">LEARN • PRACTICE • SECURE</div>
          <p className="mt-3 max-w-md text-sm text-muted">
            AG Cyber Lab, siber güvenlik alanında teorik bilgiyi uygulamalı öğrenme deneyimiyle birleştirmeyi amaçlayan bağımsız bir eğitim ve araştırma platformudur.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <a href="https://www.instagram.com/agcyberlab/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-medium text-brand hover:underline">
            Instagram: @agcyberlab <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a href="https://www.instagram.com/ahmetgulerpy/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-medium text-brand hover:underline">
            Founder: @ahmetgulerpy <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <p className="pt-2 text-xs text-muted">Modül 02 — Bilgisayar Bilimleri Temelleri · Bağımsız çevrimdışı çalışabilen eğitim modülü. İlerleme yalnızca bu tarayıcıda (localStorage) saklanır.</p>
        </div>
      </div>
    </footer>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return <main className="fade-in mx-auto max-w-6xl px-4 pt-6 sm:pt-8">{children}</main>;
}
