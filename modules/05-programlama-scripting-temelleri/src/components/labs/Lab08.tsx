"use client";

import { useState } from "react";
import { Badge, Btn, inputCls, Label, LabNote } from "../ui";

const BASE = "/home/ogrenci/belgeler";

const INITIAL: Record<string, string> = {
  [`${BASE}/notlar.txt`]: "Ders notlarım\nPython öğreniyorum\nÇalışma saati: 19:00",
  [`${BASE}/loglar.csv`]: "zaman,kullanici,durum\n09:01,ayse,BASARILI\n09:03,mehmet,BASARISIZ\n09:04,mehmet,BASARISIZ",
  [`${BASE}/ayarlar.json`]: '{\n  "tema": "acik",\n  "dil": "tr"\n}',
  "/etc/gizli.conf": "[SANAL ÖRNEK VERİ — gerçek dosya değildir]\nveritabani_parola=ornek-parola-123\napi_anahtari=ORNEK-ANAHTAR-000",
};

function normalize(p: string): string {
  const parts: string[] = [];
  for (const seg of p.split("/")) {
    if (!seg || seg === ".") continue;
    if (seg === "..") parts.pop();
    else parts.push(seg);
  }
  return "/" + parts.join("/");
}

function join(base: string, input: string): string {
  return input.startsWith("/") ? input : base + "/" + input;
}

export default function Lab08({ onUse }: { onUse: () => void }) {
  const [fs, setFs] = useState<Record<string, string>>(INITIAL);
  const [sel, setSel] = useState<string>(`${BASE}/notlar.txt`);
  const [buf, setBuf] = useState<string>(INITIAL[`${BASE}/notlar.txt`]);
  const [appendText, setAppendText] = useState("Yeni satır");
  const [newName, setNewName] = useState("rapor.txt");
  const [log, setLog] = useState<{ code: string; res: string; err?: boolean } | null>(null);

  const [tInput, setTInput] = useState("rapor.txt");
  const [safe, setSafe] = useState(false);
  const [tRes, setTRes] = useState<null | { joined: string; resolved: string; inside: boolean; allowed: boolean; content?: string; msg: string }>(null);

  const open = (path: string) => {
    setSel(path);
    setBuf(fs[path] ?? "");
    setLog({ code: `with open("${path}", "r", encoding="utf-8") as f:\n    icerik = f.read()`, res: `${(fs[path] ?? "").length} karakter okundu` });
    onUse();
  };

  const editable = (path: string) => path.startsWith(BASE + "/");

  const save = () => {
    if (!sel || !editable(sel)) return setLog({ code: `open("${sel}", "w")`, res: "PermissionError: bu sanal dosya salt okunur", err: true });
    setFs({ ...fs, [sel]: buf });
    setLog({ code: `with open("${sel}", "w", encoding="utf-8") as f:\n    f.write(icerik)`, res: "Dosya kaydedildi (mod 'w': önceki içerik üzerine yazıldı)" });
    onUse();
  };

  const append = () => {
    if (!sel || !editable(sel)) return setLog({ code: `open("${sel}", "a")`, res: "PermissionError: bu sanal dosya salt okunur", err: true });
    const nv = (fs[sel] ?? "") + "\n" + appendText;
    setFs({ ...fs, [sel]: nv });
    setBuf(nv);
    setLog({ code: `with open("${sel}", "a", encoding="utf-8") as f:\n    f.write("\\n${appendText}")`, res: "Satır dosyanın sonuna eklendi (mod 'a': mevcut içerik korundu)" });
    onUse();
  };

  const create = () => {
    const name = newName.trim();
    if (!name) return setLog({ code: "open('', 'x')", res: "FileNotFoundError: dosya adı boş", err: true });
    const full = normalize(join(BASE, name));
    if (!editable(full)) return setLog({ code: `open("${name}", "x")`, res: "PermissionError: yalnızca belgeler klasöründe dosya oluşturabilirsiniz (sanal kısıtlama)", err: true });
    if (fs[full] !== undefined) return setLog({ code: `open("${full}", "x")`, res: `FileExistsError: '${full}' zaten var (mod 'x' üzerine yazmaz)`, err: true });
    setFs({ ...fs, [full]: "" });
    setSel(full);
    setBuf("");
    setLog({ code: `open("${full}", "x", encoding="utf-8")`, res: "Yeni boş dosya oluşturuldu" });
    onUse();
  };

  const remove = () => {
    if (!editable(sel)) return setLog({ code: `os.remove("${sel}")`, res: "PermissionError: bu sanal dosya silinemez", err: true });
    const n = { ...fs };
    delete n[sel];
    setFs(n);
    const first = Object.keys(n)[0];
    setSel(first ?? "");
    setBuf(first ? n[first] : "");
    setLog({ code: `os.remove("${sel}")`, res: "Dosya silindi (yalnızca sanal dosya sistemi)" });
    onUse();
  };

  const attack = () => {
    const joined = join(BASE, tInput);
    const resolved = normalize(joined);
    const inside = resolved.startsWith(BASE + "/");
    const allowed = safe ? inside : true;
    let content: string | undefined;
    let msg: string;
    if (!allowed) msg = "PermissionError: İzin verilmeyen yol — istek reddedildi.";
    else if (fs[resolved] !== undefined) {
      content = fs[resolved];
      msg = inside ? "Dosya izinli klasörün içinde, başarıyla okundu." : "⚠ ZAFİYET: Dosya izinli klasörün DIŞINDA olduğu hâlde okundu!";
    } else msg = "FileNotFoundError: sanal sistemde böyle bir dosya yok.";
    setTRes({ joined, resolved, inside, allowed, content, msg });
    onUse();
  };

  const paths = Object.keys(fs).sort();
  const presets = ["rapor.txt", "notlar.txt", "../../../etc/gizli.conf", "/etc/gizli.conf", "../belgeler/notlar.txt"];

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-ok/30 bg-[#e3f3ec] px-3 py-2 text-xs leading-5 text-[#1b5f42]">
        🔒 Güvenlik: Bu dosya sistemi tamamen tarayıcı belleğinde çalışan <strong>sanal</strong> bir simülasyondur.
        Gerçek bilgisayarınızın dosyalarına erişilmez, hiçbir şey diske yazılmaz. Sayfa yenilenince sıfırlanır.
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <div className="rounded-xl border border-line bg-white">
          <div className="border-b border-line bg-slate-50 px-3 py-2 text-xs font-medium text-muted">Sanal dosya sistemi</div>
          <ul className="max-h-72 overflow-auto p-2 text-sm scroll-thin">
            {paths.map((p) => (
              <li key={p}>
                <button
                  type="button"
                  onClick={() => open(p)}
                  className={`w-full break-all rounded-md px-2 py-1.5 text-left font-mono text-xs transition ${sel === p ? "bg-soft text-brand" : "hover:bg-slate-50"}`}
                >
                  📄 {p.replace(BASE + "/", "belgeler/")}
                  {!editable(p) && <span className="ml-1 text-[10px] text-muted">(salt okunur)</span>}
                </button>
              </li>
            ))}
          </ul>
          <div className="space-y-2 border-t border-line p-3">
            <Label>Yeni dosya (mod x)</Label>
            <input className={inputCls} value={newName} onChange={(e) => setNewName(e.target.value)} />
            <Btn className="w-full" variant="secondary" onClick={create}>Dosya oluştur</Btn>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{sel ? sel : "Dosya seçilmedi"}</Badge>
            {sel.endsWith(".csv") && <Badge tone="muted">CSV</Badge>}
            {sel.endsWith(".json") && <Badge tone="muted">JSON</Badge>}
            {sel.endsWith(".txt") && <Badge tone="muted">TXT</Badge>}
          </div>
          <textarea
            className={`${inputCls} h-44 font-mono text-[13px]`}
            value={buf}
            disabled={!sel}
            onChange={(e) => setBuf(e.target.value)}
            spellCheck={false}
          />
          <div className="flex flex-wrap items-end gap-2">
            <Btn onClick={save} disabled={!sel}>Kaydet (w)</Btn>
            <div className="min-w-[160px] flex-1">
              <Label>Eklenecek satır (a)</Label>
              <input className={inputCls} value={appendText} onChange={(e) => setAppendText(e.target.value)} />
            </div>
            <Btn variant="secondary" onClick={append} disabled={!sel}>Sona ekle</Btn>
            <Btn variant="danger" onClick={remove} disabled={!sel}>Sil</Btn>
          </div>
          {log && (
            <div className="rounded-lg bg-[#172b3a] p-3 font-mono text-xs text-slate-100">
              <p className="whitespace-pre-wrap text-slate-400">{log.code}</p>
              <p className={`mt-1 ${log.err ? "text-[#f2a1a1]" : "text-[#9be0b8]"}`}>{log.res}</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border-2 border-warn/40 bg-white p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">Path Traversal senaryosu (sanal)</h3>
          <Badge tone="warn">Eğitim amaçlı simülasyon</Badge>
        </div>
        <p className="text-sm leading-6 text-[#2b4152]">
          Bir uygulama, kullanıcının yazdığı dosya adını <code>{BASE}</code> klasörüne ekleyip okuyor. Dosya adı olarak{" "}
          <code>../</code> dizileri girilirse ne olur? Güvensiz ve güvenli uygulamayı karşılaştırın.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button key={p} type="button" onClick={() => setTInput(p)} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] hover:bg-soft">{p}</button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
          <div><Label>İstenen dosya adı (kullanıcı girdisi)</Label><input className={inputCls} value={tInput} onChange={(e) => setTInput(e.target.value)} /></div>
          <div className="flex rounded-lg border border-line p-0.5 text-sm">
            <button type="button" onClick={() => setSafe(false)} className={`rounded-md px-3 py-1.5 ${!safe ? "bg-err text-white" : ""}`}>Güvensiz</button>
            <button type="button" onClick={() => setSafe(true)} className={`rounded-md px-3 py-1.5 ${safe ? "bg-ok text-white" : ""}`}>Güvenli</button>
          </div>
          <Btn onClick={attack}>İsteği gönder</Btn>
        </div>
        <pre className="scroll-thin overflow-x-auto rounded-lg bg-[#172b3a] p-3 font-mono text-xs leading-5 text-slate-100">{safe
          ? `yol = os.path.realpath(os.path.join(TEMEL, ad))\nif not yol.startswith(TEMEL + "/"):\n    raise PermissionError("İzin verilmeyen yol")`
          : `yol = os.path.join(TEMEL, ad)     # doğrulama yok!\nicerik = open(yol).read()`}</pre>
        {tRes && (
          <div className="space-y-2 text-sm">
            <ol className="list-decimal space-y-1 pl-5 font-mono text-xs">
              <li>Birleştirilen yol: <span className="text-brand">{tRes.joined}</span></li>
              <li>Normalize edilen (çözümlenen) yol: <span className="text-brand">{tRes.resolved}</span></li>
              <li>İzinli klasörün içinde mi? <span className={tRes.inside ? "text-ok" : "text-err"}>{tRes.inside ? "Evet" : "HAYIR (dışarı çıkıldı)"}</span></li>
              <li>Mod: {safe ? "güvenli (kontrol var)" : "güvensiz (kontrol yok)"}</li>
            </ol>
            <div className={`rounded-lg border p-3 ${tRes.allowed && !tRes.inside ? "border-err/40 bg-[#f8e5e5]" : tRes.allowed ? "border-ok/40 bg-[#e3f3ec]" : "border-warn/50 bg-[#faf0dc]"}`}>
              <p className="font-semibold">{tRes.msg}</p>
              {tRes.content !== undefined && <pre className="mt-2 whitespace-pre-wrap font-mono text-xs">{tRes.content}</pre>}
            </div>
          </div>
        )}
      </div>
      <LabNote>Denemeler: <code>../../../etc/gizli.conf</code> girdisini önce güvensiz, sonra güvenli modda deneyin. <code>/etc/gizli.conf</code> mutlak yolunun neden de işe yaradığını inceleyin.</LabNote>
    </div>
  );
}
