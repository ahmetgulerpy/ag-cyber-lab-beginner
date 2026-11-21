"use client";

import { useState } from "react";
import { Btn, Callout, LabBox } from "@/components/ui";
import { markLab } from "@/lib/storage";
import { ChoiceLab, type ChoiceItem } from "./ChoiceLab";
import { parseIp } from "./Lab07";

const OPT = ["IPv4", "IPv6", "Geçersiz adres"];

const items: ChoiceItem[] = [
  { prompt: <span className="font-mono">192.0.2.146</span>, options: OPT, answer: 0, why: "Dört ondalık oktet ve noktalar: IPv4. Her oktet 0–255 aralığında." },
  { prompt: <span className="font-mono">2001:db8:85a3::8a2e:370:7334</span>, options: OPT, answer: 1, why: "İki nokta üst üste ile ayrılmış onaltılık gruplar ve '::' kısaltması IPv6'ya özgüdür." },
  { prompt: <span className="font-mono">256.10.20.30</span>, options: OPT, answer: 2, why: "İlk oktet 256; IPv4 oktetleri en fazla 255 olabilir. Bu yüzden adres geçersizdir." },
  { prompt: <span className="font-mono">fe80::1</span>, options: OPT, answer: 1, why: "fe80:: ile başlayan adresler IPv6 link-local adreslerdir (yalnızca yerel bağlantıda geçerli)." },
  { prompt: <span className="font-mono">10.0.0.1</span>, options: OPT, answer: 0, why: "Noktalı dört oktet: IPv4. Ayrıca 10.0.0.0/8 özel adres aralığındadır." },
  { prompt: <span className="font-mono">2001::db8::1</span>, options: OPT, answer: 2, why: "'::' bir adreste yalnızca bir kez kullanılabilir. İki kez kullanılınca kaç sıfır grubu olduğu belirsiz kalır." },
  { prompt: <span className="font-mono">::1</span>, options: OPT, answer: 1, why: "::1, IPv6 loopback adresidir (IPv4'teki 127.0.0.1 karşılığı)." },
];

export function expandV6(input: string): { groups?: string[]; err?: string } {
  const s = input.trim().toLowerCase();
  if (!s) return { err: "Lütfen bir IPv6 adresi gir." };
  if (!/^[0-9a-f:]+$/.test(s)) return { err: "Yalnızca 0-9, a-f harfleri ve ':' karakteri kullanılabilir." };
  if (s.includes(":::")) return { err: "Üç ardışık ':' kullanılamaz." };
  const parts = s.split("::");
  if (parts.length > 2) return { err: "'::' bir adreste yalnızca bir kez kullanılabilir." };
  let groups: string[];
  if (parts.length === 2) {
    const head = parts[0] ? parts[0].split(":") : [];
    const tail = parts[1] ? parts[1].split(":") : [];
    if (head.length + tail.length > 7) return { err: "'::' en az bir sıfır grubunu temsil etmeli; en fazla 7 grup yazılabilir." };
    groups = [...head, ...Array(8 - head.length - tail.length).fill("0"), ...tail];
  } else {
    groups = s.split(":");
    if (groups.length !== 8) return { err: `8 grup bekleniyordu ama ${groups.length} grup var. Kısaltmak için '::' kullanabilirsin.` };
  }
  for (const g of groups) if (!/^[0-9a-f]{1,4}$/.test(g)) return { err: `'${g || "boş"}' grubu geçersiz; her grup 1–4 onaltılık basamak olmalı.` };
  return { groups: groups.map((g) => g.padStart(4, "0")) };
}

export function compressV6(groups: string[]): string {
  const g = groups.map((x) => x.replace(/^0+(?=.)/, ""));
  let bestS = -1;
  let bestL = 0;
  for (let i = 0; i < 8; ) {
    if (g[i] === "0") {
      let j = i;
      while (j < 8 && g[j] === "0") j++;
      if (j - i > bestL) { bestL = j - i; bestS = i; }
      i = j;
    } else i++;
  }
  if (bestL < 2) return g.join(":");
  const left = g.slice(0, bestS).join(":");
  const right = g.slice(bestS + bestL).join(":");
  return `${left}::${right}`;
}

const SAMPLES = ["2001:0db8:0000:0000:0000:ff00:0042:8329", "2001:db8::1", "fe80::1", "::1", "2001:db8:0:0:1:0:0:1", "2001::db8::1"];

export default function Lab08() {
  const [addr, setAddr] = useState("2001:0db8:0000:0000:0000:ff00:0042:8329");
  const [out, setOut] = useState<{ groups?: string[]; err?: string } | null>(null);
  const [tab, setTab] = useState<"id" | "v6">("id");
  const [v4, setV4] = useState("203.0.113.45");

  const run = (a = addr) => {
    const r = expandV6(a);
    setOut(r);
    if (r.groups) markLab(8);
  };

  const v4r = parseIp(v4);

  return (
    <LabBox title="IPv4 / IPv6 Karşılaştırma">
      <div className="flex gap-2">
        <Btn variant={tab === "id" ? "primary" : "ghost"} onClick={() => setTab("id")}>1) Adresi Tanı</Btn>
        <Btn variant={tab === "v6" ? "primary" : "ghost"} onClick={() => setTab("v6")}>2) IPv6 Genişlet / Sıkıştır</Btn>
      </div>
      {tab === "id" ? (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-line bg-white">
            <table className="w-full min-w-[420px] text-sm">
              <thead className="bg-soft text-left text-brand"><tr><th className="p-2">Özellik</th><th className="p-2">IPv4</th><th className="p-2">IPv6</th></tr></thead>
              <tbody className="divide-y divide-line">
                <tr><td className="p-2 font-semibold">Uzunluk</td><td className="p-2">32 bit</td><td className="p-2">128 bit</td></tr>
                <tr><td className="p-2 font-semibold">Gösterim</td><td className="p-2 font-mono">192.0.2.1</td><td className="p-2 font-mono">2001:db8::1</td></tr>
                <tr><td className="p-2 font-semibold">Adres sayısı</td><td className="p-2">≈ 4,3 milyar</td><td className="p-2">≈ 3,4×10³⁸</td></tr>
                <tr><td className="p-2 font-semibold">Ayırıcı</td><td className="p-2">nokta (.)</td><td className="p-2">iki nokta (:)</td></tr>
              </tbody>
            </table>
          </div>
          <label className="block text-sm font-semibold">IPv4 mü? Kendin dene (IPv4 doğrulama)
            <input className="field mt-1 font-mono" value={v4} onChange={(e) => setV4(e.target.value)} />
          </label>
          {typeof v4r === "string" ? <Callout kind="err" title="Geçersiz IPv4">{v4r}</Callout> : <Callout kind="ok" title="Geçerli IPv4">32 bit değeri: {v4r.toString(2).padStart(32, "0").replace(/(.{8})(?!$)/g, "$1.")}</Callout>}
          <ChoiceLab id={8} items={items} intro="Aşağıdaki adreslerin IPv4, IPv6 ya da geçersiz olduğunu belirle." />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {SAMPLES.map((s) => <Btn key={s} variant="soft" className="font-mono text-xs" onClick={() => { setAddr(s); run(s); }}>{s}</Btn>)}
          </div>
          <label className="block text-sm font-semibold">IPv6 adresi
            <input className="field mt-1 font-mono" value={addr} onChange={(e) => setAddr(e.target.value)} />
          </label>
          <Btn onClick={() => run()}>⚙ Çözümle</Btn>
          {out?.err && <Callout kind="err" title="Geçersiz IPv6 adresi">{out.err}</Callout>}
          {out?.groups && (
            <div className="space-y-3">
              <div>
                <p className="mb-1 text-sm font-bold">8 grup (genişletilmiş)</p>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                  {out.groups.map((g, i) => (
                    <div key={i} className={`rounded-lg border p-2 text-center ${g === "0000" ? "border-warn/50 bg-[#FBF3E2]" : "border-brand/30 bg-soft"}`}>
                      <p className="text-[10px] text-muted">Grup {i + 1}</p>
                      <p className="font-mono text-sm font-bold">{g}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-1 text-xs text-muted">Sarı gruplar tamamı sıfır olan gruplardır; bunlar '::' ile kısaltılabilir.</p>
              </div>
              <div className="rounded-xl border border-line bg-white p-3 text-sm">
                <p><b>Genişletilmiş:</b> <span className="break-all font-mono">{out.groups.join(":")}</span></p>
                <p className="mt-1"><b>Sıkıştırılmış:</b> <span className="break-all font-mono text-brand">{compressV6(out.groups)}</span></p>
              </div>
              <Callout title="Kurallar">1) Her grubun baştaki sıfırları atılır. 2) Ardışık sıfır gruplarının <b>en uzun dizisi</b> bir kez &apos;::&apos; ile yazılır. Adres aynı kalır; yalnızca yazım değişir.</Callout>
            </div>
          )}
        </div>
      )}
    </LabBox>
  );
}
