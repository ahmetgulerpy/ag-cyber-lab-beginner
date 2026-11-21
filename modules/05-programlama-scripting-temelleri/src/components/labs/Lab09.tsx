"use client";

import { useState } from "react";
import { Badge, Btn, CodeBlock, LabNote } from "../ui";

type ErrType = "syntax" | "runtime" | "logic";
type Case = {
  title: string;
  code: string;
  type: ErrType;
  line: number; // 0 tabanlı
  explain: string;
  fix: string;
};

const TYPE_NAME: Record<ErrType, string> = {
  syntax: "Sözdizimi Hatası (Syntax Error)",
  runtime: "Çalışma Zamanı Hatası (Runtime Error)",
  logic: "Mantık Hatası (Logical Error)",
};

const CASES: Case[] = [
  {
    title: "Örnek 1 · Port kontrolü",
    code: `def kontrol(port):
    if port > 1024
        print("Yüksek port")
    else:
        print("Ayrıcalıklı port")

kontrol(8080)`,
    type: "syntax",
    line: 1,
    explain: "`if` satırının sonunda `:` eksik. Python kodu çalıştırmadan önce ayrıştırırken `SyntaxError: expected ':'` verir; program hiç başlamaz.",
    fix: "if port > 1024:",
  },
  {
    title: "Örnek 2 · Port listesi",
    code: `portlar = [22, 80, 443]
for i in range(4):
    print(portlar[i])`,
    type: "runtime",
    line: 2,
    explain: "Liste 3 elemanlı (indeks 0-2) ama döngü 0-3 arası dönüyor. `portlar[3]` çağrısında `IndexError: list index out of range` oluşur; ilk üç değer yazılır, sonra program çöker.",
    fix: "for i in range(len(portlar)):   # veya: for p in portlar:",
  },
  {
    title: "Örnek 3 · Ortalama",
    code: `def ortalama(a, b, c):
    return (a + b + c) / 2

print(ortalama(10, 20, 30))   # 20.0 bekleniyor`,
    type: "logic",
    line: 1,
    explain: "Kod hatasız çalışır ama 30.0 yazar; üç sayının ortalaması için 3'e bölünmelidir. Program çökmediği için bu hata fark edilmeden yanlış sonuç üretir.",
    fix: "return (a + b + c) / 3",
  },
  {
    title: "Örnek 4 · Yaş hesabı",
    code: `yas = input("Yaş: ")
gelecek = yas + 1
print("Gelecek yıl:", gelecek)`,
    type: "runtime",
    line: 1,
    explain: "`input()` metin (str) döndürür; `str + int` işlemi `TypeError: can only concatenate str (not \"int\") to str` hatası verir. Kod yazım olarak doğrudur, hata çalışırken ortaya çıkar.",
    fix: "gelecek = int(yas) + 1   # girdiyi try/except ile doğrulamak daha iyidir",
  },
  {
    title: "Örnek 5 · Giriş doğrulama",
    code: `def giris(parola, dogru, ikifa_ok):
    if parola == dogru or ikifa_ok:
        return "Giriş başarılı"
    return "Reddedildi"

print(giris("yanlis", "gizli", True))`,
    type: "logic",
    line: 1,
    explain: "Kod çalışır ama güvenlik mantığı hatalı: `or` yüzünden parola yanlış olsa bile 2FA doğruysa giriş verilir. Her iki şart da gerekiyorsa `and` kullanılmalıdır.",
    fix: "if parola == dogru and ikifa_ok:",
  },
  {
    title: "Örnek 6 · Güvensiz hata yönetimi",
    code: `try:
    kullanici = db_sorgula(ad)
except:
    pass
print("Erişim izni verildi")`,
    type: "logic",
    line: 2,
    explain: "Çıplak `except: pass` tüm hataları sessizce yutar. Veritabanı hatası olsa bile program 'erişim izni verildi' der (fail open). Güvenli yaklaşım: belirli istisnayı yakala, hatayı logla ve erişimi reddet (fail closed).",
    fix: `except DatabaseError as e:\n    log.error(e)\n    raise PermissionError("İşlem tamamlanamadı")`,
  },
];

type Answer = { type: ErrType | null; line: number | null; checked: boolean };

export default function Lab09({ onUse }: { onUse: () => void }) {
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(CASES.map(() => ({ type: null, line: null, checked: false })));
  const c = CASES[cur];
  const a = answers[cur];

  const patch = (p: Partial<Answer>) => setAnswers(answers.map((x, i) => (i === cur ? { ...x, ...p } : x)));
  const check = () => {
    patch({ checked: true });
    onUse();
  };

  const score = answers.reduce((s, x, i) => s + (x.checked && x.type === CASES[i].type && x.line === CASES[i].line ? 1 : 0), 0);
  const checkedCount = answers.filter((x) => x.checked).length;
  const typeOk = a.type === c.type;
  const lineOk = a.line === c.line;

  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-[#2b4152]">
        Her kod örneğini inceleyin: <strong>hatalı satıra tıklayın</strong>, <strong>hata türünü seçin</strong> ve
        “Kontrol et” ile doğru çözümü öğrenin.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {CASES.map((_, i) => {
          const x = answers[i];
          const ok = x.checked && x.type === CASES[i].type && x.line === CASES[i].line;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setCur(i)}
              className={`h-9 w-9 rounded-lg border text-sm font-semibold transition ${cur === i ? "border-brand bg-brand text-white" : x.checked ? (ok ? "border-ok bg-[#e3f3ec] text-ok" : "border-err bg-[#f8e5e5] text-err") : "border-line bg-white hover:bg-soft"}`}
            >
              {i + 1}
            </button>
          );
        })}
        <span className="ml-auto text-sm text-muted">Skor: <strong className="text-brand">{score}</strong> / {CASES.length} · İncelenen: {checkedCount}</span>
      </div>

      <p className="text-sm font-semibold">{c.title}</p>
      <div className="overflow-hidden rounded-xl border border-[#1f3a4d] bg-[#172b3a]">
        <pre className="py-3 font-mono text-[13px] leading-6 text-slate-100">
          {c.code.split("\n").map((l, i) => {
            const picked = a.line === i;
            const reveal = a.checked && c.line === i;
            return (
              <button
                type="button"
                key={i}
                disabled={a.checked}
                onClick={() => patch({ line: i })}
                className={`flex w-full px-4 text-left ${reveal ? "bg-err/30 shadow-[inset_3px_0_0_#c65353]" : picked ? "bg-accent/30 shadow-[inset_3px_0_0_#38a3a5]" : "hover:bg-white/5"}`}
              >
                <span className="mr-4 w-5 shrink-0 select-none text-right text-slate-500">{i + 1}</span>
                <span className="whitespace-pre">{l || " "}</span>
              </button>
            );
          })}
        </pre>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {(Object.keys(TYPE_NAME) as ErrType[]).map((t) => (
          <button
            key={t}
            type="button"
            disabled={a.checked}
            onClick={() => patch({ type: t })}
            className={`rounded-lg border px-3 py-2 text-left text-sm transition ${a.type === t ? "border-brand bg-soft font-semibold text-brand" : "border-line bg-white hover:bg-soft"}`}
          >
            {TYPE_NAME[t]}
          </button>
        ))}
      </div>

      {!a.checked ? (
        <div className="flex items-center gap-3">
          <Btn onClick={check} disabled={a.type === null || a.line === null}>Kontrol et</Btn>
          <span className="text-xs text-muted">Hem satır hem tür seçilmelidir.</span>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge tone={typeOk ? "ok" : "err"}>Hata türü: {typeOk ? "doğru" : "yanlış"}</Badge>
            <Badge tone={lineOk ? "ok" : "err"}>Hatalı satır: {lineOk ? "doğru" : "yanlış"}</Badge>
          </div>
          <div className="rounded-lg border border-line bg-white p-3 text-sm leading-6">
            <p><strong>Doğru cevap:</strong> {TYPE_NAME[c.type]} — satır {c.line + 1}</p>
            <p className="mt-1 text-[#2b4152]">{c.explain}</p>
          </div>
          <CodeBlock code={c.fix} title="doğru çözüm" />
          <div className="flex gap-2">
            <Btn variant="secondary" onClick={() => patch({ type: null, line: null, checked: false })}>Tekrar dene</Btn>
            {cur < CASES.length - 1 && <Btn onClick={() => setCur(cur + 1)}>Sonraki örnek →</Btn>}
          </div>
        </div>
      )}
      <LabNote>Lab, hata türlerinin ayırt edilmesine odaklanır. Kodlar gerçekten çalıştırılmaz; beklenen davranış açıklamalarla verilir.</LabNote>
    </div>
  );
}
