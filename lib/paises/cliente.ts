"use client";

import { usePathname } from "next/navigation";
import { ISO_CHILE, normalizarPais } from "@/config/paises";
import { paisDesdeRuta, rutaLocal } from "@/lib/paises/rutas";

export function usePaisRuta(): string {
  const pathname = usePathname() || "/";
  return paisDesdeRuta(pathname) ?? ISO_CHILE;
}

export function useRutaLocal(): (href: string) => string {
  const pais = usePaisRuta();
  return (href: string) => rutaLocal(pais, href);
}

export function usePaisNormalizado(iso: string | null | undefined): string {
  return normalizarPais(iso);
}
