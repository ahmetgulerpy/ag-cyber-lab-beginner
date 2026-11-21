"use client";
import { useEffect, useState } from "react";
import { WinEnv } from "@/lib/win-sim";
import { Window } from "@/components/ui";

type App = "explorer" | "taskmgr" | "settings" | "control" | "security" | null;
const base = (p: string) => p.slice(p.lastIndexOf("\\") + 1);
const parent = (p: string) => { const i = p.lastIndexOf("\\"); return i <= 2 ? p.slice(0, 2) + "\\" : p.slice(0, i); };

const INFO: Record<string, { title: string; icon: string; items: [string, string][] }> = {
  settings: { title: "Ayarlar (Settings)", icon: "⚙️", items: [["Sistem", "Ekran, ses, bildirimler, güç ve depolama ayarları."], ["Bluetooth ve cihazlar", "Yazıcı, fare, telefon gibi cihazların yönetimi."], ["Ağ ve internet", "Wi-Fi, Ethernet, VPN ve proxy ayarları."], ["Hesaplar", "Kullanıcı hesapları, oturum açma seçenekleri, parola/PIN."], ["Windows Update", "Güncellemeleri denetleme, yükleme ve erteleme."], ["Gizlilik ve güvenlik", "Uygulama izinleri (kamera, mikrofon, konum) ve Windows Güvenliği."]] },
  control: { title: "Denetim Masası (Control Panel)", icon: "🗂️", items: [["Programlar ve Özellikler", "Kurulu programları kaldırma ve Windows özelliklerini açma/kapama."], ["Kullanıcı Hesapları", "Klasik hesap türü ve parola yönetimi."], ["Ağ ve Paylaşım Merkezi", "Ağ bağdaştırıcı ayarları ve paylaşım seçenekleri."], ["Sistem ve Güvenlik", "Güvenlik duvarı, yedekleme, yönetimsel araçlar."], ["Aygıt Yöneticisi", "Donanımlar ve sürücüleri."], ["Görünüm ve Kişiselleştirme", "Tema, görev çubuğu ve klasör seçenekleri (dosya uzantılarını göster)."]] },
  security: { title: "Windows Güvenliği", icon: "🛡️", items: [["Virüsten ve tehditlerden koruma", "Microsoft Defender Antivirus: tarama ve gerçek zamanlı koruma."], ["Güvenlik Duvarı ve ağ koruması", "Gelen/giden bağlantıları filtreler."], ["Uygulama ve tarayıcı denetimi", "SmartScreen: güvensiz uygulama ve siteleri uyarır."], ["Hesap koruması", "Windows Hello, parola ve UAC (Kullanıcı Hesabı Denetimi)."], ["Cihaz güvenliği", "Secure Boot, TPM ve BitLocker disk şifrelemesi."], ["Windows Update", "Güvenlik yamaları. Güncel sistem = kapatılmış açıklar."]] },
};

export default function Lab02({ done }: { done: (id: string) => void }) {
  const [env] = useState(() => new WinEnv());
  const [, setV] = useState(0);
  const bump = () => setV((x) => x + 1);
  const [app, setApp] = useState<App>("explorer");
  const [start, setStart] = useState(false);
  const [dir, setDir] = useState("C:\\Users\\Ogrenci");
  const [sel, setSel] = useState<string | null>(null);
  const [clip, setClip] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("Bir dosya veya klasör seç; ad kutusuna yazıp işlem düğmelerini kullan.");
  const [entered, setEntered] = useState(false);
  const [opened, setOpened] = useState<string[]>([]);
  const [tsel, setTsel] = useState<number | null>(null);
  const [infoSel, setInfoSel] = useState<string>("");
  const [upd, setUpd] = useState("");

  const open = (a: App) => { setApp(a); setStart(false); if (a === "taskmgr") done("taskmgr"); if (a && INFO[a]) setOpened((o) => (o.includes(a) ? o : [...o, a])); setInfoSel(""); };
  useEffect(() => { if (opened.length >= 3) done("components"); }, [opened]); // eslint-disable-line react-hooks/exhaustive-deps

  const uniq = (p: string, n: string) => { let c = n, i = 2; while (env.exists(p.replace(/\\$/, "") + "\\" + c)) c = `${n} (${i++})`; return c; };
  const join = (d: string, n: string) => d.replace(/\\$/, "") + "\\" + n;
  const items = env.list(dir);
  const go = (p: string) => { setDir(p); setSel(null); };

  const newFolder = () => { const n = uniq(dir, name.trim() || "Yeni klasör"); env.mkdir(join(dir, n)); setName(""); setMsg(`'${n}' klasörü oluşturuldu.`); done("mkdir"); bump(); };
  const newFile = () => { const n = uniq(dir, name.trim() || "Yeni metin belgesi.txt"); env.writeFile(join(dir, n), ""); setName(""); setMsg(`'${n}' dosyası oluşturuldu.`); bump(); };
  const rename = () => { if (!sel) return setMsg("Önce bir öğe seç."); if (!name.trim()) return setMsg("Ad kutusuna yeni adı yaz."); const r = env.rename(sel, name.trim()); if (r) return setMsg("Bu adda bir öğe zaten var."); setMsg(`'${base(sel)}' → '${name.trim()}' olarak yeniden adlandırıldı.`); setName(""); setSel(null); done("rename"); bump(); };
  const copy = () => { if (!sel) return setMsg("Önce kopyalanacak öğeyi seç."); setClip(sel); setMsg(`'${base(sel)}' panoya kopyalandı. Başka klasöre gidip Yapıştır'a bas.`); };
  const paste = () => { if (!clip) return setMsg("Pano boş."); const n = uniq(dir, base(clip)); const r = env.copy(clip, join(dir, n)); setMsg(r ? "Yapıştırılamadı." : `'${n}' buraya yapıştırıldı.`); if (!r && parent(clip).toLowerCase() !== dir.toLowerCase()) done("copy"); else if (!r) done("copy"); bump(); };
  const del = () => { if (!sel) return setMsg("Önce bir öğe seç."); env.remove(sel); setMsg(`'${base(sel)}' silindi (sanal).`); setSel(null); bump(); };

  const crumbs = dir.split("\\").filter(Boolean);
  const cpuTotal = Math.min(100, env.procs.reduce((s, p) => s + p.cpu, 0));
  const memTotal = env.procs.reduce((s, p) => s + p.mem, 0);

  return (
    <div className="relative h-[560px] overflow-hidden rounded-xl border border-line" style={{ background: "linear-gradient(135deg,#BFE2EE 0%,#8FCFD8 45%,#E8F3F7 100%)" }}>
      <div className="absolute left-3 top-3 grid gap-3">
        {([["explorer", "📁", "Dosya Gezgini"], ["taskmgr", "📊", "Görev Yöneticisi"], ["settings", "⚙️", "Ayarlar"]] as [App, string, string][]).map(([a, ic, t]) => (
          <button key={t} onDoubleClick={() => open(a)} onClick={() => open(a)} className="w-16 rounded-lg p-1 text-center text-[11px] font-semibold text-ink hover:bg-white/50">
            <span className="block text-2xl">{ic}</span>{t}
          </button>
        ))}
      </div>

      {app && (
        <div className="absolute inset-x-2 bottom-12 top-2 sm:left-24">
          <div className="flex h-full flex-col">
            <Window title={app === "explorer" ? `Dosya Gezgini — ${dir}` : app === "taskmgr" ? "Görev Yöneticisi" : INFO[app].title} icon="🪟" onClose={() => setApp(null)}>
              {app === "explorer" && (
                <div className="flex h-full flex-col text-sm">
                  <div className="flex flex-wrap items-center gap-1.5 border-b border-line p-2">
                    <button className="btn btn-sm" onClick={() => { if (dir.length > 3) { if (entered) done("nav"); go(parent(dir)); } }} disabled={dir.length <= 3}>↑ Yukarı</button>
                    <input className="input !w-40" placeholder="ad yaz…" value={name} onChange={(e) => setName(e.target.value)} aria-label="Ad" />
                    <button className="btn btn-sm" onClick={newFolder}>📁+ Klasör</button>
                    <button className="btn btn-sm" onClick={newFile}>📄+ Dosya</button>
                    <button className="btn btn-sm" onClick={rename}>✏ Yeniden adlandır</button>
                    <button className="btn btn-sm" onClick={copy}>⧉ Kopyala</button>
                    <button className="btn btn-sm" onClick={paste} disabled={!clip}>📋 Yapıştır</button>
                    <button className="btn btn-sm btn-danger" onClick={del}>🗑 Sil</button>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 border-b border-line bg-bg px-3 py-1.5 text-xs">
                    {crumbs.map((c, i) => <button key={i} className="rounded px-1 font-semibold text-brand hover:bg-soft" onClick={() => go(crumbs.slice(0, i + 1).join("\\") + (i === 0 ? "\\" : ""))}>{c}{i < crumbs.length - 1 ? " ›" : ""}</button>)}
                  </div>
                  <div className="grid min-h-0 flex-1 grid-cols-[110px_1fr] sm:grid-cols-[150px_1fr]">
                    <div className="space-y-0.5 overflow-auto border-r border-line bg-bg p-2 text-xs">
                      {([["Masaüstü", "C:\\Users\\Ogrenci\\Desktop"], ["Belgeler", "C:\\Users\\Ogrenci\\Documents"], ["İndirilenler", "C:\\Users\\Ogrenci\\Downloads"], ["Resimler", "C:\\Users\\Ogrenci\\Pictures"], ["Yerel Disk (C:)", "C:\\"], ["Yedek (D:)", "D:\\"]] as [string, string][]).map(([n, p]) => (
                        <button key={n} onClick={() => go(p)} className="block w-full rounded px-2 py-1 text-left hover:bg-soft">{n}</button>
                      ))}
                    </div>
                    <div className="overflow-auto">
                      <table className="tbl"><thead><tr><th>Ad</th><th>Tür</th><th>Boyut</th><th>Değiştirme</th></tr></thead>
                        <tbody>
                          {items.length === 0 && <tr><td colSpan={4} className="text-muted">Bu klasör boş.</td></tr>}
                          {items.map((n) => (
                            <tr key={n.path} className={`click ${sel === n.path ? "sel" : ""}`} onClick={() => setSel(n.path)} onDoubleClick={() => { if (n.t === "d") { go(n.path); setEntered(true); } }}>
                              <td>{n.t === "d" ? "📁" : "📄"} {base(n.path)}</td><td>{n.t === "d" ? "Dosya klasörü" : "Dosya"}</td><td>{n.t === "f" ? `${n.content.length} B` : ""}</td><td>{n.mtime}</td>
                            </tr>
                          ))}
                        </tbody></table>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 border-t border-line bg-bg px-3 py-1.5 text-xs text-muted">
                    <span>{msg}</span>
                    {sel && env.get(sel)?.t === "d" && <button className="btn btn-sm" onClick={() => { go(sel); setEntered(true); }}>Aç ▸</button>}
                  </div>
                </div>
              )}
              {app === "taskmgr" && (
                <div className="p-3 text-sm">
                  <div className="mb-3 grid grid-cols-2 gap-3">
                    <div className="card-soft p-2"><p className="text-xs text-muted">CPU</p><p className="text-xl font-bold text-brand">%{cpuTotal.toFixed(1)}</p></div>
                    <div className="card-soft p-2"><p className="text-xs text-muted">Bellek</p><p className="text-xl font-bold text-brand">{Math.round(memTotal)} MB</p></div>
                  </div>
                  <div className="scroll-x"><table className="tbl"><thead><tr><th>Ad</th><th>PID</th><th>CPU</th><th>Bellek</th></tr></thead><tbody>
                    {env.procs.map((p, i) => <tr key={p.pid} className={`click ${tsel === i ? "sel" : ""}`} onClick={() => setTsel(i)}><td>{p.name}</td><td>{p.pid}</td><td>%{p.cpu.toFixed(1)}</td><td>{p.mem} MB</td></tr>)}
                  </tbody></table></div>
                  {tsel !== null && env.procs[tsel] && (
                    <div className="mt-3 rounded-lg border border-line p-3">
                      <p className="font-bold text-brand">{env.procs[tsel].name} <span className="text-xs text-muted">(PID {env.procs[tsel].pid})</span></p>
                      <p className="mt-1 text-ink">{env.procs[tsel].desc}</p>
                      <button className="btn btn-sm btn-danger mt-2" onClick={() => { env.procs.splice(tsel, 1); setTsel(null); bump(); }}>Görevi sonlandır (sanal)</button>
                    </div>
                  )}
                  <p className="mt-2 text-xs text-muted">Simülasyon: yalnızca sanal süreçler listelenir; gerçek sürecin sonlandırılması mümkün değildir.</p>
                </div>
              )}
              {app && INFO[app] && (
                <div className="p-3 text-sm">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {INFO[app].items.map(([t, d]) => (
                      <button key={t} onClick={() => setInfoSel(t + "|" + d)} className={`rounded-lg border p-2.5 text-left hover:border-brand ${infoSel.startsWith(t + "|") ? "border-brand bg-soft" : "border-line"}`}><b className="text-brand">{t}</b></button>
                    ))}
                  </div>
                  <div className="mt-3 rounded-lg bg-bg p-3">{infoSel ? <><b>{infoSel.split("|")[0]}</b><p className="mt-1">{infoSel.split("|")[1]}</p></> : <p className="text-muted">Açıklamasını görmek için bir öğeye tıkla. Simülasyon: gerçek ayarlar değişmez.</p>}</div>
                  {app === "security" && (
                    <div className="mt-3 flex flex-wrap items-center gap-2"><button className="btn btn-sm" onClick={() => { setUpd("Güncellemeler denetleniyor…"); setTimeout(() => setUpd("✓ Cihazınız güncel (sanal sonuç). Gerçek güncelleme yapılmadı."), 900); }}>Güncellemeleri denetle</button><span className="text-xs text-muted">{upd}</span></div>
                  )}
                </div>
              )}
            </Window>
          </div>
        </div>
      )}

      {start && (
        <div className="absolute bottom-12 left-2 z-20 w-60 rounded-xl border border-line bg-white p-2 shadow-xl">
          <p className="px-2 pb-1 text-xs font-bold text-muted">Başlat menüsü</p>
          {([["explorer", "📁 Dosya Gezgini"], ["taskmgr", "📊 Görev Yöneticisi"], ["settings", "⚙️ Ayarlar"], ["control", "🗂️ Denetim Masası"], ["security", "🛡️ Windows Güvenliği"]] as [App, string][]).map(([a, t]) => (
            <button key={t} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-soft" onClick={() => open(a)}>{t}</button>
          ))}
          <p className="mt-1 border-t border-line px-3 pt-2 text-[11px] text-muted">⏻ Güç seçenekleri simülasyonda kapalıdır.</p>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 flex h-10 items-center gap-2 border-t border-line bg-white/90 px-2 backdrop-blur">
        <button aria-label="Başlat" onClick={() => setStart((s) => !s)} className={`grid h-8 w-8 place-items-center rounded-md text-lg ${start ? "bg-soft" : "hover:bg-soft"}`}>⊞</button>
        {app && <span className="rounded-md bg-soft px-2 py-1 text-xs font-semibold text-brand">{app === "explorer" ? "Dosya Gezgini" : app === "taskmgr" ? "Görev Yöneticisi" : INFO[app].title}</span>}
        <span suppressHydrationWarning className="ml-auto text-xs text-muted">Görev çubuğu • 🔊 📶 {new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
    </div>
  );
}
