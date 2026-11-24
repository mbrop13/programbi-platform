"use client";

import { type MouseEvent, useEffect, useState } from "react";
import { Check, Copy, Download, MessageCircle } from "lucide-react";
import { OFERTA_CLASE_GRATIS_WHATSAPP } from "@/config/flags";
import { trackEvent, trackEventOnce, trackWhatsAppClick } from "@/lib/analytics/marketing";
import { whatsappHref, withPageUtms } from "@/lib/whatsapp";
import estilos from "./Observatorio.module.css";

export function VistaDatos({ territorio, periodo }: { territorio: string; periodo: string }) {
  useEffect(() => {
    trackEventOnce(`observatorio:${territorio}:${periodo}`, "datos_view", {
      seccion: "desempleo", territorio, periodo,
    });
  }, [territorio, periodo]);
  return null;
}

export function EnlaceDatos({ texto, href, formato, territorio }: {
  texto: string;
  href: string;
  formato: "csv" | "xlsx" | "pbix";
  territorio: string;
}) {
  return (
    <a className={estilos.botonClaro} href={href} download onClick={() => {
      trackEvent("datos_download", { formato, territorio });
    }}>
      <Download size={16} aria-hidden="true" /> {texto}
    </a>
  );
}

export function CopiarDatos({ texto, etiqueta, territorio, powerQuery = false }: {
  texto: string; etiqueta: string; territorio: string; powerQuery?: boolean;
}) {
  const [estado, setEstado] = useState<"listo" | "copiado" | "error">("listo");
  return (
    <div className={estilos.copiarAccion}>
      <button type="button" className={estilos.botonClaro} onClick={async () => {
        try {
          await navigator.clipboard.writeText(texto);
          setEstado("copiado");
          if (powerQuery) trackEvent("datos_download", { formato: "pq_snippet", territorio });
        } catch {
          setEstado("error");
        }
      }}>
        {estado === "copiado" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        {etiqueta}
      </button>
      <span aria-live="polite">
        {estado === "copiado" && "Copiado."}
        {estado === "error" && "Selecciona el texto y cópialo manualmente."}
      </span>
    </div>
  );
}

export function WhatsAppDesempleoCta({ slug }: { slug: string }) {
  const pagePath = slug === "nacional" ? "/datos/desempleo" : `/datos/desempleo/${slug}`;
  const customText = OFERTA_CLASE_GRATIS_WHATSAPP
    ? `Hola, soy de Chile y vengo de ${pagePath}. Quiero consultar o solicitar una clase gratis de los cursos de datos.`
    : `Hola, soy de Chile y vengo de ${pagePath}. Quiero más información sobre los cursos de datos.`;
  const waBase = whatsappHref({ page: pagePath, country: "cl", customText });
  const posicion = slug === "nacional" ? "datos_desempleo" : "datos_desempleo_region";

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const hrefConUtm = withPageUtms(waBase);
    e.currentTarget.href = hrefConUtm;

    trackWhatsAppClick({
      cta_position: posicion,
      cta_location: posicion,
      course_slug: "analisis-de-datos",
      country: "cl",
      page: pagePath,
      page_path: pagePath,
      href: hrefConUtm,
    });
  };

  return (
    <a
      className={estilos.botonCursoWa}
      href={waBase}
      target="_blank"
      rel="noopener noreferrer"
      data-wa-tracked="1"
      onClick={handleClick}
    >
      <MessageCircle size={16} aria-hidden="true" />
      {OFERTA_CLASE_GRATIS_WHATSAPP ? "Pedir clase gratis por WhatsApp" : "Consultar por WhatsApp"}
    </a>
  );
}
