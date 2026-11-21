import { ExternalLink } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-term text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <BrandLogo light />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
            AG Cyber Lab, siber güvenlik alanında teorik bilgiyi uygulamalı öğrenme deneyimiyle birleştirmeyi amaçlayan
            bağımsız bir eğitim ve araştırma platformudur.
          </p>
        </div>
        <div className="text-sm">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Instagram</h2>
          <a
            href="https://www.instagram.com/agcyberlab/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-white hover:text-accent"
          >
            @agcyberlab <ExternalLink size={14} aria-hidden />
          </a>
          <p className="mt-1 break-all text-xs text-slate-400">https://www.instagram.com/agcyberlab/</p>
        </div>
        <div className="text-sm">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Founder</h2>
          <p className="font-medium text-white">Ahmet Güler</p>
          <a
            href="https://www.instagram.com/ahmetgulerpy/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1.5 text-white hover:text-accent"
          >
            @ahmetgulerpy <ExternalLink size={14} aria-hidden />
          </a>
          <p className="mt-1 break-all text-xs text-slate-400">https://www.instagram.com/ahmetgulerpy/</p>
        </div>
      </div>
      <div className="border-t border-term-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:justify-between sm:px-6">
          <span>© AG CYBER LAB · Learn. Practice. Secure.</span>
          <span>İlerlemen yalnızca bu tarayıcıda (localStorage) saklanır. Hesap veya sunucu gerekmez.</span>
        </div>
      </div>
    </footer>
  );
}
