"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getPais, ISO_CHILE, normalizarPais } from "@/config/paises";
import { paisDesdeRuta, rutaLocal } from "@/lib/paises/rutas";
import { paisDesdeZonaHoraria } from "@/lib/paises/horarios";

/** Cookie que deja el proxy con el país de la IP (`x-vercel-ip-country`). */
export const PAIS_COOKIE_KEY = "pb_geo_country";

/** Preferencia explícita del visitante (selector de país). */
export const PAIS_STORAGE_KEY = "programbi_country_iso";

function leerCookie(nombre: string): string | null {
  if (typeof document === "undefined") return null;
  for (const parte of document.cookie ? document.cookie.split(";") : []) {
    const [clave, ...resto] = parte.split("=");
    if (clave.trim() === nombre) return decodeURIComponent(resto.join("=").trim());
  }
  return null;
}

/** ISO de dos letras que exista en `PAISES`; cualquier otra cosa es `null`. */
function isoValido(valor: string | null | undefined): string | null {
  const iso = (valor || "").trim().toLowerCase();
  if (!/^[a-z]{2}$/.test(iso)) return null;
  return getPais(iso).iso === iso ? iso : null;
}

/**
 * País del visitante en el navegador, en este orden:
 * 1. cookie `pb_geo_country` que deja el proxy con la IP,
 * 2. preferencia guardada (`programbi_country_iso`),
 * 3. zona horaria del sistema (LATAM),
 * 4. Chile.
 * En SSR devuelve Chile: el HTML inicial es siempre el mismo.
 */
export function detectarPaisCliente(): string {
  if (typeof window === "undefined") return ISO_CHILE;

  const porCookie = isoValido(leerCookie(PAIS_COOKIE_KEY));
  if (porCookie) return porCookie;

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

/**
 * País efectivo de la ruta.
 * La URL manda: `/pe/cursos/...` es Perú aunque la cookie diga otra cosa.
 * Si la ruta no trae prefijo, se detecta recién al montar (estado inicial
 * Chile) para que el primer render del cliente coincida con el del servidor
 * y no haya hydration mismatch.
 */
export function usePaisRuta(): string {
  const pathname = usePathname() || "/";
  const deRuta = paisDesdeRuta(pathname);
  const [detectado, setDetectado] = useState<string>(ISO_CHILE);

  useEffect(() => {
    if (deRuta) return;
    setDetectado(detectarPaisCliente());
  }, [deRuta]);

  return deRuta ?? detectado;
}

export function useRutaLocal(): (href: string) => string {
  const pais = usePaisRuta();
  return (href: string) => rutaLocal(pais, href);
}

export function usePaisNormalizado(iso: string | null | undefined): string {
  return normalizarPais(iso);
}
