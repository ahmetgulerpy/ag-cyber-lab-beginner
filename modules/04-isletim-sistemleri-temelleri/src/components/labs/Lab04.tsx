"use client";
import { useEffect, useState } from "react";
import { Callout } from "@/components/ui";

type D = { key: string; name: string; base: string; pm: string; pmEx: string; de: string; level: number; rel: string; usage: string; feats: string[] };
const DISTROS: D[] = [
  { key: "ubuntu", name: "Ubuntu", base: "Debian", pm: "apt (.deb) + snap", pmEx: "sudo apt install nano", de: "GNOME", level: 2, rel: "6 ayda bir sürüm; 2 yılda bir LTS (5 yıl destek)", usage: "Genel masaüstü, öğrenme, bulut ve sunucu", feats: ["Çok geniş topluluk ve doküman", "İyi donanım uyumu", "LTS ile uzun güvenlik desteği"] },
  { key: "debian", name: "Debian", base: "Bağımsız (birçok dağıtımın atası)", pm: "apt (.deb)", pmEx: "sudo apt install nano", de: "GNOME (XFCE/KDE seçilebilir)", level: 3, rel: "Stable ~2 yılda bir; çok kararlı, uzun destek", usage: "Kararlı sunucular, uzun ömürlü sistemler", feats: ["Çok yüksek kararlılık", "Tamamen topluluk tarafından yönetilir", "Kali ve Ubuntu'nun temeli"] },
  { key: "fedora", name: "Fedora", base: "Red Hat ailesi (RPM)", pm: "dnf (.rpm)", pmEx: "sudo dnf install nano", de: "GNOME", level: 3, rel: "~6 ayda bir; güncel", usage: "Geliştirici masaüstü, yeni teknolojiler", feats: ["Yeni teknolojileri erken benimser (Wayland)", "SELinux varsayılan olarak açık", "Red Hat desteği"] },
  { key: "mint", name: "Linux Mint", base: "Ubuntu / Debian", pm: "apt (.deb)", pmEx: "sudo apt install nano", de: "Cinnamon (XFCE/MATE seçilebilir)", level: 1, rel: "Ubuntu LTS'ye dayalı; sabit", usage: "Yeni başlayanlar, Windows'tan geçenler, eski bilgisayarlar", feats: ["Windows'a benzer arayüz", "Kur ve kullan: kodekler hazır", "Düşük sistem gereksinimi (XFCE)"] },
  { key: "arch", name: "Arch Linux", base: "Bağımsız", pm: "pacman (+AUR)", pmEx: "sudo pacman -S nano", de: "Yok (kullanıcı seçer: KDE, GNOME, …)", level: 5, rel: "Rolling release (sürekli güncel)", usage: "Öğrenme, tam kontrol, güncel yazılım isteyen deneyimli kullanıcılar", feats: ["Minimal kurulum, her şeyi sen seçersin", "Arch Wiki: mükemmel dokümantasyon", "AUR: devasa topluluk paket deposu"] },
  { key: "opensuse", name: "openSUSE", base: "SUSE ailesi (RPM)", pm: "zypper (.rpm)", pmEx: "sudo zypper install nano", de: "KDE Plasma / GNOME", level: 3, rel: "Leap (sabit) ve Tumbleweed (rolling)", usage: "Kurumsal masaüstü, sistem yönetimi", feats: ["YaST/Agama yönetim araçları", "Btrfs ile sistem anlık görüntüleri (snapshot)", "Sağlam, kurumsal altyapı"] },
];

const SCEN: { t: string; best: string; ok: string[]; why: string }[] = [
  { t: "Windows'tan geçen bir öğrenci, eski dizüstü bilgisayarına Linux kuracak. Tanıdık bir arayüz ve sorunsuz kurulum istiyor.", best: "mint", ok: ["ubuntu"], why: "Linux Mint'in Cinnamon masaüstü Windows'a benzer, kodekler hazır gelir ve hafiftir." },
  { t: "Yıllarca dokunulmadan çalışacak, çok kararlı bir web sunucusu kurulacak.", best: "debian", ok: ["ubuntu", "opensuse"], why: "Debian Stable, kararlılığı ve uzun ömrüyle sunucularda tercih edilir; Ubuntu LTS de iyi bir alternatiftir." },
  { t: "Bir yazılım geliştirici, en yeni derleyici ve araçları kullanmak ve Red Hat ekosistemini öğrenmek istiyor.", best: "fedora", ok: [], why: "Fedora, yeni teknolojileri hızlı getirir ve RPM/dnf (Red Hat ailesi) ile gelir." },
  { t: "Linux'un iç yapısını öğrenmek isteyen biri, sistemini parça parça kendisi inşa edip Wiki ile ilerlemek istiyor.", best: "arch", ok: [], why: "Arch minimal kurulur; her bileşeni kullanıcı seçer, Arch Wiki ise en iyi öğrenme kaynaklarından biridir." },
  { t: "Geniş topluluk desteği, kolay kurulum ve 5 yıl güvenlik güncellemesi sunan genel amaçlı bir masaüstü isteniyor.", best: "ubuntu", ok: ["mint", "debian"], why: "Ubuntu LTS, geniş topluluğu ve 5 yıllık desteğiyle genel amaçlı kullanım için yaygın bir tercihtir." },
  { t: "Sistem anlık görüntüleri (snapshot) ile hatalı güncellemeyi geri alabilen, güçlü yönetim araçlı kurumsal tarzı bir masaüstü isteniyor.", best: "opensuse", ok: ["fedora"], why: "openSUSE, Btrfs snapshot ve YaST/Agama yönetim araçlarıyla bu ihtiyaca çok uygundur." },
  { t: "Sürüm yükseltmesiyle uğraşmak istemeyen, her zaman en yeni yazılımı alan rolling release bir sistem arayan deneyimli kullanıcı.", best: "arch", ok: ["opensuse"], why: "Arch (ve openSUSE Tumbleweed) rolling release modeliyle sürekli günceldir; Arch daha fazla uzmanlık ister." },
];

export default function Lab04({ done }: { done: (id: string) => void }) {
  const [sel, setSel] = useState<string[]>([]);
  const [ans, setAns] = useState<Record<number, string>>({});
  const [sIdx, setSIdx] = useState(0);
  const toggle = (k: string) => setSel((s) => (s.includes(k) ? s.filter((x) => x !== k) : s.length >= 3 ? [...s.slice(1), k] : [...s, k]));
  const picked = sel.map((k) => DISTROS.find((d) => d.key === k)!);
  const answered = Object.keys(ans).length;
  const correct = Object.entries(ans).filter(([i, k]) => SCEN[+i].best === k).length;
  useEffect(() => { if (sel.length >= 2) done("compare"); }, [sel]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (answered >= 3) done("s3"); if (correct >= 5) done("s5"); }, [answered, correct]); // eslint-disable-line react-hooks/exhaustive-deps
  const sc = SCEN[sIdx];
  const chosen = ans[sIdx];
  const dots = (n: number) => "●".repeat(n) + "○".repeat(5 - n);

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-semibold">1) Karşılaştırmak için en fazla 3 dağıtım seç:</p>
        <div className="flex flex-wrap gap-2">{DISTROS.map((d) => <button key={d.key} className={`btn btn-sm ${sel.includes(d.key) ? "btn-on" : ""}`} onClick={() => toggle(d.key)}>{sel.includes(d.key) ? "✓ " : ""}{d.name}</button>)}</div>
      </div>
      {picked.length === 0 ? <p className="rounded-xl bg-soft p-3 text-sm text-muted">Dağıtım seçtikçe karşılaştırma tablosu burada oluşur. En az 2 dağıtım seç.</p> : (
        <div className="scroll-x rounded-xl border border-line">
          <table className="tbl min-w-[520px]"><thead><tr><th></th>{picked.map((d) => <th key={d.key} className="!text-brand">{d.name}</th>)}</tr></thead><tbody>
            <tr><td className="font-semibold">Tabanı</td>{picked.map((d) => <td key={d.key}>{d.base}</td>)}</tr>
            <tr><td className="font-semibold">Kullanım amacı</td>{picked.map((d) => <td key={d.key}>{d.usage}</td>)}</tr>
            <tr><td className="font-semibold">Paket yönetimi</td>{picked.map((d) => <td key={d.key}>{d.pm}<br /><code className="mono text-xs text-muted">{d.pmEx}</code></td>)}</tr>
            <tr><td className="font-semibold">Masaüstü ortamı</td>{picked.map((d) => <td key={d.key}>{d.de}</td>)}</tr>
            <tr><td className="font-semibold">Zorluk seviyesi</td>{picked.map((d) => <td key={d.key}><span className="text-brand">{dots(d.level)}</span> <span className="text-xs text-muted">{["", "Çok kolay", "Kolay", "Orta", "Zor", "Çok zor"][d.level]}</span></td>)}</tr>
            <tr><td className="font-semibold">Sürüm modeli</td>{picked.map((d) => <td key={d.key}>{d.rel}</td>)}</tr>
            <tr><td className="font-semibold">Öne çıkanlar</td>{picked.map((d) => <td key={d.key}><ul className="list-disc pl-4">{d.feats.map((f) => <li key={f}>{f}</li>)}</ul></td>)}</tr>
          </tbody></table>
        </div>
      )}

      <div className="rounded-xl border border-line p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold">2) Senaryoya uygun dağıtımı seç ({sIdx + 1}/{SCEN.length})</p>
          <span className="chip">Doğru: {correct} • Cevaplanan: {answered}</span>
        </div>
        <p className="mt-2 rounded-lg bg-soft p-3 text-sm">{sc.t}</p>
        <div className="mt-3 flex flex-wrap gap-2">{DISTROS.map((d) => <button key={d.key} className={`btn btn-sm ${chosen === d.key ? "btn-on" : ""}`} onClick={() => setAns((a) => ({ ...a, [sIdx]: d.key }))}>{d.name}</button>)}</div>
        {chosen && (chosen === sc.best ? <div className="mt-3"><Callout type="tip" title="Doğru seçim!">{sc.why}</Callout></div>
          : sc.ok.includes(chosen) ? <div className="mt-3"><Callout type="warn" title="Kabul edilebilir ama en uygunu değil">{DISTROS.find((d) => d.key === chosen)!.name} bu işi görebilir; ancak en uygun seçim <b>{DISTROS.find((d) => d.key === sc.best)!.name}</b>. {sc.why}</Callout></div>
          : <div className="mt-3"><Callout type="danger" title="Bu senaryo için uygun değil">{DISTROS.find((d) => d.key === chosen)!.name}, bu ihtiyaca en iyi yanıt vermiyor. Tekrar dene veya ipucuna bak: en uygun seçim <b>{DISTROS.find((d) => d.key === sc.best)!.name}</b>. {sc.why}</Callout></div>)}
        <div className="mt-3 flex gap-2"><button className="btn btn-sm" disabled={sIdx === 0} onClick={() => setSIdx(sIdx - 1)}>← Önceki</button><button className="btn btn-sm btn-primary" disabled={sIdx === SCEN.length - 1} onClick={() => setSIdx(sIdx + 1)}>Sonraki senaryo →</button><button className="btn btn-sm" onClick={() => { setAns({}); setSIdx(0); }}>↺ Sıfırla</button></div>
      </div>
    </div>
  );
}
