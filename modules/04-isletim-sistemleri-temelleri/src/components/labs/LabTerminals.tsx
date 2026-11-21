"use client";
import { useRef, useState } from "react";
import { LinuxSim } from "@/lib/linux-sim";
import { WinEnv, WinShell } from "@/lib/win-sim";
import { CMDREF, type CmdRef } from "@/data/cmdref";
import Terminal, { useShell } from "@/components/Terminal";
import { Callout, Pill, Tabs } from "@/components/ui";

const ERRRE = /(denied|No such file|not found|not permitted|not recognized|cannot|Cannot|invalid|Is a directory|not empty|Access is denied|could not|specified|syntax)/;

/* ------------------------------------------------------------------ */
/* Ders 09 ve Ders 11: Linux terminali                                  */
/* ------------------------------------------------------------------ */
export function LinuxTermLab({ mode, done }: { mode: "09" | "11"; done: (id: string) => void }) {
  const [sim] = useState(() => new LinuxSim("ubuntu"));
  const seen = useRef<Set<string>>(new Set());
  const wrote = useRef(false);
  const [typed, setTyped] = useState("");
  const [group, setGroup] = useState<CmdRef["group"]>("Dosya ve klasör");
  const [selCmd, setSelCmd] = useState<CmdRef>(CMDREF[0]);

  const onCmd = (raw: string, out: string) => {
    const l = raw.trim();
    const ok = !ERRRE.test(out);
    const first = l.replace(/^sudo\s+/, "").split(/\s+/)[0];
    if (mode === "09") {
      if (/^pwd\b/.test(l)) done("pwd");
      if (/^ls\s+(-\w*l\w*)/.test(l)) done("ls");
      if (/^cd\s+\S+/.test(l) && ok) done("cd");
      if (/command not found/.test(out)) done("unknown");
      if (/^echo\s.*>/.test(l) && ok) wrote.current = true;
      if (/^cat\s/.test(l) && wrote.current && ok && out) done("echo");
      if (/^history\b/.test(l)) done("history");
    } else {
      if (["pwd", "ls", "cd"].includes(first)) { seen.current.add(first); if (seen.current.size >= 3) done("nav"); }
      if (["mkdir", "touch"].includes(first) && ok) { seen.current.add(first); if (seen.current.has("mkdir") && seen.current.has("touch")) done("files"); }
      if (["cp", "mv"].includes(first) && ok) done("cpmv");
      if (["cat", "head", "tail"].includes(first) && ok) done("view");
      if (["grep", "find"].includes(first)) done("grep");
      if (first === "chmod" && ok) done("chmod");
      if (/^sudo\s/.test(l) && !/not in the sudoers/.test(out)) done("sudo");
      if (["df", "free", "ps", "top"].includes(first)) done("sys");
    }
  };

  const shell = useShell(() => sim, "AG CYBER LAB — Sanal Linux Terminali (EĞİTİM SİMÜLASYONU)\nKomutlar yalnızca önceden tanımlı sanal dosya sisteminde çalışır; gerçek sistemine dokunulmaz.\nBaşlamak için 'help' yaz. ↑/↓ geçmişte gezinir.\n", onCmd);
  const toks = typed.trim() ? typed.trim().split(/\s+/) : [];

  return (
    <div className="space-y-4">
      {mode === "09" && (
        <div className="rounded-xl border border-line p-3">
          <p className="text-sm font-bold">🧬 Komut anatomisi (yazdıkça ayrışır)</p>
          <div className="mt-2 flex min-h-9 flex-wrap items-center gap-1.5">
            {toks.length === 0 && <span className="text-sm text-muted">Terminale bir komut yazmaya başla, örn: ls -l /etc</span>}
            {toks.map((t, i) => {
              const kind = ["|", ">", ">>"].includes(t) ? "op" : i === 0 ? "cmd" : t.startsWith("-") ? "opt" : "arg";
              const st = { cmd: ["#176B87", "komut"], opt: ["#38A3A5", "seçenek"], arg: ["#25845B", "argüman"], op: ["#D69A32", "boru/yönlendirme"] }[kind]!;
              return <span key={i} className="rounded-lg px-2 py-1 text-xs font-semibold text-white" style={{ background: st[0] }}><span className="mono">{t}</span> <span className="opacity-80">· {st[1]}</span></span>;
            })}
          </div>
        </div>
      )}

      <div className={mode === "11" ? "grid gap-4 xl:grid-cols-[1.1fr_1fr]" : ""}>
        <div className="space-y-2">
          <Terminal shell={shell} title="Sanal Linux Terminal (bash benzeri)" height={mode === "11" ? 380 : 320} onType={setTyped} />
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-semibold text-muted">Hızlı komutlar:</span>
            {(mode === "09" ? ["pwd", "ls -l", "cd Documents", "cd ..", "lss", "echo 'Merhaba AG' > selam.txt", "cat selam.txt", "history"] : ["pwd", "ls -la", "mkdir -p proje", "touch proje/not.txt", "cp rapor.txt proje/", "cat notlar.txt", "grep -i failed /var/log/auth.log", "chmod 600 notlar.txt", "df -h", "free -h", "ps aux"]).map((c) => (
              <button key={c} className="btn btn-sm !px-2 !py-1 mono" onClick={() => shell.run(c)}>{c}</button>
            ))}
            <button className="btn btn-sm !px-2 !py-1" onClick={() => shell.run("clear")}>clear</button>
          </div>
        </div>

        {mode === "11" && (
          <div className="rounded-xl border border-line p-3">
            <p className="text-sm font-bold">📚 Komut rehberi ({CMDREF.length} komut)</p>
            <div className="mt-2"><Tabs items={(["Dosya ve klasör", "Sistem ve kullanıcı", "Diğer temel komutlar"] as CmdRef["group"][]).map((g) => ({ id: g, label: g.split(" ")[0] === "Diğer" ? "Diğer" : g.split(" ")[0] === "Sistem" ? "Sistem/Kullanıcı" : "Dosya/Klasör" }))} value={group} onChange={(g) => { setGroup(g); setSelCmd(CMDREF.find((c) => c.group === g)!); }} /></div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {CMDREF.filter((c) => c.group === group).map((c) => <button key={c.cmd} className={`btn btn-sm mono ${selCmd.cmd === c.cmd ? "btn-on" : ""} ${c.risk ? "!border-[#ebc4c4]" : ""}`} onClick={() => setSelCmd(c)}>{c.cmd}{c.risk ? " ⚠" : ""}</button>)}
            </div>
            <div className="mt-3 space-y-2 text-sm">
              <p className="text-base font-bold text-brand mono">{selCmd.cmd}</p>
              <p><b>Ne işe yarar:</b> {selCmd.what}</p>
              <p><b>Kullanım:</b> <code className="mono rounded bg-soft px-1.5 py-0.5 text-xs">{selCmd.usage}</code></p>
              <div><b>Parametre örnekleri:</b><ul className="mt-1 list-disc space-y-0.5 pl-5 text-xs">{selCmd.params.map((p) => <li key={p}>{p}</li>)}</ul></div>
              <div><b>Örnek çıktı:</b><pre className="term mt-1 overflow-x-auto p-2 text-xs">{selCmd.sample}</pre></div>
              <p><b>Günlük senaryo:</b> {selCmd.scenario}</p>
              {selCmd.risk && <Callout type="danger" title={`${selCmd.cmd} — dikkat edilecek riskler`}>{selCmd.risk}</Callout>}
              <div className="flex flex-wrap gap-2"><button className="btn btn-primary btn-sm" onClick={() => shell.run(selCmd.try)}>▶ Terminalde dene: <span className="mono">{selCmd.try}</span></button>{selCmd.cmd === "rm" && <button className="btn btn-sm btn-danger" onClick={() => shell.run("rm -rf /")}>⚠ rm -rf / dene (simülasyon engeller)</button>}</div>
            </div>
          </div>
        )}
      </div>
      {mode === "09" && <Callout type="info" title="Güvenli ortam">Bu terminal gerçek işletim sistemine komut göndermez; yalnızca önceden tanımlı sanal dosya sisteminde çalışır. Hata yaparsan sağ üstteki 'Laboratuvarı sıfırla' düğmesiyle başa dönebilirsin.</Callout>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ders 10 ve Ders 12: Windows terminalleri                             */
/* ------------------------------------------------------------------ */
const PAIRS: [string, string, string][] = [
  ["Dizin içeriğini listele", "dir", "Get-ChildItem"],
  ["Geçerli konumu göster", "cd", "Get-Location"],
  ["Klasör oluştur", "mkdir Deneme", "New-Item -ItemType Directory -Name Deneme"],
  ["Dosya içeriğini göster", "type Documents\\rapor.txt", "Get-Content Documents\\rapor.txt"],
  ["Dosya kopyala", "copy Documents\\rapor.txt Desktop", "Copy-Item Documents\\rapor.txt Desktop"],
  ["Dosya yeniden adlandır", "ren Desktop\\rapor.txt rapor2.txt", "Rename-Item Desktop\\rapor2.txt rapor3.txt"],
  ["Dosya taşı", "move Desktop\\rapor3.txt Documents", "Move-Item Desktop\\rapor2.txt Documents"],
  ["Süreçleri listele", "tasklist", "Get-Process"],
  ["Bilgisayar bilgisi", "systeminfo", "Get-ComputerInfo"],
  ["Tarih göster", "date /t", "Get-Date"],
  ["Ekranı temizle", "cls", "Clear-Host"],
];

const SCEN = [
  { id: "apipa", name: "1) 'İnternet yok' — IP adresi 169.254.x.x", sym: "Tarayıcı hiçbir siteyi açmıyor. ipconfig komutunda IPv4 adresi 169.254 ile başlıyor.", hint: "Adımlar: ipconfig → adresi yorumla (APIPA = DHCP'den IP alınamadı) → ipconfig /renew → ping google.com.", fix: null as null | string },
  { id: "dns", name: "2) Siteler açılmıyor ama IP ile ping çalışıyor", sym: "ping 8.8.8.8 yanıt veriyor ama ping google.com 'host bulunamadı' diyor.", hint: "Adımlar: ping 8.8.8.8 → ping google.com → nslookup google.com → ipconfig /flushdns → tekrar ping google.com.", fix: null },
  { id: "cable", name: "3) Hiçbir şeye ulaşılamıyor — kablo", sym: "ipconfig 'Media disconnected' gösteriyor. Hiçbir ağ işlemi çalışmıyor.", hint: "Adımlar: ipconfig → 'Media disconnected' = fiziksel bağlantı yok. Ethernet kablosunu tak (düğme) → ping google.com.", fix: "Ethernet kablosunu tak" },
  { id: "gw", name: "4) Yerel ağ var ama internet yok (modem)", sym: "ipconfig normal görünüyor, ağ geçidine ping gidiyor ama dış adreslere ulaşılamıyor.", hint: "Adımlar: ping 192.168.1.1 (çalışır) → ping 8.8.8.8 (başarısız) → tracert 8.8.8.8 (1. atlamadan sonra kesilir) → modemi yeniden başlat (düğme) → ping google.com.", fix: "Modemi yeniden başlat" },
];

const WIN_CMDS: [string, string][] = [["ipconfig", "IP adresi, maske ve ağ geçidi bilgisi. /all, /renew, /flushdns seçenekleri."], ["ping google.com", "Hedefe ICMP paketi yollayarak bağlantıyı test eder."], ["tracert 8.8.8.8", "Paketin hedefe giderken geçtiği yönlendiricileri listeler."], ["nslookup google.com", "Alan adının DNS ile çözümlenmesini sınar."], ["netstat", "Açık ağ bağlantıları ve dinleyen portlar."], ["hostname", "Bilgisayar adı."], ["whoami", "Aktif kullanıcı."], ["systeminfo", "İşletim sistemi, bellek ve yama bilgisi."], ["tasklist", "Çalışan süreçler ve PID'leri."], ["chkdsk", "Disk denetimi (simülasyon; yönetici gerekir)."], ["sfc /scannow", "Sistem dosyası denetimi (simülasyon; yönetici gerekir)."]];

export function WinTermLab({ mode, done }: { mode: "10" | "12"; done: (id: string) => void }) {
  const [env] = useState(() => new WinEnv());
  const both = useRef<Record<number, [boolean, boolean]>>({});
  const solved = useRef<Set<string>>(new Set());
  const [, setTick] = useState(0);
  const [admin, setAdmin] = useState(false);
  const [sc, setSc] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [solvedList, setSolvedList] = useState<string[]>([]);
  const [info, setInfo] = useState("");
  const scRef = useRef<string | null>(null);

  const banner = (n: string) => `Microsoft Windows [Version 10.0.22631.0] — ${n} (EĞİTİM SİMÜLASYONU)\nBu bir benzetimdir: gerçek Windows'a komut gönderilmez, sanal dosya sistemi kullanılır.\n`;
  const win = (m: "cmd" | "ps") => (line: string, out: string) => {
    const l = line.trim();
    const ok = !ERRRE.test(out);
    if (mode === "10") {
      if (m === "cmd" && /^dir\b/i.test(l)) done("cmd-dir");
      if (m === "cmd" && /^(mkdir|md)\s/i.test(l) && ok) done("cmd-mkdir");
      if (m === "ps" && /^(Get-ChildItem|gci|ls|dir)\b/i.test(l)) done("ps-gci");
      if (m === "ps" && /^New-Item\b/i.test(l) && ok) done("ps-new");
      if (m === "ps" && /^Get-Process\s*\|\s*Sort-Object.*\|\s*Select-Object/i.test(l) && out) done("pipe");
    } else {
      if (/^ipconfig/i.test(l)) done("ipconfig");
      if (/^ping\s/i.test(l)) done("ping");
      if (/^(tracert|nslookup)\b/i.test(l)) done("trace");
      if (/^netstat/i.test(l)) done("netstat");
      if (/^tasklist/i.test(l)) done("tasklist");
      if (/^(systeminfo|hostname|whoami)\b/i.test(l)) done("info");
    }
  };
  const cmd = useShell(() => new WinShell(env, "cmd"), banner("CMD"), win("cmd"));
  const ps = useShell(() => new WinShell(env, "ps"), banner("PowerShell"), win("ps"));

  const markPair = (i: number, which: 0 | 1) => {
    const cur = both.current[i] ?? [false, false];
    cur[which] = true; both.current[i] = cur;
    if (Object.values(both.current).filter((x) => x[0] && x[1]).length >= 3) done("compare");
  };

  if (mode === "12") {
    env.onPingOk = (t) => {
      const cur = scRef.current;
      if (cur && /google|8\.8\.8\.8|agcyberlab/i.test(t) && !solved.current.has(cur)) {
        solved.current.add(cur);
        const n = solved.current.size;
        setSolvedList([...solved.current]);
        if (n >= 1) done("sc1");
        if (n >= 2) done("sc2");
      }
    };
  }
  const startSc = (id: string | null) => {
    Object.assign(env.net, { cable: true, ip: "192.168.1.25", gwUp: true, dnsOk: true, dhcpOk: true });
    if (id === "apipa") env.net.ip = "169.254.33.12";
    if (id === "dns") env.net.dnsOk = false;
    if (id === "cable") env.net.cable = false;
    if (id === "gw") env.net.gwUp = false;
    scRef.current = id; setSc(id); setShowHint(false); setInfo(id ? "Senaryo hazırlandı. Terminalde komutlarla tanıla ve çöz." : "Ağ normal duruma döndü.");
  };
  const fixBtn = () => {
    if (sc === "cable") { env.net.cable = true; setInfo("Ethernet kablosu takıldı (sanal). ipconfig ile durumu kontrol et; ardından ping google.com dene."); }
    if (sc === "gw") { env.net.gwUp = true; setInfo("Modem yeniden başlatıldı (sanal). ping google.com ile test et."); }
    setTick((x) => x + 1);
  };
  const scDef = SCEN.find((s) => s.id === sc);

  if (mode === "10") {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div><p className="mb-1 flex items-center gap-2 text-sm font-bold"><Pill tone="muted">CMD</Pill> Komut İstemi</p><Terminal shell={cmd} title="Komut İstemi (cmd.exe)" height={290} placeholder="örn: dir" /></div>
          <div><p className="mb-1 flex items-center gap-2 text-sm font-bold"><Pill>PowerShell</Pill> Windows PowerShell</p><Terminal shell={ps} title="Windows PowerShell" height={290} placeholder="örn: Get-ChildItem" /></div>
        </div>
        <p className="text-xs text-muted">İki terminal aynı sanal dosya sistemini paylaşır: birinde oluşturduğun klasörü diğerinde görebilirsin. Dene: <span className="mono">Get-Process | Sort-Object CPU -Descending | Select-Object -First 3</span> ve <span className="mono">Get-Help Get-Process</span></p>
        <div className="scroll-x rounded-xl border border-line">
          <table className="tbl min-w-[620px]"><thead><tr><th>İşlem</th><th>CMD</th><th>PowerShell</th></tr></thead><tbody>
            {PAIRS.map((r, i) => (
              <tr key={r[0]}><td className="font-semibold">{r[0]}</td>
                <td><code className="mono text-xs">{r[1]}</code><br /><button className="btn btn-sm mt-1" onClick={() => { cmd.run(r[1]); markPair(i, 0); }}>CMD&apos;de çalıştır</button></td>
                <td><code className="mono text-xs">{r[2]}</code><br /><button className="btn btn-sm mt-1 btn-primary" onClick={() => { ps.run(r[2]); markPair(i, 1); }}>PowerShell&apos;de çalıştır</button></td></tr>
            ))}
          </tbody></table>
        </div>
        <div className="flex flex-wrap gap-2">{["Get-Help", "Get-Command Get-*", "Get-Service | Where-Object Status -eq Running", "Get-Process | Where-Object CPU -gt 1"].map((c) => <button key={c} className="btn btn-sm mono" onClick={() => ps.run(c)}>{c}</button>)}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-soft p-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={admin} onChange={(e) => { setAdmin(e.target.checked); env.admin = e.target.checked; }} /> Yönetici olarak çalıştır (sanal)</label>
        <span className="text-xs text-muted">chkdsk ve sfc yönetici yetkisi ister — kutuyu açıp kapatarak farkı gör.</span>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <div className="space-y-2">
          <Terminal shell={cmd} title={`Komut İstemi${admin ? " (Yönetici)" : ""}`} height={380} placeholder="örn: ipconfig" />
          <div className="flex flex-wrap gap-1.5">{WIN_CMDS.map(([c]) => <button key={c} className="btn btn-sm !px-2 !py-1 mono" onClick={() => cmd.run(c)}>{c}</button>)}</div>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-line p-3">
            <p className="text-sm font-bold">🛠 Ağ sorunu senaryoları</p>
            <div className="mt-2 grid gap-1.5">
              {SCEN.map((s) => <button key={s.id} className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm hover:border-brand ${sc === s.id ? "border-brand bg-soft" : "border-line"}`} onClick={() => startSc(s.id)}><span>{s.name}</span>{solvedList.includes(s.id) && <Pill tone="ok">çözüldü ✓</Pill>}</button>)}
              <button className="btn btn-sm" onClick={() => startSc(null)}>↺ Ağı normale döndür</button>
            </div>
            {scDef && (
              <div className="mt-3 space-y-2 text-sm">
                <Callout type="warn" title="Belirti">{scDef.sym}</Callout>
                <div className="flex flex-wrap gap-2">
                  <button className="btn btn-sm" onClick={() => setShowHint((v) => !v)}>{showHint ? "İpucunu gizle" : "💡 İpucu göster"}</button>
                  {scDef.fix && <button className="btn btn-sm btn-primary" onClick={fixBtn}>🔧 {scDef.fix}</button>}
                </div>
                {showHint && <Callout type="info" title="Tanı yolu">{scDef.hint}</Callout>}
                {solvedList.includes(scDef.id) ? <Callout type="tip" title="Tebrikler!">Bu senaryoyu çözdün: ping ile dış hedefe ulaşabiliyorsun.</Callout> : <p className="text-xs text-muted">Çözüm ölçütü: sorunu giderdikten sonra <span className="mono">ping google.com</span> başarılı olmalı.</p>}
              </div>
            )}
            {info && <p className="mt-2 rounded-lg bg-bg px-3 py-2 text-xs">{info}</p>}
          </div>
          <div className="rounded-xl border border-line p-3">
            <p className="text-sm font-bold">📖 Komut rehberi</p>
            <ul className="mt-1 max-h-48 space-y-1 overflow-auto text-xs">{WIN_CMDS.map(([c, d]) => <li key={c}><code className="mono font-bold text-brand">{c}</code> — {d}</li>)}</ul>
          </div>
        </div>
      </div>
      <p className="text-xs text-muted">Tüm komutlar sanal bir ortamda yorumlanır; gerçek sistemine hiçbir komut gönderilmez.</p>
    </div>
  );
}
