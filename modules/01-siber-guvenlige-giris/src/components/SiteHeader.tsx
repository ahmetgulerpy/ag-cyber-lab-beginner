import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { HeaderProgress } from "./HeaderProgress";
import { getModuleSummary, primaryModule } from "@/content";

export function SiteHeader() {
  const base = `/modules/${primaryModule.slug}`;
  const links = [
    { href: "/", label: "Ana sayfa" },
    { href: base, label: "Müfredat" },
    { href: `${base}/final`, label: "Genel test" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <BrandLogo />
        <nav className="flex items-center gap-1 text-sm" aria-label="Ana gezinme">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-2.5 py-1.5 font-medium text-ink/80 hover:bg-soft hover:text-brand sm:px-3"
            >
              {l.label}
            </Link>
          ))}
          <HeaderProgress summary={getModuleSummary(primaryModule)} />
        </nav>
      </div>
    </header>
  );
}
