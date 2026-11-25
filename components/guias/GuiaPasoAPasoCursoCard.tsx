import Link from "next/link";
import { GuiaToolVisual } from "@/components/guias/GuiaEditorialPrimitives";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { OFERTA_CLASE_GRATIS_WHATSAPP } from "@/config/flags";
import type { DatosCursoGuia } from "@/lib/guias/paso-a-paso-curso";
import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export default function GuiaPasoAPasoCursoCard({
  guia,
  curso,
  cursoSecundario = null,
  cursosSecundarios = [],
  sticky = false,
  ctaPosition = "guia_paso_a_paso_lateral",
}: {
  guia: Pick<GuiaPasoAPaso, "slug" | "h1" | "curso" | "pais"> & { herramienta?: string };
  curso: DatosCursoGuia;
  cursoSecundario?: { slug: string; nombre: string } | null;
  cursosSecundarios?: Array<{ slug: string; nombre: string }>;
  sticky?: boolean;
  ctaPosition?: string;
}) {
  const pais = guia.pais ?? "cl";
  const prefijo = pais === "cl" ? "" : `/${pais}`;
  const guiaPath = `${prefijo}/guias/${guia.slug}`;
  const waText = OFERTA_CLASE_GRATIS_WHATSAPP
    ? `Hola, vengo de la guía ${guia.h1} y quiero la clase gratis del curso de ${curso.nombre} [${guia.slug}]`
    : `Hola, vengo de la guía ${guia.h1} y quiero información del curso de ${curso.nombre} [${guia.slug}]`;
  const secundarios = [
    ...(cursoSecundario ? [cursoSecundario] : []),
    ...cursosSecundarios,
  ].filter(
    (item, idx, arr) =>
      item.slug !== guia.curso &&
      arr.findIndex((other) => other.slug === item.slug) === idx
  );

  return (
    <aside
      aria-label={`Curso de ${curso.nombre}`}
      className={`rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-4 shadow-[var(--g-card-shadow)] sm:p-5 ${
        sticky ? "sticky top-[var(--sticky-below-nav,6rem)]" : ""
      }`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        {OFERTA_CLASE_GRATIS_WHATSAPP ? (
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--g-accent)]">
            {pais === "pe" ? "Clase gratis coordinada por WhatsApp" : "Clase gratis disponible"}
          </p>
        ) : (
          <span />
        )}
        {curso.precioFormateado ? (
          <div className="flex items-baseline gap-1.5 tabular-nums">
            <span className="text-base font-bold tracking-tight text-[var(--g-ink)]">
              {curso.precioFormateado}
            </span>
            {curso.precioListaFormateado ? (
              <span className="text-[11px] text-[var(--g-subtle)] line-through">
                {curso.precioListaFormateado}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-2 flex items-center gap-2.5">
        <GuiaToolVisual tool={guia.herramienta} course={guia.curso} size="sm" />
        <h3 className="min-w-0 text-base font-bold leading-snug tracking-[-0.015em] text-[var(--g-ink)]">
          Curso de {curso.nombre}
        </h3>
      </div>

      {curso.descripcionCorta ? (
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--g-muted)]">
          {curso.descripcionCorta}
        </p>
      ) : null}

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 border-y border-[var(--g-border)] py-2 font-mono text-[11px] tabular-nums text-[var(--g-subtle)]">
        <span>{curso.horas} horas en vivo</span>
        {curso.textoCuotas ? (
          <span className="truncate text-right">{curso.textoCuotas}</span>
        ) : null}
      </div>

      <ul className="mt-3 grid grid-cols-1 gap-x-3 gap-y-1.5 text-xs leading-snug text-[var(--g-muted)] sm:grid-cols-2">
        {curso.temarioBullets.map((item) => (
          <li key={item} className="flex items-start gap-1.5">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--g-accent)]"
            >
              <path
                d="M3.5 8.5l3 3 6-6.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-col gap-2">
        <WhatsAppCta
          page={guiaPath}
          intent="curso"
          course={curso.nombre}
          courseSlug={guia.curso}
          country={pais}
          ctaPosition={ctaPosition}
          customText={waText}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[var(--g-ink)] px-4 text-center text-xs font-semibold text-[var(--g-surface)] no-underline transition-opacity hover:opacity-90"
        >
          {OFERTA_CLASE_GRATIS_WHATSAPP
            ? "Solicitar clase gratis por WhatsApp"
            : "Consultar por WhatsApp"}
        </WhatsAppCta>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`${prefijo}/cursos/${guia.curso}`}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-3 text-center text-xs font-semibold text-[var(--g-ink)] no-underline transition-colors hover:border-[var(--g-ink)]"
          >
            {pais === "cl" ? "Ver temario" : "Temario y precios"}
          </Link>

          <Link
            href={`/registro?from=${guiaPath}`}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[var(--g-border)] bg-[var(--g-wash)] px-3 text-center text-xs font-semibold text-[var(--g-accent)] no-underline transition-colors hover:border-[var(--g-border-strong)] hover:text-[var(--g-ink)]"
          >
            Inscribirme
          </Link>
        </div>

        {secundarios.length === 1 ? (
          <Link
            href={`${prefijo}/cursos/${secundarios[0].slug}`}
            className="mt-0.5 inline-flex min-h-[44px] items-center justify-center text-center text-xs font-medium text-[var(--g-muted)] underline decoration-[var(--g-border-strong)] underline-offset-4 transition-colors hover:text-[var(--g-ink)] sm:min-h-[36px]"
          >
            También te sirve: Curso de {secundarios[0].nombre}
          </Link>
        ) : secundarios.length > 1 ? (
          <div className="mt-1 border-t border-[var(--g-border)] pt-2.5">
            <p className="text-center text-[11px] font-medium text-[var(--g-subtle)]">
              También te sirven:
            </p>
            <div className="mt-1.5 flex flex-wrap justify-center gap-1.5">
              {secundarios.map((sec) => (
                <Link
                  key={sec.slug}
                  href={`${prefijo}/cursos/${sec.slug}`}
                  className="inline-flex min-h-[36px] items-center rounded-lg border border-[var(--g-border)] bg-[var(--g-bg)] px-2.5 text-xs font-medium text-[var(--g-muted)] no-underline transition-colors hover:border-[var(--g-border-strong)] hover:text-[var(--g-ink)]"
                >
                  {sec.nombre}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
