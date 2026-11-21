"use client";
import { useEffect, useMemo, useState } from "react";
import { Tabs } from "@/components/ui";

type T = { n: string; d?: string; c?: T[] };
const f = (n: string, d?: string): T => ({ n, d });
const LINUX: T = { n: "", d: "Kök dizin (/): tüm dosya sisteminin tepesi. Diğer diskler buraya bağlanır (mount).", c: [
  { n: "bin", d: "Sistemin temel komutları (ls, cp, bash). Tüm kullanıcılar kullanabilir.", c: [f("ls", "Dizin listeleme komutu."), f("cp", "Kopyalama komutu."), f("bash", "Varsayılan kabuk.")] },
  { n: "boot", d: "Önyükleme (boot) dosyaları ve kernel imajı. Dikkatsiz değiştirmek sistemi açılmaz kılar.", c: [f("vmlinuz", "Linux kernel imajı.")] },
  { n: "dev", d: "Aygıt dosyaları: sda (disk), tty (terminal), null (kara delik). Linux'ta cihazlar da dosyadır.", c: [f("sda", "İlk disk aygıtı."), f("null", "Yazılanı yok eden özel aygıt.")] },
  { n: "etc", d: "Sistem ve hizmet yapılandırma dosyaları. Saldırganlar da, savunmacılar da burayı inceler.", c: [f("passwd", "Kullanıcı hesaplarını listeler (parola içermez)."), f("shadow", "Parola özetleri; yalnızca root okuyabilir."), f("hosts", "Yerel ad-IP eşlemeleri."), { n: "ssh", d: "SSH sunucu/istemci yapılandırması.", c: [f("sshd_config", "SSH sunucu ayarları.")] }] },
  { n: "home", d: "Normal kullanıcıların kişisel dosyaları. Her kullanıcının /home/<ad> dizini vardır.", c: [{ n: "ag", d: "ag kullanıcısının ev dizini (~).", c: [{ n: "Documents", d: "Belgeler.", c: [f("rapor.txt"), f("notlar.txt")] }, { n: "Downloads", d: "İndirilen dosyalar.", c: [f("kurulum.sh")] }, { n: "Desktop", d: "Masaüstü.", c: [] }, f(".bashrc", "Gizli (nokta ile başlayan) kabuk ayar dosyası.")] }, { n: "misafir", d: "Başka bir kullanıcının ev dizini.", c: [] }] },
  { n: "proc", d: "Çekirdek ve süreç bilgilerini dosya gibi sunan sanal dizin (diskte yer kaplamaz).", c: [f("cpuinfo", "İşlemci bilgisi."), f("meminfo", "Bellek bilgisi.")] },
  { n: "root", d: "Yönetici (root) kullanıcısının ev dizini. Normal kullanıcılar giremez. (Kök dizin / ile karıştırma!)", c: [] },
  { n: "tmp", d: "Geçici dosyalar. Herkes yazabilir; yeniden başlatmada silinebilir. Saldırganlar sık kötüye kullanır.", c: [f("gecici.tmp")] },
  { n: "usr", d: "Kullanıcı programları, kitaplıklar ve paylaşılan veriler (/usr/bin, /usr/lib, /usr/share).", c: [{ n: "bin", d: "Ek kullanıcı komutları ve programlar.", c: [f("python3"), f("nano")] }, { n: "lib", d: "Programların kitaplıkları.", c: [] }, { n: "share", d: "Mimariden bağımsız paylaşılan veriler (belgeler, simgeler).", c: [] }] },
  { n: "var", d: "Değişen veriler: günlükler (log), web siteleri, önbellekler, kuyruklar.", c: [{ n: "log", d: "Sistem ve hizmet günlükleri. Güvenlik incelemesinin ilk durağı.", c: [f("syslog", "Genel sistem günlüğü."), f("auth.log", "Giriş ve sudo kayıtları.")] }, { n: "www", d: "Web sunucusu dosyaları.", c: [f("index.html")] }] },
] };
const WIN: T = { n: "Bu Bilgisayar", d: "Bağlı tüm sürücüleri gösteren üst görünüm.", c: [
  { n: "C:", d: "Genellikle işletim sisteminin kurulu olduğu sistem sürücüsü (NTFS).", c: [
    { n: "Windows", d: "İşletim sistemi dosyaları.", c: [{ n: "System32", d: "Kritik sistem dosyaları ve araçları (cmd.exe, ipconfig.exe).", c: [f("cmd.exe"), f("notepad.exe")] }] },
    { n: "Program Files", d: "Kurulu 64 bit programlar.", c: [] },
    { n: "Users", d: "Kullanıcı profilleri.", c: [{ n: "Ogrenci", d: "Ogrenci kullanıcısının profili.", c: [{ n: "Desktop", d: "Masaüstü.", c: [] }, { n: "Documents", d: "Belgeler.", c: [f("rapor.txt"), f("notlar.txt")] }, { n: "Downloads", d: "İndirilenler.", c: [f("kurulum.exe")] }, { n: "Pictures", d: "Resimler.", c: [f("manzara.png")] }] }, { n: "Public", d: "Herkesle paylaşılan klasör.", c: [] }] },
    { n: "Lab", d: "Laboratuvar klasörü.", c: [f("hedefler.txt")] },
  ] },
  { n: "D:", d: "İkinci disk veya bölüm (ör. yedek diski).", c: [{ n: "Yedek", d: "Yedek dosyaları.", c: [f("eski-rapor.txt")] }] },
  { n: "E:", d: "USB bellek: exFAT biçimli, büyük dosya desteği ve platformlar arası kullanım.", c: [{ n: "Belgelerim", d: "USB'deki belgeler.", c: [] }] },
] };

const walk = (t: T, p: string[], acc: { p: string[]; dir: boolean }[]) => { acc.push({ p, dir: !!t.c }); t.c?.forEach((c) => walk(c, [...p, c.n], acc)); return acc; };
const rel = (from: string[], to: string[]) => { let i = 0; while (i < from.length && i < to.length && from[i] === to[i]) i++; const up = from.length - i; const r = [...Array(up).fill(".."), ...to.slice(i)].join("/"); return r || "."; };

export default function Lab06({ done }: { done: (id: string) => void }) {
  const [tab, setTab] = useState<"linux" | "win" | "rel" | "cmp">("linux");
  const [lp, setLp] = useState<string[]>([]);
  const [wp, setWp] = useState<string[]>([]);
  const [sel, setSel] = useState<T | null>(null);
  const [seen, setSeen] = useState<string[]>([]);
  const all = useMemo(() => walk(LINUX, [], []), []);
  const dirs = all.filter((x) => x.dir);
  const [from, setFrom] = useState("home/ag");
  const [to, setTo] = useState("etc/passwd");

  const nodeAt = (root: T, p: string[]) => p.reduce<T>((n, k) => n.c!.find((c) => c.n === k)!, root);
  const isL = tab === "linux";
  const path = isL ? lp : wp;
  const root = isL ? LINUX : WIN;
  const cur = nodeAt(root, path);
  const absStr = isL ? "/" + path.join("/") : path.length ? path[0] + "\\" + path.slice(1).join("\\") : "Bu Bilgisayar";
  useEffect(() => { if (seen.length >= 5) done("linux"); }, [seen]); // eslint-disable-line react-hooks/exhaustive-deps

  const enter = (c: T) => {
    if (c.c) {
      if (isL) { setLp([...lp, c.n]); const key = "/" + [...lp, c.n].join("/"); if (c.d) setSeen((s) => (s.includes(key) ? s : [...s, key])); }
      else { setWp([...wp, c.n]); if (wp.length >= 1) done("windows"); }
    }
    setSel(c);
  };
  const up = () => { (isL ? setLp : setWp)(path.slice(0, -1)); setSel(null); };

  return (
    <div className="space-y-4">
      <Tabs items={[{ id: "linux", label: "🐧 Linux dosya sistemi" }, { id: "win", label: "🪟 Windows dosya sistemi" }, { id: "rel", label: "↗ Göreli yol hesapla" }, { id: "cmp", label: "⚖ Karşılaştırma" }]} value={tab} onChange={(t) => { setTab(t); setSel(null); if (t === "cmp") done("compare"); }} />

      {(tab === "linux" || tab === "win") && (
        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-xl border border-line">
            <div className="flex flex-wrap items-center gap-2 border-b border-line bg-bg px-3 py-2">
              <button className="btn btn-sm" disabled={!path.length} onClick={up}>↑ Yukarı</button>
              <button className="btn btn-sm" disabled={!path.length} onClick={() => { (isL ? setLp : setWp)([]); setSel(null); }}>⌂ {isL ? "/" : "Bu Bilgisayar"}</button>
              <code className="mono break-all rounded bg-white px-2 py-1 text-xs font-semibold text-brand">{absStr}</code>
            </div>
            <div className="grid gap-1.5 p-3 sm:grid-cols-2">
              {(cur.c ?? []).length === 0 && <p className="col-span-full text-sm text-muted">Bu klasör boş.</p>}
              {(cur.c ?? []).map((c) => (
                <button key={c.n} onClick={() => enter(c)} className={`flex items-center gap-2 rounded-lg border p-2 text-left text-sm hover:border-brand ${sel === c ? "border-brand bg-soft" : "border-line"}`}>
                  <span className="text-lg">{c.c ? (isL || path.length ? "📁" : "💽") : "📄"}</span><span className="mono truncate font-semibold">{c.n}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="card-soft p-3 text-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-accent">{sel ? "Seçili öğe" : "Bulunduğun konum"}</p>
              <p className="mono mt-1 break-all font-bold text-brand">{sel ? (isL ? "/" + [...lp, ...(sel.c && sel === cur ? [] : [sel.n])].join("/") : [...wp, ...(sel === cur ? [] : [sel.n])].join("\\").replace("\\", "\\")) : absStr}</p>
              <p className="mt-2 text-ink">{(sel ?? cur).d ?? "Bu öğe bir dosyadır."}</p>
            </div>
            <div className="rounded-xl border border-line p-3 text-sm">
              <p className="font-semibold">Yol türleri</p>
              <p className="mt-1 text-muted">Mutlak yol: <code className="mono text-brand">{isL ? "/home/ag/Documents/rapor.txt" : "C:\\Users\\Ogrenci\\Documents\\rapor.txt"}</code></p>
              <p className="text-muted">Göreli yol (ev dizininden): <code className="mono text-brand">{isL ? "Documents/rapor.txt" : "Documents\\rapor.txt"}</code></p>
              {isL && <p className="mt-2 text-xs text-muted">Açıklaması olan dizinleri gez: /etc, /var, /home, /tmp, /usr… ({seen.length}/5 incelendi)</p>}
            </div>
          </div>
        </div>
      )}

      {tab === "rel" && (
        <div className="space-y-3 rounded-xl border border-line p-4">
          <p className="text-sm text-muted">Linux ağacında bir <b>başlangıç dizini</b> ve bir <b>hedef</b> seç; hedefe giden göreli yolu gör.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-semibold">Bulunduğun dizin
              <select className="input mt-1" value={from} onChange={(e) => { setFrom(e.target.value); done("rel"); }}>{dirs.map((d) => <option key={d.p.join("/")} value={d.p.join("/")}>/{d.p.join("/")}</option>)}</select></label>
            <label className="text-sm font-semibold">Hedef
              <select className="input mt-1" value={to} onChange={(e) => { setTo(e.target.value); done("rel"); }}>{all.map((d) => <option key={d.p.join("/")} value={d.p.join("/")}>/{d.p.join("/")}</option>)}</select></label>
          </div>
          <div className="card-soft p-3 text-sm">
            <p>Mutlak yol: <code className="mono font-bold text-brand">/{to}</code></p>
            <p className="mt-1">Göreli yol: <code className="mono font-bold text-brand">{rel(from ? from.split("/") : [], to ? to.split("/") : [])}</code></p>
            <p className="mt-1 text-xs text-muted">&quot;..&quot; bir üst dizine çıkmak demektir. Önce ortak atadan geriye çıkılır, sonra hedefe inilir.</p>
          </div>
        </div>
      )}

      {tab === "cmp" && (
        <div className="space-y-4">
          <div className="scroll-x rounded-xl border border-line"><table className="tbl min-w-[520px]"><thead><tr><th>Özellik</th><th>Windows</th><th>Linux</th></tr></thead><tbody>
            {[["En üst yapı", "Sürücü harfleri (C:, D:, E:)", "Tek kök dizin (/)"], ["Yol ayırıcı", "Ters eğik çizgi \\", "Düz eğik çizgi /"], ["Büyük/küçük harf", "Genellikle duyarsız", "Duyarlı (Rapor.txt ≠ rapor.txt)"], ["Kullanıcı klasörü", "C:\\Users\\Ad", "/home/ad"], ["Yönetici ev dizini", "C:\\Users\\Administrator", "/root"], ["Yapılandırma", "Ayarlar, Kayıt Defteri", "/etc altında metin dosyaları"], ["Günlükler", "Olay Görüntüleyici", "/var/log"], ["Yaygın dosya sistemi", "NTFS, exFAT, FAT32", "ext4, xfs, btrfs"], ["Dış disk", "Yeni sürücü harfi (E:)", "Bir dizine bağlanır (/media/…)"]].map((r) => <tr key={r[0]}><td className="font-semibold">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}
          </tbody></table></div>
          <div className="scroll-x rounded-xl border border-line"><table className="tbl min-w-[520px]"><thead><tr><th>Biçim</th><th>Tek dosya sınırı</th><th>İzin desteği</th><th>Kullanım</th></tr></thead><tbody>
            {[["NTFS", "Çok büyük (~16 EB)", "Var (ACL)", "Windows sistem diski"], ["FAT32", "4 GB", "Yok", "Eski, uyumlu USB/SD"], ["exFAT", "Çok büyük", "Yok", "Taşınabilir bellek, platformlar arası"], ["ext4", "Çok büyük (16 TB)", "Var (rwx)", "Linux'un yaygın dosya sistemi"]].map((r) => <tr key={r[0]}><td className="font-semibold">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>)}
          </tbody></table></div>
        </div>
      )}
    </div>
  );
}
