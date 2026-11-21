"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge, Btn, Card, InfoBox, LabPanel, ProgressBar, Stat, Tabs } from "@/components/ui";
import type { LabProps } from "./types";

/* ---------- Parola değerlendirme (tamamen yerel) ---------- */
const COMMON = ["123456", "password", "qwerty", "sifre", "12345678", "111111", "admin", "letmein", "welcome", "iloveyou", "123456789", "futbol", "galatasaray", "fenerbahce", "besiktas", "parola", "abc123", "sunshine", "istanbul", "ankara", "654321", "master", "dragon"];

function unleet(s: string) {
  return s.toLowerCase().replace(/@/g, "a").replace(/0/g, "o").replace(/1/g, "i").replace(/3/g, "e").replace(/\$/g, "s").replace(/5/g, "s").replace(/!/g, "i");
}

type Eval = { bits: number; score: number; label: string; tone: "bad" | "warn" | "ok"; notes: { ok: boolean; t: string }[]; time: string };

function fmtTime(sec: number): string {
  if (sec < 1) return "anında";
  if (sec < 60) return `${Math.round(sec)} saniye`;
  if (sec < 3600) return `${Math.round(sec / 60)} dakika`;
  if (sec < 86400) return `${Math.round(sec / 3600)} saat`;
  if (sec < 86400 * 365) return `${Math.round(sec / 86400)} gün`;
  const y = sec / (86400 * 365);
  if (y < 1000) return `${Math.round(y)} yıl`;
  if (y < 1e6) return `${Math.round(y / 1000)} bin yıl`;
  return "milyonlarca yıl";
}

function evaluate(pw: string): Eval {
  const notes: { ok: boolean; t: string }[] = [];
  if (!pw) return { bits: 0, score: 0, label: "—", tone: "bad", notes, time: "—" };
  const lower = /[a-zçğıöşü]/.test(pw), upper = /[A-ZÇĞİÖŞÜ]/.test(pw), digit = /\d/.test(pw), sym = /[^\wçğıöşüÇĞİÖŞÜ]|_/.test(pw);
  const pool = (lower ? 26 : 0) + (upper ? 26 : 0) + (digit ? 10 : 0) + (sym ? 32 : 0) || 10;
  let bits = pw.length * Math.log2(pool);
  const n = unleet(pw);
  const common = COMMON.some((c) => n === c || n.replace(/\d+$/, "") === c || (n.includes(c) && pw.length <= c.length + 5));
  const seq = /(0123|1234|2345|3456|4567|5678|6789|abcd|bcde|qwer|wert|asdf|zxcv)/i.test(pw);
  const rep = /(.)\1{2,}/.test(pw);
  const year = /(19|20)\d{2}/.test(pw);
  const onlyTail = /^[a-zA-Z]+[\d!@#$%.]{1,3}$/.test(pw);
  notes.push({ ok: pw.length >= 12, t: `Uzunluk: ${pw.length} karakter ${pw.length >= 12 ? "(iyi)" : "(en az 12 önerilir)"}` });
  notes.push({ ok: [lower, upper, digit, sym].filter(Boolean).length >= 3, t: `Karakter çeşitliliği: ${[lower && "küçük", upper && "büyük", digit && "rakam", sym && "sembol"].filter(Boolean).join(", ") || "yok"}` });
  notes.push({ ok: !common, t: common ? "Yaygın parola listelerinde yer alan bir kalıba benziyor (sözlük saldırısı ilk bunu dener)." : "Yaygın parola listesindeki bir kelimeye benzemiyor." });
  notes.push({ ok: !seq && !rep, t: seq || rep ? "Ardışık veya tekrarlayan karakterler var (tahmin edilebilir)." : "Ardışık/tekrarlayan örüntü yok." });
  notes.push({ ok: !year && !onlyTail, t: year || onlyTail ? "Yıl ya da sonuna eklenmiş rakam/sembol gibi tahmin edilebilir bir kalıp var." : "Tahmin edilebilir yıl/ek kalıbı yok." });
  if (common) bits = Math.min(bits, 12);
  if (seq) bits *= 0.6;
  if (rep) bits *= 0.7;
  if (year) bits -= 8;
  if (onlyTail) bits *= 0.75;
  bits = Math.max(1, bits);
  const score = Math.max(2, Math.min(100, Math.round((bits / 80) * 100)));
  const label = bits < 28 ? "Çok zayıf" : bits < 40 ? "Zayıf" : bits < 60 ? "Orta" : bits < 80 ? "Güçlü" : "Çok güçlü";
  const tone = bits < 40 ? "bad" : bits < 60 ? "warn" : "ok";
  const time = fmtTime(Math.pow(2, bits) / 1e10 / 2);
  return { bits, score, label, tone, notes, time };
}

const PRESETS = ["123456", "Password1!", "Futbol1905", "kedi-bulut-kahve-trenler-47", "xK9#vQ2!mL7$pZ4w"];

/* ---------- Giriş denemesi simülasyonu (sentetik) ---------- */
const ACCOUNTS = [
  { u: "ayse", p: "Welcome2024" },
  { u: "mehmet", p: "Kx!92mQ#vLp4" },
  { u: "zeynep", p: "futbol1905" },
  { u: "can", p: "kedi_Bulut_88_tren" },
  { u: "elif", p: "Welcome2024" },
];
const DICT = ["123456", "password", "qwerty", "sifre", "admin", "letmein", "Welcome2024", "iloveyou", "istanbul", "abc123", "111111", "galatasaray", "master", "futbol1905", "dragon", "sunshine", "Password1", "12345678", "parola", "ankara"];
const SPRAY = ["Welcome2024", "123456", "Password1"];
const BUDGET = 600; // saldırganın simüle edilen zaman bütçesi (sn)

type Cfg = { mode: "dict" | "spray"; lock: number; rate: boolean; mfa: boolean };
type Row = { u: string; status: "owned" | "mfa" | "locked" | "none" | "time"; attempts: number };
type SimResult = { rows: Row[]; attempts: number; time: number; log: string[]; owned: number; blocked: number };

function simulate(cfg: Cfg): SimResult {
  const seq: { u: string; p: string }[] = [];
  if (cfg.mode === "dict") DICT.forEach((p) => seq.push({ u: "zeynep", p }));
  else SPRAY.forEach((p) => ACCOUNTS.forEach((a) => seq.push({ u: a.u, p })));
  const fails: Record<string, number> = {};
  const attemptsBy: Record<string, number> = {};
  const state: Record<string, Row["status"]> = {};
  const log: string[] = [];
  let t = 0, n = 0, attempts = 0;
  for (const s of seq) {
    if (state[s.u] === "owned" || state[s.u] === "mfa" || state[s.u] === "locked") continue;
    n++;
    const delay = cfg.rate ? (n <= 3 ? 0.2 : Math.min(120, Math.pow(2, n - 3))) : 0.2;
    if (t + delay > BUDGET) {
      log.push(`⏱ Süre bütçesi doldu (${BUDGET} sn). Saldırgan vazgeçti.`);
      Object.keys(attemptsBy).forEach((u) => { if (!state[u]) state[u] = "time"; });
      break;
    }
    t += delay;
    attempts++;
    attemptsBy[s.u] = (attemptsBy[s.u] ?? 0) + 1;
    const acc = ACCOUNTS.find((a) => a.u === s.u)!;
    if (acc.p === s.p) {
      if (cfg.mfa) { state[s.u] = "mfa"; log.push(`#${n} ${s.u}/${s.p} → parola DOĞRU ama MFA kodu isteniyor → giriş engellendi 🛡`); }
      else { state[s.u] = "owned"; log.push(`#${n} ${s.u}/${s.p} → GİRİŞ BAŞARILI ⚠ (hesap ele geçirildi)`); }
    } else {
      fails[s.u] = (fails[s.u] ?? 0) + 1;
      log.push(`#${n} ${s.u}/${s.p} → hatalı (${fails[s.u]}. başarısız${cfg.rate && n > 3 ? `, ${delay.toFixed(0)} sn bekleme` : ""})`);
      if (cfg.lock > 0 && fails[s.u] >= cfg.lock) { state[s.u] = "locked"; log.push(`🔒 ${s.u} hesabı ${cfg.lock} hatalı denemeden sonra kilitlendi.`); }
    }
  }
  const rows: Row[] = ACCOUNTS.filter((a) => (cfg.mode === "dict" ? a.u === "zeynep" : true)).map((a) => ({ u: a.u, status: state[a.u] ?? "none", attempts: attemptsBy[a.u] ?? 0 }));
  return { rows, attempts, time: t, log, owned: rows.filter((r) => r.status === "owned").length, blocked: rows.filter((r) => r.status === "mfa" || r.status === "locked").length };
}

const statusLabel: Record<Row["status"], string> = { owned: "⚠ Ele geçirildi", mfa: "🛡 MFA engelledi", locked: "🔒 Kilitlendi", none: "✓ Korundu (parola bulunamadı)", time: "⏱ Zaman doldu" };

export default function Lab07({ onComplete, done }: LabProps) {
  const [tab, setTab] = useState<"pw" | "sim">("pw");
  const [pw, setPw] = useState("");
  const [checked, setChecked] = useState<string[]>([]);
  const [cfg, setCfg] = useState<Cfg>({ mode: "dict", lock: 0, rate: false, mfa: false });
  const [result, setResult] = useState<SimResult | null>(null);
  const [runs, setRuns] = useState<{ cfg: Cfg; owned: number }[]>([]);
  const ev = useMemo(() => evaluate(pw), [pw]);

  useEffect(() => {
    if (pw.length >= 4 && !checked.includes(pw)) {
      const t = setTimeout(() => setChecked((c) => [...c, pw]), 1200);
      return () => clearTimeout(t);
    }
  }, [pw, checked]);

  const noDefenseOwned = runs.some((r) => !r.cfg.rate && !r.cfg.mfa && r.cfg.lock === 0 && r.owned > 0);
  const defenseHelped = runs.some((r) => (r.cfg.rate || r.cfg.mfa || r.cfg.lock > 0) && r.owned === 0);
  const finished = checked.length >= 3 && noDefenseOwned && defenseHelped;
  useEffect(() => {
    if (finished) onComplete();
  }, [finished, onComplete]);

  const run = () => {
    const r = simulate(cfg);
    setResult(r);
    setRuns((x) => [...x, { cfg, owned: r.owned }]);
  };

  return (
    <LabPanel title="Laboratuvar 7 – Parola Güvenliği ve Giriş Denemesi Simülatörü" intro="Önce parola örneklerinin güvenlik puanını gör. Sonra sentetik hesaplara karşı yapılan bir saldırının hesap kilitleme, rate limiting ve MFA ile nasıl değiştiğini gözle." done={done}>
      <InfoBox tone="warn" icon="⚠️" title="Güvenlik notu">Yalnızca örnek/uydurma parolalar kullan. Girdiğin metin sadece bu sayfada, tarayıcı belleğinde değerlendirilir; hiçbir yere gönderilmez veya kaydedilmez. Bu araç gerçek parola kırmaz.</InfoBox>
      <Tabs variant="pill" value={tab} onChange={setTab} tabs={[{ id: "pw", label: "🔑 Parola değerlendirme", badge: `${Math.min(checked.length, 3)}/3` }, { id: "sim", label: "🧪 Giriş denemesi simülasyonu", badge: `${runs.length}` }]} />

      {tab === "pw" && (
        <div className="ag-fade space-y-3">
          <InfoBox tone="brand" icon="🎯" title="Görev">En az 3 farklı örnek parolayı dene (hazır örnekler veya kendi uydurduğun). Neden iyi/kötü olduğuna bak.</InfoBox>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => <Btn key={p} size="sm" variant="secondary" onClick={() => setPw(p)}>{p}</Btn>)}
          </div>
          <input value={pw} onChange={(e) => setPw(e.target.value.slice(0, 60))} autoComplete="off" spellCheck={false} placeholder="Örnek parola yaz…" aria-label="Örnek parola" className="w-full rounded-xl border border-line bg-white px-4 py-3 font-mono text-base outline-none focus:border-accent" />
          <div className="grid gap-3 md:grid-cols-2">
            <Card>
              <div className="flex items-center justify-between">
                <p className="font-bold">Güvenlik puanı</p>
                <Badge tone={ev.tone}>{ev.label}</Badge>
              </div>
              <p className="mt-2 text-4xl font-extrabold text-brand">{pw ? ev.score : "–"}<span className="text-base text-muted">/100</span></p>
              <ProgressBar className="mt-2" value={pw ? ev.score : 0} tone={ev.tone} />
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Stat label="Tahmini entropi" value={pw ? `${Math.round(ev.bits)} bit` : "–"} />
                <Stat label="Hızlı offline tahmin süresi*" value={pw ? ev.time : "–"} tone={ev.tone} />
              </div>
              <p className="mt-2 text-[11px] text-muted">*Saniyede 10 milyar tahmin yapan varsayımsal bir saldırgan için kaba tahmin; yalnızca öğrenme amaçlıdır.</p>
            </Card>
            <Card>
              <p className="font-bold">Neden bu puan?</p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {ev.notes.length === 0 && <li className="text-muted">Bir parola yazınca analiz burada görünür.</li>}
                {ev.notes.map((n, i) => <li key={i} className={`rounded-lg border px-3 py-2 ${n.ok ? "border-ok/30 bg-ok/10" : "border-bad/30 bg-bad/10"}`}>{n.ok ? "✅" : "❌"} {n.t}</li>)}
              </ul>
            </Card>
          </div>
        </div>
      )}

      {tab === "sim" && (
        <div className="ag-fade space-y-3">
          <InfoBox tone="brand" icon="🎯" title="Görev">Önce <b>savunmasız</b> ayarla saldırıyı çalıştır, sonra savunma aç ve farkı gör. (Sentetik 5 hesap, tamamen yerel hesaplama. Gerçek hesaplara deneme yapılmaz.)</InfoBox>
          <div className="grid gap-3 md:grid-cols-2">
            <Card>
              <p className="font-bold">Saldırı türü</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Btn variant={cfg.mode === "dict" ? "primary" : "secondary"} size="sm" onClick={() => setCfg({ ...cfg, mode: "dict" })}>📖 Sözlük (tek hesap)</Btn>
                <Btn variant={cfg.mode === "spray" ? "primary" : "secondary"} size="sm" onClick={() => setCfg({ ...cfg, mode: "spray" })}>🌧️ Password Spraying</Btn>
              </div>
              <p className="mt-2 text-xs text-muted">{cfg.mode === "dict" ? "20 yaygın parolayı tek hesaba (zeynep) dener." : "3 yaygın parolayı 5 hesabın her birine birer kez dener."}</p>
            </Card>
            <Card>
              <p className="font-bold">Savunma ayarları</p>
              <div className="mt-2 space-y-2 text-sm">
                <label className="flex items-center justify-between gap-2">Hesap kilitleme eşiği
                  <select value={cfg.lock} onChange={(e) => setCfg({ ...cfg, lock: Number(e.target.value) })} className="rounded-lg border border-line bg-white px-2 py-1" aria-label="Hesap kilitleme eşiği">
                    <option value={0}>Kapalı</option><option value={3}>3 hata</option><option value={5}>5 hata</option><option value={10}>10 hata</option>
                  </select>
                </label>
                <label className="flex items-center justify-between gap-2">Rate limiting (üstel bekleme)
                  <input type="checkbox" className="h-4 w-4 accent-[#176B87]" checked={cfg.rate} onChange={(e) => setCfg({ ...cfg, rate: e.target.checked })} />
                </label>
                <label className="flex items-center justify-between gap-2">MFA (ikinci doğrulama)
                  <input type="checkbox" className="h-4 w-4 accent-[#176B87]" checked={cfg.mfa} onChange={(e) => setCfg({ ...cfg, mfa: e.target.checked })} />
                </label>
              </div>
            </Card>
          </div>
          <Btn onClick={run}>▶ Simülasyonu çalıştır</Btn>

          {result && (
            <Card className="ag-fade space-y-3">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Stat label="Toplam deneme" value={result.attempts} />
                <Stat label="Geçen süre (sim.)" value={`${Math.round(result.time)} sn`} />
                <Stat label="Ele geçirilen" value={result.owned} tone={result.owned > 0 ? "bad" : "ok"} />
                <Stat label="Engellenen" value={result.blocked} tone="ok" />
              </div>
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {result.rows.map((r) => (
                  <li key={r.u} className={`rounded-lg border px-3 py-2 text-sm ${r.status === "owned" ? "border-bad/40 bg-bad/10" : r.status === "mfa" || r.status === "locked" ? "border-ok/40 bg-ok/10" : "border-line bg-page"}`}>
                    <b className="font-mono">{r.u}</b> – {statusLabel[r.status]} <span className="text-xs text-muted">({r.attempts} deneme)</span>
                  </li>
                ))}
              </ul>
              <div className="max-h-40 overflow-auto rounded-xl bg-[#101c26] p-3 font-mono text-[11px] leading-relaxed text-[#cfe3ec]">
                {result.log.slice(0, 40).map((l, i) => <p key={i}>{l}</p>)}
                {result.log.length > 40 && <p className="text-white/50">… {result.log.length - 40} satır daha</p>}
              </div>
              <InfoBox tone={result.owned > 0 ? "bad" : "ok"} icon={result.owned > 0 ? "⚠️" : "🛡️"} title="Yorum">
                {result.owned > 0
                  ? cfg.mode === "spray" && cfg.lock > 0
                    ? "Password Spraying her hesapta çok az deneme yaptığı için hesap kilitleme eşiğini tetiklemeden zayıf parolalı hesapları buldu. Spraying'e karşı MFA ve IP/davranış bazlı hız sınırı gerekir."
                    : "Savunma olmadan zayıf parola kısa sürede bulundu. Kilitleme, rate limiting veya MFA ekleyip tekrar dene."
                  : cfg.mfa
                    ? "Parola bulunsa bile MFA hesabı korudu: ikinci faktör olmadan giriş yapılamadı."
                    : "Savunma, saldırganın deneme sayısını veya hızını sınırlayarak parolayı bulmasını engelledi."}
              </InfoBox>
            </Card>
          )}
          <p className="text-xs text-muted">Çalıştırılan simülasyon: {runs.length} • Savunmasız denemede hesap ele geçirildi: {noDefenseOwned ? "✓" : "–"} • Savunmayla korunma görüldü: {defenseHelped ? "✓" : "–"}</p>
        </div>
      )}
    </LabPanel>
  );
}
