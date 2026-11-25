"use client";

import { useRouter } from "next/navigation";
import { GitCompare } from "lucide-react";
import { BuscadorCarreras } from "@/components/datos/BuscadorCarreras";

/**
 * Barra superior de la ficha de carrera: buscador para saltar a otra carrera y
 * botón «Comparar» que abre el mismo buscador y lleva al comparador con la
 * carrera actual más la elegida.
 */
export function BarraCarreraFicha({ slugActual }: { slugActual: string }) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-xs sm:flex-row sm:items-center">
      <BuscadorCarreras
        className="min-w-0 flex-1"
        placeholder="Busca otra carrera (ej. medicina, informática, tens)…"
      />
      <BuscadorCarreras
        variante="boton"
        atajos={false}
        className="shrink-0"
        botonClassName="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1890ff] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0958d9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1890ff] sm:w-auto"
        onSelect={(entry) => {
          if (entry.slug === slugActual) return;
          router.push(`/datos/carreras/comparar?c=${encodeURIComponent(`${slugActual},${entry.slug}`)}`);
        }}
      >
        <GitCompare className="size-4" aria-hidden="true" />
        Comparar con otra carrera
      </BuscadorCarreras>
    </div>
  );
}
