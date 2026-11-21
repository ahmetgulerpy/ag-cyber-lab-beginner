"use client";

import { useMemo, useState } from "react";
import { pyStr } from "@/lib/util";
import { Btn, inputCls, Label, LabNote, TraceViewer, type Step } from "../ui";

type Ex = {
  id: string;
  title: string;
  desc: string;
  params: { key: string; label: string; def: string; multiline?: boolean }[];
  build: (p: Record<string, string>) => { code: string; steps: Step[] } | string;
};

const S = (line: number, vars: Record<string, string | undefined>, note: string, out?: string): Step => ({ line, vars, note, out });

function parseInts(s: string): number[] | null {
  const parts = s.split(",").map((x) => x.trim()).filter((x) => x !== "");
  if (parts.some((x) => !/^-?\d+$/.test(x))) return null;
  return parts.map((x) => parseInt(x, 10));
}
const lst = (a: number[]) => "[" + a.join(", ") + "]";

const EXAMPLES: Ex[] = [
  {
    id: "selam",
    title: "print, input, f-string",
    desc: "Girdi alır, tip dönüşümü yapar ve f-string ile çıktı üretir.",
    params: [
      { key: "ad", label: "ad (input cevabı)", def: "Ayşe" },
      { key: "yas", label: "yas (input cevabı)", def: "17" },
    ],
    build: (p) => {
      const yas = p.yas.trim();
      if (!/^-?\d+$/.test(yas)) return `ValueError: invalid literal for int() with base 10: ${pyStr(yas)} — yaş için tam sayı girin (ör. 17).`;
      const y = parseInt(yas, 10);
      const code = `ad = input("Adınız: ")
yas = int(input("Yaşınız: "))
print(f"Merhaba {ad}!")
print(f"Gelecek yıl {yas + 1} yaşında olacaksın.")`;
      return {
        code,
        steps: [
          S(0, { ad: pyStr(p.ad) }, "`input()` kullanıcı cevabını **metin (str)** olarak döndürür ve `ad` değişkenine atar."),
          S(1, { ad: pyStr(p.ad), yas: String(y) }, "`input()` metni döndürür; `int()` onu tam sayıya çevirir. Geçersiz girdide ValueError oluşurdu."),
          S(2, { ad: pyStr(p.ad), yas: String(y) }, "f-string içindeki `{ad}` değişkenin değeriyle değiştirilir.", `Merhaba ${p.ad}!`),
          S(3, { ad: pyStr(p.ad), yas: String(y) }, `\`{yas + 1}\` ifadesi f-string içinde hesaplanır: ${y} + 1 = ${y + 1}.`, `Gelecek yıl ${y + 1} yaşında olacaksın.`),
        ],
      };
    },
  },
  {
    id: "port",
    title: "Koşul: port kontrolü",
    desc: "Bir portun açık portlar listesinde olup olmadığını kontrol eder.",
    params: [
      { key: "port", label: "port", def: "443" },
      { key: "acik", label: "acik_portlar (virgülle)", def: "22, 80, 443" },
    ],
    build: (p) => {
      const port = parseInts(p.port);
      const acik = parseInts(p.acik);
      if (!port || port.length !== 1) return "port için tek bir tam sayı girin.";
      if (!acik) return "acik_portlar için virgülle ayrılmış tam sayılar girin.";
      const v = port[0];
      const ok = acik.includes(v);
      const code = `port = ${v}
acik_portlar = ${lst(acik)}
if port in acik_portlar:
    print(f"Port {port} AÇIK")
else:
    print(f"Port {port} kapalı")`;
      return {
        code,
        steps: [
          S(0, { port: String(v) }, "`port` değişkeni tanımlanır."),
          S(1, { port: String(v), acik_portlar: lst(acik) }, "Açık portların listesi oluşturulur."),
          S(2, { port: String(v), acik_portlar: lst(acik) }, `\`${v} in ${lst(acik)}\` → **${ok ? "True" : "False"}**.`),
          S(ok ? 3 : 5, { port: String(v), acik_portlar: lst(acik) }, `${ok ? "if" : "else"} bloğu çalışır.`, ok ? `Port ${v} AÇIK` : `Port ${v} kapalı`),
        ],
      };
    },
  },
  {
    id: "tarama",
    title: "Döngü: port tarama mantığı",
    desc: "Bir port aralığında dolaşır ve açık portları listeye ekler (yalnızca eğitim mantığı).",
    params: [
      { key: "bas", label: "başlangıç", def: "20" },
      { key: "bit", label: "bitiş (dahil değil)", def: "26" },
      { key: "acik", label: "açık portlar (virgülle)", def: "22, 25" },
    ],
    build: (p) => {
      const b = parseInts(p.bas);
      const e = parseInts(p.bit);
      const acik = parseInts(p.acik);
      if (!b || !e || b.length !== 1 || e.length !== 1) return "Başlangıç ve bitiş için tam sayı girin.";
      if (!acik) return "Açık portlar için virgülle ayrılmış tam sayılar girin.";
      if (e[0] - b[0] > 30) return "Eğitim simülatörü için aralık en fazla 30 port olabilir.";
      const code = `acik = ${lst(acik)}
bulunan = []
for port in range(${b[0]}, ${e[0]}):
    if port in acik:
        bulunan.append(port)
        print("Açık:", port)
print("Toplam:", len(bulunan))`;
      const steps: Step[] = [S(0, { acik: lst(acik) }, "Simüle edilen açık portlar listesi tanımlanır."), S(1, { acik: lst(acik), bulunan: "[]" }, "Bulunan portlar için boş bir liste açılır.")];
      const found: number[] = [];
      for (let port = b[0]; port < e[0]; port++) {
        const ok = acik.includes(port);
        steps.push(S(2, { port: String(port), bulunan: lst(found) }, `Döngü: port = ${port}.`));
        steps.push(S(3, { port: String(port), bulunan: lst(found) }, `\`${port} in acik\` → **${ok ? "True" : "False"}**.`));
        if (ok) {
          found.push(port);
          steps.push(S(4, { port: String(port), bulunan: lst(found) }, `\`append\` ile ${port} listeye eklenir.`));
          steps.push(S(5, { port: String(port), bulunan: lst(found) }, "Açık port ekrana yazılır.", `Açık: ${port}`));
        }
      }
      steps.push(S(6, { bulunan: lst(found) }, "Döngü bitti; bulunan port sayısı yazdırılır.", `Toplam: ${found.length}`));
      return { code, steps };
    },
  },
  {
    id: "log",
    title: "Fonksiyon + sözlük: log analizi",
    desc: "Başarısız giriş satırlarını IP'ye göre sayar ve eşiği aşanlar için uyarı üretir.",
    params: [
      { key: "esik", label: "eşik (≥)", def: "2" },
      {
        key: "loglar",
        label: "log satırları (her satır bir kayıt, en çok 6)",
        def: "09:01 FAILED login 10.0.0.5\n09:02 OK login 10.0.0.7\n09:03 FAILED login 10.0.0.5\n09:04 FAILED login 10.0.0.9",
        multiline: true,
      },
    ],
    build: (p) => {
      const esikA = parseInts(p.esik);
      if (!esikA || esikA.length !== 1) return "Eşik için tek bir tam sayı girin.";
      const esik = esikA[0];
      const lines = p.loglar.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length === 0) return "En az bir log satırı girin.";
      if (lines.length > 6) return "Eğitim simülatörü en çok 6 log satırını destekler.";
      const n = lines.length;
      const head = `def basarisiz_say(satirlar):
    sayac = {}
    for satir in satirlar:
        if "FAILED" in satir:
            ip = satir.split()[-1]
            sayac[ip] = sayac.get(ip, 0) + 1
    return sayac
`;
      const code = `${head}
loglar = [
${lines.map((l) => "    " + pyStr(l) + ",").join("\n")}
]
sonuc = basarisiz_say(loglar)
for ip, adet in sonuc.items():
    if adet >= ${esik}:
        print(f"UYARI: {ip} -> {adet} başarısız deneme")`;
      const LOGS = 8;
      const callLine = LOGS + 1 + n + 1;
      const forLine = callLine + 1;
      const ifLine = callLine + 2;
      const prLine = callLine + 3;
      const dict = (c: Record<string, number>) => "{" + Object.entries(c).map(([k, v]) => `${pyStr(k)}: ${v}`).join(", ") + "}";
      const steps: Step[] = [S(0, {}, "Fonksiyon **tanımlanır** (henüz çalışmaz).")];
      steps.push(S(LOGS, { loglar: `${n} satırlık liste` }, "Log satırlarını içeren liste oluşturulur."));
      steps.push(S(callLine, { "(yerel) satirlar": `${n} satır` }, "`basarisiz_say(loglar)` çağrılır; liste `satirlar` parametresine bağlanır."));
      const sayac: Record<string, number> = {};
      steps.push(S(1, { "(yerel) sayac": "{}" }, "Boş sayaç sözlüğü oluşturulur."));
      for (const s of lines) {
        const failed = s.includes("FAILED");
        steps.push(S(2, { "(yerel) satir": pyStr(s), "(yerel) sayac": dict(sayac) }, `Döngü: satır = ${pyStr(s)}.`));
        steps.push(S(3, { "(yerel) satir": pyStr(s), "(yerel) sayac": dict(sayac) }, `\`"FAILED" in satir\` → **${failed ? "True" : "False"}**.`));
        if (failed) {
          const ip = s.split(/\s+/).slice(-1)[0];
          steps.push(S(4, { "(yerel) ip": pyStr(ip), "(yerel) sayac": dict(sayac) }, `\`split()[-1]\` satırın son kelimesini alır: ${pyStr(ip)}.`));
          sayac[ip] = (sayac[ip] ?? 0) + 1;
          steps.push(S(5, { "(yerel) ip": pyStr(ip), "(yerel) sayac": dict(sayac) }, `\`get(ip, 0) + 1\` ile sayaç artırılır → ${ip}: ${sayac[ip]}.`));
        }
      }
      steps.push(S(6, { "(yerel) sayac": dict(sayac) }, "**return** sayaç sözlüğünü çağırana gönderir."));
      steps.push(S(callLine, { "(global) sonuc": dict(sayac) }, "Dönen sözlük `sonuc` değişkenine atanır."));
      for (const [ip, adet] of Object.entries(sayac)) {
        steps.push(S(forLine, { ip: pyStr(ip), adet: String(adet) }, `\`.items()\` çiftleri verir: ip = ${pyStr(ip)}, adet = ${adet}.`));
        const hit = adet >= esik;
        steps.push(S(ifLine, { ip: pyStr(ip), adet: String(adet) }, `\`${adet} >= ${esik}\` → **${hit ? "True" : "False"}**.`));
        if (hit) steps.push(S(prLine, { ip: pyStr(ip), adet: String(adet) }, "Eşik aşıldı; uyarı yazdırılır.", `UYARI: ${ip} -> ${adet} başarısız deneme`));
      }
      return { code, steps };
    },
  },
];

export default function Lab10({ onUse }: { onUse: () => void }) {
  const [eid, setEid] = useState(EXAMPLES[0].id);
  const ex = EXAMPLES.find((e) => e.id === eid) as Ex;
  const [params, setParams] = useState<Record<string, string>>(() => Object.fromEntries(EXAMPLES[0].params.map((q) => [q.key, q.def])));

  const choose = (e: Ex) => {
    setEid(e.id);
    setParams(Object.fromEntries(e.params.map((q) => [q.key, q.def])));
  };
  const built = useMemo(() => ex.build(params), [ex, params]);
  const key = eid + JSON.stringify(params);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-warn/40 bg-[#faf0dc] px-3 py-2 text-xs leading-5 text-[#7a5410]">
        <strong>Python Eğitim Simülatörü:</strong> Bu alan gerçek bir Python yorumlayıcısı değildir ve girdiğiniz
        rastgele kodu çalıştırmaz. Önceden hazırlanmış örneklerin parametrelerini değiştirebilir ve kodun adım adım
        nasıl çalıştığını izleyebilirsiniz.
      </div>
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((e) => (
          <Btn key={e.id} variant={e.id === eid ? "primary" : "secondary"} onClick={() => choose(e)}>{e.title}</Btn>
        ))}
      </div>
      <p className="text-sm text-muted">{ex.desc}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {ex.params.map((q) => (
          <div key={q.key} className={q.multiline ? "sm:col-span-2" : ""}>
            <Label>{q.label}</Label>
            {q.multiline ? (
              <textarea className={`${inputCls} h-24 font-mono text-xs`} value={params[q.key] ?? ""} onChange={(e) => setParams({ ...params, [q.key]: e.target.value })} />
            ) : (
              <input className={inputCls} value={params[q.key] ?? ""} onChange={(e) => setParams({ ...params, [q.key]: e.target.value })} />
            )}
          </div>
        ))}
      </div>
      {typeof built === "string" ? (
        <div className="rounded-lg border border-err/40 bg-[#f8e5e5] p-3 text-sm text-[#8e3a3a]">{built}</div>
      ) : (
        <TraceViewer key={key} code={built.code} steps={built.steps} onDone={onUse} title="ornek.py" />
      )}
      <LabNote>Parametreleri değiştirdikçe kod ve adımlar yeniden üretilir. Eşiği artırın, port aralığını genişletin, log satırı ekleyin.</LabNote>
    </div>
  );
}
