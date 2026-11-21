import Link from "next/link";
import { LINKS } from "@/content/lessons";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ag-brand text-sm font-black tracking-tight text-white">AG</span>
      <span className="leading-tight">
        <span className={`block text-sm font-extrabold tracking-[0.18em] ${light ? "text-white" : "text-ag-text"}`}>AG CYBER LAB</span>
        <span className={`block text-[10px] font-semibold tracking-[0.2em] ${light ? "text-ag-light" : "text-ag-muted"}`}>LEARN • PRACTICE • SECURE</span>
      </span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-ag-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/" aria-label="AG Cyber Lab – Modül 09 ana sayfa">
          <Logo />
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm font-semibold text-ag-muted">
          <span className="chip mr-1 hidden sm:inline-flex">MODÜL 09</span>
          <Link className="rounded-lg px-3 py-1.5 hover:bg-ag-light hover:text-ag-brand" href="/">
            Panel
          </Link>
          <Link className="rounded-lg px-3 py-1.5 hover:bg-ag-light hover:text-ag-brand" href="/donanim">
            Donanım Rehberi
          </Link>
          <Link className="rounded-lg px-3 py-1.5 hover:bg-ag-light hover:text-ag-brand" href="/final">
            Final Sınavı
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-10 bg-[#12303f] text-ag-light">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-[1.2fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-3 max-w-md text-xs leading-relaxed text-[#b9d3dd]">
            Modül 09 – Sanallaştırma ve Laboratuvar. Bu platform rehber ve simülasyon ağırlıklı bir eğitim ortamıdır; gerçek kurulumları kendi bilgisayarında kendin yaparsın. Yalnızca kendi laboratuvarında ve yetkin olduğun sistemlerde test yap.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="text-xs font-bold tracking-[0.2em] text-ag-accent">BİZİ TAKİP ET</p>
          <p>
            Instagram:{" "}
            <a className="font-semibold underline underline-offset-2 hover:text-white" href={LINKS.instagram} target="_blank" rel="noopener noreferrer">
              instagram.com/agcyberlab
            </a>
          </p>
          <p>
            Kurucu:{" "}
            <a className="font-semibold underline underline-offset-2 hover:text-white" href={LINKS.founder} target="_blank" rel="noopener noreferrer">
              instagram.com/ahmetgulerpy
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-3 text-center text-[11px] font-semibold tracking-[0.25em] text-[#8fb3c1]">AG CYBER LAB • LEARN • PRACTICE • SECURE</div>
    </footer>
  );
}
