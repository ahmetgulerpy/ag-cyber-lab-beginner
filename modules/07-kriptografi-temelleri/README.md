# AG CYBER LAB – MODÜL 07 · Kriptografi Temelleri

Sıfırdan Siber Güvenlik Eğitim Programı kapsamında, bağımsız ve tamamen tarayıcı içinde çalışan uygulamalı eğitim platformu.

## Çalıştırma

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # üretim derlemesi
npm run start    # üretim sunucusu
```

- Veritabanı, harici servis veya API anahtarı **gerekmez**. `DATABASE_URL` kullanılmaz.
- İlerleme yalnızca tarayıcı LocalStorage'ında saklanır (anahtar: `agcyberlab:modul07:kriptografi:v1`).
- `src/db/` ve `drizzle.config.json` başlangıç şablonundan kalan, kullanılmayan dosyalardır; uygulama bunları içe aktarmaz.

## İçerik

- 12 ders · 13 ana laboratuvar (Ders 12'de iki laboratuvar) · 12 ek mini pratik · 12 senaryo çalışması
- 60 mini test sorusu (ders başına 5) + 20 soruluk genel sınav
- İlerleme paneli, modül tamamlama ekranı (resmî sertifika değildir)

## Kriptografi

- Web Crypto API: AES-GCM, RSA-OAEP, RSA-PSS, PBKDF2, ECDH, ECDSA, HKDF, SHA-1/256/512, HMAC (TOTP – RFC 6238)
- MD5: yerel RFC 1321 uygulaması (`src/lib/crypto.ts`), standart test vektörleriyle doğrulanır
- Parolalar, anahtarlar ve metinler hiçbir sunucuya gönderilmez

## Yapı

- `src/data/` – ders içerikleri, pratikler, senaryolar, test soruları
- `src/components/labs/` – etkileşimli laboratuvarlar
- `src/components/activities.tsx` – eşleştirme, sıralama, sınıflandırma, senaryo etkinlikleri
- `src/lib/crypto.ts`, `src/lib/progress.tsx` – kriptografi yardımcıları ve LocalStorage ilerleme sistemi
