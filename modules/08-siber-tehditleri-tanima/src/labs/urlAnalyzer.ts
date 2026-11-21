/* Tamamen yerel URL çözümleme. Hiçbir ağ isteği yapılmaz. */

export type Finding = { level: "ok" | "warn" | "bad"; text: string };
export type UrlReport = {
  valid: boolean;
  protocol: string;
  host: string;
  subdomain: string;
  domain: string;
  tld: string;
  path: string;
  params: [string, string][];
  findings: Finding[];
  risk: number; // 0-100
};

const BRANDS = ["paypal", "google", "microsoft", "amazon", "anadolubanka", "hizlikargo", "bulutposta", "instagram", "apple", "turkcell"];
const BAD_TLDS = ["top", "xyz", "click", "zip", "tk", "ml", "cf", "gq", "icu", "work"];
const SECOND_LEVEL = ["com", "org", "net", "gov", "edu", "k12", "gen"];
const PARAM_RE = /(redirect|return|next|url|token|pass|pwd|session|verify|otp|odeme|kart)/i;

function normalizeHomoglyph(s: string): string {
  return s.replace(/rn/g, "m").replace(/vv/g, "w").replace(/0/g, "o").replace(/1/g, "l").replace(/3/g, "e").replace(/5/g, "s").replace(/@/g, "a");
}

export function analyzeUrl(raw: string): UrlReport {
  const input = raw.trim();
  const empty: UrlReport = { valid: false, protocol: "-", host: "-", subdomain: "-", domain: "-", tld: "-", path: "-", params: [], findings: [], risk: 0 };
  if (!input) return empty;
  let u: URL;
  try {
    u = new URL(/^[a-z]+:\/\//i.test(input) ? input : `http://${input}`);
  } catch {
    return { ...empty, findings: [{ level: "bad", text: "Bu metin geçerli bir URL gibi çözümlenemedi." }] };
  }
  const findings: Finding[] = [];
  const host = u.hostname.toLowerCase();
  const labels = host.split(".");
  const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(host);
  let tld = labels[labels.length - 1];
  let domainLabels = 2;
  if (labels.length >= 3 && SECOND_LEVEL.includes(labels[labels.length - 2]) && tld.length === 2) domainLabels = 3;
  const domain = isIp ? host : labels.slice(-domainLabels).join(".");
  const subdomain = isIp ? "" : labels.slice(0, Math.max(0, labels.length - domainLabels)).join(".");
  if (isIp) tld = "-";
  const mainLabel = isIp ? "" : labels[labels.length - domainLabels];
  let risk = 0;

  if (u.protocol !== "https:") {
    findings.push({ level: "warn", text: "HTTPS kullanılmıyor: bağlantı şifrelenmemiş. Parola girmeden önce mutlaka kontrol et." });
    risk += 15;
  } else {
    findings.push({ level: "ok", text: "HTTPS kullanılıyor. (Bu tek başına güvenilirlik kanıtı DEĞİLDİR; sahte siteler de HTTPS kullanabilir.)" });
  }
  if (input.includes("@") && /@[^/]*/.test(input.split("?")[0].replace(/^[a-z]+:\/\//i, ""))) {
    findings.push({ level: "bad", text: "URL içinde ‘@’ var: @ işaretinden önceki kısım kullanıcı adı sayılır, asıl adres @’ten sonrasıdır." });
    risk += 35;
  }
  if (isIp) {
    findings.push({ level: "bad", text: "Alan adı yerine doğrudan IP adresi kullanılıyor; gerçek kurumlar genelde alan adı kullanır." });
    risk += 30;
  }
  if (host.includes("xn--")) {
    findings.push({ level: "bad", text: "Punycode (xn--) var: görsel olarak benzeyen farklı karakterlerle taklit olabilir (Homograph)." });
    risk += 35;
  }
  if (!isIp) {
    const subLabels = subdomain ? subdomain.split(".") : [];
    if (subLabels.length > 2) {
      findings.push({ level: "warn", text: `Çok sayıda alt alan adı (${subLabels.length}). Gerçek alan adını sağdan oku: ${domain}` });
      risk += 15;
    }
    const brandInSub = BRANDS.find((b) => subdomain.replace(/-/g, "").includes(b));
    const brandInDomain = BRANDS.find((b) => mainLabel === b);
    if (brandInSub && !brandInDomain) {
      findings.push({ level: "bad", text: `‘${brandInSub}’ adı alt alan adında geçiyor ama gerçek alan adı ${domain}. Marka adı sağda değilse kandırmacadır.` });
      risk += 35;
    }
    const norm = normalizeHomoglyph(mainLabel.replace(/-/g, ""));
    const look = BRANDS.find((b) => norm.includes(b) && !mainLabel.replace(/-/g, "").includes(b));
    if (look) {
      findings.push({ level: "bad", text: `Alan adı ‘${look}’ markasının karakter değiştirilmiş taklidine benziyor (örn. l→1, o→0, rn→m).` });
      risk += 35;
    } else {
      const brandInside = BRANDS.find((b) => mainLabel.includes(b) && mainLabel !== b);
      if (brandInside && !brandInDomain) {
        findings.push({ level: "bad", text: `Alan adı ‘${brandInside}’ adını içeriyor ama onun resmî alan adı değil (ek kelime/tire ile taklit).` });
        risk += 30;
      }
    }
    if ((mainLabel.match(/-/g) ?? []).length >= 2) {
      findings.push({ level: "warn", text: "Alan adında birden fazla tire var; taklit alan adlarında sık görülür." });
      risk += 10;
    }
    if (BAD_TLDS.includes(tld)) {
      findings.push({ level: "warn", text: `.${tld} uzantısı kötüye kullanımda sık görülür (tek başına kanıt değildir).` });
      risk += 15;
    }
  }
  const params: [string, string][] = [...u.searchParams.entries()];
  params.forEach(([k, v]) => {
    if (/^https?:\/\//i.test(v) || v.includes("//")) {
      findings.push({ level: "bad", text: `‘${k}’ parametresi başka bir adrese yönlendirme içeriyor (Open Redirect belirtisi).` });
      risk += 30;
    } else if (PARAM_RE.test(k)) {
      findings.push({ level: "warn", text: `‘${k}’ parametresi hassas bir işlemi andırıyor (token/ödeme/doğrulama).` });
      risk += 12;
    }
  });
  if (input.length > 90) {
    findings.push({ level: "warn", text: "URL çok uzun; gerçek adresi gizlemek için kullanılabilir." });
    risk += 8;
  }
  if (!findings.some((f) => f.level !== "ok")) findings.push({ level: "ok", text: "Belirgin bir şüpheli işaret bulunmadı. Yine de bağlantıyı beklediğin kaynaktan aldığından emin ol." });

  return {
    valid: true,
    protocol: u.protocol.replace(":", ""),
    host,
    subdomain: subdomain || "(yok)",
    domain,
    tld: tld === "-" ? "-" : `.${tld}`,
    path: u.pathname + (u.search ? "" : ""),
    params,
    findings,
    risk: Math.min(100, risk),
  };
}
