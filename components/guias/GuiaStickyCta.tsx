"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MessageCircle, X } from "lucide-react";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { courses } from "@/lib/data/courses";
import { rutaFichaCurso } from "@/lib/guias/curso";

/** Se cierra por sesión, para no perseguir al usuario por todo el sitio. */
const CLAVE_CIERRE = "programbi:guia-sticky:cerrado";

/**
 * Barra fija inferior para mobile. Aparece recién cuando el usuario avanzó en
 * la guía y desaparece cuando entra el footer, para no taparlo.
 */
export default function GuiaStickyCta({
  iso,
  course,
  guiaSlug,
}: {
  iso: string;
  course: string;
  guiaSlug?: string;
}) {
  const [pasoUmbral, setPasoUmbral] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [cerrada, setCerrada] = useState(false);
  const frame = useRef<number | null>(null);
  const clave = `${CLAVE_CIERRE}:${course}`;

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(clave) === "1") setCerrada(true);
    } catch {
      /* sessionStorage puede estar bloqueado: la barra simplemente vuelve a salir. */
    }
  }, [clave]);

  useEffect(() => {
    if (cerrada) return;

    const actualizar = () => {
      frame.current = null;
      setPasoUmbral(window.scrollY > Math.max(360, window.innerHeight * 0.55));
    };
    const onScroll = () => {
      if (frame.current == null) frame.current = window.requestAnimationFrame(actualizar);
    };

    actualizar();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame.current != null) window.cancelAnimationFrame(frame.current);
    };
  }, [cerrada]);

  useEffect(() => {
    if (cerrada || typeof IntersectionObserver === "undefined") return;

    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), {
      rootMargin: "0px 0px -64px 0px",
    });
    observer.observe(footer);
    return () => observer.disconnect();
  }, [cerrada]);

  const visible = !cerrada && pasoUmbral && !footerVisible;
  const curso = courses.find((item) => item.slug === course);
  const ruta = rutaFichaCurso(iso, course);
  const esVsExcel = guiaSlug === "power-bi-vs-excel";

  const cerrar = () => {
    setCerrada(true);
    try {
      window.sessionStorage.setItem(clave, "1");
    } catch {
      /* sin sessionStorage, el cierre vale solo para esta vista. */
    }
  };

  return (
    <div
      role="region"
      aria-label="Inscripción al curso"
      data-testid="guia-sticky-cta"
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-[var(--g-border-strong)] bg-[var(--g-surface)] px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 transition-transform duration-200 ease-out motion-reduce:transition-none md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-stretch gap-2">
        <Link
          href={ruta}
          className="inline-flex h-12 flex-1 items-center justify-center rounded-lg bg-[var(--g-accent)] text-sm font-semibold text-[var(--g-accent-ink)] no-underline transition-opacity hover:opacity-95"
        >
          Inscribirme
        </Link>
        <WhatsAppCta
          page={esVsExcel ? "/guias/power-bi-vs-excel" : ruta}
          intent="curso"
          course={curso?.title || "Power BI"}
          courseSlug={course}
          country={iso}
          customText={
            esVsExcel
              ? "Hola, vengo de la guía Power BI vs Excel y quiero la clase gratis del curso de Power BI [power-bi-vs-excel]"
              : undefined
          }
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--g-border-strong)] bg-[var(--g-bg)] text-sm font-semibold text-[var(--g-ink)] no-underline transition-colors hover:bg-[var(--g-wash)]"
        >
          <MessageCircle size={16} aria-hidden />
          {esVsExcel ? "Clase gratis" : "WhatsApp"}
        </WhatsAppCta>
        <button
          type="button"
          onClick={cerrar}
          aria-label="Cerrar la barra de inscripción"
          className="inline-flex h-12 w-11 shrink-0 items-center justify-center rounded-lg text-[var(--g-muted)] transition-colors hover:bg-[var(--g-wash)] hover:text-[var(--g-ink)] motion-reduce:transition-none"
        >
          <X size={18} aria-hidden />
        </button>
      </div>
    </div>
  );
}
