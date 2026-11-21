"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { resetModuleProgress } from "@/lib/progress";
import { btnSecondary, toneBox } from "./ui";

export function ResetControl({ moduleId, disabled }: { moduleId: string; disabled?: boolean }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className={`rounded-lg border p-3.5 ${toneBox.danger}`} role="alertdialog" aria-label="İlerlemeyi sıfırlama onayı">
        <p className="flex items-start gap-2 text-sm font-semibold text-danger">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden />
          Tüm ilerlemen silinecek. Emin misin?
        </p>
        <p className="mt-1 text-xs leading-relaxed text-ink/80">
          Tamamlanan dersler, uygulamalar ve test sonuçları bu tarayıcıdan kalıcı olarak silinir. Bu işlem geri alınamaz.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-danger px-3.5 py-2 text-sm font-semibold text-white hover:opacity-90"
            onClick={() => {
              resetModuleProgress(moduleId);
              setConfirming(false);
            }}
          >
            <Trash2 size={15} aria-hidden /> Evet, sıfırla
          </button>
          <button className={btnSecondary} onClick={() => setConfirming(false)}>
            Vazgeç
          </button>
        </div>
      </div>
    );
  }

  return (
    <button className={btnSecondary} disabled={disabled} onClick={() => setConfirming(true)}>
      <Trash2 size={15} aria-hidden /> İlerlemeyi sıfırla
    </button>
  );
}
