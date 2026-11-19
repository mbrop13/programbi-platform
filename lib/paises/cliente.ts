"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { getPais, ISO_CHILE, normalizarPais } from "@/config/paises";
import { paisDesdeRuta, rutaLocal } from "@/lib/paises/rutas";
import { paisDesdeZonaHoraria } from "@/lib/paises/horarios";

/** Preferencia explícita del visitante (selector de país). */
export const PAIS_STORAGE_KEY = "programbi_country_iso";

/** ISO de dos letras que exista en `PAISES`; cualquier otra cosa es `null`. */
function isoValido(valor: string | null | undefined): string | null {
  const iso = (valor || "").trim().toLowerCase();
  if (!/^[a-z]{2}$/.test(iso)) return null;
  return getPais(iso).iso === iso ? iso : null;
}

/**
 * País del visitante en el navegador, en este orden:
 * 1. preferencia guardada (`programbi_country_iso`),
 * 2. zona horaria del sistema (LATAM),
 * 3. Chile.
 * En SSR devuelve Chile: el HTML inicial es siempre el mismo.
 */
export function detectarPaisCliente(): string {
  if (typeof window === "undefined") return ISO_CHILE;

  try {
    const porPreferencia = isoValido(window.localStorage.getItem(PAIS_STORAGE_KEY));
    if (porPreferencia) return porPreferencia;
  } catch {
    // Safari en modo privado puede lanzar al leer localStorage.
  }

  try {
    const porZona = paisDesdeZonaHoraria(Intl.DateTimeFormat().resolvedOptions().timeZone);
    if (porZona) return porZona;
  } catch {
    // Sin Intl disponible se cae al país por defecto.
  }

  return ISO_CHILE;
}

const suscripcionVacia = () => () => {};

/**
 * País efectivo de la ruta.
 * La URL manda: `/pe/cursos/...` es Perú aunque la preferencia local diga otra cosa.
 * Si la ruta no trae prefijo, se detecta recién tras hidratar (SSR y primer render
 * usan Chile) para evitar hydration mismatch.
 */
export function usePaisRuta(): string {
  const pathname = usePathname() || "/";
  const deRuta = paisDesdeRuta(pathname);
  const detectado = useSyncExternalStore(
    suscripcionVacia,
    detectarPaisCliente,
    () => ISO_CHILE,
  );

  return deRuta ?? detectado;
}

export function useRutaLocal(): (href: string) => string {
  const pais = usePaisRuta();
  return (href: string) => rutaLocal(pais, href);
}

export function usePaisNormalizado(iso: string | null | undefined): string {
  return normalizarPais(iso);
}
