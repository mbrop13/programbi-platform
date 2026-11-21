import Link from "next/link";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
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
      className={`overflow-hidden rounded-2xl border border-line-strong bg-paper p-5 shadow-sm ${
        sticky ? "sticky top-[var(--sticky-below-nav,6rem)]" : ""
      }`}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-bold text-canvas">
          Clase gratis
        </span>
        {curso.textoCuotas ? (
          <span className="inline-flex items-center rounded-full border border-line-strong bg-wash px-2.5 py-0.5 text-[11px] font-semibold text-ink">
            {curso.textoCuotas}
          </span>
        ) : null}
      </div>

      <h3 className="mt-3 text-base font-bold leading-snug tracking-tight text-ink">
        ¿Te gustaría aprender a hacer esto y mucho más?
      </h3>

      {curso.descripcionCorta ? (
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-mute">
          {curso.descripcionCorta}
        </p>
      ) : null}

      <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-mute">
        Curso de {curso.nombre} ({curso.horas}h en vivo)
      </p>

      <ul className="mt-2 space-y-1.5 text-xs leading-snug text-ink">
        {curso.temarioBullets.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Check size={14} className="mt-0.5 shrink-0 text-ink" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {curso.precioFormateado ? (
        <div className="mt-4 flex items-baseline gap-2 border-t border-line pt-3">
          <span className="text-lg font-bold tracking-tight text-ink">
            {curso.precioFormateado}
          </span>
          {curso.precioListaFormateado ? (
            <span className="text-xs text-faint line-through">
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
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-4 text-center text-xs font-semibold text-canvas no-underline transition-transform active:scale-[0.99]"
        >
          <MessageCircle size={15} aria-hidden />
          Quiero mi clase gratis
        </WhatsAppCta>

        <Link
          href={`/cursos/${guia.curso}`}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-line-strong bg-canvas px-4 text-xs font-semibold text-ink no-underline hover:bg-wash"
        >
          Ver el curso
          <ArrowRight size={13} aria-hidden />
        </Link>

        {cursoSecundario ? (
          <Link
            href={`/cursos/${cursoSecundario.slug}`}
            className="mt-0.5 text-center text-xs font-medium text-mute underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink"
          >
            También te sirve: Curso de {cursoSecundario.nombre}
          </Link>
        ) : null}

        <Link
          href={`/registro?from=/guias/${guia.slug}`}
          className="mt-0.5 inline-flex h-8 items-center justify-center text-xs font-semibold text-ink underline underline-offset-4 hover:text-mute"
        >
          Inscribirme en el curso
        </Link>
      </div>
    </aside>
  );
}
