"use client";

import { useState } from "react";
import { Btn, Callout, LabBox, StepControls, useStepper } from "@/components/ui";
import { SeqDiagram, type SeqMsg } from "@/components/Seq";
import { markLab } from "@/lib/storage";

const ZONE: Record<string, string> = {
  "agcyberlab.com": "203.0.113.10",
  "www.example.com": "93.184.216.34",
  "okul.edu.tr": "198.51.100.25",
  "mail.ornek.com": "192.0.2.77",
  "banka.ornek.com": "203.0.113.55",
};
const TLD_IP: Record<string, string> = { com: "192.5.6.30", tr: "194.0.0.53" };

type Plan = { domain: string; msgs: SeqMsg[]; infos: string[]; ip: string | null };

function plan(domain: string, cache: Record<string, string>): Plan {
  const d = domain.trim().toLowerCase();
  const tld = d.split(".").pop() || "com";
  const sld = d.split(".").slice(-2).join(".");
  const ip = ZONE[d] ?? null;
  const cached = cache[d];
  if (cached) {
    return {
      domain: d,
      ip: cached,
      msgs: [
        { from: 0, to: 0, label: "Yerel önbellek: yok", sub: "tarayıcı/işletim sistemi", tone: "warn" },
        { from: 0, to: 1, label: `A kaydı? ${d}`, tone: "brand" },
        { from: 1, to: 1, label: "Çözücü önbelleği: BULUNDU", sub: `TTL süresi dolmadı`, tone: "ok" },
        { from: 1, to: 0, label: `Cevap: ${cached}`, tone: "ok" },
        { from: 0, to: 0, label: "Siteye bağlan", sub: `IP: ${cached}`, tone: "ok" },
      ],
      infos: [
        "Tarayıcı önce kendi ve işletim sisteminin önbelleğine bakar; kayıt yok.",
        "Sorgu yapılandırılmış DNS çözücüsüne (resolver) gönderilir.",
        "Bu alan adı daha önce çözüldüğü ve TTL süresi dolmadığı için çözücü cevabı önbellekten bulur: kök, TLD ve yetkili sunucuya gitmeye gerek kalmaz. DNS bu yüzden hızlıdır.",
        "Çözücü IP adresini istemciye döner.",
        "Tarayıcı artık IP adresini biliyor ve TCP bağlantısı kurabilir.",
      ],
    };
  }
  const base: SeqMsg[] = [
    { from: 0, to: 0, label: "Yerel önbellek: yok", sub: "tarayıcı/işletim sistemi", tone: "warn" },
    { from: 0, to: 1, label: `A kaydı? ${d}`, tone: "brand" },
    { from: 1, to: 1, label: "Çözücü önbelleği: yok", tone: "warn" },
    { from: 1, to: 2, label: `.${tld} kim yönetiyor?`, tone: "brand" },
    { from: 2, to: 1, label: `TLD sunucusu: ${TLD_IP[tld] ?? "192.5.6.30"}`, tone: "ok" },
    { from: 1, to: 3, label: `${sld} kim yönetiyor?`, tone: "brand" },
    { from: 3, to: 1, label: `Yetkili: ns1.${sld}`, tone: "ok" },
    { from: 1, to: 4, label: `A kaydı? ${d}`, tone: "brand" },
  ];
  const infoBase = [
    "Tarayıcı önce kendi ve işletim sisteminin önbelleğine bakar; kayıt yok.",
    "Sorgu yapılandırılmış DNS çözücüsüne (Recursive Resolver) gönderilir.",
    "Çözücü kendi önbelleğine bakar; bu alan adı için kayıt yok. Zinciri baştan sorgulayacak.",
    "Çözücü kök (root) sunucuya sorar: bu uzantıyı kim yönetiyor?",
    "Kök sunucu, ilgili üst düzey alan adı (TLD) sunucusunun adresini verir. Kök sunucu IP'yi bilmez, yalnızca kimin bildiğini söyler.",
    "Çözücü TLD sunucusuna sorar: bu alan adı kimde?",
    "TLD sunucusu, alan adının yetkili (authoritative) ad sunucusunu bildirir.",
    "Çözücü yetkili sunucuya asıl soruyu sorar: bu adın A kaydı nedir?",
  ];
  if (!ip) {
    return {
      domain: d,
      ip: null,
      msgs: [...base, { from: 4, to: 1, label: "NXDOMAIN (kayıt yok)", tone: "err" }, { from: 1, to: 0, label: "NXDOMAIN", sub: "alan adı bulunamadı", tone: "err" }],
      infos: [...infoBase, "Yetkili sunucuda bu ad için kayıt bulunmuyor: NXDOMAIN (Non-Existent Domain) döner.", "İstemciye 'alan adı yok' bilgisi iletilir; tarayıcı 'siteye ulaşılamıyor' hatası gösterir. Yazım hatası en sık nedendir."],
    };
  }
  return {
    domain: d,
    ip,
    msgs: [...base, { from: 4, to: 1, label: `A ${ip}`, sub: "TTL 300 sn", tone: "ok" }, { from: 1, to: 0, label: `Cevap: ${ip}`, tone: "ok" }, { from: 0, to: 0, label: "Önbelleğe kaydet, bağlan", sub: `IP: ${ip}`, tone: "ok" }],
    infos: [...infoBase, "Yetkili sunucu kesin cevabı verir: A kaydı ve TTL (önbellekte kalma süresi).", "Çözücü cevabı önbelleğine alır ve istemciye iletir.", "Tarayıcı IP adresini biliyor; artık TCP/TLS ve HTTP aşamalarına geçebilir."],
  };
}

function DnsLab() {
  const [domain, setDomain] = useState("agcyberlab.com");
  const [cache, setCache] = useState<Record<string, string>>({});
  const [p, setP] = useState<Plan | null>(null);
  const total = p ? p.msgs.length : 1;
  const s = useStepper(total, 1200);

  const go = () => {
    const d = domain.trim().toLowerCase();
    if (!d) return;
    const pl = plan(d, cache);
    setP(pl);
    s.reset();
    setTimeout(() => s.play(), 50);
    if (pl.ip && !cache[pl.domain]) setCache((c) => ({ ...c, [pl.domain]: pl.ip as string }));
    markLab(11);
  };

  return (
    <div className="space-y-4">
      <h4 className="font-bold">Bölüm 1 · DNS Çözümleme</h4>
      <div className="flex flex-wrap gap-2">
        {[...Object.keys(ZONE), "yok-boyle-site.com"].map((z) => <Btn key={z} variant="soft" className="min-h-[34px] px-3 text-xs" onClick={() => setDomain(z)}>{z}</Btn>)}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input className="field font-mono" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="alan adı yaz" onKeyDown={(e) => e.key === "Enter" && go()} />
        <Btn onClick={go}>🔍 Çöz</Btn>
        <Btn variant="ghost" onClick={() => { setCache({}); setP(null); s.reset(); }}>Önbelleği Temizle</Btn>
      </div>
      <p className="text-xs text-muted">Önbellekteki adlar: {Object.keys(cache).length ? Object.keys(cache).join(", ") : "yok"}. Aynı adı iki kez çözerek önbellek farkını gör.</p>
      {p && (
        <div className="space-y-3">
          <StepControls s={s} total={total} />
          <SeqDiagram actors={["Tarayıcı", "Çözücü", "Kök Sunucu", "TLD Sunucusu", "Yetkili Sunucu"]} msgs={p.msgs} visible={s.step} width={900} rowH={52} />
          {s.step > 0 && <Callout kind={p.msgs[s.step - 1].tone === "err" ? "err" : "info"} title={`Adım ${s.step}/${total}`}>{p.infos[s.step - 1]}</Callout>}
          {s.step === total && (p.ip ? <Callout kind="ok" title="Çözümleme tamamlandı">{p.domain} → <b className="font-mono">{p.ip}</b></Callout> : <Callout kind="err" title="Çözümleme başarısız">{p.domain} için kayıt bulunamadı (NXDOMAIN).</Callout>)}
        </div>
      )}
    </div>
  );
}

const DEVICES = ["Telefon", "Dizüstü", "Akıllı TV", "Yazıcı"];
const DHCP_INFO = [
  "DISCOVER: Yeni bağlanan cihazın henüz IP adresi yoktur (0.0.0.0). Bu yüzden hedef 255.255.255.255 (yayın) olur ve ağdaki herhangi bir DHCP sunucusunu arar.",
  "OFFER: DHCP sunucusu havuzundan boş bir adres seçer ve istemciye teklif eder (IP, maske, gateway, DNS, kiralama süresi).",
  "REQUEST: İstemci teklifi kabul ettiğini bildirir. Birden fazla sunucu teklif verebileceğinden, hangi teklifi seçtiğini yayınla herkese duyurur.",
  "ACKNOWLEDGE: Sunucu adresi kesin olarak kiralar. Artık istemci bu IP ile ağda iletişim kurabilir.",
  "Cihaz aldığı ayarlarla yapılandı. Kira süresi dolmadan önce yenileme (renewal) isteği yapar.",
];

function DhcpLab() {
  const [dev, setDev] = useState(DEVICES[0]);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ipNow = `192.168.1.${50 + count}`;
  const msgs: SeqMsg[] = [
    { from: 0, to: 1, label: "1. DISCOVER", sub: "Kaynak 0.0.0.0 → 255.255.255.255 (yayın)", tone: "brand" },
    { from: 1, to: 0, label: "2. OFFER", sub: `Teklif: ${ipNow} /24, 24 saat`, tone: "ok" },
    { from: 0, to: 1, label: "3. REQUEST", sub: `${ipNow} adresini istiyorum`, tone: "brand" },
    { from: 1, to: 0, label: "4. ACKNOWLEDGE", sub: "Onaylandı, kira başladı", tone: "ok" },
    { from: 0, to: 0, label: "Yapılandı", sub: ipNow, tone: "ok" },
  ];
  const s = useStepper(msgs.length, 1400);

  const start = () => {
    setStarted(true);
    s.reset();
    setTimeout(() => s.play(), 50);
    markLab(11);
  };
  const addDevice = () => {
    if (s.step >= msgs.length) setCount((c) => c + 1);
    s.reset();
    setTimeout(() => s.play(), 50);
    setStarted(true);
  };

  return (
    <div className="space-y-4">
      <h4 className="font-bold">Bölüm 2 · DHCP DORA</h4>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <label className="text-sm font-semibold">Ağa bağlanan yeni cihaz
          <select className="field mt-1" value={dev} onChange={(e) => { setDev(e.target.value); s.reset(); setStarted(false); }}>{DEVICES.map((d) => <option key={d}>{d}</option>)}</select>
        </label>
        <Btn onClick={start}>▶ DORA'yı Başlat</Btn>
        <Btn variant="soft" onClick={addDevice} disabled={!started || s.step < msgs.length}>＋ Sonraki cihaz (yeni IP)</Btn>
      </div>
      {started && (
        <div className="space-y-3">
          <StepControls s={s} total={msgs.length} />
          <SeqDiagram actors={[`${dev} (İstemci)`, "DHCP Sunucusu (Router)"]} msgs={msgs} visible={s.step} rowH={60} />
          {s.step > 0 && <Callout title={`Adım ${s.step}`}>{DHCP_INFO[s.step - 1]}</Callout>}
          {s.step === msgs.length && (
            <div className="rounded-xl border border-ok/40 bg-[#E9F5EF] p-4 text-sm">
              <p className="mb-1 font-bold text-ok">{dev} için DHCP ayarları</p>
              <p className="font-mono">IP: {ipNow} · Maske: 255.255.255.0 · Gateway: 192.168.1.1 · DNS: 192.168.1.1 · Kira: 24 saat</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Lab11() {
  return (
    <LabBox title="DNS Çözümleme ve DHCP DORA">
      <DnsLab />
      <hr className="border-line" />
      <DhcpLab />
    </LabBox>
  );
}
