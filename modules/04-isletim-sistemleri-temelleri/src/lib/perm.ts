export type FileMeta = { owner: string; group: string; mode: number };
export type Principal = { name: string; groups: string[] };
export type Op = "r" | "w" | "x";

const BIT: Record<Op, number> = { r: 4, w: 2, x: 1 };

export function symbolic(mode: number, dir = false, prefix?: string) {
  const c = (n: number) => ((n & 4) ? "r" : "-") + ((n & 2) ? "w" : "-") + ((n & 1) ? "x" : "-");
  return (prefix ?? (dir ? "d" : "-")) + c((mode >> 6) & 7) + c((mode >> 3) & 7) + c(mode & 7);
}

export function octal(mode: number) {
  return (mode & 0o777).toString(8).padStart(3, "0");
}

export function checkAccess(f: FileMeta, u: Principal, op: Op): { ok: boolean; by: "root" | "owner" | "group" | "other"; reason: string } {
  if (u.name === "root") return { ok: true, by: "root", reason: "root (yönetici) kullanıcısı tüm izin denetimlerini aşar." };
  let by: "owner" | "group" | "other";
  let bits: number;
  if (f.owner === u.name) { by = "owner"; bits = (f.mode >> 6) & 7; }
  else if (u.groups.includes(f.group)) { by = "group"; bits = (f.mode >> 3) & 7; }
  else { by = "other"; bits = f.mode & 7; }
  const ok = (bits & BIT[op]) !== 0;
  const who = by === "owner" ? "sahip (user)" : by === "group" ? `grup (${f.group})` : "diğerleri (others)";
  const name = op === "r" ? "okuma (r)" : op === "w" ? "yazma (w)" : "çalıştırma (x)";
  return {
    ok,
    by,
    reason: `${u.name} kullanıcısı bu dosya için "${who}" sınıfında. Bu sınıfın ${name} izni ${ok ? "VAR" : "YOK"} (${bits.toString(2).padStart(3, "0").replace(/0/g, "-").replace(/1/g, "x")} → ${bits}).`,
  };
}
