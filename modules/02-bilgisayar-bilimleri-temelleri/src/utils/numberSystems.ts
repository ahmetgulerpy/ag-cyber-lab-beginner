export type Mode = "dec-bin" | "bin-dec" | "dec-hex" | "hex-dec" | "bin-hex" | "hex-bin";

export const modes: { id: Mode; label: string; placeholder: string; example: string }[] = [
  { id: "dec-bin", label: "Decimal → Binary", placeholder: "örn. 156", example: "156" },
  { id: "bin-dec", label: "Binary → Decimal", placeholder: "örn. 10011100", example: "10011100" },
  { id: "dec-hex", label: "Decimal → Hexadecimal", placeholder: "örn. 255", example: "255" },
  { id: "hex-dec", label: "Hexadecimal → Decimal", placeholder: "örn. 2F", example: "2F" },
  { id: "bin-hex", label: "Binary → Hexadecimal", placeholder: "örn. 10101100", example: "10101100" },
  { id: "hex-bin", label: "Hexadecimal → Binary", placeholder: "örn. A3", example: "A3" },
];

export interface ConvResult {
  ok: boolean;
  error?: string;
  result?: string;
  steps: string[];
}

const HEX = "0123456789ABCDEF";

export function decToBase(n: number, base: number): string {
  if (n === 0) return "0";
  let s = "";
  let x = n;
  while (x > 0) {
    s = HEX[x % base] + s;
    x = Math.floor(x / base);
  }
  return s;
}

export function parseBase(s: string, base: number): number {
  let n = 0;
  for (const ch of s.toUpperCase()) n = n * base + HEX.indexOf(ch);
  return n;
}

function divisionSteps(n: number, base: number): string[] {
  if (n === 0) return [`0 ÷ ${base} = 0  kalan 0`];
  const lines: string[] = [];
  let x = n;
  while (x > 0) {
    const q = Math.floor(x / base);
    const r = x % base;
    lines.push(`${x} ÷ ${base} = ${q}  kalan ${r}${base === 16 && r > 9 ? ` (${HEX[r]})` : ""}`);
    x = q;
  }
  return lines;
}

export function convert(mode: Mode, raw: string): ConvResult {
  const input = raw.trim().replace(/[\s_]/g, "");
  if (!input) return { ok: false, error: "Lütfen bir değer gir.", steps: [] };
  const from = mode.split("-")[0] as "dec" | "bin" | "hex";

  let clean = input;
  if (from === "hex") clean = clean.replace(/^0x/i, "");
  if (from === "bin") clean = clean.replace(/^0b/i, "");

  const pattern = { dec: /^\d+$/, bin: /^[01]+$/, hex: /^[0-9a-f]+$/i }[from];
  if (!clean || !pattern.test(clean)) {
    const msg = {
      dec: "Decimal giriş yalnızca 0–9 rakamlarından oluşmalıdır.",
      bin: "Binary giriş yalnızca 0 ve 1'den oluşmalıdır.",
      hex: "Hexadecimal giriş yalnızca 0–9 ve A–F karakterlerinden oluşmalıdır.",
    }[from];
    return { ok: false, error: msg, steps: [] };
  }
  const maxLen = { dec: 15, bin: 48, hex: 12 }[from];
  if (clean.length > maxLen) return { ok: false, error: `Bu araç için en fazla ${maxLen} karakter girebilirsin.`, steps: [] };

  const steps: string[] = [];
  const baseOf = { dec: 10, bin: 2, hex: 16 };
  const n = parseBase(clean, baseOf[from]);

  if (mode === "dec-bin") {
    steps.push(`${n} sayısı sürekli 2'ye bölünür; kalanlar son bölmeden ilkine doğru (aşağıdan yukarı) okunur.`);
    steps.push(...divisionSteps(n, 2));
    const r = decToBase(n, 2);
    steps.push(`Kalanlar aşağıdan yukarı: ${r}`);
    return { ok: true, result: r, steps };
  }
  if (mode === "dec-hex") {
    steps.push(`${n} sayısı sürekli 16'ya bölünür; kalanlar (10–15 → A–F) aşağıdan yukarı okunur.`);
    steps.push(...divisionSteps(n, 16));
    const r = decToBase(n, 16);
    steps.push(`Kalanlar aşağıdan yukarı: ${r}`);
    return { ok: true, result: r, steps };
  }
  if (mode === "bin-dec") {
    steps.push("Her bitin basamak değeri (2'nin kuvveti) bulunur; yalnızca 1 olan bitler toplanır.");
    const len = clean.length;
    const parts: string[] = [];
    [...clean].forEach((b, i) => {
      const pos = len - 1 - i;
      steps.push(`${b} × 2^${pos} = ${b === "1" ? 2 ** pos : 0}`);
      if (b === "1") parts.push(String(2 ** pos));
    });
    steps.push(`Toplam: ${parts.length ? parts.join(" + ") : "0"} = ${n}`);
    return { ok: true, result: String(n), steps };
  }
  if (mode === "hex-dec") {
    steps.push("Her hex rakam 16'nın kuvvetiyle çarpılır ve sonuçlar toplanır (A=10, B=11, C=12, D=13, E=14, F=15).");
    const len = clean.length;
    const parts: number[] = [];
    [...clean.toUpperCase()].forEach((c, i) => {
      const pos = len - 1 - i;
      const v = HEX.indexOf(c);
      const val = v * 16 ** pos;
      parts.push(val);
      steps.push(`${c} (${v}) × 16^${pos} = ${val}`);
    });
    steps.push(`Toplam: ${parts.join(" + ")} = ${n}`);
    return { ok: true, result: String(n), steps };
  }
  if (mode === "bin-hex") {
    const padded = clean.padStart(Math.ceil(clean.length / 4) * 4, "0");
    steps.push("Binary sayı sağdan sola 4'lü gruplara ayrılır (gerekirse başa 0 eklenir). Her grup tek bir hex rakamdır.");
    const groups = padded.match(/.{4}/g) ?? [];
    const digits = groups.map((g) => {
      const d = HEX[parseInt(g, 2)];
      steps.push(`${g} = ${parseInt(g, 2)} → ${d}`);
      return d;
    });
    const r = digits.join("");
    steps.push(`Birleşim: ${r}`);
    return { ok: true, result: r, steps };
  }
  // hex-bin
  steps.push("Her hex rakam 4 bitlik binary karşılığına çevrilir.");
  const groups = [...clean.toUpperCase()].map((c) => {
    const g = HEX.indexOf(c).toString(2).padStart(4, "0");
    steps.push(`${c} = ${HEX.indexOf(c)} → ${g}`);
    return g;
  });
  steps.push(`Birleşim: ${groups.join(" ")}`);
  return { ok: true, result: groups.join(" "), steps };
}

export function selfTest(): boolean {
  return (
    convert("dec-bin", "156").result === "10011100" &&
    convert("bin-dec", "10011100").result === "156" &&
    convert("dec-hex", "255").result === "FF" &&
    convert("hex-dec", "2F").result === "47" &&
    convert("bin-hex", "10101100").result === "AC" &&
    convert("hex-bin", "A3").result === "1010 0011"
  );
}
