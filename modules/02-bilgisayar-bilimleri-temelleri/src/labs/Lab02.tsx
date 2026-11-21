import { useEffect, useState } from "react";
import { Cpu, Code2, Cog, RotateCcw } from "lucide-react";
import { Btn, Card, Feedback, LabShell, SimNote, type LabProps } from "../components/ui";
import { cn } from "../utils/cn";

type Cat = "hardware" | "software" | "firmware";
const cats: { id: Cat; name: string; en: string; icon: typeof Cpu }[] = [
  { id: "hardware", name: "Donanım", en: "Hardware", icon: Cpu },
  { id: "software", name: "Yazılım", en: "Software", icon: Code2 },
  { id: "firmware", name: "Firmware", en: "Firmware", icon: Cog },
];

const items: { name: string; cat: Cat; why: string }[] = [
  { name: "İşlemci (CPU)", cat: "hardware", why: "İşlemci, komutları yürüten fiziksel bir çiptir; dokunabilirsin." },
  { name: "RAM", cat: "hardware", why: "RAM, geçici veriyi tutan fiziksel bellek modülüdür." },
  { name: "SSD", cat: "hardware", why: "SSD flash bellek çipleri içeren fiziksel bir depolama aygıtıdır. (Üzerinde kendi firmware'i de çalışır ama aygıt donanımdır.)" },
  { name: "Windows", cat: "software", why: "Windows bir işletim sistemidir; sistem yazılımı olduğu için yazılım kategorisindedir." },
  { name: "Linux", cat: "software", why: "Linux çekirdeği ve onu kullanan dağıtımlar işletim sistemi yazılımıdır." },
  { name: "Tarayıcı", cat: "software", why: "Tarayıcı web sayfalarını görüntüleyen bir uygulama yazılımıdır." },
  { name: "Ekran kartı (GPU)", cat: "hardware", why: "Ekran kartı görüntü üreten fiziksel bir bileşendir." },
  { name: "Klavye", cat: "hardware", why: "Klavye fiziksel bir girdi aygıtıdır." },
  { name: "BIOS/UEFI", cat: "firmware", why: "BIOS/UEFI anakartın flash belleğinde saklanan, açılışta ilk çalışan firmware'dir." },
  { name: "Aygıt sürücüsü (Driver)", cat: "software", why: "Sürücü işletim sistemine yüklenen bir yazılımdır; donanımla işletim sistemi arasında çeviri yapar. Firmware ile karıştırılmamalı: sürücü bilgisayarın diskinde, firmware ise donanımın içinde durur." },
];

export default function Lab02({ done, onComplete }: LabProps) {
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<{ ok: boolean; picked: Cat }[]>([]);
  const [over, setOver] = useState<Cat | null>(null);
  const finished = idx >= items.length;
  const score = results.filter((r) => r.ok).length;
  const last = results[results.length - 1];

  useEffect(() => {
    if (finished && !done) onComplete();
  }, [finished, done, onComplete]);

  const place = (c: Cat) => {
    if (finished || results.length > idx) return;
    setResults((r) => [...r, { ok: items[idx].cat === c, picked: c }]);
  };

  const next = () => setIdx((i) => i + 1);
  const reset = () => {
    setIdx(0);
    setResults([]);
  };

  const cur = items[Math.min(idx, items.length - 1)];
  const answered = results.length > idx;

  return (
    <LabShell done={done} title="Lab 02 — Bileşen Sınıflandırma Laboratuvarı">
      <SimNote>Kartı sürükleyip bir kategoriye bırak ya da kategori butonuna tıkla. Tüm bileşenleri sınıflandırınca uygulama tamamlanır.</SimNote>
      <Card className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-brand">
            Bileşen {Math.min(idx + 1, items.length)} / {items.length}
          </span>
          <span className="text-muted">Doğru: {score}</span>
        </div>

        {!finished && (
          <>
            <div
              draggable={!answered}
              onDragStart={(e) => e.dataTransfer.setData("text/plain", cur.name)}
              className={cn(
                "mx-auto w-full max-w-sm cursor-grab rounded-xl border-2 border-dashed border-brand/40 bg-soft px-4 py-6 text-center text-xl font-bold text-ink active:cursor-grabbing",
                answered && "cursor-default opacity-70"
              )}
            >
              {cur.name}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {cats.map((c) => {
                const Icon = c.icon;
                const picked = answered && last.picked === c.id;
                const correct = answered && cur.cat === c.id;
                return (
                  <button
                    key={c.id}
                    disabled={answered}
                    onClick={() => place(c.id)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setOver(c.id);
                    }}
                    onDragLeave={() => setOver(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setOver(null);
                      place(c.id);
                    }}
                    className={cn(
                      "rounded-xl border p-4 text-center transition-colors",
                      over === c.id ? "border-brand bg-soft" : "border-line bg-white hover:border-accent",
                      correct && "border-ok bg-[#eef8f2]",
                      picked && !correct && "border-bad bg-[#fbeeee]"
                    )}
                  >
                    <Icon className="mx-auto mb-1 h-6 w-6 text-brand" />
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-xs text-muted">{c.en}</div>
                  </button>
                );
              })}
            </div>
            {answered && (
              <>
                <Feedback tone={last.ok ? "ok" : "bad"} title={last.ok ? "Doğru!" : `Yanlış — doğru kategori: ${cats.find((c) => c.id === cur.cat)?.name}`}>
                  {cur.why}
                </Feedback>
                <div className="flex justify-end">
                  <Btn onClick={next}>{idx + 1 < items.length ? "Sonraki Bileşen" : "Sonucu Gör"}</Btn>
                </div>
              </>
            )}
          </>
        )}

        {finished && (
          <div className="space-y-4">
            <Feedback tone={score >= 8 ? "ok" : "warn"} title={`Sonuç: ${score} / ${items.length}`}>
              {score === items.length
                ? "Mükemmel! Donanım, yazılım ve firmware ayrımını çok iyi kavradın."
                : "Yanlış yaptığın bileşenleri aşağıdan incele ve tekrar dene; her yanlış bir öğrenme fırsatıdır."}
            </Feedback>
            <ul className="divide-y divide-line rounded-lg border border-line text-sm">
              {items.map((it, i) => (
                <li key={it.name} className="flex flex-wrap items-center justify-between gap-2 p-3">
                  <span className="font-medium">{it.name}</span>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", results[i].ok ? "bg-[#e6f4ed] text-ok" : "bg-[#f8e7e7] text-bad")}>
                    {results[i].ok ? "Doğru" : `Yanlış → ${cats.find((c) => c.id === it.cat)?.name}`}
                  </span>
                </li>
              ))}
            </ul>
            <Btn variant="secondary" onClick={reset}>
              <RotateCcw className="h-4 w-4" /> Yeniden Dene
            </Btn>
          </div>
        )}
      </Card>
    </LabShell>
  );
}
