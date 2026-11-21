"use client";

import { useState } from "react";
import { Btn, Callout, LabBox } from "@/components/ui";
import { markLab } from "@/lib/storage";

export function parseIp(s: string): number | string {
  const parts = s.trim().split(".");
  if (parts.length !== 4) return "IP adresi tam 4 oktetten oluşmalı (örn. 192.168.1.10).";
  let n = 0;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return `'${p || "boş"}' geçerli bir oktet değil; yalnızca rakam kullanılabilir.`;
    const v = Number(p);
    if (v > 255) return `${v} değeri 255'ten büyük; her oktet 0–255 arasında olmalı.`;
    n = n * 256 + v;
  }
  return n;
}

export function parseMask(s: string): { prefix: number } | string {
  const t = s.trim();
  if (/^\/?\d{1,2}$/.test(t)) {
    const p = Number(t.replace("/", ""));
    if (p < 0 || p > 32) return "Önek uzunluğu 0–32 arasında olmalı.";
    return { prefix: p };
  }
  const n = parseIp(t);
  if (typeof n === "string") return "Maske geçersiz: " + n;
  const inv = (~n) >>> 0;
  if ((inv & (inv + 1)) >>> 0 !== 0) return "Maske geçersiz: önce ardışık 1'ler, sonra ardışık 0'lar olmalı (örn. 255.255.255.0).";
  let p = 0;
  for (let i = 31; i >= 0; i--) if ((n >>> i) & 1) p++;
  return { prefix: p };
}

export const toStr = (n: number) => [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
const maskNum = (p: number) => (p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0);

function Bits({ n, prefix, label }: { n: number; prefix: number; label: string }) {
  const bits = n.toString(2).padStart(32, "0");
  return (
    <div className="overflow-x-auto">
      <p className="text-xs font-semibold text-muted">{label}</p>
      <div className="flex gap-2 font-mono text-[13px] sm:text-sm">
        {[0, 1, 2, 3].map((o) => (
          <span key={o}>
            {bits
              .slice(o * 8, o * 8 + 8)
              .split("")
              .map((b, i) => (
                <span key={i} className={o * 8 + i < prefix ? "font-bold text-brand" : "text-accent"}>{b}</span>
              ))}
          </span>
        ))}
      </div>
    </div>
  );
}

const EXAMPLES = [
  { name: "Ev ağı", ip: "192.168.1.25", mask: "255.255.255.0", gw: "192.168.1.1" },
  { name: "Küçük alt ağ /26", ip: "192.168.1.70", mask: "255.255.255.192", gw: "192.168.1.65" },
  { name: "Hatalı gateway", ip: "192.168.1.25", mask: "255.255.255.0", gw: "192.168.2.1" },
  { name: "Ağ adresi hatası", ip: "10.0.5.0", mask: "255.255.255.0", gw: "10.0.5.1" },
  { name: "Geçersiz oktet", ip: "192.168.1.300", mask: "255.255.255.0", gw: "192.168.1.1" },
];

type Check = { ok: boolean; msg: string };

export default function Lab07() {
  const [ip, setIp] = useState("192.168.1.25");
  const [mask, setMask] = useState("255.255.255.0");
  const [gw, setGw] = useState("192.168.1.1");
  const [res, setRes] = useState<null | { checks: Check[]; data?: { ip: number; prefix: number; net: number; bc: number; first: number; last: number; hosts: number; maskN: number } }>(null);

  const analyze = (i = ip, m = mask, g = gw) => {
    const checks: Check[] = [];
    const a = parseIp(i);
    const mm = parseMask(m);
    const gg = g.trim() ? parseIp(g) : null;
    if (typeof a === "string") checks.push({ ok: false, msg: "IP adresi: " + a });
    else checks.push({ ok: true, msg: "IP adresi biçimi geçerli." });
    if (typeof mm === "string") checks.push({ ok: false, msg: mm });
    else checks.push({ ok: true, msg: `Alt ağ maskesi geçerli: /${mm.prefix} (${toStr(maskNum(mm.prefix))}).` });
    if (typeof a === "string" || typeof mm === "string") {
      if (typeof gg === "string") checks.push({ ok: false, msg: "Gateway: " + gg });
      setRes({ checks });
      return;
    }
    const prefix = mm.prefix;
    const mk = maskNum(prefix);
    const net = (a & mk) >>> 0;
    const bc = (net | (~mk >>> 0)) >>> 0;
    if (prefix > 30 || prefix < 8) checks.push({ ok: false, msg: "Bu laboratuvarda /8 – /30 arası maskeler kullanılır; /31 ve /32 özel durumlardır." });
    const hosts = prefix > 30 ? 0 : Math.pow(2, 32 - prefix) - 2;
    if (a === net) checks.push({ ok: false, msg: "Bu adres ağ adresinin kendisidir; bir cihaza atanamaz." });
    else if (a === bc) checks.push({ ok: false, msg: "Bu adres broadcast (yayın) adresidir; bir cihaza atanamaz." });
    else checks.push({ ok: true, msg: "Adres, ağın kullanılabilir cihaz aralığında." });
    if (gg === null) checks.push({ ok: false, msg: "Gateway girilmedi. Gateway olmadan cihaz yalnızca kendi ağıyla konuşabilir (internete çıkamaz)." });
    else if (typeof gg === "string") checks.push({ ok: false, msg: "Gateway: " + gg });
    else {
      if (((gg & mk) >>> 0) !== net) checks.push({ ok: false, msg: `Gateway (${g}) cihazla aynı alt ağda değil (${toStr(net)}/${prefix}). Cihaz gateway'e ulaşamaz, bu yüzden internete çıkamaz.` });
      else if (gg === a) checks.push({ ok: false, msg: "Gateway ile cihaz aynı adresi kullanıyor (adres çakışması)." });
      else if (gg === net || gg === bc) checks.push({ ok: false, msg: "Gateway ağ veya broadcast adresi olamaz." });
      else checks.push({ ok: true, msg: "Gateway cihazla aynı alt ağda; dış ağlara çıkış mümkün." });
    }
    setRes({ checks, data: { ip: a, prefix, net, bc, first: net + 1, last: bc - 1, hosts, maskN: mk } });
    markLab(7);
  };

  const load = (e: (typeof EXAMPLES)[number]) => {
    setIp(e.ip);
    setMask(e.mask);
    setGw(e.gw);
    analyze(e.ip, e.mask, e.gw);
  };

  const setPrefix = (p: number) => {
    const m = toStr(maskNum(p));
    setMask(m);
    analyze(ip, m, gw);
  };

  const d = res?.data;
  const allOk = res?.checks.every((c) => c.ok);

  return (
    <LabBox title="IP Adresleme Simülatörü">
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((e) => (
          <Btn key={e.name} variant="soft" onClick={() => load(e)}>{e.name}</Btn>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-sm font-semibold">IP adresi
          <input className="field mt-1 font-mono" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="192.168.1.25" />
        </label>
        <label className="text-sm font-semibold">Subnet mask (veya /24)
          <input className="field mt-1 font-mono" value={mask} onChange={(e) => setMask(e.target.value)} placeholder="255.255.255.0" />
        </label>
        <label className="text-sm font-semibold">Varsayılan ağ geçidi
          <input className="field mt-1 font-mono" value={gw} onChange={(e) => setGw(e.target.value)} placeholder="192.168.1.1" />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Btn onClick={() => analyze()}>🔍 Analiz Et</Btn>
        <span className="text-xs text-muted">Hızlı maske:</span>
        {[16, 24, 25, 26, 27, 28].map((p) => (
          <Btn key={p} variant="ghost" className="min-h-[34px] px-3" onClick={() => setPrefix(p)}>/{p}</Btn>
        ))}
      </div>
      {res && (
        <div className="space-y-4">
          <ul className="space-y-1.5">
            {res.checks.map((c, i) => (
              <li key={i} className={`flex gap-2 rounded-lg border px-3 py-2 text-sm ${c.ok ? "border-ok/30 bg-[#E9F5EF]" : "border-err/30 bg-[#F9ECEC]"}`}>
                <span>{c.ok ? "✔" : "✖"}</span>
                <span>{c.msg}</span>
              </li>
            ))}
          </ul>
          {d && (
            <>
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  ["Ağ adresi", `${toStr(d.net)}/${d.prefix}`],
                  ["Broadcast", toStr(d.bc)],
                  ["Alt ağ maskesi", toStr(d.maskN)],
                  ["İlk cihaz adresi", toStr(d.first)],
                  ["Son cihaz adresi", toStr(d.last)],
                  ["Kullanılabilir cihaz", String(d.hosts)],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-line bg-white p-3">
                    <p className="text-xs font-semibold text-muted">{k}</p>
                    <p className="font-mono text-sm font-bold text-ink">{v}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 rounded-xl border border-line bg-white p-4">
                <p className="text-sm font-bold">İkili (binary) gösterim <span className="font-normal text-muted">— <span className="font-bold text-brand">mavi</span>: ağ bitleri, <span className="text-accent">turkuaz</span>: cihaz bitleri</span></p>
                <Bits n={d.ip} prefix={d.prefix} label="IP adresi" />
                <Bits n={d.maskN} prefix={d.prefix} label="Alt ağ maskesi" />
                <Bits n={d.net} prefix={d.prefix} label="Ağ adresi (IP AND maske)" />
              </div>
              <Callout title="Ağ kısmı ve cihaz kısmı">
                {toStr(d.ip)} adresinin ilk {d.prefix} biti ağı, kalan {32 - d.prefix} biti cihazı tanımlar. Ağ kimliği <b>{toStr(d.net)}</b>, cihaz kimliği ağ içindeki <b>{d.ip - d.net}</b>. sıradır.
              </Callout>
            </>
          )}
          {allOk && <Callout kind="ok" title="Yapılandırma doğru">IP, maske ve gateway uyumlu. Cihaz yerel ağda iletişim kurabilir ve gateway üzerinden internete çıkabilir.</Callout>}
        </div>
      )}
    </LabBox>
  );
}
