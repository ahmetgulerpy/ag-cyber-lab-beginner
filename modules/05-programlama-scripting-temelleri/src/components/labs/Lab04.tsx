"use client";

import { useState } from "react";
import { pyStr } from "@/lib/util";
import { Badge, CodeBlock, inputCls, Label, LabNote } from "../ui";

type Cond = { line: number; text: string; value: boolean; result: string; printLine: number };

export default function Lab04({ onUse }: { onUse: () => void }) {
  const [parola, setParola] = useState("Merhaba2024");
  const [kullanici, setKullanici] = useState("ayse");
  const [hata, setHata] = useState("0");
  const [A, setA] = useState(true);
  const [B, setB] = useState(false);

  const touch = () => onUse();

  const h = Number.isFinite(parseInt(hata, 10)) ? parseInt(hata, 10) : 0;
  const uzun = parola.length >= 8;
  const rakam = /\d/.test(parola);
  const buyuk = /[A-ZÇĞİÖŞÜ]/.test(parola);
  const iceriyor = kullanici.length > 0 && parola.toLowerCase().includes(kullanici.toLowerCase());

  const code = [
    `parola = ${pyStr(parola)}`,
    `kullanici = ${pyStr(kullanici)}`,
    `hata_sayisi = ${h}`,
    `uzun_mu = len(parola) >= 8              # ${uzun ? "True" : "False"}`,
    `rakam_var = any(c.isdigit() for c in parola)   # ${rakam ? "True" : "False"}`,
    `buyuk_var = any(c.isupper() for c in parola)   # ${buyuk ? "True" : "False"}`,
    ``,
    `if hata_sayisi >= 5:`,
    `    print("Hesap kilitlendi")`,
    `elif kullanici and kullanici.lower() in parola.lower():`,
    `    print("Parola kullanıcı adını içeriyor – reddedildi")`,
    `elif uzun_mu and rakam_var and buyuk_var:`,
    `    print("Parola güçlü")`,
    `elif uzun_mu and (rakam_var or buyuk_var):`,
    `    print("Parola orta")`,
    `else:`,
    `    print("Parola zayıf")`,
  ].join("\n");

  const conds: Cond[] = [
    { line: 7, text: "hata_sayisi >= 5", value: h >= 5, result: "Hesap kilitlendi", printLine: 8 },
    { line: 9, text: "kullanici and kullanici.lower() in parola.lower()", value: iceriyor, result: "Parola kullanıcı adını içeriyor – reddedildi", printLine: 10 },
    { line: 11, text: "uzun_mu and rakam_var and buyuk_var", value: uzun && rakam && buyuk, result: "Parola güçlü", printLine: 12 },
    { line: 13, text: "uzun_mu and (rakam_var or buyuk_var)", value: uzun && (rakam || buyuk), result: "Parola orta", printLine: 14 },
  ];
  const firstTrue = conds.findIndex((c) => c.value);
  const resultText = firstTrue >= 0 ? conds[firstTrue].result : "Parola zayıf";
  const activeLine = firstTrue >= 0 ? conds[firstTrue].printLine : 16;
  const tone = firstTrue === 2 ? "ok" : firstTrue === 3 ? "warn" : "err";

  const Check = ({ ok, label }: { ok: boolean; label: string }) => (
    <li className={`flex items-center gap-2 text-sm ${ok ? "text-ok" : "text-muted"}`}>
      <span className={`flex h-5 w-5 items-center justify-center rounded text-xs text-white ${ok ? "bg-ok" : "bg-slate-300"}`}>{ok ? "✓" : "✕"}</span>
      {label}
    </li>
  );

  return (
    <div className="space-y-5">
      <p className="text-sm leading-6 text-[#2b4152]">
        Değerleri değiştirin; hangi koşulun çalıştığını, hangi koşulların atlandığını ve değerlendirme sırasını canlı
        izleyin. Python koşulları yukarıdan aşağıya sırayla değerlendirir ve <strong>ilk doğru</strong> olanı çalıştırır.
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Parola</Label>
              <input className={inputCls} value={parola} onChange={(e) => { setParola(e.target.value); touch(); }} />
            </div>
            <div>
              <Label>Kullanıcı adı</Label>
              <input className={inputCls} value={kullanici} onChange={(e) => { setKullanici(e.target.value); touch(); }} />
            </div>
            <div>
              <Label>Ardışık hatalı giriş sayısı</Label>
              <input className={inputCls} type="number" min={0} value={hata} onChange={(e) => { setHata(e.target.value); touch(); }} />
            </div>
          </div>
          <ul className="space-y-1.5 rounded-lg border border-line bg-white p-3">
            <Check ok={uzun} label={`Uzunluk ≥ 8 (şu an ${parola.length})`} />
            <Check ok={rakam} label="En az bir rakam içeriyor" />
            <Check ok={buyuk} label="En az bir büyük harf içeriyor" />
          </ul>
          <div className={`rounded-lg border p-3 ${tone === "ok" ? "border-ok/40 bg-[#e3f3ec]" : tone === "warn" ? "border-warn/50 bg-[#faf0dc]" : "border-err/40 bg-[#f8e5e5]"}`}>
            <p className="text-xs text-muted">Program çıktısı</p>
            <p className="font-mono text-sm font-semibold">{resultText}</p>
          </div>
        </div>
        <CodeBlock code={code} title="kosul.py" active={activeLine} />
      </div>

      <div className="rounded-xl border border-line bg-white p-4">
        <p className="mb-2 text-sm font-semibold">Koşul zinciri nasıl değerlendirildi?</p>
        <ol className="space-y-1.5 text-sm">
          {conds.map((c, i) => {
            const skipped = firstTrue >= 0 && i > firstTrue;
            return (
              <li key={i} className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted">{i === 0 ? "if" : "elif"}</span>
                <code className="rounded bg-soft px-1.5 py-0.5 font-mono text-xs">{c.text}</code>
                {skipped ? <Badge tone="muted">değerlendirilmedi</Badge> : <Badge tone={c.value ? "ok" : "err"}>{c.value ? "True → bu blok çalıştı" : "False → sonrakine geç"}</Badge>}
              </li>
            );
          })}
          <li className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted">else</span>
            {firstTrue === -1 ? <Badge tone="ok">Hiçbiri doğru değil → else çalıştı</Badge> : <Badge tone="muted">değerlendirilmedi</Badge>}
          </li>
        </ol>
      </div>

      <div className="rounded-xl border border-line bg-white p-4">
        <p className="mb-2 text-sm font-semibold">Mantıksal operatörler: AND, OR, NOT</p>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={A} onChange={(e) => { setA(e.target.checked); touch(); }} /> A = {A ? "True" : "False"}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={B} onChange={(e) => { setB(e.target.checked); touch(); }} /> B = {B ? "True" : "False"}
          </label>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {[
            ["A and B", A && B],
            ["A or B", A || B],
            ["not A", !A],
          ].map(([t, v]) => (
            <div key={String(t)} className="rounded-lg border border-line px-3 py-2 text-sm">
              <code className="font-mono text-xs text-brand">{String(t)}</code>
              <p className={`font-semibold ${v ? "text-ok" : "text-err"}`}>{v ? "True" : "False"}</p>
            </div>
          ))}
        </div>
      </div>
      <LabNote>Denemeler: parolayı 7 karaktere indirin; hata sayısını 5 yapın; parolaya kullanıcı adını ekleyin.</LabNote>
    </div>
  );
}
