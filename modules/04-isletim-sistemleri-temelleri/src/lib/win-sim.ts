import { tokenize } from "@/lib/linux-sim";

export type WNode = { t: "d" | "f"; path: string; content: string; mtime: string };
export type WProc = { pid: number; name: string; cpu: number; mem: number; desc: string };
export type WSvc = { name: string; display: string; status: "Running" | "Stopped" };
export type Net = { cable: boolean; ip: string; gw: string; gwUp: boolean; dnsOk: boolean; dhcpOk: boolean };
export type RunResult = { out: string; clear?: boolean };

const fmtDate = (d = new Date()) => `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
const fmtTime = (d = new Date()) => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
const nowStr = () => `${fmtDate()} ${fmtTime()}`;
const key = (p: string) => p.toLowerCase();
const pbase = (p: string) => p.slice(p.lastIndexOf("\\") + 1);
const pdir = (p: string) => { const i = p.lastIndexOf("\\"); return i <= 2 ? p.slice(0, 2) + "\\" : p.slice(0, i); };
const thousands = (n: number) => n.toLocaleString("en-US");
const wild = (pat: string) => new RegExp("^" + pat.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".") + "$", "i");

export class WinEnv {
  fs = new Map<string, WNode>();
  procs: WProc[] = [
    { pid: 4, name: "System", cpu: 0.4, mem: 0.1, desc: "Windows çekirdek (kernel) süreci" },
    { pid: 612, name: "csrss.exe", cpu: 0.1, mem: 4, desc: "İstemci/Sunucu çalışma zamanı" },
    { pid: 704, name: "winlogon.exe", cpu: 0, mem: 6, desc: "Oturum açma yöneticisi" },
    { pid: 788, name: "services.exe", cpu: 0.2, mem: 8, desc: "Hizmet Denetim Yöneticisi" },
    { pid: 812, name: "lsass.exe", cpu: 0.1, mem: 14, desc: "Yerel güvenlik yetkilisi (kimlik doğrulama)" },
    { pid: 964, name: "svchost.exe", cpu: 1.2, mem: 32, desc: "Paylaşımlı hizmet barındırıcı" },
    { pid: 2210, name: "explorer.exe", cpu: 1.5, mem: 112, desc: "Masaüstü ve Dosya Gezgini" },
    { pid: 3120, name: "chrome.exe", cpu: 6.8, mem: 420, desc: "Web tarayıcısı" },
    { pid: 3388, name: "notepad.exe", cpu: 0, mem: 14, desc: "Not Defteri" },
    { pid: 4012, name: "MsMpEng.exe", cpu: 2.1, mem: 190, desc: "Microsoft Defender Antimalware" },
  ];
  services: WSvc[] = [
    { name: "Dhcp", display: "DHCP Client", status: "Running" },
    { name: "Dnscache", display: "DNS Client", status: "Running" },
    { name: "EventLog", display: "Windows Event Log", status: "Running" },
    { name: "MpsSvc", display: "Windows Defender Firewall", status: "Running" },
    { name: "Spooler", display: "Print Spooler", status: "Stopped" },
    { name: "wuauserv", display: "Windows Update", status: "Running" },
    { name: "WinDefend", display: "Microsoft Defender Antivirus Service", status: "Running" },
  ];
  net: Net = { cable: true, ip: "192.168.1.25", gw: "192.168.1.1", gwUp: true, dnsOk: true, dhcpOk: true };
  admin = false;
  user = "Ogrenci";
  host = "AG-LAB-PC";
  onPingOk?: (target: string) => void;

  constructor() {
    const d = (p: string) => this.fs.set(key(p), { t: "d", path: p, content: "", mtime: "14.01.2025 10:21" });
    const f = (p: string, c: string) => this.fs.set(key(p), { t: "f", path: p, content: c, mtime: "14.01.2025 10:21" });
    ["C:\\", "C:\\Windows", "C:\\Windows\\System32", "C:\\Program Files", "C:\\Users", "C:\\Users\\Ogrenci", "C:\\Users\\Ogrenci\\Desktop", "C:\\Users\\Ogrenci\\Documents", "C:\\Users\\Ogrenci\\Downloads", "C:\\Users\\Ogrenci\\Pictures", "C:\\Lab", "D:\\", "D:\\Yedek"].forEach(d);
    f("C:\\Users\\Ogrenci\\Documents\\rapor.txt", "Haftalik rapor\r\nDurum: tamamlandi\r\n");
    f("C:\\Users\\Ogrenci\\Documents\\notlar.txt", "Windows notlarim\r\nNTFS izinleri onemlidir.\r\n");
    f("C:\\Users\\Ogrenci\\Downloads\\kurulum.exe", "(ikili dosya - simulasyon)");
    f("C:\\Users\\Ogrenci\\Desktop\\hosgeldin.txt", "Hos geldin! Bu sanal bir egitim masaustudur.\r\n");
    f("C:\\Users\\Ogrenci\\Pictures\\manzara.png", "(resim - simulasyon)");
    f("C:\\Lab\\hedefler.txt", "Sanal laboratuvar hedefleri\r\n192.168.1.10 lab-sunucu\r\n");
    f("D:\\Yedek\\eski-rapor.txt", "Yedeklenmis rapor\r\n");
  }

  get(p: string) { return this.fs.get(key(p)); }
  list(p: string) {
    const k = key(p.endsWith("\\") && p.length > 3 ? p.slice(0, -1) : p);
    return [...this.fs.values()].filter((n) => n.path.length > 3 && key(pdir(n.path)) === k).sort((a, b) => (a.t === b.t ? pbase(a.path).toLowerCase().localeCompare(pbase(b.path).toLowerCase()) : a.t === "d" ? -1 : 1));
  }
  resolve(p: string, cwd: string) {
    p = p.replace(/\//g, "\\");
    let base: string, rest: string;
    const m = p.match(/^([a-zA-Z]):(.*)$/);
    if (m) { base = m[1].toUpperCase() + ":"; rest = m[2].startsWith("\\") ? m[2] : (base === cwd.slice(0, 2) ? cwd.slice(2) + "\\" + m[2] : "\\" + m[2]); }
    else if (p.startsWith("\\")) { base = cwd.slice(0, 2); rest = p; }
    else { base = cwd.slice(0, 2); rest = cwd.slice(2) + "\\" + p; }
    const segs: string[] = [];
    let cur = base + "\\";
    for (const s of rest.split("\\")) {
      if (!s || s === ".") continue;
      if (s === "..") { segs.pop(); cur = segs.length ? base + "\\" + segs.join("\\") : base + "\\"; continue; }
      const probe = (cur.endsWith("\\") ? cur : cur + "\\") + s;
      const ex = this.get(probe);
      segs.push(ex ? pbase(ex.path) : s);
      cur = base + "\\" + segs.join("\\");
    }
    return segs.length ? base + "\\" + segs.join("\\") : base + "\\";
  }
  exists(p: string) { return !!this.get(p); }
  mkdir(p: string): string | null {
    if (this.exists(p)) return "exists";
    const parent = pdir(p);
    if (!this.exists(parent)) return "noparent";
    this.fs.set(key(p), { t: "d", path: p, content: "", mtime: nowStr() });
    return null;
  }
  writeFile(p: string, content: string): string | null {
    if (!this.exists(pdir(p))) return "noparent";
    const ex = this.get(p);
    if (ex?.t === "d") return "isdir";
    this.fs.set(key(p), { t: "f", path: ex?.path ?? p, content, mtime: nowStr() });
    return null;
  }
  private subtree(p: string) { return [...this.fs.values()].filter((n) => key(n.path) === key(p) || key(n.path).startsWith(key(p) + "\\")); }
  copy(src: string, dst: string): string | null {
    const s = this.get(src);
    if (!s) return "nosrc";
    if (!this.exists(pdir(dst))) return "noparent";
    for (const n of this.subtree(src)) {
      const np = dst + n.path.slice(src.length);
      this.fs.set(key(np), { ...n, path: np, mtime: nowStr() });
    }
    return null;
  }
  move(src: string, dst: string): string | null {
    const r = this.copy(src, dst);
    if (r) return r;
    if (key(src) !== key(dst)) this.subtree(src).forEach((n) => { if (!key(n.path).startsWith(key(dst))) this.fs.delete(key(n.path)); });
    return null;
  }
  remove(p: string) { this.subtree(p).forEach((n) => this.fs.delete(key(n.path))); }
  rename(p: string, newName: string): string | null {
    const np = pdir(p).replace(/\\$/, "") + "\\" + newName;
    if (this.exists(np)) return "exists";
    return this.move(p, np);
  }
}

type Rec = Record<string, string | number>;
type Obj = { rows: Rec[]; cols: string[]; header?: string };
type Out = { text: string } | { obj: Obj };

const HOSTS: Record<string, string> = { "google.com": "142.250.184.14", "www.google.com": "142.250.184.14", "agcyberlab.com": "104.21.45.10", "ag-lab.local": "192.168.1.10", localhost: "127.0.0.1" };

function table(o: Obj) {
  const w = o.cols.map((c) => Math.max(c.length, ...o.rows.map((r) => String(r[c] ?? "").length)));
  const num = o.cols.map((c) => o.rows.some((r) => typeof r[c] === "number") && o.rows.every((r) => typeof r[c] === "number" || r[c] === ""));
  const line = (vals: string[]) => vals.map((v, i) => (num[i] ? v.padStart(w[i]) : v.padEnd(w[i]))).join(" ").trimEnd();
  if (!o.rows.length) return "";
  return (o.header ? `\n    Directory: ${o.header}\n\n` : "\n") + [line(o.cols), line(w.map((x) => "-".repeat(x))), ...o.rows.map((r) => line(o.cols.map((c) => String(r[c] ?? ""))))].join("\n") + "\n";
}

const PS_HELP: Record<string, [string, string, string]> = {
  "get-help": ["Cmdlet'ler hakkında yardım gösterir.", "Get-Help [[-Name] <string>]", "Get-Help Get-Process"],
  "get-command": ["Kullanılabilir komutları listeler.", "Get-Command [[-Name] <string[]>]", "Get-Command Get-*"],
  "get-location": ["Geçerli çalışma dizinini gösterir.", "Get-Location", "Get-Location"],
  "set-location": ["Çalışma dizinini değiştirir.", "Set-Location [-Path] <string>", "Set-Location Documents"],
  "get-childitem": ["Bir konumdaki dosya ve klasörleri listeler.", "Get-ChildItem [[-Path] <string>] [-Recurse]", "Get-ChildItem C:\\Lab"],
  "new-item": ["Yeni dosya veya klasör oluşturur.", "New-Item [-Path] <string> [-Name <string>] [-ItemType <string>] [-Value <string>]", "New-Item -ItemType Directory -Name Proje"],
  "copy-item": ["Dosya veya klasör kopyalar.", "Copy-Item [-Path] <string> [-Destination] <string> [-Recurse]", "Copy-Item rapor.txt yedek.txt"],
  "move-item": ["Dosya veya klasör taşır.", "Move-Item [-Path] <string> [-Destination] <string>", "Move-Item yedek.txt C:\\Lab"],
  "rename-item": ["Bir öğeyi yeniden adlandırır.", "Rename-Item [-Path] <string> [-NewName] <string>", "Rename-Item yedek.txt eski.txt"],
  "get-process": ["Çalışan süreçleri listeler.", "Get-Process [[-Name] <string[]>]", "Get-Process | Sort-Object CPU -Descending | Select-Object -First 3"],
  "get-service": ["Hizmetleri listeler.", "Get-Service [[-Name] <string[]>]", "Get-Service | Where-Object Status -eq Running"],
  "get-computerinfo": ["Bilgisayar ve işletim sistemi bilgisini gösterir.", "Get-ComputerInfo", "Get-ComputerInfo"],
  "get-date": ["Geçerli tarih ve saati gösterir.", "Get-Date", "Get-Date"],
  "clear-host": ["Ekranı temizler.", "Clear-Host", "Clear-Host"],
  "get-content": ["Dosya içeriğini okur (cmd'deki type).", "Get-Content [-Path] <string>", "Get-Content rapor.txt"],
  "remove-item": ["Dosya veya klasör siler.", "Remove-Item [-Path] <string> [-Recurse]", "Remove-Item gecici.txt"],
};
const PS_CMDLETS = ["Clear-Host", "Copy-Item", "Get-ChildItem", "Get-Command", "Get-ComputerInfo", "Get-Content", "Get-Date", "Get-Help", "Get-Location", "Get-Process", "Get-Service", "Move-Item", "New-Item", "Remove-Item", "Rename-Item", "Select-Object", "Select-String", "Set-Content", "Set-Location", "Sort-Object", "Where-Object", "Measure-Object", "Write-Output"];

export class WinShell {
  cwd = "C:\\Users\\Ogrenci";
  hist: string[] = [];
  constructor(public env: WinEnv, public mode: "cmd" | "ps") {}

  prompt() { return this.mode === "cmd" ? `${this.cwd}>` : `PS ${this.cwd}> `; }

  run(line: string): RunResult {
    const l = line.trim();
    if (!l) return { out: "" };
    this.hist.push(l);
    try {
      return this.mode === "cmd" ? this.runCmd(l) : this.runPs(l);
    } catch (e) {
      return { out: (e as Error).message };
    }
  }

  /* ---------- ortak harici komutlar ---------- */
  private ext(name: string, args: string[]): string | null {
    const e = this.env, n = e.net;
    const a = args.map((x) => x.toLowerCase());
    switch (name) {
      case "hostname": return e.host;
      case "whoami": return a.includes("/groups") ? `GRUP ADI                  Tür\nEveryone                  Well-known group\nBUILTIN\\Users             Alias\n(Simülasyon çıktısı)` : `${e.host.toLowerCase()}\\${e.user.toLowerCase()}`;
      case "ver": return "Microsoft Windows [Version 10.0.22631.0] (SİMÜLASYON)";
      case "ipconfig": {
        if (a.includes("/release")) { if (n.cable) { n.ip = "0.0.0.0"; } return "Windows IP Configuration\n\nEthernet adapter Ethernet:\n   Connection-specific DNS Suffix  . :\n   Default Gateway . . . . . . . . . :\n(IP adresi bırakıldı — yeni adres için ipconfig /renew)"; }
        if (a.includes("/renew")) {
          if (!n.cable) return "An error occurred while renewing interface Ethernet : The media is disconnected.\n[Açıklama] Ağ kablosu takılı değil; DHCP'ye ulaşılamaz.";
          if (!n.dhcpOk) return "An error occurred while renewing interface Ethernet : unable to contact your DHCP server. Request has timed out.\n[Açıklama] DHCP sunucusu yanıt vermiyor.";
          n.ip = "192.168.1.25";
          return "Windows IP Configuration\n\nEthernet adapter Ethernet:\n   IPv4 Address. . . . . . . . . . . : 192.168.1.25\n   Default Gateway . . . . . . . . . : 192.168.1.1\n(Yeni IP adresi DHCP'den alındı.)";
        }
        if (a.includes("/flushdns")) { n.dnsOk = true; return "Windows IP Configuration\n\nSuccessfully flushed the DNS Resolver Cache.\n[Açıklama] DNS önbelleği temizlendi; eski/bozuk kayıtlar silindi."; }
        if (a.includes("/displaydns")) return "DNS Resolver Cache (SİMÜLASYON)\n    google.com  A  142.250.184.14";
        const all = a.includes("/all");
        const head = `\nWindows IP Configuration\n\n${all ? `   Host Name . . . . . . . . . . . . : ${e.host}\n\n` : ""}Ethernet adapter Ethernet:\n\n`;
        if (!n.cable) return head + "   Media State . . . . . . . . . . . : Media disconnected\n   Connection-specific DNS Suffix  . :\n[Açıklama] Kablo takılı değil veya adaptör devre dışı.";
        const valid = !n.ip.startsWith("169.254") && n.ip !== "0.0.0.0";
        return head + `   Connection-specific DNS Suffix  . : lan\n${all ? "   Physical Address. . . . . . . . . : 08-00-27-AB-CD-EF\n   DHCP Enabled. . . . . . . . . . . : Yes\n" : ""}   IPv4 Address. . . . . . . . . . . : ${n.ip}${valid ? "" : "(Preferred)"}\n   Subnet Mask . . . . . . . . . . . : ${valid ? "255.255.255.0" : "255.255.0.0"}\n   Default Gateway . . . . . . . . . : ${valid ? n.gw : ""}${all && valid ? `\n   DNS Servers . . . . . . . . . . . : ${n.gw}` : ""}${valid ? "" : "\n[Açıklama] 169.254.x.x (APIPA) adresi, DHCP'den IP alınamadığını gösterir."}`;
      }
      case "ping": {
        const t = args.find((x) => !x.startsWith("-") && !x.startsWith("/"));
        if (!t) return "Usage: ping [-t] [-n count] target_name";
        const isIp = /^\d+\.\d+\.\d+\.\d+$/.test(t);
        let ip = isIp ? t : HOSTS[t.toLowerCase()];
        const valid = n.cable && !n.ip.startsWith("169.254") && n.ip !== "0.0.0.0";
        if (!isIp && !ip) return `Ping request could not find host ${t}. Please check the name and try again.`;
        if (!isIp && ip !== "127.0.0.1" && ip !== "192.168.1.10" && !n.dnsOk) return `Ping request could not find host ${t}. Please check the name and try again.\n[Açıklama] Ad çözümlenemedi: DNS sorunu olabilir. IP ile (ör. ping 8.8.8.8) test et.`;
        if (!ip) ip = t;
        const local = ip === "127.0.0.1";
        const lan = ip.startsWith("192.168.1.");
        const ok = local || (valid && (lan ? (ip === n.gw ? n.gwUp || true : true) : n.gwUp));
        const nm = isIp ? ip : `${t} [${ip}]`;
        if (!ok) {
          const unreachable = !valid ? `Reply from ${n.ip}: Destination host unreachable.` : "Request timed out.";
          return `\nPinging ${nm} with 32 bytes of data:\n${[0, 1, 2, 3].map(() => unreachable).join("\n")}\n\nPing statistics for ${ip}:\n    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss)\n[Açıklama] ${!valid ? "Yerel ağ yapılandırması geçerli değil." : "Ağ geçidi/internet yanıt vermiyor."}`;
        }
        e.onPingOk?.(t);
        return `\nPinging ${nm} with 32 bytes of data:\n${[12, 11, 13, 12].map((ms) => `Reply from ${ip}: bytes=32 time=${local ? "<1" : ms}ms TTL=${local ? 128 : 117}`).join("\n")}\n\nPing statistics for ${ip}:\n    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),\nApproximate round trip times in milli-seconds:\n    Minimum = ${local ? 0 : 11}ms, Maximum = ${local ? 0 : 13}ms, Average = ${local ? 0 : 12}ms`;
      }
      case "tracert": {
        const t = args.find((x) => !x.startsWith("-") && !x.startsWith("/"));
        if (!t) return "Usage: tracert [-d] target_name";
        if (!n.cable) return `Unable to resolve target system name ${t}.`;
        const hops = n.gwUp ? [`  1    <1 ms    <1 ms    <1 ms  ${n.gw}`, "  2     8 ms     7 ms     8 ms  10.20.0.1", "  3    12 ms    11 ms    12 ms  81.212.4.1", `  4    13 ms    12 ms    13 ms  ${HOSTS[t.toLowerCase()] ?? t}`] : ["  1     *        *        *     Request timed out.", "  2     *        *        *     Request timed out.", "  3     *        *        *     Request timed out."];
        return `\nTracing route to ${t} over a maximum of 30 hops:\n\n${hops.join("\n")}\n\nTrace complete.${n.gwUp ? "" : "\n[Açıklama] 1. sıçramadan (ağ geçidi) ileri gidilemiyor: modem/ağ geçidi sorunu olabilir."}`;
      }
      case "nslookup": {
        const t = args[0];
        if (!t) return "Default Server:  UnKnown\nAddress:  " + n.gw + "\n> (etkileşimli mod simülasyonda yok; 'nslookup google.com' yaz)";
        if (!n.cable || !n.dnsOk) return `DNS request timed out.\n    timeout was 2 seconds.\nServer:  UnKnown\nAddress:  ${n.gw}\n\n*** UnKnown can't find ${t}: No response from server\n[Açıklama] DNS sunucusuna ulaşılamıyor veya önbellek bozuk.`;
        const ip = HOSTS[t.toLowerCase()];
        return `Server:  router.lan\nAddress:  ${n.gw}\n\n${ip ? `Non-authoritative answer:\nName:    ${t}\nAddress:  ${ip}` : `*** router.lan can't find ${t}: Non-existent domain`}`;
      }
      case "netstat": return "\nActive Connections\n\n  Proto  Local Address          Foreign Address        State\n  TCP    192.168.1.25:49812     142.250.184.14:443     ESTABLISHED\n  TCP    192.168.1.25:49820     104.21.45.10:443       ESTABLISHED\n  TCP    0.0.0.0:135            AG-LAB-PC:0            LISTENING\n  TCP    0.0.0.0:445            AG-LAB-PC:0            LISTENING\n  UDP    0.0.0.0:5353           *:*\n(Simülasyon çıktısı)";
      case "tasklist": return "\nImage Name                     PID Session Name        Mem Usage\n========================= ======== ================ ============\n" + e.procs.map((p) => `${p.name.padEnd(25)} ${String(p.pid).padStart(8)} ${(p.pid < 1000 ? "Services" : "Console").padEnd(16)} ${thousands(Math.round(p.mem * 1024)).padStart(9)} K`).join("\n");
      case "systeminfo": return `Host Name:                 ${e.host}\nOS Name:                   Microsoft Windows 11 Pro (SİMÜLASYON)\nOS Version:                10.0.22631 Build 22631\nOS Manufacturer:           Microsoft Corporation\nRegistered Owner:          ${e.user}\nSystem Manufacturer:       AG CYBER LAB Virtual\nSystem Type:               x64-based PC\nProcessor(s):              1 Processor(s) Installed.\nTotal Physical Memory:     8,192 MB\nAvailable Physical Memory: 3,402 MB\nSystem Boot Time:          ${fmtDate()}, 08:02:11\nLogon Server:              \\\\${e.host}\nHotfix(s):                 3 Hotfix(s) Installed.\nNetwork Card(s):           1 NIC(s) Installed.`;
      case "chkdsk": {
        if (!e.admin) return "Access Denied as you do not have sufficient privileges.\nYou have to invoke this utility running in elevated mode.\n[Açıklama] chkdsk disk denetimi yapar; yönetici yetkisi gerekir. (Üstteki 'Yönetici olarak çalıştır' anahtarını aç.)";
        return "The type of the file system is NTFS.\nVolume label is OS.\n\nWARNING!  F parameter not specified.\nRunning CHKDSK in read-only mode.\n\nStage 1: Examining basic file system structure ...\nStage 2: Examining file name linkage ...\nStage 3: Examining security descriptors ...\nWindows has scanned the file system and found no problems.\nNo further action is required.\n\n(Simülasyon: gerçek disk taranmadı. chkdsk /f disk üzerinde onarım yapar; dikkatli kullanılmalıdır.)";
      }
      case "sfc": {
        if (!e.admin) return "You must be an administrator running a console session in order to use the sfc utility.\n[Açıklama] sfc sistem dosyalarını denetler/onarır; yönetici yetkisi gerekir. ('Yönetici olarak çalıştır' anahtarını aç.)";
        if (!a.includes("/scannow")) return "Kullanım: sfc /scannow";
        return "Beginning system scan.  This process will take some time.\n\nBeginning verification phase of system scan.\nVerification 100% complete.\n\nWindows Resource Protection did not find any integrity violations.\n\n(Simülasyon: gerçek sistem dosyaları denetlenmedi.)";
      }
    }
    return null;
  }

  /* ---------- CMD ---------- */
  private notFound(c: string) {
    return this.mode === "cmd"
      ? `'${c}' is not recognized as an internal or external command,\noperable program or batch file.\n[Açıklama] Komut yazım hatası içeriyor olabilir veya program yolda (PATH) bulunmuyor. 'help' ile CMD komut listesini gör.`
      : `${c}: The term '${c}' is not recognized as a name of a cmdlet, function, script file, or executable program.\nCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.\n[Açıklama] PowerShell bu adı bilmiyor. Get-Command ile komutları ara, Get-Help ile yardım al.`;
  }

  private dirOut(args: string[]) {
    const e = this.env;
    const bare = args.some((a) => a.toLowerCase() === "/b");
    const p = args.find((a) => !a.startsWith("/"));
    const target = p ? e.resolve(p, this.cwd) : this.cwd;
    const node = e.get(target);
    if (!node) return "File Not Found";
    let kids = e.list(target);
    let shown = target;
    if (node.t === "f") { kids = [node]; shown = pdir(target); }
    if (bare) return kids.map((k) => pbase(k.path)).join("\n");
    const rows = kids.map((k) => `${k.mtime.replace(" ", "  ")}    ${k.t === "d" ? "<DIR>         " : thousands(k.content.length).padStart(14)} ${pbase(k.path)}`);
    const dots = ["14.01.2025  10:21    <DIR>          .", "14.01.2025  10:21    <DIR>          .."];
    const files = kids.filter((k) => k.t === "f"), dirs = kids.filter((k) => k.t === "d");
    return ` Volume in drive ${target[0]} is OS\n Volume Serial Number is 4A2B-9C1D\n\n Directory of ${shown}\n\n${(shown.length > 3 ? dots : []).concat(rows).join("\n")}\n${String(files.length).padStart(16)} File(s) ${thousands(files.reduce((s, f) => s + f.content.length, 0)).padStart(14)} bytes\n${String(dirs.length + (shown.length > 3 ? 2 : 0)).padStart(16)} Dir(s)  118,234,567,890 bytes free`;
  }

  private fileOp(op: "copy" | "move" | "ren", args: string[]) {
    const e = this.env;
    const a = args.filter((x) => !x.startsWith("/"));
    if (a.length < 2) return op === "ren" ? "The syntax of the command is incorrect.\nKullanım: ren eskiAd yeniAd" : "The syntax of the command is incorrect.\nKullanım: " + op + " kaynak hedef";
    const src = e.resolve(a[0], this.cwd);
    if (!e.exists(src)) return op === "ren" ? "The system cannot find the file specified." : "The system cannot find the file specified.\n        0 file(s) " + (op === "copy" ? "copied." : "moved.");
    if (op === "ren") { const r = e.rename(src, a[1]); return r === "exists" ? "A duplicate file name exists, or the file cannot be found." : ""; }
    let dst = e.resolve(a[1], this.cwd);
    if (e.get(dst)?.t === "d") dst = (dst.endsWith("\\") ? dst : dst + "\\") + pbase(src);
    if (e.get(src)?.t === "d" && op === "copy") return "Dizinler copy ile kopyalanamaz. xcopy veya PowerShell Copy-Item -Recurse kullanın.\n(Access is denied.)";
    const r = op === "copy" ? e.copy(src, dst) : e.move(src, dst);
    if (r) return "The system cannot find the path specified.";
    return `        1 file(s) ${op === "copy" ? "copied" : "moved"}.`;
  }

  private runCmd(line: string): RunResult {
    const toks = tokenize(line);
    const stages: { v: string; op: boolean }[][] = [[]];
    for (const t of toks) { if (t.op && t.v === "|") stages.push([]); else stages[stages.length - 1].push(t); }
    let input: string | undefined;
    for (const st of stages) {
      let redir: { mode: ">" | ">>"; file: string } | null = null;
      const ri = st.findIndex((t) => t.op);
      let words = st;
      if (ri >= 0) { redir = { mode: st[ri].v as ">" | ">>", file: st[ri + 1]?.v ?? "" }; words = st.slice(0, ri); }
      const w = words.map((t) => t.v);
      if (!w.length) return { out: "The syntax of the command is incorrect." };
      const r = this.cmdOne(w[0], w.slice(1), input);
      if (r.clear) return r;
      let out = r.out;
      if (redir) {
        if (!redir.file) return { out: "The syntax of the command is incorrect." };
        const p = this.env.resolve(redir.file, this.cwd);
        const old = this.env.get(p)?.content ?? "";
        const err = this.env.writeFile(p, (redir.mode === ">>" ? old : "") + out + "\r\n");
        out = err ? "The system cannot find the path specified." : "";
      }
      input = out;
    }
    return { out: input ?? "" };
  }

  private cmdOne(c: string, args: string[], stdin?: string): RunResult {
    const e = this.env;
    const name = c.toLowerCase();
    const pathArg = (i = 0) => args.filter((a) => !a.startsWith("/"))[i];
    switch (name) {
      case "cls": return { out: "", clear: true };
      case "help": return { out: "CMD komutları (SANAL — gerçek sisteme komut gönderilmez):\ndir  cd  cls  mkdir (md)  rmdir (rd)  copy  move  ren  type  del  echo  ver  date  time\nipconfig  ping  tracert  nslookup  netstat  hostname  whoami  systeminfo  tasklist  chkdsk  sfc\nfindstr  find  more  (| ile kullanılabilir)\n\nPowerShell için 'powershell' sekmesini kullan; yardım için ' <komut> /?' yaz." };
      case "dir": return { out: this.dirOut(args) };
      case "cd": case "chdir": {
        const p = args.filter((a) => a.toLowerCase() !== "/d").join(" ");
        if (!p) return { out: this.cwd };
        const t = e.resolve(p, this.cwd);
        const n = e.get(t);
        if (!n || n.t !== "d") return { out: "The system cannot find the path specified." };
        this.cwd = t;
        return { out: "" };
      }
      case "mkdir": case "md": {
        const p = pathArg(); if (!p) return { out: "The syntax of the command is incorrect." };
        const t = e.resolve(p, this.cwd); const r = e.mkdir(t);
        return { out: r === "exists" ? `A subdirectory or file ${p} already exists.` : r ? "The system cannot find the path specified." : "" };
      }
      case "rmdir": case "rd": {
        const p = pathArg(); if (!p) return { out: "The syntax of the command is incorrect." };
        const t = e.resolve(p, this.cwd); const n = e.get(t);
        if (!n) return { out: "The system cannot find the file specified." };
        if (n.t !== "d") return { out: "The directory name is invalid." };
        const sw = args.map((a) => a.toLowerCase());
        if (e.list(t).length && !sw.includes("/s")) return { out: "The directory is not empty.\n[İpucu] İçindekilerle silmek için rmdir /s /q kullanılır — dikkat, geri dönüşüm kutusu yoktur." };
        if (this.cwd.toLowerCase().startsWith(t.toLowerCase())) return { out: "The process cannot access the file because it is being used by another process." };
        e.remove(t); return { out: "" };
      }
      case "del": case "erase": {
        const p = pathArg(); if (!p) return { out: "The syntax of the command is incorrect." };
        const t = e.resolve(p, this.cwd); const n = e.get(t);
        if (!n) return { out: `Could Not Find ${t}` };
        if (n.t === "d") { e.list(t).filter((x) => x.t === "f").forEach((x) => e.remove(x.path)); return { out: "" }; }
        e.remove(t); return { out: "" };
      }
      case "copy": return { out: this.fileOp("copy", args) };
      case "move": return { out: this.fileOp("move", args) };
      case "ren": case "rename": return { out: this.fileOp("ren", args) };
      case "type": {
        const p = pathArg(); if (!p) return { out: "The syntax of the command is incorrect." };
        const n = e.get(e.resolve(p, this.cwd));
        if (!n) return { out: "The system cannot find the file specified." };
        if (n.t === "d") return { out: `Access is denied.` };
        return { out: n.content.replace(/\r/g, "").replace(/\n$/, "") };
      }
      case "echo": return { out: args.join(" ") };
      case "date": return { out: args[0]?.toLowerCase() === "/t" ? new Date().toDateString() : `The current date is: ${new Date().toDateString()}` };
      case "time": return { out: args[0]?.toLowerCase() === "/t" ? fmtTime() : `The current time is: ${new Date().toTimeString().slice(0, 8)}` };
      case "exit": return { out: "(Simülasyonda terminal kapanmaz.)" };
      case "more": return { out: stdin ?? "" };
      case "findstr": case "find": {
        const flags = args.filter((a) => a.startsWith("/")).map((a) => a.toLowerCase());
        const pat = args.find((a) => !a.startsWith("/"));
        if (!pat) return { out: "FINDSTR: Eksik arama dizesi" };
        if (stdin === undefined) return { out: "Simülasyonda bu komut boru (|) ile kullanılır. Örnek: tasklist | findstr chrome" };
        const ci = flags.includes("/i") || name === "findstr" && false;
        const re = new RegExp(pat.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), ci ? "i" : "i");
        return { out: stdin.split("\n").filter((x) => re.test(x)).join("\n") };
      }
      case "sort": return { out: (stdin ?? "").split("\n").sort().join("\n") };
    }
    if (args.some((a) => a === "/?") && ["ipconfig", "ping", "tracert", "nslookup", "netstat", "tasklist", "systeminfo", "chkdsk", "sfc"].includes(name)) return { out: `${name.toUpperCase()} — yardım (özet)\nKomut: ${name} [parametreler]\nAyrıntılı seçenekler için Ders 10/12 notlarına bakabilirsin.` };
    const x = this.ext(name, args);
    if (x !== null) return { out: x };
    return { out: this.notFound(c) };
  }

  /* ---------- PowerShell ---------- */
  private psParams(args: string[], valued: string[]) {
    const named: Record<string, string> = {};
    const sw = new Set<string>();
    const pos: string[] = [];
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (/^-[A-Za-z]/.test(a)) {
        const k = a.slice(1).toLowerCase();
        if (valued.includes(k)) named[k] = args[++i] ?? ""; else sw.add(k);
      } else pos.push(a);
    }
    return { named, sw, pos };
  }

  private fsRows(p: string): Obj {
    const kids = this.env.list(p);
    return {
      header: p,
      cols: ["Mode", "LastWriteTime", "Length", "Name"],
      rows: kids.map((k) => ({ Mode: k.t === "d" ? "d-----" : "-a----", LastWriteTime: k.mtime.replace(" ", "     "), Length: k.t === "d" ? "" : k.content.length, Name: pbase(k.path) })),
    };
  }

  private psSource(name: string, args: string[]): Out | RunResult | null {
    const e = this.env;
    const p = (valued: string[]) => this.psParams(args, valued);
    switch (name) {
      case "get-location": case "pwd": case "gl": return { text: `\nPath\n----\n${this.cwd}\n` };
      case "set-location": case "cd": case "sl": case "chdir": {
        const { named, pos } = p(["path"]);
        const t = named.path ?? pos[0];
        if (!t) return { text: "" };
        const full = e.resolve(t, this.cwd); const n = e.get(full);
        if (!n || n.t !== "d") return { text: `Set-Location: Cannot find path '${full}' because it does not exist.` };
        this.cwd = full; return { text: "" };
      }
      case "get-childitem": case "ls": case "dir": case "gci": {
        const { named, pos, sw } = p(["path", "filter"]);
        const t = e.resolve(named.path ?? pos[0] ?? ".", this.cwd);
        const n = e.get(t);
        if (!n) return { text: `Get-ChildItem: Cannot find path '${t}' because it does not exist.` };
        const o = this.fsRows(n.t === "d" ? t : pdir(t));
        if (n.t === "f") o.rows = o.rows.filter((r) => String(r.Name).toLowerCase() === pbase(t).toLowerCase());
        if (named.filter) { const re = wild(named.filter); o.rows = o.rows.filter((r) => re.test(String(r.Name))); }
        if (sw.has("recurse")) { const all: Rec[] = []; const walk = (d: string) => e.list(d).forEach((k) => { all.push({ Mode: k.t === "d" ? "d-----" : "-a----", LastWriteTime: k.mtime.replace(" ", "     "), Length: k.t === "d" ? "" : k.content.length, Name: k.path.slice(t.length + 1) }); if (k.t === "d") walk(k.path); }); walk(t); o.rows = all; o.header = t; }
        return { obj: o };
      }
      case "get-process": case "ps": case "gps": {
        const { named, pos } = p(["name"]);
        const f = named.name ?? pos[0];
        let list = e.procs;
        if (f) { const re = wild(f.replace(/\.exe$/i, "") + "*"); list = list.filter((x) => re.test(x.name.replace(/\.exe$/i, ""))); if (!list.length) return { text: `Get-Process: Cannot find a process with the name "${f}". Verify the process name and call the cmdlet again.` }; }
        return { obj: { cols: ["Handles", "NPM(K)", "PM(K)", "WS(K)", "CPU(s)", "Id", "ProcessName"], rows: list.map((x) => ({ Handles: Math.round(x.mem * 9) + 120, "NPM(K)": 12, "PM(K)": Math.round(x.mem * 800), "WS(K)": Math.round(x.mem * 1024), "CPU(s)": Number(x.cpu.toFixed(2)), CPU: Number(x.cpu.toFixed(2)), Id: x.pid, ProcessName: x.name.replace(/\.exe$/i, ""), Name: x.name.replace(/\.exe$/i, "") })) } };
      }
      case "get-service": case "gsv": {
        const { named, pos } = p(["name"]);
        const f = named.name ?? pos[0];
        let list = e.services;
        if (f) { const re = wild(f); list = list.filter((x) => re.test(x.name)); if (!list.length) return { text: `Get-Service: Cannot find any service with service name '${f}'.` }; }
        return { obj: { cols: ["Status", "Name", "DisplayName"], rows: list.map((x) => ({ Status: x.status, Name: x.name, DisplayName: x.display })) } };
      }
      case "get-computerinfo": return { text: `\nWindowsProductName      : Windows 11 Pro (SİMÜLASYON)\nWindowsVersion          : 23H2\nOsArchitecture          : 64-bit\nCsName                  : ${e.host}\nCsProcessors            : {Sanal CPU, 4 çekirdek}\nCsTotalPhysicalMemory   : 8589934592\nOsLastBootUpTime        : ${fmtDate()} 08:02:11\nTimeZone                : (UTC+03:00) Istanbul\n` };
      case "get-date": return { text: "\n" + new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "medium" }).replace(" at ", ", ") + "\n" };
      case "get-content": case "cat": case "type": case "gc": {
        const { named, pos } = p(["path"]);
        const t = named.path ?? pos[0]; if (!t) return { text: "Get-Content: Cannot bind argument to parameter 'Path' because it is null." };
        const n = e.get(e.resolve(t, this.cwd));
        if (!n) return { text: `Get-Content: Cannot find path '${e.resolve(t, this.cwd)}' because it does not exist.` };
        if (n.t === "d") return { text: `Get-Content: Access to the path '${n.path}' is denied.` };
        return { text: n.content.replace(/\r/g, "").replace(/\n$/, "") };
      }
      case "new-item": case "ni": {
        const { named, pos } = p(["path", "name", "itemtype", "value"]);
        const type = (named.itemtype ?? "file").toLowerCase();
        const base = named.path ?? pos[0];
        const nm = named.name;
        const full = e.resolve(nm ? (base ? base + "\\" + nm : nm) : base ?? "", this.cwd);
        if (!base && !nm) return { text: "New-Item: Missing an argument for parameter 'Path'. Specify a parameter of type 'System.String' and try again." };
        if (e.exists(full)) return { text: `New-Item: An item with the specified name ${full} already exists.` };
        const r = type.startsWith("dir") ? e.mkdir(full) : e.writeFile(full, named.value ?? "");
        if (r) return { text: `New-Item: Could not find a part of the path '${full}'.` };
        return { obj: { header: pdir(full), cols: ["Mode", "LastWriteTime", "Length", "Name"], rows: [{ Mode: type.startsWith("dir") ? "d-----" : "-a----", LastWriteTime: nowStr().replace(" ", "     "), Length: type.startsWith("dir") ? "" : (named.value ?? "").length, Name: pbase(full) }] } };
      }
      case "copy-item": case "cp": case "copy": case "cpi": case "move-item": case "mv": case "move": case "mi": {
        const mv = ["move-item", "mv", "move", "mi"].includes(name);
        const { named, pos } = p(["path", "destination"]);
        const s = named.path ?? pos[0]; const d = named.destination ?? pos[1];
        if (!s || !d) return { text: `${mv ? "Move-Item" : "Copy-Item"}: Cannot bind argument to parameter 'Destination' because it is null.` };
        const src = e.resolve(s, this.cwd);
        if (!e.exists(src)) return { text: `${mv ? "Move-Item" : "Copy-Item"}: Cannot find path '${src}' because it does not exist.` };
        let dst = e.resolve(d, this.cwd);
        if (e.get(dst)?.t === "d") dst = (dst.endsWith("\\") ? dst : dst + "\\") + pbase(src);
        const r = mv ? e.move(src, dst) : e.copy(src, dst);
        return { text: r ? `${mv ? "Move-Item" : "Copy-Item"}: Could not find a part of the path '${dst}'.` : "" };
      }
      case "rename-item": case "ren": case "rni": {
        const { named, pos } = p(["path", "newname"]);
        const s = named.path ?? pos[0]; const nn = named.newname ?? pos[1];
        if (!s || !nn) return { text: "Rename-Item: Cannot bind argument to parameter 'NewName' because it is null." };
        const src = e.resolve(s, this.cwd);
        if (!e.exists(src)) return { text: `Rename-Item: Cannot find path '${src}' because it does not exist.` };
        return { text: e.rename(src, nn) === "exists" ? `Rename-Item: Cannot rename because an item at '${nn}' already exists.` : "" };
      }
      case "remove-item": case "rm": case "del": case "rmdir": case "ri": case "rd": case "erase": {
        const { named, pos, sw } = p(["path"]);
        const t = named.path ?? pos[0]; if (!t) return { text: "Remove-Item: Cannot bind argument to parameter 'Path' because it is null." };
        const full = e.resolve(t, this.cwd); const n = e.get(full);
        if (!n) return { text: `Remove-Item: Cannot find path '${full}' because it does not exist.` };
        if (n.t === "d" && e.list(full).length && !sw.has("recurse")) return { text: `Remove-Item: The item at ${full} has children and the Recurse parameter was not specified.\n[İpucu] -Recurse ile silinir; geri dönüşüm kutusu yoktur, dikkatli ol.` };
        e.remove(full); return { text: "" };
      }
      case "set-content": case "sc": case "add-content": case "ac": {
        const { named, pos } = p(["path", "value"]);
        const t = named.path ?? pos[0]; const v = named.value ?? pos[1] ?? "";
        if (!t) return { text: "Set-Content: Cannot bind argument to parameter 'Path' because it is null." };
        const full = e.resolve(t, this.cwd);
        const old = name.startsWith("a") ? e.get(full)?.content ?? "" : "";
        return { text: e.writeFile(full, old + v + "\r\n") ? `Set-Content: Could not find a part of the path '${full}'.` : "" };
      }
      case "write-output": case "echo": case "write-host": return { text: args.join(" ") };
      case "clear-host": case "cls": case "clear": return { out: "", clear: true } as RunResult;
      case "get-help": case "help": {
        const t = args.find((a) => !a.startsWith("-"));
        if (!t) return { text: "\nKONU\n    PowerShell Yardım Sistemi (SİMÜLASYON)\n\nKISA AÇIKLAMA\n    Bir cmdlet hakkında bilgi için: Get-Help <cmdlet-adı>\n    Komutları aramak için: Get-Command\n    Örnek: Get-Help Get-Process\n" };
        const h = PS_HELP[t.toLowerCase()];
        if (!h) return { text: `Get-Help: Get-Help could not find ${t} in a help file or as a cmdlet.` };
        return { text: `\nAD\n    ${t}\n\nÖZET\n    ${h[0]}\n\nSÖZDİZİMİ\n    ${h[1]}\n\nÖRNEK\n    PS> ${h[2]}\n` };
      }
      case "get-command": case "gcm": {
        const { named, pos } = p(["name"]);
        const f = named.name ?? pos[0];
        const re = f ? wild(f) : null;
        const rows = PS_CMDLETS.filter((c) => !re || re.test(c)).map((c) => ({ CommandType: "Cmdlet", Name: c, Version: "7.4.0.0", Source: "Microsoft.PowerShell" }));
        if (!rows.length) return { text: `Get-Command: The term '${f}' is not recognized as a name of a cmdlet, function, script file, or executable program.` };
        return { obj: { cols: ["CommandType", "Name", "Version", "Source"], rows } };
      }
    }
    const x = this.ext(name, args);
    if (x !== null) return { text: x };
    return null;
  }

  private psFilter(stage: string, args: string[], cur: Out): Out | string {
    const name = stage.toLowerCase();
    const argStr = args.join(" ");
    if (name === "format-table" || name === "ft" || name === "out-host" || name === "format-list" || name === "fl" || name === "out-default") return cur;
    if (name === "select-string" || name === "findstr") {
      const pat = args.find((a) => !a.startsWith("-")); if (!pat) return "Select-String: Cannot bind argument to parameter 'Pattern' because it is null.";
      const text = "text" in cur ? cur.text : table(cur.obj);
      const re = new RegExp(pat.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      return { text: text.split("\n").filter((x) => re.test(x)).join("\n") };
    }
    if ("text" in cur) return { text: cur.text + (cur.text ? "\n" : "") + `${stage}: Bu simülasyonda ${stage} yalnızca nesne (Get-Process, Get-Service, Get-ChildItem) çıktılarıyla çalışır.` };
    const o = cur.obj;
    const getv = (r: Rec, k: string) => { const kk = Object.keys(r).find((x) => x.toLowerCase() === k.toLowerCase()); return kk ? r[kk] : undefined; };
    if (name === "where-object" || name === "where" || name === "?") {
      const m = argStr.match(/^\{?\s*(?:\$_\.)?([\w()]+)\s+-(\w+)\s+(.+?)\s*\}?$/);
      if (!m) return "Where-Object: Söz dizimi anlaşılamadı.\nÖrnek: Where-Object Status -eq Running   veya   Where-Object { $_.CPU -gt 1 }";
      const [, prop, op, rawVal] = m; const val = rawVal.replace(/^["']|["']$/g, "");
      const rows = o.rows.filter((r) => {
        const v = getv(r, prop);
        if (v === undefined) return false;
        const nv = Number(v), nc = Number(val);
        const num = !isNaN(nv) && !isNaN(nc) && String(v) !== "";
        switch (op.toLowerCase()) {
          case "eq": return num ? nv === nc : String(v).toLowerCase() === val.toLowerCase();
          case "ne": return num ? nv !== nc : String(v).toLowerCase() !== val.toLowerCase();
          case "gt": return nv > nc; case "lt": return nv < nc; case "ge": return nv >= nc; case "le": return nv <= nc;
          case "like": return wild(val).test(String(v)); case "notlike": return !wild(val).test(String(v));
          case "match": case "contains": return new RegExp(val, "i").test(String(v));
          default: return false;
        }
      });
      return { obj: { ...o, rows } };
    }
    if (name === "sort-object" || name === "sort") {
      const { sw, pos } = this.psParams(args, ["property"]);
      const prop = pos[0] ?? this.psParams(args, ["property"]).named.property;
      if (!prop) return cur;
      const rows = [...o.rows].sort((a, b) => { const x = getv(a, prop), y = getv(b, prop); const c = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y)); return sw.has("descending") ? -c : c; });
      return { obj: { ...o, rows } };
    }
    if (name === "select-object" || name === "select") {
      const { named, pos } = this.psParams(args, ["first", "last", "property"]);
      let rows = o.rows; let cols = o.cols;
      const props = (named.property ?? pos.join(" ")).split(",").map((x) => x.trim()).filter(Boolean);
      if (props.length) { cols = props.map((pp) => Object.keys(rows[0] ?? o.rows[0] ?? {}).find((k) => k.toLowerCase() === pp.toLowerCase()) ?? pp); }
      if (named.first) rows = rows.slice(0, Number(named.first));
      if (named.last) rows = rows.slice(-Number(named.last));
      return { obj: { cols, rows, header: props.length ? undefined : o.header } };
    }
    if (name === "measure-object" || name === "measure") return { text: `\nCount    : ${o.rows.length}\nAverage  :\nSum      :\nMaximum  :\nMinimum  :\nProperty :\n` };
    return `${stage}: The term '${stage}' is not recognized as a name of a cmdlet, function, script file, or executable program.`;
  }

  private runPs(line: string): RunResult {
    const toks = tokenize(line);
    const stages: string[][] = [[]];
    for (const t of toks) { if (t.op && t.v === "|") stages.push([]); else if (t.op) { stages[stages.length - 1].push(t.v); } else stages[stages.length - 1].push(t.v); }
    let cur: Out | null = null;
    // yönlendirme (>) desteği: yalnızca metin çıktılarında
    for (let i = 0; i < stages.length; i++) {
      const st = stages[i];
      if (!st.length) return { out: "Bir boş boru hattı öğesine izin verilmez (An empty pipe element is not allowed)." };
      const name = st[0].toLowerCase();
      if (i === 0) {
        const r = this.psSource(name, st.slice(1));
        if (!r) return { out: this.notFound(st[0]) };
        if ("clear" in r) return r;
        cur = r as Out;
      } else {
        const r = this.psFilter(st[0], st.slice(1), cur as Out);
        if (typeof r === "string") return { out: r };
        cur = r;
      }
    }
    const c = cur as Out;
    return { out: "text" in c ? c.text : table(c.obj) };
  }
}
