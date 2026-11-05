"use client";

import { Printer } from "lucide-react";

/** Botón de impresión aislado en cliente: la ficha del certificado es RSC. */
export default function BotonImprimir() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-line-strong bg-paper px-6 text-sm font-semibold text-ink transition-colors hover:bg-wash focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20 sm:w-auto"
    >
      <Printer className="h-4 w-4" aria-hidden="true" />
      Imprimir certificado
    </button>
  );
}
