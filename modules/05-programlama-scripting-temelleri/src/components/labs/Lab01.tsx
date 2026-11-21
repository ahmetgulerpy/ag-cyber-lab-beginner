"use client";

import { useState } from "react";
import { pyStr } from "@/lib/util";
import { Btn, inputCls, Label, LabNote, TraceViewer, type Step } from "../ui";

type Prog = {
  id: string;
  title: string;
  desc: string;
  code: string;
  inputs: { key: string; label: string; def: string }[];
  build: (v: Record<string, string>) => Step[] | string;
};

const PROGRAMS: Prog[] = [
  {
    id: "parola",
    title: "Parola uzunluğu kontrolü",
    desc: "Girilen parolanın en az 8 karakter olup olmadığını kontrol eder.",
    code: `parola = input("Parola: ")
uzunluk = len(parola)
if uzunluk >= 8:
    print("Parola yeterli")
else:
    print("Parola çok kısa")`,
    inputs: [{ key: "parola", label: "Parola", def: "Merhaba2024" }],
    build: (v) => {
      const p = v.parola ?? "";
      const n = p.length;
      const ok = n >= 8;
      return [
        { line: 0, phase: "Girdi", vars: { parola: pyStr(p) }, note: "Program kullanıcıdan **girdi** alır. `input()` değeri `parola` değişkenine yazar." },
        { line: 1, phase: "İşlem", vars: { parola: pyStr(p), uzunluk: String(n) }, note: `**İşlem:** \`len(parola)\` karakter sayısını hesaplar → ${n}.` },
        { line: 2, phase: "İşlem", vars: { parola: pyStr(p), uzunluk: String(n) }, note: `**Karar:** \`${n} >= 8\` ifadesi **${ok ? "True" : "False"}** olduğundan ${ok ? "if" : "else"} bloğu çalışır.` },
        { line: ok ? 3 : 5, phase: "Çıktı", vars: { parola: pyStr(p), uzunluk: String(n) }, out: ok ? "Parola yeterli" : "Parola çok kısa", note: "**Çıktı:** sonuç ekrana yazılır ve program biter." },
      ];
    },
  },
  {
    id: "toplam",
    title: "İki sayıyı toplama",
    desc: "İki tam sayı alır, toplar ve sonucu yazdırır.",
    code: `a = int(input("Birinci sayı: "))
b = int(input("İkinci sayı: "))
toplam = a + b
print("Toplam:", toplam)`,
    inputs: [
      { key: "a", label: "Birinci sayı", def: "12" },
      { key: "b", label: "İkinci sayı", def: "30" },
    ],
    build: (v) => {
      const a = (v.a ?? "").trim();
      const b = (v.b ?? "").trim();
      if (!/^-?\d+$/.test(a)) return `ValueError: invalid literal for int() with base 10: ${pyStr(a)} — tam sayı girin.`;
      if (!/^-?\d+$/.test(b)) return `ValueError: invalid literal for int() with base 10: ${pyStr(b)} — tam sayı girin.`;
      const t = Number(a) + Number(b);
      return [
        { line: 0, phase: "Girdi", vars: { a }, note: "İlk **girdi** alınır; `input()` metin döndürdüğü için `int()` ile sayıya çevrilir." },
        { line: 1, phase: "Girdi", vars: { a, b }, note: "İkinci **girdi** alınır ve sayıya çevrilir." },
        { line: 2, phase: "İşlem", vars: { a, b, toplam: String(t) }, note: `**İşlem:** ${a} + ${b} = ${t}.` },
        { line: 3, phase: "Çıktı", vars: { a, b, toplam: String(t) }, out: `Toplam: ${t}`, note: "**Çıktı:** sonuç ekrana yazılır." },
      ];
    },
  },
  {
    id: "kilit",
    title: "Başarısız giriş uyarısı",
    desc: "Başarısız giriş sayısı eşiği aşarsa hesabın kilitlenmesi gerektiğini bildirir.",
    code: `deneme = int(input("Başarısız giriş sayısı: "))
esik = 5
if deneme >= esik:
    print("UYARI: Hesap kilitlenmeli")
else:
    print("Normal")`,
    inputs: [{ key: "deneme", label: "Başarısız giriş sayısı", def: "6" }],
    build: (v) => {
      const d = (v.deneme ?? "").trim();
      if (!/^-?\d+$/.test(d)) return `ValueError: invalid literal for int() with base 10: ${pyStr(d)} — tam sayı girin.`;
      const n = Number(d);
      const ok = n >= 5;
      return [
        { line: 0, phase: "Girdi", vars: { deneme: String(n) }, note: "**Girdi:** deneme sayısı alınır." },
        { line: 1, phase: "İşlem", vars: { deneme: String(n), esik: "5" }, note: "**İşlem:** eşik değeri 5 olarak tanımlanır." },
        { line: 2, phase: "İşlem", vars: { deneme: String(n), esik: "5" }, note: `**Karar:** \`${n} >= 5\` → **${ok ? "True" : "False"}**.` },
        { line: ok ? 3 : 5, phase: "Çıktı", vars: { deneme: String(n), esik: "5" }, out: ok ? "UYARI: Hesap kilitlenmeli" : "Normal", note: "**Çıktı:** sonuç yazılır." },
      ];
    },
  },
];

export default function Lab01({ onUse }: { onUse: () => void }) {
  const [pid, setPid] = useState(PROGRAMS[0].id);
  const prog = PROGRAMS.find((p) => p.id === pid) as Prog;
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(PROGRAMS[0].inputs.map((i) => [i.key, i.def])),
  );

  const choose = (p: Prog) => {
    setPid(p.id);
    setValues(Object.fromEntries(p.inputs.map((i) => [i.key, i.def])));
  };

  const result = prog.build(values);
  const traceKey = pid + "|" + prog.inputs.map((i) => values[i.key]).join("|");

  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-[#2b4152]">
        Bir programı <strong>girdi → işlem → çıktı</strong> aşamalarıyla adım adım izleyin. Programı seçin, girdi
        değerlerini değiştirin ve “Sonraki adım” ile çalışmayı ilerletin.
      </p>
      <div className="flex flex-wrap gap-2">
        {PROGRAMS.map((p) => (
          <Btn key={p.id} variant={p.id === pid ? "primary" : "secondary"} onClick={() => choose(p)}>
            {p.title}
          </Btn>
        ))}
      </div>
      <p className="text-sm text-muted">{prog.desc}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {prog.inputs.map((i) => (
          <div key={i.key}>
            <Label>{i.label} (girdi)</Label>
            <input
              className={inputCls}
              value={values[i.key] ?? ""}
              onChange={(e) => setValues({ ...values, [i.key]: e.target.value })}
            />
          </div>
        ))}
      </div>
      {typeof result === "string" ? (
        <div className="rounded-lg border border-err/40 bg-[#f8e5e5] p-3 text-sm text-[#8e3a3a]">
          <p className="font-semibold">Program çalıştırılamadı</p>
          <p className="mt-1 font-mono text-xs">{result}</p>
          <p className="mt-1">Gerçek programlarda da geçersiz girdi hataya yol açar; bu yüzden girdi doğrulaması önemlidir.</p>
        </div>
      ) : (
        <TraceViewer key={traceKey} code={prog.code} steps={result} onDone={onUse} />
      )}
      <LabNote>Bu laboratuvar gerçek kod çalıştırmaz; her program için hazırlanmış adım adım çalışma modelini gösterir.</LabNote>
    </div>
  );
}
