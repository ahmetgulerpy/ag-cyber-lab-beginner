import Link from "next/link";
import { ArrowRight, BookOpen, Clock, FlaskConical, GraduationCap, ListChecks, Quote } from "lucide-react";
import { CurriculumList } from "@/components/CurriculumList";
import { ProgressSummary } from "@/components/ProgressSummary";
import { Badge, Card, SectionTitle, TerminalBlock } from "@/components/ui";
import { getModuleSummary, modules, totalMinutes } from "@/content";

export default function HomePage() {
  const mod = modules[0];
  const summary = getModuleSummary(mod);
  const minutes = totalMinutes(mod);

  return (
    <div>
      <section className="grid-lines border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:py-14">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
                AG Cyber Lab · Sanal Eğitim Laboratuvarı
              </span>
            </div>
            <p className="mt-5 font-mono text-sm font-semibold text-brand">MODÜL {mod.code}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-[2.6rem] lg:leading-tight">
              {mod.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge>Başlangıç Seviyesi · Beginner</Badge>
              <Badge tone="neutral">
                <BookOpen size={11} aria-hidden /> {mod.lessons.length} ders
              </Badge>
              <Badge tone="neutral">
                <Clock size={11} aria-hidden /> ~{Math.round(minutes / 60 * 10) / 10} saat
              </Badge>
            </div>

            <figure className="mt-7 rounded-xl border border-line bg-white p-5 sm:p-6">
              <Quote size={20} className="text-accent" aria-hidden />
              <blockquote className="mt-2 space-y-3 text-[15px] leading-relaxed text-ink/90 sm:text-base">
                <p className="text-lg font-semibold text-ink">Siber güvenlik dünyasına hoş geldin.</p>
                <p>
                  Burada yalnızca kavramları ezberlemeyeceksin. Bir sistemin nasıl çalıştığını, tehditlerin nasıl ortaya çıktığını
                  ve güvenliği nasıl düşünmen gerektiğini adım adım öğreneceksin.
                </p>
                <p className="border-l-2 border-accent pl-3 text-ink">
                  Her uzman bir zamanlar başlangıç seviyesindeydi. Önemli olan nereden başladığın değil, nasıl ilerlediğin.
                </p>
              </blockquote>
            </figure>
          </div>
          <div className="lg:pt-6">
            <ProgressSummary summary={summary} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6" id="moduller">
        <SectionTitle eyebrow="Eğitim modülleri" title="Modül 01 — Müfredat" />
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <CurriculumList summary={summary} />
          <aside className="space-y-4">
            <Card className="p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
                <GraduationCap size={17} className="text-brand" aria-hidden /> Modül hakkında
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/80">{mod.description}</p>
              <Link
                href={`/modules/${mod.slug}`}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
              >
                Modül sayfasını aç <ArrowRight size={14} aria-hidden />
              </Link>
            </Card>
            <Card className="p-5">
              <h3 className="text-sm font-bold text-ink">Sonraki modüller</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/80">
                AG Cyber Lab orta ve ileri seviye modülleri aynı öğrenme düzeniyle ileride bu platforma eklenecek.
              </p>
            </Card>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
        <SectionTitle eyebrow="Öğrenme düzeni" title="Her ders aynı akışı izler" />
        <div className="grid gap-6 lg:grid-cols-2">
          <ul className="space-y-3">
            {[
              { icon: BookOpen, t: "Önce basit, sonra teknik", d: "Her kavram sade bir dille anlatılır, ardından teknik açıklaması yapılır ve gerçek bir örnekle pekiştirilir." },
              { icon: FlaskConical, t: "Uygulayarak öğren", d: "Senaryolar, eşleştirmeler, zaman çizelgeleri ve haritalar; cevabına göre geri bildirim verir." },
              { icon: ListChecks, t: "Yanlışlar ceza değil, rehberdir", d: "Her cevabın nedeni açıklanır. Uygulamaları ve testleri istediğin kadar tekrar edebilirsin." },
            ].map((x) => (
              <li key={x.t} className="flex gap-3 rounded-xl border border-line bg-white p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-soft text-brand">
                  <x.icon size={18} aria-hidden />
                </span>
                <span>
                  <span className="block text-sm font-bold text-ink">{x.t}</span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-ink/80">{x.d}</span>
                </span>
              </li>
            ))}
          </ul>
          <TerminalBlock
            terminal={{
              title: "agcl — öğrenme döngüsü",
              lines: [
                "$ agcl learn --module 01 --level beginner",
                "[1/4] ANLAT    basit anlatım → teknik açıklama → gerçek örnek",
                "[2/4] UYGULA   senaryo, eşleştirme, simülasyon",
                "[3/4] ÖLÇ      5 soruluk mini test + 20 soruluk genel test",
                "[4/4] İLERLE   ilerleme bu tarayıcıda (localStorage) saklanır",
                "",
                "# Hesap yok. Sunucu yok. İnternet olmadan da çalışır.",
              ],
            }}
          />
        </div>
      </section>
    </div>
  );
}
