"use client";
import { useEffect, useState } from "react";
import { Callout, Pill, Tabs } from "@/components/ui";

type State = "Running" | "Ready" | "Waiting" | "Terminated";
type P = { pid: number; name: string; user: string; ppid: number; th: number; base: number; cpu: number; mem: number; state: State; svc?: string; desc: string };
type S = { name: string; display: string; desc: string; running: boolean; startup: string; prog: string; user: string; ppid: number; mem: number; base: number };
type OS = "win" | "lin";

const DATA: Record<OS, { procs: P[]; svcs: S[]; progs: string[] }> = {
  win: {
    procs: [
      { pid: 4, name: "System", user: "SYSTEM", ppid: 0, th: 120, base: 0.4, cpu: 0.4, mem: 2, state: "Running", desc: "Windows çekirdek süreci." },
      { pid: 788, name: "services.exe", user: "SYSTEM", ppid: 4, th: 8, base: 0.1, cpu: 0, mem: 8, state: "Waiting", desc: "Hizmet Denetim Yöneticisi; servisleri başlatır." },
      { pid: 964, name: "svchost.exe (Dhcp)", user: "LOCAL SERVICE", ppid: 788, th: 6, base: 0.3, cpu: 0.3, mem: 12, state: "Running", svc: "Dhcp", desc: "DHCP İstemcisi servisini barındırır." },
      { pid: 1012, name: "svchost.exe (Dnscache)", user: "NETWORK SERVICE", ppid: 788, th: 5, base: 0.2, cpu: 0, mem: 10, state: "Waiting", svc: "Dnscache", desc: "DNS önbellek servisini barındırır." },
      { pid: 2210, name: "explorer.exe", user: "Ogrenci", ppid: 788, th: 52, base: 1.5, cpu: 1.5, mem: 112, state: "Running", desc: "Masaüstü ve Dosya Gezgini." },
      { pid: 3120, name: "chrome.exe", user: "Ogrenci", ppid: 2210, th: 38, base: 6.8, cpu: 6.8, mem: 420, state: "Running", desc: "Web tarayıcısı; çok süreçlidir." },
      { pid: 3388, name: "notepad.exe", user: "Ogrenci", ppid: 2210, th: 4, base: 0.1, cpu: 0, mem: 14, state: "Ready", desc: "Not Defteri." },
      { pid: 4012, name: "MsMpEng.exe", user: "SYSTEM", ppid: 788, th: 24, base: 2.1, cpu: 2.1, mem: 190, state: "Running", svc: "WinDefend", desc: "Microsoft Defender Antimalware motoru." },
    ],
    svcs: [
      { name: "Dhcp", display: "DHCP Client", desc: "IP adresini otomatik alır.", running: true, startup: "Otomatik", prog: "svchost.exe (Dhcp)", user: "LOCAL SERVICE", ppid: 788, mem: 12, base: 0.3 },
      { name: "Dnscache", display: "DNS Client", desc: "Alan adı çözümlemelerini önbelleğe alır.", running: true, startup: "Otomatik", prog: "svchost.exe (Dnscache)", user: "NETWORK SERVICE", ppid: 788, mem: 10, base: 0.2 },
      { name: "WinDefend", display: "Microsoft Defender Antivirus", desc: "Gerçek zamanlı kötü amaçlı yazılım koruması.", running: true, startup: "Otomatik", prog: "MsMpEng.exe", user: "SYSTEM", ppid: 788, mem: 190, base: 2.1 },
      { name: "Spooler", display: "Print Spooler", desc: "Yazdırma işlerini yönetir.", running: false, startup: "Elle", prog: "spoolsv.exe", user: "SYSTEM", ppid: 788, mem: 18, base: 0.2 },
    ],
    progs: ["calc.exe", "mspaint.exe", "firefox.exe"],
  },
  lin: {
    procs: [
      { pid: 1, name: "systemd", user: "root", ppid: 0, th: 1, base: 0.0, cpu: 0, mem: 12, state: "Waiting", desc: "İlk süreç (PID 1); servisleri başlatır ve yönetir." },
      { pid: 512, name: "cron", user: "root", ppid: 1, th: 1, base: 0.0, cpu: 0, mem: 3, state: "Waiting", svc: "cron", desc: "Zamanlanmış görevleri çalıştırır." },
      { pid: 688, name: "sshd", user: "root", ppid: 1, th: 1, base: 0.0, cpu: 0, mem: 6, state: "Waiting", svc: "ssh", desc: "Uzaktan güvenli bağlantı (SSH) sunucusu." },
      { pid: 712, name: "NetworkManager", user: "root", ppid: 1, th: 3, base: 0.2, cpu: 0.2, mem: 18, state: "Running", svc: "NetworkManager", desc: "Ağ bağlantılarını yönetir." },
      { pid: 735, name: "nginx: master", user: "root", ppid: 1, th: 1, base: 0.0, cpu: 0, mem: 5, state: "Waiting", svc: "nginx", desc: "Web sunucusu ana süreci." },
      { pid: 736, name: "nginx: worker", user: "www-data", ppid: 735, th: 1, base: 0.3, cpu: 0.3, mem: 9, state: "Running", svc: "nginx", desc: "Web sunucusu işçi süreci; istekleri karşılar." },
      { pid: 1190, name: "gnome-shell", user: "ag", ppid: 1, th: 14, base: 1.8, cpu: 1.8, mem: 190, state: "Running", desc: "Masaüstü kabuğu." },
      { pid: 2044, name: "firefox", user: "ag", ppid: 1190, th: 60, base: 5.2, cpu: 5.2, mem: 380, state: "Ready", desc: "Web tarayıcısı." },
    ],
    svcs: [
      { name: "ssh", display: "OpenBSD Secure Shell server", desc: "Uzak makineden güvenli giriş sağlar.", running: true, startup: "enabled (açılışta)", prog: "sshd", user: "root", ppid: 1, mem: 6, base: 0 },
      { name: "nginx", display: "Nginx web sunucusu", desc: "Web sayfalarını sunar.", running: true, startup: "enabled (açılışta)", prog: "nginx: master", user: "root", ppid: 1, mem: 5, base: 0.3 },
      { name: "cron", display: "Zamanlanmış görevler", desc: "Belirli saatlerde komut çalıştırır.", running: true, startup: "enabled (açılışta)", prog: "cron", user: "root", ppid: 1, mem: 3, base: 0 },
      { name: "NetworkManager", display: "Ağ Yöneticisi", desc: "Wi-Fi ve kablolu ağları yönetir.", running: true, startup: "enabled (açılışta)", prog: "NetworkManager", user: "root", ppid: 1, mem: 18, base: 0.2 },
      { name: "cups", display: "Yazıcı servisi (CUPS)", desc: "Yazdırma işlerini yönetir.", running: false, startup: "disabled (elle)", prog: "cupsd", user: "root", ppid: 1, mem: 11, base: 0.1 },
    ],
    progs: ["gedit", "vlc", "htop"],
  },
};

const NEXT: Record<State, State[]> = { Ready: ["Running", "Terminated"], Running: ["Ready", "Waiting", "Terminated"], Waiting: ["Ready", "Terminated"], Terminated: [] };
const TR: Record<State, string> = { Running: "Çalışıyor (Running)", Ready: "Hazır (Ready)", Waiting: "Bekliyor (Waiting)", Terminated: "Sonlandı (Terminated)" };
const TONE: Record<State, "ok" | "info" | "warn" | "muted"> = { Running: "ok", Ready: "info", Waiting: "warn", Terminated: "muted" };

function invalidMsg(from: State, to: State) {
  if (from === to) return `Süreç zaten ${TR[to]} durumunda.`;
  if (from === "Terminated") return "Sonlanmış bir süreç geri dönmez. Programı yeniden çalıştırmak yeni bir süreç (yeni PID) oluşturur.";
  if (from === "Waiting" && to === "Running") return "Geçersiz geçiş: Bekleyen süreç, beklediği olay (disk, ağ vb.) gerçekleşince önce HAZIR (Ready) kuyruğuna girer; CPU'yu zamanlayıcı (scheduler) verir.";
  if (from === "Ready" && to === "Waiting") return "Geçersiz geçiş: Hazır süreç CPU'da çalışmıyor; bir giriş/çıkış isteği yapamaz. Beklemeye geçmek için önce Running olmalı.";
  return "Bu geçiş geçerli değil.";
}

export default function Lab08({ done }: { done: (id: string) => void }) {
  const [os, setOs] = useState<OS>("win");
  const [procs, setProcs] = useState<P[]>(() => DATA.win.procs.map((p) => ({ ...p })));
  const [svcs, setSvcs] = useState<S[]>(() => DATA.win.svcs.map((s) => ({ ...s })));
  const [sel, setSel] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ t: string; ok: boolean } | null>(null);
  const [nextPid, setNextPid] = useState(5000);
  const [prog, setProg] = useState(DATA.win.progs[0]);

  const swap = (o: OS) => { setOs(o); setProcs(DATA[o].procs.map((p) => ({ ...p }))); setSvcs(DATA[o].svcs.map((s) => ({ ...s }))); setSel(null); setMsg(null); setProg(DATA[o].progs[0]); };
  useEffect(() => {
    const t = setInterval(() => setProcs((ps) => ps.map((p) => (p.state === "Running" ? { ...p, cpu: Math.max(0, +(p.base + (Math.random() - 0.5) * Math.max(0.4, p.base * 0.4)).toFixed(1)) } : { ...p, cpu: p.state === "Terminated" ? 0 : 0 }))), 1800);
    return () => clearInterval(t);
  }, []);

  const p = procs.find((x) => x.pid === sel) ?? null;
  const setState = (to: State) => {
    if (!p) return;
    if (!NEXT[p.state].includes(to)) { setMsg({ t: invalidMsg(p.state, to), ok: false }); done("invalid"); return; }
    setProcs((ps) => ps.map((x) => (x.pid === p.pid ? { ...x, state: to, cpu: to === "Running" ? x.base : 0 } : x)));
    if (to === "Terminated" && p.svc) setSvcs((ss) => ss.map((s) => (s.name === p.svc ? { ...s, running: false } : s)));
    setMsg({ t: `PID ${p.pid} (${p.name}): ${TR[p.state]} → ${TR[to]}. ${to === "Terminated" ? "Süreç sonlandırıldı (yalnızca sanal)." : "Geçerli geçiş."}`, ok: true });
    done("state");
  };
  const stopSvc = (s: S) => {
    setSvcs((ss) => ss.map((x) => (x.name === s.name ? { ...x, running: false } : x)));
    setProcs((ps) => ps.map((x) => (x.svc === s.name ? { ...x, state: "Terminated", cpu: 0 } : x)));
    setMsg({ t: `${s.name} servisi durduruldu; ilişkili süreçler sonlandı.`, ok: true }); done("svcstop");
  };
  const startSvc = (s: S) => {
    const pid = nextPid; setNextPid(pid + 7);
    setSvcs((ss) => ss.map((x) => (x.name === s.name ? { ...x, running: true } : x)));
    setProcs((ps) => [...ps.filter((x) => !(x.svc === s.name && x.state === "Terminated")), { pid, name: s.prog, user: s.user, ppid: s.ppid, th: 3, base: s.base, cpu: s.base, mem: s.mem, state: "Running", svc: s.name, desc: `${s.display} servisinin süreci (yeniden başlatıldı, yeni PID).` }]);
    setSel(pid); setMsg({ t: `${s.name} servisi başlatıldı → yeni süreç oluştu (PID ${pid}).`, ok: true }); done("svcstart");
  };
  const spawn = () => {
    const pid = nextPid; setNextPid(pid + 7);
    setProcs((ps) => [...ps, { pid, name: prog, user: os === "win" ? "Ogrenci" : "ag", ppid: os === "win" ? 2210 : 1190, th: 4, base: 0.8, cpu: 0, mem: 40, state: "Ready", desc: "Yeni başlatılan sanal süreç. Hazır kuyruğunda CPU bekliyor." }]);
    setSel(pid); setMsg({ t: `${prog} başlatıldı: PID ${pid}, durum Hazır (Ready). Çalıştır düğmesiyle zamanlayıcının seçmesini simüle et.`, ok: true }); done("newproc");
  };

  const alive = procs.filter((x) => x.state !== "Terminated");
  const cpu = alive.reduce((s, x) => s + x.cpu, 0), mem = alive.reduce((s, x) => s + x.mem, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Tabs items={[{ id: "win", label: "🪟 Windows görünümü" }, { id: "lin", label: "🐧 Linux görünümü" }]} value={os} onChange={swap} />
        <div className="flex gap-3 text-xs"><span className="chip">CPU %{cpu.toFixed(1)}</span><span className="chip">RAM {Math.round(mem)} MB</span><span className="chip">{alive.length} aktif süreç</span></div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="scroll-x rounded-xl border border-line">
          <table className="tbl min-w-[560px]"><thead><tr><th>PID</th><th>Ad</th><th>Kullanıcı</th><th>Durum</th><th>CPU%</th><th>RAM</th><th>Servis</th></tr></thead><tbody>
            {procs.map((x) => (
              <tr key={x.pid} className={`click ${sel === x.pid ? "sel" : ""}`} onClick={() => { setSel(x.pid); done("inspect"); }}>
                <td className="mono">{x.pid}</td><td className="font-semibold">{x.name}</td><td>{x.user}</td><td><Pill tone={TONE[x.state]}>{x.state}</Pill></td><td>{x.cpu.toFixed(1)}</td><td>{x.state === "Terminated" ? "—" : `${x.mem} MB`}</td><td>{x.svc ?? "—"}</td>
              </tr>
            ))}
          </tbody></table>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-line p-3 text-sm">
            {p ? (<>
              <p className="font-bold text-brand">{p.name} <span className="text-xs text-muted">PID {p.pid}</span></p>
              <p className="mt-1 text-ink">{p.desc}</p>
              <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs"><li>Üst süreç (PPID): <b>{p.ppid}</b></li><li>Thread sayısı: <b>{p.th}</b></li><li>CPU: <b>%{p.cpu.toFixed(1)}</b></li><li>RAM: <b>{p.state === "Terminated" ? 0 : p.mem} MB</b></li><li className="col-span-2">İlişkili servis: <b>{p.svc ?? "yok (kullanıcı uygulaması)"}</b></li></ul>
              <p className="mt-3 text-xs font-bold">Durumu değiştir (geçerli geçişler zamanlayıcı mantığına uyar):</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {(["Running", "Ready", "Waiting", "Terminated"] as State[]).map((s) => <button key={s} className={`btn btn-sm ${s === "Terminated" ? "btn-danger" : ""}`} onClick={() => setState(s)}>{s === "Running" ? "▶ Çalıştır" : s === "Ready" ? "⏳ Hazır" : s === "Waiting" ? "⏸ Beklet" : "■ Sonlandır"}</button>)}
              </div>
            </>) : <p className="text-muted">Detay görmek için bir süreç seç (PID, CPU, RAM, servis ilişkisi).</p>}
          </div>
          {msg && <Callout type={msg.ok ? "tip" : "warn"} title={msg.ok ? "İşlem" : "Geçersiz geçiş"}>{msg.t}</Callout>}
          <div className="rounded-xl border border-line p-3 text-sm">
            <p className="font-bold">Yeni sanal süreç başlat</p>
            <div className="mt-1 flex gap-2"><select className="input" value={prog} onChange={(e) => setProg(e.target.value)}>{DATA[os].progs.map((x) => <option key={x}>{x}</option>)}</select><button className="btn btn-primary btn-sm" onClick={spawn}>Başlat</button></div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-line">
        <p className="border-b border-line bg-bg px-3 py-2 text-sm font-bold">{os === "win" ? "Windows Hizmetleri (services.msc)" : "Linux servisleri (systemctl)"}</p>
        <div className="scroll-x"><table className="tbl min-w-[560px]"><thead><tr><th>Servis</th><th>Açıklama</th><th>Başlangıç</th><th>Durum</th><th></th></tr></thead><tbody>
          {svcs.map((s) => (
            <tr key={s.name}><td className="font-semibold">{s.name}<br /><span className="text-xs font-normal text-muted">{s.display}</span></td><td>{s.desc}</td><td className="text-xs">{s.startup}</td><td>{s.running ? <Pill tone="ok">Çalışıyor</Pill> : <Pill tone="muted">Durdu</Pill>}</td>
              <td>{s.running ? <button className="btn btn-sm btn-danger" onClick={() => stopSvc(s)}>Durdur</button> : <button className="btn btn-sm btn-primary" onClick={() => startSvc(s)}>Başlat</button>}</td></tr>
          ))}
        </tbody></table></div>
      </div>
      <p className="text-xs text-muted">Tüm süreçler ve servisler sanaldır; gerçek sisteminde hiçbir süreç sonlandırılmaz veya değiştirilmez.</p>
    </div>
  );
}
