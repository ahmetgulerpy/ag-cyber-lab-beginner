"use client";
import { useEffect, useRef, useState } from "react";

export type Engine = { prompt(): string; run(line: string): { out: string; clear?: boolean } };
type Line = { k: "in" | "out"; prompt?: string; t: string };

export function useShell(make: () => Engine, banner: string, onCommand?: (line: string, out: string) => void) {
  const [eng] = useState(make);
  const [lines, setLines] = useState<Line[]>([{ k: "out", t: banner }]);
  const [tick, setTick] = useState(0);
  const run = (line: string) => {
    const p = eng.prompt();
    const r = eng.run(line);
    onCommand?.(line, r.out);
    setLines((prev) => (r.clear ? [] : [...prev, { k: "in" as const, prompt: p, t: line }, ...(r.out ? [{ k: "out" as const, t: r.out }] : [])].slice(-250)));
    setTick((x) => x + 1);
  };
  return { eng, lines, run, tick };
}

const ERR = /(command not found|Permission denied|No such file|not recognized|Operation not permitted|Cannot find|cannot |Access is denied|Directory not empty|Could not|could not|is dangerous|not in the sudoers|Is a directory|invalid|Not a directory|E: |syntax|is not recognized|duplicate|Access Denied|Request timed out|unreachable|100% loss|can't find)/;

function OutBlock({ t }: { t: string }) {
  return (
    <pre>
      {t.split("\n").map((l, i) => {
        const color = /^\[(Açıklama|İpucu)\]|^⚠|^\(Simülasyon/.test(l) ? "#8FD6D8" : ERR.test(l) ? "#F4A9A9" : undefined;
        return (
          <span key={i} style={color ? { color } : undefined}>
            {l}
            {"\n"}
          </span>
        );
      })}
    </pre>
  );
}

export default function Terminal({
  shell, title, height = 320, placeholder = "komut yaz ve Enter'a bas", onType, pending,
}: {
  shell: { eng: Engine; lines: Line[]; run: (l: string) => void; tick: number };
  title: string; height?: number; placeholder?: string; onType?: (v: string) => void; pending?: string;
}) {
  const [val, setVal] = useState("");
  const [past, setPast] = useState<string[]>([]);
  const [pos, setPos] = useState(-1);
  const box = useRef<HTMLDivElement>(null);
  const inp = useRef<HTMLInputElement>(null);

  useEffect(() => { if (box.current) box.current.scrollTop = box.current.scrollHeight; }, [shell.lines]);
  useEffect(() => { if (pending) { setVal(pending); onType?.(pending); inp.current?.focus({ preventScroll: true }); } }, [pending]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = () => {
    const v = val;
    if (v.trim()) setPast((p) => [...p, v]);
    shell.run(v);
    setVal(""); setPos(-1); onType?.("");
  };
  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!past.length) return;
      const n = pos < 0 ? past.length - 1 : Math.max(0, pos - 1);
      setPos(n); setVal(past[n]); onType?.(past[n]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (pos < 0) return;
      const n = pos + 1;
      if (n >= past.length) { setPos(-1); setVal(""); onType?.(""); } else { setPos(n); setVal(past[n]); onType?.(past[n]); }
    } else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); shell.run("clear"); }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <div className="flex items-center gap-2 bg-[#0c2430] px-3 py-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#C65353]" /><span className="h-2.5 w-2.5 rounded-full bg-[#D69A32]" /><span className="h-2.5 w-2.5 rounded-full bg-[#38A3A5]" />
        <span className="ml-2 truncate text-xs text-[#a9c7d2]">{title} — SİMÜLASYON</span>
      </div>
      <div className="term rounded-none" style={{ borderRadius: 0 }} onClick={() => inp.current?.focus({ preventScroll: true })}>
        <div ref={box} className="overflow-y-auto px-3 py-2" style={{ height }}>
          {shell.lines.map((l, i) =>
            l.k === "in" ? (
              <pre key={i}><span style={{ color: "#7fd1c7" }}>{l.prompt}</span>{l.t}</pre>
            ) : (
              <OutBlock key={i} t={l.t} />
            ),
          )}
          <form className="flex items-center gap-1" onSubmit={(e) => { e.preventDefault(); submit(); }}>
            <span className="shrink-0 whitespace-pre" style={{ color: "#7fd1c7" }}>{shell.eng.prompt()}</span>
            <input
              ref={inp} value={val} className="term-in" autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false}
              aria-label="Komut girişi" placeholder={placeholder}
              onChange={(e) => { setVal(e.target.value); onType?.(e.target.value); }} onKeyDown={onKey}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
