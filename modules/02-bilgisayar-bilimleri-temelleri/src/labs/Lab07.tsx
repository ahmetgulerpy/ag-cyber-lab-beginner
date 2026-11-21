import { useEffect, useState } from "react";
import { Play, Plus, RotateCcw, SkipForward, FastForward } from "lucide-react";
import { Btn, Card, LabShell, SimNote, Terminal, type LabProps } from "../components/ui";
import { cn } from "../utils/cn";

type State = "Ready" | "Running" | "Waiting" | "Terminated";

interface Proc {
  pid: number;
  name: string;
  total: number;
  remaining: number;
  usesIO: boolean;
  ioDone: boolean;
  waitLeft: number;
  used: number; // mevcut dilimde kullanılan süre
  state: State;
}

interface Sim {
  procs: Proc[];
  queue: number[]; // ready kuyruğu (pid)
  tick: number;
  log: string[];
  nextPid: number;
  switches: number;
}

const QUANTUM = 2;
const IO_WAIT = 3;

const init: Sim = { procs: [], queue: [], tick: 0, log: ["Simülasyon hazır. İşlem ekleyin veya örnek senaryoyu yükleyin."], nextPid: 100, switches: 0 };

function addProc(s: Sim, name: string, burst: number, io: boolean): Sim {
  const p: Proc = { pid: s.nextPid, name, total: burst, remaining: burst, usesIO: io, ioDone: false, waitLeft: 0, used: 0, state: "Ready" };
  return {
    ...s,
    procs: [...s.procs, p],
    queue: [...s.queue, p.pid],
    nextPid: s.nextPid + 1,
    log: [...s.log, `+ ${name} (PID ${p.pid}) oluşturuldu: ${burst} birim CPU süresi${io ? ", G/Ç (I/O) bekleyecek" : ""} → Ready kuyruğuna eklendi.`],
  };
}

function step(s: Sim): Sim {
  if (s.procs.every((p) => p.state === "Terminated")) return s;
  const procs = s.procs.map((p) => ({ ...p }));
  const by = (pid: number) => procs.find((p) => p.pid === pid)!;
  let queue = [...s.queue];
  const log = [...s.log];
  let switches = s.switches;
  const tick = s.tick + 1;
  log.push(`— Tik ${tick} —`);

  let running = procs.find((p) => p.state === "Running");
  if (!running && queue.length) {
    const pid = queue.shift()!;
    running = by(pid);
    running.state = "Running";
    running.used = 0;
    switches++;
    log.push(`Zamanlayıcı (scheduler): ${running.name} seçildi → Ready → Running (context switch).`);
  }

  let justBlocked = -1;
  if (running) {
    running.remaining -= 1;
    running.used += 1;
    log.push(`CPU: ${running.name} çalışıyor (kalan ${Math.max(running.remaining, 0)}).`);
    if (running.remaining <= 0) {
      running.state = "Terminated";
      log.push(`${running.name} tamamlandı → Terminated.`);
    } else if (running.usesIO && !running.ioDone) {
      running.state = "Waiting";
      running.waitLeft = IO_WAIT;
      running.ioDone = true;
      justBlocked = running.pid;
      log.push(`${running.name} disk/G-Ç bekliyor → Running → Waiting (${IO_WAIT} tik). CPU boşa çıktı.`);
    } else if (running.used >= QUANTUM) {
      running.state = "Ready";
      queue.push(running.pid);
      log.push(`${running.name} zaman dilimi (${QUANTUM}) doldu → Running → Ready (kuyruğun sonuna).`);
    }
  } else {
    log.push("CPU boşta (idle): Ready kuyruğu boş, işlemler G/Ç bekliyor.");
  }

  procs.forEach((p) => {
    if (p.state === "Waiting" && p.pid !== justBlocked) {
      p.waitLeft -= 1;
      if (p.waitLeft <= 0) {
        p.state = "Ready";
        queue.push(p.pid);
        log.push(`${p.name} G/Ç tamamlandı → Waiting → Ready.`);
      }
    }
  });

  queue = queue.filter((pid) => by(pid).state === "Ready");
  return { ...s, procs, queue, tick, log: log.slice(-60), switches };
}

const colors: Record<State, string> = {
  Ready: "border-warn/50 bg-[#fdf6e7] text-[#9a6b14]",
  Running: "border-ok/50 bg-[#eef8f2] text-ok",
  Waiting: "border-brand/30 bg-soft text-brand",
  Terminated: "border-line bg-slate-100 text-muted",
};

function Column({ title, state, procs }: { title: string; state: State; procs: Proc[] }) {
  return (
    <div className="rounded-lg border border-line bg-page p-3">
      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
        {title} ({procs.length})
      </div>
      <div className="min-h-[60px] space-y-1.5">
        {procs.length === 0 && <div className="text-xs text-muted/70">—</div>}
        {procs.map((p) => (
          <div key={p.pid} className={cn("rounded-md border px-2.5 py-1.5 text-sm", colors[state])}>
            <div className="flex justify-between font-semibold">
              <span>{p.name}</span>
              <span className="font-mono text-xs">PID {p.pid}</span>
            </div>
            <div className="text-xs opacity-80">
              {state === "Waiting" ? `G/Ç: ${p.waitLeft} tik kaldı · ` : ""}
              kalan CPU: {Math.max(p.remaining, 0)}/{p.total}
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-black/10">
              <div className="h-full bg-current" style={{ width: `${((p.total - Math.max(p.remaining, 0)) / p.total) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Lab07({ done, onComplete }: LabProps) {
  const [sim, setSim] = useState<Sim>(init);
  const [name, setName] = useState("Tarayıcı");
  const [burst, setBurst] = useState(4);
  const [io, setIo] = useState(false);

  const terminated = sim.procs.filter((p) => p.state === "Terminated").length;
  const allDone = sim.procs.length > 0 && terminated === sim.procs.length;

  useEffect(() => {
    if (terminated >= 3 && sim.switches >= 3 && !done) onComplete();
  }, [terminated, sim.switches, done, onComplete]);

  const loadSample = () => {
    let s: Sim = { ...init, log: ["Örnek senaryo yüklendi: 3 işlem."] };
    s = addProc(s, "Tarayıcı", 4, false);
    s = addProc(s, "Müzik Çalar", 3, true);
    s = addProc(s, "Belge Düzenleyici", 5, false);
    setSim(s);
  };

  const add = () => {
    const n = name.trim() || `İşlem-${sim.nextPid}`;
    setSim((s) => addProc(s, n.slice(0, 20), Math.min(10, Math.max(1, burst)), io));
  };

  const run = () => {
    setSim((s) => {
      let x = s;
      for (let i = 0; i < 5; i++) x = step(x);
      return x;
    });
  };

  const running = sim.procs.filter((p) => p.state === "Running");

  return (
    <LabShell done={done} title="Lab 07 — İşlem Yönetimi Simülatörü">
      <SimNote>
        Bu simülasyon eğitim amaçlı basitleştirilmiştir: tek çekirdekli CPU, Round Robin zamanlama (zaman dilimi = {QUANTUM} tik) ve sabit G/Ç süresi ({IO_WAIT} tik) varsayılır. Gerçek işletim sistemleri çok daha karmaşıktır.
      </SimNote>
      <Card className="space-y-4">
        <h4 className="font-semibold">1) İşlem ekle</h4>
        <div className="grid gap-3 sm:grid-cols-[1fr_120px_auto_auto] sm:items-end">
          <label className="text-sm font-semibold">
            Ad
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={20} className="mt-1 w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-accent" />
          </label>
          <label className="text-sm font-semibold">
            CPU süresi (1–10)
            <input type="number" min={1} max={10} value={burst} onChange={(e) => setBurst(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-accent" />
          </label>
          <label className="flex items-center gap-2 pb-2 text-sm font-medium">
            <input type="checkbox" checked={io} onChange={(e) => setIo(e.target.checked)} className="h-4 w-4 accent-[#176B87]" /> G/Ç bekler
          </label>
          <Btn onClick={add}>
            <Plus className="h-4 w-4" /> Ekle
          </Btn>
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn variant="secondary" onClick={loadSample}>
            <Play className="h-4 w-4" /> Örnek Senaryo Yükle
          </Btn>
          <Btn variant="ghost" onClick={() => setSim(init)}>
            <RotateCcw className="h-4 w-4" /> Sıfırla
          </Btn>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-semibold">2) CPU ve durumlar</h4>
          <div className="flex gap-4 text-sm text-muted">
            <span>
              Tik: <b className="text-ink">{sim.tick}</b>
            </span>
            <span>
              Context switch: <b className="text-ink">{sim.switches}</b>
            </span>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Column title="Ready (Hazır kuyruğu)" state="Ready" procs={sim.queue.map((id) => sim.procs.find((p) => p.pid === id)!).filter(Boolean)} />
          <Column title="Running (CPU)" state="Running" procs={running} />
          <Column title="Waiting (G/Ç)" state="Waiting" procs={sim.procs.filter((p) => p.state === "Waiting")} />
          <Column title="Terminated" state="Terminated" procs={sim.procs.filter((p) => p.state === "Terminated")} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn onClick={() => setSim(step)} disabled={sim.procs.length === 0 || allDone}>
            <SkipForward className="h-4 w-4" /> 1 Adım İlerlet
          </Btn>
          <Btn variant="secondary" onClick={run} disabled={sim.procs.length === 0 || allDone}>
            <FastForward className="h-4 w-4" /> 5 Adım
          </Btn>
        </div>
        {allDone && <p className="text-sm font-semibold text-ok">Tüm işlemler tamamlandı. Yeni işlem ekleyerek devam edebilirsin.</p>}
        <Terminal title="scheduler.log">
          <div className="max-h-56 overflow-y-auto scroll-thin">
            {sim.log.map((l, i) => (
              <div key={i} className={l.startsWith("—") ? "mt-1 text-[#8fd3d4]" : ""}>
                {l}
              </div>
            ))}
          </div>
        </Terminal>
        <p className="text-xs text-muted">
          Tamamlanma koşulu: en az 3 işlem Terminated olmalı ve en az 3 context switch gözlemlenmeli. (Şu an: {terminated} işlem, {sim.switches} switch)
        </p>
      </Card>
    </LabShell>
  );
}
