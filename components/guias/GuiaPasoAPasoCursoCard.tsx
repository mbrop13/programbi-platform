import Link from "next/link";
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
  guia: Pick<GuiaPasoAPaso, "slug" | "h1" | "curso">;
  curso: DatosCursoGuia;
  cursoSecundario?: { slug: string; nombre: string } | null;
  sticky?: boolean;
  ctaPosition?: string;
}) {
  const waText = `Hola, vengo de la guía ${guia.h1} y quiero la clase gratis del curso de ${curso.nombre} [${guia.slug}]`;

  return (
    <aside
      aria-label={`Curso de ${curso.nombre}`}
      className={`rounded-lg border border-[var(--g-border)] bg-[var(--g-surface)] p-5 ${
        sticky ? "sticky top-[var(--sticky-below-nav,6rem)]" : ""
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--g-accent)]">
        Clase gratis disponible
      </p>

      <h3 className="mt-2 text-base font-bold leading-snug tracking-[-0.015em] text-[var(--g-ink)]">
        Curso de {curso.nombre}
      </h3>

      {curso.descripcionCorta ? (
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[var(--g-muted)]">
          {curso.descripcionCorta}
        </p>
      ) : null}

      <p className="mt-3 font-mono text-xs tabular-nums text-[var(--g-subtle)]">
        {curso.horas} horas en vivo
        {curso.textoCuotas ? ` · ${curso.textoCuotas}` : ""}
      </p>

      <ul className="mt-3 space-y-1.5 border-t border-[var(--g-border)] pt-3 text-xs leading-snug text-[var(--g-muted)]">
        {curso.temarioBullets.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span aria-hidden="true" className="font-mono text-[var(--g-subtle)]">
              -
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {curso.precioFormateado ? (
        <div className="mt-4 flex items-baseline gap-2 border-t border-[var(--g-border)] pt-3 tabular-nums">
          <span className="text-lg font-bold tracking-tight text-[var(--g-ink)]">
            {curso.precioFormateado}
          </span>
          {curso.precioListaFormateado ? (
            <span className="text-xs text-[var(--g-subtle)] line-through">
              {curso.precioListaFormateado}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 flex flex-col gap-2">
        <WhatsAppCta
          page={`/guias/${guia.slug}`}
          intent="curso"
          course={curso.nombre}
          courseSlug={guia.curso}
          country="cl"
          ctaPosition={ctaPosition}
          customText={waText}
          className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-[var(--g-ink)] px-4 text-center text-xs font-semibold text-[var(--g-surface)] no-underline transition-opacity hover:opacity-90"
        >
          Solicitar clase gratis por WhatsApp
        </WhatsAppCta>

        <Link
          href={`/cursos/${guia.curso}`}
          className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-4 text-xs font-semibold text-[var(--g-ink)] no-underline transition-colors hover:border-[var(--g-ink)]"
        >
          Ver temario del curso
        </Link>

        {cursoSecundario ? (
          <Link
            href={`/cursos/${cursoSecundario.slug}`}
            className="mt-1 text-center text-xs font-medium text-[var(--g-muted)] underline decoration-[var(--g-border-strong)] underline-offset-4 transition-colors hover:text-[var(--g-ink)]"
          >
            También te sirve: Curso de {cursoSecundario.nombre}
          </Link>
        ) : null}

        <Link
          href={`/registro?from=/guias/${guia.slug}`}
          className="mt-0.5 inline-flex min-h-[44px] items-center justify-center text-xs font-semibold text-[var(--g-accent)] underline decoration-[var(--g-border-strong)] underline-offset-4 hover:text-[var(--g-ink)] lg:min-h-[36px]"
        >
          Inscribirme en el curso
        </Link>
      </div>
    </aside>
  );
}
