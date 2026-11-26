import Link from "next/link";
import WhatsAppCta from "@/components/marketing/WhatsAppCta";
import { OFERTA_CLASE_GRATIS_WHATSAPP } from "@/config/flags";
import type { DatosCursoGuia } from "@/lib/guias/paso-a-paso-curso";
import type { PaisGuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

interface Props {
  slugGuia: string;
  h1: string;
  cursoSlug: string;
  curso: DatosCursoGuia;
  pais: PaisGuiaPasoAPaso;
  ctaPosition: string;
}

function textoWhatsApp({ h1, slugGuia, curso }: Pick<Props, "h1" | "slugGuia" | "curso">) {
  return OFERTA_CLASE_GRATIS_WHATSAPP
    ? `Hola, vengo de la guía ${h1} y quiero la clase gratis del curso de ${curso.nombre} [${slugGuia}]`
    : `Hola, vengo de la guía ${h1} y quiero información del curso de ${curso.nombre} [${slugGuia}]`;
}

/** Tarjeta lateral del curso: una sola acción principal y el temario como secundaria. */
export function GuiaCursoLateral(props: Props) {
  const { curso, pais, cursoSlug, ctaPosition } = props;
  const prefijo = pais === "cl" ? "" : `/${pais}`;
  const ruta = `${prefijo}/guias/${props.slugGuia}`;

  return (
    <aside
      aria-label={`Curso de ${curso.nombre}`}
      className="rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-5"
    >
      <p className="text-sm font-medium text-[var(--g-muted)]">Curso en vivo</p>
      <p className="mt-1 text-lg leading-snug font-bold tracking-[-0.015em] text-[var(--g-ink)]">
        {curso.nombre}
      </p>
      {curso.descripcionCorta ? (
        <p className="mt-2 text-sm leading-relaxed text-[var(--g-muted)]">{curso.descripcionCorta}</p>
      ) : null}
      <p className="mt-3 text-sm text-[var(--g-ink)] tabular-nums">
        {curso.horas} horas en vivo
        {curso.textoCuotas ? <span className="text-[var(--g-muted)]"> · {curso.textoCuotas}</span> : null}
      </p>
      {curso.precioFormateado ? (
        <p className="mt-1 flex items-baseline gap-2 tabular-nums">
          <span className="text-base font-bold text-[var(--g-ink)]">{curso.precioFormateado}</span>
          {curso.precioListaFormateado ? (
            <span className="text-xs text-[var(--g-subtle)] line-through">{curso.precioListaFormateado}</span>
          ) : null}
        </p>
      ) : null}

      <div className="mt-4 flex flex-col gap-2">
        <WhatsAppCta
          page={ruta}
          intent="curso"
          course={curso.nombre}
          courseSlug={cursoSlug}
          country={pais}
          ctaPosition={ctaPosition}
          customText={textoWhatsApp(props)}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--g-ink)] px-4 text-center text-sm font-semibold text-[var(--g-surface)] no-underline transition-opacity hover:opacity-90"
        >
          {OFERTA_CLASE_GRATIS_WHATSAPP ? "Pedir clase gratis" : "Consultar por WhatsApp"}
        </WhatsAppCta>
        <Link
          href={`${prefijo}/cursos/${cursoSlug}`}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--g-border-strong)] px-4 text-sm font-semibold text-[var(--g-ink)] no-underline transition-colors hover:border-[var(--g-ink)]"
        >
          Ver temario
        </Link>
      </div>
    </aside>
  );
}

/** Cierre del artículo: el siguiente paso natural después de terminar la guía. */
export function GuiaCursoCierre({
  secundarios,
  ...props
}: Props & { secundarios: { slug: string; nombre: string }[] }) {
  const { curso, pais, cursoSlug, ctaPosition } = props;
  const prefijo = pais === "cl" ? "" : `/${pais}`;
  const ruta = `${prefijo}/guias/${props.slugGuia}`;

  return (
    <section
      aria-labelledby="sigue-aprendiendo-titulo"
      className="rounded-3xl bg-[var(--g-ink)] p-6 text-[var(--g-surface)] sm:p-8"
    >
      <h2 id="sigue-aprendiendo-titulo" className="text-2xl font-bold tracking-[-0.02em] text-balance">
        Aprende {curso.nombre} con un profesor, en vivo
      </h2>
      <p className="mt-2 max-w-[56ch] text-base leading-relaxed opacity-80">
        {curso.descripcionCorta || `Clases prácticas por Zoom sobre ${curso.nombre}, con grabación de cada sesión.`}
      </p>
      <p className="mt-3 text-sm tabular-nums opacity-80">
        {curso.horas} horas en vivo
        {curso.textoCuotas ? ` · ${curso.textoCuotas}` : ""}
        {curso.precioFormateado ? ` · ${curso.precioFormateado}` : ""}
      </p>
      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
        <WhatsAppCta
          page={ruta}
          intent="curso"
          course={curso.nombre}
          courseSlug={cursoSlug}
          country={pais}
          ctaPosition={ctaPosition}
          customText={textoWhatsApp(props)}
          className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--g-surface)] px-6 text-sm font-semibold text-[var(--g-ink)] no-underline transition-opacity hover:opacity-90"
        >
          {OFERTA_CLASE_GRATIS_WHATSAPP ? "Pedir clase gratis por WhatsApp" : "Consultar por WhatsApp"}
        </WhatsAppCta>
        <Link
          href={`${prefijo}/cursos/${cursoSlug}`}
          className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-current/30 px-6 text-sm font-semibold text-[var(--g-surface)] no-underline transition-colors hover:border-current"
        >
          Ver temario del curso
        </Link>
      </div>
      {secundarios.length > 0 ? (
        <p className="mt-5 text-sm opacity-80">
          También te puede servir:{" "}
          {secundarios.map((s, i) => (
            <span key={s.slug}>
              {i > 0 ? ", " : ""}
              <Link
                href={`${prefijo}/cursos/${s.slug}`}
                className="font-semibold text-[var(--g-surface)] underline underline-offset-4"
              >
                {s.nombre}
              </Link>
            </span>
          ))}
        </p>
      ) : null}
    </section>
  );
}
