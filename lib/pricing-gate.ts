/**
 * Gate de precios de la web pública.
 *
 * Regla de negocio: hasta que el visitante completa el formulario de la ficha
 * (o ya lo hizo antes, o está logueado), ningún precio se renderiza en el HTML.
 * Al enviar el formulario se abre el brochure PDF en una pestaña nueva y se
 * persiste el desbloqueo en `localStorage` + cookie de 90 días, de modo que el
 * precio y el botón de compra aparecen al instante en toda la web.
 *
 * Este módulo es isomorfo: todas las funciones comprueban `window` antes de
 * tocar el navegador, así que se puede importar desde componentes cliente sin
 * romper el render de servidor.
 */

import { esIsoPais, ISO_CHILE } from "@/config/paises";

export const PRICE_UNLOCK_STORAGE_KEY = "pb_price_unlocked";
export const PRICE_UNLOCK_COOKIE = "pb_price_unlocked";
export const LEAD_INFO_STORAGE_KEY = "pb_lead_info";
export const PRICE_UNLOCK_EVENT = "pb:price-unlocked";

/** 90 días en segundos: la cookie de desbloqueo dura tres meses. */
export const PRICE_UNLOCK_MAX_AGE = 60 * 60 * 24 * 90;

export type SavedLeadInfo = {
  name: string;
  email: string;
  whatsapp: string;
};

function hasWindow(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function leerCookie(nombre: string): string | null {
  if (!hasWindow()) return null;
  const partes = document.cookie ? document.cookie.split(";") : [];
  for (const parte of partes) {
    const [clave, ...resto] = parte.split("=");
    if (clave.trim() === nombre) return decodeURIComponent(resto.join("=").trim());
  }
  return null;
}

/**
 * ¿El visitante ya desbloqueó los precios? `true` si dejó la marca en
 * `localStorage` o si trae la cookie de 90 días. En SSR siempre es `false`
 * para que el HTML inicial nunca contenga precios.
 */
export function isPriceUnlockedClient(): boolean {
  if (!hasWindow()) return false;
  try {
    if (window.localStorage.getItem(PRICE_UNLOCK_STORAGE_KEY) === "1") return true;
  } catch {
    // Safari en modo privado puede lanzar al leer localStorage.
  }
  return leerCookie(PRICE_UNLOCK_COOKIE) === "1";
}

/**
 * Desbloquea precios y recuerda los datos del lead.
 * Escribe `localStorage`, deja la cookie de 90 días, guarda el contacto en
 * `pb_lead_info` y avisa a todas las componentes suscritas al evento.
 */
export function unlockPricesClient(lead?: Partial<SavedLeadInfo> | null): void {
  if (!hasWindow()) return;

  try {
    window.localStorage.setItem(PRICE_UNLOCK_STORAGE_KEY, "1");
  } catch {
    // Sin localStorage el gate sigue funcionando por cookie + estado React.
  }

  document.cookie = `${PRICE_UNLOCK_COOKIE}=1; path=/; max-age=${PRICE_UNLOCK_MAX_AGE}; SameSite=Lax`;

  if (lead && (lead.name || lead.email || lead.whatsapp)) {
    const info: SavedLeadInfo = {
      name: (lead.name || "").trim(),
      email: (lead.email || "").trim(),
      whatsapp: (lead.whatsapp || "").trim(),
    };
    try {
      window.localStorage.setItem(LEAD_INFO_STORAGE_KEY, JSON.stringify(info));
    } catch {
      // Idem: no es crítico para el desbloqueo.
    }
  }

  try {
    window.dispatchEvent(new CustomEvent(PRICE_UNLOCK_EVENT));
  } catch {
    // Navegadores muy antiguos sin CustomEvent: el resto del flujo sigue.
  }
}

/** Datos del último formulario enviado, si existen. */
export function getSavedLeadInfo(): SavedLeadInfo | null {
  if (!hasWindow()) return null;
  try {
    const raw = window.localStorage.getItem(LEAD_INFO_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedLeadInfo> | null;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
      whatsapp: typeof parsed.whatsapp === "string" ? parsed.whatsapp : "",
    };
  } catch {
    return null;
  }
}

/** Cierra sesión de precios: lo usa el botón «volver a ocultar» de pruebas. */
export function lockPricesClient(): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.removeItem(PRICE_UNLOCK_STORAGE_KEY);
  } catch {
    // Sin localStorage no hay nada que limpiar.
  }
  document.cookie = `${PRICE_UNLOCK_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  try {
    window.dispatchEvent(new CustomEvent(PRICE_UNLOCK_EVENT));
  } catch {
    // Idem.
  }
}

/**
 * Ruta del brochure del curso. Chile vive en la raíz; el resto de los países
 * usan su prefijo (/pe/cursos/..., /mx/cursos/...). Un país desconocido cae a
 * la versión chilena para no generar enlaces a un 404.
 */
export function courseBrochurePath(slug: string, pais?: string | null): string {
  const limpio = (slug || "").trim().replace(/^\/+|\/+$/g, "");
  const iso = (pais || "").trim().toLowerCase();
  if (!esIsoPais(iso) || iso === ISO_CHILE) return `/cursos/${limpio}/brochure`;
  return `/${iso}/cursos/${limpio}/brochure`;
}

/** Ruta del brochure, lista para abrir. El país ya viaja en la ruta. */
export function courseBrochureUrl(slug: string, pais?: string | null): string {
  const iso = (pais || "").trim().toLowerCase();
  const efectivo = esIsoPais(iso) ? iso : ISO_CHILE;
  return courseBrochurePath(slug, efectivo);
}
