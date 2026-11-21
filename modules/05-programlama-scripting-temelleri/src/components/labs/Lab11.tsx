"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Btn, inputCls, Label, LabNote, Terminal, TraceViewer, type Step } from "../ui";

const HOME = "/home/ogrenci";
type Node = { t: "d" | "f"; c: string };
type Sess = { fs: Record<string, Node>; cwd: string; env: Record<string, string>; last: number };

function initSess(): Sess {
  return {
    fs: {
      "/": { t: "d", c: "" },
      "/home": { t: "d", c: "" },
      [HOME]: { t: "d", c: "" },
      [`${HOME}/belgeler`]: { t: "d", c: "" },
      [`${HOME}/projeler`]: { t: "d", c: "" },
      [`${HOME}/.bashrc`]: { t: "f", c: "# sanal bashrc" },
      [`${HOME}/notlar.txt`]: { t: "f", c: "Bash öğreniyorum\nlinux güzel\nBash komutları: ls, cd, cat" },
      [`${HOME}/auth.log`]: {
        t: "f",
        c: "Jan 10 09:01 sshd: Accepted password for ayse from 10.0.0.7\nJan 10 09:02 sshd: Failed password for root from 203.0.113.9\nJan 10 09:03 sshd: Failed password for admin from 203.0.113.9\nJan 10 09:05 sshd: Accepted password for mehmet from 10.0.0.12",
      },
      [`${HOME}/selam.sh`]: { t: "f", c: '#!/bin/bash\nisim="ogrenci"\necho "Merhaba $isim"\necho "Bugün: $(date +%F)"' },
      [`${HOME}/log_say.sh`]: { t: "f", c: '#!/bin/bash\nsayac=0\nfor s in FAILED OK FAILED FAILED; do\n  [ "$s" = "FAILED" ] && sayac=$((sayac+1))\ndone\necho "Toplam başarısız: $sayac"' },
      [`${HOME}/yedek.sh`]: { t: "f", c: '#!/bin/bash\nmkdir -p "$HOME/yedek"\ncp -r "$HOME/belgeler" "$HOME/yedek"\necho "Yedekleme tamam"' },
    },
    cwd: HOME,
    env: { HOME, USER: "ogrenci", SHELL: "/bin/bash" },
    last: 0,
  };
}

function norm(p: string): string {
  const parts: string[] = [];
  for (const s of p.split("/")) {
    if (!s || s === ".") continue;
    if (s === "..") parts.pop();
    else parts.push(s);
  }
  return "/" + parts.join("/");
}
function resolve(s: Sess, p: string): string {
  let q = p;
  if (q === "~" || q.startsWith("~/")) q = HOME + q.slice(1);
  return norm(q.startsWith("/") ? q : s.cwd + "/" + q);
}
function children(s: Sess, dir: string): string[] {
  const pre = dir === "/" ? "/" : dir + "/";
  return Object.keys(s.fs).filter((k) => k !== dir && k.startsWith(pre) && !k.slice(pre.length).includes("/")).map((k) => k.slice(pre.length)).sort();
}
function tokenize(line: string): string[] {
  const out: string[] = [];
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) out.push(m[1] ?? m[2] ?? m[3]);
  return out;
}
function expand(s: Sess, t: string): string {
  return t
    .replace(/\$\(date \+?([^)]*)\)/g, (_, f: string) => fmtDate(f))
    .replace(/\$\?/g, String(s.last))
    .replace(/\$\{?([A-Za-z_][A-Za-z0-9_]*)\}?/g, (_, n: string) => s.env[n] ?? "");
}
function fmtDate(f: string): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  if (f === "%F") return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  if (f === "%H:%M") return `${p(d.getHours())}:${p(d.getMinutes())}`;
  return d.toLocaleString("tr-TR");
}

type R = { out: string; err?: boolean };

function runSingle(s: Sess, line: string, stdin: string | null): R {
  const raw = tokenize(line.trim());
  if (!raw.length) return { out: "" };
  const quotedEcho = raw[0] === "echo";
  const toks = raw.map((t) => expand(s, t));
  const cmd = raw[0];
  const args = toks.slice(1);
  const flags = args.filter((a) => a.startsWith("-") && a.length > 1);
  const pos = args.filter((a) => !(a.startsWith("-") && a.length > 1));

  // atama: VAR=deger
  if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(raw[0]) && raw.length === 1) {
    const i = raw[0].indexOf("=");
    s.env[raw[0].slice(0, i)] = expand(s, raw[0].slice(i + 1));
    return { out: "" };
  }

  switch (cmd) {
    case "pwd":
      return { out: s.cwd };
    case "whoami":
      return { out: "ogrenci" };
    case "hostname":
      return { out: "aglab-sanal" };
    case "id":
      return { out: "uid=1000(ogrenci) gid=1000(ogrenci) groups=1000(ogrenci)" };
    case "uname":
      return { out: flags.includes("-a") ? "Linux aglab-sanal 6.1.0-sim #1 SMP x86_64 GNU/Linux (sanal)" : "Linux" };
    case "date":
      return { out: new Date().toLocaleString("tr-TR") };
    case "echo": {
      void quotedEcho;
      return { out: pos.concat(flags.filter((f) => f !== "-n")).length ? args.filter((a) => a !== "-n").join(" ") : "" };
    }
    case "ls": {
      const target = pos[0] ? resolve(s, pos[0]) : s.cwd;
      const n = s.fs[target];
      if (!n) return { out: `ls: '${pos[0]}' erişilemiyor: Böyle bir dosya ya da dizin yok`, err: true };
      const all = flags.some((f) => f.includes("a"));
      const long = flags.some((f) => f.includes("l"));
      let names = n.t === "d" ? children(s, target) : [target.split("/").pop() as string];
      if (!all) names = names.filter((x) => !x.startsWith("."));
      else if (n.t === "d") names = [".", "..", ...names];
      if (!long) return { out: names.join("  ") };
      const rows = names.map((nm) => {
        const full = nm === "." ? target : nm === ".." ? norm(target + "/..") : n.t === "d" ? (target === "/" ? "/" : target + "/") + nm : target;
        const nd = s.fs[full];
        const isDir = nd?.t === "d";
        const size = isDir ? 4096 : (nd?.c.length ?? 0);
        const exec = !isDir && nm.endsWith(".sh") ? "-rwxr-xr-x" : isDir ? "drwxr-xr-x" : "-rw-r--r--";
        return `${exec} 1 ogrenci ogrenci ${String(size).padStart(5)} Oca 10 09:00 ${nm}`;
      });
      return { out: `toplam ${rows.length}\n` + rows.join("\n") };
    }
    case "cd": {
      const t = pos[0] ? resolve(s, pos[0]) : HOME;
      const n = s.fs[t];
      if (!n) return { out: `bash: cd: ${pos[0]}: Böyle bir dosya ya da dizin yok`, err: true };
      if (n.t !== "d") return { out: `bash: cd: ${pos[0]}: Bir dizin değil`, err: true };
      s.cwd = t;
      return { out: "" };
    }
    case "mkdir": {
      if (!pos.length) return { out: "mkdir: eksik işlenen", err: true };
      const p = flags.includes("-p");
      for (const a of pos) {
        const t = resolve(s, a);
        if (s.fs[t]) {
          if (!p) return { out: `mkdir: '${a}' dizini oluşturulamıyor: Dosya mevcut`, err: true };
          continue;
        }
        const parent = norm(t + "/..");
        if (!s.fs[parent] && !p) return { out: `mkdir: '${a}' dizini oluşturulamıyor: Böyle bir dosya ya da dizin yok`, err: true };
        if (p) {
          let acc = "";
          for (const seg of t.split("/").filter(Boolean)) {
            acc += "/" + seg;
            if (!s.fs[acc]) s.fs[acc] = { t: "d", c: "" };
          }
        } else s.fs[t] = { t: "d", c: "" };
      }
      return { out: "" };
    }
    case "touch": {
      if (!pos.length) return { out: "touch: eksik dosya işleneni", err: true };
      for (const a of pos) {
        const t = resolve(s, a);
        if (!s.fs[norm(t + "/..")]) return { out: `touch: '${a}' dosyasına dokunulamıyor: Böyle bir dosya ya da dizin yok`, err: true };
        if (!s.fs[t]) s.fs[t] = { t: "f", c: "" };
      }
      return { out: "" };
    }
    case "cat": {
      if (!pos.length) return { out: stdin ?? "" };
      const outs: string[] = [];
      for (const a of pos) {
        const n = s.fs[resolve(s, a)];
        if (!n) return { out: `cat: ${a}: Böyle bir dosya ya da dizin yok`, err: true };
        if (n.t === "d") return { out: `cat: ${a}: Bir dizin`, err: true };
        outs.push(n.c);
      }
      return { out: outs.join("\n") };
    }
    case "rm": {
      if (!pos.length) return { out: "rm: eksik işlenen", err: true };
      const rec = flags.some((f) => f.includes("r"));
      for (const a of pos) {
        const t = resolve(s, a);
        if (t === "/" || t === "/home" || t === HOME) return { out: `rm: '${t}' üzerinde işlem yapmak tehlikelidir — simülasyonda engellendi`, err: true };
        const n = s.fs[t];
        if (!n) return { out: `rm: '${a}' silinemiyor: Böyle bir dosya ya da dizin yok`, err: true };
        if (n.t === "d" && !rec) return { out: `rm: '${a}' silinemiyor: Bir dizin`, err: true };
        for (const k of Object.keys(s.fs)) if (k === t || k.startsWith(t + "/")) delete s.fs[k];
      }
      return { out: "" };
    }
    case "grep": {
      const pat = pos[0];
      if (pat === undefined) return { out: "kullanım: grep [-i] desen [dosya]", err: true };
      let text = stdin;
      if (pos[1]) {
        const n = s.fs[resolve(s, pos[1])];
        if (!n || n.t !== "f") return { out: `grep: ${pos[1]}: Böyle bir dosya ya da dizin yok`, err: true };
        text = n.c;
      }
      if (text === null) return { out: "" };
      const ic = flags.includes("-i");
      const hit = text.split("\n").filter((l) => (ic ? l.toLowerCase().includes(pat.toLowerCase()) : l.includes(pat)));
      return { out: hit.join("\n") };
    }
    case "wc": {
      const n = pos[0] ? s.fs[resolve(s, pos[0])] : null;
      const text = n ? n.c : stdin ?? "";
      const lines = text === "" ? 0 : text.split("\n").length;
      if (flags.includes("-l")) return { out: String(lines) };
      return { out: `${lines} ${text.split(/\s+/).filter(Boolean).length} ${text.length}` };
    }
    case "head":
    case "tail": {
      const ni = args.indexOf("-n");
      const k = ni >= 0 ? parseInt(args[ni + 1], 10) || 10 : 10;
      const file = pos.find((a) => a !== args[ni + 1] || ni < 0);
      const n = file ? s.fs[resolve(s, file)] : null;
      const text = n ? n.c : stdin ?? "";
      const l = text.split("\n");
      return { out: (cmd === "head" ? l.slice(0, k) : l.slice(-k)).join("\n") };
    }
    case "export": {
      for (const a of pos) {
        const i = a.indexOf("=");
        if (i > 0) s.env[a.slice(0, i)] = a.slice(i + 1);
      }
      return { out: "" };
    }
    case "bash":
    case "./selam.sh":
    case "./log_say.sh":
    case "./yedek.sh":
    case "sh": {
      const name = cmd.startsWith("./") ? cmd.slice(2) : pos[0];
      if (!name) return { out: "kullanım: bash betik.sh", err: true };
      const n = s.fs[resolve(s, name)];
      if (!n) return { out: `bash: ${name}: Böyle bir dosya ya da dizin yok`, err: true };
      const base = name.split("/").pop();
      if (base === "selam.sh") return { out: `Merhaba ogrenci\nBugün: ${fmtDate("%F")}` };
      if (base === "log_say.sh") return { out: "Toplam başarısız: 3" };
      if (base === "yedek.sh") {
        s.fs[`${HOME}/yedek`] = { t: "d", c: "" };
        return { out: "Yedekleme tamam (simülasyon: yalnızca sanal dosya sistemi)" };
      }
      return { out: `Bu betik simülasyonda çalıştırılamaz (yalnızca selam.sh, log_say.sh ve yedek.sh örnekleri desteklenir).\nİçeriği görmek için: cat ${name}` };
    }
    case "sudo":
      return { out: "Bu sanal terminalde sudo desteklenmez; yönetici yetkisi gerekmez.", err: true };
    case "history":
      return { out: "" };
    case "help":
      return {
        out: "Desteklenen komutlar:\n  pwd, ls [-l -a], cd, echo, whoami, date, mkdir [-p], touch, cat, rm [-r],\n  grep [-i], wc [-l], head/tail [-n], export, hostname, uname, id, clear,\n  bash <betik>, history\nÖzellikler: değişkenler (isim=Ali; echo $isim), yönlendirme (echo yazi > dosya, >>),\n  boru (cat auth.log | grep Failed | wc -l), $? ve $(date +%F)",
      };
    default:
      return { out: `bash: ${cmd}: komut bulunamadı`, err: true };
  }
}

function runLine(s: Sess, line: string): R {
  const trimmed = line.trim();
  if (!trimmed) return { out: "" };
  // yönlendirme (yalnızca sanal dosya sistemine)
  const redir = trimmed.match(/^(.*?)\s*(>>|>)\s*(\S+)\s*$/);
  const body = redir ? redir[1] : trimmed;
  const stages = body.split("|");
  let data: string | null = null;
  let res: R = { out: "" };
  for (const st of stages) {
    res = runSingle(s, st, data);
    if (res.err) break;
    data = res.out;
  }
  if (redir && !res.err) {
    const t = resolve(s, redir[3]);
    if (!s.fs[norm(t + "/..")]) res = { out: `bash: ${redir[3]}: Böyle bir dosya ya da dizin yok`, err: true };
    else if (s.fs[t]?.t === "d") res = { out: `bash: ${redir[3]}: Bir dizin`, err: true };
    else {
      const prev = redir[2] === ">>" && s.fs[t] ? s.fs[t].c + "\n" : "";
      s.fs[t] = { t: "f", c: prev + res.out };
      res = { out: "" };
    }
  }
  s.last = res.err ? 1 : 0;
  return res;
}

const SCRIPTS: { id: string; title: string; code: string; params: { key: string; label: string; def: string; kind?: "select"; options?: string[] }[]; build: (p: Record<string, string>) => Step[] }[] = [
  {
    id: "selam",
    title: "selam.sh",
    code: `#!/bin/bash
read -p "Adınız: " isim
echo "Merhaba $isim"
echo "Bugün: $(date +%F)"`,
    params: [{ key: "isim", label: "read ile girilecek ad", def: "Ayşe" }],
    build: (p) => [
      { line: 0, vars: {}, note: "**Shebang:** işletim sistemine bu betiğin `/bin/bash` ile çalıştırılacağını söyler. Bash için bu satır yorum gibi görünse de özel anlam taşır." },
      { line: 1, vars: { isim: p.isim }, note: "`read -p` ekrana istem yazar, kullanıcının cevabını `isim` değişkenine atar. (Değişken atamasında `=` çevresinde boşluk olmaz.)" },
      { line: 2, vars: { isim: p.isim }, out: `Merhaba ${p.isim}`, note: "`echo` metni yazdırır; `$isim` değişkenin değeriyle değiştirilir. Çift tırnak içinde değişkenler genişletilir." },
      { line: 3, vars: { isim: p.isim }, out: `Bugün: ${fmtDate("%F")}`, note: "`$(date +%F)` komut yerine koymadır: önce `date` çalışır, çıktısı metnin içine yerleştirilir." },
    ],
  },
  {
    id: "log",
    title: "log_say.sh",
    code: `#!/bin/bash
rapor() {
    echo "== $1 =="
}

rapor "Başarısız giriş özeti"
sayac=0
for satir in FAILED OK FAILED FAILED; do
    if [ "$satir" = "FAILED" ]; then
        sayac=$((sayac + 1))
    fi
done
echo "Toplam başarısız: $sayac"`,
    params: [],
    build: () => {
      const st: Step[] = [
        { line: 0, vars: {}, note: "Shebang satırı." },
        { line: 1, vars: {}, note: "Fonksiyon **tanımlanır**; çağrılana kadar çalışmaz. `$1` fonksiyonun ilk argümanıdır." },
        { line: 5, vars: {}, out: "== Başarısız giriş özeti ==", note: "Fonksiyon çağrılır: `$1` = \"Başarısız giriş özeti\". İçindeki `echo` çalışır." },
        { line: 6, vars: { sayac: "0" }, note: "Sayaç değişkeni 0 ile başlatılır." },
      ];
      let sayac = 0;
      for (const s of ["FAILED", "OK", "FAILED", "FAILED"]) {
        st.push({ line: 7, vars: { satir: s, sayac: String(sayac) }, note: `Döngü: satir = ${s}.` });
        const hit = s === "FAILED";
        st.push({ line: 8, vars: { satir: s, sayac: String(sayac) }, note: `\`[ "${s}" = "FAILED" ]\` → ${hit ? "doğru (çıkış kodu 0)" : "yanlış (çıkış kodu 1)"}.` });
        if (hit) {
          sayac++;
          st.push({ line: 9, vars: { satir: s, sayac: String(sayac) }, note: `\`$((sayac + 1))\` aritmetik işlem yapar → sayac = ${sayac}.` });
        }
      }
      st.push({ line: 12, vars: { sayac: String(sayac) }, out: `Toplam başarısız: ${sayac}`, note: "Döngü bitti; toplam yazdırılır." });
      return st;
    },
  },
  {
    id: "yedek",
    title: "yedek.sh",
    code: `#!/bin/bash
kaynak="$HOME/belgeler"
hedef="$HOME/yedek"
if [ ! -d "$kaynak" ]; then
    echo "Kaynak klasör yok"
    exit 1
fi
mkdir -p "$hedef"
cp -r "$kaynak" "$hedef"
echo "Yedekleme tamam"`,
    params: [{ key: "var", label: "Kaynak klasör var mı?", def: "evet", kind: "select", options: ["evet", "hayır"] }],
    build: (p) => {
      const v = { kaynak: "/home/ogrenci/belgeler", hedef: "/home/ogrenci/yedek" };
      const st: Step[] = [
        { line: 0, vars: {}, note: "Shebang." },
        { line: 1, vars: { kaynak: v.kaynak }, note: "Kaynak klasör yolu bir değişkende tutulur; `$HOME` kullanıcının ana dizinidir." },
        { line: 2, vars: v, note: "Hedef klasör yolu tanımlanır." },
        { line: 3, vars: v, note: `\`[ ! -d "$kaynak" ]\` → klasör **${p.var === "evet" ? "var" : "yok"}** olduğundan koşul ${p.var === "evet" ? "yanlış" : "doğru"}.` },
      ];
      if (p.var !== "evet") {
        st.push({ line: 4, vars: v, out: "Kaynak klasör yok", note: "Hata mesajı yazılır." });
        st.push({ line: 5, vars: v, note: "`exit 1` betiği hata koduyla sonlandırır. Sıfırdan farklı çıkış kodu **başarısızlık** demektir." });
        return st;
      }
      st.push({ line: 7, vars: v, note: "`mkdir -p` hedef klasörü oluşturur; zaten varsa hata vermez. (Simülasyon)" });
      st.push({ line: 8, vars: v, note: "`cp -r` klasörü içindekilerle birlikte kopyalar. (Simülasyon — gerçek dosya kopyalanmaz)" });
      st.push({ line: 9, vars: v, out: "Yedekleme tamam", note: "Başarı mesajı yazılır." });
      return st;
    },
  },
];

type Line = { k: "cmd" | "out" | "err"; text: string; cwd?: string };

export default function Lab11({ onUse }: { onUse: () => void }) {
  const sess = useRef<Sess>(initSess());
  const [lines, setLines] = useState<Line[]>([{ k: "out", text: "AG CYBER LAB sanal Bash terminali — yalnızca tarayıcı içinde çalışır. Komutlar için: help" }]);
  const [input, setInput] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const [cwd, setCwd] = useState(HOME);
  const endRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const [sid, setSid] = useState(SCRIPTS[0].id);
  const script = SCRIPTS.find((x) => x.id === sid) ?? SCRIPTS[0];
  const [sp, setSp] = useState<Record<string, string>>({ isim: "Ayşe", var: "evet" });
  const steps = useMemo(() => script.build(sp), [script, sp]);

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [lines]);

  const prompt = (c: string) => `ogrenci@aglab:${c === HOME ? "~" : c.startsWith(HOME + "/") ? "~" + c.slice(HOME.length) : c}$`;

  const exec = (cmd: string) => {
    const c = cmd.trim();
    const pc = sess.current.cwd;
    if (c === "clear") {
      setLines([]);
      setInput("");
      return;
    }
    const next: Line[] = [{ k: "cmd", text: c, cwd: pc }];
    if (c === "history") {
      next.push({ k: "out", text: [...hist, c].map((h, i) => `${String(i + 1).padStart(4)}  ${h}`).join("\n") });
    } else if (c) {
      const r = runLine(sess.current, c);
      if (r.out) next.push({ k: r.err ? "err" : "out", text: r.out });
    }
    setLines((l) => [...l, ...next]);
    setCwd(sess.current.cwd);
    if (c) setHist((h) => [...h, c]);
    setHi(-1);
    setInput("");
    if (c) onUse();
  };

  const quick = ["pwd", "ls", "ls -la", "whoami", "date", "echo \"Merhaba AG\"", "mkdir rapor", "cd rapor", "touch notlar2.txt", "cd ..", "cat notlar.txt", "cat auth.log | grep Failed | wc -l", "bash selam.sh", "help"];

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-ok/30 bg-[#e3f3ec] px-3 py-2 text-xs leading-5 text-[#1b5f42]">
        🔒 Bu terminal bir <strong>simülasyondur</strong>: komutlar gerçek işletim sisteminde çalıştırılmaz, bilgisayarınızda
        dosya oluşturulmaz veya değiştirilmez. Tüm dosyalar tarayıcı belleğindeki sanal bir dizin ağacındadır.
      </div>

      <div className="flex flex-wrap gap-1.5">
        {quick.map((q) => (
          <button key={q} type="button" onClick={() => exec(q)} className="rounded-full border border-line bg-white px-2.5 py-1 font-mono text-[11px] hover:bg-soft">
            {q}
          </button>
        ))}
      </div>

      <Terminal title="bash — ogrenci@aglab">
        <div ref={boxRef} onClick={() => document.getElementById("bash-input")?.focus()} className="scroll-thin h-80 overflow-auto p-4 font-mono text-[13px] leading-6 text-slate-100">
          {lines.map((l, i) =>
            l.k === "cmd" ? (
              <div key={i}>
                <span className="text-[#7fd1b9]">{prompt(l.cwd ?? HOME)}</span> {l.text}
              </div>
            ) : (
              <div key={i} className={`whitespace-pre-wrap ${l.k === "err" ? "text-[#f2a1a1]" : ""}`}>
                {l.text}
              </div>
            ),
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              exec(input);
            }}
            className="flex gap-2"
          >
            <span className="shrink-0 text-[#7fd1b9]">{prompt(cwd)}</span>
            <input
              id="bash-input"
              aria-label="Bash komutu"
              autoComplete="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent text-slate-100 outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" && hist.length) {
                  e.preventDefault();
                  const n = hi < 0 ? hist.length - 1 : Math.max(0, hi - 1);
                  setHi(n);
                  setInput(hist[n]);
                } else if (e.key === "ArrowDown" && hi >= 0) {
                  e.preventDefault();
                  const n = hi + 1;
                  if (n >= hist.length) {
                    setHi(-1);
                    setInput("");
                  } else {
                    setHi(n);
                    setInput(hist[n]);
                  }
                }
              }}
            />
          </form>
          <div ref={endRef} />
        </div>
      </Terminal>
      <p className="text-xs text-muted">İpucu: ↑/↓ tuşlarıyla komut geçmişinde gezinin. Örnek: <code>echo &quot;merhaba&quot; &gt; dosya.txt</code> sonra <code>cat dosya.txt</code>.</p>

      <div className="space-y-3 rounded-xl border border-line bg-white p-4">
        <h3 className="font-semibold">Bash betik çözümleyici (adım adım)</h3>
        <div className="flex flex-wrap gap-2">
          {SCRIPTS.map((x) => (
            <Btn key={x.id} variant={x.id === sid ? "primary" : "secondary"} onClick={() => setSid(x.id)}>{x.title}</Btn>
          ))}
        </div>
        {script.params.map((p) => (
          <div key={p.key} className="max-w-xs">
            <Label>{p.label}</Label>
            {p.kind === "select" ? (
              <select className={inputCls} value={sp[p.key]} onChange={(e) => setSp({ ...sp, [p.key]: e.target.value })}>
                {p.options?.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input className={inputCls} value={sp[p.key] ?? ""} onChange={(e) => setSp({ ...sp, [p.key]: e.target.value })} />
            )}
          </div>
        ))}
        <TraceViewer key={sid + JSON.stringify(sp)} code={script.code} steps={steps} onDone={onUse} title={script.title} />
      </div>
      <LabNote>Betikler gerçekten çalıştırılmaz; her betiğin çalışma adımları önceden tanımlanmış bir simülasyonla gösterilir.</LabNote>
    </div>
  );
}
