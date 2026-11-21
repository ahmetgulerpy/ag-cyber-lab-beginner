"use client";

export type SeqMsg = {
  from: number;
  to: number;
  label: string;
  sub?: string;
  lost?: boolean;
  tone?: "brand" | "ok" | "warn" | "err";
};

const COLORS = { brand: "#176B87", ok: "#25845B", warn: "#D69A32", err: "#C65353" } as const;

/** Aktörler arası mesaj akışını gösteren sıra diyagramı. */
export function SeqDiagram({ actors, msgs, visible, width = 640, rowH = 56 }: { actors: string[]; msgs: SeqMsg[]; visible: number; width?: number; rowH?: number }) {
  const W = width;
  const pad = 80;
  const top = 58;
  const H = top + Math.max(1, msgs.length) * rowH + 8;
  const gap = actors.length > 1 ? (W - pad * 2) / (actors.length - 1) : 0;
  const x = (i: number) => (actors.length > 1 ? pad + gap * i : W / 2);
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-white">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: Math.min(W, 600) }} role="img" aria-label="Mesaj akış diyagramı">
        <defs>
          {(Object.keys(COLORS) as (keyof typeof COLORS)[]).map((k) => (
            <marker key={k} id={`seq-ah-${k}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" fill={COLORS[k]} />
            </marker>
          ))}
        </defs>
        {actors.map((a, i) => (
          <g key={a}>
            <line x1={x(i)} y1={44} x2={x(i)} y2={H - 4} stroke="#DFE8ED" strokeWidth={2} strokeDasharray="5 5" />
            <rect x={x(i) - 62} y={8} width={124} height={34} rx={10} fill="#E8F3F7" stroke="#176B87" strokeOpacity={0.35} />
            <text x={x(i)} y={30} textAnchor="middle" fontSize={13} fontWeight={700} fill="#172B3A">
              {a}
            </text>
          </g>
        ))}
        {msgs.map((m, i) => {
          if (i >= visible) return null;
          const y = top + i * rowH + 30;
          const c = COLORS[m.tone ?? "brand"];
          const cur = i === visible - 1;
          const x1 = x(m.from);
          const x2 = x(m.to);
          const mid = (x1 + x2) / 2;
          if (m.from === m.to) {
            return (
              <g key={i} opacity={cur ? 1 : 0.6}>
                <rect x={x1 + 10} y={y - 16} width={200} height={34} rx={8} fill="#fff" stroke={c} strokeWidth={cur ? 2.5 : 1.5} />
                <text x={x1 + 110} y={y - 1} textAnchor="middle" fontSize={12} fontWeight={700} fill={c}>
                  {m.label}
                </text>
                {m.sub && (
                  <text x={x1 + 110} y={y + 12} textAnchor="middle" fontSize={10} fill="#64748B">
                    {m.sub}
                  </text>
                )}
              </g>
            );
          }
          const endX = m.lost ? x1 + (x2 - x1) * 0.6 : x2;
          return (
            <g key={i} opacity={cur ? 1 : 0.6}>
              <line x1={x1} y1={y} x2={endX} y2={y} stroke={m.lost ? COLORS.err : c} strokeWidth={cur ? 3 : 2} strokeDasharray={m.lost ? "6 4" : undefined} markerEnd={m.lost ? undefined : `url(#seq-ah-${m.tone ?? "brand"})`} />
              {m.lost && (
                <text x={endX + (x2 > x1 ? 10 : -10)} y={y + 5} textAnchor="middle" fontSize={16} fontWeight={800} fill={COLORS.err}>
                  ✕
                </text>
              )}
              <text x={mid} y={y - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill={m.lost ? COLORS.err : c}>
                {m.label}
              </text>
              {m.sub && (
                <text x={mid} y={y + 15} textAnchor="middle" fontSize={10} fill="#64748B">
                  {m.sub}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
