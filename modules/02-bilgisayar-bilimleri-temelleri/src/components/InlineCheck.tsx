import { useState } from "react";
import { HelpCircle } from "lucide-react";
import type { Question } from "../types";
import { Feedback } from "./ui";
import { cn } from "../utils/cn";

export function InlineCheck({ q }: { q: Question }) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="rounded-lg border border-accent/30 bg-[#f1f9f9] p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
        <HelpCircle className="h-4 w-4" /> Anladın mı? Mini soru
      </div>
      <p className="mb-3 text-sm font-medium text-ink">{q.q}</p>
      <div className="grid gap-2">
        {q.options.map((o, i) => (
          <button
            key={i}
            onClick={() => setPicked(i)}
            className={cn(
              "rounded-md border bg-white px-3 py-2 text-left text-sm transition-colors",
              picked === null && "border-line hover:border-accent",
              picked !== null && i === q.answer && "border-ok bg-[#eef8f2]",
              picked === i && i !== q.answer && "border-bad bg-[#fbeeee]",
              picked !== null && i !== q.answer && picked !== i && "border-line opacity-60"
            )}
          >
            {o}
          </button>
        ))}
      </div>
      {picked !== null && (
        <div className="mt-3">
          <Feedback tone={picked === q.answer ? "ok" : "bad"} title={picked === q.answer ? "Doğru!" : "Tam olmadı — tekrar dene"}>
            {q.explain}
          </Feedback>
          {picked !== q.answer && (
            <button onClick={() => setPicked(null)} className="mt-2 text-sm font-semibold text-brand hover:underline">
              Tekrar dene
            </button>
          )}
        </div>
      )}
    </div>
  );
}
