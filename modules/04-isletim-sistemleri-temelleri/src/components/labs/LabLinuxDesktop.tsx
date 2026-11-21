"use client";
import { useEffect, useState } from "react";
import { LinuxSim } from "@/lib/linux-sim";
import { symbolic } from "@/lib/perm";
import Terminal, { useShell } from "@/components/Terminal";
import { Callout, Window } from "@/components/ui";

const PARTS: [string, string, string][] = [
  ["Donanım", "En alt katman", "CPU, RAM, disk, ağ kartı gibi fiziksel bileşenler."],
  ["Linux Kernel", "Çekirdek", "Donanımı yönetir; süreç, bellek, dosya sistemi ve sürücüleri kontrol eder."],
  ["init / systemd", "Başlatıcı", "Kernel'den sonra çalışan ilk süreç (PID 1). Servisleri başlatır ve yönetir."],
  ["Kabuk (bash)", "Komut yorumlayıcı", "Terminalde yazdığın komutları yorumlayıp çalıştırır."],
  ["Display server (X11 / Wayland)", "Grafik altyapısı", "Pencerelerin ekrana çizilmesini ve klavye/fare olaylarını yönetir."],
  ["Masaüstü ortamı (GNOME / KDE / XFCE)", "Görsel arayüz", "Panel, menüler, pencere yöneticisi, dosya yöneticisi ve ayarlar."],
  ["Paket yöneticisi (apt / dnf)", "Yazılım yönetimi", "Yazılım kurar, günceller, kaldırır; bağımlılıkları çözer."],
  ["Uygulamalar", "Kullanıcı programları", "Tarayıcı, ofis paketi, medya oynatıcı, terminal vb."],
];

const KALI_CATS: [string, string, string, string][] = [
  ["01 — Bilgi Toplama", "Hedef sistem veya ağ hakkında açık bilgileri keşfetme.", "nmap, whois", "Yalnızca izin verilen ağ ve sistemlerde kullanılır."],
  ["02 — Zafiyet Analizi", "Sistemlerdeki bilinen güvenlik açıklarının taranması.", "nikto, tarayıcı araçlar", "Tarama bile izinsiz yapılırsa yasal sorun doğurur."],
  ["03 — Web Uygulama Analizi", "Web uygulamalarındaki hataların ve yapılandırma sorunlarının incelenmesi.", "nikto, sqlmap, burp", "Yalnızca sahibi olduğun veya yazılı izin aldığın sitelerde."],
  ["04 — Parola Testleri", "Parola gücü ve kimlik doğrulama dayanıklılığının sınanması.", "john, hydra", "Gerçek hesaplara karşı kullanmak suçtur; yalnızca laboratuvarda."],
  ["05 — Kablosuz Ağ Testleri", "Wi-Fi ağlarının güvenlik yapılandırmasını değerlendirme.", "aircrack-ng", "Başkasının ağına izinsiz müdahale suçtur."],
  ["06 — Ağ Analizi", "Ağ trafiğinin paket düzeyinde izlenmesi ve incelenmesi.", "wireshark, tcpdump", "Yalnızca kendi ağında veya izinli ağda trafik yakala."],
  ["07 — Sömürü Çerçeveleri", "Yetkili testlerde açıkların doğrulanması için çerçeveler.", "msfconsole", "Kapsam dışına çıkma; hasar verme."],
  ["08 — Adli Bilişim", "Disk ve bellek imajlarından delil analizi.", "autopsy", "Delil bütünlüğünü korumak için yalnızca kopya üzerinde çalış."],
  ["09 — Raporlama", "Bulguların belgelenmesi ve sorumlu şekilde raporlanması.", "not alma araçları", "Her test, yazılı bir rapora ve düzeltme önerilerine ulaşmalıdır."],
];

const APPS_MENU: [string, string][] = [["İnternet", "Tarayıcı ve e-posta uygulamaları."], ["Ofis", "Belge, hesap tablosu ve sunum uygulamaları."], ["Medya", "Müzik ve video oynatıcılar."], ["Sistem Araçları", "Sistem izleyici, disk yöneticisi, yazılım merkezi."], ["Ayarlar", "Ağ, ekran, kullanıcılar ve güç ayarları."]];

type App = null | "files" | "term" | "parts" | "menu" | "ethics";

export default function LabLinuxDesktop({ variant, done }: { variant: "linux" | "kali"; done: (id: string) => void }) {
  const kali = variant === "kali";
  const [sim] = useState(() => new LinuxSim(kali ? "kali" : "ubuntu"));
  const shell = useShell(() => sim, kali
    ? "AG CYBER LAB — Sanal Kali Linux (EĞİTİM SİMÜLASYONU)\nBu bir benzetimdir: gerçek Kali kurulu değildir, gerçek araç çalıştırılmaz.\n'help' ile komutları, 'kali-tools' ile araç kategorilerini gör.\n"
    : "AG CYBER LAB — Sanal Linux Terminali (EĞİTİM SİMÜLASYONU)\nKomutlar yalnızca sanal dosya sistemi üzerinde çalışır. 'help' yaz.\n",
  (line) => {
    done("term");
    if (kali) {
      if (/^ls(\s|$)/.test(line.trim())) done("ls");
      if (/^cd\s+(~\/|\/home\/ag\/)?lab\/?$/.test(line.trim())) done("cd");
      if (/^(touch|mkdir|cp|mv)\s/.test(line.trim()) && (sim.cwd.startsWith("/home/ag/lab") || line.includes("lab"))) done("files");
    }
  });
  const [app, setApp] = useState<App>(null);
  const [dir, setDir] = useState("/home/ag");
  const [visited, setVisited] = useState(0);
  const [partsSeen, setPartsSeen] = useState<number[]>([]);
  const [partSel, setPartSel] = useState<number | null>(null);
  const [cats, setCats] = useState<number[]>([]);
  const [catSel, setCatSel] = useState<number | null>(null);
  const [, bump] = useState(0);

  useEffect(() => { if (partsSeen.length >= 4) done("parts"); }, [partsSeen]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (cats.length >= 3) done("cats"); }, [cats]); // eslint-disable-line react-hooks/exhaustive-deps
  void visited;

  const entries = sim.entries(dir);
  const crumbs = dir.split("/").filter(Boolean);
  const openApp = (a: App) => { setApp(a); if (a === "menu" && !kali) done("menu"); if (a === "files" && dir === "/") bump((x) => x + 1); };
  const places: [string, string][] = [["Ev dizini", "/home/ag"], ["Documents", "/home/ag/Documents"], ["Downloads", "/home/ag/Downloads"], ["Desktop", "/home/ag/Desktop"], ...(kali ? ([["lab", "/home/ag/lab"]] as [string, string][]) : []), ["Dosya sistemi (/)", "/"], ["/etc", "/etc"]];

  return (
    <div className="space-y-3">
      <div className="relative h-[540px] overflow-hidden rounded-xl border border-line" style={{ background: kali ? "linear-gradient(135deg,#176B87 0%,#2d8a9c 50%,#38A3A5 100%)" : "linear-gradient(135deg,#9AD0DC 0%,#6bb7bd 50%,#E8F3F7 100%)" }}>
        <div className="absolute inset-x-0 top-0 z-20 flex h-9 items-center gap-3 bg-[#12303f] px-3 text-xs text-white">
          <button className="rounded px-2 py-1 font-semibold hover:bg-white/15" onClick={() => openApp(app === "menu" ? null : "menu")}>{kali ? "🐉 Uygulamalar" : "◉ Uygulamalar"} ▾</button>
          <span className="hidden text-white/70 sm:inline">{kali ? "Sanal Kali masaüstü (simülasyon)" : "Sanal Linux masaüstü (GNOME benzeri)"}</span>
          <span suppressHydrationWarning className="ml-auto">{new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })} • 📶 🔊</span>
        </div>

        {!app && (
          <div className="absolute left-3 top-14 grid gap-3">
            {([["files", "📁", "Dosyalar"], ["term", "⌨️", "Terminal"], ["parts", "🧩", "Bileşenler"], ...(kali ? [["ethics", "⚖️", "Etik"]] : [])] as [App, string, string][]).map(([a, ic, t]) => (
              <button key={t} onClick={() => openApp(a)} className="w-16 rounded-lg p-1 text-center text-[11px] font-semibold text-white hover:bg-white/20"><span className="block text-2xl">{ic}</span>{t}</button>
            ))}
            <div className="mt-2 w-44 rounded-lg bg-white/80 p-2 text-[11px] text-ink">Simgelere tıklayarak uygulamaları aç. Alt dock'tan da erişebilirsin.</div>
          </div>
        )}

        {app === "menu" && (
          <div className="absolute left-2 top-10 z-30 max-h-[470px] w-[min(92%,22rem)] overflow-auto rounded-xl border border-line bg-white p-2 shadow-xl">
            <p className="px-2 pb-1 text-xs font-bold text-muted">{kali ? "Kali araç kategorileri (tanıtım amaçlı)" : "Uygulama menüsü"}</p>
            {kali ? KALI_CATS.map((c, i) => (
              <button key={c[0]} className={`block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-soft ${catSel === i ? "bg-soft" : ""}`} onClick={() => { setCatSel(i); setCats((s) => (s.includes(i) ? s : [...s, i])); }}>{c[0]}</button>
            )) : APPS_MENU.map((c, i) => (
              <button key={c[0]} className={`block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-soft ${catSel === i ? "bg-soft" : ""}`} onClick={() => setCatSel(i)}>{c[0]}</button>
            ))}
            {catSel !== null && (
              <div className="mt-2 rounded-lg bg-bg p-3 text-sm">
                {kali ? (<><b className="text-brand">{KALI_CATS[catSel][0]}</b><p className="mt-1">{KALI_CATS[catSel][1]}</p><p className="mt-1 text-xs text-muted">Örnek araçlar: {KALI_CATS[catSel][2]} (bu simülasyonda çalışmaz)</p><p className="mt-1 text-xs font-semibold text-[#9A6A12]">⚖ {KALI_CATS[catSel][3]}</p></>) : (<><b className="text-brand">{APPS_MENU[catSel][0]}</b><p className="mt-1">{APPS_MENU[catSel][1]}</p></>)}
              </div>
            )}
            <div className="mt-2 flex gap-2"><button className="btn btn-sm" onClick={() => openApp("term")}>Terminal</button><button className="btn btn-sm" onClick={() => openApp("files")}>Dosyalar</button><button className="btn btn-sm" onClick={() => setApp(null)}>Kapat</button></div>
          </div>
        )}

        {app && app !== "menu" && (
          <div className="absolute inset-x-2 bottom-14 top-11 flex flex-col">
            <Window icon="🐧" title={app === "files" ? `Dosyalar — ${dir}` : app === "term" ? `Terminal — ${sim.user}@${sim.host}` : app === "parts" ? "Linux Sistem Bileşenleri" : "Etik Kullanım ve Yetkilendirme"} onClose={() => setApp(null)}>
              {app === "files" && (
                <div className="grid h-full grid-cols-[110px_1fr] text-sm sm:grid-cols-[150px_1fr]">
                  <div className="space-y-0.5 overflow-auto border-r border-line bg-bg p-2 text-xs">
                    {places.map(([n, p]) => <button key={p} onClick={() => setDir(p)} className={`block w-full rounded px-2 py-1 text-left hover:bg-soft ${dir === p ? "bg-soft font-bold text-brand" : ""}`}>{n}</button>)}
                  </div>
                  <div className="flex min-h-0 flex-col">
                    <div className="flex flex-wrap items-center gap-1 border-b border-line px-3 py-1.5 text-xs">
                      <button className="btn btn-sm" disabled={dir === "/"} onClick={() => setDir(dir.slice(0, dir.lastIndexOf("/")) || "/")}>↑ Yukarı</button>
                      <span className="mono font-semibold text-brand">/{crumbs.join("/")}</span>
                    </div>
                    <div className="overflow-auto">
                      <table className="tbl"><thead><tr><th>Ad</th><th>İzinler</th><th>Sahip</th><th>Boyut</th></tr></thead><tbody>
                        {entries.length === 0 && <tr><td colSpan={4} className="text-muted">Boş klasör</td></tr>}
                        {entries.map((e) => (
                          <tr key={e.path} className={e.t === "d" ? "click" : ""} onClick={() => { if (e.t === "d") { setDir(e.path); setVisited((v) => v + 1); done(kali ? "fm" : "files"); } }}>
                            <td>{e.t === "d" ? "📁" : "📄"} {e.name}</td><td className="mono text-xs">{symbolic(e.mode & 0o777, e.t === "d")}</td><td>{e.owner}</td><td>{e.t === "f" ? e.content.length : "—"}</td>
                          </tr>
                        ))}
                      </tbody></table>
                    </div>
                    <p className="mt-auto border-t border-line bg-bg px-3 py-1.5 text-xs text-muted">Terminalde oluşturduğun dosyalar burada da görünür (aynı sanal dosya sistemi).</p>
                  </div>
                </div>
              )}
              {app === "term" && <div className="p-2"><Terminal shell={shell} title={kali ? "Sanal Kali Terminal" : "Sanal Linux Terminal"} height={330} /></div>}
              {app === "parts" && (
                <div className="p-3 text-sm">
                  <p className="mb-2 text-xs text-muted">Yukarıdan aşağıya: kullanıcıya en yakın katmandan donanıma. Bir bileşene tıkla.</p>
                  <div className="grid gap-1.5">
                    {PARTS.slice().reverse().map((p, ri) => { const i = PARTS.length - 1 - ri; return (
                      <button key={p[0]} onClick={() => { setPartSel(i); setPartsSeen((s) => (s.includes(i) ? s : [...s, i])); }} className={`flex items-center justify-between rounded-lg border-2 px-3 py-2 text-left font-semibold ${partSel === i ? "border-brand bg-soft text-brand" : "border-line hover:border-accent"}`}><span>{p[0]}</span><span className="text-xs font-normal text-muted">{p[1]}</span></button>
                    ); })}
                  </div>
                  <div className="mt-3 rounded-lg bg-bg p-3">{partSel !== null ? <><b className="text-brand">{PARTS[partSel][0]}</b><p className="mt-1">{PARTS[partSel][2]}</p></> : <p className="text-muted">Bir bileşen seç.</p>}</div>
                </div>
              )}
              {app === "ethics" && (
                <div className="space-y-3 p-4 text-sm">
                  <Callout type="danger" title="Etik kullanım ve yetkilendirme">Kali Linux ve benzeri güvenlik araçları yalnızca sahibinden <b>yazılı izin</b> alınmış sistemlerde, belirlenen <b>kapsam</b> içinde kullanılabilir. İzinsiz tarama veya erişim birçok ülkede suçtur.</Callout>
                  <ol className="list-decimal space-y-1 pl-5"><li>Yazılı izin al.</li><li>Kapsamı (scope) belirle ve aşma.</li><li>Gerçek veriye zarar verme.</li><li>Bulguları sorumlu biçimde raporla.</li><li>Kendi izole laboratuvarında (sanal makine) öğren.</li></ol>
                  <Callout type="info" title="Bu simülasyon hakkında">Burada gerçek Kali kurulu değildir ve hiçbir gerçek araç çalıştırılmaz. Amaç, ortamı tanımak ve güvenli laboratuvar alışkanlığı kazanmaktır.</Callout>
                  <button className="btn btn-primary" onClick={() => done("ethics")}>✔ Okudum, anladım</button>
                </div>
              )}
            </Window>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 z-10 flex h-12 items-center justify-center gap-2 bg-white/80 backdrop-blur">
          {([["files", "📁 Dosyalar"], ["term", "⌨ Terminal"], ["parts", "🧩 Bileşenler"], ...(kali ? [["ethics", "⚖ Etik"]] : [])] as [App, string][]).map(([a, t]) => (
            <button key={t} className={`btn btn-sm ${app === a ? "btn-on" : ""}`} onClick={() => openApp(app === a ? null : a)}>{t}</button>
          ))}
        </div>
      </div>
      {kali && <Callout type="warn" title="Hatırlatma">Bu Kali masaüstü bir eğitim simülasyonudur; gerçek Kali kurulu veya gerçek araç çalıştırılıyor değildir. Araç adlarını terminale yazarsan yalnızca açıklama ve etik uyarı görürsün.</Callout>}
    </div>
  );
}
