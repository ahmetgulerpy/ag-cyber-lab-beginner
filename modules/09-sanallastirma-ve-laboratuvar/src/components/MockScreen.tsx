import type { ReactNode } from "react";
import type { Block, Screen } from "@/content/types";

function Mark({ n }: { n: number }) {
  return (
    <span className="absolute -right-2 -top-2.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-ag-warn text-[11px] font-black text-white shadow" aria-label={`İşaret ${n}`}>
      {n}
    </span>
  );
}

function Hl({ hl, children, className = "" }: { hl?: number; children: ReactNode; className?: string }) {
  if (!hl) return <div className={className}>{children}</div>;
  return (
    <div className={`relative rounded-md outline outline-2 outline-offset-2 outline-ag-warn ${className}`}>
      {children}
      <Mark n={hl} />
    </div>
  );
}

function renderBlock(b: Block, key: number, dark: boolean): ReactNode {
  switch (b.t) {
    case "text":
      return (
        <Hl key={key} hl={b.hl}>
          <p className={`text-sm ${b.muted ? "text-ag-muted" : dark ? "text-[#d4e6ee]" : "text-ag-text"} ${b.bold ? "font-bold" : ""}`}>{b.v}</p>
        </Hl>
      );
    case "btn":
      return (
        <Hl key={key} hl={b.hl} className="inline-block">
          <span className={`inline-block rounded-md border px-3 py-1.5 text-xs font-semibold ${b.disabled ? "border-ag-line bg-slate-100 text-slate-400" : b.primary ? "border-ag-brand bg-ag-brand text-white" : "border-ag-line bg-white text-ag-text"}`}>{b.v}</span>
        </Hl>
      );
    case "field":
      return (
        <Hl key={key} hl={b.hl}>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-28 shrink-0 text-ag-muted sm:w-36">{b.label}</span>
            <span className="flex-1 truncate rounded border border-ag-line bg-white px-2 py-1.5 font-mono text-ag-text">{b.v}</span>
          </div>
        </Hl>
      );
    case "select":
      return (
        <Hl key={key} hl={b.hl}>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-28 shrink-0 text-ag-muted sm:w-36">{b.label}</span>
            <span className="flex flex-1 items-center justify-between rounded border border-ag-line bg-white px-2 py-1.5 text-ag-text">
              <span className="truncate">{b.v}</span>
              <span className="text-ag-muted">▾</span>
            </span>
          </div>
        </Hl>
      );
    case "check":
      return (
        <Hl key={key} hl={b.hl} className="inline-block">
          <div className="flex items-center gap-2 text-xs text-ag-text">
            <span className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] text-white ${b.on ? "border-ag-brand bg-ag-brand" : "border-ag-muted bg-white"}`}>{b.on ? "✓" : ""}</span>
            {b.v}
          </div>
        </Hl>
      );
    case "list":
      return (
        <div key={key} className="overflow-hidden rounded-md border border-ag-line bg-white text-xs">
          {b.items.map((it, i) => (
            <Hl key={i} hl={it.hl}>
              <div className={`flex items-center justify-between px-3 py-2 ${it.sel ? "bg-ag-light font-semibold text-ag-brand" : "text-ag-text"} ${i > 0 ? "border-t border-ag-line" : ""}`}>
                <span>{it.v}</span>
                {it.sub && <span className="font-normal text-ag-muted">{it.sub}</span>}
              </div>
            </Hl>
          ))}
        </div>
      );
    case "progress":
      return (
        <div key={key} className="text-xs text-ag-muted">
          {b.label && <p className="mb-1">{b.label}</p>}
          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-ag-accent" style={{ width: `${b.v}%` }} />
          </div>
        </div>
      );
    case "term":
      return (
        <Hl key={key} hl={b.hl}>
          <pre className="overflow-x-auto rounded-md bg-[#0f2230] p-3 font-mono text-xs leading-relaxed text-[#cfe7ef]">{b.lines.join("\n")}</pre>
        </Hl>
      );
    case "row":
      return (
        <div key={key} className="flex flex-wrap items-center gap-2">
          {b.items.map((x, i) => renderBlock(x, i, dark))}
        </div>
      );
    case "slider":
      return (
        <Hl key={key} hl={b.hl}>
          <div className="text-xs">
            <div className="mb-1 flex justify-between text-ag-muted">
              <span>{b.label}</span>
              <span className="font-mono font-semibold text-ag-text">{b.v}</span>
            </div>
            <div className="relative h-1.5 rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-ag-brand" style={{ width: `${b.pct}%` }} />
              <div className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-ag-brand bg-white" style={{ left: `calc(${b.pct}% - 8px)` }} />
            </div>
          </div>
        </Hl>
      );
    case "tabs":
      return (
        <Hl key={key} hl={b.hl}>
          <div className="flex flex-wrap gap-1 border-b border-ag-line text-xs">
            {b.items.map((t, i) => (
              <span key={t} className={`px-3 py-1.5 ${i === b.active ? "border-b-2 border-ag-brand font-bold text-ag-brand" : "text-ag-muted"}`}>
                {t}
              </span>
            ))}
          </div>
        </Hl>
      );
    case "warn":
      return (
        <div key={key} className="rounded-md border border-ag-warn bg-[#fff8e8] px-3 py-2 text-xs text-[#8a5f12]">
          ⚠ {b.v}
        </div>
      );
  }
}

export function MockScreen({ s, compact = false }: { s: Screen; compact?: boolean }) {
  const dark = s.kind === "term";
  const marks = s.marks ? Object.entries(s.marks) : [];
  return (
    <figure className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-ag-line bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-ag-line bg-[#eef3f6] px-3 py-2">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-[#e0a3a3]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#e6cf98]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#a8d3b9]" />
          </span>
          <span className="truncate text-xs font-semibold text-ag-muted">{s.title}</span>
        </div>
        {s.url && (
          <div className="border-b border-ag-line bg-white px-3 py-1.5">
            <span className="block truncate rounded-full bg-ag-bg px-3 py-1 font-mono text-[11px] text-ag-muted">🔒 {s.url}</span>
          </div>
        )}
        <div className="flex">
          {s.sidebar && (
            <aside className="hidden w-32 shrink-0 space-y-1 border-r border-ag-line bg-ag-bg p-2 text-[11px] text-ag-muted sm:block">
              {s.sidebar.map((x, i) => (
                <p key={x} className={`rounded px-2 py-1 ${i === 0 ? "bg-ag-light font-semibold text-ag-brand" : ""}`}>
                  {x}
                </p>
              ))}
            </aside>
          )}
          <div className={`min-w-0 flex-1 space-y-3 ${compact ? "p-3" : "p-4"} ${dark ? "bg-[#12303f]" : "bg-white"}`}>{s.blocks.map((b, i) => renderBlock(b, i, dark))}</div>
        </div>
      </div>
      {marks.length > 0 && (
        <ol className="space-y-1.5 text-sm">
          {marks.map(([n, text]) => (
            <li key={n} className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ag-warn text-[11px] font-black text-white">{n}</span>
              <span className="text-ag-text">{text}</span>
            </li>
          ))}
        </ol>
      )}
      <figcaption className="text-[11px] italic text-ag-muted">Temsili arayüz şemasıdır; gerçek ekran görüntüsü değildir. Kullandığın sürümde yazılar ve yerleşim biraz farklı olabilir.</figcaption>
    </figure>
  );
}
