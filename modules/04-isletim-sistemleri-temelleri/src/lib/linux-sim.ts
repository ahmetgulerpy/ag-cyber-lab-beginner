import { CMDREF, CMDREF_MAP } from "@/data/cmdref";
import { symbolic } from "@/lib/perm";

export type LNode = { t: "d" | "f"; mode: number; owner: string; group: string; content: string; mtime: string };
export type RunResult = { out: string; clear?: boolean };

const USERS: Record<string, { uid: number; gid: number; groups: string[]; home: string; gnames: string }> = {
  root: { uid: 0, gid: 0, groups: ["root"], home: "/root", gnames: "0(root)" },
  ag: { uid: 1000, gid: 1000, groups: ["ag", "adm", "sudo", "dev"], home: "/home/ag", gnames: "1000(ag),4(adm),27(sudo),1001(dev)" },
  "www-data": { uid: 33, gid: 33, groups: ["www-data"], home: "/var/www", gnames: "33(www-data)" },
};

export const KALI_TOOLS: Record<string, [string, string]> = {
  nmap: ["Bilgi Toplama", "Ağ keşfi ve port tarama aracı (Network Mapper)."],
  whois: ["Bilgi Toplama", "Alan adı kayıt bilgilerini sorgular."],
  wireshark: ["Ağ Analizi", "Ağ trafiğini paket düzeyinde inceleyen analizör."],
  tcpdump: ["Ağ Analizi", "Komut satırında paket yakalama aracı."],
  hydra: ["Parola Saldırıları", "Yetkili testlerde kimlik doğrulama dayanıklılığını denetler."],
  john: ["Parola Saldırıları", "Parola özetlerinin (hash) gücünü test eden araç."],
  sqlmap: ["Web Uygulama Analizi", "SQL enjeksiyonu açığı denetleyen araç."],
  nikto: ["Web Uygulama Analizi", "Web sunucularında bilinen yapılandırma sorunlarını tarar."],
  "aircrack-ng": ["Kablosuz Ağ Testleri", "Kablosuz ağ güvenliğini değerlendirme araç seti."],
  autopsy: ["Adli Bilişim", "Disk imajlarını inceleyen adli analiz platformu."],
  msfconsole: ["Sömürü Çerçeveleri", "Metasploit Framework — yetkili güvenlik testleri için çerçeve."],
};

const KNOWN = ["ls", "cd", "pwd", "mkdir", "rmdir", "touch", "cp", "mv", "rm", "cat", "less", "head", "tail", "whoami", "id", "hostname", "uname", "date", "uptime", "df", "free", "ps", "top", "clear", "man", "echo", "history", "grep", "find", "chmod", "chown", "sudo", "help", "wc", "sort", "which", "exit", "apt", "ip", "ifconfig", "ping"];

export function tokenize(s: string) {
  const out: { v: string; op: boolean }[] = [];
  let cur = "", has = false, q = "";
  const push = () => { if (has) { out.push({ v: cur, op: false }); cur = ""; has = false; } };
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === q) q = ""; else cur += c; continue; }
    if (c === '"' || c === "'") { q = c; has = true; continue; }
    if (/\s/.test(c)) { push(); continue; }
    if (c === "|") { push(); out.push({ v: "|", op: true }); continue; }
    if (c === ">") { push(); if (s[i + 1] === ">") { out.push({ v: ">>", op: true }); i++; } else out.push({ v: ">", op: true }); continue; }
    cur += c; has = true;
  }
  if (q) throw new Error("bash: eşleşmeyen tırnak işareti (unexpected EOF while looking for matching quote)");
  push();
  return out;
}

function lev(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

function parseArgs(args: string[], valued: string[] = []) {
  const flags = new Set<string>();
  const vals: Record<string, string> = {};
  const rest: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--") { rest.push(...args.slice(i + 1)); break; }
    if (/^-\d+$/.test(a)) { vals.n = a.slice(1); continue; }
    if (a.startsWith("--")) { flags.add(a.slice(2)); continue; }
    if (a.length > 1 && a[0] === "-") {
      const ch = a.slice(1);
      if (valued.includes(ch[0])) vals[ch[0]] = ch.length > 1 ? ch.slice(1) : (args[++i] ?? "");
      else for (const c of ch) flags.add(c);
      continue;
    }
    rest.push(a);
  }
  return { flags, vals, rest };
}

const human = (n: number) => (n >= 1048576 ? (n / 1048576).toFixed(1) + "M" : n >= 1024 ? (n / 1024).toFixed(1) + "K" : String(n));
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const nowStr = () => { const d = new Date(); return `${MON[d.getMonth()]} ${String(d.getDate()).padStart(2)} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };
const dirname = (p: string) => p.slice(0, p.lastIndexOf("/")) || "/";
const basename = (p: string) => p.slice(p.lastIndexOf("/") + 1);

export class LinuxSim {
  fs = new Map<string, LNode>();
  cwd: string;
  prevCwd: string;
  user = "ag";
  hist: string[] = [];
  host: string;
  distro: "ubuntu" | "kali";

  constructor(distro: "ubuntu" | "kali" = "ubuntu") {
    this.distro = distro;
    this.host = distro === "kali" ? "kali" : "ag-lab";
    this.seed();
    this.cwd = "/home/ag";
    this.prevCwd = "/home/ag";
  }

  private add(path: string, t: "d" | "f", mode: number, owner = "ag", group = owner, content = "", mtime = "Jan 14 10:21") {
    this.fs.set(path, { t, mode, owner, group, content, mtime });
  }

  private seed() {
    const d = (p: string, m = 0o755, o = "root", g = o) => this.add(p, "d", m, o, g);
    d("/"); ["/home", "/etc", "/var", "/var/log", "/var/www", "/tmp", "/usr", "/usr/bin", "/usr/share", "/bin", "/opt", "/dev", "/boot", "/lib"].forEach((p) => d(p));
    this.add("/tmp", "d", 0o1777, "root", "root");
    d("/root", 0o700);
    d("/home/ag", 0o755, "ag"); d("/home/ag/Documents", 0o755, "ag"); d("/home/ag/Downloads", 0o755, "ag"); d("/home/ag/Desktop", 0o755, "ag");
    this.add("/home/ag/notlar.txt", "f", 0o644, "ag", "ag", "Linux notlarım\nKernel donanımı yönetir.\nShell komutları yorumlar.\nHer şey bir dosyadır.\n");
    this.add("/home/ag/rapor.txt", "f", 0o664, "ag", "dev", "Haftalık rapor\nDurum: tamamlandı\nSonraki adım: izin yönetimi\n");
    this.add("/home/ag/.bashrc", "f", 0o644, "ag", "ag", "# ~/.bashrc — kabuk ayarları\nalias ll='ls -l'\n");
    this.add("/home/ag/Documents/ders-plani.txt", "f", 0o644, "ag", "ag", "Pazartesi: Linux dosya sistemi\nSalı: Kullanıcılar ve gruplar\nÇarşamba: İzinler\n");
    this.add("/home/ag/Documents/parolalar.txt", "f", 0o666, "ag", "ag", "ornek-site: BU-SADECE-EGITIM-ICIN-SAHTE-PAROLA\n");
    this.add("/home/ag/Downloads/kurulum.sh", "f", 0o644, "ag", "ag", "#!/bin/bash\necho 'Kurulum betiği (simülasyon)'\n");
    this.add("/home/ag/Desktop/hosgeldin.txt", "f", 0o644, "ag", "ag", "Hoş geldin! Bu sanal bir eğitim masaüstüdür.\n");
    d("/home/ag/lab", 0o755, "ag");
    this.add("/home/ag/lab/hedefler.txt", "f", 0o644, "ag", "ag", "# Yetkili laboratuvar hedefleri (SANAL)\n10.0.2.15  lab-sunucu-1  (izinli)\n10.0.2.16  lab-sunucu-2  (izinli)\n");
    this.add("/home/ag/lab/notlar.md", "f", 0o644, "ag", "ag", "# Lab notları\n- Yalnızca izinli sistemlerde çalış\n- Her adımı kaydet\n- Raporunu yaz\n");
    d("/home/ag/lab/betikler", 0o755, "ag");
    this.add("/home/ag/lab/betikler/tarama.sh", "f", 0o644, "ag", "ag", "#!/bin/bash\n# Eğitim amaçlı örnek betik — gerçek tarama yapmaz\necho 'tarama taslağı'\n");
    this.add("/etc/passwd", "f", 0o644, "root", "root", "root:x:0:0:root:/root:/bin/bash\nag:x:1000:1000:AG Ogrenci:/home/ag:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\n");
    this.add("/etc/shadow", "f", 0o640, "root", "shadow", "root:$y$j9T$ORNEK-OZET:19000:0:99999:7:::\nag:$y$j9T$ORNEK-OZET2:19000:0:99999:7:::\n");
    this.add("/etc/hostname", "f", 0o644, "root", "root", this.host + "\n");
    this.add("/etc/hosts", "f", 0o644, "root", "root", `127.0.0.1 localhost\n127.0.1.1 ${this.host}\n`);
    this.add("/etc/sudoers", "f", 0o440, "root", "root", "root ALL=(ALL:ALL) ALL\n%sudo ALL=(ALL:ALL) ALL\n");
    this.add("/etc/os-release", "f", 0o644, "root", "root", this.distro === "kali"
      ? 'PRETTY_NAME="Kali GNU/Linux Rolling (SİMÜLASYON)"\nNAME="Kali GNU/Linux"\nID=kali\nID_LIKE=debian\nHOME_URL="https://www.kali.org/"\n'
      : 'PRETTY_NAME="Ubuntu 24.04 LTS (SİMÜLASYON)"\nNAME="Ubuntu"\nID=ubuntu\nID_LIKE=debian\n');
    this.add("/var/log/syslog", "f", 0o640, "root", "adm", "Jan 14 10:01:12 ag-lab systemd[1]: Started Daily apt download activities.\nJan 14 10:05:44 ag-lab NetworkManager[712]: connection activated\nJan 14 10:10:03 ag-lab CRON[1544]: (root) CMD (command -v debian-sa1)\nJan 14 10:15:27 ag-lab kernel: usb 1-1: new high-speed USB device\nJan 14 10:20:01 ag-lab systemd[1]: Started Session 4 of user ag.\n");
    this.add("/var/log/auth.log", "f", 0o640, "root", "adm", "Jan 14 09:58:01 ag-lab sshd[901]: Failed password for invalid user admin from 10.0.2.99\nJan 14 09:58:05 ag-lab sshd[901]: Failed password for invalid user admin from 10.0.2.99\nJan 14 10:02:10 ag-lab sudo: ag : TTY=pts/0 ; COMMAND=/usr/bin/apt update\nJan 14 10:20:01 ag-lab sshd[1650]: Accepted password for ag from 10.0.2.2\n");
    this.add("/var/www/index.html", "f", 0o644, "www-data", "www-data", "<h1>Merhaba, bu örnek bir web sayfasıdır</h1>\n");
    this.add("/usr/bin/python3", "f", 0o755, "root", "root", "(ikili dosya)");
    this.add("/bin/bash", "f", 0o755, "root", "root", "(ikili dosya)");
  }

  private get u() { return USERS[this.user]; }
  private resolve(p: string) {
    if (p === "~") p = this.u.home; else if (p.startsWith("~/")) p = this.u.home + p.slice(1);
    const parts = (p.startsWith("/") ? p : this.cwd + "/" + p).split("/");
    const out: string[] = [];
    for (const s of parts) { if (!s || s === ".") continue; if (s === "..") out.pop(); else out.push(s); }
    return "/" + out.join("/");
  }
  private children(p: string) {
    return [...this.fs.keys()].filter((k) => k !== "/" && dirname(k) === p).sort((a, b) => basename(a).toLowerCase().localeCompare(basename(b).toLowerCase()));
  }
  private can(n: LNode, bit: 4 | 2 | 1) {
    if (this.user === "root") return true;
    if (n.owner === this.user) return ((n.mode >> 6) & bit) !== 0;
    if (this.u.groups.includes(n.group)) return ((n.mode >> 3) & bit) !== 0;
    return (n.mode & bit) !== 0;
  }
  private glob(args: string[]) {
    const out: string[] = [];
    for (const a of args) {
      if (/[*?]/.test(a) && !a.startsWith("-")) {
        const abs = this.resolve(a);
        const re = new RegExp("^" + basename(abs).replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".") + "$");
        const hit = this.children(dirname(abs)).filter((c) => re.test(basename(c)) && !basename(c).startsWith("."));
        if (hit.length) { out.push(...hit.map((h) => (a.startsWith("/") ? h : this.rel(h)))); continue; }
      }
      out.push(a);
    }
    return out;
  }
  private rel(abs: string) {
    if (dirname(abs) === this.cwd) return basename(abs);
    if (abs.startsWith(this.cwd + "/")) return abs.slice(this.cwd.length + 1);
    return abs;
  }
  private vars(s: string) {
    return s.replace(/\$(USER|HOME|PWD|SHELL|HOSTNAME)\b/g, (_, k) => ({ USER: this.user, HOME: this.u.home, PWD: this.cwd, SHELL: "/bin/bash", HOSTNAME: this.host } as Record<string, string>)[k]);
  }

  entries(path: string) {
    return this.children(path).map((k) => ({ name: basename(k), path: k, ...this.fs.get(k)! }));
  }

  prompt() {
    const home = this.u.home;
    const dir = this.cwd === home ? "~" : this.cwd.startsWith(home + "/") ? "~" + this.cwd.slice(home.length) : this.cwd;
    return `${this.user}@${this.host}:${dir}${this.user === "root" ? "#" : "$"} `;
  }

  run(line: string): RunResult {
    const l = line.trim();
    if (!l) return { out: "" };
    this.hist.push(l);
    if (l === "clear") return { out: "", clear: true };
    try {
      return { out: this.pipeline(l) };
    } catch (e) {
      return { out: (e as Error).message };
    }
  }

  private pipeline(line: string) {
    const toks = tokenize(line);
    const stages: { v: string; op: boolean }[][] = [[]];
    for (const t of toks) { if (t.op && t.v === "|") stages.push([]); else stages[stages.length - 1].push(t); }
    let input: string | undefined;
    for (let i = 0; i < stages.length; i++) {
      let st = stages[i];
      if (!st.length) return "bash: sözdizimi hatası: '|' işaretinin yanında komut eksik (syntax error near unexpected token `|')";
      let redirect: { mode: ">" | ">>"; file: string } | null = null;
      const ri = st.findIndex((t) => t.op);
      if (ri >= 0) {
        const f = st[ri + 1];
        if (!f || f.op) return "bash: sözdizimi hatası: yönlendirme için dosya adı eksik (syntax error near unexpected token `newline')";
        redirect = { mode: st[ri].v as ">" | ">>", file: f.v };
        st = st.slice(0, ri);
      }
      const words = this.glob(st.map((t) => this.vars(t.v)));
      let out = this.exec(words[0], words.slice(1), input);
      if (redirect) {
        out = this.redirect(out, redirect.mode, redirect.file);
      }
      input = out;
    }
    return input ?? "";
  }

  private redirect(out: string, mode: ">" | ">>", file: string) {
    const abs = this.resolve(file);
    const ex = this.fs.get(abs);
    const parent = this.fs.get(dirname(abs));
    if (ex?.t === "d") return `bash: ${file}: Is a directory`;
    if (!parent || parent.t !== "d") return `bash: ${file}: No such file or directory`;
    if (ex) { if (!this.can(ex, 2)) return `bash: ${file}: Permission denied`; }
    else if (!this.can(parent, 2)) return `bash: ${file}: Permission denied`;
    const text = out.endsWith("\n") || out === "" ? out : out + "\n";
    if (ex) { ex.content = mode === ">>" ? ex.content + text : text; ex.mtime = nowStr(); }
    else this.add(abs, "f", 0o644, this.user, this.user, text, nowStr());
    return "";
  }

  private lsLine(path: string, n: LNode, flags: Set<string>, name: string) {
    const size = n.t === "d" ? 4096 : n.content.length;
    return `${symbolic(n.mode & 0o777, n.t === "d")} ${n.t === "d" ? 2 : 1} ${n.owner.padEnd(8)} ${n.group.padEnd(8)} ${(flags.has("h") ? human(size) : String(size)).padStart(6)} ${n.mtime} ${name}`;
  }

  private exec(cmd: string, args: string[], stdin?: string): string {
    switch (cmd) {
      case "sudo": return this.sudo(args);
      case "su": { if (args[0] && args[0] !== "-" && args[0] !== "root") return `su: user ${args[0]} does not exist`; this.user = "root"; this.cwd = "/root"; return "Parola: (simülasyonda parola gerekmez)\nroot oturumu açıldı — çıkmak için 'exit'. DİKKAT: root ile hata yapmak kolaydır!"; }
      case "exit": case "logout": if (this.user === "root") { this.user = "ag"; this.cwd = "/home/ag"; return "logout"; } return "logout\n(Simülasyonda terminal penceresi kapanmaz; deneyime devam edebilirsin.)";
      case "pwd": return this.cwd;
      case "whoami": return this.user;
      case "hostname": return this.host;
      case "id": {
        const who = args[0] ?? this.user; const x = USERS[who];
        if (!x) return `id: ‘${who}’: no such user`;
        return `uid=${x.uid}(${who}) gid=${x.gid}(${x.groups[0]}) groups=${x.gnames}`;
      }
      case "uname": { const f = parseArgs(args).flags; const k = "6.5.0-sim"; if (f.has("a")) return `Linux ${this.host} ${k} #1 SMP x86_64 GNU/Linux`; if (f.has("r")) return k; if (f.has("m")) return "x86_64"; return "Linux"; }
      case "date": return new Date().toString().replace(/ GMT.*/, " (yerel saat)");
      case "uptime": { const d = new Date(); return ` ${d.toTimeString().slice(0, 8)} up 2 days,  3:14,  1 user,  load average: 0.21, 0.18, 0.12`; }
      case "df": return "Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda2        40G   14G   24G  37% /\ntmpfs           2.0G     0  2.0G   0% /dev/shm\n/dev/sda1       512M  6.1M  506M   2% /boot/efi";
      case "free": return "               total        used        free      shared  buff/cache   available\nMem:           3.8Gi       1.2Gi       1.4Gi        42Mi       1.2Gi       2.4Gi\nSwap:          2.0Gi          0B       2.0Gi";
      case "ps": return args.some((a) => a.includes("a") || a.includes("e"))
        ? `USER         PID %CPU %MEM COMMAND\nroot           1  0.0  0.3 /sbin/init\nroot         412  0.1  0.5 /lib/systemd/systemd-journald\nroot         688  0.0  0.4 /usr/sbin/sshd -D\nwww-data     735  0.0  0.6 nginx: worker process\nag          1190  0.4  1.8 /usr/bin/gnome-shell\nag          1203  0.0  0.2 -bash\nag          1544  0.0  0.1 ps ${args.join(" ")}`
        : "    PID TTY          TIME CMD\n   1203 pts/0    00:00:00 bash\n   1544 pts/0    00:00:00 ps";
      case "top": return "top - 10:21:33 up 2 days,  3:14,  1 user,  load average: 0.21, 0.18, 0.12\nTasks:   7 total,   1 running,   6 sleeping,   0 stopped\n%Cpu(s):  4.3 us,  1.2 sy,  0.0 ni, 94.2 id\nMiB Mem :   3891.0 total,   1432.5 free,   1228.4 used\n\n    PID USER      %CPU  %MEM COMMAND\n   1190 ag         4.3   1.8 gnome-shell\n    412 root       0.7   0.5 systemd-journal\n    735 www-data   0.3   0.6 nginx\n    688 root       0.0   0.4 sshd\n      1 root       0.0   0.3 systemd\n\n(Simülasyon: gerçek top canlı güncellenir; çıkmak için q kullanılır.)";
      case "history": return this.hist.map((h, i) => `${String(i + 1).padStart(5)}  ${h}`).join("\n");
      case "echo": return args.join(" ");
      case "help": return "Desteklenen komutlar (SANAL TERMİNAL):\n" + KNOWN.join("  ") + "\n\nİpucu: 'man <komut>' ile kılavuz, 'history' ile geçmiş. ↑/↓ tuşları geçmişte gezinir.";
      case "man": {
        const c = CMDREF_MAP[args[0] ?? ""];
        if (!args[0]) return "Hangi kılavuz sayfasını istiyorsun?\nÖrnek: man ls";
        if (!c) return `No manual entry for ${args[0]}`;
        return `${c.cmd.toUpperCase()}(1)                 Kullanıcı Komutları (özet kılavuz)\n\nNAME\n    ${c.cmd} — ${c.what}\n\nSYNOPSIS\n    ${c.usage}\n\nOPTIONS\n${c.params.map((p) => "    " + p).join("\n")}\n\nÖRNEK\n    ${c.try}${c.risk ? "\n\nDİKKAT\n    " + c.risk : ""}`;
      }
      case "which": { const k = args[0]; if (!k) return ""; return KNOWN.includes(k) || KALI_TOOLS[k] && this.distro === "kali" ? `/usr/bin/${k}` : ""; }
      case "nano": case "vim": case "vi": return `Simülasyonda ${cmd} düzenleyicisi yok. Dosyaya metin yazmak için:\n  echo 'metin' > dosya.txt   (üzerine yazar)\n  echo 'metin' >> dosya.txt  (sona ekler)`;
      case "ip": return "1: lo: <LOOPBACK,UP> mtu 65536\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP> mtu 1500\n    inet 10.0.2.15/24 brd 10.0.2.255 scope global eth0\n    link/ether 08:00:27:ab:cd:ef\n(Simülasyon çıktısı)";
      case "ifconfig": return "eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n        inet 10.0.2.15  netmask 255.255.255.0  broadcast 10.0.2.255\n        ether 08:00:27:ab:cd:ef\nlo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536\n        inet 127.0.0.1  netmask 255.0.0.0\n(Simülasyon çıktısı)";
      case "ping": { const t = args.find((a) => !a.startsWith("-")); if (!t) return "ping: hedef belirtilmedi (usage error: Destination address required)"; const c = Number(parseArgs(args, ["c"]).vals.c || 3); return [`PING ${t} (SİMÜLASYON) 56(84) bytes of data.`, ...Array.from({ length: c }, (_, i) => `64 bytes from ${t}: icmp_seq=${i + 1} ttl=64 time=${(0.4 + i * 0.13).toFixed(2)} ms`), `--- ${t} ping statistics ---`, `${c} packets transmitted, ${c} received, 0% packet loss`].join("\n"); }
      case "apt": case "apt-get": return this.apt(args);
      case "kali-tools": if (this.distro !== "kali") break; return "Araç kategorileri (SİMÜLASYON — araçlar gerçekte kurulu değildir):\n" + [...new Set(Object.values(KALI_TOOLS).map((t) => t[0]))].map((c) => `  • ${c}: ${Object.entries(KALI_TOOLS).filter(([, v]) => v[0] === c).map(([k]) => k).join(", ")}`).join("\n") + "\n\nBir araç adını yazarak açıklamasını görebilirsin (ör. nmap).";
      case "ls": return this.ls(args);
      case "cd": return this.cd(args);
      case "mkdir": return this.mkdir(args);
      case "rmdir": return this.rmdir(args);
      case "touch": return this.touch(args);
      case "cp": return this.cpmv(args, false);
      case "mv": return this.cpmv(args, true);
      case "rm": return this.rm(args);
      case "cat": return this.cat(args, stdin);
      case "less": case "more": { const o = this.cat(args, stdin); return o + (o.includes("Permission denied") || o.includes("No such") ? "" : "\n(Simülasyonda less tüm içeriği tek seferde gösterir; gerçek sistemde q ile çıkılır.)"); }
      case "head": case "tail": return this.headtail(cmd, args, stdin);
      case "wc": { const f = parseArgs(args).flags; const text = stdin ?? this.cat(parseArgs(args).rest, undefined); const lines = text ? text.split("\n").filter((x, i, a) => !(i === a.length - 1 && x === "")).length : 0; return f.has("l") ? String(lines) : `${lines} ${text.split(/\s+/).filter(Boolean).length} ${text.length}`; }
      case "sort": { const text = stdin ?? this.cat(args.filter((a) => !a.startsWith("-")), undefined); return text.split("\n").filter(Boolean).sort().join("\n"); }
      case "grep": return this.grep(args, stdin);
      case "find": return this.find(args);
      case "chmod": return this.chmod(args);
      case "chown": return this.chown(args);
    }
    if (this.distro === "kali" && KALI_TOOLS[cmd]) {
      const [cat, desc] = KALI_TOOLS[cmd];
      return `[SİMÜLASYON] ${cmd} — kategori: ${cat}\n${desc}\n\nBu eğitim ortamında gerçek ${cmd} aracı ÇALIŞTIRILMAZ ve ağda hiçbir işlem yapılmaz.\nGerçek hayatta bu tür araçlar yalnızca yazılı izin (yetkilendirme) alınmış sistemlerde kullanılır.`;
    }
    if (cmd.startsWith("./")) return `bash: ${cmd}: Simülasyonda betik çalıştırılmaz (yalnızca eğitim amaçlı sanal dosya sistemi).`;
    const near = KNOWN.map((k) => [k, lev(cmd, k)] as const).sort((a, b) => a[1] - b[1])[0];
    return `bash: ${cmd}: command not found\n[Açıklama] Kabuk (shell) '${cmd}' adında bir program bulamadı. Komutu yanlış yazmış olabilirsin; Linux büyük/küçük harfe duyarlıdır.${near[1] <= 2 ? `\n[İpucu] Bunu mu demek istedin: ${near[0]} ?` : ""}\nDesteklenen komutlar için 'help' yaz.`;
  }

  private sudo(args: string[]) {
    if (!args.length) return "usage: sudo komut";
    if (this.user === "root") return this.exec(args[0], args.slice(1));
    if (!this.u.groups.includes("sudo")) return `${this.user} is not in the sudoers file. This incident will be reported.`;
    if (args[0] === "-i" || args[0] === "su") { this.user = "root"; this.cwd = "/root"; return "[sudo] ag için parola: (simülasyonda parola gerekmez)\nroot oturumu açıldı — çıkmak için 'exit'. DİKKAT: root ile hata yapmak kolaydır!"; }
    const prev = this.user;
    this.user = "root";
    let out: string;
    try { out = this.pipelineOne(args); } finally { this.user = prev; }
    return `[sudo] ag için parola: (simülasyonda parola gerekmez)${out ? "\n" + out : ""}`;
  }
  private pipelineOne(args: string[]) { return this.exec(args[0], args.slice(1)); }

  private apt(args: string[]) {
    const sub = args[0];
    if (!sub) return "apt 2.7 (simülasyon) — kullanım: apt update | apt install <paket> | apt list";
    if (this.user !== "root") return "E: Could not open lock file /var/lib/dpkg/lock-frontend - open (13: Permission denied)\nE: Unable to acquire the dpkg frontend lock (/var/lib/dpkg/lock-frontend), are you root?\n[Açıklama] Paket kurmak sistem değiştirir; bu yüzden yönetici yetkisi (sudo) gerekir.";
    if (sub === "update") return "Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease\nReading package lists... Done\n(Simülasyon: ağdan gerçek veri indirilmedi.)";
    if (sub === "install") return `Reading package lists... Done\n'${args.slice(1).join(" ")}' paketi için SİMÜLE edilmiş kurulum tamamlandı.\n(Gerçekte hiçbir paket indirilmedi veya kurulmadı.)`;
    if (sub === "list") return "bash/noble 5.2.21 amd64\ncoreutils/noble 9.4 amd64\nopenssh-server/noble 9.6 amd64";
    return `E: Invalid operation ${sub}`;
  }

  private ls(args: string[]) {
    const { flags, rest } = parseArgs(args);
    const targets = rest.length ? rest : ["."];
    const blocks: string[] = [];
    for (const t of targets) {
      const abs = this.resolve(t);
      const n = this.fs.get(abs);
      if (!n) { blocks.push(`ls: cannot access '${t}': No such file or directory`); continue; }
      if (n.t === "f") { blocks.push(flags.has("l") ? this.lsLine(abs, n, flags, t) : t); continue; }
      if (!this.can(n, 4)) { blocks.push(`ls: cannot open directory '${t}': Permission denied`); continue; }
      let kids = this.children(abs);
      if (!flags.has("a")) kids = kids.filter((k) => !basename(k).startsWith("."));
      const names = kids.map((k) => ({ k, n: this.fs.get(k)!, name: basename(k) }));
      if (flags.has("a")) { names.unshift({ k: abs, n, name: "." }, { k: dirname(abs), n: this.fs.get(dirname(abs))!, name: ".." }); }
      let body: string;
      if (flags.has("l")) body = `total ${names.length * 4}\n` + names.map((x) => this.lsLine(x.k, x.n, flags, x.name)).join("\n");
      else body = names.map((x) => x.name + (x.n.t === "d" && x.name !== "." && x.name !== ".." ? "" : "")).join("  ");
      blocks.push((targets.length > 1 ? `${t}:\n` : "") + body);
    }
    return blocks.join("\n\n");
  }

  private cd(args: string[]) {
    let t = args[0] ?? "~";
    if (t === "-") { t = this.prevCwd; }
    const abs = this.resolve(t);
    const n = this.fs.get(abs);
    if (!n) return `bash: cd: ${args[0]}: No such file or directory`;
    if (n.t !== "d") return `bash: cd: ${args[0]}: Not a directory`;
    if (!this.can(n, 1)) return `bash: cd: ${args[0]}: Permission denied\n[Açıklama] Bu dizine girmek için çalıştırma (x) izni gerekir.`;
    this.prevCwd = this.cwd;
    this.cwd = abs;
    return "";
  }

  private mkdir(args: string[]) {
    const { flags, rest } = parseArgs(args);
    if (!rest.length) return "mkdir: eksik işlenen (missing operand)";
    const out: string[] = [];
    for (const r of rest) {
      const abs = this.resolve(r);
      if (this.fs.has(abs)) { if (!flags.has("p")) out.push(`mkdir: cannot create directory '${r}': File exists`); continue; }
      const chain: string[] = [];
      let cur = abs;
      while (!this.fs.has(cur)) { chain.unshift(cur); cur = dirname(cur); }
      if (chain.length > 1 && !flags.has("p")) { out.push(`mkdir: cannot create directory '${r}': No such file or directory\n[İpucu] Ara klasörleri de oluşturmak için -p kullan.`); continue; }
      const parent = this.fs.get(cur)!;
      if (!this.can(parent, 2)) { out.push(`mkdir: cannot create directory '${r}': Permission denied`); continue; }
      chain.forEach((c) => this.add(c, "d", 0o755, this.user, this.user, "", nowStr()));
    }
    return out.join("\n");
  }

  private rmdir(args: string[]) {
    if (!args.length) return "rmdir: eksik işlenen (missing operand)";
    const out: string[] = [];
    for (const r of args) {
      const abs = this.resolve(r); const n = this.fs.get(abs);
      if (!n) out.push(`rmdir: failed to remove '${r}': No such file or directory`);
      else if (n.t !== "d") out.push(`rmdir: failed to remove '${r}': Not a directory`);
      else if (this.children(abs).length) out.push(`rmdir: failed to remove '${r}': Directory not empty\n[Açıklama] rmdir yalnızca boş klasör siler. Dolu klasör için rm -r gerekir (dikkatli kullan!).`);
      else if (!this.can(this.fs.get(dirname(abs))!, 2)) out.push(`rmdir: failed to remove '${r}': Permission denied`);
      else this.fs.delete(abs);
    }
    return out.join("\n");
  }

  private touch(args: string[]) {
    if (!args.length) return "touch: eksik dosya işleneni (missing file operand)";
    const out: string[] = [];
    for (const r of args) {
      const abs = this.resolve(r); const ex = this.fs.get(abs); const parent = this.fs.get(dirname(abs));
      if (ex) { ex.mtime = nowStr(); continue; }
      if (!parent) { out.push(`touch: cannot touch '${r}': No such file or directory`); continue; }
      if (!this.can(parent, 2)) { out.push(`touch: cannot touch '${r}': Permission denied`); continue; }
      this.add(abs, "f", 0o644, this.user, this.user, "", nowStr());
    }
    return out.join("\n");
  }

  private copyTree(src: string, dst: string, move: boolean) {
    const pairs = [...this.fs.entries()].filter(([k]) => k === src || k.startsWith(src + "/"));
    for (const [k, n] of pairs) this.fs.set(dst + k.slice(src.length), { ...n, mtime: nowStr(), owner: move ? n.owner : this.user, group: move ? n.group : this.user });
    if (move) for (const [k] of pairs) this.fs.delete(k);
  }

  private cpmv(args: string[], move: boolean) {
    const name = move ? "mv" : "cp";
    const { flags, rest } = parseArgs(args);
    if (rest.length < 2) return `${name}: eksik işlenen (missing file operand)\nKullanım: ${name} ${move ? "" : "[-r] "}kaynak hedef`;
    const dstArg = rest[rest.length - 1];
    const srcs = rest.slice(0, -1);
    let dst = this.resolve(dstArg);
    const dn = this.fs.get(dst);
    if (srcs.length > 1 && dn?.t !== "d") return `${name}: target '${dstArg}' is not a directory`;
    for (const s of srcs) {
      const abs = this.resolve(s); const n = this.fs.get(abs);
      if (!n) return `${name}: cannot stat '${s}': No such file or directory`;
      if (n.t === "d" && !move && !flags.has("r") && !flags.has("R")) return `${name}: -r not specified; omitting directory '${s}'\n[İpucu] Klasör kopyalamak için cp -r kullan.`;
      if (!this.can(n, 4) && !move) return `${name}: cannot open '${s}' for reading: Permission denied`;
      const target = dn?.t === "d" ? dst + "/" + basename(abs) : dst;
      if (target === abs || target.startsWith(abs + "/")) return `${name}: cannot copy/move '${s}' into itself`;
      const parent = this.fs.get(dirname(target));
      if (!parent) return `${name}: cannot create '${dstArg}': No such file or directory`;
      if (!this.can(parent, 2)) return `${name}: cannot create '${dstArg}': Permission denied`;
      this.copyTree(abs, target, move);
    }
    return "";
  }

  private rm(args: string[]) {
    const { flags, rest } = parseArgs(args);
    const recursive = flags.has("r") || flags.has("R");
    const force = flags.has("f");
    if (!rest.length) return force ? "" : "rm: eksik işlenen (missing operand)";
    const out: string[] = [];
    for (const r of rest) {
      const abs = this.resolve(r);
      if (abs === "/" || ["/home", "/etc", "/usr", "/bin", "/var", "/boot"].includes(abs) || r === "/*") {
        return `rm: it is dangerous to operate recursively on '${r}'\n\n⚠ SİMÜLASYON KORUMASI: Gerçek bir sistemde bu komut işletim sistemini geri dönüşsüz biçimde yok edebilirdi.\nBurada engellendi. Bu yüzden 'rm -rf' kullanmadan önce yolu iki kez kontrol et!`;
      }
      const n = this.fs.get(abs);
      if (!n) { if (!force) out.push(`rm: cannot remove '${r}': No such file or directory`); continue; }
      if (n.t === "d" && !recursive) { out.push(`rm: cannot remove '${r}': Is a directory\n[İpucu] Klasör silmek için -r gerekir; silinen veri geri gelmez.`); continue; }
      const parent = this.fs.get(dirname(abs))!;
      if (!this.can(parent, 2)) { out.push(`rm: cannot remove '${r}': Permission denied`); continue; }
      for (const k of [...this.fs.keys()]) if (k === abs || k.startsWith(abs + "/")) this.fs.delete(k);
    }
    return out.join("\n");
  }

  private cat(args: string[], stdin?: string) {
    const files = args.filter((a) => !a.startsWith("-"));
    if (!files.length) return stdin ?? "";
    const out: string[] = [];
    for (const f of files) {
      const abs = this.resolve(f); const n = this.fs.get(abs);
      if (!n) out.push(`cat: ${f}: No such file or directory`);
      else if (n.t === "d") out.push(`cat: ${f}: Is a directory`);
      else if (!this.can(n, 4)) out.push(`cat: ${f}: Permission denied\n[Açıklama] Bu dosyayı okumak için okuma (r) iznin yok. 'ls -l' ile izinlere, 'id' ile gruplarına bak; yetkin varsa sudo kullanabilirsin.`);
      else out.push(n.content.replace(/\n$/, ""));
    }
    return out.join("\n");
  }

  private headtail(cmd: string, args: string[], stdin?: string) {
    const { vals, rest } = parseArgs(args, ["n"]);
    const n = Number(vals.n ?? 10);
    const text = rest.length ? this.cat(rest) : stdin ?? "";
    if (/Permission denied|No such file|Is a directory/.test(text)) return text.replace(/^cat:/, cmd + ":");
    const lines = text.split("\n");
    return (cmd === "head" ? lines.slice(0, n) : lines.slice(-n)).join("\n");
  }

  private grep(args: string[], stdin?: string) {
    const { flags, rest } = parseArgs(args);
    const pat = rest[0];
    if (pat === undefined) return "Kullanım: grep [-i] [-n] [-r] [-v] desen [dosya]";
    let re: RegExp;
    try { re = new RegExp(pat, flags.has("i") ? "i" : ""); } catch { re = new RegExp(pat.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags.has("i") ? "i" : ""); }
    const sources: { name: string; text: string }[] = [];
    const files = rest.slice(1);
    if (!files.length) { if (stdin === undefined) return "grep: dosya veya giriş (pipe) belirtilmedi"; sources.push({ name: "", text: stdin }); }
    for (const f of files) {
      const abs = this.resolve(f); const n = this.fs.get(abs);
      if (!n) return `grep: ${f}: No such file or directory`;
      const walk = (p: string, node: LNode) => {
        if (node.t === "f") { if (this.can(node, 4)) sources.push({ name: p, text: node.content }); }
        else if (flags.has("r")) this.children(p).forEach((c) => walk(c, this.fs.get(c)!));
      };
      if (n.t === "d" && !flags.has("r")) return `grep: ${f}: Is a directory`;
      if (n.t === "f" && !this.can(n, 4)) return `grep: ${f}: Permission denied`;
      walk(abs, n);
    }
    const multi = sources.length > 1 || flags.has("r");
    const out: string[] = [];
    let count = 0;
    for (const s of sources) s.text.split("\n").forEach((line, i, arr) => {
      if (i === arr.length - 1 && line === "") return;
      const hit = re.test(line) !== flags.has("v");
      if (hit) { count++; out.push(`${multi && s.name ? s.name + ":" : ""}${flags.has("n") ? i + 1 + ":" : ""}${line}`); }
    });
    return flags.has("c") ? String(count) : out.join("\n");
  }

  private find(args: string[]) {
    let start = ".";
    let i = 0;
    if (args[0] && !args[0].startsWith("-")) { start = args[0]; i = 1; }
    let name: string | null = null, type: string | null = null;
    for (; i < args.length; i++) { if (args[i] === "-name") name = args[++i]; else if (args[i] === "-type") type = args[++i]; }
    const abs = this.resolve(start);
    if (!this.fs.has(abs)) return `find: '${start}': No such file or directory`;
    const re = name ? new RegExp("^" + name.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".") + "$") : null;
    const out: string[] = [];
    const denied: string[] = [];
    const walk = (p: string) => {
      const n = this.fs.get(p)!;
      if (n.t === "d" && !this.can(n, 4)) { denied.push(`find: ‘${p}’: Permission denied`); return; }
      const shown = start.startsWith("/") ? p : p === this.cwd ? "." : "./" + p.slice(this.cwd.length + 1);
      if ((!re || re.test(basename(p))) && (!type || (type === "f" && n.t === "f") || (type === "d" && n.t === "d"))) out.push(shown);
      if (n.t === "d") this.children(p).forEach(walk);
    };
    walk(abs);
    return [...out, ...denied].join("\n");
  }

  private parseMode(spec: string, old: number, isDir: boolean) {
    if (/^[0-7]{3,4}$/.test(spec)) return parseInt(spec.slice(-3), 8);
    let mode = old & 0o777;
    for (const part of spec.split(",")) {
      const m = part.match(/^([ugoa]*)([+\-=])([rwxX]*)$/);
      if (!m) return null;
      const who = m[1] || "a";
      let bits = 0;
      for (const c of m[3]) bits |= c === "r" ? 4 : c === "w" ? 2 : 1;
      if (m[3].includes("X") && !isDir) bits &= ~1;
      for (const w of who === "a" ? "ugo" : who) {
        const sh = w === "u" ? 6 : w === "g" ? 3 : 0;
        if (m[2] === "+") mode |= bits << sh;
        else if (m[2] === "-") mode &= ~(bits << sh);
        else mode = (mode & ~(7 << sh)) | (bits << sh);
      }
    }
    return mode & 0o777;
  }

  private chmod(args: string[]) {
    const recursive = args.includes("-R");
    const rest = args.filter((a) => a !== "-R");
    if (rest.length < 2) return "chmod: eksik işlenen (missing operand)\nKullanım: chmod 644 dosya   veya   chmod u+x dosya";
    const [spec, ...files] = rest;
    for (const f of files) {
      const abs = this.resolve(f); const n = this.fs.get(abs);
      if (!n) return `chmod: cannot access '${f}': No such file or directory`;
      if (this.user !== "root" && n.owner !== this.user) return `chmod: changing permissions of '${f}': Operation not permitted\n[Açıklama] İzinleri yalnızca dosyanın sahibi veya root değiştirebilir.`;
      const m = this.parseMode(spec, n.mode, n.t === "d");
      if (m === null) return `chmod: invalid mode: ‘${spec}’\n[İpucu] Örnekler: 755, 644, u+x, go-w`;
      for (const k of [...this.fs.keys()]) if (k === abs || (recursive && k.startsWith(abs + "/"))) { const x = this.fs.get(k)!; x.mode = m; }
    }
    return "";
  }

  private chown(args: string[]) {
    const recursive = args.includes("-R");
    const rest = args.filter((a) => a !== "-R");
    if (rest.length < 2) return "chown: eksik işlenen (missing operand)\nKullanım: sudo chown kullanıcı[:grup] dosya";
    const [spec, ...files] = rest;
    const [o, g] = spec.split(":");
    const known = ["root", "ag", "www-data", "dev", "sudo", "adm", "shadow"];
    if ((o && !known.includes(o)) || (g && !known.includes(g))) return `chown: invalid user: ‘${spec}’`;
    for (const f of files) {
      const abs = this.resolve(f); const n = this.fs.get(abs);
      if (!n) return `chown: cannot access '${f}': No such file or directory`;
      if (this.user !== "root") return `chown: changing ownership of '${f}': Operation not permitted\n[Açıklama] Sahipliği yalnızca root değiştirebilir. Gerçekte 'sudo chown ...' gerekir — ama ne yaptığını bilerek!`;
      for (const k of [...this.fs.keys()]) if (k === abs || (recursive && k.startsWith(abs + "/"))) { const x = this.fs.get(k)!; if (o) x.owner = o; if (g) x.group = g; }
    }
    return "";
  }
}

export const LINUX_CMD_COUNT = CMDREF.length;
