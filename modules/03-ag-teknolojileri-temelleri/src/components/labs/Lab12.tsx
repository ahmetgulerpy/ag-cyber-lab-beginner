"use client";

import { useMemo, useState } from "react";
import { Btn, Callout, LabBox, StepControls, useStepper } from "@/components/ui";
import { SeqDiagram, type SeqMsg } from "@/components/Seq";
import { markLab } from "@/lib/storage";

const lossy = (i: number, pct: number) => (i * 37 + 53) % 100 < pct;

function build(mode: "tcp" | "udp", n: number, pct: number) {
  const msgs: SeqMsg[] = [];
  let lost = 0;
  if (mode === "tcp") {
    msgs.push({ from: 0, to: 1, label: "SYN", sub: "seq=100 · bağlanmak istiyorum", tone: "brand" });
    msgs.push({ from: 1, to: 0, label: "SYN-ACK", sub: "seq=300, ack=101 · hazırım", tone: "ok" });
    msgs.push({ from: 0, to: 1, label: "ACK", sub: "ack=301 · bağlantı kuruldu", tone: "ok" });
    for (let i = 1; i <= n; i++) {
      if (lossy(i - 1, pct)) {
        lost++;
        msgs.push({ from: 0, to: 1, label: `Veri #${i}`, sub: "ağda kayboldu", lost: true });
        msgs.push({ from: 0, to: 0, label: `Zaman aşımı #${i}`, sub: "ACK gelmedi", tone: "warn" });
        msgs.push({ from: 0, to: 1, label: `Veri #${i} (tekrar)`, sub: "yeniden iletim", tone: "warn" });
      } else msgs.push({ from: 0, to: 1, label: `Veri #${i}`, tone: "brand" });
      msgs.push({ from: 1, to: 0, label: `ACK #${i}`, sub: "alındı", tone: "ok" });
    }
    msgs.push({ from: 0, to: 1, label: "FIN", sub: "bağlantıyı kapat", tone: "brand" });
    msgs.push({ from: 1, to: 0, label: "FIN-ACK", sub: "kapatıldı", tone: "ok" });
  } else {
    for (let i = 1; i <= n; i++) {
      if (lossy(i - 1, pct)) {
        lost++;
        msgs.push({ from: 0, to: 1, label: `Datagram #${i}`, sub: "ağda kayboldu · yeniden gönderilmez", lost: true });
      } else msgs.push({ from: 0, to: 1, label: `Datagram #${i}`, sub: "gönder ve unut", tone: "brand" });
    }
  }
  const delivered = mode === "tcp" ? n : n - lost;
  const time = mode === "tcp" ? 75 + n * 50 + lost * 200 : 25 + n * 5;
  return { msgs, lost, delivered, time, count: msgs.length };
}

export default function Lab12() {
  const [n, setN] = useState(5);
  const [pct, setPct] = useState(30);
  const [mode, setMode] = useState<"tcp" | "udp">("tcp");
  const [ran, setRan] = useState<"tcp" | "udp" | null>(null);
  const tcp = useMemo(() => build("tcp", n, pct), [n, pct]);
  const udp = useMemo(() => build("udp", n, pct), [n, pct]);
  const cur = ran === "tcp" ? tcp : udp;
  const s = useStepper(cur.msgs.length, 650);

  const start = (m: "tcp" | "udp") => {
    setMode(m);
    setRan(m);
    s.reset();
    setTimeout(() => s.play(), 50);
    markLab(12);
  };

  const finished = ran && s.step >= cur.msgs.length;

  return (
    <LabBox title="TCP / UDP Veri İletim Simülatörü">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold">Gönderilecek paket sayısı: <b className="text-brand">{n}</b>
          <input type="range" min={3} max={6} value={n} onChange={(e) => { setN(Number(e.target.value)); setRan(null); s.reset(); }} className="mt-2 w-full accent-[#176B87]" />
        </label>
        <label className="text-sm font-semibold">Ağdaki paket kaybı: <b className="text-brand">%{pct}</b>
          <input type="range" min={0} max={50} step={10} value={pct} onChange={(e) => { setPct(Number(e.target.value)); setRan(null); s.reset(); }} className="mt-2 w-full accent-[#176B87]" />
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <Btn variant={mode === "tcp" ? "primary" : "soft"} onClick={() => start("tcp")}>▶ TCP ile Gönder</Btn>
        <Btn variant={mode === "udp" ? "primary" : "soft"} onClick={() => start("udp")}>▶ UDP ile Gönder</Btn>
      </div>
      {ran && (
        <div className="space-y-3">
          <StepControls s={s} total={cur.msgs.length} />
          <SeqDiagram actors={["İstemci", "Sunucu"]} msgs={cur.msgs} visible={s.step} rowH={46} />
          {ran === "tcp" && s.step > 0 && s.step <= 3 && <Callout title="Üçlü el sıkışma (Three-Way Handshake)">{["SYN: İstemci bağlantı ister ve başlangıç sıra numarasını bildirir.", "SYN-ACK: Sunucu isteği kabul eder, kendi sıra numarasını gönderir.", "ACK: İstemci onaylar. Bağlantı kuruldu; veri iletimi başlayabilir."][s.step - 1]}</Callout>}
          {ran === "udp" && s.step === 1 && <Callout title="Bağlantısız iletişim">UDP&apos;de el sıkışma yoktur: istemci doğrudan veri göndermeye başlar. Sunucu onay göndermez.</Callout>}
        </div>
      )}
      {finished && (
        <Callout kind={ran === "tcp" || cur.lost === 0 ? "ok" : "warn"} title="Sonuç">
          {ran === "tcp" ? `TCP: ${cur.lost} kayıp paket yeniden gönderildi, ${n}/${n} paket teslim edildi.` : cur.lost ? `UDP: ${cur.lost} paket kaybolduğu için yalnızca ${cur.delivered}/${n} paket teslim edildi. Kayıp geri getirilmedi.` : "UDP: bu kayıp oranında tüm paketler ulaştı; ancak bu bir garanti değildir."}
        </Callout>
      )}
      <div className="overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full min-w-[460px] text-sm">
          <thead className="bg-soft text-left text-brand"><tr><th className="p-2">Karşılaştırma ({n} paket, %{pct} kayıp)</th><th className="p-2">TCP</th><th className="p-2">UDP</th></tr></thead>
          <tbody className="divide-y divide-line">
            <tr><td className="p-2 font-semibold">Bağlantı kurma</td><td className="p-2">Var (3 mesaj)</td><td className="p-2">Yok</td></tr>
            <tr><td className="p-2 font-semibold">Toplam mesaj sayısı</td><td className="p-2">{tcp.count}</td><td className="p-2">{udp.count}</td></tr>
            <tr><td className="p-2 font-semibold">Teslim edilen</td><td className="p-2 font-bold text-ok">{tcp.delivered}/{n}</td><td className={`p-2 font-bold ${udp.delivered < n ? "text-err" : "text-ok"}`}>{udp.delivered}/{n}</td></tr>
            <tr><td className="p-2 font-semibold">Tahmini süre (basit model)</td><td className="p-2">{tcp.time} ms</td><td className="p-2">{udp.time} ms</td></tr>
            <tr><td className="p-2 font-semibold">Uygun kullanım</td><td className="p-2">Web, e-posta, dosya</td><td className="p-2">Canlı yayın, oyun, DNS</td></tr>
          </tbody>
        </table>
      </div>
    </LabBox>
  );
}
