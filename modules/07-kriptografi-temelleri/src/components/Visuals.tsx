"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button, Pill, cx } from "@/components/ui";
import { randomBytes, shaText, toHex } from "@/lib/crypto";

type Node = { icon: string; title: string; sub: string; detail: string; tone?: "brand" | "ok" | "bad" | "warn" };

function FlowDiagram({ nodes, vertical }: { nodes: Node[]; vertical?: boolean }) {
  const [sel, setSel] = useState(0);
  const toneCls = (t?: string, active?: boolean) =>
    active ? "border-brand bg-white ring-2 ring-accent/40" : t === "bad" ? "border-bad/40 bg-[#FDF5F5]" : t === "ok" ? "border-ok/40 bg-[#F1F8F4]" : t === "warn" ? "border-warn/50 bg-[#FDF8EC]" : "border-line bg-white hover:border-brand";
  return (
    <div className="space-y-4">
      <div className={cx("flex items-stretch gap-2", vertical ? "flex-col" : "flex-col sm:flex-row")}>
        {nodes.map((n, i) => (
          <div key={i} className={cx("flex items-center gap-2", vertical ? "flex-col" : "flex-col sm:flex-row", "sm:flex-1")}>
            <button type="button" onClick={() => setSel(i)} className={cx("w-full flex-1 rounded-xl border p-3 text-center transition-colors", toneCls(n.tone, sel === i))}>
              <span className="block text-2xl" aria-hidden>
                {n.icon}
              </span>
              <b className="block text-sm text-ink">{n.title}</b>
              <span className="block text-xs text-muted">{n.sub}</span>
            </button>
            {i < nodes.length - 1 && <span className={cx("text-xl text-accent", vertical ? "" : "rotate-90 sm:rotate-0")}>→</span>}
          </div>
        ))}
      </div>
      <div className="fadeup rounded-xl border border-brand/20 bg-soft p-4 text-sm text-ink" key={sel}>
        <b className="mr-1 text-brand">
          {nodes[sel].icon} {nodes[sel].title}:
        </b>
        {nodes[sel].detail}
      </div>
    </div>
  );
}

function V1() {
  return (
    <FlowDiagram
      nodes={[
        { icon: "📄", title: "Açık metin", sub: "Merhaba", detail: "Okunabilir özgün veri (plaintext). Örnek: 'Merhaba'. Bu aşamada herkes okuyabilir." },
        { icon: "🔒", title: "Şifreleme", sub: "algoritma + anahtar", detail: "Algoritma ve anahtar açık metni dönüştürür. Caesar şifresinde anahtar 3 ise her harf 3 ileri kayar." },
        { icon: "🔣", title: "Şifreli metin", sub: "Öğtjçdç (anahtar=3)", detail: "Anahtarı bilmeyen için anlamsızdır (ciphertext). Güvenli olmayan ortamdan (İnternet) geçebilir.", tone: "warn" },
        { icon: "🔓", title: "Şifre çözme", sub: "algoritma + anahtar", detail: "Doğru anahtarla işlem tersine çevrilir: her harf 3 geri kaydırılır." },
        { icon: "📄", title: "Açık metin", sub: "Merhaba", detail: "Alıcı özgün mesajı elde eder. Yanlış anahtar kullanılırsa bu aşamada anlamsız metin çıkar.", tone: "ok" },
      ]}
    />
  );
}
function V2() {
  return (
    <FlowDiagram
      nodes={[
        { icon: "📄", title: "Plaintext", sub: "açık metin", detail: "Korunmak istenen veri: mesaj, dosya, parola..." },
        { icon: "⚙️", title: "Algoritma", sub: "AES, Vigenère...", detail: "Herkesin bildiği yöntem. Saldırgan algoritmayı biliyor varsayılır (Kerckhoffs ilkesi)." },
        { icon: "🗝️", title: "Anahtar", sub: "gizli değer", detail: "Tek gizli parça. Uzun, rastgele ve korunmuş olmalıdır. Sızarsa tüm sistem çöker.", tone: "warn" },
        { icon: "🔣", title: "Ciphertext", sub: "şifreli metin", detail: "Ağ üzerinde gezen veri. Saldırgan bunu görebilir ama anahtarsız çözemez." },
        { icon: "🔓", title: "Decryption", sub: "doğru anahtarla", detail: "Alıcı aynı algoritma + doğru anahtarla çözer. Yanlış anahtar anlamsız çıktı verir veya (AES-GCM) hata ile reddedilir.", tone: "ok" },
      ]}
    />
  );
}
function V3() {
  return (
    <div className="space-y-4">
      <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-xl border border-line bg-white p-4 text-center">
          <p className="text-3xl">👩</p>
          <b className="text-sm">Gönderen (Alice)</b>
          <p className="mt-1 rounded-lg bg-[#FDF8EC] p-1.5 text-xs">🗝️ Gizli anahtar K</p>
          <p className="mt-1 text-xs text-muted">Şifreler: C = AES-GCM(K, mesaj)</p>
        </div>
        <div className="text-center text-xs text-muted">
          <p className="rounded-lg border border-dashed border-line px-3 py-2">🔣 şifreli veri → ağ</p>
          <p className="mt-1 text-bad">👁️ saldırgan sadece bunu görür</p>
        </div>
        <div className="rounded-xl border border-line bg-white p-4 text-center">
          <p className="text-3xl">👨</p>
          <b className="text-sm">Alıcı (Bob)</b>
          <p className="mt-1 rounded-lg bg-[#FDF8EC] p-1.5 text-xs">🗝️ AYNI gizli anahtar K</p>
          <p className="mt-1 text-xs text-muted">Çözer: mesaj = AES-GCM⁻¹(K, C)</p>
        </div>
      </div>
      <div className="rounded-xl border border-warn/50 bg-[#FDF8EC] p-3 text-sm">
        <b>❓ Anahtar paylaşımı sorunu:</b> K&apos;yı Bob&apos;a ağdan düz metin gönderirsen saldırgan da alır. Çözüm: K&apos;yı asimetrik şifreleme ile iletmek (Ders 4) veya yüz yüze/güvenli kanaldan paylaşmak.
      </div>
    </div>
  );
}
function V4() {
  return (
    <FlowDiagram
      nodes={[
        { icon: "🧑", title: "Bob anahtar çifti üretir", sub: "Public + Private", detail: "Bob matematiksel olarak bağlı iki anahtar üretir. Private Key cihazında kalır." },
        { icon: "📢", title: "Public Key paylaşılır", sub: "herkese açık", detail: "Bob Public Key'ini web sitesinde/sertifikada yayınlar. Saldırgan görse de zarar vermez.", tone: "ok" },
        { icon: "🔒", title: "Alice şifreler", sub: "Bob'un Public Key'i", detail: "Alice mesajı Bob'un Public Key'i ile şifreler. Alice bile geri çözemez." },
        { icon: "📡", title: "Şifreli veri gider", sub: "ağ", detail: "Saldırgan Public Key'i ve şifreli veriyi görebilir ama Private Key olmadan çözemez." },
        { icon: "🔓", title: "Bob çözer", sub: "Bob'un Private Key'i", detail: "Yalnızca Bob'un Private Key'i mesajı açar. Private Key asla paylaşılmaz.", tone: "bad" },
      ]}
    />
  );
}
function V5() {
  const [text, setText] = useState("Merhaba");
  const [h, setH] = useState("");
  useEffect(() => {
    let alive = true;
    shaText("SHA-256", text).then((x) => alive && setH(x));
    return () => {
      alive = false;
    };
  }, [text]);
  return (
    <div className="space-y-4">
      <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1.4fr]">
        <div className="rounded-xl border border-line bg-white p-3">
          <p className="mb-1 text-xs font-semibold uppercase text-muted">Girdi (herhangi uzunlukta)</p>
          <textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-20 w-full rounded-lg border border-line p-2 text-sm" />
          <p className="text-xs text-muted">{new TextEncoder().encode(text).length} bayt</p>
        </div>
        <div className="grid place-items-center">
          <div className="rounded-xl bg-brand px-4 py-3 text-center text-sm font-semibold text-white">
            #️⃣ SHA-256
            <span className="block text-[10px] font-normal opacity-80">tek yönlü</span>
          </div>
        </div>
        <div className="rounded-xl border border-ok/40 bg-[#F1F8F4] p-3">
          <p className="mb-1 text-xs font-semibold uppercase text-muted">Çıktı (hep 256 bit)</p>
          <p className="hexbox">{h}</p>
          <div className="mt-2 flex gap-2">
            <Pill tone="ok">{h.length} hex karakter</Pill>
            <Pill tone="brand">256 bit</Pill>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted">Girdiyi kısaltıp uzat: çıktı uzunluğu değişmez. Tek harf değiştir: çıktı tamamen değişir.</p>
    </div>
  );
}
function V6() {
  const rows = [
    { n: "MD5", b: 128, s: "Kırık", c: "bg-bad" },
    { n: "SHA-1", b: 160, s: "Kırık", c: "bg-bad" },
    { n: "SHA-256", b: 256, s: "Güvenli", c: "bg-ok" },
    { n: "SHA-512", b: 512, s: "Güvenli", c: "bg-ok" },
  ];
  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.n} className="grid grid-cols-[80px_1fr_70px] items-center gap-3 text-sm">
          <b>{r.n}</b>
          <div className="h-6 overflow-hidden rounded-md bg-line">
            <div className={cx("flex h-full items-center px-2 text-xs text-white", r.c)} style={{ width: `${(r.b / 512) * 100}%` }}>
              {r.b} bit ({r.b / 4} hex)
            </div>
          </div>
          <Pill tone={r.s === "Güvenli" ? "ok" : "bad"}>{r.s}</Pill>
        </div>
      ))}
      <p className="text-xs text-muted">Çubuk uzunluğu çıktı boyutunu gösterir. Ayrıntılı karşılaştırma tablosu aşağıdaki &quot;Detaylı konu açıklamaları&quot; bölümünde yer alır.</p>
    </div>
  );
}
function V7() {
  const [data, setData] = useState<null | { plain: string; salted: { salt: string; h: string }[] }>(null);
  const gen = async () => {
    const pw = "Merhaba123";
    const salted = await Promise.all(
      [0, 1].map(async () => {
        const salt = toHex(randomBytes(8));
        return { salt, h: await shaText("SHA-256", salt + pw) };
      }),
    );
    setData({ plain: await shaText("SHA-256", pw), salted });
  };
  useEffect(() => {
    gen();
  }, []);
  return (
    <div className="space-y-3">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-bad/40 bg-[#FDF5F5] p-3">
          <p className="mb-2 text-sm font-semibold text-bad">❌ Salt kullanılmayan</p>
          <p className="text-xs text-muted">hash = SHA-256(parola)</p>
          {["ayse", "mehmet"].map((u) => (
            <p key={u} className="mt-2 rounded-lg bg-white p-2 text-xs">
              <b>{u}</b> (parola: Merhaba123)
              <span className="hexbox mt-1 block text-bad">{data?.plain.slice(0, 32)}…</span>
            </p>
          ))}
          <p className="mt-2 text-xs text-bad">İki hash aynı → bir kırılırsa ikisi de kırılır; rainbow table işe yarar.</p>
        </div>
        <div className="rounded-xl border border-ok/40 bg-[#F1F8F4] p-3">
          <p className="mb-2 text-sm font-semibold text-ok">✅ Salt kullanılan</p>
          <p className="text-xs text-muted">hash = SHA-256(salt + parola)</p>
          {["ayse", "mehmet"].map((u, i) => (
            <p key={u} className="mt-2 rounded-lg bg-white p-2 text-xs">
              <b>{u}</b> (parola: Merhaba123)
              <span className="hexbox block text-muted">salt: {data?.salted[i].salt}</span>
              <span className="hexbox block text-ok">{data?.salted[i].h.slice(0, 32)}…</span>
            </p>
          ))}
          <p className="mt-2 text-xs text-ok">Aynı parola, farklı hash → toplu kırma ve hazır tablolar engellenir.</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={gen}>
          Yeni rastgele salt&apos;lar üret
        </Button>
        <span className="text-xs text-muted">Gösterim SHA-256 ile gerçek hesaplanır; gerçek sistemde PBKDF2/Argon2 kullanılır.</span>
      </div>
    </div>
  );
}
function V8() {
  return (
    <FlowDiagram
      nodes={[
        { icon: "✉️", title: "Mesaj", sub: "açık, okunabilir", detail: "İmzalanacak veri. İmza mesajı gizlemez; mesaj açık kalır." },
        { icon: "#️⃣", title: "Hash", sub: "SHA-256 özeti", detail: "Mesajın sabit uzunluklu parmak izi alınır. İmzalanan şey hash'tir (hızlı ve sabit boyutlu)." },
        { icon: "🔐", title: "Private Key ile imza", sub: "RSA-PSS", detail: "Hash, göndericinin Private Key'i ile imzalanır. Yalnızca Private Key sahibi geçerli imza üretebilir.", tone: "warn" },
        { icon: "📦", title: "İmzalı veri", sub: "mesaj + imza", detail: "Mesaj ve imza birlikte gönderilir. Mesaj okunabilir durumdadır." },
        { icon: "🔓", title: "Public Key ile doğrulama", sub: "geçerli / geçersiz", detail: "Alıcı mesajın hash'ini hesaplar ve imzayı göndericinin Public Key'i ile kontrol eder. Eşleşirse imza geçerlidir; tek bit bile değişse geçersizdir.", tone: "ok" },
      ]}
    />
  );
}
function V9() {
  const uses = [
    { t: "Gizli mesaj gönder", key: "Public", whose: "alıcının", why: "Yalnızca alıcının Private Key'i çözebilsin diye.", share: "Alıcı Public Key'ini paylaşır." },
    { t: "Gelen gizli mesajı çöz", key: "Private", whose: "kendi", why: "Sadece sen çözebilmelisin.", share: "Private Key hiç paylaşılmaz." },
    { t: "Mesajı imzala", key: "Private", whose: "kendi", why: "Sadece sen imzalayabilmelisin (inkâr edememe).", share: "Private Key hiç paylaşılmaz." },
    { t: "İmzayı doğrula", key: "Public", whose: "imzalayanın", why: "Herkes imzayı kontrol edebilmeli.", share: "İmzalayan Public Key'ini yayınlar." },
  ];
  const [i, setI] = useState(0);
  const u = uses[i];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {uses.map((x, j) => (
          <button key={x.t} type="button" onClick={() => setI(j)} className={cx("rounded-full border px-3 py-1.5 text-sm", i === j ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand")}>
            {x.t}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {(["Public", "Private"] as const).map((k) => (
          <div key={k} className={cx("rounded-xl border p-4 text-center transition-all", u.key === k ? "border-brand bg-white ring-2 ring-accent/40" : "border-line bg-bg opacity-60")}>
            <p className="text-3xl">{k === "Public" ? "🔓" : "🔐"}</p>
            <b>{k} Key</b>
            <p className="text-xs text-muted">{k === "Public" ? "Herkese açık" : "Gizli, paylaşılmaz"}</p>
            {u.key === k && <p className="mt-2 text-sm font-semibold text-brand">← Bu işlemde bu anahtar kullanılır</p>}
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-brand/20 bg-soft p-4 text-sm">
        <p>
          <b>Kullanılan:</b> {u.whose} {u.key} Key
        </p>
        <p>
          <b>Neden?</b> {u.why}
        </p>
        <p>
          <b>Paylaşım:</b> {u.share}
        </p>
      </div>
    </div>
  );
}
const HS: { dir: string; label: string; detail: string }[] = [
  { dir: "→", label: "Client Hello", detail: "İstemci sürümleri, şifre paketlerini, rastgele değeri ve ECDHE anahtar payını gönderir." },
  { dir: "←", label: "Server Hello", detail: "Sunucu sürümü/paketi seçer, kendi rastgele değerini ve anahtar payını gönderir." },
  { dir: "←", label: "Certificate", detail: "Sunucu sertifikasını (ve ara CA'ları) gönderir; sertifika Public Key'i alan adına bağlar." },
  { dir: "⟲", label: "Sertifika doğrulama", detail: "İstemci alan adı, süre, imza zinciri, güvenilir kök ve iptal durumunu kontrol eder. Hata varsa bağlantı kesilir." },
  { dir: "↔", label: "Anahtar anlaşması", detail: "İki taraf ECDHE ile aynı ortak sırrı hesaplar; sır ağdan geçmez. HKDF ile oturum anahtarları türetilir." },
  { dir: "↔", label: "Finished", detail: "İki taraf el sıkışmanın bütünlüğünü doğrular." },
  { dir: "🔒", label: "Şifreli HTTP verisi", detail: "Artık tüm veri simetrik oturum anahtarıyla (AES-GCM / ChaCha20-Poly1305) şifrelenir." },
];
function V10() {
  const [n, setN] = useState(0);
  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (!play) return;
    const id = setInterval(() => {
      setN((x) => {
        if (x >= HS.length - 1) {
          setPlay(false);
          return x;
        }
        return x + 1;
      });
    }, 1300);
    return () => clearInterval(id);
  }, [play]);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => {
            setN(0);
            setPlay(true);
          }}
        >
          ▶ Oynat
        </Button>
        <Button variant="secondary" onClick={() => setN((x) => Math.min(HS.length - 1, x + 1))}>
          Sonraki
        </Button>
        <Button variant="secondary" onClick={() => { setPlay(false); setN(0); }}>
          Başa dön
        </Button>
      </div>
      <div className="rounded-xl border border-line bg-white p-3">
        <div className="mb-2 grid grid-cols-[1fr_2fr_1fr] text-center text-sm font-semibold">
          <span>💻 İstemci</span>
          <span />
          <span>🖥️ Sunucu</span>
        </div>
        <div className="space-y-1.5">
          {HS.map((s, i) => (
            <button key={s.label} type="button" onClick={() => { setPlay(false); setN(i); }} className={cx("grid w-full grid-cols-[1fr_2fr_1fr] items-center rounded-lg px-2 py-1.5 text-center text-xs transition-all", i === n ? "bg-soft ring-2 ring-accent/40" : i < n ? "bg-[#F1F8F4]" : "opacity-50")}>
              <span className="text-left text-muted">{s.dir === "→" || s.dir === "⟲" ? "●" : ""}</span>
              <span className="font-medium text-ink">
                {s.dir} {s.label}
              </span>
              <span className="text-right text-muted">{s.dir === "←" ? "●" : ""}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="fadeup rounded-xl border border-brand/20 bg-soft p-4 text-sm" key={n}>
        <b className="text-brand">
          {n + 1}. {HS[n].label}:
        </b>{" "}
        {HS[n].detail}
      </div>
    </div>
  );
}
function V11() {
  return (
    <FlowDiagram
      vertical
      nodes={[
        { icon: "🏛️", title: "Root CA", sub: "kendinden imzalı · güven deposunda", detail: "Tarayıcı/işletim sistemi bu kök sertifikaya önceden güvenir. Anahtarı çevrimdışı ve çok sıkı korunur. Intermediate CA'ları imzalar.", tone: "ok" },
        { icon: "🏢", title: "Intermediate CA", sub: "Root tarafından imzalı", detail: "Günlük sertifika imzalama işini yapar. Ele geçirilirse yalnızca bu CA iptal edilir; Root güvende kalır.", tone: "warn" },
        { icon: "🌐", title: "Sunucu sertifikası (Leaf)", sub: "Intermediate tarafından imzalı", detail: "Web sitesinin alan adı ve Public Key'ini içerir. Tarayıcı zinciri yukarı doğru takip edip güvenilir bir köke ulaşırsa kabul eder." },
      ]}
    />
  );
}
function V12() {
  return (
    <FlowDiagram
      nodes={[
        { icon: "🔑", title: "1. Faktör: Bildiğin", sub: "uzun, benzersiz parola", detail: "Parola uzunluğu ve rastgeleliği tahmin saldırılarını yavaşlatır. Tek başına phishing ve sızıntıya karşı yetersizdir.", tone: "warn" },
        { icon: "📱", title: "2. Faktör: Sahip olduğun", sub: "TOTP, donanım anahtarı", detail: "Telefondaki TOTP kodu veya FIDO2 anahtarı. Parolayı çalan saldırgan bu faktöre sahip değildir.", tone: "ok" },
        { icon: "🧬", title: "3. Faktör: Olduğun", sub: "biyometri", detail: "Parmak izi/yüz tanıma genellikle cihazdaki passkey'i açar; biyometri sunucuya gönderilmez." },
        { icon: "✅", title: "Hesap korunur", sub: "çok katmanlı savunma", detail: "Bir katman çökse bile diğerleri saldırıyı durdurur. En güçlüsü phishing-resistant MFA (FIDO2/passkey).", tone: "ok" },
      ]}
    />
  );
}

const MAP: Record<number, () => ReactNode> = { 1: V1, 2: V2, 3: V3, 4: V4, 5: V5, 6: V6, 7: V7, 8: V8, 9: V9, 10: V10, 11: V11, 12: V12 };

export function Visual({ lessonId }: { lessonId: number }) {
  const C = MAP[lessonId];
  return <C />;
}
