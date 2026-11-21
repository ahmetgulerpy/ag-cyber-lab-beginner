"use client";

import { useState } from "react";
import { Btn, Callout, LabBox, StepControls, useStepper } from "@/components/ui";
import { markLab } from "@/lib/storage";

const SERVICES = [
  { name: "FTP (dosya aktarımı)", port: "20/21", note: "FTP veri için 20, kontrol için 21 kullanır; şifresizdir." },
  { name: "SSH (güvenli uzaktan yönetim)", port: "22", note: "Şifreli komut satırı erişimi." },
  { name: "Telnet (şifresiz uzaktan yönetim)", port: "23", note: "Bilgileri açık metin taşır; SSH ile değiştirilmelidir." },
  { name: "SMTP (e-posta gönderme)", port: "25", note: "Sunucular arası e-posta gönderimi." },
  { name: "DNS (alan adı çözümleme)", port: "53", note: "UDP/TCP 53; alan adlarını IP'ye çevirir." },
  { name: "HTTP (web)", port: "80", note: "Şifresiz web trafiği." },
  { name: "POP3 (e-posta indirme)", port: "110", note: "E-postayı sunucudan indirir." },
  { name: "IMAP (e-posta senkronizasyonu)", port: "143", note: "E-postayı sunucuda tutar, çok cihazdan okunur." },
  { name: "HTTPS (güvenli web)", port: "443", note: "TLS ile şifrelenmiş web trafiği." },
  { name: "RDP (uzak masaüstü)", port: "3389", note: "Windows uzak masaüstü; internete açılırsa sık saldırı alır." },
];
const PORTS = ["20/21", "22", "23", "25", "53", "80", "110", "143", "443", "3389"];

type Row = { port: number; proto: string; service: string; state: "açık" | "kapalı" | "filtreli"; risk: "yok" | "düşük" | "orta" | "yüksek"; note: string };
const TABLE: Row[] = [
  { port: 21, proto: "TCP", service: "FTP", state: "açık", risk: "yüksek", note: "FTP şifresiz çalışır; kullanıcı adı ve parola ağda düz metin görünür. SFTP kullanılmalı." },
  { port: 22, proto: "TCP", service: "SSH", state: "açık", risk: "düşük", note: "Şifreli yönetim. Güçlü parola/anahtar kullanılmalı ve erişim sınırlanmalı." },
  { port: 23, proto: "TCP", service: "Telnet", state: "açık", risk: "yüksek", note: "Telnet tüm trafiği şifresiz taşır. Kapatılmalı, yerine SSH kullanılmalı." },
  { port: 25, proto: "TCP", service: "SMTP", state: "kapalı", risk: "yok", note: "Bu sunucuda e-posta gönderme servisi çalışmıyor." },
  { port: 53, proto: "UDP", service: "DNS", state: "kapalı", risk: "yok", note: "Bu sunucu DNS hizmeti vermiyor." },
  { port: 80, proto: "TCP", service: "HTTP", state: "açık", risk: "orta", note: "Şifresiz web. HTTPS'e yönlendirme yapılmalı." },
  { port: 110, proto: "TCP", service: "POP3", state: "kapalı", risk: "yok", note: "Servis kapalı." },
  { port: 143, proto: "TCP", service: "IMAP", state: "filtreli", risk: "yok", note: "Güvenlik duvarı paketleri engelliyor; dışarıdan servisin varlığı bile anlaşılmıyor." },
  { port: 443, proto: "TCP", service: "HTTPS", state: "açık", risk: "düşük", note: "TLS ile şifreli web. Sertifikanın geçerli ve güncel olması gerekir." },
  { port: 3389, proto: "TCP", service: "RDP", state: "filtreli", risk: "yok", note: "Uzak masaüstü güvenlik duvarıyla korunuyor. İnternete doğrudan açık olmamalı." },
];
const HIGH = TABLE.filter((r) => r.state === "açık" && r.risk === "yüksek").map((r) => r.port);

const stTone = { açık: "text-ok bg-[#E9F5EF]", kapalı: "text-muted bg-[#EEF2F5]", filtreli: "text-[#9a6a14] bg-[#FBF3E2]" };
const rkTone = { yok: "text-muted", düşük: "text-ok", orta: "text-[#9a6a14]", yüksek: "font-bold text-err" };

export default function Lab13() {
  const [ans, setAns] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [openRow, setOpenRow] = useState<number | null>(null);
  const [mark, setMark] = useState<number[]>([]);
  const [evald, setEvald] = useState(false);
  const s = useStepper(TABLE.length, 500);

  const correct = SERVICES.filter((x) => ans[x.name] === x.port).length;
  const check = () => {
    setChecked(true);
    markLab(13);
  };
  const shown = TABLE.slice(0, s.step);
  const openPorts = shown.filter((r) => r.state === "açık");
  const scanned = s.step >= TABLE.length;

  const toggleMark = (p: number) => setMark((m) => (m.includes(p) ? m.filter((x) => x !== p) : [...m, p]));
  const good = mark.length === HIGH.length && HIGH.every((p) => mark.includes(p));

  return (
    <LabBox title="Port Eşleştirme ve Yerel Port Tablosu">
      <h4 className="font-bold">Bölüm 1 · Servis – Port eşleştirme</h4>
      <div className="grid gap-2 sm:grid-cols-2">
        {SERVICES.map((x) => {
          const st = !checked ? "" : ans[x.name] === x.port ? "border-ok bg-[#E9F5EF]" : "border-err bg-[#F9ECEC]";
          return (
            <div key={x.name} className={`rounded-xl border p-3 ${st || "border-line bg-white"}`}>
              <p className="text-sm font-semibold">{x.name}</p>
              <select className="field mt-1" value={ans[x.name] ?? ""} onChange={(e) => { setAns({ ...ans, [x.name]: e.target.value }); setChecked(false); }}>
                <option value="">Port seç…</option>
                {PORTS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              {checked && <p className={`mt-1 text-xs ${ans[x.name] === x.port ? "text-ok" : "text-err"}`}>{ans[x.name] === x.port ? "✔ Doğru. " : `✖ Doğru port: ${x.port}. `}{x.note}</p>}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Btn onClick={check} disabled={Object.keys(ans).length < SERVICES.length}>✓ Kontrol Et</Btn>
        <Btn variant="ghost" onClick={() => { setAns({}); setChecked(false); }}>↺ Sıfırla</Btn>
        {checked && <span className="text-sm font-semibold">Sonuç: {correct}/{SERVICES.length}</span>}
      </div>
      {checked && correct === SERVICES.length && <Callout kind="ok" title="Mükemmel!">On servisin tamamını doğru eşleştirdin.</Callout>}

      <hr className="border-line" />
      <h4 className="font-bold">Bölüm 2 · Yerel port tablosu (örnek sunucu: 192.168.56.10)</h4>
      <Callout kind="warn" title="Tamamen yerel simülasyon">Bu tarama gerçek bir sistemi taramaz; veriler tarayıcı içindeki örnek bir sunucuya aittir.</Callout>
      <StepControls s={s} total={TABLE.length} startLabel="Yerel Taramayı Başlat" />
      {shown.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full min-w-[520px] text-sm">
            <thead className="bg-soft text-left text-brand"><tr><th className="p-2">Port</th><th className="p-2">Protokol</th><th className="p-2">Servis</th><th className="p-2">Durum</th><th className="p-2">Risk</th></tr></thead>
            <tbody className="divide-y divide-line">
              {shown.map((r) => (
                <tr key={r.port} onClick={() => setOpenRow(openRow === r.port ? null : r.port)} className="cursor-pointer hover:bg-soft/60">
                  <td className="p-2 font-mono font-bold">{r.port}</td>
                  <td className="p-2">{r.proto}</td>
                  <td className="p-2">{r.service}</td>
                  <td className="p-2"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${stTone[r.state]}`}>{r.state}</span></td>
                  <td className={`p-2 ${rkTone[r.risk]}`}>{r.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {openRow !== null && <Callout title={`Port ${openRow} · ${TABLE.find((r) => r.port === openRow)!.service}`}>{TABLE.find((r) => r.port === openRow)!.note}</Callout>}
      {scanned && (
        <div className="space-y-3 rounded-xl border border-line bg-white p-4">
          <p className="text-sm font-bold">Alıştırma: Açık {openPorts.length} servisten hangileri kapatılmalı veya güvenli alternatifle değiştirilmeli?</p>
          <div className="flex flex-wrap gap-2">
            {openPorts.map((r) => (
              <button key={r.port} type="button" onClick={() => { toggleMark(r.port); setEvald(false); }} className={`rounded-lg border px-3 py-2 text-sm font-semibold ${mark.includes(r.port) ? "border-err bg-[#F9ECEC] text-err" : "border-line bg-white"}`}>
                {mark.includes(r.port) ? "⚠ " : ""}{r.port} {r.service}
              </button>
            ))}
          </div>
          <Btn onClick={() => { setEvald(true); markLab(13); }}>Değerlendir</Btn>
          {evald && (good ? <Callout kind="ok" title="Doğru!">FTP (21) ve Telnet (23) şifresiz protokollerdir; kimlik bilgilerini açık metin taşır. SSH/SFTP ile değiştirilmeli.</Callout> : <Callout kind="err" title="Tekrar düşün">En riskli açık servisler şifresiz çalışanlardır: FTP (21) ve Telnet (23). SSH ve HTTPS şifreli olduğu için görece güvenlidir; HTTP ise HTTPS&apos;e yönlendirilmelidir.</Callout>)}
        </div>
      )}
    </LabBox>
  );
}
