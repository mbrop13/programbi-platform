"use client";

import { useEffect, useState } from "react";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";

import type { PaisGuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export default function GuiaPasoAPasoStickyWa({
  slug,
  h1,
  cursoSlug,
  cursoNombre,
  pais = "cl",
}: {
  slug: string;
  h1: string;
  cursoSlug: string;
  cursoNombre: string;
  pais?: PaisGuiaPasoAPaso;
}) {
  const [cerrada, setCerrada] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    if (cerrada || typeof IntersectionObserver === "undefined") return;
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, [cerrada]);

  const visible = !cerrada && !footerVisible;
  const waText = `Hola, vengo de la guía ${h1} y quiero la clase gratis del curso de ${cursoNombre} [${slug}]`;
  const pagePath = pais === "cl" ? `/guias/${slug}` : `/${pais}/guias/${slug}`;

  return (
    <div
      role="region"
      aria-label="Clase gratis por WhatsApp"
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-[var(--g-border-strong)] bg-[var(--g-surface)] px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[var(--g-card-shadow)] transition-transform duration-200 ease-out motion-reduce:transition-none lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-md items-center gap-2">
        <WhatsAppCta
          page={pagePath}
          intent="curso"
          course={cursoNombre}
          courseSlug={cursoSlug}
          country={pais}
          ctaPosition="guia_paso_a_paso_sticky_mobile"
          customText={waText}
          className="inline-flex min-h-[44px] min-w-0 flex-1 items-center justify-center rounded-xl bg-[var(--g-ink)] px-4 text-sm font-semibold text-[var(--g-surface)] no-underline transition-opacity hover:opacity-90"
        >
          <span className="truncate">Clase gratis por WhatsApp</span>
        </WhatsAppCta>
        <button
          type="button"
          onClick={() => setCerrada(true)}
          aria-label="Cerrar barra de clase gratis por WhatsApp"
          className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-[var(--g-border)] bg-[var(--g-bg)] text-sm font-medium text-[var(--g-muted)] transition-colors hover:bg-[var(--g-wash)] hover:text-[var(--g-ink)]"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </div>
  );
}
