"use client";
import { useState } from "react";
import { checkAccess, octal, symbolic, type Op } from "@/lib/perm";
import { Callout, Pill } from "@/components/ui";

type U = { name: string; type: "admin" | "standard" | "service"; groups: string[] };
type F = { path: string; owner: string; group: string; mode: number; note: string };

const FILES: F[] = [
  { path: "/home/ag/proje.txt", owner: "ag", group: "dev", mode: 0o640, note: "Geliştirme ekibinin proje notları" },
  { path: "/finans/maaslar.xlsx", owner: "maya", group: "finans", mode: 0o660, note: "Gizli maaş tablosu" },
  { path: "/etc/shadow", owner: "root", group: "shadow", mode: 0o640, note: "Parola özetleri — yalnızca root" },
  { path: "/var/www/index.html", owner: "www-data", group: "www-data", mode: 0o644, note: "Web sitesi ana sayfası" },
  { path: "/usr/local/bin/yedekle.sh", owner: "root", group: "root", mode: 0o750, note: "Yönetici yedekleme betiği" },
];
const GROUPS = ["sudo", "dev", "finans", "misafir", "www-data"];

export default function Lab07({ done }: { done: (id: string) => void }) {
  const [users, setUsers] = useState<U[]>([
    { name: "root", type: "admin", groups: ["root"] },
    { name: "ag", type: "admin", groups: ["ag", "sudo", "dev"] },
    { name: "maya", type: "standard", groups: ["maya", "finans"] },
    { name: "misafir", type: "standard", groups: ["misafir"] },
  ]);
  const [cur, setCur] = useState("misafir");
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"standard" | "admin">("standard");
  const [msg, setMsg] = useState("");
  const [gUser, setGUser] = useState("misafir");
  const [gName, setGName] = useState("dev");
  const [file, setFile] = useState(FILES[0].path);
  const [res, setRes] = useState<null | { ok: boolean; text: string; sudoable: boolean; op: Op; viaSudo?: boolean }>(null);
  const [denied, setDenied] = useState<string[]>([]);
  const [lp, setLp] = useState<Record<string, boolean>>({});
  const [uac, setUac] = useState<string | null>(null);

  const user = users.find((u) => u.name === cur)!;
  const canSudo = user.groups.includes("sudo") || user.name === "root";

  const create = () => {
    const n = newName.trim().toLowerCase();
    if (!/^[a-z][a-z0-9_-]{1,15}$/.test(n)) return setMsg("Geçersiz ad: küçük harfle başlamalı, 2-16 karakter (harf, rakam, - veya _).");
    if (users.some((u) => u.name === n)) return setMsg("Bu kullanıcı zaten var.");
    setUsers([...users, { name: n, type: newType, groups: [n, ...(newType === "admin" ? ["sudo"] : [])] }]);
    setMsg(`'${n}' kullanıcısı oluşturuldu (${newType === "admin" ? "yönetici — sudo grubunda" : "standart kullanıcı"}). Ev dizini: /home/${n}`);
    setNewName(""); setGUser(n); done("create");
  };
  const grp = (add: boolean) => {
    if (gUser === "root") return setMsg("root hesabının grupları değiştirilmez.");
    setUsers(users.map((u) => (u.name === gUser ? { ...u, groups: add ? Array.from(new Set([...u.groups, gName])) : u.groups.filter((g) => g !== gName || g === u.name) } : u)));
    setMsg(`${gUser} kullanıcısı ${add ? "şu gruba eklendi" : "şu gruptan çıkarıldı"}: ${gName}`);
    if (add) done("group");
  };
  const test = (op: Op, sudo = false) => {
    const f = FILES.find((x) => x.path === file)!;
    const p = sudo ? { name: "root", groups: ["root"] } : { name: user.name, groups: user.groups };
    const r = checkAccess(f, p, op);
    const key = `${user.name}|${f.path}|${op}`;
    const opName = op === "r" ? "okuma" : op === "w" ? "yazma" : "çalıştırma";
    if (!r.ok) { setDenied((d) => (d.includes(key) ? d : [...d, key])); done("denied"); }
    else if (denied.includes(key)) done("fix");
    if (r.ok && sudo) done("fix");
    setRes({ ok: r.ok, op, viaSudo: sudo, sudoable: !r.ok && canSudo && !sudo, text: `${sudo ? "[sudo ile root yetkisi] " : ""}${r.reason} → ${opName} ${r.ok ? "İZİN VERİLDİ ✓" : "ERİŞİM REDDEDİLDİ ✗ (Permission denied)"}` });
  };
  const runScenario = (admin: boolean) => { setLp((s) => ({ ...s, [admin ? "admin" : "standard"]: true })); if (Object.keys({ ...lp, [admin ? "admin" : "standard"]: true }).length >= 2) done("least"); };
  const f = FILES.find((x) => x.path === file)!;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-line p-3">
          <p className="mb-2 text-sm font-bold">👤 Kullanıcılar ve gruplar</p>
          <div className="scroll-x"><table className="tbl"><thead><tr><th>Kullanıcı</th><th>Tür</th><th>Gruplar</th></tr></thead><tbody>
            {users.map((u) => <tr key={u.name} className={u.name === cur ? "sel" : ""}><td className="font-semibold">{u.name}{u.name === cur && " ◀"}</td><td>{u.type === "admin" ? <Pill tone="warn">yönetici</Pill> : <Pill>standart</Pill>}</td><td className="mono text-xs">{u.groups.join(", ")}</td></tr>)}
          </tbody></table></div>
          <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
            <label className="text-xs font-semibold">Aktif kullanıcı (oturum değiştir)
              <select className="input mt-1" value={cur} onChange={(e) => { setCur(e.target.value); setRes(null); done("switch"); }}>{users.map((u) => <option key={u.name}>{u.name}</option>)}</select></label>
          </div>
          <div className="mt-3 rounded-lg bg-bg p-2">
            <p className="text-xs font-bold">Yeni kullanıcı oluştur</p>
            <div className="mt-1 flex flex-wrap gap-2">
              <input className="input !w-36" placeholder="kullanıcı adı" value={newName} onChange={(e) => setNewName(e.target.value)} aria-label="Yeni kullanıcı adı" />
              <select className="input !w-36" value={newType} onChange={(e) => setNewType(e.target.value as "standard" | "admin")}><option value="standard">Standart</option><option value="admin">Yönetici (sudo)</option></select>
              <button className="btn btn-sm btn-primary" onClick={create}>Oluştur</button>
            </div>
          </div>
          <div className="mt-2 rounded-lg bg-bg p-2">
            <p className="text-xs font-bold">Kullanıcıyı gruba ekle / çıkar</p>
            <div className="mt-1 flex flex-wrap gap-2">
              <select className="input !w-32" value={gUser} onChange={(e) => setGUser(e.target.value)}>{users.map((u) => <option key={u.name}>{u.name}</option>)}</select>
              <select className="input !w-32" value={gName} onChange={(e) => setGName(e.target.value)}>{GROUPS.map((g) => <option key={g}>{g}</option>)}</select>
              <button className="btn btn-sm btn-primary" onClick={() => grp(true)}>Ekle</button>
              <button className="btn btn-sm" onClick={() => grp(false)}>Çıkar</button>
            </div>
          </div>
          {msg && <p className="mt-2 rounded-lg bg-soft px-3 py-2 text-xs">{msg}</p>}
        </div>

        <div className="rounded-xl border border-line p-3">
          <p className="mb-2 text-sm font-bold">🔐 Dosya erişim testi — aktif kullanıcı: <span className="text-brand">{cur}</span></p>
          <label className="text-xs font-semibold">Dosya seç
            <select className="input mt-1" value={file} onChange={(e) => { setFile(e.target.value); setRes(null); }}>{FILES.map((x) => <option key={x.path} value={x.path}>{x.path}</option>)}</select></label>
          <div className="mt-2 rounded-lg bg-bg p-2 text-xs">
            <p className="mono font-semibold">{symbolic(f.mode)} ({octal(f.mode)}) {f.owner}:{f.group}</p>
            <p className="mt-0.5 text-muted">{f.note}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="btn btn-sm" onClick={() => test("r")}>📖 Oku (r)</button>
            <button className="btn btn-sm" onClick={() => test("w")}>✏ Yaz (w)</button>
            <button className="btn btn-sm" onClick={() => test("x")}>▶ Çalıştır (x)</button>
          </div>
          {res && (
            <div className="mt-3"><Callout type={res.ok ? "tip" : "danger"} title={res.ok ? "Erişim başarılı" : "Yetkisiz erişim"}>{res.text}</Callout>
              {!res.ok && (
                <div className="mt-2 space-y-1.5 text-xs text-muted">
                  <p>Çözüm yolları: kullanıcıyı dosyanın grubuna ekle (soldan) {canSudo ? "veya sudo kullan" : "— bu kullanıcı sudo grubunda olmadığı için sudo kullanamaz"}.</p>
                  {res.sudoable && <button className="btn btn-sm btn-primary" onClick={() => test(res.op, true)}>sudo ile yeniden dene</button>}
                </div>
              )}
            </div>
          )}
          <div className="mt-3 rounded-lg bg-bg p-2 text-xs">
            <p className="font-bold">Windows UAC örneği</p>
            <button className="btn btn-sm mt-1" onClick={() => setUac(user.type === "admin" ? "admin" : "std")}>Program kur…</button>
            {uac === "admin" && <div className="mt-2 rounded-lg border border-line bg-white p-2"><p className="font-bold">Kullanıcı Hesabı Denetimi</p><p>Bu uygulamanın cihazınızda değişiklik yapmasına izin vermek istiyor musunuz?</p><div className="mt-1 flex gap-2"><button className="btn btn-sm btn-primary" onClick={() => setUac("ok")}>Evet</button><button className="btn btn-sm" onClick={() => setUac(null)}>Hayır</button></div></div>}
            {uac === "std" && <div className="mt-2 rounded-lg border border-line bg-white p-2"><p className="font-bold">Yönetici izni gerekiyor</p><p>Standart kullanıcı olduğun için devam etmek için bir yönetici hesabının parolası istenir. Parolayı bilmiyorsan kurulum yapılamaz — bu koruma kasıtlıdır.</p><button className="btn btn-sm mt-1" onClick={() => setUac(null)}>Kapat</button></div>}
            {uac === "ok" && <p className="mt-2 text-ok">✓ Onay verildi (sanal). Yükseltilen işlem yalnızca bu program için geçerlidir.</p>}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-line p-4">
        <p className="text-sm font-bold">⚖ En az yetki ilkesi senaryosu: &quot;Kötü amaçlı ek açıldı&quot;</p>
        <p className="mt-1 text-sm text-muted">Bir çalışan e-postadaki &quot;fatura.pdf.exe&quot; dosyasını açtı ve zararlı kod çalıştı. Zararlı kod, çalışanın hesabının yetkileriyle çalışır. Hesap türüne göre sonucu karşılaştır:</p>
        <div className="mt-3 flex flex-wrap gap-2"><button className="btn btn-sm" onClick={() => runScenario(true)}>Yönetici hesabıyla çalıştır</button><button className="btn btn-sm btn-primary" onClick={() => runScenario(false)}>Standart hesapla çalıştır</button></div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {lp.admin && <div className="rounded-xl border border-[#EBC4C4] bg-[#FCF3F3] p-3 text-sm"><p className="font-bold text-bad">Yönetici hesabı — büyük hasar</p><ul className="mt-1 space-y-1">{["Sistem dosyaları değiştirildi ✗", "Arka kapı (backdoor) servisi kuruldu ✗", "Güvenlik yazılımı devre dışı bırakıldı ✗", "Tüm kullanıcıların dosyaları şifrelendi ✗"].map((x) => <li key={x}>{x}</li>)}</ul></div>}
          {lp.standard && <div className="rounded-xl border border-[#BFE0CF] bg-[#F3FAF6] p-3 text-sm"><p className="font-bold text-ok">Standart hesap — sınırlı hasar</p><ul className="mt-1 space-y-1">{["Kullanıcının kendi klasörleri etkilendi ⚠", "Sistem dosyalarına yazma reddedildi ✓", "Servis kurma izni yok ✓", "Güvenlik yazılımı kapatılamadı ✓", "Diğer kullanıcıların dosyaları güvende ✓"].map((x) => <li key={x}>{x}</li>)}</ul></div>}
        </div>
        {lp.admin && lp.standard && <div className="mt-3"><Callout type="tip" title="Ders">Aynı zararlı kod, düşük yetkili hesapta çok daha az zarar verdi. Günlük işlerde standart hesap kullanmak ve yetkiyi yalnızca gerektiğinde yükseltmek, hasarı sınırlar.</Callout></div>}
      </div>
    </div>
  );
}
