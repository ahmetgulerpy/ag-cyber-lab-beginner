import { useEffect, useState } from "react";
import { FileText, ShieldAlert, ShieldCheck, Shield, RotateCcw } from "lucide-react";
import { Btn, Card, Feedback, LabShell, SimNote, Badge, type LabProps } from "../components/ui";
import { cn } from "../utils/cn";

type Risk = "low" | "medium" | "high";
interface FileCard {
  ext: string;
  type: string;
  use: string;
  security: string;
  risk: Risk;
}

const files: FileCard[] = [
  { ext: ".txt", type: "Düz metin dosyası", use: "Biçimlendirmesiz basit notlar, günlükler (log), yapılandırma notları.", security: "Kendisi program çalıştırmaz; düşük risk. Ancak adı .txt görünen dosya gerçekte başka bir türde olabilir.", risk: "low" },
  { ext: ".pdf", type: "Taşınabilir belge (Portable Document Format)", use: "Düzeni sabit belgeler: fatura, rapor, form.", security: "PDF içine bağlantı ve betik gömülebilir. Eski okuyucularda açıklar olabilir; okuyucuyu güncel tut ve beklenmedik PDF'lerdeki bağlantılara tıklama.", risk: "medium" },
  { ext: ".docx", type: "Word belgesi", use: "Metin belgeleri, raporlar, dilekçeler.", security: ".docx makro içermez ancak .docm makro içerebilir. 'İçeriği Etkinleştir' uyarısına dikkat; kaynağı bilinmeyen belgede makro çalıştırma.", risk: "medium" },
  { ext: ".jpg", type: "JPEG görsel", use: "Fotoğraflar; kayıplı sıkıştırma ile küçük boyut.", security: "Genellikle güvenli. Görselin içine veri gizlenebilir (steganografi) ve uzantısı taklit edilmiş çalıştırılabilir dosya olabilir.", risk: "low" },
  { ext: ".png", type: "PNG görsel", use: "Kayıpsız sıkıştırılmış görseller, şeffaf arka planlı logolar.", security: "Genellikle güvenli. Dosya adı .png olsa da içeriğin gerçekten PNG olduğundan emin olmak için kaynağa güven.", risk: "low" },
  { ext: ".mp3", type: "Ses dosyası", use: "Müzik ve ses kayıtları; kayıplı sıkıştırma.", security: "Düşük risk. Nadiren medya oynatıcı açıklarını hedefleyen bozuk dosyalar olabilir; oynatıcıyı güncel tut.", risk: "low" },
  { ext: ".mp4", type: "Video dosyası", use: "Video ve ses içeren medya.", security: "Düşük risk. 'Video izle' diye yüklenmesi istenen 'codec' programları ise çoğu zaman zararlıdır.", risk: "low" },
  { ext: ".zip", type: "Arşiv dosyası", use: "Birden fazla dosyayı sıkıştırıp tek pakette toplama.", security: "İçindeki dosyalar açıldığında risk oluşturabilir. Saldırganlar zararlı .exe'yi zip içine koyarak e-posta filtrelerinden kaçmaya çalışır. Parola korumalı zip'ler antivirüsten gizlenebilir.", risk: "medium" },
  { ext: ".exe", type: "Çalıştırılabilir program (Windows)", use: "Programların kurulumu ve çalıştırılması.", security: "Çalıştırıldığında bilgisayarda her şeyi yapabilir. Yalnızca resmi kaynaklardan indirilen, dijital imzası doğrulanabilir programları çalıştır. Beklenmedik .exe'yi asla açma.", risk: "high" },
  { ext: ".dll", type: "Dinamik bağlantı kütüphanesi (Dynamic Link Library)", use: "Programların ortak kullandığı kod parçaları.", security: "Kendiliğinden açılmaz; ancak kötü amaçlı DLL'ler meşru programlara enjekte edilebilir (DLL hijacking). Sistem klasöründeki DLL'lerle oynama.", risk: "high" },
  { ext: ".bat", type: "Toplu iş (batch) betiği", use: "Windows komutlarını sırayla çalıştıran betik.", security: "Dosya silme, ağ indirme gibi komutlar içerebilir. İçeriğini okumadan çalıştırma. E-postada gelen .bat dosyası çok şüphelidir.", risk: "high" },
  { ext: ".ps1", type: "PowerShell betiği", use: "Sistem yönetimi ve otomasyon.", security: "Güçlü bir yönetim aracıdır; saldırganlar sık kullanır. Kaynağı belli olmayan betiği çalıştırma; yürütme politikasını (execution policy) gelişigüzel gevşetme.", risk: "high" },
  { ext: ".py", type: "Python betiği", use: "Programlama, otomasyon, veri analizi.", security: "Python yüklüyse çalıştırıldığında sistemde her şeyi yapabilir. İnternetten bulunan betikleri önce oku, anlamadığın kodu çalıştırma.", risk: "high" },
  { ext: ".html", type: "Web sayfası", use: "Tarayıcıda görüntülenen sayfalar.", security: "Sahte giriş sayfaları (phishing) e-posta eki olarak .html gönderilebilir. Eklerden açılan sayfada parola girme.", risk: "medium" },
  { ext: ".json", type: "Yapılandırılmış veri (JavaScript Object Notation)", use: "Uygulamalar arası veri alışverişi, ayar dosyaları.", security: "Kendisi çalıştırılmaz; düşük risk. Ancak beklenmeyen veriler uygulamalarda hataya yol açabilir.", risk: "low" },
];

const riskInfo: Record<Risk, { label: string; tone: "ok" | "warn" | "bad"; icon: typeof Shield }> = {
  low: { label: "Düşük risk", tone: "ok", icon: ShieldCheck },
  medium: { label: "Orta risk", tone: "warn", icon: Shield },
  high: { label: "Yüksek risk", tone: "bad", icon: ShieldAlert },
};

const options = [
  { t: "Evet, PDF olduğu için güvenlidir; hemen açmalıdır.", ok: false, why: "Yanlış. Gerçek uzantı son noktadan sonraki .exe'dir. 'fatura.pdf' kısmı yalnızca bir addır; dosya bir programdır." },
  { t: "Hayır. Dosya aslında çalıştırılabilir bir programdır (.exe); açmadan silmeli/bildirmelidir.", ok: true, why: "Doğru! Çift uzantı (double extension) klasik bir saldırı tekniğidir. Gerçek uzantı .exe olduğundan dosya PDF değil programdır. Beklenmedik faturaları açmadan göndericiyle başka bir kanaldan doğrulamak en güvenli yoldur." },
  { t: "Uzantıyı silip yeniden adlandırarak açmalıdır.", ok: false, why: "Yanlış. Uzantıyı değiştirmek içeriği dönüştürmez; zararlı kod yine zararlı kalır. Ayrıca bu davranış riski artırır." },
  { t: "Antivirüs 'temiz' derse her zaman güvenlidir.", ok: false, why: "Yanlış. Antivirüs önemli bir katmandır ancak yeni zararlıları kaçırabilir. Karar yalnızca antivirüse bırakılmamalı; dosyanın beklenen ve doğrulanmış bir kaynaktan gelip gelmediği de kontrol edilmelidir." },
];

export default function Lab06({ done, onComplete }: LabProps) {
  const [sel, setSel] = useState<number | null>(null);
  const [viewed, setViewed] = useState<number[]>([]);
  const [choice, setChoice] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    if (viewed.length >= 6 && solved && !done) onComplete();
  }, [viewed, solved, done, onComplete]);

  const open = (i: number) => {
    setSel(i);
    setViewed((v) => (v.includes(i) ? v : [...v, i]));
  };

  const f = sel !== null ? files[sel] : null;

  return (
    <LabShell done={done} title="Lab 06 — Dosya Uzantısı Tanıma Laboratuvarı">
      <SimNote>Bu laboratuvarda hiçbir gerçek dosya açılmaz veya çalıştırılmaz; yalnızca bilgi kartları ve senaryo vardır.</SimNote>
      <Card className="space-y-4">
        <h4 className="font-semibold">1) Dosya kartları — en az 6 tanesini incele ({viewed.length}/{files.length})</h4>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {files.map((fi, i) => (
            <button
              key={fi.ext}
              onClick={() => open(i)}
              className={cn(
                "relative flex flex-col items-center rounded-lg border p-2.5 transition-colors",
                sel === i ? "border-brand bg-soft" : "border-line bg-white hover:border-accent"
              )}
            >
              {viewed.includes(i) && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-ok" />}
              <FileText className="h-6 w-6 text-brand" />
              <span className="mt-1 font-mono text-sm font-bold">{fi.ext}</span>
            </button>
          ))}
        </div>
        {f ? (
          <div className="fade-in space-y-3 rounded-lg border border-line bg-page p-4 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-lg font-bold text-brand">{f.ext}</span>
              <Badge tone={riskInfo[f.risk].tone}>{riskInfo[f.risk].label}</Badge>
            </div>
            <div>
              <span className="font-semibold">Tür: </span>
              {f.type}
            </div>
            <div>
              <span className="font-semibold">Kullanım amacı: </span>
              {f.use}
            </div>
            <div>
              <span className="font-semibold">Güvenlik notu: </span>
              {f.security}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted">Bir dosya kartına tıkla.</p>
        )}
      </Card>

      <Card className="space-y-4">
        <h4 className="font-semibold">2) Senaryo</h4>
        <div className="rounded-lg border border-warn/40 bg-[#fdf6e7] p-4 text-sm">
          Bir kullanıcıya e-posta ile <span className="rounded bg-white px-1.5 py-0.5 font-mono font-bold">fatura.pdf.exe</span> adlı bir dosya gönderildi. Kullanıcı bu dosyayı açmalı mı?
        </div>
        <div className="grid gap-2">
          {options.map((o, i) => (
            <button
              key={i}
              disabled={solved}
              onClick={() => {
                setChoice(i);
                if (o.ok) setSolved(true);
              }}
              className={cn(
                "rounded-lg border p-3 text-left text-sm transition-colors",
                choice === null && "border-line bg-white hover:border-accent",
                choice === i && o.ok && "border-ok bg-[#eef8f2]",
                choice === i && !o.ok && "border-bad bg-[#fbeeee]",
                choice !== null && choice !== i && "border-line opacity-60"
              )}
            >
              {o.t}
            </button>
          ))}
        </div>
        {choice !== null && (
          <Feedback tone={options[choice].ok ? "ok" : "bad"} title={options[choice].ok ? "Doğru karar" : "Yanlış karar"}>
            {options[choice].why}
          </Feedback>
        )}
        {choice !== null && !options[choice].ok && (
          <Btn variant="secondary" onClick={() => setChoice(null)}>
            <RotateCcw className="h-4 w-4" /> Tekrar Dene
          </Btn>
        )}
        {solved && (
          <Feedback tone="info" title="Unutma">
            Dosya uzantısı tek başına güvenilirlik kanıtı değildir. Gerçek tür uzantının son kısmıyla ve içerik imzasıyla belirlenir; Windows'ta "dosya uzantılarını göster" seçeneğini açık tut.
          </Feedback>
        )}
        {solved && viewed.length < 6 && <p className="text-xs text-muted">Senaryo çözüldü. Tamamlamak için {6 - viewed.length} kart daha incele.</p>}
      </Card>
    </LabShell>
  );
}
