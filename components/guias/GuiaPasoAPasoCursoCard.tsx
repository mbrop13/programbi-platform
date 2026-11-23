import Link from "next/link";
import { GuiaToolVisual } from "@/components/guias/GuiaEditorialPrimitives";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import type { DatosCursoGuia } from "@/lib/guias/paso-a-paso-curso";
import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export default function GuiaPasoAPasoCursoCard({
  guia,
  curso,
  cursoSecundario = null,
  sticky = false,
  ctaPosition = "guia_paso_a_paso_lateral",
}: {
  guia: Pick<GuiaPasoAPaso, "slug" | "h1" | "curso"> & { herramienta?: string };
  curso: DatosCursoGuia;
  cursoSecundario?: { slug: string; nombre: string } | null;
  sticky?: boolean;
  ctaPosition?: string;
}) {
  const waText = `Hola, vengo de la guía ${guia.h1} y quiero la clase gratis del curso de ${curso.nombre} [${guia.slug}]`;

  return (
    <aside
      aria-label={`Curso de ${curso.nombre}`}
      className={`rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-4 shadow-[var(--g-card-shadow)] sm:p-5 ${
        sticky ? "sticky top-[var(--sticky-below-nav,6rem)]" : ""
      }`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--g-accent)]">
          Clase gratis disponible
        </p>
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
          page={`/guias/${guia.slug}`}
          intent="curso"
          course={curso.nombre}
          courseSlug={guia.curso}
          country="cl"
          ctaPosition={ctaPosition}
          customText={waText}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[var(--g-ink)] px-4 text-center text-xs font-semibold text-[var(--g-surface)] no-underline transition-opacity hover:opacity-90"
        >
          Solicitar clase gratis por WhatsApp
        </WhatsAppCta>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/cursos/${guia.curso}`}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-3 text-center text-xs font-semibold text-[var(--g-ink)] no-underline transition-colors hover:border-[var(--g-ink)]"
          >
            Ver temario
          </Link>

          <Link
            href={`/registro?from=/guias/${guia.slug}`}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[var(--g-border)] bg-[var(--g-wash)] px-3 text-center text-xs font-semibold text-[var(--g-accent)] no-underline transition-colors hover:border-[var(--g-border-strong)] hover:text-[var(--g-ink)]"
          >
            Inscribirme
          </Link>
        </div>

        {cursoSecundario ? (
          <Link
            href={`/cursos/${cursoSecundario.slug}`}
            className="mt-0.5 inline-flex min-h-[44px] items-center justify-center text-center text-xs font-medium text-[var(--g-muted)] underline decoration-[var(--g-border-strong)] underline-offset-4 transition-colors hover:text-[var(--g-ink)] sm:min-h-[36px]"
          >
            También te sirve: Curso de {cursoSecundario.nombre}
          </Link>
        ) : null}
      </div>
    </aside>
  );
}
