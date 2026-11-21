"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { LESSONS, MODULE } from "@/data/lessons";
import { useProgress } from "@/lib/progress";
import { cx } from "@/components/ui";

function Brand({ small }: { small?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className={cx("grid place-items-center rounded-lg bg-brand font-bold tracking-tight text-white", small ? "h-8 w-8 text-sm" : "h-9 w-9 text-sm")}>AG</span>
      <span className="leading-tight">
        <span className="block text-sm font-bold tracking-[0.14em] text-ink">AG CYBER LAB</span>
        <span className="block text-[10px] font-medium uppercase tracking-[0.12em] text-accent">MODÜL {MODULE.no}</span>
      </span>
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  const { lessonStatus, data, stats } = useProgress();
  const item = (href: string, label: ReactNode, active: boolean, right?: ReactNode) => (
    <Link key={href} href={href} onClick={onNavigate} className={cx("flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors", active ? "bg-brand text-white" : "text-ink hover:bg-soft")}>
      {label}
      <span className="ml-auto">{right}</span>
    </Link>
  );
  return (
    <nav aria-label="Ders navigasyonu" className="space-y-1">
      {item("/", <span>🏠 Ana Sayfa · İlerleme</span>, path === "/")}
      <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{MODULE.group}</p>
      {LESSONS.map((l) => {
        const href = `/ders/${l.id}`;
        const active = path === href;
        const done = lessonStatus(l.id).done;
        return item(
          href,
          <>
            <span className={cx("grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold", active ? "bg-white/20 text-white" : done ? "bg-ok text-white" : "bg-soft text-brand")}>{done ? "✓" : String(l.id).padStart(2, "0")}</span>
            <span className="leading-tight">{l.title}</span>
          </>,
          active,
        );
      })}
      <div className="my-3 border-t border-line" />
      {item("/sinav", <span>📝 Genel Sınav (20 soru)</span>, path === "/sinav", data.exam ? <span className={cx("text-xs", path === "/sinav" ? "text-white" : "text-ok")}>%{Math.round((data.exam.score / data.exam.total) * 100)}</span> : null)}
      {item("/tamamlandi", <span>🏁 Modül Tamamlama</span>, path === "/tamamlandi", stats.lessonsDone === stats.totalLessons ? <span className={path === "/tamamlandi" ? "text-white" : "text-ok"}>✓</span> : null)}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const { stats, ready } = useProgress();

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0 });
  }, [path]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-3 px-4">
          <button type="button" aria-label="Menüyü aç" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="grid h-10 w-10 place-items-center rounded-lg border border-line text-ink lg:hidden">
            <span className="text-lg">{open ? "✕" : "☰"}</span>
          </button>
          <Brand />
          <div className="mx-auto hidden min-w-0 text-center md:block">
            <p className="truncate text-sm font-semibold text-ink">
              MODÜL {MODULE.no} · {MODULE.name}
            </p>
            <p className="truncate text-xs text-muted">{MODULE.program}</p>
          </div>
          <div className="ml-auto flex w-32 shrink-0 flex-col gap-1 sm:w-48" aria-label="Eğitim ilerlemesi">
            <div className="flex justify-between text-[11px] text-muted">
              <span>İlerleme</span>
              <span className="font-semibold text-ink">%{ready ? stats.percent : 0}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-gradient-to-r from-brand to-accent transition-all" style={{ width: `${ready ? stats.percent : 0}%` }} />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1500px] flex-1">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 overflow-y-auto border-r border-line bg-white p-4 lg:block">
          <NavLinks />
        </aside>
        {open && (
          <div className="fixed inset-0 top-16 z-30 lg:hidden">
            <button type="button" aria-label="Menüyü kapat" className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-[85%] max-w-xs overflow-y-auto bg-white p-4 shadow-xl">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </div>
        )}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">{children}</main>
      </div>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Brand small />
            <p className="mt-2 text-xs font-semibold tracking-[0.2em] text-accent">LEARN • PRACTICE • SECURE</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a href="https://www.instagram.com/agcyberlab/" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
              Instagram: @agcyberlab
            </a>
            <a href="https://www.instagram.com/ahmetgulerpy/" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
              Founder: @ahmetgulerpy
            </a>
          </div>
        </div>
        <p className="border-t border-line px-4 py-3 text-center text-[11px] text-muted">Eğitim amaçlıdır. Tüm uygulamalar tarayıcında yerel çalışır; girdiğin hiçbir veri sunucuya gönderilmez.</p>
      </footer>
    </div>
  );
}
