"use client";

import { useEffect, useState, type DragEvent } from "react";
import { LessonShell } from "@/components/LessonShell";
import { Callout, DataTable, InfoCards, ProgressBar, SectionTitle } from "@/components/ui";
import { markLab } from "@/lib/progress";

type OS = "kali" | "ubuntu";
type VM = { os: OS; nets: string[]; opts: string[] };

const ITEMS: { id: string; icon: string; label: string; group: string }[] = [
  { id: "vm:kali", icon: "🐉", label: "Kali Linux makinesi", group: "Makineler" },
  { id: "vm:ubuntu", icon: "🐧", label: "Ubuntu makinesi (hedef)", group: "Makineler" },
  { id: "net:nat", icon: "🔀", label: "NAT bağlantısı", group: "Sanal ağ bağlantıları" },
  { id: "net:hostonly", icon: "🏠", label: "Host-only ağı", group: "Sanal ağ bağlantıları" },
  { id: "net:internal", icon: "🔒", label: "Internal ağ (lab-net)", group: "Sanal ağ bağlantıları" },
  { id: "net:bridged", icon: "🌉", label: "Bridged bağlantı", group: "Sanal ağ bağlantıları" },
  { id: "opt:shared", icon: "📁", label: "Paylaşılan klasör", group: "Host ile paylaşım" },
  { id: "opt:clipboard", icon: "📋", label: "Pano paylaşımı", group: "Host ile paylaşım" },
  { id: "opt:usb", icon: "🔌", label: "USB passthrough", group: "Host ile paylaşım" },
];
const LABEL = Object.fromEntries(ITEMS.map((i) => [i.id.split(":")[1], i]));

const WARN: Record<string, { tone: "ok" | "warn" | "err"; text: string }> = {
  nat: { tone: "warn", text: "NAT: internet çıkışı verir, dışarıdan doğrudan erişim olmaz. Güncelleme için Kali'de kabul edilebilir; hedef makinede gereksiz internet erişimi açar." },
  hostonly: { tone: "ok", text: "Host-only: yalnızca host ve aynı ağdaki sanal makineler görüşür; fiziksel ağa ve internete kapalıdır. Laboratuvar için iyi bir seçimdir." },
  internal: { tone: "ok", text: "Internal: en yalıtılmış bağlantı. Yalnızca aynı ağ adındaki sanal makineler konuşur; host bile erişemez." },
  bridged: { tone: "err", text: "Bridged: makine fiziksel ağda görünür hale gelir. Ev/okul ağındaki diğer cihazlar ona erişebilir. Zafiyetli veya test amaçlı makineleri bu modda çalıştırma." },
  shared: { tone: "err", text: "Paylaşılan klasör: guest'teki zararlı bir şey host dosyalarını okuyabilir veya değiştirebilir. Gerekmedikçe kullanma; zorunluysa tek amaçlı, boş bir klasör ve salt okunur seç." },
  clipboard: { tone: "warn", text: "Pano paylaşımı: host ve guest arasında metin akışı sağlar; parola veya komut sızdırabilir. Laboratuvarda kapalı tut." },
  usb: { tone: "err", text: "USB passthrough: gerçek bir USB aygıtını sanal makineye verir. Aygıt üzerinden veri sızması veya zararlı yazılım bulaşması riski doğurur." },
};
const toneCls = { ok: "border-ag-ok/40 bg-[#edf8f2]", warn: "border-ag-warn/50 bg-[#fff8e8]", err: "border-ag-err/40 bg-[#fdf0f0]" };

function Topic() {
  return (
    <>
      <Callout kind="tip" title="Neden ayrı bir test ortamı?">
        Güvenlik araçlarını ve zafiyetli makineleri gerçek bilgisayarında veya ev ağında denemek istemezsin. İzole laboratuvar, bir deneme alanı kurup &quot;hata yaparsam yalnızca bu kutu etkilensin&quot; demenin yoludur.
      </Callout>
      <SectionTitle kicker="Temel kavramlar" title="İzolasyon nedir?" />
      <InfoCards
        items={[
          { icon: "🧪", title: "İzole laboratuvar", body: "Gerçek sistemden ve ağdan ayrılmış, kontrollü bir sanal test ortamı." },
          { icon: "🧱", title: "Host ve Guest izolasyonu", body: "Guest'in host dosyalarına, panosuna ve cihazlarına erişimini en aza indirmek. Her paylaşım bir köprüdür." },
          { icon: "🔀", title: "NAT, Host-only, Internal", body: "NAT internete çıkış verir. Host-only host ile ortak ağdır. Internal yalnızca sanal makineleri birbirine bağlar." },
          { icon: "📁", title: "Paylaşılan klasörler", body: "Kolaydır ama host dosyalarını riske atar. Gerekmedikçe kapalı tut." },
          { icon: "📋", title: "Clipboard paylaşımı", body: "Metin akışı sağlar; parola ve komut sızdırabilir. Laboratuvarda kapalı tutmak daha güvenlidir." },
          { icon: "🔌", title: "USB passthrough", body: "Gerçek bir USB aygıtını sanal makineye verir. Zararlı bulaşma ve veri sızması riski vardır." },
        ]}
      />
      <DataTable
        head={["Mod", "İzolasyon düzeyi", "İnternet", "Uygun kullanım"]}
        rows={[
          ["NAT", "Orta", "Evet", "Güncelleme/paket indirme"],
          ["Host-only", "Yüksek", "Hayır", "Host ile lab erişimi"],
          ["Internal", "En yüksek", "Hayır", "Kali ↔ hedef VM"],
          ["Bridged", "Düşük", "Evet", "Özel durumlar; riskli"],
        ]}
      />
      <Callout kind="warn" title="Yanlış yapılandırma riskleri">
        Zafiyetli bir makineyi Bridged modda çalıştırmak, ev ağındaki cihazlara açık kapı bırakır. Aynı şekilde, host klasörünü paylaşmak veya pano/USB açmak izolasyonu bozar.
      </Callout>
    </>
  );
}

function Lab() {
  const [vms, setVms] = useState<VM[]>([]);
  const [sel, setSel] = useState<OS | null>(null);
  const [msg, setMsg] = useState("Soldaki bileşenleri sürükleyip bırak veya tıkla.");

  const add = (id: string, target?: OS | null) => {
    const [kind, name] = id.split(":");
    if (kind === "vm") {
      if (vms.some((v) => v.os === name)) { setMsg("Bu makine zaten tuvalde."); return; }
      setVms((v) => [...v, { os: name as OS, nets: [], opts: [] }]);
      setSel(name as OS);
      setMsg(`${LABEL[name].label} eklendi.`);
      return;
    }
    const t = target ?? sel ?? vms[vms.length - 1]?.os ?? null;
    if (!t || !vms.some((v) => v.os === t)) { setMsg("Önce bir sanal makine ekle."); return; }
    setVms((all) => all.map((v) => {
      if (v.os !== t) return v;
      const key = kind === "net" ? "nets" : "opts";
      return { ...v, [key]: v[key].includes(name) ? v[key].filter((x) => x !== name) : [...v[key], name] };
    }));
    setMsg(`${LABEL[name].label} → ${t === "kali" ? "Kali" : "Ubuntu"} makinesine uygulandı (tekrar eklersen kaldırılır).`);
  };
  const dragStart = (e: DragEvent, id: string) => e.dataTransfer.setData("text/plain", id);
  const dropCanvas = (e: DragEvent) => { e.preventDefault(); const id = e.dataTransfer.getData("text/plain"); if (id.startsWith("vm:")) add(id); else setMsg("Ağ ve paylaşım bileşenlerini bir sanal makine kartının üzerine bırak."); };
  const dropVm = (e: DragEvent, os: OS) => { e.preventDefault(); e.stopPropagation(); const id = e.dataTransfer.getData("text/plain"); if (id.startsWith("vm:")) add(id); else add(id, os); };

  const kali = vms.find((v) => v.os === "kali");
  const ubu = vms.find((v) => v.os === "ubuntu");
  const all = (k: "nets" | "opts", n: string) => vms.some((v) => v[k].includes(n));
  const sharedNet = !!kali && !!ubu && ["internal", "hostonly"].some((n) => kali.nets.includes(n) && ubu.nets.includes(n));
  const checks: { label: string; ok: boolean; hint: string; core?: boolean }[] = [
    { label: "Kali ve Ubuntu makineleri tuvalde", ok: !!kali && !!ubu, hint: "İki makineyi de ekle.", core: true },
    { label: "Makineler ortak bir izole ağda (Internal veya Host-only)", ok: sharedNet, hint: "İkisine de aynı Internal veya Host-only ağını ver.", core: true },
    { label: "Hiçbir makine Bridged kullanmıyor", ok: vms.length > 0 && !all("nets", "bridged"), hint: "Bridged'i kaldır.", core: true },
    { label: "Hedef (Ubuntu) makinede NAT/internet yok", ok: !!ubu && !ubu.nets.includes("nat"), hint: "Hedef makineden NAT'ı kaldır." },
    { label: "Paylaşılan klasör yok", ok: vms.length > 0 && !all("opts", "shared"), hint: "Paylaşılan klasörü kaldır." },
    { label: "Pano paylaşımı kapalı", ok: vms.length > 0 && !all("opts", "clipboard"), hint: "Pano paylaşımını kaldır." },
    { label: "USB passthrough yok", ok: vms.length > 0 && !all("opts", "usb"), hint: "USB'yi kaldır." },
  ];
  const passed = checks.filter((c) => c.ok).length;
  const pct = Math.round((passed / checks.length) * 100);
  const coreOk = checks.filter((c) => c.core).every((c) => c.ok);
  const level = pct >= 85 && coreOk ? { t: "Yüksek izolasyon", tone: "ok" as const } : pct >= 55 ? { t: "Orta izolasyon", tone: "warn" as const } : { t: "Düşük izolasyon", tone: "err" as const };
  const passedAll = pct >= 85 && coreOk;
  useEffect(() => {
    if (passedAll) markLab("izole-laboratuvar");
  }, [passedAll]);

  const netGroups = ["nat", "hostonly", "internal", "bridged"].map((n) => ({ n, who: vms.filter((v) => v.nets.includes(n)).map((v) => (v.os === "kali" ? "Kali" : "Ubuntu")) })).filter((g) => g.who.length);
  const groups = [...new Set(ITEMS.map((i) => i.group))];

  return (
    <div className="space-y-6">
      <SectionTitle kicker="Etkileşimli uygulama" title="Sanal laboratuvar tasarım aracı">Makineleri tuvale sürükle; ağ bağlantılarını ve paylaşımları makine kartlarına bırak. Dokunmatik ekranda bileşene tıklaman yeterli: seçili makineye uygulanır.</SectionTitle>
      <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
        <div className="card space-y-3 !p-3">
          {groups.map((g) => (
            <div key={g}>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-ag-muted">{g}</p>
              <div className="space-y-1.5">
                {ITEMS.filter((i) => i.group === g).map((i) => (
                  <button key={i.id} type="button" draggable onDragStart={(e) => dragStart(e, i.id)} onClick={() => add(i.id)} className="flex w-full cursor-grab items-center gap-2 rounded-lg border border-ag-line bg-white px-2.5 py-2 text-left text-xs font-semibold hover:border-ag-accent hover:bg-ag-light active:cursor-grabbing">
                    <span aria-hidden>{i.icon}</span>
                    {i.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div onDragOver={(e) => e.preventDefault()} onDrop={dropCanvas} className="min-h-[220px] rounded-2xl border-2 border-dashed border-ag-accent/50 bg-white p-4">
            <p className="mb-3 text-xs font-semibold text-ag-muted">{msg}</p>
            {vms.length === 0 && <p className="py-10 text-center text-sm text-ag-muted">Laboratuvar tuvali boş. Önce bir makine ekle.</p>}
            <div className="grid gap-3 sm:grid-cols-2">
              {vms.map((v) => (
                <div key={v.os} role="button" tabIndex={0} onClick={() => setSel(v.os)} onKeyDown={(e) => e.key === "Enter" && setSel(v.os)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => dropVm(e, v.os)} className={`rounded-xl border-2 p-3 ${sel === v.os ? "border-ag-warn bg-[#fffaf0]" : "border-ag-line bg-ag-bg"}`}>
                  <p className="text-sm font-bold">{v.os === "kali" ? "🐉 Kali Linux" : "🐧 Ubuntu (hedef)"} {sel === v.os && <span className="chip ml-1">seçili</span>}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {[...v.nets, ...v.opts].length === 0 && <span className="text-xs text-ag-muted">Henüz bağlantı yok; bileşenleri bu karta bırak.</span>}
                    {[...v.nets, ...v.opts].map((x) => (
                      <button key={x} type="button" title="Kaldırmak için tıkla" onClick={(e) => { e.stopPropagation(); add(`${v.nets.includes(x) ? "net" : "opt"}:${x}`, v.os); }} className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${toneCls[WARN[x].tone]}`}>
                        {LABEL[x].icon} {LABEL[x].label} ✕
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {netGroups.length > 0 && (
              <div className="mt-4 space-y-1.5 border-t border-ag-line pt-3">
                <p className="text-xs font-bold text-ag-brand">Sanal ağ özeti</p>
                {netGroups.map((g) => (
                  <p key={g.n} className="text-xs text-ag-text">🔗 {LABEL[g.n].label}: {g.who.join(" ↔ ")}{g.n === "bridged" && " ↔ fiziksel ağ"}{g.n === "nat" && " → internet"}</p>
                ))}
              </div>
            )}
          </div>

          {vms.some((v) => v.nets.length + v.opts.length) && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold">Güvenlik uyarıları ve açıklamalar</h4>
              {[...new Set(vms.flatMap((v) => [...v.nets, ...v.opts]))].map((x) => (
                <div key={x} className={`rounded-lg border px-3 py-2 text-sm ${toneCls[WARN[x].tone]}`}>{WARN[x].text}</div>
              ))}
              {kali && kali.nets.includes("nat") && kali.nets.some((n) => n === "internal" || n === "hostonly") && <div className={`rounded-lg border px-3 py-2 text-sm ${toneCls.warn}`}>Kali hem internete (NAT) hem lab ağına bağlı: iki ağ arasında köprü gibi davranabilir. Test sırasında NAT adaptörünü devre dışı bırakmak daha izole bir çalışma sağlar.</div>}
            </div>
          )}

          <div className="card space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold">İzolasyon değerlendirmesi</h4>
              <span className={`rounded-full border px-3 py-1 text-xs font-bold ${toneCls[level.tone]}`}>{level.t} · %{pct}</span>
            </div>
            <ProgressBar pct={pct} tone={level.tone} />
            <ul className="space-y-1.5">
              {checks.map((c) => (
                <li key={c.label} className="flex items-start gap-2 text-sm">
                  <span className={`mt-0.5 font-bold ${c.ok ? "text-ag-ok" : "text-ag-err"}`}>{c.ok ? "✔" : "✘"}</span>
                  <span className="text-ag-text">{c.label}{!c.ok && <span className="block text-xs text-ag-muted">İpucu: {c.hint}</span>}</span>
                </li>
              ))}
            </ul>
            {pct >= 85 && coreOk && <Callout kind="ok" title="Güzel topoloji!">Kali ve hedef makine ortak izole ağda, dışarıya ve host'a açılan köprü yok. Uygulamayı tamamladın.</Callout>}
          </div>
          <button type="button" className="btn btn-sm" onClick={() => { setVms([]); setSel(null); setMsg("Tuval temizlendi."); }}>Tuvali temizle</button>
        </div>
      </div>
    </div>
  );
}

export default function Lesson08() {
  return <LessonShell slug="izole-laboratuvar" topic={<Topic />} lab={<Lab />} />;
}
