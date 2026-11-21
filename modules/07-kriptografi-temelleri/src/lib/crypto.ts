// AG CYBER LAB – Modül 07: Tarayıcı içi kriptografi yardımcıları (Web Crypto API + yerel MD5)
export type Bytes = Uint8Array<ArrayBuffer>;

const te = new TextEncoder();
const td = new TextDecoder();

export function utf8(s: string): Bytes {
  return te.encode(s);
}
export function fromUtf8(b: Uint8Array): string {
  return td.decode(b);
}
export function toHex(b: Uint8Array): string {
  let s = "";
  for (let i = 0; i < b.length; i++) s += b[i].toString(16).padStart(2, "0");
  return s;
}
export function fromHex(h: string): Bytes {
  const clean = h.replace(/\s+/g, "");
  const out = new Uint8Array(Math.floor(clean.length / 2));
  for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.substr(i * 2, 2), 16);
  return out;
}
export function toB64(b: Uint8Array): string {
  let s = "";
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  return btoa(s);
}
export function fromB64(s: string): Bytes {
  const bin = atob(s.replace(/\s+/g, ""));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
export function randomBytes(n: number): Bytes {
  return crypto.getRandomValues(new Uint8Array(n));
}
export function concat(a: Uint8Array, b: Uint8Array): Bytes {
  const out = new Uint8Array(a.length + b.length);
  out.set(a, 0);
  out.set(b, a.length);
  return out;
}
export function xorBytes(a: Uint8Array, b: Uint8Array): Bytes {
  const n = Math.min(a.length, b.length);
  const out = new Uint8Array(n);
  for (let i = 0; i < n; i++) out[i] = a[i] ^ b[i];
  return out;
}
export function pem(label: string, der: Uint8Array): string {
  const b64 = toB64(der);
  const lines = b64.match(/.{1,64}/g) ?? [];
  return `-----BEGIN ${label}-----\n${lines.join("\n")}\n-----END ${label}-----`;
}

// ---------- Hash ----------
export type ShaAlg = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";
export async function sha(alg: ShaAlg, data: Uint8Array): Promise<string> {
  const d = await crypto.subtle.digest(alg, data as Bytes);
  return toHex(new Uint8Array(d));
}
export async function shaText(alg: ShaAlg, text: string): Promise<string> {
  return sha(alg, utf8(text));
}

/** Gerçek MD5 uygulaması (RFC 1321). Web Crypto MD5'i desteklemediği için yerel olarak hesaplanır. */
export function md5(data: Uint8Array): string {
  const K = new Int32Array(64);
  for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) | 0;
  const S = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];
  const len = data.length;
  const padLen = (((len + 8) >> 6) + 1) << 6;
  const buf = new Uint8Array(padLen);
  buf.set(data);
  buf[len] = 0x80;
  const dv = new DataView(buf.buffer);
  dv.setUint32(padLen - 8, (len * 8) >>> 0, true);
  dv.setUint32(padLen - 4, Math.floor((len * 8) / 4294967296), true);
  let a0 = 0x67452301 | 0,
    b0 = 0xefcdab89 | 0,
    c0 = 0x98badcfe | 0,
    d0 = 0x10325476 | 0;
  const M = new Int32Array(16);
  for (let off = 0; off < padLen; off += 64) {
    for (let j = 0; j < 16; j++) M[j] = dv.getInt32(off + j * 4, true);
    let A = a0,
      B = b0,
      C = c0,
      D = d0;
    for (let i = 0; i < 64; i++) {
      let F: number, g: number;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }
      F = (F + A + K[i] + M[g]) | 0;
      A = D;
      D = C;
      C = B;
      B = (B + ((F << S[i]) | (F >>> (32 - S[i])))) | 0;
    }
    a0 = (a0 + A) | 0;
    b0 = (b0 + B) | 0;
    c0 = (c0 + C) | 0;
    d0 = (d0 + D) | 0;
  }
  const out = new Uint8Array(16);
  const odv = new DataView(out.buffer);
  odv.setInt32(0, a0, true);
  odv.setInt32(4, b0, true);
  odv.setInt32(8, c0, true);
  odv.setInt32(12, d0, true);
  return toHex(out);
}

/** İki hex dizesi arasındaki farklı bit sayısı ve farklı karakter konumları */
export function hexDiff(a: string, b: string) {
  const n = Math.min(a.length, b.length);
  const diffPos: boolean[] = [];
  let bits = 0;
  for (let i = 0; i < n; i++) {
    const x = parseInt(a[i], 16) ^ parseInt(b[i], 16);
    diffPos.push(x !== 0);
    let v = x;
    while (v) {
      bits += v & 1;
      v >>= 1;
    }
  }
  return { diffPos, bits, totalBits: n * 4, chars: diffPos.filter(Boolean).length };
}

// ---------- AES-GCM ----------
export async function aesGenerate(bits: 128 | 256): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: bits }, true, ["encrypt", "decrypt"]);
}
export async function aesExportHex(key: CryptoKey): Promise<string> {
  return toHex(new Uint8Array(await crypto.subtle.exportKey("raw", key)));
}
export async function aesEncrypt(key: CryptoKey, plain: string, iv: Uint8Array = randomBytes(12)) {
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv as Bytes }, key, utf8(plain)));
  return { iv: iv as Bytes, ct };
}
export async function aesDecrypt(key: CryptoKey, iv: Uint8Array, ct: Uint8Array): Promise<string> {
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv as Bytes }, key, ct as Bytes);
  return fromUtf8(new Uint8Array(pt));
}
/** Paroladan PBKDF2 ile AES-256-GCM anahtarı türetir (Ders 2 laboratuvarı için) */
export async function aesKeyFromPassphrase(pass: string, salt: Uint8Array, iterations = 100000): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey("raw", utf8(pass), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as Bytes, iterations, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
}

// ---------- RSA ----------
export async function rsaOaepGenerate(bits = 2048): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(
    { name: "RSA-OAEP", modulusLength: bits, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true,
    ["encrypt", "decrypt"],
  );
}
export async function rsaPssGenerate(bits = 2048): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(
    { name: "RSA-PSS", modulusLength: bits, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true,
    ["sign", "verify"],
  );
}
export async function exportPublicPem(k: CryptoKey): Promise<string> {
  return pem("PUBLIC KEY", new Uint8Array(await crypto.subtle.exportKey("spki", k)));
}
export async function exportPrivatePem(k: CryptoKey): Promise<string> {
  return pem("PRIVATE KEY", new Uint8Array(await crypto.subtle.exportKey("pkcs8", k)));
}
export async function rsaEncrypt(pub: CryptoKey, text: string): Promise<Bytes> {
  return new Uint8Array(await crypto.subtle.encrypt({ name: "RSA-OAEP" }, pub, utf8(text)));
}
export async function rsaDecrypt(priv: CryptoKey, ct: Uint8Array): Promise<string> {
  return fromUtf8(new Uint8Array(await crypto.subtle.decrypt({ name: "RSA-OAEP" }, priv, ct as Bytes)));
}
export async function pssSign(priv: CryptoKey, text: string): Promise<Bytes> {
  return new Uint8Array(await crypto.subtle.sign({ name: "RSA-PSS", saltLength: 32 }, priv, utf8(text)));
}
export async function pssVerify(pub: CryptoKey, sig: Uint8Array, text: string): Promise<boolean> {
  return crypto.subtle.verify({ name: "RSA-PSS", saltLength: 32 }, pub, sig as Bytes, utf8(text));
}

// ---------- PBKDF2 ----------
export async function pbkdf2Hex(password: string, salt: Uint8Array, iterations: number): Promise<string> {
  const base = await crypto.subtle.importKey("raw", utf8(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: salt as Bytes, iterations, hash: "SHA-256" }, base, 256);
  return toHex(new Uint8Array(bits));
}

// ---------- Klasik şifreler (Türkçe alfabe, 29 harf) ----------
export const TR_ALPHABET = "abcçdefgğhıijklmnoöprsştuüvyz";
function shiftChar(ch: string, shift: number): string {
  const lower = ch.toLocaleLowerCase("tr");
  const idx = TR_ALPHABET.indexOf(lower);
  if (idx < 0 || lower.length !== 1) return ch;
  const n = TR_ALPHABET.length;
  const out = TR_ALPHABET[(((idx + shift) % n) + n) % n];
  return ch !== lower ? out.toLocaleUpperCase("tr") : out;
}
export function caesar(text: string, shift: number, decrypt = false): string {
  const s = decrypt ? -shift : shift;
  return Array.from(text).map((c) => shiftChar(c, s)).join("");
}
export function vigenere(text: string, key: string, decrypt = false): string {
  const ks = Array.from(key.toLocaleLowerCase("tr")).map((c) => TR_ALPHABET.indexOf(c)).filter((i) => i >= 0);
  if (ks.length === 0) return text;
  let j = 0;
  return Array.from(text)
    .map((c) => {
      if (TR_ALPHABET.indexOf(c.toLocaleLowerCase("tr")) < 0) return c;
      const k = ks[j++ % ks.length];
      return shiftChar(c, decrypt ? -k : k);
    })
    .join("");
}

// ---------- TOTP (RFC 6238) ----------
const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
export function base32Encode(b: Uint8Array): string {
  let bits = 0,
    value = 0,
    out = "";
  for (let i = 0; i < b.length; i++) {
    value = (value << 8) | b[i];
    bits += 8;
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  return out;
}
export async function totp(secret: Uint8Array, timeMs: number, step = 30, digits = 6): Promise<string> {
  const counter = Math.floor(timeMs / 1000 / step);
  const msg = new Uint8Array(8);
  const dv = new DataView(msg.buffer);
  dv.setUint32(0, Math.floor(counter / 4294967296));
  dv.setUint32(4, counter >>> 0);
  const key = await crypto.subtle.importKey("raw", secret as Bytes, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const h = new Uint8Array(await crypto.subtle.sign("HMAC", key, msg));
  const off = h[h.length - 1] & 0xf;
  const bin = ((h[off] & 0x7f) << 24) | (h[off + 1] << 16) | (h[off + 2] << 8) | h[off + 3];
  return String(bin % 10 ** digits).padStart(digits, "0");
}

export function errMsg(e: unknown): string {
  if (e instanceof DOMException) return `${e.name}${e.message ? ": " + e.message : ""}`;
  if (e instanceof Error) return e.message;
  return String(e);
}
