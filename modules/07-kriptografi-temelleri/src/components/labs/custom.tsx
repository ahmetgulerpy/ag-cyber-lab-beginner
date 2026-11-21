"use client";

import { useEffect, useState, type ComponentType } from "react";
import { Button, Callout, OutBox, Pill, cx } from "@/components/ui";
import { randomBytes, shaText, toHex } from "@/lib/crypto";
import { useAsync } from "./shared";

/* ========== Ders 6 – Dosya bütünlük kontrolü ========== */
const ORIGINAL = "AG Lab Güvenlik Aracı v2.1\nSürüm tarihi: 2026-03-01\nKurulum betiği: https://indir.ornek.test/kur.sh\nBütünlük: SHA-256 ile doğrula";
const COPIES = [
  { name: "indirme-1.txt", content: ORIGINAL, intact: true, note: "" },
  { name: "indirme-2.txt", content: ORIGINAL.replace("indir.ornek.test", "indir.omek.test"), intact: false, note: "" },
  { name: "indirme-3.txt", content: ORIGINAL + "\n", intact: false, note: "" },
];

function Integrity({ onDone }: { onDone: () => void }) {
  const [official, setOfficial] = useState("");
  const [hashes, setHashes] = useState<Record<number, string>>({});
  const [verdict, setVerdict] = useState<Record<number, boolean | undefined>>({});
  const { busy, run } = useAsync();

  useEffect(() => {
    shaText("SHA-256", ORIGINAL).then(setOfficial);
  }, []);

  const calc = (i: number) =>
    run(async () => {
      const h = await shaText("SHA-256", COPIES[i].content);
      setHashes((x) => ({ ...x, [i]: h }));
    });
  const decide = (i: number, intact: boolean) => {
    const next = { ...verdict, [i]: intact };
    setVerdict(next);
    if (COPIES.every((c, j) => next[j] === c.intact)) onDone();
  };

  return (
    <div className="space-y-4">
      <OutBox label="Resmî sayfada yayınlanan SHA-256 (güvenilir kanaldan alındı)" value={official} tone="brand" />
      <p className="text-sm text-muted">Üç indirme kopyası var. Her birinin hash&apos;ini hesapla, resmî değerle karşılaştır ve &quot;bütün&quot; mü &quot;değişmiş&quot; mi karar ver. İçerikleri gözle karşılaştırmak yerine hash&apos;e güven.</p>
      {COPIES.map((c, i) => {
        const h = hashes[i];
        const same = h !== undefined && h === official;
        return (
          <div key={c.name} className="space-y-2 rounded-xl border border-line bg-bg p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <b className="text-sm">{c.name}</b>
              <Button variant="secondary" className="!py-1 !text-xs" disabled={busy} onClick={() => calc(i)}>
                SHA-256 hesapla
              </Button>
            </div>
            <pre className="hexbox max-h-28 overflow-auto whitespace-pre-wrap rounded-md bg-white p-2">{c.content}</pre>
            {h && (
              <div className="fadeup space-y-1">
                <p className="hexbox break-all">{h}</p>
                <Pill tone={same ? "ok" : "bad"}>{same ? "Resmî hash ile AYNI" : "Resmî hash'ten FARKLI"}</Pill>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button variant={verdict[i] === true ? "primary" : "secondary"} className="!py-1 !text-xs" onClick={() => decide(i, true)}>
                    Bütün (değişmemiş)
                  </Button>
                  <Button variant={verdict[i] === false ? "primary" : "secondary"} className="!py-1 !text-xs" onClick={() => decide(i, false)}>
                    Değişmiş / bozuk
                  </Button>
                </div>
                {verdict[i] !== undefined && (
                  <p className={cx("text-xs", verdict[i] === c.intact ? "text-ok" : "text-bad")}>
                    {verdict[i] === c.intact ? "✓ Doğru karar." : "✗ Hash karşılaştırmasına tekrar bak."}
                    {verdict[i] === c.intact && !c.intact && (i === 1 ? " Bu kopyada 'ornek' yerine 'omek' yazıyor (rn → m); gözle fark etmesi zor ama hash farkı hemen gösterir." : " Sonuna görünmez bir satır sonu eklenmiş; hash bunu da yakalar.")}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ========== Ders 7 – Rainbow table ========== */
const COMMON_PW = ["123456", "password", "qwerty", "merhaba", "111111", "abc123", "iloveyou", "admin", "welcome", "sifre123", "letmein", "dragon"];
const LEAKED = [
  { user: "ahmet", pw: "123456" },
  { user: "ayse", pw: "qwerty" },
  { user: "can", pw: "merhaba" },
  { user: "zeynep", pw: "Xq7!vR2mLp#9" },
];

function Rainbow({ onDone }: { onDone: () => void }) {
  const [table, setTable] = useState<Record<string, string>>({});
  const [dbA, setDbA] = useState<{ user: string; hash: string }[]>([]);
  const [dbB, setDbB] = useState<{ user: string; salt: string; hash: string }[]>([]);
  const [resA, setResA] = useState<Record<string, string> | null>(null);
  const [resB, setResB] = useState<Record<string, string> | null>(null);
  const [targeted, setTargeted] = useState<string>("");
  const { busy, run } = useAsync();

  useEffect(() => {
    (async () => {
      const t: Record<string, string> = {};
      for (const p of COMMON_PW) t[await shaText("SHA-256", p)] = p;
      setTable(t);
      setDbA(await Promise.all(LEAKED.map(async (u) => ({ user: u.user, hash: await shaText("SHA-256", u.pw) }))));
      setDbB(
        await Promise.all(
          LEAKED.map(async (u) => {
            const salt = toHex(randomBytes(8));
            return { user: u.user, salt, hash: await shaText("SHA-256", salt + u.pw) };
          }),
        ),
      );
    })();
  }, []);

  const searchA = () => {
    const r: Record<string, string> = {};
    dbA.forEach((u) => (r[u.user] = table[u.hash] ?? ""));
    setResA(r);
    if (resB) onDone();
  };
  const searchB = () => {
    const r: Record<string, string> = {};
    dbB.forEach((u) => (r[u.user] = table[u.hash] ?? ""));
    setResB(r);
    if (resA) onDone();
  };
  const targetedAttack = () =>
    run(async () => {
      const u = dbB[0];
      let found = "";
      for (const p of COMMON_PW) if ((await shaText("SHA-256", u.salt + p)) === u.hash) found = p;
      setTargeted(found ? `Saldırgan yalnızca '${u.user}' için ${COMMON_PW.length} hash'lik YENİ bir tablo hesapladı (salt: ${u.salt}) ve parolayı buldu: ${found}. Bu tablo diğer kullanıcılar için işe yaramaz; her hesap için tablo yeniden hesaplanmalı.` : "Bulunamadı.");
    });

  const Db = ({ rows, res, salted }: { rows: { user: string; hash: string; salt?: string }[]; res: Record<string, string> | null; salted: boolean }) => (
    <div className="overflow-x-auto rounded-lg border border-line bg-white">
      <table className="w-full min-w-[420px] text-left text-xs">
        <thead className="bg-bg text-muted">
          <tr>
            <th className="px-2 py-1.5">Kullanıcı</th>
            {salted && <th className="px-2 py-1.5">Salt</th>}
            <th className="px-2 py-1.5">Hash</th>
            <th className="px-2 py-1.5">Tablo sonucu</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.user} className="border-t border-line align-top">
              <td className="px-2 py-1.5 font-medium">{r.user}</td>
              {salted && <td className="hexbox px-2 py-1.5">{r.salt}</td>}
              <td className="hexbox px-2 py-1.5">{r.hash.slice(0, 20)}…</td>
              <td className="px-2 py-1.5">{res ? (res[r.user] ? <span className="font-semibold text-bad">KIRILDI: {res[r.user]}</span> : <span className="text-ok">bulunamadı</span>) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-4">
      <Callout kind="info" title="Saldırganın hazır tablosu">
        Saldırgan, {COMMON_PW.length} yaygın parolanın SHA-256 hash&apos;ini önceden hesaplamış ({Object.keys(table).length} kayıt). Gerçek tablolar milyarlarca kayıt içerir; mantık aynıdır. (Not: gerçek sistemlerde düz SHA-256 yerine PBKDF2/Argon2 kullanılmalıdır; burada yalnızca salt etkisi gösterilir.)
      </Callout>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-bad">Sızan veritabanı A — SALT YOK</p>
          <Db rows={dbA} res={resA} salted={false} />
          <Button onClick={searchA} disabled={!dbA.length}>
            Hazır tabloda ara
          </Button>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-ok">Sızan veritabanı B — kullanıcıya özel SALT</p>
          <Db rows={dbB} res={resB} salted />
          <Button onClick={searchB} disabled={!dbB.length}>
            Hazır tabloda ara
          </Button>
        </div>
      </div>
      {resA && resB && (
        <Callout kind="ok" title="Sonuç">
          Tuzsuz veritabanında {Object.values(resA).filter(Boolean).length}/4 hesap anında kırıldı; tuzlu olanda {Object.values(resB).filter(Boolean).length}/4. Salt gizli değildir (tabloda açıkça yazıyor) ama hazır tabloları işe yaramaz hâle getirir ve saldırganı her hesap için ayrı çalışmaya zorlar. &apos;zeynep&apos;in uzun rastgele parolası ise iki durumda da tabloda yoktur.
        </Callout>
      )}
      <div className="space-y-2 rounded-xl border border-line bg-bg p-3">
        <p className="text-sm text-ink">Saldırgan salt&apos;ı biliyorsa? Hedefli deney: yalnızca ilk kullanıcı için salt&apos;lı yeni tablo hesapla.</p>
        <Button variant="secondary" onClick={targetedAttack} disabled={busy || !dbB.length}>
          Hedefli saldırıyı dene
        </Button>
        {targeted && <p className="fadeup text-sm text-ink/90">{targeted}</p>}
      </div>
    </div>
  );
}

export const CUSTOM_PRACTICES: Record<string, ComponentType<{ onDone: () => void }>> = {
  integrity: Integrity,
  rainbow: Rainbow,
};
