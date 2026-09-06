import { PACK } from "@/lib/data/pack-adopcion";
import { captureAndReadAttribution } from "@/lib/utm";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export type WhatsAppIntent = "pack" | "curso" | "fechas" | "general" | "empresas";

export function whatsappHref(opts: {
  page: string;
  intent?: WhatsAppIntent;
  course?: string;
  extra?: string;
}): string {
  const page = opts.page || "/";
  let text: string;
  if (opts.intent === "pack") {
    text = `Hola, vengo de ${page} y quiero Pack Adopción BI / diagnóstico.`;
  } else if (opts.intent === "empresas") {
    text = `Hola, vengo de ${page} y quiero cotizar una capacitación para mi equipo.`;
  } else if (opts.intent === "curso") {
    text = `Hola, vengo de ${page} y quiero cotizar el curso ${opts.course || ""}.`.trim();
  } else if (opts.intent === "fechas") {
    text = `Hola, vengo de ${page} y quiero consultar fechas del curso ${opts.course || ""}.`.trim();
  } else {
    text = `Hola, vengo de ${page} y quiero más información.`;
  }
  if (opts.extra) text = `${text} ${opts.extra}`;
  return `https://wa.me/${PACK.whatsappE164}?text=${encodeURIComponent(text)}`;
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
