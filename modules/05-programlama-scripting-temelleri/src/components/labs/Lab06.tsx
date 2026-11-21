"use client";

import { useMemo, useState } from "react";
import { pyStr } from "@/lib/util";
import { Btn, inputCls, Label, LabNote, TraceViewer, type Step } from "../ui";

type Tpl = {
  id: string;
  title: string;
  params: { key: string; label: string; def: string }[];
  code: (a: Record<string, string>) => string;
  trace: (a: Record<string, string>) => Step[];
};

const S = (line: number, vars: Record<string, string | undefined>, note: string, out?: string): Step => ({ line, vars, note, out });

const TEMPLATES: Tpl[] = [
  {
    id: "puan",
    title: "parola_puani(parola, min_uzunluk)",
    params: [
      { key: "parola", label: "parola (argüman)", def: "Merhaba2024" },
      { key: "min", label: "min_uzunluk (argüman)", def: "8" },
    ],
    code: (a) => `def parola_puani(parola, min_uzunluk=8):
    puan = 0
    if len(parola) >= min_uzunluk:
        puan += 1
    if any(c.isdigit() for c in parola):
        puan += 1
    if any(c.isupper() for c in parola):
        puan += 1
    return puan

sonuc = parola_puani(${pyStr(a.parola)}, ${parseInt(a.min, 10) || 8})
print(sonuc)`,
    trace: (a) => {
      const p = a.parola;
      const m = parseInt(a.min, 10) || 8;
      let puan = 0;
      const loc = (): Record<string, string> => ({ "(yerel) parola": pyStr(p), "(yerel) min_uzunluk": String(m), "(yerel) puan": String(puan) });
      const st: Step[] = [];
      st.push(S(0, {}, "`def` fonksiyonu **tanımlar**, çalıştırmaz. Fonksiyon bellekte hazır bekler."));
      st.push(S(10, { "(yerel) parola": pyStr(p), "(yerel) min_uzunluk": String(m) }, `Fonksiyon çağrıldı. **Argümanlar** parametrelere bağlanır: \`parola\` = ${pyStr(p)}, \`min_uzunluk\` = ${m}.`));
      st.push(S(1, loc(), "Yerel değişken `puan` 0 ile başlar. Bu değişken yalnızca fonksiyon içinde görünür."));
      const c1 = p.length >= m;
      st.push(S(2, loc(), `\`len(parola) >= min_uzunluk\` → \`${p.length} >= ${m}\` → **${c1 ? "True" : "False"}**.`));
      if (c1) { puan++; st.push(S(3, loc(), `puan = ${puan}`)); }
      const c2 = /\d/.test(p);
      st.push(S(4, loc(), `Parolada rakam var mı? → **${c2 ? "True" : "False"}**.`));
      if (c2) { puan++; st.push(S(5, loc(), `puan = ${puan}`)); }
      const c3 = /[A-ZÇĞİÖŞÜ]/.test(p);
      st.push(S(6, loc(), `Parolada büyük harf var mı? → **${c3 ? "True" : "False"}**.`));
      if (c3) { puan++; st.push(S(7, loc(), `puan = ${puan}`)); }
      st.push(S(8, loc(), `**return puan** → fonksiyon ${puan} değerini çağırana gönderir ve biter. Yerel değişkenler yok olur.`));
      st.push(S(10, { "(global) sonuc": String(puan) }, `Dönen değer \`sonuc\` global değişkenine atandı: ${puan}.`));
      st.push(S(11, { "(global) sonuc": String(puan) }, "`print(sonuc)` dönen değeri ekrana yazar.", String(puan)));
      return st;
    },
  },
  {
    id: "ip",
    title: "ip_gecerli_mi(ip)",
    params: [{ key: "ip", label: "ip (argüman)", def: "192.168.1.10" }],
    code: (a) => `def ip_gecerli_mi(ip):
    parcalar = ip.split(".")
    if len(parcalar) != 4:
        return False
    for p in parcalar:
        if not p.isdigit() or int(p) > 255:
            return False
    return True

sonuc = ip_gecerli_mi(${pyStr(a.ip)})
print(sonuc)`,
    trace: (a) => {
      const ip = a.ip;
      const parts = ip.split(".");
      const st: Step[] = [];
      const loc = (extra: Record<string, string> = {}): Record<string, string> => ({ "(yerel) ip": pyStr(ip), "(yerel) parcalar": "[" + parts.map(pyStr).join(", ") + "]", ...extra });
      const fin = (val: boolean, line: number, why: string) => {
        st.push(S(line, loc(), `**return ${val ? "True" : "False"}** — ${why}`));
        st.push(S(9, { "(global) sonuc": val ? "True" : "False" }, `Dönen değer \`sonuc\` değişkenine atandı: ${val ? "True" : "False"}.`));
        st.push(S(10, { "(global) sonuc": val ? "True" : "False" }, "Sonuç ekrana yazılır.", val ? "True" : "False"));
      };
      st.push(S(0, {}, "Fonksiyon tanımlandı (henüz çalışmadı)."));
      st.push(S(9, { "(yerel) ip": pyStr(ip) }, `Çağrı: argüman ${pyStr(ip)} → parametre \`ip\`.`));
      st.push(S(1, loc(), `\`split(".")\` metni noktalardan böler → ${parts.length} parça.`));
      st.push(S(2, loc(), `\`len(parcalar) != 4\` → \`${parts.length} != 4\` → **${parts.length !== 4 ? "True" : "False"}**.`));
      if (parts.length !== 4) { fin(false, 3, "parça sayısı 4 değil."); return st; }
      for (const p of parts) {
        st.push(S(4, loc({ "(yerel) p": pyStr(p) }), `Döngü: p = ${pyStr(p)}.`));
        const bad = !/^\d+$/.test(p) || parseInt(p, 10) > 255;
        st.push(S(5, loc({ "(yerel) p": pyStr(p) }), `\`not p.isdigit() or int(p) > 255\` → **${bad ? "True" : "False"}**.`));
        if (bad) { fin(false, 6, `${pyStr(p)} geçerli bir IP parçası değil.`); return st; }
      }
      fin(true, 7, "tüm parçalar 0-255 arası rakam.");
      return st;
    },
  },
  {
    id: "kullanici",
    title: "kullanici_adi_olustur(ad, soyad)",
    params: [
      { key: "ad", label: "ad (argüman)", def: "Ayşe" },
      { key: "soyad", label: "soyad (argüman)", def: "Yılmaz" },
    ],
    code: (a) => `def kullanici_adi_olustur(ad, soyad):
    ad = ad.strip().lower()
    soyad = soyad.strip().lower()
    return ad[0] + "." + soyad

sonuc = kullanici_adi_olustur(${pyStr(a.ad)}, ${pyStr(a.soyad)})
print(sonuc)`,
    trace: (a) => {
      const ad = a.ad.trim().toLowerCase();
      const soyad = a.soyad.trim().toLowerCase();
      const st: Step[] = [];
      st.push(S(0, {}, "Fonksiyon tanımlandı."));
      st.push(S(5, { "(yerel) ad": pyStr(a.ad), "(yerel) soyad": pyStr(a.soyad) }, "Çağrı: argümanlar parametrelere bağlandı."));
      st.push(S(1, { "(yerel) ad": pyStr(ad), "(yerel) soyad": pyStr(a.soyad) }, "`strip().lower()` boşlukları temizler ve küçük harfe çevirir."));
      st.push(S(2, { "(yerel) ad": pyStr(ad), "(yerel) soyad": pyStr(soyad) }, "Aynı işlem soyad için yapılır."));
      if (ad.length === 0) {
        st.push(S(3, { "(yerel) ad": pyStr(ad), "(yerel) soyad": pyStr(soyad) }, "`ad[0]` boş metinde mevcut değil → **IndexError**. Fonksiyon return edemeden hata ile sonlanır. Girdi doğrulaması gerekir!", "IndexError: string index out of range"));
        return st;
      }
      const r = ad[0] + "." + soyad;
      st.push(S(3, { "(yerel) ad": pyStr(ad), "(yerel) soyad": pyStr(soyad) }, `**return** \`ad[0] + "." + soyad\` → ${pyStr(r)}.`));
      st.push(S(5, { "(global) sonuc": pyStr(r) }, "Dönen değer `sonuc` değişkenine atandı."));
      st.push(S(6, { "(global) sonuc": pyStr(r) }, "Sonuç yazdırılır.", r));
      return st;
    },
  },
];

export default function Lab06({ onUse }: { onUse: () => void }) {
  const [tid, setTid] = useState(TEMPLATES[0].id);
  const tpl = TEMPLATES.find((t) => t.id === tid) as Tpl;
  const [args, setArgs] = useState<Record<string, string>>(() => Object.fromEntries(TEMPLATES[0].params.map((p) => [p.key, p.def])));
  const [scopeErr, setScopeErr] = useState(false);

  const choose = (t: Tpl) => {
    setTid(t.id);
    setArgs(Object.fromEntries(t.params.map((p) => [p.key, p.def])));
    setScopeErr(false);
  };

  const code = useMemo(() => tpl.code(args), [tpl, args]);
  const steps = useMemo(() => tpl.trace(args), [tpl, args]);
  const key = tid + JSON.stringify(args);

  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-[#2b4152]">
        Bir fonksiyon şablonu seçin, <strong>argümanları</strong> değiştirin ve çağrının nasıl işlendiğini izleyin:
        parametre bağlama → fonksiyon gövdesi → <code>return</code> ile dönen sonuç.
      </p>
      <div className="flex flex-wrap gap-2">
        {TEMPLATES.map((t) => (
          <Btn key={t.id} variant={t.id === tid ? "primary" : "secondary"} onClick={() => choose(t)}>
            {t.title}
          </Btn>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {tpl.params.map((p) => (
          <div key={p.key}>
            <Label>{p.label}</Label>
            <input className={inputCls} value={args[p.key] ?? ""} onChange={(e) => setArgs({ ...args, [p.key]: e.target.value })} />
          </div>
        ))}
      </div>
      <TraceViewer key={key} code={code} steps={steps} onDone={onUse} title="fonksiyon.py" />
      <div className="rounded-xl border border-line bg-white p-4">
        <p className="text-sm font-semibold">Kapsam (scope) denemesi</p>
        <p className="mt-1 text-sm text-muted">Fonksiyon bittikten sonra yerel değişkene dışarıdan erişmeyi deneyin.</p>
        <Btn className="mt-2" variant="secondary" onClick={() => { setScopeErr(true); onUse(); }}>
          Fonksiyon dışında yerel değişkeni yazdır
        </Btn>
        {scopeErr && (
          <div className="mt-2 rounded-lg bg-[#172b3a] p-3 font-mono text-xs text-[#f2a1a1]">
            NameError: name &apos;{tid === "puan" ? "puan" : tid === "ip" ? "parcalar" : "ad"}&apos; is not defined
            <p className="mt-1 font-sans text-slate-300">Yerel değişkenler yalnızca fonksiyon çalışırken vardır; sonuç bilgisini `return` ile dışarı taşımalısınız.</p>
          </div>
        )}
      </div>
      <LabNote>Denemeler: boş bir `ad` verin (IndexError); IP&apos;ye 300 veya “abc” yazın; parolayı kısaltıp `min_uzunluk` değerini değiştirin.</LabNote>
    </div>
  );
}
