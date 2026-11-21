"use client";

import { useState } from "react";
import { markLab } from "@/lib/progress";
import { Callout } from "./ui";

const HEX = /^[0-9a-f]{64}$/;

function extract(raw: string): string {
  // "hash  dosya-adı" biçimini de kabul et: ilk 64 karakterlik onaltılık diziyi al
  const m = raw.toLowerCase().match(/[0-9a-f]{64}/);
  if (m) return m[0];
  return raw.toLowerCase().replace(/\s+/g, "");
}

const SAMPLE_A = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08";
const SAMPLE_B = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a09";

export function HashChecker({ slug }: { slug?: string }) {
  const [official, setOfficial] = useState("");
  const [mine, setMine] = useState("");
  const [checked, setChecked] = useState(false);
  const a = extract(official);
  const b = extract(mine);
  const valid = (s: string) => HEX.test(s);
  const match = valid(a) && valid(b) && a === b;
  const diffs = a.split("").reduce((n, c, i) => n + (c !== b[i] ? 1 : 0), 0) + Math.abs(a.length - b.length);

  const run = () => {
    setChecked(true);
    if (slug && match) markLab(slug);
  };

  return (
    <div className="card space-y-4">
      <div>
        <h3 className="font-bold text-ag-text">🔐 SHA256 karşılaştırma aracı</h3>
        <p className="text-sm text-ag-muted">Bu araç dosyana erişmez. Dosyanın SHA256 değerini kendi bilgisayarında hesaplayıp buraya yapıştırırsın; araç iki metni karşılaştırır.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-semibold">
          Resmî sayfadaki SHA256 değeri
          <textarea value={official} onChange={(e) => { setOfficial(e.target.value); setChecked(false); }} rows={3} className="field mt-1 font-mono text-xs" placeholder="64 karakterlik değeri yapıştır…" />
        </label>
        <label className="block text-sm font-semibold">
          Senin hesapladığın değer
          <textarea value={mine} onChange={(e) => { setMine(e.target.value); setChecked(false); }} rows={3} className="field mt-1 font-mono text-xs" placeholder="Get-FileHash / sha256sum çıktısını yapıştır…" />
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary" disabled={!official.trim() || !mine.trim()} onClick={run}>
          Karşılaştır
        </button>
        <button type="button" className="btn" onClick={() => { setOfficial(SAMPLE_A); setMine(SAMPLE_A); setChecked(false); }}>
          Örnek: eşleşen
        </button>
        <button type="button" className="btn" onClick={() => { setOfficial(SAMPLE_A); setMine(SAMPLE_B); setChecked(false); }}>
          Örnek: eşleşmeyen
        </button>
        <button type="button" className="btn" onClick={() => { setOfficial(""); setMine(""); setChecked(false); }}>
          Temizle
        </button>
      </div>
      {checked && (
        <div className="space-y-3">
          {(!valid(a) || !valid(b)) && (
            <Callout kind="warn" title="Değerler geçerli SHA256 biçiminde değil">
              SHA256 değeri 64 karakterlik onaltılık (0-9, a-f) bir dizidir. Resmî değer {a.length}, senin değerin {b.length} karakter. Kopyalarken eksik veya fazla karakter almış olabilirsin; bir de dosya adını ya da MD5/SHA1 gibi başka bir hash'i yapıştırmadığına bak.
            </Callout>
          )}
          {valid(a) && valid(b) && match && (
            <Callout kind="ok" title="Eşleşiyor – dosya bütünlüğü doğrulandı">
              İki değer birebir aynı. İndirdiğin dosya resmî dosyayla aynı görünüyor. Bu, dosyayı resmî sayfadan indirdiysen güvenle devam edebileceğin anlamına gelir.
            </Callout>
          )}
          {valid(a) && valid(b) && !match && (
            <>
              <Callout kind="err" title={`Eşleşmiyor – ${diffs} karakter farklı`}>
                Bu dosyayı kullanma. Dosya yarım inmiş, bozulmuş veya değiştirilmiş olabilir. Dosyayı sil, resmî sayfadan yeniden indir ve tekrar doğrula.
              </Callout>
              <div className="overflow-x-auto rounded-lg bg-[#0f2230] p-3 font-mono text-xs leading-relaxed text-[#cfe7ef]">
                <p className="mb-1 text-ag-accent">Fark görünümü (kırmızı = farklı):</p>
                <p className="break-all">
                  {b.split("").map((c, i) => (
                    <span key={i} className={c !== a[i] ? "rounded bg-ag-err px-0.5 text-white" : ""}>
                      {c}
                    </span>
                  ))}
                </p>
              </div>
            </>
          )}
        </div>
      )}
      <div className="grid gap-3 text-xs md:grid-cols-3">
        <div className="rounded-lg bg-ag-bg p-3">
          <p className="font-bold text-ag-brand">Windows (PowerShell)</p>
          <code className="mt-1 block break-all font-mono">Get-FileHash .\dosya.iso -Algorithm SHA256</code>
        </div>
        <div className="rounded-lg bg-ag-bg p-3">
          <p className="font-bold text-ag-brand">macOS</p>
          <code className="mt-1 block break-all font-mono">shasum -a 256 dosya.iso</code>
        </div>
        <div className="rounded-lg bg-ag-bg p-3">
          <p className="font-bold text-ag-brand">Linux</p>
          <code className="mt-1 block break-all font-mono">sha256sum dosya.iso</code>
        </div>
      </div>
    </div>
  );
}
