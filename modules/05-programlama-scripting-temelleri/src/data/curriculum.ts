export const MODULE_NO = "05";
export const MODULE_TITLE = "Programlama ve Scripting Temelleri";
export const PROGRAM_NAME = "Sıfırdan Siber Güvenlik Eğitim Programı";

export const CURRICULUM: { id: number; title: string; short: string }[] = [
  { id: 1, title: "Programlama Nedir?", short: "Programlama" },
  { id: 2, title: "Algoritma Mantığı", short: "Algoritma" },
  { id: 3, title: "Değişkenler ve Veri Tipleri", short: "Değişkenler" },
  { id: 4, title: "Koşullu İfadeler", short: "Koşullar" },
  { id: 5, title: "Döngüler", short: "Döngüler" },
  { id: 6, title: "Fonksiyonlar", short: "Fonksiyonlar" },
  { id: 7, title: "Listeler ve Sözlükler", short: "Veri Yapıları" },
  { id: 8, title: "Dosya İşlemleri", short: "Dosyalar" },
  { id: 9, title: "Hata Yönetimi", short: "Hata Yönetimi" },
  { id: 10, title: "Python'a Giriş", short: "Python" },
  { id: 11, title: "Bash Scripting'e Giriş", short: "Bash" },
  { id: 12, title: "PowerShell Scripting'e Giriş", short: "PowerShell" },
  { id: 13, title: "JSON ve XML", short: "JSON / XML" },
  { id: 14, title: "Regular Expressions (Regex)", short: "Regex" },
];

export function pad(n: number): string {
  return String(n).padStart(2, "0");
}
