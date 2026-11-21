# AG CYBER LAB — Modül 03: Ağ Teknolojileri Temelleri

**Sıfırdan Siber Güvenlik Eğitim Programı · Seviye: Başlangıç · LEARN • PRACTICE • SECURE**

Tamamen bağımsız, tarayıcı içinde çalışan etkileşimli eğitim ve sanal laboratuvar platformudur.
16 ders, her ders için çalışan bir laboratuvar, 16 mini test (5'er soru) ve 20 soruluk final sınavı içerir.

- Teknoloji: Next.js (App Router), React, TypeScript, Tailwind CSS
- Veri saklama: yalnızca tarayıcı `localStorage` (anahtar: `agcyberlab-modul03-ag-teknolojileri-v1`)
- Harici veritabanı, API anahtarı, ücretli servis veya internet bağlantısı **gerekmez**. Laboratuvarlar yerel simülasyondur; gerçek ağ taraması yapılmaz.

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

## Teslim klasörü

Projeyi indirdikten sonra klasör adını `AG-CYBER-LAB-MODUL-03-AG-TEKNOLOJILERI` olarak değiştirebilirsiniz; başka bir ayar gerekmez.

## Yapı

```
src/
  app/                 # Sayfalar: / (panel), /ders/[id], /final, /api/health
  components/          # Panel, ders görünümü, mini test, final sınavı, ortak arayüz
  components/labs/     # 16 etkileşimli laboratuvar (Lab01 … Lab16)
  data/                # Ders içerikleri (lessons1-4.ts), final soruları, OSI/TCP-IP verileri
  lib/storage.ts       # localStorage ilerleme sistemi
```

## Notlar

- İlerleme (tamamlanan dersler, test sonuçları, laboratuvar durumu, final sonucu) sayfa yenilense de korunur. Panelden "İlerlemeyi Sıfırla" ile silinebilir.
- `src/db` ve `drizzle.config.json` dosyaları başlangıç şablonundan kalmıştır; uygulama bunları kullanmaz ve `DATABASE_URL` gerektirmez.
