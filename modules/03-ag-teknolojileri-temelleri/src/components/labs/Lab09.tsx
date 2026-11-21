"use client";

import { useState } from "react";
import { Btn, Callout, LabBox } from "@/components/ui";
import { markLab } from "@/lib/storage";
import { ChoiceLab, type ChoiceItem } from "./ChoiceLab";
import { parseIp } from "./Lab07";

type Kind = "Public" | "Private" | "Özel amaçlı";
const OPT: Kind[] = ["Public", "Private", "Özel amaçlı"];

export function classify(ip: string): { kind: Kind; why: string } | string {
  const n = parseIp(ip);
  if (typeof n === "string") return n;
  const a = n >>> 24;
  const b = (n >>> 16) & 255;
  if (a === 10) return { kind: "Private", why: "10.0.0.0/8 aralığı RFC 1918'de özel adres olarak tanımlıdır (10.0.0.0 – 10.255.255.255)." };
  if (a === 172 && b >= 16 && b <= 31) return { kind: "Private", why: "172.16.0.0/12 (172.16.0.0 – 172.31.255.255) RFC 1918 özel aralığındadır." };
  if (a === 192 && b === 168) return { kind: "Private", why: "192.168.0.0/16 aralığı RFC 1918'de özel adres olarak tanımlıdır; ev ağlarında en yaygın kullanılan aralıktır." };
  if (a === 127) return { kind: "Özel amaçlı", why: "127.0.0.0/8 loopback aralığıdır: cihazın kendisini gösterir, ağa çıkmaz." };
  if (a === 169 && b === 254) return { kind: "Özel amaçlı", why: "169.254.0.0/16 APIPA (link-local) aralığıdır: DHCP sunucusu bulunamayınca cihazın kendine verdiği adres." };
  if (a === 0 || a >= 224) return { kind: "Özel amaçlı", why: a >= 240 ? "240.0.0.0 ve üzeri ayrılmış (reserved) adreslerdir." : a >= 224 ? "224.0.0.0 – 239.255.255.255 çok noktaya yayın (multicast) adresleridir." : "0.0.0.0/8 özel anlamlı adrestir." };
  if (a === 100 && b >= 64 && b <= 127) return { kind: "Özel amaçlı", why: "100.64.0.0/10 operatörlerin ortak NAT (CGNAT) alanıdır; ne olağan public ne de RFC 1918 özel adresidir." };
  if (a === 172) return { kind: "Public", why: `172.${b}.x.x, 172.16–172.31 özel aralığının dışında kaldığı için PUBLIC'tir. (Sık yapılan hata!)` };
  return { kind: "Public", why: "Bu adres RFC 1918 özel aralıklarının ve özel amaçlı bloklarının dışında olduğundan internette yönlendirilebilir bir Public IP'dir." };
}

const IPS = ["192.168.0.15", "8.8.8.8", "172.20.4.7", "172.32.1.1", "10.45.12.200", "127.0.0.1", "203.0.113.9", "169.254.12.3", "172.16.0.1", "11.1.1.1"];

const items: ChoiceItem[] = IPS.map((ip) => {
  const c = classify(ip) as { kind: Kind; why: string };
  return { prompt: <span>Bu adres hangi türdedir? <span className="ml-1 rounded bg-soft px-2 py-0.5 font-mono text-brand">{ip}</span></span>, options: OPT, answer: OPT.indexOf(c.kind), why: c.why };
});

const DEVS = [
  { name: "Telefon", ip: "192.168.1.25" },
  { name: "Bilgisayar", ip: "192.168.1.30" },
  { name: "Akıllı TV", ip: "192.168.1.41" },
];

export default function Lab09() {
  const [ip, setIp] = useState("172.31.255.1");
  const [res, setRes] = useState<ReturnType<typeof classify> | null>(null);
  const [nat, setNat] = useState<{ inner: string; outer: string; dev: string }[]>([]);

  const check = () => {
    setRes(classify(ip));
    markLab(9);
  };

  const out = (name: string, ipa: string) => {
    const idx = nat.length;
    const inner = `${ipa}:${50000 + idx * 137}`;
    if (nat.some((r) => r.inner === inner)) return;
    setNat([...nat, { inner, outer: `203.0.113.7:${61001 + idx}`, dev: name }]);
    markLab(9);
  };

  return (
    <LabBox title="Public / Private IP Sınıflandırma">
      <ChoiceLab id={9} items={items} intro="Her adres için türünü seç. İpucu: RFC 1918 → 10/8, 172.16/12, 192.168/16." />
      <div className="rounded-xl border border-line bg-white p-4">
        <p className="mb-2 text-sm font-bold">Kendi adresini sınıflandır</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input className="field font-mono" value={ip} onChange={(e) => setIp(e.target.value)} />
          <Btn onClick={check}>Sınıflandır</Btn>
        </div>
        {res && (typeof res === "string" ? <div className="mt-3"><Callout kind="err" title="Geçersiz adres">{res}</Callout></div> : <div className="mt-3"><Callout kind={res.kind === "Public" ? "info" : res.kind === "Private" ? "ok" : "warn"} title={res.kind}>{res.why}</Callout></div>)}
      </div>
      <div className="rounded-xl border border-line bg-white p-4">
        <p className="mb-1 text-sm font-bold">NAT demosu: tek public IP, birçok cihaz</p>
        <p className="mb-3 text-xs text-muted">Router&apos;ın public IP&apos;si: <span className="font-mono font-bold">203.0.113.7</span>. Bir cihazı internete çıkar ve router&apos;ın NAT tablosuna eklenen satırı gör.</p>
        <div className="flex flex-wrap gap-2">
          {DEVS.map((d) => <Btn key={d.name} variant="soft" onClick={() => out(d.name, d.ip)}>{d.name} ({d.ip}) → İnternet</Btn>)}
          <Btn variant="ghost" onClick={() => setNat([])}>Tabloyu Temizle</Btn>
        </div>
        {nat.length > 0 && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[420px] text-sm">
              <thead className="bg-soft text-left text-brand"><tr><th className="p-2">Cihaz</th><th className="p-2">İç adres (Private)</th><th className="p-2">Dış adres (Public)</th></tr></thead>
              <tbody className="divide-y divide-line">{nat.map((r) => <tr key={r.inner}><td className="p-2">{r.dev}</td><td className="p-2 font-mono">{r.inner}</td><td className="p-2 font-mono text-brand">→ {r.outer}</td></tr>)}</tbody>
            </table>
            <p className="mt-2 text-xs text-muted">İnternetteki sunucu yalnızca 203.0.113.7 adresini görür. Yanıt geldiğinde router tabloya bakarak paketi doğru iç cihaza çevirir.</p>
          </div>
        )}
      </div>
    </LabBox>
  );
}
