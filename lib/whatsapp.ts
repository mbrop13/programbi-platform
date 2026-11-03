import { esIsoPais, getPais } from "@/config/paises";
import { PACK } from "@/lib/data/pack-adopcion";
import { captureAndReadAttribution } from "@/lib/utm";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export type WhatsAppIntent = "pack" | "curso" | "fechas" | "general" | "empresas";

/**
 * Número de WhatsApp del sitio en formato E.164, sin "+".
 * Reutiliza el número del país cuando existe (Chile) y permite sobrescribirlo
 * con NEXT_PUBLIC_WHATSAPP_NUMBER sin tocar el código.
 */
export function whatsappNumber(country?: string | null): string {
  const configured = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  if (configured && configured.length >= 8) return configured;

  const iso = country?.trim().toLowerCase();
  if (iso && esIsoPais(iso)) {
    const local = getPais(iso).contacto.whatsapp?.replace(/\D/g, "");
    if (local && local.length >= 8) return local;
  }

  return PACK.whatsappE164;
}

/** Nombre legible del país: acepta el ISO de las rutas ("ar") o un nombre ya escrito. */
export function whatsappCountryName(country?: string | null): string | null {
  const value = country?.trim();
  if (!value) return null;
  const iso = value.toLowerCase();
  if (esIsoPais(iso)) return getPais(iso).nombre;
  return value;
}

/** Slug del curso a partir de la ruta: "/mx/cursos/power-bi" → "power-bi". */
function courseSlugFromPage(page: string): string | undefined {
  const match = page.match(/\/cursos\/([^/?#]+)/);
  return match?.[1];
}

export function whatsappHref(opts: {
  page: string;
  intent?: WhatsAppIntent;
  course?: string;
  /** ISO del país ("cl", "ar"…) o su nombre. Se incluye en el mensaje precargado. */
  country?: string | null;
  extra?: string;
}): string {
  const page = opts.page || "/";
  const countryName = whatsappCountryName(opts.country);
  const course = opts.course?.trim();
  const ref = courseSlugFromPage(page);
  const origin = countryName ? `soy de ${countryName} y vengo de ${page}.` : `vengo de ${page}.`;

  let text: string;
  if (opts.intent === "curso" || opts.intent === "fechas") {
    // Mensaje exacto del plan P6:
    // "Hola, quiero info del curso {curso} desde {país} [ref:{slug}]"
    const subject = course
      ? `info del curso ${course}`
      : opts.intent === "fechas"
        ? "las fechas disponibles"
        : "info de los cursos";
    const desde = countryName ? ` desde ${countryName}` : "";
    const referencia = ref ? ` [ref:${ref}]` : "";
    text = `Hola, quiero ${subject}${desde}${referencia}`;
  } else if (opts.intent === "pack") {
    text = `Hola, ${origin} Quiero información del Pack Adopción BI / diagnóstico.`;
  } else if (opts.intent === "empresas") {
    text = `Hola, ${origin} Quiero cotizar una capacitación para mi equipo${course ? ` sobre ${course}` : ""}.`;
  } else {
    text = `Hola, ${origin} Quiero más información sobre los cursos.`;
  }

  if (opts.extra) text = `${text} ${opts.extra}`;
  return `https://wa.me/${whatsappNumber(opts.country)}?text=${encodeURIComponent(text)}`;
}

/** Append first-touch UTMs into the WhatsApp prefill (client-only). */
export function withPageUtms(href: string): string {
  if (typeof window === "undefined") return href;
  const attr = captureAndReadAttribution();
  const bits = UTM_KEYS.map((k) => (attr[k] ? `${k}=${attr[k]}` : null)).filter(
    (v): v is string => Boolean(v)
  );
  if (bits.length === 0) return href;

  try {
    const url = new URL(href);
    const text = url.searchParams.get("text") || "";
    if (bits.some((b) => text.includes(b))) return href;
    url.searchParams.set("text", `${text} (${bits.join(" ")})`);
    return url.toString();
  } catch {
    return href;
  }
}
