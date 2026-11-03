"use client";

import { useEffect, useState } from "react";
import { trackWhatsAppClick } from "@/lib/analytics/marketing";
import { whatsappHref, withPageUtms, type WhatsAppIntent } from "@/lib/whatsapp";
import { usePaisRuta } from "@/lib/paises/cliente";

/**
 * Botón/link reutilizable de WhatsApp con mensaje precargado.
 * Incluye el curso (si se pasa) y el país del visitante, tomado de la ruta
 * (/ar, /mx, …) o del prop `country`.
 */
export default function WhatsAppCta({
  page,
  intent = "pack",
  course,
  courseSlug,
  country,
  children,
  className,
}: {
  page: string;
  intent?: WhatsAppIntent;
  /** Nombre visible del curso que va en el mensaje. */
  course?: string;
  /** Slug del curso, solo para analytics. */
  courseSlug?: string;
  /** Fuerza un país (ISO o nombre). Por defecto se detecta desde la ruta. */
  country?: string | null;
  children: React.ReactNode;
  className?: string;
}) {
  const paisRuta = usePaisRuta();
  const resolvedCountry = country?.trim() || paisRuta;
  const base = whatsappHref({
    page,
    intent,
    course,
    country: resolvedCountry,
  });
  const [href, setHref] = useState(base);

  useEffect(() => {
    setHref(withPageUtms(base));
  }, [base]);

  const handleClick = () => {
    const currentPath =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : page;
    const slug =
      courseSlug || currentPath.match(/\/cursos\/([^/?#]+)/)?.[1] || undefined;
    trackWhatsAppClick({
      course: slug,
      country: resolvedCountry,
      page: currentPath,
    });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-wa-tracked="true"
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
