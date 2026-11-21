"use client";

import { useState } from "react";
import { LessonShell } from "@/components/LessonShell";
import { Callout, DataTable, InfoCards, SectionTitle } from "@/components/ui";
import { markLab } from "@/lib/progress";

type Mode = "nat" | "bridged" | "hostonly" | "internal";
type NodeT = { id: string; icon: string; label: string; ip: string; text: string };

const MODE_LABEL: Record<Mode, string> = { nat: "NAT", bridged: "Bridged Adapter", hostonly: "Host-only", internal: "Internal Network" };

const NODES: Record<Mode, NodeT[]> = {
  nat: [
    { id: "inet", icon: "🌐", label: "İnternet", ip: "—", text: "Dış dünya. NAT'ta sanal makinenin trafiği host üzerinden internete çıkar; internetten sanal makineye doğrudan bağlantı kurulamaz." },
    { id: "router", icon: "📡", label: "Ev yönlendiricisi", ip: "192.168.1.1", text: "Gerçek ağ geçidin. Host bu ağda 192.168.1.20 gibi bir adres alır. Sanal makine bu ağı hiç görmez." },
    { id: "host", icon: "🖥️", label: "Host", ip: "192.168.1.20", text: "Fiziksel bilgisayar. NAT servisi host'un adresini kullanarak sanal makinenin isteklerini dışarıya iletir." },
    { id: "nat", icon: "🔀", label: "Sanal NAT", ip: "10.0.2.2 (ağ geçidi)", text: "Hypervisor'un içindeki sanal yönlendirici. Sanal makinenin adresini çevirir (Network Address Translation). Dışarıdan gelen bağlantıları port yönlendirme yoksa engeller." },
    { id: "vm", icon: "🐉", label: "Sanal makine", ip: "10.0.2.15", text: "Kendi özel ağında, sentetik 10.0.2.x adresi alır. Ağ geçidi 10.0.2.2'dir. Ev ağındaki cihazlar bu adresi göremez." },
  ],
  bridged: [
    { id: "inet", icon: "🌐", label: "İnternet", ip: "—", text: "Bridged'de sanal makine fiziksel ağda gerçek bir cihaz gibi davranır ve doğrudan internete çıkabilir." },
    { id: "router", icon: "📡", label: "Fiziksel ağ / yönlendirici", ip: "192.168.1.1", text: "Yönlendirici (DHCP) sanal makineye de kendi adres havuzundan IP verir." },
    { id: "pc", icon: "💻", label: "Ağdaki başka bilgisayar", ip: "192.168.1.35", text: "Aynı ağdaki diğer cihaz sanal makineye doğrudan erişebilir. Bu yüzden zafiyetli bir test makinesini Bridged çalıştırmak risklidir." },
    { id: "host", icon: "🖥️", label: "Host ağ kartı (köprü)", ip: "192.168.1.20", text: "Hypervisor, host'un fiziksel ağ kartını sanal makineyle köprüler. Sanal makine bu kartın üzerinden ağa çıkar." },
    { id: "vm", icon: "🐉", label: "Sanal makine", ip: "192.168.1.50", text: "Fiziksel ağın bir parçasıdır; ağdaki cihazlarla aynı alt ağda bulunur. Ağ geçidi yönlendiricidir: 192.168.1.1." },
  ],
  hostonly: [
    { id: "host", icon: "🖥️", label: "Host (sanal arayüz)", ip: "192.168.56.1", text: "Host, özel sanal bir ağ arayüzü edinir. Sadece host ve sanal makineler bu ağda yer alır." },
    { id: "sw", icon: "🔀", label: "Sanal anahtar (switch)", ip: "—", text: "Host-only ağındaki cihazları birbirine bağlar; fiziksel ağdan ve internetten yalıtılmıştır." },
    { id: "vm", icon: "🐉", label: "Sanal makine A", ip: "192.168.56.101", text: "Host ve aynı Host-only ağdaki diğer sanal makinelerle konuşabilir. Varsayılan olarak internete çıkamaz." },
    { id: "vm2", icon: "🐧", label: "Sanal makine B", ip: "192.168.56.102", text: "Aynı ağdaki ikinci makine. Kali ile hedef VM'i birbirine bağlamak için kullanışlıdır." },
  ],
  internal: [
    { id: "vm", icon: "🐉", label: "Sanal makine A", ip: "10.10.10.11", text: "Yalnızca aynı Internal Network adına sahip makinelerle konuşur. Host bile bu ağa erişemez." },
    { id: "sw", icon: "🔀", label: "Internal anahtar", ip: "—", text: "Sadece hypervisor içinde var olan, tamamen yalıtılmış bir sanal ağ. Ağ geçidi veya DHCP yoksa adresleri elle vermen gerekebilir." },
    { id: "vm2", icon: "🐧", label: "Sanal makine B", ip: "10.10.10.12", text: "Aynı Internal ağdaki ikinci makine. En yalıtılmış laboratuvar bağlantısıdır." },
  ],
};

const TESTS = ["VM → İnternet", "VM → Host", "Host → VM", "Ağdaki başka PC → VM", "VM A ↔ VM B"];
const RESULTS: Record<Mode, { ok: boolean; why: string }[]> = {
  nat: [
    { ok: true, why: "NAT sanal makinenin giden trafiğini host üzerinden internete iletir." },
    { ok: true, why: "VM, ağ geçidi adresi (10.0.2.2) üzerinden host'a ulaşabilir." },
    { ok: false, why: "Port yönlendirme (port forwarding) tanımlanmadıkça host, VM'in özel adresine doğrudan ulaşamaz." },
    { ok: false, why: "VM, NAT'ın arkasında gizlidir; dışarıdan gelen bağlantı yönlendirme olmadan ulaşmaz." },
    { ok: false, why: "Klasik NAT modunda her VM kendi yalıtılmış NAT'ında olur; VM'ler birbirini görmez. (Ayrı bir 'NAT Network' modu bunu değiştirir.)" },
  ],
  bridged: [
    { ok: true, why: "VM, fiziksel ağın bir üyesidir ve yönlendirici üzerinden internete çıkar." },
    { ok: true, why: "Aynı ağda olduğu için host ile iletişim kurar." },
    { ok: true, why: "VM fiziksel ağda kendi IP'sine sahip olduğu için erişilebilir." },
    { ok: true, why: "Aynı alt ağda olduğu için ağdaki diğer cihazlar da VM'e erişebilir – bu bir güvenlik riskidir." },
    { ok: true, why: "İki VM de fiziksel ağda aynı alt ağdadır; birbirine erişir." },
  ],
  hostonly: [
    { ok: false, why: "Host-only ağ varsayılan olarak internete çıkış sağlamaz." },
    { ok: true, why: "Host, host-only ağda 192.168.56.1 gibi bir adrese sahiptir." },
    { ok: true, why: "Host sanal makineye doğrudan erişebilir (örneğin yerel bir web sunucusuna)." },
    { ok: false, why: "Fiziksel ağdaki cihazlar bu özel ağı göremez." },
    { ok: true, why: "Aynı Host-only ağdaki VM'ler birbirine erişir." },
  ],
  internal: [
    { ok: false, why: "Internal Network internete bağlı değildir." },
    { ok: false, why: "Host bu ağın dışındadır; erişim yoktur." },
    { ok: false, why: "Host, VM'ye ulaşamaz." },
    { ok: false, why: "Fiziksel ağdaki cihazlar VM'yi göremez." },
    { ok: true, why: "Aynı Internal Network adındaki VM'ler birbirine ulaşır." },
  ],
};

function NetDiagram({ mode, title }: { mode: Mode; title?: string }) {
  const nodes = NODES[mode];
  const [sel, setSel] = useState(nodes[nodes.length - 1].id);
  const cur = nodes.find((n) => n.id === sel) ?? nodes[nodes.length - 1];
  return (
    <div className="card space-y-3">
      {title && <h4 className="font-bold text-ag-brand">{title}</h4>}
      <div className="flex flex-wrap items-center gap-1.5">
        {nodes.map((n, i) => (
          <div key={n.id + mode} className="flex items-center gap-1.5">
            <button type="button" onClick={() => setSel(n.id)} aria-pressed={cur.id === n.id} className={`rounded-xl border-2 px-2.5 py-2 text-center text-xs transition ${cur.id === n.id ? "border-ag-warn bg-[#fffaf0]" : "border-ag-line bg-white hover:border-ag-accent"}`}>
              <span className="block text-lg">{n.icon}</span>
              <span className="block font-semibold text-ag-text">{n.label}</span>
              <span className="block font-mono text-[10px] text-ag-muted">{n.ip}</span>
            </button>
            {i < nodes.length - 1 && <span className="text-ag-accent" aria-hidden>⇄</span>}
          </div>
        ))}
      </div>
      <div className="rounded-lg bg-ag-light p-3 text-sm">
        <p className="font-bold text-ag-brand">{cur.icon} {cur.label}</p>
        <p className="text-ag-text">{cur.text}</p>
      </div>
      <p className="text-[11px] italic text-ag-muted">Adresler sentetiktir; gerçek bilgisayarında farklı olabilir.</p>
    </div>
  );
}

const SCENARIOS: { q: string; ans: Mode; why: Record<Mode, string> }[] = [
  { q: "Kali'ye paket indirmek ve güncelleme yapmak istiyorum; başka bir şey gerekmiyor.", ans: "nat", why: { nat: "Doğru: NAT güvenli ve basittir; giden internet erişimi yeterlidir.", bridged: "Çalışır ama VM'yi gereksiz yere fiziksel ağa açar.", hostonly: "Host-only internete çıkış sağlamaz; güncelleme yapamazsın.", internal: "Internal ağ internete bağlı değildir." } },
  { q: "Kali ile hedef Ubuntu'yu birbirine bağlayacağım; hedef makine dış ağlara asla görünmemeli.", ans: "internal", why: { internal: "Doğru: en yalıtılmış seçenek; yalnızca aynı ağdaki VM'ler konuşur.", hostonly: "Mümkün ve host erişimi de verir; ama Internal daha yalıtılmıştır.", nat: "NAT'ta iki VM birbirini göremez ve hedef internete açılır.", bridged: "Hedefi fiziksel ağa açar; en riskli seçenek." } },
  { q: "Host'tan tarayıcıyla VM içindeki yerel web sunucuma bağlanmak istiyorum, ağdan kimse erişmesin.", ans: "hostonly", why: { hostonly: "Doğru: host ile VM konuşur, dış ağ erişemez.", nat: "Port yönlendirme ile de olur ama Host-only daha doğal bir çözümdür.", bridged: "Ağdaki herkes erişebilir; istemediğin şey.", internal: "Host Internal ağa erişemez." } },
  { q: "Kendi ev ağımdaki ikinci bilgisayarımdan VM'ime erişmem gerekiyor (güvenli, kendi ağım).", ans: "bridged", why: { bridged: "Doğru: VM fiziksel ağda IP alır. Riskini bil: ağdaki diğer cihazlar da erişebilir. Zafiyetli makineleri Bridged çalıştırma.", nat: "Port yönlendirme gerektirir; doğrudan erişim olmaz.", hostonly: "Fiziksel ağdaki diğer bilgisayar Host-only ağı göremez.", internal: "Internal ağa dışarıdan erişilemez." } },
];

function Lab() {
  const [mode, setMode] = useState<Mode>("nat");
  const [viewed, setViewed] = useState<Set<Mode>>(new Set(["nat"]));
  const [ran, setRan] = useState<Record<string, number>>({});
  const [ans, setAns] = useState<Record<number, Mode>>({});
  const totalRan = Object.keys(ran).length;

  const pickMode = (m: Mode) => {
    setMode(m);
    const n = new Set(viewed).add(m);
    setViewed(n);
    if (n.size === 4 && totalRan >= 5) markLab("nat-ve-bridged");
  };
  const runTest = (i: number) => {
    const key = `${mode}-${i}`;
    const nr = { ...ran, [key]: 1 };
    setRan(nr);
    if (viewed.size === 4 && Object.keys(nr).length >= 5) markLab("nat-ve-bridged");
  };
  const runAll = () => {
    const nr = { ...ran };
    TESTS.forEach((_, i) => (nr[`${mode}-${i}`] = 1));
    setRan(nr);
    if (viewed.size === 4 && Object.keys(nr).length >= 5) markLab("nat-ve-bridged");
  };

  return (
    <div className="space-y-6">
      <SectionTitle kicker="Etkileşimli uygulama" title="Sanal ağ modu laboratuvarı">Modlar arasında geçiş yap, sentetik IP adreslerine bak ve iletişim testlerini çalıştır. Dört modu da inceleyip en az beş test çalıştırınca uygulama tamamlanır.</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(MODE_LABEL) as Mode[]).map((m) => (
          <button key={m} type="button" onClick={() => pickMode(m)} className={`btn ${mode === m ? "btn-primary" : ""}`}>
            {viewed.has(m) && mode !== m ? "✓ " : ""}{MODE_LABEL[m]}
          </button>
        ))}
      </div>
      <NetDiagram key={mode} mode={mode} title={`Ağ şeması – ${MODE_LABEL[mode]}`} />

      <div className="card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-bold">İletişim testleri ({MODE_LABEL[mode]})</h4>
          <button type="button" className="btn btn-sm" onClick={runAll}>Hepsini çalıştır</button>
        </div>
        <ul className="space-y-2">
          {TESTS.map((t, i) => {
            const done = ran[`${mode}-${i}`];
            const r = RESULTS[mode][i];
            return (
              <li key={t} className="rounded-lg border border-ag-line p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{t}</span>
                  {done ? <span className={`text-sm font-bold ${r.ok ? "text-ag-ok" : "text-ag-err"}`}>{r.ok ? "✔ Ulaşır" : "✘ Ulaşamaz"}</span> : <button type="button" className="btn btn-sm" onClick={() => runTest(i)}>Test et</button>}
                </div>
                {done && <p className="mt-1 text-xs text-ag-muted">{r.why}</p>}
              </li>
            );
          })}
        </ul>
        <p className="text-xs text-ag-muted">Bu sonuçlar tipik varsayılan davranışlardır; hypervisor ve ayarlara göre değişebilir. Test: {totalRan}/20 (modların toplamı)</p>
      </div>

      <div className="space-y-3">
        <h4 className="font-bold">Hangi senaryoda hangi mod?</h4>
        {SCENARIOS.map((s, i) => {
          const a = ans[i];
          return (
            <div key={s.q} className="card !p-4">
              <p className="text-sm font-semibold">{s.q}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(Object.keys(MODE_LABEL) as Mode[]).map((m) => (
                  <button key={m} type="button" disabled={a !== undefined} onClick={() => setAns({ ...ans, [i]: m })} className={`btn btn-sm ${a === m ? (m === s.ans ? "btn-ok" : "!border-ag-err !bg-[#fdf0f0]") : a !== undefined && m === s.ans ? "btn-ok" : ""}`}>
                    {MODE_LABEL[m]}
                  </button>
                ))}
              </div>
              {a !== undefined && <p className={`mt-2 text-sm ${a === s.ans ? "text-ag-ok" : "text-ag-err"}`}>{a === s.ans ? "✔ " : `✘ Doğru cevap: ${MODE_LABEL[s.ans]}. `}{s.why[a === s.ans ? s.ans : a]} {a !== s.ans && s.why[s.ans]}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Topic() {
  return (
    <>
      <Callout kind="tip" title="Sanal makinen internete nasıl çıkıyor?">
        Sanal makinenin de bir ağ kartı var; ama bu kart yazılımla yapılmış. Bu sanal ağ kartını nasıl bağladığın, makinenin kimlerle konuşabileceğini ve ne kadar güvende olacağını belirler.
      </Callout>
      <SectionTitle kicker="Temel kavramlar" title="Sanal ağ modları" />
      <InfoCards
        items={[
          { icon: "🔀", title: "NAT", body: "Sanal makine host'un arkasında gizlenir. İnternete çıkabilir; dışarıdan doğrudan erişilemez. Varsayılan ve güvenli başlangıçtır." },
          { icon: "🌉", title: "Bridged Adapter", body: "Sanal makine fiziksel ağda gerçek bir cihaz gibi görünür ve kendi IP'sini alır. Ağdaki herkesle iletişim kurabilir; bu yüzden riski yüksektir." },
          { icon: "🏠", title: "Host-only", body: "Sadece host ve sanal makineler arasında özel bir ağ. Varsayılan olarak internete çıkış yoktur." },
          { icon: "🔒", title: "Internal Network", body: "Yalnızca aynı ağ adındaki sanal makineler konuşur. Host bile dışarıdadır; en yalıtılmış seçenektir." },
          { icon: "🔢", title: "IP adresi ve ağ geçidi", body: "IP, cihazın ağdaki adresi; ağ geçidi (gateway) ise başka ağlara çıkış kapısıdır. NAT'ta ağ geçidi hypervisor'dur; Bridged'de ev yönlendiricisidir." },
          { icon: "🧱", title: "Ağ izolasyonu", body: "Bir makinenin hangi cihazlarla konuşabildiğini sınırlamaktır. Laboratuvar güvenliğinin temelidir." },
        ]}
      />
      <SectionTitle title="İki şemayı yan yana incele" />
      <div className="grid gap-4 lg:grid-cols-2">
        <NetDiagram mode="nat" title="NAT: Host → NAT → Sanal Makine" />
        <NetDiagram mode="bridged" title="Bridged: Fiziksel Ağ → Sanal Makine" />
      </div>
      <DataTable
        head={["Mod", "İnternet", "Host ↔ VM", "Ağdaki diğer cihazlar", "Tipik kullanım"]}
        rows={[
          ["NAT", "Evet", "VM → host evet; host → VM port yönlendirme ile", "VM'e erişemez", "Güncelleme, genel kullanım"],
          ["Bridged", "Evet", "Evet", "VM'e erişebilir", "Ağ üzerinden sunucu denemesi (güvenli ağda)"],
          ["Host-only", "Hayır (varsayılan)", "Evet", "Erişemez", "Host'tan VM'e güvenli erişim"],
          ["Internal", "Hayır", "Hayır", "Erişemez", "Tamamen izole lab"],
        ]}
      />
    </>
  );
}

export default function Lesson07() {
  return <LessonShell slug="nat-ve-bridged" topic={<Topic />} lab={<Lab />} />;
}
