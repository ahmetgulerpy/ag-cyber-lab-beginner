"use client";

import { useMemo, useState } from "react";
import { Badge, Btn, inputCls, Label, LabNote } from "../ui";

type Preset = { name: string; pattern: string; flags: string; text: string; note: string };

const PRESETS: Preset[] = [
  { name: "Rakam dizileri", pattern: "\\d+", flags: "g", text: "Port 22, 80 ve 443 açık. Oturum süresi: 3600 sn.", note: "\\d bir rakamı, + bir veya daha fazlasını eşler." },
  { name: "E-posta (basit)", pattern: "[\\w.+-]+@[\\w-]+(\\.[\\w-]+)+", flags: "g", text: "İletişim: ayse@agcyberlab.com, destek@ornek.org.tr, geçersiz@, @eksik.com", note: "Yalnızca ilk filtredir; gerçek doğrulama için ek kontroller gerekir." },
  { name: "IPv4 (biçim)", pattern: "\\b\\d{1,3}(\\.\\d{1,3}){3}\\b", flags: "g", text: "Kaynak 203.0.113.9, hedef 10.0.0.5, hatalı: 999.999.999.999, kısa: 10.0.5", note: "Biçimi kontrol eder; 999.999.999.999'u da eşler çünkü 0–255 sınırını denetlemez." },
  {
    name: "Başarısız giriş (log)",
    pattern: "Failed password for (\\w+) from (\\d+\\.\\d+\\.\\d+\\.\\d+)",
    flags: "g",
    text: "Jan 10 09:01 sshd: Accepted password for ayse from 10.0.0.7\nJan 10 09:02 sshd: Failed password for root from 203.0.113.9\nJan 10 09:03 sshd: Failed password for admin from 203.0.113.9\nJan 10 09:05 sshd: Failed password for mehmet from 198.51.100.4",
    note: "Gruplar kullanıcı adını (1) ve kaynak IP'yi (2) yakalar.",
  },
  { name: "Saat (SS:DD)", pattern: "\\b([01]\\d|2[0-3]):[0-5]\\d\\b", flags: "g", text: "Toplantı 09:30, 14:05 ve 25:99 olarak planlandı; 23:59 son saat.", note: "Alternation (|) ile 00–23 saat aralığı tanımlanır." },
  { name: "URL", pattern: "https?:\\/\\/[\\w.-]+(?:\\/[\\w\\-./?%&=]*)?", flags: "gi", text: "Siteler: https://agcyberlab.com/egitim ve http://ornek.org?x=1; ftp://dosya.com eşleşmez.", note: "s? ile http veya https eşlenir." },
  { name: "Telefon (TR)", pattern: "\\b0?5\\d{2}[ -]?\\d{3}[ -]?\\d{2}[ -]?\\d{2}\\b", flags: "g", text: "Numaralar: 0532 123 45 67, 505-987-65-43, 5551234567, 12345.", note: "İsteğe bağlı 0, boşluk veya tire kabul eder." },
  { name: "Güçlü parola (lookahead)", pattern: "^(?=.*[A-Z])(?=.*\\d)(?=.*[a-z]).{8,}$", flags: "gm", text: "Merhaba2024\nzayif\nSADECEBUYUK1\nGucluParola9", note: "Lookahead (?=...) ile her satır için üç kural ve minimum 8 karakter denetlenir." },
  { name: "Çapa örneği", pattern: "^\\d+$", flags: "gm", text: "12345\n12a45\n987\n 42", note: "^ ve $ satırın tamamının rakamlardan oluşmasını ister (m bayrağı ile her satır ayrı)." },
];

const CHEAT: [string, string][] = [
  [".", "Herhangi bir karakter (satır sonu hariç)"],
  ["\\d  \\w  \\s", "Rakam · harf/rakam/_ · boşluk"],
  ["[abc]  [a-z]  [^0-9]", "Sınıf · aralık · olumsuzlama"],
  ["*  +  ?", "0+ · 1+ · 0 veya 1"],
  ["{n}  {n,m}", "Tam n · n ile m arası"],
  ["^  $  \\b", "Başlangıç · son · kelime sınırı"],
  ["( )  (?: )  |", "Grup · yakalamayan grup · veya"],
];

// Tek bir niceleyicili atom içeren ve kendisi de nicelenen grup: (a+)+, (\w+)*, (.*)* ... veya örtüşen alternation: (a|aa)+
const NESTED_A = /\((?:\?:)?(?:\\[wdsWDS.]|\[[^\]]*\]|[^()\\|*+?])[+*]\)\s*(?:[+*]|\{\d+,\d*\})/;
const NESTED_B = /\(([^()|\\]+)\|\1[^()|]*\)\s*[+*]/;
const NESTED_RISK = { test: (p: string) => NESTED_A.test(p) || NESTED_B.test(p) };
const MAX_TEXT = 5000;
const MAX_MATCHES = 500;

type M = { index: number; text: string; groups: (string | undefined)[]; named?: Record<string, string> };

export default function Lab14({ onUse }: { onUse: () => void }) {
  const [pattern, setPattern] = useState(PRESETS[3].pattern);
  const [flags, setFlags] = useState<string>(PRESETS[3].flags);
  const [text, setText] = useState(PRESETS[3].text);
  const [note, setNote] = useState(PRESETS[3].note);
  const [n, setN] = useState(14);

  const touch = () => onUse();

  const result = useMemo(() => {
    if (!pattern) return { kind: "empty" as const };
    if (NESTED_RISK.test(pattern)) return { kind: "risky" as const };
    let re: RegExp;
    try {
      re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
    } catch (e) {
      return { kind: "error" as const, msg: e instanceof Error ? e.message : String(e) };
    }
    const src = text.length > MAX_TEXT ? text.slice(0, MAX_TEXT) : text;
    const ms: M[] = [];
    const global = flags.includes("g");
    let m: RegExpExecArray | null;
    let guard = 0;
    while ((m = re.exec(src)) && guard++ < MAX_MATCHES) {
      ms.push({ index: m.index, text: m[0], groups: m.slice(1), named: m.groups ? { ...m.groups } : undefined });
      if (m[0] === "") re.lastIndex++;
      if (!global) break;
    }
    return { kind: "ok" as const, ms, truncated: text.length > MAX_TEXT, src, capped: guard >= MAX_MATCHES };
  }, [pattern, flags, text]);

  const toggleFlag = (f: string) => {
    setFlags(flags.includes(f) ? flags.replace(f, "") : flags + f);
    touch();
  };

  const load = (p: Preset) => {
    setPattern(p.pattern);
    setFlags(p.flags);
    setText(p.text);
    setNote(p.note);
    touch();
  };

  const highlighted = useMemo(() => {
    if (result.kind !== "ok") return null;
    const parts: { t: string; hit: boolean; alt: boolean }[] = [];
    let pos = 0;
    result.ms.forEach((m, i) => {
      if (m.text === "") return;
      if (m.index > pos) parts.push({ t: result.src.slice(pos, m.index), hit: false, alt: false });
      parts.push({ t: m.text, hit: true, alt: i % 2 === 1 });
      pos = m.index + m.text.length;
    });
    parts.push({ t: result.src.slice(pos), hit: false, alt: false });
    return parts;
  }, [result]);

  // ReDoS simülasyonu (matematiksel model; gerçek regex çalıştırılmaz)
  const vulnSteps = Math.pow(2, n + 1);
  const safeSteps = n + 2;
  const fmt = (x: number) => (x >= 1e9 ? x.toExponential(2) : x.toLocaleString("tr-TR"));
  const seconds = vulnSteps / 1e7;
  const bar = (x: number) => Math.max(2, (Math.log10(x) / Math.log10(Math.pow(2, 31))) * 100);

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-brand/30 bg-soft px-3 py-2 text-xs leading-5 text-[#2d5566]">
        <strong>Motor:</strong> Bu araç tarayıcının <strong>JavaScript RegExp</strong> motorunu kullanır. Python&apos;un{" "}
        <code>re</code> modülüyle her konuda birebir aynı davranmaz (ör. isimli grup sözdizimi ve bazı gelişmiş özellikler
        farklıdır).
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">Hazır örnekler</p>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button key={p.name} type="button" onClick={() => load(p)} className={`rounded-full border px-3 py-1 text-xs transition ${pattern === p.pattern ? "border-brand bg-soft text-brand" : "border-line bg-white hover:bg-soft"}`}>
              {p.name}
            </button>
          ))}
        </div>
        {note && <p className="mt-2 text-xs text-muted">💡 {note}</p>}
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div>
          <Label>Regex deseni (pattern)</Label>
          <div className="flex items-center gap-1 rounded-lg border border-line bg-white px-3 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
            <span className="font-mono text-muted">/</span>
            <input
              className="min-w-0 flex-1 bg-transparent py-2 font-mono text-sm outline-none"
              value={pattern}
              spellCheck={false}
              aria-label="Regex deseni"
              onChange={(e) => { setPattern(e.target.value); setNote(""); touch(); }}
            />
            <span className="font-mono text-muted">/{flags}</span>
          </div>
        </div>
        <div>
          <Label>Bayraklar</Label>
          <div className="flex gap-3 py-2 text-sm">
            {[["g", "g (hepsi)"], ["i", "i (büyük/küçük)"], ["m", "m (satır)"]].map(([f, l]) => (
              <label key={f} className="flex items-center gap-1.5">
                <input type="checkbox" checked={flags.includes(f)} onChange={() => toggleFlag(f)} /> {l}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Label>Test metni</Label>
        <textarea
          className={`${inputCls} h-32 font-mono text-[13px]`}
          value={text}
          spellCheck={false}
          aria-label="Test metni"
          onChange={(e) => { setText(e.target.value); touch(); }}
        />
        {text.length > MAX_TEXT && <p className="mt-1 text-xs text-[#9a6b14]">⚠ Güvenlik için yalnızca ilk {MAX_TEXT} karakter test edilir.</p>}
      </div>

      {result.kind === "error" && (
        <div className="rounded-lg border border-err/40 bg-[#f8e5e5] p-3 text-sm text-[#8e3a3a]">
          <p className="font-semibold">Geçersiz düzenli ifade</p>
          <p className="mt-1 font-mono text-xs">{result.msg}</p>
        </div>
      )}
      {result.kind === "risky" && (
        <div className="rounded-lg border border-warn/50 bg-[#faf0dc] p-3 text-sm text-[#7a5410]">
          <p className="font-semibold">⚠ ReDoS riski: desen çalıştırılmadı</p>
          <p className="mt-1">
            Desende <strong>iç içe niceleyici</strong> (ör. <code>(a+)+</code>) tespit edildi. Bu yapı bazı girdilerde
            katlanarak artan geri izleme (catastrophic backtracking) yaratıp tarayıcıyı kilitleyebilir. Güvenliğiniz için
            bu desen çalıştırılmıyor; aşağıdaki simülasyonla davranışını güvenle inceleyin.
          </p>
        </div>
      )}
      {result.kind === "ok" && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={result.ms.length ? "ok" : "muted"}>Eşleşme sayısı: {result.ms.length}{result.capped ? "+" : ""}</Badge>
            {!flags.includes("g") && <Badge tone="muted">g bayrağı kapalı: yalnızca ilk eşleşme</Badge>}
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-muted">Eşleşen alanlar</p>
            <pre className="scroll-thin max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-line bg-white p-3 font-mono text-[13px] leading-6">
              {highlighted?.map((p, i) => (p.hit ? <mark key={i} className={p.alt ? "regex-hit-alt" : "regex-hit"}>{p.t}</mark> : <span key={i}>{p.t}</span>))}
            </pre>
          </div>
          {result.ms.length > 0 && (
            <div className="scroll-thin max-h-64 overflow-auto rounded-lg border border-line bg-white">
              <table className="w-full min-w-[420px] text-sm">
                <thead className="sticky top-0 bg-slate-50 text-left text-xs text-muted">
                  <tr><th className="px-3 py-1.5">#</th><th className="px-3 py-1.5">Konum</th><th className="px-3 py-1.5">Eşleşme</th><th className="px-3 py-1.5">Gruplar</th></tr>
                </thead>
                <tbody>
                  {result.ms.slice(0, 100).map((m, i) => (
                    <tr key={i} className="border-t border-line align-top">
                      <td className="px-3 py-1.5 text-muted">{i + 1}</td>
                      <td className="px-3 py-1.5 font-mono text-xs">{m.index}</td>
                      <td className="px-3 py-1.5 font-mono text-xs text-ok">{m.text === "" ? "(boş eşleşme)" : m.text}</td>
                      <td className="px-3 py-1.5 font-mono text-xs">
                        {m.groups.length === 0 ? <span className="text-muted">—</span> : m.groups.map((g, k) => <div key={k}>${k + 1} = {g === undefined ? "undefined" : JSON.stringify(g)}</div>)}
                        {m.named && Object.entries(m.named).map(([k, v]) => <div key={k}>{k} = {JSON.stringify(v)}</div>)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-line bg-white">
        <div className="bg-slate-50 px-3 py-2 text-xs font-medium text-muted">Hızlı başvuru</div>
        <table className="w-full text-sm">
          <tbody>
            {CHEAT.map(([a, b]) => (
              <tr key={a} className="border-t border-line"><td className="px-3 py-1.5 font-mono text-xs text-brand">{a}</td><td className="px-3 py-1.5">{b}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 rounded-xl border-2 border-warn/40 bg-white p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">ReDoS simülasyonu</h3>
          <Badge tone="warn">Güvenli matematiksel model — tehlikeli desen çalıştırılmaz</Badge>
        </div>
        <p className="text-sm leading-6 text-[#2b4152]">
          Riskli desen <code>^(a+)+$</code> ile güvenli <code>^a+$</code> deseni, <code>aaaa…a!</code> biçimindeki girdide
          (sonunda eşleşmeyi bozan bir karakter) karşılaştırılıyor. Riskli desende motor, “a” harflerini grup içinde
          bölmenin olası tüm yollarını dener; adım sayısı yaklaşık <strong>2<sup>n</sup></strong> ile artar. Aşağıdaki
          değerler bir <em>tahmindir</em>; gerçek regex çalıştırılmaz.
        </p>
        <div>
          <Label>Girdi uzunluğu n = {n} (“a” sayısı)</Label>
          <input type="range" min={1} max={30} value={n} onChange={(e) => { setN(parseInt(e.target.value, 10)); touch(); }} className="w-full accent-[#176b87]" />
          <p className="mt-1 break-all font-mono text-xs text-muted">{"a".repeat(Math.min(n, 40))}!</p>
        </div>
        <div className="space-y-2 text-sm">
          <div>
            <div className="flex justify-between"><span className="font-mono text-xs">^(a+)+$ (riskli)</span><span className="font-semibold text-err">≈ {fmt(vulnSteps)} adım</span></div>
            <div className="mt-1 h-3 rounded-full bg-[#e3ebf0]"><div className="h-3 rounded-full bg-err transition-all" style={{ width: `${bar(vulnSteps)}%` }} /></div>
          </div>
          <div>
            <div className="flex justify-between"><span className="font-mono text-xs">^a+$ (güvenli)</span><span className="font-semibold text-ok">≈ {fmt(safeSteps)} adım</span></div>
            <div className="mt-1 h-3 rounded-full bg-[#e3ebf0]"><div className="h-3 rounded-full bg-ok transition-all" style={{ width: `${bar(safeSteps)}%` }} /></div>
          </div>
          <p className="text-xs text-muted">
            Saniyede 10 milyon adım varsayımıyla riskli desen için tahmini süre:{" "}
            <strong className={seconds > 1 ? "text-err" : "text-ink"}>{seconds < 0.001 ? "< 1 ms" : seconds < 120 ? `${seconds.toFixed(seconds < 10 ? 3 : 1)} sn` : `${(seconds / 60).toFixed(1)} dk`}</strong>
            {n >= 26 && " — sunucu fiilen kilitlenir!"}
          </p>
        </div>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>Çözüm: iç içe niceleyicilerden kaçının (<code>(a+)+</code> yerine <code>a+</code>).</li>
          <li>Girdi uzunluğunu sınırlayın; zaman aşımı veya doğrusal zamanlı regex motorları kullanın.</li>
          <li>Kullanıcıdan gelen desenleri doğrudan çalıştırmayın.</li>
        </ul>
        <Btn variant="secondary" onClick={() => { setPattern("^(a+)+$"); setFlags("g"); setText("aaaaaaaaaaaa!"); setNote("Bu desen iç içe niceleyici içerir; araç güvenlik için çalıştırmaz."); touch(); }}>
          Riskli deseni deneyerek korumayı gör
        </Btn>
      </div>
      <LabNote>Denemeler: “IPv4” örneğinde çapa ekleyin/çıkarın, e-posta desenine <code>^</code> ve <code>$</code> koyun, “i” bayrağını açıp kapatın.</LabNote>
    </div>
  );
}
