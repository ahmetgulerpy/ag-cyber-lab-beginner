import Link from "next/link";
import { btnPrimary } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-mono text-sm font-semibold text-accent">404</p>
      <h1 className="mt-2 text-2xl font-bold text-ink">Aradığın sayfa bulunamadı</h1>
      <p className="mt-2 text-muted">Bağlantı hatalı olabilir veya bu içerik taşınmış olabilir.</p>
      <Link href="/" className={`${btnPrimary} mt-6`}>
        Ana sayfaya dön
      </Link>
    </div>
  );
}
