import Link from "next/link";

export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label="AG Cyber Lab logosu">
      <rect x="1" y="1" width="38" height="38" rx="9" fill="#176B87" />
      <path d="M20 7.5 31 11.8v8.2c0 6.2-4.3 10.6-11 12.5C13.3 30.6 9 26.2 9 20v-8.2L20 7.5Z" fill="none" stroke="#E8F3F7" strokeWidth="1.6" />
      <text x="20" y="24.6" textAnchor="middle" fontFamily="ui-monospace, Menlo, Consolas, monospace" fontSize="10.5" fontWeight="700" fill="#FFFFFF">
        AG
      </text>
      <circle cx="31.5" cy="8.5" r="2.4" fill="#38A3A5" />
    </svg>
  );
}

export function BrandLogo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="AG Cyber Lab ana sayfa">
      <LogoMark />
      <span className="leading-tight">
        <span className={`block text-[15px] font-bold tracking-[0.08em] ${light ? "text-white" : "text-ink"}`}>
          AG CYBER LAB
        </span>
        <span className={`block text-[11px] tracking-wide ${light ? "text-slate-300" : "text-muted"}`}>
          Learn. Practice. Secure.
        </span>
      </span>
    </Link>
  );
}
