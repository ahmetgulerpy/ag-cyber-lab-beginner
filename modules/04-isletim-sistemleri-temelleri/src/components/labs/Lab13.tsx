"use client";
import { useEffect, useState } from "react";
import { checkAccess, octal, symbolic, type Op } from "@/lib/perm";
import { Callout, Tabs } from "@/components/ui";

type F = { name: string; owner: string; group: string; mode: number; dir?: boolean; secret?: boolean; ssh?: boolean; hint: string };
const START: F[] = [
  { name: "rapor.txt", owner: "ag", group: "dev", mode: 0o644, hint: "Normal belge: 644 (sahip yazar, diğerleri okur) uygundur." },
  { name: "program.sh", owner: "ag", group: "dev", mode: 0o755, hint: "Çalıştırılabilir betik: 755 uygundur." },
  { name: "ozel-anahtar.pem", owner: "ag", group: "ag", mode: 0o644, secret: true, ssh: true, hint: "SSH özel anahtarı: 600 olmalı! Şu an 644: herkes okuyabiliyor." },
  { name: "maaslar.csv", owner: "maya", group: "finans", mode: 0o640, secret: true, hint: "Gizli veri: 640 (grup okur) veya 600 olmalı; diğerlerine kapalı." },
  { name: "site/ (web klasörü)", owner: "www-data", group: "www-data", mode: 0o755, dir: true, hint: "Web klasörü: 755. 777 asla verilmez; saldırgan dosya yükleyebilir." },
];
const USERS = [
  { name: "ag", groups: ["ag", "dev"], label: "ag (sahip)" },
  { name: "ayse", groups: ["ayse", "dev"], label: "ayse (dev grubu üyesi)" },
  { name: "maya", groups: ["maya", "finans"], label: "maya (finans grubu üyesi)" },
  { name: "misafir", groups: ["misafir"], label: "misafir (diğerleri)" },
  { name: "root", groups: ["root"], label: "root (yönetici)" },
];
const PRESETS: [number, string, string][] = [
  [0o755, "Programlar, klasörler, web dizinleri", "Sahip tam yetkili; grup ve diğerleri okuyup çalıştırabilir, yazamaz."],
  [0o644, "Normal belgeler", "Sahip okur/yazar; grup ve diğerleri yalnızca okur."],
  [0o700, "Kişisel özel klasörler", "Yalnızca sahip: okur, yazar, girer. Diğer herkes engelli."],
  [0o600, "Özel anahtarlar, parola dosyaları", "Yalnızca sahip okur/yazar. SSH anahtarları için zorunlu."],
];
const PRINCIPALS = ["Administrators", "Users", "Everyone", "Ogrenci"];
const PERMS = ["Full Control", "Modify", "Read & Execute", "Read", "Write"];
const NTFS_USERS: Record<string, string[]> = { "Ogrenci (standart kullanıcı)": ["Ogrenci", "Users", "Everyone"], "Misafir (yalnızca Everyone)": ["Everyone"], "Yonetici (Administrators üyesi)": ["Administrators", "Users", "Everyone"] };

export default function Lab13({ done }: { done: (id: string) => void }) {
  const [tab, setTab] = useState<"linux" | "ntfs">("linux");
  const [files, setFiles] = useState<F[]>(START.map((f) => ({ ...f })));
  const [idx, setIdx] = useState(0);
  const [num, setNum] = useState("");
  const [presetSeen, setPresetSeen] = useState<number[]>([]);
  const [tuser, setTuser] = useState("misafir");
  const [res, setRes] = useState<{ ok: boolean; text: string } | null>(null);
  const [lastPreset, setLastPreset] = useState<number | null>(null);
  const f = files[idx];

  const [acl, setAcl] = useState<Record<string, Record<string, boolean>>>({
    Administrators: { "Full Control": true }, Users: { "Read & Execute": true, Read: true }, Everyone: { Read: true }, Ogrenci: {},
  });
  const [denyW, setDenyW] = useState(false);
  const [nuser, setNuser] = useState(Object.keys(NTFS_USERS)[0]);
  const [nres, setNres] = useState<string | null>(null);
  const [ntfsChanged, setNtfsChanged] = useState(false);
  const [ntfsTested, setNtfsTested] = useState(false);

  useEffect(() => { if (presetSeen.length >= 4) done("presets"); }, [presetSeen]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (ntfsChanged && ntfsTested) done("ntfs"); }, [ntfsChanged, ntfsTested]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (f.mode & 0o002) done("risk"); }, [f.mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const setMode = (m: number) => { setFiles((fs) => fs.map((x, i) => (i === idx ? { ...x, mode: m } : x))); setRes(null); };
  const toggle = (cls: 0 | 1 | 2, bit: number) => { const sh = (2 - cls) * 3; setMode(f.mode ^ (bit << sh)); done("change"); };
  const risks: { t: "danger" | "warn"; m: string }[] = [];
  if ((f.mode & 0o777) === 0o777) risks.push({ t: "danger", m: "777: herkes okuyabilir, değiştirebilir ve çalıştırabilir. Saldırgan dosyayı değiştirip zararlı kod yerleştirebilir. Bu ayar neredeyse hiçbir zaman doğru değildir." });
  else if (f.mode & 0o002) risks.push({ t: "danger", m: "Diğerlerine YAZMA izni var: sistemdeki her kullanıcı (veya ele geçirilmiş bir servis hesabı) bu dosyayı değiştirebilir." });
  if (f.secret && f.mode & 0o004) risks.push({ t: "danger", m: "Gizli içerik herkes tarafından okunabilir (others: r). Parola/anahtar sızıntısına yol açar." });
  if (f.ssh && ![0o600, 0o400].includes(f.mode & 0o777)) risks.push({ t: "warn", m: "SSH, özel anahtar 600/400 değilse reddeder: 'UNPROTECTED PRIVATE KEY FILE!'. Doğru izin: 600." });
  if (!f.dir && f.mode & 0o001 && !f.name.endsWith(".sh") && f.mode & 0o004) risks.push({ t: "warn", m: "Veri dosyalarının çalıştırılabilir (x) olması gereksizdir; en az yetki ilkesine aykırıdır." });
  if (f.dir && !(f.mode & 0o100)) risks.push({ t: "warn", m: "Klasörde sahip için x yok: sahibi bile klasöre giremez." });

  const runTest = (op: Op) => {
    const u = USERS.find((x) => x.name === tuser)!;
    const r = checkAccess(f, u, op);
    setRes({ ok: r.ok, text: r.reason });
    if (!r.ok) done("denied");
  };
  const mat = USERS.map((u) => ({ u, r: (["r", "w", "x"] as Op[]).map((o) => checkAccess(f, u, o).ok) }));

  const has = (p: string, perm: string) => !!acl[p]?.[perm];
  const eff = (principals: string[]) => {
    const any = (...ps: string[]) => principals.some((pr) => ps.some((p) => has(pr, p)));
    const full = any("Full Control"), mod = full || any("Modify");
    return { full, modify: mod, rx: mod || any("Read & Execute"), read: mod || any("Read & Execute", "Read"), write: (mod || any("Write")) && !(denyW), exec: mod || any("Read & Execute") };
  };
  const ntest = (a: string) => {
    const e = eff(NTFS_USERS[nuser]);
    const ok = a === "Oku" ? e.read : a === "Yaz" ? e.write : a === "Çalıştır" ? e.exec : a === "Sil" ? e.modify && !denyW : e.full;
    setNres(`${nuser.split(" ")[0]} → ${a}: ${ok ? "İZİN VERİLDİ ✓" : "ERİŞİM REDDEDİLDİ ✗ (Access is denied)"}${denyW && (a === "Yaz" || a === "Sil") ? " — açık 'Deny: Write' girişi Allow'u geçersiz kıldı." : ""}`);
    setNtfsTested(true);
  };
  const e = eff(NTFS_USERS[nuser]);

  return (
    <div className="space-y-4">
      <Tabs items={[{ id: "linux", label: "🐧 Linux izinleri (rwx)" }, { id: "ntfs", label: "🪟 Windows NTFS izinleri" }]} value={tab} onChange={setTab} />

      {tab === "linux" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="rounded-xl border border-line p-3">
              <p className="text-sm font-bold">1) Dosya seç</p>
              <div className="mt-2 flex flex-wrap gap-1.5">{files.map((x, i) => <button key={x.name} className={`btn btn-sm ${i === idx ? "btn-on" : ""}`} onClick={() => { setIdx(i); setRes(null); }}>{x.dir ? "📁" : "📄"} {x.name}</button>)}</div>
              <p className="mt-2 rounded-lg bg-soft px-3 py-2 text-xs">{f.hint}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <label>Sahip <select className="input !w-28" value={f.owner} onChange={(e2) => setFiles((fs) => fs.map((x, i) => (i === idx ? { ...x, owner: e2.target.value } : x)))}>{["ag", "ayse", "maya", "misafir", "www-data", "root"].map((x) => <option key={x}>{x}</option>)}</select></label>
                <label>Grup <select className="input !w-28" value={f.group} onChange={(e2) => setFiles((fs) => fs.map((x, i) => (i === idx ? { ...x, group: e2.target.value } : x)))}>{["ag", "dev", "finans", "misafir", "www-data", "root"].map((x) => <option key={x}>{x}</option>)}</select></label>
                <span className="text-muted">(chown: gerçekte sudo gerekir)</span>
              </div>
            </div>
            <div className="rounded-xl border border-line p-3">
              <p className="text-sm font-bold">2) İzinleri değiştir</p>
              <table className="tbl mt-2 text-center"><thead><tr><th></th><th className="!text-center">Okuma r(4)</th><th className="!text-center">Yazma w(2)</th><th className="!text-center">Çalıştırma x(1)</th></tr></thead><tbody>
                {(["Sahip (user)", "Grup (group)", "Diğerleri (others)"] as const).map((n, c) => (
                  <tr key={n}><td className="text-left font-semibold">{n}</td>{[4, 2, 1].map((b) => { const on = !!((f.mode >> ((2 - c) * 3)) & b); return <td key={b}><button aria-label={`${n} ${b}`} onClick={() => toggle(c as 0 | 1 | 2, b)} className={`h-8 w-12 rounded-lg border-2 text-sm font-bold ${on ? "border-ok bg-[#E3F2EA] text-ok" : "border-line text-muted"}`}>{on ? (b === 4 ? "r" : b === 2 ? "w" : "x") : "–"}</button></td>; })}</tr>
                ))}
              </tbody></table>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                <div className="card-soft p-2"><p className="text-[11px] text-muted">Sembolik</p><p className="mono text-lg font-bold text-brand">{symbolic(f.mode, f.dir)}</p></div>
                <div className="card-soft p-2"><p className="text-[11px] text-muted">Sayısal</p><p className="mono text-lg font-bold text-brand">{octal(f.mode)}</p></div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs"><span className="mono">chmod</span><input className="input !w-20 mono" maxLength={3} placeholder="755" value={num} onChange={(e2) => { const v = e2.target.value.replace(/[^0-7]/g, ""); setNum(v); if (v.length === 3) { setMode(parseInt(v, 8)); done("change"); } }} aria-label="Sayısal izin" /><span className="mono">{f.name.split(" ")[0]}</span></div>
              <div className="mt-3"><p className="mb-1 text-xs font-bold">Ön ayarlar (karşılaştır):</p><div className="flex flex-wrap gap-1.5">{PRESETS.map(([m]) => <button key={m} className={`btn btn-sm mono ${lastPreset === m ? "btn-on" : ""}`} onClick={() => { setMode(m); setLastPreset(m); setPresetSeen((s) => (s.includes(m) ? s : [...s, m])); done("change"); }}>{octal(m)}</button>)}<button className="btn btn-sm btn-danger mono" onClick={() => setMode(0o777)}>777</button></div>
                {lastPreset !== null && <p className="mt-2 rounded-lg bg-soft px-3 py-2 text-xs"><b>{octal(lastPreset)}</b> — {PRESETS.find((p) => p[0] === lastPreset)![1]}. {PRESETS.find((p) => p[0] === lastPreset)![2]}</p>}</div>
            </div>
          </div>

          <div className="space-y-3">
            {risks.length > 0 ? risks.map((r, i) => <Callout key={i} type={r.t} title={r.t === "danger" ? "Güvenlik riski" : "Dikkat"}>{r.m}</Callout>) : <Callout type="tip" title="İzin makul görünüyor">Bu dosya için mevcut izin, en az yetki ilkesine aykırı bir durum içermiyor.</Callout>}
            <div className="rounded-xl border border-line p-3">
              <p className="text-sm font-bold">3) Erişim testi</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <select className="input !w-auto" value={tuser} onChange={(e2) => { setTuser(e2.target.value); setRes(null); }}>{USERS.map((u) => <option key={u.name} value={u.name}>{u.label}</option>)}</select>
                <button className="btn btn-sm" onClick={() => runTest("r")}>Oku</button><button className="btn btn-sm" onClick={() => runTest("w")}>Yaz</button><button className="btn btn-sm" onClick={() => runTest("x")}>Çalıştır</button>
              </div>
              {res && <div className="mt-2"><Callout type={res.ok ? "tip" : "danger"} title={res.ok ? "İzin verildi" : "Erişim reddedildi"}>{res.text}</Callout></div>}
              <p className="mb-1 mt-3 text-xs font-bold">Tüm kullanıcılar için özet ({f.name.split(" ")[0]}):</p>
              <table className="tbl text-center text-xs"><thead><tr><th className="!text-left">Kullanıcı</th><th className="!text-center">r</th><th className="!text-center">w</th><th className="!text-center">x</th></tr></thead><tbody>
                {mat.map((m) => <tr key={m.u.name}><td className="!text-left">{m.u.label}</td>{m.r.map((ok, i) => <td key={i} className={ok ? "text-ok" : "text-bad"}>{ok ? "✓" : "✗"}</td>)}</tr>)}
              </tbody></table>
            </div>
          </div>
        </div>
      )}

      {tab === "ntfs" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-line p-3">
            <p className="text-sm font-bold">📁 C:\Lab\Gizli — Güvenlik sekmesi (ACL)</p>
            <p className="mb-2 text-xs text-muted">Her kullanıcı/grup için verilen (Allow) izinleri işaretle.</p>
            <div className="scroll-x"><table className="tbl text-center text-xs"><thead><tr><th className="!text-left">Kullanıcı/Grup</th>{PERMS.map((p) => <th key={p} className="!text-center">{p}</th>)}</tr></thead><tbody>
              {PRINCIPALS.map((pr) => <tr key={pr}><td className="!text-left font-semibold">{pr}</td>{PERMS.map((p) => <td key={p}><input type="checkbox" aria-label={`${pr} ${p}`} checked={has(pr, p)} onChange={() => { setAcl((a) => ({ ...a, [pr]: { ...a[pr], [p]: !a[pr]?.[p] } })); setNtfsChanged(true); }} /></td>)}</tr>)}
            </tbody></table></div>
            <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs font-semibold"><input type="checkbox" checked={denyW} onChange={(e2) => { setDenyW(e2.target.checked); setNtfsChanged(true); }} /> Everyone için açık <b className="text-bad">Deny (Engelle): Write</b> ekle</label>
            <p className="mt-2 text-xs text-muted">Kurallar: izinler kullanıcının ve üye olduğu grupların birleşimidir; Full Control ⊃ Modify ⊃ Read &amp; Execute ⊃ Read; açık Deny, Allow&apos;u geçersiz kılar.</p>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-line p-3">
              <p className="text-sm font-bold">Kullanıcı testi</p>
              <select className="input mt-2" value={nuser} onChange={(e2) => { setNuser(e2.target.value); setNres(null); }}>{Object.keys(NTFS_USERS).map((u) => <option key={u}>{u}</option>)}</select>
              <p className="mt-2 text-xs text-muted">Etkin gruplar: {NTFS_USERS[nuser].join(", ")}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">{["Oku", "Yaz", "Çalıştır", "Sil", "İzinleri değiştir"].map((a) => <button key={a} className="btn btn-sm" onClick={() => ntest(a)}>{a}</button>)}</div>
              {nres && <div className="mt-2"><Callout type={nres.includes("VERİLDİ") ? "tip" : "danger"} title="Sonuç">{nres}</Callout></div>}
              <p className="mt-2 text-xs">Etkin yetki: {[e.full && "Full Control", e.modify && "Modify", e.rx && "Read & Execute", e.read && "Read", e.write && "Write"].filter(Boolean).join(" • ") || "Hiçbiri"}</p>
            </div>
            <Callout type="warn" title="Risk örneği">&quot;Everyone: Full Control&quot; verilen bir paylaşım klasöründe fidye yazılımı tüm dosyaları şifreleyebilir; herkesin yazabildiği yerde tek bir hesabın ele geçirilmesi yeterlidir. Çözüm: en az yetki — yalnızca gerekli grup, gerekli izin.</Callout>
            <table className="tbl text-xs"><thead><tr><th>Linux</th><th>NTFS karşılığı</th></tr></thead><tbody><tr><td>r</td><td>Read</td></tr><tr><td>w</td><td>Write / Modify</td></tr><tr><td>x</td><td>Read &amp; Execute</td></tr><tr><td>chmod / chown</td><td>icacls / Güvenlik sekmesi</td></tr></tbody></table>
          </div>
        </div>
      )}
    </div>
  );
}
