# AG CYBER LAB — Modül 04: İşletim Sistemleri Temelleri

**LEARN • PRACTICE • SECURE**

Sıfırdan Siber Güvenlik Eğitim Programı'nın 4. modülü. Tamamen bağımsız, Next.js + React + TypeScript + Tailwind CSS ile yazılmış, etkileşimli bir eğitim ve sanal laboratuvar platformudur.

- 14 ders (Türkçe, kapsamlı konu anlatımı) — her derste etkileşimli sanal laboratuvar
- Her dersin sonunda 5 soruluk mini test, 20 soruluk final sınavı
- İlerleme, test sonuçları ve laboratuvar görevleri **localStorage**'da saklanır (veritabanı / API anahtarı gerekmez)
- İnternet bağlantısı olmadan da çalışır (harici font, CDN veya API kullanılmaz)

## Kurulum ve çalıştırma

```bash
npm install
npm run dev        # http://localhost:3000
```

Üretim derlemesi:

```bash
npm run build
npm run start
```

## Güvenlik notu

Tüm terminaller (Linux, Kali, CMD, PowerShell) ve masaüstleri tarayıcı içinde çalışan **eğitim simülasyonlarıdır**. Komutlar önceden tanımlanmış sanal dosya sistemi, sanal kullanıcı, süreç ve servis listeleri üzerinde yorumlanır; gerçek işletim sistemine komut gönderilmez, gerçek dosyalara dokunulmaz.

## Yapı

```
src/app            → sayfalar (panel, /ders/[id], /final, /api/health)
src/components     → arayüz, test, ders ve final bileşenleri
src/components/labs→ 14 etkileşimli laboratuvar
src/lib            → localStorage deposu, Linux ve Windows kabuk simülatörleri, izin hesaplama
src/data           → ders içerikleri, komut rehberi, final soruları, laboratuvar görevleri
```

Not: `src/db` ve `drizzle.config.json` proje şablonundan kalan dosyalardır; uygulama bunları **kullanmaz** (`DATABASE_URL` gerekmez, sağlık kontrolü `/api/health` veritabanından bağımsızdır).

Instagram: https://www.instagram.com/agcyberlab/ — Kurucu: https://www.instagram.com/ahmetgulerpy/
